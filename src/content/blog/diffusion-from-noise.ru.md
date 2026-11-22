---
title: "Как диффузионная модель выбирает цифру из шума"
description: "Я обучил маленькую DDPM на цифрах 8 на 8, чтобы посмотреть, как из шума появляется картинка. Первые 400 шагов из 1000 почти не выбирают цифру, а половина сэмплов оказалась копиями обучающих цифр."
date: 2021-01-16
lang: ru
translationKey: diffusion-from-noise
tags: ["machine-learning", "statistics"]
---
С тех пор как прошлым летом вышла статья про DDPM, я объяснял диффузионные модели всем одинаково. Начинаешь с чистого шума и каждый шаг убирает его понемногу. Через 1000 шагов получается картинка, примерно как фотография, которая медленно проступает в ванночке с проявителем. Звучит правдоподобно и никто не спорил. Но сам я такую модель ни разу не обучал, поэтому не знал, правда ли это, особенно слово "медленно".

Так что я обучил её на самых маленьких картинках, которые смог найти. Потом посмотрел, что происходит внутри.

## Что и на чём

GPU здесь нет, только 4 ядра облачной машины, так что данные нужны были крошечные. В `scikit-learn` есть набор из 1797 рукописных цифр размером 8 на 8 пикселей. Яркость каждого пикселя от 0 до 16. 1347 цифр я взял для обучения, 450 отложил. Модель я старался держать как можно ближе к Ho et al.: 1000 шагов, шум добавляется по линейному расписанию от 0,0001 до 0,02. Сеть смотрит на зашумлённую картинку и угадывает шум. У Ho et al. это U-Net. Я взял обычный MLP на 2,5 миллиона параметров, потому что картинки совсем маленькие. Работал на Python 3.8, PyTorch 1.7.1 и `scikit-learn` 0.24. Обучение шло 60 000 шагов и заняло 64 минуты.

Ещё нужен был способ узнавать цифру на картинке, не разглядывая тысячи картинок самому. Это делает логистическая регрессия, обученная на тех же 1347 цифрах. На 450 отложенных она права в 97,6% случаев. Дальше я называю её судьёй.

## Добавляем шум

Это простое направление, тут одна формула. После t шагов картинка это взвешенная сумма оригинала и свежего шума. Веса известны заранее. На шаге 500 вес оригинала 0,28, вес шума 0,96. На шаге 1000 вес оригинала падает до 0,006.

Судья видит то же самое. На зашумлённых версиях 450 отложенных цифр на шаге 300 он прав в 52,6% случаев. На шаге 1000 он прав в 9,6% случаев, а это случайное угадывание при 10 классах. До этого места всё было так, как я ожидал.

## Генерация

Потом я стал генерировать. Я хотел узнать, на каком шаге модель решает, что рисует двойку, а не семёрку.

Я запустил 200 генераций от шума до конца и сохранил каждую в 16 точках по пути. Потом с каждой сохранённой точки я 10 раз перезапускал оставшийся путь со свежим случайным шумом. Судья говорил, закончился ли перезапуск той же цифрой, что и исходный прогон. Если на этом шаге цифра уже выбрана, перезапуски должны совпадать.

<figure class="fig">
<svg viewBox="0 0 680 416" role="img" aria-label="Одна генерация цифры на шагах 1000, 600, 450, 350, 300, 250, 150 и в конце, где это 2. Перезапуски с той же точки: с 600: 3, 1, 3, 1, 7, 1; с 450: 3, 9, 8, 9, 7, 1; с 300: 2, 3, 2, 2, 3, 2; с 150: 2, 2, 2, 2, 2, 2.">
  <text x="20" y="16" text-anchor="start" class="f-muted" style="font-size:12px">одна генерация, от шума до конца</text>
  <rect x="20" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="27.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="34.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="41.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="48.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="55.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="62.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="69.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="20.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="27.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="41.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="48.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="55.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="62.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="69.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="20.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="34.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="41.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="48.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="55.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="69.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="20.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="27.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="41.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="48.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="69.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="20.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="34.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="41.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="48.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="62.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="69.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="20.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="27.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="34.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="41.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="55.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="20.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="27.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="34.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="41.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="55.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="69.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="20.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="27.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="34.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="48.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="55.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <text x="48" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 1000</text>
  <rect x="102" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="102.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="109.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="123.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="130.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="137.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="144.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="151.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="102.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="109.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="123.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="137.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="144.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="151.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="102.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="109.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="116.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="123.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="130.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="137.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="144.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="151.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="102.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="109.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="116.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="123.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="137.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="151.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="109.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="123.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="130.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="137.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="151.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="102.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="109.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="123.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="144.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="151.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="102.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="109.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="116.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="123.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="137.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="144.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="102.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="116.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="137.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="144.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="151.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="130" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 600</text>
  <rect x="184" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="184.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="191.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="198.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="205.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="212.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="219.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="226.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="233.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="184.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="198.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="205.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="212.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="219.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="226.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="191.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="198.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="205.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="212.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="219.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="226.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="191.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="198.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="205.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="212.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="219.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="205.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="212.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="219.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="226.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="233.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="184.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="198.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="205.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="212.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="219.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="226.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="233.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="191.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="198.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="205.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="212.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="219.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="226.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="233.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="191.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="198.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="219.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="226.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="233.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <text x="212" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 450</text>
  <rect x="266" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="273.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="280.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="287.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="294.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="301.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="315.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="266.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="273.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="280.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="287.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="294.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="301.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="315.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="266.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="273.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="280.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="287.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="294.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="301.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="315.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="266.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="280.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="287.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="294.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="301.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="315.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="266.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="273.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="287.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="294.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="301.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="308.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="315.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="266.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="273.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="280.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="287.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="294.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="301.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="308.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="315.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="266.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="280.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="287.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="294.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="301.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="266.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="280.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="287.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="294.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="301.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="315.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="294" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 350</text>
  <rect x="348" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="355.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="362.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="369.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="376.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="397.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="348.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="355.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="362.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="369.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="376.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="383.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="390.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="397.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="348.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="355.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="362.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="369.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="376.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="383.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="390.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="397.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="348.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="362.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="369.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="376.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="383.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="390.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="397.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="348.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="355.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="369.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="376.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="383.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="390.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="397.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="348.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="355.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="362.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="369.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="376.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="390.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="397.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="355.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="362.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="376.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="383.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="390.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="355.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="362.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="369.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="376.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="383.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="390.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="397.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="376" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 300</text>
  <rect x="430" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="437.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="444.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="451.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="458.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="472.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="479.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="430.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="437.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="444.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="451.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="458.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="465.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="472.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="479.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="430.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="437.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="444.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="451.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="458.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="465.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="472.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="479.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="430.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="444.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="458.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="465.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="472.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="479.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="430.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="458.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="465.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="472.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="479.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="430.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="437.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="451.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="458.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="472.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="479.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="437.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="444.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="451.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="458.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="465.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="472.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="444.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="451.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="458.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="465.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <text x="458" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 250</text>
  <rect x="512" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="519.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="526.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="533.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="561.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="512.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="519.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="526.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="533.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="540.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="547.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="561.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="512.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="526.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="533.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="540.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="554.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="561.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="526.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="533.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="540.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="554.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="561.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="512.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="519.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="533.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="540.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="547.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="561.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="519.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="533.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="547.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="554.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="561.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="512.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="526.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="533.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="547.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="554.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="512.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="526.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="533.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="547.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="554.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="561.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="540" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">шаг 150</text>
  <rect x="594" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="601.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="622.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="601.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="608.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="622.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="601.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="608.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="615.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="622.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="629.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="615.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="622.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="629.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="601.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="615.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="622.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="629.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="608.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="615.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="622.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="601.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="622.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="629.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="636.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="643.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="601.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="622.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="629.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="636.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="643.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="622" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">конец</text>
  <text x="20" y="140" text-anchor="start" class="f-muted" style="font-size:12px">6 перезапусков с одной точки, цифра по мнению судьи</text>
  <text x="96" y="176" text-anchor="end" class="f-ink" style="font-size:12px">с 600</text>
  <rect x="110" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="125.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="115.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="135.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="120.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="130.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="135.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="125.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="130.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="125.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="130.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="135.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="120.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="135.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="140.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="115.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="125.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="135.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="140.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="120.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="125.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="130" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="166" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="181.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="171.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="181.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="171.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="181.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="176.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="181.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="191.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="171.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="176.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="176.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="181.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="186.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="196.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="186" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <rect x="222" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="237.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="232.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="237.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="247.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="227.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="232.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="237.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="242.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="247.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="227.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="237.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="242.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="237.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="242.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="247.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="252.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="237.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="247.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="252.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="232.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="242.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="252.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <text x="242" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="278" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="288.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="303.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="283.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="308.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="288.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="283.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="298.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="283.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="298.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="288.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="298.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="293.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="298.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="298" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <rect x="334" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="349.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="344.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="349.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="354.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="359.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="344.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="359.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="364.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="354.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="359.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="339.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="349.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="339.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="349.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="364.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="349.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="354.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="354" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">7</text>
  <rect x="390" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="415.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="405.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="410.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="395.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="400.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="405.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="405.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="410.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="410.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="410" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <text x="96" y="242" text-anchor="end" class="f-ink" style="font-size:12px">с 450</text>
  <rect x="110" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="115.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="140.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="125.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="130.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="140.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="125.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="140.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="125.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="130.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="135.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="115.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="125.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="130.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="115.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="135.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <text x="130" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="166" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="196.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="171.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="186.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="176.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="181.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="191.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="186.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="191.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="196.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="191.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="191.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="196.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="186.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="191.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="186" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">9</text>
  <rect x="222" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="232.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="237.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="242.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="252.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="247.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="252.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="252.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="237.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="232.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="237.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="247.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="232.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="227.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="237.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="242" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">8</text>
  <rect x="278" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="288.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="298.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="288.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="293.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="303.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="288.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="288.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="293.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="303.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="308.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="303.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="283.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="288.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="298.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="303.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="293.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="298.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="308.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="298" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">9</text>
  <rect x="334" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="349.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="359.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="349.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="359.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="364.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="349.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="359.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="344.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="354.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="354.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="364.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="354.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="349.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="354.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="354" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">7</text>
  <rect x="390" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="415.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="400.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="405.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="410.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="395.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="400.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="415.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="395.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="410.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="415.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="415.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="410.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="415.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <text x="410" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <text x="96" y="308" text-anchor="end" class="f-ink" style="font-size:12px">с 300</text>
  <rect x="110" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="130.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="120.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="125.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="130.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="125.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="135.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="130.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="140.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="120.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="145.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="125.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="135.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="140.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="145.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="130" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="166" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="171.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="181.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="171.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="176.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="186.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="171.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="186.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="176.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="181.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="186.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="191.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="196.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="181.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="191.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="171.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="181.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="186.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="196.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="176.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="181.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="196.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="186" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="222" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="227.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="242.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="227.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="227.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="232.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="237.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="242.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="227.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="247.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="252.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="227.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="252.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="227.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="247.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <text x="242" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="278" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="283.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="293.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="283.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="288.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="298.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="283.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="293.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="298.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="293.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="298.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="303.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="308.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="293.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="283.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="293.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="303.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="298" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="334" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="349.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="354.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="339.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="349.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="359.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="339.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="344.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="349.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="359.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="349.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="354.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="344.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="359.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="359.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="364.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="344.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="354.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="359.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="349.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="364.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="354" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="390" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="395.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="395.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="400.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="405.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="410.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="395.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="405.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="410.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="410.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="400.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="405.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="420.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="405.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="395.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="415.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="420.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <text x="410" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <text x="96" y="374" text-anchor="end" class="f-ink" style="font-size:12px">с 150</text>
  <rect x="110" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="115.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="130.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="115.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="120.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="130.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="115.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="120.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="130.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="125.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="130.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="125.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="130.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="115.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="125.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="140.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="115.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="120.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="140.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="145.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="130" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="166" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="171.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="181.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="186.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="171.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="181.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="186.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="181.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="171.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="181.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="196.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="176.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="196.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="201.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="186" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="222" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="227.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="232.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="237.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="227.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="232.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="247.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="237.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="242.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="242.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="242.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="232.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="242.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="252.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="237.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="252.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="257.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="252.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <text x="242" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="278" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="283.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="283.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="288.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="298.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="288.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="298.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="298.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="298.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="288.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="303.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="308.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="293.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="283.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="298.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="308.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <text x="298" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="334" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="339.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="344.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="349.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="339.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="349.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="354.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="339.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="354.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="354.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="354.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="349.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="354.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="349.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="359.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="339.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="344.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="349.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="369.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="354" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="390" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="395.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="395.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="400.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="410.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="395.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="400.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="405.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="400.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="410.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="410.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="415.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="400.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="420.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="415.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="420.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="425.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="420.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="410" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
</svg>
<figcaption>Вверху: один прогон моей DDPM на цифрах 8×8, x_t на каждом шаге (значения обрезаны до диапазона яркости пикселя). Внизу: 6 перезапусков оставшегося пути со свежим шумом из того же x_t и цифра, которую в конце видит судья. Этот прогон заканчивается цифрой 2.</figcaption>
</figure>

Долгое время они не совпадали. При обратном отсчёте от 1000 на шаге 600 только 11,9% перезапусков заканчиваются той же цифрой, это немногим больше случайного угадывания. Потом всё идёт быстро. К шагу 150 перезапуски совпадают в 90,2% случаев.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля перезапусков, которые заканчиваются той же цифрой, по шагам: 1000 9,3%, 600 11,9%, 500 18,2%, 400 33,4%, 300 57,6%, 200 80,8%, 150 90,2%, 100 95,2%. До шага 500 она держится около случайного уровня и доходит до 90% к шагу 150.">
  <line x1="60.0" y1="214.0" x2="640.0" y2="214.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="218" text-anchor="end" class="f-muted" style="font-size:11px">0%</text>
  <line x1="60.0" y1="114.0" x2="640.0" y2="114.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="118" text-anchor="end" class="f-muted" style="font-size:11px">50%</text>
  <line x1="60.0" y1="14.0" x2="640.0" y2="14.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="18" text-anchor="end" class="f-muted" style="font-size:11px">100%</text>
  <line x1="60.0" y1="214.0" x2="60.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="60" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1000</text>
  <line x1="176.0" y1="214.0" x2="176.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="176" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">800</text>
  <line x1="292.0" y1="214.0" x2="292.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="292" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">600</text>
  <line x1="408.0" y1="214.0" x2="408.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="408" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">400</text>
  <line x1="524.0" y1="214.0" x2="524.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="524" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">200</text>
  <line x1="639.4" y1="214.0" x2="639.4" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="639.42" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1</text>
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">шаг, обратный отсчёт</text>
  <line x1="60.0" y1="194.0" x2="640.0" y2="194.0" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <text x="66" y="189" text-anchor="start" class="f-muted" style="font-size:11px">случайный уровень</text>
  <polyline points="639.4,18.8 610.4,22.1 581.4,28.5 552.4,40.3 523.4,58.9 494.4,84.3 465.4,108.8 436.4,128.7 407.4,145.3 378.4,161.0 349.4,165.2 291.4,180.7 233.4,187.3 175.4,191.5 117.4,193.7 60.0,194.7" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.55"/>
  <polyline points="60.0,195.3 118.0,193.2 176.0,194.9 234.0,192.1 292.0,190.2 350.0,177.6 379.0,169.3 408.0,147.2 437.0,122.0 466.0,98.8 495.0,78.1 524.0,52.3 553.0,33.6 582.0,23.7 611.0,17.3 639.4,14.0" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="195.3" r="3" style="fill:var(--accent)"/>
  <circle cx="118.0" cy="193.2" r="3" style="fill:var(--accent)"/>
  <circle cx="176.0" cy="194.9" r="3" style="fill:var(--accent)"/>
  <circle cx="234.0" cy="192.1" r="3" style="fill:var(--accent)"/>
  <circle cx="292.0" cy="190.2" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="177.6" r="3" style="fill:var(--accent)"/>
  <circle cx="379.0" cy="169.3" r="3" style="fill:var(--accent)"/>
  <circle cx="408.0" cy="147.2" r="3" style="fill:var(--accent)"/>
  <circle cx="437.0" cy="122.0" r="3" style="fill:var(--accent)"/>
  <circle cx="466.0" cy="98.8" r="3" style="fill:var(--accent)"/>
  <circle cx="495.0" cy="78.1" r="3" style="fill:var(--accent)"/>
  <circle cx="524.0" cy="52.3" r="3" style="fill:var(--accent)"/>
  <circle cx="553.0" cy="33.6" r="3" style="fill:var(--accent)"/>
  <circle cx="582.0" cy="23.7" r="3" style="fill:var(--accent)"/>
  <circle cx="611.0" cy="17.3" r="3" style="fill:var(--accent)"/>
  <circle cx="639.4" cy="14.0" r="3" style="fill:var(--accent)"/>
  <line x1="60.0" y1="272.0" x2="86.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">перезапуски дают ту же цифру</text>
  <line x1="390.0" y1="272.0" x2="416.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.55"/>
  <text x="424" y="276" text-anchor="start" class="f-ink" style="font-size:12px">судья на зашумлённых настоящих</text>
</svg>
<figcaption>200 генераций, по 10 перезапусков с каждого из 16 шагов. Вторая линия это судья на 450 отложенных цифрах, зашумлённых до того же шага, среднее по 10 вариантам шума.</figcaption>
</figure>

Получается, первые 400 шагов почти ничего не делают для выбора цифры. Между шагом 400 и шагом 150, то есть за четверть пути, доля совпадений растёт с трети до 90%. До прогона я записал именно этот результат как тот, что опровергнет мою "медленно проявляющуюся фотографию". Так и вышло. Ho et al. в своей статье пишут почти то же: крупные черты появляются первыми, детали последними. Я читал это предложение и всё равно продолжал рассказывать про ванночку.

## Слишком хорошо

Сэмплы выглядели очень хорошо. Читаемым я считаю сэмпл, в цифре которого судья уверен хотя бы на 90%. Таких 87,4%. Среди 450 настоящих отложенных цифр таких 84,7%.

Минуту я был доволен, а потом это меня насторожило. Я взял каждый из 2000 сэмплов и нашёл ближайшую обучающую цифру. То же самое я сделал для настоящих отложенных цифр, которых модель по построению не видела. Ни одна отложенная цифра не подходит к обучающей ближе, чем на 1,008.

999 сэмплов из 2000 ближе этой границы. Это копии 677 разных обучающих цифр. В медиане копия отличается от оригинала меньше чем на половину уровня яркости на пиксель. Типичный сэмпл вдвое ближе к своей ближайшей обучающей цифре, чем типичная настоящая отложенная.

По читаемости копии и остальные тоже расходятся. Среди копий читаемых 90,0%, среди остальных 84,8%, почти как у настоящих отложенных цифр.

Не знаю, говорит ли это что-то о больших моделях. Когда картинок 1347, а параметров 2,5 миллиона, запоминание должно даваться легко. К тому же обучение шло 60 000 шагов.

## Меньше шагов

Октябрьская статья про DDIM показывает, что обученная DDPM может генерировать за гораздо меньшее число шагов. Там сэмплер записан с параметром η. При η 1 это случайный сэмплер в духе DDPM. Новый сэмплер DDIM соответствует η 0. Шума он не добавляет. Я попробовал оба с пропуском шагов.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля читаемых и скопированных сэмплов в зависимости от числа шагов: 10: читаемые, η 1 66,4%, читаемые, η 0 (DDIM) 66,6%, копии, η 1 2,4%; 20: читаемые, η 1 78,7%, читаемые, η 0 (DDIM) 74,9%, копии, η 1 13,8%; 50: читаемые, η 1 86,6%, читаемые, η 0 (DDIM) 80,8%, копии, η 1 31,8%; 100: читаемые, η 1 86,6%, читаемые, η 0 (DDIM) 81,8%, копии, η 1 41,8%; 250: читаемые, η 1 87,8%, читаемые, η 0 (DDIM) 82,3%, копии, η 1 48,5%; 1000: читаемые, η 1 88,9%, читаемые, η 0 (DDIM) 82,8%, копии, η 1 52,7%.">
  <line x1="60.0" y1="214.0" x2="640.0" y2="214.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="218" text-anchor="end" class="f-muted" style="font-size:11px">0%</text>
  <line x1="60.0" y1="114.0" x2="640.0" y2="114.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="118" text-anchor="end" class="f-muted" style="font-size:11px">50%</text>
  <line x1="60.0" y1="14.0" x2="640.0" y2="14.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="18" text-anchor="end" class="f-muted" style="font-size:11px">100%</text>
  <line x1="60.0" y1="214.0" x2="60.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="60" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">10</text>
  <line x1="147.3" y1="214.0" x2="147.3" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="147.29869874255456" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">20</text>
  <line x1="262.7" y1="214.0" x2="262.7" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="262.7013012574455" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">50</text>
  <line x1="350.0" y1="214.0" x2="350.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="350" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">100</text>
  <line x1="465.4" y1="214.0" x2="465.4" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="465.40260251489093" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">250</text>
  <line x1="640.0" y1="214.0" x2="640.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="640" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1000</text>
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">число шагов генерации</text>
  <line x1="60.0" y1="44.7" x2="640.0" y2="44.7" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:2 3"/>
  <text x="66" y="38.66666666666666" text-anchor="start" class="f-muted" style="font-size:11px">настоящие отложенные 84,7%</text>
  <polyline points="60.0,81.2 147.3,56.6 262.7,40.8 350.0,40.9 465.4,38.5 640.0,36.1" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="81.2" r="3" style="fill:var(--accent)"/>
  <circle cx="147.3" cy="56.6" r="3" style="fill:var(--accent)"/>
  <circle cx="262.7" cy="40.8" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="40.9" r="3" style="fill:var(--accent)"/>
  <circle cx="465.4" cy="38.5" r="3" style="fill:var(--accent)"/>
  <circle cx="640.0" cy="36.1" r="3" style="fill:var(--accent)"/>
  <polyline points="60.0,80.7 147.3,64.3 262.7,52.3 350.0,50.3 465.4,49.3 640.0,48.4" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.6"/>
  <circle cx="60.0" cy="80.7" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="147.3" cy="64.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="262.7" cy="52.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="350.0" cy="50.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="465.4" cy="49.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="640.0" cy="48.4" r="3" style="fill:var(--ink);opacity:.6"/>
  <polyline points="60.0,209.3 147.3,186.5 262.7,150.5 350.0,130.4 465.4,117.0 640.0,108.6" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="60.0" cy="209.3" r="3" style="fill:var(--accent)"/>
  <circle cx="147.3" cy="186.5" r="3" style="fill:var(--accent)"/>
  <circle cx="262.7" cy="150.5" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="130.4" r="3" style="fill:var(--accent)"/>
  <circle cx="465.4" cy="117.0" r="3" style="fill:var(--accent)"/>
  <circle cx="640.0" cy="108.6" r="3" style="fill:var(--accent)"/>
  <line x1="60.0" y1="272.0" x2="86.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">читаемые, η 1</text>
  <line x1="260.0" y1="272.0" x2="286.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.6"/>
  <text x="294" y="276" text-anchor="start" class="f-ink" style="font-size:12px">читаемые, η 0 (DDIM)</text>
  <line x1="480.0" y1="272.0" x2="506.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="514" y="276" text-anchor="start" class="f-ink" style="font-size:12px">копии, η 1</text>
</svg>
<figcaption>2000 сэмплов на точку. Читаемый значит, что судья уверен хотя бы на 90%. Копия это сэмпл, который ближе к обучающей цифре, чем любая из 450 отложенных (расстояние 1,008).</figcaption>
</figure>

При η 1 за 50 шагов читаемых 86,6% против 89,0% за все 1000 шагов того же сэмплера. А 2000 сэмплов занимают 6 секунд вместо 132. Шум у него чуть меньше, чем у Ho et al., так что это другой сэмплер, не тот, что дал 87,4% выше. На 10 шагах читаемость падает до 66,4%. Читаемость у сэмплера DDIM ниже при любом числе шагов больше 10, например 80,9% на 50 шагах. Он остаётся ниже даже на 1000 шагах. Для CIFAR-10 статья про DDIM сообщает обратное. Может быть, дело в линейном судье или в картинках 8 на 8. Внятного объяснения у меня нет.

Доля копий тоже менялась. Сэмплер с η 1 копирует примерно половину сэмплов на 1000 шагах и только 2,4% на 10 шагах. Читаемость и копирование растут вместе, поэтому я подозреваю, что короткий сэмплер выглядит чуть хуже отчасти потому, что реже воспроизводит запомненное. Отдельно я это не проверял.

## Что я не проверял

Модель я обучил только один раз. На 3 сидах генерации полный сэмплер дал от 87,4% до 89,2% читаемых, так что разница меньше 2 пунктов это шум. Чекпойнты я не сохранял и не могу сказать, когда во время обучения началось копирование. Сеть это MLP, судья линейный. Ho et al. разветвляли цепочку на лицах CelebA. Сэмплы, разветвлённые с шага 750, уже совпадали по позе и цвету волос. Значит, на лицах размером 256 на 256 решение, похоже, начинается гораздо раньше, чем на моих цифрах. Ничего больше 8 на 8 я не пробовал.
