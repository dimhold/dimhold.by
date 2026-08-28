/* «Ката пячы» — the room, synthesised.
 *
 * The section ships no audio files, so every crackle here is nodes. That is a
 * constraint, not an aesthetic: what it buys is that the page stays the same
 * weight with the sound on as with it off, and what it costs is that nothing
 * can be sampled — a fire has to be argued for out of noise and filters.
 *
 * Shape of it: everything lands on one master gain, through one gentle lowpass
 * that stands in for a wooden room, with a short dark delay behind it so cues
 * have a wall to come off. Nothing connects to `destination` directly except
 * those two, which is what makes `hush()` a single fade rather than a sweep of
 * every live node.
 *
 * Silence is the default and the safe state. Off, or with no AudioContext to
 * be had, every method here does nothing at all and none of them throws: a
 * browser that refuses audio must not take the game down with it.
 *
 * Envelopes are exponential with a 0.0001 floor at both ends — a ramp to zero
 * is illegal and a ramp from zero is a click, and one of those is a crash and
 * the other is worse.
 */
import type { Ambient, Cue, Sound } from './types.ts';

/* ------------------------------------------------------------- numbers --- */

const KEY = 'kata-sound';

const MASTER = 0.9;
/** The room: a wooden one at night, not a studio. */
const ROOM_HZ = 4200;
const ROOM_Q = 0.5;
/** How much of the master goes round the wall and comes back. */
const SEND = 0.14;
const SEND_MS = 47;
const SEND_FB = 0.26;
const SEND_HZ = 1900;

/** The exponential floor. Everything starts and ends here. */
const ZERO = 0.0001;

/** Bed loudness before `level()` scales it. Beds sit under the cues, always. */
const BED: Record<Ambient, number> = { fire: 0.22, wind: 0.15, crowd: 0.17 };
const BED_IN: Record<Ambient, number> = { fire: 0.7, wind: 0.8, crowd: 0.5 };
const BED_OUT = 0.4;

/** Mean gap between fire crackles, ms, drawn exponentially so they clump the
 *  way real ones do rather than ticking like a metronome. */
const CRACKLE_MEAN = 300;
const CRACKLE_MIN = 80;

/* ----------------------------------------------------------------- api --- */

export interface KataSound extends Sound {
  /**
   * Weight for one bed, 0..1, on top of its own level. The crowd comes up as
   * act II gathers and the fire drops back when the room dims; the director
   * owns those curves because it owns the acts.
   */
  level(a: Ambient, v: number): void;
}

interface ToneSpec {
  at: number;
  type?: OscillatorType;
  from: number;
  /** Omitted holds the pitch. */
  to?: number;
  dur: number;
  peak: number;
  attack?: number;
  dest?: AudioNode;
}

interface HissSpec {
  at: number;
  dur: number;
  peak: number;
  filter?: BiquadFilterType;
  from: number;
  to?: number;
  q?: number;
  attack?: number;
  /** Brown noise where it should sound like air or embers, white where it
   *  should sound like a crust breaking. */
  brown?: boolean;
  dest?: AudioNode;
}

interface Bed {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  /** Crackle scheduler, 0 when the bed has none. */
  timer: number;
}

export function createSound(): KataSound {
  let on = false;
  try {
    on = localStorage.getItem(KEY) === 'on';
  } catch {
    /* private mode: silent, and that is the safer default */
  }

  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let brown: AudioBuffer | null = null;
  let white: AudioBuffer | null = null;

  const beds: Partial<Record<Ambient, Bed>> = {};
  const levels: Record<Ambient, number> = { fire: 1, wind: 1, crowd: 1 };

  /* -------------------------------------------------------- the plumbing --- */

  /** Built on the first thing that wants to be heard, never at import: an
   *  AudioContext made before a gesture is one the browser leaves suspended. */
  function ensure(): boolean {
    if (ctx) return true;
    try {
      const AC =
        typeof AudioContext !== 'undefined'
          ? AudioContext
          : (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      const c = new AC();
      const m = c.createGain();
      m.gain.value = MASTER;

      const room = c.createBiquadFilter();
      room.type = 'lowpass';
      room.frequency.value = ROOM_HZ;
      room.Q.value = ROOM_Q;
      m.connect(room);
      room.connect(c.destination);

      /* A hand's width of wall behind everything. Short, dark and quiet
         enough that it reads as a room rather than as an effect. */
      const send = c.createGain();
      send.gain.value = SEND;
      const delay = c.createDelay(0.25);
      delay.delayTime.value = SEND_MS / 1000;
      const fb = c.createGain();
      fb.gain.value = SEND_FB;
      const dark = c.createBiquadFilter();
      dark.type = 'lowpass';
      dark.frequency.value = SEND_HZ;
      m.connect(send);
      send.connect(delay);
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(dark);
      dark.connect(c.destination);

      ctx = c;
      master = m;
    } catch {
      ctx = null;
      master = null;
      return false;
    }
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    return true;
  }

  /** Two seconds of noise, normalised. Brown is the integral of white, which
   *  is why it needs the normalising and white does not. */
  function makeNoise(brownish: boolean): AudioBuffer | null {
    if (!ctx) return null;
    const len = Math.floor(ctx.sampleRate * 2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    let peak = ZERO;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (brownish) {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last;
      } else {
        d[i] = w;
      }
      const a = d[i] < 0 ? -d[i] : d[i];
      if (a > peak) peak = a;
    }
    if (brownish) {
      const g = 0.9 / peak;
      for (let i = 0; i < len; i++) d[i] *= g;
    }
    return buf;
  }

  function noiseSource(brownish: boolean, loop: boolean): AudioBufferSourceNode | null {
    if (!ctx) return null;
    if (brownish) brown ??= makeNoise(true);
    else white ??= makeNoise(false);
    const buf = brownish ? brown : white;
    if (!buf) return null;
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.loop = loop;
    if (loop) s.playbackRate.value = 0.85 + Math.random() * 0.3;
    return s;
  }

  /** attack up, decay down, both exponential, both off the floor. */
  function shape(g: AudioParam, at: number, peak: number, attack: number, dur: number) {
    g.setValueAtTime(ZERO, at);
    g.exponentialRampToValueAtTime(Math.max(peak, ZERO * 2), at + attack);
    g.exponentialRampToValueAtTime(ZERO, at + Math.max(dur, attack + 0.01));
  }

  function tone(s: ToneSpec) {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = s.type ?? 'sine';
    osc.frequency.setValueAtTime(s.from, s.at);
    if (s.to !== undefined && s.to !== s.from) osc.frequency.exponentialRampToValueAtTime(Math.max(s.to, 1), s.at + s.dur);
    shape(g.gain, s.at, s.peak, s.attack ?? 0.01, s.dur);
    osc.connect(g);
    g.connect(s.dest ?? master);
    osc.start(s.at);
    osc.stop(s.at + s.dur + 0.05);
  }

  function hiss(s: HissSpec) {
    if (!ctx || !master) return;
    const src = noiseSource(s.brown ?? false, false);
    if (!src) return;
    const f = ctx.createBiquadFilter();
    f.type = s.filter ?? 'bandpass';
    f.frequency.setValueAtTime(s.from, s.at);
    if (s.to !== undefined && s.to !== s.from) f.frequency.exponentialRampToValueAtTime(Math.max(s.to, 20), s.at + s.dur);
    f.Q.value = s.q ?? 1;
    const g = ctx.createGain();
    shape(g.gain, s.at, s.peak, s.attack ?? 0.008, s.dur);
    /* The buffer is two seconds long and the burst is a fraction of that, so
       it is started at a random offset — otherwise every crackle in the round
       is the same crackle. */
    src.connect(f);
    f.connect(g);
    g.connect(s.dest ?? master);
    src.start(s.at, Math.random() * 1.5, s.dur + 0.06);
    src.stop(s.at + s.dur + 0.06);
  }

  /* ------------------------------------------------------------- the cues --- */

  /** A struck note with a felt mallet: soft attack, a fifth above it for body,
   *  and a filter that closes as it decays. */
  function pluck(at: number, f: number, peak: number, dur: number) {
    if (!ctx || !master) return;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2800, at);
    lp.frequency.exponentialRampToValueAtTime(620, at + dur);
    lp.connect(master);
    tone({ at, type: 'triangle', from: f, to: f * 0.995, dur, peak, attack: 0.018, dest: lp });
    tone({ at: at + 0.006, type: 'sine', from: f * 1.5, dur: dur * 0.7, peak: peak * 0.34, attack: 0.014, dest: lp });
  }

  /** A dry muted knock. Two of them, close, is the warning. */
  function knock(at: number, peak: number) {
    tone({ at, type: 'triangle', from: 186, to: 148, dur: 0.055, peak, attack: 0.003 });
    hiss({ at, dur: 0.028, peak: peak * 0.4, filter: 'bandpass', from: 520, to: 380, q: 3, attack: 0.002 });
    hiss({ at, dur: 0.012, peak: peak * 0.24, filter: 'bandpass', from: 3200, q: 5, attack: 0.001 });
  }

  const CUES: Record<Cue, (t: number) => void> = {
    /* Dough hitting the board: no transient to speak of, all body. */
    knead: (t) => {
      tone({ at: t, type: 'sine', from: 150, to: 112, dur: 0.17, peak: 0.09, attack: 0.006 });
      tone({ at: t, type: 'sine', from: 86, to: 64, dur: 0.2, peak: 0.05, attack: 0.012 });
      hiss({ at: t, dur: 0.05, peak: 0.05, filter: 'lowpass', from: 900, to: 420, q: 0.8 });
    },
    /* The same thump, a finger's worth. */
    poke: (t) => {
      tone({ at: t, type: 'sine', from: 270, to: 196, dur: 0.075, peak: 0.07, attack: 0.004 });
      hiss({ at: t, dur: 0.03, peak: 0.045, filter: 'bandpass', from: 1900, to: 1300, q: 2.2, attack: 0.003 });
    },
    /* Iron door, then the draught the fire takes when it opens. */
    oven: (t) => {
      hiss({ at: t, dur: 0.06, peak: 0.09, filter: 'bandpass', from: 240, to: 190, q: 3, attack: 0.003 });
      hiss({ at: t + 0.05, dur: 0.46, peak: 0.085, filter: 'lowpass', from: 400, to: 1700, q: 0.8, attack: 0.2, brown: true });
      tone({ at: t + 0.05, type: 'sine', from: 190, to: 68, dur: 0.42, peak: 0.07, attack: 0.03 });
    },
    /* Underdone: heavy, no ring in it at all. */
    doneRaw: (t) => {
      tone({ at: t, type: 'sine', from: 300, to: 238, dur: 0.24, peak: 0.1, attack: 0.012 });
      tone({ at: t, type: 'sine', from: 150, to: 119, dur: 0.28, peak: 0.06, attack: 0.02 });
      hiss({ at: t, dur: 0.06, peak: 0.03, filter: 'lowpass', from: 500, to: 260, q: 0.7 });
    },
    /* The one reward the baking half hands out. Two partials and a low root:
       bell enough to be worth hitting, short enough never to be a jingle. */
    doneGolden: (t) => {
      tone({ at: t, type: 'triangle', from: 784, dur: 0.3, peak: 0.11, attack: 0.006 });
      tone({ at: t + 0.004, type: 'sine', from: 1176, dur: 0.36, peak: 0.055, attack: 0.006 });
      tone({ at: t, type: 'sine', from: 392, dur: 0.22, peak: 0.04, attack: 0.01 });
    },
    /* Charcoal: a rasp on the way down with the crust breaking over it. */
    doneBurnt: (t) => {
      tone({ at: t, type: 'sawtooth', from: 230, to: 92, dur: 0.3, peak: 0.075, attack: 0.008 });
      for (let i = 0; i < 5; i++) {
        hiss({
          at: t + 0.02 + i * 0.055 + Math.random() * 0.025,
          dur: 0.03,
          peak: 0.03 + Math.random() * 0.02,
          filter: 'bandpass',
          from: 2600 - i * 260,
          q: 7,
          attack: 0.002,
        });
      }
    },
    /* The cat goes up on the beam: two notes, a fourth apart, felt mallets. */
    hung: (t) => {
      pluck(t, 392, 0.1, 0.42);
      pluck(t + 0.13, 523.25, 0.11, 0.42);
    },
    jump: (t) => {
      hiss({ at: t, dur: 0.19, peak: 0.075, filter: 'bandpass', from: 420, to: 2400, q: 1.1, attack: 0.06 });
      tone({ at: t, type: 'sine', from: 196, to: 430, dur: 0.16, peak: 0.06 });
    },
    /* A bite has to be crunchy, weighty and quick, in that order. */
    hit: (t) => {
      hiss({ at: t, dur: 0.085, peak: 0.12, filter: 'bandpass', from: 1500, to: 900, q: 1.3, attack: 0.003 });
      tone({ at: t, type: 'sine', from: 118, to: 72, dur: 0.17, peak: 0.13, attack: 0.004 });
      tone({ at: t + 0.012, type: 'triangle', from: 900, to: 640, dur: 0.07, peak: 0.055, attack: 0.004 });
    },
    /* Teeth closing on air. */
    miss: (t) => {
      hiss({ at: t, dur: 0.27, peak: 0.06, filter: 'bandpass', from: 2300, to: 680, q: 1.2, attack: 0.03 });
      tone({ at: t, type: 'sine', from: 300, to: 170, dur: 0.2, peak: 0.035, attack: 0.02 });
    },
    /* Announced hands. It shares nothing with any other cue on purpose — a
       warning that sounds like the game is a warning nobody hears. */
    shoveWarn: (t) => {
      knock(t, 0.13);
      knock(t + 0.115, 0.115);
    },
    /* Somebody at the table drew breath. Under the bubble, not over it. */
    advisor: (t) => {
      tone({ at: t, type: 'triangle', from: 540, to: 470, dur: 0.05, peak: 0.028, attack: 0.006 });
      hiss({ at: t + 0.02, dur: 0.025, peak: 0.018, filter: 'bandpass', from: 1500, q: 3, attack: 0.004 });
    },
    /* The prologue's one gesture: a cold hinge, two saws a quarter-tone apart
       through a resonant lowpass. */
    door: (t) => {
      if (!ctx || !master) return;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 420;
      lp.Q.value = 3;
      lp.connect(master);
      tone({ at: t, type: 'sawtooth', from: 88, to: 46, dur: 0.55, peak: 0.05, attack: 0.2, dest: lp });
      tone({ at: t + 0.03, type: 'sawtooth', from: 91.5, to: 48, dur: 0.52, peak: 0.04, attack: 0.24, dest: lp });
      hiss({ at: t, dur: 0.55, peak: 0.03, filter: 'lowpass', from: 200, to: 90, q: 0.7, attack: 0.24, brown: true });
    },
    /* Restrained on purpose: this site does not do fanfares. Three notes, the
       last one held, and a root under it so it settles rather than stops. */
    win: (t) => {
      pluck(t, 523.25, 0.1, 0.3);
      pluck(t + 0.12, 659.25, 0.095, 0.32);
      pluck(t + 0.24, 783.99, 0.1, 0.55);
      tone({ at: t + 0.24, type: 'sine', from: 261.63, dur: 0.6, peak: 0.05, attack: 0.04 });
    },
    /* One low note, given time to stop. */
    lose: (t) => {
      tone({ at: t, type: 'sine', from: 196, to: 147, dur: 0.95, peak: 0.09, attack: 0.05 });
      tone({ at: t + 0.02, type: 'sine', from: 98, to: 73.5, dur: 1, peak: 0.05, attack: 0.09 });
      hiss({ at: t, dur: 0.5, peak: 0.02, filter: 'lowpass', from: 300, to: 120, q: 0.7, attack: 0.12, brown: true });
    },
  };

  /* ----------------------------------------------------------- the beds --- */

  /** A slow oscillator wired into an AudioParam. Everything that wanders in
   *  here wanders on one of these rather than on a timer. */
  function lfo(rate: number, depth: number, target: AudioParam, phase = 0): OscillatorNode | null {
    if (!ctx) return null;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = rate;
    const g = ctx.createGain();
    g.gain.value = depth;
    o.connect(g);
    g.connect(target);
    o.start(ctx.currentTime + phase);
    return o;
  }

  function bedGain(): GainNode | null {
    if (!ctx || !master) return null;
    const g = ctx.createGain();
    g.gain.value = ZERO;
    g.connect(master);
    return g;
  }

  /** Embers: a filtered brown bed that breathes, plus transients scheduled off
   *  an exponential gap so they clump instead of ticking. */
  function buildFire(): Bed | null {
    if (!ctx) return null;
    const g = bedGain();
    const src = noiseSource(true, true);
    if (!g || !src) return null;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 520;
    lp.Q.value = 0.8;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 60;
    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    src.start();
    const sources: AudioScheduledSourceNode[] = [src];
    const breath = lfo(0.13, 170, lp.frequency);
    if (breath) sources.push(breath);
    const bed: Bed = { gain: g, sources, timer: 0 };

    const crackle = () => {
      if (!ctx || beds.fire !== bed) return;
      const t = ctx.currentTime;
      const n = Math.random() < 0.25 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        hiss({
          at: t + i * (0.02 + Math.random() * 0.05),
          dur: 0.02 + Math.random() * 0.035,
          peak: 0.02 + Math.random() * 0.045,
          filter: 'bandpass',
          from: 1100 + Math.random() * 2400,
          q: 7 + Math.random() * 8,
          attack: 0.002,
          dest: g,
        });
      }
      bed.timer = later(crackle, CRACKLE_MIN - Math.log(1 - Math.random()) * CRACKLE_MEAN);
    };
    bed.timer = later(crackle, CRACKLE_MIN + Math.random() * CRACKLE_MEAN);
    return bed;
  }

  /** Outside, in the prologue: one narrow band of noise whose centre never
   *  settles, on two incommensurate periods so it never repeats audibly. */
  function buildWind(): Bed | null {
    if (!ctx) return null;
    const g = bedGain();
    const src = noiseSource(true, true);
    if (!g || !src) return null;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 320;
    bp.Q.value = 1.7;
    const amp = ctx.createGain();
    amp.gain.value = 0.6;
    src.connect(bp);
    bp.connect(amp);
    amp.connect(g);
    src.start();
    const sources: AudioScheduledSourceNode[] = [src];
    for (const o of [lfo(0.07, 190, bp.frequency), lfo(0.031, 95, bp.frequency), lfo(0.045, 0.35, amp.gain)]) {
      if (o) sources.push(o);
    }
    return { gain: g, sources, timer: 0 };
  }

  /** Act II's room: a murmur, not voices. Three detuned lows under a narrow
   *  band of noise that swells — close enough to a crowd at ten metres. */
  function buildCrowd(): Bed | null {
    if (!ctx) return null;
    const g = bedGain();
    if (!g) return null;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 300;
    lp.Q.value = 0.7;
    lp.connect(g);
    const sources: AudioScheduledSourceNode[] = [];

    const voices: [number, number, number][] = [
      [96, 0.05, 0.07],
      [97.7, 0.045, 0.053],
      [143.5, 0.03, 0.041],
    ];
    for (const [f, amp, rate] of voices) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const vg = ctx.createGain();
      vg.gain.value = amp;
      o.connect(vg);
      vg.connect(lp);
      o.start();
      sources.push(o);
      const trem = lfo(rate, amp * 0.6, vg.gain);
      if (trem) sources.push(trem);
    }

    const src = noiseSource(true, true);
    if (src) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 430;
      bp.Q.value = 3;
      const swell = ctx.createGain();
      swell.gain.value = 0.5;
      src.connect(bp);
      bp.connect(swell);
      swell.connect(g);
      src.start();
      sources.push(src);
      const s = lfo(0.09, 0.28, swell.gain);
      if (s) sources.push(s);
    }
    return { gain: g, sources, timer: 0 };
  }

  const BUILD: Record<Ambient, () => Bed | null> = { fire: buildFire, wind: buildWind, crowd: buildCrowd };

  /** setTimeout, typed to a number whichever lib is in scope. */
  function later(fn: () => void, ms: number): number {
    return setTimeout(fn, ms) as unknown as number;
  }

  function fade(bed: Bed, to: number, seconds: number) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const p = bed.gain.gain;
    p.cancelScheduledValues(t);
    p.setValueAtTime(Math.max(p.value, ZERO), t);
    p.exponentialRampToValueAtTime(Math.max(to, ZERO), t + seconds);
  }

  function stopBed(a: Ambient) {
    const bed = beds[a];
    if (!bed || !ctx) return;
    delete beds[a];
    if (bed.timer) clearTimeout(bed.timer);
    fade(bed, ZERO, BED_OUT);
    const end = ctx.currentTime + BED_OUT + 0.06;
    for (const s of bed.sources) {
      try {
        s.stop(end);
      } catch {
        /* a source that never started, or one already stopped */
      }
    }
    later(() => {
      try {
        bed.gain.disconnect();
      } catch {
        /* already gone */
      }
    }, (BED_OUT + 0.2) * 1000);
  }

  /* ---------------------------------------------------------- the surface --- */

  function cue(c: Cue) {
    try {
      if (!on || !ensure() || !ctx) return;
      const make = CUES[c];
      if (make) make(ctx.currentTime + 0.008);
    } catch {
      /* a cue that will not play is not a reason to stop the game */
    }
  }

  function ambient(a: Ambient, want: boolean) {
    try {
      if (!want) {
        stopBed(a);
        return;
      }
      if (!on || !ensure() || beds[a]) return;
      const bed = BUILD[a]();
      if (!bed) return;
      beds[a] = bed;
      fade(bed, BED[a] * levels[a], BED_IN[a]);
    } catch {
      /* silence is a legal outcome everywhere in here */
    }
  }

  function level(a: Ambient, v: number) {
    try {
      levels[a] = v < 0 ? 0 : v > 1 ? 1 : v;
      const bed = beds[a];
      if (bed) fade(bed, BED[a] * levels[a], 0.35);
    } catch {
      /* as above */
    }
  }

  /** Everything down, and the master with it so nothing left in flight clicks
   *  on the way out. The master comes back once the room is empty, because a
   *  hush is a pause and not a teardown. */
  function hush() {
    try {
      for (const a of ['fire', 'wind', 'crowd'] as Ambient[]) stopBed(a);
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      const p = master.gain;
      p.cancelScheduledValues(t);
      p.setValueAtTime(Math.max(p.value, ZERO), t);
      p.exponentialRampToValueAtTime(ZERO, t + 0.18);
      p.setValueAtTime(MASTER, t + BED_OUT + 0.3);
    } catch {
      /* as above */
    }
  }

  function toggle(): boolean {
    on = !on;
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      /* the choice holds for this page view only */
    }
    if (!on) {
      hush();
      return on;
    }
    /* One quiet note back, so the button says something. The beds are the
       director's to restart — it is the one that knows which act it is in. */
    try {
      if (ensure() && ctx) tone({ at: ctx.currentTime + 0.01, type: 'triangle', from: 520, to: 660, dur: 0.12, peak: 0.09, attack: 0.008 });
    } catch {
      /* as above */
    }
    return on;
  }

  return {
    get on() {
      return on;
    },
    toggle,
    cue,
    ambient,
    level,
    hush,
  };
}
