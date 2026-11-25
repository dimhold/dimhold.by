---
title: "WebAssembly обгонял мой JS в 7,9 раза, пока я не переписал total += k"
description: "6 маленьких циклов, вызовы через границу и время компиляции на Node 8.1.2, JS против WebAssembly, написанного руками. Выигрыш wasm в 7,9 раза на Мандельброте дал let, от которого отказался оптимизирующий компилятор. После правки одной строки JS стал быстрее в 1,35 раза. А вот 64-битный генератор на wasm действительно быстрее в 10 раз."
date: 2017-06-17
lang: ru
translationKey: wasm-first-measure
tags: ["performance", "compilers"]
---

Цикл Мандельброта на Node 8.1.2 занял 427 мс на JavaScript и 54 мс на WebAssembly. До прогона я записал, что wasm должен выиграть хотя бы в 1,2 раза, так что 7,9 выглядело успехом. Но с флагом `node --trace-opt` версия на JavaScript печатает вот что (адрес я убрал):

```
[disabled optimization for <SharedFunctionInfo mandel>, reason: Unsupported let compound assignment]
```

Оптимизирующий компилятор взялся за функцию и отказался от неё. Споткнулся он на строке `total += k`, одной из 14, где `total` объявлен через `let`. Я заменил её на `total = total + k` и та же функция стала работать 40 мс. Теперь JS быстрее wasm в 1,35 раза.

Я по умолчанию пишу `let` и ни разу не смотрел, принимает ли его оптимизатор. Поэтому пост получился сразу про 2 вещи.

## Как я мерил

Node 8.1.2 вышел в этот четверг, внутри V8 5.8.283.41. `WebAssembly` в восьмой ветке работает без флага. Машина виртуальная, 2 ядра, Linux x64. Emscripten я не брал, иначе мерил бы заодно его оптимизатор. Функции wasm записаны руками как списки инструкций, в байты их собирает скрипт на 57 строк. Модуль, который складывает 2 целых числа, занимает 41 байт:

```
00 61 73 6d 01 00 00 00 01 07 01 60 02 7f 7f 01 7f 03 02 01 00
07 07 01 03 61 64 64 00 00 0a 09 01 07 00 20 00 20 01 6a 0b
```

Каждый цикл есть в 3 видах: JS с `let` и `const`, как я написал бы его сам, тот же текст, где оба слова заменены на `var`, а третий вид это wasm. Для каждой конфигурации запускалось 11 свежих процессов, в каждом по 7 повторов. Ниже везде медиана по процессам от лучшего повтора. Если результаты разошлись, скрипт падает.

Хаас с соавторами сравнивают wasm с нативным кодом и asm.js в статье для PLDI, её текст с марта лежит в репозитории спецификации. Лин Кларк в феврале объясняла на Mozilla Hacks, почему wasm должен быть быстрым. Мне хотелось маленьких примеров на Node, которые видно целиком.

## 6 циклов

| цикл | let, мс | var, мс | wasm, мс | let / wasm | var / wasm |
|---|---|---|---|---|---|
| collatz, int32 | 28,2 | 25,6 | 20,7 | 1,36 | 1,24 |
| мандельброт, f64 | 427 | 39,6 | 54,0 | 7,90 | 0,73 |
| генератор, 64 бита | 211 | 208 | 2,63 | 80,4 | 79,2 |
| он же, только int32 | 26,9 | 26,9 | 2,63 | 10,2 | 10,2 |
| решето, 5 млн байт | 313 | 34,6 | 23,3 | 13,4 | 1,49 |
| fib(30) | 9,72 | 10,06 | 7,26 | 1,34 | 1,39 |

В `fib` нет ни одного `let`, поэтому в первых 2 столбцах у него один и тот же текст, а 3% между ними это ошибка самой схемы. Вариант с `let` в процессе всегда идёт первым, вариант с `var` собирается из строки.

<figure class="fig">
<svg viewBox="0 0 680 284" role="img" aria-label="Лучшее время 6 циклов на Node 8.1.2 по логарифмической шкале: JS с let, JS с var и wasm. collatz, int32: let 28,2, var 25,6, wasm 20,7 мс; мандельброт, f64: let 427, var 39,6, wasm 54,0 мс; генератор, 64 бита: let 211, var 208, wasm 2,63 мс; он же, int32: let 26,9, var 26,9, wasm 2,63 мс; решето, байты: let 313, var 34,6, wasm 23,3 мс; fib(30), вызовы: let 9,72, var 10,06, wasm 7,26 мс.">
  <circle cx="188.0" cy="16.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="204.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS с let</text>
  <circle cx="323.0" cy="16.0" r="5" style="fill:var(--ink);stroke:none"/>
  <text x="339.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS с var</text>
  <circle cx="458.0" cy="16.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="474.0" y="20.0" text-anchor="start" class="f-mono f-muted">wasm</text>
  <line x1="180.0" y1="42.0" x2="180.0" y2="252.0" class="f-plain"/>
  <text x="180.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <line x1="333.3" y1="42.0" x2="333.3" y2="252.0" class="f-plain"/>
  <text x="333.3" y="272.0" text-anchor="middle" class="f-mono f-muted">10</text>
  <line x1="486.7" y1="42.0" x2="486.7" y2="252.0" class="f-plain"/>
  <text x="486.7" y="272.0" text-anchor="middle" class="f-mono f-muted">100</text>
  <line x1="640.0" y1="42.0" x2="640.0" y2="252.0" class="f-plain"/>
  <text x="640.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1 000</text>
  <text x="168.0" y="64.0" text-anchor="end" class="f-mono f-ink">collatz, int32</text>
  <line x1="381.9" y1="60.0" x2="402.3" y2="60.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="402.3" cy="60.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="396.1" cy="60.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="381.9" cy="60.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="98.0" text-anchor="end" class="f-mono f-ink">мандельброт, f64</text>
  <line x1="425.0" y1="94.0" x2="583.3" y2="94.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="583.3" cy="94.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="425.0" cy="94.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="445.7" cy="94.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="132.0" text-anchor="end" class="f-mono f-ink">генератор, 64 бита</text>
  <line x1="244.4" y1="128.0" x2="536.5" y2="128.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="536.5" cy="128.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="535.5" cy="128.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="128.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="166.0" text-anchor="end" class="f-mono f-ink">он же, int32</text>
  <line x1="244.4" y1="162.0" x2="399.4" y2="162.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="399.4" cy="162.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="399.2" cy="162.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="162.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="200.0" text-anchor="end" class="f-mono f-ink">решето, байты</text>
  <line x1="389.5" y1="196.0" x2="562.6" y2="196.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="562.6" cy="196.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="416.0" cy="196.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="389.5" cy="196.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="234.0" text-anchor="end" class="f-mono f-ink">fib(30), вызовы</text>
  <line x1="312.0" y1="230.0" x2="333.7" y2="230.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="331.4" cy="230.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="333.7" cy="230.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="312.0" cy="230.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="272.0" text-anchor="end" class="f-label f-muted">мс, лог. шкала</text>
</svg>
<figcaption>Медиана по 11 процессам, из процесса взят лучший из 7 повторов. Там, где пустой кружок стоит далеко от чёрного, оптимизирующий компилятор отказался от функции.</figcaption>
</figure>

В решете я попробовал ту же починку, `j = j + i` вместо `j += i`. Это отдельный скрипт, 7 процессов по 5 повторов, 40 мс в начале поста тоже оттуда. Было 296 мс, осталось 296 мс. Компилятор просто перешёл к следующей претензии, `Unsupported phi use of const or let variable`. Дальше чинить я не стал, заменил всё на `var` и получил 35 мс.

Ловушка известная. Petka Antonov ведёт в вики Bluebird список убийц оптимизации, составное присваивание `let` там есть, с пометкой "Optimized as of Chrome 56 / V8 5.6!". У меня V8 5.8, так что по этому списку всё должно быть исправлено. Но `node --v8-options` показывает, что в этой сборке флаг `--turbo` по умолчанию выключен. С ним Мандельброт с `let` идёт 39,5 мс по 7 процессам. В маленькой пробе запись `s += a[i]` с `let` Node 6.11.0 принимает, а 7.10.0 уже нет.

С парой `--ignition --turbo`, которую V8 5.9 включает всем, Мандельброт с `let` занимает 39,6 мс по 11 процессам. Бесплатно это не даётся. Решето с `var` стало занимать 52 мс вместо 34,6. С `let` оно ускорилось с 313 до 83, но до прежнего `var` всё равно не дотянуло.

## Откуда взялись 80 раз

Целых на 64 бита в JS нет, поэтому генератор `x = x * a + c` приходится резать на половины. На обычной моей версии компилятор сдаётся даже с `var`, после нескольких попыток он пишет `Deoptimized too many times`. Я решил, что промежуточные произведения выходят за int32. Переписал всё через `Math.imul`, стало быстрее почти в 8 раз, но wasm всё равно впереди в 10,2 раза, а на новом конвейере в 3,1. У wasm на этом месте один `i64.mul`.

Объяснение оказалось неверным. `--trace-deopt` показывает 11 выходов из оптимизированного кода, все с причиной `lost precision` и все на 2 вызовах `Math.imul`, куда приходят сами половины. Половины я держал беззнаковыми через `>>> 0`. С `| 0` в этих 2 местах старый текст занимает 30,5 мс, а было 200 (7 процессов, у переписанного там 26,9). Переписывать почти всё было незачем.

Этому выигрышу я верю. Но через границу `i64` не проходит. Функция wasm, которая принимает и отдаёт `i64`, компилируется, а потом `exports.id(1)` бросает `TypeError: invalid type`. Мой генератор принимает и отдаёт int32.

С Мандельбротом всё наоборот. Я подозревал свой wasm и заменил `2 * x` на `x + x`, а константы вынес в локальные переменные. Ничего не изменилось, 54,0 и 54,4 мс. Перенос проверки в конец цикла дал 50,1. Это всё ещё на 25% медленнее JS с одной переписанной строкой. Почему, я не знаю.

## Граница

<figure class="fig">
<svg viewBox="0 0 680 242" role="img" aria-label="Цена одного вызова в наносекундах. wasm из wasm: 1,96; wasm из JS, без аргументов: 3,65; JS из JS: 3,99; JS из wasm, 2 int32: 6,53; wasm из JS, 2 int32: 8,24; wasm из JS, 2 f64: 11,75; JS из JS, встроенный: 0,67.">
  <text x="235.0" y="14.0" text-anchor="start" class="f-label f-muted">нс на вызов</text>
  <text x="223.0" y="42.0" text-anchor="end" class="f-mono f-ink">wasm из wasm</text>
  <rect x="235" y="30" width="61.3" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="304.3" y="42.0" text-anchor="start" class="f-mono f-ink">1,96</text>
  <text x="223.0" y="72.0" text-anchor="end" class="f-mono f-ink">wasm из JS, без аргументов</text>
  <rect x="235" y="60" width="114.1" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="357.1" y="72.0" text-anchor="start" class="f-mono f-ink">3,65</text>
  <text x="223.0" y="102.0" text-anchor="end" class="f-mono f-ink">JS из JS</text>
  <rect x="235" y="90" width="124.7" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="367.7" y="102.0" text-anchor="start" class="f-mono f-ink">3,99</text>
  <text x="223.0" y="132.0" text-anchor="end" class="f-mono f-ink">JS из wasm, 2 int32</text>
  <rect x="235" y="120" width="204.1" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="447.1" y="132.0" text-anchor="start" class="f-mono f-ink">6,53</text>
  <text x="223.0" y="162.0" text-anchor="end" class="f-mono f-ink">wasm из JS, 2 int32</text>
  <rect x="235" y="150" width="257.5" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="500.5" y="162.0" text-anchor="start" class="f-mono f-ink">8,24</text>
  <text x="223.0" y="192.0" text-anchor="end" class="f-mono f-ink">wasm из JS, 2 f64</text>
  <rect x="235" y="180" width="367.2" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="610.2" y="192.0" text-anchor="start" class="f-mono f-ink">11,75</text>
  <text x="223.0" y="222.0" text-anchor="end" class="f-mono f-ink">JS из JS, встроенный</text>
  <rect x="235" y="210" width="20.9" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="263.9" y="222.0" text-anchor="start" class="f-mono f-ink">0,67</text>
</svg>
<figcaption>Встраивание выключено во всех строках, кроме последней. Пустой цикл, 0,48 нс, не вычтен.</figcaption>
</figure>

Вызов wasm из JS с 2 целыми стоит 8,24 нс против 3,99 у функции на JS, которую V8 запретили встраивать. Это в 2 раза больше, а я закладывал до 10. Без аргументов выходит 3,65, с 2 числами double 11,75. Обратная дорога, из wasm в JS, стоит 6,53. Если встраивание разрешить, вызов JS почти пропадает, 0,67 нс вместе с циклом, а вызов wasm так и остаётся 8,26.

Ещё я хотел понять, с какого объёма работы перенос в wasm окупается. Проверял на сумме квадратов n чисел double.

<figure class="fig">
<svg viewBox="0 0 680 338" role="img" aria-label="Время одного вызова, который считает сумму квадратов n чисел double, n от 1 до 4096, обе оси логарифмические. JS с let идёт верхней линией от 33,1 до 97 166 нс. JS с var от 1,6 до 3 992 нс, wasm по своей памяти от 9,5 до 4 023 нс, wasm с копированием массива от 44,1 до 4 726 нс. На нескольких сотнях элементов wasm подходит к линии var, но не пересекает её.">
  <line x1="80.0" y1="290.0" x2="520.0" y2="290.0" class="f-plain"/>
  <text x="72.0" y="294.0" text-anchor="end" class="f-mono f-muted">1</text>
  <line x1="80.0" y1="238.8" x2="520.0" y2="238.8" class="f-plain"/>
  <text x="72.0" y="242.8" text-anchor="end" class="f-mono f-muted">10</text>
  <line x1="80.0" y1="187.6" x2="520.0" y2="187.6" class="f-plain"/>
  <text x="72.0" y="191.6" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="80.0" y1="136.4" x2="520.0" y2="136.4" class="f-plain"/>
  <text x="72.0" y="140.4" text-anchor="end" class="f-mono f-muted">1 000</text>
  <line x1="80.0" y1="85.2" x2="520.0" y2="85.2" class="f-plain"/>
  <text x="72.0" y="89.2" text-anchor="end" class="f-mono f-muted">10 000</text>
  <line x1="80.0" y1="34.0" x2="520.0" y2="34.0" class="f-plain"/>
  <text x="72.0" y="38.0" text-anchor="end" class="f-mono f-muted">100 000</text>
  <text x="80.0" y="310.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <text x="190.0" y="310.0" text-anchor="middle" class="f-mono f-muted">8</text>
  <text x="300.0" y="310.0" text-anchor="middle" class="f-mono f-muted">64</text>
  <text x="410.0" y="310.0" text-anchor="middle" class="f-mono f-muted">512</text>
  <text x="520.0" y="310.0" text-anchor="middle" class="f-mono f-muted">4096</text>
  <polyline points="80.0,212.2 116.7,200.4 153.3,186.3 190.0,171.1 226.7,156.4 263.3,141.4 300.0,126.4 336.7,110.8 373.3,95.8 410.0,80.5 446.7,65.2 483.3,49.8 520.0,34.6" style="fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:2 4"/>
  <polyline points="80.0,279.5 116.7,271.5 153.3,261.5 190.0,249.8 226.7,236.1 263.3,219.6 300.0,203.1 336.7,184.1 373.3,167.8 410.0,152.1 446.7,136.5 483.3,121.0 520.0,105.6" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="80.0,205.8 116.7,203.9 153.3,202.9 190.0,203.1 226.7,199.5 263.3,193.7 300.0,185.5 336.7,174.4 373.3,161.9 410.0,147.7 446.7,133.3 483.3,118.3 520.0,101.9" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6 4"/>
  <polyline points="80.0,239.9 116.7,236.1 153.3,233.5 190.0,230.5 226.7,220.7 263.3,210.6 300.0,198.3 336.7,181.9 373.3,166.7 410.0,151.7 446.7,136.1 483.3,120.9 520.0,105.4" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="530.0" y="38.6" text-anchor="start" class="f-mono f-ink">JS с let</text>
  <text x="530.0" y="91.9" text-anchor="start" class="f-mono f-accent">wasm + копия</text>
  <text x="530.0" y="113.4" text-anchor="start" class="f-mono f-accent">wasm</text>
  <text x="530.0" y="131.6" text-anchor="start" class="f-mono f-ink">JS с var</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">нс на вызов, лог</text>
  <text x="520.0" y="328.0" text-anchor="end" class="f-label f-muted">n, чисел double за вызов, лог</text>
</svg>
<figcaption>Сумма квадратов n чисел double, один вызов. Ни одна линия wasm не опускается ниже JS с var.</figcaption>
</figure>

Такого объёма нет. Из 13 значений n от 1 до 4096 wasm ни разу не обогнал JS с `var`: 9,5 нс против 1,6 на одном элементе и 4023 против 3992 на 4096. С 1024 элементов разбросы по процессам уже перекрываются. У обоих выходит около 1 нс на элемент, подозреваю цепочку сложений double. Если массив надо сначала скопировать в память wasm, на 4096 элементах это 4726 нс. С `let` картина другая: 97 166 нс на 4096 элементах и wasm выигрывает с первого. Без `--trace-opt` я бы опубликовал именно её.

## Компиляция и размер

`new WebAssembly.Module` компилирует всё до первого вызова, в каждом процессе я засекал одну такую компиляцию. Модуль из 2 функций и 390 байт занимает 0,74 мс. На 2000 функций и 364 кБ уходит 120 мс, примерно 60 мкс на функцию. Один только `WebAssembly.validate` на большом модуле стоит 3,2 мс.

6 функций на JS это 1400 байт, в wasm 710. После gzip 610 против 441. JS у меня не сжат, без пробелов это 962 байта и 523 после gzip. Проверок границ памяти я не увидел: с `--wasm_no_bounds_checks` решето идёт 21,9 мс вместо 23,3 и разбросы по процессам перекрываются. Ожидал я 10%.

## Чего я не проверял

Ни emscripten, ни браузеров, только Node на одной машине. Мой wasm написан руками, настоящий компилятор с Мандельбротом скорее всего справился бы лучше. Потоковой загрузки и роста памяти тут нет. Отказ от `let` это свойство нынешнего конвейера V8 и в следующих выпусках восьмой ветки может исчезнуть. Сам V8 5.9 я не смотрел, только пару его флагов в 5.8.

Генератор своих 103 байт в wasm, по-моему, стоит. Цикл Мандельброта я оставил бы на JS, но сначала запустил бы `--trace-opt`.
