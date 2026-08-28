---
title: "Першасны ключ uuid: 172 секунды супраць 59"
description: "Шаснаццаць байтаў супраць васьмі гэта плюс 40 працэнтаў да індэкса. Парадак паступлення дадае зверху яшчэ 23 працэнты і робіць час устаўкі ў тры разы большым, калі індэкс перастае змяшчацца ў shared_buffers."
date: 2011-11-23
lang: be
translationKey: uuid-against-bigint
---

Усе спрэчкі пра uuid у ролі ключа, у якіх я ўдзельнічаў, былі пра шырыню ключа. Шаснаццаць байтаў супраць васьмі, індэкс расце, рушым далей. Я паставіў побач чатыры табліцы, каб паглядзець, ці ў гэтым уся плата.

```
create table t_seq    (id bigint primary key, payload text);
create table t_rand   (id uuid   primary key, payload text);
create table t_sorted (id uuid   primary key, payload text);
create table t_comb   (id uuid   primary key, payload text);
```

Па мільёне радкоў у кожнай, па сорак байтаў карыснай нагрузкі. `t_rand` і `t_sorted` атрымліваюць адзін і той самы мільён uuid: `t_rand` у парадку генерацыі, `t_sorted` адсартаванымі перад устаўкай. `t_comb` атрымлівае uuid, сабраныя з шасцібайтавага прэфікса мілісекунд, за якім ідуць дзесяць выпадковых байтаў.

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

У гэтым радку два розныя артыкулы выдаткаў. З 21 да 30 гэта шырыня ключа. Наступныя 7 МБ бяруцца з аднаго толькі парадку паступлення, бо ў `t_sorted` і `t_rand` ляжыць адзін і той самы мільён ключоў.

## Шырыня

Куча (heap) вырастае з 84459520 байтаў да 93093888 на тым самым мільёне радкоў. Гэта 8.6 байта на радок пры ключы, які шырэйшы на 8 байтаў. Розніца на картэж роўна 8, бо абедзве раскладкі дабіваюцца да адной і той самай мяжы. Астатняе гэта тое, што не ўлазіць у канец старонкі: радкоў bigint змяшчаецца 97, радкоў uuid 88, а хвост застаецца ў 20 байтаў супраць 72.

Індэкс ідзе з 21 да 30 МБ, што менш, чым суадносіны саміх ключоў. Запіс у лісце гэта ключ плюс васьмібайтавы загаловак індэкснага картэжа плюс чатырохбайтавы паказальнік на радок, гэта значыць 20 байтаў супраць 28. Дзве фіксаваныя часткі размываюць 16 да 8 у 28 да 20, а гэта 1.40. Змераныя ліставыя старонкі гэта 2733 супраць 3832, суадносіны 1.402.

Арыфметыка старонкі выходзіць туды ж. Старонка ў 8192 байты губляе 24 байты на загаловак старонкі і 16 на службовую вобласць btree, застаецца 8152. Запаўняецца гэта па змаўчанні на 90 працэнтаў. 367 запісаў bigint па 20 байтаў гэта 7340. 262 запісы uuid па 28 байтаў гэта 7336. Абодва лікі кладуцца на мяжу. Адзін слот у кожным лісце, акрамя самага правага, займае high key, верхні ключ старонкі, таму запісаў з данымі 366 і 261, што прадказвае 2733 старонкі і 3832. Роўна гэтыя два лікі pgstatindex і паказвае.

## Парадак

У абедзвюх табліцах адзін і той самы мільён ключоў, так што шырыня зафіксаваная і мяняецца толькі парадак паступлення.

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

Адсартаваная ўстаўка заўсёды трапляе на правы край дрэва. Старонка на краі запаўняецца да 90 працэнтаў, пасля чаго адкрываецца новая. Выпадковая ўстаўка трапляе ўсярэдзіну ўжо поўнай старонкі. Тая дзеліцца папалам, таму абедзве паловы стаяць на 50 працэнтах, пакуль іх не дапоўняць наступныя ўстаўкі. У сярэднім на мільёне ўставак гэта асядае на 73.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Ліставыя старонкі, запоўненыя на дзевяноста працэнтаў пры ўстаўцы па ўзрастанні, супраць паўпустых старонак пры выпадковай устаўцы">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">па ўзрастанні</text>
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
  <text x="320" y="140" class="f-label f-muted" text-anchor="middle">выпадковы парадак</text>
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
<figcaption>Адсартаваная ўстаўка заўсёды трапляе на правы край, дабівае старонку да дзевяноста працэнтаў і адкрывае наступную.<br>Выпадковая трапляе ўсярэдзіну поўнай старонкі, якая дзеліцца папалам. Змераная шчыльнасць 90.06 супраць 73.1, старонак 2733 супраць 4724.</figcaption>
</figure>

Фрагментацыя вырасла з нуля да 49.56. Гэта доля лістоў, у якіх правы сусед ляжыць у блоку з меншым нумарам. Палова лістоў больш не ляжыць на дыску па парадку, таму ўпарадкаванае сканаванне індэкса ходзіць па файле туды-сюды замест таго, каб чытаць яго наскрозь. 49.56 гэта яшчэ і амаль мяжа для гэтага ліку: цалкам перамяшаны індэкс упіраецца прыкладна ў 50.

## Перабудова вяртае месца

```
reindex index t_rand_pkey;
Time: 1143,292 ms

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       3832 |            90.03 |                  0
```

3832 старонкі, акурат столькі ж, колькі было ў адсартаванай табліцы. Лішнія сем мегабайтаў былі фрагментацыяй, пакінутай парадкам паступлення. Reindex прыбраў іх за 1.1 секунды на табліцы такога памеру.

## Дзесяць мільёнаў радкоў супраць 128 мегабайтаў кэша

На мільёне радкоў індэкс цалкам змяшчаецца ў `shared_buffers`, а гэта на маёй машыне 128 МБ. Медыяна трох прагонаў:

| ключ | час устаўкі |
|---|---|
| bigint па ўзрастанні | 4130 мс |
| uuid адсартаваны | 4472 мс |
| uuid з прэфіксам часу | 4466 мс |
| uuid у парадку паступлення | 5942 мс |

Далей я давёў аб'ём да дзесяці мільёнаў радкоў, дзе індэкс ужо не змяшчаецца. Прагнаў два краі дыяпазону:

```
-- 10M uuid random
INSERT 0 10000000
Time: 172414,407 ms

-- 10M uuid time prefix
INSERT 0 10000000
Time: 59225,842 ms
```

Разрыў выйшаў у 2.911 раза супраць 1.330 на мільёне радкоў. Гэта па адным прагоне на кожным краі. Паўтор пары даў 2.53, так што сумленна чытаць гэта як прыкладна ўтрая, а не як 2.911. Упарадкаваная ўстаўка працуе з адной ліставой старонкай, пакуль тая не запоўніцца. Выпадковая трапляе амаль куды заўгодна, таму рабочае мноства гэта ўвесь індэкс, а не адна старонка. Як толькі індэкс перастае змяшчацца ў памяці, кожны радок ператвараецца ў асобнае чытанне. З індэксамі тое самае: 397 МБ супраць 301 МБ, шчыльнасць запаўнення 68.4 супраць 90.04.

## Шэсць байтаў пад гадзіннік

Увесь фокус у прэфіксе. Дванаццаць шаснаццатковых лічбаў мілісекунднага часу, далей дваццаць такіх жа лічбаў з md5:

```
(lpad(to_hex(1322000000000 + g), 12, '0') || substr(md5(g::text || 'k'), 1, 20))::uuid
```

На мільёне радкоў ён супаў з адсартаванай табліцай старонка ў старонку: 3832 лісты, шчыльнасць 90.03, нулявая фрагментацыя. Шырынёй ён усё тыя ж шаснаццаць байтаў, так што індэкс выходзіць таго ж памеру, што і ў адсартаванай табліцы. Знікае менавіта фрагментацыя.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Шаснаццаць выпадковых байтаў супраць шасці байтаў мілісекунд перад дзесяццю выпадковымі">
  <defs>
    <marker id="kArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">16 выпадковых байтаў</text>
  <rect x="50" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="65" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="84" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="99" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="118" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="133" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="152" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="167" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="186" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="201" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="220" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="235" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="254" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="269" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="288" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="322" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="356" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="390" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="424" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="458" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="492" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="526" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="560" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="45" class="f-label f-muted" text-anchor="middle">вып</text>
  <text x="320" y="94" class="f-label f-muted" text-anchor="middle">6 байтаў мс + 10 выпадковых байтаў</text>
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
  <text x="269" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="288" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="322" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="356" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="390" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="424" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="458" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="492" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="526" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <rect x="560" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="123" class="f-label f-muted" text-anchor="middle">вып</text>
  <path d="M 50 152 L 244 152" class="f-line" marker-end="url(#kArrow)"/>
  <text x="255" y="156" class="f-label f-accent" text-anchor="start">сартуецца па часе стварэння</text>
</svg>
<figcaption>І там і там шаснаццаць байтаў. Прэфікс каштуе 48 бітаў выпадковасці і вяртае парадак устаўкі:<br>4724 ліставыя старонкі робяцца 3832, роўна столькі ж, колькі ва адсартаванай табліцы.</figcaption>
</figure>

Плата за гэта шэсць байтаў з шаснаццаці. У двух uuid, выдадзеных у адну і тую ж мілісекунду, цяпер восемдзесят выпадковых бітаў розніцы замест тых 128, якія md5 даваў у `t_rand`. У сапраўднага uuid чацвёртай версіі іх з самага пачатку 122, бо шэсць бітаў ідуць на версію і варыянт. Шасці байтаў мілісекунд яшчэ і хопіць прыкладна на дзевяць тысяч гадоў. Мяне гэта задавальняе. Другая плата ў тым, што ключ цяпер паведамляе кожнаму, у каго ён ёсць, калі быў створаны радок. Для ідэнтыфікатара рахунку гэта нармальна. На токен скідання пароля я б такое не паставіў.

## Чаго я не правяраў

Усё, што вышэй, гэта ўстаўкі ў чыстую табліцу. Чытанне я не чапаў. Не чапаў і тое, што адбываецца за месяцы сапраўднага трафіку, дзе ўстаўкі перамяшаныя з выдаленнямі і абнаўленнямі.

Яшчэ я не праганяў гэта на InnoDB, дзе першасны ключ і ёсць сама табліца, а не асобны індэкс. Там тое ж выпадковае паступленне мусіць біць па індэксе і па кучы адразу, так што я чакаю разрыву большага за 2.91.
