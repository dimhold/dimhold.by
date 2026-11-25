---
title: "В Gaia DR1 соседка звезды со случайным индексом i стоит под номером 2i или 2i + 1"
description: "В первом каталоге Gaia 1 142 679 769 строк и столбец random_index для выборок. У звезды i соседка на небе в 89,3% случаев стоит под номером 2i или 2i + 1, а в первых 50 000 строк близких пар вдвое больше, чем в двух других окнах того же размера. Из 100 ближайших звёзд Hipparcos параллакс в релизе есть у 32."
date: 2016-10-02
lang: ru
translationKey: gaia-dr1-first-look
tags: ["open-data", "algorithms", "statistics"]
---

Я попросил у архива Gaia 60 звёзд с `random_index` меньше 60 и распечатал их галактические координаты. У строки 2 долгота 344,75 и широта 17,90. Рядом оказались строки 5 (344,72 и 18,39), 11 (344,92 и 17,92) и 23 (344,43 и 18,56). Все 4 звезды помещаются в пятно размером меньше 1 градуса. Строки 0, 1, 3, 7 и 15 собрались в другом таком пятне.

В таблице 1 142 679 769 строк, держать её мне негде, поэтому начал я со случайной выборки. Если в таблице есть для этого столбец, я просто беру его и не проверяю. Документация к этому и приглашает: в столбце "случайная перестановка чисел от 0 до N-1", по нему удобно брать подмножества, которые "остаются репрезентативными". Я собирался смотреть на звёзды, а смотрел в основном на столбец.

## Что вообще открыли

Первый каталог Gaia ESA открыла 14 сентября. Запросы я отправлял в архив через TAP. В главной таблице `gaia_source` 57 столбцов, но почти у всех строк есть только положение и блеск в одной полосе G, остальное занимают ошибки и служебные поля. Цветов нет. Параллакс, из которого получается расстояние, есть у 2 057 050 строк, то есть у 0,18%. Это звёзды TGAS, для них Gaia объединили со старыми каталогами Hipparcos и Tycho-2.

Из этих параллаксов 30 840 (1,5%) отрицательные, а 1 019 970 (49,6%) меньше 5 собственных ошибок. Так что для половины звёзд делить единицу на параллакс не стоит. Астраатмаджа и Байлер-Джонс уже выложили статью (arXiv 1609.07369), где расстояния до всех 2 миллионов посчитаны как следует.

Потом я взял 100 ближайших звёзд из Hipparcos (новая редукция, ошибка меньше 10 миллисекунд дуги) и поискал их в TGAS по номеру HIP. Параллакс в TGAS нашёлся у 32. У 8 самых близких его нет. Если взять Hipparcos целиком, в TGAS есть 79,4% звёзд, 93 635 из 117 955.

<figure class="fig">
<svg viewBox="0 0 680 192" role="img" aria-label="100 квадратов для 100 ближайших звёзд Hipparcos, от ближайшей к сотой. У 32 есть параллакс в TGAS, ещё у 25 есть строка в gaia_source без параллакса, у 43 строки нет. У первых 8 параллакса TGAS нет.">
  <rect x="60" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="29.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="84" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="108" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="132" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="156" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="204" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="228" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="252" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="276" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="372" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="396" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="420" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="444" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="468" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="492" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="516" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="540" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="564" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="588" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="60" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="53.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">26</text>
  <rect x="84" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="108" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="132" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="156" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="180" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="204" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="252" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="276" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="324" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="372" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="420" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="444" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="468" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="492" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="516" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="540" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="564" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="588" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="636" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="77.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">51</text>
  <rect x="84" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="108" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="132" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="156" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="204" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="228" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="252" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="276" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="348" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="372" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="396" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="420" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="444" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="468" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="492" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="516" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="540" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="588" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="612" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="636" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="60" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="48.0" y="101.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">76</text>
  <rect x="84" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="108" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="132" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="156" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="180" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="204" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="252" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="276" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="300" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="372" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="396" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="444" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="468" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="492" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="516" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="540" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="564" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="588" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="612" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60" y="124" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="80.0" y="134.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">параллакс в TGAS: 32</text>
  <rect x="60" y="144" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.0" y="154.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">строка без параллакса: 25</text>
  <rect x="60" y="164" width="12" height="12" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="80.0" y="174.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">нет строки в пределах 2 угловых секунд: 43</text>
</svg>
<figcaption>100 ближайших звёзд каталога Hipparcos, слева направо и сверху вниз начиная с ближайшей.</figcaption>
</figure>

Остальные 68 я искал в `gaia_source` по положению. Координаты в Hipparcos относятся к 1991 году, а звёзды эти быстрые, поэтому сначала каждое положение надо перенести на 2015 год. В радиусе 5 угловых секунд от старых координат что-то нашлось для 7 звёзд, от перенесённых для 27. Среди этих 27 попалась звезда 18-й величины в 3,7 секунды от места Проксимы. Это, конечно, не она. При радиусе 2 секунды осталось 25, блеск у всех похож на правду, от величины из Hipparcos он отличается не больше чем на 1,8. Обзорная статья релиза (Браун с соавторами) предупреждает, что многих звёзд ярче 7-й величины в каталоге нет, как нет и тех, что движутся быстрее 3,5 угловой секунды в год. В моём списке таких быстрых 14, параллакса нет ни у одной, но для звезды Каптейна строка всё-таки есть.

## 2i или 2i + 1

Вернёмся к столбцу. Первые 100 строк по `random_index` лежат в 55 разных ячейках HEALPix размером около 0,9 градуса. Если взять 100 строк начиная с миллионной, ячеек 99. Где искать, подсказали числа из начала: 2, 5, 11, 23 это удвоение с прибавленной единицей.

Для каждого i от 1 до 24 999 я измерил расстояние до звёзд 2i и 2i + 1 и взял ту, что ближе. Медиана вышла 19,4 угловой минуты, 89,3% пар ближе 1 градуса. Если вторые звёзды перемешать, медиана равна 46 градусам, а ближе 1 градуса 0,1%. Соседние индексы, i и i + 1, ближе градуса в 0,02% случаев, так что если сравнивать строку со следующей, столбец выглядит прилично. Обе звезды, 2i и 2i + 1, оказались рядом только 6 раз из 24 999.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Расстояние на небе между звездой с индексом i и ближайшей из звёзд 2i и 2i + 1, 24 999 пар, 13 интервалов от менее чем 1 угловой минуты до 180 градусов. Большая часть настоящих пар лежит между 5 угловыми минутами и 1 градусом, 94% перемешанного контроля лежит дальше 10 градусов.">
  <line x1="60" y1="220.0" x2="650" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="175.0" x2="650" y2="175.0" class="f-plain"/>
  <text x="52.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="60" y1="130.0" x2="650" y2="130.0" class="f-plain"/>
  <text x="52.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="85.0" x2="650" y2="85.0" class="f-plain"/>
  <text x="52.0" y="89.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="60" y1="40.0" x2="650" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="64.0" y="218.1" width="17.7" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="83.7" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="109.4" y="214.3" width="17.7" height="5.7" style="fill:var(--accent);stroke:none"/>
  <rect x="154.8" y="188.4" width="17.7" height="31.6" style="fill:var(--accent);stroke:none"/>
  <rect x="200.2" y="152.8" width="17.7" height="67.2" style="fill:var(--accent);stroke:none"/>
  <rect x="219.8" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="245.5" y="95.6" width="17.7" height="124.4" style="fill:var(--accent);stroke:none"/>
  <rect x="265.2" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="290.9" y="97.4" width="17.7" height="122.6" style="fill:var(--accent);stroke:none"/>
  <rect x="310.6" y="219.9" width="17.7" height="0.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="336.3" y="171.4" width="17.7" height="48.6" style="fill:var(--accent);stroke:none"/>
  <rect x="356.0" y="219.7" width="17.7" height="0.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="381.7" y="184.4" width="17.7" height="35.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.4" y="219.2" width="17.7" height="0.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="427.1" y="210.5" width="17.7" height="9.5" style="fill:var(--accent);stroke:none"/>
  <rect x="446.8" y="213.5" width="17.7" height="6.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="472.5" y="217.9" width="17.7" height="2.1" style="fill:var(--accent);stroke:none"/>
  <rect x="492.2" y="201.5" width="17.7" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="517.8" y="219.3" width="17.7" height="0.7" style="fill:var(--accent);stroke:none"/>
  <rect x="537.5" y="105.6" width="17.7" height="114.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="563.2" y="219.9" width="17.7" height="0.1" style="fill:var(--accent);stroke:none"/>
  <rect x="582.9" y="74.1" width="17.7" height="145.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="628.3" y="56.6" width="17.7" height="163.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="105.4" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1′</text>
  <text x="150.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2′</text>
  <text x="196.2" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5′</text>
  <text x="241.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10′</text>
  <text x="286.9" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20′</text>
  <text x="332.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40′</text>
  <text x="377.7" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1°</text>
  <text x="423.1" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2°</text>
  <text x="468.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5°</text>
  <text x="513.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10°</text>
  <text x="559.2" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30°</text>
  <text x="604.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60°</text>
  <text x="650.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180°</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">доля пар, %</text>
  <rect x="230" y="9" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="248.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">2i или 2i + 1</text>
  <rect x="410" y="9" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="428.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">вперемешку</text>
</svg>
<figcaption>Расстояние от звезды i до ближайшей из 2i и 2i + 1 (акцентный цвет) и до тех же звёзд вперемешку (серый). По 24 999 пар.</figcaption>
</figure>

## Которая из двух

Удвоить число и дописать справа новый бит: так работает регистр сдвига с линейной обратной связью. Это старый дешёвый способ обойти все числа вразброс. Каждый новый бит в нём равен XOR нескольких старых. Я выписал 5912 уравнений по парам ближе 10 угловых минут и попробовал решить их относительно этих битов. 2946 уравнений противоречили остальным, примерно столько дала бы и монетка. Было похоже на случайность, но ошибка была моя: в уравнениях не было свободного члена. С ним сошлись все 5912. Новый бит это инвертированный XOR чего-то.

Остальное дал перебор битов по одному. Из 14 младших битов на ответ влияет только бит 9, в 99,99% пар. Из битов с 14-го по 29-й только бит 29. При i больше 571 миллиона удвоенное число в таблицу уже не помещается, поэтому биты 30 и 31 пришлось угадывать. Подошёл регистр в 32 бита с отводами 31, 30, 29 и 9. Числа, которым в таблице нет места, он перешагивает. В коде один шаг это такая строка, её надо повторять, пока x не станет меньше 1 142 679 769:

```
x = ((x << 1) & 0xffffffff) | (1 ^ ((x >> 31 ^ x >> 30 ^ x >> 29 ^ x >> 9) & 1))
```

Я взял по 2000 строк из 7 мест индекса, для каждой предсказал один следующий индекс и в пределах 1 градуса попал в 12 543 случаях из 14 000 (89,6%).

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="4 состояния 32-битного регистра, по одному в строке: 33 235 623; 66 471 246; 132 942 493; 265 884 986. Каждая строка получена из предыдущей сдвигом влево на один бит, справа входит новый бит. Отмечены биты 31, 30, 29 и 9, из них он и получается.">
  <text x="148.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">31</text>
  <text x="164.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">30</text>
  <text x="180.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">29</text>
  <text x="500.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">9</text>
  <text x="644.0" y="26.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">0</text>
  <text x="126.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">33 235 623</text>
  <rect x="140" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="236" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="252" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="364" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="380" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="396" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="444" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="492" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <rect x="508" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="524" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="540" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="572" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="588" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="604" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="644.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <line x1="356" y1="58" x2="340" y2="77" class="f-line"/>
  <text x="652.0" y="72.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новый бит</text>
  <text x="126.0" y="96.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">66 471 246</text>
  <rect x="140" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="236" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="348" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="364" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="380" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="396" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="428" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="492" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="508" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="524" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="540" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="556" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="572" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="588" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="80" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <line x1="356" y1="104" x2="340" y2="123" class="f-line"/>
  <text x="652.0" y="118.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новый бит</text>
  <text x="126.0" y="142.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">132 942 493</text>
  <rect x="140" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="236" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="332" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="364" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="380" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="396" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="412" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="476" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="492" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <rect x="508" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="524" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="540" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="572" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="588" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="636" y="126" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <line x1="356" y1="150" x2="340" y2="169" class="f-line"/>
  <text x="652.0" y="164.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новый бит</text>
  <text x="126.0" y="188.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">265 884 986</text>
  <rect x="140" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="220" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="236" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="316" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="364" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="380" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="396" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="460" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="492" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="508" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="524" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="540" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="572" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="588" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="620" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="172" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
</svg>
<figcaption>4 идущих подряд случайных индекса из первого файла выгрузки. Каждое число это предыдущее, сдвинутое влево, а новый правый бит равен инвертированному XOR отмеченных битов.</figcaption>
</figure>

Больше всего меня убедил файл. Выгрузка csv начинается с `GaiaSource_000-000-000.csv.gz`, в нём 218 453 строки, отсортированные по `source_id`. По правилу 216 634 из них (99,2%) переходят в другую строку этого же файла. Случайно таких набралось бы около 42.

Потом я запустил регистр от нуля. Вернулся он через 4 294 967 295 шагов, длиннее круга на 32 битах не бывает, поэтому каждое число меньше 1 142 679 769 встречается на нём ровно один раз. С перестановкой из документации это согласуется. Эти числа я по дороге пронумеровал, строки файла получили места с 478 825 166 по 479 202 346. 14 непрерывных отрезков длиной от 1000 мест покрывают 215 358 из них.

Я понимаю это так. В какой-то момент строки лежали область за областью, в этом порядке их и пронумеровали, а номер пропустили через регистр. Самой этой таблицы я не вижу, так что это догадка. У TGAS свой `random_index`, удвоение есть и там: ближе 1 градуса 81,3% пар.

## Мешает ли это

Средним почти не мешает. Я взял 3 выборки по 50 000 строк, одну с нуля, две другие с 300 и с 700 миллионов. Среднее G во всех 18,65 или 18,66. А вот пар ближе 10 угловых минут в первой 25 165, в двух других 12 434 и 12 582. Половина близких пар в первой выборке лишняя. Медианное расстояние до ближайшей звезды выборки 10,2 угловой минуты против 14,0 в двух других.

Выходит, хуже всего как раз `random_index < K`, самая естественная запись. В первой выборке у половины строк, ровно у половины, следующий индекс попадает в ту же выборку, в двух других ни у одной. Через 2 и через 3 шага регистра звёзды тоже рядом, ближе 1 градуса 89,5% и 89,2% пар.

Ещё документация советует проверять результат на 10 разных случайных подмножествах. Если разрезать индекс на 10 равных частей, следующая звезда для любой звезды из первой части окажется в первой или во второй. Независимыми я бы такие подмножества не назвал.

## Чего я не проверял

Из документации я прочёл только страницу про этот столбец, генератор может быть описан в другом месте. Биты 30 и 31 я угадал и потом подтвердил, а не вывел, как биты 9 и 29. Выгрузку сверил на одном файле. Хеш от `source_id`, наверное, был бы надёжнее, но я его не пробовал. Строку в пределах 2 угловых секунд я считал самой звездой, у двойной это может быть и второй компонент. И 100 ближайших это ближайшие из Hipparcos, слабых звёзд он не видит.
