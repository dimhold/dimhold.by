---
title: "I trained a reward model on 16,000 Reddit votes and it liked length more than the voters did"
description: "OpenAI's 2020 Reddit summary clicks, a length rule, a linear Bradley and Terry model and a small MiniLM reward model trained on 16,000 pairs. The reward model prefers the longer summary 69% of the time where humans do 57.5%, and best of 16 makes GPT-2 summaries 65% longer, with more of the post copied into them."
date: 2022-03-13
lang: en
translationKey: rlhf-no-magic
tags: ["llm", "machine-learning"]
---
Last week the InstructGPT paper went up on arXiv. OpenAI had put it on their site in January. The main claim is that people preferred answers of a 1.3B model tuned with human feedback over answers of the 175B GPT-3. I read it and realized that I use the words "trained with human feedback" and cannot say what the feedback physically is. Somebody clicks something and the answers get better. That is the level of magic I had.

Before InstructGPT the same group did this on Reddit summaries. In 2020 they put the raw clicks online, so I downloaded them and tried to repeat the mechanism on 4 CPU cores.

## What a click is

The data is OpenAI's `summarize_from_feedback`. Each row is a Reddit post, 2 short summaries of it and the one a person picked. Some rows also have a confidence score and notes, but no reason for the choice. The training part has 92,858 such comparisons and the validation part 83,802 on different posts.

Some pairs were labeled by several people. On a post about a girl he met on vacation 1.5 years ago and still has feelings for, 11 people compared the same 2 summaries and split 6 to 5. Over all repeated pairs in validation 2 labelers agree on 72.5% of comparisons, on the training part 74.7%. So "what humans want" is a vote. About every fourth time the second human votes the other way.

<figure class="fig">
<svg viewBox="0 0 640 252" role="img" aria-label="A Reddit post titled &quot;Me [21 M] with my...idk [19 F] Just not sure what to do.&quot;. Summary A: Had a great time with a great girl. Left for vacations 1 1/2 years ago and keep in contact. Still have feelings for her. Relationship just started. Don't know if I should tell her how I feel or move on.. 6 votes. Summary B: Had an amazing time with this girl before we had to leave for summer vacation 1 1/2 years ago. Still have feelings for her and want to pursue relationship w/ her. Don't know whether to tell her or not.. 5 votes.">
  <text x="12" y="18" class="f-label f-muted">1 post, 2 summaries, 11 people</text>
  <text x="12" y="42" class="f-label f-muted">Post:</text>
  <text x="60" y="42" class="f-mono f-ink">Me [21 M] with my...idk [19 F] Just not sure what to do.</text>
  <text x="12" y="74" class="f-label f-ink">Summary A</text>
  <rect x="110" y="65" width="160" height="10" class="f-accent"/>
  <text x="278" y="74" class="f-label f-ink">6 votes</text>
  <text x="24" y="96" class="f-mono f-ink">Had a great time with a great girl. Left for vacations 1 1/2 years ago</text>
  <text x="24" y="114" class="f-mono f-ink">and keep in contact. Still have feelings for her. Relationship just</text>
  <text x="24" y="132" class="f-mono f-ink">started. Don't know if I should tell her how I feel or move on.</text>
  <text x="12" y="168" class="f-label f-ink">Summary B</text>
  <rect x="110" y="159" width="133.33333333333334" height="10" class="f-box"/>
  <text x="251.33333333333334" y="168" class="f-label f-ink">5 votes</text>
  <text x="24" y="190" class="f-mono f-ink">Had an amazing time with this girl before we had to leave for summer</text>
  <text x="24" y="208" class="f-mono f-ink">vacation 1 1/2 years ago. Still have feelings for her and want to pursue</text>
  <text x="24" y="226" class="f-mono f-ink">relationship w/ her. Don't know whether to tell her or not.</text>
</svg>
<figcaption>The feedback here is a click between 2 texts. Over all repeated pairs in validation 2 people agree on 72.5% of them.</figcaption>
</figure>

## The cheapest reward model

Before training anything I wrote down the expectations. The first one was that a dumb rule already gets more than 55%. The rule is "the longer summary wins". On validation it is right 58.0% of the time, ties left out. On average the picked summary has 28.4 words and the rejected one 26.6. Stiennon and colleagues, who collected this data, already controlled for length in their paper.

Then a linear model, logistic regression from `scikit-learn` 1.0.2. Every summary becomes a bag of words and word pairs plus the logarithm of its length. It learns from the difference between the 2 summaries which one was picked. This is the model of Bradley and Terry from 1952, the same formula as the logistic version of chess Elo ratings. My first run was worse than length alone, 56.9%, because I did not tune the regularization. After tuning it on a held out part of the training data it gave 58.3% on validation. Length alone in the same model gives 57.7%. So 103,587 word features added half a point. The weights are readable but not exciting. "ex", "relationship", "boyfriend", "wedding" are positive. Many of the top words are about relationships and sex. "edit" is the strongest negative. An early OpenAI model sometimes invented a Reddit style "EDIT:" line at the end of its summary. People voted those down.

## A real reward model, a small one

The papers use a big transformer with one number on top, so I wanted GPT-2 small. On this machine 1 training pair took about 7 seconds, so 16,000 pairs would take more than a day. I took MiniLM with 6 layers and 22M parameters, a sentence encoder from 2021. It reads the post and the summary together and has 1 linear output on top. The loss is the same as in the papers. It is minus log sigmoid of the reward of the picked summary minus the reward of the rejected one. I trained it on 16,000 pairs in 1 pass. The scores of the final model I checked again on torch 1.11 and transformers 4.17.

I tested it on 3,000 validation pairs. There it is right 60.3% of the time. On the same pairs length gets 57.5% and the linear model 58.1%. After 2,000 training pairs it was 57.8%, after 8,000 59.0%. It was still growing, but the learning rate also went down to zero at the end, so these middle points are not clean. On the 772 pairs where the 2 summaries differ in length by 10% or less, length cannot help. There it gets 58.4%, so it learned something besides length.

Among these pairs where the lengths differ, humans picked the longer summary in 57.5%. The reward model prefers the longer one in 69.0%. After the first 2,000 pairs it was 74.8%, 3 times in 4. Whatever goes with length, more detail or more copying, it rewards more often than the humans who clicked.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Bar chart. coin 50%. longer wins 57.5%. linear model, words and length 58.1%. reward model, 16,000 pairs 60.3%. another human 72.5%. How often the judge prefers the longer summary, pairs of different length: humans 57.5%. How often the judge prefers the longer summary, pairs of different length: reward model after 2,000 pairs 74.8%. How often the judge prefers the longer summary, pairs of different length: reward model after 16,000 pairs 69%.">
  <text x="12" y="18" class="f-label f-muted">How often a judge picks the same summary as the human, 3,000 validation pairs</text>
  <text x="12" y="49" class="f-label f-ink">coin</text>
  <rect x="270" y="40" width="145.0" height="12" class="f-box"/>
  <text x="421" y="49" class="f-label f-ink">50%</text>
  <text x="12" y="73" class="f-label f-ink">longer wins</text>
  <rect x="270" y="64" width="166.8" height="12" class="f-box"/>
  <text x="442.75" y="73" class="f-label f-ink">57.5%</text>
  <text x="12" y="97" class="f-label f-ink">linear model, words and length</text>
  <rect x="270" y="88" width="168.5" height="12" class="f-box"/>
  <text x="444.49" y="97" class="f-label f-ink">58.1%</text>
  <text x="12" y="121" class="f-label f-ink">reward model, 16,000 pairs</text>
  <rect x="270" y="112" width="174.9" height="12" class="f-accent"/>
  <text x="450.87" y="121" class="f-label f-ink">60.3%</text>
  <text x="12" y="145" class="f-label f-ink">another human</text>
  <rect x="270" y="136" width="210.3" height="12" class="f-box"/>
  <text x="486.25" y="145" class="f-label f-ink">72.5%</text>
  <line x1="12" y1="170" x2="628" y2="170" class="f-line"/>
  <text x="12" y="186" class="f-label f-muted">How often the judge prefers the longer summary, pairs of different length</text>
  <text x="12" y="209" class="f-label f-ink">humans</text>
  <rect x="270" y="200" width="166.8" height="12" class="f-box"/>
  <text x="442.75" y="209" class="f-label f-ink">57.5%</text>
  <text x="12" y="233" class="f-label f-ink">reward model after 2,000 pairs</text>
  <rect x="270" y="224" width="216.9" height="12" class="f-accent"/>
  <text x="492.91999999999996" y="233" class="f-label f-ink">74.8%</text>
  <text x="12" y="257" class="f-label f-ink">reward model after 16,000 pairs</text>
  <rect x="270" y="248" width="200.1" height="12" class="f-accent"/>
  <text x="476.1" y="257" class="f-label f-ink">69%</text>
</svg>
<figcaption>The reward model beats length by a little and prefers the longer summary more often than the people who clicked.</figcaption>
</figure>

## Pulling the answer toward the reward

InstructGPT pulls the answer toward the reward with reinforcement learning, PPO, which I cannot run here. The simpler way is best of n: generate n answers and keep the one with the highest reward. WebGPT used it in December.

My policy is plain GPT-2 small without any tuning. The prompt is the post and then "TL;DR:". I took 16 samples per post at temperature 0.7, at most 48 tokens, cut at the first line break, for 100 validation posts. 134 of the 1,600 summaries are empty. For each post I counted over all subsets of n samples which one my reward model would keep.

| n | words | trigrams copied from the post | empty |
|---|---|---|---|
| 1 | 21.5 | 6.2% | 8.4% |
| 4 | 30.0 | 10.4% | 0.4% |
| 16 | 35.4 | 16.1% | 0 |

The chosen summary grows by 65%. In 54 of 100 posts the best of 16 runs into the 48 token limit. 48 of them stop in the middle of a sentence. A random sample hits the limit in 22.

I expected more copying, Ziegler and colleagues saw whole sentences copied in 2019. With an untuned GPT-2 I got them too. 17 of the 1,600 samples have at least 5 words and at least 90% of their trigrams come from the post, most of them a straight piece of it. The reward model puts them on average at place 2.8 of 16. 7 of them won their post. One post starts "I met this girl online, we planned a date but by talking with her I saw some traits I'm not really sure I like". The winner for it is exactly this sentence. It is on topic and it says nothing the reader did not just read.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Two bar series for n equal to 1, 2, 4, 8 and 16. n 1: 21.5 words, 6.2% copied. n 2: 26 words, 8% copied. n 4: 30 words, 10.4% copied. n 8: 33.1 words, 13.4% copied. n 16: 35.4 words, 16.1% copied.">
  <text x="12" y="18" class="f-label f-muted">Best of n by the reward model, GPT-2 small, 100 posts</text>
  <text x="12" y="44" class="f-label f-muted">words in the chosen summary</text>
  <rect x="12" y="115.5" width="34" height="64.5" class="f-box"/>
  <text x="14" y="109.5" class="f-label f-ink">21.5</text>
  <text x="18" y="198" class="f-label f-muted">n 1</text>
  <rect x="64" y="102.0" width="34" height="78.0" class="f-box"/>
  <text x="66" y="96" class="f-label f-ink">26</text>
  <text x="70" y="198" class="f-label f-muted">n 2</text>
  <rect x="116" y="90.0" width="34" height="90.0" class="f-box"/>
  <text x="118" y="84" class="f-label f-ink">30</text>
  <text x="122" y="198" class="f-label f-muted">n 4</text>
  <rect x="168" y="80.7" width="34" height="99.3" class="f-box"/>
  <text x="170" y="74.7" class="f-label f-ink">33.1</text>
  <text x="174" y="198" class="f-label f-muted">n 8</text>
  <rect x="220" y="73.8" width="34" height="106.2" class="f-box"/>
  <text x="222" y="67.8" class="f-label f-ink">35.4</text>
  <text x="226" y="198" class="f-label f-muted">n 16</text>
  <text x="330" y="44" class="f-label f-muted">trigrams copied from the post, %</text>
  <rect x="330" y="142.8" width="34" height="37.2" class="f-accent"/>
  <text x="332" y="136.8" class="f-label f-ink">6.2</text>
  <text x="336" y="198" class="f-label f-muted">n 1</text>
  <rect x="382" y="132.0" width="34" height="48.0" class="f-accent"/>
  <text x="384" y="126" class="f-label f-ink">8</text>
  <text x="388" y="198" class="f-label f-muted">n 2</text>
  <rect x="434" y="117.6" width="34" height="62.4" class="f-accent"/>
  <text x="436" y="111.6" class="f-label f-ink">10.4</text>
  <text x="440" y="198" class="f-label f-muted">n 4</text>
  <rect x="486" y="99.6" width="34" height="80.4" class="f-accent"/>
  <text x="488" y="93.6" class="f-label f-ink">13.4</text>
  <text x="492" y="198" class="f-label f-muted">n 8</text>
  <rect x="538" y="83.4" width="34" height="96.6" class="f-accent"/>
  <text x="540" y="77.39999999999999" class="f-label f-ink">16.1</text>
  <text x="544" y="198" class="f-label f-muted">n 16</text>
</svg>
<figcaption>The more samples the reward model chooses from, the longer the summary and the more of it is copied from the post.</figcaption>
</figure>

## What I take from it

The expectations about length and copying held. The reward model came at 60.3%. I expected 60 to 68 for GPT-2 small. The model I had to use is more than 5 times smaller. The linear model I expected near 60% and it gave 58.3%.

None of this is new. Stiennon and colleagues in 2020 showed that optimizing the policy too hard against the reward model makes the summaries worse for humans. Next I want to see what PPO does with a reward like this, if I find a GPU.

## What I did not check

- No PPO. Best of n only shows the direction the reward pulls.
- 1 training run, 1 seed, 16,000 of 92,858 pairs.
- The policy is untuned GPT-2 small, so the reward model chooses between texts of a model nobody tuned for summaries.
- Nobody judged whether the chosen summaries are better for a human. Longer and more copied is what I measured.
