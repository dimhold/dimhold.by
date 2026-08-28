/* «Ката пячы» — the выцінанка scene. Every path in the game is drawn here;
 * engine.ts only carries them to the screen.
 *
 * Two rules hold the whole file together.
 *
 * One: there is a single light, the mouth of the печ, and it never moves. Every
 * rim, every shadow and every gradient below is derived from FIRE — which is
 * why the room reads as one room and not as a pile of clip art. Cut paper is
 * lit by letting a lighter sheet peek out from behind a darker one, so almost
 * everything here is drawn twice: once shifted a couple of units toward the
 * fire in the rim tone, once in place in the body tone. That is `lit*()`.
 *
 * Two: nothing in the per-frame path allocates. Shapes are built by named
 * functions that take an offset rather than by closures or fresh Path2D, the
 * gradients are made once in stage units and reused, and the cut-paper
 * ornaments are rasterised into offscreen tiles when the layers are cached.
 *
 * Coordinates are stage units (720×480) except inside drawCat, which switches
 * into v1's core units so the piece geometry can be copied across unchanged.
 */
import {
  CORE_SCALE,
  PIVOT,
  STAGE_H,
  STAGE_W,
  type AdvisorId,
  type Bake,
  type ParticleKind,
  type SceneState,
} from './types';

export type C2D = CanvasRenderingContext2D;

/** What the engine hands every draw call: dilated clock, fire, mood. */
export interface Paint {
  /** Engine clock in ms — dilated by hitstop, frozen never. */
  t: number;
  /** 0..1 value-noise fire intensity for this frame. 0.5 is the mean. */
  flick: number;
  /** SceneState.dimness, already eased. */
  dim: number;
  reduced: boolean;
}

/* ------------------------------------------------------------- palette --- */
/* Dyed paper, not ink: no pure black, no pure white. Five darkness steps carry
   the depth — ceiling and back wall are the far ones, the crowd and the
   foreground the near ones. */

const C = {
  night: '#100a05',
  ceil: '#160e06',
  wallFar: '#1d1309',
  wallMid: '#2a1a0c',
  wallNear: '#3b2410',
  seam: '#0d0704',
  beam: '#20140a',
  beamLit: '#5a3413',
  floorD: '#170e06',
  floorM: '#2a1a0b',
  floorL: '#573514',

  stoveD: '#3d2a13',
  stoveM: '#7b5527',
  stoveL: '#bb8b44',
  stoveHi: '#eec27a',
  mouth: '#0a0503',

  woodD: '#241608',
  woodM: '#452b12',
  woodL: '#784c20',

  figD: '#130c05',
  figM: '#291809',
  figL: '#48290f',
  cloth: '#5d3413',
  rim: '#d99347',
  rimHot: '#f3bd6c',
  rimCool: '#8d7f9e',

  ivory: '#f0ddb4',
  ivoryD: '#c8a76e',
  ivorySoft: '#a98a58',

  skyDeep: '#0d1626',
  skyMid: '#182842',
  skyLow: '#28405f',
  snow: '#d7e5f6',
  moon: '#e8eef8',
  paneWarm: '#e9a43c',
} as const;

/* The three bakes have to be told apart across a dimmed room, so they are three
   clearly separated values, not three browns: pale crumb, amber crust, dark
   umber. Burnt is never black — char over bread still has bread inside it, and
   its `score` is *lighter* than its body, because that is what a split crust
   shows. `seam` is how wide the knife cuts are drawn: the darker the loaf, the
   more it has to be carried by its seams. */
const BAKE_TONE: Record<Bake, { body: string; blush: string; rim: string; score: string; seam: number }> = {
  raw: { body: '#d7ba89', blush: '#b99b6c', rim: '#f7e7bd', score: '#96784b', seam: 1.3 },
  golden: { body: '#c8823a', blush: '#a05e1f', rim: '#ffd48f', score: '#6d3f13', seam: 1.6 },
  burnt: { body: '#4f3116', blush: '#35200c', rim: '#a96c34', score: '#c99450', seam: 2.3 },
};

/* ------------------------------------------------------------ geometry --- */

const TAU = Math.PI * 2;
const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Smootherstep — used everywhere a pose has to ease rather than snap. */
const ease = (u: number) => {
  const t = clamp(u, 0, 1);
  return t * t * (3 - 2 * t);
};

const CEIL_H = 34;
const BEAM_Y = 34;
const BEAM_H = 46;
const WALL_Y = BEAM_Y + BEAM_H;
const FLOOR_Y = 396;
/** Where the villagers' feet meet the boards. */
const BASE_Y = 432;

/** The one light. Inside the печ's mouth, on the left of the hearth. */
export const FIRE = { x: 110, y: 354 } as const;

const STOVE = { x0: 14, x1: 250, top: 158, base: 404 };
const MOUTH = { x0: 74, x1: 184, floor: 366, apex: 276 };
const WINDOW = { x: 250, y: 116, w: 84, h: 76 };
const TABLE = { x0: 486, x1: 716, top: 318, plank: 14, legY: 424 };
const TROUGH = { x0: 566, x1: 700, top: 252, bottom: 318, inset: 16 };
/* The board lies *on* the plank: its slab overlaps the plank's top edge by a
   couple of units, and `y` is the surface the dough is kneaded against. Every
   ball in the scene is seated on this number, never on a centre of its own. */
const BOARD = { x0: 488, x1: 572, y: 308, h: 12 };

/** Points the director needs to aim physics and particles at. */
export const ANCHORS = {
  fire: FIRE,
  pivot: PIVOT,
  /** Centre of the ball being kneaded — sat on BOARD.y at its nominal radius,
   *  so the physics blob and the drawn ball share one contact line. */
  ball: { x: 530, y: 292 },
  /** Where a bun sits on the hearth floor while it browns. */
  ovenBun: { x: 152, y: 354 },
  /** Middle of the дзяжа's dough. */
  trough: { x: 633, y: 268 },
  player: { x: 360, y: BASE_Y },
  crowd: { hanna: 232, symon: 452, alesik: 300 },
  baseY: BASE_Y,
} as const;

/* -------------------------------------------------- light, as a helper --- */
/* The current light point, in whatever coordinate space the caller is in. Cat
   pieces are drawn in a rotated frame, so drawCat moves the light with them
   rather than un-rotating every shape. */

let LX: number = FIRE.x;
let LY: number = FIRE.y;
/** Stage units per unit of the caller's space — the cat draws in core units. */
let LU = 1;
let FX = 0;
let FY = 0;
let FD = 0;

function setLight(x: number, y: number, unit = 1): void {
  LX = x;
  LY = y;
  LU = unit;
}

/** Unit vector from the light to (x,y) — i.e. the direction of shadow. */
function fireDir(x: number, y: number): void {
  const dx = x - LX;
  const dy = y - LY;
  const m = Math.hypot(dx, dy) || 1;
  FX = dx / m;
  FY = dy / m;
  FD = m * LU;
}

/* The hearth is stoked through act I and banked to embers for act II, so the
   falloff is not a constant: it is how far the fire is throwing this frame. */
let DIMMED = 0;
/* Act II hangs a second, colder light over the play area (drawLight puts it
   there). It is far too weak to model properly, but it does one job the room
   needs: it puts a thin cold edge on the side of every figure the hearth
   cannot reach, so five dark shapes stop being one dark mass. */
let COOL = 0;

/** Called once a frame before anything is drawn. */
export function setMood(dim: number): void {
  DIMMED = clamp(dim, 0, 1);
  COOL = clamp((DIMMED - 0.12) / 0.7, 0, 1);
}

/** How bright the last fireDir()'s rim may be. One fire, one falloff, and no
 *  object anywhere in the room gets a rim it has not been given. */
function rimA(): number {
  return clamp(0.12 + (1 - FD / (660 - DIMMED * 260)) * 0.96, 0.08, 1);
}

/** Alpha of the cold counter-rim for the last fireDir(). Strongest where the
 *  hearth is weakest — it is a fill light, not a second sun. */
function coolA(): number {
  if (COOL < 0.01) return 0;
  return COOL * clamp(0.06 + (FD / 520) * 0.28, 0, 0.3);
}

/** 1 at the hearth, falling to ~0 at the far corner. Drives every rim's alpha. */
function reach(x: number, y: number): number {
  const d = Math.hypot(x - FIRE.x, y - FIRE.y);
  return clamp(1 - d / 620, 0, 1);
}

/* -------------------------------------------------- cut-paper primitives --- */

function ellipsePath(ctx: C2D, x: number, y: number, rx: number, ry: number, rot: number): void {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
}

/** The signature move: a rim sheet peeking out toward the fire, body on top. */
function litEllipse(
  ctx: C2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  rot: number,
  body: string,
  rim: string,
  amt: number,
): void {
  fireDir(x, y);
  const ca = coolA();
  if (ca > 0) {
    ellipsePath(ctx, x + FX * amt * 0.55, y + FY * amt * 0.55, rx, ry, rot);
    ctx.globalAlpha = ca;
    ctx.fillStyle = C.rimCool;
    ctx.fill();
  }
  ellipsePath(ctx, x - FX * amt, y - FY * amt, rx, ry, rot);
  ctx.globalAlpha = rimA();
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.globalAlpha = 1;
  ellipsePath(ctx, x, y, rx, ry, rot);
  ctx.fillStyle = body;
  ctx.fill();
}

/** Scratch for polygon shapes — reused, so nothing allocates mid-frame. */
const SC = new Float64Array(128);

function polyPath(ctx: C2D, n: number, dx: number, dy: number): void {
  ctx.beginPath();
  ctx.moveTo(SC[0] + dx, SC[1] + dy);
  for (let i = 1; i < n; i++) ctx.lineTo(SC[i * 2] + dx, SC[i * 2 + 1] + dy);
  ctx.closePath();
}

/** Fill SC's polygon twice: rim toward the fire, body in place. */
function litPoly(ctx: C2D, n: number, cx: number, cy: number, body: string, rim: string, amt: number): void {
  fireDir(cx, cy);
  const ca = coolA();
  if (ca > 0) {
    polyPath(ctx, n, FX * amt * 0.55, FY * amt * 0.55);
    ctx.globalAlpha = ca;
    ctx.fillStyle = C.rimCool;
    ctx.fill();
  }
  polyPath(ctx, n, -FX * amt, -FY * amt);
  ctx.globalAlpha = rimA();
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.globalAlpha = 1;
  polyPath(ctx, n, 0, 0);
  ctx.fillStyle = body;
  ctx.fill();
}

/** A rounded slab — the beam, the plank, the печ's ledge. */
function slabPath(ctx: C2D, x: number, y: number, w: number, h: number, r: number, dx: number, dy: number): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.roundRect(x + dx, y + dy, w, h, rr);
}

function litSlab(
  ctx: C2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  body: string,
  rim: string,
  amt: number,
): void {
  fireDir(x + w / 2, y + h / 2);
  const ca = coolA();
  if (ca > 0) {
    slabPath(ctx, x, y, w, h, r, FX * amt * 0.55, FY * amt * 0.55);
    ctx.globalAlpha = ca;
    ctx.fillStyle = C.rimCool;
    ctx.fill();
  }
  slabPath(ctx, x, y, w, h, r, -FX * amt, -FY * amt);
  ctx.globalAlpha = rimA();
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.globalAlpha = 1;
  slabPath(ctx, x, y, w, h, r, 0, 0);
  ctx.fillStyle = body;
  ctx.fill();
}

/* Curved shapes have to be drawn twice at two offsets, and a canvas path is
   frozen into device space the moment it is built — so the shape is recorded
   into this buffer and replayed, rather than built once and translated. */

const PB = new Float64Array(320);
let pbn = 0;

function pbStart(): void {
  pbn = 0;
}
function pbM(x: number, y: number): void {
  PB[pbn++] = 0;
  PB[pbn++] = x;
  PB[pbn++] = y;
}
function pbL(x: number, y: number): void {
  PB[pbn++] = 1;
  PB[pbn++] = x;
  PB[pbn++] = y;
}
function pbQ(cx: number, cy: number, x: number, y: number): void {
  PB[pbn++] = 2;
  PB[pbn++] = cx;
  PB[pbn++] = cy;
  PB[pbn++] = x;
  PB[pbn++] = y;
}

function pbReplay(ctx: C2D, dx: number, dy: number): void {
  ctx.beginPath();
  let i = 0;
  while (i < pbn) {
    const op = PB[i++];
    if (op === 0) ctx.moveTo(PB[i++] + dx, PB[i++] + dy);
    else if (op === 1) ctx.lineTo(PB[i++] + dx, PB[i++] + dy);
    else ctx.quadraticCurveTo(PB[i++] + dx, PB[i++] + dy, PB[i++] + dx, PB[i++] + dy);
  }
  ctx.closePath();
}

/** Fill the recorded shape twice: rim toward the fire, body in place. */
function litPB(ctx: C2D, cx: number, cy: number, body: string, rim: string, amt: number): void {
  fireDir(cx, cy);
  const ca = coolA();
  if (ca > 0) {
    pbReplay(ctx, FX * amt * 0.55, FY * amt * 0.55);
    ctx.globalAlpha = ca;
    ctx.fillStyle = C.rimCool;
    ctx.fill();
  }
  pbReplay(ctx, -FX * amt, -FY * amt);
  ctx.globalAlpha = rimA();
  ctx.fillStyle = rim;
  ctx.fill();
  ctx.globalAlpha = 1;
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = body;
  ctx.fill();
}

/** Floor shadow: away from the fire, longer the further off the object stands. */
function castShadow(ctx: C2D, x: number, y: number, w: number, alpha: number): void {
  const away = x < FIRE.x ? -1 : 1;
  const d = clamp(Math.abs(x - FIRE.x) / 460, 0, 1);
  const len = w * (1.1 + d * 1.5);
  ctx.beginPath();
  ctx.ellipse(x + away * len * 0.45, y, len, w * 0.3, 0, 0, TAU);
  ctx.fillStyle = `rgba(8,4,2,${alpha * (1 - d * 0.45)})`;
  ctx.fill();
}

/* ------------------------------------------------- cached gradient bank --- */
/* Stage units never change, so these outlive every resize. Anything that has to
   pulse is built at unit radius and scaled by the transform instead. */

interface Bank {
  wall: CanvasGradient;
  floor: CanvasGradient;
  stove: CanvasGradient;
  mouth: CanvasGradient;
  glow: CanvasGradient;
  coal: CanvasGradient;
  cool: CanvasGradient;
  vign: CanvasGradient;
  base: CanvasGradient;
  pane: CanvasGradient;
  sky: CanvasGradient;
  trough: CanvasGradient;
}
let bank: Bank | null = null;

function bk(ctx: C2D): Bank {
  if (bank) return bank;
  const wall = ctx.createRadialGradient(FIRE.x, FIRE.y - 40, 20, FIRE.x, FIRE.y - 40, 580);
  wall.addColorStop(0, C.wallNear);
  wall.addColorStop(0.3, C.wallMid);
  wall.addColorStop(0.68, C.wallFar);
  wall.addColorStop(1, '#120b06');

  const floor = ctx.createRadialGradient(FIRE.x + 30, FLOOR_Y + 40, 20, FIRE.x + 30, FLOOR_Y + 40, 560);
  floor.addColorStop(0, C.floorL);
  floor.addColorStop(0.3, C.floorM);
  floor.addColorStop(1, C.floorD);

  const stove = ctx.createRadialGradient(FIRE.x, FIRE.y - 10, 14, FIRE.x, FIRE.y - 10, 260);
  stove.addColorStop(0, C.stoveHi);
  stove.addColorStop(0.24, C.stoveL);
  stove.addColorStop(0.52, C.stoveM);
  stove.addColorStop(0.82, C.stoveD);
  stove.addColorStop(1, '#241708');

  const mouth = ctx.createRadialGradient(FIRE.x, FIRE.y, 6, FIRE.x, FIRE.y, 120);
  mouth.addColorStop(0, '#6d2c08');
  mouth.addColorStop(0.5, '#2a1104');
  mouth.addColorStop(1, C.mouth);

  /* Unit glow: drawn translated+scaled so the flicker never rebuilds it. */
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  glow.addColorStop(0, 'rgba(255,206,126,0.95)');
  glow.addColorStop(0.18, 'rgba(238,150,54,0.52)');
  glow.addColorStop(0.46, 'rgba(158,72,20,0.20)');
  glow.addColorStop(1, 'rgba(90,34,8,0)');

  /* the coals themselves: orange all the way in, or they blow out to white */
  const coal = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  coal.addColorStop(0, 'rgba(255,138,32,0.8)');
  coal.addColorStop(0.35, 'rgba(214,86,16,0.4)');
  coal.addColorStop(1, 'rgba(120,40,8,0)');

  const cool = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  cool.addColorStop(0, 'rgba(255,214,150,0.55)');
  cool.addColorStop(0.3, 'rgba(150,132,164,0.28)');
  cool.addColorStop(1, 'rgba(60,58,90,0)');

  const vign = ctx.createRadialGradient(360, 300, 130, 360, 300, 500);
  vign.addColorStop(0, 'rgba(6,3,1,0)');
  vign.addColorStop(0.55, 'rgba(6,3,1,0.24)');
  vign.addColorStop(1, 'rgba(4,2,1,0.86)');

  const base = ctx.createLinearGradient(0, STAGE_H - 130, 0, STAGE_H);
  base.addColorStop(0, 'rgba(6,3,1,0)');
  base.addColorStop(1, 'rgba(6,3,1,0.62)');

  const pane = ctx.createLinearGradient(0, WINDOW.y, 0, WINDOW.y + WINDOW.h);
  pane.addColorStop(0, C.skyDeep);
  pane.addColorStop(0.62, C.skyMid);
  pane.addColorStop(1, C.skyLow);

  const sky = ctx.createLinearGradient(0, 0, 0, STAGE_H);
  sky.addColorStop(0, '#080d18');
  sky.addColorStop(0.42, C.skyDeep);
  sky.addColorStop(0.78, C.skyMid);
  sky.addColorStop(1, '#0b1120');

  const trough = ctx.createLinearGradient(TROUGH.x0, 0, TROUGH.x1, 0);
  trough.addColorStop(0, C.woodM);
  trough.addColorStop(0.35, C.woodD);
  trough.addColorStop(1, '#160d05');

  bank = { wall, floor, stove, mouth, glow, coal, cool, vign, base, pane, sky, trough };
  return bank;
}

/* --------------------------------------------------------- выцінанка ----- */
/* Real paper-cutting is fold-and-cut, so these are built by rotational
   symmetry and then punched through with destination-out. Rasterised into a
   tile once per layer cache — never per frame. */

function cut(g: C2D): void {
  g.globalCompositeOperation = 'destination-out';
}
function add(g: C2D): void {
  g.globalCompositeOperation = 'source-over';
}

function petal(g: C2D, r0: number, r1: number, wide: number): void {
  g.beginPath();
  g.moveTo(0, -r0);
  g.quadraticCurveTo(wide, -(r0 + r1) / 2, 0, -r1);
  g.quadraticCurveTo(-wide, -(r0 + r1) / 2, 0, -r0);
  g.closePath();
}

function starPath(g: C2D, points: number, r0: number, r1: number): void {
  g.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * TAU - Math.PI / 2;
    const r = i % 2 ? r0 : r1;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
}

/** A pinned wall rosette: toothed rim, eight petals, a cut star at the centre. */
function makeRosette(size: number, folds: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const g = cv.getContext('2d');
  if (!g) return cv;
  const R = size / 2 - 1;
  g.translate(size / 2, size / 2);
  g.fillStyle = '#fff';

  starPath(g, folds * 2, R * 0.82, R);
  g.fill();
  g.beginPath();
  g.arc(0, 0, R * 0.86, 0, TAU);
  g.fill();

  for (let i = 0; i < folds; i++) {
    g.save();
    g.rotate((i / folds) * TAU);
    petal(g, R * 0.2, R * 0.98, R * 0.19);
    g.fill();
    g.restore();
  }

  cut(g);
  /* the ring of holes that makes it read as cut and not as a blob */
  g.beginPath();
  g.arc(0, 0, R * 0.7, 0, TAU);
  g.arc(0, 0, R * 0.58, 0, TAU, true);
  g.fill('evenodd');
  for (let i = 0; i < folds; i++) {
    g.save();
    g.rotate((i / folds) * TAU + Math.PI / folds);
    petal(g, R * 0.24, R * 0.54, R * 0.1);
    g.fill();
    g.beginPath();
    g.ellipse(0, -R * 0.82, R * 0.055, R * 0.13, 0, 0, TAU);
    g.fill();
    g.restore();
  }
  for (let i = 0; i < folds; i++) {
    g.save();
    g.rotate((i / folds) * TAU);
    petal(g, R * 0.74, R * 0.93, R * 0.055);
    g.fill();
    g.restore();
  }
  starPath(g, folds, R * 0.07, R * 0.17);
  g.fill();

  add(g);
  return cv;
}

/** Small beam stars — the ones already cut for last winter and left up. */
function makeBeamStar(size: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const g = cv.getContext('2d');
  if (!g) return cv;
  const R = size / 2 - 0.5;
  g.translate(size / 2, size / 2);
  g.fillStyle = '#fff';
  starPath(g, 8, R * 0.42, R);
  g.fill();
  cut(g);
  starPath(g, 4, R * 0.08, R * 0.3);
  g.fill();
  add(g);
  return cv;
}

/** Tint a white mask with the fire falling across it. */
function tinted(tile: HTMLCanvasElement, x: number, y: number): HTMLCanvasElement {
  const g = tile.getContext('2d');
  if (!g) return tile;
  const away = x < FIRE.x ? -1 : 1;
  const grad = g.createLinearGradient(away < 0 ? tile.width : 0, 0, away < 0 ? 0 : tile.width, 0);
  const lit = reach(x, y);
  grad.addColorStop(0, C.ivory);
  grad.addColorStop(1, lit > 0.35 ? C.ivoryD : C.ivorySoft);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = grad;
  g.fillRect(0, 0, tile.width, tile.height);
  g.globalCompositeOperation = 'source-over';
  return tile;
}

/* ------------------------------------------------------ deterministic rng -- */
/* The wall's log heights, the floor's seams and the snow all have to be the
   same on every cache rebuild, so nothing here calls Math.random. */

function hash(n: number): number {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/* =========================================================== back layer === */
/* Ceiling, бэлька, the log wall, the window and the pinned ornaments, plus the
   floor boards. Cached; the fire is baked in because the fire never moves. */

export function paintBack(ctx: C2D): void {
  const g = bk(ctx);

  ctx.fillStyle = C.night;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  /* --- the log wall, lit from the lower left --- */
  ctx.fillStyle = g.wall;
  ctx.fillRect(0, WALL_Y, STAGE_W, FLOOR_Y - WALL_Y);

  let y = WALL_Y;
  let row = 0;
  while (y < FLOOR_Y) {
    const h = 26 + hash(row * 7 + 3) * 12;
    const bot = Math.min(y + h, FLOOR_Y);
    /* the underside of every log catches the hearth; the top of it does not */
    const mid = (y + bot) / 2;
    const grad = ctx.createLinearGradient(0, y, 0, bot);
    const l = reach(FIRE.x, mid);
    grad.addColorStop(0, `rgba(9,5,2,${0.34 + l * 0.14})`);
    grad.addColorStop(0.55, 'rgba(9,5,2,0)');
    grad.addColorStop(1, `rgba(224,150,70,${0.05 + l * 0.07})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, STAGE_W, bot - y);

    ctx.fillStyle = C.seam;
    ctx.fillRect(0, bot - 1.6, STAGE_W, 1.6);
    y = bot;
    row++;
  }

  /* corner posts: the near one on the right is a whole darkness step forward */
  ctx.fillStyle = 'rgba(10,6,3,0.55)';
  ctx.fillRect(0, WALL_Y, 16, FLOOR_Y - WALL_Y);
  ctx.fillRect(STAGE_W - 22, WALL_Y, 22, FLOOR_Y - WALL_Y);

  paintWindow(ctx);

  /* --- ornaments, pinned where a real hata puts them: high and off-centre --- */
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.drawImage(tinted(makeRosette(74, 8), 442, 148), 405, 111, 74, 74);
  ctx.globalAlpha = 0.26;
  ctx.drawImage(tinted(makeRosette(54, 6), 606, 156), 579, 129, 54, 54);
  ctx.globalAlpha = 0.2;
  ctx.drawImage(tinted(makeRosette(40, 8), 664, 246), 644, 226, 40, 40);
  ctx.globalAlpha = 0.34;
  ctx.drawImage(tinted(makeRosette(46, 6), 186, 128), 163, 105, 46, 46);
  ctx.restore();

  /* --- the floor --- */
  ctx.fillStyle = g.floor;
  ctx.fillRect(0, FLOOR_Y, STAGE_W, STAGE_H - FLOOR_Y);
  ctx.fillStyle = 'rgba(8,4,2,0.5)';
  ctx.fillRect(0, FLOOR_Y, STAGE_W, 3);
  for (let i = 0; i < 7; i++) {
    const by = FLOOR_Y + 8 + i * i * 2.1 + i * 5;
    if (by > STAGE_H) break;
    ctx.fillStyle = `rgba(8,4,2,${0.22 + i * 0.04})`;
    ctx.fillRect(0, by, STAGE_W, 1.4);
    ctx.fillStyle = `rgba(214,146,68,${0.05 * reach(FIRE.x, by)})`;
    ctx.fillRect(0, by - 1.6, STAGE_W, 1.2);
  }
  for (let i = 0; i < 9; i++) {
    const bx = hash(i * 13 + 5) * STAGE_W;
    const by = FLOOR_Y + 10 + hash(i * 5 + 1) * (STAGE_H - FLOOR_Y - 14);
    ctx.fillStyle = 'rgba(8,4,2,0.3)';
    ctx.fillRect(bx, by, 1.3, 16);
  }

  paintBeam(ctx);
}

function paintWindow(ctx: C2D): void {
  const g = bk(ctx);
  const { x, y, w, h } = WINDOW;
  /* the reveal, cut back through the logs */
  ctx.fillStyle = 'rgba(7,4,2,0.8)';
  ctx.fillRect(x - 9, y - 9, w + 18, h + 18);
  ctx.fillStyle = g.pane;
  ctx.fillRect(x, y, w, h);

  /* a couple of far stars, so the pane is not flat blue */
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(215,229,246,${0.2 + hash(i * 3) * 0.3})`;
    ctx.fillRect(x + 6 + hash(i * 11) * (w - 12), y + 6 + hash(i * 17) * (h * 0.4), 1.4, 1.4);
  }

  /* frame: four members, each rim-lit on its hearth side */
  ctx.fillStyle = C.woodD;
  ctx.fillRect(x - 8, y - 8, w + 16, 8);
  ctx.fillRect(x - 8, y + h, w + 16, 8);
  ctx.fillRect(x - 8, y, 8, h);
  ctx.fillRect(x + w, y, 8, h);
  ctx.fillStyle = `rgba(226,158,78,${0.28 * reach(x, y + h)})`;
  ctx.fillRect(x - 8, y + h, w + 16, 2.4);
  ctx.fillRect(x - 8, y, 2.4, h);
  /* the glazing bar */
  ctx.fillStyle = C.woodD;
  ctx.fillRect(x + w / 2 - 2, y, 4, h);
  ctx.fillRect(x, y + h * 0.5 - 2, w, 4);
}

function paintBeam(ctx: C2D): void {
  /* the ceiling boards behind it */
  ctx.fillStyle = C.ceil;
  ctx.fillRect(0, 0, STAGE_W, CEIL_H + 4);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = 'rgba(6,3,1,0.6)';
    ctx.fillRect(i * 74 + 12, 0, 1.6, CEIL_H + 4);
  }

  /* бэлька: the one beam the cat gets hung from */
  litSlab(ctx, -6, BEAM_Y, STAGE_W + 12, BEAM_H, 5, C.beam, C.beamLit, 3);
  const grad = ctx.createLinearGradient(0, BEAM_Y, 0, BEAM_Y + BEAM_H);
  grad.addColorStop(0, 'rgba(6,3,1,0.55)');
  grad.addColorStop(0.62, 'rgba(6,3,1,0)');
  grad.addColorStop(1, 'rgba(226,150,66,0.16)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, BEAM_Y, STAGE_W, BEAM_H);
  /* adze marks */
  for (let i = 0; i < 22; i++) {
    ctx.fillStyle = `rgba(8,4,2,${0.16 + hash(i * 9) * 0.2})`;
    ctx.fillRect(hash(i * 3 + 2) * STAGE_W, BEAM_Y + 6 + hash(i * 7) * (BEAM_H - 14), 22 + hash(i) * 30, 1.3);
  }

  for (let i = 0; i < 9; i++) {
    const sx = 36 + i * 82 + hash(i * 5) * 12;
    const sz = 15 + hash(i * 3) * 5;
    const tile = tinted(makeBeamStar(Math.round(sz)), sx, BEAM_Y + 24);
    ctx.save();
    ctx.globalAlpha = 0.16 + reach(sx, BEAM_Y + 24) * 0.34;
    ctx.drawImage(tile, sx - sz / 2, BEAM_Y + 16, sz, sz);
    ctx.restore();
  }

  /* the peg the cord is tied to */
  litEllipse(ctx, PIVOT.x, PIVOT.y + 12, 8, 6, 0, C.woodD, C.rimHot, 2);
}

/* ============================================================ set layer === */
/* The печ, its chimney, the качарга, the table with the дзяжа and the board.
   Everything a body can stand behind. */

export function paintSet(ctx: C2D): void {
  const g = bk(ctx);

  paintStove(ctx, g);
  paintTable(ctx, g);
}

function stoveBodyPath(ctx: C2D, dx: number, dy: number): void {
  const { x0, x1, top, base } = STOVE;
  ctx.beginPath();
  ctx.moveTo(x0 + dx, base + dy);
  ctx.lineTo(x0 + dx, top + 30 + dy);
  ctx.quadraticCurveTo(x0 + dx, top + dy, x0 + 34 + dx, top + dy);
  ctx.lineTo(x1 - 26 + dx, top + dy);
  ctx.quadraticCurveTo(x1 + dx, top + dy, x1 + dx, top + 26 + dy);
  ctx.lineTo(x1 + dx, base + dy);
  ctx.closePath();
}

function mouthPath(ctx: C2D, dx: number, dy: number, inset: number): void {
  const x0 = MOUTH.x0 + inset;
  const x1 = MOUTH.x1 - inset;
  const apex = MOUTH.apex + inset;
  ctx.beginPath();
  ctx.moveTo(x0 + dx, MOUTH.floor + dy);
  ctx.lineTo(x0 + dx, apex + 34 + dy);
  ctx.quadraticCurveTo(x0 + dx, apex + dy, (x0 + x1) / 2 + dx, apex + dy);
  ctx.quadraticCurveTo(x1 + dx, apex + dy, x1 + dx, apex + 34 + dy);
  ctx.lineTo(x1 + dx, MOUTH.floor + dy);
  ctx.closePath();
}

function paintStove(ctx: C2D, g: Bank): void {
  const { x0, x1, top, base } = STOVE;

  /* chimney first — it goes behind the beam */
  litSlab(ctx, 140, WALL_Y - 4, 84, top - WALL_Y + 26, 4, C.stoveD, C.stoveM, 2.5);
  litSlab(ctx, 132, WALL_Y + 52, 100, 16, 3, C.stoveD, C.stoveL, 2.5);

  /* the mass, whitewashed, with the fire falling off it */
  stoveBodyPath(ctx, 0, 0);
  ctx.fillStyle = g.stove;
  ctx.fill();
  /* the mass reads as mass only if its top goes away into the dark */
  ctx.save();
  stoveBodyPath(ctx, 0, 0);
  ctx.clip();
  const fall = ctx.createLinearGradient(0, top - 6, 0, top + 150);
  fall.addColorStop(0, 'rgba(10,6,3,0.86)');
  fall.addColorStop(1, 'rgba(10,6,3,0)');
  ctx.fillStyle = fall;
  ctx.fillRect(x0 - 20, top - 10, x1 - x0 + 40, 170);
  ctx.restore();

  /* lime-wash texture: broad vertical strokes, only where the light reaches */
  ctx.save();
  stoveBodyPath(ctx, 0, 0);
  ctx.clip();
  for (let i = 0; i < 34; i++) {
    const sx = x0 + hash(i * 5 + 1) * (x1 - x0);
    const sy = top + hash(i * 11) * (base - top);
    const l = reach(sx, sy);
    ctx.fillStyle = `rgba(255,222,166,${0.03 + l * 0.05})`;
    ctx.fillRect(sx, sy, 3 + hash(i * 3) * 9, 20 + hash(i * 7) * 46);
    ctx.fillStyle = `rgba(40,20,8,${0.04 + (1 - l) * 0.07})`;
    ctx.fillRect(sx + 8, sy + 10, 2 + hash(i * 13) * 6, 16 + hash(i * 17) * 30);
  }
  ctx.restore();

  /* the ляжанка's edge and the ledge over the mouth (прыпечак) */
  litSlab(ctx, x0 - 6, top - 2, x1 - x0 + 12, 15, 4, C.stoveM, C.stoveHi, 2.5);
  litSlab(ctx, x0 - 10, 250, x1 - x0 + 22, 17, 4, C.stoveM, C.stoveHi, 3);
  ctx.fillStyle = 'rgba(10,5,2,0.42)';
  ctx.fillRect(x0 - 8, 267, x1 - x0 + 18, 8);

  /* печурка — the drying niche */
  litSlab(ctx, 30, 292, 36, 40, 3, '#120a04', C.stoveHi, 2);
  /* the base skirt, a step forward and so a step darker */
  litSlab(ctx, x0 - 12, base - 26, x1 - x0 + 24, 30, 4, C.stoveD, C.stoveL, 2.5);

  /* --- the mouth: the hole everything else in the room is lit by --- */
  mouthPath(ctx, 0, 0, -5);
  ctx.fillStyle = C.stoveHi;
  ctx.fill();
  mouthPath(ctx, 0, 0, 0);
  ctx.fillStyle = g.mouth;
  ctx.fill();
  /* soot creeping up the arch */
  ctx.save();
  mouthPath(ctx, 0, 0, -14);
  ctx.clip();
  const soot = ctx.createLinearGradient(0, MOUTH.apex - 22, 0, MOUTH.apex + 40);
  soot.addColorStop(0, 'rgba(10,5,2,0.75)');
  soot.addColorStop(1, 'rgba(10,5,2,0)');
  ctx.fillStyle = soot;
  ctx.fillRect(MOUTH.x0 - 20, MOUTH.apex - 30, MOUTH.x1 - MOUTH.x0 + 40, 80);
  ctx.restore();

  /* the hearth floor inside, catching the fire */
  ctx.save();
  mouthPath(ctx, 0, 0, 0);
  ctx.clip();
  const pod = ctx.createLinearGradient(0, MOUTH.floor - 26, 0, MOUTH.floor);
  pod.addColorStop(0, 'rgba(120,52,14,0)');
  pod.addColorStop(1, 'rgba(158,78,22,0.42)');
  ctx.fillStyle = pod;
  ctx.fillRect(MOUTH.x0, MOUTH.floor - 30, MOUTH.x1 - MOUTH.x0, 30);
  ctx.restore();

  /* --- качарга and chapelka, leaning where they are always left --- */
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#150d05';
  ctx.lineWidth = 4.4;
  ctx.beginPath();
  ctx.moveTo(238, base - 4);
  ctx.lineTo(216, 234);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,196,120,0.5)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(235.8, base - 6);
  ctx.lineTo(213.8, 236);
  ctx.stroke();
  ctx.strokeStyle = '#150d05';
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(216, 234);
  ctx.quadraticCurveTo(206, 226, 209, 215);
  ctx.stroke();

  ctx.strokeStyle = '#1c1207';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(256, base - 4);
  ctx.lineTo(242, 290);
  ctx.stroke();
  ctx.restore();
  /* the blade of the chapelka */
  SC.set([236, 292, 252, 284, 257, 296, 241, 304]);
  litPoly(ctx, 4, 246, 294, '#2a1b0b', C.rim, 1.8);
}

function paintTable(ctx: C2D, g: Bank): void {
  const { x0, x1, top, plank, legY } = TABLE;

  /* legs first, then the top over them */
  litSlab(ctx, x0 + 18, top, 16, legY - top, 2, C.woodD, C.woodM, 2);
  litSlab(ctx, x1 - 34, top, 16, legY - top, 2, C.woodD, C.woodM, 2);
  ctx.fillStyle = 'rgba(9,5,2,0.5)';
  ctx.fillRect(x0 + 26, top + 62, x1 - x0 - 56, 6);

  litSlab(ctx, x0, top, x1 - x0, plank, 3, C.woodM, C.woodL, 3);
  ctx.fillStyle = 'rgba(8,4,2,0.45)';
  ctx.fillRect(x0, top + plank - 4, x1 - x0, 4);

  /* --- дзяжа: a coopered trough, staves and two hoops --- */
  const t = TROUGH;
  SC.set([t.x0, t.top, t.x1, t.top, t.x1 - t.inset, t.bottom, t.x0 + t.inset, t.bottom]);
  litPoly(ctx, 4, (t.x0 + t.x1) / 2, (t.top + t.bottom) / 2, C.woodD, C.woodL, 3);
  ctx.save();
  polyPath(ctx, 4, 0, 0);
  ctx.clip();
  ctx.fillStyle = g.trough;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(t.x0, t.top, t.x1 - t.x0, t.bottom - t.top);
  ctx.globalAlpha = 1;
  for (let i = 1; i < 8; i++) {
    const sx = t.x0 + ((t.x1 - t.x0) / 8) * i;
    ctx.fillStyle = 'rgba(8,4,2,0.4)';
    ctx.fillRect(sx, t.top, 1.4, t.bottom - t.top);
  }
  ctx.fillStyle = 'rgba(20,11,4,0.85)';
  ctx.fillRect(t.x0 - 4, t.top + 22, t.x1 - t.x0 + 8, 7);
  ctx.fillRect(t.x0 - 4, t.bottom - 22, t.x1 - t.x0 + 8, 7);
  ctx.fillStyle = 'rgba(226,158,78,0.22)';
  ctx.fillRect(t.x0 - 4, t.top + 22, (t.x1 - t.x0) * 0.4, 1.8);
  ctx.fillRect(t.x0 - 4, t.bottom - 22, (t.x1 - t.x0) * 0.4, 1.8);
  ctx.restore();
  /* the rim, lit from inside the room */
  litSlab(ctx, t.x0 - 5, t.top - 7, t.x1 - t.x0 + 10, 11, 4, C.woodD, C.rimHot, 2.5);

  /* --- the board, lying on the plank and dusted with flour --- */
  litSlab(ctx, BOARD.x0, BOARD.y, BOARD.x1 - BOARD.x0, BOARD.h, 3, C.woodM, C.woodL, 2.5);
  /* the shadow it throws onto the plank, so it reads as lying on and not in */
  ctx.fillStyle = 'rgba(8,4,2,0.4)';
  ctx.fillRect(BOARD.x0 + 3, BOARD.y + BOARD.h - 2, BOARD.x1 - BOARD.x0 - 6, 4);
  ctx.save();
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = C.ivory;
    ctx.globalAlpha = 0.06 + hash(i * 7) * 0.16;
    ctx.fillRect(
      BOARD.x0 + 3 + hash(i * 3) * (BOARD.x1 - BOARD.x0 - 6),
      BOARD.y - 1 + hash(i * 11) * 6,
      1 + hash(i * 5) * 3,
      1 + hash(i * 13) * 1.6,
    );
  }
  ctx.restore();
}

/* ===================================================== front / vignette === */

export function paintFront(ctx: C2D, p: Paint): void {
  const g = bk(ctx);
  ctx.fillStyle = g.vign;
  ctx.fillRect(-60, -60, STAGE_W + 120, STAGE_H + 120);
  ctx.fillStyle = g.base;
  ctx.fillRect(-60, STAGE_H - 130, STAGE_W + 120, 190);

  /* the room, cooled and emptied of light as act II comes on */
  if (p.dim > 0.01) {
    ctx.fillStyle = `rgba(14,16,32,${p.dim * 0.44})`;
    ctx.fillRect(-60, -60, STAGE_W + 120, STAGE_H + 120);
  }
}

/* ================================================================ light === */

/** Additive pools. Called after the cached layers, before the actors. */
export function drawLight(ctx: C2D, s: SceneState, p: Paint): void {
  const g = bk(ctx);
  const f = p.reduced ? 0.5 : p.flick;
  const strength = 1 - p.dim * 0.66;

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  pool(ctx, g.glow, FIRE.x, FIRE.y - 18, 430 + f * 42, (0.42 + f * 0.2) * strength, 0.72);
  pool(ctx, g.glow, FIRE.x + 4, FIRE.y, 150 + f * 26, (0.5 + f * 0.24) * strength, 0.86);
  /* the spill running out across the boards */
  pool(ctx, g.glow, FIRE.x + 70, FLOOR_Y + 30, 330 + f * 30, (0.2 + f * 0.1) * strength, 0.3);

  if (p.dim > 0.02) {
    /* act II: the room goes to embers, but the cat and the one under it have to
       stay readable — a cooler pool over the whole play area with a
       candle-warm core, and the core follows the cat rather than sitting where
       the cat happened to be at rest. */
    catFrame(s);
    const cx = FRAME.x;
    const cy = FRAME.y - 26;
    pool(ctx, g.cool, (cx + ANCHORS.player.x) / 2, 300, 336, p.dim * 0.5, 0.9);
    pool(ctx, g.glow, cx, cy, 196, p.dim * (0.4 + f * 0.14), 0.9);
    /* the boards under the player, so his feet are not cut off by the dark */
    pool(ctx, g.glow, ANCHORS.player.x, BASE_Y - 6, 190, p.dim * (0.24 + f * 0.08), 0.42);
  }
  ctx.restore();
}

/** The same pool again, laid *over* the actors at a whisper — the pool under
 *  them lights the wall, this is what lifts the cat's own paper out of the
 *  murk. Kept low: any more and act II stops being a dimmed room. */
export function drawPlayGlow(ctx: C2D, s: SceneState, p: Paint): void {
  if (p.dim <= 0.02) return;
  const f = p.reduced ? 0.5 : p.flick;
  catFrame(s);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pool(ctx, bk(ctx).glow, FRAME.x, FRAME.y - 26, 178, p.dim * (0.16 + f * 0.06), 0.92);
  ctx.restore();
}

function pool(ctx: C2D, grad: CanvasGradient, x: number, y: number, r: number, alpha: number, squash: number): void {
  if (alpha <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(r, r * squash);
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** Three paper flames, each lapping on its own phase. */
export function drawFire(ctx: C2D, p: Paint): void {
  const base = MOUTH.floor - 4;
  const f = p.reduced ? 0.5 : p.flick;
  /* the hearth itself never goes out — only the room it lights does */
  const dim = 1 - p.dim * 0.42;

  ctx.save();
  mouthPath(ctx, 0, 0, 1);
  ctx.clip();

  /* two logs, crossed on the hearth: dark bars with their upper edges alight */
  ctx.save();
  ctx.lineCap = 'butt';
  for (let i = 0; i < 2; i++) {
    ctx.save();
    ctx.translate(FIRE.x, base + 4 + i * 6);
    ctx.rotate(rad(i ? 5 : -7));
    ctx.fillStyle = '#150c04';
    ctx.beginPath();
    ctx.roundRect(-32 + i * 4, -4, 60, 8, 3);
    ctx.fill();
    ctx.fillStyle = `rgba(226,110,26,${0.5 - i * 0.2})`;
    ctx.beginPath();
    ctx.roundRect(-31 + i * 4, -4.4, 56, 2.2, 1.1);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  /* the bed of coals under them */
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pool(ctx, bk(ctx).coal, FIRE.x, base + 2, 54 + f * 10, (0.7 + f * 0.3) * dim, 0.4);
  ctx.restore();

  for (let i = 0; i < 3; i++) {
    const phase = p.reduced ? 0 : p.t * (0.0026 + i * 0.0009) + i * 2.1;
    const sway = p.reduced ? 0 : Math.sin(phase) * (5 - i * 1.2);
    const h = (44 - i * 11) * (0.78 + (p.reduced ? 0.22 : f * 0.44));
    const w = 16 - i * 3.4;
    const x = FIRE.x - 12 + i * 12 + sway;
    flamePath(ctx, x, base, w, h, sway);
    ctx.fillStyle = i === 0 ? '#8f3a0d' : i === 1 ? '#dc7a1e' : '#f8c65a';
    ctx.globalAlpha = (0.9 - i * 0.06) * dim;
    ctx.fill();
  }
  /* the white heart of it */
  ctx.globalAlpha = (0.3 + (p.reduced ? 0 : f * 0.26)) * dim;
  ellipsePath(ctx, FIRE.x, base - 7, 9, 3.6, rad(-6));
  ctx.fillStyle = '#ffb457';
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function flamePath(ctx: C2D, x: number, base: number, w: number, h: number, sway: number): void {
  ctx.beginPath();
  ctx.moveTo(x - w, base);
  ctx.quadraticCurveTo(x - w * 0.86, base - h * 0.5, x - w * 0.18 + sway * 0.5, base - h * 0.72);
  ctx.quadraticCurveTo(x - w * 0.5 + sway, base - h * 0.9, x + sway * 1.4, base - h);
  ctx.quadraticCurveTo(x + w * 0.42 + sway, base - h * 0.78, x + w * 0.3, base - h * 0.5);
  ctx.quadraticCurveTo(x + w * 0.98, base - h * 0.36, x + w, base);
  ctx.closePath();
}

/* ==================================================== snow at the window == */

export function drawWindowSnow(ctx: C2D, p: Paint): void {
  const { x, y, w, h } = WINDOW;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const n = p.reduced ? 8 : 18;
  for (let i = 0; i < n; i++) {
    const spd = 9 + hash(i * 5) * 16;
    const fy = y + ((p.t * spd) / 1000 + hash(i * 13) * h) % h;
    const fx = x + hash(i * 7) * w + (p.reduced ? 0 : Math.sin(p.t / 900 + i) * 3.5);
    ctx.fillStyle = `rgba(215,229,246,${0.28 + hash(i * 3) * 0.42})`;
    ctx.beginPath();
    ctx.arc(fx, fy, 0.9 + hash(i * 11) * 1.3, 0, TAU);
    ctx.fill();
  }
  /* frost creeping in at the corners */
  ctx.fillStyle = 'rgba(215,229,246,0.1)';
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.42, y + h);
  ctx.lineTo(x, y + h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ================================================= act I: dough and oven == */

export function drawBakeProps(ctx: C2D, s: SceneState, p: Paint): void {
  const core = s.core;

  /* what is left in the дзяжа — the whole budget of the game, visible */
  const left = core ? clamp(core.doughLeft / 100, 0, 1) : 1;
  if (left > 0.005) {
    const t = TROUGH;
    const top = lerp(t.bottom - 14, t.top + 8, left);
    ctx.save();
    SC.set([t.x0, t.top, t.x1, t.top, t.x1 - t.inset, t.bottom, t.x0 + t.inset, t.bottom]);
    polyPath(ctx, 4, 0, 0);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(t.x0 + 2, t.bottom);
    ctx.lineTo(t.x0 + 5, top + 10);
    ctx.quadraticCurveTo(t.x0 + 18, top - 2, (t.x0 + t.x1) / 2 - 6, top - 6 - left * 5);
    ctx.quadraticCurveTo(t.x1 - 20, top + 1, t.x1 - 5, top + 12);
    ctx.lineTo(t.x1 - 2, t.bottom);
    ctx.closePath();
    ctx.fillStyle = '#8b7047';
    ctx.fill();
    const sh = ctx.createLinearGradient(t.x0, top - 14, t.x1, t.bottom);
    sh.addColorStop(0, 'rgba(255,226,176,0.16)');
    sh.addColorStop(0.3, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(16,9,3,0.85)');
    ctx.fillStyle = sh;
    ctx.fill();
    /* it sits in a well, so the walls throw a shadow onto it */
    const wellL = ctx.createLinearGradient(t.x0, 0, t.x0 + 40, 0);
    wellL.addColorStop(0, 'rgba(14,8,3,0.7)');
    wellL.addColorStop(1, 'rgba(14,8,3,0)');
    ctx.fillStyle = wellL;
    ctx.fill();
    const wellR = ctx.createLinearGradient(t.x1, 0, t.x1 - 52, 0);
    wellR.addColorStop(0, 'rgba(14,8,3,0.8)');
    wellR.addColorStop(1, 'rgba(14,8,3,0)');
    ctx.fillStyle = wellR;
    ctx.fill();
    /* creases where it has been cut into */
    ctx.strokeStyle = 'rgba(52,36,14,0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(t.x0 + 22, top + 12);
    ctx.quadraticCurveTo((t.x0 + t.x1) / 2, top + 4, t.x1 - 26, top + 16);
    ctx.moveTo(t.x0 + 34, top + 26);
    ctx.quadraticCurveTo((t.x0 + t.x1) / 2 + 8, top + 20, t.x1 - 30, top + 30);
    ctx.stroke();
    ctx.restore();
  }

  /* the ball on the board: the live outline when physics is running, a plain
     round one when it is not */
  const ball = ANCHORS.ball;
  const size = core ? core.ballSize : 0;
  if (s.dough && s.dough.length > 2) {
    const pts = s.dough;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
    ctx.closePath();
    ctx.fillStyle = '#e2c793';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,240,206,0.5)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  } else if (size > 0.4) {
    const r = 7 + size * 1.05;
    castShadow(ctx, ball.x, BOARD.y + 2, r * 0.66, 0.45);
    /* seated on the board, not floating over it: whatever the ball grows to,
       its underside is BOARD.y, squashed a unit into the flour */
    const by = BOARD.y - r * 0.86 + 1.5;
    litEllipse(ctx, ball.x, by, r, r * 0.86, 0, '#c3a370', '#ecd9a8', 2.4);
    /* the folds the kneading leaves */
    ctx.strokeStyle = 'rgba(70,50,22,0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ball.x - r * 0.5, by - r * 0.3);
    ctx.lineTo(ball.x + r * 0.1, by - r * 0.44);
    ctx.moveTo(ball.x - r * 0.34, by + r * 0.16);
    ctx.lineTo(ball.x + r * 0.4, by + r * 0.02);
    ctx.stroke();
  }

  /* the one in the oven, browning where everyone can see it */
  if (core && core.ovenSize > 0.4) {
    const r = 5 + core.ovenSize * 0.9;
    const b = clamp(core.browning, 0, 1);
    const o = ANCHORS.ovenBun;
    ctx.save();
    mouthPath(ctx, 0, 0, 0);
    ctx.clip();
    const body = b < 0.46 ? '#dcc290' : b < 0.66 ? '#c07f38' : '#3d2712';
    const rim = b < 0.46 ? '#fdf0cd' : b < 0.66 ? '#f6c87c' : '#a35f2c';
    litEllipse(ctx, o.x, o.y, r, r * 0.8, 0, body, rim, 2.2);
    ctx.strokeStyle = `rgba(90,54,22,${0.3 + b * 0.4})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(o.x - r * 0.5, o.y - r * 0.18);
    ctx.lineTo(o.x + r * 0.4, o.y - r * 0.3);
    ctx.stroke();
    ctx.restore();
  }
}

/* ========================================================== the cat ====== */
/* v1's geometry, verbatim: OFFSETS are core units from the pivot, and the cord
   is 74 of them long. Inside this function the context is in core units with
   the origin at the pivot, so every number below is a v1 number. */

const ROPE_CORE = 74;
const OFFSETS: readonly { dx: number; dy: number }[] = [
  { dx: -30, dy: 78 }, // вуха
  { dx: -13, dy: 122 }, // лапа — hung a little clear of the бок's underside,
  { dx: 9, dy: 124 }, // лапа   or the body eats both of them
  { dx: 4, dy: 96 }, // бок
  { dx: -30, dy: 92 }, // галава
  { dx: 36, dy: 82 }, // хвост
];

/* The бок is the sheet the rest of the cat is pinned onto, so it is laid down
   first whatever its index says; ears, paws, head and tail go over it. Drawn in
   index order the body swallowed the лапы and the вуха whole. */
const CAT_ORDER: readonly number[] = [3, 0, 1, 2, 4, 5];

/** Tip of the cord and the frame the cat hangs in, world units. */
const FRAME = { x: 0, y: 0, ax: 0, ay: 1 };

function catFrame(s: SceneState): void {
  const rope = s.rope;
  if (rope && rope.length >= 2) {
    const tip = rope[rope.length - 1];
    const prev = rope[rope.length - 2];
    let ax = tip.x - prev.x;
    let ay = tip.y - prev.y;
    const m = Math.hypot(ax, ay) || 1;
    FRAME.x = tip.x;
    FRAME.y = tip.y;
    FRAME.ax = ax / m;
    FRAME.ay = ay / m;
    return;
  }
  /* Handedness: positive θ leans the cord toward −x. v1's SVG rotate and
     mechanics.pieceX both say so, and the rope's xSign default agrees — a
     mirrored fallback would jump the cat across the room the moment physics
     dropped out. */
  const th = rad(s.core ? s.core.thetaDeg : 0);
  const ax = -Math.sin(th);
  const ay = Math.cos(th);
  FRAME.ax = ax;
  FRAME.ay = ay;
  FRAME.x = PIVOT.x + ax * ROPE_CORE * CORE_SCALE;
  FRAME.y = PIVOT.y + ay * ROPE_CORE * CORE_SCALE;
}

export function drawCord(ctx: C2D, s: SceneState, p: Paint): void {
  catFrame(s);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const rope = s.rope;
  ctx.beginPath();
  if (rope && rope.length >= 2) {
    ctx.moveTo(rope[0].x, rope[0].y);
    for (let i = 1; i < rope.length; i++) ctx.lineTo(rope[i].x, rope[i].y);
  } else {
    ctx.moveTo(PIVOT.x, PIVOT.y);
    ctx.lineTo(FRAME.x, FRAME.y);
  }
  ctx.strokeStyle = '#0d0703';
  ctx.lineWidth = 4.2;
  ctx.stroke();
  ctx.strokeStyle = `rgba(224,158,80,${0.32 + (p.reduced ? 0 : p.flick * 0.2)})`;
  ctx.lineWidth = 1.4;
  ctx.save();
  ctx.translate(-1.6, 0);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}

export function drawCat(ctx: C2D, s: SceneState, p: Paint): void {
  catFrame(s);
  const { x, y, ax, ay } = FRAME;

  ctx.save();
  ctx.translate(x, y);
  ctx.transform(ay, -ax, ax, ay, 0, 0);
  ctx.scale(CORE_SCALE, CORE_SCALE);
  ctx.translate(0, -ROPE_CORE);

  /* bring the light into the cat's own frame so the rims stay honest as it
     swings past the печ */
  const fx = FIRE.x - x;
  const fy = FIRE.y - y;
  const lfx = (ay * fx - ax * fy) / CORE_SCALE;
  const lfy = (ax * fx + ay * fy) / CORE_SCALE + ROPE_CORE;
  setLight(lfx, lfy, CORE_SCALE);

  for (let k = 0; k < CAT_ORDER.length; k++) {
    const i = CAT_ORDER[k];
    const view = s.pieces[i];
    if (!view || view.state === 'eaten' || view.state === 'lost') continue;
    const o = OFFSETS[i];

    ctx.save();
    ctx.translate(o.dx, o.dy);
    const sc = view.scale || 1;
    ctx.scale(sc, sc);
    ctx.translate(-o.dx, -o.dy);

    if (view.state === 'unbaked') {
      ghostPiece(ctx, i);
    } else {
      if (view.targeted) targetHalo(ctx, o.dx, o.dy, i, p);
      /* a darker sheet under each piece: without it six loaves at one bake
         merge into a single brown mass. It is offset away from the fire *and*
         drawn as a wider outline all round, because pieces overlap on every
         side and only the far side gets the offset. */
      ctx.save();
      fireDir(o.dx, o.dy);
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = '#0a0502';
      ctx.strokeStyle = '#0a0502';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.translate(FX * 2.8, FY * 2.8);
      if (i === 5) {
        ctx.lineWidth = 12.5;
        tailPath(ctx, 0, 0);
        ctx.stroke();
      } else {
        pieceOutline(ctx, i);
        ctx.fill();
      }
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = '#0a0502';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = i === 5 ? 12.4 : 2.6;
      if (i === 5) tailPath(ctx, 0, 0);
      else pieceOutline(ctx, i);
      ctx.stroke();
      ctx.restore();
      bakedPiece(ctx, i, view.bake || 'golden');
      if (view.targeted) targetRing(ctx, i, p);
    }
    ctx.restore();
  }

  ctx.restore();
  setLight(FIRE.x, FIRE.y);
}

/** The soft warm bloom behind the contested piece — it has to survive act II's
 *  murk, so it is put down bright and pulsing rather than politely. */
function targetHalo(ctx: C2D, cx: number, cy: number, i: number, p: Paint): void {
  const pulse = p.reduced ? 0.8 : 0.62 + Math.sin(p.t / 210) * 0.3;
  const r = i === 3 ? 62 : i === 4 ? 38 : 30;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pool(ctx, bk(ctx).glow, cx, cy, r, pulse * 0.9, 0.86);
  ctx.restore();
}

/** …and the outline over it, so the goal is a shape and not a smudge. */
function targetRing(ctx: C2D, i: number, p: Paint): void {
  const pulse = p.reduced ? 0.85 : 0.62 + Math.sin(p.t / 210) * 0.3;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = '#ffd68e';
  if (i === 5) {
    ctx.globalAlpha = pulse * 0.42;
    ctx.lineWidth = 13.5;
    tailPath(ctx, 0, 0);
    ctx.stroke();
  } else {
    ctx.globalAlpha = pulse * 0.4;
    ctx.lineWidth = 8;
    pieceOutline(ctx, i);
    ctx.stroke();
    ctx.globalAlpha = pulse;
    ctx.lineWidth = 2.1;
    pieceOutline(ctx, i);
    ctx.stroke();
  }
  ctx.restore();
}

/** Before it is baked a piece is only a plan: a dotted outline on the cord.
 *  All six are there from the first frame — the plan of the whole cat — and
 *  each fills in solid as its bun comes out of the печ. */
function ghostPiece(ctx: C2D, i: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(214,172,110,0.2)';
  ctx.lineWidth = 0.9;
  ctx.lineJoin = 'round';
  ctx.setLineDash([1.8, 4.4]);
  if (i === 5) {
    ctx.lineWidth = 1.1;
    tailPath(ctx, 0, 0);
  } else {
    pieceOutline(ctx, i);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function pieceOutline(ctx: C2D, i: number): void {
  switch (i) {
    case 0:
      SC.set([-44, 86, -32, 66, -19, 84]);
      polyPath(ctx, 3, 0, 0);
      break;
    case 1:
      ellipsePath(ctx, -13, 122, 10, 8, 0);
      break;
    case 2:
      ellipsePath(ctx, 9, 124, 10, 8, 0);
      break;
    case 3:
      ellipsePath(ctx, 4, 96, 34, 21, 0);
      break;
    case 4:
      ellipsePath(ctx, -30, 92, 15, 15, 0);
      break;
    default:
      ctx.beginPath();
      ctx.moveTo(32, 90);
      ctx.quadraticCurveTo(46, 92, 48, 80);
      ctx.quadraticCurveTo(50, 68, 44, 64);
      break;
  }
}

function bakedPiece(ctx: C2D, i: number, bake: Bake): void {
  const tone = BAKE_TONE[bake];
  const amt = 2.6;
  const w = tone.seam;
  switch (i) {
    case 0:
      /* вуха — a cut triangle, scored once */
      SC.set([-44, 86, -32, 66, -19, 84]);
      litPoly(ctx, 3, -30, 78, tone.body, tone.rim, amt);
      score(ctx, -36, 80, -25, 78, tone.score, w);
      break;
    case 1:
      litEllipse(ctx, -13, 122, 10, 8, rad(-8), tone.body, tone.rim, amt);
      score(ctx, -18, 122, -8, 121, tone.score, w);
      break;
    case 2:
      litEllipse(ctx, 9, 124, 10, 8, rad(6), tone.body, tone.rim, amt);
      score(ctx, 4, 124, 14, 123, tone.score, w);
      break;
    case 3: {
      /* бок — the loaf the whole cat is built round */
      litEllipse(ctx, 4, 96, 34, 21, 0, tone.body, tone.rim, amt + 2);
      ctx.save();
      ellipsePath(ctx, 4, 96, 34, 21, 0);
      ctx.clip();
      ellipsePath(ctx, 4, 87, 32, 13, 0);
      ctx.fillStyle = tone.blush;
      ctx.globalAlpha = 0.45;
      ctx.fill();
      ctx.globalAlpha = 1;
      /* the underside, where the crust has taken the хлебная лопата's heat */
      ellipsePath(ctx, 4, 112, 33, 11, 0);
      ctx.fillStyle = tone.blush;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.restore();
      /* the cuts across the crust. On a burnt loaf they are the whole story:
         the pale crumb splitting the char is what says «bread», not «hole». */
      score(ctx, -16, 88, 2, 85, tone.score, w);
      score(ctx, -12, 103, 8, 100, tone.score, w);
      score(ctx, 10, 92, 30, 89, tone.score, w);
      score(ctx, 6, 107, 26, 104, tone.score, w);
      break;
    }
    case 4: {
      /* галава — a round loaf, and nothing more: no glued-on cat ears (вуха is
         its own bun), no drawn smile. Two currant eyes and one crumb line. */
      litEllipse(ctx, -30, 92, 15, 15, 0, tone.body, tone.rim, amt);
      ctx.save();
      ellipsePath(ctx, -30, 92, 15, 15, 0);
      ctx.clip();
      ellipsePath(ctx, -30, 84, 14, 8, 0);
      ctx.fillStyle = tone.blush;
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.restore();
      /* the notch where the dough was pinched off — the only nod to an ear */
      score(ctx, -34, 78.5, -30.5, 82.5, tone.score, w);
      /* two currants and a crumb line — the only face the cat gets */
      ctx.fillStyle = bake === 'burnt' ? '#170d05' : '#33200e';
      ctx.beginPath();
      ctx.arc(-33.6, 90, 1.05, 0, TAU);
      ctx.arc(-27.4, 90, 1.05, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = tone.score;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-32.6, 96.4);
      ctx.lineTo(-28.6, 96);
      ctx.stroke();
      ctx.lineCap = 'butt';
      break;
    }
    default: {
      /* хвост — the piece the game is played for, so it is the one with a
         plait in it rather than a stroke */
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      fireDir(40, 80);
      const ca = coolA();
      if (ca > 0) {
        ctx.globalAlpha = ca;
        ctx.strokeStyle = C.rimCool;
        ctx.lineWidth = 11.4;
        tailPath(ctx, FX * 2, FY * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = rimA();
      ctx.strokeStyle = tone.rim;
      ctx.lineWidth = 11.4;
      tailPath(ctx, -FX * 2.4, -FY * 2.4);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = tone.body;
      ctx.lineWidth = 9;
      tailPath(ctx, 0, 0);
      ctx.stroke();
      ctx.strokeStyle = tone.score;
      ctx.lineWidth = w;
      for (let k = 0; k < 4; k++) {
        const u = 0.16 + k * 0.22;
        const tx = tailAt(u, 0);
        const ty = tailAt(u, 1);
        ctx.beginPath();
        ctx.moveTo(tx - 3.4, ty - 2.6);
        ctx.lineTo(tx + 3.4, ty + 2.6);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
  }
}

function tailPath(ctx: C2D, dx: number, dy: number): void {
  ctx.beginPath();
  ctx.moveTo(30 + dx, 92 + dy);
  ctx.quadraticCurveTo(46 + dx, 94 + dy, 48 + dx, 80 + dy);
  ctx.quadraticCurveTo(50 + dx, 66 + dy, 40 + dx, 62 + dy);
}

/** Point on the tail's spine, for the plait marks. axis 0 = x, 1 = y. */
function tailAt(u: number, axis: number): number {
  const a = axis === 0 ? [30, 46, 48] : [92, 94, 80];
  const b = axis === 0 ? [48, 50, 40] : [80, 66, 62];
  if (u < 0.5) {
    const t = u * 2;
    const m = 1 - t;
    return m * m * a[0] + 2 * m * t * a[1] + t * t * a[2];
  }
  const t = (u - 0.5) * 2;
  const m = 1 - t;
  return m * m * b[0] + 2 * m * t * b[1] + t * t * b[2];
}

/** A knife cut across the crust: a scored line, not a smile. */
function score(ctx: C2D, x0: number, y0: number, x1: number, y1: number, colour: string, width = 1.4): void {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 0.5, x1, y1);
  ctx.stroke();
}

/* ======================================================= the villagers === */
/* Two or three paper tones each, a rim on the hearth side, and a silhouette
   that has to carry the whole character — no faces beyond the notch of a nose.
   Pose comes entirely from CrowdView. */

interface Tones {
  dark: string;
  mid: string;
  light: string;
  rim: string;
}

const TONES: Record<AdvisorId, Tones> = {
  hanna: { dark: '#150d05', mid: '#33200c', light: '#5a3413', rim: '#e8a253' },
  symon: { dark: '#120b04', mid: '#2a1a09', light: '#4b2c10', rim: '#d08f45' },
  alesik: { dark: '#170e06', mid: '#3a2410', light: '#633d17', rim: '#f0ae5f' },
};

/** A tapered limb: shoulder → hand, drawn as a wedge so it reads as cut. */
function limb(ctx: C2D, x: number, y: number, ang: number, len: number, w0: number, w1: number): void {
  const cs = Math.cos(ang);
  const sn = Math.sin(ang);
  const px = -sn;
  const py = cs;
  SC[0] = x + px * w0;
  SC[1] = y + py * w0;
  SC[2] = x + cs * len + px * w1;
  SC[3] = y + sn * len + py * w1;
  SC[4] = x + cs * len - px * w1;
  SC[5] = y + sn * len - py * w1;
  SC[6] = x - px * w0;
  SC[7] = y - py * w0;
  HAND.x = x + cs * len;
  HAND.y = y + sn * len;
}
const HAND = { x: 0, y: 0 };

/** Where an arm points. `push` is the shove direction, `arm` splays the two
 *  arms apart so a cheer is two arms up and not one arm drawn twice. */
function armAngle(base: number, lean: number, cheer: number, push: number, arm: number, gesture: number): number {
  const amt = lean * push > 0 ? Math.abs(lean) : 0;
  let a = base;
  a = lerp(a, rad(push > 0 ? -4 : 184), amt);
  a = lerp(a, rad(arm > 0 ? -66 : -116), ease(cheer));
  return a + gesture;
}

export function drawCrowd(ctx: C2D, s: SceneState, p: Paint): void {
  const c = s.crowd;
  const gest = (id: AdvisorId) => (c.speaking === id && !p.reduced ? Math.sin(p.t / 150) * 0.36 : 0);
  drawHanna(ctx, ANCHORS.crowd.hanna, c.lean.hanna, c.cheer, gest('hanna'), p);
  drawAlesik(ctx, ANCHORS.crowd.alesik, c.lean.alesik, c.cheer, gest('alesik'), p);
  drawSymon(ctx, ANCHORS.crowd.symon, c.lean.symon, c.cheer, gest('symon'), p);
}

/** The sheet of darker paper every figure is mounted on — one step of depth. */
function backing(ctx: C2D, cx: number, cy: number): void {
  fireDir(cx, cy);
  pbReplay(ctx, FX * 4.5, FY * 2.5);
  ctx.fillStyle = 'rgba(6,3,1,0.55)';
  ctx.fill();
}

/** Ганна: хустка knotted under the chin, a skirt wide enough to plant her. */
function drawHanna(ctx: C2D, x: number, lean: number, cheer: number, ges: number, p: Paint): void {
  const T = TONES.hanna;
  const h = 112;
  const sway = p.reduced ? 0 : Math.sin(p.t / 1700) * 1.3;
  const dx = lean * 9 + sway;
  const lift = ease(cheer) * 5;
  const base = BASE_Y;

  castShadow(ctx, x, base + 3, 24, 0.55);
  ctx.save();
  ctx.translate(x, base - lift);
  setLight(FIRE.x - x, FIRE.y - (base - lift));

  /* the far arm goes behind everything */
  const aBack = armAngle(rad(62), lean, cheer, lean >= 0 ? 1 : -1, -1, ges * 0.4);
  limb(ctx, -8, -h + 36, aBack, 30 + Math.abs(lean) * 18, 5, 3.4);
  litPoly(ctx, 4, 0, -h + 42, C.figD, T.mid, 1.4);

  /* skirt: one bell, hem cut in three scallops */
  pbStart();
  pbM(dx - 10, -h + 44);
  pbQ(dx - 24, -62, -30, -6);
  pbQ(-27, -1, -22, -2);
  pbQ(-16, -7, -10, -2);
  pbQ(-2, -7, 6, -2);
  pbQ(14, -7, 22, -2);
  pbQ(27, -1, 29, -6);
  pbQ(dx + 23, -62, dx + 10, -h + 44);
  backing(ctx, x, base - 44);
  litPB(ctx, x, base - 44, T.mid, T.rim, 3.4);
  /* the apron over it, a tone up and narrower */
  pbStart();
  pbM(dx - 7, -h + 48);
  pbQ(dx - 12, -60, -12, -8);
  pbL(11, -8);
  pbQ(dx + 12, -60, dx + 7, -h + 48);
  pbReplay(ctx, 0, 0);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = T.light;
  ctx.fill();
  ctx.globalAlpha = 1;
  /* hem band — the only ornament a working skirt gets */
  ctx.strokeStyle = 'rgba(240,221,180,0.22)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-27, -12);
  ctx.lineTo(26, -12);
  ctx.stroke();

  /* torso, waisted */
  pbStart();
  pbM(dx - 11, -h + 46);
  pbQ(dx - 14, -h + 24, dx - 10, -h + 14);
  pbL(dx + 10, -h + 14);
  pbQ(dx + 14, -h + 24, dx + 11, -h + 46);
  litPB(ctx, x, base - h + 30, T.mid, T.rim, 2.6);

  /* head under the хустка */
  const hx = dx + lean * 4;
  const hy = -h + 1;
  litEllipse(ctx, hx, hy, 10.5, 11.5, rad(lean * 6), T.mid, T.rim, 1.2);
  /* nose notch, cut into the profile on the fire side */
  pbStart();
  pbM(hx - 10, hy - 1);
  pbL(hx - 14.6, hy + 2.2);
  pbL(hx - 9.6, hy + 4.2);
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = T.mid;
  ctx.fill();
  /* the kerchief: over the crown, down the cheeks, tied under the chin. It has
     to cover more than the head or the head reads as a moon behind it. */
  pbStart();
  pbM(hx - 13, hy + 1);
  pbQ(hx - 15, hy - 17, hx, hy - 17);
  pbQ(hx + 15, hy - 17, hx + 13, hy + 4);
  pbQ(hx + 16, hy + 20, hx + 4, hy + 28);
  pbL(hx - 6, hy + 24);
  pbQ(hx - 15, hy + 12, hx - 13, hy + 1);
  litPB(ctx, x, base - h, T.dark, T.rim, 2.4);
  litEllipse(ctx, hx + 3, hy + 11, 5, 4, rad(28), T.dark, T.rim, 1.4);

  /* the near arm, over the body */
  const aFront = armAngle(rad(68), lean, cheer, lean >= 0 ? 1 : -1, 1, ges);
  limb(ctx, dx + 9, -h + 34, aFront, 32 + Math.abs(lean) * 22, 5.4, 3.6);
  litPoly(ctx, 4, x, base - h + 40, T.mid, T.rim, 2.2);
  litEllipse(ctx, HAND.x, HAND.y, 4.2, 3.8, 0, T.mid, T.rim, 1.4);

  ctx.restore();
  setLight(FIRE.x, FIRE.y);
}

/** Сымон: брыль, світа off one shoulder, a stoop he does not lose even cheering. */
function drawSymon(ctx: C2D, x: number, lean: number, cheer: number, ges: number, p: Paint): void {
  const T = TONES.symon;
  const h = 118;
  const sway = p.reduced ? 0 : Math.sin(p.t / 2100 + 1.2) * 1.5;
  const stoop = 8 - ease(cheer) * 4;
  const dx = lean * 11 + sway;
  const lift = ease(cheer) * 6;
  const base = BASE_Y - 4;

  castShadow(ctx, x, base + 5, 23, 0.5);
  ctx.save();
  ctx.translate(x, base - lift);
  setLight(FIRE.x - x, FIRE.y - (base - lift));

  const aBack = armAngle(rad(54), lean, cheer, lean >= 0 ? 1 : -1, -1, ges * 0.35);
  limb(ctx, -8, -h + 42, aBack, 30 + Math.abs(lean) * 18, 4.8, 3.2);
  litPoly(ctx, 4, x, base - h + 46, C.figD, T.mid, 1.4);

  /* legs, planted apart — a man braced for the shove he means to give */
  SC.set([-13, -48, -4, -48, -2, 0, -14, 0]);
  litPoly(ctx, 4, x - 8, base - 24, T.dark, T.mid, 2);
  SC.set([4, -48, 13, -48, 15, 0, 3, 0]);
  litPoly(ctx, 4, x + 9, base - 24, T.dark, T.mid, 2);

  /* torso, leaning out of the hips */
  pbStart();
  pbM(-14, -46);
  pbQ(-15, -74, dx - 14 - stoop * 0.5, -h + 24);
  pbQ(dx - 4 - stoop, -h + 9, dx + 13 - stoop, -h + 22);
  pbQ(dx + 16, -74, 15, -46);
  backing(ctx, x, base - h * 0.6);
  litPB(ctx, x, base - h * 0.62, T.mid, T.rim, 3);

  /* світа slung off the near shoulder */
  pbStart();
  pbM(dx + 11 - stoop, -h + 24);
  pbQ(dx + 25, -h + 44, dx + 18, -54);
  pbL(dx + 6, -56);
  pbQ(dx + 11, -h + 36, dx + 3 - stoop, -h + 26);
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = T.light;
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,158,78,0.24)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(226,158,78,0.2)';
  ctx.fillRect(-14, -52, 30, 3);

  /* head, beard, брыль */
  const hx = dx - stoop + lean * 3;
  const hy = -h + 9;
  litEllipse(ctx, hx, hy, 9.6, 10.6, rad(lean * 5), T.mid, T.rim, 1.2);
  pbStart();
  pbM(hx - 9.6, hy - 1);
  pbL(hx - 14, hy + 2);
  pbL(hx - 9, hy + 4.2);
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = T.mid;
  ctx.fill();
  pbStart();
  pbM(hx - 9.4, hy + 2);
  pbQ(hx - 4, hy + 21, hx + 5, hy + 11);
  pbL(hx + 9.6, hy);
  litPB(ctx, x, base - h + 18, T.dark, T.mid, 1.8);
  /* crown then brim, so the brim's rim sits over it */
  pbStart();
  pbM(hx - 10.8, hy - 6);
  pbQ(hx - 11.6, hy - 21, hx, hy - 21);
  pbQ(hx + 11.6, hy - 21, hx + 10.8, hy - 6);
  litPB(ctx, x, base - h, T.dark, T.rim, 2.2);
  SC.set([hx - 16, hy - 8.5, hx + 16, hy - 8.5, hx + 12.5, hy - 4.5, hx - 12.5, hy - 4.5]);
  litPoly(ctx, 4, x, base - h - 2, T.dark, T.rim, 2);

  const aFront = armAngle(rad(62), lean, cheer, lean >= 0 ? 1 : -1, 1, ges);
  limb(ctx, dx + 10 - stoop, -h + 32, aFront, 34 + Math.abs(lean) * 24, 5.2, 3.4);
  litPoly(ctx, 4, x, base - h + 38, T.mid, T.rim, 2.2);
  litEllipse(ctx, HAND.x, HAND.y, 4.4, 4, 0, T.mid, T.rim, 1.4);

  ctx.restore();
  setLight(FIRE.x, FIRE.y);
}

/** Алесік: small, bowl-cut, in a shirt cut for somebody a head taller. */
function drawAlesik(ctx: C2D, x: number, lean: number, cheer: number, ges: number, p: Paint): void {
  const T = TONES.alesik;
  const h = 80;
  const hop = p.reduced ? 0 : ease(cheer) * Math.abs(Math.sin(p.t / 190)) * 7;
  const sway = p.reduced ? 0 : Math.sin(p.t / 1300 + 2.6) * 2;
  const dx = lean * 8 + sway;
  const base = BASE_Y + 6;

  castShadow(ctx, x, base + 2, 16, 0.46);
  ctx.save();
  ctx.translate(x, base - hop);
  setLight(FIRE.x - x, FIRE.y - base);

  const aBack = armAngle(rad(66), lean, cheer, lean >= 0 ? 1 : -1, -1, ges * 0.5);
  limb(ctx, -6, -h + 28, aBack, 24 + Math.abs(lean) * 14, 4.2, 5.4);
  litPoly(ctx, 4, x, base - h + 32, C.figD, T.mid, 1.2);

  SC.set([-9, -32, -2, -32, -1, 0, -10, 0]);
  litPoly(ctx, 4, x - 5, base - 16, T.dark, T.mid, 1.6);
  SC.set([2, -32, 9, -32, 10, 0, 1, 0]);
  litPoly(ctx, 4, x + 5, base - 16, T.dark, T.mid, 1.6);

  /* the shirt: a bell that swallows him, hem cut straight across */
  pbStart();
  pbM(dx - 10, -h + 18);
  pbQ(dx - 17, -52, -16, -30);
  pbL(15, -30);
  pbQ(dx + 16, -52, dx + 10, -h + 18);
  backing(ctx, x, base - 48);
  litPB(ctx, x, base - 48, T.mid, T.rim, 2.8);
  ctx.fillStyle = 'rgba(240,221,180,0.28)';
  for (let i = 0; i < 5; i++) ctx.fillRect(dx - 8 + i * 4, -h + 21, 2, 2);
  ctx.fillStyle = 'rgba(240,221,180,0.16)';
  ctx.fillRect(-15, -33, 30, 1.6);

  /* head, bowl-cut: a dome with the fringe cut flat across */
  const hx = dx + lean * 3;
  const hy = -h + 4;
  litEllipse(ctx, hx, hy, 9, 9.6, 0, T.mid, T.rim, 1.2);
  pbStart();
  pbM(hx - 9, hy - 1);
  pbL(hx - 12.6, hy + 1.4);
  pbL(hx - 8.6, hy + 3.2);
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = T.mid;
  ctx.fill();
  pbStart();
  pbM(hx - 10.4, hy - 1.6);
  pbQ(hx - 10.6, hy - 15, hx, hy - 15);
  pbQ(hx + 10.6, hy - 15, hx + 10.4, hy - 1.6);
  pbL(hx + 7.5, hy - 2.4);
  pbL(hx - 7.5, hy - 3);
  litPB(ctx, x, base - h, T.dark, T.rim, 2);

  const aFront = armAngle(rad(72), lean, cheer, lean >= 0 ? 1 : -1, 1, ges);
  limb(ctx, dx + 7, -h + 24, aFront, 26 + Math.abs(lean) * 18, 4.4, 5.8);
  litPoly(ctx, 4, x, base - h + 30, T.mid, T.rim, 1.8);

  ctx.restore();
  setLight(FIRE.x, FIRE.y);
}

/* ==================================================== the one who jumps === */

export function drawPlayer(ctx: C2D, s: SceneState, p: Paint): void {
  const core = s.core;
  const jt = core ? clamp(core.jumpT, 0, 1) : 0;
  const shove = core ? core.playerShove : 0;
  const base = BASE_Y + 10;
  const x = ANCHORS.player.x;

  /* the ride: up on a sine, but the recoil coming down is not its mirror */
  const rise = Math.sin(Math.PI * jt);
  const lift = rise * 88;
  const stretch = 1 + rise * 0.15 - (jt > 0.82 ? (jt - 0.82) * 0.8 : 0);
  const crouch = jt > 0 && jt < 0.1 ? (0.1 - jt) * 34 : 0;
  const skew = shove * CORE_SCALE * ease(jt * 1.6);
  const sway = p.reduced ? 0 : Math.sin(p.t / 1500) * 1;

  castShadow(ctx, x, base + 2, 21, 0.55 - rise * 0.3);

  /* the вілы stay planted in the boards — he goes up them, they do not go up
     with him, and a fork drawn floating is the tell of a rig */
  ctx.save();
  ctx.translate(x + skew * 0.35, base);
  setLight(FIRE.x - x, FIRE.y - base);
  drawFork(ctx, jt, rise);
  ctx.restore();

  ctx.save();
  ctx.translate(x + skew + sway, base - lift);
  setLight(FIRE.x - (x + skew), FIRE.y - (base - lift));

  const T = { dark: '#0e0904', mid: '#33200c', light: '#5b3512', rim: '#f6c374' };
  const h = 108 * stretch - crouch;

  /* legs, gripping the вілы */
  SC.set([-12, -46, -3, -48, -1, -2, -12, -2]);
  litPoly(ctx, 4, x - 7, base - 26, T.dark, T.mid, 2);
  SC.set([3, -48, 12, -46, 13, -2, 2, -2]);
  litPoly(ctx, 4, x + 8, base - 26, T.dark, T.mid, 2);

  /* torso — squashed on the crouch, drawn out on the rise */
  const bw = 13.5 / Math.sqrt(stretch);
  pbStart();
  pbM(-bw, -44);
  pbQ(-bw - 2.5, -h + 34, -bw + 3.5, -h + 17);
  pbL(bw - 3.5, -h + 17);
  pbQ(bw + 2.5, -h + 34, bw, -44);
  backing(ctx, x, base - h * 0.55);
  litPB(ctx, x, base - h * 0.55, T.mid, T.rim, 3.2);
  ctx.fillStyle = 'rgba(240,178,92,0.3)';
  ctx.fillRect(-bw, -56, bw * 2, 4);

  /* arms: down the shaft on the ground, up the cord at the top of the ride —
     and up in the air with everyone else when the room is cheering */
  const cheer = jt > 0 ? 0 : ease(s.crowd.cheer);
  const reachUp = Math.max(ease(clamp(jt * 2.2, 0, 1)), cheer);
  const aL = lerp(rad(106), rad(cheer > 0 ? -118 : -102), reachUp);
  const aR = lerp(rad(76), rad(cheer > 0 ? -62 : -74), reachUp);
  limb(ctx, -bw + 2, -h + 27, aL, 34 + reachUp * 10, 4.8, 3.2);
  litPoly(ctx, 4, x, base - h + 31, T.mid, T.rim, 2.2);
  limb(ctx, bw - 2, -h + 27, aR, 34 + reachUp * 10, 4.8, 3.2);
  litPoly(ctx, 4, x, base - h + 31, T.mid, T.rim, 2.2);

  /* head, thrown back as the mouth goes for the piece */
  const tilt = reachUp * 5;
  const hy = -h + 2 - tilt;
  litEllipse(ctx, 0, hy, 11, 12, rad(-reachUp * 9), T.mid, T.rim, 1.3);
  pbStart();
  pbM(-12.4, hy - 1);
  pbQ(-13.4, hy - 18, 0, hy - 17);
  pbQ(13.4, hy - 16, 12.4, hy + 2);
  pbL(7.5, hy + 0.5);
  pbL(-7.5, hy - 1);
  litPB(ctx, x, base - h, T.dark, T.rim, 2);
  pbStart();
  pbM(-10.6, hy - 1);
  pbL(-15.4, hy + 2.4);
  pbL(-10, hy + 4.6);
  pbReplay(ctx, 0, 0);
  ctx.fillStyle = T.mid;
  ctx.fill();
  /* the mouth, open only near the top of the ride */
  const open = jt > 0.3 && jt < 0.74 ? Math.sin(((jt - 0.3) / 0.44) * Math.PI) : 0;
  if (open > 0.02) {
    ellipsePath(ctx, -5.5, hy + 3.5, 3 + open * 1.8, 1.4 + open * 3.6, rad(-16));
    ctx.fillStyle = '#0a0502';
    ctx.fill();
  }

  ctx.restore();
  setLight(FIRE.x, FIRE.y);
}

/** The вілы the whole ride happens on. */
function drawFork(ctx: C2D, jt: number, rise: number): void {
  ctx.save();
  ctx.rotate(rad(-7 + jt * 4));
  ctx.lineCap = 'round';
  const shaft = 138 + rise * 26;
  ctx.strokeStyle = '#1a1006';
  ctx.lineWidth = 5.6;
  ctx.beginPath();
  ctx.moveTo(-22, 2);
  ctx.lineTo(-29, -shaft);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(244,195,116,0.42)';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(-24.6, 0);
  ctx.lineTo(-31.6, -shaft + 4);
  ctx.stroke();
  /* three tines on a cross-piece */
  ctx.strokeStyle = '#241608';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-40, -shaft);
  ctx.lineTo(-18, -shaft);
  ctx.moveTo(-38.5, -shaft);
  ctx.lineTo(-42, -shaft - 22);
  ctx.moveTo(-29, -shaft);
  ctx.lineTo(-29, -shaft - 26);
  ctx.moveTo(-19.5, -shaft);
  ctx.lineTo(-16, -shaft - 22);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(244,195,116,0.38)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-41.6, -shaft - 1);
  ctx.lineTo(-45.1, -shaft - 21);
  ctx.moveTo(-31.4, -shaft - 1);
  ctx.lineTo(-31.4, -shaft - 25);
  ctx.moveTo(-42, -shaft - 1.6);
  ctx.lineTo(-20, -shaft - 1.6);
  ctx.stroke();
  ctx.restore();
}

/* ========================================================== particles ==== */

export interface ParticleSpec {
  life: number;
  gravity: number;
  drag: number;
  size: number;
  spread: number;
  speed: number;
  additive: boolean;
}

export const PARTICLE_SPEC: Record<ParticleKind, ParticleSpec> = {
  flour: { life: 900, gravity: -0.000018, drag: 0.984, size: 4, spread: 1.4, speed: 0.05, additive: false },
  spark: { life: 1250, gravity: -0.000055, drag: 0.992, size: 2.4, spread: 0.9, speed: 0.075, additive: true },
  crumb: { life: 1000, gravity: 0.00042, drag: 0.996, size: 4, spread: 2.4, speed: 0.13, additive: false },
  steam: { life: 1700, gravity: -0.000024, drag: 0.978, size: 12, spread: 1.2, speed: 0.03, additive: false },
  snow: { life: 11000, gravity: 0.000012, drag: 0.999, size: 1.9, spread: 2.6, speed: 0.012, additive: false },
};

/** u is 0 at birth, 1 at death. */
export function drawParticle(
  ctx: C2D,
  kind: ParticleKind,
  x: number,
  y: number,
  u: number,
  size: number,
  rot: number,
): void {
  const fade = 1 - u;
  switch (kind) {
    case 'flour':
      ctx.globalAlpha = fade * fade * 0.3;
      ctx.fillStyle = '#e4d0a4';
      ellipsePath(ctx, x, y, size * (0.28 + u * 0.9), size * (0.24 + u * 0.7), rot);
      ctx.fill();
      break;
    case 'spark':
      ctx.globalAlpha = fade * fade * 0.9;
      ctx.fillStyle = u < 0.4 ? '#ffe3a6' : '#e2831f';
      ellipsePath(ctx, x, y, size * fade, size * fade * 1.5, rot);
      ctx.fill();
      break;
    case 'crumb': {
      ctx.globalAlpha = clamp(fade * 2.2, 0, 1);
      ctx.fillStyle = u < 0.5 ? '#c88f45' : '#8a5b26';
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillRect(-size * 0.5, -size * 0.4, size, size * 0.8);
      ctx.restore();
      break;
    }
    case 'steam':
      ctx.globalAlpha = fade * 0.12;
      ctx.fillStyle = '#f3e6cd';
      ellipsePath(ctx, x, y, size * (0.5 + u * 1.4), size * (0.5 + u * 1.1), rot);
      ctx.fill();
      break;
    default:
      ctx.globalAlpha = clamp(fade * 1.8, 0, 1) * (0.3 + (size % 1) * 0.5);
      ctx.fillStyle = C.snow;
      ellipsePath(ctx, x, y, size, size, 0);
      ctx.fill();
      break;
  }
  ctx.globalAlpha = 1;
}

/* ============================================================ prologue === */
/* Eight seconds, once: outside, snow, one lit window, the door opening. Held
   deliberately simple — it sets the night and then gets out of the way. */

export function drawPrologue(ctx: C2D, s: SceneState, p: Paint): void {
  const g = bk(ctx);
  const u = clamp(s.prologueT, 0, 1);
  /* the camera walks in over the last third */
  const push = ease(clamp((u - 0.55) / 0.45, 0, 1));

  ctx.fillStyle = g.sky;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  /* the push aims at the doorway, not at the middle of the frame */
  ctx.save();
  ctx.translate(432, 322);
  ctx.scale(1 + push * 2.1, 1 + push * 2.1);
  ctx.translate(-432, -322);

  /* moon, low and hazed */
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pool(ctx, g.cool, 578, 92, 130, 0.34, 1);
  ctx.restore();
  ctx.fillStyle = C.moon;
  ctx.globalAlpha = 0.82;
  ctx.beginPath();
  ctx.arc(578, 92, 17, 0, TAU);
  ctx.fill();
  ctx.globalAlpha = 1;

  /* the treeline behind the yard, one flat darkness step */
  ctx.fillStyle = '#0a1120';
  ctx.beginPath();
  ctx.moveTo(0, 318);
  for (let i = 0; i <= 24; i++) {
    const tx = (i / 24) * STAGE_W;
    const th = 300 - hash(i * 7) * 46 - (i % 3) * 8;
    ctx.lineTo(tx, th);
    ctx.lineTo(tx + 14, th + 18 + hash(i * 3) * 12);
  }
  ctx.lineTo(STAGE_W, 340);
  ctx.lineTo(STAGE_W, STAGE_H);
  ctx.lineTo(0, STAGE_H);
  ctx.closePath();
  ctx.fill();

  /* snow on the ground */
  const ground = ctx.createLinearGradient(0, 330, 0, STAGE_H);
  ground.addColorStop(0, '#25344b');
  ground.addColorStop(1, '#101a2c');
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, 352);
  ctx.quadraticCurveTo(STAGE_W / 2, 336, STAGE_W, 354);
  ctx.lineTo(STAGE_W, STAGE_H);
  ctx.lineTo(0, STAGE_H);
  ctx.closePath();
  ctx.fill();

  /* the hata: gable, thatch under snow, one window, one door */
  const hx = 360;
  const gy = 128;
  const wallTop = 216;
  const eaves = 372;

  /* smoke, the sign that somebody is baking in there tonight */
  ctx.strokeStyle = 'rgba(150,168,196,0.16)';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx + 74, 152);
  for (let i = 1; i <= 5; i++) {
    const sy = 152 - i * 26;
    ctx.lineTo(hx + 74 + Math.sin(p.t / 1400 + i * 0.9) * (5 + i * 3.5), sy);
  }
  ctx.stroke();
  ctx.lineWidth = 1;

  /* the body of the house — one flat, very dark sheet, with the log courses
     only just legible where the moon reaches */
  ctx.fillStyle = '#0a0e18';
  ctx.fillRect(hx - 186, wallTop, 372, eaves - wallTop);
  for (let i = 1; i < 9; i++) {
    ctx.fillStyle = 'rgba(150,170,205,0.05)';
    ctx.fillRect(hx - 186, wallTop + i * 19, 372, 1.2);
  }
  /* the chimney */
  ctx.fillStyle = '#080c14';
  ctx.fillRect(hx + 62, 142, 26, 60);
  ctx.fillStyle = 'rgba(215,229,246,0.42)';
  ctx.fillRect(hx + 60, 140, 30, 5);

  /* the roof, a second sheet a step lighter, snow lying along both slopes */
  ctx.beginPath();
  ctx.moveTo(hx - 202, wallTop + 8);
  ctx.lineTo(hx, gy);
  ctx.lineTo(hx + 202, wallTop + 8);
  ctx.lineTo(hx + 190, wallTop + 20);
  ctx.lineTo(hx, gy + 18);
  ctx.lineTo(hx - 190, wallTop + 20);
  ctx.closePath();
  ctx.fillStyle = '#121a2a';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx - 206, wallTop + 6);
  ctx.lineTo(hx, gy - 8);
  ctx.lineTo(hx + 206, wallTop + 6);
  ctx.lineTo(hx + 200, wallTop + 13);
  ctx.lineTo(hx, gy - 1);
  ctx.lineTo(hx - 200, wallTop + 13);
  ctx.closePath();
  ctx.fillStyle = 'rgba(215,229,246,0.62)';
  ctx.fill();
  /* the gable end under it */
  ctx.beginPath();
  ctx.moveTo(hx - 190, wallTop + 16);
  ctx.lineTo(hx, gy + 14);
  ctx.lineTo(hx + 190, wallTop + 16);
  ctx.closePath();
  ctx.fillStyle = '#070b13';
  ctx.fill();
  /* the little gable window, dark */
  ctx.fillStyle = '#101828';
  ctx.fillRect(hx - 13, wallTop - 30, 26, 24);

  /* the warm window: the only thing in the frame that is not blue */
  const wf = p.reduced ? 0.6 : 0.5 + p.flick * 0.5;
  const wx = hx - 116;
  const wy = 252;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  pool(ctx, g.glow, wx + 28, wy + 28, 116 + wf * 16, 0.34 + wf * 0.16, 0.92);
  ctx.restore();
  const paneG = ctx.createRadialGradient(wx + 20, wy + 18, 4, wx + 28, wy + 28, 46);
  paneG.addColorStop(0, '#ffd489');
  paneG.addColorStop(0.55, C.paneWarm);
  paneG.addColorStop(1, '#b96b1c');
  ctx.globalAlpha = 0.78 + wf * 0.18;
  ctx.fillStyle = paneG;
  ctx.fillRect(wx, wy, 56, 56);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#070b13';
  ctx.fillRect(wx + 25, wy, 6, 56);
  ctx.fillRect(wx, wy + 25, 56, 6);
  ctx.strokeStyle = 'rgba(215,229,246,0.34)';
  ctx.lineWidth = 2.4;
  ctx.strokeRect(wx - 3, wy - 3, 62, 62);
  ctx.fillStyle = 'rgba(215,229,246,0.5)';
  ctx.fillRect(wx - 6, wy - 7, 68, 4);

  /* the door, opening on the last beat and spilling the room out */
  const open = ease(clamp((u - 0.42) / 0.4, 0, 1));
  const dx0 = hx + 42;
  const dw = 62;
  ctx.fillStyle = '#05070c';
  ctx.fillRect(dx0, 258, dw, eaves - 258);
  if (open > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    pool(ctx, g.glow, dx0 + dw * 0.5, 320, 40 + open * 168, open * (0.5 + wf * 0.2), 0.95);
    ctx.restore();
    /* what is behind the door is a room with a hearth in it, low and to one
       side — not a lit panel */
    const slot = ctx.createRadialGradient(dx0 + 10, eaves - 34, 3, dx0 + 14, eaves - 30, 108);
    slot.addColorStop(0, 'rgba(255,214,140,0.98)');
    slot.addColorStop(0.32, 'rgba(226,132,40,0.72)');
    slot.addColorStop(0.72, 'rgba(120,52,14,0.42)');
    slot.addColorStop(1, 'rgba(30,14,5,0.55)');
    ctx.fillStyle = slot;
    ctx.fillRect(dx0, 258, dw * open, eaves - 258);
    /* the lintel's shadow, so the opening has a ceiling */
    const lint = ctx.createLinearGradient(0, 258, 0, 300);
    lint.addColorStop(0, 'rgba(12,6,2,0.85)');
    lint.addColorStop(1, 'rgba(12,6,2,0)');
    ctx.fillStyle = lint;
    ctx.fillRect(dx0, 258, dw * open, 44);
    /* the light falling out of it onto the snow */
    ctx.beginPath();
    ctx.moveTo(dx0, eaves);
    ctx.lineTo(dx0 + dw * open, eaves);
    ctx.lineTo(dx0 + dw * open + 44 * open, eaves + 70 * open);
    ctx.lineTo(dx0 - 20 * open, eaves + 70 * open);
    ctx.closePath();
    ctx.fillStyle = `rgba(238,168,72,${open * 0.16})`;
    ctx.fill();
    /* the leaf of the door, swung in */
    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.moveTo(dx0 + dw * open, 258);
    ctx.lineTo(dx0 + dw, 258 + open * 16);
    ctx.lineTo(dx0 + dw, eaves - open * 16);
    ctx.lineTo(dx0 + dw * open, eaves);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(200,216,240,0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(dx0 - 2, 256, dw + 4, eaves - 254);

  /* the drift banked against the wall, and the path trodden to the door */
  ctx.beginPath();
  ctx.moveTo(hx - 330, eaves + 30);
  ctx.quadraticCurveTo(hx - 150, eaves - 14, hx - 10, eaves - 6);
  ctx.quadraticCurveTo(hx + 150, eaves + 2, hx + 336, eaves + 34);
  ctx.lineTo(hx + 336, eaves + 90);
  ctx.lineTo(hx - 330, eaves + 90);
  ctx.closePath();
  const drift = ctx.createLinearGradient(0, eaves - 12, 0, eaves + 76);
  drift.addColorStop(0, 'rgba(215,229,246,0.2)');
  drift.addColorStop(1, 'rgba(215,229,246,0)');
  ctx.fillStyle = drift;
  ctx.fill();
  /* the path trodden to the door */
  ctx.beginPath();
  ctx.moveTo(dx0 + 6, eaves);
  ctx.lineTo(dx0 + dw - 6, eaves);
  ctx.lineTo(dx0 + dw + 40, STAGE_H);
  ctx.lineTo(dx0 - 40, STAGE_H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(10,16,28,0.42)';
  ctx.fill();

  ctx.restore();

  /* the last beat washes the frame out into the interior */
  if (push > 0.6) {
    ctx.fillStyle = `rgba(24,12,4,${(push - 0.6) / 0.4})`;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  }
}

/* ============================================================== grain ==== */
/* Composited with 'overlay', so it survives only where the fire has put light —
   which is exactly where paper grain would show. */

export function makeGrainTile(size: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const g = cv.getContext('2d');
  if (!g) return cv;
  const img = g.createImageData(size, size);
  const d = img.data;
  for (let i = 0; i < size * size; i++) {
    /* two frequencies: fibre and speckle */
    const x = i % size;
    const y = (i / size) | 0;
    const fibre = hash(y * 131 + 7) * 0.5 + hash(x * 17 + y * 3) * 0.5;
    const v = 118 + (fibre - 0.5) * 74 + (hash(i * 2654435761) - 0.5) * 46;
    d[i * 4] = v;
    d[i * 4 + 1] = v * 0.985;
    d[i * 4 + 2] = v * 0.95;
    d[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return cv;
}

export { C as PALETTE, BASE_Y, FLOOR_Y, WINDOW, MOUTH };
