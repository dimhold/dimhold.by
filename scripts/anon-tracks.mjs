/* Moves the walk out of Belarus and into the middle of the Pacific.
 *
 * The point is to keep the walk and lose the address. Every shape, every
 * distance, every doubling-back stays exactly as recorded; only the patch of
 * planet it sits on changes, to a place with nothing on it for two thousand
 * kilometres in any direction.
 *
 * How the translation keeps distances honest: a degree of latitude is very
 * nearly a constant 111 km everywhere, so latitude offsets carry over one for
 * one. A degree of longitude is not — it shrinks with the cosine of latitude.
 * Moving from 54°N to the equator would stretch every east-west metre by
 * 1 / cos 54° ≈ 1.7, so longitude offsets are scaled by that same cosine on the
 * way out. Over six kilometres the residual error is a few centimetres.
 *
 * Both tracks are translated by ONE shared offset, taken from the first track's
 * first point. Anonymising them separately would move them relative to each
 * other and destroy the only thing the comparison is about.
 *
 * Run: npm run tracks
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

const IN = 'data/tracks';
const OUT = 'data/tracks-anon';

/** Point Nemo's neighbourhood: the emptiest water there is. */
const TARGET = { lat: -34.0, lon: -140.0 };

const rad = (d) => (d * Math.PI) / 180;
const R = 6371008.8;

function haversine(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const PT = /lat="([-\d.]+)" lon="([-\d.]+)"/;

const files = (await readdir(IN)).filter((f) => extname(f).toLowerCase() === '.gpx').sort();
if (!files.length) throw new Error(`no .gpx under ${IN}`);

/* The anchor comes from the earliest file so a re-run is reproducible and both
   tracks always land in the same place. */
const anchorXml = await readFile(`${IN}/${files[0]}`, 'utf8');
const anchorMatch = anchorXml.match(PT);
const ORIGIN = { lat: +anchorMatch[1], lon: +anchorMatch[2] };
const lonScale = Math.cos(rad(ORIGIN.lat)) / Math.cos(rad(TARGET.lat));

const move = (lat, lon) => ({
  lat: TARGET.lat + (lat - ORIGIN.lat),
  lon: TARGET.lon + (lon - ORIGIN.lon) * lonScale,
});

await mkdir(OUT, { recursive: true });

/* Altitude is a location too. Three hundred metres above sea level rules out
   most of the planet, and combined with the shape of a walk it is a real clue.
   Both files are rebased on the LOWEST point either of them touched, so the
   lowest step of the walk becomes zero and every height is read as "above the
   bottom of this wood". One shared floor, or the two tracks would stop being
   comparable to each other — which is the whole point of having two. */
const parsed = {};
let floor = Infinity;
for (const file of files) {
  const xml = await readFile(`${IN}/${file}`, 'utf8');
  parsed[file] = xml;
  for (const m of xml.matchAll(/<ele>([-\d.]+)<\/ele>/g)) floor = Math.min(floor, +m[1]);
}

for (const file of files) {
  const xml = parsed[file];
  const before = [];
  const after = [];

  let out = xml.replace(/lat="([-\d.]+)" lon="([-\d.]+)"/g, (_, la, lo) => {
    const src = { lat: +la, lon: +lo };
    const dst = move(src.lat, src.lon);
    before.push(src);
    after.push(dst);
    return `lat="${dst.lat.toFixed(8)}" lon="${dst.lon.toFixed(8)}"`;
  });

  out = out.replace(/<ele>([-\d.]+)<\/ele>/g, (_, e) => `<ele>${(+e - floor).toFixed(3)}</ele>`);

  /* The header's <bounds> spells out the corners of the walk in attributes of
     its own — minlat/minlon/maxlat/maxlon — which the trackpoint pattern above
     never sees. Rather than write a second pattern that could drift out of step
     with the first, the box is recomputed from the points that were actually
     written. It cannot disagree with them. */
  const lats = after.map((p) => p.lat);
  const lons = after.map((p) => p.lon);
  const box =
    `<bounds minlat="${Math.min(...lats).toFixed(8)}" minlon="${Math.min(...lons).toFixed(8)}"` +
    ` maxlat="${Math.max(...lats).toFixed(8)}" maxlon="${Math.max(...lons).toFixed(8)}" />`;
  out = out.replace(/<bounds[^>]*\/>/, box);

  /* The generator's own header comments quote the distance, the compass bearing
     and the altitude gap of the real walk. Distance and bearing survive the
     translation unchanged and are fine; the altitudes no longer match the file,
     so the note says what happened rather than leaving a stale number. */
  out = out.replace(
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<!-- Anonymised. Every point is translated by a single constant offset into\n' +
      '     the South Pacific, and every elevation is rebased so that the lowest\n' +
      '     point of the walk reads zero. Shape, distances, climb and timing are\n' +
      '     unchanged; neither the place nor the height above sea level can be\n' +
      '     recovered from this file. -->',
  );

  // Check the translation preserved the walk rather than merely moving it.
  let dBefore = 0;
  let dAfter = 0;
  for (let i = 1; i < before.length; i++) {
    dBefore += haversine(before[i - 1], before[i]);
    dAfter += haversine(after[i - 1], after[i]);
  }

  await writeFile(`${OUT}/${file}`, out);
  console.log(
    `${file}: ${before.length} pts, ${(dBefore / 1000).toFixed(3)} km -> ${(dAfter / 1000).toFixed(3)} km` +
      ` (drift ${((dAfter - dBefore) * 100).toFixed(1)} cm over the whole track)`,
  );
}

console.log(`\nanchor ${ORIGIN.lat.toFixed(5)}, ${ORIGIN.lon.toFixed(5)} -> ${TARGET.lat}, ${TARGET.lon}`);
console.log(`longitude offsets scaled by ${lonScale.toFixed(6)}`);
console.log(`elevations rebased on ${floor.toFixed(1)} m, the lowest point of the two walks`);
