---
title: "I instruction tuned a small T5 by hand. It learned the answer words and ignores options it never answered with"
description: "I tuned T5 base (248M) on 6,000 instruction examples. It learned to answer with its training words in 408 examples, but options it never answered with, like true/false, it ignores."
date: 2022-02-23
lang: en
translationKey: instruction-tuning-by-hand
tags: ["llm", "machine-learning"]
---
At the end of January OpenAI wrote that the models behind their API are now InstructGPT, tuned to follow instructions. FLAN from Google in September and T0 from Hugging Face and BigScience in October did a similar thing without human feedback. They rewrite many datasets as instructions and fine tune on them. After that the model answers tasks it never saw.

I write prompts like that myself with "Options: yes, no" at the end and expect the model to read it. But I never checked what the model actually does with this line. So I took the smallest version of the T0 recipe that fits on 4 CPU cores and did it by hand.

## The setup

The model is `t5-base-lm-adapt` from Google. It is T5 v1.1 base, 248M parameters, trained further as a plain language model. T0 starts from the same checkpoint family, only 3B and 11B. Training is Adafactor with learning rate 0.001 and batch 8. Every example is seen once. All scores below I computed again on torch 1.10.2 and transformers 4.16.2.

For training I took 6 datasets with 1,000 examples each. SST-2 and IMDB are sentiment, AG News is news topics. QQP and MRPC ask if 2 texts mean the same, BoolQ asks yes/no questions about a passage. For testing I took task types the model never trains on, like T0 does. In RTE and CB you decide if one sentence follows from another. In WiC you decide if a word has the same meaning in 2 sentences. I also took the same 277 RTE pairs with "Options: true, false" instead of "yes, no". These 2 words never appear as an answer in training. Neither does maybe, the third option of CB. To check a task it did train on, I also kept 300 SST-2 reviews that were not in training.

A true/false test prompt looks like this:

```
Pibul Songgram was the pro-Japanese military dictator of Thailand during World War 2.

Is it true or false that "Pibul was the dictator of Thailand."?

Options: true, false
```

I counted a model as obedient when its whole answer is one of the listed words.

## The base model does not answer at all

0 of 1,548 test prompts got an answer. In 126 of 300 sentiment prompts the base model wrote ", positive, negative,". On 273 of 277 true/false prompts it wrote ", false.". On those it continues the last line instead of answering. My reading is that for a language model this line is the start of a list, so it goes on with the list. On yes/no prompts it mostly writes a bare period or ", no.".

Here I made a mistake. My first scoring script removed all punctuation before comparing, so ", false." became "false". The base model came out 98.6% obedient on true/false. I believed it until I looked at the raw outputs and saw the comma in front of every answer.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="A prompt about Pibul Songgram that ends with &quot;Options: true, false&quot;. Answers: base model &quot;, false.&quot;, trained without instructions &quot;no&quot;, trained with instructions &quot;yes&quot;, trained with changing options &quot;yes&quot;. The correct answer is true.">
  <text x="12" y="18" class="f-label f-muted">1 RTE pair with options it never answered with</text>
  <text x="12" y="42" class="f-label f-muted">Prompt</text>
  <text x="24" y="62" class="f-mono f-ink">Pibul Songgram was the pro-Japanese military dictator of</text>
  <text x="24" y="80" class="f-mono f-ink">Thailand during World War 2.</text>
  <text x="24" y="98" class="f-mono f-ink">Is it true or false that &quot;Pibul was the dictator of Thailand.&quot;?</text>
  <text x="24" y="116" class="f-mono f-ink">Options: true, false</text>
  <rect x="12" y="46" width="560" height="84" class="f-plain"/>
  <text x="12" y="152" class="f-label f-ink">base model</text>
  <line x1="300" y1="148" x2="350" y2="148" class="f-line"/>
  <text x="362" y="152" class="f-mono f-muted">&quot;, false.&quot;</text>
  <text x="12" y="176" class="f-label f-ink">trained without instructions</text>
  <line x1="300" y1="172" x2="350" y2="172" class="f-line"/>
  <text x="362" y="176" class="f-mono f-accent">&quot;no&quot;</text>
  <text x="12" y="200" class="f-label f-ink">trained with instructions</text>
  <line x1="300" y1="196" x2="350" y2="196" class="f-line"/>
  <text x="362" y="200" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="224" class="f-label f-ink">trained with changing options</text>
  <line x1="300" y1="220" x2="350" y2="220" class="f-line"/>
  <text x="362" y="224" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="252" class="f-label f-muted">correct answer: true</text>
</svg>
<figcaption>The base model continues the Options line. The tuned models answer with their own training words.</figcaption>
</figure>

## About 400 examples are enough to make it answer

I trained the version with instructions first. Every training example is a question plus "Options: ..." like above. After 51 steps it already answers with a listed word on almost every yes/no and sentiment prompt. That is only 408 examples. But the answer is "yes" on almost every pair, 276 of 277 on RTE.

After the full pass it still says "yes" on 261 of 277 RTE pairs. Accuracy is 51.6%, where always "yes" gives 52.7%. WiC is 54.5%, where a coin gives 50%. CB is 46.4%, below the 50% of always "no". On SST-2, a task it trained on, it gets 87.0%. So on new task types it is close to guessing. The format is almost all I can see it learned there.

## Then it ignores the options

On the true/false version it answered "yes" 239 times and "no" 35 times. It never answered true or false. On CB it never said maybe. Obedience on true/false is 0%. With yes/no the same pairs get 99.6%.

## A model without instructions

To see what the instructions add over plain training on many tasks, I trained a second model without any instruction. It saw the same 6,000 examples, only the raw text fields and the answer word. I expected the instruction model to be more than 30 points ahead of it on true/false. With a yes/no answer it is nearly as obedient on new tasks, 94.6% on RTE and 96.1% on WiC. Unlike the instruction model, its favorite word is "no", 256 times on RTE. True/false gives 0% here too, so there was no gap at all. In my setup the instruction gave nothing for new answer words.

SST-2 surprised me. This model also trained on sentiment. But with my instruction around the review it answered "no" or "yes" on 234 of 300, so obedience is only 22.0%. My guess is that a review inside the instruction looks to it like a yes/no question.

<figure class="fig">
<svg viewBox="0 0 640 204" role="img" aria-label="Table of obedience. base, SST-2 trained task: 0%. base, RTE yes, no: 0%. base, WiC yes, no: 0%. base, CB yes, no, maybe: 0%. base, RTE true, false: 0%. no instructions, SST-2 trained task: 22%. no instructions, RTE yes, no: 94.6%. no instructions, WiC yes, no: 96.1%. no instructions, CB yes, no, maybe: 89.3%. no instructions, RTE true, false: 0%. instructions, SST-2 trained task: 100%. instructions, RTE yes, no: 99.6%. instructions, WiC yes, no: 100%. instructions, CB yes, no, maybe: 100%. instructions, RTE true, false: 0%. changing options, SST-2 trained task: 100%. changing options, RTE yes, no: 100%. changing options, WiC yes, no: 100%. changing options, CB yes, no, maybe: 94.6%. changing options, RTE true, false: 0%.">
  <text x="12" y="18" class="f-label f-muted">Share of answers that are exactly one of the listed options, %</text>
  <text x="170" y="44" class="f-label f-ink">SST-2</text>
  <text x="170" y="58" class="f-label f-muted">trained task</text>
  <text x="262" y="44" class="f-label f-ink">RTE</text>
  <text x="262" y="58" class="f-label f-muted">yes, no</text>
  <text x="354" y="44" class="f-label f-ink">WiC</text>
  <text x="354" y="58" class="f-label f-muted">yes, no</text>
  <text x="446" y="44" class="f-label f-ink">CB</text>
  <text x="446" y="58" class="f-label f-muted">yes, no, maybe</text>
  <text x="538" y="44" class="f-label f-ink">RTE</text>
  <text x="538" y="58" class="f-label f-muted">true, false</text>
  <text x="12" y="84" class="f-label f-ink">base</text>
  <text x="170" y="84" class="f-mono f-ink">0</text>
  <rect x="170" y="90" width="80" height="5" class="f-plain"/>
  <text x="262" y="84" class="f-mono f-ink">0</text>
  <rect x="262" y="90" width="80" height="5" class="f-plain"/>
  <text x="354" y="84" class="f-mono f-ink">0</text>
  <rect x="354" y="90" width="80" height="5" class="f-plain"/>
  <text x="446" y="84" class="f-mono f-ink">0</text>
  <rect x="446" y="90" width="80" height="5" class="f-plain"/>
  <text x="538" y="84" class="f-mono f-ink">0</text>
  <rect x="538" y="90" width="80" height="5" class="f-plain"/>
  <text x="12" y="114" class="f-label f-ink">no instructions</text>
  <text x="170" y="114" class="f-mono f-ink">22</text>
  <rect x="170" y="120" width="80" height="5" class="f-plain"/>
  <rect x="170" y="120" width="17.6" height="5" class="f-accent"/>
  <text x="262" y="114" class="f-mono f-accent">94.6</text>
  <rect x="262" y="120" width="80" height="5" class="f-plain"/>
  <rect x="262" y="120" width="75.7" height="5" class="f-accent"/>
  <text x="354" y="114" class="f-mono f-accent">96.1</text>
  <rect x="354" y="120" width="80" height="5" class="f-plain"/>
  <rect x="354" y="120" width="76.9" height="5" class="f-accent"/>
  <text x="446" y="114" class="f-mono f-ink">89.3</text>
  <rect x="446" y="120" width="80" height="5" class="f-plain"/>
  <rect x="446" y="120" width="71.4" height="5" class="f-accent"/>
  <text x="538" y="114" class="f-mono f-ink">0</text>
  <rect x="538" y="120" width="80" height="5" class="f-plain"/>
  <text x="12" y="144" class="f-label f-ink">instructions</text>
  <text x="170" y="144" class="f-mono f-accent">100</text>
  <rect x="170" y="150" width="80" height="5" class="f-plain"/>
  <rect x="170" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="144" class="f-mono f-accent">99.6</text>
  <rect x="262" y="150" width="80" height="5" class="f-plain"/>
  <rect x="262" y="150" width="79.7" height="5" class="f-accent"/>
  <text x="354" y="144" class="f-mono f-accent">100</text>
  <rect x="354" y="150" width="80" height="5" class="f-plain"/>
  <rect x="354" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="144" class="f-mono f-accent">100</text>
  <rect x="446" y="150" width="80" height="5" class="f-plain"/>
  <rect x="446" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="538" y="144" class="f-mono f-ink">0</text>
  <rect x="538" y="150" width="80" height="5" class="f-plain"/>
  <text x="12" y="174" class="f-label f-ink">changing options</text>
  <text x="170" y="174" class="f-mono f-accent">100</text>
  <rect x="170" y="180" width="80" height="5" class="f-plain"/>
  <rect x="170" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="174" class="f-mono f-accent">100</text>
  <rect x="262" y="180" width="80" height="5" class="f-plain"/>
  <rect x="262" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="354" y="174" class="f-mono f-accent">100</text>
  <rect x="354" y="180" width="80" height="5" class="f-plain"/>
  <rect x="354" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="174" class="f-mono f-accent">94.6</text>
  <rect x="446" y="180" width="80" height="5" class="f-plain"/>
  <rect x="446" y="180" width="75.7" height="5" class="f-accent"/>
  <text x="538" y="174" class="f-mono f-ink">0</text>
  <rect x="538" y="180" width="80" height="5" class="f-plain"/>
</svg>
<figcaption>Every tuned model answers in form on yes/no tasks it never saw, none of them says true or false.</figcaption>
</figure>

## Making the options change

I thought that in training the Options line never changed, so the model had no reason to read it. Before the next run I wrote down that obedience below 20% on true/false would disprove it. Then I trained a third model on the same examples. For every example the option words were taken at random from a few sets. For sentiment those were pairs like good/bad and great/terrible, for the yes/no tasks pairs like correct/incorrect and right/wrong. None of the sets had true, false or maybe. The sentiment question also lost its own "positive or negative".

It still answered "yes" on true/false, 265 times of 277. Then I tested it and the model with fixed options on SST-2 with different option lines. The question had no label words. With "good, bad" it is obedient 100%, with "great, terrible" 99.7%. With "fine, awful", a pair it never saw, it is 0%. It answered "great" or "terrible" instead, with the right polarity in 229 of 300 reviews. It looks like it reads the review for polarity and then takes a word from a pair it already knows. The model with fixed options already fails on "good, bad". It answers "positive" or "negative". Still, if I compare its probability of "good" and "bad", it picks the right one in 87.3%.

"Correct, incorrect" on RTE also gives 0%. The model saw this pair as answers in training, only for other tasks. On an RTE pair it says "yes".

<figure class="fig">
<svg viewBox="0 0 640 244" role="img" aria-label="Obedience of 2 models for different option lines. positive, negative: instructions 100%, changing options 100%. good, bad: instructions 0%, changing options 100%. great, terrible: instructions 0%, changing options 99.7%. fine, awful: instructions 0%, changing options 0%. correct, incorrect: instructions 0%, changing options 0%.">
  <text x="12" y="18" class="f-label f-muted">SST-2 and RTE with other words in the Options line</text>
  <text x="12" y="44" class="f-label f-muted">Options line</text>
  <text x="260" y="44" class="f-label f-muted">instructions</text>
  <text x="420" y="44" class="f-label f-muted">changing options</text>
  <text x="12" y="74" class="f-mono f-ink">positive, negative</text>
  <rect x="260" y="63" width="120" height="14" class="f-plain"/>
  <rect x="260" y="63" width="120.0" height="14" class="f-box"/>
  <text x="260" y="90" class="f-label f-ink">100%</text>
  <rect x="420" y="63" width="120" height="14" class="f-plain"/>
  <rect x="420" y="63" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="90" class="f-label f-ink">100%</text>
  <text x="12" y="108" class="f-mono f-ink">good, bad</text>
  <text x="12" y="122" class="f-label f-muted">(the right model trained on them)</text>
  <rect x="260" y="97" width="120" height="14" class="f-plain"/>
  <text x="260" y="124" class="f-label f-ink">0%</text>
  <rect x="420" y="97" width="120" height="14" class="f-plain"/>
  <rect x="420" y="97" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="124" class="f-label f-ink">100%</text>
  <text x="12" y="142" class="f-mono f-ink">great, terrible</text>
  <text x="12" y="156" class="f-label f-muted">(the right model trained on them)</text>
  <rect x="260" y="131" width="120" height="14" class="f-plain"/>
  <text x="260" y="158" class="f-label f-ink">0%</text>
  <rect x="420" y="131" width="120" height="14" class="f-plain"/>
  <rect x="420" y="131" width="119.6" height="14" class="f-accent"/>
  <text x="420" y="158" class="f-label f-ink">99.7%</text>
  <text x="12" y="176" class="f-mono f-ink">fine, awful</text>
  <text x="12" y="190" class="f-label f-muted">(never in training)</text>
  <rect x="260" y="165" width="120" height="14" class="f-plain"/>
  <text x="260" y="192" class="f-label f-ink">0%</text>
  <rect x="420" y="165" width="120" height="14" class="f-plain"/>
  <text x="420" y="192" class="f-label f-ink">0%</text>
  <text x="12" y="210" class="f-mono f-ink">correct, incorrect</text>
  <text x="12" y="224" class="f-label f-muted">(other task)</text>
  <rect x="260" y="199" width="120" height="14" class="f-plain"/>
  <text x="260" y="226" class="f-label f-ink">0%</text>
  <rect x="420" y="199" width="120" height="14" class="f-plain"/>
  <text x="420" y="226" class="f-label f-ink">0%</text>
  <text x="460" y="192" class="f-label f-muted">answers great / terrible</text>
  <text x="460" y="226" class="f-label f-muted">answers yes</text>
</svg>
<figcaption>With changing options the model picks among word sets it knows. A pair it never saw does nothing.</figcaption>
</figure>

## What I take from it

So the model learned something about the instruction, but less than I thought. It learned which words are answers for which kind of input. With changing options in training, the Options line became a switch between sentiment word sets it already knows. On RTE that switch did not work even for a pair it had answered with on other tasks. Words that were never answers in training it never used. My guess is that this is the reason, but I did not run a model that had them. I expected above 50% on true/false for the model with fixed options and for the one with changing options. For a 248M model both were wrong.

Nothing here is new. FLAN and T0 tested templates and model size on models much bigger than what I can train. I will still write the Options line. But for a small tuned model I will first check if these words were answers in its training data.

## What I did not check

- 1 template per task. The instruction model I trained a second time with another seed. It again never said true or false, "yes" 257 times of 277. The other models I trained once.
- 248M parameters. In FLAN the tuning hurt on new tasks at 8B and below and helped at 68B and 137B. In T0 the 3B model already beats its untuned base. A bigger model may read the options line. I did not test it.
- Accuracy on new tasks is close to guessing for every model. So this is about the form of the answer. About skill I can say nothing.
- The scores I repeated on torch 1.10.2 and transformers 4.16.2. The training ran in another environment on this machine. I did not repeat it.
