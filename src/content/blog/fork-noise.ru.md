---
title: "В README я написал, что этому замеру нужна разница в 2 раза. Когда ему дали известную задержку, он увидел 3%"
description: "В README своего замера предпросмотра я написал, что харнесс не различит 2 стратегии в пределах двукратной разницы. Я дал ему активное ожидание известного размера на PostgreSQL 16.14 и OpenJDK 21: 10 JVM на задержку, по 300 пар. Парно внутри одной JVM он увидел 25 мкс на 800 (3%) в 10 JVM из 10, хотя медианы JVM расходились на треть. Сравнение 2 отдельных прогонов верно определило знак задержки 100 мкс в 68 случаях из 90, а порядок блоками из первой версии назвал блок, медленнее на 50 мкс, более быстрым в 7 JVM из 10."
date: 2026-09-30
lang: ru
translationKey: fork-noise
tags: ["performance", "statistics"]
---
В августе я измерил, сколько стоит живое превью, если строить его на откате транзакции. Харнесс я выложил на GitHub как [`preview-cost`](https://github.com/dimhold/preview-cost). На 4500 парах откат каждый раз проигрывал копии в памяти, медианная разница вышла от 6 до 7 мс. В README я написал ещё и абзац про шум. На 40 планах медианы 5 отдельных JVM лежали от 5,43 до 7,79 мс на одинаковых входах. Отсюда я вывел, что если бы 2 стратегии отличались "within 2× of each other, this harness could not have told them apart". То есть в пределах двукратной разницы харнесс бы их не различил. Та же фраза добавляла, что не различил бы их и ничей другой одиночный прогон.

Фраза мне нравилась, потому что звучала скромно. Я её так и не проверил. Это утверждение о том, что харнесс способен увидеть. Такое можно измерить, если дать харнессу эффект, размер которого я знаю заранее.

## Задержка известного размера

В каждой паре одно и то же превью с откатом из репозитория выполняется дважды. Ко второму запуску добавлено активное ожидание, `Thread.onSpinWait()` до тех пор, пока `System.nanoTime()` не пройдёт заданный срок. Значит он стоит на `d` микросекунд дороже, плюс несколько десятков наносекунд. Я перебрал 8 значений `d` от 0 до 500 мкс. Для каждого запускалось 10 свежих JVM, в каждой 300 пар после 80 пар разогрева. Внутри JVM превью без задержки и превью с задержкой меняются местами случайно в каждой паре, как в исходном `Bench`.

На этот раз замер шёл на PostgreSQL 16.14, установленном локально, а не в Docker, на OpenJDK 21.0.12.1 в виртуальной машине с 4 vCPU. Репозиторий просит у Gradle JDK 25, но нужные мне классы не используют ничего новее records и text blocks, поэтому я собрал их обычным `javac` вместе с новым раннером. В этой конфигурации превью с откатом стоит от 0,7 до 1,1 мс вместо 6,5. Исходное сравнение остаётся в силе: откат был медленнее в 2998 парах из 3000.

Разброс тоже вернулся. При `d = 0` оба превью в паре одинаковые и медианы 10 JVM лежали от 746 до 1005 мкс. Это треть величины для одной и той же команды на одной и той же машине. У копии в памяти в исходном сравнении одна JVM дала 278 мкс, а у остальных 9 было от 77 до 102.

<figure class="fig">
<svg viewBox="0 0 640 272" role="img" aria-label="Две панели, по строке на JVM, 10 строк. Слева медиана превью с откатом без задержки в каждой JVM, от 743 до 956 микросекунд. Справа медиана парных разностей с 95% интервалом, от 8 до 52 микросекунд, все интервалы выше нуля, вокруг пунктирной линии на истинном значении 25.">
  <text x="40" y="22" class="f-mono f-muted" style="font-size:11px">медиана без задержки, мкс</text>
  <text x="380" y="22" class="f-mono f-muted" style="font-size:11px">парная разность, мкс</text>
  <line x1="40" y1="38" x2="40" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="40" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">700</text>
  <line x1="136.66666666666666" y1="38" x2="136.66666666666666" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="136.66666666666666" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="233.33333333333331" y1="38" x2="233.33333333333331" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="233.33333333333331" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">900</text>
  <line x1="330" y1="38" x2="330" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="330" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="412.85714285714283" y1="38" x2="412.85714285714283" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="412.85714285714283" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="495" y1="38" x2="495" y2="244" class="f-line" style="stroke-dasharray:4 3;stroke:var(--accent)"/>
  <text x="495" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="577.1428571428571" y1="38" x2="577.1428571428571" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="577.1428571428571" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="499" y="34" class="f-mono f-accent" style="font-size:11px">истинные +25</text>
  <circle cx="81.1" cy="46" r="4.5" style="fill:var(--ink)"/>
  <line x1="470.9" y1="46" x2="535.9" y2="46" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="506.5" cy="46" r="4" style="fill:var(--accent)"/>
  <circle cx="112.1" cy="66" r="4.5" style="fill:var(--ink)"/>
  <line x1="462.2" y1="66" x2="525.0" y2="66" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="496.4" cy="66" r="4" style="fill:var(--accent)"/>
  <circle cx="112.6" cy="86" r="4.5" style="fill:var(--ink)"/>
  <line x1="448.6" y1="86" x2="552.3" y2="86" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="498.3" cy="86" r="4" style="fill:var(--accent)"/>
  <circle cx="129.9" cy="106" r="4.5" style="fill:var(--ink)"/>
  <line x1="459.7" y1="106" x2="533.9" y2="106" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="487.8" cy="106" r="4" style="fill:var(--accent)"/>
  <circle cx="148.9" cy="126" r="4.5" style="fill:var(--ink)"/>
  <line x1="460.3" y1="126" x2="523.8" y2="126" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="492.7" cy="126" r="4" style="fill:var(--accent)"/>
  <circle cx="149.2" cy="146" r="4.5" style="fill:var(--ink)"/>
  <line x1="452.6" y1="146" x2="581.2" y2="146" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="505.9" cy="146" r="4" style="fill:var(--accent)"/>
  <circle cx="181.7" cy="166" r="4.5" style="fill:var(--ink)"/>
  <line x1="441.6" y1="166" x2="522.0" y2="166" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="480.5" cy="166" r="4" style="fill:var(--accent)"/>
  <circle cx="223.5" cy="186" r="4.5" style="fill:var(--ink)"/>
  <line x1="468.4" y1="186" x2="578.0" y2="186" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="523.1" cy="186" r="4" style="fill:var(--accent)"/>
  <circle cx="256.5" cy="206" r="4.5" style="fill:var(--ink)"/>
  <line x1="463.1" y1="206" x2="512.1" y2="206" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="484.8" cy="206" r="4" style="fill:var(--accent)"/>
  <circle cx="287.5" cy="226" r="4.5" style="fill:var(--ink)"/>
  <line x1="439.5" y1="226" x2="530.2" y2="226" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="490.2" cy="226" r="4" style="fill:var(--accent)"/>
</svg>
<figcaption>Превью с задержкой медленнее на 25 мкс по построению. В медиане превью без задержки JVM расходятся примерно на 210 мкс, но в каждой из них парная разность выше нуля.</figcaption>
</figure>

## Что видит одна JVM

Для каждой JVM я взял разности внутри пар и интервал бутстрепа для их медианы, 2000 перевыборок. Задержку я считаю увиденной, когда весь интервал лежит выше нуля.

| истинная задержка | JVM, которые её увидели | все 3000 пар, медиана и 95% интервал |
|---|---|---|
| 0 мкс | 0 из 10 | 0,6 мкс [−3,1; 3,7] |
| 5 мкс | 3 из 10 | 8,1 мкс [5,1; 11,1] |
| 10 мкс | 6 из 10 | 12,2 мкс [8,1; 15,3] |
| 25 мкс | 10 из 10 | 25,0 мкс [21,5; 28,7] |

25 мкс поверх примерно 800 это 3% и все 10 JVM их нашли. Медианы превью без задержки в тех же JVM расходились примерно на 210 мкс. Ни при одной задержке ни у одной JVM весь интервал не оказался ниже нуля, включая прогон A/A. Значит для этого харнесса моя фраза была осторожнее нужного примерно в 30 раз, двукратная разница против 3%.

Объясняет это парность. От JVM к JVM медиана превью без задержки и медиана превью с задержкой меняются вместе. Корреляция от 0,95 до 0,996, в зависимости от задержки. Моя догадка такая: то, что делает одну JVM медленнее, оплачивают обе половины пары, поэтому в разности почти всё это сокращается.

## Где фраза верна

Верна её вторая половина и она описывает другую процедуру. Эту процедуру я и сам использую чаще всего: запустил, что-то поменял, запустил ещё раз, сравнил 2 медианы. Я смоделировал её так: медиана без задержки из одной JVM, медиана с задержкой из другой. 10 JVM дают 90 таких сочетаний.

<figure class="fig">
<svg viewBox="0 0 640 154" role="img" aria-label="Сетка из 3 строк и 8 колонок для истинных задержек 0, 5, 10, 25, 50, 100, 250 и 500 микросекунд. В каждой клетке сказано, как часто способ назвал превью с задержкой более медленным. Парно в одной JVM, из 10: 0, 3, 6, 10, 10, 10, 10, 10. 2 отдельных прогона, из 90: 47, 50, 46, 52, 62, 68, 90, 90. Блоками в одной JVM, из 10: 2, 3, 0, 4, 3, 6, 10, 10. На задержке 0 каждый ответ ложный.">
  <text x="170" y="18" class="f-mono f-muted" style="font-size:11px">истинная задержка, мкс</text>
  <text x="198" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="254" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">5</text>
  <text x="310" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10</text>
  <text x="366" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">25</text>
  <text x="422" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50</text>
  <text x="478" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">100</text>
  <text x="534" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">250</text>
  <text x="590" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">500</text>
  <text x="160" y="65" text-anchor="end" class="f-mono f-ink" style="font-size:11px">парно, одна JVM</text>
  <rect x="172" y="46" width="52" height="30" style="fill:var(--muted);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="228" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="340" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="396" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="452" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="508" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <text x="160" y="99" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 отдельных прогона</text>
  <rect x="172" y="80" width="52" height="30" style="fill:var(--muted);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">47/90</text>
  <rect x="228" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.34;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50/90</text>
  <rect x="284" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">46/90</text>
  <rect x="340" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.35;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">52/90</text>
  <rect x="396" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.40;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">62/90</text>
  <rect x="452" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.44;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">68/90</text>
  <rect x="508" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <rect x="564" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <text x="160" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">блоками, одна JVM</text>
  <rect x="172" y="114" width="52" height="30" style="fill:var(--muted);fill-opacity:0.16;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2/10</text>
  <rect x="228" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="340" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.26;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">4/10</text>
  <rect x="396" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="452" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="508" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
</svg>
<figcaption>Как часто каждый способ сказал, что превью с задержкой медленнее. В парной строке JVM засчитывается, только если весь 95% интервал выше нуля; в 2 других строках учитывается знак разности медиан. На 0 мкс оба превью одинаковые и каждый засчитанный ответ ложный.</figcaption>
</figure>

На 100 мкс, это 12% величины, знак верно определили 68 сравнений из 90. Их оценки были от −157 до +385 мкс. На 50 мкс вышло 62 из 90, а совсем без задержки 47 из 90 сказали, что второе превью медленнее. Только на 250 мкс, что близко к разбросу между JVM, все 90 показали в правильную сторону.

## Первая версия

Первая версия харнесса мерила сначала все превью с откатом, потом все превью в памяти, внутри одной JVM. Она ушла гистом 14 августа с одной медианой на конфигурацию: 4,85; 4,96 и 7,79 мс. Меньше чем через 2 часа я заменил её парной, потому что знал, что порядок блоками неверен в принципе. Насколько неверен, я не знал, поэтому прогнал и такой порядок. Мой раннер оставляет разогрев новой версии, так что он повторяет порядок старой, но не её целиком.

В случае A/A второй блок вышел быстрее первого в 8 JVM из 10, на величину от 119 до 173 мкс. В остальных 2 он был медленнее на 10 и 16. С истинной задержкой 50 мкс на втором блоке 7 JVM из 10 назвали его более быстрым. На 100 мкс таких было 4 из 10. Отделить порядок от времени, которое JVM уже успела проработать, я не могу: в этой схеме это одно и то же. Рядом с августовскими 6 мс смещение такого размера ничего бы не поменяло, но в той конфигурации я его не мерил.

## Чего я не проверял

Я не знаю, почему JVM расходятся на треть. Я не смотрел логи JIT и не смотрел, что ещё крутится на этой виртуальной машине. Есть и мелочь, которую я не могу объяснить. На 250 и 500 мкс оценка по всем парам вместе 244,7 и 488,5 и ни один интервал не доходит до истинного значения. Активное ожидание не может закончиться раньше срока, значит часть разности теряется где-то ещё. Мой раннер не записывает, какое превью шло первым, поэтому сказать, где именно, я не могу. На 5 мкс оценка 8,1. Это выше истинного значения и это я тоже объяснить не могу. Все числа получены одним проходом сетки, а не медианой нескольких проходов.

Как метод всё это не ново. Georges, Buytaert и Eeckhout в 2007 году предлагали интервалы по нескольким запускам VM. Kalibera и Jones в 2013 году вывели, сколько повторов нужно на каждом уровне. А проверил я только свою фразу на своём коде. Если бы я писал эту строку README сегодня, она была бы про 2 отдельных прогона. В этой конфигурации они не различили бы варианты, которые отличаются меньше чем примерно на 30%. Внутри одной JVM хватило 25 мкс.
