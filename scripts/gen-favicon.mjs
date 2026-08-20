/* Cuts the site's icons out of the flat portrait in src/assets/favicon-source.png.
 *
 * The source is drawn for this job rather than lifted from the hero photograph.
 * A photograph loses at 16 pixels no matter how it is cropped — the face turns
 * to porridge and only a beige smudge survives. Four flat colours and a strong
 * silhouette survive, so the mark stays the same mark at every size.
 *
 * Run: npm run favicon
 */
import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'src/assets/favicon-source.png';
const OUT = 'public';

/* The artwork is drawn with a wide margin. This is the square that holds the
   head with about 6% of air around it — measured from the ink's bounding box,
   not guessed, and centred on the head rather than on the canvas. */
const CROP = { left: 120, top: 80, width: 1064, height: 1064 };

/** ICO sizes. 48 is there for Google Search, which asks for it by name. */
const ICO_SIZES = [16, 32, 48];

const cut = () => sharp(SOURCE).extract(CROP);

/* Downscaling flat art softens every edge that carries the likeness — the cap's
   brim, the line of the jaw. A touch of sharpening at the small sizes puts that
   back; the large ones do not need it and look brittle with it. */
const shrink = (size) => {
  const img = cut().resize(size, size, { kernel: 'lanczos3' });
  return size <= 48 ? img.sharpen({ sigma: 0.6 }) : img;
};

/* Palette-quantised: the artwork is four flat colours plus anti-aliasing, so a
   palette costs nothing in quality and roughly a fifth of the bytes. */
const SQUEEZE = { compressionLevel: 9, palette: true, quality: 92 };

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

const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await shrink(size).png({ compressionLevel: 9 }).toBuffer() })),
);

await Promise.all([
  writeFile(`${OUT}/favicon.ico`, ico(icoImages)),
  // The 32 is what a modern browser actually paints in the tab.
  shrink(32).png(SQUEEZE).toFile(`${OUT}/favicon.png`),
  shrink(180).png(SQUEEZE).toFile(`${OUT}/apple-touch-icon.png`),
]);

console.log(`favicon.ico (${ICO_SIZES.join('/')}), favicon.png, apple-touch-icon.png`);
