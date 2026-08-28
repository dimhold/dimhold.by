/* «Ката пячы» rebuild — the shared contract.
 *
 * ORCHESTRATOR-OWNED. Every module in this directory imports from here and
 * none of them edits it. If your module needs the contract to move, say so in
 * your report; do not bend it sideways. The design itself is in
 * games/KATA-REBUILD.md.
 */

/* ------------------------------------------------------------- the stage --- */

/** Logical stage the scene is drawn on. CSS scales it; nothing else does. */
export const STAGE_W = 720;
export const STAGE_H = 480;

/** Mechanics still speak v1's 320-wide units. This maps them onto the stage. */
export const CORE_SCALE = 2.25;

/** Where the cord meets the beam, in stage units. (v1: x=160,y=24 core units.) */
export const PIVOT = { x: 360, y: 54 } as const;

/* ---------------------------------------------------------------- core ----- */

export type Bake = 'raw' | 'golden' | 'burnt';

export interface Bun {
  size: number;
  bake: Bake;
  /** Half-width of the mouthful this piece makes, in CORE units (v1 scale). */
  window: number;
  mass: number;
}

/** The core keeps v1's phases exactly; prologue/epilogue live in the director. */
export type CorePhase = 'idle' | 'shape' | 'bake' | 'hung' | 'swing' | 'jump' | 'over';

export type CoreEvent =
  | { type: 'started' }
  | { type: 'intoOven'; index: number; size: number }
  | { type: 'bunDone'; index: number; bun: Bun; doughLeft: number }
  | { type: 'doughOut' }
  | { type: 'hung' }
  | { type: 'swingStart' }
  | { type: 'shove'; dir: -1 | 1 }
  | { type: 'jump'; shoved: boolean }
  /** One bite, already judged. `tail` marks the piece that decides the game. */
  | { type: 'bite'; target: number; hit: boolean; tail: boolean; gap: number }
  | { type: 'pieceLost'; target: number }
  | { type: 'tailPhase'; tries: number }
  | { type: 'tailMiss'; triesLeft: number }
  | { type: 'finish'; won: boolean; mine: number; theirs: number };

export interface CoreOptions {
  now(): number;
  random(): number;
  /** prefers-reduced-motion, live. */
  stepped(): boolean;
  emit(e: CoreEvent): void;
}

/** Per-frame snapshot. Cheap, reused object allowed — consumers copy nothing. */
export interface CoreFrame {
  phase: CorePhase;
  /** Analytic cord angle in degrees. Authoritative for the bite, always. */
  thetaDeg: number;
  /** 0 when no ball is being shaped; core units otherwise. */
  ballSize: number;
  /** 0..1 while a bun is in the oven, else 0. */
  browning: number;
  /** Size of the bun in the oven, core units. */
  ovenSize: number;
  doughLeft: number;
  /** Index of the bun being made (0..5) while baking. */
  making: number;
  buns: readonly Bun[];
  /** Piece currently contested (0..5) during the biting act. */
  target: number;
  mine: number;
  theirs: number;
  tries: number;
  /** remaining/total mass of the hanging cat, 0..1, for the weight meter. */
  massFrac: number;
  /** Announced shove: direction while `shoving`, else 0. */
  shoveDir: -1 | 0 | 1;
  shoving: boolean;
  playerUp: boolean;
  /** Lateral shove applied to the current jump, in CORE units — v1's
   *  SHOVE_UNITS scale (0 if clean). Multiply by CORE_SCALE to draw. */
  playerShove: number;
  /** 0..1 progress of the current ride, 0 when grounded. */
  jumpT: number;
}

export interface Core {
  start(): void;
  press(): void;
  release(): void;
  /** Advance to `now()` and return the frame snapshot. Call once per raf. */
  tick(): CoreFrame;
  /** Call when the tab becomes visible again (v1 forgiveness rules). */
  onVisible(): void;
  readonly phase: CorePhase;
}

/* --------------------------------------------------------------- physics --- */

export interface Pt {
  x: number;
  y: number;
}

export interface Rope {
  /**
   * Advance the chain. `thetaDeg` is the analytic angle the tip is pulled
   * toward; `wild` 0..1 scales how loosely the chain trails it. Returns the
   * chain from pivot to tip in STAGE units, reused array. Always at least
   * two points — the scene derives the cat's frame from the last pair.
   */
  step(dtMs: number, thetaDeg: number, wild: number): readonly Pt[];
  /** Kick the chain (a bite, a hang) so it visibly reacts. */
  impulse(vx: number, vy: number): void;
  reset(thetaDeg: number): void;
}

export interface Dough {
  /** Current outline around its centre, STAGE units, reused array. */
  step(dtMs: number): readonly Pt[];
  /** Ball radius target, STAGE units. 0 collapses it. */
  grow(r: number): void;
  /** Dent at an angle (radians) with strength 0..1 — the kneading finger. */
  poke(angle: number, strength: number): void;
  setCentre(x: number, y: number): void;
}

/* ----------------------------------------------------------------- scene --- */

export type PieceState = 'unbaked' | 'hanging' | 'eaten' | 'lost';

export interface PieceView {
  state: PieceState;
  bake: Bake | null;
  /** 0.62..1.17 like v1's --bun-scale; 1 before baking. */
  scale: number;
  /** True while this piece is the contested target. */
  targeted: boolean;
}

export type AdvisorId = 'hanna' | 'symon' | 'alesik';

/** What each villager is doing this frame. Advisors double as shovers. */
export interface CrowdView {
  /** -1 leaning/shoving left, 1 right, 0 at rest — per advisor. */
  lean: Record<AdvisorId, number>;
  /** Who is currently speaking (mouth/gesture animation), if anyone. */
  speaking: AdvisorId | null;
  /** Everyone throws arms up (a hit, the win). 0..1 envelope. */
  cheer: number;
}

export type Act = 'prologue' | 'bake' | 'handoff' | 'bite' | 'epilogue';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface SceneState {
  act: Act;
  /** Milliseconds since mount. Advisory: the engine keeps its own
   *  hitstop-dilated clock for ambient motion and may ignore this. */
  t: number;
  /** Targets; the engine eases toward them (cuts, under reduced motion). */
  camera: Camera;
  /** 0 bright hearth → 1 dimmed-to-embers (act II). */
  dimness: number;
  core: CoreFrame | null;
  /** Physics cord, pivot→tip, stage units. null → draw straight at thetaDeg. */
  rope: readonly Pt[] | null;
  /** Live dough outline (stage units, centred where scene puts the ball). */
  dough: readonly Pt[] | null;
  pieces: readonly PieceView[];
  crowd: CrowdView;
  /** 0..1: how far the prologue has run (door, title card, entry). */
  prologueT: number;
  /** Win flag during the epilogue, null before it. */
  won: boolean | null;
  reducedMotion: boolean;
}

export type ParticleKind = 'flour' | 'spark' | 'crumb' | 'steam' | 'snow';

export interface Engine {
  /** Draw one frame. The engine owns raf externally — director calls this. */
  render(state: SceneState): void;
  /** Burst `n` particles of a kind at a stage point. Pools inside; no GC.
   *  A no-op under reduced motion — do not expect particles there. */
  burst(kind: ParticleKind, x: number, y: number, n: number): void;
  /** Freeze-frame for `ms` (the bite). Rendering continues, time dilates. */
  hitstop(ms: number): void;
  /** Screen-space kick for a shove/impact. */
  shake(strength: number): void;
  resize(): void;
  destroy(): void;
}

/* ----------------------------------------------------------------- drama --- */

export interface Speech {
  who: AdvisorId;
  /** Belarusian line, verbatim from copy. */
  be: string;
  /** Gloss in the page language ('' when the page is Belarusian). */
  gloss: string;
  /** ms the bubble stays. */
  hold: number;
}

/* ----------------------------------------------------------------- sound --- */

export type Cue =
  | 'knead'
  | 'poke'
  | 'oven'
  | 'doneRaw'
  | 'doneGolden'
  | 'doneBurnt'
  | 'hung'
  | 'jump'
  | 'hit'
  | 'miss'
  | 'shoveWarn'
  | 'advisor'
  | 'door'
  | 'win'
  | 'lose';

export type Ambient = 'fire' | 'wind' | 'crowd';

export interface Sound {
  readonly on: boolean;
  toggle(): boolean;
  cue(c: Cue): void;
  ambient(a: Ambient, on: boolean): void;
  /** Everything off (page hidden, game over). */
  hush(): void;
}
