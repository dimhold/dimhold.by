---
title: "WebAssembly was 7.9 times faster than my JS until I rewrote total += k"
description: "6 small loops, calls across the border and compile time on Node 8.1.2, JS against WebAssembly written by hand. The 7.9 times win of wasm on Mandelbrot came from a let that the optimizing compiler refused. After one changed line JS was 1.35 times faster. The 64-bit generator is really 10 times faster in wasm."
date: 2017-06-17
lang: en
translationKey: wasm-first-measure
tags: ["performance", "compilers"]
---

The Mandelbrot loop took 427 ms in JavaScript and 54 ms in WebAssembly on Node 8.1.2. I had written down before the run that wasm should win by at least 1.2 times, so 7.9 looked like a success. But under `node --trace-opt` the JavaScript side prints this (I cut the address):

```
[disabled optimization for <SharedFunctionInfo mandel>, reason: Unsupported let compound assignment]
```

The optimizing compiler looked at the JS function and refused it. The reason is the line `total += k`, one of 14, where `total` is declared with `let`. I changed it to `total = total + k` and the same function takes 40 ms. Now JS is 1.35 times faster than wasm.

I write `let` by default and I never looked whether the optimizer accepts it. So this became a post about 2 things at once.

## Setup

Node 8.1.2 is from this Thursday, with V8 5.8.283.41 inside. In Node 8 `WebAssembly` works without a flag. The machine is a 2-core virtual machine with Linux x64. I did not take emscripten, because then I would measure its optimizer too. The wasm functions are lists of instructions written by hand and a script of 57 lines packs them into bytes. A module that adds 2 integers is 41 bytes:

```
00 61 73 6d 01 00 00 00 01 07 01 60 02 7f 7f 01 7f 03 02 01 00
07 07 01 03 61 64 64 00 00 0a 09 01 07 00 20 00 20 01 6a 0b
```

Every loop exists in 3 forms: JS with `let` and `const` as I would write it, the same text with both replaced by `var` and the third form is wasm. Each configuration ran in 11 fresh processes with 7 repeats inside. The numbers below are the median over processes of the best repeat. The script fails if the results differ.

Haas and colleagues compare wasm with native code and asm.js in their PLDI paper, the text is in the spec repository since March. Lin Clark explained on Mozilla Hacks in February why wasm should be fast. I wanted small examples on Node that I can read whole.

## 6 loops

| loop | let, ms | var, ms | wasm, ms | let / wasm | var / wasm |
|---|---|---|---|---|---|
| collatz, int32 | 28.2 | 25.6 | 20.7 | 1.36 | 1.24 |
| mandelbrot, f64 | 427 | 39.6 | 54.0 | 7.90 | 0.73 |
| 64-bit generator | 211 | 208 | 2.63 | 80.4 | 79.2 |
| same, int32 only | 26.9 | 26.9 | 2.63 | 10.2 | 10.2 |
| sieve, 5 million bytes | 313 | 34.6 | 23.3 | 13.4 | 1.49 |
| fib(30) | 9.72 | 10.06 | 7.26 | 1.34 | 1.39 |

`fib` has no `let` at all, so its first 2 columns are the same text and the 3% between them is the error of my setup. The `let` version always runs first in the process, the one with `var` is built from a string.

<figure class="fig">
<svg viewBox="0 0 680 284" role="img" aria-label="Best time of 6 loops on Node 8.1.2 on a logarithmic scale for JS with let, JS with var and wasm. collatz, int32: let 28.2, var 25.6, wasm 20.7 ms; mandelbrot, f64: let 427, var 39.6, wasm 54.0 ms; 64-bit generator: let 211, var 208, wasm 2.63 ms; same, int32 only: let 26.9, var 26.9, wasm 2.63 ms; sieve, bytes: let 313, var 34.6, wasm 23.3 ms; fib(30), calls: let 9.72, var 10.06, wasm 7.26 ms.">
  <circle cx="188.0" cy="16.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="204.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS with let</text>
  <circle cx="323.0" cy="16.0" r="5" style="fill:var(--ink);stroke:none"/>
  <text x="339.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS with var</text>
  <circle cx="458.0" cy="16.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="474.0" y="20.0" text-anchor="start" class="f-mono f-muted">wasm</text>
  <line x1="180.0" y1="42.0" x2="180.0" y2="252.0" class="f-plain"/>
  <text x="180.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <line x1="333.3" y1="42.0" x2="333.3" y2="252.0" class="f-plain"/>
  <text x="333.3" y="272.0" text-anchor="middle" class="f-mono f-muted">10</text>
  <line x1="486.7" y1="42.0" x2="486.7" y2="252.0" class="f-plain"/>
  <text x="486.7" y="272.0" text-anchor="middle" class="f-mono f-muted">100</text>
  <line x1="640.0" y1="42.0" x2="640.0" y2="252.0" class="f-plain"/>
  <text x="640.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1,000</text>
  <text x="168.0" y="64.0" text-anchor="end" class="f-mono f-ink">collatz, int32</text>
  <line x1="381.9" y1="60.0" x2="402.3" y2="60.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="402.3" cy="60.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="396.1" cy="60.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="381.9" cy="60.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="98.0" text-anchor="end" class="f-mono f-ink">mandelbrot, f64</text>
  <line x1="425.0" y1="94.0" x2="583.3" y2="94.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="583.3" cy="94.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="425.0" cy="94.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="445.7" cy="94.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="132.0" text-anchor="end" class="f-mono f-ink">64-bit generator</text>
  <line x1="244.4" y1="128.0" x2="536.5" y2="128.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="536.5" cy="128.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="535.5" cy="128.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="128.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="166.0" text-anchor="end" class="f-mono f-ink">same, int32 only</text>
  <line x1="244.4" y1="162.0" x2="399.4" y2="162.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="399.4" cy="162.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="399.2" cy="162.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="162.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="200.0" text-anchor="end" class="f-mono f-ink">sieve, bytes</text>
  <line x1="389.5" y1="196.0" x2="562.6" y2="196.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="562.6" cy="196.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="416.0" cy="196.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="389.5" cy="196.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="234.0" text-anchor="end" class="f-mono f-ink">fib(30), calls</text>
  <line x1="312.0" y1="230.0" x2="333.7" y2="230.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="331.4" cy="230.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="333.7" cy="230.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="312.0" cy="230.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="272.0" text-anchor="end" class="f-label f-muted">ms, log scale</text>
</svg>
<figcaption>Median over 11 processes of the best of 7 repeats. Where the hollow circle is far from the black one, the optimizing compiler refused the function.</figcaption>
</figure>

I tried the same repair in the sieve, `j = j + i` instead of `j += i`. This check is a separate script in 7 processes with 5 repeats, the 40 ms at the top come from it too. There the sieve was 296 ms before and 296 ms after. The compiler had simply moved on to the next complaint, `Unsupported phi use of const or let variable`. There I stopped repairing and replaced everything with `var`, which gave 35 ms.

This is a known trap. Petka Antonov's list of optimization killers in the Bluebird wiki has the compound `let` assignment, with the remark "Optimized as of Chrome 56 / V8 5.6!". My V8 is 5.8, so by this list it should be fixed. But `node --v8-options` shows that `--turbo` is off by default in this build. With `--turbo` the Mandelbrot with `let` takes 39.5 ms in 7 processes. In a small probe the spelling `s += a[i]` with `let` is accepted by Node 6.11.0 and refused by 7.10.0.

With `--ignition --turbo`, the pair that V8 5.9 switches on for everybody, Mandelbrot with `let` takes 39.6 ms in 11 processes. It is not free. The sieve with `var` went from 34.6 to 52 ms. With `let` it fell from 313 to 83, but it is still slower than the old `var`.

## The 80 times

JS has no 64-bit integers, so the generator `x = x * a + c` has to be cut into halves. In my ordinary version the compiler gives up even with `var`, after some attempts it writes `Deoptimized too many times`. I decided that the intermediate products leave the int32 range and rewrote everything with `Math.imul`. It became almost 8 times faster and still loses to wasm by 10.2 times. With the new pipeline it loses by 3.1. Wasm has one `i64.mul` there.

My explanation was wrong. `--trace-deopt` shows 11 exits from optimized code, all with the reason `lost precision` and all at the 2 calls of `Math.imul` that take the halves themselves. I kept the halves unsigned with `>>> 0`. With `| 0` in these 2 places the old text takes 30.5 ms, before that it was 200 (7 processes, the rewritten one gives 26.9 there). Almost all of the rewriting was not needed.

This win I believe. But `i64` cannot cross the border. A wasm function that takes and returns `i64` compiles, but `exports.id(1)` throws `TypeError: invalid type`. My generator takes and returns int32.

Mandelbrot is the opposite case. I suspected my own wasm, so I replaced `2 * x` with `x + x` and moved the constants to locals. Nothing changed, 54.0 and 54.4 ms. Moving the test to the bottom of the loop gave 50.1. It is still 25% slower than the JS with one changed line and I don't know why.

## The border

<figure class="fig">
<svg viewBox="0 0 680 242" role="img" aria-label="Price of one call in nanoseconds. wasm to wasm: 1.96; JS to wasm, no arguments: 3.65; JS to JS: 3.99; wasm to JS, 2 int32: 6.53; JS to wasm, 2 int32: 8.24; JS to wasm, 2 f64: 11.75; JS to JS, inlined: 0.67.">
  <text x="235.0" y="14.0" text-anchor="start" class="f-label f-muted">ns per call</text>
  <text x="223.0" y="42.0" text-anchor="end" class="f-mono f-ink">wasm to wasm</text>
  <rect x="235" y="30" width="61.3" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="304.3" y="42.0" text-anchor="start" class="f-mono f-ink">1.96</text>
  <text x="223.0" y="72.0" text-anchor="end" class="f-mono f-ink">JS to wasm, no arguments</text>
  <rect x="235" y="60" width="114.1" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="357.1" y="72.0" text-anchor="start" class="f-mono f-ink">3.65</text>
  <text x="223.0" y="102.0" text-anchor="end" class="f-mono f-ink">JS to JS</text>
  <rect x="235" y="90" width="124.7" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="367.7" y="102.0" text-anchor="start" class="f-mono f-ink">3.99</text>
  <text x="223.0" y="132.0" text-anchor="end" class="f-mono f-ink">wasm to JS, 2 int32</text>
  <rect x="235" y="120" width="204.1" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="447.1" y="132.0" text-anchor="start" class="f-mono f-ink">6.53</text>
  <text x="223.0" y="162.0" text-anchor="end" class="f-mono f-ink">JS to wasm, 2 int32</text>
  <rect x="235" y="150" width="257.5" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="500.5" y="162.0" text-anchor="start" class="f-mono f-ink">8.24</text>
  <text x="223.0" y="192.0" text-anchor="end" class="f-mono f-ink">JS to wasm, 2 f64</text>
  <rect x="235" y="180" width="367.2" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="610.2" y="192.0" text-anchor="start" class="f-mono f-ink">11.75</text>
  <text x="223.0" y="222.0" text-anchor="end" class="f-mono f-ink">JS to JS, inlined</text>
  <rect x="235" y="210" width="20.9" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="263.9" y="222.0" text-anchor="start" class="f-mono f-ink">0.67</text>
</svg>
<figcaption>Inlining is switched off in all rows except the last. The empty loop, 0.48 ns, is not subtracted.</figcaption>
</figure>

A call from JS to wasm with 2 integers costs 8.24 ns against 3.99 for a JS function that V8 is forbidden to inline. That is 2 times more, I had allowed up to 10. Without arguments it is 3.65 and with 2 doubles 11.75. The way back, from wasm to JS, is 6.53. When inlining is allowed the JS call almost disappears, 0.67 ns together with the loop, while the wasm call stays at 8.26.

I also wanted to know from what size of work moving to wasm pays off. The test is a sum of squares of n doubles.

<figure class="fig">
<svg viewBox="0 0 680 338" role="img" aria-label="Time of one call that sums the squares of n doubles, n from 1 to 4096, both axes logarithmic. JS with let is the top line, from 33.1 to 97,166 ns. JS with var goes from 1.6 to 3,992 ns, wasm over its own memory from 9.5 to 4,023 ns, wasm after copying the array in from 44.1 to 4,726 ns. Wasm approaches the var line at a few hundred elements but does not cross it.">
  <line x1="80.0" y1="290.0" x2="520.0" y2="290.0" class="f-plain"/>
  <text x="72.0" y="294.0" text-anchor="end" class="f-mono f-muted">1</text>
  <line x1="80.0" y1="238.8" x2="520.0" y2="238.8" class="f-plain"/>
  <text x="72.0" y="242.8" text-anchor="end" class="f-mono f-muted">10</text>
  <line x1="80.0" y1="187.6" x2="520.0" y2="187.6" class="f-plain"/>
  <text x="72.0" y="191.6" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="80.0" y1="136.4" x2="520.0" y2="136.4" class="f-plain"/>
  <text x="72.0" y="140.4" text-anchor="end" class="f-mono f-muted">1,000</text>
  <line x1="80.0" y1="85.2" x2="520.0" y2="85.2" class="f-plain"/>
  <text x="72.0" y="89.2" text-anchor="end" class="f-mono f-muted">10,000</text>
  <line x1="80.0" y1="34.0" x2="520.0" y2="34.0" class="f-plain"/>
  <text x="72.0" y="38.0" text-anchor="end" class="f-mono f-muted">100,000</text>
  <text x="80.0" y="310.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <text x="190.0" y="310.0" text-anchor="middle" class="f-mono f-muted">8</text>
  <text x="300.0" y="310.0" text-anchor="middle" class="f-mono f-muted">64</text>
  <text x="410.0" y="310.0" text-anchor="middle" class="f-mono f-muted">512</text>
  <text x="520.0" y="310.0" text-anchor="middle" class="f-mono f-muted">4096</text>
  <polyline points="80.0,212.2 116.7,200.4 153.3,186.3 190.0,171.1 226.7,156.4 263.3,141.4 300.0,126.4 336.7,110.8 373.3,95.8 410.0,80.5 446.7,65.2 483.3,49.8 520.0,34.6" style="fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:2 4"/>
  <polyline points="80.0,279.5 116.7,271.5 153.3,261.5 190.0,249.8 226.7,236.1 263.3,219.6 300.0,203.1 336.7,184.1 373.3,167.8 410.0,152.1 446.7,136.5 483.3,121.0 520.0,105.6" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="80.0,205.8 116.7,203.9 153.3,202.9 190.0,203.1 226.7,199.5 263.3,193.7 300.0,185.5 336.7,174.4 373.3,161.9 410.0,147.7 446.7,133.3 483.3,118.3 520.0,101.9" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6 4"/>
  <polyline points="80.0,239.9 116.7,236.1 153.3,233.5 190.0,230.5 226.7,220.7 263.3,210.6 300.0,198.3 336.7,181.9 373.3,166.7 410.0,151.7 446.7,136.1 483.3,120.9 520.0,105.4" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="530.0" y="38.6" text-anchor="start" class="f-mono f-ink">JS with let</text>
  <text x="530.0" y="91.9" text-anchor="start" class="f-mono f-accent">wasm + copy</text>
  <text x="530.0" y="113.4" text-anchor="start" class="f-mono f-accent">wasm</text>
  <text x="530.0" y="131.6" text-anchor="start" class="f-mono f-ink">JS with var</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">ns per call, log</text>
  <text x="520.0" y="328.0" text-anchor="end" class="f-label f-muted">n, doubles per call, log</text>
</svg>
<figcaption>Sum of squares of n doubles, one call. No wasm line goes below the line of JS with var.</figcaption>
</figure>

There is no such size. For all 13 values of n from 1 to 4096 wasm is slower than JS with `var`, 9.5 ns against 1.6 on one element and 4023 against 3992 on 4096. From 1024 elements the ranges over processes overlap. Both come to about 1 ns per element, my guess is the chain of double additions. If the array has to be copied into wasm memory first, 4096 elements take 4726 ns. With `let` the picture is different, 97,166 ns on 4096 elements. There wasm wins from the first element. Without `--trace-opt` I would have published that chart.

## Compile time and size

`new WebAssembly.Module` compiles everything before the first call, I timed one such compilation per process. A module with 2 functions and 390 bytes takes 0.74 ms. With 2000 functions and 364 kB it is 120 ms, about 60 µs per function. `WebAssembly.validate` alone on the big one is 3.2 ms.

The 6 functions in JS are 1400 bytes, in wasm 710. After gzip it is 610 against 441. My JS is not minified, with the spaces removed it is 962 bytes and 523 after gzip. Bounds checks I could not see: with `--wasm_no_bounds_checks` the sieve goes from 23.3 to 21.9 ms and the ranges over processes overlap. I expected 10%.

## What I did not check

I did not check emscripten or any browser, only Node on one machine. My wasm is written by hand, a real compiler would probably do the Mandelbrot better. Streaming and memory growth are out of scope. The refused `let` is a property of this V8 pipeline and may be gone in a later Node 8. I did not look at V8 5.9 itself, only at its pair of flags in 5.8.

For me the generator is worth its 103 bytes of wasm. The Mandelbrot loop I would leave in JS, but I would run `--trace-opt` first.
