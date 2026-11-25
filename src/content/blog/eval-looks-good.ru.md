---
title: "После 20 вопросов меньшая модель вела 6:2"
description: "Я сравнил Flan-T5 small и base на 2000 вопросов MMLU и разрезал их на блоки по 20. Слабая модель вела в 37 блоках из 100. Буквальное сравнение текста с ключом из-за точки сделало base почти вдвое хуже, чем small. Сколько вопросов нужно, чтобы увидеть разницу в 3 пункта и в 1,33 пункта."
date: 2023-01-28
lang: ru
translationKey: eval-looks-good
tags: ["llm", "statistics", "machine-learning"]
---

Я задал одни и те же 20 вопросов из MMLU двум моделям: Flan-T5 small на 80 миллионов параметров и Flan-T5 base на 250 миллионов. Small ответила верно на 6, base на 2. После первых 10 было 4:1. В статье, с которой эти модели вышли, у small на этом тесте 28,7%, у base 35,9%. То есть 20 ответов указали не на ту модель, причём довольно убедительно.

Я обычно так и выбираю между двумя моделями или двумя промптами. Открываю 10 или 20 ответов, читаю, выбираю вариант посимпатичнее и иду дальше. Как часто такой выбор ошибается, я ни разу не считал. Посчитать это легко, если ответов достаточно, так что я их собрал.

Математику до меня сделали другие. Диттерих ещё в 1998 году советовал для сравнения двух классификаторов тест Макнемара. Кард с соавторами в статье "With Little Power Comes Great Responsibility" (2020) пишут, что в NLP сплошь и рядом ставят эксперименты с недостаточной мощностью и что сама мощность зависит от того, как часто модели отвечают одинаково. Мне хотелось увидеть числа на своём случае.

## Что я запускал

В тестовой части MMLU 14 042 вопроса с 4 вариантами ответа. Родственные задачи авторы Flan из дообучения убрали, так что ни small, ни base на этом тесте не доучивали. Веса октября 2022 года, transformers 4.26.0, torch 1.13.1 на процессоре, жадное декодирование, не больше 6 новых токенов, промпт без примеров. Промпт 1 взят из репозитория MMLU, начинается с "The following are multiple choice questions (with answers) about" и заканчивается на "Answer:". Промпт 2 мой, в конце у него "Give the letter of the correct option."

В пробном запуске один вопрос по истории занял 657 токенов, а у меня стоял предел 512. Варианты ответа отрезало и small ответила `1: Of the Empire of Brazil,`. После этого я оставил только вопросы, у которых промпт укладывается в 256 токенов. Их 12 475, дальше выбирал случайно. Собирался взять 3000. На общей машине с 2 ядрами времени хватило на 2000 для обеих моделей и на 1500 для промпта 2.

Каждый ответ я читал тремя способами. Первый способ: `text == key`, эту строку я пишу всегда. Второй берёт из текста первую отдельно стоящую букву от A до D. Третий на текст не смотрит и выбирает наибольший из 4 логитов букв на первом шаге.

## Точка

До запуска я записал, что почти каждый ответ будет одной буквой и по форме о качестве ничего не узнать. Small дала голую букву в 1640 случаях из 2000, а base только в 795. Ещё 1179 ответов base были буквой с точкой, вроде `B.`

| как читаем ответ | small | base |
|---|---|---|
| `text == key` | 25,80% | 13,45% |
| первая буква в тексте | 30,65% | 33,75% |
| наибольший логит буквы | 31,05% | 34,05% |

По первой строке small почти вдвое лучше. По двум другим впереди base. Если на всё отвечать C, на этих вопросах выйдет 26,35%, то есть при точном сравнении обе модели проигрывают константе. С base я бы пошёл искать ошибку, в 13% поверить трудно. Насчёт small не уверен: 25,8% похоже на слабую модель, а слабую модель я и ждал.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Доля ответов по форме. small, промпт 1: одна буква 82,0%, буква с точкой 17,1%, что-то другое 0,9%; точность 25,80% при точном сравнении и 30,65%, если брать первую отдельную букву. base, промпт 1: одна буква 39,8%, буква с точкой 59,0%, что-то другое 1,3%; точность 13,45% при точном сравнении и 33,75%, если брать первую отдельную букву. base, промпт 2: одна буква 98,5%, буква с точкой 1,5%, что-то другое 0,1%; точность 34,07% при точном сравнении и 34,40%, если брать первую отдельную букву">
  <text x="562.0" y="18.0" text-anchor="end" class="f-label f-muted">текст == ключ</text>
  <text x="668.0" y="18.0" text-anchor="end" class="f-label f-muted">первая буква</text>
  <text x="150.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">small, промпт 1</text>
  <rect x="160.0" y="32.0" width="246.0" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="406.0" y="32.0" width="51.3" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="457.3" y="32.0" width="2.7" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">25,80%</text>
  <text x="668.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">30,65%</text>
  <text x="150.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, промпт 1</text>
  <rect x="160.0" y="76.0" width="119.3" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="279.3" y="76.0" width="176.8" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="456.1" y="76.0" width="3.9" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="94.0" text-anchor="end" class="f-mono f-accent" style="font-size:13px">13,45%</text>
  <text x="668.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">33,75%</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, промпт 2</text>
  <rect x="160.0" y="120.0" width="295.4" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="455.4" y="120.0" width="4.4" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="459.8" y="120.0" width="1.0" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34,07%</text>
  <text x="668.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34,40%</text>
  <rect x="160.0" y="172.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="178.0" y="182.0" text-anchor="start" class="f-label f-muted">одна буква</text>
  <rect x="269.0" y="172.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="287.0" y="182.0" text-anchor="start" class="f-label f-muted">буква с точкой</text>
  <rect x="404.8" y="172.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="422.8" y="182.0" text-anchor="start" class="f-label f-muted">что-то другое</text>
</svg>
<figcaption>Что написали модели: по 2000 ответов на первый промпт и 1500 на второй. Справа точность тех же ответов при 2 способах их читать.</figcaption>
</figure>

Промпт 2 точку почти убирает, она осталась в 22 ответах из 1500. На тех же 1500 вопросах `text == key` показал бы рост base с 13,33% до 34,07% и я бы рассказывал, какой удачный промпт нашёл. По логитам там 33,07% и 34,40%.

Дальше всё посчитано по логитам.

## 20 вопросов 100 раз

На всех 2000 вопросах у base 681 верный ответ, у small 621. Разница 3,0 процентного пункта, доверительный интервал 95% от 0,4 до 5,6, тест Макнемара даёт p = 0,027. В статье разрыв больше, 7,2 пункта, но там в промпте 5 примеров и берут весь тест.

Я разрезал 2000 вопросов на 100 блоков по 20 в том порядке, в каком они выпали. Base впереди в 53 блоках, 10 ничьих, small впереди в 37. Моё 6:2 из начала это просто первый блок. До запуска я записал, что хотя бы в 10 блоках из 100 будет ничья или победит не та модель. Вышло 47.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Гистограмма 100 блоков по 20 вопросов по разнице верных ответов, base минус small. -6: 1, -5: 2, -4: 4, -3: 6, -2: 12, -1: 12, 0: 10, +1: 14, +2: 15, +3: 9, +4: 5, +5: 5, +6: 5. Small впереди в 37 блоках, ничьих 10, base впереди в 53.">
  <line x1="50" y1="210.0" x2="660" y2="210.0" class="f-plain"/>
  <rect x="55.0" y="199.6" width="36.9" height="10.4" style="fill:var(--accent);stroke:none"/>
  <text x="73.5" y="194.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <text x="73.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-6</text>
  <rect x="101.9" y="189.3" width="36.9" height="20.8" style="fill:var(--accent);stroke:none"/>
  <text x="120.4" y="184.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="120.4" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-5</text>
  <rect x="148.8" y="168.5" width="36.9" height="41.5" style="fill:var(--accent);stroke:none"/>
  <text x="167.3" y="163.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4</text>
  <text x="167.3" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-4</text>
  <rect x="195.8" y="147.8" width="36.9" height="62.3" style="fill:var(--accent);stroke:none"/>
  <text x="214.2" y="142.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="214.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-3</text>
  <rect x="242.7" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="261.2" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="261.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-2</text>
  <rect x="289.6" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="308.1" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="308.1" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-1</text>
  <rect x="336.5" y="106.3" width="36.9" height="103.8" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="355.0" y="101.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">10</text>
  <text x="355.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <rect x="383.5" y="64.8" width="36.9" height="145.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="401.9" y="59.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">14</text>
  <text x="401.9" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+1</text>
  <rect x="430.4" y="54.4" width="36.9" height="155.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="448.8" y="49.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">15</text>
  <text x="448.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <rect x="477.3" y="116.6" width="36.9" height="93.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="495.8" y="111.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9</text>
  <text x="495.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+3</text>
  <rect x="524.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="542.7" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="542.7" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <rect x="571.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="589.6" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="589.6" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+5</text>
  <rect x="618.1" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="636.5" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="636.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted">блоков по 20 вопросов</text>
  <text x="355.0" y="246.0" text-anchor="middle" class="f-label f-muted">верных ответов, base минус small</text>
  <rect x="250.0" y="6.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="268.0" y="16.0" text-anchor="start" class="f-label f-muted">впереди small 37</text>
  <rect x="395.2" y="6.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="413.2" y="16.0" text-anchor="start" class="f-label f-muted">ничья 10</text>
  <rect x="486.8" y="6.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="504.8" y="16.0" text-anchor="start" class="f-label f-muted">впереди base 53</text>
</svg>
<figcaption>2000 вопросов, разрезанные на 100 блоков по 20. На всех вместе base впереди на 60 ответов.</figcaption>
</figure>

Для других размеров я выбирал вопросы из этих 2000 с возвращением, по 20 000 раз на каждый размер.

| вопросов | впереди base | ничья | впереди small | Макнемар p < 0,05 в пользу base |
|---|---|---|---|---|
| 10 | 45,1% | 21,6% | 33,3% | 0,2% |
| 20 | 51,7% | 14,6% | 33,7% | 1,4% |
| 50 | 59,8% | 8,6% | 31,6% | 3,4% |
| 100 | 66,2% | 5,7% | 28,1% | 5,3% |
| 500 | 86,1% | 1,7% | 12,2% | 18,6% |
| 1000 | 94,3% | 0,6% | 5,1% | 33,9% |
| 2000 | 98,7% | 0,1% | 1,1% | 59,6% |

Взять один знакомый предмет тоже не сильно помогло бы. В моей выборке 37 предметов, по которым набралось хотя бы 20 вопросов. В 15 из них small не отстаёт от base.

## Сколько нужно вопросов

Потом я искал размер, при котором тест находит разницу в 80% случаев.

| | Макнемар, те же вопросы | сравнение 2 долей, те же вопросы | сравнение 2 долей, разные вопросы |
|---|---|---|---|
| small и base, 3,0 пункта | 3100 | 3600 | 3800 |
| промпты 1 и 2 на base, 1,33 пункта | 5700 | 14 600 | 19 800 |

Я был уверен, что парное сравнение сократит число вопросов хотя бы вдвое. Обеим системам задают одно и то же и смотрят только туда, где одна ответила верно, а другая ошиблась, поэтому трудность самих вопросов уходит. Для двух моделей это сэкономило 18%. Верные ответы у них приходятся на разные вопросы. Только small права 324 раза, только base 384, обе 297, корреляция между двумя столбцами 0,195. При точности около 30% и 4 вариантах немалая часть верных ответов, думаю, просто угадана, а угадывает каждая модель своё.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="Как совпадают ответы 2 систем по вопросам. small и base, 2000 вопросов: обе верно 297, только первая 324, только вторая 384, обе мимо 995, для 80%: 3100 парно, 3800 на разных вопросах. base, промпты 1 и 2, 1500 вопросов: обе верно 411, только первая 85, только вторая 105, обе мимо 899, для 80%: 5700 парно, 19 800 на разных вопросах">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">small и base, 2000 вопросов</text>
  <rect x="20.5" y="28.0" width="94.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="67.5" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">297</text>
  <rect x="115.5" y="28.0" width="102.7" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="166.9" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">324</text>
  <rect x="219.2" y="28.0" width="121.9" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="280.2" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">384</text>
  <rect x="342.1" y="28.0" width="317.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="500.8" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">995</text>
  <text x="660.0" y="90.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">для 80%: 3100 парно, 3800 на разных вопросах</text>
  <text x="20.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">base, промпты 1 и 2, 1500 вопросов</text>
  <rect x="20.5" y="128.0" width="174.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="107.7" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">411</text>
  <rect x="195.9" y="128.0" width="35.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="213.5" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">85</text>
  <rect x="232.1" y="128.0" width="43.8" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="254.0" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">105</text>
  <rect x="276.9" y="128.0" width="382.6" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="468.2" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">899</text>
  <text x="660.0" y="190.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">для 80%: 5700 парно, 19 800 на разных вопросах</text>
  <rect x="20.0" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="38.0" y="222.0" text-anchor="start" class="f-label f-muted">верно только первая</text>
  <rect x="189.3" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="207.3" y="222.0" text-anchor="start" class="f-label f-muted">верно только вторая</text>
  <rect x="358.6" y="212.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="376.6" y="222.0" text-anchor="start" class="f-label f-muted">слева обе верно, справа обе мимо</text>
</svg>
<figcaption>Тест Макнемара смотрит только на 2 цветных куска в середине. Чем они тоньше, тем больше экономит парность.</figcaption>
</figure>

У двух промптов на одной модели корреляция 0,717. Вопросов, где прав только один из двух, всего 85 и 105. Парность тут экономит в 3,5 раза. Так что правило работает там, где мне оно нужнее всего, потому что промпты я меняю намного чаще моделей.

Сказать, что промпт 2 лучше, я всё равно не могу. 1,33 пункта, интервал от -0,47 до 3,13, p = 0,17. Ответы у него на вид чище. До этого замера мне бы такого хватило.

## Чего я не проверял

В последней таблице измеренная разница принята за настоящую, но взята она из тех же 2000 ответов и на деле может быть меньше. Если на самом деле между small и base 1 пункт, а интервал это допускает, вопросов понадобится примерно в 9 раз больше. Предел в 256 токенов ударил в основном по 4 предметам: на профессиональное право и 3 предмета по истории пришлось 1419 из 1567 выброшенных вопросов. Обе модели маленькие и недалеко ушли от угадывания. Пара поточнее может чаще совпадать и вопросов ей хватит меньше. Свободный текст, где лучший ответ выбирает человек, я тоже не трогал. Там свой шум добавляет судья, а сколько его, я не знаю. На 2000 вопросов у base здесь ушло 19 минут, значит, 3100 займут около получаса. Столько я подожду, но для своей задачи эти 3100 вопросов сначала придётся написать.
