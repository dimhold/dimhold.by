/* Builds the walk animation prototype: one self-contained HTML file with both
 * tracks, both faces and the whole player inlined.
 *
 * It reads the ANONYMISED tracks, never the raw ones, so the artefact is safe
 * to open anywhere and safe to commit. Coordinates are converted to metres on a
 * local plane before they go in: over six kilometres the curvature of the earth
 * is worth less than a pixel, and metres are what the reader actually wants to
 * think in.
 *
 * Run: npm run walk
 */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const IN = 'data/tracks-anon';
const OUT = 'prototypes/walk.html';

/** Which file is whose, matched on the timestamp in the filename. */
const WHO = {
  '20260820-185351': { key: 'mitya', label: 'Мітя', colour: '#2f7cd6' },
  '20260820-184647': { key: 'zoom', label: 'Зум', colour: '#c9762f' },
};

/** Face crops for the two markers, cut from the pictures already in the repo. */
const FACES = {
  mitya: { file: 'src/assets/favicon-source.png', crop: { left: 120, top: 80, width: 1064, height: 1064 } },
  zoom: { file: 'src/assets/hero-figurine.png', crop: { left: 775, top: 325, width: 325, height: 325 } },
};

/* The interesting part of the walk, in seconds from the moment both loggers
   were running. Before this Zoom was walking to heel on command and the two
   tracks are the same line; after it he was back on heel again. The middle is
   the only part where there is anything to compare.

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
    const slice = values.slice(Math.max(0, i - half), Math.min(values.length, i + half + 1)).sort((a, b) => a - b);
    return slice[slice.length >> 1];
  });
}

/** A circular marker: the face, masked to a disc, as a data URI. */
async function face(spec, size = 128) {
  const disc = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const buf = await sharp(spec.file)
    .extract(spec.crop)
    .resize(size, size, { kernel: 'lanczos3' })
    .composite([{ input: disc, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
}

const files = (await readdir(IN)).filter((f) => f.endsWith('.gpx'));
const raw = {};
for (const f of files) {
  const stamp = f.slice(0, 15);
  const who = WHO[stamp];
  if (!who) throw new Error(`unrecognised track: ${f}`);
  raw[who.key] = { ...who, pts: parse(await readFile(`${IN}/${f}`, 'utf8')) };
}

/* The two loggers started six minutes apart. The player runs on one clock, and
   the honest one is the window both were recording — outside it, a marker would
   be standing still for reasons that have nothing to do with the walk. */
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
  const eRaw = [];
  let dist = 0;
  const d = [];
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

  tracks[key] = { label: t.label, colour: t.colour, x, y, s, d, e, v, face: await face(FACES[key]) };
}

const data = { seconds: Math.round((to - from) / 1000), tracks };

const template = await readFile('scripts/walk-template.html', 'utf8');
const html = template.replace('__DATA__', JSON.stringify(data));

await mkdir('prototypes', { recursive: true });
await writeFile(OUT, html);
console.log(
  `window ${WINDOW.from}-${WINDOW.to}s of ${Math.round((bothTo - bothFrom) / 1000)}s recorded together`,
);
console.log(
  `${OUT} — ${data.seconds}s, ` +
    Object.keys(tracks).map((k) => `${k} ${tracks[k].x.length} pts`).join(', ') +
    `, ${(html.length / 1024).toFixed(0)} KB`,
);
