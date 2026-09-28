---
title: "Один вопрос к opus 5 дал 21 разный ответ за 64 вызова. Я пошёл искать, где начинается разница"
description: "Я списывал каждый разный ответ на температуру и ни разу это не проверил. На CPU без выборки Qwen2.5 0.5B во float32 давала те же токены при повторах, потоках и батчах. В bfloat16 батч из 8 поменял текст в 4 промптах из 8, один раз на первом токене, где у Sure и Certainly был в точности одинаковый логит. opus 5 через CLI дал 21 разное число на один арифметический вопрос за 64 вызова."
date: 2026-09-28
lang: ru
translationKey: llm-determinism
tags: ["llm", "numbers", "reliability"]
---
20 августа я зафиксировал в файле 6 задач и начал задавать `claude-opus-5` одни и те же вопросы через Claude Code CLI. Каждый ответ проверяет грейдер. Мне нужна была точка отсчёта для постов "модель на этой неделе сделали глупее", но файл первым делом показал разницу внутри одного захода. Одна из задач: MRR за 60 месяцев со сложным процентом, где темп роста меняется после 6-го месяца. Код считает 58937.5857. За 64 вызова с 20 августа по 12 сентября модель вернула 21 разное число. На остальных 5 задачах она давала один ответ на задачу. 1 вызов упал на лимите запросов.

Я всегда объяснял это себе температурой. В CLI её не задать, поэтому я ни разу не ставил её в 0 и считал, что при нуле ответ перестанет гулять. Ещё я читал "Defeating Nondeterminism in LLM Inference" Хораса Хе из Thinking Machines, сентябрь 2025. Там сказано, что даже при температуре 0 сервер отдаёт разный текст, потому что его вычислительные ядра (kernels) не инвариантны к размеру батча. А батч зависит от чужого трафика. В это я тоже поверил и тоже не проверял. Поэтому на этот раз я взял модель, в которой ничего не спрятано. В ней я стал искать место, где разница начинается.

## Выборка выключена, float32

Qwen2.5 0.5B Instruct, transformers 5.16.1 и torch 2.14.0 на 4 ядрах процессора AMD EPYC, жадное декодирование, то есть никакой выборки. Qwen кладёт в свой generation config штраф за повтор 1.1 и я оставил его включённым во всех прогонах. 8 промптов с длинными ответами, от хеш-таблиц до домашнего хлеба.

Во float32 не сдвинулось ничего. 5 повторов подряд дали те же логиты бит в бит. 1, 2 и 4 потока тоже дали те же биты, чего я не ожидал. Батч из 2, 4 или 8 менял логиты во всех 8 промптах, но только в пятом знаке после запятой. Токены совпали на всех 200 шагах, а во второй серии на всех 400.

Жадное декодирование берёт токен с наибольшей оценкой, значит для развилки зазор до второго токена должен быть меньше шума. Самый маленький зазор в 8 ответах длиной до 400 токенов был 0.000122, на промпте про сумму. В батче из 8 тот же шаг дал 0.000109. Батч ни разу не сдвинул зазор больше чем на 0.00004.

## bfloat16

Я загрузил те же веса в bfloat16. Повтор на батче 1 снова дал те же токены, то есть с самой собой модель по-прежнему детерминирована.

У bfloat16 8 бит точности и логит около 17 хранится с шагом 0.125. 2 токена могут получить в точности одинаковую оценку. Во float32 такого не было ни разу за 2782 шага, а в bfloat16 2 верхних токена сравнялись 38 раз за 2709 шагов. Промпт про хлеб начался с ничьей: у `Certainly` и `Sure` по 17.625, а во float32 у них было 17.693 и 17.598. Без батча прогон начался с "Sure! Here's a simple guide". В батче из 8 он начался с "Certainly! Making bread at home".

В простом прямом проходе батч сдвигал логиты первого шага не больше чем на 0.000047 во float32 и на 0.29 в bfloat16. Через `generate` в батче из 8 другим путём пошли 4 промпта из 8. float32 против bfloat16, оба на батче 1, разошлись в 7 промптах из 8. Промпт про сумму просит сложить числа от 1 до 250, делящиеся на 3 или 7, сумма равна 13482. Оба прогона вместо суммы выдали количество. Правильное количество, 107, получилось только у bfloat16, а float32 ошибся на кратных 21 и написал 106.

<figure class="fig">
<svg viewBox="0 0 640 310" role="img" aria-label="Сетка из 8 промптов на 6 условий для Qwen2.5 0.5B с жадным декодированием. Знак равенства значит, что токены совпали с эталонным прогоном, число это токен, на котором они впервые разошлись. В float32 во всех клетках знак равенства: повторы, 1, 2 и 4 потока, батчи 2, 4 и 8 на 200 токенах и батч 8 на 400 токенах. В bfloat16 повтор совпадает везде. Батч из 8 в bfloat16 расходится в 4 промптах: URL в браузере на токене 47, рассказ про маяк на токене 121, сложение float на токене 134, хлеб на токене 0. float32 и bfloat16 расходятся в 7 промптах из 8.">
  <text x="12" y="16" class="f-label f-muted">тот же промпт, выборка выключена: где токены расходятся</text>
  <text x="226" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="226" y="51" text-anchor="middle" class="f-label f-muted">повтор</text>
  <text x="226" y="64" text-anchor="middle" class="f-label f-muted">потоки</text>
  <text x="298" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="298" y="51" text-anchor="middle" class="f-label f-muted">батч</text>
  <text x="298" y="64" text-anchor="middle" class="f-label f-muted">2, 4, 8</text>
  <text x="370" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="370" y="51" text-anchor="middle" class="f-label f-muted">батч 8</text>
  <text x="442" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="442" y="51" text-anchor="middle" class="f-label f-muted">повтор</text>
  <text x="514" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="514" y="51" text-anchor="middle" class="f-label f-muted">батч 8</text>
  <text x="586" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="586" y="51" text-anchor="middle" class="f-label f-muted">против</text>
  <text x="586" y="64" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="12" y="91" class="f-mono f-ink">хеш-таблица</text>
  <rect x="194" y="76" width="64" height="20" class="f-plain"/>
  <text x="226" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="76" width="64" height="20" class="f-plain"/>
  <text x="298" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="76" width="64" height="20" class="f-plain"/>
  <text x="370" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="76" width="64" height="20" class="f-plain"/>
  <text x="442" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="76" width="64" height="20" class="f-plain"/>
  <text x="514" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="76" width="64" height="20" class="f-box"/>
  <text x="586" y="91" text-anchor="middle" class="f-mono f-ink">84</text>
  <text x="12" y="117" class="f-mono f-ink">URL в браузере</text>
  <rect x="194" y="102" width="64" height="20" class="f-plain"/>
  <text x="226" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="102" width="64" height="20" class="f-plain"/>
  <text x="298" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="102" width="64" height="20" class="f-plain"/>
  <text x="370" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="102" width="64" height="20" class="f-plain"/>
  <text x="442" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="102" width="64" height="20" class="f-box"/>
  <text x="514" y="117" text-anchor="middle" class="f-mono f-ink">47</text>
  <rect x="554" y="102" width="64" height="20" class="f-box"/>
  <text x="586" y="117" text-anchor="middle" class="f-mono f-ink">11</text>
  <text x="12" y="143" class="f-mono f-ink">когда кончатся деньги</text>
  <rect x="194" y="128" width="64" height="20" class="f-plain"/>
  <text x="226" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="128" width="64" height="20" class="f-plain"/>
  <text x="298" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="128" width="64" height="20" class="f-plain"/>
  <text x="370" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="128" width="64" height="20" class="f-plain"/>
  <text x="442" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="128" width="64" height="20" class="f-plain"/>
  <text x="514" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="128" width="64" height="20" class="f-plain"/>
  <text x="586" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <text x="12" y="169" class="f-mono f-ink">рассказ про маяк</text>
  <rect x="194" y="154" width="64" height="20" class="f-plain"/>
  <text x="226" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="154" width="64" height="20" class="f-plain"/>
  <text x="298" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="154" width="64" height="20" class="f-plain"/>
  <text x="370" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="154" width="64" height="20" class="f-plain"/>
  <text x="442" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="154" width="64" height="20" class="f-box"/>
  <text x="514" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <rect x="554" y="154" width="64" height="20" class="f-box"/>
  <text x="586" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <text x="12" y="195" class="f-mono f-ink">PostgreSQL или SQLite</text>
  <rect x="194" y="180" width="64" height="20" class="f-plain"/>
  <text x="226" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="180" width="64" height="20" class="f-plain"/>
  <text x="298" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="180" width="64" height="20" class="f-plain"/>
  <text x="370" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="180" width="64" height="20" class="f-plain"/>
  <text x="442" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="180" width="64" height="20" class="f-plain"/>
  <text x="514" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="180" width="64" height="20" class="f-box"/>
  <text x="586" y="195" text-anchor="middle" class="f-mono f-ink">22</text>
  <text x="12" y="221" class="f-mono f-ink">сумма, 3 или 7</text>
  <rect x="194" y="206" width="64" height="20" class="f-plain"/>
  <text x="226" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="206" width="64" height="20" class="f-plain"/>
  <text x="298" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="206" width="64" height="20" class="f-plain"/>
  <text x="370" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="206" width="64" height="20" class="f-plain"/>
  <text x="442" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="206" width="64" height="20" class="f-plain"/>
  <text x="514" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="206" width="64" height="20" class="f-box"/>
  <text x="586" y="221" text-anchor="middle" class="f-mono f-ink">219</text>
  <text x="12" y="247" class="f-mono f-ink">сложение float</text>
  <rect x="194" y="232" width="64" height="20" class="f-plain"/>
  <text x="226" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="232" width="64" height="20" class="f-plain"/>
  <text x="298" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="232" width="64" height="20" class="f-plain"/>
  <text x="370" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="232" width="64" height="20" class="f-plain"/>
  <text x="442" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="232" width="64" height="20" class="f-box"/>
  <text x="514" y="247" text-anchor="middle" class="f-mono f-ink">134</text>
  <rect x="554" y="232" width="64" height="20" class="f-box"/>
  <text x="586" y="247" text-anchor="middle" class="f-mono f-ink">144</text>
  <text x="12" y="273" class="f-mono f-ink">хлеб</text>
  <rect x="194" y="258" width="64" height="20" class="f-plain"/>
  <text x="226" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="258" width="64" height="20" class="f-plain"/>
  <text x="298" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="258" width="64" height="20" class="f-plain"/>
  <text x="370" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="258" width="64" height="20" class="f-plain"/>
  <text x="442" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="258" width="64" height="20" class="f-box"/>
  <text x="514" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="554" y="258" width="64" height="20" class="f-box"/>
  <text x="586" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="190" y="290" width="18" height="12" class="f-plain"/>
  <text x="214" y="300" class="f-label f-muted">токены совпали</text>
  <rect x="370" y="290" width="18" height="12" class="f-box"/>
  <text x="394" y="300" class="f-label f-muted">расходятся с этого токена</text>
</svg>
<figcaption>В столбцах 1 и 2 генерируется 200 новых токенов, в остальных 400. Номера токенов считаются с 0. Батч сдвигал логиты первого шага в обоих форматах: не больше чем на 0.000047 в float32 и на 0.29 в bfloat16. Другой текст из этого получился только в bfloat16.</figcaption>
</figure>

Тут я застрял. 2 из 4 развилок в батче случились там, где зазор между 2 верхними токенами был 1.375, далеко от любой ничьей. Я не понимал, как шум в 0.29 может такое перевернуть. Ответ лежал в моём же скрипте. Зазоры я брал из сырых логитов, а декодер выбирает после штрафа за повтор. Во float32 токен с наибольшим сырым логитом не совпадал с выбранным в 396 шагах из 2782. Я прогнал серию заново, теперь с зазором после штрафа. Токены вышли те же во всех 32 прогонах. На этих 2 шагах зазор после штрафа был 0.09 без батча, а в батче 0.034 и 0.023. Остальные 2 развилки были точными ничьими.

## Обратно к opus

Потом я 20 раз попросил `claude-opus-5` объяснить коллизии в хеш-таблице примерно в 150 словах. CLI 2.1.283, thinking выключен, без инструментов, пустой конфиг MCP, простой системный промпт и папка без единого `CLAUDE.md` выше по дереву. Я получил 20 разных текстов, все начинаются с "A hash table" и говорят про метод цепочек и открытую адресацию. В 132 парах из 190 у 2 текстов общее начало не длиннее 11 слов.

После локальных прогонов я читаю 21 ответ на арифметику как группы, а не как шум. Те вызовы шли через CLI от 2.1.237 до 2.1.269 с включённым thinking. Грейдер допускает относительную ошибку до 1e-6, это около 6 центов. В допуск попали 46 ответов из 64. 31 из них совпадает с верным значением до цента: 16 округлили до 58937.59, 15 отбросили хвост до 58937.58. Из 18 вне допуска 6 лежат около 58928.2, а 7 промахиваются меньше чем на 20 центов.

<figure class="fig">
<svg viewBox="0 0 640 375" role="img" aria-label="2 точечные диаграммы по 64 ответам opus 5 на один и тот же вопрос про MRR со сложными процентами, одна точка на вызов, закрашенные прошли грейдер. Сверху весь разброс от 58905 до 58940: большинство ответов стоит на 58937, вторая группа из 6 на 58928, одиночные ответы на 58907, 58931 и 58934. Снизу окно от 58937.1 до 58937.75 по центам: верное значение 58937.5857, грейдер принимает около 6 центов в обе стороны, 16 ответов равны 58937.59 и 15 равны 58937.58. Прошли 46 из 64.">
  <text x="12" y="16" class="f-label f-muted">opus 5, тот же вопрос про MRR, 64 вызова</text>
  <text x="12" y="40" class="f-label f-muted">все ответы</text>
  <rect x="75.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="80.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="411.0" y="111.6" width="10" height="6.4" class="f-plain"/>
  <text x="416.0" y="106.6" text-anchor="middle" class="f-mono f-ink">6</text>
  <rect x="459.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="464.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="507.0" y="115.9" width="10" height="2.1" class="f-plain"/>
  <text x="512.0" y="110.9" text-anchor="middle" class="f-mono f-ink">2</text>
  <rect x="555.0" y="60.0" width="10" height="58.0" class="f-plain"/>
  <rect x="555.0" y="68.6" width="10" height="49.4" class="f-box"/>
  <text x="560.0" y="55.0" text-anchor="middle" class="f-mono f-ink">54</text>
  <line x1="40" y1="120" x2="600" y2="120" class="f-line"/>
  <line x1="40" y1="120" x2="40" y2="125" class="f-line"/>
  <text x="40" y="138" text-anchor="middle" class="f-mono f-muted">58905</text>
  <line x1="120" y1="120" x2="120" y2="125" class="f-line"/>
  <text x="120" y="138" text-anchor="middle" class="f-mono f-muted">58910</text>
  <line x1="200" y1="120" x2="200" y2="125" class="f-line"/>
  <text x="200" y="138" text-anchor="middle" class="f-mono f-muted">58915</text>
  <line x1="280" y1="120" x2="280" y2="125" class="f-line"/>
  <text x="280" y="138" text-anchor="middle" class="f-mono f-muted">58920</text>
  <line x1="360" y1="120" x2="360" y2="125" class="f-line"/>
  <text x="360" y="138" text-anchor="middle" class="f-mono f-muted">58925</text>
  <line x1="440" y1="120" x2="440" y2="125" class="f-line"/>
  <text x="440" y="138" text-anchor="middle" class="f-mono f-muted">58930</text>
  <line x1="520" y1="120" x2="520" y2="125" class="f-line"/>
  <text x="520" y="138" text-anchor="middle" class="f-mono f-muted">58935</text>
  <line x1="600" y1="120" x2="600" y2="125" class="f-line"/>
  <text x="600" y="138" text-anchor="middle" class="f-mono f-muted">58940</text>
  <text x="12" y="168" class="f-label f-muted">группа у верного значения, по центам</text>
  <text x="458.5" y="186" text-anchor="middle" class="f-label f-ink">верное значение 58937.5857</text>
  <rect x="407.7" y="194" width="101.6" height="151" class="f-plain" stroke-dasharray="3 2"/>
  <text x="515.3" y="206" class="f-label f-muted">допуск грейдера</text>
  <line x1="458.5" y1="194" x2="458.5" y2="345" class="f-line"/>
  <circle cx="100.3" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="298.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="315.7" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="341.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="367.4" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="331.6" r="3.6" class="f-plain"/>
  <circle cx="436.3" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="444.9" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="230.2" r="3.6" class="f-box"/>
  <text x="446.5" y="234.0" text-anchor="end" class="f-mono f-ink">15</text>
  <circle cx="462.2" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="230.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="222.4" r="3.6" class="f-box"/>
  <text x="462.2" y="215.2" text-anchor="middle" class="f-mono f-ink">16</text>
  <circle cx="470.8" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="300.4" r="3.6" class="f-box"/>
  <text x="470.8" y="293.2" text-anchor="middle" class="f-mono f-ink">6</text>
  <circle cx="479.4" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="316.0" r="3.6" class="f-box"/>
  <text x="479.4" y="308.8" text-anchor="middle" class="f-mono f-ink">4</text>
  <circle cx="488.0" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="565.5" cy="339.4" r="3.6" class="f-plain"/>
  <line x1="40" y1="345" x2="600" y2="345" class="f-line"/>
  <line x1="126.15384615239958" y1="345" x2="126.15384615239958" y2="350" class="f-line"/>
  <text x="126.15384615239958" y="363" text-anchor="middle" class="f-mono f-muted">58937.2</text>
  <line x1="212.30769231106765" y1="345" x2="212.30769231106765" y2="350" class="f-line"/>
  <text x="212.30769231106765" y="363" text-anchor="middle" class="f-mono f-muted">58937.3</text>
  <line x1="298.4615384634672" y1="345" x2="298.4615384634672" y2="350" class="f-line"/>
  <text x="298.4615384634672" y="363" text-anchor="middle" class="f-mono f-muted">58937.4</text>
  <line x1="384.6153846158668" y1="345" x2="384.6153846158668" y2="350" class="f-line"/>
  <text x="384.6153846158668" y="363" text-anchor="middle" class="f-mono f-muted">58937.5</text>
  <line x1="470.76923076826637" y1="345" x2="470.76923076826637" y2="350" class="f-line"/>
  <text x="470.76923076826637" y="363" text-anchor="middle" class="f-mono f-muted">58937.6</text>
  <line x1="556.923076920666" y1="345" x2="556.923076920666" y2="350" class="f-line"/>
  <text x="556.923076920666" y="363" text-anchor="middle" class="f-mono f-muted">58937.7</text>
</svg>
<figcaption>Закрашенные точки прошли грейдер, относительная ошибка до 1e-6. С 20 августа по 12 сентября 2026 года, 64 вызова, 21 разное число.</figcaption>
</figure>

Разобрать модель в сервисе так, как я разобрал маленькую, я не могу. CLI берёт ту выборку, которая стоит у сервиса, поэтому выборка и батчинг попадают в одно число вместе со всем остальным, что происходит на сервере. Локальные прогоны показывают только то, чего хватает, чтобы текст поменялся при выключенной выборке: ничья в bfloat16 или соседи по батчу. Про арифметику у меня догадка: модель считает её в длинном скрытом рассуждении, от 691 до 6632 выходных токенов на вызов. Один рано разошедшийся шаг потянул бы за собой всё остальное. Ответы ложатся группами и это с догадкой сходится, но я её не проверял.

Для моих собственных инструментов вывод скромный. Грейдер и так сравнивает числа с допуском. Допуск я оставляю. Критик, который оценивает мои черновики, шумит так же. На одном черновике он 30 раз из 30 вынес один и тот же отрицательный вердикт. При этом он назвал 160 разных претензий и 114 из них прозвучали по одному разу.

## Чего я не проверял

- GPU. Все локальные прогоны шли на CPU, а вычислительные ядра, о которых пишет Thinking Machines, написаны для GPU. Юань с соавторами (arXiv 2506.09501) мерили, как влияют bf16 против fp32 и размер батча, на GPU с моделями на 7B. Мой результат с bfloat16 это тот же эффект точности на гораздо меньшей модели.
- Модели по API на большом числе вызовов. Атил с соавторами (arXiv 2408.04667) мерили этот разброс на 5 моделях.
- Температуру 0 у модели в сервисе. В CLI такой настройки нет.
- Почему батч в прямом проходе сохраняет ничью в промпте про хлеб на 17.625, а батч из 8 через `generate` разбивает её на 0.125. Самому длинному промпту паддинг не нужен и ведёт он себя так же. При прямом проходе батчем он совпадает бит в бит, а через `generate` расходится в пятом знаке.
- Какое вычисление даёт 58928.2. Это число вернулось 6 раз, так что это, скорее всего, устойчивый неверный путь, но шаг я не нашёл.
