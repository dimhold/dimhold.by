---
title: "Адзін і той жа сервер паказаў p99 у 4 мс і ў 162 мс"
description: "Я 8 разоў спыняў HTTP-сервер на 200 мс і мераў яго 3 кліентамі. Звычайны цыкл з чаканнем адказу атрымаў p99 3,87 мс, кліент па гадзінніку 161,84 мс. HdrHistogram адрамантаваў першы журнал да 152,83 мс. Сярэдняе з p99 па секундах дало 42,0 мс замест 153,1."
date: 2017-01-29
lang: be
translationKey: p99-not-mean
tags: ["performance", "statistics", "networking"]
---

За 40 секунд я 8 разоў спыняў маленькі HTTP-сервер на 200 мс тым самым сігналам, які шле `kill -STOP`. Мой нагрузачны цыкл зрабіў 3810 запытаў і надрукаваў сярэдняе 2,83 мс і p99 3,87 мс. Падобна на здаровы сервер. Другі кліент слаў па 100 запытаў у секунду строга па гадзінніку і адказаў не чакаў. Пры такім самым раскладзе паўз ён атрымаў p99 161,84 мс.

Гэты цыкл я пісаў шмат разоў. Засячы час, паслаць, дачакацца, засячы зноў, пакласці розніцу ў спіс, адсартаваць і ўзяць пазіцыю 99%. Параду глядзець на p99 замест сярэдняга я ведаў і выконваў. А што робіць цыкл, пакуль сервер маўчыць, я ў сябе ні разу не спытаў.

Адказ даўно вядомы. Гіл Тэнэ называе гэта coordinated omission і з 2012 года расказвае пра яго ў дакладзе "How NOT to Measure Latency". wrk2 і HdrHistogram таксама яго. З даклада звычайна пераказваюць простую праверку, націснуць Ctrl-Z пасярод тэсту. Мой скрыпт робіць тое самае. Але мне трэба былі лікі з майго ўласнага цыкла.

## На чым я мераў

Сервер гэта `com.sun.net.httpserver` на OpenJDK 8, 64 патокі. Апрацоўшчык спіць 2 мс замест звароту да базы і аддае 512 байтаў. Кароткі скрыпт на Python шле SIGSTOP і SIGCONT па раскладзе, сапраўдныя паўзы доўжыліся ад 200,2 да 204,3 мс. Кліент гэта 90 радкоў Java на голых сокетах. Для кожнага запыту ён запісвае, калі яго трэба было паслаць, калі паслалі і калі адказ прыйшоў цалкам. Усё гэта жыве на адной віртуальнай машыне з 2 ядрамі, так што шум у яе свой.

Самы першы прагон, яшчэ без паўз, даў медыяну 42 998 мкс, хоць я чакаў 2 тысячы. За 5 секунд змясцілася ўсяго 117 запытаў. Сервер з JDK шле загалоўкі і цела асобна, алгарытм Нэйгла трымае другі пакет да ACK, а другі бок адкладае ACK прыкладна на 40 мс. Гэта апісана ў JDK-6968351 для Java 6 на Windows, на маім Linux тое самае. З `-Dsun.net.httpserver.nodelay=true` медыяна стала 2,3 мс. Меншую затрымку я, напэўна, прыняў бы за сам сервер.

## Калі ўключаюць секундамер

Кліентаў 3. `closed` гэта мой звычайны цыкл на адным злучэнні: наступны запыт ідзе праз 10 мс пасля адпраўкі папярэдняга або адразу пасля адказу, калі адказ затрымаўся. Дагнаць упушчанае ён не спрабуе. `paced` таксама працуе на адным злучэнні, але па раскладзе і пасля затрымкі адразу дасылае ўсё пратэрмінаванае. У `open` 64 злучэнні, кожны запыт ідзе ў свой момант.

| кліент, ад чаго лічым затрымку | запытаў | сярэдняе, мс | p99, мс | максімум, мс | павольнейшыя за 50 мс |
|---|---|---|---|---|---|
| closed, ад адпраўкі | 3810 | 2,83 | 3,87 | 202,77 | 8 |
| paced, ад адпраўкі | 4000 | 3,01 | 9,80 | 202,46 | 8 |
| paced, ад раскладу | 4000 | 8,77 | 171,78 | 202,54 | 179 |
| open, ад раскладу | 4000 | 7,21 | 161,84 | 205,44 | 129 |

<figure class="fig">
<svg viewBox="0 0 680 392" role="img" aria-label="Трэцяя паўза ў 2 асобных прагонах з рознымі кліентамі, 1 кропка гэта 1 запыт, затрымка паводле моманту адпраўкі. У замкнёнага цыкла адна павольная кропка на 202,8 мс і пуста да канца паўзы. У адкрытага кліента 20 запытаў, якія спускаюцца ад 203 мс да 16 мс з крокам 10 мс.">
  <rect x="160.0" y="36" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="166.0" x2="660" y2="166.0" class="f-plain"/>
  <text x="52.0" y="170.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="106.9" x2="660" y2="106.9" class="f-plain"/>
  <text x="52.0" y="110.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="47.8" x2="660" y2="47.8" class="f-plain"/>
  <text x="52.0" y="51.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="75.9" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="92.7" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="109.5" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.3" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.2" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="46.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="498.0" cy="163.8" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="514.8" cy="163.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="531.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="548.5" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="565.3" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="582.1" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="598.9" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="615.8" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="632.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="649.4" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="26.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">замкнёны цыкл</text>
  <text x="326.7" y="26.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">сервер спынены</text>
  <text x="660.0" y="26.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">затрымка, мс</text>
  <rect x="160.0" y="212" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="342.0" x2="660" y2="342.0" class="f-plain"/>
  <text x="52.0" y="346.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="282.9" x2="660" y2="282.9" class="f-plain"/>
  <text x="52.0" y="286.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="223.8" x2="660" y2="223.8" class="f-plain"/>
  <text x="52.0" y="227.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="60.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="76.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="93.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="110.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="221.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="176.7" cy="226.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="193.3" cy="231.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="210.0" cy="237.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="226.7" cy="243.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="243.3" cy="249.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="260.0" cy="255.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="276.7" cy="261.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="293.3" cy="267.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="271.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="326.7" cy="277.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="343.3" cy="283.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="360.0" cy="291.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="376.7" cy="296.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="393.3" cy="302.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="410.0" cy="306.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="426.7" cy="314.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.3" cy="320.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="460.0" cy="326.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="476.7" cy="332.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="493.3" cy="338.1" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="510.0" cy="339.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="526.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="560.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="576.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="593.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="626.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="643.3" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="660.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">адкрыты, па гадзінніку</text>
  <text x="326.7" y="202.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">сервер спынены</text>
  <text x="660.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">затрымка, мс</text>
  <text x="76.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-50</text>
  <text x="160.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="243.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="326.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="410.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="493.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="576.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="650.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="360.0" y="380.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">мс ад адпраўкі самага павольнага запыту</text>
</svg>
<figcaption>Трэцяя паўза ў 2 асобных прагонах. Замкнёны цыкл запісаў 1 павольны запыт, кліент па гадзінніку запісаў 20.</figcaption>
</figure>

Паўза спыняе цыкл разам з серверам. Адзін запыт у дарозе і атрымлівае свае 200 мс, а астатнія 19 проста не адпраўляюцца. Таму 8 паўз гэта 8 павольных запытаў з 3810. Гэта каля 0,2% і p99 да іх не дастае. Два радкі `paced` гэта адны і тыя ж запыты аднаго прагону, розніца толькі ў тым, ад чаго лічыць. У астатніх 2 прагонах `closed` паказаў p99 4,69 і 4,66 мс, `open` 158,41 і 162,12.

Адкуль у `paced` ад адпраўкі 9,80, я адразу не зразумеў, бо паўз і там 8. Астатнія 32 з 40 самых павольных запытаў ляжаць паміж 7,2 і 10,1 с прагону, у адным шумным кавалку. У двух іншых прагонах выйшла 8,28 і 9,71, зноў пераважна праз такі кавалак. Што яго выклікае, я не знайшоў.

Сярэдняе ў тым самым радку таксама падманвае, 2,83 супраць 7,21. Пераход са сярэдняга на p99 мне тут нічога не даў. Бяду ў радку `closed` відаць толькі па максімуме.

HdrHistogram умее рамантаваць такі журнал. `recordValueWithExpectedInterval` з інтэрвалам 10 мс дадае да значэння 200 мс тыя 190, 180 і гэтак далей, якіх не хапае. Версія 2.1.9 з 3 журналаў `closed` атрымала p99 152,83, 156,03 і 156,80 мс, не больш чым на 6% ніжэй за `open`. Я чакаў горшага. Але рамантуе яна толькі журнал з дзіркамі. Я знарок даў ёй журнал `open`, з 4000 запытаў стала 5546 запісаў са сярэднім 26,35 мс. І ніякага папярэджання ў вывадзе няма.

## p99 гэта парог

Да прагону я запісаў прагноз для кліента `open`. Калі f гэта частка часу ў паўзах, то p99 у мілісекундах роўны `2 + 200 * (1 - 0.01 / f)` пры f больш за 1% і каля 2 у астатніх выпадках. Для сярэдняга атрымліваецца `2 + 100 * f`. Кожны радок гэта прагон у 80 секунд.

| паўза раз на | частка | сярэдняе, мс | прагноз | p99, мс | прагноз |
|---|---|---|---|---|---|
| без паўз | 0% | 2,66 | 2 | 6,4 | 2 |
| 40 с | 0,5% | 3,26 | 2,5 | 16,5 | 2 |
| 16 с | 1,25% | 4,09 | 3,25 | 56,0 | 42 |
| 10 с | 2% | 4,97 | 4 | 114,2 | 102 |
| 5 с | 4% | 6,76 | 6 | 153,1 | 152 |

Ад першага радка да апошняга сярэдняе вырасла ў 2,5 раза, а p99 у 24 разы. Прагноз сярэдняга ў кожным радку ніжэйшы на велічыню ад 0,7 да 1 мс. З іх 0,66 ёсць ужо ў ціхім прагоне, медыянны запыт там займае 2,4 мс.

Пасярод табліцы прагноз p99 ніжэйшы на 14 і 12 мс. Спачатку я палічыў гэта шумам машыны, але журнал кажа іншае. Унутры паўзы запыты стаяць лесвічкай з крокам каля 10 мс, напрыклад 203, 197, 187 і так да 17. Лесвічкі большасці паўз амаль супадаюць, бо паўза пачынаецца амаль у адным і тым самым месцы 10-мілісекунднага такту. У прагоне з 16 с p99 гэта 81-ы сярод самых павольных. У 4 паўзах па 16 запытаў ад 56 мс і вышэй, у пятай іх 17. Таму 81-ы роўны 56,0, а 82-і ўжо 50,0. Адзін лішні запыт зрушвае p99 на прыступку, а мая формула раскладвае запыты раўнамерна. У апошнім радку прагноз супаў часткова выпадкова, 80-ы запыт там 158,8.

На радку 0,5% p99 і падвёў. Паўзы па 200 мс ёсць, а p99 кажа 16,5. З 80 самых павольных запытаў у 2 паўзы трапілі толькі 38. Астатнія 42 прыйшлі паміж 30,4 і 32,6 с, калі да бліжэйшай паўзы было 10 с. Чым была занятая машына, я не ведаю. p99.9 роўны 169,6.

## Сярэдняе з p99

Прагон з паўзай раз на 5 с я разрэзаў на секунды і ўзяў p99 кожнай, як гэта робіць сістэма маніторынгу.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="p99 кожнага акна ў 1 с за прагон у 80 с, 80 слупкоў. 16 слупкоў ад 189 да 194 мс, па адным кожныя 5 с, астатнія 64 ад 2,7 да 16,1 мс. Сярэдняе гэтых 80 лікаў 42,0 мс, p99 усяго прагону 153,1 мс.">
  <line x1="60" y1="220.0" x2="460" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="138.2" x2="460" y2="138.2" class="f-plain"/>
  <text x="52.0" y="142.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="56.4" x2="460" y2="56.4" class="f-plain"/>
  <text x="52.0" y="60.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <rect x="60.8" y="215.4" width="3.4" height="4.6" style="fill:var(--muted);stroke:none"/>
  <rect x="65.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="70.8" y="65.6" width="3.4" height="154.4" style="fill:var(--accent);stroke:none"/>
  <rect x="75.8" y="217.4" width="3.4" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="80.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="85.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="90.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="95.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="100.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="105.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="110.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="115.8" y="217.3" width="3.4" height="2.7" style="fill:var(--muted);stroke:none"/>
  <rect x="120.8" y="64.0" width="3.4" height="156.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="130.8" y="206.8" width="3.4" height="13.2" style="fill:var(--muted);stroke:none"/>
  <rect x="135.8" y="213.2" width="3.4" height="6.8" style="fill:var(--muted);stroke:none"/>
  <rect x="140.8" y="214.3" width="3.4" height="5.7" style="fill:var(--muted);stroke:none"/>
  <rect x="145.8" y="63.7" width="3.4" height="156.3" style="fill:var(--accent);stroke:none"/>
  <rect x="150.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="155.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="160.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="165.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="170.8" y="63.3" width="3.4" height="156.7" style="fill:var(--accent);stroke:none"/>
  <rect x="175.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="180.8" y="215.2" width="3.4" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="185.8" y="214.2" width="3.4" height="5.8" style="fill:var(--muted);stroke:none"/>
  <rect x="190.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="195.8" y="64.8" width="3.4" height="155.2" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="205.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="210.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="215.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="220.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="230.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="235.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="240.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="245.8" y="65.5" width="3.4" height="154.5" style="fill:var(--accent);stroke:none"/>
  <rect x="250.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="255.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="260.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="265.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="270.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="275.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="280.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="285.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="290.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="295.8" y="64.1" width="3.4" height="155.9" style="fill:var(--accent);stroke:none"/>
  <rect x="300.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="305.8" y="213.5" width="3.4" height="6.5" style="fill:var(--muted);stroke:none"/>
  <rect x="310.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="315.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="320.8" y="63.5" width="3.4" height="156.5" style="fill:var(--accent);stroke:none"/>
  <rect x="325.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="330.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="335.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="340.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="345.8" y="64.9" width="3.4" height="155.1" style="fill:var(--accent);stroke:none"/>
  <rect x="350.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="355.8" y="215.3" width="3.4" height="4.7" style="fill:var(--muted);stroke:none"/>
  <rect x="360.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="365.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="370.8" y="61.5" width="3.4" height="158.5" style="fill:var(--accent);stroke:none"/>
  <rect x="375.8" y="216.3" width="3.4" height="3.7" style="fill:var(--muted);stroke:none"/>
  <rect x="380.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="385.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="390.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="395.8" y="65.2" width="3.4" height="154.8" style="fill:var(--accent);stroke:none"/>
  <rect x="400.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="405.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <rect x="410.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="415.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="420.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="425.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="430.8" y="217.8" width="3.4" height="2.2" style="fill:var(--muted);stroke:none"/>
  <rect x="435.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="440.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="445.8" y="62.2" width="3.4" height="157.8" style="fill:var(--accent);stroke:none"/>
  <rect x="450.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="455.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <line x1="60" y1="94.7" x2="460" y2="94.7" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <line x1="60" y1="185.6" x2="460" y2="185.6" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="160.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="260.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="360.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="460.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">p99 за 1 с, мс</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">секунды прагону</text>
  <text x="470.0" y="98.7" text-anchor="start" class="f-mono f-ink" style="font-size:11px">p99 усіх запытаў 153,1</text>
  <text x="470.0" y="189.6" text-anchor="start" class="f-mono f-ink" style="font-size:11px">сярэдняе 80 лікаў 42,0</text>
</svg>
<figcaption>p99 за кожную секунду, паўза раз на 5 с. Сярэдняе 80 слупкоў роўнае 42,0 мс і ніводная секунда прагону на яго не падобная.</figcaption>
</figure>

Сярэдняе 80 лікаў роўнае 42,0 мс, а сапраўдны p99 153,1. У медыяннай секунды 4,8 мс. Паўзу захапілі толькі 16 з 80. З вокнамі па 5 с сярэдняе выйшла 150,6, амаль правільна, але толькі таму, што ў кожнае акно трапіла роўна адна паўза. Самі сярэднія ўсярэдняюцца сумленна, 6,76 у абодвух выпадках, бо ў кожнай секундзе па 100 запытаў. Для 2 сервераў, ціхага прагону і прагону з паўзамі раз на 5 с, сярэдняе з p99 роўнае 79,7, а p99 па ўсіх запытах разам 103,7. На слайдах Хайнрыха Гартмана з OSMC у лістападзе 2016 года так і напісана: не агрэгуйце перцэнтылі, агрэгуйце гістаграмы.

## 63%, якія я пазычыў

Дзін і Барозу ў "The Tail at Scale" лічаць, што запыт да 100 сервераў, кожны з якіх павольны з імавернасцю 1%, будзе павольны ў 63% выпадкаў. Я чакаў тых самых 63% для 100 запытаў запар да майго сервера. У журнале прагону з паўзай раз на 5 с выйшла 21,1%.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Частка серый з N запытаў запар, дзе ёсць хоць адзін павольнейшы за p99. N ад 10 да 200. Формула: 9,6, 18,2, 39,5, 63,4, 86,6 працэнта. Тыя ж запыты ўперамешку: 9,5, 18,2, 40,0, 61,3, 84,5. У сапраўдным парадку: 2,8, 4,8, 10,9, 21,1, 41,8.">
  <line x1="60" y1="230.0" x2="560" y2="230.0" class="f-plain"/>
  <text x="52.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="182.5" x2="560" y2="182.5" class="f-plain"/>
  <text x="52.0" y="186.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="60" y1="135.0" x2="560" y2="135.0" class="f-plain"/>
  <text x="52.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="60" y1="87.5" x2="560" y2="87.5" class="f-plain"/>
  <text x="52.0" y="91.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="60" y1="40.0" x2="560" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="85.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="185.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="310.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="435.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="560.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <polyline points="85.0,211.8 110.0,195.4 185.0,154.9 310.0,109.5 560.0,65.5" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4"/>
  <polyline points="85.0,211.9 110.0,195.4 185.0,154.0 310.0,113.5 560.0,69.5" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>
  <circle cx="85.0" cy="211.9" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="110.0" cy="195.4" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="154.0" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="310.0" cy="113.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="560.0" cy="69.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <polyline points="85.0,224.7 110.0,220.9 185.0,209.3 310.0,189.9 560.0,150.6" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="85.0" cy="224.7" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="110.0" cy="220.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="185.0" cy="209.3" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="189.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="560.0" cy="150.6" r="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="570.0" y="61.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">формула</text>
  <text x="570.0" y="83.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">уперамешку</text>
  <text x="570.0" y="148.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">сапраўдны</text>
  <text x="570.0" y="162.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">парадак</text>
  <text x="310.0" y="95.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">63,4%</text>
  <text x="310.0" y="179.9" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">21,1%</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">серыі з N запытаў з павольным, %</text>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">N</text>
</svg>
<figcaption>Колькі серый з N запытаў сустракаюць хоць адзін павольнейшы за p99. Перамяшаныя запыты ідуць за формулай, сапраўдны парадак не.</figcaption>
</figure>

На перамяшаным журнале формула не падманула, 61,3%. Але павольныя запыты ў мяне ідуць пачкамі па 5. Такая пачка бывае толькі ў кожную пятую секунду. У закранутай серыі іх у сярэднім 4,8. Формула патрабуе незалежнасці, а ў 100 запытаў запар да аднаго сервера яе няма, так што памыліўся я сам.

## Чаго я не правяраў

Усе паўзы былі аднаго памеру, а запыты ішлі раўнамерна. Сапраўдныя кліенты прыходзяць нераўнамерна, сапраўдныя паўзы зборшчыка смецця адрозніваюцца адна ад адной. Расклад паўз дакладны, таму 21,1% адносіцца да перыяду ў 5 с і з іншым перыядам зменіцца. Кожны радок табліцы з паўзамі я прагнаў адзін раз, а ў радку 0,5% паўз усяго 2. Кліент і сервер дзеляць 2 ядры, таму частка хваста ціхага прагону можа быць іх узаемнай перашкодай. Сам wrk2 я не запускаў. Мае ранейшыя лікі знятыя такімі ж цыкламі, як `closed`. Нанова я іх яшчэ не здымаў.
