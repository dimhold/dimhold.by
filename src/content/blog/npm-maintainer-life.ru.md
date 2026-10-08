---
title: "У кого ключ от пакета npm. В 2026 году на большинстве релизов стоит имя машины"
description: "Я прочитал записи о публикациях 5000 самых скачиваемых пакетов npm. Почти у половины 1 мейнтейнер, у 19 процентов первого автора уже нет в списке, 1798 не выпускали ничего 2 года. В 2026 году большинство релизов выпускает машина, 1429 пакетов через trusted publishing. Эта перемена сломала мой собственный счёт брошенных пакетов: честный диапазон от 213 до 369."
date: 2026-10-08
lang: ru
translationKey: npm-maintainer-life
tags: ["dependencies", "open-data", "statistics"]
---
В 2018 году автор `event-stream` отдал пакет незнакомцу, который об этом попросил. Незнакомец добавил код, охотившийся за кошельком для биткоинов, приложением Copay. Я годами пересказывал эту историю как краткую версию того, как живёт пакет npm. Пакет пишет один человек, потом устаёт и либо отдаёт его кому-то, либо бросает. Я рассказывал это на ревью кода, но ни разу не посчитал, как часто бывает каждый из этих исходов.

Данных в реестре для этого хватает. У каждой версии в документе пакета есть `_npmUser`, аккаунт, который её опубликовал. Рядом лежат время публикации и список мейнтейнеров на тот момент. 8 октября 2026 года я взял 5000 самых скачиваемых имён из `npm-high-impact` 1.13.0, этот список собран в июне 2026 года. Небольшой скрипт на Python 3.12 скачал полный документ каждого пакета. 4 пакета оказались непригодными, осталось 4996 пакетов и 965617 версий с датой.

`_npmUser` это аккаунт, который нажал publish или чей токен это сделал. Про то, кто писал код, он ничего не говорит. Для этого нужна история git, а её я не открывал. Дальше речь только о том, у кого ключ.

## Кто публикует

Почти половина списка это один человек. У 2351 пакета, это 47 процентов, сегодня ровно 1 мейнтейнер. 2504 пакета ни разу не получили версию от второго человеческого аккаунта. Там, где права есть у 2 и больше людей, медианный пакет всё равно получил 73 процента версий от одного аккаунта.

В первой таблице "авторов" вышла забавная ошибка. На втором месте со 217 пакетами стоял `types`, а это бот DefinitelyTyped от Microsoft. Гугловский `google-wombot` опубликовал 78061 версию. Прежде чем считать людей, пришлось отделить машины. Версия считается машинной, если npm пометил её как trusted publishing. Или если имя аккаунта похоже на бота или на релизный конвейер. 14 аккаунтов компаний я добавил руками. Потом исключил из шаблона 10 аккаунтов, `ceejbot` и `jonkoops`, например, это люди. Точнее чем до нескольких процентов этому разделению я бы не доверял.

## Кто передаёт

У 4539 пакетов была хотя бы одна версия от человеческого аккаунта. В 2864 из них, это 63 процента, первый публикатор-человек он же и последний. 2035 пакетов в какой-то момент получили второго публикатора-человека, по медиане через 14 месяцев после первого.

Из этих 2035 у 1292 первый автор всё ещё в списке мейнтейнеров. Среди всех 4539 первого автора нет в списке у 878 пакетов, это 19 процентов. Среди них `debug`, `commander` и `express`. Первым записанным публикатором у всех трёх был TJ Holowaychuk и сегодня его нет в списке ни у одного. `event-stream` тоже здесь, его единственный мейнтейнер теперь служебный аккаунт самого npm, `npm`.

## Кто исчезает

1798 пакетов, это 36 процентов, уже 2 года ничего не выпускали. Порог в 2 года я взял из исследования "What are Weak Links in the npm Supply Chain?" (ICSE SEIP 2022). Многие маленькие библиотеки просто дописаны. 104 из затихших помечены как deprecated, то есть кто-то явно попрощался.

Остался ли там кто-нибудь? Сначала у меня вышло 664 пакета, где ни один мейнтейнер-человек ничего не публиковал 2 года. Я уже собирался вписать это в текст и тут заметил, что проверял людей только внутри своих 5000, а они могут каждую неделю публиковать другие пакеты. Тогда я прогнал через поиск реестра, `/-/v1/search`, каждого из 1077 мейнтейнеров затихших пакетов. Для каждого взял самый свежий пакет, который он опубликовал где угодно. Это заняло 25 минут и сократило число до 369.

В 369 затихших пакетах, не помеченных deprecated, ни один мейнтейнер-человек 2 года ничего не публиковал нигде в реестре. У 316 из них мейнтейнер один. Медианный из этих пакетов на прошлой неделе скачали 13 миллионов раз, а `shebang-command` почти 300 миллионов раз. Миллер и соавторы на ICSE 2025 нашли, что из 28100 широко используемых пакетов npm с 2015 по 2020 год были брошены 14,6 процента. Они считали аккуратнее меня и по своему определению.

## Имя, которое исчезает

Я шёл считать брошенные пакеты, но самое большое изменение нашлось в другом месте. В 2024 году что-то выпустили 2836 пакетов из моего списка. У 672 из них последний релиз года пришёл от машинного аккаунта. Через trusted publishing не пришёл ни один, потому что его ещё не было. В 2026 году, по 8 октября, релизы были у 2542 пакетов. У 1704 из них последний релиз пришёл от машины. У 1429 из этих 1704 он прошёл через trusted publishing.

Trusted publishing стал общедоступным в npm 31 июля 2025 года, а первая такая версия в моём наборе от 25 июля. Он позволяет публиковать прямо из CI на GitHub или GitLab с токеном, который выдаётся на один запуск. В сентябре 2025 года червь Shai Hulud расползался через украденные токены npm. 9 декабря 2025 года npm отозвал все классические токены. Скачок после червя виден по месяцам. В сентябре 2025 года через trusted publishing выпускали 15 процентов пакетов с релизами, в октябре уже 33. Пик пришёлся на июнь 2026 года, когда так выпустили 941 пакет из 1387, то есть 68 процентов. В сентябре 2026 года доля была 58 процентов.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Столбцы по месяцам с июня 2025 по сентябрь 2026. Каждый столбец это доля пакетов из топ-4996, которые выпустили релиз в этом месяце и чей последний релиз месяца прошёл через trusted publishing: 2025-06 0%, 2025-07 1%, 2025-08 6%, 2025-09 15%, 2025-10 33%, 2025-11 32%, 2025-12 40%, 2026-01 48%, 2026-02 51%, 2026-03 52%, 2026-04 57%, 2026-05 56%, 2026-06 68%, 2026-07 62%, 2026-08 63%, 2026-09 58%. Отмечены выход в общий доступ 31 июля 2025, червь Shai Hulud в сентябре 2025 и отзыв классических токенов 9 декабря 2025.">
  <text x="10" y="12" class="f-label f-muted">доля пакетов с релизом за месяц, выпущенных через trusted publishing</text>
  <line x1="50" y1="232" x2="620" y2="232" class="f-line"/>
  <text x="42" y="66" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="42" y="232" text-anchor="end" class="f-label f-muted">0</text>
  <rect x="54.0" y="232.0" width="27.6" height="0.5" style="fill:var(--accent)"/>
  <text x="67.8" y="227.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="67.8" y="248" text-anchor="middle" class="f-label f-muted">июн</text>
  <rect x="89.6" y="230.3" width="27.6" height="1.7" style="fill:var(--accent)"/>
  <text x="103.4" y="225.3" text-anchor="middle" class="f-label f-muted">1</text>
  <text x="103.4" y="248" text-anchor="middle" class="f-label f-muted">июл</text>
  <rect x="125.3" y="221.8" width="27.6" height="10.2" style="fill:var(--accent)"/>
  <text x="139.1" y="216.8" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="139.1" y="248" text-anchor="middle" class="f-label f-muted">авг</text>
  <rect x="160.9" y="206.5" width="27.6" height="25.5" style="fill:var(--accent)"/>
  <text x="174.7" y="201.5" text-anchor="middle" class="f-label f-muted">15</text>
  <text x="174.7" y="248" text-anchor="middle" class="f-label f-muted">сен</text>
  <rect x="196.5" y="175.9" width="27.6" height="56.1" style="fill:var(--accent)"/>
  <text x="210.3" y="170.9" text-anchor="middle" class="f-label f-muted">33</text>
  <text x="210.3" y="248" text-anchor="middle" class="f-label f-muted">окт</text>
  <rect x="232.1" y="177.6" width="27.6" height="54.4" style="fill:var(--accent)"/>
  <text x="245.9" y="172.6" text-anchor="middle" class="f-label f-muted">32</text>
  <text x="245.9" y="248" text-anchor="middle" class="f-label f-muted">ноя</text>
  <rect x="267.8" y="164.0" width="27.6" height="68.0" style="fill:var(--accent)"/>
  <text x="281.6" y="159.0" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="281.6" y="248" text-anchor="middle" class="f-label f-muted">дек</text>
  <rect x="303.4" y="150.4" width="27.6" height="81.6" style="fill:var(--accent)"/>
  <text x="317.2" y="145.4" text-anchor="middle" class="f-label f-muted">48</text>
  <text x="317.2" y="248" text-anchor="middle" class="f-label f-muted">янв</text>
  <rect x="339.0" y="145.3" width="27.6" height="86.7" style="fill:var(--accent)"/>
  <text x="352.8" y="140.3" text-anchor="middle" class="f-label f-muted">51</text>
  <text x="352.8" y="248" text-anchor="middle" class="f-label f-muted">фев</text>
  <rect x="374.6" y="143.6" width="27.6" height="88.4" style="fill:var(--accent)"/>
  <text x="388.4" y="138.6" text-anchor="middle" class="f-label f-muted">52</text>
  <text x="388.4" y="248" text-anchor="middle" class="f-label f-muted">мар</text>
  <rect x="410.3" y="135.1" width="27.6" height="96.9" style="fill:var(--accent)"/>
  <text x="424.1" y="130.1" text-anchor="middle" class="f-label f-muted">57</text>
  <text x="424.1" y="248" text-anchor="middle" class="f-label f-muted">апр</text>
  <rect x="445.9" y="136.8" width="27.6" height="95.2" style="fill:var(--accent)"/>
  <text x="459.7" y="131.8" text-anchor="middle" class="f-label f-muted">56</text>
  <text x="459.7" y="248" text-anchor="middle" class="f-label f-muted">май</text>
  <rect x="481.5" y="116.4" width="27.6" height="115.6" style="fill:var(--accent)"/>
  <text x="495.3" y="111.4" text-anchor="middle" class="f-label f-muted">68</text>
  <text x="495.3" y="248" text-anchor="middle" class="f-label f-muted">июн</text>
  <rect x="517.1" y="126.6" width="27.6" height="105.4" style="fill:var(--accent)"/>
  <text x="530.9" y="121.6" text-anchor="middle" class="f-label f-muted">62</text>
  <text x="530.9" y="248" text-anchor="middle" class="f-label f-muted">июл</text>
  <rect x="552.8" y="124.9" width="27.6" height="107.1" style="fill:var(--accent)"/>
  <text x="566.6" y="119.9" text-anchor="middle" class="f-label f-muted">63</text>
  <text x="566.6" y="248" text-anchor="middle" class="f-label f-muted">авг</text>
  <rect x="588.4" y="133.4" width="27.6" height="98.6" style="fill:var(--accent)"/>
  <text x="602.2" y="128.4" text-anchor="middle" class="f-label f-muted">58</text>
  <text x="602.2" y="248" text-anchor="middle" class="f-label f-muted">сен</text>
  <text x="54" y="266" class="f-label f-ink">2025</text>
  <text x="303.4" y="266" class="f-label f-ink">2026</text>
  <line x1="121.3" y1="46" x2="121.3" y2="201.8" class="f-line" stroke-dasharray="3 3"/>
  <text x="117.3" y="42" text-anchor="end" class="f-label f-ink">доступен, 31 июля</text>
  <line x1="172.9" y1="46" x2="172.9" y2="186.5" class="f-line" stroke-dasharray="3 3"/>
  <text x="176.9" y="42" text-anchor="start" class="f-label f-ink">червь, сен</text>
  <line x1="274.4" y1="60" x2="274.4" y2="144.0" class="f-line" stroke-dasharray="3 3"/>
  <text x="278.4" y="56" text-anchor="start" class="f-label f-ink">токены отозваны, 9 дек</text>
</svg>
<figcaption>До июля 2025 года доля нулевая, к июню 2026 года она доходит до двух третей. Доля считается по пакетам. Пакет, выпустивший за месяц 50 тестовых версий, считается один раз.</figcaption>
</figure>

У 1452 пакетов самая свежая версия теперь опубликована так. У 1063 из них версию прямо перед переходом опубликовал человек. `semver` показывает весь путь в одной записи. Первые версии с записанным публикатором, с октября 2011 года, выпускал Isaac Schlueter. С 2023 года большую часть релизов выпускал аккаунт команды npm `npm-cli-ops`, а с октября 2025 года в поле публикатора стоит `GitHub Actions`.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Хронология всех версий semver с записанным публикатором, с 2011 по 2026, на трёх дорожках. С 2011 по 2023 версии стоят на дорожке человека: isaacs, потом othiym23, lukekarrys и gar. С 2023 по 2025 они переходят на дорожку аккаунта команды npm, npm-cli-ops. С октября 2025 они на дорожке trusted publishing, где публикатором записан GitHub Actions.">
  <text x="158" y="42" text-anchor="end" class="f-label f-ink">человек</text>
  <line x1="170" y1="54" x2="620" y2="54" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="86" text-anchor="end" class="f-label f-ink">аккаунт команды npm</text>
  <line x1="170" y1="98" x2="620" y2="98" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="130" text-anchor="end" class="f-label f-ink">trusted publishing</text>
  <line x1="170" y1="142" x2="620" y2="142" class="f-line" stroke-opacity="0.3"/>
  <line x1="191.3" y1="26" x2="191.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.5" y1="26" x2="194.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.7" y1="26" x2="194.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="197.3" y1="26" x2="197.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="209.4" y1="26" x2="209.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="219.3" y1="26" x2="219.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="223.7" y1="26" x2="223.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="226.7" y1="26" x2="226.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="229.1" y1="26" x2="229.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="230.8" y1="26" x2="230.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.0" y1="26" x2="239.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.2" y1="26" x2="239.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.7" y1="26" x2="239.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.6" y1="26" x2="240.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.8" y1="26" x2="240.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.0" y1="26" x2="242.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.6" y1="26" x2="242.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.2" y1="26" x2="249.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.4" y1="26" x2="249.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="264.1" y1="26" x2="264.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="267.3" y1="26" x2="267.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="269.9" y1="26" x2="269.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.0" y1="26" x2="270.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.1" y1="26" x2="270.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="273.9" y1="26" x2="273.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.3" y1="26" x2="275.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.4" y1="26" x2="275.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="276.6" y1="26" x2="276.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.5" y1="26" x2="281.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.8" y1="26" x2="281.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.7" y1="26" x2="285.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="286.7" y1="26" x2="286.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="292.0" y1="26" x2="292.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="293.9" y1="26" x2="293.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="294.1" y1="26" x2="294.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.2" y1="26" x2="297.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.4" y1="26" x2="297.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="307.2" y1="26" x2="307.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.0" y1="26" x2="324.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.4" y1="26" x2="324.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="325.6" y1="26" x2="325.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="368.0" y1="26" x2="368.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="384.5" y1="26" x2="384.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="388.6" y1="26" x2="388.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="405.9" y1="26" x2="405.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="406.3" y1="26" x2="406.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.4" y1="26" x2="408.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="410.6" y1="26" x2="410.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="412.2" y1="26" x2="412.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="421.7" y1="26" x2="421.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="425.4" y1="26" x2="425.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="426.3" y1="26" x2="426.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.8" y1="26" x2="430.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.0" y1="26" x2="431.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="457.5" y1="26" x2="457.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="486.7" y1="26" x2="486.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="487.2" y1="26" x2="487.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="500.6" y1="26" x2="500.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="515.1" y1="70" x2="515.1" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="515.7" y1="70" x2="515.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="517.6" y1="70" x2="517.6" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.2" y1="70" x2="520.2" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.7" y1="70" x2="520.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="521.9" y1="70" x2="521.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="538.3" y1="70" x2="538.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.4" y1="70" x2="545.4" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.5" y1="70" x2="545.5" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="550.8" y1="70" x2="550.8" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="565.9" y1="70" x2="565.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="566.3" y1="70" x2="566.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="573.9" y1="70" x2="573.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="585.3" y1="114" x2="585.3" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="594.6" y1="114" x2="594.6" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="601.7" y1="114" x2="601.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="602.7" y1="114" x2="602.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="603.8" y1="114" x2="603.8" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.9" y1="114" x2="604.9" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <text x="193.3" y="22" text-anchor="start" class="f-mono f-muted">isaacs</text>
  <text x="488.7" y="22" text-anchor="start" class="f-mono f-muted">lukekarrys, gar</text>
  <text x="517.1" y="66" text-anchor="start" class="f-mono f-muted">npm-cli-ops</text>
  <text x="579.3" y="110" text-anchor="end" class="f-mono f-muted">GitHub Actions</text>
  <text x="170.0" y="160" text-anchor="middle" class="f-label f-muted">2011</text>
  <text x="254.4" y="160" text-anchor="middle" class="f-label f-muted">2014</text>
  <text x="338.8" y="160" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="423.1" y="160" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="507.5" y="160" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="591.9" y="160" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Все версии semver с записанным публикатором, по штриху на версию. Имя на релизе перешло от человека к аккаунту команды, а потом к воркфлоу.</figcaption>
</figure>

Тогда я вернулся к своим 369. Поиск реестра говорит, кто опубликовал последнюю версию каждого пакета. У мейнтейнера, который перевёл свои пакеты на trusted publishing, это теперь `GitHub Actions`. Выходит, что молчащими в моём подсчёте выглядят как раз те, кто последовал совету после червя. Мейнтейнер `buffer` числится в списках пакетов, которые вчера вышли через GitHub Actions. Если считать человека присутствующим, когда хотя бы у одного пакета, где он в списке, за 2 года был релиз, число падает до 213. Это правило слишком щедрое. Быть в списке у активного пакета не то же самое, что над ним работать. Честный ответ где-то между 213 и 369. По одному реестру сузить его я не смог.

<figure class="fig">
<svg viewBox="0 0 640 264" role="img" aria-label="Горизонтальные полосы для 4996 самых скачиваемых пакетов npm: сейчас 1 мейнтейнер 2351, первый человек и есть последний 2864, первого автора нет в списке 878, нет релизов 2 года 1798, молчат: только свои релизы 369, молчат: любой пакет из списка 213. Две последние полосы (пакеты, где по двум разным правилам все мейнтейнеры-люди молчат 2 года) залиты акцентным цветом.">
  <text x="10" y="18" class="f-label f-muted">что реестр говорит о 4996 пакетах</text>
  <line x1="580" y1="28" x2="580" y2="254" class="f-line" stroke-dasharray="3 3"/>
  <text x="580" y="24" text-anchor="end" class="f-label f-muted">4996</text>
  <text x="252" y="51.8" text-anchor="end" class="f-label f-ink">сейчас 1 мейнтейнер</text>
  <rect x="262" y="36" width="149.6" height="22" class="f-box"/>
  <text x="419.6" y="51.8" class="f-label f-muted">2351</text>
  <text x="252" y="89.8" text-anchor="end" class="f-label f-ink">первый человек и есть последний</text>
  <rect x="262" y="74" width="182.3" height="22" class="f-box"/>
  <text x="452.3" y="89.8" class="f-label f-muted">2864</text>
  <text x="252" y="127.8" text-anchor="end" class="f-label f-ink">первого автора нет в списке</text>
  <rect x="262" y="112" width="55.9" height="22" class="f-box"/>
  <text x="325.9" y="127.8" class="f-label f-muted">878</text>
  <text x="252" y="165.8" text-anchor="end" class="f-label f-ink">нет релизов 2 года</text>
  <rect x="262" y="150" width="114.4" height="22" class="f-box"/>
  <text x="384.4" y="165.8" class="f-label f-muted">1798</text>
  <text x="252" y="203.8" text-anchor="end" class="f-label f-ink">молчат: только свои релизы</text>
  <rect x="262" y="188" width="23.5" height="22" style="fill:var(--accent)"/>
  <text x="293.5" y="203.8" class="f-label f-muted">369</text>
  <text x="252" y="241.8" text-anchor="end" class="f-label f-ink">молчат: любой пакет из списка</text>
  <rect x="262" y="226" width="13.6" height="22" style="fill:var(--accent)"/>
  <text x="283.6" y="241.8" class="f-label f-muted">213</text>
</svg>
<figcaption>Всего 4996 пакетов. Две нижние полосы это пакеты без релизов 2 года и не deprecated, где ни один мейнтейнер-человек за 2 года ничего не публиковал в реестре. Верхняя считает только релизы под именем самого мейнтейнера, нижняя любой релиз пакета, в списке мейнтейнеров которого он есть. Правда где-то между ними.</figcaption>
</figure>

Эта перемена мне нравится. Токен, который живёт один запуск, украсть намного труднее, чем токен, живущий годами. Но в поле публикатора теперь стоит имя воркфлоу. Человек в лучшем случае есть в необязательном поле `approver`. Я видел его у `express` 4.22.3. В остальных случаях остаётся только аттестация происхождения (provenance) со ссылкой на запуск в CI. Та же перемена сбила и мой собственный подсчёт брошенных пакетов.

Я не первый, кто считает trusted publishing. sxzz ведёт трекер OIDC и provenance по всему списку `npm-high-impact`, а это больше 17000 пакетов. Мои числа отвечают только на вопрос, чьё имя стоит на релизе.

## Чего я не проверял

- Авторство кода. Историю git я не открывал, так что у пакета с 1 публикатором может быть 40 авторов коммитов.
- Из 12197 записей о мейнтейнерах-людях 5415, это 44 процента, приходятся на тех, кто ни разу не публиковал этот пакет. Одни ревьюят и дают публиковать CI, за другими могут стоять забытые ключи. Реестр одних от других не отличает.
- Все числа получены одним проходом 8 октября 2026 года. Повтор в другой день немного сдвинет числа, потому что у пакетов продолжают выходить релизы.
