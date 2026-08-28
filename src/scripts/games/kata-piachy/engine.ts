/* «Ката пячы» — the canvas engine. Plumbing, not art: everything it draws
 * comes out of scene.ts.
 *
 * What it owns: the logical 720×480 stage letterboxed into whatever box CSS
 * gives the element, devicePixelRatio capped at 2, the camera easing, the
 * hitstop clock, the screen shake, the particle pools, and the offscreen
 * caching of the layers that never change (the room itself). It does not own
 * requestAnimationFrame — the director calls render() once a frame, because
 * the director is the one that knows when the tab is hidden.
 *
 * The fire flickers on smooth value noise rather than on random(): a strobe is
 * cheaper and reads as a fault. Under prefers-reduced-motion the flicker, the
 * shake, the camera easing and the particles all stop; the room stays lit.
 */
import { paintBack, paintFront, paintSet, drawBakeProps, drawCat, drawCord, drawCrowd, drawFire, drawLight, drawParticle, drawPlayer, drawPlayGlow, drawPrologue, drawWindowSnow, makeGrainTile, PARTICLE_SPEC, setMood, type Paint } from './scene';
import { STAGE_H, STAGE_W, type Camera, type Engine, type ParticleKind, type SceneState } from './types';

/** Retina beyond 2 costs fill rate and buys nothing at this scale. */
const DPR_CAP = 2;
/** Cached layers are rasterised at this many device px per stage unit, at most. */
const CACHE_CAP = 2.4;
const POOL = 400;
const GRAIN = 128;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/* ------------------------------------------------------------- the noise -- */
/* One table, smoothstep-interpolated, three octaves. Deterministic, so two
   sessions of the game flicker identically — which matters only in that it
   never lands on a pattern that looks like a bug. */

const NOISE = new Float32Array(257);
(() => {
  let s = 0x2f6e2b1;
  for (let i = 0; i < 257; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    NOISE[i] = s / 4294967296;
  }
  NOISE[256] = NOISE[0];
})();

function vnoise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const a = NOISE[i & 255];
  const b = NOISE[(i + 1) & 255];
  return a + (b - a) * f * f * (3 - 2 * f);
}

function flickerAt(t: number): number {
  return clamp(0.6 * vnoise(t * 0.0041) + 0.27 * vnoise(t * 0.0113 + 37) + 0.13 * vnoise(t * 0.0291 + 91), 0, 1);
}

/* ---------------------------------------------------------- particles ----- */

interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  rot: number;
  vr: number;
  wob: number;
}

function makePool(): Particle[] {
  const out: Particle[] = new Array(POOL);
  for (let i = 0; i < POOL; i++) {
    out[i] = { kind: 'flour', x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, size: 0, rot: 0, vr: 0, wob: 0 };
  }
  return out;
}

/* ------------------------------------------------------------- the engine -- */

export function createEngine(canvas: HTMLCanvasElement): Engine {
  const c2d = canvas.getContext('2d', { alpha: false });
  if (!c2d) throw new Error('kata: no 2d context');
  const ctx: CanvasRenderingContext2D = c2d;

  /* the whole frame's mutable state, allocated once */
  const paint: Paint = { t: 0, flick: 0.5, dim: 0, reduced: false };
  const cam: Camera = { x: STAGE_W / 2, y: STAGE_H / 2, zoom: 1 };
  const pool = makePool();
  let cursor = 0;

  let dpr = 1;
  let fit = 1;
  let ox = 0;
  let oy = 0;
  let cssW = 0;
  let cssH = 0;

  let cacheScale = 0;
  let back: HTMLCanvasElement | null = null;
  let set: HTMLCanvasElement | null = null;
  let grain: CanvasPattern | null = null;

  let clock = 0;
  let last = 0;
  let hold = 0;
  let shakeMag = 0;
  let shakePhase = 0;
  let dim = 0;
  let snowDebt = 0;
  let outside = false;
  let started = false;

  const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => resize());
  ro?.observe(canvas);

  /* ------------------------------------------------------------ layers --- */

  function layer(scale: number): HTMLCanvasElement {
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.ceil(STAGE_W * scale));
    cv.height = Math.max(1, Math.ceil(STAGE_H * scale));
    return cv;
  }

  function rebuild(scale: number): void {
    cacheScale = scale;
    back = layer(scale);
    set = layer(scale);
    const bg = back.getContext('2d');
    const sg = set.getContext('2d');
    if (!bg || !sg) return;
    /* the room is cached once and reused through every act, so it must be
       rasterised in act I's light — never with act II's cold fill baked in */
    setMood(0);
    bg.setTransform(scale, 0, 0, scale, 0, 0);
    paintBack(bg);
    sg.setTransform(scale, 0, 0, scale, 0, 0);
    paintSet(sg);
    setMood(dim);
  }

  function resize(): void {
    const r = canvas.getBoundingClientRect();
    const w = r.width || canvas.clientWidth;
    const h = r.height || canvas.clientHeight;
    if (w < 2 || h < 2) return;
    dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    cssW = w;
    cssH = h;
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    fit = Math.min(w / STAGE_W, h / STAGE_H);
    ox = (w - STAGE_W * fit) / 2;
    oy = (h - STAGE_H * fit) / 2;

    const want = clamp(fit * dpr, 1, CACHE_CAP);
    /* rebuilding costs ~15 ms; do not do it for a rounding error */
    if (!back || Math.abs(want - cacheScale) > 0.12) rebuild(want);
    if (!grain) {
      const p = ctx.createPattern(makeGrainTile(GRAIN), 'repeat');
      grain = p;
    }
  }

  /* ---------------------------------------------------------- particles -- */

  function spawn(kind: ParticleKind, x: number, y: number): void {
    const spec = PARTICLE_SPEC[kind];
    const p = pool[cursor];
    cursor = (cursor + 1) % POOL;
    const a = Math.random() * Math.PI * 2;
    const s = spec.speed * (0.4 + Math.random() * 1.2);
    p.kind = kind;
    p.x = x + (Math.random() - 0.5) * spec.spread * 4;
    p.y = y + (Math.random() - 0.5) * spec.spread * 3;
    p.vx = Math.cos(a) * s;
    p.vy = Math.sin(a) * s - (kind === 'crumb' ? 0.06 : 0);
    p.age = 0;
    p.life = spec.life * (0.7 + Math.random() * 0.6);
    p.size = spec.size * (0.6 + Math.random() * 0.8);
    p.rot = Math.random() * Math.PI * 2;
    p.vr = (Math.random() - 0.5) * 0.006;
    p.wob = Math.random() * Math.PI * 2;
  }

  function stepParticles(dt: number): void {
    for (let i = 0; i < POOL; i++) {
      const p = pool[i];
      if (p.age >= p.life) continue;
      const spec = PARTICLE_SPEC[p.kind];
      p.age += dt;
      p.vy += spec.gravity * dt;
      if (p.kind === 'snow') p.vx += Math.sin(clock * 0.0009 + p.wob) * 0.00016 * dt;
      const d = Math.pow(spec.drag, dt / 16.667);
      p.vx *= d;
      p.vy *= d;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
  }

  function drawParticles(): void {
    for (let i = 0; i < POOL; i++) {
      const p = pool[i];
      if (p.age >= p.life) continue;
      const spec = PARTICLE_SPEC[p.kind];
      if (spec.additive) {
        ctx.globalCompositeOperation = 'lighter';
        drawParticle(ctx, p.kind, p.x, p.y, p.age / p.life, p.size, p.rot);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        drawParticle(ctx, p.kind, p.x, p.y, p.age / p.life, p.size, p.rot);
      }
    }
  }

  /* ------------------------------------------------------------- render -- */

  function stage(): void {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(ox, oy);
    ctx.scale(fit, fit);
    ctx.beginPath();
    ctx.rect(0, 0, STAGE_W, STAGE_H);
    ctx.clip();
    ctx.translate(STAGE_W / 2, STAGE_H / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);
  }

  function render(state: SceneState): void {
    if (!started) {
      resize();
      started = true;
      last = performance.now();
    }
    if (!back || !set) return;

    const now = performance.now();
    let raw = now - last;
    last = now;
    if (raw < 0 || raw > 64) raw = raw > 64 ? 32 : 16.7;

    /* hitstop is time dilation, not a pause: particles keep crawling */
    let dt = raw;
    if (hold > 0) {
      hold -= raw;
      dt = raw * 0.1;
    }
    clock += dt;

    const reduced = state.reducedMotion;
    paint.t = clock;
    paint.flick = reduced ? 0.5 : flickerAt(clock);
    paint.reduced = reduced;

    /* camera and mood ease; reduced motion cuts */
    const k = reduced ? 1 : 1 - Math.exp(-raw / 110);
    cam.x += (state.camera.x - cam.x) * k;
    cam.y += (state.camera.y - cam.y) * k;
    cam.zoom += (state.camera.zoom - cam.zoom) * k;
    dim += (state.dimness - dim) * (reduced ? 1 : 1 - Math.exp(-raw / 260));
    paint.dim = dim;
    setMood(dim);

    if (reduced) {
      shakeMag = 0;
    } else if (shakeMag > 0.02) {
      shakeMag *= Math.pow(0.9955, raw);
      shakePhase += raw;
    } else {
      shakeMag = 0;
    }
    const sx = shakeMag ? Math.sin(shakePhase * 0.081) * shakeMag : 0;
    const sy = shakeMag ? Math.sin(shakePhase * 0.113 + 1.7) * shakeMag * 0.7 : 0;

    if (state.act === 'prologue') {
      if (!outside && !reduced) {
        /* seed the yard so the first frame is already snowing */
        for (let i = 0; i < 110; i++) {
          spawn('snow', Math.random() * (STAGE_W + 120) - 60, Math.random() * (STAGE_H + 40) - 40);
          pool[(cursor + POOL - 1) % POOL].age = Math.random() * 5000;
        }
      }
      outside = true;
      if (!reduced) {
        snowDebt += raw;
        while (snowDebt > 28) {
          snowDebt -= 28;
          spawn('snow', Math.random() * (STAGE_W + 120) - 60, -20);
        }
      }
    } else if (outside) {
      /* the door shuts behind us: the yard's snow must not fall in the hata */
      outside = false;
      for (let i = 0; i < POOL; i++) pool[i].age = pool[i].life;
    }
    if (!reduced) stepParticles(dt);

    /* letterbox bars stay the darkest paper in the palette */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0a0603';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    stage();
    ctx.translate(sx, sy);

    if (state.act === 'prologue') {
      drawPrologue(ctx, state, paint);
      if (!reduced) drawParticles();
    } else {
      ctx.drawImage(back, 0, 0, STAGE_W, STAGE_H);
      drawWindowSnow(ctx, paint);
      ctx.drawImage(set, 0, 0, STAGE_W, STAGE_H);
      drawFire(ctx, paint);
      drawLight(ctx, state, paint);
      drawBakeProps(ctx, state, paint);
      /* Depth, act by act: while the buns are being made the half-built cat is
         still a plan hanging at the back of the room, so it goes behind the
         crowd. Once it is handed over it is the thing everyone is looking at,
         and the room stands behind it. */
      const behind = state.act === 'bake';
      if (behind) {
        drawCord(ctx, state, paint);
        drawCat(ctx, state, paint);
      }
      drawCrowd(ctx, state, paint);
      if (!behind) {
        drawCord(ctx, state, paint);
        drawCat(ctx, state, paint);
      }
      drawPlayer(ctx, state, paint);
      drawPlayGlow(ctx, state, paint);
      if (!reduced) drawParticles();
      paintFront(ctx, paint);
    }
    ctx.restore();

    /* paper grain, in device pixels so the fibre stays fibre-sized, and on
       'overlay' so it only shows where the fire has put light */
    if (grain) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = grain;
      ctx.fillRect(ox * dpr, oy * dpr, STAGE_W * fit * dpr, STAGE_H * fit * dpr);
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  resize();

  return {
    render,
    burst(kind, x, y, n) {
      if (paint.reduced) return;
      for (let i = 0; i < n; i++) spawn(kind, x, y);
    },
    hitstop(ms) {
      hold = Math.max(hold, ms);
    },
    shake(strength) {
      shakeMag = Math.max(shakeMag, strength);
      shakePhase = 0;
    },
    resize,
    destroy() {
      ro?.disconnect();
      back = null;
      set = null;
      grain = null;
    },
  };
}

export { STAGE_H, STAGE_W };
