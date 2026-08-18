/* A note for whoever opens the console.

   Anyone who presses F12 on a personal site is a colleague, so they get the
   day's vyshyvanka woven in text — the very same chart the page background is
   masked from — and a few warm words in Belarusian.

   There is no reliable way to be told the console was opened; every trick for
   it is a hack that misfires. So the note is simply printed at load and waits
   there for whoever comes looking. */

import { chart, today, weaveFor } from '../lib/ornament.js';

const INK = '#a8825a';
const ACCENT = '#2f7cd6';

/** Today's tile, drawn in blocks. Two columns per cell, so it comes out square. */
function woven(): string {
  const p = weaveFor(today());
  const cells = chart(p);
  const rows: string[] = [];
  for (let y = 0; y < p.n; y++) {
    let line = '';
    for (let x = 0; x < p.n; x++) line += cells.has(`${x},${y}`) ? '██' : '  ';
    rows.push(line.replace(/\s+$/, ''));
  }
  // The motif rarely fills its tile to the edge; drop the blank rows around it.
  while (rows.length && !rows[0]) rows.shift();
  while (rows.length && !rows[rows.length - 1]) rows.pop();
  return rows.join('\n');
}

const LETTER = `Прывітанне, калега.

Калі вы адкрылі кансоль — значыць, вам цікава, як яно зроблена ўнутры.
Заходзьце глыбей, тут няма ад чаго хавацца.

Узор вышэй — сённяшняя вышыванка. Ён вытканы з сённяшняй даты,
учора быў іншы і заўтра будзе іншы. Тым жа малюнкам пракладзены фон
старонкі, на якой вы зараз стаіце.

Ніякага фрэймворка на старонцы: статычныя файлы, крыху CSS
і няшмат гадзін, укладзеных з любоўю.

Знойдзеце памылку, захочаце параду ці проста пагаварыць пра рамяство —
пішыце: dimhold@gmail.com

Добрага дня і чыстых зборак.`;

export function greetTheCurious() {
  try {
    console.log(`%c${woven()}`, `color:${INK};font-size:9px;line-height:0.9;letter-spacing:-1.5px`);
    console.log(`%c${LETTER}`, `color:${ACCENT};font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace`);
  } catch {
    /* a console that cannot be written to is no reason to break the page */
  }
}
