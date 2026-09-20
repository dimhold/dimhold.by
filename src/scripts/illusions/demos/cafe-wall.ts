/* Кафе-стена. Ручка яркости шва — главная: Грегори и Хёрд утверждают, что эффект живёт
   ровно до тех пор, пока серый шов лежит между яркостями плиток. Утверждение проверяемое,
   и проверить его можно здесь же, за две секунды. */
import { surface, slider, say } from '../canvas';

const DARK = 0.06;
const LIGHT = 0.94;

export default function mount(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;

  let offset = 0.5;
  let mortar = 3;
  let lum = 0.5;

  const s = surface(
    canvas,
    ({ ctx, w, h }) => {
      const tile = Math.max(28, Math.round(w / 12));
      const rows = Math.ceil(h / (tile + mortar)) + 1;
      const cols = Math.ceil(w / tile) + 2;

      const g = (v: number) => `rgb(${Math.round(v * 255)} ${Math.round(v * 255)} ${Math.round(v * 255)})`;

      ctx.fillStyle = g(lum);
      ctx.fillRect(0, 0, w, h);

      for (let r = 0; r < rows; r++) {
        const y = r * (tile + mortar);
        /* Сдвигаются через ряд, а раскраска от ряда не зависит. Это важно: если вместе
           со сдвигом на полплитки менять чётность цвета, узор возвращается на место и
           никакого рассогласования между рядами не остаётся. */
        const shift = (r % 2 ? offset : 0) * tile;
        for (let c = -1; c < cols; c++) {
          ctx.fillStyle = g(c % 2 ? LIGHT : DARK);
          ctx.fillRect(Math.round(c * tile + shift), y, tile, tile);
        }
      }
    },
    { ratio: 0.6 },
  );

  const tell = () => {
    const outside = lum <= DARK + 0.02 || lum >= LIGHT - 0.02;
    say(
      root,
      outside
        ? 'яркость шва вышла за пределы плиток — ряды должны выпрямиться. Если они выпрямились, объяснение Грегори только что подтвердилось у вас на экране.'
        : mortar === 0
          ? 'шва нет вовсе — и наклона тоже нет.'
          : `шов ${Math.round(lum * 100)} % между плитками ${Math.round(DARK * 100)} и ${Math.round(LIGHT * 100)} — в рабочем диапазоне.`,
    );
  };

  slider(root, 'offset', (v) => { offset = v / 100; s.draw(); });
  slider(root, 'mortar', (v) => { mortar = v; s.draw(); tell(); });
  slider(root, 'lum', (v) => { lum = v / 100; s.draw(); tell(); });
}
