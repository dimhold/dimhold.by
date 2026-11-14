import type { Lang } from '../i18n';

/* What ends up in <title> and <meta name="description">. A search result shows
   about 60 characters of one and 160 of the other; the rest is cut mid-word or
   thrown away and rewritten. */

const NAME: Record<Lang, string> = {
  en: 'Dmitriy Semenkevich',
  ru: 'Дмитрий Семенкевич',
  be: 'Дзмітрый Семенкевіч',
};

const TITLE_MAX = 70;
const DESC_MAX = 165;

/**
 * A page title signed with the author's name in the page's own language. A
 * title that is already a full sentence goes out unsigned: the name would be
 * the part that gets cut, and the result shows the site name beside it anyway.
 */
export function withName(title: string, lang: Lang): string {
  const signed = `${title}${lang === 'en' ? ' · ' : ' — '}${NAME[lang]}`;
  return signed.length > TITLE_MAX ? title : signed;
}

/**
 * The description cut to what a result shows, on a sentence boundary where one
 * fits and on a word boundary where the first sentence alone is too long.
 */
export function shortDesc(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= DESC_MAX) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > DESC_MAX) break;
    out += s;
  }
  out = out.trim();
  if (out.length >= 60) return out;
  const cut = clean.slice(0, DESC_MAX - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]+$/, '').trim() + '…';
}
