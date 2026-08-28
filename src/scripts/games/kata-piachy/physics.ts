/* «Ката пячы» — the cord and the dough, both of them only for the look.
 *
 * COSMETIC ONLY. Nothing computed here ever reaches a game outcome: the bite
 * is judged in mechanics.ts against the analytic `theta()`/`pieceX()`, and this
 * module is not imported there and never will be. The rope is a verlet chain
 * that *trails* an angle it is handed; it does not decide one. If the chain
 * ever disagrees with the analytic line by more than a couple of degrees the
 * player would aim by a lie, so the disagreement is clamped, hard.
 *
 * Two more constraints shape everything below:
 *   — a background tab hands us a dt of minutes, so dt is capped and spent in
 *     fixed substeps, and every node is checked for having run off to infinity;
 *   — the frame loop must not allocate, so all state lives in preallocated
 *     typed arrays and `step()` returns the same array of the same points.
 */
import type { Dough, Pt, Rope } from './types.ts';
import { CORE_SCALE, PIVOT } from './types.ts';

/* ----------------------------------------------------------------- shop --- */

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const rad = (deg: number) => (deg * Math.PI) / 180;
const finite = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);

/** Longest frame we will believe. Anything above is a tab coming back. */
const MAX_DT_MS = 50;
/** Fixed integration step. Small enough that stiff pulls stay stable. */
const SUB_MS = 8;
const SUB_S = SUB_MS / 1000;
/** Leftover time never banks more than this, or a resume replays the wait. */
const MAX_ACC_MS = MAX_DT_MS + SUB_MS;

/** v1's cord, 74 core units from the knot to the top of the cat. */
const CORD_CORE = 74;
/** …which is this on the stage: 166.5. */
const CORD_LEN = CORD_CORE * CORE_SCALE;

/* ------------------------------------------------------------------ rope --- */

export interface RopeOptions {
  /** Nodes between pivot and tip. 9 segments = 18.5 stage units each. */
  segments?: number;
  /** Rest length pivot→tip, stage units. Default 166.5 (74 core units). */
  length?: number;
  /** Where the cord is tied. Default PIVOT. */
  pivot?: Pt;
  /** Stage units per second squared on the free nodes. */
  gravity?: number;
  /** Velocity decay rate, 1/s. Higher settles faster. */
  damping?: number;
  /** Constraint relaxation passes per substep. */
  iterations?: number;
  /** Tip spring per substep at wild=0 — nearly rigid. */
  tautPull?: number;
  /** …and at wild=1 — trails and overshoots. `wild` reads between the two
   *  geometrically, because a linear read spends most of its range stiff. */
  loosePull?: number;
  /** Hard cap on how far the tip may lag the analytic angle, degrees, at
   *  wild=0 and wild=1. The player aims by the cord; this is the whole reason
   *  the rope is allowed to exist. */
  maxLagTautDeg?: number;
  maxLagLooseDeg?: number;
  /** Milliseconds an `impulse` keeps pushing before it is spent. */
  impulseTau?: number;
  /** How far a live impulse slackens the pose spring, so a hit still shows on
   *  a cord that is otherwise tracking rigidly. 0 turns the effect off. */
  impulseSlack?: number;
  /** The impulse speed that counts as a full slackening, stage units/s. */
  impulseFull?: number;
  /**
   * Which way the cord leans for a positive angle. -1 matches mechanics'
   * `pieceX()` (x = PIVOT_X + dx·cosθ − dy·sinθ), which is what the scene
   * derives its cat frame from. See the note in the worker report.
   */
  xSign?: 1 | -1;
}

export function createRope(opts: RopeOptions = {}): Rope {
  const segs = Math.round(clamp(opts.segments ?? 9, 3, 40));
  const len = Math.max(1, opts.length ?? CORD_LEN);
  const seg = len / segs;
  const px0 = opts.pivot ? opts.pivot.x : PIVOT.x;
  const py0 = opts.pivot ? opts.pivot.y : PIVOT.y;
  const grav = opts.gravity ?? 900;
  const iters = Math.round(clamp(opts.iterations ?? 3, 1, 8));
  const tautPull = clamp(opts.tautPull ?? 0.5, 0.002, 1);
  const loosePull = clamp(opts.loosePull ?? 0.008, 0.001, 1);
  const pullRatio = loosePull / tautPull;
  const lagTaut = rad(opts.maxLagTautDeg ?? 2.5);
  const lagLoose = rad(opts.maxLagLooseDeg ?? 8);
  const sign = opts.xSign === 1 ? 1 : -1;
  const impTau = Math.max(16, opts.impulseTau ?? 70) / 1000;
  const slackGain = Math.max(0, opts.impulseSlack ?? 9);
  const impFull = Math.max(1, opts.impulseFull ?? 400);

  /* per-substep constants, so the hot loop has no pow() in it */
  const drag = Math.exp(-Math.max(0, opts.damping ?? 3) * SUB_S);
  const gh2 = grav * SUB_S * SUB_S;
  const impDecay = Math.exp(-SUB_S / impTau);

  const n = segs + 1;
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  const ox = new Float64Array(n);
  const oy = new Float64Array(n);
  /** How much of an impulse each node takes: nothing above the waist. */
  const kickW = new Float64Array(n);
  /** How hard the analytic line claims each node. */
  const poseW = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    kickW[i] = clamp((i / segs - 0.5) * 2, 0, 1);
    poseW[i] = i / segs;
  }

  const pts: Pt[] = new Array(n);
  for (let i = 0; i < n; i++) pts[i] = { x: px0, y: py0 };

  let impX = 0;
  let impY = 0;
  let slack = 0;
  let acc = 0;
  let lastTheta = 0;

  function place(thetaDeg: number): void {
    const a = rad(thetaDeg);
    const ux = sign * Math.sin(a);
    const uy = Math.cos(a);
    for (let i = 0; i < n; i++) {
      const d = seg * i;
      x[i] = px0 + ux * d;
      y[i] = py0 + uy * d;
      ox[i] = x[i];
      oy[i] = y[i];
    }
  }

  function reset(thetaDeg: number): void {
    lastTheta = finite(thetaDeg, 0);
    place(lastTheta);
    impX = 0;
    impY = 0;
    slack = 0;
    acc = 0;
  }

  function substep(thetaDeg: number, basePull: number, maxLag: number): void {
    const a = rad(thetaDeg);
    const ux = sign * Math.sin(a);
    const uy = Math.cos(a);

    /* verlet on everything but the knot */
    for (let i = 1; i < n; i++) {
      const vx = (x[i] - ox[i]) * drag;
      const vy = (y[i] - oy[i]) * drag;
      const w = kickW[i];
      ox[i] = x[i];
      oy[i] = y[i];
      x[i] += vx + impX * w * SUB_S * SUB_S;
      y[i] += vy + gh2 + impY * w * SUB_S * SUB_S;
    }
    impX *= impDecay;
    impY *= impDecay;
    const pull = basePull / (1 + slackGain * slack);
    slack *= impDecay;

    /* Every node is spring-hauled toward its own place on the analytic line,
       weakest at the knot and full strength at the tip. Hauling the tip alone
       whips the last segment — and the scene reads the cat's rotation off that
       segment, so a whip there is the cat lying about where the cord points. */
    for (let i = 1; i < n; i++) {
      const p = pull * poseW[i];
      x[i] += (px0 + ux * seg * i - x[i]) * p;
      y[i] += (py0 + uy * seg * i - y[i]) * p;
    }

    for (let it = 0; it < iters; it++) {
      x[0] = px0;
      y[0] = py0;
      for (let i = 0; i < segs; i++) {
        const j = i + 1;
        let dx = x[j] - x[i];
        let dy = y[j] - y[i];
        let d = Math.sqrt(dx * dx + dy * dy);
        if (!(d > 1e-6)) {
          dx = 0;
          dy = seg;
          d = seg;
        }
        const k = (d - seg) / d;
        if (i === 0) {
          x[j] -= dx * k;
          y[j] -= dy * k;
        } else {
          const h = k * 0.5;
          x[i] += dx * h;
          y[i] += dy * h;
          x[j] -= dx * h;
          y[j] -= dy * h;
        }
      }
    }
    x[0] = px0;
    y[0] = py0;

    /* the promise: the tip never strays more than `maxLag` from the analytic
       angle. Rotating the whole chain about the knot keeps every segment
       length exactly and, because the previous positions turn with it, adds no
       energy — it reads as the beam dragging the cord round, which it is. */
    const dx = x[segs] - px0;
    const dy = y[segs] - py0;
    const cross = ux * dy - uy * dx;
    const dot = ux * dx + uy * dy;
    const dev = Math.atan2(cross, dot);
    if (dev > maxLag || dev < -maxLag) {
      const turn = dev > 0 ? maxLag - dev : -maxLag - dev;
      const c = Math.cos(turn);
      const s = Math.sin(turn);
      for (let i = 1; i < n; i++) {
        let rx = x[i] - px0;
        let ry = y[i] - py0;
        x[i] = px0 + rx * c - ry * s;
        y[i] = py0 + rx * s + ry * c;
        rx = ox[i] - px0;
        ry = oy[i] - py0;
        ox[i] = px0 + rx * c - ry * s;
        oy[i] = py0 + rx * s + ry * c;
      }
    }
  }

  /** Anything this far from the knot is arithmetic that has come apart. */
  const SANE = len * 1.6;

  function sane(): boolean {
    for (let i = 0; i < n; i++) {
      const dx = x[i] - px0;
      const dy = y[i] - py0;
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return false;
      if (dx * dx + dy * dy > SANE * SANE) return false;
    }
    return true;
  }

  function step(dtMs: number, thetaDeg: number, wild: number): readonly Pt[] {
    const th = finite(thetaDeg, lastTheta);
    const w = clamp(finite(wild, 0), 0, 1);
    const pull = w <= 0 ? tautPull : tautPull * Math.pow(pullRatio, w);
    const maxLag = lagTaut + (lagLoose - lagTaut) * w;

    acc += clamp(finite(dtMs, 0), 0, MAX_DT_MS);
    if (acc > MAX_ACC_MS) acc = MAX_ACC_MS;
    const steps = Math.floor(acc / SUB_MS);
    acc -= steps * SUB_MS;

    const d0 = th - lastTheta;
    for (let s = 1; s <= steps; s++) {
      substep(lastTheta + (d0 * s) / steps, pull, maxLag);
    }
    lastTheta = th;
    if (!sane()) reset(th);

    for (let i = 0; i < n; i++) {
      pts[i].x = x[i];
      pts[i].y = y[i];
    }
    return pts;
  }

  function impulse(vx: number, vy: number): void {
    /* an impulse is stated as the velocity it wants to give the tip; it is
       spent as a decaying push so the chain bends into it instead of jumping */
    const ix = finite(vx, 0);
    const iy = finite(vy, 0);
    impX += ix / impTau;
    impY += iy / impTau;
    slack = Math.min(1, slack + Math.sqrt(ix * ix + iy * iy) / impFull);
  }

  reset(0);
  return { step, impulse, reset };
}

/* ----------------------------------------------------------------- dough --- */

export interface DoughOptions {
  /** Ring resolution. 14 is enough to read as dough and cheap to smooth. */
  points?: number;
  centre?: Pt;
  /** Radial spring toward the rest radius, 1/s² (ω² of the wobble). */
  stiffness?: number;
  /** Velocity decay rate, 1/s. Sets how doughy the return is. */
  damping?: number;
  /** Neighbour blend per substep, twice — this is what forbids spikes. */
  smoothing?: number;
  /** Milliseconds for the rest radius to reach ~63 % of a new `grow()`. */
  growTau?: number;
  /** Milliseconds for a dent to decay to ~37 %. Recovery reads at ~3×. */
  pokeTau?: number;
  /** Dent depth at strength 1, as a fraction of the rest radius. */
  pokeDepth?: number;
  /** How much of the dented volume comes back out of the far side. */
  pokeBulge?: number;
  /** Half-width of the thumb, radians. */
  pokeArc?: number;
  /** Ceiling on the alive-while-swelling wobble, fraction of the radius. */
  wobble?: number;
  /** Radius is never outside these multiples of the rest radius. */
  minFrac?: number;
  maxFrac?: number;
}

export function createDough(opts: DoughOptions = {}): Dough {
  const n = Math.round(clamp(opts.points ?? 14, 6, 64));
  const stiff = opts.stiffness ?? 900;
  const smooth = clamp(opts.smoothing ?? 0.16, 0, 0.5);
  const growTau = Math.max(16, opts.growTau ?? 110);
  const pokeTau = Math.max(16, opts.pokeTau ?? 105);
  const pokeDepth = clamp(opts.pokeDepth ?? 0.3, 0, 0.8);
  const pokeBulge = clamp(opts.pokeBulge ?? 0.45, 0, 1);
  const pokeArc = clamp(opts.pokeArc ?? 1.0, 0.2, Math.PI * 0.5);
  const wobbleMax = clamp(opts.wobble ?? 0.07, 0, 0.3);
  const minFrac = clamp(opts.minFrac ?? 0.5, 0.05, 0.95);
  const maxFrac = clamp(opts.maxFrac ?? 1.5, 1.05, 3);

  const drag = Math.exp(-Math.max(0, opts.damping ?? 18) * SUB_S);
  const growEase = 1 - Math.exp(-SUB_MS / growTau);
  const dentDecay = Math.exp(-SUB_MS / pokeTau);
  const sh2 = stiff * SUB_S * SUB_S;

  const cosA = new Float64Array(n);
  const sinA = new Float64Array(n);
  /** Each point breathes on its own phase, or the ball pulses like a heart. */
  const phase = new Float64Array(n);
  const omega = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    cosA[i] = Math.cos(a);
    sinA[i] = Math.sin(a);
    phase[i] = i * 2.39996;
    omega[i] = 0.0055 + ((i * 7) % 5) * 0.0011;
  }

  const r = new Float64Array(n);
  const or_ = new Float64Array(n);
  const dent = new Float64Array(n);
  const tmp = new Float64Array(n);
  const tmpO = new Float64Array(n);

  const pts: Pt[] = new Array(n);
  for (let i = 0; i < n; i++) pts[i] = { x: 0, y: 0 };

  let cx = opts.centre ? opts.centre.x : 0;
  let cy = opts.centre ? opts.centre.y : 0;
  let targetR = 0;
  let restR = 0;
  let wobble = 0;
  let clock = 0;
  let acc = 0;

  function blend(arr: Float64Array, out: Float64Array): void {
    for (let i = 0; i < n; i++) {
      const a = arr[(i + n - 1) % n];
      const b = arr[(i + 1) % n];
      out[i] = arr[i] + ((a + b) * 0.5 - arr[i]) * smooth;
    }
    for (let i = 0; i < n; i++) arr[i] = out[i];
  }

  function substep(): void {
    const was = restR;
    restR += (targetR - restR) * growEase;
    clock += SUB_MS;

    /* swelling is what makes it wobble; a ball left alone goes quiet */
    const drive = restR > 0.5 ? (Math.abs(restR - was) / restR) * 26 : 0;
    wobble = Math.max(wobble * 0.985, Math.min(wobbleMax, drive));

    const lo = restR * minFrac;
    const hi = restR * maxFrac + 0.5;

    for (let i = 0; i < n; i++) {
      const rest = restR * (1 + wobble * Math.sin(phase[i] + clock * omega[i])) + dent[i];
      const v = (r[i] - or_[i]) * drag;
      or_[i] = r[i];
      r[i] += v + (rest - r[i]) * sh2;
      dent[i] *= dentDecay;
      if (!Number.isFinite(r[i])) {
        r[i] = restR;
        or_[i] = restR;
      }
    }

    /* two Laplacian passes on radius *and* on the previous radius: the shape
       loses its spikes without the smoothing quietly feeding in velocity */
    blend(r, tmp);
    blend(or_, tmpO);
    blend(r, tmp);
    blend(or_, tmpO);

    for (let i = 0; i < n; i++) {
      if (r[i] < lo) {
        r[i] = lo;
        or_[i] = lo;
      } else if (r[i] > hi) {
        r[i] = hi;
        or_[i] = hi;
      }
    }
  }

  function step(dtMs: number): readonly Pt[] {
    acc += clamp(finite(dtMs, 0), 0, MAX_DT_MS);
    if (acc > MAX_ACC_MS) acc = MAX_ACC_MS;
    while (acc >= SUB_MS) {
      acc -= SUB_MS;
      substep();
    }
    for (let i = 0; i < n; i++) {
      pts[i].x = cx + cosA[i] * r[i];
      pts[i].y = cy + sinA[i] * r[i];
    }
    return pts;
  }

  function grow(rr: number): void {
    targetR = Math.max(0, finite(rr, targetR));
  }

  function poke(angle: number, strength: number): void {
    const a = finite(angle, 0);
    const s = clamp(finite(strength, 0), 0, 1);
    if (s <= 0 || restR <= 0.5) return;
    const depth = restR * pokeDepth * s;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    for (let i = 0; i < n; i++) {
      /* angular distance without a wrap branch */
      const d = Math.acos(clamp(cosA[i] * ca + sinA[i] * sa, -1, 1));
      if (d < pokeArc) {
        const f = 1 - d / pokeArc;
        const g = f * f * (3 - 2 * f);
        dent[i] -= depth * g;
        /* the thumb arrives with a speed, not just a shape */
        or_[i] += depth * g * 0.35;
      }
      const far = Math.PI - d;
      if (far < pokeArc * 1.6) {
        const f = 1 - far / (pokeArc * 1.6);
        dent[i] += depth * pokeBulge * f * f * (3 - 2 * f);
      }
    }
  }

  function setCentre(x: number, y: number): void {
    cx = finite(x, cx);
    cy = finite(y, cy);
  }

  return { step, grow, poke, setCentre };
}
