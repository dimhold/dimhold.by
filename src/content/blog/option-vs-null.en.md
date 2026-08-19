---
title: "Option instead of null: 477 milliseconds against 107"
description: "Three different missing links in a null chain throw the identical empty exception. Option turns the chain into a type that never throws. A hashmap lookup through it still ran four times slower, 477 milliseconds against 107. A thread level counter showed both loops allocating almost the same bytes per lookup."
date: 2011-11-30
lang: en
translationKey: option-vs-null
---

I wrote this chain the way I always had, three dots and no thought given to any of them:

```
class Address(val zip: String)
class Customer(val address: Address)
class Order(val customer: Customer)

def zipOf(order: Order): String = order.customer.address.zip
```

Ran it against four orders, one complete and three missing something at a different depth:

```
complete:    00-001
no address:  NullPointerException, message=[null]
no customer: NullPointerException, message=[null]
no order:    NullPointerException, message=[null]
```

Three different orders, broken in three different places. The exception cannot tell them apart. The message is empty. The stack trace gives me the line and that line has three dots on it. I know something in the chain was missing. Which of the three it was I cannot tell without adding print statements or a debugger.

<figure class="fig">
<svg viewBox="0 0 640 150" role="img" aria-label="Three columns, no order, no customer, no address, each breaking the chain at a different link but producing the identical NullPointerException with an empty message">
  <defs>
    <marker id="arr1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="116" y="16" class="f-label f-muted" text-anchor="middle">no order</text>
<rect x="54" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="69" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<circle cx="69" cy="36" r="3" class="f-accent"/>
<rect x="90" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="105" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<rect x="126" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="141" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<rect x="162" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="177" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="116" y1="66" x2="116" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="36" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="116" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="116" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>
<text x="316" y="16" class="f-label f-muted" text-anchor="middle">no customer</text>
<rect x="254" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="269" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<rect x="290" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="305" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<circle cx="305" cy="36" r="3" class="f-accent"/>
<rect x="326" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="341" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<rect x="362" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="377" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="316" y1="66" x2="316" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="236" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="316" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="316" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>
<text x="516" y="16" class="f-label f-muted" text-anchor="middle">no address</text>
<rect x="454" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="469" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">order</text>
<rect x="490" y="26" width="30" height="20" rx="2" class="f-box"/>
<text x="505" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">customer</text>
<rect x="526" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="541" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">address</text>
<circle cx="541" cy="36" r="3" class="f-accent"/>
<rect x="562" y="26" width="30" height="20" rx="2" class="f-plain" stroke-dasharray="3 2"/>
<text x="577" y="56" class="f-label f-muted" text-anchor="middle" font-size="7">zip</text>
<line x1="516" y1="66" x2="516" y2="92" class="f-line" marker-end="url(#arr1)"/>
<rect x="436" y="96" width="160" height="44" rx="3" class="f-box"/>
<text x="516" y="114" class="f-mono f-ink" text-anchor="middle" font-size="10">NullPointerException</text>
<text x="516" y="130" class="f-mono f-muted" text-anchor="middle" font-size="10">message=[null]</text>

</svg>
<figcaption>Three different breaks in the same chain. Every one of them prints the identical exception with an empty message.</figcaption>
</figure>

Rewrite the same chain through `Option` and the type changes with it:

```
class AddressO(val zip: String)
class CustomerO(val address: Option[AddressO])
class OrderO(val customer: Option[CustomerO])

def zipOf(order: Option[OrderO]): Option[String] =
  order.flatMap(_.customer).flatMap(_.address).map(_.zip)
```

```
complete:    Some(00-001)
no address:  None
no customer: None
no order:    None
```

Nothing throws. The signature says `Option[String]` instead of `String`. The compiler will not let me call `.length` on the result directly, only `map`, `flatMap`, `getOrElse` or a pattern match. The possibility of a missing zip code used to live only in my head. Now the type checker enforces it on every line that touches the value. Forgetting it is a compile error instead of a crash three calls later.

## The escape hatch

`Option` has a method that undoes the whole argument:

```
val none: Option[String] = None
none.get
// java.util.NoSuchElementException: None.get
```

Same shape of crash under a new class name. I still have no idea which upstream value was empty. `get` has been a public method on `Option` since it grew `map` and `flatMap`. Nothing stops a chain of `.get` calls from reproducing every failure mode `null` had. The guarantee from a page ago only covers code that reaches for `map` and `flatMap` instead. Old habits reach for `get` first because it reads like the null check it replaces. `if (x != null) x.field` becomes `if (x.isDefined) x.get.field`. That translation keeps the crash intact while adding the ceremony.

## The hashmap

The standard complaint about `Option` is that it boxes. Every `Some` is a real object on the heap where a nullable field costs nothing extra. A hashmap lookup through `Option` should show up as garbage. I built two maps of a hundred thousand entries, one `java.util.HashMap<Integer, String>` and one `scala.collection.mutable.HashMap[Int, String]`. Both ran twenty million lookups after three warmup passes:

```
java   ms per run: Vector(112, 102, 120, 105, 107)
scala  ms per run: Vector(579, 478, 429, 474, 477)
```

Median of the five, 107 ms against 477, which is 4.46 times slower through `Option`. That ratio held across three separate runs of the whole program at 4.15, 4.46 and 3.88. So the folklore about `Option` being slow is not wrong. But I attached a per thread allocation counter around both timed blocks before deciding why:

```
java   bytes allocated, 5 runs of 20000000 lookups: 1597991864
scala  bytes allocated, 5 runs of 20000000 lookups: 1597956632
```

That is 15.9799 bytes per lookup for the null version and 15.9796 for `Option`, a gap of about 0.002 percent. That gap is the boxed `Integer` key both loops build for the same `i % SIZE`. Neither loop carries the weight of an extra `Some`. The JIT is scalar replacing it, keeping the one field in a register instead of putting it on the heap. The wrapper never escapes the few instructions between the lookup and the `isDefined` check. The four times slowdown is real. It is not garbage collection pressure. Where it actually goes I did not isolate. One guess is the extra hash spreading step `scala.collection.mutable.HashMap` runs on every key. Another is the layer of trait dispatch sitting on top of a plain bucket array. I have not run anything that would tell those two apart.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Two loops side by side. The null loop allocates one boxed Integer per lookup. The Option loop allocates the same one boxed Integer. The Some wrapper next to it is crossed out because the JIT eliminates it before it reaches the heap">
  <text x="160" y="20" class="f-label f-muted" text-anchor="middle">null loop (java.util.HashMap)</text>
  <rect x="120" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="160" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>

  <text x="480" y="20" class="f-label f-muted" text-anchor="middle">Option loop (scala mutable.HashMap)</text>
  <rect x="400" y="40" width="80" height="50" rx="3" class="f-box"/>
  <text x="440" y="70" class="f-mono f-ink" text-anchor="middle" font-size="11">Integer</text>
  <rect x="490" y="40" width="80" height="50" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="530" y="65" class="f-mono f-muted" text-anchor="middle" font-size="11">Some</text>
  <line x1="495" y1="45" x2="565" y2="85" class="f-line"/>
  <text x="530" y="104" class="f-label f-muted" text-anchor="middle" font-size="8">eliminated by the JIT</text>

  <text x="320" y="150" class="f-mono f-ink" text-anchor="middle" font-size="12">15.98 bytes per lookup, both sides</text>
</svg>
<figcaption>Both loops box the same Integer key. The extra Some the folklore expects never lands on the heap.</figcaption>
</figure>

## What I have not checked

Escape analysis is not free of history. It shipped as an experimental flag before it became a default. I have no way to confirm that on hardware from this year. The JIT here eliminates `Some` before it becomes garbage. Whether it did that as reliably back then I cannot check on this machine. If it did not, the folklore had a real basis for a while and only stopped being true once the compiler caught up.

I also only tested the mutable hash map. Scala's immutable `Map` is a different data structure with its own tradeoffs. I have not measured it at all. Nor did I test the direction most of my actual code goes wrong in, a Java library that hands back `null`. That gets wrapped in `Option(x)` at the boundary. Only the case where the library actually returns something allocates. A `null` coming back costs nothing. It becomes the same `None` every time.
