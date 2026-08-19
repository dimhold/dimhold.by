---
title: "Money in a double: 4.35 * 100 comes out 434"
description: "Four prices in a hundred are exact doubles. Across a million amounts the wrong kopeck only ever turned up on an exact half: 3656 of them at 18 percent, none at 20."
date: 2011-11-16
lang: en
translationKey: money-in-a-double
---

I had a price of 4.35 and needed it in kopecks:

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

The cast truncates and a kopeck is gone. Avoiding `double` for money is advice I took without ever measuring what it costs, so I measured it.

`new BigDecimal(double)` prints the exact decimal value of the bits with no rounding on the way out. That is the whole diagnostic tool here:

```
4.35 -> 4.3499999999999996447286321199499070644378662109375
0.1  -> 0.1000000000000000055511151231257827021181583404541015625
0.2  -> 0.200000000000000011102230246251565404236316680908203125
0.3  -> 0.299999999999999988897769753748434595763683319091796875
0.5  -> 0.5
```

4.35 is held a little below 4.35. Times 100 it is still a little below 435 and the cast to `long` drops everything after the point. `Math.round` gives 435 here. It does not help when the rate itself is inexact.

## Four exact prices in a hundred

I ran every two decimal value from 0.01 to 100.00 through the same comparison, the double against the decimal it stands for:

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

Four percent. A double is a sum of powers of two so a hundredth fits only when it reduces to a fourth. Every other price is already an approximation when it is parsed.

<figure class="fig">
<svg viewBox="0 0 640 398" role="img" aria-label="A hundred two decimal prices from 0.01 to 1.00, four of them exact as doubles">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">prices 0.01 to 1.00</text>
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
<figcaption>Every two decimal price from 0.01 to 1.00. Four of the hundred are stored exactly.<br>The other ninety six are approximations before any arithmetic happens.</figcaption>
</figure>

## Adding 0.10 ten times

The famous one first:

```
double acc = 0.0;
for (int i = 0; i < 10; i++) acc += 0.10;
```

```
sum of ten 0.10 = 0.9999999999999999
acc == 1.0 ? false
exact         = 0.99999999999999988897769753748434595763683319091796875
```

I expected accumulation to be the expensive part, so I ran a million additions of 0.01 next to a `BigDecimal` doing the same:

```
after 1000000 additions, double = 10000.000000171856
exact                           = 10000.00
difference in rubles            = 1.71856299857608973979949951171875E-7
```

Then I rounded the double total to kopecks after every one of those million steps and compared it with the exact total. They never disagreed. Not once in a million steps. The drift is real at the seventh decimal and rounding to two eats all of it.

## The kopeck leaves on an exact half

Take the Russian VAT rate of 18 percent and compute the tax two ways for every amount from 0.01 to 10000.00:

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

The smallest one takes it apart:

```
1.25 as a double   1.25
0.18 as a double   0.179999999999999993338661852249060757458209991455078125
product            0.22499999999999997779553950749686919152736663818359375
times 100          22.499999999999996447286321199499070644378662109375
Math.round         22
```

1.25 is one of the four hundred exact prices while 0.18 is stored below its decimal value. The true product is 0.225. That sits exactly between two kopecks so HALF_UP takes it up to 0.23. The double sits 3.55e-15 under the halfway point and falls to 0.22.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Eighteen percent of 1.25 falls on the halfway point between 22 and 23 kopecks">
  <defs>
    <marker id="mArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <path d="M 96 96 L 544 96" class="f-line"/>
  <path d="M 96 87 L 96 105" class="f-line"/>
  <path d="M 544 87 L 544 105" class="f-line"/>
  <path d="M 320 90 L 320 102" class="f-line" stroke-dasharray="2 2"/>
  <text x="96" y="122" class="f-label f-muted" text-anchor="middle">22 kopecks</text>
  <text x="320" y="122" class="f-label f-muted" text-anchor="middle">halfway</text>
  <text x="544" y="122" class="f-label f-muted" text-anchor="middle">23 kopecks</text>
  <circle cx="320" cy="96" r="5" class="f-accent"/>
  <text x="320" y="78" class="f-mono f-accent" text-anchor="middle">exact 0.225</text>
  <path d="M 328 66 L 538 66" class="f-line" marker-end="url(#mArrow)"/>
  <text x="540" y="58" class="f-label f-muted" text-anchor="end">HALF_UP</text>
  <circle cx="246" cy="96" r="5" class="f-ink"/>
  <text x="246" y="144" class="f-mono f-ink" text-anchor="middle">double 22.499999999999996</text>
  <path d="M 238 158 L 102 158" class="f-line" marker-end="url(#mArrow)"/>
  <text x="100" y="174" class="f-label f-muted" text-anchor="start">Math.round</text>
</svg>
<figcaption>The exact product sits on the halfway mark and HALF_UP sends it to 23.<br>The double lands below it and Math.round sends it to 22. The gap is drawn far wider than 3.55e-15.</figcaption>
</figure>

I repeated the scan at six rates, with the mismatches counted separately depending on whether the exact product landed on a half:

| rate | halfway cases | wrong on a half | wrong anywhere else |
|---|---|---|---|
| 3% | 10000 | 2030 | 0 |
| 5% | 50000 | 818 | 0 |
| 7% | 10000 | 0 | 0 |
| 18% | 20000 | 3656 | 0 |
| 20% | 0 | 0 | 0 |
| 25% | 250000 | 16405 | 0 |

The column I did not expect is the last one. Six rates, a million amounts each. That counter never moved off zero.

20 percent has no halves to get wrong. The tax in kopecks is the price in kopecks times two, divided by ten. An even numerator never leaves a remainder of five. That one is arithmetic and it holds outside the scan. 7 percent does have halves. It has 10000 of them in the million and loses none. I widened that scan to ten million amounts to be sure. 100000 halves, still zero.

I wanted a rule out of the direction each rate is stored in. 0.05 and 0.07 and 0.20 sit above their decimal value, 0.03 and 0.18 sit below, 0.25 is exact. Sorted by the share of halves lost it almost lines up. The two stored below lose the most: 20.3 halves in every hundred at 3 percent and 18.3 at 18 percent. 0.25 is stored exactly and loses 6.6. Then 0.05 sits above and still loses 1.6, where the direction on its own says zero. The price has been through `cents / 100.0` before the rate ever touches it, so the rate is only half of what is going on. I do not have the rule.

## BigDecimal has its own edges

Changing the type does not switch the problem off:

```
new BigDecimal(0.1)     = 0.1000000000000000055511151231257827021181583404541015625
BigDecimal.valueOf(0.1) = 0.1
new BigDecimal("0.1")   = 0.1
```

The constructor that takes a `double` copies the error straight in. `valueOf` goes through `Double.toString` and gets the short form back. The string constructor never sees a double.

```
1.0 equals 1.00    = false
1.0 compareTo 1.00 = 0
hash 1.0  = 311
hash 1.00 = 3102
```

Scale is part of identity, so a `HashSet` keeps 1.0 and 1.00 as two different prices. Those two hash values are what the implementation does and not what the javadoc promises. Division refuses to guess at all:

```
1/3 -> ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```

I like that it throws. A `double` would have handed back 0.3333333333333333 and let me carry it into the next line.

## Long kopecks did the same job

The same tax over the same million amounts, in `long` kopecks with the rounding written by hand:

```
long ints = (cents * 18 + 50) / 100;
```

```
(cents*18 + 50)/100 vs BigDecimal HALF_UP: mismatches=0
```

Zero, against `setScale(2, HALF_UP)` on every one of them. A `long` holds 9223372036854775807 kopecks. Even a `double` counts whole kopecks exactly up to 9007199254740992 of them. That is ninety trillion rubles, so the size of the number was never the problem. The cost is that the rounding rule is now in my code and keeping it correct is on me.

## What I have not checked

HALF_EVEN roughly halves it and does not remove it. Through `Math.rint` the same 18 percent scan gives 1830 wrong out of a million. Half of 3656 is 1828, which is about what I expect when half the ties were rounding down anyway. I have not chased the other two.

Still open: currencies with three decimals. Splitting one amount across several invoice lines so the parts add back up to the whole. And the JDBC driver with a `NUMERIC` column, which I have not looked at yet.
