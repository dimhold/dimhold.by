---
title: "54 потока ждали соединение, а у базы 9,7 из 10 стояли в idle"
description: "Я поставил перед PostgreSQL 9.3 пул от 1 до 64 соединений и держал каждое на 20 мс дольше самого запроса. 10 соединений дали 458,8 запроса в секунду при 0,42 занятого ядра из 2, 54 потока стояли в очереди, а статистика базы показывала запросы по 0,90 мс."
date: 2014-01-26
lang: ru
translationKey: pool-ceiling
tags: ["databases", "performance", "numbers"]
---

В моей нагрузочной программе 64 потока и пул из 10 соединений с PostgreSQL. Пока она работала, отдельное соединение спрашивало у `pg_stat_activity`, чем заняты эти 10, примерно 75 раз за прогон. В среднем 9,7 из них были в состоянии `idle` и 0,26 в `active`. В это же время 54 потока стояли в очереди за соединением и ждали в среднем 115 мс. База занимала 0,38 ядра из 2.

Размер пула я никогда не считал. Оставляю значение по умолчанию или беру число из прошлого конфига, оно работает и я про него забываю. Если что-то тормозит, смотрю медленные запросы и процессор на сервере базы.

Тема не новая. В вики PostgreSQL есть страница "Number Of Database Connections" с формулой `((core_count * 2) + effective_spindle_count)`. Гетц с соавторами в "Java Concurrency in Practice" считают размер пула потоков как число ядер × (1 + время ожидания / время счёта). Ниже я пользуюсь ещё законом Литтла, доказанным в 1961 году.

Для начала я открыл через `javap` jar-файлы 4 пулов для Java и посмотрел значения по умолчанию:

| библиотека | максимум соединений | сколько ждать свободное |
|---|---|---|
| Commons DBCP 1.4 | 8 | без ограничения |
| c3p0 0.9.2.1 | 15 | без ограничения |
| HikariCP 1.2.8 | 60 | 5 с |
| Tomcat JDBC 7.0.50 | 100 | 30 с |

От 8 до 100 для одной и той же работы. С первыми двумя поток может стоять в очереди сколько угодно и никакого исключения никто не увидит.

## Как мерил

PostgreSQL 9.3.2 собран из исходников, `shared_buffers` 256 МБ. Работал он на 2 ядрах виртуальной машины, где в это время шли и другие задачи. Таблица `pgbench_accounts` на 1 миллион строк, 128 МБ, вся в памяти. Запрос один: подготовленный SELECT, который суммирует 4000 соседних строк и тратит от 0,6 до 1,1 мс процессора, смотря в каком варианте. Нагрузку даёт программа на C поверх libpq, на тех же 2 ядрах. Пул в ней свой, с очередью в порядке прихода. 64 потока шлют запросы без пауз, на каждый размер пула 3 прогона по 6 секунд, первые 2 секунды не считаются. Ниже везде медианы, если не назван отдельный прогон.

Вариантов три. В первом соединение занято только на время запроса. Во втором это BEGIN, запрос, сон на 20 мс, COMMIT. Сон заменяет всё, чем код занимается с соединением на руках, например вызов другого сервиса. В третьем поток возвращает соединение сразу после запроса и спит те же 20 мс уже без него.

## N делить на время удержания

Второй вариант, когда соединение держат во время сна:

| пул | запросов в секунду | ожидание соединения, мс | занято ядер |
|---|---|---|---|
| 1 | 46,5 | 1354 | 0,05 |
| 8 | 372,8 | 150 | 0,37 |
| 10 | 458,8 | 118 | 0,42 |
| 16 | 702,5 | 68 | 0,72 |
| 32 | 1413,5 | 23 | 1,14 |
| 64 | 2219,0 | 0 | 1,77 |

Одно соединение занято 21,47 мс, значит больше 46,5 запроса в секунду через него не пройдёт. С 10 соединениями проходит в 10 раз больше с точностью до 2%, с 16 на 5,7% меньше, чем обещает прямая. Закон Литтла говорит то же самое с другой стороны: 458,8 в секунду × 21,74 мс это 9,97 занятого соединения.

По мнению базы всё хорошо. Среднее время этого запроса по её же статистике 0,90 мс, её процессы занимают 21% от 2 ядер. Сервер побыстрее отнял бы что-то от этой 1 мс, но остальные 20 мс от него не зависят. С 8 соединениями, как в DBCP по умолчанию, на этой машине получается около 373 запросов в секунду.

Внутри транзакции остаётся хоть какой-то след, 9,62 соединения из 10 видны как `idle in transaction`. То же самое я прогнал без BEGIN и COMMIT, в режиме autocommit. Потолок почти тот же, 468,5 в секунду, но состояние уже просто `idle`. Точно так же выглядит соединение, которое никому не нужно. Первый абзац как раз про этот прогон.

<figure class="fig">
<svg viewBox="0 0 680 336" role="img" aria-label="Замкнутый цикл, 64 потока и пул на 10. В пуле 10 потоков держат соединение и 54 ждут. Ниже средние значения из pg_stat_activity для тех же 10 соединений: 0,26 active и 9,74 idle, когда соединение держат в режиме autocommit; 0,22 active, 0,15 idle и 9,62 idle in transaction, когда его держат внутри транзакции; 3,31 active и 6,69 idle, когда его возвращают сразу после запроса.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">64 потока, пул на 10</text>
  <rect x="20.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="40.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="60.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="80.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="100.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="120.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="140.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="160.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="180.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="200.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="220.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="240.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="260.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="280.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="320.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="360.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="380.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="400.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="440.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="460.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="500.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="520.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="540.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="560.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="580.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="600.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="620.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="640.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="20.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="40.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="80.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="100.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="140.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="160.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="200.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="220.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="240.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="260.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="280.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="320.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="360.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="380.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="400.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="440.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="460.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="500.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="520.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="540.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="560.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="580.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="600.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="620.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="640.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="20.0" y="78.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="38.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">10 держат соединение</text>
  <rect x="250.0" y="78.5" width="11.0" height="11.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="268.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">54 ждут</text>
  <line x1="20" y1="108" x2="660" y2="108" class="f-plain"/>
  <text x="20.0" y="128.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">pg_stat_activity</text>
  <text x="170.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">держим, autocommit</text>
  <rect x="180.0" y="142.0" width="12.0" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="192.0" y="142.0" width="448.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="180.0" y="182.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0,26 active, 9,74 idle</text>
  <text x="170.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">держим, транзакция</text>
  <rect x="180.0" y="198.0" width="10.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.3" y="198.0" width="6.8" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="197.1" y="198.0" width="442.9" height="26.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="180.0" y="238.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0,22 active, 0,15 idle, 9,62 idle in transaction</text>
  <text x="170.0" y="272.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">сразу вернули</text>
  <rect x="180.0" y="254.0" width="152.1" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="332.1" y="254.0" width="307.9" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="180.0" y="294.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3,31 active, 6,69 idle</text>
  <rect x="180.0" y="312.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="198.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">active</text>
  <rect x="290.0" y="312.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="308.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">idle</text>
  <rect x="380.0" y="312.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="398.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">idle in transaction</text>
</svg>
<figcaption>Квадраты показывают потоки у пула, полосы показывают состояния из pg_stat_activity, в среднем примерно по 75 замерам за прогон. Каждая полоса построена по медиане 3 прогонов. Квадраты относятся к 2 случаям, когда соединение держат. В третьем очередь была короче 2 потоков.</figcaption>
</figure>

Третий вариант с 2 соединениями дал 2178 запросов в секунду, в 4,7 раза больше, чем второй с 10. Даже с 1 соединением вышло 1343.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Пропускная способность от размера пула, обе оси логарифмические. Если держать соединение на 20 мс дольше, получается прямая: 46,5 запроса в секунду с 1 соединением, 372,8 с 8, 458,8 с 10, 1413,5 с 32 и 2219 с 64. Если держать только на время запроса, 1376 с 1, 3033 с 3 и дальше медленное падение до 2546 с 64. Если 20 мс проходят после возврата, 1343, 2178, 2722 и дальше около 2650.">
  <line x1="70" y1="287.4" x2="650" y2="287.4" class="f-plain"/>
  <text x="62.0" y="291.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="248.3" x2="650" y2="248.3" class="f-plain"/>
  <text x="62.0" y="252.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="209.1" x2="650" y2="209.1" class="f-plain"/>
  <text x="62.0" y="213.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="70" y1="170.0" x2="650" y2="170.0" class="f-plain"/>
  <text x="62.0" y="174.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="70" y1="130.9" x2="650" y2="130.9" class="f-plain"/>
  <text x="62.0" y="134.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="70" y1="91.7" x2="650" y2="91.7" class="f-plain"/>
  <text x="62.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1600</text>
  <line x1="70" y1="52.6" x2="650" y2="52.6" class="f-plain"/>
  <text x="62.0" y="56.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3200</text>
  <line x1="70.0" y1="300" x2="70.0" y2="305" class="f-plain"/>
  <text x="70.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="166.7" y1="300" x2="166.7" y2="305" class="f-plain"/>
  <text x="166.7" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="263.3" y1="300" x2="263.3" y2="305" class="f-plain"/>
  <text x="263.3" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="360.0" y1="300" x2="360.0" y2="305" class="f-plain"/>
  <text x="360.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <line x1="456.7" y1="300" x2="456.7" y2="305" class="f-plain"/>
  <text x="456.7" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <line x1="553.3" y1="300" x2="553.3" y2="305" class="f-plain"/>
  <text x="553.3" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">32</text>
  <line x1="650.0" y1="300" x2="650.0" y2="305" class="f-plain"/>
  <text x="650.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="360.0" y="336.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">соединений в пуле</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">запросов в секунду</text>
  <line x1="70.0" y1="291.4" x2="650.0" y2="56.6" style="stroke:var(--muted);stroke-width:1.2;stroke-dasharray:5 4;fill:none"/>
  <polyline points="70.0,100.3 166.7,77.7 223.2,55.6 263.3,60.3 360.0,60.4 456.7,61.1 553.3,60.6 650.0,65.5" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <circle cx="70.0" cy="100.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="166.7" cy="77.7" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="223.2" cy="55.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="263.3" cy="60.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="360.0" cy="60.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="456.7" cy="61.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="553.3" cy="60.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="650.0" cy="65.5" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,101.6 166.7,74.3 223.2,61.7 263.3,62.3 360.0,62.7 391.1,62.9 456.7,63.8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="70.0" cy="101.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="166.7" cy="74.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="223.2" cy="61.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="263.3" cy="62.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="360.0" cy="62.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="391.1" cy="62.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="456.7" cy="63.8" r="3" style="fill:var(--ink);stroke:none"/>
  <polyline points="70.0,291.5 166.7,253.0 263.3,213.3 360.0,174.0 391.1,162.3 456.7,138.2 553.3,98.7 609.9,82.0 650.0,73.3" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="70.0" cy="291.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="166.7" cy="253.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="263.3" cy="213.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="360.0" cy="174.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="391.1" cy="162.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="456.7" cy="138.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="553.3" cy="98.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="609.9" cy="82.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="650.0" cy="73.3" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="281.3" y="229.4" text-anchor="start" class="f-label f-accent" style="font-size:10px">запрос + 20 мс, соединение занято</text>
  <text x="171.7" y="108.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">запрос, возврат, потом 20 мс</text>
  <text x="263.3" y="40.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">только запрос</text>
</svg>
<figcaption>Запросов в секунду, 64 потока, медианы 3 прогонов. Пунктир: N / 21,47 мс.</figcaption>
</figure>

Для 2 ядер и данных в памяти формула из вики советует 4 соединения. При сне на 20 мс это 185,8 запроса в секунду. На странице сказано, что речь про соединения, которые "actively doing work", но эти слова я бы при чтении пропустил. Ещё там предупреждают, что для версии 9.2 формулу придётся поправить. Формула Гетца на моих 0,92 мс процессора и 20,8 мс всего остального даёт 47. Я мерил 48, получилось 1900,5 в секунду при 1,62 занятого ядра.

## Мои прогнозы

Свои ожидания я записал до первого прогона. Для первого варианта, где один запрос и ничего больше, я был уверен, что на 2 ядра хватит 2 соединений. С 2 вышло 2053 запроса в секунду, с 3 уже 3033. При 2 соединениях база занимала всего 1,31 ядра. Думаю, пока просыпается следующий поток, соединение простаивает и третье закрывает эту дыру. Дальше ничего не росло, на 64 было 2546. Прогоны на 64 неровные, от 1536 до 2639.

Со вторым прогнозом вышло хуже. При 64 соединениях очереди в пуле нет, значит она внутри базы и я ждал, что база пожалуется на медленные запросы. Клиент видел 25,2 мс на запрос, `pg_stat_statements` показывал 3,4. С одним соединением было 0,71 против 0,63. В `pg_stat_activity` активными числились примерно 10 процессов из 64. Насколько я понимаю, процесс, которому не досталось ядра, запрос ещё не прочитал и для статистики этот запрос не начался. По `pg_stat_statements` я бы до этой очереди не добрался.

## Вблизи потолка

В замкнутом цикле поток, пока ждёт, ничего нового не шлёт, так что длиннее 54 очередь стать не может. Я добавил в программу второй режим: запросы приходят в случайные моменты с заданной частотой и им всё равно, сколько других уже ждёт. Пул на 10, сон внутри транзакции, прогон 25 секунд, по 3 прогона на точку.

<figure class="fig">
<svg viewBox="0 0 680 354" role="img" aria-label="Пул из 10 соединений, пуассоновский поток запросов. Среднее ожидание соединения при 25, 50, 70, 80, 90, 95, 99 и 105 процентах измеренного потолка: 0,14, 0,28, 3,7, 2,4, 10,7, 15,0, 159 и 596 мс. Занятые ядра базы в тех же прогонах: 0,12, 0,20, 0,31, 0,30, 0,37, 0,35, 0,40 и 0,40 из 2.">
  <line x1="70" y1="179.5" x2="650" y2="179.5" class="f-plain"/>
  <text x="62.0" y="183.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,1</text>
  <line x1="70" y1="144.8" x2="650" y2="144.8" class="f-plain"/>
  <text x="62.0" y="148.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="70" y1="110.0" x2="650" y2="110.0" class="f-plain"/>
  <text x="62.0" y="114.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="70" y1="75.2" x2="650" y2="75.2" class="f-plain"/>
  <text x="62.0" y="79.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="40.5" x2="650" y2="40.5" class="f-plain"/>
  <text x="62.0" y="44.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="70" y1="306.0" x2="650" y2="306.0" class="f-plain"/>
  <text x="62.0" y="310.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="271.0" x2="650" y2="271.0" class="f-plain"/>
  <text x="62.0" y="275.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="70" y1="236.0" x2="650" y2="236.0" class="f-plain"/>
  <text x="62.0" y="240.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">среднее ожидание соединения, мс</text>
  <text x="10.0" y="224.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">занятых ядер у базы, из 2</text>
  <line x1="585.6" y1="30" x2="585.6" y2="306" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <polyline points="102.2,174.5 263.3,164.1 392.2,125.1 456.7,131.4 521.1,109.0 553.3,103.9 579.1,68.2 617.8,48.3" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <polyline points="102.2,301.9 263.3,299.0 392.2,295.1 456.7,295.5 521.1,292.9 553.3,293.7 579.1,292.1 617.8,291.8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <line x1="102.2" y1="175.8" x2="102.2" y2="174.3" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="102.2" cy="174.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="102.2" cy="301.9" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="102.2" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="263.3" y1="167.0" x2="263.3" y2="157.9" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="263.3" cy="164.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="263.3" cy="299.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="263.3" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="392.2" y1="132.1" x2="392.2" y2="120.8" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="392.2" cy="125.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="392.2" cy="295.1" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="392.2" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">70</text>
  <line x1="456.7" y1="131.6" x2="456.7" y2="131.1" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="456.7" cy="131.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="456.7" cy="295.5" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="456.7" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="521.1" y1="116.5" x2="521.1" y2="104.0" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="521.1" cy="109.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="521.1" cy="292.9" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="521.1" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="553.3" y1="108.5" x2="553.3" y2="95.2" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="553.3" cy="103.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="553.3" cy="293.7" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="553.3" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">95</text>
  <line x1="579.1" y1="93.4" x2="579.1" y2="50.3" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="579.1" cy="68.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="579.1" cy="292.1" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="579.1" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">99</text>
  <line x1="617.8" y1="52.4" x2="617.8" y2="37.0" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="617.8" cy="48.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="617.8" cy="291.8" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="617.8" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">105</text>
  <text x="102.2" y="164.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,14</text>
  <text x="263.3" y="140.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,28</text>
  <text x="456.7" y="161.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2,4</text>
  <text x="545.3" y="95.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">15,0</text>
  <text x="571.1" y="62.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">159</text>
  <text x="625.8" y="58.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">596</text>
  <text x="263.3" y="291.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,20</text>
  <text x="625.8" y="285.8" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0,40</text>
  <text x="360.0" y="344.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">поток запросов, % от потолка (458,8 в секунду)</text>
</svg>
<figcaption>Пул из 10, медианы 3 прогонов по 25 секунд, усы показывают наименьшее и наибольшее значение. Шкала ожидания логарифмическая.</figcaption>
</figure>

Между 80% и 99% потолка среднее ожидание соединения выросло с 2,4 до 159 мс. Запрос при этом замедлился с 0,94 до 1,16 мс, а база заняла 0,40 ядра вместо 0,30. В прогнозе я отвёл процессору рост в 1,3 раза, вышло 1,32, немного промахнулся. На 105% ожидание росло до самого конца прогона, поэтому 596 мс зависят в основном от его длины.

Три прогона на 99% дали 30, 159 и 520 мс. В худшем запрос занимал в среднем 1,56 мс, а в остальных 2 было 1,16 и 1,05. Соединение держали по 22,59 мс, то есть пул мог пропустить 443 запроса в секунду, а приходило 456. Почему запрос замедлился, я не знаю.

Точки на 70% странные. Ожидание там 3,7 мс, это больше, чем на 80%, а отдельные запросы ждали до 107 мс. Очередь, которую я снимал отдельно, 0,85, а по закону Литтла должно быть 1,17. На 99% те же 2 числа 72,7 и 73,4. Может быть, другие задачи на миг забирали ядра и мой счётчик очереди вставал вместе с программой, но причину я не нашёл.

## Чего я не проверял

Только чтение: ни коммитов, которые ждут диск, ни блокировок строк. Прогоны замкнутого цикла короткие, в каждом считаются 4 секунды. Сон всегда 20 мс, с переменным ожидание у потолка должно быть длиннее. Клиент и другие задачи делят ядра с базой, а сети нет вовсе. Пул мой собственный, сами 4 библиотеки я не запускал. Ещё я не знаю, сколько из 25 мс при 64 соединениях процесс базы ждал ядро, а сколько приходится на клиента.
