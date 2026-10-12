---
title: "I quoted Haiku's $8k miss twice. The miss that matters is $684k and comes from dividing by 0.10"
description: "In August I quoted a Haiku 4.5 miss on a 36 month cash forecast twice, $5,775 short and then $8,451 off, from 1 answer per run. I asked the same question 150 times with no tools. 7 of 30 Haiku answers were $684k too high. With the working shown every such answer divides by 0.10 where the formula says 1.11 - 1. The smaller misses track the error in its own 1.11^36. Asked to flag doubt, it marked 7 close answers and none of the 4 big ones."
date: 2026-10-12
lang: en
translationKey: haiku-cash-miss
tags: ["llm", "numbers", "reliability"]
---
In August I gave Anthropic models 10 pieces of SaaS arithmetic with every tool taken away. One of them was a cash forecast: $420,000 in the bank and $40,000 spent every month, with revenue starting at $18,000 and growing 11% a month. Opus 5 got it to the dollar. Haiku 4.5 did not. I quoted its miss in public twice. On 12 August on X it was $5,775 short. On 18 August on LinkedIn, after a rerun with 4 models, it was $8,451 off. I added that the number still looks right. That was my point: nothing in the answer says it is wrong.

That example was convenient and I used it as a fact about Haiku. But I had 2 samples, one per run. They did not even agree on the sign. I never asked what a third one would look like.

There is also a smaller embarrassment. Both posts call it a forecast over 5 years, while the question says 36 months. The `results.json` of the run says `months: 36`. The table in the public repository says 60. 2 other rows of that table have wrong month counts too.

## 150 calls on one question

On 12 October I ran the same question many times. Claude Code 2.1.292, `claude -p` from an empty folder, `--tools ""` plus an empty MCP config, so the model has nothing to compute with. The answering model is checked in `modelUsage`, not taken from the flag. The truth is computed in Python `Decimal`: the answer is $5,822,959.30.

First the original prompt, one line `ANSWER: <number>`, 30 times for Haiku and 10 for Opus. Opus was exact 9 of 10, the tenth was $4.19 off. Haiku was exact 0 of 30. 23 of its answers were within $17k of the truth, median miss $2,556, 9 above and 14 below. The other 7 sat around $6,507,000, which is $684k too much.

I first thought the 7 big ones were a misread question and started counting months. 37 months of revenue gives $6,593,685, 35 months of spend gives $5,862,959. Neither fits. What fits is dividing the sum of the series by 0.10 instead of 0.11:

```
420000 + 18000 * (1.11^36 - 1) / 0.10 - 40000 * 36 = 6,507,255
```

All 7 answers are within $6,600 of that number. This prompt has no working in the reply, so for these 7 it is a match of numbers and not something I saw.

## Where 0.10 comes from

To see it I asked for the working, 20 more calls. 11 of 20 ended near $6.5M, more often than with the short prompt. In every one of the 11 the working divides by `0.10` or `0.1`. All 9 good ones divide by `0.11`. In 6 of the 11 the line just before it has the denominator written out correctly:

```
Total Revenue = $18,000 × (1.11³⁶ - 1)/(1.11 - 1)
= $18,000 × (1.11³⁶ - 1)/0.10
```

The model writes the general formula, puts in 1.11 and on the next line `1.11 - 1` is `0.10`. In 3 of the 11 the step is not written at all and the working goes straight to `0.10`. It is a slip of one digit in the easiest step of the problem. That one digit is what multiplies the revenue by 1.1.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="Top: the line 18000 × (1.11³⁶ − 1) / (1.11 − 1) from Haiku's working. In 9 of 20 calls it becomes / 0.11 and the answer is near $5,822,959. In 11 of 20 it becomes / 0.10 and the answer is near $6,507,255. Bottom: the 30 answers to the short prompt on one axis from 5.8 to 6.55 million dollars. 23 sit at the true answer $5,822,959, 7 sit at $6,507,255, the value of dividing by 0.10.">
  <text x="14" y="18" class="f-label f-muted">the working, 20 calls</text>
  <rect x="130" y="28" width="380" height="34" rx="4" class="f-plain"/>
  <text x="320" y="50" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">18000 × (1.11³⁶ − 1) / (1.11 − 1)</text>
  <path d="M 260 62 L 170 92" class="f-line"/>
  <path d="M 380 62 L 470 92" class="f-line"/>
  <rect x="40" y="94" width="260" height="56" rx="4" class="f-plain"/>
  <text x="170" y="116" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">/ 0.11</text>
  <text x="170" y="138" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">9 of 20 · $5,822,959</text>
  <rect x="340" y="94" width="260" height="56" rx="4" class="f-box"/>
  <text x="470" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:15px">/ 0.10</text>
  <text x="470" y="138" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">11 of 20 · $6,507,255</text>
  <text x="14" y="184" class="f-label f-muted">30 short answers, same question</text>
  <line x1="40" y1="262" x2="600" y2="262" class="f-line"/>
  <line x1="40.0" y1="262" x2="40.0" y2="266" class="f-line"/>
  <text x="40.0" y="279" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">$5.8M</text>
  <line x1="189.3" y1="262" x2="189.3" y2="266" class="f-line"/>
  <text x="189.3" y="279" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">$6.0M</text>
  <line x1="338.7" y1="262" x2="338.7" y2="266" class="f-line"/>
  <text x="338.7" y="279" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">$6.2M</text>
  <line x1="488.0" y1="262" x2="488.0" y2="266" class="f-line"/>
  <text x="488.0" y="279" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">$6.4M</text>
  <circle cx="57.1" cy="256" r="3" class="f-ink"/>
  <circle cx="57.1" cy="249" r="3" class="f-ink"/>
  <circle cx="57.1" cy="242" r="3" class="f-ink"/>
  <circle cx="57.1" cy="235" r="3" class="f-ink"/>
  <circle cx="64.1" cy="256" r="3" class="f-ink"/>
  <circle cx="64.1" cy="249" r="3" class="f-ink"/>
  <circle cx="64.1" cy="242" r="3" class="f-ink"/>
  <circle cx="64.1" cy="235" r="3" class="f-ink"/>
  <circle cx="71.1" cy="256" r="3" class="f-ink"/>
  <circle cx="71.1" cy="249" r="3" class="f-ink"/>
  <circle cx="71.1" cy="242" r="3" class="f-ink"/>
  <circle cx="71.1" cy="235" r="3" class="f-ink"/>
  <circle cx="78.1" cy="256" r="3" class="f-ink"/>
  <circle cx="78.1" cy="249" r="3" class="f-ink"/>
  <circle cx="78.1" cy="242" r="3" class="f-ink"/>
  <circle cx="78.1" cy="235" r="3" class="f-ink"/>
  <circle cx="85.1" cy="256" r="3" class="f-ink"/>
  <circle cx="85.1" cy="249" r="3" class="f-ink"/>
  <circle cx="85.1" cy="242" r="3" class="f-ink"/>
  <circle cx="85.1" cy="235" r="3" class="f-ink"/>
  <circle cx="92.1" cy="256" r="3" class="f-ink"/>
  <circle cx="92.1" cy="249" r="3" class="f-ink"/>
  <circle cx="92.1" cy="242" r="3" class="f-ink"/>
  <circle cx="568.1" cy="256" r="3" class="f-accent"/>
  <circle cx="568.1" cy="249" r="3" class="f-accent"/>
  <circle cx="568.1" cy="242" r="3" class="f-accent"/>
  <circle cx="568.1" cy="235" r="3" class="f-accent"/>
  <circle cx="575.1" cy="256" r="3" class="f-accent"/>
  <circle cx="575.1" cy="249" r="3" class="f-accent"/>
  <circle cx="575.1" cy="242" r="3" class="f-accent"/>
  <line x1="57.1" y1="228" x2="57.1" y2="216" class="f-line"/>
  <text x="57.14294758937885" y="210" class="f-mono f-ink" style="font-size:11px">true answer: 23 answers</text>
  <line x1="568.1" y1="228" x2="568.1" y2="216" class="f-line"/>
  <text x="578.0839090149835" y="210" text-anchor="end" class="f-mono f-accent" style="font-size:11px">divided by 0.10: 7 answers</text>
</svg>
<figcaption>The formula on the page is right. The 30 answers to the short prompt land in the 2 places that the 2 divisions predict. There is nothing in between.</figcaption>
</figure>

## The $8k was the other error

The August misses, $5,775 short and $8,451 over, are not this slip. They look like the 23 near answers. The whole forecast depends on one number, 1.11 to the power 36, which is 42.818. The revenue multiplies it by 18000 / 0.11, so an error of 0.001 in the power costs $164 in the answer.

I checked that with a prompt that asks for 3 lines: the power, the revenue, the answer. 30 calls. The powers went from 42.736 to 42.929. Median miss of the answer was $742 and the error of the model's own power times 163,636 explains $741 of it. In 27 of 30 the answer matched what its own power gives within $10, in the other 3 it was off by $200 to $1,636. I cannot tell from this whether the model computed the power first or adjusted the printed power to an answer it already had. What I can say is where the printed power goes wrong: the first wrong digit is in the third decimal in 14 of 30, in the first or second in 13. Asked for the bare power alone 20 times, Haiku never gave 42.818084. In forecast dollars the spread was −$32,741 to +$41,223.

<figure class="fig">
<svg viewBox="0 0 640 310" role="img" aria-label="Scatter of 30 answers to the 3 line prompt. Across: the value of 1.11 to the power 36 that Haiku wrote, from 42.736 to 42.929; the true value is 42.818. Up: the error of its answer, from −$13,471 to +$18,144. The points lie on the line error = (power − 42.818) × 163,636.">
  <line x1="92" y1="250" x2="620" y2="250" class="f-line"/>
  <line x1="92" y1="34" x2="92" y2="250" class="f-line"/>
  <line x1="140.0" y1="250" x2="140.0" y2="254" class="f-line"/>
  <text x="140.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.74</text>
  <line x1="236.0" y1="250" x2="236.0" y2="254" class="f-line"/>
  <text x="236.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.78</text>
  <line x1="332.0" y1="250" x2="332.0" y2="254" class="f-line"/>
  <text x="332.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.82</text>
  <line x1="428.0" y1="250" x2="428.0" y2="254" class="f-line"/>
  <text x="428.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.86</text>
  <line x1="524.0" y1="250" x2="524.0" y2="254" class="f-line"/>
  <text x="524.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.90</text>
  <line x1="620.0" y1="250" x2="620.0" y2="254" class="f-line"/>
  <text x="620.0" y="267" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">42.94</text>
  <line x1="88" y1="214.0" x2="92" y2="214.0" class="f-line"/>
  <text x="84" y="217.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">−$10k</text>
  <line x1="88" y1="154.0" x2="92" y2="154.0" class="f-line"/>
  <text x="84" y="157.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">$0</text>
  <line x1="88" y1="94.0" x2="92" y2="94.0" class="f-line"/>
  <text x="84" y="97.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+$10k</text>
  <line x1="88" y1="34.0" x2="92" y2="34.0" class="f-line"/>
  <text x="84" y="37.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+$20k</text>
  <line x1="92" y1="154.0" x2="620" y2="154.0" class="f-line" style="opacity:0.35"/>
  <line x1="327.4" y1="34" x2="327.4" y2="250" class="f-line" style="opacity:0.35"/>
  <text x="333.4031371723364" y="44" class="f-mono f-muted" style="font-size:10px">42.818</text>
  <line x1="92.7" y1="250.0" x2="620.0" y2="34.3" class="f-line" style="stroke-dasharray:4 3"/>
  <circle cx="323.7" cy="155.5" r="3.2" class="f-accent"/>
  <circle cx="318.3" cy="157.7" r="3.2" class="f-accent"/>
  <circle cx="334.2" cy="151.2" r="3.2" class="f-accent"/>
  <circle cx="326.0" cy="154.6" r="3.2" class="f-accent"/>
  <circle cx="310.6" cy="160.9" r="3.2" class="f-accent"/>
  <circle cx="274.9" cy="175.5" r="3.2" class="f-accent"/>
  <circle cx="300.3" cy="165.1" r="3.2" class="f-accent"/>
  <circle cx="287.4" cy="170.4" r="3.2" class="f-accent"/>
  <circle cx="317.1" cy="158.2" r="3.2" class="f-accent"/>
  <circle cx="322.4" cy="156.1" r="3.2" class="f-accent"/>
  <circle cx="269.9" cy="167.7" r="3.2" class="f-accent"/>
  <circle cx="321.4" cy="156.4" r="3.2" class="f-accent"/>
  <circle cx="308.0" cy="160.1" r="3.2" class="f-accent"/>
  <circle cx="326.5" cy="154.4" r="3.2" class="f-accent"/>
  <circle cx="318.3" cy="157.7" r="3.2" class="f-accent"/>
  <circle cx="522.3" cy="74.3" r="3.2" class="f-accent"/>
  <circle cx="327.2" cy="154.1" r="3.2" class="f-accent"/>
  <circle cx="316.0" cy="158.7" r="3.2" class="f-accent"/>
  <circle cx="593.6" cy="45.1" r="3.2" class="f-accent"/>
  <circle cx="129.8" cy="234.8" r="3.2" class="f-accent"/>
  <circle cx="250.5" cy="185.5" r="3.2" class="f-accent"/>
  <circle cx="327.7" cy="153.9" r="3.2" class="f-accent"/>
  <circle cx="380.4" cy="132.3" r="3.2" class="f-accent"/>
  <circle cx="286.2" cy="170.9" r="3.2" class="f-accent"/>
  <circle cx="330.2" cy="152.9" r="3.2" class="f-accent"/>
  <circle cx="237.5" cy="190.8" r="3.2" class="f-accent"/>
  <circle cx="319.4" cy="157.3" r="3.2" class="f-accent"/>
  <circle cx="327.4" cy="154.0" r="3.2" class="f-accent"/>
  <circle cx="257.1" cy="184.0" r="3.2" class="f-accent"/>
  <circle cx="326.9" cy="154.2" r="3.2" class="f-accent"/>
  <text x="620" y="208" text-anchor="end" class="f-mono f-ink" style="font-size:11px">error = (power − 42.818) × 163,636</text>
  <text x="620" y="226" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.001 in the power = $164</text>
  <text x="356" y="296" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.11³⁶ as Haiku wrote it</text>
  <text x="52" y="24" class="f-mono f-muted" style="font-size:11px">error of the answer</text>
</svg>
<figcaption>The answer is wrong by as much as the model's own power is wrong, times 163,636. The 2 August misses sit inside this spread.</figcaption>
</figure>

In this prompt the 0.10 slip did not happen at all, 0 of 30. I do not know why. One guess is that writing the revenue as its own line makes the model compute the division separately. I did not test that and 30 calls is small.

## Asking it to say when it is unsure

The last thing I wanted to know is whether Haiku can tell. Same short prompt plus one sentence: if you are not certain the number is exact to the dollar, add a second line `UNSURE`. 30 calls.

Haiku said `UNSURE` 7 times. All 7 were on answers that were off by $2,817 or less. 4 answers came with the +$684k slip. None of them was marked. Opus, given the same sentence, marked 3 of 10, while all 10 of its answers were exact.

So the flag exists, but it falls on answers that are close anyway. Many close answers have no flag either. The 4 worst answers came out with no flag at all.

## What changes for me

The example I used in August was real but small. On this question a Haiku answer is usually a few thousand dollars off, sometimes up to $17k. In the prompt with 3 lines the printed power explains that drift. In 7 of 30 calls on the original prompt it was $684k off because `1.11 - 1` became `0.10`. I quoted the drift and did not see the slip, because I looked at 1 answer per run.

For anything I would act on, the model should not do this division at all. I said that in August as well. Now I know which step fails and what it looks like on the page: `(1.11 - 1)` on one line and `0.10` on the next.

## What I did not check

Only Haiku 4.5 and Opus 5, only this one question. Other numbers may not have a `0.10` sitting next to `0.11`. Every arm is one session of 10 to 30 calls and I did not repeat any of them, so 7 of 30 against 0 of 30 against 11 of 20 is a hint at most. For the big answers I tried 2 other explanations, both about month counts, before 0.10 matched. Tools were off on purpose, while anyone would really run this with tools.
