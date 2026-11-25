---
title: "Параллельный стрим вызвал мою функцию 1 999 871 раз, чтобы сложить 1 000 000 чисел"
description: "Я сложил миллион чисел из 8 источников на JDK 8u5 и 2 ядрах, с parallel() и без него. Stream.iterate посчитал впустую почти миллион элементов, а часть моей таблицы развалилась около 5000-го вызова, когда C2 перекомпилировал код."
date: 2014-06-08
lang: ru
translationKey: parallel-stream-slower
tags: ["performance", "algorithms"]
---

```java
LongAdder calls = new LongAdder();
long sum = Stream.iterate(1L, x -> { calls.increment(); return x + 1; })
    .limit(1_000_000)
    .parallel()
    .mapToLong(Long::longValue)
    .sum();
```

Сумма 500000500000, это верно. В счётчике 1 999 871. Без `.parallel()` в нём 999 999, как и должно быть: первое число задано, остальные делает функция. На 2 потоках получился почти миллион лишних вызовов. Я повторил это 30 раз в одной JVM и в 26 из них число совпало до последней цифры.

До сих пор я считал, что `parallel()` можно попробовать без всякого риска. Подходит стриму, значит станет быстрее, не подходит, значит потеряю несколько микросекунд на запуск задач. Ещё я думал, что всё решает длина коллекции. Ничего из этого я ни разу не измерял. Java 8 вышла в марте, так что времени прошло мало, но привычка уже есть.

Советы на этот счёт есть. Ричард Уорбертон в книге "Java 8 Lambdas" относит массивы и ArrayList к хорошим источникам, HashSet и TreeSet к терпимым, LinkedList и iterate к плохим. Лукаш Крецан в марте показал, как запустить параллельный стрим в собственном пуле. Мне хотелось увидеть, сколько за этими словами миллисекунд.

## На чём мерил

JDK 1.8.0_05, JMH 0.8, виртуальная машина, на которой работают и другие процессы. Запуски JMH я привязал к 2 ядрам через `taskset` и сразу споткнулся: даже под `taskset -c 0` этот JDK видит 4 ядра и делает общий пул на 3 потока. Пришлось задать параллелизм общего пула руками, единицу. Вызывающий поток тоже работает, вместе выходит 2. Счётчики и вызовы sleep из конца статьи шли без привязки.

Из-за соседей времена шумят, поэтому все бенчмарки я прогнал дважды: в первый раз по 2 форка, во второй по 3 или 4. В таблице медианы по всем итерациям. Я решил верить разнице, только если она видна в обоих прогонах. Ожидания записал до первого замера времени.

## Один и тот же миллион из 8 источников

Надо сложить числа от 1 до 1 000 000. Времена из прогона 1. Отношение больше единицы значит, что с `parallel()` стало медленнее.

| источник | последовательно, мс | параллельно, мс | отношение, прогон 1 | отношение, прогон 2 |
|---|---|---|---|---|
| TreeSet | 22,81 | 14,67 | 0,64 | 0,51 |
| LongStream.rangeClosed | 2,76 | 1,92 | 0,69 | 0,74 |
| long[] | 2,35 | 2,20 | 0,94 | 1,32 |
| HashSet | 10,71 | 10,46 | 0,98 | 0,49 |
| LinkedList | 3,28 | 6,88 | 2,10 | 1,91 |
| ArrayList | 1,36 | 3,56 | 2,62 | 2,66 |
| Stream.iterate | 5,90 | 16,76 | 2,84 | 2,76 |
| LongStream.iterate | 1,56 | 12,29 | 7,88 | 6,34 |

iterate и LinkedList я ждал внизу таблицы, там они и оказались. TreeSet у меня был записан как спорный, а он выиграл оба раза. По long[] и HashSet мои 2 прогона друг с другом не согласны. ArrayList должен был окупиться, режется он идеально, я проверил: 4 куска по 250 000. И в обоих прогонах проиграл. По моему правилу это результат, я его уже так и записал.

Потом я посмотрел на столбец с последовательным временем. Список из объектов Long складывается быстрее, чем простой long[]. Это показалось странным, поэтому от медиан я перешёл к отдельным итерациям.

## Быстро примерно до 5000 вызовов

Во всех 4 форках прогона 2 первая измеренная итерация последовательного long[] занимает от 0,35 до 0,37 мс, а последняя от 2,2 до 2,3. Несколько источников я прогнал подольше и без прогрева.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Время одной последовательной суммы миллиона элементов в зависимости от числа уже сделанных вызовов, 4 источника, вертикальная ось логарифмическая. long[] переходит с 0,34 примерно на 2,2 мс после 4200 вызовов, LongStream.iterate с 1,5 на 5,3 мс и LinkedList с 2,9 на 3,9 мс около 5000 вызовов. ArrayList в одном запуске JVM переходит с 1,2 на 5,0 мс, а в другом держится на 1,2 мс все 10 000 вызовов.">
  <line x1="152" y1="233.7" x2="600" y2="233.7" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="237.7" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0,5</text>
  <line x1="152" y1="184.4" x2="600" y2="184.4" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="188.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="152" y1="135.1" x2="600" y2="135.1" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="139.1" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="152" y1="69.9" x2="600" y2="69.9" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="73.9" text-anchor="start" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="152.0" y1="270" x2="152.0" y2="275" class="f-plain"/>
  <text x="152.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="237.3" y1="270" x2="237.3" y2="275" class="f-plain"/>
  <text x="237.3" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <line x1="322.7" y1="270" x2="322.7" y2="275" class="f-plain"/>
  <text x="322.7" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <line x1="408.0" y1="270" x2="408.0" y2="275" class="f-plain"/>
  <text x="408.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6000</text>
  <line x1="493.3" y1="270" x2="493.3" y2="275" class="f-plain"/>
  <text x="493.3" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8000</text>
  <line x1="578.7" y1="270" x2="578.7" y2="275" class="f-plain"/>
  <text x="578.7" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 000</text>
  <line x1="365.3" y1="34" x2="365.3" y2="270" class="f-line" style="stroke-dasharray:4 4"/>
  <text x="365.3" y="28.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Tier4InvocationThreshold = 5000</text>
  <polyline points="158.6,101.2 172.4,106.1 186.8,108.8 201.5,107.7 215.8,106.6 230.3,108.0 244.8,106.9 259.3,108.7 273.2,100.1 287.0,108.0 301.6,108.4 316.3,108.4 330.8,107.0 345.3,108.5 359.9,108.0 372.5,85.9 383.5,89.1 394.5,86.5 405.4,88.6 416.2,85.2 427.0,87.1 438.1,90.9 449.1,84.4 459.8,87.3" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="158.6" cy="101.2" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="172.4" cy="106.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="186.8" cy="108.8" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="201.5" cy="107.7" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="215.8" cy="106.6" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="230.3" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="244.8" cy="106.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="259.3" cy="108.7" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="273.2" cy="100.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="287.0" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="301.6" cy="108.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="316.3" cy="108.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="330.8" cy="107.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="345.3" cy="108.5" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="359.9" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="372.5" cy="85.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="383.5" cy="89.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="394.5" cy="86.5" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="405.4" cy="88.6" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="416.2" cy="85.2" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="427.0" cy="87.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="438.1" cy="90.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="449.1" cy="84.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="459.8" cy="87.3" r="2.6" style="fill:var(--muted);stroke:none"/>
  <text x="146.0" y="105.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">LinkedList</text>
  <polyline points="165.6,152.4 193.3,154.9 221.8,156.6 250.5,155.7 277.6,147.8 304.9,157.3 333.0,152.0 357.7,138.4 372.9,65.4 380.9,65.2 388.7,61.2 396.5,66.2 404.5,65.2 412.7,67.4" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="165.6" cy="152.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="193.3" cy="154.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="221.8" cy="156.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="250.5" cy="155.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="277.6" cy="147.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="304.9" cy="157.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="333.0" cy="152.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="357.7" cy="138.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.9" cy="65.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="380.9" cy="65.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="388.7" cy="61.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="396.5" cy="66.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="404.5" cy="65.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="412.7" cy="67.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <text x="146.0" y="156.4" text-anchor="end" class="f-mono f-ink" style="font-size:11px">LongStream.iterate</text>
  <polyline points="169.8,171.4 206.1,174.5 242.3,170.7 277.4,170.2 313.2,173.6 349.5,172.3 385.5,172.4 423.5,179.6 462.1,175.0 501.1,180.9 539.9,174.2 576.6,173.0" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="169.8" cy="171.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="206.1" cy="174.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="242.3" cy="170.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="277.4" cy="170.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="313.2" cy="173.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="349.5" cy="172.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="385.5" cy="172.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="423.5" cy="179.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="462.1" cy="175.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="501.1" cy="180.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="539.9" cy="174.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.6" cy="173.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <text x="146.0" y="175.4" text-anchor="end" class="f-mono f-ink" style="font-size:11px">ArrayList</text>
  <polyline points="169.2,169.2 199.7,150.1 229.2,165.7 264.0,173.8 300.8,174.0 337.1,171.9 364.8,128.4 378.6,67.2 386.9,69.7 395.4,69.4 403.6,65.4 411.9,69.5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="169.2" cy="169.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="199.7" cy="150.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="229.2" cy="165.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="264.0" cy="173.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="300.8" cy="174.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="337.1" cy="171.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="364.8" cy="128.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="378.6" cy="67.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="386.9" cy="69.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="395.4" cy="69.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="403.6" cy="65.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="411.9" cy="69.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <polyline points="168.7,252.7 201.2,248.6 235.7,260.5 273.0,260.5 310.0,259.2 331.9,142.6 338.2,124.5 343.9,128.4 349.8,129.0 355.8,132.4 361.8,128.9 367.8,132.8" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="168.7" cy="252.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="201.2" cy="248.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="235.7" cy="260.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="273.0" cy="260.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="310.0" cy="259.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="331.9" cy="142.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="338.2" cy="124.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="343.9" cy="128.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="349.8" cy="129.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="355.8" cy="132.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="361.8" cy="128.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="367.8" cy="132.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <text x="146.0" y="256.7" text-anchor="end" class="f-mono f-ink" style="font-size:11px">long[]</text>
  <text x="670.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">мс на одну сумму</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">вызовов сделано</text>
</svg>
<figcaption>Последовательная сумма миллиона, одна точка на итерацию, без прогрева. Акцентный цвет: ArrayList, 2 запуска JVM. Вызовы между итерациями на оси не учтены.</figcaption>
</figure>

Последовательному long[] хватает 0,34 мс, примерно после 4200 вызовов ему нужно уже 2,2 и обратно он при мне не вернулся. LongStream.iterate переходит с 1,5 на 5,3, LinkedList с 2,9 на 3,9, диапазон с 0,39 на 2,4. ArrayList в одном запуске JVM продержался на 1,2 все 10 000 вызовов, а в другом поднялся до 5,0.

`Tier4InvocationThreshold` в этой JVM равен 5000. С `-XX:+PrintCompilation` видно, что скачок у long[] совпадает с моментом, когда C2 компилирует `SrcBench::seq` и `Spliterator$OfLong::forEachRemaining`, то есть методы вокруг цикла. Сам цикл был скомпилирован отдельно и намного раньше. Почему новый код в несколько раз медленнее, не знаю, ассемблер я не смотрел.

Параллельная сумма по ArrayList тоже прыгает, с 1,3 на 4,1 мс, но уже примерно после 1150 вызовов. В каждом вызове 4 куска, поэтому, думаю, методы вокруг цикла просто раньше набирают свои 5000. Моя таблица сравнивает параллельный ArrayList после скачка с последовательным до него. Если взять оба до скачка, выходит 1,3 против 1,2, почти ничья. Один параллельный форк из 6 дал 0,75, этого я объяснить не могу.

С диапазоном всё наоборот. Свои 0,69 он выиграл у последовательного кода после скачка. До скачка последовательная сумма занимает 0,39, а лучшая моя параллельная итерация 0,64. Правило двух прогонов меня не спасло, прогрев был 3,5 секунды в одном и 1,2 в другом.

LinkedList и LongStream.iterate проигрывают по обе стороны скачка, их 6,88 и 12,29 мс больше обоих последовательных чисел. У TreeSet 5000 вызовов это около 2 минут, столько я не ждал.

## Как режется источник

Я обернул сплитераторы и записал, какие куски получаются. HashSet дал 4 куска, из них 2 пустых: хеш небольшого Long это само число, поэтому миллион чисел подряд занимает только нижнюю половину таблицы.

По LinkedList можно только идти. Его `trySplit` копирует элементы в массив, сначала 1024, потом 2048, потом 3072 и так далее. Вышло 38 таких порций и остаток в 241 216 элементов. Пока копируется очередная порция, второму потоку доступно только то, что отрезано раньше.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Куски миллиона элементов в одном масштабе. ArrayList: 4 равных куска по 250 000. HashSet: 524 287 и 475 713 и ещё 2 пустых куска. LinkedList: 38 порций от 1024 до 38 912 и остаток 241 216. Stream.iterate: 62 порции от 1024 до 63 488, вместе 1 999 872, всё после первого миллиона не нужно.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">ArrayList</text>
  <rect x="20.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="100.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="180.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="260.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="43.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">4 × 250 000</text>
  <text x="20.0" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">HashSet</text>
  <rect x="20.00" y="90.0" width="167.77" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="187.77" y="90.0" width="152.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="105.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">ещё 2 куска пустые</text>
  <text x="20.0" y="144.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">LinkedList</text>
  <rect x="20.00" y="152.0" width="0.33" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="20.33" y="152.0" width="0.66" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="20.98" y="152.0" width="0.98" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="21.97" y="152.0" width="1.31" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="23.28" y="152.0" width="1.64" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="24.92" y="152.0" width="1.97" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="26.88" y="152.0" width="2.29" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="29.18" y="152.0" width="2.62" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="31.80" y="152.0" width="2.95" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="34.75" y="152.0" width="3.28" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="38.02" y="152.0" width="3.60" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="41.63" y="152.0" width="3.93" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="45.56" y="152.0" width="4.26" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="49.82" y="152.0" width="4.59" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="54.41" y="152.0" width="4.92" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="59.32" y="152.0" width="5.24" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="64.56" y="152.0" width="5.57" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="70.14" y="152.0" width="5.90" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="76.03" y="152.0" width="6.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="82.26" y="152.0" width="6.55" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="88.81" y="152.0" width="6.88" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="95.69" y="152.0" width="7.21" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="102.90" y="152.0" width="7.54" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="110.44" y="152.0" width="7.86" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="118.30" y="152.0" width="8.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="126.50" y="152.0" width="8.52" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="135.02" y="152.0" width="8.85" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="143.86" y="152.0" width="9.18" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="153.04" y="152.0" width="9.50" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="162.54" y="152.0" width="9.83" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="172.37" y="152.0" width="10.16" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="182.53" y="152.0" width="10.49" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="193.02" y="152.0" width="10.81" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="203.83" y="152.0" width="11.14" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="214.97" y="152.0" width="11.47" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="226.44" y="152.0" width="11.80" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="238.23" y="152.0" width="12.12" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="250.36" y="152.0" width="12.45" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="262.81" y="152.0" width="77.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <text x="352.0" y="167.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">остаток 241 216</text>
  <text x="20.0" y="206.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">Stream.iterate</text>
  <rect x="20.00" y="214.0" width="0.33" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="20.33" y="214.0" width="0.66" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="20.98" y="214.0" width="0.98" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="21.97" y="214.0" width="1.31" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="23.28" y="214.0" width="1.64" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="24.92" y="214.0" width="1.97" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="26.88" y="214.0" width="2.29" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="29.18" y="214.0" width="2.62" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="31.80" y="214.0" width="2.95" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="34.75" y="214.0" width="3.28" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="38.02" y="214.0" width="3.60" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="41.63" y="214.0" width="3.93" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="45.56" y="214.0" width="4.26" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="49.82" y="214.0" width="4.59" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="54.41" y="214.0" width="4.92" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="59.32" y="214.0" width="5.24" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="64.56" y="214.0" width="5.57" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="70.14" y="214.0" width="5.90" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="76.03" y="214.0" width="6.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="82.26" y="214.0" width="6.55" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="88.81" y="214.0" width="6.88" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="95.69" y="214.0" width="7.21" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="102.90" y="214.0" width="7.54" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="110.44" y="214.0" width="7.86" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="118.30" y="214.0" width="8.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="126.50" y="214.0" width="8.52" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="135.02" y="214.0" width="8.85" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="143.86" y="214.0" width="9.18" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="153.04" y="214.0" width="9.50" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="162.54" y="214.0" width="9.83" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="172.37" y="214.0" width="10.16" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="182.53" y="214.0" width="10.49" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="193.02" y="214.0" width="10.81" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="203.83" y="214.0" width="11.14" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="214.97" y="214.0" width="11.47" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="226.44" y="214.0" width="11.80" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="238.23" y="214.0" width="12.12" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="250.36" y="214.0" width="12.45" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="262.81" y="214.0" width="12.78" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="275.59" y="214.0" width="13.11" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="288.70" y="214.0" width="13.43" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="302.13" y="214.0" width="13.76" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="315.90" y="214.0" width="14.09" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="329.99" y="214.0" width="10.01" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="340.00" y="214.0" width="4.40" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="344.40" y="214.0" width="14.75" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="359.15" y="214.0" width="15.07" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="374.22" y="214.0" width="15.40" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="389.62" y="214.0" width="15.73" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="405.35" y="214.0" width="16.06" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="421.41" y="214.0" width="16.38" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="437.79" y="214.0" width="16.71" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="454.50" y="214.0" width="17.04" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="471.54" y="214.0" width="17.37" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="488.91" y="214.0" width="17.69" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="506.60" y="214.0" width="18.02" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="524.63" y="214.0" width="18.35" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="542.98" y="214.0" width="18.68" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="561.66" y="214.0" width="19.01" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="580.66" y="214.0" width="19.33" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="599.99" y="214.0" width="19.66" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="619.65" y="214.0" width="19.99" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="639.64" y="214.0" width="20.32" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <line x1="340" y1="210" x2="340" y2="246" class="f-line"/>
  <text x="340.0" y="260.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">нужен 1 000 000</text>
  <text x="660.0" y="260.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">посчитано 1 999 872</text>
</svg>
<figcaption>Куски, которые достались 2 потокам, в одном масштабе. Для Stream.iterate показан самый частый случай, 62 порции восстановлены по счётчику плюс первое число. Часть после черты посчитана и выброшена.</figcaption>
</figure>

`Stream.iterate` режется по той же арифметике, но длины у него нет и порции идут дальше. В каждом запуске со счётчиком число вызовов равно `1024*k*(k+1)/2 - 1` с целым k. На миллион хватает k = 44. С одним рабочим потоком 62 вышло в 26 запусках из 30. Я запустил ту же программу ещё 2 раза, во второй раз 62 было в 28 запусках, в третий только в 10, остальные опускались до 44. Так что число из заголовка выпало 64 раза из 90 и больше него я не видел. С 3 рабочими в 29 запусках из 30 было 45. `LongStream.iterate` считает на шаг вперёд, у него в счётчике 1 999 872, по 3 запускам программы это 30, 23 и 21 раз.

Насколько я понял исходники, элементы вычисляет тот же поток, который режет. Продолжает он, пока не узнает, что лимит набран. Почему именно 62, я не нашёл. Javadoc метода `limit` предупреждает, что на упорядоченных параллельных конвейерах он может обойтись довольно дорого, я это читал и думал про буферы.

## Длина

Дальше диапазон, где каждый элемент стоит 0 или 50 раундов xorshift, в прогоне 1 это примерно 5 и 90 нс. На 10 дешёвых элементах параллельная сумма оказалась медленнее в 13,78 и 12,47 раза, 1,2 мкс против 0,1. На 1000 дешёвых она всё ещё проигрывала, 1,90 и 1,44, зато 1000 дорогих дала ничью, 1,13 и 0,84. Значит, одной длины мало. Я ждал, что дешёвый вариант догонит около 10 000 элементов, там вышло 0,68 и 0,83. Лучшая клетка сетки 0,58, причём второй прогон в ней же дал 0,95.

## Сосед, который спит

Общий пул один на всю JVM. Вычисление, которое последовательно занимает 162 мс, параллельно заняло 111. Потом другой поток запустил параллельный `forEach` из 8 вызовов sleep по 400 мс. Тот, кто его вызвал, спит, единственный рабочий поток пула тоже спит и мой параллельный стрим занял 194 мс. Последовательный вариант рядом с тем же соседом занял 200.

Потом 20 вызовов sleep по 50 мс, как будто это запросы. Последовательно 1003 мс, с `parallel()` 501, с обычным executor на 20 потоков 93. Приём с собственным `ForkJoinPool(20)` дал 258. Из 20 потоков работали только 4, по 5 вызовов на каждый.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="20 вызовов sleep по 50 миллисекунд, нарисованных блоками на потоках. Общий пул с одним рабочим: 2 потока по 10 вызовов, измерено 501 мс. Свой ForkJoinPool на 20: 4 потока по 5 вызовов и 16 без работы, измерено 258 мс. Executor на 20 потоков: по одному вызову, измерено 93 мс.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel(), общий пул: 2 потока, 501 мс</text>
  <rect x="20.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="295.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="350.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="405.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="460.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="515.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="295.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="350.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="405.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="460.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="515.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="20.0" y="98.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel() в ForkJoinPool(20): 4 потока, 258 мс</text>
  <rect x="20.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <text x="20.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">ещё 16 потоков без работы</text>
  <text x="20.0" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">executor: 20 потоков, 93 мс</text>
  <rect x="20.00" y="232.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="239.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="246.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="253.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="260.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="267.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="274.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="281.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="288.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="295.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="302.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="309.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="316.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="323.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="330.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="337.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="344.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="351.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="358.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="365.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
</svg>
<figcaption>20 вызовов sleep по 50 мс. Блок обозначает один вызов sleep, строка один поток. Времена измеренные, это медианы.</figcaption>
</figure>

Ответ нашёлся в исходнике `AbstractTask`: `LEAF_TARGET` там равен `ForkJoinPool.getCommonPoolParallelism() << 2`. Стрим выполняется в моём пуле, а нарезан под общий. При параллелизме общего пула 3 тот же код занял все 20 потоков и уложился в 72 мс.

## Чего я не проверял

Больше 2 ядер в бенчмарках, другие сборщики мусора и другие сборки JDK я не пробовал. Длинных запусков у меня по одному или по 2 на источник: что скачок есть, я знаю, а как часто его не бывает, нет. Вызовы sleep это всего лишь sleep, настоящий запрос может ждать ещё кого-то. `parallel()` я теперь буду ставить после замера, но пока у меня есть числа только для сумм.
