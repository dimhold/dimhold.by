import vocabulary from './tags.json';
import type { Lang } from '../i18n';
import { dictionaries } from '../i18n';

/**
 * The tag vocabulary is closed on purpose and lives in a JSON file rather than
 * here, because two programs read it: this site, and the acceptance gate in the
 * writing workspace that refuses an article whose tags are not in the list.
 * A free-form tag field would grow one synonym per post and the cloud would
 * stop being navigation.
 *
 * A slug is language neutral; the label a reader sees comes from the dictionary
 * of the page they are on, and an unknown slug falls back to itself so a new
 * tag is never a build error.
 */
export const TAGS: readonly string[] = vocabulary;

export function isTag(slug: string): boolean {
  return TAGS.includes(slug);
}

export function tagLabel(slug: string, lang: Lang): string {
  return dictionaries[lang].blog.tagLabels[slug] ?? slug;
}

export function tagPath(slug: string, lang: Lang): string {
  return lang === 'en' ? `/blog/tag/${slug}/` : `/${lang}/blog/tag/${slug}/`;
}
