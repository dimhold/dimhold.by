---
title: "Я квантаваў BERT у int8 адным радком і файл стаў меншы ў 2,45 раза"
description: "Я прагнаў дынамічную квантызацыю ў int8 з PyTorch 1.3 адным радком на данавучаным BERT для MRPC. Файл стаў 177 МБ замест 433, а не 110, бо эмбедынгі застаюцца ў float32. Дакладнасць упала на 6 пар з 408, і 11 з 12 адказаў, што змяніліся, пайшлі ў бок парафразу. На 1 патоку int8 амаль у 2 разы хутчэйшы, на 4 патоках павольнейшы."
date: 2019-10-19
lang: be
translationKey: bert-int8-mrpc
tags: ["machine-learning", "performance", "numbers"]
---
10 кастрычніка выйшаў PyTorch 1.3, у ім ёсць квантызацыя з пазнакай "эксперыментальная". Самая простая яе частка гэта дынамічная квантызацыя: на навучанай мадэлі выклікаецца `torch.quantization.quantize_dynamic` і кожны `nn.Linear` захоўвае вагі цэлымі лікамі па 8 бітаў. Актывацыі пераводзяцца на ляту падчас вываду.

Звычайную формулу пра int8 я і сам паўтараў шмат разоў. Было 4 байты, стаў 1, значыць мадэль у 4 разы меншая, а стратай дакладнасці можна знехтаваць. На мадэлі, якой можна карыстацца, я гэта ні разу не мераў. Некалькі дзён таму Зафрыр з калегамі з Intel AI Lab выклалі Q8BERT. Галоўны іх вынік гэта BERT, навучаны з улікам квантызацыі. Але ў іх табліцы ёсць і радок без навучання, іх уласная дынамічная квантызацыя, дзе квантуюцца яшчэ і эмбедынгі. На MRPC яна апускае F1 з 90,0 да 87,9, заўважна горш, чым 89,6 у іх жа з навучаннем, але гэта іх рэалізацыя, а мне хацелася зразумець, што дае радок з PyTorch на гатовай мадэлі і куды сыходзяць байты.

## Абстаноўка

Мадэль `bert-base-cased-finetuned-mrpc`, гатовы данавучаны BERT base, які transformers 2.1.1 аддае для MRPC. Задача такая: ёсць 2 сказы, парафраз гэта ці не. У dev у MRPC 408 пар. Python 3.7, PyTorch 1.3.0 у зборцы для CPU, 4 vCPU на AMD EPYC, 8 ГБ памяці. Кожную пару я праганяў асобна, батчам 1, як гэта рабіў бы сэрвіс.

```python
q = torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)
```

Канфігурацыя па змаўчанні ў 1.3 захоўвае кожную матрыцу вагаў з 1 маштабам на ўвесь тэнзар. Найбольшая па модулі вага трапляе прыкладна ў 127, астатнія акругляюцца да бліжэйшага кроку.

## Памер

Зыходны файл важыць 433 МБ. Я чакаў нешта каля 110. Захаваны state dict квантаванай мадэлі важыць 177 МБ. Гэта меней у 2,45 раза.

Мае 110 былі проста 433, падзеленыя на 4, таму я палічыў параметры па групах. У BERT base cased 108,3 мільёна параметраў. 85,5 мільёна з іх гэта вагі 74 слаёў `Linear`. Яны сапраўды сціснуліся з 4 байтаў да 1. Але 22,7 мільёна прыпадае на эмбедынгі, у асноўным на табліцу слоўніка з 28996 токенаў на 768. Квантаванага эмбедынгу ў 1.3 няма, а выклік мяняе толькі `Linear`, таму эмбедынгі застаюцца ў float32 і займаюць 90,7 МБ. Гэта 51% квантаванага файла.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Два слупкі памеру файла. Float32: 433 МБ, з іх вагі Linear 342,1 МБ і эмбедынгі 90,7 МБ. Int8: 177 МБ, з іх вагі Linear 85,5 МБ і тыя ж 90,7 МБ эмбедынгаў у float32, гэта 51% файла.">
  <text x="98.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">float32</text>
  <rect x="110" y="26" width="371.1" height="34" class="f-box"/>
  <text x="295.5" y="47.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">342,1</text>
  <rect x="481.1" y="26" width="98.3" height="34" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="530.3" y="47.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90,7</text>
  <text x="588.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">433 МБ</text>
  <text x="98.0" y="117.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">int8</text>
  <rect x="110" y="96" width="92.8" height="34" class="f-box"/>
  <text x="156.4" y="117.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">85,5</text>
  <rect x="202.8" y="96" width="98.3" height="34" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="251.9" y="117.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90,7</text>
  <text x="309.7" y="117.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">177 МБ</text>
  <rect x="110" y="170" width="12" height="12" class="f-box"/>
  <text x="128.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">вагі Linear</text>
  <rect x="310" y="170" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="328.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">эмбедынгі, float32</text>
</svg>
<figcaption>State dict мадэлі BERT для MRPC да і пасля quantize_dynamic у PyTorch 1.3.0. У 4 разы сціскаецца толькі частка Linear.</figcaption>
</figure>

## Дакладнасць

Мадэль у float правільна адказвае на 345 пар з 408, гэта 84,6% дакладнасці і F1 89,4. Пасля квантызацыі правільных 339, 83,1% і F1 88,6. Змянілася 12 адказаў. 9 правільных сталі няправільнымі і 3 няправільныя сталі правільнымі.

Чыстая страта ў 6 пар з 408 гэта мала, каб будаваць на ёй выснову. Крытэрый знакаў на 9 супраць 3 дае p каля 0,15, гэта можа быць выпадковасцю. З кірункам справа іншая. 11 з 12 адказаў, што змяніліся, пайшлі ў бок "парафраз". Па ўсіх 408 парах розніца паміж 2 логітамі зрушылася ў бок "парафраз" ў 74% выпадкаў. Калі парог рашэння падбіралі на мадэлі ў float, гэты зрух перацягвае частку адказаў праз яго.

## Дзе ламаецца

Потым я змадэляваў меншую разраднасць. Акругліў вагі ўсіх слаёў `Linear` да меншай колькасці бітаў, ад 8 да 2. Актывацыі засталіся ў float. Гэта сімуляцыя толькі дакладнасці, памяць ад яе не мяняецца.

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Колькасць правільных адказаў з 408 у залежнасці ад колькасці біт вагаў Linear. Адзін маштаб на тэнзар: 8: 342, 6: 316, 5: 129, 4: 279, 3: 135, 2: 279. Адзін маштаб на радок: 8: 345, 6: 345, 5: 344, 4: 338, 3: 317, 2: 129. Мадэль у float дае 345, адказ &quot;парафраз&quot; на ўсё 279, сапраўдная int8 мадэль 339.">
  <line x1="100" y1="230" x2="410" y2="230" class="f-plain"/>
  <text x="92.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="100" y1="189.6153846153846" x2="410" y2="189.6153846153846" class="f-plain"/>
  <text x="92.0" y="193.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <line x1="100" y1="149.23076923076923" x2="410" y2="149.23076923076923" class="f-plain"/>
  <text x="92.0" y="153.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="100" y1="108.84615384615385" x2="410" y2="108.84615384615385" class="f-plain"/>
  <text x="92.0" y="112.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">250</text>
  <line x1="100" y1="68.46153846153845" x2="410" y2="68.46153846153845" class="f-plain"/>
  <text x="92.0" y="72.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="100" y1="28.076923076923066" x2="410" y2="28.076923076923066" class="f-plain"/>
  <text x="92.0" y="32.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">350</text>
  <text x="100.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="203.3" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="255.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="306.7" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="358.3" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="410.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="255.0" y="264.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">біт на вагу</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">правільна з 408</text>
  <line x1="100" y1="32.1" x2="410" y2="32.1" style="stroke:var(--muted);"/>
  <text x="418.0" y="36.1" text-anchor="start" class="f-mono f-muted" style="font-size:11px">float 345</text>
  <line x1="100" y1="85.4" x2="410" y2="85.4" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="418.0" y="89.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">заўсёды &quot;парафраз&quot; 279</text>
  <polyline points="100.0,34.5 203.3,55.5 255.0,206.6 306.7,85.4 358.3,201.7 410.0,85.4" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="100.0" cy="34.5" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="203.3" cy="55.5" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="255.0" cy="206.6" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="306.7" cy="85.4" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="358.3" cy="201.7" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="410.0" cy="85.4" r="3.5" class="f-ink" style="stroke:none"/>
  <polyline points="100.0,32.1 203.3,32.1 255.0,32.9 306.7,37.8 358.3,54.7 410.0,206.6" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="100.0" cy="32.1" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="203.3" cy="32.1" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="255.0" cy="32.9" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="306.7" cy="37.8" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="358.3" cy="54.7" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="410.0" cy="206.6" r="3.5" class="f-accent" style="stroke:none"/>
  <rect x="96.0" y="33.0" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="110.0" y="55.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">сапраўдны int8 339</text>
  <line x1="100" y1="284" x2="122" y2="284" style="stroke:var(--ink);stroke-width:1.6"/>
  <text x="128.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 маштаб на тэнзар</text>
  <line x1="330" y1="284" x2="352" y2="284" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="358.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 маштаб на радок</text>
</svg>
<figcaption>Сімуляцыя акруглення толькі вагаў Linear, актывацыі ў float. На 279 мадэль адказвае &quot;парафраз&quot; на кожную пару, каля 130 &quot;не парафраз&quot; амаль на кожную.</figcaption>
</figure>

З 1 маштабам на тэнзар 8 бітаў каштуюць 3 пары. Сапраўдная мадэль у int8 губляе 6. Астатнія 3, як я мяркую, дадае тое, чаго я не мадэляваў: акругленне актывацый на ляту і само цэлалікавае ядро. На 6 бітах мадэль губляе 29 пар. На 5 бітах яна адказвае "не парафраз" на ўсё, на 4 бітах "парафраз" на ўсё.

Тады я даў кожнаму радку кожнай матрыцы свой маштаб. 8 і 6 бітаў далі 345, столькі ж, колькі float. 5 бітаў страцілі 1 пару, 4 біты страцілі 7, прыкладна як сапраўдная мадэль у int8.

Прычына ў некалькіх матрыцах. Возьмем 12 выхадных слаёў feed forward, тых, што вядуць з 3072 назад у 768. У кожным з іх найбольшая вага перавышае тыповы максімум радка ад 10 да 32 разоў. У слоі 8 гэта 4,60 супраць 0,14. Гэты адзін лік задае маштаб усёй матрыцы. 41% яе вагаў на 8 бітах акругляюцца ў 0. Ва ўсіх астатніх слаях мадэлі гэтая адносіна меншая за 7.

<figure class="fig">
<svg viewBox="0 0 680 254" role="img" aria-label="Адносіны найбольшай вагі да медыяны максімумаў па радках для кожнага з 74 слаёў Linear. Вылучаны 12 выхадных слаёў feed forward: 9,9, 11,4, 15,4, 18,3, 18,3, 20,5, 24,8, 24,9, 26,6, 27,1, 27,5, 32,1. Ва ўсіх астатніх слаёў менш за 6,8.">
  <line x1="60" y1="200" x2="660" y2="200" class="f-plain"/>
  <text x="52.0" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="148" x2="660" y2="148" class="f-plain"/>
  <text x="52.0" y="152.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="60" y1="96" x2="660" y2="96" class="f-plain"/>
  <text x="52.0" y="100.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="44" x2="660" y2="44" class="f-plain"/>
  <text x="52.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <rect x="61.0" y="187.5" width="6.1" height="12.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="69.1" y="174.6" width="6.1" height="25.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="77.2" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="85.3" y="166.2" width="6.1" height="33.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="93.4" y="183.8" width="6.1" height="16.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="101.5" y="140.9" width="6.1" height="59.1" style="fill:var(--accent);stroke:none"/>
  <rect x="109.6" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="117.8" y="187.6" width="6.1" height="12.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="125.9" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="134.0" y="177.9" width="6.1" height="22.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="142.1" y="185.2" width="6.1" height="14.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="150.2" y="119.8" width="6.1" height="80.2" style="fill:var(--accent);stroke:none"/>
  <rect x="158.3" y="180.9" width="6.1" height="19.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="166.4" y="177.7" width="6.1" height="22.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="174.5" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="182.6" y="188.5" width="6.1" height="11.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="190.7" y="183.4" width="6.1" height="16.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="198.8" y="104.6" width="6.1" height="95.4" style="fill:var(--accent);stroke:none"/>
  <rect x="206.9" y="181.3" width="6.1" height="18.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="215.1" y="179.9" width="6.1" height="20.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="223.2" y="189.4" width="6.1" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="231.3" y="185.1" width="6.1" height="14.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="239.4" y="181.5" width="6.1" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="247.5" y="70.4" width="6.1" height="129.6" style="fill:var(--accent);stroke:none"/>
  <rect x="255.6" y="190.1" width="6.1" height="9.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="263.7" y="187.9" width="6.1" height="12.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="271.8" y="182.3" width="6.1" height="17.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="279.9" y="179.2" width="6.1" height="20.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="288.0" y="182.5" width="6.1" height="17.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="296.1" y="59.2" width="6.1" height="140.8" style="fill:var(--accent);stroke:none"/>
  <rect x="304.2" y="189.6" width="6.1" height="10.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="312.4" y="188.6" width="6.1" height="11.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="320.5" y="191.5" width="6.1" height="8.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.6" y="189.4" width="6.1" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="336.7" y="181.5" width="6.1" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="344.8" y="61.7" width="6.1" height="138.3" style="fill:var(--accent);stroke:none"/>
  <rect x="352.9" y="190.6" width="6.1" height="9.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="361.0" y="189.3" width="6.1" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="369.1" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="377.2" y="184.0" width="6.1" height="16.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="385.3" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="393.4" y="93.4" width="6.1" height="106.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.5" y="189.3" width="6.1" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="409.6" y="187.7" width="6.1" height="12.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="417.8" y="192.3" width="6.1" height="7.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="425.9" y="185.6" width="6.1" height="14.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="434.0" y="181.9" width="6.1" height="18.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="442.1" y="104.7" width="6.1" height="95.3" style="fill:var(--accent);stroke:none"/>
  <rect x="450.2" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="458.3" y="189.8" width="6.1" height="10.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="466.4" y="191.1" width="6.1" height="8.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="474.5" y="185.8" width="6.1" height="14.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="482.6" y="171.3" width="6.1" height="28.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="490.7" y="33.3" width="6.1" height="166.7" style="fill:var(--accent);stroke:none"/>
  <text x="494.8" y="27.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">32</text>
  <rect x="498.8" y="192.3" width="6.1" height="7.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="506.9" y="190.3" width="6.1" height="9.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="515.1" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="523.2" y="173.3" width="6.1" height="26.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="531.3" y="164.5" width="6.1" height="35.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="539.4" y="56.8" width="6.1" height="143.2" style="fill:var(--accent);stroke:none"/>
  <rect x="547.5" y="190.7" width="6.1" height="9.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="555.6" y="191.9" width="6.1" height="8.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="563.7" y="189.8" width="6.1" height="10.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="571.8" y="180.6" width="6.1" height="19.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="579.9" y="180.8" width="6.1" height="19.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="588.0" y="71.3" width="6.1" height="128.7" style="fill:var(--accent);stroke:none"/>
  <rect x="596.1" y="190.1" width="6.1" height="9.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="604.2" y="186.2" width="6.1" height="13.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612.4" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="620.5" y="182.3" width="6.1" height="17.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="628.6" y="186.6" width="6.1" height="13.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636.7" y="148.4" width="6.1" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="644.8" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="652.9" y="194.8" width="6.1" height="5.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="60.0" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 0</text>
  <text x="157.3" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 2</text>
  <text x="254.6" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 4</text>
  <text x="351.9" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 6</text>
  <text x="449.2" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 8</text>
  <text x="546.5" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">слой 10</text>
  <text x="52.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">макс. вага / медыяна макс. радкоў</text>
  <rect x="60" y="230" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">выхад feed forward, 3072 у 768</text>
  <rect x="360" y="230" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">астатнія слаі Linear</text>
</svg>
<figcaption>Выхадны слой 8: найбольшая вага 4,60, тыповы максімум радка 0,14. З 1 маштабам на матрыцу 41% яе вагаў акругляюцца ў 0 на 8 бітах.</figcaption>
</figure>

Відавочныя лекі гэта пакінуць гэтыя 12 слаёў у float. Я паспрабаваў. Файл вырастае да 262 МБ, а мадэль адказвае правільна на 340 пар замест 339, гэта значыць 85 МБ зверху за 1 пару. Я б столькі не плаціў.

У `quantize_dynamic` з 1.3 няма налады для маштабу на радок, але ядро яго прымае, калі сабраць вагі рукамі праз `torch.quantize_per_channel`. Я чакаў атрымаць тыя 345 з сімуляцыі. Мадэль адказала "парафраз" на ўсе 408 пар. З дыяпазонам, абрэзаным да 7 бітаў, яна зноў дала 339, якраз як па змаўчанні. Падазраю перапаўненне ўнутры цэлалікавага ядра, калі кожны радок займае ўвесь дыяпазон, але разбірацца не стаў.

## Хуткасць

Я чакаў, што int8 будзе хутчэйшы. Першы поўны праход па dev сказаў адваротнае: 33 секунды ў int8 супраць 27 у float, на 4 патоках.

Для замеру часу я ўзяў першыя 200 пар, каб прагоны былі карацейшыя. Па медыяне 3 прагонаў мадэль у int8 траціць 80 мс на пару на 1 патоку супраць 151 мс у float. Гэта амаль у 2 разы хутчэй. На 4 патоках float траціць 60 мс, а int8 усё тыя ж 80. Я праверыў асобны слой. `Linear` у int8 траціць 1,7 мс на 1, 2 і 4 патоках, у float час падае з 3,3 да 1,0 мс. У зыходніках 1.3.0 дынамічны `Linear` у int8 выклікае fbgemm з 1 патокам, таму на 4 ядрах квантаваная мадэль павольнейшая.

У лікаў float свая пастка. MKL унутры гэтага PyTorch выбірае шлях выканання па працэсары. На гэтым AMD шлях па змаўчанні павольны. Тады float траціць 433 мс на пару на 1 патоку і int8 выглядае хутчэйшым у 5 разоў. Я прымусіў MKL пайсці хуткім шляхам. Усе лікі float вышэй атрыманы так. Квантаваны `Linear` працуе на fbgemm, таму мадэль у int8 гэтага амаль не заўважае: 84 мс супраць 80. На AMD я б не верыў паскарэнню ад int8 у 1.3, пакуль не праверыў, якім шляхам MKL ішоў на баку float.

## Чаго я не правяраў

1 мадэль і 1 маленькая задача. MRPC з 408 парамі гэта шумная праверка. Памяць запушчанага працэсу я не мераў, толькі захаваныя вагі. Мадэль з меншым слоўнікам або з квантаванымі эмбедынгамі, як у Q8BERT, будзе бліжэй да 4 разоў. Статычную квантызацыю і навучанне з квантызацыяй я не спрабаваў.

Пакуль што я б узяў гэты радок для аднапатокавага сэрвісу, дзе важная памяць, але парог рашэння на квантаванай мадэлі праверыў бы нанова, перш чым ёй давяраць.
