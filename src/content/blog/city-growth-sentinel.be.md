---
title: "Мая спадарожнікавая гіфка Мінска паказала 64 км² новага горада, а большая частка гэтага былі палі"
description: "7 гадоў Sentinel-2 над Мінскам: пара адзіночных сцэн паказвае 64 км² новай голай зямлі, з іх 60% ворыва. Правіла, якому патрэбны піксель, што змяніўся надоўга, знаходзіць 3,46 км². Са 120 пікселяў выбаркі 110 забудаваныя або сталі будоўлямі. Найбольшая пляма гэта былы аэрапорт Мінск-1, а GHSL і WorldCover з маім падлікам не сыходзяцца."
date: 2022-12-18
lang: be
translationKey: city-growth-sentinel
tags: ["open-data", "statistics"]
---
Такія гіфкі бачылі ўсе: горад з космасу, па кадры на год. Шэрая пляма з кожным кадрам большая. Google Earth Timelapse летась выклаў такія таймлапсы на ўвесь свет. Я заўсёды верыў таму, што яны паказваюць. Ні разу не спытаў, колькі ў гэтым руху ўласна горада. Гэтай восенню я захацеў такую для Мінска, 10 гадоў па Sentinel-2, бо яго даныя бясплатныя.

10 гадоў не атрымалася. Sentinel-2A запусцілі ў чэрвені 2015 года. Першая сцэна над горадам у архіве датаваная 29 ліпеня 2015 года. У снежні 2022 года поўных летаў 7, з 2016 па 2022. Для 10 гадоў спатрэбіўся б Landsat з яго 30 метрамі.

## Першая гіфка

Я ўзяў сцэны Sentinel-2 L2A з Planetary Computer па тайле 35UNV. Акно каля 32 на 28 км, у ім горад з кальцавой дарогай і прыгарады. Для кожнага лета, з траўня па верасень, я выбраў сцэну з найменшай воблачнасцю ў акне і склеіў 7 кадраў у гіфку.

<figure class="fig">
<img src="/media/city-growth-sentinel/minsk-single.gif" width="810" height="702" alt="Гіфка з 7 кадраў, самая чыстая сцэна Sentinel-2 кожнага лета з 2016 па 2022 год над Мінскам і прыгарадамі. Палі вакол горада ад кадра да кадра скачуць паміж бурым і зялёным, вадасховішча на паўночным захадзе мяняе колер, у 2019 годзе з'яўляюцца невялікія аблокі. Сам горад амаль аднолькавы на ўсіх кадрах." aria-label="Гіфка з 7 кадраў, самая чыстая сцэна Sentinel-2 кожнага лета з 2016 па 2022 год над Мінскам і прыгарадамі. Палі вакол горада ад кадра да кадра скачуць паміж бурым і зялёным, вадасховішча на паўночным захадзе мяняе колер, у 2019 годзе з'яўляюцца невялікія аблокі. Сам горад амаль аднолькавы на ўсіх кадрах." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Sentinel-2 L2A, самая чыстая сцэна кожнага лета, каля 32 на 28 км, у гіфцы 40 метраў на піксель. Дата сцэны ў куце. Пікселі пад маскай запоўнены значэннем бліжэйшага пікселя.</figcaption>
</figure>

Гэта было падобна на горад, які расце: палі скакалі паміж бурым і зялёным, вадасховішча на паўночным захадзе мяняла колер. Потым я паспрабаваў гэта палічыць. Піксель "голы", калі яго індэкс расліннасці (NDVI) меншы за 0,25 і гэта не вада. Паміж кадрам 22 жніўня 2016 года і кадрам 23 траўня 2022 года голымі сталі 64 км². За той жа час 51 км² перастаў быць голым, так што чысты прырост 13 км² да 108. Калі глядзець толькі на тое, што стала голым, як гэта робіць вока на гіфцы, голай зямлі стала больш на палову з лішкам менш чым за 6 гадоў.

Я паглядзеў, што ляжыць пад гэтымі 64 км² на карце ESA WorldCover за 2021 год. 60% з іх займае ворыва. У траўні на многіх палях яшчэ нічога не вырасла, таму яны выглядаюць як голая глеба. Мой індэкс не адрознівае іх ад новага шматкватэрнага дома. У больш строгі падлік ніжэй з гэтых 64 км² трапіла толькі 5%.

## Медыяны замест адзіночных сцэн

Звычайна гэта выпраўляюць медыянай. Для кожнага лета я ўзяў да 12 самых чыстых сцэн і замаскаваў аблокі і цені слоем класіфікацыі сцэны (SCL) з L2A. Кожны піксель захоўвае сваё медыяннае значэнне. Потым я палічыў пікселі, якія мяняюць стан, голы ці не голы, хаця б 2 разы за 7 кадраў. Па адзіночных сцэнах гэта 157 км², па медыянах 59 км², што таксама нямала. Адзіночныя сцэны лічацца на меншай плошчы, бо ў іх больш пікселяў пад маскай.

<figure class="fig">
<svg viewBox="0 0 680 275" role="img" aria-label="Лінейны графік, гады з 2016 па 2022, голая зямля ў акне ў квадратных кіламетрах. Па самай чыстай адзіночнай сцэне кожнага лета лінія скача: 93,4, 102,0, 100,9, 84,7, 80,4, 95,0, 107,0. Па летніх медыянах яна амаль роўная: 81,6, 81,3, 86,9, 85,9, 82,6, 80,8, 83,4.">
  <line x1="70" y1="200.0" x2="560" y2="200.0" class="f-plain"/>
  <text x="64" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="70" y1="140.0" x2="560" y2="140.0" class="f-plain"/>
  <text x="64" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="70" y1="80.0" x2="560" y2="80.0" class="f-plain"/>
  <text x="64" y="84.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="20.0" x2="560" y2="20.0" class="f-plain"/>
  <text x="64" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <text x="64" y="12" text-anchor="end" class="f-label f-muted">км²</text>
  <path d="M90.0,119.8 L165.0,68.2 L240.0,74.8 L315.0,171.6 L390.0,197.8 L465.0,110.2 L540.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M90.0,190.6 L165.0,192.4 L240.0,158.4 L315.0,164.7 L390.0,184.6 L465.0,195.0 L540.0,179.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="90.0" cy="119.8" r="3.5" class="f-accent"/>
  <circle cx="90.0" cy="190.6" r="3.5" class="f-ink"/>
  <text x="90.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="90.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">22 жні</text>
  <circle cx="165.0" cy="68.2" r="3.5" class="f-accent"/>
  <circle cx="165.0" cy="192.4" r="3.5" class="f-ink"/>
  <text x="165.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="165.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12 жні</text>
  <circle cx="240.0" cy="74.8" r="3.5" class="f-accent"/>
  <circle cx="240.0" cy="158.4" r="3.5" class="f-ink"/>
  <text x="240.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="240.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8 чэр</text>
  <circle cx="315.0" cy="171.6" r="3.5" class="f-accent"/>
  <circle cx="315.0" cy="164.7" r="3.5" class="f-ink"/>
  <text x="315.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="315.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13 чэр</text>
  <circle cx="390.0" cy="197.8" r="3.5" class="f-accent"/>
  <circle cx="390.0" cy="184.6" r="3.5" class="f-ink"/>
  <text x="390.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="390.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 чэр</text>
  <circle cx="465.0" cy="110.2" r="3.5" class="f-accent"/>
  <circle cx="465.0" cy="195.0" r="3.5" class="f-ink"/>
  <text x="465.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <text x="465.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 вер</text>
  <circle cx="540.0" cy="38.2" r="3.5" class="f-accent"/>
  <circle cx="540.0" cy="179.8" r="3.5" class="f-ink"/>
  <text x="540.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2022</text>
  <text x="540.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23 тра</text>
  <text x="552" y="42.2" class="f-label">адзіночная сцэна</text>
  <text x="552" y="183.8" class="f-label f-muted">медыяна лета</text>
</svg>
<figcaption>Голая зямля гэта NDVI менш за 0,25 і не вада. Лінія медыян лічыцца па 891 км² акна, лінія адзіночных сцэн па тых 817 км², якія маска пакінула ва ўсіх 7 сцэнах. Пад воссю стаіць дата адзіночнай сцэны.</figcaption>
</figure>

Голая плошча па медыянах кожны год трымаецца паміж 81 і 87 км² без аніякага трэнду, найбольш яе ў 2018 годзе.

У даных 2022 года была яшчэ адна пастка. З 25 студзеня 2022 года ESA апрацоўвае сцэны па базавай версіі апрацоўкі 04.00, якая дадае 1000 да кожнага значэння каэфіцыента адбіцця. Гэтую 1000 я адняў. Без гэтага тое самае правіла дае 154 км² голай зямлі ў 2022 годзе замест 83 км².

## Правіла, якому патрэбны піксель, што змяніўся надоўга

Тады я пачаў патрабаваць больш за адзін кадр. Піксель лічыцца новым горадам, калі ён быў зялёным (NDVI 0,5 і вышэй) у 2016 і 2017 гадах, а голым у 2021 і 2022. Яшчэ ён павінен ляжаць у пляме хаця б з 5 пікселяў. Атрымліваецца 3,46 км² у 854 плямах. Адваротная змена, з голага ў зялёнае з тым жа правілам плям, дае 0,51 км².

Гэтаму ліку я таксама не паверыў. Таму я выбраў з гэтых плям 120 выпадковых пікселяў і паглядзеў на кожны ў медыянах 2016, 2019 і 2022 гадоў. Я думаў, што палі і лясныя высечкі складуць хаця б палову. Я памыліўся. На 77 пікселях да 2022 года быў будынак, дарога або асфальтаваны двор. 33 аказаліся будоўлямі або зямлёй, расчышчанай пад будоўлю. 1 быў полем, а 9 я не змог разабраць пры разрозненні 10 метраў, пераважна ў раёнах прыватных дамоў.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="Сетка з 120 квадратаў, па адным на кожны выпадкова выбраны піксель правіла змены. 77 квадратаў заліты цёмным: да 2022 года там будынак, дарога або асфальтаваны двор. 33 заліты акцэнтным колерам: будоўля або расчышчаная зямля. 1 гэта поле. 9 засталіся пустымі контурамі: пры разрозненні 10 метраў не разабраць.">
  <rect x="72.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="369.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="396.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="423.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="450.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="477.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="504.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="531.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="149" width="22" height="22" class="f-muted"/>
  <rect x="369.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="396.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="423.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="450.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="477.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="504.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="531.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="558.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="585.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="60" y="190" width="12" height="12" class="f-ink"/>
  <text x="78" y="200" class="f-label">забудавана да 2022 77</text>
  <rect x="242.6" y="190" width="12" height="12" class="f-accent"/>
  <text x="260.6" y="200" class="f-label">будоўля 33</text>
  <rect x="352.6" y="190" width="12" height="12" class="f-muted"/>
  <text x="370.6" y="200" class="f-label">поле 1</text>
  <rect x="436.20000000000005" y="190" width="12" height="12" class="f-plain" style="stroke:var(--muted)"/>
  <text x="454.20000000000005" y="200" class="f-label">не разабраць 9</text>
</svg>
<figcaption>На кожны піксель я глядзеў у медыянах 2016, 2019 і 2022 гадоў, 10 метраў на піксель. Размячаў я адзін.</figcaption>
</figure>

20 пікселяў са 120 трапілі ў адно месца, на былы аэрапорт Мінск-1. Яго закрылі 23 снежня 2015 года, так што ў першае лета Sentinel-2 паласа яшчэ на месцы. У медыянах яна ляжыць у зялёным полі да 2018 года, у 2019 годзе прыходзіць пясок. Да 2022 года на паўночна-заходняй палове стаяць шматкватэрныя дамы. У радыусе 1 км ад сярэдзіны паласы ляжыць 0,54 км² змены, 15% усёй змены ў акне. Найбольшая асобная пляма таксама там.

<figure class="fig">
<img src="/media/city-growth-sentinel/airport-median.gif" width="800" height="600" alt="Гіфка з 7 летніх медыян з 2016 па 2022 год над былым аэрапортам Мінск-1, каля 4 на 3 км. Да 2018 года ўзлётная паласа ляжыць у зялёным полі. У 2019 годзе па ёй распаўзаецца пясок будоўлі. Да 2022 года на паўночна-заходняй палове паласы стаяць шэрагі высокіх дамоў і новыя вуліцы, а паўднёва-ўсходняя палова яшчэ ў пяску." aria-label="Гіфка з 7 летніх медыян з 2016 па 2022 год над былым аэрапортам Мінск-1, каля 4 на 3 км. Да 2018 года ўзлётная паласа ляжыць у зялёным полі. У 2019 годзе па ёй распаўзаецца пясок будоўлі. Да 2022 года на паўночна-заходняй палове паласы стаяць шэрагі высокіх дамоў і новыя вуліцы, а паўднёва-ўсходняя палова яшчэ ў пяску." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Летнія медыяны Sentinel-2 L2A, 10 метраў на піксель. Пікселі без ніводнага чыстага назірання за лета запоўнены значэннем бліжэйшага пікселя.</figcaption>
</figure>

## Звяраю з гатовымі картамі

Яшчэ да падліку я збіраўся параўнаць вынік з 2 гатовымі картамі. Першая гэта GHSL Еўракамісіі, выпуск R2022A гэтага лета, забудаваная паверхня з крокам 5 гадоў. На маёй сетцы яна дае 73,9 км² забудовы ў 2015 годзе і 77,2 км² у 2020 годзе, гэта значыць на 3,3 км² больш. Мае 3,46 км² з 2016 па 2022 год амаль столькі ж. Я гэтаму ўзрадаваўся.

Потым я паглядзеў, дзе ляжаць гэтыя 3,3 км². 7% прыросту GHSL ляжыць у межах 100 метраў ад маіх плям. Гэтая паласа займае 3,4% акна, гэта значыць супадзенне прыкладна ўдвая большае за выпадковае. І ўсё роўна астатнія 93% ляжаць у іншых месцах. На клетках па 500 метраў карэляцыя дзвюх карт 0,06. На месцы аэрапорта GHSL амаль не мяняецца: на маіх пікселях, што змяніліся, доля забудовы ў яе 4,6% у 2015 годзе і 4,9% у 2020. Тады я нарэшце ўважліва прачытаў апісанне GHSL. Яна глядзіць на зямлю праз Landsat у 2014 годзе і праз кампазіт Sentinel-2 за 2018 год. Эпохі 2015 і 2020 гадоў GHSL атрымлівае мадэллю, якая ўлічвае сярод іншага рэльеф, адлегласць да вады і ранейшы рост: 2015 год інтэрпаляцыяй, 2020 экстрапаляцыяй. Так што яе лік за 2020 год гэта не назіранне.

З WorldCover для гэтага пытання яшчэ горш. Карта 2020 года зроблена версіяй алгарытму v100, а карта 2021 года версіяй v200. У нататках да выпуску аўтары папярэджваюць, што розніца паміж дзвюма картамі складаецца са змен на зямлі і са змены алгарытму. У маім акне забудаваны клас за адзін год расце са 153,9 да 186,8 км², а маё правіла дае менш за 1 км² на год.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Гарызантальныя палосы, новая зямля ў квадратных кіламетрах паводле спосабу падліку. 2 адзіночныя сцэны, 2016 → 2022: 64,2; 2 медыяны, 2016 → 2022: 23,2; WorldCover, 2020 → 2021: 32,9; GHSL, 2015 → 2020: 3,3; маё правіла, 2016–17 → 2021–22: 3,46.">
  <text x="240" y="29" text-anchor="end" class="f-label f-muted">2 адзіночныя сцэны, 2016 → 2022</text>
  <rect x="250" y="14" width="312.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="570.0" y="30" class="f-mono">64,2 км²</text>
  <text x="240" y="67" text-anchor="end" class="f-label f-muted">2 медыяны, 2016 → 2022</text>
  <rect x="250" y="52" width="112.4" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="370.4" y="68" class="f-mono">23,2 км²</text>
  <text x="240" y="105" text-anchor="end" class="f-label f-muted">WorldCover, 2020 → 2021</text>
  <rect x="250" y="90" width="159.8" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="417.8" y="106" class="f-mono">32,9 км²</text>
  <text x="240" y="143" text-anchor="end" class="f-label f-muted">GHSL, 2015 → 2020</text>
  <rect x="250" y="128" width="16.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="274.0" y="144" class="f-mono">3,3 км²</text>
  <text x="240" y="181" text-anchor="end" class="f-label">маё правіла, 2016–17 → 2021–22</text>
  <rect x="250" y="166" width="16.8" height="22" class="f-accent" style="fill-opacity:1"/>
  <text x="274.8" y="182" class="f-mono">3,46 км²</text>
</svg>
<figcaption>Усё на адной сетцы Sentinel-2 акна. Пара адзіночных сцэн параўноўвае 22 жніўня 2016 года з 23 траўня 2022 года. Абедзве пары лічаць толькі зямлю, якая стала голай, WorldCover і GHSL чыстую змену забудаванага класа.</figcaption>
</figure>

## Што я з гэтага вынес

У маім акне вакол Мінска гэта каля 3,5 км² за 6 гадоў, разам з будоўлямі. Думаю, сапраўдны лік хутчэй большы, чым меншы. Перад зменай піксель мусіў 2 леты запар быць зялёным. Забудову дробнымі кавалкамі правіла плям адсейвае. Але колькі правіла прапусціла, я не вымяраў.

## Чаго я не правяраў

Парогі 0,25 і 0,5 я выбраў адзін раз і не падбіраў. Зямля, расчышчаная да 2016 года, у падлік не трапіла, а ў акне ёсць яшчэ і вёскі за горадам. Выбарку я размячаў адзін пры разрозненні 10 метраў, іншы чалавек мог бы аднесці некалькі кропак у іншую групу. Дзе старыя дамы з садамі саступілі месца новым кварталам, маё правіла палічыла б гэта новым горадам, хоць зямля была забудаваная і раней. Вышэйшы будынак на месцы нізкага яно не бачыць зусім.

2,2% акна хаця б у адно лета не мела ніводнага чыстага пікселя і ў падлік не ўвайшло. Спачатку я думаў, што маска прымае светлыя дахі за аблокі. Класы SCL паказваюць іншае: каля паловы гэтых пікселяў "unclassified" і трэць "dark area", 2 класы, якія выкінула мая ўласная маска. У гіфках я запоўніў дзіркі значэннямі бліжэйшых пікселяў.
