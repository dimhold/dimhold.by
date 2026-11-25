---
title: "Модель весь год занижала спрос на 36%, а PSI её признаков был 0,06"
description: "Я обучил модель проката велосипедов на 2011 годе, заморозил её и пустил работать на 2012. Она занизила спрос на 36%, а годовой PSI признаков остался ниже 0,07. По месяцам тревога PSI сработала во всех 24 месяцах, в хороших тоже. KS сработал в 397 выборках из 400, где ничего не менялось."
date: 2018-10-06
lang: ru
translationKey: silent-drift
tags: ["machine-learning", "statistics", "reliability"]
---

`psi_pred: 0.0054`. Это расстояние между прогнозами моей модели на 2012 и на 2011 год по индексу стабильности популяции (PSI), которым пользуются в кредитном скоринге. Меньше 0,1 там читается как "ничего не произошло". На 2012 год модель предсказала 1 306 797 поездок, а было их 2 049 576.

Когда я думаю, как следить за моделью в проде, первым в голову приходит сравнение распределений на входе: признаки есть сразу, а правильные ответы придут потом. Звучит разумно, но на данных, где уже известно, чем всё кончилось, я этого ни разу не пробовал. И не знал, как часто такая проверка срабатывает впустую.

Что по входам виден не любой дрейф, давно известно. Гама с соавторами в обзоре 2014 года отделяют изменение самих признаков от изменения того, как от них зависит ответ. Второе без ответов не заметить. Мне хотелось посчитать пропуски и ложные тревоги.

## Что я запускал

Я взял Bike Sharing из UCI, набор Фанаи-Т и Гамы: почасовой прокат Capital Bikeshare в Вашингтоне вместе с погодой, 8645 часов 2011 года и 8734 часа 2012. В 2014 году по этим данным было соревнование на Kaggle. На 2011 годе я обучил градиентный бустинг, 300 деревьев глубины 5, без столбца с годом, потом заморозил его и пустил работать на 2012. Python 3.6, sklearn 0.20.0, pandas 0.23.4, scipy 1.1.0.

Ошибку я считаю как WAPE, сумму модулей ошибок делю на сумму поездок. Кросс-валидация по 2011 году, где откладываются целые недели, даёт 18,3%. На 2012 годе у замороженной модели 38,3% и каждый из 12 месяцев хуже худшего месяца 2011 года. За год поездок стало на 65% больше, узнать об этом модели было неоткуда.

Теперь мониторинг. Для 4 погодных признаков я считаю PSI по интервалам между децилями 2011 года (у типа погоды свои категории), тревога выше 0,25, как в книге Сиддики про скоринговые карты. Если сравнить 2012 год с 2011 целиком, выходит 0,043 у температуры, 0,063 у влажности и по 0,004 у ветра и типа погоды. На вход идёт ещё температура "по ощущениям", тревогу на неё я не ставил, PSI 0,030. Даже у самих поездок, то есть у ответа, PSI 0,244. Рост на 65% до порога не дотянул.

## По месяцам

Ждать год никто не будет, поэтому я сравнил каждый месяц со всем 2011 годом. Критерии я записал до запуска и там же своё ожидание: тревога опоздает, но к лету сработает.

<figure class="fig">
<svg viewBox="0 0 680 332" role="img" aria-label="24 месяца на двух панелях. Сверху ошибка модели WAPE: от 11,8 до 26,2 процента в 2011 году на отложенных неделях и от 29,5 до 53,6 процента в 2012. Снизу наибольший PSI 4 погодных признаков против всего 2011 года: выше линии 0,25 во всех 24 месяцах, от 1,08 до 4,09 в 2011 и от 0,92 до 3,99 в 2012.">
  <line x1="50.0" y1="138.0" x2="664.0" y2="138.0" class="f-plain"/>
  <text x="42.0" y="142.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="101.3" x2="664.0" y2="101.3" class="f-plain"/>
  <text x="42.0" y="105.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="50.0" y1="64.7" x2="664.0" y2="64.7" class="f-plain"/>
  <text x="42.0" y="68.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="50.0" y1="28.0" x2="664.0" y2="28.0" class="f-plain"/>
  <text x="42.0" y="32.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="53.0" y="95.4" width="19.0" height="42.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="90.0" width="19.0" height="48.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="93.7" width="19.0" height="44.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="92.8" width="19.0" height="45.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="110.2" width="19.0" height="27.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="116.3" width="19.0" height="21.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="111.8" width="19.0" height="26.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="111.3" width="19.0" height="26.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="105.7" width="19.0" height="32.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="108.1" width="19.0" height="29.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="92.1" width="19.0" height="45.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="93.2" width="19.0" height="44.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="39.7" width="19.0" height="98.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="48.2" width="19.0" height="89.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="44.5" width="19.0" height="93.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="62.8" width="19.0" height="75.2" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="83.9" width="19.0" height="54.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="79.3" width="19.0" height="58.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="74.9" width="19.0" height="63.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="72.3" width="19.0" height="65.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="72.9" width="19.0" height="65.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="67.6" width="19.0" height="70.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="70.1" width="19.0" height="67.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="67.7" width="19.0" height="70.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">WAPE, %</text>
  <line x1="50.0" y1="290.0" x2="664.0" y2="290.0" class="f-plain"/>
  <text x="42.0" y="294.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="268.0" x2="664.0" y2="268.0" class="f-plain"/>
  <text x="42.0" y="272.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="50.0" y1="246.0" x2="664.0" y2="246.0" class="f-plain"/>
  <text x="42.0" y="250.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="50.0" y1="224.0" x2="664.0" y2="224.0" class="f-plain"/>
  <text x="42.0" y="228.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3</text>
  <line x1="50.0" y1="202.0" x2="664.0" y2="202.0" class="f-plain"/>
  <text x="42.0" y="206.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="50.0" y1="180.0" x2="664.0" y2="180.0" class="f-plain"/>
  <text x="42.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="53.0" y="204.5" width="19.0" height="85.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="248.6" width="19.0" height="41.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="251.0" width="19.0" height="39.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="266.2" width="19.0" height="23.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="255.1" width="19.0" height="34.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="228.0" width="19.0" height="62.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="200.0" width="19.0" height="90.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="217.1" width="19.0" height="72.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="259.8" width="19.0" height="30.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="245.0" width="19.0" height="45.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="235.2" width="19.0" height="54.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="241.4" width="19.0" height="48.6" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="269.7" width="19.0" height="20.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="260.2" width="19.0" height="29.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="238.5" width="19.0" height="51.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="236.7" width="19.0" height="53.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="202.2" width="19.0" height="87.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="212.2" width="19.0" height="77.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="241.0" width="19.0" height="49.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="255.2" width="19.0" height="34.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="237.1" width="19.0" height="52.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="238.3" width="19.0" height="51.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="168.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">наибольший PSI</text>
  <line x1="50.0" y1="284.5" x2="664.0" y2="284.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="62.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="87.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="112.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="137.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="162.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="187.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="212.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="237.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="262.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="287.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="312.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="337.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="376.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="401.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="426.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="451.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="476.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="501.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="526.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="551.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="576.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="601.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="626.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="651.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="200.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2011</text>
  <text x="514.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2012</text>
</svg>
<figcaption>Сверху ошибка модели, 2011 на отложенных неделях (серым) и 2012 (цветом). Снизу наибольший из 4 PSI за месяц против всего 2011 года. Пунктир: порог 0,25.</figcaption>
</figure>

Сработала она во всех 12 месяцах 2012 года. И во всех 12 месяцах 2011, когда с моделью всё было в порядке. Одной температуры хватает каждый раз, PSI у неё от 0,9 до 4,1, потому что месяц не похож на год. Толку от такой тревоги нет.

Обычно на это советуют сравнивать с тем же месяцем прошлого года. Тогда тревога срабатывает в 7 месяцах из 12. Вот 5, в которых было тихо:

| месяц 2012 года | наибольший PSI из 4 | прогноз к факту за месяц |
|---|---|---|
| июнь | 0,22 | -30% |
| июль | 0,13 | -33% |
| август | 0,11 | -35% |
| октябрь | 0,16 | -36% |
| декабрь | 0,20 | -33% |

Если взять порог помягче, 0,1, сработают все 12. Реагирует такая тревога на погоду. Март 2012 был теплее марта 2011, в среднем 13,1 градуса против 7,6, PSI 1,25, модель занизила его на 51%. Но и август она занизила на 35%, хотя погода была близка к прошлогодней. Если сравнивать с тем же месяцем сами прогнозы, порог 0,25 не превышен ни разу. С летом я ошибся в обоих вариантах.

Ещё я ошибся с формой. Я ждал, что ошибка будет расти понемногу. Хуже всего оказался первый же месяц, январь, минус 53%. За 2011 год прокат вырос с 38 189 поездок в январе до 87 323 в декабре и модель, похоже, приняла этот рост за сезон, другого года она не видела. Кросс-валидация внутри 2011 года этого показать не могла, отложенные недели там разбросаны между обучающими.

## 30 случайных дней

Ещё часто берут тест KS (Колмогорова-Смирнова). Его я проверил там, где точно ничего не меняется: 30 случайных целых дней 2011 года против остальных дней того же года, 400 раз. Считал, сколько раз p ниже 0,05 у температуры, влажности и ветра.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Сколько из 400 случайных выборок 2011 года дают p ниже 0,05 в тесте KS. 30 случайных дней: температура 361, влажность 296, ветер 167, любой из 3 397. Столько же случайных часов: температура 13, влажность 17, ветер 8, любой из 3 37.">
  <line x1="50.0" y1="200.0" x2="664.0" y2="200.0" class="f-plain"/>
  <text x="42.0" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="157.5" x2="664.0" y2="157.5" class="f-plain"/>
  <text x="42.0" y="161.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50.0" y1="115.0" x2="664.0" y2="115.0" class="f-plain"/>
  <text x="42.0" y="119.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50.0" y1="72.5" x2="664.0" y2="72.5" class="f-plain"/>
  <text x="42.0" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="50.0" y1="30.0" x2="664.0" y2="30.0" class="f-plain"/>
  <text x="42.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">выборок с p &lt; 0,05 из 400</text>
  <rect x="80.8" y="46.6" width="42.0" height="153.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="101.8" y="41.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">361</text>
  <rect x="130.8" y="194.5" width="42.0" height="5.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="151.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13</text>
  <text x="126.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">температура</text>
  <rect x="234.3" y="74.2" width="42.0" height="125.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="255.3" y="69.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">296</text>
  <rect x="284.3" y="192.8" width="42.0" height="7.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="305.3" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">17</text>
  <text x="280.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">влажность</text>
  <rect x="387.8" y="129.0" width="42.0" height="71.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="408.8" y="124.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">167</text>
  <rect x="437.8" y="196.6" width="42.0" height="3.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="458.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8</text>
  <text x="433.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ветер</text>
  <rect x="541.3" y="31.3" width="42.0" height="168.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="562.3" y="26.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">397</text>
  <rect x="591.3" y="184.3" width="42.0" height="15.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="612.3" y="179.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">37</text>
  <text x="587.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">любой из 3</text>
  <line x1="50.0" y1="191.5" x2="664.0" y2="191.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <rect x="50.0" y="234.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="68.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">30 случайных дней</text>
  <rect x="280.0" y="234.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="298.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">столько же случайных часов</text>
</svg>
<figcaption>400 выборок, в которых заведомо ничего не менялось. Пунктир: 5%, которые тест обещает для одного признака.</figcaption>
</figure>

Хотя бы один тест из 3 сработал в 397 выборках из 400. Если вместо дней взять столько же случайных часов, хоть что-то срабатывает в 37. Тест думает, что перед ним примерно 700 независимых строк, но часы одного дня приходят вместе: 91% дисперсии температуры это разница между днями, на ней тест сработал в 361 выборке. У ветра 39% и 167 выборок. PSI с порогом 0,25 здесь спокойнее, 27 выборок из 400. С порогом 0,1 их 228.

## С ответами

Здесь я был уверен и всё равно споткнулся. Правило было такое: взять последние 7 дней и поднять тревогу, если WAPE выше, чем в худшие 7 дней 2011 года. Оно не сработало ни разу, 0 окон из 360. Медиана по окнам выросла с 17% до 37%, а тревога молчала. Худшее окно 2011 года кончается 27 декабря, там 62%. Это Рождество, 25-го было 754 поездки, а с 5 по 18 декабря в среднем 3072 за день. В 2012 году худшее окно 60,4%.

Тогда я посмотрел на знак ошибки. В 2011 году сильнее всего за 7 дней модель занизила на 22,6%. В 2012 первое же полное окно, которое кончается 7 января, уже ниже. Всего таких окон 346 из 360. Ответы и окно те же, я только не выбросил знак.

## Обучение заново каждый месяц вернуло полпункта

У замороженной модели 38,3%. Я обучал её заново первого числа каждого месяца на всём прошлом и получил 37,8%. Заподозрил ошибку в коде и написал второй скрипт, он выдал те же 37,8%. Потом попробовал иначе.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="WAPE на 2012 годе, проценты: заморожена на 2011 38,3; раз в месяц, всё прошлое 37,8; то же без месяца и сезона 30,7; раз в месяц, 90 дней 20,7; всё прошлое + столбец года 19,0; заморож. × факт / прогноз, 28 дн. 17,3. Пунктир: ошибка на отложенных неделях 2011 года, 18,3.">
  <line x1="280.0" y1="14.0" x2="280.0" y2="206.0" class="f-plain"/>
  <text x="280.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="367.5" y1="14.0" x2="367.5" y2="206.0" class="f-plain"/>
  <text x="367.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="455.0" y1="14.0" x2="455.0" y2="206.0" class="f-plain"/>
  <text x="455.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="542.5" y1="14.0" x2="542.5" y2="206.0" class="f-plain"/>
  <text x="542.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="630.0" y1="14.0" x2="630.0" y2="206.0" class="f-plain"/>
  <text x="630.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="280.0" y="21.0" width="335.4" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">заморожена на 2011</text>
  <text x="674.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">38,3</text>
  <rect x="280.0" y="53.0" width="330.6" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">раз в месяц, всё прошлое</text>
  <text x="674.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">37,8</text>
  <rect x="280.0" y="85.0" width="268.6" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">то же без месяца и сезона</text>
  <text x="674.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">30,7</text>
  <rect x="280.0" y="117.0" width="181.1" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">раз в месяц, 90 дней</text>
  <text x="674.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">20,7</text>
  <rect x="280.0" y="149.0" width="166.0" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">всё прошлое + столбец года</text>
  <text x="674.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">19,0</text>
  <rect x="280.0" y="181.0" width="151.4" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">заморож. × факт / прогноз, 28 дн.</text>
  <text x="674.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">17,3</text>
  <line x1="440.1" y1="10.0" x2="440.1" y2="206.0" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
</svg>
<figcaption>WAPE на 2012 годе, %. Пунктир: 18,3%, ошибка на отложенных неделях 2011 года. Множитель обновляется каждый день, обучение идёт раз в месяц.</figcaption>
</figure>

Отчасти дело, думаю, в столбце с месяцем. Для сентября 2012 в обучении есть только старый сентябрь. Без месяца и сезона получается 30,7%, это всё ещё плохо. Могу только предположить, что старых строк слишком много, даже для декабря их 8645 из 16 637. Если учить только на последних 90 днях, выходит 20,7%, если на всём прошлом со столбцом года, 19,0%. Лучше всего оказалась старая замороженная модель, умноженная на отношение факта к прогнозу за предыдущие 28 дней, 17,3%. Сравнение не совсем честное, множитель меняется каждый день, а обучение идёт раз в месяц. И в январе у него ещё нет 28 дней, там так и остаётся 49%.

## Чего я не проверял

Один город, одна модель и рост в одну сторону, причём очень большой. Медленный дрейф на 5% в год и по знаку ошибки ловить труднее. Я считал, что ответы известны на следующий день, у кредитов они приходят через месяцы. Пустой интервал в PSI у меня идёт за полстроки, если за 5 строк, месячный PSI температуры будет от 0,7 до 2,7. Множителя в критериях не было, а остальные способы обучения появились уже после первых результатов. DDM и ADWIN на потоке ошибок я не пробовал.
