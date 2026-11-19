/* Демонстрации на открытых материалах.
 *
 * Пути к файлам приходят с сервера в data-assets: они же перечислены в assets.json
 * вместе с лицензией, и подпись под демонстрацией строит Demo.astro. Здесь остаётся
 * только рисование — но все преобразования наши: пороги, блоки, размытие и цветовой
 * налёт считаются на канвасе, а не приносятся готовой картинкой.
 */
import { demo, grey, INK, MARK, PAPER, rnd, type Kit, type Mount } from '../kit';
import { num, tr } from '../i18n';

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
    const ang = (((bias - 50) / 50) * 55 * Math.PI) / 180;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(ang);
    ctx.translate(-w / 2, -h / 2);
    /* Масштаб считается по рамке повёрнутого листа, чтобы углы не уходили за холст. */
    const c = Math.abs(Math.cos(ang)), sn = Math.abs(Math.sin(ang));
    const fitRot = Math.min(w / (img.width * c + img.height * sn), h / (img.width * sn + img.height * c));
    box = fit(ctx, img, w, h, (0.92 * fitRot) / Math.min(w / img.width, h / img.height));
    if (trace !== 'none') {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 4;
      ctx.beginPath();
      /* Клюв: два отростка слева, которые у кролика становятся ушами. Доли кадра
         сняты по сетке на самом файле. */
      ctx.ellipse(box.x + box.w * 0.2, box.y + box.h * 0.36, box.w * 0.2, box.h * 0.12, 0.12, 0, Math.PI * 2);
      if (trace === 'rabbit') {
        /* Выемка на затылке утки — рот кролика. */
        ctx.moveTo(box.x + box.w * 0.79, box.y + box.h * 0.52);
        ctx.ellipse(box.x + box.w * 0.73, box.y + box.h * 0.52, box.w * 0.06, box.h * 0.06, 0, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
    ctx.restore();
  });
  k.slider('bias', (v) => {
    bias = v;
    s.draw();
    k.say(v < 25 ? tr('клюв опущен вниз, как у птицы, которая клюёт, — утка.') : v > 75 ? tr('уши встали торчком — кролик.') : tr('как в оригинале: клюв и уши лежат горизонтально, и прочтение переключается само.'));
  });
  k.button('duck', () => { trace = trace === 'duck' ? 'none' : 'duck'; s.draw(); k.say(tr('обведён клюв.')); });
  k.button('rabbit', () => { trace = trace === 'rabbit' ? 'none' : 'rabbit'; s.draw(); k.say(tr('те же два отростка — уши, а вмятина справа — рот.')); });
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
    const at = (fx: number, fy: number): [number, number] => [box.x + box.w * fx, box.y + box.h * fy];
    /* Ухо молодой — это глаз старухи, а подбородок — кончик носа. Доли кадра сняты
       по сетке на самом файле: ухо под локонами, подбородок внизу профиля. */
    ctx.beginPath();
    ctx.ellipse(...at(0.556, 0.346), box.w * 0.04, box.h * 0.04, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(...at(0.475, 0.43), box.w * 0.05, box.h * 0.035, 0.3, 0, Math.PI * 2);
    ctx.stroke();
    /* Подпись с белой обводкой: на тёмном меху и на светлой шали она читается одинаково. */
    const label = (text: string, x: number, y: number, align: CanvasTextAlign) => {
      ctx.font = `bold ${Math.max(12, Math.round(box.w * 0.028))}px system-ui, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = MARK;
      ctx.fillText(text, x, y);
    };
    const young = trace === 'young';
    label(young ? tr('ухо') : tr('глаз'), ...at(0.61, 0.346), 'left');
    label(young ? tr('подбородок') : tr('нос'), ...at(0.41, 0.43), 'right');
  });
  k.button('young', () => { trace = trace === 'young' ? 'none' : 'young'; s.draw(); k.say(tr('молодая отвернулась: то, что обведено, — ухо и подбородок.')); });
  k.button('old', () => { trace = trace === 'old' ? 'none' : 'old'; s.draw(); k.say(tr('те же две области у старухи — глаз и кончик носа. Линии одни и те же.')); });
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
    k.say(v > 8 ? tr('подробности срезаны — и вместо дамы у зеркала виден череп.') : '');
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
  const say = () =>
    k.say(block < 6 ? tr('блоки мельче деталей лица — квантования почти нет, и маскировать нечему.')
      : blur > 6 ? tr('добавили размытия — и лицо проступило. Размытие срезало ложные края, которые внесло квантование.')
      : tr('блоки добавили высоких частот, которых в лице не было. Они и маскируют.'));
  k.slider('block', (v) => { block = v; s.draw(); say(); });
  k.slider('blur', (v) => { blur = v; s.draw(); say(); });
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
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  /* Последняя точка под курсором: после сдвига ползунка пипетка перечитывает её же,
     иначе в строке висели бы числа от прежнего налёта. */
  let probe: [number, number] | null = null;
  const pick = () => {
    if (!probe || !canvas) return;
    const d = canvas.getContext('2d')!.getImageData(probe[0], probe[1], 1, 1).data;
    /* Перевес красного в одну-две единицы — это нейтральный серый, а не красноватый. */
    const red = d[0] > d[1] + 2 && d[0] > d[2] + 2;
    const rgb = `rgb(${d[0]} ${d[1]} ${d[2]})`;
    k.say(red ? tr('под курсором {rgb} — красноватый.', { rgb }) : tr('под курсором {rgb} — не красный: зелёного и синего в нём больше.', { rgb }));
  };
  k.slider('cast', (v) => { cast = v; s.draw(); pick(); });
  /* pointermove, а не mousemove: на телефоне пипетка работает от касания. */
  canvas?.addEventListener('pointermove', (ev) => {
    const r = canvas.getBoundingClientRect();
    const dpr = canvas.width / r.width;
    probe = [Math.round((ev.clientX - r.left) * dpr), Math.round((ev.clientY - r.top) * dpr)];
    pick();
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
    k.say(tr('{s} с до узнавания. Второй раз этот секундомер на этой картинке уже не запустить: найденная организация применяется дальше автоматически.', { s: num((performance.now() - t0) / 1000) }));
  });
  k.loop(() => { if (!found) k.clock(tr('{s} с', { s: num((performance.now() - t0) / 1000) })); });
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
        px.setTransform(1, 0, 0, 1, 0, 0);
        px.globalCompositeOperation = 'destination-in';
        /* Маска эллиптическая: круглая по ширине полосы оставляла верхний и нижний
           края жёсткими, и шов читался ровной горизонтальной линией. */
        px.translate(sw / 2, sh / 2);
        px.scale(1, sh / sw);
        const g = px.createRadialGradient(0, 0, 0, 0, 0, sw / 2);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(0.6, 'rgba(0,0,0,1)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        px.fillStyle = g;
        px.fillRect(-sw / 2, -sw / 2, sw, sw);
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
  const say = () =>
    k.say(!flip ? tr('глаза и рот на своих местах: лицо обычное под любым углом.')
      : rot > 150 ? tr('вверх ногами — почти нормальное лицо.') : rot < 40 ? tr('прямо — и это гримаса. Пиксели те же самые.') : rot > 60 && rot < 130 ? tr('где-то здесь у большинства и появляется гримаса.') : '');
  k.slider('rot', (v) => { rot = v; s.draw(); say(); });
  /* Переключатель начинает во включённом состоянии: глаза и рот уже перевёрнуты,
     и на кнопке написано, как вернуть. */
  k.toggle('flip', (v) => { flip = v; s.draw(); say(); }, true);
  load(assets(k)['face-curie']).then((i) => { img = i; s.draw(); });
});

/* Зрачки и середина рта на каждом из пяти портретов — в долях кадра. Сняты по самим
   файлам: тёмный минимум в окне вокруг глаза после лёгкого размытия, потом проверка
   крестиком на увеличенном кадре. Рот — только там, где он виден: у Чехова, Менделеева
   и Теслы его закрывают усы, борода и рука, и сдвигать там нечего. */
type Feat = { eyes: readonly [readonly [number, number], readonly [number, number]]; mouth?: readonly [number, number] };
const FACES: Record<string, Feat> = {
  'face-chekhov': { eyes: [[0.354, 0.506], [0.585, 0.467]] },
  'face-mendeleev': { eyes: [[0.395, 0.396], [0.7, 0.408]] },
  'face-kovalevskaya': { eyes: [[0.545, 0.525], [0.864, 0.527]], mouth: [0.69, 0.85] },
  'face-curie': { eyes: [[0.29, 0.527], [0.665, 0.526]], mouth: [0.44, 0.82] },
  'face-tesla': { eyes: [[0.467, 0.466], [0.783, 0.562]] },
};
const FACE_IDS = Object.keys(FACES);

/* Перемены — только в расположении, сами черты не трогаются: глаза разведены или сведены,
   подняты или опущены, рот поднят или опущен. Величины — в межзрачковых расстояниях
   этого же лица, поэтому на всех пяти портретах перемена одного масштаба. */
type Change = 'none' | 'apart' | 'closer' | 'up' | 'down' | 'mouth-up' | 'mouth-down';
const EYE_CHANGES: Change[] = ['apart', 'closer', 'up', 'down'];
const SHIFT_SIDE = 0.09, SHIFT_UP = 0.12, SHIFT_MOUTH = 0.11;
/** Ширина холста, на котором собирается вариант лица. */
const FW = 480;

/** Портрет с одной перемещённой чертой. Не заплата, а плавный сдвиг: внутри эллипса
    черта переносится целиком, за ним сдвиг сходит на нет к двойному радиусу. Шва нет,
    кожа вокруг чуть растягивается — так перемену нельзя найти по склейке. */
const variant = (img: HTMLImageElement, f: Feat, ch: Change): HTMLCanvasElement => {
  const W = FW, H = Math.round((FW * img.height) / img.width);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true })!;
  x.drawImage(img, 0, 0, W, H);
  if (ch === 'none') return c;
  const [[ax, ay], [bx, by]] = f.eyes.map(([u, v]) => [u * W, v * H]);
  const iod = Math.hypot(bx - ax, by - ay);
  /* Оси лица, а не кадра: Тесла и Чехов сняты с наклоном головы, и «вверх» для них —
     перпендикуляр к линии глаз, а не вертикаль экрана. */
  const ux = (bx - ax) / iod, uy = (by - ay) / iod;
  const nx = uy, ny = -ux;
  const eye = 0.3 * iod;
  type Spot = { x: number; y: number; dx: number; dy: number; rx: number; ry: number };
  let spots: Spot[] = [];
  if (ch === 'apart' || ch === 'closer') {
    const s = (ch === 'apart' ? 1 : -1) * SHIFT_SIDE * iod;
    spots = [
      { x: ax, y: ay, dx: -ux * s, dy: -uy * s, rx: eye, ry: eye },
      { x: bx, y: by, dx: ux * s, dy: uy * s, rx: eye, ry: eye },
    ];
  } else if (ch === 'up' || ch === 'down') {
    const s = (ch === 'up' ? 1 : -1) * SHIFT_UP * iod;
    spots = [
      { x: ax, y: ay, dx: nx * s, dy: ny * s, rx: eye, ry: eye },
      { x: bx, y: by, dx: nx * s, dy: ny * s, rx: eye, ry: eye },
    ];
  } else if (f.mouth) {
    const s = (ch === 'mouth-up' ? 1 : -1) * SHIFT_MOUTH * iod;
    spots = [{ x: f.mouth[0] * W, y: f.mouth[1] * H, dx: nx * s, dy: ny * s, rx: 0.36 * iod, ry: 0.24 * iod }];
  }
  const src = x.getImageData(0, 0, W, H).data;
  const out = x.createImageData(W, H);
  const o = out.data;
  for (let py = 0; py < H; py++)
    for (let px = 0; px < W; px++) {
      /* Обратное отображение: для каждой точки результата ищем, откуда в исходнике её взять. */
      let dx = 0, dy = 0;
      for (const p of spots) {
        const qx = px - p.x - p.dx, qy = py - p.y - p.dy;
        const u = (qx * ux + qy * uy) / p.rx, v = (-qx * uy + qy * ux) / p.ry;
        const r = Math.sqrt(u * u + v * v);
        if (r >= 2) continue;
        const t = Math.max(0, r - 1);
        const wgt = 1 - t * t * (3 - 2 * t);
        dx += p.dx * wgt;
        dy += p.dy * wgt;
      }
      const i = (py * W + px) * 4;
      if (!dx && !dy) {
        o[i] = src[i]; o[i + 1] = src[i + 1]; o[i + 2] = src[i + 2]; o[i + 3] = 255;
        continue;
      }
      /* Билинейно: сдвиги дробные, и ближайший пиксель дал бы на месте черты рябь. */
      const sx = Math.min(W - 1.001, Math.max(0, px - dx)), sy = Math.min(H - 1.001, Math.max(0, py - dy));
      const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
      const a = (y0 * W + x0) * 4, b = a + 4, cl = a + W * 4, d = cl + 4;
      for (let n = 0; n < 3; n++)
        o[i + n] = (src[a + n] * (1 - fx) + src[b + n] * fx) * (1 - fy) + (src[cl + n] * (1 - fx) + src[d + n] * fx) * fy;
      o[i + 3] = 255;
    }
  x.putImageData(out, 0, 0);
  return c;
};

/** Сколько пара видна, мс. Без предела перевёрнутое лицо можно сличать по точкам
    сколь угодно долго, и задача превращается в «найди отличие». */
const SHOW_MS = 2500;
/** Пар на ориентацию; «одинаковых» и «разных» поровну. */
const PER_SIDE = 12;

export const faceInversion: Mount = demo((k) => {
  const imgs: Record<string, HTMLImageElement> = {};
  const cache = new Map<string, HTMLCanvasElement>();
  const look = (id: string, ch: Change) => {
    const key = `${id}:${ch}`;
    let c = cache.get(key);
    if (!c) cache.set(key, (c = variant(imgs[id], FACES[id], ch)));
    return c;
  };
  /* Два снимка пары кладутся с разным масштабом и сдвигом: иначе перемену можно найти,
     сравнивая положение глаз относительно рамки, а это работает и вверх ногами. */
  type Pose = { s: number; jx: number; jy: number };
  type Trial = { id: string; inverted: boolean; same: boolean; left: Change; right: Change; pose: [Pose, Pose] };
  let trial: Trial | null = null;
  let shown = false, t0 = 0, timer = 0;
  /* Пока серия не идёт, на холсте один и тот же портрет прямо и вверх ногами — что
     будет на экране, без перемен и без разброса. */
  const still: Pose = { s: 1, jx: 0, jy: 0 };
  const PREVIEW: Trial = { id: 'face-curie', inverted: false, same: true, left: 'none', right: 'none', pose: [still, still] };
  let idle = true;
  const results: Record<'up' | 'inv', [number, number, number]> = { up: [0, 0, 0], inv: [0, 0, 0] };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const t = trial ?? (idle && imgs[PREVIEW.id] ? PREVIEW : null);
    if (!t) return;
    const bh = h * 0.94, bw = Math.min(w * 0.46, bh * 0.78);
    const gap = Math.min(w * 0.05, 36);
    t.pose.forEach((pose, slot) => {
      const x0 = slot ? w / 2 + gap / 2 : w / 2 - gap / 2 - bw;
      const y0 = (h - bh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x0 + bw / 2, y0 + bh / 2, bw / 2, bh / 2, 0, 0, Math.PI * 2);
      if (!shown && t !== PREVIEW) {
        /* Пара убрана, место осталось: видно, что ответ ещё ждут. */
        ctx.strokeStyle = grey(0.8);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        return;
      }
      ctx.clip();
      const id = t.id;
      const face = look(id, slot ? t.right : t.left);
      /* Масштаб — по межзрачковому расстоянию, середина между глазами чуть выше центра
         овала. Берутся исходные глаза, а не сдвинутые: иначе подгонка съела бы перемену. */
      const [[ax, ay], [bx, by]] = FACES[id].eyes.map(([u, v]) => [u * face.width, v * face.height]);
      /* Не мельче, чем нужно, чтобы кадр закрыл овал целиком: иначе у Теслы и Кюри
         в овал попадает край снимка. Разброс масштаба множится уже после. */
      const sc = Math.max((bw * 0.33) / Math.hypot(bx - ax, by - ay), bw / face.width, bh / face.height) * pose.s;
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      /* Если кадр больше овала, он не должен открывать в овале свой край: у Ковалевской
         и Теслы лицо прижато к краю снимка, и прямой срез читался бы как рамка. */
      const cover = (t: number, m: number, size: number, slot: number) => {
        const lo = slot / 2 - (size - m) * sc, hi = m * sc - slot / 2;
        return lo <= hi ? Math.min(hi, Math.max(lo, t)) : t;
      };
      const tx = cover(pose.jx * bw, mx, face.width, bw);
      const ty = cover(-bh * 0.08 + pose.jy * bh, my, face.height, bh);
      ctx.translate(x0 + bw / 2, y0 + bh / 2);
      if (t === PREVIEW ? slot === 1 : t.inverted) ctx.rotate(Math.PI);
      ctx.translate(tx, ty);
      ctx.scale(sc, sc);
      ctx.drawImage(face, -mx, -my);
      ctx.restore();
      /* Края исходного кадра растворяются в бумаге: рамка — тоже ориентир, и он не
         должен быть резким. */
      ctx.save();
      ctx.translate(x0 + bw / 2, y0 + bh / 2);
      ctx.scale(1, bh / bw);
      const g = ctx.createRadialGradient(0, 0, bw * 0.36, 0, 0, bw / 2);
      g.addColorStop(0, 'rgba(244,242,236,0)');
      g.addColorStop(1, PAPER);
      ctx.fillStyle = g;
      ctx.fillRect(-bw / 2, -bw / 2, bw, bw);
      ctx.restore();
    });
  });
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.font = '12px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const rows: ['up' | 'inv', string][] = [['up', tr('прямо')], ['inv', tr('вверх ногами')]];
    const lx = 12 + Math.max(...rows.map(([, l]) => ctx.measureText(l).width)) + 10;
    const span = Math.max(20, w - lx - 104);
    rows.forEach(([key, label], i) => {
      const [hit, n, ms] = results[key];
      const y = (h / 2) * (i + 0.5);
      const bh = Math.min(22, h / 4);
      ctx.fillStyle = '#6b6b70';
      ctx.fillText(label, 12, y);
      /* Полная дорожка — сто процентов, чтобы длина столбика читалась без шкалы. */
      ctx.fillStyle = grey(0.88);
      ctx.fillRect(lx, y - bh / 2, span, bh);
      ctx.fillStyle = key === 'up' ? INK : MARK;
      if (n) ctx.fillRect(lx, y - bh / 2, (span * hit) / n, bh);
      ctx.fillStyle = '#6b6b70';
      ctx.fillText(n ? tr('{c} из {n} · {s} с', { c: hit, n, s: num(ms / n / 1000) }) : '—', lx + span + 8, y);
    });
  });
  const stage = k.stage;
  const startBtn = k.el('[data-btn="start"]') as HTMLButtonElement | null;
  const shuffle = <T,>(a: T[], r: () => number) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  /* Набор пар один на обе ориентации: те же лица с теми же переменами показываются и
     прямо, и вверх ногами. Тогда разница в точности — от поворота, а не от того, что
     одной ориентации достались перемены потруднее. */
  const plan = (): Trial[] => {
    const r = rnd(Date.now() % 99991);
    const half = PER_SIDE / 2;
    const items: { id: string; same: boolean; left: Change; right: Change }[] = [];
    const ids = shuffle(FACE_IDS.slice(), r);
    const mouths = FACE_IDS.filter((id) => FACES[id].mouth);
    /* «Разные»: четыре перемены глаз на четырёх разных лицах и обе перемены рта. */
    const diffs: [string, Change][] = EYE_CHANGES.map((c, i): [string, Change] => [ids[i], c]);
    diffs.push([mouths[Math.floor(r() * mouths.length)], 'mouth-up'], [mouths[Math.floor(r() * mouths.length)], 'mouth-down']);
    for (const [id, c] of diffs) {
      const changedLeft = r() < 0.5;
      items.push({ id, same: false, left: changedLeft ? c : 'none', right: changedLeft ? 'none' : c });
    }
    /* «Одинаковые»: в половине из них оба снимка уже изменены, и одинаково. Иначе
       подсказкой стала бы сама изменённость, а не различие внутри пары. */
    for (let i = 0; i < half; i++) {
      const id = ids[(i + 4) % ids.length];
      const c: Change = i % 2 ? (FACES[id].mouth && r() < 0.3 ? 'mouth-down' : EYE_CHANGES[Math.floor(r() * 4)]) : 'none';
      items.push({ id, same: true, left: c, right: c });
    }
    const pose = (): Pose => ({ s: 1 + r() * 0.14, jx: (r() - 0.5) * 0.1, jy: (r() - 0.5) * 0.08 });
    const all: Trial[] = [];
    for (const inverted of [false, true]) for (const it of items) all.push({ ...it, inverted, pose: [pose(), pose()] });
    return shuffle(all, r);
  };
  const pct = (a: number) => Math.round((a / PER_SIDE) * 100);
  const finish = () => {
    trial = null;
    idle = true;
    s.draw();
    stage.innerHTML = '';
    const [a, na, ma] = results.up, [b, nb, mb] = results.inv;
    const d = pct(a) - pct(b);
    /* Порог в две пары: разница в одну пару из двенадцати — ещё шум. */
    const verdict = a - b >= 2 ? tr('Переворот стоил {d} п. п.: та же перемена в перевёрнутом лице заметна хуже.', { d })
      : b - a >= 2 ? tr('Вверх ногами в этот раз вышло даже лучше, на {d} п. п. На двенадцати парах случай может и такое: повторите серию.', { d: -d })
      : a >= PER_SIDE - 1 && b >= PER_SIDE - 1 ? tr('Ошибок почти нет ни там, ни там: для вас эти перемены слишком заметны, и точность упёрлась в потолок. Тогда цена переворота может проявиться разве что во времени ответа.')
      : tr('Разницы в этот раз почти нет. На двенадцати парах в каждой ориентации так бывает: повторите серию.');
    k.say(`${tr('прямо — {a} из {n} верно, вверх ногами — {b} из {n}.', { a, b, n: PER_SIDE })} ${verdict} ${tr('В среднем на ответ уходило {u} с прямо и {i} с вверх ногами.', { u: num(ma / na / 1000), i: num(mb / nb / 1000) })}`);
    if (startBtn) startBtn.disabled = false;
  };
  let queue: Trial[] = [];
  const total = PER_SIDE * 2;
  const show = () => {
    const t = queue.shift();
    if (!t) return finish();
    trial = t;
    shown = true;
    s.draw();
    t0 = performance.now();
    clearTimeout(timer);
    timer = window.setTimeout(() => { shown = false; s.draw(); }, SHOW_MS);
    const q = stage.querySelector('[data-n]');
    if (q) q.textContent = `${total - queue.length} / ${total}`;
  };
  const answer = (said: boolean) => {
    if (!trial) return;
    const cur = results[trial.inverted ? 'inv' : 'up'];
    cur[0] += said === trial.same ? 1 : 0;
    cur[1] += 1;
    cur[2] += performance.now() - t0;
    chart.draw();
    clearTimeout(timer);
    /* Короткая пустая пауза между парами: без неё новая пара сливается со старой. */
    shown = false;
    trial = null;
    s.draw();
    window.setTimeout(show, 350);
  };
  k.say(tr('двадцать четыре пары: оба снимка — один и тот же портрет, но в половине пар у одного из них чуть сдвинуты глаза или рот. Каждая пара на экране две с половиной секунды, половина пар перевёрнута.'));
  k.button('start', (el) => {
    if (!FACE_IDS.every((id) => imgs[id])) return;
    el.disabled = true;
    idle = false;
    results.up = [0, 0, 0];
    results.inv = [0, 0, 0];
    chart.draw();
    k.say('');
    queue = plan();
    stage.innerHTML = `<p class="ill-q">${tr('одно и то же или разное?')} <span data-n></span></p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, said] of [[tr('одно и то же'), true], [tr('разное'), false]] as const) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ill-btn';
      btn.textContent = label;
      btn.onclick = () => answer(said);
      row.append(btn);
    }
    stage.append(row);
    show();
  });
  Promise.all(FACE_IDS.map((id) => load(assets(k)[id]).then((i) => { imgs[id] = i; }))).then(() => s.draw());
});
