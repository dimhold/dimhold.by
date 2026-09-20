/* Клетка в тени. Сцена собрана здесь с нуля и нарочно не повторяет расстановку
   Адельсона: цилиндр стоит справа, тень уходит влево-вниз, доска шире. Числа при этом те
   же, потому что они не из картинки, а из арифметики: тёмная плитка 0.35, светлая 0.65,
   тень гасит свет ровно в 0.35 / 0.65 раза — и светлая плитка в тени становится ровно
   тёмной плиткой на свету.

   Клетки A и B не заданы руками. Они выбираются по той же геометрии, которой рисуется
   тень: B — светлая плитка, целиком лежащая в полной тени, A — ближайшая к ней тёмная
   плитка, до которой тень заведомо не дотягивается. Подвинешь цилиндр — подписи
   переедут сами, и соврать картинкой станет нельзя. */
import { surface, say } from '../canvas';

const DARK = 0.35;
const LIGHT = 0.65;
const COLS = 8;
const ROWS = 6;
/* Граница полной тени и граница света в единицах «нормы» ниже. Между ними — полутень. */
const UMBRA = 0.6;

type Cell = { c: number; r: number };

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const bridgeBtn = root.querySelector<HTMLButtonElement>('[data-btn="bridge"]')!;
  const probeBtn = root.querySelector<HTMLButtonElement>('[data-btn="probe"]')!;

  let bridge = false;
  let tile = 0;
  let A: Cell = { c: 0, r: 0 };
  let B: Cell = { c: 3, r: 3 };

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      tile = w / COLS;
      const grey = (v: number) => {
        const n = Math.round(v * 255);
        return `rgb(${n} ${n} ${n})`;
      };
      const light = (c: number, r: number) => (c + r) % 2 === 0;

      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          ctx.fillStyle = grey(light(c, r) ? LIGHT : DARK);
          ctx.fillRect(c * tile, r * tile, tile + 1, tile + 1);
        }

      /* Тень как вытянутое пятно от основания цилиндра в сторону нижнего левого угла.
         Своя система координат: вдоль оси и поперёк неё. */
      const ox = w * 0.9;
      const oy = h * 0.6;
      const tx = w * 0.02;
      const ty = h * 1.06;
      const len = Math.hypot(tx - ox, ty - oy);
      const ux = (tx - ox) / len;
      const uy = (ty - oy) / len;
      const halfLen = len * 0.62;
      const halfWid = w * 0.3;
      const cxS = ox + ux * len * 0.5;
      const cyS = oy + uy * len * 0.5;

      /* 0 в середине тени, 1 на её краю. Больше 1 — свет. */
      const norm = (x: number, y: number) => {
        const dx = x - cxS;
        const dy = y - cyS;
        const along = (dx * ux + dy * uy) / halfLen;
        const perp = (dx * -uy + dy * ux) / halfWid;
        return Math.hypot(along, perp);
      };

      const alpha = 1 - DARK / LIGHT;
      ctx.save();
      ctx.translate(cxS, cyS);
      ctx.rotate(Math.atan2(uy, ux));
      ctx.scale(1, halfWid / halfLen);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, halfLen);
      g.addColorStop(0, `rgba(0,0,0,${alpha})`);
      g.addColorStop(UMBRA, `rgba(0,0,0,${alpha})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, halfLen, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* Выбор клеток. Порог у B с запасом, чтобы в полную тень попала вся плитка, а не
         только её середина; у A — наоборот, с запасом на свет. */
      const margin = (tile * 0.75) / halfWid;
      let best = Infinity;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          if (!light(c, r)) continue;
          const n = norm((c + 0.5) * tile, (r + 0.5) * tile);
          if (n < UMBRA - margin && n < best) {
            best = n;
            B = { c, r };
          }
        }
      best = Infinity;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          if (light(c, r)) continue;
          if (norm((c + 0.5) * tile, (r + 0.5) * tile) < 1 + margin) continue;
          /* Из освещённых тёмных плиток берём ближайшую к B: короткий мост убедительнее. */
          const d = Math.hypot(c - B.c, r - B.r);
          if (d < best) {
            best = d;
            A = { c, r };
          }
        }

      /* Цилиндр — источник тени, а не украшение: без него тень читается как краска. */
      const cw = w * 0.055;
      const top = h * 0.08;
      ctx.fillStyle = '#5e7a62';
      ctx.fillRect(ox - cw, top, cw * 2, oy - top);
      ctx.beginPath();
      ctx.ellipse(ox, oy, cw, cw * 0.32, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#48604c';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(ox, top, cw, cw * 0.32, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#7d9b81';
      ctx.fill();

      if (bridge) {
        /* Мост той же краски, что и обе клетки. Пока он их соединяет, спорить не с чем. */
        const ax = (A.c + 0.5) * tile;
        const ay = (A.r + 0.5) * tile;
        const bx = (B.c + 0.5) * tile;
        const by = (B.r + 0.5) * tile;
        const nx = -(by - ay);
        const ny = bx - ax;
        const k = (tile * 0.17) / Math.hypot(nx, ny);
        ctx.fillStyle = grey(DARK);
        ctx.beginPath();
        ctx.moveTo(ax + nx * k, ay + ny * k);
        ctx.lineTo(bx + nx * k, by + ny * k);
        ctx.lineTo(bx - nx * k, by - ny * k);
        ctx.lineTo(ax - nx * k, ay - ny * k);
        ctx.closePath();
        ctx.fill();
      }

      /* Буквы с белой обводкой: одна лежит на светлом, другая на тёмном, и без обводки
         одна из двух всегда теряется. */
      ctx.font = `bold ${Math.round(tile * 0.42)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      for (const [p, t] of [[A, 'A'], [B, 'B']] as const) {
        const x = (p.c + 0.5) * tile;
        const y = (p.r + 0.5) * tile;
        ctx.strokeText(t, x, y);
        ctx.fillStyle = '#d2483f';
        ctx.fillText(t, x, y);
      }
    },
    { ratio: ROWS / COLS },
  );

  bridgeBtn.addEventListener('click', () => {
    bridge = !bridge;
    bridgeBtn.setAttribute('aria-pressed', String(bridge));
    bridgeBtn.textContent = bridge ? 'убрать мост' : 'соединить A и B';
    s.draw();
    say(
      root,
      bridge
        ? 'пока полоса их соединяет, спорить не с чем. Уберите её — и поверить снова станет невозможно.'
        : '',
    );
  });

  probeBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d')!;
    const dpr = canvas.width / (canvas.clientWidth || 1);
    /* Проба берётся над подписью, иначе измерим краску буквы. */
    const at = (p: Cell) =>
      ctx.getImageData(Math.round((p.c + 0.5) * tile * dpr), Math.round((p.r + 0.15) * tile * dpr), 1, 1)
        .data[0];
    const a = at(A);
    const b = at(B);
    say(
      root,
      a === b
        ? `A = ${a}, B = ${b}. Ровно одно число. Ваше зрение видит разницу там, где на экране её нет ни на единицу.`
        : `A = ${a}, B = ${b} — разница ${Math.abs(a - b)} из 255: край полутени задел клетку.`,
    );
  });
}
