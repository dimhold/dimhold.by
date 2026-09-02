---
title: "The same code beat itself by 33 percent"
description: "I declared one function twice and timed the 2 copies against each other. On a single pair of rounds the identical code showed a 32.9 percent win, 10.6 percent of pairs produced a winner by more than 5 percent, and the first round of all ran 3.57 times slower than the settled median. Anything under about 3 percent on this machine is not a result."
date: 2013-09-11
lang: en
translationKey: same-code-beats-itself
---

Somebody posts a benchmark, one version is 8 percent faster, the discussion moves on to why. I have posted numbers like that myself. What I had never done is find out what my own machine says when there is nothing to find, so I wrote the smallest version of that: 1 function, declared twice under 2 names, timed against each other. The true difference between them is 0 by construction.

They alternate inside each round, A then B, so that any drift in the machine hits both. 200 rounds, a loop over 200000 doubles, a quiet Linux server with 4 cores and nothing else on it.

The first round took 2.118 milliseconds. The settled median is 0.593. That is 3.57 times, the only part of this everybody already knows about.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="The spread of single rounds for one function after warmup. The minimum is 0.573 milliseconds, the median 0.593, the ninetieth percentile 0.599, the ninety ninth percentile 0.746 and the maximum 0.777. The bulk sits in a narrow band near the median while the top 1 percent stretches out almost 4 times further. The first round of all, at 2.118 milliseconds, is far off the right edge of this scale.">
  <text x="80" y="40" class="f-label f-muted">settled rounds, milliseconds</text>
  <path d="M 80 120 L 560 120" class="f-line"/>
  <path d="M 124 110 L 124 130" class="f-line"/>
  <path d="M 163 106 L 163 134" class="f-line f-accent"/>
  <path d="M 174 110 L 174 130" class="f-line"/>
  <path d="M 456 110 L 456 130" class="f-line"/>
  <path d="M 516 110 L 516 130" class="f-line"/>
  <rect x="124" y="116" width="50" height="8" class="f-plain"/>
  <text x="90" y="100" class="f-label f-muted">min 0.573</text>
  <text x="130" y="150" class="f-label f-accent">p50 0.593</text>
  <text x="150" y="84" class="f-label f-muted">p90 0.599</text>
  <text x="424" y="100" class="f-label f-muted">p99 0.746</text>
  <text x="490" y="150" class="f-label f-muted">max 0.777</text>
  <path d="M 566 120 L 600 120" class="f-line f-accent" stroke-dasharray="3 3"/>
  <text x="300" y="180" class="f-label f-accent">first round of all: 2.118, off this scale</text>
</svg>
<figcaption>Half the rounds land inside a band 26 microseconds wide. The last 1 percent reaches 4 times further out than the whole rest of the distribution. That tail is what decides a benchmark run once.</figcaption>
</figure>

Now the part I did not know. Take 1 round of A with the 1 round of B beside it. That is what a benchmark run once actually is. Out of 180 settled pairs, 19 of them, 10.6 percent, hand you a winner by more than 5 percent. The worst single pair puts identical code 32.9 percent ahead of itself.

So a person who runs each version once, sees 8 percent then writes it up is not doing anything unusual. They are sampling a distribution that produces a 5 percent lie 1 time in 9.

## How many rounds buy how much

The fix is repetition, which everybody says. The useful question is how much repetition buys how much certainty. I cut the settled rounds into windows and asked how far the median wanders between windows of the same size.

<figure class="fig">
<svg viewBox="0 0 640 240" role="img" aria-label="How far the median wanders between windows, by window size. With windows of 1 round the median wanders 35.6 percent. With 3 rounds it is 5.1 percent, with 5 rounds 2.8 percent, with 10 rounds 2.3 percent and with 30 rounds 0.2 percent. The drop from 1 round to 3 rounds is by far the largest.">
  <text x="60" y="26" class="f-label f-muted">how far the median moves between windows, percent</text>
  <path d="M 80 190 L 600 190" class="f-line"/>
  <rect x="90" y="41" width="60" height="149" class="f-accent"/>
  <text x="120" y="34" class="f-mono f-ink" text-anchor="middle">35.6</text>
  <rect x="190" y="169" width="60" height="21" class="f-box"/>
  <text x="220" y="162" class="f-mono f-ink" text-anchor="middle">5.1</text>
  <rect x="290" y="178" width="60" height="12" class="f-box"/>
  <text x="320" y="171" class="f-mono f-ink" text-anchor="middle">2.8</text>
  <rect x="390" y="180" width="60" height="10" class="f-box"/>
  <text x="420" y="173" class="f-mono f-ink" text-anchor="middle">2.3</text>
  <rect x="490" y="189" width="60" height="1" class="f-box"/>
  <text x="520" y="182" class="f-mono f-ink" text-anchor="middle">0.2</text>
  <text x="120" y="208" class="f-label f-muted" text-anchor="middle">1</text>
  <text x="220" y="208" class="f-label f-muted" text-anchor="middle">3</text>
  <text x="320" y="208" class="f-label f-muted" text-anchor="middle">5</text>
  <text x="420" y="208" class="f-label f-muted" text-anchor="middle">10</text>
  <text x="520" y="208" class="f-label f-muted" text-anchor="middle">30</text>
  <text x="80" y="228" class="f-label f-muted">rounds per window</text>
</svg>
<figcaption>3 rounds instead of 1 removes 6 sevenths of the wander. Going from 3 to 10 buys a little more. The step from 10 to 30 is what takes the number under 1 percent.</figcaption>
</figure>

1 round wanders 35.6 percent. 3 rounds wander 5.1. 5 rounds 2.8, 10 rounds 2.3, 30 rounds 0.2. The shape is the useful part: almost all of the benefit is in the first handful of repetitions. The last stretch from 10 to 30 is what buys the precision you need to defend a small claim.

## The 2 percent that would not sit still

The medians of A and B came out 2.04 percent apart. Identical code. 2 percent is exactly the size of the difference people write blog posts about, so I went looking for the cause. My guess was position: A always ran first in the round and B second, so the second one might land on a warmer cache.

I swapped them. In the swapped order the sign flipped, minus 1.84 percent, which fits the guess. Then I ran both orders again. The normal order gave plus 2.24 percent, then minus 0.07. The swapped order gave plus 0.12.

3 runs out of 5 show the ordering effect and 2 show nothing at all. I cannot even call the explanation stable. A 2 percent difference on this machine is not a small effect I could chase with a better test. It is unattributable at this sample size. The honest report is that I do not know where it came from.

## What I did not check

Whether any of this transfers. This is 1 tight numeric loop with no allocation, so the garbage collector never runs. The biggest source of jitter in a real program is absent from the whole experiment. I did not touch frequency scaling on the host, which moves cores around under exactly this kind of load. And I did not repeat any of it on a second machine, which means the noise floor I measured belongs to this box on this evening.

The narrow claim is a habit rather than a number. Before believing a difference, measure the noise floor of the setup that produced it by comparing something to itself, then treat anything under that floor as nothing. Here the floor is around 2 to 3 percent at 200 rounds. Single runs are worthless up to 33.
