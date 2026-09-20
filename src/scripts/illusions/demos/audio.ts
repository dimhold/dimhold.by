/* Звук. Всё здесь строится на Web Audio и требует жеста мыши для запуска: браузеры не
   дают включать звук самостоятельно, и это правильно. Где нужны наушники, Demo.astro
   пишет об этом сам. */
import { demo, MARK, PAPER, rnd, type Mount } from '../kit';

/* Один звуковой контекст на демонстрацию, закрывается при уходе со страницы. */
class Audio {
  ctx: AudioContext | null = null;
  out: GainNode | null = null;
  open(vol = 0.25) {
    if (this.ctx) return this.ctx;
    this.ctx = new AudioContext();
    this.out = this.ctx.createGain();
    this.out.gain.value = vol;
    this.out.connect(this.ctx.destination);
    window.addEventListener('pagehide', () => this.close(), { once: true });
    return this.ctx;
  }
  close() {
    this.ctx?.close();
    this.ctx = null;
    this.out = null;
  }
  get on() { return !!this.ctx; }
}

const VOICES = 7;
const FMIN = 55;

/* Общий генератор тона Шепарда: шагами или непрерывным скольжением. */
const shepardBank = (glide: boolean): Mount =>
  demo((k) => {
    const a = new Audio();
    let voices: { osc: OscillatorNode; gain: GainNode }[] = [];
    let chroma = 0, raf = 0, last = 0;
    const level = new Array(VOICES).fill(0);
    const freq = new Array(VOICES).fill(0);
    const view = k.chart(({ ctx, w, h }) => {
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, w, h);
      const pad = 18;
      ctx.strokeStyle = '#d9d6cf';
      ctx.beginPath();
      ctx.moveTo(pad, h - 16);
      ctx.lineTo(w - pad, h - 16);
      ctx.stroke();
      for (let i = 0; i < VOICES; i++) {
        if (!freq[i]) continue;
        const octave = Math.log2(freq[i] / FMIN) / VOICES;
        const x = pad + octave * (w - pad * 2);
        const bh = level[i] * (h - 30);
        ctx.fillStyle = `rgba(210, 72, 63, ${0.25 + level[i] * 0.75})`;
        ctx.fillRect(x - 4, h - 16 - bh, 8, bh);
      }
      ctx.fillStyle = '#6b6b70';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('низ', pad - 6, h - 3);
      ctx.fillText('верх', w - pad - 20, h - 3);
    });
    /* Колокол в логарифмических координатах: хрома едет, общая высота стоит. */
    const bell = (pos: number, width: number) => {
      const d = (pos - 0.5) / width;
      return Math.exp(-0.5 * d * d);
    };
    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const dir = k.bool('down') ? -1 : 1;
      const cont = glide || k.bool('glide');
      const speed = k.num('speed') / 100;
      chroma = (chroma + dir * dt * speed * (cont ? 1 : 1) + VOICES) % VOICES;
      const width = k.num('width') / 100 || 0.28;
      let sum = 0;
      for (let i = 0; i < VOICES; i++) {
        const octave = (chroma + i) % VOICES;
        freq[i] = FMIN * 2 ** (cont ? octave : Math.round(octave * 12) / 12);
        level[i] = bell(octave / (VOICES - 1), width);
        sum += level[i];
      }
      for (let i = 0; i < VOICES; i++) {
        level[i] = sum ? level[i] / sum : 0;
        if (voices[i] && a.ctx) {
          voices[i].osc.frequency.setTargetAtTime(freq[i], a.ctx.currentTime, 0.01);
          voices[i].gain.gain.setTargetAtTime(level[i] * 0.5, a.ctx.currentTime, 0.02);
        }
      }
      view.draw();
      raf = requestAnimationFrame(tick);
    };
    k.button('play', (el) => {
      if (a.on) {
        cancelAnimationFrame(raf);
        raf = 0; last = 0;
        for (const v of voices) { v.gain.gain.setTargetAtTime(0, a.ctx!.currentTime, 0.05); v.osc.stop(a.ctx!.currentTime + 0.3); }
        voices = [];
        a.close();
        el.textContent = 'играть';
        k.say('остановлено.');
        return;
      }
      const ctx = a.open(0.28);
      voices = Array.from({ length: VOICES }, () => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const gain = ctx.createGain();
        gain.gain.value = 0;
        osc.connect(gain).connect(a.out!);
        osc.start();
        return { osc, gain };
      });
      el.textContent = 'стоп';
      k.say('следите за спектром: верхняя полоска гаснет ровно там, где снизу вступает новая.');
      raf = requestAnimationFrame(tick);
    });
  });

export const shepardTone = shepardBank(false);

export const rissetRhythm: Mount = demo((k) => {
  const a = new Audio();
  let raf = 0, phase = 0, last = 0;
  const LAYERS = 5;
  const level = new Array(LAYERS).fill(0);
  const next = new Array(LAYERS).fill(0);
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const bw = w / LAYERS;
    ctx.fillStyle = MARK;
    level.forEach((v, i) => ctx.fillRect(i * bw + 8, h - 6 - v * (h - 12), bw - 16, v * (h - 12)));
  });
  const click = (when: number, gain: number, freq: number) => {
    const ctx = a.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(freq, when);
    g.gain.setValueAtTime(gain * 0.5, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    osc.connect(g).connect(a.out!);
    osc.start(when);
    osc.stop(when + 0.07);
  };
  const tick = (now: number) => {
    const dt = last ? (now - last) / 1000 : 0;
    last = now;
    const dir = k.bool('down') ? -1 : 1;
    phase = (phase + dir * dt * (k.num('rate') / 60) + 1) % 1;
    const ctx = a.ctx!;
    /* Слои в темпах, кратных двойке, вводятся и выводятся под неподвижной огибающей:
       хрома темпа едет, сам темп стоит. */
    for (let i = 0; i < LAYERS; i++) {
      const pos = (i + phase) % LAYERS;
      level[i] = Math.exp(-0.5 * ((pos - LAYERS / 2) / 1.2) ** 2);
      const bpm = 60 * 2 ** pos;
      const period = 60 / bpm;
      while (next[i] < ctx.currentTime + 0.25) {
        if (next[i] < ctx.currentTime) next[i] = ctx.currentTime + 0.05;
        click(next[i], level[i], 300 + i * 220);
        next[i] += period;
      }
    }
    view.draw();
    raf = requestAnimationFrame(tick);
  };
  k.button('play', (el) => {
    if (a.on) { cancelAnimationFrame(raf); raf = 0; last = 0; a.close(); el.textContent = 'играть'; return; }
    a.open(0.3);
    next.fill(a.ctx!.currentTime + 0.1);
    el.textContent = 'стоп';
    k.say('доля разгоняется без конца. Расписание считается наперёд по часам звукового движка, иначе на загруженной странице всё рассыпается.');
    raf = requestAnimationFrame(tick);
  });
});

/* Тон с двенадцатью составляющими по октавам: чистая хрома без общей высоты. */
const chromaTone = (ctx: AudioContext, out: GainNode, chroma: number, when: number, dur: number) => {
  for (let o = 2; o <= 6; o++) {
    const f = 55 * 2 ** (o + chroma / 12);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = f;
    const pos = (Math.log2(f / 55) - 2) / 4;
    const amp = Math.exp(-0.5 * ((pos - 0.5) / 0.3) ** 2) * 0.18;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(amp, when + 0.02);
    g.gain.setValueAtTime(amp, when + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, when + dur);
    osc.connect(g).connect(out);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }
};

export const pitchCircularity: Mount = demo((k) => {
  const a = new Audio();
  let step = 0;
  const answers: boolean[] = [];
  const stage = k.stage;
  k.button('play', () => {
    const ctx = a.open(0.3);
    const c1 = (step * 4) % 12;
    const c2 = (c1 + 4) % 12;
    const t = ctx.currentTime + 0.05;
    chromaTone(ctx, a.out!, c1, t, 0.5);
    chromaTone(ctx, a.out!, c2, t + 0.6, 0.5);
    stage.innerHTML = '<p class="ill-q">второй тон выше или ниже первого?</p>';
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, up] of [['выше', true], ['ниже', false]] as const) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = label;
      b.onclick = () => {
        answers.push(up);
        step++;
        stage.innerHTML = '';
        if (step >= 3) {
          const ups = answers.filter(Boolean).length;
          k.say(ups === answers.length
            ? `${answers.length} раза подряд «выше» — и через три шага по четыре полутона вы вернулись в исходную ноту. Ваши собственные ответы образуют кольцо: «выше» перестало быть отношением порядка.`
            : 'ответы разошлись — так тоже бывает, окно у этого стимула узкое. Попробуйте ещё круг.');
          if (step >= 3) { step = 0; answers.length = 0; }
        } else k.say(`${step} из 3. Жмите дальше.`);
      };
      row.append(b);
    }
    stage.append(row);
  });
});

export const tritoneParadox: Mount = demo((k) => {
  const a = new Audio();
  let base = 0;
  const votes: (1 | -1 | 0)[] = new Array(12).fill(0);
  const stage = k.stage;
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38;
    ctx.strokeStyle = '#c9ccd4';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    /* Ваш собственный круг названий нот: где он повёрнут, там и граница «выше». */
    votes.forEach((v, i) => {
      if (!v) return;
      const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = v > 0 ? MARK : '#3b6fd0';
      ctx.beginPath();
      ctx.arc(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('красное — «вверх», синее — «вниз»', 6, 14);
  });
  k.button('play', () => {
    const ctx = a.open(0.3);
    const t = ctx.currentTime + 0.05;
    chromaTone(ctx, a.out!, base, t, 0.5);
    chromaTone(ctx, a.out!, (base + 6) % 12, t + 0.6, 0.5);
    stage.innerHTML = '<p class="ill-q">пара пошла вверх или вниз?</p>';
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, v] of [['вверх', 1], ['вниз', -1]] as const) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = label;
      b.onclick = () => {
        votes[base] = v;
        base = (base + 1) % 12;
        chart.draw();
        stage.innerHTML = '';
        const done = votes.filter(Boolean).length;
        k.say(done < 12
          ? `${done} из 12. Круг внизу — ваш.`
          : 'круг заполнен. У кого-то он повёрнут ровно наоборот — и это зависит от языка и говора, на которых человек вырос.');
      };
      row.append(b);
    }
    stage.append(row);
  });
});

export const octaveIllusion: Mount = demo((k) => {
  const a = new Audio();
  let swap = false, timer = 0;
  const play = () => {
    const ctx = a.ctx!;
    let t = ctx.currentTime + 0.1;
    for (let i = 0; i < 16; i++) {
      const highLeft = (i % 2 === 0) !== swap;
      for (const [freq, pan] of [[800, highLeft ? -1 : 1], [400, highLeft ? 1 : -1]] as const) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const p = ctx.createStereoPanner();
        osc.frequency.value = freq;
        p.pan.value = pan;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.25, t + 0.01);
        g.gain.setValueAtTime(0.25, t + 0.22);
        g.gain.linearRampToValueAtTime(0, t + 0.25);
        osc.connect(g).connect(p).connect(a.out!);
        osc.start(t);
        osc.stop(t + 0.26);
      }
      t += 0.25;
    }
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    a.open(0.3);
    play();
    timer = window.setInterval(play, 4000);
    el.textContent = 'стоп';
    k.say('большинство слышит один тон, скачущий из уха в ухо, и высота при этом чередуется.');
  });
  k.button('swap', () => {
    swap = !swap;
    k.say('каналы поменяны местами. Большинство слушателей не слышит никакой разницы — и вот это самое поразительное.');
  });
  k.button('check', () => {
    const ctx = a.open(0.3);
    let t = ctx.currentTime + 0.1;
    for (const pan of [-1, 1]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      osc.frequency.value = pan < 0 ? 440 : 660;
      p.pan.value = pan;
      g.gain.setValueAtTime(0.25, t);
      g.gain.setValueAtTime(0, t + 0.6);
      osc.connect(g).connect(p).connect(a.out!);
      osc.start(t);
      osc.stop(t + 0.62);
      t += 0.7;
    }
    k.say('сначала низкий тон слева, потом высокий справа. Если слышно иначе — наушники надеты наоборот.');
  });
});

export const scaleIllusion: Mount = demo((k) => {
  const a = new Audio();
  let ear = 'both', timer = 0;
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12];
  const play = () => {
    const ctx = a.ctx!;
    let t = ctx.currentTime + 0.1;
    /* Восходящая и нисходящая гаммы чередуются по ушам нота за нотой. */
    for (let i = 0; i < SCALE.length; i++) {
      const up = 261.63 * 2 ** (SCALE[i] / 12);
      const down = 261.63 * 2 ** (SCALE[SCALE.length - 1 - i] / 12);
      const pairs: [number, number][] = i % 2 === 0 ? [[up, -1], [down, 1]] : [[down, -1], [up, 1]];
      for (const [f, pan] of pairs) {
        if (ear === 'left' && pan > 0) continue;
        if (ear === 'right' && pan < 0) continue;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const p = ctx.createStereoPanner();
        osc.frequency.value = f;
        p.pan.value = pan;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.01);
        g.gain.setValueAtTime(0.22, t + 0.22);
        g.gain.linearRampToValueAtTime(0, t + 0.25);
        osc.connect(g).connect(p).connect(a.out!);
        osc.start(t);
        osc.stop(t + 0.26);
      }
      t += 0.26;
    }
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    a.open(0.3);
    play();
    timer = window.setInterval(play, 2400);
    el.textContent = 'стоп';
  });
  k.select('ear', (v) => {
    ear = v;
    k.say(v === 'both'
      ? 'слышно две ровные мелодии, каждая чисто из своего уха.'
      : 'в одиночку этот канал даёт рваную скачущую последовательность — ровно ту, что там и записана. Она прямо противоречит тому, что вы только что слышали двумя ушами.');
  });
});

export const glissandoIllusion: Mount = demo((k) => {
  const a = new Audio();
  let ear = 'both', timer = 0;
  const play = () => {
    const ctx = a.ctx!;
    const t = ctx.currentTime + 0.05;
    /* Ровный тон и скольжение группируются в два потока и локализуются порознь. */
    for (let i = 0; i < 8; i++) {
      const pan = i % 2 ? 1 : -1;
      if ((ear === 'left' && pan > 0) || (ear === 'right' && pan < 0)) continue;
      const when = t + i * 0.5;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      osc.type = 'sawtooth';
      osc.frequency.value = 330;
      p.pan.value = pan;
      g.gain.setValueAtTime(0.12, when);
      g.gain.setValueAtTime(0, when + 0.45);
      osc.connect(g).connect(p).connect(a.out!);
      osc.start(when);
      osc.stop(when + 0.47);
      const gl = ctx.createOscillator();
      const gg = ctx.createGain();
      const gp = ctx.createStereoPanner();
      gl.frequency.setValueAtTime(220 + i * 40, when);
      gl.frequency.linearRampToValueAtTime(220 + (i + 1) * 40, when + 0.45);
      gp.pan.value = -pan;
      gg.gain.setValueAtTime(0.1, when);
      gg.gain.setValueAtTime(0, when + 0.45);
      gl.connect(gg).connect(gp).connect(a.out!);
      gl.start(when);
      gl.stop(when + 0.47);
    }
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    a.open(0.3);
    play();
    timer = window.setInterval(play, 4200);
    el.textContent = 'стоп';
  });
  k.select('ear', (v) => { ear = v; });
});

export const precedenceEffect: Mount = demo((k) => {
  const a = new Audio();
  let timer = 0;
  const burst = () => {
    const ctx = a.ctx!;
    const t = ctx.currentTime + 0.05;
    const delay = k.num('delay') / 1000;
    const gain = k.num('gain') / 100;
    for (const [pan, when, amp] of [[-1, t, 1], [1, t + delay, gain]] as const) {
      const buf = ctx.createBuffer(1, 220, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = amp * 0.6;
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      src.connect(g).connect(p).connect(a.out!);
      src.start(when);
    }
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    a.open(0.4);
    burst();
    timer = window.setInterval(burst, 700);
    el.textContent = 'стоп';
  });
  k.slider('delay', (v) => {
    k.say(v < 2 ? 'обе копии почти одновременны — звук в середине головы.'
      : v < 35 ? `задержка ${v} мс: звук целиком слева, откуда пришёл первым, — даже если правая копия громче.`
      : 'за порогом эха звук распадается на два.');
  });
  k.slider('gain', () => {});
});

export const binauralBeats: Mount = demo((k) => {
  const a = new Audio();
  let oscs: OscillatorNode[] = [];
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const diff = k.num('diff');
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 2;
      const y = h / 2 - Math.cos(Math.PI * 2 * diff * t) * (h * 0.36);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(`${diff} биений в секунду`, 6, 14);
  });
  const start = () => {
    const ctx = a.open(0.2);
    const diff = k.num('diff');
    const acoustic = k.bool('acoustic');
    oscs = [220, 220 + diff].map((f, i) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      const p = ctx.createStereoPanner();
      /* Бинауральные биения рождаются в бинауральном сравнении и требуют наушников;
         обычные складываются в воздухе и работают на динамиках. */
      p.pan.value = acoustic ? 0 : i ? 1 : -1;
      osc.connect(p).connect(a.out!);
      osc.start();
      return osc;
    });
  };
  k.button('play', (el) => {
    if (a.on) { for (const o of oscs) o.stop(); a.close(); el.textContent = 'играть'; return; }
    start();
    el.textContent = 'стоп';
  });
  const restart = () => { if (a.on) { for (const o of oscs) o.stop(); a.close(); start(); } view.draw(); };
  k.slider('diff', restart);
  k.check('acoustic', (v) => {
    restart();
    k.say(v ? 'обычные акустические биения: они в воздухе и слышны на динамиках.' : 'бинауральные: в каждом ухе по чистому тону, а биение возникает в голове.');
  });
});

export const missingFundamental: Mount = demo((k) => {
  const a = new Audio();
  let oscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  const F0 = 160;
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = MARK;
    for (let i = 1; i <= 8; i++) {
      const off = (i === 1 && k.bool('f1')) || (i === 2 && k.bool('f2')) || (i === 3 && k.bool('f3'));
      const x = 20 + ((i - 1) / 8) * (w - 40);
      const bh = off ? 0 : (h - 24) / i;
      ctx.globalAlpha = off ? 0.15 : 1;
      ctx.fillRect(x - 5, h - 14 - bh, 10, Math.max(bh, 2));
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(`основная ${F0} Гц`, 6, 14);
  });
  const rebuild = () => {
    if (!a.on) return;
    for (const o of oscs) o.osc.stop();
    const ctx = a.ctx!;
    oscs = [];
    for (let i = 1; i <= 8; i++) {
      const off = (i === 1 && k.bool('f1')) || (i === 2 && k.bool('f2')) || (i === 3 && k.bool('f3'));
      if (off) continue;
      const osc = ctx.createOscillator();
      osc.frequency.value = F0 * i;
      const g = ctx.createGain();
      g.gain.value = 0.18 / i;
      osc.connect(g).connect(a.out!);
      osc.start();
      oscs.push({ osc, gain: g });
    }
  };
  k.button('play', (el) => {
    if (a.on) { for (const o of oscs) o.osc.stop(); a.close(); el.textContent = 'играть'; return; }
    a.open(0.3);
    rebuild();
    el.textContent = 'стоп';
    k.say('выключите основную галочкой — и высота не дрогнет.');
  });
  for (const n of ['f1', 'f2', 'f3']) k.check(n, () => { rebuild(); view.draw(); });
});

export const tartiniTone: Mount = demo((k) => {
  const a = new Audio();
  let oscs: OscillatorNode[] = [];
  const rebuild = () => {
    if (!a.on) return;
    for (const o of oscs) o.stop();
    const ctx = a.ctx!;
    oscs = [k.num('f1'), k.num('f2')].map((f) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(a.out!);
      osc.start();
      return osc;
    });
    k.say(`разностный тон должен звучать на ${Math.abs(k.num('f2') - k.num('f1'))} Гц. В воздухе его нет: он появляется в нелинейности улитки.`);
  };
  k.button('play', (el) => {
    if (a.on) { for (const o of oscs) o.stop(); a.close(); el.textContent = 'играть'; return; }
    a.open(0.42);
    rebuild();
    el.textContent = 'стоп';
    k.say('нужна приличная громкость — но не переусердствуйте.');
  });
  k.slider('f1', rebuild);
  k.slider('f2', rebuild);
});

export const illusoryContinuityTones: Mount = demo((k) => {
  const a = new Audio();
  let timer = 0;
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const fill = k.pick('fill');
    ctx.fillStyle = MARK;
    ctx.fillRect(10, h * 0.4, w * 0.35, 6);
    ctx.fillRect(w * 0.55, h * 0.4, w * 0.4, 6);
    if (fill !== 'silence') {
      ctx.fillStyle = fill === 'noise' ? 'rgba(90,100,120,0.8)' : 'rgba(90,100,120,0.3)';
      ctx.fillRect(w * 0.45, 8, w * 0.1, h - 16);
    }
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('тон разрезан; в разрыве — то, что выбрано', 10, h - 6);
  });
  const play = () => {
    const ctx = a.ctx!;
    const t = ctx.currentTime + 0.05;
    const fill = k.pick('fill');
    /* Тон именно вырезан: в разрыве его нет ни физически, ни в буфере. */
    for (const [start, dur] of [[0, 0.7], [1.0, 0.7]] as const) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 500;
      g.gain.setValueAtTime(0.22, t + start);
      g.gain.setValueAtTime(0, t + start + dur);
      osc.connect(g).connect(a.out!);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.01);
    }
    if (fill !== 'silence') {
      const buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.3), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = fill === 'noise' ? 0.4 : 0.09;
      src.connect(g).connect(a.out!);
      src.start(t + 0.7);
    }
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    a.open(0.35);
    play();
    timer = window.setInterval(play, 2200);
    el.textContent = 'стоп';
  });
  k.select('fill', (v) => {
    view.draw();
    k.say(v === 'silence' ? 'в тишине разрыв слышен отчётливо.' : v === 'noise' ? 'под громким шумом тон идёт насквозь. Его там нет.' : 'тихого шума не хватает, чтобы объяснить пропажу тона, — и разрыв снова слышен.');
  });
});

export const zwickerTone: Mount = demo((k) => {
  const a = new Audio();
  k.button('play', async (el) => {
    el.disabled = true;
    const ctx = a.open(0.3);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 8, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const notch = ctx.createBiquadFilter();
    notch.type = 'notch';
    notch.frequency.value = k.num('notch');
    notch.Q.value = Math.max(0.3, k.num('notch') / Math.max(k.num('width'), 10));
    src.connect(notch).connect(a.out!);
    src.start();
    k.say('шум с вырезанной полосой, восемь секунд. Не снимайте наушники.');
    await new Promise((r) => setTimeout(r, 8000));
    src.stop();
    a.close();
    el.disabled = false;
    k.say(`теперь тишина. Слабый тон где-то около ${k.num('notch')} Гц — это и есть тон Цвикера: соседние каналы адаптировались, а вырезанный нет.`);
  });
  k.slider('notch', () => {});
  k.slider('width', () => {});
});

export const soundInducedFlash: Mount = demo((k) => {
  const a = new Audio();
  let flashOn = false, t0 = -1, measured = '';
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = flashOn ? '#fff' : '#333';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.65, Math.min(w, h) * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.18, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  k.button('go', async () => {
    const ctx = a.open(0.3);
    const beeps = k.num('beeps');
    const flashes = k.num('flashes');
    const t = ctx.currentTime + 0.12;
    for (let i = 0; i < beeps; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 3500;
      g.gain.setValueAtTime(0.3, t + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.02);
      osc.connect(g).connect(a.out!);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.03);
    }
    const start = performance.now() + 120;
    for (let i = 0; i < flashes; i++) {
      const at = start + i * 70;
      setTimeout(() => { flashOn = true; s.draw(); setTimeout(() => { flashOn = false; s.draw(); }, 16); }, at - performance.now());
    }
    k.say(`гудков ${beeps}, вспышек ${flashes}. Смотрите на красную точку — на периферии эффект сильнее.`);
    setTimeout(() => a.close(), 1500);
  });
  k.slider('beeps', () => {});
  k.slider('flashes', () => {});
});

export const streamBounce: Mount = demo((k) => {
  const a = new Audio();
  let t0 = -1;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (t0 < 0) return;
    const el = (performance.now() - t0) / 1000;
    const p = Math.min(el / 1.6, 1);
    ctx.fillStyle = '#3b6fd0';
    ctx.beginPath();
    ctx.arc(w * 0.15 + (w * 0.7) * p, h / 2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.85 - (w * 0.7) * p, h / 2, 16, 0, Math.PI * 2);
    ctx.fill();
  });
  k.button('go', () => {
    t0 = performance.now();
    if (!k.bool('click')) { k.say('прошли насквозь или отскочили? По картинке определить нельзя.'); return; }
    const ctx = a.open(0.35);
    const when = ctx.currentTime + 0.8 + k.num('when') / 1000;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 1200;
    g.gain.setValueAtTime(0.4, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
    osc.connect(g).connect(a.out!);
    osc.start(when);
    osc.stop(when + 0.04);
    setTimeout(() => a.close(), 2500);
    k.say(Math.abs(k.num('when')) < 60 ? 'со щелчком в момент встречи они отскакивают, и однозначно.' : 'щелчок далеко от момента встречи — и он больше ничего не решает. Окно узкое.');
  });
  k.check('click', () => {});
  k.slider('when', () => {});
  k.loop(() => { if (t0 > 0) s.draw(); });
});

export const ventriloquismEffect: Mount = demo((k) => {
  const a = new Audio();
  let mouthX = 0.5, pan = 0, open = 0, timer = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e8c9a8';
    ctx.beginPath();
    ctx.arc(w * mouthX, h / 2, Math.min(w, h) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a3a2a';
    ctx.beginPath();
    ctx.ellipse(w * mouthX, h * 0.62, Math.min(w, h) * 0.1, Math.min(w, h) * 0.03 + open * Math.min(w, h) * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b33';
    for (const dx of [-0.11, 0.11]) {
      ctx.beginPath();
      ctx.arc(w * mouthX + Math.min(w, h) * dx, h * 0.42, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  canvas?.addEventListener('pointermove', (ev) => {
    if (ev.buttons !== 1) return;
    mouthX = Math.max(0.1, Math.min(0.9, ev.offsetX / canvas.clientWidth));
    s.draw();
    k.say('панорама звука не менялась. Источник поехал за картинкой, а не за звуком.');
  });
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); el.textContent = 'играть'; return; }
    const ctx = a.open(0.3);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const p = ctx.createStereoPanner();
    osc.type = 'sawtooth';
    osc.frequency.value = 130;
    p.pan.value = pan;
    g.gain.value = 0;
    osc.connect(g).connect(p).connect(a.out!);
    osc.start();
    timer = window.setInterval(() => {
      open = open > 0.5 ? 0 : 1;
      g.gain.setTargetAtTime(open ? 0.2 : 0.02, ctx.currentTime, 0.03);
      p.pan.value = k.num('pan') / 100;
      s.draw();
    }, 180);
    el.textContent = 'стоп';
  });
  k.slider('pan', (v) => { pan = v / 100; });
});
