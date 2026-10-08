---
title: "Токенізатары зрабілі рускую танейшай і пакінулі беларускую ззаду"
description: "Адны і тыя ж 1012 сказаў FLORES-200 на 8 токенізатарах. Руская патаннела з 2,46 англійскай на cl100k да 1,42 на o200k і на новых не даражэй за польскую, а беларуская па-ранейшаму каштуе ад 1,40 да 1,69 рускай. Замена ў і і на рускія літары не дапамагае."
date: 2026-10-08
lang: be
translationKey: tokenizer-tax
tags: ["llm", "text"]
---
Кожны артыкул у гэтым блогу выходзіць на 3 мовах і з кожнай мне дапамагае мадэль. Значыць, за адзін і той жа сэнс я плачу 3 разы. У галаве ў мяне была і лічба, наколькі даражэй абыходзяцца астатнія 2. Яна з працы Petrov et al. 2023, дзе каля 2000 сказаў FLORES-200 прагналі праз 27 токенізатараў і кадовак. На cl100k_base, токенізатары GPT-4, польскай трэба ў 1,91 раза больш токенаў, чым англійскай, рускай у 2,49, беларускай у 3,55. Месяц таму я сам цытаваў гэтыя лічбы ў іншым замеры.

З гэтага радка ў мяне склалася простая карціна: падатак гэта падатак на кірыліцу, а лацінка атрымлівае зніжку. Калі я адкрыў іх даныя для гэтага артыкула, астатнія радкі з ёй не пагадзіліся. У Llama 1 і Qwen руская ўжо ў 2023 годзе каштавала не даражэй за польскую. Я ўзяў адзін радок, які цытуюць усе, а на астатнія не паглядзеў. І ні разу не праверыў нічога з гэтага на токенізатарах, якімі карыстаюся цяпер.

## Як мераў

Корпус FLORES-200 devtest. У ім 1012 сказаў, перакладзеных людзьмі на кожную мову, таму сэнс зафіксаваны і мяняецца толькі мова. Акрамя англійскай я ўзяў рускую, беларускую і польскую. Украінская ідзе пятай кропкай. Кожны сказ кадуецца асобна, без службовых токенаў. Падатак гэта сума токенаў па мове, падзеленая на суму па англійскай.

Токенізатары: cl100k_base і o200k_base з tiktoken 0.14.0 і файлы tokenizer.json ад Llama 3.1, Gemma 3, Qwen3, DeepSeek-V3 і Mistral Nemo праз бібліятэку tokenizers 0.23.2. Публічнага токенізатара ў Claude няма, таму токены я палічыў па usage. Кожны корпус я адправіў у Claude Opus 5 праз Claude Code CLI 2.1.292 з пустой папкі без інструментаў. Потым адняў уваход таго ж выкліку з адной толькі інструкцыяй, 3471 токен у абодвух прагонах. Для Claude сказы злучаныя знакам новага радка. На адкрытых токенізатарах злучаны тэкст зрушвае суадносіны не больш чым на 0,04.

Petrov кадаваў dev і devtest разам адным радком, так што ўваходы адрозніваюцца. І ўсё роўна на cl100k я трапіў у межы 0,05 ад кожнай іх лічбы, беларуская 3,50 супраць 3,55.

## Руская патаннела

Англійская займае каля 27 тысяч токенаў на кожным адкрытым токенізатары. Руская з 2,46 на cl100k спусцілася да 1,42 на o200k, токенізатары, якім OpenAI карыстаецца цяпер. На 6 новых токенізатарах і на Claude яна каштуе ад 1,32 да 1,75. Польская зрушылася менш, у яе ад 1,51 да 1,89.

На ўсіх токенізатарах маёй табліцы, акрамя cl100k, руская цяпер танней за польскую. На Qwen3 нічыя, 1,75 супраць 1,76. У Petrov такая ж нічыя была ў Qwen 2023 года, так што для Qwen нічога не змянілася. На o200k слоўнік вырас удвая, 200019 запісаў супраць 100277. Руская страціла 1,04 свайго падатку, польская 0,28. Чаму рускай гэта дало больш, я не ведаю: разам з памерам змяніўся і склад навучальных даных.

<figure class="fig">
<svg viewBox="0 0 640 304" role="img" aria-label="Кропкавая дыяграма, па радку на токенізатар, падатак у токенах адносна англійскай на тых жа 1012 сказах FLORES-200. cl100k: руская 2,46, польская 1,91, беларуская 3,50; o200k: руская 1,42, польская 1,64, беларуская 1,99; Gemma 3: руская 1,37, польская 1,51, беларуская 2,17; Mistral Nemo: руская 1,50, польская 1,58, беларуская 2,15; Llama 3.1: руская 1,62, польская 1,89, беларуская 2,58; DeepSeek-V3: руская 1,58, польская 1,68, беларуская 2,62; Qwen3: руская 1,75, польская 1,76, беларуская 2,97; Claude Opus 5: руская 1,32, польская 1,59, беларуская 1,87. Руская танейшая за польскую ва ўсіх радках, акрамя cl100k, на Qwen3 яны амаль роўныя. Беларуская самая дарагая ва ўсіх радках.">
  <text x="10" y="16" class="f-label f-muted">токенаў на тыя ж 1012 сказаў, у колькі разоў больш за англійскую</text>
  <circle cx="146" cy="33" r="5" class="f-ink" style="fill:currentColor"/><text x="156" y="37" class="f-label f-ink">руская</text>
  <circle cx="296" cy="33" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/><text x="306" y="37" class="f-label f-ink">польская</text>
  <circle cx="446" cy="33" r="5" style="fill:var(--accent)"/><text x="456" y="37" class="f-label f-ink">беларуская</text>
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
<figcaption>FLORES-200 devtest. Адкрытыя токенізатары лічаць кожны сказ асобна і без службовых токенаў, Claude палічаны па usage API на злепленым тэксце.</figcaption>
</figure>

Беларуская суседку не дагнала. На новых токенізатарах яна даражэйшая за англійскую ад 1,87 да 2,97 раза (на cl100k у 3,50). У параўнанні з рускай гэта ад 1,40 да 1,69 на кожным токенізатары. На 5 з 7 новых разрыў шырэйшы, чым на cl100k. Украінская знаходзіцца паміж імі, ад 1,35 на Claude да 2,50 на Qwen3, калі браць новыя.

Сказ 283 з корпуса на o200k:

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="Адзін і той жа сказ, парэзаны на токены o200k на 4 мовах. англійская, 11 токенаў: However | , | the | driver | sustained | serious | injuries | to | the | head | .; руская, 9 токенаў: Однако | водитель | получил | серьез | ные | трав | мы | головы | .; беларуская, 21 токен: Т | ым | не | менш | , | в | ад | зі | ц | ель | атрыма | ў | цяж | кія | ра | нен | ні | г | алав | ы | .; польская, 19 токенаў: K | ier | ow | ca | jednak | uc | ier | p | iał | pow | aż | nie | wsk | utek | obra | żeń | gł | owy | ..">
  <text x="10" y="16" class="f-label f-muted">сказ 283 з FLORES-200 devtest на o200k, па прамавугольніку на токен</text>
  <text x="10" y="42" class="f-label f-ink">англійская: 11 токенаў</text>
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
  <text x="10" y="88" class="f-label f-ink">руская: 9 токенаў</text>
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
  <text x="10" y="134" class="f-label f-accent">беларуская: 21 токен</text>
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
  <text x="10" y="180" class="f-label f-ink">польская: 19 токенаў</text>
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
<figcaption>Прабел на пачатку слова належыць наступнаму токену і не намаляваны.</figcaption>
</figure>

Руская траціць 9 токенаў, англійская 11, гэта значыць тут руская танней за англійскую. Беларускі пераклад траціць 21. Слова "вадзіцель" парэзана на 5 кавалкаў, а "водитель" займае 1. У сказе 594 "мове" распадаецца на "м" і "ове".

## Літары гэтага не тлумачаць

Першы падазраваны гэта алфавіт. У беларускай ёсць 2 літары, якіх няма ў рускай, "ў" і "і". Яны паўсюль: прыназоўнік "ў", злучнік "і". Калі табліцу зліццяў вучылі ў асноўным на рускай, кожнае слова з гэтымі літарамі развальваецца на дробныя кавалкі. Да падліку я запісаў, што прычына ў слоўніку. Замена літар закрые менш за трэць разрыву з рускай. Потым замяніў "ў" на "у" і "і" на "и" ва ўсім беларускім корпусе і палічыў нанава.

Тэкст становіцца беларускім з памылкамі, напісаным рускімі літарамі. Калі б справа была ў літарах, ён павінен быў стаць танейшым. На o200k ён падаражэў: замена адсунула беларускую ад рускай на 8% разрыву. На Gemma 3 і Mistral Nemo яна закрыла ад 0 да 3%. Лепшы выпадак гэта cl100k з 26%, у Qwen3 і Claude каля 20%. Менш за трэць усюды, як я і чакаў.

<figure class="fig">
<svg viewBox="0 0 640 304" role="img" aria-label="Кропкавая дыяграма, па радку на токенізатар: руская, беларуская і беларуская з 2 літарамі, замененымі на рускія, як падатак у токенах адносна англійскай. cl100k: руская 2,46, беларуская 3,50, беларуская з ў→у, і→и 3,23, 26%; o200k: руская 1,42, беларуская 1,99, беларуская з ў→у, і→и 2,03, −8%; Gemma 3: руская 1,37, беларуская 2,17, беларуская з ў→у, і→и 2,14, 3%; Mistral Nemo: руская 1,50, беларуская 2,15, беларуская з ў→у, і→и 2,15, 0%; Llama 3.1: руская 1,62, беларуская 2,58, беларуская з ў→у, і→и 2,47, 11%; DeepSeek-V3: руская 1,58, беларуская 2,62, беларуская з ў→у, і→и 2,51, 11%; Qwen3: руская 1,75, беларуская 2,97, беларуская з ў→у, і→и 2,73, 20%; Claude Opus 5: руская 1,32, беларуская 1,87, беларуская з ў→у, і→и 1,76, 19%. Замена набліжае беларускую да рускай не больш чым прыкладна на чвэрць разрыву, а на o200k адсоўвае яе далей.">
  <text x="10" y="16" class="f-label f-muted">беларуская да і пасля замены ў→у і і→и, у колькі разоў больш за англійскую</text>
  <circle cx="146" cy="33" r="5" class="f-ink" style="fill:currentColor"/><text x="156" y="37" class="f-label f-ink">руская</text>
  <circle cx="256" cy="33" r="5" style="fill:var(--accent)"/><text x="266" y="37" class="f-label f-ink">беларуская</text>
  <circle cx="386" cy="33" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.8"/><text x="396" y="37" class="f-label f-ink">беларуская з ў→у, і→и</text>
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
<figcaption>Заменены і вялікія Ў і І. Працэнт справа гэта доля разрыву паміж беларускай і рускай, якую закрывае замена.</figcaption>
</figure>

Вынік на o200k усё роўна прымусіў мяне двойчы праверыць замену, бо вынік не ў той бок выглядае як баг. Бага не было. Я разумею гэта так: у слоўніку не хапае цэлых слоў. На o200k 83% англійскіх слоў у тэксце займаюць адзін токен, а беларускіх толькі 33%, у рускай 47%. Гэта сыходзіцца, але не даказвае: у польскай 37% і яна ўсё роўна танней за беларускую. Адкуль гэта бярэцца, толькі здагадка. У папярэднім артыкуле тут я налічыў 1 беларускую старонку на 399 рускіх у Common Crawl. Табліца зліццяў, вывучаная на такім тэксце, цалкам магла атрымацца менавіта такой. Токенізатар, каб гэта праверыць, я не навучаў.

## Claude лічыць па-свойму

Claude Opus 5 траціць на той жа англійскі тэкст 42928 токенаў, тады як астатнім хапае каля 27 тысяч. Здаецца, ён рэжа драбней кожную мову. Да падліку я запісаў, што на кірыліцы Claude будзе даражэй за o200k. У сырых токенах так і ёсць, беларуская займае 80162 супраць 53357. Але адносна ўласнай англійскай у Claude самы малы падатак у табліцы для рускай і беларускай, 1,32 і 1,87. А ў польскай падатак ніжэйшы на Gemma 3 і Mistral Nemo. Чаканне я сфармуляваў неадназначна і заўважыў гэта, толькі калі абедзве лічбы апынуліся перад вачыма. Цана токена ў розных пастаўшчыкоў усё роўна розная, таму я параўноўваю суадносіны ўнутры аднаго токенізатара.

## Мой блог як корпус

FLORES гэта навіны і Вікіпедыя, перакладзеныя з англійскай, а мае артыкулы іншыя. Тут 42 артыкулы на ўсіх 3 мовах і я палічыў іх на o200k.

Калі браць файл цалкам, беларуская даражэйшая за англійскую ўсяго ў 1,15 раза. Большая частка токенаў гэта ўбудаваныя ў тэкст малюнкі SVG, каля 73% англійскіх токенаў. Іх разметка аднолькавая на ўсіх мовах. Калі выразаць малюнкі і код і пакінуць толькі прозу, падатак падымаецца да 1,24 у рускай і 1,52 у беларускай. Гэта ўсё яшчэ ніжэй за FLORES. Думаю, у маёй рускай і беларускай прозе застаюцца англійскія назвы і лічбы, якія ўсюды каштуюць аднолькава. Асобна я гэта не вылучаў.

## Чаго я не правяраў

- Адна мадэль Claude, Opus 5. У іншых мадэляў Claude токенізатар можа быць іншым, іх я не лічыў.
- Токены гэта цана і кантэкст. Якасць адказаў я не мераў наогул.
- Беларуская ў FLORES напісаная афіцыйным правапісам. Класічны, тарашкевіца, можа рэзацца інакш, а паралельнага тэксту для параўнання ў мяне няма.
- Адзін прагон на токенізатар, але токенізатар дэтэрмінаваны, другі прагон дасць той жа лік. Для Claude я паўтарыў толькі выклік з адной інструкцыяй.
