---
title: "Nothing changed in the script and 24 of my 36 agents ran again"
description: "A measurement here is 36 agents and I have been calling the way I run them deterministic without ever measuring what the word covers. The pipeline shape beats the barrier by 23.9 percent of wall clock. It also hands out call numbers by who finished first, which means a journal keyed by position replays 12 of 36 agents on a run where nothing was edited at all."
date: 2026-09-04
lang: en
translationKey: deterministic-orchestration
tags: ["agents", "performance", "reliability"]
---
A measurement here is rarely one agent. A normal job for me is 12 things to look at and 3 things to do with each one: read the source, then pull the numbers out and check them back against it. That comes to 36 agents and the thing that runs them is a JavaScript file with a loop in it. I describe that setup as deterministic whenever somebody asks how it works. This week I sat down to find out which part of the run the word covers.

What I want out of it is resume. A run of 36 costs money and about 20 minutes of waiting. So when I fix a sentence in the third stage I want to pay for the third stage and take the other 24 agents out of the journal of the previous run. That is the whole promise. It holds only if the second run asks for the same things in the same order and I had never checked that it does.

## The bench

The orchestrator is 118 lines. There is `agent()`, `parallel()` which puts a barrier between stages, `pipeline()` which does not, a FIFO semaphore for the concurrency cap and a journal that records every call. Nothing in it talks to a model. An agent there waits a given number of milliseconds and returns a string built from its own name.

The milliseconds are real. I recorded 30 calls through the claude CLI 2.1.235 on `claude-opus-5`, from an empty directory. A `CLAUDE.md` sitting in the working folder goes into the prompt silently and moves both the answer and the time. Single word answers averaged 6742 ms. The 700 word ones averaged 40164 ms, with a middle weight at 11043. The whole set ran from 5790 to 54520 ms and I replay those durations divided by 20 so that a grid of 36 finishes in seconds. Node is 22.23.1 on 4 cores.

While I was there I put a number on the process boundary, since I had never done that either. The same run with real child processes instead of timers took 5674 ms against 5497, which is 4.9 ms per agent. A repeat gave 5730 and 6.5 ms. Next to an agent that needs 6 to 55 seconds either number is nothing. It does not price my scheduler though. The semaphore and the journal run in both arms and cancel out, so the loop around the agents stays unpriced.

## Barrier against pipeline

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="A grouped bar chart of wall clock in milliseconds for 36 agents arranged as 12 items over 3 stages. 4 groups by concurrency cap: 4, 8, 16 and 36. In every group the barrier bar is taller than the pipeline bar: 8514 against 6986, 6864 against 5497, 6643 against 5054, 6644 against 5053. The gap is 17.9, 19.9, 23.9, 23.9 percent. 2 dashed lines mark the floors, 6630 for the barrier and 5044 for the pipeline. The biggest caps land just above them.">
  <path d="M 56 206 L 490 206" class="f-plain"/>
  <path d="M 56 34 L 56 206" class="f-plain"/>
  <path d="M 51 206 L 56 206" class="f-plain"/>
  <text x="47" y="209.5" class="f-label f-muted" text-anchor="end">0</text>
  <path d="M 51 148.66666666666669 L 56 148.66666666666669" class="f-plain"/>
  <text x="47" y="152.16666666666669" class="f-label f-muted" text-anchor="end">3000</text>
  <path d="M 51 91.33333333333334 L 56 91.33333333333334" class="f-plain"/>
  <text x="47" y="94.83333333333334" class="f-label f-muted" text-anchor="end">6000</text>
  <path d="M 51 34 L 56 34" class="f-plain"/>
  <text x="47" y="37.5" class="f-label f-muted" text-anchor="end">9000</text>
  <path d="M 56 79.29333333333332 L 490 79.29333333333332" class="f-line" stroke-dasharray="3 3"/>
  <text x="496" y="82.79333333333332" class="f-label f-muted">barrier floor 6630</text>
  <path d="M 56 109.60355555555556 L 490 109.60355555555556" class="f-line" stroke-dasharray="3 3"/>
  <text x="496" y="113.10355555555556" class="f-label f-muted">pipeline floor 5044</text>
  <rect x="80.25" y="43.28800000000001" width="26" height="162.712" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="114.25" y="72.48977777777776" width="26" height="133.51022222222224" class="f-box"/>
  <text x="93.25" y="38.28800000000001" class="f-label f-muted" text-anchor="middle">8514</text>
  <text x="127.25" y="67.48977777777776" class="f-label f-accent" text-anchor="middle">6986</text>
  <text x="110.25" y="222" class="f-label f-muted" text-anchor="middle">cap 4</text>
  <text x="110.25" y="236" class="f-label f-accent" text-anchor="middle">-17.9%</text>
  <rect x="188.75" y="74.82133333333331" width="26" height="131.1786666666667" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="222.75" y="100.94622222222223" width="26" height="105.05377777777777" class="f-box"/>
  <text x="201.75" y="69.82133333333331" class="f-label f-muted" text-anchor="middle">6864</text>
  <text x="235.75" y="95.94622222222223" class="f-label f-accent" text-anchor="middle">5497</text>
  <text x="218.75" y="222" class="f-label f-muted" text-anchor="middle">cap 8</text>
  <text x="218.75" y="236" class="f-label f-accent" text-anchor="middle">-19.9%</text>
  <rect x="297.25" y="79.04488888888888" width="26" height="126.95511111111112" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="331.25" y="109.41244444444445" width="26" height="96.58755555555555" class="f-box"/>
  <text x="310.25" y="74.04488888888888" class="f-label f-muted" text-anchor="middle">6643</text>
  <text x="344.25" y="104.41244444444445" class="f-label f-accent" text-anchor="middle">5054</text>
  <text x="327.25" y="222" class="f-label f-muted" text-anchor="middle">cap 16</text>
  <text x="327.25" y="236" class="f-label f-accent" text-anchor="middle">-23.9%</text>
  <rect x="405.75" y="79.02577777777778" width="26" height="126.97422222222222" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="439.75" y="109.43155555555556" width="26" height="96.56844444444444" class="f-box"/>
  <text x="418.75" y="74.02577777777778" class="f-label f-muted" text-anchor="middle">6644</text>
  <text x="452.75" y="104.43155555555556" class="f-label f-accent" text-anchor="middle">5053</text>
  <text x="435.75" y="222" class="f-label f-muted" text-anchor="middle">cap 36</text>
  <text x="435.75" y="236" class="f-label f-accent" text-anchor="middle">-23.9%</text>
  <text x="20" y="18" class="f-label f-muted">wall clock of 36 agents, barrier against pipeline, ms</text>
  <rect x="496" y="26" width="10" height="10" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <text x="510" y="35" class="f-label f-muted">barrier</text>
  <rect x="496" y="42" width="10" height="10" class="f-box"/>
  <text x="510" y="51" class="f-label f-muted">pipeline</text>
</svg>
<figcaption>36 agents as 12 items over 3 stages. Durations come from 30 recorded calls and are replayed divided by 20. The dashed lines are the floor of each shape. At a cap of 36 both come within 14 ms of it.</figcaption>
</figure>

At a cap of 4 the barrier version takes 8514 ms and the pipeline version 6986. Lift the cap so all 36 can run at once and it becomes 6644 against 5053, a gap of 23.9 percent. Both shapes are within 14 ms of their own floor at that point. A barrier cannot finish sooner than the sum of the slowest agent in each stage, which is 6630 ms on this grid. The pipeline cannot finish sooner than the slowest single chain of 3, which is 5044.

I wanted to be sure that the spread is what pays for this, so I ran the same grid again with every duration set to the mean. The barrier then costs nothing at caps of 4, 16 and 36. At a cap of 8 it still costs 16.7 percent, because 12 items do not divide by 8 and the last wave of each stage runs 4 wide while 4 slots sit idle.

## The measurement that lied to me

Then I ran the same grid 30 times at a cap of 4 and hashed the order in which the calls were made. Both shapes came back with 1 distinct order out of 30. Completion order was 2 out of 30 for the barrier and 1 for the pipeline. A repeat of the whole bench gave 1 for the barrier too, so even that 2 was timer noise. Perfectly reproducible. I believed it for about 10 minutes, until I noticed that my fake agents always took exactly the same time. Real ones never do. I sent the same prompt 24 times across 2 rounds and it came back between 7347 and 10586 ms.

So I put that spread back in. Every replayed duration now gets multiplied by one of those 24 measured ratios. With the jitter in place the barrier still gives 1 distinct call order in 30 runs and the pipeline gives 26. Completion order is 30 out of 30 for both.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="3 rows of boxes showing which call gets ordinals 10 to 15. The barrier row is i10s0, i11s0, i0s1, i1s1, i2s1, i3s1 and it comes out the same in every run. 2 pipeline rows from 2 different runs of the same script read i10s0, i11s0, i1s1, i0s1, i3s1, i4s1 and i10s0, i11s0, i1s1, i3s1, i0s1, i4s1. They agree up to ordinal 12 and disagree at ordinal 13, which a dashed line marks as the place where 2 runs of the same script stop matching.">
  <text x="20" y="18" class="f-label f-muted">who gets which ordinal and what the journal can replay</text>
  <text x="196" y="42" class="f-label f-muted" text-anchor="middle">10</text>
  <text x="258" y="42" class="f-label f-muted" text-anchor="middle">11</text>
  <text x="320" y="42" class="f-label f-muted" text-anchor="middle">12</text>
  <text x="382" y="42" class="f-label f-muted" text-anchor="middle">13</text>
  <text x="444" y="42" class="f-label f-muted" text-anchor="middle">14</text>
  <text x="506" y="42" class="f-label f-muted" text-anchor="middle">15</text>
  <text x="20" y="73" class="f-label f-muted">barrier</text>
  <rect x="168" y="58" width="56" height="22" class="f-plain"/>
  <text x="196" y="73" class="f-label f-muted" text-anchor="middle">i10s0</text>
  <rect x="230" y="58" width="56" height="22" class="f-plain"/>
  <text x="258" y="73" class="f-label f-muted" text-anchor="middle">i11s0</text>
  <rect x="292" y="58" width="56" height="22" class="f-plain"/>
  <text x="320" y="73" class="f-label f-muted" text-anchor="middle">i0s1</text>
  <rect x="354" y="58" width="56" height="22" class="f-plain"/>
  <text x="382" y="73" class="f-label f-muted" text-anchor="middle">i1s1</text>
  <rect x="416" y="58" width="56" height="22" class="f-plain"/>
  <text x="444" y="73" class="f-label f-muted" text-anchor="middle">i2s1</text>
  <rect x="478" y="58" width="56" height="22" class="f-plain"/>
  <text x="506" y="73" class="f-label f-muted" text-anchor="middle">i3s1</text>
  <text x="20" y="111" class="f-label f-muted">pipeline, run A</text>
  <rect x="168" y="96" width="56" height="22" class="f-plain"/>
  <text x="196" y="111" class="f-label f-muted" text-anchor="middle">i10s0</text>
  <rect x="230" y="96" width="56" height="22" class="f-plain"/>
  <text x="258" y="111" class="f-label f-muted" text-anchor="middle">i11s0</text>
  <rect x="292" y="96" width="56" height="22" class="f-plain"/>
  <text x="320" y="111" class="f-label f-muted" text-anchor="middle">i1s1</text>
  <rect x="354" y="96" width="56" height="22" class="f-box"/>
  <text x="382" y="111" class="f-label f-accent" text-anchor="middle">i0s1</text>
  <rect x="416" y="96" width="56" height="22" class="f-plain"/>
  <text x="444" y="111" class="f-label f-muted" text-anchor="middle">i3s1</text>
  <rect x="478" y="96" width="56" height="22" class="f-plain"/>
  <text x="506" y="111" class="f-label f-muted" text-anchor="middle">i4s1</text>
  <text x="20" y="149" class="f-label f-muted">pipeline, run B</text>
  <rect x="168" y="134" width="56" height="22" class="f-plain"/>
  <text x="196" y="149" class="f-label f-muted" text-anchor="middle">i10s0</text>
  <rect x="230" y="134" width="56" height="22" class="f-plain"/>
  <text x="258" y="149" class="f-label f-muted" text-anchor="middle">i11s0</text>
  <rect x="292" y="134" width="56" height="22" class="f-plain"/>
  <text x="320" y="149" class="f-label f-muted" text-anchor="middle">i1s1</text>
  <rect x="354" y="134" width="56" height="22" class="f-box"/>
  <text x="382" y="149" class="f-label f-accent" text-anchor="middle">i3s1</text>
  <rect x="416" y="134" width="56" height="22" class="f-plain"/>
  <text x="444" y="149" class="f-label f-muted" text-anchor="middle">i0s1</text>
  <rect x="478" y="134" width="56" height="22" class="f-plain"/>
  <text x="506" y="149" class="f-label f-muted" text-anchor="middle">i4s1</text>
  <path d="M 382 96 L 382 162" class="f-line" stroke-dasharray="3 3"/>
  <text x="390" y="176" class="f-label f-accent">prefix breaks here 13</text>
</svg>
<figcaption>Ordinals 10 to 15, from 1 barrier run and 2 pipeline runs. The barrier hands them out in item order every time. The pipeline hands them out to whoever finished first, so 2 runs of the same script stop matching.</figcaption>
</figure>

The reason is where the ordinal comes from. In the barrier shape the 12 calls of a stage are all made in one synchronous pass, so call number 0 is item 0 of stage 0 in every run there will ever be. In the pipeline shape a call is made when the previous stage of that item returns, so the number goes to whoever finished first.

## The journal

My journal keys its entries by ordinal and replays the longest prefix that still matches, which is the obvious rule when the script is a loop. With the barrier that rule behaves exactly as advertised. Nothing edited gives 36 hits out of 36, an edit to the last stage gives 24, an edit to the middle stage gives 12 and an edit to the first stage gives 0.

The pipeline with the same key recovers 12 of 36 with nothing edited at all and nothing changed in the inputs. 24 agents are bought a second time. The first 12 always match because those are the 12 stage 1 calls the pipeline makes up front, before anything can return. From call 12 onwards the journal and the resume run disagree. 2 fresh runs of the same script first disagree at call 13. The resume run disagrees 1 call earlier. The reason is sharper than noise. A replayed agent returns at once, so every stage 2 call goes out in item order and number 12 lands on item 0. I tried that on 60 grids and it held on all 60. In the journal number 12 belongs to whoever won the race, which on this grid was item 1.

That 12 is not a law though. Of those 60 grids 47 broke at exactly 12, 12 broke at 13 and 1 at 14, because now and then item 0 does win its own race.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="A grouped bar chart of how many of 36 agents come back from the journal on resume, for the pipeline shape. 4 groups by what was edited first: nothing, stage 1, stage 2, stage 3. In each group the key by ordinal is compared with the key by content: 12 against 36, 0 against 24, 12 against 24, 12 against 24.">
  <path d="M 52 198 L 616 198" class="f-plain"/>
  <path d="M 52 56 L 52 198" class="f-plain"/>
  <path d="M 47 198 L 52 198" class="f-plain"/>
  <text x="43" y="201.5" class="f-label f-muted" text-anchor="end">0</text>
  <path d="M 47 150.66666666666669 L 52 150.66666666666669" class="f-plain"/>
  <text x="43" y="154.16666666666669" class="f-label f-muted" text-anchor="end">12</text>
  <path d="M 47 103.33333333333334 L 52 103.33333333333334" class="f-plain"/>
  <text x="43" y="106.83333333333334" class="f-label f-muted" text-anchor="end">24</text>
  <path d="M 47 56 L 52 56" class="f-plain"/>
  <text x="43" y="59.5" class="f-label f-muted" text-anchor="end">36</text>
  <rect x="92.5" y="150.66666666666669" width="26" height="47.333333333333314" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="126.5" y="56" width="26" height="142" class="f-box"/>
  <text x="105.5" y="145.66666666666669" class="f-label f-muted" text-anchor="middle">12</text>
  <text x="139.5" y="51" class="f-label f-accent" text-anchor="middle">36</text>
  <text x="122.5" y="214" class="f-label f-muted" text-anchor="middle">nothing</text>
  <rect x="233.5" y="198" width="26" height="0" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="267.5" y="103.33333333333334" width="26" height="94.66666666666666" class="f-box"/>
  <text x="246.5" y="193" class="f-label f-muted" text-anchor="middle">0</text>
  <text x="280.5" y="98.33333333333334" class="f-label f-accent" text-anchor="middle">24</text>
  <text x="263.5" y="214" class="f-label f-muted" text-anchor="middle">stage 1</text>
  <rect x="374.5" y="150.66666666666669" width="26" height="47.333333333333314" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="408.5" y="103.33333333333334" width="26" height="94.66666666666666" class="f-box"/>
  <text x="387.5" y="145.66666666666669" class="f-label f-muted" text-anchor="middle">12</text>
  <text x="421.5" y="98.33333333333334" class="f-label f-accent" text-anchor="middle">24</text>
  <text x="404.5" y="214" class="f-label f-muted" text-anchor="middle">stage 2</text>
  <rect x="515.5" y="150.66666666666669" width="26" height="47.333333333333314" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <rect x="549.5" y="103.33333333333334" width="26" height="94.66666666666666" class="f-box"/>
  <text x="528.5" y="145.66666666666669" class="f-label f-muted" text-anchor="middle">12</text>
  <text x="562.5" y="98.33333333333334" class="f-label f-accent" text-anchor="middle">24</text>
  <text x="545.5" y="214" class="f-label f-muted" text-anchor="middle">stage 3</text>
  <text x="20" y="18" class="f-label f-muted">agents replayed from the journal, out of 36</text>
  <text x="334" y="242" class="f-label f-muted" text-anchor="middle">what was edited before resume</text>
  <rect x="20" y="28" width="10" height="10" class="f-plain" fill="var(--muted)" fill-opacity="0.35"/>
  <text x="34" y="37" class="f-label f-muted">key by ordinal</text>
  <rect x="220" y="28" width="10" height="10" class="f-box"/>
  <text x="234" y="37" class="f-label f-muted">key by content</text>
</svg>
<figcaption>How many of 36 agents come back from the journal when a pipeline run is resumed, mean of 10 runs per point.</figcaption>
</figure>

Keying by the task instead of by its position fixes it. Both shapes then recover 36 of 36 when nothing changed and 24 of 36 after an edit to any single stage. That is the honest number for a 3 stage job, since a changed stage is a third of the work. It only holds while the prompt of an agent does not carry the text of an earlier one. Half of my real stages do exactly that, so their key moves whenever an answer above them moves.

## The agents themselves do not repeat

That same prompt, 24 times, gave 24 distinct answers, between 375 and 473 characters long. A resumed run therefore puts old answers next to new ones and it is never the run I would have got by starting over. Nothing about a result is reproducible here, so the only things a journal can hold still are the plan and the key.

## What I did not check

The orchestrator never calls a model, so all of this is about scheduling and none of it about quality. One machine, 4 cores, no network and no rate limits. No agent fails anywhere in the bench, which is the case where resume matters most and I have no number for it. One grid, one seed, 3 repeats per point in the timing bench against 30 in the ordering one and 10 in the resume one. Those 10 resume runs all read one and the same journal, so they could not have disagreed with each other. The scheduler itself is never priced apart from the process it spawns. My content key is also just the task name, where a real one would be a hash of the prompt and the options.

I have moved my own journal to the content key and left the pipeline where it was. The next thing worth measuring is what a failure in the middle does to all of this.
