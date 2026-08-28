/* «Ката пячы» — the game itself, with nothing around it.
 *
 * This is v1's logic moved out from under the DOM and left otherwise alone.
 * Every number here was measured headless against a fake clock and a
 * model-free aimer (`scripts/kata-balance.mjs`), so none of it is a taste
 * judgement that can be re-tuned by eye later: change one and the spread
 * between «spend the dough early» and «save it for the tail» moves with it.
 *
 * The core owns time only through `opts.now()`, chance only through
 * `opts.random()` and the reduced-motion contract only through
 * `opts.stepped()`. It never touches the document, never speaks any language
 * and never stores anything. Discrete moments leave as events; the continuous
 * ones are read off the frame snapshot `tick()` returns.
 *
 * The cord's angle is analytic and stays that way. The rebuild hangs a verlet
 * rope off it for the look of the thing, but the bite is judged here, against
 * `theta()` and `pieceX()`, exactly as it was in v1 — a rope that sagged a
 * pixel differently would otherwise be a rope that changed the balance.
 */
import type { Bake, Bun, Core, CoreFrame, CoreOptions, CorePhase } from './types.ts';

/* ------------------------------------------------------------- numbers --- */
/* Ours, every one of them. See the «what we chose ourselves» note on the page. */

/** Each piece, as it sits on the cat relative to the knot on the beam. */
export const OFFSETS = [
  { dx: -30, dy: 78 }, // вуха
  { dx: -12, dy: 116 }, // лапа
  { dx: 8, dy: 118 }, // лапа
  { dx: 4, dy: 96 }, // бок
  { dx: -30, dy: 92 }, // галава
  { dx: 36, dy: 82 }, // хвост
] as const;

export const K = {
  /** Where the cord is tied to the beam, in the scene's own coordinates. */
  PIVOT_X: 160,
  /** The last piece is the tail, and the tail is the whole game. */
  TAIL: OFFSETS.length - 1,

  /* — the baking — */

  /** One trough for all six buns. Six even ones would be about seventeen each. */
  DOUGH: 100,
  SIZE_MIN: 5,
  SIZE_MAX: 27,
  /** How fast a held ball grows, in dough per millisecond. */
  KNEAD: 0.026,

  /** A big loaf browns slowly; a scrap of one browns before you can blink. */
  BAKE_MS: (size: number) => 1350 + size * 42,
  RAW_UNTIL: 0.46,
  GOLDEN_UNTIL: 0.66,

  /** What the bake does to a bun: raw is heavy and slippery, burnt is crisp,
   *  wide and weightless. Golden is neither, which is why it is worth hitting. */
  BAKE_MASS: { raw: 1.3, golden: 1, burnt: 0.6 },
  BAKE_WINDOW: { raw: 0.8, golden: 1, burnt: 1.2 },

  /** A bun's size, turned into the mouthful it makes. */
  WINDOW_BASE: 5.5,
  WINDOW_PER_SIZE: 0.62,

  /* — the swing, which is whatever the baking made it — */

  AMP_MIN: 34,
  AMP_MAX: 56,
  PERIOD_MIN: 1450,
  PERIOD_MAX: 2500,
  /** How wild a full cat already is, and the range the whole thing is read on.
   *  The range is set so that an evenly golden cat sits in the middle of it: a
   *  raw one has to come out calmer than that and a burnt one wilder, or the
   *  choice at the oven would not be a choice. */
  WILD_FULL: 0.35,
  WILD_LO: 0.25,
  WILD_HI: 1.7,
  /** The tail is the prize the whole game is played for; the cord goes faster. */
  TAIL_PERIOD: 0.88,
  /** However much is eaten, the cat never weighs nothing. */
  MASS_FLOOR: 4,

  /** The idle swing, before the cat is baked and after it is all over. */
  IDLE_AMP: 12,
  IDLE_PERIOD: 3400,

  /** The ride up: the bite lands at the top of it, not when the key goes down. */
  RISE: 340,
  FALL: 380,

  /** The shoving. It is announced before it lands — a shove you cannot see
   *  coming is not a game, it is a dice roll — so it can be waited out or aimed
   *  against. */
  SHOVE_UNITS: 12,
  SHOVE_HOLD: 900,
  SHOVE_GAP: 2600,
  SHOVE_GAP_STEP: 260,
  /** However crowded it gets, hands do not arrive faster than this. */
  SHOVE_GAP_MIN: 900,

  /** The pause between the cat being hung and the first swing. */
  HANDOFF: 1100,

  /** With motion turned down the cat cannot be tracked, so it steps between
   *  positions instead and the bite is judged where it stands rather than at the
   *  top of the ride. Two things make that fair: the cord goes at half speed,
   *  and the grid of positions is anchored on the one angle where the piece
   *  being bitten sits exactly over the pitchfork — so it always visits the
   *  bite, and stops there long enough to be hit. */
  STEP_DEG: 10,
  STEPPED_SLOW: 2,
  /** A stepped ride has no rise to wait through, so it only has to come down. */
  STEPPED_FALL: 220,

  /** The browning gauge steps too, for the same reason. */
  GAUGE_STEPS: 12,

  /** A ride or a loaf interrupted by the visitor leaving the tab is given back
   *  rather than judged; the room is told to keep its hands to itself for this
   *  long afterwards. */
  VISIBLE_GRACE: 800,
} as const;

/** Same formula under its own name — the oven gauge and the harness both want it. */
export const BAKE_MS = K.BAKE_MS;

/* ------------------------------------------------------- pure geometry --- */

const rad = (deg: number) => (deg * Math.PI) / 180;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The angle at which a piece hangs exactly over the pitchfork. */
export const anchorFor = (i: number) => (Math.atan(OFFSETS[i].dx / OFFSETS[i].dy) * 180) / Math.PI;

/** Where a piece is, left to right, when the cord stands at that angle. */
export function pieceX(i: number, deg: number) {
  const a = rad(deg);
  const { dx, dy } = OFFSETS[i];
  return K.PIVOT_X + dx * Math.cos(a) - dy * Math.sin(a);
}

/** How the browning reads, as a word. */
export const bakeOf = (p: number): Bake => (p < K.RAW_UNTIL ? 'raw' : p <= K.GOLDEN_UNTIL ? 'golden' : 'burnt');

/** What a finished bun is worth: how wide it bites and what it weighs. */
export function bunOf(size: number, bake: Bake): Bun {
  return {
    size,
    bake,
    window: (K.WINDOW_BASE + size * K.WINDOW_PER_SIZE) * K.BAKE_WINDOW[bake],
    mass: size * K.BAKE_MASS[bake],
  };
}

/** v1's `--bun-scale`: 0.62 at a scrap, 1.17 at a full trough's worth. */
export const bunScale = (size: number) => 0.62 + (size / K.SIZE_MAX) * 0.55;

/* ---------------------------------------------------------------- core --- */

/**
 * `Core` plus two read-only probes the balance harness needs and the scene may
 * use: the cord's angle at an arbitrary moment (so an aimer can look ahead
 * without a model of the swing) and the mouthful a baked piece makes. Purely
 * additive — a `CoreProbe` is a `Core` wherever one is asked for.
 */
export interface CoreProbe extends Core {
  /** Analytic cord angle in degrees at any moment, past or future. */
  thetaAt(at: number): number;
  /** Half-width of piece `i`'s mouthful, core units; 0 before it is baked. */
  windowOf(i: number): number;
}

export function createCore(opts: CoreOptions): CoreProbe {
  const { now: clock, random, stepped, emit } = opts;

  let phase: CorePhase = 'idle';

  /* — what has been baked — */
  let buns: Bun[] = [];
  let doughLeft: number = K.DOUGH;
  let making = 0;
  let holding = false;
  let holdFrom = 0;
  let bakeFrom = 0;
  let bakeSize = 0;
  let hungAt = 0;
  /* The trough runs dry once per game, and is worth saying once. */
  let doughOutSaid = false;

  /* — the biting — */
  let target = 0;
  let mine = 0;
  let theirs = 0;
  let tries = 0;
  let eatenMass = 0;

  let amp: number = K.IDLE_AMP;
  let period: number = K.IDLE_PERIOD;
  let t0 = clock();

  let jumpAt = 0;
  let jumpShove = 0;
  let resolved = false;

  let shoveDir: -1 | 0 | 1 = 0;
  let shoveUntil = 0;
  let shoveNext = clock() + K.SHOVE_GAP;

  /* One snapshot object for the whole game: `tick()` is called sixty times a
     second and the frame loop above it must not have to collect garbage. */
  const snap: CoreFrame = {
    phase: 'idle',
    thetaDeg: 0,
    ballSize: 0,
    browning: 0,
    ovenSize: 0,
    doughLeft: K.DOUGH,
    making: 0,
    buns,
    target: 0,
    mine: 0,
    theirs: 0,
    tries: 0,
    massFrac: 0,
    shoveDir: 0,
    shoving: false,
    playerUp: false,
    playerShove: 0,
    jumpT: 0,
  };

  /* ------------------------------------------------------------ the cat --- */

  const totalMass = () => buns.reduce((s, b) => s + b.mass, 0);
  const remainingMass = () => Math.max(K.MASS_FLOOR, totalMass() - eatenMass);

  /** How hard the cat is swinging, from nought to one. Two things drive it: the
   *  cat empties as it is bitten and a light cat is easy to throw about, and a
   *  heavy one — a raw one — is barely moved by the room at all. */
  function wildness() {
    const total = Math.max(totalMass(), 1);
    const left = remainingMass() / total;
    const heft = clamp(total / K.DOUGH, 0.5, 1.5);
    const wild = (K.WILD_FULL + (1 - K.WILD_FULL) * (1 - left)) / heft;
    return clamp((wild - K.WILD_LO) / (K.WILD_HI - K.WILD_LO), 0, 1);
  }

  /** Half speed when motion is turned down, so a stepped cat can be read. */
  const effPeriod = () => period * (stepped() ? K.STEPPED_SLOW : 1);

  /** Angle of the cord, in degrees, at a given moment. */
  function theta(now: number) {
    const raw = amp * Math.sin((2 * Math.PI * (now - t0)) / effPeriod());
    if (!stepped()) return raw;
    const anchor = anchorFor(target);
    return Math.round((raw - anchor) / K.STEP_DEG) * K.STEP_DEG + anchor;
  }

  /** Keep the cat where it is while the swing is re-tuned under it. */
  function retune(nextAmp: number, nextPeriod: number, now: number) {
    const turns = (now - t0) / effPeriod();
    amp = nextAmp;
    period = nextPeriod;
    t0 = now - (turns - Math.floor(turns)) * effPeriod();
  }

  /** Read the swing back off whatever is still hanging there. */
  function reweigh(now: number, tail = false) {
    const u = wildness();
    retune(
      K.AMP_MIN + (K.AMP_MAX - K.AMP_MIN) * u,
      (K.PERIOD_MAX - (K.PERIOD_MAX - K.PERIOD_MIN) * u) * (tail ? K.TAIL_PERIOD : 1),
      now,
    );
  }

  /* ------------------------------------------------------------- baking --- */

  /** How big the ball on the board is right now. */
  function ballSize(now: number) {
    const grown = K.SIZE_MIN + (now - holdFrom) * K.KNEAD;
    return clamp(Math.min(grown, K.SIZE_MAX), 2, Math.max(2, doughLeft));
  }

  function intoOven(now: number) {
    if (!holding) return;
    holding = false;
    bakeSize = ballSize(now);
    doughLeft = Math.max(0, doughLeft - bakeSize);
    bakeFrom = now;
    phase = 'bake';
    emit({ type: 'intoOven', index: making, size: bakeSize });
  }

  /** How far along the browning is, 0 to 1. */
  function browning(now: number) {
    const p = (now - bakeFrom) / K.BAKE_MS(bakeSize);
    return stepped() ? Math.min(1, Math.round(p * K.GAUGE_STEPS) / K.GAUGE_STEPS) : Math.min(1, p);
  }

  function outOfOven(now: number) {
    const bun = bunOf(bakeSize, bakeOf(browning(now)));
    buns.push(bun);
    emit({ type: 'bunDone', index: making, bun, doughLeft });

    making += 1;
    if (making > K.TAIL) return hangTheCat(now);

    phase = 'shape';
    if (doughLeft <= K.SIZE_MIN && !doughOutSaid) {
      doughOutSaid = true;
      emit({ type: 'doughOut' });
    }
  }

  function hangTheCat(now: number) {
    phase = 'hung';
    hungAt = now;
    target = 0;
    reweigh(now);
    emit({ type: 'hung' });
  }

  /* ------------------------------------------------------------- biting --- */

  function jump(now: number) {
    if (phase !== 'swing') return;
    phase = 'jump';
    jumpAt = now;
    jumpShove = now < shoveUntil ? shoveDir * K.SHOVE_UNITS : 0;
    emit({ type: 'jump', shoved: jumpShove !== 0 });
  }

  /** The bite itself, judged at the top of the ride — which is a moment that may
   *  already be a frame or two in the past by the time this runs, and is read at
   *  its own time rather than at this one on purpose. */
  function resolve(now: number) {
    const at = stepped() ? now : jumpAt + K.RISE;
    const gap = Math.abs(pieceX(target, theta(at)) - (K.PIVOT_X + jumpShove));
    const hit = gap <= buns[target].window;
    const tail = target === K.TAIL;

    emit({ type: 'bite', target, hit, tail, gap });

    if (tail) {
      if (hit) return finish(true);
      tries -= 1;
      if (tries <= 0) return finish(false);
      emit({ type: 'tailMiss', triesLeft: tries });
      return;
    }

    if (hit) {
      mine += 1;
    } else {
      theirs += 1;
      /* A piece somebody else took drops away rather than being snapped up, so
         a hit and a miss never look alike. */
      emit({ type: 'pieceLost', target });
    }

    /* Bitten or stolen, the piece is off the cat and the cord feels it. */
    eatenMass += buns[target].mass;
    target += 1;
    reweigh(now, target === K.TAIL);

    if (target === K.TAIL) {
      /* Every piece taken buys one more go at the tail. Nothing else in the
         game rewards the rounds before it, and something has to. */
      tries = Math.max(1, mine);
      emit({ type: 'tailPhase', tries });
    }
  }

  function finish(won: boolean) {
    phase = 'over';
    /* The ride is cut short by the ending, so it is unwound here rather than in
       the frame loop, which stops caring the moment the phase changes. */
    resolved = false;
    retune(K.IDLE_AMP, K.IDLE_PERIOD, clock());
    emit({ type: 'finish', won, mine, theirs });
  }

  /* --------------------------------------------------------- the frames --- */

  function tick(): CoreFrame {
    const now = clock();

    if (phase === 'shape') {
      if (holding) {
        /* Dough does not stretch: once the trough is scraped out, the ball is
           what it is and holding on longer changes nothing. */
        if (ballSize(now) >= Math.min(K.SIZE_MAX, doughLeft)) intoOven(now);
      }
    } else if (phase === 'bake') {
      if (browning(now) >= 1) outOfOven(now);
    } else if (phase === 'hung' && now - hungAt > K.HANDOFF) {
      phase = 'swing';
      shoveNext = now + K.SHOVE_GAP;
      emit({ type: 'swingStart' });
    }

    let shoving = false;
    if (phase === 'swing' || phase === 'jump') {
      if (now > shoveUntil && now > shoveNext) {
        shoveDir = random() < 0.5 ? -1 : 1;
        shoveUntil = now + K.SHOVE_HOLD;
        shoveNext =
          shoveUntil +
          Math.max(K.SHOVE_GAP_MIN, K.SHOVE_GAP - K.SHOVE_GAP_STEP * (mine + theirs)) * (0.7 + random() * 0.6);
        emit({ type: 'shove', dir: shoveDir });
      }
      shoving = now < shoveUntil;
    }

    let ride = 0;
    if (phase === 'jump') {
      const dt = now - jumpAt;
      const rise = stepped() ? 0 : K.RISE;
      const fall = stepped() ? K.STEPPED_FALL : K.FALL;
      ride = clamp(dt / (rise + fall), 0, 1);
      if (dt >= rise && !resolved) {
        resolved = true;
        resolve(now);
      }
      if (dt >= rise + fall) {
        resolved = false;
        if (phase === 'jump') phase = 'swing';
      }
    }

    const total = totalMass();
    snap.phase = phase;
    snap.thetaDeg = theta(now);
    snap.ballSize = phase === 'shape' && holding ? ballSize(now) : 0;
    snap.browning = phase === 'bake' ? browning(now) : 0;
    snap.ovenSize = phase === 'bake' ? bakeSize : 0;
    snap.doughLeft = doughLeft;
    snap.making = making;
    snap.buns = buns;
    snap.target = target;
    snap.mine = mine;
    snap.theirs = theirs;
    snap.tries = tries;
    snap.massFrac = total > 0 ? clamp(remainingMass() / total, 0, 1) : 0;
    snap.shoveDir = shoving ? shoveDir : 0;
    snap.shoving = shoving;
    snap.playerUp = phase === 'jump';
    snap.playerShove = phase === 'jump' ? jumpShove : 0;
    snap.jumpT = phase === 'jump' ? ride : 0;
    return snap;
  }

  /* ------------------------------------------------------------ wiring --- */

  function start() {
    const now = clock();
    buns = [];
    doughLeft = K.DOUGH;
    making = 0;
    holding = false;
    doughOutSaid = false;
    mine = 0;
    theirs = 0;
    tries = 0;
    eatenMass = 0;
    target = 0;
    resolved = false;
    jumpShove = 0;
    retune(K.IDLE_AMP, K.IDLE_PERIOD, now);
    phase = 'shape';
    emit({ type: 'started' });
  }

  /** One button does all three jobs, because the whole game is one button. */
  function press() {
    const now = clock();
    if (phase === 'shape' && !holding) {
      holding = true;
      holdFrom = now;
    } else if (phase === 'bake') outOfOven(now);
    else if (phase === 'swing') jump(now);
  }

  function release() {
    if (phase === 'shape' && holding) intoOven(clock());
  }

  /* A ride or a loaf interrupted by the visitor leaving the tab is given back
     rather than judged: the frame loop stops while the page is hidden, so the
     bite would land wherever the cat had drifted to, and the bun would come out
     of the oven as charcoal. */
  function onVisible() {
    const now = clock();
    if (phase === 'jump') {
      phase = 'swing';
      resolved = false;
    }
    if (phase === 'bake') bakeFrom = now;
    if (phase === 'shape' && holding) holdFrom = now;
    shoveUntil = 0;
    shoveNext = now + K.VISIBLE_GRACE;
  }

  return {
    start,
    press,
    release,
    tick,
    onVisible,
    get phase() {
      return phase;
    },
    thetaAt: theta,
    windowOf: (i: number) => buns[i]?.window ?? 0,
  };
}
