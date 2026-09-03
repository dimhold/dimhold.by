/**
 * Client side search over the writing. The site is static, so the index is a
 * JSON file built per language at /search/<lang>.json and fetched once, on the
 * first keystroke rather than on page load: a reader who came to read a post
 * should not pay for a search they never run.
 *
 * The index carries the title, the description, the tag labels of that language
 * and a few hundred characters of the opening prose. Not the whole body: with
 * hundreds of posts that file grows past the point where downloading it beats
 * scrolling, and the phrase a reader remembers is almost always near the top.
 */
interface Entry {
  /** title */ t: string;
  /** description */ d: string;
  /** url */ u: string;
  /** date, as printed */ n: string;
  /** tag labels */ g: string[];
  /** opening prose */ x: string;
}

type Scored = { e: Entry; score: number };

const form = document.querySelector<HTMLFormElement>('[data-search]');
const input = document.querySelector<HTMLInputElement>('[data-search-input]');
const box = document.querySelector<HTMLElement>('[data-search-results]');
const hint = document.querySelector<HTMLElement>('[data-search-hint]');
const clear = document.querySelector<HTMLElement>('[data-search-clear]');
const hides = [...document.querySelectorAll<HTMLElement>('[data-search-hides]')];

if (form && input && box) {
  form.hidden = false;
  if (hint) hint.hidden = false;

  const url = form.dataset.index!;
  const lang = form.dataset.lang ?? 'en';
  const forms = (form.dataset.forms ?? 'post|posts|posts').split('|');

  /* ё and е are the same letter to anybody typing a query, and a reader who
     types "надежность" should find "надёжность". */
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/ў/g, 'у');

  function plural(n: number): string {
    if (lang === 'en') return `${n} ${n === 1 ? forms[0] : forms[1]}`;
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} ${forms[0]}`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} ${forms[1]}`;
    return `${n} ${forms[2]}`;
  }

  let index: Entry[] | null = null;
  let loading: Promise<Entry[]> | null = null;

  function load(): Promise<Entry[]> {
    if (index) return Promise.resolve(index);
    loading ??= fetch(url)
      .then((r) => r.json())
      .then((data: Entry[]) => {
        index = data;
        return data;
      })
      .catch(() => {
        index = [];
        return index;
      });
    return loading;
  }

  /* Every token has to appear somewhere, and where it appears decides the
     order: a word in the title means the post is about it, the same word in
     the body means it was mentioned once. */
  function search(query: string, data: Entry[]): Scored[] {
    const tokens = norm(query).split(/\s+/).filter(Boolean);
    const out: Scored[] = [];
    for (const e of data) {
      const title = norm(e.t);
      const tags = norm(e.g.join(' '));
      const desc = norm(e.d);
      const body = norm(e.x);
      let score = 0;
      let all = true;
      for (const tk of tokens) {
        const hit = title.includes(tk) ? 8 : tags.includes(tk) ? 5 : desc.includes(tk) ? 3 : body.includes(tk) ? 1 : 0;
        if (hit === 0) {
          all = false;
          break;
        }
        score += hit;
      }
      if (all) out.push({ e, score });
    }
    return out.sort((a, b) => b.score - a.score);
  }

  function render(query: string, hits: Scored[]) {
    box!.textContent = '';
    const head = document.createElement('p');
    head.className = 'search-count';
    head.textContent = hits.length
      ? (form!.dataset.found ?? '{n}').replace('{n}', plural(hits.length))
      : (form!.dataset.empty ?? '{q}').replace('{q}', `"${query}"`);
    box!.append(head);

    if (hits.length) {
      const list = document.createElement('ul');
      list.className = 'post-rows';
      for (const { e } of hits) {
        const li = document.createElement('li');
        li.className = 'post-row';
        const a = document.createElement('a');
        a.href = e.u;
        const date = document.createElement('span');
        date.className = 'post-row-date';
        date.textContent = e.n;
        const title = document.createElement('span');
        title.className = 'post-row-title';
        title.textContent = e.t;
        a.append(date, title);
        li.append(a);
        list.append(li);
      }
      box!.append(list);
    }
    box!.hidden = false;
  }

  function apply(query: string, push: boolean) {
    const q = query.trim();
    if (clear) clear.hidden = q === '';
    for (const el of hides) el.hidden = q !== '';
    if (push) {
      const next = new URL(location.href);
      if (q) next.searchParams.set('q', q);
      else next.searchParams.delete('q');
      history.replaceState(null, '', next);
    }
    if (!q) {
      box!.hidden = true;
      box!.textContent = '';
      return;
    }
    load().then((data) => {
      /* The reader kept typing while the index was in flight; that answer is
         stale and rendering it would flash an old list over a newer query. */
      if (input!.value.trim() !== q) return;
      render(q, search(q, data));
    });
  }

  let timer = 0;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => apply(input.value, true), 90);
  });
  input.addEventListener('focus', load, { once: true });
  clear?.addEventListener('click', () => {
    input.value = '';
    apply('', true);
    input.focus();
  });

  /* A search is a link: ?q= in the address bar restores it, which is what a
     reader who bookmarked or shared the result expects. */
  const initial = new URL(location.href).searchParams.get('q');
  if (initial) {
    input.value = initial;
    apply(initial, false);
  }
}
