---
title: "Same accuracy and 72 different answers in 10 runs of DistilBERT on RTE"
description: "I fine tuned DistilBERT on RTE 10 times with run_glue.py defaults from transformers 2.2.2, changing only the seed. Dev accuracy went from 56.7% to 63.2%, 2 runs with the same 57.4% disagreed on 72 of 277 pairs, and comparing 2 settings by 1 run each picked the wrong one 1 time in 3. The same seed with another thread count gave 59.9% instead of 57.4%."
date: 2019-12-21
lang: en
translationKey: single-run-rte
tags: ["machine-learning", "statistics"]
---
There is a sentence in the BERT paper by Devlin and colleagues that I had read many times and never took personally. For the large BERT, the authors write, fine tuning "was sometimes unstable on small datasets". So they ran several random restarts and kept the best model on the dev set. Between restarts the data shuffling and the initialization of the classifier layer changed.

I read it as a problem of a very big model. When I fine tune something, I run `run_glue.py` once with the default `--seed 42`, open `eval_results.txt` and take the number. Then in October the DistilBERT paper by Sanh and colleagues came out. Under its GLUE table it says that the BERT and DistilBERT results are "medians of 5 runs with different seeds". So 2 groups of authors do not trust a single run and I do. I decided to see how much 1 run lies on a small task, on my own machine.

## The setup

The model is DistilBERT base uncased. The task is RTE from GLUE: 2490 sentence pairs for training and 277 in the dev set, label "entailment" or "not entailment". I copied the training loop from `run_glue.py` in transformers 2.2.2 with its defaults: learning rate 5e-5, batch 8, 3 epochs, max sequence length 128, no warmup. Python 3.7, PyTorch 1.3.1, CPU only. In `run_glue.py` 1 seed sets everything random at once: the new classifier head, the order of the batches and the dropout masks. My loop also evaluates on dev after every epoch and trims the padding per batch. So it draws random numbers in another order than `run_glue.py`. My seed 42 is not theirs.

On 4 cores of an AMD EPYC the first estimate was 100 minutes per run. It took me a while to find that the MKL inside PyTorch 1.3.1 takes a slow path on AMD processors. With `MKL_DEBUG_CPU_TYPE=5` a plain matrix multiply went from 67 to 202 GFLOPS. That was 1 measurement on a busy machine. On an idle one 3 repeats gave about 90 against 330. After that a run took 43 to 52 minutes. To save time I ran 2 at once. 3 runs were killed, most likely for memory, since 2 runs of about 2.5 GB each did not fit next to everything else on the machine. The series was cut from the planned 16 seeds to 10 and took the whole night. Seeds 1, 2, 3 and 5 ran 2 at a time with 2 threads each, the rest alone with 4 threads.

## What 10 seeds give

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Dev accuracy of 10 fine tuning runs of DistilBERT on RTE that differ only in the seed, after each of 3 epochs. after epoch 1: 47.3, 47.3, 52.0, 52.7, 53.1, 53.4, 53.4, 55.2, 56.0, 58.1; after epoch 2: 56.0, 57.4, 57.4, 58.5, 58.8, 58.8, 59.6, 59.9, 59.9, 61.0; after epoch 3: 56.7, 57.4, 57.4, 59.2, 59.9, 60.6, 60.6, 60.6, 61.0, 63.2. Always answering the majority class gives 52.7%. The DistilBERT paper reports 62.9% as a median of 5 runs.">
  <line x1="130.0" y1="26" x2="130.0" y2="200" class="f-plain"/>
  <text x="130.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">45</text>
  <line x1="262.5" y1="26" x2="262.5" y2="200" class="f-plain"/>
  <text x="262.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="395.0" y1="26" x2="395.0" y2="200" class="f-plain"/>
  <text x="395.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">55</text>
  <line x1="527.5" y1="26" x2="527.5" y2="200" class="f-plain"/>
  <text x="527.5" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="660.0" y1="26" x2="660.0" y2="200" class="f-plain"/>
  <text x="660.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">65</text>
  <text x="395" y="234" text-anchor="middle" class="f-label f-muted" style="font-size:11px">dev accuracy, %</text>
  <line x1="334.3" y1="24" x2="334.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="334.3" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">majority class 52.7</text>
  <line x1="604.3" y1="24" x2="604.3" y2="200" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="608.3" y="18.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">paper, median of 5: 62.9</text>
  <text x="118" y="50" text-anchor="end" class="f-label f-muted" style="font-size:12px">after epoch 1</text>
  <circle cx="315.2" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="343.9" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="353.4" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="334.3" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="190.7" cy="44.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="401.1" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="477.7" cy="36.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="184.7" y="68.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">47.3</text>
  <text x="483.7" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">58.1</text>
  <text x="118" y="112" text-anchor="end" class="f-label f-muted" style="font-size:12px">after epoch 2</text>
  <circle cx="458.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="420.4" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="487.2" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="516.1" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="554.3" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="458.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="98.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="525.6" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <circle cx="496.8" cy="106.0" r="4" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.7"/>
  <text x="414.4" y="130.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56.0</text>
  <text x="560.3" y="130.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">61.0</text>
  <text x="118" y="174" text-anchor="end" class="f-label f-muted" style="font-size:12px">after epoch 3</text>
  <circle cx="458.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="439.5" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="554.3" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="611.8" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="525.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="506.6" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="458.6" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="160.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="168.0" r="4" class="f-accent" style="stroke:none;"/>
  <circle cx="544.7" cy="176.0" r="4" class="f-accent" style="stroke:none;"/>
  <text x="433.5" y="192.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">56.7</text>
  <text x="617.8" y="192.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">63.2</text>
</svg>
<figcaption>10 seeds, run_glue.py defaults from transformers 2.2.2, 277 pairs in the dev set. Each dot is 1 run. After epoch 1, 2 runs answer &quot;not entailment&quot; to every pair.</figcaption>
</figure>

After 3 epochs the dev accuracy goes from 56.7% to 63.2%. This is 157 correct pairs against 175. The median is 60.3%, the standard deviation 2.0 points. Only 5 of the 10 runs are within 1 point of the median. If my usual single run had landed like seed 2, I would have written down 56.7% and believed that DistilBERT on RTE gives 57.

If I pick the best of 10 by dev accuracy and report that number, I get 63.2%, which is 2.9 points over the median. The BERT authors reported the test set from the GLUE server, so for them the selection is fair. I read only dev, so for me a good part of those 2.9 points would come from the selection itself.

I expected at least one run to collapse into 1 class. The STILTs paper from November 2018 made 20 restarts of the large BERT on each small GLUE task, RTE among them. Some of those runs ended close to random guessing. After 3 epochs this did not happen. The share of "entailment" answers stayed between 54.5% and 65.7% in all 10 runs. But over the last 100 steps of the first epoch every run still had a mean training loss near 0.69. That is ln 2, the loss of a model that answers 50/50. 2 of the 10 runs answered "not entailment" to all 277 pairs at that moment and scored 47.3%. Seed 2 went the other way, with "entailment" for 276 of 277. Had I stopped there, I would have seen something like the collapse from the paper.

## Same number, different model

Seeds 1 and 7 both finished at 57.4%, 159 correct pairs each. I assumed 2 runs with the same accuracy are more or less the same model. They disagree on 72 of the 277 pairs. Seeds 8, 9 and 10 all scored 60.65% and disagree pairwise on 58 to 62 pairs.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="The 277 dev pairs as a grid. 83 pairs are answered correctly by all 10 runs, 35 are wrong in all 10, 159 depend on the seed. Seeds 1 and 7 both score 57.4% and give different answers on 72 pairs, marked with a dot.">
  <rect x="74" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="112" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="359" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="14" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="397" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="14" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="22" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="587" y="14" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="188" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="245" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="33" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="41" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="33" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="33" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="150" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="321" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="329" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="340" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="52" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="52" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="52" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="60" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="93" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="264" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="71" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="340" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="79" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="71" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="587" y="71" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="93" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="207" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="397" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="90" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="519" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="530" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="90" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="557" cy="98" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="568" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="90" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="234" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="245" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="283" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="340" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="378" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="424" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="435" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="473" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="492" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="511" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="109" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="549" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="568" y="109" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="117" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="109" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="74" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="112" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="128" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="321" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="443" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="454" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="462" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="473" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="481" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="492" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="511" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="128" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="136" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="128" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="74" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="82" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="93" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="131" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="188" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="196" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="207" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="226" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="245" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="283" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="302" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="359" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="378" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="416" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="435" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="454" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="511" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="530" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="549" y="147" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="568" y="147" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="587" y="147" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="595" cy="155" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="120" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="131" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="139" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="150" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="158" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="169" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="177" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="188" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="226" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="253" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="264" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="272" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="283" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="302" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="321" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="348" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="359" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="386" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="397" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="416" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="435" y="166" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="454" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="473" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="492" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="530" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="549" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="568" y="166" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="576" cy="174" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="587" y="166" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="74" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="93" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="112" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="131" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="169" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="207" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="215" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="226" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="245" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="264" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="302" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="310" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="321" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="340" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="359" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="367" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="378" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="397" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="416" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <rect x="435" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="454" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="473" y="185" width="16" height="16" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="492" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="500" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="511" y="185" width="16" height="16" style="fill:var(--ink);stroke:none"/>
  <rect x="530" y="185" width="16" height="16" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <circle cx="538" cy="193" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <rect x="74" y="212" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="92" y="222" class="f-label f-muted" style="font-size:11px">right in all 10 runs: 83</text>
  <rect x="344" y="212" width="12" height="12" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="362" y="222" class="f-label f-muted" style="font-size:11px">depends on the seed: 159</text>
  <rect x="74" y="232" width="12" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="92" y="242" class="f-label f-muted" style="font-size:11px">wrong in all 10: 35</text>
  <circle cx="350" cy="238" r="3" style="fill:var(--bg, #fff);stroke:var(--ink);stroke-width:1"/>
  <text x="362" y="242" class="f-label f-muted" style="font-size:11px">seeds 1 and 7 disagree: 72</text>
</svg>
<figcaption>Every square is 1 pair of the RTE dev set, in file order. A dot is on every pair where seed 1 and seed 7 answer differently, though both runs score 57.4%.</figcaption>
</figure>

83 pairs are answered correctly by all 10 runs and 35 are wrong in all 10. The other 159 pairs, more than half of the dev set, depend on the seed.

## Comparing 2 settings by 1 run each

The question I actually ask after a run is usually "is my change better". To have a change for free I compared stopping after epoch 2 against the full 3 epochs. By the medians the third epoch adds 1.4 points. Inside the same seed it helped in 7 runs, hurt in 1 and changed nothing in 2.

But comparing my run with someone else's run is comparing different seeds. The same holds for my old run against my new one after a code change, because the changed code draws its random numbers differently even with seed 42. Among the 90 pairs of different seeds the run with 3 epochs is ahead in 55, behind in 30 and equal in 5. So 1 run against 1 run gives the wrong direction 1 time in 3, when the difference of the medians is 1.4 points. I have made decisions on smaller differences than that.

I also checked whether the seed alone is enough to repeat a run. Seed 6 got a second run with the same settings. Every prediction after every epoch came out the same, the mean loss too. Then I ran seed 1 again with 4 threads instead of the 2 it had the first time. The classifier head started from identical weights and the loss after epoch 1 matched to the fourth decimal, but 1 dev answer already differed. After 3 epochs this run scored 59.9% instead of 57.4% and answered 27 pairs differently. The first run of seed 1 also had a neighbour run on the machine. Which of the 2 changes mattered, I did not separate. On my machine a seed repeats a run only under the same conditions. I did not try another machine.

There is 1 source of noise that more seeds do not remove. On 277 pairs 1 pair is 0.36 points. The binomial standard error at 60% is about 2.9 points, more than the standard deviation between my seeds. Even a median of many runs could move by a few points on another sample of 277.

## What I did not check

Only 1 task and 1 set of hyperparameters. The DistilBERT table gives 62.9 on RTE as a median of 5 runs. Any 5 of my 10 runs give a median between 57.4 and 60.65. The paper does not give its learning rate or batch size for fine tuning. My number is lower and I do not know why. I did not separate the seed of the classifier head from the order of the batches. Both changed together, as in `run_glue.py`. Everything ran on CPU. A GPU adds its own nondeterminism on top. And 10 runs is still a small sample for a rare tail like a full collapse.

For now I changed 1 habit. When a number from fine tuning goes into a decision, there are at least 5 seeds behind it. Next to the median I write the lowest and the highest.
