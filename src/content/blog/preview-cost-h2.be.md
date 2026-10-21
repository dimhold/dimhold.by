---
title: "У README я напісаў, што H2 не ўзнаўляе мае лічбы з Postgres. Праз TCP ён лёг побач з лакальным Postgres"
description: "У README майго замеру прэв'ю напісана, што H2 у памяці не ўзнаўляе, колькі сапраўднай базе каштуюць запіс і скід. Я запусціў нязменены харнэс на H2 2.3.232 і на лакальным PostgreSQL 16.14. H2 даў той жа вердыкт са штрафам 0,5 мс супраць 0,8-1,2. H2 як TCP-сервер лёг у межах 0,1 мс ад лакальнага Postgres на ціхай машыне. Проксі, які затрымлівае кожны з 3 зваротаў да сервера, выходзіць на 6 мс з README прыкладна пры 1,6 мс на зварот. Абяцанне 10 секунд слушнае з другога запуску, першы заняў 24 с."
date: 2026-09-27
lang: be
translationKey: preview-cost-h2
tags: ["databases", "performance"]
---
У жніўні я выклаў на GitHub невялікі замер, [`preview-cost`](https://github.com/dimhold/preview-cost). Ён пытае, колькі каштуе жывое прэв'ю, калі пабудаваць яго на адкаце транзакцыі. Прэв'ю запісвае значэнні з паўзунка, чытае мадэль назад, лічыць і адкочваецца. Другая стратэгія гэта копія ў памяці, якая базу не чапае зусім. На Postgres 16 у Docker адкат прайграў ва ўсіх 4500 парах, на 40 планах на 6,16 мс.

Раздзел README пра запуск дае 2 абяцанні. Па змаўчанні стаіць H2 у рэжыме Postgres, таму абяцаны прагон за 10 секунд "with nothing installed". А лічбы ў табліцы зняты з сапраўднага Postgres, "because H2 in memory does not reproduce what a write and discard costs a real database".

Другую фразу я напісаў, ні разу як след не паглядзеўшы на прагон з H2. Гэта тое, што ўсе кажуць пра H2 і я сам кажу тое ж, калі нехта хоча тэставаць на ім. Бярыце сапраўдную базу, убудаваная хлусіць. Выходзіць, рэжым па змаўчанні ў маім рэпазіторыі гэта рэжым, які, паводле таго ж README, лічбаў не ўзнаўляе. Гэтым разам я яго запусціў.

## 10 секунд

Я скланаваў рэпазіторый на каміце `26dd519` у пусты каталог з пустым кэшам Gradle, на віртуалцы з 4 vCPU і Gradle 9.8.0. Абгорткі Gradle у рэпазіторыі няма, так што "nothing installed" ужо значыць JDK 25 плюс Gradle. Дзеля справядлівасці, README кажа гэта ў сказе якраз перад абяцаннем.

Калі на машыне толькі JDK 21, зборка спыняецца праз 16 с. Тулчэйн просіць версію 25, а спампаваць яе Gradle няма адкуль. З Temurin 25.0.4.1 першы `gradle run` на пустым кэшы заняў 24 с. Наступныя 3 запускі занялі па 6-7 с. Значыць, абяцанне 10 секунд слушнае з другога запуску. Той, хто клануе рэпазіторый упершыню, чакае 24 с.

## Што кажа H2

Прагон па змаўчанні гэта 5 свежых JVM па 300 парных прэв'ю ў кожнай. Я запусціў нязменены `Bench` на H2 2.3.232 у памяці і на PostgreSQL 16.14, усталяванага лакальна на тую ж віртуалку, з pgjdbc 42.7.4. Кожны памер прайшоў двойчы. У табліцы медыяна рознасці "адкат мінус копія".

| планы | H2 у памяці | PostgreSQL 16.14, лакальна | README, Postgres у Docker |
|---|---|---|---|
| 10 | 0,50 / 0,54 мс | 0,78 / 0,76 мс | 6,54 мс |
| 40 | 0,50 / 0,46 мс | 0,91 / 0,83 мс | 6,16 мс |
| 120 | 0,49 / 0,47 мс | 1,22 / 1,18 мс | 7,02 мс |

На кожнай базе і кожным памеры адкат быў павольнейшы ў 99,4-100% пар. H2 дае той жа вердыкт, што і README, толькі лічба ў 12-15 разоў меншая. Лакальны Postgres адрозніваецца ад H2 у 1,4-2,6 раза, а Postgres з README ад лакальнага ў 6-9 разоў.

Я чакаў, што на H2 адкат стане амаль бясплатным, бо нічога не выходзіць за межы працэсу. Не стаў. Я расклаў прэв'ю з адкатам на крокі ў адной JVM. На H2 у памяці адно толькі абнаўленне 4 радкоў заняло 238-291 мкс. На 40 планах гэта прыкладна ў 4 разы больш за ўвесь разлік, які заняў 59 мкс.

## Дзе сядзіць розніца

H2 умее працаваць і серверам. Гэта той жа рухавік з тым жа захоўваннем у памяці. Але драйвер размаўляе з ім праз TCP-сокет на localhost, гэтак жа, як pgjdbc размаўляе з Postgres. Я дадаў яго ў сетку да астатніх, разам з H2 з файлам на дыску. Варыянт з файлам супаў з H2 у памяці, 0,49-0,59 мс, таму на графіку яго няма.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Гарызантальныя слупкі, 3 групы для 10, 40 і 120 планаў. У кожнай групе медыяна штрафу прэв'ю з адкатам адносна копіі ў памяці. 10 планаў: H2 у памяці 0,50 / 0,54, H2 праз TCP 0,84 / 0,83, лакальны PostgreSQL 0,78 / 0,76, README 6,54 мс; 40 планаў: H2 у памяці 0,50 / 0,46, H2 праз TCP 0,82 / 0,82, лакальны PostgreSQL 0,91 / 0,83, README 6,16 мс; 120 планаў: H2 у памяці 0,49 / 0,47, H2 праз TCP 1,22 / 1,25, лакальны PostgreSQL 1,22 / 1,18, README 7,02 мс. H2 праз TCP і лакальны Postgres разыходзяцца менш чым на 0,1 мс на кожным памеры, лічбы README з Postgres у Docker большыя ў 6-9 разоў.">
  <line x1="523.3333333333333" y1="22" x2="523.3333333333333" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="470" y1="22" x2="470" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="416.66666666666663" y1="22" x2="416.66666666666663" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="363.33333333333337" y1="22" x2="363.33333333333337" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="310" y1="22" x2="310" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="256.6666666666667" y1="22" x2="256.6666666666667" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="203.33333333333334" y1="22" x2="203.33333333333334" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="150" y1="22" x2="150" y2="256" class="f-line" style="opacity:0.25"/>
  <text x="10" y="66" class="f-mono f-ink" style="font-size:12px">10 планаў</text>
  <rect x="150" y="30" width="27.7" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="183.7" y="41" class="f-mono f-ink" style="font-size:11px">0,50 / 0,54  H2 у памяці</text>
  <rect x="150" y="46" width="44.5" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="200.5" y="57" class="f-mono f-ink" style="font-size:11px">0,84 / 0,83  H2 праз TCP</text>
  <rect x="150" y="62" width="41.1" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="197.1" y="73" class="f-mono f-ink" style="font-size:11px">0,78 / 0,76  PostgreSQL, лакальна</text>
  <rect x="150" y="78" width="348.8" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="89" class="f-mono f-muted" style="font-size:11px">6,54  README, Docker</text>
  <text x="10" y="144" class="f-mono f-ink" style="font-size:12px">40 планаў</text>
  <rect x="150" y="108" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="119" class="f-mono f-ink" style="font-size:11px">0,50 / 0,46  H2 у памяці</text>
  <rect x="150" y="124" width="43.7" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="199.7" y="135" class="f-mono f-ink" style="font-size:11px">0,82 / 0,82  H2 праз TCP</text>
  <rect x="150" y="140" width="46.4" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="202.4" y="151" class="f-mono f-ink" style="font-size:11px">0,91 / 0,83  PostgreSQL, лакальна</text>
  <rect x="150" y="156" width="328.5" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="167" class="f-mono f-muted" style="font-size:11px">6,16  README, Docker</text>
  <text x="10" y="222" class="f-mono f-ink" style="font-size:12px">120 планаў</text>
  <rect x="150" y="186" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="197" class="f-mono f-ink" style="font-size:11px">0,49 / 0,47  H2 у памяці</text>
  <rect x="150" y="202" width="65.9" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="221.9" y="213" class="f-mono f-ink" style="font-size:11px">1,22 / 1,25  H2 праз TCP</text>
  <rect x="150" y="218" width="64.0" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="220.0" y="229" class="f-mono f-ink" style="font-size:11px">1,22 / 1,18  PostgreSQL, лакальна</text>
  <rect x="150" y="234" width="374.4" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="245" class="f-mono f-muted" style="font-size:11px">7,02  README, Docker</text>
  <text x="150" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="203.33333333333334" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="256.6666666666667" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="310" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="363.33333333333337" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="416.66666666666663" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="470" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="523.3333333333333" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150" y="14" class="f-mono f-muted" style="font-size:11px">адкат мінус копія, мс (па 2 праходы)</text>
</svg>
<figcaption>Слупок гэта сярэдняе 2 праходаў, у подпісе абодва. H2 праз TCP супадае з лакальным Postgres на кожным памеры. Слупок README гэта адна лічба са жніўня.</figcaption>
</figure>

H2 праз TCP даў 0,84 / 0,83, 0,82 / 0,82 і 1,22 / 1,25 мс. Гэта ў межах 0,1 мс ад лакальнага Postgres на кожным памеры, уключна з уздымам на 120 планах. Значыць, на гэтым харнэсе большая частка разрыву паміж H2 і Postgres прыпадае на сокет і сервер за ім. У маёй фразе не было ні таго, ні другога. Я праверыў яшчэ раз на той жа віртуалцы, калі яе грузіла іншая задача. Тады H2 праз TCP апынуўся на 0,04-0,23 мс вышэй за Postgres на 40 планах, так што 0,1 мс гэта лічба з ціхай машыны.

Запіс і скід адрозніваюцца менш, чым я думаў. На H2 у памяці абнаўленне заняло 238-291 мкс, на Postgres 312-389 мкс. Крок адкату заняў 78-90 мкс супраць 188-205 мкс, прычым Postgres плаціць за яго яшчэ і зваротам да сервера.

Большая частка ўздыму з ростам планаў прыпадае на чытанне назад. Кожнае прэв'ю чытае ўсе палі мадэлі, 42 радкі на 10 планах і 482 на 120. На Postgres гэтае чытанне заняло 387 мкс і 1006 мкс. H2 у памяці аддае тыя ж радкі за 128 і 174 мкс, думаю, таму што праз сокет не ідзе ні байта. Мой README назваў накладныя выдаткі "a constant" і зрабіў гэта галоўным вывадам. На лакальным Postgres яны выраслі прыкладна ў паўтара раза, з 0,76-0,78 мс на 10 планах да 1,18-1,22 мс на 120.

## Звароты да сервера

Прэв'ю з адкатам на Postgres гэта 3 звароты да сервера: пачак з 4 абнаўленняў, select і адкат. Я палічыў іх з дапамогай маленькага проксі паміж драйверам і базай. 100 прэв'ю дадалі 300 запісаў кліента ў сокет да тых 12, якія без аніводнага прэв'ю спатрэбіліся падрыхтоўцы схемы і пачатковых радкоў.

Той жа проксі ўмее прытрымліваць кожны запіс кліента на зададзены час, перш чым перадаць яго далей. Гэта грубая мадэль даўжэйшага шляху да базы. Я прагнаў праз яго нязменены `Bench` на 40 планах з 5 рознымі затрымкамі.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Лінейны графік, 40 планаў. Па гарызанталі затрымка, якую проксі дадае да кожнага запісу кліента, ад 0 да 2000 мікрасекунд. Па вертыкалі медыяна штрафу ў мілісекундах. Вымераныя пункты: 0 мкс 1,12 мс, 250 мкс 2,12 мс, 500 мкс 2,85 мс, 1000 мкс 4,40 мс, 2000 мкс 7,52 мс. Пункцір гэта пункт без затрымкі плюс патроеная затрымка. Без проксі штраф быў ад 0,83 да 0,91 мс. Гарызантальны пункцір адзначае 6,16 мс з README.">
  <line x1="70" y1="230" x2="600" y2="230" class="f-line" style="opacity:0.25"/>
  <text x="62" y="234" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="177.5" x2="600" y2="177.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="181.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="70" y1="125" x2="600" y2="125" class="f-line" style="opacity:0.25"/>
  <text x="62" y="129" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="70" y1="72.5" x2="600" y2="72.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <line x1="70" y1="20" x2="600" y2="20" class="f-line" style="opacity:0.25"/>
  <text x="62" y="24" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="70" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="136.25" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="202.5" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="335" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="600" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <text x="335" y="266" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">затрымка на кожны зварот, мкс</text>
  <text x="70" y="12" class="f-mono f-muted" style="font-size:11px">штраф, мс</text>
  <line x1="70" y1="68.29999999999998" x2="600" y2="68.29999999999998" class="f-line" style="stroke-dasharray:5 3"/>
  <text x="76" y="62.29999999999998" class="f-mono f-ink" style="font-size:11px">README, 40 планаў: 6,16</text>
  <line x1="70" y1="200.6" x2="600" y2="43.099999999999994" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="449" y="106.35" class="f-mono f-muted" style="font-size:11px">+3 × затрымка</text>
  <line x1="64" y1="208.2125" x2="64" y2="206.1125" style="stroke:var(--ink);stroke-width:6"/>
  <text x="122" y="218.6" class="f-mono f-muted" style="font-size:11px">(без проксі: 0,83-0,91)</text>
  <polyline points="70.0,200.6 136.3,174.3 202.5,155.2 335.0,114.5 600.0,32.6" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="200.6" r="4" style="fill:var(--accent)"/>
  <circle cx="136.3" cy="174.3" r="4" style="fill:var(--accent)"/>
  <text x="128.3" y="166.3" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2,12</text>
  <circle cx="202.5" cy="155.2" r="4" style="fill:var(--accent)"/>
  <text x="194.5" y="147.2" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2,85</text>
  <circle cx="335.0" cy="114.5" r="4" style="fill:var(--accent)"/>
  <text x="327.0" y="106.5" text-anchor="end" class="f-mono f-accent" style="font-size:12px">4,40</text>
  <circle cx="600.0" cy="32.6" r="4" style="fill:var(--accent)"/>
  <text x="592.0" y="24.6" text-anchor="end" class="f-mono f-accent" style="font-size:12px">7,52</text>
  <text x="80" y="218.6" class="f-mono f-accent" style="font-size:12px">1,12</text>
</svg>
<figcaption>Пасля першай затрымкі вымераны штраф ідзе прыкладна на 0,25 мс вышэй за лінію 3 зваротаў. Узровень README дасягаецца паміж 1000 і 2000 мкс на зварот.</figcaption>
</figure>

Без затрымкі сам проксі дадаў у тым прагоне каля 0,2-0,3 мс, 1,12 мс супраць 0,83-0,91 напрамую. Першыя 250 мкс затрымкі дадалі 1 мс, больш, чым 3 разы па 250. Далей лінія ідзе ўгору прыкладна на 3 мкс на кожную мікрасекунду затрымкі, гэта і ёсць 3 звароты. Лішнія 0,25 мс, хутчэй за ўсё, набягаюць таму, што проксі кожны раз спіць даўжэй за зададзенае, але асобна я гэта не мераў. Пры 2 мс на зварот штраф склаў 7,52 мс, крыху больш за лічбы README.

Паміж вымеранымі пунктамі на 1000 і 2000 мкс узровень 6,16 мс прыпадае прыкладна на 1,6 мс на зварот. Гэта толькі арыфметыка. Жнівеньскага стэнда ў мяне тут няма. Гэты харнэс выходзіць на лічбы README пры такой працягласці звароту, але сцвярджаць, што ў Docker на той машыне быў якраз такі, я не магу.

## Што я змяніў бы ў README

10 секунд можна пакінуць, з заўвагай, што першы запуск займае каля 25. У фразе пра H2 памылковая прычына. H2 у памяці дае той жа вердыкт, што і Postgres, а лічба адрозніваецца ад лакальнага Postgres менш чым у 3 разы. У яго няма сокета, а H2 у рэжыме сервера яго вяртае. Табліца вынікаў павінна казаць, які Postgres мералі і наколькі ён быў далёка. Паводле маіх лічбаў гэтая адлегласць складае большую частку тых 6 мс.

Вывад зыходнага README не мяняецца. 1 мс ці 6 мс за дэбаўнсам у 400 мс карыстальнік не заўважыць. Значэнне мае кошт у радках, запісаных і заблакаваных на кожнае прэв'ю.

## Чаго я не правяраў

Docker я не запускаў зусім, ні на якой машыне. Няма і канкурэнтнага доступу, які README ужо называе наступным крокам і дзе блакіроўкі пачынаюць абыходзіцца дорага. H2 быў толькі 2.3.232, драйвер толькі pgjdbc 42.7.4. Сетка прайшла двойчы, серыя з проксі адзін раз. Для разбору па кроках я браў адну JVM на клетку, так што яго мікрасекунды прыблізныя. На гэтай віртуалцы разлік яшчэ і да 2,6 раза хутчэйшы, чым на жнівеньскай машыне. Копія ў памяці займае 0,17 мс на 120 планах супраць 0,45 у README. Разлік у рознасці скарачаецца, бо яго выконваюць абедзве паловы пары. Але драйвер і база працуюць на тым жа працэсары, так што на больш павольнай машыне мае 0,9 мс, верагодна, таксама выраслі б.
