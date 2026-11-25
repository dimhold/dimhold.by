---
title: "Мадэль увесь год заніжала попыт на 36%, а PSI яе прыкмет быў 0,06"
description: "Я навучыў мадэль пракату веласіпедаў на 2011 годзе, замарозіў яе і пусціў працаваць на 2012. Яна занізіла попыт на 36%, а гадавы PSI прыкмет застаўся ніжэй за 0,07. Па месяцах трывога PSI спрацавала ва ўсіх 24 месяцах, у добрых таксама. KS спрацаваў у 397 выбарках з 400, дзе нічога не мянялася."
date: 2018-10-06
lang: be
translationKey: silent-drift
tags: ["machine-learning", "statistics", "reliability"]
---

`psi_pred: 0.0054`. Гэта адлегласць паміж прагнозамі маёй мадэлі на 2012 і на 2011 год па індэксе стабільнасці папуляцыі (PSI), якім карыстаюцца ў крэдытным скорынгу. Менш за 0,1 там чытаецца як "нічога не здарылася". На 2012 год мадэль прадказала 1 306 797 паездак, а было іх 2 049 576.

Калі я думаю, як сачыць за мадэллю, якая ўжо працуе, першым у галаву прыходзіць параўнанне размеркаванняў на ўваходзе: прыкметы ёсць адразу, а правільныя адказы прыйдуць потым. Гучыць разумна, але на даных, дзе ўжо вядома, чым усё скончылася, я гэтага ні разу не спрабаваў. І не ведаў, як часта такая праверка спрацоўвае дарма.

Што па ўваходах відаць не кожны дрэйф, даўно вядома. Гама з сааўтарамі ў аглядзе 2014 года аддзяляюць змену саміх прыкмет ад змены таго, як ад іх залежыць адказ. Другое без адказаў не заўважыш. Мне хацелася палічыць пропускі і ілжывыя трывогі.

## Што я запускаў

Я ўзяў Bike Sharing з UCI, набор Фанаі-Т і Гамы: пракат Capital Bikeshare у Вашынгтоне па гадзінах разам з надвор'ем, 8645 гадзін 2011 года і 8734 гадзіны 2012. У 2014 годзе па гэтых даных было спаборніцтва на Kaggle. На 2011 годзе я навучыў градыентны бустынг, 300 дрэў глыбіні 5, без слупка з годам, потым замарозіў яго і пусціў працаваць на 2012. Python 3.6, sklearn 0.20.0, pandas 0.23.4, scipy 1.1.0.

Памылку я лічу як WAPE, суму модуляў памылак дзялю на суму паездак. Крос-валідацыя па 2011 годзе, дзе адкладаюцца цэлыя тыдні, дае 18,3%. На 2012 годзе ў замарожанай мадэлі 38,3% і кожны з 12 месяцаў горшы за найгоршы месяц 2011 года. За год паездак стала на 65% больш, даведацца пра гэта мадэлі не было адкуль.

Цяпер маніторынг. Для 4 прыкмет надвор'я я лічу PSI па інтэрвалах паміж дэцылямі 2011 года (у тыпу надвор'я свае катэгорыі), трывога вышэй за 0,25, як у кнізе Сідзікі пра скорынгавыя карты. Калі параўнаць 2012 год з 2011 цалкам, выходзіць 0,043 у тэмпературы, 0,063 у вільготнасці і па 0,004 у ветру і тыпу надвор'я. На ўваход ідзе яшчэ тэмпература "па адчуваннях", трывогі на яе я не ставіў, PSI 0,030. Нават у саміх паездак, гэта значыць у адказу, PSI 0,244. Рост на 65% да парога не дацягнуў.

## Па месяцах

Чакаць год ніхто не будзе, таму я параўнаў кожны месяц з усім 2011 годам. Крытэрыі я запісаў да запуску і там жа тое, чаго чакаў сам: трывога спозніцца, але да лета спрацуе.

<figure class="fig">
<svg viewBox="0 0 680 332" role="img" aria-label="24 месяцы на дзвюх панэлях. Зверху памылка мадэлі WAPE: ад 11,8 да 26,2 працэнта ў 2011 годзе на адкладзеных тыднях і ад 29,5 да 53,6 працэнта ў 2012. Знізу найбольшы PSI 4 прыкмет надвор'я супраць усяго 2011 года: вышэй за лінію 0,25 ва ўсіх 24 месяцах, ад 1,08 да 4,09 у 2011 і ад 0,92 да 3,99 у 2012.">
  <line x1="50.0" y1="138.0" x2="664.0" y2="138.0" class="f-plain"/>
  <text x="42.0" y="142.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="101.3" x2="664.0" y2="101.3" class="f-plain"/>
  <text x="42.0" y="105.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="50.0" y1="64.7" x2="664.0" y2="64.7" class="f-plain"/>
  <text x="42.0" y="68.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="50.0" y1="28.0" x2="664.0" y2="28.0" class="f-plain"/>
  <text x="42.0" y="32.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="53.0" y="95.4" width="19.0" height="42.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="90.0" width="19.0" height="48.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="93.7" width="19.0" height="44.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="92.8" width="19.0" height="45.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="110.2" width="19.0" height="27.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="116.3" width="19.0" height="21.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="111.8" width="19.0" height="26.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="111.3" width="19.0" height="26.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="105.7" width="19.0" height="32.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="108.1" width="19.0" height="29.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="92.1" width="19.0" height="45.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="93.2" width="19.0" height="44.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="39.7" width="19.0" height="98.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="48.2" width="19.0" height="89.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="44.5" width="19.0" height="93.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="62.8" width="19.0" height="75.2" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="83.9" width="19.0" height="54.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="79.3" width="19.0" height="58.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="74.9" width="19.0" height="63.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="72.3" width="19.0" height="65.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="72.9" width="19.0" height="65.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="67.6" width="19.0" height="70.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="70.1" width="19.0" height="67.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="67.7" width="19.0" height="70.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">WAPE, %</text>
  <line x1="50.0" y1="290.0" x2="664.0" y2="290.0" class="f-plain"/>
  <text x="42.0" y="294.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="268.0" x2="664.0" y2="268.0" class="f-plain"/>
  <text x="42.0" y="272.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="50.0" y1="246.0" x2="664.0" y2="246.0" class="f-plain"/>
  <text x="42.0" y="250.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="50.0" y1="224.0" x2="664.0" y2="224.0" class="f-plain"/>
  <text x="42.0" y="228.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3</text>
  <line x1="50.0" y1="202.0" x2="664.0" y2="202.0" class="f-plain"/>
  <text x="42.0" y="206.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="50.0" y1="180.0" x2="664.0" y2="180.0" class="f-plain"/>
  <text x="42.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="53.0" y="204.5" width="19.0" height="85.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="248.6" width="19.0" height="41.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="251.0" width="19.0" height="39.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="266.2" width="19.0" height="23.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="255.1" width="19.0" height="34.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="228.0" width="19.0" height="62.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="200.0" width="19.0" height="90.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="217.1" width="19.0" height="72.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="259.8" width="19.0" height="30.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="245.0" width="19.0" height="45.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="235.2" width="19.0" height="54.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="241.4" width="19.0" height="48.6" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="269.7" width="19.0" height="20.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="260.2" width="19.0" height="29.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="238.5" width="19.0" height="51.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="236.7" width="19.0" height="53.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="202.2" width="19.0" height="87.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="212.2" width="19.0" height="77.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="241.0" width="19.0" height="49.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="255.2" width="19.0" height="34.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="237.1" width="19.0" height="52.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="238.3" width="19.0" height="51.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="168.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">найбольшы PSI</text>
  <line x1="50.0" y1="284.5" x2="664.0" y2="284.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="62.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="87.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="112.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="137.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="162.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="187.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="212.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="237.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="262.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="287.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="312.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="337.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="376.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="401.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="426.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="451.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="476.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="501.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="526.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="551.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="576.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="601.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="626.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="651.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="200.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2011</text>
  <text x="514.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2012</text>
</svg>
<figcaption>Зверху памылка мадэлі, 2011 на адкладзеных тыднях (шэрым) і 2012 (колерам). Знізу найбольшы з 4 PSI за месяц супраць усяго 2011 года. Пункцір: парог 0,25.</figcaption>
</figure>

Спрацавала яна ва ўсіх 12 месяцах 2012 года. І ва ўсіх 12 месяцах 2011, калі з мадэллю ўсё было добра. Адной тэмпературы хапае кожны раз, PSI у яе ад 0,9 да 4,1, бо месяц не падобны да года. Карысці з такой трывогі няма.

Звычайна на гэта раяць параўноўваць з тым жа месяцам мінулага года. Тады трывога спрацоўвае ў 7 месяцах з 12. Вось 5, у якіх было ціха:

| месяц 2012 года | найбольшы PSI з 4 | прагноз да факта за месяц |
|---|---|---|
| чэрвень | 0,22 | -30% |
| ліпень | 0,13 | -33% |
| жнівень | 0,11 | -35% |
| кастрычнік | 0,16 | -36% |
| снежань | 0,20 | -33% |

Калі ўзяць мякчэйшы парог, 0,1, спрацуюць усе 12. Рэагуе такая трывога на надвор'е. Сакавік 2012 быў цяплейшы за сакавік 2011, у сярэднім 13,1 градуса супраць 7,6, PSI 1,25, мадэль занізіла яго на 51%. Але і жнівень яна занізіла на 35%, хоць надвор'е было блізкае да леташняга. Калі параўноўваць з тым жа месяцам самі прагнозы, парог 0,25 не перавышаны ні разу. З летам я памыліўся ў абодвух варыянтах.

Яшчэ я памыліўся з формай. Я чакаў, што памылка будзе расці патроху. Найгоршым аказаўся першы ж месяц, студзень, мінус 53%. За 2011 год пракат вырас з 38 189 паездак у студзені да 87 323 у снежні і мадэль, падобна, прыняла гэты рост за сезон, іншага года яна не бачыла. Крос-валідацыя ўнутры 2011 года паказаць гэтага не магла, адкладзеныя тыдні там раскіданыя паміж навучальнымі.

## 30 выпадковых дзён

Яшчэ часта бяруць тэст KS (Калмагорава-Смірнова). Яго я праверыў там, дзе дакладна нічога не мяняецца: 30 выпадковых цэлых дзён 2011 года супраць астатніх дзён таго ж года, 400 разоў. Лічыў, колькі разоў p ніжэй за 0,05 у тэмпературы, вільготнасці і ветру.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Колькі з 400 выпадковых выбарак 2011 года даюць p ніжэй за 0,05 у тэсце KS. 30 выпадковых дзён: тэмпература 361, вільготнасць 296, вецер 167, любы з 3 397. Столькі ж выпадковых гадзін: тэмпература 13, вільготнасць 17, вецер 8, любы з 3 37.">
  <line x1="50.0" y1="200.0" x2="664.0" y2="200.0" class="f-plain"/>
  <text x="42.0" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="157.5" x2="664.0" y2="157.5" class="f-plain"/>
  <text x="42.0" y="161.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50.0" y1="115.0" x2="664.0" y2="115.0" class="f-plain"/>
  <text x="42.0" y="119.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50.0" y1="72.5" x2="664.0" y2="72.5" class="f-plain"/>
  <text x="42.0" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="50.0" y1="30.0" x2="664.0" y2="30.0" class="f-plain"/>
  <text x="42.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">выбарак з p &lt; 0,05 з 400</text>
  <rect x="80.8" y="46.6" width="42.0" height="153.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="101.8" y="41.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">361</text>
  <rect x="130.8" y="194.5" width="42.0" height="5.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="151.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13</text>
  <text x="126.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">тэмпература</text>
  <rect x="234.3" y="74.2" width="42.0" height="125.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="255.3" y="69.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">296</text>
  <rect x="284.3" y="192.8" width="42.0" height="7.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="305.3" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">17</text>
  <text x="280.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">вільготнасць</text>
  <rect x="387.8" y="129.0" width="42.0" height="71.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="408.8" y="124.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">167</text>
  <rect x="437.8" y="196.6" width="42.0" height="3.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="458.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8</text>
  <text x="433.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">вецер</text>
  <rect x="541.3" y="31.3" width="42.0" height="168.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="562.3" y="26.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">397</text>
  <rect x="591.3" y="184.3" width="42.0" height="15.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="612.3" y="179.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">37</text>
  <text x="587.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">любы з 3</text>
  <line x1="50.0" y1="191.5" x2="664.0" y2="191.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <rect x="50.0" y="234.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="68.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">30 выпадковых дзён</text>
  <rect x="280.0" y="234.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="298.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">столькі ж выпадковых гадзін</text>
</svg>
<figcaption>400 выбарак, у якіх нічога не магло змяніцца. Пункцір: 5%, якія тэст абяцае для адной прыкметы.</figcaption>
</figure>

Хоць адзін тэст з 3 спрацаваў у 397 выбарках з 400. Калі замест дзён узяць столькі ж выпадковых гадзін, хоць нешта спрацоўвае ў 37. Тэст думае, што перад ім прыкладна 700 незалежных радкоў, але гадзіны аднаго дня прыходзяць разам: 91% дысперсіі тэмпературы гэта розніца паміж днямі, на ёй тэст спрацаваў у 361 выбарцы. У ветру 39% і 167 выбарак. PSI з парогам 0,25 тут спакайнейшы, 27 выбарак з 400. З парогам 0,1 іх 228.

## З адказамі

Тут я быў упэўнены і ўсё роўна спатыкнуўся. Правіла было такое: узяць апошнія 7 дзён і падняць трывогу, калі WAPE вышэйшы, чым у найгоршыя 7 дзён 2011 года. Яно не спрацавала ні разу, 0 акон з 360. Медыяна па вокнах вырасла з 17% да 37%, а трывога маўчала. Найгоршае акно 2011 года канчаецца 27 снежня, там 62%. Гэта Каляды, 25-га было 754 паездкі, а з 5 да 18 снежня ў сярэднім 3072 за дзень. У 2012 годзе найгоршае акно 60,4%.

Тады я паглядзеў на знак памылкі. У 2011 годзе мацней за ўсё за 7 дзён мадэль занізіла на 22,6%. У 2012 першае ж поўнае акно, якое канчаецца 7 студзеня, ужо ніжэйшае. Усяго такіх акон 346 з 360. Адказы і акно тыя самыя, я толькі не выкінуў знак.

## Навучанне нанава кожны месяц вярнула паўпункта

У замарожанай мадэлі 38,3%. Я вучыў яе нанава ў першы дзень кожнага месяца на ўсім мінулым і атрымаў 37,8%. Западозрыў памылку ў кодзе і напісаў другі скрыпт, ён выдаў тыя ж 37,8%. Потым паспрабаваў інакш.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="WAPE на 2012 годзе, працэнты: замарожаная на 2011 38,3; раз на месяц, усё мінулае 37,8; тое ж без месяца і сезона 30,7; раз на месяц, 90 дзён 20,7; усё мінулае + слупок года 19,0; замарож. × факт / прагноз, 28 дз. 17,3. Пункцір: памылка на адкладзеных тыднях 2011 года, 18,3.">
  <line x1="280.0" y1="14.0" x2="280.0" y2="206.0" class="f-plain"/>
  <text x="280.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="367.5" y1="14.0" x2="367.5" y2="206.0" class="f-plain"/>
  <text x="367.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="455.0" y1="14.0" x2="455.0" y2="206.0" class="f-plain"/>
  <text x="455.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="542.5" y1="14.0" x2="542.5" y2="206.0" class="f-plain"/>
  <text x="542.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="630.0" y1="14.0" x2="630.0" y2="206.0" class="f-plain"/>
  <text x="630.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="280.0" y="21.0" width="335.4" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">замарожаная на 2011</text>
  <text x="674.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">38,3</text>
  <rect x="280.0" y="53.0" width="330.6" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">раз на месяц, усё мінулае</text>
  <text x="674.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">37,8</text>
  <rect x="280.0" y="85.0" width="268.6" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">тое ж без месяца і сезона</text>
  <text x="674.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">30,7</text>
  <rect x="280.0" y="117.0" width="181.1" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">раз на месяц, 90 дзён</text>
  <text x="674.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">20,7</text>
  <rect x="280.0" y="149.0" width="166.0" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">усё мінулае + слупок года</text>
  <text x="674.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">19,0</text>
  <rect x="280.0" y="181.0" width="151.4" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">замарож. × факт / прагноз, 28 дз.</text>
  <text x="674.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">17,3</text>
  <line x1="440.1" y1="10.0" x2="440.1" y2="206.0" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
</svg>
<figcaption>WAPE на 2012 годзе, %. Пункцір: 18,3%, памылка на адкладзеных тыднях 2011 года. Множнік абнаўляецца кожны дзень, навучанне ідзе раз на месяц.</figcaption>
</figure>

Часткова справа, думаю, у слупку з месяцам. Для верасня 2012 у навучанні ёсць толькі стары верасень. Без месяца і сезона выходзіць 30,7%, гэта ўсё яшчэ дрэнна. Магу толькі меркаваць, што старых радкоў зашмат, нават для снежня іх 8645 з 16 637. Калі вучыць толькі на апошніх 90 днях, выходзіць 20,7%, калі на ўсім мінулым са слупком года, 19,0%. Найлепшай аказалася старая замарожаная мадэль, памножаная на адносіну факта да прагнозу за папярэднія 28 дзён, 17,3%. Параўнанне не зусім сумленнае, множнік мяняецца кожны дзень, а навучанне ідзе раз на месяц. І ў студзені ў яго яшчэ няма 28 дзён, там так і застаецца 49%.

## Чаго я не правяраў

Адзін горад, адна мадэль і рост у адзін бок, прычым вельмі вялікі. Павольны дрэйф на 5% у год і па знаку памылкі лавіць цяжэй. Я лічыў, што адказы вядомыя на наступны дзень, у крэдытаў яны прыходзяць праз месяцы. Пусты інтэрвал у PSI ў мяне ідзе за паўрадка, калі за 5 радкоў, месячны PSI тэмпературы будзе ад 0,7 да 2,7. Множніка ў крытэрыях не было, а астатнія спосабы навучання з'явіліся ўжо пасля першых вынікаў. DDM і ADWIN на патоку памылак я не спрабаваў.
