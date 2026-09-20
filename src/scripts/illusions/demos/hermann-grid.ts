/* Сетка Германа с волнистым переключателем.
   Волнистые улицы сохраняют всю световую геометрию — площадь белого, ширину улиц,
   размеры перекрёстков, — и убивают кляксы. Латеральное торможение в сетчатке этого
   объяснить не может: рецептивное поле не знает, прямая улица или кривая. */
import { surface, slider, say } from '../canvas';

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const wavyBtn = root.querySelector<HTMLButtonElement>('[data-btn="wavy"]')!;

  let street = 14;
  let wavy = false;

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      const pitch = street * 5;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = street;
      ctx.lineCap = 'butt';

      const amp = wavy ? street * 0.9 : 0;
      const period = pitch * 1.0;

      /* Горизонтальные улицы. */
      for (let y = pitch / 2; y < h + pitch; y += pitch) {
        ctx.beginPath();
        for (let x = -2; x <= w + 2; x += 2) {
          const yy = y + amp * Math.sin((x / period) * Math.PI * 2);
          x === -2 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      /* Вертикальные — та же волна, сдвинутая на четверть, чтобы перекрёстки не
         расползались по площади. */
      for (let x = pitch / 2; x < w + pitch; x += pitch) {
        ctx.beginPath();
        for (let y = -2; y <= h + 2; y += 2) {
          const xx = x + amp * Math.sin((y / period) * Math.PI * 2 + Math.PI / 2);
          y === -2 ? ctx.moveTo(xx, y) : ctx.lineTo(xx, y);
        }
        ctx.stroke();
      }
    },
    { ratio: 0.62 },
  );

  slider(root, 'street', (v) => { street = v; s.draw(); });

  wavyBtn.addEventListener('click', () => {
    wavy = !wavy;
    wavyBtn.setAttribute('aria-pressed', String(wavy));
    wavyBtn.textContent = wavy ? 'выпрямить улицы' : 'сделать улицы волнистыми';
    s.draw();
    say(
      root,
      wavy
        ? 'кляксы исчезли, а белого на экране столько же. Вместе с ними исчезло и учебниковое объяснение.'
        : 'смотрите мимо перекрёстка — серые пятна появляются там, куда вы не смотрите.',
    );
  });
}
