/* The walk player: two markers moving along their own tracks, with height and
 * speed on gauges beside the map.
 *
 * It mounts into any `[data-walk]` in the page, so a post drops one empty div
 * where it wants the thing and nothing else in the article knows about it. The
 * data is fetched rather than inlined — 190 KB of coordinates has no business
 * in the HTML of a page most readers will scroll past.
 */

interface Track {
  colour: string;
  face: string;
  /** Metres east and north of the first shared moment. */
  x: number[];
  y: number[];
  /** Seconds from the start of the window. */
  s: number[];
  /** Metres walked so far. */
  d: number[];
  /** Metres above the lowest point of the walk. */
  e: number[];
  /** km/h over a five-second window. */
  v: number[];
}

interface Walk {
  seconds: number;
  tracks: Record<string, Track>;
}

const NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

/** Deterministic noise, so the same wood is drawn on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export async function mountWalk(host: HTMLElement) {
  const src = host.dataset.walk || '/data/walk.json';
  let data: Walk;
  try {
    data = await (await fetch(src)).json();
  } catch {
    host.remove();
    return;
  }

  const keys = Object.keys(data.tracks);
  const lang = document.documentElement.lang as 'en' | 'ru' | 'be';
  const T = {
    en: { play: 'Play', stop: 'Stop', height: 'height', speed: 'speed', reset: 'Reset view', gap: 'apart' },
    ru: { play: 'Пуск', stop: 'Стоп', height: 'высота', speed: 'скорость', reset: 'Сбросить вид', gap: 'между нами' },
    be: { play: 'Пуск', stop: 'Стоп', height: 'вышыня', speed: 'хуткасць', reset: 'Скінуць від', gap: 'паміж імі' },
  }[lang] ?? { play: 'Play', stop: 'Stop', height: 'height', speed: 'speed', reset: 'Reset view', gap: 'apart' };

  // ── the box that holds both walks ────────────────────────────────────────
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const k of keys) {
    const t = data.tracks[k];
    for (let i = 0; i < t.x.length; i++) {
      if (t.x[i] < minX) minX = t.x[i];
      if (t.x[i] > maxX) maxX = t.x[i];
      if (t.y[i] < minY) minY = t.y[i];
      if (t.y[i] > maxY) maxY = t.y[i];
    }
  }
  const PAD = 60;
  const W = maxX - minX + PAD * 2;
  const H = maxY - minY + PAD * 2;
  const px = (x: number) => x - minX + PAD;
  /* SVG grows downward and north does not, so the flip happens once, here. */
  const py = (y: number) => H - (y - minY + PAD);

  host.classList.add('walk');
  host.innerHTML = `
    <div class="walk-row">
      <div class="walk-stage">
        <svg class="walk-map"></svg>
        <button class="walk-reset" type="button" hidden>${T.reset}</button>
      </div>
      <div class="walk-gauges">
        <div class="walk-gauge"><span class="walk-gauge-title">${T.height}</span><svg viewBox="0 0 100 400" preserveAspectRatio="none"></svg></div>
        <div class="walk-gauge"><span class="walk-gauge-title">${T.speed}</span><svg viewBox="0 0 100 400" preserveAspectRatio="none"></svg></div>
      </div>
    </div>
    <div class="walk-panel">
      <button class="walk-play" type="button">${T.play}</button>
      <input class="walk-scrub" type="range" min="0" max="${data.seconds}" value="0" step="1" aria-label="time" />
      <span class="walk-clock">00:00</span>
      <span class="walk-rates">
        <button type="button" data-rate="30">30×</button>
        <button type="button" data-rate="90" class="is-on">90×</button>
        <button type="button" data-rate="240">240×</button>
      </span>
    </div>
    <div class="walk-cards"></div>`;

  const map = host.querySelector('svg.walk-map') as SVGSVGElement;
  const gauges = host.querySelectorAll('.walk-gauge svg');
  map.setAttribute('viewBox', `0 0 ${W} ${H}`);
  (host.querySelector('.walk-stage') as HTMLElement).style.setProperty('--aspect', `${W} / ${H}`);

  /* Everything on the map is measured in metres, so a fixed pixel size would be
     meaningless — a 56-unit marker on a six-kilometre walk is a 56-metre head. */
  const UNIT = Math.max(W, H) / 100;
  const MARKER = UNIT * 3.4;

  // ── the wood ─────────────────────────────────────────────────────────────
  /* The walk was in a forest, so the map is forest — densely, edge to edge,
     with the tracks simply drawn on top.
  
     Scattering that many trees as individual elements is not an option: at this
     density the map would need something like thirty thousand of them. A
     pattern costs a few hundred nodes and tiles for ever, which also solves the
     other half of the problem — panning can never reach an edge, because there
     is no edge.
  
     Trees that cross a tile boundary are drawn again on the opposite side.
     Without that the pattern clips them and the seams show up as a grid. */
  const uid = `walk-${Math.random().toString(36).slice(2, 8)}`;
  const defs = el('defs', {});

  const blur = el('filter', { id: `${uid}-b`, x: '-15%', y: '-15%', width: '130%', height: '130%' });
  blur.appendChild(el('feGaussianBlur', { stdDeviation: UNIT * 0.14 }));
  defs.appendChild(blur);

  const TILE = UNIT * 18;
  const pattern = el('pattern', {
    id: `${uid}-w`,
    width: TILE,
    height: TILE,
    patternUnits: 'userSpaceOnUse',
  });
  pattern.appendChild(el('rect', { class: 'walk-ground', x: 0, y: 0, width: TILE, height: TILE }));

  const rand = rng(20260820);
  /* Poisson coverage: 1 - exp(-N·a/A). For 85% that is N·a/A ≈ 1.9. */
  const R = UNIT * 0.55;
  const COUNT = Math.round((1.9 * TILE * TILE) / (Math.PI * R * R));

  const tree = (x: number, y: number, r: number, dark: boolean) => {
    const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` });
    g.appendChild(
      el('rect', { class: 'walk-trunk', x: -r * 0.11, y: r * 0.1, width: r * 0.22, height: r * 0.75 }),
    );
    g.appendChild(
      el('circle', { class: dark ? 'walk-crown walk-crown-b' : 'walk-crown', cx: 0, cy: -r * 0.3, r }),
    );
    pattern.appendChild(g);
  };

  for (let i = 0; i < COUNT; i++) {
    const x = rand() * TILE;
    const y = rand() * TILE;
    const r = R * (0.72 + rand() * 0.6);
    const dark = rand() > 0.5;
    tree(x, y, r, dark);
    // wrapped copies, so nothing is cut off at the tile edge
    const nx = x < r * 2 ? x + TILE : x > TILE - r * 2 ? x - TILE : null;
    const ny = y < r * 2 ? y + TILE : y > TILE - r * 2 ? y - TILE : null;
    if (nx !== null) tree(nx, y, r, dark);
    if (ny !== null) tree(x, ny, r, dark);
    if (nx !== null && ny !== null) tree(nx, ny, r, dark);
  }

  defs.appendChild(pattern);
  map.appendChild(defs);

  /* Drawn far beyond the map's own box. Panning is clamped well inside this,
     so the forest never runs out. */
  const SLACK = Math.max(W, H);
  map.appendChild(
    el('rect', {
      x: -SLACK,
      y: -SLACK,
      width: W + SLACK * 2,
      height: H + SLACK * 2,
      fill: `url(#${uid}-w)`,
      filter: `url(#${uid}-b)`,
    }),
  );

  /* Which way each of them is facing. Both portraits are drawn looking right,
     so once the walk turns for home the markers would be walking backwards.

     The direction is taken from net displacement over a full minute rather than
     from the last step: Zoom reverses every few seconds while casting about,
     and a marker that flips with every one of those is a strobe light. A minute
     of net movement is the journey, not the fidgeting. Ties keep the previous
     facing, so a stretch of walking due north never flickers either. */
  const facingOf = (t: Track) => {
    const SPAN = 30; // samples each side, so a 60-second window
    const out: number[] = [];
    let facing = 1;
    for (let i = 0; i < t.x.length; i++) {
      const a = Math.max(0, i - SPAN);
      const b = Math.min(t.x.length - 1, i + SPAN);
      const dx = t.x[b] - t.x[a];
      if (Math.abs(dx) > 25) facing = dx >= 0 ? 1 : -1;
      out.push(facing);
    }
    return out;
  };
  const facing: Record<string, number[]> = {};
  for (const k of keys) facing[k] = facingOf(data.tracks[k]);

  // ── the tracks ───────────────────────────────────────────────────────────
  const pathOf = (t: Track, upto: number) => {
    let d = '';
    for (let i = 0; i <= upto; i++) d += `${i ? 'L' : 'M'}${px(t.x[i]).toFixed(1)} ${py(t.y[i]).toFixed(1)}`;
    return d;
  };

  const parts: Record<string, { trail: SVGPathElement; marker: SVGImageElement; ring: SVGCircleElement }> = {};
  for (const k of keys) {
    const t = data.tracks[k];
    const trail = el('path', {
      class: 'walk-trail',
      d: '',
      stroke: t.colour,
      'stroke-width': UNIT * 0.62,
    });
    map.appendChild(trail);
    parts[k] = { trail } as (typeof parts)[string];
  }

  /* The two of them are rarely more than fifty metres apart, so at this scale
     the faces sit on top of each other. The tether is what makes the ranging
     out and coming back legible at all. */
  const tether = el('line', {
    class: 'walk-tether',
    'stroke-width': UNIT * 0.22,
    'stroke-dasharray': `${UNIT * 0.5} ${UNIT * 0.5}`,
  });
  map.appendChild(tether);

  for (const k of keys) {
    const t = data.tracks[k];
    const marker = el('image', { href: t.face, width: MARKER, height: MARKER, x: -999, y: -999 });
    const ring = el('circle', {
      r: MARKER / 2 + UNIT * 0.28,
      fill: 'none',
      stroke: t.colour,
      'stroke-width': UNIT * 0.4,
      cx: -999,
      cy: -999,
    });
    map.append(marker, ring);
    parts[k].marker = marker;
    parts[k].ring = ring;
  }

  // ── the two gauge columns ────────────────────────────────────────────────
  /* Both share ONE scale across the two walkers: separate scales would let a
     two-metre wobble look like a hill and a stroll look like a sprint. */
  const extent = (field: 'e' | 'v') => {
    let lo = Infinity;
    let hi = -Infinity;
    for (const k of keys) {
      for (const v of data.tracks[k][field]) {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    return [lo, Math.max(hi, lo + 1)];
  };

  const AH = 400;
  const ATOP = 22;
  const ABOT = 26;
  const KNOB = 30;

  function buildGauge(svg: Element, lo: number, hi: number, top: string) {
    const y = (v: number) => AH - ABOT - ((v - lo) / (hi - lo)) * (AH - ATOP - ABOT);
    const p: Record<string, { fill: SVGLineElement; knob: SVGImageElement; ring: SVGCircleElement; label: SVGTextElement }> = {};
    keys.forEach((k, n) => {
      const t = data.tracks[k];
      const cx = 100 * (n === 0 ? 0.3 : 0.7);
      svg.appendChild(el('line', { class: 'walk-track-bar', x1: cx, x2: cx, y1: ATOP, y2: AH - ABOT }));
      const fill = el('line', { class: 'walk-fill', x1: cx, x2: cx, y1: AH - ABOT, y2: AH - ABOT, stroke: t.colour });
      const knob = el('image', { href: t.face, width: KNOB, height: KNOB, x: cx - KNOB / 2, y: AH - ABOT - KNOB / 2 });
      const ring = el('circle', { cx, r: KNOB / 2 + 1.5, cy: AH - ABOT, fill: 'none', stroke: t.colour, 'stroke-width': 3 });
      const label = el('text', { class: 'walk-gauge-value', x: cx, y: AH - 8, 'text-anchor': 'middle' });
      svg.append(fill, knob, ring, label);
      p[k] = { fill, knob, ring, label };
    });
    const cap = el('text', { class: 'walk-gauge-cap', x: 50, y: 13, 'text-anchor': 'middle' });
    cap.textContent = top;
    svg.appendChild(cap);
    return { y, p };
  }

  /* Heights read from the bottom of the walk, not from the sea: the anonymised
     tracks are rebased so the lowest point of the wood is zero. */
  const [eLo, eHi] = extent('e');
  const altG = buildGauge(gauges[0], eLo, eHi, `+${(eHi - eLo).toFixed(0)} m`);
  /* Speed is capped at the fastest thing either of them did, rounded up, so the
     bar has a round number at the top rather than 24.63. */
  const vTop = Math.ceil(extent('v')[1] / 5) * 5;
  const spdG = buildGauge(gauges[1], 0, vTop, `${vTop} km/h`);

  // ── the cards ────────────────────────────────────────────────────────────
  const cards = host.querySelector('.walk-cards') as HTMLElement;
  const NAMES: Record<string, string> = { mitya: 'Dmitriy', zoom: 'Zoom' };
  for (const k of keys) {
    const t = data.tracks[k];
    cards.insertAdjacentHTML(
      'beforeend',
      `<div class="walk-card"><img src="${t.face}" alt="" width="42" height="42" />
        <div><b data-km="${k}">0.00</b> km<span>${NAMES[k] ?? k}</span></div></div>`,
    );
  }
  cards.insertAdjacentHTML(
    'beforeend',
    `<div class="walk-card walk-card-gap"><div><b data-sep>0</b> m<span>${T.gap}</span></div></div>`,
  );

  // ── zoom and pan ─────────────────────────────────────────────────────────
  /* The view is a window on the metre plane. Zooming keeps whatever is under
     the pointer under the pointer, which is the only behaviour that does not
     feel like the map is fighting back. */
  const view = { x: 0, y: 0, w: W, h: H };
  const reset = host.querySelector('.walk-reset') as HTMLButtonElement;
  const applyView = () => {
    map.setAttribute('viewBox', `${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`);
    /* The way back appears as soon as the view has moved at all — panning can
       take the walk off screen just as easily as zooming can. */
    const moved = view.w < W - 1 || Math.abs(view.x) > 1 || Math.abs(view.y) > 1;
    reset.hidden = !moved;
    host.classList.toggle('is-zoomed', moved);
  };
  const MIN_W = W / 12;

  const toPlane = (ev: { clientX: number; clientY: number }) => {
    const r = map.getBoundingClientRect();
    return {
      x: view.x + ((ev.clientX - r.left) / r.width) * view.w,
      y: view.y + ((ev.clientY - r.top) / r.height) * view.h,
    };
  };

  const zoomAt = (factor: number, at: { x: number; y: number }) => {
    const w = Math.min(W, Math.max(MIN_W, view.w * factor));
    const k = w / view.w;
    view.x = at.x - (at.x - view.x) * k;
    view.y = at.y - (at.y - view.y) * k;
    view.w = w;
    view.h = H * (w / W);
    clamp();
    applyView();
  };

  /* Panning is bounded to the walk itself plus a margin. Letting the reader
     drag off into empty coordinate space is a way to get lost with no landmark
     to come back to. */
  function clamp() {
    const slack = W * 0.15;
    view.x = Math.min(Math.max(view.x, -slack), W + slack - view.w);
    view.y = Math.min(Math.max(view.y, -slack), H + slack - view.h);
  }

  map.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(Math.exp(e.deltaY * 0.0016), toPlane(e));
      follow = false;
    },
    { passive: false },
  );

  let drag: { x: number; y: number; vx: number; vy: number } | null = null;
  map.addEventListener('pointerdown', (e) => {
    map.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    host.classList.add('is-dragging');
    follow = false;
  });
  map.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = map.getBoundingClientRect();
    view.x = drag.vx - ((e.clientX - drag.x) / r.width) * view.w;
    view.y = drag.vy - ((e.clientY - drag.y) / r.height) * view.h;
    clamp();
    applyView();
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag) return;
    drag = null;
    host.classList.remove('is-dragging');
    map.releasePointerCapture(e.pointerId);
  };
  map.addEventListener('pointerup', endDrag);
  map.addEventListener('pointercancel', endDrag);

  reset.addEventListener('click', () => {
    view.x = 0;
    view.y = 0;
    view.w = W;
    view.h = H;
    follow = true;
    applyView();
  });

  /* Once zoomed in, the markers would walk out of frame within seconds. The
     view follows them until the reader takes hold of it, and taking hold is
     what turns following off. */
  let follow = true;
  const keepInView = (cx: number, cy: number) => {
    if (!follow || view.w >= W - 1) return;
    const mx = view.w * 0.3;
    const my = view.h * 0.3;
    if (cx < view.x + mx) view.x = cx - mx;
    if (cx > view.x + view.w - mx) view.x = cx - view.w + mx;
    if (cy < view.y + my) view.y = cy - my;
    if (cy > view.y + view.h - my) view.y = cy - view.h + my;
    clamp();
    applyView();
  };

  // ── playback ─────────────────────────────────────────────────────────────
  /** Index of the last sample at or before the given second. */
  const at = (t: Track, sec: number) => {
    let lo = 0;
    let hi = t.s.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (t.s[mid] <= sec) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  const setGauge = (
    g: ReturnType<typeof buildGauge>,
    k: string,
    value: number,
    text: string,
  ) => {
    const p = g.p[k];
    p.fill.setAttribute('y2', String(g.y(value)));
    p.knob.setAttribute('y', String(g.y(value) - KNOB / 2));
    p.ring.setAttribute('cy', String(g.y(value)));
    p.label.textContent = text;
  };

  const kmEl = Object.fromEntries(keys.map((k) => [k, host.querySelector(`[data-km="${k}"]`)!]));
  const sepEl = host.querySelector('[data-sep]')!;
  const clock = host.querySelector('.walk-clock')!;

  function render(sec: number) {
    const pos: Record<string, { x: number; y: number; d: number; e: number; v: number }> = {};
    for (const k of keys) {
      const t = data.tracks[k];
      const i = at(t, sec);
      parts[k].trail.setAttribute('d', pathOf(t, i));
      const cx = px(t.x[i]);
      const cy = py(t.y[i]);
      parts[k].marker.setAttribute('x', String(cx - MARKER / 2));
      parts[k].marker.setAttribute('y', String(cy - MARKER / 2));
      /* Mirrored about its own centre, so flipping does not move the marker. */
      parts[k].marker.setAttribute(
        'transform',
        facing[k][i] < 0 ? `translate(${(cx * 2).toFixed(1)} 0) scale(-1 1)` : '',
      );
      parts[k].ring.setAttribute('cx', String(cx));
      parts[k].ring.setAttribute('cy', String(cy));
      kmEl[k].textContent = (t.d[i] / 1000).toFixed(2);
      pos[k] = { x: t.x[i], y: t.y[i], d: t.d[i], e: t.e[i], v: t.v[i] };
      setGauge(altG, k, t.e[i], `+${(t.e[i] - eLo).toFixed(0)}`);
      setGauge(spdG, k, Math.min(t.v[i], vTop), t.v[i].toFixed(1));
    }

    tether.setAttribute('x1', String(px(pos.mitya.x)));
    tether.setAttribute('y1', String(py(pos.mitya.y)));
    tether.setAttribute('x2', String(px(pos.zoom.x)));
    tether.setAttribute('y2', String(py(pos.zoom.y)));

    sepEl.textContent = String(Math.round(Math.hypot(pos.zoom.x - pos.mitya.x, pos.zoom.y - pos.mitya.y)));
    clock.textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

    keepInView((px(pos.mitya.x) + px(pos.zoom.x)) / 2, (py(pos.mitya.y) + py(pos.zoom.y)) / 2);
  }

  const scrub = host.querySelector('.walk-scrub') as HTMLInputElement;
  const play = host.querySelector('.walk-play') as HTMLButtonElement;
  /* Ninety times is the default because it puts the whole walk under half a
     minute — long enough to watch, short enough that nobody scrolls away. */
  let rate = 90;
  let sec = 0;
  let frame: number | null = null;
  let last: number | undefined;

  function tick(now: number) {
    if (last === undefined) last = now;
    sec += ((now - last) / 1000) * rate;
    last = now;
    if (sec >= data.seconds) {
      sec = data.seconds;
      stop();
    }
    scrub.value = String(Math.round(sec));
    render(Math.round(sec));
    if (frame !== null) frame = requestAnimationFrame(tick);
  }
  function start() {
    if (sec >= data.seconds) sec = 0;
    last = undefined;
    play.textContent = T.stop;
    frame = requestAnimationFrame(tick);
  }
  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    play.textContent = T.play;
  }
  play.addEventListener('click', () => (frame === null ? start() : stop()));
  scrub.addEventListener('input', () => {
    sec = +scrub.value;
    render(sec);
  });

  for (const b of host.querySelectorAll<HTMLButtonElement>('[data-rate]')) {
    b.addEventListener('click', () => {
      rate = +b.dataset.rate!;
      for (const o of host.querySelectorAll('[data-rate]')) o.classList.toggle('is-on', o === b);
    });
  }

  applyView();
  render(0);
}

for (const host of document.querySelectorAll<HTMLElement>('[data-walk]')) mountWalk(host);
