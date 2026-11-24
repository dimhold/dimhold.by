---
title: "Alaska спазняецца радзей за Hawaiian у 14 аэрапортах з 15, а ў суме часцей"
description: "У 2015 годзе Alaska спазнялася радзей за Hawaiian у 14 агульных аэрапортах з 15, а ў суме часцей. Я шукаў перавароты Сімпсана ў рэйсах, бейсболе і табліцы Берклі і лічыў, колькі іх дае выпадковасць."
date: 2016-04-03
lang: be
translationKey: simpson-real-data
tags: ["statistics", "open-data"]
---

`origin AS HA 0.1301 0.1159 raw 0.0142 mh -0.0595 14 / 15 9.0 -19.2`

Гэты радок надрукаваў мой скрыпт на Python. Ён параўноўвае Alaska (AS) і Hawaiian (HA) на ўнутраных рэйсах ЗША за 2015 год. У іх 15 агульных аэрапортаў вылету, дзе ў кожнай хаця б 100 рэйсаў. З рэйсаў Alaska адтуль на 15 хвілін і больш спазніліся 13,01%, з рэйсаў Hawaiian 11,59%. І пры гэтым у 14 аэрапортах з 15 доля спазненняў у Alaska меншая. Апошнія 2 лікі гэта сырая і папраўленая рознасць у стандартных памылках.

Пра парадокс Сімпсана я ведаў толькі з прыёму ў Берклі 1973 года. Пераказваў гэтую гісторыю з памяці, а самой табліцы ні разу не адкрываў. І ні разу не спытаў, ці часта такое бывае ў сапраўдных даных. Таму я запісаў свае чаканні, узяў 3 адкрытыя наборы і даручыў пошук скрыпту.

Прыклад з авіякампаніямі стары. Барнет апісаў яго ў 1994 годзе, там былі Alaska і America West, 5 аэрапортаў, чэрвень 1991 года.

## Табліца, якую я не адкрываў

У R гэтая табліца ўбудаваная: 6 найбольшых факультэтаў Берклі, 4526 абітурыентаў. Разабралі яе Бікел і сааўтары ў 1975 годзе. Прынялі 44,5% мужчын і 30,4% жанчын. У маім пераказе жанчыны былі наперадзе на кожным факультэце. У табліцы яны наперадзе на 4 з 6, а на C і E наперадзе мужчыны, на 2,9 і 3,8 пункта.

З папраўкай на факультэт жанчыны наперадзе на 1,84 пункта. Вагі я ўзяў паводле Мантэля і Хензеля: факультэт важыць больш, калі там шмат і мужчын і жанчын. Потым я пачаў прыбіраць факультэты па адным. Без факультэта A, куды прынялі 82,4% жанчын і 62,1% мужчын, наперадзе зноў мужчыны, на 0,55 пункта. Сырая розніца без A роўная 9,66. Так што яна растае ў абодвух выпадках, але змена знака трымаецца на адным факультэце, куды падалі дакументы 108 жанчын. Да таго ж стандартная памылка абодвух папраўленых лікаў каля 1,5 пункта. Я б ні за адзін з гэтых знакаў не паручыўся.

## 91 пара авіякампаній

Рэйсы ўзятыя з файлаў Бюро транспартнай статыстыкі ЗША пра пунктуальнасць, 12 месяцаў 2015 года, 5 819 079 радкоў. Без адмененых і тых, што пайшлі на запасны аэрадром, застаецца 5 714 008 рэйсаў 14 кампаній, гэта 91 пара. Для кожнай пары я пакідаў толькі тыя групы, дзе ў абедзвюх не менш за 100 рэйсаў. На іх жа і параўноўваў звычайную рознасць доляў з папраўленай. Калі знак мяняецца, я лічу гэта пераваротам. Пераварот поўны, калі супраць сумы ідуць усе групы да адной.

| разбіўка | пар | пераваротаў | поўных |
|---|---|---|---|
| аэрапорт вылету | 90 | 10 | 0 |
| аэрапорт і гадзіна | 89 | 6 | 0 |
| аэрапорт прылёту | 90 | 5 | 0 |
| група адлегласці | 87 | 4 | 0 |
| маршрут | 77 | 3 | 0 |
| маршрут і месяц | 52 | 1 | 0 |
| гадзіна вылету | 91 | 1 | 0 |
| месяц | 91 | 0 | 0 |
| дзень тыдня | 91 | 0 | 0 |

Я чакаў не больш за адзін поўны пераварот і прыкладна 10% звычайных па аэрапортах. І тое і другое спраўдзілася. У 6 з 10 пераваротаў па аэрапортах ёсць Hawaiian. У 4 з 10 адна з рознасцей, сырая ці папраўленая, меншая за 3 стандартныя памылкі, такія я б нікому не пераказваў.

А вось з устойлівасцю я не ўгадаў. Шукаў перавароты на цотных днях года, правяраў на няцотных і думаў, што паўторацца амаль усе. Паўтарыліся 9 з 13. З тых 4, што не паўтарыліся, у 3 сырая рознасць была меншая за 0,4 пункта, а ў апошняй пары ўсяго 2 агульныя аэрапорты. Парог таксама важны: пры 30 рэйсах на аэрапорт пераваротаў 12, пры 1000 толькі 4.

<figure class="fig">
<svg viewBox="0 0 700 435" role="img" aria-label="Доля рэйсаў 2015 года, якія прыляцелі са спазненнем ад 15 хвілін, у Alaska і Hawaiian у 15 агульных аэрапортах вылету. HNL: 11,5, 9,2; OGG: 8,4, 12,7; KOA: 9,5, 9,5; LIH: 9,5, 9,7; LAX: 11,4, 18,8; LAS: 11,3, 25,4; OAK: 10,7, 19,8; SEA: 14,5, 22,4; SFO: 18,7, 29,9; SJC: 10,7, 23,0; PDX: 10,9, 23,6; SMF: 11,3, 31,0; SAN: 10,8, 36,2; PHX: 10,7, 31,3; JFK: 16,0, 30,0. У Alaska доля меншая ўсюды, акрамя Ганалулу, але ў суме ў яе 13,01% супраць 11,59%.">
  <line x1="70.0" y1="32" x2="70.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="70.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="222.5" y1="32" x2="222.5" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="222.5" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="375.0" y1="32" x2="375.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="375.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="527.5" y1="32" x2="527.5" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="527.5" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="680.0" y1="32" x2="680.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="680.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="58.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">HNL</text>
  <line x1="245.4" y1="44" x2="210.1" y2="44" class="f-line" style="stroke-width:1"/>
  <circle cx="210.1" cy="44" r="7.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="245.4" cy="44" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="71.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">OGG</text>
  <line x1="198.3" y1="67" x2="264.1" y2="67" class="f-line" style="stroke-width:1"/>
  <circle cx="264.1" cy="67" r="5.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="198.3" cy="67" r="2.3" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">KOA</text>
  <line x1="214.6" y1="90" x2="215.5" y2="90" class="f-line" style="stroke-width:1"/>
  <circle cx="215.5" cy="90" r="3.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="214.6" cy="90" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="117.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LIH</text>
  <line x1="214.9" y1="113" x2="217.9" y2="113" class="f-line" style="stroke-width:1"/>
  <circle cx="217.9" cy="113" r="3.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="214.9" cy="113" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="140.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LAX</text>
  <line x1="244.2" y1="136" x2="356.9" y2="136" class="f-line" style="stroke-width:1"/>
  <circle cx="356.9" cy="136" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="244.2" cy="136" r="4.1" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LAS</text>
  <line x1="242.8" y1="159" x2="456.9" y2="159" class="f-line" style="stroke-width:1"/>
  <circle cx="456.9" cy="159" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="242.8" cy="159" r="2.8" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="186.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">OAK</text>
  <line x1="233.6" y1="182" x2="372.4" y2="182" class="f-line" style="stroke-width:1"/>
  <circle cx="372.4" cy="182" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.6" cy="182" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="209.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SEA</text>
  <line x1="291.7" y1="205" x2="411.0" y2="205" class="f-line" style="stroke-width:1"/>
  <circle cx="411.0" cy="205" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="291.7" cy="205" r="10.0" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="232.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SFO</text>
  <line x1="354.6" y1="228" x2="526.4" y2="228" class="f-line" style="stroke-width:1"/>
  <circle cx="526.4" cy="228" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="354.6" cy="228" r="3.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="255.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SJC</text>
  <line x1="233.6" y1="251" x2="420.6" y2="251" class="f-line" style="stroke-width:1"/>
  <circle cx="420.6" cy="251" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.6" cy="251" r="2.9" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="278.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">PDX</text>
  <line x1="236.7" y1="274" x2="429.3" y2="274" class="f-line" style="stroke-width:1"/>
  <circle cx="429.3" cy="274" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="236.7" cy="274" r="5.1" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="301.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SMF</text>
  <line x1="242.8" y1="297" x2="542.1" y2="297" class="f-line" style="stroke-width:1"/>
  <circle cx="542.1" cy="297" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="242.8" cy="297" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="324.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SAN</text>
  <line x1="234.1" y1="320" x2="621.4" y2="320" class="f-line" style="stroke-width:1"/>
  <circle cx="621.4" cy="320" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="234.1" cy="320" r="3.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="347.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">PHX</text>
  <line x1="233.0" y1="343" x2="547.6" y2="343" class="f-line" style="stroke-width:1"/>
  <circle cx="547.6" cy="343" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.0" cy="343" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="370.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">JFK</text>
  <line x1="314.6" y1="366" x2="527.5" y2="366" class="f-line" style="stroke-width:1"/>
  <circle cx="527.5" cy="366" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="314.6" cy="366" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <line x1="10" y1="378" x2="680" y2="378" class="f-plain"/>
  <text x="58.0" y="399.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">усяго</text>
  <path d="M239.7,395 L246.7,388 L253.7,395 L246.7,402 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M261.4,395 L268.4,388 L275.4,395 L268.4,402 Z" style="fill:var(--accent);stroke:none"/>
  <text x="234.7" y="399.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">11,59</text>
  <text x="280.4" y="399.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13,01</text>
  <circle cx="76" cy="14" r="6" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="88.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Alaska</text>
  <circle cx="166" cy="14" r="6" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="178.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Hawaiian</text>
  <text x="680.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">рэйсы са спазненнем, %</text>
</svg>
<figcaption>Рэйсы са спазненнем па аэрапорце вылету. Плошча кропкі расце з колькасцю рэйсаў. Вялікія кропкі ў Alaska стаяць у Сіэтле, у Hawaiian на астравах, таму сумы мяняюцца месцамі.</figcaption>
</figure>

Прычыну відаць па кропках. З 76 041 рэйса Hawaiian 61 148 гэта пералёты паміж астравамі, спазнілася 9,07% такіх рэйсаў. З рэйсаў, што прыляталі на астравы аднекуль яшчэ, спазнілася 24,49%. У агульных аэрапортах 89,5% рэйсаў Hawaiian вылятаюць з 4 астраўных, у Alaska такіх 7,3%. Амаль палова рэйсаў Alaska прыпадае на Сіэтл, дзе спазнілася 14,54%. З 14 перамог Alaska 2 амаль нічыйныя, у Коне і Ліхуэ, на 0,06 і 0,2 пункта.

## Адказ залежыць ад слупка

<figure class="fig">
<svg viewBox="0 0 700 212" role="img" aria-label="Рознасць доляў рэйсаў са спазненнем, першая кампанія мінус другая, у пунктах, пры 8 спосабах параўнання. Alaska, Hawaiian: усе +1,7, вылет -6,0, прылёт -0,5, маршрут -8,5, месяц +1,7, гадзіна +1,8, адлегл. -0,1, выл+гадз -5,9; Delta, Hawaiian: усе +2,2, вылет -5,1, прылёт +2,6, маршрут +0,5, месяц +2,3, гадзіна +2,1, адлегл. +3,8, выл+гадз -3,4; SkyWest, United: усе -1,9, вылет +1,2, прылёт 0,0, маршрут +3,6, месяц -2,0, гадзіна -2,2, адлегл. -1,7, выл+гадз +0,2; JetBlue, Envoy: усе +0,9, вылет -3,1, прылёт -1,1, маршрут -3,5, месяц +1,4, гадзіна +0,5, адлегл. -2,1, выл+гадз -0,3; ExpressJet, SkyWest: усе +1,0, вылет -2,2, прылёт -2,4, маршрут -4,0, месяц +0,9, гадзіна +0,9, адлегл. +1,2, выл+гадз -2,5.">
  <text x="193.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">усе</text>
  <text x="259.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">вылет</text>
  <text x="325.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">прылёт</text>
  <text x="391.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">маршрут</text>
  <text x="457.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">месяц</text>
  <text x="523.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">гадзіна</text>
  <text x="589.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">адлегл.</text>
  <text x="655.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">выл+гадз</text>
  <text x="152.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Alaska, Hawaiian</text>
  <rect x="162" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,7</text>
  <rect x="228" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-6,0</text>
  <rect x="294" y="36" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0,5</text>
  <rect x="360" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-8,5</text>
  <rect x="426" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,7</text>
  <rect x="492" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,8</text>
  <rect x="558" y="36" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0,1</text>
  <rect x="624" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-5,9</text>
  <text x="152.0" y="87.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Delta, Hawaiian</text>
  <rect x="162" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2,2</text>
  <rect x="228" y="70" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-5,1</text>
  <rect x="294" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2,6</text>
  <rect x="360" y="70" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,5</text>
  <rect x="426" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2,3</text>
  <rect x="492" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2,1</text>
  <rect x="558" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+3,8</text>
  <rect x="624" y="70" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3,4</text>
  <text x="152.0" y="121.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">SkyWest, United</text>
  <rect x="162" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1,9</text>
  <rect x="228" y="104" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,2</text>
  <rect x="294" y="104" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0,0</text>
  <rect x="360" y="104" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+3,6</text>
  <rect x="426" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,0</text>
  <rect x="492" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,2</text>
  <rect x="558" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1,7</text>
  <rect x="624" y="104" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,2</text>
  <text x="152.0" y="155.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">JetBlue, Envoy</text>
  <rect x="162" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,9</text>
  <rect x="228" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3,1</text>
  <rect x="294" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1,1</text>
  <rect x="360" y="138" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3,5</text>
  <rect x="426" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,4</text>
  <rect x="492" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,5</text>
  <rect x="558" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,1</text>
  <rect x="624" y="138" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0,3</text>
  <text x="152.0" y="189.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">ExpressJet, SkyWest</text>
  <rect x="162" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,0</text>
  <rect x="228" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,2</text>
  <rect x="294" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,4</text>
  <rect x="360" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-4,0</text>
  <rect x="426" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,9</text>
  <rect x="492" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0,9</text>
  <rect x="558" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1,2</text>
  <rect x="624" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2,5</text>
</svg>
<figcaption>Першая кампанія мінус другая, працэнтныя пункты спазненняў. У першым слупку простая рознасць за ўвесь год, у астатніх з папраўкай на зменную слупка. Каляровыя клеткі: першая спазняецца часцей. Шэрыя: першая спазняецца радзей. Без заліўкі: менш за 3 стандартныя памылкі.</figcaption>
</figure>

З папраўкай на месяц, дзень тыдня ці гадзіну Hawaiian наперадзе на 1,7 або 1,8 пункта. Па аэрапорце вылету наперадзе Alaska, на 5,95. Па аэрапорце прылёту таксама яна, але на 0,47 і гэта ў межах шуму. Калі параўноўваць па маршрутах, яна наперадзе на 8,52.

Чаму тады гэтай пары няма сярод пераваротаў па маршруце? Дайшло да мяне не адразу. Паміж астравамі Alaska не лятае, таму на 16 агульных маршрутах застаецца толькі 5806 рэйсаў Hawaiian. На іх ужо звычайная сума дае 13,05 супраць 21,10. Пераварочваць няма чаго: кароткія пералёты выпалі з сумы раней, чым я пачаў параўноўваць.

У 24 парах з 91 пры адной разбіўцы на пункт і больш наперадзе адна кампанія, а пры нейкай іншай на пункт і больш другая. Я лічыў толькі рознасці, большыя за 3 стандартныя памылкі, у якіх знак аднолькавы і на цотных і на няцотных днях. У 9 з гэтых пар ёсць Hawaiian, у 15 няма. У кожнай разбіўкі свой набор агульных рэйсаў, так што частка з 24 можа трымацца толькі на гэтым. SkyWest апярэджвае United у суме на 1,9 пункта і на 2,2 з папраўкай на гадзіну. З папраўкай на аэрапорт адстае на 1,2, па маршрутах на 3,6. Частку сваіх рэйсаў SkyWest выконвае пад маркай United, так што пасажыр можа і не ведаць, якая з дзвюх кампаній яго вязе.

Арыфметыка ў кожным слупку правільная. Пасажыру з Сіэтла ў Ганалулу патрэбны маршрут. Таму, хто пытаецца, якая доля рэйсаў Hawaiian спазнілася, патрэбна сума. Гадзіну вылету кампанія выбірае сама, таму папраўка на гадзіну даруе ёй познія вячэрнія рэйсы. Пёрл пісаў у 2014 годзе, што табліца за вас не выбера, бо выбар залежыць ад таго, што чаму прычына. Я з ім згодны, але раней я б узяў самую дробную разбіўку і палічыў яе праўдай.

## Колькі дае выпадковасць

Паўлідыс і Перлман паказалі ў 2009 годзе, што выпадковая табліца 2x2x2 пераварочваецца з імавернасцю 1/60. На 4 мільёнах выпадковых табліц у мяне выйшла 66 274 перавароты, 1,657%. З 6 групамі, як у Берклі, гэта 0,018%. З рэйсамі я зрабіў так: у кожнай кампаніі пакінуў колькасць рэйсаў і долю спазненняў, а самі рэйсы раскідаў па аэрапортах выпадкова, прапарцыйна іх сапраўдным памерам. У 1820 параўнаннях выйшла 0 пераваротаў. Значыць, аднаго шуму на такіх колькасцях для перавароту не хапае.

У бейсболе ўсё наадварот. Рос праславіў адну пару: Дэвід Джасціс адбіваў лепш за Дэрэка Джытэра і ў 1995 і ў 1996 годзе, а за 2 гады разам горш. Я шукаў такія пары ў базе Ламана па абедзвюх галоўных лігах, з 1901 па 2015 год. У абодвух гульцоў мусіла быць хаця б 40 выхадаў на біту ў кожным з 2 сезонаў запар. Чакаў дзясяткі. Адны і тыя ж 2 гульцы могуць трапіць у падлік і ў іншых сезонах. Знайшлося 20 392 з 5 750 272 пар, толькі на 1995 і 1996 гады прыпадае 275. У 82 пар разрыў не меншы, чым у Джытэра і Джасціса. Другая па разрыве пара зноў з Джытэрам: Піт Козма абышоў яго ў 2012 годзе (0,333 супраць 0,316) і ў 2013 годзе (0,217 супраць 0,190). За 2 гады разам у Козмы 0,234, у Джытэра 0,306.

<figure class="fig">
<svg viewBox="0 0 700 286" role="img" aria-label="Перавароты на 10 000 пар гульцоў у залежнасці ад мінімуму выхадаў на біту за сезон. 40: як было 35,5, узровень сталы 29,6, усе роўныя 55,0; 100: як было 23,6, узровень сталы 19,5, усе роўныя 34,9; 200: як было 11,4, узровень сталы 9,1, усе роўныя 18,2; 300: як было 5,5, узровень сталы 4,1, усе роўныя 9,1; 400: як было 2,5, узровень сталы 1,7, усе роўныя 3,9.">
  <line x1="50" y1="240.0" x2="690" y2="240.0" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="45" y1="179.3" x2="50" y2="179.3" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="183.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="45" y1="118.7" x2="50" y2="118.7" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="122.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="45" y1="58.0" x2="50" y2="58.0" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="62.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="59.0" y="132.4" width="34" height="107.6" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="76.0" y="127.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">35,5</text>
  <rect x="97.0" y="150.1" width="34" height="89.9" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="114.0" y="145.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">29,6</text>
  <rect x="135.0" y="73.0" width="34" height="167.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="152.0" y="68.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">55,0</text>
  <text x="114.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="187.0" y="168.5" width="34" height="71.5" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="204.0" y="163.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">23,6</text>
  <rect x="225.0" y="180.9" width="34" height="59.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="242.0" y="175.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">19,5</text>
  <rect x="263.0" y="134.1" width="34" height="105.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="280.0" y="129.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">34,9</text>
  <text x="242.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="315.0" y="205.4" width="34" height="34.6" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="332.0" y="200.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">11,4</text>
  <rect x="353.0" y="212.4" width="34" height="27.6" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="370.0" y="207.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9,1</text>
  <rect x="391.0" y="184.7" width="34" height="55.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="408.0" y="179.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">18,2</text>
  <text x="370.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <rect x="443.0" y="223.3" width="34" height="16.7" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="460.0" y="218.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5,5</text>
  <rect x="481.0" y="227.5" width="34" height="12.5" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="498.0" y="222.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4,1</text>
  <rect x="519.0" y="212.4" width="34" height="27.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="536.0" y="207.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9,1</text>
  <text x="498.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <rect x="571.0" y="232.5" width="34" height="7.5" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="588.0" y="227.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2,5</text>
  <rect x="609.0" y="234.9" width="34" height="5.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="626.0" y="229.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1,7</text>
  <rect x="647.0" y="228.3" width="34" height="11.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="664.0" y="223.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">3,9</text>
  <text x="626.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <rect x="50" y="28" width="12" height="12" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="68.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">як было</text>
  <rect x="144.2" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="162.2" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">узровень сталы</text>
  <rect x="284.59999999999997" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="302.6" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">усе роўныя</text>
  <text x="50.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">пераваротаў на 10 000 пар</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">мінімум выхадаў на біту ў кожным сезоне</text>
</svg>
<figcaption>Перавароты на 10 000 пар: сапраўдныя сезоны і хіты, разыграныя выпадкова пры тых жа выхадах на біту. На слупок адзін прагон сімуляцыі.</figcaption>
</figure>

Потым я пакінуў выхады на біту як ёсць, а хіты разыграў нанова. Калі ў кожнага гульца ў абодвух сезонах той самы ўзровень, пераваротаў 17 048. Калі ўсе гуляюць як сярэдні гулец лігі, 31 650. Сапраўдная колькасць паміж імі, бліжэй да першай. Пры 400 выхадах застаецца 108 пар з 437 316 і самы вялікі разрыў 0,0048.

## Чаго я не правяраў

Адзін кепскі дзень затрымлівае адразу шмат рэйсаў, таму яны не незалежныя і мае стандартныя памылкі заніжаныя. Ад гэтага бароняць толькі цотныя і няцотныя дні. 105 071 рэйс адмянілі ці адвялі на запасны аэрадром, яны выпалі і, магчыма, у розных кампаній нераўнамерна. US Airways ёсць у файлах толькі па чэрвень, далей яе рэйсы запісаныя на American, так што ў парах з любой з іх змяшаныя розныя месяцы. Вагі Мантэля і Хензеля толькі адзін са спосабаў, з наборам аэрапортаў адной з кампаній лікі былі б іншыя. І глядзеў я толькі 2015 год, ці кожны год у Hawaiian так, не ведаю.
