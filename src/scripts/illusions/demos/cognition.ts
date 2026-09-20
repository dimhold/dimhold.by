/* Мышление, время, авторство и псевдогаптика. Часть этих демонстраций — настоящие
   опыты: они спрашивают до объяснения, записывают ответ и только потом разбирают.
   Где есть обман, разбор идёт сразу, а не в конце страницы. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';

export const launchingEffect: Mount = demo((k) => {
  let delay = 0, t0 = -1;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const q = h * 0.4;
    const cy = h / 2 - q / 2;
    const meet = w * 0.45;
    const el = t0 < 0 ? 0 : (performance.now() - t0) / 1000;
    const travel = 0.9;
    const a = Math.min(el / travel, 1);
    const ax = w * 0.06 + (meet - w * 0.06) * a;
    ctx.fillStyle = MARK;
    ctx.fillRect(ax, cy, q, q);
    const after = el - travel - delay / 1000;
    const b = after > 0 ? Math.min(after / travel, 1) : 0;
    ctx.fillStyle = '#3b6fd0';
    ctx.fillRect(meet + q + (w * 0.9 - meet - q) * b, cy, q, q);
  });
  k.slider('delay', (v) => {
    delay = v;
    k.say(v === 0 ? 'это столкновение: причину видно так же прямо, как цвет.' : v > 150 ? 'причинность вытекла: два несвязанных события, и никакое знание её не возвращает.' : 'причинность слабеет.');
  });
  k.button('go', () => { t0 = performance.now(); });
  k.loop(() => { if (t0 > 0) s.draw(); });
  t0 = performance.now();
});

export const heiderSimmelAnimacy: Mount = demo((k) => {
  let t0 = -1;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const el = t0 < 0 ? 0 : ((performance.now() - t0) / 1000) % 16;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.55, h * 0.25, w * 0.35, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.4);
    ctx.lineTo(w * 0.55, h * 0.25);
    ctx.stroke();
    /* Траектории заданы вручную: ускорения, преследование и бегство — всё, что нужно
       аппарату чтения намерений. Ни лиц, ни тел. */
    const big: [number, number] = [w * (0.62 + 0.2 * Math.sin(el * 0.7)), h * (0.5 + 0.18 * Math.sin(el * 1.1))];
    const small: [number, number] = [w * (0.2 + 0.25 * Math.max(0, Math.sin(el * 0.9 - 1))), h * (0.45 + 0.25 * Math.cos(el * 0.8))];
    const circ: [number, number] = [w * (0.3 + 0.3 * Math.sin(el * 0.5 + 2)), h * (0.6 + 0.2 * Math.sin(el * 1.4))];
    const tri = (p: [number, number], size: number, rot: number, fill: string) => {
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.rotate(rot);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(-size * 0.7, size * 0.7);
      ctx.lineTo(-size * 0.7, -size * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    tri(big, h * 0.09, el * 0.6, '#2b2b33');
    tri(small, h * 0.055, -el * 0.9, '#6f7682');
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(circ[0], circ[1], h * 0.045, 0, Math.PI * 2);
    ctx.fill();
  });
  const stage = k.stage;
  k.button('play', () => {
    t0 = performance.now();
    stage.innerHTML = '<p class="ill-q">что здесь произошло? Опишите своими словами.</p><textarea class="ill-text" rows="3" placeholder="…"></textarea>';
    k.say('почти никто не описывает это геометрическими словами.');
  });
  k.loop(() => { if (t0 > 0) s.draw(); });
});

const COLOURS: [string, string][] = [['красный', '#d8342c'], ['синий', '#2f62d0'], ['зелёный', '#2e8b45'], ['жёлтый', '#d6a41a']];

export const stroop: Mount = demo((k) => {
  const stage = k.stage;
  let i = 0, t0 = 0;
  const times: { congruent: boolean; ms: number }[] = [];
  const trials: [number, number][] = [];
  const r = rnd(Date.now() % 99991);
  for (let n = 0; n < 20; n++) {
    const word = Math.floor(r() * 4);
    const ink = n % 2 === 0 ? word : (word + 1 + Math.floor(r() * 3)) % 4;
    trials.push([word, ink]);
  }
  const render = () => {
    if (i >= trials.length) {
      const c = times.filter((t) => t.congruent);
      const inc = times.filter((t) => !t.congruent);
      const mean = (a: typeof times) => a.reduce((s, t) => s + t.ms, 0) / Math.max(a.length, 1);
      stage.innerHTML = '';
      k.say(`согласованные ${Math.round(mean(c))} мс, рассогласованные ${Math.round(mean(inc))} мс. Ваша цена помехи — ${Math.round(mean(inc) - mean(c))} мс.`);
      return;
    }
    const [word, ink] = trials[i];
    stage.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'ill-word';
    p.style.color = COLOURS[ink][1];
    p.textContent = COLOURS[word][0];
    stage.append(p);
    const row = document.createElement('div');
    row.className = 'ill-answers';
    COLOURS.forEach(([name, hex], idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.style.borderColor = hex;
      b.textContent = name;
      b.onclick = () => {
        if (idx === ink) {
          times.push({ congruent: word === ink, ms: performance.now() - t0 });
          i++;
          t0 = performance.now();
          render();
        }
      };
      row.append(b);
    });
    stage.append(row);
  };
  k.button('start', (el) => {
    el.disabled = true;
    i = 0;
    times.length = 0;
    t0 = performance.now();
    k.say('называйте цвет чернил, а не слово. Двадцать проб.');
    render();
  });
});

export const montyHall: Mount = demo((k) => {
  const stage = k.stage;
  let stayWins = 0, stayN = 0, switchWins = 0, switchN = 0;
  let curve: [number, number][] = [];
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!curve.length) return;
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    curve.forEach(([, sw], i) => {
      const x = (i / curve.length) * w;
      const y = h - 6 - sw * (h - 12);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.strokeStyle = '#3b6fd0';
    ctx.beginPath();
    curve.forEach(([st], i) => {
      const x = (i / curve.length) * w;
      const y = h - 6 - st * (h - 12);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('красная — менять, синяя — оставлять', 4, 12);
  });
  const play = () => {
    const r = rnd(Date.now() % 88883);
    const car = Math.floor(r() * 3);
    stage.innerHTML = '<p class="ill-q">три двери, за одной машина. Выбирайте.</p>';
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (let d = 0; d < 3; d++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = `дверь ${d + 1}`;
      b.onclick = () => {
        /* Ведущий знает, где машина, и открывает заведомо пустую — его действие
           несёт сведения, и потому двери не симметричны. */
        let open = 0;
        for (let x = 0; x < 3; x++) if (x !== d && x !== car) { open = x; break; }
        const other = [0, 1, 2].find((x) => x !== d && x !== open)!;
        stage.innerHTML = `<p class="ill-q">ведущий открыл дверь ${open + 1} — она пустая. Что делаете?</p>`;
        const row2 = document.createElement('div');
        row2.className = 'ill-answers';
        for (const [label, choice] of [['оставить', d], ['поменять', other]] as const) {
          const bb = document.createElement('button');
          bb.type = 'button';
          bb.className = 'ill-btn';
          bb.textContent = label;
          bb.onclick = () => {
            const win = choice === car;
            if (label === 'оставить') { stayN++; if (win) stayWins++; } else { switchN++; if (win) switchWins++; }
            k.say(`${win ? 'машина' : 'коза'}. Ваш счёт: оставляли ${stayWins}/${stayN}, меняли ${switchWins}/${switchN}.`);
            play();
          };
          row2.append(bb);
        }
        stage.append(row2);
      };
      row.append(b);
    }
    stage.append(row);
  };
  k.button('sim', () => {
    const r = rnd(Date.now() % 77773);
    let st = 0, sw = 0;
    curve = [];
    for (let i = 1; i <= 10000; i++) {
      const car = Math.floor(r() * 3);
      const pick = Math.floor(r() * 3);
      if (pick === car) st++; else sw++;
      if (i % 50 === 0) curve.push([st / i, sw / i]);
    }
    chart.draw();
    k.say(`на десяти тысячах партий: оставлять — ${((st / 10000) * 100).toFixed(1)} %, менять — ${((sw / 10000) * 100).toFixed(1)} %.`);
  });
  k.button('reset', () => { stayWins = stayN = switchWins = switchN = 0; curve = []; chart.draw(); play(); });
  play();
});

export const anchoring: Mount = demo((k) => {
  const stage = k.stage;
  const answers: { anchor: number; guess: number }[] = [];
  const high = Math.random() > 0.5;
  const anchor = high ? 1200 : 80;
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!answers.length) return;
    ctx.fillStyle = MARK;
    answers.forEach((a) => {
      const x = Math.min(1, a.guess / 2000) * (w - 20) + 10;
      ctx.beginPath();
      ctx.arc(x, h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText('0', 4, h - 4);
    ctx.fillText('2000 км', w - 54, h - 4);
  });
  /* Якорь достаётся честно случайно, и разбор идёт сразу после ответа. */
  stage.innerHTML = `<p class="ill-q">Длина Днепра больше или меньше ${anchor} км?</p>`;
  const row = document.createElement('div');
  row.className = 'ill-answers';
  for (const label of ['больше', 'меньше']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      stage.innerHTML = '<p class="ill-q">А сколько именно, по-вашему?</p>';
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.className = 'ill-num';
      inp.placeholder = 'км';
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = 'ответить';
      ok.onclick = () => {
        const g = Number(inp.value);
        if (!g) return;
        answers.push({ anchor, guess: g });
        chart.draw();
        stage.innerHTML = '';
        k.say(`вы ответили ${g} км. Число ${anchor}, которое вы видели до вопроса, выпало вам случайно и к Днепру отношения не имеет — а оценки тех, кому выпало другое, систематически другие. Настоящая длина — 2201 км.`);
      };
      stage.append(inp, ok);
    };
    row.append(b);
  }
  stage.append(row);
});

export const lindaProblem: Mount = demo((k) => {
  const stage = k.stage;
  /* Вопрос задаётся до всяких объяснений: в этом вся конструкция. */
  stage.innerHTML = '<p class="ill-q">Лине 31 год, она не замужем, говорит прямо и очень неглупа. В университете изучала философию, занималась вопросами справедливости и ходила на демонстрации. Что вероятнее?</p>';
  const row = document.createElement('div');
  row.className = 'ill-answers ill-answers-col';
  for (const [label, ok] of [['Лина — кассир в банке', true], ['Лина — кассир в банке и участвует в феминистском движении', false]] as const) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      stage.innerHTML = '<p class="ill-q">Множество «кассир и феминистка» целиком лежит внутри множества «кассир». Второе не может быть вероятнее первого ни при каком описании.</p>';
      k.say(ok
        ? 'вы выбрали то, что не может быть менее вероятным. Большинство выбирает второе.'
        : 'так отвечает большинство. Есть и возражение: услышав «кассир», собеседник понимает «кассир и больше ничего» — тогда это не провал логики, а нормальный разговорный вывод.');
    };
    row.append(b);
  }
  stage.append(row);
});

export const illusionOfControl: Mount = demo((k) => {
  let lit = false, presses = 0, hits = 0, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = lit ? '#f5d020' : '#6f6f78';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
  const stage = k.stage;
  k.button('press', () => {
    presses++;
    /* Кнопка не подключена ни к чему: лампа зажигается случайно и сама по себе. */
    if (lit) hits++;
    if (presses === 15) {
      stage.innerHTML = '<p class="ill-q">Насколько вы управляли лампой? От 0 до 10.</p>';
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = '0';
      inp.max = '10';
      inp.value = '5';
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = 'ответить';
      ok.onclick = () => {
        stage.innerHTML = '';
        k.say(`вы оценили своё влияние в ${inp.value} из 10. Кнопка не была подключена ни к чему: лампа всё это время зажигалась сама, и совпало ${hits} раз из ${presses}.`);
      };
      stage.append(inp, ok);
    }
  });
  k.loop((now) => {
    if (now - t > 0.9) { t = now; lit = Math.random() > 0.55; s.draw(); }
  });
});

export const intentionalBinding: Mount = demo((k) => {
  let angle = 0, running = false, pressAt = -1, toneAt = -1, t0 = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + R * 0.9 * Math.cos(a), cy + R * 0.9 * Math.sin(a));
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.stroke();
    }
    ctx.strokeStyle = MARK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * 0.85 * Math.cos(angle - Math.PI / 2), cy + R * 0.85 * Math.sin(angle - Math.PI / 2));
    ctx.stroke();
  });
  const stage = k.stage;
  k.button('start', () => {
    running = true;
    pressAt = -1;
    toneAt = -1;
    t0 = performance.now();
    stage.innerHTML = '<p class="ill-q">нажмите пробел в любой момент — через четверть секунды прозвучит сигнал.</p>';
    k.say('часы Либета: стрелка делает оборот за 2,56 с.');
  });
  k.space((down) => {
    if (!down || !running || pressAt >= 0) return;
    pressAt = performance.now();
    const ctxA = new AudioContext();
    const osc = ctxA.createOscillator();
    const g = ctxA.createGain();
    osc.frequency.value = 880;
    g.gain.value = 0.15;
    osc.connect(g).connect(ctxA.destination);
    setTimeout(() => {
      toneAt = performance.now();
      osc.start();
      osc.stop(ctxA.currentTime + 0.08);
      setTimeout(() => ctxA.close(), 300);
      running = false;
      stage.innerHTML = '<p class="ill-q">где стояла стрелка, когда вы нажали?</p>';
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = '0';
      inp.max = '2560';
      inp.value = '0';
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = 'ответить';
      ok.onclick = () => {
        const real = ((pressAt - t0) % 2560);
        const err = Number(inp.value) - real;
        stage.innerHTML = '';
        k.say(`ваша оценка разошлась с настоящим моментом на ${Math.round(err)} мс. При произвольном действии оценка обычно сдвигается позже, а оценка звука — раньше: они сближаются.`);
      };
      stage.append(inp, ok);
    }, 250);
  });
  k.loop(() => {
    if (running) { angle = (((performance.now() - t0) % 2560) / 2560) * Math.PI * 2; s.draw(); }
  });
});

/* Списки строятся для русского, а не переводятся: ассоциативная структура перевода
   не переживает, и приманка перестаёт работать. */
const DRM_LIST = ['кровать', 'отдых', 'бодрствовать', 'устал', 'мечта', 'будильник', 'дремота', 'одеяло', 'храп', 'зевать', 'ночь', 'покой', 'подушка', 'сновидение'];
const DRM_LURE = 'сон';

export const drmFalseMemory: Mount = demo((k) => {
  const stage = k.stage;
  k.button('start', async (el) => {
    el.disabled = true;
    for (const word of DRM_LIST) {
      stage.innerHTML = `<p class="ill-word">${word}</p>`;
      await new Promise((r) => setTimeout(r, 900));
    }
    stage.innerHTML = '<p class="ill-q">теперь посчитайте вслух от 30 до 1. Не торопитесь.</p>';
    await new Promise((r) => setTimeout(r, 6000));
    const probes = ['подушка', DRM_LURE, 'телефон', 'ночь'];
    const said: Record<string, boolean> = {};
    for (const p of probes) {
      await new Promise<void>((resolve) => {
        stage.innerHTML = `<p class="ill-q">слово «${p}» было в списке?</p>`;
        const row = document.createElement('div');
        row.className = 'ill-answers';
        for (const [label, yes] of [['было', true], ['не было', false]] as const) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'ill-btn';
          b.textContent = label;
          b.onclick = () => { said[p] = yes; resolve(); };
          row.append(b);
        }
        stage.append(row);
      });
    }
    stage.innerHTML = '';
    el.disabled = false;
    k.say(said[DRM_LURE]
      ? `слова «${DRM_LURE}» в списке не было ни разу. Вы его помните, потому что извлечение восстанавливает смысл, а не проигрывает запись.`
      : `вы устояли: слова «${DRM_LURE}» действительно не было. Большинство его вспоминает — и уверенно.`);
  });
});

export const choiceBlindness: Mount = demo((k) => {
  const stage = k.stage;
  const r = rnd(Date.now() % 65521);
  const card = (seed: number) => {
    const rr = rnd(seed);
    let svg = '<svg viewBox="0 0 100 100" class="ill-card">';
    for (let i = 0; i < 6; i++)
      svg += `<circle cx="${(rr() * 100).toFixed(1)}" cy="${(rr() * 100).toFixed(1)}" r="${(6 + rr() * 18).toFixed(1)}" fill="hsl(${Math.round(rr() * 360)} 55% 55%)" opacity="0.8"/>`;
    return svg + '</svg>';
  };
  const a = Math.floor(r() * 1e6), b = Math.floor(r() * 1e6);
  stage.innerHTML = '<p class="ill-q">какая картинка вам нравится больше?</p>';
  const row = document.createElement('div');
  row.className = 'ill-answers';
  [a, b].forEach((seed, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ill-pick';
    btn.innerHTML = card(seed);
    btn.onclick = () => {
      /* Возвращается отвергнутая карточка. Разбор идёт сразу же после ответа. */
      const shown = i === 0 ? b : a;
      stage.innerHTML = `<p class="ill-q">вы выбрали эту. Почему?</p>${card(shown)}`;
      const t = document.createElement('textarea');
      t.className = 'ill-text';
      t.rows = 2;
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = 'ответить';
      ok.onclick = () => {
        stage.innerHTML = '';
        k.say('вам вернули ту картинку, которую вы отвергли. Подмену замечает примерно один человек из восьми; остальные объясняют выбор подробно и убедительно. Отчёт о собственном решении собирается задним числом — записи решения просто нет.');
      };
      stage.append(t, ok);
    };
    row.append(btn);
  });
  stage.append(row);
});

export const boubaKiki: Mount = demo((k) => {
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.3;
    ctx.fillStyle = '#2b2b33';
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      const r = R * (1 + 0.28 * Math.sin(a * 4));
      const x = w * 0.28 + r * Math.cos(a), y = h / 2 + r * Math.sin(a);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const r = R * (i % 2 ? 0.5 : 1.2);
      const x = w * 0.72 + r * Math.cos(a), y = h / 2 + r * Math.sin(a);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  });
  const stage = k.stage;
  stage.innerHTML = '<p class="ill-q">какая из них «буба», а какая «кики»?</p>';
  const row = document.createElement('div');
  row.className = 'ill-answers';
  for (const [label, typical] of [['слева буба, справа кики', true], ['слева кики, справа буба', false]] as const) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      stage.innerHTML = '';
      k.say(typical
        ? 'так отвечают девять человек из десяти, в большинстве языков и систем письма. Округлым губам отвечает округлый контур, резкому взрыву — угол.'
        : 'необычный ответ: так отвечает примерно один из десяти. Межкультурная работа 2022 года нашла языки, в которых эффект слабее, — и это честная версия утверждения.');
    };
    row.append(b);
  }
  stage.append(row);
});

export const kappaEffect: Mount = demo((k) => {
  let pos = 50, t0 = -1;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const xs = [w * 0.1, w * (0.1 + (pos / 100) * 0.8), w * 0.9];
    const el = t0 < 0 ? -1 : (performance.now() - t0) / 1000;
    ctx.fillStyle = INK;
    xs.forEach((x, i) => {
      /* Интервалы по времени всегда равны: 0,4 с между вспышками. */
      const on = el >= i * 0.4 && el < i * 0.4 + 0.12;
      if (on || el < 0) {
        ctx.beginPath();
        ctx.arc(x, h / 2, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });
  k.slider('pos', (v) => { pos = v; s.draw(); });
  k.button('go', () => {
    t0 = performance.now();
    k.say('интервалы по времени равны — по 0,4 с. Если средняя вспышка стоит не посередине, они перестают быть равными на слух и на глаз.');
  });
  k.loop(() => { if (t0 > 0) s.draw(); });
});

export const oddballEffect: Mount = demo((k) => {
  let idx = -1, t0 = 0;
  const seq = [0, 0, 0, 0, 1, 0, 0];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (idx < 0 || idx >= seq.length) return;
    const odd = seq[idx] === 1;
    ctx.fillStyle = odd ? MARK : '#3b6fd0';
    const R = Math.min(w, h) * 0.3;
    ctx.beginPath();
    if (odd) ctx.rect(w / 2 - R, h / 2 - R, R * 2, R * 2);
    else ctx.arc(w / 2, h / 2, R, 0, Math.PI * 2);
    ctx.fill();
  });
  const stage = k.stage;
  k.button('go', async () => {
    /* Длительность у всех кадров одна: 400 мс, включая необычный. */
    for (let i = 0; i < seq.length; i++) {
      idx = i;
      s.draw();
      await new Promise((r) => setTimeout(r, 400));
      idx = -1;
      s.draw();
      await new Promise((r) => setTimeout(r, 90));
    }
    stage.innerHTML = '<p class="ill-q">сколько длился красный квадрат по сравнению с кругами?</p>';
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, over] of [['дольше', true], ['столько же', false], ['короче', false]] as const) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = label;
      b.onclick = () => {
        stage.innerHTML = '';
        k.say(over
          ? 'все кадры шли ровно по 400 мс, включая красный. Внимание ускоряет обработку, а больше обработки читается как больше времени.'
          : 'вы устояли. Большинство говорит «дольше» — все кадры шли ровно по 400 мс.');
      };
      row.append(b);
    }
    stage.append(row);
  });
});

export const representationalMomentum: Mount = demo((k) => {
  let t0 = -1, stopX = 0, done = false;
  const errs: number[] = [];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (t0 < 0) return;
    const el = (performance.now() - t0) / 1000;
    if (el > 1.2) { done = true; return; }
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(w * 0.1 + (stopX - w * 0.1) * (el / 1.2), h / 2, 14, 0, Math.PI * 2);
    ctx.fill();
  });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  canvas?.addEventListener('click', (ev) => {
    if (!done) return;
    const r = canvas.getBoundingClientRect();
    const x = ev.clientX - r.left;
    errs.push(x - stopX);
    const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
    k.say(`${errs.length} попыток, средний промах ${mean > 0 ? '+' : ''}${mean.toFixed(0)} px по ходу движения. Систематический сдвиг вперёд — это и есть инерция представления.`);
    done = false;
    t0 = -1;
    s.draw();
  });
  k.button('go', () => {
    const w = canvas.clientWidth;
    stopX = w * (0.4 + Math.random() * 0.45);
    t0 = performance.now();
    done = false;
    k.say('запомните, где он остановился, и щёлкните там.');
  });
  k.loop(() => { if (t0 > 0) s.draw(); });
});

export const chronostasis: Mount = demo((k) => {
  let show = false, secs = 0, t0 = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(w * 0.12, h / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    if (!show) return;
    ctx.fillStyle = INK;
    ctx.font = `bold ${Math.round(Math.min(w, h) * 0.4)}px ui-monospace, monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(secs).padStart(2, '0'), w * 0.92, h / 2);
  });
  k.button('go', () => {
    show = true;
    secs = 0;
    t0 = performance.now();
    k.say('смотрите на красную точку слева, потом резко переведите взгляд на счётчик справа. Первая цифра простоит дольше секунды.');
  });
  k.loop(() => {
    if (!show) return;
    const n = Math.floor((performance.now() - t0) / 1000);
    if (n !== secs) { secs = n; s.draw(); }
  });
  k.say('настоящие стрелочные часы работают лучше и стоят дешевле — это тот случай, когда экран проигрывает предмету.');
});

export const pseudoHaptics: Mount = demo((k) => {
  let mode = 'bump', px = 0, py = 0, dragging = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!px) { px = w / 2; py = h / 2; }
    ctx.fillStyle = '#e0e3ea';
    if (mode === 'bump') {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === 'friction') ctx.fillRect(w * 0.35, 0, w * 0.3, h);
    else if (mode === 'sticky') {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fill();
  });
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  let lastX = 0, lastY = 0;
  canvas?.addEventListener('pointerdown', (ev) => { dragging = true; lastX = ev.offsetX; lastY = ev.offsetY; canvas.setPointerCapture(ev.pointerId); });
  canvas?.addEventListener('pointerup', () => { dragging = false; });
  canvas?.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let dx = ev.offsetX - lastX, dy = ev.offsetY - lastY;
    /* Ни к руке, ни к мыши ничего не прикладывается: меняется только передаточное
       отношение между движением руки и движением шайбы. */
    const d = Math.hypot(px - w / 2, py - h / 2);
    if (mode === 'bump') {
      const R = Math.min(w, h) * 0.3;
      const gain = d < R ? 0.45 + (d / R) * 0.55 : 1;
      dx *= gain; dy *= gain;
    } else if (mode === 'friction' && px > w * 0.35 && px < w * 0.65) { dx *= 0.35; dy *= 0.35; }
    else if (mode === 'sticky' && d < Math.min(w, h) * 0.2) { dx *= 0.15; dy *= 0.15; }
    else if (mode === 'weight') { dx *= 0.4; dy *= 0.4; }
    px += dx; py += dy;
    lastX = ev.offsetX; lastY = ev.offsetY;
    s.draw();
  });
  k.select('mode', (v) => { mode = v; k.say('мышь при этом не умеет ничего. Ощущение целиком собрано из расхождения между командой и результатом.'); });
});

export const vection: Mount = demo((k) => {
  let go = false, speed = 8, t = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#10131c';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    /* Текстурированный тоннель: большое поле движения читается как своё движение. */
    for (let i = 0; i < 24; i++) {
      const p = ((i / 24 + (go ? (t * speed) / 40 : 0)) % 1);
      const r = Math.max(0.001, p * p * Math.max(w, h) * 0.8);
      ctx.strokeStyle = `rgba(140,170,220,${0.15 + p * 0.7})`;
      ctx.lineWidth = 1 + p * 4;
      ctx.beginPath();
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  });
  k.toggle('go', (v) => {
    go = v;
    k.say(v ? 'если станет мутить — жмите «остановить» немедленно. Векция без согласованного вестибулярного сигнала — это ровно тот конфликт, от которого укачивает.' : 'остановлено.');
  });
  k.slider('speed', (v) => { speed = v; });
  k.loop((now) => { t = now; s.draw(); });
});

export const somatogravic: Mount = demo((k) => {
  let accel = 40;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.4, cy = h * 0.3;
    const g = h * 0.45;
    const a = (accel / 100) * g;
    const arrow = (x1: number, y1: number, x2: number, y2: number, col: string, label: string) => {
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(label, x2 + 6, y2);
    };
    arrow(cx, cy, cx, cy + g, '#6f7682', 'тяжесть');
    arrow(cx, cy, cx - a, cy, '#3b6fd0', 'ускорение');
    arrow(cx, cy, cx - a, cy + g, MARK, 'то, что меряют отолиты');
  });
  k.slider('accel', (v) => {
    accel = v;
    s.draw();
    k.say('отолиты меряют сумму и разложить её на слагаемые не могут. Это не сбой обработки: сведений, чтобы различить разгон и задирание носа, в сигнале физически нет.');
  });
});

export const falseHeartRateFeedback: Mount = demo((k) => {
  const stage = k.stage;
  let ctxA: AudioContext | null = null;
  let timer = 0;
  const beat = (bpm: number) => {
    if (!ctxA) ctxA = new AudioContext();
    const t = ctxA.currentTime;
    const osc = ctxA.createOscillator();
    const g = ctxA.createGain();
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g).connect(ctxA.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  };
  k.button('go', async (el) => {
    el.disabled = true;
    const fast = Math.random() > 0.5;
    const bpm = fast ? 105 : 62;
    stage.innerHTML = '<p class="ill-q">послушайте несколько секунд и посмотрите на узор.</p><div class="ill-swatch"></div>';
    const sw = stage.querySelector('.ill-swatch') as HTMLElement;
    sw.style.background = 'conic-gradient(#d8342c, #2f62d0, #2e8b45, #d6a41a, #d8342c)';
    clearInterval(timer);
    timer = window.setInterval(() => beat(bpm), 60000 / bpm);
    await new Promise((r) => setTimeout(r, 9000));
    clearInterval(timer);
    ctxA?.close();
    ctxA = null;
    stage.innerHTML = '<p class="ill-q">насколько узор вам понравился? От 0 до 10.</p>';
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = '0'; inp.max = '10'; inp.value = '5';
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'ill-btn';
    ok.textContent = 'ответить';
    ok.onclick = () => {
      stage.innerHTML = '';
      el.disabled = false;
      /* Обман кончается здесь и сразу, а не в конце страницы. */
      k.say(`оценка ${inp.value} из 10. Скажем прямо: этот звук никогда не был вашим пульсом. Он шёл с частотой ${bpm} ударов в минуту, выпавшей случайно, и в опыте Валинса именно такая подмена сдвигала оценки.`);
    };
    stage.append(inp, ok);
  });
});

export const missingSquarePuzzle: Mount = demo((k) => {
  let swap = false, ruler = false, exag = 1;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const u = Math.min(w / 14, h / 6);
    const x0 = (w - u * 13) / 2, y0 = h * 0.8;
    const ey = (v: number) => y0 - v * u * exag;
    /* Гипотенуза никогда не была прямой: у двух малых треугольников разный наклон. */
    ctx.strokeStyle = '#c9ccd4';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 13; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * u, ey(0)); ctx.lineTo(x0 + i * u, ey(5)); ctx.stroke(); }
    for (let i = 0; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(x0, ey(i)); ctx.lineTo(x0 + 13 * u, ey(i)); ctx.stroke(); }
    const tri = (px: number, py: number, bw: number, bh: number, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x0 + px * u, ey(py));
      ctx.lineTo(x0 + (px + bw) * u, ey(py));
      ctx.lineTo(x0 + (px + bw) * u, ey(py + bh));
      ctx.closePath();
      ctx.fill();
    };
    if (!swap) { tri(0, 0, 8, 3, '#d8342c'); tri(8, 0, 5, 2, '#2e8b45'); }
    else { tri(0, 0, 5, 2, '#2e8b45'); tri(5, 0, 8, 3, '#d8342c'); }
    if (ruler) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, ey(0));
      ctx.lineTo(x0 + 13 * u, ey(5));
      ctx.stroke();
    }
  });
  k.toggle('swap', (v) => { swap = v; s.draw(); });
  k.toggle('ruler', (v) => { ruler = v; s.draw(); });
  k.slider('exag', (v) => {
    exag = v;
    s.draw();
    k.say(v > 3 ? 'при растянутой вертикали видно: гипотенуза изгибается в одну сторону и в другую. Разница площадей ровно одна клетка.' : 'наклоны 3/8 и 2/5 отличаются примерно на градус. Глаз тут не ошибается — его просто просят различить градус.');
  });
});

export const moire: Mount = demo((k) => {
  let rot = 4, pitch = 6;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    const layer = (angle: number, p: number) => {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      const R = Math.hypot(w, h);
      for (let x = -R; x < R; x += p * 2) ctx.fillRect(x, -R, p, R * 2);
      ctx.restore();
    };
    layer(0, 6);
    layer(rot, pitch);
  });
  k.slider('rot', (v) => { rot = v; s.draw(); });
  k.slider('pitch', (v) => { pitch = v; s.draw(); });
  k.say('узор физически есть в изображении: обманываться здесь нечему, и камера снимет его так же.');
});
