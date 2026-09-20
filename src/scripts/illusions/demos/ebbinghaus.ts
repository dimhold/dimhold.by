/* Эббингауз как измерение, а не как картинка.
   Число на ползунке спрятано намеренно: как только видно, сколько пикселей выставлено,
   задача превращается в арифметику и измерять становится нечего. */
import { surface, slider, say } from '../canvas';

const REF = 30;

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const checkBtn = root.querySelector<HTMLButtonElement>('[data-btn="check"]')!;

  let mine = 44;
  let reveal = false;

  const ring = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    n: number,
    ringR: number,
    dist: number,
  ) => {
    ctx.fillStyle = '#b9bcc4';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx + dist * Math.cos(a), cy + dist * Math.sin(a), ringR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#d2483f';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#f7f5f0';
      ctx.fillRect(0, 0, w, h);

      const cy = h * 0.5;
      /* Слева — эталон среди крупных соседей, справа — регулируемый среди мелких. */
      ring(ctx, w * 0.28, cy, REF, 6, 46, 92);
      ring(ctx, w * 0.72, cy, mine, 7, 15, 62);

      if (reveal) {
        ctx.strokeStyle = '#1b1b1b';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        for (const [cx, r] of [[w * 0.28, mine], [w * 0.72, REF]] as const) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    },
    { ratio: 0.48 },
  );

  slider(root, 'mine', (v) => {
    mine = v;
    reveal = false;
    checkBtn.textContent = 'проверить';
    s.draw();
  });

  checkBtn.addEventListener('click', () => {
    reveal = !reveal;
    checkBtn.textContent = reveal ? 'скрыть ответ' : 'проверить';
    s.draw();
    if (!reveal) return;

    const err = ((mine - REF) / REF) * 100;
    const a = Math.abs(err).toFixed(0);
    say(
      root,
      Math.abs(err) < 3
        ? `промах ${a} % — вы попали. Это бывает: иллюзия сильна не у всех одинаково.`
        : err > 0
          ? `вы сделали правый круг на ${a} % больше эталона. Соседи у него мелкие, и он казался меньше, чем есть.`
          : `вы сделали правый круг на ${a} % меньше эталона — необычное направление, обычно ошибаются в другую сторону.`,
    );
  });
}
