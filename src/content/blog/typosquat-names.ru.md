---
title: "Что ловит проверка на одну букву в тайпсквоттинге npm"
description: "Я думал, что проверка имён на одну правку от популярных пакетов npm поймает большинство тайпсквотов. На 417 известных вредоносных именах она ловит половину, помечает 27 196 имён реестра, а мой первый рейтинг популярности оказался 2016 года."
date: 2021-02-12
lang: ru
translationKey: typosquat-names
tags: ["dependencies", "open-data"]
---
Во вторник Алекс Бирсан опубликовал пост про dependency confusion. Он пронёс код в сборки Apple и Microsoft через публичные пакеты с такими же именами, как у их внутренних. Я прочитал его два раза. Атака другая, но она напомнила мне о более старой и простой. Кто-то публикует `reqest` и ждёт человека, который слишком быстро печатает.

Пакеты я ставлю, набирая имя по памяти. Что лежит на расстоянии одной буквы от имён, которые я набираю, я не смотрел ни разу. Защита, которую я всегда себе представлял, простая. Перед установкой проверить, не отстоит ли имя на одну правку от популярного пакета. Если да, спросить "вы имели в виду?". Я был уверен, что она поймает большинство атак, потому что атакующим нужны большие пакеты. И был уверен, что мешать она будет редко. Поэтому я это померил.

## Данные

Для npm я взял `all-the-package-names` 1.3905.0. Это последний релиз, от 22 ноября 2019 года, в нём 1 106 544 имени. Для PyPI взял простой индекс от 30 января с 286 566 именами. Популярность там это список 4000 самых скачиваемых проектов за январь.

Заведомо вредоносные имена я взял из GitHub Advisory Database: 419 бюллетеней о вредоносных пакетах npm, опубликованных до сегодняшнего дня, про 417 имён. Большинство добавили туда в сентябре прошлого года. Мой первый фильтр оставлял только заголовки со словом "Malicious" и потерял 48 бюллетеней с заголовками вроде "X is malware". Среди них был `crossenv` 2017 года, случай, который приводят все. Я заметил это только при втором проходе по данным. Для PyPI такой базы нет, поэтому я взял 2 публичных отчёта, где назван пакет, под который маскировались. Первый это бюллетень SK-CSIRT от сентября 2017 года с 10 поддельными пакетами. Второй это отчёт про `jeIlyfish` и `python3-dateutil` от декабря 2019 года.

У проверки 4 правила. Имя подозрительно, если оно отличается от популярного имени одним удалением, вставкой или заменой символа. Оно подозрительно, если переставлены 2 соседних символа или если отличие только в пунктуации. Последнее правило это популярное имя плюс частый префикс или суффикс вроде `node-` или `-js`.

## Многое здесь не про имена

У 108 из 417 вредоносных имён нет соседа по этим правилам нигде в реестре, ни среди популярных, ни среди остальных. Многие из них это тестовые загрузки с именами вроде `harmlesspackage`. А некоторые это атаки, которым похожее имя и не было нужно. `flatmap-stream`, который в 2018 году попал в `event-stream`, тоже среди них. Есть среди них и `eslint-scope`, настоящий пакет, опубликованный с украденного аккаунта. Обе истории я знал, но ни разу не спросил себя, какую долю проблемы они составляют.

## Рейтинг, который я не проверил

Список пакетов приходит отсортированным по популярности, поэтому сначала я взял его порядок. Топ 1000 поймал 87 имён и пометил ещё 9451 имя. Потом я посмотрел, что он пропускает. Самой большой группой оказались 46 имён вокруг `buffer-xor`, который стоял на месте 10 931. В январе его скачали 41 миллион раз.

Только тогда я прочитал, откуда берётся порядок. Это `dependent-counts` 2.0.0, опубликованный 26 декабря 2016 года. Он считает и devDependencies, поэтому первым идёт `mocha`. И ранжирует он только 86 143 имени. Остальной миллион имён идёт без всякого порядка по популярности. Выходит, для атаки 2021 года я взял рейтинг 2016 года и не посмотрел на него.

Я запросил у API скачиваний npm данные за январь 2021 года по этим 86 143 именам. Он принимает 128 имён за запрос и быстро начинает отвечать 429, так что это заняло больше часа. `buffer-xor` поднялся на место 610, а `webpack-cli` с места 14 123 на 1005.

## Полнота против шума

По скачиваниям картина такая:

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Для каждого среза имён npm по скачиваниям за январь 2021 года показано, сколько из 417 известных вредоносных имён ловит проверка и сколько имён реестра она помечает: топ 100: 22 / 1093; топ 1000: 108 / 6425; топ 8568 *: 215 / 27 196; топ 30 000: 237 / 54 543. У 108 вредоносных имён нет соседа во всём реестре.">
  <text x="100" y="16" text-anchor="start" class="f-muted" style="font-size:11px">поймано вредоносных имён из 417</text>
  <text x="440" y="16" text-anchor="start" class="f-muted" style="font-size:11px">помечено имён реестра</text>
  <text x="90" y="43" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 100</text>
  <rect x="100.0" y="31.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="31.0" width="14.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="120.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">22</text>
  <rect x="440.0" y="31.0" width="3.2" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="449.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">1093</text>
  <text x="90" y="73" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 1000</text>
  <rect x="100.0" y="61.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="61.0" width="69.9" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="175.9" y="74" text-anchor="start" class="f-mono" style="font-size:12px">108</text>
  <rect x="440.0" y="61.0" width="18.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="464.8" y="74" text-anchor="start" class="f-mono" style="font-size:12px">6425</text>
  <text x="90" y="103" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 8568 *</text>
  <rect x="100.0" y="91.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="91.0" width="139.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="245.2" y="104" text-anchor="start" class="f-mono" style="font-size:12px">215</text>
  <rect x="440.0" y="91.0" width="79.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="525.8" y="104" text-anchor="start" class="f-mono" style="font-size:12px">27 196</text>
  <text x="90" y="133" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 30 000</text>
  <rect x="100.0" y="121.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="121.0" width="153.5" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="259.5" y="134" text-anchor="start" class="f-mono" style="font-size:12px">237</text>
  <rect x="440.0" y="121.0" width="160.0" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="606.0" y="134" text-anchor="start" class="f-mono" style="font-size:12px">54 543</text>
  <line x1="300.1" y1="28" x2="300.1" y2="152" class="f-line" style="stroke:var(--ink);stroke-dasharray:4 3"/>
  <text x="300.1" y="166" text-anchor="middle" class="f-muted" style="font-size:11px">у 309 есть хоть какой-то сосед</text>
  <text x="100" y="186" text-anchor="start" class="f-muted" style="font-size:11px">* все имена от 15 000 скачиваний в неделю, граница SpellBound</text>
</svg>
<figcaption>Имена npm на 22 ноября 2019 года (1 106 544), ранжированные по скачиваниям за январь 2021 года. Слева: сколько из 417 вредоносных имён из GitHub Advisory Database отстоят от имени из топ N на одну правку, перестановку или смену пунктуации либо отличаются от него частым аффиксом. Пунктир это 309 имён, у которых такой сосед есть хоть где-то в реестре. Справа: сколько других имён реестра помечают те же правила.</figcaption>
</figure>

Топ 1000 теперь ловит 108 имён вместо 87 и помечает 6425 вместо 9451. SpellBound, статья марта прошлого года, считает популярным пакет от 15 000 скачиваний в неделю. Здесь это 8568 имён. Проверка ловит 215 из 417 и помечает 27 196 имён, 2,5% реестра. Моё ожидание не сбылось дважды. У большинства вредоносных имён нет соседа в топ 1000. А помеченных имён тысячи, так что руками их никто разбирать не будет.

Некоторые цели такие, как я ожидал. У `request` в списке 2019 года 51 зарегистрированное имя на расстоянии одной правки. 18 из них есть в бюллетенях, от `reqest` до `rrequest`. Но `request` стоит на месте 130, так что список топ 100 не защитил бы даже его.

## Кто набирает `bwffer-xor`

Имена вокруг `buffer-xor` странные ещё в одном отношении:

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="46 вредоносных имён npm на расстоянии одного символа от buffer-xor. Опечаток соседней клавишей среди них 9: budfer-xor, bufder-xor, buffdr-xor, buffer-xkr, buffer-zor, bufger-xor, bufver-xor, bugfer-xor, buvfer-xor. Остальные это замены, которых не даёт соскользнувший палец.">
  <rect x="22.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="40" y="14" text-anchor="start" class="f-muted" style="font-size:11px">соседняя клавиша (9)</text>
  <rect x="352.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.6;stroke:none"/>
  <text x="370" y="14" text-anchor="start" class="f-muted" style="font-size:11px">любая другая замена (37)</text>
  <text x="340" y="40" text-anchor="middle" class="f-ink f-mono" style="font-size:15px">buffer-xor</text>
  <text x="22" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">b5ffer-xor</text>
  <text x="150" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">beffer-xor</text>
  <text x="278" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bqffer-xor</text>
  <text x="406" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">btffer-xor</text>
  <text x="534" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bubfer-xor</text>
  <text x="22" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">budfer-xor</text>
  <text x="150" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufber-xor</text>
  <text x="278" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufder-xor</text>
  <text x="406" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffar-xor</text>
  <text x="534" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffdr-xor</text>
  <text x="22" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffe2-xor</text>
  <text x="150" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffeb-xor</text>
  <text x="278" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffep-xor</text>
  <text x="406" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-8or</text>
  <text x="534" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-hor</text>
  <text x="22" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-por</text>
  <text x="150" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xgr</text>
  <text x="278" y="122" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-xkr</text>
  <text x="406" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xmr</text>
  <text x="534" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xnr</text>
  <text x="22" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xo2</text>
  <text x="150" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xob</text>
  <text x="278" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xop</text>
  <text x="406" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xos</text>
  <text x="534" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xov</text>
  <text x="22" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xoz</text>
  <text x="150" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-yor</text>
  <text x="278" y="162" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-zor</text>
  <text x="406" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffermxor</text>
  <text x="534" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffes-xor</text>
  <text x="22" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffev-xor</text>
  <text x="150" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffez-xor</text>
  <text x="278" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffgr-xor</text>
  <text x="406" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffmr-xor</text>
  <text x="534" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffur-xor</text>
  <text x="22" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufger-xor</text>
  <text x="150" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufner-xor</text>
  <text x="278" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufver-xor</text>
  <text x="406" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bugfer-xor</text>
  <text x="534" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bunfer-xor</text>
  <text x="22" y="222" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buvfer-xor</text>
  <text x="150" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bwffer-xor</text>
  <text x="278" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">cuffer-xor</text>
  <text x="406" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">fuffer-xor</text>
  <text x="534" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">juffer-xor</text>
  <text x="22" y="242" text-anchor="start" class="f-muted f-mono" style="font-size:12px">ruffer-xor</text>
</svg>
<figcaption>Все 46 вредоносных имён из GitHub Advisory Database на расстоянии одной правки от пакета вверху. В каждом заменён один символ. Цветом выделены имена, где новый символ стоит на соседней клавише QWERTY, их 9. Серым все остальные замены.</figcaption>
</figure>

Все 46 той же длины, что и оригинал, в каждом заменён один символ. Только 9 из них это опечатки, которые может сделать человек, задев соседнюю клавишу. `bwffer-xor` или `buffer-8or` не получатся от соскользнувшего пальца. Думаю, здесь скрипт прошёлся по алфавиту, но доказать этого не могу. SpellBound сам приводит `bwffer-xor` в пример и пишет, что такие имена авторы сознательно не помечают, потому что предупреждений было бы слишком много.

## Популярные имена близки друг к другу

Внутри топ 1000 npm по скачиваниям есть 44 пары имён на расстоянии одной правки, например `qs` и `ws` или `through2` и `through`. В топ 1000 PyPI таких пар 24, среди них `boto3` и `boto`. Проверка, которая предупреждает о любом близком имени, предупредит и о `qs`, поставленном нарочно. Поэтому она должна быть односторонней и срабатывать только на имя, которое само непопулярно.

## Пунктуация и PyPI

PyPI нормализует имена, поэтому `python_dateutil` и `Python.Dateutil` это один проект и второе имя никто зарегистрировать не может. В npm похожее правило действует с 26 декабря 2017 года: новое имя не может отличаться от существующего только пунктуацией. Моё правило про разделители ловит 4 имени с целью в топ 10 000. Все 4, среди них `crossenv` и `nodesass`, опубликованы одним аккаунтом в июле 2017 года, до этого правила.

Из 12 старых атак на PyPI 7 отстоят на одну правку от пакета, под который они маскировались. Остальные 5 это имена вроде `telnet` для `telnetsrvlib`. Моя проверка пропускает 4 из них, а пятый, `pwd`, помечает как соседа `pid`, пакета, под который он никогда не маскировался.

## Что я из этого беру

SpellBound Тейлора и соавторов сделал это как следует. Они используют скачивания и правила про соседние клавиши и предупреждают, только когда непопулярное имя близко к популярному. В их статье есть даже цифра в 3% помеченных пакетов и пары близких популярных имён. Я пришёл туда же более длинной дорогой, зато теперь понимаю, почему их правила выглядят именно так.

Себе я оставлю проверку при установке, по имени, которое я набираю. Популярность в ней будет по скачиваниям, а не по числу зависимых пакетов. Она ловит ошибки вроде `reqest`, но против `flatmap-stream` или украденного аккаунта не делает ничего. Там у меня всё так же только файл с зафиксированными версиями и чтение того, что я добавляю.

## Чего я не проверял

Список npm от 22 ноября 2019 года, поэтому более новых имён в нём нет, среди них 51 вредоносное. Скачивания у меня есть только для имён, у которых в 2016 году были зависимые. Популярного нового пакета вроде `prettier` с 48 миллионами скачиваний в январе в моём рейтинге нет. Значит, настоящие места ниже, а число помеченных это нижняя граница. Что пакеты вредоносные, я поверил GitHub на слово. Для каждого вредоносного имени целью я считал самого популярного соседа, а это не всегда тот пакет, под который маскировался атакующий. Я не мерил, какие опечатки люди делают на самом деле. Имена со скоупом я не пробовал вообще.
