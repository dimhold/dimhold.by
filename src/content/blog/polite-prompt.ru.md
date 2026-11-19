---
title: "\"Please\" ухудшило GPT-2 small и улучшило GPT-2 medium"
description: "GPT-3 берёт деньги за токены, поэтому я посчитал, сколько стоит вежливость, и померил, что она делает. На 872 отзывах SST-2 одиночное \"Please\" ухудшило GPT-2 small и улучшило GPT-2 medium, как любая другая мелкая правка инструкции. Полная фраза \"Could you please... Thank you.\" не ухудшила ни одну из 4 моделей и удлинила ответы."
date: 2021-11-21
lang: ru
translationKey: polite-prompt
tags: ["llm", "machine-learning"]
---
В четверг OpenAI сняла лист ожидания со своего API. Теперь любой житель поддерживаемой страны может платить за GPT-3. Платят за токены. Davinci стоит $0,06 за 1000 токенов, промпт и ответ считаются вместе. Значит, у каждого слова в промпте есть цена, в том числе у слов, добавленных только из вежливости.

Я слышал про это 2 противоположных мнения. Одно говорит, что на вежливую просьбу ответ лучше, потому что модель училась на текстах, где на вежливые вопросы отвечали старательно. Другое говорит, что "please" это потраченный впустую токен и модели всё равно. Числа ни для одного из них у меня не было, поэтому я померил цену и качество ответа.

## Сколько это стоит

У GPT-3 тот же токенизатор, что у GPT-2, поэтому токены можно посчитать у себя. Моя инструкция для теста ниже: `Tell me whether this movie review is positive or negative.`, в ней 11 токенов. "Please" перед ней это ещё 1 токен. Полная вежливая версия с "Could you please" и "Thank you" в конце занимает 17 токенов.

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="Три версии инструкции, разбитые на токены GPT-2. GPT-3 берёт деньги за те же токены. Tell me whether this movie review is positive or negative.: 11 токенов, базовая версия; Please tell me whether this movie review is positive or negative.: 12 токенов, +$60 на миллион вызовов; Could you please tell me whether this movie review is positive or negative? Thank you.: 17 токенов, +$360 на миллион вызовов. Токены, которые добавляет вежливость, выделены.">
  <rect x="20.0" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="37.2" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Tell</text>
  <rect x="58.4" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="69.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="83.6" y="22" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="110.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="141.8" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="159.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="180.2" y="22" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="200.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="225.2" y="22" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="249.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="276.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="302.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="332.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="366.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="392.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="422.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="456.8" y="22" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="464.1" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="60.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">11 токенов, базовая версия</text>
  <rect x="20.0" y="80" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="43.8" y="94.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Please</text>
  <rect x="71.6" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="88.8" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="110.0" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="120.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="135.2" y="80" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="162.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="193.4" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="210.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="231.8" y="80" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="252.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="276.8" y="80" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="300.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="328.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="339.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="353.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="384.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="418.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="429.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="443.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="474.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="508.4" y="80" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="515.7" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12 токенов, +$60 на миллион вызовов</text>
  <rect x="20.0" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="40.5" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Could</text>
  <rect x="65.0" y="138" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="78.9" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="96.8" y="138" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="120.6" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">please</text>
  <rect x="148.4" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="165.6" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="186.8" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="197.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="212.0" y="138" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="239.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="270.2" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="308.6" y="138" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="329.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="353.6" y="138" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="405.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="415.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="430.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="460.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="495.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="505.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="520.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="550.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="585.2" y="138" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="592.5" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">?</text>
  <rect x="603.8" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="624.3" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Thank</text>
  <rect x="20.0" y="164" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="33.9" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="51.8" y="164" width="14.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="59.1" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">.</text>
  <text x="20.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17 токенов, +$360 на миллион вызовов</text>
</svg>
<figcaption>Только инструкция, разбитая на токены токенизатором GPT-2, тем же, что у GPT-3. Выделены токены, которые добавляет вежливость. Цены для davinci из расчёта $0,06 за 1000 токенов.</figcaption>
</figure>

1 лишний токен на вызов у davinci это $60 на миллион вызовов, полная вежливая версия добавляет $360. Звучит немного. Но весь мой промпт с отзывом занимал в среднем около 41 токена, так что 6 вежливых токенов увеличивали счёт за входные токены примерно на 15%. С 4 примерами в промпте выходило около 135 токенов. Те же 6 токенов добавляли 4%.

## Как мерил

Задача: тональность отзыва о фильме, 872 предложения из валидационной выборки SST-2. Промпт выглядит так:

```
Tell me whether this movie review is positive or negative.

Review: it 's a charming and often affecting journey .
Answer:
```

Здесь ничего не генерируется. Я сравниваю вероятность следующего токена " positive" с " negative" и беру большую. Повторный прогон даёт те же числа. Модели те, что тянет мой процессор на 4 ядра: GPT-2 small, medium и large от OpenAI и `GPT-Neo 125M` от EleutherAI, дальше просто Neo.

У простого сравнения есть проблема. GPT-2 small говорит "positive" на 80% отзывов, что бы в них ни было, а положительных среди них примерно половина. GPT-2 large смещена в другую сторону и говорит "positive" только на 16%. Поэтому для каждой версии инструкции я подбирал порог с помощью упрощённой контекстной калибровки из работы Zhao et al. (февраль). Тот же промпт с пустым отзывом вроде "N/A" показывает, в какую сторону смещена модель. Это смещение вычитается.

Кроме 2 вежливых версий я взял 4 версии без вежливых слов. `Now tell me...` такой же длины, как `Please tell me...`, а `Say whether...` меняет 1 слово. Нейтральный хвост `Now look at it and tell me... That is all.` примерно такой же длины, как полная вежливая версия. Последняя версия грубая: `Just tell me... Don't waste my time.`

## Первое число

Первой досчиталась GPT-2 small. С "Please" её точность упала с 68,8% до 65,7%: 41 отзыв стал неверным, а 14 стали верными. По парному тесту это явно не шум. Я уже собирался написать, что вежливость снижает точность.

Потом GPT-2 medium показала обратное. С "Please" её точность выросла с 69,2% до 72,4%, 36 отзывов стали верными и 8 неверными. GPT-2 large, как и medium, прибавила 2,5 пункта, а у Neo точность сдвинулась на 0,3 пункта, то есть почти не изменилась.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Изменение точности без примеров на 872 отзывах SST-2 относительно простой инструкции, по версии инструкции и по модели. Please tell me… GPT-2 small −3,1, GPT-2 medium +3,2, GPT-2 large +2,5, GPT-Neo 125M +0,3; Could you please… Thank you. GPT-2 small +1,3, GPT-2 medium +3,8, GPT-2 large +3,4, GPT-Neo 125M +2,1; Now tell me… GPT-2 small −0,5, GPT-2 medium −1,1, GPT-2 large +0,6, GPT-Neo 125M −0,7; Say whether… GPT-2 small +0,1, GPT-2 medium +4,7, GPT-2 large −1,0, GPT-Neo 125M +3,3; Now look at it… That is all. GPT-2 small −1,3, GPT-2 medium +4,0, GPT-2 large +2,5, GPT-Neo 125M −0,3; Just tell me… Don't waste my time. GPT-2 small −4,4, GPT-2 medium +4,4, GPT-2 large −0,7, GPT-Neo 125M +1,6.">
  <line x1="250.0" x2="250.0" y1="34" y2="220" class="f-plain"/>
  <text x="250.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−6</text>
  <line x1="316.7" x2="316.7" y1="34" y2="220" class="f-plain"/>
  <text x="316.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−4</text>
  <line x1="383.3" x2="383.3" y1="34" y2="220" class="f-plain"/>
  <text x="383.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−2</text>
  <line x1="450.0" x2="450.0" y1="34" y2="220" class="f-plain" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="450.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="516.7" x2="516.7" y1="34" y2="220" class="f-plain"/>
  <text x="516.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <line x1="583.3" x2="583.3" y1="34" y2="220" class="f-plain"/>
  <text x="583.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <line x1="650.0" x2="650.0" y1="34" y2="220" class="f-plain"/>
  <text x="650.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="20.0" y="254.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">изменение точности относительно &quot;Tell me whether…&quot;, процентные пункты</text>
  <text x="20.0" y="59.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please tell me…</text>
  <circle cx="346.7" cy="55.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="553.7" y="51.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 50.5 L538.5 58.5 L529.5 58.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M461.7 50.5 L466.2 55.0 L461.7 59.5 L457.2 55.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="89.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <circle cx="492.0" cy="85.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="573.0" y="81.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M564.7 80.5 L569.2 88.5 L560.2 88.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M519.0 80.5 L523.5 85.0 L519.0 89.5 L514.5 85.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="20" x2="650" y1="100.0" y2="100.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="20.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now tell me…</text>
  <circle cx="434.7" cy="115.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="408.4" y="111.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M469.0 110.5 L473.5 118.5 L464.5 118.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M427.3 110.5 L431.8 115.0 L427.3 119.5 L422.8 115.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="149.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Say whether…</text>
  <circle cx="453.7" cy="145.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="603.4" y="141.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M415.3 140.5 L419.8 148.5 L410.8 148.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M561.0 140.5 L565.5 145.0 L561.0 149.5 L556.5 145.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="179.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now look at it… That is all.</text>
  <circle cx="408.0" cy="175.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="580.7" y="171.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 170.5 L538.5 178.5 L529.5 178.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M438.7 170.5 L443.2 175.0 L438.7 179.5 L434.2 175.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Just tell me… Don't waste my time.</text>
  <circle cx="304.7" cy="205.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="592.0" y="201.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M427.0 200.5 L431.5 208.5 L422.5 208.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M503.7 200.5 L508.2 205.0 L503.7 209.5 L499.2 205.0 Z" style="fill:var(--muted);stroke:none"/>
  <circle cx="24.0" cy="16.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <text x="32.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <rect x="127.3" y="12.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <text x="138.6" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <path d="M243.8 11.5 L248.3 19.5 L239.3 19.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <text x="251.8" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 large</text>
  <path d="M350.4 11.5 L354.9 16.0 L350.4 20.5 L345.9 16.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="358.4" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Без примеров, 872 отзыва из валидационной выборки SST-2, порог подобран контекстной калибровкой отдельно для каждой версии. Вежливые версии в двух верхних строках. 1 пункт это примерно 9 отзывов.</figcaption>
</figure>

Контрольные версии вели себя так же. Грубая версия дала GPT-2 medium +4,4 пункта, больше, чем "Please". У GPT-2 small она отняла 4,4 пункта. Только `Now tell me...`, ровно той же длины, что версия с "Please", менялась не больше чем примерно на 1 пункт на всех моделях. Выходит, одиночное "please" вело себя как любая другая мелкая правка инструкции, со знаком, который зависит от модели. Угадать этот знак заранее я не смог.

Полная вежливая версия в эту картину не уложилась. Этого я не ждал. По точности это единственная версия, которая ни на одной из 4 моделей не снизила точность. На medium и large она дала больше 3 пунктов, Neo получила 2, а на small прибавка в пределах шума. Нейтральный хвост примерно той же длины тоже помог medium и large, но у small отнял 1,3 пункта, а на Neo не сделал ничего. Что именно в вежливой фразе это делает, я сказать не могу. Ещё это единственная версия в форме вопроса, с "Could you" впереди и вопросительным знаком.

## Что на самом деле сдвинулось

Чтобы понять, стала ли модель читать отзывы лучше или хуже, я взял меру без порога. Это доля пар из положительного и отрицательного отзыва, которые модель ставит в правильном порядке. У GPT-2 small "Please" снизило её с 0,796 до 0,782. `Now` сделало примерно то же. У GPT-2 medium "Please" подняло её с 0,859 до 0,872, у large с 0,917 до 0,924. Сдвиги маленькие, хотя парный бутстреп говорит, что это не шум. Полная вежливая версия на GPT-2 large эту меру немного снизила, а точность при этом выросла на 3,4 пункта.

По моим числам похоже, что инструкция в основном меняет то, насколько модель склоняется к одному из ответов. Ответ меняется в основном у отзывов рядом с порогом. Из 55 отзывов, у которых "Please" поменяло ответ на GPT-2 small, 53 были в четверти отзывов, ближайших к порогу.

С 4 примерами в промпте GPT-2 small и medium отвечали "positive" почти на каждый отзыв при любой инструкции. Калибровка это не исправила. Из 3 моделей, которые я гонял с примерами, работала только Neo: 75,2% с простой инструкцией. "Please" сдвинуло её точность в пределах шума, а `Now` отняло 3 пункта.

## Со стороны ответа

Ответ оплачивается по той же цене, так что вежливость могла стоить денег и на выходе. Здесь GPT-2 medium отвечала на 300 вопросов из валидационной выборки TriviaQA без контекста. Ответ генерировался жадным декодированием, до первого перевода строки или до 32 токенов.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="Средняя длина ответа GPT-2 medium на 300 вопросов TriviaQA при 4 версиях инструкции. Answer the question. 16,0, 39 из 300 верных; Please answer the question. 17,1, 40 из 300 верных; Could you please… Thank you. 18,1, 36 из 300 верных; Now answer the question. 14,8, 42 из 300 верных.">
  <text x="20.0" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Answer the question.</text>
  <rect x="230" y="23" width="152.2" height="16" class="f-box"/>
  <text x="388.2" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">16,0</text>
  <text x="660.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">39 из 300 верных</text>
  <text x="20.0" y="65.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please answer the question.</text>
  <rect x="230" y="53" width="162.4" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="398.4" y="65.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17,1</text>
  <text x="660.0" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40 из 300 верных</text>
  <text x="20.0" y="95.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <rect x="230" y="83" width="171.7" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="407.7" y="95.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">18,1</text>
  <text x="660.0" y="95.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">36 из 300 верных</text>
  <text x="20.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now answer the question.</text>
  <rect x="230" y="113" width="140.3" height="16" class="f-box"/>
  <text x="376.3" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">14,8</text>
  <text x="660.0" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">42 из 300 верных</text>
  <line x1="230.0" x2="230.0" y1="144" y2="148" class="f-line"/>
  <text x="230.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="277.5" x2="277.5" y1="144" y2="148" class="f-line"/>
  <text x="277.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="325.0" x2="325.0" y1="144" y2="148" class="f-line"/>
  <text x="325.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="372.5" x2="372.5" y1="144" y2="148" class="f-line"/>
  <text x="372.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <line x1="420.0" x2="420.0" y1="144" y2="148" class="f-line"/>
  <text x="420.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="325.0" y="176.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">средняя длина ответа, токены</text>
</svg>
<figcaption>GPT-2 medium, 300 вопросов TriviaQA без контекста, жадное декодирование до первого перевода строки или до 32 токенов. Полоса это средняя длина ответа, число справа это сколько ответов содержат верный ответ.</figcaption>
</figure>

С "Please" ответы были в среднем на 1,1 токена длиннее, с полной вежливой версией на 2,1 токена. Полная вежливая версия ещё и упиралась в лимит в 32 токена в 93 ответах из 300, простая в 63. `Now` сделало ответы на 1,2 токена короче. Ответов, содержащих верный ответ, при всех 4 версиях было от 36 до 42 из 300. Более длинные ответы не оказывались верными чаще.

## Что я из этого вынес

Webson и Pavlick в сентябре показали похожее. В их работе модели, которые обучали на промптах, учились почти так же хорошо на нерелевантных и вводящих в заблуждение инструкциях, как на хороших. Одиночное "please" с этим сходится: мои числа оно сдвигало, но в сторону, которую я не мог знать заранее.

Полная вежливая фраза это то, чего я не ждал. Называть это правилом я пока не готов. 4 маленьких модели и 1 задача это мало, но по точности на всех 4 она помогла или ничего не изменила. А стоит она 6 токенов на входе и около 2 на выходе. Если бы я платил за миллионы таких вызовов, я бы проверил эту фразу против простой на своих данных.

## Чего я не проверял

У OpenAI есть ещё модели серии instruct в бете, обученные следовать инструкциям. Ни GPT-3, ни их я не запускал. На вежливость они могут реагировать иначе. Я не знаю. Классификация это 1 задача с 2 ответами, ответ выбирается по вероятности. Калибровка опирается всего на 3 пустых входа и шумит, поэтому я привожу ещё и меру без порога. GPT-2 large я гонял только без примеров: полный прогон на этом процессоре занял бы больше 3 часов. Части вежливой фразы я отдельно не проверял: форму вопроса, "Could you" и "Thank you". Тест генерации сделан на 1 модели.
