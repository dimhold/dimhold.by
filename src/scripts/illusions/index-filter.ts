/* Поиск и фильтр каталога.
 *
 * Индекса нет и сети не требуется: строка для поиска уже лежит в data-hay каждой строки,
 * собранная на сборке. Двести пятьдесят восемь узлов фильтруются за доли миллисекунды —
 * быстрее, чем успел бы прийти ответ от любого эндпоинта. Когда записей станет тысяча,
 * это придётся переписать; пока переписывать нечего.
 */

const form = document.querySelector<HTMLFormElement>('[data-ill-search]');
const input = document.querySelector<HTMLInputElement>('[data-ill-input]');
const clear = document.querySelector<HTMLButtonElement>('[data-ill-clear]');
const countEl = document.querySelector<HTMLElement>('[data-ill-count]');
const emptyEl = document.querySelector<HTMLElement>('[data-ill-empty]');
const chips = [...document.querySelectorAll<HTMLButtonElement>('[data-ill-filter]')];
const items = [...document.querySelectorAll<HTMLElement>('[data-ill-item]')];
const groups = [...document.querySelectorAll<HTMLElement>('[data-ill-group]')];

if (form && input && items.length) {
  let filter = '';

  /* «ё» и «е» — одна буква для всех, кто ищет, и две для строкового сравнения.
     Ещё убираем дефисы: «мюллер-лайер» должно находиться по «мюллер лайер». */
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/[-–—]/g, ' ');

  const plural = (n: number) => {
    const t = n % 10, h = n % 100;
    if (t === 1 && h !== 11) return 'запись';
    if (t >= 2 && t <= 4 && (h < 12 || h > 14)) return 'записи';
    return 'записей';
  };

  function apply() {
    const words = norm(input!.value).split(/\s+/).filter(Boolean);
    let shown = 0;

    for (const li of items) {
      const hay = norm(li.dataset.hay ?? '');
      const okText = words.every((w) => hay.includes(w));
      const okFilter =
        !filter || (filter === '__demo' ? li.dataset.demo === '1' : li.dataset.mod === filter);
      const on = okText && okFilter;
      li.hidden = !on;
      if (on) shown++;
    }

    /* Заголовок модальности без единой видимой строки под ним — мусор. */
    for (const g of groups) {
      const any = [...g.querySelectorAll<HTMLElement>('[data-ill-item]')].some((li) => !li.hidden);
      g.hidden = !any;
    }

    const filtering = words.length > 0 || filter !== '';
    if (countEl) countEl.textContent = filtering ? `${shown} ${plural(shown)}` : '';
    if (emptyEl) emptyEl.hidden = shown > 0;
    if (clear) clear.hidden = input!.value === '';
  }

  input.addEventListener('input', apply);

  clear?.addEventListener('click', () => {
    input.value = '';
    input.focus();
    apply();
  });

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      /* Повторный щелчок по активной кнопке снимает фильтр: иначе из «слуха»
         невозможно вернуться во «всё», не найдя глазами нужную кнопку. */
      filter = chip.dataset.illFilter === filter ? '' : (chip.dataset.illFilter ?? '');
      for (const c of chips) {
        const on = (c.dataset.illFilter ?? '') === filter;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      }
      apply();
    });
  }

  /* Пришли по ссылке вида /ru/illusions/?q=кафе — ищем сразу. */
  const q = new URLSearchParams(location.search).get('q');
  if (q) input.value = q;
  apply();

  /* «/» ставит курсор в поиск, Esc — убирает. Привычка из всех остальных каталогов. */
  document.addEventListener('keydown', (ev) => {
    const el = document.activeElement;
    const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    if (ev.key === '/' && !typing) {
      ev.preventDefault();
      input.focus();
      input.select();
    } else if (ev.key === 'Escape' && typing) {
      input.value = '';
      apply();
      input.blur();
    }
  });
}
