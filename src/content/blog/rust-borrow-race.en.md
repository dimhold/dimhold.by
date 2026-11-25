---
title: "Rust 1.0 refused my data race, then its own hint printed 0"
description: "39 small programs for rustc 1.0.0, with the same race in C and Java 8. All 20 programs that break a sharing rule are refused, all 7 that are wrong without a data race compile and the hint from the error message produced a counter that prints 0."
date: 2015-05-31
lang: en
translationKey: rust-borrow-race
tags: ["compilers", "reliability", "types"]
---

Rust 1.0 came out on May 15. I gave it the program I always start with when I look at threads: 2 threads, each adds 1 to a shared counter a million times. It did not compile.

```
error: closure may outlive the current function, but it borrows `counter`, which is owned by the current function [E0373]
help: to force the closure to take ownership of `counter` (and any other referenced variables), use the `move` keyword, as shown:
      let a = thread::spawn(move || for _ in 0..1000000 { counter += 1; });
```

I did what the help says in both threads. It compiled with no errors and no warnings. I ran it 20 times and it printed 0 every time.

The explanation is short. An integer is copied, so with `move` each thread counts in its own copy and main prints the third one. Nothing is shared now and nothing can race. The program also does nothing useful.

I had read "thread safety" in the announcements and took it the way I take most such words, without asking what exactly is safe. In my head a data race and a wrong result were the same thing. Aaron Turon is more exact in "Fearless Concurrency with Rust" from April, he promises no data races. So I decided to count both.

## 39 small programs

I wrote 39 programs of 6 to 19 lines in 5 groups and put a verdict for each of them into a file before the first compilation. The compiler is rustc 1.0.0 (a59de37e9). For comparison there is the same counter and a growing list in C with gcc and in Java 8. Everything ran on 2 cores of a virtual machine.

The first group is 20 programs that break a rule about sharing. Only 10 of them would really race, with 2 threads on the same memory, no lock and at least one writer. I marked these by hand after the run. The other 10 break the same rules but don't race as written, 3 of them have only one thread.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="39 small Rust programs compiled with rustc 1.0.0, one square per program. Programs that break a sharing rule: 20 of 20 rejected, 11 with ownership and borrowing errors, 7 with Send and Sync errors, 2 with other errors. Programs that are wrong without a data race: 7 of 7 compile. Code with unsafe: 3 of 3 compile. Correct programs with the data in a local variable: 6 of 6 rejected. Correct programs with Arc or a channel: 3 of 3 compile.">
  <text x="158.0" y="31.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">breaks a rule</text>
  <rect x="170.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="178.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="191.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="199.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="212.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="220.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="233.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <circle cx="241.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="254.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="296.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="317.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="338.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="359.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="380.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="409.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="417.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="430.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="438.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="451.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="459.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="472.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <circle cx="480.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="493.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="514.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="535.0" y="18.0" width="17.0" height="17.0" style="fill:var(--accent);opacity:0.55;stroke:none"/>
  <rect x="564.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="572.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <rect x="585.0" y="18.0" width="17.0" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <circle cx="593.5" cy="26.5" r="3.2" style="fill:var(--bg);stroke:none"/>
  <text x="170.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">ownership, borrow: 11</text>
  <text x="409.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Send, Sync: 7</text>
  <text x="564.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">other: 2</text>
  <text x="158.0" y="87.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">wrong, no race</text>
  <rect x="170.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="233.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="254.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="275.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="296.0" y="74.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="325.0" y="87.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">compiles</text>
  <text x="158.0" y="119.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">unsafe</text>
  <rect x="170.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="106.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="119.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">compiles</text>
  <text x="158.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">correct, no Arc</text>
  <rect x="170.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="191.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="212.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="233.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="254.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <rect x="275.0" y="138.0" width="17.0" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="304.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">refused</text>
  <text x="158.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">correct, Arc/channel</text>
  <rect x="170.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="191.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <rect x="212.0" y="170.0" width="17.0" height="17.0" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>
  <text x="241.0" y="183.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">compiles</text>
</svg>
<figcaption>Each square is one program, filled means rustc 1.0.0 refused it. In the first row the 20 refusals are split by what the message talks about, a dot marks the 10 programs that would really race.</figcaption>
</figure>

All 20 were refused and all 39 verdicts came true. It is less impressive than it sounds, because I wrote the programs knowing the rules. The messages were more interesting. The word "race" is in none of the 20. 11 of them are about ownership and borrowing: a moved value, a closure that lives too long, a second mutable borrow. These are the rules that let Rust free memory without a garbage collector. Only 7 say that something cannot be sent or shared "between threads safely". The last 2 are a static outside `unsafe` and a `+=` on a Mutex that nobody locked.

Of the 10 programs that really race, the ownership rules catch 4, Send and Sync catch 4 more. I find it elegant that so much is done by rules made for memory, but they have a price. I also wrote 6 correct programs where the data belongs to a local variable of main and all 6 were refused. The simplest is a local Mutex with 2 threads, both joined before main returns. rustc still says that the closure may outlive the function. There is `thread::scoped` for this case, but in 1.0.0 it answers "use of unstable library feature 'scoped': memory unsafe if destructor is avoided, see #24292". The 3 correct programs with Arc or a channel compile and gave 2,000,000 in all 120 runs.

The `move` hint was printed for 5 programs of 39. I applied it mechanically to all of them. 4 got a second error about a moved value, the fifth is the counter that prints 0. None became correct.

## The same race in C and Java

gcc with `-Wall -Wextra` and javac with `-Xlint:all` gave 0 warnings. To see the race in Rust I had to write `unsafe`, here it is a `static mut`. Below are 100 runs of each, the correct answer is 2,000,000.

| program | correct runs | smallest result |
|---|---|---|
| C, gcc -O0 | 61 | 986,351 |
| C, gcc -O2 | 100 | 2,000,000 |
| Java 8 | 15 | 966,766 |
| Rust unsafe | 13 | 1,328,963 |
| Rust unsafe -O | 33 | 1,000,000 |

<figure class="fig">
<svg viewBox="0 0 680 328" role="img" aria-label="Final value of the racy counter in 100 runs of each program, expected 2,000,000. C without optimisation: 61 runs correct, the rest spread from 986,351. C with -O2: 100 correct. Java 8: 15 correct, the rest spread from 966,766. Rust with unsafe, no optimisation: 13 correct. Rust with unsafe and -O: 33 correct and 67 runs at exactly 1,000,000.">
  <line x1="130" y1="66" x2="590" y2="66" class="f-plain"/>
  <text x="120.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O0</text>
  <rect x="131.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="63.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="214.6" y="64.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="235.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="256.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="277.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="64.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="44.0" width="18.9" height="22.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="40.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">61</text>
  <text x="602.0" y="60.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">61 / 100</text>
  <line x1="130" y1="124" x2="590" y2="124" class="f-plain"/>
  <text x="120.0" y="118.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">C, gcc -O2</text>
  <rect x="570.1" y="88.0" width="18.9" height="36.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="84.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="602.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">100 / 100</text>
  <line x1="130" y1="182" x2="590" y2="182" class="f-plain"/>
  <text x="120.0" y="176.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Java 8</text>
  <rect x="131.0" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="151.9" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="172.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="193.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="423.7" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="444.6" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="180.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="180.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="179.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="179.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="166.9" width="18.9" height="15.1" style="fill:var(--accent);stroke:none"/>
  <text x="558.6" y="162.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42</text>
  <rect x="570.1" y="176.6" width="18.9" height="5.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="172.6" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <text x="602.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">15 / 100</text>
  <line x1="130" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="120.0" y="234.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe</text>
  <rect x="277.4" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="298.3" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="319.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="340.1" y="238.2" width="18.9" height="1.8" style="fill:var(--accent);stroke:none"/>
  <rect x="361.0" y="237.5" width="18.9" height="2.5" style="fill:var(--accent);stroke:none"/>
  <rect x="381.9" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="402.8" y="235.0" width="18.9" height="5.0" style="fill:var(--accent);stroke:none"/>
  <text x="412.3" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">14</text>
  <rect x="423.7" y="236.0" width="18.9" height="4.0" style="fill:var(--accent);stroke:none"/>
  <text x="433.2" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="444.6" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="465.5" y="237.1" width="18.9" height="2.9" style="fill:var(--accent);stroke:none"/>
  <rect x="486.5" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="507.4" y="237.8" width="18.9" height="2.2" style="fill:var(--accent);stroke:none"/>
  <rect x="528.3" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="549.2" y="238.5" width="18.9" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="570.1" y="235.3" width="18.9" height="4.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="231.3" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <text x="602.0" y="234.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">13 / 100</text>
  <line x1="130" y1="298" x2="590" y2="298" class="f-plain"/>
  <text x="120.0" y="292.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Rust unsafe -O</text>
  <rect x="151.9" y="273.9" width="18.9" height="24.1" style="fill:var(--accent);stroke:none"/>
  <text x="161.4" y="269.9" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">67</text>
  <rect x="570.1" y="286.1" width="18.9" height="11.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="579.5" y="282.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">33</text>
  <text x="602.0" y="292.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">33 / 100</text>
  <text x="161.4" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,000,000</text>
  <text x="265.9" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,250,000</text>
  <text x="370.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,500,000</text>
  <text x="475.0" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,750,000</text>
  <text x="579.5" y="316.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2,000,000</text>
  <text x="602.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">correct</text>
</svg>
<figcaption>Final value of the same racy counter, 100 runs per row. Column height is the number of runs in a band of 50,000, the number above it is shown for columns of 10 runs and more.</figcaption>
</figure>

I expected optimisation to make the race worse. In Rust it is hard to say, because correct runs grew from 13 to 33 and the other 67 all lost exactly half. In C it made the race invisible, because gcc turned the whole loop into one `addq $1000000, counter(%rip)`. rustc 1.0.0 took the counter into a register, kept the million increments there and wrote the result back in the end. ThreadSanitizer still reported the race in 10 runs of 10 of the same C file with -O2, though every one of them printed 2,000,000.

<figure class="fig">
<svg viewBox="0 0 680 240" role="img" aria-label="What two threads do to the counter in memory. In the gcc -O2 version each thread executes one instruction that adds 1,000,000 to memory, the two additions do not overlap and the result is 2,000,000. In the rustc -O version each thread reads the counter into a register, adds 1 a million times in the register and writes it back. Both threads read 0 and the second write replaces the first, the result is 1,000,000.">
  <text x="10.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">gcc -O2: addq $1000000, counter(%rip)</text>
  <text x="86.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">thread 1</text>
  <line x1="100" y1="44" x2="560" y2="44" class="f-plain"/>
  <text x="86.0" y="76.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">thread 2</text>
  <line x1="100" y1="72" x2="560" y2="72" class="f-plain"/>
  <rect x="160.0" y="36.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="230.0" y="64.0" width="14.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="182.0" y="40.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0 + 1000000</text>
  <text x="252.0" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000000 + 1000000</text>
  <text x="568.0" y="62.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="78.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2,000,000</text>
  <text x="10.0" y="124.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">rustc 1.0.0 -O: movq, incq, movq</text>
  <text x="86.0" y="164.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">thread 1</text>
  <line x1="100" y1="160" x2="140" y2="160" class="f-plain"/>
  <line x1="390" y1="160" x2="560" y2="160" class="f-plain"/>
  <text x="86.0" y="208.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">thread 2</text>
  <line x1="100" y1="204" x2="210" y2="204" class="f-plain"/>
  <line x1="460" y1="204" x2="560" y2="204" class="f-plain"/>
  <rect x="140.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="150.0" y="152.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="380.0" y="152.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="265.0" y="165.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1,000,000 × incq %rax</text>
  <rect x="210.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <rect x="220.0" y="196.0" width="230.0" height="18.0" style="fill:var(--muted);opacity:0.22;stroke:none"/>
  <rect x="450.0" y="196.0" width="10.0" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="335.0" y="209.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1,000,000 × incq %rax</text>
  <text x="145.0" y="146.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">read 0</text>
  <text x="385.0" y="146.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">write 1,000,000</text>
  <text x="215.0" y="190.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">read 0</text>
  <text x="455.0" y="228.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">write 1,000,000</text>
  <text x="568.0" y="188.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">counter =</text>
  <text x="568.0" y="204.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,000,000</text>
</svg>
<figcaption>The same loop after gcc and after rustc. The gcc window is one instruction wide, the rustc 1.0.0 window is as long as the whole loop.</figcaption>
</figure>

I also thought that 1,000,000 is the worst case, since one thread alone gives that much. One run in C and one in Java ended lower. One stale write is too little for this, it needs 2. The first thread writes an old value over almost all the work of the second. The second takes this small number for its last addition, waits till the first is done and writes it at the end. At least I see no other way, I did not trace these runs.

The list is where a garbage collector should help. In C 40 runs of 100 crashed with -O0 and 34 with -O2. Java never crashed, 67 runs showed an exception and 14 had the right size. The remaining 19 printed a wrong size with no complaint at all. In Rust the same push from 2 threads is refused, through a reference or through an Arc.

My measuring script died on this list. It handled a hang in the ordinary runs, I had deadlocks in mind, but in the ThreadSanitizer part there was a limit of 120 seconds that nobody caught. The C list hung there and took the script down. The counts were already in a file, so I repeated only this part.

## What compiles and is wrong

The third thing I wanted to see is programs that have no data race and are still wrong. There are 7 and rustc accepts all 7 without a warning. One is the `move` counter, the other 6 are below. I called a run hung after 3 seconds.

| program | wrong runs |
|---|---|
| read under a lock, write under the next lock | 50 of 50 |
| atomic load, then atomic store | 26 of 50 |
| check the balance, then withdraw under another lock | 40 of 100, balance -1 |
| 2 locks in opposite order | 18 of 20 hung |
| the same lock twice | 5 of 5 hung |
| no join | 100 of 100 printed 0 |

The first row in C and Java is the same, 0 correct runs of 50. ThreadSanitizer is silent about the C version in 20 runs of 20. By definition there is no data race there. If I had stopped at the counter I would have written that Rust catches lost updates. In this program it does not.

For me the practical result is narrow but useful. When a number is wrong in a Rust program without `unsafe`, I can skip the search for memory touched without a lock and go directly to the order of operations. This second part I would still do by eye.

## What I didn't check

The programs are tiny and mine, so 20 of 20 says nothing about how often the borrow checker refuses correct code in a real project. The counts of lost updates depend on the machine and on what else runs there, only the shape is worth remembering. I used one gcc, one processor family and no Java settings. Boehm wrote in 2011 about how compilers break "benign" races, I looked at 2 loops. And I did not look for holes in the standard library itself, like the one behind #24292.
