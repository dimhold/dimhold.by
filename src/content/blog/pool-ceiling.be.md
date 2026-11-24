---
title: "54 патокі чакалі злучэння, а ў базы 9,7 з 10 стаялі ў idle"
description: "Я паставіў перад PostgreSQL 9.3 пул ад 1 да 64 злучэнняў і трымаў кожнае на 20 мс даўжэй за сам запыт. 10 злучэнняў далі 458,8 запыту за секунду пры 0,42 занятага ядра з 2, 54 патокі стаялі ў чарзе, а статыстыка базы паказвала запыты па 0,90 мс."
date: 2014-01-26
lang: be
translationKey: pool-ceiling
tags: ["databases", "performance", "numbers"]
---

У маёй нагрузачнай праграме 64 патокі і пул з 10 злучэнняў з PostgreSQL. Пакуль яна працавала, асобнае злучэнне пыталася ў `pg_stat_activity`, чым занятыя гэтыя 10, прыкладна 75 разоў за прагон. У сярэднім 9,7 з іх былі ў стане `idle` і 0,26 у `active`. У той жа час 54 патокі стаялі ў чарзе па злучэнне і чакалі ў сярэднім 115 мс. База займала 0,38 ядра з 2.

Памер пула я ніколі не лічыў. Пакідаю значэнне па змаўчанні або бяру лік з мінулага канфіга, ён працуе і я пра яго забываю. Калі нешта тармозіць, гляджу на павольныя запыты і на працэсар сервера базы.

Тэма не новая. У вікі PostgreSQL ёсць старонка "Number Of Database Connections" з формулай `((core_count * 2) + effective_spindle_count)`. Гётц з сааўтарамі ў "Java Concurrency in Practice" вылічваюць памер пула патокаў як колькасць ядраў × (1 + час чакання / час вылічэнняў). Ніжэй я карыстаюся яшчэ законам Літла, даказаным у 1961 годзе.

Спачатку я адкрыў праз `javap` jar-файлы 4 пулаў для Java і паглядзеў значэнні па змаўчанні:

| бібліятэка | максімум злучэнняў | колькі чакаць вольнае |
|---|---|---|
| Commons DBCP 1.4 | 8 | без абмежавання |
| c3p0 0.9.2.1 | 15 | без абмежавання |
| HikariCP 1.2.8 | 60 | 5 с |
| Tomcat JDBC 7.0.50 | 100 | 30 с |

Ад 8 да 100 для адной і той жа працы. З першымі дзвюма паток можа стаяць у чарзе колькі заўгодна і ніякага выключэння ніхто не ўбачыць.

## Як мераў

PostgreSQL 9.3.2 сабраны з зыходнага коду, `shared_buffers` 256 МБ. Працаваў ён на 2 ядрах віртуальнай машыны, дзе ў гэты час ішлі і іншыя задачы. Табліца `pgbench_accounts` на 1 мільён радкоў, 128 МБ, уся ў памяці. Запыт адзін: падрыхтаваны SELECT, які падсумоўвае 4000 суседніх радкоў і траціць ад 0,6 да 1,1 мс працэсара, залежна ад варыянта. Нагрузку дае праграма на C паверх libpq, на тых жа 2 ядрах. Пул у ёй свой, з чаргой у парадку прыходу. 64 патокі шлюць запыты без паўз, на кожны памер пула 3 прагоны па 6 секунд, першыя 2 секунды не лічацца. Ніжэй усюды медыяны, калі не названы асобны прагон.

Варыянтаў тры. У першым злучэнне занятае толькі на час запыту. У другім гэта BEGIN, запыт, сон на 20 мс, COMMIT. Сон замяняе ўсё, чым код займаецца са злучэннем на руках, напрыклад выклік іншага сэрвісу. У трэцім паток вяртае злучэнне адразу пасля запыту і спіць тыя ж 20 мс ужо без яго.

## N падзяліць на час утрымання

Другі варыянт, калі злучэнне трымаюць падчас сну:

| пул | запытаў за секунду | чаканне злучэння, мс | занята ядраў |
|---|---|---|---|
| 1 | 46,5 | 1354 | 0,05 |
| 8 | 372,8 | 150 | 0,37 |
| 10 | 458,8 | 118 | 0,42 |
| 16 | 702,5 | 68 | 0,72 |
| 32 | 1413,5 | 23 | 1,14 |
| 64 | 2219,0 | 0 | 1,77 |

Адно злучэнне занятае 21,47 мс, значыць больш за 46,5 запыту за секунду праз яго не пройдзе. З 10 злучэннямі праходзіць у 10 разоў больш з дакладнасцю да 2%, з 16 на 5,7% менш, чым абяцае прамая. Закон Літла кажа тое самае з іншага боку: 458,8 за секунду × 21,74 мс гэта 9,97 занятага злучэння.

На думку базы, усё добра. Сярэдні час гэтага запыту паводле яе ж статыстыкі 0,90 мс, яе працэсы займаюць 21% ад 2 ядраў. Хутчэйшы сервер адняў бы нешта ад гэтай 1 мс, але астатнія 20 мс ад яго не залежаць. З 8 злучэннямі, як у DBCP па змаўчанні, на гэтай машыне выходзіць каля 373 запытаў за секунду.

Унутры транзакцыі застаецца хоць нейкі след, 9,62 злучэння з 10 бачныя як `idle in transaction`. Тое самае я прагнаў без BEGIN і COMMIT, у рэжыме autocommit. Столь амаль тая ж, 468,5 за секунду, але стан ужо проста `idle`. Гэтак жа выглядае злучэнне, якое нікому не патрэбнае. Першы абзац якраз пра гэты прагон.

<figure class="fig">
<svg viewBox="0 0 680 336" role="img" aria-label="Замкнёны цыкл, 64 патокі і пул на 10. У пуле 10 патокаў трымаюць злучэнне і 54 чакаюць. Ніжэй сярэднія значэнні з pg_stat_activity для тых жа 10 злучэнняў: 0,26 active і 9,74 idle, калі злучэнне трымаюць у рэжыме autocommit; 0,22 active, 0,15 idle і 9,62 idle in transaction, калі яго трымаюць унутры транзакцыі; 3,31 active і 6,69 idle, калі яго вяртаюць адразу пасля запыту.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">64 патокі, пул на 10</text>
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
  <text x="38.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">10 трымаюць злучэнне</text>
  <rect x="250.0" y="78.5" width="11.0" height="11.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="268.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">54 чакаюць</text>
  <line x1="20" y1="108" x2="660" y2="108" class="f-plain"/>
  <text x="20.0" y="128.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">pg_stat_activity</text>
  <text x="170.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">трымаем, autocommit</text>
  <rect x="180.0" y="142.0" width="12.0" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="192.0" y="142.0" width="448.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="180.0" y="182.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0,26 active, 9,74 idle</text>
  <text x="170.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">трымаем, транзакцыя</text>
  <rect x="180.0" y="198.0" width="10.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.3" y="198.0" width="6.8" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="197.1" y="198.0" width="442.9" height="26.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="180.0" y="238.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0,22 active, 0,15 idle, 9,62 idle in transaction</text>
  <text x="170.0" y="272.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">адразу вярнулі</text>
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
<figcaption>Квадраты паказваюць патокі каля пула, палосы паказваюць станы з pg_stat_activity, у сярэднім прыкладна па 75 замерах за прагон. Кожная паласа пабудаваная па медыяне 3 прагонаў. Квадраты датычаць 2 выпадкаў, калі злучэнне трымаюць. У трэцім чарга была карацейшая за 2 патокі.</figcaption>
</figure>

Трэці варыянт з 2 злучэннямі даў 2178 запытаў за секунду, у 4,7 раза больш, чым другі з 10. Нават з 1 злучэннем выйшла 1343.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Прапускная здольнасць у залежнасці ад памеру пула, абедзве восі лагарыфмічныя. Калі трымаць злучэнне на 20 мс даўжэй, атрымліваецца прамая: 46,5 запыту за секунду з 1 злучэннем, 372,8 з 8, 458,8 з 10, 1413,5 з 32 і 2219 з 64. Калі трымаць толькі на час запыту, 1376 з 1, 3033 з 3 і далей павольны спад да 2546 з 64. Калі 20 мс праходзяць пасля вяртання, 1343, 2178, 2722 і далей каля 2650.">
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
  <text x="360.0" y="336.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">злучэнняў у пуле</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">запытаў за секунду</text>
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
  <text x="281.3" y="229.4" text-anchor="start" class="f-label f-accent" style="font-size:10px">запыт + 20 мс, злучэнне занятае</text>
  <text x="171.7" y="108.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">запыт, вяртанне, потым 20 мс</text>
  <text x="263.3" y="40.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">толькі запыт</text>
</svg>
<figcaption>Запытаў за секунду, 64 патокі, медыяны 3 прагонаў. Пункцір: N / 21,47 мс.</figcaption>
</figure>

Для 2 ядраў і даных у памяці формула з вікі раіць 4 злучэнні. Пры сне на 20 мс гэта 185,8 запыту за секунду. На старонцы сказана, што гаворка пра злучэнні, якія "actively doing work", але гэтыя словы я пры чытанні прапусціў бы. Яшчэ там папярэджваюць, што для версіі 9.2 формулу давядзецца паправіць. Формула Гётца на маіх 0,92 мс працэсара і 20,8 мс усяго астатняга дае 47. Я мераў 48, атрымалася 1900,5 за секунду пры 1,62 занятага ядра.

## Мае прагнозы

Свае чаканні я запісаў да першага прагону. Для першага варыянта, дзе адзін запыт і больш нічога, я быў упэўнены, што на 2 ядры хопіць 2 злучэнняў. З 2 выйшла 2053 запыты за секунду, з 3 ужо 3033. Пры 2 злучэннях база займала ўсяго 1,31 ядра. Думаю, пакуль прачынаецца наступны паток, злучэнне прастойвае і трэцяе закрывае гэту дзірку. Далей нічога не расло, на 64 было 2546. Прагоны на 64 няроўныя, ад 1536 да 2639.

З другім прагнозам выйшла горш. Пры 64 злучэннях чаргі ў пуле няма, значыць яна ўнутры базы і я чакаў, што база паскардзіцца на павольныя запыты. Кліент бачыў 25,2 мс на запыт, `pg_stat_statements` паказваў 3,4. З адным злучэннем было 0,71 супраць 0,63. У `pg_stat_activity` актыўнымі лічыліся прыкладна 10 працэсаў з 64. Наколькі я разумею, працэс, якому не дасталося ядра, запыт яшчэ не прачытаў і для статыстыкі гэты запыт не пачаўся. Праз `pg_stat_statements` я б да гэтай чаргі не дабраўся.

## Каля столі

У замкнёным цыкле паток, пакуль чакае, нічога новага не шле, так што даўжэйшай за 54 чарга стаць не можа. Я дадаў у праграму другі рэжым: запыты прыходзяць у выпадковыя моманты з зададзенай частатой і ім усё роўна, колькі іншых ужо чакае. Пул на 10, сон унутры транзакцыі, прагон 25 секунд, па 3 прагоны на пункт.

<figure class="fig">
<svg viewBox="0 0 680 354" role="img" aria-label="Пул з 10 злучэнняў, пуасонаўскі паток запытаў. Сярэдняе чаканне злучэння пры 25, 50, 70, 80, 90, 95, 99 і 105 працэнтах вымеранай столі: 0,14, 0,28, 3,7, 2,4, 10,7, 15,0, 159 і 596 мс. Занятыя ядры базы ў тых жа прагонах: 0,12, 0,20, 0,31, 0,30, 0,37, 0,35, 0,40 і 0,40 з 2.">
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
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">сярэдняе чаканне злучэння, мс</text>
  <text x="10.0" y="224.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">занятых ядраў у базы, з 2</text>
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
  <text x="360.0" y="344.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">паток запытаў, % ад столі (458,8 за секунду)</text>
</svg>
<figcaption>Пул з 10, медыяны 3 прагонаў па 25 секунд, вусы паказваюць найменшае і найбольшае значэнне. Шкала чакання лагарыфмічная.</figcaption>
</figure>

Паміж 80% і 99% столі сярэдняе чаканне злучэння вырасла з 2,4 да 159 мс. Запыт пры гэтым запаволіўся з 0,94 да 1,16 мс, а база заняла 0,40 ядра замест 0,30. У прагнозе я пакінуў працэсару рост у 1,3 раза, выйшла 1,32, крыху прамахнуўся. На 105% чаканне расло да самага канца прагону, таму 596 мс залежаць у асноўным ад яго даўжыні.

Тры прагоны на 99% далі 30, 159 і 520 мс. У горшым запыт займаў у сярэднім 1,56 мс, а ў астатніх 2 было 1,16 і 1,05. Злучэнне трымалі па 22,59 мс, гэта значыць пул мог прапусціць 443 запыты за секунду, а прыходзіла 456. Чаму запыт запаволіўся, я не ведаю.

Пункты на 70% дзіўныя. Чаканне там 3,7 мс, гэта больш, чым на 80%, а асобныя запыты чакалі да 107 мс. Чарга, якую я здымаў асобна, 0,85, а паводле закона Літла мусіць быць 1,17. На 99% тыя ж 2 велічыні 72,7 і 73,4. Магчыма, іншыя задачы на імгненне забіралі ядры і мой лічыльнік чаргі спыняўся разам з праграмай, але прычыны я не знайшоў.

## Чаго я не правяраў

Толькі чытанне: ні камітаў, якія чакаюць дыска, ні блакіровак радкоў. Прагоны замкнёнага цыкла кароткія, у кожным лічацца 4 секунды. Сон заўсёды 20 мс, са зменным чаканне каля столі мусіць быць даўжэйшым. Кліент і іншыя задачы дзеляць ядры з базай, а сеткі няма зусім. Пул мой уласны, самі 4 бібліятэкі я не запускаў. Яшчэ я не ведаю, колькі з 25 мс пры 64 злучэннях працэс базы чакаў ядра, а колькі прыпадае на кліента.
