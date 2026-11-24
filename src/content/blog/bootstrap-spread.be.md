---
title: "95-працэнтны бутстрап-інтэрвал накрыў сапраўднае сярэдняе 68 разоў са 100"
description: "Я палічыў, як часта 95-працэнтны працэнтыльны бутстрап-інтэрвал накрывае праўду, на выбарках з HTTP-лога NASA за ліпень 1995 года і на 4 вядомых размеркаваннях. Для сярэдняга 20 адказаў выйшла 68,5%, для медыяны 94,0%."
date: 2015-08-01
lang: be
translationKey: bootstrap-spread
tags: ["statistics", "numbers", "algorithms"]
---

Першую гістаграму я пабудаваў ад 0 да 60 000, бо ведаў сапраўднае сярэдняе, 22 741. За краем засталося 3185 значэнняў з 10 000. Калі я адсунуў край да 240 000, на графіку паказаўся горб, за ім пустое месца, яшчэ горб, добра відаць 5 гарбоў. Гэта 10 000 бутстрап-сярэдніх адной выбаркі з 20 адказаў вэб-сервера, у байтах. Адзін з гэтых 20 адказаў важыць 835 394 байты. Гарбы адрозніваюцца тым, колькі разоў ён трапіў у бутстрап-выбарку.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Гістаграма 10 000 бутстрап-сярэдніх адной выбаркі з 20 памераў адказу. Асобныя гарбы з прамежкамі: адказ у 835 394 байты трапіў у бутстрап-выбарку 0, 1, 2, 3, 4 разы ці больш. Сапраўднае сярэдняе 22 741 ляжыць у першым гарбе. Інтэрвал ад 8818 да 141 714.">
  <rect x="30.5" y="239.7" width="9.3" height="0.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="40.8" y="223.2" width="9.3" height="16.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="51.2" y="152.2" width="9.3" height="87.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="61.5" y="85.8" width="9.3" height="154.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="71.8" y="127.2" width="9.3" height="112.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="82.2" y="203.4" width="9.3" height="36.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="92.5" y="233.7" width="9.3" height="6.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="102.8" y="239.4" width="9.3" height="0.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="144.2" y="233.3" width="9.3" height="6.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="154.5" y="173.7" width="9.3" height="66.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="164.8" y="91.1" width="9.3" height="148.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="175.2" y="105.0" width="9.3" height="135.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="185.5" y="185.9" width="9.3" height="54.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="195.8" y="229.3" width="9.3" height="10.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="206.2" y="239.2" width="9.3" height="0.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="216.5" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="247.5" y="239.0" width="9.3" height="1.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="257.8" y="221.1" width="9.3" height="18.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="268.2" y="169.7" width="9.3" height="70.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="278.5" y="162.6" width="9.3" height="77.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="288.8" y="202.0" width="9.3" height="38.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="299.2" y="231.2" width="9.3" height="8.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="309.5" y="239.1" width="9.3" height="0.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="319.8" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="350.8" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="361.2" y="237.1" width="9.3" height="2.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="371.5" y="222.8" width="9.3" height="17.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="381.8" y="216.5" width="9.3" height="23.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="392.2" y="224.6" width="9.3" height="15.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="402.5" y="236.9" width="9.3" height="3.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="412.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="464.5" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="474.8" y="238.1" width="9.3" height="1.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="485.2" y="234.0" width="9.3" height="6.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="495.5" y="236.3" width="9.3" height="3.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="505.8" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="516.2" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="578.2" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="588.5" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="598.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="609.2" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <line x1="30.0" y1="240.0" x2="650.0" y2="240.0" style="stroke:var(--muted);stroke-width:1"/>
  <text x="30.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="185.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="340.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="495.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <text x="650.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="650.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">сярэдняе бутстрап-выбаркі, тысячы байтаў</text>
  <text x="102.2" y="115.8" text-anchor="start" class="f-mono f-ink" style="font-size:13px">× 0</text>
  <text x="169.5" y="83.1" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 1</text>
  <text x="283.2" y="154.6" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 2</text>
  <text x="386.5" y="208.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 3</text>
  <text x="489.8" y="226.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 4</text>
  <line x1="52.8" y1="34.0" x2="396.1" y2="34.0" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="52.8" y1="29.0" x2="52.8" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="52.8" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8818</text>
  <line x1="396.1" y1="29.0" x2="396.1" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.1" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">141 714</text>
  <text x="408.1" y="38.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">бутстрап-інтэрвал, 95%</text>
  <line x1="88.7" y1="34.0" x2="88.7" y2="240.0" style="stroke:var(--accent);stroke-width:2"/>
  <text x="96.7" y="56.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">сапраўднае сярэдняе 22 741</text>
</svg>
<figcaption>10 000 бутстрап-сярэдніх першай выбаркі, байты. Над гарбамі падпісана, колькі разоў у бутстрап-выбарку трапіў адзіны адказ у 835 394 байты. 7 сярэдніх, большых за 240 000, не паказаны.</figcaption>
</figure>

За бутстрап я бяруся, калі не памятаю формулу. Пішам 20 лікаў на картках, 20 разоў выцягваем картку і кожны раз кладзём яе назад, лічым сярэдняе. Паўтараем шмат разоў, сартуем сярэднія і адразаем па 2,5% з кожнага краю. Тое, што засталося, называюць 95-працэнтным інтэрвалам. Той жа код падыходзіць для медыяны і для p95, за гэта я яго і люблю. У гэтыя 95% я заўсёды верыў на слова і ні разу не палічыў, як часта яны спраўджваюцца.

Метад прыдумаў Эфран у 1979 годзе, слабыя месцы таксама даўно вядомыя. Бікел і Фрыдман апісалі правал на максімуме ў 1981 годзе, Атрэя разабраў сярэдняе пры бясконцай дысперсіі ў 1987. Хестэрберг у лістападзе мінулага года пісаў, што на малых выбарках такі інтэрвал занадта вузкі. Мне хацелася ўбачыць гэта ў працэнтах і на даных сапраўднага сервера.

## Як я лічыў

Каб лічыць промахі, трэба ведаць праўду. Я ўзяў HTTP-лог NASA за ліпень 1995 года з Internet Traffic Archive, 1 891 715 радкоў. Мая генеральная сукупнасць: усе адказы са статусам 200 і вядомым памерам, іх 1 701 451. Сярэдняе 22 741 байт, медыяна 4179, p95 84 905. На самы буйны 1% адказаў прыпадае 30% байтаў.

Далей я выцягваю n выпадковых адказаў, раблю з іх 1000 бутстрап-выбарак на numpy (`RandomState`, seed зафіксаваны) і гляджу, ці трапіла праўда ў інтэрвал. Пры n да 200 гэта 4000 паўтораў, пры большых n 2000. Стандартная памылка адной клеткі меншая за адзін пункт. Тое самае я прагнаў на нармальным размеркаванні, экспаненцыяльным, лагнармальным з сігмай 1 і Парэта з альфай 1,5, у якога сярэдняе ёсць, а канечнай дысперсіі няма. Нармальнае служыць кантролем: пры n = 1000 яго сярэдняе накрыта ў 94,7% выпадкаў.

Да прагону я запісаў у файл 7 чаканняў. Спраўдзіліся 2. Вось лог, пакрыццё ў працэнтах:

| n | сярэдняе | медыяна | p95 | адносіна двух сярэдніх |
|---|---|---|---|---|
| 20 | 68,5 | 94,0 | 64,9 | 90,8 |
| 50 | 76,1 | 94,8 | 89,6 | 91,3 |
| 100 | 80,2 | 95,0 | 89,9 | 91,9 |
| 200 | 85,2 | 95,2 | 94,0 | 92,6 |
| 500 | 91,8 | 96,9 | 93,8 | 94,5 |
| 1000 | 93,2 | 96,5 | 95,5 | 94,0 |

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Пакрыццё 95% працэнтыльнага бутстрапа на логу NASA для выбарак ад 20 да 1000 адказаў. Сярэдняе: 68,5; 76,1; 80,2; 85,2; 91,8; 93,2. Медыяна: 94,0; 94,8; 95,0; 95,2; 96,9; 96,5. p95: 64,9; 89,6; 89,9; 94,0; 93,8; 95,5. Адносіна двух сярэдніх: 90,8; 91,3; 91,9; 92,6; 94,5; 94,0.">
  <line x1="190.0" y1="254.0" x2="620.0" y2="254.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="258.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="190.0" y1="199.0" x2="620.0" y2="199.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">70</text>
  <line x1="190.0" y1="144.0" x2="620.0" y2="144.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="190.0" y1="89.0" x2="620.0" y2="89.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="93.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="190.0" y1="34.0" x2="620.0" y2="34.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="190.0" y1="61.5" x2="620.0" y2="61.5" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:5 4"/>
  <text x="630.0" y="65.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">95</text>
  <text x="190.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="290.7" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="366.9" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="443.1" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="543.8" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="620.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="405.0" y="296.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">памер выбаркі</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">пакрыццё, %</text>
  <polyline points="190.0,207.4 290.7,165.6 366.9,143.0 443.1,115.7 543.8,79.1 620.0,71.4" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="190.0" cy="207.4" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="290.7" cy="165.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="366.9" cy="143.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.1" cy="115.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.8" cy="79.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="620.0" cy="71.4" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="180.0" y="208.4" text-anchor="end" class="f-mono f-accent" style="font-size:11px">сярэдняе 68,5</text>
  <polyline points="190.0,66.9 290.7,62.9 366.9,61.8 443.1,60.5 543.8,51.3 620.0,53.0" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <circle cx="190.0" cy="66.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="62.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="61.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="60.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="51.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="53.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="66.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">медыяна 94,0</text>
  <polyline points="190.0,226.9 290.7,91.1 366.9,89.5 443.1,67.1 543.8,68.4 620.0,58.8" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="190.0" cy="226.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="290.7" cy="91.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="366.9" cy="89.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="443.1" cy="67.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.8" cy="68.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="620.0" cy="58.8" r="3" style="fill:var(--muted);stroke:none"/>
  <text x="180.0" y="233.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">p95 64,9</text>
  <polyline points="190.0,84.3 290.7,81.7 366.9,78.5 443.1,74.6 543.8,64.3 620.0,67.3" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:2 3"/>
  <circle cx="190.0" cy="84.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="81.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="78.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="74.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="64.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="67.3" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="92.3" text-anchor="end" class="f-mono f-ink" style="font-size:11px">адносіна сярэдніх 90,8</text>
</svg>
<figcaption>Доля выбарак, чый інтэрвал накрыў сапраўднае значэнне, лог NASA, %. Пункцірам абяцаныя 95%.</figcaption>
</figure>

## Сярэдняе

Я думаў, што з сярэднім усё будзе добра ўжо з n = 50. Пры n = 20 інтэрвал накрыў яго ў 2739 выбарках з 4000. Промахі амаль усе ў адзін бок: 1258 разоў інтэрвал цалкам ляжаў ніжэй за праўду і 3 разы вышэй. Гэту клетку я паўтарыў з 6 іншымі seed: сярэдняе накрыта ад 2700 да 2776 разоў, а замест тых 3 атрымліваецца ад 4 да 10. У Парэта пакрыццё расце з 65,0% пры n = 20 усяго да 78,0% пры n = 1000.

Яшчэ я думаў, што бутстрап будзе не горшы за t-інтэрвал з падручніка. На логу пры n = 20 выйшла нічыя: на тых жа выбарках t-інтэрвал накрыў сярэдняе 2738 разоў, на адзін менш. А на нармальным пры тым жа n ён лепшы, 94,9% супраць 92,7%. Да 3 пунктаў розніца не дайшла нідзе.

Потым я ўзяў новы прагон і падзяліў выбаркі па простай прыкмеце: ці трапіў у выбарку хоць адзін адказ з самага буйнога 1%, ад 298 302 байтаў. Пры n = 20 такога адказу няма ў 82% выбарак, іх інтэрвалы накрываюць сярэдняе ў 61% выпадкаў. Калі хоць адзін ёсць, накрываюць у 99,6%. З 1276 промахаў 1273 прыпалі на першую групу.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Палосы для выбарак па 20, 50, 100 і 200 адказаў, кожная падзелена на 2 часткі. Выбаркі без ніводнага адказу з самага буйнога 1%, у працэнтах: 82,2; 60,3; 36,6; 13,6. З усіх выбарак прамахнуліся ў гэтай частцы: 31,8; 24,2; 19,1; 10,1. У астатняй частцы: 0,1; 0,3; 1,3; 4,7.">
  <text x="60.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">няма буйных адказаў</text>
  <text x="660.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">ёсць хоць адзін</text>
  <rect x="60.0" y="30" width="189.0" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="249.0" y="30" width="298.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="554.0" y="30" width="105.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="659.6" y="30" width="0.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="49.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">20</text>
  <text x="60.0" y="73.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">міма 31,8%</text>
  <text x="660.0" y="73.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">міма 0,1%</text>
  <rect x="60.0" y="86" width="143.9" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="203.9" y="86" width="214.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="424.2" y="86" width="233.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.1" y="86" width="1.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">50</text>
  <text x="60.0" y="129.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">міма 24,2%</text>
  <text x="660.0" y="129.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">міма 0,3%</text>
  <rect x="60.0" y="142" width="113.8" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="173.8" y="142" width="103.8" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283.6" y="142" width="369.0" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="652.6" y="142" width="7.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="161.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">100</text>
  <text x="60.0" y="185.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">міма 19,1%</text>
  <text x="660.0" y="185.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">міма 1,3%</text>
  <rect x="60.0" y="198" width="60.1" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="120.1" y="198" width="20.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="146.5" y="198" width="485.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="632.1" y="198" width="27.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="217.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">200</text>
  <text x="60.0" y="241.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">міма 10,1%</text>
  <text x="660.0" y="241.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">міма 4,7%</text>
  <rect x="60" y="259" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">міма</text>
  <rect x="180" y="259" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="198.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">накрыў сярэдняе</text>
</svg>
<figcaption>У кожнай паласе 4000 выбарак з лога NASA, працэнты ад усіх 4000. Акцэнтным колерам інтэрвалы, якія не накрылі сапраўднае сярэдняе. Злева ад разрыву выбаркі без ніводнага адказу з самага буйнога 1%.</figcaption>
</figure>

Так што брыдкая гістаграма ў пачатку атрымалася з добрай выбаркі. 75% яе байтаў прыпадае на адзін адказ, інтэрвал ідзе ад 8818 да 141 714 і праўда ўнутры. Побач з інтэрвалам я збіраўся друкаваць долю самага вялікага значэння, як папярэджанне. Праверыў на іншых 4000 выбарках па 20, яно працуе наадварот. У чвэрці выбарак, дзе гэтая доля найменшая, сярэдняе накрыта ў 47% выпадкаў, у чвэрці з найбольшай доляй у 95%. З шырынёй яшчэ горш. Самая вузкая чвэрць інтэрвалаў, карацейшых за 15 617 байтаў, накрыла сярэдняе ў 1% выпадкаў.

У сярэдніх 4000 выбарак па 20 стандартнае адхіленне 17 845. Бутстрап ацэньвае яго ў 6609, гэта медыяна па выбарках. У медыяны 20 адказаў на самай справе 2238, паводле бутстрапа 2363, мне такой дакладнасці хапае.

## Медыяна, p95, максімум

Медыяна трымаецца ўсюды, ад 93,4% да 96,9% на ўсіх размеркаваннях. Яе інтэрвал залежыць толькі ад месцаў у адсартаванай выбарцы. Для 21 значэння я палічыў гэтыя месцы дакладна, паводле бінаміяльнага размеркавання: з 7-га значэння па 15-е, якімі б яны ні былі, медыяна пры гэтым накрыта ў 92,2% выпадкаў.

Для p95 пры n = 20 пакрыццё ад 63% да 65% на любым размеркаванні, на нармальным таксама. Тут хапае арыфметыкі. У 0,95^20 = 35,8% выбарак усе 20 значэнняў меншыя за сапраўдны p95 і ніякі бутстрап вышэй за самае вялікае з іх не падымецца. Пры n = 100 я чакаў, што ўсё будзе ў норме. Выйшла ад 88% да 90% усюды, хоць тая ж арыфметыка тлумачыць толькі 0,6% выбарак. Ацэнка numpy пры такім памеры гэта амаль 95-е значэнне са 100, таму я зноў палічыў месцы. Інтэрвал ідзе ад 89-га значэння да 98-га, а сапраўдны p95 у 11,8% выбарак большы за 98-е. Калі за p95 браць 96-е значэнне, месцы будуць 91 і 99. На 4000 выбарках з нармальнага размеркавання з ацэнкай numpy накрыта 88,7%, з 96-м значэннем 94,0%. Я не ведаў, што адно месца каштуе 5 пунктаў.

Максімум лога накрыты 0 разоў з 16 000 пры n да 200. Самы вялікі адказ гэта адзін радок з 1,7 мільёна, а вышэй за самае вялікае значэнне ў выбарцы інтэрвал не падымаецца.

## Адносіна

Я чакаў, што адносіна двух дрэнных сярэдніх будзе горшая за адно дрэннае сярэдняе. А выйшла 90,8% пры n = 20. Абедзве групы ўзятыя з аднаго лога, абодва сярэднія звычайна заніжаныя і промахі разыходзяцца ў абодва бакі, 4,5% і 4,7%. Але гэта A/A-тэст, самы лёгкі выпадак. Калі я параўнаў лог з экспаненцыяльным размеркаваннем з тым жа сярэднім, пакрыццё было 77,2% пры n = 20 і 88,5% пры n = 200.

Паспрабаваў адзін сродак, bootstrap-t. На логу пры n = 20 ён даў 88,7% супраць 69,2% у звычайнага на тых жа выбарках, інтэрвалы пры гэтым у 2,1 раза шырэйшыя. Пры n = 200 усё яшчэ 89,6%. І ўнутры кожнай бутстрап-выбаркі яму патрэбна стандартная памылка, гэта значыць тая самая формула, без якой я хацеў абысціся.

## Чаго я не правяраў

Адказы я выцягваў незалежна, а сапраўдны трафік ідзе пачкамі, так што на радках лога, узятых запар, хутчэй за ўсё, будзе горш. Не спрабаваў BCa, іншыя ўзроўні замест 95% і іншыя пары форм для адносіны. Лог усяго адзін, 1995 года. Каб дзяліць выбаркі па самым буйным 1%, патрэбна ўся сукупнасць. Што друкаваць побач з інтэрвалам замест долі, я пакуль не ведаю.
