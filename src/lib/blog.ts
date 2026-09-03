import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Post = CollectionEntry<'blog'>;

/** Which languages to try, in order, when a post has no translation. */
const FALLBACK: Record<Lang, Lang[]> = {
  en: ['en'],
  ru: ['ru', 'en'],
  be: ['be', 'ru', 'en'],
};

function byDateDesc(a: Post, b: Post): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(byDateDesc);
}

/** One post per translationKey, preferring the reader's language. */
export async function postsFor(lang: Lang): Promise<Post[]> {
  const posts = await allPosts();
  const byKey = new Map<string, Post[]>();
  for (const p of posts) {
    const group = byKey.get(p.data.translationKey);
    if (group) group.push(p);
    else byKey.set(p.data.translationKey, [p]);
  }
  const picked: Post[] = [];
  for (const group of byKey.values()) {
    for (const l of FALLBACK[lang]) {
      const hit = group.find((g) => g.data.lang === l);
      if (hit) {
        picked.push(hit);
        break;
      }
    }
  }
  return picked.sort(byDateDesc);
}

export async function translationsOf(post: Post): Promise<Post[]> {
  const posts = await allPosts();
  return posts.filter((p) => p.data.translationKey === post.data.translationKey);
}

export function langBase(lang: Lang): string {
  return lang === 'en' ? '/blog/' : `/${lang}/blog/`;
}

export function postPath(post: Post): string {
  return langBase(post.data.lang) + post.data.translationKey + '/';
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}

const LOCALES: Record<Lang, string> = { en: 'en-US', ru: 'ru-RU', be: 'be-BY' };

export function fmtDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

/* ——— navigation: pages, tags, archive ——— */

/** Cards are big, so a screenful is about a dozen. */
export const PAGE_SIZE = 12;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function pageSlice<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

/** Page 1 keeps the plain /blog/ address; the rest hang off /page/ so they can
    never collide with a post whose slug happens to be a number. */
export function pagePath(lang: Lang, page: number): string {
  return page <= 1 ? langBase(lang) : `${langBase(lang)}page/${page}/`;
}

export function archivePath(lang: Lang): string {
  return `${langBase(lang)}archive/`;
}

export interface TagCount {
  slug: string;
  count: number;
}

/** Every tag that has at least one post, heaviest first. A tag with no posts is
    left out rather than shown as a dead link. */
export function tagCounts(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function postsWithTag(posts: Post[], tag: string): Post[] {
  return posts.filter((p) => p.data.tags.includes(tag));
}

export interface ArchiveMonth {
  /** 1 to 12, so it indexes a month name list directly. */
  month: number;
  posts: Post[];
}

export interface ArchiveYear {
  year: number;
  count: number;
  months: ArchiveMonth[];
}

/** Newest year first, and inside a year newest month first. Empty months are
    absent here; the calendar grid fills its own blanks. */
export function archiveByYear(posts: Post[]): ArchiveYear[] {
  const years = new Map<number, Map<number, Post[]>>();
  for (const p of posts) {
    const y = p.data.date.getUTCFullYear();
    const m = p.data.date.getUTCMonth() + 1;
    const months = years.get(y) ?? new Map<number, Post[]>();
    years.set(y, months);
    months.set(m, [...(months.get(m) ?? []), p]);
  }
  return [...years.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      count: [...months.values()].reduce((n, list) => n + list.length, 0),
      months: [...months.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([month, list]) => ({ month, posts: list })),
    }));
}

export function yearAnchor(year: number): string {
  return `y${year}`;
}

export function monthAnchor(year: number, month: number): string {
  return `y${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Russian and Belarusian need 3 forms and English needs 2, so every dictionary
 * carries 3 and English repeats the plural. The rule is the standard one:
 * 1 but not 11, then 2 to 4 but not 12 to 14, then the rest.
 */
export function plural(n: number, forms: readonly [string, string, string], lang: Lang): string {
  if (lang === 'en') return `${n} ${n === 1 ? forms[0] : forms[1]}`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${forms[0]}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${forms[1]}`;
  return `${n} ${forms[2]}`;
}

/**
 * What the search index carries per post besides the title: enough prose to
 * match a phrase the reader remembers, and not the whole body, because the file
 * is downloaded before the first keystroke can be answered.
 */
export function searchExcerpt(body: string | undefined, limit = 320): string {
  const text = (body ?? '')
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const stop = cut.lastIndexOf(' ');
  return (stop > limit * 0.6 ? cut.slice(0, stop) : cut) + '…';
}

export function fmtMonth(year: number, month: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function monthShort(month: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], { month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2001, month - 1, 1)),
  );
}

/**
 * Which page numbers a pager shows: the ends, the neighbours of the current one
 * and a gap for the rest. 15 years of weekly posts is 700 pages of links
 * otherwise, and a pager longer than the page it sits on is not navigation.
 */
export function pageWindow(current: number, total: number): (number | 'gap')[] {
  const keep = new Set<number>([1, total, current - 1, current, current + 1]);
  const out: (number | 'gap')[] = [];
  let gap = false;
  for (let n = 1; n <= total; n++) {
    if (keep.has(n)) {
      out.push(n);
      gap = false;
    } else if (!gap) {
      out.push('gap');
      gap = true;
    }
  }
  return out;
}
