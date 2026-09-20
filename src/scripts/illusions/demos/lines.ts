/* Направление линий и форма. Один приём на всю группу: острый угол в поле зрения
   разгибается, и накопленные вдоль контура довороты уводят прямую с места. */
import { demo, INK, MARK, PAPER, type Mount } from '../kit';

const DARK = 0.06;
const LIGHT = 0.94;

export const cafeWall: Mount = demo((k) => {
  let offset = 0.5;
  let mortar = 3;
  let lum = 0.5;
  const s = k.surface(({ ctx, w, h }) => {
    const tile = Math.max(28, Math.round(w / 12));
    const rows = Math.ceil(h / (tile + mortar)) + 1;
    const cols = Math.ceil(w / tile) + 2;
    const g = (v: number) => `rgb(${Math.round(v * 255)} ${Math.round(v * 255)} ${Math.round(v * 255)})`;
    ctx.fillStyle = g(lum);
    ctx.fillRect(0, 0, w, h);
    for (let r = 0; r < rows; r++) {
      const y = r * (tile + mortar);
      /* Сдвигаются через ряд, раскраска от ряда не зависит: если менять и то и другое,
         узор возвращается на место и рассогласования между рядами не остаётся. */
      const shift = (r % 2 ? offset : 0) * tile;
      for (let c = -1; c < cols; c++) {
        ctx.fillStyle = g(c % 2 ? LIGHT : DARK);
        ctx.fillRect(Math.round(c * tile + shift), y, tile, tile);
      }
    }
  });
  const tell = () => {
    const outside = lum <= DARK + 0.02 || lum >= LIGHT - 0.02;
    k.say(outside
      ? 'яркость шва вышла за пределы плиток — ряды должны выпрямиться. Если выпрямились, объяснение Грегори только что подтвердилось у вас на экране.'
      : mortar === 0
        ? 'шва нет вовсе — и наклона тоже нет.'
        : `шов ${Math.round(lum * 100)} % между плитками ${Math.round(DARK * 100)} и ${Math.round(LIGHT * 100)} — в рабочем диапазоне.`);
  };
  k.slider('offset', (v) => { offset = v / 100; s.draw(); });
  k.slider('mortar', (v) => { mortar = v; s.draw(); tell(); });
  k.slider('lum', (v) => { lum = v / 100; s.draw(); tell(); });
});

export const zollner: Mount = demo((k) => {
  let angle = 25;
  let pitch = 16;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const lines = 7;
    const step = h / (lines + 1);
    const rad = (angle * Math.PI) / 180;
    const len = 16;
    for (let i = 1; i <= lines; i++) {
      const y = i * step;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.04, y);
      ctx.lineTo(w * 0.96, y);
      ctx.stroke();
      /* Наклон штрихов чередуется через строку — отсюда и расхождение соседних. */
      const sgn = i % 2 ? 1 : -1;
      ctx.lineWidth = 2;
      for (let x = w * 0.04; x < w * 0.96; x += pitch) {
        ctx.beginPath();
        ctx.moveTo(x - sgn * len * Math.cos(rad), y - len * Math.sin(rad));
        ctx.lineTo(x + sgn * len * Math.cos(rad), y + len * Math.sin(rad));
        ctx.stroke();
      }
    }
  });
  k.slider('angle', (v) => {
    angle = v;
    s.draw();
    k.say(v === 0 || v === 90 ? 'на нуле и на девяноста эффекта нет: разгибать нечего.' : v >= 10 && v <= 30 ? 'здесь эффект максимален.' : '');
  });
  k.slider('pitch', (v) => { pitch = v; s.draw(); });
});

export const poggendorff: Mount = demo((k) => {
  let guess = 0;
  let show = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bx = w * 0.42;
    const bw = w * 0.16;
    const slope = 0.62;
    const yL = h * 0.68;
    /* Настоящее продолжение считается из того же наклона — подделать нечего. */
    const trueY = yL - slope * (bx + bw - (bx - w * 0.36));
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - w * 0.36, yL);
    ctx.lineTo(bx, yL - slope * w * 0.36);
    ctx.stroke();
    ctx.fillStyle = '#c3c8d2';
    ctx.fillRect(bx, 0, bw, h);
    ctx.strokeStyle = MARK;
    ctx.beginPath();
    ctx.moveTo(bx + bw, trueY + guess);
    ctx.lineTo(w * 0.98, trueY + guess - slope * (w * 0.98 - bx - bw));
    ctx.stroke();
    if (show) {
      ctx.strokeStyle = '#3f6c48';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - w * 0.36, yL);
      ctx.lineTo(w * 0.98, yL - slope * (w * 0.98 - bx + w * 0.36));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  k.slider('guess', (v) => { guess = v; show = false; s.draw(); });
  k.button('check', (el) => {
    show = !show;
    el.textContent = show ? 'скрыть прямую' : 'показать прямую';
    s.draw();
    if (show) k.say(Math.abs(guess) < 3 ? `промах ${Math.abs(guess)} px — вы попали.` : `промах ${Math.abs(guess)} px ${guess > 0 ? 'вниз' : 'вверх'}. Обычно промахиваются в ту же сторону.`);
  });
});

const fan = (ctx: CanvasRenderingContext2D, w: number, h: number, rays: number, wundt: boolean) => {
  ctx.strokeStyle = '#9aa0ad';
  ctx.lineWidth = 1.5;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.hypot(w, h);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    if (wundt) {
      /* Вундт: лучи сходятся к двум точкам снаружи от вертикалей. */
      for (const fx of [w * -0.15, w * 1.15]) {
        ctx.moveTo(fx, cy);
        ctx.lineTo(fx + R * Math.cos(a), cy + R * Math.sin(a));
      }
    } else {
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    }
    ctx.stroke();
  }
};

export const hering: Mount = demo((k) => {
  let rays = 30;
  let wundt = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    fan(ctx, w, h, rays, wundt);
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 4;
    for (const x of [w * 0.36, w * 0.64]) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.04);
      ctx.lineTo(x, h * 0.96);
      ctx.stroke();
    }
  });
  k.slider('rays', (v) => { rays = v; s.draw(); });
  k.toggle('wundt', (v) => {
    wundt = v;
    s.draw();
    k.say(v ? 'та же геометрия наизнанку: прямые вгибаются внутрь. Это иллюзия Вундта.' : 'прямые выгибаются наружу. Обе по-прежнему прямые.');
  });
});

export const bourdon: Mount = demo((k) => {
  let wedge = 14;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const y = h * 0.62;
    const mid = w / 2;
    const dy = Math.tan((wedge * Math.PI) / 180) * (w * 0.42);
    /* Верхний край обоих треугольников лежит на одной прямой y. */
    ctx.fillStyle = '#5e7a95';
    ctx.beginPath();
    ctx.moveTo(w * 0.06, y);
    ctx.lineTo(mid, y);
    ctx.lineTo(mid, y + dy);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(mid, y);
    ctx.lineTo(w * 0.94, y);
    ctx.lineTo(mid, y + dy);
    ctx.closePath();
    ctx.fill();
    if (ruler) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(w * 0.02, y);
      ctx.lineTo(w * 0.98, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  k.slider('wedge', (v) => { wedge = v; s.draw(); });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? 'убрать прямую' : 'приложить прямую';
    s.draw();
  });
});

const grating = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, deg: number, period = 12) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(cx, cy);
  ctx.rotate((deg * Math.PI) / 180);
  for (let y = -r * 1.5; y < r * 1.5; y += period) {
    ctx.fillStyle = ((y / period) | 0) % 2 ? '#1b1b1b' : '#efefef';
    ctx.fillRect(-r * 1.5, y, r * 3, period);
  }
  ctx.restore();
};

export const tiltIllusion: Mount = demo((k) => {
  let sur = 15;
  let guess = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.42;
    grating(ctx, cx, cy, R, sur);
    grating(ctx, cx, cy, R * 0.42, guess);
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  });
  k.slider('surround', (v) => { sur = v; s.draw(); });
  k.slider('guess', (v) => { guess = v; s.draw(); });
  k.button('check', () => {
    k.say(guess === 0
      ? 'центр стоит ровно в вертикали — и всё равно выглядит наклонённым.'
      : `вы отклонили центр на ${Math.abs(guess)}° ${guess > 0 ? 'вправо' : 'влево'}, чтобы он выглядел вертикальным. Это ваша ошибка отталкивания при окружении в ${sur}°.`);
  });
});

export const fraserSpiral: Mount = demo((k) => {
  let tilt = 30;
  let trace = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#6f7a86';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    /* Плетёный шнур: короткие косые чёрно-белые штрихи вдоль окружности.
       Окружности настоящие — спирали в геометрии нет вовсе. */
    for (let ri = 1; ri <= 5; ri++) {
      const r = (R * ri) / 5;
      const n = Math.max(24, Math.round((2 * Math.PI * r) / 14));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const t = a + Math.PI / 2 + (tilt * Math.PI) / 180;
        ctx.strokeStyle = i % 2 ? '#111' : '#fff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x - 8 * Math.cos(t), y - 8 * Math.sin(t));
        ctx.lineTo(x + 8 * Math.cos(t), y + 8 * Math.sin(t));
        ctx.stroke();
      }
    }
    if (trace) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, (R * 3) / 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  k.slider('tilt', (v) => {
    tilt = v;
    s.draw();
    k.say(v === 0 ? 'наклона нет — и спираль схлопнулась в окружности. Она ими всегда и была.' : '');
  });
  k.button('trace', (el) => {
    trace = !trace;
    el.textContent = trace ? 'убрать обводку' : 'обвести один виток';
    s.draw();
  });
});

export const orbison: Mount = demo((k) => {
  let bg = 'fan';
  let fig = 'square';
  let spin = false;
  let phase = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    ctx.strokeStyle = '#9aa0ad';
    ctx.lineWidth = 1.5;
    if (bg === 'fan') {
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2 + phase;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * 2 * Math.cos(a), cy + R * 2 * Math.sin(a));
        ctx.stroke();
      }
    } else if (bg === 'rings') {
      for (let r = 8; r < R * 1.6; r += 12) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      for (let x = 0; x < w; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 14) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 4;
    const r = R * 0.55;
    ctx.beginPath();
    if (fig === 'circle') ctx.arc(cx, cy, r, 0, Math.PI * 2);
    else {
      const n = fig === 'hex' ? 6 : 4;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2 + (n === 4 ? Math.PI / 4 : 0);
        const rr = n === 4 ? r * Math.SQRT2 : r;
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
  });
  k.select('bg', (v) => { bg = v; s.draw(); });
  k.select('fig', (v) => { fig = v; s.draw(); });
  k.check('spin', (v) => { spin = v; });
  k.loop((_, dt) => { if (spin) { phase += dt * 0.15; s.draw(); } });
});

export const checkerBulge: Mount = demo((k) => {
  let size = 26;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const n = 12;
    const tile = w / n;
    for (let r = 0; r * tile < h; r++)
      for (let c = 0; c < n; c++) {
        ctx.fillStyle = (r + c) % 2 ? '#111' : '#f0f0f0';
        ctx.fillRect(c * tile, r * tile, tile + 1, tile + 1);
      }
    /* Мелкие контрастные квадратики в углах клеток — то, что коробит поле. */
    const q = (tile * size) / 200;
    for (let r = 1; r * tile < h; r++)
      for (let c = 1; c < n; c++) {
        const dark = (r + c) % 2 === 0;
        ctx.fillStyle = dark ? '#f0f0f0' : '#111';
        ctx.fillRect(c * tile - q / 2, r * tile - q / 2, q, q);
      }
    if (ruler) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    }
  });
  k.slider('size', (v) => {
    size = v;
    s.draw();
    k.say(v === 0 ? 'угловые элементы убраны — доска плоская.' : '');
  });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? 'убрать линейку' : 'приложить линейку';
    s.draw();
  });
});

export const curvatureBlindness: Mount = demo((k) => {
  let phase = 0;
  let amp = 22;
  const s = k.surface(({ ctx, w, h }) => {
    /* Фон половинами: на светлом и на тёмном одна и та же волна читается по-разному. */
    ctx.fillStyle = '#9a9a9a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#555';
    ctx.fillRect(0, h / 2, w, h / 2);
    const wave = (yc: number) => {
      const period = w / 4;
      ctx.lineWidth = 7;
      ctx.lineCap = 'butt';
      let prevPolarity = -1;
      for (let x = 0; x <= w; x += 2) {
        const p = (x / period) * Math.PI * 2;
        const y = yc + amp * Math.sin(p);
        const y2 = yc + amp * Math.sin(((x + 2) / period) * Math.PI * 2);
        /* Контраст переключается в точке, заданной ползунком: на вершине волны это
           читается как угол, в стороне от вершины — как обычная дуга. */
        const t = ((x / period) * 360 + phase * 3.6) % 180;
        const polarity = t < 90 ? 1 : 0;
        if (polarity !== prevPolarity) prevPolarity = polarity;
        ctx.strokeStyle = polarity ? '#fff' : '#000';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 2, y2);
        ctx.stroke();
      }
    };
    wave(h * 0.25);
    wave(h * 0.75);
  });
  k.slider('phase', (v) => {
    phase = v;
    s.draw();
    k.say(v === 0 ? 'переключение контраста стоит на вершинах — волна читается зигзагом.' : 'переключение сдвинуто с вершин — и зигзаг разгладился в синусоиду. Сама линия не менялась.');
  });
  k.slider('amp', (v) => { amp = v; s.draw(); });
});
