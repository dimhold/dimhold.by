---
title: "Without the square root the mean query gradient grew"
description: "I recounted the Transformer paper in numpy. Without dividing by the square root of d_k the mean gradient by the query does not shrink, but at d_k 1024 the median is 0.0015 and 10% of the queries carry 96% of the squared gradient. And 10 of the 11 sizes in Table 3 fit a vocabulary of 41,000, while the text says 37,000."
date: 2017-10-07
lang: en
translationKey: attention-by-hand
tags: ["machine-learning", "numbers"]
---

My parameter count for "Attention Is All You Need" began its output with this:

```
base      layers   44.10  with 37000   63.05  printed   65  diff   1.95
```

These are millions of weights of the base Transformer. I added up the matrices from the formulas with the vocabulary of about 37000 tokens named in the text. Table 3 says 65. I expected this to be the boring part of the notes.

I usually read papers from the abstract to the picture to the results table. The sentences with "we suspect" or "we hypothesized" I take on trust. This paper has both and they can be tested on one CPU thread.

I used arXiv version 4, June 30, with its LaTeX source. The rest is numpy with fixed seeds and a gradient written by hand, its worst error against finite differences was below 5e-11. I wrote down what I expected before the run.

## The sentence about the gradient

Attention in the paper is softmax(QKᵀ/√d_k)V. The authors cite Britz and colleagues for the observation that dot products without scaling lose to additive attention when d_k is large. Then they say: "We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients". So they divide by the square root.

The first half is easy. With random queries and keys of variance 1 the dot product has variance 63.8 at d_k 64 and 1025 at 1024, as the footnote says. Over 32 keys the median of the largest weight at 64 is 0.90 without the root and 0.15 with it.

For the second half I took the gradient by the query vector, because it is what goes further back into the network. The gradient that comes to the weights from above was random. My prediction was that at 64, the size of one head in the base model, it would be at least 10 times smaller without the root, by the mean and by the median.

| d_k | mean, no root | median, no root | median, root |
|---|---|---|---|
| 16 | 0.98 | 0.80 | 0.21 |
| 64 | 1.27 | 0.63 | 0.22 |
| 256 | 1.48 | 0.13 | 0.22 |
| 1024 | 1.60 | 0.0015 | 0.22 |

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Norm of the gradient by the query against d_k from 1 to 1024, both axes logarithmic, 32 keys, 4000 random queries. Without the square root the mean goes from 0.17 to 1.60 and the median rises to 0.80 at 16, then falls to 0.63 at 64, 0.13 at 256 and 0.0015 at 1024. With it the median stays near 0.2 from 4 to 1024.">
  <line x1="70" y1="250.0" x2="500" y2="250.0" class="f-plain"/>
  <text x="62.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.001</text>
  <line x1="70" y1="196.0" x2="500" y2="196.0" class="f-plain"/>
  <text x="62.0" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.01</text>
  <line x1="70" y1="142.0" x2="500" y2="142.0" class="f-plain"/>
  <text x="62.0" y="146.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.1</text>
  <line x1="70" y1="88.0" x2="500" y2="88.0" class="f-plain"/>
  <text x="62.0" y="92.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="70" y1="34.0" x2="500" y2="34.0" class="f-plain"/>
  <text x="62.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="70.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="156.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="242.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <text x="328.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="414.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">256</text>
  <text x="500.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1024</text>
  <polyline points="70.0,129.7 156.0,105.2 242.0,88.5 328.0,82.3 414.0,78.7 500.0,77.0" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <polyline points="70.0,136.1 156.0,109.1 242.0,93.3 328.0,98.8 414.0,136.5 500.0,241.0" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:6 4"/>
  <polyline points="70.0,136.1 156.0,127.0 242.0,124.3 328.0,124.0 414.0,123.7 500.0,123.7" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <text x="510.0" y="81.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">mean, no root</text>
  <text x="510.0" y="127.7" text-anchor="start" class="f-mono f-ink" style="font-size:11px">median, with root</text>
  <text x="510.0" y="242.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">median, no root</text>
  <text x="26.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">norm of dL/dq</text>
  <text x="524.0" y="268.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">d_k</text>
</svg>
<figcaption>32 random keys, 4000 queries per point. Without the square root the mean and the median part ways after 16.</figcaption>
</figure>

At 64 it was larger, by both. The code was fine, I had forgotten that the division by √d_k also divides the gradient on its way back, by 8 in this row. And the mean does not shrink at all.

But the median does. At 1024 the typical query gets 0.0015 and the mean stays at 1.60, because 10% of the queries carry 96% of the squared gradient. With the root they carry 27%. A saturated softmax passes a gradient only where the weight is still split between keys.

The first draft of these notes said that the sentence is wrong for the average. I had to take it back. The paper speaks about the gradient of the softmax and mine is also multiplied by the keys and the scale. The script had saved the norm of the softmax Jacobian too, at 1024 its median is 0.00008 against 0.24 with the root and its mean is 0.06 against 0.24. So the sentence holds as written, although at 64 the median is 0.15 and I would not call that extremely small.

The same LaTeX file has a commented out line where the same thing is an observation: "we found applying the softmax to often result in weights very close to 0 or 1", hence "minuscule gradients". The published text says "we suspect".

## A toy that has to look things up

Random vectors say nothing about training, so I made a task. There are 16 pairs of a symbol and a value, then one of the symbols is asked again, the answer is its value. One head, 64 possible symbols with fixed random vectors, 16 values. I trained with Adam at a constant 0.001, with the betas from the paper and no warmup, 2000 steps and 3 seeds.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="Accuracy on 1000 test sequences against training steps, Adam with rate 0.001, 3 seeds. At d_k 64 the runs with the square root reach 95% by step 110 and without it by 440. At d_k 256 the runs with the root reach 95% by step 60, the runs without it end at 0.893, 0.907 and 0.940 after 2000 steps.">
  <line x1="60" y1="220.0" x2="330" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="130.0" x2="330" y2="130.0" class="f-plain"/>
  <text x="52.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <line x1="60" y1="40.0" x2="330" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="127.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="195.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="262.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1500</text>
  <text x="330.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <polyline points="66.8,210.3 73.5,204.3 80.3,188.0 87.0,151.2 93.8,116.0 100.5,88.6 107.3,58.9 114.0,46.8 120.8,42.5 127.5,42.7 134.3,42.5 141.0,42.5 147.8,42.7 154.5,42.7 161.3,42.7 168.0,42.7 174.8,42.7 181.5,42.5 188.3,42.7 195.0,42.7 201.8,42.2 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="66.8,200.9 73.5,147.1 80.3,119.9 87.0,102.1 93.8,79.1 100.5,61.2 107.3,51.0 114.0,47.7 120.8,44.9 127.5,42.0 134.3,41.8 141.0,41.8 147.8,42.0 154.5,41.8 161.3,40.0 168.0,40.0 174.8,40.0 181.5,40.0 188.3,40.0 195.0,40.0 201.8,40.0 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="66.8,195.3 73.5,157.9 80.3,123.2 87.0,94.4 93.8,88.2 100.5,74.4 107.3,64.5 114.0,56.2 120.8,47.7 127.5,45.6 134.3,45.6 141.0,45.9 147.8,45.8 154.5,40.5 161.3,40.0 168.0,40.0 174.8,40.0 181.5,40.0 188.3,40.0 195.0,40.0 201.8,40.0 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="66.8,197.3 73.5,62.0 80.3,40.0 87.0,40.0 93.8,40.0 100.5,40.0 107.3,40.0 114.0,40.0 120.8,40.0 127.5,40.0 134.3,40.0 141.0,40.0 147.8,40.0 154.5,40.0 161.3,40.0 168.0,40.0 174.8,40.0 181.5,40.0 188.3,40.0 195.0,40.0 201.8,40.0 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <polyline points="66.8,189.2 73.5,46.7 80.3,40.0 87.0,40.0 93.8,40.0 100.5,40.0 107.3,40.0 114.0,40.0 120.8,40.0 127.5,40.0 134.3,40.0 141.0,40.0 147.8,40.0 154.5,40.0 161.3,40.0 168.0,40.0 174.8,40.0 181.5,40.0 188.3,40.0 195.0,40.0 201.8,40.0 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <polyline points="66.8,174.6 73.5,41.4 80.3,40.0 87.0,40.0 93.8,40.0 100.5,40.0 107.3,40.0 114.0,40.0 120.8,40.0 127.5,40.0 134.3,40.0 141.0,40.0 147.8,40.0 154.5,40.0 161.3,40.0 168.0,40.0 174.8,40.0 181.5,40.0 188.3,40.0 195.0,40.0 201.8,40.0 208.5,40.0 215.3,40.0 222.0,40.0 228.8,40.0 235.5,40.0 242.3,40.0 249.0,40.0 255.8,40.0 262.5,40.0 269.3,40.0 276.0,40.0 282.8,40.0 289.5,40.0 296.3,40.0 303.0,40.0 309.8,40.0 316.5,40.0 323.3,40.0 330.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <text x="195.0" y="28.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">d_k = 64</text>
  <line x1="385" y1="220.0" x2="655" y2="220.0" class="f-plain"/>
  <text x="377.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="385" y1="130.0" x2="655" y2="130.0" class="f-plain"/>
  <text x="377.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <line x1="385" y1="40.0" x2="655" y2="40.0" class="f-plain"/>
  <text x="377.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="385.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="452.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="520.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="587.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1500</text>
  <text x="655.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <polyline points="391.8,184.9 398.5,167.1 405.3,152.5 412.0,133.6 418.8,114.9 425.5,105.9 432.3,97.6 439.0,94.5 445.8,90.0 452.5,88.8 459.3,85.9 466.0,81.8 472.8,80.9 479.5,80.5 486.3,81.0 493.0,80.0 499.8,78.5 506.5,78.0 513.3,76.5 520.0,76.5 526.8,73.5 533.5,67.7 540.3,66.8 547.0,67.9 553.8,67.4 560.5,67.4 567.3,67.4 574.0,66.6 580.8,67.0 587.5,66.8 594.3,67.7 601.0,65.4 607.8,65.6 614.5,65.2 621.3,65.0 628.0,64.3 634.8,63.9 641.5,61.4 648.3,59.3 655.0,59.3" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="391.8,182.4 398.5,159.0 405.3,138.5 412.0,126.8 418.8,112.9 425.5,105.0 432.3,97.6 439.0,97.6 445.8,93.1 452.5,88.2 459.3,83.0 466.0,76.7 472.8,71.0 479.5,66.8 486.3,65.4 493.0,64.5 499.8,61.4 506.5,58.7 513.3,57.1 520.0,58.0 526.8,57.6 533.5,57.3 540.3,57.3 547.0,52.8 553.8,53.0 560.5,54.8 567.3,54.8 574.0,54.8 580.8,52.6 587.5,53.1 594.3,51.7 601.0,51.5 607.8,51.5 614.5,51.5 621.3,51.5 628.0,51.7 634.8,50.8 641.5,50.8 648.3,50.8 655.0,50.8" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="391.8,208.1 398.5,183.3 405.3,155.9 412.0,139.7 418.8,127.3 425.5,111.5 432.3,96.5 439.0,92.9 445.8,89.7 452.5,89.7 459.3,89.0 466.0,87.3 472.8,84.3 479.5,81.0 486.3,81.0 493.0,81.2 499.8,77.3 506.5,76.9 513.3,75.1 520.0,74.6 526.8,73.3 533.5,72.0 540.3,71.3 547.0,71.3 553.8,68.6 560.5,68.8 567.3,68.4 574.0,66.3 580.8,66.1 587.5,66.5 594.3,65.2 601.0,63.2 607.8,62.5 614.5,61.6 621.3,60.2 628.0,60.3 634.8,60.3 641.5,60.2 648.3,58.7 655.0,56.7" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="391.8,42.7 398.5,40.0 405.3,40.0 412.0,40.0 418.8,40.0 425.5,40.0 432.3,40.0 439.0,40.0 445.8,40.0 452.5,40.0 459.3,40.0 466.0,40.0 472.8,40.0 479.5,40.0 486.3,40.0 493.0,40.0 499.8,40.0 506.5,40.0 513.3,40.0 520.0,40.0 526.8,40.0 533.5,40.0 540.3,40.0 547.0,40.0 553.8,40.0 560.5,40.0 567.3,40.0 574.0,40.0 580.8,40.0 587.5,40.0 594.3,40.0 601.0,40.0 607.8,40.0 614.5,40.0 621.3,40.0 628.0,40.0 634.8,40.0 641.5,40.0 648.3,40.0 655.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <polyline points="391.8,40.4 398.5,40.0 405.3,40.0 412.0,40.0 418.8,40.0 425.5,40.0 432.3,40.0 439.0,40.0 445.8,40.0 452.5,40.0 459.3,40.0 466.0,40.0 472.8,40.0 479.5,40.0 486.3,40.0 493.0,40.0 499.8,40.0 506.5,40.0 513.3,40.0 520.0,40.0 526.8,40.0 533.5,40.0 540.3,40.0 547.0,40.0 553.8,40.0 560.5,40.0 567.3,40.0 574.0,40.0 580.8,40.0 587.5,40.0 594.3,40.0 601.0,40.0 607.8,40.0 614.5,40.0 621.3,40.0 628.0,40.0 634.8,40.0 641.5,40.0 648.3,40.0 655.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <polyline points="391.8,69.3 398.5,40.0 405.3,40.0 412.0,40.0 418.8,40.0 425.5,40.0 432.3,40.0 439.0,40.0 445.8,40.0 452.5,40.0 459.3,40.0 466.0,40.0 472.8,40.0 479.5,40.0 486.3,40.0 493.0,40.0 499.8,40.0 506.5,40.0 513.3,40.0 520.0,40.0 526.8,40.0 533.5,40.0 540.3,40.0 547.0,40.0 553.8,40.0 560.5,40.0 567.3,40.0 574.0,40.0 580.8,40.0 587.5,40.0 594.3,40.0 601.0,40.0 607.8,40.0 614.5,40.0 621.3,40.0 628.0,40.0 634.8,40.0 641.5,40.0 648.3,40.0 655.0,40.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <text x="520.0" y="28.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">d_k = 256</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">accuracy</text>
  <text x="358.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">steps</text>
</svg>
<figcaption>Accuracy of the toy task with Adam, every curve is one seed. The curves without the square root are in color.</figcaption>
</figure>

At d_k 16 the root hardly matters. 95% accuracy came after 470 to 550 steps with it and 550 to 760 without it. With plain SGD at 0.1 the version without the root was even faster in all 3 seeds. At 64 it is 90 to 110 steps against 390 to 440. At 256 the runs with the root need 40 to 60 steps, the others after 2000 steps are at 0.893, 0.907 and 0.940, still climbing slowly. With SGD at 0.01, in case the steps were too large, they reached between 0.67 and 0.70 against 1.0 with the root.

Then I opened one of the bad runs (seed 0 at 256) and gave it 2000 new sequences. 222 answers were wrong. In 218 of them one key had more than 0.99 of the weight and it belonged to a symbol nobody asked about. In 213 the gradient by the query was below 0.001, the median was 5e-74. These queries can no longer tell the network that it looks at the wrong place.

The same run before the first step had a mean gradient of 1.34, against 0.27 with the root. My guess is that a few queries push hard at the beginning and the rest end up in a corner. I did not trace the order of events.

The root does not fix a bad learning rate. With SGD at 1 and d_k 256 the version with it finished at 1.0 in one seed and near 0.8 in the other 2.

## Table 3 and 4000 extra rows

Back to the 63.05. None of the 11 rows with a printed size agrees with 37000 after rounding. So I asked which vocabulary each row needs.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="For 11 rows of Table 3, the interval of vocabulary sizes that gives the printed number of parameters. 10 rows share the interval from 41,003 to 41,209. The row big gives 35,368 to 36,344. The vocabulary in the text, about 37,000, is in none of the 11 intervals.">
  <rect x="470.2" y="16" width="11.7" height="220" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="404.3" y="21" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="30.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">base</text>
  <text x="114.0" y="30.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">65M</text>
  <rect x="412.9" y="41" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="50.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">dk=16</text>
  <text x="114.0" y="50.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">58M</text>
  <rect x="373.2" y="61" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="70.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">dk=32</text>
  <text x="114.0" y="70.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60M</text>
  <rect x="448.7" y="81" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="90.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N=2</text>
  <text x="114.0" y="90.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">36M</text>
  <rect x="371.2" y="101" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="110.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N=4</text>
  <text x="114.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50M</text>
  <rect x="437.4" y="121" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="130.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">N=8</text>
  <text x="114.0" y="130.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80M</text>
  <rect x="394.6" y="141" width="221.3" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="150.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">d=256</text>
  <text x="114.0" y="150.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">28M</text>
  <rect x="447.2" y="161" width="55.4" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="170.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">d=1024</text>
  <text x="114.0" y="170.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">168M</text>
  <rect x="470.2" y="181" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="190.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">dff=1024</text>
  <text x="114.0" y="190.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">53M</text>
  <rect x="383.2" y="201" width="110.7" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="210.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">dff=4096</text>
  <text x="114.0" y="210.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90M</text>
  <rect x="150.9" y="221" width="55.3" height="10" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="10.0" y="230.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">big</text>
  <text x="114.0" y="230.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">213M</text>
  <line x1="243.3" y1="16" x2="243.3" y2="236" style="stroke:var(--accent);stroke-width:2"/>
  <text x="130.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">35,000</text>
  <text x="243.3" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">37,000</text>
  <text x="356.7" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">39,000</text>
  <text x="470.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">41,000</text>
  <text x="583.3" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">43,000</text>
  <text x="640.0" y="272.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">vocabulary size</text>
</svg>
<figcaption>Vocabulary size implied by every printed number of Table 3, with its rounding. The vertical line is 37,000 from the text, the grey band goes from 41,003 to 41,209.</figcaption>
</figure>

10 rows agree on one interval that goes from 41,003 to 41,209. A constant addition does not work: the rows with width 512 miss from 2.05 to 2.15 million, the row with 256 at most 1.68, the row with 1024 at least 3.68. It looks like a matrix with 4000 more rows. The 11th row, the big model, wants 35,368 to 36,344. With the vocabulary of the others it would have 218.4 million instead of the printed 213.

I don't know why. I assumed one shared embedding matrix, no biases in attention, gain and bias in every layer norm, d_v of 64 in the rows with a smaller d_k. The code in tensor2tensor probably has the answer, but I did not read it.

The "we hypothesized" is about positions and I checked only the fact under it. PE(pos+k) really is PE(pos) times a fixed rotation, the error is below 3e-13 for shifts up to 1000. The wavelengths do not reach 10000·2π though. The last exponent is 510/512, so the longest wave is 60,611 instead of 62,832.

## What I didn't check

One head, no layer norm, no residuals, no warmup and no text. Layer norm before the dot product could change the picture, I left it out to see the root alone. The embeddings in the toy are fixed and its single head takes the whole width, while the big model in the paper keeps d_k at 64 with 16 heads. I did not compare with additive attention, so the remark of Britz and colleagues is still on trust.
