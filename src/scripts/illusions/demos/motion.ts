/* Движение. Почти всё здесь упирается в задачу апертуры: край, видимый в окошке, своего
   направления не сообщает, и систему приходится доукомплектовывать догадками. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

export const barberpole: Mount = demo((k) => {
  let aspect = 60, angle = 45, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const ah = Math.min(h * 0.9, w * 0.9);
    const aw = (ah * aspect) / 100;
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
  k.say('движение полос не меняется ни разу. Меняются только пропорции окна — и вместе с ними видимое направление.');
});

export const breathingSquare: Mount = demo((k) => {
  let trails = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.3;
    const a = Math.sin(t * 1.2) * R * 0.45;
    ctx.lineWidth = 6;
    ctx.lineCap = 'butt';
    /* Четыре отрезка ездят каждый по своей прямой, длина у них постоянна. */
    const segs: [number, number, number, number][] = [
      [cx - R, cy - R + a, cx + R, cy - R + a],
      [cx + R - a, cy - R, cx + R - a, cy + R],
      [cx + R, cy + R - a, cx - R, cy + R - a],
      [cx - R + a, cy + R, cx - R + a, cy - R],
    ];
    if (trails) {
      ctx.strokeStyle = '#c9ccd4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      for (const [x1, y1] of segs) {
        ctx.beginPath();
        ctx.moveTo(x1 - (y1 === cy - R + a ? 0 : R * 0.6), y1 - (y1 === cy - R + a ? R * 0.6 : 0));
        ctx.lineTo(x1 + (y1 === cy - R + a ? 0 : R * 0.6), y1 + (y1 === cy - R + a ? R * 0.6 : 0));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineWidth = 6;
    }
    ctx.strokeStyle = INK;
    for (const [x1, y1, x2, y2] of segs) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  });
  k.button('trails', (el) => {
    trails = !trails;
    el.textContent = trails ? 'убрать траектории' : 'показать настоящие траектории';
    k.say(trails ? 'траектории прямые и независимые, и ни один отрезок не меняет длины.' : '');
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
  k.say('в кольцах начинается быстрое течение. Скорость этого течения почти совпадает с частотой ваших микросаккад.');
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
  k.say('пересчитайте полосы. Нарисовано их столько, сколько стоит на первом ползунке, а видно вдвое больше.');
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
    k.say(v ? 'остановлено — плоская россыпь, и формы в ней нет никакой.' : 'цилиндр. Направление вращения при этом само переворачивается: бонусом вторая иллюзия.');
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
  k.button('go', (el) => {
    if (mode === 'adapt') return;
    mode = 'adapt';
    t0 = performance.now();
    el.textContent = 'идёт адаптация';
    k.say('смотрите строго в красную точку, не отводя взгляд.');
  });
  k.loop((now) => {
    if (mode === 'adapt') {
      const el = performance.now() - t0;
      phase = now * 1.4;
      k.clock(`${Math.max(0, 60 - el / 1000).toFixed(0)} с`);
      if (el > 60000) {
        mode = 'test';
        t0 = performance.now();
        k.say('теперь картинка стоит. Держите взгляд и жмите кнопку, когда последействие закончится.');
        const b = k.el('[data-btn="go"]') as HTMLButtonElement;
        b.textContent = 'последействие кончилось';
        b.onclick = () => {
          k.say(`${((performance.now() - t0) / 1000).toFixed(1)} с последействия. Это ваше число, не из учебника.`);
          mode = 'idle';
          b.textContent = 'адаптироваться 60 с';
          b.onclick = null;
        };
      }
      s.draw();
    } else if (mode === 'test') {
      k.clock(`${((performance.now() - t0) / 1000).toFixed(1)} с`);
    }
  });
});

export const motionBinding: Mount = demo((k) => {
  let occl = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#1c1c22';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.28;
    const dx = Math.cos(t * 1.1) * R * 0.5;
    const dy = Math.sin(t * 1.1) * R * 0.5;
    ctx.save();
    /* Ромб едет за заслонками; видны только куски его сторон. */
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + dx, cy + dy - R);
    ctx.lineTo(cx + dx + R, cy + dy);
    ctx.lineTo(cx + dx, cy + dy + R);
    ctx.lineTo(cx + dx - R, cy + dy);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = occl ? '#4a4a55' : '#1c1c22';
    const bw = R * 0.62;
    for (const [ox, oy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const)
      ctx.fillRect(cx + ox * R * 0.95 - bw / 2, cy + oy * R * 0.95 - bw / 2, bw, bw);
    ctx.restore();
  });
  k.toggle('occl', (v) => {
    occl = v;
    k.say(v ? 'заслонки видны — и четыре отрезка мгновенно собрались в один ромб за ними.' : 'заслонок не видно — четыре независимые линии, каждая со своим движением.');
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
      k.say(`${gaps.length} исчезновений, в среднем ${mean.toFixed(1)} с. Столбики внизу — ваши, не из статьи.`);
    }
  });
  k.button('reset', () => { gaps.length = 0; c.draw(); k.say('счёт сброшен.'); });
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
    ctx.save();
    patch(0, 0, w, h, unit, tall, 0, 0);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, (Math.min(w, h) * inset) / 200, 0, Math.PI * 2);
    ctx.clip();
    /* Вставка чуть покачивается сама — иначе пришлось бы трясти экран. */
    patch(0, 0, w, h, tall, unit, Math.sin(t * 2) * 2, Math.cos(t * 2) * 2);
    ctx.restore();
  });
  k.slider('aspect', (v) => {
    aspect = v;
    s.draw();
    k.say(v === 100 ? 'клетки квадратные — разводить нечего, и вставка легла на фон.' : '');
  });
  k.slider('inset', (v) => { inset = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});

/* Общий рисовальщик для «Вращающихся змей», периферического дрейфа и
   Фрейзера — Уилкокса: кольца строятся по опубликованному правилу яркости, а не
   обводятся с чужой картинки, поэтому само правило становится ручкой. */
const driftRings = (seq: number, rings: number): Mount =>
  demo((k) => {
    let sq = seq, rg = rings;
    const s = k.surface(({ ctx, w, h }) => {
      ctx.fillStyle = grey(0.55);
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.46;
      /* Четырёхшаговая последовательность: чёрный — синий — белый — жёлтый.
         Её несимметричность и порождает ложный сигнал направления. */
      const palette = ['#101010', '#2b4ea8', '#f2f2f2', '#e8c53a'];
      for (let ri = 0; ri < rg; ri++) {
        const r0 = (R * (ri + 1)) / (rg + 1);
        const r1 = (R * (ri + 2)) / (rg + 1);
        const n = 24;
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2;
          const a1 = ((i + 1) / n) * Math.PI * 2;
          for (let q = 0; q < 4; q++) {
            const b0 = a0 + ((a1 - a0) * q) / 4;
            const b1 = a0 + ((a1 - a0) * (q + 1)) / 4;
            ctx.fillStyle = palette[(q + sq + (ri % 2 ? 2 : 0)) % 4];
            ctx.beginPath();
            ctx.arc(cx, cy, r1, b0, b1);
            ctx.arc(cx, cy, r0 * 0.99, b1, b0, true);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
      ctx.fillStyle = MARK;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    k.slider('seq', (v) => {
      sq = v;
      s.draw();
      k.say(v % 2 === 1 ? 'последовательность сдвинута на нечётный шаг — симметрия восстановлена, и движение пропало.' : 'смотрите в красную точку: там, куда вы смотрите, вращение останавливается.');
    });
    k.slider('rings', (v) => { rg = v; s.draw(); });
  });

export const rotatingSnakes = driftRings(0, 5);
export const peripheralDrift = driftRings(0, 4);

export const phiBeta: Mount = demo((k) => {
  let isi = 60, t0 = performance.now();
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const on = 60;
    const cycle = (on + isi) * 2;
    const p = ((performance.now() - t0) % cycle) / cycle;
    const first = p < 0.5;
    const showing = (p % 0.5) * cycle < on;
    if (showing) {
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(first ? w * 0.32 : w * 0.68, h / 2, Math.min(w, h) * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('isi', (v) => {
    isi = v;
    t0 = performance.now();
    k.say(v > 250 ? 'две отдельные вспышки: движения нет.' : v > 40 ? 'бета-движение: один объект переезжает с места на место. Именно это, а не фи, держит кино.' : 'чистое фи: что-то пронеслось, а объекта не было.');
  });
  k.loop(() => s.draw());
});

export const pinnaBrelstaff: Mount = demo((k) => {
  let zoom = true, tilt = 22, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const base = Math.min(w, h) * 0.42;
    const scale = zoom ? 1 + Math.sin(t * 0.8) * 0.28 : 1;
    for (const [ri, sgn] of [[0.62, 1], [1, -1]] as const) {
      const R = base * ri * scale;
      const n = Math.round(28 * ri);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const rot = a + (sgn * tilt * Math.PI) / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        const q = base * 0.07;
        ctx.fillStyle = '#111';
        ctx.fillRect(-q, -q, q * 2, q * 2);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-q, -q, q, q);
        ctx.fillRect(0, 0, q, q);
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
    k.say(v ? 'приближение остановлено — подвигайтесь к экрану и обратно сами.' : 'кольца крутятся навстречу друг другу. Картинка при этом только масштабируется.');
  });
  k.slider('tilt', (v) => { tilt = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});

export const reversePhi: Mount = demo((k) => {
  let invert = false, speed = 8, frame = 0, acc = 0;
  const s = k.surface(({ ctx, w, h }) => {
    const period = 40;
    const shift = (frame * 8) % period;
    const flip = invert && frame % 2 === 1;
    for (let x = -period; x < w + period; x += period) {
      ctx.fillStyle = flip ? '#111' : '#eee';
      ctx.fillRect(x + shift, 0, period / 2, h);
      ctx.fillStyle = flip ? '#eee' : '#111';
      ctx.fillRect(x + shift + period / 2, 0, period / 2, h);
    }
  });
  k.toggle('invert', (v) => {
    invert = v;
    k.say(v ? 'узор физически едет вправо, а видно, что влево. Инвертирован только знак контраста.' : 'узор едет вправо.');
  });
  k.slider('speed', (v) => { speed = v; });
  k.loop((_, dt) => {
    acc += dt * speed;
    if (acc > 0.12) { acc = 0; frame++; s.draw(); }
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
    ctx.fillStyle = '#6f6f78';
    for (let x = 0; x < w; x += slat + gap) ctx.fillRect(x, 0, slat, h);
  });
  k.slider('slat', (v) => { slat = v; s.draw(); });
  k.slider('gap', (v) => { gap = v; s.draw(); });
  k.slider('rate', (v) => { rate = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
  k.say('в просветах спицы выгибаются дугой, и по разные стороны от оси — в разные стороны.');
});

export const rotatingCircles: Mount = demo((k) => {
  let trails = false, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.3;
    /* Каждый круг ездит по своей прямой; вращения нет ни у одного. */
    const paths: [number, number, number, number][] = [
      [cx - R, cy - R, cx + R, cy - R],
      [cx + R, cy - R, cx + R, cy + R],
      [cx + R, cy + R, cx - R, cy + R],
      [cx - R, cy + R, cx - R, cy - R],
    ];
    if (trails) {
      ctx.strokeStyle = '#c9ccd4';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      for (const [x1, y1, x2, y2] of paths) {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    const p = (Math.sin(t * 1.2) + 1) / 2;
    ctx.fillStyle = MARK;
    for (const [x1, y1, x2, y2] of paths) {
      ctx.beginPath();
      ctx.arc(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.button('trails', (el) => {
    trails = !trails;
    el.textContent = trails ? 'убрать следы' : 'показать следы';
    k.say(trails ? 'следы прямые.' : '');
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
    el.textContent = frozen ? 'снова вращать' : 'остановить вращение';
    k.say(frozen ? 'вращение стоит — и изменения стали очевидны. Их частота не менялась ни на герц.' : '');
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
    const x = ((t * 60) % (w + 160)) - 80;
    ctx.fillStyle = grey(a / 100);
    ctx.fillRect(x, h * 0.2, 90, h * 0.22);
    ctx.fillStyle = grey(b / 100);
    ctx.fillRect(x, h * 0.58, 90, h * 0.22);
  });
  k.slider('a', (v) => { a = v; });
  k.slider('b', (v) => { b = v; });
  k.slider('stripe', (v) => {
    stripe = v;
    k.say(v === 0 ? 'полос нет — шаг исчез, скорость не изменилась.' : '');
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
    k.say(v < 40 ? 'короткая пауза — видно, как одна крайняя точка перепрыгивает через двух других.' : 'длинная пауза — видно, как едет вся группа целиком.');
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
      ctx.strokeStyle = '#c9ccd4';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    /* Точка на малой окружности описывает ровно диаметр большой. */
    ctx.fillStyle = MARK;
    for (let i = 0; i < 3; i++) {
      const b = a * -1 + (i * Math.PI * 2) / 3;
      ctx.beginPath();
      ctx.arc(ix + (R / 2) * Math.cos(b - a * 0), iy + (R / 2) * Math.sin(b - a * 0), 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('speed', (v) => { speed = v; });
  k.button('trail', (el) => {
    trail = !trail;
    el.textContent = trail ? 'убрать след' : 'показать след';
    s.draw();
    k.say(trail ? 'путь точки — диаметр. Прямая до последнего знака.' : '');
  });
  k.loop((now) => { t = now; s.draw(); });
});

export const wagonWheel: Mount = demo((k) => {
  let spokes = 8, rate = 30, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const R = Math.min(w / 2, h) * 0.4;
    const wheel = (cx: number, blur: boolean) => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, h / 2, R, 0, Math.PI * 2);
      ctx.stroke();
      const steps = blur ? 8 : 1;
      for (let sI = 0; sI < steps; sI++) {
        ctx.globalAlpha = blur ? 1 / steps : 1;
        const a0 = t * rate - (sI / steps) * (rate / 60);
        for (let i = 0; i < spokes; i++) {
          const a = a0 + (i / spokes) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, h / 2);
          ctx.lineTo(cx + R * Math.cos(a), h / 2 + R * Math.sin(a));
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
    ctx.fillText('по кадрам — есть наложение', w * 0.27, h * 0.96);
    ctx.fillText('со смазом — наложения нет', w * 0.73, h * 0.96);
  });
  k.slider('spokes', (v) => { spokes = v; s.draw(); });
  k.slider('rate', (v) => { rate = v; s.draw(); });
  k.loop((now) => { t = now; s.draw(); });
});
