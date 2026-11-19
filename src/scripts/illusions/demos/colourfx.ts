/* Цвет, последействия и двойственные образы. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { num, tr } from '../i18n';

/* Четырёхлучевая звезда: лучи по углам rot, rot+90°… Две такие звезды, повёрнутые на 45°,
   вместе дают восьмилучевую. */
const star = (ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, rot: number) => {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = rot + (i * Math.PI) / 4;
    const r = i % 2 ? R * 0.3 : R;
    i ? ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
};

export const negativeAfterimage: Mount = demo((k) => {
  let phase: 'idle' | 'adapt' | 'test' = 'idle';
  let t0 = 0, shape = 'none', timer = 0, adaptor: 'disc' | 'star' = 'disc';
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = phase === 'test' ? '#fff' : PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.3;
    if (phase === 'adapt' && adaptor === 'disc') {
      ctx.fillStyle = '#e03a3a';
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
    } else if (phase === 'adapt') {
      /* Вариант ван Лира: окрашены только кончики лучей, прямые лучи в один цвет,
         косые — в другой. Середина звезды остаётся пустой. */
      const R2 = R * 1.4;
      for (const [rot, col] of [[-Math.PI / 2, '#f08a24'], [-Math.PI / 4, '#1fa3c8']] as const) {
        ctx.save();
        star(ctx, cx, cy, R2, rot);
        ctx.clip();
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(cx, cy, R2, 0, Math.PI * 2);
        ctx.arc(cx, cy, R2 * 0.42, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      }
    } else if (phase === 'test' && shape !== 'none') {
      /* Контур подаётся после адаптации и всё равно распоряжается цветом образа —
         сетчатка про будущие контуры знать не может. */
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (shape === 'circle') ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2);
      else if (shape === 'square') ctx.rect(cx - R * 0.6, cy - R * 0.6, R * 1.2, R * 1.2);
      else star(ctx, cx, cy, R * 1.4, shape === 'star-a' ? -Math.PI / 2 : -Math.PI / 4);
      ctx.stroke();
    }
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  const testNote = () => adaptor === 'disc'
    ? tr('зелёное пятно там, где было красное. Никакого зелёного на экране нет.')
    : shape === 'star-a' || shape === 'star-b'
      ? tr('звезду заливает цвет, дополнительный к лучам, которые обвёл контур. Переключите контур на другую звезду: адаптация была одна, а цвет сменится. На экране сейчас только белое и чёрная линия.')
      : tr('выберите контур-звезду: какую обвести, ту и зальёт последовательный образ.');
  k.select('shape', (v) => {
    shape = v;
    s.draw();
    if (phase === 'test') k.say(testNote());
  });
  k.button('go', (el) => {
    phase = 'adapt';
    adaptor = shape === 'star-a' || shape === 'star-b' ? 'star' : 'disc';
    t0 = performance.now();
    el.disabled = true;
    k.say(tr('смотрите строго в точку в центре.'));
    s.draw();
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 20 - (performance.now() - t0) / 1000;
      k.clock(tr('{s} с', { s: Math.max(0, left).toFixed(0) }));
      if (left <= 0) {
        clearInterval(timer);
        phase = 'test';
        el.disabled = false;
        s.draw();
        k.say(testNote());
      }
    }, 100);
  });
});

export const benhamTop: Mount = demo((k) => {
  /* speed — обороты в секунду. */
  let speed = 5, dir = 1, a = 0, note = '', hz = 0, n = 0, acc = 0;
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
    /* Рисунок Бенхэма: белая половина поделена на четыре сектора по 45°, в каждом по три
       дуги, и от сектора к сектору дуги спускаются ближе к центру. */
    ctx.strokeStyle = '#000';
    ctx.lineWidth = R * 0.028;
    for (let sec = 0; sec < 4; sec++)
      for (let m = 0; m < 3; m++) {
        const r = R * (0.88 - sec * 0.19 - m * 0.055);
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI + (sec * Math.PI) / 4, Math.PI + ((sec + 1) * Math.PI) / 4);
        ctx.stroke();
      }
    ctx.restore();
  });
  const tell = () => {
    if (!hz) return;
    k.say(tr('экран обновляется {hz} раз в секунду, диск делает {rps} об/с — {deg}° за кадр. Поворот считается по настоящим меткам времени кадров, поэтому частота экрана влияет на результат.',
      { hz: Math.round(hz), rps: speed, deg: Math.round((speed * 360) / hz) }) + note);
  };
  k.slider('speed', (v) => { speed = v; tell(); });
  k.toggle('dir', (v) => {
    /* Переключатель вызывается и при запуске — тогда направление не меняется и сказать нечего. */
    if (dir !== (v ? -1 : 1)) note = tr(' Цвета поменялись местами; какие они, у каждого своё.');
    dir = v ? -1 : 1;
    tell();
  });
  k.loop((_, dt) => {
    a += dir * dt * speed * Math.PI * 2;
    s.draw();
    if (dt > 0) { n++; acc += dt; }
    if (n === 60) { hz = n / acc; n = 0; acc = 0; tell(); }
  });
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
    k.say(tr('под курсором {rgb}. Проведите по обоим шарам: краска у них одна.', { rgb: `rgb(${d[0]} ${d[1]} ${d[2]})` }));
  });
});

export const neonColourSpreading: Mount = demo((k) => {
  let lum = 55;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const pitch = Math.min(w, h) / 12;
    ctx.lineWidth = 2.5;
    const cx = w / 2, cy = h / 2;
    const R = pitch * 2.6;
    /* Решётка с узлом в центре диска, иначе диск садится между линиями криво. */
    const x0 = cx - Math.ceil(cx / pitch) * pitch, y0 = cy - Math.ceil(cy / pitch) * pitch;
    const grid = () => {
      ctx.beginPath();
      for (let x = x0; x < w; x += pitch) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = y0; y < h; y += pitch) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
    };
    ctx.strokeStyle = '#111';
    grid();
    /* Те же линии внутри круга — цветные. Сам круг не нарисован: его край существует только
       как места, где чёрный отрезок сменяется цветным. Яркость ведём от почти чёрного
       синего через насыщенный синий к почти белому. */
    const t = lum / 100;
    const mix = (a: number[], b: number[], u: number) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
    const c = t < 0.5 ? mix([18, 22, 60], [40, 90, 255], t * 2) : mix([40, 90, 255], [232, 238, 255], (t - 0.5) * 2);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = `rgb(${c[0]} ${c[1]} ${c[2]})`;
    grid();
    ctx.restore();
  });
  k.slider('lum', (v) => {
    lum = v;
    s.draw();
    k.say(v < 20 ? tr('цветные отрезки почти так же темны, как чёрные, и свечение гаснет: окно по контрасту узкое.')
      : v > 85 ? tr('цветные отрезки почти сливаются с белым фоном, и растекаться почти нечему: окно по контрасту узкое.')
      : tr('цвет растекается по прозрачному диску, которого не нарисовано.'));
  });
});

export const watercolour: Mount = demo((k) => {
  let swap = false, wave = 14;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.38;
    const lw = Math.max(3, Math.min(w, h) * 0.012);
    /* off — смещение по радиусу: две линии идут вплотную, одна снаружи, другая внутри. */
    const path = (off: number) => {
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a = (i / 360) * Math.PI * 2;
        const r = R + off + wave * Math.sin(a * 9);
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    };
    /* Решает пара границ, а не сама область: тёмная фиолетовая с одной стороны, светлая
       оранжевая с другой, и окрашивается сторона оранжевой. */
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = swap ? '#f0a020' : '#6a2fb8';
    path(lw / 2);
    ctx.stroke();
    ctx.strokeStyle = swap ? '#6a2fb8' : '#f0a020';
    path(-lw / 2);
    ctx.stroke();
  });
  k.toggle('swap', (v) => {
    swap = v;
    s.draw();
    k.say(v ? tr('окрасилось то, что было снаружи. Область не менялась — поменялись местами линии.')
      : tr('внутри контура такой же белый, как снаружи, а выглядит чуть оранжевым: это и есть растекание.'));
  });
  k.slider('wave', (v) => { wave = v; s.draw(); });
});

export const colourPhi: Mount = demo((k) => {
  /* Всё по меткам времени кадров: что показано и когда — то и меряем. */
  let isi = 50, t0 = 0, now = 0, state = '', offAt = 0, frames = 0, measured = 0, last = 0;
  const got: number[] = [];
  const which = () => {
    const on = 50;
    const p = (now - t0) % ((on + isi) * 2);
    if (p < on) return 'red';
    if (p >= on + isi && p < on * 2 + isi) return 'green';
    return '';
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const st = which();
    if (!st) return;
    ctx.fillStyle = st === 'green' ? '#2ea84f' : '#e03a3a';
    ctx.beginPath();
    ctx.arc(st === 'green' ? w * 0.66 : w * 0.34, h / 2, Math.min(w, h) * 0.12, 0, Math.PI * 2);
    ctx.fill();
  });
  k.slider('isi', (v) => { isi = v; t0 = now; got.length = 0; });
  k.loop((t) => {
    now = t * 1000;
    if (!t0) t0 = now;
    s.draw();
    /* Настоящий интервал: от первого кадра без красного до первого кадра с зелёным. */
    const st = which();
    if (state === 'red' && st !== 'red') offAt = now;
    if (st === 'green' && state !== 'green' && offAt) { got.push(now - offAt); offAt = 0; }
    state = st;
    if (last && now - last < 200) { frames++; measured += now - last; }
    last = now;
    if (frames >= 60 && got.length) {
      const mean = got.reduce((a, b) => a + b, 0) / got.length;
      k.say(tr('задано {set} мс, на экране вышло {got} мс. Кадр здесь идёт {ms} мс, точнее интервал не выставить.', { set: isi, got: Math.round(mean), ms: num(measured / frames) }));
      frames = 0; measured = 0; got.length = 0;
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
    /* От лампы накаливания (тёплый) к пасмурному небу (холодный). Свет меняет только
       обстановку вокруг; ткань нарисована одними и теми же числами при любом положении
       ползунка — как на той фотографии, где пиксели одни, а вывод о свете у людей разный. */
    const light: [number, number, number] = [1.3 - p * 0.55, 1.05 - p * 0.05, 0.6 + p * 0.65];
    const room = (v: number) => `rgb(${Math.round(v * light[0])} ${Math.round(v * light[1])} ${Math.round(v * light[2])})`;
    ctx.fillStyle = room(150);
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = room(105);
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    fabric(ctx, w * 0.3, h * 0.08, w * 0.4, h * 0.84, [[131, 137, 186], [104, 86, 50]], [1, 1, 1]);
  });
  k.slider('illum', (v) => {
    illum = v;
    s.draw();
    k.say(v < 35 ? tr('если считать свет тёплым, вычесть надо желтизну — и ткань выйдет синей с чёрным.') : v > 65 ? tr('если считать свет холодным дневным, вычитается синева — и та же ткань выходит белой с золотым.') : tr('здесь освещение неоднозначно, и системе не на чем остановиться.'));
  });
});

export const colourConstancy: Mount = demo((k) => {
  let illum = 50;
  /* «Краска» — отражательная способность плашки, от 0 до 255 по каналам. */
  const patches: [string, [number, number, number]][] = [
    ['красный', [190, 60, 55]],
    ['зелёный', [70, 150, 80]],
    ['синий', [60, 85, 175]],
    ['белый', [225, 225, 225]],
    ['серый', [128, 128, 128]],
  ];
  const light = (): [number, number, number] => {
    const p = illum / 100;
    return [1.25 - p * 0.5, 1.0, 0.65 + p * 0.6];
  };
  const rgb = (c: number[]) => `rgb(${c[0]} ${c[1]} ${c[2]})`;
  const lit = (c: number[]) => { const L = light(); return c.map((v, i) => Math.min(255, Math.round(v * L[i]))); };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = rgb(lit([90, 90, 90]));
    ctx.fillRect(0, 0, w, h);
    const pw = w / patches.length;
    patches.forEach(([, c], i) => {
      ctx.fillStyle = rgb(lit(c));
      ctx.fillRect(i * pw + 8, h * 0.2, pw - 16, h * 0.6);
    });
  });
  const general = () => tr('краска у каждой плашки одна и та же во всём диапазоне. Меняется только множитель освещения — а цвета вы всё равно называете правильно.');
  k.slider('illum', (v) => {
    illum = v;
    s.draw();
    k.say(general());
  });
  /* Пипетка: пиксель — то, что пришло в глаз, краска — то, что о поверхности докладывает зрение. */
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  canvas?.addEventListener('mousemove', (ev) => {
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    const pw = r.width / patches.length, i = Math.floor(x / pw);
    const inside = i >= 0 && i < patches.length && x - i * pw >= 8 && x - i * pw <= pw - 8 && y >= r.height * 0.2 && y <= r.height * 0.8;
    const d = canvas.getContext('2d')!.getImageData(Math.round(x * (canvas.width / r.width)), Math.round(y * (canvas.height / r.height)), 1, 1).data;
    const px = rgb([d[0], d[1], d[2]]);
    k.say(inside
      ? tr('плашка «{name}»: пиксель {px}, краска {paint}. Двигайте освещение: пиксель меняется, краска нет.', { name: tr(patches[i][0]), px, paint: rgb(patches[i][1]) })
      : tr('фон: пиксель {px}. Наведите на плашку — покажет и пиксель, и краску.', { px }));
  });
  canvas?.addEventListener('mouseleave', () => k.say(general()));
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
    /* При 0° полосы вертикальны; положительный угол — верх полос уходит вправо. */
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillStyle = '#efefef';
    ctx.fillRect(-r * 1.5, -r * 1.5, r * 3, r * 3);
    ctx.fillStyle = '#1b1b1b';
    for (let x = -r * 1.5; x < r * 1.5; x += 14) ctx.fillRect(x, -r * 1.5, 7, r * 3);
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
  const slider = k.el('[data-slider="guess"]') as HTMLInputElement | null;
  k.slider('guess', (v) => { guess = v; s.draw(); });
  k.button('go', (el) => {
    phase = 'adapt';
    t0 = performance.now();
    el.disabled = true;
    s.draw();
    k.say(tr('смотрите в красную точку, не отводя взгляд.'));
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 45 - (performance.now() - t0) / 1000;
      k.clock(tr('{s} с', { s: Math.max(0, left).toFixed(0) }));
      if (left <= 0) {
        clearInterval(timer);
        phase = 'test';
        el.disabled = false;
        /* Пробная решётка начинает с заметного наклона в случайную сторону: если оставить
           ноль, задачу можно «решить», ничего не трогая. */
        guess = (Math.random() < 0.5 ? -1 : 1) * (8 + Math.round(Math.random() * 5));
        if (slider) slider.value = String(guess);
        s.draw();
        k.say(tr('теперь выставьте решётку в вертикаль и нажмите «проверить».'));
      }
    }, 100);
  });
  /* Решётка после адаптации к +15° кажется отклонённой влево, поэтому, выставляя
     «вертикаль», человек доворачивает её вправо: ожидаемая ошибка — с тем же знаком. */
  k.button('check', () => {
    k.say(guess === 0 ? tr('ровно ноль — последействия у вас не осталось или оно уже прошло.')
      : guess > 0 ? tr('вы поставили решётку на {d}° вправо — в ту же сторону, куда была наклонена адаптирующая (+15°). Так и должно быть: настоящая вертикаль после адаптации кажется заваленной влево, и вы это компенсировали.', { d: Math.abs(guess) })
      : tr('вы поставили решётку на {d}° влево. После адаптации к +15° ожидается обратное — сдвиг вправо: если эффект был, он уже прошёл или перекрыт разбросом установки.', { d: Math.abs(guess) }));
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
    k.say(tr('смотрите в точку в центре пятна.'));
    clearInterval(timer);
    timer = window.setInterval(() => {
      const left = 20 - (performance.now() - t0) / 1000;
      k.clock(tr('{s} с', { s: Math.max(0, left).toFixed(0) }));
      if (left <= 0) {
        clearInterval(timer);
        phase = 'idle';
        el.disabled = false;
        s.draw();
        k.say(tr('теперь отведите взгляд от экрана: посмотрите на ладонь, потом на стол, потом на дальнюю стену. Образ на сетчатке один и тот же, а размер каждый раз новый.'));
      }
    }, 100);
  });
});

export const rubinVase: Mount = demo((k) => {
  let cue = 50;
  /* Профиль лица: полуширина вазы (в долях ширины холста) по высоте сверху вниз. Где
     у лица выступ — лоб, нос, губы, подбородок, — там ваза сужается. Ваза — тело
     вращения этого профиля: связь между двумя прочтениями заложена в само построение. */
  const knots: [number, number][] = [
    [0, 0.3], [0.07, 0.3], [0.12, 0.21], [0.22, 0.165], [0.3, 0.16], [0.36, 0.19], [0.44, 0.15],
    [0.52, 0.085], [0.57, 0.15], [0.62, 0.125], [0.655, 0.155], [0.69, 0.13], [0.74, 0.175],
    [0.8, 0.13], [0.88, 0.22], [0.94, 0.26], [1, 0.26],
  ];
  const profile = (t: number) => {
    let i = 0;
    while (i < knots.length - 2 && t > knots[i + 1][0]) i++;
    const [t0, a] = knots[i], [t1, b] = knots[i + 1];
    const u = (t - t0) / (t1 - t0);
    return a + (b - a) * (1 - Math.cos(Math.PI * u)) / 2;
  };
  const s = k.surface(({ ctx, w, h }) => {
    const p = cue / 100;
    const vaseW = Math.min(w, h * 1.3);
    const cx = w / 2, top = h * 0.06, bot = h * 0.94;
    const vase = (fresh = true) => {
      if (fresh) ctx.beginPath();
      ctx.moveTo(cx + profile(0) * vaseW, top);
      for (let i = 1; i <= 200; i++) { const t = i / 200; ctx.lineTo(cx + profile(t) * vaseW, top + (bot - top) * t); }
      for (let i = 200; i >= 0; i--) { const t = i / 200; ctx.lineTo(cx - profile(t) * vaseW, top + (bot - top) * t); }
      ctx.closePath();
    };
    /* Без признаков (50) — плоская двухцветная картинка: чёрные профили, белая ваза. */
    ctx.fillStyle = '#1d1d22';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f2f0ea';
    vase();
    ctx.fill();
    const vaseCue = Math.max(0, (50 - cue) / 50), faceCue = Math.max(0, (cue - 50) / 50);
    if (vaseCue) {
      /* Объём и поясок — признаки предмета, и достаются они вазе. */
      ctx.save();
      vase();
      ctx.clip();
      const R = 0.3 * vaseW;
      const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      g.addColorStop(0, `rgba(60,60,70,${0.75 * vaseCue})`);
      g.addColorStop(0.35, 'rgba(255,255,255,0)');
      g.addColorStop(0.45, `rgba(255,255,255,${0.6 * vaseCue})`);
      g.addColorStop(1, `rgba(60,60,70,${0.85 * vaseCue})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = `rgba(150,110,60,${vaseCue})`;
      ctx.lineWidth = Math.max(2, h * 0.012);
      for (const t of [0.1, 0.9]) {
        const y = top + (bot - top) * t, r = profile(t) * vaseW;
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.12, 0, 0, Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (faceCue) {
      /* Глаз, бровь и тень — признаки лица, и достаются они профилям. */
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      vase(false);
      ctx.clip('evenodd');
      for (const sgn of [-1, 1]) {
        const ex = cx + sgn * (profile(0.36) * vaseW + Math.min(w, h) * 0.08), ey = top + (bot - top) * 0.36;
        const g = ctx.createLinearGradient(cx, 0, cx + sgn * w * 0.5, 0);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, `rgba(120,90,80,${0.55 * faceCue})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const er = Math.min(w, h) * 0.035;
        ctx.fillStyle = `rgba(242,240,234,${faceCue})`;
        ctx.beginPath();
        ctx.ellipse(ex, ey, er, er * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(29,29,34,${faceCue})`;
        ctx.beginPath();
        ctx.arc(ex - sgn * er * 0.35, ey, er * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(242,240,234,${0.8 * faceCue})`;
        ctx.lineWidth = Math.max(2, er * 0.3);
        ctx.beginPath();
        ctx.moveTo(ex - er * 1.2, ey - er * 1.3);
        ctx.quadraticCurveTo(ex, ey - er * 1.9, ex + er * 1.2, ey - er * 1.3);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
  k.slider('cue', (v) => {
    cue = v;
    s.draw();
    k.say(v < 30 ? tr('объём и поясок достались вазе: она стала предметом, а профили — тёмным фоном за ней.')
      : v > 70 ? tr('глаза и тень достались профилям: теперь лица — предметы, а ваза — просвет между ними.')
      : tr('контур никому не отдан, и прочтения меняются сами.'));
  });
});

export const figureGround: Mount = demo((k) => {
  let convex = 50, area = 50, sym = 50;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    /* Семь полос: чёрные на местах 1, 3, 5, белые на 0, 2, 4, 6. Выпуклость, площадь и
       симметрия — три независимых признака владения контуром, и каждый ползунок
       при 50 % никому не помогает. */
    const n = 7, bw = w / n;
    /* Выпуклость: три бугра по высоте; c > 0 — края чёрных выгнуты наружу (чёрные
       выпуклые), c < 0 — внутрь, и тогда выпуклые белые. */
    const b = (t: number) => Math.abs(Math.sin(3 * Math.PI * t));
    const c = ((convex - 50) / 50) * bw * 0.25;
    /* Волна края — своя у каждой чёрной полосы, от неё зависит симметрия. */
    const e = (j: number, t: number) => Math.sin(Math.PI * (3 + j) * t + j * 1.7);
    const A = bw * 0.1;
    const wid = bw * (0.6 + (area / 100) * 0.8);
    /* Симметрия 100 — у каждой чёрной полосы правый край зеркален левому (белые при этом
       несимметричны); 0 — правый край повторяет левый край следующей чёрной полосы, и тогда
       симметричны белые. */
    const q = sym / 100;
    ctx.fillStyle = '#20222c';
    for (let j = 0; j < 3; j++) {
      const mid = (2 * j + 1.5) * bw, L = mid - wid / 2, R = mid + wid / 2;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const t = i / 120; ctx.lineTo(L - c * b(t) - A * e(j, t), t * h); }
      for (let i = 120; i >= 0; i--) { const t = i / 120; ctx.lineTo(R + c * b(t) + A * (q * e(j, t) + (1 - q) * e(j + 1, t)), t * h); }
      ctx.closePath();
      ctx.fill();
    }
  });
  /* Фигурой охотнее становится выпуклое, симметричное и меньшее по площади. */
  const side = (v: number, blackWhenHigh: boolean) => v === 50 ? tr('ни за кого') : (v > 50) === blackWhenHigh ? tr('за чёрные') : tr('за белые');
  const upd = () => {
    s.draw();
    k.say(tr('выпуклость {c}, площадь {a}, симметрия {s}. Каждый признак тянет контур на свою сторону, побеждает сумма.',
      { c: side(convex, true), a: side(area, false), s: side(sym, true) }));
  };
  k.slider('convex', (v) => { convex = v; upd(); });
  k.slider('area', (v) => { area = v; upd(); });
  k.slider('sym', (v) => { sym = v; upd(); });
});

export const cofferIllusion: Mount = demo((k) => {
  let len = 60, circles = false;
  /* Шестнадцать кругов, 4 × 4. Нарисованы они не обводкой, а тем же узором из панелей,
     сдвинутым внутри круга на полпанели: край круга есть только как шов узора. */
  const spots = (w: number, h: number) => {
    const out: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out.push([((c + 0.5) * w) / 4, ((r + 0.5) * h) / 4]);
    return { out, R: Math.min(w, h) / 4 * 0.42 };
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.62);
    ctx.fillRect(0, 0, w, h);
    const { out, R } = spots(w, h);
    /* Панель — выпуклый прямоугольник: светлые верх и левый край, тёмные низ и правый.
       len — какая доля каждой стороны прорисована. */
    const cw = R * 0.9, ch = R * 0.62;
    const part = len / 100;
    const panels = (ox: number, oy: number) => {
      ctx.lineWidth = Math.max(2, R * 0.06);
      for (let y = oy - ch; y < h + ch; y += ch)
        for (let x = ox - cw; x < w + cw; x += cw) {
          const p = cw * 0.1;
          const gx = ((cw - 2 * p) * (1 - part)) / 2, gy = ((ch - 2 * p) * (1 - part)) / 2;
          for (const [x1, y1, x2, y2, light] of [
            [x + p + gx, y + p, x + cw - p - gx, y + p, true],
            [x + p, y + p + gy, x + p, y + ch - p - gy, true],
            [x + p + gx, y + ch - p, x + cw - p - gx, y + ch - p, false],
            [x + cw - p, y + p + gy, x + cw - p, y + ch - p - gy, false],
          ] as const) {
            ctx.strokeStyle = light ? '#f2f2f2' : '#262626';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
    };
    panels(0, 0);
    for (const [x, y] of out) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = grey(0.62);
      ctx.fillRect(x - R, y - R, R * 2, R * 2);
      panels(cw / 2, ch / 2);
      ctx.restore();
    }
    if (circles) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      for (const [x, y] of out) {
        ctx.beginPath();
        ctx.arc(x, y, R, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  });
  k.slider('len', (v) => { len = v; s.draw(); });
  k.button('circles', (el) => {
    circles = !circles;
    el.textContent = circles ? tr('убрать обводку') : tr('обвести круги');
    s.draw();
    k.say(circles ? tr('кругов шестнадцать, и край ни одного не нарисован: внутри круга тот же узор из панелей, только сдвинутый на полпанели. Круги были здесь всё время и просто проиграли прямоугольникам конкуренцию за контур.') : '');
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
    ctx.fillText(tr('{s} с', { s: 0 }), 2, 11);
    const lbl = tr('{s} с', { s: num(max) });
    ctx.fillText(lbl, w - ctx.measureText(lbl).width - 2, 11);
  });
  const tap = () => {
    const now = performance.now();
    if (last) gaps.push((now - last) / 1000);
    last = now;
    hist.draw();
    if (!gaps.length) { k.say(tr('засекли. Жмите на каждом следующем перевороте.')); return; }
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    k.say(tr('интервалов: {n}, в среднем {s} с. У большинства выходит от полутора до пяти.', { n: gaps.length, s: num(mean) }));
  };
  k.button('tap', tap);
  k.button('reset', () => { gaps.length = 0; last = 0; hist.draw(); k.say(tr('счёт сброшен.')); });
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
      /* Лестница Шрёдера: ступенчатый профиль, его копия, сдвинутая по косой «вглубь»,
         рёбра между ними и стенка под лестницей. Сверху на ступени или снизу на их изнанку —
         рисунок одинаково годится для обоих. */
      const n = 5, st = (R * 1.5) / n;
      const D: [number, number] = [R * 0.55, -R * 0.4];
      const x0 = cx - R * 0.95, y0 = cy + R * 0.85;
      const prof: [number, number][] = [[x0, y0]];
      for (let i = 0; i < n; i++) {
        prof.push([x0 + i * st, y0 - (i + 1) * st]);
        prof.push([x0 + (i + 1) * st, y0 - (i + 1) * st]);
      }
      const end: [number, number] = [x0 + n * st, y0];
      const line = (pts: [number, number][], dx = 0, dy = 0) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy)));
        ctx.stroke();
      };
      line([...prof, end, [x0, y0]]);
      line([...prof, end], D[0], D[1]);
      ctx.beginPath();
      for (const [x, y] of [...prof, end]) { ctx.moveTo(x, y); ctx.lineTo(x + D[0], y + D[1]); }
      ctx.stroke();
    } else {
      /* Кольца со смещёнными центрами: то башня, увиденная сверху, то тоннель. */
      for (let i = 0; i < 7; i++) {
        const r = R * (1 - i * 0.13);
        ctx.beginPath();
        ctx.arc(cx + R * 0.05 * i, cy - R * 0.04 * i, r, 0, Math.PI * 2);
        ctx.stroke();
      }
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
      ctx.fillRect(i * bw + 10, h - 28 - Math.min(mean / 8, 1) * (h - 40), bw - 20, Math.min(mean / 8, 1) * (h - 40));
      ctx.fillStyle = '#6b6b70';
      /* Подпись в две строки и не шире столбика: на узком экране три подписи иначе налезают. */
      const name = { necker: tr('куб Неккера'), schroder: tr('лестница Шрёдера'), rings: tr('кольца') }[key] ?? key;
      ctx.fillText(name, i * bw + 12, h - 16, bw - 16);
      ctx.fillText(mean ? tr('{s} с', { s: num(mean) }) : '—', i * bw + 12, h - 3, bw - 16);
    });
  });
  k.select('fig', (v) => { fig = v; last = 0; s.draw(); });
  const tap = () => {
    const now = performance.now();
    if (last) gaps[fig].push((now - last) / 1000);
    last = now;
    hist.draw();
    k.say(tr('столбики внизу — ваши средние по трём стимулам. Сравнение между ними и есть самое интересное.'));
  };
  k.button('tap', tap);
  k.button('reset', () => { for (const key of Object.keys(gaps)) gaps[key].length = 0; last = 0; hist.draw(); });
  k.space((down) => { if (down) tap(); });
});

export const pareidolia: Mount = demo((k) => {
  let seed = 1, scale = 8, rolls = 0, what = 'noise', hires = false;
  const mars: Record<string, HTMLImageElement> = {};
  let assets: Record<string, string> = {};
  try { assets = JSON.parse(k.root.dataset.assets ?? '{}'); } catch { assets = {}; }
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.1);
    ctx.fillRect(0, 0, w, h);
    if (what === 'mars') {
      /* Снимок «Викинга» 1976 года и то же место у Mars Global Surveyor: одна и та же
         гора, и всё различие — в разрешении и в угле освещения. */
      const img = mars[hires ? 'mars-mgs' : 'mars-viking'];
      if (!img) return;
      const sc = Math.min(w / img.width, h / img.height) * 0.95;
      ctx.drawImage(img, (w - img.width * sc) / 2, (h - img.height * sc) / 2, img.width * sc, img.height * sc);
      return;
    }
    const r = rnd(seed);
    const cell = scale;
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    const gridv: number[] = [];
    for (let i = 0; i < cols * rows; i++) gridv.push(r());
    const at = (c: number, rr: number) => gridv[Math.max(0, Math.min(rows - 1, rr)) * cols + Math.max(0, Math.min(cols - 1, c))];
    for (let rr = 0; rr < rows; rr++)
      for (let c = 0; c < cols; c++) {
        let v = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v += at(c + dx, rr + dy);
        v /= 9;
        ctx.fillStyle = grey(v);
        ctx.fillRect(c * cell, rr * cell, cell + 1, cell + 1);
      }
  });
  const sel = k.el('[data-select="what"]') as HTMLSelectElement | null;
  const marsNote = () => k.say(hires
    ? tr('та же гора на снимке 2001 года: камера Mars Global Surveyor различает детали примерно в 30 раз мельче. Лица нет и не было.')
    : tr('снимок 1976 года, 43 метра на пиксель. Лицо тут видят все.'));
  k.select('what', (v) => { what = v; s.draw(); if (v === 'mars') marsNote(); });
  k.slider('scale', (v) => { scale = v; s.draw(); });
  let first = true;
  k.toggle('hires', (v) => {
    hires = v;
    /* Переключатель снимков имеет смысл только для Марса — на него он и переводит. */
    if (!first) { what = 'mars'; if (sel) sel.value = 'mars'; marsNote(); }
    first = false;
    s.draw();
  });
  k.button('roll', () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    rolls++;
    what = 'noise';
    if (sel) sel.value = 'noise';
    s.draw();
    k.say(tr('бросок {n}. Система опознания лиц настроена так, чтобы не пропустить ни одного, — а значит, обязана иногда срабатывать впустую.', { n: rolls }));
  });
  for (const id of ['mars-viking', 'mars-mgs']) {
    const src = assets[id];
    if (!src) continue;
    const img = new Image();
    img.onload = () => { mars[id] = img; s.draw(); };
    img.src = src;
  }
});
