---
title: "Seed 42 gave 203 different answers in 800 runs of one script"
description: "One simulation script with a known answer, seed 42 and 4 Python versions of 2012. The naive version gave 203 different answers in 800 runs. After 3 fixes it gave 0.0482 every time, while the true answer in the code was 0.03."
date: 2013-02-16
lang: en
translationKey: reproducible-experiment
tags: ["statistics", "numbers", "dependencies"]
---

Python 2.7.3 ran `exp.py naive 42` and printed 0.0324. I ran it again and it printed 0.0324. Then Python 3.3.0 ran the same file with the same seed and the answer was 0.0486. The next run gave 0.0564, the one after it 0.0260. (Python 3 prints all the digits, I cut them to 4.) The right answer is 0.03, it is a constant at the top of the file.

Usually I write `random.seed(42)` on the first line of such a script and consider the question closed. I never checked what exactly this line promises. I also did not know how far the number was from the truth, there was no truth in the script. This is my first experiment where I tried to have both, a run that repeats and an answer known in advance.

## The script

The world is made in the code. There are 400 users with names from `u000` to `u399`, the click rate of a user grows from 0.10 to 0.50 with the number. A random half gets variant B, which adds exactly 0.03 to the rate. Every user gets 25 impressions. The script measures the difference of the mean rates, which I call lift.

The naive version has 3 places that depend on some order. It makes a list from a `set` of names, calls `random.shuffle` and takes `sum` over the values of a dict. I replaced these places one at a time and ran every version with seed 42 on 2.6.8, 2.7.3, 3.2.3 and 3.3.0. All 4 came out in 2012, I built them from source on 64-bit Linux. One cell of the first picture is 100 separate processes.

String hashes matter here. After the collision attack that Klink and Wälde showed in December 2011 Python can randomize them for every process. The `-R` switch does it in the first 3 versions, in 3.3.0 it is on by default and `PYTHONHASHSEED=0` turns it off.

Peng wrote in Science in 2011 that published results should come with the code and the data behind them. And the manual of Python 3.2 has a section "Notes on Reproducibility", which I had never opened. It guarantees the sequence of `random()` and says that most of the other algorithms can change between versions.

## What the seed holds

100,000 values of `random()` are equal to the last bit in all 4 versions. The rest looks like this:

| after the seed | 2.6.8 | 2.7.3 | 3.2.3 and 3.3.0 |
|---|---|---|---|
| 42, `random()` | 0.6394 | 0.6394 | 0.6394 |
| 42, `gauss(0, 1)` | -0.1441 | -0.1441 | -0.1441 |
| 42, `expovariate(1.0)` | 0.4472 | 1.0201 | 1.0201 |
| 42, `randint(1, 100)` | 64 | 64 | 82 |
| 42, `shuffle` of 0 to 9, first 3 | 9 7 8 | 9 7 8 | 7 3 2 |
| 4.2, `random()` | 0.6029 | 0.6029 | 0.9409 |
| "seed-42", `random()` | 0.3206 | 0.3206 | 0.4036 |

`randint`, `choice`, `shuffle` and `sample` got a new algorithm in 3.2, What's New says so.

The last row has a trap. In 2.6.8 and 2.7.3 a text seed goes through `hash()`. With `-R` I started 100 processes with `random.seed("seed-42")` and got 100 different first numbers. 3.2.3 and 3.3.0 give 1 number. But a tuple as a seed gives 100 of 100 in 3.3.0 too.

## Fixing it one line at a time

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Grid of 4 variants of the script by 8 Python setups, 100 processes in each cell. With list(set()) and fixed hashes the answers are 0.0324, 0.0324, 0.0294 and 0.0338, with random hashes there are 82, 81, 82 and 77 different answers. With sorted() Python 2 gives 0.0482 and Python 3 gives 0.0388. With its own shuffle every setup gives 0.0482 with up to 14 different last digits. With fsum there is one exact value everywhere.">
  <text x="262.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">fixed hashes</text>
  <text x="540.0" y="16.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">random hashes</text>
  <text x="161.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="228.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="295.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="362.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="439.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.6.8</text>
  <text x="506.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2.7.3</text>
  <text x="573.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.2.3</text>
  <text x="640.5" y="38.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.3.0</text>
  <text x="0.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">list(set())</text>
  <rect x="130" y="52" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0324</text>
  <text x="161.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="52" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0324</text>
  <text x="228.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="52" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0294</text>
  <text x="295.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="52" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="71.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0338</text>
  <text x="362.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="52" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="439.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">99</text>
  <rect x="475" y="52" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">81</text>
  <text x="506.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <rect x="542" y="52" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">82</text>
  <text x="573.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">95</text>
  <rect x="609" y="52" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="71.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">77</text>
  <text x="640.5" y="87.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">98</text>
  <text x="0.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">sorted()</text>
  <rect x="130" y="100" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="161.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="100" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="228.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="100" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0388</text>
  <text x="295.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="100" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0388</text>
  <text x="362.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="100" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="439.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="475" y="100" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="506.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="542" y="100" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0388</text>
  <text x="573.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="609" y="100" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="119.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0388</text>
  <text x="640.5" y="135.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="0.0" y="173.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">own shuffle</text>
  <rect x="130" y="148" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="161.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="148" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="228.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="148" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="295.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="148" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="362.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="148" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="439.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="475" y="148" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="506.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="542" y="148" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="573.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="609" y="148" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="167.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="640.5" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="0.0" y="221.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">math.fsum()</text>
  <rect x="130" y="196" width="63" height="42" class="f-plain"/>
  <text x="161.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="161.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="197" y="196" width="63" height="42" class="f-plain"/>
  <text x="228.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="228.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="264" y="196" width="63" height="42" class="f-plain"/>
  <text x="295.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="295.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="331" y="196" width="63" height="42" class="f-plain"/>
  <text x="362.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="362.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="408" y="196" width="63" height="42" class="f-plain"/>
  <text x="439.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="439.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="475" y="196" width="63" height="42" class="f-plain"/>
  <text x="506.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="506.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="542" y="196" width="63" height="42" class="f-plain"/>
  <text x="573.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="573.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="609" y="196" width="63" height="42" class="f-plain"/>
  <text x="640.5" y="215.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">0.0482</text>
  <text x="640.5" y="231.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
</svg>
<figcaption>Seed 42, 100 processes per cell. Top: the answer. Where there are several, how many different ones (accent). Bottom: how many different values when every binary digit counts. Random hashes are switched on with -R in the first 3 versions and are on by default in 3.3.0. The fixed 3.3.0 column is PYTHONHASHSEED=0.</figcaption>
</figure>

The first row is the naive script. In 800 runs it gave 203 different answers from 0.0066 to 0.0798. (The answer is always a multiple of 0.0002.) With fixed hashes (half of the runs) it looks perfect as long as I stay in one version.

Before the run I wrote down that `sorted()` instead of `list(set())` would fix the random hashes and the difference between versions. I doubted the second. Python 2 gives 0.0482 and Python 3 gives 0.0388, because of the new `shuffle`. My own shuffle on `random()` takes 3 lines and gives 0.0482 everywhere. There is also a shortcut, `random.shuffle(users, random.random)` still takes the old path in 3.2 and 3.3.

It is still not the same number. The order of a dict changes the order of addition, so 800 runs have 15 different values, the largest gap is 7.8e-16. In 2.7.3 I would not see it. There `sorted` with `-R` has 13 different values in 100 runs and `print` shows 12 digits, so all of them look like 0.0482. After `math.fsum` there is one value in 800 runs.

With numbers as ids instead of names the naive script has no random order at all. And 3.3.0 with `PYTHONHASHSEED=0` gives 0.0338 where 3.2.3 gives 0.0294. A set of these 400 names has the same order in both, a dict does not. I did not dig into it.

## 0.0482 is a stable number

Now the script repeats itself, but the truth is 0.03. I ran it with 1000 seeds, from 0 to 999. The standard deviation is 0.0148, half of the lift itself. 216 seeds miss by as much as 42 or more (42 itself is counted) and 24 seeds say that B is worse than A.

I expected the naive script with seed 42 and 1000 values of `PYTHONHASHSEED` to scatter the same way. It would be one more seed that I forgot to write down. But the mean is 0.0424 with a deviation of 0.0116 and there are no negative values. The random numbers for clicks are fixed by 42, only the users change places. I calculated the lift of these numbers alone, with every user allowed to stand anywhere, it is 0.0427. For seeds from 1 to 5, with 200 hash seeds each, the centres are from 0.0244 to 0.0362. If I had averaged these runs I would have got a narrow interval around the wrong number.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Two histograms of the measured lift, 1000 runs each. The naive script with seed 42 and 1000 different hash seeds has mean 0.0424 and no negative values. The fixed script with 1000 different seeds has mean 0.0299, is wider and goes from -0.0186 to 0.0832. The true lift is 0.03, the answer of seed 42 in the fixed script is 0.0482.">
  <line x1="50" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="42.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="190.6" x2="660" y2="190.6" class="f-plain"/>
  <text x="42.0" y="194.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="141.1" x2="660" y2="141.1" class="f-plain"/>
  <text x="42.0" y="145.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="91.7" x2="660" y2="91.7" class="f-plain"/>
  <text x="42.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <rect x="178.1" y="238.0" width="23.4" height="2.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="203.5" y="232.1" width="23.4" height="7.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="228.9" y="220.2" width="23.4" height="19.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="254.3" y="204.4" width="23.4" height="35.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="279.8" y="167.8" width="23.4" height="72.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="305.2" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="330.6" y="80.8" width="23.4" height="159.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.0" y="93.6" width="23.4" height="146.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="381.4" y="84.7" width="23.4" height="155.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="406.8" y="114.4" width="23.4" height="125.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="432.2" y="162.9" width="23.4" height="77.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="457.7" y="201.4" width="23.4" height="38.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="483.1" y="222.2" width="23.4" height="17.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="508.5" y="236.0" width="23.4" height="4.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="533.9" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="584.7" y="239.0" width="23.4" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <polyline points="50.0,239.0 75.4,239.0 75.4,240.0 100.8,240.0 100.8,231.1 126.2,231.1 126.3,226.2 151.7,226.2 151.7,213.3 177.1,213.3 177.1,205.4 202.5,205.4 202.5,167.8 227.9,167.8 227.9,164.8 253.3,164.8 253.3,120.3 278.7,120.3 278.8,95.6 304.2,95.6 304.2,117.4 329.6,117.4 329.6,121.3 355.0,121.3 355.0,148.0 380.4,148.0 380.4,158.9 405.8,158.9 405.8,201.4 431.3,201.4 431.2,227.1 456.7,227.1 456.7,220.2 482.1,220.2 482.1,235.1 507.5,235.1 507.5,240.0 532.9,240.0 532.9,239.0 558.3,239.0 558.3,239.0 583.7,239.0 583.7,240.0 609.2,240.0 609.2,240.0 634.6,240.0 634.6,240.0 660.0,240.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <line x1="304.2" y1="48" x2="304.2" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="298.2" y="56.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">true lift 0.03</text>
  <line x1="396.7" y1="48" x2="396.7" y2="240" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="402.7" y="56.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">seed 42: 0.0482</text>
  <text x="50.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-0.02</text>
  <text x="151.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.00</text>
  <text x="253.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.02</text>
  <text x="355.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.04</text>
  <text x="456.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.06</text>
  <text x="558.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.08</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.10</text>
  <rect x="50" y="10" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="70.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">seed 42, 1000 hash seeds</text>
  <line x1="350" y1="16" x2="364" y2="16" style="stroke:var(--ink);stroke-width:1.5"/>
  <text x="372.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">fixed script, 1000 seeds</text>
  <text x="0.0" y="56.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">runs</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">measured lift</text>
</svg>
<figcaption>1000 runs each, bins of 0.005. Bars: seed 42 in every run, only PYTHONHASHSEED changes. Line: the fixed script, seeds from 0 to 999.</figcaption>
</figure>

## Checking my own shuffle against the truth

The shuffle is mine now, so its errors are mine too. I planted 2 classic ones. In the first one the element is swapped with any position of the list on every step. With seed 42 it gives 0.0556 in all 8 setups, 20 processes in each, the same to the last bit. Over 4000 seeds the mean lift is 0.0418. Of the names from the first half 52.3% stay in it, so B gets the users who click more. Without any clicks the mean rate in B is already 0.0116 higher.

One run cannot show this and 10 seeds cannot either, their mean is 0.0331. At 30 seeds it is 0.0434, which is 4.1 standard errors from 0.03.

The second error is `i` instead of `i + 1`, then no element can stay where it was. The mean is 0.0294, which is 2.5 standard errors below the truth. After the run I calculated it on paper, it should be 0.0295. So the error is real, but 4000 seeds barely see it. The right shuffle has 0.0299 with a standard error of 0.0002.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Mean lift over 10, 30, 100, 300, 1000 and 4000 seeds with bars of 2 standard errors, for 3 shuffles. The right shuffle closes in on 0.03 and ends at 0.0299. Swap with any position ends at 0.0418. Off by one ends at 0.0294, almost the same as the right one.">
  <line x1="60" y1="250.0" x2="660" y2="250.0" class="f-plain"/>
  <text x="52.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.02</text>
  <line x1="60" y1="191.1" x2="660" y2="191.1" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="52.0" y="195.1" text-anchor="end" class="f-mono f-accent" style="font-size:11px">0.03</text>
  <line x1="60" y1="132.3" x2="660" y2="132.3" class="f-plain"/>
  <text x="52.0" y="136.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.04</text>
  <line x1="60" y1="73.4" x2="660" y2="73.4" class="f-plain"/>
  <text x="52.0" y="77.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.05</text>
  <line x1="96.0" y1="107.8" x2="96.0" y2="231.4" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="96.0" cy="169.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="110.0" y1="125.5" x2="110.0" y2="220.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="110.0" cy="173.1" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="124.0" y1="120.3" x2="124.0" y2="232.8" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="124.0" cy="176.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="110.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="196.0" y1="129.2" x2="196.0" y2="192.6" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="196.0" cy="160.9" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="210.0" y1="73.9" x2="210.0" y2="151.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="210.0" cy="112.4" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="224.0" y1="139.4" x2="224.0" y2="203.4" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="224.0" cy="171.4" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="210.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="296.0" y1="169.5" x2="296.0" y2="202.0" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="296.0" cy="185.7" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="310.0" y1="92.4" x2="310.0" y2="128.0" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="310.0" cy="110.2" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="324.0" y1="173.9" x2="324.0" y2="207.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="324.0" cy="190.8" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="396.0" y1="178.9" x2="396.0" y2="198.2" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="396.0" cy="188.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="410.0" y1="111.4" x2="410.0" y2="132.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="410.0" cy="121.7" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="424.0" y1="186.3" x2="424.0" y2="205.0" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="424.0" cy="195.7" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="410.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="496.0" y1="186.1" x2="496.0" y2="197.1" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="496.0" cy="191.6" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="510.0" y1="116.0" x2="510.0" y2="127.1" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="510.0" cy="121.5" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="524.0" y1="187.8" x2="524.0" y2="198.7" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="524.0" cy="193.3" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="510.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="596.0" y1="189.2" x2="596.0" y2="194.7" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="596.0" cy="192.0" r="4" style="fill:var(--ink);stroke:none"/>
  <line x1="610.0" y1="119.2" x2="610.0" y2="124.7" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="610.0" cy="122.0" r="4" style="fill:var(--accent);stroke:none"/>
  <line x1="624.0" y1="191.8" x2="624.0" y2="197.2" style="stroke:var(--muted);stroke-width:2"/>
  <circle cx="624.0" cy="194.5" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="610.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4000</text>
  <circle cx="65" cy="16" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="76.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">right shuffle</text>
  <circle cx="197" cy="16" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="208.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">swap with any position</text>
  <circle cx="391" cy="16" r="4" style="fill:var(--muted);stroke:none"/>
  <text x="402.0" y="20.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">off by one</text>
  <text x="660.0" y="288.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">number of seeds</text>
</svg>
<figcaption>Mean over the first n seeds, bars are 2 standard errors. The true lift of 0.03 is the horizontal line. Off by one ends at 0.0294 and at this scale it sits next to the right shuffle.</figcaption>
</figure>

I will keep the constant with the truth and the loop over seeds, which here is 2 lines. The seed will be an integer. I will also print with `repr` and write the Python version next to the number.

## What I didn't check

NumPy has its own generator and I did not touch it. All builds are 64-bit Linux, on 32 bits the order of a set can be different. Functions in the table are compared by the first values of one seed, except `random()`. The lift was chosen to be about 2 standard deviations of one run, with a larger one the seed would matter less.
