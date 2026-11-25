---
title: "PostgreSQL нашёл слово \"массив\" в 23 сообщениях из 89 и Lucene режет его так же"
description: "Я загрузил в PostgreSQL 9.4.1 сообщения 95 127 коммитов Linux и русские сообщения самого PostgreSQL, чтобы увидеть, где встроенный поиск перестаёт быть дешёвым или верным. Слово из 9652 коммитов обошлось в меньшее число обращений к страницам, чем слово из 3002. На 267 опечаток из 300 полнотекст не нашёл ничего. Русский стеммер разрывает 3 обычных существительных, а Lucene 4.10.4 дала те же основы на 16 354 словоформах."
date: 2015-03-28
lang: ru
translationKey: postgres-fulltext
tags: ["databases", "performance", "text"]
---

```
=# select plainto_tsquery('russian', 'массив');
 'масс'
=# select to_tsvector('russian', 'массива');
 'массив':1
```

Именительный падеж и родительный, а лексемы разные. Я загрузил в базу русский каталог сообщений самого PostgreSQL, 4172 штуки из `ru.po`. Потом поискал в нём массив. Слово в какой-нибудь форме есть в 89 сообщениях. Запрос нашёл 23.

Я часто повторяю совет начинать с полнотекста в базе, а Elasticsearch ставить, когда базы перестанет хватать. Но как выглядит это "перестанет хватать", я сказать не мог. Чисел у меня не было.

По частям всё известно. В документации, в 12.3.3, прямо написано, что ранжирование читает `tsvector` каждого совпавшего документа. Коротков и Бартунов на PGConf.EU 2012 показывали, как сортировать внутри GIN. Из этой работы в 9.4 вошли сжатые списки и fast scan, сортировки пока нет. Рашид Белайд в прошлом году писал, что поиска в Postgres вполне хватает. Мне хотелось увидеть границы на одном корпусе.

## На чём мерил

PostgreSQL 9.4.1, `shared_buffers` 512 МБ, `work_mem` 16 МБ, виртуальная машина с 2 ядрами. Корпус это 95 127 сообщений коммитов Linux от v3.12 до v4.0-rc5, без слияний и без строк вроде `Signed-off-by`. Текста там 34,6 МБ. Колонка `tsvector` занимает 38,0 МБ, больше самого текста, в среднем 26 лексем на сообщение. Индекс GIN занимает 19,8 МБ.

Скрипт загрузки передавал `psql` 5 команд пятью ключами `-c`. Он напечатал `VACUUM`, ошибок не было, а первый же запрос сообщил, что индекса нет. psql 9.4 выполняет только последний `-c`.

## Где платят за сортировку

Я взял 9 основ разной частоты и считал обращения к страницам через `EXPLAIN (ANALYZE, BUFFERS)`. До прогона записал, что границей считаю место, где первая десятка по `ts_rank` читает больше 10% таблицы. Вместе с TOAST в таблице 9205 страниц. Слову из 300 коммитов понадобилось уже 1022 обращения, а это 0,3% корпуса. Основе `use`, которая есть в 33 679 коммитах, понадобилось 15 104. Это больше, чем страниц во всей таблице, потому что к некоторым возвращаются много раз.

Я ждал, что это число растёт вместе с числом совпадений. А между двумя основами оно упало.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Обращения к страницам при выборке первых 10 по ts_rank для 5 слов, в порядке коммитов и после перемешивания. pid, коммитов 1000: 3173 в порядке коммитов, 3276 после перемешивания; pass, коммитов 3002: 3558 в порядке коммитов, 3815 после перемешивания; stage, коммитов 9652: 2409 в порядке коммитов, 6114 после перемешивания; remov, коммитов 18 353: 9535 в порядке коммитов, 10 535 после перемешивания; use, коммитов 33 679: 15 104 в порядке коммитов, 15 535 после перемешивания. Часть, которая приходится на TOAST, от перемешивания почти не меняется.">
  <line x1="600.0" y1="268" x2="600.0" y2="276" class="f-plain"/>
  <line x1="482.5" y1="268" x2="482.5" y2="276" class="f-plain"/>
  <line x1="365.0" y1="268" x2="365.0" y2="276" class="f-plain"/>
  <line x1="247.5" y1="268" x2="247.5" y2="276" class="f-plain"/>
  <line x1="130.0" y1="32" x2="130.0" y2="276" class="f-plain"/>
  <text x="120.0" y="52.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pid</text>
  <text x="120.0" y="67.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <rect x="130.0" y="40.0" width="25.2" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="155.2" y="40.0" width="68.0" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="229.2" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3173</text>
  <rect x="130.0" y="58.0" width="28.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="158.1" y="58.0" width="68.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="232.2" y="69.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3276</text>
  <text x="120.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pass</text>
  <text x="120.0" y="115.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3002</text>
  <rect x="130.0" y="88.0" width="68.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="198.1" y="88.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="240.5" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3558</text>
  <rect x="130.0" y="106.0" width="75.7" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="205.7" y="106.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="248.1" y="117.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3815</text>
  <text x="120.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">stage</text>
  <text x="120.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">9652</text>
  <rect x="130.0" y="136.0" width="60.5" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="190.5" y="136.0" width="10.3" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="206.8" y="147.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2409</text>
  <rect x="130.0" y="154.0" width="169.4" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="299.4" y="154.0" width="10.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="315.6" y="165.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">6114</text>
  <text x="120.0" y="196.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">remov</text>
  <text x="120.0" y="211.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">18 353</text>
  <rect x="130.0" y="184.0" width="193.6" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="323.6" y="184.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="416.1" y="195.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">9535</text>
  <rect x="130.0" y="202.0" width="223.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="353.0" y="202.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="445.5" y="213.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">10 535</text>
  <text x="120.0" y="244.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">use</text>
  <text x="120.0" y="259.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">33 679</text>
  <rect x="130.0" y="232.0" width="233.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="363.0" y="232.0" width="210.7" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="579.7" y="243.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15 104</text>
  <rect x="130.0" y="250.0" width="246.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="376.1" y="250.0" width="210.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="592.3" y="261.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15 535</text>
  <text x="130.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="247.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <text x="365.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8000</text>
  <text x="482.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12 000</text>
  <text x="600.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16 000</text>
  <text x="120.0" y="20.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">коммитов</text>
  <rect x="130.0" y="12.0" width="12.0" height="10.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <text x="148.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">индекс и куча</text>
  <rect x="290.0" y="12.0" width="12.0" height="10.0" style="fill:var(--accent);stroke:none"/>
  <text x="308.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">TOAST</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">обращений к страницам</text>
</svg>
<figcaption>Что читает первая десятка по ts_rank. Серая часть это индекс и куча, цветная это TOAST. Верхний столбик в паре для таблицы в порядке коммитов, нижний для тех же строк вперемешку.</figcaption>
</figure>

`pass` встречается в 3002 коммитах и стоит 3558 обращений. `stage` встречается в 9652 и стоит 2409. Это основа слова staging, с него начинаются 9070 таких заголовков. Патчи в staging идут длинными сериями, поэтому в таблице лежат рядом, а сообщения у них короткие, 18 лексем против 44 у `pass`. Я переложил таблицу в случайном порядке. У `stage` часть, приходящаяся на индекс и кучу, выросла с 2059 до 5766, а всего стало 6114. У `pass` только 3815.

Вторая часть цены это TOAST. У длинного сообщения длинный `tsvector`, он уезжает из строки и за каждый такой надо заплатить ещё примерно 3 обращения. Я сверился с `pg_statio_user_tables` и колонка про индекс TOAST не сошлась, она вдвое больше, чем допускает `EXPLAIN`. Представление соединяет таблицу со всеми её индексами и потом суммирует, так что эта колонка умножается на их число. У меня их 2. Я добавил третий и на том же запросе вместо 2964 стало 4446, а функция под представлением оба раза насчитала 1482.

По времени пока терпимо. Самый медленный поиск занял 42 мс, когда всё в памяти, на перемешанной таблице 46. `ILIKE '%deadlock%'` занял 451. Обращения станут важны, когда таблица в память не влезет.

Для поиска без сортировки я обещал меньше 100 страниц на любом слове. `stage` прочитал 281: под `LIMIT 10` планировщик выбрал последовательное чтение, а в начале таблицы совпадений почти не было. В перемешанной хватило 25.

## Редкое слово ничего не весит

`ts_rank` ничего не знает про коллекцию целиком. Я составил 50 случайных пар из редкой основы (от 10 до 30 коммитов) и частой (от 3000 до 10 000) и запросил одну ИЛИ другую. Редким словам досталось 67 мест из 500 в первых десятках. В 14 парах не досталось ни одного. Я ждал, что таких будет больше половины, так что по умолчанию всё мягче, чем я думал. С нормировкой 1, на логарифм длины документа, их уже 34 из 50.

## Опечаткам нужна своя таблица

Самое очевидное тут `subject % 'schedulr'` из pg_trgm. Вернулось 0 строк. Даже правильное `scheduler` вернуло 2, хотя полнотекст находит его в 159 заголовках, потому что похожесть считается со всем заголовком сразу.

Тогда я собрал через `ts_stat` отдельный словарь, 11 198 слов длиной от 5 до 14 букв, с триграммным индексом. Потом взял 300 слов, которые есть хотя бы в 50 коммитах. В каждом сделал одну случайную ошибку. На 267 из них полнотекст не нашёл ничего. Триграммы поставили нужное слово первым в 234 случаях, в первые 5 оно попало в 282. Я обещал 80% на первом месте, вышло 78%. Если отсортировать кандидатов по `levenshtein`, будет 244.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="По 75 опечаток каждого вида, сколько раз нужное слово стояло первым и сколько раз попало в первые 5. лишняя буква: 73 и 75; не та буква: 63 и 75; пропущенная буква: 61 и 75; буквы поменялись местами: 37 и 57.">
  <text x="160.0" y="29.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">лишняя буква</text>
  <rect x="170.0" y="14.0" width="418.5" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="588.5" y="14.0" width="11.5" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="29.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">73 / 75</text>
  <text x="160.0" y="63.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">не та буква</text>
  <rect x="170.0" y="48.0" width="361.2" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="531.2" y="48.0" width="68.8" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">63 / 75</text>
  <text x="160.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пропущенная</text>
  <rect x="170.0" y="82.0" width="349.7" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="519.7" y="82.0" width="80.3" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="97.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">61 / 75</text>
  <text x="160.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">перестановка</text>
  <rect x="170.0" y="116.0" width="212.1" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="382.1" y="116.0" width="114.7" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="131.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">37 / 57</text>
  <line x1="170" y1="146" x2="600" y2="146" class="f-plain"/>
  <text x="170.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="313.3" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <text x="456.7" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="600.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">75</text>
</svg>
<figcaption>pg_trgm по словарю из 11 198 слов, по 75 опечаток каждого вида. Цветом показано нужное слово на первом месте, серая часть это места со 2 по 5.</figcaption>
</figure>

Слабое место это переставленные буквы, 37 из 75. 7 коротких слов пропали совсем, например `trsut`, порог 0,3 для них не прошло ни одно слово словаря.

## Обратно к массиву

Для русской части я взял словарь OpenCorpora в январской сборке для pymorphy2. Оставил из каталога только слова с одной возможной леммой, тех частей речи, что в таблице. Вопрос такой: сколько вхождений других форм найдётся, если набрать словарную.

| | лемм | других форм в тексте | нашлось |
|---|---|---|---|
| существительные | 571 | 5754 | 91,4% |
| прилагательные | 279 | 1436 | 98,7% |
| глаголы | 404 | 1900 | 61,8% |
| все | 1254 | 9090 | 86,4% |

Ждал я 90%. Портят всё глаголы, а глаголы портит одна форма: 190 из 726 потерянных это "существует", в основном из "не существует". Существительные мне неприятнее, думаю, набирают чаще их. "Таблица" (243 из 243) и "индекс" (107 из 107) находятся целиком. А "массив" кончается как деепричастие, "запись" как возвратный глагол, "память" как инфинитив. Snowball режет по окончаниям и частей речи не знает.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Словарная форма и её лексема рядом с другой формой того же существительного. массив превращается в масс, массива в массив, поиск находит 23 из 89 сообщений; запись превращается в зап, записи в запис, поиск находит 42 из 104 сообщений; память превращается в памя, памяти в памят, поиск находит 8 из 46 сообщений.">
  <text x="14.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">что набрали</text>
  <text x="326.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">что стоит в тексте</text>
  <rect x="14" y="40" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массив</text>
  <line x1="126" y1="55" x2="156" y2="55" class="f-line"/>
  <path d="M 156 51 L 164 55 L 156 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="40" width="108" height="30" class="f-box"/>
  <text x="224.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">масс</text>
  <rect x="326" y="40" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массива</text>
  <line x1="438" y1="55" x2="468" y2="55" class="f-line"/>
  <path d="M 468 51 L 476 55 L 468 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="40" width="108" height="30" class="f-box"/>
  <text x="536.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">массив</text>
  <text x="670.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">23/89</text>
  <rect x="14" y="84" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">запись</text>
  <line x1="126" y1="99" x2="156" y2="99" class="f-line"/>
  <path d="M 156 95 L 164 99 L 156 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="84" width="108" height="30" class="f-box"/>
  <text x="224.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">зап</text>
  <rect x="326" y="84" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">записи</text>
  <line x1="438" y1="99" x2="468" y2="99" class="f-line"/>
  <path d="M 468 95 L 476 99 L 468 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="84" width="108" height="30" class="f-box"/>
  <text x="536.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">запис</text>
  <text x="670.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">42/104</text>
  <rect x="14" y="128" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">память</text>
  <line x1="126" y1="143" x2="156" y2="143" class="f-line"/>
  <path d="M 156 139 L 164 143 L 156 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="128" width="108" height="30" class="f-box"/>
  <text x="224.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памя</text>
  <rect x="326" y="128" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">памяти</text>
  <line x1="438" y1="143" x2="468" y2="143" class="f-line"/>
  <path d="M 468 139 L 476 143 L 468 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="128" width="108" height="30" class="f-box"/>
  <text x="536.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памят</text>
  <text x="670.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">8/46</text>
  <text x="670.0" y="184.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">нашлось сообщений</text>
</svg>
<figcaption>3 существительных из русского каталога. Словарная форма и остальные формы получают разные лексемы, поэтому поиск по одной не видит другую.</figcaption>
</figure>

Обычно это обходят запросом по префиксу. `массив:*` находит все 89, `память:*` все 46. `запись:*` превращается в `зап:*` и возвращает 319 сообщений на 104 настоящих.

Потом я запустил Lucene 4.10.4, на которой стоит вышедший на этой неделе Elasticsearch 1.5.0. Её `RussianAnalyzer`, тоже Snowball, дал ту же основу, что и PostgreSQL, на всех 16 354 словоформах, расхождений 0. Лёгкий стеммер оттуда же чинит массив и поднимает существительные до 95,2%, но глаголы у него падают до 4,8%, а всё вместе до 76,8%. Так что от русского анализатора Elasticsearch я жду, что он разорвёт те же 3 существительных.

## Чего я не проверял

Сам Elasticsearch я не запускал, только его стеммер. Не пробовал словари ispell в PostgreSQL, а их стоит ставить перед Snowball и для русского это мой следующий шаг. Цену обновлений тоже пропустил. Холодный кеш видел один раз и случайно: после перезапуска PostgreSQL первый `stage` на перемешанной таблице занял 1328 мс и прочитал 5893 страницы, повторять я не стал. Из 21 781 вхождения русских слов 3818 могли относиться к нескольким леммам и в счёт не попали, а опечатки у меня случайные, не человеческие. Конфигураций в 9.4 всего 16 и белорусской среди них нет.
