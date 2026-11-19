/* Размер и длина. Во всех этих демонстрациях спорные величины выводятся из одной
   переменной: равенство по построению, а не по обещанию. */
import { demo, grey, INK, MARK, PAPER, plural, type Mount } from '../kit';
import { tr } from '../i18n';

export const muellerLyer: Mount = demo((k) => {
  let theta = 45;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const L = Math.min(w * 0.56, 420);
    /* Поперечные наконечники верхней и нижней фигуры не должны сойтись по вертикали. */
    const F = Math.min(L * 0.24, h * 0.17);
    const x0 = (w - L) / 2;
    const x1 = x0 + L;
    /* Угол отсчитывается от поперечного положения: на нуле обе фигуры одинаковые «|—|»,
       и сравнивать нечего. Если считать от отрезка, на нуле оперение ложится не на
       отрезок, а на его продолжение и удлиняет нижнюю линию на самом деле. */
    const rad = (theta * Math.PI) / 180;
    const dx = F * Math.sin(rad);
    const dy = F * Math.cos(rad);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    /* d = +1 — наконечники загнуты внутрь, как остриё стрелы: отрезок кажется короче.
       d = −1 — наружу, как оперение: кажется длиннее. */
    const shaft = (y: number, d: number) => {
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      for (const [x, side] of [[x0, 1], [x1, -1]] as const)
        for (const up of [-1, 1]) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + side * d * dx, y + up * dy);
        }
      ctx.stroke();
    };
    shaft(h * 0.34, 1);
    shaft(h * 0.72, -1);
    if (ruler) {
      ctx.save();
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      for (const x of [x0, x1]) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.2);
        ctx.lineTo(x, h * 0.86);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
  k.slider('angle', (v) => {
    theta = v;
    s.draw();
    k.say(v === 0 ? tr('угол 0° — наконечники встали поперёк, фигуры одинаковые, и разницы больше нет. Вот это и есть проверка.') : tr('угол {v}°. Оба отрезка по-прежнему одной длины.', { v }));
  });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? tr('убрать линейку') : tr('приложить линейку');
    s.draw();
  });
});

export const ponzo: Mount = demo((k) => {
  let deg = 16;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const halfBottom = w * 0.34;
    /* Подпись в градусах честная: угол между рельсами ровно deg, по deg/2 на каждый. */
    const halfTop = halfBottom - Math.tan((deg * Math.PI) / 360) * h * 0.88;
    ctx.strokeStyle = '#8a8d96';
    ctx.lineWidth = 2.5;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + sgn * halfBottom, h * 0.94);
      ctx.lineTo(cx + sgn * halfTop, h * 0.06);
      ctx.stroke();
    }
    /* Длина одна переменная на оба отрезка; верхний почти упирается в рельсы. */
    const L = 2 * halfTop * 0.92;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    /* Обе на половине пикселя: сглаживание у концов одинаковое, и линейка в пикселях
       показывает ровно одну длину. */
    for (const y of [Math.round(h * 0.26) + 0.5, Math.round(h * 0.74) + 0.5]) {
      ctx.beginPath();
      ctx.moveTo(cx - L / 2, y);
      ctx.lineTo(cx + L / 2, y);
      ctx.stroke();
    }
  });
  k.slider('deg', (v) => {
    deg = v;
    s.draw();
    k.say(v === 0 ? tr('рельсы параллельны — перспективы нет, и отрезки наконец выглядят одинаковыми.') : tr('схождение {v}°. Длина у обоих — одна и та же переменная.', { v }));
  });
});

const ring = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, n: number, rr: number, dist: number) => {
  ctx.fillStyle = '#b9bcc4';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(cx + dist * Math.cos(a), cy + dist * Math.sin(a), rr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = MARK;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
};

export const ebbinghaus: Mount = demo((k) => {
  const REF = 30;
  let mine = 44;
  let reveal = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cy = h * 0.5;
    /* На узком экране вся картинка ужимается одним множителем: отношение кругов,
       по которому считается промах, от этого не меняется. */
    const u = Math.min(1, h / 290, w / 520);
    ring(ctx, w * 0.28, cy, REF * u, 6, 46 * u, 92 * u);
    /* Мелкие соседи держатся на одном зазоре от края круга, какой бы размер ни выставили:
       иначе на больших значениях круг наезжает на них. */
    ring(ctx, w * 0.72, cy, mine * u, 7, 15 * u, (mine + 20) * u);
    if (reveal) {
      ctx.strokeStyle = INK;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      for (const [cx, r] of [[w * 0.28, mine], [w * 0.72, REF]] as const) {
        ctx.beginPath();
        ctx.arc(cx, cy, r * u, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  });
  const btn = k.button('check', (el) => {
    reveal = !reveal;
    el.textContent = reveal ? tr('скрыть ответ') : tr('проверить');
    s.draw();
    if (!reveal) return;
    const err = ((mine - REF) / REF) * 100;
    const a = Math.abs(err).toFixed(0);
    /* Круг среди мелких соседей кажется крупнее, поэтому подгоняют его обычно меньше эталона. */
    k.say(Math.abs(err) < 3
      ? tr('промах {a} % — вы попали. Это бывает: иллюзия сильна не у всех одинаково.', { a })
      : err < 0
        ? tr('вы сделали правый круг на {a} % меньше эталона. Соседи у него мелкие, и он казался больше, чем есть.', { a })
        : tr('вы сделали правый круг на {a} % больше эталона — необычное направление.', { a }));
  });
  k.slider('mine', (v) => {
    mine = v;
    reveal = false;
    if (btn) btn.textContent = tr('проверить');
    k.say('');
    s.draw();
  });
});

export const delboeuf: Mount = demo((k) => {
  const R = 40;
  let ringR = 56;
  let show = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cy = h / 2;
    /* Самое большое кольцо должно влезть в холст. На узком экране всё ужимается одним
       множителем: отношение кольца к диску, от которого и зависит эффект, не меняется. */
    const u = Math.min(1, (h / 2 - 6) / 120, (w * 0.3 - 6) / 120);
    const xs = [w * 0.3, w * 0.7];
    /* Слева эталон без кольца, справа тот же диск в кольце. */
    ctx.fillStyle = MARK;
    for (const x of xs) {
      ctx.beginPath();
      ctx.arc(x, cy, R * u, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xs[1], cy, ringR * u, 0, Math.PI * 2);
    ctx.stroke();
    if (show) {
      /* Эталон — пунктирный контур настоящего размера на обоих дисках и две общие
         касательные: верх и низ обоих дисков лежат на одних прямых. */
      ctx.save();
      ctx.strokeStyle = '#3f6c48';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (const y of [cy - R * u, cy + R * u]) {
        ctx.moveTo(xs[0] - R * u - 24, y);
        ctx.lineTo(xs[1] + R * u + 24, y);
      }
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      for (const x of xs) {
        ctx.beginPath();
        ctx.arc(x, cy, R * u, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
  k.slider('ring', (v) => {
    ringR = v;
    s.draw();
    k.say(v <= R * 1.6 ? tr('кольцо вплотную — диск кажется крупнее.') : v > 90 ? tr('кольцо далеко — диск кажется мельче. Это та же тарелка, только большая.') : '');
  });
  k.button('check', (el) => {
    show = !show;
    el.textContent = show ? tr('убрать эталон') : tr('показать эталон');
    s.draw();
  });
});

export const jastrow: Mount = demo((k) => {
  /* Детали перетаскиваются. Сдвиг каждой хранится в долях холста, чтобы пережить
     перерисовку при смене ширины. Форма одна на обе — R, r и углы общие. */
  const off = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  let R = 0;
  let r = 0;
  let home = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  let W = 1;
  let H = 1;
  let top = 1;
  const A0 = Math.PI * 1.15;
  const A1 = Math.PI * 1.85;
  const at = (i: number) => ({ x: home[i].x + off[i].x * W, y: home[i].y + off[i].y * H });
  const same = () => {
    const a = at(0), b = at(1);
    return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Нижняя деталь стоит под верхней так, что короткая внутренняя дуга верхней
       приходится напротив длинной внешней дуги нижней. Высота пары — 1,17 R. */
    R = Math.min(w * 0.36, (h * 0.86) / 1.17);
    r = R * 0.72;
    W = w;
    H = h;
    const y = (h - 1.17 * R) / 2 + R;
    home = [{ x: w / 2, y }, { x: w / 2, y: y + R * 0.5 }];
    const seg = (i: number, fill: string) => {
      const p = at(i);
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, A0, A1);
      ctx.arc(p.x, p.y, r, A1, A0, true);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };
    const order = top === 0 ? [1, 0] : [0, 1];
    for (const i of order) seg(i, i === 0 ? '#5e7a95' : same() ? 'rgba(210,72,63,0.55)' : MARK);
  });
  const hit = (x: number, y: number) => {
    for (const i of top === 0 ? [0, 1] : [1, 0]) {
      const p = at(i);
      const d = Math.hypot(x - p.x, y - p.y);
      const a = Math.atan2(y - p.y, x - p.x);
      if (d >= r && d <= R && a >= A0 - Math.PI * 2 && a <= A1 - Math.PI * 2) return i;
    }
    return -1;
  };
  const tell = () => k.say(same() ? tr('совпали до пикселя. Оба сегмента рисуются одной функцией из одних и тех же чисел.') : '');
  const btn = k.button('stack', (el) => {
    const stacked = !same();
    if (stacked) {
      off[0] = { x: 0, y: 0 };
      off[1] = { x: 0, y: (home[0].y - home[1].y) / H };
    } else {
      off[0] = { x: 0, y: 0 };
      off[1] = { x: 0, y: 0 };
    }
    el.textContent = stacked ? tr('развести') : tr('наложить друг на друга');
    s.draw();
    tell();
  });
  const canvas = k.root.querySelector<HTMLCanvasElement>('[data-canvas]');
  if (!canvas) return;
  canvas.style.touchAction = 'none';
  let drag = -1;
  let gx = 0;
  let gy = 0;
  canvas.addEventListener('pointerdown', (ev) => {
    drag = hit(ev.offsetX, ev.offsetY);
    if (drag < 0) return;
    top = drag;
    const p = at(drag);
    gx = ev.offsetX - p.x;
    gy = ev.offsetY - p.y;
    canvas.setPointerCapture(ev.pointerId);
    canvas.style.cursor = 'grabbing';
    s.draw();
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (drag < 0) {
      canvas.style.cursor = hit(ev.offsetX, ev.offsetY) >= 0 ? 'grab' : '';
      return;
    }
    /* Центр не уводится за холст: деталь всегда можно поймать снова. */
    const x = Math.max(0, Math.min(W, ev.offsetX - gx));
    const y = Math.max(R * 0.4, Math.min(H + R * 0.3, ev.offsetY - gy));
    off[drag] = { x: (x - home[drag].x) / W, y: (y - home[drag].y) / H };
    s.draw();
  });
  const drop = () => {
    if (drag < 0) return;
    /* Ближе восьми пикселей — примагничивается: точное совпадение рукой не попасть. */
    const o = 1 - drag;
    const a = at(drag), b = at(o);
    if (Math.hypot(a.x - b.x, a.y - b.y) < 8) off[drag] = { x: off[o].x + (home[o].x - home[drag].x) / W, y: off[o].y + (home[o].y - home[drag].y) / H };
    drag = -1;
    canvas.style.cursor = '';
    if (btn) btn.textContent = same() ? tr('развести') : tr('наложить друг на друга');
    s.draw();
    tell();
  };
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
});

export const oppelKundt: Mount = demo((k) => {
  let ticks = 16;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const L = w * 0.36;
    const x0 = w * 0.1;
    const y = h * 0.45;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x0 + L * 2, y);
    ctx.stroke();
    for (const x of [x0, x0 + L, x0 + L * 2]) {
      ctx.beginPath();
      ctx.moveTo(x, y - 16);
      ctx.lineTo(x, y + 16);
      ctx.stroke();
    }
    /* Ровно столько штрихов, сколько написано у ползунка: ticks штук делят половину
       на ticks + 1 равных промежутков. */
    ctx.lineWidth = 1.5;
    for (let i = 1; i <= ticks; i++) {
      const x = x0 + (L * i) / (ticks + 1);
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
    }
    if (ruler) {
      /* Две одинаковые мерки с засечками, каждая под своей половиной. */
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 3;
      const yy = y + 36;
      for (const [a, b] of [[x0, x0 + L], [x0 + L, x0 + L * 2]] as const) {
        ctx.beginPath();
        ctx.moveTo(a + 3, yy);
        ctx.lineTo(b - 3, yy);
        ctx.moveTo(a + 3, yy - 7);
        ctx.lineTo(a + 3, yy + 7);
        ctx.moveTo(b - 3, yy - 7);
        ctx.lineTo(b - 3, yy + 7);
        ctx.stroke();
      }
    }
  });
  k.slider('ticks', (v) => {
    ticks = v;
    s.draw();
    k.say(v === 0 ? tr('штрихов нет — половины равны и выглядят равными.') : tr('{count}. Длина половин не менялась ни разу.', { count: plural(v, tr('{n} штрих'), tr('{n} штриха'), tr('{n} штрихов')) }));
  });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? tr('убрать линейку') : tr('приложить линейку');
    s.draw();
  });
});

export const sander: Mount = demo((k) => {
  let shear = 35;
  let rot = 0;
  let anim = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Обе диагонали выходят из нижнего конца перегородки E и идут в верхние углы D и C,
       а E стоит ровно под серединой DC: |DE| = |EC| при любом наклоне. Высота фигуры
       от наклона не зависит — ползунок меняет только сдвиг, — и подобрана так, чтобы
       и на 60° всё уместилось по ширине. */
    const half = (w * 0.92) / 2.85;
    const H = Math.min(h * 0.8, (half * 0.85) / Math.tan(Math.PI / 3));
    const dx = Math.tan((shear * Math.PI) / 180) * H;
    const y0 = (h - H) / 2;
    const y1 = y0 + H;
    const ex = (w - 2 * half - dx) / 2 + half + dx;
    const D = [ex - half, y0], C = [ex + half, y0], E = [ex, y1];
    const A = [D[0] - dx, y1], B = [C[0] - dx, y1], F = [ex + dx, y0];
    ctx.strokeStyle = '#8a8d96';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (const [i, p] of [A, B, C, D].entries()) (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.closePath();
    ctx.moveTo(E[0], E[1]);
    ctx.lineTo(F[0], F[1]);
    ctx.stroke();
    /* Длина одна на обе диагонали; вторая — тот же отрезок под своим углом. Кнопка
       поворачивает её вокруг E до первой. */
    const len = Math.hypot(half, H);
    const aL = Math.atan2(D[1] - E[1], D[0] - E[0]);
    const aR = Math.atan2(C[1] - E[1], C[0] - E[0]);
    const a = aR + (aL - aR) * rot;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(E[0], E[1]);
    ctx.lineTo(E[0] + len * Math.cos(aL), E[1] + len * Math.sin(aL));
    ctx.moveTo(E[0], E[1]);
    ctx.lineTo(E[0] + len * Math.cos(a), E[1] + len * Math.sin(a));
    ctx.stroke();
  });
  k.slider('shear', (v) => { shear = v; s.draw(); });
  k.button('rotate', (el) => {
    const to = rot > 0.5 ? 0 : 1;
    const from = rot;
    el.textContent = to ? tr('вернуть') : tr('повернуть диагональ');
    k.say('');
    const t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = (now: number) => {
      const p = Math.min((now - t0) / 700, 1);
      rot = from + (to - from) * (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
      s.draw();
      if (p < 1) anim = requestAnimationFrame(step);
      else k.say(to ? tr('обе диагонали одной длины: вторая рисуется той же переменной, просто под другим углом.') : '');
    };
    anim = requestAnimationFrame(step);
  });
});

export const verticalHorizontal: Mount = demo((k) => {
  let L = 130;
  let equal = false;
  let px = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* На узком экране длина ужимается, но остаётся одной на все шесть отрезков; мерка
       называет её в настоящих пикселях экрана. */
    const len = Math.round(L * Math.min(1, ((w / 3) * 0.82) / 200, (h * 0.66) / 200));
    px = len;
    /* Все концы на половине пикселя — сглаживание у всех шести отрезков одинаковое. */
    const yb = Math.round(h * 0.74) + 0.5;
    const yt = yb - len;
    const c = [w / 6, w / 2, (w * 5) / 6].map((x) => Math.round(x - len / 2) + len / 2 + 0.5);
    /* [x0, y0, x1, y1, сдвиг мерки по x, сдвиг мерки по y] */
    const o = 9;
    const segs: [number, number, number, number, number, number][] = [
      [c[0] - len / 2, yb, c[0] - len / 2, yt, -o, 0],
      [c[0] - len / 2, yb, c[0] + len / 2, yb, 0, o],
      [c[1] - len / 2, yt, c[1] + len / 2, yt, 0, -o],
      [c[1], yt, c[1], yb, o, 0],
      [c[2] - len / 2, yb, c[2] + len / 2, yb, 0, o],
      [c[2], yb, c[2], yt, o, 0],
    ];
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [x0, y0, x1, y1] of segs) {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
    /* Подпись не шире своей трети холста: на телефоне шрифт мельчает. */
    const labels = [[c[0], 'L'], [c[1], 'T'], [c[2], tr('перевёрнутое T')]] as const;
    let fs = 12;
    do ctx.font = `${fs}px ui-monospace, monospace`;
    while (ctx.measureText(labels[2][1]).width > w / 3 - 6 && --fs > 8);
    ctx.fillStyle = '#6b6b70';
    ctx.textAlign = 'center';
    for (const [x, label] of labels) ctx.fillText(label, x, h * 0.96);
    if (equal) {
      /* Мерка — красная пунктирная копия той же длины рядом с каждым отрезком. */
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.lineCap = 'butt';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (const [x0, y0, x1, y1, mx, my] of segs) {
        ctx.moveTo(x0 + mx, y0 + my);
        ctx.lineTo(x1 + mx, y1 + my);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  const tell = () => k.say(equal ? tr('{n} px — столько же в каждом отрезке на экране', { n: px }) : '');
  k.slider('len', (v) => { L = v; s.draw(); tell(); });
  k.button('ruler', (el) => {
    equal = !equal;
    el.textContent = equal ? tr('убрать мерку') : tr('уравнять');
    s.draw();
    tell();
  });
});

export const sineIllusion: Mount = demo((k) => {
  let amp = 60;
  let flat = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Столбики стоят густо: кривая должна читаться лентой, иначе глаз сравнивает
       отдельные отрезки, а не толщину ленты поперёк её хода. */
    const n = Math.max(32, Math.round(w / 9));
    const A = flat ? 0 : (amp / 100) * h * 0.22;
    const L = h * 0.3;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
    for (let i = 0; i < n; i++) {
      const x = ((i + 0.5) / n) * w;
      const y = h / 2 + A * Math.sin((x / w) * Math.PI * 4);
      ctx.beginPath();
      ctx.moveTo(x, y - L / 2);
      ctx.lineTo(x, y + L / 2);
      ctx.stroke();
    }
  });
  const btn = k.button('flat', (el) => {
    flat = !flat;
    el.textContent = flat ? tr('вернуть кривую') : tr('распрямить');
    s.draw();
    k.say(flat ? tr('все столбики одной длины — и всегда были: длина в коде одна переменная.') : '');
  });
  k.slider('amp', (v) => {
    amp = v;
    if (flat && btn) {
      flat = false;
      btn.textContent = tr('распрямить');
      k.say('');
    }
    s.draw();
  });
});

export const shepardTables: Mount = demo((k) => {
  let t = 0;
  let legs = true;
  let anim = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const U = Math.min(w * 0.3, h * 0.62) / 2.2;
    /* Обе столешницы — один и тот же параллелограмм, повёрнутый на прямой угол.
       Точки заданы один раз; отличаться им нечем. Обе стороны косые: с вертикальной
       стороной стол читается не столом, а стоящей доской. Длинная сторона вдвое длиннее
       короткой и уходит вправо-вверх под 55°, короткая — влево-вверх под 20°. */
    const ux = 2 * Math.cos((55 * Math.PI) / 180), uy = -2 * Math.sin((55 * Math.PI) / 180);
    const vx = Math.cos((160 * Math.PI) / 180), vy = -Math.sin((160 * Math.PI) / 180);
    const shape: [number, number][] = [
      [-(ux + vx) / 2, -(uy + vy) / 2],
      [(ux - vx) / 2, (uy - vy) / 2],
      [(ux + vx) / 2, (uy + vy) / 2],
      [(vx - ux) / 2, (vy - uy) / 2],
    ];
    const table = (cx: number, cy: number, rot: number, fill: string, edge: string | null) => {
      const c = Math.cos(rot), si = Math.sin(rot);
      const pts = shape.map(([x, y]) => [cx + (x * c - y * si) * U, cy + (x * si + y * c) * U] as const);
      const poly = (dy: number) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy)));
        ctx.closePath();
      };
      /* Ножки рисуются первыми: задняя уходит под столешницу и видна только ниже неё. */
      if (legs) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        for (const [x, y] of pts) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + U * 0.55);
          ctx.stroke();
        }
      }
      /* Толщина столешницы — та же фигура, опущенная на несколько пикселей. У летящей
         поверх второй её нет: сквозь полупрозрачный верх она легла бы лишней полосой. */
      if (edge) {
        poly(U * 0.08);
        ctx.fillStyle = edge;
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.strokeStyle = INK;
      poly(0);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    const ax = w * 0.28;
    const bx = w * 0.72;
    const cy = h * 0.42;
    table(bx, cy, Math.PI / 2, '#c9b28a', '#8f7a57');
    table(ax + (bx - ax) * t, cy, (Math.PI / 2) * t, t > 0.5 ? 'rgba(210,72,63,0.45)' : '#d8c6a6', t > 0.5 ? null : '#9c8661');
  });
  k.button('fly', (el) => {
    const to = t > 0.5 ? 0 : 1;
    el.textContent = to ? tr('развести') : tr('наложить столешницы');
    k.say('');
    const from = t;
    const t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = (now: number) => {
      const p = Math.min((now - t0) / 900, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      t = from + (to - from) * e;
      s.draw();
      if (p < 1) anim = requestAnimationFrame(step);
      else k.say(to ? tr('совпали до пикселя: это один параллелограмм, повёрнутый на прямой угол.') : '');
    };
    anim = requestAnimationFrame(step);
  });
  k.toggle('legs', (v) => { legs = !v; s.draw(); });
});

export const leaningTower: Mount = demo((k) => {
  let gap = 8;
  let mirror = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#c9d6e3';
    ctx.fillRect(0, 0, w, h);
    /* Башня рисуется процедурно и один раз: правая панель — та же функция с тем же
       аргументом, так что «два снимка» действительно совпадают до пикселя. Башня
       снята снизу (сужается кверху) и наклонена вправо, как пизанская: без наклона
       сравнивать было бы нечего. */
    const tower = (x0: number, wd: number, flip: boolean) => {
      ctx.save();
      ctx.translate(x0 + (flip ? wd : 0), 0);
      if (flip) ctx.scale(-1, 1);
      ctx.beginPath();
      ctx.rect(0, 0, wd, h);
      ctx.clip();
      const vx = (p: number) => wd * (0.4 + 0.16 * p);
      const base = h * 1.02;
      const top = h * 0.06;
      for (let i = 0; i < 9; i++) {
        const p0 = i / 9;
        const p1 = (i + 1) / 9;
        const y0 = base + (top - base) * p0;
        const y1 = base + (top - base) * p1;
        const half0 = wd * 0.34 * (1 - p0 * 0.55);
        const half1 = wd * 0.34 * (1 - p1 * 0.55);
        ctx.fillStyle = i % 2 ? '#e8e2d5' : '#dcd4c3';
        ctx.beginPath();
        ctx.moveTo(vx(p0) - half0, y0);
        ctx.lineTo(vx(p0) + half0, y0);
        ctx.lineTo(vx(p1) + half1, y1);
        ctx.lineTo(vx(p1) - half1, y1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#b3a892';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };
    /* Ширина панели целая: иначе вторая панель встаёт на дробный пиксель
       и сглаживается иначе, чем первая. */
    const wd = Math.floor((w - gap) / 2);
    tower(0, wd, false);
    tower(wd + gap, wd, mirror);
  });
  k.slider('gap', (v) => { gap = v; s.draw(); });
  k.toggle('mirror', (v) => {
    mirror = v;
    s.draw();
    k.say(v ? tr('зеркальная копия сходится к общей точке схода — и наклоны сравнялись.') : tr('две одинаковые панели: их рисует одна функция с одним аргументом.'));
  });
});
