---
title: "Бура, якая забрала 38 Starlink, была слабай, а каталог убачыў толькі 6"
description: "Kp GFZ, Dst Кіёта і каталог CelesTrak супраць лютаўскай буры 2022 года, якая забрала 38 спадарожнікаў Starlink: звычайная G1, такіх дзён у 2022 годзе 35, каталог паказвае радкамі толькі 6 страт, а 2 запускі сустрэлі надвор'е горшае і нічога не страцілі."
date: 2022-12-22
lang: be
translationKey: space-weather-starlink
tags: ["open-data", "reliability"]
---
У лютым я прачытаў загаловак пра тое, што сонечная бура знішчыла 40 спадарожнікаў Starlink. Я ўявіў сабе нешта вялізнае і прыняў гісторыю як ёсць, не паглядзеўшы ні на адну лічбу. У гэтым месяцы я нарэшце паглядзеў, бо хацеў ведаць 2 рэчы. Наколькі моцнай была гэтая бура ў параўнанні з астатнім 2022 годам? І ці была яна асаблівай для Starlink, ці іншыя запускі праходзілі праз такое самае надвор'е без страт?

Катаока з сааўтарамі выклалі прэпрынт у сакавіку, цяпер ён прыняты ў часопіс. Данг з сааўтарамі апублікавалі сваю працу ў жніўні. Каманда NOAA і CIRES напісала трэцюю разам з інжынерамі SpaceX. Усе тры пра тое, наколькі шчыльным быў верхні слой атмасферы ў тыя дні. Іх мадэлі я не паўтараў, я хацеў толькі зверыць гісторыю з адкрытымі табліцамі, якія можа спампаваць кожны.

## Табліцы

Kp ад GFZ Патсдам гэта адна лічба на кожныя 3 гадзіны, ад 0 да 9, якая кажа, наколькі ўзбуранае магнітнае поле Зямлі ў цэлым. На ім пабудаваная шкала бур NOAA: Kp 5 гэта бура G1, 6 гэта G2, 7 гэта G3. Kp ідзе трацінамі, таму 5+ азначае 5 і адну траціну. У тым жа файле ёсць ap, лінейная версія Kp, якую можна складаць. Яе сярэдняе за суткі называецца Ap.

Каталог спадарожнікаў CelesTrak пералічвае кожны аб'ект, за якім сочаць з датай запуску і, калі аб'ект ужо сышоў з арбіты, датай сыходу. Час стартаў я ўзяў са спісу запускаў Starlink у Вікіпедыі, бо ў каталогу толькі даты. Увесь разбор гэта каля 110 радкоў на Python 3.10 толькі са стандартнай бібліятэкай.

Перад падлікам я запісаў, чаго чакаю. Лютаўская бура акажацца слабай і такіх дзён у 2022 годзе будзе больш за 10. Group 4-7 будзе адзіным запускам з вялікай ранняй стратай. І знойдзецца хоць адзін іншы запуск, які ў першыя дні сустрэў Kp 5 або вышэй і нічога не страціў.

## Наколькі моцнай яна была

Group 4-7 стартаваў 3 лютага ў 18:13 UTC з 49 спадарожнікамі. SpaceX выводзіць новыя спадарожнікі на нізкую арбіту вышынёй каля 210 км і падымае іх пазней, каб няспраўны хутка згарэў.

3 лютага Kp дайшоў да 5+ раніцай, за некалькі гадзін да старту. Ад запуску да другой паловы наступнага дня ён трымаўся паміж 2,7 і 4. Потым 4 лютага з 15 да 18 UTC зноў дайшоў да 5+, прыкладна праз 21 гадзіну пасля аддзялення спадарожнікаў. Dst рэальнага часу з Кіёта, другі звыклы індэкс бур, 3 лютага апусціўся да −66 нТл, а 4 лютага да −61. Пры моцнай буры ён апускаецца ніжэй за −100.

З 1 студзеня па 21 снежня гэтага года было 35 дзён з Kp 5 або вышэй, прыкладна 3 на месяц. 20 з іх дайшлі да 5+, як 3 і 4 лютага. Да G2 дайшлі толькі 5 дзён, да G3 ніводны. Некаторыя службы лічаць G1 ужо ад 5 з мінусам. Па такім правіле ў годзе 52 дні буры, з іх 9 дзён G2 і 2 дні G3. Так ці інакш, люты далёка не ў пачатку спіса. Па сутачным Ap 4 лютага дзеліць 5-е месца сярод самых узбураных дзён года, а 3 лютага дзеліць 11-е. Для гэтай фазы сонечнага цыкла гэта звычайная колькасць: у 2012 годзе, таксама на ўздыме цыкла, такіх дзён было таксама 35.

<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Слупковая дыяграма трохгадзіннага індэкса Kp ад GFZ у Патсдаме з 2 па 6 лютага 2022 года, 40 слупкоў. Пункцір адзначае Kp 5, узровень буры G1, другі пункцір Kp 6, узровень G2. 3 лютага з 09 да 12 UTC Kp даходзіць да 5+. Вертыкальная лінія адзначае запуск Group 4-7 у 18:13 UTC 3 лютага, у гэты момант Kp роўны 3. Пасля запуску Kp трымаецца ад 2,7 да 4, потым 4 лютага з 15 да 18 UTC даходзіць да 5+ і з 18 да 21 UTC трымаецца на 5. Ніводзін слупок не даходзіць да 6.">
  <text x="32" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="32" y="150.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="32" y="97.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="32" y="44.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="40" y="12" class="f-label f-muted">Kp</text>
  <rect x="41.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="57.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="72.5" y="182.3" width="12.5" height="17.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="88.0" y="191.2" width="12.5" height="8.8" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="103.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="119.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="134.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="150.0" y="164.6" width="12.5" height="35.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="165.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="181.0" y="84.9" width="12.5" height="115.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="196.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="212.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="227.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="243.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="258.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="274.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="289.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="305.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="320.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="336.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="351.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="367.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="382.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="398.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="413.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="429.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="444.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="460.0" y="138.0" width="12.5" height="62.0" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="475.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="491.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="506.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="522.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="537.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="553.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="568.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="584.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="599.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="615.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="630.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="646.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <line x1="40" y1="67.1" x2="660" y2="67.1" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="63.1" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G1</text>
  <line x1="40" y1="40.6" x2="660" y2="40.6" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="36.6" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G2</text>
  <line x1="40.0" y1="200" x2="40.0" y2="206" class="f-plain"/>
  <text x="102.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2 лют</text>
  <line x1="164.0" y1="200" x2="164.0" y2="206" class="f-plain"/>
  <text x="226.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3 лют</text>
  <line x1="288.0" y1="200" x2="288.0" y2="206" class="f-plain"/>
  <text x="350.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4 лют</text>
  <line x1="412.0" y1="200" x2="412.0" y2="206" class="f-plain"/>
  <text x="474.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5 лют</text>
  <line x1="536.0" y1="200" x2="536.0" y2="206" class="f-plain"/>
  <text x="598.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6 лют</text>
  <line x1="660.0" y1="200" x2="660.0" y2="206" class="f-plain"/>
  <line x1="258.1" y1="20" x2="258.1" y2="200" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="263.1" y="30" class="f-label f-accent">запуск 18:13 UTC</text>
</svg>
<figcaption>Kp GFZ, трохгадзінныя значэнні. Слупкі з Kp 5 і вышэй вылучаныя.</figcaption>
</figure>

## Дзе я памыліўся

Потым я палічыў раннія страты. Для кожнага запуску Starlink з 2019 года я ўзяў спадарожнікі, якія сышлі з арбіты ў першыя 30 дзён. Мая першая табліца паказала 6 ранніх страт у Group 4-7. У спакойнага запуску 19 сакавіка таксама было 6.

Да іншага слупка я дайшоў не адразу. Для кожнага запуску Starlink 2022 года ў каталогу ад 46 да 54 аб'ектаў, акрамя 2. Запуск 11 верасня ляцеў адной ракетай з BlueWalker 3, у яго 34. У Group 4-7 іх 17. З іх 11 гэта спадарожнікі, якія ацалелі. Астатнія 6 гэта аб'екты, названыя адной літарай, накшталт STARLINK A. Яны сышлі з арбіты з 6 па 12 лютага. Яшчэ 32 спадарожнікі сышлі з арбіты раней, чым атрымалі публічныя нумары ў каталогу.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="49 квадратаў, па адным на кожны спадарожнік Group 4-7. 11 зафарбаваных квадратаў гэта спадарожнікі, якія ацалелі і ёсць у каталогу. 6 квадратаў з контурам акцэнтнага колеру гэта аб'екты, якія трапілі ў каталог пад літарным імем і сышлі з арбіты з 6 па 12 лютага. 32 пункцірныя квадраты гэта спадарожнікі, якія сышлі з арбіты, так і не атрымаўшы запісу ў каталогу. 6 плюс 32 гэта 38 страчаных.">
  <rect x="30" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="182" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="220" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="258" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="30" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="183" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="221" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="259" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="31" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="69" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="107" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="145" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="320" y="50" width="18" height="18" class="f-ink" style="fill-opacity:0.75"/>
  <text x="348" y="64" class="f-label"><tspan x="348" dy="0">11 ацалелі, ёсць у каталогу</tspan></text>
  <rect x="321" y="111" width="16" height="16" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="348" y="117" class="f-label"><tspan x="348" dy="0">6 у каталогу як STARLINK A, B,</tspan><tspan x="348" dy="14">..., сышлі з 6 па 12 лютага</tspan></text>
  <rect x="321" y="171" width="16" height="16" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <text x="348" y="184" class="f-label"><tspan x="348" dy="0">32 сышлі без запісу ў каталогу</tspan></text>
</svg>
<figcaption>CelesTrak SATCAT, запуск 2022-010. 32 спадарожнікі, якіх не хапае, палічаныя як 49 запушчаных мінус 17 запісаў у каталогу.</figcaption>
</figure>

49 мінус 11 гэта 38, той жа лік, што ў артыкулах. Значыць, каталог страту пацвярджае, але толькі як дзірку. Калі лічыць сыходы з арбіты радок за радком, як я спачатку і зрабіў, відаць 6. Запуск 19 сакавіка пайшоў у спакойнае надвор'е і ўсе яго спадарожнікі ў каталогу ёсць. Яго 6 сыходаў прыпалі на дні з 13-га па 30-ы пасля старту, праз некалькі дзён пасля бур узроўню G2, што былі 10 і 14 красавіка. Гэтак жа добра гэта растлумачылі б спадарожнікі, якія не прайшлі праверку і былі наўмысна зведзеныя з арбіты. Гэтага я не правяраў.

## Ці было надвор'е асаблівым для Starlink

Для кожнага з 33 запускаў Starlink у 2022 годзе я падсумаваў ap па трохгадзінных інтэрвалах ад старту прыкладна да канца першых сутак. У Group 4-7 сума 256 пры максімальным Kp 5+.

Гэта не найгоршы выпадак. Запуск 19 студзеня, за 2 тыдні да таго, пайшоў у 02:02 UTC проста ў інтэрвал з Kp 5+. Яго сума за першыя суткі 199, усе 49 спадарожнікаў ёсць у каталогу і страт у першы месяц няма. 7 ліпеня сума была 266 пры Kp 5+. 5 верасня яна была 319 пры Kp 5. Сонечны радыёпаток на хвалі 10,7 см паказвае, наколькі Сонца грэе верхнюю атмасферу. У той дзень ён быў 130, прыкладна як 3 і 4 лютага, калі ён быў 127 і 130. Ніводзін з гэтых 3 запускаў не страціў ніводнага спадарожніка ў першы месяц.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Слупковая дыяграма 33 запускаў Starlink 2022 года па парадку дат. Вышыня слупка гэта сума ap па трохгадзінных інтэрвалах ад запуску прыкладна да канца першых сутак. Вылучаныя: 19 студз 199, страчана 0; Group 4-7 256, страчана 6; 7 ліп 266, страчана 0; 5 вер 319, страчана 0. Group 4-7 не самы высокі слупок. У запускаў 7 ліпеня і 5 верасня сума большая, запуск 19 студзеня пайшоў проста ў Kp 5+ і ніводзін з 3 не страціў ніводнага спадарожніка за першы месяц.">
  <line x1="50" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="44" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="165.7" x2="660" y2="165.7" class="f-plain"/>
  <text x="44" y="169.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="111.4" x2="660" y2="111.4" class="f-plain"/>
  <text x="44" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50" y1="57.1" x2="660" y2="57.1" class="f-plain"/>
  <text x="44" y="61.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="50" y="16" class="f-label f-muted">сума ap за першыя суткі</text>
  <rect x="52.0" y="220.0" width="14.5" height="0.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="70.5" y="112.0" width="14.5" height="108.0" class="f-ink" style="fill-opacity:0.7"/>
  <text x="77.7" y="106.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">199</text>
  <text x="81.7" y="236" text-anchor="end" class="f-label f-ink" style="font-size:11px">19 студз</text>
  <text x="81.7" y="251" text-anchor="end" class="f-mono f-muted" style="font-size:10px">страчана 0</text>
  <rect x="89.0" y="81.0" width="14.5" height="139.0" class="f-accent" style="fill-opacity:1"/>
  <text x="96.2" y="75.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">256</text>
  <text x="92.2" y="236" text-anchor="start" class="f-label f-accent" style="font-size:11px">Group 4-7</text>
  <text x="92.2" y="251" text-anchor="start" class="f-mono f-muted" style="font-size:10px">страчана 6</text>
  <rect x="107.5" y="123.9" width="14.5" height="96.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="125.9" y="214.0" width="14.5" height="6.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="144.4" y="180.4" width="14.5" height="39.6" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="162.9" y="198.8" width="14.5" height="21.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="181.4" y="184.7" width="14.5" height="35.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="199.9" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="218.4" y="152.1" width="14.5" height="67.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="236.8" y="208.6" width="14.5" height="11.4" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="255.3" y="186.3" width="14.5" height="33.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="273.8" y="171.7" width="14.5" height="48.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="292.3" y="186.9" width="14.5" height="33.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="310.8" y="171.1" width="14.5" height="48.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="329.3" y="75.6" width="14.5" height="144.4" class="f-ink" style="fill-opacity:0.7"/>
  <text x="336.5" y="69.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">266</text>
  <text x="336.5" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">7 ліп</text>
  <text x="336.5" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">страчана 0</text>
  <rect x="347.8" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="366.2" y="195.0" width="14.5" height="25.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="384.7" y="143.5" width="14.5" height="76.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="403.2" y="191.2" width="14.5" height="28.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="421.7" y="164.1" width="14.5" height="55.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="440.2" y="185.8" width="14.5" height="34.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="458.7" y="137.5" width="14.5" height="82.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="477.2" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="495.6" y="157.0" width="14.5" height="63.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="514.1" y="46.8" width="14.5" height="173.2" class="f-ink" style="fill-opacity:0.7"/>
  <text x="521.4" y="40.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">319</text>
  <text x="521.4" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">5 вер</text>
  <text x="521.4" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">страчана 0</text>
  <rect x="532.6" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="551.1" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="569.6" y="193.9" width="14.5" height="26.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="588.1" y="141.3" width="14.5" height="78.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="606.5" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="625.0" y="140.2" width="14.5" height="79.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="643.5" y="205.3" width="14.5" height="14.7" class="f-ink" style="fill-opacity:0.25"/>
</svg>
<figcaption>ap GFZ, час запускаў са спісу запускаў Starlink у Вікіпедыі. Лік пад подпісам: колькі спадарожнікаў сышло з арбіты ў першыя 30 дзён, паводле каталога.</figcaption>
</figure>

Трэцяе чаканне таксама спраўдзілася. Менавіта гэта я не магу растлумачыць праз Kp. Па маіх лічбах у Group 4-7 быў дрэнны дзень, але ў 2 іншых запускаў дні былі горшыя і яны ацалелі. SpaceX тады пісала, што бартавы GPS паказаў лабавы супраціў да 50% большы, чым на папярэдніх запусках. Kp гэтага не паказвае. Ён будуецца па даных наземных магнітометраў і не вымярае шчыльнасць паветра на вышыні 210 км уздоўж канкрэтнай арбіты. Артыкулы ацэньваюць гэтую шчыльнасць мадэлямі верхняй атмасферы.

Можа быць, арбіта аддзялення 19 студзеня і 5 верасня была вышэйшая. Для 5 верасня, можа быць, SpaceX пасля лютага інакш абыходзілася з новымі партыямі. Мае табліцы не кажуць, што з гэтага праўда.

## Чаго я не правяраў

Вышыню аддзялення на кожным запуску. Першыя арбіты ляжаць на сайце каталога Касмічных сіл ЗША, а там патрэбны ўліковы запіс. Адкрыты каталог захоўвае толькі апошнюю арбіту. Без іх параўнанне запускаў датычыцца толькі надвор'я. Наколькі кожная партыя была ўразлівая, я сказаць не магу.

Kp за апошнія тыдні года яшчэ папярэдні і некалькі позніх падлікаў могуць зрушыцца. Мяжой ранняй страты я ўзяў 30 дзён. Спадарожнік, які адмовіў на арбіце і сышоў пазней, не залічаны, а планавы сыход у першыя 30 дзён залічаны як страта.

Час стартаў з Вікіпедыі я не зверыў са SpaceX. Памылка на гадзіну зрушыла б акно не больш чым на адзін трохгадзінны інтэрвал.

Наземныя наступствы, энергасеткі і радыё, я таксама не разглядаў. Адзіная сетка, якую я мог праверыць па адкрытых табліцах, была на арбіце. Чаму 19 студзеня і 5 верасня перажылі такое самае надвор'е, я так і не ведаю.
