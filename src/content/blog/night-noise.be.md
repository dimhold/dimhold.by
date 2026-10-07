---
title: "8 гадзін здымкаў без аніводнага разрыву. Чвэрць злоўленых новых працэсаў даў мой логер"
description: "Мой інспектар працэсаў whotop усю ноч здымаў ноўтбук на Windows раз на 5 хвілін. Разрываў не было ніводнага, значыць, ноўтбук не заснуў. Да 01:58 яшчэ працавалі сесіі агентаў. За 6 ціхіх гадзін пасля гэтага 30 працэнтаў з 711 злоўленых новых працэсаў даў сам логер, за ім ідуць пашырэнні Chrome, WMI і абслугоўванне Windows. Усю ноч 14 партоў трымалі серверы распрацоўкі, найстарэйшаму было амаль 4 дні."
date: 2026-10-06
lang: be
translationKey: night-noise
tags: ["debugging", "agents"]
---
Мне хацелася ведаць, што робіць мой ноўтбук, пакуль я сплю. У ноч на 29 верасня адна з маіх сесій Claude Code запусціла на ім цыкл з [whotop](https://github.com/dimhold/whotop) 0.4.1: `whotop ls --all --json` кожныя 5 хвілін да 8 раніцы. whotop гэта мой інспектар працэсаў, я напісаў яго, каб высвятляць, хто трымае порт. На ноўтбуку Windows. Зборку Windows мой лог не запісвае, як і версіі Chrome, Postgres і Claude Code. Цыкл таксама пісаў радок у індэкс на кожны здымак. Калі паміж двума здымкамі праходзіла больш за 7 хвілін, ён ставіў пазнаку GAP, каб я ўбачыў, калі ноўтбук заснуў.

У файле няма ніводнага GAP. 96 здымкаў з 23:57 да 07:57 па гадзінніку ноўтбука, з крокам 303-305 секунд. Сон, карацейшы за пару хвілін, так не заўважыш, але нічога падобнага да сну я не ўбачыў.

## Машына была занятая ўсю ноч

На пачатку было 486 працэсаў, у 00:13 іх было ўжо 510, раніцай 467. Найменш было 460, у 03:14 і яшчэ раз у 06:21. За ноч лог убачыў 1615 розных працэсаў. 415 з іх былі ў кожным здымку, гэта значыць пражылі ўсю ноч. Астатнія прыходзілі і сыходзілі. Новым я лічыў працэс, які стартаваў пазней за першы здымак. Ключ гэта pid плюс час старту, бо Windows выкарыстоўвае нумары pid паўторна. Атрымалася 1129 новых працэсаў.

Перш чым называць гэта шумам, трэба было адрэзаць тое, што шумам не было. Да 01:58 мае сесіі агентаў яшчэ працавалі: ішлі зборкі і ssh на сервер, дзе таксама ішла зборка. Апошняй камандай была зборка для прадакшэну ў 01:58:56. Пасля яе да раніцы ніводзін агент не запускаў каманд, апрача самога цыкла логера. Значыць, ціхая частка ночы гэта 6 гадзін, з 01:59 да 07:57. За гэты час лог злавіў 711 новых працэсаў.

## Найбольш шумеў логер

Я расклаў новыя працэсы па бацьках і найбольшай групай аказаўся сам whotop. Кожны здымак гэта node, які запускае PowerShell, а PowerShell атрымлівае кансольны хост. Выходзіць 3 працэсы кожныя 5 хвілін. За ўсю ноч гэта 285 з 1129, 25 працэнтаў. Пасля 01:59 гэта 216 з 711, 30 працэнтаў.

Потым я паглядзеў, калі стартуюць астатнія працэсы адносна логера. Аказалася, што доля можа быць значна большай. На Windows whotop чытае табліцу працэсаў праз `Get-CimInstance Win32_Process`, парты праз `Get-NetTCPConnection` і службы праз `Get-CimInstance Win32_Service`. Усё гэта ідзе праз WMI. А WMI [загружае сваіх правайдараў](https://learn.microsoft.com/en-us/windows/win32/wmisdk/provider-hosting-and-security) у асобны працэс WmiPrvSE. Пасля 01:59 з'явілася 70 новых WmiPrvSE. 40 з іх стартавалі праз 0,39-0,56 секунды пасля node логера. З bash у маіх сесіях Claude Code выйшла гэтак жа. Усе 46 стартавалі праз 0,37-0,74 секунды пасля логера і ні разу ў іншы момант. Яны прыйшлі з 6 розных сесій. Толькі адна з іх тая, што круціць цыкл. Разам з імі стартавалі 28 кансольных хостаў. Калі іх запускае логер, то гэта 330 з 711, 46 працэнтаў ціхай часткі ночы.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Састаўныя слупкі, новыя працэсы, злоўленыя за кожную гадзіну ад поўначы да 8 раніцы. 00:00 усяго 202, логер 36, 01:00 усяго 220, логер 36, 02:00 усяго 149, логер 36, 03:00 усяго 115, логер 33, 04:00 усяго 107, логер 36, 05:00 усяго 112, логер 36, 06:00 усяго 106, логер 36, 07:00 усяго 118, логер 36. Лінія пасля 01:58 адзначае апошнюю каманду агента. Пасля яе логер трымаецца на 33-36 за гадзіну і гэта найбольшая частка кожнага слупка.">
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
  <text x="196" y="42" class="f-label f-accent">апошняя каманда агента 01:58</text>
  <rect x="44" y="10" width="11" height="11" style="fill:var(--accent)"/>
  <text x="60" y="19.5" class="f-label f-muted">мой логер</text>
  <rect x="130.8" y="10" width="11" height="11" class="f-box"/>
  <text x="146.8" y="19.5" class="f-label f-muted">хосты WMI</text>
  <rect x="217.60000000000002" y="10" width="11" height="11" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="233.60000000000002" y="19.5" class="f-label f-muted">Chrome</text>
  <rect x="282.8" y="10" width="11" height="11" style="fill:var(--muted);fill-opacity:0.35"/>
  <text x="298.8" y="19.5" class="f-label f-muted">Windows</text>
  <rect x="355.20000000000005" y="10" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="371.20000000000005" y="19.5" class="f-label f-muted">агенты і іншае</text>
</svg>
<figcaption>Новыя працэсы па гадзіне здымка, у якім іх убачылі ўпершыню. За ноч 1129, з іх 285 гэта сам логер. Пасля 01:58 ніводзін агент не запускаў каманд.</figcaption>
</figure>

## Хто яшчэ прачынаўся

На другім месцы Chrome. Пасля 01:59 ён запусціў 169 новых працэсаў: 96 працэсаў пашырэнняў і 73 рэндэрэры старонак. Гэта ад 22 да 34 за гадзіну аж да 8 раніцы. У камандным радку напісана `--extension-process`, але не напісана, якое пашырэнне, таму я не ведаю, якое з іх перазапускаецца так часта.

Сама Windows запусціла 97. Большасць з іх `svchost`, 69. Камандны радок у іх схаваны, я бачу толькі імя. Цікавейшыя тыя, у каго імя прамоўнае. Пара ўсталёўшчыка модуляў Windows (TiWorker разам з TrustedInstaller) стартавала за ноч 9 разоў, 5 з іх пасля 01:59, апошні раз у 04:39. Працэсы пошукавага індэксатара прыходзілі за ноч 7 разоў, 4 з іх пасля 01:59 і 3 з іх паміж 07:26 і 07:35. `CompatTelRunner`, тэлеметрыя сумяшчальнасці, стартаваў у 03:19 і ў 03:34 запусціў другую копію сябе. Microsoft [апісвае](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-maintenence) абслугоўванне як працу, якая ідзе, калі машына прастойвае і жывіцца ад сеткі. Гэта сышлося б, калі б ноўтбук стаяў на зарадцы, але ў логу гэтага няма. Журнал планавальніка заданняў я таксама не здымаў, таму сказаць, якія з гэтых запускаў былі абслугоўваннем, не магу.

Postgres запусціў 23 даччыныя працэсы, на працягу ўсіх 6 гадзін. 5 з іх таксама стартавалі адразу пасля логера.

## Хто пражыў усю ноч

Сярод 415 доўгажыхароў было 9 працэсаў `claude.exe`, адзін з іх дэман. Самы стары стартаваў 21 верасня, за тыдзень да гэтага. У сервераў распрацоўкі было 43 працэсы і разам яны слухалі 14 партоў. Самы стары з іх стартаваў адразу пасля поўначы 25 верасня, амаль за 4 дні да лога. Я напісаў whotop, бо аднойчы забіў не той node, калі шукаў, хто трымае порт. Ці быў хоць адзін з гэтых 14 яшчэ патрэбны, лог не кажа.

## Чаго лог не бачыць

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="Шкала на 15 хвілін, здымак кожныя 303 секунды. Працэс, які жыве ўсю ноч, перасякае кожны здымак і бачны кожны раз. Кароткі працэс, жывы падчас аднаго здымка, бачны адзін раз. Кароткі працэс паміж двума здымкамі не бачны ніколі.">
  <line x1="190" y1="186" x2="606" y2="186" class="f-line"/>
  <line x1="190.0" y1="182" x2="190.0" y2="190" class="f-line"/>
  <text x="190.0" y="204" text-anchor="middle" class="f-label f-muted">0 хв</text>
  <line x1="328.7" y1="182" x2="328.7" y2="190" class="f-line"/>
  <text x="328.7" y="204" text-anchor="middle" class="f-label f-muted">5 хв</text>
  <line x1="467.3" y1="182" x2="467.3" y2="190" class="f-line"/>
  <text x="467.3" y="204" text-anchor="middle" class="f-label f-muted">10 хв</text>
  <line x1="606.0" y1="182" x2="606.0" y2="190" class="f-line"/>
  <text x="606.0" y="204" text-anchor="middle" class="f-label f-muted">15 хв</text>
  <rect x="215.7" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="217.7" y="26" text-anchor="middle" class="f-label f-accent">здымак</text>
  <rect x="355.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="357.8" y="26" text-anchor="middle" class="f-label f-accent">здымак</text>
  <rect x="495.8" y="34" width="4" height="148" style="fill:var(--accent);fill-opacity:0.8"/>
  <text x="497.8" y="26" text-anchor="middle" class="f-label f-accent">здымак</text>
  <text x="180" y="64" text-anchor="end" class="f-label f-ink">жыве ўсю ноч</text>
  <rect x="190.0" y="52" width="416.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="78" text-anchor="end" class="f-label f-muted">бачны 3 разы</text>
  <text x="180" y="108" text-anchor="end" class="f-label f-ink">кароткі, трапіў у здымак</text>
  <rect x="342.5" y="96" width="30.0" height="16" style="fill:var(--ink);fill-opacity:0.55"/>
  <text x="180" y="122" text-anchor="end" class="f-label f-muted">бачны 1 раз</text>
  <text x="180" y="152" text-anchor="end" class="f-label f-ink">кароткі, паміж здымкамі</text>
  <rect x="407.2" y="140" width="23.1" height="16" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="180" y="166" text-anchor="end" class="f-label f-muted">не бачны</text>
</svg>
<figcaption>Здымак раз на 303-305 секунд бачыць толькі тое, што жывое ў гэты момант. 978 з 1129 новых працэсаў бачныя роўна ў адным здымку, таму насамрэч іх больш.</figcaption>
</figure>

Здымак раз на 5 хвілін бачыць толькі тое, што жывое ў гэты момант. Працэс, які пражыў 2 секунды паміж двума здымкамі, у лог не трапляе ўвогуле. Тут я двойчы перадумаў наконт bash. Спачатку я вырашыў, што іх запускае здымак, потым, што гэта проста выбарка. Час старту вышэй вярнуў мяне да першай версіі. Але вельмі кароткі працэс, запушчаны ў выпадковы момант, таксама бачны, толькі калі ён жывы падчас запыту. Значыць, ён таксама выглядаў бы прывязаным да логера. Лог гэтыя 2 выпадкі не адрознівае. Як выглядае выпадковы старт у працэсаў, што жывуць даўжэй, паказвае Chrome. Яго 169 новых працэсаў злоўленыя ў самым розным узросце і ні разу адразу пасля логера.

978 з 1129 новых працэсаў бачныя роўна ў адным здымку, таму насамрэч стартаў больш. А логер выглядае вялікім яшчэ і таму, што гэта адзіны працэс, які гарантавана жывы падчас кожнага здымка. Яго 3 працэсы не губляюцца ніколі.

І яшчэ лог гэта толькі спіс таго, хто працуе. Колькі рэсурсаў яны з'елі, у ім няма. whotop працаваў без правоў адміністратара, таму ў кожным здымку 158-183 працэсы не паказалі свой камандны радок. Для Postgres гэта значыць, што я не магу адрозніць autovacuum ад кліенцкага падключэння. Я зняў толькі гэтую адну ноч.
