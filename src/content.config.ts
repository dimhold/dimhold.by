import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'ru', 'be']),
    translationKey: z.string(),
    draft: z.boolean().default(false),
    /* Set when the post drops a <div data-walk> into its prose; only then does
       the page pay for the player's script and its 190 KB of coordinates. */
    walk: z.boolean().default(false),
  }),
});

export const collections = { blog };
