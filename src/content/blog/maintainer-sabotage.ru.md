---
title: "В январе colors и faker сломал их собственный автор. В декабре оба имени по-прежнему числятся за тем же аккаунтом"
description: "В январе автор colors и faker сломал оба пакета. Я запустил оставшийся код, включая тарбол 1.4.2 из Wayback Machine, на 9 топовых пакетах npm, которые зависели от colors. С 1.4.2 зависли бы 7 из них, большинство отреагировало за 5 дней. Но в декабре оба имени всё ещё у автора и большая часть скачиваний идёт туда же."
date: 2022-12-27
lang: ru
translationKey: maintainer-sabotage
tags: ["dependencies", "reliability"]
---
8 января автор colors опубликовал версию `1.4.44-liberty-2`. Она печатала "LIBERTY LIBERTY LIBERTY", флаг из символов ASCII и потом мусор в бесконечном цикле. За 3 дня до этого вышел faker 6.6.6, в котором кода не было совсем. В тредах после этого спорили, имел ли автор на это право. Мой ответ на такие истории всегда был стандартный: коммитить lockfile и пинить версии. Но сколько проектов это на самом деле задело, я понятия не имел.

В ноябре 2020 года тот же автор открыл на GitHub issue под названием "No more free work from Marak". Компаниям там предлагалось 2 варианта: годовой контракт с автором или форк, "fork the project and have someone else work on it". Пока год не кончился, я решил проверить, как далеко дотягивается один мейнтейнер, который ломает собственный пакет. И какой из 2 вариантов в итоге случился.

## Первая версия, которую удалось прочитать

Сломанных версий в npm больше нет. Реестр ещё показывает `1.4.44-liberty-2`, 1.4.1 и 1.4.2 с временем публикации, но тарболы удалены. Ещё 4 места, которые я проверил, в том числе npmmirror и jsDelivr, отвечают 404. Поэтому я начал с истории git в `Marak/colors.js`. За 3 минуты до коммита, который поднимает версию до liberty-2, другой коммит добавляет 10 строк в `lib/index.js`. Они даже не парсятся. Коммит "Fix bug" через 2 минуты убирает лишнюю точку с запятой. После правки:

```js
/* remove this line after testing */
let am = require('../lib/custom/american');
am();
for (let i = 666; i < Infinity; i++) {
  if (i % 333) {
    // console.log('testing'.zalgo.rainbow)
  }
  console.log('testing testing testing testing testing testing testing'.zalgo)
}
```

Я запустил это на Node 16.13.1, актуальном LTS на 8 января. `require('colors')` напечатал около 60 МБ, пока его не убил мой таймаут в 3 секунды. До следующей строки моего скрипта он так и не дошёл. `require('colors/safe')`, точка входа, которая не трогает `String.prototype`, отработал за 0,1 секунды и ничего не напечатал. Причина в том, что `safe.js` грузит `lib/colors.js` напрямую, а цикл стоит только в `lib/index.js`.

Дальше я проверил, кто вообще поставил бы liberty-2. Это пререлиз, а диапазон вроде `^1.4.0` пререлизы не берёт никогда. Я проверял через `npm-pick-manifest` 6.1.1, то есть тот код, которым npm 8.1 выбирает версию. Если `latest` указывает на пререлиз, `^1.4.0` всё равно даёт 1.4.0. Сломанную версию дают только `latest` и `*`. У Live Server в package.json стояло `"colors": "latest"`. Первый комментарий в issue о поломке оставил как раз его пользователь.

Для списка пакетов я взял `npm-high-impact` 1.1.0, а из него часть, где не меньше 1 миллиона скачиваний в неделю: 4366 пакетов npm. Список ноябрьский, то есть это топ на конец года, а не на январь. У 31 из них colors в какой-то момент был в зависимостях. На 8 января напрямую он был у 9, вместе у них был 21 миллион скачиваний за первую неделю января. Ни один из 9 liberty-2 не получил бы. 8 из них грузят только `colors/safe`. Только `cli-progress` грузит обычный `colors`.

К этому моменту половина поста была написана. В заголовке стояло, что зависнет 1 из 9 топовых пакетов. Я исходил из того, что в 1.4.2 тот же цикл, что в liberty-2, хотя этого не проверял.

## 1.4.2

1.4.1 вышла тем же вечером, а 1.4.2 через день. Это обычные версии, поэтому при свежей установке без lockfile все диапазоны с `^` уходили на них. 7 из 9 разрешались в 1.4.2. Исключения только `cli-table` (пин на 1.0.3) и `jasmine-spec-reporter` (пин на 1.4.0). По сообщению DABH от 11 января (коммиты в colors с 2018 года), npm эти версии удалил. В бюллетене безопасности GitHub от 10 января сказано, что цикл есть во всех 3 версиях, но где именно в коде, не сказано.

10 января Wayback Machine сохранил тарбол 1.4.2. Я сверил его с хешем integrity из lockfile репозитория `ngx-ui-scroll`. Там 1.4.2 поставили 9 января и в тот же день откатили с сообщением "tests don't work with 1.4.2". Хеш совпадает. В `lib/index.js` тот же цикл. В `safe.js` он тоже есть, после нового комментария:

```js
/* attempting to patch existing bug */
```

Выходит, `colors/safe` был безопасным всего 1 день. Я поставил каждый из 9 пакетов в версии, актуальной на 8 января, через npm 8.1.2. Потом заменил в дереве все копии colors на 1.4.2 и запустил на том же Node. 3 из них виснут на `require`: logform, `cli-progress` и тестовый раннер Playwright. Остальные 4 как библиотеки загружаются нормально и виснут, как только подгружается часть, которая работает с цветом. У команд `http-server` и jscodeshift это сам запуск. karma виснет, когда загружает свой репортер, а `cli-table3` на первой таблице с цветным заголовком. 2 пакета с пином работают.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="9 пакетов из списка 4366 самых скачиваемых пакетов npm, которые на 8 января 2022 года напрямую зависели от colors. Для каждого: его диапазон colors, версия, в которую npm его разрешает после выхода 1.4.2, что произошло, когда я запустил его с 1.4.2, и от чего он зависит в конце 2022 года. logform: диапазон ^1.2.1, разрешается в 1.4.2, виснет на require, в конце 2022 @colors/colors. cli-progress: диапазон ^1.1.2, разрешается в 1.4.2, виснет на require, в конце 2022 без colors. @playwright/test: диапазон ^1.4.0, разрешается в 1.4.2, виснет на require, в конце 2022 без colors. cli-table3: диапазон ^1.1.2, разрешается в 1.4.2, виснет при вызове, в конце 2022 @colors/colors. karma: диапазон ^1.4.0, разрешается в 1.4.2, виснет при вызове, в конце 2022 @colors/colors. jscodeshift: диапазон ^1.1.2, разрешается в 1.4.2, виснет при вызове, в конце 2022 без colors. http-server: диапазон ^1.4.0, разрешается в 1.4.2, виснет при вызове, в конце 2022 без colors. cli-table: диапазон 1.0.3, разрешается в 1.0.3, работает, в конце 2022 пин 1.0.3. jasmine-spec-reporter: диапазон 1.4.0, разрешается в 1.4.0, работает, в конце 2022 пин 1.4.0.">
  <text x="16" y="26" class="f-label f-muted">пакет</text>
  <text x="214" y="26" class="f-label f-muted">диапазон</text>
  <text x="300" y="26" class="f-label f-muted">на 9 янв.</text>
  <text x="392" y="26" class="f-label f-muted">с 1.4.2</text>
  <text x="540" y="26" class="f-label f-muted">конец 2022</text>
  <line x1="16" y1="34" x2="664" y2="34" class="f-plain"/>
  <rect x="8" y="42" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="58" class="f-mono f-ink" style="font-size:12px">logform</text>
  <text x="214" y="58" class="f-mono f-muted" style="font-size:12px">^1.2.1</text>
  <text x="300" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">виснет на require</text>
  <text x="540" y="58" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <rect x="8" y="66" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="82" class="f-mono f-ink" style="font-size:12px">cli-progress</text>
  <text x="214" y="82" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">виснет на require</text>
  <text x="540" y="82" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <rect x="8" y="90" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="106" class="f-mono f-ink" style="font-size:12px">@playwright/test</text>
  <text x="214" y="106" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">виснет на require</text>
  <text x="540" y="106" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="130" class="f-mono f-ink" style="font-size:12px">cli-table3</text>
  <text x="214" y="130" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="130" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="130" class="f-mono f-accent" style="font-size:12px">виснет при вызове</text>
  <text x="540" y="130" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="154" class="f-mono f-ink" style="font-size:12px">karma</text>
  <text x="214" y="154" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="154" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="154" class="f-mono f-accent" style="font-size:12px">виснет при вызове</text>
  <text x="540" y="154" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="178" class="f-mono f-ink" style="font-size:12px">jscodeshift</text>
  <text x="214" y="178" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="178" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="178" class="f-mono f-accent" style="font-size:12px">виснет при вызове</text>
  <text x="540" y="178" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="202" class="f-mono f-ink" style="font-size:12px">http-server</text>
  <text x="214" y="202" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="202" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="202" class="f-mono f-accent" style="font-size:12px">виснет при вызове</text>
  <text x="540" y="202" class="f-mono f-ink" style="font-size:12px">без colors</text>
  <text x="16" y="226" class="f-mono f-ink" style="font-size:12px">cli-table</text>
  <text x="214" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="300" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="392" y="226" class="f-mono f-muted" style="font-size:12px">работает</text>
  <text x="540" y="226" class="f-mono f-ink" style="font-size:12px">пин 1.0.3</text>
  <text x="16" y="250" class="f-mono f-ink" style="font-size:12px">jasmine-spec-reporter</text>
  <text x="214" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="300" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="392" y="250" class="f-mono f-muted" style="font-size:12px">работает</text>
  <text x="540" y="250" class="f-mono f-ink" style="font-size:12px">пин 1.4.0</text>
</svg>
<figcaption>Версии, актуальные на 8 января 2022 года, диапазоны разрешены так, как это делает npm 8.1, запуск на Node 16.13.1, все копии colors заменены на 1.4.2 из Wayback Machine.</figcaption>
</figure>

Что делала 1.4.1, я не знаю: её копию я не нашёл нигде, даже в Wayback Machine. В `ngx-ui-scroll` 1.4.1 пролежала в lockfile 17 часов. За это время там были коммиты с правкой тестов и конфига karma. Именно на неё они сначала и откатились. Тесты у них идут через karma, а она грузит только `colors/safe`. Это сходилось бы с 1.4.1, у которой цикл только в `lib/index.js`. Но через 90 минут они перешли на 1.4.0, не объяснив почему. И это 1 репозиторий.

## Как быстро ушли

7 из 9 отреагировали за 5 дней. `cli-progress` выпустил версию без colors 9 января, `cli-table3` в тот же день запинил 1.4.0. Ещё 4 подтянулись 10 января, среди них logform и Playwright. karma сделала это 13 января. К концу года 3 из 9 зависят от `@colors/colors`, форка от DABH, вышедшего в феврале. winston, который получал colors через logform, тоже перешёл на него. DABH к тому же мейнтейнер logform и winston.

У faker тоже появился форк от сообщества, `@faker-js/faker`, через 5 дней после 6.6.6. Сам faker не был в обычных dependencies ни у одного из 4366. Он живёт в devDependencies, а 6.6.6 это новая мажорная версия, поэтому `^5.5.3` по-прежнему разрешается в 5.5.3.

## Имя остаётся

Вот это мне кажется странным. На npmjs.com в декабре у colors стоит версия 1.4.0, у faker 6.6.6. У обоих 1 мейнтейнер, marak. Сломанные версии colors удалили, но имя никому не передали. faker 6.6.6 до сих пор `latest`, а кода в нём нет. README из одной строки про Аарона Шварца, а в `.github/FUNDING.yml` всё так же `github: marak`. `npm install faker` сегодня ставит пакет, у которого `require('faker')` падает с `MODULE_NOT_FOUND`.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Скачивания npm по месяцам с января 2021 по ноябрь 2022 года. colors: 96,7 млн в ноябре 2021, 88,5 млн в ноябре 2022. @colors/colors: с февраля 2022, 47,7 млн в ноябре 2022. faker: 11,8 млн в ноябре 2021, 11,0 млн в ноябре 2022. @faker-js/faker: с января 2022, 6,6 млн в ноябре 2022.">
  <text x="70" y="16" class="f-mono f-muted" style="font-size:11px">млн в месяц</text>
  <line x1="70" y1="150.0" x2="600" y2="150.0" class="f-plain"/>
  <text x="64" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="103.8" x2="600" y2="103.8" class="f-plain"/>
  <text x="64" y="107.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="57.7" x2="600" y2="57.7" class="f-plain"/>
  <text x="64" y="61.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="359.1" y1="26" x2="359.1" y2="150" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,74.5 94.1,68.1 118.2,53.3 142.3,63.8 166.4,64.1 190.5,64.8 214.5,69.0 238.6,65.8 262.7,63.2 286.8,57.6 310.9,60.8 335.0,61.1 359.1,47.5 383.2,48.6 407.3,36.5 431.4,60.5 455.5,65.7 479.5,61.9 503.6,74.4 527.7,64.8 551.8,67.6 575.9,71.1 600.0,68.3" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="383.2,142.9 407.3,132.2 431.4,133.6 455.5,127.1 479.5,120.6 503.6,121.3 527.7,114.3 551.8,112.2 575.9,110.2 600.0,106.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="72.3" class="f-mono f-ink" style="font-size:11px">colors</text>
  <text x="606" y="110.0" class="f-mono f-accent" style="font-size:11px">@colors</text>
  <line x1="70" y1="265.0" x2="600" y2="265.0" class="f-plain"/>
  <text x="64" y="269.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="236.4" x2="600" y2="236.4" class="f-plain"/>
  <text x="64" y="240.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="70" y1="207.9" x2="600" y2="207.9" class="f-plain"/>
  <text x="64" y="211.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="359.1" y1="181" x2="359.1" y2="265" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,224.0 94.1,219.1 118.2,209.1 142.3,212.8 166.4,212.8 190.5,207.5 214.5,207.2 238.6,205.7 262.7,201.3 286.8,200.0 310.9,197.4 335.0,202.6 359.1,197.6 383.2,200.0 407.3,191.4 431.4,201.7 455.5,199.4 479.5,198.2 503.6,204.1 527.7,194.8 551.8,199.1 575.9,201.2 600.0,202.1" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="359.1,264.1 383.2,261.0 407.3,256.6 431.4,253.4 455.5,246.3 479.5,241.8 503.6,240.9 527.7,231.5 551.8,231.0 575.9,230.1 600.0,227.3" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="206.1" class="f-mono f-ink" style="font-size:11px">faker</text>
  <text x="606" y="231.3" class="f-mono f-accent" style="font-size:11px">@faker-js</text>
  <text x="70" y="284" text-anchor="start" class="f-mono f-muted" style="font-size:11px">янв. 2021</text>
  <text x="359.1" y="284" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">янв. 2022</text>
  <text x="600" y="284" text-anchor="end" class="f-mono f-muted" style="font-size:11px">нояб. 2022</text>
</svg>
<figcaption>API скачиваний npm, суммы за месяц. Вертикальная линия — январь 2022.</figcaption>
</figure>

Скачивания тоже почти не сдвинулись. В ноябре у colors было 88,5 миллиона скачиваний, на 8% меньше, чем в ноябре 2021 года, а у `@colors/colors` 47,7 миллиона. У faker 11,0 миллиона, на 7% меньше, чем год назад, против 6,6 миллиона у форка. API npm не делит скачивания по версиям, поэтому сколько из 11 миллионов приходится на старую 5.5.3, я сказать не могу.

Из 2 вариантов 2020 года я вижу форк. Топовые пакеты отреагировали за неделю, в основном пином на 1.4.0. Но имя осталось у автора. Большая часть скачиваний до сих пор идёт на это имя. Форк colors выпущен DABH, чьи собственные logform и winston от colors зависели. Подозреваю, что так держится много инфраструктуры, но 9 пакетов слишком мало, чтобы это утверждать.

## Чего я не проверял

Транзитивно зависимые пакеты за пределами топа. Скорее всего, большая часть из 88 миллионов скачиваний colors приходит оттуда. Сколько проектов сидело на lockfile и сломанных версий так и не увидели. Код 1.4.1. И точное время, когда npm удалил 3 версии, потому что реестр его не показывает.
