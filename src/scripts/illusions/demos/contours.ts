/* Контуры, заполнение и двойственность. Зрение кодирует границы и достраивает
   внутренность; здесь собрано то, что оно достраивает зря — и то, что не достраивает. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

export const kanizsaTriangle: Mount = demo((k) => {
  let spin = 0;
  let geom = { cx: 0, cy: 0, w: 0, h: 0 };
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.34;
    /* Радиус пакмена задаёт долю поддержки — какую часть стороны занимает настоящий
       контур. При 0.55 это около двух третей, и контур виден уверенно. */
    const r = R * 0.55;
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
      ? `внутри фигуры ${inside}, снаружи ${outside}. Одно и то же число: светлее там не стало.`
      : `внутри ${inside}, снаружи ${outside} — проба попала на край, сдвиньте ползунок и повторите.`);
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
    k.say(v ? 'диск налился цветом. Ничего, кроме окраски внутренних концов, не поменялось.' : 'диск ярче страницы, и у него есть край. В изображении нет ни того, ни другого.');
  });
});

export const illusoryContours: Mount = demo((k) => {
  let fig = 'kanizsa', support = 55;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.36;
    const sup = support / 100;
    ctx.fillStyle = '#16161a';
    if (fig === 'kanizsa') {
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const to = Math.atan2(cy - y, cx - x);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, R * sup, to + Math.PI / 6, to - Math.PI / 6);
        ctx.closePath();
        ctx.fill();
      }
    } else if (fig === 'ehrenstein') {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 4;
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + R * (1 - sup) * Math.cos(a), cy + R * (1 - sup) * Math.sin(a));
        ctx.lineTo(cx + R * 1.4 * Math.cos(a), cy + R * 1.4 * Math.sin(a));
        ctx.stroke();
      }
    } else if (fig === 'schumann') {
      /* Фигура Шумана, 1900: первая иллюзорная фигура с контуром, на полвека раньше
         Канижи. Две скобки, между ними — светлый прямоугольник, которого нет. */
      ctx.lineWidth = R * 0.24;
      ctx.strokeStyle = '#16161a';
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(cx + sgn * R * 0.9, cy, R, sgn > 0 ? -Math.PI / 2 : Math.PI / 2, sgn > 0 ? Math.PI / 2 : (Math.PI * 3) / 2);
        ctx.stroke();
      }
    } else {
      /* Стыкующиеся решётки: контур появляется на линии, где сдвигается фаза. */
      const period = 12;
      for (let y = 0; y < h; y += period) {
        ctx.fillStyle = '#16161a';
        ctx.fillRect(0, y, w / 2, period / 2);
        ctx.fillRect(w / 2, y + period / 2, w / 2, period / 2);
      }
    }
  });
  k.select('fig', (v) => { fig = v; s.draw(); });
  k.slider('support', (v) => { support = v; s.draw(); });
  k.say('четыре разных фигуры и один механизм: край виден там, где яркость не меняется.');
});

export const troxler: Mount = demo((k) => {
  let soft = 70, t0 = 0, timer = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#8f8f93';
    ctx.fillRect(0, 0, w, h);
    const bx = w * 0.72, by = h * 0.36;
    const R = Math.min(w, h) * 0.16;
    const inner = R * (1 - soft / 100);
    const g = ctx.createRadialGradient(bx, by, Math.max(inner, 0.001), bx, by, R);
    g.addColorStop(0, 'rgba(120, 175, 130, 0.95)');
    g.addColorStop(1, 'rgba(120, 175, 130, 0)');
    ctx.fillStyle = g;
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
    el.textContent = 'начать заново';
    const sec = (performance.now() - t0) / 1000;
    k.say(soft < 25
      ? `${sec.toFixed(1)} с — и это при резкой границе. Чаще при таком крае пятно держится, пока хватает терпения.`
      : `${sec.toFixed(1)} с до исчезновения. Теперь уведите мягкость в ноль и попробуйте снова.`);
  };
  k.button('go', (el) => {
    if (timer) { finish(el); return; }
    t0 = performance.now();
    el.textContent = 'пропало';
    k.say('смотрите строго на крест и не моргайте.');
    timer = window.setInterval(() => k.clock(`${((performance.now() - t0) / 1000).toFixed(1)} с`), 100);
  });
});

export const blindSpotFilling: Mount = demo((k) => {
  let sep = 220, test = 'gap';
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = test === 'texture' ? '#dcdce4' : PAPER;
    ctx.fillRect(0, 0, w, h);
    const cy = h / 2;
    const cx = w / 2 - sep / 2;
    if (test === 'texture') {
      ctx.fillStyle = '#b6b6c4';
      for (let y = 0; y < h; y += 16)
        for (let x = ((y / 16) % 2) * 16; x < w; x += 32) ctx.fillRect(x, y, 16, 16);
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 12); ctx.lineTo(cx + 12, cy + 12);
    ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx - 12, cy + 12);
    ctx.stroke();
    const tx = cx + sep;
    if (test === 'gap') {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.05, cy); ctx.lineTo(tx - 26, cy);
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
    k.say(v === 'gap' ? 'закройте левый глаз, смотрите правым на крест и подберите расстояние до экрана: разрыв зарастёт.'
      : v === 'texture' ? 'на клетчатом фоне зарастает и клетка — система дорисовывает текстурой.'
      : 'точка просто исчезнет, а на её месте будет фон. Не чёрное пятно, а именно фон.');
  });
});

export const extinctionIllusion: Mount = demo((k) => {
  let dots = 12, contrast = 45;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = grey(0.62);
    ctx.fillRect(0, 0, w, h);
    const n = Math.ceil(Math.sqrt(dots)) + 1;
    const pitch = Math.min(w, h) / (n + 1);
    ctx.strokeStyle = grey(0.62 + contrast / 300);
    ctx.lineWidth = 3;
    const x0 = (w - pitch * n) / 2, y0 = (h - pitch * n) / 2;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(x0, y0 + i * pitch); ctx.lineTo(x0 + n * pitch, y0 + i * pitch); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0 + i * pitch, y0); ctx.lineTo(x0 + i * pitch, y0 + n * pitch); ctx.stroke();
    }
    ctx.fillStyle = '#000';
    let placed = 0;
    for (let r = 1; r < n && placed < dots; r++)
      for (let c = 1; c < n && placed < dots; c++) {
        if ((r + c) % 2) continue;
        ctx.beginPath();
        ctx.arc(x0 + c * pitch, y0 + r * pitch, 5, 0, Math.PI * 2);
        ctx.fill();
        placed++;
      }
  });
  k.slider('dots', (v) => { dots = v; s.draw(); k.say(`нарисовано ${v}. Сколько вы удерживаете разом?`); });
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
  k.say('сквозь чёрную полосу плывёт бледный призрак решётки. Фантом живёт при низкой частоте и медленном ходе.');
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
      const g = ctx.createRadialGradient(x, y, rr * (1 - blur / 100), x, y, rr);
      g.addColorStop(0, 'rgba(206,110,214,0.95)');
      g.addColorStop(1, 'rgba(206,110,214,0)');
      ctx.fillStyle = g;
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
  k.say('шаг первый — бегущий просвет. Шаг второй — он позеленел. Шаг третий: не отводите взгляд от креста, и лиловые диски исчезнут совсем.');
});

export const scintillatingStarburst: Mount = demo((k) => {
  let rings = 5, vertices = 8, width = 2;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = Math.min(w, h) * 0.46;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = width;
    /* Звёздчатые многоугольники: лучей никто не рисует, они достраиваются
       иллюзорным контуром через вершины. */
    for (let ri = 1; ri <= rings; ri++) {
      const r = (R * ri) / rings;
      for (const off of [0, Math.PI / vertices]) {
        ctx.beginPath();
        for (let i = 0; i <= vertices * 2; i++) {
          const a = (i / (vertices * 2)) * Math.PI * 2 + off;
          const rr = i % 2 ? r * 0.62 : r;
          const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
  });
  k.slider('rings', (v) => { rings = v; s.draw(); });
  k.slider('vertices', (v) => { vertices = v; s.draw(); });
  k.slider('width', (v) => { width = v; s.draw(); });
  k.say('смотрите чуть мимо центра — лучи станут ярче. На периферии эффект сильнее.');
});
