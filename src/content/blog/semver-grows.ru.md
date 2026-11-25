---
title: "В npm 2.14.0 добавили команду и npm te перестал запускать тесты"
description: "Я загрузил 10 301 версию 200 пакетов npm, от которых больше всего зависят, и сравнил экспортируемые имена. Минорные релизы и патчи теряют имя редко, но их таких 73 против 64 мажорных. А npm te перестал работать, потому что в npm добавили команду."
date: 2016-12-10
lang: ru
translationKey: semver-grows
tags: ["dependencies", "open-data"]
---

Я сделал пустой проект, в котором тестовый скрипт печатает одну строку. Потом вызвал `npm te` в двух соседних версиях npm.

```
$ npm te   # 2.13.5
> x@1.0.0 test ...
> echo tests ran

tests ran

$ npm te   # 2.14.0

Usage: npm <command>
```

Между этими версиями в npm появилась одна новая команда, `team`. По правилам semver это минорный релиз как из учебника: что-то добавили, ничего не убрали. Но `te` раньше было сокращением от `test`, а теперь подходит двум командам и поэтому не значит ничего.

Полез я в это после доклада Рича Хикки `Spec-ulation`, он прочитал его 2 декабря на Clojure/conj. Изменения он делит на рост и поломку. При росте библиотека требует меньше или даёт больше, при поломке наоборот. Про номера версий у него на слайде написано, что новая минорная значит "you don't care" (вам всё равно), а новая мажорная значит "you're screwed" (вы попали).

Я слушал и соглашался, но сам годами ставлю каретку `^` перед каждой зависимостью и ни разу не считал, что она пропускает. Решил посчитать.

Считали и до меня. Рамакерс, ван Дёрсен и Виссер в 2014 году сделали это для Maven куда аккуратнее. У них хотя бы одно ломающее изменение нашлось примерно в трети релизов и мажорные мало отличались от минорных. Менеджер пакетов Elm сравнивает типы и сам вычисляет номер за автора. Для npm мне хватало чего-нибудь погрубее.

## Что я взял

Пакеты взяты из списка anvaka/npmrank, где они стоят по числу зависящих от них, первые 200 строк, ревизия от 3 декабря. Версии я взял все стабильные, опубликованные до этого дня, их 11 715. Каждую я распаковал с теми зависимостями, которые она получила бы 3 декабря (install-скрипты не запускались) и загрузил через `require` в Node.js 6.9.1. С 10 301 версии удалось снять список экспортируемых имён, своих и унаследованных, а для экспортируемого конструктора ещё и методов его прототипа. Имена с подчёркиванием в начале не в счёт. Остальные 1414 не загрузились, 627 из них потому, что не нашёлся какой-то модуль.

Каждая версия сравнивается со старшей из меньших, которые к её дню уже вышли. Релиз считается убравшим имя, если пропало хотя бы одно. Слабее проверки на "даёт меньше" не придумать, ведь функция может сохранить имя и поменять всё остальное. До прогона я записал ожидание: единицы процентов для минорных и патчей, примерно половина для мажорных.

## Что насчиталось

| шаг | пар | имя исчезло | только добавились | имена те же |
|---|---|---|---|---|
| patch | 4305 | 34 | 179 | 4092 |
| minor | 1506 | 39 | 282 | 1185 |
| major | 205 | 64 | 30 | 111 |
| 0.x patch | 2380 | 47 | 189 | 2144 |
| 0.x minor | 700 | 97 | 138 | 465 |
| с 0.x на 1 и выше | 83 | 21 | 17 | 45 |

<figure class="fig">
<svg viewBox="0 0 680 314" role="img" aria-label="Доля релизов, в которых исчезло экспортируемое имя, и доля релизов, где имена только добавились, по видам шага. patch: 0,8%, 4,2%; minor: 2,6%, 18,7%; 0.x patch: 2,0%, 7,9%; 0.x minor: 13,9%, 19,7%; с 0.x на 1 и выше: 25,3%, 20,5%; major: 31,2%, 14,6%.">
  <line x1="160.0" y1="40" x2="160.0" y2="284" class="f-plain"/>
  <text x="160.0" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0%</text>
  <line x1="285.7" y1="40" x2="285.7" y2="284" class="f-plain"/>
  <text x="285.7" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">10%</text>
  <line x1="411.4" y1="40" x2="411.4" y2="284" class="f-plain"/>
  <text x="411.4" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">20%</text>
  <line x1="537.1" y1="40" x2="537.1" y2="284" class="f-plain"/>
  <text x="537.1" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">30%</text>
  <text x="148.0" y="64.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">patch</text>
  <rect x="160.0" y="46.0" width="9.9" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="176.9" y="57.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">0,8</text>
  <rect x="160.0" y="62.0" width="52.3" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="219.3" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">4,2</text>
  <text x="148.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">minor</text>
  <rect x="160.0" y="86.0" width="32.6" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="199.6" y="97.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2,6</text>
  <rect x="160.0" y="102.0" width="235.4" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="402.4" y="113.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18,7</text>
  <text x="148.0" y="144.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x patch</text>
  <rect x="160.0" y="126.0" width="24.8" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="191.8" y="137.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2,0</text>
  <rect x="160.0" y="142.0" width="99.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="266.8" y="153.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">7,9</text>
  <text x="148.0" y="184.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x minor</text>
  <rect x="160.0" y="166.0" width="174.2" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="341.2" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">13,9</text>
  <rect x="160.0" y="182.0" width="247.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="414.8" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">19,7</text>
  <text x="148.0" y="224.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">с 0.x на 1 и выше</text>
  <rect x="160.0" y="206.0" width="318.1" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="485.1" y="217.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">25,3</text>
  <rect x="160.0" y="222.0" width="257.5" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="424.5" y="233.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">20,5</text>
  <text x="148.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">major</text>
  <rect x="160.0" y="246.0" width="392.5" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="559.5" y="257.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">31,2</text>
  <rect x="160.0" y="262.0" width="184.0" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="351.0" y="273.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">14,6</text>
  <rect x="160.0" y="12.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="179.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">имя исчезло</text>
  <rect x="360.0" y="12.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="379.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">имена только добавились</text>
</svg>
<figcaption>Доля пар, проценты. 200 пакетов npm, от которых больше всего зависят, версии до 3 декабря 2016 года.</figcaption>
</figure>

С минорными и патчами я угадал, 2,6% и 0,8%. Каретка в этой таблице выглядит прилично. Но мажорных релизов мало. Начиная с версии 1 имя потеряли 73 минорных релиза и патча и только 64 мажорных.

За жизнь одной мажорной ветки эти малые доли накапливаются. Я взял в каждой ветке первую и последнюю загрузившуюся версию. В 35 ветках из 319 хотя бы одного имени из первой версии в последней уже нет.

Я думал, что эти 73 окажутся вылезшими наружу внутренностями. Прочитал список. В 13 релизах пропавшее имя потом вернулось в той же мажорной ветке, часть таких случаев похожа на оплошность. chalk 1.1.2 потерял `hasColor` и `stripColor`, а через 45 минут в 1.1.3 они снова были, `aws-sdk` прожил без `SimpleWorkflow` 11 дней. Ещё 13 приходятся на npm, о нём ниже. В 12 из оставшихся 47 исчезнувшее имя есть в README старой версии. Это оценка сверху, слова вроде `log` и `then` совпадают случайно, но `node-uuid` 1.4.0 и правда выкинул 3 описанных в документации генератора случайных чисел. Остальные 35, на мой взгляд, в основном и правда внутренности, из них 7 у одного TypeScript.

В 41 релизе из 73 одновременно что-то добавилось. Среди них есть простые переименования, в immutable 2.0.2 `fromJSON` стал `fromJS`. Совет Хикки обошёлся бы тут в одну строку: старое имя оставить, новое положить рядом.

## Мажорные релизы, которые ничего не убрали

С мажорными я промахнулся. Ждал, что имя пропадёт в половине, а пропало в 64 из 205. Ещё в 22 имя исчезло уровнем ниже, в объекте или прототипе, либо сменился тип экспорта. В остальных 119 я не вижу никаких потерь и в 102 из них имена верхнего уровня совпадают полностью. lodash 2.0.0 сохранил все 262 имени и добавил 24. У browserify 8 мажорных версий подряд, с 6 по 13, одни и те же 9 имён.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="205 мажорных релизов одной полосой из 4 частей. 64: исчезло имя верхнего уровня; 22: исчезло имя уровнем ниже или сменился тип; 17: ничего не исчезло, имена добавились; 102: имена верхнего уровня те же самые.">
  <rect x="30.0" y="34.0" width="191.6" height="44.0" style="fill:var(--accent);stroke:none"/>
  <text x="125.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <rect x="223.6" y="34.0" width="64.5" height="44.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="255.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">22</text>
  <rect x="290.1" y="34.0" width="49.4" height="44.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="314.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">17</text>
  <rect x="341.5" y="34.0" width="306.5" height="44.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="494.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">102</text>
  <rect x="30.0" y="98.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="82.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">64</text>
  <text x="94.0" y="109.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">исчезло имя верхнего уровня</text>
  <rect x="30.0" y="122.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="82.0" y="133.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22</text>
  <text x="94.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">исчезло имя уровнем ниже или сменился тип</text>
  <rect x="30.0" y="146.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="82.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">17</text>
  <text x="94.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">ничего не исчезло, имена добавились</text>
  <rect x="30.0" y="170.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="82.0" y="181.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">102</text>
  <text x="94.0" y="181.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">имена верхнего уровня те же самые</text>
</svg>
<figcaption>205 мажорных релизов по тому, что видно в экспорте. В 119 из них ничего не исчезло.</figcaption>
</figure>

Что-то там, наверное, всё же сломали, в опциях или в выводе, по номеру этого не узнать. В 10 из 119 подсказка есть в `package.json`: пакет просит Node поновее или новую peer-зависимость.

"Требует больше" тоже не дожидается мажорной версии. Начиная с версии 1 минимальный Node в `engines` подняли 68 релизов, из них мажорных всего 17.

## Случай с te

Сокращения npm строит сам. Любой префикс, который подходит только одной команде, работает как эта команда.

<figure class="fig">
<svg viewBox="0 0 680 180" role="img" aria-label="Префиксы команд npm. В npm 2.13.5 te и tes ведут к test. В npm 2.14.0 tes ведёт к test, tea ведёт к team, а te не ведёт никуда, потому что подходит обеим командам.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.13.5</text>
  <text x="370.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.14.0</text>
  <rect x="20" y="44" width="60" height="30" class="f-box"/>
  <text x="50.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">te</text>
  <rect x="20" y="88" width="60" height="30" class="f-box"/>
  <text x="50.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="200" y="66" width="90" height="30" class="f-box"/>
  <text x="245.0" y="86.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <line x1="80" y1="59" x2="200" y2="78" class="f-line"/>
  <line x1="80" y1="103" x2="200" y2="86" class="f-line"/>
  <rect x="370" y="44" width="60" height="30" class="f-box"/>
  <text x="400.0" y="64.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">te</text>
  <rect x="370" y="88" width="60" height="30" class="f-box"/>
  <text x="400.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="370" y="132" width="60" height="30" class="f-box"/>
  <text x="400.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tea</text>
  <rect x="550" y="88" width="90" height="30" class="f-box"/>
  <text x="595.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <rect x="550" y="132" width="90" height="30" class="f-box"/>
  <text x="595.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">team</text>
  <line x1="430" y1="103" x2="550" y2="103" class="f-line"/>
  <line x1="430" y1="147" x2="550" y2="147" class="f-line"/>
  <line x1="430" y1="59" x2="520" y2="59" class="f-line" style="stroke-dasharray:4 4"/>
  <text x="532.0" y="63.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">ничего</text>
</svg>
<figcaption>Новая команда отбирает короткий префикс у старой.</figcaption>
</figure>

Поэтому каждая добавленная команда отбирает у соседей часть префиксов. `logout` в 2.6.0 отнял `npm log`, который значил login. После появления `install-test` в 3.4.0 даже `instal` не ведёт никуда. В 2.1.12 npm выучил опечатку `verison` и забыл `ver`. В 2.1.9 среди префиксов начал учитываться псевдоним с опечаткой `isntall` и `npm is` перестал значить issues, а комментарий в этом коде гласит "we have our reasons" (у нас свои причины). Из 13 релизов npm в моём списке так устроены 11, в двух других убрали саму команду, `submodule` и `faq`, оба раза в патче.

По определению Хикки это поломка, npm даёт меньше, чем раньше. В том же докладе он говорит, что добавить что-то в коллекцию это рост и точка. А тут добавленное имя отобрало старое. Я бы тоже счёл это ростом и поднял минорную версию.

## Где прогон сломался

В первом прогоне 25 пакетов загрузились нормально, потом у optimist одна версия из 39, а потом ничего у следующих 38 пакетов. optimist 0.1.4 вставляет 2 элемента в начало `process.argv`. Моя проба брала оттуда путь для вывода уже после `require` и записала JSON поверх собственного исходника. Теперь она сначала копирует аргументы и лежит в каталоге только для чтения.

С поиском по README тоже вышла ошибка. Регулярное выражение я собирал из строки и обратная косая черта у `\w` в ней потерялась, поэтому `obj` находилось внутри слова object и релизов насчиталось 15 вместо 12.

## Чего я не проверял

До прогона я записал для пар простой порядок semver, но тогда бэкпорт сравнивается с версиями, которые вышли позже него, поэтому правило я поменял, когда писал анализ. По первому правилу в строке minor 38 удалений вместо 39.

Поведение, аргументы и опции этим способом не увидеть. У пакетов, которые экспортируют одну голую функцию, имён нет, поэтому в таблицу они не попали. 4 из 13 пар npm это одно изменение, посчитанное 4 раза, потому что у версий npm того времени странные даты публикации в реестре, один такой повтор есть и у immutable. Без них вместо 73 будет 69. Как выглядит хвост npm за первыми двумя сотнями, я не знаю. И не смотрел, пользовался ли кто-нибудь пропавшими именами, тем же `npm te`.
