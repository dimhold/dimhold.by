---
title: "Я дадаў \"none of the above\" і мадэль адмаўлялася гэтак жа часта, але на трэці пытанняў адказ памяняўся"
description: "UnifiedQA T5 large адказвае на 300 пытанняў SQuAD 2.0, на якія ў абзацы няма адказу, у 4 фарматах. Спіс без выхаду адмаўляецца 11 разоў і 177 разоў выбірае прынаду. З \"none of the above\" адмоў 134 супраць 133 у вольным тэксце, але 103 пытанні з 300 пераходзяць паміж адмовай і выдуманым адказам."
date: 2022-04-16
lang: be
translationKey: format-pressure
tags: ["llm", "machine-learning", "reliability"]
---
Калі мадэль абавязана выбраць адказ з гатовага спісу, яна не можа сказаць, што не ведае. Так звычайна тлумачаць, чаму жорсткі фармат адказу прымушае мадэль выдумляць. Я з гэтым пагаджаўся, не надта задумваючыся. Звычайна гэта выпраўляюць яшчэ адным варыянтам, "none of the above". Для мяне пытанне на гэтым было закрытае. Колькі сумленнасці гэты варыянт вяртае, я ні разу не мераў, таму памераў.

## Стэнд

Для сумленнага параўнання патрэбная мадэль, якая ўмее адмаўляцца ў сваім уласным фармаце. Падыходзіць UnifiedQA ад AI2: гэта T5, навучаная на многіх наборах пытанняў і адказаў у розных фарматах, сярод іх SQuAD 2.0. У SQuAD 2.0 ёсць пытанні, на якія абзац не адказвае. На іх мадэль навучаная пісаць `no answer>`. Дужка стаіць толькі з аднаго боку, бо ў слоўніку T5 няма `<`.

Я ўзяў UnifiedQA T5 large, каля 740M параметраў. З набору dev SQuAD 2.0 выбраў 300 пытанняў з адказам і 300 без адказу, seed 2022. Кожнае пытанне ідзе ў мадэль 4 разы з тым жа абзацам:

1. вольна: пытанне і абзац, фармат, у якім мадэль вучылася на SQuAD;
2. спіс з 3 варыянтаў без выйсця, гэта значыць без варыянта для адмовы;
3. тыя ж 3 варыянты плюс "(d) none of the above";
4. тыя ж 3 варыянты плюс "(d) no answer>", той жа тэкст, які мадэль піша, калі адмаўляецца.

Варыянты ўзятыя з разметкі SQuAD. У пытання з адказам гэта правільны адказ і 2 адказы на іншыя пытанні да таго ж абзаца. У пытання без адказу SQuAD 2.0 захоўвае "plausible answer", кавалак абзаца, падобны на адказ. Ён становіцца на месца правільнага, так што ў кожным спісе да пытання без адказу ёсць прынада.

Усё працавала на 4 ядрах працэсара віртуальнай машыны: Python 3.9, torch 1.11, transformers 4.18, прагнае дэкадаванне, каля 3 секунд на пытанне. Вагі займаюць 3 ГБ у float32, а transformers 4.18 загружае ўвесь файл побач з мадэллю. Разам гэта больш, чым дазваляе мой ліміт у 5 ГіБ. Таму я парэзаў вагі на 16 частак і збіраю мадэль з канфігу.

Да прагону я запісаў, чаго чакаю. Вольны фармат адмаўляецца больш чым на палове пытанняў без адказу. Спіс з "none of the above" дасць менш за палову адмоў вольнага фармату.

## Без выйсця

Спіс без выйсця зрабіў тое, чаго я чакаў. На 300 пытаннях без адказу мадэль 177 разоў выбрала прынаду і 112 разоў нешта іншае. 11 разоў яна напісала `no answer>`, хоць такога варыянта ў спісе не было. Гэтыя 11 мне падабаюцца больш за ўсё. Мадэль зламала мой фармат, каб сказаць праўду.

## З выйсцем

Вольны фармат адмовіўся 133 разы з 300. Гэта 44%. Маё першае чаканне ўжо не спраўдзілася. Нават у фармаце, у якім яе вучылі, мадэль выдумляе адказ больш чым на палове пытанняў, дзе павінна адмовіцца. 101 такі адказ блізкі да прынады.

Спіс з "none of the above" адмовіўся 134 разы, на адзін больш за вольны фармат. Менавіта гэты зыход я загадзя запісаў як той, што абвергне маю ідэю. Значыць, з выйсцем спіс адмаўляецца гэтак жа часта, як вольны тэкст. 177 прынад даў спіс без выйсця.

З "no answer>" у варыянце (d) мадэль адмовілася 152 разы. Гэта больш, чым з "none of the above". На парных адказах розніца трымаецца (McNemar, p = 0,013). Супраць вольнага фармату гэта 152 да 133 пры p = 0,059. Вынікам я б гэта не назваў.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Састаўныя палосы, у кожнай 300 пытанняў без адказу. вольна: адмова 133, прынада 101, іншы адказ 66. спіс без выйсця: адмова 11, прынада 177, іншы адказ 112. + none of the above: адмова 134, прынада 120, іншы адказ 46. + no answer&gt;: адмова 152, прынада 113, іншы адказ 35.">
  <text x="12" y="18" class="f-label f-muted">300 пытанняў без адказу, UnifiedQA T5 large</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain" stroke-width="1"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">адмова</text>
  <rect x="172" y="31" width="12" height="10" class="f-accent"/>
  <text x="190" y="40" class="f-mono f-ink" style="font-size:11px">прынада</text>
  <rect x="352" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="40" class="f-mono f-ink" style="font-size:11px">іншы адказ</text>
  <text x="12" y="77" class="f-mono f-ink" style="font-size:11px">вольна</text>
  <rect x="190" y="66" width="146" height="14" class="f-plain"/>
  <rect x="336" y="66" width="111" height="14" class="f-accent"/>
  <rect x="447" y="66" width="73" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="77" class="f-mono f-ink" style="font-size:11px">133/101/66</text>
  <text x="12" y="107" class="f-mono f-ink" style="font-size:11px">спіс без выйсця</text>
  <rect x="190" y="96" width="12" height="14" class="f-plain"/>
  <rect x="202" y="96" width="195" height="14" class="f-accent"/>
  <rect x="397" y="96" width="123" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="107" class="f-mono f-ink" style="font-size:11px">11/177/112</text>
  <text x="12" y="137" class="f-mono f-ink" style="font-size:11px">+ none of the above</text>
  <rect x="190" y="126" width="147" height="14" class="f-plain"/>
  <rect x="337" y="126" width="132" height="14" class="f-accent"/>
  <rect x="469" y="126" width="51" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="137" class="f-mono f-ink" style="font-size:11px">134/120/46</text>
  <text x="12" y="167" class="f-mono f-ink" style="font-size:11px">+ no answer&gt;</text>
  <rect x="190" y="156" width="167" height="14" class="f-plain"/>
  <rect x="357" y="156" width="124" height="14" class="f-accent"/>
  <rect x="481" y="156" width="39" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="167" class="f-mono f-ink" style="font-size:11px">152/113/35</text>
</svg>
<figcaption>Без выйсця мадэль адмаўляецца 11 разоў, напісаўшы радок, якога ў спісе няма. З выйсцем яна адмаўляецца амаль гэтак жа часта, як у вольным фармаце.</figcaption>
</figure>

## Што хаваюць агульныя лічбы

Потым я параўнаў адказы пытанне за пытаннем і роўныя агульныя лічбы рассыпаліся. Вольны фармат і спіс з "none of the above" абодва адмаўляюцца на 82 пытаннях і абодва выдумляюць адказ на 115. На 51 пытанні адмаўляецца толькі вольны фармат, на 52 толькі спіс. Выходзіць, 103 пытанні з 300 пераходзяць з адмовы ў выдуманы адказ або назад. Агульныя лічбы роўныя толькі таму, што 51 сыходзіць у адзін бок, а 52 у другі.

Вось 2 прыклады з прагону. "In what country does the Danube empty?" Абзац пра Рэйн, які ўпадае ў Паўночнае мора ў Нідэрландах. Дунай там згаданы толькі як даўжэйшая рака. Вольны фармат адказвае `no answer>`, усе 3 спісы адказваюць "the netherlands". "When did the Archduke Sigismund of Austria die?" У абзацы сказана, што ён прадаў Эльзас Бургундыі ў 1469 годзе. Вольны фармат і спіс без выйсця адказваюць "1469", абодва спісы з выйсцем адмаўляюцца.

<figure class="fig">
<svg viewBox="0 0 640 252" role="img" aria-label="Пытанне 1, у якую краіну ўпадае Дунай, абзац пра Рэйн: вольны фармат адмаўляецца, спіс без выйсця адказвае the netherlands, спіс з none of the above адказвае the netherlands, спіс з no answer&gt; адказвае the netherlands. Пытанне 2, калі памёр эрцгерцаг Сігізмунд Аўстрыйскі, у абзацы сказана, што ён прадаў Эльзас у 1469: вольны фармат адказвае 1469, спіс без выйсця адказвае 1469, спіс з none of the above адмаўляецца, спіс з no answer&gt; адмаўляецца.">
  <text x="12" y="18" class="f-label f-muted">2 пытанні, на якія ў абзацы няма адказу, 4 фарматы адказу</text>
  <text x="12" y="44" class="f-mono f-muted" style="font-size:11px">вольна</text>
  <text x="168" y="44" class="f-mono f-muted" style="font-size:11px">спіс без выйсця</text>
  <text x="324" y="44" class="f-mono f-muted" style="font-size:11px">+ none of the above</text>
  <text x="480" y="44" class="f-mono f-muted" style="font-size:11px">+ no answer&gt;</text>
  <text x="12" y="74" class="f-mono f-ink" style="font-size:12px">In what country does the Danube empty?</text>
  <text x="12" y="90" class="f-mono f-muted" style="font-size:10px">абзац пра Рэйн</text>
  <rect x="12" y="100" width="148" height="26" rx="3" class="f-plain"/>
  <text x="18" y="117" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="168" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="324" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="330" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="480" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="486" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <text x="12" y="166" class="f-mono f-ink" style="font-size:12px">When did the Archduke Sigismund of Austria die?</text>
  <text x="12" y="182" class="f-mono f-muted" style="font-size:10px">у абзацы: прадаў Эльзас у 1469</text>
  <rect x="12" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="18" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="168" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="324" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="330" y="209" class="f-mono f-ink" style="font-size:11px">none of the above</text>
  <rect x="480" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="486" y="209" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="12" y="232" width="12" height="10" class="f-plain"/>
  <text x="30" y="241" class="f-mono f-ink" style="font-size:10px">адмова</text>
  <rect x="120" y="232" width="12" height="10" class="f-box"/>
  <text x="138" y="241" class="f-mono f-ink" style="font-size:10px">выдуманы адказ</text>
</svg>
<figcaption>Тая ж мадэль, той жа абзац. Вольны фармат адмаўляецца на пытанні пра Дунай і адказвае 1469 на другое. Абодва спісы з выйсцем робяць наадварот.</figcaption>
</figure>

Я не быў упэўнены, ці кажа лік 103 нешта пра фармат, ці толькі паказвае, як прагнае дэкадаванне скача ад любой змены ўваходу. Таму я параўнаў 2 спісы з выйсцем, якія адрозніваюцца адной фразай у варыянце (d). Яны разыходзяцца на 48 пытаннях. Гэта не чыстая мера шуму, бо гэтыя 2 спісы яшчэ і адмаўляюцца з рознай частатой. А пераход ад вольнага тэксту да спісу мяняе больш, чым адна фраза. І ўсё ж 103 супраць 48 кажа мне, што фармат рухае больш, чым шум.

<figure class="fig">
<svg viewBox="0 0 640 198" role="img" aria-label="2 паласы па 300 пытанняў без адказу. Вольны фармат супраць спісу з none of the above: абодва адмаўляюцца 82, абодва адказваюць 115, адмова толькі ў вольнага 51, толькі ў спісу 52, разыходзяцца 103. Спіс з none of the above супраць спісу з no answer&gt;: абодва адмаўляюцца 119, абодва адказваюць 133, адмова толькі ў першага 15, толькі ў другога 33, разыходзяцца 48.">
  <text x="12" y="18" class="f-label f-muted">тыя ж 300 пытанняў, пытанне за пытаннем</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:10px">абодва адмаўляюцца</text>
  <rect x="212" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="230" y="40" class="f-mono f-ink" style="font-size:10px">абодва адказваюць</text>
  <rect x="12" y="47" width="12" height="10" class="f-accent"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:10px">адмова толькі ў першага</text>
  <rect x="212" y="47" width="12" height="10" class="f-accent" fill-opacity="0.6"/>
  <text x="230" y="56" class="f-mono f-ink" style="font-size:10px">адмова толькі ў другога</text>
  <text x="12" y="84" class="f-mono f-ink" style="font-size:11px">вольна супраць + none of the above</text>
  <rect x="12" y="90" width="131" height="16" class="f-plain"/>
  <text x="16" y="102" class="f-mono f-ink" style="font-size:10px">82</text>
  <rect x="143" y="90" width="184" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="147" y="102" class="f-mono f-ink" style="font-size:10px">115</text>
  <rect x="327" y="90" width="82" height="16" class="f-accent"/>
  <text x="331" y="102" class="f-mono f-ink" style="font-size:10px">51</text>
  <rect x="409" y="90" width="83" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="413" y="102" class="f-mono f-ink" style="font-size:10px">52</text>
  <text x="500" y="102" class="f-mono f-accent" style="font-size:11px">разыходзяцца 103</text>
  <text x="12" y="142" class="f-mono f-ink" style="font-size:11px">+ none of the above супраць + no answer&gt;</text>
  <rect x="12" y="148" width="190" height="16" class="f-plain"/>
  <text x="16" y="160" class="f-mono f-ink" style="font-size:10px">119</text>
  <rect x="202" y="148" width="213" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="206" y="160" class="f-mono f-ink" style="font-size:10px">133</text>
  <rect x="415" y="148" width="24" height="16" class="f-accent"/>
  <text x="419" y="160" class="f-mono f-ink" style="font-size:10px">15</text>
  <rect x="439" y="148" width="53" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="443" y="160" class="f-mono f-ink" style="font-size:10px">33</text>
  <text x="500" y="160" class="f-mono f-accent" style="font-size:11px">разыходзяцца 48</text>
</svg>
<figcaption>Змена фармату рухае 103 пытанні, змена адной фразы ў варыянце (d) рухае 48.</figcaption>
</figure>

## Колькі каштуе выйсце

На 300 пытаннях з адказам вольны фармат адказвае правільна 281 раз, спіс без выйсця 282. З выйсцем правільных 273 пры "none of the above" і 275 пры "no answer>". З "none of the above" мадэль адмовілася на 13 пытаннях, на якія вольны фармат адказаў, адваротнае здарылася адзін раз.

Па ўсіх 600 пытаннях 23 адказы ў спісе без выйсця не супалі ні з адным варыянтам і па 15 у кожным спісе з выйсцем. Большасць з іх гэта правільны варыянт або прынада без кавалка. Альбо іх абрэзаў мой ліміт у 24 выхадныя токены, альбо ў слоўніку не знайшлося сімвала накшталт `ł`. Я лічу іх адказамі. На адмовы яны не ўплываюць і крыху змяншаюць колькасць правільных у кожным спісе.

## Што я з гэтага вынес

Калі лічыць толькі агульныя лічбы, "none of the above" вярнуў тут усю сумленнасць. Але доля адмоў, вымераная ў адным фармаце, мала што кажа мне пра іншы. Калі я праверу выбарку адказаў у адным фармаце, а ў працу выпушчу іншы, трэць пытанняў без адказу можа павесці сябе інакш. Мая праверка гэтага не ўбачыць.

Тут "no answer>" спрацаваў лепш, чым "none of the above". Чаму, я магу толькі здагадвацца. Ён падобны на ўласную адмову мадэлі, але мадэль вывучыла яго з `<no answer>`, а ён разбіваецца на іншыя токены, чым мой варыянт. Якую фармулёўку браць, я б правяраў на сваіх даных.

## Чаго я не правяраў

- Адна мадэль. UnifiedQA вучылася адмаўляцца на SQuAD 2.0, так што ёй ёсць чым адмовіцца. Мадэль без такога навучання, напрыклад GPT-3, я не выклікаў.
- Адзін парадак варыянтаў на пытанне. Калі перамяшаць варыянты, гэта таксама змяняе ўваход. Колькі пытанняў яна зрушыць, я не ведаю.
- У кожным спісе да пытання без адказу была прынада. Без праўдападобнага адказу сярод варыянтаў адмовіцца можа быць лягчэй.
- Прагнае дэкадаванне і адзін поўны прагон. Паўтор 8 пытанняў ва ўсіх 4 фарматах даў тыя ж 32 адказы, так што нявызначанасць звязаная з выбарам 300 пытанняў.
- Ліміт уваходу ў 512 токенаў. Ад 6 да 12 пытанняў у кожным фармаце атрымалі абзац з абрэзаным канцом.
- Пытанні, якія аўтары разметкі пісалі так, каб здавалася, што адказ ёсць. Жывыя карыстальнікі пытаюць інакш.
