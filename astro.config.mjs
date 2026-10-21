import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

/* Posts dated after the build are scheduled (see isPublished in src/lib/blog.ts).
   Their pages exist, but the sitemap waits for the day like the lists do. */
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Minsk' }).format(new Date());
const scheduled = new Set();
for (const f of readdirSync('src/content/blog')) {
  const m = f.match(/^(.+)\.(en|ru|be)\.md$/);
  const date = m && readFileSync(`src/content/blog/${f}`, 'utf8').match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
  if (date && date[1] > today) scheduled.add(`${m[2] === 'en' ? '' : `/${m[2]}`}/blog/${m[1]}/`);
}

export default defineConfig({
  site: 'https://dimhold.by',
  integrations: [
    sitemap({
      filter: (page) => !scheduled.has(new URL(page).pathname),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru', be: 'be' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'be'],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: 'auto' },
  markdown: {
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    },
  },
});
