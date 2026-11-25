---
title: "У Gaia DR1 суседка зоркі з выпадковым індэксам i стаіць пад нумарам 2i або 2i + 1"
description: "У першым каталогу Gaia 1 142 679 769 радкоў і слупок random_index для выбарак. У зоркі i суседка на небе ў 89,3% выпадкаў стаіць пад нумарам 2i або 2i + 1, а ў першых 50 000 радкоў блізкіх пар удвая больш, чым у двух іншых вокнах такога ж памеру. Са 100 найбліжэйшых зорак Hipparcos паралакс у рэлізе ёсць у 32."
date: 2016-10-02
lang: be
translationKey: gaia-dr1-first-look
tags: ["open-data", "algorithms", "statistics"]
---

Я папрасіў у архіва Gaia 60 зорак, у якіх `random_index` меншы за 60, і раздрукаваў іх галактычныя каардынаты. У радка 2 даўгата 344,75 і шырата 17,90. Побач апынуліся радкі 5 (344,72 і 18,39), 11 (344,92 і 17,92) і 23 (344,43 і 18,56). Усе 4 зоркі змяшчаюцца ў пляме, меншай за 1 градус. Радкі 0, 1, 3, 7 і 15 сабраліся ў другой такой пляме.

У табліцы 1 142 679 769 радкоў, трымаць яе мне няма дзе, таму пачаў я з выпадковай выбаркі. Калі ў табліцы ёсць для гэтага слупок, я проста бяру яго і не правяраю. Дакументацыя да гэтага і заахвочвае: у слупку "выпадковая перастаноўка лікаў ад 0 да N-1", па ім зручна браць падмноствы, якія "застаюцца рэпрэзентатыўнымі". Я збіраўся глядзець на зоркі, а глядзеў пераважна на слупок.

## Што ўвогуле адкрылі

Першы каталог Gaia ESA адкрыла 14 верасня. Запыты я адпраўляў у архіў праз TAP. У галоўнай табліцы `gaia_source` 57 слупкоў, але амаль у кожнага радка ёсць толькі становішча і бляск у адной паласе G, астатняе займаюць хібнасці і службовыя палі. Колераў няма. Паралакс, з якога атрымліваецца адлегласць, ёсць у 2 057 050 радкоў, гэта 0,18%. Такія зоркі сабраны ў TGAS, для іх Gaia аб'ядналі са старымі каталогамі Hipparcos і Tycho-2.

З гэтых паралаксаў 30 840 (1,5%) адмоўныя, а 1 019 970 (49,6%) меншыя за 5 уласных хібнасцей. Так што для паловы зорак дзяліць адзінку на паралакс не варта. Астраатмаджа і Байлер-Джонс ужо выклалі артыкул (arXiv 1609.07369), дзе адлегласці да ўсіх 2 мільёнаў палічаны як след.

Потым я ўзяў 100 найбліжэйшых зорак з Hipparcos (новая рэдукцыя, хібнасць меншая за 10 мілісекунд дугі) і пашукаў іх у TGAS па нумары HIP. Паралакс у TGAS знайшоўся ў 32. У 8 самых блізкіх яго няма. Калі ўзяць Hipparcos цалкам, у TGAS ёсць 79,4% зорак, 93 635 з 117 955.

<figure class="fig">
<svg viewBox="0 0 680 192" role="img" aria-label="100 квадратаў для 100 найбліжэйшых зорак Hipparcos, ад найбліжэйшай да сотай. У 32 ёсць паралакс у TGAS, яшчэ ў 25 ёсць радок у gaia_source без паралакса, у 43 радка няма. У першых 8 паралакса ў TGAS няма.">
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
  <text x="80.0" y="134.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">паралакс у TGAS: 32</text>
  <rect x="60" y="144" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.0" y="154.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">радок без паралакса: 25</text>
  <rect x="60" y="164" width="12" height="12" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="80.0" y="174.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">няма радка ў межах 2 вуглавых секунд: 43</text>
</svg>
<figcaption>100 найбліжэйшых зорак каталога Hipparcos, злева направа і зверху ўніз пачынаючы з найбліжэйшай.</figcaption>
</figure>

Астатнія 68 я шукаў у `gaia_source` па становішчы. Каардынаты ў Hipparcos за 1991 год, а зоркі гэтыя хуткія, таму спачатку кожнае становішча трэба перанесці на 2015 год. У радыусе 5 вуглавых секунд ад старых каардынат нешта знайшлося для 7 зорак, ад перанесеных для 27. Сярод гэтых 27 трапілася зорка 18-й велічыні за 3,7 секунды ад месца Проксімы. Гэта, вядома, не яна. Пры радыусе 2 секунды засталося 25, бляск ва ўсіх падобны да праўды, ад велічыні з Hipparcos ён адрозніваецца не больш чым на 1,8. Аглядны артыкул рэлізу (Браўн з сааўтарамі) папярэджвае, што многіх зорак, ярчэйшых за 7-ю велічыню, у каталогу няма, як няма і тых, што рухаюцца хутчэй за 3,5 вуглавой секунды ў год. У маім спісе такіх хуткіх 14, паралакса няма ні ў адной, але для зоркі Каптэйна радок усё ж ёсць.

## 2i або 2i + 1

Вернемся да слупка. Першыя 100 радкоў па `random_index` ляжаць у 55 розных ячэйках HEALPix памерам каля 0,9 градуса. Калі ўзяць 100 радкоў пачынаючы з мільённага, ячэек 99. Дзе шукаць, падказалі лікі з пачатку: 2, 5, 11, 23 гэта падваенне з дададзенай адзінкай.

Для кожнага i ад 1 да 24 999 я вымераў адлегласць да зорак 2i і 2i + 1 і ўзяў тую, што бліжэй. Медыяна выйшла 19,4 вуглавой мінуты, 89,3% пар бліжэй за 1 градус. Калі другія зоркі перамяшаць, медыяна ўжо 46 градусаў, а бліжэй за 1 градус 0,1%. Суседнія індэксы, i і i + 1, бліжэй за градус у 0,02% выпадкаў, так што калі параўноўваць радок з наступным, слупок выглядае прыстойна. Абедзве зоркі, 2i і 2i + 1, аказаліся побач толькі 6 разоў з 24 999.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Адлегласць на небе паміж зоркай з індэксам i і бліжэйшай з зорак 2i і 2i + 1, 24 999 пар, 13 інтэрвалаў ад менш чым 1 вуглавой мінуты да 180 градусаў. Большасць сапраўдных пар ляжыць паміж 5 вуглавымі мінутамі і 1 градусам, 94% перамяшанага кантролю ляжыць далей за 10 градусаў.">
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
  <text x="248.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">2i або 2i + 1</text>
  <rect x="410" y="9" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="428.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">уперамешку</text>
</svg>
<figcaption>Адлегласць ад зоркі i да бліжэйшай з 2i і 2i + 1 (акцэнтны колер) і да тых жа зорак уперамешку (шэры). Па 24 999 пар.</figcaption>
</figure>

## Якая з дзвюх

Падвоіць лік і дапісаць справа новы біт: так працуе рэгістр зруху з лінейнай зваротнай сувяззю. Гэта стары танны спосаб абысці ўсе лікі не па парадку. Кожны новы біт у ім роўны XOR некалькіх старых. Я выпісаў 5912 ураўненняў па парах, бліжэйшых за 10 вуглавых мінут, і паспрабаваў рашыць іх адносна гэтых бітаў. 2946 ураўненняў супярэчылі астатнім, прыкладна столькі дала б і манета. Было падобна на выпадковасць, але памыліўся я сам: ва ўраўненнях не было свабоднага члена. З ім сышліся ўсе 5912. Новы біт гэта інвертаваны XOR чагосьці.

Астатняе даў перабор бітаў па адным. З 14 малодшых бітаў на адказ уплывае толькі біт 9, у 99,99% пар. З бітаў ад 14-га да 29-га толькі біт 29. Калі i большы за 571 мільён, падвоены лік у табліцу ўжо не змяшчаецца, таму біты 30 і 31 давялося адгадваць. Падышоў рэгістр на 32 біты з адводамі 31, 30, 29 і 9. Лікі, якім у табліцы няма месца, ён пераступае. У кодзе адзін крок гэта такі радок, яго трэба паўтараць, пакуль x не стане меншым за 1 142 679 769:

```
x = ((x << 1) & 0xffffffff) | (1 ^ ((x >> 31 ^ x >> 30 ^ x >> 29 ^ x >> 9) & 1))
```

Я ўзяў па 2000 радкоў з 7 месцаў індэкса, для кожнага прадказаў адзін наступны індэкс і ў межах 1 градуса трапіў у 12 543 выпадках з 14 000 (89,6%).

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="4 станы 32-бітнага рэгістра, па адным у радку: 33 235 623; 66 471 246; 132 942 493; 265 884 986. Кожны радок атрыманы з папярэдняга зрухам улева на адзін біт, справа ўваходзіць новы біт. Пазначаны біты 31, 30, 29 і 9, з іх ён і атрымліваецца.">
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
  <text x="652.0" y="72.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новы біт</text>
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
  <text x="652.0" y="118.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новы біт</text>
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
  <text x="652.0" y="164.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">новы біт</text>
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
<figcaption>4 выпадковыя індэксы запар з першага файла выгрузкі. Кожны лік гэта папярэдні, зрушаны ўлева, а новы правы біт роўны інвертаванаму XOR пазначаных бітаў.</figcaption>
</figure>

Найбольш мяне пераканаў файл. Выгрузка csv пачынаецца з `GaiaSource_000-000-000.csv.gz`, у ім 218 453 радкі, адсартаваныя па `source_id`. Паводле правіла 216 634 з іх (99,2%) пераходзяць у іншы радок гэтага ж файла. Выпадкова такіх набралася б каля 42.

Потым я запусціў рэгістр ад нуля. Вярнуўся ён праз 4 294 967 295 крокаў, даўжэйшага круга на 32 бітах не бывае, таму кожны лік, меншы за 1 142 679 769, сустракаецца на ім роўна адзін раз. З перастаноўкай з дакументацыі гэта стасуецца. Гэтыя лікі я па дарозе пранумараваў, радкі файла атрымалі месцы ад 478 825 166 да 479 202 346. 14 суцэльных адрэзкаў даўжынёй ад 1000 месцаў пакрываюць 215 358 з іх.

Я разумею гэта так. У нейкі момант радкі ляжалі вобласць за вобласцю, у гэтым парадку іх і пранумаравалі, а нумар прапусцілі праз рэгістр. Самой гэтай табліцы я не бачу, так што гэта здагадка. У TGAS свой `random_index`, падваенне ёсць і там: бліжэй за 1 градус 81,3% пар.

## Ці замінае гэта

Сярэднім амаль не замінае. Я ўзяў 3 выбаркі па 50 000 радкоў, адну з нуля, дзве іншыя з 300 і з 700 мільёнаў. Сярэдняе G ва ўсіх 18,65 або 18,66. А вось пар, бліжэйшых за 10 вуглавых мінут, у першай 25 165, у дзвюх іншых 12 434 і 12 582. Палова блізкіх пар у першай выбарцы лішняя. Медыянная адлегласць да найбліжэйшай зоркі выбаркі 10,2 вуглавой мінуты, у дзвюх іншых 14,0.

Выходзіць, найгоршы якраз `random_index < K`, самы натуральны запіс. У першай выбарцы ў паловы радкоў, роўна ў паловы, наступны індэкс трапляе ў тую ж выбарку, у дзвюх іншых ні ў аднаго. Праз 2 і праз 3 крокі рэгістра зоркі таксама побач, бліжэй за 1 градус 89,5% і 89,2% пар.

Яшчэ дакументацыя раіць правяраць вынік на 10 розных выпадковых падмноствах. Калі разрэзаць індэкс на 10 роўных частак, наступная зорка для любой зоркі з першай часткі апынецца ў першай або ў другой. Незалежнымі я б такія падмноствы не назваў.

## Чаго я не правяраў

З дакументацыі я прачытаў толькі старонку пра гэты слупок, генератар можа быць апісаны ў іншым месцы. Біты 30 і 31 я адгадаў і потым пацвердзіў, а не вывеў, як біты 9 і 29. Выгрузку звяраў на адным файле. Хэш ад `source_id`, напэўна, быў бы надзейнейшы, але я яго не спрабаваў. Радок у межах 2 вуглавых секунд я лічыў самой зоркай, у падвойнай гэта можа быць і другі кампанент. І 100 найбліжэйшых гэта найбліжэйшыя з Hipparcos, слабых зорак ён не бачыць.
