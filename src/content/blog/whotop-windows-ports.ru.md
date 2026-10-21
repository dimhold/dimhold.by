---
title: "На моём ноутбуке с Windows whotop нашёл, кто держит каждый порт. 11 его ответов ссылались на слово, которого нет"
description: "Я взял один снимок со своего ноутбука с Windows в 01:59 и проверил, что whotop 0.4.1 сказал о каждом из 33 процессов, которые держат порт на прослушивание. С портами всё сошлось: 8 процессов astro сидели не на том порту, что в их командной строке. whotop показал настоящий. Но 11 строк ссылались на vite как на улику, а этого слова в командной строке нет, 8 угаданных каталогов оказались кэшем npx или временной папкой, а имена служб доходили только до интерактивного экрана."
date: 2026-11-21
lang: ru
translationKey: whotop-windows-ports
tags: ["debugging", "networking"]
---
Я написал [whotop](https://github.com/dimhold/whotop) в августе, после вечера, когда порт 4310 оказался занят и я убил не тот процесс node. 19 августа я выложил пакет в npm. Главное, что обещает README: whotop говорит, что значение недоступно и почему, вместо уверенной догадки. Рядом с каждой ролью стоит правило, по которому она назначена.

Это обещание я проверял на раннерах CI и на фикстурах, которые записал сам. Ни разу я не взял настоящий вечер своей машины и не задал ей построчно тот единственный вопрос, ради которого инструмент существует. В октябре я писал про [ночной лог своего ноутбука](https://dimhold.by/ru/blog/night-noise/). В том же логе есть ответ: 96 снимков `whotop ls --all --json`, версия 0.4.1, Windows, без прав администратора. Я взял снимок 29 сентября в 01:59, когда мои агентские сессии только что закончили работу. Смотрел только на процессы, которые держат TCP-порт на прослушивание.

Таких 33 из 484 процессов. Роль whotop дал 21 из них: Postgres и 20 процессам node, которые он называет dev-серверами. Остальные 12 whotop пометил как unknown. 11 из них вообще не показали командную строку.

## С портами всё в порядке

На Windows whotop одним вызовом PowerShell получает таблицу процессов вместе с таблицей сокетов. Pid владельца каждого сокета снят в тот же момент, что и список процессов. По README, порт, приписанный не тому процессу, это та ошибка, которой этот инструмент допускать нельзя. За эту ночь я не нашёл в логе ничего, что противоречило бы колонке портов.

Этот пример я не планировал. 5 процессов на ноутбуке были запущены как `astro preview --port 4321`, в разное время за 2 дня. Я их так и не остановил. 4321 держит только один из них, pid 23620. Остальные 4 по таблице сокетов сидят на 4322, 4323, 4324 и 4325. Ещё 5 запущены с `--port 4326` в первые 20 минут после полуночи и сидят на портах с 4326 по 4330. У 8 процессов порт в командной строке не тот, который они держат.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="Две колонки. Слева 10 командных строк, 5 из них astro preview --port 4321 и 5 с --port 4326. Справа порт, который процесс держит на самом деле. просил 4321, держит 4321, просил 4321, держит 4322, просил 4321, держит 4323, просил 4321, держит 4324, просил 4321, держит 4325, просил 4326, держит 4326, просил 4326, держит 4327, просил 4326, держит 4328, просил 4326, держит 4329, просил 4326, держит 4330. Порт из своей командной строки держат только 2 из 10.">
  <text x="145" y="24" text-anchor="middle" class="f-label f-muted">просит командная строка</text>
  <text x="505" y="24" text-anchor="middle" class="f-label f-muted">держит по таблице сокетов</text>
  <rect x="20" y="44" width="250" height="16" class="f-box"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="44" width="70" height="16" class="f-box"/>
  <text x="505" y="56" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4321</text>
  <line x1="270" y1="52" x2="470" y2="52" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="66" width="250" height="16" class="f-box"/>
  <text x="30" y="78" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="66" width="70" height="16" class="f-box"/>
  <text x="505" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4322</text>
  <line x1="270" y1="74" x2="470" y2="74" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="88" width="250" height="16" class="f-box"/>
  <text x="30" y="100" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="88" width="70" height="16" class="f-box"/>
  <text x="505" y="100" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4323</text>
  <line x1="270" y1="96" x2="470" y2="96" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="110" width="250" height="16" class="f-box"/>
  <text x="30" y="122" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="110" width="70" height="16" class="f-box"/>
  <text x="505" y="122" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4324</text>
  <line x1="270" y1="118" x2="470" y2="118" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="132" width="250" height="16" class="f-box"/>
  <text x="30" y="144" class="f-mono f-ink" style="font-size:11px">astro preview --port 4321</text>
  <rect x="470" y="132" width="70" height="16" class="f-box"/>
  <text x="505" y="144" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4325</text>
  <line x1="270" y1="140" x2="470" y2="140" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="170" width="250" height="16" class="f-box"/>
  <text x="30" y="182" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="170" width="70" height="16" class="f-box"/>
  <text x="505" y="182" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4326</text>
  <line x1="270" y1="178" x2="470" y2="178" style="stroke:var(--muted);stroke-width:1.2"/>
  <rect x="20" y="192" width="250" height="16" class="f-box"/>
  <text x="30" y="204" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="192" width="70" height="16" class="f-box"/>
  <text x="505" y="204" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4327</text>
  <line x1="270" y1="200" x2="470" y2="200" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="214" width="250" height="16" class="f-box"/>
  <text x="30" y="226" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="214" width="70" height="16" class="f-box"/>
  <text x="505" y="226" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4328</text>
  <line x1="270" y1="222" x2="470" y2="222" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="236" width="250" height="16" class="f-box"/>
  <text x="30" y="248" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="236" width="70" height="16" class="f-box"/>
  <text x="505" y="248" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4329</text>
  <line x1="270" y1="244" x2="470" y2="244" style="stroke:var(--accent);stroke-width:1.4"/>
  <rect x="20" y="258" width="250" height="16" class="f-box"/>
  <text x="30" y="270" class="f-mono f-ink" style="font-size:11px">astro preview --port 4326</text>
  <rect x="470" y="258" width="70" height="16" class="f-box"/>
  <text x="505" y="270" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">4330</text>
  <line x1="270" y1="266" x2="470" y2="266" style="stroke:var(--accent);stroke-width:1.4"/>
</svg>
<figcaption>10 процессов astro preview, запущенных с --port 4321 или --port 4326, снимок в 01:59. 8 из них держат порт, которого нет в их командной строке.</figcaption>
</figure>

Это снова мой августовский вечер. Если искать 4321 в командных строках, будет 5 кандидатов и 4 из них не те. `whotop port 4321` даёт один pid.

## 11 строк ссылаются на улику, которой нет

Все 11 процессов astro, эти 10 и ещё один с `--port 4331`, подписаны как `vite`. Рядом с каждым напечатана причина "known dev server in the command line (vite)". Слова "vite" нет ни в одной из этих 11 командных строк. Там запущен `astro.js preview`.

Я полез в код. Правило срабатывает потому, что входной скрипт это astro. Это верно. Но ярлык и причину собирает одна вспомогательная функция, которая ищет в командной строке первый токен dev-сервера. Если не находит ни одного, она всё равно возвращает первый токен из списка. Первым в списке стоит vite. Роль верная. Но слово в ярлыке и в причине берётся из значения по умолчанию. В README написано, что классификация, которую нельзя проверить, это та же догадка, только вежливее. Здесь командная строка лежала в логе, так что проверить я мог.

## Каталоги только выведены

На Windows whotop не читает рабочий каталог чужого процесса. Чтобы его узнать, пришлось бы читать память процесса, поэтому он берёт самый длинный абсолютный путь из командной строки и помечает его `(inferred)`. Для 11 строк astro это каталог проекта. Похоже на правду, хотя по логу я и этого проверить не могу.

Ещё для 7 строк он не говорит ничего полезного. 6 процессов `http-server` и 1 `serve` запущены из кэша npx, поэтому единственный путь в их командной строке ведёт в этот кэш. whotop обрезает его перед `node_modules` и выдаёт каталог кэша. У 6 строк `http-server` получается один и тот же каталог. По нему их не различить. Один из этих процессов держит 4310, тот самый порт из августовского вечера.

Одна строка неверна из-за ошибки в разборе пути. У сервера `ts-node-dev` на порту 4400 в командной строке 2 пути: файл хука в `D:/Temp` и за ним путь проекта. Моё регулярное выражение для поиска путей допускает пробелы внутри пути. Первое совпадение перескакивает через пробел и забирает с собой букву диска второго пути. Второй путь whotop не видит вовсе. В строке стоит `D:/Temp`. Я воспроизвёл это на опубликованном пакете: без пути хука та же команда даёт каталог проекта.

<figure class="fig">
<svg viewBox="0 0 640 166" role="img" aria-label="Командная строка сервера ts-node-dev, сокращённая. Поиск пути начинается с D:/Temp, проходит через пробел и останавливается на двоеточии после следующей буквы диска. Каталогом остаётся D:/Temp. Путь проекта после него не находится, потому что его букву диска съело первое совпадение.">
  <text x="24" y="62" textLength="15.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">-r</text>
  <rect x="47.4" y="44" width="171.6" height="26" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="47.4" y="62" textLength="171.6" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">D:/Temp/hook-0417.js D</text>
  <rect x="219.0" y="44" width="273.0" height="26" style="fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="219" y="62" textLength="273.0" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">:\work\api\node_modules\...\wrap.js</text>
  <text x="47.4" y="34" class="f-label f-accent">1-е совпадение, до двоеточия</text>
  <text x="219.0" y="88" class="f-label f-muted">не найдено</text>
  <text x="24" y="124" class="f-label f-muted">выдано как каталог:</text>
  <text x="274" y="124" class="f-mono f-accent">D:/Temp</text>
  <text x="24" y="150" class="f-label f-muted">та же команда без пути хука:</text>
  <text x="274" y="150" class="f-mono f-ink">D:\work\api</text>
</svg>
<figcaption>Поиск пути допускает пробелы внутри пути. Первое совпадение забирает букву диска следующего пути, поэтому путь проекта не читается вовсе. Пути сокращены.</figcaption>
</figure>

Из 20 строк node у 8 каталог формально помечен как выведенный и ничем не помогает, когда я собираюсь что-то убить. Ещё 3 строки получили вместо ярлыка только имя файла скрипта, но там причина честно говорит, что больше ничего не совпало. В README эта проблема с каталогом описана на примере `claude.exe`, у которого каталог установки выглядел как рабочий каталог. Тот случай я исправил в августе, а других искать не стал.

<figure class="fig">
<svg viewBox="0 0 640 386" role="img" aria-label="Сетка из 20 строк node, которые держат порт на прослушивание, по строке на процесс, 3 колонки: порт, улика в ярлыке, каталог. Порт в порядке во всех строках. В 11 строках уликой названо слово vite, а этого слова в командной строке нет. В 8 строках выведенный каталог это кэш npx или временная папка.">
  <text x="225" y="30" text-anchor="middle" class="f-label f-muted">порт</text>
  <text x="375" y="30" text-anchor="middle" class="f-label f-muted">улика</text>
  <text x="525" y="30" text-anchor="middle" class="f-label f-muted">каталог</text>
  <text x="140" y="52" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4301 serve</text>
  <rect x="152" y="40" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="40" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="51" text-anchor="middle" class="f-label f-ink" style="font-size:11px">имя файла</text>
  <rect x="452" y="40" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="51" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4310 http-server</text>
  <rect x="152" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="57" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="57" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="68" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="86" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4311 http-server</text>
  <rect x="152" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="74" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="74" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="85" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="103" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4312 http-server</text>
  <rect x="152" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="91" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="91" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="102" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="120" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4313 http-server</text>
  <rect x="152" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="108" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="108" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="119" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="137" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4314 http-server</text>
  <rect x="152" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="125" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="125" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="136" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="154" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4315 http-server</text>
  <rect x="152" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="142" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="452" y="142" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="153" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">кэш npx</text>
  <text x="140" y="171" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4321 astro</text>
  <rect x="152" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="159" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="170" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="159" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="188" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4322 astro</text>
  <rect x="152" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="176" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="187" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="176" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="205" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4323 astro</text>
  <rect x="152" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="193" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="204" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="193" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="222" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4324 astro</text>
  <rect x="152" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="210" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="221" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="210" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="239" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4325 astro</text>
  <rect x="152" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="227" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="238" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="227" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="256" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4326 astro</text>
  <rect x="152" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="244" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="255" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="244" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="273" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4327 astro</text>
  <rect x="152" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="261" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="272" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="261" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="290" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4328 astro</text>
  <rect x="152" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="278" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="289" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="278" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="307" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4329 astro</text>
  <rect x="152" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="295" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="306" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="295" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="324" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4330 astro</text>
  <rect x="152" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="312" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="323" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="312" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="341" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4331 astro</text>
  <rect x="152" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="329" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="375" y="340" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">ссылается на vite</text>
  <rect x="452" y="329" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <text x="140" y="358" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4400 ts-node-dev</text>
  <rect x="152" y="346" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="346" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="357" text-anchor="middle" class="f-label f-ink" style="font-size:11px">имя файла</text>
  <rect x="452" y="346" width="146" height="14" style="fill:var(--accent);fill-opacity:0.85"/>
  <text x="525" y="357" text-anchor="middle" class="f-label " style="font-size:11px;fill:var(--surface, #fff)">временная папка</text>
  <text x="140" y="375" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8765 script</text>
  <rect x="152" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
  <rect x="302" y="363" width="146" height="14" style="fill:var(--muted);fill-opacity:0.3"/>
  <text x="375" y="374" text-anchor="middle" class="f-label f-ink" style="font-size:11px">имя файла</text>
  <rect x="452" y="363" width="146" height="14" style="fill:var(--ink);fill-opacity:0.12"/>
</svg>
<figcaption>20 строк node с портом на прослушивание в 01:59. 11 ярлыков ссылаются на слово, которого нет, 8 каталогов ничего не говорят о проекте.</figcaption>
</figure>

## Имена служб остаются на одном экране

В этом снимке 163 из 484 процессов скрыли командную строку. Реестр служб, который whotop читает без прав администратора, назвал 115 из них. Предупреждение в каждом снимке так и говорит. Но я поискал во всём ночном логе хоть одно имя службы и не нашёл. Имена привязываются к процессу, но печатает их только интерактивный экран. `whotop ls`, `whotop port` и вывод JSON их выбрасывают.

Я воспроизвёл это на подготовленных данных: `svchost.exe` держит порт 135 и запускает службу `RpcSs`. В интерактивном экране это `svchost.exe [RpcSs]`. `whotop port 135` показывает `unknown` и советует запустить оболочку с правами администратора. `whotop ls RpcSs` ничего не находит. На моём ноутбуке 4 из 12 неизвестных процессов, слушающих порт, были `svchost`, а этот процесс для того и нужен, чтобы запускать в себе службы. Какие это были службы, лог сказать не может: JSON уже выбросил имена.

## Чего я не проверял

Настоящий рабочий каталог ни одного из этих процессов я по логу проверить не могу. Я не запускал whotop с правами администратора, поэтому не знаю, скольких из 11 молчащих процессов whotop назвал бы с правами администратора. Порты 139, 445 и 5357 принадлежат pid 4, `System`. whotop там просто пишет unknown. Ещё в снимке 25 сокетов без процесса-владельца, их не показывает ни одна строка.

Это один ноутбук и один снимок, но за ночь числа почти не меняются. В 81 из 96 снимков 32 или 33 процесса, слушающих порт, из них 21 с ролью. 11 ярлыков vite есть в 91 снимке, а 7 каталогов npx во всех 96.

Ни одна из 3 проблем не исправлена в 0.4.1, версии, которая сейчас лежит в npm.
