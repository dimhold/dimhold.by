/* Контуры, заполнение и двойственность. Зрение кодирует границы и достраивает
   внутренность; здесь собрано то, что оно достраивает зря — и то, что не достраивает. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { num, tr } from '../i18n';

export const kanizsaTriangle: Mount = demo((k) => {
  let spin = 0;
  let geom = { cx: 0, cy: 0, w: 0, h: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    /* Радиус пакмена задаёт долю поддержки — какую часть стороны занимает настоящий
       контур. При 0.55 R это около двух третей, и контур виден уверенно. */
    const k1 = 0.55;
    /* Фигура целиком в кадре: по вертикали она занимает от −(1 + k1) R до (0.5 + k1) R
       вокруг центра треугольника, по горизонтали ±(cos 30° + k1) R. */
    const R = Math.min(w / (2 * (Math.cos(Math.PI / 6) + k1)), h / (1.5 + 2 * k1)) * 0.92;
    const r = R * k1;
    const cx = w / 2, cy = h / 2 + R / 4;
    geom = { cx, cy, w, h };
    ctx.fillStyle = '#16161a';
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const toCentre = Math.atan2(cy - y, cx - x) + (spin * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(x, y);
      /* Вырез ровно 60°: это внутренний угол равностороннего треугольника, и только
         при нём прямые края выреза ложатся на его стороны. */
      ctx.arc(x, y, r, toCentre + Math.PI / 6, toCentre - Math.PI / 6);
      ctx.closePath();
      ctx.fill();
    }
  });
  k.slider('spin', (v) => { spin = v; s.draw(); });
  k.button('probe', () => {
    const inside = k.probe(geom.cx, geom.cy);
    const outside = k.probe(geom.w * 0.06, geom.h * 0.1);
    k.say(inside === outside
      ? tr('внутри фигуры {a}, снаружи {b}. Одно и то же число: светлее там не стало.', { a: inside, b: outside })
      : tr('внутри {a}, снаружи {b} — проба попала на край, сдвиньте ползунок и повторите.', { a: inside, b: outside }));
  });
});

export const ehrensteinIllusion: Mount = demo((k) => {
  let gap = 26, lines = 24, neon = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    ctx.lineWidth = 4;
    ctx.lineCap = 'butt';
    for (let i = 0; i < lines; i++) {
      const a = (i / lines) * Math.PI * 2;
      ctx.strokeStyle = '#111';
      ctx.beginPath();
      ctx.moveTo(cx + gap * Math.cos(a), cy + gap * Math.sin(a));
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.stroke();
      if (neon) {
        /* Те же линии, у которых внутренние концы перекрашены: фигура переезжает
           в неоновое растекание цвета, ничего больше не меняя. */
        ctx.strokeStyle = '#3b7fe0';
        ctx.beginPath();
        ctx.moveTo(cx + gap * Math.cos(a), cy + gap * Math.sin(a));
        ctx.lineTo(cx + (gap + R * 0.28) * Math.cos(a), cy + (gap + R * 0.28) * Math.sin(a));
        ctx.stroke();
      }
    }
  });
  k.slider('gap', (v) => { gap = v; s.draw(); });
  k.slider('lines', (v) => { lines = v; s.draw(); });
  k.toggle('neon', (v) => {
    neon = v;
    s.draw();
    k.say(v ? tr('диск налился цветом. Ничего, кроме окраски внутренних концов, не поменялось.') : tr('диск ярче страницы, и у него есть край. В изображении нет ни того, ни другого.'));
  });
});

export const illusoryContours: Mount = demo((k) => {
  let fig = 'kanizsa', support = 55;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const sup = support / 100;
    ctx.fillStyle = '#16161a';
    if (fig === 'kanizsa') {
      /* Доля поддержки буквально: какая часть стороны треугольника прочерчена краями
         вырезов. Сторона √3 R, на неё приходятся два радиуса пакменов. */
      const R = Math.min(w / (2 * (0.866 + 0.866 * sup)), h / (1.5 + 1.732 * sup)) * 0.92;
      const rr = R * 0.866 * sup;
      const cyT = cy + R / 4;
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        const x = cx + R * Math.cos(a), y = cyT + R * Math.sin(a);
        const to = Math.atan2(cyT - y, cx - x);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, rr, to + Math.PI / 6, to - Math.PI / 6);
        ctx.closePath();
        ctx.fill();
      }
    } else if (fig === 'ehrenstein') {
      /* Поддержка — какая часть радиуса занята линиями; остальное — пустой центр. */
      const R = Math.min(w, h) * 0.46;
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + R * (1 - sup) * Math.cos(a), cy + R * (1 - sup) * Math.sin(a));
        ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
        ctx.stroke();
      }
    } else if (fig === 'schumann') {
      /* Фигура Шумана, 1900: первая иллюзорная фигура с контуром, на полвека раньше
         Канижи. Две скобки, между ними — светлый прямоугольник, которого нет. Поддержка —
         толщина скобок: их срезы и есть единственные настоящие куски края. */
      const R = Math.min(w * 0.22, h * 0.36);
      ctx.lineWidth = R * 0.5 * sup;
      ctx.strokeStyle = '#16161a';
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(cx + sgn * R * 0.9, cy, R, sgn > 0 ? -Math.PI / 2 : Math.PI / 2, sgn > 0 ? Math.PI / 2 : (Math.PI * 3) / 2);
        ctx.stroke();
      }
    } else if (fig === 'varin') {
      /* Фигура Варина, 1971: четыре мишени из концентрических колец по углам квадрата.
         Четверть каждой мишени, обращённая внутрь, нарисована цветом — и квадрат между
         ними наливается цветом сам. Поддержка — радиус мишени в долях полустороны. */
      const half = Math.min(w, h) * 0.24;
      const rad = half * Math.max(0.2, sup);
      ctx.lineWidth = 2.5;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const x = cx + sx * half, y = cy + sy * half;
        const inward = Math.atan2(-sy, -sx);
        for (let ring = 1; ring <= 5; ring++) {
          const r = (rad * ring) / 5;
          ctx.strokeStyle = '#16161a';
          ctx.beginPath();
          ctx.arc(x, y, r, inward + Math.PI / 4, inward - Math.PI / 4 + Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = MARK;
          ctx.beginPath();
          ctx.arc(x, y, r, inward - Math.PI / 4, inward + Math.PI / 4);
          ctx.stroke();
        }
      }
    } else {
      /* Стыкующиеся решётки: контур появляется на линии, где сдвигается фаза. Поддержка —
         частота линий: чем чаще их концы, тем твёрже край. Стык на целом пикселе, иначе
         сглаживание нарисует на нём настоящую светлую линию. */
      const period = 2 * Math.round(3 + 12 * (1 - sup));
      const mid = Math.round(w / 2);
      for (let y = -period; y < h; y += period) {
        ctx.fillRect(0, y, mid, period / 2);
        ctx.fillRect(mid, y + period / 2, w - mid, period / 2);
      }
    }
  });
  k.select('fig', (v) => { fig = v; s.draw(); });
  k.slider('support', (v) => { support = v; s.draw(); });
  k.say(tr('пять разных фигур и один механизм: край виден там, где яркость не меняется.'));
});

export const troxler: Mount = demo((k) => {
  let soft = 70, t0 = 0, timer = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#8f8f93';
    ctx.fillRect(0, 0, w, h);
    const bx = w * 0.72, by = h * 0.36;
    const R = Math.min(w, h) * 0.16;
    const inner = R * (1 - soft / 100);
    /* При нулевой мягкости градиент вырождается (два одинаковых круга) и не рисует ничего:
       резкое пятно заливаем ровным цветом. */
    if (R - inner < 0.5) ctx.fillStyle = 'rgba(120, 175, 130, 0.95)';
    else {
      const g = ctx.createRadialGradient(bx, by, Math.max(inner, 0.001), bx, by, R);
      g.addColorStop(0, 'rgba(120, 175, 130, 0.95)');
      g.addColorStop(1, 'rgba(120, 175, 130, 0)');
      ctx.fillStyle = g;
    }
    ctx.beginPath();
    ctx.arc(bx, by, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3 - 8, h * 0.62); ctx.lineTo(w * 0.3 + 8, h * 0.62);
    ctx.moveTo(w * 0.3, h * 0.62 - 8); ctx.lineTo(w * 0.3, h * 0.62 + 8);
    ctx.stroke();
  });
  k.slider('soft', (v) => { soft = v; s.draw(); });
  const finish = (el: HTMLButtonElement) => {
    clearInterval(timer);
    timer = 0;
    el.textContent = tr('начать заново');
    const sec = (performance.now() - t0) / 1000;
    k.say(soft < 25
      ? tr('{n} с — и это при резкой границе. Чаще при таком крае пятно держится, пока хватает терпения.', { n: num(sec, 1) })
      : tr('{n} с до исчезновения. Теперь уведите мягкость в ноль и попробуйте снова.', { n: num(sec, 1) }));
  };
  k.button('go', (el) => {
    if (timer) { finish(el); return; }
    t0 = performance.now();
    el.textContent = tr('пропало');
    k.say(tr('смотрите строго на крест и не моргайте.'));
    timer = window.setInterval(() => k.clock(tr('{n} с', { n: num((performance.now() - t0) / 1000, 1) })), 100);
  });
});

export const blindSpotFilling: Mount = demo((k) => {
  let sep = 220, test = 'dot';
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = test === 'texture' ? '#dcdce4' : PAPER;
    ctx.fillRect(0, 0, w, h);
    const cy = h / 2;
    /* На узком экране метки не уходят за край: расстояние ограничено шириной холста. */
    const d = Math.min(sep, w - 120);
    const cx = w / 2 - d / 2;
    const tx = cx + d;
    if (test === 'texture') {
      ctx.fillStyle = '#b6b6c4';
      for (let y = 0; y < h; y += 16)
        for (let x = ((y / 16) % 2) * 16; x < w; x += 32) ctx.fillRect(x, y, 16, 16);
      /* Дыра в клетке: ровный круг цвета фона. В слепом пятне её место займёт клетка. */
      ctx.fillStyle = '#dcdce4';
      ctx.beginPath();
      ctx.arc(tx, cy, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 12); ctx.lineTo(cx + 12, cy + 12);
    ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx - 12, cy + 12);
    ctx.stroke();
    if (test === 'gap') {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(Math.min(w * 0.05, cx - 20), cy); ctx.lineTo(tx - 26, cy);
      ctx.moveTo(tx + 26, cy); ctx.lineTo(w * 0.98, cy);
      ctx.stroke();
    } else if (test === 'dot') {
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(tx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  k.slider('sep', (v) => { sep = v; s.draw(); });
  k.select('test', (v) => {
    test = v;
    s.draw();
    k.say(v === 'gap' ? tr('закройте левый глаз, смотрите правым на крест и подберите расстояние до экрана: разрыв зарастёт.')
      : v === 'texture' ? tr('закройте левый глаз и смотрите на крест: когда дыра попадёт в слепое пятно, клетка зарастёт поверх неё — система дорисовывает текстурой.')
      : tr('закройте левый глаз, смотрите правым на крест и медленно меняйте расстояние до экрана. Точка исчезнет, а на её месте будет фон. Не чёрное пятно, а именно фон.'));
  });
});

export const extinctionIllusion: Mount = demo((k) => {
  let dots = 12, contrast = 45;
  const s = k.surface(({ ctx, w, h }) => {
    /* Схема Нинио и Стивенса: частая серая решётка с косыми крестиками в узлах, чёрные
       точки сидят на узлах. Точки маленькие, решётка частая — иначе периферии нечего
       достраивать поверх них. */
    const bg = 0.82;
    ctx.fillStyle = grey(bg);
    ctx.fillRect(0, 0, w, h);
    const p = Math.max(18, Math.min(w, h) / 13);
    const cols = Math.floor(w / p), rows = Math.floor(h / p);
    const x0 = (w - cols * p) / 2, y0 = (h - rows * p) / 2;
    ctx.strokeStyle = grey(bg - contrast / 130);
    ctx.lineWidth = Math.max(1.5, p * 0.09);
    ctx.beginPath();
    for (let i = 0; i <= cols; i++) { ctx.moveTo(x0 + i * p, y0); ctx.lineTo(x0 + i * p, y0 + rows * p); }
    for (let j = 0; j <= rows; j++) { ctx.moveTo(x0, y0 + j * p); ctx.lineTo(x0 + cols * p, y0 + j * p); }
    ctx.stroke();
    ctx.lineWidth = Math.max(1, p * 0.06);
    ctx.beginPath();
    const dd = p * 0.32;
    for (let i = 0; i <= cols; i++)
      for (let j = 0; j <= rows; j++) {
        const x = x0 + i * p, y = y0 + j * p;
        ctx.moveTo(x - dd, y - dd); ctx.lineTo(x + dd, y + dd);
        ctx.moveTo(x + dd, y - dd); ctx.lineTo(x - dd, y + dd);
      }
    ctx.stroke();
    /* Узлы для точек — разреженная сетка через две клетки по вертикали и через четыре по
       горизонтали, со сдвигом через ряд. Берутся по удалённости от центра, чтобы точек было
       ровно столько, сколько сказано в строке вывода. На узком экране мест не хватает —
       тогда шаг по горизонтали вдвое меньше. */
    let spots: [number, number][] = [];
    for (const step of [4, 2]) {
      spots = [];
      for (let j = 1, row = 0; j < rows; j += 2, row++)
        for (let i = 1 + (row % 2) * (step / 2); i < cols; i += step) spots.push([x0 + i * p, y0 + j * p]);
      if (spots.length >= dots) break;
    }
    spots.sort((a, b) => Math.hypot(a[0] - w / 2, a[1] - h / 2) - Math.hypot(b[0] - w / 2, b[1] - h / 2));
    ctx.fillStyle = '#000';
    const shown = Math.min(dots, spots.length);
    for (let i = 0; i < shown; i++) {
      ctx.beginPath();
      ctx.arc(spots[i][0], spots[i][1], Math.max(2.5, p * 0.17), 0, Math.PI * 2);
      ctx.fill();
    }
    k.say(tr('нарисовано {n}. Сколько вы удерживаете разом?', { n: shown }));
  });
  k.slider('dots', (v) => { dots = v; s.draw(); });
  k.slider('contrast', (v) => { contrast = v; s.draw(); });
});

export const visualPhantoms: Mount = demo((k) => {
  let strip = 50, freq = 2, speed = 5, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    for (let x = 0; x < w; x++) {
      const v = 0.5 + 0.42 * Math.sin(((x + t * speed * 20) / w) * Math.PI * 2 * freq);
      ctx.fillStyle = grey(v);
      ctx.fillRect(x, 0, 1, h);
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, h / 2 - strip / 2, w, strip);
  });
  k.slider('strip', (v) => { strip = v; });
  k.slider('freq', (v) => { freq = v; });
  k.slider('speed', (v) => { speed = v; });
  k.loop((now) => { t = now; s.draw(); });
  k.say(tr('сквозь чёрную полосу плывёт бледный призрак решётки. Фантом живёт при низкой частоте и медленном ходе.'));
});

export const lilacChaser: Mount = demo((k) => {
  let speed = 10, blur = 60, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.62);
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.36;
    const n = 12;
    const hidden = Math.floor((t * speed) % n);
    for (let i = 0; i < n; i++) {
      if (i === hidden) continue;
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const rr = Math.min(w, h) * 0.07;
      /* Без размытия градиент вырождается и не рисует ничего — тогда диск сплошной. */
      if (blur < 1) ctx.fillStyle = 'rgba(206,110,214,0.95)';
      else {
        const g = ctx.createRadialGradient(x, y, rr * (1 - blur / 100), x, y, rr);
        g.addColorStop(0, 'rgba(206,110,214,0.95)');
        g.addColorStop(1, 'rgba(206,110,214,0)');
        ctx.fillStyle = g;
      }
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
    ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
    ctx.stroke();
  });
  k.slider('speed', (v) => { speed = v; });
  k.slider('blur', (v) => { blur = v; });
  k.loop((now) => { t = now; s.draw(); });
  k.say(tr('шаг первый — бегущий просвет. Шаг второй — он позеленел. Шаг третий: не отводите взгляд от креста, и лиловые диски исчезнут совсем.'));
});

export const scintillatingStarburst: Mount = demo((k) => {
  let rings = 24, vertices = 12, width = 1, contrast = 100;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.47;
    ctx.strokeStyle = grey(0.07 + 0.93 * (contrast / 100));
    ctx.lineWidth = width;
    ctx.lineJoin = 'miter';
    /* Вложенные звёздчатые многоугольники с общими направлениями вершин. Лучей никто
       не рисует: они достраиваются вдоль линий, на которых выстроились вершины всех колец. */
    for (let ri = 1; ri <= rings; ri++) {
      const r = (R * ri) / rings;
      const inner = r * 0.78;
      ctx.beginPath();
      for (let i = 0; i < vertices * 2; i++) {
        const a = (i / (vertices * 2)) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 ? inner : r;
        const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  });
  k.slider('rings', (v) => { rings = v; s.draw(); });
  k.slider('vertices', (v) => { vertices = v; s.draw(); });
  k.slider('width', (v) => { width = v; s.draw(); });
  k.slider('contrast', (v) => { contrast = v; s.draw(); });
  k.say(tr('смотрите чуть мимо центра — лучи станут ярче. На периферии эффект сильнее.'));
});
