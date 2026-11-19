/* Направление линий и форма. Один приём на всю группу: острый угол в поле зрения
   разгибается, и накопленные вдоль контура довороты уводят прямую с места. */
import { demo, grey, INK, MARK, PAPER, type Mount } from '../kit';
import { tr } from '../i18n';

const DARK = 0.06;
const LIGHT = 0.94;

/* Страница записи, на которой стоит общая демонстрация: часть записей показывает другой
   режим того же рисовальщика, и открываться он должен сразу в нём. */
const page = (id: string) => new RegExp(`/${id}/?$`).test(location.pathname);

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
    k.say(mortar === 0
      ? tr('шва нет — это фигура Мюнстерберга: наклон, если и виден, заметно слабее.')
      : outside
        ? tr('яркость шва вышла за пределы плиток — ряды должны выпрямиться. Если выпрямились, объяснение Грегори только что подтвердилось у вас на экране.')
        : tr('шов {m} % между плитками {d} и {l} — в рабочем диапазоне.', { m: Math.round(lum * 100), d: Math.round(DARK * 100), l: Math.round(LIGHT * 100) }));
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
    const len = Math.min(16, step * 0.32);
    const x0 = w * 0.04;
    const x1 = w * 0.96;
    /* Штрихи не вылезают за концы длинной линии. */
    const pad = len * Math.cos(rad);
    for (let i = 1; i <= lines; i++) {
      const y = i * step;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      /* Наклон штрихов чередуется через строку — отсюда и расхождение соседних. */
      const sgn = i % 2 ? 1 : -1;
      ctx.lineWidth = 2;
      for (let x = x0 + pad; x <= x1 - pad; x += pitch) {
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
    k.say(v === 0 || v === 90 ? tr('на нуле и на девяноста эффекта нет: разгибать нечего.') : v >= 10 && v <= 30 ? tr('здесь эффект максимален.') : '');
  });
  k.slider('pitch', (v) => { pitch = v; s.draw(); });
});

export const poggendorff: Mount = demo((k) => {
  let guess = 0;
  let show = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Прямая идёт из левого нижнего угла в правый верхний и целиком помещается
       в холст при любой его ширине: наклон считается от размеров, а не задан числом. */
    const xa = w * 0.06;
    const ya = h * 0.84;
    const xb = w * 0.98;
    const slope = (h * 0.68) / (xb - xa);
    const bx = w * 0.42;
    const bw = w * 0.16;
    const y = (x: number) => ya - slope * (x - xa);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xa, ya);
    ctx.lineTo(bx, y(bx));
    ctx.stroke();
    ctx.fillStyle = '#c3c8d2';
    ctx.fillRect(bx, 0, bw, h);
    /* Настоящее продолжение считается из того же наклона — подделать нечего;
       ползунок только сдвигает его по вертикали. */
    ctx.strokeStyle = MARK;
    ctx.beginPath();
    ctx.moveTo(bx + bw, y(bx + bw) + guess);
    ctx.lineTo(xb, y(xb) + guess);
    ctx.stroke();
    if (show) {
      ctx.strokeStyle = '#3f6c48';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xa, ya);
      ctx.lineTo(xb, y(xb));
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  const btn = k.button('check', (el) => {
    show = !show;
    el.textContent = show ? tr('скрыть прямую') : tr('показать прямую');
    s.draw();
    const n = Math.abs(guess);
    /* Острые углы у краёв полосы разгибаются, левый отрезок кажется положе, и его
       продолжение ждут ниже настоящего: обычный промах — вниз. */
    k.say(!show ? '' : n < 3
      ? tr('промах {n} px — вы попали.', { n })
      : guess > 0
        ? tr('промах {n} px вниз. Обычно промахиваются в ту же сторону.', { n })
        : tr('промах {n} px вверх — необычное направление: обычно продолжение ставят ниже настоящего.', { n }));
  });
  k.slider('guess', (v) => {
    guess = v;
    show = false;
    if (btn) btn.textContent = tr('показать прямую');
    k.say('');
    s.draw();
  });
});

const fan = (ctx: CanvasRenderingContext2D, w: number, h: number, rays: number, wundt: boolean) => {
  ctx.strokeStyle = '#9aa0ad';
  ctx.lineWidth = 1.5;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.hypot(w, h) * 1.4;
  /* Геринг: лучи из точки между вертикалями. Вундт: та же картина наизнанку — лучи
     из двух точек снаружи, и каждый пучок только на своей половине, чтобы у обеих
     вертикалей наклон пересекающих линий был зеркальным геринговскому. */
  const sources = wundt ? [[w * -0.15, 0, cx], [w * 1.15, cx, w]] : [[cx, 0, w]];
  for (const [sx, a, b] of sources) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(a, 0, b - a, h);
    ctx.clip();
    ctx.beginPath();
    for (let i = 0; i < rays; i++) {
      const t = (i / rays) * Math.PI * 2;
      ctx.moveTo(sx, cy);
      ctx.lineTo(sx + R * Math.cos(t), cy + R * Math.sin(t));
    }
    ctx.stroke();
    ctx.restore();
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
    k.say(v ? tr('та же геометрия наизнанку: прямые вгибаются внутрь. Это иллюзия Вундта.') : tr('прямые выгибаются наружу. Обе по-прежнему прямые.'));
  }, page('wundt'));
});

export const bourdon: Mount = demo((k) => {
  let wedge = 14;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const mid = w / 2;
    const span = w * 0.44;
    /* Два узких клина сходятся остриями в середине, верхние края обоих лежат на одной
       прямой y. Острый угол при вершине и ломает её на вид. Прямая стоит на месте при
       любом угле: высота считается от самого широкого клина. */
    const dy = Math.tan((wedge * Math.PI) / 180) * span;
    const y = Math.max(h * 0.1, (h - Math.tan((25 * Math.PI) / 180) * span) / 2);
    ctx.fillStyle = '#5e7a95';
    ctx.beginPath();
    ctx.moveTo(mid - span, y);
    ctx.lineTo(mid, y);
    ctx.lineTo(mid - span, y + dy);
    ctx.closePath();
    ctx.moveTo(mid, y);
    ctx.lineTo(mid + span, y);
    ctx.lineTo(mid + span, y + dy);
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
    el.textContent = ruler ? tr('убрать прямую') : tr('приложить прямую');
    s.draw();
  });
});

/* Круглая решётка; deg — отклонение полос от вертикали, по часовой стрелке. */
const grating = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, deg: number, period = 12) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#efefef';
  ctx.fill();
  ctx.translate(cx, cy);
  ctx.rotate((deg * Math.PI) / 180);
  /* Номер полосы через floor: с усечением к нулю две полосы вокруг центра сливались
     в одну двойной ширины. Светлые не рисуются — под ними уже светлый круг, и на стыках
     не остаётся волосяных швов. */
  ctx.fillStyle = '#1b1b1b';
  for (let i = Math.floor((-r * 1.5) / period); i * period < r * 1.5; i++)
    if (i % 2) ctx.fillRect(i * period, -r * 1.5, period, r * 3);
  ctx.restore();
};

export const tiltIllusion: Mount = demo((k) => {
  let sur = 15;
  let guess = 0;
  /* Каждая проверка — точка (угол окружения, ваша поправка) на графике справа. */
  const log: [number, number][] = [];
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
    if (!log.length) return;
    /* График: по горизонтали окружение −90…90°, по вертикали поправка −20…20°. */
    /* График в свободной полосе справа от решётки; подписи осей — только если влезают. */
    const bw = Math.min(w * 0.22, 150, w / 2 - R - 14);
    const bh = Math.min(h * 0.45, 110, bw * 0.8);
    if (bw < 40) return;
    const x0 = w - bw - 8;
    const y0 = h - bh - 8;
    ctx.strokeStyle = '#9aa0ad';
    ctx.lineWidth = 1;
    ctx.strokeRect(x0, y0, bw, bh);
    ctx.beginPath();
    ctx.moveTo(x0, y0 + bh / 2);
    ctx.lineTo(x0 + bw, y0 + bh / 2);
    ctx.moveTo(x0 + bw / 2, y0);
    ctx.lineTo(x0 + bw / 2, y0 + bh);
    ctx.stroke();
    ctx.fillStyle = MARK;
    for (const [a, g] of log) {
      ctx.beginPath();
      ctx.arc(x0 + ((a + 90) / 180) * bw, y0 + bh / 2 - (g / 40) * bh, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (bw < 100) return;
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(tr('окружение →'), x0 + bw - 3, y0 + bh - 4);
    ctx.textAlign = 'left';
    ctx.fillText(tr('↑ поправка'), x0 + 3, y0 + 12);
  });
  k.slider('surround', (v) => { sur = v; s.draw(); });
  k.slider('guess', (v) => { guess = v; s.draw(); });
  k.button('check', () => {
    log.push([sur, guess]);
    if (log.length > 60) log.shift();
    s.draw();
    const n = Math.abs(guess);
    /* Окружение по часовой отталкивает центр против часовой; чтобы он выглядел
       вертикальным, его доворачивают по часовой — в ту же сторону, что окружение. */
    k.say(guess === 0
      ? sur === 0
        ? tr('окружение тоже вертикально — отталкивать центр нечему, он стоит ровно.')
        : tr('центр стоит ровно в вертикали — и всё равно выглядит наклонённым.')
      : sur === 0
        ? tr('окружение вертикально, отталкивать центр нечему: поправка в {n}° — это разброс, а не иллюзия.', { n })
        : Math.sign(guess) !== Math.sign(sur)
          /* Притяжение — обычное дело при окружении круче 50°, до того — редкость. */
          ? Math.abs(sur) >= 50
            ? tr('вы отклонили центр на {n}° против наклона окружения — это притяжение: при окружении круче 50° его и ждут.', { n })
            : tr('вы отклонили центр на {n}° против наклона окружения — это притяжение, а не отталкивание; при окружении в {s}° чаще бывает наоборот.', { n, s: sur })
          : guess > 0
            ? tr('вы отклонили центр на {n}° вправо, чтобы он выглядел вертикальным. Это ваша ошибка отталкивания при окружении в {s}°.', { n, s: sur })
            : tr('вы отклонили центр на {n}° влево, чтобы он выглядел вертикальным. Это ваша ошибка отталкивания при окружении в {s}°.', { n, s: sur }));
  });
});

export const fraserSpiral: Mount = demo((k) => {
  let tilt = 30;
  let trace = false;
  const RINGS = 7;
  const TRACED = 4;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#6f7a86';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    /* Плетёный шнур: косые чёрные и белые звенья встык, без зазоров, вдоль настоящих
       окружностей. Звено — параллелограмм: внешний край сдвинут по дуге относительно
       внутреннего на tan(tilt)·толщину, то есть tilt — наклон прядей от поперечного
       положения. На нуле шнур — пунктирное кольцо. Спирали в геометрии нет вовсе. */
    const bw = Math.max(5, Math.min(12, R / RINGS / 2.4));
    const shear = Math.tan((tilt * Math.PI) / 180) * bw;
    for (let ri = 1; ri <= RINGS; ri++) {
      const r = (R * (ri + 0.6)) / (RINGS + 0.6);
      const n = 2 * Math.max(12, Math.round((Math.PI * r) / 9));
      const ri0 = r - bw / 2;
      const ro = r + bw / 2;
      const d = shear / r;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2;
        const a1 = ((i + 1) / n) * Math.PI * 2;
        ctx.fillStyle = i % 2 ? '#111' : '#f4f4f4';
        ctx.beginPath();
        ctx.moveTo(cx + ri0 * Math.cos(a0 - d / 2), cy + ri0 * Math.sin(a0 - d / 2));
        ctx.lineTo(cx + ri0 * Math.cos(a1 - d / 2), cy + ri0 * Math.sin(a1 - d / 2));
        ctx.lineTo(cx + ro * Math.cos(a1 + d / 2), cy + ro * Math.sin(a1 + d / 2));
        ctx.lineTo(cx + ro * Math.cos(a0 + d / 2), cy + ro * Math.sin(a0 + d / 2));
        ctx.closePath();
        ctx.fill();
      }
    }
    if (trace) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, (R * (TRACED + 0.6)) / (RINGS + 0.6), 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  k.slider('tilt', (v) => {
    tilt = v;
    s.draw();
    k.say(v === 0 ? tr('наклона нет — и спираль схлопнулась в окружности. Она ими всегда и была.') : '');
  });
  k.button('trace', (el) => {
    trace = !trace;
    el.textContent = trace ? tr('убрать обводку') : tr('обвести один виток');
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
    const far = Math.hypot(w, h);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(phase);
    ctx.strokeStyle = '#9aa0ad';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (bg === 'fan') {
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(far * Math.cos(a), far * Math.sin(a));
      }
    } else if (bg === 'rings') {
      for (let r = 8; r < far / 2; r += 12) {
        ctx.moveTo(r, 0);
        ctx.arc(0, 0, r, 0, Math.PI * 2);
      }
    } else {
      /* Гиперболы x² − y² = ±a² с асимптотами по диагоналям: стороны квадрата они
         пересекают под углом, который меняется вдоль стороны. */
      for (let a = 10; a < far / 2; a += 14) {
        const tm = Math.asinh(far / 2 / a);
        for (const [sx, swap] of [[1, false], [-1, false], [1, true], [-1, true]] as const) {
          for (let i = 0; i <= 80; i++) {
            const t = -tm + (2 * tm * i) / 80;
            const u = sx * a * Math.cosh(t);
            const v = a * Math.sinh(t);
            const [x, y] = swap ? [v, u] : [u, v];
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
        }
      }
    }
    ctx.stroke();
    ctx.restore();
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
  /* Квадрат Эренштейна — тот же рисовальщик на кольцах: на его странице кольца сразу. */
  const sel = k.root.querySelector<HTMLSelectElement>('[data-select="bg"]');
  if (sel && page('ehrenstein-square')) sel.value = 'rings';
  k.select('bg', (v) => { bg = v; s.draw(); });
  k.select('fig', (v) => { fig = v; s.draw(); });
  k.check('spin', (v) => { spin = v; });
  k.loop((_, dt) => { if (spin) { phase += dt * 0.15; s.draw(); } });
});

export const checkerBulge: Mount = demo((k) => {
  let size = 26;
  let contrast = 100;
  let ruler = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const n = 12;
    const tile = w / n;
    /* Доска сдвинута так, чтобы середина холста пришлась на угол клеток: от этого угла
       и считаются четверти. */
    const oy = h / 2 - tile * Math.ceil(h / 2 / tile);
    const rows = Math.ceil((h - oy) / tile);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < n; c++) {
        ctx.fillStyle = (r + c) % 2 ? '#111' : '#f0f0f0';
        ctx.fillRect(c * tile, oy + r * tile, tile + 1, tile + 1);
      }
    /* Мелкие квадратики на углах клеток — то, что коробит поле. Цвет квадратика задаёт,
       в какую сторону доворачиваются края у этого угла; в соседних четвертях он
       обратный, поэтому довороты складываются не в общий наклон, а в выпуклость.
       На осях квадратиков нет: там поворачивать не в какую сторону. */
    const q = (tile * size) / 200;
    const lo = grey(0.5 - (0.44 * contrast) / 100);
    const hi = grey(0.5 + (0.44 * contrast) / 100);
    for (let r = 1; r < rows; r++)
      for (let c = 1; c < n; c++) {
        const x = c * tile;
        const y = oy + r * tile;
        const qx = Math.sign(Math.round(x - w / 2));
        const qy = Math.sign(Math.round(y - h / 2));
        if (!qx || !qy) continue;
        /* Светлая клетка слева сверху от угла плюс квадратик её же цвета дают
           наклон «\» горизонтальных краёв; в левой верхней и правой нижней четвертях
           нужен обратный «/», чтобы края выгибались от центра, а не к нему. */
        const lightTL = (r + c) % 2 === 0;
        ctx.fillStyle = lightTL !== (qx * qy > 0) ? hi : lo;
        ctx.fillRect(x - q / 2, y - q / 2, q, q);
      }
    if (ruler) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const y of [oy + tile * Math.round((h * 0.25 - oy) / tile), h / 2]) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    }
  });
  const tell = () => k.say(size === 0 || contrast === 0 ? tr('угловые элементы убраны — доска плоская.') : '');
  k.slider('size', (v) => { size = v; s.draw(); tell(); });
  k.slider('contrast', (v) => { contrast = v; s.draw(); tell(); });
  k.button('ruler', (el) => {
    ruler = !ruler;
    el.textContent = ruler ? tr('убрать линейку') : tr('приложить линейку');
    s.draw();
  });
});

export const curvatureBlindness: Mount = demo((k) => {
  let phase = 0;
  let amp = 22;
  let bg = 85;
  const s = k.surface(({ ctx, w, h }) => {
    /* Верхняя половина — фон с ползунка, нижняя — средний серый, ровно между белой
       и чёрной частями линии: там иллюзия сильнее всего. Одна и та же волна на двух
       фонах. */
    ctx.fillStyle = grey(bg / 100);
    ctx.fillRect(0, 0, w, h / 2);
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, h / 2, w, h / 2);
    /* Волна частая и пологая, как у Такахаси: на крупной редкой волне углы не
       мерещатся. */
    const period = Math.max(70, w / 7);
    /* Цвет меняется каждые полпериода. При phase = 0 смена стоит на вершинах и впадинах
       (90° и 270° фазы синусоиды), при phase = 100 — на переходах через середину
       (0° и 180°). Каждый одноцветный участок рисуется одним штрихом. */
    const shift = 90 - phase * 0.9;
    const wave = (yc: number) => {
      ctx.lineWidth = 7;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'round';
      const y = (x: number) => yc + amp * Math.sin((x / period) * Math.PI * 2);
      for (let j = Math.floor((-shift) / 180) - 1; ; j++) {
        const xa = Math.max(0, ((shift + 180 * j) / 360) * period);
        const xb = Math.min(w, ((shift + 180 * (j + 1)) / 360) * period);
        if (xa >= w) break;
        if (xb <= 0) continue;
        ctx.strokeStyle = ((j % 2) + 2) % 2 ? '#000' : '#fff';
        ctx.beginPath();
        ctx.moveTo(xa, y(xa));
        for (let x = xa + 1; x < xb; x += 1) ctx.lineTo(x, y(x));
        ctx.lineTo(xb, y(xb));
        ctx.stroke();
      }
    };
    wave(h * 0.25);
    wave(h * 0.75);
  });
  k.slider('phase', (v) => {
    phase = v;
    s.draw();
    k.say(v === 0
      ? tr('переключение контраста стоит на вершинах — волна читается зигзагом.')
      : v >= 80
        ? tr('переключение сдвинуто с вершин — и зигзаг разгладился в синусоиду. Сама линия не менялась.')
        : '');
  });
  k.slider('amp', (v) => { amp = v; s.draw(); });
  k.slider('bg', (v) => { bg = v; s.draw(); });
});
