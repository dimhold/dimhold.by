import { mountToy } from './goalseek';

interface Daily {
  seed: string;
  artifact: number;
  accent: string;
  deep: string;
  wash: string;
  phase: 'morning' | 'day' | 'evening' | 'night';
}

const FALLBACK: Daily = {
  seed: 'fallback',
  artifact: 0,
  accent: '#e96d45',
  deep: '#b84a28',
  wash: '#fdeae2',
  phase: 'day',
};

export function initSite() {
  const daily: Daily = (window as any).__daily ?? FALLBACK;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // — captions: artifact of the day + seed line —
  const artifactEl = document.querySelector<HTMLElement>('[data-artifact-name]');
  if (artifactEl) {
    try {
      const names: string[] = JSON.parse(artifactEl.dataset.artifactNames ?? '[]');
      artifactEl.textContent = names[daily.artifact] ?? '';
    } catch {
      /* keep empty */
    }
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-seed]')) {
    el.textContent = daily.seed;
  }
  const tomorrowLink = document.querySelector<HTMLAnchorElement>('[data-seed-tomorrow]');
  if (tomorrowLink && /^\d{4}-\d{2}-\d{2}$/.test(daily.seed)) {
    const d = new Date(daily.seed + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    const pad = (n: number) => String(n).padStart(2, '0');
    const next = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    tomorrowLink.href = `?seed=${next}`;
    tomorrowLink.addEventListener('click', () => {
      (window as any).posthog?.capture('seed_traveled', { to: next });
    });
  }

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

  // — 3D hero (lazy; falls back to the photo) —
  const sceneEl = document.querySelector<HTMLElement>('[data-scene]');
  const fallback = document.querySelector<HTMLElement>('[data-scene-fallback]');
  if (sceneEl) {
    import('./hero3d')
      .then((m) =>
        m.mountHero(sceneEl, {
          accent: daily.accent,
          deep: daily.deep,
          phase: daily.phase,
          artifact: daily.artifact,
          reduced,
        }),
      )
      .then(() => {
        fallback?.remove();
      })
      .catch(() => {
        sceneEl.remove();
        fallback?.removeAttribute('hidden');
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
