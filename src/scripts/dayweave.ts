/* Hangs today's ornament on the page.

   The beige itself is set before first paint by the boot script in the head —
   that one is inline because a colour shift after paint would be visible. The
   ornament can wait a beat: it sits at 7% opacity behind everything, so
   swapping the default weave for today's is imperceptible. */

import { bandSvg, cssUrl, tileSvg, today, weaveFor } from '../lib/ornament.js';

export function weaveToday(root: HTMLElement = document.documentElement) {
  // The boot script already worked out the day; fall back if it did not run.
  const day = Number(root.dataset.day) || today();
  const p = weaveFor(day);

  root.style.setProperty('--ornament', cssUrl(tileSvg(p)));
  root.style.setProperty('--ornament-band', cssUrl(bandSvg(p)));
  root.style.setProperty('--ornament-size', `${p.scale}px`);
}

weaveToday();
