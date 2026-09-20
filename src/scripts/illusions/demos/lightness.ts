/* Светлота и контраст. Почти в каждой демонстрации есть проба яркости: без измерения
   такая иллюзия остаётся утверждением, а с измерением становится фактом. */
import { demo, grey, INK, MARK, PAPER, type Mount } from '../kit';

export const hermannGrid: Mount = demo((k) => {
  let street = 14;
  let wavy = false;
  const s = k.surface(({ ctx, w, h }) => {
    const pitch = street * 5;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = street;
    const amp = wavy ? street * 0.8 : 0;
    const period = pitch;
    for (let y = pitch / 2; y < h + pitch; y += pitch) {
      ctx.beginPath();
      for (let x = -2; x <= w + 2; x += 2) {
        const yy = y + amp * Math.sin((x / period) * Math.PI * 2);
        x === -2 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    for (let x = pitch / 2; x < w + pitch; x += pitch) {
      ctx.beginPath();
      for (let y = -2; y <= h + 2; y += 2) {
        const xx = x + amp * Math.sin((y / period) * Math.PI * 2 + Math.PI / 2);
        y === -2 ? ctx.moveTo(xx, y) : ctx.lineTo(xx, y);
      }
      ctx.stroke();
    }
  });
  k.slider('street', (v) => { street = v; s.draw(); });
  k.toggle('wavy', (v) => {
    wavy = v;
    s.draw();
    k.say(v
      ? 'кляксы исчезли, а белого на экране столько же. Вместе с ними исчезло и учебниковое объяснение.'
      : 'смотрите мимо перекрёстка — серые пятна появляются там, куда вы не смотрите.');
  });
});

const DARK = 0.35;
const LIGHT = 0.65;
const COLS = 8;
const ROWS = 6;
const UMBRA = 0.6;

export const checkerShadow: Mount = demo((k) => {
  let bridge = false;
  let tile = 0;
  let A = { c: 0, r: 0 };
  let B = { c: 3, r: 3 };
  const s = k.surface(({ ctx, w, h }) => {
    tile = w / COLS;
    const light = (c: number, r: number) => (c + r) % 2 === 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        ctx.fillStyle = grey(light(c, r) ? LIGHT : DARK);
        ctx.fillRect(c * tile, r * tile, tile + 1, tile + 1);
      }
    const ox = w * 0.9, oy = h * 0.6, tx = w * 0.02, ty = h * 1.06;
    const len = Math.hypot(tx - ox, ty - oy);
    const ux = (tx - ox) / len, uy = (ty - oy) / len;
    const halfLen = len * 0.62, halfWid = w * 0.3;
    const cxS = ox + ux * len * 0.5, cyS = oy + uy * len * 0.5;
    const norm = (x: number, y: number) => {
      const dx = x - cxS, dy = y - cyS;
      return Math.hypot((dx * ux + dy * uy) / halfLen, (dx * -uy + dy * ux) / halfWid);
    };
    /* Тень гасит свет ровно в DARK / LIGHT раза: светлая плитка в тени становится
       тёмной плиткой на свету. Равенство арифметическое, не подогнанное. */
    const alpha = 1 - DARK / LIGHT;
    ctx.save();
    ctx.translate(cxS, cyS);
    ctx.rotate(Math.atan2(uy, ux));
    ctx.scale(1, halfWid / halfLen);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, halfLen);
    g.addColorStop(0, `rgba(0,0,0,${alpha})`);
    g.addColorStop(UMBRA, `rgba(0,0,0,${alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, halfLen, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    /* Клетки выбираются по той же геометрии, что рисует тень: подвинешь цилиндр —
       подписи переедут сами, и соврать картинкой станет нельзя. */
    const margin = (tile * 0.75) / halfWid;
    let best = Infinity;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (!light(c, r)) continue;
        const n = norm((c + 0.5) * tile, (r + 0.5) * tile);
        if (n < UMBRA - margin && n < best) { best = n; B = { c, r }; }
      }
    best = Infinity;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (light(c, r) || norm((c + 0.5) * tile, (r + 0.5) * tile) < 1 + margin) continue;
        const d = Math.hypot(c - B.c, r - B.r);
        if (d < best) { best = d; A = { c, r }; }
      }
    const cw = w * 0.055, top = h * 0.08;
    ctx.fillStyle = '#5e7a62';
    ctx.fillRect(ox - cw, top, cw * 2, oy - top);
    ctx.beginPath();
    ctx.ellipse(ox, oy, cw, cw * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#48604c';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ox, top, cw, cw * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#7d9b81';
    ctx.fill();
    if (bridge) {
      const ax = (A.c + 0.5) * tile, ay = (A.r + 0.5) * tile;
      const bx = (B.c + 0.5) * tile, by = (B.r + 0.5) * tile;
      const nx = -(by - ay), ny = bx - ax;
      const kk = (tile * 0.17) / Math.hypot(nx, ny);
      ctx.fillStyle = grey(DARK);
      ctx.beginPath();
      ctx.moveTo(ax + nx * kk, ay + ny * kk);
      ctx.lineTo(bx + nx * kk, by + ny * kk);
      ctx.lineTo(bx - nx * kk, by - ny * kk);
      ctx.lineTo(ax - nx * kk, ay - ny * kk);
      ctx.closePath();
      ctx.fill();
    }
    ctx.font = `bold ${Math.round(tile * 0.42)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    for (const [p, t] of [[A, 'A'], [B, 'B']] as const) {
      const x = (p.c + 0.5) * tile, y = (p.r + 0.5) * tile;
      ctx.strokeText(t, x, y);
      ctx.fillStyle = MARK;
      ctx.fillText(t, x, y);
    }
  });
  k.toggle('bridge', (v) => {
    bridge = v;
    s.draw();
    k.say(v ? 'пока полоса их соединяет, спорить не с чем. Уберите её — и поверить снова станет невозможно.' : '');
  });
  k.button('probe', () => {
    const at = (p: { c: number; r: number }) => k.probe((p.c + 0.5) * tile, (p.r + 0.15) * tile);
    const a = at(A), b = at(B);
    k.say(a === b
      ? `A = ${a}, B = ${b}. Ровно одно число. Ваше зрение видит разницу там, где на экране её нет ни на единицу.`
      : `A = ${a}, B = ${b} — разница ${Math.abs(a - b)} из 255: край полутени задел клетку.`);
  });
});

export const simultaneousContrast: Mount = demo((k) => {
  let patch = 0.5;
  let right = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.12);
    ctx.fillRect(0, 0, w / 2, h);
    ctx.fillStyle = grey(0.88);
    ctx.fillRect(w / 2, 0, w / 2, h);
    const q = Math.min(w, h) * 0.22;
    ctx.fillStyle = grey(patch);
    /* Один и тот же серый в обоих квадратах: разница только в фоне. */
    ctx.fillRect(w * 0.25 - q / 2, h / 2 - q / 2, q, q);
    ctx.fillRect(w * 0.75 - q / 2, h / 2 - q / 2, q, q);
    if (right) {
      ctx.fillStyle = grey(patch);
      ctx.fillRect(w * 0.5 - q / 2, h * 0.18 - q / 2, q, q);
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.5 - q / 2, h * 0.18 - q / 2, q, q);
    }
  });
  k.slider('patch', (v) => { patch = v / 100; s.draw(); });
  k.button('swap', (el) => {
    right = !right;
    el.textContent = right ? 'убрать третий' : 'перенести квадрат';
    s.draw();
    k.say(right ? 'третий квадрат на границе — из того же серого. Он принадлежит обоим фонам сразу и потому не знает, каким быть.' : '');
  });
});

export const machBands: Mount = demo((k) => {
  let ramp = 40;
  let prof: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    const a = w * (0.5 - ramp / 260);
    const b = w * (0.5 + ramp / 260);
    prof = [];
    for (let x = 0; x < w; x++) {
      const v = x < a ? 0.25 : x > b ? 0.75 : 0.25 + ((x - a) / (b - a)) * 0.5;
      prof.push(v);
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
  });
  const c = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    /* Настоящий профиль, снятый с того же массива, которым рисуется картинка. */
    prof.forEach((v, i) => {
      const x = (i / prof.length) * w;
      const y = h - 6 - v * (h - 12);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  k.slider('ramp', (v) => { ramp = v; s.draw(); c.draw(); });
  k.say('там, где глаз настаивает на светлой и тёмной полосе, профиль внизу совершенно прямой.');
});

export const chevreul: Mount = demo((k) => {
  let steps = 10;
  let mask = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bw = w / steps;
    for (let i = 0; i < steps; i++) {
      ctx.fillStyle = grey(0.15 + (i / (steps - 1)) * 0.7);
      ctx.fillRect(i * bw, 0, bw + 1, h);
    }
    if (mask) {
      const i = Math.floor(steps / 2);
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, i * bw, h);
      ctx.fillRect((i + 1) * bw, 0, w, h);
    }
  });
  k.slider('steps', (v) => { steps = v; s.draw(); });
  k.toggle('mask', (v) => {
    mask = v;
    s.draw();
    k.say(v ? 'под маской полоса ровная от края до края. Рифление было в соседях.' : '');
  });
});

export const cornsweet: Mount = demo((k) => {
  let occl = 0;
  const s = k.surface(({ ctx, w, h }) => {
    const mid = w / 2;
    const half = w * 0.06;
    for (let x = 0; x < w; x++) {
      /* Слева и справа одна и та же яркость 0.5; всё различие — в узком градиенте. */
      let v = 0.5;
      if (x > mid - half && x < mid) v = 0.5 + 0.22 * (1 - (mid - x) / half) ** 2;
      if (x >= mid && x < mid + half) v = 0.5 - 0.22 * (1 - (x - mid) / half) ** 2;
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
    if (occl > 0) {
      ctx.fillStyle = '#4a4a52';
      const ow = (occl / 100) * w * 0.2;
      ctx.fillRect(mid - ow / 2, 0, ow, h);
    }
  });
  k.slider('occl', (v) => {
    occl = v;
    s.draw();
    k.say(v > 40 ? 'стык закрыт — половины сравнялись. Они были равны всё это время.' : '');
  });
  k.button('probe', () => {
    const a = k.probe(20, 20);
    const b = k.probe(k.el('[data-canvas]')!.clientWidth - 20, 20);
    k.say(`слева ${a}, справа ${b}. ${a === b ? 'Одно и то же число.' : 'Разница ' + Math.abs(a - b) + ' — округление.'}`);
  });
});

export const koffkaRing: Mount = demo((k) => {
  let gap = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.82);
    ctx.fillRect(0, 0, w / 2, h);
    ctx.fillStyle = grey(0.18);
    ctx.fillRect(w / 2, 0, w / 2, h);
    const R = Math.min(w, h) * 0.34;
    const r = R * 0.55;
    /* Кольцо одного серого; разрез только раздвигает половины. */
    const halfRing = (dir: number) => {
      ctx.beginPath();
      ctx.arc(w / 2 + (dir * gap) / 2, h / 2, R, dir > 0 ? -Math.PI / 2 : Math.PI / 2, dir > 0 ? Math.PI / 2 : (Math.PI * 3) / 2);
      ctx.arc(w / 2 + (dir * gap) / 2, h / 2, r, dir > 0 ? Math.PI / 2 : (Math.PI * 3) / 2, dir > 0 ? -Math.PI / 2 : Math.PI / 2, true);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = grey(0.5);
    halfRing(1);
    halfRing(-1);
  });
  k.slider('gap', (v) => {
    gap = v;
    s.draw();
    k.say(v === 0 ? 'кольцо целое — и ровное.' : 'половины разошлись по светлоте. Серый у них один и тот же.');
  });
});

export const whiteIllusion: Mount = demo((k) => {
  let len = 60;
  let geom = { y1: 0, y2: 0, x: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bars = 11;
    const bh = h / bars;
    for (let i = 0; i < bars; i++) {
      ctx.fillStyle = i % 2 ? '#111' : '#eee';
      ctx.fillRect(0, i * bh, w, bh + 1);
    }
    const pw = (len / 100) * w * 0.34;
    ctx.fillStyle = grey(0.5);
    /* Одна вставка лежит в чёрной полосе, другая в белой. Серый один. */
    ctx.fillRect(w * 0.22, 3 * bh, pw, bh);
    ctx.fillRect(w * 0.62, 4 * bh, pw, bh);
    geom = { y1: 3 * bh + bh / 2, y2: 4 * bh + bh / 2, x: w * 0.24 };
  });
  k.slider('len', (v) => { len = v; s.draw(); });
  k.button('probe', () => {
    const a = k.probe(geom.x, geom.y1);
    const b = k.probe(k.el('[data-canvas]')!.clientWidth * 0.64, geom.y2);
    k.say(`в чёрной полосе ${a}, в белой ${b}. ${a === b ? 'Одно число — и вставка в чёрной полосе всё равно светлее на вид, то есть ровно наоборот тому, что предсказывает контраст.' : ''}`);
  });
});

export const benaryCross: Mount = demo((k) => {
  let lift = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#efefef';
    ctx.fillRect(0, 0, w, h);
    const u = Math.min(w, h) / 5;
    const cx = w / 2, cy = h / 2;
    ctx.fillStyle = '#151515';
    ctx.fillRect(cx - u / 2, cy - u * 1.5, u, u * 3);
    ctx.fillRect(cx - u * 1.5, cy - u / 2, u * 3, u);
    const tri = (x: number, y: number, flip: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + flip * u * 0.7, y);
      ctx.lineTo(x, y + u * 0.7);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = grey(0.55);
    if (lift) {
      /* Оба треугольника на ровном поле: принадлежать нечему, и разница схлопывается. */
      tri(w * 0.2, cy - u * 0.35, 1);
      tri(w * 0.8, cy - u * 0.35, -1);
    } else {
      tri(cx - u * 1.5, cy - u * 0.5, 1);
      tri(cx + u * 0.5, cy - u * 1.5, 1);
    }
  });
  k.toggle('lift', (v) => {
    lift = v;
    s.draw();
    k.say(v ? 'на ровном поле они одинаковы. Локальное окружение у них было одинаковым и раньше — менялась только принадлежность.' : '');
  });
});

export const gratingInduction: Mount = demo((k) => {
  let freq = 4;
  let strip = 34;
  let row: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    for (let x = 0; x < w; x++) {
      const v = 0.5 + 0.4 * Math.sin((x / w) * Math.PI * 2 * freq);
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, h / 2 - strip / 2, w, strip);
    row = new Array(Math.round(w)).fill(0.5);
  });
  const c = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    row.forEach((v, i) => {
      const x = (i / row.length) * w;
      const y = h - 6 - v * (h - 12);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  k.slider('freq', (v) => { freq = v; s.draw(); c.draw(); });
  k.slider('strip', (v) => { strip = v; s.draw(); c.draw(); });
  k.say('в полосе видна решётка в противофазе. Профиль под картинкой снят с той же полосы и совершенно прям.');
});

export const asahi: Mount = demo((k) => {
  let petals = 8;
  let steep = 70;
  let invert = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.62);
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const x = cx + R * 0.55 * Math.cos(a);
      const y = cy + R * 0.55 * Math.sin(a);
      /* Градиенты сходятся к центру — оптический признак блика. */
      const g = ctx.createLinearGradient(cx, cy, cx + R * 1.1 * Math.cos(a), cy + R * 1.1 * Math.sin(a));
      const near = invert ? 0.1 : 0.98;
      const far = invert ? 0.98 : 0.1;
      g.addColorStop(0, grey(near));
      g.addColorStop(1, grey(far + ((1 - steep / 100) * (near - far)) / 2));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, R * 0.42, R * 0.22, a, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('petals', (v) => { petals = v; s.draw(); });
  k.slider('steep', (v) => { steep = v; s.draw(); });
  k.toggle('invert', (v) => {
    invert = v;
    s.draw();
    k.say(v ? 'градиент развёрнут — свечение пропало. Значит, работает направление, а не пестрота.' : 'середина выглядит ярче белого, которое экран вообще способен выдать.');
  });
});

export const scintillatingGrid: Mount = demo((k) => {
  let disc = 8, bar = 0.5, pitch = 56;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = grey(bar);
    ctx.lineWidth = disc * 1.4;
    for (let y = pitch / 2; y < h; y += pitch) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let x = pitch / 2; x < w; x += pitch) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    ctx.fillStyle = '#fff';
    for (let y = pitch / 2; y < h; y += pitch)
      for (let x = pitch / 2; x < w; x += pitch) {
        ctx.beginPath();
        ctx.arc(x, y, disc, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h / 2); ctx.lineTo(w / 2 + 8, h / 2);
    ctx.moveTo(w / 2, h / 2 - 8); ctx.lineTo(w / 2, h / 2 + 8);
    ctx.stroke();
  });
  k.slider('disc', (v) => { disc = v; s.draw(); });
  k.slider('bar', (v) => { bar = v / 100; s.draw(); });
  k.slider('pitch', (v) => { pitch = v; s.draw(); });
  k.say('смотрите на красный крест: под ним не мигает никогда, а вокруг — постоянно.');
});

export const bezold: Mount = demo((k) => {
  let width = 3;
  const s = k.surface(({ ctx, w, h }) => {
    /* Одна и та же краска в обеих половинах, переплетённая с чёрным и с белым. */
    const base = '#d05a5a';
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += width * 2) {
      ctx.fillStyle = y < h ? '#000' : '#000';
      ctx.fillRect(0, y, w / 2, width);
      ctx.fillStyle = '#fff';
      ctx.fillRect(w / 2, y, w / 2, width);
    }
  });
  k.slider('width', (v) => {
    width = v;
    s.draw();
    k.say(v <= 4 ? 'линии тонкие: краска тянется к ним — это ассимиляция.' : 'линии толстые: краска отталкивается от них — это контраст. Где-то между этими режимами эффект переворачивается.');
  });
});

export const shadedDiamond: Mount = demo((k) => {
  let round = false;
  let pts: [number, number][] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, 0, w, h);
    const R = Math.min(w * 0.18, h * 0.34);
    pts = [[w * 0.3, h / 2], [w * 0.7, h / 2]];
    for (const [cx, cy] of pts) {
      /* Заливка у обеих фигур одна и та же; меняется только очертание. */
      const g = ctx.createLinearGradient(cx, cy - R, cx, cy + R);
      g.addColorStop(0, grey(0.82));
      g.addColorStop(1, grey(0.22));
      ctx.fillStyle = g;
      ctx.beginPath();
      if (round) ctx.ellipse(cx, cy, R * 0.8, R, 0, 0, Math.PI * 2);
      else {
        ctx.moveTo(cx, cy - R);
        ctx.lineTo(cx + R * 0.8, cy);
        ctx.lineTo(cx, cy + R);
        ctx.lineTo(cx - R * 0.8, cy);
        ctx.closePath();
      }
      ctx.fill();
    }
  });
  k.toggle('round', (v) => {
    round = v;
    s.draw();
    k.say(v ? 'с округлым контуром обе читаются цилиндрами и выглядят равномерно закрашенными.' : 'с прямым контуром градиент нечем объяснить освещением — и он списывается на краску.');
  });
  k.button('probe', () => {
    const a = k.probe(pts[0][0], pts[0][1]);
    const b = k.probe(pts[1][0], pts[1][1]);
    k.say(`в середине левой ${a}, правой ${b}. Заливка у них одна функция.`);
  });
});

export const chubb: Mount = demo((k) => {
  let sur = 90, guess = 50;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, 0, w, h);
    const noise = (x0: number, y0: number, size: number, c: number, seed: number) => {
      let sd = seed;
      const rand = () => ((sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296);
      const cell = 4;
      for (let y = 0; y < size; y += cell)
        for (let x = 0; x < size; x += cell) {
          ctx.fillStyle = grey(0.5 + (rand() - 0.5) * c);
          ctx.fillRect(x0 + x, y0 + y, cell, cell);
        }
    };
    const big = Math.min(w * 0.4, h * 0.85);
    const small = big * 0.42;
    for (const [x0, c] of [[w * 0.05, sur / 100], [w * 0.55, 0]] as const)
      noise(x0, h / 2 - big / 2, big, c, 12345);
    noise(w * 0.05 + (big - small) / 2, h / 2 - small / 2, small, 0.5, 777);
    noise(w * 0.55 + (big - small) / 2, h / 2 - small / 2, small, guess / 100, 777);
  });
  k.slider('surround', (v) => { sur = v; s.draw(); });
  k.slider('guess', (v) => { guess = v; s.draw(); });
  k.button('check', () => {
    k.say(`эталон слева имеет контраст 50. Вы выставили ${guess} — промах ${Math.abs(guess - 50)} единиц, и это цена пёстрого окружения.`);
  });
});

export const snakeIllusion: Mount = demo((k) => {
  let anti = false;
  let pts: [number, number][] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const rows = 5;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      /* В «антизмее» полосы идут ровно и подсказка о смене освещения исчезает. */
      const lum = anti ? (r % 2 ? 0.28 : 0.72) : r < rows / 2 ? (r % 2 ? 0.2 : 0.64) : r % 2 ? 0.36 : 0.85;
      ctx.fillStyle = grey(lum);
      ctx.fillRect(0, r * rh, w, rh + 1);
    }
    pts = [[w * 0.28, rh * 1.5], [w * 0.72, rh * 3.5]];
    ctx.fillStyle = grey(0.5);
    for (const [cx, cy] of pts) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - rh * 0.34);
      ctx.lineTo(cx + rh * 0.4, cy);
      ctx.lineTo(cx, cy + rh * 0.34);
      ctx.lineTo(cx - rh * 0.4, cy);
      ctx.closePath();
      ctx.fill();
    }
  });
  k.toggle('anti', (v) => {
    anti = v;
    s.draw();
    k.say(v ? 'подсказки об освещении нет, а разница почти вся осталась. Это довод против объяснений, которые к ней сводятся.' : '');
  });
  k.button('probe', () => {
    const a = k.probe(pts[0][0], pts[0][1]);
    const b = k.probe(pts[1][0], pts[1][1]);
    k.say(`верхний ромб ${a}, нижний ${b}. ${a === b ? 'Одно число.' : ''}`);
  });
});
