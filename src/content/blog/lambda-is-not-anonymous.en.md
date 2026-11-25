---
title: "One lambda loads 126 more classes than one anonymous class"
description: "I wrote the same 100 functions as anonymous classes and as lambdas on the release build of Java 8. The lambdas gave one class file in place of 101, but 126 more loaded classes. The first lambda took 45.6 ms. Also how the word final changes the number of objects and who keeps the outer object in memory."
date: 2014-04-06
lang: en
translationKey: lambda-is-not-anonymous
tags: ["compilers", "performance"]
---

I wrote the same 100 small functions in 2 ways, put each version into one method and compiled both. After `javac` the directory with anonymous classes had 101 files and 43,623 bytes. The directory with lambdas had one file and 11,977 bytes. Then I ran both with `-verbose:class` and counted the lines that start with `[Loaded`. Anonymous classes: 477. Lambdas: 603.

Before the run I had written down that lambdas load more classes when N is small, by 100 I expected them to win it back. I explained a lambda to myself as a short way to write an anonymous class, it is comfortable and it almost never gets in the way, so I never looked under it. Java 8 was released on March 18 and I have no excuse now.

The design is not a secret. Brian Goetz described it in "Translation of Lambda Expressions" in 2012 and Sergey Kuksenko showed a performance study at the JVM Language Summit last year, with the cost of the first linkage in it. I only wanted my own numbers on the release build.

## Setup

OpenJDK 1.8.0 build b132, VM 25.0-b70, `javac` from the same build with default flags, 2 cores of a virtual machine. The test class has N places like `f = x -> x + 1000; s = f.applyAsInt(s);` with a different constant in each. The other version has `new IntUnaryOperator() { ... }` in the same places. N is 0, 1, 10 and 100.

## What javac writes

For an anonymous class `javac` makes the file `Sites$1.class` and puts `new` into the code around. For a lambda it makes a private static method `lambda$go$0` with the body and one `invokedynamic` instruction. It points to `LambdaMetafactory.metafactory`. At this moment there is no class for the future object, the JVM builds it when the instruction is executed for the first time.

With `-Djdk.internal.lambda.dumpProxyClasses=dir` it can be saved and opened. The class is 259 bytes: an empty constructor and an `applyAsInt` that calls `Sites.lambda$go$0`.

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Two ways. Anonymous class: javac writes Sites.class with new Sites$1 and the file Sites$1.class with the body, the JVM loads the file. Lambda: javac writes one Sites.class with an invokedynamic instruction and the method lambda$go$0 with the body. At the first execution LambdaMetafactory builds the class Sites$$Lambda$1 of 259 bytes in memory and this class calls back lambda$go$0.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">written by javac</text>
  <text x="430.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">in the memory of the JVM</text>
  <text x="20.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">anonymous class</text>
  <rect x="20" y="56" width="280" height="42" class="f-box"/>
  <text x="32.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="90.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">new Sites$1</text>
  <rect x="20" y="108" width="280" height="42" class="f-box"/>
  <text x="32.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites$1.class</text>
  <text x="32.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">applyAsInt: x + 1000</text>
  <text x="290.0" y="125.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">body is here</text>
  <rect x="430" y="108" width="230" height="42" class="f-box"/>
  <text x="442.0" y="134.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">Sites$1</text>
  <line x1="300" y1="129" x2="430" y2="129" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,129 423.6,126.3 423.6,131.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="121.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">loads</text>
  <line x1="20" y1="166" x2="660" y2="166" class="f-plain"/>
  <text x="20.0" y="192.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">lambda</text>
  <rect x="20" y="204" width="280" height="112" class="f-box" style="stroke:var(--accent)"/>
  <text x="32.0" y="223.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sites.class</text>
  <text x="32.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">invokedynamic #0:applyAsInt</text>
  <line x1="32" y1="262" x2="288" y2="262" class="f-plain"/>
  <text x="32.0" y="284.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">lambda$go$0</text>
  <text x="290.0" y="284.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">body is here</text>
  <text x="32.0" y="302.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">x + 1000</text>
  <rect x="430" y="224" width="230" height="32" class="f-box"/>
  <text x="442.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">LambdaMetafactory</text>
  <rect x="430" y="278" width="230" height="38" class="f-box" style="stroke:var(--accent)"/>
  <text x="442.0" y="301.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">Sites$$Lambda$1, 259 B</text>
  <line x1="300" y1="240" x2="430" y2="240" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="430,240 423.6,237.3 423.6,242.7" style="fill:var(--muted);stroke:none"/>
  <text x="365.0" y="232.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">first run</text>
  <line x1="540" y1="256" x2="540" y2="278" style="stroke:var(--muted);stroke-width:1.2"/>
  <polygon points="540,278 542.7,271.6 537.3,271.6" style="fill:var(--muted);stroke:none"/>
  <line x1="430" y1="297" x2="300" y2="297" style="stroke:var(--accent);stroke-width:1.2"/>
  <polygon points="300,297 306.4,299.7 306.4,294.3" style="fill:var(--accent);stroke:none"/>
  <text x="365.0" y="289.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">calls</text>
</svg>
<figcaption>Where the body is and when the class is made.</figcaption>
</figure>

So 100 lambdas are still 100 classes, only they are made later. Their dumped files take 26,082 bytes. Together with the main class it is 38,059 bytes against 43,623. The big saving is in the jar: 4,147 bytes against 44,109.

My note before the run also said that on disk a lambda always wins. With one lambda it does not. The single class file is 1,096 bytes and the 2 files with an anonymous class are 968.

## Where 126 comes from

An empty program loads 374 classes here. One anonymous class adds 2 to that, the class itself and the interface `IntUnaryOperator`. One lambda adds 128. Most of it is the machine that builds the lambda. 57 of the 128 are from `java.lang.invoke` and 13 from the ASM library inside the JDK, the 259 bytes are written with it. 35 of the 128 exist in no file at all, they are generated during the run.

I thought that this price is paid once and then lambdas win as N grows. The first half is true. But each new lambda costs a class too, the same as an anonymous one, so the difference stays at 126 for 1, 10 and 100 places. I was wrong about the second half. That it is exactly 126 every time is partly luck. On each step both sides also loaded one more class of the JDK and it was a different one: `sun.misc.Cleaner` in the run with 100 anonymous classes and one more `LambdaForm` in the run with lambdas.

<figure class="fig">
<svg viewBox="0 0 680 248" role="img" aria-label="Bars for N = 1, 10 and 100 places. N = 1: bytes on disk 968 for anonymous classes and 1,096 for lambdas, loaded classes over the empty program 2 and 128; N = 10: bytes on disk 4,831 for anonymous classes and 2,077 for lambdas, loaded classes over the empty program 12 and 138; N = 100: bytes on disk 43,623 for anonymous classes and 11,977 for lambdas, loaded classes over the empty program 103 and 229.">
  <text x="70.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">.class bytes on disk</text>
  <text x="400.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">classes loaded, minus the empty program</text>
  <text x="10.0" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 1</text>
  <rect x="70" y="34" width="4.2" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.2" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">968</text>
  <rect x="70" y="54" width="4.8" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="80.8" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1,096</text>
  <rect x="400" y="34" width="1.9" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.9" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <rect x="400" y="54" width="123.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="529.0" y="66.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">128</text>
  <text x="10.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 10</text>
  <rect x="70" y="96" width="21.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="97.0" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4,831</text>
  <rect x="70" y="116" width="9.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="85.0" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">2,077</text>
  <rect x="400" y="96" width="11.5" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12</text>
  <rect x="400" y="116" width="132.6" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="538.6" y="128.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">138</text>
  <text x="10.0" y="180.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N = 100</text>
  <rect x="70" y="158" width="190.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="266.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">43,623</text>
  <rect x="70" y="178" width="52.2" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="128.2" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11,977</text>
  <rect x="400" y="158" width="99.0" height="16" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="505.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103</text>
  <rect x="400" y="178" width="220.0" height="16" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="626.0" y="190.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">229</text>
  <rect x="70" y="224" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="88.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">anonymous class</text>
  <rect x="260" y="224" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="234.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">lambda</text>
</svg>
<figcaption>Left the files, right the running JVM. The gap on the right is 126 in every row.</figcaption>
</figure>

## The first call

Then time. Each number in the figure is the median of 30 fresh processes. A process evaluates the expression and calls the result one time, then does the same with another expression, then repeats the last one.

An anonymous class takes 0.33 ms the first time. The first lambda takes 45.6 ms, with 80% of the runs between 37.8 and 54.0. A second lambda takes 0.28 ms against 0.23 ms for a second anonymous class. After the first one they are close, I would not choose between them for this reason.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Dot plot on a logarithmic time scale. first place: anonymous class 332.5 µs, lambda 45591.1 µs; another place: anonymous class 228.6 µs, lambda 278.3 µs; same place again: anonymous class 0.5 µs, lambda 5.5 µs.">
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">evaluation and one call, log scale</text>
  <line x1="219.5" y1="28" x2="219.5" y2="200" class="f-plain"/>
  <text x="219.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 µs</text>
  <line x1="301.9" y1="28" x2="301.9" y2="200" class="f-plain"/>
  <text x="301.9" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 µs</text>
  <line x1="384.4" y1="28" x2="384.4" y2="200" class="f-plain"/>
  <text x="384.4" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 µs</text>
  <line x1="466.8" y1="28" x2="466.8" y2="200" class="f-plain"/>
  <text x="466.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 ms</text>
  <line x1="549.3" y1="28" x2="549.3" y2="200" class="f-plain"/>
  <text x="549.3" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 ms</text>
  <line x1="631.8" y1="28" x2="631.8" y2="200" class="f-plain"/>
  <text x="631.8" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 ms</text>
  <text x="10.0" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">first place</text>
  <line x1="418.9" y1="48" x2="434.0" y2="48" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="427.4" cy="48" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="443.0" y="52.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0.33 ms</text>
  <line x1="596.9" y1="70" x2="609.7" y2="70" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="603.6" cy="70" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="586.9" y="74.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">45.6 ms</text>
  <text x="10.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">another place</text>
  <line x1="410.7" y1="104" x2="418.3" y2="104" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="414.0" cy="104" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="427.3" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0.23 ms</text>
  <line x1="416.6" y1="126" x2="427.9" y2="126" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="421.0" cy="126" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="436.9" y="130.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0.28 ms</text>
  <text x="10.0" y="175.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">same place again</text>
  <line x1="186.7" y1="160" x2="194.7" y2="160" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="194.7" cy="160" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="203.7" y="164.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0.5 µs</text>
  <line x1="277.8" y1="182" x2="288.1" y2="182" style="stroke:var(--accent);stroke-width:1.5"/>
  <circle cx="280.5" cy="182" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="297.1" y="186.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">5.5 µs</text>
  <circle cx="176" cy="236" r="4.5" style="fill:var(--ink);stroke:none"/>
  <text x="188.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">anonymous class</text>
  <circle cx="366" cy="236" r="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">lambda</text>
</svg>
<figcaption>Medians of 30 fresh processes, the thin lines go from the 10th to the 90th percentile. No class data sharing.</figcaption>
</figure>

The build I used comes without a class data sharing archive, so I suspected that the 45 ms are mostly reading `rt.jar`. I made the archive with `-Xshare:dump` and repeated. The lambda got 45.9 ms. The archive did work, the empty program went from 66 to 51 ms (whole process from a jar, median of 15 runs), but of the 128 additional classes only 26 were in it.

A server will not notice 45 ms, but a small command line tool will. The whole process with 100 lambdas, measured the same way and without the archive, took 170 ms against 103 ms with 100 anonymous classes.

## Which object I get

An anonymous class gives a new object every time. For a lambda the specification (JLS 15.27.4) promises neither a new object nor the same one. I evaluated each expression 1,000 times and counted different objects.

| expression | objects |
|---|---|
| anonymous class | 1,000 |
| `x -> x + 1` | 1 |
| `x -> x + k`, `int k = 5` | 1,000 |
| `x -> x + k`, `final int k = 5` | 1 |
| `x -> x + field` | 1,000 |
| `Identity::sq` (static) | 1 |
| `this::add` | 1,000 |

I like rows 3 and 4. The only difference is the word `final`. With it `k` is a constant variable and the compiler puts 5 into the body, so there is nothing to capture. I did not expect a modifier to change how many objects are created.

The same rule decides who stays in memory. I created 50 objects with 1 MB each, made one callback in each of them, kept only the callbacks and called `System.gc()` 3 times. With an anonymous `Runnable` that does not touch the outer object all 50 stayed alive, through the hidden field `this$0`. With a lambda that does the same work 0 of 50 stayed. But if the lambda reads a field of the outer object, all 50 are back. It captures `this` and the word `this` is not even visible in the source.

## Names

`getClass().isAnonymousClass()` is false for a lambda. Inside its body `this` is the outer object. The name is something like `Who$$Lambda$1/1510467688` and `Class.forName` with this name throws `ClassNotFoundException`. Then I opened `InnerClassLambdaMetafactory` with `javap` to see how the class gets into the JVM and found a call to `Unsafe.defineAnonymousClass`. So it is an anonymous class after all, only in another sense of the word, the one of the VM.

One thing I did not understand at once. My class `Who` has 5 lambdas and I was looking for `lambda$go$0`. The methods were named from `lambda$go$24` to `lambda$go$28`. I compiled 4 files with one command and this `javac` does not restart the counter for the next class. Compiled alone, `Who` gets numbers from 0 to 4. After `Identity.java` it gets from 19 to 23, so the bytes of the class file depend on its neighbours in the command line.

## What I didn't check

Only one build, a later update can load fewer classes. I did not measure the speed of warm code, Kuksenko did it properly. The second evaluation of the same lambda took 5.5 µs against 0.5 for the anonymous class, but it is one call in the interpreter, I would not conclude anything from it. I also don't know which part of the 45 ms is loading, which is linking and which is ASM. And all my lambdas are of one shape, with different interfaces the numbers of additional classes will be different.
