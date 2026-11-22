---
title: "Як дыфузійная мадэль выбірае лічбу з шуму"
description: "Я навучыў маленькую DDPM на лічбах 8 на 8, каб паглядзець, як з шуму з'яўляецца малюнак. Першыя 400 крокаў з 1000 амаль не выбіраюць лічбу, а палова сэмплаў аказалася копіямі навучальных лічбаў."
date: 2021-01-16
lang: be
translationKey: diffusion-from-noise
tags: ["machine-learning", "statistics"]
---
З таго часу як мінулым летам выйшаў артыкул пра DDPM, я тлумачыў дыфузійныя мадэлі ўсім аднолькава. Пачынаеш з чыстага шуму і кожны крок прыбірае яго патроху. Праз 1000 крокаў атрымліваецца малюнак, прыкладна як фотаздымак, які павольна праступае ў ванначцы з праяўніком. Гучыць праўдападобна і ніхто не спрачаўся. Але сам я такую мадэль ні разу не навучаў, таму не ведаў, ці праўда гэта, асабліва слова "павольна".

І я навучыў яе на самых маленькіх малюнках, якія змог знайсці. Потым паглядзеў, што адбываецца ўнутры.

## Умовы

GPU тут няма, толькі 4 ядры воблачнай машыны, так што і даныя давялося браць малюсенькія. У `scikit-learn` ёсць набор з 1797 рукапісных лічбаў памерам 8 на 8 пікселяў. Яркасць кожнага пікселя ад 0 да 16. 1347 лічбаў я ўзяў для навучання, 450 адклаў. Мадэль я стараўся трымаць як мага бліжэй да Ho et al.: 1000 крокаў, шум дадаецца па лінейным раскладзе ад 0,0001 да 0,02. Сетка глядзіць на зашумлены малюнак і адгадвае шум. У Ho et al. гэта U-Net. Я ўзяў звычайны MLP на 2,5 мільёна параметраў, бо малюнкі зусім маленькія. Працаваў на Python 3.8, PyTorch 1.7.1 і `scikit-learn` 0.24. Навучанне ішло 60 000 крокаў і заняло 64 хвіліны.

Яшчэ мне трэба было нешта, што кажа, якая лічба на малюнку, каб не разглядаць тысячы малюнкаў самому. Гэта робіць лагістычная рэгрэсія, навучаная на тых самых 1347 лічбах. На 450 адкладзеных яна мае рацыю ў 97,6% выпадкаў. Далей я называю яе суддзёй.

## Дадаём шум

Гэта просты кірунак, тут адна формула. Пасля t крокаў малюнак гэта ўзважаная сума арыгінала і свежага шуму. Вагі вядомыя загадзя. На кроку 500 вага арыгінала 0,28, вага шуму 0,96. На кроку 1000 вага арыгінала падае да 0,006.

Суддзя бачыць тое самае. На зашумленых версіях 450 адкладзеных лічбаў ён мае рацыю ў 52,6% выпадкаў на кроку 300. На кроку 1000 ён мае рацыю ў 9,6% выпадкаў, а гэта выпадковае адгадванне пры 10 класах. Да гэтага месца ўсё было так, як я чакаў.

## Генерацыя

Потым я пачаў генераваць. Я хацеў даведацца, на якім кроку мадэль вырашае, што малюе двойку, а не сямёрку.

Я запусціў 200 генерацый ад шуму да канца і захаваў кожную ў 16 кропках па дарозе. Потым з кожнай захаванай кропкі я 10 разоў перазапускаў астатні шлях са свежым выпадковым шумам. Суддзя казаў, ці скончыўся перазапуск той самай лічбай, што і зыходны прагон. Калі на гэтым кроку лічба ўжо выбраная, перазапускі павінны супадаць.

<figure class="fig">
<svg viewBox="0 0 680 416" role="img" aria-label="Адна генерацыя лічбы на кроках 1000, 600, 450, 350, 300, 250, 150 і ў канцы, дзе гэта 2. Перазапускі з той самай кропкі: з 600: 3, 1, 3, 1, 7, 1; з 450: 3, 9, 8, 9, 7, 1; з 300: 2, 3, 2, 2, 3, 2; з 150: 2, 2, 2, 2, 2, 2.">
  <text x="20" y="16" text-anchor="start" class="f-muted" style="font-size:12px">адна генерацыя, ад шуму да канца</text>
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
  <text x="48" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 1000</text>
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
  <text x="130" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 600</text>
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
  <text x="212" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 450</text>
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
  <text x="294" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 350</text>
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
  <text x="376" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 300</text>
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
  <text x="458" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 250</text>
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
  <text x="540" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">крок 150</text>
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
  <text x="622" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">канец</text>
  <text x="20" y="140" text-anchor="start" class="f-muted" style="font-size:12px">6 перазапускаў з адной кропкі, лічба на думку суддзі</text>
  <text x="96" y="176" text-anchor="end" class="f-ink" style="font-size:12px">з 600</text>
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
  <text x="96" y="242" text-anchor="end" class="f-ink" style="font-size:12px">з 450</text>
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
  <text x="96" y="308" text-anchor="end" class="f-ink" style="font-size:12px">з 300</text>
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
  <text x="96" y="374" text-anchor="end" class="f-ink" style="font-size:12px">з 150</text>
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
<figcaption>Зверху: адзін прагон маёй DDPM на лічбах 8×8, x_t на кожным кроку (абрэзана да дыяпазону пікселя). Знізу: 6 перазапускаў астатняга шляху са свежым шумам з таго самага x_t і лічба, якую ў канцы бачыць суддзя. Гэты прагон заканчваецца лічбай 2.</figcaption>
</figure>

Доўгі час яны не супадалі. Пры адваротным адліку ад 1000 на кроку 600 толькі 11,9% перазапускаў заканчваюцца той самай лічбай, гэта ненашмат больш за выпадковае адгадванне. Потым усё ідзе хутка. Да кроку 150 перазапускі супадаюць у 90,2% выпадкаў.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля перазапускаў, якія заканчваюцца той самай лічбай, па кроках: 1000 9,3%, 600 11,9%, 500 18,2%, 400 33,4%, 300 57,6%, 200 80,8%, 150 90,2%, 100 95,2%. Да кроку 500 яна трымаецца каля выпадковага ўзроўню і даходзіць да 90% да кроку 150.">
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
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">крок, адваротны адлік</text>
  <line x1="60.0" y1="194.0" x2="640.0" y2="194.0" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <text x="66" y="189" text-anchor="start" class="f-muted" style="font-size:11px">выпадковы ўзровень</text>
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
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">перазапускі даюць тую самую лічбу</text>
  <line x1="390.0" y1="272.0" x2="416.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.55"/>
  <text x="424" y="276" text-anchor="start" class="f-ink" style="font-size:12px">суддзя на зашумленых сапраўдных</text>
</svg>
<figcaption>200 генерацый, па 10 перазапускаў з кожнага з 16 крокаў. Другая лінія гэта суддзя на 450 адкладзеных лічбах, зашумленых да таго самага кроку, сярэдняе па 10 варыянтах шуму.</figcaption>
</figure>

Атрымліваецца, першыя 400 крокаў амаль нічога не робяць для выбару лічбы. Паміж крокам 400 і крокам 150, гэта значыць за чвэрць шляху, доля супадзенняў расце ад трэці да 90%. Да прагону я запісаў менавіта гэты вынік як той, што абвергне мой "фотаздымак, які павольна праяўляецца". Так і выйшла. Ho et al. у сваім артыкуле пішуць амаль тое самае: буйныя рысы з'яўляюцца першымі, дэталі апошнімі. Я чытаў гэты сказ і ўсё роўна працягваў распавядаць пра ванначку.

## Занадта добра

Сэмплы выглядалі вельмі добра. Чытэльным я лічу сэмпл, у лічбе якога суддзя ўпэўнены хаця б на 90%. Такіх 87,4%. Для 450 сапраўдных адкладзеных лічбаў той самы паказчык 84,7%.

Хвіліну я быў задаволены, а потым гэта мяне насцярожыла. Я ўзяў кожны з 2000 сэмплаў і знайшоў бліжэйшую навучальную лічбу. Тое самае я зрабіў для сапраўдных адкладзеных лічбаў, якіх мадэль заведама не бачыла. Найменшая адлегласць ад адкладзенай лічбы да навучальнай 1,008.

999 сэмплаў з 2000 ляжаць бліжэй. Гэта копіі 677 розных навучальных лічбаў з медыяннай розніцай меншай за палову ўзроўню яркасці на піксель. Адлегласць ад тыповага сэмпла да бліжэйшай навучальнай лічбы ўдвая меншая, чым у тыповай сапраўднай адкладзенай.

Па чытэльнасці копіі і астатнія таксама разыходзяцца. Сярод копій чытэльных 90,0%, сярод астатніх 84,8%, амаль столькі ж, колькі ў сапраўдных адкладзеных лічбаў.

Не ведаю, ці кажа гэта нешта пра вялікія мадэлі. Пры 1347 малюнках і 2,5 мільёна параметраў я б чакаў, што запомніць іх лёгка. Да таго ж я навучаў яе 60 000 крокаў.

## Менш крокаў

Артыкул пра DDIM, які выйшаў у кастрычніку, паказвае, што навучаная DDPM можа генераваць за значна меншую колькасць крокаў. Там сэмплер запісаны з параметрам η. Пры η 1 гэта выпадковы сэмплер у духу DDPM. Новы сэмплер DDIM адпавядае η 0. Шуму ён не дадае. Я паспрабаваў абодва з пропускам крокаў.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля чытэльных і скапіраваных сэмплаў у залежнасці ад колькасці крокаў: 10: чытэльныя, η 1 66,4%, чытэльныя, η 0 (DDIM) 66,6%, копіі, η 1 2,4%; 20: чытэльныя, η 1 78,7%, чытэльныя, η 0 (DDIM) 74,9%, копіі, η 1 13,8%; 50: чытэльныя, η 1 86,6%, чытэльныя, η 0 (DDIM) 80,8%, копіі, η 1 31,8%; 100: чытэльныя, η 1 86,6%, чытэльныя, η 0 (DDIM) 81,8%, копіі, η 1 41,8%; 250: чытэльныя, η 1 87,8%, чытэльныя, η 0 (DDIM) 82,3%, копіі, η 1 48,5%; 1000: чытэльныя, η 1 88,9%, чытэльныя, η 0 (DDIM) 82,8%, копіі, η 1 52,7%.">
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
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">колькасць крокаў генерацыі</text>
  <line x1="60.0" y1="44.7" x2="640.0" y2="44.7" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:2 3"/>
  <text x="66" y="38.66666666666666" text-anchor="start" class="f-muted" style="font-size:11px">сапраўдныя адкладзеныя 84,7%</text>
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
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">чытэльныя, η 1</text>
  <line x1="260.0" y1="272.0" x2="286.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.6"/>
  <text x="294" y="276" text-anchor="start" class="f-ink" style="font-size:12px">чытэльныя, η 0 (DDIM)</text>
  <line x1="480.0" y1="272.0" x2="506.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="514" y="276" text-anchor="start" class="f-ink" style="font-size:12px">копіі, η 1</text>
</svg>
<figcaption>2000 сэмплаў на кропку. Чытэльны значыць, што суддзя ўпэўнены хаця б на 90%. Копія гэта сэмпл, які бліжэй да навучальнай лічбы, чым любая з 450 адкладзеных (адлегласць 1,008).</figcaption>
</figure>

Пры η 1 за 50 крокаў чытэльных 86,6% супраць 89,0% за ўсе 1000 крокаў таго самага сэмплера. 2000 сэмплаў пры гэтым генеруюцца за 6 секунд замест 132. Шум у яго крыху меншы, чым у Ho et al., так што гэта іншы сэмплер, не той, што даў 87,4% вышэй. На 10 кроках чытэльнасць падае да 66,4%. Сэмплер DDIM даваў менш чытэльных на любой колькасці крокаў больш за 10, напрыклад 80,9% на 50 кроках. Ён застаецца ніжэй нават на 1000 кроках. Для CIFAR-10 артыкул пра DDIM паведамляе адваротнае. Магчыма, справа ў лінейным суддзі або ў малюнках 8 на 8. Выразнага тлумачэння ў мяне няма.

Доля копій таксама мянялася. Сэмплер з η 1 капіруе прыкладна палову сэмплаў на 1000 кроках і толькі 2,4% на 10 кроках. Чытэльнасць і капіраванне растуць разам, таму я падазраю, што кароткі сэмплер выглядае крыху горш часткова таму, што радзей узнаўляе запомненае. Асобна я гэта не правяраў.

## Што я не правяраў

Мадэль я навучыў толькі адзін раз. На 3 сідах генерацыі поўны сэмплер даў ад 87,4% да 89,2% чытэльных, так што розніца меншая за 2 працэнтныя пункты гэта шум. Чэкпойнты я не захоўваў і не магу сказаць, калі падчас навучання пачалося капіраванне. Сетка гэта MLP, суддзя лінейны. Ho et al. расшчаплялі ланцужок на тварах CelebA. Сэмплы, расшчэпленыя на кроку 750, ужо супадалі па позе і колеры валасоў. Значыць, на тварах памерам 256 на 256 рашэнне, падобна, пачынаецца значна раней, чым на маіх лічбах. Нічога большага за 8 на 8 я не спрабаваў.
