/* Размер и длина. Во всех этих демонстрациях спорные величины выводятся из одной
   переменной: равенство по построению, а не по обещанию. */
import { demo, grey, INK, MARK, PAPER, type Mount } from '../kit';

export const muellerLyer: Mount = demo((k) => {
  let theta = 45;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const L = Math.min(w * 0.56, 420);
    const F = L * 0.24;
    const x0 = (w - L) / 2;
    const x1 = x0 + L;
    const rad = (theta * Math.PI) / 180;
    const dx = F * Math.cos(rad);
    const dy = F * Math.sin(rad);
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
    k.say(v === 0 ? 'угол 0° — наконечники легли на отрезок, и разницы больше нет. Вот это и есть проверка.' : `угол ${v}°. Оба отрезка по-прежнему одной длины.`);
  });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? 'убрать линейку' : 'приложить линейку';
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
    const halfTop = halfBottom * (1 - (deg / 45) * 0.9);
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
    for (const y of [h * 0.26, h * 0.74]) {
      ctx.beginPath();
      ctx.moveTo(cx - L / 2, y);
      ctx.lineTo(cx + L / 2, y);
      ctx.stroke();
    }
  });
  k.slider('deg', (v) => {
    deg = v;
    s.draw();
    k.say(v === 0 ? 'рельсы параллельны — перспективы нет, и отрезки наконец выглядят одинаковыми.' : `схождение ${v}°. Длина у обоих — одна и та же переменная.`);
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
    ring(ctx, w * 0.28, cy, REF, 6, 46, 92);
    ring(ctx, w * 0.72, cy, mine, 7, 15, 62);
    if (reveal) {
      ctx.strokeStyle = INK;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      for (const [cx, r] of [[w * 0.28, mine], [w * 0.72, REF]] as const) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  });
  k.slider('mine', (v) => { mine = v; reveal = false; s.draw(); });
  k.button('check', (el) => {
    reveal = !reveal;
    el.textContent = reveal ? 'скрыть ответ' : 'проверить';
    s.draw();
    if (!reveal) return;
    const err = ((mine - REF) / REF) * 100;
    const a = Math.abs(err).toFixed(0);
    k.say(Math.abs(err) < 3
      ? `промах ${a} % — вы попали. Это бывает: иллюзия сильна не у всех одинаково.`
      : err > 0
        ? `вы сделали правый круг на ${a} % больше эталона. Соседи у него мелкие, и он казался меньше, чем есть.`
        : `вы сделали правый круг на ${a} % меньше эталона — необычное направление.`);
  });
});

export const delboeuf: Mount = demo((k) => {
  const R = 40;
  let ringR = 40;
  let show = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cy = h / 2;
    /* Слева эталон без кольца, справа тот же диск в кольце. */
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(w * 0.3, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.7, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.7, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
    if (show) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#3f6c48';
      ctx.beginPath();
      ctx.arc(w * 0.3, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.7, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  k.slider('ring', (v) => {
    ringR = v;
    s.draw();
    k.say(v < R + 8 ? 'кольцо вплотную — диск кажется крупнее.' : v > 90 ? 'кольцо далеко — диск кажется мельче. Это та же тарелка, только большая.' : '');
  });
  k.button('check', (el) => {
    show = !show;
    el.textContent = show ? 'убрать эталон' : 'показать эталон';
    s.draw();
  });
});

export const jastrow: Mount = demo((k) => {
  let stacked = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const R = Math.min(w * 0.36, h * 0.8);
    const r = R * 0.72;
    /* Оба сегмента строятся из одних и тех же R, r и угла: отличаться им нечем. */
    const seg = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(cx, cy, r, Math.PI * 1.85, Math.PI * 1.15, true);
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = '#5e7a95';
    seg(w / 2, h * 0.36);
    ctx.fillStyle = stacked ? 'rgba(210,72,63,0.55)' : MARK;
    seg(w / 2, stacked ? h * 0.36 : h * 0.74);
  });
  k.button('stack', (el) => {
    stacked = !stacked;
    el.textContent = stacked ? 'развести' : 'наложить друг на друга';
    s.draw();
    k.say(stacked ? 'совпали до пикселя. Оба сегмента рисуются одной функцией из одних и тех же чисел.' : '');
  });
});

export const oppelKundt: Mount = demo((k) => {
  let ticks = 16;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const L = w * 0.36;
    const x0 = w * 0.1;
    const y = h * 0.55;
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
    ctx.lineWidth = 1.5;
    for (let i = 1; i < ticks; i++) {
      const x = x0 + (L * i) / ticks;
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x, y + 9);
      ctx.stroke();
    }
    if (ruler) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 3;
      for (const [a, b, yy] of [[x0, x0 + L, y + 34], [x0 + L, x0 + L * 2, y + 34]] as const) {
        ctx.beginPath();
        ctx.moveTo(a, yy);
        ctx.lineTo(b, yy);
        ctx.stroke();
      }
    }
  });
  k.slider('ticks', (v) => {
    ticks = v;
    s.draw();
    k.say(v === 0 ? 'штрихов нет — половины равны и выглядят равными.' : `${v} штрихов. Длина половин не менялась ни разу.`);
  });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? 'убрать линейку' : 'приложить линейку';
    s.draw();
  });
});

export const sander: Mount = demo((k) => {
  let shear = 35;
  let rot = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const y0 = h * 0.22;
    const y1 = h * 0.82;
    const dx = Math.tan((shear * Math.PI) / 180) * (y1 - y0);
    const ax = w * 0.12;
    const mid = w * 0.52;
    const rx = w * 0.9;
    ctx.strokeStyle = '#8a8d96';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, y1);
    ctx.lineTo(ax + dx, y0);
    ctx.lineTo(mid + dx, y0);
    ctx.lineTo(mid, y1);
    ctx.closePath();
    ctx.moveTo(mid, y1);
    ctx.lineTo(mid + dx, y0);
    ctx.lineTo(rx + dx, y0);
    ctx.lineTo(rx, y1);
    ctx.closePath();
    ctx.stroke();
    /* Обе диагонали идут из одной точки; равными их делает построение, не глазомер. */
    const d1 = { x0: ax, y0: y1, x1: mid + dx, y1: y0 };
    const len = Math.hypot(d1.x1 - d1.x0, d1.y1 - d1.y0);
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(d1.x0, d1.y0);
    ctx.lineTo(d1.x1, d1.y1);
    ctx.stroke();
    ctx.save();
    ctx.translate(mid, y1);
    const base = Math.atan2(y0 - y1, rx + dx - mid);
    ctx.rotate(base + ((Math.atan2(d1.y1 - d1.y0, d1.x1 - d1.x0) - base) * rot) / 100);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.stroke();
    ctx.restore();
  });
  k.slider('shear', (v) => { shear = v; s.draw(); });
  k.button('rotate', (el) => {
    rot = rot ? 0 : 100;
    el.textContent = rot ? 'вернуть' : 'повернуть диагональ';
    s.draw();
    k.say(rot ? 'обе диагонали одной длины: вторая рисуется той же переменной, просто под другим углом.' : '');
  });
});

export const verticalHorizontal: Mount = demo((k) => {
  let L = 130;
  let equal = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.font = '12px ui-monospace, monospace';
    ctx.fillStyle = '#6b6b70';
    ctx.textAlign = 'center';
    const panels: [number, string, () => void][] = [
      [w / 6, 'L', () => {
        ctx.beginPath(); ctx.moveTo(w / 6 - L / 2, h * 0.7); ctx.lineTo(w / 6 - L / 2, h * 0.7 - L);
        ctx.moveTo(w / 6 - L / 2, h * 0.7); ctx.lineTo(w / 6 - L / 2 + L, h * 0.7); ctx.stroke();
      }],
      [w / 2, 'T', () => {
        ctx.beginPath(); ctx.moveTo(w / 2 - L / 2, h * 0.28); ctx.lineTo(w / 2 + L / 2, h * 0.28);
        ctx.moveTo(w / 2, h * 0.28); ctx.lineTo(w / 2, h * 0.28 + L); ctx.stroke();
      }],
      [(w * 5) / 6, 'перевёрнутое T', () => {
        ctx.beginPath(); ctx.moveTo((w * 5) / 6 - L / 2, h * 0.75); ctx.lineTo((w * 5) / 6 + L / 2, h * 0.75);
        ctx.moveTo((w * 5) / 6, h * 0.75); ctx.lineTo((w * 5) / 6, h * 0.75 - L); ctx.stroke();
      }],
    ];
    for (const [x, label, draw] of panels) {
      ctx.strokeStyle = INK;
      draw();
      ctx.fillStyle = '#6b6b70';
      ctx.fillText(label, x, h * 0.93);
    }
    if (equal) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(w * 0.04, h * 0.12);
      ctx.lineTo(w * 0.04 + L, h * 0.12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = MARK;
      ctx.textAlign = 'left';
      ctx.fillText(`${L} px — столько же в каждом отрезке на экране`, w * 0.04, h * 0.09);
    }
  });
  k.slider('len', (v) => { L = v; s.draw(); });
  k.button('ruler', (el) => {
    equal = !equal;
    el.textContent = equal ? 'убрать мерку' : 'уравнять';
    s.draw();
  });
});

export const sineIllusion: Mount = demo((k) => {
  let amp = 60;
  let flat = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const n = 40;
    const A = flat ? 0 : (amp / 100) * h * 0.22;
    const L = h * 0.3;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x = ((i + 0.5) / n) * w;
      const y = h / 2 + A * Math.sin((i / n) * Math.PI * 4);
      ctx.beginPath();
      ctx.moveTo(x, y - L / 2);
      ctx.lineTo(x, y + L / 2);
      ctx.stroke();
    }
  });
  k.slider('amp', (v) => { amp = v; s.draw(); });
  k.button('flat', (el) => {
    flat = !flat;
    el.textContent = flat ? 'вернуть кривую' : 'распрямить';
    s.draw();
    k.say(flat ? 'все столбики одной длины — и всегда были: длина в коде одна переменная.' : '');
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
       Точки заданы один раз; отличаться им нечем. */
    const shape: [number, number][] = [[-0.55, -1], [0.55, -0.55], [0.55, 1], [-0.55, 0.55]];
    const table = (cx: number, cy: number, rot: number, fill: string) => {
      const pts = shape.map(([x, y]) => {
        const c = Math.cos(rot), si = Math.sin(rot);
        return [cx + (x * c - y * si) * U, cy + (x * si + y * c) * U] as const;
      });
      if (legs) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        for (const [x, y] of pts) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + U * 0.42);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    const ax = w * 0.28;
    const bx = w * 0.72;
    table(bx, h * 0.44, Math.PI / 2, '#c9b28a');
    table(ax + (bx - ax) * t, h * 0.44, (Math.PI / 2) * t, t > 0.5 ? 'rgba(210,72,63,0.45)' : '#d8c6a6');
  });
  k.button('fly', (el) => {
    const to = t > 0.5 ? 0 : 1;
    el.textContent = to ? 'развести' : 'наложить столешницы';
    const from = t;
    const t0 = performance.now();
    cancelAnimationFrame(anim);
    const step = (now: number) => {
      const p = Math.min((now - t0) / 900, 1);
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      t = from + (to - from) * e;
      s.draw();
      if (p < 1) anim = requestAnimationFrame(step);
      else k.say(to ? 'совпали до пикселя: это один параллелограмм, повёрнутый на прямой угол.' : '');
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
       аргументом, так что «два снимка» действительно совпадают до пикселя. */
    const tower = (x0: number, wd: number, flip: boolean) => {
      ctx.save();
      ctx.translate(x0 + (flip ? wd : 0), 0);
      if (flip) ctx.scale(-1, 1);
      ctx.beginPath();
      ctx.rect(0, 0, wd, h);
      ctx.clip();
      const vx = wd * 0.42;
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
        ctx.moveTo(vx - half0, y0);
        ctx.lineTo(vx + half0, y0);
        ctx.lineTo(vx + half1, y1);
        ctx.lineTo(vx - half1, y1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#b3a892';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };
    const wd = (w - gap) / 2;
    tower(0, wd, false);
    tower(wd + gap, wd, mirror);
  });
  k.slider('gap', (v) => { gap = v; s.draw(); });
  k.toggle('mirror', (v) => {
    mirror = v;
    s.draw();
    k.say(v ? 'зеркальная копия сходится к общей точке схода — и наклоны сравнялись.' : 'две одинаковые панели: их рисует одна функция с одним аргументом.');
  });
});
