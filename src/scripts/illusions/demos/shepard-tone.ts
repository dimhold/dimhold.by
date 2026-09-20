/* Тон Шепарда.
   Семь синусоид, разнесённых ровно по октавам. Все вместе они едут вверх, но громкость
   каждой задана неподвижной колоколообразной кривой по логарифму частоты: верхняя гаснет
   ровно тогда, когда снизу вступает новая. Хрома движется, общая высота стоит на месте.
   Спектр рядом рисуется из тех же чисел, которыми управляются генераторы, — это не
   картинка «по мотивам», а тот же массив. */
import { surface } from '../canvas';

const VOICES = 7;
const FMIN = 55; // ля субконтроктавы

export default function mount(root: HTMLElement) {
  const chart = root.querySelector<HTMLCanvasElement>('[data-chart]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-btn="play"]')!;
  const readout = root.querySelector<HTMLElement>('[data-readout]')!;
  const speedEl = root.querySelector<HTMLInputElement>('[data-slider="speed"]')!;
  const widthEl = root.querySelector<HTMLInputElement>('[data-slider="width"]')!;
  const downEl = root.querySelector<HTMLInputElement>('[data-slider="down"]')!;

  let ctx: AudioContext | null = null;
  let voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  let chroma = 0;
  let last = 0;
  let raf = 0;
  /* Текущие громкости — их же рисует спектр. */
  const level = new Array(VOICES).fill(0);
  const freq = new Array(VOICES).fill(0);

  const view = surface(
    chart,
    ({ ctx: c, w, h }) => {
      c.fillStyle = '#f7f5f0';
      c.fillRect(0, 0, w, h);

      const pad = 18;
      c.strokeStyle = '#d9d6cf';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(pad, h - 16);
      c.lineTo(w - pad, h - 16);
      c.stroke();

      for (let i = 0; i < VOICES; i++) {
        if (!freq[i]) continue;
        /* Положение по оси — логарифм частоты: октавы должны стоять равномерно. */
        const octave = Math.log2(freq[i] / FMIN) / VOICES;
        const x = pad + octave * (w - pad * 2);
        const bh = level[i] * (h - 30);
        c.fillStyle = `rgba(210, 72, 63, ${0.25 + level[i] * 0.75})`;
        c.fillRect(x - 4, h - 16 - bh, 8, bh);
      }

      c.fillStyle = '#6b6b70';
      c.font = '11px system-ui, sans-serif';
      c.fillText('низ', pad - 6, h - 3);
      const hi = 'верх';
      c.fillText(hi, w - pad - c.measureText(hi).width + 6, h - 3);
    },
    { ratio: 0.2 },
  );

  /* Колокол в логарифмических координатах. Ширина — ручка: узкий колокол слышно как
     скачок между октавами, широкий размывает хрому и иллюзия слабеет. */
  const bell = (pos: number, width: number) => {
    const d = (pos - 0.5) / width;
    return Math.exp(-0.5 * d * d);
  };

  function tick(now: number) {
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    const dir = downEl.checked ? -1 : 1;
    chroma = (chroma + dir * dt * Number(speedEl.value) + VOICES) % VOICES;

    const width = Number(widthEl.value) / 100;
    let sum = 0;
    for (let i = 0; i < VOICES; i++) {
      const octave = (chroma + i) % VOICES;
      freq[i] = FMIN * 2 ** octave;
      level[i] = bell(octave / (VOICES - 1), width);
      sum += level[i];
    }
    /* Сумма громкостей держится постоянной — иначе слышно, как круг замыкается. */
    for (let i = 0; i < VOICES; i++) {
      level[i] = sum ? level[i] / sum : 0;
      if (voices[i]) {
        voices[i].osc.frequency.setTargetAtTime(freq[i], ctx!.currentTime, 0.01);
        voices[i].gain.gain.setTargetAtTime(level[i] * 0.5, ctx!.currentTime, 0.02);
      }
    }

    view.draw();
    raf = requestAnimationFrame(tick);
  }

  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    for (const v of voices) {
      v.gain.gain.setTargetAtTime(0, ctx!.currentTime, 0.05);
      v.osc.stop(ctx!.currentTime + 0.3);
    }
    voices = [];
    ctx?.close();
    ctx = null;
    playBtn.textContent = 'играть';
    playBtn.setAttribute('aria-pressed', 'false');
    readout.textContent = 'остановлено.';
  };

  const start = () => {
    ctx = new AudioContext();
    const out = ctx.createGain();
    out.gain.value = 0.28;
    out.connect(ctx.destination);

    voices = Array.from({ length: VOICES }, () => {
      const osc = ctx!.createOscillator();
      osc.type = 'sine';
      const gain = ctx!.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(out);
      osc.start();
      return { osc, gain };
    });

    playBtn.textContent = 'стоп';
    playBtn.setAttribute('aria-pressed', 'true');
    readout.textContent = 'гамма идёт вверх и через круг возвращается туда же. Следите за спектром: верхняя полоска гаснет ровно там, где снизу вступает новая.';
    raf = requestAnimationFrame(tick);
  };

  playBtn.addEventListener('click', () => (ctx ? stop() : start()));
  /* Уходя со страницы, звук уносим с собой. */
  window.addEventListener('pagehide', () => ctx && stop());
  downEl.addEventListener('change', () => {
    if (ctx) readout.textContent = downEl.checked ? 'теперь вниз — и тоже бесконечно.' : 'снова вверх.';
  });
}
