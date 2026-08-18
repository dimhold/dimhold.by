/* The tear-off calendar.

   The page is static, so the sheets are built with the build date. Here they
   are corrected to the visitor's own today — otherwise a site deployed on
   Tuesday would insist it is Tuesday forever.

   The tear itself waits until the calendar is actually on screen: a page
   ripping off above the fold is a page nobody saw ripping. */

import { sheetFor } from '../lib/words.js';

type Lang = 'en' | 'ru' | 'be';

async function dress(leaf: HTMLElement, at: Date, lang: Lang) {
  const sheet = await sheetFor(at);
  const set = (sel: string, value: string) => {
    const el = leaf.querySelector<HTMLElement>(sel);
    if (el) el.textContent = value;
  };
  set('[data-leaf-date]', String(sheet.date));
  set('[data-leaf-month]', sheet.month);
  set('[data-leaf-weekday]', sheet.weekday);
  set('[data-leaf-word]', sheet.entry.w);
  set('[data-leaf-gloss]', sheet.entry[lang] ?? sheet.entry.en);
}

export async function mountLeafpad(pad: HTMLElement) {
  const past = pad.querySelector<HTMLElement>('[data-leaf="past"]');
  const now = pad.querySelector<HTMLElement>('[data-leaf="today"]');
  if (!past || !now) return;

  const lang = (document.documentElement.lang as Lang) || 'en';
  const at = new Date();
  // Both sheets first, so the pad never shows tomorrow's date beside yesterday's word.
  await Promise.all([dress(now, at, lang), dress(past, new Date(at.getTime() - 864e5), lang)]);

  let torn = false;
  const tear = () => {
    if (torn) return;
    torn = true;
    past.classList.add('is-torn');
    // Once it has fallen, take it out of the flow entirely.
    setTimeout(() => (past.hidden = true), 1400);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        io.disconnect();
        setTimeout(tear, 350);
      }
    },
    { threshold: 0.6 },
  );
  io.observe(pad);
}
