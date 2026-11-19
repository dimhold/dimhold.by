---
title: "Мой офлайн голосовой пульт отвечает за секунду, только чаще всего не на тот вопрос"
description: "Я собрал в цепочку Vosk, GPT-2 medium и eSpeak NG на ноутбуке с 4 ГБ на всё. Ответ готов примерно через секунду после отпускания клавиши, но на живой речи маленькая модель Vosk ошибается в каждом третьем слове, а GPT-2 так же уверенно отвечает на неверно услышанный вопрос. Уверенность Vosk по словам ловит многие из этих ошибок."
date: 2021-10-23
lang: ru
translationKey: voice-remote
tags: ["llm", "machine-learning", "performance"]
---
Мне хотелось задавать вопрос модели на ноутбуке, не набирая его. Вопросы про собственную работу часто приходят, когда я не сижу за клавиатурой. Зажимаешь клавишу, задаёшь вопрос, отпускаешь и слышишь ответ, причём ничего не покидает машину. Детали для этого есть: Vosk распознаёт речь, GPT-2 отвечает, `espeak-ng` озвучивает. Я собрал их вместе и замерил время.

Ожидание у меня было простое и я его ни разу не проверял. Распознавание это решённая часть. В README `vosk-model-small-en-us-0.15` указана доля ошибок в словах 9,85% на LibriSpeech `test-clean` и задержка 0,15 с. Медленное и слабое место это языковая модель, на неё я и собирался потратить время.

## Стенд

У машины 4 ядра и нет GPU. Каждый прогон идёт в cgroup с жёстким лимитом 4 ГБ и без свопа, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. Примерно столько я бы отдал побочному проекту на ноутбуке. Версии на эту неделю: Python 3.9, torch 1.10.0 на CPU, transformers 4.11.3, vosk 0.3.31.

Себя я не записывал. Речь взял из SLURP, это открытый набор, где люди читают с планшета команды и вопросы для домашнего ассистента. Всё там записано микрофонной решёткой в комнате. Часть дикторов была ещё и в гарнитуре, поэтому некоторые фразы есть в двух записях. Я выбрал 150 разных фраз, у которых есть обе записи, то есть 300 файлов.

Нажатие клавиши здесь имитируется. Звук идёт в распознаватель кусками по 0,2 с в темпе речи. Отсчёт времени начинается, когда файл кончился, это момент, когда я отпустил клавишу. Если распознаватель медленнее речи, очередь растёт и входит в задержку.

## Цепочка быстрая

<figure class="fig">
<svg viewBox="0 0 680 212" role="img" aria-label="Время от отпускания клавиши до готового ответа, 50 фраз с гарнитуры. Vosk 0,05 с; GPT-2 medium 0,87 с; eSpeak NG 0,13 с; медиана 1,06 с; 90-й перцентиль 3,09 с; худшая 3,6 с.">
  <rect x="47.5" y="60" width="217.5" height="26" rx="2" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="156.3" y="77" text-anchor="middle" class="f-muted" style="font-size:10px">речь, Vosk уже работает</text>
  <rect x="265.0" y="60" width="3.8" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="259.0" y="52" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">Vosk 0,05 с</text>
  <rect x="268.8" y="60" width="65.2" height="26" rx="1" class="f-box"/>
  <text x="272.8" y="100" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">GPT-2 medium 0,87 с</text>
  <rect x="333.9" y="60" width="9.9" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="333.9" y="52" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">eSpeak NG 0,13 с</text>
  <line x1="265" y1="24" x2="265" y2="166" class="f-line" style="stroke:var(--accent)"/>
  <text x="269" y="34" text-anchor="start" class="f-accent" style="font-size:10px">клавиша отпущена</text>
  <line x1="265" y1="126" x2="344.3" y2="126" class="f-line" style="stroke-width:3"/>
  <text x="350.3" y="130" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">медиана 1,06 с</text>
  <line x1="265" y1="144" x2="496.8" y2="144" class="f-line" style="stroke-width:1.5"/>
  <text x="502.8" y="148" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">90-й перцентиль 3,09 с</text>
  <line x1="265" y1="162" x2="535.1" y2="162" class="f-line" style="stroke-width:1.5"/>
  <text x="541.1" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">худшая 3,6 с</text>
  <line x1="40" y1="186" x2="640" y2="186" class="f-line"/>
  <line x1="40" y1="186" x2="40" y2="190" class="f-line"/>
  <text x="40" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-3 с</text>
  <line x1="115" y1="186" x2="115" y2="190" class="f-line"/>
  <text x="115" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-2 с</text>
  <line x1="190" y1="186" x2="190" y2="190" class="f-line"/>
  <text x="190" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-1 с</text>
  <line x1="265" y1="186" x2="265" y2="190" class="f-line"/>
  <text x="265" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">0 с</text>
  <line x1="340" y1="186" x2="340" y2="190" class="f-line"/>
  <text x="340" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+1 с</text>
  <line x1="415" y1="186" x2="415" y2="190" class="f-line"/>
  <text x="415" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+2 с</text>
  <line x1="490" y1="186" x2="490" y2="190" class="f-line"/>
  <text x="490" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+3 с</text>
  <line x1="565" y1="186" x2="565" y2="190" class="f-line"/>
  <text x="565" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+4 с</text>
  <line x1="640" y1="186" x2="640" y2="190" class="f-line"/>
  <text x="640" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+5 с</text>
</svg>
<figcaption>Медианы каждого шага на 50 фразах SLURP с гарнитуры: Vosk small 0.15, GPT-2 medium с жадным декодированием до 40 токенов, eSpeak NG пишет wav. Ниже вся цепочка: медиана, 90-й перцентиль и худшая фраза. Один прогон, 4 ядра, лимит 4 ГБ.</figcaption>
</figure>

На 50 фразах с гарнитуры цепочка была такая: Vosk small, потом GPT-2 medium, потом `espeak-ng`. От отпускания клавиши до готового ответа медиана вышла 1,06 с, худший случай 3,6 с. Распознаватель занял из этого 0,05 с, потому что работал, пока человек ещё говорил. На медианной фразе GPT-2 medium занял 84% времени. 5 самых медленных ответов это те, что упёрлись в мой лимит в 40 токенов. Вся цепочка вместе дала пик памяти 3363 МБ, так что в 4 ГБ влезает.

Пока всё совпадало с ожиданием: модель медленная, распознавание почти ничего не стоит. Потом я сравнил расшифровки с эталонными текстами SLURP.

## Слабое место это слух

Одна из первых фраз была "is it sunny what's the temperature". Vosk услышал "is it son new what's the temperature". GPT-2 medium ответил:

```
it's not son new, it's son new.
```

Это не единичный случай. Из 50 вопросов замера в 38 GPT-2 получил расшифровку, которая не совпадала со сказанным. На всех 150 фразах с гарнитуры маленькая модель Vosk распознала целиком верно 32. Доля ошибок в словах у неё 32,7%, в 3 с лишним раза выше, чем в README. С микрофоном в комнате 53,2%.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Доля ошибок в словах у четырёх распознавателей на одних и тех же 150 фразах, гарнитура и микрофон в комнате. Vosk small 0.15: гарнитура 32,7%, микрофон в комнате 53,2%, 0,05 с после отпускания, пик 205 МБ; Vosk 0.21, rescore, без rnnlm: гарнитура 25,2%, микрофон в комнате 43,2%, 0,22 с после отпускания, пик 2214 МБ; Vosk 0.21, без rescore и rnnlm: гарнитура 29,8%, микрофон в комнате 47,8%, 0,22 с после отпускания, пик 339 МБ; wav2vec2 base 960h: гарнитура 43,4%, микрофон в комнате 69,1%, 0,43 с после отпускания, пик 1377 МБ; Vosk 0.21 как есть: убита при загрузке на лимите 4 ГБ и 5,5 ГБ.">
  <circle cx="230" cy="14" r="5" class="f-box"/>
  <text x="240" y="18" text-anchor="start" class="f-muted" style="font-size:11px">гарнитура</text>
  <circle cx="350" cy="14" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="360" y="18" text-anchor="start" class="f-muted" style="font-size:11px">микрофон в комнате</text>
  <text x="20" y="44" text-anchor="start" class="f-ink" style="font-size:12px">Vosk small 0.15</text>
  <text x="20" y="59" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,05 с после отпускания, пик 205 МБ</text>
  <line x1="393.5" y1="40" x2="496.0" y2="40" class="f-line"/>
  <circle cx="393.5" cy="40" r="5" class="f-box"/>
  <circle cx="496.0" cy="40" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="393.5" y="31" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">32,7%</text>
  <text x="496.0" y="31" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">53,2%</text>
  <text x="20" y="88" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, rescore, без rnnlm</text>
  <text x="20" y="103" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,22 с после отпускания, пик 2214 МБ</text>
  <line x1="356.0" y1="84" x2="446.0" y2="84" class="f-line"/>
  <circle cx="356.0" cy="84" r="5" class="f-box"/>
  <circle cx="446.0" cy="84" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="356.0" y="75" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">25,2%</text>
  <text x="446.0" y="75" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">43,2%</text>
  <text x="20" y="132" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, без rescore и rnnlm</text>
  <text x="20" y="147" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,22 с после отпускания, пик 339 МБ</text>
  <line x1="379.0" y1="128" x2="469.0" y2="128" class="f-line"/>
  <circle cx="379.0" cy="128" r="5" class="f-box"/>
  <circle cx="469.0" cy="128" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="379.0" y="119" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">29,8%</text>
  <text x="469.0" y="119" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">47,8%</text>
  <text x="20" y="176" text-anchor="start" class="f-ink" style="font-size:12px">wav2vec2 base 960h</text>
  <text x="20" y="191" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,43 с после отпускания, пик 1377 МБ</text>
  <line x1="447.0" y1="172" x2="575.5" y2="172" class="f-line"/>
  <circle cx="447.0" cy="172" r="5" class="f-box"/>
  <circle cx="575.5" cy="172" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="447.0" y="163" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">43,4%</text>
  <text x="575.5" y="163" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">69,1%</text>
  <text x="20" y="220" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21 как есть</text>
  <text x="230" y="220" text-anchor="start" class="f-mono f-accent" style="font-size:10.5px">убита при загрузке на лимите 4 ГБ и 5,5 ГБ</text>
  <line x1="230" y1="238" x2="630" y2="238" class="f-line"/>
  <line x1="230" y1="238" x2="230" y2="242" class="f-line"/>
  <text x="230" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">0%</text>
  <line x1="330" y1="238" x2="330" y2="242" class="f-line"/>
  <text x="330" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="430" y1="238" x2="430" y2="242" class="f-line"/>
  <text x="430" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="530" y1="238" x2="530" y2="242" class="f-line"/>
  <text x="530" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="630" y1="238" x2="630" y2="242" class="f-line"/>
  <text x="630" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <text x="630" y="270" text-anchor="end" class="f-muted" style="font-size:10px">доля ошибок в словах</text>
</svg>
<figcaption>Одни и те же 150 фраз SLURP, каждая записана гарнитурой и микрофоном в комнате. Под каждым названием: медиана ожидания после отпускания клавиши и пик памяти прогона. Слова сравниваются без учёта регистра и пунктуации.</figcaption>
</figure>

Я попробовал ещё 2 распознавателя. `facebook/wav2vec2-base-960h` через transformers здесь оказался хуже, 43,4% на гарнитуре. Кроме того, ему нужна запись целиком, поэтому после отпускания клавиши он считает ещё 0,43 с по медиане. Обучен он только на LibriSpeech, то есть на аудиокнигах.

Большая модель Vosk, `vosk-model-en-us-0.21`, весит 1,75 ГБ в архиве и я ждал, что она спокойно влезет. Процесс убило на лимите 4 ГБ и ещё раз на 5,5 ГБ, оба раза во время загрузки. Я покопался в `model.cc`, пока не понял, в чём дело. Кроме графа в модели 2 папки: `rescore` с языковой моделью на 1,9 ГБ и `rnnlm` с нейросетевой. При загрузке Vosk разворачивает признаки слов RNNLM в полную матрицу. С `rnnlm` и без `rescore` пик загрузки был 3315 МБ, без обеих папок 293 МБ.

Без `rnnlm` и с `rescore` пик загрузки 2157 МБ, а доля ошибок на гарнитуре 25,2%. Это мой лучший результат, но всё равно неверно каждое четвёртое слово. Без обеих папок 29,8%.

Выходит, ожидание подвело там, куда я не смотрел. Я прочитал 9,85% в README и не подумал, что такое `test-clean`. Это длинные предложения из аудиокниг, начитанные в хороший микрофон. SLURP это короткие команды, прочитанные в комнате.

## Vosk знает, когда не уверен

С ошибками я готов жить, но ничто в цепочке не говорит "я не расслышал". Vosk выдаёт одну строку. GPT-2 отвечает на неё так же уверенно, как на правильную.

Vosk умеет сказать больше. С `SetWords(True)` каждое слово в результате приходит с уверенностью от 0 до 1. Я взял самую низкую уверенность слова в каждой фразе и сделал из неё фильтр. Ниже порога пульт просит повторить, а не думает над ответом.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="150 фраз с гарнитуры, Vosk small, порог 0,5 по самой низкой уверенности в слове. Услышал верно и ответил: 31. Услышал верно и переспросил: 1. Услышал неверно и переспросил: 45. Услышал неверно и ответил: 73.">
  <text x="40" y="26" text-anchor="start" class="f-ink" style="font-size:12px">услышал верно, ответил: 31</text>
  <rect x="40" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="142" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="159" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="176" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="193" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="210" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="227" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="244" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="261" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="278" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="295" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="312" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="329" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="346" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="363" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="380" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="397" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="414" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="431" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="448" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="40" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <text x="40" y="92" text-anchor="start" class="f-ink" style="font-size:12px">услышал верно, переспросил: 1</text>
  <rect x="40" y="100" width="14" height="14" rx="2" class="f-box" style="stroke-dasharray:2 2"/>
  <text x="40" y="141" text-anchor="start" class="f-ink" style="font-size:12px">услышал неверно, переспросил: 45</text>
  <rect x="40" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="380" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="397" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="414" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="431" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="448" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="40" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="166" width="14" height="14" rx="2" class="f-box"/>
  <text x="40" y="207" text-anchor="start" class="f-ink" style="font-size:12px">услышал неверно, ответил: 73</text>
  <rect x="40" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
</svg>
<figcaption>Один квадрат это одна фраза. Фильтр смотрит на самую низкую уверенность в слове из SetWords(True) и переспрашивает, если она ниже 0,5. Vosk small 0.15, 150 записей с гарнитуры.</figcaption>
</figure>

На 150 фразах с гарнитуры с маленькой моделью фильтр с порогом 0,5 остановил 45 из 118 неверных расшифровок. Из 32 верных он остановил только 1. С порогом 0,7 он остановил 90 неверных, но и 5 верных. С микрофоном в комнате при 0,5 он остановил 66 из 139 неверных и 1 из 11 верных. При 0,5 мимо него всё ещё проходят 73 неверные расшифровки, но 45 неверных меньше ценой 1 потерянного верного вопроса это выгодный обмен для нескольких строк кода.

Второй дешёвый приём это зачитать расшифровку перед ответом. Ответ и так готовится около секунды. Если первым я слышу "is it son new", я перестаю слушать и спрашиваю заново.

В следующей версии пульт повторит услышанное и переспросит, если самая низкая уверенность ниже 0,5. Языковая модель пока остаётся GPT-2 medium.

## Чего я не проверял

- Свой голос и свой микрофон. В SLURP другие люди в других комнатах, а в комнате там стоит микрофонная решётка, не такой микрофон, как в моём ноутбуке.
- Звуковое устройство. Отсчёт заканчивается, когда `espeak-ng` записал звук в файл, воспроизведение в него не входит.
- Слово активации и автоматическое определение конца речи. Клавиша заменяет и то и другое.
- Качество ответов. GPT-2 medium не модель для ответов на вопросы. На верных расшифровках он тоже говорит странное. Я считал только, получил ли он тот вопрос, который задали.
- Повторные прогоны. Каждое число взято из одного прогона на общей машине. Второй прогон сдвинул отдельные замеры времени на величину до трети, а медианы меньше чем на 10%, расшифровки были те же.
- Как сравнивались слова. Регистр, пунктуацию и апострофы я не учитывал. 5 из 150 фраз начинаются с "olly", это имя ассистента в SLURP. Ни один распознаватель не записал его ни разу.
