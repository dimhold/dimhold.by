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

/* A table wider than a phone used to push the whole page sideways. Each one is
   put in a box of its own that scrolls; the box is styled as .table-wrap. */
function wrapTables() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'table')
        return { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [child] };
      walk(child);
      return child;
    });
  };
  return walk;
}

export default defineConfig({
  site: 'https://dimhold.by',
  integrations: [
    sitemap({
      filter: (page) => !scheduled.has(new URL(page).pathname) && !page.includes('/home-next'),
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
    rehypePlugins: [wrapTables],
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    },
  },
});
