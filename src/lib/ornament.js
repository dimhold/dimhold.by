/* Belarusian cross-stitch ornament, charted cell by cell the way a vyshyvanka
   pattern is: every filled cell becomes one square. Crisp at any zoom, a few
   kilobytes on the wire, and bilaterally symmetric like the real motifs.

   Two elements carry it:
     · «ромб з кручкамі» — a rhombus outline with hooks at its four points, the
       most recognisable element of Belarusian ornament;
     · a filler stitch in the gap between them — a star, a small rhombus or a
       cross, depending on the day.

   Everything here is a pure function of a day number, so every visitor sees
   the same weave on the same date, and reloading never reshuffles it. */

/* The envelope the day's beige is allowed to wander in, and the two irrational
   steps that walk it. Kept here as the single source of truth: the head boot
   script in Base.astro receives these very numbers through define:vars, because
   the tint has to be set before first paint and cannot import a module. */
export const TINT = {
  hBase: 26,
  hSpan: 20, // 26°..46°: sand to clay, never far enough to stop reading as beige
  sBase: 34,
  sSpan: 14,
  phi: 0.618033988749895, // golden ratio, fractional part
  plastic: 0.754877666246693, // plastic number, fractional part
};

/** Deterministic 0..1 stream from one integer seed (mulberry32). */
function stream(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Days since the epoch for the visitor's local date — the seed for everything. */
export function today(now = new Date()) {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 864e5);
}

/** The day's beige. Two irrational steps, so no two days land on one colour. */
export function tintFor(day) {
  return {
    h: +(TINT.hBase + ((day * TINT.phi) % 1) * TINT.hSpan).toFixed(2),
    s: +(TINT.sBase + ((day * TINT.plastic) % 1) * TINT.sSpan).toFixed(2),
  };
}

/** The day's weave: which rhombus, how long the hooks, what sits between. */
export function weaveFor(day) {
  const r = stream(Math.imul(day ^ 0x9e3779b9, 0x85ebca6b));
  const pick = (xs) => xs[Math.floor(r() * xs.length)];
  const radius = pick([6, 7, 8, 9]);
  const hook = pick([1, 2, 3]);
  const margin = pick([4, 6, 8]);
  const p = {
    radius,
    hook,
    ring: pick([3, 4, 5]), // how far inside the outline the second rhombus runs
    seed: pick(['dot', 'diamond', 'none']), // what sits at the heart
    filler: pick(['star', 'rhombus', 'cross', 'none']),
    fillerR: pick([2, 3, 4]),
    n: 2 * (radius + hook) + margin,
  };
  p.scale = Math.round(p.n * pick([4.2, 4.6, 5, 5.4]));
  return p;
}

/** The filled cells of one tile, as "x,y" keys, wrapped into an n×n torus. */
export function chart(p) {
  const n = p.n;
  const cells = new Set();
  const put = (x, y) => cells.add(`${((x % n) + n) % n},${((y % n) + n) % n}`);
  const c = n >> 1;

  for (let dx = -p.radius; dx <= p.radius; dx++) {
    for (let dy = -p.radius; dy <= p.radius; dy++) {
      const d = Math.abs(dx) + Math.abs(dy);
      if (d === p.radius || (p.ring < p.radius && d === p.radius - p.ring)) put(c + dx, c + dy);
    }
  }

  if (p.seed === 'dot') put(c, c);
  if (p.seed === 'diamond') {
    for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) put(c + dx, c + dy);
  }

  // hooks: a chevron opening outward from every point, mirrored both ways
  for (const s of [-1, 1]) {
    for (let k = 1; k <= p.hook; k++) {
      put(c + s * k, c - (p.radius + k));
      put(c + s * k, c + p.radius + k);
      put(c - (p.radius + k), c + s * k);
      put(c + p.radius + k, c + s * k);
    }
  }

  filler(p, put, 0, 0);
  return cells;
}

function filler(p, put, cx, cy) {
  const r = p.fillerR;
  if (p.filler === 'star') {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        if (Math.abs(dx) + Math.abs(dy) <= 2 || (Math.abs(dx) === Math.abs(dy) && Math.abs(dx) <= r)) {
          put(cx + dx, cy + dy);
        }
      }
    }
  } else if (p.filler === 'rhombus') {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        if (Math.abs(dx) + Math.abs(dy) === r) put(cx + dx, cy + dy);
      }
    }
    put(cx, cy);
  } else if (p.filler === 'cross') {
    for (let k = -r; k <= r; k++) {
      put(cx + k, cy);
      put(cx, cy + k);
    }
  }
}

/* The mask is blurred so its edges stop competing with the text on top. A
   blur reaches across the tile seam, so cells within `PAD` of an edge are
   redrawn on the far side and the viewBox crops the overhang away — without
   that the tiling would show a grid of hard seams. */
const PAD = 3;
const BLUR = 0.22; // in cells; ~1px at the sizes the tile is used

function paint(cells, w, h, wrapY = true) {
  const out = [];
  for (const key of cells) {
    const [x, y] = key.split(',').map(Number);
    for (const ox of [-w, 0, w]) {
      for (const oy of wrapY ? [-h, 0, h] : [0]) {
        const X = x + ox;
        const Y = y + oy;
        if (X >= -PAD && X <= w + PAD && Y >= -PAD && Y <= h + PAD) {
          out.push(`<rect x="${X}" y="${Y}" width="1" height="1"/>`);
        }
      }
    }
  }
  return out.join('');
}

function wrap(body, w, h) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<filter id="s" x="-15%" y="-15%" width="130%" height="130%">` +
    `<feGaussianBlur stdDeviation="${BLUR}"/></filter>` +
    `<g fill="#000" filter="url(#s)">${body}</g></svg>`
  );
}

/** The all-over tile that lies under the whole page. */
export function tileSvg(p) {
  return wrap(paint(chart(p), p.n, p.n), p.n, p.n);
}

/** The rushnyk strip that closes the page: rhombi on a line between two rails. */
export function bandSvg(p) {
  const r = Math.min(p.radius, 5);
  const hook = Math.min(p.hook, 2);
  const h = 2 * (r + hook) + 3;
  const unit = 2 * (r + hook) + 6;
  const w = unit * 2;
  const cy = h >> 1;
  const cells = new Set();
  const put = (x, y) => {
    if (y >= 0 && y < h) cells.add(`${((x % w) + w) % w},${y}`);
  };

  for (const cx of [unit / 2, unit + unit / 2]) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const d = Math.abs(dx) + Math.abs(dy);
        if (d === r || d === 1) put(cx + dx, cy + dy);
      }
    }
    for (const s of [-1, 1]) {
      for (let k = 1; k <= hook; k++) {
        put(cx + s * k, cy - (r + k));
        put(cx + s * k, cy + r + k);
      }
    }
  }
  for (const cx of [0, unit]) filler(p, put, cx, cy);
  for (let x = 0; x < w; x++) {
    put(x, 0);
    put(x, h - 1);
  }
  return wrap(paint(cells, w, h, false), w, h);
}

/** Ready for `background-image` / `mask-image`. */
export function cssUrl(markup) {
  return `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;
}
