---
title: "Найбольшая мадэль эмбедынгаў OpenAI каштуе ў 75 разоў даражэй за найменшую і прайгравае на ArguAna мадэлі на 22 мільёны параметраў"
description: "Бясплатныя мадэлі sentence-transformers 2021 года супраць лікаў, якія OpenAI апублікавала для сваіх эмбедынгаў, на 4 наборах BEIR на 4 ядрах CPU. Лепшая бясплатная мадэль адстае ад самай вялікай мадэлі OpenAI у сярэднім на 3,9 пункта nDCG@10, на ArguAna абыходзіць усе памеры OpenAI і працуе на маім CPU, а Davinci на тых жа корпусах каштаваў бы $9021,57."
date: 2022-05-13
lang: be
translationKey: embeddings-paid-vs-free
tags: ["machine-learning", "llm", "text"]
---
Я хачу зрабіць пошук па сваіх нататках, гэта значыць па пастах гэтага блога. Спачатку трэба выбраць вектары. У студзені OpenAI адкрыла эндпойнт эмбедынгаў і апублікавала артыкул пра мадэлі за ім. Табліца 6 у ім параўноўвае пошукавыя мадэлі OpenAI з 8 іншымі метадамі на 11 наборах з BEIR. BEIR гэта бенчмарк пошуку па незнаёмых даных. У калонцы сярэдняга найбольшая мадэль `cpt-text` XL лепшая ў табліцы, 52,8.

Праз некалькі дзён Нільс Раймерс, аўтар `sentence-transformers`, выклаў доўгі адказ. Ён сам выклікаў API на 6 пошукавых наборах, з Ada і Babbage, яшчэ ў бэце ў снежні. Ён прыйшоў да высновы, што пошукавыя мадэлі на ўзроўні бясплатных, а ў працы каштуюць у 8000, а то і ў 600000 разоў даражэй. Так у мяне апынуліся 2 тэксты з лікамі, якія казалі рознае. Сваіх лікаў у мяне не было.

Да запуску я запісаў сваю здагадку. Лепшая бясплатная мадэль прайграе XL у сярэднім на велічыню ад 3 да 8 пунктаў. І абгоніць найменшую мадэль OpenAI хаця б на 2 наборах з 4. Ацэнку ад 3 да 8 пунктаў я ўзяў толькі з калонкі сярэдняга і на радкі не глядзеў.

## Як мераў

API я не выклікаў. З боку OpenAI бяру лікі з іх артыкула. Па даўжыні вектара найменшы памер S гэта Ada ў API, а найбольшы XL гэта Davinci. У іх 1024 і 12288 лікаў у вектары. Са свайго боку ганяю бясплатныя мадэлі на тых жа наборах з той жа метрыкай. Гэта nDCG@10, яна глядзіць на першыя 10 вынікаў і дае большую вагу верхнім.

Наборы гэта 4 найменшыя з 11, бо ўсё ідзе на CPU з 4 ядрамі. У SciFact 5183 анатацыі і 300 навуковых сцвярджэнняў для праверкі. NFCorpus гэта медыцынскія артыкулы і 323 запыты, напісаныя для шырокай публікі. У FiQA 57638 адказаў з раздзела пра інвестыцыі на Stack Exchange і 648 пытанняў. У ArguAna 8674 аргументы. Для кожнага з 1406 запытаў правільны вынік гэта контраргумент.

Бясплатныя мадэлі гэта 5 мадэляў `sentence-transformers` з чэрвеня па жнівень мінулага года. У `all-MiniLM-L6-v2` 22 мільёны параметраў і вектары з 384 лікаў. У `all-mpnet-base-v2` і `multi-qa-mpnet-base-dot-v1` каля 110 мільёнаў і 768 лікаў. `multi-qa-MiniLM-L6-cos-v1` гэта маленькая мадэль для пытанняў. `msmarco-distilbert-base-tas-b` гэта TAS-B, яна ёсць і ў табліцы OpenAI. Побач з імі BM25 з `rank_bm25` 0.2.2, простае супадзенне слоў. Пошук дакладны, кожны запыт параўноўваецца з кожным дакументам.

Па TAS-B я праверыў, што мае лікі значаць тое ж, што і іхнія. На 4 наборах у мяне 64,28, 31,89, 42,70 і 30,02, а ў табліцы 64,3, 31,9, 42,9 і 30,0. Мой BM25 не той, што ў іх: на SciFact ён на 1,3 пункта ніжэй, на ArguAna на 7 вышэй. BM25 у BEIR гэта Elasticsearch са сваімі наладамі, таму свой я трымаю толькі як арыенцір.

Першы прагон паказаў, наколькі гэта павольна. TAS-B на SciFact лічыла 55 хвілін на 5183 анатацыі, на `sentence-transformers` 2.2.0 з torch 1.11. Па дарозе я страціў яе з вачэй і запусціў другую копію. Другую забіў, толькі калі ўбачыў абедзве ў спісе працэсаў. Потым большая частка прагонаў пайшла на другую ўсталёўку, якая на гэтым CPU прыкладна ў 3 разы хутчэйшая. 4 ячэйкі я прагнаў на абедзвюх усталёўках. Значэнні nDCG@10 супалі дакладна.

## Па наборах

<figure class="fig">
<svg viewBox="0 0 680 376" role="img" aria-label="nDCG@10 на 4 наборах BEIR. SciFact: OpenAI S 67,2, M 70,4, L 74,4, XL 75,4; all-MiniLM-L6-v2 64,5, multi-qa-MiniLM-L6-cos-v1 54,0, msmarco-distilbert-base-tas-b 64,3, multi-qa-mpnet-base-dot-v1 58,9, all-mpnet-base-v2 65,6; BM25 65,2. NFCorpus: OpenAI S 33,2, M 36,7, L 38,0, XL 40,7; all-MiniLM-L6-v2 31,6, multi-qa-MiniLM-L6-cos-v1 29,7, msmarco-distilbert-base-tas-b 31,9, multi-qa-mpnet-base-dot-v1 31,9, all-mpnet-base-v2 33,3; BM25 30,6. ArguAna: OpenAI S 47,0, M 49,2, L 46,9, XL 43,5; all-MiniLM-L6-v2 50,2, multi-qa-MiniLM-L6-cos-v1 49,1, msmarco-distilbert-base-tas-b 42,7, multi-qa-mpnet-base-dot-v1 50,4, all-mpnet-base-v2 46,5; BM25 38,5. FiQA: OpenAI S 38,4, M 42,2, L 45,2, XL 51,2; all-MiniLM-L6-v2 36,9, multi-qa-MiniLM-L6-cos-v1 36,4, msmarco-distilbert-base-tas-b 30,0, multi-qa-mpnet-base-dot-v1 48,8, all-mpnet-base-v2 50,0; BM25 21,7.">
  <text x="10" y="16" class="f-label f-muted">nDCG@10 на 4 наборах BEIR</text>
  <circle cx="16" cy="34" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/><text x="26" y="38" class="f-label f-ink">OpenAI, лікі з іх артыкула</text>
  <circle cx="276" cy="34" r="4" class="f-ink"/><text x="286" y="38" class="f-label f-ink">бясплатныя мадэлі, мой прагон</text>
  <line x1="490" y1="28" x2="490" y2="40" class="f-line f-muted" stroke-width="2"/><text x="498" y="38" class="f-label f-muted">BM25, мой прагон</text>
  <text x="108" y="96" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SciFact</text>
  <line x1="120" y1="92" x2="660" y2="92" class="f-line f-muted" opacity="0.4"/>
  <line x1="526.7" y1="85" x2="526.7" y2="99" class="f-line f-muted" stroke-width="2"/>
  <circle cx="544.8" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="544.8" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="573.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="573.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="609.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="609.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="618.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="618.6" y="63" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="520.6" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="426.3" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="518.5" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="470.2" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="530.1" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <text x="530.1" y="119" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лепшая бясплатная 65,6</text>
  <text x="108" y="166" text-anchor="end" class="f-mono f-ink" style="font-size:12px">NFCorpus</text>
  <line x1="120" y1="162" x2="660" y2="162" class="f-line f-muted" opacity="0.4"/>
  <line x1="215.5" y1="155" x2="215.5" y2="169" class="f-line f-muted" stroke-width="2"/>
  <circle cx="238.8" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="238.8" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="270.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="270.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="282.0" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="282.0" y="133" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="306.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="306.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="224.3" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="207.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="239.6" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <text x="239.6" y="189" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лепшая бясплатная 33,3</text>
  <text x="108" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ArguAna</text>
  <line x1="120" y1="232" x2="660" y2="232" class="f-line f-muted" opacity="0.4"/>
  <line x1="286.1" y1="225" x2="286.1" y2="239" class="f-line f-muted" stroke-width="2"/>
  <circle cx="331.5" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="331.5" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="362.1" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="362.1" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="363.0" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="363.0" y="203" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="382.8" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="382.8" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="391.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="382.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="324.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="393.5" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="358.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <text x="393.5" y="259" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лепшая бясплатная 50,4</text>
  <text x="108" y="306" text-anchor="end" class="f-mono f-ink" style="font-size:12px">FiQA</text>
  <line x1="120" y1="302" x2="660" y2="302" class="f-line f-muted" opacity="0.4"/>
  <line x1="135.0" y1="295" x2="135.0" y2="309" class="f-line f-muted" stroke-width="2"/>
  <circle cx="285.6" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="285.6" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="319.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="319.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="346.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="346.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="400.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="400.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="271.8" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="267.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="210.2" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="379.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="389.6" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <text x="389.6" y="329" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лепшая бясплатная 50,0</text>
  <line x1="120" y1="352" x2="120" y2="356" class="f-line f-muted"/><text x="120" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">20</text>
  <line x1="210" y1="352" x2="210" y2="356" class="f-line f-muted"/><text x="210" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">30</text>
  <line x1="300" y1="352" x2="300" y2="356" class="f-line f-muted"/><text x="300" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">40</text>
  <line x1="390" y1="352" x2="390" y2="356" class="f-line f-muted"/><text x="390" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">50</text>
  <line x1="480" y1="352" x2="480" y2="356" class="f-line f-muted"/><text x="480" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">60</text>
  <line x1="570" y1="352" x2="570" y2="356" class="f-line f-muted"/><text x="570" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">70</text>
  <line x1="660" y1="352" x2="660" y2="356" class="f-line f-muted"/><text x="660" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">80</text>
</svg>
<figcaption>Літары гэта 4 памеры OpenAI з табліцы 6 артыкула. Кропкі гэта бясплатныя мадэлі, падпісаная лепшая з іх на гэтым наборы.</figcaption>
</figure>

У сярэднім здагадка спраўдзілася, блізка да ніжняй мяжы. XL на гэтых 4 наборах дае 52,7. Лепшая асобная бясплатная мадэль, `all-mpnet-base-v2`, дае 48,8. Гэта на 3,9 пункта ніжэй і на 2,4 вышэй за S. Супраць S, калі на кожным наборы браць лепшую бясплатную мадэль, бясплатны бок выйграе на ArguAna і FiQA. На NFCorpus у `all-mpnet-base-v2` 33,29 супраць 33,2. Гэта я лічу нічыёй. На SciFact бясплатны бок прайграе.

Але сярэдняе складаецца з вельмі розных радкоў. На SciFact у XL 75,4, а ў `all-mpnet-base-v2` 65,6, амаль на 10 пунктаў менш. На NFCorpus 40,7 супраць 33,3.

ArguAna ідзе ў адваротны бок. `multi-qa-mpnet-base-dot-v1` атрымлівае 50,4, а `all-MiniLM-L6-v2` 50,2. З 4 памераў OpenAI лепшы M, 49,2, а горшы XL, 43,5. Гэта ва ўласнай табліцы OpenAI. Тут запыт гэта цэлы аргумент, а адказ гэта аргумент супраць яго. Мая здагадка ў тым, што гэта задача, адрозная ад адказу на пытанне, але я гэтага не правяраў. У той жа табліцы XL ніжэй за S яшчэ на Quora і `TREC-COVID`, якія я не ганяў.

FiQA здзівіла мяне найбольш. `multi-qa-mpnet-base-dot-v1` скончыла там першай з 48,8. Гэта вышэй за L, а XL дае 51,2. Гэта выглядала занадта добра, таму я адкрыў спіс таго, на чым мадэль вучылася. Там ёсць пары з загалоўка і адказу з money.stackexchange.com. FiQA сабраная з таго ж сайта. Гэтыя пары ёсць у 4 з 5 маіх бясплатных мадэляў, ва ўсіх, акрамя TAS-B. Аўтары мадэляў выклалі гэтыя пары, для гэтага сайта іх 29404. Я параўнаў. 532 з 648 тэставых пытанняў ёсць там як загалоўкі. У пары да іх стаіць адказ, які FiQA пазначае як рэлевантны.

Я ледзь не выкінуў `all-mpnet-base-v2` з FiQA, бо там ёй трэба 3,8 гадзіны нават на хутчэйшай усталёўцы. Яна скончыла з 50,0. Гэта лепшы бясплатны вынік там, на 1,2 ніжэй за XL. У яе спісе навучальных даных тыя ж пары.

Я чакаў, што на астатніх 116 пытаннях вынік упадзе. Ён амаль не зрушыўся: 48,6 супраць 48,8 у `multi-qa-mpnet-base-dot-v1`, 48,3 супраць 50,3 у `all-mpnet-base-v2`. Але і 116 не чыстыя. 72 з іх там таксама загалоўкі, але з іншым адказам. Яшчэ ў 5 рэлевантны адказ ёсць сярод пар. Толькі 39 пытанняў не сустракаюцца ні тым, ні іншым чынам. На іх 2 мадэлі даюць 44,8 і 43,4. TAS-B, якая гэтага сайта не бачыла, дае там 31,7 супраць 29,9 на астатніх 609. Выходзіць, перавага `all-mpnet-base-v2` над TAS-B 12 пунктаў на 39 пытаннях і 20 на астатніх. На 39 пытаннях яе стандартная памылка каля 6. Пры такой малой колькасці пытанняў я не магу сказаць, ці дапамагае перасячэнне. OpenAI піша, што іх мадэлі вучыліся на даных з інтэрнэту, так што тыя ж старонкі маглі трапіць і ў іх.

## Колькі гэта каштуе

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="Корпусы і тэставыя запыты ўсіх 4 набораў, 15,0 мільёна токенаў. Ada $120,29, сярэдняе nDCG@10 46,5. Babbage $180,43, сярэдняе nDCG@10 49,6. Curie $902,16, сярэдняе nDCG@10 51,1. Davinci $9 021,57, сярэдняе nDCG@10 52,7. all-mpnet на маім CPU $0, сярэдняе nDCG@10 48,8.">
  <text x="10" y="16" class="f-label f-muted">Корпусы і тэставыя запыты ўсіх 4 набораў, 15,0 мільёна токенаў</text>
  <text x="670" y="30" text-anchor="end" class="f-label f-muted" style="font-size:11px">сярэдняе nDCG@10</text>
  <text x="220" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Ada (S)</text>
  <rect x="230" y="37" width="4.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="240.0" y="49" class="f-label f-ink">$120,29</text>
  <text x="670" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">46,5</text>
  <text x="220" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Babbage (M)</text>
  <rect x="230" y="67" width="6.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="242.0" y="79" class="f-label f-ink">$180,43</text>
  <text x="670" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">49,6</text>
  <text x="220" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Curie (L)</text>
  <rect x="230" y="97" width="30.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="266.0" y="109" class="f-label f-ink">$902,16</text>
  <text x="670" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">51,1</text>
  <text x="220" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Davinci (XL)</text>
  <rect x="230" y="127" width="300.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="536.0" y="139" class="f-label f-ink">$9 021,57</text>
  <text x="670" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">52,7</text>
  <line x1="10" y1="156" x2="670" y2="156" class="f-line f-muted" opacity="0.4"/>
  <text x="220" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">all-mpnet на маім CPU</text>
  <text x="236" y="175" class="f-label f-ink">$0</text>
  <text x="670" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">48,8</text>
</svg>
<figcaption>Цэны са старонкі OpenAI на канец красавіка 2022 года, токены палічаныя токенізатарам GPT-2. Памеры супастаўленыя з мадэлямі API па даўжыні вектара. Сярэдняе па тых жа 4 наборах, у OpenAI з іх артыкула, у лепшай асобнай бясплатнай мадэлі з майго прагону.</figcaption>
</figure>

Токены я лічыў токенізатарам GPT-2 і абразаў дакументы да 2040 токенаў. Раймерс згадвае пра такое абразанне ў дапаўненні да свайго паста. Яно ўзята са скрыпта, які пазней даслаў аўтар артыкула. Цэны са старонкі OpenAI на канец красавіка: $0,008 за 1000 токенаў на Ada і $0,60 на Davinci, у 75 разоў даражэй. Корпусы і тэставыя запыты ўсіх 4 набораў гэта 15,0 мільёна токенаў. Гэта $120,29 на Ada і $9021,57 на Davinci. З іх $5960 прыпадае на адну FiQA.

Davinci дае 12288 лікаў на дакумент. У float32 вектары FiQA займаюць 2,8 ГБ, супраць 89 МБ у MiniLM з яе 384 лікамі.

За бясплатны бок плаціш працэсарным часам. `all-MiniLM-L6-v2` закадавала SciFact за 11 хвілін на той жа версіі 2.2.0 і тых жа 4 ядрах. На хутчэйшай усталёўцы 3 мадэлі з 768 лікамі ішлі на SciFact у 6, а то і ў 16 разоў даўжэй за MiniLM.

Так што выбар залежыць ад таго, на што падобныя мае нататкі. Калі на SciFact, XL у артыкуле прыкладна на 10 пунктаў nDCG@10 вышэй за лепшую бясплатную мадэль. Закадаваць адзін SciFact на Davinci каштуе $1015,80, гэта значыць каля $1000 за 5000 анатацый. Калі на ArguAna, `all-MiniLM-L6-v2` з 22 мільёнамі параметраў адстае ад лепшай бясплатнай на 0,2 і стаіць вышэй за любы памер OpenAI. Даведаюся я пра гэта, толькі калі напішу невялікі набор пытанняў з размечанымі адказамі па сваіх нататках. Для свайго пошуку я такога не рабіў ніколі.

## Чаго я не правяраў

- Сам API. Раймерс атрымаў ад API на FiQA іншыя вынікі, чым у артыкуле. Потым ён знайшоў прычыну ў тым, як рэжуцца доўгія тэксты. Мадэлі ў API маглі і памяняцца з часу выхаду артыкула.
- 7 з 11 набораў табліцы, у тым ліку Quora і `TREC-COVID`, дзе XL прайгравае S. На 4 ядрах MiniLM лічыла б іх тыднямі, а большыя мадэлі месяцамі.
- Перасячэнне з навучальнымі данымі на астатніх 3 наборах. Я глядзеў толькі FiQA, бо яе лік выглядаў падазрона.
- Пераранжавальнікі і SPLADE. У артыкуле ў SPLADE v2 у сярэднім па 11 наборах 52,7, на 0,1 ніжэй за XL.
