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

/* Research write-ups. English only and deliberately so: these are artefacts of
   the work, not posts, and translating a method section three ways buys nothing.
   Each one has a DOI on Zenodo and a repository behind it; the page here is the
   landing page a crawler reads, and the PDF next to it is what Google Scholar
   indexes. Scholar does not index Zenodo, so this is the only way in. */
const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    /* One line under the title, on the page and on the PDF cover. */
    subtitle: z.string(),
    abstract: z.string(),
    date: z.coerce.date(),
    /* The concept DOI, which always resolves to the latest version. Version
       DOIs belong in the record, not in a citation that has to survive. */
    doi: z.string(),
    repo: z.string(),
    keywords: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, papers };
