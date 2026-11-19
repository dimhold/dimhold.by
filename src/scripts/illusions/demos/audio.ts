/* Звук. Всё здесь строится на Web Audio и требует жеста мыши для запуска: браузеры не
   дают включать звук самостоятельно, и это правильно. Где нужны наушники, Demo.astro
   пишет об этом сам. */
import { demo, MARK, PAPER, type Mount } from '../kit';
import { tr } from '../i18n';

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

/* Свежий контекст запускается не мгновенно, и пока он не пошёл, его часы не связаны
   с часами страницы. Там, где звук сводится с картинкой, сначала ждём. */
const ready = async (ctx: AudioContext) => {
  for (let i = 0; i < 30 && (ctx.state !== 'running' || !ctx.getOutputTimestamp?.().performanceTime); i++) {
    await new Promise((r) => setTimeout(r, 20));
  }
};

/* Момент звукового движка на часах страницы (performance.now), с учётом задержки вывода. */
const perfAt = (ctx: AudioContext, t: number) => {
  const ts = ctx.getOutputTimestamp?.();
  if (ts?.performanceTime) return ts.performanceTime + (t - (ts.contextTime ?? 0)) * 1000;
  return performance.now() + (t - ctx.currentTime + (ctx.outputLatency || ctx.baseLatency || 0)) * 1000;
};

/* Повтор блоков по часам звукового движка: следующий блок встаёт ровно в конец
   предыдущего, а не туда, куда успел setInterval. block(t) расписывает блок с момента t
   и возвращает его длину. */
const looper = (a: Audio, block: (t: number) => number) => {
  let next = 0, timer = 0;
  const pump = () => {
    const ctx = a.ctx;
    if (!ctx) return;
    if (next < ctx.currentTime + 0.03) next = ctx.currentTime + 0.1;
    while (next < ctx.currentTime + 0.8) next += block(next);
  };
  return {
    start() { next = 0; pump(); timer = window.setInterval(pump, 100); },
    stop() { clearInterval(timer); timer = 0; },
    get on() { return !!timer; },
  };
};

/* Тональная посылка с короткими фронтами: без них каждое включение щёлкает. */
const toneAt = (ctx: AudioContext, out: AudioNode, f: number, pan: number, when: number, dur: number, amp: number, type: OscillatorType = 'sine') => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  const p = ctx.createStereoPanner();
  osc.type = type;
  osc.frequency.value = f;
  p.pan.value = pan;
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(amp, when + 0.005);
  g.gain.setValueAtTime(amp, when + dur - 0.005);
  g.gain.linearRampToValueAtTime(0, when + dur);
  osc.connect(g).connect(p).connect(out);
  osc.start(when);
  osc.stop(when + dur + 0.01);
};

/* Огибающая по логарифму частоты: приподнятый косинус, на краях ровно ноль. Тогда
   составляющая, ушедшая за верхний край, возвращается снизу беззвучно, и круг
   замыкается без скачка в спектре. */
const hann = (pos: number) => (pos <= 0 || pos >= 1 ? 0 : 0.5 - 0.5 * Math.cos(2 * Math.PI * pos));

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
    /* Колокол в логарифмических координатах: хрома едет, общая высота стоит. Ширину
       задаёт ползунок, а к краям колокол ещё и прижат к нулю. */
    const shape = (pos: number, width: number) => {
      const d = (pos - 0.5) / width;
      return Math.exp(-0.5 * d * d) * hann(pos);
    };
    const view = k.chart(({ ctx, w, h }) => {
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, w, h);
      const pad = 18;
      ctx.strokeStyle = '#d9d6cf';
      ctx.beginPath();
      ctx.moveTo(pad, h - 16);
      ctx.lineTo(w - pad, h - 16);
      ctx.stroke();
      /* Неподвижная огибающая пунктиром: полоски ездят под ней. */
      const width = k.num('width') / 100 || 0.28;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      for (let x = 0; x <= 100; x++) {
        const v = shape(x / 100, width) / shape(0.5, width);
        const px = pad + (x / 100) * (w - pad * 2), py = h - 16 - v * (h - 30);
        x ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < VOICES; i++) {
        if (!freq[i]) continue;
        const octave = Math.log2(freq[i] / FMIN) / VOICES;
        const x = pad + octave * (w - pad * 2);
        /* Высота полоски — та же огибающая в той же точке: полоска сидит на пунктире. */
        const v = shape(octave, width) / shape(0.5, width);
        const bh = v * (h - 30);
        ctx.fillStyle = `rgba(210, 72, 63, ${0.25 + v * 0.75})`;
        ctx.fillRect(x - 4, h - 16 - bh, 8, bh);
      }
      ctx.fillStyle = '#6b6b70';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(tr('низ'), pad - 6, h - 3);
      const top = tr('верх');
      ctx.fillText(top, w - pad - ctx.measureText(top).width + 6, h - 3);
    });
    const compute = () => {
      const cont = glide || k.bool('glide');
      const width = k.num('width') / 100 || 0.28;
      /* Шагами — по полутонам, и огибающая шагает вместе с частотой. */
      const c = cont ? chroma : Math.round(chroma * 12) / 12;
      let sum = 0;
      for (let i = 0; i < VOICES; i++) {
        const octave = (c + i) % VOICES;
        freq[i] = FMIN * 2 ** octave;
        level[i] = shape(octave / VOICES, width);
        sum += level[i];
      }
      for (let i = 0; i < VOICES; i++) level[i] = sum ? level[i] / sum : 0;
    };
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const dir = k.bool('down') ? -1 : 1;
      chroma = (chroma + dir * dt * (k.num('speed') / 100) + VOICES) % VOICES;
      compute();
      for (let i = 0; i < VOICES; i++) {
        if (voices[i] && a.ctx) {
          voices[i].osc.frequency.setTargetAtTime(freq[i], a.ctx.currentTime, 0.005);
          voices[i].gain.gain.setTargetAtTime(level[i] * 0.5, a.ctx.currentTime, 0.02);
        }
      }
      view.draw();
      raf = requestAnimationFrame(tick);
    };
    compute();
    view.draw();
    k.slider('width', () => { compute(); view.draw(); });
    k.button('play', (el) => {
      if (a.on) {
        cancelAnimationFrame(raf);
        raf = 0; last = 0;
        voices = [];
        a.close();
        el.textContent = tr('играть');
        k.say(tr('остановлено.'));
        return;
      }
      const ctx = a.open(0.28);
      compute();
      voices = Array.from({ length: VOICES }, (_, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq[i];
        const gain = ctx.createGain();
        gain.gain.value = 0;
        osc.connect(gain).connect(a.out!);
        osc.start();
        return { osc, gain };
      });
      el.textContent = tr('стоп');
      k.say(tr('следите за спектром: верхняя полоска гаснет ровно там, где снизу вступает новая.'));
      raf = requestAnimationFrame(tick);
    });
  });

export const shepardTone = shepardBank(false);

/* Ритм Рисе. Слои в темпах через двойку, все на одной сетке: каждый удар медленного слоя
   совпадает с ударом соседнего быстрого. За круг длиной P темп каждого слоя плавно
   удваивается, и в конце круга слой i становится слоем i+1 — удары и темп сходятся
   без шва. Громкость задаёт неподвижная огибающая по логарифму темпа: самый быстрый слой
   уходит в тишину, самый медленный из тишины выходит. */
export const rissetRhythm: Mount = demo((k) => {
  const a = new Audio();
  const LAYERS = 4;
  const F0 = 0.75; // ударов в секунду у самого медленного слоя в начале круга
  let raf = 0, cs = 0, P = 10, dir = 1, idx = 0;
  let events: { t: number; v: number }[] = [];
  const env = (pos: number) => hann(pos / LAYERS);
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const pad = 18;
    ctx.strokeStyle = '#d9d6cf';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (let x = 0; x <= 100; x++) {
      const px = pad + (x / 100) * (w - pad * 2), py = h - 16 - env((x / 100) * LAYERS) * (h - 30);
      x ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    const u = a.ctx ? Math.min(Math.max((a.ctx.currentTime - cs) / P, 0), 1) : 0;
    ctx.fillStyle = MARK;
    for (let i = 0; i < LAYERS; i++) {
      const pos = dir > 0 ? i + u : i + 1 - u;
      const x = pad + (pos / LAYERS) * (w - pad * 2);
      const bh = env(pos) * (h - 30);
      ctx.fillRect(x - 4, h - 16 - bh, 8, bh);
    }
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(tr('медленно'), pad - 6, h - 3);
    const top = tr('быстро');
    ctx.fillText(top, w - pad - ctx.measureText(top).width + 6, h - 3);
  });
  /* Расписание одного круга. Фаза слоя i при разгоне: 2^i·N·(2^u − 1), удар — на каждом
     целом; при замедлении: 2^(i+1)·N·(1 − 2^−u). N целое, иначе круг не замкнётся. */
  const plan = () => {
    P = 60 / k.num('rate');
    dir = k.bool('down') ? -1 : 1;
    const N = Math.max(1, Math.round((F0 * P) / Math.LN2));
    const raw: { t: number; v: number }[] = [];
    for (let i = 0; i < LAYERS; i++) {
      const M = 2 ** i * N;
      for (let m = 0; m < M; m++) {
        const u = dir > 0 ? Math.log2(1 + m / M) : -Math.log2(1 - m / (2 * M));
        raw.push({ t: cs + P * u, v: env(dir > 0 ? i + u : i + 1 - u) });
      }
    }
    raw.sort((x, y) => x.t - y.t);
    /* Совпавшие удары разных слоёв — один удар. */
    events = [];
    for (const e of raw) {
      const prev = events[events.length - 1];
      if (prev && e.t - prev.t < 1e-4) prev.v += e.v; else events.push({ ...e });
    }
    idx = 0;
  };
  const click = (when: number, gain: number) => {
    const ctx = a.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 1000;
    g.gain.setValueAtTime(gain * 0.4, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.04);
    osc.connect(g).connect(a.out!);
    osc.start(when);
    osc.stop(when + 0.05);
  };
  const tick = () => {
    const ctx = a.ctx;
    if (!ctx) return;
    /* Вкладка спала дольше круга — догоняем, ничего не играя задним числом. */
    while (cs + P < ctx.currentTime) { cs += P; plan(); }
    for (;;) {
      if (idx >= events.length) { cs += P; plan(); }
      const e = events[idx];
      if (e.t > ctx.currentTime + 0.25) break;
      if (e.t >= ctx.currentTime && e.v > 0.002) click(e.t, e.v);
      idx++;
    }
    view.draw();
    raf = requestAnimationFrame(tick);
  };
  view.draw();
  k.check('down', () => { if (!a.on) { dir = k.bool('down') ? -1 : 1; view.draw(); } });
  k.button('play', (el) => {
    if (a.on) { cancelAnimationFrame(raf); raf = 0; a.close(); el.textContent = tr('играть'); view.draw(); return; }
    const ctx = a.open(0.3);
    cs = ctx.currentTime + 0.1;
    plan();
    el.textContent = tr('стоп');
    k.say(k.bool('down')
      ? tr('доля замедляется без конца. Расписание считается наперёд по часам звукового движка; направление и скорость меняются со следующего круга.')
      : tr('доля разгоняется без конца. Расписание считается наперёд по часам звукового движка; направление и скорость меняются со следующего круга.'));
    raf = requestAnimationFrame(tick);
  });
});

/* Тон из семи составляющих через октаву от 55 Гц под неподвижной огибающей: чистая хрома
   без общей высоты. Огибающая на краях ноль, поэтому хрома 12 — это ровно хрома 0. */
const chromaTone = (ctx: AudioContext, out: GainNode, chroma: number, when: number, dur: number) => {
  for (let o = 0; o < VOICES; o++) {
    const pos = (o + chroma / 12) / VOICES;
    const amp = hann(pos) * 0.15;
    if (amp < 1e-4) continue;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = FMIN * 2 ** (o + chroma / 12);
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
    stage.innerHTML = `<p class="ill-q">${tr('второй тон выше или ниже первого?')}</p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, up] of [[tr('выше'), true], [tr('ниже'), false]] as const) {
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
            ? tr('три раза подряд «выше» — и через три шага по четыре полутона вы вернулись в исходную ноту. Ваши собственные ответы образуют кольцо: «выше» перестало быть отношением порядка.')
            : tr('ответы разошлись — так тоже бывает, окно у этого стимула узкое. Попробуйте ещё круг.'));
          step = 0;
          answers.length = 0;
        } else k.say(tr('{n} из 3. Жмите дальше.', { n: step }));
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
    /* Круг ниже подписи, названия нот внутри круга: на узком экране холст низкий. */
    const cx = w / 2, cy = (h + 18) / 2, R = Math.max(30, Math.min(w / 2, (h - 18) / 2) - 12);
    ctx.strokeStyle = '#c9ccd4';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    /* Ваш собственный круг названий нот: где он повёрнут, там и граница «выше».
       Точка стоит на ноте, с которой начиналась пара. */
    const NAMES = ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'];
    ctx.font = '11px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    votes.forEach((v, i) => {
      const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = '#6b6b70';
      /* На маленьком круге названия слиплись бы — там только точки. */
      if (R >= 60) ctx.fillText(NAMES[i], cx + (R - 20) * Math.cos(ang), cy + (R - 20) * Math.sin(ang));
      if (!v) return;
      ctx.fillStyle = v > 0 ? MARK : '#3b6fd0';
      ctx.beginPath();
      ctx.arc(cx + R * Math.cos(ang), cy + R * Math.sin(ang), 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#6b6b70';
    ctx.fillText(tr('красное — «вверх», синее — «вниз»'), 6, 14);
  });
  k.button('play', () => {
    const ctx = a.open(0.3);
    const t = ctx.currentTime + 0.05;
    chromaTone(ctx, a.out!, base, t, 0.5);
    chromaTone(ctx, a.out!, (base + 6) % 12, t + 0.6, 0.5);
    stage.innerHTML = `<p class="ill-q">${tr('пара пошла вверх или вниз?')}</p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, v] of [[tr('вверх'), 1], [tr('вниз'), -1]] as const) {
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
          ? tr('{n} из 12. Круг внизу — ваш.', { n: done })
          : tr('круг заполнен. У кого-то он повёрнут ровно наоборот — и это зависит от языка и говора, на которых человек вырос.'));
      };
      row.append(b);
    }
    stage.append(row);
  });
});

/* Иллюзия октавы Дойч: 400 и 800 Гц по 250 мс без пауз, в одном ухе высокий, в другом
   низкий, и каждые 250 мс они меняются ушами. */
export const octaveIllusion: Mount = demo((k) => {
  const a = new Audio();
  let swap = false, n = 0;
  const loop = looper(a, (t) => {
    const highLeft = (n++ % 2 === 0) !== swap;
    toneAt(a.ctx!, a.out!, 800, highLeft ? -1 : 1, t, 0.25, 0.25);
    toneAt(a.ctx!, a.out!, 400, highLeft ? 1 : -1, t, 0.25, 0.25);
    return 0.25;
  });
  /* Проверка каналов открывает тот же контекст, поэтому «играет ли» — это цикл, а не
     контекст: иначе следующее «играть» после проверки закрывало звук. */
  const stop = () => { loop.stop(); a.close(); if (playBtn) playBtn.textContent = tr('играть'); };
  const playBtn = k.button('play', (el) => {
    if (loop.on) { stop(); return; }
    a.close();
    a.open(0.3);
    n = 0;
    loop.start();
    el.textContent = tr('стоп');
    k.say(tr('большинство слышит один тон, скачущий из уха в ухо, и высота при этом чередуется.'));
  });
  k.button('swap', () => {
    swap = !swap;
    k.say(tr('каналы поменяны местами. Большинство слушателей не слышит никакой разницы — и вот это самое поразительное.'));
  });
  k.button('check', () => {
    if (loop.on) stop();
    const ctx = a.open(0.3);
    const t = ctx.currentTime + 0.1;
    toneAt(ctx, a.out!, 440, -1, t, 0.6, 0.25);
    toneAt(ctx, a.out!, 660, 1, t + 0.7, 0.6, 0.25);
    k.say(tr('сначала низкий тон слева, потом высокий справа. Если слышно иначе — наушники надеты наоборот.'));
  });
});

export const scaleIllusion: Mount = demo((k) => {
  const a = new Audio();
  let ear = 'both';
  const SCALE = [0, 2, 4, 5, 7, 9, 11, 12];
  /* Восходящая и нисходящая гаммы до мажор чередуются по ушам нота за нотой, по 250 мс. */
  const loop = looper(a, (t) => {
    for (let i = 0; i < SCALE.length; i++) {
      const up = 261.63 * 2 ** (SCALE[i] / 12);
      const down = 261.63 * 2 ** (SCALE[SCALE.length - 1 - i] / 12);
      const pairs: [number, number][] = i % 2 === 0 ? [[up, -1], [down, 1]] : [[down, -1], [up, 1]];
      for (const [f, pan] of pairs) {
        if (ear === 'left' && pan > 0) continue;
        if (ear === 'right' && pan < 0) continue;
        toneAt(a.ctx!, a.out!, f, pan, t + i * 0.25, 0.25, 0.22);
      }
    }
    return SCALE.length * 0.25 + 0.25;
  });
  k.button('play', (el) => {
    if (loop.on) { loop.stop(); a.close(); el.textContent = tr('играть'); return; }
    a.open(0.3);
    loop.start();
    el.textContent = tr('стоп');
  });
  k.select('ear', (v) => {
    ear = v;
    k.say(v === 'both'
      ? tr('слышно две ровные мелодии, каждая чисто из своего уха.')
      : tr('в одиночку этот канал даёт рваную скачущую последовательность — ровно ту, что там и записана. Она прямо противоречит тому, что вы только что слышали двумя ушами.'));
  });
});

/* Иллюзия глиссандо: ровный тон гобоя и синусоидальное скольжение вверх-вниз, нарезанные
   по 250 мс и разложенные по ушам наоборот. Оба звука — по одному генератору на всё
   время, по ушам их разводят только усилители: фаза и частота скольжения непрерывны,
   и любой шов был бы слышен как подсказка. */
export const glissandoIllusion: Mount = demo((k) => {
  const a = new Audio();
  let ear = 'both', n = 0;
  let sides: { oboe: GainNode[]; gl: GainNode[]; ears: GainNode[]; glide: OscillatorNode } | null = null;
  const SEG = 0.25, LO = 500, HI = 1500;
  const loop = looper(a, (t) => {
    const s = sides!;
    /* Круг: 8 кусков вверх, 8 вниз. */
    s.glide.frequency.setValueAtTime(LO, t);
    s.glide.frequency.exponentialRampToValueAtTime(HI, t + 8 * SEG);
    s.glide.frequency.exponentialRampToValueAtTime(LO, t + 16 * SEG);
    for (let i = 0; i < 16; i++) {
      const left = (n++ % 2 === 0);
      const at = t + i * SEG;
      s.oboe[0].gain.setTargetAtTime(left ? 1 : 0, at, 0.002);
      s.oboe[1].gain.setTargetAtTime(left ? 0 : 1, at, 0.002);
      s.gl[0].gain.setTargetAtTime(left ? 0 : 1, at, 0.002);
      s.gl[1].gain.setTargetAtTime(left ? 1 : 0, at, 0.002);
    }
    return 16 * SEG;
  });
  const setEars = () => {
    if (!sides || !a.ctx) return;
    sides.ears[0].gain.setTargetAtTime(ear === 'right' ? 0 : 1, a.ctx.currentTime, 0.01);
    sides.ears[1].gain.setTargetAtTime(ear === 'left' ? 0 : 1, a.ctx.currentTime, 0.01);
  };
  k.button('play', (el) => {
    if (loop.on) { loop.stop(); a.close(); sides = null; el.textContent = tr('играть'); return; }
    const ctx = a.open(0.3);
    /* Гобой собран аддитивно: слабая основная, сильные вторая—четвёртая гармоники. */
    const H = [0, 0.45, 1, 0.9, 0.7, 0.35, 0.3, 0.18, 0.12, 0.08, 0.05];
    const wave = ctx.createPeriodicWave(new Float32Array(H.length), new Float32Array(H));
    const oboe = ctx.createOscillator();
    oboe.setPeriodicWave(wave);
    oboe.frequency.value = 330;
    const glide = ctx.createOscillator();
    glide.frequency.value = LO;
    const ears = [-1, 1].map((pan) => {
      const g = ctx.createGain();
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p).connect(a.out!);
      return g;
    });
    const split = (src: OscillatorNode, amp: number) => ears.map((e) => {
      const g = ctx.createGain();
      g.gain.value = 0;
      const lvl = ctx.createGain();
      lvl.gain.value = amp;
      src.connect(lvl).connect(g).connect(e);
      return g;
    });
    sides = { oboe: split(oboe, 0.14), gl: split(glide, 0.2), ears, glide };
    oboe.start();
    glide.start();
    n = 0;
    setEars();
    loop.start();
    el.textContent = tr('стоп');
  });
  k.select('ear', (v) => { ear = v; setEars(); });
});

export const precedenceEffect: Mount = demo((k) => {
  const a = new Audio();
  let timer = 0;
  const burst = () => {
    const ctx = a.ctx!;
    const t = ctx.currentTime + 0.05;
    const delay = k.num('delay') / 1000;
    const gain = k.num('gain') / 100;
    /* Обе копии — один и тот же щелчок: отстающая должна быть эхом ведущей, а не
       другим звуком. */
    const buf = ctx.createBuffer(1, 220, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
    for (const [pan, when, amp] of [[-1, t, 1], [1, t + delay, gain]] as const) {
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
    if (a.on) { a.close(); clearInterval(timer); el.textContent = tr('играть'); return; }
    a.open(0.4);
    burst();
    timer = window.setInterval(burst, 700);
    el.textContent = tr('стоп');
  });
  /* Порог эха у коротких щелчков низкий, около 5–10 мс; у речи он доходит до десятков. */
  k.slider('delay', (v) => {
    k.say(v < 1 ? tr('обе копии почти одновременны — звук в середине головы.')
      : v < 5 ? tr('задержка {ms} мс: звук целиком слева, откуда пришёл первым, — даже если правая копия громче.', { ms: v })
      : v < 10 ? tr('задержка {ms} мс: у щелчков здесь проходит порог эха. Многие уже слышат вторую копию справа отдельно.', { ms: v })
      : tr('за порогом эха звук распадается на два.'));
  });
  k.slider('gain', () => {});
});

export const binauralBeats: Mount = demo((k) => {
  const a = new Audio();
  let oscs: OscillatorNode[] = [];
  let pans: StereoPannerNode[] = [];
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
    ctx.fillText(tr('биения: {n} в секунду', { n: diff }), 6, 14);
  });
  /* Бинауральные биения рождаются в бинауральном сравнении и требуют наушников;
     обычные складываются в воздухе и работают на динамиках. Ручки меняют частоту и
     панораму на ходу, без пересоздания звука. */
  const apply = () => {
    if (!a.ctx) return;
    const now = a.ctx.currentTime;
    const acoustic = k.bool('acoustic');
    oscs[1]?.frequency.setTargetAtTime(220 + k.num('diff'), now, 0.02);
    pans.forEach((p, i) => p.pan.setTargetAtTime(acoustic ? 0 : i ? 1 : -1, now, 0.02));
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); oscs = []; pans = []; el.textContent = tr('играть'); return; }
    const ctx = a.open(0.2);
    pans = [];
    oscs = [220, 220].map(() => {
      const osc = ctx.createOscillator();
      osc.frequency.value = 220;
      const p = ctx.createStereoPanner();
      osc.connect(p).connect(a.out!);
      osc.start();
      pans.push(p);
      return osc;
    });
    oscs[1].frequency.value = 220 + k.num('diff');
    pans.forEach((p, i) => { p.pan.value = k.bool('acoustic') ? 0 : i ? 1 : -1; });
    el.textContent = tr('стоп');
  });
  k.slider('diff', () => { apply(); view.draw(); });
  k.check('acoustic', (v) => {
    apply();
    k.say(v ? tr('обычные акустические биения: они в воздухе и слышны на динамиках.') : tr('бинауральные: в каждом ухе по чистому тону, а биение возникает в голове.'));
  });
});

export const missingFundamental: Mount = demo((k) => {
  const a = new Audio();
  let gains: GainNode[] = [];
  const F0 = 160;
  const off = (i: number) => (i === 1 && k.bool('f1')) || (i === 2 && k.bool('f2')) || (i === 3 && k.bool('f3'));
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = MARK;
    for (let i = 1; i <= 8; i++) {
      const x = 20 + ((i - 1) / 8) * (w - 40);
      const bh = off(i) ? 0 : (h - 24) / i;
      ctx.globalAlpha = off(i) ? 0.15 : 1;
      ctx.fillRect(x - 5, h - 14 - bh, 10, Math.max(bh, 2));
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(tr('основная {f} Гц', { f: F0 }), 6, 14);
  });
  /* Гармоники звучат всё время, галочки только убирают громкость: без перезапуска
     генераторов не меняется фаза и не щёлкает. */
  const apply = () => {
    if (!a.ctx) return;
    gains.forEach((g, j) => g.gain.setTargetAtTime(off(j + 1) ? 0 : 0.18 / (j + 1), a.ctx!.currentTime, 0.02));
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); gains = []; el.textContent = tr('играть'); return; }
    const ctx = a.open(0.3);
    gains = [];
    for (let i = 1; i <= 8; i++) {
      const osc = ctx.createOscillator();
      osc.frequency.value = F0 * i;
      const g = ctx.createGain();
      g.gain.value = off(i) ? 0 : 0.18 / i;
      osc.connect(g).connect(a.out!);
      osc.start();
      gains.push(g);
    }
    el.textContent = tr('стоп');
    k.say(tr('выключите основную галочкой — и высота не дрогнет.'));
  });
  for (const n of ['f1', 'f2', 'f3']) k.check(n, () => { apply(); view.draw(); });
});

export const tartiniTone: Mount = demo((k) => {
  const a = new Audio();
  let oscs: OscillatorNode[] = [];
  const tell = () => {
    const f1 = k.num('f1'), f2 = k.num('f2');
    const lo = Math.min(f1, f2), hi = Math.max(f1, f2);
    const cubic = 2 * lo - hi;
    k.say(cubic > 0 && hi > lo
      ? tr('разностный тон f2−f1 — {f} Гц, кубический 2f1−f2 — {c} Гц. В воздухе их нет: они появляются в нелинейности улитки. На умеренной громкости легче услышать второй.', { f: hi - lo, c: cubic })
      : tr('разностный тон должен звучать на {f} Гц. В воздухе его нет: он появляется в нелинейности улитки.', { f: hi - lo }));
  };
  const retune = () => {
    if (a.ctx) [k.num('f1'), k.num('f2')].forEach((f, i) => oscs[i]?.frequency.setTargetAtTime(f, a.ctx!.currentTime, 0.02));
    if (a.on) tell();
  };
  k.button('play', (el) => {
    if (a.on) { a.close(); oscs = []; el.textContent = tr('играть'); k.say(tr('нужна приличная громкость — но не переусердствуйте.')); return; }
    const ctx = a.open(0.42);
    oscs = [k.num('f1'), k.num('f2')].map((f) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(a.out!);
      osc.start();
      return osc;
    });
    el.textContent = tr('стоп');
    tell();
  });
  k.slider('f1', retune);
  k.slider('f2', retune);
  /* Предупреждение об уровне — до запуска, а не после. */
  k.say(tr('нужна приличная громкость — но не переусердствуйте.'));
});

export const illusoryContinuityTones: Mount = demo((k) => {
  const a = new Audio();
  /* Тон 0,7 с, разрыв 0,3 с, тон 0,7 с. Шум чуть перекрывает края разрыва, чтобы
     не были слышны выключение и включение тона. */
  const T1 = 0.7, GAP = 0.3, T2 = 0.7, PAUSE = 0.5, TOTAL = T1 + GAP + T2;
  const view = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const fill = k.pick('fill');
    const X = (t: number) => 10 + (t / TOTAL) * (w - 20);
    ctx.fillStyle = MARK;
    ctx.fillRect(X(0), h * 0.4, X(T1) - X(0), 6);
    ctx.fillRect(X(T1 + GAP), h * 0.4, X(TOTAL) - X(T1 + GAP), 6);
    if (fill !== 'silence') {
      ctx.fillStyle = fill === 'noise' ? 'rgba(90,100,120,0.8)' : 'rgba(90,100,120,0.25)';
      const nh = fill === 'noise' ? h - 30 : (h - 30) * 0.3;
      ctx.fillRect(X(T1 - 0.02), h * 0.4 + 3 - nh / 2, X(T1 + GAP + 0.02) - X(T1 - 0.02), nh);
    }
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(tr('тон разрезан; в разрыве — то, что выбрано'), 10, h - 6);
  });
  const loop = looper(a, (t) => {
    const ctx = a.ctx!;
    const fill = k.pick('fill');
    /* Тон именно вырезан: в разрыве его нет ни физически, ни в буфере. */
    for (const [start, dur] of [[0, T1], [T1 + GAP, T2]] as const) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 500;
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(0.22, t + start + 0.01);
      g.gain.setValueAtTime(0.22, t + start + dur - 0.01);
      g.gain.linearRampToValueAtTime(0, t + start + dur);
      osc.connect(g).connect(a.out!);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.01);
    }
    if (fill !== 'silence') {
      /* Шум полосой вокруг тона. Громкий в полосе слуха около 500 Гц на 6 дБ сильнее тона и мог
         бы его заглушить — это условие иллюзии; тихий на 19 дБ слабее тона и заглушить не мог. */
      const len = GAP + 0.04;
      const buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * len), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 500;
      bp.Q.value = 2;
      const g = ctx.createGain();
      const amp = fill === 'noise' ? 9 : 0.5;
      const at = t + T1 - 0.02;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(amp, at + 0.005);
      g.gain.setValueAtTime(amp, at + len - 0.005);
      g.gain.linearRampToValueAtTime(0, at + len);
      src.connect(bp).connect(g).connect(a.out!);
      src.start(at);
    }
    return TOTAL + PAUSE;
  });
  k.button('play', (el) => {
    if (loop.on) { loop.stop(); a.close(); el.textContent = tr('играть'); return; }
    a.open(0.35);
    loop.start();
    el.textContent = tr('стоп');
  });
  k.select('fill', (v) => {
    view.draw();
    k.say(v === 'silence' ? tr('в тишине разрыв слышен отчётливо.') : v === 'noise' ? tr('под громким шумом тон идёт насквозь. Его там нет.') : tr('тихого шума не хватает, чтобы объяснить пропажу тона, — и разрыв снова слышен.'));
  });
});

/* Быстрое преобразование Фурье на месте, по основанию два. */
const fft = (re: Float64Array, im: Float64Array) => {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1;
    for (let j = 0; j < half; j++) {
      const cr = Math.cos((-2 * Math.PI * j) / len), ci = Math.sin((-2 * Math.PI * j) / len);
      for (let i = j; i < n; i += len) {
        const b = i + half;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[i] - xr; im[b] = im[i] - xi;
        re[i] += xr; im[i] += xi;
      }
    }
  }
};

/* Шум с пустой полосой [lo, hi], собранный прямо в спектре: единичные амплитуды со
   случайными фазами, в полосе нули, потом обратное преобразование. Стенки выреза
   отвесные и глубина полная; фильтры дают пологие стенки, и хвосты соседних полос
   заливают узкий вырез, а одиночный режекторный биквад — вообще ямка в точке. */
const notchedNoise = (ctx: AudioContext, lo: number, hi: number, secs: number) => {
  let n = 1;
  while (n < ctx.sampleRate * secs) n <<= 1;
  const re = new Float64Array(n), im = new Float64Array(n);
  const df = ctx.sampleRate / n;
  for (let k = 1; k < n / 2; k++) {
    const f = k * df;
    if (f < 30 || (f >= lo && f <= hi)) continue;
    const ph = Math.random() * 2 * Math.PI;
    re[k] = re[n - k] = Math.cos(ph);
    /* Сопряжённая симметрия, и сразу сопряжение для обратного хода через прямой. */
    im[k] = -Math.sin(ph);
    im[n - k] = Math.sin(ph);
  }
  fft(re, im);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += re[i] * re[i];
  const norm = 0.35 / Math.sqrt(sum / n);
  const buf = ctx.createBuffer(1, Math.round(ctx.sampleRate * secs), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = re[i] * norm;
  return buf;
};

export const zwickerTone: Mount = demo((k) => {
  const a = new Audio();
  k.button('play', async (el) => {
    el.disabled = true;
    const ctx = a.open(0.3);
    const f = k.num('notch'), wdt = k.num('width');
    const src = ctx.createBufferSource();
    src.buffer = notchedNoise(ctx, Math.max(40, f - wdt / 2), f + wdt / 2, 8);
    const env = ctx.createGain();
    const t = ctx.currentTime;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.05);
    env.gain.setValueAtTime(1, t + 7.95);
    env.gain.linearRampToValueAtTime(0, t + 8);
    src.connect(env).connect(a.out!);
    src.start(t);
    k.say(tr('шум с вырезанной полосой, восемь секунд. Не снимайте наушники.'));
    await new Promise((r) => setTimeout(r, 8100));
    a.close();
    el.disabled = false;
    k.say(tr('теперь тишина. Слабый тон где-то около {f} Гц — это и есть тон Цвикера: соседние каналы адаптировались, а вырезанный нет.', { f }));
  });
  /* Вырез не шире своей частоты: иначе нижний край упирается в ноль, шум остаётся
     только сверху, и «тон около частоты выреза» уже неправда. */
  k.slider('notch', (v) => {
    const w = k.el('[data-slider="width"]') as HTMLInputElement | null;
    if (!w) return;
    w.max = String(Math.min(1500, v));
    if (Number(w.value) > v) w.value = String(v);
    w.dispatchEvent(new Event('input'));
  });
  k.slider('width', () => {});
});

export const soundInducedFlash: Mount = demo((k) => {
  const a = new Audio();
  let flashOn = false, busy = false;
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
    if (busy) return;
    busy = true;
    const ctx = a.open(0.3);
    await ready(ctx);
    const beeps = k.num('beeps');
    const flashes = k.num('flashes');
    const SOA = 0.07;
    const t = ctx.currentTime + 0.25;
    for (let i = 0; i < beeps; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 3500;
      g.gain.setValueAtTime(0.3, t + i * SOA);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * SOA + 0.02);
      osc.connect(g).connect(a.out!);
      osc.start(t + i * SOA);
      osc.stop(t + i * SOA + 0.03);
    }
    /* Вспышки — по кадрам, а не по таймеру: таймер на 16 мс то пропускает кадр, то
       держит вспышку два. Каждая вспышка — ровно один кадр; момент, когда кадр ушёл на
       экран, записывается и сравнивается с расписанием гудков на тех же часах. */
    const beep0 = perfAt(ctx, t);
    const shown: number[] = [];
    let frame = 1000 / 60, prev = 0, i = 0;
    await new Promise<void>((done) => {
      const step = (now: number) => {
        if (prev) frame = Math.min(frame, now - prev) || frame;
        prev = now;
        if (flashOn) { flashOn = false; s.draw(); }
        else if (i < flashes && now + frame >= beep0 + i * SOA * 1000 - frame / 2) {
          flashOn = true;
          s.draw();
          /* Нарисованное в этом кадре появится на экране к следующему. */
          shown.push(now + frame - (beep0 + i * SOA * 1000));
          i++;
        } else if (i >= flashes) { done(); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const lag = shown.length ? Math.max(...shown.map(Math.abs)) : 0;
    k.say(tr('гудков: {b}, вспышек: {f}. Вспышка — один кадр, около {d} мс; от расписания гудков вспышки разошлись не больше чем на {e} мс. Смотрите на красную точку — на периферии эффект сильнее.', { b: beeps, f: flashes, d: Math.round(frame), e: Math.round(lag) }));
    busy = false;
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
    const el = t0 < 0 ? 0 : (performance.now() - t0) / 1000;
    const p = Math.min(Math.max(el / 1.6, 0), 1);
    ctx.fillStyle = '#3b6fd0';
    ctx.beginPath();
    ctx.arc(w * 0.15 + (w * 0.7) * p, h / 2, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.85 - (w * 0.7) * p, h / 2, 16, 0, Math.PI * 2);
    ctx.fill();
  });
  const anim = k.loop(() => { if (t0 > 0) s.draw(); });
  k.button('go', async () => {
    anim.start();
    if (!k.bool('click')) { t0 = performance.now(); k.say(tr('прошли насквозь или отскочили? По картинке определить нельзя.')); return; }
    const ctx = a.open(0.35);
    await ready(ctx);
    /* Встреча — через 0,8 с после старта. Старт картинки привязан к часам звука, чтобы
       щелчок «в момент встречи» попадал во встречу, а не на задержку вывода раньше. */
    const meet = ctx.currentTime + 0.9;
    t0 = perfAt(ctx, meet) - 800;
    const when = meet + k.num('when') / 1000;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = 1200;
    g.gain.setValueAtTime(0.4, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.03);
    osc.connect(g).connect(a.out!);
    osc.start(when);
    osc.stop(when + 0.04);
    k.say(Math.abs(k.num('when')) < 60 ? tr('со щелчком в момент встречи большинство видит отскок.') : tr('щелчок далеко от момента встречи, и отскок видят реже. Чем дальше, тем слабее эффект.'));
  });
  k.check('click', () => {});
  k.slider('when', () => {});
});

export const ventriloquismEffect: Mount = demo((k) => {
  const a = new Audio();
  let mouthX = 0.5, pan = 0, open = 0, timer = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* Голова целиком на холсте при любом положении. */
    const r = Math.min(w, h) * 0.3;
    const cx = Math.max(r + 4, Math.min(w - r - 4, w * mouthX));
    ctx.fillStyle = '#e8c9a8';
    ctx.beginPath();
    ctx.arc(cx, h / 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a3a2a';
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.62, Math.min(w, h) * 0.1, Math.min(w, h) * 0.03 + open * Math.min(w, h) * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2b33';
    for (const dx of [-0.11, 0.11]) {
      ctx.beginPath();
      ctx.arc(cx + Math.min(w, h) * dx, h * 0.42, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  /* Пальцем тоже: без touch-action холст на телефоне прокручивал бы страницу. */
  if (canvas) canvas.style.touchAction = 'none';
  canvas?.addEventListener('pointermove', (ev) => {
    if (ev.buttons !== 1) return;
    mouthX = Math.max(0.1, Math.min(0.9, ev.offsetX / canvas.clientWidth));
    s.draw();
    k.say(tr('панорама звука не менялась. Источник поехал за картинкой, а не за звуком.'));
  });
  k.button('play', (el) => {
    if (a.on) { a.close(); clearInterval(timer); open = 0; s.draw(); el.textContent = tr('играть'); return; }
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
    el.textContent = tr('стоп');
  });
  k.slider('pan', (v) => { pan = v / 100; });
});
