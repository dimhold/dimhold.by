---
title: "Option instead of null: the 16 bytes I could not find"
description: "3 broken links in one chain give the same NullPointerException with an empty message. Option turns all 3 into None. Then the allocation counter says the Some costs nothing and it takes -XX:-DoEscapeAnalysis to find it."
date: 2011-11-30
lang: en
translationKey: option-vs-null
tags: ["types", "code-quality"]
---

A NullPointerException came out of a line with 3 dots in it.

```scala
def zipOf(order: Order): String = order.customer.address.zip
```

The message was empty. The stack trace named the method and the line, which I already knew from the exception being thrown at all. Any of the 3 could have been null and the exception looks the same either way.

2 things I wanted to settle. Whether Option really takes this class of error away, which everyone around me says and I half believe. And what it costs, because I have been repeating that Option allocates on every lookup and I have never measured that once. Everything below is Scala 2.9.1 on jdk 7.

```
complete: 00-001
no address: NullPointerException, message=[null] at zipOf line 8
no customer: NullPointerException, message=[null] at zipOf line 8
no order: NullPointerException, message=[null] at zipOf line 8
```

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Three broken chains, one with no order, one with no customer, one with no address. Each breaks at a different link and all three converge on the same NullPointerException with an empty message at Chains.scala line 8. Below, the same three inputs through an Option chain return None and throw nothing.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="117.5" y="20" class="f-label f-muted" text-anchor="middle">order</text>
  <text x="186.5" y="20" class="f-label f-muted" text-anchor="middle">customer</text>
  <text x="255.5" y="20" class="f-label f-muted" text-anchor="middle">address</text>
  <text x="324.5" y="20" class="f-label f-muted" text-anchor="middle">zip</text>
  <text x="6" y="48" class="f-label f-muted">no order</text>
  <rect x="90" y="30" width="55" height="26" rx="3" class="f-plain"/>
  <text x="117.5" y="48" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="152" y="49" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="159" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="221" cy="43" r="1.6" class="f-muted"/>
  <rect x="228" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="43" r="1.6" class="f-muted"/>
  <rect x="297" y="30" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 43 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="96" class="f-label f-muted">no customer</text>
  <rect x="90" y="78" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="152" cy="91" r="1.6" class="f-muted"/>
  <rect x="159" y="78" width="55" height="26" rx="3" class="f-plain"/>
  <text x="186.5" y="96" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="221" y="97" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="228" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <circle cx="290" cy="91" r="1.6" class="f-muted"/>
  <rect x="297" y="78" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 91 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <text x="6" y="144" class="f-label f-muted">no address</text>
  <rect x="90" y="126" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="152" cy="139" r="1.6" class="f-muted"/>
  <rect x="159" y="126" width="55" height="26" rx="3" class="f-box"/>
  <circle cx="221" cy="139" r="1.6" class="f-muted"/>
  <rect x="228" y="126" width="55" height="26" rx="3" class="f-plain"/>
  <text x="255.5" y="144" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="290" y="145" class="f-glyph f-accent" text-anchor="middle">×</text>
  <rect x="297" y="126" width="55" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <path d="M 358 139 L 380 88" class="f-line" marker-end="url(#oArrow)"/>
  <rect x="386" y="44" width="248" height="88" rx="4" class="f-plain"/>
  <text x="398" y="72" class="f-mono f-ink">NullPointerException</text>
  <text x="398" y="94" class="f-mono f-muted">message=[null]</text>
  <text x="398" y="116" class="f-mono f-muted">Chains.scala:8</text>
  <text x="6" y="172" class="f-label f-muted">same three inputs, through Option</text>
  <rect x="90" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="130" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 172 195 L 178 195" class="f-line"/>
  <rect x="180" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="220" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 262 195 L 268 195" class="f-line"/>
  <rect x="270" y="182" width="80" height="26" rx="3" class="f-box"/>
  <text x="310" y="200" class="f-mono f-ink" text-anchor="middle">None</text>
  <path d="M 352 195 L 380 195" class="f-line" marker-end="url(#oArrow)"/>
  <rect x="386" y="182" width="248" height="26" rx="4" class="f-plain"/>
  <text x="398" y="200" class="f-mono f-muted">no exception thrown</text>
</svg>
<figcaption>3 different defects break the chain at 3 different links. All 3 arrive as the same exception with an empty message, on the same line.</figcaption>
</figure>

3 different defects arrive as one line of output repeated 3 times. To find out which link was broken I had to go back and split the chain up by hand. The argument for Option is about this class of error and it is fair.

The same path with the fields typed as Option:

```scala
def zipOf(order: Option[OrderO]): Option[String] =
  order.flatMap(_.customer).flatMap(_.address).map(_.zip)
```

```
complete: Some(00-001)
no address: None
no customer: None
no order: None
```

Nothing is thrown. The 3 defects are still there and the program still cannot produce a zip, but the absence now travels as a value and arrives where I decided to handle it. The compiler also stops me reading the zip out without saying what happens when it is missing.

That holds for code that goes through `map` and `flatMap`. `get` is still on the type:

```
none.get: NoSuchElementException, message=[None.get]
```

Same crash under a different class name. The message says `None.get`, which beats an empty one, but the guarantee only covers the calls I choose to make.

## Where it leaks

Most of the code around this is java and java returns null. So the wrapper gets written:

```scala
def zipOf(id: String): Option[String] = Some(Legacy.zip(id))
```

That is what comes out when I write it quickly. It compiles and it is wrong:

```
zipOf("c-1")                    = Some(null)
zipOf("c-1").isDefined          = true
zipOf("c-1").getOrElse("none")  = null
lengthOfZip("c-1")              ! java.lang.NullPointerException
    Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- Interop$$anonfun$lengthOfZip$1.apply(Interop.scala:9) <- scala.Option.map(Option.scala:133)
```

`Some(null)` is a value that reports itself as present and holds nothing. `isDefined` is true, `getOrElse` hands back the null it was there to keep away from me and the NPE moves inside the lambda in `map`. That is a worse place to meet it than the original chain, because now the stack goes through library code. Writing `Option(...)` instead of `Some(...)` fixes all of it, since `Option.apply` checks for null and gives back `None`.

The second leak I did not expect. `Option` is a reference like any other, so it can be null itself:

```
val o: Option[String] = null    = null
o.isDefined                     ! java.lang.NullPointerException
    Interop$.main(Interop.scala:25) <- Interop.main(Interop.scala)
o.getOrElse("none")             ! java.lang.NullPointerException
    Interop$.main(Interop.scala:27) <- Interop.main(Interop.scala)
```

That compiles without a warning. I ran the compiler again with `-deprecation` in case I had missed one. The only 2 warnings in the whole build are about an `Integer` alias in a different file. An uninitialised field of type `Option[String]` holds null rather than `None`. Every call on it fails the old way.

2.9.1 has a flag aimed at exactly this. `-Xcheck-null` warns on the selection of a nullable reference. On these 2 small files it produced 54 warnings. 3 of them are the real dereferences on line 8. It also flags `o.isDefined` on the null Option, which is the case I had just been surprised by. The rest are things like an arrow on a string literal and `label.+`, because a string concatenation is a selection on a reference too. 17 of the 54 are concatenations and 8 are that arrow. I did not find a way to read the 3 I wanted out of the other 51.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Four states behind a value of type Option of String. Some of a value and None are the two states the type describes. Some of null and a null reference are also legal, one arriving from a java null and the other from an uninitialised field. Both crash with a NullPointerException.">
  <defs>
    <marker id="oArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="18" class="f-label f-muted" text-anchor="middle">val zip: Option[String]</text>
  <rect x="10" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="80" y="64" class="f-mono f-ink" text-anchor="middle">Some("00-001")</text>
  <text x="80" y="106" class="f-label f-muted" text-anchor="middle">described by the type</text>
  <text x="80" y="128" class="f-label f-muted" text-anchor="middle">a value</text>
  <rect x="170" y="30" width="140" height="56" rx="4" class="f-box"/>
  <text x="240" y="64" class="f-mono f-ink" text-anchor="middle">None</text>
  <text x="240" y="106" class="f-label f-muted" text-anchor="middle">described by the type</text>
  <text x="240" y="128" class="f-label f-muted" text-anchor="middle">absence</text>
  <rect x="330" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="400" y="64" class="f-mono f-accent" text-anchor="middle">Some(null)</text>
  <text x="400" y="106" class="f-label f-muted" text-anchor="middle">legal on this jvm</text>
  <text x="400" y="128" class="f-label f-accent" text-anchor="middle">npe inside map</text>
  <path d="M 400 138 L 400 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="400" y="172" class="f-label f-muted" text-anchor="middle">a java null</text>
  <rect x="490" y="30" width="140" height="56" rx="4" class="f-plain" stroke-dasharray="4 3"/>
  <text x="560" y="64" class="f-mono f-accent" text-anchor="middle">null</text>
  <text x="560" y="106" class="f-label f-muted" text-anchor="middle">legal on this jvm</text>
  <text x="560" y="128" class="f-label f-accent" text-anchor="middle">npe on any call</text>
  <path d="M 560 138 L 560 152" class="f-line" marker-end="url(#oArrow)"/>
  <text x="560" y="172" class="f-label f-muted" text-anchor="middle">uninitialised field</text>
</svg>
<figcaption>4 states fit behind a value typed Option[String]. 2 of them are the ones the type describes.</figcaption>
</figure>

## What I thought it cost

I have been repeating that Option costs an allocation on every lookup. I had never measured it. A table of 100000 entries, 20 million lookups per loop, 3 warmups then 5 timed runs with the median printed. Same 2.9.1 and jdk 7, heap pinned with `-Xms256m -Xmx256m` so that compressed oops stay on:

```
1 java null                median 192 ms   runs 192,192,176,201,182            15.9802 bytes/lookup
2 scala Option             median 436 ms   runs 453,447,436,430,412            15.9795 bytes/lookup
3 java + Option()          median 188 ms   runs 184,188,197,181,195            15.9795 bytes/lookup
4 scala apply, no Option   median 434 ms   runs 434,438,424,432,466            15.9795 bytes/lookup
```

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="A two by two grid of medians. The java map answers in 192 milliseconds returning null and 188 wrapped in Option. The scala map answers in 434 milliseconds through apply and 436 returning Option. Both slow cells sit in the scala row.">
  <text x="315" y="24" class="f-label f-muted" text-anchor="middle">no Option in my loop</text>
  <text x="525" y="24" class="f-label f-muted" text-anchor="middle">Option in my loop</text>
  <text x="6" y="84" class="f-label f-muted">java.util.HashMap</text>
  <text x="6" y="174" class="f-label f-muted">scala mutable.HashMap</text>
  <rect x="220" y="44" width="190" height="70" rx="4" class="f-plain"/>
  <text x="315" y="70" class="f-mono f-muted" text-anchor="middle">jm.get(k)</text>
  <text x="315" y="100" class="f-glyph f-ink" text-anchor="middle">192 ms</text>
  <rect x="430" y="44" width="190" height="70" rx="4" class="f-plain"/>
  <text x="525" y="70" class="f-mono f-muted" text-anchor="middle">Option(jm.get(k))</text>
  <text x="525" y="100" class="f-glyph f-ink" text-anchor="middle">188 ms</text>
  <rect x="220" y="134" width="190" height="70" rx="4" class="f-box"/>
  <text x="315" y="160" class="f-mono f-muted" text-anchor="middle">sm(k)</text>
  <text x="315" y="190" class="f-glyph f-accent" text-anchor="middle">434 ms</text>
  <rect x="430" y="134" width="190" height="70" rx="4" class="f-box"/>
  <text x="525" y="160" class="f-mono f-muted" text-anchor="middle">sm.get(k)</text>
  <text x="525" y="190" class="f-glyph f-accent" text-anchor="middle">436 ms</text>
</svg>
<figcaption>Medians of 5 timed runs, 20 million lookups each. Both slow cells sit in the scala row. Moving Option in or out of the loop moves nothing.</figcaption>
</figure>

Loops 1 and 3 run against the same `java.util.HashMap`. The only difference is that loop 3 wraps every result in `Option(...)`. 188 against 192. Across the 3 runs I kept, the 2 sit at 181 to 189 against 186 to 199. Wrapping costs nothing I can see. The interesting gap is loop 3 against loop 2, which is 248 ms between 2 loops that both build an Option per lookup. What separates those 2 is `scala.collection.mutable.HashMap` against `java.util.HashMap`.

The allocation column is the part I got wrong. Loops 2, 3 and 4 all allocate 15.9795 bytes per lookup and loop 1 sits a rounding hair away at 15.9802. That number is the key rather than the `Some`. The key `i % SIZE` is boxed into an `Integer`. The cache covers -128 to 127 by default while the keys run from 0 to 99999. So 128 lookups in every 100000 come out of the cache and the rest allocate 16 bytes each. That is 16 × (1 − 128/100000) or 15.97952.

Loop 4 was meant to be the control. `sm(k)` returns the value directly and the word Option does not appear in it. It came out as slow as loop 2, a little slower in 2 of the 3 runs. I read that as confirmation until I turned escape analysis off:

```
1 java null                median 195 ms   runs 192,189,195,195,210            15.9802 bytes/lookup
2 scala Option             median 544 ms   runs 540,552,536,562,544            31.9795 bytes/lookup
3 java + Option()          median 229 ms   runs 209,229,239,230,227            31.9795 bytes/lookup
4 scala apply, no Option   median 535 ms   runs 495,545,553,535,518            31.9795 bytes/lookup
```

Loop 1 holds at 15.9802 and the other 3 gain exactly 16 bytes. Loop 4 gains them too, so there is a `Some` in it after all: `apply` calls `get`, `get` builds the `Some` and `apply` unwraps it and drops it. My control loop contained the thing I was controlling for. I only noticed because the allocation counter disagreed with the source I had written.

16 bytes is one `Some`, a 12 byte header plus one 4 byte reference under compressed oops. With escape analysis on, which is the default, the jit works out that it never leaves the method and skips the allocation. Loop 3 goes from 188 ms to 229 when I take that away. The object is real and it costs time when the jit cannot remove it. It just never gets built.

The same block settles the other question better than my first pairing did. With allocation forced on both, loops 2 and 3 build the same number of `Some` objects and allocate the same 31.9795 bytes per lookup. They are still 315 ms apart. Whatever that gap is, it is not the Option.

## What I did not check

Where those 248 ms go. I measured that it is not the Option and stopped there, so `scala.collection.mutable.HashMap` is still on my list.

Whether any of this survives outside a tight loop. 20 million lookups with nothing else running is a friendly case for escape analysis. In a request handler with a stack of frames above it I do not know that the `Some` stays out of the heap. I did not build that test.
