---
title: "Alaska опаздывает реже Hawaiian в 14 аэропортах из 15, а в сумме чаще"
description: "В 2015 году Alaska опаздывала реже Hawaiian в 14 общих аэропортах из 15, а в сумме чаще. Я искал перевороты Симпсона в рейсах, бейсболе и таблице Беркли и считал, сколько их даёт случай."
date: 2016-04-03
lang: ru
translationKey: simpson-real-data
tags: ["statistics", "open-data"]
---

`origin AS HA 0.1301 0.1159 raw 0.0142 mh -0.0595 14 / 15 9.0 -19.2`

Эту строку напечатал мой скрипт на Python. Он сравнивает Alaska (AS) и Hawaiian (HA) на внутренних рейсах США за 2015 год. У них 15 общих аэропортов вылета, где у каждой хотя бы 100 рейсов. Из рейсов Alaska оттуда с опозданием от 15 минут прилетели 13,01%, из рейсов Hawaiian 11,59%. При этом в 14 аэропортах из 15 доля опозданий у Alaska ниже. Последние 2 числа это сырая и поправленная разность в стандартных ошибках.

Про парадокс Симпсона я знал только по приёму в Беркли 1973 года. Пересказывал эту историю по памяти, а саму таблицу ни разу не открывал. И ни разу не спросил, часто ли такое бывает в настоящих данных. Поэтому я записал свои ожидания, взял 3 открытых набора и поручил поиск скрипту.

Пример с авиакомпаниями старый. Барнетт описал его в 1994 году, там были Alaska и America West, 5 аэропортов, июнь 1991 года.

## Таблица, которую я не открывал

В R эта таблица встроена: 6 самых больших факультетов Беркли, 4526 поступавших. Разобрали её Бикел и соавторы в 1975 году. Приняли 44,5% мужчин и 30,4% женщин. В моём пересказе женщины были впереди на каждом факультете. В таблице они впереди на 4 из 6, а на C и E впереди мужчины, на 2,9 и 3,8 пункта.

С поправкой на факультет женщины впереди на 1,84 пункта. Веса я взял по Мантелю и Хензелю: факультет значит больше, если там много и мужчин и женщин. Потом я стал убирать факультеты по одному. Без факультета A, куда приняли 82,4% женщин и 62,1% мужчин, впереди снова мужчины, на 0,55 пункта. Сырой разрыв без A равен 9,66. Так что он тает в обоих случаях, но смена знака держится на одном факультете, куда подавали документы 108 женщин. К тому же стандартная ошибка обоих поправленных чисел около 1,5 пункта. Я бы ни за один из этих знаков не поручился.

## 91 пара авиакомпаний

Рейсы взяты из файлов Бюро транспортной статистики США о пунктуальности, 12 месяцев 2015 года, 5 819 079 строк. Без отменённых и ушедших на запасной аэродром остаётся 5 714 008 рейсов 14 компаний, это 91 пара. Для каждой пары я оставлял только те группы, где у обеих не меньше 100 рейсов. На них же и сравнивал обычную разность долей с поправленной. Если знак меняется, я считаю это переворотом. Переворот полный, если против суммы идут все группы до одной.

| разбивка | пар | переворотов | полных |
|---|---|---|---|
| аэропорт вылета | 90 | 10 | 0 |
| аэропорт и час | 89 | 6 | 0 |
| аэропорт прилёта | 90 | 5 | 0 |
| группа дальности | 87 | 4 | 0 |
| маршрут | 77 | 3 | 0 |
| маршрут и месяц | 52 | 1 | 0 |
| час вылета | 91 | 1 | 0 |
| месяц | 91 | 0 | 0 |
| день недели | 91 | 0 | 0 |

Я ждал самое большее один полный переворот и примерно 10% обычных по аэропортам. То и другое сошлось. В 6 из 10 переворотов по аэропортам участвует Hawaiian. В 4 из 10 одна из разностей, сырая или поправленная, меньше 3 стандартных ошибок, такие я бы никому не пересказывал.

А вот с устойчивостью я не угадал. Искал перевороты на чётных днях года, проверял на нечётных и думал, что повторятся почти все. Повторились 9 из 13. Из 4 пропавших у 3 сырая разность была меньше 0,4 пункта, у последней пары всего 2 общих аэропорта. Порог тоже важен: при 30 рейсах на аэропорт переворотов 12, при 1000 только 4.

<figure class="fig">
<svg viewBox="0 0 700 435" role="img" aria-label="Доля рейсов 2015 года, прилетевших с опозданием от 15 минут, у Alaska и Hawaiian в 15 общих аэропортах вылета. HNL: 11,5, 9,2; OGG: 8,4, 12,7; KOA: 9,5, 9,5; LIH: 9,5, 9,7; LAX: 11,4, 18,8; LAS: 11,3, 25,4; OAK: 10,7, 19,8; SEA: 14,5, 22,4; SFO: 18,7, 29,9; SJC: 10,7, 23,0; PDX: 10,9, 23,6; SMF: 11,3, 31,0; SAN: 10,8, 36,2; PHX: 10,7, 31,3; JFK: 16,0, 30,0. У Alaska доля ниже везде, кроме Гонолулу, но в сумме у неё 13,01% против 11,59%.">
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
  <text x="58.0" y="399.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">всего</text>
  <path d="M239.7,395 L246.7,388 L253.7,395 L246.7,402 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M261.4,395 L268.4,388 L275.4,395 L268.4,402 Z" style="fill:var(--accent);stroke:none"/>
  <text x="234.7" y="399.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">11,59</text>
  <text x="280.4" y="399.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13,01</text>
  <circle cx="76" cy="14" r="6" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="88.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Alaska</text>
  <circle cx="166" cy="14" r="6" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="178.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Hawaiian</text>
  <text x="680.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">опоздавшие рейсы, %</text>
</svg>
<figcaption>Опоздавшие рейсы по аэропорту вылета. Площадь точки растёт с числом рейсов. Крупные точки у Alaska стоят в Сиэтле, у Hawaiian на островах, поэтому суммы меняются местами.</figcaption>
</figure>

Причину видно по точкам. Из 76 041 рейса Hawaiian 61 148 это перелёты между островами, опоздало 9,07% таких рейсов. Из рейсов, которые прилетали на острова откуда-то ещё, опоздало 24,49%. В общих аэропортах 89,5% рейсов Hawaiian вылетают из 4 островных, у Alaska таких 7,3%. Почти половина рейсов Alaska приходится на Сиэтл, где опоздало 14,54%. Из 14 побед Alaska 2 почти ничейные, в Коне и Лихуэ, на 0,06 и 0,2 пункта.

## Ответ зависит от столбца

<figure class="fig">
<svg viewBox="0 0 700 212" role="img" aria-label="Разность долей опоздавших рейсов, первая компания минус вторая, в пунктах, при 8 способах сравнения. Alaska, Hawaiian: все +1,7, вылет -6,0, прилёт -0,5, маршрут -8,5, месяц +1,7, час +1,8, дальность -0,1, выл.+час -5,9; Delta, Hawaiian: все +2,2, вылет -5,1, прилёт +2,6, маршрут +0,5, месяц +2,3, час +2,1, дальность +3,8, выл.+час -3,4; SkyWest, United: все -1,9, вылет +1,2, прилёт 0,0, маршрут +3,6, месяц -2,0, час -2,2, дальность -1,7, выл.+час +0,2; JetBlue, Envoy: все +0,9, вылет -3,1, прилёт -1,1, маршрут -3,5, месяц +1,4, час +0,5, дальность -2,1, выл.+час -0,3; ExpressJet, SkyWest: все +1,0, вылет -2,2, прилёт -2,4, маршрут -4,0, месяц +0,9, час +0,9, дальность +1,2, выл.+час -2,5.">
  <text x="193.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">все</text>
  <text x="259.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">вылет</text>
  <text x="325.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">прилёт</text>
  <text x="391.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">маршрут</text>
  <text x="457.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">месяц</text>
  <text x="523.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">час</text>
  <text x="589.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">дальность</text>
  <text x="655.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">выл.+час</text>
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
<figcaption>Первая компания минус вторая, процентные пункты опозданий. В первом столбце простая разность за весь год, в остальных с поправкой на переменную столбца. Цветные клетки: первая опаздывает чаще. Серые: первая опаздывает реже. Без заливки: меньше 3 стандартных ошибок.</figcaption>
</figure>

С поправкой на месяц, день недели или час Hawaiian впереди на 1,7 или 1,8 пункта. По аэропорту вылета впереди Alaska, на 5,95. По аэропорту прилёта тоже она, но на 0,47 и это в пределах шума. Если сравнивать по маршрутам, она впереди на 8,52.

Почему тогда этой пары нет среди переворотов по маршруту? До меня дошло не сразу. Между островами Alaska не летает, поэтому на 16 общих маршрутах остаётся только 5806 рейсов Hawaiian. На них уже обычная сумма даёт 13,05 против 21,10. Переворачивать нечего: короткие перелёты выпали из суммы раньше, чем я начал сравнивать.

В 24 парах из 91 при одной разбивке на пункт и больше впереди одна компания, а при какой-то другой на пункт и больше вторая. Я считал только разности больше 3 стандартных ошибок, у которых знак одинаковый и на чётных и на нечётных днях. В 9 из этих пар есть Hawaiian, в 15 нет. У каждой разбивки свой набор общих рейсов, так что часть из 24 может держаться только на этом. SkyWest обходит United в сумме на 1,9 пункта и на 2,2 с поправкой на час. С поправкой на аэропорт отстаёт на 1,2, по маршрутам на 3,6. Часть своих рейсов SkyWest выполняет под маркой United, так что пассажир может и не знать, какая из двух компаний его везёт.

Арифметика в каждом столбце верная. Пассажиру из Сиэтла в Гонолулу нужен маршрут. Тому, кто спрашивает, какая доля рейсов Hawaiian опоздала, нужна сумма. Час вылета компания выбирает сама, поэтому поправка на час прощает ей поздние вечерние рейсы. Пёрл писал в 2014 году, что таблица за вас не выберет, потому что выбор зависит от того, что чему причина. Я с ним согласен, но раньше я бы взял самую мелкую разбивку и счёл её правдой.

## Сколько даёт случай

Павлидис и Перлман показали в 2009 году, что случайная таблица 2x2x2 переворачивается с вероятностью 1/60. На 4 миллионах случайных таблиц у меня вышло 66 274 переворота, 1,657%. С 6 группами, как в Беркли, это 0,018%. С рейсами я сделал так: у каждой компании оставил число рейсов и долю опозданий, а сами рейсы раскидал по аэропортам случайно, пропорционально их настоящим размерам. В 1820 сравнениях получилось 0 переворотов. Значит, одного шума на таких числах для переворота не хватает.

В бейсболе всё наоборот. Росс прославил одну пару: Дэвид Джастис отбивал лучше Дерека Джитера и в 1995 и в 1996 году, а за 2 года вместе хуже. Я искал такие пары в базе Ламана по обеим главным лигам, с 1901 по 2015 год. У обоих игроков должно быть хотя бы 40 выходов на биту в каждом из 2 сезонов подряд. Ждал десятки. Одни и те же 2 игрока могут попасть в счёт и в других сезонах. Нашлось 20 392 из 5 750 272 пар, только на 1995 и 1996 годы приходится 275. У 82 пар разрыв не меньше, чем у Джитера и Джастиса. Вторая по разрыву пара опять с Джитером: Пит Козма обошёл его в 2012 году (0,333 против 0,316) и в 2013 году (0,217 против 0,190). За 2 года вместе у Козмы 0,234, у Джитера 0,306.

<figure class="fig">
<svg viewBox="0 0 700 286" role="img" aria-label="Перевороты на 10 000 пар игроков в зависимости от минимума выходов на биту за сезон. 40: как было 35,5, уровень постоянный 29,6, все равны 55,0; 100: как было 23,6, уровень постоянный 19,5, все равны 34,9; 200: как было 11,4, уровень постоянный 9,1, все равны 18,2; 300: как было 5,5, уровень постоянный 4,1, все равны 9,1; 400: как было 2,5, уровень постоянный 1,7, все равны 3,9.">
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
  <text x="68.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">как было</text>
  <rect x="150.8" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="168.8" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">уровень постоянный</text>
  <rect x="317.6" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="335.6" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">все равны</text>
  <text x="50.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">переворотов на 10 000 пар</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">минимум выходов на биту в каждом сезоне</text>
</svg>
<figcaption>Перевороты на 10 000 пар: настоящие сезоны и хиты, разыгранные случайно при тех же выходах на биту. На столбик один прогон симуляции.</figcaption>
</figure>

Потом я оставил выходы на биту как есть, а хиты разыграл заново. Если у каждого игрока в обоих сезонах один и тот же уровень, переворотов 17 048. Если все играют как средний игрок лиги, 31 650. Настоящее число между ними, ближе к первому. При 400 выходах остаётся 108 пар из 437 316 и самый большой разрыв 0,0048.

## Чего я не проверял

Один плохой день задерживает сразу много рейсов, поэтому они не независимы и мои стандартные ошибки занижены. От этого защищают только чётные и нечётные дни. 105 071 рейс отменили или увели на запасной аэродром, они выпали и, возможно, у разных компаний неравномерно. US Airways есть в файлах только по июнь, дальше её рейсы записаны на American, так что в парах с любой из них смешаны разные месяцы. Веса Мантеля и Хензеля лишь один из способов, с набором аэропортов одной из компаний числа были бы другие. И смотрел я только 2015 год, каждый ли год у Hawaiian так, не знаю.
