/* The three marks on the hero picture. Tapping one unrolls a strip of linen
   under the photograph, with a thread still running up to the mark it came
   from. One note is open at a time.

   The recording on each note is optional: the button stays hidden until the
   file has actually answered, so dropping the real takes in — or leaving them
   out — needs no change here. */

import { track } from './analytics';

const AUDIO_HIDDEN = 'hidden';

interface Hooks {
  /** Called when a note opens, so the picture can settle while it is read. */
  onOpen?(key: string): void;
  onClose?(): void;
}

export function mountSpots(scene: HTMLElement, hooks: Hooks = {}) {
  const spots = [...scene.querySelectorAll<HTMLButtonElement>('[data-spot]')];
  const notes = new Map<string, HTMLElement>();
  for (const note of scene.querySelectorAll<HTMLElement>('[data-note]')) {
    notes.set(note.dataset.note!, note);
  }
  if (spots.length === 0 || notes.size === 0) return;

  const stage = scene.querySelector<HTMLElement>('.stage');
  const players = new Map<string, HTMLAudioElement>();
  let open: string | null = null;
  let playing: HTMLAudioElement | null = null;
  let hovering = false;

  const stopAudio = () => {
    playing?.pause();
    if (playing) playing.currentTime = 0;
    playing = null;
    for (const note of notes.values()) {
      note.querySelector('[data-audio]')?.classList.remove('is-playing');
    }
  };

  function close(key: string) {
    const note = notes.get(key);
    const spot = spots.find((s) => s.dataset.spot === key);
    if (!note) return;
    note.classList.remove('is-open');
    spot?.setAttribute('aria-expanded', 'false');
    stage?.classList.remove('marks-open');
    stopAudio();
    hooks.onClose?.();
    const done = () => {
      if (!note.classList.contains('is-open')) note.hidden = true;
    };
    note.addEventListener('transitionend', done, { once: true });
    // In case the transition never fires (reduced motion, hidden tab).
    setTimeout(done, 600);
  }

  function show(key: string) {
    const note = notes.get(key);
    const spot = spots.find((s) => s.dataset.spot === key);
    if (!note || !spot) return;
    note.hidden = false;
    spot.setAttribute('aria-expanded', 'true');
    // Flush layout so the unroll has a start value to animate from. A rAF
    // would do it too, but rAF never fires in a background tab and the note
    // would stay invisible.
    void note.offsetHeight;
    note.classList.add('is-open');
    // While one is open, keep all three up so the reader can move between them.
    stage?.classList.add('marks-open');
    armAudio(key, note);
    hooks.onOpen?.(key);
    track('hero_spot_opened', { spot: key });
  }

  function toggle(key: string) {
    if (open === key) {
      close(key);
      open = null;
      return;
    }
    if (open) close(open);
    open = key;
    show(key);
  }

  /** Ask the recording whether it exists; reveal the button only if it does. */
  function armAudio(key: string, note: HTMLElement) {
    if (players.has(key)) return;
    const button = note.querySelector<HTMLButtonElement>('[data-audio]');
    const src = button?.dataset.audio;
    if (!button || !src) return;

    const audio = new Audio(src);
    audio.preload = 'metadata';
    players.set(key, audio);

    audio.addEventListener('loadedmetadata', () => button.removeAttribute(AUDIO_HIDDEN), { once: true });
    audio.addEventListener('error', () => button.setAttribute(AUDIO_HIDDEN, ''), { once: true });
    audio.addEventListener('ended', () => {
      button.classList.remove('is-playing');
      playing = null;
    });

    button.addEventListener('click', () => {
      if (playing === audio) {
        stopAudio();
        return;
      }
      stopAudio();
      playing = audio;
      button.classList.add('is-playing');
      track('hero_audio_played', { spot: key });
      audio.play().catch(() => {
        button.classList.remove('is-playing');
        playing = null;
      });
    });
  }

  for (const spot of spots) {
    spot.addEventListener('click', (e) => {
      // The picture itself wakes the figurine; a mark must not.
      e.stopPropagation();
      toggle(spot.dataset.spot!);
    });
  }

  for (const note of notes.values()) {
    note.querySelector('[data-note-close]')?.addEventListener('click', () => {
      if (open) {
        close(open);
        const spot = spots.find((s) => s.dataset.spot === open);
        open = null;
        spot?.focus();
      }
    });
  }

  /* The marks blink into view for a moment now and then. It is the only hint a
     touch screen gets — there is no hover there — and on a mouse it is a nudge
     for anyone who never wanders onto the picture. Skipped when it would be
     pointless or rude: tab in the background, pointer already on the picture,
     or a note being read. */
  if (stage) {
    const BLINK_EVERY = 30000;

    stage.addEventListener('pointerenter', () => (hovering = true));
    stage.addEventListener('pointerleave', () => (hovering = false));

    const blink = () => {
      if (document.hidden || hovering || open) return;
      stage.classList.add('marks-lit');
      setTimeout(() => stage.classList.remove('marks-lit'), 1800);
    };

    setTimeout(blink, 2600); // one early hint, so the marks are discoverable
    setInterval(blink, BLINK_EVERY);

    // A page opened in a background tab would miss that first hint entirely,
    // since a blink nobody can see is skipped. Offer it again on return.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) setTimeout(blink, 1500);
    });

    // No hover on a touch screen: a tap on the picture brings them up.
    if (!matchMedia('(hover: hover)').matches) {
      stage.addEventListener('click', (e) => {
        if (!(e.target as Element | null)?.closest('[data-spot]')) blink();
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      const key = open;
      close(key);
      open = null;
      spots.find((s) => s.dataset.spot === key)?.focus();
    }
  });
}
