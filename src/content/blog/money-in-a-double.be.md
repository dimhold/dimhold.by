---
title: "Грошы ў double: 4.35 * 100 выходзіць 434"
description: "Чатыры цаны са ста дакладныя ў double. На мільёне сум капейка гублялася толькі на дакладнай палове: 3656 такіх пры стаўцы 18 працэнтаў, нуль пры 20."
date: 2011-11-16
lang: be
translationKey: money-in-a-double
---

У мяне была цана 4.35. Яе трэба было перавесці ў капейкі:

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

Прывядзенне да цэлага адкідае хвост. Капейкі няма. Параду не захоўваць грошы ў `double` я прыняў, ні разу не змераўшы, чаго яна каштуе, таму змераў.

`new BigDecimal(double)` друкуе дакладнае дзесятковае значэнне бітаў, нічога не акругляючы на выхадзе. Іншага інструмента для разбору тут і не трэба:

```
4.35 -> 4.3499999999999996447286321199499070644378662109375
0.1  -> 0.1000000000000000055511151231257827021181583404541015625
0.2  -> 0.200000000000000011102230246251565404236316680908203125
0.3  -> 0.299999999999999988897769753748434595763683319091796875
0.5  -> 0.5
```

У double 4.35 ляжыць крыху ніжэй за 4.35. Множанне на сто пакідае яго крыху ніжэй за 435, а прывядзенне да `long` адсякае ўсё пасля кропкі. `Math.round` дасць тут 435. Але ён не ратуе, калі недакладная сама стаўка.

## Чатыры дакладныя цаны са ста

Я прагнаў праз тое ж параўнанне кожнае значэнне з двума знакамі ад 0.01 да 100.00: параўноўваючы double з дзесятковым лікам, які ён абазначае.

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

Чатыры працэнты. Лік double складаецца са ступеняў двойкі, таму сотая частка ўкладваецца ў яго толькі тады, калі скарачаецца да чвэрцяў. Усякая іншая цана робіцца набліжэннем ужо пры разборы радка.

<figure class="fig">
<svg viewBox="0 0 640 398" role="img" aria-label="Сто цэн з двума знакамі ад 0.01 да 1.00, чатыры з іх дакладныя ў double">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">цэны ад 0.01 да 1.00</text>
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
<figcaption>Кожная цана з двума знакамі ад 0.01 да 1.00. Чатыры са ста захоўваюцца дакладна.<br>Астатнія дзевяноста шэсць ужо набліжэнні, да ўсялякай арыфметыкі.</figcaption>
</figure>

## Складаем 0.10 дзесяць разоў

Спачатку хрэстаматыйны прыклад:

```
double acc = 0.0;
for (int i = 0; i < 10; i++) acc += 0.10;
```

```
sum of ten 0.10 = 0.9999999999999999
acc == 1.0 ? false
exact         = 0.99999999999999988897769753748434595763683319091796875
```

Я чакаў, што дорага абыдзецца менавіта назапашванне, таму запусціў мільён складанняў па 0.01 і побач палічыў тое самае на `BigDecimal`:

```
after 1000000 additions, double = 10000.000000171856
exact                           = 10000.00
difference in rubles            = 1.71856299857608973979949951171875E-7
```

Потым я акругляў суму ў double да капеек на кожным з мільёна крокаў і звяраў з дакладнай сумай. Разыходжанняў не было. Ніводнага за мільён крокаў. Дрэйф сапраўды ёсць, на сёмым знаку. Акругленне да другога з'ядае яго цалкам.

## Капейка знікае на дакладнай палове

Бяром расійскую стаўку ПДВ у 18 працэнтаў і лічым падатак двума спосабамі для кожнай сумы ад 0.01 да 10000.00:

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

На самым маленькім выпадку відаць усю механіку:

```
1.25 as a double   1.25
0.18 as a double   0.179999999999999993338661852249060757458209991455078125
product            0.22499999999999997779553950749686919152736663818359375
times 100          22.499999999999996447286321199499070644378662109375
Math.round         22
```

1.25 уваходзіць у тыя самыя чатырыста дакладных цэн, а 0.18 захоўваецца ніжэй за сваё дзесятковае значэнне. Дакладны здабытак роўны 0.225. Ён ляжыць роўна паміж дзвюма капейкамі, таму HALF_UP падымае яго да 0.23. Double аказваецца на 3.55e-15 ніжэй за сярэдзіну і акругляецца ўніз, да 0.22.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Васямнаццаць працэнтаў ад 1.25 трапляюць роўна на сярэдзіну паміж 22 і 23 капейкамі">
  <defs>
    <marker id="mArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <path d="M 96 96 L 544 96" class="f-line"/>
  <path d="M 96 87 L 96 105" class="f-line"/>
  <path d="M 544 87 L 544 105" class="f-line"/>
  <path d="M 320 90 L 320 102" class="f-line" stroke-dasharray="2 2"/>
  <text x="96" y="122" class="f-label f-muted" text-anchor="middle">22 капейкі</text>
  <text x="320" y="122" class="f-label f-muted" text-anchor="middle">сярэдзіна</text>
  <text x="544" y="122" class="f-label f-muted" text-anchor="middle">23 капейкі</text>
  <circle cx="320" cy="96" r="5" class="f-accent"/>
  <text x="320" y="78" class="f-mono f-accent" text-anchor="middle">дакладна 0.225</text>
  <path d="M 328 66 L 538 66" class="f-line" marker-end="url(#mArrow)"/>
  <text x="540" y="58" class="f-label f-muted" text-anchor="end">HALF_UP</text>
  <circle cx="246" cy="96" r="5" class="f-ink"/>
  <text x="246" y="144" class="f-mono f-ink" text-anchor="middle">double 22.499999999999996</text>
  <path d="M 238 158 L 102 158" class="f-line" marker-end="url(#mArrow)"/>
  <text x="100" y="174" class="f-label f-muted" text-anchor="start">Math.round</text>
</svg>
<figcaption>Дакладны здабытак стаіць роўна на сярэдзіне. HALF_UP адпраўляе яго да 23.<br>Double аказваецца ніжэй. Math.round адпраўляе яго да 22. Разрыў намаляваны куды шырэй, чым 3.55e-15.</figcaption>
</figure>

Я паўтарыў прагон на шасці стаўках, лічачы разыходжанні асобна ў залежнасці ад таго, ці трапіў дакладны здабытак на палову:

| стаўка | палавінных выпадкаў | памылак на палове | памылак па-за палавінамі |
|---|---|---|---|
| 3% | 10000 | 2030 | 0 |
| 5% | 50000 | 818 | 0 |
| 7% | 10000 | 0 | 0 |
| 18% | 20000 | 3656 | 0 |
| 20% | 0 | 0 | 0 |
| 25% | 250000 | 16405 | 0 |

Нечаканай аказалася апошняя калонка. Шэсць ставак, па мільёне сум на кожную. Гэты лічыльнік так і не зрушыўся з нуля.

У стаўкі 20 працэнтаў палавін няма зусім. Падатак у капейках гэта цана ў капейках, памножаная на два і падзеленая на дзесяць. Цотны лічнік ніколі не дае астачы пяць. Гэта чыстая арыфметыка. Яна трымаецца па-за прагонам. У сямі працэнтаў палавіны ёсць. Іх дзесяць тысяч на мільён. Ніводнай памылкі. Я пашырыў той прагон да дзесяці мільёнаў сум, каб упэўніцца. Сто тысяч палавін, усё гэтак жа нуль.

Мне хацелася вывесці правіла з таго, у які бок захоўваецца кожная стаўка. 0.05, 0.07 і 0.20 ляжаць вышэй за сваё дзесятковае значэнне, 0.03 і 0.18 ніжэй, 0.25 дакладная. Калі адсартаваць па долі згубленых палавін, амаль сыходзіцца. Больш за ўсіх губляюць тыя, што захоўваюцца ніжэй: 20.3 паловы са ста на трох працэнтах і 18.3 на васямнаццаці. 0.25 захоўваецца дакладна і губляе 6.6. Далей 0.05 ляжыць вышэй і ўсё роўна губляе 1.6, хоць па адным кірунку мусіў бы быць нуль. Цана паспявае прайсці праз `cents / 100.0` да таго, як стаўка яе кранае, так што стаўка гэта толькі палова таго, што адбываецца. Правіла ў мяне няма.

## У BigDecimal свае вострыя куты

Змена тыпу сама па сабе праблему не здымае:

```
new BigDecimal(0.1)     = 0.1000000000000000055511151231257827021181583404541015625
BigDecimal.valueOf(0.1) = 0.1
new BigDecimal("0.1")   = 0.1
```

Канструктар, які прымае `double`, пераносіць памылку ўнутр як ёсць. `valueOf` ідзе праз `Double.toString` і атрымлівае кароткі запіс. Радковы канструктар double не бачыць увогуле.

```
1.0 equals 1.00    = false
1.0 compareTo 1.00 = 0
hash 1.0  = 311
hash 1.00 = 3102
```

Маштаб, лік знакаў пасля коскі, удзельнічае ў equals, таму `HashSet` трымае 1.0 і 1.00 як дзве розныя цаны. Гэтыя два хэшы тое, што робіць рэалізацыя, а не тое, што абяцае javadoc. А дзяленне ўвогуле адмаўляецца адгадваць:

```
1/3 -> ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```

Мне падабаецца, што яно кідае выключэнне. `double` вярнуў бы 0.3333333333333333 і дазволіў цягнуць гэта далей.

## Цэлыя капейкі ў long справіліся не горш

Той самы падатак, той самы мільён сум, але ў цэлых капейках і з акругленнем, напісаным рукамі:

```
long ints = (cents * 18 + 50) / 100;
```

```
(cents*18 + 50)/100 vs BigDecimal HALF_UP: mismatches=0
```

Нуль разыходжанняў супраць `setScale(2, HALF_UP)` на кожнай з іх. У `long` змяшчаецца 9223372036854775807 капеек. Нават `double` лічыць цэлыя капейкі дакладна да 9007199254740992 штук. Гэта дзевяноста трыльёнаў рублёў, так што памер ліку ніколі і не быў праблемай. Плата ў іншым: правіла акруглення цяпер жыве ў маім кодзе і трымаць яго мушу я.

## Чаго я не правяраў

HALF_EVEN памяншае эфект прыкладна ўдвая, але не здымае. Праз `Math.rint` той жа прагон на 18 працэнтах дае 1830 памылак на мільён. Палова ад 3656 гэта 1828, прыкладна столькі я і чакаю, калі палова серадзінных выпадкаў і так акруглялася ўніз. Дзве астатнія я не разбіраў.

Адкрытым засталося вось што: валюты з трыма знакамі пасля коскі. Падзел адной сумы на некалькі радкоў рахунку так, каб часткі складаліся назад у цэлае. І JDBC-драйвер з калонкай тыпу `NUMERIC`, куды я пакуль не зазіраў.
