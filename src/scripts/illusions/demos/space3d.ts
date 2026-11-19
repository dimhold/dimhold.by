/* Глубина, перспектива и невозможные фигуры.
   Невозможные объекты строятся здесь настоящей разомкнутой геометрией: они проецируются
   в знакомую фигуру ровно с одного направления, а при отводе камеры разваливаются. В
   этом весь смысл — фигура не становится ложью, пока вы не сдвинулись. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { tr } from '../i18n';

type V3 = [number, number, number];

/* Ортографическая проекция. При yaw = 0 и стандартном наклоне это точная изометрия —
   а в ней ось z проецируется так, что дальний конец кольца ложится ровно на ближний.
   На этом совпадении и стоит вся фигура: она замкнута не в пространстве, а в проекции. */
const ISO_PITCH = Math.atan(Math.SQRT1_2);
const project = (p: V3, yaw: number, scale: number, cx: number, cy: number): [number, number] => {
  const [x, y, z] = p;
  const a = Math.PI / 4 + yaw;
  const x1 = x * Math.cos(a) - z * Math.sin(a);
  const z1 = x * Math.sin(a) + z * Math.cos(a);
  const y1 = y * Math.cos(ISO_PITCH) - z1 * Math.sin(ISO_PITCH);
  return [cx + x1 * scale, cy - y1 * scale];
};

const rot = (p: V3, yaw: number): V3 => {
  const a = Math.PI / 4 + yaw;
  return [p[0] * Math.cos(a) - p[2] * Math.sin(a), p[1], p[0] * Math.sin(a) + p[2] * Math.cos(a)];
};

/* Насколько точка ближе к камере. Камера смотрит сверху вдоль (−1, −1, −1): вверх по
   экрану идёт y·cos − z·sin, а к зрителю — y·sin + z·cos. Сортировка по одному z
   давала обратный порядок, и дальние грани ложились поверх ближних. */
const near = (p: V3, yaw: number, pitch = ISO_PITCH) => {
  const r = rot(p, yaw);
  return r[1] * Math.sin(pitch) + r[2] * Math.cos(pitch);
};

/* Сдвиг начала координат, при котором точка c попадает в центр холста. */
const centreOn = (c: V3, yaw: number, sc: number, cx: number, cy: number, pitch = ISO_PITCH): [number, number] => {
  const r = rot(c, yaw);
  return [cx - r[0] * sc, cy + (r[1] * Math.cos(pitch) - r[2] * Math.sin(pitch)) * sc];
};

/* Тона граней по оси нормали: x, y (верх), z. */
const SHADE = ['#c9a86a', '#dcbf85', '#a8843f'];

/* Брусок квадратного сечения: настоящая коробка, у которой рисуются три видимые грани.
   Плоскими полосами тут не обойтись — именно грани и делают стык стыком. */
const box = (
  ctx: CanvasRenderingContext2D,
  origin: V3,
  axis: 0 | 1 | 2,
  len: number,
  wdt: number,
  yaw: number,
  scale: number,
  cx: number,
  cy: number,
  tint: string,
) => {
  const dirs: V3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const d = dirs[axis].map((v) => v * len) as V3;
  const u = dirs[(axis + 1) % 3].map((v) => v * wdt) as V3;
  const v = dirs[(axis + 2) % 3].map((v) => v * wdt) as V3;
  /* origin — точка на осевой линии, а не угол: иначе бруски расходятся на полсечения
     и стыки перестают сходиться. */
  const o: V3 = [origin[0] - (u[0] + v[0]) / 2, origin[1] - (u[1] + v[1]) / 2, origin[2] - (u[2] + v[2]) / 2];
  const at = (i: number, j: number, kk: number): V3 => [
    o[0] + d[0] * i + u[0] * j + v[0] * kk,
    o[1] + d[1] * i + u[1] * j + v[1] * kk,
    o[2] + d[2] * i + u[2] * j + v[2] * kk,
  ];
  const corners: V3[] = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const kk of [0, 1]) corners.push(at(i, j, kk));
  const faces: [number[], number][] = [
    [[0, 1, 3, 2], 0], [[4, 5, 7, 6], 0],
    [[0, 1, 5, 4], 1], [[2, 3, 7, 6], 1],
    [[0, 2, 6, 4], 2], [[1, 3, 7, 5], 2],
  ];
  /* Грани сортируются по глубине после поворота — так коробка остаётся коробкой
     под любым углом, а не только под изометрическим. */
  const depth = (f: number[]) => f.reduce((acc, ci) => acc + near(corners[ci], yaw), 0) / f.length;
  /* Тон грани — по её нормали в мире, а не по номеру грани у бруска: верх всегда
     светлый, бок по x средний, бок по z тёмный. Иначе у брусков разных осей верх
     окрашивался по-разному и свет противоречил сам себе. */
  [...faces].sort((x, y) => depth(x[0]) - depth(y[0])).forEach(([f, side]) => {
    ctx.beginPath();
    f.forEach((ci, n) => {
      const r = rot(corners[ci], yaw);
      const y1 = r[1] * Math.cos(ISO_PITCH) - r[2] * Math.sin(ISO_PITCH);
      const x = cx + r[0] * scale;
      const y = cy - y1 * scale;
      n ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = SHADE[(axis + side) % 3];
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });
};

const tribar = (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => {
  /* Три бруска вдоль трёх осей: из (0,0,0) по x, оттуда по y, оттуда по z. Конец
     последнего — точка (L,L,L), а она в изометрии проецируется ровно туда же, куда
     начало первого. Кольцо замкнуто в проекции и нигде больше. */
  const L = 1.5;
  const w = 0.42;
  const sc = scale * 1.1;
  /* В центр холста ставится центр видимого треугольника: (0,0,0), (L,0,0), (L,L,0). */
  const [ox, oy] = centreOn([(2 * L) / 3, L / 3, 0], yaw, sc, cx, cy);
  /* Порядок рисования — единственное, что прячет разрыв: конец третьего бруска
     уходит под первый. */
  box(ctx, [L, L, 0], 2, L, w, yaw, sc, ox, oy, '');
  box(ctx, [L, 0, 0], 1, L, w, yaw, sc, ox, oy, '');
  box(ctx, [-w / 2, 0, 0], 0, L + w / 2, w, yaw, sc, ox, oy, '');
};

/* Плита-параллелепипед: центр и полуразмеры по осям. Грани сортируются так же, как у бруска. */
const slab = (ctx: CanvasRenderingContext2D, c: V3, half: V3, yaw: number, sc: number, ox: number, oy: number, pitch = ISO_PITCH) => {
  const corners: V3[] = [];
  for (const i of [-1, 1]) for (const j of [-1, 1]) for (const kk of [-1, 1]) corners.push([c[0] + i * half[0], c[1] + j * half[1], c[2] + kk * half[2]]);
  const faces: [number[], number][] = [
    [[0, 1, 3, 2], 0], [[4, 5, 7, 6], 0],
    [[0, 1, 5, 4], 1], [[2, 3, 7, 6], 1],
    [[0, 2, 6, 4], 2], [[1, 3, 7, 5], 2],
  ];
  const depth = (f: number[]) => f.reduce((acc, ci) => acc + near(corners[ci], yaw, pitch), 0) / f.length;
  [...faces].sort((x, y) => depth(x[0]) - depth(y[0])).forEach(([f, side]) => {
    ctx.beginPath();
    f.forEach((ci, n) => {
      const r = rot(corners[ci], yaw);
      const x = ox + r[0] * sc;
      const y = oy - (r[1] * Math.cos(pitch) - r[2] * Math.sin(pitch)) * sc;
      n ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = SHADE[side];
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });
};

const stairsGeom = (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => {
  /* Четыре марша по клеткам кольца: 6 ступеней по +x, 5 по +z, 2 по −x и одна по −z.
     Камера здесь смотрит круче, чем в изометрии, — вдоль (1, K, 1), — чтобы ступени
     были выше. За 14 ступеней лестница поднимается на 3K, и следующая клетка после
     последней лежит от первой ровно на (3, 3K, 3), на оси взгляда: в проекции марш
     приходит на исходную ступень, а в пространстве между ними 3K высоты. */
  const K = 1.7;
  const pitch = Math.atan(K / Math.SQRT2);
  const cells: [number, number][] = [];
  for (let x = 0; x <= 5; x++) cells.push([x, 0]);
  for (let z = 1; z <= 5; z++) cells.push([5, z]);
  cells.push([4, 5], [3, 5], [3, 4]);
  const rise = (3 * K) / cells.length, thick = 1.6;
  const steps: V3[] = cells.map(([x, z], i) => [x, (i + 1) * rise - thick / 2, z]);
  const sc = scale * 0.36;
  const [ox, oy] = centreOn([3, 1.5 * K - thick / 2, 2.6], yaw, sc, cx, cy, pitch);
  /* Ступени рисуются от дальней к ближней. */
  steps
    .sort((p, q) => near(p, yaw, pitch) - near(q, yaw, pitch))
    .forEach((c) => slab(ctx, c, [0.5, thick / 2, 0.5], yaw, sc, ox, oy, pitch));
};

const cubeGeom = (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => {
  /* Каркасный куб из двенадцати брусков, и два из них по-настоящему разрезаны. С
     рабочего ракурса в разрез ближнего верхнего ребра попадает дальнее вертикальное, а
     в разрез ближнего вертикального — дальнее нижнее: дальние рёбра проходят «перед»
     ближними, и два пересечения противоречат друг другу. Изометрия для куба не
     годится — в ней ближняя и дальняя вершины совпадают, — поэтому рабочий ракурс
     повёрнут на BASE. */
  const L = 1.4, H = L / 2;
  const w = 0.1;
  const sc = scale * 0.75;
  const BASE = 0.3;
  const Y = yaw + BASE;
  const edges: [V3, V3, 0 | 1 | 2][] = [];
  for (const y of [-H, H]) for (const z of [-H, H]) edges.push([[-H, y, z], [H, y, z], 0]);
  for (const x of [-H, H]) for (const z of [-H, H]) edges.push([[x, -H, z], [x, H, z], 1]);
  for (const x of [-H, H]) for (const y of [-H, H]) edges.push([[x, y, -H], [x, y, H], 2]);
  const at = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const scr = (p: V3): [number, number] => {
    const r = rot(p, BASE);
    return [r[0], r[1] * Math.cos(ISO_PITCH) - r[2] * Math.sin(ISO_PITCH)];
  };
  /* Где на рабочем ракурсе ребро e пересекается с ребром f: параметр на e или null. */
  const cross = (e: number, f: number) => {
    const [a, b] = edges[e], [c, d] = edges[f];
    const [p1, p2, q1, q2] = [scr(a), scr(b), scr(c), scr(d)];
    const r = [p2[0] - p1[0], p2[1] - p1[1]], s = [q2[0] - q1[0], q2[1] - q1[1]];
    const den = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(den) < 1e-9) return null;
    const t = ((q1[0] - p1[0]) * s[1] - (q1[1] - p1[1]) * s[0]) / den;
    const u = ((q1[0] - p1[0]) * r[1] - (q1[1] - p1[1]) * r[0]) / den;
    if (!(t > 0.08 && t < 0.92 && u > 0.08 && u < 0.92)) return null;
    /* Полуширина зазора по параметру: столько, сколько закрывает поперечный брусок
       при этом угле пересечения, плюс немного воздуха. */
    const sin = Math.abs(den) / (Math.hypot(r[0], r[1]) * Math.hypot(s[0], s[1]));
    return [t, (w * 0.5 / sin + w * 0.25) / Math.hypot(r[0], r[1])] as const;
  };
  const mid = (i: number) => at(edges[i][0], edges[i][1], 0.5);
  const depthAt = (i: number) => near(mid(i), BASE);
  const verticals = [4, 5, 6, 7].sort((a, b) => depthAt(a) - depthAt(b));
  const farV = verticals[0], nearV = verticals[3];
  /* Разрезы: ближнее верхнее ребро под дальним вертикальным, ближнее вертикальное
     под дальним нижним. Выбираются те, что на рабочем ракурсе действительно
     пересекаются. */
  const cuts = new Map<number, readonly [number, number]>();
  const tops = [0, 1, 2, 3, 8, 9, 10, 11].filter((i) => edges[i][0][1] > 0).sort((a, b) => depthAt(b) - depthAt(a));
  for (const i of tops) { const c = cross(i, farV); if (c) { cuts.set(i, c); break; } }
  const bottoms = [0, 1, 2, 3, 8, 9, 10, 11].filter((i) => edges[i][0][1] < 0).sort((a, b) => depthAt(a) - depthAt(b));
  for (const i of bottoms) { const c = cross(nearV, i); if (c) { cuts.set(nearV, c); break; } }
  /* Куски брусков: разрезанное ребро даёт два, с зазором ровно под чужой брусок. */
  const pieces: [V3, number, 0 | 1 | 2][] = [];
  edges.forEach(([a, b, ax], i) => {
    const c = cuts.get(i);
    const spans: [number, number][] = c === undefined ? [[0, 1]] : [[0, c[0] - c[1]], [c[0] + c[1], 1]];
    for (const [t0, t1] of spans) {
      const lo = t0 === 0 ? -w / 2 : 0, hi = t1 === 1 ? w / 2 : 0;
      const o = at(a, b, t0);
      o[ax] += lo;
      pieces.push([o, (t1 - t0) * L + hi - lo, ax]);
    }
  });
  const ox = cx, oy = cy;
  pieces
    .sort((p, q) => {
      const m = (x: [V3, number, number]): V3 => x[0].map((v, j) => (j === x[2] ? v + x[1] / 2 : v)) as V3;
      return near(m(p), Y) - near(m(q), Y);
    })
    .forEach(([o, len, ax]) => box(ctx, o, ax, len, w, Y, sc, ox, oy, ''));
};

const orbitDemo = (draw: (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => void, hint: string): Mount =>
  demo((k) => {
    let orbit = 0;
    const s = k.surface(({ ctx, w, h }) => {
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, w, h);
      const scale = Math.min(w, h) * 0.3;
      draw(ctx, (orbit / 100) * 0.7, scale, w / 2, h / 2);
    });
    k.slider('orbit', (v) => {
      orbit = v;
      s.draw();
      k.say(v === 0 ? hint : v > 25 ? tr('камера отведена — и фигура развалилась. Она была разомкнута всё это время.') : '');
    });
  });

export const penroseTriangle = orbitDemo(tribar, tr('кольцо замкнуто и невозможно. Отведите камеру.'));
export const penroseStairs = orbitDemo(stairsGeom, tr('лестница поднимается через круг и приходит на исходную площадку.'));
export const impossibleCube = orbitDemo(cubeGeom, tr('рёбра пересекаются так, как у куба не бывает.'));

export const impossibleObject: Mount = demo((k) => {
  let fig = 'tribar', orbit = 0;
  let hogarth: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (fig === 'hogarth') {
      if (!hogarth) return;
      const sc = Math.min(w / hogarth.width, h / hogarth.height) * 0.98;
      ctx.drawImage(hogarth, (w - hogarth.width * sc) / 2, (h - hogarth.height * sc) / 2, hogarth.width * sc, hogarth.height * sc);
      return;
    }
    const scale = Math.min(w, h) * 0.3;
    const yaw = (orbit / 100) * 0.7;
    if (fig === 'tribar') tribar(ctx, yaw, scale, w / 2, h / 2);
    else if (fig === 'stairs') stairsGeom(ctx, yaw, scale, w / 2, h / 2);
    else cubeGeom(ctx, yaw, scale, w / 2, h / 2);
  });
  k.select('fig', (v) => {
    fig = v;
    s.draw();
    k.say(v === 'hogarth'
      ? tr('Хогарт, 1754: «Тот, кто напишет картину без знания перспективы, впадёт в нелепости вроде этих». Здесь их не меньше двух десятков — и это, вероятно, первая намеренно невозможная картинка.')
      : tr('один механизм, три костюма: зрительная система собирает соединения по одному и нигде не проверяет, сходятся ли они.'));
  });
  k.slider('orbit', (v) => { orbit = v; s.draw(); });
  let assets: Record<string, string> = {};
  try { assets = JSON.parse(k.root.dataset.assets ?? '{}'); } catch { assets = {}; }
  if (assets['hogarth-perspective']) {
    const img = new Image();
    img.onload = () => { hogarth = img; s.draw(); };
    img.src = assets['hogarth-perspective'];
  }
});

export const blivet: Mount = demo((k) => {
  let mask = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const x0 = w * 0.14, xm = w * 0.42, x1 = w * 0.86, cy = h / 2;
    const th = h * 0.22;
    const t = th * 0.32;
    /* Шесть линий трёх круглых зубцов. Крайние и обе средние идут через всю фигуру;
       вторая и пятая обрываются посередине. Справа между первой и третьей линией —
       верхний прямоугольный зубец, между четвёртой и шестой — нижний, а полоса между
       третьей и четвёртой, слева бывшая средним зубцом, становится прорезью. */
    const ys = [-th - t, -th + t, -t, t, th - t, th + t].map((y) => cy + y);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ys.forEach((y, i) => {
      ctx.moveTo(x0, y);
      ctx.lineTo(i === 1 || i === 4 ? xm : x1, y);
    });
    /* Торцы прямоугольных зубцов. */
    ctx.moveTo(x1, ys[0]); ctx.lineTo(x1, ys[2]);
    ctx.moveTo(x1, ys[3]); ctx.lineTo(x1, ys[5]);
    ctx.stroke();
    /* Торцы круглых зубцов — эллипсы, как у цилиндров. */
    for (const c of [-th, 0, th]) {
      ctx.beginPath();
      ctx.ellipse(x0, cy + c, t * 0.45, t, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    /* Заслонка ходит от левого края за правый: на 0 и 100 её не видно вовсе. */
    const mw = w * 0.42;
    const mx = -mw / 2 + (mask / 100) * (w + mw);
    ctx.fillStyle = '#6f6f78';
    ctx.fillRect(mx - mw / 2, 0, mw, h);
  });
  k.slider('mask', (v) => {
    mask = v;
    s.draw();
    k.say(v < 6 || v > 94
      ? tr('заслонка убрана: слева три круглых зубца, справа два прямоугольных, а посередине они не сходятся.')
      : tr('под заслонкой каждый конец совершенно связен. Противоречие существует, только пока видно оба.'));
  });
});

export const shepardElephant: Mount = demo((k) => {
  let fix = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bx = w * 0.2, bw = w * 0.6, by = h * 0.12, bh = h * 0.36;
    const top = by + bh * 0.72, ground = h * 0.9;
    /* Восемь одинаковых промежутков под брюхом. Сверху ноги — чётные промежутки
       (заливка тянется от брюха вниз и гаснет к середине), снизу ступни стоят под
       нечётными — под просветами. Линии одни и те же на всю высоту; что между ними
       нога, а что воздух, решает только заливка, и вверху с внизу она решает по-разному. */
    const n = 8;
    const step = (bw * 0.94) / n;
    const lx = bx + bw * 0.03;
    const body = '#9aa0ad';
    const fade = (y0: number, y1: number) => {
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, body);
      g.addColorStop(1, 'rgba(154,160,173,0)');
      return g;
    };
    for (let i = 0; i < n; i += 2) {
      ctx.fillStyle = fade(top, top + (ground - top) * 0.6);
      ctx.fillRect(lx + i * step, by + bh / 2, step, top - by - bh / 2 + (ground - top) * 0.6);
    }
    /* Ступни сдвигаются ползунком: на 0 они под просветами, на 100 — под ногами. */
    const shift = (1 - fix / 100) * step;
    for (let i = 0; i < n; i += 2) {
      const x = lx + i * step + shift;
      ctx.fillStyle = fade(ground, ground - (ground - top) * 0.6);
      ctx.fillRect(x, ground - (ground - top) * 0.6, step, (ground - top) * 0.6);
      ctx.fillStyle = '#6f7682';
      ctx.beginPath();
      ctx.ellipse(x + step / 2, ground, step * 0.62, h * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      ctx.moveTo(lx + i * step, by + bh / 2);
      ctx.lineTo(lx + i * step, ground);
    }
    ctx.stroke();
    /* Туловище кладётся последним и прячет верхние концы линий. */
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('fix', (v) => {
    fix = v;
    s.draw();
    k.say(v > 80 ? tr('ступни встали на свои вертикали, и ноги наконец пересчитываются.') : tr('пересчитайте ноги. Просветы между ними тоже со ступнями.'));
  });
});

export const shapeFromShading: Mount = demo((k) => {
  let dir = 90;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.55);
    ctx.fillRect(0, 0, w, h);
    const cols = 7, rows = 4;
    const cw = w / cols, ch = h / rows;
    const R = Math.min(cw, ch) * 0.38;
    const rad = (dir * Math.PI) / 180;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cx = (c + 0.5) * cw, cy = (r + 0.5) * ch;
        /* Через одну диск затенён в противоположную сторону — половина читается
           бугорками, половина впадинами, и поворот света меняет их местами. */
        const flip = (r + c) % 2 ? 1 : -1;
        const g = ctx.createLinearGradient(cx - R * Math.cos(rad) * flip, cy - R * Math.sin(rad) * flip, cx + R * Math.cos(rad) * flip, cy + R * Math.sin(rad) * flip);
        g.addColorStop(0, grey(0.85));
        g.addColorStop(1, grey(0.28));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
      }
  });
  k.slider('dir', (v) => {
    dir = v;
    s.draw();
    k.say(tr('проведите свет через горизонталь — вся сетка перевернётся разом.'));
  });
});

export const craterIllusion: Mount = demo((k) => {
  let rot = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.4);
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rot * Math.PI) / 180);
    const r = rnd(9);
    /* Собственная поверхность с кратерами: свет всегда падает сверху относительно
       самой поверхности, а поворачивается вся сцена целиком. */
    for (let i = 0; i < 26; i++) {
      const x = (r() - 0.5) * w * 1.2;
      const y = (r() - 0.5) * h * 1.2;
      const R = 10 + r() * Math.min(w, h) * 0.09;
      const g = ctx.createLinearGradient(x, y - R, x, y + R);
      g.addColorStop(0, grey(0.22));
      g.addColorStop(1, grey(0.68));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  k.slider('rot', (v) => {
    rot = v;
    s.draw();
    k.say(v > 120 && v < 240 ? tr('снимок перевёрнут — и кратеры стали холмами. Освещение в самой сцене не менялось.') : '');
  });
});

export const sizeConstancy: Mount = demo((k) => {
  let dist = 50, persp = false, tex = false, shadow = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#e3e6ec';
    ctx.fillRect(0, 0, w, h);
    const hor = h * 0.42;
    /* Честная перспектива: точка пола на расстоянии D стоит на экране на (h − hor)·0.9 / D
       ниже горизонта, предмет на нём в 1/D своего размера. Размер на экране и место
       на полу меняются согласованно — так, как их видит глаз. */
    const floorY = (D: number) => hor + ((h - hor) * 0.9) / D;
    if (persp) {
      ctx.strokeStyle = '#a8b0bd';
      ctx.lineWidth = 2;
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + (sgn * w * 0.5) / 0.9, floorY(0.9));
        ctx.lineTo(w / 2 + (sgn * w * 0.5) / 14, floorY(14));
        ctx.stroke();
      }
    }
    if (tex) {
      /* Поперечные полосы пола через равные полметра глубины: на экране они густеют к горизонту. */
      ctx.fillStyle = '#cdd4de';
      for (let D = 1; D < 14; D += 0.5) ctx.fillRect(0, floorY(D), w, Math.max(1, 3 / D));
    }
    const D = 1 + (dist / 100) * 7;
    const y = floorY(D);
    const bw = (w * 0.1) / D, bh = (h * 0.5) / D;
    if (shadow) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(w / 2, y, bw * 0.9, bh * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = MARK;
    ctx.fillRect(w / 2 - bw / 2, y - bh, bw, bh);
  });
  const upd = () => {
    s.draw();
    k.say(persp || tex || shadow
      ? tr('признаки глубины на месте: предмет уменьшается на экране и остаётся того же размера на вид.')
      : tr('признаков глубины нет — и остаётся только то, что предмет тупо уменьшается. Константность держится на них.'));
  };
  k.check('perspective', (v) => { persp = v; upd(); });
  k.check('texture', (v) => { tex = v; upd(); });
  k.check('shadow', (v) => { shadow = v; upd(); });
  k.slider('dist', (v) => { dist = v; upd(); });
});

export const amesWindow: Mount = demo((k) => {
  let trap = 0, speed = 8, rod = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const a = t * speed * 0.3;
    const hw = Math.min(w, h) * 0.42;
    const p = trap / 100;
    /* Трапеция: левый край выше правого, и при p = 1 она становится прямоугольником. */
    const hL = hw * (0.62 + p * 0.38);
    const hR = hw * (0.3 + p * 0.7);
    /* Чистая ортографическая проекция на уровне глаз: вертикального сдвига по глубине
       нет, иначе он сам подсказывал бы, какой край ближе, и убивал иллюзию. */
    const pt = (x: number, y: number, z = 0): [number, number] => [cx + x * Math.cos(a) + z * Math.sin(a), cy + y];
    const corners = [pt(-hw, -hL), pt(hw, -hR), pt(hw, hR), pt(-hw, hL)];
    ctx.strokeStyle = INK;
    ctx.lineWidth = 8;
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(...pt(0, -(hL + hR) / 2));
    ctx.lineTo(...pt(0, (hL + hR) / 2));
    ctx.stroke();
    if (rod) {
      /* Стержень продет сквозь окно поперёк его плоскости. Он честно крутится по
         кругу вместе с окном, а окно кажется качающимся, — и стержень на глазах
         проходит сквозь раму или гнётся. */
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(...pt(hw * 0.5, -hL * 0.15, -hw * 0.9));
      ctx.lineTo(...pt(hw * 0.5, -hL * 0.15, hw * 0.9));
      ctx.stroke();
    }
  });
  k.slider('trap', (v) => {
    trap = v;
    k.say(v > 90 ? tr('на прямоугольнике иллюзия умирает: качаться нечему.') : tr('окно идёт по кругу с постоянной скоростью, а кажется, что качается.'));
  });
  k.slider('speed', (v) => { speed = v; });
  k.check('rod', (v) => { rod = v; });
  k.loop((now) => { t = now; s.draw(); });
});

export const amesRoom: Mount = demo((k) => {
  let view = 0;
  /* Комната строится в пространстве. Берётся обычная прямоугольная комната и каждая
     её точка сдвигается вдоль луча из смотрового отверстия: P' = P / (1 + c·x). Такое
     преобразование сохраняет плоскости и не меняет ни одного луча, поэтому из
     отверстия новая комната неотличима от старой. При c·W = 1/3 левый дальний угол
     уезжает вдвое дальше правого и становится вдвое выше. */
  const W = 2, FLOOR = -1.6, CEIL = 1.4, Z0 = 4, Z1 = 6, C = 1 / (3 * W);
  const ames = (p: V3): V3 => {
    const f = 1 / (1 + C * p[0]);
    return [p[0] * f, p[1] * f, p[2] * f];
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#efe9dd';
    ctx.fillRect(0, 0, w, h);
    const p = view / 100;
    /* Камера: в отверстии (0,0,0) и смотрит прямо; отходя, поднимается над комнатой и
       смотрит вниз — так клин пола виден целиком. */
    const eye: V3 = [p * 1.5, p * 7, -p * 1.5];
    const at: V3 = [p * -0.8, p * -2, 7 - p * 0.5];
    const fw = [at[0] - eye[0], at[1] - eye[1], at[2] - eye[2]];
    const fl = Math.hypot(...fw);
    const F: V3 = [fw[0] / fl, fw[1] / fl, fw[2] / fl];
    const R0: V3 = [F[2], 0, -F[0]];
    const rl = Math.hypot(...R0);
    const R: V3 = [R0[0] / rl, 0, R0[2] / rl];
    const U: V3 = [F[1] * R[2] - F[2] * R[1], F[2] * R[0] - F[0] * R[2], F[0] * R[1] - F[1] * R[0]];
    const f = w * 0.95;
    const ycen = h / 2 - f * 0.06 * (1 - p);
    const proj = (q: V3): [number, number] => {
      const d = [q[0] - eye[0], q[1] - eye[1], q[2] - eye[2]];
      const x = d[0] * R[0] + d[1] * R[1] + d[2] * R[2];
      const y = d[0] * U[0] + d[1] * U[1] + d[2] * U[2];
      const z = d[0] * F[0] + d[1] * F[1] + d[2] * F[2];
      return [w / 2 + (f * x) / z, ycen - (f * y) / z];
    };
    const depth = (q: V3) => (q[0] - eye[0]) * F[0] + (q[1] - eye[1]) * F[1] + (q[2] - eye[2]) * F[2];
    const quad = (pts: V3[], fill: string) => {
      ctx.beginPath();
      pts.map((q) => proj(ames(q))).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = '#7c715e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    /* Задняя стена с окнами, левая стена, пол в шашку. Шашка — главный выдающий
       признак: из отверстия плитки квадратные, сбоку они расползаются трапециями. */
    quad([[-W, CEIL, Z1], [W, CEIL, Z1], [W, FLOOR, Z1], [-W, FLOOR, Z1]], '#d8cdb8');
    quad([[-W, CEIL, Z0], [-W, CEIL, Z1], [-W, FLOOR, Z1], [-W, FLOOR, Z0]], '#cbbfa6');
    for (const wx of [-1.25, 0.25]) quad([[wx, 0.9, Z1], [wx + 1, 0.9, Z1], [wx + 1, -0.3, Z1], [wx, -0.3, Z1]], '#9fb6c8');
    const nx = 8, nz = 4;
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const x0 = -W + (2 * W * i) / nx, x1 = -W + (2 * W * (i + 1)) / nx;
        const z0 = Z0 + ((Z1 - Z0) * j) / nz, z1 = Z0 + ((Z1 - Z0) * (j + 1)) / nz;
        quad([[x0, FLOOR, z0], [x1, FLOOR, z0], [x1, FLOOR, z1], [x0, FLOOR, z1]], (i + j) % 2 ? '#3c3a36' : '#ece6d8');
      }
    /* Два человека одного роста, 1,7 единицы, стоят вертикально на настоящем полу
       комнаты Эймса — у дальнего левого и у ближнего правого угла. */
    const person = (q: V3) => {
      const feet = ames(q);
      const head: V3 = [feet[0], feet[1] + 1.7, feet[2]];
      const [fx, fy] = proj(feet);
      const [hx, hy] = proj(head);
      const ph = Math.hypot(hx - fx, hy - fy);
      const bw = ph * 0.2;
      ctx.fillStyle = MARK;
      ctx.beginPath();
      ctx.moveTo(fx - bw / 2, fy);
      ctx.lineTo(hx - bw / 2, hy + ph * 0.16);
      ctx.lineTo(hx + bw / 2, hy + ph * 0.16);
      ctx.lineTo(fx + bw / 2, fy);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx, hy + ph * 0.08, ph * 0.08, 0, Math.PI * 2);
      ctx.fill();
    };
    const people: V3[] = [[-1.4, FLOOR, 5.4], [1.4, FLOOR, 5.4]];
    people.sort((a, b) => depth(ames(b)) - depth(ames(a))).forEach(person);
  });
  k.slider('view', (v) => {
    view = v;
    s.draw();
    k.say(v === 0 ? tr('из смотрового отверстия комната выглядит обычной прямоугольной. Люди — нет.') : tr('комната показала себя клином. Люди при этом одного роста и всегда были.'));
  });
});

export const anamorphosis: Mount = demo((k) => {
  let view = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const p = view / 100;
    /* Проекция строится обратным ходом: правильной она бывает ровно из одной точки. */
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.transform(1, 0, (1 - p) * 2.4, 0.25 + p * 0.75, 0, 0);
    ctx.fillStyle = INK;
    /* Кегль подбирается по ширине: в собранном виде слово целиком помещается в холст. */
    const word = tr('ИЛЛЮЗИЯ');
    ctx.font = `bold 100px system-ui, sans-serif`;
    const size = Math.min(Math.min(w, h) * 0.3, (100 * w * 0.9) / ctx.measureText(word).width);
    ctx.font = `bold ${Math.round(size)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, 0, 0);
    ctx.restore();
  });
  k.slider('view', (v) => {
    view = v;
    s.draw();
    k.say(v > 90 ? tr('из этой точки надпись собралась. Отовсюду ещё она бесформенна.') : '');
  });
});

export const peppersGhost: Mount = demo((k) => {
  let glass = 45, ghost = 60, plan = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#16161c';
    ctx.fillRect(0, 0, w, h);
    if (plan) {
      /* Схема сверху. Зритель внизу смотрит вверх, на сцену; актёр спрятан слева, в
         кулисе за стенкой. Стекло под углом к линии взгляда отражает его так, что
         призрак оказывается за стеклом, на сцене. Положение призрака считается
         отражением актёра в линии стекла. */
      const G: [number, number] = [w * 0.6, h * 0.5];
      const R = Math.min(w, h) * 0.3;
      const th = (glass * Math.PI) / 180;
      const d: [number, number] = [Math.sin(th), Math.cos(th)];
      const A: [number, number] = [G[0] - R * 1.25, G[1]];
      const ax = A[0] - G[0], ay = A[1] - G[1];
      const dot = ax * d[0] + ay * d[1];
      const ghostAt: [number, number] = [G[0] + 2 * dot * d[0] - ax, G[1] + 2 * dot * d[1] - ay];
      const viewer: [number, number] = [G[0], h * 0.92];
      ctx.strokeStyle = '#8a8d96';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.42, h * 0.04, w * 0.52, h * 0.7);
      /* Стенка кулисы: из зала актёра не видно. */
      ctx.beginPath();
      ctx.moveTo(w * 0.04, h * 0.74);
      ctx.lineTo(w * 0.42, h * 0.74);
      ctx.stroke();
      ctx.strokeStyle = '#7fd0e0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(G[0] - d[0] * R * 0.7, G[1] - d[1] * R * 0.7);
      ctx.lineTo(G[0] + d[0] * R * 0.7, G[1] + d[1] * R * 0.7);
      ctx.stroke();
      /* Путь луча: от актёра к стеклу, от стекла к зрителю; пунктир — куда зритель
         этот луч продолжает. Точка на стекле — пересечение линии «зритель — призрак». */
      const vx = ghostAt[0] - viewer[0], vy = ghostAt[1] - viewer[1];
      const den = vx * d[1] - vy * d[0];
      const tt = Math.abs(den) > 1e-6 ? ((G[0] - viewer[0]) * d[1] - (G[1] - viewer[1]) * d[0]) / den : 0;
      const hit: [number, number] = [viewer[0] + vx * tt, viewer[1] + vy * tt];
      ctx.strokeStyle = '#e8e8ef';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(...A); ctx.lineTo(...hit); ctx.lineTo(...viewer);
      ctx.stroke();
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(...hit); ctx.lineTo(...ghostAt);
      ctx.stroke();
      ctx.setLineDash([]);
      const dot2 = (pt: [number, number], col: string, alpha = 1) => {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      };
      dot2(A, MARK);
      dot2(ghostAt, '#9fd8e8', Math.max(0.15, ghost / 100));
      dot2(viewer, '#e8e8ef');
      ctx.fillStyle = '#e8e8ef';
      ctx.font = `${Math.round(Math.max(9, Math.min(12, w / 50)))}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(tr('спрятанный актёр'), A[0], A[1] + 24);
      ctx.fillText(tr('призрак'), ghostAt[0], ghostAt[1] - 16);
      ctx.fillText(tr('зритель'), viewer[0], viewer[1] - 16);
      ctx.fillStyle = '#7fd0e0';
      ctx.textAlign = 'left';
      ctx.fillText(tr('стекло'), G[0] - d[0] * R * 0.7 + 8, G[1] - d[1] * R * 0.7);
      return;
    }
    ctx.fillStyle = '#3a4a5c';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = '#d8cdb8';
    ctx.fillRect(w * 0.2, h * 0.32, w * 0.1, h * 0.4);
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.3, w * 0.045, 0, Math.PI * 2);
    ctx.fill();
    /* Отражение в повёрнутом стекле поворачивается на удвоенный угол: на 45° призрак
       стоит прямо, при другом наклоне он заваливается. */
    ctx.save();
    ctx.translate(w * 0.65, h * 0.72);
    ctx.rotate((2 * (glass - 45) * Math.PI) / 180);
    ctx.globalAlpha = ghost / 100;
    ctx.fillStyle = '#9fd8e8';
    ctx.fillRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.4);
    ctx.beginPath();
    ctx.arc(0, -h * 0.42, w * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  const say = () =>
    k.say(ghost < 8 ? tr('свет на спрятанном актёре убран — призрак растаял мгновенно, без люков и дыма.')
      : Math.abs(glass - 45) > 3 ? tr('стекло не под 45°: отражение поворачивается на удвоенный угол, и призрак завалился на {d}°.', { d: Math.abs(2 * (glass - 45)) })
      : '');
  k.slider('glass', (v) => { glass = v; s.draw(); say(); });
  k.slider('ghost', (v) => { ghost = v; s.draw(); say(); });
  k.toggle('plan', (v) => { plan = v; s.draw(); });
});

export const gravityHill: Mount = demo((k) => {
  let slope = -4, tilt = 8, horizon = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#b9d4e8';
    ctx.fillRect(0, 0, w, h);
    const hy = h * 0.3;
    const sl = (slope * Math.PI) / 180;
    /* Настоящий уклон дороги задаётся отдельно от наклона придорожных предметов. */
    ctx.fillStyle = '#7d8f6e';
    ctx.fillRect(0, hy, w, h - hy);
    ctx.fillStyle = '#5c5c63';
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h);
    /* Дальний конец дороги ниже горизонта, если она идёт под уклон (slope < 0), и выше,
       если в гору. На экране y растёт вниз, отсюда минус. */
    const far = hy - Math.tan(sl) * w * 0.3;
    ctx.lineTo(w * 0.45, far);
    ctx.lineTo(w * 0.55, far);
    ctx.lineTo(w * 0.9, h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 4;
    const tl = (tilt * Math.PI) / 180;
    for (let i = 1; i <= 6; i++) {
      const t = i / 7;
      const y = h + (far - h) * t;
      const x = w * 0.1 + (w * 0.35) * t;
      const ht = (1 - t) * h * 0.22 + 10;
      for (const sgn of [-1, 1]) {
        const bx = sgn < 0 ? x : w - x;
        ctx.beginPath();
        ctx.moveTo(bx, y);
        ctx.lineTo(bx + Math.sin(tl) * ht, y - Math.cos(tl) * ht);
        ctx.stroke();
      }
    }
    if (!horizon) {
      /* Горизонт закрыт склоном, но дорогу склон не перекрывает. */
      ctx.fillStyle = '#7d8f6e';
      ctx.fillRect(0, 0, w, Math.min(hy + 4, far));
    }
  });
  const say = () =>
    k.say(horizon
      ? slope < 0 ? tr('горизонт открыт — и стало видно, что дорога идёт под уклон. Настоящий уклон не менялся.')
        : slope > 0 ? tr('горизонт открыт: дорога и правда идёт в гору.') : tr('горизонт открыт: дорога ровная.')
      : slope < 0 ? tr('горизонта не видно, и уклон оценивается по наклонённым деревьям. Спуск читается подъёмом.') : '');
  k.slider('slope', (v) => { slope = v; s.draw(); say(); });
  k.slider('tilt', (v) => { tilt = v; s.draw(); });
  k.toggle('horizon', (v) => { horizon = v; s.draw(); say(); });
});

export const hybridImage: Mount = demo((k) => {
  let cut = 12, zoom = 100;
  let A: HTMLImageElement | null = null, B: HTMLImageElement | null = null;
  let mixed: HTMLCanvasElement | null = null, mixedCut = -1;
  /* Кадр — портрет Кюри целиком (520 × 752). Чехов подгоняется к нему по зрачкам:
     у Кюри они в (140, 395) и (335, 395) px, у Чехова в (96, 215) и (155, 195) — голова
     наклонена, поэтому снимок поворачивается, а не только масштабируется. */
  const CW = 520, CH = 752;
  const toCurie = (x: CanvasRenderingContext2D) => {
    const [px, py, qx, qy] = [155 - 96, 195 - 215, 335 - 140, 0];
    const sc = Math.hypot(qx, qy) / Math.hypot(px, py);
    x.translate(140, 395);
    x.rotate(Math.atan2(qy, qx) - Math.atan2(py, px));
    x.scale(sc, sc);
    x.translate(-96, -215);
  };
  const grab = (img: HTMLImageElement, place: ((x: CanvasRenderingContext2D) => void) | null, sigma: number) => {
    const c = document.createElement('canvas');
    c.width = CW;
    c.height = CH;
    const x = c.getContext('2d', { willReadFrequently: true })!;
    x.fillStyle = '#808080';
    x.fillRect(0, 0, CW, CH);
    x.filter = sigma ? `grayscale(1) blur(${sigma}px)` : 'grayscale(1)';
    if (place) place(x);
    x.drawImage(img, 0, 0);
    return x.getImageData(0, 0, CW, CH).data;
  };
  /* Своя сборка, как у Шинса и Оливы: низкие частоты одного снимка плюс высокие
     другого. Срез задан в периодах на ширину кадра; гауссово размытие с σ = ширина /
     (2π · срез) срезает всё, что мельче. Низкие частоты — Чехов, высокие — Кюри. */
  const build = () => {
    if (!A || !B) return null;
    if (mixed && mixedCut === cut) return mixed;
    const sigma = CW / (2 * Math.PI * cut);
    const low = grab(A, toCurie, sigma);
    const b = grab(B, null, 0);
    const lowB = grab(B, null, sigma);
    const c = mixed ?? document.createElement('canvas');
    c.width = CW;
    c.height = CH;
    const x = c.getContext('2d')!;
    const out = x.createImageData(CW, CH);
    for (let i = 0; i < out.data.length; i += 4) {
      const v = low[i] + (b[i] - lowB[i]);
      out.data[i] = out.data[i + 1] = out.data[i + 2] = Math.max(0, Math.min(255, v));
      out.data[i + 3] = 255;
    }
    x.putImageData(out, 0, 0);
    mixed = c;
    mixedCut = cut;
    return c;
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const c = build();
    if (!c) return;
    /* Отход заменяет уменьшение: картинка сжимается со сглаживанием, и мелкий
       рисунок теряется так же, как с расстояния. */
    const sc = Math.min(w / CW, h / CH) * 0.96 * (zoom / 100);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(c, (w - CW * sc) / 2, (h - CH * sc) / 2, CW * sc, CH * sc);
  });
  const say = () =>
    k.say(zoom < 30 ? tr('мелкий рисунок уже не различим — остались только низкие частоты, а в них Чехов.')
      : zoom > 70 ? tr('вблизи главное — мелкий рисунок, высокие частоты: это Кюри. Уменьшите картинку или отойдите от экрана.') : '');
  k.slider('cut', (v) => { cut = v; s.draw(); say(); });
  k.slider('zoom', (v) => { zoom = v; s.draw(); say(); });
  const src = (() => { try { return JSON.parse(k.root.dataset.assets ?? '{}'); } catch { return {}; } })() as Record<string, string>;
  const load = (u: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = u; });
  if (src['face-chekhov'] && src['face-curie'])
    Promise.all([load(src['face-chekhov']), load(src['face-curie'])]).then(([a, b]) => { A = a; B = b; s.draw(); });
});
