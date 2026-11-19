---
title: "Код был внутри окна, а GPT-2 всё равно назвала другой"
description: "Я вставил 8 записей вида 'The code for the blue room is 17004.' в 1000 токенов WikiText и спросил у GPT-2 и GPT-Neo про одну из них. Одну запись модели находят на любом расстоянии. Из 8 одна похожая запись между фактом и вопросом отнимает больше половины верных ответов."
date: 2021-11-27
lang: ru
translationKey: long-context-decay
tags: ["llm", "machine-learning"]
---
Первое, чего все хотят от GPT-3, это вставить длинный документ и задать по нему вопрос. GPT-2 читает 1024 токена, GPT-3 и модели EleutherAI читают 2048. Что бывает за этой границей, я знал. Если подать GPT-2 в PyTorch вход длиннее, всё падает с `IndexError: index out of range in self`. Позиционного эмбеддинга для токена 1025 просто нет. С `truncation=True` токенизатор вместо этого режет конец и вопрос в конце уходит вместе с ним.

Про то, что внутри окна, у меня было простое представление. Окно это буфер: что влезло, то прочитано, что не влезло, то потеряно. Первую половину этой фразы я ни разу не проверял. Модель не сообщает, какую часть входа она использовала. Если она хорошо читает последние 200 токенов, а остальное плохо, ответ выглядит так же уверенно.

## Стенд

Я взял модели, которые идут на процессоре с 4 ядрами: GPT-2 small (124M) и GPT-2 medium (355M) от OpenAI с окном 1024 токена. Третья это `GPT-Neo 125M` от EleutherAI, вышла в марте, окно 2048 токенов. Дальше я называю её Neo. Веса в fp32, ничего не генерируется. Я читаю вероятности следующего токена, поэтому повторный прогон даёт те же числа.

Текст настоящий английский: идущие подряд предложения из тестовой части WikiText-103, очень короткие и очень длинные пропущены. Между предложениями я вставил записи такого вида:

```
The code for the blue room is 17004.
```

Записей 8, у них 8 разных цветов и случайные коды из 5 цифр, стоят они в случайных местах. Вход 1000 токенов. В самом конце вопрос, `The code for the blue room is`. Для каждого из 8 кодов я беру вероятность его первого токена как следующего. Код с самой высокой вероятностью и есть выбор модели. Случайный выбор угадывает в 1 случае из 8, это 12,5%. Расстояние это число токенов между концом искомой записи и вопросом.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="Полоса из 1000 токенов, в ней 8 записей, у каждой свой цвет. Вопрос в правом конце спрашивает про комнату blue. Запись blue кончается за 439 токенов до вопроса, и между ними стоят ещё 3 записи. Самый вероятный следующий токен у GPT-2 medium это начало кода комнаты yellow, 13135, а эта запись стоит за 347 токенов до вопроса.">
  <rect x="20" y="64" width="570" height="18" class="f-plain"/>
  <rect x="594" y="64" width="82" height="18" rx="2" class="f-box"/>
  <text x="598.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">вопрос</text>
  <polyline points="47.4,34 47.4,56 47.4,82" class="f-line"/>
  <text x="47.4" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">grey</text>
  <polyline points="213.6,34 218.4,56 218.4,82" class="f-line"/>
  <text x="213.6" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">green</text>
  <polyline points="261.9,34 290.2,56 290.2,82" class="f-line"/>
  <text x="261.9" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">orange</text>
  <polyline points="310.2,34 309.6,56 309.6,82" class="f-line"/>
  <text x="310.2" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">brown</text>
  <polyline points="351.9,34 335.8,56 335.8,82" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="351.9" y="30.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">blue</text>
  <polyline points="396.9,34 388.2,56 388.2,82" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.9" y="30.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">yellow</text>
  <polyline points="448.5,34 440.7,56 440.7,82" class="f-line"/>
  <text x="448.5" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">silver</text>
  <polyline points="578.1,34 586.0,56 586.0,82" class="f-line"/>
  <text x="578.1" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">red</text>
  <line x1="335.8" x2="590" y1="98" y2="98" class="f-line"/>
  <line x1="335.8" x2="335.8" y1="93" y2="103" class="f-line"/>
  <line x1="590" x2="590" y1="93" y2="103" class="f-line"/>
  <text x="462.9" y="116.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">439 токенов, между ними 3 записи</text>
  <text x="20.0" y="102.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000 токенов текста WikiText-103</text>
  <text x="20.0" y="144.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">искомая: blue → 34359</text>
  <text x="20.0" y="162.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium, следующий токен: 13 → yellow (13135)</text>
</svg>
<figcaption>Одна настоящая проба GPT-2 medium. Вопрос про комнату blue (34359). Самый вероятный следующий токен модели это начало кода комнаты yellow (13135).</figcaption>
</figure>

## Одна запись не проблема

Сначала контроль: в тех же 1000 токенах только одна запись. Здесь я смотрю, является ли самый вероятный следующий токен началом верного кода. Все 3 модели нашли единственную запись на любом расстоянии: от 88 до 100% проб. Neo промахнулась 1 раз из 330. GPT-2 small хуже копировала остаток кода, но и это от расстояния не зависело.

Значит, с одной записью расстояние не имело значения. Я ждал обратного и половины статьи, которая была у меня в голове, не стало.

## 8 записей

С 8 записями картина другая. Когда запись стояла прямо перед вопросом, GPT-2 small выбирала верный код в 38% проб. На расстоянии около 860 токенов доля упала до 12%, это уровень угадывания. У начала окна она вернулась к 32%. GPT-2 medium начала лучше, с 62%. Уже на расстоянии около 220 токенов у неё было 14%. У Neo было 37% рядом с вопросом и от 17 до 32% на всех остальных расстояниях.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Доля верных ответов по расстоянию до вопроса. Сплошные линии: 8 записей, верный код выбран среди 8. Пунктир: 1 запись, самый вероятный следующий токен это начало верного кода. GPT-2 small, 1: 0 88%, 100 98%, 200 100%, 298 100%, 400 100%, 500 100%, 599 100%, 701 98%, 799 100%, 899 100%, 922 100%; GPT-2 small, 8: 0 38%, 109 31%, 217 29%, 323 35%, 430 27%, 534 20%, 645 19%, 753 15%, 861 12%, 972 32%, 981 34%; GPT-2 medium, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 90%, 698 97%, 797 97%, 902 100%, 920 100%; GPT-2 medium, 8: 0 62%, 106 38%, 218 14%, 320 12%, 430 20%, 539 14%, 646 24%, 755 12%, 858 26%, 972 34%, 981 52%; GPT-Neo 125M, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 100%, 698 100%, 797 100%, 902 100%, 920 97%; GPT-Neo 125M, 8: 0 37%, 110 23%, 214 17%, 323 17%, 431 27%, 537 27%, 646 25%, 753 20%, 858 32%, 973 23%, 982 20%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="178.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="296.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="414.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">600</text>
  <text x="532.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">расстояние от записи до вопроса, токенов</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">доля проб</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">угадывание, 1 из 8</text>
  <polyline points="60.0,65.0 118.8,45.0 177.9,40.0 235.9,40.0 295.9,40.0 354.7,40.0 413.5,40.0 473.3,45.0 531.5,40.0 590.4,40.0 603.7,40.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,164.0 124.3,178.0 187.8,182.0 250.5,170.0 313.8,186.0 374.8,200.0 440.3,202.0 504.4,210.0 567.8,216.0 633.3,176.0 638.8,172.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="164.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="124.3" cy="178.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="187.8" cy="182.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="250.5" cy="170.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="313.8" cy="186.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="374.8" cy="200.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="440.3" cy="202.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="504.4" cy="210.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="567.8" cy="216.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="633.3" cy="176.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="638.8" cy="172.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,60.0 471.6,46.6 530.1,46.6 591.9,40.0 602.7,40.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,116.0 122.8,164.0 188.4,212.0 249.0,216.0 313.8,200.0 377.8,212.0 440.9,192.0 505.4,216.0 566.5,188.0 633.2,172.0 638.7,136.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="113.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="119.8" y="161.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="185.4" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="246.0" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="310.8" y="197.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="374.8" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="437.9" y="189.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="502.4" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="563.5" y="185.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="630.2" y="169.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="635.7" y="133.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,40.0 471.6,40.0 530.1,40.0 591.9,40.0 602.7,46.6" class="f-line" style="stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,166.6 125.1,193.4 186.4,206.6 250.7,206.6 314.5,186.6 377.0,186.6 441.1,190.0 504.3,200.0 566.0,176.6 634.2,193.4 639.1,200.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 162.6 L64.0 166.6 L60.0 170.6 L56.0 166.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M125.1 189.4 L129.1 193.4 L125.1 197.4 L121.1 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M186.4 202.6 L190.4 206.6 L186.4 210.6 L182.4 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M250.7 202.6 L254.7 206.6 L250.7 210.6 L246.7 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M314.5 182.6 L318.5 186.6 L314.5 190.6 L310.5 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M377.0 182.6 L381.0 186.6 L377.0 190.6 L373.0 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M441.1 186.0 L445.1 190.0 L441.1 194.0 L437.1 190.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M504.3 196.0 L508.3 200.0 L504.3 204.0 L500.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M566.0 172.6 L570.0 176.6 L566.0 180.6 L562.0 176.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M634.2 189.4 L638.2 193.4 L634.2 197.4 L630.2 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M639.1 196.0 L643.1 200.0 L639.1 204.0 L635.1 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Вход 1000 токенов. Сплошные: 8 записей, искомая на заданном расстоянии, 7 других в случайных местах, доля проб, где у верного кода самая высокая вероятность среди 8 (от 50 до 100 проб на точку). Пунктир: запись одна, доля проб, где самый вероятный следующий токен это начало её кода (30 или 40 проб). Это 2 разные меры.</figcaption>
</figure>

Я прочитал это как "чем дальше, тем хуже" и почти на этом остановился. Вторая серия в это не уложилась. В ней искомая запись всегда стояла за 50-65 токенов до вопроса, менялась только длина входа. GPT-2 small дала 13% на 250 токенах и 45% на 1000, GPT-2 medium 22% и 48%. Более длинный вход улучшил ответ. Смысла в этом я не видел.

Первым объяснением были другие записи. В 250 токенах остальные 7 стоят тесно и часто попадают в промежуток между искомой записью и вопросом. Я сгруппировал пробы первой серии по числу других записей в этом промежутке. У GPT-2 small это 45% при пустом промежутке и 25% с одной записью в нём. При 2 или 3 записях в промежутке ещё от 24 до 27%, при 4, 5 или 6 уже от 15 до 17%. Часть этого эффекта даёт расстояние: чем больше записей в промежутке, тем дальше обычно стоит искомая. Поэтому я отдельно сравнил только пробы, где искомая запись стояла на расстоянии от 50 до 250 токенов от вопроса. Там GPT-2 small выбирала верный код в 57% проб с пустым промежутком и в 20% с одной записью в нём.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Доля проб, в которых верный код выбран среди 8, по числу других записей между искомой записью и вопросом. GPT-2 small: 0: 45%, 1: 25%, 2: 24%, 3: 27%, 4: 16%, 5: 17%, 6: 15%, 7: 32%; GPT-2 medium: 0: 51%, 1: 21%, 2: 13%, 3: 20%, 4: 16%, 5: 19%, 6: 20%, 7: 43%; GPT-Neo 125M: 0: 34%, 1: 20%, 2: 15%, 3: 19%, 4: 21%, 5: 35%, 6: 29%, 7: 21%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="144.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="228.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="312.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="397.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="481.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="565.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">других записей между искомой и вопросом</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">доля проб</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">угадывание, 1 из 8</text>
  <polyline points="60.0,149.8 144.3,189.6 228.6,192.8 312.9,185.2 397.1,208.0 481.4,206.2 565.7,209.2 650.0,176.4" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="149.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="144.3" cy="189.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="228.6" cy="192.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="312.9" cy="185.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="397.1" cy="208.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="481.4" cy="206.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="565.7" cy="209.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="650.0" cy="176.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,139.0 144.3,198.4 228.6,214.2 312.9,200.8 397.1,208.0 481.4,202.8 565.7,200.6 650.0,154.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="136.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="141.3" y="195.4" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="225.6" y="211.2" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="309.9" y="197.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="394.1" y="205.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="478.4" y="199.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="562.7" y="197.6" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="647.0" y="151.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,171.4 144.3,200.0 228.6,210.6 312.9,202.8 397.1,199.0 481.4,170.4 565.7,182.4 650.0,199.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 167.4 L64.0 171.4 L60.0 175.4 L56.0 171.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M144.3 196.0 L148.3 200.0 L144.3 204.0 L140.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M228.6 206.6 L232.6 210.6 L228.6 214.6 L224.6 210.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M312.9 198.8 L316.9 202.8 L312.9 206.8 L308.9 202.8 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M397.1 195.0 L401.1 199.0 L397.1 203.0 L393.1 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M481.4 166.4 L485.4 170.4 L481.4 174.4 L477.4 170.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M565.7 178.4 L569.7 182.4 L565.7 186.4 L561.7 182.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M650.0 195.0 L654.0 199.0 L650.0 203.0 L646.0 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Те же пробы, что на сплошных линиях выше, только сгруппированы иначе: доля проб, где верный код выбран среди 8. 7 в промежутке значит, что искомая запись первая из 8. От 50 до 198 проб на точку.</figcaption>
</figure>

На тех же расстояниях GPT-2 medium упала с 43% до 17%, а Neo с 32% до 11%. Дальше точки Neo скачут вверх и вниз.

Но и записи в промежутке не объяснили вторую серию до конца. Я взял из неё только пробы с пустым промежутком. GPT-2 small всё равно выбрала верный код в 8 пробах из 44 на 250 и 500 токенах и в 42 из 77 на 750 и 1000. В коротком входе 8 записей занимают примерно треть текста. Может быть, модель видит там список. Этого я не проверял и не знаю.

Когда в промежутке стояла хотя бы одна другая запись, а GPT-2 small ошибалась, она выбирала ближайшую к вопросу запись в 27% таких проб. Это примерно вдвое чаще случайного неверного выбора, 1 из 7, но большинство ошибок всё равно пришлось на другие записи.

Ещё одного я не ожидал. Иногда искомая запись была первой из 8 и все 7 остальных стояли после неё. Тогда GPT-2 medium выбирала верный код в 43% проб, а GPT-2 small в 32%. У обеих начало окна сработало лучше его середины. Ни из одного числа выше я бы такого не угадал.

## Что говорит обычная метрика

Обычная проверка контекста это точность следующего токена по позиции. Я посчитал её на той же тестовой части WikiText-103. С 1 токеном контекста GPT-2 small угадывает следующий в 6% случаев, на позициях с 769 по 1023 в 41%. Neo идёт от 10% к 42% и выходит на плато во второй половине своих 2048 токенов. По этой метрике конец длинного окна это лучшее место для токена. Для среднего токена это правда. В моём тесте с 8 записями то же окно давало что угодно от 12 до 62%, смотря где стояла запись и что стояло в промежутке.

## Что я из этого беру

Когда в промпте несколько похожих фактов, ответ про один из них намного лучше, если между ним и вопросом нет ничего похожего. Поэтому нужный факт я бы ставил последним. На одном и том же расстоянии одна похожая запись в промежутке отнимала больше половины верных ответов. Sun et al. в сентябре показали, что контекст дальше 2K токенов помогал моделям, рассчитанным на длинный текст, в основном на токенах, которые можно скопировать издалека. Мой поиск как раз такое копирование. С одной записью оно работало по всему окну. Более старый результат Khandelwal et al. близок по духу: LSTM там учитывает порядок слов только примерно в ближайших 50 токенах.

## Что я не проверял

Это 3 маленькие модели. Neo не показала выигрыша в начале окна: у неё там 21%. GPT-3 через API и GPT-J 6B я не запускал, они, скорее всего, справятся лучше, а насколько, я не знаю. Все записи сделаны по одному шаблону с 8 цветами. Точка на графиках это от 30 до 200 проб. Интервал около 6 процентных пунктов в каждую сторону при 200 пробах и около 16 при 30. Отдельные точки скачут внутри него. У Neo есть ещё деталь, влияние которой я не выделял: половина её слоёв видит только последние 256 токенов. Ещё я прогнал Neo на 2000 токенах, почти на всём её окне, но только по 30 проб на точку. Прямо перед вопросом она выбирала верный код в 67% проб, на расстоянии около 200 токенов в 37%, дальше от 7 до 40% без ясного направления.
