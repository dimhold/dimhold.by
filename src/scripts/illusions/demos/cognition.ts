/* Мышление, время, авторство и псевдогаптика. Часть этих демонстраций — настоящие
   опыты: они спрашивают до объяснения, записывают ответ и только потом разбирают.
   Где есть обман, разбор идёт сразу, а не в конце страницы. */
import { demo, grey, INK, MARK, PAPER, rnd, type Mount } from '../kit';
import { num, pageLang, tr } from '../i18n';

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
    /* Второй квадрат доезжает до правого края целиком, а не уезжает за холст. */
    ctx.fillRect(meet + q + (w * 0.96 - q - meet - q) * b, cy, q, q);
  });
  k.slider('delay', (v) => {
    delay = v;
    if (t0 >= 0) t0 = performance.now();
    k.say(v === 0 ? tr('это столкновение: причину видно так же прямо, как цвет.') : v > 150 ? tr('причинность вытекла: два несвязанных события, и никакое знание её не возвращает.') : tr('причинность слабеет.'));
  });
  k.button('go', () => { t0 = performance.now(); });
  /* Первый показ — когда демонстрация впервые попала на экран, а не при загрузке
     страницы: иначе к тому времени, как до неё долистают, всё уже кончилось. */
  k.loop((now) => { if (t0 < 0) t0 = now * 1000; s.draw(); });
});

/* Сюжет по ключевым точкам [время, x, y] в долях холста: большой треугольник выходит из
   дома, теснит малый, круг тем временем прячется в доме, большой гонится за ним внутри,
   круг выскальзывает, дверь закрывается, и большой бьётся в стены, а двое уходят.
   Сквозь стены не проходит никто: в дом и из дома — только через открытую дверь. */
type Key = [number, number, number];
const HS_LEN = 18;
const HS_BIG: Key[] = [[0, 0.75, 0.5], [2, 0.68, 0.4], [3, 0.68, 0.47], [4.5, 0.45, 0.47], [5.5, 0.38, 0.4], [6, 0.33, 0.36], [6.6, 0.36, 0.4], [7.2, 0.3, 0.33], [8, 0.45, 0.46], [8.8, 0.62, 0.465], [10, 0.76, 0.38], [11, 0.82, 0.64], [12, 0.65, 0.465], [12.6, 0.6, 0.465], [13.4, 0.72, 0.36], [14, 0.6, 0.46], [14.4, 0.67, 0.46], [14.8, 0.6, 0.47], [16, 0.8, 0.62], [18, 0.75, 0.5]];
const HS_SMALL: Key[] = [[0, -0.08, 0.42], [3, 0.35, 0.42], [4.5, 0.38, 0.42], [5.5, 0.3, 0.38], [6, 0.25, 0.33], [6.6, 0.27, 0.36], [7.2, 0.2, 0.28], [8, 0.18, 0.3], [9.5, 0.42, 0.34], [11.5, 0.45, 0.34], [12.2, 0.46, 0.36], [13, 0.38, 0.44], [14, 0.27, 0.46], [16, -0.1, 0.48], [18, -0.1, 0.48]];
const HS_CIRC: Key[] = [[0, -0.1, 0.58], [3, 0.33, 0.58], [4.5, 0.25, 0.65], [6, 0.3, 0.6], [6.6, 0.45, 0.47], [7.2, 0.62, 0.465], [8, 0.72, 0.6], [9, 0.8, 0.66], [10, 0.83, 0.66], [11, 0.68, 0.62], [11.6, 0.62, 0.465], [12.2, 0.47, 0.52], [13, 0.42, 0.58], [14, 0.3, 0.56], [16, -0.12, 0.56], [18, -0.12, 0.56]];
/* Дверь открыта с 3 до 12,2 с; распахивается и закрывается за 0,4 с. */
const hsDoor = (t: number) => Math.max(0, Math.min(1, (t - 3) / 0.4, (12.2 - t) / 0.4));

/* Гладкий путь через точки (сплайн Эрмита): живое движение разгоняется и тормозит,
   а не ломается на каждой точке. */
function hsAt(keys: Key[], t: number): [number, number] {
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1][0] <= t) i++;
  const [ta, xa, ya] = keys[i], [tb, xb, yb] = keys[i + 1];
  const span = tb - ta;
  const u = Math.max(0, Math.min(1, (t - ta) / span));
  const tan = (j: number, c: 1 | 2) => {
    const p = keys[Math.max(0, j - 1)], n = keys[Math.min(keys.length - 1, j + 1)];
    return j === 0 || j === keys.length - 1 ? 0 : ((n[c] - p[c]) / (n[0] - p[0])) * span;
  };
  const h00 = 2 * u ** 3 - 3 * u * u + 1, h10 = u ** 3 - 2 * u * u + u, h01 = -2 * u ** 3 + 3 * u * u, h11 = u ** 3 - u * u;
  return [h00 * xa + h10 * tan(i, 1) + h01 * xb + h11 * tan(i + 1, 1), h00 * ya + h10 * tan(i, 2) + h01 * yb + h11 * tan(i + 1, 2)];
}

export const heiderSimmelAnimacy: Mount = demo((k) => {
  let t0 = -1;
  const heading = [0, 0];
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* До показа — стоп-кадр из середины сюжета, где видны все трое. */
    const el = t0 < 0 ? 4 : ((performance.now() - t0) / 1000) % HS_LEN;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    /* Дом: левая стена с проёмом от 0,38 до 0,55 высоты; створка на петле сверху. */
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.38);
    ctx.lineTo(w * 0.55, h * 0.25);
    ctx.lineTo(w * 0.9, h * 0.25);
    ctx.lineTo(w * 0.9, h * 0.75);
    ctx.lineTo(w * 0.55, h * 0.75);
    ctx.lineTo(w * 0.55, h * 0.55);
    ctx.stroke();
    const swing = hsDoor(el) * 1.3;
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.38);
    ctx.lineTo(w * 0.55 - Math.sin(swing) * h * 0.17, h * 0.38 + Math.cos(swing) * h * 0.17);
    ctx.stroke();
    const pos = (keys: Key[]) => { const [x, y] = hsAt(keys, el); return [x * w, y * h] as [number, number]; };
    const dir = (keys: Key[], j: number) => {
      const [x1, y1] = hsAt(keys, Math.max(0, el - 0.05)), [x2, y2] = hsAt(keys, Math.min(HS_LEN, el + 0.05));
      const dx = (x2 - x1) * w, dy = (y2 - y1) * h;
      if (Math.hypot(dx, dy) > 0.5) heading[j] = Math.atan2(dy, dx);
      return heading[j];
    };
    const big = pos(HS_BIG), small = pos(HS_SMALL), circ = pos(HS_CIRC);
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
    tri(big, h * 0.09, dir(HS_BIG, 0), '#2b2b33');
    tri(small, h * 0.055, dir(HS_SMALL, 1), '#6f7682');
    ctx.fillStyle = MARK;
    ctx.beginPath();
    ctx.arc(circ[0], circ[1], h * 0.045, 0, Math.PI * 2);
    ctx.fill();
  });
  const stage = k.stage;
  k.button('play', () => {
    t0 = performance.now();
    stage.innerHTML = `<p class="ill-q">${tr('что здесь произошло? Опишите своими словами.')}</p><textarea class="ill-text" rows="3" placeholder="…"></textarea>`;
    k.say(tr('почти никто не описывает это геометрическими словами.'));
  });
  k.loop(() => { if (t0 > 0) s.draw(); });
});

/* Слова цвета — на языке читателя: помеха Струпа идёт от автоматического чтения,
   а автоматически читается только свой язык. */
const COLOURS: [string, string][] = [[tr('красный'), '#d8342c'], [tr('синий'), '#2f62d0'], [tr('зелёный'), '#2e8b45'], [tr('жёлтый'), '#d6a41a']];

export const stroop: Mount = demo((k) => {
  const stage = k.stage;
  let i = 0, t0 = 0, errors = 0, running = false;
  const times: { congruent: boolean; ms: number }[] = [];
  let trials: [number, number][] = [];
  /* Пробы перемешаны: чётные согласованные, нечётные нет. Ответ — кнопкой или
     клавишей 1–4; промах не засчитывается и считается ошибкой, время идёт до верного. */
  const answer = (idx: number) => {
    if (!running) return;
    const [word, ink] = trials[i];
    if (idx !== ink) { errors++; return; }
    times.push({ congruent: word === ink, ms: performance.now() - t0 });
    i++;
    render();
  };
  const render = () => {
    if (i >= trials.length) {
      running = false;
      const c = times.filter((t) => t.congruent);
      const inc = times.filter((t) => !t.congruent);
      const mean = (a: typeof times) => a.reduce((s, t) => s + t.ms, 0) / Math.max(a.length, 1);
      stage.innerHTML = '';
      if (start) start.disabled = false;
      k.say(tr('согласованные {c} мс, рассогласованные {i} мс. Ваша цена помехи — {d} мс. Ошибок: {e}.', { c: Math.round(mean(c)), i: Math.round(mean(inc)), d: Math.round(mean(inc) - mean(c)), e: errors }));
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
      b.textContent = `${idx + 1} · ${name}`;
      b.onclick = () => answer(idx);
      row.append(b);
    });
    stage.append(row);
    t0 = performance.now();
  };
  document.addEventListener('keydown', (ev) => {
    if (!running || ev.repeat || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const n = '1234'.indexOf(ev.key);
    if (n < 0) return;
    ev.preventDefault();
    answer(n);
  });
  const start = k.button('start', (el) => {
    el.disabled = true;
    const r = rnd(Date.now() % 99991);
    trials = [];
    for (let n = 0; n < 20; n++) {
      const word = Math.floor(r() * 4);
      const ink = n % 2 === 0 ? word : (word + 1 + Math.floor(r() * 3)) % 4;
      trials.push([word, ink]);
    }
    i = 0;
    errors = 0;
    times.length = 0;
    running = true;
    k.say(tr('называйте цвет чернил, а не слово: кнопкой или клавишей 1–4. Двадцать проб вперемешку.'));
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
    const yOf = (p: number) => h - 6 - p * (h - 12);
    /* Ориентиры: треть и две трети, к которым сходятся кривые. */
    ctx.strokeStyle = '#b9bcc4';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.fillStyle = '#6b6b70';
    ctx.font = '11px ui-monospace, monospace';
    for (const [p, label] of [[1 / 3, '1/3'], [2 / 3, '2/3']] as const) {
      ctx.beginPath();
      ctx.moveTo(0, yOf(p));
      ctx.lineTo(w, yOf(p));
      ctx.stroke();
      ctx.fillText(label, w - ctx.measureText(label).width - 4, yOf(p) - 4);
    }
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    for (const [col, j] of [[MARK, 1], ['#3b6fd0', 0]] as const) {
      ctx.strokeStyle = col;
      ctx.beginPath();
      curve.forEach((pt, i) => {
        const x = (i / curve.length) * w;
        i ? ctx.lineTo(x, yOf(pt[j])) : ctx.moveTo(x, yOf(pt[j]));
      });
      ctx.stroke();
    }
    ctx.fillStyle = '#6b6b70';
    ctx.fillText(tr('красная — менять, синяя — оставлять'), 4, 12);
  });
  const play = () => {
    const car = Math.floor(Math.random() * 3);
    stage.innerHTML = `<p class="ill-q">${tr('три двери, за одной машина. Выбирайте.')}</p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (let d = 0; d < 3; d++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = tr('дверь {n}', { n: d + 1 });
      b.onclick = () => {
        /* Ведущий знает, где машина, и открывает заведомо пустую — его действие
           несёт сведения, и потому двери не симметричны. Если пустых две (вы угадали
           сразу), он выбирает между ними наугад: иначе номер открытой двери выдавал бы,
           где машина. */
        const goats = [0, 1, 2].filter((x) => x !== d && x !== car);
        const open = goats[Math.floor(Math.random() * goats.length)];
        const other = [0, 1, 2].find((x) => x !== d && x !== open)!;
        stage.innerHTML = `<p class="ill-q">${tr('ведущий открыл дверь {n} — она пустая. Что делаете?', { n: open + 1 })}</p>`;
        const row2 = document.createElement('div');
        row2.className = 'ill-answers';
        for (const [label, choice, stay] of [[tr('оставить'), d, true], [tr('поменять'), other, false]] as const) {
          const bb = document.createElement('button');
          bb.type = 'button';
          bb.className = 'ill-btn';
          bb.textContent = label;
          bb.onclick = () => {
            const win = choice === car;
            if (stay) { stayN++; if (win) stayWins++; } else { switchN++; if (win) switchWins++; }
            const score = { sw: stayWins, sn: stayN, cw: switchWins, cn: switchN, c: car + 1 };
            k.say(win ? tr('машина. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.', score) : tr('коза, машина была за дверью {c}. Ваш счёт: оставляли {sw}/{sn}, меняли {cw}/{cn}.', score));
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
    k.say(tr('на десяти тысячах партий: оставлять — {st} %, менять — {sw} %.', { st: num((st / 10000) * 100), sw: num((sw / 10000) * 100) }));
  });
  k.button('reset', () => { stayWins = stayN = switchWins = switchN = 0; curve = []; chart.draw(); k.say(''); play(); });
  play();
});

export const anchoring: Mount = demo((k) => {
  const stage = k.stage;
  const high = Math.random() > 0.5;
  const anchor = high ? 1200 : 80;
  const TRUE_KM = 2201, MAX_KM = 3000;
  let guess = 0;
  /* После ответа — шкала: якорь, который вам выпал, ваш ответ и настоящая длина. */
  const chart = k.chart(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    /* До ответа шкалы нет: её края сами подсказали бы порядок величины. */
    if (!guess) return;
    const xOf = (km: number) => Math.min(1, km / MAX_KM) * (w - 20) + 10;
    const y = h * 0.55;
    ctx.strokeStyle = '#b9bcc4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillStyle = '#6b6b70';
    /* Концы шкалы — в верхних углах, чтобы подписи отметок под линией их не задевали. */
    ctx.fillText('0', 4, 12);
    const end = tr('{n} км', { n: MAX_KM });
    ctx.fillText(end, w - ctx.measureText(end).width - 4, 12);
    const mark = (km: number, col: string, label: string, up: boolean) => {
      const x = xOf(km);
      ctx.fillStyle = col;
      ctx.fillRect(x - 1, y - 10, 2, 20);
      const tw = ctx.measureText(label).width;
      ctx.fillText(label, Math.max(2, Math.min(w - tw - 2, x - tw / 2)), up ? y - 16 : y + 26);
    };
    mark(anchor, '#3b6fd0', tr('якорь {n}', { n: anchor }), true);
    mark(TRUE_KM, '#2e8b45', tr('Днепр {n}', { n: TRUE_KM }), true);
    mark(guess, MARK, tr('вы {n}', { n: guess }), false);
  });
  /* Якорь достаётся честно случайно, и разбор идёт сразу после ответа. */
  stage.innerHTML = `<p class="ill-q">${tr('Длина Днепра больше или меньше {n} км?', { n: anchor })}</p>`;
  const row = document.createElement('div');
  row.className = 'ill-answers';
  for (const label of [tr('больше'), tr('меньше')]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      stage.innerHTML = `<p class="ill-q">${tr('А сколько именно, по-вашему?')}</p>`;
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.min = '1';
      inp.className = 'ill-num';
      inp.placeholder = tr('км');
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = tr('ответить');
      ok.onclick = () => {
        const g = Math.round(Number(inp.value));
        if (!(g > 0)) return;
        guess = g;
        chart.draw();
        stage.innerHTML = '';
        k.say(tr('вы ответили {g} км. Число {a}, которое вы видели до вопроса, выпало вам случайно и к Днепру отношения не имеет — а оценки тех, кому выпало другое, систематически другие. Настоящая длина — 2201 км.', { g, a: anchor }));
      };
      stage.append(inp, ok);
      inp.focus();
    };
    row.append(b);
  }
  stage.append(row);
});

export const lindaProblem: Mount = demo((k) => {
  const stage = k.stage;
  /* Вопрос задаётся до всяких объяснений: в этом вся конструкция. */
  stage.innerHTML = `<p class="ill-q">${tr('Линде 31 год, она не замужем, говорит прямо и очень неглупа. В университете изучала философию, занималась вопросами справедливости и ходила на демонстрации. Что вероятнее?')}</p>`;
  const row = document.createElement('div');
  row.className = 'ill-answers ill-answers-col';
  for (const [label, ok] of [[tr('Линда — кассир в банке'), true], [tr('Линда — кассир в банке и участвует в феминистском движении'), false]] as const) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      /* Диаграмма множеств: меньшее целиком внутри большего. */
      const svg = `<svg viewBox="0 0 320 150" style="width:100%;max-width:26rem;display:block;margin-top:.4rem" role="img" aria-label="${tr('кассир')} ⊃ ${tr('кассир и феминистка')}">`
        + '<ellipse cx="160" cy="75" rx="150" ry="68" fill="#3b6fd0" fill-opacity="0.12" stroke="#3b6fd0" stroke-width="2"/>'
        + '<ellipse cx="205" cy="88" rx="70" ry="34" fill="#d2483f" fill-opacity="0.18" stroke="#d2483f" stroke-width="2"/>'
        + `<text x="40" y="50" font-size="14" fill="currentColor">${tr('кассир')}</text>`
        + `<text x="205" y="92" font-size="11" text-anchor="middle" fill="currentColor">${tr('кассир и феминистка')}</text></svg>`;
      stage.innerHTML = `<p class="ill-q">${tr('Множество «кассир и феминистка» целиком лежит внутри множества «кассир». Второе не может быть вероятнее первого ни при каком описании.')}</p>${svg}`;
      k.say(ok
        ? tr('вы выбрали то, что не может быть менее вероятным. Большинство выбирает второе.')
        : tr('так отвечает большинство. Есть и возражение: услышав «кассир», собеседник понимает «кассир и больше ничего» — тогда это не провал логики, а нормальный разговорный вывод.'));
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
  k.say(tr('попробуйте зажигать лампу кнопкой. Пятнадцать нажатий.'));
  k.button('press', () => {
    presses++;
    /* Кнопка не подключена ни к чему: лампа зажигается случайно и сама по себе. */
    if (lit) hits++;
    if (presses < 15) k.say(tr('нажатий: {n} из 15.', { n: presses }));
    if (presses === 15) {
      k.say('');
      stage.innerHTML = `<p class="ill-q">${tr('Насколько вы управляли лампой? От 0 до 10.')}</p>`;
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = '0';
      inp.max = '10';
      inp.value = '5';
      const out = document.createElement('output');
      out.textContent = ' 5 ';
      inp.oninput = () => { out.textContent = ` ${inp.value} `; };
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = tr('ответить');
      ok.onclick = () => {
        stage.innerHTML = '';
        k.say(tr('вы оценили своё влияние в {v} из 10. Кнопка не была подключена ни к чему: лампа всё это время зажигалась сама. Совпадений: {h} из {n}.', { v: inp.value, h: hits, n: presses }));
      };
      stage.append(inp, out, ok);
    }
  });
  k.loop((now) => {
    if (now - t > 0.9) { t = now; lit = Math.random() > 0.55; s.draw(); }
  });
});

export const intentionalBinding: Mount = demo((k) => {
  /* Опыт Хаггарда в упрощённом виде. Пробы чередуются: со звуком через 250 мс после
     нажатия и без звука. Сближение — это разница между ошибками оценки нажатия в двух
     видах проб, а не ошибка одной пробы. */
  const PERIOD = 2560;
  let phase: 'idle' | 'run' | 'after' | 'answer' | 'shown' = 'idle';
  let t0 = 0, pressAt = -1, stopAt = 0, judged = -1, tone = true, frameMs = 0;
  const errs: { tone: boolean; err: number }[] = [];
  const angleAt = (ms: number) => ((((ms - t0) % PERIOD) + PERIOD) % PERIOD) / PERIOD * Math.PI * 2;
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
    const hand = (angle: number, col: string) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * 0.85 * Math.cos(angle - Math.PI / 2), cy + R * 0.85 * Math.sin(angle - Math.PI / 2));
      ctx.stroke();
    };
    /* Пока идёт проба — настоящая стрелка; когда спрашиваем — только ваша, синяя;
       после ответа — обе: где стрелка была в момент нажатия и где вы её назвали. */
    if (phase === 'run' || phase === 'after') hand(angleAt(performance.now()), MARK);
    if (phase === 'shown') hand(angleAt(pressAt), MARK);
    if ((phase === 'answer' || phase === 'shown') && judged >= 0) hand((judged / PERIOD) * Math.PI * 2, '#3b6fd0');
  });
  const stage = k.stage;
  const canvas = k.el('[data-canvas]') as HTMLCanvasElement;
  const press = () => {
    if (phase !== 'run') return;
    pressAt = performance.now();
    if (tone) {
      /* Звук ставится в очередь аудиоконтекста на +250 мс — точнее, чем таймер. */
      const ctxA = new AudioContext();
      const osc = ctxA.createOscillator();
      const g = ctxA.createGain();
      osc.frequency.value = 880;
      g.gain.value = 0.15;
      osc.connect(g).connect(ctxA.destination);
      osc.start(ctxA.currentTime + 0.25);
      osc.stop(ctxA.currentTime + 0.33);
      setTimeout(() => ctxA.close(), 800);
    }
    /* Стрелка крутится ещё секунду-две и только потом исчезает: остановленная
       стрелка выдала бы ответ. */
    stopAt = pressAt + 1200 + Math.random() * 1000;
    phase = 'after';
  };
  k.space((down) => { if (down) press(); });
  canvas?.addEventListener('pointerdown', press);
  const ask = () => {
    phase = 'answer';
    judged = -1;
    stage.innerHTML = `<p class="ill-q">${tr('где стояла стрелка, когда вы нажали? Двигайте ползунок — синяя стрелка покажет ваш ответ.')}</p>`;
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = '0';
    inp.max = String(PERIOD - 10);
    inp.step = '10';
    inp.value = String(Math.round(Math.random() * (PERIOD - 10) / 10) * 10);
    inp.style.width = '100%';
    const show = () => { judged = Number(inp.value); s.draw(); };
    inp.oninput = show;
    show();
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'ill-btn';
    ok.textContent = tr('ответить');
    ok.onclick = () => {
      const real = (((pressAt - t0) % PERIOD) + PERIOD) % PERIOD;
      /* Ошибка по кругу: 2500 и 100 мс — соседние деления, а не 2400 мс разницы. */
      let err = Number(inp.value) - real;
      err -= Math.round(err / PERIOD) * PERIOD;
      errs.push({ tone, err });
      phase = 'shown';
      stage.innerHTML = '';
      const avg = (on: boolean) => {
        const a = errs.filter((e) => e.tone === on);
        return a.length ? Math.round(a.reduce((x, e) => x + e.err, 0) / a.length) : NaN;
      };
      const sign = (v: number) => `${v > 0 ? '+' : ''}${Math.round(v)}`;
      const ms = (v: number) => (Number.isNaN(v) ? tr('проб пока нет') : tr('{n} мс', { n: sign(v) }));
      let msg = tr('ошибка этой пробы {ms} мс (плюс — вы назвали момент позже настоящего). В среднем со звуком: {a}; без звука: {b}.', { ms: sign(err), a: ms(avg(true)), b: ms(avg(false)) });
      if (errs.some((e) => e.tone) && errs.some((e) => !e.tone)) {
        msg += ' ' + tr('Разница {d} мс — ваше сближение нажатия со звуком. В опытах оно положительное, но небольшое, порядка десятка миллисекунд, и на нескольких пробах его легко заглушает разброс. Кадр вашего экрана — {f} мс: точнее этого стрелку не увидеть.', { d: sign(avg(true) - avg(false)), f: num(frameMs, 1) });
      }
      k.say(msg);
      s.draw();
    };
    stage.append(inp, ok);
  };
  k.button('start', () => {
    tone = errs.length % 2 === 0;
    pressAt = -1;
    /* Стрелка стартует с произвольного места. */
    t0 = performance.now() - Math.random() * PERIOD;
    phase = 'run';
    stage.innerHTML = `<p class="ill-q">${tone
      ? tr('проба со звуком: дайте стрелке сделать оборот и нажмите пробел (или щёлкните по часам), когда захотите. Через четверть секунды прозвучит сигнал.')
      : tr('проба без звука: дайте стрелке сделать оборот и нажмите пробел (или щёлкните по часам), когда захотите.')}</p>`;
    k.say(tr('часы Либета: стрелка делает оборот за {s} с.', { s: num(2.56, 2) }));
    /* Фокус с кнопки уводим на демонстрацию: иначе пробел снова нажмёт «начать». */
    k.root.focus({ preventScroll: true });
  });
  k.loop((_, dt) => {
    if (dt > 0) frameMs = frameMs ? frameMs * 0.95 + dt * 1000 * 0.05 : dt * 1000;
    if (phase === 'after' && performance.now() >= stopAt) ask();
    if (phase === 'run' || phase === 'after') s.draw();
  });
});

/* Списки строятся для каждого языка, а не переводятся: ассоциативная структура перевода
   не переживает, и приманка перестаёт работать. Английский — исходный список «sleep»
   Рёдигера и Макдермотта; беларуский собран заново вокруг «сон». */
const DRM = pageLang === 'en'
  ? {
      list: ['bed', 'rest', 'awake', 'tired', 'dream', 'wake', 'snooze', 'blanket', 'doze', 'slumber', 'snore', 'nap', 'yawn', 'drowsy'],
      lure: 'sleep',
      probes: ['blanket', 'sleep', 'phone', 'snore'],
    }
  : pageLang === 'be'
    ? {
        list: ['ложак', 'адпачынак', 'прачнуцца', 'стомлены', 'калыханка', 'будзільнік', 'дрымота', 'коўдра', 'храп', 'пазяхаць', 'ноч', 'спакой', 'падушка', 'сніцца'],
        lure: 'сон',
        probes: ['падушка', 'сон', 'тэлефон', 'ноч'],
      }
    : {
        list: ['кровать', 'отдых', 'бодрствовать', 'устал', 'мечта', 'будильник', 'дремота', 'одеяло', 'храп', 'зевать', 'ночь', 'покой', 'подушка', 'сновидение'],
        lure: 'сон',
        probes: ['подушка', 'сон', 'телефон', 'ночь'],
      };
const DRM_LIST = DRM.list;
const DRM_LURE = DRM.lure;

export const drmFalseMemory: Mount = demo((k) => {
  const stage = k.stage;
  k.button('start', async (el) => {
    el.disabled = true;
    k.say('');
    for (const word of DRM_LIST) {
      stage.innerHTML = `<p class="ill-word">${word}</p>`;
      await new Promise((r) => setTimeout(r, 900));
    }
    stage.innerHTML = `<p class="ill-q">${tr('теперь посчитайте вслух от 30 до 1. Не торопитесь.')}</p>`;
    await new Promise((r) => setTimeout(r, 6000));
    const probes = DRM.probes;
    /* Узнавание сразу с уверенностью: люди не просто ошибаются, они уверены. */
    const said: Record<string, 0 | 1 | 2> = {};
    for (const p of probes) {
      await new Promise<void>((resolve) => {
        stage.innerHTML = `<p class="ill-q">${tr('слово «{w}» было в списке?', { w: p })}</p>`;
        const row = document.createElement('div');
        row.className = 'ill-answers';
        for (const [label, v] of [[tr('точно было'), 2], [tr('кажется, было'), 1], [tr('не было'), 0]] as const) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'ill-btn';
          b.textContent = label;
          b.onclick = () => { said[p] = v; resolve(); };
          row.append(b);
        }
        stage.append(row);
      });
    }
    stage.innerHTML = '';
    el.disabled = false;
    const lure = said[DRM_LURE];
    k.say(lure === 2
      ? tr('слова «{w}» в списке не было ни разу, а вы уверены, что было. Извлечение восстанавливает смысл, а не проигрывает запись, и уверенность восстанавливается вместе с ним.', { w: DRM_LURE })
      : lure === 1
        ? tr('слова «{w}» в списке не было ни разу. Вы его помните, потому что извлечение восстанавливает смысл, а не проигрывает запись.', { w: DRM_LURE })
        : tr('вы устояли: слова «{w}» действительно не было. Большинство его вспоминает — и уверенно.', { w: DRM_LURE }));
  });
});

export const choiceBlindness: Mount = demo((k) => {
  const stage = k.stage;
  const r = rnd(Date.now() % 65521);
  /* Карточки одной палитры, разные по раскладке: подмена должна быть возможной
     незаметно, как с похожими лицами в исходном опыте. */
  const hues = [0, 1, 2, 3, 4, 5].map(() => Math.round(r() * 360));
  const card = (seed: number) => {
    const rr = rnd(seed);
    let svg = '<svg viewBox="0 0 100 100" class="ill-card">';
    for (let i = 0; i < 6; i++)
      svg += `<circle cx="${(10 + rr() * 80).toFixed(1)}" cy="${(10 + rr() * 80).toFixed(1)}" r="${(6 + rr() * 18).toFixed(1)}" fill="hsl(${hues[i]} 55% 55%)" opacity="0.8"/>`;
    return svg + '</svg>';
  };
  const a = Math.floor(r() * 1e6), b = Math.floor(r() * 1e6);
  stage.innerHTML = `<p class="ill-q">${tr('какая картинка вам нравится больше?')}</p>`;
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
      stage.innerHTML = `<p class="ill-q">${tr('вы выбрали эту. Почему?')}</p>${card(shown)}`;
      const t = document.createElement('textarea');
      t.className = 'ill-text';
      t.rows = 2;
      const row2 = document.createElement('div');
      row2.className = 'ill-answers';
      row2.style.marginTop = '0.5rem';
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'ill-btn';
      ok.textContent = tr('ответить');
      ok.onclick = () => {
        stage.innerHTML = '';
        k.say(tr('вам вернули ту картинку, которую вы отвергли. В исходном опыте подмену сразу замечали примерно в одном случае из восьми; в остальных люди подробно и убедительно объясняли выбор. Отчёт о собственном решении собирается задним числом — записи решения просто нет.'));
      };
      const caught = document.createElement('button');
      caught.type = 'button';
      caught.className = 'ill-btn';
      caught.textContent = tr('это не та картинка');
      caught.onclick = () => {
        stage.innerHTML = '';
        k.say(tr('верно: вам вернули ту картинку, которую вы отвергли, и вы это заметили. В исходном опыте так сразу получалось примерно в одном случае из восьми; в остальных люди подробно и убедительно объясняли выбор.'));
      };
      row2.append(ok, caught);
      stage.append(t, row2);
    };
    row.append(btn);
  });
  stage.append(row);
});

export const boubaKiki: Mount = demo((k) => {
  k.surface(({ ctx, w, h }) => {
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
  stage.innerHTML = `<p class="ill-q">${tr('какая из них «буба», а какая «кики»?')}</p>`;
  const row = document.createElement('div');
  row.className = 'ill-answers';
  for (const [label, typical] of [[tr('слева буба, справа кики'), true], [tr('слева кики, справа буба'), false]] as const) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ill-btn';
    b.textContent = label;
    b.onclick = () => {
      stage.innerHTML = '';
      k.say(typical
        ? tr('так отвечают девять человек из десяти, в большинстве языков и систем письма. Округлым губам отвечает округлый контур, резкому взрыву — угол.')
        : tr('необычный ответ: так отвечает примерно один из десяти. Межкультурная работа 2022 года нашла языки, в которых эффект слабее, — и это честная версия утверждения.'));
    };
    row.append(b);
  }
  stage.append(row);
});

export const kappaEffect: Mount = demo((k) => {
  let pos = 50, t0 = -1, asked = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const xs = [w * 0.1, w * (0.1 + (pos / 100) * 0.8), w * 0.9];
    const el = t0 < 0 ? -1 : (performance.now() - t0) / 1000;
    xs.forEach((x, i) => {
      /* Интервалы по времени всегда равны: 0,4 с между вспышками. */
      const on = el >= i * 0.4 && el < i * 0.4 + 0.12;
      /* До показа и после него места вспышек видны; во время показа — только вспышки. */
      const idle = el < 0 || el > 1.2;
      if (!on && !idle) return;
      ctx.fillStyle = on ? INK : '#c9ccd4';
      ctx.beginPath();
      ctx.arc(x, h / 2, 12, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  const stage = k.stage;
  const ask = () => {
    asked = true;
    stage.innerHTML = `<p class="ill-q">${tr('какой промежуток показался длиннее?')}</p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const label of [tr('первый'), tr('одинаковые'), tr('второй')]) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = label;
      b.onclick = () => {
        stage.innerHTML = '';
        k.say(pos > 52
          ? tr('оба промежутка шли ровно по 0,4 с. По расстоянию длиннее первый — каппа-эффект предсказывает, что дольше покажется именно он.')
          : pos < 48
            ? tr('оба промежутка шли ровно по 0,4 с. По расстоянию длиннее второй — каппа-эффект предсказывает, что дольше покажется именно он.')
            : tr('оба промежутка шли ровно по 0,4 с, и по расстоянию они равны. Сдвиньте среднюю вспышку к краю и посмотрите ещё раз.'));
      };
      row.append(b);
    }
    stage.append(row);
  };
  k.slider('pos', (v) => { pos = v; s.draw(); });
  k.button('go', () => {
    t0 = performance.now();
    asked = false;
    stage.innerHTML = '';
    k.say('');
  });
  k.loop(() => {
    if (t0 < 0) return;
    s.draw();
    if (!asked && performance.now() - t0 > 1300) ask();
  });
});

export const oddballEffect: Mount = demo((k) => {
  let idx = -1;
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
  k.button('go', async (el) => {
    el.disabled = true;
    stage.innerHTML = '';
    k.say('');
    /* Длительность у всех кадров одна: 400 мс, включая необычный. */
    for (let i = 0; i < seq.length; i++) {
      idx = i;
      s.draw();
      await new Promise((r) => setTimeout(r, 400));
      idx = -1;
      s.draw();
      await new Promise((r) => setTimeout(r, 90));
    }
    el.disabled = false;
    stage.innerHTML = `<p class="ill-q">${tr('сколько длился красный квадрат по сравнению с кругами?')}</p>`;
    const row = document.createElement('div');
    row.className = 'ill-answers';
    for (const [label, over] of [[tr('дольше'), true], [tr('столько же'), false], [tr('короче'), false]] as const) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-btn';
      b.textContent = label;
      b.onclick = () => {
        stage.innerHTML = '';
        k.say(over
          ? tr('все кадры шли ровно по 400 мс, включая красный. Внимание ускоряет обработку, а больше обработки читается как больше времени.')
          : tr('вы устояли. Большинство говорит «дольше» — все кадры шли ровно по 400 мс.'));
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
    k.say(tr('попыток: {n}, средний промах {d} px по ходу движения. Систематический сдвиг вперёд — это и есть инерция представления.', { n: errs.length, d: `${mean > 0 ? '+' : ''}${mean.toFixed(0)}` }));
    done = false;
    t0 = -1;
    s.draw();
  });
  k.button('go', () => {
    const w = canvas.clientWidth;
    stopX = w * (0.4 + Math.random() * 0.45);
    t0 = performance.now();
    done = false;
    k.say(tr('запомните, где он остановился, и щёлкните там.'));
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
    ctx.fillText(String(secs % 100).padStart(2, '0'), w * 0.92, h / 2);
  });
  k.button('go', () => {
    show = true;
    secs = 0;
    t0 = performance.now();
    s.draw();
    k.say(tr('смотрите на красную точку слева, потом резко переведите взгляд на счётчик справа. Цифра, на которую попадёт взгляд, покажется дольше остальных, хотя каждая стоит ровно секунду.'));
  });
  k.loop(() => {
    if (!show) return;
    const n = Math.floor((performance.now() - t0) / 1000);
    if (n !== secs) { secs = n; s.draw(); }
  });
  k.say(tr('настоящие стрелочные часы работают лучше и стоят дешевле — это тот случай, когда экран проигрывает предмету.'));
});

export const pseudoHaptics: Mount = demo((k) => {
  let mode = 'bump', px = 0, py = 0, dragging = false;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if (!px) { px = w * 0.15; py = h / 2; }
    ctx.fillStyle = '#e0e3ea';
    if (mode === 'bump') {
      /* Бугор нарисован мягкой тенью: вершина темнее краёв. */
      const R = Math.min(w, h) * 0.3;
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R);
      g.addColorStop(0, '#c9ccd6');
      g.addColorStop(1, PAPER);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, R, 0, Math.PI * 2);
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
  if (canvas) canvas.style.touchAction = 'none';
  let lastX = 0, lastY = 0;
  /* Курсор на время перетаскивания прячется: шайба и есть курсор. Иначе видно, что
     стрелка уехала вперёд, и ощущение сменяется знанием. */
  canvas?.addEventListener('pointerdown', (ev) => { dragging = true; lastX = ev.offsetX; lastY = ev.offsetY; canvas.setPointerCapture(ev.pointerId); canvas.style.cursor = 'none'; });
  const release = () => { dragging = false; canvas.style.cursor = ''; };
  canvas?.addEventListener('pointerup', release);
  canvas?.addEventListener('pointercancel', release);
  canvas?.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let dx = ev.offsetX - lastX, dy = ev.offsetY - lastY;
    lastX = ev.offsetX; lastY = ev.offsetY;
    /* Ни к руке, ни к мыши ничего не прикладывается: меняется только передаточное
       отношение между движением руки и движением шайбы. */
    const d = Math.hypot(px - w / 2, py - h / 2);
    if (mode === 'bump') {
      /* В гору шайба отстаёт, с горы забегает вперёд: усиление зависит от того, вверх
         по склону идёт движение или вниз (Лекюйе). Склон круче всего на середине. */
      const R = Math.min(w, h) * 0.3;
      const len = Math.hypot(dx, dy);
      if (d < R && d > 0.5 && len > 0) {
        const slope = Math.sin((Math.PI * d) / R);
        const up = -((px - w / 2) * dx + (py - h / 2) * dy) / (d * len);
        const gain = 1 - 0.6 * slope * up;
        dx *= gain; dy *= gain;
      }
    } else if (mode === 'friction' && px > w * 0.35 && px < w * 0.65) { dx *= 0.35; dy *= 0.35; }
    else if (mode === 'sticky' && d < Math.min(w, h) * 0.2) { dx *= 0.15; dy *= 0.15; }
    else if (mode === 'weight') { dx *= 0.4; dy *= 0.4; }
    px = Math.max(18, Math.min(w - 18, px + dx));
    py = Math.max(18, Math.min(h - 18, py + dy));
    s.draw();
  });
  k.select('mode', (v) => { mode = v; s.draw(); k.say(tr('мышь при этом не умеет ничего. Ощущение целиком собрано из расхождения между командой и результатом.')); });
});

export const vection: Mount = demo((k) => {
  let go = false, speed = 8, phase = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = '#10131c';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    /* Текстурированный тоннель: большое поле движения читается как своё движение. */
    for (let i = 0; i < 24; i++) {
      const p = ((i / 24 + phase) % 1);
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
  let first = true;
  k.toggle('go', (v) => {
    go = v;
    /* Предупреждение стоит до запуска, а не появляется вместе с движением. */
    k.say(v || first ? tr('если станет мутить — жмите «остановить» немедленно. Векция без согласованного вестибулярного сигнала — это ровно тот конфликт, от которого укачивает.') : tr('остановлено.'));
    first = false;
  });
  k.slider('speed', (v) => { speed = v; });
  /* Фаза копится только на ходу: после остановки тоннель продолжает с того же места. */
  k.loop((_, dt) => { if (go) phase = (phase + (dt * speed) / 40) % 1; s.draw(); });
});

export const somatogravic: Mount = demo((k) => {
  let accel = 40;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.62, cy = h * 0.14;
    const g = h * 0.58;
    const a = (accel / 100) * g;
    ctx.font = `${w < 500 ? 11 : 13}px system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    const arrow = (x1: number, y1: number, x2: number, y2: number, col: string) => {
      if (Math.hypot(x2 - x1, y2 - y1) < 2) return;
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
    };
    const label = (text: string, x: number, y: number, col: string, align: CanvasTextAlign) => {
      ctx.fillStyle = col;
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
    };
    /* Полёт слева направо. Разгон вперёд добавляет к тяжести силу инерции, направленную
       назад; отолиты чувствуют только сумму, и она отклонена назад. */
    label(tr('направление полёта →'), w - 10, h - 12, '#6b6b70', 'right');
    arrow(cx, cy, cx, cy + g, '#6f7682');
    label(tr('тяжесть'), cx + 8, cy + g * 0.55, '#6f7682', 'left');
    arrow(cx, cy, cx - a, cy, '#3b6fd0');
    if (a > 2) label(tr('сила инерции'), cx - a / 2, cy - 12, '#3b6fd0', 'center');
    arrow(cx, cy, cx - a, cy + g, MARK);
    /* Подпись равнодействующей — под её концом, в пределах холста. */
    const rl = tr('то, что меряют отолиты');
    const rw = ctx.measureText(rl).width;
    label(rl, Math.max(4, Math.min(w - rw - 4, cx - a - rw / 2)), cy + g + 14, MARK, 'left');
    /* Угол между настоящей вертикалью и той, которую докладывают отолиты. */
    const deg = (Math.atan(accel / 100) * 180) / Math.PI;
    if (deg > 1) {
      ctx.strokeStyle = MARK;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, g * 0.3, Math.PI / 2, Math.PI / 2 + (deg * Math.PI) / 180);
      ctx.stroke();
      label(`${Math.round(deg)}°`, cx + 6, cy + g * 0.3 + 10, MARK, 'left');
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  });
  k.slider('accel', (v) => {
    accel = v;
    s.draw();
    k.say(tr('разгон {a} g для отолитов неотличим от наклона назад на {d}°: они меряют сумму и разложить её на слагаемые не могут. Это не сбой обработки — сведений, чтобы различить разгон и задирание носа, в сигнале физически нет.', { a: num(v / 100, 2), d: Math.round((Math.atan(v / 100) * 180) / Math.PI) }));
  });
});

export const falseHeartRateFeedback: Mount = demo((k) => {
  const stage = k.stage;
  let ctxA: AudioContext | null = null;
  let timer = 0;
  /* Удар «тук-тук»: два глухих толчка с обертоном, чтобы их было слышно и на
     маленьких динамиках, а не только в наушниках. */
  const beat = () => {
    if (!ctxA) return;
    const t = ctxA.currentTime;
    for (const [dt, vol] of [[0, 0.5], [0.16, 0.3]] as const) {
      const osc = ctxA.createOscillator();
      const g = ctxA.createGain();
      osc.frequency.setValueAtTime(120, t + dt);
      osc.frequency.exponentialRampToValueAtTime(50, t + dt + 0.12);
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(vol, t + dt + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.15);
      osc.connect(g).connect(ctxA.destination);
      osc.start(t + dt);
      osc.stop(t + dt + 0.16);
    }
  };
  k.button('go', async (el) => {
    el.disabled = true;
    k.say('');
    const fast = Math.random() > 0.5;
    const bpm = fast ? 105 : 62;
    ctxA = new AudioContext();
    /* Это и есть подмена из опыта Валинса: звук выдаётся за ваш пульс. Разбор — сразу
       после оценки, ниже. */
    stage.innerHTML = `<p class="ill-q">${tr('это ваш пульс. Послушайте его несколько секунд и посмотрите на узор.')}</p><div class="ill-swatch"></div>`;
    const sw = stage.querySelector('.ill-swatch') as HTMLElement;
    sw.style.background = 'conic-gradient(#d8342c, #2f62d0, #2e8b45, #d6a41a, #d8342c)';
    clearInterval(timer);
    beat();
    timer = window.setInterval(beat, 60000 / bpm);
    await new Promise((r) => setTimeout(r, 9000));
    clearInterval(timer);
    ctxA?.close();
    ctxA = null;
    stage.innerHTML = `<p class="ill-q">${tr('насколько узор вам понравился? От 0 до 10.')}</p>`;
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = '0'; inp.max = '10'; inp.value = '5';
    const out = document.createElement('output');
    out.textContent = ' 5 ';
    inp.oninput = () => { out.textContent = ` ${inp.value} `; };
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'ill-btn';
    ok.textContent = tr('ответить');
    ok.onclick = () => {
      stage.innerHTML = '';
      el.disabled = false;
      /* Обман кончается здесь и сразу, а не в конце страницы. */
      k.say(tr('оценка {v} из 10. Скажем прямо: этот звук никогда не был вашим пульсом. Он шёл с частотой {bpm} в минуту, выпавшей случайно, и в опыте Валинса именно такая подмена сдвигала оценки.', { v: inp.value, bpm }));
    };
    stage.append(inp, out, ok);
  });
});

/* Треугольник Карри: четыре части, сетка 13 × 5. Координаты в клетках, y вверх.
   Обе раскладки — чистые переносы, без поворотов; во второй остаётся пустая клетка. */
type Piece = { poly: [number, number][]; col: string; at: [[number, number], [number, number]] };
const CURRY: Piece[] = [
  { poly: [[0, 0], [8, 0], [8, 3]], col: '#d8342c', at: [[0, 0], [5, 2]] },
  { poly: [[0, 0], [5, 0], [5, 2]], col: '#2e8b45', at: [[8, 3], [0, 0]] },
  { poly: [[0, 0], [5, 0], [5, 1], [2, 1], [2, 2], [0, 2]], col: '#e0a020', at: [[8, 0], [5, 0]] },
  { poly: [[2, 0], [5, 0], [5, 2], [0, 2], [0, 1], [2, 1]], col: '#8fbf4a', at: [[8, 1], [8, 0]] },
];

export const missingSquarePuzzle: Mount = demo((k) => {
  let swap = false, ruler = false, exag = 1, mix = 0, target = 0;
  const s = k.surface(({ ctx, w, h }) => {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    const u = Math.min(w / 14, h / 6.5);
    const x0 = (w - u * 13) / 2, y0 = (h + u * 5) / 2;
    /* «Растянуть по вертикали» растягивает расстояние по вертикали от прямой,
       соединяющей углы большого треугольника: прямая остаётся на месте, излом
       гипотенузы вырастает в exag раз. Нижние части при этом уходят за край. */
    const P = (x: number, y: number): [number, number] => [x0 + x * u, y0 - ((5 * x) / 13 + exag * (y - (5 * x) / 13)) * u];
    const line = (a: [number, number], b: [number, number]) => { ctx.beginPath(); ctx.moveTo(...P(...a)); ctx.lineTo(...P(...b)); ctx.stroke(); };
    ctx.strokeStyle = '#d6d8de';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 13; i++) line([i, 0], [i, 5]);
    for (let i = 0; i <= 5; i++) line([0, i], [13, i]);
    const e = mix * mix * (3 - 2 * mix);
    for (const pc of CURRY) {
      const ox = pc.at[0][0] + (pc.at[1][0] - pc.at[0][0]) * e, oy = pc.at[0][1] + (pc.at[1][1] - pc.at[0][1]) * e;
      ctx.fillStyle = pc.col;
      ctx.strokeStyle = PAPER;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      pc.poly.forEach(([x, y], i) => { const [X, Y] = P(x + ox, y + oy); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    if (e === 1) {
      /* Та самая клетка. */
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      [[7, 1], [8, 1], [8, 2], [7, 2]].forEach(([x, y], i) => { const [X, Y] = P(x, y); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); });
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (ruler) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      line([0, 0], [13, 5]);
    }
  });
  const say = () => k.say(exag > 1.5
    ? tr('расстояния по вертикали от прямой, соединяющей углы, растянуты ×{e}. Видно: в одной раскладке «гипотенуза» прогибается внутрь, в другой выгибается наружу. Разница площадей ровно одна клетка.', { e: exag })
    : swap
      ? tr('те же четыре части, а одна клетка пустая. Приложите линейку и растяните вертикаль: гипотенуза не прямая.')
      : tr('наклоны 3/8 и 2/5 отличаются примерно на градус. Глаз тут не ошибается — его просто просят различить градус.'));
  /* Части переезжают плавно, чтобы было видно: их только переложили. */
  const lp = k.loop((_, dt) => {
    if (mix === target) return;
    mix = target > mix ? Math.min(target, mix + dt * 1.25) : Math.max(target, mix - dt * 1.25);
    s.draw();
  });
  k.toggle('swap', (v) => {
    swap = v;
    target = v ? 1 : 0;
    /* Без анимации (prefers-reduced-motion) — сразу на место. */
    if (!lp.running) { mix = target; s.draw(); }
    say();
  });
  k.toggle('ruler', (v) => { ruler = v; s.draw(); });
  k.slider('exag', (v) => { exag = v; s.draw(); say(); });
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
  k.say(tr('узор физически есть в изображении: обманываться здесь нечему, и камера снимет его так же.'));
});
