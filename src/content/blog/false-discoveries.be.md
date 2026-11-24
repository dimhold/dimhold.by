---
title: "Лік з капелюша карэлюе з 298 паказчыкамі Сусветнага банка з 968"
description: "Я 2000 разоў раздаў 214 краінам выпадковыя лікі і параўнаў іх з 968 паказчыкамі Сусветнага банка. У сярэднім выйшлі абяцаныя 5% фальшывых пападанняў, але самае ўдалае перамешванне дало 298, а палова фальшывых пападанняў паўтарылася ў даных за іншы год. Банфероні, Бенджаміні-Хохберг і дзяленне краін напалам, з лікамі."
date: 2015-01-25
lang: be
translationKey: false-discoveries
tags: ["statistics", "open-data", "numbers"]
---

Я раздаў 214 краінам лікі ад 1 да 214 у выпадковым парадку. Бурундзі выпала адзінка, Румыніі 214. Потым параўнаў гэты лік з кожнай калонкай табліцы Сусветнага банка за 2010 год. Тэлефонныя лініі на 100 чалавек далі рангавую карэляцыю 0,36 пры p = 0,00000012. У працягласці жыцця і ВУП на душу насельніцтва p меншае за 0,0003. Усяго p ніжэй за 0,05 атрымалі 298 калонак з 968.

Гэта самае ўдалае перамешванне з 2000 і шукаў я яго знарок. Але і на звычайныя даныя я часта глядзеў гэтак жа: адкрыю табліцу, параўнаю ўсё з усім і пакіну тое, што выглядае моцным. Потым праверу моцнае на даных за іншы год, убачу яго і там і супакоюся. Чаго вартая такая праверка, я ніколі не вымяраў.

## Што я ўзяў

Даныя ўзятыя з World Development Indicators, гэта выпуск снежня 2014 года, адзін файл Excel на 82 МБ. Я пакінуў 2010 год, выкінуў агрэгаты накшталт "свету" і "зоны еўра" і атрымаў 214 краін. З 1345 радоў падышлі 968, у іх ёсць даныя хоць бы па 100 краінах і хоць бы 20 розных значэнняў. Тэст усюды адзін, рангавая карэляцыя Спірмена, p лічыцца праз t-набліжэнне. Скрыпт на Python з numpy і scipy, пачатковае значэнне генератара зафіксаванае.

Нічога новага тут няма. Бенет з сааўтарамі ў 2009 годзе знайшоў "актыўнасць мозгу" ў мёртвага ласося. Тайлер Віген з мінулага мая збірае на сваім сайце фальшывыя карэляцыі. Працэдура Бенджаміні і Хохберга, далей BH, выйшла ў 1995 годзе, а Эфран у 2007-м апісаў, як залежнасць тэстаў мяняе колькасць фальшывых пападанняў. Мне хацелася ўбачыць, якога памеру гэта бывае на табліцы, у якой сапраўды капаюцца.

## Мэта без сэнсу аказалася з сэнсам

Пачаў я з 2 мэт без ніякага сэнсу і да прагону запісаў, што кожная дасць каля 5%, гэта значыць 48 калонак. Месца краіны ў алфавіце дало 15. Даўжыня англійскай назвы дала 84, у наймацнейшай з гэтых калонак p = 0,00007.

Гэта была плошча сушы, за ёй ішлі агульная плошча і ворыўныя землі. У чвэрці краін з найбольшым насельніцтвам у назве ў сярэднім 8,0 знака, у чвэрці з найменшым 11,4. Невялікія тэрыторыі называюцца "Sint Maarten (Dutch part)" або "St. Vincent and the Grenadines". Сэнс у мэты быў, проста я яго не заўважыў. З 84 калонак BH пры q = 0,05 пакінуў толькі плошчу сушы і агульную плошчу, амаль адну і тую ж калонку двойчы. Думаю, ён мае рацыю. Але прыкладам таго, дзе нічога няма, яна быць перастала, таму я перайшоў да перамешванняў.

## 5% толькі ў сярэднім

Я 2000 разоў раздаў краінам гэтыя лікі ад 1 да 214. Для параўнання зрабіў 968 незалежных калонак шуму з тымі ж прапускамі, што ў сапраўдных.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Гістаграма 2000 перамешванняў мэты, у якой няма сэнсу. Па гарызанталі колькасць калонак з 968, у якіх p меншае за 0,05. У незалежных шумавых калонак амаль усе перамешванні ляжаць паміж 30 і 70, дыяпазон ад 5 да 95 працэнтаў ідзе ад 37 да 60. У сапраўдных калонак Сусветнага банка дыяпазон ад 13 да 134, а хвост даходзіць да 298. Сярэдняе ў абедзвюх 48,4.">
  <line x1="60" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="52.0" y="244.0" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="60" y1="173.3" x2="660" y2="173.3" class="f-plain"/>
  <text x="52.0" y="177.3" text-anchor="end" class="f-label f-muted">400</text>
  <line x1="60" y1="106.7" x2="660" y2="106.7" class="f-plain"/>
  <text x="52.0" y="110.7" text-anchor="end" class="f-label f-muted">800</text>
  <line x1="60" y1="40.0" x2="660" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-label f-muted">1200</text>
  <rect x="101.0" y="239.0" width="18.0" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.0" y="208.8" width="18.0" height="31.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="141.0" y="80.7" width="18.0" height="159.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="161.0" y="119.0" width="18.0" height="121.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="181.0" y="219.8" width="18.0" height="20.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="201.0" y="239.5" width="18.0" height="0.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="221.0" y="239.8" width="18.0" height="0.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="65.0" y="235.3" width="10.0" height="4.7" style="fill:var(--accent);stroke:none"/>
  <rect x="85.0" y="187.5" width="10.0" height="52.5" style="fill:var(--accent);stroke:none"/>
  <rect x="105.0" y="166.0" width="10.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.0" y="182.8" width="10.0" height="57.2" style="fill:var(--accent);stroke:none"/>
  <rect x="145.0" y="201.2" width="10.0" height="38.8" style="fill:var(--accent);stroke:none"/>
  <rect x="165.0" y="214.8" width="10.0" height="25.2" style="fill:var(--accent);stroke:none"/>
  <rect x="185.0" y="223.5" width="10.0" height="16.5" style="fill:var(--accent);stroke:none"/>
  <rect x="205.0" y="228.2" width="10.0" height="11.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.0" y="230.3" width="10.0" height="9.7" style="fill:var(--accent);stroke:none"/>
  <rect x="245.0" y="231.2" width="10.0" height="8.8" style="fill:var(--accent);stroke:none"/>
  <rect x="265.0" y="234.0" width="10.0" height="6.0" style="fill:var(--accent);stroke:none"/>
  <rect x="285.0" y="235.0" width="10.0" height="5.0" style="fill:var(--accent);stroke:none"/>
  <rect x="305.0" y="236.0" width="10.0" height="4.0" style="fill:var(--accent);stroke:none"/>
  <rect x="325.0" y="235.5" width="10.0" height="4.5" style="fill:var(--accent);stroke:none"/>
  <rect x="345.0" y="236.3" width="10.0" height="3.7" style="fill:var(--accent);stroke:none"/>
  <rect x="365.0" y="236.7" width="10.0" height="3.3" style="fill:var(--accent);stroke:none"/>
  <rect x="385.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="405.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="425.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="485.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="505.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="545.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="565.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="605.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="625.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="645.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <text x="60.0" y="258.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="160.0" y="258.0" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-label f-muted">100</text>
  <text x="360.0" y="258.0" text-anchor="middle" class="f-label f-muted">150</text>
  <text x="460.0" y="258.0" text-anchor="middle" class="f-label f-muted">200</text>
  <text x="560.0" y="258.0" text-anchor="middle" class="f-label f-muted">250</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-label f-muted">300</text>
  <text x="654.0" y="230.0" text-anchor="end" class="f-label f-ink">максімум 298</text>
  <text x="10.0" y="22.0" text-anchor="start" class="f-label f-muted">перамешванняў</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted">калонак з p меншым за 0,05</text>
  <rect x="320.0" y="62.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="340.0" y="72.0" text-anchor="start" class="f-label f-ink">калонкі WDI</text>
  <rect x="320.0" y="84.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="340.0" y="94.0" text-anchor="start" class="f-label f-ink">шум з тымі ж прапускамі</text>
</svg>
<figcaption>Колькі калонак з 968 атрымалі p меншае за 0,05 у кожным з 2000 перамешванняў. Сярэдняе ў абедзвюх гістаграм 48,4. Тонкія слупкі ў правым хвасце гэта ад 1 да 8 перамешванняў, яны намаляваныя вышэй за маштаб, каб іх было відаць.</figcaption>
</figure>

| пападанняў з p < 0,05 з 968 | калонкі WDI | шум |
|---|---|---|
| сярэдняе | 48,4 | 48,4 |
| медыяна | 35 | 48 |
| 5-ы працэнтыль | 13 | 37 |
| 95-ы працэнтыль | 134 | 60 |
| максімум | 298 | 82 |
| перамешванняў, дзе Банфероні нешта знайшоў | 48 | 98 |
| перамешванняў, дзе BH нешта знайшоў | 57 | 104 |

Сярэдняе ў абодвух выпадках акурат абяцаныя 5%. Але стандартнае адхіленне ў шуму 7 калонак, а ў сапраўдных 40. WDI паўтарае сам сябе, смяротнасць хлопчыкаў да года стаіць побач са смяротнасцю дзяўчынак. У 574 калонак з 968 ёсць двайнік з рангавай карэляцыяй больш за 0,9 па модулі. Я браў толькі пары, у якіх ёсць хоць бы 50 агульных краін.

Я падумаў, што ўдалыя лікі леглі на багацце. Тады прыбраў уплыў ВУП на душу насельніцтва, гэта значыць палічыў частковую рангавую карэляцыю. З 298 пападанняў засталося 15. У 10,9% усіх перамешванняў пападанняў удвая больш за чаканае або яшчэ больш. Калі я перамешваў самі даўжыні назваў, 84 пападанні і больш далі 13,8% прагонаў. Сама па сабе колькасць пападанняў мне амаль нічога не кажа.

Банфероні і BH стрымалі абяцаныя 5%, хоць нешта яны знайшлі ў 2,4% і 2,9% перамешванняў. Але памылка ў BH бывала вялікай. У тым самым удалым перамешванні ён прыняў 117 калонак.

## Іншы год, але тыя самыя краіны

Цяпер мая звычка. Я ўзяў усе фальшывыя пападанні 2010 года ва ўсіх перамешваннях, толькі па тых калонках, якія дастаткова запоўненыя і ў 2005-м, іх 931. І праверыў тыя ж лікі на даных за 2005 год.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Слупкі: доля фальшывых знаходак, якія паўтарыліся з p меншым за 0,05 і з тым самым знакам. Тыя ж краіны ў 2005 годзе: усе знаходкі 49,9 працэнта, найлепшая калонка 60,1 працэнта. Другая палова краін: усе знаходкі 2,2 працэнта, найлепшая калонка 2,5 працэнта, хоць бы адна з 20 найлепшых 27,9 працэнта, хоць бы адна з 50 найлепшых 48,5 працэнта.">
  <text x="10.0" y="30.0" text-anchor="start" class="f-label f-ink">тыя ж краіны, 2005 год</text>
  <text x="180.0" y="57.0" text-anchor="end" class="f-label f-muted">усе знаходкі</text>
  <rect x="190.0" y="42.0" width="292.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="490.1" y="57.0" text-anchor="start" class="f-mono f-ink">49,9%</text>
  <text x="180.0" y="85.0" text-anchor="end" class="f-label f-muted">найлепшая</text>
  <rect x="190.0" y="70.0" width="352.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="550.0" y="85.0" text-anchor="start" class="f-mono f-ink">60,1%</text>
  <text x="10.0" y="114.0" text-anchor="start" class="f-label f-ink">другая палова краін</text>
  <text x="180.0" y="141.0" text-anchor="end" class="f-label f-muted">усе знаходкі</text>
  <rect x="190.0" y="126.0" width="12.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="210.7" y="141.0" text-anchor="start" class="f-mono f-ink">2,2%</text>
  <text x="180.0" y="169.0" text-anchor="end" class="f-label f-muted">найлепшая</text>
  <rect x="190.0" y="154.0" width="14.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="212.6" y="169.0" text-anchor="start" class="f-mono f-ink">2,5%</text>
  <text x="180.0" y="197.0" text-anchor="end" class="f-label f-muted">адна з 20 найлепшых</text>
  <rect x="190.0" y="182.0" width="163.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="361.4" y="197.0" text-anchor="start" class="f-mono f-ink">27,9%</text>
  <text x="180.0" y="225.0" text-anchor="end" class="f-label f-muted">адна з 50 найлепшых</text>
  <rect x="190.0" y="210.0" width="284.1" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="482.1" y="225.0" text-anchor="start" class="f-mono f-ink">48,5%</text>
  <line x1="190" y1="34" x2="190" y2="238" class="f-plain"/>
</svg>
<figcaption>Як часта другая праверка пацвярджае фальшывую знаходку: p меншае за 0,05 і той самы знак. Усе знаходкі на другой палове ўзятыя з 500 дзяленняў, 3 слупкі пад імі з 1000.</figcaption>
</figure>

З 93 302 фальшывых пападанняў 46 527 паўтарыліся з p ніжэй за 0,05 і тым самым знакам. Гэта 49,9%, а на незалежных даных выйшла б 2,5%. Найлепшая калонка перамешвання паўтарылася ў 60,1% выпадкаў. У тым удалым перамешванні паўтарыліся 188 пападанняў з 281. Цяпер усё здаецца зразумелым, медыянная рангавая карэляцыя калонкі з самой сабой праз 5 гадоў роўная 0,91. Супакойваўся я рана.

Другая палова краін працуе значна лепш. Я рэзаў спіс выпадкова, шукаў у адной палове і правяраў на другой. Паўтарылася 2,2% з 24 120 пападанняў у 500 дзяленнях, найлепшая калонка паўтарылася ў 2,5% з іншых 1000. Але гэта для аднаго кандыдата. Калі несці ў другую палову 20 найлепшых калонак, хоць бы адна з іх паўторыцца ў 27,9% прагонаў, з 50 калонкамі ўжо ў 48,5%. Калі я падзяліў другі парог на колькасць прынесеных калонак, для 20 стала 1,8%.

## З вядомым адказам

Даныя, у якіх нічога няма, гэта просты выпадак. Таму я зрабіў сумесі. Мэта тут чаканая працягласць жыцця ў 60 выпадковых краінах, да яе 100 сапраўдных калонак WDI без дэмаграфіі і 900 калонак, перамяшаных паміж краінамі. У другой сумесі 10 сапраўдных і 990 перамяшаных. Кожную я паўтарыў 200 разоў. Радок "паловы" значыць, што p ніжэй за 0,05 у абедзвюх паловах краін і знак супаў.

| спосаб | сапраўдных са 100 | перамяшаных сярод знойдзенага | сапраўдных з 10 | перамяшаных сярод знойдзенага |
|---|---|---|---|---|
| p < 0,05 | 55,6 | 44,5% | 5,5 | 89,8% |
| Банфероні | 21,9 | 0,3% | 2,1 | 1,8% |
| BH, q = 0,05 | 35,5 | 5,2% | 2,4 | 5,7% |
| паловы | 27,7 | 4,4% | 2,7 | 29,0% |

<figure class="fig">
<svg viewBox="0 0 680 334" role="img" aria-label="Што знайшоў кожны спосаб у сумесях сапраўдных і перамяшаных калонак, сярэдняе па 200 паўторах. 100 сапраўдных + 900 перамяшаных: p &lt; 0,05: сапраўдных 55,6, перамяшаных 44,6, Банфероні: сапраўдных 21,9, перамяшаных 0,07, BH, q = 0,05: сапраўдных 35,5, перамяшаных 2,0, дзве паловы: сапраўдных 27,7, перамяшаных 1,2. 10 сапраўдных + 990 перамяшаных: p &lt; 0,05: сапраўдных 5,5, перамяшаных 49,5, Банфероні: сапраўдных 2,1, перамяшаных 0,07, BH, q = 0,05: сапраўдных 2,4, перамяшаных 0,23, дзве паловы: сапраўдных 2,7, перамяшаных 1,2. Мэта: чаканая працягласць жыцця ў 60 краінах.">
  <rect x="170.0" y="14.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="188.0" y="24.0" text-anchor="start" class="f-label f-ink">сапраўдныя</text>
  <rect x="300.0" y="14.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="318.0" y="24.0" text-anchor="start" class="f-label f-ink">перамяшаныя</text>
  <text x="10.0" y="58.0" text-anchor="start" class="f-label f-ink">100 сапраўдных + 900 перамяшаных</text>
  <text x="160.0" y="85.0" text-anchor="end" class="f-label f-muted">p &lt; 0,05</text>
  <rect x="170.0" y="70.0" width="206.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="376.4" y="70.0" width="165.5" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="549.9" y="85.0" text-anchor="start" class="f-mono f-ink">44,5%</text>
  <text x="160.0" y="112.0" text-anchor="end" class="f-label f-muted">Банфероні</text>
  <rect x="170.0" y="97.0" width="81.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="251.4" y="97.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="259.7" y="112.0" text-anchor="start" class="f-mono f-ink">0,3%</text>
  <text x="160.0" y="139.0" text-anchor="end" class="f-label f-muted">BH, q = 0,05</text>
  <rect x="170.0" y="124.0" width="131.9" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="301.9" y="124.0" width="7.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="317.3" y="139.0" text-anchor="start" class="f-mono f-ink">5,2%</text>
  <text x="160.0" y="166.0" text-anchor="end" class="f-label f-muted">дзве паловы</text>
  <rect x="170.0" y="151.0" width="102.8" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="272.8" y="151.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="285.2" y="166.0" text-anchor="start" class="f-mono f-ink">4,4%</text>
  <text x="10.0" y="202.0" text-anchor="start" class="f-label f-ink">10 сапраўдных + 990 перамяшаных</text>
  <text x="160.0" y="229.0" text-anchor="end" class="f-label f-muted">p &lt; 0,05</text>
  <rect x="170.0" y="214.0" width="20.5" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.5" y="214.0" width="183.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="382.2" y="229.0" text-anchor="start" class="f-mono f-ink">89,8%</text>
  <text x="160.0" y="256.0" text-anchor="end" class="f-label f-muted">Банфероні</text>
  <rect x="170.0" y="241.0" width="7.7" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="177.7" y="241.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="185.9" y="256.0" text-anchor="start" class="f-mono f-ink">1,8%</text>
  <text x="160.0" y="283.0" text-anchor="end" class="f-label f-muted">BH, q = 0,05</text>
  <rect x="170.0" y="268.0" width="9.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="179.0" y="268.0" width="0.9" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="187.8" y="283.0" text-anchor="start" class="f-mono f-ink">5,7%</text>
  <text x="160.0" y="310.0" text-anchor="end" class="f-label f-muted">дзве паловы</text>
  <rect x="170.0" y="295.0" width="10.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="180.0" y="295.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="192.4" y="310.0" text-anchor="start" class="f-mono f-ink">29,0%</text>
</svg>
<figcaption>Сярэдняя колькасць знойдзеных калонак з 1000, 200 паўтораў. Працэнт паказвае долю перамяшаных сярод знойдзенага.</figcaption>
</figure>

У першай сумесі паловы і BH падобныя, толькі BH знаходзіць больш. У другой паловы далі 29,0% фальшывых калонак. Праз абедзве паловы ў любой з сумесяў праходзіць каля 1,2 перамяшанай калонкі, проста сапраўдных побач з імі стала менш. Колькі калонак я перабраў, паловы не ведаюць.

5,2% мяне збянтэжылі. Пры 90% пустых калонак BH павінен даваць каля 4,5%. Я праверыў t-набліжэнне на 2 мільёнах выпадковых перастановак. Пры p ніжэй за 0,002 і колькасці краін ад 36 да 60 сапраўдная частата вышэйшая за заяўленую, дзе на 7%, дзе на 14%. Я ўжо збіраўся напісаць, што гэтым усё і тлумачыцца, але стандартная памылка сярэдняга па 200 паўторах каля 0,27 пункта. Паўтарыў сумесь 1000 разоў з іншым пачатковым значэннем і атрымаў 4,7%. З p з перастановак замест t-набліжэння тыя ж прагоны далі 4,3%. Значыць, набліжэнне каштуе каля 0,4 пункта, а рэшта маіх 5,2% хутчэй выпадковасць. І гэта сярэдняе, у 8,5% з 1000 прагонаў у спісе BH фальшывай была больш чым дзясятая частка.

## Чаго я не правяраў

Узяў я толькі парныя рангавыя карэляцыі і толькі адзін год для пошуку. "Сапраўдныя" ў сумесі гэта дапушчэнне: на 200 краінах у 72% такіх калонак з працягласцю жыцця p ніжэй за 0,05, астатнія могуць быць пустымі. Суседнія краіны падобныя адна да адной, а перамешванне гэта ламае, таму з сапраўднай мэтай паловы менш незалежныя, чым у мяне. Варыянт BH для залежных тэстаў, які Бенджаміні і Екуціелі апублікавалі ў 2001 годзе, я не запускаў.
