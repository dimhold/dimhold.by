---
title: "У табліцы 2000 плацяжоў без дублікатаў, а ў банку 2592 спісанні"
description: "Я сабраў 8 рэцэптаў плацяжу з ключом ідэмпатэнтнасці на PostgreSQL 9.3, забіваў працэс паміж крокамі і лічыў спісанні ў банку. З унікальным індэксам у табліцы 2000 чыстых радкоў, а ў банку 2592 спісанні. Адно спісанне на плацеж і адказ кожнаму кліенту даў толькі рэцэпт, у якім дублікат адсякае сам банк."
date: 2014-11-02
lang: be
translationKey: idempotent-payment
tags: ["databases", "reliability", "debugging"]
---

`db_rows: 2000, client_ok: 2000, charges: 2592`. Першыя 2 лікі бачыць мой сэрвіс: 2000 радкоў з унікальным індэксам па ключы і 2000 кліентаў, якія атрымалі свой адказ 200. Трэці лік узяты з цацачнага банка. 478 плацяжоў ён спісаў больш за адзін раз, самы нешчаслівы 5 разоў.

Калі ў мяне пыталіся, як не спісаць грошы двойчы пры паўторы запыту, я заўсёды адказваў адно і тое ж: няхай кліент дашле ключ, а на ключ павесце ўнікальны індэкс. Што пры гэтым робіцца там, дзе ляжаць грошы, я ніколі не лічыў. На гэты раз я верыў толькі спісу спісанняў у банку.

Тэма старая. Пэт Хеланд яшчэ ў 2012 годзе напісаў артыкул "Idempotence Is Not a Medical Condition" пра сістэмы, дзе паведамленне можа прыйсці не адзін раз. RFC 7230, які выйшаў у чэрвені, забараняе кліенту самому паўтараць POST, калі той не ведае, што гэта бяспечна або што першы запыт не быў выкананы. У EC2 у RunInstances даўно ёсць ClientToken. Ніводнага рэцэпта ніжэй я не прыдумаў сам, мне хацелася пабачыць, дзе кожны з іх ламаецца.

## На чым я мераў

PostgreSQL 9.3.5, Python 3.4.2 і psycopg2 2.5.4, усё на адной машыне з Linux. Плацежны сэрвіс гэта шматпаточны HTTP-сервер у адным працэсе. Банк жыве ў другім працэсе: ён спіць, пасярод сну запісвае спісанне, потым адказвае. Кліент пасылае ў загалоўку адзін і той жа ключ, пакуль не ўбачыць 200. Падзенне сапраўднае, SIGKILL у выбраным радку, пасля чаго бацькоўскі працэс адразу стварае новы рабочы.

Рэцэптаў выйшла 8:

- A, без ключа.
- B, SELECT па ключы, спісанне, INSERT.
- S, тое самае пад SERIALIZABLE.
- C, рэцэпт B з унікальным індэксам па ключы.
- D, спачатку INSERT ключа, потым спісанне, усё ў адной транзакцыі.
- E, INSERT і COMMIT да спісання. На радок `started` сэрвіс адказвае 409.
- F, рэцэпт E з блакіроўкай радка. Хто атрымаў блакіроўку на радку `started`, пытаецца ў банка пра гэты ключ і спісвае, толькі калі там пуста.
- G, тая ж блакіроўка, але спісанне проста паўтараецца з той жа спасылкай, а дублікат адкідае банк.

Upsert у 9.3 няма, таму "спачатку INSERT" азначае лавіць памылку 23505.

## Дзе памірае працэс

У кожнай клетцы 20 плацяжоў, адно забойства на першай спробе, далей кліент паўтарае запыт.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Колькі спісанняў у банку на 20 плацяжоў для 7 рэцэптаў і 6 месцаў, дзе забіваюць працэс. A: 20, 20, 40, 40, 40, 40. B: 20, 20, 40, 40, 40, 20. C: 20, 20, 40, 40, 40, 20. D: 20, 20, 40, 40, 40, 20. E: 20, 0, 20, 20, 20, 20. F: 20, 20, 40, 20, 20, 20. G: 20, 20, 20, 20, 20, 20.">
  <text x="258.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">на</text>
  <text x="258.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">уваходзе</text>
  <text x="334.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">да</text>
  <text x="334.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">банка</text>
  <text x="410.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">падчас</text>
  <text x="410.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">выкліку</text>
  <text x="486.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">пасля</text>
  <text x="486.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">банка</text>
  <text x="562.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">да</text>
  <text x="562.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="638.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">пасля</text>
  <text x="638.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="4.0" y="64.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="64.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">без ключа</text>
  <rect x="222.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="638.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <text x="4.0" y="92.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="92.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, спісанне, INSERT</text>
  <rect x="222.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="120.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + унікальны індэкс</text>
  <rect x="222.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="148.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, спісанне, COMMIT</text>
  <rect x="222.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, спісанне</text>
  <rect x="222.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="300" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="334.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="374.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="376" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="410.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="452" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="486.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="528" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="562.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="204.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="204.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блакіроўка + пытанне</text>
  <rect x="222.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="188.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="232.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блакіроўка + спасылка</text>
  <rect x="222.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="410.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
</svg>
<figcaption>Колькі спісанняў убачыў банк на 20 плацяжоў, калі працэс адзін раз забіты ў гэтым месцы, а кліент паўтарыў запыт. Правільна 20. Колерам пазначаны двайныя спісанні, рамкай клеткі, дзе кліент застаўся з 409.</figcaption>
</figure>

У B, C і D радкі аднолькавыя. Ключ ратуе роўна ў адным месцы: калі працэс памёр пасля COMMIT і кліент не дачакаўся адказу. Калі ён памёр паміж адказам банка і COMMIT, усе 20 плацяжоў спісаныя двойчы, бо адзіны след першага спісання быў у транзакцыі, якой больш няма. D здаваўся мне больш надзейным, ён запісвае ключ раней, чым чапае грошы, але ключ ляжыць у яшчэ адкрытай транзакцыі і прападае разам з ёй.

## Дзве копіі адразу

Для гонкі я адпраўляў па 2 копіі кожнага з 50 плацяжоў з прамежкам, банк адказваў за 50 мс. Пры прамежку ад 0 да 45 мс рэцэпт B спісаў двойчы ўсе 50 плацяжоў і пакінуў 100 радкоў. C спісаў двойчы ад 46 да 50 плацяжоў і пакінуў роўна 50 радкоў, гэта значыць страта амаль тая ж, толькі табліца чыстая. У D, E, F і G па 50 спісанняў. У D другі INSERT проста чакае, пакуль скончыцца першая транзакцыя. Пры прамежку 100 мс, калі першая копія ўжо зафіксаваная, двойчы спісвае толькі A. Прыкладна так я раней і правяраў: яшчэ раз націскаў кнопку рукамі.

## Шторм

Далей 2000 плацяжоў ад 8 кліентаў. Кліент чакае адказу 250 мс, 5% выклікаў банка доўжацца 600 мс, 4% першых спроб просяць забіць працэс у выпадковым месцы (з паўторных 2%). Працэс у сэрвіса адзін, таму разам з ім гінуць усе плацяжы, якія былі ў рабоце.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Шторм, па 2000 плацяжоў на рэцэпт. Плацяжы, спісаныя больш за адзін раз, лішнія радкі ў табліцы, кліенты без адказу 200. A: 497, 33, 0. B: 470, 5, 0. S: 750, 0, 77. C: 478, 0, 0. D: 478, 0, 0. E: 0, 0, 292. F: 68, 0, 0. G: 0, 0, 0.">
  <text x="4.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">плацяжы, спісаныя больш за адзін раз</text>
  <text x="570.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">лішнія радкі</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">без 200</text>
  <text x="4.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="47.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">без ключа</text>
  <rect x="220.0" y="34.0" width="111.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="339.8" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">497</text>
  <text x="570.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">33</text>
  <text x="670.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, спісанне, INSERT</text>
  <rect x="220.0" y="60.0" width="105.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="333.8" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">470</text>
  <text x="570.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="670.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">S</text>
  <text x="24.0" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B, SERIALIZABLE</text>
  <rect x="220.0" y="86.0" width="168.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="396.8" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">750</text>
  <text x="570.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">77</text>
  <text x="4.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + унікальны індэкс</text>
  <rect x="220.0" y="112.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, спісанне, COMMIT</text>
  <rect x="220.0" y="138.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, спісанне</text>
  <rect x="220.0" y="164.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">292</text>
  <text x="4.0" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блакіроўка + пытанне</text>
  <rect x="220.0" y="190.0" width="15.3" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="243.3" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">68</text>
  <text x="570.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блакіроўка + спасылка</text>
  <rect x="220.0" y="216.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>Шторм, па 2000 плацяжоў на рэцэпт. Слупкі гэта плацяжы, спісаныя ў банку 2 разы і больш, у калонках справа радкі done звыш 2000 і кліенты, якія здаліся без 200.</figcaption>
</figure>

У крытэрыях, запісаных да прагону, у мяне стаяла, што парадак рэцэптаў будзе той самы, што і ў малых тэстах. Не выйшла. З SERIALIZABLE выйшла горш, чым зусім без ключа: 750 плацяжоў, спісаных больш за адзін раз, супраць 497, усяго 6277 спісанняў. Самы нешчаслівы плацеж спісалі 15 разоў і толькі таму, што пасля 15 спроб мой кліент здаецца.

Што 40001 прыходзіць ужо пасля спісання, я ведаў. Што ён дастанецца чужым плацяжам, не чакаў. Тады я ўзяў 2 транзакцыі з рознымі ключамі: кожная шукае свой ключ, якога няма, устаўляе яго і робіць COMMIT. Па `pg_locks` відаць, што SELECT пакідае SIReadLock на старонцы індэкса, таму 2 ключы з адной старонкі, якіх яшчэ няма, выглядаюць як канфлікт. З выпадковымі ключамі 40001 атрымалі 100 пар са 100 на пустой табліцы, 14 на табліцы з 1000 радкоў на пачатку тэсту і толькі адна на табліцы з 10 000. Кожная такая памылка загадвала кліенту паўтарыць запыт і кожны паўтор ішоў у банк.

Першы варыянт гэтага тэсту паказаў 100, 84 і 0. Я нават паспеў напісаць да яго тлумачэнне, а потым паглядзеў на ключы. Амаль усе яны па парадку ішлі пасля першай тысячы радкоў і сустракаліся на апошняй старонцы, а пры 10 000 радкоў паміж двума ключамі заўсёды ляжала каля 5000 іншых. У шторму тая самая загана: ключы там пранумараваныя запар, `sS-120` побач з `sS-121`. З суседнімі нумарамі выходзіць 100 са 100 на кожным з трох памераў. Таму для S я паўтарыў шторм, узяўшы md5 ад тых жа ключоў. Выйшла 4178 спісанняў замест 6277, затое больш за адзін раз спісаныя 774 плацяжы. Гэта ўсё роўна горш, чым без ключа.

Шторм я яшчэ і разабраў на часткі. Калі ёсць толькі таймаўты, у A і C больш за адзін раз спісана па 92 плацяжы, бо seed агульны і павольнымі былі адны і тыя ж выклікі. У D ніводнага. Калі ёсць толькі забойствы, у A такіх 527, у C 496, у D 474. Выходзіць, гонку D закрыў, але ад забойства ратуе ненашмат лепш, чым адсутнасць ключа.

E двойчы не спісаў ні разу. Затое 292 кліенты так і не атрымалі 200. У табліцы 292 радкі са словам `started`, па 278 з іх банк грошы спісаў, па 14 не. Па самой табліцы іх не адрозніць.

## Спытаць у банка

Рэцэпт F я б сам і напісаў. З аднымі забойствамі ён чысты: банк запісвае спісанне за 30 мс, а кліент чакае перад паўторам 50. З аднымі таймаўтамі таксама чысты, блакіроўку трымае жывы працэс. Калі ёсць і тое і другое, больш за адзін раз спісана 68 плацяжоў.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Рэцэпт F. Працэс памірае праз 100 мс пасля выкліку банка, банк запісвае спісанне на 200 мс. Колькі плацяжоў з 20 спісана двойчы ў залежнасці ад паўзы перад паўторам: 20: 20, 50: 20, 80: 20, 110: 0, 150: 0, 250: 0.">
  <rect x="190.0" y="52.0" width="150.0" height="16.0" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <line x1="40" y1="60" x2="640" y2="60" class="f-line"/>
  <line x1="40" y1="55" x2="40" y2="65" class="f-line"/>
  <text x="40.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="190" y1="55" x2="190" y2="65" class="f-line"/>
  <text x="190.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="340" y1="55" x2="340" y2="65" class="f-line"/>
  <text x="340.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="490" y1="55" x2="490" y2="65" class="f-line"/>
  <text x="490.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="640" y1="55" x2="640" y2="65" class="f-line"/>
  <text x="640.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="190.0" y="20.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">працэс памёр</text>
  <text x="300.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">банк запісаў спісанне</text>
  <text x="670.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">мс ад выкліку банка</text>
  <text x="40.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">паўза перад паўторам, колькі плацяжоў з 20 спісана двойчы</text>
  <line x1="190" y1="134" x2="220.0" y2="134" class="f-line"/>
  <rect x="216.0" y="130.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="138.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+20</text>
  <text x="232.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="154" x2="265.0" y2="154" class="f-line"/>
  <rect x="261.0" y="150.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="158.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+50</text>
  <text x="277.0" y="158.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="174" x2="310.0" y2="174" class="f-line"/>
  <rect x="306.0" y="170.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="178.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+80</text>
  <text x="322.0" y="178.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="194" x2="355.0" y2="194" class="f-line"/>
  <rect x="351.0" y="190.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+110</text>
  <text x="367.0" y="198.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="214" x2="415.0" y2="214" class="f-line"/>
  <rect x="411.0" y="210.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="218.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+150</text>
  <text x="427.0" y="218.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="234" x2="565.0" y2="234" class="f-line"/>
  <rect x="561.0" y="230.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="238.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+250</text>
  <text x="577.0" y="238.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>Рэцэпт F пытаецца ў банка, перш чым спісваць зноў. Калі пытанне прыйшло раней, чым банк запісаў першае спісанне, той сумленна адказвае, што такога няма. У рэцэпта G пры кожнай з гэтых паўз роўна 20 спісанняў.</figcaption>
</figure>

Працэс памірае праз 100 мс пасля выкліку, банк запісвае спісанне на 200 мс. Кліент, які вярнуўся праз 20, 50 ці 80 мс, трапляе ў новы рабочы працэс. Той пытаецца ў банка і, пачуўшы, што такога спісання няма, спісвае яшчэ раз, 20 плацяжоў з 20. Пры 110, 150 і 250 мс нуль.

Першы прагон гэтай табліцы даў 14, 3 і 1. Ён ішоў на ядрах, занятых яшчэ і чужымі задачамі, усё, відаць, спазнялася на дзясяткі мілісекунд і банк паспяваў дапісаць. На ціхіх ядрах выйшла 20, 20 і 20, гэта значыць занятая машына хавала ад мяне памылку.

У шторме 2000 спісанняў на 2000 плацяжоў атрымалася толькі ў G. Але атрымалася таму, што мой банк пагадзіўся адсякаць дублікаты пад сваёй блакіроўкай, то-бок я перанёс задачу ў банк, а яго я ні разу не забіваў. Калі працэсінг спасылку не прымае, рэцэпта, які дае адно спісанне разам з адказам, у мяне тут няма.

## Той самы ключ, іншае цела

У рэцэпце D я адправіў 100, а потым 500 з тым самым ключом. Другі адказ быў 200 з сумай 100. Значыць, патрэбны адбітак цела. Першае, што прыходзіць у галаву, гэта хэш байтаў. На G такі адбітак адхіліў 99 сумленных паўтораў са 100, усе з кодам 422. Новы працэс кліента серыялізуе тыя ж 5 палёў у іншым парадку, бо пачынаючы з Python 3.3 хэшы радкоў тыпова рандамізаваныя. 200 працэсаў далі 99 розных байтавых радкоў. З адсартаванымі ключамі прайшлі 100 са 100.

## Чаго я не правяраў

Забойства самога PostgreSQL, страту дыска і сэрвіс з некалькіх працэсаў. Колькі сапраўдны працэсінг памятае спасылку, а ад гэтага залежыць, наколькі познім можа быць паўтор. Вяртанні грошай. Кліента, які згубіў ключ і зрабіў новы. Шторм на малюнку прайшоў па адным разе на рэцэпт і яго лікі пры кожным прагоне будуць іншыя. C, D і F я прагнаў яшчэ раз і атрымаў 467, 476 і 67 замест 478, 478 і 68, так што аднолькавыя лікі ў C і D супалі выпадкова.
