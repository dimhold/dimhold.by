---
title: "Паралельны стрым выклікаў маю функцыю 1 999 871 раз, каб скласці 1 000 000 лікаў"
description: "Я склаў мільён лікаў з 8 крыніц на JDK 8u5 і 2 ядрах, з parallel() і без яго. Stream.iterate вылічыў дарма амаль мільён элементаў, а частка маёй табліцы рассыпалася каля 5000-га выкліку, калі C2 перакампіляваў код."
date: 2014-06-08
lang: be
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

Сума 500000500000, яна правільная. У лічыльніку 1 999 871. Без `.parallel()` там 999 999, як і павінна быць: першы лік зададзены, астатнія робіць функцыя. На 2 патоках выйшаў амаль мільён лішніх выклікаў. Я паўтарыў гэта 30 разоў у адной JVM і ў 26 з іх лік супаў да апошняй лічбы.

Дагэтуль я лічыў, што `parallel()` можна паспрабаваць без аніякай рызыкі. Калі стрыму гэта пасуе, будзе хутчэй, а калі не, страчу некалькі мікрасекунд на запуск задач. Яшчэ я думаў, што ўсё вырашае даўжыня калекцыі. Нічога з гэтага я ні разу не мераў. Java 8 выйшла ў сакавіку, часу прайшло мала, але звычка ўжо ёсць.

Парады на гэты конт існуюць. Рычард Уорбертан у кнізе "Java 8 Lambdas" лічыць масівы і ArrayList добрымі крыніцамі, HashSet і TreeSet сярэднімі, LinkedList і iterate кепскімі. Лукаш Крэцан у сакавіку паказаў, як запусціць паралельны стрым ва ўласным пуле. Мне хацелася ўбачыць, колькі за гэтымі словамі мілісекунд.

## На чым мераў

JDK 1.8.0_05, JMH 0.8, віртуальная машына, на якой працуюць і іншыя працэсы. Запускі JMH я прывязаў да 2 ядраў праз `taskset` і адразу спатыкнуўся: нават пад `taskset -c 0` гэты JDK бачыць 4 ядры і робіць агульны пул на 3 патокі. Давялося ўручную паставіць агульнаму пулу паралелізм 1. Паток, які выклікае, таксама працуе, разам выходзіць 2. Лічыльнікі і выклікі sleep з канца артыкула ішлі без прывязкі.

З-за суседзяў час моцна скача, таму ўсе бенчмаркі я прагнаў двойчы: першы раз па 2 форкі, другі па 3 або 4. У табліцы медыяны па ўсіх ітэрацыях. Я вырашыў верыць розніцы, толькі калі яе відаць у абодвух прагонах. Чаканні запісаў да першага замеру часу.

## Адзін і той жа мільён з 8 крыніц

Трэба скласці лікі ад 1 да 1 000 000. Час узяты з прагону 1. Калі суадносіны большыя за адзінку, з `parallel()` стала павольней.

| крыніца | паслядоўна, мс | паралельна, мс | суадносіны, прагон 1 | суадносіны, прагон 2 |
|---|---|---|---|---|
| TreeSet | 22,81 | 14,67 | 0,64 | 0,51 |
| LongStream.rangeClosed | 2,76 | 1,92 | 0,69 | 0,74 |
| long[] | 2,35 | 2,20 | 0,94 | 1,32 |
| HashSet | 10,71 | 10,46 | 0,98 | 0,49 |
| LinkedList | 3,28 | 6,88 | 2,10 | 1,91 |
| ArrayList | 1,36 | 3,56 | 2,62 | 2,66 |
| Stream.iterate | 5,90 | 16,76 | 2,84 | 2,76 |
| LongStream.iterate | 1,56 | 12,29 | 7,88 | 6,34 |

iterate і LinkedList я чакаў унізе табліцы, там яны і апынуліся. TreeSet у мяне быў запісаны як спрэчны, а ён выйграў абодва разы. Пра long[] і HashSet мае 2 прагоны паміж сабой не згодныя. ArrayList мусіў акупіцца, рэжацца ён ідэальна, я праверыў: 4 кавалкі па 250 000. І ў абодвух прагонах прайграў. Паводле майго правіла гэта вынік, я яго так ужо і запісаў.

Потым я паглядзеў на слупок з паслядоўным часам. Спіс з аб'ектаў Long складаецца хутчэй за звычайны long[]. Гэта здалося дзіўным, таму ад медыян я перайшоў да асобных ітэрацый.

## Хутка прыкладна да 5000 выклікаў

Ва ўсіх 4 форках прагону 2 першая вымераная ітэрацыя паслядоўнага long[] займае ад 0,35 да 0,37 мс, а апошняя ад 2,2 да 2,3. Некалькі крыніц я прагнаў даўжэй і без прагрэву.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Час адной паслядоўнай сумы мільёна элементаў у залежнасці ад колькасці ўжо зробленых выклікаў, 4 крыніцы, вертыкальная вось лагарыфмічная. long[] пераходзіць з 0,34 прыкладна на 2,2 мс пасля 4200 выклікаў, LongStream.iterate з 1,5 на 5,3 мс і LinkedList з 2,9 на 3,9 мс каля 5000 выклікаў. ArrayList у адным запуску JVM пераходзіць з 1,2 на 5,0 мс, а ў другім трымаецца на 1,2 мс усе 10 000 выклікаў.">
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
  <text x="670.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">мс на адну суму</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">зроблена выклікаў</text>
</svg>
<figcaption>Паслядоўная сума мільёна, адзін пункт на ітэрацыю, без прагрэву. Акцэнтны колер: ArrayList, 2 запускі JVM. Выклікі паміж ітэрацыямі на восі не ўлічаны.</figcaption>
</figure>

Паслядоўнаму long[] хапае 0,34 мс, прыкладна пасля 4200 выклікаў яму трэба ўжо 2,2 і назад ён пры мне не вярнуўся. LongStream.iterate пераходзіць з 1,5 на 5,3, LinkedList з 2,9 на 3,9, дыяпазон з 0,39 на 2,4. ArrayList у адным запуску JVM пратрымаўся на 1,2 усе 10 000 выклікаў, а ў другім падняўся да 5,0.

`Tier4InvocationThreshold` у гэтай JVM роўны 5000. З `-XX:+PrintCompilation` відаць, што скачок у long[] супадае з момантам, калі C2 кампілюе `SrcBench::seq` і `Spliterator$OfLong::forEachRemaining`, гэта значыць метады вакол цыкла. Сам цыкл быў скампіляваны асобна і нашмат раней. Чаму новы код у некалькі разоў павольнейшы, не ведаю, асэмблер я не глядзеў.

Паралельная сума па ArrayList таксама скача, з 1,3 на 4,1 мс, але ўжо прыкладна пасля 1150 выклікаў. У кожным выкліку 4 кавалкі, таму, думаю, метады вакол цыкла проста раней набіраюць свае 5000. Мая табліца параўноўвае паралельны ArrayList пасля скачка з паслядоўным да яго. Калі ўзяць абодва да скачка, выходзіць 1,3 супраць 1,2, амаль нічыя. Адзін паралельны форк з 6 даў 0,75, гэтага я растлумачыць не магу.

З дыяпазонам усё наадварот. Свае 0,69 ён выйграў у паслядоўнага кода пасля скачка. Да скачка паслядоўная сума займае 0,39, а мая лепшая паралельная ітэрацыя 0,64. Правіла двух прагонаў мяне не ўратавала, прагрэў быў 3,5 секунды ў адным і 1,2 у другім.

LinkedList і LongStream.iterate прайграюць па абодва бакі скачка, іх 6,88 і 12,29 мс большыя за абодва паслядоўныя лікі. У TreeSet 5000 выклікаў займаюць каля 2 хвілін, столькі я не чакаў.

## Як рэжацца крыніца

Я абгарнуў сплітэратары і запісаў, якія кавалкі атрымліваюцца. HashSet даў 4 кавалкі, з іх 2 пустыя: хэш невялікага Long і ёсць сам лік, таму мільён лікаў запар займае толькі ніжнюю палову табліцы.

Па LinkedList можна толькі ісці. Яго `trySplit` капіюе элементы ў масіў, спачатку 1024, потым 2048, потым 3072 і гэтак далей. Выйшла 38 такіх порцый і рэшта ў 241 216 элементаў. Пакуль капіюецца чарговая порцыя, другому патоку даступна толькі тое, што адрэзана раней.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Кавалкі мільёна элементаў у адным маштабе. ArrayList: 4 роўныя кавалкі па 250 000. HashSet: 524 287 і 475 713 і яшчэ 2 пустыя кавалкі. LinkedList: 38 порцый ад 1024 да 38 912 і рэшта 241 216. Stream.iterate: 62 порцыі ад 1024 да 63 488, разам 1 999 872, усё пасля першага мільёна непатрэбнае.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">ArrayList</text>
  <rect x="20.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="100.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="180.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="260.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="43.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">4 × 250 000</text>
  <text x="20.0" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">HashSet</text>
  <rect x="20.00" y="90.0" width="167.77" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="187.77" y="90.0" width="152.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="105.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">яшчэ 2 кавалкі пустыя</text>
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
  <text x="352.0" y="167.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">рэшта 241 216</text>
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
  <text x="340.0" y="260.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">трэба 1 000 000</text>
  <text x="660.0" y="260.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">вылічана 1 999 872</text>
</svg>
<figcaption>Кавалкі, якія дасталіся 2 патокам, у адным маштабе. Для Stream.iterate паказаны самы часты выпадак, 62 порцыі адноўлены па лічыльніку плюс першы лік. Частка пасля рыскі вылічана і выкінута.</figcaption>
</figure>

`Stream.iterate` рэжацца па той жа арыфметыцы, але даўжыні ў яго няма і порцыі ідуць далей. У кожным запуску з лічыльнікам колькасць выклікаў роўная `1024*k*(k+1)/2 - 1` з цэлым k. На мільён хапае k = 44. З адным рабочым патокам 62 выйшла ў 26 запусках з 30. Я запусціў тую ж праграму яшчэ 2 разы, другі раз 62 было ў 28 запусках, трэці толькі ў 10, астатнія апускаліся да 44. Так што лік з загалоўка выпаў 64 разы з 90 і большага за яго я не бачыў. З 3 рабочымі ў 29 запусках з 30 было 45. `LongStream.iterate` лічыць на крок наперад, у яго ў лічыльніку 1 999 872, за 3 запускі праграмы гэта 30, 23 і 21 раз.

Наколькі я зразумеў зыходны код, элементы вылічвае той паток, які рэжа, і робіць гэта, пакуль не даведаецца, што ліміт набраны. Чаму менавіта 62, я не знайшоў. Javadoc метаду `limit` папярэджвае, што на ўпарадкаваных паралельных канвеерах ён можа абысціся даволі дорага, я гэта чытаў і думаў пра буферы.

## Даўжыня

Далей дыяпазон, дзе кожны элемент каштуе 0 або 50 раўндаў xorshift, у прагоне 1 гэта прыкладна 5 і 90 нс. На 10 танных элементах паралельная сума была павольнейшая ў 13,78 і 12,47 раза, 1,2 мкс супраць 0,1. На 1000 танных яна ўсё яшчэ прайгравала, 1,90 і 1,44, затое 1000 дарагіх дала нічыю, 1,13 і 0,84. Значыць, адной даўжыні мала. Я чакаў, што танны варыянт дагоніць каля 10 000 элементаў, там выйшла 0,68 і 0,83. Лепшая клетка сеткі 0,58, прычым другі прагон у ёй жа даў 0,95.

## Сусед, які спіць

Агульны пул адзін на ўсю JVM. Вылічэнне, якое паслядоўна займае 162 мс, паралельна заняло 111. Потым іншы паток запусціў паралельны `forEach` з 8 выклікаў sleep па 400 мс. Той, хто яго выклікаў, спіць, адзіны рабочы паток пула таксама спіць і мой паралельны стрым заняў 194 мс. Паслядоўны варыянт побач з тым жа суседам заняў 200.

Потым 20 выклікаў sleep па 50 мс, нібыта гэта запыты. Паслядоўна 1003 мс, з `parallel()` 501, са звычайным executor на 20 патокаў 93. Прыём з уласным `ForkJoinPool(20)` даў 258. З 20 патокаў працавалі толькі 4, па 5 выклікаў на кожны.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="20 выклікаў sleep па 50 мілісекунд, намаляваных блокамі на патоках. Агульны пул з адным рабочым: 2 патокі па 10 выклікаў, вымерана 501 мс. Свой ForkJoinPool на 20: 4 патокі па 5 выклікаў і 16 без працы, вымерана 258 мс. Executor на 20 патокаў: па адным выкліку, вымерана 93 мс.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel(), агульны пул: 2 патокі, 501 мс</text>
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
  <text x="20.0" y="98.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel() у ForkJoinPool(20): 4 патокі, 258 мс</text>
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
  <text x="20.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">яшчэ 16 патокаў без працы</text>
  <text x="20.0" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">executor: 20 патокаў, 93 мс</text>
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
<figcaption>20 выклікаў sleep па 50 мс. Блок абазначае адзін выклік sleep, радок адзін паток. Час вымераны, гэта медыяны.</figcaption>
</figure>

Адказ знайшоўся ў зыходным кодзе `AbstractTask`: `LEAF_TARGET` там роўны `ForkJoinPool.getCommonPoolParallelism() << 2`. Стрым выконваецца ў маім пуле, а нарэзаны пад агульны. Пры паралелізме агульнага пула 3 той жа код заняў усе 20 патокаў і ўклаўся ў 72 мс.

## Чаго я не правяраў

Больш за 2 ядры ў бенчмарках, іншыя зборшчыкі смецця і іншыя зборкі JDK я не спрабаваў. Доўгіх запускаў у мяне па адным або па 2 на крыніцу: што скачок ёсць, я ведаю, а як часта яго не бывае, не. Выклікі sleep гэта ўсяго толькі sleep, сапраўдны запыт можа чакаць яшчэ кагосьці. `parallel()` я цяпер буду ставіць пасля замеру, але пакуль у мяне ёсць лікі толькі для сум.
