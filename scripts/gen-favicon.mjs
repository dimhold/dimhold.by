/* Cuts the site's icons out of src/assets/favicon-source.png, as a round mark.
 *
 * The source is the figurine's head with its background already removed and
 * the contrast lifted, trimmed to a square with the head centred in it and
 * held at 512 — every icon here is 180 or smaller, so anything larger is
 * megabytes the repository would carry for nothing.
 *
 * The head is dropped onto a disc of the deep accent blue. That is what makes
 * the mark survive 16 pixels: cap, skin and hair are all warm mid-tones, so
 * against beige they turn to porridge, and against blue the silhouette holds.
 * The circle is not decoration either — a square beige tile is one more square
 * beige tile in a strip of favicons; a disc has an outline of its own.
 *
 * Run: npm run favicon
 */
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'src/assets/favicon-source.png';
const OUT = 'public';

/** ICO sizes. 48 is there for Google Search, which asks for it by name. */
const ICO_SIZES = [16, 32, 48];

/** --accent-deep from the light theme. */
const BLUE = { r: 29, g: 90, b: 168, alpha: 1 };

/* The head is a render with soft gradients, so a palette would band the cheek.
   Keep it truecolour and pay for it in encoder effort instead — the high
   setting is what takes the 180 from 70 kB down to under 20. */
const SQUEEZE = { compressionLevel: 9, effort: 10 };

/** A full-bleed disc, used as an alpha stencil. */
const disc = (n) =>
  Buffer.from(`<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`);

/* Downscaling softens every edge that carries the likeness — the cap's brim,
   the line of the jaw. A touch of sharpening at the small sizes puts that back;
   the large ones do not need it and look brittle with it. */
const onBlue = async (size, inset = 1) => {
  const head = Math.round(size * inset);
  const pad = Math.round((size - head) / 2);
  const scaled = await sharp(SOURCE).resize(head, head, { kernel: 'lanczos3' }).png().toBuffer();
  const tile = sharp({ create: { width: size, height: size, channels: 4, background: BLUE } }).composite([
    { input: scaled, left: pad, top: pad },
  ]);
  return (size <= 48 ? tile.sharpen({ sigma: 0.6 }) : tile).png(SQUEEZE).toBuffer();
};

/* Masking happens last, after the resize, so the rim of the disc is
   antialiased at its final size instead of being resampled into a staircase. */
const round = async (size) =>
  sharp(await onBlue(size))
    .composite([{ input: disc(size), blend: 'dest-in' }])
    .png(SQUEEZE)
    .toBuffer();

/** Wrap PNGs in an ICO container. Vista and every current browser read
 *  PNG-compressed entries, which is far smaller than the old BMP form. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const DIR_ENTRY = 16;
  let offset = header.length + images.length * DIR_ENTRY;

  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(DIR_ENTRY);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size — none, it is truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const icoImages = await Promise.all(ICO_SIZES.map(async (size) => ({ size, data: await round(size) })));

await Promise.all([
  writeFile(`${OUT}/favicon.ico`, ico(icoImages)),
  // The 32 is what a modern browser actually paints in the tab.
  writeFile(`${OUT}/favicon.png`, await round(32)),
  // iOS clips this into a rounded square of its own and reads transparency as
  // black, so it gets the blue full bleed rather than a disc floating on it —
  // and the head pulled in a little, because nothing else trims the corners
  // here the way the disc does in the tab.
  writeFile(`${OUT}/apple-touch-icon.png`, await onBlue(180, 0.86)),
]);

console.log(`favicon.ico (${ICO_SIZES.join('/')}), favicon.png, apple-touch-icon.png`);
