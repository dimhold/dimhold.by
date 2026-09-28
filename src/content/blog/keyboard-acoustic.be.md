---
title: "Просты класіфікатар назваў клавішу па гуку 99 разоў са 100. Навучаны на цішыні паміж націскамі, ён усё роўна назваў яе 39 разоў"
description: "Я ўзяў адкрытыя датасэты націскаў, на якіх стаіць загаловак пра 95%, і простую лагістычную рэгрэсію. Яна назвала клавішу ў 92–99 выпадках са 100, але тая ж мадэль, навучаная на цішыні паміж націскамі, усё роўна называла яе да 39 разоў са 100. Кожная клавіша ў гэтых наборах ляжыць сваім файлам. На паролях, дзе файл не дапамагае, выйшла 77 са 100. Іншы запіс таго ж MacBook апусціў вынік да 5 або 6%."
date: 2026-09-27
lang: be
translationKey: keyboard-acoustic
tags: ["machine-learning", "open-data"]
---
Лік, які сядзіць у мяне ў галаве пра гук клавіятуры, гэта 95%. У 2023 годзе Харысан, Тарэіні і Мехрнежад паклалі iPhone побач з MacBook Pro і навучылі нейрасетку на гуку клавіш. Яна адгадала 95% націскаў і 93% на запісе Zoom, зробленым праз мікрафон самога ноўтбука. У 2025 годзе Спата з суаўтарамі атрымалі 98,3% на тых жа даных MacBook, потым запісалі механічную клавіятуру і паведамілі пра 99% на ёй. У мяне ёсць невялікі інструмент earshot, ён слухае мікрафон і ператварае гаворку ў тэкст. Той жа мікрафон чуе кожную клавішу, якую я націскаю. Пра 95% я чытаў некалькі разоў і ні разу не спытаў, на чым менавіта гэта мералі. Абодва датасэты адкрытыя пад ліцэнзіяй MIT, таму гэтым разам я іх спампаваў і паглядзеў.

## Абстаноўка

Абодва наборы ўладкаваныя аднолькава. 36 клавіш, лічбы і літары. Кожная клавіша запісаная ў асобны файл WAV, у ім 25 націскаў запар прыкладна раз на секунду. У Харысана 2 запісы аднаго і таго ж MacBook. Адзін зроблены тэлефонам, які ляжаў на сурвэтцы з мікрафібры, другі праз Zoom на 32 кГц з шумапрыглушэннем на мінімуме. Набор KAD ад Спаты гэта механічная клавіятура і смартфон за 17 см ад яе, плюс 10 пароляў, набраных клавіша за клавішай, кожны сваім запісам.

Я хацеў паглядзець, на што здольная простая мадэль, таму без глыбокай сеткі. Python 3.12, numpy 2.5.3, scipy 1.18.1, `scikit-learn` 1.9.0 на 4 ядрах. Кожны націск выразаецца па парогу энергіі, які падладжваецца, пакуль у файле не знойдзецца роўна 25 націскаў. Потым 330 мс гуку ператвараюцца ў лагарыфмічную мел-спектраграму з 64 паласамі і на яе глядзіць лагістычная рэгрэсія. Выпадковае адгадванне пры 36 клавішах дае 2,8%.

Для праверкі я дзяліў націскі па іх месцы ў файле: націскі з 0 па 4 у адным блоку, з 5 па 9 у наступным і гэтак далей. Выпадковае разбіццё адправіла б у навучанне суседзяў па часе для большасці тэставых націскаў. Тут сусед у навучанні ёсць толькі ў націскаў на краі блока.

Выйшла 92,4% на MacBook праз тэлефон, 84,6% праз Zoom і 99,3% на механічнай клавіятуры. Лінейная мадэль без аўгментацыі была не далей чым за 3 пункты ад сеткі Харысана на запісе з тэлефона. На механічнай клавіятуры яна зраўнялася з 99% у Спаты. Гэтага я не чакаў. На Zoom яна адстала на 8 пунктаў. На запісе з тэлефона Спата з суаўтарамі атрымалі 98,3%, на 6 пунктаў больш за мяне. У артыкулах даныя дзялілі інакш, так што параўнанне грубае.

## Дзе я перастаў верыць

Потым я яшчэ раз паглядзеў, як уладкаваныя файлы, і мяне гэта насцярожыла. Кожная клавіша жыве ў сваім запісе. Дапусцім, тэлефон крыху зрушыўся паміж запісам `a` і запісам `b`. Тады класіфікатар можа вывучыць файл замест клавішы. Праверка вышэй гэтага не заўважыць, бо тэставыя націскі бяруцца з тых жа файлаў.

Таму я навучыў тую ж мадэль на цішыні. Ад кожнага націску я ўзяў 200 мс, якія пачынаюцца праз 400 мс пасля яго. Гук там ужо на 24–36 дБ цішэйшы за націск. І спытаў, якой клавішы належыць гэты кавалак цішыні. На MacBook праз тэлефон цішыня назвала клавішу ў 29,4% выпадкаў, праз Zoom у 16,1%, на механічнай клавіятуры ў 39,4%. Гэта ў 6–14 разоў больш за выпадковае адгадванне.

Аднаго толькі запісу, без самога націску, хапае, каб назваць клавішу. Класіфікатар на націсках, магчыма, таксама гэтым карыстаецца. Наколькі, па гэтых файлах я сказаць не магу.

<figure class="fig">
<svg viewBox="0 0 640 246" role="img" aria-label="Гарызантальныя паласы, доля націскаў, дзе лагістычная рэгрэсія назвала клавішу правільна, выпадковае адгадванне 2,8%. MacBook Pro праз iPhone: націск 92,4%, цішыня паміж націскамі 29,4%. MacBook Pro праз Zoom: націск 84,6%, цішыня 16,1%. Механічная клавіятура: націск 99,3%, цішыня 39,4%, націскі ўнутры пароляў, набраных клавіша за клавішай, 77%.">
  <text x="12" y="16" class="f-label f-muted">доля націскаў, дзе клавіша названа правільна</text>
  <text x="12" y="51" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="66" class="f-label f-muted">iPhone побач</text>
  <text x="242" y="51" text-anchor="end" class="f-label f-muted">націск</text>
  <rect x="250" y="40" width="277.3" height="14" class="f-box"/>
  <text x="533.3" y="51" class="f-mono f-ink">92,4%</text>
  <text x="242" y="71" text-anchor="end" class="f-label f-muted">толькі цішыня</text>
  <rect x="250" y="60" width="88.2" height="14" class="f-plain"/>
  <text x="344.2" y="71" class="f-mono f-ink">29,4%</text>
  <text x="12" y="109" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="124" class="f-label f-muted">запіс Zoom</text>
  <text x="242" y="109" text-anchor="end" class="f-label f-muted">націск</text>
  <rect x="250" y="98" width="253.7" height="14" class="f-box"/>
  <text x="509.7" y="109" class="f-mono f-ink">84,6%</text>
  <text x="242" y="129" text-anchor="end" class="f-label f-muted">толькі цішыня</text>
  <rect x="250" y="118" width="48.3" height="14" class="f-plain"/>
  <text x="304.3" y="129" class="f-mono f-ink">16,1%</text>
  <text x="12" y="167" class="f-mono f-ink">механічная</text>
  <text x="12" y="182" class="f-label f-muted">тэлефон за 17 см</text>
  <text x="242" y="167" text-anchor="end" class="f-label f-muted">націск</text>
  <rect x="250" y="156" width="298.0" height="14" class="f-box"/>
  <text x="554.0" y="167" class="f-mono f-ink">99,3%</text>
  <text x="242" y="187" text-anchor="end" class="f-label f-muted">толькі цішыня</text>
  <rect x="250" y="176" width="118.3" height="14" class="f-plain"/>
  <text x="374.3" y="187" class="f-mono f-ink">39,4%</text>
  <text x="242" y="207" text-anchor="end" class="f-label f-muted">паролі</text>
  <rect x="250" y="196" width="231.0" height="14" class="f-accent"/>
  <text x="487.0" y="207" class="f-mono f-ink">77%</text>
  <line x1="258.3" y1="34" x2="258.3" y2="224" class="f-line" stroke-dasharray="3 3"/>
  <text x="258.3" y="238" text-anchor="middle" class="f-label f-muted">наўздагад 2,8%</text>
</svg>
<figcaption>Цішыня гэта 200 мс, якія пачынаюцца праз 400 мс пасля націску, калі гук націску амаль заціх. Кожная клавіша ў гэтых датасэтах ляжыць сваім файлам, таму цішыня, хутчэй за ўсё, называе клавішу праз запіс. Паролі гэта 100 націскаў унутры 10 слоў, праверка, дзе файл дапамагчы не можа.</figcaption>
</figure>

Паролі KAD гэта праверка, у якой файл дапамагчы не можа. Там клавішы ідуць адна за адной унутры аднаго запісу. Я навучыў мадэль на ўсіх 900 націсках з файлаў клавіш і праверыў на 100 націсках унутры 10 пароляў. Колькі сімвалаў у кожным паролі, я загадзя паведаміў праграме, якая выразае націскі. Правільнымі аказаліся 77 са 100. У 93 са 100 правільная клавіша была ў першай пяцёрцы. Цалкам адгадаўся 1 пароль з 10, `baseball47`. Горш за ўсіх выйшаў `position90`, пачуты як `ppsvtnpk00`.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Табліца з 10 пароляў KAD, побач з кожным набраным паролем тое, што пачуў класіфікатар, няправільныя сімвалы вылучаныя: baseball47 baseball47, cultural12 cultural10, fragrant34 fralrant34, friendly56 fzkendly56, grateful10 lznzeful10, hardship38 hardshil37, ideology78 idelkpgy73, nominate29 nominatex9, position90 ppsvtnpk00, suppress56 supnresx56. Правільна 77 сімвалаў з 100, у першай пяцёрцы 93 з 100.">
  <text x="12" y="16" class="f-label f-muted">паролі KAD: што набрана і што пачута</text>
  <text x="60" y="38" class="f-label f-muted">набрана</text>
  <text x="230" y="38" class="f-label f-muted">пачута</text>
  <text x="440" y="38" text-anchor="end" class="f-label f-muted">правільна</text>
  <text x="540" y="38" text-anchor="end" class="f-label f-muted">у пяцёрцы</text>
  <text x="60" y="63" class="f-mono f-ink">b</text>
  <text x="72" y="63" class="f-mono f-ink">a</text>
  <text x="84" y="63" class="f-mono f-ink">s</text>
  <text x="96" y="63" class="f-mono f-ink">e</text>
  <text x="108" y="63" class="f-mono f-ink">b</text>
  <text x="120" y="63" class="f-mono f-ink">a</text>
  <text x="132" y="63" class="f-mono f-ink">l</text>
  <text x="144" y="63" class="f-mono f-ink">l</text>
  <text x="156" y="63" class="f-mono f-ink">4</text>
  <text x="168" y="63" class="f-mono f-ink">7</text>
  <text x="230" y="63" class="f-mono f-muted">b</text>
  <text x="242" y="63" class="f-mono f-muted">a</text>
  <text x="254" y="63" class="f-mono f-muted">s</text>
  <text x="266" y="63" class="f-mono f-muted">e</text>
  <text x="278" y="63" class="f-mono f-muted">b</text>
  <text x="290" y="63" class="f-mono f-muted">a</text>
  <text x="302" y="63" class="f-mono f-muted">l</text>
  <text x="314" y="63" class="f-mono f-muted">l</text>
  <text x="326" y="63" class="f-mono f-muted">4</text>
  <text x="338" y="63" class="f-mono f-muted">7</text>
  <text x="440" y="63" text-anchor="end" class="f-mono f-ink">10/10</text>
  <text x="540" y="63" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="84" class="f-mono f-ink">c</text>
  <text x="72" y="84" class="f-mono f-ink">u</text>
  <text x="84" y="84" class="f-mono f-ink">l</text>
  <text x="96" y="84" class="f-mono f-ink">t</text>
  <text x="108" y="84" class="f-mono f-ink">u</text>
  <text x="120" y="84" class="f-mono f-ink">r</text>
  <text x="132" y="84" class="f-mono f-ink">a</text>
  <text x="144" y="84" class="f-mono f-ink">l</text>
  <text x="156" y="84" class="f-mono f-ink">1</text>
  <text x="168" y="84" class="f-mono f-ink">2</text>
  <text x="230" y="84" class="f-mono f-muted">c</text>
  <text x="242" y="84" class="f-mono f-muted">u</text>
  <text x="254" y="84" class="f-mono f-muted">l</text>
  <text x="266" y="84" class="f-mono f-muted">t</text>
  <text x="278" y="84" class="f-mono f-muted">u</text>
  <text x="290" y="84" class="f-mono f-muted">r</text>
  <text x="302" y="84" class="f-mono f-muted">a</text>
  <text x="314" y="84" class="f-mono f-muted">l</text>
  <text x="326" y="84" class="f-mono f-muted">1</text>
  <rect x="336" y="71" width="12" height="17" class="f-box"/>
  <text x="338" y="84" class="f-mono f-accent">0</text>
  <text x="440" y="84" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="84" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="105" class="f-mono f-ink">f</text>
  <text x="72" y="105" class="f-mono f-ink">r</text>
  <text x="84" y="105" class="f-mono f-ink">a</text>
  <text x="96" y="105" class="f-mono f-ink">g</text>
  <text x="108" y="105" class="f-mono f-ink">r</text>
  <text x="120" y="105" class="f-mono f-ink">a</text>
  <text x="132" y="105" class="f-mono f-ink">n</text>
  <text x="144" y="105" class="f-mono f-ink">t</text>
  <text x="156" y="105" class="f-mono f-ink">3</text>
  <text x="168" y="105" class="f-mono f-ink">4</text>
  <text x="230" y="105" class="f-mono f-muted">f</text>
  <text x="242" y="105" class="f-mono f-muted">r</text>
  <text x="254" y="105" class="f-mono f-muted">a</text>
  <rect x="264" y="92" width="12" height="17" class="f-box"/>
  <text x="266" y="105" class="f-mono f-accent">l</text>
  <text x="278" y="105" class="f-mono f-muted">r</text>
  <text x="290" y="105" class="f-mono f-muted">a</text>
  <text x="302" y="105" class="f-mono f-muted">n</text>
  <text x="314" y="105" class="f-mono f-muted">t</text>
  <text x="326" y="105" class="f-mono f-muted">3</text>
  <text x="338" y="105" class="f-mono f-muted">4</text>
  <text x="440" y="105" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="105" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="126" class="f-mono f-ink">f</text>
  <text x="72" y="126" class="f-mono f-ink">r</text>
  <text x="84" y="126" class="f-mono f-ink">i</text>
  <text x="96" y="126" class="f-mono f-ink">e</text>
  <text x="108" y="126" class="f-mono f-ink">n</text>
  <text x="120" y="126" class="f-mono f-ink">d</text>
  <text x="132" y="126" class="f-mono f-ink">l</text>
  <text x="144" y="126" class="f-mono f-ink">y</text>
  <text x="156" y="126" class="f-mono f-ink">5</text>
  <text x="168" y="126" class="f-mono f-ink">6</text>
  <text x="230" y="126" class="f-mono f-muted">f</text>
  <rect x="240" y="113" width="12" height="17" class="f-box"/>
  <text x="242" y="126" class="f-mono f-accent">z</text>
  <rect x="252" y="113" width="12" height="17" class="f-box"/>
  <text x="254" y="126" class="f-mono f-accent">k</text>
  <text x="266" y="126" class="f-mono f-muted">e</text>
  <text x="278" y="126" class="f-mono f-muted">n</text>
  <text x="290" y="126" class="f-mono f-muted">d</text>
  <text x="302" y="126" class="f-mono f-muted">l</text>
  <text x="314" y="126" class="f-mono f-muted">y</text>
  <text x="326" y="126" class="f-mono f-muted">5</text>
  <text x="338" y="126" class="f-mono f-muted">6</text>
  <text x="440" y="126" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="126" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="147" class="f-mono f-ink">g</text>
  <text x="72" y="147" class="f-mono f-ink">r</text>
  <text x="84" y="147" class="f-mono f-ink">a</text>
  <text x="96" y="147" class="f-mono f-ink">t</text>
  <text x="108" y="147" class="f-mono f-ink">e</text>
  <text x="120" y="147" class="f-mono f-ink">f</text>
  <text x="132" y="147" class="f-mono f-ink">u</text>
  <text x="144" y="147" class="f-mono f-ink">l</text>
  <text x="156" y="147" class="f-mono f-ink">1</text>
  <text x="168" y="147" class="f-mono f-ink">0</text>
  <rect x="228" y="134" width="12" height="17" class="f-box"/>
  <text x="230" y="147" class="f-mono f-accent">l</text>
  <rect x="240" y="134" width="12" height="17" class="f-box"/>
  <text x="242" y="147" class="f-mono f-accent">z</text>
  <rect x="252" y="134" width="12" height="17" class="f-box"/>
  <text x="254" y="147" class="f-mono f-accent">n</text>
  <rect x="264" y="134" width="12" height="17" class="f-box"/>
  <text x="266" y="147" class="f-mono f-accent">z</text>
  <text x="278" y="147" class="f-mono f-muted">e</text>
  <text x="290" y="147" class="f-mono f-muted">f</text>
  <text x="302" y="147" class="f-mono f-muted">u</text>
  <text x="314" y="147" class="f-mono f-muted">l</text>
  <text x="326" y="147" class="f-mono f-muted">1</text>
  <text x="338" y="147" class="f-mono f-muted">0</text>
  <text x="440" y="147" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="147" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="168" class="f-mono f-ink">h</text>
  <text x="72" y="168" class="f-mono f-ink">a</text>
  <text x="84" y="168" class="f-mono f-ink">r</text>
  <text x="96" y="168" class="f-mono f-ink">d</text>
  <text x="108" y="168" class="f-mono f-ink">s</text>
  <text x="120" y="168" class="f-mono f-ink">h</text>
  <text x="132" y="168" class="f-mono f-ink">i</text>
  <text x="144" y="168" class="f-mono f-ink">p</text>
  <text x="156" y="168" class="f-mono f-ink">3</text>
  <text x="168" y="168" class="f-mono f-ink">8</text>
  <text x="230" y="168" class="f-mono f-muted">h</text>
  <text x="242" y="168" class="f-mono f-muted">a</text>
  <text x="254" y="168" class="f-mono f-muted">r</text>
  <text x="266" y="168" class="f-mono f-muted">d</text>
  <text x="278" y="168" class="f-mono f-muted">s</text>
  <text x="290" y="168" class="f-mono f-muted">h</text>
  <text x="302" y="168" class="f-mono f-muted">i</text>
  <rect x="312" y="155" width="12" height="17" class="f-box"/>
  <text x="314" y="168" class="f-mono f-accent">l</text>
  <text x="326" y="168" class="f-mono f-muted">3</text>
  <rect x="336" y="155" width="12" height="17" class="f-box"/>
  <text x="338" y="168" class="f-mono f-accent">7</text>
  <text x="440" y="168" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="168" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="189" class="f-mono f-ink">i</text>
  <text x="72" y="189" class="f-mono f-ink">d</text>
  <text x="84" y="189" class="f-mono f-ink">e</text>
  <text x="96" y="189" class="f-mono f-ink">o</text>
  <text x="108" y="189" class="f-mono f-ink">l</text>
  <text x="120" y="189" class="f-mono f-ink">o</text>
  <text x="132" y="189" class="f-mono f-ink">g</text>
  <text x="144" y="189" class="f-mono f-ink">y</text>
  <text x="156" y="189" class="f-mono f-ink">7</text>
  <text x="168" y="189" class="f-mono f-ink">8</text>
  <text x="230" y="189" class="f-mono f-muted">i</text>
  <text x="242" y="189" class="f-mono f-muted">d</text>
  <text x="254" y="189" class="f-mono f-muted">e</text>
  <rect x="264" y="176" width="12" height="17" class="f-box"/>
  <text x="266" y="189" class="f-mono f-accent">l</text>
  <rect x="276" y="176" width="12" height="17" class="f-box"/>
  <text x="278" y="189" class="f-mono f-accent">k</text>
  <rect x="288" y="176" width="12" height="17" class="f-box"/>
  <text x="290" y="189" class="f-mono f-accent">p</text>
  <text x="302" y="189" class="f-mono f-muted">g</text>
  <text x="314" y="189" class="f-mono f-muted">y</text>
  <text x="326" y="189" class="f-mono f-muted">7</text>
  <rect x="336" y="176" width="12" height="17" class="f-box"/>
  <text x="338" y="189" class="f-mono f-accent">3</text>
  <text x="440" y="189" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="189" text-anchor="end" class="f-mono f-muted">7/10</text>
  <text x="60" y="210" class="f-mono f-ink">n</text>
  <text x="72" y="210" class="f-mono f-ink">o</text>
  <text x="84" y="210" class="f-mono f-ink">m</text>
  <text x="96" y="210" class="f-mono f-ink">i</text>
  <text x="108" y="210" class="f-mono f-ink">n</text>
  <text x="120" y="210" class="f-mono f-ink">a</text>
  <text x="132" y="210" class="f-mono f-ink">t</text>
  <text x="144" y="210" class="f-mono f-ink">e</text>
  <text x="156" y="210" class="f-mono f-ink">2</text>
  <text x="168" y="210" class="f-mono f-ink">9</text>
  <text x="230" y="210" class="f-mono f-muted">n</text>
  <text x="242" y="210" class="f-mono f-muted">o</text>
  <text x="254" y="210" class="f-mono f-muted">m</text>
  <text x="266" y="210" class="f-mono f-muted">i</text>
  <text x="278" y="210" class="f-mono f-muted">n</text>
  <text x="290" y="210" class="f-mono f-muted">a</text>
  <text x="302" y="210" class="f-mono f-muted">t</text>
  <text x="314" y="210" class="f-mono f-muted">e</text>
  <rect x="324" y="197" width="12" height="17" class="f-box"/>
  <text x="326" y="210" class="f-mono f-accent">x</text>
  <text x="338" y="210" class="f-mono f-muted">9</text>
  <text x="440" y="210" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="210" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="231" class="f-mono f-ink">p</text>
  <text x="72" y="231" class="f-mono f-ink">o</text>
  <text x="84" y="231" class="f-mono f-ink">s</text>
  <text x="96" y="231" class="f-mono f-ink">i</text>
  <text x="108" y="231" class="f-mono f-ink">t</text>
  <text x="120" y="231" class="f-mono f-ink">i</text>
  <text x="132" y="231" class="f-mono f-ink">o</text>
  <text x="144" y="231" class="f-mono f-ink">n</text>
  <text x="156" y="231" class="f-mono f-ink">9</text>
  <text x="168" y="231" class="f-mono f-ink">0</text>
  <text x="230" y="231" class="f-mono f-muted">p</text>
  <rect x="240" y="218" width="12" height="17" class="f-box"/>
  <text x="242" y="231" class="f-mono f-accent">p</text>
  <text x="254" y="231" class="f-mono f-muted">s</text>
  <rect x="264" y="218" width="12" height="17" class="f-box"/>
  <text x="266" y="231" class="f-mono f-accent">v</text>
  <text x="278" y="231" class="f-mono f-muted">t</text>
  <rect x="288" y="218" width="12" height="17" class="f-box"/>
  <text x="290" y="231" class="f-mono f-accent">n</text>
  <rect x="300" y="218" width="12" height="17" class="f-box"/>
  <text x="302" y="231" class="f-mono f-accent">p</text>
  <rect x="312" y="218" width="12" height="17" class="f-box"/>
  <text x="314" y="231" class="f-mono f-accent">k</text>
  <rect x="324" y="218" width="12" height="17" class="f-box"/>
  <text x="326" y="231" class="f-mono f-accent">0</text>
  <text x="338" y="231" class="f-mono f-muted">0</text>
  <text x="440" y="231" text-anchor="end" class="f-mono f-ink">4/10</text>
  <text x="540" y="231" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="252" class="f-mono f-ink">s</text>
  <text x="72" y="252" class="f-mono f-ink">u</text>
  <text x="84" y="252" class="f-mono f-ink">p</text>
  <text x="96" y="252" class="f-mono f-ink">p</text>
  <text x="108" y="252" class="f-mono f-ink">r</text>
  <text x="120" y="252" class="f-mono f-ink">e</text>
  <text x="132" y="252" class="f-mono f-ink">s</text>
  <text x="144" y="252" class="f-mono f-ink">s</text>
  <text x="156" y="252" class="f-mono f-ink">5</text>
  <text x="168" y="252" class="f-mono f-ink">6</text>
  <text x="230" y="252" class="f-mono f-muted">s</text>
  <text x="242" y="252" class="f-mono f-muted">u</text>
  <text x="254" y="252" class="f-mono f-muted">p</text>
  <rect x="264" y="239" width="12" height="17" class="f-box"/>
  <text x="266" y="252" class="f-mono f-accent">n</text>
  <text x="278" y="252" class="f-mono f-muted">r</text>
  <text x="290" y="252" class="f-mono f-muted">e</text>
  <text x="302" y="252" class="f-mono f-muted">s</text>
  <rect x="312" y="239" width="12" height="17" class="f-box"/>
  <text x="314" y="252" class="f-mono f-accent">x</text>
  <text x="326" y="252" class="f-mono f-muted">5</text>
  <text x="338" y="252" class="f-mono f-muted">6</text>
  <text x="440" y="252" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="252" text-anchor="end" class="f-mono f-muted">9/10</text>
  <line x1="60" y1="262" x2="545" y2="262" class="f-plain"/>
  <text x="440" y="278" text-anchor="end" class="f-mono f-ink">77/100</text>
  <text x="540" y="278" text-anchor="end" class="f-mono f-muted">93/100</text>
</svg>
<figcaption>Навучанне на 900 націсках з файлаў клавіш, праверка на паролях. Вылучаныя сімвалы адгаданыя няправільна.</figcaption>
</figure>

З 23 няправільных здагадак 10 трапілі на фізічнага суседа правільнай клавішы. Для выпадковай пары клавіш на гэтай раскладцы гэта 13%. Са слоўнікам гэта карысны спіс кандыдатаў, але паролю з лічбамі ў канцы ўсё роўна трэба 10 правільных здагадак запар.

Спата з суаўтарамі правялі такую ж праверку, на 8 паролях, запісаных пазней на той жа клавіятуры. Іх сетка атрымала ў сярэднім 89,1%. Іх пароляў у адкрытым наборы няма, таму наўпрост параўнаць я не магу, але гэта на 12 пунктаў вышэй за мае 77. У артыкуле Харысана такой праверкі няма.

## Дзе ламаецца

**Іншы запіс той жа клавіятуры.** Я навучыў мадэль на запісе з тэлефона і праверыў на запісе Zoom, той жа MacBook і той жа чалавек за клавіятурай. Выйшла 6,3%. Адваротны кірунак даў 4,9%. Я думаў, што прычына ў рознай паласе частот: Zoom на 32 кГц супраць 44,1 кГц у тэлефона. Таму я пакінуў толькі мел-паласы ніжэй за 8 кГц і адняў ад кожнага запісу яго сярэдні лагарыфмічны мел-спектр у ролі грубага эквалайзера. Лепшае, што з гэтага выйшла, гэта 12%, у 4 разы вышэй за выпадковае адгадванне. Мяняюцца тут адразу тры рэчы: іншы мікрафон, іншы сеанс запісу і апрацоўка Zoom. Раздзяліць іх я не магу. 92% і 85% на першым графіку гэта 2 асобныя мадэлі, кожная навучаная на сваім запісе.

**Шум.** Тут я спачатку памыліўся. Я дадаў белы шум на 30 дБ ніжэй за націск і мадэль MacBook упала да выпадковага адгадвання. Я нейкі час шукаў памылку ў кодзе шуму, перш чым параўнаў узроўні па палосах. Большая частка гуку пакоя ў запісе тэлефона прыпадае на ніжнія паласы. Вышэй за 1,1 кГц там так ціха, што нават шум на 60 дБ ніжэй за націск гучнейшы за пакой. Так у 47 палосах з 64. Калі апошнія 5 націскаў кожнага файла адкладзеныя на праверку, у мадэлі было 88% на чыстых націсках, 43% пры 60 дБ і 5,6% пры 50 дБ. Мая здагадка ў тым, што яна абапіраецца на гэтыя амаль бязгучныя верхнія паласы.

Тады я дадаў той жа шум таго ж узроўню ў навучальныя націскі. Мадэль MacBook трымае 86% пры 60 дБ, 61% пры 30 дБ і 26% пры 0 дБ, дзе шум такі ж гучны, як сам націск. Механічная клавіятура застаецца на 97% нават пры 0 дБ. Кожная з гэтых мадэляў ведала ўзровень шуму загадзя.

<figure class="fig">
<svg viewBox="0 0 640 328" role="img" aria-label="Лінейны графік залежнасці дакладнасці ад белага шуму ў тэставых націсках, ад запісу без шуму да 0 дБ ніжэй за націск. MacBook, навучаны з шумам: без шуму 87,8%, 60 дБ 86,1%, 50 дБ 85,6%, 40 дБ 76,1%, 30 дБ 61,1%, 20 дБ 47,8%, 10 дБ 33,9%, 0 дБ 26,1%. MacBook, навучаны без шуму: без шуму 87,8%, 60 дБ 43,3%, 50 дБ 5,6%, 40 дБ 2,8%, 30 дБ 2,8%, 20 дБ 2,8%, 10 дБ 2,8%, 0 дБ 2,8%. механічная, навучана з шумам: без шуму 100%, 60 дБ 100%, 50 дБ 100%, 40 дБ 100%, 30 дБ 100%, 20 дБ 100%, 10 дБ 100%, 0 дБ 96,7%. механічная, навучана без шуму: без шуму 100%, 60 дБ 100%, 50 дБ 100%, 40 дБ 99,4%, 30 дБ 97,8%, 20 дБ 45,6%, 10 дБ 19,4%, 0 дБ 8,3%.">
  <text x="12" y="16" class="f-label f-muted">белы шум, дададзены да тэставых націскаў</text>
  <line x1="70" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="62" y="244" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" y1="190" x2="590" y2="190" class="f-plain"/>
  <text x="62" y="194" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" y1="140" x2="590" y2="140" class="f-plain"/>
  <text x="62" y="144" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" y1="90" x2="590" y2="90" class="f-plain"/>
  <text x="62" y="94" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" y1="40" x2="590" y2="40" class="f-plain"/>
  <text x="62" y="44" text-anchor="end" class="f-label f-muted">100%</text>
  <line x1="70" y1="234.4" x2="590" y2="234.4" class="f-line" stroke-dasharray="3 3"/>
  <text x="70" y="258" text-anchor="middle" class="f-label f-muted">без шуму</text>
  <text x="144.28571428571428" y="258" text-anchor="middle" class="f-label f-muted">60</text>
  <text x="218.57142857142858" y="258" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="292.8571428571429" y="258" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="367.14285714285717" y="258" text-anchor="middle" class="f-label f-muted">30</text>
  <text x="441.42857142857144" y="258" text-anchor="middle" class="f-label f-muted">20</text>
  <text x="515.7142857142858" y="258" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="590" y="258" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="590" y="274" text-anchor="end" class="f-label f-muted">дБ, наколькі шум цішэйшы за націск</text>
  <polyline points="70.0,64.4 144.3,67.8 218.6,68.9 292.9,87.8 367.1,117.8 441.4,144.4 515.7,172.2 590.0,187.8" fill="none" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="67.8" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="68.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="87.8" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="117.8" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="144.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="172.2" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="187.8" r="2.6" class="f-accent"/>
  <polyline points="70.0,64.4 144.3,153.3 218.6,228.9 292.9,234.4 367.1,234.4 441.4,234.4 515.7,234.4 590.0,234.4" fill="none" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="153.3" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="228.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="234.4" r="2.6" class="f-accent"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,40.0 367.1,40.0 441.4,40.0 515.7,40.0 590.0,46.7" fill="none" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="46.7" r="2.6" class="f-ink"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,41.1 367.1,44.4 441.4,148.9 515.7,201.1 590.0,223.3" fill="none" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="41.1" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="44.4" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="148.9" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="201.1" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="223.3" r="2.6" class="f-ink"/>
  <line x1="70" y1="294" x2="96" y2="294" style="stroke:var(--accent);stroke-width:2"/>
  <text x="104" y="298" class="f-label f-muted">MacBook, навучаны з шумам</text>
  <line x1="340" y1="294" x2="366" y2="294" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="298" class="f-label f-muted">MacBook, навучаны без шуму</text>
  <line x1="70" y1="312" x2="96" y2="312" style="stroke:var(--ink);stroke-width:2"/>
  <text x="104" y="316" class="f-label f-muted">механічная, навучана з шумам</text>
  <line x1="340" y1="312" x2="366" y2="312" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="316" class="f-label f-muted">механічная, навучана без шуму</text>
</svg>
<figcaption>Праверка на апошніх 5 націсках кожнага файла клавішы, навучанне на першых 20. Узровень шуму адлічаны ад магутнасці першых 100 мс кожнага націску. Пункцірная лінія гэта выпадковае адгадванне, 2,8%.</figcaption>
</figure>

**Навучальныя даныя.** Усё гэта патрабуе размечаных націскаў менавіта гэтай клавіятуры менавіта ў гэтым месцы. На тых жа адкладзеных націсках 1 размечаны націск на клавішу даў мадэлі MacBook 11%, 5 націскаў 41%, 20 націскаў 88%. Механічнай клавіятуры трэба менш: 50% з 1 націску і 89% з 5. Нехта мусіць спачатку націснуць кожную клавішу пад запіс або таму, хто атакуе, давядзецца размеціць націскі іншым спосабам. Працы, дзе гэта робяць без разметкі, выкарыстоўваюць моўную мадэль. Гэта асобная задача і я яе не паўтараў.

## Чаго я не правяраў

Я не запісваў сваю клавіятуру. Замер ішоў на серверы без мікрафона, так што ўсё вышэй гэта 2 адкрытыя датасэты і 3 запісы. У наборы Харысана друкаваў адзін чалавек, пра KAD не сказана. Я не спрабаваў глыбокія сеткі з артыкулаў, так што перанос паміж запісамі з імі можа выйсці лепшым. Я не спрабаваў друкаваць у звычайным тэмпе, дзе націскі накладваюцца, бо маёй нарэзцы трэба 200 мс паміж націскамі. На запісе MacBook у акне цішыні гук яшчэ згасае, так што частка з гэтых 29% можа прыпадаць на гук самой клавішы. Праверка на паролях ад гэтага не залежыць. Кожны лік тут атрыманы за 1 прагон. Мае мадэлі дэтэрмінаваныя, а генератар шуму запускаецца з фіксаваным зернем.

Для мяне вынік вузейшы за загаловак. Гук клавішы сапраўды выдае клавішу. На праверцы паролямі мая лінейная мадэль атрымала 77 са 100, а сетка Спаты 89,1% на сваіх. Але ў абодвух выпадках гэта тая ж клавіятура, той жа пакой і той жа мікрафон, што і пры навучанні. З маёй мадэллю іншы запіс таго ж MacBook апускае вынік да 5 або 6%. Якая частка з 95% на MacBook прыйшла з файла, па гэтым датасэце я сказаць не магу.
