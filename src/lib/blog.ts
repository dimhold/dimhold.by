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
