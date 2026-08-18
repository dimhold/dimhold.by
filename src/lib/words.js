/* A Belarusian word for every day of the year.

   The words live in twelve chunks under ./words, one per month, and a chunk is
   fetched only when the calendar actually shows that month — about 4 kB
   instead of the 76 kB the whole year weighs. Vite sees the static prefix in
   the import below and splits the files accordingly.

   The word is keyed to the calendar date, not to a running counter, so a real
   tear-off calendar's promise holds: the same date always bears the same word,
   this year and next. */

const cache = new Map();

/** @param {number} month 1–12 */
export async function loadMonth(month) {
  const mm = String(month).padStart(2, '0');
  if (!cache.has(mm)) {
    cache.set(
      mm,
      import(`./words/${mm}.js`).then((m) => m.default),
    );
  }
  return cache.get(mm);
}

/** The entry for a date. Months are stored 31 deep, so short months just stop early. */
export function pick(entries, dayOfMonth) {
  return entries[(dayOfMonth - 1) % entries.length];
}

/** Everything a sheet needs, for one date. */
export async function sheetFor(at) {
  const entries = await loadMonth(at.getMonth() + 1);
  return {
    date: at.getDate(),
    month: MONTHS_BE[at.getMonth()],
    weekday: WEEKDAYS_BE[at.getDay()],
    entry: pick(entries, at.getDate()),
  };
}

/** Genitive, the form a date takes: «19 жніўня». */
export const MONTHS_BE = [
  'студзеня',
  'лютага',
  'сакавіка',
  'красавіка',
  'мая',
  'чэрвеня',
  'ліпеня',
  'жніўня',
  'верасня',
  'кастрычніка',
  'лістапада',
  'снежня',
];

/** Sunday first, to match Date.getDay(). */
export const WEEKDAYS_BE = [
  'нядзеля',
  'панядзелак',
  'аўторак',
  'серада',
  'чацвер',
  'пятніца',
  'субота',
];
