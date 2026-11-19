/* Движение. Почти всё здесь упирается в задачу апертуры: край, видимый в окошке, своего
   направления не сообщает, и систему приходится доукомплектовывать догадками. */
import { demo, grey, INK, MARK, PAPER, plural, rnd, type Mount } from '../kit';
import { num, tr } from '../i18n';

export const barberpole: Mount = demo((k) => {
  let aspect = 60, angle = 45, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Окно вписывается в холст при любых пропорциях: широкое не должно уходить за край. */
    const fit = Math.min((h * 0.9) / 100, (w * 0.9) / aspect);
    const ah = 100 * fit;
    const aw = aspect * fit;
    const x0 = (w - aw) / 2, y0 = (h - ah) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, aw, ah);
    ctx.clip();
    ctx.translate(x0 + aw / 2, y0 + ah / 2);
    ctx.rotate((angle * Math.PI) / 180);
    const R = Math.hypot(aw, ah);
    const period = 26;
    /* Физическое движение всегда одно и то же — перпендикулярно полосам. */
    for (let y = -R; y < R; y += period) {
      ctx.fillStyle = INK;
      ctx.fillRect(-R, y + ((t * 40) % period), R * 2, period / 2);
    }
    ctx.restore();
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0, y0, aw, ah);
  });
  k.slider('aspect', (v) => { aspect = v; s.draw(); });
  k.slider('angle', (v) => { angle = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
  k.say(tr('движение полос не меняется ни разу. Меняются только пропорции окна — и вместе с ними видимое направление.'));
});

export const breathingSquare: Mount = demo((k) => {
  let reveal = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const m = Math.min(w, h);
    /* Жёсткий квадрат вращается с постоянной скоростью; размер у него один всё время. */
    const a = m * 0.3;
    const rot = t * 0.8;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = '#3b5fd0';
    ctx.fillRect(-a, -a, a * 2, a * 2);
    ctx.restore();
    /* Четыре заслонки по диагоналям прячут углы квадрата, когда те смотрят в диагональ.
       Видно только то, что попадает в крест между ними, — и оно то выезжает, то уходит. */
    const arm = m * 0.2;
    ctx.fillStyle = reveal ? 'rgb(214 200 120 / 0.45)' : '#d6c878';
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
      const x = sx > 0 ? cx + arm : 0;
      const y = sy > 0 ? cy + arm : 0;
      ctx.fillRect(x, y, sx > 0 ? w - cx - arm : cx - arm, sy > 0 ? h - cy - arm : cy - arm);
    }
    if (reveal) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(-a, -a, a * 2, a * 2);
      ctx.restore();
    }
  });
  k.button('trails', (el) => {
    reveal = !reveal;
    el.textContent = reveal ? tr('спрятать квадрат') : tr('показать квадрат целиком');
    k.say(reveal ? tr('квадрат жёсткий и просто вращается с постоянной скоростью. Размер у него не меняется ни на пиксель.') : '');
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const enigma: Mount = demo((k) => {
  let lines = 220, ringw = 18;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.48;
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i < lines; i++) {
      const a = (i / lines) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + R * 0.14 * Math.cos(a), cy + R * 0.14 * Math.sin(a));
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.stroke();
    }
    /* Геометрия своя: картина Левианта под авторским правом и не обводится. */
    const cols = ['#5a7fd0', '#b8538c', '#4f9e6a'];
    ctx.lineWidth = ringw;
    cols.forEach((c, i) => {
      ctx.strokeStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, R * (0.34 + i * 0.2), 0, Math.PI * 2);
      ctx.stroke();
    });
  });
  k.slider('lines', (v) => { lines = v; s.draw(); });
  k.slider('ring', (v) => { ringw = v; s.draw(); });
  k.say(tr('в кольцах начинается быстрое течение. Скорость этого течения почти совпадает с частотой ваших микросаккад.'));
});

export const frequencyDoubling: Mount = demo((k) => {
  let freq = 3, rate = 18, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    const phase = Math.sin(t * rate * Math.PI * 2) > 0 ? 0 : Math.PI;
    for (let x = 0; x < w; x++) {
      const v = 0.5 + 0.45 * Math.sin((x / w) * Math.PI * 2 * freq + phase);
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
  });
  k.slider('freq', (v) => { freq = v; s.draw(); });
  k.slider('rate', (v) => { rate = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
  k.say(tr('пересчитайте тёмные полосы. Нарисовано их столько, сколько стоит на первом ползунке, а видно вдвое больше.'));
});

export const kineticDepth: Mount = demo((k) => {
  let spin = true, n = 200, t = 0;
  const pts: [number, number][] = [];
  const re = (count: number) => {
    pts.length = 0;
    const r = rnd(42);
    for (let i = 0; i < count; i++) pts.push([r() * Math.PI * 2, r() * 2 - 1]);
  };
  re(n);
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.38;
    ctx.fillStyle = INK;
    /* Ортографическая проекция цилиндра: стоящее облако плоское, едущее — объёмное. */
    for (const [a, z] of pts) {
      const ang = a + (spin ? t * 0.7 : 0);
      ctx.beginPath();
      ctx.arc(cx + R * Math.cos(ang), cy + R * 0.9 * z, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.toggle('spin', (v) => {
    spin = !v;
    s.draw();
    k.say(v ? tr('остановлено — плоская россыпь, и формы в ней нет никакой.') : tr('цилиндр. Направление вращения при этом само переворачивается: бонусом вторая иллюзия.'));
  });
  k.slider('dots', (v) => { n = v; re(n); s.draw(); });
  k.loop((now) => { if (spin) { t = now; s.draw(); } });
});

export const motionAftereffect: Mount = demo((k) => {
  let phase = 0, mode: 'idle' | 'adapt' | 'test' = 'idle', t0 = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    /* Спираль: при адаптации крутится, в пробе стоит. */
    ctx.strokeStyle = INK;
    ctx.lineWidth = 9;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 12; a += 0.05) {
      const r = (a / (Math.PI * 12)) * R;
      const x = cx + r * Math.cos(a + phase);
      const y = cy + r * Math.sin(a + phase);
      a ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  /* Одна кнопка на три состояния, и обработчик у неё один: второй обработчик на той же
     кнопке сначала перезапускал бы адаптацию и обнулял секундомер. */
  const btn = k.button('go', (el) => {
    if (mode === 'adapt') return;
    if (mode === 'test') {
      k.say(tr('{n} с последействия. Это ваше число, не из учебника.', { n: num((performance.now() - t0) / 1000, 1) }));
      mode = 'idle';
      el.textContent = tr('адаптироваться 60 с');
      return;
    }
    mode = 'adapt';
    t0 = performance.now();
    el.textContent = tr('идёт адаптация');
    k.say(tr('смотрите строго в красную точку, не отводя взгляд.'));
  });
  k.loop((now) => {
    if (mode === 'adapt') {
      const el = performance.now() - t0;
      phase = now * 1.4;
      k.clock(tr('{n} с', { n: num(Math.max(0, 60 - el / 1000), 0) }));
      if (el > 60000) {
        mode = 'test';
        t0 = performance.now();
        k.say(tr('теперь картинка стоит. Держите взгляд и жмите кнопку, когда последействие закончится.'));
        if (btn) btn.textContent = tr('последействие кончилось');
      }
      s.draw();
    } else if (mode === 'test') {
      k.clock(tr('{n} с', { n: num((performance.now() - t0) / 1000, 1) }));
    }
  });
});

export const motionBinding: Mount = demo((k) => {
  let occl = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#1c1c22';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.36;
    /* Ромб ездит по небольшой окружности, как у Лоренсо и Шиффрар. */
    const dx = Math.cos(t * 2.4) * R * 0.12;
    const dy = Math.sin(t * 2.4) * R * 0.12;
    ctx.save();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy + dy - R);
    ctx.lineTo(cx + dx + R, cy + dy);
    ctx.lineTo(cx + dx, cy + dy + R);
    ctx.lineTo(cx + dx - R, cy + dy);
    ctx.closePath();
    ctx.stroke();
    /* Заслонки стоят на вершинах и прячут их на всём пути: видны только середины
       сторон, и ни одного угла, по которому ромб можно было бы узнать. */
    ctx.fillStyle = occl ? '#4a4a55' : '#1c1c22';
    const bw = R * 0.66;
    for (const [ox, oy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const)
      ctx.fillRect(cx + ox * R - bw / 2, cy + oy * R - bw / 2, bw, bw);
    ctx.restore();
  });
  k.toggle('occl', (v) => {
    occl = v;
    k.say(v ? tr('заслонки видны — и четыре отрезка мгновенно собрались в один ромб за ними.') : tr('заслонок не видно — четыре независимые линии, каждая со своим движением.'));
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const motionInducedBlindness: Mount = demo((k) => {
  let speed = 25, t = 0, holding = false, t0 = 0;
  const gaps: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#10131c';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#3b5fd0';
    ctx.lineWidth = 2;
    const r = rnd(7);
    for (let i = 0; i < 160; i++) {
      const a = r() * Math.PI * 2 + (t * speed) / 60;
      const rad = r() * Math.min(w, h) * 0.48;
      const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
      ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
      ctx.stroke();
    }
    ctx.fillStyle = '#f5d020';
    for (const a of [-Math.PI / 2, Math.PI / 6, (Math.PI * 5) / 6]) {
      ctx.beginPath();
      ctx.arc(cx + Math.min(w, h) * 0.26 * Math.cos(a), cy + Math.min(w, h) * 0.26 * Math.sin(a), 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  const c = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!gaps.length) return;
    const max = Math.max(...gaps, 1);
    ctx.fillStyle = MARK;
    gaps.forEach((g, i) => {
      const bw = w / Math.max(gaps.length, 12);
      ctx.fillRect(i * bw + 1, h - (g / max) * (h - 4), bw - 2, (g / max) * (h - 4));
    });
  });
  k.slider('speed', (v) => { speed = v; });
  k.space((down) => {
    if (down && !holding) { holding = true; t0 = performance.now(); }
    else if (!down && holding) {
      holding = false;
      gaps.push((performance.now() - t0) / 1000);
      c.draw();
      const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      k.say(tr('{count}, в среднем {m} с. Столбики внизу — ваши, не из статьи.', {
        count: plural(gaps.length, tr('{n} исчезновение'), tr('{n} исчезновения'), tr('{n} исчезновений')),
        m: num(mean, 1),
      }));
    }
  });
  k.button('reset', () => { gaps.length = 0; c.draw(); k.say(tr('счёт сброшен.')); });
  k.loop((now) => { t = now; s.draw(); });
});

export const ouchi: Mount = demo((k) => {
  let aspect = 400, inset = 34, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const unit = Math.max(6, Math.min(w, h) / 40);
    const tall = (unit * aspect) / 100;
    const patch = (x0: number, y0: number, ww: number, hh: number, cw: number, ch: number, dx: number, dy: number) => {
      for (let y = 0; y * ch < hh + ch; y++)
        for (let x = 0; x * cw < ww + cw; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#111' : '#fff';
          ctx.fillRect(x0 + x * cw + dx, y0 + y * ch + dy, cw, ch);
        }
    };
    /* Покачивается вся картинка целиком, фон и вставка вместе, — иначе пришлось бы
       трясти экран. Двигать одну вставку нельзя: тогда она ездила бы по-настоящему. */
    const dx = Math.sin(t * 2) * 3, dy = Math.cos(t * 2) * 3;
    const o = -2 * tall;
    ctx.save();
    patch(o, o, w - o, h - o, unit, tall, dx, dy);
    ctx.beginPath();
    ctx.arc(w / 2 + dx, h / 2 + dy, (Math.min(w, h) * inset) / 200, 0, Math.PI * 2);
    ctx.clip();
    patch(o, o, w - o, h - o, tall, unit, dx, dy);
    ctx.restore();
  });
  k.slider('aspect', (v) => {
    aspect = v;
    s.draw();
    k.say(v === 100 ? tr('клетки квадратные — разводить нечего, и вставка легла на фон.') : '');
  });
  k.slider('inset', (v) => { inset = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});

/* Общий рисовальщик для «Вращающихся змей», периферического дрейфа и
   Фрейзера — Уилкокса: кольца строятся по опубликованному правилу яркости, а не
   обводятся с чужой картинки, поэтому само правило становится ручкой. */
const driftRings = (rings: number, alternate: boolean): Mount =>
  demo((k) => {
    let order = 1, rg = rings;
    /* Четырёхшаговая последовательность Китаоки: чёрный — синий — белый — жёлтый, то есть
       чёрный, тёмный, белый, светлый. Её несимметричность и порождает ложный сигнал:
       дрейф идёт от чёрного к синему и от белого к жёлтому. Обратный порядок даёт
       обратный дрейф, а симметричный (чёрный — синий — белый — синий) — никакого.
       Простой сдвиг четвёрки ничего бы не дал: по кругу это та же самая последовательность. */
    const K = '#101010', B = '#2b4ea8', W = '#f2f2f2', Y = '#e8c53a';
    const orders: Record<number, string[]> = { 1: [K, B, W, Y], 0: [K, B, W, B], [-1]: [K, Y, W, B] };
    const s = k.surface(({ ctx, w, h }) => {
      ctx.fillStyle = grey(0.55);
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.46;
      const dr = R / (rg + 1);
      for (let ri = 0; ri < rg; ri++) {
        const r0 = dr * (ri + 1);
        const r1 = dr * (ri + 2);
        /* У «Змей» соседние кольца зеркальны и ползут навстречу друг другу. */
        const seq = alternate && ri % 2 ? [...orders[order]].reverse() : orders[order];
        /* Число элементов растёт с радиусом, чтобы они везде были примерно одной формы. */
        const n = Math.max(6, Math.round((Math.PI * 2 * (r0 + r1)) / 2 / (dr * 0.7) / 4));
        const steps = n * 4;
        for (let i = 0; i < steps; i++) {
          const b0 = (i / steps) * Math.PI * 2;
          const b1 = ((i + 1) / steps) * Math.PI * 2 + 0.002;
          ctx.fillStyle = seq[i % 4];
          ctx.beginPath();
          ctx.arc(cx, cy, r1, b0, b1);
          ctx.arc(cx, cy, r0, b1, b0, true);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.fillStyle = MARK;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    k.slider('seq', (v) => {
      order = v;
      s.draw();
      k.say(
        v === 0 ? tr('порядок симметричный: чёрный — синий — белый — синий. Направлению взяться неоткуда, и дрейф пропал.')
        : v < 0 ? tr('порядок обращён — и дрейф пошёл в обратную сторону. Смотрите в красную точку: там, куда вы смотрите, движение останавливается.')
        : tr('смотрите в красную точку: боковым зрением кольца ползут от чёрного к синему и от белого к жёлтому, а там, куда вы смотрите, движение останавливается.'),
      );
    });
    k.slider('rings', (v) => { rg = v; s.draw(); });
  });

export const rotatingSnakes = driftRings(5, true);
export const peripheralDrift = driftRings(4, false);

/* Две вспышки дают бета-движение и последовательность, но не фи: при любой паузе между
   ними видна точка, которая переезжает. Чистое фи показывают на «маг-фи» Стейнмана и
   Пизло: кольцо точек, из которого по очереди пропадает одна. Медленно — точка
   перескакивает в пустое место (бета), быстро — по кругу бежит бесформенная тень (фи). */
export const phiBeta: Mount = demo((k) => {
  let frame = 150, t0 = performance.now();
  const n = 8;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const m = Math.min(w, h);
    const gap = Math.floor((performance.now() - t0) / frame) % n;
    ctx.fillStyle = INK;
    for (let i = 0; i < n; i++) {
      if (i === gap) continue;
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx + m * 0.36 * Math.cos(a), cy + m * 0.36 * Math.sin(a), m * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('isi', (v) => {
    frame = v;
    t0 = performance.now();
    k.say(
      v > 400 ? tr('совсем медленно: точки просто гаснут и загораются по очереди, движение слабеет и распадается.')
      : v > 100 ? tr('бета-движение: видно, как точка перепрыгивает в пустое место. Именно это, а не фи, держит кино.')
      : tr('чистое фи: по кругу бежит что-то вроде тени, а ни одна точка не движется.'),
    );
  });
  k.loop(() => s.draw());
});

export const pinnaBrelstaff: Mount = demo((k) => {
  let zoom = true, tilt = 22, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const base = Math.min(w, h) * 0.33;
    const scale = zoom ? 1 + Math.sin(t * 0.8) * 0.25 : 1;
    /* Элемент Пинны — Брелстаффа: квадратик цвета фона, у которого две соседние стороны
       белые, две другие чёрные. Всё решает эта полярность краёв, а не шашечка внутри.
       Во внутреннем кольце элемент зеркальный — поэтому кольца и крутятся навстречу. */
    for (const [ri, sgn] of [[0.62, 1], [1, -1]] as const) {
      const R = base * ri * scale;
      const n = Math.round(36 * ri);
      const q = base * 0.07 * scale;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        ctx.save();
        ctx.translate(cx + R * Math.cos(a), cy + R * Math.sin(a));
        ctx.rotate(a);
        ctx.scale(1, sgn);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.lineWidth = q * 0.35;
        ctx.lineCap = 'square';
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-q, q); ctx.lineTo(-q, -q); ctx.lineTo(q, -q);
        ctx.stroke();
        ctx.strokeStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(q, -q); ctx.lineTo(q, q); ctx.lineTo(-q, q);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  k.toggle('zoom', (v) => {
    zoom = !v;
    k.say(v ? tr('приближение остановлено — подвигайтесь к экрану и обратно сами.') : tr('кольца крутятся навстречу друг другу. Картинка при этом только масштабируется.'));
  });
  k.slider('tilt', (v) => { tilt = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});

export const reversePhi: Mount = demo((k) => {
  let invert = false, stroke = false, speed = 8, frame = 0, acc = 0;
  const period = 40;
  const s = k.surface(({ ctx, w, h }) => {
    /* Три режима на одних и тех же полосах.
       Непрерывный сдвиг на пятую часть периода; с инверсией через кадр — обратное фи.
       «Только два кадра» без инверсии — двухтактное движение Мэзера: кадр, кадр со сдвигом
       на четверть периода, короткая пустая пауза средне-серым, и снова первый кадр.
       Пауза на обратном ходе переворачивает его видимое направление.
       «Только два кадра» с инверсией — четырёхтактное движение Анстиса и Роджерса: два
       положения, а контраст обращается на каждом обратном ходе. */
    let shift: number, flip = false;
    if (!stroke) {
      shift = (frame * 8) % period;
      flip = invert && frame % 2 === 1;
    } else if (!invert) {
      const f = frame % 3;
      if (f === 2) { ctx.fillStyle = grey(0.5); ctx.fillRect(0, 0, w, h); return; }
      shift = f * (period / 4);
    } else {
      const f = frame % 4;
      shift = (f % 2) * 8;
      flip = f >= 2;
    }
    for (let x = -period; x < w + period; x += period) {
      ctx.fillStyle = flip ? '#111' : '#eee';
      ctx.fillRect(x + shift, 0, period / 2, h);
      ctx.fillStyle = flip ? '#eee' : '#111';
      ctx.fillRect(x + shift + period / 2, 0, period / 2, h);
    }
  });
  const sayState = () => k.say(
    !stroke
      ? (invert ? tr('узор физически едет вправо, а видно, что влево. Инвертирован только знак контраста.') : tr('узор едет вправо.'))
      : invert
        ? tr('всего два положения, и контраст обращается на каждом обратном ходе — узор при этом безостановочно едет вправо.')
        : tr('всего два кадра и пустая пауза перед возвратом — а узор безостановочно едет вправо. Это двухтактное движение.'),
  );
  k.toggle('invert', (v) => { invert = v; frame = 0; sayState(); });
  k.toggle('stroke', (v) => { stroke = v; frame = 0; sayState(); });
  /* Скорость — частота кадров: от 3 до 60 в секунду. На 8 кадр длится около 42 мс,
     как у Мэзера. */
  k.slider('speed', (v) => { speed = v; });
  k.loop((_, dt) => {
    acc += dt;
    const step = 1 / (speed * 3);
    if (acc >= step - 0.002) { acc = Math.max(0, Math.min(acc - step, step)); frame++; s.draw(); }
  });
});

export const rogetPalisade: Mount = demo((k) => {
  let slat = 10, gap = 8, rate = 12, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.44;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + (t * rate) / 12;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.stroke();
    }
    /* Колесо катится: относительно его оси забор едет со скоростью обода, ωR. Едет здесь
       забор, а не колесо, — так ось остаётся в середине холста. Без этого сдвига спицы в
       просветах в любой момент лежат на прямой, и изгибаться нечему. */
    if (slat > 0) {
      const pitch = slat + gap;
      const off = (((-(t * rate) / 12) * R) % pitch + pitch) % pitch;
      ctx.fillStyle = '#6f6f78';
      for (let x = off - pitch; x < w; x += pitch) ctx.fillRect(x, 0, slat, h);
    }
  });
  k.slider('slat', (v) => {
    slat = v;
    s.draw();
    k.say(v === 0 ? tr('планок нет — спицы прямые.') : tr('в просветах спицы выгибаются дугой, и по разные стороны от оси — в разные стороны.'));
  });
  k.slider('gap', (v) => { gap = v; s.draw(); });
  k.slider('rate', (v) => { rate = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});

export const rotatingCircles: Mount = demo((k) => {
  let trails = false, t = 0;
  const n = 8;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.4;
    /* Каждый круг качается по своей прямой через центр, и ни один не вращается. Прямые
       повёрнуты одна относительно другой на 180°/n, и на столько же сдвинуты фазы качания:
       вместе круги всё время лежат на окружности, которая катится внутри большой. */
    if (trails) {
      ctx.strokeStyle = '#c9ccd4';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      for (let i = 0; i < n; i++) {
        const th = (i / n) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx - R * Math.cos(th), cy - R * Math.sin(th));
        ctx.lineTo(cx + R * Math.cos(th), cy + R * Math.sin(th));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    ctx.fillStyle = MARK;
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI;
      const p = R * Math.cos(t * 1.6 - th);
      ctx.beginPath();
      ctx.arc(cx + p * Math.cos(th), cy + p * Math.sin(th), Math.min(w, h) * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.button('trails', (el) => {
    trails = !trails;
    el.textContent = trails ? tr('убрать следы') : tr('показать следы');
    k.say(trails ? tr('следы прямые.') : '');
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const silencing: Mount = demo((k) => {
  let speed = 30, what = 'hue', frozen = false, t = 0, phase = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#16161c';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.38;
    const n = 40;
    for (let ring = 0; ring < 2; ring++)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (frozen ? 0 : (t * speed) / 60) * (ring ? -1 : 1);
        const rr = R * (ring ? 0.62 : 1);
        /* Изменения идут всегда с одной и той же частотой: их темп от вращения
           не зависит ни в одном режиме. */
        const c = (phase * 2 + i * 0.13) % 1;
        ctx.fillStyle =
          what === 'hue' ? `hsl(${c * 360} 80% 60%)`
          : what === 'lum' ? grey(0.25 + c * 0.7)
          : '#e2e2e8';
        const size = what === 'size' ? 4 + c * 10 : 8;
        ctx.beginPath();
        ctx.arc(cx + rr * Math.cos(a), cy + rr * Math.sin(a), size, 0, Math.PI * 2);
        ctx.fill();
      }
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('speed', (v) => { speed = v; });
  k.select('what', (v) => { what = v; });
  k.button('freeze', (el) => {
    frozen = !frozen;
    el.textContent = frozen ? tr('снова вращать') : tr('остановить вращение');
    k.say(frozen ? tr('вращение стоит — и изменения стали очевидны. Их частота не менялась ни на герц.') : '');
  });
  k.loop((now, dt) => { t = now; phase += dt * 1.6; s.draw(); });
});

export const steppingFeet: Mount = demo((k) => {
  let a = 90, b = 12, stripe = 100, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    const period = 46;
    for (let x = -period; x < w + period; x += period) {
      ctx.fillStyle = grey(0.5 + (stripe / 100) * 0.45);
      ctx.fillRect(x, 0, period / 2, h);
      ctx.fillStyle = grey(0.5 - (stripe / 100) * 0.45);
      ctx.fillRect(x + period / 2, 0, period / 2, h);
    }
    /* Скорость у обоих прямоугольников одна: одна переменная на два. */
    /* Ширина ровно в два периода: передний и задний край всегда на полосах одного цвета,
       иначе контраст на них менялся бы в противофазе и шаг смазывался. */
    const bw = period * 2;
    const x = ((t * 60) % (w + bw * 2)) - bw;
    ctx.fillStyle = grey(a / 100);
    ctx.fillRect(x, h * 0.2, bw, h * 0.22);
    ctx.fillStyle = grey(b / 100);
    ctx.fillRect(x, h * 0.58, bw, h * 0.22);
  });
  k.slider('a', (v) => { a = v; });
  k.slider('b', (v) => { b = v; });
  k.slider('stripe', (v) => {
    stripe = v;
    k.say(v === 0 ? tr('полос нет — шаг исчез, скорость не изменилась.') : '');
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const ternus: Mount = demo((k) => {
  let isi = 20, t0 = performance.now();
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const on = 120;
    const cycle = (on + isi) * 2;
    const p = (performance.now() - t0) % cycle;
    const second = p > on + isi;
    const showing = second ? p - on - isi < on : p < on;
    if (!showing) return;
    const step = Math.min(w, h) * 0.22;
    const x0 = w / 2 - step + (second ? step : 0);
    ctx.fillStyle = INK;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x0 + (i - 1) * step, h / 2, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('isi', (v) => {
    isi = v;
    t0 = performance.now();
    k.say(v < 40 ? tr('короткая пауза — видно, как одна крайняя точка перепрыгивает через двух других.') : tr('длинная пауза — видно, как едет вся группа целиком.'));
  });
  k.loop(() => s.draw());
});

export const tusi: Mount = demo((k) => {
  let speed = 10, trail = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.42;
    ctx.strokeStyle = '#9aa0ad';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    const a = (t * speed) / 10;
    const ix = cx + (R / 2) * Math.cos(a), iy = cy + (R / 2) * Math.sin(a);
    ctx.beginPath();
    ctx.arc(ix, iy, R / 2, 0, Math.PI * 2);
    ctx.stroke();
    if (trail) {
      /* У каждой из трёх точек свой диаметр: под 0°, 60° и 120°. */
      ctx.strokeStyle = '#c9ccd4';
      ctx.setLineDash([5, 4]);
      for (let i = 0; i < 3; i++) {
        const th = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(cx - R * Math.cos(th), cy - R * Math.sin(th));
        ctx.lineTo(cx + R * Math.cos(th), cy + R * Math.sin(th));
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    /* Точка на малой окружности описывает ровно диаметр большой. */
    ctx.fillStyle = MARK;
    for (let i = 0; i < 3; i++) {
      const b = a * -1 + (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(ix + (R / 2) * Math.cos(b), iy + (R / 2) * Math.sin(b), 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('speed', (v) => { speed = v; });
  k.button('trail', (el) => {
    trail = !trail;
    el.textContent = trail ? tr('убрать след') : tr('показать след');
    s.draw();
    k.say(trail ? tr('путь каждой точки — свой диаметр. Прямая до последнего знака.') : '');
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const wagonWheel: Mount = demo((k) => {
  let spokes = 8, rate = 30, t = 0, frameDt = 1 / 60;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* На узком экране подписи переносятся на две строки, и колёсам оставлено место. */
    const narrow = w < 560;
    const cy = narrow ? h * 0.42 : h / 2;
    const R = Math.min(w / 2, h) * (narrow ? 0.36 : 0.4);
    const wheel = (cx: number, blur: boolean) => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      /* Смаз берётся за 1/15 с — порядка времени, за которое глаз сам накапливает свет.
         Смаз за один кадр не спасает: основная гармоника спиц от него только слабеет
         и по-прежнему шагает назад. За четыре кадра от неё почти ничего не остаётся. */
      const steps = blur ? 24 : 1;
      for (let sI = 0; sI < steps; sI++) {
        ctx.globalAlpha = blur ? 1 / steps : 1;
        const a0 = t * rate - (sI / steps) * (rate / 15);
        for (let i = 0; i < spokes; i++) {
          const a = a0 + (i / spokes) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };
    wheel(w * 0.27, false);
    wheel(w * 0.73, true);
    ctx.fillStyle = '#6b6b70';
    ctx.font = '12px ui-monospace, monospace';
    ctx.textAlign = 'center';
    const label = (text: string, x: number) => {
      if (!narrow) { ctx.fillText(text, x, h * 0.96); return; }
      /* Перенос по словам в половину ширины холста. */
      const lines: string[] = [];
      for (const word of text.split(' ')) {
        const last = lines.length ? lines[lines.length - 1] : '';
        if (last && ctx.measureText(`${last} ${word}`).width > w * 0.46) lines.push(word);
        else if (last) lines[lines.length - 1] = `${last} ${word}`;
        else lines.push(word);
      }
      lines.forEach((ln, i) => ctx.fillText(ln, x, h * 0.98 - (lines.length - 1 - i) * 14));
    };
    /* Наложение начинается, когда спица за кадр проходит больше половины промежутка
       между спицами; до этого левое колесо честно едет вперёд. */
    const aliased = rate * frameDt > Math.PI / spokes;
    label(aliased ? tr('по кадрам — есть наложение') : tr('по кадрам — наложения пока нет'), w * 0.27);
    label(tr('со смазом — наложения нет'), w * 0.73);
  });
  k.slider('spokes', (v) => { spokes = v; s.draw(); });
  k.slider('rate', (v) => { rate = v; s.draw(); });
  k.loop((now, dt) => {
    /* Частота кадров у экранов разная, 60 или 120 Гц: меряем её на ходу. */
    if (dt > 0) frameDt += (dt - frameDt) * 0.05;
    t = now;
    s.draw();
  });
});
