/* Демонстрации на открытых материалах.
 *
 * Пути к файлам приходят с сервера в data-assets: они же перечислены в assets.json
 * вместе с лицензией, и подпись под демонстрацией строит Demo.astro. Здесь остаётся
 * только рисование — но все преобразования наши: пороги, блоки, размытие и цветовой
 * налёт считаются на канвасе, а не приносятся готовой картинкой.
 */
import { demo, grey, INK, MARK, PAPER, rnd, type Kit, type Mount } from '../kit';

const assets = (k: Kit): Record<string, string> => {
  try {
    return JSON.parse(k.root.dataset.assets ?? '{}');
  } catch {
    return {};
  }
};

const load = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Вписывает картинку в холст целиком, не искажая пропорций. */
const fit = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, scale = 1) => {
  const s = Math.min(w / img.width, h / img.height) * scale;
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return { x: (w - dw) / 2, y: (h - dh) / 2, w: dw, h: dh };
};

export const duckRabbit: Mount = demo((k) => {
  let bias = 50, trace: 'none' | 'duck' | 'rabbit' = 'none';
  let img: HTMLImageElement | null = null;
  let box = { x: 0, y: 0, w: 0, h: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    ctx.save();
    /* Поворот — честная подсказка: у утки клюв горизонтален, у кролика уши лежат.
       Наклоняя рисунок, мы склоняем чашу весов, ничего в нём не меняя. */
    ctx.translate(w / 2, h / 2);
    ctx.rotate((((bias - 50) / 50) * 55 * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
    box = fit(ctx, img, w, h, 0.92);
    if (trace !== 'none') {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (trace === 'duck') {
        /* Клюв: два отростка слева, которые у кролика становятся ушами. */
        ctx.ellipse(box.x + box.w * 0.19, box.y + box.h * 0.39, box.w * 0.17, box.h * 0.1, -0.15, 0, Math.PI * 2);
      } else {
        ctx.ellipse(box.x + box.w * 0.19, box.y + box.h * 0.39, box.w * 0.17, box.h * 0.1, -0.15, 0, Math.PI * 2);
        ctx.moveTo(box.x + box.w * 0.72, box.y + box.h * 0.62);
        ctx.ellipse(box.x + box.w * 0.62, box.y + box.h * 0.6, box.w * 0.1, box.h * 0.08, 0.4, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
    ctx.restore();
  });
  k.slider('bias', (v) => {
    bias = v;
    s.draw();
    k.say(v < 25 ? 'клюв встал горизонтально — утка.' : v > 75 ? 'уши легли назад — кролик.' : 'ровно — и переключается само.');
  });
  k.button('duck', () => { trace = trace === 'duck' ? 'none' : 'duck'; s.draw(); k.say('обведён клюв.'); });
  k.button('rabbit', () => { trace = trace === 'rabbit' ? 'none' : 'rabbit'; s.draw(); k.say('те же два отростка — уши, а вмятина справа — рот.'); });
  load(assets(k)['duck-rabbit']).then((i) => { img = i; s.draw(); });
});

export const myWifeMotherInLaw: Mount = demo((k) => {
  let trace: 'none' | 'young' | 'old' = 'none';
  let img: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    const box = fit(ctx, img, w, h, 0.96);
    if (trace === 'none') return;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 3;
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = MARK;
    const at = (fx: number, fy: number): [number, number] => [box.x + box.w * fx, box.y + box.h * fy];
    if (trace === 'young') {
      /* Ухо молодой — это глаз старухи, а подбородок — нос. */
      ctx.beginPath();
      ctx.ellipse(...at(0.5, 0.54), box.w * 0.07, box.h * 0.05, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText('ухо', ...at(0.57, 0.53));
      ctx.beginPath();
      ctx.ellipse(...at(0.36, 0.69), box.w * 0.09, box.h * 0.05, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText('подбородок', ...at(0.06, 0.78));
    } else {
      ctx.beginPath();
      ctx.ellipse(...at(0.5, 0.54), box.w * 0.07, box.h * 0.05, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText('глаз', ...at(0.57, 0.53));
      ctx.beginPath();
      ctx.ellipse(...at(0.36, 0.69), box.w * 0.09, box.h * 0.05, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillText('нос', ...at(0.18, 0.79));
    }
  });
  k.button('young', () => { trace = trace === 'young' ? 'none' : 'young'; s.draw(); k.say('молодая отвернулась: то, что обведено, — ухо и подбородок.'); });
  k.button('old', () => { trace = trace === 'old' ? 'none' : 'old'; s.draw(); k.say('те же две области у старухи — глаз и кончик носа. Линии одни и те же.'); });
  load(assets(k)['wife-mother-in-law']).then((i) => { img = i; s.draw(); });
});

export const allIsVanity: Mount = demo((k) => {
  let blur = 0, zoom = 100;
  let img: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    ctx.save();
    /* Размытие и отход делают одно и то же: срезают высокие частоты. */
    ctx.filter = blur ? `blur(${blur}px)` : 'none';
    fit(ctx, img, w, h, zoom / 100);
    ctx.restore();
  });
  k.slider('blur', (v) => {
    blur = v;
    s.draw();
    k.say(v > 8 ? 'подробности срезаны — и вместо дамы у зеркала виден череп.' : '');
  });
  k.slider('zoom', (v) => { zoom = v; s.draw(); });
  load(assets(k)['all-is-vanity']).then((i) => { img = i; s.draw(); });
});

export const lincolnEffect: Mount = demo((k) => {
  let block = 22, blur = 0;
  let img: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    /* Квантование считается здесь, а не приносится готовым: блоки собираются
       уменьшением с выключенным сглаживанием и обратным растягиванием. */
    const box = { w: Math.min(w, (h * img.width) / img.height), h: 0 };
    box.h = (box.w * img.height) / img.width;
    const cols = Math.max(4, Math.round(box.w / block));
    const rows = Math.max(4, Math.round(box.h / block));
    const tmp = document.createElement('canvas');
    tmp.width = cols;
    tmp.height = rows;
    const tctx = tmp.getContext('2d')!;
    tctx.drawImage(img, 0, 0, cols, rows);
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.filter = blur ? `blur(${blur}px)` : 'none';
    ctx.drawImage(tmp, (w - box.w) / 2, (h - box.h) / 2, box.w, box.h);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  });
  k.slider('block', (v) => { block = v; s.draw(); });
  k.slider('blur', (v) => {
    blur = v;
    s.draw();
    k.say(v > 6 ? 'добавили размытия — и лицо проступило. Размытие срезало ложные края, которые внесло квантование.' : 'блоки добавили высоких частот, которых в лице не было. Они и маскируют.');
  });
  load(assets(k)['lincoln']).then((i) => { img = i; s.draw(); });
});

export const greyStrawberries: Mount = demo((k) => {
  let cast = 85;
  let img: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    const box = fit(ctx, img, w, h);
    /* Налёт накладывается попиксельно: красный канал прижимается, и ни одного
       пикселя с красным тоном на холсте не остаётся. */
    const p = cast / 100;
    const q = k.dpr;
    const d = ctx.getImageData(Math.round(box.x * q), Math.round(box.y * q), Math.round(box.w * q), Math.round(box.h * q));
    const a = d.data;
    for (let i = 0; i < a.length; i += 4) {
      const lum = (a[i] * 0.3 + a[i + 1] * 0.59 + a[i + 2] * 0.11);
      a[i] = a[i] * (1 - p) + lum * p * 0.62;
      a[i + 1] = a[i + 1] * (1 - p) + lum * p * 1.0;
      a[i + 2] = a[i + 2] * (1 - p) + lum * p * 1.12;
    }
    ctx.putImageData(d, Math.round(box.x * q), Math.round(box.y * q));
  });
  k.slider('cast', (v) => { cast = v; s.draw(); });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  canvas?.addEventListener('mousemove', (ev) => {
    const r = canvas.getBoundingClientRect();
    const dpr = canvas.width / r.width;
    const ctx = canvas.getContext('2d')!;
    const d = ctx.getImageData(Math.round((ev.clientX - r.left) * dpr), Math.round((ev.clientY - r.top) * dpr), 1, 1).data;
    const red = d[0] > d[1] && d[0] > d[2];
    k.say(`под курсором rgb(${d[0]} ${d[1]} ${d[2]}) — ${red ? 'красноватый' : 'не красный: зелёного и синего в нём больше'}.`);
  });
  load(assets(k)['strawberries']).then((i) => { img = i; s.draw(); });
});

export const mooneyFaces: Mount = demo((k) => {
  let threshold = 50, blurm = 4, t0 = performance.now(), found = false;
  let img: HTMLImageElement | null = null;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    if (!img) return;
    const box = { w: Math.min(w * 0.8, (h * 0.9 * img.width) / img.height), h: 0 };
    box.h = (box.w * img.height) / img.width;
    const x = (w - box.w) / 2, y = (h - box.h) / 2;
    ctx.save();
    ctx.filter = blurm ? `blur(${blurm}px)` : 'none';
    ctx.drawImage(img, x, y, box.w, box.h);
    ctx.restore();
    /* Порог считается здесь: лицо сводится к двум тонам, и полутонов не остаётся. */
    const q = k.dpr;
    const d = ctx.getImageData(Math.round(x * q), Math.round(y * q), Math.round(box.w * q), Math.round(box.h * q));
    const a = d.data;
    const cut = (threshold / 100) * 255;
    for (let i = 0; i < a.length; i += 4) {
      const v = a[i] > cut ? 255 : 0;
      a[i] = a[i + 1] = a[i + 2] = v;
    }
    ctx.putImageData(d, Math.round(x * q), Math.round(y * q));
  });
  k.slider('threshold', (v) => { threshold = v; s.draw(); });
  k.slider('blurm', (v) => { blurm = v; s.draw(); });
  k.button('found', (el) => {
    if (found) return;
    found = true;
    el.disabled = true;
    k.say(`${((performance.now() - t0) / 1000).toFixed(1)} с до узнавания. Второй раз этот секундомер на этой картинке уже не запустить: найденная организация применяется дальше автоматически.`);
  });
  k.loop(() => { if (!found) k.clock(`${((performance.now() - t0) / 1000).toFixed(1)} с`); });
  load(assets(k)['face-curie']).then((i) => { img = i; s.draw(); });
});

/* Глаза и рот на кадрированном портрете — в долях кадра. Значения выставлены по
   этому конкретному снимку: у другого портрета они будут другими. */
/* Измерено по координатной сетке на самом файле, а не на глаз: брови на 0.48,
   нижнее веко на 0.57, губы между 0.79 и 0.86. */
const CURIE = { eyes: [0.15, 0.46, 0.65, 0.14], mouth: [0.27, 0.77, 0.35, 0.11] } as const;

export const thatcher: Mount = demo((k) => {
  let rot = 180, flip = true;
  let img: HTMLImageElement | null = null;
  /* Лицо собирается на отдельном холсте в прямом положении и только потом
     поворачивается целиком. Собирать его в повёрнутой системе координат нельзя:
     заплаты считаются в долях исходника и уезжают вместе с поворотом. */
  const build = () => {
    if (!img) return null;
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext('2d')!;
    x.drawImage(img, 0, 0);
    if (flip)
      for (const [fx, fy, fw, fh] of [CURIE.eyes, CURIE.mouth]) {
        const sx = img.width * fx, sy = img.height * fy;
        const sw = img.width * fw, sh = img.height * fh;
        /* Заплата кладётся через мягкую маску: жёсткий шов виден сильнее самой
           гримасы и отвлекает от неё. */
        const patch = document.createElement('canvas');
        patch.width = Math.round(sw);
        patch.height = Math.round(sh);
        const px = patch.getContext('2d')!;
        px.translate(0, sh / 2);
        px.scale(1, -1);
        px.drawImage(img, sx, sy, sw, sh, 0, -sh / 2, sw, sh);
        px.globalCompositeOperation = 'destination-in';
        const g = px.createRadialGradient(sw / 2, sh / 2, 0, sw / 2, sh / 2, Math.max(sw, sh) / 2);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(0.72, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        px.fillStyle = g;
        px.fillRect(0, 0, sw, sh);
        x.drawImage(patch, sx, sy);
      }
    return c;
  };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const face = build();
    if (!face) return;
    const bw = Math.min(w * 0.62, (h * 0.94 * face.width) / face.height);
    const bh = (bw * face.height) / face.width;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(face, -bw / 2, -bh / 2, bw, bh);
    ctx.restore();
  });
  k.slider('rot', (v) => {
    rot = v;
    s.draw();
    k.say(v > 150 ? 'вверх ногами — почти нормальное лицо.' : v < 40 ? 'прямо — и это гримаса. Пиксели те же самые.' : v > 60 && v < 130 ? 'где-то здесь у большинства и появляется гримаса.' : '');
  });
  k.toggle('flip', (v) => { flip = !v; s.draw(); }, false);
  load(assets(k)['face-curie']).then((i) => { img = i; s.draw(); });
});

const FACE_IDS = ['face-chekhov', 'face-mendeleev', 'face-kovalevskaya', 'face-curie', 'face-tesla'];

/* Контроль — дома, нарисованные нами. Своя графика тут не прихоть: фотографий
   зданий со столь же чистой лицензией под рукой нет, а линейный домик задаётся
   параметрами, и потому пары «похожие / разные» строятся честно. */
const house = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) => {
  const r = rnd(seed);
  ctx.fillStyle = grey(0.86);
  ctx.fillRect(x, y + h * 0.35, w, h * 0.65);
  ctx.fillStyle = grey(0.45);
  ctx.beginPath();
  ctx.moveTo(x - w * 0.06, y + h * 0.36);
  ctx.lineTo(x + w / 2, y + h * (0.08 + r() * 0.14));
  ctx.lineTo(x + w * 1.06, y + h * 0.36);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = grey(0.25);
  const rows = 2, cols = 3;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (r() < 0.25) continue;
      ctx.fillRect(x + w * (0.12 + j * 0.28), y + h * (0.46 + i * 0.22), w * 0.16, h * 0.14);
    }
  ctx.fillRect(x + w * (0.3 + r() * 0.4), y + h * 0.78, w * 0.14, h * 0.22);
  ctx.fillStyle = grey(0.35);
  ctx.fillRect(x + w * (0.1 + r() * 0.7), y + h * (0.1 + r() * 0.1), w * 0.08, h * 0.16);
};

export const faceInversion: Mount = demo((k) => {
  const imgs: HTMLImageElement[] = [];
  const results: Record<string, [number, number, number]> = {
    'лица прямо': [0, 0, 0],
    'лица вверх ногами': [0, 0, 0],
    'дома прямо': [0, 0, 0],
    'дома вверх ногами': [0, 0, 0],
  };
  let trial: { kind: 'face' | 'house'; inverted: boolean; same: boolean; a: number; b: number } | null = null;
  let t0 = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!trial) return;
    const bw = w * 0.34, bh = h * 0.86;
    const draw = (slot: number, which: number) => {
      const x = slot ? w * 0.55 : w * 0.11;
      const y = (h - bh) / 2;
      ctx.save();
      if (trial!.inverted) {
        ctx.translate(x + bw / 2, y + bh / 2);
        ctx.rotate(Math.PI);
        ctx.translate(-bw / 2, -bh / 2);
      } else ctx.translate(x, y);
      if (trial!.kind === 'face') {
        const img = imgs[which];
        if (img) {
          const iw = Math.min(bw, (bh * img.width) / img.height);
          const ih = (iw * img.height) / img.width;
          ctx.drawImage(img, (bw - iw) / 2, (bh - ih) / 2, iw, ih);
        }
      } else house(ctx, bw * 0.08, bh * 0.1, bw * 0.84, bh * 0.8, which * 7919 + 13);
      ctx.restore();
    };
    draw(0, trial.a);
    draw(1, trial.b);
  });
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const keys = Object.keys(results);
    const bw = w / keys.length;
    ctx.font = '10px system-ui, sans-serif';
    keys.forEach((key, i) => {
      const [hit, n, ms] = results[key];
      const acc = n ? hit / n : 0;
      ctx.fillStyle = key.startsWith('лица') ? MARK : '#3b6fd0';
      ctx.fillRect(i * bw + 8, h - 16 - acc * (h - 30), bw - 16, acc * (h - 30));
      ctx.fillStyle = '#6b6b70';
      ctx.fillText(key, i * bw + 6, h - 4);
      if (n) ctx.fillText(`${Math.round(acc * 100)} % / ${Math.round(ms / n)} мс`, i * bw + 6, 12);
    });
  });
  const stage = k.stage;
  const next = (left: number) => {
    if (!left) {
      stage.innerHTML = '';
      const f = results['лица прямо'][1] ? results['лица прямо'][0] / results['лица прямо'][1] : 0;
      const fi = results['лица вверх ногами'][1] ? results['лица вверх ногами'][0] / results['лица вверх ногами'][1] : 0;
      const ho = results['дома прямо'][1] ? results['дома прямо'][0] / results['дома прямо'][1] : 0;
      const hi = results['дома вверх ногами'][1] ? results['дома вверх ногами'][0] / results['дома вверх ногами'][1] : 0;
      k.say(`цена переворота: у лиц ${Math.round((f - fi) * 100)} процентных пунктов, у домов ${Math.round((ho - hi) * 100)}. Если первое заметно больше второго, вы только что воспроизвели Йина.`);
      return;
    }
    const r = rnd(Date.now() % 99991 + left);
    const kind = r() > 0.5 ? 'face' : 'house';
    const inverted = r() > 0.5;
    const same = r() > 0.5;
    const a = Math.floor(r() * 5);
    const b = same ? a : (a + 1 + Math.floor(r() * 4)) % 5;
    trial = { kind, inverted, same, a, b };
    t0 = performance.now();
    s.draw();
    stage.innerHTML = '<p class="ill-q">одно и то же или разное?</p>';
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, said] of [['одно и то же', true], ['разное', false]] as const) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ill-btn';
      btn.textContent = label;
      btn.onclick = () => {
        const key = `${kind === 'face' ? 'лица' : 'дома'} ${inverted ? 'вверх ногами' : 'прямо'}`;
        const cur = results[key];
        cur[0] += said === same ? 1 : 0;
        cur[1] += 1;
        cur[2] += performance.now() - t0;
        chart.draw();
        next(left - 1);
      };
      row.append(btn);
    }
    stage.append(row);
  };
  k.button('start', (el) => { el.disabled = true; next(24); });
  Promise.all(FACE_IDS.map((id) => load(assets(k)[id]))).then((list) => {
    imgs.push(...list);
    s.draw();
  });
});
