---
title: "Одна лямбда загружает на 126 классов больше, чем один анонимный класс"
description: "Одни и те же 100 функций записаны анонимными классами и лямбдами на релизной сборке Java 8. Лямбды дали один файл класса вместо 101, но загрузили на 126 классов больше, а первая обошлась в 45,6 мс. Заодно о том, как слово final меняет число объектов и кто держит внешний объект в памяти."
date: 2014-04-06
lang: ru
translationKey: lambda-is-not-anonymous
tags: ["compilers", "performance"]
---

Одни и те же 100 маленьких функций я записал и скомпилировал двумя способами, каждый набор в одном методе. После `javac` в каталоге с анонимными классами лежал 101 файл, 43 623 байта. В каталоге с лямбдами один файл на 11 977 байт. Потом я запустил оба варианта с `-verbose:class` и посчитал строки, которые начинаются с `[Loaded`. Анонимные классы: 477. Лямбды: 603.

До прогона я записал себе, что лямбды загружают больше классов, пока их мало, а к сотне ждал, что они отыграются. Лямбду я всегда объяснял себе как короткую запись анонимного класса. Объяснение удобное и почти никогда не мешает, поэтому под него я не заглядывал. 18 марта Java 8 вышла официально и отговорок не осталось.

Устройство лямбд не секрет, Брайан Гетц описал его в "Translation of Lambda Expressions" ещё в 2012 году. Сергей Куксенко в прошлом году показывал на JVM Language Summit замеры производительности, в том числе цену первого связывания. Мне хотелось своих чисел на релизной сборке.

## На чём мерил

OpenJDK 1.8.0, сборка b132, VM 25.0-b70, `javac` оттуда же с флагами по умолчанию, 2 ядра виртуальной машины. В тестовом классе N мест вида `f = x -> x + 1000; s = f.applyAsInt(s);`, константа везде своя. Во втором варианте на тех же местах стоит `new IntUnaryOperator() { ... }`. N равно 0, 1, 10 и 100.

## Что пишет javac

Для анонимного класса `javac` делает файл `Sites$1.class`, а в окружающем коде ставит `new`. Для лямбды он делает приватный статический метод `lambda$go$0` с телом и одну инструкцию `invokedynamic`, которая указывает на `LambdaMetafactory.metafactory`. Класса, чей объект мы получим, в этот момент ещё нет. JVM построит его, когда впервые дойдёт до инструкции.

Если запустить программу с `-Djdk.internal.lambda.dumpProxyClasses=dir`, этот класс можно сохранить и открыть. В нём 259 байт: пустой конструктор и `applyAsInt`, который вызывает `Sites.lambda$go$0`.

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Два пути. Анонимный класс: javac пишет Sites.class с new Sites$1 и отдельный файл Sites$1.class с телом, JVM загружает файл. Лямбда: javac пишет один Sites.class с инструкцией invokedynamic и методом lambda$go$0, в котором лежит тело. При первом выполнении LambdaMetafactory строит в памяти класс Sites$$Lambda$1 на 259 байт, а он вызывает lambda$go$0.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">пишет javac</text>
  <text x="430.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">в памяти JVM</text>
  <text x="20.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">анонимный класс</text>
  <rect x="20" y="56" width="280" height="42" class="f-box"/>
  <text x="32.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="90.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">new Sites$1</text>
  <rect x="20" y="108" width="280" height="42" class="f-box"/>
  <text x="32.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites$1.class</text>
  <text x="32.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">applyAsInt: x + 1000</text>
  <text x="290.0" y="125.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">тело здесь</text>
  <rect x="430" y="108" width="230" height="42" class="f-box"/>
  <text x="442.0" y="134.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">Sites$1</text>
  <line x1="300" y1="129" x2="430" y2="129" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,129 423.6,126.3 423.6,131.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="121.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">загрузка</text>
  <line x1="20" y1="166" x2="660" y2="166" class="f-plain"/>
  <text x="20.0" y="192.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">лямбда</text>
  <rect x="20" y="204" width="280" height="112" class="f-box" style="stroke:var(--accent)"/>
  <text x="32.0" y="223.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">invokedynamic #0:applyAsInt</text>
  <line x1="32" y1="262" x2="288" y2="262" class="f-plain"/>
  <text x="32.0" y="284.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">lambda$go$0</text>
  <text x="290.0" y="284.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">тело здесь</text>
  <text x="32.0" y="302.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">x + 1000</text>
  <rect x="430" y="224" width="230" height="32" class="f-box"/>
  <text x="442.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">LambdaMetafactory</text>
  <rect x="430" y="278" width="230" height="38" class="f-box" style="stroke:var(--accent)"/>
  <text x="442.0" y="301.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">Sites$$Lambda$1, 259 байт</text>
  <line x1="300" y1="240" x2="430" y2="240" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,240 423.6,237.3 423.6,242.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="232.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">первый раз</text>
  <line x1="540" y1="256" x2="540" y2="278" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="540,278 542.7,271.6 537.3,271.6" style="fill:var(--muted);stroke:none"/>
  <line x1="430" y1="297" x2="300" y2="297" style="stroke:var(--accent);stroke-width:1.2"/>
  <polygon points="300,297 306.4,299.7 306.4,294.3" style="fill:var(--accent);stroke:none"/>
  <text x="365.0" y="289.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">вызов</text>
</svg>
<figcaption>Где лежит тело и когда появляется класс.</figcaption>
</figure>

То есть 100 лямбд это всё равно 100 классов, просто появляются они позже. Сохранённые файлы занимают 26 082 байта, вместе с основным классом выходит 38 059 против 43 623. По-настоящему экономит только jar: 4147 байт против 44 109.

Ещё в той же записи стояло, что на диске лямбда выигрывает всегда. На одной лямбде это не так. Файл класса с ней занимает 1096 байт, а 2 файла с анонимным классом 968.

## Откуда берутся 126

Пустая программа загружает здесь 374 класса. Один анонимный класс добавляет к ним 2, себя и интерфейс `IntUnaryOperator`. Одна лямбда добавляет 128. Больше половины это механизм, который её строит. 57 классов из 128 лежат в `java.lang.invoke`, ещё 13 относятся к библиотеке ASM внутри JDK, с её помощью и пишутся те самые 259 байт. А 35 из 128 нет ни в одном файле, они генерируются прямо во время работы.

Я думал так: цена платится один раз, а дальше с ростом N лямбды отыграются. Первая половина верна. Но каждая следующая лямбда тоже стоит одного класса, ровно как анонимный. Поэтому разница остаётся 126 при N = 1, 10 и 100. Со второй половиной я промахнулся. Ровно 126 каждый раз получилось отчасти случайно. На каждом шаге с обеих сторон загружалось ещё по одному классу самой JDK и классы эти разные: у 100 анонимных добавился `sun.misc.Cleaner`, у лямбд ещё один `LambdaForm`.

<figure class="fig">
<svg viewBox="0 0 680 248" role="img" aria-label="Столбцы для N = 1, 10 и 100 мест. N = 1: байт на диске 968 у анонимных классов и 1096 у лямбд, загружено классов сверх пустой программы 2 и 128; N = 10: байт на диске 4831 у анонимных классов и 2077 у лямбд, загружено классов сверх пустой программы 12 и 138; N = 100: байт на диске 43 623 у анонимных классов и 11 977 у лямбд, загружено классов сверх пустой программы 103 и 229.">
  <text x="70.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">байт .class на диске</text>
  <text x="400.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">загружено сверх пустой программы</text>
  <text x="10.0" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 1</text>
  <rect x="70" y="34" width="4.2" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.2" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">968</text>
  <rect x="70" y="54" width="4.8" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="80.8" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1096</text>
  <rect x="400" y="34" width="1.9" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.9" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <rect x="400" y="54" width="123.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="529.0" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">128</text>
  <text x="10.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 10</text>
  <rect x="70" y="96" width="21.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="97.0" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4831</text>
  <rect x="70" y="116" width="9.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="85.0" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">2077</text>
  <rect x="400" y="96" width="11.5" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12</text>
  <rect x="400" y="116" width="132.6" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="538.6" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">138</text>
  <text x="10.0" y="180.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 100</text>
  <rect x="70" y="158" width="190.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="266.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">43 623</text>
  <rect x="70" y="178" width="52.2" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="128.2" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11 977</text>
  <rect x="400" y="158" width="99.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="505.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103</text>
  <rect x="400" y="178" width="220.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="626.0" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">229</text>
  <rect x="70" y="224" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="88.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">анонимный класс</text>
  <rect x="260" y="224" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">лямбда</text>
</svg>
<figcaption>Слева файлы, справа работающая JVM. Справа разрыв во всех строках один и тот же, 126.</figcaption>
</figure>

## Первый вызов

Теперь время. Каждое число на рисунке это медиана по 30 новым процессам. Процесс вычисляет выражение и один раз вызывает то, что получилось, потом делает то же с другим выражением, потом повторяет последнее.

Первый анонимный класс обходится в 0,33 мс. Первая лямбда в 45,6 мс, 80% запусков лежат между 37,8 и 54,0. Вторая лямбда занимает 0,28 мс, второй анонимный класс 0,23 мс. После первой они близки, выбирать между ними по этой причине я бы не стал.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Точки на логарифмической шкале времени. первое место: анонимный класс 332,5 мкс, лямбда 45591,1 мкс; другое место: анонимный класс 228,6 мкс, лямбда 278,3 мкс; то же место снова: анонимный класс 0,5 мкс, лямбда 5,5 мкс.">
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">вычисление и один вызов, логарифмическая шкала</text>
  <line x1="219.5" y1="28" x2="219.5" y2="200" class="f-plain"/>
  <text x="219.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 мкс</text>
  <line x1="301.9" y1="28" x2="301.9" y2="200" class="f-plain"/>
  <text x="301.9" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 мкс</text>
  <line x1="384.4" y1="28" x2="384.4" y2="200" class="f-plain"/>
  <text x="384.4" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мкс</text>
  <line x1="466.8" y1="28" x2="466.8" y2="200" class="f-plain"/>
  <text x="466.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 мс</text>
  <line x1="549.3" y1="28" x2="549.3" y2="200" class="f-plain"/>
  <text x="549.3" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 мс</text>
  <line x1="631.8" y1="28" x2="631.8" y2="200" class="f-plain"/>
  <text x="631.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 мс</text>
  <text x="10.0" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">первое место</text>
  <line x1="418.9" y1="48" x2="434.0" y2="48" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="427.4" cy="48" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="443.0" y="52.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,33 мс</text>
  <line x1="596.9" y1="70" x2="609.7" y2="70" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="603.6" cy="70" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="586.9" y="74.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">45,6 мс</text>
  <text x="10.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">другое место</text>
  <line x1="410.7" y1="104" x2="418.3" y2="104" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="414.0" cy="104" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="427.3" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,23 мс</text>
  <line x1="416.6" y1="126" x2="427.9" y2="126" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="421.0" cy="126" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="436.9" y="130.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0,28 мс</text>
  <text x="10.0" y="175.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">то же место снова</text>
  <line x1="186.7" y1="160" x2="194.7" y2="160" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="194.7" cy="160" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="203.7" y="164.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,5 мкс</text>
  <line x1="277.8" y1="182" x2="288.1" y2="182" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="280.5" cy="182" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="297.1" y="186.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">5,5 мкс</text>
  <circle cx="176" cy="236" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="188.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">анонимный класс</text>
  <circle cx="366" cy="236" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">лямбда</text>
</svg>
<figcaption>Медианы по 30 новым процессам, тонкие линии от 10-го до 90-го процентиля. Без архива CDS.</figcaption>
</figure>

Сборка, которую я взял, идёт без архива общих классов (class data sharing). Я подозревал, что 45 мс это в основном чтение `rt.jar`. Сделал архив через `-Xshare:dump` и повторил. У лямбды получилось 45,9 мс. Сам архив работает, пустая программа ускорилась с 66 до 51 мс (весь процесс из jar, медиана 15 запусков), но из 128 дополнительных классов в него попали только 26.

Сервер этих 45 мс не заметит, а маленькая консольная утилита заметит. Весь процесс со 100 лямбдами, измеренный так же и без архива, занял 170 мс против 103 мс со 100 анонимными классами.

## Какой объект я получаю

Анонимный класс каждый раз даёт новый объект. Про лямбду спецификация (JLS 15.27.4) не обещает ни нового объекта, ни прежнего. Я вычислил каждое выражение 1000 раз и посчитал разные объекты.

| выражение | объектов |
|---|---|
| анонимный класс | 1000 |
| `x -> x + 1` | 1 |
| `x -> x + k`, `int k = 5` | 1000 |
| `x -> x + k`, `final int k = 5` | 1 |
| `x -> x + field` | 1000 |
| `Identity::sq` (статический) | 1 |
| `this::add` | 1000 |

Мне нравятся строки 3 и 4. Отличаются они только словом `final`. С ним `k` становится константой времени компиляции, `javac` подставляет 5 прямо в тело и захватывать нечего. Не думал, что от модификатора зависит, сколько объектов создаётся.

По тому же правилу решается, кто остаётся в памяти. Я создал 50 объектов по 1 МБ, у каждого взял по одному колбэку, оставил только колбэки и 3 раза вызвал `System.gc()`. С анонимным `Runnable`, который внешний объект вообще не трогает, выжили все 50. Их держит скрытое поле `this$0`. С лямбдой, которая делает то же самое, не выжил ни один. Но если лямбда читает поле внешнего объекта, снова живы все 50. Она захватила `this`, хотя в исходнике этого слова даже не видно.

## Имена

`getClass().isAnonymousClass()` для лямбды возвращает false. Внутри её тела `this` это внешний объект. Её класс называется примерно так: `Who$$Lambda$1/1510467688`. `Class.forName` с этим именем бросает `ClassNotFoundException`. Потом я открыл `InnerClassLambdaMetafactory` через `javap`, чтобы посмотреть, как класс попадает в JVM. Там нашёлся вызов `Unsafe.defineAnonymousClass`. Выходит, он всё-таки анонимный, только в другом смысле слова, в том, который принят внутри VM.

Одну вещь я понял не сразу. В моём классе `Who` 5 лямбд и я искал в нём `lambda$go$0`. А методы назывались от `lambda$go$24` до `lambda$go$28`. Я компилировал 4 файла одной командой, а этот `javac` не сбрасывает счётчик, когда переходит к следующему классу. Если собрать `Who` отдельно, номера идут от 0 до 4. Если после `Identity.java`, то от 19 до 23, так что байты файла класса зависят от соседей по командной строке.

## Чего я не проверял

Сборка одна, в следующем обновлении классов может загружаться меньше. Скорость прогретого кода я не мерил, у Куксенко это сделано как следует. Повторное вычисление той же лямбды заняло 5,5 мкс против 0,5 у анонимного класса, но это единственный вызов в интерпретаторе, выводов я бы отсюда не делал. Не знаю и того, какая часть 45 мс уходит на загрузку, какая на связывание, а какая на ASM. И все мои лямбды одной формы, с разными интерфейсами дополнительных классов будет другое число.
