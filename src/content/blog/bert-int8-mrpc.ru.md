---
title: "Я квантовал BERT в int8 одной строкой и файл стал меньше в 2,45 раза"
description: "Я прогнал динамическую квантизацию в int8 из PyTorch 1.3 одной строкой на дообученном BERT для MRPC. Файл стал 177 МБ вместо 433, а не 110, потому что эмбеддинги остаются во float32. Точность упала на 6 пар из 408, и 11 из 12 сменившихся ответов ушли в сторону парафраза. На 1 потоке int8 почти в 2 раза быстрее, на 4 потоках медленнее."
date: 2019-10-19
lang: ru
translationKey: bert-int8-mrpc
tags: ["machine-learning", "performance", "numbers"]
---
10 октября вышел PyTorch 1.3, в нём есть квантизация с пометкой "экспериментальная". Самая простая её часть это динамическая квантизация: на обученной модели вызывается `torch.quantization.quantize_dynamic` и каждый `nn.Linear` хранит веса целыми числами по 8 бит. Активации переводятся на лету во время вывода.

Обычную формулу про int8 я и сам повторял много раз. Было 4 байта, стал 1, значит модель в 4 раза меньше, а потерей точности можно пренебречь. На модели, которой можно пользоваться, я это ни разу не мерил. Несколько дней назад Зафрир с коллегами из Intel AI Lab выложили Q8BERT. Главный их результат это BERT, обученный с учётом квантизации. Но в их таблице есть и строка без обучения, их собственная динамическая квантизация, где квантуются ещё и эмбеддинги. На MRPC она опускает F1 с 90,0 до 87,9, заметно хуже, чем 89,6 у них же с обучением, но это их реализация, а мне хотелось понять, что даёт строка из PyTorch на готовой модели и куда уходят байты.

## Обстановка

Модель `bert-base-cased-finetuned-mrpc`, готовый дообученный BERT base, который transformers 2.1.1 отдаёт для MRPC. Задача такая: даны 2 предложения, парафраз это или нет. В dev у MRPC 408 пар. Python 3.7, PyTorch 1.3.0 в сборке для CPU, 4 vCPU на AMD EPYC, 8 ГБ памяти. Каждую пару я прогонял отдельно, батчем 1, как это делал бы сервис.

```python
q = torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)
```

Конфигурация по умолчанию в 1.3 хранит каждую матрицу весов с 1 масштабом на весь тензор. Самый большой по модулю вес уходит примерно в 127, остальные округляются до ближайшего шага.

## Размер

Исходный файл весит 433 МБ. Я ждал что-то около 110. Сохранённый state dict квантованной модели весит 177 МБ. Это меньше в 2,45 раза.

Мои 110 были просто 433, делённые на 4, поэтому я посчитал параметры по группам. В BERT base cased 108,3 миллиона параметров. 85,5 миллиона из них это веса 74 слоёв `Linear`. Они действительно ужались с 4 байт до 1. Но 22,7 миллиона приходится на эмбеддинги, в основном на таблицу словаря из 28996 токенов на 768. Квантованного эмбеддинга в 1.3 нет, а вызов меняет только `Linear`, поэтому эмбеддинги остаются во float32 и занимают 90,7 МБ. Это 51% квантованного файла.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Два столбца размера файла. Float32: 433 МБ, из них веса Linear 342,1 МБ и эмбеддинги 90,7 МБ. Int8: 177 МБ, из них веса Linear 85,5 МБ и те же 90,7 МБ эмбеддингов во float32, это 51% файла.">
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
  <text x="128.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">веса Linear</text>
  <rect x="310" y="170" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="328.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">эмбеддинги, float32</text>
</svg>
<figcaption>State dict модели BERT для MRPC до и после quantize_dynamic в PyTorch 1.3.0. В 4 раза сжимается только часть Linear.</figcaption>
</figure>

## Точность

Модель во float верно отвечает на 345 пар из 408, это 84,6% точности и F1 89,4. После квантизации верных 339, 83,1% и F1 88,6. Сменилось 12 ответов. 9 верных стали неверными и 3 неверных стали верными.

Чистая потеря в 6 пар из 408 это мало, чтобы строить на ней вывод. Критерий знаков на 9 против 3 даёт p около 0,15, это может быть случайностью. С направлением дело другое. 11 из 12 сменившихся ответов ушли в сторону "парафраз". По всем 408 парам разница между 2 логитами сдвинулась в сторону "парафраз" в 74% случаев. Если порог решения подбирали на модели во float, этот сдвиг перетаскивает часть ответов через него.

## Где ломается

Потом я смоделировал меньшую разрядность. Округлил веса всех слоёв `Linear` до меньшего числа бит, от 8 до 2. Активации остались во float. Это симуляция только точности, память от неё не меняется.

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Число верных ответов из 408 в зависимости от числа бит весов Linear. Один масштаб на тензор: 8: 342, 6: 316, 5: 129, 4: 279, 3: 135, 2: 279. Один масштаб на строку: 8: 345, 6: 345, 5: 344, 4: 338, 3: 317, 2: 129. Модель во float даёт 345, ответ &quot;парафраз&quot; на всё 279, настоящая int8 модель 339.">
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
  <text x="255.0" y="264.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">бит на вес</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">верно из 408</text>
  <line x1="100" y1="32.1" x2="410" y2="32.1" style="stroke:var(--muted);"/>
  <text x="418.0" y="36.1" text-anchor="start" class="f-mono f-muted" style="font-size:11px">float 345</text>
  <line x1="100" y1="85.4" x2="410" y2="85.4" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="418.0" y="89.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">всегда &quot;парафраз&quot; 279</text>
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
  <text x="110.0" y="55.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">настоящий int8 339</text>
  <line x1="100" y1="284" x2="122" y2="284" style="stroke:var(--ink);stroke-width:1.6"/>
  <text x="128.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 масштаб на тензор</text>
  <line x1="330" y1="284" x2="352" y2="284" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="358.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 масштаб на строку</text>
</svg>
<figcaption>Симуляция округления только весов Linear, активации во float. На 279 модель отвечает &quot;парафраз&quot; на каждую пару, около 130 &quot;не парафраз&quot; почти на каждую.</figcaption>
</figure>

С 1 масштабом на тензор 8 бит стоят 3 пары. Настоящая модель в int8 теряет 6. Остальные 3, как я предполагаю, добавляет то, что я не моделировал: округление активаций на лету и само целочисленное ядро. На 6 битах модель теряет 29 пар. На 5 битах она отвечает "не парафраз" на всё, на 4 битах "парафраз" на всё.

Тогда я дал каждой строке каждой матрицы свой масштаб. 8 и 6 бит дали 345, столько же, сколько float. 5 бит потеряли 1 пару, 4 бита потеряли 7, примерно как настоящая модель в int8.

Причина сидит в нескольких матрицах. Возьмём 12 выходных слоёв feed forward, тех, что ведут из 3072 обратно в 768. В каждом из них самый большой вес от 10 до 32 раз больше типичного максимума строки. В слое 8 это 4,60 против 0,14. Это одно число задаёт масштаб всей матрицы. 41% её весов на 8 битах округляются до 0. Во всех остальных слоях модели это отношение меньше 7.

<figure class="fig">
<svg viewBox="0 0 680 254" role="img" aria-label="Отношение самого большого веса к медиане построчных максимумов для каждого из 74 слоёв Linear. Выделены 12 выходных слоёв feed forward: 9,9, 11,4, 15,4, 18,3, 18,3, 20,5, 24,8, 24,9, 26,6, 27,1, 27,5, 32,1. У всех остальных слоёв меньше 6,8.">
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
  <text x="52.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">макс. вес / медиана макс. строк</text>
  <rect x="60" y="230" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">выход feed forward, 3072 в 768</text>
  <rect x="360" y="230" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">остальные слои Linear</text>
</svg>
<figcaption>Выходной слой 8: самый большой вес 4,60, типичный максимум строки 0,14. С 1 масштабом на матрицу 41% её весов округляются в 0 на 8 битах.</figcaption>
</figure>

Очевидное лекарство это оставить эти 12 слоёв во float. Я попробовал. Файл вырастает до 262 МБ, а модель отвечает верно на 340 пар вместо 339, то есть 85 МБ сверху за 1 пару. Я бы столько не платил.

В `quantize_dynamic` из 1.3 нет настройки для масштаба на строку, но ядро его принимает, если собрать веса руками через `torch.quantize_per_channel`. Я рассчитывал получить те же 345, что в симуляции. Модель ответила "парафраз" на все 408 пар. С диапазоном, урезанным до 7 бит, она снова дала 339, ровно как по умолчанию. Подозреваю переполнение внутри целочисленного ядра, когда каждая строка занимает весь диапазон, но разбираться не стал.

## Скорость

Я ждал, что int8 будет быстрее. Первый полный проход по dev сказал обратное: 33 секунды у int8 против 27 у float, на 4 потоках.

Для замера времени я взял первые 200 пар, чтобы прогоны были короче. По медиане 3 прогонов модель в int8 тратит 80 мс на пару на 1 потоке против 151 мс у float. Это почти в 2 раза быстрее. На 4 потоках float тратит 60 мс, а int8 всё те же 80. Я проверил отдельный слой. `Linear` в int8 тратит 1,7 мс на 1, 2 и 4 потоках, у float время падает с 3,3 до 1,0 мс. В исходниках 1.3.0 динамический `Linear` в int8 вызывает fbgemm с 1 потоком, поэтому на 4 ядрах квантованная модель медленнее.

У чисел float свой подвох. MKL внутри этого PyTorch выбирает путь исполнения по процессору. На этом AMD путь по умолчанию медленный. Тогда float тратит 433 мс на пару на 1 потоке и int8 выглядит быстрее в 5 раз. Я заставил MKL пойти быстрым путём. Все числа float выше получены так. Квантованный `Linear` работает на fbgemm, поэтому модель в int8 этого почти не замечает: 84 мс против 80. На AMD я бы не верил ускорению от int8 в 1.3, пока не проверил, каким путём MKL шёл на стороне float.

## Чего я не проверял

1 модель и 1 маленькая задача. MRPC с 408 парами это шумная проверка. Память работающего процесса я не мерил, только сохранённые веса. Модель с меньшим словарём или с квантованными эмбеддингами, как в Q8BERT, будет ближе к 4 разам. Статическую квантизацию и обучение с квантизацией я не пробовал.

Пока что я бы взял эту строку для однопоточного сервиса, где важна память, но порог решения на квантованной модели проверил бы заново, прежде чем ей доверять.
