---
title: "The imul that never runs"
description: "javac keeps the difference between x * 2 and x << 1. Nothing below javac keeps it in a form you can measure. The only multiply left in the compiled loop is one the compiler put there itself."
date: 2011-12-14
lang: en
translationKey: imul-that-never-runs
---

I got one comment on a code review this week. I had written `total = count * 2` and the comment asked for `count << 1` instead, because a shift is cheaper than a multiply. I did not argue. I had nothing to argue with. I write Java every working day and I had never opened a class file to see what javac makes of it.

So I opened one. Everything below is OpenJDK 7 b147, the IcedTea 2.0 build that reached the distributions in October. The run is pinned to one core of a kvm guest. Tiered compilation is off in 7, so the server compiler does all of the work and its `CompileThreshold` is 10000.

## What javac keeps

2 methods, one line apart:

```java
static int byMul(int x)   { return x * 2; }
static int byShift(int x) { return x << 1; }
```

And `javap -c` on the class file:

```
  static int byMul(int);        static int byShift(int);
       0: iload_0                    0: iload_0
       1: iconst_2                   1: iconst_1
       2: imul                       2: ishl
       3: ireturn                    3: ireturn
```

4 bytecodes each. 2 of the 4 differ: one instruction pushes the constant, the other consumes it. At this layer the review comment is correct.

javac does rewrite things, just not this one. `return 2 * 3` compiles to `bipush 6`. A `static final int` read from another class arrives as `iconst_4` rather than as a field load. javac performs the rewrites the language specifies and leaves arithmetic to whatever runs the bytecode.

<figure class="fig">
<svg viewBox="0 0 640 268" role="img" aria-label="The two expressions followed down four layers. In the source they are x times 2 and x shifted left by 1. javac turns them into the bytecodes imul and ishl, which is the layer where the difference is plain. Under the interpreter ten million calls per round give medians of 241716 and 240751 microseconds, 0.4 percent apart, while rounds inside one run run from 199267 to 301291. The server compiler emits shl dollar 1 comma eax for both. Only the disassembler comment still says imul.">
  <defs>
    <marker id="jArrow1" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="6" y="50" class="f-label f-muted">source</text>
  <rect x="104" y="30" width="150" height="30" rx="3" class="f-plain"/>
  <text x="179" y="50" class="f-mono f-ink" text-anchor="middle">x * 2</text>
  <rect x="264" y="30" width="150" height="30" rx="3" class="f-plain"/>
  <text x="339" y="50" class="f-mono f-ink" text-anchor="middle">x << 1</text>
  <text x="428" y="46" class="f-label f-muted">what I wrote</text>
  <path d="M 179 62 L 179 92" class="f-line" marker-end="url(#jArrow1)"/>
  <path d="M 339 62 L 339 92" class="f-line" marker-end="url(#jArrow1)"/>
  <text x="6" y="118" class="f-label f-muted">bytecode</text>
  <rect x="104" y="98" width="150" height="30" rx="3" class="f-box"/>
  <text x="179" y="118" class="f-mono f-accent" text-anchor="middle">imul</text>
  <rect x="264" y="98" width="150" height="30" rx="3" class="f-box"/>
  <text x="339" y="118" class="f-mono f-accent" text-anchor="middle">ishl</text>
  <text x="428" y="114" class="f-label f-muted">the only layer where</text>
  <text x="428" y="129" class="f-label f-muted">the two differ</text>
  <path d="M 179 130 L 179 160" class="f-line" marker-end="url(#jArrow1)"/>
  <path d="M 339 130 L 339 160" class="f-line" marker-end="url(#jArrow1)"/>
  <text x="6" y="186" class="f-label f-muted">interpreter</text>
  <rect x="104" y="166" width="150" height="30" rx="3" class="f-plain"/>
  <text x="179" y="186" class="f-mono f-ink" text-anchor="middle">241716 us</text>
  <rect x="264" y="166" width="150" height="30" rx="3" class="f-plain"/>
  <text x="339" y="186" class="f-mono f-ink" text-anchor="middle">240751 us</text>
  <text x="428" y="182" class="f-label f-muted">medians 0.4 percent apart,</text>
  <text x="428" y="197" class="f-label f-muted">rounds 199267 to 301291</text>
  <path d="M 179 198 L 179 228" class="f-line" marker-end="url(#jArrow1)"/>
  <path d="M 339 198 L 339 228" class="f-line" marker-end="url(#jArrow1)"/>
  <text x="6" y="254" class="f-label f-muted">machine code</text>
  <rect x="104" y="234" width="150" height="30" rx="3" class="f-plain"/>
  <text x="179" y="254" class="f-mono f-ink" text-anchor="middle">shl $1,%eax</text>
  <rect x="264" y="234" width="150" height="30" rx="3" class="f-plain"/>
  <text x="339" y="254" class="f-mono f-ink" text-anchor="middle">shl $1,%eax</text>
  <text x="428" y="250" class="f-label f-muted">the same instruction,</text>
  <text x="428" y="265" class="f-label f-muted">the comment still says imul</text>

</svg>
<figcaption>javac keeps the difference. Below javac it stops being measurable: the interpreter cannot separate them and the server compiler writes the same instruction for both.</figcaption>
</figure>


## What the interpreter can see

If the difference lives below javac it should live in the interpreter, which walks the bytecode one instruction at a time. I ran both loops under `-Xint`, 10 million calls per round, 15 rounds, mul and shift alternating inside one JVM so that drift hits both. Medians in microseconds:

```
mul   median 241716 us
shift median 240751 us
```

Shift comes out 0.4 percent faster. The script repeats the measurement 3 times: mul faster by 4.7 percent, then by 8.4, then shift faster by 2.6. Rounds inside a single run spread from 199267 to 301291, so none of those gaps mean anything.

The reason is dispatch. Every bytecode template ends with `movzbl 0x1(%r13),%ebx` and `jmp *(%r10,%rbx,8)`, a table lookup and an indirect jump into the next one. I dumped both templates with `-XX:+PrintInterpreter` expecting twins. The arithmetic is one instruction in each, but the shift template is one `mov` longer, because the count has to go through `%cl` first. Whatever the shift saves in the ALU it gives back at the top of its own template.

## The compiler arrives in the middle of a loop

The same loops without `-Xint`, 100 million calls per round. These rounds are not interleaved, all 9 mul rounds run first:

```
mul   median 34629 us
shift median 34635 us
```

That is 0.35 nanoseconds per iteration against 24.2 in the interpreter, a factor of 70. Across 4 runs it landed between 66 and 71, with the movement coming almost entirely from the interpreted side: that median shifted by 6 percent, the compiled one by under one.

The transition shows up if you print every round instead of a median. 12 rounds of a million calls, in microseconds:

```
10012  386  370  381  370  381  342  356  342  342  354  342
```

Round zero is about 30 times the plateau. It is not a fully interpreted round either. A million interpreted calls cost around 24200 microseconds and this one cost 10012, so the compiler caught up with the loop while it was still running. `-XX:+PrintCompilation` on that same command shows how:

```
37    1             Doubling::byMul (4 bytes)
39    1 %           Doubling::roundMul @ 9 (47 bytes)
45    2             Doubling::roundMul (47 bytes)
```

The `%` marks on-stack replacement. The frame was already on the stack when the runtime swapped in compiled code at bytecode 9, the loop head. I had assumed a method gets compiled and then the next call gets the fast version. A long loop has no next call, so the JVM does not wait for one.

## What the machine actually gets

`-XX:+UnlockDiagnosticVMOptions -XX:CompileCommand=print` prints the finished code, once the hsdis plugin is built against binutils. That build took me longer than the measurement did. Both methods:

```
byMul:   mov %esi,%eax        shl $1,%eax   ;*imul
byShift: mov %esi,%eax        shl $1,%eax   ;*ishl
```

The same arithmetic, one `mov` and one `shl`, inside method bodies of 32 bytes each. The comment column names the bytecode an instruction came from. In the first line it says `imul` next to a shift.

The loops are the better result. I stripped the addresses from both listings and diffed them, 103 instructions a side. `diff` returns 2 lines. Both differ only in the comment:

```
55c55
< add    $0x10,%esi         ;*imul
---
> add    $0x10,%esi         ;*ishl
64c64
< mov    %r11d,%ebx         ;*imul
---
> mov    %r11d,%ebx         ;*ishl
```

The hot loop is 32 instructions and 90 bytes. It runs sixteen source iterations per pass. There is no multiply in it and no call to `byMul` either. The multiply became a running value that grows by 32 every pass, kept in 3 staggered registers. Sixteen copies of it reach the accumulator, fifteen by `add` and one by a `mov` that overwrites it before the old contents fold back in. `add $0xf0` supplies the 240 that corrects the sum. Adding `2 * i` over sixteen consecutive values of `i` gives 32 times the first value plus 240. That is what the compiler wrote down.

There is exactly one real multiply instruction in the whole compiled method. It sits next to `movabs $0x20c49ba5e353f7cf` and `sar $0x7`, a division by 1000 done as a multiply by a magic constant. That is my own timing line turning nanoseconds into microseconds. The multiply from my source never runs. The one that does came out of my timing code.

<figure class="fig">
<svg viewBox="0 0 640 350" role="img" aria-label="The compiled loop runs sixteen source iterations per pass. Instead of sixteen multiplies, sixteen copies of one running value reach the accumulator, fifteen of them by add and one by a mov. That value grows by 32 every pass. A single add of the constant 240 corrects the sum. There is no imul and no call to byMul anywhere in the loop, which is 32 instructions and 90 bytes. The only multiply instruction in the whole compiled method sits between movabs of the magic constant 0x20c49ba5e353f7cf and a shift right by 7, which is the division by 1000 from the timing line.">
  <defs>
    <marker id="jArrow2" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="16" y="22" class="f-label f-muted">sixteen source iterations</text>
  <rect x="16" y="48" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="59" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="70" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="81" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="92" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="103" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="114" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="125" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="136" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="147" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="158" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="169" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="180" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="191" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="202" width="90" height="7" rx="1" class="f-plain"/>
  <rect x="16" y="213" width="90" height="7" rx="1" class="f-plain"/>
  <text x="16" y="246" class="f-mono f-muted">acc += 2 * i</text>
  <path d="M 112 134 L 152 134" class="f-line" marker-end="url(#jArrow2)"/>
  <text x="166" y="40" class="f-label f-muted">one pass of the compiled loop</text>
  <rect x="166" y="56" width="200" height="34" rx="3" class="f-box"/>
  <text x="266" y="78" class="f-mono f-ink" text-anchor="middle">15 x add + 1 x mov</text>
  <text x="376" y="71" class="f-label f-muted">sixteen copies of one value</text>
  <text x="376" y="86" class="f-label f-muted">the value grows by 32 every pass</text>
  <rect x="166" y="108" width="200" height="34" rx="3" class="f-box"/>
  <text x="266" y="130" class="f-mono f-ink" text-anchor="middle">add $0xf0,%ecx</text>
  <text x="376" y="130" class="f-label f-muted">the constant that corrects the sum</text>
  <rect x="166" y="160" width="200" height="34" rx="3" class="f-plain" stroke-dasharray="4 3"/>
  <text x="266" y="182" class="f-mono f-muted" text-anchor="middle">imul</text>
  <text x="376" y="182" class="f-label f-muted">no imul and no call in the loop</text>
  <path d="M 210 168 L 322 186" class="f-line"/>
  <path d="M 16 270 L 624 270" class="f-line"/>
  <text x="16" y="292" class="f-label f-muted">the one multiply in the whole method</text>
  <text x="16" y="314" class="f-mono f-accent">movabs $0x20c49ba5e353f7cf</text>
  <text x="228" y="314" class="f-mono f-ink">imul %r10</text>
  <text x="320" y="314" class="f-mono f-ink">sar $0x7</text>
  <text x="16" y="336" class="f-label f-muted">my own timing line, divided by 1000</text>
</svg>
<figcaption>Sixteen multiplies become sixteen copies of one running value plus a constant. The one multiply left in the method belongs to the timing code.</figcaption>
</figure>


## The benchmark I threw away

My first version added nothing up. It called `byMul(i)` and dropped the result:

```
discarded   4934   8684      0      0      0      0
```

Zero microseconds from round 2 on. I raised it to 2 billion iterations and it still printed zeros. An unused call with no side effect is dead. The loop around it goes with it. The disassembly of that `main` has one loop left and no mention of `byMul`. I lost half an hour to the zeros before I worked out that I was timing an empty loop.

## Where the threshold shows up

I wanted to watch the 10000 counter fire. 1000 calls per round reaches it around round 10, so I ran 200 such rounds and looked for the step. It came at round 76. I ran the same command again and got 101, then 66, then 69, then 91.

The counter is not what moves. `-Xbatch` makes the calling thread wait for the compiler instead of queueing the work. Under that flag the step lands on round 11 in every run. It also moves exactly where the counter says: `CompileThreshold=20000` puts it at round 21, `5000` at round 6 and 500 calls per round back at 21.

```
round 8   41 us
     51    1    b        Doubling::byMul (4 bytes)
round 9   2181 us
     53    2    b        Doubling::roundMul (47 bytes)
round 10   28 us
round 11   0 us
```

Round 9 carries 2181 microseconds because `byMul` is compiled inside the timed loop. `roundMul` is compiled at the entry to round 10, before the timer starts, so its own 2 milliseconds never show. Round 10 still runs interpreted: the counter fired on the way in and the frame already running stays interpreted to the end. Round 11 is the first compiled one. Its 1000 iterations take under a microsecond, which integer division prints as zero. Without the flag the code arrives whenever the compiler thread gets to it, 50 to 90 rounds later here.

<figure class="fig">
<svg viewBox="0 0 640 226" role="img" aria-label="A timeline of rounds from 0 to 120, a thousand calls each. The invocation counter reaches 10000 at round ten. With -Xbatch, which makes the calling thread wait for the compiler, the loop starts running compiled at round 11 in all three runs. Without the flag the compiler works on its own thread and the same step lands at rounds 66, 69, 76, 91 and 101 across five runs.">
  <defs>
    <marker id="jArrow3" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <path d="M 106.7 40 L 106.7 182" class="f-line" stroke-dasharray="4 3"/>
  <text x="114.7" y="32" class="f-label f-accent">counter reaches 10000</text>
  <text x="6" y="62" class="f-label f-muted">with -Xbatch, three runs</text>
  <circle cx="111.3" cy="74" r="3.5" class="f-accent"/>
  <circle cx="111.3" cy="86" r="3.5" class="f-accent"/>
  <circle cx="111.3" cy="98" r="3.5" class="f-accent"/>
  <text x="6" y="124" class="f-label f-muted">without the flag, five runs</text>
  <circle cx="368" cy="136" r="3.5" class="f-ink"/>
  <circle cx="382" cy="148" r="3.5" class="f-ink"/>
  <circle cx="414.7" cy="136" r="3.5" class="f-ink"/>
  <circle cx="484.7" cy="148" r="3.5" class="f-ink"/>
  <circle cx="531.3" cy="136" r="3.5" class="f-ink"/>
  <path d="M 60 186 L 624 186" class="f-line"/>
  <path d="M 60 186 L 60 192" class="f-line"/>
  <text x="60" y="206" class="f-mono f-muted" text-anchor="middle">0</text>
  <path d="M 106.7 186 L 106.7 192" class="f-line"/>
  <text x="106.7" y="206" class="f-mono f-muted" text-anchor="middle">10</text>
  <path d="M 246.7 186 L 246.7 192" class="f-line"/>
  <text x="246.7" y="206" class="f-mono f-muted" text-anchor="middle">40</text>
  <path d="M 433.3 186 L 433.3 192" class="f-line"/>
  <text x="433.3" y="206" class="f-mono f-muted" text-anchor="middle">80</text>
  <path d="M 620 186 L 620 192" class="f-line"/>
  <text x="620" y="206" class="f-mono f-muted" text-anchor="middle">120</text>
  <text x="6" y="206" class="f-label f-muted">round</text>
</svg>
<figcaption>The counter fires at the same round every time. When the compiled code shows up depends on the compiler thread. Here that is 50 to 90 rounds later.</figcaption>
</figure>


## What I did not check

I only measured `* 2`. A multiply by a constant that is not a power of 2 is a different question. A multiply by a variable is another. I did not open either. I meant to compare the client compiler and found there is no `-client` in this 64-bit build. That would mean a 32-bit jdk. I did not go there.

The review comment was fair on its own terms. It aimed at the one layer where the difference is plain to see. On this machine the layer under it charged 70 times more for the same source, until the compiler got there. I do not know how long a real request path takes to reach 10000 calls. That is the number I want next.
