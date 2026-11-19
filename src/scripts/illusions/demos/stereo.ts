/* Два глаза. Свободное сведение глаз даётся не всем, поэтому у всех трёх стереоэкспонатов
   есть анаглифный режим: красно-синие очки стоят копейки и работают у каждого. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { num, tr } from '../i18n';

/* Поле случайных точек со сдвинутым прямоугольником. Возвращает две карты. */
const rdsPair = (cols: number, rows: number, shift: number, seed = 5) => {
  const r = rnd(seed);
  const left: number[] = [];
  for (let i = 0; i < cols * rows; i++) left.push(r() > 0.5 ? 1 : 0);
  const right = left.slice();
  const x0 = Math.round(cols * 0.3), x1 = Math.round(cols * 0.7);
  const y0 = Math.round(rows * 0.3), y1 = Math.round(rows * 0.7);
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) right[y * cols + x] = left[y * cols + Math.min(cols - 1, x + shift)];
  return { left, right, box: [x0, y0, x1, y1] as const };
};

/* Две картинки рядом для свободного сведения. Между одинаковыми точками двух картинок
   не больше 240 CSS-пикселей — около 6 см, примерно расстояние между глазами: шире
   параллельным взглядом не свести. */
const GAP = 20, MAXW = 220;
const sideBySide = (w: number) => {
  const pw = Math.floor(Math.min((w - GAP) / 2, MAXW));
  const x0 = Math.round((w - 2 * pw - GAP) / 2);
  return { pw, xs: [x0, x0 + pw + GAP] };
};

export const randomDotStereogram: Mount = demo((k) => {
  let shift = 8, anaglyph = false, outline = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Точка — 2 CSS-пикселя, координаты целые: на дробных границах сглаживание рисует
       полосы, и картинки начинают различаться на глаз уже без всякого сдвига. */
    const cell = 2;
    const { pw, xs } = anaglyph ? { pw: Math.floor(w), xs: [0, 0] } : sideBySide(w);
    const cols = Math.floor(pw / cell);
    const rows = Math.floor(h / cell);
    const { left, right, box } = rdsPair(cols, rows, Math.max(1, Math.round(shift / cell)));
    const paint = (map: number[], x0: number, colour: (v: number) => string) => {
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          ctx.fillStyle = colour(map[y * cols + x]);
          ctx.fillRect(x0 + x * cell, y * cell, cell, cell);
        }
    };
    if (anaglyph) {
      ctx.globalCompositeOperation = 'source-over';
      paint(left, 0, (v) => (v ? '#ff0000' : '#000'));
      ctx.globalCompositeOperation = 'lighter';
      paint(right, 0, (v) => (v ? '#00ffff' : '#000'));
      ctx.globalCompositeOperation = 'source-over';
    } else {
      paint(left, xs[0], (v) => (v ? '#111' : '#eee'));
      paint(right, xs[1], (v) => (v ? '#111' : '#eee'));
    }
    if (outline) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      for (const x0 of anaglyph ? [0] : xs)
        ctx.strokeRect(x0 + box[0] * cell, box[1] * cell, (box[2] - box[0]) * cell, (box[3] - box[1]) * cell);
    }
  });
  k.slider('shift', (v) => { shift = v; s.draw(); });
  k.toggle('anaglyph', (v) => { anaglyph = v; s.draw(); });
  k.button('outline', (el) => {
    outline = !outline;
    el.textContent = outline ? tr('убрать обводку') : tr('обвести сдвинутую область');
    s.draw();
    k.say(outline ? tr('одним глазом в этом прямоугольнике не видно ровным счётом ничего: он отличается только сдвигом между картинками.') : '');
  });
});

export const autostereogram: Mount = demo((k) => {
  let period = 90, cross = false;
  const s = k.surface(({ ctx, w, h }) => {
    /* Классический алгоритм: период повторения текстуры по горизонтали кодирует
       глубину. Карта глубины своя — конус в середине. */
    /* Считаем в физических пикселях холста: putImageData не знает про setTransform. */
    const dpr = k.dpr;
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const img = ctx.createImageData(W, H);
    const r = rnd(11);
    const P = period * dpr;
    const same = new Int32Array(W);
    const pix = new Uint8Array(W);
    for (let y = 0; y < H; y++) {
      /* Для каждой точки — пара «левая и правая», которые должны совпасть по цвету. Ссылка
         всегда смотрит влево, поэтому, раскрашивая слева направо, цвет левой точки
         уже известен. */
      for (let x = 0; x < W; x++) same[x] = x;
      for (let x = 0; x < W; x++) {
        const dx = (x - W / 2) / (W * 0.22);
        const dy = (y - H / 2) / (H * 0.32);
        const d = Math.max(0, 1 - Math.hypot(dx, dy));
        const sep = Math.round(P * (1 - (cross ? -d : d) * 0.22));
        const l = x - (sep >> 1), rr = l + sep;
        if (l >= 0 && rr < W) same[rr] = l;
      }
      for (let x = 0; x < W; x++) {
        const v = same[x] === x ? (r() > 0.5 ? 235 : 30) : pix[same[x]];
        pix[x] = v;
        const i = (y * W + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    /* Пара направляющих точек: без них заметная доля людей глаза не сводит. */
    ctx.fillStyle = MARK;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(w / 2 + (sgn * period) / 2, 12, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('period', (v) => { period = v; s.draw(); });
  /* Переключатель вызывается и при запуске — с ним приходит и первая подсказка. */
  k.toggle('cross', (v) => {
    cross = v;
    s.draw();
    k.say(v ? tr('сведите глаза к переносице, пока две красные точки наверху не превратятся в три. Тогда в середине проступит конус.')
      : tr('смотрите как бы сквозь экран, вдаль, пока две красные точки наверху не превратятся в три. Тогда в середине проступит конус.'));
  });
});

export const binocularRivalry: Mount = demo((k) => {
  let anaglyph = false, holding = false, t0 = 0;
  const gaps: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    const { pw, xs } = anaglyph ? { pw: w, xs: [0, 0] } : sideBySide(w);
    /* Каждая картинка — в своих границах: полосы одного поля не должны заходить в другое. */
    const stripes = (x0: number, vertical: boolean, colour: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, pw, h);
      ctx.clip();
      ctx.fillStyle = colour;
      if (vertical) for (let x = x0; x < x0 + pw; x += 12) ctx.fillRect(x, 0, 6, h);
      else for (let y = 0; y < h; y += 12) ctx.fillRect(x0, y, pw, 6);
      ctx.restore();
    };
    if (anaglyph) {
      ctx.globalCompositeOperation = 'source-over';
      stripes(0, true, '#ff0000');
      ctx.globalCompositeOperation = 'lighter';
      stripes(0, false, '#00ffff');
      ctx.globalCompositeOperation = 'source-over';
    } else {
      stripes(xs[0], true, '#d84545');
      stripes(xs[1], false, '#3ba05a');
    }
  });
  const hist = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!gaps.length) return;
    const max = Math.max(...gaps, 1);
    const bw = w / Math.max(gaps.length, 12);
    ctx.fillStyle = MARK;
    gaps.forEach((g, i) => ctx.fillRect(i * bw + 1, h - (g / max) * (h - 4), bw - 2, (g / max) * (h - 4)));
  });
  k.toggle('anaglyph', (v) => { anaglyph = v; s.draw(); });
  k.space((down) => {
    if (down && !holding) { holding = true; t0 = performance.now(); }
    else if (!down && holding) {
      holding = false;
      gaps.push((performance.now() - t0) / 1000);
      hist.draw();
      const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      k.say(tr('периодов: {n}, в среднем {s} с. Столбики — ваши периоды по порядку. Сравните с кубом Неккера: у большинства разброс интервалов там похожей формы.', { n: gaps.length, s: num(mean) }));
    }
  });
  k.button('reset', () => { gaps.length = 0; hist.draw(); });
  k.say(tr('щёлкните по картинке, чтобы пробел попадал сюда, и держите его, пока целиком видна одна картинка.'));
});

export const chromostereopsis: Mount = demo((k) => {
  let bg = 0, sat = 100;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(bg / 100);
    ctx.fillRect(0, 0, w, h);
    const S = sat / 100;
    ctx.font = `bold ${Math.round(Math.min(w, h) * 0.2)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* Насыщенность — подмешивание серого, а не затемнение: яркость цвета не падает. */
    const on = Math.round(255 * S + 128 * (1 - S)), off = Math.round(128 * (1 - S));
    ctx.fillStyle = `rgb(${on} ${off} ${off})`;
    ctx.fillText(tr('красное'), w / 2, h * 0.34);
    ctx.fillStyle = `rgb(${off} ${off} ${on})`;
    ctx.fillText(tr('синее'), w / 2, h * 0.7);
  });
  k.slider('bg', (v) => {
    bg = v;
    s.draw();
    k.say(v > 40 ? tr('на светлом фоне порядок глубины часто переворачивается. У кого как — спрашивайте у соседа.') : tr('на чёрном фоне красное обычно впереди.'));
  });
  k.slider('sat', (v) => { sat = v; s.draw(); });
});
