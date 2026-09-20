/* Общая обвязка для канвасов раздела.
 *
 * Три вещи, которые иначе пришлось бы писать десять раз: пересчёт под плотность пикселей
 * (на иллюзиях с тонкими линиями половина эффекта живёт именно там), перерисовка на
 * изменение размера и уважение к prefers-reduced-motion.
 */

export interface Surface {
  ctx: CanvasRenderingContext2D;
  /** Логические (CSS) пиксели — в них и считаем. */
  w: number;
  h: number;
  /** Перерисовать сейчас. */
  draw(): void;
}

/**
 * Привязывает функцию рисования к канвасу. Возвращает поверхность с методом draw:
 * контролы дёргают его, размер окна — тоже.
 */
export function surface(
  canvas: HTMLCanvasElement,
  paint: (s: Surface) => void,
  opts: { ratio?: number } = {},
): Surface {
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const s: Surface = { ctx, w: 0, h: 0, draw: () => {} };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 640;
    const cssH = opts.ratio ? Math.round(cssW * opts.ratio) : canvas.clientHeight || 360;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    if (opts.ratio) canvas.style.height = `${cssH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    s.w = cssW;
    s.h = cssH;
    paint(s);
  };

  s.draw = () => paint(s);
  resize();

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  return s;
}

/** Цикл анимации, который останавливается вне экрана и при prefers-reduced-motion. */
export function loop(root: HTMLElement, tick: (t: number) => void) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let on = false;

  const frame = (t: number) => {
    tick(t);
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (on || still.matches) return;
    on = true;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    on = false;
    cancelAnimationFrame(raf);
  };

  new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop())).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  return { start, stop, get running() { return on; } };
}

/** Читает ползунок, вешает обработчик и сразу отдаёт текущее значение. */
export function slider(
  root: HTMLElement,
  name: string,
  onInput: (v: number) => void,
): { el: HTMLInputElement; value: number } {
  const el = root.querySelector<HTMLInputElement>(`[data-slider="${name}"]`)!;
  const out = root.querySelector<HTMLElement>(`[data-out="${name}"]`);
  const state = { el, value: Number(el.value) };
  const fire = () => {
    state.value = Number(el.value);
    if (out) out.textContent = el.dataset.fmt ? el.dataset.fmt.replace('%', el.value) : el.value;
    onInput(state.value);
  };
  el.addEventListener('input', fire);
  fire();
  return state;
}

/** Пишет строку в поле вывода демонстрации. */
export function say(root: HTMLElement, text: string) {
  const el = root.querySelector<HTMLElement>('[data-readout]');
  if (el) el.textContent = text;
}
