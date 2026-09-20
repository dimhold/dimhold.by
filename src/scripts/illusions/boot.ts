/* Загрузчик демонстраций.
 *
 * На странице ровно одна демонстрация, но ключ её известен только в рантайме, поэтому
 * модули подключаются через import.meta.glob: Vite режет их на отдельные чанки, и
 * посетитель страницы про кафе-стену не скачивает синтезатор Шепарда.
 */
const modules = import.meta.glob<{ default: (root: HTMLElement) => void }>('./demos/*.ts');

for (const root of document.querySelectorAll<HTMLElement>('[data-ill-demo]')) {
  const key = root.dataset.illDemo;
  const load = modules[`./demos/${key}.ts`];
  if (!load) {
    console.warn(`[illusions] нет модуля для демонстрации "${key}"`);
    continue;
  }
  /* Демонстрация ниже первого экрана — грузим, когда до неё дойдут. Канвас, который
     рисует сам себя в фоне вкладки, никому не нужен. */
  const start = () => load().then((m) => m.default(root));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(root);
  } else {
    start();
  }
}
