/* Внимание и незамечание. Единственная группа, где всё пропадает, а не появляется. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { num, pageLang, tr } from '../i18n';

/* Сцена рисуется процедурно, а не берётся фотографией: так изменение заведомо наше
   и его можно включать и выключать честно, без монтажа. */
const scene = (ctx: CanvasRenderingContext2D, w: number, h: number, variant: boolean) => {
  ctx.fillStyle = '#dfe6ee';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#9ab08a';
  ctx.fillRect(0, h * 0.68, w, h * 0.32);
  const r = rnd(23);
  const items: [number, number, number, string][] = [];
  for (let i = 0; i < 40; i++) items.push([r() * w, h * (0.08 + r() * 0.84), 10 + r() * 30, `hsl(${Math.round(r() * 360)} 45% 55%)`]);
  /* Исчезающий предмет ставится руками: крупный и почти в центре кадра. Иначе
     обещание в подписи («он крупный, и он в середине») держалось бы на случайности. */
  items[5] = [w * 0.44, h * 0.47, Math.min(w, h) * 0.13, 'hsl(28 60% 52%)'];
  const [tx, ty, ts] = items[5];
  items.forEach(([x, y, size, col], i) => {
    /* В варианте один крупный предмет исчезает целиком. */
    if (variant && i === 5) return;
    /* Соседи его не перекрывают: изменение должно быть целым, а не выглядывать из-под других. */
    if (i !== 5 && Math.hypot(x - tx, y - ty) < (ts + size) / 2 + 6) return;
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
  const startBtn = k.button('start', (el) => {
    running = !running;
    reveal = false;
    el.textContent = running ? tr('остановить') : tr('начать');
    clearTimeout(timer);
    if (!running) { blank = false; s.draw(); return; }
    t0 = performance.now();
    k.say(tr('что-то на картинке исчезает и появляется. Ищите.'));
    /* Пустая вставка между кадрами убирает резкий перепад, которым внимание
       обычно и притягивается к месту изменения. Цикл как у Ренсинка (1997):
       кадр 240 мс, пустое поле 80 мс. */
    const tick = () => {
      if (blank) { blank = false; variant = !variant; }
      else blank = true;
      s.draw();
      k.clock(tr('{s} с', { s: num((performance.now() - t0) / 1000) }));
      timer = window.setTimeout(tick, blank ? 80 : 240);
    };
    timer = window.setTimeout(tick, 240);
  });
  k.button('give', () => {
    clearTimeout(timer);
    const was = running || t0 > 0;
    running = false;
    if (startBtn) startBtn.textContent = tr('начать');
    blank = false;
    variant = false;
    reveal = true;
    s.draw();
    if (was) k.say(tr('искали {s} с. Предмет обведён — и он крупный, и он в середине кадра.', { s: num((performance.now() - t0) / 1000) }));
    t0 = 0;
  });
});

/* Буквы — алфавит читателя: в чужом алфавите ищут уже не букву, а значок.
   Похожие на цифры и друг на друга (О, Й, Щ, Ъ, Ь; по-английски O, Q, I) убраны. */
const LETTERS =
  pageLang === 'en' ? 'ABCDEFGHJKLMNPRSTUVWXYZ'
  : pageLang === 'be' ? 'АБВГДЕЖЗІКЛМНПРСТУФХЦЧШЭЮЯ'
  : 'АБВГДЕЖЗИКЛМНПРСТУФХЦЧШЭЮЯ';
/* Вторая цель — цифра среди букв (как у Чана и Поттер, 1995). Цифры, похожие на
   буквы своего алфавита, убраны: по-русски 3 и 6 (З, Б), по-английски 2, 5 и 8 (Z, S, B). */
const DIGITS = pageLang === 'en' ? '34679' : '24579';

export const attentionalBlink: Mount = demo((k) => {
  /* По каждой задержке: [вторая цель названа верно при верной первой, всего проб с верной первой]. */
  const results: Record<number, [number, number]> = {};
  const LAGS = [1, 2, 3, 5, 7];
  let showing = '';
  let colour = INK;
  const frames: number[] = [];
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
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(tr('задержка между целями →'), 20, 12);
    /* Ось задержек подписана: точки стоят по номерам позиций, а не просто по порядку. */
    const xAt = (lag: number) => 20 + ((lag - 1) / 6) * (w - 40);
    ctx.textAlign = 'center';
    for (const lag of LAGS) ctx.fillText(String(lag), xAt(lag), h - 2);
    const lags = LAGS.filter((lag) => results[lag]?.[1]);
    if (!lags.length) return;
    const yAt = (lag: number) => h - 18 - (results[lag][0] / results[lag][1]) * (h - 36);
    ctx.strokeStyle = MARK;
    ctx.fillStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    lags.forEach((lag, i) => (i ? ctx.lineTo(xAt(lag), yAt(lag)) : ctx.moveTo(xAt(lag), yAt(lag))));
    ctx.stroke();
    for (const lag of lags) {
      ctx.beginPath();
      ctx.arc(xAt(lag), yAt(lag), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const stage = k.stage;
  /* Кадры сменяются по requestAnimationFrame: смена приходится ровно на обновление
     экрана, а настоящая длительность каждого кадра записывается. */
  const play = (stream: string[], red: number) =>
    new Promise<void>((resolve) => {
      let i = -1, since = 0;
      const step = (now: number) => {
        if (i < 0 || now - since >= 100 - 8) {
          if (i >= 0) frames.push(now - since);
          i++;
          since = now;
          if (i >= stream.length) { showing = ''; s.draw(); resolve(); return; }
          showing = stream[i];
          colour = i === red ? MARK : INK;
          s.draw();
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  const run = async () => {
    const order: number[] = [];
    for (const lag of LAGS) for (let rep = 0; rep < 3; rep++) order.push(lag);
    const shuffle = rnd(Date.now() % 100000);
    order.sort(() => shuffle() - 0.5);
    for (const [n, lag] of order.entries()) {
      const r = rnd(Date.now() % 100000 + lag * 7 + n);
      const stream: string[] = [];
      for (let i = 0; i < 18; i++) stream.push(LETTERS[Math.floor(r() * LETTERS.length)]);
      const t1 = 5 + Math.floor(r() * 3);
      const t2 = t1 + lag;
      const first = stream[t1];
      const second = DIGITS[Math.floor(r() * DIGITS.length)];
      stream[t2] = second;
      await play(stream, t1);
      const a1 = await ask(tr('какая буква была красной?'), first, LETTERS);
      const a2 = await ask(tr('а какая цифра мелькнула после неё?'), second, DIGITS);
      /* Мигание меряется как у Реймонд с соавторами: вторая цель засчитывается
         только в пробах, где первая названа верно. */
      if (a1) {
        const cur = results[lag] ?? [0, 0];
        results[lag] = [cur[0] + (a2 ? 1 : 0), cur[1] + 1];
      }
      chart.draw();
    }
    stage.innerHTML = '';
    const mean = frames.reduce((x, y) => x + y, 0) / Math.max(frames.length, 1);
    k.say(tr('кривая внизу — ваша: доля верно названных цифр при верно названной красной букве. На задержке в две-четыре позиции точность обычно проваливается: это и есть мигание внимания. Кадр в среднем длился {ms} мс.', { ms: Math.round(mean) }));
  };
  const ask = (q: string, correct: string, pool: string) =>
    new Promise<boolean>((resolve) => {
      const r = rnd(correct.charCodeAt(0) + frames.length);
      const opts = [correct];
      while (opts.length < 4) {
        const c = pool[Math.floor(r() * pool.length)];
        if (!opts.includes(c)) opts.push(c);
      }
      opts.sort(() => r() - 0.5);
      stage.innerHTML = `<p class="ill-q">${q}</p>`;
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
    /* На узком экране удаление и промежуток сжимаются одним множителем: закон Боумы —
       это отношение, и оно от масштаба не зависит, а дальний сосед остаётся на холсте. */
    const fitK = Math.min(1, (w - cx - Math.min(w, h) * 0.08) / (ecc + space));
    const x = cx + ecc * fitK;
    ctx.fillText(pick(), x, cy);
    ctx.fillText(pick(), x - space * fitK, cy);
    ctx.fillText(pick(), x + space * fitK, cy);
  });
  k.slider('ecc', (v) => {
    ecc = v;
    s.draw();
    /* Закон Боумы: критическое расстояние примерно половина эксцентриситета. */
    k.say(tr('по закону Боумы на этом удалении соседям нужно отойти примерно на {px} px, чтобы буква стала читаемой. Проверьте вторым ползунком.', { px: Math.round(v / 2) }));
  });
  k.slider('space', (v) => { space = v; s.draw(); });
  k.button('reroll', () => { seed = (seed * 48271) % 2147483647; s.draw(); });
});
