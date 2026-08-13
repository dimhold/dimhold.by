import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPosts, postPath } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = await allPosts();
  return rss({
    title: 'Dmitriy Semenkevich — writing',
    description:
      'Essays and build logs by Dmitriy Semenkevich: AI products that don’t guess, financial engines, web experiments.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: postPath(p),
    })),
  });
}
