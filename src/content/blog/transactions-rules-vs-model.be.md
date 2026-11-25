---
title: "Класіфікатар аперацый: 94,5% на выпадковым падзеле і 46,9% на новым прадаўцы"
description: "Я параўнаў 22 ручныя правілы, табліцу прадаўцоў, TF-IDF і MiniLM на 83 692 сапраўдных картачных плацяжах улад Вашынгтона. У TF-IDF 94,5% на выпадковым падзеле, 91,5% на наступных 2 месяцах і 46,9% на прадаўцах, якіх ён не бачыў."
date: 2024-04-06
lang: be
translationKey: transactions-rules-vs-model
tags: ["machine-learning", "text", "open-data"]
---

Горад Вашынгтон публікуе пакупкі па сваіх службовых картках (Open Data DC, CC BY 4.0). Я ўзяў 2 гады і палічыў радкі па катэгорыі прадаўца, якая прыходзіць разам з плацяжом. Самая вялікая катэгорыя называецца BOOK STORES, кнігарні, у ёй 15 079 радкоў. З іх 14 785 гэта Amazon.

Значыць, пазнака, якую я збіраўся прадказваць, кажа, кім прадавец запісаны ў плацежнай сістэме, а пра саму пакупку не кажа нічога. Затое яна ёсць у кожнага радка і нічога не каштуе.

Катэгорыі аперацый я лічыў задачай, з якой даўно разабраліся. Навучыў TF-IDF з лагістычнай рэгрэсіяй, убачыў нешта вышэй за 90 і пайшоў далей. Колькі ў гэтым выніку прадаўцоў, якія былі і ў навучанні і ў тэсце, я ні разу не правяраў.

Волсэт з калегамі ў 2017 годзе ўзялі каля 220 тысяч нарвежскіх апісанняў, мяшок слоў і лагістычную рэгрэсію, а потым палепшылі вынік звесткамі з рэестра кампаній. Гарсія-Мендэс з калегамі ў 2020 годзе вучылі SVM на n-грамах сімвалаў і слоў. Мне хацелася дадаць сюды ручныя правілы і асобна палічыць новых прадаўцоў.

## Што я ўзяў

Радкі з сакавіка 2022 па люты 2024 года, толькі тыя, што горад паспеў выкласці да гэтага поста. Без спрэчак, вяртанняў праз махлярства і невядомых кодаў іх 83 692. Частка назваў ужо прычасаная (`AMERICAN AIRLINES` ці проста `PAYPAL`), частка сырая і абрэзаная на 22 сімвалах, накшталт `SQ *MARYLAND BASKETBAL`. 338 апісанняў катэгорый я звёў да 16 яшчэ да запуску класіфікатараў, таму BOOK STORES трапілі ў "пакупкі".

Навучанне гэта ўсё да 31 снежня 2023 года, 77 011 радкоў. Тэст гэта студзень і люты 2024 года, 6681 радок. Прадаўца вызначае ключ з невялікага скрыпта: ён прыбірае прэфіксы накшталт `SQ *`, выкідае словы з лічбамі і пакідае першыя 2 словы. Прадавец новы, калі яго ключа няма ў навучальнай частцы.

Метадаў 5:

- табліца, якая дае вядомаму прадаўцу яго самую частую катэгорыю, а новаму "пакупкі";
- 22 правілы, рэгулярныя выразы, у кожным ад 8 да 25 варыянтаў, напісаныя за адзін раз па 230 найбуйнейшых прадаўцах навучальнай часткі і здаровым розуме;
- TF-IDF па сімвальных n-грамах ад 2 да 4 і лагістычная рэгрэсія;
- эмбедынгі `all-MiniLM-L6-v2` і лагістычная рэгрэсія;
- тыя ж эмбедынгі і 5 бліжэйшых суседзяў.

Python 3.11, `scikit-learn` 1.4.1, `onnxruntime` 1.17.1. Да запуску я запісаў, чаго чакаю. На выпадковым падзеле табліца і TF-IDF дадуць больш за 95%. На новых прадаўцах TF-IDF упадзе ніжэй за 60%. MiniLM будзе там лепшы прынамсі на 5 пунктаў, бо ведае словы, якіх у маім навучанні не было.

## Вынікі

<figure class="fig">
<svg viewBox="0 0 680 352" role="img" aria-label="Дакладнасць 5 метадаў у працэнтах на выпадковым падзеле, на студзені і лютым 2024 года і на новых прадаўцах. табліца: 92,5; 88,9; 13,8. 22 правілы: 67,1; 66,4; 32,8. TF-IDF + LR: 94,5; 91,5; 46,9. MiniLM + LR: 84,9; 81,7; 40,3. MiniLM + 5 NN: 77,8; 77,4; 49,5.">
  <rect x="130.0" y="5.0" width="12.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="150.0" y="15.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">выпадковыя 10% навучальнага перыяду</text>
  <rect x="130.0" y="23.0" width="12.0" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="150.0" y="33.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">студзень і люты 2024</text>
  <rect x="130.0" y="41.0" width="12.0" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="150.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">з іх толькі новыя прадаўцы</text>
  <text x="120.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">табліца</text>
  <rect x="130.0" y="72.0" width="453.3" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="589.3" y="81.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">92,5</text>
  <rect x="130.0" y="86.0" width="435.6" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="571.6" y="95.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">88,9</text>
  <rect x="130.0" y="100.0" width="67.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="203.6" y="109.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13,8</text>
  <text x="120.0" y="153.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22 правілы</text>
  <rect x="130.0" y="128.0" width="328.8" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="464.8" y="137.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">67,1</text>
  <rect x="130.0" y="142.0" width="325.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="461.4" y="151.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">66,4</text>
  <rect x="130.0" y="156.0" width="160.7" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="296.7" y="165.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">32,8</text>
  <text x="120.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">TF-IDF + LR</text>
  <rect x="130.0" y="184.0" width="463.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="599.0" y="193.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">94,5</text>
  <rect x="130.0" y="198.0" width="448.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="584.4" y="207.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">91,5</text>
  <rect x="130.0" y="212.0" width="229.8" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="365.8" y="221.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">46,9</text>
  <text x="120.0" y="265.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + LR</text>
  <rect x="130.0" y="240.0" width="416.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="552.0" y="249.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">84,9</text>
  <rect x="130.0" y="254.0" width="400.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="536.3" y="263.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">81,7</text>
  <rect x="130.0" y="268.0" width="197.5" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="333.5" y="277.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">40,3</text>
  <text x="120.0" y="321.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + 5 NN</text>
  <rect x="130.0" y="296.0" width="381.2" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="517.2" y="305.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,8</text>
  <rect x="130.0" y="310.0" width="379.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="515.3" y="319.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,4</text>
  <rect x="130.0" y="324.0" width="242.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="378.6" y="333.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">49,5</text>
  <line x1="130" y1="66" x2="130" y2="342" class="f-line"/>
</svg>
<figcaption>Доля правільных катэгорый, %. Апошняя паласа ў кожнай групе гэта 580 радкоў ад прадаўцоў, якіх няма ў навучанні. У табліцы там проста запасны адказ 'пакупкі'.</figcaption>
</figure>

На выпадковых 10% навучальнага перыяду ў TF-IDF 94,5%, у табліцы 92,5%. Ужо менш за мае 95. На студзені і лютым 91,5% і 88,9%. У правілаў 66,4%, пры тым што доля самай вялікай катэгорыі 33,8%.

Потым я падзяліў тэст. 6101 радок належыць прадаўцам, якія былі ў навучанні. Там табліца дае 96,1%, крыху больш, чым TF-IDF з яго 95,7%. Астатнія 580 радкоў, 8,7%, гэта 409 новых прадаўцоў. На іх у TF-IDF 46,9%, у правілаў 32,8%. У выпадковым падзеле новых радкоў было ўсяго 4,8% і гэта адна з прычын, чаму ён выглядае лепш. На гэтых 367 радках у TF-IDF усяго 43,6%.

MiniLM не дапамог. У суседзяў на новых прадаўцах 49,5% супраць 46,9%. Бутстрэп па прадаўцах дае для розніцы 95-працэнтны інтэрвал ад -2,7 да 8,3. На знаёмых суседзі губляюць 16 пунктаў. Думаю, апісанні занадта кароткія і абрубленыя для мадэлі, якую вучылі на сказах, але гэтага я не правяраў.

Ды і 46,9% выйшлі такімі дзякуючы гасцініцам. Іх 91 радок з 580, сетка ў іншым горадзе часта лічыцца новым прадаўцом, а TF-IDF угадвае 84,6% такіх радкоў. Без гасцініц застаецца 39,9%.

## Папярэджанні, якія я выключыў

Першы прагон даў для TF-IDF іншыя вынікі. На студзені і лютым было 90,3%, а на прадаўцах, што ў навучанні трапіліся роўна адзін раз, 61,5% пры 94,7% у табліцы. Выглядала так, нібы мадэль забывае тое, што бачыла аднойчы.

Пасля я паўтарыў навучанне ў адным патоку замест 2 і атрымаў 62,3%. Выпуклая задача, развязаная да канца, так паводзіць сябе не павінна. Python я запускаў з `-W ignore`, мяжа была 100 ітэрацый, а схаваным радком быў `ConvergenceWarning`. З мяжой 1000 навучанне спыняецца на 225-й і тыя ж прадаўцы атрымліваюць 84,6%. Новыя ссунуліся з 49,0% на 46,9%, то-бок там ранняе спыненне нават трохі дапамагала.

Папярэджання больш няма, але ад колькасці патокаў вынік усё роўна залежыць. У 2 патокі навучанне спыняецца на 213-й ітэрацыі і дае 83,8% і 47,1%. Выходзіць, стандартны допуск таксама не даводзіць да дакладнага оптымуму. Гэта 2 радкі з 247 і адзін з 580, я пакінуў як ёсць, усе канчатковыя вынікі тут атрыманыя ў адным патоку.

<figure class="fig">
<svg viewBox="0 0 680 424" role="img" aria-label="Дакладнасць у працэнтах у залежнасці ад таго, колькі аперацый прадаўца было ў навучанні. табліца: 0: 13,8; 1: 94,7; ад 2 да 4: 95,1; ад 5 да 19: 91,6; 20+: 97,2. TF-IDF + LR: 0: 46,9; 1: 84,6; ад 2 да 4: 94,6; ад 5 да 19: 93,2; 20+: 96,9. MiniLM + 5 NN: 0: 49,5; 1: 77,7; ад 2 да 4: 77,9; ад 5 да 19: 75,8; 20+: 81,2. 22 правілы: 0: 32,8; 1: 27,9; ад 2 да 4: 34,3; ад 5 да 19: 35,7; 20+: 82,1.">
  <line x1="70" y1="360.0" x2="620" y2="360.0" class="f-plain"/>
  <text x="64.0" y="364.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="285.5" x2="620" y2="285.5" class="f-plain"/>
  <text x="64.0" y="289.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="70" y1="211.0" x2="620" y2="211.0" class="f-plain"/>
  <text x="64.0" y="215.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="136.5" x2="620" y2="136.5" class="f-plain"/>
  <text x="64.0" y="140.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="70" y1="62.0" x2="620" y2="62.0" class="f-plain"/>
  <text x="64.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="4.0" y="50.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">правільна, %</text>
  <text x="135.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="135.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">580 радкоў</text>
  <text x="253.8" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">1</text>
  <text x="253.8" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">247</text>
  <text x="372.5" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">ад 2 да 4</text>
  <text x="372.5" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">411</text>
  <text x="491.3" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">ад 5 да 19</text>
  <text x="491.3" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">928</text>
  <text x="610.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">20+</text>
  <text x="610.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4515</text>
  <text x="355.0" y="416.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">аперацый прадаўца ў навучанні</text>
  <polyline points="135.0,318.9 253.8,77.8 372.5,76.6 491.3,87.0 610.0,70.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="135.0" cy="318.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="253.8" cy="77.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.5" cy="76.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="491.3" cy="87.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="610.0" cy="70.3" r="3" style="fill:var(--ink);stroke:none"/>
  <line x1="70" y1="16" x2="94" y2="16" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="100.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">табліца</text>
  <polyline points="135.0,220.2 253.8,107.9 372.5,78.1 491.3,82.3 610.0,71.2" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="135.0" cy="220.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="107.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="78.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="82.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="71.2" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="218" y1="16" x2="242" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="248.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">TF-IDF + LR</text>
  <polyline points="135.0,212.5 253.8,128.5 372.5,127.9 491.3,134.1 610.0,118.0" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <circle cx="135.0" cy="212.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="128.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="127.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="134.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="118.0" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="366" y1="16" x2="390" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <text x="396.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">MiniLM + 5 NN</text>
  <polyline points="135.0,262.3 253.8,276.9 372.5,257.8 491.3,253.6 610.0,115.3" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <circle cx="135.0" cy="262.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="253.8" cy="276.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="372.5" cy="257.8" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="491.3" cy="253.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="115.3" r="3" style="fill:var(--muted);stroke:none"/>
  <line x1="514" y1="16" x2="538" y2="16" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <text x="544.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">22 правілы</text>
  <text x="127.0" y="209.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">49,5</text>
  <text x="127.0" y="232.2" text-anchor="end" class="f-mono f-accent" style="font-size:11px">46,9</text>
  <text x="127.0" y="266.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">32,8</text>
  <text x="127.0" y="322.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">13,8</text>
  <text x="253.8" y="69.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">94,7</text>
  <text x="263.8" y="119.9" text-anchor="start" class="f-mono f-accent" style="font-size:11px">84,6</text>
  <text x="259.8" y="144.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,7</text>
  <text x="253.8" y="292.9" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">27,9</text>
  <text x="620.0" y="133.3" text-anchor="start" class="f-mono f-muted" style="font-size:11px">82,1</text>
  <text x="620.0" y="75.2" text-anchor="start" class="f-mono f-accent" style="font-size:11px">96,9</text>
</svg>
<figcaption>Той жа тэст, раскладзены па тым, колькі разоў прадавец трапіўся ў навучанні. Пад воссю колькасць радкоў тэсту ў кожнай групе. Правілы не вучацца, яны напісаныя па спісе буйных прадаўцоў.</figcaption>
</figure>

Эфект нікуды не знік, толькі паменшаў. Для прадаўца, якога бачылі адзін раз, табліца лепшая за мадэль. Пачынаючы з 2 аперацый табліца і TF-IDF разыходзяцца не больш чым на 2 пункты, а правілы застаюцца далёка ззаду. C я не падбіраў, засталося 10 з першага прагону. Пры C=100 у прадаўцоў, якіх бачылі адзін раз, выходзіць 91,1%, але новыя апускаюцца да 45,3%.

## Правілы і ўпэўненасць

Правілы пераважна маўчаць. На новых прадаўцах правіла спрацавала ў 228 радках з 580 і было правільным у 58,8% выпадкаў. У TF-IDF на тых жа радках 51,8%. Выбарка малая, гэтую розніцу я б бараніць не стаў.

Больш за ўсё мне падабаецца памылка на `NATIONAL CAR RENTAL`. У мяне было правіла, што NATIONAL азначае асацыяцыю, бо ў навучальным спісе нацыянальных асацыяцый хапае. TF-IDF адказаў "паслугі" з імавернасцю 0,76. Пра транспарт здагадаліся толькі суседзі.

Я спадзяваўся, што імавернасць папярэдзіць пра новага прадаўца. Папярэджвае, але толькі часткова:

| імавернасць | знаёмыя: доля | знаёмыя: правільна | новыя: доля | новыя: правільна |
|---|---|---|---|---|
| ад 0,5 | 97,5% | 97,0% | 69,3% | 57,5% |
| ад 0,7 | 90,1% | 99,0% | 38,3% | 72,5% |
| ад 0,9 | 78,6% | 99,8% | 19,0% | 86,4% |

Адны і тыя ж 0,9 азначаюць прыкладна адну памылку на 500 у знаёмага прадаўца і адну на 7 у новага.

На агульны вынік усё гэта ўплывае слабей, чым я чакаў. Адна табліца дае 88,9%, табліца з 22 правіламі для новых 90,6%, табліца з TF-IDF 91,8%. Калі адказваць толькі тады, калі прадавец знаёмы або імавернасць не ніжэйшая за 0,9, чалавеку застануцца 470 радкоў, 7,0% тэсту, а сярод астатніх правільныя 95,9%.

Я б пачынаў з табліцы, а час траціў на гэтыя 470 радкоў.

## Чаго я не правяраў

Гэта плацяжы гарадскіх службаў, 18,3% радкоў тэсту прыпадае на Amazon, так што на сямейны бюджэт мае працэнты не пераносяцца. Ключ прадаўца прыдумаў я сам, тая ж кампанія ў іншым напісанні лічыцца новай. Голае PAYPAL гэта 2714 навучальных радкоў у 14 катэгорыях, самая частая займае 61,2%, а больш з самога радка нічога не даведаешся. У каманды, якая вядзе правілы гадамі, яны былі б лепшыя за мае. Праверкі з гасцініцамі і 470 радкамі я дадаў ужо пасля таго, як убачыў вынікі. Суму, ведамства і вялікую моўную мадэль я не спрабаваў. Горад правіць старыя радкі, таму выгрузка ў іншы дзень можа крыху адрознівацца.
