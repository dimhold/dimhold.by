---
title: "Seed 42 дал 203 разных ответа за 800 прогонов одного скрипта"
description: "Один скрипт с заранее известным ответом, seed 42 и 4 версии Python 2012 года. Наивный вариант дал 203 разных ответа за 800 прогонов. После 3 правок он каждый раз даёт 0,0482, а правильный ответ в коде 0,03."
date: 2013-02-16
lang: ru
translationKey: reproducible-experiment
tags: ["statistics", "numbers", "dependencies"]
---

Python 2.7.3 выполнил `exp.py naive 42` и напечатал 0,0324. Я запустил ещё раз, снова 0,0324. Потом тот же файл с тем же seed выполнил Python 3.3.0 и вышло 0,0486, следующий запуск дал 0,0564, а ещё один 0,0260. (Python 3 печатает все знаки, я обрезал до 4.) Правильный ответ 0,03, он записан константой в начале файла.

Обычно я пишу `random.seed(42)` первой строкой и на этом считаю вопрос закрытым. Что именно эта строка обещает, я ни разу не проверял. Насколько полученное число далеко от истины, я тоже не знал, никакой истины в скрипте не было. Так что это мой первый эксперимент, где я попробовал получить и то и другое: прогон повторяется, а ответ известен заранее.

## Скрипт

Весь мир придуман в коде. Есть 400 пользователей с именами от `u000` до `u399`, кликабельность у них растёт с номером от 0,10 до 0,50. Случайная половина получает вариант B, который добавляет к кликабельности ровно 0,03. Каждому достаётся 25 показов. Скрипт считает разницу средних между половинами, дальше я называю её прибавкой.

В наивном варианте от порядка зависят 3 места. Список получается из `set` с именами, потом вызывается `random.shuffle`, а в конце `sum` складывает значения словаря. Эти места я менял по одному и каждый вариант запускал с seed 42 на 2.6.8, 2.7.3, 3.2.3 и 3.3.0. Все 4 вышли в 2012 году, собирал я их из исходников под 64-битный Linux. Одна клетка на первой картинке это 100 отдельных процессов.

Тут важны хеши строк. В декабре 2011 года Клинк и Вельде показали атаку на коллизиях, после неё Python научился подмешивать в хеш случайное число, своё для каждого процесса. Ключ `-R` включает это в первых 3 версиях, а в 3.3.0 оно включено сразу и выключается через `PYTHONHASHSEED=0`.

Пенг в 2011 году писал в Science, что вместе с результатом надо публиковать код и данные. А в документации Python 3.2 есть раздел "Notes on Reproducibility", который я до этого не открывал. Там гарантирована последовательность `random()` и сказано, что большинство остальных алгоритмов от версии к версии может меняться.

## Что держит seed

100 000 значений `random()` совпали во всех 4 версиях до последнего бита. С остальным так:

| после seed | 2.6.8 | 2.7.3 | 3.2.3 и 3.3.0 |
|---|---|---|---|
| 42, `random()` | 0,6394 | 0,6394 | 0,6394 |
| 42, `gauss(0, 1)` | -0,1441 | -0,1441 | -0,1441 |
| 42, `expovariate(1.0)` | 0,4472 | 1,0201 | 1,0201 |
| 42, `randint(1, 100)` | 64 | 64 | 82 |
| 42, `shuffle` чисел от 0 до 9, первые 3 | 9 7 8 | 9 7 8 | 7 3 2 |
| 4.2, `random()` | 0,6029 | 0,6029 | 0,9409 |
| "seed-42", `random()` | 0,3206 | 0,3206 | 0,4036 |

У `randint`, `choice`, `shuffle` и `sample` в 3.2 сменился алгоритм, об этом написано в What's New.

В последней строке есть ловушка. Текстовый seed в 2.6.8 и 2.7.3 проходит через `hash()`. С ключом `-R` я запустил 100 процессов с `random.seed("seed-42")` и получил 100 разных первых чисел. У 3.2.3 и 3.3.0 число одно. Зато кортеж в качестве seed и в 3.3.0 даёт 100 разных из 100.

## Чиню по одной строке

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Сетка: 4 варианта скрипта на 8 настройках Python, по 100 процессов в клетке. С list(set()) и фиксированными хешами ответы 0,0324, 0,0324, 0,0294 и 0,0338, со случайными хешами разных ответов 82, 81, 82 и 77. С sorted() Python 2 даёт 0,0482, Python 3 даёт 0,0388. Со своей перестановкой везде 0,0482, а вариантов последних цифр бывает до 14. С fsum везде одно точное значение.">
  <text x="262.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">фиксированные хеши</text>
  <text x="540.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">случайные хеши</text>
  <text x="161.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="228.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="295.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="362.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="439.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="506.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="573.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="640.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="0.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">list(set())</text>
  <rect x="130" y="52" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0324</text>
  <text x="161.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="52" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0324</text>
  <text x="228.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="52" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0294</text>
  <text x="295.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="52" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0338</text>
  <text x="362.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="52" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="439.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">99</text>
  <rect x="475" y="52" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">81</text>
  <text x="506.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <rect x="542" y="52" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="573.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">95</text>
  <rect x="609" y="52" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">77</text>
  <text x="640.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <text x="0.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">sorted()</text>
  <rect x="130" y="100" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="100" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="100" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="295.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="100" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="362.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="100" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="475" y="100" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="542" y="100" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="573.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="609" y="100" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0388</text>
  <text x="640.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="0.0" y="173.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">свой shuffle</text>
  <rect x="130" y="148" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="148" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="148" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="295.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="148" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="362.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="148" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="475" y="148" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="542" y="148" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="573.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="609" y="148" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="640.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="0.0" y="221.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">math.fsum()</text>
  <rect x="130" y="196" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="161.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="196" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="228.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="196" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="295.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="196" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="362.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="196" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="439.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="475" y="196" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="506.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="542" y="196" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="573.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="609" y="196" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0,0482</text>
  <text x="640.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
</svg>
<figcaption>Seed 42, по 100 процессов на клетку. Сверху ответ, а если их несколько, то сколько разных (акцентный цвет). Снизу сколько разных значений, если считать все двоичные знаки. Случайные хеши в первых 3 версиях включает ключ -R, в 3.3.0 они включены сразу. Фиксированная колонка 3.3.0 снята с PYTHONHASHSEED=0.</figcaption>
</figure>

Верхний ряд это наивный скрипт. За 800 прогонов он дал 203 разных ответа, от 0,0066 до 0,0798. (Ответ всегда кратен 0,0002.) Пока хеши фиксированы (это половина прогонов) и я сижу на одной версии, всё выглядит идеально.

До прогона я записал ожидание: `sorted()` вместо `list(set())` уберёт случайные хеши, а заодно и разницу между версиями, хотя во втором сомневаюсь. Сомневался не зря. Python 2 даёт 0,0482, а Python 3 даёт 0,0388, дело в новом `shuffle`. Своя перестановка на одном `random()` занимает 3 строки и даёт 0,0482 везде. Есть и короткий путь: `random.shuffle(users, random.random)` в 3.2 и 3.3 до сих пор идёт по старой ветке.

Но это всё ещё не одно и то же число. Порядок в словаре меняет порядок сложения, поэтому в 800 прогонах 15 разных значений, самая большая разница 7,8e-16. В 2.7.3 я бы этого не увидел. Там у `sorted` с `-R` на 100 прогонов 13 разных значений, а `print` показывает 12 знаков и обрезает их все до 0,0482. После `math.fsum` на 800 прогонов осталось одно значение.

Если вместо имён взять номера, у наивного скрипта случайного порядка не остаётся совсем. А 3.3.0 с `PYTHONHASHSEED=0` даёт 0,0338 там, где у 3.2.3 выходит 0,0294. Множество из этих 400 имён обе версии обходят в одном порядке, а словарь в разном. Почему, я не разбирался.

## 0,0482 стоит на месте

Теперь скрипт повторяется, но на самом деле 0,03. Я прогнал его с 1000 seed, от 0 до 999. Стандартное отклонение 0,0148, это половина самой прибавки. 216 seed промахиваются не меньше, чем 42 (само 42 тоже в счёте), а по 24 выходит, что B хуже A.

Я ждал, что наивный скрипт с seed 42 на 1000 значений `PYTHONHASHSEED` разбросает ответы так же, будто это ещё один seed, который я забыл записать. Нет. Среднее 0,0424, отклонение 0,0116, отрицательных значений нет вообще. Случайные числа для кликов заданы числом 42, меняются местами только пользователи. Я посчитал, какую прибавку дают одни эти числа, если любой пользователь может оказаться на любом месте, вышло 0,0427. Для seed от 1 до 5, по 200 значений `PYTHONHASHSEED` на каждый, центры лежат от 0,0244 до 0,0362. Если такие прогоны усреднить, получился бы узкий интервал вокруг неверного числа.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Две гистограммы измеренной прибавки по 1000 прогонов. Наивный скрипт с seed 42 и 1000 разных PYTHONHASHSEED: среднее 0,0424, отрицательных нет. Исправленный скрипт с 1000 разных seed: среднее 0,0299, разброс шире, от -0,0186 до 0,0832. Настоящая прибавка 0,03, ответ исправленного скрипта при seed 42 равен 0,0482.">
  <line x1="50" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="42.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="190.6" x2="660" y2="190.6" class="f-plain"/>
  <text x="42.0" y="194.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="141.1" x2="660" y2="141.1" class="f-plain"/>
  <text x="42.0" y="145.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="91.7" x2="660" y2="91.7" class="f-plain"/>
  <text x="42.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <rect x="178.1" y="238.0" width="23.4" height="2.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="203.5" y="232.1" width="23.4" height="7.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="228.9" y="220.2" width="23.4" height="19.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="254.3" y="204.4" width="23.4" height="35.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="279.8" y="167.8" width="23.4" height="72.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="305.2" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="330.6" y="80.8" width="23.4" height="159.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.0" y="93.6" width="23.4" height="146.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="381.4" y="84.7" width="23.4" height="155.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="406.8" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="432.2" y="162.9" width="23.4" height="77.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="457.7" y="201.4" width="23.4" height="38.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="483.1" y="222.2" width="23.4" height="17.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="508.5" y="236.0" width="23.4" height="4.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="533.9" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="584.7" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <polyline points="50.0,239.0 75.4,239.0 75.4,240.0 100.8,240.0 100.8,231.1 126.2,231.1 126.3,226.2 151.7,226.2 151.7,213.3 177.1,213.3 177.1,205.4 202.5,205.4 202.5,167.8 227.9,167.8 227.9,164.8 253.3,164.8 253.3,120.3 278.7,120.3 278.8,95.6 304.2,95.6 304.2,117.4 329.6,117.4 329.6,121.3 355.0,121.3 355.0,148.0 380.4,148.0 380.4,158.9 405.8,158.9 405.8,201.4 431.3,201.4 431.2,227.1 456.7,227.1 456.7,220.2 482.1,220.2 482.1,235.1 507.5,235.1 507.5,240.0 532.9,240.0 532.9,239.0 558.3,239.0 558.3,239.0 583.7,239.0 583.7,240.0 609.2,240.0 609.2,240.0 634.6,240.0 634.6,240.0 660.0,240.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <line x1="304.2" y1="48" x2="304.2" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="298.2" y="56.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">на самом деле 0,03</text>
  <line x1="396.7" y1="48" x2="396.7" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="402.7" y="56.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">seed 42: 0,0482</text>
  <text x="50.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-0,02</text>
  <text x="151.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,00</text>
  <text x="253.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,02</text>
  <text x="355.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,04</text>
  <text x="456.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,06</text>
  <text x="558.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,08</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,10</text>
  <rect x="50" y="10" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="70.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">seed 42, 1000 PYTHONHASHSEED</text>
  <line x1="350" y1="16" x2="364" y2="16" style="stroke:var(--ink);stroke-width:1.5"/>
  <text x="372.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">исправленный, 1000 seed</text>
  <text x="0.0" y="56.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">прогонов</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">измеренная прибавка</text>
</svg>
<figcaption>По 1000 прогонов, шаг 0,005. Столбцы: seed 42 во всех прогонах, меняется только PYTHONHASHSEED. Линия: исправленный скрипт, seed от 0 до 999.</figcaption>
</figure>

## Проверяю свою перестановку известным ответом

Перестановка теперь моя и ошибки в ней тоже мои. Я нарочно внёс 2 известные. В первой элемент на каждом шаге меняется местами с любой позицией списка. При seed 42 такая перестановка даёт 0,0556 на всех 8 настройках, по 20 процессов на каждой, всё совпадает до бита. Средняя прибавка по 4000 seed 0,0418. Из имён первой половины в ней остаётся 52,3%, поэтому в B собираются те, кто кликает чаще. Ещё до всяких кликов средняя кликабельность в B выше на 0,0116.

По одному прогону этого не увидеть, по 10 seed тоже, там среднее 0,0331. На 30 seed уже 0,0434, это 4,1 стандартной ошибки от 0,03.

Вторая ошибка это `i` вместо `i + 1`, с ней ни один элемент не может остаться на месте. Среднее 0,0294, на 2,5 стандартной ошибки ниже истины. После прогона я посчитал на бумаге, должно быть 0,0295. Значит, ошибка настоящая, но 4000 seed её еле видят. У правильной перестановки 0,0299 при стандартной ошибке 0,0002.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Средняя прибавка по 10, 30, 100, 300, 1000 и 4000 seed с отрезками в 2 стандартные ошибки для 3 перестановок. Правильная сходится к 0,03 и заканчивает на 0,0299. Обмен с любой позицией заканчивает на 0,0418. Ошибка на единицу заканчивает на 0,0294, почти там же, где правильная.">
  <line x1="60" y1="250.0" x2="660" y2="250.0" class="f-plain"/>
  <text x="52.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,02</text>
  <line x1="60" y1="191.1" x2="660" y2="191.1" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="52.0" y="195.1" text-anchor="end" class="f-mono f-accent" style="font-size:11px">0,03</text>
  <line x1="60" y1="132.3" x2="660" y2="132.3" class="f-plain"/>
  <text x="52.0" y="136.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,04</text>
  <line x1="60" y1="73.4" x2="660" y2="73.4" class="f-plain"/>
  <text x="52.0" y="77.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,05</text>
  <line x1="96.0" y1="107.8" x2="96.0" y2="231.4" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="96.0" cy="169.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="110.0" y1="125.5" x2="110.0" y2="220.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="110.0" cy="173.1" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="124.0" y1="120.3" x2="124.0" y2="232.8" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="124.0" cy="176.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="110.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="196.0" y1="129.2" x2="196.0" y2="192.6" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="196.0" cy="160.9" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="210.0" y1="73.9" x2="210.0" y2="151.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="210.0" cy="112.4" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="224.0" y1="139.4" x2="224.0" y2="203.4" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="224.0" cy="171.4" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="210.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="296.0" y1="169.5" x2="296.0" y2="202.0" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="296.0" cy="185.7" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="310.0" y1="92.4" x2="310.0" y2="128.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="310.0" cy="110.2" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="324.0" y1="173.9" x2="324.0" y2="207.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="324.0" cy="190.8" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="396.0" y1="178.9" x2="396.0" y2="198.2" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="396.0" cy="188.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="410.0" y1="111.4" x2="410.0" y2="132.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="410.0" cy="121.7" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="424.0" y1="186.3" x2="424.0" y2="205.0" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="424.0" cy="195.7" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="410.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="496.0" y1="186.1" x2="496.0" y2="197.1" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="496.0" cy="191.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="510.0" y1="116.0" x2="510.0" y2="127.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="510.0" cy="121.5" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="524.0" y1="187.8" x2="524.0" y2="198.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="524.0" cy="193.3" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="510.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="596.0" y1="189.2" x2="596.0" y2="194.7" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="596.0" cy="192.0" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="610.0" y1="119.2" x2="610.0" y2="124.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="610.0" cy="122.0" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="624.0" y1="191.8" x2="624.0" y2="197.2" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="624.0" cy="194.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="610.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <circle cx="65" cy="16" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="76.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">правильная</text>
  <circle cx="177" cy="16" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="188.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">обмен с любой позицией</text>
  <circle cx="371" cy="16" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="382.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">ошибка на единицу</text>
  <text x="660.0" y="288.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">сколько seed</text>
</svg>
<figcaption>Среднее по первым n seed, отрезки в 2 стандартные ошибки. Горизонталь на 0,03 это настоящая прибавка. Ошибка на единицу даёт 0,0294 и в этом масштабе стоит рядом с правильной перестановкой.</figcaption>
</figure>

Константу с ответом и цикл по seed я оставлю, здесь это 2 строки. Seed буду брать целый. Ещё буду печатать через `repr` и рядом с числом записывать версию Python.

## Чего я не проверял

У NumPy свой генератор, его я не трогал. Все сборки под 64-битный Linux, на 32 битах порядок множества может быть другим. Функции в таблице, кроме `random()`, сравнены только по первым значениям одного seed. Прибавка выбрана примерно в 2 стандартных отклонения одного прогона, с большей seed значил бы меньше.
