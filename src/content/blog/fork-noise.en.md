---
title: "My README said this benchmark needs a 2× difference to see anything. Given a known delay, it saw 3%"
description: "In the README of my preview benchmark I wrote that the harness could not tell apart 2 strategies within 2× of each other. I gave it a busy wait of known size on PostgreSQL 16.14 and OpenJDK 21: 10 JVMs per delay, 300 pairs each. Paired inside one JVM it saw 25 µs on 800 (3%) in 10 of 10 JVMs, while the JVM medians differed by a third. Comparing 2 separate runs got the sign of a 100 µs delay right in 68 of 90 cases and the blocked order of the first version called a 50 µs slower block faster in 7 of 10."
date: 2026-09-06
lang: en
translationKey: fork-noise
tags: ["performance", "statistics"]
---
In August I measured what a live preview costs if you build it on a transaction rollback and put the harness on GitHub as [`preview-cost`](https://github.com/dimhold/preview-cost). Over 4,500 pairs the rollback was slower than an in memory copy every time, with a median difference of 6 to 7 ms. In the README I also wrote a paragraph about noise. At 40 plans the medians of 5 separate JVMs ranged from 5.43 to 7.79 ms on identical inputs. From that I concluded that if the 2 strategies had been "within 2× of each other, this harness could not have told them apart." The same sentence added that nobody else's single run could do it either.

I liked that sentence because it sounded modest. I never checked it. It is a claim about what the harness can see. That can be measured, if the harness gets an effect whose size I already know.

## A delay with a known size

Every pair runs the same rollback preview from the repository twice. The second run gets a busy wait on top, `Thread.onSpinWait()` until `System.nanoTime()` passes a fixed deadline. So it costs `d` microseconds more, plus a few tens of nanoseconds. I tried 8 values of `d` from 0 to 500 µs. Each one got 10 fresh JVMs with 300 pairs in each, after 80 pairs of warmup. Inside a JVM the plain and the delayed preview swap order at random every pair, as in the original `Bench`.

This time it ran against PostgreSQL 16.14 installed locally instead of Postgres in Docker, on OpenJDK 21.0.12.1 in a virtual machine with 4 vCPU. The repository asks Gradle for JDK 25, but the classes I needed use nothing newer than records and text blocks, so I compiled them with plain `javac` next to a new runner. On this setup a rollback preview costs between 0.7 and 1.1 ms instead of 6.5. The original comparison still holds: rollback was slower in 2,998 of 3,000 pairs.

The spread came back too. With `d = 0` both previews in a pair are identical and the medians of the 10 JVMs went from 746 to 1,005 µs. That is a third of the value for the same command on the same machine. The in memory copy in the original comparison had one JVM at 278 µs while the other 9 sat between 77 and 102.

<figure class="fig">
<svg viewBox="0 0 640 272" role="img" aria-label="Two panels, one row per JVM, 10 rows. Left: the median of the plain rollback preview in each JVM, spread from 743 to 956 microseconds. Right: the median of the per pair differences with its 95% interval, between 8 and 52 microseconds, every interval above zero, around a dashed line at the true 25.">
  <text x="40" y="22" class="f-mono f-muted" style="font-size:11px">median of the plain preview, µs</text>
  <text x="380" y="22" class="f-mono f-muted" style="font-size:11px">paired difference, µs</text>
  <line x1="40" y1="38" x2="40" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="40" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">700</text>
  <line x1="136.66666666666666" y1="38" x2="136.66666666666666" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="136.66666666666666" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="233.33333333333331" y1="38" x2="233.33333333333331" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="233.33333333333331" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">900</text>
  <line x1="330" y1="38" x2="330" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="330" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="412.85714285714283" y1="38" x2="412.85714285714283" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="412.85714285714283" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="495" y1="38" x2="495" y2="244" class="f-line" style="stroke-dasharray:4 3;stroke:var(--accent)"/>
  <text x="495" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="577.1428571428571" y1="38" x2="577.1428571428571" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="577.1428571428571" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="499" y="34" class="f-mono f-accent" style="font-size:11px">true +25</text>
  <circle cx="81.1" cy="46" r="4.5" style="fill:var(--ink)"/>
  <line x1="470.9" y1="46" x2="535.9" y2="46" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="506.5" cy="46" r="4" style="fill:var(--accent)"/>
  <circle cx="112.1" cy="66" r="4.5" style="fill:var(--ink)"/>
  <line x1="462.2" y1="66" x2="525.0" y2="66" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="496.4" cy="66" r="4" style="fill:var(--accent)"/>
  <circle cx="112.6" cy="86" r="4.5" style="fill:var(--ink)"/>
  <line x1="448.6" y1="86" x2="552.3" y2="86" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="498.3" cy="86" r="4" style="fill:var(--accent)"/>
  <circle cx="129.9" cy="106" r="4.5" style="fill:var(--ink)"/>
  <line x1="459.7" y1="106" x2="533.9" y2="106" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="487.8" cy="106" r="4" style="fill:var(--accent)"/>
  <circle cx="148.9" cy="126" r="4.5" style="fill:var(--ink)"/>
  <line x1="460.3" y1="126" x2="523.8" y2="126" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="492.7" cy="126" r="4" style="fill:var(--accent)"/>
  <circle cx="149.2" cy="146" r="4.5" style="fill:var(--ink)"/>
  <line x1="452.6" y1="146" x2="581.2" y2="146" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="505.9" cy="146" r="4" style="fill:var(--accent)"/>
  <circle cx="181.7" cy="166" r="4.5" style="fill:var(--ink)"/>
  <line x1="441.6" y1="166" x2="522.0" y2="166" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="480.5" cy="166" r="4" style="fill:var(--accent)"/>
  <circle cx="223.5" cy="186" r="4.5" style="fill:var(--ink)"/>
  <line x1="468.4" y1="186" x2="578.0" y2="186" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="523.1" cy="186" r="4" style="fill:var(--accent)"/>
  <circle cx="256.5" cy="206" r="4.5" style="fill:var(--ink)"/>
  <line x1="463.1" y1="206" x2="512.1" y2="206" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="484.8" cy="206" r="4" style="fill:var(--accent)"/>
  <circle cx="287.5" cy="226" r="4.5" style="fill:var(--ink)"/>
  <line x1="439.5" y1="226" x2="530.2" y2="226" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="490.2" cy="226" r="4" style="fill:var(--accent)"/>
</svg>
<figcaption>By construction the delayed preview is 25 µs slower. The JVMs disagree about the plain one by about 210 µs, but in each of them the pairs put the difference above zero.</figcaption>
</figure>

## What one JVM can see

For every JVM I took the per pair differences and a bootstrap interval on their median, 2,000 resamples. I count the delay as seen when the whole interval sits above zero.

| true delay | JVMs that saw it | all 3,000 pairs, median and 95% interval |
|---|---|---|
| 0 µs | 0 of 10 | 0.6 µs [−3.1, 3.7] |
| 5 µs | 3 of 10 | 8.1 µs [5.1, 11.1] |
| 10 µs | 6 of 10 | 12.2 µs [8.1, 15.3] |
| 25 µs | 10 of 10 | 25.0 µs [21.5, 28.7] |

25 µs on top of roughly 800 is 3% and all 10 JVMs found it. The medians of the plain preview in those same JVMs differed by about 210 µs. At no delay did a JVM put its whole interval below zero, the A/A run included. So for this harness my sentence was about 30 times too cautious, 2× against 3%.

The pairing explains it. Across the 10 JVMs the median of the plain preview and the median of the delayed one move together. The correlation is between 0.95 and 0.996, depending on the delay. My guess is that whatever makes one JVM slower is paid by both halves of a pair, so the difference cancels most of it.

## Where the sentence is right

Its second half is right and it describes a different procedure. That procedure is the one I use most of the time: run the thing, change something, run it again, compare 2 medians. I simulated it by taking the plain median from one JVM and the delayed median from another. 10 JVMs give 90 such combinations.

<figure class="fig">
<svg viewBox="0 0 640 154" role="img" aria-label="A grid with 3 rows and 8 columns for true delays of 0, 5, 10, 25, 50, 100, 250 and 500 microseconds. Each cell says how often the method reported the delayed preview as slower. Paired in one JVM, out of 10: 0, 3, 6, 10, 10, 10, 10, 10. 2 separate runs, out of 90: 47, 50, 46, 52, 62, 68, 90, 90. Blocks in one JVM, out of 10: 2, 3, 0, 4, 3, 6, 10, 10. At delay 0 any report is false.">
  <text x="170" y="18" class="f-mono f-muted" style="font-size:11px">true delay, µs</text>
  <text x="198" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="254" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">5</text>
  <text x="310" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10</text>
  <text x="366" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">25</text>
  <text x="422" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50</text>
  <text x="478" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">100</text>
  <text x="534" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">250</text>
  <text x="590" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">500</text>
  <text x="160" y="65" text-anchor="end" class="f-mono f-ink" style="font-size:11px">paired, one JVM</text>
  <rect x="172" y="46" width="52" height="30" style="fill:var(--muted);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="228" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="340" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="396" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="452" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="508" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <text x="160" y="99" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 separate runs</text>
  <rect x="172" y="80" width="52" height="30" style="fill:var(--muted);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">47/90</text>
  <rect x="228" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.34;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50/90</text>
  <rect x="284" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">46/90</text>
  <rect x="340" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.35;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">52/90</text>
  <rect x="396" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.40;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">62/90</text>
  <rect x="452" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.44;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">68/90</text>
  <rect x="508" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <rect x="564" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <text x="160" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">blocks, one JVM</text>
  <rect x="172" y="114" width="52" height="30" style="fill:var(--muted);fill-opacity:0.16;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2/10</text>
  <rect x="228" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="340" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.26;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">4/10</text>
  <rect x="396" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="452" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="508" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
</svg>
<figcaption>How often each method said the delayed preview is slower. Paired counts a JVM only when the whole 95% interval is above zero; the other 2 rows count the sign of a difference of medians. At 0 µs both previews are identical and every count is a false report.</figcaption>
</figure>

At 100 µs, which is 12% of the value, 68 of 90 comparisons got the sign right. Their estimates went from −157 to +385 µs. At 50 µs it was 62 of 90 and with no delay at all 47 of 90 said the second one is slower. Only at 250 µs, close to the spread between JVMs, did all 90 point the right way.

## The first version

The first version of the harness measured all of the rollback previews and then all of the in memory ones, inside one JVM. It went out as a gist on 14 August with one median per configuration, 4.85, 4.96 and 7.79 ms. Less than 2 hours later I had replaced it with the paired one, because I knew the blocked order was wrong in principle. I did not know by how much, so I ran that order too. My runner keeps the warmup of the new version, so it repeats the order of the old one and not all of it.

In the A/A case the second block came out faster than the first in 8 of 10 JVMs, by 119 to 173 µs. In the other 2 it was slower by 10 and 16. With a true delay of 50 µs on the second block, 7 of 10 JVMs called it faster. At 100 µs it was 4 of 10. I can't separate the order from the time the JVM had already spent running, since in this design they are the same thing. Next to the 6 ms of August a bias of this size would not change anything, but I never measured it on that setup.

## What I did not check

I don't know why the JVMs differ by a third. I did not look at JIT logs or at what else runs on this virtual machine. There is also a small thing I cannot explain. At 250 and 500 µs the pooled estimate is 244.7 and 488.5 and neither interval reaches the true value. A busy wait cannot finish before its deadline, so part of the difference goes missing somewhere else. My runner does not record which preview went first, so I can't say where. At 5 µs the estimate is 8.1. That is above the truth and I can't explain it either. All the numbers come from one pass of the grid, not from a median of several passes.

None of this is new as a method. Georges, Buytaert and Eeckhout argued for intervals over several VM invocations in 2007. Kalibera and Jones worked out in 2013 how many repetitions each level needs. What I checked is my own sentence on my own code. If I wrote that README line today, it would talk about 2 separate runs. On this setup they could not tell apart things within about 30% of each other. Inside one JVM 25 µs was enough.
