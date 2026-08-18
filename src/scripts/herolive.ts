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

export function mountLive(stage: HTMLElement, { clips, minGap = 14000, maxGap = 26000 }: Options) {
  if (clips.length === 0) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Respect data-saver and metered connections — the still is the whole story anyway.
  const conn = (navigator as any).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return;

  const video = document.createElement('video');
  video.className = 'stage-live';
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.preload = 'none';
  // A quarter slower than Midjourney rendered it — the figurine should stir,
  // not fidget.
  video.playbackRate = 0.75;
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  stage.append(video);

  let last = -1;
  let timer: Timer | null = null;
  let playing = false;
  let visible = true;

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const schedule = (delay = rand(minGap, maxGap)) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(wake, delay);
  };

  const settle = () => {
    playing = false;
    video.classList.remove('is-live');
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
    video.playbackRate = 0.75;
    const started = video.play();
    started?.catch(() => {
      // Autoplay refused (rare for muted inline video) — stay a photograph.
      playing = false;
      video.removeAttribute('src');
    });
  }

  video.addEventListener('playing', () => video.classList.add('is-live'));
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

  // Poke it and it wakes up now.
  stage.addEventListener('click', () => {
    if (!playing) wake();
  });
  if (matchMedia('(pointer: fine)').matches) {
    stage.addEventListener('pointerenter', () => {
      if (!playing) schedule(400);
    });
  }

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
}
