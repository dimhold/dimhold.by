/* Общая обвязка всех демонстраций раздела.
 *
 * Разметку строит Demo.astro по описанию, поэтому модулю остаётся найти свои ручки по
 * имени и рисовать. Здесь собрано то, что иначе пришлось бы писать сто раз: пересчёт под
 * плотность пикселей, перерисовка на изменение размера, цикл анимации, который
 * останавливается вне экрана, и доступ к ручкам.
 */

export interface Surface {
  ctx: CanvasRenderingContext2D;
  /** Логические (CSS) пиксели — в них и считаем. */
  w: number;
  h: number;
  draw(): void;
}

function attach(canvas: HTMLCanvasElement, paint: (s: Surface) => void): Surface {
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true })!;
  const s: Surface = { ctx, w: 0, h: 0, draw: () => {} };
  const ratio = Number(canvas.dataset.ratio) || 0.6;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 640;
    const cssH = Math.round(cssW * ratio);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = `${cssH}px`;
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

/** Инструменты, которые получает каждый модуль демонстрации. */
export class Kit {
  readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  /** Основной холст. */
  surface(paint: (s: Surface) => void): Surface {
    return attach(this.root.querySelector<HTMLCanvasElement>('[data-canvas]')!, paint);
  }

  /** Второй холст под панелью: спектр, гистограмма, профиль яркости. */
  chart(paint: (s: Surface) => void): Surface {
    return attach(this.root.querySelector<HTMLCanvasElement>('[data-chart]')!, paint);
  }

  /** Слой обычного HTML поверх демонстрации. */
  get stage(): HTMLElement {
    return this.root.querySelector<HTMLElement>('[data-stage]')!;
  }

  el(sel: string) {
    return this.root.querySelector<HTMLElement>(sel);
  }

  /** Значение ползунка сейчас. */
  num(name: string): number {
    const el = this.root.querySelector<HTMLInputElement>(`[data-slider="${name}"]`);
    return el ? Number(el.value) : 0;
  }

  /** Обработчик на ползунок; сразу же один раз вызывается. */
  slider(name: string, on: (v: number) => void) {
    const el = this.root.querySelector<HTMLInputElement>(`[data-slider="${name}"]`);
    if (!el) return;
    const out = this.root.querySelector<HTMLElement>(`[data-out="${name}"]`);
    const fire = () => {
      if (out && el.dataset.fmt) out.textContent = el.dataset.fmt.replace('%', el.value);
      on(Number(el.value));
    };
    el.addEventListener('input', fire);
    fire();
  }

  /** Кнопка-переключатель: сама меняет подпись и aria-pressed. */
  toggle(name: string, on: (v: boolean) => void, initial = false) {
    const el = this.root.querySelector<HTMLButtonElement>(`[data-toggle="${name}"]`);
    if (!el) return;
    let v = initial;
    const paint = () => {
      el.setAttribute('aria-pressed', String(v));
      el.textContent = (v ? el.dataset.on : el.dataset.off) ?? el.textContent;
      on(v);
    };
    el.addEventListener('click', () => { v = !v; paint(); });
    paint();
  }

  button(name: string, on: (el: HTMLButtonElement) => void) {
    const el = this.root.querySelector<HTMLButtonElement>(`[data-btn="${name}"]`);
    el?.addEventListener('click', () => on(el));
    return el;
  }

  check(name: string, on: (v: boolean) => void) {
    const el = this.root.querySelector<HTMLInputElement>(`[data-check="${name}"]`);
    if (!el) return;
    el.addEventListener('change', () => on(el.checked));
    on(el.checked);
  }

  bool(name: string): boolean {
    return !!this.root.querySelector<HTMLInputElement>(`[data-check="${name}"]`)?.checked;
  }

  select(name: string, on: (v: string) => void) {
    const el = this.root.querySelector<HTMLSelectElement>(`[data-select="${name}"]`);
    if (!el) return;
    el.addEventListener('change', () => on(el.value));
    on(el.value);
  }

  pick(name: string): string {
    return this.root.querySelector<HTMLSelectElement>(`[data-select="${name}"]`)?.value ?? '';
  }

  /** Строка вывода под демонстрацией. */
  say(text: string) {
    const el = this.root.querySelector<HTMLElement>('[data-readout]');
    if (el) el.textContent = text;
  }

  clock(text: string) {
    const el = this.root.querySelector<HTMLElement>('[data-clock]');
    if (el) el.textContent = text;
  }

  /** Пробел без ловли его на кнопках: пробел на кнопке — это нажатие кнопки. */
  space(on: (down: boolean) => void) {
    const guard = (ev: KeyboardEvent) => ev.target instanceof HTMLButtonElement || ev.target instanceof HTMLInputElement;
    this.root.addEventListener('keydown', (ev) => {
      if (ev.key !== ' ' || guard(ev) || ev.repeat) return;
      ev.preventDefault();
      on(true);
    });
    this.root.addEventListener('keyup', (ev) => {
      if (ev.key !== ' ' || guard(ev)) return;
      ev.preventDefault();
      on(false);
    });
    this.root.tabIndex = 0;
  }

  /** Во сколько раз физические пиксели холста мельче логических.
      getImageData и putImageData не знают про setTransform и работают в физических:
      без этого множителя любая попиксельная обработка уезжает и обрезается. */
  get dpr(): number {
    const canvas = this.root.querySelector<HTMLCanvasElement>('[data-canvas]');
    return canvas ? canvas.width / (canvas.clientWidth || 1) : 1;
  }

  /** Яркость пикселя основного холста в логических координатах. */
  probe(x: number, y: number): number {
    const canvas = this.root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
    const ctx = canvas.getContext('2d')!;
    const dpr = canvas.width / (canvas.clientWidth || 1);
    return ctx.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data[0];
  }

  /** Анимация, которая спит вне экрана и при prefers-reduced-motion не стартует сама. */
  loop(tick: (t: number, dt: number) => void) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let on = false;
    let last = 0;
    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      tick(t / 1000, dt);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (on) return;
      on = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      on = false;
      last = 0;
      cancelAnimationFrame(raf);
    };
    if (!still.matches) {
      new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop())).observe(this.root);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    }
    return { start, stop, get running() { return on; } };
  }
}

export type Mount = (root: HTMLElement) => void;

/** Оборачивает функцию, которой удобнее получить Kit, а не голый элемент. */
export const demo = (fn: (k: Kit) => void): Mount => (root) => fn(new Kit(root));

/* Мелочи, которые нужны почти всем. */
export const grey = (v: number) => {
  const n = Math.max(0, Math.min(255, Math.round(v * 255)));
  return `rgb(${n} ${n} ${n})`;
};
export const PAPER = '#f4f2ec';
export const INK = '#18181b';
export const MARK = '#d2483f';
export const rnd = (seed: number) => {
  /* Детерминированный генератор: одна и та же демонстрация должна выглядеть одинаково
     до и после перерисовки, иначе ползунок меняет не то, что написано на подписи. */
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
