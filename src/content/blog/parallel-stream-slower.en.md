---
title: "A parallel stream called my function 1,999,871 times to add up 1,000,000 numbers"
description: "I summed a million numbers from 8 sources with JDK 8u5 on 2 cores, with parallel() and without. Stream.iterate computed almost a million elements for nothing and a part of my table fell apart near the 5000th call, when C2 recompiled the code."
date: 2014-06-08
lang: en
translationKey: parallel-stream-slower
tags: ["performance", "algorithms"]
---

```java
LongAdder calls = new LongAdder();
long sum = Stream.iterate(1L, x -> { calls.increment(); return x + 1; })
    .limit(1_000_000)
    .parallel()
    .mapToLong(Long::longValue)
    .sum();
```

The sum is 500000500000, which is correct. The counter says 1,999,871. Without `.parallel()` it says 999,999, as it should, because the first number is given and the function makes the rest. On 2 threads I got almost a million extra calls. I repeated it 30 times in one JVM and 26 times the number was the same to the last digit.

Until now I treated `parallel()` as a switch that is safe to try. If the stream suits it, it gets faster, otherwise I lose some microseconds on starting the tasks. I also believed that the length of the collection decides. I never measured any of this. Java 8 came out in March, so I have not been doing it for long, but the habit is already here.

The advice exists. Richard Warburton in "Java 8 Lambdas" calls arrays and ArrayList good sources. HashSet and TreeSet are okay there, LinkedList and iterate are bad. Lukas Krecan showed in March how to run a parallel stream in a pool of your own. I wanted to see what these words cost in milliseconds.

## Setup

JDK 1.8.0_05, JMH 0.8, a virtual machine that other processes use too. I pinned the JMH runs to 2 cores with `taskset` and here I stumbled for the first time: even with `taskset -c 0` this JDK reports 4 cores and a common pool of 3 threads. So I set the parallelism of the common pool to 1 by hand. The caller works as well, which makes 2 threads. Only JMH was pinned, the counters and the sleeps at the end were not.

Neighbours on the machine make the timings noisy, therefore I ran the benchmarks twice, 2 forks in the first run and 3 or 4 in the second. The numbers in the table are medians of all iterations. I decided to trust a difference only if both runs show it. My expectations were written down before the first timing.

## The same million from 8 sources

I summed the numbers from 1 to 1,000,000. The times are from run 1. A ratio of more than 1 means that `parallel()` made it slower.

| source | sequential, ms | parallel, ms | ratio, run 1 | ratio, run 2 |
|---|---|---|---|---|
| TreeSet | 22.81 | 14.67 | 0.64 | 0.51 |
| LongStream.rangeClosed | 2.76 | 1.92 | 0.69 | 0.74 |
| long[] | 2.35 | 2.20 | 0.94 | 1.32 |
| HashSet | 10.71 | 10.46 | 0.98 | 0.49 |
| LinkedList | 3.28 | 6.88 | 2.10 | 1.91 |
| ArrayList | 1.36 | 3.56 | 2.62 | 2.66 |
| Stream.iterate | 5.90 | 16.76 | 2.84 | 2.76 |
| LongStream.iterate | 1.56 | 12.29 | 7.88 | 6.34 |

I expected iterate and LinkedList at the bottom and they are there. TreeSet I had put down as borderline, it won both times. About long[] and HashSet my 2 runs disagree. ArrayList was supposed to pay off, it splits ideally, I checked: 4 pieces of 250,000. And it lost in both runs. By my rule this is a result and I had already written it down as one.

Then I noticed the sequential column. A list of boxed Long is summed faster than a plain long[]. That looked wrong, so I left the medians and went to single iterations.

## Fast until about 5000 calls

In all 4 forks of run 2 the first measured iteration of the sequential long[] is from 0.35 to 0.37 ms and the last one from 2.2 to 2.3. I ran several sources longer, without warmup.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Time of one sequential sum of a million elements against the number of calls already made, 4 sources, vertical axis logarithmic. long[] goes from 0.34 to about 2.2 ms after 4200 calls, LongStream.iterate from 1.5 to 5.3 ms and LinkedList from 2.9 to 3.9 ms near 5000 calls. ArrayList goes from 1.2 to 5.0 ms in one start of the JVM and stays at 1.2 ms for 10,000 calls in the other.">
  <line x1="152" y1="233.7" x2="600" y2="233.7" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="237.7" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <line x1="152" y1="184.4" x2="600" y2="184.4" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="188.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="152" y1="135.1" x2="600" y2="135.1" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="139.1" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="152" y1="69.9" x2="600" y2="69.9" class="f-plain" style="opacity:0.35"/>
  <text x="610.0" y="73.9" text-anchor="start" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="152.0" y1="270" x2="152.0" y2="275" class="f-plain"/>
  <text x="152.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="237.3" y1="270" x2="237.3" y2="275" class="f-plain"/>
  <text x="237.3" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <line x1="322.7" y1="270" x2="322.7" y2="275" class="f-plain"/>
  <text x="322.7" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <line x1="408.0" y1="270" x2="408.0" y2="275" class="f-plain"/>
  <text x="408.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6000</text>
  <line x1="493.3" y1="270" x2="493.3" y2="275" class="f-plain"/>
  <text x="493.3" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8000</text>
  <line x1="578.7" y1="270" x2="578.7" y2="275" class="f-plain"/>
  <text x="578.7" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10,000</text>
  <line x1="365.3" y1="34" x2="365.3" y2="270" class="f-line" style="stroke-dasharray:4 4"/>
  <text x="365.3" y="28.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Tier4InvocationThreshold = 5000</text>
  <polyline points="158.6,101.2 172.4,106.1 186.8,108.8 201.5,107.7 215.8,106.6 230.3,108.0 244.8,106.9 259.3,108.7 273.2,100.1 287.0,108.0 301.6,108.4 316.3,108.4 330.8,107.0 345.3,108.5 359.9,108.0 372.5,85.9 383.5,89.1 394.5,86.5 405.4,88.6 416.2,85.2 427.0,87.1 438.1,90.9 449.1,84.4 459.8,87.3" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="158.6" cy="101.2" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="172.4" cy="106.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="186.8" cy="108.8" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="201.5" cy="107.7" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="215.8" cy="106.6" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="230.3" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="244.8" cy="106.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="259.3" cy="108.7" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="273.2" cy="100.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="287.0" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="301.6" cy="108.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="316.3" cy="108.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="330.8" cy="107.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="345.3" cy="108.5" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="359.9" cy="108.0" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="372.5" cy="85.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="383.5" cy="89.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="394.5" cy="86.5" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="405.4" cy="88.6" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="416.2" cy="85.2" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="427.0" cy="87.1" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="438.1" cy="90.9" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="449.1" cy="84.4" r="2.6" style="fill:var(--muted);stroke:none"/>
  <circle cx="459.8" cy="87.3" r="2.6" style="fill:var(--muted);stroke:none"/>
  <text x="146.0" y="105.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">LinkedList</text>
  <polyline points="165.6,152.4 193.3,154.9 221.8,156.6 250.5,155.7 277.6,147.8 304.9,157.3 333.0,152.0 357.7,138.4 372.9,65.4 380.9,65.2 388.7,61.2 396.5,66.2 404.5,65.2 412.7,67.4" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="165.6" cy="152.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="193.3" cy="154.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="221.8" cy="156.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="250.5" cy="155.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="277.6" cy="147.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="304.9" cy="157.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="333.0" cy="152.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="357.7" cy="138.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.9" cy="65.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="380.9" cy="65.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="388.7" cy="61.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="396.5" cy="66.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="404.5" cy="65.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="412.7" cy="67.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <text x="146.0" y="156.4" text-anchor="end" class="f-mono f-ink" style="font-size:11px">LongStream.iterate</text>
  <polyline points="169.8,171.4 206.1,174.5 242.3,170.7 277.4,170.2 313.2,173.6 349.5,172.3 385.5,172.4 423.5,179.6 462.1,175.0 501.1,180.9 539.9,174.2 576.6,173.0" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="169.8" cy="171.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="206.1" cy="174.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="242.3" cy="170.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="277.4" cy="170.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="313.2" cy="173.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="349.5" cy="172.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="385.5" cy="172.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="423.5" cy="179.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="462.1" cy="175.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="501.1" cy="180.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="539.9" cy="174.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.6" cy="173.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <text x="146.0" y="175.4" text-anchor="end" class="f-mono f-ink" style="font-size:11px">ArrayList</text>
  <polyline points="169.2,169.2 199.7,150.1 229.2,165.7 264.0,173.8 300.8,174.0 337.1,171.9 364.8,128.4 378.6,67.2 386.9,69.7 395.4,69.4 403.6,65.4 411.9,69.5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="169.2" cy="169.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="199.7" cy="150.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="229.2" cy="165.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="264.0" cy="173.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="300.8" cy="174.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="337.1" cy="171.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="364.8" cy="128.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="378.6" cy="67.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="386.9" cy="69.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="395.4" cy="69.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="403.6" cy="65.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="411.9" cy="69.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <polyline points="168.7,252.7 201.2,248.6 235.7,260.5 273.0,260.5 310.0,259.2 331.9,142.6 338.2,124.5 343.9,128.4 349.8,129.0 355.8,132.4 361.8,128.9 367.8,132.8" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="168.7" cy="252.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="201.2" cy="248.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="235.7" cy="260.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="273.0" cy="260.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="310.0" cy="259.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="331.9" cy="142.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="338.2" cy="124.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="343.9" cy="128.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="349.8" cy="129.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="355.8" cy="132.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="361.8" cy="128.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="367.8" cy="132.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <text x="146.0" y="256.7" text-anchor="end" class="f-mono f-ink" style="font-size:11px">long[]</text>
  <text x="670.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ms per sum</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">calls so far</text>
</svg>
<figcaption>The sequential sum of one million, one point per iteration, no warmup. Accent: ArrayList, 2 starts of the JVM. Calls between the iterations are not counted on the axis.</figcaption>
</figure>

The sequential long[] needs 0.34 ms, after about 4200 calls it starts to need 2.2 and stayed there as long as I watched. LongStream.iterate goes from 1.5 to 5.3, LinkedList from 2.9 to 3.9, the range from 0.39 to 2.4. ArrayList stayed at 1.2 for 10,000 calls in one start of the JVM and went up to 5.0 in another.

`Tier4InvocationThreshold` in this JVM is 5000. With `-XX:+PrintCompilation` the jump of long[] comes together with C2 compiling `SrcBench::seq` and `Spliterator$OfLong::forEachRemaining`, the methods around the loop. The loop had its own compiled version long before. Why the new code is several times slower I don't know, I did not read the assembly.

A parallel sum over ArrayList jumps as well, from 1.3 to 4.1 ms, but already after about 1150 calls. Each call has 4 pieces, so I think the methods around the loop simply get their 5000 sooner. My table compares a parallel ArrayList after the jump with a sequential one before it. With both before the jump it is 1.3 against 1.2, about a draw. One parallel fork of 6 gave 0.75 and I have no explanation for it.

For the range it is the other way round. Its win of 0.69 is against the sequential code after the jump. Before it the sequential sum takes 0.39 and my best parallel iteration is 0.64. The rule of 2 runs did not protect me, the warmup was 3.5 seconds in one and 1.2 in the other.

LinkedList and LongStream.iterate lose on either side of the jump, their 6.88 and 12.29 ms are more than both sequential numbers. With TreeSet 5000 calls take about 2 minutes and I did not wait.

## How it is cut

I wrapped the spliterators and wrote down the pieces. HashSet gave 4 pieces, 2 of them empty: the hash of a small Long is the number itself, so a million consecutive numbers fill only the lower half of the table.

LinkedList can only be walked. Its `trySplit` copies elements to an array, 1024 the first time, then 2048, then 3072 and so on. I got 38 such batches and the rest of 241,216 elements. While a batch is being copied, the other thread has only the pieces cut before it.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Pieces of a million elements drawn to one scale. ArrayList: 4 equal pieces of 250,000. HashSet: 524,287 and 475,713 plus 2 empty pieces. LinkedList: 38 batches growing from 1024 to 38,912 and the rest of 241,216. Stream.iterate: 62 batches growing from 1024 to 63,488, together 1,999,872, the part after the first million is not needed.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">ArrayList</text>
  <rect x="20.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="100.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="180.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="260.00" y="28.0" width="80.00" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="43.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">4 × 250,000</text>
  <text x="20.0" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">HashSet</text>
  <rect x="20.00" y="90.0" width="167.77" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="187.77" y="90.0" width="152.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <text x="352.0" y="105.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2 more pieces are empty</text>
  <text x="20.0" y="144.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">LinkedList</text>
  <rect x="20.00" y="152.0" width="0.33" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="20.33" y="152.0" width="0.66" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="20.98" y="152.0" width="0.98" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="21.97" y="152.0" width="1.31" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="23.28" y="152.0" width="1.64" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="24.92" y="152.0" width="1.97" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="26.88" y="152.0" width="2.29" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="29.18" y="152.0" width="2.62" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="31.80" y="152.0" width="2.95" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="34.75" y="152.0" width="3.28" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="38.02" y="152.0" width="3.60" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="41.63" y="152.0" width="3.93" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="45.56" y="152.0" width="4.26" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="49.82" y="152.0" width="4.59" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="54.41" y="152.0" width="4.92" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="59.32" y="152.0" width="5.24" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="64.56" y="152.0" width="5.57" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="70.14" y="152.0" width="5.90" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="76.03" y="152.0" width="6.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="82.26" y="152.0" width="6.55" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="88.81" y="152.0" width="6.88" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="95.69" y="152.0" width="7.21" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="102.90" y="152.0" width="7.54" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="110.44" y="152.0" width="7.86" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="118.30" y="152.0" width="8.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="126.50" y="152.0" width="8.52" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="135.02" y="152.0" width="8.85" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="143.86" y="152.0" width="9.18" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="153.04" y="152.0" width="9.50" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="162.54" y="152.0" width="9.83" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="172.37" y="152.0" width="10.16" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="182.53" y="152.0" width="10.49" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="193.02" y="152.0" width="10.81" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="203.83" y="152.0" width="11.14" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="214.97" y="152.0" width="11.47" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="226.44" y="152.0" width="11.80" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="238.23" y="152.0" width="12.12" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="250.36" y="152.0" width="12.45" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="262.81" y="152.0" width="77.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <text x="352.0" y="167.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">rest 241,216</text>
  <text x="20.0" y="206.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">Stream.iterate</text>
  <rect x="20.00" y="214.0" width="0.33" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="20.33" y="214.0" width="0.66" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="20.98" y="214.0" width="0.98" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="21.97" y="214.0" width="1.31" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="23.28" y="214.0" width="1.64" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="24.92" y="214.0" width="1.97" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="26.88" y="214.0" width="2.29" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="29.18" y="214.0" width="2.62" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="31.80" y="214.0" width="2.95" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="34.75" y="214.0" width="3.28" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="38.02" y="214.0" width="3.60" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="41.63" y="214.0" width="3.93" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="45.56" y="214.0" width="4.26" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="49.82" y="214.0" width="4.59" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="54.41" y="214.0" width="4.92" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="59.32" y="214.0" width="5.24" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="64.56" y="214.0" width="5.57" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="70.14" y="214.0" width="5.90" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="76.03" y="214.0" width="6.23" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="82.26" y="214.0" width="6.55" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="88.81" y="214.0" width="6.88" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="95.69" y="214.0" width="7.21" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="102.90" y="214.0" width="7.54" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="110.44" y="214.0" width="7.86" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="118.30" y="214.0" width="8.19" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="126.50" y="214.0" width="8.52" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="135.02" y="214.0" width="8.85" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="143.86" y="214.0" width="9.18" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="153.04" y="214.0" width="9.50" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="162.54" y="214.0" width="9.83" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="172.37" y="214.0" width="10.16" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="182.53" y="214.0" width="10.49" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="193.02" y="214.0" width="10.81" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="203.83" y="214.0" width="11.14" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="214.97" y="214.0" width="11.47" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="226.44" y="214.0" width="11.80" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="238.23" y="214.0" width="12.12" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="250.36" y="214.0" width="12.45" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="262.81" y="214.0" width="12.78" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="275.59" y="214.0" width="13.11" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="288.70" y="214.0" width="13.43" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="302.13" y="214.0" width="13.76" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="315.90" y="214.0" width="14.09" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.65"/>
  <rect x="329.99" y="214.0" width="10.01" height="22.0" style="fill:var(--muted);stroke:none;opacity:0.35"/>
  <rect x="340.00" y="214.0" width="4.40" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="344.40" y="214.0" width="14.75" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="359.15" y="214.0" width="15.07" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="374.22" y="214.0" width="15.40" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="389.62" y="214.0" width="15.73" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="405.35" y="214.0" width="16.06" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="421.41" y="214.0" width="16.38" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="437.79" y="214.0" width="16.71" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="454.50" y="214.0" width="17.04" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="471.54" y="214.0" width="17.37" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="488.91" y="214.0" width="17.69" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="506.60" y="214.0" width="18.02" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="524.63" y="214.0" width="18.35" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="542.98" y="214.0" width="18.68" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="561.66" y="214.0" width="19.01" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="580.66" y="214.0" width="19.33" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="599.99" y="214.0" width="19.66" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <rect x="619.65" y="214.0" width="19.99" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.3"/>
  <rect x="639.64" y="214.0" width="20.32" height="22.0" style="fill:var(--accent);stroke:none;opacity:0.6"/>
  <line x1="340" y1="210" x2="340" y2="246" class="f-line"/>
  <text x="340.0" y="260.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1,000,000 needed</text>
  <text x="660.0" y="260.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">1,999,872 computed</text>
</svg>
<figcaption>The pieces that 2 threads got, to one scale. For Stream.iterate this is the most frequent case, the 62 batches are restored from the counter plus the first number. The part after the line is computed and thrown away.</figcaption>
</figure>

`Stream.iterate` is cut by the same arithmetic, but it has no known size and the batches go on. In every run of the counter the number of calls is `1024*k*(k+1)/2 - 1` with a whole k. For a million k = 44 is enough. With one worker I got 62 in 26 runs of 30. I started the same program 2 more times, the second start gave 62 in 28 runs and the third only in 10, the rest went down to 44. So the number in the title came up 64 times out of 90 and it is the most I saw. With 3 workers it was 45 in 29 runs of 30. `LongStream.iterate` computes one step ahead, its counter shows 1,999,872, in 30, 23 and 21 runs of the 3 starts.

As I read the source, the elements are computed by the thread that cuts and it goes on until it learns that the limit is reached. I did not find out why exactly 62. The javadoc of `limit` does warn that it can be quite expensive on ordered parallel pipelines, I had read that and thought of buffers.

## Length

Then a range where every element costs 0 or 50 rounds of xorshift, roughly 5 and 90 ns in run 1. On 10 cheap elements the parallel sum was 13.78 and 12.47 times slower, 1.2 µs against 0.1. At 1000 cheap ones it still lost, 1.90 and 1.44, but 1000 expensive ones gave a draw, 1.13 and 0.84. So the length alone does not decide. I expected the cheap body to catch up near 10,000 elements and there it has 0.68 and 0.83. The best ratio of the grid is 0.58 and the other run gave 0.95 for the same cell.

## A neighbour that sleeps

The common pool is one for the whole JVM. A computation that takes 162 ms sequentially took 111 ms in parallel. Then another thread ran a parallel `forEach` over 8 sleeps of 400 ms. Its caller slept, the only worker of the pool slept too and my parallel stream took 194 ms. The sequential version next to the same neighbour took 200.

Then 20 sleeps of 50 ms, as if they were requests. Sequentially it is 1003 ms, with `parallel()` 501, with a plain executor of 20 threads 93. The trick with your own `ForkJoinPool(20)` gave 258. Only 4 threads of the 20 worked, with 5 sleeps each.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="20 sleeps of 50 milliseconds drawn as blocks on threads. Common pool with one worker: 2 threads with 10 sleeps each, measured 501 ms. Own ForkJoinPool of 20: 4 threads with 5 sleeps each and 16 idle, measured 258 ms. Executor of 20 threads: one sleep each, measured 93 ms.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel(), common pool: 2 threads, 501 ms</text>
  <rect x="20.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="295.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="350.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="405.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="460.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="515.00" y="34.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="295.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="350.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="405.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="460.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="515.00" y="51.0" width="52.00" height="14.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="20.0" y="98.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">parallel() in ForkJoinPool(20): 4 threads, 258 ms</text>
  <rect x="20.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="108.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="125.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="142.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="75.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="130.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="185.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <rect x="240.00" y="159.0" width="52.00" height="14.0" style="fill:var(--accent);stroke:none;opacity:0.55"/>
  <text x="20.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">16 more threads get nothing</text>
  <text x="20.0" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">executor: 20 threads, 93 ms</text>
  <rect x="20.00" y="232.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="239.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="246.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="253.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="260.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="267.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="274.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="281.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="288.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="295.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="302.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="309.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="316.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="323.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="330.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="337.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="344.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="351.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="358.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="20.00" y="365.0" width="52.00" height="4.0" style="fill:var(--muted);stroke:none;opacity:0.55"/>
</svg>
<figcaption>20 sleeps of 50 ms, one block is one sleep, one row is one thread. The times are measured medians.</figcaption>
</figure>

I found the answer in the source of `AbstractTask`: `LEAF_TARGET` is `ForkJoinPool.getCommonPoolParallelism() << 2`. The stream runs in my pool, but it is cut for the common one. With the common parallelism of 3 the same code used all 20 threads and took 72 ms.

## What I did not check

I did not check more than 2 cores in the benchmarks, other garbage collectors or other builds of the JDK. The long runs are one or 2 starts per source, so I know that the jump exists and I don't know how often it does not happen. All the sleeps are just sleeps and a real request may wait for somebody else. For me `parallel()` now goes in after a measurement, but so far I only have numbers for sums.
