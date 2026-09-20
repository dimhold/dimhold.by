/* Загрузчик демонстраций.
 *
 * На странице ровно одна демонстрация, но ключ её известен только в рантайме. Реестр
 * сопоставляет ключ семейству, семейство грузится динамическим импортом, и Vite режет
 * его в отдельный чанк.
 */
import { REGISTRY } from './registry';

for (const root of document.querySelectorAll<HTMLElement>('[data-ill-demo]')) {
  const key = root.dataset.illDemo ?? '';
  const entry = REGISTRY[key];
  if (!entry) {
    console.warn(`[illusions] нет модуля для демонстрации "${key}"`);
    continue;
  }
  const [load, name] = entry;
  const start = () =>
    load().then((m) => {
      const mount = m[name];
      if (typeof mount !== 'function') {
        console.warn(`[illusions] в семействе нет экспорта "${name}" для "${key}"`);
        return;
      }
      mount(root);
    });
  /* Демонстрация ниже первого экрана грузится, когда до неё дойдут: канвас, который
     рисует сам себя в фоне вкладки, никому не нужен. */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '250px' },
    );
    io.observe(root);
  } else {
    start();
  }
}
