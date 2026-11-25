---
title: "Datomic без ключа лицензии: 68 байт на обновление и 39, если ничего не поменялось"
description: "Datomic Pro 1.0.6733 запускается с ключом лицензии nonsense. Я провёл через него 100 000 обновлений одного числа и столько же через SQLite с триггером истории. В Datomic вышло 68 байт на обновление, в SQLite 30. Обновление, которое пишет то же самое значение, всё равно стоит 39 байт."
date: 2023-06-04
lang: ru
translationKey: datomic-without-licence
tags: ["databases", "numbers", "time"]
---

Я дописал в файл настроек транзактора Datomic строку `license-key=nonsense` и запустил его. Он ответил `System started`. Ключ попал в лог как есть, за 2 минуты ни одной другой строки про лицензию там не появилось. Peer подключился, прочитал 5000 счетов и записал баланс, после чего я остановил процесс сам. Потом я попросил тот же дистрибутив описать этот ключ командой `bin/datomic describe-license` и получил `BadPaddingException` из кода RSA. Без ключа та же команда печатает `nil`.

То есть ключ, насколько мне видно, больше ни на что не влияет, но код для его чтения всё ещё лежит в поставке. 27 апреля команда Datomic выпустила версию 1.0.6726 и перевела бинарники peer и транзактора на Apache 2.0. В списке изменений сказано, что ключ больше не нужен. В майской 1.0.6733 ни в одном из 8 шаблонов настроек лицензия не упоминается. При этом в jar транзактора лежат 10 классов с именем `license_inline`. Лицензия касается только бинарников. В jar библиотеки peer 4792 класса Datomic, из исходников на Clojure там только `data_readers.clj`, а в COPYRIGHT стоит All Rights Reserved.

Datomic я знаю по докладам, много раз повторял, что он ничего не забывает и что это дорого, но ни разу его не запускал и никакого числа за словом "дорого" у меня не было.

## Что я запускал

Datomic Pro 1.0.6733 с хранилищем dev, то есть с файлом H2, на JDK 17.0.7. Для сравнения SQLite 3.42.0 через драйвер Xerial JDBC. 5000 счетов с владельцем, городом и балансом. Дальше 20 кругов, за круг каждый счёт один раз получает новый случайный баланс, порядок тоже случайный. Всего 100 000 обновлений. В Datomic после каждых 5 кругов я прошу построить индекс.

SQLite я прогнал в двух вариантах. Первый это обычный `UPDATE`, он старое забывает. Во втором триггер добавляет строку со временем в таблицу `tx` и пишет новый баланс в таблицу истории. Примерно это я бы и написал руками.

Размером Datomic я считаю резервную копию, в ней только живые сегменты, 359 файлов из 361 сжаты gzip. Размер SQLite это файл после `VACUUM`. Из обоих вычтен размер сразу после загрузки.

Устройство Datomic в 2014 году разобрал Никита Прокопов в своём неофициальном путеводителе, а Val Waeselynck в 2018 году писал о Datomic как о готовом event sourcing. Я только посчитал байты.

## Во что обходится обновление

Из чего состоит одно обновление, видно в отчёте о транзакции. Старый баланс отзывается, новый добавляется и сама транзакция получает время. Это 3 датома. Их было ровно 3 в каждой из 100 000 транзакций.

<figure class="fig">
<svg viewBox="0 0 660 220" role="img" aria-label="Три транзакции в том виде, в каком их отдаёт Datomic. Новое значение это 3 датома: старый баланс отозван, новый добавлен, время транзакции добавлено, 67,9 байта. То же значение это 1 датом, только время, 39,4 байта. Сто обновлений вместе это 201 датом, 27,3 байта на обновление.">
  <text x="109.0" y="20.0" text-anchor="middle" class="f-mono f-ink">новое значение</text>
  <rect x="5" y="30" width="208" height="32" class="f-box"/>
  <text x="15.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="33.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="51.0" text-anchor="end" class="f-mono f-muted">старый</text>
  <rect x="5" y="68" width="208" height="32" class="f-box"/>
  <text x="15.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="89.0" text-anchor="end" class="f-mono f-muted">новый</text>
  <rect x="5" y="106" width="208" height="32" class="f-box"/>
  <text x="15.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="203.0" y="127.0" text-anchor="end" class="f-mono f-muted">время</text>
  <text x="109.0" y="164.0" text-anchor="middle" class="f-label f-muted">3 датома</text>
  <text x="109.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">67,9</text>
  <text x="109.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на обновление</text>
  <text x="330.0" y="20.0" text-anchor="middle" class="f-mono f-ink">то же значение</text>
  <rect x="226" y="106" width="208" height="32" class="f-box"/>
  <text x="236.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="254.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="424.0" y="127.0" text-anchor="end" class="f-mono f-muted">время</text>
  <text x="330.0" y="60.0" text-anchor="middle" class="f-mono f-muted">про баланс</text>
  <text x="330.0" y="78.0" text-anchor="middle" class="f-mono f-muted">ничего</text>
  <text x="330.0" y="164.0" text-anchor="middle" class="f-label f-muted">1 датом</text>
  <text x="330.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">39,4</text>
  <text x="330.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на обновление</text>
  <text x="551.0" y="20.0" text-anchor="middle" class="f-mono f-ink">100 в одной</text>
  <rect x="447" y="30" width="208" height="32" class="f-box"/>
  <text x="457.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="475.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="51.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="68" width="208" height="32" class="f-box"/>
  <text x="457.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="89.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="106" width="208" height="32" class="f-box"/>
  <text x="457.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="645.0" y="127.0" text-anchor="end" class="f-mono f-muted">время</text>
  <text x="551.0" y="164.0" text-anchor="middle" class="f-label f-muted">201 датом</text>
  <text x="551.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">27,3</text>
  <text x="551.0" y="208.0" text-anchor="middle" class="f-label f-muted">байта на обновление</text>
</svg>
<figcaption>Что было в отчёте о транзакции. Минус означает отзыв, плюс означает добавление. Внизу рост резервной копии в пересчёте на обновление.</figcaption>
</figure>

Обычный SQLite не вырос совсем, 163 840 байт до обновлений и 163 840 после. Datomic взял 67,9 байта на обновление, SQLite с триггером 29,6. С моей самодельной историей разница в 2,3 раза. Я ждал большей, но Datomic сегменты сжимает, а SQLite не сжимает ничего. Та же копия без сжатия занимает 22,6 МБ вместо 7,0.

Потом я сделал обновление, которое пишет то значение, что уже стоит. Datomic это замечает, новых датомов баланса нет, в истории счёта их 1 вместо 41. Но транзакция всё равно состоялась и её время такой же факт, как любой другой. Стоит она 39,4 байта, 58 процентов настоящего обновления. Самой доле я бы сильно не верил, сегменты сжимаются целиком и байты в них просто так не складываются.

Можно зайти с другой стороны и положить в одну транзакцию 100 обновлений. Тогда в отчёте 201 датом, а цена падает до 27,3 байта. SQLite с одной строкой в `tx` на 100 обновлений ведёт себя так же, 29,6 превращается в 14,0. До этого таблица `tx` занимала 1,57 МБ из 3,43, если смотреть до `VACUUM`. В обеих базах заметная часть цены это запись о транзакции, но сколько в Datomic приходится на само время, я сказать не могу.

<figure class="fig">
<svg viewBox="0 0 660 262" role="img" aria-label="Байты на обновление после 100 000 обновлений за вычетом размера после загрузки. По одному обновлению в транзакции: Datomic 67,9, Datomic с noHistory 52,4, Datomic с тем же значением 39,4, SQLite с триггером 29,6, SQLite с простым UPDATE 0. По 100 обновлений в транзакции: Datomic 27,3, Datomic с noHistory 13,2, SQLite с триггером 14,0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">одно обновление в транзакции, байты</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="26.0" width="368.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="576.6" y="39.0" text-anchor="start" class="f-mono f-muted">67,9</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="50.0" width="284.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="492.3" y="63.0" text-anchor="start" class="f-mono f-muted">52,4</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">Datomic, то же</text>
  <rect x="200.0" y="74.0" width="213.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="421.8" y="87.0" text-anchor="start" class="f-mono f-muted">39,4</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">SQLite, триггер</text>
  <rect x="200.0" y="98.0" width="160.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="368.8" y="111.0" text-anchor="start" class="f-mono f-muted">29,6</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">SQLite, UPDATE</text>
  <text x="208.0" y="135.0" text-anchor="start" class="f-mono f-muted">0</text>
  <text x="5.0" y="172.0" text-anchor="start" class="f-label f-muted">100 обновлений в транзакции, байты</text>
  <text x="190.0" y="195.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="182.0" width="148.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="356.3" y="195.0" text-anchor="start" class="f-mono f-muted">27,3</text>
  <text x="190.0" y="219.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="206.0" width="71.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="279.6" y="219.0" text-anchor="start" class="f-mono f-muted">13,2</text>
  <text x="190.0" y="243.0" text-anchor="end" class="f-mono f-ink">SQLite, триггер</text>
  <rect x="200.0" y="230.0" width="75.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="283.8" y="243.0" text-anchor="start" class="f-mono f-muted">14,0</text>
</svg>
<figcaption>Рост на одно обновление. Для Datomic это резервная копия со сжатыми сегментами, для SQLite файл после VACUUM без сжатия. Внизу у SQLite одна строка tx на 100 обновлений.</figcaption>
</figure>

## noHistory забывает, но не везде

У атрибута в Datomic есть флаг `:db/noHistory`. С ним одиночное обновление дешевеет с 67,9 до 52,4 байта, я надеялся на большее. В индексе истории остаётся 5000 датомов баланса, а в логе их по-прежнему 205 000, столько же, сколько и без флага. Пачками по 100 флаг помогает лучше, 13,2 байта против 27,3.

Чего я совсем не ждал, так это того, как на таком атрибуте ведёт себя `as-of`. У меня в памяти был 21 снимок балансов, после загрузки и после каждого круга. Без флага сошлись все 105 000 значений. С флагом сошёлся последний снимок, а в каждом из остальных 20 не нашлось ни одного из 5000 балансов. Ни старое значение, ни текущее запрос не отдаёт. Все 5000 счетов на месте и с владельцами, только без денег.

Читать прошлое тоже не бесплатно. Сумма 5000 балансов в текущей базе трогает 1 сегмент индекса AEVT. В прошлом сегментов 72. Я спросил про начало, середину и предпоследний круг, везде 72. После 500 000 обновлений их 390. Цена растёт вместе с длиной истории и близкая дата не спасает, по крайней мере в этом запросе.

## Где я запутался

Самое очевидное это измерить файл H2. После обновлений в нём было 52,5 МБ, больше 500 байт на каждое. Но строки в таблице хранилища занимали 19,4 МБ, после `gc-storage` они заняли 8,0, а файл при этом вырос до 58,2. Когда транзактор остановился, файл сжался до 20,8 МБ. В другом прогоне, где в конце я вырезал данные, он так и остался на 43,9. Резервная копия той же базы весит 7,0 МБ, поэтому про историю файл говорит мало, больше про H2 и старые сегменты индексов.

<figure class="fig">
<svg viewBox="0 0 660 180" role="img" aria-label="Размеры одной и той же базы Datomic после 100 000 обновлений в мегабайтах. Файл H2 до gc-storage 52,5, файл H2 после gc-storage 58,2, файл H2 после остановки транзактора 20,8, строки в таблице хранилища до gc-storage 19,4, строки после gc-storage 8,0, резервная копия 7,0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">МБ</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">файл H2</text>
  <rect x="200.0" y="26.0" width="341.3" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="549.3" y="39.0" text-anchor="start" class="f-mono f-muted">52,5</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">файл H2 после gc</text>
  <rect x="200.0" y="50.0" width="378.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="586.2" y="63.0" text-anchor="start" class="f-mono f-muted">58,2</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">файл H2, стоп</text>
  <rect x="200.0" y="74.0" width="134.9" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="342.9" y="87.0" text-anchor="start" class="f-mono f-muted">20,8</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">строки таблицы</text>
  <rect x="200.0" y="98.0" width="126.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="334.2" y="111.0" text-anchor="start" class="f-mono f-muted">19,4</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">строки после gc</text>
  <rect x="200.0" y="122.0" width="51.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="259.8" y="135.0" text-anchor="start" class="f-mono f-muted">8,0</text>
  <text x="190.0" y="159.0" text-anchor="end" class="f-mono f-ink">копия</text>
  <rect x="200.0" y="146.0" width="45.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="253.8" y="159.0" text-anchor="start" class="f-mono f-muted">7,0</text>
</svg>
<figcaption>Одна база и 100 000 обновлений. В тексте размером считается резервная копия.</figcaption>
</figure>

А с пачками по 100 сборка мусора не убрала ничего, было 7 758 373 байта и стало на 50 больше, хотя копия весит 2,99 МБ. Мне показалось, что я поторопился. Я сделал отдельный прогон с 3 вызовами и 2 минутами ожидания. Первый вызов добавил те же 50 байт, дальше число не сдвинулось ни на байт. После 500 000 обновлений тот же вызов сработал, 91,8 МБ превратились в 26,9, но копия весит 13,95. От чего это зависит, я не знаю.

Забыть нарочно Datomic умеет. Я отозвал один счёт, его история выросла с 44 датомов до 48 и старый баланс 21505 в прошлом был по-прежнему виден. После `:db/excise` и `sync-excise` в истории и в логе осталось по 0 датомов и запрос в прошлое не вернул ничего. Хранилище при этом подросло на 740 КБ.

## Чего я не проверял

Все числа здесь это размеры и количества, скорость я не мерил. Запускал только хранилище dev. С SQL или Cassandra накладные расходы могут быть другими. Большинство вариантов я прогнал один раз. Одиночные обновления и пачки прогнал дважды, копии разошлись самое большее на 1,3 процента и в одной из них было вырезание данных. Случайные балансы сжимаются плохо, настоящие могут сжаться лучше. Если ключ проверяют позже чем через 2 минуты после старта, я бы этого не увидел. Мой триггер хранит меньше, чем Datomic, у него нет индекса по атрибуту и нет отзывов, так что в этих 2,3 раза сравниваются не совсем одинаковые вещи.

При 3000 обновлений в день по 68 байт выходит около 74 МБ в год, этого я бы не заметил. Но начал бы я всё равно с того, чтобы собрать обновления в транзакции по смыслу, а про `noHistory` думал бы после.
