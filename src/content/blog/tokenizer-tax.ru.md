---
title: "Токенизаторы удешевили русский и оставили беларусский позади"
description: "Одни и те же 1012 предложений FLORES-200 на 8 токенизаторах. Русский подешевел с 2,46 английского на cl100k до 1,42 на o200k и на новых не дороже польского, а беларусский по-прежнему стоит от 1,40 до 1,69 русского. Замена ў и і на русские буквы не помогает."
date: 2026-10-08
lang: ru
translationKey: tokenizer-tax
tags: ["llm", "text"]
---
Каждая статья в этом блоге выходит на 3 языках и с каждым мне помогает модель. То есть за один и тот же смысл я плачу 3 раза. В голове у меня было и число, насколько дороже обходятся остальные 2. Оно из работы Petrov et al. 2023, где около 2000 предложений FLORES-200 прогнали через 27 токенизаторов и кодировок. На cl100k_base, токенизаторе GPT-4, польскому нужно в 1,91 раза больше токенов, чем английскому, русскому в 2,49, беларусскому в 3,55. Месяц назад я сам цитировал эти числа в другом замере.

Из этой строки у меня сложилась простая картина: налог это налог на кириллицу, а латиница получает скидку. Когда я открыл их данные для этой статьи, остальные строки с ней не согласились. У Llama 1 и Qwen русский уже в 2023 году стоил не дороже польского. Я взял одну строку, которую цитируют все, а на остальные даже не посмотрел. И ни разу не проверил ничего из этого на токенизаторах, которыми пользуюсь сейчас.

## Как мерил

Корпус FLORES-200 devtest. В нём 1012 предложений, переведённых людьми на каждый язык, поэтому смысл зафиксирован и меняется только язык. Кроме английского я взял русский, беларусский и польский. Украинский я добавил пятым, для сравнения. Каждое предложение кодируется отдельно, без служебных токенов. Налог это сумма токенов по языку, делённая на сумму по английскому.

Токенизаторы: cl100k_base и o200k_base из tiktoken 0.14.0 и файлы tokenizer.json от Llama 3.1, Gemma 3, Qwen3, DeepSeek-V3 и Mistral Nemo через библиотеку tokenizers 0.23.2. Публичного токенизатора у Claude нет, поэтому его я посчитал по usage. Каждый корпус я отправил в Claude Opus 5 через Claude Code CLI 2.1.292 из пустой папки без инструментов. Потом вычел вход того же вызова с одной только инструкцией, 3471 токен в обоих прогонах. Для Claude предложения склеены переводами строки. На открытых токенизаторах склейка сдвигает отношение не больше чем на 0,04.

Petrov кодировал dev и devtest вместе одной строкой, так что входы различаются. И всё равно на cl100k я разошёлся с каждым их числом не больше чем на 0,05, беларусский 3,50 против 3,55.

## Русский подешевел

Английский занимает около 27 тысяч токенов на каждом открытом токенизаторе. Русский подешевел с 2,46 на cl100k до 1,42 на o200k, токенизаторе, которым OpenAI пользуется сейчас. На 6 новых токенизаторах и на Claude он стоит от 1,32 до 1,75. Польский сдвинулся меньше, у него от 1,51 до 1,89.

На всех токенизаторах моей таблицы, кроме cl100k, русский теперь дешевле польского. На Qwen3 ничья, 1,75 против 1,76. Petrov получил ту же ничью на Qwen 2023 года, так что для Qwen ничего не изменилось. На o200k словарь вырос вдвое, 200019 записей против 100277. Русский потерял 1,04 своего налога, польский 0,28. Почему русскому это дало больше, я не знаю: вместе с размером поменялся и состав обучающих данных.

<figure class="fig">
<svg viewBox="0 0 640 304" role="img" aria-label="Точечная диаграмма, по строке на токенизатор, налог в токенах относительно английского на тех же 1012 предложениях FLORES-200. cl100k: русский 2,46, польский 1,91, беларусский 3,50; o200k: русский 1,42, польский 1,64, беларусский 1,99; Gemma 3: русский 1,37, польский 1,51, беларусский 2,17; Mistral Nemo: русский 1,50, польский 1,58, беларусский 2,15; Llama 3.1: русский 1,62, польский 1,89, беларусский 2,58; DeepSeek-V3: русский 1,58, польский 1,68, беларусский 2,62; Qwen3: русский 1,75, польский 1,76, беларусский 2,97; Claude Opus 5: русский 1,32, польский 1,59, беларусский 1,87. Русский дешевле польского во всех строках, кроме cl100k, на Qwen3 они почти равны. Беларусский самый дорогой во всех строках.">
  <text x="10" y="16" class="f-label f-muted">токенов на те же 1012 предложений, во сколько раз больше английского</text>
  <circle cx="146" cy="33" r="5" class="f-ink" style="fill:currentColor"/><text x="156" y="37" class="f-label f-ink">русский</text>
  <circle cx="296" cy="33" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/><text x="306" y="37" class="f-label f-ink">польский</text>
  <circle cx="446" cy="33" r="5" style="fill:var(--accent)"/><text x="456" y="37" class="f-label f-ink">беларусский</text>
  <line x1="140.0" y1="48" x2="140.0" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="140.0" y="294" text-anchor="middle" class="f-label f-muted">1,0×</text>
  <line x1="230.4" y1="48" x2="230.4" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="230.4" y="294" text-anchor="middle" class="f-label f-muted">1,5×</text>
  <line x1="320.8" y1="48" x2="320.8" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="320.8" y="294" text-anchor="middle" class="f-label f-muted">2,0×</text>
  <line x1="411.2" y1="48" x2="411.2" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="411.2" y="294" text-anchor="middle" class="f-label f-muted">2,5×</text>
  <line x1="501.5" y1="48" x2="501.5" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="501.5" y="294" text-anchor="middle" class="f-label f-muted">3,0×</text>
  <line x1="591.9" y1="48" x2="591.9" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="591.9" y="294" text-anchor="middle" class="f-label f-muted">3,5×</text>
  <text x="130" y="72" text-anchor="end" class="f-label f-ink">cl100k</text>
  <line x1="305.2" y1="68" x2="591.6" y2="68" class="f-line" opacity="0.6"/>
  <circle cx="404.3" cy="68" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="305.2" cy="68" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="591.6" cy="68" r="5.5" style="fill:var(--accent)"/>
  <text x="601.6" y="72" class="f-label f-accent">3,50</text>
  <text x="130" y="100" text-anchor="end" class="f-label f-ink">o200k</text>
  <line x1="216.1" y1="96" x2="318.2" y2="96" class="f-line" opacity="0.6"/>
  <circle cx="216.1" cy="96" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="255.4" cy="96" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="318.2" cy="96" r="5.5" style="fill:var(--accent)"/>
  <text x="328.2" y="100" class="f-label f-accent">1,99</text>
  <text x="130" y="128" text-anchor="end" class="f-label f-ink">Gemma 3</text>
  <line x1="206.1" y1="124" x2="350.6" y2="124" class="f-line" opacity="0.6"/>
  <circle cx="206.1" cy="124" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="231.6" cy="124" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="350.6" cy="124" r="5.5" style="fill:var(--accent)"/>
  <text x="360.6" y="128" class="f-label f-accent">2,17</text>
  <text x="130" y="156" text-anchor="end" class="f-label f-ink">Mistral Nemo</text>
  <line x1="231.1" y1="152" x2="348.5" y2="152" class="f-line" opacity="0.6"/>
  <circle cx="231.1" cy="152" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="244.0" cy="152" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="348.5" cy="152" r="5.5" style="fill:var(--accent)"/>
  <text x="358.5" y="156" class="f-label f-accent">2,15</text>
  <text x="130" y="184" text-anchor="end" class="f-label f-ink">Llama 3.1</text>
  <line x1="251.4" y1="180" x2="425.6" y2="180" class="f-line" opacity="0.6"/>
  <circle cx="251.4" cy="180" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="301.0" cy="180" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="425.6" cy="180" r="5.5" style="fill:var(--accent)"/>
  <text x="435.6" y="184" class="f-label f-accent">2,58</text>
  <text x="130" y="212" text-anchor="end" class="f-label f-ink">DeepSeek-V3</text>
  <line x1="245.3" y1="208" x2="432.6" y2="208" class="f-line" opacity="0.6"/>
  <circle cx="245.3" cy="208" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="263.7" cy="208" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="432.6" cy="208" r="5.5" style="fill:var(--accent)"/>
  <text x="442.6" y="212" class="f-label f-accent">2,62</text>
  <text x="130" y="240" text-anchor="end" class="f-label f-ink">Qwen3</text>
  <line x1="276.5" y1="236" x2="496.4" y2="236" class="f-line" opacity="0.6"/>
  <circle cx="276.5" cy="236" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="278.3" cy="236" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="496.4" cy="236" r="5.5" style="fill:var(--accent)"/>
  <text x="506.4" y="240" class="f-label f-accent">2,97</text>
  <text x="130" y="268" text-anchor="end" class="f-label f-ink">Claude Opus 5</text>
  <line x1="197.4" y1="264" x2="296.8" y2="264" class="f-line" opacity="0.6"/>
  <circle cx="197.4" cy="264" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="246.4" cy="264" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <circle cx="296.8" cy="264" r="5.5" style="fill:var(--accent)"/>
  <text x="306.8" y="268" class="f-label f-accent">1,87</text>
</svg>
<figcaption>FLORES-200 devtest. Открытые токенизаторы считают каждое предложение отдельно и без служебных токенов, Claude посчитан по usage API на склеенном тексте.</figcaption>
</figure>

Беларусский соседа не догнал. На новых токенизаторах он дороже английского от 1,87 до 2,97 раза (на cl100k в 3,50). Против русского это от 1,40 до 1,69 на каждом токенизаторе. На 5 из 7 новых разрыв шире, чем на cl100k. Украинский лежит между ними, от 1,35 на Claude до 2,50 на Qwen3, если брать новые.

Предложение 283 из корпуса на o200k:

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="Одно и то же предложение, разрезанное на токены o200k на 4 языках. английский, 11 токенов: However | , | the | driver | sustained | serious | injuries | to | the | head | .; русский, 9 токенов: Однако | водитель | получил | серьез | ные | трав | мы | головы | .; беларусский, 21 токен: Т | ым | не | менш | , | в | ад | зі | ц | ель | атрыма | ў | цяж | кія | ра | нен | ні | г | алав | ы | .; польский, 19 токенов: K | ier | ow | ca | jednak | uc | ier | p | iał | pow | aż | nie | wsk | utek | obra | żeń | gł | owy | ..">
  <text x="10" y="16" class="f-label f-muted">предложение 283 из FLORES-200 devtest на o200k, по прямоугольнику на токен</text>
  <text x="10" y="42" class="f-label f-ink">английский: 11 токенов</text>
  <rect x="10.0" y="48" width="60.9" height="20" class="f-box"/>
  <text x="13.0" y="62" class="f-mono f-ink">However</text>
  <rect x="72.9" y="48" width="13.8" height="20" class="f-box"/>
  <text x="75.9" y="62" class="f-mono f-ink">,</text>
  <rect x="88.8" y="48" width="29.5" height="20" class="f-box"/>
  <text x="91.8" y="62" class="f-mono f-ink">the</text>
  <rect x="120.3" y="48" width="53.1" height="20" class="f-box"/>
  <text x="123.3" y="62" class="f-mono f-ink">driver</text>
  <rect x="175.4" y="48" width="76.6" height="20" class="f-box"/>
  <text x="178.4" y="62" class="f-mono f-ink">sustained</text>
  <rect x="254.1" y="48" width="60.9" height="20" class="f-box"/>
  <text x="257.1" y="62" class="f-mono f-ink">serious</text>
  <rect x="317.0" y="48" width="68.8" height="20" class="f-box"/>
  <text x="320.0" y="62" class="f-mono f-ink">injuries</text>
  <rect x="387.8" y="48" width="21.7" height="20" class="f-box"/>
  <text x="390.8" y="62" class="f-mono f-ink">to</text>
  <rect x="411.5" y="48" width="29.5" height="20" class="f-box"/>
  <text x="414.5" y="62" class="f-mono f-ink">the</text>
  <rect x="443.1" y="48" width="37.4" height="20" class="f-box"/>
  <text x="446.1" y="62" class="f-mono f-ink">head</text>
  <rect x="482.5" y="48" width="13.8" height="20" class="f-box"/>
  <text x="485.5" y="62" class="f-mono f-ink">.</text>
  <text x="10" y="88" class="f-label f-ink">русский: 9 токенов</text>
  <rect x="10.0" y="94" width="53.1" height="20" class="f-box"/>
  <text x="13.0" y="108" class="f-mono f-ink">Однако</text>
  <rect x="65.1" y="94" width="68.8" height="20" class="f-box"/>
  <text x="68.1" y="108" class="f-mono f-ink">водитель</text>
  <rect x="135.9" y="94" width="60.9" height="20" class="f-box"/>
  <text x="138.9" y="108" class="f-mono f-ink">получил</text>
  <rect x="198.8" y="94" width="53.1" height="20" class="f-box"/>
  <text x="201.8" y="108" class="f-mono f-ink">серьез</text>
  <rect x="253.9" y="94" width="29.5" height="20" class="f-box"/>
  <text x="256.9" y="108" class="f-mono f-ink">ные</text>
  <rect x="285.5" y="94" width="37.4" height="20" class="f-box"/>
  <text x="288.5" y="108" class="f-mono f-ink">трав</text>
  <rect x="324.9" y="94" width="21.7" height="20" class="f-box"/>
  <text x="327.9" y="108" class="f-mono f-ink">мы</text>
  <rect x="348.6" y="94" width="53.1" height="20" class="f-box"/>
  <text x="351.6" y="108" class="f-mono f-ink">головы</text>
  <rect x="403.7" y="94" width="13.8" height="20" class="f-box"/>
  <text x="406.7" y="108" class="f-mono f-ink">.</text>
  <text x="10" y="134" class="f-label f-accent">беларусский: 21 токен</text>
  <rect x="10.0" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="13.0" y="154" class="f-mono f-ink">Т</text>
  <rect x="25.9" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="28.9" y="154" class="f-mono f-ink">ым</text>
  <rect x="49.5" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="52.5" y="154" class="f-mono f-ink">не</text>
  <rect x="73.3" y="140" width="37.4" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="76.3" y="154" class="f-mono f-ink">менш</text>
  <rect x="112.7" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="115.7" y="154" class="f-mono f-ink">,</text>
  <rect x="128.5" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="131.5" y="154" class="f-mono f-ink">в</text>
  <rect x="144.3" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="147.3" y="154" class="f-mono f-ink">ад</text>
  <rect x="168.0" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="171.0" y="154" class="f-mono f-ink">зі</text>
  <rect x="191.7" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="194.7" y="154" class="f-mono f-ink">ц</text>
  <rect x="207.6" y="140" width="29.5" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="210.6" y="154" class="f-mono f-ink">ель</text>
  <rect x="239.1" y="140" width="53.1" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="242.1" y="154" class="f-mono f-ink">атрыма</text>
  <rect x="294.3" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="297.3" y="154" class="f-mono f-ink">ў</text>
  <rect x="310.1" y="140" width="29.5" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="313.1" y="154" class="f-mono f-ink">цяж</text>
  <rect x="341.7" y="140" width="29.5" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="344.7" y="154" class="f-mono f-ink">кія</text>
  <rect x="373.2" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="376.2" y="154" class="f-mono f-ink">ра</text>
  <rect x="396.9" y="140" width="29.5" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="399.9" y="154" class="f-mono f-ink">нен</text>
  <rect x="428.5" y="140" width="21.7" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="431.5" y="154" class="f-mono f-ink">ні</text>
  <rect x="452.2" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="455.2" y="154" class="f-mono f-ink">г</text>
  <rect x="468.0" y="140" width="37.4" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="471.0" y="154" class="f-mono f-ink">алав</text>
  <rect x="507.4" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="510.4" y="154" class="f-mono f-ink">ы</text>
  <rect x="523.3" y="140" width="13.8" height="20" class="f-box" style="stroke:var(--accent)"/>
  <text x="526.3" y="154" class="f-mono f-ink">.</text>
  <text x="10" y="180" class="f-label f-ink">польский: 19 токенов</text>
  <rect x="10.0" y="186" width="13.8" height="20" class="f-box"/>
  <text x="13.0" y="200" class="f-mono f-ink">K</text>
  <rect x="25.9" y="186" width="29.5" height="20" class="f-box"/>
  <text x="28.9" y="200" class="f-mono f-ink">ier</text>
  <rect x="57.4" y="186" width="21.7" height="20" class="f-box"/>
  <text x="60.4" y="200" class="f-mono f-ink">ow</text>
  <rect x="81.1" y="186" width="21.7" height="20" class="f-box"/>
  <text x="84.1" y="200" class="f-mono f-ink">ca</text>
  <rect x="104.8" y="186" width="53.1" height="20" class="f-box"/>
  <text x="107.8" y="200" class="f-mono f-ink">jednak</text>
  <rect x="159.9" y="186" width="21.7" height="20" class="f-box"/>
  <text x="162.9" y="200" class="f-mono f-ink">uc</text>
  <rect x="183.6" y="186" width="29.5" height="20" class="f-box"/>
  <text x="186.6" y="200" class="f-mono f-ink">ier</text>
  <rect x="215.1" y="186" width="13.8" height="20" class="f-box"/>
  <text x="218.1" y="200" class="f-mono f-ink">p</text>
  <rect x="231.0" y="186" width="29.5" height="20" class="f-box"/>
  <text x="234.0" y="200" class="f-mono f-ink">iał</text>
  <rect x="262.5" y="186" width="29.5" height="20" class="f-box"/>
  <text x="265.5" y="200" class="f-mono f-ink">pow</text>
  <rect x="294.1" y="186" width="21.7" height="20" class="f-box"/>
  <text x="297.1" y="200" class="f-mono f-ink">aż</text>
  <rect x="317.8" y="186" width="29.5" height="20" class="f-box"/>
  <text x="320.8" y="200" class="f-mono f-ink">nie</text>
  <rect x="349.3" y="186" width="29.5" height="20" class="f-box"/>
  <text x="352.3" y="200" class="f-mono f-ink">wsk</text>
  <rect x="380.9" y="186" width="37.4" height="20" class="f-box"/>
  <text x="383.9" y="200" class="f-mono f-ink">utek</text>
  <rect x="420.3" y="186" width="37.4" height="20" class="f-box"/>
  <text x="423.3" y="200" class="f-mono f-ink">obra</text>
  <rect x="459.7" y="186" width="29.5" height="20" class="f-box"/>
  <text x="462.7" y="200" class="f-mono f-ink">żeń</text>
  <rect x="491.2" y="186" width="21.7" height="20" class="f-box"/>
  <text x="494.2" y="200" class="f-mono f-ink">gł</text>
  <rect x="514.9" y="186" width="29.5" height="20" class="f-box"/>
  <text x="517.9" y="200" class="f-mono f-ink">owy</text>
  <rect x="546.5" y="186" width="13.8" height="20" class="f-box"/>
  <text x="549.5" y="200" class="f-mono f-ink">.</text>
</svg>
<figcaption>Пробел в начале слова принадлежит следующему токену и не нарисован.</figcaption>
</figure>

Русский тратит 9 токенов, английский 11, то есть здесь русский дешевле английского. Беларусский перевод тратит 21. Слово "вадзіцель" (водитель) разрезано на 5 кусков, а "водитель" занимает 1. В предложении 594 "мове" (языке) распадается на "м" и "ове".

## Буквы этого не объясняют

Первый подозреваемый это алфавит. В беларусском есть 2 буквы, которых нет в русском, ў и і. Они повсюду: предлог "ў", союз "і". Если таблицу слияний учили в основном на русском, каждое слово с этими буквами разваливается на мелкие куски. До счёта я записал, что причина в словаре. Замена букв закроет меньше трети разрыва с русским. Потом заменил "ў" на "у" и "і" на "и" во всём беларусском корпусе и посчитал заново.

Текст становится беларусским с ошибками, написанным русскими буквами. Будь дело в буквах, он бы подешевел. На o200k он подорожал: замена отодвинула беларусский от русского на 8% разрыва. На Gemma 3 и Mistral Nemo она закрыла от 0 до 3%. Лучше всего вышло на cl100k, 26%, у Qwen3 и Claude около 20%. Меньше трети везде, как я и ожидал.

<figure class="fig">
<svg viewBox="0 0 640 304" role="img" aria-label="Точечная диаграмма, по строке на токенизатор: русский, беларусский и беларусский с 2 буквами, заменёнными на русские, как налог в токенах относительно английского. cl100k: русский 2,46, беларусский 3,50, беларусский с ў→у, і→и 3,23, 26%; o200k: русский 1,42, беларусский 1,99, беларусский с ў→у, і→и 2,03, −8%; Gemma 3: русский 1,37, беларусский 2,17, беларусский с ў→у, і→и 2,14, 3%; Mistral Nemo: русский 1,50, беларусский 2,15, беларусский с ў→у, і→и 2,15, 0%; Llama 3.1: русский 1,62, беларусский 2,58, беларусский с ў→у, і→и 2,47, 11%; DeepSeek-V3: русский 1,58, беларусский 2,62, беларусский с ў→у, і→и 2,51, 11%; Qwen3: русский 1,75, беларусский 2,97, беларусский с ў→у, і→и 2,73, 20%; Claude Opus 5: русский 1,32, беларусский 1,87, беларусский с ў→у, і→и 1,76, 19%. Замена сдвигает беларусский к русскому не больше чем примерно на четверть разрыва, а на o200k отодвигает его дальше.">
  <text x="10" y="16" class="f-label f-muted">беларусский до и после замены ў→у и і→и, во сколько раз больше английского</text>
  <circle cx="146" cy="33" r="5" class="f-ink" style="fill:currentColor"/><text x="156" y="37" class="f-label f-ink">русский</text>
  <circle cx="256" cy="33" r="5" style="fill:var(--accent)"/><text x="266" y="37" class="f-label f-ink">беларусский</text>
  <circle cx="386" cy="33" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.8"/><text x="396" y="37" class="f-label f-ink">беларусский с ў→у, і→и</text>
  <line x1="140.0" y1="48" x2="140.0" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="140.0" y="294" text-anchor="middle" class="f-label f-muted">1,0×</text>
  <line x1="220.8" y1="48" x2="220.8" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="220.8" y="294" text-anchor="middle" class="f-label f-muted">1,5×</text>
  <line x1="301.5" y1="48" x2="301.5" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="301.5" y="294" text-anchor="middle" class="f-label f-muted">2,0×</text>
  <line x1="382.3" y1="48" x2="382.3" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="382.3" y="294" text-anchor="middle" class="f-label f-muted">2,5×</text>
  <line x1="463.1" y1="48" x2="463.1" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="463.1" y="294" text-anchor="middle" class="f-label f-muted">3,0×</text>
  <line x1="543.8" y1="48" x2="543.8" y2="278" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="543.8" y="294" text-anchor="middle" class="f-label f-muted">3,5×</text>
  <text x="130" y="72" text-anchor="end" class="f-label f-ink">cl100k</text>
  <line x1="376.2" y1="68" x2="543.6" y2="68" class="f-line" opacity="0.6"/>
  <circle cx="376.2" cy="68" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="543.6" cy="68" r="5.5" style="fill:var(--accent)"/>
  <circle cx="499.5" cy="68" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="72" text-anchor="end" class="f-label f-ink">26%</text>
  <text x="130" y="100" text-anchor="end" class="f-label f-ink">o200k</text>
  <line x1="208.0" y1="96" x2="306.7" y2="96" class="f-line" opacity="0.6"/>
  <circle cx="208.0" cy="96" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="299.2" cy="96" r="5.5" style="fill:var(--accent)"/>
  <circle cx="306.7" cy="96" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="100" text-anchor="end" class="f-label f-accent">−8%</text>
  <text x="130" y="128" text-anchor="end" class="f-label f-ink">Gemma 3</text>
  <line x1="199.0" y1="124" x2="328.2" y2="124" class="f-line" opacity="0.6"/>
  <circle cx="199.0" cy="124" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="328.2" cy="124" r="5.5" style="fill:var(--accent)"/>
  <circle cx="323.9" cy="124" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="128" text-anchor="end" class="f-label f-ink">3%</text>
  <text x="130" y="156" text-anchor="end" class="f-label f-ink">Mistral Nemo</text>
  <line x1="221.4" y1="152" x2="326.3" y2="152" class="f-line" opacity="0.6"/>
  <circle cx="221.4" cy="152" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="326.3" cy="152" r="5.5" style="fill:var(--accent)"/>
  <circle cx="326.1" cy="152" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="156" text-anchor="end" class="f-label f-ink">0%</text>
  <text x="130" y="184" text-anchor="end" class="f-label f-ink">Llama 3.1</text>
  <line x1="239.6" y1="180" x2="395.2" y2="180" class="f-line" opacity="0.6"/>
  <circle cx="239.6" cy="180" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="395.2" cy="180" r="5.5" style="fill:var(--accent)"/>
  <circle cx="378.0" cy="180" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="184" text-anchor="end" class="f-label f-ink">11%</text>
  <text x="130" y="212" text-anchor="end" class="f-label f-ink">DeepSeek-V3</text>
  <line x1="234.1" y1="208" x2="401.5" y2="208" class="f-line" opacity="0.6"/>
  <circle cx="234.1" cy="208" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="401.5" cy="208" r="5.5" style="fill:var(--accent)"/>
  <circle cx="383.5" cy="208" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="212" text-anchor="end" class="f-label f-ink">11%</text>
  <text x="130" y="240" text-anchor="end" class="f-label f-ink">Qwen3</text>
  <line x1="261.9" y1="236" x2="458.5" y2="236" class="f-line" opacity="0.6"/>
  <circle cx="261.9" cy="236" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="458.5" cy="236" r="5.5" style="fill:var(--accent)"/>
  <circle cx="419.7" cy="236" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="240" text-anchor="end" class="f-label f-ink">20%</text>
  <text x="130" y="268" text-anchor="end" class="f-label f-ink">Claude Opus 5</text>
  <line x1="191.3" y1="264" x2="280.1" y2="264" class="f-line" opacity="0.6"/>
  <circle cx="191.3" cy="264" r="5" class="f-ink" style="fill:currentColor"/>
  <circle cx="280.1" cy="264" r="5.5" style="fill:var(--accent)"/>
  <circle cx="263.2" cy="264" r="7" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="630" y="268" text-anchor="end" class="f-label f-ink">19%</text>
</svg>
<figcaption>Заменены и заглавные Ў и І. Процент справа это доля разрыва между беларусским и русским, которую закрывает замена.</figcaption>
</figure>

Результат на o200k заставил меня дважды проверить замену, потому что результат не в ту сторону выглядит как баг. Бага не было. Я понимаю это так: в словаре не хватает целых слов. На o200k 83% английских слов в тексте занимают один токен, а беларусских только 33%, у русского 47%. С этим всё сходится, но это не доказательство: у польского 37%, а он всё равно дешевле беларусского. Откуда это берётся, я могу только гадать. В прошлой статье здесь я насчитал 1 беларусскую страницу на 399 русских в Common Crawl. Таблица слияний, выученная на таком тексте, вполне могла получиться именно такой. Обучать токенизатор, чтобы это проверить, я не стал.

## Claude считает по-своему

Claude Opus 5 тратит на тот же английский текст 42928 токенов, когда остальным хватает около 27 тысяч. Похоже, он режет мельче каждый язык. До счёта я записал, что на кириллице Claude будет дороже o200k. В сырых токенах так и есть, беларусский занимает 80162 против 53357. Но относительно собственного английского у Claude самый маленький налог в таблице для русского и беларусского, 1,32 и 1,87. А у польского налог ниже на Gemma 3 и Mistral Nemo. Ожидание я сформулировал неоднозначно и заметил это, только когда оба числа оказались перед глазами. Цена токена у разных поставщиков всё равно разная, поэтому я сравниваю отношение внутри одного токенизатора.

## Мой блог как корпус

FLORES это новости и Википедия, переведённые с английского, а мои статьи другие. Здесь 42 статьи на всех 3 языках и я посчитал их на o200k.

Если брать файл целиком, беларусский дороже английского всего в 1,15 раза. Большая часть токенов уходит на рисунки в SVG, вставленные прямо в файл, это около 73% английских токенов. Их разметка одинакова на всех языках. Если вырезать рисунки и код и оставить только прозу, налог поднимается до 1,24 у русского и 1,52 у беларусского. Это всё ещё ниже FLORES. Думаю, в моей русской и беларусской прозе остаются английские названия и числа, которые везде стоят одинаково. Отдельно я это не выделял.

## Чего я не проверял

- Одна модель Claude, Opus 5. У других моделей Claude токенизатор может быть другим, их я не считал.
- Токены это цена и контекст. Качество ответов я не мерил вообще.
- Беларусский во FLORES написан официальным правописанием. Классическое, тарашкевица, может резаться иначе, а параллельного текста для сравнения у меня нет.
- Один прогон на токенизатор, но токенизатор детерминирован, второй прогон даст тот же счёт. Для Claude я повторил только вызов с одной инструкцией.
