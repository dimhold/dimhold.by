/* The single door to Google Analytics.
 *
 * Nothing else in the codebase names `gtag` or `dataLayer`. That is the point:
 * if the analytics vendor ever changes again — and it already changed once,
 * from PostHog — only this file has to move.
 *
 * `track` is deliberately forgiving. In dev there is no tag on the page, and a
 * missing `gtag` must never be the thing that breaks a click handler. */

type Params = Record<string, string | number | boolean | undefined>;

/** The visitor's stored answer to the banner. `null` means they have not answered. */
export type Choice = 'granted' | 'denied' | null;

export const CONSENT_KEY = 'consent-analytics';

/** Six months, then we ask again — long enough not to nag, short enough to be a
 *  real re-ask rather than a permanent assumption. */
const CONSENT_TTL = 182 * 864e5;

/* gtag.js reads the raw `arguments` object off the queue, so this pushes
   `arguments` rather than a rest array — the two are not interchangeable to it. */
function gtag(..._args: unknown[]) {
  const dl = ((window as any).dataLayer ??= []);
  // eslint-disable-next-line prefer-rest-params
  dl.push(arguments);
}

/** Read the stored choice, treating an expired one as never asked. */
export function storedChoice(): Choice {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { v, at } = JSON.parse(raw);
    if (!at || Date.now() - at > CONSENT_TTL) return null;
    return v === 'granted' ? 'granted' : 'denied';
  } catch {
    return null;
  }
}

/** Record the visitor's answer and tell the tag about it in the same breath. */
export function setConsent(v: Exclude<Choice, null>) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, at: Date.now() }));
  } catch {
    /* private mode — the choice holds for this page view only */
  }
  gtag('consent', 'update', {
    analytics_storage: v,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/** Send an event. Silent and harmless when no tag is present. */
export function track(name: string, params: Params = {}) {
  gtag('event', name, params);
}
