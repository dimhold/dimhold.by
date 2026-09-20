/* Глубина, перспектива и невозможные фигуры.
   Невозможные объекты строятся здесь настоящей разомкнутой геометрией: они проецируются
   в знакомую фигуру ровно с одного направления, а при отводе камеры разваливаются. В
   этом весь смысл — фигура не становится ложью, пока вы не сдвинулись. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

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
  const depth = (f: number[]) => f.reduce((acc, ci) => acc + rot(corners[ci], yaw)[2], 0) / f.length;
  const shade = ['#dcbf85', '#c9a86a', '#a8843f'];
  [...faces].sort((x, y) => depth(y[0]) - depth(x[0])).forEach(([f, side]) => {
    ctx.beginPath();
    f.forEach((ci, n) => {
      const r = rot(corners[ci], yaw);
      const y1 = r[1] * Math.cos(ISO_PITCH) - r[2] * Math.sin(ISO_PITCH);
      const x = cx + r[0] * scale;
      const y = cy - y1 * scale;
      n ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = tint === 'dim' ? shade[side] : shade[side];
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
  const sc = scale * 0.62;
  const centre = rot([L / 2, L / 2, L / 2], yaw);
  const ox = cx - centre[0] * sc;
  const oy = cy + (centre[1] * Math.cos(ISO_PITCH) - centre[2] * Math.sin(ISO_PITCH)) * sc;
  /* Порядок рисования — единственное, что прячет разрыв: конец третьего бруска
     уходит под первый. */
  box(ctx, [L, L, 0], 2, L, w, yaw, sc, ox, oy, '');
  box(ctx, [L, 0, 0], 1, L, w, yaw, sc, ox, oy, '');
  box(ctx, [-w / 2, 0, 0], 0, L + w / 2, w, yaw, sc, ox, oy, '');
};

const stairsGeom = (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => {
  /* Лестница уложена по тому же кольцу, что и трибар: три марша вдоль трёх осей.
     Кольцо замыкается в проекции, поэтому и обход по ступеням возвращается на
     исходную площадку — в проекции, а не в пространстве. */
  const L = 1.5;
  const w = 0.3;
  const n = 5;
  const sc = scale * 0.62;
  const centre = rot([L / 2, L / 2, L / 2], yaw);
  const ox = cx - centre[0] * sc;
  const oy = cy + (centre[1] * Math.cos(ISO_PITCH) - centre[2] * Math.sin(ISO_PITCH)) * sc;
  const legs: [V3, 0 | 1 | 2][] = [
    [[L, L, 0], 2],
    [[L, 0, 0], 1],
    [[0, 0, 0], 0],
  ];
  /* Марши рисуются от дальнего к ближнему: разрыв уходит под первый. */
  for (const [start, axis] of legs)
    for (let i = n - 1; i >= 0; i--) {
      const step = ((i + 0.5) * L) / n;
      const p: V3 = [start[0], start[1], start[2]];
      p[axis] += step;
      box(ctx, p, axis, L / n, w, yaw, sc, ox, oy, '');
    }
};

const cubeGeom = (ctx: CanvasRenderingContext2D, yaw: number, scale: number, cx: number, cy: number) => {
  /* Каркасный куб из двенадцати брусков. Два из них нарисованы вне очереди: их
     перекрытие противоречит остальным десяти, и каждое по отдельности безупречно. */
  const L = 1.4;
  const w = 0.1;
  const sc = scale * 0.7;
  const ox = cx;
  const oy = cy + sc * 0.2;
  const edges: [V3, 0 | 1 | 2][] = [];
  for (const y of [0, L]) for (const z of [0, L]) edges.push([[0, y, z], 0]);
  for (const x of [0, L]) for (const z of [0, L]) edges.push([[x, 0, z], 1]);
  for (const x of [0, L]) for (const y of [0, L]) edges.push([[x, y, 0], 2]);
  const centred = edges.map(([p, ax]) => [[p[0] - L / 2, p[1] - L / 2, p[2] - L / 2] as V3, ax] as const);
  const order = centred
    .map((e, i) => [e, i] as const)
    .sort((p, q) => rot(q[0][0], yaw)[2] - rot(p[0][0], yaw)[2]);
  for (const [[p, ax], i] of order) {
    if (i === 4 || i === 9) continue;
    box(ctx, p, ax, L + w, w, yaw, sc, ox, oy, '');
  }
  for (const i of [4, 9]) {
    const [p, ax] = centred[i];
    box(ctx, p, ax, L + w, w, yaw, sc, ox, oy, '');
  }
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
      k.say(v === 0 ? hint : v > 25 ? 'камера отведена — и фигура развалилась. Она была разомкнута всё это время.' : '');
    });
  });

export const penroseTriangle = orbitDemo(tribar, 'кольцо замкнуто и невозможно. Отведите камеру.');
export const penroseStairs = orbitDemo(stairsGeom, 'лестница поднимается через круг и приходит на исходную площадку.');
export const impossibleCube = orbitDemo(cubeGeom, 'рёбра пересекаются так, как у куба не бывает.');

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
      ? 'Хогарт, 1754: «Тот, кто напишет картину без знания перспективы, впадёт в нелепости вроде этих». Здесь их не меньше двух десятков — и это, вероятно, первая намеренно невозможная картинка.'
      : 'один механизм, три костюма: зрительная система собирает соединения по одному и нигде не проверяет, сходятся ли они.');
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
  let mask = 50;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const x0 = w * 0.1, x1 = w * 0.9, cy = h / 2;
    const th = h * 0.16;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    /* Слева три круглых зубца, справа два прямоугольных: перейти от одного к другому
       по контуру невозможно, и каждый конец по отдельности безупречен. */
    for (let i = -1; i <= 1; i++) {
      const y = cy + i * th;
      ctx.beginPath();
      ctx.moveTo(x0, y - th * 0.28);
      ctx.lineTo(w * 0.45, y - th * 0.28);
      ctx.moveTo(x0, y + th * 0.28);
      ctx.lineTo(w * 0.45, y + th * 0.28);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x0, y, th * 0.28, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.rect(w * 0.55, cy - th * 1.3, x1 - w * 0.55, th * 1.1);
    ctx.rect(w * 0.55, cy + th * 0.2, x1 - w * 0.55, th * 1.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.45, cy - th * 1.3);
    ctx.lineTo(w * 0.55, cy - th * 1.3);
    ctx.moveTo(w * 0.45, cy + th * 1.3);
    ctx.lineTo(w * 0.55, cy + th * 1.3);
    ctx.stroke();
    const mx = (mask / 100) * w;
    ctx.fillStyle = '#6f6f78';
    ctx.fillRect(mx - w * 0.06, 0, w * 0.12, h);
  });
  k.slider('mask', (v) => {
    mask = v;
    s.draw();
    k.say('под заслонкой каждый конец совершенно связен. Противоречие существует, только пока видно оба.');
  });
});

export const shepardElephant: Mount = demo((k) => {
  let fix = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bx = w * 0.2, bw = w * 0.6, by = h * 0.28, bh = h * 0.3;
    ctx.fillStyle = '#9aa0ad';
    ctx.beginPath();
    ctx.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    /* Ступни стоят не на тех вертикалях: просветы между ногами тоже получают ступни. */
    const legs = 5;
    const legW = bw / (legs * 2 - 1);
    for (let i = 0; i < legs; i++) {
      const xTop = bx + i * legW * 2;
      const xBot = xTop + ((fix / 100) * legW);
      ctx.fillStyle = '#9aa0ad';
      ctx.beginPath();
      ctx.moveTo(xTop, by + bh * 0.8);
      ctx.lineTo(xTop + legW, by + bh * 0.8);
      ctx.lineTo(xBot + legW, h * 0.88);
      ctx.lineTo(xBot, h * 0.88);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#6f7682';
      ctx.beginPath();
      ctx.ellipse(xBot + legW / 2, h * 0.88, legW * 0.6, h * 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('fix', (v) => {
    fix = v;
    s.draw();
    k.say(v > 80 ? 'ступни встали на свои вертикали, и ноги наконец пересчитываются.' : 'пересчитайте ноги. Просветы между ними тоже со ступнями.');
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
    k.say('проведите свет через горизонталь — вся сетка перевернётся разом.');
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
    k.say(v > 120 && v < 240 ? 'снимок перевёрнут — и кратеры стали холмами. Освещение в самой сцене не менялось.' : '');
  });
});

export const sizeConstancy: Mount = demo((k) => {
  let dist = 50, persp = false, tex = false, shadow = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#e3e6ec';
    ctx.fillRect(0, 0, w, h);
    const hor = h * 0.42;
    if (persp) {
      ctx.strokeStyle = '#a8b0bd';
      ctx.lineWidth = 2;
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + sgn * w * 0.5, h);
        ctx.lineTo(w / 2 + sgn * w * 0.04, hor);
        ctx.stroke();
      }
    }
    if (tex) {
      ctx.fillStyle = '#cdd4de';
      for (let i = 1; i < 14; i++) {
        const t = i / 14;
        const y = hor + (h - hor) * t * t;
        ctx.fillRect(0, y, w, 2);
      }
    }
    const t = dist / 100;
    const y = hor + (h - hor) * (1 - t) * (1 - t) + 20;
    const scale = 1 - t * 0.78;
    const bw = w * 0.1 * scale, bh = h * 0.28 * scale;
    if (shadow) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.ellipse(w / 2, y, bw * 0.9, bh * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = MARK;
    ctx.fillRect(w / 2 - bw / 2, y - bh, bw, bh);
  });
  const upd = () => { s.draw(); };
  k.check('perspective', (v) => { persp = v; upd(); });
  k.check('texture', (v) => { tex = v; upd(); });
  k.check('shadow', (v) => { shadow = v; upd(); });
  k.slider('dist', (v) => {
    dist = v;
    upd();
    k.say(persp || tex || shadow
      ? 'признаки глубины на месте: предмет уменьшается на экране и остаётся того же размера на вид.'
      : 'признаков глубины нет — и остаётся только то, что предмет тупо уменьшается. Константность держится на них.');
  });
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
    const pt = (x: number, y: number): [number, number] => [cx + x * Math.cos(a), cy + y - x * Math.sin(a) * 0.25];
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
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(...pt(-hw * 1.4, 0));
      ctx.lineTo(...pt(hw * 1.4, 0));
      ctx.stroke();
    }
  });
  k.slider('trap', (v) => {
    trap = v;
    k.say(v > 90 ? 'на прямоугольнике иллюзия умирает: качаться нечему.' : 'окно идёт по кругу с постоянной скоростью, а кажется, что качается.');
  });
  k.slider('speed', (v) => { speed = v; });
  k.check('rod', (v) => { rod = v; });
  k.loop((now) => { t = now; s.draw(); });
});

export const amesRoom: Mount = demo((k) => {
  let view = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#efe9dd';
    ctx.fillRect(0, 0, w, h);
    const p = view / 100;
    /* Комната трапециевидная: дальний угол вдвое дальше и вдвое выше. С точки
       наблюдения она проецируется как прямоугольная; отход раскрывает клин. */
    const lx = w * 0.1 + p * w * 0.06;
    const rx = w * 0.9;
    const lyTop = h * 0.12;
    const lyBot = h * 0.88;
    const ryTop = h * (0.12 + p * 0.16);
    const ryBot = h * (0.88 - p * 0.16);
    ctx.fillStyle = '#d8cdb8';
    ctx.beginPath();
    ctx.moveTo(lx, lyTop); ctx.lineTo(rx, ryTop); ctx.lineTo(rx, ryBot); ctx.lineTo(lx, lyBot);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9c917c';
    ctx.lineWidth = 2;
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      ctx.beginPath();
      ctx.moveTo(lx + (rx - lx) * t, lyTop + (ryTop - lyTop) * t);
      ctx.lineTo(lx + (rx - lx) * t, lyBot + (ryBot - lyBot) * t);
      ctx.stroke();
    }
    /* Два человека одного роста в мировых единицах. */
    const person = (t: number) => {
      const yTop = lyTop + (ryTop - lyTop) * t;
      const yBot = lyBot + (ryBot - lyBot) * t;
      const x = lx + (rx - lx) * t;
      const scale = (yBot - yTop) / (lyBot - lyTop);
      const ph = (lyBot - lyTop) * 0.55 * scale;
      ctx.fillStyle = MARK;
      ctx.fillRect(x - 10 * scale, yBot - ph, 20 * scale, ph);
      ctx.beginPath();
      ctx.arc(x, yBot - ph - 12 * scale, 12 * scale, 0, Math.PI * 2);
      ctx.fill();
    };
    person(0.12);
    person(0.86);
  });
  k.slider('view', (v) => {
    view = v;
    s.draw();
    k.say(v === 0 ? 'из смотрового отверстия комната выглядит обычной прямоугольной. Люди — нет.' : 'комната показала себя клином. Люди при этом одного роста и всегда были.');
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
    ctx.font = `bold ${Math.round(Math.min(w, h) * 0.3)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ИЛЛЮЗИЯ', 0, 0);
    ctx.restore();
  });
  k.slider('view', (v) => {
    view = v;
    s.draw();
    k.say(v > 90 ? 'из этой точки надпись собралась. Отовсюду ещё она бесформенна.' : '');
  });
});

export const peppersGhost: Mount = demo((k) => {
  let glass = 45, ghost = 60, plan = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#16161c';
    ctx.fillRect(0, 0, w, h);
    if (plan) {
      /* Схема сверху — то, от чего всё становится понятно. */
      ctx.strokeStyle = '#8a8d96';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(w * 0.1, h * 0.15, w * 0.8, h * 0.5);
      ctx.stroke();
      const a = (glass * Math.PI) / 180;
      ctx.strokeStyle = '#7fd0e0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - Math.cos(a) * w * 0.2, h * 0.4 - Math.sin(a) * w * 0.2);
      ctx.lineTo(w * 0.5 + Math.cos(a) * w * 0.2, h * 0.4 + Math.sin(a) * w * 0.2);
      ctx.stroke();
      ctx.fillStyle = MARK;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.75, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8e8ef';
      ctx.font = '12px ui-monospace, monospace';
      ctx.fillText('спрятанный актёр внизу, стекло под углом, зритель слева', w * 0.1, h * 0.85);
      return;
    }
    ctx.fillStyle = '#3a4a5c';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = '#d8cdb8';
    ctx.fillRect(w * 0.2, h * 0.32, w * 0.1, h * 0.4);
    ctx.beginPath();
    ctx.arc(w * 0.25, h * 0.3, w * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = ghost / 100;
    ctx.fillStyle = '#9fd8e8';
    ctx.fillRect(w * 0.6, h * 0.32, w * 0.1, h * 0.4);
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.3, w * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  k.slider('glass', (v) => { glass = v; s.draw(); });
  k.slider('ghost', (v) => {
    ghost = v;
    s.draw();
    k.say(v < 8 ? 'свет на спрятанном актёре убран — призрак растаял мгновенно, без люков и дыма.' : '');
  });
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
    ctx.lineTo(w * 0.45, hy + Math.tan(sl) * w * 0.3);
    ctx.lineTo(w * 0.55, hy + Math.tan(sl) * w * 0.3);
    ctx.lineTo(w * 0.9, h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 4;
    const tl = (tilt * Math.PI) / 180;
    for (let i = 1; i <= 6; i++) {
      const t = i / 7;
      const y = h + (hy + Math.tan(sl) * w * 0.3 - h) * t;
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
      ctx.fillStyle = '#7d8f6e';
      ctx.fillRect(0, 0, w, hy + 4);
    }
  });
  k.slider('slope', (v) => { slope = v; s.draw(); });
  k.slider('tilt', (v) => { tilt = v; s.draw(); });
  k.toggle('horizon', (v) => {
    horizon = v;
    s.draw();
    k.say(v ? 'горизонт открыт — и стало видно, что дорога идёт под уклон. Настоящий уклон не менялся.' : 'горизонта не видно, и уклон оценивается по наклонённым деревьям. Спуск читается подъёмом.');
  });
});

export const hybridImage: Mount = demo((k) => {
  let cut = 12, zoom = 100;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, 0, w, h);
    const z = zoom / 100;
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.38 * z;
    /* Низкие частоты — крупное пятно, высокие — мелкая решётка. Отход обрезает
       высокие, и остаётся вторая картинка. */
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, grey(0.75));
    g.addColorStop(1, grey(0.5));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    const period = Math.max(2, (40 / cut) * z);
    ctx.globalAlpha = Math.min(1, z * 1.6);
    for (let y = cy - R; y < cy + R; y += period * 2) {
      ctx.fillStyle = grey(0.28);
      ctx.fillRect(cx - R, y, R * 2, period);
    }
    ctx.globalAlpha = 1;
  });
  k.slider('cut', (v) => { cut = v; s.draw(); });
  k.slider('zoom', (v) => {
    zoom = v;
    s.draw();
    k.say(v < 30 ? 'высокие частоты уже не различимы — осталась только низкочастотная картинка.' : 'вблизи видна решётка, она же высокие частоты.');
  });
});
