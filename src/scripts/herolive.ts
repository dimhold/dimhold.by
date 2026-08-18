/* The hero is a still photograph of the figurine that occasionally comes alive.
   Every clip is a boomerang encoded from this exact frame — it starts and ends
   on the still, so the video can appear and vanish without a visible seam. */

interface Options {
  /** Clip URLs, in no particular order; the same one never plays twice in a row. */
  clips: string[];
  /** Idle gap between clips, in ms. */
  minGap?: number;
  maxGap?: number;
}

type Timer = ReturnType<typeof setTimeout>;

const RATE = 0.6;

export interface Live {
  /** Settle the picture now and stop waking it — someone is reading. */
  hold(): void;
  /** Let it come alive again. */
  release(): void;
}

const INERT: Live = { hold() {}, release() {} };

export function mountLive(
  stage: HTMLElement,
  { clips, minGap = 14000, maxGap = 26000 }: Options,
): Live {
  if (clips.length === 0) return INERT;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return INERT;

  // Respect data-saver and metered connections — the still is the whole story anyway.
  const conn = (navigator as any).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return INERT;

  const video = document.createElement('video');
  video.className = 'stage-live';
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = 'none';
  /* Well under half the speed Midjourney rendered it at. The clips are
     stop-motion and stutter by nature; slowed this far the stutter reads as
     deliberate, like a figurine drawing breath.

     defaultPlaybackRate matters as much as playbackRate: every load() — ours
     when a clip is released, and the implicit one when src changes — resets
     playbackRate back to the default. Leaving the default at 1 silently
     undoes the slowdown. */
  video.defaultPlaybackRate = RATE;
  video.playbackRate = RATE;
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  stage.append(video);

  /* How long the beam takes to land — just past halfway through its flight, the
     rest is the trail letting go. The clip starts on impact, so the two read as
     one event: something arrived and the figurine moved. */
  const STRIKE_MS = 780;
  const spark = stage.parentElement?.querySelector<HTMLElement>('[data-spark]') ?? null;

  let last = -1;
  let timer: Timer | null = null;
  let playing = false;
  let visible = true;
  let held = false;

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const schedule = (delay = rand(minGap, maxGap)) => {
    if (timer) clearTimeout(timer);
    if (held) return;
    timer = setTimeout(wake, delay);
  };

  const settle = () => {
    playing = false;
    video.classList.remove('is-live');
    // The ring leaves a beat after the picture settles, so it reads as flying
    // off rather than being switched off.
    setTimeout(() => {
      if (!playing) stage.classList.remove('is-magic');
    }, 260);
    // Hold the last frame until the fade finishes, then release the decoder.
    setTimeout(() => {
      if (!playing) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    }, 700);
    schedule();
  };

  function wake() {
    if (held) return;
    if (playing || !visible || document.hidden) {
      schedule(6000);
      return;
    }
    let next = Math.floor(Math.random() * clips.length);
    if (clips.length > 1 && next === last) next = (next + 1) % clips.length;
    last = next;

    playing = true;
    video.src = clips[next];
    video.currentTime = 0;
    video.playbackRate = RATE;
    video.load(); // buffer while the beam is still in flight

    strike();
    setTimeout(() => {
      if (!playing) return; // held, hidden or scrolled away mid-flight
      video.playbackRate = RATE; // the load above reset it; set it again
      const started = video.play();
      started?.catch(() => {
        // Autoplay refused (rare for muted inline video) — stay a photograph.
        playing = false;
        video.removeAttribute('src');
      });
    }, STRIKE_MS);
  }

  function strike() {
    if (!spark) return;
    /* A fresh direction and landing spot every time. The angle is kept between
       -85 and -5 degrees, which is exactly the arc that puts the tail out past
       the left edge or below the picture — the two directions with room for a
       long approach. Anything else would have the beam start on top of the
       text, or inside the frame it is supposed to fly into. */
    spark.style.setProperty('--beam-a', `${Math.round(rand(-85, -5))}deg`);
    spark.style.setProperty('--beam-x', `${rand(41, 56).toFixed(1)}%`);
    spark.style.setProperty('--beam-y', `${rand(34, 50).toFixed(1)}%`);
    spark.classList.remove('is-striking');
    void spark.offsetWidth; // rewind, so a second wake replays the flight
    spark.classList.add('is-striking');
    setTimeout(() => spark.classList.remove('is-striking'), 2100);
  }

  video.addEventListener('playing', () => {
    video.classList.add('is-live');
    stage.classList.add('is-magic');
  });
  video.addEventListener('ended', settle);
  video.addEventListener('error', settle);

  // Only run while the hero is on screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (!visible && playing) {
        video.pause();
        settle();
      }
    },
    { threshold: 0.25 },
  );
  io.observe(stage);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) {
      video.pause();
      settle();
    }
  });

  /* Poke it and it wakes up now — unless the poke landed on one of the marks,
     which have a story to tell instead. Hovering deliberately does nothing: it
     used to start a clip, which meant the picture began moving exactly while
     someone was aiming at a mark. */
  stage.addEventListener('click', (e) => {
    if ((e.target as Element | null)?.closest('[data-spot]')) return;
    if (!playing) wake();
  });
  const live: Live = {
    hold() {
      held = true;
      if (timer) clearTimeout(timer);
      if (playing) {
        video.pause();
        settle();
      }
    },
    release() {
      held = false;
      schedule(rand(5000, 9000));
    },
  };

  // Warm the first clip once the page is quiet, so the first wake is instant.
  const warm = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'video';
    link.href = clips[0];
    document.head.append(link);
  };
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(warm, { timeout: 4000 });
  else setTimeout(warm, 2500);

  schedule(rand(4000, 7000));
  return live;
}
