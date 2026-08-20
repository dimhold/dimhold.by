/* Shows the cookie notice, but only to someone who has not answered it.
 *
 * The banner is in the HTML from the start and hidden with `hidden`, so there
 * is no layout shift and no flash — revealing it is one attribute change. */
import { setConsent, storedChoice } from './analytics';

export function initConsent() {
  const bar = document.querySelector<HTMLElement>('[data-consent]');
  if (!bar) return;

  const close = () => {
    bar.classList.remove('in');
    // let the slide-out finish before it leaves the accessibility tree
    setTimeout(() => (bar.hidden = true), 240);
  };

  for (const b of bar.querySelectorAll<HTMLButtonElement>('[data-consent-set]')) {
    b.addEventListener('click', () => {
      setConsent(b.dataset.consentSet === 'granted' ? 'granted' : 'denied');
      close();
    });
  }

  if (storedChoice() !== null) return;

  bar.hidden = false;
  // one frame with `hidden` gone, so the transition has a start state to run from
  requestAnimationFrame(() => bar.classList.add('in'));
}
