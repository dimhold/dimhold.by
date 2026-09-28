---
title: "The same question to opus 5 gave 21 different answers in 64 calls, so I went looking for where the difference starts"
description: "I blamed temperature for every different answer and never checked it. On a CPU with sampling off, Qwen2.5 0.5B in float32 gave the same tokens under repeats, threads and batches. In bfloat16 a batch of 8 changed the text in 4 prompts of 8, once on the first token, where Sure and Certainly had exactly the same logit. opus 5 through the CLI gave 21 different numbers to one arithmetic question in 64 calls."
date: 2026-09-28
lang: en
translationKey: llm-determinism
tags: ["llm", "numbers", "reliability"]
---
On 20 August I froze 6 tasks in a file and started asking `claude-opus-5` the same questions through the Claude Code CLI. A grader checks each answer. I wanted a baseline for the "they made it dumber this week" posts, but the file showed a difference inside one sitting first. One task is 60 months of compounding MRR where the growth rate changes after month 6. The code computes 58937.5857. In 64 calls between 20 August and 12 September the model returned 21 different numbers. On the other 5 tasks it returned one answer per task. 1 call failed on a rate limit.

I always explained this to myself with temperature. The CLI does not expose it, so I never set it to 0 and I assumed that at 0 the answer would stop moving. I had also read "Defeating Nondeterminism in LLM Inference" by Horace He at Thinking Machines, from September 2025. It says that even at temperature 0 a server returns different text, because its kernels are not invariant to batch size. The batch depends on other people's traffic. I believed that too and did not check it either. So this time I took a model where nothing is hidden and looked for the place where the difference starts.

## Sampling off, float32

Qwen2.5 0.5B Instruct, transformers 5.16.1 and torch 2.14.0 on 4 cores of an AMD EPYC, greedy decoding, so no sampling at all. Qwen ships a repetition penalty of 1.1 in its generation config and I left it on in every run. 8 prompts with long answers, from hash tables to baking bread.

In float32 nothing moved. 5 repeats in a row gave the same logits bit for bit. 1, 2 and 4 threads also gave the same bits, which I did not expect. A batch of 2, 4 or 8 did change the logits in every one of the 8 prompts, but only in the fifth decimal place. The tokens stayed the same for all 200 and in a second series for all 400.

Greedy decoding takes the token with the highest score, so a flip needs the gap to the second token to be smaller than the noise. The smallest gap in 8 answers of up to 400 tokens was 0.000122, on the sum prompt. In a batch of 8 the same step had 0.000109. The batch never moved the gap by more than 0.00004.

## bfloat16

I loaded the same weights in bfloat16. A repeated run at batch 1 again gave the same tokens, so the model is still deterministic with itself.

bfloat16 keeps 8 bits of precision and stores a logit around 17 with a step of 0.125. 2 tokens can get exactly the same score. float32 did not have one in 2782 steps, while in bfloat16 the top 2 were tied 38 times in 2709 steps. The bread prompt started with a tie, `Certainly` and `Sure` both at 17.625, while float32 had them at 17.693 and 17.598. Alone the run began with "Sure! Here's a simple guide". In a batch of 8 it began with "Certainly! Making bread at home".

A batch in a plain forward pass moved the first logits by up to 0.000047 in float32 and by up to 0.29 in bfloat16. Through `generate`, 4 prompts of 8 went a different way in the batch of 8. float32 against bfloat16, both at batch 1, differed in 7 prompts of 8. The sum prompt asks for the sum of the numbers from 1 to 250 divisible by 3 or 7, which is 13482. Both runs gave the count instead of the sum. Only bfloat16 got the count right with 107, while float32 slipped on the multiples of 21 and wrote 106.

<figure class="fig">
<svg viewBox="0 0 640 310" role="img" aria-label="Grid of 8 prompts by 6 conditions for Qwen2.5 0.5B with greedy decoding. An equals sign means the tokens were the same as the reference run, a number is the token where they first differ. In float32 every cell is equal: repeats, 1, 2 and 4 threads, batches of 2, 4 and 8 at 200 tokens and a batch of 8 at 400 tokens. In bfloat16 a repeat is equal everywhere. A batch of 8 in bfloat16 differs in 4 prompts: URL in a browser at token 47, lighthouse story at token 121, float addition at token 134, bread at token 0. Float32 against bfloat16 differs in 7 of 8 prompts.">
  <text x="12" y="16" class="f-label f-muted">same prompt, sampling off: where the tokens first differ</text>
  <text x="226" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="226" y="51" text-anchor="middle" class="f-label f-muted">repeat</text>
  <text x="226" y="64" text-anchor="middle" class="f-label f-muted">threads</text>
  <text x="298" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="298" y="51" text-anchor="middle" class="f-label f-muted">batch</text>
  <text x="298" y="64" text-anchor="middle" class="f-label f-muted">2, 4, 8</text>
  <text x="370" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="370" y="51" text-anchor="middle" class="f-label f-muted">batch 8</text>
  <text x="442" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="442" y="51" text-anchor="middle" class="f-label f-muted">repeat</text>
  <text x="514" y="38" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="514" y="51" text-anchor="middle" class="f-label f-muted">batch 8</text>
  <text x="586" y="38" text-anchor="middle" class="f-label f-muted">float32</text>
  <text x="586" y="51" text-anchor="middle" class="f-label f-muted">against</text>
  <text x="586" y="64" text-anchor="middle" class="f-label f-accent">bfloat16</text>
  <text x="12" y="91" class="f-mono f-ink">hash table</text>
  <rect x="194" y="76" width="64" height="20" class="f-plain"/>
  <text x="226" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="76" width="64" height="20" class="f-plain"/>
  <text x="298" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="76" width="64" height="20" class="f-plain"/>
  <text x="370" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="76" width="64" height="20" class="f-plain"/>
  <text x="442" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="76" width="64" height="20" class="f-plain"/>
  <text x="514" y="91" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="76" width="64" height="20" class="f-box"/>
  <text x="586" y="91" text-anchor="middle" class="f-mono f-ink">84</text>
  <text x="12" y="117" class="f-mono f-ink">URL in a browser</text>
  <rect x="194" y="102" width="64" height="20" class="f-plain"/>
  <text x="226" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="102" width="64" height="20" class="f-plain"/>
  <text x="298" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="102" width="64" height="20" class="f-plain"/>
  <text x="370" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="102" width="64" height="20" class="f-plain"/>
  <text x="442" y="117" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="102" width="64" height="20" class="f-box"/>
  <text x="514" y="117" text-anchor="middle" class="f-mono f-ink">47</text>
  <rect x="554" y="102" width="64" height="20" class="f-box"/>
  <text x="586" y="117" text-anchor="middle" class="f-mono f-ink">11</text>
  <text x="12" y="143" class="f-mono f-ink">money runs out</text>
  <rect x="194" y="128" width="64" height="20" class="f-plain"/>
  <text x="226" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="128" width="64" height="20" class="f-plain"/>
  <text x="298" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="128" width="64" height="20" class="f-plain"/>
  <text x="370" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="128" width="64" height="20" class="f-plain"/>
  <text x="442" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="128" width="64" height="20" class="f-plain"/>
  <text x="514" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="128" width="64" height="20" class="f-plain"/>
  <text x="586" y="143" text-anchor="middle" class="f-mono f-muted">=</text>
  <text x="12" y="169" class="f-mono f-ink">lighthouse story</text>
  <rect x="194" y="154" width="64" height="20" class="f-plain"/>
  <text x="226" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="154" width="64" height="20" class="f-plain"/>
  <text x="298" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="154" width="64" height="20" class="f-plain"/>
  <text x="370" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="154" width="64" height="20" class="f-plain"/>
  <text x="442" y="169" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="154" width="64" height="20" class="f-box"/>
  <text x="514" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <rect x="554" y="154" width="64" height="20" class="f-box"/>
  <text x="586" y="169" text-anchor="middle" class="f-mono f-ink">121</text>
  <text x="12" y="195" class="f-mono f-ink">PostgreSQL or SQLite</text>
  <rect x="194" y="180" width="64" height="20" class="f-plain"/>
  <text x="226" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="180" width="64" height="20" class="f-plain"/>
  <text x="298" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="180" width="64" height="20" class="f-plain"/>
  <text x="370" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="180" width="64" height="20" class="f-plain"/>
  <text x="442" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="180" width="64" height="20" class="f-plain"/>
  <text x="514" y="195" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="180" width="64" height="20" class="f-box"/>
  <text x="586" y="195" text-anchor="middle" class="f-mono f-ink">22</text>
  <text x="12" y="221" class="f-mono f-ink">sum, 3 or 7</text>
  <rect x="194" y="206" width="64" height="20" class="f-plain"/>
  <text x="226" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="206" width="64" height="20" class="f-plain"/>
  <text x="298" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="206" width="64" height="20" class="f-plain"/>
  <text x="370" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="206" width="64" height="20" class="f-plain"/>
  <text x="442" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="206" width="64" height="20" class="f-plain"/>
  <text x="514" y="221" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="554" y="206" width="64" height="20" class="f-box"/>
  <text x="586" y="221" text-anchor="middle" class="f-mono f-ink">219</text>
  <text x="12" y="247" class="f-mono f-ink">float addition</text>
  <rect x="194" y="232" width="64" height="20" class="f-plain"/>
  <text x="226" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="232" width="64" height="20" class="f-plain"/>
  <text x="298" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="232" width="64" height="20" class="f-plain"/>
  <text x="370" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="232" width="64" height="20" class="f-plain"/>
  <text x="442" y="247" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="232" width="64" height="20" class="f-box"/>
  <text x="514" y="247" text-anchor="middle" class="f-mono f-ink">134</text>
  <rect x="554" y="232" width="64" height="20" class="f-box"/>
  <text x="586" y="247" text-anchor="middle" class="f-mono f-ink">144</text>
  <text x="12" y="273" class="f-mono f-ink">bread</text>
  <rect x="194" y="258" width="64" height="20" class="f-plain"/>
  <text x="226" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="266" y="258" width="64" height="20" class="f-plain"/>
  <text x="298" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="338" y="258" width="64" height="20" class="f-plain"/>
  <text x="370" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="410" y="258" width="64" height="20" class="f-plain"/>
  <text x="442" y="273" text-anchor="middle" class="f-mono f-muted">=</text>
  <rect x="482" y="258" width="64" height="20" class="f-box"/>
  <text x="514" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="554" y="258" width="64" height="20" class="f-box"/>
  <text x="586" y="273" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="190" y="290" width="18" height="12" class="f-plain"/>
  <text x="214" y="300" class="f-label f-muted">same tokens</text>
  <rect x="370" y="290" width="18" height="12" class="f-box"/>
  <text x="394" y="300" class="f-label f-muted">differ from this token</text>
</svg>
<figcaption>Columns 1 and 2 generate 200 new tokens, the rest 400. Token numbers count from 0. The batch changed the first logits in both formats: by up to 0.000047 in float32 and up to 0.29 in bfloat16. Only bfloat16 turned that into different text.</figcaption>
</figure>

Here I got stuck for a while. 2 of the 4 batch flips happened where the gap between the top 2 tokens was 1.375, far from any tie. I could not see how noise of 0.29 overturns that. The answer was in my own script. I took the gaps from the raw logits, but the decoder chooses after the repetition penalty. In float32 the raw top token was not the chosen one in 396 steps of 2782. I ran the series again with the gap taken after the penalty and got the same tokens in all 32 runs. At those 2 steps the gap after the penalty was 0.09 alone and 0.034 and 0.023 in the batch. The other 2 flips were exact ties.

## Back to opus

Then I asked `claude-opus-5` to explain hash table collisions in about 150 words, 20 times. CLI 2.1.283, thinking off, no tools, an empty MCP config, a plain system prompt and a directory without any `CLAUDE.md` above it. I got 20 different texts, all starting with "A hash table" and covering chaining and open addressing. In 132 pairs of 190 the 2 texts share 11 words or less at the start.

After the local runs I read the 21 arithmetic answers as groups and not as noise. Those calls went through CLI 2.1.237 to 2.1.269 with thinking on. The grader accepts a relative error of 1e-6, about 6 cents. 46 of 64 answers are inside it. 31 of them match it to the cent, 16 rounded to 58937.59 and 15 truncated to 58937.58. Of the 18 outside the tolerance, 6 sit near 58928.2 and 7 miss by less than 20 cents.

<figure class="fig">
<svg viewBox="0 0 640 375" role="img" aria-label="2 dot plots of the 64 answers opus 5 gave to the same compounding MRR question, one dot per call, filled dots passed the grader. Top, the full range from 58905 to 58940: most answers stack at 58937, a second group of 6 sits at 58928 and single answers fall at 58907, 58931 and 58934. Bottom, the window from 58937.1 to 58937.75 by cent: the true value is 58937.5857, the grader accepts about 6 cents either side, 16 answers are 58937.59 and 15 are 58937.58. 46 of 64 passed.">
  <text x="12" y="16" class="f-label f-muted">opus 5, the same MRR question, 64 calls</text>
  <text x="12" y="40" class="f-label f-muted">all answers</text>
  <rect x="75.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="80.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="411.0" y="111.6" width="10" height="6.4" class="f-plain"/>
  <text x="416.0" y="106.6" text-anchor="middle" class="f-mono f-ink">6</text>
  <rect x="459.0" y="116.0" width="10" height="2.0" class="f-plain"/>
  <text x="464.0" y="111.0" text-anchor="middle" class="f-mono f-ink">1</text>
  <rect x="507.0" y="115.9" width="10" height="2.1" class="f-plain"/>
  <text x="512.0" y="110.9" text-anchor="middle" class="f-mono f-ink">2</text>
  <rect x="555.0" y="60.0" width="10" height="58.0" class="f-plain"/>
  <rect x="555.0" y="68.6" width="10" height="49.4" class="f-box"/>
  <text x="560.0" y="55.0" text-anchor="middle" class="f-mono f-ink">54</text>
  <line x1="40" y1="120" x2="600" y2="120" class="f-line"/>
  <line x1="40" y1="120" x2="40" y2="125" class="f-line"/>
  <text x="40" y="138" text-anchor="middle" class="f-mono f-muted">58905</text>
  <line x1="120" y1="120" x2="120" y2="125" class="f-line"/>
  <text x="120" y="138" text-anchor="middle" class="f-mono f-muted">58910</text>
  <line x1="200" y1="120" x2="200" y2="125" class="f-line"/>
  <text x="200" y="138" text-anchor="middle" class="f-mono f-muted">58915</text>
  <line x1="280" y1="120" x2="280" y2="125" class="f-line"/>
  <text x="280" y="138" text-anchor="middle" class="f-mono f-muted">58920</text>
  <line x1="360" y1="120" x2="360" y2="125" class="f-line"/>
  <text x="360" y="138" text-anchor="middle" class="f-mono f-muted">58925</text>
  <line x1="440" y1="120" x2="440" y2="125" class="f-line"/>
  <text x="440" y="138" text-anchor="middle" class="f-mono f-muted">58930</text>
  <line x1="520" y1="120" x2="520" y2="125" class="f-line"/>
  <text x="520" y="138" text-anchor="middle" class="f-mono f-muted">58935</text>
  <line x1="600" y1="120" x2="600" y2="125" class="f-line"/>
  <text x="600" y="138" text-anchor="middle" class="f-mono f-muted">58940</text>
  <text x="12" y="168" class="f-label f-muted">the group near the true value, by cent</text>
  <text x="458.5" y="186" text-anchor="middle" class="f-label f-ink">true value 58937.5857</text>
  <rect x="407.7" y="194" width="101.6" height="151" class="f-plain" stroke-dasharray="3 2"/>
  <text x="515.3" y="206" class="f-label f-muted">grader tolerance</text>
  <line x1="458.5" y1="194" x2="458.5" y2="345" class="f-line"/>
  <circle cx="100.3" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="298.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="315.7" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="341.5" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="367.4" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="339.4" r="3.6" class="f-plain"/>
  <circle cx="384.6" cy="331.6" r="3.6" class="f-plain"/>
  <circle cx="436.3" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="436.3" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="444.9" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="453.5" cy="230.2" r="3.6" class="f-box"/>
  <text x="446.5" y="234.0" text-anchor="end" class="f-mono f-ink">15</text>
  <circle cx="462.2" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="300.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="292.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="284.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="277.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="269.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="261.4" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="253.6" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="245.8" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="238.0" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="230.2" r="3.6" class="f-box"/>
  <circle cx="462.2" cy="222.4" r="3.6" class="f-box"/>
  <text x="462.2" y="215.2" text-anchor="middle" class="f-mono f-ink">16</text>
  <circle cx="470.8" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="316.0" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="308.2" r="3.6" class="f-box"/>
  <circle cx="470.8" cy="300.4" r="3.6" class="f-box"/>
  <text x="470.8" y="293.2" text-anchor="middle" class="f-mono f-ink">6</text>
  <circle cx="479.4" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="331.6" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="323.8" r="3.6" class="f-box"/>
  <circle cx="479.4" cy="316.0" r="3.6" class="f-box"/>
  <text x="479.4" y="308.8" text-anchor="middle" class="f-mono f-ink">4</text>
  <circle cx="488.0" cy="339.4" r="3.6" class="f-box"/>
  <circle cx="565.5" cy="339.4" r="3.6" class="f-plain"/>
  <line x1="40" y1="345" x2="600" y2="345" class="f-line"/>
  <line x1="126.15384615239958" y1="345" x2="126.15384615239958" y2="350" class="f-line"/>
  <text x="126.15384615239958" y="363" text-anchor="middle" class="f-mono f-muted">58937.2</text>
  <line x1="212.30769231106765" y1="345" x2="212.30769231106765" y2="350" class="f-line"/>
  <text x="212.30769231106765" y="363" text-anchor="middle" class="f-mono f-muted">58937.3</text>
  <line x1="298.4615384634672" y1="345" x2="298.4615384634672" y2="350" class="f-line"/>
  <text x="298.4615384634672" y="363" text-anchor="middle" class="f-mono f-muted">58937.4</text>
  <line x1="384.6153846158668" y1="345" x2="384.6153846158668" y2="350" class="f-line"/>
  <text x="384.6153846158668" y="363" text-anchor="middle" class="f-mono f-muted">58937.5</text>
  <line x1="470.76923076826637" y1="345" x2="470.76923076826637" y2="350" class="f-line"/>
  <text x="470.76923076826637" y="363" text-anchor="middle" class="f-mono f-muted">58937.6</text>
  <line x1="556.923076920666" y1="345" x2="556.923076920666" y2="350" class="f-line"/>
  <text x="556.923076920666" y="363" text-anchor="middle" class="f-mono f-muted">58937.7</text>
</svg>
<figcaption>Filled dots passed the grader, relative error up to 1e-6. 20 August to 12 September 2026, 64 calls, 21 different numbers.</figcaption>
</figure>

I cannot take the served model apart the way I took the small one. The CLI uses whatever sampling the service has, so sampling and batching end up in one number with everything else on the server. The local runs show only what is enough to change the text with sampling off: a tie in bfloat16 or neighbours in the batch. My guess about the arithmetic is that the model computes it in a long hidden reasoning, 691 to 6632 output tokens per call. An early different step would take the rest with it. The answers come in groups and that fits the guess, but I have not tested it.

For my own tools the result is modest. The grader already compares numbers with a tolerance and I keep it. The critic that grades my drafts is noisy in the same way. On one draft it gave the same failing verdict 30 times of 30. It named 160 different complaints, 114 of them only once.

## What I didn't check

- A GPU. All local runs were on a CPU and the kernels Thinking Machines describe are GPU kernels. Yuan and colleagues (arXiv 2506.09501) measured bf16 against fp32 and batch size on GPUs with 7B models. My bfloat16 result is the same precision effect on a much smaller model.
- Served models through an API at scale. Atil and colleagues (arXiv 2408.04667) measured that spread for 5 models.
- Temperature 0 on the served model. The CLI has no such option.
- Why a batched forward pass keeps the bread tie at 17.625 while the batch of 8 through `generate` breaks it by 0.125. The longest prompt needs no padding and behaves the same way. In a batched forward pass it is equal bit for bit, through `generate` it differs in the fifth decimal.
- What calculation gives 58928.2. It came back 6 times, so it is probably a stable wrong path, but I did not find the step.
