---
title: "Я замяніў другую палову чанка, а вектар не змяніўся ні на біт"
description: "MiniLM L6 v2 чытае 256 токенаў і пра астатняе маўчыць. На 1409 пытаннях SQuAD я памераў, што з гэтага выходзіць для памеру чанка, перакрыцця і сплітара на 4000 знакаў па змаўчанні, у якога ў вектары трапляе 35,1% тэксту."
date: 2023-08-06
lang: be
translationKey: chunking-decides
tags: ["llm", "machine-learning", "numbers"]
---

SHA-256 вектара пачынаецца з `8b5453f091`. Гэта вектар чанка пра Super Bowl 50, у ім 3478 знакаў. Першую палову я пакінуў, а на месца другой паставіў другую палову чанка пра Аб'яднаную метадысцкую царкву. На стыку цяпер напісана `2½ sacks,he Methodists", being methodical`. Палічыў вектар нанава. SHA-256 пачынаецца з `8b5453f091`.

Нічога не зламалася. Мадэль `all-MiniLM-L6-v2` чытае 256 токенаў, а замена пачынаецца пасля 347-га. Папярэджання не было, у індэкс кладзецца звычайны радок, пошук па ім працуе.

Пра мяжу я ведаў. Але памер чанка заўсёды браў з прыкладу, у знаках, правяраў некалькі запытаў вачыма і ішоў далей. Колькі майго тэксту насамрэч трапіла ў вектары, я ні разу не лічыў.

## Адна мадэль, 3 мяжы

Цяперашняя рэвізія мадэлі ляжыць на Hugging Face з лістапада 2022 года. Яе `tokenizer.json` абразае тэкст на 128 токенах. У `sentence_bert_config.json` напісана 256, а ў `config.json` і `tokenizer_config.json` стаіць 512. У апісанні мадэлі сказана, што ўсё даўжэйшае за 256 абразаецца, а пры навучанні даўжыня была абмежаваная 128.

`sentence-transformers` 2.2.2 бярэ 256 і перадае такенізатару `truncation='longest_first'`, папярэджанняў у гэтым файле няма зусім. Chroma 0.4.5 спампоўвае архіў з тым самым `tokenizer.json` і ўжо ў кодзе ставіць 256. Калі загрузіць гэты файл самому, атрымаецца 128.

З другога боку стаіць сплітар. LangChain 0.0.250 па змаўчанні робіць чанкі да 4000 знакаў з перакрыццём 200. Пра мадэль гэтае чысло нічога не ведае.

<figure class="fig">
<svg viewBox="0 0 680 214" role="img" aria-label="Чанк з 729 токенаў, другая палова якога пасля токена 347 замененая. Пры мяжы 128 і 256 токенаў хэш вектара той самы: dc3316731f і 8b5453f091. Пры мяжы 512 ён мяняецца з 127b2a3216 на ef6685435c.">
  <text x="80.0" y="18.0" text-anchor="start" class="f-label f-muted">першая палова</text>
  <text x="450.0" y="18.0" text-anchor="end" class="f-label f-muted">другая, замененая</text>
  <text x="560.0" y="18.0" text-anchor="middle" class="f-label f-muted">хэш да / пасля</text>
  <text x="68.0" y="51.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">128</text>
  <rect x="80" y="34" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="34.0" width="64.0" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="44.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="560.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="68.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">256</text>
  <rect x="80" y="82" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="82.0" width="128.9" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="560.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="68.0" y="147.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512</text>
  <rect x="80" y="130" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="130.0" width="258.8" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="140.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">127b2a3216</text>
  <text x="560.0" y="156.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">ef6685435c</text>
  <line x1="256.1" y1="26" x2="256.1" y2="166" class="f-line" style="stroke-dasharray:4 3"/>
  <text x="80.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="256.1" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">347</text>
  <text x="450.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">729</text>
  <text x="80.0" y="204.0" text-anchor="start" class="f-label f-muted">нумар токена ў чанку</text>
</svg>
<figcaption>Адзін чанк сплітара з наладамі па змаўчанні, 729 токенаў. Зафарбавана тое, што мадэль чытае пры кожнай мяжы. Пры 512 косінус паміж двума вектарамі 0,907.</figcaption>
</figure>

## Як мераў

Я ўзяў 8 артыкулаў з SQuAD 1.1 dev і склеіў іх абзацы назад у цэлыя дакументы, разам 69 384 токены. З кожнага артыкула не больш за 200 пытанняў, бо ў аднаго Super Bowl 50 іх 810 і ён вырашыў бы ўсё за астатніх. Засталося 1409 пытанняў. Мадэль гэта ONNX-файл з архіва Chroma, onnxruntime 1.15.1 і tokenizers 0.13.3 на Python 3.11, асерадненне па токенах і косінус адразу па чанках усіх 8 артыкулаў. Пытанне лічыцца знойдзеным, калі эталонны адказ цалкам ляжыць у адным з выдадзеных чанкаў. Параўноўваю зрушэнні, а не радкі.

Першай пяцёркі тут мала. 5 чанкаў па 64 токены гэта 320 токенаў, а 5 чанкаў па 1016 ужо 5080. Таму другая мера з бюджэтам: бяру чанкі па чарзе, пакуль яны змяшчаюцца ў 2032 токены промпта. Пасля ліпеньскага артыкула Лю з суаўтарамі "Lost in the Middle" дасылаць больш тэксту толькі таму, што ён улазіць, мне не хочацца.

Памеры 64, 127, 254 і гэтак далей, бо 2 месцы з 256 займаюць службовыя токены. Чаканні я запісаў да прагону.

## Дзе вінаваты памер, а дзе абразанне

<figure class="fig">
<svg viewBox="0 0 680 310" role="img" aria-label="Доля знойдзеных адказаў па памеры чанка, у дужках доля прачытаных токенаў, спачатку першыя 5 чанкаў, потым бюджэт 2032 токены. 64 (100,0%): 74,3 / 90,7; 127 (100,0%): 79,8 / 92,2; 254 (100,0%): 82,5 / 89,3; 508 (50,8%): 72,5 / 68,3; 508 (100,0%): 83,1 / 80,3; 1016 (26,2%): 71,8 / 47,8.">
  <line x1="50" y1="220.0" x2="670" y2="220.0" class="f-plain"/>
  <text x="42.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="173.5" x2="670" y2="173.5" class="f-plain"/>
  <text x="42.0" y="177.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="50" y1="127.0" x2="670" y2="127.0" class="f-plain"/>
  <text x="42.0" y="131.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="80.5" x2="670" y2="80.5" class="f-plain"/>
  <text x="42.0" y="84.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="50" y1="34.0" x2="670" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="62.0" y="81.8" width="37.7" height="138.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="103.7" y="51.3" width="37.7" height="168.7" style="fill:var(--accent);stroke:none"/>
  <text x="80.8" y="76.8" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">74,3</text>
  <text x="122.5" y="46.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90,7</text>
  <text x="101.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <text x="101.7" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="165.3" y="71.6" width="37.7" height="148.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.0" y="48.5" width="37.7" height="171.5" style="fill:var(--accent);stroke:none"/>
  <text x="184.2" y="66.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">79,8</text>
  <text x="225.8" y="43.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">92,2</text>
  <text x="205.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">127</text>
  <text x="205.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="268.7" y="66.6" width="37.7" height="153.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="310.3" y="53.9" width="37.7" height="166.1" style="fill:var(--accent);stroke:none"/>
  <text x="287.5" y="61.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">82,5</text>
  <text x="329.2" y="48.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">89,3</text>
  <text x="308.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">254</text>
  <text x="308.3" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="372.0" y="85.2" width="37.7" height="134.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="413.7" y="93.0" width="37.7" height="127.0" style="fill:var(--accent);stroke:none"/>
  <text x="390.8" y="80.2" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">72,5</text>
  <text x="432.5" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">68,3</text>
  <text x="411.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="411.7" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">50,8%</text>
  <rect x="475.3" y="65.4" width="37.7" height="154.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="517.0" y="70.6" width="37.7" height="149.4" style="fill:var(--accent);stroke:none"/>
  <text x="494.2" y="60.4" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">83,1</text>
  <text x="535.8" y="65.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">80,3</text>
  <text x="515.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="515.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="578.7" y="86.5" width="37.7" height="133.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="620.3" y="131.1" width="37.7" height="88.9" style="fill:var(--accent);stroke:none"/>
  <text x="597.5" y="81.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">71,8</text>
  <text x="639.2" y="126.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">47,8</text>
  <text x="618.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">1016</text>
  <text x="618.3" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">26,2%</text>
  <text x="50.0" y="16.0" text-anchor="start" class="f-label f-muted">знойдзена, % з 1409 пытанняў</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted">знізу: памер чанка ў токенах, доля прачытаных токенаў</text>
  <rect x="50.0" y="288.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="68.0" y="298.0" text-anchor="start" class="f-label f-muted">першыя 5 чанкаў</text>
  <rect x="270.0" y="288.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="288.0" y="298.0" text-anchor="start" class="f-label f-muted">чанкі на 2032 токены</text>
</svg>
<figcaption>Чанкі па 508 токенаў паказаныя двойчы: абрэзаныя на 256 і прачытаныя цалкам пры мяжы 512.</figcaption>
</figure>

Ад 64 да 254 токенаў вынік у бюджэце амаль роўны: 90,7%, 92,2% і 89,3%. На 508 ён падае да 68,3%, на 1016 да 47,8%. Звычайна гэта тлумачаць тым, што ў вялікага чанка размыты вектар. Але мяжу можна падняць да 512 і даць мадэлі дачытаць тыя самыя чанкі па 508 да канца. Тады выходзіць 80,3%. Гэта значыць, што з 21 пункта, страчанага паміж 254 і 508, 12 вяртаюцца, калі прачытаць тэкст цалкам. У астатніх 9 змяшаныя памер чанка і ўваход, у 4 разы даўжэйшы за той, на якім мадэль вучылася. Раздзяліць іх я не магу.

Я чакаў, што пры роўным бюджэце выйграюць самыя дробныя чанкі. Не выйгралі. 64 токены на 1,5 пункта горш за 127, інтэрвал ад -3,3 да 0,4, у лепшым выпадку нічыя. У першай пяцёрцы яны прайграюць 5,5 пункта. Пры 64 токенах мяжа чанка разрэзала 49 адказаў, пры 254 толькі 12.

З перакрыццём таксама выйшла не так, як я думаў. Чанкі па 254 з перакрыццём 127 падымаюць першае месца з 50,7% да 60,8%. Гэта шмат. Першая пяцёрка дадае 3,8 пункта. А ў бюджэце прыбаўка 1,3 пункта, інтэрвал ад -0,2 да 2,8, пры ўдвая большым індэксе.

## Чаму я б гэтага не заўважыў

У першай пяцёрцы абрэзаныя чанкі па 508 знаходзяць 72,5%. Чанкі па 64, прачытаныя цалкам, знаходзяць 74,3%. Па гэтых двух выніках я б нічога не западозрыў.

Таму падзяліў пытанні па месцы адказу. Калі адказ у прачытанай частцы, першая пяцёрка знаходзіць яго ў 92,5% выпадкаў, а калі ў хвасце, то ў 51,9%. Для тэксту, якога мадэль не бачыла, гэта шмат. Прачытаная частка чанка пра тое ж самае, думаю, яна яго і выцягвае. Але часткова дапамагае і маленькі корпус. У артыкуле ў сярэднім 17,5 такіх чанкаў. Пошук, які ўгадаў бы толькі артыкул і ўзяў з яго 5 выпадковых, адказаў бы на 32,0% тых самых пытанняў пра хвост.

Выходзіць, што прыкладна для паловы пытанняў пра нябачны тэкст патрэбны чанк усё роўна знаходзіцца. Некалькі запытаў, правераных вачыма, прайшлі б.

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="Доля знойдзеных у першых 5 для адказаў у пачатку і ў хвасце чанка. Памер і мяжа, пачатак / хвост. 508, 256: 92,5 / 51,9; 508, 512: 87,8 / 78,9; 4000, 256: 96,0 / 55,4; 4000, 512: 92,9 / 73,9.">
  <line x1="130.0" y1="36" x2="130.0" y2="214" class="f-plain"/>
  <text x="130.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="300.0" y1="36" x2="300.0" y2="214" class="f-plain"/>
  <text x="300.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="470.0" y1="36" x2="470.0" y2="214" class="f-plain"/>
  <text x="470.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="640.0" y1="36" x2="640.0" y2="214" class="f-plain"/>
  <text x="640.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="110.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 256</text>
  <line x1="231.1" y1="62" x2="576.3" y2="62" class="f-line"/>
  <circle cx="231.1" cy="62" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.3" cy="62" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="231.1" y="51.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">51,9</text>
  <text x="576.3" y="51.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92,5</text>
  <text x="110.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 512</text>
  <line x1="460.7" y1="106" x2="536.3" y2="106" class="f-line"/>
  <circle cx="460.7" cy="106" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="536.3" cy="106" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="460.7" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">78,9</text>
  <text x="536.3" y="95.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">87,8</text>
  <text x="110.0" y="154.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 256</text>
  <line x1="260.9" y1="150" x2="606.0" y2="150" class="f-line"/>
  <circle cx="260.9" cy="150" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="606.0" cy="150" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="260.9" y="139.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">55,4</text>
  <text x="606.0" y="139.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">96,0</text>
  <text x="110.0" y="198.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 512</text>
  <line x1="418.2" y1="194" x2="579.7" y2="194" class="f-line"/>
  <circle cx="418.2" cy="194" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="579.7" cy="194" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="418.2" y="183.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">73,9</text>
  <text x="579.7" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92,9</text>
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted">чанк, мяжа</text>
  <circle cx="136" cy="14" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="148.0" y="18.0" text-anchor="start" class="f-label f-muted">адказ у хвасце</text>
  <circle cx="356" cy="14" r="5" style="fill:var(--muted);stroke:none"/>
  <text x="368.0" y="18.0" text-anchor="start" class="f-label f-muted">адказ у пачатку</text>
  <text x="640.0" y="254.0" text-anchor="end" class="f-label f-muted">знойдзена ў першых 5, %</text>
</svg>
<figcaption>Хвост ва ўсіх 4 радках гэта ўсё пасля першых 254 токенаў. 508 у токенах, 4000 у знаках. Пры 512 чанкі па 508 прачытаныя цалкам, а чанкі па 4000 усё адно толькі на 70,1%.</figcaption>
</figure>

Калі тыя самыя чанкі прачытаць цалкам, тыя самыя 2 групы даюць 87,8% і 78,9%. Разрыў сціскаецца з 40,6 пункта да 8,9. Адказы ў пачатку сталі знаходзіцца крыху горш, думаю, таму што адзін вектар цяпер апісвае ўдвая больш тэксту.

## Сплітар па змаўчанні

Рэкурсіўны сплітар LangChain з рознымі аргументамі і той самай мадэллю.

| чанкі | мяжа | прачытана токенаў | першыя 5 | у 2032 токенах |
|---|---|---|---|---|
| 4000 / 200, па змаўчанні | 128 | 17,4% | 63,1% | 42,5% |
| 4000 / 200, па змаўчанні | 256 | 35,1% | 69,2% | 50,5% |
| 4000 / 200, па змаўчанні | 512 | 70,1% | 80,3% | 62,7% |
| 1000 / 200 | 256 | 100,0% | 88,5% | 95,2% |
| абзацы як ёсць | 256 | 96,5% | 89,4% | 95,5% |

З наладамі па змаўчанні атрымалася 96 чанкаў і ўсе 96 даўжэйшыя за мяжу. У 66% пытанняў адказ ляжыць у тэксце, які не трапіў ні ў адзін вектар. Той самы сплітар з `chunk_size=1000` выйграе ў бюджэце 44,7 пункта, па асобных артыкулах ад 39,0 да 52,7. Абразанне тлумачыць толькі частку. Калі падняць мяжу да 512, налады па змаўчанні адыгрываюць 12,2 пункта, хоць 30% токенаў і там не прачытаныя. Рэшта, думаю, у асноўным сам бюджэт: у яго ўваходзіць у сярэднім 2,2 такога чанка супраць 12,8 маленькіх.

Верху гэтай табліцы я не вельмі веру. Пытанні SQuAD складзеныя якраз па гэтых абзацах, а сплітар на 1000 знакаў таксама стараецца рэзаць па пустым радку паміж імі.

Да таго ж 1000 знакаў я праверыў толькі на англійскай мове, там за мяжу выйшлі 2 чанкі з 489. Для рускай палічыў токены ў XQuAD, гэта адны і тыя ж 240 абзацаў на дзвюх мовах. 1000 знакаў па-англійску гэта 205 токенаў, а па-руску 822, так што ў 254 токены змяшчаецца 314 рускіх знакаў. Слоўнік у мадэлі англійскі і для рускай мовы яе браць не трэба. У шматмоўнай `paraphrase-multilingual-MiniLM-L12-v2` мяжа яшчэ ніжэйшая, `max_seq_length` там 128, але яе токены я не лічыў.

## Што я цяпер раблю

```python
tok.no_truncation()
n = [len(tok.encode(c).ids) for c in chunks]
print(max(n), sum(x > 256 for x in n), "з", len(n))
```

3 радкі перад пабудовай індэкса. На сплітары па змаўчанні апошні надрукуе `872 96 з 96`, разам з двума службовымі токенамі.

## Чаго я не правяраў

Адна мадэль, адзін seed, 8 артыкулаў. Корпус маленькі, на сапраўдным працэнты былі б ніжэйшыя. Інтэрвалы атрыманыя бутстрэпам па пытаннях, але пытанні аднаго артыкула не зусім незалежныя, так што насамрэч інтэрвалы, хутчэй за ўсё, шырэйшыя. Мае роўныя чанкі рэжуць дзе давядзецца, нават пасярод слова. Не спрабаваў ні BM25, ні рэранкер, ні сапраўдны адказ LLM. У пытаннях SQuAD шмат слоў з самога абзаца, жывыя людзі пытаюцца не так акуратна. Спосабы нарэзкі добра апісаныя ў чэрвеньскім артыкуле на сайце Pinecone. У DPR у 2020 годзе проста бралі кавалкі па 100 слоў. У чарнавіку ў мяне стаяла, што яны змяшчаюцца пад любую з 3 межаў. Потым я парэзаў так тыя самыя 8 артыкулаў і палічыў: у сярэднім 132 токены разам са службовымі, 287 кавалкаў з 528 даўжэйшыя за 128, даўжэйшых за 256 няма.
