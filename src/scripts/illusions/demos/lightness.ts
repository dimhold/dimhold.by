/* Светлота и контраст. Почти в каждой демонстрации есть проба яркости: без измерения
   такая иллюзия остаётся утверждением, а с измерением становится фактом. */
import { demo, grey, INK, MARK, PAPER, plural, type Kit, type Mount } from '../kit';
import { tr } from '../i18n';

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
      ? tr('кляксы исчезли, хотя перекрёстки на месте: те же четыре улицы той же ширины сходятся в каждом. Вместе с кляксами исчезло и учебниковое объяснение.')
      : tr('смотрите мимо перекрёстка — серые пятна появляются там, куда вы не смотрите.'));
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
    k.say(v ? tr('пока полоса их соединяет, спорить не с чем. Уберите её — и поверить снова станет невозможно.') : '');
  });
  k.button('probe', () => {
    const at = (p: { c: number; r: number }) => k.probe((p.c + 0.5) * tile, (p.r + 0.15) * tile);
    const a = at(A), b = at(B);
    k.say(a === b
      ? tr('A = {a}, B = {b}. Ровно одно число. Ваше зрение видит разницу там, где на экране её нет ни на единицу.', { a, b })
      : tr('A = {a}, B = {b} — разница {d} из 255: край полутени задел клетку.', { a, b, d: Math.abs(a - b) }));
  });
});

export const simultaneousContrast: Mount = demo((k) => {
  let patch = 0.5;
  /* Третий квадрат-путешественник: доля ширины, где стоит его центр. null — его нет. */
  let trav: number | null = null;
  let anim = 0;
  let geo = { w: 0, h: 0, q: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.12);
    ctx.fillRect(0, 0, w / 2, h);
    ctx.fillStyle = grey(0.88);
    ctx.fillRect(w / 2, 0, w / 2, h);
    const q = Math.min(w, h) * 0.22;
    geo = { w, h, q };
    ctx.fillStyle = grey(patch);
    /* Один и тот же серый во всех квадратах: разница только в фоне. */
    ctx.fillRect(w * 0.25 - q / 2, h * 0.62 - q / 2, q, q);
    ctx.fillRect(w * 0.75 - q / 2, h * 0.62 - q / 2, q, q);
    /* Путешественник без обводки: рамка отделила бы его от фона и съела бы эффект. */
    if (trav !== null) ctx.fillRect(trav * w - q / 2, h * 0.2 - q / 2, q, q);
  });
  k.slider('patch', (v) => { patch = v / 100; s.draw(); });
  const arrived = () => {
    const v = k.probe(trav! * geo.w, geo.h * 0.2);
    k.say(tr('квадрат переехал на другой фон. Краска та же — {v} из 255, — а светлота сменилась по дороге.', { v }));
  };
  const glide = (to: number) => {
    cancelAnimationFrame(anim);
    const from = trav ?? 0.25;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 2600);
      trav = from + (to - from) * (0.5 - Math.cos(p * Math.PI) / 2);
      s.draw();
      if (p < 1) anim = requestAnimationFrame(step);
      else arrived();
    };
    anim = requestAnimationFrame(step);
  };
  k.button('swap', () => {
    if (trav === null) trav = 0.25;
    k.say(tr('смотрите на верхний квадрат, пока он едет. Его можно и тащить мышью или пальцем.'));
    glide(trav < 0.5 ? 0.75 : 0.25);
  });
  /* Перетаскивание: тот же квадрат, ведомый рукой, а не анимацией. */
  const cv = k.el('[data-canvas]') as HTMLCanvasElement;
  let drag = false;
  cv.style.touchAction = 'pan-y';
  const at = (ev: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };
  cv.addEventListener('pointerdown', (ev) => {
    const { x, y } = at(ev);
    if (Math.abs(y - geo.h * 0.2) > geo.q * 0.7) return;
    if (trav !== null && Math.abs(x - trav * geo.w) > geo.q * 0.7) return;
    cancelAnimationFrame(anim);
    drag = true;
    cv.setPointerCapture(ev.pointerId);
    const lim = geo.q / 2 / geo.w;
    trav = Math.max(lim, Math.min(1 - lim, x / geo.w));
    s.draw();
  });
  cv.addEventListener('pointermove', (ev) => {
    if (!drag) return;
    const lim = geo.q / 2 / geo.w;
    trav = Math.max(lim, Math.min(1 - lim, at(ev).x / geo.w));
    s.draw();
  });
  const drop = () => {
    if (!drag) return;
    drag = false;
    if (Math.abs(trav! - 0.5) > 0.15) arrived();
  };
  cv.addEventListener('pointerup', drop);
  cv.addEventListener('pointercancel', drop);
});

/** Строка яркостей основного холста на высоте y, по одному числу 0..1 на логический пиксель.
    Профиль под картинкой снимается отсюда, с готовых пикселей, а не с массива, по которому
    картинка рисовалась: так он показывает то, что на экране, а не то, что задумано. */
const rowOf = (k: Kit, y: number): number[] => {
  const cv = k.el('[data-canvas]') as HTMLCanvasElement;
  const d = k.dpr;
  const data = cv.getContext('2d')!.getImageData(0, Math.round(y * d), cv.width, 1).data;
  const out: number[] = [];
  for (let x = 0; x < cv.clientWidth; x++) out.push(data[Math.min(cv.width - 1, Math.round(x * d)) * 4] / 255);
  return out;
};

const drawProfile = (ctx: CanvasRenderingContext2D, w: number, h: number, row: number[], colour: string, lw: number) => {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lw;
  ctx.beginPath();
  row.forEach((v, i) => {
    const x = (i / row.length) * w;
    const y = h - 6 - v * (h - 12);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
};

export const machBands: Mount = demo((k) => {
  /* Ползунок — крутизна: чем больше значение, тем уже переход. */
  let steep = 40;
  const s = k.surface(({ ctx, w, h }) => {
    const half = (95 - steep) / 260;
    const a = w * (0.5 - half);
    const b = w * (0.5 + half);
    for (let x = 0; x < w; x++) {
      const v = x < a ? 0.25 : x > b ? 0.75 : 0.25 + ((x - a) / (b - a)) * 0.5;
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
  });
  const c = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    drawProfile(ctx, w, h, rowOf(k, s.h / 2), MARK, 2);
  });
  k.slider('ramp', (v) => { steep = v; s.draw(); c.draw(); });
  k.say(tr('там, где глаз настаивает на светлой и тёмной полосе, профиль внизу совершенно прямой.'));
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
    k.say(v ? tr('под маской полоса ровная от края до края. Рифление было в соседях.') : '');
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
    /* Заслонка шириной 0.2 w при 100 %, градиент занимает 0.12 w: закрыт он с 60 %. */
    k.say((v / 100) * 0.2 >= 0.12 ? tr('стык закрыт — половины сравнялись. Они были равны всё это время.') : '');
  });
  k.button('probe', () => {
    const a = k.probe(20, 20);
    const b = k.probe(k.el('[data-canvas]')!.clientWidth - 20, 20);
    k.say(a === b
      ? tr('слева {a}, справа {b}. Одно и то же число.', { a, b })
      : tr('слева {a}, справа {b}. Разница {d} — округление.', { a, b, d: Math.abs(a - b) }));
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
    if (gap === 0) {
      /* Целое кольцо одним контуром: две половины встык оставили бы шов, а шов — уже разрез. */
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, R, 0, Math.PI * 2);
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2, true);
      ctx.fill();
      return;
    }
    halfRing(1);
    halfRing(-1);
  });
  k.slider('gap', (v) => {
    gap = v;
    s.draw();
    k.say(v === 0 ? tr('кольцо целое — и ровное.') : tr('половины разошлись по светлоте. Серый у них один и тот же.'));
  });
});

export const whiteIllusion: Mount = demo((k) => {
  let len = 60;
  let geom = { y1: 0, y2: 0, x: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Частая решётка: на крупных полосах эффект Уайта слабеет. Число нечётное, чтобы
       средняя полоса была чёрной, а её соседка снизу — белой. */
    const bars = 19;
    const bh = h / bars;
    const mid = (bars - 1) / 2;
    for (let i = 0; i < bars; i++) {
      ctx.fillStyle = i % 2 ? '#111' : '#eee';
      ctx.fillRect(0, i * bh, w, bh + 1);
    }
    const pw = (len / 100) * w * 0.34;
    ctx.fillStyle = grey(0.5);
    /* Одна вставка лежит в чёрной полосе, другая в белой. Серый один. */
    ctx.fillRect(w * 0.22, mid * bh, pw, bh);
    ctx.fillRect(w * 0.62, (mid + 1) * bh, pw, bh);
    geom = { y1: mid * bh + bh / 2, y2: (mid + 1) * bh + bh / 2, x: w * 0.24 };
  });
  k.slider('len', (v) => { len = v; s.draw(); });
  k.button('probe', () => {
    const a = k.probe(geom.x, geom.y1);
    const b = k.probe(k.el('[data-canvas]')!.clientWidth * 0.64, geom.y2);
    k.say(a === b
      ? tr('в чёрной полосе {a}, в белой {b}. Одно число — и вставка в чёрной полосе всё равно светлее на вид, то есть ровно наоборот тому, что предсказывает контраст.', { a, b })
      : tr('в чёрной полосе {a}, в белой {b}.', { a, b }));
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
    const a = u * 0.6;
    const d = a / Math.SQRT2;
    /* Угловой: прямой угол в углу креста, катеты лежат на рукавах (чёрные), гипотенуза
       смотрит в белое. */
    const corner = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + a, y);
      ctx.lineTo(x, y - a);
      ctx.closePath();
      ctx.fill();
    };
    /* Врезанный: гипотенуза лежит на верхнем краю рукава (над ней белое), катеты уходят
       в чёрное. У обоих граница одна и та же — гипотенуза о белое, катеты о чёрное. */
    const inset = (x: number, y: number) => {
      ctx.beginPath();
      ctx.moveTo(x - d, y);
      ctx.lineTo(x + d, y);
      ctx.lineTo(x, y + d);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = grey(0.55);
    if (lift) {
      /* Оба треугольника на ровном поле: принадлежать нечему, и разница схлопывается. */
      inset(w * 0.15, cy - d / 2);
      corner(w * 0.8, cy + a / 2);
    } else {
      inset(cx - u, cy - u / 2);
      corner(cx + u / 2, cy - u / 2);
    }
  });
  k.toggle('lift', (v) => {
    lift = v;
    s.draw();
    k.say(v ? tr('на ровном поле они одинаковы. Локальное окружение у них было одинаковым и раньше — менялась только принадлежность.') : '');
  });
});

export const gratingInduction: Mount = demo((k) => {
  let freq = 4;
  let strip = 34;
  const s = k.surface(({ ctx, w, h }) => {
    for (let x = 0; x < w; x++) {
      const v = 0.5 + 0.4 * Math.sin((x / w) * Math.PI * 2 * freq);
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, h / 2 - strip / 2, w, strip);
  });
  const c = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Оба профиля сняты с готовых пикселей: серый — решётка над полосой, красный —
       середина полосы. */
    drawProfile(ctx, w, h, rowOf(k, s.h * 0.1), 'rgba(24,24,27,0.35)', 1);
    drawProfile(ctx, w, h, rowOf(k, s.h / 2), MARK, 2);
  });
  k.slider('freq', (v) => { freq = v; s.draw(); c.draw(); });
  k.slider('strip', (v) => { strip = v; s.draw(); c.draw(); });
  k.say(tr('в полосе видна решётка в противофазе. Красный профиль под картинкой снят с середины полосы и совершенно прям; серый — с решётки над ней.'));
});

export const asahi: Mount = demo((k) => {
  let petals = 8;
  let steep = 70;
  let invert = false;
  const s = k.surface(({ ctx, w, h }) => {
    /* Фон и середина — самый белый пиксель, какой есть у экрана: светиться ярче можно
       только в восприятии. */
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    const rc = R * 0.17;
    const d = (rc + R) / 2;
    const major = (R - rc) / 2;
    /* Лепестки не налезают друг на друга при любом их числе. */
    const minor = Math.min(R * 0.2, Math.sin(Math.PI / petals) * d * 0.92);
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const x = cx + d * Math.cos(a);
      const y = cy + d * Math.sin(a);
      /* Градиенты сходятся к центру — оптический признак блика. */
      const g = ctx.createLinearGradient(cx + rc * Math.cos(a), cy + rc * Math.sin(a), cx + R * Math.cos(a), cy + R * Math.sin(a));
      const near = invert ? 0.08 : 1;
      const far = invert ? 1 : 0.08;
      g.addColorStop(0, grey(near));
      g.addColorStop(1, grey(far + ((1 - steep / 100) * (near - far)) / 2));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, major, minor, a, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('petals', (v) => { petals = v; s.draw(); });
  k.slider('steep', (v) => { steep = v; s.draw(); });
  k.toggle('invert', (v) => {
    invert = v;
    s.draw();
    k.say(v ? tr('градиент развёрнут — свечение пропало. Значит, работает направление, а не пестрота.') : tr('середина выглядит ярче белого, которое экран вообще способен выдать. А она и фон вокруг цветка — одно и то же число, 255.'));
  });
});

export const scintillatingGrid: Mount = demo((k) => {
  let disc = 8, bar = 0.5, pitch = 56;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    /* Решётка привязана к центру: крест фиксации стоит на диске, иначе обещание
       «под крестом не мигает» было бы не про диск, а про чёрную клетку. */
    const x0 = w / 2 - Math.floor(w / 2 / pitch) * pitch;
    const y0 = h / 2 - Math.floor(h / 2 / pitch) * pitch;
    ctx.strokeStyle = grey(bar);
    ctx.lineWidth = disc * 1.4;
    for (let y = y0; y < h + disc; y += pitch) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let x = x0; x < w + disc; x += pitch) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    ctx.fillStyle = '#fff';
    for (let y = y0; y < h + disc; y += pitch)
      for (let x = x0; x < w + disc; x += pitch) {
        ctx.beginPath();
        ctx.arc(x, y, disc, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    const cr = Math.max(3, disc * 0.8);
    ctx.beginPath();
    ctx.moveTo(w / 2 - cr, h / 2); ctx.lineTo(w / 2 + cr, h / 2);
    ctx.moveTo(w / 2, h / 2 - cr); ctx.lineTo(w / 2, h / 2 + cr);
    ctx.stroke();
  });
  k.slider('disc', (v) => { disc = v; s.draw(); });
  k.slider('bar', (v) => { bar = v / 100; s.draw(); });
  k.slider('pitch', (v) => { pitch = v; s.draw(); });
  k.say(tr('смотрите на красный крест: под ним не мигает никогда, а вокруг — постоянно.'));
});

export const bezold: Mount = demo((k) => {
  let width = 3;
  const s = k.surface(({ ctx, w, h }) => {
    /* Одна и та же краска в обеих половинах, переплетённая с чёрным и с белым. */
    const base = '#d05a5a';
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    const half = Math.round(w / 2);
    for (let y = 0; y < h; y += width * 2) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, y, half, width);
      ctx.fillStyle = '#fff';
      ctx.fillRect(half, y, w - half, width);
    }
  });
  k.slider('width', (v) => {
    width = v;
    s.draw();
    k.say(v <= 4 ? tr('линии тонкие: краска тянется к ним — это ассимиляция.') : tr('линии толстые: краска отталкивается от них — это контраст. Где-то между этими режимами эффект переворачивается.'));
  });
});

export const shadedDiamond: Mount = demo((k) => {
  let round = false;
  let pts: [number, number][] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, 0, w, h);
    /* Схема Нилла и Керстена: две фигуры вплотную, у каждой один и тот же наклон яркости
       слева направо, на общем стыке — ступенька. Прямые края читаются как два бруска,
       эллиптические — как два цилиндра. */
    /* Целые пиксели: иначе две заливки сэмплируются со сдвигом на долю пикселя и проба
       покажет разницу в единицу там, где функция одна. */
    const fw = 2 * Math.round(Math.min(w * 0.26, h * 0.62) / 2);
    const fh = h * 0.56;
    const e = fw * 0.2;
    const y0 = (h - fh) / 2 + e * 0.4;
    const xs = [Math.round(w / 2) - fw, Math.round(w / 2)];
    pts = xs.map((x) => [x + fw / 2, y0 + fh / 2]);
    for (const x0 of xs) {
      /* Заливка у обеих фигур одна и та же; меняется только очертание. Столбцами, а не
         градиентом холста: тот подмешивает шум, и проба расходилась бы на единицу. */
      ctx.save();
      ctx.beginPath();
      if (round) {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, y0 + fh);
        ctx.ellipse(x0 + fw / 2, y0 + fh, fw / 2, e, 0, Math.PI, 0, true);
        ctx.lineTo(x0 + fw, y0);
        ctx.closePath();
      } else ctx.rect(x0, y0, fw, fh);
      ctx.clip();
      for (let i = 0; i < fw; i++) {
        ctx.fillStyle = grey(0.3 + (0.48 * (i + 0.5)) / fw);
        ctx.fillRect(x0 + i, y0 - e, 1, fh + 2 * e);
      }
      ctx.restore();
      /* Верхняя грань ровного серого: у бруска — параллелограмм, у цилиндра — эллипс. */
      ctx.fillStyle = grey(0.7);
      ctx.beginPath();
      if (round) ctx.ellipse(x0 + fw / 2, y0, fw / 2, e, 0, 0, Math.PI * 2);
      else {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + fw, y0);
        ctx.lineTo(x0 + fw + e, y0 - e);
        ctx.lineTo(x0 + e, y0 - e);
        ctx.closePath();
      }
      ctx.fill();
    }
  });
  k.toggle('round', (v) => {
    round = v;
    s.draw();
    k.say(v ? tr('с округлым контуром обе читаются цилиндрами и выглядят равномерно закрашенными.') : tr('с прямым контуром градиент нечем объяснить освещением — и он списывается на краску.'));
  });
  k.button('probe', () => {
    const a = k.probe(pts[0][0], pts[0][1]);
    const b = k.probe(pts[1][0], pts[1][1]);
    k.say(tr('в середине левой {a}, правой {b}. Заливка у них одна функция.', { a, b }));
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
    const miss = plural(Math.abs(guess - 50), tr('{n} единица'), tr('{n} единицы'), tr('{n} единиц'));
    /* Вывод зависит от того, что получилось: «цена пёстрого окружения» — только когда
       окружение пёстрое и промах в ту сторону, куда оно тянет. */
    k.say(Math.abs(guess - 50) <= 3
      ? tr('эталон слева имеет контраст 50. Вы выставили {g} — почти точно.', { g: guess })
      : sur < 25
        ? tr('эталон слева имеет контраст 50. Вы выставили {g}, промах {miss}. Окружение сейчас почти ровное — поднимите его контраст и сравните снова.', { g: guess, miss })
        : guess < 50
          ? tr('эталон слева имеет контраст 50. Вы выставили {g} — промах {miss}, и это цена пёстрого окружения.', { g: guess, miss })
          : tr('эталон слева имеет контраст 50. Вы выставили {g}, больше эталона. Пёстрое окружение обычно действует наоборот: пятно в нём кажется бледнее.', { g: guess }));
  });
});

export const snakeIllusion: Mount = demo((k) => {
  let anti = false;
  let pts: [number, number][] = [];
  const DK = 0.22, LT = 0.8, MID = 0.5;
  const s = k.surface(({ ctx, w, h }) => {
    /* Два ряда одинаковых серых ромбов, нижний сдвинут на полшага. Верхние лежат на
       тёмном, нижние на светлом. В «змее» тёмное и светлое — две сплошные полосы
       с зигзагом между рядами, их легко прочесть как тень или тёмный фильтр. В «антизмее»
       у каждого ромба та же тёмная или светлая плашка вокруг, но полос нет. */
    const n = 5;
    const c = Math.min(w / (n + 0.8), h / 2.4);
    const left = (w - n * c) / 2;
    const yU = h / 2 - c * 0.55, yL = h / 2 + c * 0.55;
    const half = c * 0.4;
    const up = Array.from({ length: n }, (_, i) => left + (i + 0.5) * c);
    const low = Array.from({ length: n - 1 }, (_, i) => left + (i + 1) * c);
    if (anti) {
      ctx.fillStyle = grey(MID);
      ctx.fillRect(0, 0, w, h);
      const tile = c * 0.94;
      ctx.fillStyle = grey(DK);
      for (const x of up) ctx.fillRect(x - tile / 2, yU - tile / 2, tile, tile);
      ctx.fillStyle = grey(LT);
      for (const x of low) ctx.fillRect(x - tile / 2, yL - tile / 2, tile, tile);
    } else {
      ctx.fillStyle = grey(LT);
      ctx.fillRect(0, 0, w, h);
      /* Зигзаг проходит под верхними ромбами и над нижними, нигде их не задевая. */
      ctx.fillStyle = grey(DK);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h / 2);
      for (let i = n; i >= 0; i--) {
        const x = left + i * c;
        ctx.lineTo(x, h / 2 - c * 0.3);
        if (i > 0) ctx.lineTo(x - c / 2, h / 2 + c * 0.3);
      }
      ctx.lineTo(0, h / 2);
      ctx.closePath();
      ctx.fill();
    }
    pts = [[up[1], yU], [low[2], yL]];
    ctx.fillStyle = grey(0.5);
    const diamond = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - half);
      ctx.lineTo(cx + half, cy);
      ctx.lineTo(cx, cy + half);
      ctx.lineTo(cx - half, cy);
      ctx.closePath();
      ctx.fill();
    };
    for (const x of up) diamond(x, yU);
    for (const x of low) diamond(x, yL);
  });
  k.toggle('anti', (v) => {
    anti = v;
    s.draw();
    k.say(v ? tr('у каждого ромба тот же ближайший фон, что и в «змейке», а разница почти исчезла. Значит, одним местным контрастом её не объяснить: в «змейке» её усиливают полосы, которые зрение читает как дымку.') : '');
  });
  k.button('probe', () => {
    const a = k.probe(pts[0][0], pts[0][1]);
    const b = k.probe(pts[1][0], pts[1][1]);
    k.say(a === b ? tr('верхний ромб {a}, нижний {b}. Одно число.', { a, b }) : tr('верхний ромб {a}, нижний {b}.', { a, b }));
  });
});
