---
title: "Як часта sourceMappingURL вядзе да зыходнікаў"
description: "Каментар sourceMappingURL ёсць на 30% галоўных старонак з маёй выбаркі 2021 года, але ці аддае карта код насамрэч? Я праверыў 2000 сайтаў толькі праз Wayback Machine. Копія ёсць для 9,0% карт са спасылак. У крыху больш чым паловы сайтаў з зыходнымі файламі ў такой копіі ўсе яны з SDK вендараў, а ўласны код знайшоўся ў 12 сайтаў."
date: 2021-09-11
lang: be
translationKey: source-maps
tags: ["debugging", "statistics", "open-data"]
---
Я заўсёды лічыў відавочным, што `//# sourceMappingURL=` у канцы мініфікаванага бандла азначае, што зыходны код сайта ляжыць за адзін запыт ад цябе. Я ні разу не палічыў, як часта гэта праўда.

У гэтай упэўненасці ёсць прычына. У `react-scripts` 4.0.3 ёсць радок `const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';`. Канфіг для прадакшна ператварае яго ў `devtool: 'source-map'`. Гэта значыць, што зборка Create React App кладзе файл `.map` побач з кожным бандлам, калі толькі хтосьці не напіша слова false. Vue CLI 4.5 робіць тое ж праз `productionSourceMap`, які па змаўчанні true. Сам webpack 5 у прадакшне задае `devtool` значэнне false, так што ўсё залежыць ад таго, хто пісаў канфіг.

Карта зыходнікаў гэта JSON з імёнамі зыходных файлаў у `sources`. Часта ў ёй ляжаць і самі файлы, у `sourcesContent`, з каментарамі і структурай папак.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Мініфікаваны бандл заканчваецца каментаром sourceMappingURL, які паказвае на файл .map. Карта пералічвае імёны зыходных файлаў у sources і можа несці самі файлы з каментарамі ў sourcesContent. Браўзер спампоўвае карту, толькі калі яе просяць інструменты распрацоўшчыка.">
  <rect x="20" y="20" width="640" height="74" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="40" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js, тое, што выконвае браўзер</text>
  <text x="32" y="60" text-anchor="start" class="f-mono f-ink" style="font-size:11px">!function(e){var t={};function n(r){if(t[r])return t[r].exports;…</text>
  <text x="32" y="82" text-anchor="start" class="f-mono f-accent" style="font-size:12px">//# sourceMappingURL=main.3f9c2a.js.map</text>
  <text x="648" y="82" text-anchor="end" class="f-muted" style="font-size:10px">апошні радок бандла</text>
  <line x1="200" y1="96" x2="200" y2="124" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,118 L200,124 L206,118" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <rect x="20" y="126" width="640" height="98" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="146" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js.map, спампоўваецца толькі па запыце</text>
  <text x="32" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:11px">{&quot;version&quot;:3,&quot;file&quot;:&quot;main.3f9c2a.js&quot;,</text>
  <text x="32" y="184" text-anchor="start" class="f-mono f-ink" style="font-size:11px"> &quot;sources&quot;:[&quot;webpack:///./src/hooks/useQueryParam/index.js&quot;,…],</text>
  <text x="32" y="202" text-anchor="start" class="f-mono f-accent" style="font-size:11px"> &quot;sourcesContent&quot;:[&quot;// TODO: …\nexport default function …&quot;,…],</text>
  <text x="32" y="218" text-anchor="start" class="f-mono f-muted" style="font-size:11px"> &quot;mappings&quot;:&quot;AAAA,SAASA,EAAE…&quot;}</text>
  <line x1="200" y1="226" x2="200" y2="254" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,248 L200,254 L206,248" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="32" y="274" text-anchor="start" class="f-muted" style="font-size:11px">што карта можа вярнуць</text>
  <text x="48" y="294" text-anchor="start" class="f-ink" style="font-size:11px">sources: імёны файлаў і папкі</text>
  <text x="48" y="312" text-anchor="start" class="f-accent" style="font-size:11px">sourcesContent: самі файлы</text>
  <text x="48" y="330" text-anchor="start" class="f-accent" style="font-size:11px">каментары, TODO, мёртвы код</text>
</svg>
<figcaption>Каментар гэта толькі адрас. Ці адкрыты зыходны код, вырашае другі файл, які ніводны браўзер сам не спампоўвае. Менавіта яго краўл і не бачыць.</figcaption>
</figure>

## Што ўжо палічылі

Першую палову палічыў Web Almanac 2019. У краўле HTTP Archive за ліпень 2019 года гэта было 18% дэсктопных старонак і 17% мабільных. Лічыліся старонкі, дзе ў скрыпта свайго дамена ёсць `sourceMappingURL`, гэта значыць каментар. Тэма на форуме HTTP Archive ад жніўня 2019 года паказвае на гэтае абмежаванне. Сам Chrome карту ніколі не запытвае, яе запытваюць толькі devtools, таму краўл, які запускае браўзер, не бачыць, ці існуе файл. Вось гэтую другую палову я і хацеў убачыць.

## Як я мераў

Я ўзяў спіс Tranco, створаны 10 верасня 2021 года (id 2779, рангі за 30 дзён да гэтай даты). Узяў усе 1000 верхніх даменаў і 1000 выпадковых даменаў з рангамі ад 1001 да 100000. Для кожнага дамена я ўзяў апошнюю копію галоўнай старонкі ў Wayback Machine з 1 жніўня па 10 верасня 2021 года. Браў сыры выгляд `id_`, без перапісвання архівам. Потым узяў кожны знешні скрыпт гэтай старонкі, не больш за 40, таксама з архіва і толькі копіі з чэрвеня па 10 верасня.

Я не адправіў ніводнага запыту жывым сайтам. Той жа прагон па архіве мусіць даць тыя ж файлы, плюс, магчыма, некалькі копій, якія архіў праіндэксаваў пазней.

З 2000 галоўных старонак як HTML у патрэбным акне вярнуліся 1606: 856 у топ-1000 і 750 у хвасце. Частка верхніх даменаў гэта інфраструктура без галоўнай старонкі, накшталт `googletagmanager.com`. З правераных тэгаў script копія ў акне знайшлася ў 83%.

Сам архіў забраў у мяне амаль усю ноч. Прыкладна праз 2 гадзіны краўла ён пачаў адмаўляць у злучэнні. Першая версія майго краўлера запісвала кожную адмову як "копіі няма". Давялося нанова прайсці 203 дамены і ўсе карты краўлерам, які аддзяляе збой ад пустога адказу. Яшчэ 140 даменаў чакалі архіў, калі я спыніўся, так што галоўных можа быць крыху больш.

## Колькі старонак спасылаецца на карту

Хоць адзін скрыпт са спасылкай на карту: **31,8%** галоўных у топ-1000 і **28,4%** у хвасце. Калі лічыць толькі скрыпты з зарэгістраванага дамена самой старонкі, выходзіць 15,7% і 15,3%. У Almanac у 2019 годзе было ад 17 да 18%, пры іншым краўле і іншым спісе. Частка астатняга гэта адкрытыя бібліятэкі з публічных CDN накшталт jsDelivr або cdnjs. Яшчэ частка гэта копіі Bootstrap і jQuery на ўласным серверы сайта. Там карта выкладзена наўмысна, а зыходнік і так адкрыты, таму далей я лічу іх асобна.

Яшчэ я чакаў карты, убудаваныя проста ў бандл як `data:` URL. Першы праход знайшоў іх на 11 сайтах. 10 з іх аказаліся адным і тым жа кодам са `style-loader`. Ён збірае гэты каментар радком падчас выканання, каб прывязаць карту да ўстаўленага CSS. Мой рэгекс знайшоў радковы літарал. Адна ўбудаваная карта была сапраўднай, без `sourcesContent`. Я ледзь не запісаў гэта як 0,7% сайтаў.

## Як часта ў архіва ёсць сама карта

Старонкі спасылаюцца на 1607 адрасоў знешніх карт. Для **145** з іх, 9,0%, у архіва ёсць копія, зробленая не пазней за 10 верасня 2021 года. Калі дзяліць па ўладальніках, розніца большая, чым я думаў. Сярод карт адкрытых бібліятэк копія ёсць у 69 з 188. Сярод карт на дамене самой старонкі толькі ў 39 з 827. Мая здагадка такая: архіў захоўвае тое, што запытваюць многія. Карту папулярнай бібліятэкі адкрываюць у devtools многія. Карту зборкі аднаго сайта адкрываюць толькі яго распрацоўшчыкі, калі ўвогуле адкрываюць. Я гэтага не правяраў.

З гэтых 145 копій `sourcesContent` ёсць у 84. Карты бібліятэк часта пустыя, у 36 з 69 толькі імёны і `mappings`. З кодам, які не бібліятэка, наадварот: зыходныя файлы ёсць у 51 копіі з 76.

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Варонка па стратах. Топ 1000: галоўная ёсць у архіве 856; спасылаецца на карту (не бібліятэкі) 234, 27,3%; копія карты да 10 верасня 70, 8,2%; у копіі ёсць зыходныя файлы 34, 4,0%; карта на дамене старонкі 11, 1,3%. Рангі 1001–100000: галоўная ёсць у архіве 750; спасылаецца на карту (не бібліятэкі) 159, 21,2%; копія карты да 10 верасня 44, 5,9%; у копіі ёсць зыходныя файлы 38, 5,1%; карта на дамене старонкі 1, 0,1%.">
  <text x="20" y="24" text-anchor="start" class="f-ink" style="font-size:13px">топ 1000</text>
  <text x="320" y="53" text-anchor="end" class="f-muted" style="font-size:11px">галоўная ёсць у архіве</text>
  <rect x="330" y="41" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="53" text-anchor="start" class="f-ink f-mono" style="font-size:11px">856</text>
  <text x="320" y="75" text-anchor="end" class="f-muted" style="font-size:11px">спасылаецца на карту (не бібліятэкі)</text>
  <rect x="330" y="63" width="62.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="400.8" y="75" text-anchor="start" class="f-ink f-mono" style="font-size:11px">234, 27,3%</text>
  <text x="320" y="97" text-anchor="end" class="f-muted" style="font-size:11px">копія карты да 10 верасня</text>
  <rect x="330" y="85" width="18.9" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="356.9" y="97" text-anchor="start" class="f-ink f-mono" style="font-size:11px">70, 8,2%</text>
  <text x="320" y="119" text-anchor="end" class="f-muted" style="font-size:11px">у копіі ёсць зыходныя файлы</text>
  <rect x="330" y="107" width="9.2" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="347.2" y="119" text-anchor="start" class="f-ink f-mono" style="font-size:11px">34, 4,0%</text>
  <text x="320" y="141" text-anchor="end" class="f-muted" style="font-size:11px">карта на дамене старонкі</text>
  <rect x="330" y="129" width="3.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="341.0" y="141" text-anchor="start" class="f-ink f-mono" style="font-size:11px">11, 1,3%</text>
  <text x="20" y="170" text-anchor="start" class="f-ink" style="font-size:13px">рангі 1001–100000, 1000 выпадковых</text>
  <text x="320" y="199" text-anchor="end" class="f-muted" style="font-size:11px">галоўная ёсць у архіве</text>
  <rect x="330" y="187" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="199" text-anchor="start" class="f-ink f-mono" style="font-size:11px">750</text>
  <text x="320" y="221" text-anchor="end" class="f-muted" style="font-size:11px">спасылаецца на карту (не бібліятэкі)</text>
  <rect x="330" y="209" width="48.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="386.8" y="221" text-anchor="start" class="f-ink f-mono" style="font-size:11px">159, 21,2%</text>
  <text x="320" y="243" text-anchor="end" class="f-muted" style="font-size:11px">копія карты да 10 верасня</text>
  <rect x="330" y="231" width="13.6" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="351.6" y="243" text-anchor="start" class="f-ink f-mono" style="font-size:11px">44, 5,9%</text>
  <text x="320" y="265" text-anchor="end" class="f-muted" style="font-size:11px">у копіі ёсць зыходныя файлы</text>
  <rect x="330" y="253" width="11.7" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="349.7" y="265" text-anchor="start" class="f-ink f-mono" style="font-size:11px">38, 5,1%</text>
  <text x="320" y="287" text-anchor="end" class="f-muted" style="font-size:11px">карта на дамене старонкі</text>
  <rect x="330" y="275" width="1.5" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="339.5" y="287" text-anchor="start" class="f-ink f-mono" style="font-size:11px">1, 0,1%</text>
</svg>
<figcaption>Галоўныя старонкі з копіяй з 1 жніўня па 10 верасня 2021 года. Скрыпты адкрытых бібліятэк не лічацца, ні з публічных CDN, ні свае копіі. Копія карты ўлічваецца, толькі калі зробленая не пазней за 10 верасня 2021 года. Большая частка спаду паміж двума апошнімі радкамі гэта скрыпты вендараў.</figcaption>
</figure>

## Чый гэта код

Калі прыбраць бібліятэкі, у 34 галоўных у топ-1000 і 38 у хвасце ёсць хоць адна захаваная карта з зыходнымі файламі. Я чакаў, што гэта будуць уласныя праграмы сайтаў. Часта не. У 38 з гэтых 72 старонак усе такія файлы прыходзяць з 4 скрыптоў вендараў. Адзін толькі SDK пуш-апавяшчэнняў OneSignal стаіць на 26 з іх. Астатнія гэта рэклама Concert, Sailthru і віджэт Trustpilot. Рэпазіторый SDK OneSignal ляжыць на GitHub з 2015 года, так што гэтая карта амаль нічога новага не паказвае. У астатніх старонак гэта карты на іншых хостах, часта на ўласным CDN кампаніі на іншым дамене.

Карты з зыходнымі файламі на дамене самой старонкі: **11 галоўных у топ-1000 і 1 у хвасце**. І копія, знятая да 10 верасня, не абавязкова тая зборка, што працавала тады. У карт з зыходнымі файламі копія ў медыяне на 308 дзён старэйшая за копію галоўнай старонкі. Калі дапусціць розніцу не больш за 100 дзён, застаецца 16 сайтаў, з іх 10 у топ-1000, з улікам вендараў.

У гэтых файлах ляжыць тое, што мініфікацыя выкідае. У палове з 47 карт з файламі сайта або яго вендара каментары займаюць не менш за 9% радкоў, а ў 11 картах ёсць пазнакі TODO. Структура папак таксама на месцы, нешта накшталт `src/hooks/useQueryParam/index.js`.

<figure class="fig">
<svg viewBox="0 0 680 176" role="img" aria-label="Адрасы знешніх карт па ўладальніку скрыпта. дамен самой старонкі: 827, 39 з 827 (4,7%), sourcesContent 26; іншы хост (свой CDN, вендар): 592, 37 з 592 (6,3%), sourcesContent 25; адкрытая бібліятэка: 188, 69 з 188 (36,7%), sourcesContent 33.">
  <rect x="20" y="12" width="12" height="10" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">адрасоў у спасылках</text>
  <rect x="240" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <text x="258" y="22" text-anchor="start" class="f-muted" style="font-size:11px">копія да 10 верасня</text>
  <rect x="460" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="478" y="22" text-anchor="start" class="f-muted" style="font-size:11px">з sourcesContent</text>
  <text x="290" y="60" text-anchor="end" class="f-ink" style="font-size:11px">дамен самой старонкі</text>
  <rect x="300" y="46" width="260.0" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="54" width="12.3" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="62" width="8.2" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="568" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">827</text>
  <text x="340" y="70" text-anchor="start" class="f-mono f-accent" style="font-size:11px">39 з 827, 4,7%, з файламі 26</text>
  <text x="290" y="104" text-anchor="end" class="f-ink" style="font-size:11px">іншы хост (свой CDN, вендар)</text>
  <rect x="300" y="90" width="186.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="98" width="11.6" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="106" width="7.9" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="494.11850060459494" y="100" text-anchor="start" class="f-mono f-muted" style="font-size:11px">592</text>
  <text x="340" y="114" text-anchor="start" class="f-mono f-accent" style="font-size:11px">37 з 592, 6,3%, з файламі 25</text>
  <text x="290" y="148" text-anchor="end" class="f-ink" style="font-size:11px">адкрытая бібліятэка</text>
  <rect x="300" y="134" width="59.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="142" width="21.7" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="150" width="10.4" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="367.1051995163241" y="144" text-anchor="start" class="f-mono f-muted" style="font-size:11px">188</text>
  <text x="340" y="158" text-anchor="start" class="f-mono f-accent" style="font-size:11px">69 з 188, 36,7%, з файламі 33</text>
</svg>
<figcaption>Розныя адрасы карт з усіх галоўных, па хосце скрыпта. Да бібліятэк аднесеныя і копіі файлаў накшталт jQuery на серверы самога сайта. У архіва ёсць копія больш чым для траціны карт бібліятэк і менш чым для 5% карт на дамене самой старонкі.</figcaption>
</figure>

Выходзіць, першая палова маёй упэўненасці трымаецца. Амаль траціна старонак спасылаецца на карту. Другую палову па архіве я пацвердзіць не магу. Карта ёсць у некалькіх працэнтаў старонак і часцей з кодам вендара, чым з кодам самога сайта. Свежая копія ёсць прыкладна ў 1 сайта са 100.

## Чаго я не правяраў

Галоўнае гэта жывыя серверы. Архіў кажа "у мяне ёсць" або "не ведаю", але не кажа, што сервер адказаў 404. Так што 30% гэта доля старонак, якія кудысьці спасылаюцца. А сайтаў, дзе я магу паказаць уласны код за такой спасылкай, усяго 12. Частка гэтых сервераў цалкам можа аддаць карту кожнаму, хто папросіць.

Правяраліся толькі галоўныя, так што доля сайтаў, дзе карта згадваецца хоць на адной старонцы, хутчэй за ўсё, вышэйшая. У 17% тэгаў script копіі ў акне не было, так што і па гэтай прычыне сапраўдная доля, хутчэй за ўсё, вышэйшая за 30%. Хвост гэта 750 старонак выпадковай выбаркі, таму ў 28,4% інтэрвал прыкладна ад 25 да 32%. Сакрэты ў файлах я не шукаў. Сайты, чый уласны код ляжыць у архіве, я таксама не называю. Падзел на ўласны код і вендараў мой, зроблены ўручную для 4 SDK ужо пасля падліку.

Для ліку сайтаў, дзе карта сапраўды ёсць, у мяне толькі ніжняя мяжа. Наступны крок гэта спытаць у сервераў пра 1607 карт, запытам HEAD і нічым больш.
