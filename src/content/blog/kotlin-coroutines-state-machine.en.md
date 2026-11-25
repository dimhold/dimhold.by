---
title: "50 parked Kotlin coroutines kept 50 buffers nobody was going to read"
description: "I opened the class files that Kotlin 1.1.1 makes from suspend functions. It is one class instead of 32, but every variable in scope goes into a field. So 50 parked coroutines held 50 dead buffers of 1 MB and a chain of 34 steps became too long for HotSpot to compile."
date: 2017-04-02
lang: en
translationKey: kotlin-coroutines-state-machine
tags: ["compilers", "debugging", "performance"]
---

This is a piece of `javap -p -c` output, the place where a coroutine wakes up:

```
88: aload_0
89: getfield      #35    // Field L$0:Ljava/lang/Object;
92: checkcast     #43    // class "[B"
95: astore_3
```

These 4 instructions take a byte array from a field and put it into local variable 3. Nothing in the method reads variable 3 after that. The source is below, `load` gives an array of 1 MB and `park` suspends until somebody resumes it:

```kotlin
suspend fun plain(id: Int): Int {
    val raw = load(id)
    val sum = checksum(raw)
    park()
    return sum
}
```

Kotlin 1.1 came out a month ago. Its coroutines are usually explained in one phrase, that a suspend function compiles to a state machine. I repeated this phrase myself and never opened the class file. Now I did.

I used the Kotlin 1.1.1 compiler, `kotlinx-coroutines-core` 0.14 and Java 8 on a 2-core virtual machine. Everything is compiled with `-Xcoroutines=enable`. Without the flag it also compiles, but the compiler warns that the feature is experimental at every suspend declaration and every builder call.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Two states of the function plain. State 0 loads raw, counts sum, writes raw to field L$0 and sum to field I$0 and calls park. State 1 reads sum back from I$0 and returns it, and also reads raw back from L$0, which nobody uses. Field L$0 points to an array of 1 MB in the heap while the coroutine is parked.">
  <rect x="10" y="30" width="220" height="104" class="f-box"/>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted">state 0</text>
  <text x="24.0" y="54.0" text-anchor="start" class="f-mono f-ink">raw = load(id)</text>
  <text x="24.0" y="76.0" text-anchor="start" class="f-mono f-ink">sum = checksum(raw)</text>
  <text x="24.0" y="98.0" text-anchor="start" class="f-mono f-ink">label = 1</text>
  <text x="24.0" y="120.0" text-anchor="start" class="f-mono f-ink">park()</text>
  <rect x="10" y="186" width="220" height="84" class="f-box"/>
  <text x="10.0" y="176.0" text-anchor="start" class="f-label f-muted">state 1</text>
  <text x="24.0" y="210.0" text-anchor="start" class="f-mono f-ink">sum = I$0</text>
  <text x="24.0" y="232.0" text-anchor="start" class="f-mono f-accent">raw = L$0</text>
  <text x="24.0" y="254.0" text-anchor="start" class="f-mono f-ink">return sum</text>
  <rect x="330" y="96" width="170" height="104" class="f-box"/>
  <text x="330.0" y="86.0" text-anchor="start" class="f-label f-muted">coroutine object in the heap</text>
  <text x="344.0" y="124.0" text-anchor="start" class="f-mono f-ink">label</text>
  <text x="344.0" y="152.0" text-anchor="start" class="f-mono f-ink">I$0  sum</text>
  <text x="344.0" y="180.0" text-anchor="start" class="f-mono f-accent">L$0  raw</text>
  <line x1="230" y1="82" x2="330" y2="128" class="f-line"/>
  <polyline points="325.5,122.6 330,128 323.0,128.1" class="f-line" style="fill:none"/>
  <line x1="330" y1="148" x2="230" y2="206" class="f-line"/>
  <polyline points="237.0,205.5 230,206 233.9,200.2" class="f-line" style="fill:none"/>
  <line x1="330" y1="176" x2="230" y2="228" class="f-line" style="stroke:var(--accent)"/>
  <polyline points="237.0,227.8 230,228 234.2,222.4" class="f-line" style="fill:none;stroke:var(--accent)"/>
  <line x1="500" y1="176" x2="558" y2="176" class="f-line" style="stroke:var(--accent)"/>
  <polyline points="551.7,173.0 558,176 551.7,179.0" class="f-line" style="fill:none;stroke:var(--accent)"/>
  <rect x="558" y="136" width="112" height="80" style="fill:var(--accent);opacity:0.16;stroke:var(--accent)"/>
  <text x="614.0" y="172.0" text-anchor="middle" class="f-mono f-ink">byte[]</text>
  <text x="614.0" y="194.0" text-anchor="middle" class="f-mono f-ink">1,000,000</text>
  <text x="244.0" y="258.0" text-anchor="start" class="f-label f-accent">nobody reads it</text>
</svg>
<figcaption>The state machine of plain in 1.1.1. Both variables are in scope at park(), so both are saved and restored.</figcaption>
</figure>

## One class per function

First I checked the promise itself. A script wrote the same chain of N steps in 3 styles, where each step takes the result of the previous one and the end sums them all. The blocking style is plain calls, the callback style is nested lambdas. The last column is the bytecode of the function and of the classes it brings.

| steps | style | extra classes | their size, bytes | bytecode, bytes |
|---|---|---|---|---|
| 4 | blocking | 0 | 0 | 30 |
| 4 | callbacks | 4 | 5,229 | 180 |
| 4 | suspend | 1 | 2,073 | 320 |
| 32 | blocking | 0 | 0 | 310 |
| 32 | callbacks | 32 | 73,168 | 2,714 |
| 32 | suspend | 1 | 13,627 | 7,375 |

It is one class indeed and at 32 steps the class file is 5 times smaller than the pile of lambdas. But the bytecode is 2.7 times bigger. I expected it to grow by about the same amount per step. It does not. In `javap` the reason is visible: before each call every `val` declared above it is written to a field and when the coroutine wakes up every one is read back.

Maybe they are all needed, I sum them at the end. So I generated another chain, where each `val` is read only by the next line and is dead after that. Almost nothing changed. At 32 steps `doResume`, the method with the states, went from 7,340 bytes to 7,248 and the 31 saved fields stayed. With a single reassigned `var` the chain took 1,618 bytes and 1 field.

HotSpot does not compile methods longer than 8,000 bytes of bytecode. `doResume` of the second chain crosses this line between 33 steps (7,671 bytes) and 34 (8,106). I called the versions with 32, 33, 34 and 36 steps 20,000 times each under `-XX:+PrintCompilation`. The first 2 were compiled. The other 2 stayed interpreted. I don't write functions with 34 named steps, but I would not have guessed that the names cost anything.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Size of doResume in bytes of bytecode against the number of steps from 2 to 60. With one val per step it grows as a square and crosses the line of 8,000 bytes between 33 and 34 steps. With a single reassigned var it grows as a straight line and is 2,990 bytes at 60 steps.">
  <line x1="80" y1="270.0" x2="650" y2="270.0" class="f-plain"/>
  <text x="72.0" y="274.0" text-anchor="end" class="f-mono f-muted">0</text>
  <line x1="80" y1="196.4" x2="650" y2="196.4" style="stroke:var(--accent);stroke-dasharray:5 4;stroke-width:1.2"/>
  <text x="72.0" y="200.4" text-anchor="end" class="f-mono f-accent">8,000</text>
  <line x1="80" y1="122.8" x2="650" y2="122.8" class="f-plain"/>
  <text x="72.0" y="126.8" text-anchor="end" class="f-mono f-muted">16,000</text>
  <line x1="80" y1="49.2" x2="650" y2="49.2" class="f-plain"/>
  <text x="72.0" y="53.2" text-anchor="end" class="f-mono f-muted">24,000</text>
  <text x="175.0" y="290.0" text-anchor="middle" class="f-mono f-muted">10</text>
  <text x="270.0" y="290.0" text-anchor="middle" class="f-mono f-muted">20</text>
  <text x="365.0" y="290.0" text-anchor="middle" class="f-mono f-muted">30</text>
  <text x="460.0" y="290.0" text-anchor="middle" class="f-mono f-muted">40</text>
  <text x="555.0" y="290.0" text-anchor="middle" class="f-mono f-muted">50</text>
  <text x="650.0" y="290.0" text-anchor="middle" class="f-mono f-muted">60</text>
  <polyline points="99.0,268.7 108.5,268.1 118.0,267.5 127.5,266.7 137.0,265.7 146.5,264.7 156.0,263.6 165.5,262.4 175.0,261.0 184.5,259.5 194.0,258.0 203.5,256.3 213.0,254.5 222.5,252.6 232.0,250.6 241.5,248.4 251.0,246.2 260.5,243.9 270.0,241.4 279.5,238.8 289.0,236.2 298.5,233.4 308.0,230.5 317.5,227.5 327.0,224.3 336.5,221.1 346.0,217.8 355.5,214.3 365.0,210.8 374.5,207.1 384.0,203.3 393.5,199.4 403.0,195.4 412.5,191.3 422.0,187.1 431.5,182.8 441.0,178.3 450.5,173.8 460.0,169.1 469.5,164.3 479.0,159.4 488.5,154.4 498.0,149.3 507.5,144.1 517.0,138.8 526.5,133.4 536.0,127.8 545.5,122.1 555.0,116.4 564.5,110.5 574.0,104.5 583.5,98.4 593.0,92.2 602.5,85.9 612.0,79.4 621.5,72.9 631.0,66.3 640.5,59.5 650.0,52.6" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <polyline points="99.0,268.6 108.5,268.2 118.0,267.7 127.5,267.3 137.0,266.8 146.5,266.4 156.0,265.9 165.5,265.5 175.0,265.0 184.5,264.6 194.0,264.1 203.5,263.7 213.0,263.2 222.5,262.8 232.0,262.3 241.5,261.9 251.0,261.4 260.5,261.0 270.0,260.5 279.5,260.1 289.0,259.6 298.5,259.2 308.0,258.7 317.5,258.3 327.0,257.8 336.5,257.4 346.0,256.9 355.5,256.5 365.0,256.0 374.5,255.6 384.0,255.1 393.5,254.7 403.0,254.2 412.5,253.8 422.0,253.3 431.5,252.9 441.0,252.4 450.5,252.0 460.0,251.5 469.5,251.1 479.0,250.6 488.5,250.2 498.0,249.7 507.5,249.3 517.0,248.8 526.5,248.4 536.0,247.9 545.5,247.5 555.0,247.0 564.5,246.5 574.0,246.1 583.5,245.6 593.0,245.2 602.5,244.7 612.0,244.3 621.5,243.8 631.0,243.4 640.5,242.9 650.0,242.5" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="403.0" cy="195.4" r="4" style="fill:var(--accent)"/>
  <text x="393.0" y="183.4" text-anchor="end" class="f-mono f-ink">34 steps: 8,106</text>
  <text x="564.5" y="81.4" text-anchor="end" class="f-mono f-accent">a val per step</text>
  <text x="640.5" y="230.9" text-anchor="end" class="f-mono f-muted">one var</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted">doResume, bytes</text>
  <text x="650.0" y="308.0" text-anchor="end" class="f-label f-muted">steps</text>
</svg>
<figcaption>Size of doResume against the number of sequential suspending calls. Above the dashed line HotSpot does not compile the method.</figcaption>
</figure>

## The buffer

A waiting coroutine is cheap. I launched 100,000 of them with `delay` and the heap grew by 361 to 363 bytes per coroutine in 3 runs, 11 objects each, of which the state machine itself is 40 bytes. A sleeping thread took from 45 to 55 KB of resident memory, measured on 1,000 threads. I did not try 100,000 of those.

This makes a forgotten buffer look worse. The informal description of coroutines says that the class has fields for local variables "that are shared between states". `raw` is not shared, only the first state uses it, but 1.1.1 saves every variable that is in scope. I parked 50 coroutines, ran `System.gc()` and looked at how much the heap had grown.

| how it is written | held, MB |
|---|---|
| `val raw`, as above | 49.3 |
| `checksum(load(id))`, no name | 0.0 |
| `val raw` inside `run { }`, no suspension there | 0.0 |
| `var raw`, then `raw = null` before `park()` | 0.0 |
| `raw` as a parameter of the suspend function | 50.0 |
| `raw` inside `run { }` with one `park()`, then a second `park()` outside | 50.0 |
| the same, but an object `val` is declared before the second `park()` | 0.0 |

The row before the last one I like the least. At the second `park()` the variable is already out of scope and the source has no way to name it. The field still points to the array. It goes away only when another object variable happens to take the same field, which is the last row. And for the row with `null` the compiler warns that the `null` assigned to `raw` is never used. So it hints that the line which frees 1 MB is not needed.

Other people saw this before me. Issue KT-16222 was opened on February 7 and asks for the coroutine to clear its state as soon as possible.

<figure class="fig">
<svg viewBox="0 0 680 292" role="img" aria-label="Memory held by 50 parked coroutines or threads, MB: val raw 49.3; val raw, compiled 50.0; no name 0.0; raw = null 0.0; parameter 50.0; out of scope 50.0; thread, interpreted 50.0; thread, warmed up 48.0; thread, no inlining 0.0.">
  <text x="178.0" y="30.0" text-anchor="end" class="f-mono f-ink">val raw</text>
  <rect x="190" y="14" width="414.1" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="612.1" y="30.0" text-anchor="start" class="f-mono f-muted">49.3</text>
  <text x="178.0" y="59.0" text-anchor="end" class="f-mono f-ink">val raw, compiled</text>
  <rect x="190" y="43" width="420.0" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="618.0" y="59.0" text-anchor="start" class="f-mono f-muted">50.0</text>
  <text x="178.0" y="88.0" text-anchor="end" class="f-mono f-ink">no name</text>
  <rect x="190" y="72" width="2.0" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="200.0" y="88.0" text-anchor="start" class="f-mono f-muted">0.0</text>
  <text x="178.0" y="117.0" text-anchor="end" class="f-mono f-ink">raw = null</text>
  <rect x="190" y="101" width="2.0" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="200.0" y="117.0" text-anchor="start" class="f-mono f-muted">0.0</text>
  <text x="178.0" y="146.0" text-anchor="end" class="f-mono f-ink">parameter</text>
  <rect x="190" y="130" width="420.0" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="618.0" y="146.0" text-anchor="start" class="f-mono f-muted">50.0</text>
  <text x="178.0" y="175.0" text-anchor="end" class="f-mono f-ink">out of scope</text>
  <rect x="190" y="159" width="420.0" height="22" style="fill:var(--accent);opacity:0.75"/>
  <text x="618.0" y="175.0" text-anchor="start" class="f-mono f-muted">50.0</text>
  <text x="178.0" y="217.0" text-anchor="end" class="f-mono f-ink">thread, interpreted</text>
  <rect x="190" y="201" width="420.0" height="22" style="fill:var(--muted);opacity:0.5"/>
  <text x="618.0" y="217.0" text-anchor="start" class="f-mono f-muted">50.0</text>
  <text x="178.0" y="246.0" text-anchor="end" class="f-mono f-ink">thread, warmed up</text>
  <rect x="190" y="230" width="403.2" height="22" style="fill:var(--muted);opacity:0.5"/>
  <text x="601.2" y="246.0" text-anchor="start" class="f-mono f-muted">48.0</text>
  <text x="178.0" y="275.0" text-anchor="end" class="f-mono f-ink">thread, no inlining</text>
  <rect x="190" y="259" width="2.0" height="22" style="fill:var(--muted);opacity:0.5"/>
  <text x="200.0" y="275.0" text-anchor="start" class="f-mono f-muted">0.0</text>
</svg>
<figcaption>Heap held after System.gc() by 50 tasks that wait with a dead buffer of 1 MB each. Accent: coroutine, gray: thread. One run of 5. In the last row the thread is warmed up too, but HotSpot is forbidden to inline CountDownLatch (one run of 3).</figcaption>
</figure>

## The thread did the same, at first

I wanted a clean contrast, so I added a blocking twin: the same code on a thread, with a `CountDownLatch` instead of `park`. I expected zero. It held 50.0 MB, exactly as the coroutine.

The method ran 50 times, once per thread, so it was interpreted. It looks like an interpreted frame keeps whatever was last written to a local. I called both functions 20,000 times with tiny buffers to get them compiled, then repeated the test. Now the threads held from 46 to 49 MB in 5 runs. I thought the test was broken.

`PrintCompilation` showed that the compiled `blocking` was marked "made not entrant" late in the run. While I warmed it up the latch was always open, so I think HotSpot inlined `await` without the waiting path. The first thread that really had to wait threw that code away and most of the threads went back to the interpreter. When I forbade inlining of the `CountDownLatch` methods, the threads held 0.0 MB in 3 runs out of 3. The warmed coroutine held 50.0 with this ban and without it.

So in my runs the thread drops the buffer only when its method is compiled and stays compiled. The 1.1.1 coroutine does not drop it even when compiled. The contrast is there, but it is smaller than I hoped.

## What else the text hides

3 small checks on the same theme, code that reads like synchronous code.

- 4 suspend functions call each other and the deepest one throws. If it throws before `delay`, all 4 are in the stack trace. After `delay` only the deepest one is there.
- 1,000 coroutines on a pool of 4 threads set a `ThreadLocal`, call `delay(5)` and read it back. In 7 runs from 663 to 909 of them woke up on another thread and at least 996 read a wrong value.
- `synchronized(l) { delay(5) }` compiles without a warning. 1,000 calls out of 1,000 ended with `IllegalMonitorStateException`, thrown at the moment of suspension.

The last one I prefer to the first 2, at least it fails every time.

For now I will keep big buffers in ordinary functions and call them from suspend ones without giving the buffer a name there. It is a strange rule and I hope to drop it when the issue is closed.

## What I didn't check

Only 1.1.1, only the JVM and one Java 8 build. I did not measure time at all, so I can't say how much an interpreted 34-step function costs. The heap numbers come after an explicit `System.gc()`. The mechanism of the interpreted frame is my reading of these runs, I did not look into HotSpot sources. I also left out JavaScript output and generators with `buildSequence`.
