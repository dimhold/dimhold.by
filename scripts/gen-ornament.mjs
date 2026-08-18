/* Writes the no-JS fallback ornaments into public/.
   Run with `npm run ornament`. The day-to-day variants are generated in the
   browser from the same module; these two files are what a visitor without
   JavaScript sees. */
import { writeFileSync } from 'node:fs';
import { bandSvg, tileSvg, weaveFor } from '../src/lib/ornament.js';

// A fixed seed, so the committed fallback is reproducible and reviewable.
const p = weaveFor(534);

writeFileSync('public/ornament-star.svg', tileSvg(p));
writeFileSync('public/ornament-band.svg', bandSvg(p));
console.log('ornament: tile n=%d scale=%dpx, filler=%s, hooks=%d', p.n, p.scale, p.filler, p.hook);
