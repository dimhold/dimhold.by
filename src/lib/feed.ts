import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { Lang } from '../i18n';
import { dictionaries } from '../i18n';
import { postsFor, postPath } from './blog';

/**
 * One feed per language. There used to be a single feed carrying every post
 * three times over, once in each language, which no reader wants: a subscriber
 * reads one of them. A post with no translation still appears, in the nearest
 * language it has, the same way the lists on the site do it.
 */
export async function feed(context: APIContext, lang: Lang) {
  const t = dictionaries[lang];
  const posts = await postsFor(lang);
  return rss({
    title: t.blog.title,
    description: t.blog.description,
    site: context.site!,
    customData: `<language>${lang}</language>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postPath(p),
    })),
  });
}
