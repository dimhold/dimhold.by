---
title: "В README я написал, что H2 не воспроизводит мои числа с Postgres. По TCP он лёг рядом с локальным Postgres"
description: "В README моего замера превью написано, что H2 в памяти не воспроизводит, во что настоящей базе обходятся запись и сброс. Я запустил неизменённый харнесс на H2 2.3.232 и на локальном PostgreSQL 16.14. H2 дал тот же вердикт со штрафом 0,5 мс против 0,8-1,2. H2 как TCP-сервер лёг в пределах 0,1 мс от локального Postgres на тихой машине. Прокси, задерживающий каждое из 3 обращений к серверу, выходит на 6 мс из README примерно при 1,6 мс на обращение. Обещание 10 секунд верно со второго запуска, первый занял 24 с."
date: 2026-09-29
lang: ru
translationKey: preview-cost-h2
tags: ["databases", "performance"]
---
В августе я выложил на GitHub небольшой замер, [`preview-cost`](https://github.com/dimhold/preview-cost). Он спрашивает, во что обходится живое превью, если построить его на откате транзакции. Превью записывает значения с ползунка, читает модель обратно, считает и откатывается. Вторая стратегия это копия в памяти, которая базу не трогает вообще. На Postgres 16 в Docker откат проиграл во всех 4500 парах, на 40 планах на 6,16 мс.

Раздел README про запуск даёт 2 обещания. По умолчанию стоит H2 в режиме Postgres, поэтому обещан прогон за 10 секунд "with nothing installed". А числа в таблице сняты с настоящего Postgres, "because H2 in memory does not reproduce what a write and discard costs a real database".

Вторую фразу я написал, ни разу толком не посмотрев на прогон с H2. Так про H2 говорят все и я сам говорю так же, когда кто-то хочет тестировать на нём. Берите настоящую базу, встроенная врёт. Выходит, режим по умолчанию в моём репозитории это режим, который, по словам того же README, чисел не воспроизводит. На этот раз я его запустил.

## 10 секунд

Я склонировал репозиторий на коммите `26dd519` в пустой каталог с пустым кешем Gradle, на виртуалке с 4 vCPU и Gradle 9.8.0. Обёртки Gradle в репозитории нет, так что "nothing installed" уже значит JDK 25 плюс Gradle. Справедливости ради, README говорит это в предложении прямо перед обещанием.

Когда на машине только JDK 21, сборка останавливается через 16 с. Тулчейн просит версию 25, а скачать её Gradle неоткуда. С Temurin 25.0.4.1 первый `gradle run` на пустом кеше занял 24 с. Следующие 3 запуска заняли по 6-7 с. Значит, обещание 10 секунд верно со второго запуска. Тот, кто клонирует репозиторий впервые, ждёт 24 с.

## Что говорит H2

Прогон по умолчанию это 5 свежих JVM по 300 парных превью в каждой. Я запустил неизменённый `Bench` на H2 2.3.232 в памяти и на PostgreSQL 16.14, поставленного локально на ту же виртуалку, с pgjdbc 42.7.4. Каждый размер прошёл дважды. В таблице медиана разности "откат минус копия".

| планы | H2 в памяти | PostgreSQL 16.14, локально | README, Postgres в Docker |
|---|---|---|---|
| 10 | 0,50 / 0,54 мс | 0,78 / 0,76 мс | 6,54 мс |
| 40 | 0,50 / 0,46 мс | 0,91 / 0,83 мс | 6,16 мс |
| 120 | 0,49 / 0,47 мс | 1,22 / 1,18 мс | 7,02 мс |

На каждой базе и каждом размере откат был медленнее в 99,4-100% пар. H2 даёт тот же вердикт, что и README, только число в 12-15 раз меньше. Локальный Postgres отличается от H2 в 1,4-2,6 раза, а Postgres из README от локального в 6-9 раз.

Я ждал, что на H2 откат станет почти бесплатным, ведь ничего не покидает процесс. Не стал. Я разложил превью с откатом на шаги в одной JVM. На H2 в памяти одно только обновление 4 строк заняло 238-291 мкс. На 40 планах это примерно в 4 раза больше всего расчёта, который занял 59 мкс.

## Где сидит разница

H2 умеет работать и сервером. Это тот же движок с тем же хранением в памяти. Но драйвер говорит с ним через TCP-сокет на localhost, так же как pgjdbc говорит с Postgres. Я добавил его в сетку к остальным, вместе с H2 с файлом на диске. Вариант с файлом совпал с H2 в памяти, 0,49-0,59 мс, поэтому на графике его нет.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Горизонтальные столбцы, 3 группы для 10, 40 и 120 планов. В каждой группе медиана штрафа превью с откатом относительно копии в памяти. 10 планов: H2 в памяти 0,50 / 0,54, H2 по TCP 0,84 / 0,83, локальный PostgreSQL 0,78 / 0,76, README 6,54 мс; 40 планов: H2 в памяти 0,50 / 0,46, H2 по TCP 0,82 / 0,82, локальный PostgreSQL 0,91 / 0,83, README 6,16 мс; 120 планов: H2 в памяти 0,49 / 0,47, H2 по TCP 1,22 / 1,25, локальный PostgreSQL 1,22 / 1,18, README 7,02 мс. H2 по TCP и локальный Postgres расходятся меньше чем на 0,1 мс на каждом размере, числа README с Postgres в Docker больше в 6-9 раз.">
  <line x1="523.3333333333333" y1="22" x2="523.3333333333333" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="470" y1="22" x2="470" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="416.66666666666663" y1="22" x2="416.66666666666663" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="363.33333333333337" y1="22" x2="363.33333333333337" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="310" y1="22" x2="310" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="256.6666666666667" y1="22" x2="256.6666666666667" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="203.33333333333334" y1="22" x2="203.33333333333334" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="150" y1="22" x2="150" y2="256" class="f-line" style="opacity:0.25"/>
  <text x="10" y="66" class="f-mono f-ink" style="font-size:12px">10 планов</text>
  <rect x="150" y="30" width="27.7" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="183.7" y="41" class="f-mono f-ink" style="font-size:11px">0,50 / 0,54  H2 в памяти</text>
  <rect x="150" y="46" width="44.5" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="200.5" y="57" class="f-mono f-ink" style="font-size:11px">0,84 / 0,83  H2 по TCP</text>
  <rect x="150" y="62" width="41.1" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="197.1" y="73" class="f-mono f-ink" style="font-size:11px">0,78 / 0,76  PostgreSQL, локально</text>
  <rect x="150" y="78" width="348.8" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="89" class="f-mono f-muted" style="font-size:11px">6,54  README, Docker</text>
  <text x="10" y="144" class="f-mono f-ink" style="font-size:12px">40 планов</text>
  <rect x="150" y="108" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="119" class="f-mono f-ink" style="font-size:11px">0,50 / 0,46  H2 в памяти</text>
  <rect x="150" y="124" width="43.7" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="199.7" y="135" class="f-mono f-ink" style="font-size:11px">0,82 / 0,82  H2 по TCP</text>
  <rect x="150" y="140" width="46.4" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="202.4" y="151" class="f-mono f-ink" style="font-size:11px">0,91 / 0,83  PostgreSQL, локально</text>
  <rect x="150" y="156" width="328.5" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="167" class="f-mono f-muted" style="font-size:11px">6,16  README, Docker</text>
  <text x="10" y="222" class="f-mono f-ink" style="font-size:12px">120 планов</text>
  <rect x="150" y="186" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="197" class="f-mono f-ink" style="font-size:11px">0,49 / 0,47  H2 в памяти</text>
  <rect x="150" y="202" width="65.9" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="221.9" y="213" class="f-mono f-ink" style="font-size:11px">1,22 / 1,25  H2 по TCP</text>
  <rect x="150" y="218" width="64.0" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="220.0" y="229" class="f-mono f-ink" style="font-size:11px">1,22 / 1,18  PostgreSQL, локально</text>
  <rect x="150" y="234" width="374.4" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="245" class="f-mono f-muted" style="font-size:11px">7,02  README, Docker</text>
  <text x="150" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="203.33333333333334" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="256.6666666666667" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="310" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="363.33333333333337" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="416.66666666666663" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="470" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="523.3333333333333" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150" y="14" class="f-mono f-muted" style="font-size:11px">откат минус копия, мс (по 2 прохода)</text>
</svg>
<figcaption>Столбец это среднее 2 проходов, в подписи оба. H2 по TCP совпадает с локальным Postgres на каждом размере. Столбец README это одно число из августа.</figcaption>
</figure>

H2 по TCP дал 0,84 / 0,83, 0,82 / 0,82 и 1,22 / 1,25 мс. Это в пределах 0,1 мс от локального Postgres на каждом размере, включая подъём на 120 планах. Значит, на этом харнессе большая часть разрыва между H2 и Postgres приходится на сокет и сервер за ним. В моей фразе не было ни того, ни другого. Я проверил ещё раз на той же виртуалке, когда её грузила другая задача. Тогда H2 по TCP оказался на 0,04-0,23 мс выше Postgres на 40 планах, так что 0,1 мс это число с тихой машины.

Запись и сброс различаются меньше, чем я думал. На H2 в памяти обновление заняло 238-291 мкс, на Postgres 312-389 мкс. Шаг отката занял 78-90 мкс против 188-205 мкс, причём Postgres платит за него ещё и обращением к серверу.

Большая часть подъёма с ростом планов приходится на чтение обратно. Каждое превью читает все поля модели, 42 строки на 10 планах и 482 на 120. На Postgres это чтение заняло 387 мкс и 1006 мкс. H2 в памяти отдаёт те же строки за 128 и 174 мкс, думаю, потому что через сокет не идёт ни байта. Мой README назвал накладные расходы "a constant" и сделал это главным выводом. На локальном Postgres они выросли примерно в полтора раза, с 0,76-0,78 мс на 10 планах до 1,18-1,22 мс на 120.

## Обращения к серверу

Превью с откатом на Postgres это 3 обращения к серверу: пачка из 4 обновлений, select и откат. Я посчитал их маленьким прокси между драйвером и базой. 100 превью добавили 300 записей клиента в сокет к тем 12, которые без единого превью ушли на подготовку схемы и начальных строк.

Тот же прокси умеет придерживать каждую запись клиента на заданное время, прежде чем передать её дальше. Это грубая модель более длинного пути до базы. Я прогнал через него неизменённый `Bench` на 40 планах с 5 разными задержками.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Линейный график, 40 планов. По горизонтали задержка, которую прокси добавляет к каждой записи клиента, от 0 до 2000 микросекунд. По вертикали медиана штрафа в миллисекундах. Измеренные точки: 0 мкс 1,12 мс, 250 мкс 2,12 мс, 500 мкс 2,85 мс, 1000 мкс 4,40 мс, 2000 мкс 7,52 мс. Пунктир это точка без задержки плюс утроенная задержка. Без прокси штраф был от 0,83 до 0,91 мс. Горизонтальный пунктир отмечает 6,16 мс из README.">
  <line x1="70" y1="230" x2="600" y2="230" class="f-line" style="opacity:0.25"/>
  <text x="62" y="234" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="177.5" x2="600" y2="177.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="181.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="70" y1="125" x2="600" y2="125" class="f-line" style="opacity:0.25"/>
  <text x="62" y="129" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="70" y1="72.5" x2="600" y2="72.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <line x1="70" y1="20" x2="600" y2="20" class="f-line" style="opacity:0.25"/>
  <text x="62" y="24" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="70" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="136.25" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="202.5" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="335" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="600" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <text x="335" y="266" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">задержка на каждое обращение, мкс</text>
  <text x="70" y="12" class="f-mono f-muted" style="font-size:11px">штраф, мс</text>
  <line x1="70" y1="68.29999999999998" x2="600" y2="68.29999999999998" class="f-line" style="stroke-dasharray:5 3"/>
  <text x="76" y="62.29999999999998" class="f-mono f-ink" style="font-size:11px">README, 40 планов: 6,16</text>
  <line x1="70" y1="200.6" x2="600" y2="43.099999999999994" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="449" y="106.35" class="f-mono f-muted" style="font-size:11px">+3 × задержка</text>
  <line x1="64" y1="208.2125" x2="64" y2="206.1125" style="stroke:var(--ink);stroke-width:6"/>
  <text x="122" y="218.6" class="f-mono f-muted" style="font-size:11px">(без прокси: 0,83-0,91)</text>
  <polyline points="70.0,200.6 136.3,174.3 202.5,155.2 335.0,114.5 600.0,32.6" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="200.6" r="4" style="fill:var(--accent)"/>
  <circle cx="136.3" cy="174.3" r="4" style="fill:var(--accent)"/>
  <text x="128.3" y="166.3" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2,12</text>
  <circle cx="202.5" cy="155.2" r="4" style="fill:var(--accent)"/>
  <text x="194.5" y="147.2" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2,85</text>
  <circle cx="335.0" cy="114.5" r="4" style="fill:var(--accent)"/>
  <text x="327.0" y="106.5" text-anchor="end" class="f-mono f-accent" style="font-size:12px">4,40</text>
  <circle cx="600.0" cy="32.6" r="4" style="fill:var(--accent)"/>
  <text x="592.0" y="24.6" text-anchor="end" class="f-mono f-accent" style="font-size:12px">7,52</text>
  <text x="80" y="218.6" class="f-mono f-accent" style="font-size:12px">1,12</text>
</svg>
<figcaption>После первой задержки измеренный штраф идёт примерно на 0,25 мс выше линии 3 обращений. Уровень README достигается между 1000 и 2000 мкс на обращение.</figcaption>
</figure>

Без задержки сам прокси добавил в том прогоне около 0,2-0,3 мс, 1,12 мс против 0,83-0,91 напрямую. Первые 250 мкс задержки добавили 1 мс, больше, чем 3 раза по 250. Дальше линия идёт вверх примерно на 3 мкс на каждую микросекунду задержки, это и есть 3 обращения. Лишние 0,25 мс, скорее всего, набегают оттого, что прокси каждый раз спит дольше заданного, но отдельно я это не мерил. При 2 мс на обращение штраф составил 7,52 мс, чуть больше чисел README.

Между измеренными точками на 1000 и 2000 мкс уровень 6,16 мс приходится примерно на 1,6 мс на обращение. Это только арифметика. Августовского стенда у меня здесь нет. Этот харнесс выходит на числа README при такой длительности обращения, но утверждать, что у Docker на той машине было именно такое, я не могу.

## Что я бы поменял в README

10 секунд можно оставить, с пометкой, что первый запуск занимает около 25. Во фразе про H2 неверна причина. H2 в памяти даёт тот же вердикт, что и Postgres, а число отличается от локального Postgres меньше чем в 3 раза. У него нет сокета, а H2 в режиме сервера его возвращает. Таблица результатов должна говорить, какой Postgres мерили и насколько он был далеко. По моим числам это расстояние составляет большую часть тех 6 мс.

Вывод исходного README не меняется. 1 мс или 6 мс за дебаунсом в 400 мс пользователь не заметит. Значение имеет цена в строках, записанных и заблокированных на каждое превью.

## Чего я не проверял

Docker я не запускал вообще, ни на какой машине. Нет и конкурентного доступа, который README уже называет следующим шагом и где блокировки начинают обходиться дорого. H2 был только 2.3.232, драйвер только pgjdbc 42.7.4. Сетка прошла дважды, серия с прокси один раз. Для разбора по шагам я брал одну JVM на ячейку, так что его микросекунды приблизительные. На этой виртуалке расчёт ещё и до 2,6 раза быстрее, чем на августовской машине. Копия в памяти занимает 0,17 мс на 120 планах против 0,45 в README. Расчёт в разности сокращается, потому что его выполняют обе половины пары. Но драйвер и база работают на том же процессоре, так что на более медленной машине мои 0,9 мс, вероятно, тоже бы выросли.
