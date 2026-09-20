/* Мюллер-Лайер. Оба отрезка рисуются из одного числа — равенство здесь по построению,
   а не по обещанию. Единственное, что меняется между ними, — направление наконечников. */
import { surface, slider, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const rulerBtn = root.querySelector<HTMLButtonElement>('[data-btn="ruler"]')!;

  let theta = 45;
  let ruler = false;

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      const ink = getComputedStyle(root).getPropertyValue('--ill-ink').trim() || '#1b1b1b';
      const bg = getComputedStyle(root).getPropertyValue('--ill-bg').trim() || '#f7f5f0';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const L = Math.min(w * 0.56, 420);
      const F = L * 0.24;
      const x0 = (w - L) / 2;
      const x1 = x0 + L;
      const rad = (theta * Math.PI) / 180;
      const dx = F * Math.cos(rad);
      const dy = F * Math.sin(rad);

      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      /* d = +1 — наконечники загнуты внутрь, как остриё стрелы: отрезок кажется короче.
         d = −1 — наружу, как оперение: кажется длиннее. */
      const shaft = (y: number, d: number) => {
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        for (const [x, side] of [[x0, 1], [x1, -1]] as const) {
          for (const up of [-1, 1]) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + side * d * dx, y + up * dy);
          }
        }
        ctx.stroke();
      };

      shaft(h * 0.34, 1);
      shaft(h * 0.72, -1);

      if (ruler) {
        ctx.save();
        ctx.strokeStyle = '#d2483f';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        for (const x of [x0, x1]) {
          ctx.beginPath();
          ctx.moveTo(x, h * 0.2);
          ctx.lineTo(x, h * 0.86);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    { ratio: 0.52 },
  );

  slider(root, 'angle', (v) => {
    theta = v;
    s.draw();
    say(
      root,
      v === 0
        ? 'угол 0° — наконечники легли на отрезок, и разницы больше нет. Вот это и есть проверка.'
        : `угол ${v}°. Оба отрезка по-прежнему одной длины.`,
    );
  });

  rulerBtn.addEventListener('click', () => {
    ruler = !ruler;
    rulerBtn.setAttribute('aria-pressed', String(ruler));
    rulerBtn.textContent = ruler ? 'убрать линейку' : 'приложить линейку';
    s.draw();
  });
}
