import type { APIRoute } from 'astro';
import type { Lang } from '../../i18n';
import { postsFor, postPath, fmtDate, searchExcerpt } from '../../lib/blog';
import { tagLabel } from '../../lib/tags';

/**
 * One index per language, built at build time and served as a static file.
 * The reader's language decides which posts are in it and which tag labels
 * are searchable, so a Russian reader typing "базы данных" finds the post that
 * carries the databases tag without the slug ever being shown to them.
 */
export function getStaticPaths() {
  return (['en', 'ru', 'be'] as Lang[]).map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const posts = await postsFor(lang);
  const index = posts.map((p) => ({
    t: p.data.title,
    d: p.data.description,
    u: postPath(p),
    n: fmtDate(p.data.date, lang),
    g: p.data.tags.map((slug) => tagLabel(slug, lang)),
    x: searchExcerpt(p.body),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
