---
title: "8 часов снимков без единого разрыва. Четверть пойманных новых процессов дал мой логгер"
description: "Мой инспектор процессов whotop всю ночь снимал ноутбук на Windows раз в 5 минут. Ни одного разрыва, то есть ноутбук не уснул. До 01:58 ещё работали агентские сессии. За 6 тихих часов после этого 30 процентов из 711 пойманных новых процессов дал сам логгер, за ним идут расширения Chrome, WMI и обслуживание Windows. Всю ночь 14 портов держали серверы разработки, старейшему было почти 4 дня."
date: 2026-10-06
lang: ru
translationKey: night-noise
tags: ["debugging", "agents"]
---
Мне хотелось знать, что делает мой ноутбук, пока я сплю. В ночь на 29 сентября одна из моих сессий Claude Code запустила на нём цикл с [whotop](https://github.com/dimhold/whotop) 0.4.1: `whotop ls --all --json` каждые 5 минут до 8 утра. whotop это мой инспектор процессов, я написал его, чтобы выяснять, кто держит порт. На ноутбуке Windows. Сборку Windows мой лог не записывает, как и версии Chrome, Postgres и Claude Code. Цикл ещё писал строку в индекс на каждый снимок. Если между двумя снимками проходило больше 7 минут, он ставил пометку GAP, чтобы я увидел, когда ноутбук уснул.

В файле нет ни одного GAP. 96 снимков с 23:57 до 07:57 по часам ноутбука, с шагом 303-305 секунд. Сон короче пары минут так не заметить, но ничего похожего на сон я не увидел.

## Машина была занята всю ночь

В начале было 486 процессов, к 00:13 их стало 510, утром 467. Минимум, 460, был в 03:14 и ещё раз в 06:21. За ночь лог увидел 1615 разных процессов. 415 из них были в каждом снимке, то есть прожили всю ночь. Остальные приходили и уходили. Новым я считал процесс, который стартовал позже первого снимка. Ключ это pid плюс время старта, потому что Windows переиспользует номера pid. Получилось 1129 новых процессов.

Прежде чем называть это шумом, надо было отрезать то, что шумом не было. До 01:58 мои агентские сессии ещё работали: шли сборки и ssh на сервер, где тоже шла сборка. Последней командой была сборка для продакшена в 01:58:56. После неё до утра ни один агент не запускал команд, кроме самого цикла логгера. Значит, тихая часть ночи это 6 часов, с 01:59 до 07:57. За это время лог поймал 711 новых процессов.

## Больше всех шумел логгер

Я разложил новые процессы по родителям. Самой большой группой оказался сам whotop. Каждый снимок это node, который запускает PowerShell, а тому достаётся консольный хост. Выходит 3 процесса каждые 5 минут. За всю ночь это 285 из 1129, 25 процентов. После 01:59 это 216 из 711, 30 процентов.

Потом я сверил время старта остальных процессов с логгером. Оказалось, что доля может быть намного больше. На Windows whotop читает таблицу процессов через `Get-CimInstance Win32_Process`, порты через `Get-NetTCPConnection` и службы через `Get-CimInstance Win32_Service`. Всё это идёт через WMI. А WMI [загружает своих провайдеров](https://learn.microsoft.com/en-us/windows/win32/wmisdk/provider-hosting-and-security) в отдельный процесс WmiPrvSE. После 01:59 появилось 70 новых WmiPrvSE. 40 из них стартовали через 0,39-0,56 секунды после node логгера. С bash в моих сессиях Claude Code вышло так же. Все 46 стартовали через 0,37-0,74 секунды после логгера и ни разу в другой момент. Они пришли из 6 разных сессий. Только одна из них та, что крутит цикл. Вместе с ними стартовали 28 консольных хостов. Если их запускает логгер, то это 330 из 711, 46 процентов тихой части ночи.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Столбцы с накоплением, новые процессы, пойманные за каждый час с полуночи до 8 утра. 00:00 всего 202, логгер 36, 01:00 всего 220, логгер 36, 02:00 всего 149, логгер 36, 03:00 всего 115, логгер 33, 04:00 всего 107, логгер 36, 05:00 всего 112, логгер 36, 06:00 всего 106, логгер 36, 07:00 всего 118, логгер 36. Линия после 01:58 отмечает последнюю команду агента. После неё логгер держится на 33-36 в час и это самая большая часть каждого столбца.">
  <line x1="40" y1="236.0" x2="630" y2="236.0" class="f-plain"/>
  <text x="36" y="239.5" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="40" y1="199.2" x2="630" y2="199.2" class="f-plain"/>
  <text x="36" y="202.7" text-anchor="end" class="f-label f-muted">50</text>
  <line x1="40" y1="162.4" x2="630" y2="162.4" class="f-plain"/>
  <text x="36" y="165.9" text-anchor="end" class="f-label f-muted">100</text>
  <line x1="40" y1="125.6" x2="630" y2="125.6" class="f-plain"/>
  <text x="36" y="129.1" text-anchor="end" class="f-label f-muted">150</text>
  <line x1="40" y1="88.8" x2="630" y2="88.8" class="f-plain"/>
  <text x="36" y="92.3" text-anchor="end" class="f-label f-muted">200</text>
  <line x1="40" y1="52.0" x2="630" y2="52.0" class="f-plain"/>
  <text x="36" y="55.5" text-anchor="end" class="f-label f-muted">250</text>
  <rect x="54" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="54" y="191.8" width="50" height="17.7" class="f-box"/>
  <rect x="54" y="163.1" width="50" height="28.7" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="54" y="150.6" width="50" height="12.5" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="54" y="87.3" width="50" height="63.3" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="79" y="81.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">202</text>
  <text x="79" y="252" text-anchor="middle" class="f-label f-muted">00:00</text>
  <rect x="128" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="128" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="128" y="155.0" width="50" height="38.3" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="128" y="131.5" width="50" height="23.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="128" y="74.1" width="50" height="57.4" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="153" y="68.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">220</text>
  <text x="153" y="252" text-anchor="middle" class="f-label f-muted">01:00</text>
  <rect x="202" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="202" y="192.6" width="50" height="16.9" class="f-box"/>
  <rect x="202" y="167.6" width="50" height="25.0" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="202" y="143.3" width="50" height="24.3" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="202" y="126.3" width="50" height="16.9" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="227" y="120.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">149</text>
  <text x="227" y="252" text-anchor="middle" class="f-label f-muted">02:00</text>
  <rect x="276" y="211.7" width="50" height="24.3" style="fill:var(--accent)"/>
  <rect x="276" y="196.3" width="50" height="15.5" class="f-box"/>
  <rect x="276" y="180.1" width="50" height="16.2" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="276" y="165.3" width="50" height="14.7" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="276" y="151.4" width="50" height="14.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="301" y="145.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">115</text>
  <text x="301" y="252" text-anchor="middle" class="f-label f-muted">03:00</text>
  <rect x="350" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="350" y="194.0" width="50" height="15.5" class="f-box"/>
  <rect x="350" y="172.0" width="50" height="22.1" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="350" y="162.4" width="50" height="9.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="350" y="157.2" width="50" height="5.2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="375" y="151.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">107</text>
  <text x="375" y="252" text-anchor="middle" class="f-label f-muted">04:00</text>
  <rect x="424" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="424" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="424" y="172.0" width="50" height="21.3" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="424" y="166.1" width="50" height="5.9" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="424" y="153.6" width="50" height="12.5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="449" y="147.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">112</text>
  <text x="449" y="252" text-anchor="middle" class="f-label f-muted">05:00</text>
  <rect x="498" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="498" y="192.6" width="50" height="16.9" class="f-box"/>
  <rect x="498" y="176.4" width="50" height="16.2" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="498" y="169.8" width="50" height="6.6" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="498" y="158.0" width="50" height="11.8" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="523" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">106</text>
  <text x="523" y="252" text-anchor="middle" class="f-label f-muted">06:00</text>
  <rect x="572" y="209.5" width="50" height="26.5" style="fill:var(--accent)"/>
  <rect x="572" y="193.3" width="50" height="16.2" class="f-box"/>
  <rect x="572" y="169.8" width="50" height="23.6" style="fill:var(--ink);fill-opacity:0.55"/>
  <rect x="572" y="159.5" width="50" height="10.3" style="fill:var(--muted);fill-opacity:0.35"/>
  <rect x="572" y="149.2" width="50" height="10.3" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="597" y="143.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">118</text>
  <text x="597" y="252" text-anchor="middle" class="f-label f-muted">07:00</text>
  <line x1="190" y1="44" x2="190" y2="236" style="stroke:var(--accent);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="196" y="42" class="f-label f-accent">последняя команда агента 01:58</text>
  <rect x="44" y="10" width="11" height="11" style="fill:var(--accent)"/>
  <text x="60" y="19.5" class="f-label f-muted">мой логгер</text>
  <rect x="138" y="10" width="11" height="11" class="f-box"/>
  <text x="154" y="19.5" class="f-label f-muted">хосты WMI</text>
  <rect x="224.8" y="10" width="11" height="11" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="240.8" y="19.5" class="f-label f-muted">Chrome</text>
  <rect x="290" y="10" width="11" height="11" style="fill:var(--muted);fill-opacity:0.35"/>
  <text x="306" y="19.5" class="f-label f-muted">Windows</text>
  <rect x="362.4" y="10" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="378.4" y="19.5" class="f-label f-muted">агенты и прочее</text>
</svg>
<figcaption>Новые процессы по часу снимка, в котором их увидели впервые. За ночь 1129, из них 285 это сам логгер. После 01:58 ни один агент не запускал команд.</figcaption>
</figure>

## Кто ещё просыпался

На втором месте Chrome. После 01:59 он запустил 169 новых процессов: 96 процессов расширений и 73 рендерера страниц. Это от 22 до 34 в час до самых 8 утра. В командной строке написано `--extension-process`, но не написано, какое расширение, поэтому я не знаю, кто перезапускается так часто.

Сама Windows запустила 97. Больше всего `svchost`, их 69. Командная строка у них скрыта, я вижу только имя. Интереснее те, у кого имя говорящее. Пара установщика модулей Windows (TiWorker вместе с TrustedInstaller) стартовала за ночь 9 раз, 5 из них после 01:59, последний раз в 04:39. Процессы поискового индексатора приходили за ночь 7 раз, 4 из них после 01:59 и 3 из них между 07:26 и 07:35. `CompatTelRunner`, телеметрия совместимости, стартовал в 03:19 и в 03:34 запустил вторую копию себя. Microsoft [описывает](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-maintenence) обслуживание как работу, которая идёт, когда машина простаивает и питается от сети. Это сходилось бы, если ноутбук стоял на зарядке, но в логе этого нет. Журнал планировщика заданий я тоже не снимал, поэтому сказать, какие из этих запусков были обслуживанием, не могу.

Postgres запустил 23 дочерних процесса, вразброс по всем 6 часам. 5 из них тоже стартовали сразу после логгера.

## Кто прожил всю ночь

Среди 415 долгожителей было 9 процессов `claude.exe`, один из них демон. Самый старый стартовал 21 сентября, за неделю до лога. У серверов разработки было 43 процесса и 14 слушающих портов на всех. Самый старый из них стартовал сразу после полуночи 25 сентября, почти за 4 дня до лога. Я написал whotop, потому что однажды убил не тот node, когда искал, кто держит порт. Нужен ли был ещё хоть один из этих 14, лог не говорит.

## Чего лог не видит

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="Шкала на 15 минут, снимок каждые 303 секунды. Процесс, который живёт всю ночь, пересекает каждый снимок и виден каждый раз. Короткий процесс, живой во время одного снимка, виден один раз. Короткий процесс между двумя снимками не виден никогда.">
  <line x1="190" y1="186" x2="606" y2="186" class="f-line"/>
  <line x1="190.0" y1="182" x2="190.0" y2="190" class="f-line"/>
  <text x="190.0" y="204" text-anchor="middle" class="f-label f-muted">0 мин</text>
  <line x1="328.7" y1="182" x2="328.7" y2="190" class="f-line"/>
  <text x="328.7" y="204" text-anchor="middle" class="f-label f-muted">5 мин</text>
  <line x1="467.3" y1="182" x2="467.3" y2="190" class="f-line"/>
  <text x="467.3" y="204" text-anchor="middle" class="f-label f-muted">10 мин</text>
  <line x1="606.0" y1="182" x2="606.0" y2="190" class="f-line"/>
  <text x="606.0" y="204" text-anchor="middle" class="f-label f-muted">15 мин</text>
  <rect x="215.7" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="217.7" y="26" text-anchor="middle" class="f-label f-accent">снимок</text>
  <rect x="355.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="357.8" y="26" text-anchor="middle" class="f-label f-accent">снимок</text>
  <rect x="495.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="497.8" y="26" text-anchor="middle" class="f-label f-accent">снимок</text>
  <text x="180" y="64" text-anchor="end" class="f-label f-ink">живёт всю ночь</text>
  <rect x="190.0" y="52" width="416.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="78" text-anchor="end" class="f-label f-muted">виден 3 раза</text>
  <text x="180" y="108" text-anchor="end" class="f-label f-ink">короткий, попал в снимок</text>
  <rect x="342.5" y="96" width="30.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="122" text-anchor="end" class="f-label f-muted">виден 1 раз</text>
  <text x="180" y="152" text-anchor="end" class="f-label f-ink">короткий, между снимками</text>
  <rect x="407.2" y="140" width="23.1" height="16" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="180" y="166" text-anchor="end" class="f-label f-muted">не виден</text>
</svg>
<figcaption>Снимок раз в 303-305 секунд видит только то, что живо в этот момент. 978 из 1129 новых процессов видны ровно в одном снимке, так что на самом деле их больше.</figcaption>
</figure>

Снимок раз в 5 минут видит только то, что живо в этот момент. Процесс, который прожил 2 секунды между двумя снимками, в лог не попадает вообще. Здесь я дважды передумал насчёт bash. Сначала я решил, что их запускает снимок, потом, что это просто выборка. Время старта выше вернуло меня к первой версии. Но очень короткий процесс, запущенный в случайный момент, тоже виден, только если он жив во время запроса. Значит, он тоже выглядел бы привязанным к логгеру. Лог эти 2 случая не различает. Как выглядит случайный старт у процессов подольше, показывает Chrome. Его 169 новых процессов пойманы в самом разном возрасте и ни разу сразу после логгера.

978 из 1129 новых процессов видны ровно в одном снимке, так что на самом деле стартов больше. А логгер выглядит большим ещё и потому, что это единственный процесс, который гарантированно жив во время каждого снимка. Его 3 процесса не теряются никогда.

И ещё лог это только список того, кто работает. Сколько ресурсов они съели, в нём нет вообще. whotop работал без прав администратора, поэтому в каждом снимке 158-183 процесса не показали свою командную строку. Для Postgres это значит, что я не могу отличить autovacuum от клиентского подключения. Я снял только эту одну ночь.
