import { mountToy } from './goalseek';

export function initSite() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // — the lamp —
  const lamp = document.querySelector<HTMLButtonElement>('[data-lamp]');
  lamp?.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.dataset.mode === 'night' ? 'day' : 'night';
    html.dataset.mode = next;
    try {
      localStorage.setItem('lamp', next);
    } catch {
      /* private mode */
    }
    (window as any).posthog?.capture('lamp_toggled', { to: next });
  });

  // — reveals —
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.18 },
  );
  for (const el of document.querySelectorAll('.reveal')) io.observe(el);

  // the signature is fully clip-path-hidden, which also hides it from
  // IntersectionObserver — so watch its parent instead
  const mask = document.querySelector('.reveal-mask');
  if (mask?.parentElement) {
    const mio = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          mask.classList.add('in');
          mio.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    mio.observe(mask.parentElement);
  }

  // — magnetic hover —
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    for (const el of document.querySelectorAll<HTMLElement>('[data-magnet]')) {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transform = `translate(${dx * 5}px, ${dy * 5}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 380);
      });
    }
  }

  // — the hero photograph, which now and then comes alive —
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  const clips = (stage?.dataset.clips ?? '').split(',').filter(Boolean);
  if (stage && clips.length && !reduced) {
    import('./herolive')
      .then((m) => m.mountLive(stage, { clips }))
      .catch(() => {
        /* the still is the fallback, and it is already on screen */
      });
  }

  // — goal-seek toy —
  for (const el of document.querySelectorAll<HTMLElement>('[data-toy]')) {
    mountToy(el, {
      locale: el.dataset.locale ?? 'en-US',
      monthsLabel: el.dataset.months ?? 'mo',
    });
  }
}

initSite();
