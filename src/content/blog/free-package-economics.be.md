---
title: "Амаль палова спамповак самых папулярных пакетаў npm прыпадае на пакеты з адным мейнтэйнерам. Я паглядзеў, хто ім плаціць"
description: "Я ўзяў 4362 пакеты npm з мільёнам спамповак на тыдзень на канец 2022 года і палічыў, хто можа іх публікаваць, хто просіць грошай і колькі грошай відаць публічна. 47% спамповак даюць пакеты з 1 мейнтэйнерам, грошай просяць 19% пакетаў, а мой спіс слоў знайшоў толькі 13 README, дзе гаворыцца пра людзей. Open Collective паказвае 1,65 мільёна долараў за 2022 год, 16 на мільён спамповак. 53% з іх пайшлі 5 калектывам."
date: 2022-12-28
lang: be
translationKey: free-package-economics
tags: ["dependencies", "open-data", "statistics"]
---
У студзені аўтар colors і faker наўмысна зламаў абодва пакеты. faker 6.6.6 выйшаў без кода, а colors пачаў бясконца друкаваць "LIBERTY LIBERTY LIBERTY". Гэта закранула ўсіх, у каго ўсталёўка падцягнула новую версію. Яшчэ ў лістападзе 2020 года ён напісаў на GitHub, што бясплатнай працы ад яго больш не будзе. У трэдах, якія я прачытаў, пераважна спрачаліся пра тое, ці меў ён на гэта права. У мяне было іншае пытанне і адказу на яго не было. Хто падтрымлівае пакеты ў маім node_modules і ці плаціць ім хто-небудзь?

З версіі 6.13 у 2019 годзе npm пасля ўсталёўкі друкуе "N packages are looking for funding". Я заўсёды прагортваў гэты радок. Таму вырашыў палічыць, пакуль год не скончыўся.

## Што я ўзяў

Спіс я ўзяў з `npm-high-impact` 1.1.0 ад лістапада 2022 года. Яго аўтар сабраў пакеты, якія падыходзяць пад азначэнне high impact, якім карыстаецца npm. Я ўзяў з яго частку з мільёнам спамповак на тыдзень і больш, гэта 4366 пакетаў. Для кожнага ўзяў самую новую стабільную версію, апублікаваную да 28 снежня 2022 года. З гэтай версіі я ўзяў акаўнты npm з правам яе публікаваць і README з яе тарбола. Так што README паказвае тое, што аўтары пісалі ў гэтым годзе. Спампоўкі я браў з API npm за перыяд з 1 студзеня па 27 снежня 2022 года. Для 4 пакетаў з імёнамі з 2 літар (yn, pn, rx, is) API аддае нуль. Засталося 4362, разам у іх 2,0 трыльёна спамповак.

Да першага ліку я запісаў, чаго чакаю. Больш за палову спамповак даюць пакеты з 1 або 2 мейнтэйнерамі. Менш за траціну пакетаў просяць грошай. А на Open Collective, дзе грошы, атрыманыя праектам, бачныя публічна, выходзіць менш за 1 долар на мільён спамповак.

## Хто іх трымае

У медыяннага пакета ў спісе 2 мейнтэйнеры. У 2086 пакетаў, гэта 48% спіса, роўна 1. Яны даюць 47% усіх спамповак. Пакеты з 1 або 2 мейнтэйнерамі даюць 65% спамповак, так што першае чаканне пацвердзілася.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="4362 пакеты npm з мільёнам спамповак на тыдзень і больш, згрупаваныя па колькасці акаўнтаў npm, якія могуць публікаваць версію, актуальную на 28 снежня 2022 года. 1 мейнтэйнер: доля спамповак 47%, доля пакетаў 48%. 2: доля спамповак 17%, доля пакетаў 18%. ад 3 да 5: доля спамповак 25%, доля пакетаў 23%. 6 і больш: доля спамповак 10%, доля пакетаў 11%.">
  <text x="16" y="33" class="f-mono f-ink" style="font-size:12px">1 мейнтэйнер</text>
  <rect x="150" y="18" width="321.2" height="13" rx="2" class="f-accent"/>
  <text x="477.2" y="29" class="f-mono f-ink" style="font-size:12px">47%</text>
  <rect x="150" y="34" width="328.0" height="13" rx="2" class="f-box"/>
  <text x="484.0" y="45" class="f-mono f-muted" style="font-size:12px">48%</text>
  <text x="16" y="77" class="f-mono f-ink" style="font-size:12px">2</text>
  <rect x="150" y="62" width="116.2" height="13" rx="2" class="f-accent"/>
  <text x="272.2" y="73" class="f-mono f-ink" style="font-size:12px">17%</text>
  <rect x="150" y="78" width="123.0" height="13" rx="2" class="f-box"/>
  <text x="279.0" y="89" class="f-mono f-muted" style="font-size:12px">18%</text>
  <text x="16" y="121" class="f-mono f-ink" style="font-size:12px">ад 3 да 5</text>
  <rect x="150" y="106" width="170.8" height="13" rx="2" class="f-accent"/>
  <text x="326.8" y="117" class="f-mono f-ink" style="font-size:12px">25%</text>
  <rect x="150" y="122" width="157.2" height="13" rx="2" class="f-box"/>
  <text x="313.2" y="133" class="f-mono f-muted" style="font-size:12px">23%</text>
  <text x="16" y="165" class="f-mono f-ink" style="font-size:12px">6 і больш</text>
  <rect x="150" y="150" width="68.3" height="13" rx="2" class="f-accent"/>
  <text x="224.3" y="161" class="f-mono f-ink" style="font-size:12px">10%</text>
  <rect x="150" y="166" width="75.2" height="13" rx="2" class="f-box"/>
  <text x="231.2" y="177" class="f-mono f-muted" style="font-size:12px">11%</text>
  <rect x="150" y="195" width="14" height="10" rx="2" class="f-accent"/>
  <text x="170" y="204" class="f-mono f-ink" style="font-size:11px">доля спамповак</text>
  <rect x="370" y="195" width="14" height="10" rx="2" class="f-box"/>
  <text x="390" y="204" class="f-mono f-ink" style="font-size:11px">доля пакетаў</text>
  <line x1="150" y1="8" x2="150" y2="190" class="f-plain"/>
</svg>
<figcaption>Спампоўкі з 1 студзеня па 27 снежня 2022 года, разам 2,0 трыльёна. Акаўнт не заўсёды адзін чалавек.</figcaption>
</figure>

Потым я лічыў акаўнты, а не пакеты. Выбіраў іх прагна: спачатку акаўнт, пакеты якога даюць найбольш спамповак, потым той, які дадае найбольш новых і гэтак далей. Пакет лічыцца пакрытым, калі абраны хоць адзін з яго мейнтэйнераў. 3 акаўнты пакрываюць чвэрць усіх спамповак, а 12 акаўнтаў хапае на палову. Адзін акаўнт, sindresorhus, з'яўляецца мейнтэйнерам 274 пакетаў з 14% усіх спамповак. На 222 з іх ён адзіны. Сярод іх `has-flag` і `find-up`.

Акаўнт npm гэта не чалавек. 170 пакетаў з 1 мейнтэйнерам належаць "types", боту, які публікуе DefinitelyTyped. "fb" публікуе пакеты React і Jest. Медыяннаму пакету з 1 мейнтэйнерам 7 гадоў. 1579 такіх пакетаў старэйшыя за 5 гадоў. Прынамсі ў 460 з гэтых 1579 у гэтым годзе выйшла новая версія.

## Што яны пішуць

У 731 пакета ў package.json ёсць поле funding. Менавіта яго чытаюць `npm fund` і радок пасля ўсталёўкі. Разам са спасылкамі на спонсарства ў README выходзіць 812 пакетаў, 19% спіса і 26% спамповак. Другое чаканне пацвердзілася. Часцей за ўсё спасылаюцца на GitHub Sponsors, гэта 478 пакетаў, на Open Collective 302. Яшчэ 205 README згадваюць падпіску Tidelift. Tidelift прадае кампаніям падпіску, таму я не лічыў яе просьбай аб грошах.

Я шукаў у README словы пра людзей, якія стаяць за кодам: volunteers, free time, spare time, hobby project, not backed by a company. Мой спіс слоў знайшоў 13 пакетаў з 4362. Калі я прачытаў іншыя README, убачыў, што спіс слоў прапускае частку. ioredis, напрыклад, піша, што праца над адкрытым кодам цяжкая і забірае шмат часу. Так што іх не менш за 13 з 4362. Вось некаторыя.

`core-js`, 2,1 мільярда спамповак у гэтым годзе, адзін мейнтэйнер. Над тэкстам стаіць загаловак "As advertising: the author is looking for a good job", а далей:

> `core-js` isn't backed by a company, so the future of this project depends on you.

webpack:

> Most of the core team members, webpack contributors and contributors in the ecosystem do this open source work in their free time.

msw, створаны ў 2018 годзе, 61 мільён спамповак:

> Despite that, this library remains a hobby project maintained in spare time

У тым жа сказе напісана, што праект не можа аплаціць нават аднаму ўдзельніку працу на поўную стаўку.

У `core-js` ёсць яшчэ скрыпт postinstall, які друкуе тую ж просьбу ў тэрмінал. Я ўсталяваў пакет праз npm 6.14 і просьба з'явілася. Праз npm 8.19 яе не было, бо npm 7 і навейшыя хаваюць вывад скрыптоў усталёўкі. Радок пра funding надрукавалі абедзве версіі.

## Колькі грошай відаць

Open Collective адкрыта публікуе ўсе паступленні і выдаткі кожнага калектыву. Я спытаў у яго API, колькі атрымаў у 2022 годзе кожны калектыў, на які спасылаюцца гэтыя пакеты.

Першая сума склала амаль 2 мільёны долараў і выглядала занадта добра. Потым я ўбачыў у спісе airbnb з 200 000 і salesforce з 44 000. Гэта фонды, якія грошы даюць. Іх лагатыпы стаяць у спісе спонсараў у README eslint, а мой рэгулярны выраз браў любую спасылку на Open Collective. Я пакінуў толькі акаўнты з тыпам COLLECTIVE і прыбраў 3 спасылкі, якія паказваюць на чужы праект у прыкладзе. Пасля гэтага выйшла 1,65 мільёна долараў на 75 калектываў. На іх спасылаюцца 286 пакетаў з 5% усіх спамповак.

Гэта 16 долараў на мільён спамповак. Я чакаў менш за 1, так што тут памыліўся больш чым у 10 разоў.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="75 калектываў Open Collective, на якія спасылаюцца 4362 найбольш спампоўваныя пакеты npm, па змяншэнні атрыманых у 2022 годзе долараў, разам 1,65 мільёна. 5 найбуйнейшых: babel 226 287, eslint 182 608, socketio 165 712, webpack 157 850, nest 142 825. Разам яны атрымалі 53% грошай. Ніжнія 38 калектываў разам атрымалі 23 824 долараў. core-js атрымаў 11 377 долараў, на яго калектыў спасылаюцца 3 пакеты з 3,8 мільярда спамповак.">
  <line x1="70" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="64" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$0</text>
  <line x1="70" y1="140.8" x2="660" y2="140.8" class="f-plain"/>
  <text x="64" y="144.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$100 000</text>
  <line x1="70" y1="61.7" x2="660" y2="61.7" class="f-plain"/>
  <text x="64" y="65.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$200 000</text>
  <text x="660" y="18" text-anchor="end" class="f-mono f-muted" style="font-size:11px">атрымана долараў у 2022</text>
  <rect x="70.8" y="40.9" width="6.3" height="179.1" class="f-accent"/>
  <rect x="78.7" y="75.4" width="6.3" height="144.6" class="f-accent"/>
  <rect x="86.5" y="88.8" width="6.3" height="131.2" class="f-accent"/>
  <rect x="94.4" y="95.0" width="6.3" height="125.0" class="f-accent"/>
  <rect x="102.3" y="106.9" width="6.3" height="113.1" class="f-accent"/>
  <rect x="110.1" y="148.4" width="6.3" height="71.6" class="f-box"/>
  <rect x="118.0" y="153.4" width="6.3" height="66.6" class="f-box"/>
  <rect x="125.9" y="177.1" width="6.3" height="42.9" class="f-box"/>
  <rect x="133.7" y="180.9" width="6.3" height="39.1" class="f-box"/>
  <rect x="141.6" y="183.7" width="6.3" height="36.3" class="f-box"/>
  <rect x="149.5" y="184.0" width="6.3" height="36.0" class="f-box"/>
  <rect x="157.3" y="188.0" width="6.3" height="32.0" class="f-box"/>
  <rect x="165.2" y="191.8" width="6.3" height="28.2" class="f-box"/>
  <rect x="173.1" y="198.1" width="6.3" height="21.9" class="f-box"/>
  <rect x="180.9" y="202.0" width="6.3" height="18.0" class="f-box"/>
  <rect x="188.8" y="203.5" width="6.3" height="16.5" class="f-box"/>
  <rect x="196.7" y="204.0" width="6.3" height="16.0" class="f-box"/>
  <rect x="204.5" y="204.5" width="6.3" height="15.5" class="f-box"/>
  <rect x="212.4" y="205.2" width="6.3" height="14.8" class="f-box"/>
  <rect x="220.3" y="205.3" width="6.3" height="14.7" class="f-box"/>
  <rect x="228.1" y="205.6" width="6.3" height="14.4" class="f-box"/>
  <rect x="236.0" y="206.1" width="6.3" height="13.9" class="f-box"/>
  <rect x="243.9" y="207.6" width="6.3" height="12.4" class="f-box"/>
  <rect x="251.7" y="209.4" width="6.3" height="10.6" class="f-box"/>
  <rect x="259.6" y="209.6" width="6.3" height="10.4" class="f-box"/>
  <rect x="267.5" y="210.1" width="6.3" height="9.9" class="f-box"/>
  <rect x="275.3" y="211.0" width="6.3" height="9.0" class="f-ink"/>
  <rect x="283.2" y="214.1" width="6.3" height="5.9" class="f-box"/>
  <rect x="291.1" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="298.9" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="306.8" y="214.8" width="6.3" height="5.2" class="f-box"/>
  <rect x="314.7" y="216.2" width="6.3" height="3.8" class="f-box"/>
  <rect x="322.5" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="330.4" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="338.3" y="217.2" width="6.3" height="2.8" class="f-box"/>
  <rect x="346.1" y="217.3" width="6.3" height="2.7" class="f-box"/>
  <rect x="354.0" y="217.5" width="6.3" height="2.5" class="f-box"/>
  <rect x="361.9" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="369.7" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="377.6" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="385.5" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="393.3" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="401.2" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="409.1" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="416.9" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="424.8" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="432.7" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="440.5" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="448.4" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="456.3" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="464.1" y="219.3" width="6.3" height="0.7" class="f-box"/>
  <rect x="472.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="479.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="487.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="495.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="503.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="511.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="519.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="527.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="534.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="542.8" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="550.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="558.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="566.4" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="574.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="582.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="590.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="597.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="605.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="613.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="621.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="629.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="637.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="645.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="652.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <text x="119.3" y="88.8" class="f-mono f-ink" style="font-size:11px">першыя 5: 53% усяго</text>
  <text x="119.3" y="103.8" class="f-mono f-muted" style="font-size:11px">babel, eslint, socketio, webpack, nest</text>
  <line x1="278.5" y1="216.0" x2="278.5" y2="172.0" class="f-line"/>
  <text x="278.5" y="168.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">core-js $11 377</text>
  <line x1="361.1" y1="228" x2="660" y2="228" class="f-line"/>
  <line x1="361.1" y1="224" x2="361.1" y2="232" class="f-line"/>
  <line x1="660" y1="224" x2="660" y2="232" class="f-line"/>
  <text x="510.5" y="246" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">ніжнія 38 разам: $23 824</text>
</svg>
<figcaption>Толькі акаўнты тыпу калектыў. Фонды і кампаніі са спісаў спонсараў не лічацца.</figcaption>
</figure>

5 найбуйнейшых калектываў (babel, eslint, socketio, webpack, nest) атрымалі 53% грошай. 38 самых маленькіх разам атрымалі 23 824 долары за ўвесь год, а 25 калектываў атрымалі менш за 1000 долараў кожны. Калектыў `core-js` атрымаў 11 377 долараў. На яго спасылаюцца 3 пакеты, у якіх разам 3,8 мільярда спамповак. Гэта каля 3 долараў на мільён.

Пакетаў з 1 мейнтэйнерам на гэтай карціне амаль няма. Толькі 3% іх спамповак прыпадае на пакеты, якія спасылаюцца хоць на нейкі калектыў. Грошай увогуле просяць 481 з 2086, з іх 386 праз GitHub Sponsors. GitHub Sponsors сумы не публікуе, таму для гэтых пакетаў ліку ў мяне няма.

## Чаго я не правяраў

Грошы ад працадаўцаў. Некаторым мейнтэйнерам за гэтую працу плаціць працадаўца. Напрыклад, каманда npm CLI у GitHub: яе акаўнты darcyclarke і nlf таксама ёсць у спісе. npm такія грошы не паказвае, а ў README я іх не шукаў.

Сумы на GitHub Sponsors і Patreon не публічныя, я лічыў толькі спасылкі. Спампоўкі ўключаюць CI і люстэркі, гэта не людзі. Грошы калектыву ідуць на ўвесь праект. Я дзяліў іх толькі на спампоўкі пакетаў з майго спіса, якія на яго спасылаюцца, таму долары на спампоўку хутчэй завышаныя. MUI у суму не трапіў: яго README спасылаецца на адрас, які API не знайшоў.
