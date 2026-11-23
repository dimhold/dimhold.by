---
title: "GPT-2 says 94 plus 4 is 108, with 1.4 percent confidence"
description: "GPT-2 in 3 sizes on 1500 arithmetic problems each, in the format of the GPT-3 paper. It is right about 1 time in 100 and its own probabilities say the same: on average 1.4 to 1.6 percent for the answer it prints. The overconfidence I expected was in the printed text, which looks the same for right and wrong answers."
date: 2020-07-18
lang: en
translationKey: model-arithmetic-confidence
tags: ["llm", "machine-learning", "numbers"]
---
At the end of May OpenAI published the GPT-3 paper and there is one table in it that I read several times. With 50 solved examples in the prompt the 175B model adds 2 digit numbers correctly in 100 percent of cases. On 3 digit numbers it gets 80.4 percent. The smallest model in the same table, 125M parameters, gets 2 percent on the same 2 digit addition. Since then the people who got API access post GPT-3 demos, but the weights are not public and the API is a private beta. I can not check any of it myself.

What I can check is GPT-2. OpenAI published its weights last year and the small one, 124M parameters, is about the size of the smallest GPT-3. I also had a question that the paper does not answer. When the model is wrong, does it know that?

I was sure the answer is no. A wrong answer comes out in exactly the same form as a right one, "A: 108", without "I think" or "about". And Guo and others showed in 2017 that modern image classifiers are overconfident, so I expected the same here. I had never looked at the probabilities behind a printed answer before, only at the text. Before counting anything I wrote my expectation down. On wrong answers the model should give its own answer more than 30 percent probability. Its average confidence should be at least 20 points above its accuracy.

## The setup

The prompt format is taken from the GPT-3 paper: "Q: What is 94 plus 4?", a new line, then "A:". Before the question go 5 solved examples of the same kind, the paper used 50. The tasks are addition and subtraction of 2 and 3 digit numbers plus multiplication of 2 digit numbers. Each kind has 300 random problems from a fixed seed. I ran 3 GPT-2 sizes, 124M, 355M and 774M parameters, the original weights in float32 on CPU. Decoding is greedy: at every step the model takes its most probable token, until it writes a new line.

Confidence here is the probability that the model gives to the whole answer it printed. That is the number and the line break that ends it, multiplied over the tokens. Separately I take the probability of the right answer, to see how far the truth was. GPT-2 cuts numbers into tokens in an uneven way. " 98" and " 108" are single tokens, " 517" is " 5" plus "17". And " 1944" is one token again, probably because it is a year.

The first run lost all negative answers. GPT-2 writes the minus as its own token " -" with the digits after it. My parser expected a number to start with a digit, so every negative answer became "not a number". I saw it only on a test run of 20 problems, where every answer with a minus came back empty.

## It counts badly

Out of 1500 problems the small model was right 14 times, the medium 10 and the large 13. On 2 digit addition the small one has 1.3 percent. This is close to the 2 percent of the smallest GPT-3 in the paper. A model 6 times bigger did not help at all, the 774M one is right as rarely as the 124M one.

Most of the right answers are easy ones. 10 of the 14 for the small model have 0 or 1 as one of the numbers, like 0 times 13 or 796 plus 0. The wrong answers also do not look like near misses. Only about 10 percent of them are within 10 of the truth. The last digit is right in about 11 percent of them, where a random number would get 10. The GPT-3 paper says that its big model often forgets to carry a 1. GPT-2 mostly does not get close enough to make that kind of mistake.

## Confidence

The average confidence of the 3 models is 1.4 to 1.6 percent. There are 4463 wrong answers from all 3 models together. Only 2 of them have confidence above 50 percent and none above 90. The model is right in about 1 case of 100 and its own probabilities say about the same. The gap between average confidence and accuracy is 0.6 to 0.7 points, I expected at least 20.

<figure class="fig">
<svg viewBox="0 0 680 340" role="img" aria-label="The 10 most probable first tokens of GPT-2 774M after &quot;Q: What is 94 plus 4? A:&quot;, with 5 solved examples before it. 108: 1.43%. 111: 1.33%. 110: 1.31%. 104: 1.31%. 109: 1.22%. 115: 1.22%. 114: 1.19%. 105: 1.17%. 99: 1.16%. 103: 1.13%. The right answer 98 is 15th with 1.05%. All tokens that start a number together get 99.4%.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">Q: What is 94 plus 4?  A: …</text>
  <text x="44.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#1</text>
  <text x="98.0" y="44.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">108</text>
  <rect x="110" y="33" width="403.5" height="14" class="f-accent"/>
  <text x="519.5" y="44.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1.43%</text>
  <text x="575.5" y="44.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">← printed</text>
  <text x="44.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#2</text>
  <text x="98.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">111</text>
  <rect x="110" y="55" width="373.2" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="489.2" y="66.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.33%</text>
  <text x="44.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#3</text>
  <text x="98.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">110</text>
  <rect x="110" y="77" width="368.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="484.4" y="88.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.31%</text>
  <text x="44.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#4</text>
  <text x="98.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">104</text>
  <rect x="110" y="99" width="367.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="483.4" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.31%</text>
  <text x="44.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#5</text>
  <text x="98.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">109</text>
  <rect x="110" y="121" width="344.1" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="460.1" y="132.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.22%</text>
  <text x="44.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#6</text>
  <text x="98.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">115</text>
  <rect x="110" y="143" width="343.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="459.9" y="154.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.22%</text>
  <text x="44.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#7</text>
  <text x="98.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">114</text>
  <rect x="110" y="165" width="334.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="450.5" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.19%</text>
  <text x="44.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#8</text>
  <text x="98.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">105</text>
  <rect x="110" y="187" width="330.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="446.5" y="198.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.17%</text>
  <text x="44.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#9</text>
  <text x="98.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">99</text>
  <rect x="110" y="209" width="326.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="442.9" y="220.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.16%</text>
  <text x="44.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#10</text>
  <text x="98.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">103</text>
  <rect x="110" y="231" width="317.0" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="433.0" y="242.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.13%</text>
  <text x="70.0" y="264.0" text-anchor="middle" class="f-mono f-muted" style="font-size:13px">…</text>
  <text x="116.0" y="264.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">4 more</text>
  <text x="44.0" y="286.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#15</text>
  <text x="98.0" y="286.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">98</text>
  <rect x="110" y="275" width="295.7" height="14" class="f-ink"/>
  <text x="411.7" y="286.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1.05%</text>
  <text x="467.7" y="286.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">← right answer</text>
  <line x1="110" y1="26" x2="110" y2="296" class="f-line"/>
  <text x="110.0" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.0%</text>
  <text x="250.6" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.5%</text>
  <text x="391.3" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.0%</text>
  <text x="531.9" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.5%</text>
  <text x="335.0" y="328.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">probability of the token</text>
</svg>
<figcaption>GPT-2 774M, float32, 5 examples in the prompt, problem 1 of the set. Probabilities of the first token of the answer. Greedy decoding prints the top one, 108. The right answer 98 is 15th. Tokens that start a number together hold 99.4% of the probability, spread over many candidates.</figcaption>
</figure>

The example in the figure is the first problem of the set, 94 plus 4, for the 774M model. It printed 108. As the first token of the answer, 108 had probability 1.43 percent. Right behind it are 111 with 1.33 and 110 with 1.31. The right answer 98 is 15th with 1.05. The model puts 99.4 percent of its probability on some number and spreads it over everything around 100. A sum of 2 numbers below 100 is about 100 on average. Also 3 of the 5 example answers in that prompt are 93, 101 and 104. I did not test which of these 2 reasons matters more. But it looks like the model guesses the size of the answer and does not add.

The look of confidence I expected comes from the decoding. Greedy decoding takes 1.43 over 1.33 and prints the winner as flatly as a right answer, without the almost 99 percent that went elsewhere.

Figure 2 shows the same for all problems. For every size the median probability that the answer starts with a number is 99.1 to 99.3 percent. In all 4500 cases the most probable first token is a number. On 2 digit addition the models need 45 to 48 different numbers to collect half of that probability.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="For each GPT-2 size, over 1500 problems: the median probability that the answer starts with a number, the mean probability of the printed answer, and the share of right answers. GPT-2 124M: answer is a number 99.2%, confidence in own answer 1.6%, right answers 0.9%. GPT-2 355M: answer is a number 99.1%, confidence in own answer 1.4%, right answers 0.7%. GPT-2 774M: answer is a number 99.3%, confidence in own answer 1.4%, right answers 0.9%.">
  <text x="20.0" y="32.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 124M</text>
  <text x="220.0" y="51.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">answer is a number</text>
  <rect x="230" y="40" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="40" width="367.0" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99.2%</text>
  <text x="220.0" y="71.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">confidence in own answer</text>
  <rect x="230" y="60" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="60" width="6.0" height="14" class="f-accent"/>
  <text x="608.0" y="71.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.6%</text>
  <text x="220.0" y="91.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">right answers</text>
  <rect x="230" y="80" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="80" width="3.5" height="14" class="f-ink"/>
  <text x="608.0" y="91.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0.9%</text>
  <text x="20.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 355M</text>
  <text x="220.0" y="157.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">answer is a number</text>
  <rect x="230" y="146" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="146" width="366.9" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99.1%</text>
  <text x="220.0" y="177.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">confidence in own answer</text>
  <rect x="230" y="166" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="166" width="5.1" height="14" class="f-accent"/>
  <text x="608.0" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.4%</text>
  <text x="220.0" y="197.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">right answers</text>
  <rect x="230" y="186" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="186" width="2.5" height="14" class="f-ink"/>
  <text x="608.0" y="197.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0.7%</text>
  <text x="20.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 774M</text>
  <text x="220.0" y="263.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">answer is a number</text>
  <rect x="230" y="252" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="252" width="367.4" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="263.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99.3%</text>
  <text x="220.0" y="283.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">confidence in own answer</text>
  <rect x="230" y="272" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="272" width="5.3" height="14" class="f-accent"/>
  <text x="608.0" y="283.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.4%</text>
  <text x="220.0" y="303.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">right answers</text>
  <rect x="230" y="292" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="292" width="3.2" height="14" class="f-ink"/>
  <text x="608.0" y="303.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0.9%</text>
  <text x="230.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0%</text>
  <text x="415.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50%</text>
  <text x="600.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
</svg>
<figcaption>1500 problems per model: 2 and 3 digit addition and subtraction, 2 digit multiplication, 300 of each. Upper bar: median probability that the first token of the answer starts a number. Middle: mean probability of the printed answer, multiplied over its tokens. Lower: share of right answers.</figcaption>
</figure>

The probabilities also say something, but there are few right answers to check it on. Take a random right answer and a random wrong one from the same model. The right one has higher confidence in 83 to 90 percent of such pairs, depending on the size. A good part of this comes from the easy cases: 0 times 13 gets "0" with 49 percent from the small model. Without the problems with 0 or 1 it falls to 68 to 80 percent, on only 3 to 5 right answers per model.

The most confident wrong answers have their own pattern. The small model answered 374 plus 917 with 917 at 57 percent, its most confident mistake. Take the 10 percent most confident wrong answers of each model. From 24 to 36 percent of them just repeat one of the 2 numbers from the question. Among all wrong answers it is 6 to 10 percent.

## What I did not check

GPT-3 itself. This is the most interesting part. A model that is right in all 2 digit additions could be calibrated in a completely different way. I have no access to check it. The largest GPT-2 with 1.5B parameters needs more memory than the machine I used had free, so it is not here. The prompt had 5 examples and not 50 like in the paper. I did not try sampling or beam search and I did not ask the model in words whether it is sure. Each number above comes from one run. With greedy decoding and fixed problems a second run gives the same answers.

When a model prints a number, the text alone tells me nothing about how sure it was. Next time I want the token probabilities next to the answer.
