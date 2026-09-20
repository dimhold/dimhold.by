/* Внимание и незамечание. Единственная группа, где всё пропадает, а не появляется. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

/* Сцена рисуется процедурно, а не берётся фотографией: так изменение заведомо наше
   и его можно включать и выключать честно, без монтажа. */
const scene = (ctx: CanvasRenderingContext2D, w: number, h: number, variant: boolean) => {
  ctx.fillStyle = '#dfe6ee';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#9ab08a';
  ctx.fillRect(0, h * 0.68, w, h * 0.32);
  const r = rnd(23);
  const items: [number, number, number, string][] = [];
  for (let i = 0; i < 16; i++) items.push([r() * w, h * (0.2 + r() * 0.62), 12 + r() * 36, `hsl(${Math.round(r() * 360)} 45% 55%)`]);
  items.forEach(([x, y, size, col], i) => {
    /* В варианте один крупный предмет исчезает целиком. */
    if (variant && i === 5) return;
    ctx.fillStyle = col;
    if (i % 3 === 0) ctx.fillRect(x - size / 2, y - size / 2, size, size);
    else {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return items[5];
};

export const changeBlindness: Mount = demo((k) => {
  let running = false, variant = false, blank = false, t0 = 0, timer = 0, target: [number, number, number, string] | null = null;
  let reveal = false;
  const s = k.surface(({ ctx, w, h }) => {
    if (blank) {
      ctx.fillStyle = '#efefef';
      ctx.fillRect(0, 0, w, h);
      return;
    }
    target = scene(ctx, w, h, variant) as [number, number, number, string];
    if (reveal && target) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(target[0], target[1], target[2], 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  k.button('start', (el) => {
    running = !running;
    reveal = false;
    el.textContent = running ? 'остановить' : 'начать';
    if (!running) { clearInterval(timer); return; }
    t0 = performance.now();
    k.say('что-то на картинке исчезает и появляется. Ищите.');
    /* Пустая вставка между кадрами убирает резкий перепад, которым внимание
       обычно и притягивается к месту изменения. */
    let step = 0;
    clearInterval(timer);
    timer = window.setInterval(() => {
      step++;
      if (step % 2 === 1) { blank = true; }
      else { blank = false; variant = !variant; }
      s.draw();
      k.clock(`${((performance.now() - t0) / 1000).toFixed(1)} с`);
    }, 240);
  });
  k.button('give', () => {
    clearInterval(timer);
    running = false;
    blank = false;
    variant = false;
    reveal = true;
    s.draw();
    k.say(`искали ${((performance.now() - t0) / 1000).toFixed(1)} с. Предмет обведён — и он крупный, и он в середине кадра.`);
  });
});

const LETTERS = 'АБВГДЕЖЗИКЛМНПРСТУФХЦЧШЭЮЯ';

export const attentionalBlink: Mount = demo((k) => {
  const results: Record<number, [number, number]> = {};
  let showing = '';
  let colour = INK;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = colour;
    ctx.font = `bold ${Math.round(Math.min(w, h) * 0.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(showing, w / 2, h / 2);
  });
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const lags = Object.keys(results).map(Number).sort((a, b) => a - b);
    if (!lags.length) return;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    lags.forEach((lag, i) => {
      const [hit, n] = results[lag];
      const x = 20 + (i / Math.max(lags.length - 1, 1)) * (w - 40);
      const y = h - 14 - (hit / n) * (h - 28);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('задержка между целями →', 20, 12);
  });
  const stage = k.stage;
  const run = async () => {
    for (const lag of [1, 2, 3, 5, 7]) {
      for (let rep = 0; rep < 3; rep++) {
        const r = rnd(Date.now() % 100000 + lag * 7 + rep);
        const stream: string[] = [];
        for (let i = 0; i < 18; i++) stream.push(LETTERS[Math.floor(r() * LETTERS.length)]);
        const t1 = 5;
        const t2 = t1 + lag;
        stream[t1] = 'Ц';
        const second = LETTERS[Math.floor(r() * LETTERS.length)];
        stream[t2] = second;
        for (let i = 0; i < stream.length; i++) {
          showing = stream[i];
          colour = i === t1 ? MARK : INK;
          s.draw();
          await new Promise((res) => setTimeout(res, 100));
        }
        showing = '';
        s.draw();
        const answer = await ask(second);
        const cur = results[lag] ?? [0, 0];
        results[lag] = [cur[0] + (answer ? 1 : 0), cur[1] + 1];
        chart.draw();
      }
    }
    stage.innerHTML = '';
    k.say('кривая внизу — ваша. На задержке в две-четыре позиции точность проваливается: это и есть мигание внимания.');
  };
  const ask = (correct: string) =>
    new Promise<boolean>((resolve) => {
      const r = rnd(correct.charCodeAt(0));
      const opts = [correct];
      while (opts.length < 4) {
        const c = LETTERS[Math.floor(r() * LETTERS.length)];
        if (!opts.includes(c)) opts.push(c);
      }
      opts.sort(() => r() - 0.5);
      stage.innerHTML = '<p class="ill-q">какая буква шла после красной?</p>';
      const row = document.createElement('div');
      row.className = 'ill-answers';
      for (const o of opts) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ill-btn';
        b.textContent = o;
        b.onclick = () => { stage.innerHTML = ''; resolve(o === correct); };
        row.append(b);
      }
      stage.append(row);
    });
  k.button('start', (el) => { el.disabled = true; run(); });
});

export const crowding: Mount = demo((k) => {
  let ecc = 150, space = 40, seed = 3;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.12, cy = h / 2;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.stroke();
    const r = rnd(seed);
    const pick = () => LETTERS[Math.floor(r() * LETTERS.length)];
    ctx.fillStyle = INK;
    ctx.font = `${Math.round(Math.min(w, h) * 0.12)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const x = cx + ecc;
    ctx.fillText(pick(), x, cy);
    ctx.fillText(pick(), x - space, cy);
    ctx.fillText(pick(), x + space, cy);
  });
  k.slider('ecc', (v) => {
    ecc = v;
    s.draw();
    /* Закон Боумы: критическое расстояние примерно половина эксцентриситета. */
    k.say(`по закону Боумы на этом удалении соседям нужно отойти примерно на ${Math.round(v / 2)} px, чтобы буква стала читаемой. Проверьте вторым ползунком.`);
  });
  k.slider('space', (v) => { space = v; s.draw(); });
  k.button('reroll', () => { seed = (seed * 48271) % 2147483647; s.draw(); });
});
