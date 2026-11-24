---
title: "Seed 42 даў 203 розныя адказы за 800 прагонаў аднаго скрыпта"
description: "Адзін скрыпт з загадзя вядомым адказам, seed 42 і 4 версіі Python 2012 года. Наіўны варыянт даў 203 розныя адказы за 800 прагонаў. Пасля 3 правак ён кожны раз дае 0,0482, а правільны адказ у кодзе 0,03."
date: 2013-02-16
lang: be
translationKey: reproducible-experiment
tags: ["statistics", "numbers", "dependencies"]
---

Python 2.7.3 выканаў `exp.py naive 42` і надрукаваў 0,0324. Я запусціў яшчэ раз, зноў 0,0324. Потым той самы файл з тым самым seed выканаў Python 3.3.0 і выйшла 0,0486, наступны запуск даў 0,0564, а яшчэ адзін 0,0260. (Python 3 друкуе ўсе знакі, я абрэзаў да 4.) Правільны адказ 0,03, ён запісаны канстантай у пачатку файла.

Звычайна я пішу `random.seed(42)` першым радком і на гэтым лічу пытанне закрытым. Што менавіта гэты радок абяцае, я ні разу не правяраў. Як далёка атрыманы лік ад праўды, я таксама не ведаў, бо ніякай праўды ў скрыпце не было. Так што гэта мой першы эксперымент, дзе я паспрабаваў атрымаць адразу абедзве рэчы: прагон паўтараецца, а адказ вядомы загадзя.

## Скрыпт

Увесь свет прыдуманы ў кодзе. Ёсць 400 карыстальнікаў з імёнамі ад `u000` да `u399`, клікабельнасць у іх расце з нумарам ад 0,10 да 0,50. Выпадковая палова атрымлівае варыянт B, які дадае да клікабельнасці роўна 0,03. Кожнаму дастаецца 25 паказаў. Скрыпт лічыць розніцу сярэдніх паміж паловамі, далей я называю яе прыростам.

У наіўным варыянце ад парадку залежаць 3 месцы. Спіс робіцца з `set` з імёнамі, потым выклікаецца `random.shuffle`, а ў канцы `sum` складае значэнні слоўніка. Гэтыя месцы я мяняў па адным і кожны варыянт запускаў з seed 42 на 2.6.8, 2.7.3, 3.2.3 і 3.3.0. Усе 4 выйшлі ў 2012 годзе, збіраў я іх з зыходнікаў пад 64-бітны Linux. Адна клетка на першым малюнку гэта 100 асобных працэсаў.

Тут важныя хэшы радкоў. У снежні 2011 года Клінк і Вельдэ паказалі атаку на калізіях, пасля яе Python навучыўся дамешваць у хэш выпадковы лік, свой для кожнага працэсу. Ключ `-R` уключае гэта ў першых 3 версіях, а ў 3.3.0 яно ўключана адразу і выключаецца праз `PYTHONHASHSEED=0`.

Пэнг у 2011 годзе пісаў у Science, што разам з вынікам трэба публікаваць код і даныя. А ў дакументацыі Python 3.2 ёсць раздзел "Notes on Reproducibility", якога я раней не адкрываў. Там гарантаваная паслядоўнасць `random()` і сказана, што большасць астатніх алгарытмаў ад версіі да версіі можа мяняцца.

## Што трымае seed

100 000 значэнняў `random()` супалі ва ўсіх 4 версіях да апошняга біта. З астатнім так:

| пасля seed | 2.6.8 | 2.7.3 | 3.2.3 і 3.3.0 |
|---|---|---|---|
| 42, `random()` | 0,6394 | 0,6394 | 0,6394 |
| 42, `gauss(0, 1)` | -0,1441 | -0,1441 | -0,1441 |
| 42, `expovariate(1.0)` | 0,4472 | 1,0201 | 1,0201 |
| 42, `randint(1, 100)` | 64 | 64 | 82 |
| 42, `shuffle` лікаў ад 0 да 9, першыя 3 | 9 7 8 | 9 7 8 | 7 3 2 |
| 4.2, `random()` | 0,6029 | 0,6029 | 0,9409 |
| "seed-42", `random()` | 0,3206 | 0,3206 | 0,4036 |

У `randint`, `choice`, `shuffle` і `sample` у 3.2 змяніўся алгарытм, пра гэта напісана ў What's New.

Апошні радок з пасткай. Тэкставы seed у 2.6.8 і 2.7.3 праходзіць праз `hash()`. З ключом `-R` я запусціў 100 працэсаў з `random.seed("seed-42")` і атрымаў 100 розных першых лікаў. У 3.2.3 і 3.3.0 лік адзін. Затое картэж у ролі seed і ў 3.3.0 дае 100 розных са 100.

## Папраўляю па адным радку

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Сетка: 4 варыянты скрыпта на 8 наладах Python, па 100 працэсаў у клетцы. З list(set()) і фіксаванымі хэшамі адказы 0,0324, 0,0324, 0,0294 і 0,0338, з выпадковымі хэшамі розных адказаў 82, 81, 82 і 77. З sorted() Python 2 дае 0,0482, Python 3 дае 0,0388. Са сваёй перастаноўкай усюды 0,0482, а варыянтаў апошніх лічбаў бывае да 14. З fsum усюды адно дакладнае значэнне.">
  <text x="262.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">фіксаваныя хэшы</text>
  <text x="540.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">выпадковыя хэшы</text>
  <text x="161.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="228.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="295.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="362.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="439.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="506.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="573.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="640.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="0.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">list(set())</text>
  <rect x="130" y="52" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0324</text>
  <text x="161.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="52" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0324</text>
  <text x="228.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="52" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0294</text>
  <text x="295.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="52" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0338</text>
  <text x="362.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="52" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="439.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">99</text>
  <rect x="475" y="52" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">81</text>
  <text x="506.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <rect x="542" y="52" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="573.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">95</text>
  <rect x="609" y="52" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">77</text>
  <text x="640.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <text x="0.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">sorted()</text>
  <rect x="130" y="100" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="100" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="100" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="295.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="100" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="362.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="100" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="475" y="100" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="542" y="100" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="573.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="609" y="100" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="640.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="0.0" y="173.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">свой shuffle</text>
  <rect x="130" y="148" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="148" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="148" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="295.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="148" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="362.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="148" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="475" y="148" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="542" y="148" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="573.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="609" y="148" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="640.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="0.0" y="221.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">math.fsum()</text>
  <rect x="130" y="196" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="196" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="196" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="295.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="196" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="362.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="196" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="475" y="196" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="542" y="196" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="573.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="609" y="196" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="640.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
</svg>
<figcaption>Seed 42, па 100 працэсаў на клетку. Зверху адказ, а калі іх некалькі, то колькі розных (акцэнтны колер). Знізу колькі розных значэнняў, калі лічыць усе двайковыя знакі. Выпадковыя хэшы ў першых 3 версіях уключае ключ -R, у 3.3.0 яны ўключаныя адразу. Фіксаваная калонка 3.3.0 знятая з PYTHONHASHSEED=0.</figcaption>
</figure>

Верхні радок гэта наіўны скрыпт. За 800 прагонаў ён даў 203 розныя адказы, ад 0,0066 да 0,0798. (Адказ заўсёды кратны 0,0002.) Пакуль хэшы фіксаваныя (гэта палова прагонаў) і я сяджу на адной версіі, усё выглядае ідэальна.

Да прагону я запісаў чаканне: `sorted()` замест `list(set())` прыбярэ выпадковыя хэшы, а заадно і розніцу паміж версіямі, хоць у другім сумняваюся. Сумняваўся нездарма. Python 2 дае 0,0482, а Python 3 дае 0,0388, справа ў новым `shuffle`. Свая перастаноўка на адным `random()` займае 3 радкі і дае 0,0482 усюды. Ёсць і карацейшы шлях: `random.shuffle(users, random.random)` у 3.2 і 3.3 дагэтуль ідзе па старой галіне.

Але гэта ўсё яшчэ не той самы лік. Парадак у слоўніку мяняе парадак складання, таму ў 800 прагонах 15 розных значэнняў, самая вялікая розніца 7,8e-16. На 2.7.3 я б гэтага не ўбачыў. Там у `sorted` з `-R` на 100 прагонаў 13 розных значэнняў, а `print` паказвае 12 знакаў і абразае іх усе да 0,0482. Пасля `math.fsum` на 800 прагонаў засталося адно значэнне.

Калі замест імёнаў узяць нумары, у наіўнага скрыпта выпадковага парадку не застаецца зусім. А 3.3.0 з `PYTHONHASHSEED=0` дае 0,0338 там, дзе ў 3.2.3 выходзіць 0,0294. Мноства з гэтых 400 імёнаў абедзве версіі абыходзяць у адным парадку, а слоўнік у розным. Чаму, я не разбіраўся.

## 0,0482 стаіць на месцы

Цяпер скрыпт паўтараецца, але насамрэч 0,03. Я прагнаў яго з 1000 seed, ад 0 да 999. Стандартнае адхіленне 0,0148, гэта палова самога прыросту. 216 seed прамахваюцца не менш, чым 42 (сам 42 таксама ў ліку), а па 24 выходзіць, што B горшы за A.

Я чакаў, што наіўны скрыпт з seed 42 на 1000 значэнняў `PYTHONHASHSEED` раскідае адказы гэтак жа, нібы гэта яшчэ адзін seed, які я забыўся запісаць. Не. Сярэдняе 0,0424, адхіленне 0,0116, адмоўных значэнняў няма зусім. Выпадковыя лікі для клікаў задае 42, мяняюцца месцамі толькі карыстальнікі. Я палічыў, які прырост даюць адны гэтыя лікі, калі кожны карыстальнік можа апынуцца на любым месцы, выйшла 0,0427. Для seed ад 1 да 5, па 200 значэнняў `PYTHONHASHSEED` на кожны, цэнтры ляжаць ад 0,0244 да 0,0362. Каб я ўсярэдніў такія прагоны, выйшаў бы вузкі інтэрвал вакол няправільнага ліку.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Дзве гістаграмы вымеранага прыросту па 1000 прагонаў. Наіўны скрыпт з seed 42 і 1000 розных PYTHONHASHSEED: сярэдняе 0,0424, адмоўных няма. Выпраўлены скрыпт з 1000 розных seed: сярэдняе 0,0299, роскід шырэйшы, ад -0,0186 да 0,0832. Сапраўдны прырост 0,03, адказ выпраўленага скрыпта пры seed 42 роўны 0,0482.">
  <line x1="50" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="42.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="190.6" x2="660" y2="190.6" class="f-plain"/>
  <text x="42.0" y="194.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="141.1" x2="660" y2="141.1" class="f-plain"/>
  <text x="42.0" y="145.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="91.7" x2="660" y2="91.7" class="f-plain"/>
  <text x="42.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <rect x="178.1" y="238.0" width="23.4" height="2.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="203.5" y="232.1" width="23.4" height="7.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="228.9" y="220.2" width="23.4" height="19.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="254.3" y="204.4" width="23.4" height="35.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="279.8" y="167.8" width="23.4" height="72.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="305.2" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="330.6" y="80.8" width="23.4" height="159.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.0" y="93.6" width="23.4" height="146.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="381.4" y="84.7" width="23.4" height="155.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="406.8" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="432.2" y="162.9" width="23.4" height="77.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="457.7" y="201.4" width="23.4" height="38.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="483.1" y="222.2" width="23.4" height="17.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="508.5" y="236.0" width="23.4" height="4.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="533.9" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="584.7" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <polyline points="50.0,239.0 75.4,239.0 75.4,240.0 100.8,240.0 100.8,231.1 126.2,231.1 126.3,226.2 151.7,226.2 151.7,213.3 177.1,213.3 177.1,205.4 202.5,205.4 202.5,167.8 227.9,167.8 227.9,164.8 253.3,164.8 253.3,120.3 278.7,120.3 278.8,95.6 304.2,95.6 304.2,117.4 329.6,117.4 329.6,121.3 355.0,121.3 355.0,148.0 380.4,148.0 380.4,158.9 405.8,158.9 405.8,201.4 431.3,201.4 431.2,227.1 456.7,227.1 456.7,220.2 482.1,220.2 482.1,235.1 507.5,235.1 507.5,240.0 532.9,240.0 532.9,239.0 558.3,239.0 558.3,239.0 583.7,239.0 583.7,240.0 609.2,240.0 609.2,240.0 634.6,240.0 634.6,240.0 660.0,240.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <line x1="304.2" y1="48" x2="304.2" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="298.2" y="56.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">насамрэч 0,03</text>
  <line x1="396.7" y1="48" x2="396.7" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="402.7" y="56.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">seed 42: 0,0482</text>
  <text x="50.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-0,02</text>
  <text x="151.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,00</text>
  <text x="253.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,02</text>
  <text x="355.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,04</text>
  <text x="456.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,06</text>
  <text x="558.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,08</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,10</text>
  <rect x="50" y="10" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="70.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">seed 42, 1000 PYTHONHASHSEED</text>
  <line x1="350" y1="16" x2="364" y2="16" style="stroke:var(--ink);stroke-width:1.5"/>
  <text x="372.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">выпраўлены, 1000 seed</text>
  <text x="0.0" y="56.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">прагонаў</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">вымераны прырост</text>
</svg>
<figcaption>Па 1000 прагонаў, крок 0,005. Слупкі: seed 42 ва ўсіх прагонах, мяняецца толькі PYTHONHASHSEED. Лінія: выпраўлены скрыпт, seed ад 0 да 999.</figcaption>
</figure>

## Правяраю сваю перастаноўку вядомым адказам

Перастаноўка цяпер мая і памылкі ў ёй таксама мае. Я знарок унёс 2 вядомыя. У першай элемент на кожным кроку мяняецца месцамі з любой пазіцыяй спіса. Пры seed 42 такая перастаноўка дае 0,0556 на ўсіх 8 наладах, па 20 працэсаў на кожнай, усё супадае да біта. Сярэдні прырост па 4000 seed 0,0418. З імёнаў першай паловы ў ёй застаецца 52,3%, таму ў B збіраюцца тыя, хто клікае часцей. Яшчэ да ўсялякіх клікаў сярэдняя клікабельнасць у B вышэйшая на 0,0116.

Па адным прагоне гэтага не ўбачыць, па 10 seed таксама, там сярэдняе 0,0331. На 30 seed ужо 0,0434, гэта 4,1 стандартнай памылкі ад 0,03.

Другая памылка гэта `i` замест `i + 1`, з ёй ніводзін элемент не можа застацца на сваім месцы. Сярэдняе 0,0294, на 2,5 стандартнай памылкі ніжэй за праўду. Пасля прагону я палічыў на паперы, мае быць 0,0295. Значыць, памылка сапраўдная, але 4000 seed яе ледзь бачаць. У правільнай перастаноўкі 0,0299 пры стандартнай памылцы 0,0002.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Сярэдні прырост па 10, 30, 100, 300, 1000 і 4000 seed з адрэзкамі ў 2 стандартныя памылкі для 3 перастановак. Правільная збягаецца да 0,03 і заканчвае на 0,0299. Абмен з любой пазіцыяй заканчвае на 0,0418. Памылка на адзінку заканчвае на 0,0294, амаль там жа, дзе правільная.">
  <line x1="60" y1="250.0" x2="660" y2="250.0" class="f-plain"/>
  <text x="52.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,02</text>
  <line x1="60" y1="191.1" x2="660" y2="191.1" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="52.0" y="195.1" text-anchor="end" class="f-mono f-accent" style="font-size:11px">0,03</text>
  <line x1="60" y1="132.3" x2="660" y2="132.3" class="f-plain"/>
  <text x="52.0" y="136.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,04</text>
  <line x1="60" y1="73.4" x2="660" y2="73.4" class="f-plain"/>
  <text x="52.0" y="77.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,05</text>
  <line x1="96.0" y1="107.8" x2="96.0" y2="231.4" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="96.0" cy="169.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="110.0" y1="125.5" x2="110.0" y2="220.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="110.0" cy="173.1" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="124.0" y1="120.3" x2="124.0" y2="232.8" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="124.0" cy="176.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="110.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="196.0" y1="129.2" x2="196.0" y2="192.6" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="196.0" cy="160.9" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="210.0" y1="73.9" x2="210.0" y2="151.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="210.0" cy="112.4" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="224.0" y1="139.4" x2="224.0" y2="203.4" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="224.0" cy="171.4" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="210.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="296.0" y1="169.5" x2="296.0" y2="202.0" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="296.0" cy="185.7" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="310.0" y1="92.4" x2="310.0" y2="128.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="310.0" cy="110.2" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="324.0" y1="173.9" x2="324.0" y2="207.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="324.0" cy="190.8" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="396.0" y1="178.9" x2="396.0" y2="198.2" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="396.0" cy="188.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="410.0" y1="111.4" x2="410.0" y2="132.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="410.0" cy="121.7" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="424.0" y1="186.3" x2="424.0" y2="205.0" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="424.0" cy="195.7" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="410.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="496.0" y1="186.1" x2="496.0" y2="197.1" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="496.0" cy="191.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="510.0" y1="116.0" x2="510.0" y2="127.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="510.0" cy="121.5" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="524.0" y1="187.8" x2="524.0" y2="198.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="524.0" cy="193.3" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="510.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="596.0" y1="189.2" x2="596.0" y2="194.7" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="596.0" cy="192.0" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="610.0" y1="119.2" x2="610.0" y2="124.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="610.0" cy="122.0" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="624.0" y1="191.8" x2="624.0" y2="197.2" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="624.0" cy="194.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="610.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <circle cx="65" cy="16" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="76.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">правільная</text>
  <circle cx="177" cy="16" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="188.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">абмен з любой пазіцыяй</text>
  <circle cx="371" cy="16" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="382.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">памылка на адзінку</text>
  <text x="660.0" y="288.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">колькі seed</text>
</svg>
<figcaption>Сярэдняе па першых n seed, адрэзкі ў 2 стандартныя памылкі. Гарызанталь на 0,03 гэта сапраўдны прырост. Памылка на адзінку дае 0,0294 і ў гэтым маштабе стаіць побач з правільнай перастаноўкай.</figcaption>
</figure>

Канстанту з адказам і цыкл па seed я пакіну, тут гэта 2 радкі. Seed буду браць цэлы. Яшчэ буду друкаваць праз `repr` і побач з лікам запісваць версію Python.

## Чаго я не правяраў

У NumPy свой генератар, яго я не чапаў. Усе зборкі пад 64-бітны Linux, на 32 бітах парадак мноства можа быць іншы. Функцыі ў табліцы, апроч `random()`, параўнаныя толькі па першых значэннях аднаго seed. Прырост выбраны прыкладна ў 2 стандартныя адхіленні аднаго прагону, з большым seed важыў бы менш.
