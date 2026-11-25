---
title: "After 20 questions the smaller model led 6 to 2"
description: "I compared Flan-T5 small and base on 2,000 MMLU questions and cut them into blocks of 20. The weaker model led in 37 blocks of 100. Comparing the text with the key literally made base look almost 2 times worse than small because of a full stop. How many questions it takes to see a difference of 3 points and of 1.33 points."
date: 2023-01-28
lang: en
translationKey: eval-looks-good
tags: ["llm", "statistics", "machine-learning"]
---

I gave the same 20 questions from MMLU to Flan-T5 small with 80 million parameters and to Flan-T5 base with 250 million. Small answered 6 correctly and base 2. After the first 10 the score was 4 to 1. The paper that released both models reports 28.7% for small and 35.9% for base on this test. So the 20 answers pointed at the wrong model. They did it quite convincingly.

My usual way to choose between 2 models or 2 prompts looks exactly like this. I open 10 or 20 answers, read them, say that this one looks better and move on. I never counted how often that choice is wrong. It is easy to count when there are enough answers, so I collected them.

People did this math before me. Dietterich recommended McNemar's test for comparing 2 classifiers in 1998. Card and colleagues in "With Little Power Comes Great Responsibility" (2020) found that underpowered experiments are common in NLP papers and showed that the power depends on how often the 2 models agree. I wanted to see the numbers on my own case.

## What I ran

MMLU test has 14,042 questions with 4 options each. The Flan authors removed the related tasks from finetuning, so neither of the 2 was tuned on it. I used the weights from October 2022, transformers 4.26.0, torch 1.13.1 on CPU, greedy decoding with at most 6 new tokens and no examples in the prompt. Prompt 1 is the wording from the MMLU repository, it starts with "The following are multiple choice questions (with answers) about" and ends with "Answer:". Prompt 2 is mine and ends with "Give the letter of the correct option."

In a trial run one history question took 657 tokens. I had a limit of 512, so the options were cut off and small answered `1: Of the Empire of Brazil,`. After that I kept only the 12,475 questions whose prompt fits into 256 tokens. I drew from them at random. I planned 3,000. The shared machine with 2 cores let me have 2,000 for both models and 1,500 for prompt 2.

I read every answer in 3 ways. The first is `text == key`, the line I always write. For the second I take the first standalone letter from A to D in the text. The third ignores the text and takes the largest of the 4 letter logits at the first step.

## A full stop

Before the run I wrote down that almost every answer would be a single letter and the format would tell nothing about the quality. Small gave a bare letter 1,640 times out of 2,000, base only 795. Another 1,179 answers of base were a letter with a full stop, `B.` and friends.

| how the answer is read | small | base |
|---|---|---|
| `text == key` | 25.80% | 13.45% |
| first letter in the text | 30.65% | 33.75% |
| best letter logit | 31.05% | 34.05% |

By the first line small is almost 2 times better. By the other 2 base is ahead. Answering C to everything gives 26.35% on these questions, so with the exact comparison both models lose to a constant. I would have looked for the bug in base, 13% is too low to believe. With small I am less sure, because 25.8% looks like a weak model and a weak model is what I expected.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Share of answers by form. small, prompt 1: bare letter 82.0%, letter with a full stop 17.1%, anything else 0.9%; accuracy 25.80% with exact comparison and 30.65% when the first standalone letter counts. base, prompt 1: bare letter 39.8%, letter with a full stop 59.0%, anything else 1.3%; accuracy 13.45% with exact comparison and 33.75% when the first standalone letter counts. base, prompt 2: bare letter 98.5%, letter with a full stop 1.5%, anything else 0.1%; accuracy 34.07% with exact comparison and 34.40% when the first standalone letter counts">
  <text x="562.0" y="18.0" text-anchor="end" class="f-label f-muted">text == key</text>
  <text x="668.0" y="18.0" text-anchor="end" class="f-label f-muted">first letter</text>
  <text x="150.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">small, prompt 1</text>
  <rect x="160.0" y="32.0" width="246.0" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="406.0" y="32.0" width="51.3" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="457.3" y="32.0" width="2.7" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">25.80%</text>
  <text x="668.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">30.65%</text>
  <text x="150.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, prompt 1</text>
  <rect x="160.0" y="76.0" width="119.3" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="279.3" y="76.0" width="176.8" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="456.1" y="76.0" width="3.9" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="94.0" text-anchor="end" class="f-mono f-accent" style="font-size:13px">13.45%</text>
  <text x="668.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">33.75%</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, prompt 2</text>
  <rect x="160.0" y="120.0" width="295.4" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="455.4" y="120.0" width="4.4" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="459.8" y="120.0" width="1.0" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34.07%</text>
  <text x="668.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34.40%</text>
  <rect x="160.0" y="172.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="178.0" y="182.0" text-anchor="start" class="f-label f-muted">bare letter</text>
  <rect x="275.7" y="172.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="293.7" y="182.0" text-anchor="start" class="f-label f-muted">letter with a full stop</text>
  <rect x="471.8" y="172.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="489.8" y="182.0" text-anchor="start" class="f-label f-muted">anything else</text>
</svg>
<figcaption>What the models wrote, 2,000 answers for each model with prompt 1 and 1,500 for prompt 2. On the right is the accuracy of the same answers under 2 ways of reading them.</figcaption>
</figure>

Prompt 2 removes the full stop almost completely, 22 answers out of 1,500 have it. On the same 1,500 questions `text == key` would show base growing from 13.33% to 34.07% and I would have reported a great prompt. By logits it is 33.07% and 34.40%.

Everything below is counted by logits.

## 20 questions, 100 times

On all 2,000 questions base has 681 right answers and small has 621. The difference is 3.0 points with a 95% interval from 0.4 to 5.6, McNemar's test gives p = 0.027. The gap in the paper is bigger, 7.2 points, but they give 5 examples in the prompt and ask the whole test.

I cut the 2,000 questions into 100 blocks of 20 in the order they were drawn. Base is ahead in 53 blocks, 10 are ties and small is ahead in 37. My opening 6 to 2 is simply the first block. Before the run I had written that at least 10 blocks of 100 would give a tie or the wrong model. It was 47.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Histogram of 100 blocks of 20 questions by the difference in right answers, base minus small. -6: 1, -5: 2, -4: 4, -3: 6, -2: 12, -1: 12, 0: 10, +1: 14, +2: 15, +3: 9, +4: 5, +5: 5, +6: 5. Small is ahead in 37 blocks, 10 are ties, base is ahead in 53.">
  <line x1="50" y1="210.0" x2="660" y2="210.0" class="f-plain"/>
  <rect x="55.0" y="199.6" width="36.9" height="10.4" style="fill:var(--accent);stroke:none"/>
  <text x="73.5" y="194.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <text x="73.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-6</text>
  <rect x="101.9" y="189.3" width="36.9" height="20.8" style="fill:var(--accent);stroke:none"/>
  <text x="120.4" y="184.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="120.4" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-5</text>
  <rect x="148.8" y="168.5" width="36.9" height="41.5" style="fill:var(--accent);stroke:none"/>
  <text x="167.3" y="163.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4</text>
  <text x="167.3" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-4</text>
  <rect x="195.8" y="147.8" width="36.9" height="62.3" style="fill:var(--accent);stroke:none"/>
  <text x="214.2" y="142.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="214.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-3</text>
  <rect x="242.7" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="261.2" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="261.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-2</text>
  <rect x="289.6" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="308.1" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="308.1" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-1</text>
  <rect x="336.5" y="106.3" width="36.9" height="103.8" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="355.0" y="101.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">10</text>
  <text x="355.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <rect x="383.5" y="64.8" width="36.9" height="145.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="401.9" y="59.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">14</text>
  <text x="401.9" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+1</text>
  <rect x="430.4" y="54.4" width="36.9" height="155.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="448.8" y="49.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">15</text>
  <text x="448.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <rect x="477.3" y="116.6" width="36.9" height="93.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="495.8" y="111.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9</text>
  <text x="495.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+3</text>
  <rect x="524.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="542.7" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="542.7" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <rect x="571.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="589.6" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="589.6" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+5</text>
  <rect x="618.1" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="636.5" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="636.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted">blocks of 20 questions</text>
  <text x="355.0" y="246.0" text-anchor="middle" class="f-label f-muted">right answers, base minus small</text>
  <rect x="250.0" y="6.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="268.0" y="16.0" text-anchor="start" class="f-label f-muted">small ahead 37</text>
  <rect x="381.8" y="6.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="399.8" y="16.0" text-anchor="start" class="f-label f-muted">tie 10</text>
  <rect x="460.0" y="6.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="478.0" y="16.0" text-anchor="start" class="f-label f-muted">base ahead 53</text>
</svg>
<figcaption>The 2,000 questions cut into 100 blocks of 20. On all of them together base is ahead by 60 answers.</figcaption>
</figure>

For other sizes I drew questions with replacement from the 2,000, 20,000 times for each size.

| questions | base ahead | tie | small ahead | McNemar p < 0.05 for base |
|---|---|---|---|---|
| 10 | 45.1% | 21.6% | 33.3% | 0.2% |
| 20 | 51.7% | 14.6% | 33.7% | 1.4% |
| 50 | 59.8% | 8.6% | 31.6% | 3.4% |
| 100 | 66.2% | 5.7% | 28.1% | 5.3% |
| 500 | 86.1% | 1.7% | 12.2% | 18.6% |
| 1,000 | 94.3% | 0.6% | 5.1% | 33.9% |
| 2,000 | 98.7% | 0.1% | 1.1% | 59.6% |

Taking one subject I know well would not have helped much. 37 subjects have at least 20 questions in my sample. In 15 of them small is level or ahead.

## How many is enough

Next I looked for the size at which the test finds the difference in 80% of the draws.

| | McNemar, same questions | 2 proportions, same questions | 2 proportions, different questions |
|---|---|---|---|
| small and base, 3.0 points | 3,100 | 3,600 | 3,800 |
| prompts 1 and 2 on base, 1.33 points | 5,700 | 14,600 | 19,800 |

I was sure that pairing would cut the number at least in half. You ask both systems the same questions and look only where one is right and the other is wrong, so the difficulty of the questions goes away. For 2 models it saved 18%. They are right on different questions. Only small is right 324 times, only base 384 times, both 297. The correlation between the 2 columns is 0.195. I think that around 30% with 4 options a lot of it is guessing and 2 models guess separately.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="Agreement of 2 systems question by question. small and base, 2,000 questions: both right 297, only the first 324, only the second 384, both wrong 995, for 80%: 3,100 paired, 3,800 on different questions. base, prompt 1 and prompt 2, 1,500 questions: both right 411, only the first 85, only the second 105, both wrong 899, for 80%: 5,700 paired, 19,800 on different questions">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">small and base, 2,000 questions</text>
  <rect x="20.5" y="28.0" width="94.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="67.5" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">297</text>
  <rect x="115.5" y="28.0" width="102.7" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="166.9" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">324</text>
  <rect x="219.2" y="28.0" width="121.9" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="280.2" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">384</text>
  <rect x="342.1" y="28.0" width="317.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="500.8" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">995</text>
  <text x="660.0" y="90.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">for 80%: 3,100 paired, 3,800 on different questions</text>
  <text x="20.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">base, prompt 1 and prompt 2, 1,500 questions</text>
  <rect x="20.5" y="128.0" width="174.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="107.7" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">411</text>
  <rect x="195.9" y="128.0" width="35.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="213.5" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">85</text>
  <rect x="232.1" y="128.0" width="43.8" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="254.0" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">105</text>
  <rect x="276.9" y="128.0" width="382.6" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="468.2" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">899</text>
  <text x="660.0" y="190.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">for 80%: 5,700 paired, 19,800 on different questions</text>
  <rect x="20.0" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="38.0" y="222.0" text-anchor="start" class="f-label f-muted">only the first right</text>
  <rect x="196.0" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="214.0" y="222.0" text-anchor="start" class="f-label f-muted">only the second right</text>
  <rect x="378.7" y="212.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="396.7" y="222.0" text-anchor="start" class="f-label f-muted">left: both right, right: both wrong</text>
</svg>
<figcaption>McNemar's test looks only at the 2 coloured pieces in the middle. The thinner they are, the more the pairing saves.</figcaption>
</figure>

For 2 prompts on one model the correlation is 0.717, only 85 and 105 questions change sides and pairing saves 3.5 times. So the rule works where I need it most, because I change prompts much more often than models.

It still does not let me say that prompt 2 is better. 1.33 points, the interval from -0.47 to 3.13, p = 0.17. Its answers look cleaner. Before this run that would have been enough for me.

## What I didn't check

The numbers in the last table take my measured difference as the true one, but it comes from the same 2,000 answers and the true one may be smaller. If the real gap between small and base is 1 point, which the interval allows, it needs roughly 9 times more questions. The limit of 256 tokens mostly hurt 4 subjects, professional law and 3 history ones lost 1,419 of the 1,567 dropped questions. Both models are small and not far from guessing, so a pair with higher accuracy may agree more and need fewer questions. I also did not touch free text, where a person says what is better. The judge adds noise there and I have no number for it. Base took 19 minutes for the 2,000 questions here, so 3,100 would be about half an hour. I can afford that, but for a task of my own I would first have to write 3,100 questions.
