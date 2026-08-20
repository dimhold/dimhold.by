/* Turns the two anonymised tracks into what the page actually loads:
 * `public/data/walk.json` plus the two round portraits.
 *
 * It reads the ANONYMISED tracks, never the raw ones, and converts them to
 * metres on a local plane before writing. Over six kilometres the curvature of
 * the earth is worth less than a pixel, and metres are what a reader thinks in.
 *
 * Run: npm run walk
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const IN = 'data/tracks-anon';
const OUT_JSON = 'public/data/walk.json';
const OUT_IMG = 'public/walk';

/** Which file is whose, matched on the timestamp in the filename. */
const WHO = {
  '20260820-185351': { key: 'mitya', colour: '#2f7cd6' },
  '20260820-184647': { key: 'zoom', colour: '#c9762f' },
};

/* Both portraits face right, which reads as heading somewhere — the reason they
   beat a crop out of the hero picture, where the dog sits still. */
const FACES = {
  mitya: { file: 'data/me.png', crop: { left: 22, top: 4, width: 206, height: 206 } },
  zoom: { file: 'data/zoom.png', crop: { left: 62, top: 18, width: 214, height: 214 } },
};

/* The interesting part of the walk, in seconds from the moment both loggers
   were running. Before this Zoom was walking to heel on command and the two
   tracks are the same line; after it he was back on heel again.

   The end is not guessed: the sixty-second mean separation holds around 30 m at
   62:00, decays through 12 m at 62:33 and settles at 2-5 m from 63:03 to the
   finish. The recall happened inside that minute. */
const WINDOW = { from: 451, to: 3770 };

const R = 6371008.8;
const rad = (d) => (d * Math.PI) / 180;

function parse(xml) {
  const re = /<trkpt lat="([-\d.]+)" lon="([-\d.]+)">(?:<ele>([-\d.]+)<\/ele>)?<time>([^<]+)<\/time>/g;
  const pts = [];
  for (const m of xml.matchAll(re)) {
    pts.push({ lat: +m[1], lon: +m[2], ele: m[3] === undefined ? null : +m[3], t: Date.parse(m[4]) });
  }
  return pts;
}

/* Raw GNSS altitude wanders by several metres while standing still — the
   vertical fix is always the weak one. A short median filter kills the spikes
   without inventing terrain that was not there. */
function medianFilter(values, win) {
  const half = win >> 1;
  return values.map((_, i) => {
    const slice = values
      .slice(Math.max(0, i - half), Math.min(values.length, i + half + 1))
      .sort((a, b) => a - b);
    return slice[slice.length >> 1];
  });
}

/** The portrait, masked to a disc. */
async function face(spec, out, size = 160) {
  const disc = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  await sharp(spec.file)
    .extract(spec.crop)
    .resize(size, size, { kernel: 'lanczos3' })
    .composite([{ input: disc, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toFile(out);
}

const files = (await readdir(IN)).filter((f) => f.endsWith('.gpx'));
const raw = {};
for (const f of files) {
  const who = WHO[f.slice(0, 15)];
  if (!who) throw new Error(`unrecognised track: ${f}`);
  raw[who.key] = { ...who, pts: parse(await readFile(`${IN}/${f}`, 'utf8')) };
}

const bothFrom = Math.max(...Object.values(raw).map((t) => t.pts[0].t));
const bothTo = Math.min(...Object.values(raw).map((t) => t.pts.at(-1).t));
const from = bothFrom + WINDOW.from * 1000;
const to = Math.min(bothTo, bothFrom + WINDOW.to * 1000);

/* Local plane, anchored on the first shared moment. Metres east and north. */
const anchor = raw.mitya.pts.find((p) => p.t >= from);
const mPerLat = (Math.PI * R) / 180;
const mPerLon = mPerLat * Math.cos(rad(anchor.lat));

const tracks = {};
for (const [key, t] of Object.entries(raw)) {
  const pts = t.pts.filter((p) => p.t >= from && p.t <= to);
  const x = [];
  const y = [];
  const s = [];
  const d = [];
  const eRaw = [];
  let dist = 0;
  for (let i = 0; i < pts.length; i++) {
    eRaw.push(pts[i].ele ?? eRaw[i - 1] ?? 0);
    const px = (pts[i].lon - anchor.lon) * mPerLon;
    const py = (pts[i].lat - anchor.lat) * mPerLat;
    if (i > 0) dist += Math.hypot(px - x[i - 1], py - y[i - 1]);
    x.push(+px.toFixed(1));
    y.push(+py.toFixed(1));
    s.push(Math.round((pts[i].t - from) / 1000));
    d.push(Math.round(dist));
  }
  const e = medianFilter(eRaw, 15).map((v) => +v.toFixed(1));

  /* Speed from the distance already accumulated, over a five-second window.
     Per-second GPS speed is mostly jitter — a walker standing still reads two
     or three km/h — and five seconds is short enough to still catch a sprint. */
  const HALF = 2;
  const v = d.map((_, i) => {
    const a = Math.max(0, i - HALF);
    const b = Math.min(d.length - 1, i + HALF);
    const dt = s[b] - s[a];
    return dt > 0 ? +(((d[b] - d[a]) / dt) * 3.6).toFixed(2) : 0;
  });

  await mkdir(OUT_IMG, { recursive: true });
  await face(FACES[key], `${OUT_IMG}/${key}.png`);
  tracks[key] = { colour: t.colour, face: `/walk/${key}.png`, x, y, s, d, e, v };
}

await mkdir('public/data', { recursive: true });
await writeFile(OUT_JSON, JSON.stringify({ seconds: Math.round((to - from) / 1000), tracks }));

const bytes = (await readFile(OUT_JSON)).length;
console.log(
  `${OUT_JSON} — ${Math.round((to - from) / 1000)}s, ` +
    Object.keys(tracks)
      .map((k) => `${k} ${tracks[k].x.length} pts`)
      .join(', ') +
    `, ${(bytes / 1024).toFixed(0)} KB`,
);
console.log(`window ${WINDOW.from}-${WINDOW.to}s of ${Math.round((bothTo - bothFrom) / 1000)}s recorded together`);
