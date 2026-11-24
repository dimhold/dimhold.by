---
title: "Одна точность и 72 разных ответа у 10 прогонов DistilBERT на RTE"
description: "Я дообучил DistilBERT на RTE 10 раз с умолчаниями run_glue.py из transformers 2.2.2, меняя только сид. Точность на dev разбросана от 56,7% до 63,2%, 2 прогона с одинаковыми 57,4% расходятся на 72 парах из 277, а сравнение 2 настроек по 1 прогону выбирает не ту 1 раз из 3. Тот же сид на другом числе потоков дал 59,9% вместо 57,4%."
date: 2019-12-21
lang: ru
translationKey: single-run-rte
tags: ["machine-learning", "statistics"]
---
В статье Девлина с коллегами про BERT есть фраза, которую я читал много раз и ни разу не принял на свой счёт. Авторы пишут, что дообучение большого BERT "иногда было нестабильным на маленьких датасетах". Поэтому они делали несколько случайных перезапусков и оставляли лучшую модель по dev. Между перезапусками менялись перемешивание данных и инициализация слоя классификатора.

Я читал это как проблему очень большой модели. Когда я что-то дообучаю, я запускаю `run_glue.py` один раз с сидом по умолчанию `--seed 42`, открываю `eval_results.txt` и беру число. Потом в октябре вышла статья Санха с коллегами про DistilBERT. Под её таблицей GLUE написано, что результаты BERT и DistilBERT это "медианы 5 прогонов с разными сидами". Выходит, 2 группы авторов одному прогону не доверяют, а я доверяю. Я решил посмотреть, насколько врёт 1 прогон на маленькой задаче, на моей собственной машине.

## Как мерил

Модель DistilBERT base uncased. Задача RTE из GLUE: 2490 пар предложений для обучения и 277 в dev, метка "entailment" или "not entailment". Цикл обучения я скопировал из `run_glue.py` в transformers 2.2.2 с его умолчаниями: скорость обучения 5e-5, батч 8, 3 эпохи, длина последовательности до 128, без warmup. Python 3.7, PyTorch 1.3.1, только CPU. В `run_glue.py` 1 сид задаёт всё случайное сразу: новую голову классификатора, порядок батчей и маски dropout. Мой цикл вдобавок считает точность на dev после каждой эпохи и обрезает паддинг в каждом батче. Поэтому случайные числа он тянет в другом порядке, чем `run_glue.py`. Мой сид 42 не равен их сиду 42.

На 4 ядрах AMD EPYC первая оценка вышла 100 минут на прогон. Я не сразу выяснил, что MKL внутри PyTorch 1.3.1 на процессорах AMD работает по медленной ветке кода. С `MKL_DEBUG_CPU_TYPE=5` скорость простого умножения матриц выросла с 67 до 202 GFLOPS. Это был 1 замер на занятой машине. На свободной 3 повтора дали около 90 против 330. После этого прогон занимал от 43 до 52 минут. Чтобы сэкономить время, я запускал по 2 прогона сразу. 3 прогона были убиты, скорее всего из-за памяти: 2 прогона примерно по 2,5 ГБ не помещались рядом со всем остальным на машине. Серию пришлось урезать с задуманных 16 сидов до 10. Она заняла всю ночь. Сиды 1, 2, 3 и 5 шли парами по 2 потока на каждый, остальные по одному на 4 потоках.

## Что дают 10 сидов

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Точность на dev у 10 прогонов дообучения DistilBERT на RTE, которые отличаются только сидом, после каждой из 3 эпох. после эпохи 1: 47,3, 47,3, 52,0, 52,7, 53,1, 53,4, 53,4, 55,2, 56,0, 58,1; после эпохи 2: 56,0, 57,4, 57,4, 58,5, 58,8, 58,8, 59,6, 59,9, 59,9, 61,0; после эпохи 3: 56,7, 57,4, 57,4, 59,2, 59,9, 60,6, 60,6, 60,6, 61,0, 63,2. Если всегда отвечать классом большинства, выходит 52,7%. В статье DistilBERT стоит 62,9% как медиана 5 прогонов.">
  <line x1="130.0" y1="26" x2="130.0" y2="200" class="f-plain"/>
  <text x="130.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">45</text>
  <line x1="262.5" y1="26" x2="262.5" y2="200" class="f-plain"/>
  <text x="262.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="395.0" y1="26" x2="395.0" y2="200" class="f-plain"/>
  <text x="395.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">55</text>
  <line x1="527.5" y1="26" x2="527.5" y2="200" class="f-plain"/>
  <text x="527.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="660.0" y1="26" x2="660.0" y2="200" class="f-plain"/>
  <text x="660.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">65</text>
  <text x="395" y="234" text-anchor="middle" class="f-label f-muted" style="font-size:11px">точность на dev, %</text>
  <line x1="334.3" y1="24" x2="334.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="334.3" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">класс большинства 52,7</text>
  <line x1="604.3" y1="24" x2="604.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="608.3" y="18.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">статья, медиана 5: 62,9</text>
  <text x="118" y="50" text-anchor="end" class="f-label f-muted" style="font-size:12px">после эпохи 1</text>
  <circle cx="315.2" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="343.9" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="334.3" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="401.1" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="477.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="184.7" y="68.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">47,3</text>
  <text x="483.7" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">58,1</text>
  <text x="118" y="112" text-anchor="end" class="f-label f-muted" style="font-size:12px">после эпохи 2</text>
  <circle cx="458.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="487.2" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="516.1" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="554.3" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="458.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="414.4" y="130.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56,0</text>
  <text x="560.3" y="130.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">61,0</text>
  <text x="118" y="174" text-anchor="end" class="f-label f-muted" style="font-size:12px">после эпохи 3</text>
  <circle cx="458.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="439.5" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="554.3" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="611.8" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="525.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="506.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="458.6" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="176.0" r="4" class="f-accent" style="stroke:none;"/>
  <text x="433.5" y="192.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56,7</text>
  <text x="617.8" y="192.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">63,2</text>
</svg>
<figcaption>10 сидов, настройки run_glue.py из transformers 2.2.2 по умолчанию, 277 пар в dev. Каждая точка это 1 прогон. После первой эпохи 2 прогона отвечают &quot;not entailment&quot; на каждую пару.</figcaption>
</figure>

После 3 эпох точность на dev разбросана от 56,7% до 63,2%. Это 157 верных пар против 175. Медиана 60,3%, стандартное отклонение 2,0 пункта. Только 5 из 10 прогонов попали в пределы 1 пункта от медианы. Если бы мой обычный одиночный прогон оказался таким, как сид 2, я бы записал 56,7% и поверил, что DistilBERT на RTE даёт 57.

Если взять лучший из 10 по dev и записать его число, выйдет 63,2%, на 2,9 пункта выше медианы. Авторы BERT публиковали результат на тестовой выборке с сервера GLUE, так что у них такой выбор честный. Я смотрю только на dev. У меня заметная часть этих 2,9 пункта взялась бы из самого выбора.

Я ожидал, что хотя бы один прогон схлопнется в 1 класс. В статье про STILTs из ноября 2018 года большой BERT перезапускали по 20 раз на каждой маленькой задаче GLUE, RTE в их числе. Некоторые из этих прогонов заканчивались на уровне случайного угадывания. После 3 эпох у меня такого не случилось. Доля ответов "entailment" во всех 10 прогонах осталась между 54,5% и 65,7%. Но на последних 100 шагах первой эпохи средний лосс на обучении у каждого прогона был ещё около 0,69. Это ln 2, лосс модели, которая отвечает 50 на 50. 2 прогона из 10 в этот момент ответили "not entailment" на все 277 пар и получили 47,3%. Сид 2 ушёл в другую сторону, "entailment" на 276 из 277. Остановись я тогда, я бы увидел что-то похожее на схлопывание из статьи.

## Одно число, разные модели

Сиды 1 и 7 закончили оба на 57,4%, по 159 верных пар. Я думал, что 2 прогона с одинаковой точностью это примерно одна и та же модель. Они расходятся на 72 парах из 277. Сиды 8, 9 и 10 все получили 60,65%. Любые 2 из них расходятся на 58 или 62 парах.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="277 пар dev в виде сетки. Пар, где все 10 прогонов отвечают верно: 83. Где все 10 ошибаются: 35. Зависят от сида: 159. Сиды 1 и 7 оба дают 57,4%, пары, где их ответы расходятся, отмечены точкой, их 72.">
  <rect x="74" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="112" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="359" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="397" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="587" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="188" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="245" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="150" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="321" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="519" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="530" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="283" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="492" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="568" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="128" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="443" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="454" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="511" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="82" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="93" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="321" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="435" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="568" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="131" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="207" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="302" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="530" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="212" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="92" y="222" class="f-label f-muted" style="font-size:11px">верно во всех 10: 83</text>
  <rect x="344" y="212" width="12" height="12" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="362" y="222" class="f-label f-muted" style="font-size:11px">зависит от сида: 159</text>
  <rect x="74" y="232" width="12" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="92" y="242" class="f-label f-muted" style="font-size:11px">ошибка во всех 10: 35</text>
  <circle cx="350" cy="238" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <text x="362" y="242" class="f-label f-muted" style="font-size:11px">сиды 1 и 7 расходятся: 72</text>
</svg>
<figcaption>Каждый квадрат это 1 пара из dev RTE, в порядке файла. Точка отмечает пару, на которой сид 1 и сид 7 отвечают по-разному, хотя у обоих прогонов 57,4%.</figcaption>
</figure>

На 83 пары все 10 прогонов отвечают верно, на 35 все 10 ошибаются. Остальные 159 пар, больше половины dev, зависят от сида.

## Сравнить 2 настройки по 1 прогону на каждую

После прогона я обычно спрашиваю одно: "моё изменение лучше?". Чтобы изменение ничего не стоило, я сравнил остановку после 2-й эпохи с полными 3 эпохами. По медианам третья эпоха добавляет 1,4 пункта. При одном и том же сиде она помогла в 7 прогонах, навредила в 1 и ничего не изменила в 2.

Но сравнивать свой прогон с чужим значит сравнивать разные сиды. То же и при сравнении старого прогона с новым после правки кода: изменённый код тянет случайные числа по-другому даже с сидом 42. Среди 90 пар разных сидов прогон с 3 эпохами впереди в 55, позади в 30 и вровень в 5. Получается, 1 прогон против 1 прогона показывает неверное направление 1 раз из 3 при разнице медиан в 1,4 пункта. Я принимал решения и при меньшей разнице.

Ещё я проверил, хватает ли самого по себе сида, чтобы повторить прогон. Сид 6 я прогнал второй раз с теми же настройками. Все ответы после каждой эпохи совпали, средний лосс тоже. Потом я ещё раз прогнал сид 1 на 4 потоках, а не на 2, как в первый раз. Голова классификатора стартовала с тех же весов, лосс после 1-й эпохи совпал до четвёртого знака, но 1 ответ на dev уже отличался. После 3 эпох этот прогон получил 59,9% вместо 57,4% и ответил иначе на 27 пар. Первый прогон сида 1 к тому же шёл параллельно с другим прогоном. Какое из 2 отличий повлияло, я не выяснял. На моей машине сид повторяет прогон только при тех же условиях. Другую машину я не пробовал.

Есть 1 источник шума, который новые сиды не убирают. На 277 парах 1 пара это 0,36 пункта. Биномиальная стандартная ошибка при 60% около 2,9 пункта, больше стандартного отклонения между моими сидами. Даже медиана многих прогонов на другой выборке из 277 пар могла бы сдвинуться на несколько пунктов.

## Чего я не проверял

Только 1 задача и 1 набор гиперпараметров. В таблице DistilBERT для RTE стоит 62,9 как медиана 5 прогонов. Любые 5 из моих 10 прогонов дают медиану от 57,4 до 60,65. Скорость обучения и размер батча для дообучения в статье не указаны. Моё число ниже. Почему, я не знаю. Сид головы классификатора и порядок батчей я не разделял. Оба менялись вместе, как в `run_glue.py`. Всё шло на CPU. GPU добавляет сверху собственный недетерминизм. И 10 прогонов всё ещё маленькая выборка для редкого хвоста вроде полного схлопывания.

Пока я поменял 1 привычку. Если на число после дообучения опирается решение, за ним стоят минимум 5 сидов. Рядом с медианой я пишу минимум и максимум.
