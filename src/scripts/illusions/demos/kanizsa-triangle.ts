/* Треугольник Канижи. Ползунок разворачивает вырезы, кнопка берёт пробу яркости.
   Количество чёрного на экране при повороте не меняется ни на пиксель — меняется только
   то, складывается ли из вырезов объяснение «сверху что-то лежит». */
import { surface, slider, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const probeBtn = root.querySelector<HTMLButtonElement>('[data-btn="probe"]')!;

  let spin = 0;
  let geom = { cx: 0, cy: 0, r: 0, w: 0, h: 0 };

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      ctx.fillStyle = '#f2efe8';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      /* Радиус пакмена задаёт «долю поддержки» — какую часть стороны треугольника
         занимает настоящий контур. При 0.55 от радиуса описанной окружности это около
         двух третей, и контур виден уверенно. */
      const r = R * 0.55;
      geom = { cx, cy, r: R, w, h };

      ctx.fillStyle = '#16161a';
      for (let i = 0; i < 3; i++) {
        /* Вершины равностороннего треугольника, первая — вверх. */
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        /* Вырез смотрит в центр при spin = 0 и наружу при spin = 180. */
        const toCentre = Math.atan2(cy - y, cx - x) + (spin * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(x, y);
        /* Вырез ровно 60°: это внутренний угол равностороннего треугольника, и только
           при нём прямые края выреза ложатся на его стороны. При 90°, как рисуют в
           половине пересказов, края расходятся со сторонами и контур не собирается. */
        ctx.arc(x, y, r, toCentre + Math.PI / 6, toCentre - Math.PI / 6);
        ctx.closePath();
        ctx.fill();
      }
    },
    { ratio: 0.72 },
  );

  slider(root, 'spin', (v) => {
    spin = v;
    s.draw();
  });

  probeBtn.addEventListener('click', () => {
    const ctx = canvas.getContext('2d')!;
    const dpr = canvas.width / (canvas.clientWidth || 1);
    const at = (x: number, y: number) =>
      ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data[0];

    const inside = at(geom.cx, geom.cy);
    /* Проба фона берётся в углу — гарантированно вне всякой фигуры. */
    const outside = at(geom.w * 0.06, geom.h * 0.1);
    say(
      root,
      inside === outside
        ? `внутри фигуры ${inside}, снаружи ${outside}. Одно и то же число: светлее там не стало.`
        : `внутри ${inside}, снаружи ${outside} — проба попала на край, сдвиньте ползунок и повторите.`,
    );
  });
}
