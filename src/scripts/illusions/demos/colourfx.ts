/* Цвет, последействия и двойственные образы. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

export const negativeAfterimage: Mount = demo((k) => {
  let phase: 'idle' | 'adapt' | 'test' = 'idle';
  let t0 = 0, shape = 'none', timer = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = phase === 'test' ? '#fff' : PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.3;
    if (phase === 'adapt') {
      ctx.fillStyle = '#e03a3a';
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
    } else if (phase === 'test' && shape !== 'none') {
      /* Контур подаётся после адаптации и всё равно распоряжается цветом образа —
         сетчатка про будущие контуры знать не может. */
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (shape === 'circle') ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2);
      else ctx.rect(cx - R * 0.6, cy - R * 0.6, R * 1.2, R * 1.2);
      ctx.stroke();
    }
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  k.select('shape', (v) => { shape = v; s.draw(); });
  k.button('go', (el) => {
    phase = 'adapt';
    t0 = performance.now();
    el.disabled = true;
    k.say('смотрите строго в точку в центре.');
    s.draw();
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 20 - (performance.now() - t0) / 1000;
      k.clock(`${Math.max(0, left).toFixed(0)} с`);
      if (left <= 0) {
        clearInterval(timer);
        phase = 'test';
        el.disabled = false;
        s.draw();
        k.say('зелёное пятно там, где было красное. Никакого зелёного на экране нет.');
      }
    }, 100);
  });
});

export const benhamTop: Mount = demo((k) => {
  let speed = 7, dir = 1, a = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    /* Только чёрная краска и белая бумага. Цвета в диске нет ни одного. */
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = R * 0.07;
    for (let arc = 0; arc < 4; arc++) {
      const r = R * (0.92 - arc * 0.19);
      const start = Math.PI + arc * 0.28;
      ctx.beginPath();
      ctx.arc(0, 0, r, start, start + 0.55);
      ctx.stroke();
    }
    ctx.restore();
  });
  k.slider('speed', (v) => { speed = v; });
  k.toggle('dir', (v) => {
    dir = v ? -1 : 1;
    k.say('цвета поменялись местами. У разных людей они разные — это одна из самых наглядных иллюзий, которая у каждого своя.');
  });
  k.loop((_, dt) => { a += dir * dt * speed; s.draw(); });
  k.say('частота обновления вашего экрана здесь влияет на результат: вращение считается по настоящим меткам времени кадров.');
});

export const munkerWhite: Mount = demo((k) => {
  let gridPitch = 14;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.5);
    ctx.fillRect(0, 0, w, h);
    /* Все шары залиты одной краской. Отличаются только линии поверх них. */
    const base = '#c86a4e';
    for (const [x, col] of [[w * 0.25, '#e0483c'], [w * 0.75, '#3b7fe0']] as const) {
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(x, h / 2, Math.min(w, h) * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = col;
      ctx.lineWidth = gridPitch / 2;
      for (let y = 0; y < h; y += gridPitch) {
        ctx.beginPath(); ctx.moveTo(x - w * 0.24, y); ctx.lineTo(x + w * 0.24, y); ctx.stroke();
      }
    }
  });
  k.slider('grid', (v) => { gridPitch = v; s.draw(); });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  canvas?.addEventListener('mousemove', (ev) => {
    const r = canvas.getBoundingClientRect();
    const dpr = canvas.width / r.width;
    const ctx = canvas.getContext('2d')!;
    const d = ctx.getImageData(Math.round((ev.clientX - r.left) * dpr), Math.round((ev.clientY - r.top) * dpr), 1, 1).data;
    k.say(`под курсором rgb(${d[0]} ${d[1]} ${d[2]}). Проведите по обоим шарам: краска у них одна.`);
  });
});

export const neonColourSpreading: Mount = demo((k) => {
  let lum = 55;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const pitch = Math.min(w, h) / 12;
    ctx.lineWidth = 3;
    const cx = w / 2, cy = h / 2;
    const R = pitch * 2.2;
    for (let x = pitch; x < w; x += pitch)
      for (const [x1, y1, x2, y2] of [[x, 0, x, h]] as const) {
        const inside = Math.abs(x - cx) < R;
        ctx.strokeStyle = inside ? `rgb(${Math.round(60 + lum)} ${Math.round(80 + lum)} 230)` : '#111';
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
    for (let y = pitch; y < h; y += pitch) {
      const inside = Math.abs(y - cy) < R;
      ctx.strokeStyle = inside ? `rgb(${Math.round(60 + lum)} ${Math.round(80 + lum)} 230)` : '#111';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  });
  k.slider('lum', (v) => {
    lum = v;
    s.draw();
    k.say(v < 20 || v > 85 ? 'окно по контрасту узкое, и здесь эффект схлопнулся.' : 'цвет растекается по прозрачному диску, которого не нарисовано.');
  });
});

export const watercolour: Mount = demo((k) => {
  let swap = false, wave = 14;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.38;
    const path = () => {
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const a = (i / 200) * Math.PI * 2;
        const r = R + wave * Math.sin(a * 9);
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    };
    /* Решает пара границ, а не сама область: внутренняя линия задаёт, что окрасится. */
    ctx.lineWidth = 10;
    ctx.strokeStyle = swap ? '#e8b23a' : '#7a4fd0';
    path();
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = swap ? '#7a4fd0' : '#e8b23a';
    path();
    ctx.stroke();
  });
  k.toggle('swap', (v) => {
    swap = v;
    s.draw();
    k.say(v ? 'окрасилось то, что было снаружи. Область не менялась — поменялись местами линии.' : '');
  });
  k.slider('wave', (v) => { wave = v; s.draw(); });
});

export const colourPhi: Mount = demo((k) => {
  let isi = 50, t0 = performance.now(), measured = 0, frames = 0, last = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const on = 50;
    const cycle = (on + isi) * 2;
    const p = (performance.now() - t0) % cycle;
    const second = p > on + isi;
    const showing = second ? p - on - isi < on : p < on;
    if (!showing) return;
    ctx.fillStyle = second ? '#2ea84f' : '#e03a3a';
    ctx.beginPath();
    ctx.arc(second ? w * 0.66 : w * 0.34, h / 2, Math.min(w, h) * 0.12, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('isi', (v) => { isi = v; t0 = performance.now(); });
  k.loop((now) => {
    s.draw();
    if (last) { frames++; measured += now - last; }
    last = now;
    if (frames === 60) {
      k.say(`кадр здесь идёт ${((measured / frames) * 1000).toFixed(1)} мс, значит интервал выставляется с такой же точностью, не лучше.`);
      frames = 0; measured = 0;
    }
  });
});

const fabric = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, stripe: [number, number, number][], illum: [number, number, number]) => {
  const bands = 9;
  for (let i = 0; i < bands; i++) {
    const c = stripe[i % stripe.length];
    /* Значения ткани не меняются; меняется только множитель освещения. */
    ctx.fillStyle = `rgb(${Math.round(c[0] * illum[0])} ${Math.round(c[1] * illum[1])} ${Math.round(c[2] * illum[2])})`;
    ctx.fillRect(x, y + (i * h) / bands, w, h / bands + 1);
  }
};

export const theDress: Mount = demo((k) => {
  let illum = 50;
  const s = k.surface(({ ctx, w, h }) => {
    const p = illum / 100;
    /* От лампы накаливания (тёплый) к пасмурному небу (холодный). */
    const light: [number, number, number] = [1.15 - p * 0.35, 1.0, 0.72 + p * 0.5];
    ctx.fillStyle = `rgb(${Math.round(120 * light[0])} ${Math.round(120 * light[1])} ${Math.round(120 * light[2])})`;
    ctx.fillRect(0, 0, w, h);
    fabric(ctx, w * 0.25, h * 0.1, w * 0.5, h * 0.8, [[110, 120, 165], [92, 78, 52]], light);
  });
  k.slider('illum', (v) => {
    illum = v;
    s.draw();
    k.say(v < 35 ? 'если считать свет тёплым, вычесть надо желтизну — и ткань выйдет синей с чёрным.' : v > 65 ? 'если считать свет холодным дневным, вычитается синева — и та же ткань выходит белой с золотым.' : 'здесь освещение неоднозначно, и системе не на чем остановиться.');
  });
});

export const colourConstancy: Mount = demo((k) => {
  let illum = 50;
  const s = k.surface(({ ctx, w, h }) => {
    const p = illum / 100;
    const light: [number, number, number] = [1.25 - p * 0.5, 1.0, 0.65 + p * 0.6];
    const patches: [string, [number, number, number]][] = [
      ['красный', [190, 60, 55]],
      ['зелёный', [70, 150, 80]],
      ['синий', [60, 85, 175]],
      ['белый', [225, 225, 225]],
      ['серый', [128, 128, 128]],
    ];
    ctx.fillStyle = `rgb(${Math.round(90 * light[0])} ${Math.round(90 * light[1])} ${Math.round(90 * light[2])})`;
    ctx.fillRect(0, 0, w, h);
    const pw = w / patches.length;
    patches.forEach(([, c], i) => {
      ctx.fillStyle = `rgb(${Math.round(c[0] * light[0])} ${Math.round(c[1] * light[1])} ${Math.round(c[2] * light[2])})`;
      ctx.fillRect(i * pw + 8, h * 0.2, pw - 16, h * 0.6);
    });
  });
  k.slider('illum', (v) => {
    illum = v;
    s.draw();
    k.say('краска у каждой плашки одна и та же во всём диапазоне. Меняется только множитель освещения — а цвета вы всё равно называете правильно.');
  });
});

export const tiltAftereffect: Mount = demo((k) => {
  let phase: 'idle' | 'adapt' | 'test' = 'idle';
  let t0 = 0, guess = 0, timer = 0;
  const grating = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, deg: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx, cy);
    ctx.rotate((deg * Math.PI) / 180);
    for (let y = -r * 1.5; y < r * 1.5; y += 14) {
      ctx.fillStyle = ((y / 14) | 0) % 2 ? '#1b1b1b' : '#efefef';
      ctx.fillRect(-r * 1.5, y, r * 3, 7);
    }
    ctx.restore();
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.4;
    grating(ctx, cx, cy, R, phase === 'adapt' ? 15 : guess);
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('guess', (v) => { guess = v; s.draw(); });
  k.button('go', (el) => {
    phase = 'adapt';
    t0 = performance.now();
    el.disabled = true;
    s.draw();
    k.say('смотрите в красную точку, не отводя взгляд.');
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 45 - (performance.now() - t0) / 1000;
      k.clock(`${Math.max(0, left).toFixed(0)} с`);
      if (left <= 0) {
        clearInterval(timer);
        phase = 'test';
        el.disabled = false;
        s.draw();
        k.say('теперь выставьте решётку в вертикаль и нажмите «проверить».');
      }
    }, 100);
  });
  k.button('check', () => {
    k.say(guess === 0 ? 'ровно ноль — последействия у вас не осталось или оно уже прошло.' : `ваша ошибка ${Math.abs(guess)}° ${guess > 0 ? 'вправо' : 'влево'}. Адаптация шла на +15°, и отклонение должно быть в противоположную сторону.`);
  });
});

export const emmertLaw: Mount = demo((k) => {
  let t0 = 0, timer = 0, phase: 'idle' | 'adapt' = 'idle';
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (phase === 'adapt') {
      ctx.fillStyle = '#2ea84f';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  k.button('go', (el) => {
    phase = 'adapt';
    t0 = performance.now();
    el.disabled = true;
    s.draw();
    k.say('смотрите в точку в центре пятна.');
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 20 - (performance.now() - t0) / 1000;
      k.clock(`${Math.max(0, left).toFixed(0)} с`);
      if (left <= 0) {
        clearInterval(timer);
        phase = 'idle';
        el.disabled = false;
        s.draw();
        k.say('теперь отведите взгляд от экрана: посмотрите на ладонь, потом на стол, потом на дальнюю стену. Образ на сетчатке один и тот же, а размер каждый раз новый.');
      }
    }, 100);
  });
});

export const rubinVase: Mount = demo((k) => {
  let cue = 50;
  const s = k.surface(({ ctx, w, h }) => {
    const p = cue / 100;
    /* Ваза строится как тело вращения из профиля лица: связь между двумя прочтениями
       заложена в само построение, а не нарисована отдельно. */
    const profile = (t: number) => {
      const y = t;
      return 0.16 + 0.1 * Math.sin(y * 9) + 0.07 * Math.sin(y * 3.2 + 1) + 0.05 * y;
    };
    ctx.fillStyle = `rgb(${Math.round(20 + p * 215)} ${Math.round(20 + p * 215)} ${Math.round(24 + p * 210)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgb(${Math.round(235 - p * 215)} ${Math.round(235 - p * 215)} ${Math.round(230 - p * 206)})`;
    const cx = w / 2, top = h * 0.08, bot = h * 0.92;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      ctx.lineTo(cx + profile(t) * w, top + (bot - top) * t);
    }
    for (let i = 100; i >= 0; i--) {
      const t = i / 100;
      ctx.lineTo(cx - profile(t) * w, top + (bot - top) * t);
    }
    ctx.closePath();
    ctx.fill();
  });
  k.slider('cue', (v) => {
    cue = v;
    s.draw();
    k.say(v < 30 ? 'контур отдан вазе — лиц больше нет.' : v > 70 ? 'контур отдан профилям — вазы больше нет.' : 'контур никому не отдан, и прочтения меняются сами.');
  });
});

export const figureGround: Mount = demo((k) => {
  let convex = 50, area = 50, sym = 50;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const n = 6;
    const bw = w / n;
    /* Выпуклость, площадь и симметрия — три независимых признака владения контуром. */
    ctx.fillStyle = '#20222c';
    for (let i = 0; i < n; i += 2) {
      const bulge = ((convex - 50) / 50) * bw * 0.35;
      const wid = bw * (0.6 + (area / 100) * 0.8);
      ctx.beginPath();
      ctx.moveTo(i * bw, 0);
      for (let t = 0; t <= 1; t += 0.02) {
        const y = t * h;
        const s1 = Math.sin(t * Math.PI * 3);
        const s2 = sym > 50 ? s1 : Math.sin(t * Math.PI * 3 + t * 2);
        ctx.lineTo(i * bw + bulge * s2, y);
      }
      for (let t = 1; t >= 0; t -= 0.02) {
        const y = t * h;
        const s1 = Math.sin(t * Math.PI * 3);
        const s2 = sym > 50 ? s1 : Math.sin(t * Math.PI * 3 + t * 2);
        ctx.lineTo(i * bw + wid - bulge * s2, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  });
  const upd = () => { s.draw(); k.say('каждый ползунок тянет контур на свою сторону. Побеждает сумма, а не один признак.'); };
  k.slider('convex', (v) => { convex = v; upd(); });
  k.slider('area', (v) => { area = v; upd(); });
  k.slider('sym', (v) => { sym = v; upd(); });
});

export const cofferIllusion: Mount = demo((k) => {
  let len = 60, circles = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.62);
    ctx.fillRect(0, 0, w, h);
    const cols = 6, rows = 4;
    const cw = w / cols, ch = h / rows;
    const inset = (cw * (100 - len)) / 400;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = c * cw, y = r * ch;
        for (const [dy, light] of [[0, true], [ch, false]] as const) {
          ctx.strokeStyle = light ? '#f0f0f0' : '#222';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x + inset, y + dy);
          ctx.lineTo(x + cw - inset, y + dy);
          ctx.stroke();
        }
        for (const [dx, light] of [[0, false], [cw, true]] as const) {
          ctx.strokeStyle = light ? '#f0f0f0' : '#222';
          ctx.beginPath();
          ctx.moveTo(x + dx, y + inset);
          ctx.lineTo(x + dx, y + ch - inset);
          ctx.stroke();
        }
      }
    if (circles) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      for (let r = 1; r < rows; r++)
        for (let c = 1; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(c * cw, r * ch, Math.min(cw, ch) * 0.42, 0, Math.PI * 2);
          ctx.stroke();
        }
    }
  });
  k.slider('len', (v) => { len = v; s.draw(); });
  k.button('circles', (el) => {
    circles = !circles;
    el.textContent = circles ? 'убрать обводку' : 'обвести круги';
    s.draw();
    k.say(circles ? 'круги были нарисованы теми же отрезками всё это время. Они просто проиграли конкуренцию за владение контуром.' : '');
  });
});

export const neckerCube: Mount = demo((k) => {
  const gaps: number[] = [];
  let last = 0;
  k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const kk = Math.min(w, h) * 0.34;
    const cx = w / 2, cy = h / 2;
    const d = kk * 0.35;
    const front: [number, number][] = [[cx - kk / 2, cy - kk / 2], [cx + kk / 2, cy - kk / 2], [cx + kk / 2, cy + kk / 2], [cx - kk / 2, cy + kk / 2]];
    const back = front.map(([x, y]) => [x + d, y - d] as [number, number]);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    const face = (p: [number, number][]) => {
      ctx.beginPath();
      p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.stroke();
    };
    face(front);
    face(back);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.moveTo(front[i][0], front[i][1]);
      ctx.lineTo(back[i][0], back[i][1]);
    }
    ctx.stroke();
  });
  const hist = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (gaps.length < 2) return;
    const max = Math.max(...gaps);
    const bins = new Array(8).fill(0);
    for (const g of gaps) bins[Math.min(7, Math.floor((g / max) * 8))]++;
    const peak = Math.max(...bins);
    const bw = w / bins.length;
    ctx.fillStyle = MARK;
    bins.forEach((n, i) => {
      const bh = (n / peak) * (h - 18);
      ctx.fillRect(i * bw + 2, h - bh, bw - 4, bh);
    });
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('0 с', 2, 11);
    const lbl = `${max.toFixed(1)} с`;
    ctx.fillText(lbl, w - ctx.measureText(lbl).width - 2, 11);
  });
  const tap = () => {
    const now = performance.now();
    if (last) gaps.push((now - last) / 1000);
    last = now;
    hist.draw();
    if (!gaps.length) { k.say('засекли. Жмите на каждом следующем перевороте.'); return; }
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    k.say(`${gaps.length} ${gaps.length === 1 ? 'интервал' : gaps.length < 5 ? 'интервала' : 'интервалов'}, в среднем ${mean.toFixed(1)} с. У большинства выходит от полутора до пяти.`);
  };
  k.button('tap', tap);
  k.button('reset', () => { gaps.length = 0; last = 0; hist.draw(); k.say('счёт сброшен.'); });
  k.space((down) => { if (down) tap(); });
});

export const multistablePerception: Mount = demo((k) => {
  let fig = 'necker';
  const gaps: Record<string, number[]> = { necker: [], schroder: [], rings: [] };
  let last = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.34;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    if (fig === 'necker') {
      const d = R * 0.35;
      const f: [number, number][] = [[cx - R / 2, cy - R / 2], [cx + R / 2, cy - R / 2], [cx + R / 2, cy + R / 2], [cx - R / 2, cy + R / 2]];
      const b = f.map(([x, y]) => [x + d, y - d] as [number, number]);
      for (const p of [f, b]) {
        ctx.beginPath();
        p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < 4; i++) { ctx.moveTo(f[i][0], f[i][1]); ctx.lineTo(b[i][0], b[i][1]); }
      ctx.stroke();
    } else if (fig === 'schroder') {
      const n = 6;
      const step = (R * 2) / n;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        ctx.moveTo(cx - R + i * step, cy - R + i * step * 0.6);
        ctx.lineTo(cx - R + i * step, cy + R - (n - i) * step * 0.2);
      }
      for (let i = 0; i <= n; i++) {
        ctx.moveTo(cx - R, cy - R + i * step * 0.6);
        ctx.lineTo(cx + R, cy - R + i * step * 0.6 + R * 0.2);
      }
      ctx.stroke();
    } else {
      for (let i = 1; i <= 6; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.stroke();
    }
  });
  const hist = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const keys = Object.keys(gaps);
    const bw = w / keys.length;
    ctx.font = '11px system-ui, sans-serif';
    keys.forEach((key, i) => {
      const g = gaps[key];
      const mean = g.length ? g.reduce((a, b) => a + b, 0) / g.length : 0;
      ctx.fillStyle = key === fig ? MARK : '#c9ccd4';
      ctx.fillRect(i * bw + 10, h - 14 - Math.min(mean / 8, 1) * (h - 26), bw - 20, Math.min(mean / 8, 1) * (h - 26));
      ctx.fillStyle = '#6b6b70';
      ctx.fillText(mean ? `${mean.toFixed(1)} с` : '—', i * bw + 12, h - 3);
    });
  });
  k.select('fig', (v) => { fig = v; last = 0; s.draw(); });
  const tap = () => {
    const now = performance.now();
    if (last) gaps[fig].push((now - last) / 1000);
    last = now;
    hist.draw();
    k.say('столбики внизу — ваши средние по трём стимулам. Сравнение между ними и есть самое интересное.');
  };
  k.button('tap', tap);
  k.button('reset', () => { for (const key of Object.keys(gaps)) gaps[key].length = 0; last = 0; hist.draw(); });
});

export const pareidolia: Mount = demo((k) => {
  let seed = 1, scale = 8, rolls = 0;
  const s = k.surface(({ ctx, w, h }) => {
    const r = rnd(seed);
    const cell = scale;
    /* Процедурный шум, сглаженный до пятен: лицо, если оно появится, нарисовали вы. */
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    const grid: number[] = [];
    for (let i = 0; i < cols * rows; i++) grid.push(r());
    const at = (c: number, rr: number) => grid[Math.max(0, Math.min(rows - 1, rr)) * cols + Math.max(0, Math.min(cols - 1, c))];
    for (let rr = 0; rr < rows; rr++)
      for (let c = 0; c < cols; c++) {
        let v = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v += at(c + dx, rr + dy);
        v /= 9;
        ctx.fillStyle = grey(v);
        ctx.fillRect(c * cell, rr * cell, cell + 1, cell + 1);
      }
  });
  k.slider('scale', (v) => { scale = v; s.draw(); });
  k.button('roll', () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    rolls++;
    s.draw();
    k.say(`бросок ${rolls}. Система опознания лиц настроена так, чтобы не пропустить ни одного, — а значит, обязана иногда срабатывать впустую.`);
  });
});
