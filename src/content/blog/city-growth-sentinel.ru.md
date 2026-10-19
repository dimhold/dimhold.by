---
title: "Моя спутниковая гифка Минска показала 64 км² нового города, а большая часть оказалась полями"
description: "7 лет Sentinel-2 над Минском: пара одиночных сцен показывает 64 км² новой голой земли, из них 60% пашня. Правило, которому нужен пиксель, изменившийся надолго, находит 3,46 км². Из 120 пикселей выборки 110 застроены или стали стройками. Самое большое пятно это бывший аэропорт Минск-1, а GHSL и WorldCover с моим счётом не сходятся."
date: 2022-12-18
lang: ru
translationKey: city-growth-sentinel
tags: ["open-data", "statistics"]
---
Такие гифки видели все: город из космоса, по кадру в год. Серое пятно с каждым кадром больше. Google Earth Timelapse в прошлом году выложил такие таймлапсы для всей Земли. Я всегда верил тому, что они показывают. Ни разу не спросил, сколько в этом движении собственно города. Этой осенью я захотел такую же гифку для Минска, 10 лет по Sentinel-2, потому что его данные бесплатные.

10 лет не получилось. Sentinel-2A запустили в июне 2015 года. Первая сцена над городом в архиве датирована 29 июля 2015 года. В декабре 2022 года в архиве 7 полных летних сезонов, с 2016 по 2022. Для 10 лет понадобился бы Landsat с разрешением 30 метров.

## Первая гифка

Я взял сцены Sentinel-2 L2A с Planetary Computer из тайла 35UNV. Окно около 32 на 28 км, в нём город вместе с МКАД и пригороды. Для каждого лета, с мая по сентябрь, я выбрал сцену с наименьшей облачностью в окне и собрал из 7 кадров гифку.

<figure class="fig">
<img src="/media/city-growth-sentinel/minsk-single.gif" width="810" height="702" alt="Гифка из 7 кадров, самая чистая сцена Sentinel-2 каждого лета с 2016 по 2022 год над Минском и пригородами. Поля вокруг города от кадра к кадру прыгают между бурым и зелёным, водохранилище на северо-западе меняет цвет, в 2019 году появляются небольшие облака. Сам город почти одинаков на всех кадрах." aria-label="Гифка из 7 кадров, самая чистая сцена Sentinel-2 каждого лета с 2016 по 2022 год над Минском и пригородами. Поля вокруг города от кадра к кадру прыгают между бурым и зелёным, водохранилище на северо-западе меняет цвет, в 2019 году появляются небольшие облака. Сам город почти одинаков на всех кадрах." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Sentinel-2 L2A, самая чистая сцена каждого лета, около 32 на 28 км, в гифке 40 метров на пиксель. Дата сцены в углу. Пиксели под маской заполнены значениями ближайшего пикселя.</figcaption>
</figure>

Это было похоже на растущий город: поля прыгали между бурым и зелёным, водохранилище на северо-западе меняло цвет. Потом я попробовал это посчитать. Пиксель "голый", если его индекс растительности (NDVI) меньше 0,25 и это не вода. Между кадром 22 августа 2016 года и кадром 23 мая 2022 года голыми стали 64 км². За то же время 51 км² перестал быть голым, так что чистый прирост 13 км² к 108. Если смотреть только на прирост, как это делает глаз на гифке, голая площадь за неполные 6 лет выросла в полтора с лишним раза.

Я посмотрел, что лежит под этими 64 км² на карте ESA WorldCover за 2021 год. 60% из них пашня. В мае на многих полях ещё ничего не выросло, поэтому они выглядят как голая почва. Мой индекс не отличает их от новостройки. В более строгий счёт ниже из этих 64 км² попало только 5%.

## Медианы вместо одиночных сцен

Обычно это лечат медианой. Для каждого лета я взял до 12 самых чистых сцен и замаскировал облака и тени по слою классификации сцены (SCL) из L2A. В каждом пикселе остаётся медиана его значений за лето. Потом я посчитал пиксели, которые меняют состояние, голый или не голый, хотя бы 2 раза за 7 кадров. По одиночным сценам это 157 км², по медианам 59 км², что тоже немало. Для одиночных сцен счёт идёт по меньшей площади, потому что у них больше пикселей под маской.

<figure class="fig">
<svg viewBox="0 0 680 275" role="img" aria-label="Линейный график, годы с 2016 по 2022, голая земля в окне в квадратных километрах. По самой чистой одиночной сцене каждого лета линия скачет: 93,4, 102,0, 100,9, 84,7, 80,4, 95,0, 107,0. По летним медианам она почти ровная: 81,6, 81,3, 86,9, 85,9, 82,6, 80,8, 83,4.">
  <line x1="70" y1="200.0" x2="560" y2="200.0" class="f-plain"/>
  <text x="64" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="70" y1="140.0" x2="560" y2="140.0" class="f-plain"/>
  <text x="64" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="70" y1="80.0" x2="560" y2="80.0" class="f-plain"/>
  <text x="64" y="84.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="20.0" x2="560" y2="20.0" class="f-plain"/>
  <text x="64" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <text x="64" y="12" text-anchor="end" class="f-label f-muted">км²</text>
  <path d="M90.0,119.8 L165.0,68.2 L240.0,74.8 L315.0,171.6 L390.0,197.8 L465.0,110.2 L540.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M90.0,190.6 L165.0,192.4 L240.0,158.4 L315.0,164.7 L390.0,184.6 L465.0,195.0 L540.0,179.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="90.0" cy="119.8" r="3.5" class="f-accent"/>
  <circle cx="90.0" cy="190.6" r="3.5" class="f-ink"/>
  <text x="90.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="90.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">22 авг</text>
  <circle cx="165.0" cy="68.2" r="3.5" class="f-accent"/>
  <circle cx="165.0" cy="192.4" r="3.5" class="f-ink"/>
  <text x="165.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="165.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12 авг</text>
  <circle cx="240.0" cy="74.8" r="3.5" class="f-accent"/>
  <circle cx="240.0" cy="158.4" r="3.5" class="f-ink"/>
  <text x="240.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="240.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8 июн</text>
  <circle cx="315.0" cy="171.6" r="3.5" class="f-accent"/>
  <circle cx="315.0" cy="164.7" r="3.5" class="f-ink"/>
  <text x="315.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="315.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13 июн</text>
  <circle cx="390.0" cy="197.8" r="3.5" class="f-accent"/>
  <circle cx="390.0" cy="184.6" r="3.5" class="f-ink"/>
  <text x="390.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="390.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 июн</text>
  <circle cx="465.0" cy="110.2" r="3.5" class="f-accent"/>
  <circle cx="465.0" cy="195.0" r="3.5" class="f-ink"/>
  <text x="465.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <text x="465.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 сен</text>
  <circle cx="540.0" cy="38.2" r="3.5" class="f-accent"/>
  <circle cx="540.0" cy="179.8" r="3.5" class="f-ink"/>
  <text x="540.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2022</text>
  <text x="540.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23 мая</text>
  <text x="552" y="42.2" class="f-label">одиночная сцена</text>
  <text x="552" y="183.8" class="f-label f-muted">медиана лета</text>
</svg>
<figcaption>Голая земля это NDVI меньше 0,25 и не вода. Линия медиан считается по 891 км² окна, линия одиночных сцен по тем 817 км², которые маска оставила во всех 7 сценах. Под осью стоит дата одиночной сцены.</figcaption>
</figure>

Голая площадь по медианам каждый год держится между 81 и 87 км² без всякого тренда, больше всего её в 2018 году.

В данных 2022 года была ещё одна ловушка. С 25 января 2022 года ESA обрабатывает сцены версией обработки (processing baseline) 04.00, которая прибавляет 1000 к каждому значению коэффициента отражения. Я эту добавку вычел. Без этого то же правило даёт 154 км² голой земли в 2022 году вместо 83 км².

## Правило: смена должна продержаться

Тогда я стал требовать больше одного кадра. Пиксель считается новым городом, если он был зелёным (NDVI 0,5 и выше) в 2016 и 2017 годах, а голым в 2021 и 2022. Ещё он должен лежать в пятне хотя бы из 5 пикселей. Получается 3,46 км² в 854 пятнах. Обратная смена, из голого в зелёное при том же правиле пятен, даёт 0,51 км².

Этому числу я тоже не поверил. Поэтому я выбрал из этих пятен 120 случайных пикселей и посмотрел на каждый в медианах 2016, 2019 и 2022 годов. Я думал, что поля и лесные вырубки составят хотя бы половину. Я ошибся. На 77 пикселях к 2022 году стояло здание, дорога или асфальтированный двор. 33 оказались стройплощадками или землёй, расчищенной под стройку. 1 был полем, а 9 я не смог разобрать при разрешении 10 метров, в основном в частном секторе.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="Сетка из 120 квадратов, по одному на каждый случайно выбранный пиксель правила смены. 77 квадратов залиты тёмным: к 2022 году там здание, дорога или асфальтированный двор. 33 залиты акцентным цветом: стройплощадка или расчищенная земля. 1 это поле. 9 остались пустыми контурами: при разрешении 10 метров не разобрать.">
  <rect x="72.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="369.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="396.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="423.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="450.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="477.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="504.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="531.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="149" width="22" height="22" class="f-muted"/>
  <rect x="369.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="396.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="423.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="450.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="477.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="504.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="531.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="558.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="585.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="60" y="190" width="12" height="12" class="f-ink"/>
  <text x="78" y="200" class="f-label">застроено к 2022 77</text>
  <rect x="229.39999999999998" y="190" width="12" height="12" class="f-accent"/>
  <text x="247.39999999999998" y="200" class="f-label">стройплощадка 33</text>
  <rect x="379" y="190" width="12" height="12" class="f-muted"/>
  <text x="397" y="200" class="f-label">поле 1</text>
  <rect x="462.6" y="190" width="12" height="12" class="f-plain" style="stroke:var(--muted)"/>
  <text x="480.6" y="200" class="f-label">не разобрать 9</text>
</svg>
<figcaption>Каждый пиксель я просмотрел в медианах 2016, 2019 и 2022 годов, 10 метров на пиксель. Размечал я один.</figcaption>
</figure>

20 пикселей из 120 попали в одно место, на бывший аэропорт Минск-1. Его закрыли 23 декабря 2015 года, так что летом 2016 года, первым для Sentinel-2, полоса ещё на месте. В медианах она лежит в зелёном поле до 2018 года, в 2019 году появляется песок. К 2022 году на северо-западной половине стоят жилые дома. В радиусе 1 км от середины полосы лежит 0,54 км² изменившейся площади, 15% всех изменений в окне. Самое большое отдельное пятно тоже там.

<figure class="fig">
<img src="/media/city-growth-sentinel/airport-median.gif" width="800" height="600" alt="Гифка из 7 летних медиан с 2016 по 2022 год над бывшим аэропортом Минск-1, около 4 на 3 км. До 2018 года взлётная полоса лежит в зелёном поле. В 2019 году по ней расползается песок стройки. К 2022 году на северо-западной половине полосы стоят ряды высоких домов и новые улицы, а юго-восточная половина всё ещё в песке." aria-label="Гифка из 7 летних медиан с 2016 по 2022 год над бывшим аэропортом Минск-1, около 4 на 3 км. До 2018 года взлётная полоса лежит в зелёном поле. В 2019 году по ней расползается песок стройки. К 2022 году на северо-западной половине полосы стоят ряды высоких домов и новые улицы, а юго-восточная половина всё ещё в песке." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Летние медианы Sentinel-2 L2A, 10 метров на пиксель. Пиксели без единого чистого наблюдения за лето заполнены значениями ближайшего пикселя.</figcaption>
</figure>

## Сверка с готовыми картами

Ещё до счёта я собирался сравнить результат с 2 готовыми картами. Первая это GHSL Еврокомиссии, выпуск R2022A, вышедший этим летом, застроенная поверхность с шагом 5 лет. На моей сетке она даёт 73,9 км² застройки в 2015 году и 77,2 км² в 2020 году, то есть на 3,3 км² больше. Мои 3,46 км² с 2016 по 2022 год почти столько же. Я этому обрадовался.

Потом я посмотрел, где находятся эти 3,3 км². 7% прироста GHSL приходится на полосу 100 метров вокруг моих пятен. Эта полоса занимает 3,4% окна, то есть совпадение примерно вдвое больше случайного. И всё равно остальные 93% в других местах. На клетках по 500 метров корреляция двух карт 0,06. На территории аэропорта GHSL почти не меняется: на моих изменившихся пикселях доля застройки у неё 4,6% в 2015 году и 4,9% в 2020. Тогда я наконец внимательно прочитал описание GHSL. Настоящих наблюдений в ней 2: Landsat 2014 года и композит Sentinel-2 за 2018 год. Эпоху 2015 года GHSL интерполирует, эпоху 2020 года экстраполирует. Для обеих работает модель, которая учитывает среди прочего рельеф, расстояние до воды и уже наблюдавшийся рост. Так что её число за 2020 год это не наблюдение.

С WorldCover для этого вопроса ещё хуже. Карта 2020 года сделана версией алгоритма v100, а карта 2021 года версией v200. В примечаниях к выпуску авторы предупреждают, что разница между двумя картами складывается из изменений на земле и из смены алгоритма. В моём окне застроенный класс за один год растёт со 153,9 до 186,8 км², а моё правило даёт меньше 1 км² в год.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Горизонтальные полосы, новая земля в квадратных километрах по способу счёта. 2 одиночные сцены, 2016 → 2022: 64,2; 2 медианы, 2016 → 2022: 23,2; WorldCover, 2020 → 2021: 32,9; GHSL, 2015 → 2020: 3,3; моё правило, 2016–17 → 2021–22: 3,46.">
  <text x="240" y="29" text-anchor="end" class="f-label f-muted">2 одиночные сцены, 2016 → 2022</text>
  <rect x="250" y="14" width="312.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="570.0" y="30" class="f-mono">64,2 км²</text>
  <text x="240" y="67" text-anchor="end" class="f-label f-muted">2 медианы, 2016 → 2022</text>
  <rect x="250" y="52" width="112.4" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="370.4" y="68" class="f-mono">23,2 км²</text>
  <text x="240" y="105" text-anchor="end" class="f-label f-muted">WorldCover, 2020 → 2021</text>
  <rect x="250" y="90" width="159.8" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="417.8" y="106" class="f-mono">32,9 км²</text>
  <text x="240" y="143" text-anchor="end" class="f-label f-muted">GHSL, 2015 → 2020</text>
  <rect x="250" y="128" width="16.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="274.0" y="144" class="f-mono">3,3 км²</text>
  <text x="240" y="181" text-anchor="end" class="f-label">моё правило, 2016–17 → 2021–22</text>
  <rect x="250" y="166" width="16.8" height="22" class="f-accent" style="fill-opacity:1"/>
  <text x="274.8" y="182" class="f-mono">3,46 км²</text>
</svg>
<figcaption>Всё на одной сетке Sentinel-2 окна. Пара одиночных сцен сравнивает 22 августа 2016 года с 23 мая 2022 года. Обе пары считают только землю, ставшую голой. WorldCover и GHSL дают чистое изменение застроенного класса.</figcaption>
</figure>

## Что я из этого вынес

В моём окне вокруг Минска нового города около 3,5 км² за 6 лет вместе со стройплощадками. Думаю, настоящее число скорее больше, чем меньше. Пиксель должен был быть зелёным 2 лета подряд перед сменой. Застройка мелкими кусками не проходит правило пятен. Но сколько правило пропустило, я не измерял.

## Чего я не проверял

Пороги 0,25 и 0,5 я выбрал один раз и не подбирал. Земля, расчищенная до 2016 года, в счёт не попала, а в окне есть ещё и деревни за городом. Выборку я размечал один при разрешении 10 метров, другой человек мог бы отнести несколько точек в другую группу. Где старые дома с садами сменились новыми кварталами, моё правило посчитало бы это новым городом, хотя земля была застроена и раньше. Более высокое здание на месте низкого оно не видит совсем.

На 2,2% окна хотя бы за одно лето не нашлось ни одного чистого наблюдения. В счёт они не вошли. Сначала я думал, что маска принимает светлые крыши за облака. Классы говорят другое: около половины этих пикселей "unclassified" и треть "dark area", 2 класса, которые выбросила моя собственная маска. В гифках я заполнил дыры значениями ближайшего пикселя.
