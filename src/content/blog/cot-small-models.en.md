---
title: "I asked GPT-2 to show its work and it trusted its own wrong arithmetic"
description: "I gave GPT-2 small, medium and large the 8 worked examples from the chain of thought paper and 500 math word problems. With the written solution they were right 4, 11 and 10 times against 16, 12 and 19 without it. Only 80 of 550 equations large wrote were right, but its answer matched the last number of its own chain 360 times out of 362."
date: 2022-04-10
lang: en
translationKey: cot-small-models
tags: ["llm", "machine-learning", "numbers"]
---
In January Jason Wei and his colleagues at Google put out a paper about chain of thought prompting. This week a second version came out. You give a model 8 example problems, but each example has the solution written out in words before the answer: "There are 15 trees originally. Then there were 21 trees after some more were planted. So there must have been `21 - 15 = 6`." On GSM8K, a set of school math word problems from OpenAI, this moves PaLM 540B from 17.9% to 56.5%.

There is one sentence in the paper that I read and skipped. Models smaller than about 100B parameters "produced fluent but illogical chains of thought, leading to lower performance than standard prompting". I took it as natural that writing the steps helps, because it helps people. The small models looked like a detail. But the biggest model I can run at home is about 130 times smaller than that limit. For me this sentence is the part that matters. I wanted to see what a fluent but illogical chain looks like and what it does with the answer.

## The setup

There is no GPU on this machine, only 4 cores of an AMD EPYC 7713 in a virtual machine and a 5 GiB memory limit. I took GPT-2 in 3 sizes: small with 124M parameters, medium with 355M and large with 774M. Everything runs on Python 3.9, torch 1.11 and transformers 4.18, in float32 with greedy decoding.

I wanted a 4th model, the 1.3B one from EleutherAI. In float32 its weights alone are 5.3 GB and torch 1.11 holds the checkpoint and the model at once, so it does not fit. In bfloat16 it fits, but this CPU has no hardware support for it and 40 tokens did not finish in 4 minutes. At that speed one pass over 500 problems would take days, so GPT-2 large stayed the biggest.

The prompt is the 8 examples from the paper, word for word. In standard mode each example ends with "The answer is N." and nothing else. In chain mode the written solution comes before it. The questions:

- 200 problems from the GSM8K test set, chosen with seed 2022;
- 300 problems I generated, 100 each with 1, 2 and 3 steps of adding or subtracting small numbers. For example: "Sam has 9 pencils. He loses 5 pencils. How many pencils does Sam have now?"

GSM8K is too hard for these models anyway, so I wanted problems where a single step is trivial. The whole run took about 3 hours and 15 minutes. Most of it went to chain mode. GPT-2 small often loops ("So he has 16 glasses. So he has 16 glasses.") until it hits my limit of 160 new tokens. GPT-2 small hit the limit on 215 of 500 problems.

## The chain does not help

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Bars, right answers out of 500 problems per model. small, 124M: standard 16, chain 4. medium, 355M: standard 12, chain 11. large, 774M: standard 19, chain 10.">
  <text x="12" y="18" class="f-label f-muted">right answers out of 500, GPT-2</text>
  <rect x="12" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">standard: &quot;The answer is N.&quot;</text>
  <rect x="330" y="31" width="12" height="10" class="f-accent"/>
  <text x="348" y="40" class="f-mono f-ink" style="font-size:11px">chain: solution, then the answer</text>
  <text x="12" y="82" class="f-mono f-ink" style="font-size:11px">small, 124M</text>
  <rect x="140" y="66" width="320" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="466" y="76" class="f-mono f-ink" style="font-size:11px">16</text>
  <rect x="140" y="82" width="80" height="12" class="f-accent"/>
  <text x="226" y="92" class="f-mono f-ink" style="font-size:11px">4</text>
  <text x="12" y="128" class="f-mono f-ink" style="font-size:11px">medium, 355M</text>
  <rect x="140" y="112" width="240" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="386" y="122" class="f-mono f-ink" style="font-size:11px">12</text>
  <rect x="140" y="128" width="220" height="12" class="f-accent"/>
  <text x="366" y="138" class="f-mono f-ink" style="font-size:11px">11</text>
  <text x="12" y="174" class="f-mono f-ink" style="font-size:11px">large, 774M</text>
  <rect x="140" y="158" width="380" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="526" y="168" class="f-mono f-ink" style="font-size:11px">19</text>
  <rect x="140" y="174" width="200" height="12" class="f-accent"/>
  <text x="346" y="184" class="f-mono f-ink" style="font-size:11px">10</text>
</svg>
<figcaption>200 GSM8K problems plus 300 generated problems with 1 to 3 steps. The chain is right less often for all 3 sizes. Only for small the difference holds on paired answers.</figcaption>
</figure>

Out of 500 problems, standard mode was right 16, 12 and 19 times for small, medium and large. Chain mode was right 4, 11 and 10 times. For small the difference holds on paired answers (15 problems only standard got right, 3 only chain, McNemar p = 0.0075). For medium and large it does not. So I agree with the paper: at this size the chain does not help and for the smallest model it hurts. But both modes are right only a few percent of the time. Medium in standard mode answered all 100 of the 1 step problems with a number copied from the question and got none of them right.

## What the chains look like

Here is the real answer of GPT-2 large to the pencil problem from above:

> Sam started with 9 pencils. After losing 5 pencils, he had `9 - 5 = 6`. After losing 2 more, he had `6 - 2 = 4`. The answer is 4.

I found it while looking through the right answers, where I expected the good chains to be. The answer is right. But `9 - 5` is not 6 and the problem has no second loss at all. "After losing 2 more" comes from the golf ball example in the prompt, where Michael loses 2 more balls on Wednesday. So the 2 wrong steps cancel each other and the number comes out right.

<figure class="fig">
<svg viewBox="0 0 640 254" role="img" aria-label="The problem: Sam has 9 pencils, he loses 5, how many does he have now. GPT-2 large writes: Sam started with 9 pencils. After losing 5 pencils, he had 9 - 5 = 6, which is wrong, 9 - 5 is 4. After losing 2 more, a step that is not in the problem and comes from the golf ball example in the prompt. He had 6 - 2 = 4, which is right. The answer is 4, right by accident.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 large, chain mode, one problem</text>
  <text x="12" y="44" class="f-mono f-ink" style="font-size:11px">Sam has 9 pencils. He loses 5 pencils. How many pencils does Sam have now?</text>
  <rect x="12" y="64" width="250" height="22" rx="3" class="f-plain"/>
  <text x="20" y="79" class="f-mono f-ink" style="font-size:12px">Sam started with 9 pencils.</text>
  <rect x="12" y="94" width="250" height="22" rx="3" class="f-plain"/>
  <text x="20" y="109" class="f-mono f-ink" style="font-size:12px">After losing 5 pencils,</text>
  <rect x="12" y="124" width="250" height="22" rx="3" class="f-box"/>
  <text x="20" y="139" class="f-mono f-accent" style="font-size:12px">he had 9 - 5 = 6.</text>
  <line x1="266" y1="135" x2="282" y2="135" class="f-line"/>
  <text x="288" y="139" class="f-mono f-accent" style="font-size:11px">wrong: 9 - 5 is 4</text>
  <rect x="12" y="154" width="250" height="22" rx="3" class="f-box"/>
  <text x="20" y="169" class="f-mono f-accent" style="font-size:12px">After losing 2 more,</text>
  <line x1="266" y1="165" x2="282" y2="165" class="f-line"/>
  <text x="288" y="169" class="f-mono f-accent" style="font-size:11px">not in the problem: golf ball example</text>
  <rect x="12" y="184" width="250" height="22" rx="3" class="f-plain"/>
  <text x="20" y="199" class="f-mono f-ink" style="font-size:12px">he had 6 - 2 = 4.</text>
  <line x1="266" y1="195" x2="282" y2="195" class="f-line"/>
  <text x="288" y="199" class="f-mono f-muted" style="font-size:11px">right</text>
  <rect x="12" y="214" width="250" height="22" rx="3" class="f-plain"/>
  <text x="20" y="229" class="f-mono f-ink" style="font-size:12px">The answer is 4.</text>
  <line x1="266" y1="225" x2="282" y2="225" class="f-line"/>
  <text x="288" y="229" class="f-mono f-muted" style="font-size:11px">right answer, by accident</text>
</svg>
<figcaption>2 wrong steps give the right answer. The phrase &quot;2 more&quot; is copied from one of the 8 examples in the prompt.</figcaption>
</figure>

I counted every equation the models wrote in a form like `a - b = c`. Small got 7 of 292 right, medium 68 of 1078, large 80 of 550. On the 1 step problems large wrote the right expression, for example `9 - 5`, in 28 of 100 cases. In 26 of them the result after it was wrong. The phrase "2 more" shows up in 19 of the 100 answers of large and in 22 of medium, every time in a question that does not have it. In the 2 cases where large did the subtraction right, this invented step broke the answer afterwards.

Then I looked at the right answers in chain mode. There are 25 over the 3 models. Only 1 contains the right step for its problem: medium writes `20 - 5 = 15` and right after it `20 - 15 = 15`. In 7 there is no equation at all and the answer is a number repeated from the question or from a loop. The rest get there through wrong steps, like the pencils. Once large writes `9 - 3 = 6` and then `6 + 6 = 12`. Both are correct, but in that problem Sam finds 3 more cookies, so neither step belongs to it.

## Where my expectation was wrong

Before the run I wrote down that the final answer would match the last number of the chain in less than half of the cases. I thought a small model writes some chain and then answers something unrelated, so the chain is decoration.

It went the other way. In chain mode the answer equals the right side of the last equation the model wrote. For small this is 188 of the 189 answers with at least 1 equation, for medium 393 of 414 and for large 360 of 362. If I compute that last expression myself and compare, the answer equals the computed value only 6, 42 and 57 times.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Bars in percent per model. small, 124M: equations right 2.4%, answer equals the last written number 99.5%. medium, 355M: equations right 6.3%, answer equals the last written number 94.9%. large, 774M: equations right 14.5%, answer equals the last written number 99.4%.">
  <text x="12" y="18" class="f-label f-muted">chain mode, % of cases</text>
  <rect x="12" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">equations with the right result</text>
  <rect x="330" y="31" width="12" height="10" class="f-accent"/>
  <text x="348" y="40" class="f-mono f-ink" style="font-size:11px">answer = number the chain wrote last</text>
  <text x="12" y="82" class="f-mono f-ink" style="font-size:11px">small, 124M</text>
  <rect x="140" y="66" width="10" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="156" y="76" class="f-mono f-ink" style="font-size:11px">2.4%</text>
  <rect x="140" y="82" width="398" height="12" class="f-accent"/>
  <text x="544" y="92" class="f-mono f-ink" style="font-size:11px">99.5%</text>
  <text x="12" y="128" class="f-mono f-ink" style="font-size:11px">medium, 355M</text>
  <rect x="140" y="112" width="25" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="171" y="122" class="f-mono f-ink" style="font-size:11px">6.3%</text>
  <rect x="140" y="128" width="380" height="12" class="f-accent"/>
  <text x="526" y="138" class="f-mono f-ink" style="font-size:11px">94.9%</text>
  <text x="12" y="174" class="f-mono f-ink" style="font-size:11px">large, 774M</text>
  <rect x="140" y="158" width="58" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="204" y="168" class="f-mono f-ink" style="font-size:11px">14.5%</text>
  <rect x="140" y="174" width="398" height="12" class="f-accent"/>
  <text x="544" y="184" class="f-mono f-ink" style="font-size:11px">99.4%</text>
</svg>
<figcaption>The models get almost every equation wrong and then copy the wrong result into the answer almost every time.</figcaption>
</figure>

So "illogical" means something different from what I thought. The answer follows the chain very closely, so a wrong `9 - 5 = 6` goes straight into the answer. The chain also costs time. On this CPU chain mode was 3.6 times slower than standard mode for large, simply because it writes more tokens. For small it was 8.6 times and the loops took 1418 of 1899 seconds.

## What I did not check

- Models bigger than 774M. GPT-J 6B is 24 GB in float32 and does not fit here, so the 100B side of the paper I can only read about.
- Sampling many chains and voting. Wang and colleagues showed in March that it helps big models a lot. With greedy decoding I get one chain per problem.
- Other examples in the prompt. The "2 more" leak suggests that the model probably copies the shape of the examples, so different examples would give different mistakes. I did not test how much.
- A calculator. The paper already has one: it fixes the equations after generation. For LaMDA 137B on GSM8K chain mode goes from 14.8% to 19.5%. My models follow the last written number so closely that I would expect it to help a little, but it would not fix a wrong operation or the "2 more" step. I did not run it.

Each number here is from 1 greedy run, so the texts repeat exactly (the timings do not). But a few percent right out of 500 is a small base for anything finer than "it does not help". For the models I can run I will keep the plain answer format. I am curious what a 6B model does with the same 8 examples, if I find a machine for it.
