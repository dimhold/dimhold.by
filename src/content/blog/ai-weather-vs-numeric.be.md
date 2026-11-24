---
title: "30 дзён паправак далі столькі ж, колькі прагноз ад ШІ, але толькі дзякуючы 2 аэрапортам з 16"
description: "Я параўнаў прагнозы тэмпературы AIFS, IFS і GFS з тэрмометрамі 16 аэрапортаў з сакавіка па ліпень 2025 года. На дзень наперад AIFS дакладнейшая на 16%. Старая IFS без сваёй сярэдняй памылкі за 30 дзён дала ў сярэднім такі ж выйгрыш, але гэтую нічыю зрабілі 2 аэрапорты."
date: 2025-08-03
lang: be
translationKey: ai-weather-vs-numeric
tags: ["open-data", "machine-learning", "numbers"]
---

GFS для аэрапорта Дэлі на дзень наперад памыляецца ў сярэднім на 4,0 градуса. Калі проста паўтарыць учарашнюю тэмпературу, памылка там 1,9. На гэты радок я натрапіў у табліцы, якую складаў дзеля іншага. У ёй прагнозы за 5 месяцаў з бясплатнага архіва `open-meteo.com` стаяць побач са зводкамі 16 аэрапортаў.

Звычайна я бяру тую мадэль, якую пагодны API аддае, калі нічога не ўказаць. З градуснікам я яе ні разу не звяраў. А цяпер у звыклай мадэлі з'явілася суседка. 25 лютага ECMWF [увёў у аператыўную працу AIFS](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational), нейрасетку, якая лічыць поруч з фізічнай мадэллю IFS і пачынае з тых самых пачатковых даных. У абвестцы напісана, што паводле многіх паказчыкаў яна лепшая, з выйгрышам да 20%. API аддае абедзве, у запыце мяняецца адно слова. Мне стала цікава, чаго вартае гэтае слова для звычайнай тэмпературы паветра.

Пытанне не новае. [Бен Буалег з калегамі](https://arxiv.org/abs/2307.10128) параўноўвалі мадэль Pangu з IFS ва ўмовах, блізкіх да аператыўных, у тым ліку па станцыях. [Брэмнес з сааўтарамі](https://arxiv.org/abs/2309.01247) рабілі гэта на нарвежскіх станцыях, з постапрацоўкай і без яе. Мне хацелася паглядзець на AIFS такую, якой яе аддае бясплатны API.

## Што я параўноўваў

Previous Runs API таго ж сэрвісу захоўвае, што мадэль казала за 1, 2, 3, 4 і 5 дзён да патрэбнай гадзіны. Я ўзяў `ecmwf_ifs025`, `ecmwf_aifs025_single` (гэта AIFS Single v1) і амерыканскую `gfs_global` з 1 сакавіка па 31 ліпеня і перадаў у запыт вышыню аэрапорта. За праўду прыняў METAR з архіва Iowa Environmental Mesonet, бліжэйшую зводку не далей за 15 хвілін ад гадзіны. Спіс аэрапортаў зафіксаваў да прагону, ад Мінска і Хельсінкі да Сінгапура і Сіднея.

Крок у AIFS 6 гадзін, таму ў галоўнай табліцы толькі 00, 06, 12 і 18 UTC. Памылка спачатку ўсярэдняецца па кожным аэрапорце, потым па аэрапортах. Інтэрвалы 95-працэнтныя, бутстрэп па цэлых тыднях. У планах была і GraphCast, але ў архіве яна ёсць для 69% гадзін на 1-ы дзень і для 27% на 3-і, давялося адмовіцца.

Перад прагонам я запісаў, чаго чакаю: нічыю на 1-ы дзень, выйгрыш AIFS ад 5 да 10% на тэрмінах ад 3 да 5 дзён і яе пройгрыш на дзённым максімуме. Не спраўдзілася нічога.

## AIFS супраць IFS

| тэрмін, дзён | IFS | AIFS | GFS | як N дзён таму |
|---|---|---|---|---|
| 1 | 1,41 | 1,19 | 1,57 | 2,47 |
| 2 | 1,50 | 1,25 | 1,71 | 3,15 |
| 3 | 1,61 | 1,34 | 1,82 | 3,31 |
| 4 | 1,70 | 1,47 | 1,96 | 3,45 |
| 5 | 1,86 | 1,61 | 2,17 | 3,60 |

На 1-ы дзень AIFS лепшая на 0,22 (ад 0,19 да 0,25), гэта 15,7%. Перамагае яна ў 14 аэрапортах з 16. На 3-і дзень выйгрыш 16,7%, на 5-ы 13,3%. На 5-ы дзень AIFS памыляецца гэтак жа, як IFS на 3-і. Але гэта ўсё сярэднія. Калі глядзець на асобныя гадзіны на 1-ы дзень, AIFS бліжэй да тэрмометра ў 56% выпадкаў, IFS у 39%, астатняе нічыя.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Сярэдняя абсалютная памылка тэмпературы ў 16 аэрапортах па тэрмінах ад 1 да 5 дзён, сакавік-ліпень 2025 года, градусы. AIFS: 1,19; 1,25; 1,34; 1,47; 1,61. IFS: 1,41; 1,50; 1,61; 1,70; 1,86. GFS: 1,57; 1,71; 1,82; 1,96; 2,17. Паўтор назірання N дзён таму: 2,47; 3,15; 3,31; 3,45; 3,60.">
  <line x1="50" y1="250.0" x2="470" y2="250.0" class="f-plain"/>
  <text x="42.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0</text>
  <line x1="50" y1="196.0" x2="470" y2="196.0" class="f-plain"/>
  <text x="42.0" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="50" y1="142.0" x2="470" y2="142.0" class="f-plain"/>
  <text x="42.0" y="146.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="50" y1="88.0" x2="470" y2="88.0" class="f-plain"/>
  <text x="42.0" y="92.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="50" y1="34.0" x2="470" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="70.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <text x="170.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <text x="270.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <text x="370.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="470.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">5</text>
  <polyline points="70.0,116.4 170.0,80.2 270.0,71.0 370.0,63.6 470.0,55.8" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:2 4"/>
  <circle cx="70.0" cy="116.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="80.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="71.0" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="63.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="55.8" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,165.3 170.0,157.5 270.0,151.9 370.0,144.2 470.0,133.0" style="fill:none;stroke:var(--muted);stroke-width:2;"/>
  <circle cx="70.0" cy="165.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="157.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="151.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="144.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="133.0" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,174.1 170.0,169.1 270.0,163.3 370.0,158.4 470.0,149.5" style="fill:none;stroke:var(--ink);stroke-width:2;"/>
  <circle cx="70.0" cy="174.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.0" cy="169.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="270.0" cy="163.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="370.0" cy="158.4" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="470.0" cy="149.5" r="3" style="fill:var(--ink);stroke:none"/>
  <polyline points="70.0,186.0 170.0,182.3 270.0,177.8 370.0,170.9 470.0,162.9" style="fill:none;stroke:var(--accent);stroke-width:2;"/>
  <circle cx="70.0" cy="186.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="170.0" cy="182.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="270.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="370.0" cy="170.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="470.0" cy="162.9" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="482.0" y="59.8" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3,60 як N дзён таму</text>
  <text x="482.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2,17 GFS</text>
  <text x="482.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,86 IFS</text>
  <text x="482.0" y="171.9" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,61 AIFS</text>
  <line x1="270.0" y1="163.3" x2="470.0" y2="162.9" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">сярэдняя абсалютная памылка, °C</text>
  <text x="470.0" y="286.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">тэрмін, дзён</text>
</svg>
<figcaption>На 5-ы дзень AIFS памыляецца гэтак жа, як IFS на 3-і. Усе прагнозы звераны з тэрмометрамі аэрапортаў у 00, 06, 12, 18 гадзін UTC.</figcaption>
</figure>

Прайграе AIFS у Лондане і Ёханэсбургу. У Ёханэсбургу ўчарашняя тэмпература прадказвала не горш за яе, 1,99 супраць 2,02. Для Мінска выйшла 1,00 у AIFS і 1,19 у IFS.

<figure class="fig">
<svg viewBox="0 0 680 410" role="img" aria-label="Прагноз на дзень наперад, сярэдняя абсалютная памылка па аэрапортах. IFS, AIFS, GFS: Дэлі 1,84; 1,23; 4,02, Чыкага 1,61; 1,16; 1,53, Сінгапур 1,51; 1,07; 1,21, Хельсінкі 1,23; 0,89; 1,46, Дэнвер 1,73; 1,40; 1,85, Мадрыд 1,22; 0,90; 1,47, Токіа 1,40; 1,10; 0,95, Берлін 1,26; 0,96; 1,46, Сідней 1,85; 1,61; 1,03, Мінск 1,19; 1,00; 1,58, Сан-Паўлу 1,20; 1,06; 1,27, Варшава 1,16; 1,05; 1,33, Найробі 1,18; 1,07; 1,36, Таронта 1,49; 1,40; 1,69, Лондан 0,98; 1,08; 1,24, Ёханэсбург 1,65; 2,02; 1,67.">
  <line x1="170.0" y1="40" x2="170.0" y2="366" class="f-plain"/>
  <text x="170.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="320.0" y1="40" x2="320.0" y2="366" class="f-plain"/>
  <text x="320.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="470.0" y1="40" x2="470.0" y2="366" class="f-plain"/>
  <text x="470.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="620.0" y1="40" x2="620.0" y2="366" class="f-plain"/>
  <text x="620.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="126.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Дэлі</text>
  <line x1="296.0" y1="56" x2="205.1" y2="56" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="622.6" cy="56" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="296.0" cy="56" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="205.1" cy="56" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Чыкага</text>
  <line x1="261.5" y1="76" x2="193.7" y2="76" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="249.5" cy="76" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="261.5" cy="76" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="193.7" cy="76" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сінгапур</text>
  <line x1="245.9" y1="96" x2="179.9" y2="96" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="201.5" cy="96" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="245.9" cy="96" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="96" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Хельсінкі</text>
  <line x1="204.9" y1="116" x2="152.8" y2="116" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.7" cy="116" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="204.9" cy="116" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="152.8" cy="116" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="140.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Дэнвер</text>
  <line x1="279.2" y1="136" x2="229.7" y2="136" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="298.1" cy="136" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="279.2" cy="136" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="136" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Мадрыд</text>
  <line x1="203.3" y1="156" x2="155.0" y2="156" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="240.3" cy="156" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="203.3" cy="156" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="155.0" cy="156" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="180.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Токіа</text>
  <line x1="230.1" y1="176" x2="185.0" y2="176" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="162.2" cy="176" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="230.1" cy="176" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="176" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="200.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Берлін</text>
  <line x1="208.5" y1="196" x2="164.6" y2="196" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.3" cy="196" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="208.5" cy="196" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="164.6" cy="196" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="220.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сідней</text>
  <line x1="298.1" y1="216" x2="260.9" y2="216" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="173.9" cy="216" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="298.1" cy="216" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.9" cy="216" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="240.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Мінск</text>
  <line x1="198.2" y1="236" x2="170.4" y2="236" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="256.7" cy="236" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="198.2" cy="236" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.4" cy="236" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="260.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сан-Паўлу</text>
  <line x1="199.4" y1="256" x2="178.7" y2="256" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="210.2" cy="256" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="199.4" cy="256" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="178.7" cy="256" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="280.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Варшава</text>
  <line x1="194.6" y1="276" x2="177.2" y2="276" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="219.2" cy="276" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="194.6" cy="276" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="177.2" cy="276" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Найробі</text>
  <line x1="197.1" y1="296" x2="179.9" y2="296" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="224.3" cy="296" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="197.1" cy="296" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="296" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="320.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Таронта</text>
  <line x1="244.1" y1="316" x2="229.7" y2="316" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="273.8" cy="316" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="244.1" cy="316" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="316" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="340.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Лондан</text>
  <line x1="167.1" y1="336" x2="181.5" y2="336" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="206.1" cy="336" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="167.1" cy="336" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="181.5" cy="336" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="360.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Ёханэсбург</text>
  <line x1="266.8" y1="356" x2="322.5" y2="356" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="270.6" cy="356" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="266.8" cy="356" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="322.5" cy="356" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="144" cy="18" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="154.0" y="22.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <circle cx="224" cy="18" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="22.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">AIFS</text>
  <circle cx="304" cy="18" r="4" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="314.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">GFS</text>
  <text x="650.0" y="400.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">сярэдняя абсалютная памылка, °C</text>
</svg>
<figcaption>На дзень наперад. AIFS дакладнейшая за IFS у 14 аэрапортах з 16. Адзінокая кропка справа гэта GFS у Дэлі, 4,0 градуса.</figcaption>
</figure>

Праз Дэлі я ледзь не зрабіў няправільную выснову. Паводле табліцы GFS на 1-ы дзень горшая за IFS на 0,16 (ад 0,12 да 0,21). Без Дэлі застаецца 0,03 (ад -0,01 да 0,06). Я ўжо быў гатовы напісаць, што GFS не горшая за IFS і ўсё псуе адзін аэрапорт. Потым вярнуў Дэлі і выкінуў Сідней, дзе GFS лепшая на 0,83. Разрыў вырас да 0,23. Калі лічыць аэрапорты, GFS прайграе ў 12 з 16, а сярэдняе ідзе туды, куды яго пацягне адзін з іх. Мае інтэрвалы перабіраюць тыдні і нічога не ведаюць пра іншы спіс аэрапортаў.

Што не так з Дэлі, я не ведаю. Памылка GFS там ад 3,5 да 4,4 градуса ў кожную з 4 гадзін, па месяцах ад 3,1 у ліпені да 5,2 у маі. Падобна на зрух, які мяняецца павольна.

## Павольны зрух можна адняць

Я і адняў, прычым усюды. Для кожнай мадэлі і тэрміну, у кожным аэрапорце і гадзіне, узяў сярэднюю памылку за апошнія 30 дзён. Браў толькі тыя памылкі, якія ўжо былі вядомыя, калі прагноз выйшаў. На pandas гэта адзін радок:

```
bias = err.shift(lead + 1).rolling(30, min_periods=14).mean()
```

Акну трэба час, каб напоўніцца, таму гэтыя лікі пачынаюцца з 7 красавіка (7329 пар аэрапорта і гадзіны). На іх у IFS 1,39, у AIFS 1,20, выйгрыш 0,19. IFS пасля аднімання дае 1,21, таксама на 0,19 менш. Рознасць выпраўленай IFS і AIFS як ёсць 0,002 (ад -0,030 да 0,035).

<figure class="fig">
<svg viewBox="0 0 680 316" role="img" aria-label="Памылка да і пасля аднімання сярэдняй памылкі за апошнія 30 дзён, гадзіны для ўсіх палос адны і тыя ж. тэрмін 1 дз., IFS: 1,39, 1,21; тэрмін 1 дз., AIFS: 1,20, 1,03; тэрмін 1 дз., GFS: 1,58, 1,29; тэрмін 5 дз., IFS: 1,84, 1,69; тэрмін 5 дз., AIFS: 1,61, 1,48; тэрмін 5 дз., GFS: 2,19, 1,97.">
  <line x1="347.2" y1="44" x2="347.2" y2="170" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="70.0" y="52.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">тэрмін 1 дз.</text>
  <text x="60.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="62" width="321.4" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="399.4" y="72.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,39</text>
  <rect x="70" y="76" width="277.7" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="352.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,21</text>
  <text x="60.0" y="116.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="98" width="277.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="355.2" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,20</text>
  <rect x="70" y="112" width="237.9" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="312.9" y="123.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,03</text>
  <text x="60.0" y="152.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="134" width="365.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="443.2" y="144.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,58</text>
  <rect x="70" y="148" width="297.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="372.0" y="159.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,29</text>
  <text x="70.0" y="188.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">тэрмін 5 дз.</text>
  <text x="60.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="198" width="423.5" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="501.5" y="208.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,84</text>
  <rect x="70" y="212" width="388.3" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="463.3" y="223.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,69</text>
  <text x="60.0" y="252.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="234" width="370.8" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="448.8" y="244.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,61</text>
  <rect x="70" y="248" width="341.6" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="416.6" y="259.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,48</text>
  <text x="60.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="270" width="505.0" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="583.0" y="280.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2,19</text>
  <rect x="70" y="284" width="455.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="530.0" y="295.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,97</text>
  <rect x="70" y="10" width="14" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="92.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">як ёсць</text>
  <rect x="220" y="10" width="14" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="242.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">з папраўкай</text>
</svg>
<figcaption>Светлая паласа гэта прагноз як ёсць, шчыльная гэта ён жа мінус сярэдняя памылка за апошнія 30 дзён. Пункцір адзначае AIFS без папраўкі на 1-ы дзень.</figcaption>
</figure>

У мяне ўжо быў гатовы загаловак пра аднолькавыя 0,19 у абедзвюх. Пасля Дэлі я спачатку паглядзеў на аэрапорты. IFS папраўка дапамагае ў 15 з 16, толькі Мінску яна не дала нічога. А вось AIFS як ёсць выпраўленая IFS абыходзіць толькі ў 4. У Ёханэсбургу ў AIFS 2,3, у выпраўленай IFS 1,2, у Сіднеі 1,7 і 1,1. Толькі ў гэтых 2 месцах AIFS халаднейшая за тэрмометр больш чым на градус. Без іх AIFS як ёсць наперадзе на 0,12 (ад 0,09 да 0,15). На 5-ы дзень яна наперадзе і з імі, 1,61 супраць 1,69.

На практыцы адказ просты, рабіць і тое і другое. У выпраўленай AIFS на 1-ы дзень 1,03, на чвэрць менш, чым у IFS як ёсць. Выпраўленую IFS яна абыходзіць у 15 аэрапортах з 16.

## Што лічыць праўдай

У многіх параўнаннях за праўду бяруць ERA5, рэаналіз таго ж ECMWF. Паводле яго, да 27 ліпеня, на 1-ы дзень у AIFS 0,74, у IFS 1,12. Выйгрыш вырас з 0,22 да 0,37 і AIFS наперадзе ў 16 аэрапортах з 16. AIFS вучылася на ERA5 і на аналізах ECMWF, таму я і чакаю, што яна будзе на яго падобная. Сам ERA5 разыходзіцца з тэрмометрамі гэтых аэрапортаў на 1,04. Паводле аднаго ERA5 я напісаў бы, што выйгрыш у 1,7 раза большы.

## Сярэдзіна кроку

Паміж крокамі ў 6 гадзін API дабудоўвае AIFS інтэрпаляцыяй. У свае гадзіны ў AIFS 1,19, а за 3 гадзіны ад іх ужо 1,32. У IFS мяняецца толькі з 1,41 на 1,43. Па ўсіх 24 гадзінах выйгрыш AIFS 0,15. На дзённым максімуме ён 0,08 і AIFS наперадзе ў 9 аэрапортах. Абедзве мадэлі на піку занадта халодныя, AIFS на 0,69, IFS на 0,59.

Каб зразумець, колькі тут ад кроку, я пакінуў ад METAR толькі 00, 06, 12 і 18 гадзін, правёў праз іх кубічны сплайн і ўзяў максімум. Ён халаднейшы за сапраўдны на 0,55, хоць тэрмометр той самы. З крокам 3 гадзіны, а гэта крок IFS у адкрытых даных, на 0,19. Мой сплайн толькі замяняе тое, што робіць API. Калі ён блізкі, крок тлумачыць большую частку промаху AIFS і траціну промаху IFS.

## Чаго я не правяраў

Тут толькі тэмпература. З дажджом і ветрам парадак можа быць іншы. 5 месяцаў гэта вясна і лета на поўначы, без зімовых інверсій. У Найробі зводкі ёсць для 81% гадзін, METAR па-за ЗША звычайна акруглены да цэлага градуса. Я веру API, што "за 1 дзень" ва ўсіх 3 мадэляў значыць адно і тое ж, па сырых запусках я гэтага не звяраў. IFS тут адкрытая, з крокам 0,25 градуса, а не поўная. Акно ў 30 дзён я не падбіраў, пры 20 і 40 выходзяць тыя ж 1,21, пры 10 выходзіць 1,26.
