/* Понцо. Один ползунок — угол схождения рельсов. На нуле рельсы параллельны, перспективы
   нет, и эффект пропадает: видно, что работает именно схождение, а не наличие линий. */
import { surface, slider, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  let deg = 16;

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#f7f5f0';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const halfBottom = w * 0.34;
      /* Верх сужается тем сильнее, чем больше угол; на нуле рельсы идут отвесно. */
      const halfTop = halfBottom * (1 - (deg / 45) * 0.9);

      ctx.strokeStyle = '#8a8d96';
      ctx.lineWidth = 2.5;
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + sgn * halfBottom, h * 0.94);
        ctx.lineTo(cx + sgn * halfTop, h * 0.06);
        ctx.stroke();
      }

      /* Два одинаковых отрезка. Длина одна переменная — подделать нечего. Она подобрана
         так, чтобы верхний почти упирался в рельсы: вплотную к сходящимся линиям эффект
         заметно сильнее, чем посередине пустого поля. */
      const L = 2 * halfTop * 0.92;
      ctx.strokeStyle = '#d2483f';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (const y of [h * 0.26, h * 0.74]) {
        ctx.beginPath();
        ctx.moveTo(cx - L / 2, y);
        ctx.lineTo(cx + L / 2, y);
        ctx.stroke();
      }
    },
    { ratio: 0.8 },
  );

  slider(root, 'deg', (v) => {
    deg = v;
    s.draw();
    say(
      root,
      v === 0
        ? 'рельсы параллельны — перспективы нет, и отрезки наконец выглядят одинаковыми.'
        : `схождение ${v}°. Верхний отрезок кажется длиннее; длина у обоих одна и та же переменная.`,
    );
  });
}
