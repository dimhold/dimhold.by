---
title: "Первичный ключ uuid: 172 секунды против 59"
description: "Шестнадцать байт против восьми это плюс 40 процентов к индексу. Порядок поступления добавляет сверху ещё 23 процента и трёхкратное время вставки, когда индекс перестаёт помещаться в shared_buffers."
date: 2011-11-23
lang: ru
translationKey: uuid-against-bigint
tags: ["databases", "performance"]
---

Все споры про uuid в качестве ключа, в которых я участвовал, упирались в ширину ключа. Шестнадцать байт против восьми, индекс растёт, поехали дальше. Я поставил рядом четыре таблицы, чтобы посмотреть, вся ли это плата.

```
create table t_seq    (id bigint primary key, payload text);
create table t_rand   (id uuid   primary key, payload text);
create table t_sorted (id uuid   primary key, payload text);
create table t_comb   (id uuid   primary key, payload text);
```

По миллиону строк в каждой, по сорок байт полезной нагрузки. `t_rand` и `t_sorted` получают один и тот же миллион uuid: `t_rand` в порядке генерации, `t_sorted` отсортированными перед вставкой. `t_comb` получает uuid, собранные из шестибайтового префикса миллисекунд, за которым идут десять случайных байт.

```
select pg_size_pretty(pg_relation_size('t_seq'))         as seq_heap,
       pg_size_pretty(pg_relation_size('t_rand'))        as uuid_heap,
       pg_size_pretty(pg_relation_size('t_seq_pkey'))    as seq_index,
       pg_size_pretty(pg_relation_size('t_sorted_pkey')) as uuid_sorted_index,
       pg_size_pretty(pg_relation_size('t_rand_pkey'))   as uuid_random_index;

 seq_heap | uuid_heap | seq_index | uuid_sorted_index | uuid_random_index
----------+-----------+-----------+-------------------+-------------------
 81 MB    | 89 MB     | 21 MB     | 30 MB             | 37 MB
```

В этой строке две разные статьи расхода. С 21 до 30 это ширина ключа. Следующие 7 МБ берутся из одного только порядка поступления, потому что в `t_sorted` и `t_rand` лежит один и тот же миллион ключей.

## Ширина

Куча (heap) вырастает с 84459520 байт до 93093888 на том же миллионе строк. Это 8.6 байта на строку при ключе, который шире на 8 байт. Разница на кортеж ровно 8, потому что обе раскладки добиваются до одной и той же границы. Остальное это то, что не влезает в конец страницы: строк bigint помещается 97, строк uuid 88, а хвост остаётся в 20 байт против 72.

Индекс идёт с 21 до 30 МБ, что меньше, чем отношение самих ключей. Запись в листе это ключ плюс восьмибайтовый заголовок индексного кортежа плюс четырёхбайтовый указатель на строку, то есть 20 байт против 28. Две фиксированные части размывают 16 к 8 до 28 к 20, а это 1.40. Измеренные листовые страницы это 2733 против 3832, отношение 1.402.

Арифметика страницы выходит туда же. Страница в 8192 байта теряет 24 байта на заголовок страницы и 16 на служебную область btree, остаётся 8152. Заполняется это по умолчанию на 90 процентов. 367 записей bigint по 20 байт это 7340. 262 записи uuid по 28 байт это 7336. Оба числа ложатся на границу. Один слот в каждом листе, кроме самого правого, занимает high key, верхний ключ страницы, поэтому записей с данными 366 и 261, что предсказывает 2733 страницы и 3832. Ровно эти два числа и показывает pgstatindex.

## Порядок

В обеих таблицах один и тот же миллион ключей, так что ширина зафиксирована и меняется только порядок поступления.

```
select leaf_pages, avg_leaf_density, leaf_fragmentation from pgstatindex('t_sorted_pkey');

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       3832 |            90.03 |                  0

select leaf_pages, avg_leaf_density, leaf_fragmentation from pgstatindex('t_rand_pkey');

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       4724 |             73.1 |              49.56
```

Отсортированная вставка всегда попадает на правый край дерева. Страница на краю заполняется до 90 процентов, после чего открывается новая. Случайная вставка попадает внутрь уже полной страницы. Та делится пополам, поэтому обе половины стоят на 50 процентах, пока их не дополнят следующие поступления. В среднем на миллионе вставок это оседает на 73.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Листовые страницы, заполненные на девяносто процентов при вставке по возрастанию, против полупустых страниц при случайной вставке">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">по возрастанию</text>
  <rect x="109" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="109" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="163" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="163" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="217" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="217" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="271" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="271" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="325" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="325" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="379" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="379" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="433" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="433" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="487" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="487" y="63" width="44" height="19" rx="3" class="f-box"/>
  <text x="320" y="112" class="f-label f-muted" text-anchor="middle">90.06</text>
  <text x="320" y="140" class="f-label f-muted" text-anchor="middle">случайный порядок</text>
  <rect x="109" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="109" y="178" width="44" height="28" rx="3" class="f-box"/>
  <rect x="163" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="163" y="156" width="44" height="50" rx="3" class="f-box"/>
  <rect x="217" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="217" y="177" width="44" height="29" rx="3" class="f-box"/>
  <rect x="271" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="271" y="157" width="44" height="49" rx="3" class="f-box"/>
  <rect x="325" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="325" y="178" width="44" height="28" rx="3" class="f-box"/>
  <rect x="379" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="379" y="156" width="44" height="50" rx="3" class="f-box"/>
  <rect x="433" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="433" y="175" width="44" height="31" rx="3" class="f-box"/>
  <rect x="487" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="487" y="178" width="44" height="28" rx="3" class="f-box"/>
  <text x="320" y="212" class="f-label f-muted" text-anchor="middle">73.1</text>
</svg>
<figcaption>Отсортированная вставка всегда попадает на правый край, добивает страницу до девяноста процентов и открывает следующую.<br>Случайная попадает внутрь полной страницы, которая делится пополам. Измеренная плотность 90.06 против 73.1, страниц 2733 против 4724.</figcaption>
</figure>

Фрагментация выросла с нуля до 49.56. Это доля листов, у которых правый сосед лежит в блоке с меньшим номером. Половина листов больше не лежит на диске по порядку, поэтому упорядоченное сканирование индекса ходит по файлу туда-сюда вместо того, чтобы читать его насквозь. 49.56 это ещё и почти предел для этого числа: полностью перемешанный индекс упирается примерно в 50.

## Перестройка возвращает место

```
reindex index t_rand_pkey;
Time: 1143,292 ms

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       3832 |            90.03 |                  0
```

3832 страницы, ровно столько же, сколько было у отсортированной таблицы. Лишние семь мегабайт были фрагментацией, оставленной порядком поступления. Reindex убрал их за 1.1 секунды на таблице такого размера.

## Десять миллионов строк против 128 мегабайт кэша

На миллионе строк индекс целиком помещается в `shared_buffers`, а это на моей машине 128 МБ. Медиана трёх прогонов:

| ключ | время вставки |
|---|---|
| bigint по возрастанию | 4130 мс |
| uuid отсортированный | 4472 мс |
| uuid с префиксом времени | 4466 мс |
| uuid в порядке поступления | 5942 мс |

Дальше я довёл объём до десяти миллионов строк, где индекс уже не помещается. Прогнал два края диапазона:

```
-- 10M uuid random
INSERT 0 10000000
Time: 172414,407 ms

-- 10M uuid time prefix
INSERT 0 10000000
Time: 59225,842 ms
```

Разрыв вышел в 2.911 раза против 1.330 на миллионе строк. Это по одному прогону на каждом краю. Повтор пары дал 2.53, так что честно читать это как примерно втрое, а не как 2.911. Упорядоченная вставка работает с одной листовой страницей, пока та не заполнится. Случайная попадает почти куда угодно, поэтому рабочее множество это весь индекс, а не одна страница. Как только индекс перестаёт помещаться в память, каждая строка превращается в отдельное чтение. С индексами то же самое: 397 МБ против 301 МБ, плотность заполнения 68.4 против 90.04.

## Шесть байт под часы

Весь фокус в префиксе. Двенадцать шестнадцатеричных цифр миллисекундного времени, дальше двадцать таких же цифр из md5:

```
(lpad(to_hex(1322000000000 + g), 12, '0') || substr(md5(g::text || 'k'), 1, 20))::uuid
```

На миллионе строк он совпал с отсортированной таблицей страница в страницу: 3832 листа, плотность 90.03, нулевая фрагментация. Шириной он всё те же шестнадцать байт, так что индекс выходит того же размера, что и у отсортированной таблицы. Уходит именно фрагментация.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Шестнадцать случайных байт против шести байт миллисекунд перед десятью случайными">
  <defs>
    <marker id="kArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">16 случайных байт</text>
  <rect x="50" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="65" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="84" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="99" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="118" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="133" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="152" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="167" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="186" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="201" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="220" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="235" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="254" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="269" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="288" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="322" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="356" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="390" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="424" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="458" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="492" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="526" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="560" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="45" class="f-label f-muted" text-anchor="middle">сл</text>
  <text x="320" y="94" class="f-label f-muted" text-anchor="middle">6 байт мс + 10 случайных байт</text>
  <rect x="50" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="65" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="84" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="99" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="118" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="133" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="152" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="167" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="186" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="201" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="220" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="235" y="123" class="f-label f-accent" text-anchor="middle">мс</text>
  <rect x="254" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="269" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="288" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="322" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="356" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="390" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="424" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="458" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="492" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="526" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <rect x="560" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="123" class="f-label f-muted" text-anchor="middle">сл</text>
  <path d="M 50 152 L 244 152" class="f-line" marker-end="url(#kArrow)"/>
  <text x="255" y="156" class="f-label f-accent" text-anchor="start">сортируется по времени создания</text>
</svg>
<figcaption>И там и там шестнадцать байт. Префикс стоит 48 бит случайности и возвращает порядок вставки:<br>4724 листовые страницы превращаются в 3832, ровно столько же, сколько у отсортированной таблицы.</figcaption>
</figure>

Плата за это шесть байт из шестнадцати. У двух uuid, выданных в одну и ту же миллисекунду, теперь восемьдесят случайных бит разницы вместо тех 128, которые md5 давал в `t_rand`. У настоящего uuid четвёртой версии их с самого начала 122, потому что шесть бит уходят на версию и вариант. Шести байт миллисекунд ещё и хватит примерно на девять тысяч лет. Меня это устраивает. Вторая плата в том, что ключ теперь сообщает любому, у кого он есть, когда была создана строка. Для идентификатора инвойса это нормально. На токен сброса пароля я бы такое не поставил.

## Чего я не проверял

Всё, что выше, это вставки в чистую таблицу. Чтение я не трогал. Не трогал и то, что происходит за месяцы реального трафика, где вставки перемешаны с удалениями и обновлениями.

Ещё я не прогонял это на InnoDB, где первичный ключ и есть сама таблица, а не отдельный индекс. Там то же случайное поступление должно бить по индексу и по куче сразу, так что я жду разрыва больше 2.91.
