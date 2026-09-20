/* Два глаза. Свободное сведение глаз даётся не всем, поэтому у всех трёх стереоэкспонатов
   есть анаглифный режим: красно-синие очки стоят копейки и работают у каждого. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

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

export const randomDotStereogram: Mount = demo((k) => {
  let shift = 8, anaglyph = false, outline = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cell = 3;
    const pw = anaglyph ? w : (w - 20) / 2;
    const cols = Math.floor(pw / cell);
    const rows = Math.floor(h / cell);
    const { left, right, box } = rdsPair(cols, rows, shift);
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
      paint(left, 0, (v) => (v ? '#111' : '#eee'));
      paint(right, pw + 20, (v) => (v ? '#111' : '#eee'));
    }
    if (outline) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.strokeRect(box[0] * cell, box[1] * cell, (box[2] - box[0]) * cell, (box[3] - box[1]) * cell);
      if (!anaglyph) ctx.strokeRect(pw + 20 + box[0] * cell, box[1] * cell, (box[2] - box[0]) * cell, (box[3] - box[1]) * cell);
    }
  });
  k.slider('shift', (v) => { shift = v; s.draw(); });
  k.toggle('anaglyph', (v) => { anaglyph = v; s.draw(); });
  k.button('outline', (el) => {
    outline = !outline;
    el.textContent = outline ? 'убрать обводку' : 'обвести сдвинутую область';
    s.draw();
    k.say(outline ? 'одним глазом в этом прямоугольнике не видно ровным счётом ничего: он отличается только сдвигом между картинками.' : '');
  });
});

export const autostereogram: Mount = demo((k) => {
  let period = 90, cross = false;
  const s = k.surface(({ ctx, w, h }) => {
    /* Классический алгоритм: период повторения текстуры по горизонтали кодирует
       глубину. Карта глубины своя — конус в середине. */
    const img = ctx.createImageData(Math.round(w), Math.round(h));
    const r = rnd(11);
    const noise: number[] = [];
    for (let i = 0; i < Math.round(w) * Math.round(h); i++) noise.push(r() > 0.5 ? 235 : 30);
    const W = Math.round(w), H = Math.round(h);
    const same = new Int32Array(W);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) same[x] = x;
      for (let x = 0; x < W; x++) {
        const dx = (x - W / 2) / (W * 0.22);
        const dy = (y - H / 2) / (H * 0.32);
        const d = Math.max(0, 1 - Math.hypot(dx, dy));
        const sep = Math.round(period * (1 - (cross ? -d : d) * 0.22));
        const l = x - sep / 2, rr = l + sep;
        if (l >= 0 && rr < W) {
          let a = same[l], b = rr;
          while (a !== b) { if (a < b) b = a; else a = same[a]; }
          same[rr] = a;
        }
      }
      for (let x = W - 1; x >= 0; x--) {
        const v = same[x] === x ? noise[y * W + x] : noise[y * W + same[x]];
        noise[y * W + x] = v;
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
  k.toggle('cross', (v) => {
    cross = v;
    s.draw();
    k.say('сведите глаза так, чтобы две красные точки наверху слились в три. Тогда в середине проступит конус.');
  });
});

export const binocularRivalry: Mount = demo((k) => {
  let anaglyph = false, holding = false, t0 = 0;
  const gaps: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    const pw = anaglyph ? w : (w - 20) / 2;
    const stripes = (x0: number, vertical: boolean, colour: string) => {
      ctx.fillStyle = colour;
      for (let i = 0; i < 40; i++) {
        if (vertical) ctx.fillRect(x0 + i * 12, 0, 6, h);
        else ctx.fillRect(x0, i * 12, pw, 6);
      }
    };
    if (anaglyph) {
      ctx.globalCompositeOperation = 'source-over';
      stripes(0, true, '#ff0000');
      ctx.globalCompositeOperation = 'lighter';
      stripes(0, false, '#00ffff');
      ctx.globalCompositeOperation = 'source-over';
    } else {
      stripes(0, true, '#d84545');
      stripes(pw + 20, false, '#3ba05a');
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
      k.say(`${gaps.length} периодов, в среднем ${mean.toFixed(1)} с. Сравните с вашим же кубом Неккера — форма распределения у них одинаковая.`);
    }
  });
  k.button('reset', () => { gaps.length = 0; hist.draw(); });
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
    ctx.fillStyle = `rgb(${Math.round(255 * S)} 0 0)`;
    ctx.fillText('красное', w / 2, h * 0.34);
    ctx.fillStyle = `rgb(0 0 ${Math.round(255 * S)})`;
    ctx.fillText('синее', w / 2, h * 0.7);
  });
  k.slider('bg', (v) => {
    bg = v;
    s.draw();
    k.say(v > 40 ? 'на светлом фоне порядок глубины часто переворачивается. У кого как — спрашивайте у соседа.' : 'на чёрном фоне красное обычно впереди.');
  });
  k.slider('sat', (v) => { sat = v; s.draw(); });
});
