---
title: "Деньги в double: 4.35 * 100 выходит 434"
description: "Четыре цены из ста точны в double. На миллионе сумм копейка терялась только на точной половине: 3656 таких при ставке 18 процентов, ноль при 20."
date: 2011-11-16
lang: ru
translationKey: money-in-a-double
---

У меня была цена 4.35. Её надо было перевести в копейки:

```
$ cat Price.java
public class Price {
    public static void main(String[] args) {
        System.out.println(4.35 * 100);
        System.out.println((long) (4.35 * 100));
    }
}

$ javac Price.java && java Price
434.99999999999994
434
```

Приведение к целому отбрасывает хвост. Копейки нет. Совет не хранить деньги в `double` я принял, ни разу не померив, во что он обходится, поэтому померил.

`new BigDecimal(double)` печатает точное десятичное значение битов, ничего не округляя на выходе. Другого инструмента для разбора тут и не нужно:

```
4.35 -> 4.3499999999999996447286321199499070644378662109375
0.1  -> 0.1000000000000000055511151231257827021181583404541015625
0.2  -> 0.200000000000000011102230246251565404236316680908203125
0.3  -> 0.299999999999999988897769753748434595763683319091796875
0.5  -> 0.5
```

В double 4.35 лежит чуть ниже, чем 4.35. Умножение на сто оставляет его чуть ниже 435, а приведение к `long` отбрасывает всё после точки. `Math.round` даст здесь 435. Но он не спасает, когда неточна сама ставка.

## Четыре точные цены из ста

Я прогнал через то же сравнение каждое значение от 0.01 до 100.00 с двумя знаками после точки, сравнивая double с десятичным числом, которое он представляет.

```
for (long c = 1; c <= 10000; c++) {
    double v = c / 100.0;
    if (new BigDecimal(v).compareTo(BigDecimal.valueOf(c, 2)) == 0) exactCount++;
}
```

```
exact: 400 of 10000
first hundred: 0.25 0.50 0.75 1.00
```

Четыре процента. Число double складывается из степеней двойки, поэтому сотая доля укладывается в него только тогда, когда сокращается до четвертей. Любая другая цена становится приближением уже при разборе строки.

<figure class="fig">
<svg viewBox="0 0 640 398" role="img" aria-label="Сто цен с двумя знаками от 0.01 до 1.00, четыре из них точны в double">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">цены от 0.01 до 1.00</text>
  <rect x="143" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="34" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="70" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="106" width="30" height="30" rx="4" class="f-box"/>
  <text x="302" y="125" class="f-label f-accent" text-anchor="middle">.25</text>
  <rect x="323" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="106" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="142" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="178" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="178" width="30" height="30" rx="4" class="f-box"/>
  <text x="482" y="197" class="f-label f-accent" text-anchor="middle">.50</text>
  <rect x="143" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="214" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="250" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="286" width="30" height="30" rx="4" class="f-box"/>
  <text x="302" y="305" class="f-label f-accent" text-anchor="middle">.75</text>
  <rect x="323" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="286" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="322" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="143" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="179" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="215" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="251" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="287" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="323" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="359" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="395" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="431" y="358" width="30" height="30" rx="4" class="f-plain"/>
  <rect x="467" y="358" width="30" height="30" rx="4" class="f-box"/>
  <text x="482" y="377" class="f-label f-accent" text-anchor="middle">.00</text>
</svg>
<figcaption>Каждая цена с двумя знаками от 0.01 до 1.00. Четыре из ста хранятся точно.<br>Остальные девяносто шесть уже приближения, до всякой арифметики.</figcaption>
</figure>

## Складываем 0.10 десять раз

Сначала хрестоматийный пример:

```
double acc = 0.0;
for (int i = 0; i < 10; i++) acc += 0.10;
```

```
sum of ten 0.10 = 0.9999999999999999
acc == 1.0 ? false
exact         = 0.99999999999999988897769753748434595763683319091796875
```

Я ждал, что дорого обойдётся именно накопление, поэтому запустил миллион сложений по 0.01 и рядом посчитал то же самое на `BigDecimal`:

```
after 1000000 additions, double = 10000.000000171856
exact                           = 10000.00
difference in rubles            = 1.71856299857608973979949951171875E-7
```

Потом я округлял сумму в double до копеек на каждом из миллиона шагов и сверял с точной суммой. Расхождений не было. Ни одного за миллион шагов. Дрейф действительно есть, на седьмом знаке. Округление до второго съедает его целиком.

## Копейка теряется ровно на половине

Берём российскую ставку НДС 18 процентов и считаем налог двумя способами для каждой суммы от 0.01 до 10000.00:

```
long viaDouble = Math.round(cents / 100.0 * 0.18 * 100.0);

long exact = BigDecimal.valueOf(cents, 2)
        .multiply(new BigDecimal("0.18"))
        .setScale(2, RoundingMode.HALF_UP)
        .movePointRight(2).longValueExact();
```

```
18%: mismatches = 3656 of 1000000, first: 1.25(exact 23 vs 22) 5.75(exact 104 vs 103)
6.75(exact 122 vs 121) 10.75(exact 194 vs 193) 11.75(exact 212 vs 211)
```

На самом маленьком случае видно всю механику:

```
1.25 as a double   1.25
0.18 as a double   0.179999999999999993338661852249060757458209991455078125
product            0.22499999999999997779553950749686919152736663818359375
times 100          22.499999999999996447286321199499070644378662109375
Math.round         22
```

1.25 входит в те самые четыреста точных цен, а 0.18 хранится ниже своего десятичного значения. Точное произведение равно 0.225. Оно лежит ровно между двумя копейками, поэтому HALF_UP поднимает его до 0.23. Double оказывается на 3.55e-15 ниже середины и округляется вниз, к 0.22.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Восемнадцать процентов от 1.25 попадают ровно на середину между 22 и 23 копейками">
  <defs>
    <marker id="mArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <path d="M 96 96 L 544 96" class="f-line"/>
  <path d="M 96 87 L 96 105" class="f-line"/>
  <path d="M 544 87 L 544 105" class="f-line"/>
  <path d="M 320 90 L 320 102" class="f-line" stroke-dasharray="2 2"/>
  <text x="96" y="122" class="f-label f-muted" text-anchor="middle">22 копейки</text>
  <text x="320" y="122" class="f-label f-muted" text-anchor="middle">середина</text>
  <text x="544" y="122" class="f-label f-muted" text-anchor="middle">23 копейки</text>
  <circle cx="320" cy="96" r="5" class="f-accent"/>
  <text x="320" y="78" class="f-mono f-accent" text-anchor="middle">точно 0.225</text>
  <path d="M 328 66 L 538 66" class="f-line" marker-end="url(#mArrow)"/>
  <text x="540" y="58" class="f-label f-muted" text-anchor="end">HALF_UP</text>
  <circle cx="246" cy="96" r="5" class="f-ink"/>
  <text x="246" y="144" class="f-mono f-ink" text-anchor="middle">double 22.499999999999996</text>
  <path d="M 238 158 L 102 158" class="f-line" marker-end="url(#mArrow)"/>
  <text x="100" y="174" class="f-label f-muted" text-anchor="start">Math.round</text>
</svg>
<figcaption>Точное произведение стоит ровно на середине. HALF_UP отправляет его к 23.<br>Double оказывается ниже. Math.round отправляет его к 22. Разрыв нарисован куда шире, чем 3.55e-15.</figcaption>
</figure>

Я повторил прогон на шести ставках, считая расхождения отдельно в зависимости от того, попало ли точное произведение на половину:

| ставка | половинных случаев | ошибок на половине | ошибок вне половин |
|---|---|---|---|
| 3% | 10000 | 2030 | 0 |
| 5% | 50000 | 818 | 0 |
| 7% | 10000 | 0 | 0 |
| 18% | 20000 | 3656 | 0 |
| 20% | 0 | 0 | 0 |
| 25% | 250000 | 16405 | 0 |

Неожиданной оказалась последняя колонка. Шесть ставок, по миллиону сумм на каждую. Этот счётчик так и не сдвинулся с нуля.

У ставки 20 процентов половин нет вовсе. Налог в копейках это цена в копейках, умноженная на два и делённая на десять. Чётный числитель никогда не даёт в остатке пять. Это чистая арифметика. Она держится за пределами прогона. У семи процентов половины есть. Их десять тысяч на миллион. Ни одной ошибки. Я расширил тот прогон до десяти миллионов сумм, чтобы убедиться. Сто тысяч половин, всё так же ноль.

Мне хотелось вывести правило из того, в какую сторону хранится каждая ставка. 0.05, 0.07 и 0.20 лежат выше своего десятичного значения, 0.03 и 0.18 ниже, 0.25 точна. Если отсортировать по доле потерянных половин, почти сходится. Больше всех теряют те, что хранятся ниже: 20.3 половины из ста на трёх процентах и 18.3 на восемнадцати. 0.25 хранится точно и теряет 6.6. Дальше 0.05 лежит выше и всё равно теряет 1.6, хотя по одному направлению должен быть ноль. Цена успевает пройти через `cents / 100.0` до того, как ставка её касается, так что ставка это только половина происходящего. Правила у меня нет.

## У BigDecimal свои острые углы

Смена типа сама по себе проблему не убирает:

```
new BigDecimal(0.1)     = 0.1000000000000000055511151231257827021181583404541015625
BigDecimal.valueOf(0.1) = 0.1
new BigDecimal("0.1")   = 0.1
```

Конструктор, который принимает `double`, переносит ошибку внутрь как есть. `valueOf` идёт через `Double.toString` и получает короткую запись. Строковый конструктор double не видит вообще.

```
1.0 equals 1.00    = false
1.0 compareTo 1.00 = 0
hash 1.0  = 311
hash 1.00 = 3102
```

Масштаб участвует в equals, поэтому `HashSet` держит 1.0 и 1.00 как две разные цены. Эти два хеша то, что делает реализация, а не то, что обещает javadoc. А деление вообще отказывается угадывать:

```
1/3 -> ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```

Мне нравится, что оно бросает исключение. `double` вернул бы 0.3333333333333333 и позволил тащить это дальше.

## Целые копейки в long справились не хуже

Тот же налог, тот же миллион сумм, но в целых копейках и с округлением, написанным руками:

```
long ints = (cents * 18 + 50) / 100;
```

```
(cents*18 + 50)/100 vs BigDecimal HALF_UP: mismatches=0
```

Ноль расхождений против `setScale(2, HALF_UP)` на каждой из них. В `long` помещается 9223372036854775807 копеек. Даже `double` считает целые копейки точно до 9007199254740992 штук. Это девяносто триллионов рублей, так что размер числа никогда и не был проблемой. Плата в другом: правило округления теперь живёт в моём коде и держать его должен я.

## Чего я не проверял

HALF_EVEN уменьшает эффект примерно вдвое, но не убирает. Через `Math.rint` тот же прогон на 18 процентах даёт 1830 ошибок на миллион. Половина от 3656 это 1828, примерно столько я и жду, когда половина серединных случаев и так округлялась вниз. Оставшиеся две я не разбирал.

Открытым осталось вот что: валюты с тремя знаками после точки. Разбиение одной суммы по нескольким строкам счёта так, чтобы части складывались обратно в целое. И JDBC-драйвер с колонкой типа `NUMERIC`, куда я пока не заглядывал.
