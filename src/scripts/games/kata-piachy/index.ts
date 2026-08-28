/* «Ката пячы» — the director.
 *
 * Everything else in this directory is deaf and blind on purpose: the core does
 * not know there is a screen, the engine does not know there is a game, the
 * drama does not know there is a DOM. This file is the only one that knows all
 * three, and it is the only one that touches the document.
 *
 * What it owns:
 *   — the three acts around the core's own phases: prologue → play → epilogue;
 *   — one requestAnimationFrame loop, which ticks the core, steps the cord and
 *     the dough, assembles a SceneState and hands it to the engine;
 *   — the one control (hold to shape, press to pull, press to jump) on pointer
 *     and on Space, with v1's focus and forgiveness rules unchanged;
 *   — the HUD, the speech bubbles, the status line, the best line, the sound
 *     toggle, the analytics calls.
 *
 * Two rules run through all of it. The bite is judged in mechanics.ts and
 * nowhere else — nothing here may reach into a game outcome. And nothing in the
 * frame loop allocates: one SceneState, one CrowdView, six PieceViews, all
 * built at mount and mutated in place.
 */
import { track } from '../../analytics';
import type { KataCopy } from '../../../i18n';
import { createDrama } from './drama';
import { createEngine } from './engine';
import { bunScale, createCore, K, OFFSETS, pieceX } from './mechanics';
import { createDough, createRope } from './physics';
import { ANCHORS } from './scene';
import { createSound } from './sound';
import {
  CORE_SCALE,
  PIVOT,
  STAGE_H,
  STAGE_W,
  type Act,
  type AdvisorId,
  type CoreEvent,
  type CoreFrame,
  type CrowdView,
  type PieceState,
  type PieceView,
  type SceneState,
  type Speech,
} from './types';

/* ---------------------------------------------------------------- copy --- */
/* The page hands the game its strings; the game holds no language of its own.
   `advisors` is the whole of what drama.ts reads, so the parsed object is a
   KataCopy as far as that module is concerned. */

type Copy = Pick<
  KataCopy,
  | 'start'
  | 'again'
  | 'actBake'
  | 'actBite'
  | 'dough'
  | 'weight'
  | 'bakes'
  | 'yours'
  | 'rivals'
  | 'tries'
  | 'shove'
  | 'soundOn'
  | 'soundOff'
  | 'viewWide'
  | 'viewNormal'
  | 'bestLabel'
  | 'bestWon'
  | 'bestNone'
  | 'pieces'
  | 'prologue'
  | 'goal'
  | 'msg'
  | 'advisors'
  | 'epilogue'
>;

/* ------------------------------------------------------------- numbers --- */
/* Staging only. Nothing here can move the balance — every number the game is
   judged on lives in mechanics.ts. */

/** The whole prologue, and what is left of it on a replay or with motion down. */
const PROLOGUE_MS = 8000;
const PROLOGUE_SHORT = 2000;
/** scene.drawPrologue swings the door open from here; the hinge gets a sound. */
const DOOR_AT = 0.42;
/** Act I's camera has to have settled before anyone opens their mouth. */
const GREETING_AT = 600;
/** The kneading thumb, while the ball is held. */
const POKE_EVERY = 350;

/** Where the bubble's tail sits over each villager, in stage units. */
const BUBBLE_Y: Record<AdvisorId, number> = { hanna: 300, symon: 294, alesik: 336 };

/** The board's surface — ANCHORS.ball is that surface less a nominal radius. */
const BOARD_Y = ANCHORS.ball.y + 16;
/** scene.drawBakeProps' seated ball, so the live blob and the drawn one agree. */
const ballRadius = (size: number) => 7 + size * 1.05;

/** The camera, act by act. The engine eases toward these; reduced motion cuts.
 *  Each one is kept inside the stage at its own zoom, or the pan would drag the
 *  letterbox in over the room. */
const CAMERA: Record<Act, { x: number; y: number; zoom: number }> = {
  prologue: { x: STAGE_W / 2, y: STAGE_H / 2, zoom: 1 },
  /* the печ on one side and the board and дзяжа on the other — act I is the
     whole width of the room, pushed in just enough to make the dough legible */
  bake: { x: 374, y: 258, zoom: 1.06 },
  /* up toward the beam as the cat is tied on */
  handoff: { x: 360, y: 226, zoom: 1.06 },
  /* the cat is the subject now, and at zoom 1 it hangs over the crowd's heads */
  bite: { x: 360, y: 224, zoom: 1.08 },
  epilogue: { x: STAGE_W / 2, y: STAGE_H / 2, zoom: 1 },
};

/** How much of the hearth, the wind and the room is heard in each act. */
const AMBIENT: Record<Act, { fire: number; wind: number; crowd: number }> = {
  prologue: { fire: 0.35, wind: 1, crowd: 0 },
  bake: { fire: 1, wind: 0, crowd: 0 },
  handoff: { fire: 0.7, wind: 0, crowd: 0.5 },
  bite: { fire: 0.6, wind: 0, crowd: 0.9 },
  epilogue: { fire: 0.5, wind: 0, crowd: 0.3 },
};

const BEST_KEY = 'kata-best';
const SEEN_KEY = 'kata-seen';

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const rad = (deg: number) => (deg * Math.PI) / 180;

/* ---------------------------------------------------------------- game --- */

export function mountKataPiachy(root: HTMLElement) {
  const pick = <T extends Element>(sel: string) => root.querySelector<T>(sel);

  const copyEl = pick<HTMLScriptElement>('[data-kata-copy]');
  const canvas = pick<HTMLCanvasElement>('[data-canvas]');
  const poster = pick<HTMLElement>('[data-poster]');
  const tap = pick<HTMLButtonElement>('[data-tap]');
  const startBtn = pick<HTMLButtonElement>('[data-start]');
  const soundBtn = pick<HTMLButtonElement>('[data-sound]');
  const viewBtn = pick<HTMLButtonElement>('[data-view]');
  const status = pick<HTMLElement>('[data-status]');

  const goalSub = pick<HTMLElement>('[data-goal-sub]');
  const nowLine = pick<HTMLElement>('[data-now]');
  const hudAct = pick<HTMLElement>('[data-hud-act]');
  const hudTarget = pick<HTMLElement>('[data-hud-target]');
  const hudYours = pick<HTMLElement>('[data-hud-yours]');
  const hudRivals = pick<HTMLElement>('[data-hud-rivals]');
  const hudTries = pick<HTMLElement>('[data-hud-tries]');
  const meter = pick<HTMLElement>('[data-meter]');
  const meterLabel = pick<HTMLElement>('[data-meter-label]');
  const meterBar = pick<HTMLElement>('[data-meter-bar]');
  const gauge = pick<HTMLElement>('[data-gauge]');
  const needle = pick<HTMLElement>('[data-needle]');
  const shoveBadge = pick<HTMLElement>('[data-shove]');
  const bestEl = pick<HTMLElement>('[data-best]');

  const bubble = pick<HTMLElement>('[data-bubble]');
  const bubbleBe = pick<HTMLElement>('[data-bubble-be]');
  const bubbleGloss = pick<HTMLElement>('[data-bubble-gloss]');

  const proEl = pick<HTMLElement>('[data-prologue]');
  const skipBtn = pick<HTMLButtonElement>('[data-skip]');
  const epiEl = pick<HTMLElement>('[data-epilogue]');
  const verdictEl = pick<HTMLElement>('[data-verdict]');
  const calendarEl = pick<HTMLElement>('[data-calendar]');
  const docEl = pick<HTMLElement>('[data-doc]');
  const againBtn = pick<HTMLButtonElement>('[data-again]');

  if (!copyEl || !canvas || !tap || !startBtn || !status) return;

  let copy: Copy;
  try {
    copy = JSON.parse(copyEl.textContent || '') as Copy;
  } catch {
    return;
  }
  if (!copy || !copy.advisors || !copy.pieces || copy.pieces.length !== OFFSETS.length) return;

  /* A canvas without a context is a page without a game: leave the poster up
     and the visitor keeps the picture and the words about it. */
  const started = (() => {
    try {
      return createEngine(canvas);
    } catch {
      return null;
    }
  })();
  if (!started) return;
  const engine = started;

  /* the canvas takes the stage over from the server-rendered poster */
  canvas.hidden = false;
  if (poster) poster.hidden = true;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motion.matches;
  motion.addEventListener?.('change', (e) => {
    reduced = e.matches;
  });

  const now = () => performance.now();
  const sound = createSound();
  const core = createCore({
    now,
    random: Math.random,
    stepped: () => reduced,
    emit: (e) => onCoreEvent(e),
  });
  const drama = createDrama(copy as KataCopy, { now, random: Math.random });
  const rope = createRope();
  const dough = createDough();

  /* -------------------------------------------------------- frame state --- */

  const pieces: PieceView[] = OFFSETS.map(() => ({ state: 'unbaked' as PieceState, bake: null, scale: 1, targeted: false }));
  /* what has come off the cat, kept here because the core does not keep it */
  const taken: (PieceState | null)[] = OFFSETS.map(() => null);

  const crowd: CrowdView = {
    lean: { hanna: 0, symon: 0, alesik: 0 },
    speaking: null,
    cheer: 0,
  };

  const state: SceneState = {
    act: 'bake',
    t: 0,
    camera: { x: CAMERA.bake.x, y: CAMERA.bake.y, zoom: CAMERA.bake.zoom },
    dimness: 0,
    core: null,
    rope: null,
    dough: null,
    pieces,
    crowd,
    prologueT: 0,
    won: null,
    reducedMotion: reduced,
  };

  /** Our own copy of the engine's eased camera, so the DOM bubbles sit over the
   *  villagers rather than over where the villagers were before the pan. */
  const view = { x: state.camera.x, y: state.camera.y, zoom: state.camera.zoom };

  type Mode = 'idle' | 'prologue' | 'play' | 'epilogue';
  let mode: Mode = 'idle';
  let act: Act = 'bake';

  const mountedAt = now();
  let last = mountedAt;
  let raf = 0;

  let proFrom = 0;
  let proMs = PROLOGUE_MS;
  let doorSaid = false;

  let hungAt = 0;
  let pokeAt = 0;
  let kneaded = false;

  let shoveFrom = 0;
  let shoveSide: -1 | 0 | 1 = 0;

  let cheerFrom = 0;
  let cheerMs = 0;
  let cheerPeak = 0;

  let live: { who: AdvisorId; until: number } | null = null;
  let tailAsked = false;

  const timers: number[] = [];
  const after = (ms: number, fn: () => void) => {
    timers.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    for (const id of timers) clearTimeout(id);
    timers.length = 0;
  };

  /* ------------------------------------------------------------ helpers --- */

  const fill = (s: string, vars: Record<string, string | number>) =>
    s.replace(/\{(\w+)\}/g, (m, k) => String(vars[k] ?? m));

  const pieceName = (i: number) => {
    const p = copy.pieces[i];
    return p.gloss && p.gloss !== p.be ? `${p.be} — ${p.gloss}` : p.be;
  };

  function say(text: string) {
    if (status && status.textContent !== text) status.textContent = text;
  }

  function setText(el: HTMLElement | null, text: string) {
    if (el && el.textContent !== text) el.textContent = text;
  }

  function show(el: HTMLElement | null, on: boolean) {
    if (el && el.hidden === on) el.hidden = !on;
  }

  /* --------------------------------------------------------- the bubble --- */

  function clearBubble() {
    live = null;
    crowd.speaking = null;
    show(bubble, false);
  }

  /** The one place a villager is given the floor. Decorative for a screen
   *  reader: the status line is the narration channel and always has been. */
  function raise(sp: Speech | null) {
    if (!sp || !bubble) return;
    setText(bubbleBe, sp.be);
    setText(bubbleGloss, sp.gloss);
    show(bubbleGloss, !!sp.gloss);
    bubble.dataset.who = sp.who;
    show(bubble, true);
    live = { who: sp.who, until: now() + sp.hold };
    crowd.speaking = sp.who;
    sound.cue('advisor');
  }

  /** Stage units → pixels inside the canvas box, through the same letterbox and
   *  the same camera the engine is drawing with. */
  function placeBubble() {
    if (!bubble || bubble.hidden || !live) return;
    const w = canvas!.clientWidth;
    const h = canvas!.clientHeight;
    if (w < 2 || h < 2) return;
    const fit = Math.min(w / STAGE_W, h / STAGE_H);
    const sx = STAGE_W / 2 + (ANCHORS.crowd[live.who] - view.x) * view.zoom;
    const sy = STAGE_H / 2 + (BUBBLE_Y[live.who] - view.y) * view.zoom;
    const px = clamp((w - STAGE_W * fit) / 2 + sx * fit, 10, w - 10);
    const py = clamp((h - STAGE_H * fit) / 2 + sy * fit, 10, h - 10);
    bubble.style.left = `${px.toFixed(1)}px`;
    bubble.style.top = `${py.toFixed(1)}px`;
  }

  /* ------------------------------------------------------------ the hud --- */

  function meterTo(label: string, value: number, of: number) {
    if (!meter || !meterBar || !meterLabel) return;
    show(meter, true);
    setText(meterLabel, label);
    meterBar.style.width = `${clamp((value / of) * 100, 0, 100).toFixed(1)}%`;
  }

  function hud(f: CoreFrame | null) {
    const phase = f ? f.phase : 'idle';
    const baking = phase === 'shape' || phase === 'bake';
    const biting = phase === 'hung' || phase === 'swing' || phase === 'jump';
    const idle = !f || phase === 'idle' || phase === 'over';

    /* Between games there is no piece in hand and no act being played, and a row
       of dashes is worse than no row. */
    show(nowLine, !idle);
    setText(goalSub, idle ? '' : baking ? copy.goal.bake : copy.goal.bite);
    setText(hudAct, baking ? copy.actBake : copy.actBite);
    setText(hudTarget, idle || !f ? '—' : pieceName(baking ? Math.min(f.making, K.TAIL) : f.target));
    setText(hudYours, String(f ? f.mine : 0));
    setText(hudRivals, String(f ? f.theirs : 0));
    setText(hudTries, String(f ? f.tries : 0));

    const onTail = !!f && f.target === K.TAIL && biting;
    hudTries?.parentElement?.toggleAttribute('hidden', !onTail);
    /* the count survives the last bite: it is the one number the round leaves */
    const counted = biting || phase === 'over';
    for (const el of [hudYours, hudRivals]) el?.parentElement?.toggleAttribute('hidden', !counted);

    if (!f || idle) show(meter, false);
    else if (baking) meterTo(copy.dough, f.doughLeft, K.DOUGH);
    else meterTo(copy.weight, f.massFrac * 100, 100);

    const brownable = phase === 'bake';
    show(gauge, brownable);
    if (needle && f) needle.style.left = `${(clamp(brownable ? f.browning : 0, 0, 1) * 100).toFixed(1)}%`;

    const shoving = f !== null && f.shoving && f.shoveDir !== 0;
    show(shoveBadge, shoving);
    const side = f && shoving ? (f.shoveDir < 0 ? 'left' : 'right') : '';
    if (root.dataset.shove !== side) root.dataset.shove = side;
    if (root.dataset.phase !== phase) root.dataset.phase = phase;
  }

  /** The one line the game keeps between visits. */
  function showBest() {
    if (!bestEl) return;
    let best: { pieces: number; won: boolean } | null = null;
    try {
      best = JSON.parse(localStorage.getItem(BEST_KEY) || 'null');
    } catch {
      /* private mode: no record, no line */
    }
    setText(bestEl, best ? `${copy.bestLabel}: ${best.pieces}/${K.TAIL} · ${best.won ? copy.bestWon : copy.bestNone}` : '');
  }

  function keepBest(mine: number, ok: boolean) {
    try {
      const prev = JSON.parse(localStorage.getItem(BEST_KEY) || 'null') as { pieces: number; won: boolean } | null;
      const better = !prev || (ok && !prev.won) || (ok === prev.won && mine > prev.pieces);
      if (better) localStorage.setItem(BEST_KEY, JSON.stringify({ pieces: mine, won: ok }));
    } catch {
      /* nothing to keep it in */
    }
    showBest();
  }

  /* ------------------------------------------------------------- sounds --- */

  function ambientFor(a: Act) {
    const m = AMBIENT[a];
    sound.level('fire', m.fire);
    sound.level('wind', m.wind);
    sound.level('crowd', m.crowd);
    sound.ambient('fire', m.fire > 0);
    sound.ambient('wind', m.wind > 0);
    sound.ambient('crowd', m.crowd > 0);
  }

  /* ------------------------------------------------------ the core's news -- */

  /** Where a piece actually is on the stage when the cord stands at `deg` — the
   *  same rotation drawCat uses, so the crumbs come off the piece and not off
   *  the middle of the room. */
  function pieceStageY(i: number, deg: number) {
    const a = rad(deg);
    const { dx, dy } = OFFSETS[i];
    return PIVOT.y + CORE_SCALE * (Math.sin(a) * dx + Math.cos(a) * dy);
  }

  function onCoreEvent(e: CoreEvent) {
    const f = state.core;
    const theta = f ? f.thetaDeg : 0;

    switch (e.type) {
      case 'started':
        say(fill(copy.msg.shape, { piece: pieceName(0) }));
        break;

      case 'intoOven':
        sound.cue('oven');
        engine.burst('flour', ANCHORS.ball.x, BOARD_Y - ballRadius(e.size) * 0.6, 14);
        engine.burst('spark', ANCHORS.fire.x, ANCHORS.fire.y - 12, 8);
        dough.grow(0);
        say(copy.msg.bake);
        break;

      case 'bunDone': {
        sound.cue(e.bun.bake === 'raw' ? 'doneRaw' : e.bun.bake === 'golden' ? 'doneGolden' : 'doneBurnt');
        engine.burst('spark', ANCHORS.fire.x, ANCHORS.fire.y - 10, 6);
        /* a loaf pulled out before its time comes out steaming */
        if (e.bun.bake === 'raw') engine.burst('steam', ANCHORS.ovenBun.x, ANCHORS.ovenBun.y - 26, 10);
        const line = fill(copy.msg.baked, { piece: pieceName(e.index), bake: copy.bakes[e.bun.bake] });
        const next = e.index + 1;
        if (e.doughLeft <= K.SIZE_MIN) say(`${line} ${copy.msg.doughOut}`);
        else if (next === K.TAIL) say(`${line} ${fill(copy.msg.tailNext, { n: Math.round(e.doughLeft) })}`);
        else if (next <= K.TAIL) say(`${line} ${fill(copy.msg.shape, { piece: pieceName(next) })}`);
        else say(line);
        break;
      }

      case 'hung':
        hungAt = now();
        sound.cue('hung');
        /* the cat drops onto the cord and the cord says so */
        rope.impulse(0, 450);
        say(copy.msg.hung);
        break;

      case 'swingStart':
        say(fill(copy.msg.ready, { piece: pieceName(f ? f.target : 0) }));
        break;

      case 'shove':
        shoveFrom = now();
        shoveSide = e.dir;
        sound.cue('shoveWarn');
        break;

      case 'jump':
        sound.cue('jump');
        if (e.shoved) engine.shake(3);
        break;

      case 'bite': {
        if (e.hit) {
          sound.cue('hit');
          taken[e.target] = 'eaten';
          engine.burst('crumb', pieceX(e.target, theta) * CORE_SCALE, pieceStageY(e.target, theta), 16);
          engine.hitstop(120);
          engine.shake(5);
          cheer(0.7, 900);
        } else {
          sound.cue('miss');
          engine.shake(2);
        }
        /* the cat is knocked away from the side the mouthful came off */
        rope.impulse(-Math.sign(OFFSETS[e.target].dx || 1) * 250, 0);
        if (!e.tail) {
          const line = e.hit
            ? fill(copy.msg.hit, { piece: pieceName(e.target) })
            : fill(copy.msg.miss, { piece: pieceName(e.target) });
          const next = e.target + 1;
          say(next < K.TAIL ? `${line} ${fill(copy.msg.ready, { piece: pieceName(next) })}` : line);
        }
        break;
      }

      case 'pieceLost':
        taken[e.target] = 'lost';
        break;

      case 'tailPhase':
        say(fill(copy.msg.tail, { n: e.tries }));
        break;

      case 'tailMiss':
        say(fill(copy.msg.tailMiss, { n: e.triesLeft }));
        break;

      case 'finish':
        finish(e.won, e.mine);
        return;

      default:
        break;
    }

    raise(drama.onEvent(e));
  }

  function cheer(peak: number, ms: number) {
    cheerFrom = now();
    cheerPeak = peak;
    cheerMs = ms;
  }

  /* ------------------------------------------------------------ the acts --- */

  function actOf(f: CoreFrame): Act {
    if (f.phase === 'over') return 'epilogue';
    if (f.phase === 'hung') return 'handoff';
    if (f.phase === 'swing' || f.phase === 'jump') return 'bite';
    return 'bake';
  }

  function enter(a: Act) {
    act = a;
    ambientFor(a);
    if (root.dataset.act !== a) root.dataset.act = a;
  }

  function begin() {
    clearTimers();
    clearBubble();
    show(epiEl, false);
    show(calendarEl, false);
    show(docEl, false);
    show(againBtn, false);
    show(startBtn, false);
    state.won = null;
    tailAsked = false;
    kneaded = false;
    shoveSide = 0;
    cheerMs = 0;
    for (let i = 0; i < taken.length; i++) taken[i] = null;
    track('game_started', { game: 'kata-piachy' });

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the prologue plays every time, which is the kinder bug */
    }

    /* One tap skips it; a replay and a page with motion turned down skip most
       of it for the visitor, because a title card twice is a wall. */
    if (seen) return startPlay();
    mode = 'prologue';
    proMs = reduced ? PROLOGUE_SHORT : PROLOGUE_MS;
    proFrom = now();
    doorSaid = false;
    enter('prologue');
    show(proEl, true);
    show(tap, false);
    say(copy.prologue.scene);
    hud(null);
  }

  function skipPrologue() {
    if (mode !== 'prologue') return;
    startPlay();
  }

  function startPlay() {
    show(proEl, false);
    mode = 'play';
    enter('bake');
    show(tap, true);
    drama.reset();
    core.start();
    rope.reset(0);
    dough.grow(0);
    after(GREETING_AT, () => {
      if (mode === 'play') raise(drama.greeting());
    });
  }

  function finish(ok: boolean, mine: number) {
    mode = 'epilogue';
    state.won = ok;
    show(tap, false);
    enter('epilogue');
    say(ok ? copy.msg.win : copy.msg.lose);
    keepBest(mine, ok);
    track('game_finished', { game: 'kata-piachy', result: ok ? 'win' : 'lose', pieces: mine });
    sound.cue(ok ? 'win' : 'lose');
    if (ok) cheer(1, 1600);

    /* The bubble that act II left up is cleared before the epilogue speaks, or
       the two overlap — drama.ts warns about exactly this. */
    clearBubble();

    show(epiEl, true);
    setText(verdictEl, ok ? copy.epilogue.win : copy.epilogue.lose);

    const speeches = drama.epilogue(ok);
    let at = 500;
    for (const sp of speeches) {
      const s = sp;
      after(at, () => {
        if (mode === 'epilogue') raise(s);
      });
      at += s.hold + 250;
    }

    after(3000, () => show(calendarEl, true));
    after(6000, () => show(docEl, true));
    after(6600, () => {
      show(againBtn, true);
      show(startBtn, false);
    });
  }

  /* ----------------------------------------------------- the frame loop --- */

  /** The core's own wildness, re-derived for the cord's benefit. Cosmetic: the
   *  swing itself is the core's and this only says how loosely the rope trails
   *  it. Kept in step with mechanics.wildness() so the two never disagree. */
  function wildOf(f: CoreFrame) {
    let total = 0;
    for (const b of f.buns) total += b.mass;
    if (total <= 0) return 0;
    const heft = clamp(total / K.DOUGH, 0.5, 1.5);
    const wild = (K.WILD_FULL + (1 - K.WILD_FULL) * (1 - f.massFrac)) / heft;
    return clamp((wild - K.WILD_LO) / (K.WILD_HI - K.WILD_LO), 0, 1);
  }

  function updatePieces(f: CoreFrame) {
    const playing = f.phase === 'swing' || f.phase === 'jump';
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      const gone = taken[i];
      const bun = f.buns[i];
      if (gone) {
        p.state = gone;
        p.bake = bun ? bun.bake : null;
        p.scale = bun ? bunScale(bun.size) : 1;
      } else if (bun) {
        p.state = 'hanging';
        p.bake = bun.bake;
        p.scale = bunScale(bun.size);
      } else {
        p.state = 'unbaked';
        p.bake = null;
        p.scale = 1;
      }
      p.targeted = playing && i === f.target;
    }
  }

  /** Who leans on whom. The three stand where scene.ts puts them, so which of
   *  them is pushing is read off their x against the player's rather than
   *  hard-coded: a shove toward +x comes from the ones standing to the left. */
  const SIDE: Record<AdvisorId, -1 | 1> = {
    hanna: ANCHORS.crowd.hanna < ANCHORS.player.x ? 1 : -1,
    symon: ANCHORS.crowd.symon < ANCHORS.player.x ? 1 : -1,
    alesik: ANCHORS.crowd.alesik < ANCHORS.player.x ? 1 : -1,
  };

  function updateCrowd(f: CoreFrame | null, at: number) {
    let push = 0;
    if (f && f.shoving && shoveSide !== 0) {
      const u = clamp((at - shoveFrom) / K.SHOVE_HOLD, 0, 1);
      /* wind up, then shove */
      push = u < 0.4 ? -(u / 0.4) * 0.3 : (u - 0.4) / 0.6;
    }
    for (const who of ['hanna', 'symon', 'alesik'] as AdvisorId[]) {
      crowd.lean[who] = push !== 0 && SIDE[who] === shoveSide ? push * shoveSide : 0;
    }
    const cu = cheerMs > 0 ? (at - cheerFrom) / cheerMs : 1;
    crowd.cheer = cu >= 1 || cu < 0 ? 0 : Math.sin(cu * Math.PI) * cheerPeak;
    crowd.speaking = live ? live.who : null;
  }

  function aim(a: Act) {
    const c = CAMERA[a];
    state.camera.x = c.x;
    state.camera.y = c.y;
    state.camera.zoom = c.zoom;
  }

  function easeView(raw: number) {
    const k = reduced ? 1 : 1 - Math.exp(-raw / 110);
    view.x += (state.camera.x - view.x) * k;
    view.y += (state.camera.y - view.y) * k;
    view.zoom += (state.camera.zoom - view.zoom) * k;
  }

  function frame(at: number) {
    raf = requestAnimationFrame(frame);
    let dt = at - last;
    last = at;
    if (!(dt > 0)) dt = 16.7;
    if (dt > 64) dt = 32;

    state.reducedMotion = reduced;
    state.t = at - mountedAt;

    if (mode === 'prologue') {
      const u = clamp((at - proFrom) / proMs, 0, 1);
      state.act = 'prologue';
      state.prologueT = u;
      state.dimness = 0;
      state.core = null;
      state.rope = null;
      state.dough = null;
      aim('prologue');
      if (!doorSaid && u >= DOOR_AT) {
        doorSaid = true;
        sound.cue('door');
      }
      if (u >= 1) skipPrologue();
    } else {
      const f = core.tick();
      state.core = f;
      state.prologueT = 1;

      const a = mode === 'idle' ? 'bake' : actOf(f);
      if (a !== act) enter(a);
      state.act = a;
      aim(a);

      /* 0 through act I, up across the handoff, held through act II, and back
         to a lit room for the epilogue. */
      state.dimness =
        a === 'handoff' ? clamp((at - hungAt) / K.HANDOFF, 0, 1) : a === 'bite' ? 1 : a === 'epilogue' ? 0.35 : 0;

      /* The chain is kept warm either way, but with motion turned down it is
         not what the room sees: the cord has to *step*, and a verlet chain
         eases between the steps — which would have the player aiming at a
         cord that is not where the bite is judged. Then the scene draws the
         straight analytic line, which is the line the bite is read off. */
      const chain = rope.step(dt, f.thetaDeg, wildOf(f));
      state.rope = reduced ? null : chain;

      if (f.phase === 'shape' && f.ballSize > 0.4) {
        const r = ballRadius(f.ballSize);
        /* the blob's underside stays on the board however big it gets — a
           centre fixed at the nominal radius would bury it in the plank */
        dough.setCentre(ANCHORS.ball.x, BOARD_Y + 1.5 - r);
        dough.grow(r);
        if (at - pokeAt > POKE_EVERY) {
          pokeAt = at;
          dough.poke(Math.random() * Math.PI * 2, 0.5);
          sound.cue(kneaded ? 'poke' : 'knead');
          kneaded = true;
          engine.burst('flour', ANCHORS.ball.x, BOARD_Y - r * 0.6, 3);
        }
        state.dough = dough.step(dt);
      } else {
        dough.grow(0);
        dough.step(dt);
        state.dough = null;
      }

      updatePieces(f);
      updateCrowd(f, at);
      hud(f);

      /* One bubble at a time, and the moment it goes down the room is asked
         whether anybody was waiting to answer it. */
      if (live && at >= live.until) {
        clearBubble();
        if (mode === 'play') raise(drama.followUp());
      }
      if (mode === 'play' && !tailAsked && f.making >= K.TAIL) {
        tailAsked = true;
        raise(drama.tailNext());
      }
    }

    if (mode === 'prologue') updateCrowd(null, at);

    easeView(dt);
    placeBubble();
    engine.render(state);
  }

  /* ------------------------------------------------------------- wiring --- */

  function press() {
    if (mode === 'prologue') return skipPrologue();
    if (mode !== 'play') return;
    core.press();
  }

  function release() {
    if (mode !== 'play') return;
    kneaded = false;
    core.release();
  }

  show(startBtn, true);
  setText(startBtn, copy.start);
  show(tap, false);
  show(proEl, false);
  show(epiEl, false);
  root.dataset.act = 'bake';
  root.dataset.phase = 'idle';
  say(copy.msg.idle);
  showBest();
  hud(null);

  startBtn.addEventListener('click', begin);
  againBtn?.addEventListener('click', begin);
  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    skipPrologue();
  });
  /* one tap anywhere on the title card is enough */
  proEl?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    skipPrologue();
  });

  tap.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    press();
  });
  /* The release is caught on the window: a hand that slides off the picture
     mid-knead still has to put its bun in the oven. */
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);

  if (soundBtn) {
    show(soundBtn, true);
    const label = () => {
      setText(soundBtn, sound.on ? copy.soundOn : copy.soundOff);
      soundBtn.setAttribute('aria-pressed', String(sound.on));
    };
    label();
    soundBtn.addEventListener('click', () => {
      sound.toggle();
      label();
      if (sound.on) ambientFor(act);
      else sound.hush();
    });
  }

  /* Two stage sizes, like a player: the page column, or the whole window. The
     engine letterboxes the scene into whichever box the CSS makes, and the
     bubbles already go through that same letterbox, so nothing else has to
     know. The width is measured off documentElement rather than taken as
     100vw, or the scrollbar would buy the page a second scrollbar. */
  if (viewBtn) {
    show(viewBtn, true);
    let wide = false;
    try {
      wide = localStorage.getItem('kata-view') === 'wide';
    } catch {
      /* private mode: the column it is */
    }
    const fitWide = () => {
      if (wide) root.style.setProperty('--kata-vw', `${document.documentElement.clientWidth}px`);
    };
    const applyView = () => {
      root.classList.toggle('is-wide', wide);
      fitWide();
      const lbl = wide ? copy.viewNormal : copy.viewWide;
      viewBtn.setAttribute('aria-label', lbl);
      viewBtn.title = lbl;
      viewBtn.setAttribute('aria-pressed', String(wide));
      engine.resize();
    };
    applyView();
    viewBtn.addEventListener('click', () => {
      wide = !wide;
      try {
        localStorage.setItem('kata-view', wide ? 'wide' : 'normal');
      } catch {
        /* the choice holds for this page view only */
      }
      applyView();
    });
    addEventListener('resize', fitWide);
  }

  /* A ride or a loaf interrupted by the visitor leaving the tab is given back
     rather than judged: the frame loop stops while the page is hidden, so the
     bite would land wherever the cat had drifted to, and the bun would come out
     of the oven as charcoal. */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      sound.hush();
      return;
    }
    last = performance.now();
    core.onVisible();
    rope.reset(state.core ? state.core.thetaDeg : 0);
    kneaded = false;
    shoveSide = 0;
    root.dataset.shove = '';
    ambientFor(act);
  });

  /* Space is the natural key for this, and it is the one the browser scrolls
     with — so it is claimed only while the game is in play, and only when the
     visitor is not on some other control. */
  const playable = () => mode === 'prologue' || (mode === 'play' && (core.phase === 'shape' || core.phase === 'bake' || core.phase === 'swing'));
  const spare = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    return !el || el === tap || !el.closest('button, a, input, textarea, select, [contenteditable]');
  };

  addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    if (e.repeat || !playable() || !spare(e)) return;
    e.preventDefault();
    press();
  });

  addEventListener('keyup', (e) => {
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    release();
  });

  raf = requestAnimationFrame(frame);
}
