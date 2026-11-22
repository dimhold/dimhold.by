---
title: "Адкуль бярэцца хуткасць пошуку ў HNSW"
description: "Хуткасць HNSW я заўсёды тлумачыў узроўнямі. На SIFT1M з faiss 1.7.0 я палічыў адлегласці на запыт і выключыў верхнія ўзроўні. Кошт не змяніўся."
date: 2021-03-13
lang: be
translationKey: hnsw-inside
tags: ["algorithms", "databases", "performance"]
---
Калі хтосьці тлумачыць HNSW, заўсёды з'яўляецца адна і тая ж карцінка. Некалькі графаў складзеныя слаямі, верхні амаль пусты, у ніжнім усе вектары. Пошук пачынаецца зверху, робіць там доўгія скачкі, спускаецца і заканчвае кароткімі крокамі каля адказу. Падобна на skip list і я сам не раз так тлумачыў. Калі мяне пыталіся, чаму набліжаны пошук такі хуткі, я адказваў "з-за ўзроўняў" і далей ніхто не пытаўся.

Я ні разу гэтага не правяраў. У канцы студзеня выйшаў faiss 1.7.0, я яго ўсталяваў і вырашыў паглядзець, што адбываецца ўнутры аднаго пошуку.

## Як мераў

Даныя SIFT1M: 1 000 000 вектараў па 128 лікаў float. Да іх дададзена 10 000 запытаў і дакладныя 100 бліжэйшых суседзяў для кожнага. Я ўзяў копію з `ann-benchmarks` і выкарыстаў першыя 1000 запытаў. Усё працавала на Python 3.8 з `faiss-cpu` 1.7.0, на 4 віртуальных ядрах воблачнай машыны. Час пошуку ўсюды для 1 патоку і 1 запыту за раз.

Спачатку поўны перабор, каб было з чым параўноўваць. `IndexFlatL2` лічыць 1 000 000 адлегласцей на запыт і траціць на гэта 96 мс.

Потым `IndexHNSWFlat` з M=16 і `efConstruction` 40, гэта значэнне па змаўчанні. Індэкс будаваўся 62 секунды ў 4 патокі. Faiss дае кожнаму вектару выпадковы верхні ўзровень і шанец падняцца на ўзровень вышэй роўны 1 з 16. Падлік добра з гэтым супадае:

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Колькасць вектараў па верхнім узроўні HNSW, лагарыфмічная шкала: узровень 0 937 597, узровень 1 58 500, узровень 2 3693, узровень 3 194, узровень 4 15, узровень 5 1. На кожным узроўні прыкладна ў 16 разоў менш вектараў, чым на ўзроўні ніжэй.">
  <line x1="110" y1="6" x2="110" y2="16" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="118" y="15" text-anchor="start" class="f-muted" style="font-size:11px">чаканае пры 1 з 16</text>
  <text x="100" y="40" text-anchor="end" class="f-ink" style="font-size:12px">узровень 0</text>
  <rect x="110.0" y="29.0" width="437.9" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="547.9" y1="26" x2="547.9" y2="48" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="555.9" y="41" text-anchor="start" class="f-mono" style="font-size:12px">937 597</text>
  <text x="100" y="68" text-anchor="end" class="f-ink" style="font-size:12px">узровень 1</text>
  <rect x="110.0" y="57.0" width="349.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="459.6" y1="54" x2="459.6" y2="76" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="467.6" y="69" text-anchor="start" class="f-mono" style="font-size:12px">58 500</text>
  <text x="100" y="96" text-anchor="end" class="f-ink" style="font-size:12px">узровень 2</text>
  <rect x="110.0" y="85.0" width="261.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="371.3" y1="82" x2="371.3" y2="104" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="379.6" y="97" text-anchor="start" class="f-mono" style="font-size:12px">3693</text>
  <text x="100" y="124" text-anchor="end" class="f-ink" style="font-size:12px">узровень 3</text>
  <rect x="110.0" y="113.0" width="167.8" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="283.0" y1="110" x2="283.0" y2="132" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="291.0" y="125" text-anchor="start" class="f-mono" style="font-size:12px">194</text>
  <text x="100" y="152" text-anchor="end" class="f-ink" style="font-size:12px">узровень 4</text>
  <rect x="110.0" y="141.0" width="86.2" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="194.7" y1="138" x2="194.7" y2="160" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="204.2" y="153" text-anchor="start" class="f-mono" style="font-size:12px">15</text>
  <text x="100" y="180" text-anchor="end" class="f-ink" style="font-size:12px">узровень 5</text>
  <rect x="110.0" y="169.0" width="4.0" height="16.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <line x1="110.0" y1="166" x2="110.0" y2="188" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="122.0" y="181" text-anchor="start" class="f-mono" style="font-size:12px">1</text>
  <line x1="110" y1="196" x2="550" y2="196" class="f-line"/>
  <line x1="110.0" y1="196" x2="110.0" y2="200" class="f-line"/>
  <text x="110.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1</text>
  <line x1="256.7" y1="196" x2="256.7" y2="200" class="f-line"/>
  <text x="256.7" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">100</text>
  <line x1="403.3" y1="196" x2="403.3" y2="200" class="f-line"/>
  <text x="403.3" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">10 000</text>
  <line x1="550.0" y1="196" x2="550.0" y2="200" class="f-line"/>
  <text x="550.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1 000 000</text>
</svg>
<figcaption>Верхні ўзровень кожнага з 1 000 000 вектараў SIFT1M у IndexHNSWFlat, M=16, faiss 1.7.0. Паласа гэта колькасць, засечка гэта чаканае значэнне 1 000 000 × 16^−l × 15/16. Шкала лагарыфмічная.</figcaption>
</figure>

937 597 вектараў жывуць толькі на ніжнім узроўні. Да ўзроўню 5 даходзіць адзіны вектар і з яго пачынаецца кожны пошук.

Хуткасць пошуку залежыць ад `efSearch`, даўжыні спісу кандыдатаў на ніжнім узроўні. Пры ef=64 адзін запыт займае 0,32 мс і знаходзіць 90,5% сапраўдных 10 бліжэйшых суседзяў. Пры ef=256 гэта 1,08 мс і 98,6%. Калі хапае 9 правільных суседзяў з 10, выходзіць прыкладна ў 300 разоў хутчэй за перабор.

## Лічу адлегласці

Час залежыць ад машыны, таму мне быў патрэбны лік вылічаных адлегласцей. У faiss 1.7.0 лічыльнік `hnsw_stats.ndis` застаецца нулём. Я паглядзеў у зыходнікі, у яго нічога не запісваецца. Сапраўдны лік ніжняга ўзроўню ідзе ў `n3`, а верхнія ўзроўні не лічацца нідзе.

Тады я напісаў пошук сам, на Python. Ён ходзіць па тым жа графе, спісы суседзяў узятыя з індэкса faiss. Алгарытм з артыкула пра HNSW: прагны спуск па верхніх узроўнях, потым пошук са спісам кандыдатаў памерам ef на ніжнім.

Пры ef=64 і ef=256 мой пошук знаходзіць амаль тую ж долю суседзяў, што і faiss. Адлегласцей на ніжнім узроўні ён таксама лічыць прыкладна столькі ж, 904 супраць 876 пры ef=64. Пры ef=16 ён знаходзіць больш, 70,7% супраць 64,0%. У faiss іншае правіла спынення і абмежаваная чарга кандыдатаў. Падганяць адно пад адно я не стаў.

Пры ef=64 адзін запыт каштуе прыкладна 1020 адлегласцей з 1 000 000 у базе. 116 з іх ідуць на верхнія ўзроўні, астатнія 904 на ніжні.

## Выключаю ўзроўні

Тут я чакаў убачыць, што даюць узроўні. Узяў той жа граф, прапусціў спуск і пачаў пошук на ніжнім узроўні адразу з пункта ўваходу. Калі доўгія скачкі робяць узроўні, то аднаму ніжняму ўзроўню павінна спатрэбіцца прыкметна больш крокаў, каб дабрацца да патрэбнага месца.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Колькасць адлегласцей на запыт пры ef 16, 64 і 256 для трох спосабаў пачаць пошук на ніжнім узроўні: ef 16, з верхнімі ўзроўнямі: 431, 70,7%; ef 16, толькі ніжні ўзровень, ад пункта ўваходу: 433, 69,3%; ef 16, толькі ніжні ўзровень, выпадковы старт: 472, 57,7%; ef 64, з верхнімі ўзроўнямі: 1020, 91,0%; ef 64, толькі ніжні ўзровень, ад пункта ўваходу: 1022, 90,3%; ef 64, толькі ніжні ўзровень, выпадковы старт: 1103, 82,9%; ef 256, з верхнімі ўзроўнямі: 3005, 98,6%; ef 256, толькі ніжні ўзровень, ад пункта ўваходу: 3000, 98,5%; ef 256, толькі ніжні ўзровень, выпадковы старт: 3160, 97,2%.">
  <rect x="20.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="14" text-anchor="start" class="f-muted" style="font-size:11px">верхнія ўзроўні</text>
  <rect x="180.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="198" y="14" text-anchor="start" class="f-muted" style="font-size:11px">ніжні ўзровень</text>
  <text x="660" y="14" text-anchor="end" class="f-muted" style="font-size:11px">recall@10</text>
  <text x="20" y="59" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=16</text>
  <text x="88" y="41" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="30.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="30.0" width="44.9" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.4" y="41" text-anchor="start" class="f-mono" style="font-size:11px">431</text>
  <text x="660" y="41" text-anchor="end" class="f-mono f-muted" style="font-size:11px">70,7%</text>
  <text x="88" y="59" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="48.0" width="61.6" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.6" y="59" text-anchor="start" class="f-mono" style="font-size:11px">433</text>
  <text x="660" y="59" text-anchor="end" class="f-mono f-muted" style="font-size:11px">69,3%</text>
  <text x="88" y="77" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="66.0" width="67.3" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="169.3" y="77" text-anchor="start" class="f-mono" style="font-size:11px">472</text>
  <text x="660" y="77" text-anchor="end" class="f-mono f-muted" style="font-size:11px">57,7%</text>
  <text x="20" y="125" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=64</text>
  <text x="88" y="107" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="96.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="96.0" width="128.7" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.3" y="107" text-anchor="start" class="f-mono" style="font-size:11px">1020</text>
  <text x="660" y="107" text-anchor="end" class="f-mono f-muted" style="font-size:11px">91,0%</text>
  <text x="88" y="125" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="114.0" width="145.5" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.5" y="125" text-anchor="start" class="f-mono" style="font-size:11px">1022</text>
  <text x="660" y="125" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90,3%</text>
  <text x="88" y="143" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="132.0" width="157.1" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="259.1" y="143" text-anchor="start" class="f-mono" style="font-size:11px">1103</text>
  <text x="660" y="143" text-anchor="end" class="f-mono f-muted" style="font-size:11px">82,9%</text>
  <text x="20" y="191" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=256</text>
  <text x="88" y="173" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="162.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="162.0" width="411.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.9" y="173" text-anchor="start" class="f-mono" style="font-size:11px">3005</text>
  <text x="660" y="173" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98,6%</text>
  <text x="88" y="191" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="180.0" width="427.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.3" y="191" text-anchor="start" class="f-mono" style="font-size:11px">3000</text>
  <text x="660" y="191" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98,5%</text>
  <text x="88" y="209" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="198.0" width="450.0" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="552.0" y="209" text-anchor="start" class="f-mono" style="font-size:11px">3160</text>
  <text x="660" y="209" text-anchor="end" class="f-mono f-muted" style="font-size:11px">97,2%</text>
  <text x="20" y="228" text-anchor="start" class="f-muted" style="font-size:11px">1. з верхнімі ўзроўнямі</text>
  <text x="20" y="246" text-anchor="start" class="f-muted" style="font-size:11px">2. толькі ніжні ўзровень, ад пункта ўваходу</text>
  <text x="20" y="264" text-anchor="start" class="f-muted" style="font-size:11px">3. толькі ніжні ўзровень, выпадковы старт</text>
</svg>
<figcaption>Колькасць адлегласцей на запыт, сярэдняе па 1000 запытах SIFT1M, мой пошук на Python па графе faiss. Вылучаная частка паласы 1 выдаткаваная на верхнія ўзроўні. Справа ад кожнай паласы recall@10.</figcaption>
</figure>

Не спатрэбілася. Пры ef=64 пошук без верхніх узроўняў палічыў 1022 адлегласці, з узроўнямі 1020. Паўната (recall@10) 90,3% супраць 91,0%. Пры ef=256 выйшла 3000 супраць 3005, гэта значыць без узроўняў нават крыху танней.

Сам спуск працуе. Ён высаджвае пошук на медыяннай адлегласці 251 ад запыту, а выпадковы вектар базы знаходзіцца на 556. У 55% запытаў гэта ўжо бліжэй за сотага суседа. Але пошуку без спуску патрэбна ўсяго каля 7 дадатковых крокаў на ніжнім узроўні. Яны каштуюць прыкладна тыя ж 116 адлегласцей, што патраціў спуск.

Гэта не навіна, у літаратуры я гэта знайшоў ужо пасля замеру. У артыкуле пра HNSW сказана, што на даных высокай памернасці цяжка чакаць ад узроўняў таго ж паскарэння, што на даных нізкай. На SIFT выйгрыш ад узроўняў менш прыкметны, чым выйгрыш ад таго, як выбіраюцца суседзі. Нейкі выйгрыш ад узроўняў аўтары ўсё ж намералі, на 5 мільёнах вектараў SIFT і з іншымі наладамі. Lin і Zhao у 2019 годзе мералі гэта на SIFT1M і іншых наборах і напісалі, што на рэальных даных іерархія не дае дадатковай перавагі. Артыкул я чытаў. Гэтага месца я не памятаў.

## Дзе я спатыкнуўся

Потым я паспрабаваў пачынаць ніжні ўзровень з выпадковага вектара для кожнага запыту і вынік стаў горшы. Пры ef=64 паўната ўпала да 82,9%, а кошт вырас да 1103 адлегласцей. Я вырашыў, што ўзроўні ўсё ж важныя, бо даюць добры старт.

Гэта было няправільна. Старт з выпадковага вектара ўзроўню 2 і вышэй даў 85,0% супраць 83,5% з выпадковага вектара толькі ніжняга ўзроўню. Як пачатковыя пункты вектары верхніх узроўняў амаль не лепшыя. Faiss выбірае ўзровень вектара выпадкова і на даныя не глядзіць.

Тады я падумаў, што пункт уваходу проста бліжэй да запытаў. Так і ёсць, медыянная адлегласць 504, гэта бліжэй за любы з 10 выпадковых пачатковых вектараў, якія я спрабаваў. Усе гэтыя старты я параўноўваў пры ef=16 і пункт уваходу там дае 69,3%. Вектар, бліжэйшы да сярэдняга па базе, яшчэ бліжэй і старт з яго дае 70,4%. Поўны спуск дае 70,7%. Але сярод 10 выпадковых стартаў адлегласць вынік не прадказвала: старт на 521 даў 60,4%, а больш далёкі, на 571, даў 61,8%. Так што ў мяне ёсць 2 добрыя старты, якія да таго ж 2 самыя блізкія, і я не ведаю, што робіць старт добрым.

## Ніжні ўзровень

У кожнага вектара на ніжнім узроўні ёсць месца для 32 суседзяў. Вектар, які жыве толькі там, пасля прарэджвання захоўвае ў сярэднім 14. Пошук пры ef=64 робіць каля 66 крокаў і на кожным кроку лічыць адлегласці толькі да новых суседзяў аднаго вектара. Аўтары HNSW прыпісваюць эўрыстыцы прарэджвання разнастайнасць сувязей і звязнасць графа. Я яе не выключаў, таму не магу сказаць, якая частка хуткасці ад яе. Кошт усяго гэтага 132 МБ спісаў суседзяў звыш 512 МБ вектараў і хвіліна на пабудову.

## Чаго я не правяраў

Я праверыў толькі SIFT1M з M=16 і `efConstruction` 40 і пабудаваў індэкс адзін раз. У артыкуле пра HNSW паказана, што на даных з 4 вымярэннямі ўзроўні даюць вялікае паскарэнне, гэтага я не паўтараў. Час узяты з аднаго прагону і паміж прагонамі хістаецца прыкладна на 10%, а лік адлегласцей кожны раз адзін і той жа. Мой пошук гэта мадэль алгарытму на Python, а не сам faiss. З faiss ён сыходзіцца пры ef 64 і 256, але не пры 16.

Узроўні я і далей буду маляваць, калі тлумачу HNSW. Пра SIFT цяпер буду дадаваць, што ў маім замеры яны нічога не зэканомілі.
