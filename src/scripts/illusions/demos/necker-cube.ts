/* Куб Неккера с секундомером переключений.
   Интервалы между переворотами — настоящая психофизическая величина: у одного человека
   они распределены на удивление устойчиво, у разных людей — по-разному. Минуты хватает,
   чтобы увидеть собственное распределение. */
import { surface, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const chart = root.querySelector<HTMLCanvasElement>('[data-chart]')!;
  const tapBtn = root.querySelector<HTMLButtonElement>('[data-btn="tap"]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-btn="reset"]')!;

  const gaps: number[] = [];
  let last = 0;

  surface(
    canvas,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#f7f5f0';
      ctx.fillRect(0, 0, w, h);

      const k = Math.min(w, h) * 0.34;
      const cx = w / 2;
      const cy = h / 2;
      /* Косоугольная проекция: задняя грань смещена на треть ребра по диагонали.
         Никакого затенения и никаких разрывов линий — иначе у картинки появится
         правильный ответ и двойственность пропадёт. */
      const d = k * 0.5;
      const front = [
        [cx - k / 2, cy - k / 2],
        [cx + k / 2, cy - k / 2],
        [cx + k / 2, cy + k / 2],
        [cx - k / 2, cy + k / 2],
      ];
      const back = front.map(([x, y]) => [x + d * 0.7, y - d * 0.7]);

      ctx.strokeStyle = '#1b1b1b';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';

      const face = (p: number[][]) => {
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
    },
    { ratio: 0.6 },
  );

  const hist = surface(
    chart,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#f7f5f0';
      ctx.fillRect(0, 0, w, h);
      if (gaps.length < 2) return;

      /* Восемь корзин от нуля до самого длинного интервала — при десятке измерений
         больше корзин показывают только шум. */
      const max = Math.max(...gaps);
      const bins = new Array(8).fill(0);
      for (const g of gaps) bins[Math.min(7, Math.floor((g / max) * 8))]++;
      const peak = Math.max(...bins);
      const bw = w / bins.length;

      ctx.fillStyle = '#d2483f';
      bins.forEach((n, i) => {
        const bh = (n / peak) * (h - 18);
        ctx.fillRect(i * bw + 2, h - bh, bw - 4, bh);
      });

      ctx.fillStyle = '#6b6b70';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('0 с', 2, 11);
      const lbl = `${max.toFixed(1)} с`;
      ctx.fillText(lbl, w - ctx.measureText(lbl).width - 2, 11);
    },
    { ratio: 0.22 },
  );

  const tap = () => {
    const now = performance.now();
    if (last) gaps.push((now - last) / 1000);
    last = now;
    hist.draw();

    if (gaps.length === 0) {
      say(root, 'засекли. Жмите на каждом следующем перевороте.');
    } else {
      const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      say(
        root,
        `${gaps.length} ${gaps.length === 1 ? 'интервал' : gaps.length < 5 ? 'интервала' : 'интервалов'}, в среднем ${mean.toFixed(1)} с. У большинства людей выходит от полутора до пяти.`,
      );
    }
  };

  tapBtn.addEventListener('click', tap);
  resetBtn.addEventListener('click', () => {
    gaps.length = 0;
    last = 0;
    hist.draw();
    say(root, 'счёт сброшен.');
  });

  root.addEventListener('keydown', (ev) => {
    /* Пробел на кнопке — это нажатие кнопки; второй раз его считать не надо. */
    if (ev.target instanceof HTMLButtonElement) return;
    if (ev.key === ' ') {
      ev.preventDefault();
      tap();
    }
  });
}
