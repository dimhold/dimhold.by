---
title: "Сігнал, які злавіў бы event-stream 3.3.6, за год спрацаваў бы 54 разы на 3000 пакетаў npm"
description: "Я шукаў у метаданых npm сігнал, які спрацаваў бы на event-stream 3.3.6, і палічыў яго на рэлізах 3000 папулярных пакетаў за год. Новы акаўнт, які публікуе пакет і дадае залежнасць унутры дыяпазону semver, гэта 54 рэлізы, з годам цішыні перад ім 11. Самога рэлізу ў рэестры ўжо няма і яго залежнасці давялося браць з git."
date: 2018-12-02
lang: be
translationKey: event-stream-handover
tags: ["dependencies", "open-data"]
---

У дакуменце `event-stream` з рэестра npm версія 3.3.6 ёсць толькі ў спісе `time`: апублікавана 9 верасня ў 08:28 UTC. У спісе `versions` пасля 3.3.5 адразу ідзе 4.0.0. Гэта той самы рэліз, які прыцягнуў `flatmap-stream`, 26 лістапада npm выдаліў абодва. Я хацеў паглядзець, што рэестр ведаў пра 3.3.6 да таго, як даведаліся ўсе. І перш за ўсё ўбачыў, што ад гэтага запісу амаль нічога не засталося.

Гэтую гісторыю ўжо амаль усе прачыталі. Дамінік Тар напісаў у issue 116, што чалавек даслаў яму ліст, захацеў падтрымліваць модуль і атрымаў яго. Потым акаўнт `right9ctrl` дадаў залежнасць, адна з наступных яе версій палезла ў кашалёк Copay, 27 лістапада npm усё гэта апісаў. Сам я патчы і мінорныя версіі абнаўляю, гледзячы толькі на нумар. Хто выпусціў рэліз, запісана ў тым жа дакуменце, у полі `_npmUser`. Я туды ні разу не зазіраў.

Таму пытанне было такое: які сігнал у метаданых спрацаваў бы на 3.3.6 і як часта ён спрацоўваў бы на іншых папулярных пакетах. Той, што спрацоўвае кожны дзень, я б проста выключыў.

## Што засталося ў запісах

3.3.4 выйшла ў ліпені 2016 года, 3.3.5 выйшла 5 верасня 2018 года, паміж імі 780 дзён. 3.3.5 гэта першы рэліз `right9ctrl`, у спісе мейнтэйнераў побач з ім яшчэ стаіць `dominictarr`. У 4.0.0, праз 11 дзён, застаўся адзін `right9ctrl`.

Запіс `flatmap-stream` таксама падменены, з 29 лістапада там заглушка. Але joepie91 паспеў перапісаць яго даты ў issue 116. 0.1.0 з'явілася праз 3 гадзіны пасля 3.3.5. Залежнасці 3.3.6 я ўзяў з git, каміт `5999958d`. Гэта 3.3.5 плюс радок `"flatmap-stream": "^0.1.0"`. Без гэтага радка мой скрыпт бачыў увосень 3 рэлізы `event-stream` і ніводнай новай залежнасці. 9 верасня новаму пакету было 4 дні. Версія са шкодным кодам, 0.1.1, выйшла праз 26 дзён пасля 3.3.6 і трапіла ў той самы дыяпазон.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Дзве дарожкі з верасня да канца лістапада 2018 года. event-stream: 3.3.5 выйшла 5 верасня, 3.3.6 выйшла 9 верасня, 4.0.0 выйшла 16 верасня, 4.0.1 выйшла 29 верасня. flatmap-stream: 0.1.0 выйшла 5 верасня, 0.1.1 выйшла 5 кастрычніка, 0.1.2 выйшла 15 лістапада. 3.3.6 спасылаецца на flatmap-stream дыяпазонам ^0.1.0, 4.0.0 не спасылаецца. Issue 115 адкрыты 19 лістапада, npm прыбірае пакеты 26 лістапада.">
  <text x="10.0" y="68.0" text-anchor="start" class="f-mono f-ink">event-stream</text>
  <text x="10.0" y="148.0" text-anchor="start" class="f-mono f-ink">flatmap-stream</text>
  <line x1="140.0" y1="64.0" x2="664.0" y2="64.0" class="f-line"/>
  <line x1="140.0" y1="144.0" x2="664.0" y2="144.0" class="f-line"/>
  <line x1="337.8" y1="144.0" x2="576.7" y2="144.0" class="f-line" style="stroke:var(--accent);stroke-width:5"/>
  <line x1="188.1" y1="64.0" x2="188.1" y2="137.0" class="f-line" style="stroke:var(--accent)"/>
  <path d="M184.1 132 L188.1 139 L192.1 132" class="f-line" style="stroke:var(--accent)"/>
  <text x="196.1" y="108.0" text-anchor="start" class="f-mono f-accent">^0.1.0</text>
  <circle cx="164.3" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="188.1" cy="64.0" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="229.1" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="302.9" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="168.3" y="52.0" text-anchor="end" class="f-mono f-muted">3.3.5</text>
  <text x="190.1" y="34.0" text-anchor="middle" class="f-mono f-accent">3.3.6</text>
  <text x="229.1" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.0</text>
  <text x="302.9" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.1</text>
  <circle cx="165.0" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="165.0" y="168.0" text-anchor="middle" class="f-mono f-muted">0.1.0</text>
  <circle cx="337.8" cy="144.0" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="337.8" y="168.0" text-anchor="middle" class="f-mono f-accent">0.1.1</text>
  <circle cx="576.7" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="584.7" y="168.0" text-anchor="end" class="f-mono f-muted">0.1.2</text>
  <text x="457.2" y="130.0" text-anchor="middle" class="f-label f-accent">самая новая 0.1.1</text>
  <line x1="140.0" y1="204.0" x2="664.0" y2="204.0" class="f-plain"/>
  <line x1="140.0" y1="204.0" x2="140.0" y2="209.0" class="f-plain"/>
  <text x="140.0" y="224.0" text-anchor="middle" class="f-mono f-muted">вер</text>
  <line x1="312.7" y1="204.0" x2="312.7" y2="209.0" class="f-plain"/>
  <text x="312.7" y="224.0" text-anchor="middle" class="f-mono f-muted">кас</text>
  <line x1="491.3" y1="204.0" x2="491.3" y2="209.0" class="f-plain"/>
  <text x="491.3" y="224.0" text-anchor="middle" class="f-mono f-muted">ліс</text>
  <line x1="664.0" y1="204.0" x2="664.0" y2="209.0" class="f-plain"/>
  <text x="664.0" y="224.0" text-anchor="end" class="f-mono f-muted">сне</text>
  <line x1="598.2" y1="34.0" x2="598.2" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="592.2" y="42.0" text-anchor="end" class="f-label f-ink">issue 115, 19 ліс</text>
  <line x1="638.1" y1="12.0" x2="638.1" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="632.1" y="20.0" text-anchor="end" class="f-label f-ink">выдалена, 26 ліс</text>
</svg>
<figcaption>Тоўстая частка лініі гэта час, калі 0.1.1 была самай новай версіяй у дыяпазоне ^0.1.0. Што ляжыць у 0.1.2, я не правяраў.</figcaption>
</figure>

Праз 7 дзён выйшла 4.0.0 ужо без залежнасці, функцыю перапісалі проста ў `index.js`. Хто глядзеў на самую новую версію, ніякага `flatmap-stream` там не бачыў, але ў галіне 3.x апошняй засталася 3.3.6. Issue 115 пра бэкдор адкрылі 19 лістапада, праз 71 дзень пасля 3.3.6.

## Як я лічыў

Імёны ўзятыя з `all-the-package-names` 1.3572.0 ад 4 лістапада. Мяркуючы па ўсім, спіс там ідзе ад пакетаў, ад якіх залежыць найбольш іншых, да тых, ад якіх не залежыць ніхто. Я ўзяў першыя 30 000 імёнаў без скоўпа і пакінуў 3000, якія ў лістападзе спампоўвалі часцей за астатнія. `event-stream` сярод іх на 944-м месцы з 8,9 млн спамповак, у апошняга 486 436. Далей прачытаў поўныя дакументы і ўзяў стабільныя рэлізы са снежня 2017 па лістапад 2018, у якіх ёсць папярэдняя версія. Атрымалася 9205 рэлізаў у 1597 пакетаў. Дыяпазоны разбірае модуль `semver`.

Сігналы я запісаў да прагону:

- новы аўтар: акаўнт упершыню апублікаваў гэты пакет не больш за 30 дзён таму, а да яго публікаваў нехта іншы;
- дыяпазон: `^` ад папярэдняй версіі прымае новую;
- залежнасць: у `dependencies` ёсць пакет, якога ў папярэдняй версіі не было, маладая, калі на npm яму менш за 90 дзён;
- цішыня: год без рэлізаў перад гэтым рэлізам або перад першым рэлізам акаўнта, які прыйшоў у апошнія 30 дзён.

Я чакаў некалькі дзясяткаў рэлізаў, дзе сышліся новы аўтар, дыяпазон і залежнасць, а разам з цішынёй менш за дзясятак.

## Што спрацоўвае

| сігналы | рэлізаў | пакетаў |
|---|---|---|
| новы аўтар | 741 | 325 |
| цішыня | 603 | 543 |
| залежнасць | 716 | 419 |
| дыяпазон + маладая залежнасць | 82 | 56 |
| новы аўтар + дыяпазон + залежнасць | 54 | 45 |
| новы аўтар + дыяпазон + залежнасць + цішыня | 11 | 11 |
| новы аўтар + дыяпазон + маладая залежнасць | 9 | 8 |

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Колькі рэлізаў 3000 пакетаў за год падыходзіць пад кожнае спалучэнне сігналаў. новы аўтар: 741; залежнасць: 716; дыяпазон + залежнасць: 491; дыяпазон + маладая залежнасць: 82; новы аўтар + дыяпазон + залежнасць: 54; новы аўтар + дыяпазон + залежнасць + цішыня: 11; новы аўтар + дыяпазон + маладая залежнасць: 9.">
  <rect x="362.0" y="12.0" width="251.5" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="25.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">новы аўтар</text>
  <text x="623.5" y="26.0" text-anchor="start" class="f-mono f-ink">741</text>
  <rect x="362.0" y="42.0" width="243.1" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">залежнасць</text>
  <text x="615.1" y="56.0" text-anchor="start" class="f-mono f-ink">716</text>
  <rect x="362.0" y="72.0" width="166.7" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="85.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">дыяпазон + залежнасць</text>
  <text x="538.7" y="86.0" text-anchor="start" class="f-mono f-ink">491</text>
  <rect x="362.0" y="102.0" width="27.8" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="115.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">дыяпазон + маладая залежнасць</text>
  <text x="399.8" y="116.0" text-anchor="start" class="f-mono f-ink">82</text>
  <rect x="362.0" y="132.0" width="18.3" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="145.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новы аўтар + дыяпазон + залежнасць</text>
  <text x="390.3" y="146.0" text-anchor="start" class="f-mono f-ink">54</text>
  <rect x="362.0" y="162.0" width="3.7" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="175.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новы аўтар + дыяпазон + залежнасць + цішыня</text>
  <text x="375.7" y="176.0" text-anchor="start" class="f-mono f-ink">11</text>
  <rect x="362.0" y="192.0" width="3.1" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="205.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новы аўтар + дыяпазон + маладая залежнасць</text>
  <text x="375.1" y="206.0" text-anchor="start" class="f-mono f-ink">9</text>
</svg>
<figcaption>Рэлізы са снежня 2017 па лістапад 2018, якія падыходзяць пад усе словы радка. 3.3.6 ёсць ва ўсіх 7 радках. Чырвоным пазначана тое, чаго менш за 100.</figcaption>
</figure>

Новы аўтар сам па сабе мала пра што кажа. За год нехта новы з'явіўся ў 325 пакетаў з 3000, больш чым у кожнага дзясятага. Разам з дыяпазонам і залежнасцю застаецца 54 рэлізы, прыкладна адзін на тыдзень. Радок, дзе толькі дыяпазон і маладая залежнасць, я дадаў ужо пасля прагону.

З цішынёй іх 11, крыху больш, чым я чакаў. Побач з `event-stream` стаяць `grunt` 1.0.2, `readdirp` 2.2.0, `for-each` 0.3.3, `browser-pack` 6.0.3. Паводле метаданых гэта звычайная падтрымка. Пасля доўгай паўзы публікуе новы чалавек і дадае адзін пакет, напрыклад `safe-buffer` або `is-callable`. Паводле гэтых палёў 3.3.6 выглядае гэтак жа. Код астатніх 10 рэлізаў я не чытаў.

З маладой залежнасцю іх 9. Тут я паглядзеў, хто гэтыя залежнасці зрабіў. У 6 з астатніх 8 рэлізаў гэта той самы акаўнт, што выпусціў і сам рэліз. Яшчэ ў 2 гэта акаўнт, у якога ўжо былі пакеты ў маіх 3000. Хто апублікаваў `flatmap-stream`, у рэестры ўжо не відаць, рэпазіторый ляжаў у `hugeglass`. Калі і на npm гэта быў той самы акаўнт, правіла "маладая і ад незнаёмага акаўнта" пакінула б толькі `event-stream`. Але прыдумаў я яго ўжо пасля прагону на адзіным сапраўдным выпадку, так што пакуль я б яму не верыў.

Правілы з залежнасцю спрацоўваюць 9 верасня. У той дзень, наколькі я зразумеў з issue 116, код быў яшчэ бясшкодны. Новы аўтар разам з цішынёй спрацавалі б на 4 дні раней, на 3.3.5. А 5 кастрычніка ў `event-stream` наогул няма рэлізу, у `flatmap-stream` гэта звычайны патч. З `eslint-scope` усё гэта, думаю, не дапамагло б. Яго 3.7.2 ад 12 ліпеня апублікавалі са скрадзенымі ўліковымі данымі мейнтэйнера, код запускаўся з `postinstall`. У 3.7.1 і 3.7.3 адны і тыя ж 2 залежнасці, таму і ў 3.7.2, хутчэй за ўсё, новых не было.

## Як далёка гэта зайшло

З 27 жніўня па 8 верасня `flatmap-stream` спампавалі 22 разы. 10 верасня, у першы поўны дзень, 114 753 разы. У `event-stream` у той самы дзень 354 919, выходзіць 32%. За тыдзень з 12 лістапада доля дайшла да 48%. З 9 верасня па 25 лістапада ў мяне атрымліваецца 9,52 млн. Snyk пісаў пра амаль 8 млн, якія дні яны бралі, я не ведаю. Мая сума праходзіць гэтую адзнаку 14 лістапада.

<figure class="fig">
<svg viewBox="0 0 680 268" role="img" aria-label="Спампоўкі event-stream і flatmap-stream па днях з 27 жніўня па 1 снежня 2018 года. У flatmap-stream да 9 верасня ўсяго 22 спампоўкі, потым 114 753 за 10 верасня і 204 253 за 21 лістапада. 27 лістапада ўжо 27 647, 30 лістапада 308.">
  <line x1="56.0" y1="238.0" x2="664.0" y2="238.0" class="f-plain"/>
  <text x="48.0" y="242.0" text-anchor="end" class="f-mono f-muted">0</text>
  <line x1="56.0" y1="196.7" x2="664.0" y2="196.7" class="f-plain"/>
  <text x="48.0" y="200.7" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="56.0" y1="155.4" x2="664.0" y2="155.4" class="f-plain"/>
  <text x="48.0" y="159.4" text-anchor="end" class="f-mono f-muted">200</text>
  <line x1="56.0" y1="114.1" x2="664.0" y2="114.1" class="f-plain"/>
  <text x="48.0" y="118.1" text-anchor="end" class="f-mono f-muted">300</text>
  <line x1="56.0" y1="72.8" x2="664.0" y2="72.8" class="f-plain"/>
  <text x="48.0" y="76.8" text-anchor="end" class="f-mono f-muted">400</text>
  <rect x="56.6" y="121.1" width="5.1" height="116.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="62.9" y="106.5" width="5.1" height="131.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="69.1" y="114.7" width="5.1" height="123.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="75.4" y="99.9" width="5.1" height="138.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="81.7" y="126.1" width="5.1" height="111.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="87.9" y="210.4" width="5.1" height="27.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="87.9" y1="238.0" x2="87.9" y2="243.0" class="f-plain"/>
  <text x="87.9" y="258.0" text-anchor="middle" class="f-mono f-muted">вер</text>
  <rect x="94.2" y="209.2" width="5.1" height="28.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="100.5" y="144.4" width="5.1" height="93.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="106.7" y="105.0" width="5.1" height="133.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="113.0" y="84.1" width="5.1" height="153.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="119.3" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="125.5" y="106.4" width="5.1" height="131.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131.8" y="200.2" width="5.1" height="37.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="199.2" width="5.1" height="38.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="227.8" width="5.1" height="10.2" style="fill:var(--accent);stroke:none"/>
  <rect x="144.4" y="91.4" width="5.1" height="146.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="144.4" y="190.6" width="5.1" height="47.4" style="fill:var(--accent);stroke:none"/>
  <rect x="150.6" y="76.0" width="5.1" height="162.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150.6" y="187.8" width="5.1" height="50.2" style="fill:var(--accent);stroke:none"/>
  <rect x="156.9" y="82.8" width="5.1" height="155.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="156.9" y="187.7" width="5.1" height="50.3" style="fill:var(--accent);stroke:none"/>
  <rect x="163.2" y="91.3" width="5.1" height="146.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="163.2" y="191.5" width="5.1" height="46.5" style="fill:var(--accent);stroke:none"/>
  <rect x="169.4" y="104.9" width="5.1" height="133.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169.4" y="194.8" width="5.1" height="43.2" style="fill:var(--accent);stroke:none"/>
  <rect x="175.7" y="193.4" width="5.1" height="44.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="175.7" y="220.2" width="5.1" height="17.8" style="fill:var(--accent);stroke:none"/>
  <rect x="182.0" y="195.3" width="5.1" height="42.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="182.0" y="223.1" width="5.1" height="14.9" style="fill:var(--accent);stroke:none"/>
  <rect x="188.2" y="89.7" width="5.1" height="148.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188.2" y="189.8" width="5.1" height="48.2" style="fill:var(--accent);stroke:none"/>
  <rect x="194.5" y="88.1" width="5.1" height="149.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="194.5" y="188.2" width="5.1" height="49.8" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="85.4" width="5.1" height="152.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="200.8" y="187.3" width="5.1" height="50.7" style="fill:var(--accent);stroke:none"/>
  <rect x="207.0" y="79.8" width="5.1" height="158.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207.0" y="185.4" width="5.1" height="52.6" style="fill:var(--accent);stroke:none"/>
  <rect x="213.3" y="99.7" width="5.1" height="138.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="213.3" y="192.1" width="5.1" height="45.9" style="fill:var(--accent);stroke:none"/>
  <rect x="219.6" y="192.3" width="5.1" height="45.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="219.6" y="222.2" width="5.1" height="15.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="225.8" y="222.6" width="5.1" height="15.4" style="fill:var(--accent);stroke:none"/>
  <rect x="232.1" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="232.1" y="189.4" width="5.1" height="48.6" style="fill:var(--accent);stroke:none"/>
  <rect x="238.4" y="73.9" width="5.1" height="164.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="238.4" y="184.3" width="5.1" height="53.7" style="fill:var(--accent);stroke:none"/>
  <rect x="244.6" y="68.5" width="5.1" height="169.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="244.6" y="181.9" width="5.1" height="56.1" style="fill:var(--accent);stroke:none"/>
  <rect x="250.9" y="67.5" width="5.1" height="170.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="250.9" y="182.2" width="5.1" height="55.8" style="fill:var(--accent);stroke:none"/>
  <rect x="257.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="257.2" y="188.9" width="5.1" height="49.1" style="fill:var(--accent);stroke:none"/>
  <rect x="263.4" y="180.7" width="5.1" height="57.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="263.4" y="221.1" width="5.1" height="16.9" style="fill:var(--accent);stroke:none"/>
  <rect x="269.7" y="182.6" width="5.1" height="55.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="269.7" y="221.2" width="5.1" height="16.8" style="fill:var(--accent);stroke:none"/>
  <rect x="276.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="276.0" y="185.8" width="5.1" height="52.2" style="fill:var(--accent);stroke:none"/>
  <line x1="276.0" y1="238.0" x2="276.0" y2="243.0" class="f-plain"/>
  <text x="276.0" y="258.0" text-anchor="middle" class="f-mono f-muted">кас</text>
  <rect x="282.2" y="50.5" width="5.1" height="187.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="282.2" y="180.3" width="5.1" height="57.7" style="fill:var(--accent);stroke:none"/>
  <rect x="288.5" y="53.1" width="5.1" height="184.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="288.5" y="180.6" width="5.1" height="57.4" style="fill:var(--accent);stroke:none"/>
  <rect x="294.8" y="52.4" width="5.1" height="185.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="294.8" y="179.4" width="5.1" height="58.6" style="fill:var(--accent);stroke:none"/>
  <rect x="301.1" y="69.8" width="5.1" height="168.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="301.1" y="176.3" width="5.1" height="61.7" style="fill:var(--accent);stroke:none"/>
  <rect x="307.3" y="166.5" width="5.1" height="71.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="307.3" y="218.6" width="5.1" height="19.4" style="fill:var(--accent);stroke:none"/>
  <rect x="313.6" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="313.6" y="219.6" width="5.1" height="18.4" style="fill:var(--accent);stroke:none"/>
  <rect x="319.9" y="70.1" width="5.1" height="167.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="319.9" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="326.1" y="54.8" width="5.1" height="183.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="326.1" y="171.3" width="5.1" height="66.7" style="fill:var(--accent);stroke:none"/>
  <rect x="332.4" y="52.6" width="5.1" height="185.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="332.4" y="170.7" width="5.1" height="67.3" style="fill:var(--accent);stroke:none"/>
  <rect x="338.7" y="54.2" width="5.1" height="183.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="338.7" y="171.1" width="5.1" height="66.9" style="fill:var(--accent);stroke:none"/>
  <rect x="344.9" y="77.1" width="5.1" height="160.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="344.9" y="180.2" width="5.1" height="57.8" style="fill:var(--accent);stroke:none"/>
  <rect x="351.2" y="171.0" width="5.1" height="67.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="351.2" y="219.3" width="5.1" height="18.7" style="fill:var(--accent);stroke:none"/>
  <rect x="357.5" y="170.9" width="5.1" height="67.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="357.5" y="219.2" width="5.1" height="18.8" style="fill:var(--accent);stroke:none"/>
  <rect x="363.7" y="70.6" width="5.1" height="167.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="363.7" y="173.1" width="5.1" height="64.9" style="fill:var(--accent);stroke:none"/>
  <rect x="370.0" y="70.2" width="5.1" height="167.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="370.0" y="167.7" width="5.1" height="70.3" style="fill:var(--accent);stroke:none"/>
  <rect x="376.3" y="71.7" width="5.1" height="166.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="376.3" y="167.8" width="5.1" height="70.2" style="fill:var(--accent);stroke:none"/>
  <rect x="382.5" y="72.1" width="5.1" height="165.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="382.5" y="168.2" width="5.1" height="69.8" style="fill:var(--accent);stroke:none"/>
  <rect x="388.8" y="93.9" width="5.1" height="144.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="388.8" y="175.5" width="5.1" height="62.5" style="fill:var(--accent);stroke:none"/>
  <rect x="395.1" y="194.4" width="5.1" height="43.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="395.1" y="217.4" width="5.1" height="20.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.3" y="196.6" width="5.1" height="41.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="401.3" y="218.0" width="5.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="407.6" y="102.2" width="5.1" height="135.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="407.6" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="413.9" y="65.4" width="5.1" height="172.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="413.9" y="161.6" width="5.1" height="76.4" style="fill:var(--accent);stroke:none"/>
  <rect x="420.1" y="71.3" width="5.1" height="166.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="420.1" y="164.5" width="5.1" height="73.5" style="fill:var(--accent);stroke:none"/>
  <rect x="426.4" y="75.7" width="5.1" height="162.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="426.4" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="432.7" y="90.7" width="5.1" height="147.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="432.7" y="169.9" width="5.1" height="68.1" style="fill:var(--accent);stroke:none"/>
  <rect x="439.0" y="195.1" width="5.1" height="42.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="439.0" y="216.5" width="5.1" height="21.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.2" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="445.2" y="217.0" width="5.1" height="21.0" style="fill:var(--accent);stroke:none"/>
  <rect x="451.5" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="451.5" y="169.3" width="5.1" height="68.7" style="fill:var(--accent);stroke:none"/>
  <rect x="457.8" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="457.8" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="464.0" y="77.7" width="5.1" height="160.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="464.0" y="172.1" width="5.1" height="65.9" style="fill:var(--accent);stroke:none"/>
  <rect x="470.3" y="84.6" width="5.1" height="153.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="470.3" y="174.9" width="5.1" height="63.1" style="fill:var(--accent);stroke:none"/>
  <line x1="470.3" y1="238.0" x2="470.3" y2="243.0" class="f-plain"/>
  <text x="470.3" y="258.0" text-anchor="middle" class="f-mono f-muted">ліс</text>
  <rect x="476.6" y="88.2" width="5.1" height="149.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="476.6" y="175.1" width="5.1" height="62.9" style="fill:var(--accent);stroke:none"/>
  <rect x="482.8" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="482.8" y="209.8" width="5.1" height="28.2" style="fill:var(--accent);stroke:none"/>
  <rect x="489.1" y="185.8" width="5.1" height="52.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="489.1" y="215.6" width="5.1" height="22.4" style="fill:var(--accent);stroke:none"/>
  <rect x="495.4" y="81.7" width="5.1" height="156.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="495.4" y="167.9" width="5.1" height="70.1" style="fill:var(--accent);stroke:none"/>
  <rect x="501.6" y="72.2" width="5.1" height="165.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="501.6" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.9" y="74.9" width="5.1" height="163.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="507.9" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="514.2" y="75.2" width="5.1" height="162.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="514.2" y="162.8" width="5.1" height="75.2" style="fill:var(--accent);stroke:none"/>
  <rect x="520.4" y="88.9" width="5.1" height="149.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="520.4" y="170.0" width="5.1" height="68.0" style="fill:var(--accent);stroke:none"/>
  <rect x="526.7" y="191.4" width="5.1" height="46.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="526.7" y="215.7" width="5.1" height="22.3" style="fill:var(--accent);stroke:none"/>
  <rect x="533.0" y="194.1" width="5.1" height="43.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="533.0" y="216.9" width="5.1" height="21.1" style="fill:var(--accent);stroke:none"/>
  <rect x="539.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="539.2" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="545.5" y="69.3" width="5.1" height="168.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="545.5" y="158.2" width="5.1" height="79.8" style="fill:var(--accent);stroke:none"/>
  <rect x="551.8" y="73.6" width="5.1" height="164.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="551.8" y="159.0" width="5.1" height="79.0" style="fill:var(--accent);stroke:none"/>
  <rect x="558.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="558.0" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="564.3" y="83.3" width="5.1" height="154.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="564.3" y="158.4" width="5.1" height="79.6" style="fill:var(--accent);stroke:none"/>
  <rect x="570.6" y="183.5" width="5.1" height="54.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="570.6" y="213.3" width="5.1" height="24.7" style="fill:var(--accent);stroke:none"/>
  <rect x="576.8" y="187.6" width="5.1" height="50.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="576.8" y="214.3" width="5.1" height="23.7" style="fill:var(--accent);stroke:none"/>
  <rect x="583.1" y="72.6" width="5.1" height="165.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="583.1" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="589.4" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="589.4" y="154.5" width="5.1" height="83.5" style="fill:var(--accent);stroke:none"/>
  <rect x="595.7" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="595.7" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="601.9" y="95.4" width="5.1" height="142.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="601.9" y="170.2" width="5.1" height="67.8" style="fill:var(--accent);stroke:none"/>
  <rect x="608.2" y="133.8" width="5.1" height="104.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="608.2" y="191.3" width="5.1" height="46.7" style="fill:var(--accent);stroke:none"/>
  <rect x="614.5" y="198.7" width="5.1" height="39.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="614.5" y="224.1" width="5.1" height="13.9" style="fill:var(--accent);stroke:none"/>
  <rect x="620.7" y="202.6" width="5.1" height="35.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="620.7" y="223.6" width="5.1" height="14.4" style="fill:var(--accent);stroke:none"/>
  <rect x="627.0" y="95.0" width="5.1" height="143.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="627.0" y="184.6" width="5.1" height="53.4" style="fill:var(--accent);stroke:none"/>
  <rect x="633.3" y="87.9" width="5.1" height="150.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="633.3" y="226.6" width="5.1" height="11.4" style="fill:var(--accent);stroke:none"/>
  <rect x="639.5" y="101.8" width="5.1" height="136.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="639.5" y="230.2" width="5.1" height="7.8" style="fill:var(--accent);stroke:none"/>
  <rect x="645.8" y="111.1" width="5.1" height="126.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="645.8" y="231.0" width="5.1" height="7.0" style="fill:var(--accent);stroke:none"/>
  <rect x="652.1" y="137.1" width="5.1" height="100.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.3" y="207.2" width="5.1" height="30.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="658.3" y1="238.0" x2="658.3" y2="243.0" class="f-plain"/>
  <text x="652.0" y="258.0" text-anchor="middle" class="f-mono f-muted">сне</text>
  <line x1="140.6" y1="38.0" x2="140.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="140.6" y="34.0" text-anchor="middle" class="f-mono f-ink">3.3.6</text>
  <line x1="303.6" y1="38.0" x2="303.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="303.6" y="34.0" text-anchor="middle" class="f-mono f-ink">0.1.1</text>
  <line x1="560.6" y1="38.0" x2="560.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="560.6" y="34.0" text-anchor="end" class="f-mono f-ink">0.1.2</text>
  <line x1="629.5" y1="38.0" x2="629.5" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="668.0" y="34.0" text-anchor="end" class="f-mono f-ink">выдалена</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">спамповак за дзень, тысяч</text>
  <rect x="300.0" y="3.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="320.0" y="13.0" text-anchor="start" class="f-mono f-muted">event-stream</text>
  <rect x="460.0" y="3.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="480.0" y="13.0" text-anchor="start" class="f-mono f-muted">flatmap-stream</text>
</svg>
<figcaption>У кожнага пакета свой слупок за дзень, абодва пачынаюцца з 0.</figcaption>
</figure>

Для самых новых версій пакетаў я разгарнуў дрэвы залежнасцей цалкам, станам на 20 лістапада. З 5726 версій, якія ў іх трапілі, наўпрост 3.3.6 цягне адна: `ps-tree` 1.1.0. Дыяпазон у яе `~3.3.0`. Тыльду я заўсёды лічыў асцярожным варыянтам, тут розніцы не было ніякай.

Першы падлік ішоў толькі ўнутры 3000 імёнаў і знайшоў за `ps-tree` адзін `npm-run-all`. `nodemon` некуды прапаў. Ён ідзе праз `pstree.remy`, якога ў маім спісе няма, таму давялося дагрузіць яшчэ 1107 пакетаў. З імі 3.3.6 ёсць у дрэве ў 3 пакетаў з 2999 (у аднаго з 3000 няма стабільнай версіі). Лік маленькі, але адзін `ps-tree` за лістапад спампавалі 6,3 млн разоў.

Рэакцыю таксама відаць па датах. `pstree.remy` прыбраў `ps-tree` 22 лістапада, `npm-run-all` 24 лістапада. npm піша, што яму паведамілі 26 лістапада.

## Чаго я не правяраў

У гэтай тэме я не першы. У 2017 годзе Мікіта Скаварада праз слабыя паролі і паролі з уцечак атрымаў права публікаваць 14% пакетаў npm. Дэкан, Менс і Канстанціну на MSR 2018 вывучалі, як уразлівасці разыходзяцца па сетцы залежнасцей npm. Падліку такіх сігналаў я не знайшоў, але і шукаў нядоўга.

`_npmUser` гэта акаўнт, за ім можа стаяць бот або другі лагін таго ж чалавека. Парадак у маім спісе стары, таму новых пакетаў і ўсяго, што са скоўпам, у выбарцы няма. Няма і рэлізаў, якія з рэестра выдалілі, вярнуў я толькі 3.3.6. Дрэвы лічыў толькі для самых новых версій.

Межы ў 30, 90 і 365 дзён я выбраў, калі даты `event-stream` ужо бачыў. Потым пасунуў першую: пры 7 днях выходзіць 49 рэлізаў, пры 90 іх 76, 3.3.6 кожны раз на месцы.

Новага аўтара разам з цішынёй паспрабую, мабыць, на сваім lock-файле. У гэтай выбарцы такіх 157 рэлізаў у 97 пакетаў за год, столькі я прачытаць магу. Пабачым.
