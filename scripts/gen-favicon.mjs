/* Cuts the site's icons out of the portrait in data/me.png, as a round mark.
 *
 * The portrait is a rendered figurine, not a photograph of a face, which is
 * why it survives the trip down to 16 pixels: the cap is one solid shape, the
 * profile is one silhouette against a pale ground, and both read even when
 * every feature inside them has dissolved.
 *
 * The circle is not decoration. A square icon of a head sits in the tab strip
 * as a beige block among other beige blocks; a disc has an outline of its own
 * and is picked out of a row of favicons at a glance.
 *
 * Run: npm run favicon
 */
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'data/me.png';
const OUT = 'public';

/* The square that holds the whole head — cap crown to collar, and far enough
   right that the nose clears the edge of the circle rather than grazing it.
   Measured against the 237×213 source, not guessed. */
const CROP = { left: 32, top: 2, width: 200, height: 200 };

/** ICO sizes. 48 is there for Google Search, which asks for it by name. */
const ICO_SIZES = [16, 32, 48];

/** The paper colour behind the light theme. iOS paints its own square under an
 *  apple-touch-icon and reads transparency as black, so that one gets a ground. */
const PAPER = { r: 242, g: 235, b: 224, alpha: 1 };

/* The portrait is a render with soft gradients, so a palette would band the
   cheek. Keep it truecolour and pay for it in encoder effort instead — the
   high setting is what takes the 180 from 70 kB down to 19. */
const SQUEEZE = { compressionLevel: 9, effort: 10 };

/** A full-bleed disc, used as an alpha stencil. */
const disc = (n) =>
  Buffer.from(`<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`);

/* Downscaling softens every edge that carries the likeness — the cap's brim,
   the line of the jaw. A touch of sharpening at the small sizes puts that back;
   the large ones do not need it and look brittle with it. Masking happens last,
   after the resize, so the rim of the disc is antialiased at its final size
   instead of being resampled into a staircase. */
const round = (size) => {
  const cut = sharp(SOURCE).extract(CROP).resize(size, size, { kernel: 'lanczos3' });
  const sharpened = size <= 48 ? cut.sharpen({ sigma: 0.6 }) : cut;
  return sharpened
    .composite([{ input: disc(size), blend: 'dest-in' }])
    .png(SQUEEZE)
    .toBuffer();
};

/** Same disc, dropped onto the paper colour instead of onto nothing. */
const onPaper = async (size) =>
  sharp({ create: { width: size, height: size, channels: 4, background: PAPER } })
    .composite([{ input: await round(size) }])
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
  writeFile(`${OUT}/apple-touch-icon.png`, await onPaper(180)),
]);

console.log(`favicon.ico (${ICO_SIZES.join('/')}), favicon.png, apple-touch-icon.png`);
