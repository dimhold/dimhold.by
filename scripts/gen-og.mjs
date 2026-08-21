/* Draws the social preview cards — the picture Telegram, LinkedIn and X show
 * under a link to this site.
 *
 * One card per page rather than one for the whole site: a shared card makes
 * every post look like the same post. Each card carries the page's own title,
 * so a link to an essay previews as that essay.
 *
 * The cards are built here and committed as files, not rendered at request
 * time. A crawler fetches them once, cold, and a static file is the only way
 * that is instant.
 *
 * Fonts: libvips reads a font file handed to it, but not a woff2 — so the
 * subsets the site already ships are decompressed to ttf into a cache under
 * node_modules and handed over from there. Nothing new enters the repository.
 *
 * Run: npm run og
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { decompress } from 'wawoff2';

import { dictionaries } from '../src/i18n/index.ts';

const OUT = 'public/og';
const CACHE = 'node_modules/.cache/dimhold-og';
const FIGURINE = 'src/assets/hero-figurine.png';
const BAND = 'public/ornament-band.svg';
const POSTS = 'src/content/blog';

const W = 1200;
const H = 630;

/* The light theme's own values, resolved out of the HSL the stylesheet builds
   them from. The card has to look like the site it links to. */
const PAPER = '#f2ebe0';
const INK = '#373024';
const MUTED = '#63594a';
const ACCENT = '#1d5aa8';

/* The picture panel down the right-hand edge, and the embroidered seam that
   separates it from the words — the edge of a rushnyk, in the same pattern the
   site weaves across its own background. */
const PANEL_W = 500;
const SEAM_W = 26;
const PANEL_X = W - PANEL_W;

/* The figurine is a 1440 square; this is the part of it worth 500×630 —
   the cap down to the shoes, with the dog kept whole. */
const FIG_CROP = { left: 230, top: 60, width: 1000, height: 1260 };

const PAD = 76;
const COL_W = PANEL_X - SEAM_W - PAD * 2;

/* ---------------------------------------------------------------- fonts --- */

const FONTSOURCE = 'node_modules/@fontsource-variable';

/** Decompress a woff2 the site already ships into a ttf libvips can read. */
async function ttf(pkg, file) {
  await mkdir(CACHE, { recursive: true });
  const out = `${CACHE}/${file}.ttf`;
  if (!existsSync(out)) {
    const woff2 = await readFile(`${FONTSOURCE}/${pkg}/files/${file}.woff2`);
    await writeFile(out, Buffer.from(await decompress(woff2)));
  }
  return out;
}

const RUBIK = await ttf('rubik', 'rubik-latin-wght-normal');
const MONO = await ttf('jetbrains-mono', 'jetbrains-mono-latin-wght-normal');

/* ----------------------------------------------------------------- text --- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Render a run of text to its own transparent image, sized to the glyphs. */
const draw = ({ text, font, file, size, color, weight, width, spacing = 0 }) =>
  sharp({
    text: {
      text: `<span foreground="${color}"${weight ? ` weight="${weight}"` : ''}>${esc(text)}</span>`,
      font: `${font} ${size}`,
      fontfile: file,
      rgba: true,
      dpi: 96,
      spacing,
      ...(width ? { width } : {}),
    },
  })
    .png()
    .toBuffer();

/** Set the title as large as it can be set without overrunning its box.
 *  Long titles are not truncated — they step down a size instead, because a
 *  preview that cuts a headline mid-word costs more than one set smaller. */
async function fitTitle(text, maxHeight) {
  for (const size of [64, 58, 52, 47, 43, 39, 35]) {
    const buf = await draw({
      text,
      font: 'Rubik',
      file: RUBIK,
      size,
      color: INK,
      weight: 'bold',
      width: COL_W,
      spacing: Math.round(size * 0.16),
    });
    const { height } = await sharp(buf).metadata();
    if (height <= maxHeight) return { buf, height };
  }
  const buf = await draw({
    text,
    font: 'Rubik',
    file: RUBIK,
    size: 30,
    color: INK,
    weight: 'bold',
    width: COL_W,
    spacing: 10,
  });
  return { buf, height: (await sharp(buf).metadata()).height };
}

/* -------------------------------------------------------------- pieces --- */

/** The picture panel, cropped out of the hero figurine. */
const panel = await sharp(FIGURINE)
  .extract(FIG_CROP)
  .resize(PANEL_W, H, { fit: 'cover', kernel: 'lanczos3' })
  .png()
  .toBuffer();

/** The vyshyvanka band, inked and stood on end to make the seam. The svg is
 *  drawn in black for the stylesheet to tint; here it is tinted directly. */
async function seam() {
  const svg = (await readFile(BAND, 'utf8')).replaceAll('#000', INK);
  const tileH = SEAM_W; // the band's short side becomes the seam's width
  const tileW = Math.round((40 / 17) * tileH);
  const tile = await sharp(Buffer.from(svg)).resize(tileW, tileH).png().toBuffer();

  const runs = Math.ceil(H / tileW) + 1;
  const strip = await sharp({
    create: { width: tileW * runs, height: tileH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(Array.from({ length: runs }, (_, i) => ({ input: tile, left: i * tileW, top: 0 })))
    .png()
    .toBuffer();

  return sharp(strip).rotate(90).extract({ left: 0, top: 0, width: tileH, height: H }).png().toBuffer();
}

const SEAM = await seam();

/** A soft paper-to-nothing wash over the panel's left edge, so the photograph
 *  arrives rather than starts. */
const wash = Buffer.from(
  `<svg width="${PANEL_W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1">
     <stop offset="0" stop-color="${PAPER}" stop-opacity="0.7"/>
     <stop offset="0.22" stop-color="${PAPER}" stop-opacity="0"/>
   </linearGradient></defs><rect width="${PANEL_W}" height="${H}" fill="url(#g)"/></svg>`,
);

/* ----------------------------------------------------------------- card --- */

/**
 * @param {{ kicker: string, title: string, footer: string }} copy
 */
async function card({ kicker, title, footer }) {
  const kickerImg = await draw({ text: kicker, font: 'JetBrains Mono', file: MONO, size: 22, color: ACCENT });
  const footerImg = await draw({ text: footer, font: 'JetBrains Mono', file: MONO, size: 20, color: MUTED, width: COL_W });

  const kickerH = (await sharp(kickerImg).metadata()).height;
  const footerH = (await sharp(footerImg).metadata()).height;

  const TOP = 74;
  const BOTTOM = H - 74 - footerH;
  const titleBox = BOTTOM - (TOP + kickerH) - 96;
  const { buf: titleImg, height: titleH } = await fitTitle(title, titleBox);

  /* The title sits on the optical centre of the space it has, not flush to the
     top of it: a two line title and a four line title should look equally
     settled on the page. */
  const titleTop = TOP + kickerH + 44 + Math.round((titleBox - titleH) / 2);

  return sharp({ create: { width: W, height: H, channels: 4, background: PAPER } })
    .composite([
      { input: panel, left: PANEL_X, top: 0 },
      { input: wash, left: PANEL_X, top: 0 },
      { input: SEAM, left: PANEL_X - SEAM_W, top: 0 },
      { input: kickerImg, left: PAD, top: TOP },
      { input: titleImg, left: PAD, top: titleTop },
      { input: footerImg, left: PAD, top: BOTTOM },
    ])
    .jpeg({ quality: 76, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
}

/* ---------------------------------------------------------------- pages --- */

/** Read the posts straight off disk; astro:content is not available here. */
async function posts() {
  const out = [];
  for (const file of await readdir(POSTS)) {
    if (!file.endsWith('.md')) continue;
    const raw = await readFile(`${POSTS}/${file}`, 'utf8');
    const head = raw.split(/^---$/m)[1] ?? '';
    const field = (name) => head.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    const unquote = (v) => (v ? v.replace(/^["']|["']$/g, '').replace(/\\"/g, '"') : v);
    if (field('draft') === 'true') continue;
    out.push({
      lang: unquote(field('lang')),
      key: unquote(field('translationKey')),
      title: unquote(field('title')),
    });
  }
  return out;
}

await mkdir(OUT, { recursive: true });

const jobs = [];

for (const t of Object.values(dictionaries)) {
  const site = 'dimhold.by';

  jobs.push({
    name: `home-${t.lang}`,
    copy: { kicker: site, title: 'Dmitriy Semenkevich', footer: t.hero.role },
  });

  jobs.push({
    name: `blog-${t.lang}`,
    copy: { kicker: `${site}/blog`, title: t.blog.label, footer: t.blog.description },
  });

  jobs.push({
    name: `projects-${t.lang}`,
    copy: { kicker: `${site}/projects`, title: t.projects.label, footer: t.projects.lede },
  });
}

for (const post of await posts()) {
  const t = dictionaries[post.lang];
  jobs.push({
    name: `post-${post.key}-${post.lang}`,
    copy: { kicker: 'dimhold.by', title: post.title, footer: t.blog.label },
  });
}

let bytes = 0;
for (const job of jobs) {
  const buf = await card(job.copy);
  await writeFile(`${OUT}/${job.name}.jpg`, buf);
  bytes += buf.length;
}

/* The fallback, for any page that has no card of its own. */
await writeFile('public/og.jpg', await card({
  kicker: 'dimhold.by',
  title: 'Dmitriy Semenkevich',
  footer: dictionaries.en.hero.role,
}));

console.log(`${jobs.length} cards + og.jpg — ${Math.round(bytes / jobs.length / 1024)} kB each, ${Math.round(bytes / 1024)} kB total`);
