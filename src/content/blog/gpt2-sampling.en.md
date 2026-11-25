---
title: "People step outside GPT-2's top 40 in 17% of tokens"
description: "The GPT-2 script says that 40 is generally a good value for top_k. I compared 8 sampling settings with 24 news texts written by people. k=40 is about as predictable as temperature 0.8 and people leave the top 40 in 17.2% of tokens."
date: 2019-04-07
lang: en
translationKey: gpt2-sampling
tags: ["llm", "machine-learning", "statistics"]
---

```
The team found that the statues were built in the early 1800s, and that they were built in the early 1900s.
```

This is how GPT-2 continues a news article about Easter Island when I take the most probable token at every step, only the first "The" is still from the article. The sentence is 27 tokens long with its line breaks. The model wrote it 4 times in a row and hit my limit of 128 tokens inside the fifth. Its probability as a whole was about 4 in 10^18 the first time and 8.6% the fourth time.

I knew greedy output looks like this, so I did what the repository suggests. `DEVELOPERS.md` (commit d14501a) has an example with `--top_k 40 --temperature 0.7` and the docstring of the sampling script says "40 generally is a good value". I copied that 40 and never asked what it is good compared to. The only thing I could compare with is text written by people.

Fan, Lewis and Dauphin used top-k with 10 for stories last year. Caccia and colleagues swept the temperature in November to get a curve of quality against diversity. I wanted only the numbers for this model and this 40.

## What I ran

The model is GPT-2 117M, the only size OpenAI has released. The checkpoint turned out to be a plain file of 497,759,232 bytes, float32 values in alphabetical order of variable names, so I read it without TensorFlow and wrote the model in numpy in about 45 lines. That is 124,439,808 parameters, I don't know why it is called 117M. Sampling repeats `sample.py`, first the temperature, then top-k.

For texts I took 24 English Wikinews articles from January and the first days of February. The model was announced on February 14, so these articles were hardly in its training set, though I can't check that. The first 40 tokens are the opening. People's version is the next 128 tokens of the article, the model writes its own 128. Every setting gets the same random numbers.

Then every token, written by a person or sampled, is scored by the raw model without temperature or truncation. Perplexity is the exponent of the average minus log probability, 25 means about as surprised as by a choice from 25 equal options. A repeated 4-gram is 4 tokens in a row that were already in the same continuation. Before the run I wrote down 5 guesses.

| setting | perplexity | first choice | beyond 40 | repeated 4-grams |
|---|---|---|---|---|
| people | 25.4 | 38.2% | 17.2% | 0.3% |
| T=1 | 36.2 | 35.4% | 22.3% | 0.3% |
| T=0.9 | 18.4 | 41.1% | 13.8% | 0.5% |
| T=0.8 | 9.7 | 50.8% | 6.9% | 1.6% |
| T=0.7 | 6.4 | 59.0% | 4.8% | 6.1% |
| k=40 | 9.6 | 44.2% | 0 | 1.2% |
| k=10 | 6.1 | 52.7% | 0 | 4.6% |
| k=40, T=0.7 | 5.1 | 62.0% | 0 | 8.9% |
| greedy | 1.8 | 100% | 0 | 63.8% |

## 40 is about the temperature 0.8

I guessed that k=40 would behave like T=0.9. By perplexity it is T=0.8. Over 24 articles I can't tell them apart, both are 2.6 times below people. Inside they are different. T=0.8 takes the first choice in half of the steps and still goes beyond 40 in 213 tokens out of 3,072. With k=40 the top of the list is closer to people and the tail is simply missing.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Stacked bars of token ranks under GPT-2 117M for human text and 7 sampling settings. people: first choice 38.2%, rank 2 to 10 32.6%, 11 to 40 12.1%, beyond 40 17.2%, perplexity 25.4; T=1: first choice 35.4%, rank 2 to 10 30.0%, 11 to 40 12.2%, beyond 40 22.3%, perplexity 36.2; T=0.9: first choice 41.1%, rank 2 to 10 33.4%, 11 to 40 11.7%, beyond 40 13.8%, perplexity 18.4; T=0.8: first choice 50.8%, rank 2 to 10 33.2%, 11 to 40 9.1%, beyond 40 6.9%, perplexity 9.7; T=0.7: first choice 59.0%, rank 2 to 10 31.2%, 11 to 40 5.0%, beyond 40 4.8%, perplexity 6.4; k=40: first choice 44.2%, rank 2 to 10 40.5%, 11 to 40 15.3%, beyond 40 0.0%, perplexity 9.6; k=10: first choice 52.7%, rank 2 to 10 47.3%, 11 to 40 0.0%, beyond 40 0.0%, perplexity 6.1; k=40, T=0.7: first choice 62.0%, rank 2 to 10 31.0%, 11 to 40 7.0%, beyond 40 0.0%, perplexity 5.1.">
  <rect x="108" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <text x="125.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">first choice</text>
  <rect x="220" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="237.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2 to 10</text>
  <rect x="318" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="335.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">11 to 40</text>
  <rect x="416" y="12" width="11" height="11" style="fill:var(--accent);stroke:none"/>
  <text x="433.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">beyond 40</text>
  <text x="670.0" y="22.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">perplexity</text>
  <text x="100.0" y="61.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">people</text>
  <rect x="108.0" y="48" width="183.9" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="291.9" y="48" width="157.1" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="448.9" y="48" width="58.2" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="507.2" y="48" width="82.8" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="61.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">25.4</text>
  <text x="100.0" y="95.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=1</text>
  <rect x="108.0" y="82" width="170.9" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="278.9" y="82" width="144.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="423.7" y="82" width="59.0" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="482.7" y="82" width="107.3" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="95.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">36.2</text>
  <text x="100.0" y="123.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0.9</text>
  <rect x="108.0" y="110" width="198.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="306.2" y="110" width="160.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="467.0" y="110" width="56.3" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="523.3" y="110" width="66.7" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="123.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">18.4</text>
  <text x="100.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0.8</text>
  <rect x="108.0" y="138" width="244.8" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="352.8" y="138" width="159.9" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="512.6" y="138" width="43.9" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="556.6" y="138" width="33.4" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">9.7</text>
  <text x="100.0" y="179.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0.7</text>
  <rect x="108.0" y="166" width="284.6" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="392.6" y="166" width="150.5" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="543.1" y="166" width="24.0" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="567.1" y="166" width="22.9" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="179.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">6.4</text>
  <text x="100.0" y="207.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=40</text>
  <rect x="108.0" y="194" width="213.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="321.2" y="194" width="195.0" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="516.3" y="194" width="73.7" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="670.0" y="207.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">9.6</text>
  <text x="100.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=10</text>
  <rect x="108.0" y="222" width="254.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="362.2" y="222" width="227.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="670.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">6.1</text>
  <text x="100.0" y="263.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=40, T=0.7</text>
  <rect x="108.0" y="250" width="298.7" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="406.7" y="250" width="149.5" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="556.3" y="250" width="33.7" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="670.0" y="263.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">5.1</text>
</svg>
<figcaption>Where the chosen token stood in the model's own list, share of 3,072 tokens per row. Perplexity on the right. The rows with k have no last segment, it was cut off.</figcaption>
</figure>

The combination from the docs, 40 with 0.7, is 5 times below people. It repeats a 4-gram in 8.9% of cases against 0.3%. Plain k=40, which I expected to repeat like people, does it 37 times, people 8. People are between T=0.9 and T=1 in the first 3 columns. For perplexity this was my guess, the only one of 5 that held. I had also written that T=1 would be the closest to people and that part was wrong, T=0.9 is closer.

## Where 40 is too much and where it is too little

I expected people to leave the top 40 in about 10% of tokens. They left it 528 times, 17.2%, from 9 to 31 times per article. The model is not surprised by this at all. If I sum the probability it gives to everything beyond 40 at the same positions, it expects 17.9%.

After "adult penguins, rather" the model gives 99.3% to "than" and the other 39 places share half a percent. After "According to ecologist Chip" a surname must come and all 40 tokens together have 18.6%. In 11.5% of positions the top 40 hold more than 99% of the probability, in 5.1% they hold less than half. Where the model is most sure, a quarter of the positions, people go beyond 40 in 3.0% of tokens. The least sure quarter has 39.8%.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Histogram of the total probability of the top 40 tokens over 3,072 positions of human text. 0 to 10%: 0; 10 to 20%: 1; 20 to 30%: 13; 30 to 40%: 44; 40 to 50%: 98; 50 to 60%: 192; 60 to 70%: 326; 70 to 80%: 489; 80 to 90%: 639; 90 to 100%: 1270.">
  <line x1="70" y1="210.0" x2="650" y2="210.0" class="f-plain"/>
  <text x="62.0" y="214.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="147.1" x2="650" y2="147.1" class="f-plain"/>
  <text x="62.0" y="151.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">500</text>
  <line x1="70" y1="84.3" x2="650" y2="84.3" class="f-plain"/>
  <text x="62.0" y="88.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,000</text>
  <rect x="74.0" y="210.0" width="50.0" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="99.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="70.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <rect x="132.0" y="209.9" width="50.0" height="0.1" style="fill:var(--accent);stroke:none"/>
  <text x="157.0" y="203.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <text x="128.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="190.0" y="208.4" width="50.0" height="1.6" style="fill:var(--accent);stroke:none"/>
  <text x="215.0" y="202.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13</text>
  <text x="186.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <rect x="248.0" y="204.5" width="50.0" height="5.5" style="fill:var(--accent);stroke:none"/>
  <text x="273.0" y="198.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">44</text>
  <text x="244.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <rect x="306.0" y="197.7" width="50.0" height="12.3" style="fill:var(--accent);stroke:none"/>
  <text x="331.0" y="191.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">98</text>
  <text x="302.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="364.0" y="185.9" width="50.0" height="24.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="389.0" y="179.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">192</text>
  <text x="360.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <rect x="422.0" y="169.0" width="50.0" height="41.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="447.0" y="163.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">326</text>
  <text x="418.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="480.0" y="148.5" width="50.0" height="61.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="505.0" y="142.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">489</text>
  <text x="476.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">70</text>
  <rect x="538.0" y="129.7" width="50.0" height="80.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="563.0" y="123.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">639</text>
  <text x="534.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <rect x="596.0" y="50.3" width="50.0" height="159.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="621.0" y="44.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1,270</text>
  <text x="592.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <text x="650.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">positions out of 3,072</text>
  <text x="360.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">probability of the top 40 tokens together, %</text>
</svg>
<figcaption>How much probability fits into 40 tokens at each position of the human text. On the right 40 is usually too many, on the left it is far too few.</figcaption>
</figure>

## What the tail costs

I was ready to say that 40 is bad and the defaults, T=1 without truncation, are good. Then I split the 128 tokens in halves. In the first 64 the perplexity of T=1 is 30.9 and of people 29.7. In the second it is 42.3 against 21.7. The second half is harder than the first in 19 of 24 texts at T=1 and in 6 of 24 articles by people.

The worst of the 24, a continuation of news from Poland, is at 297, while the hardest human article is at 51. In that continuation the sixth token, the start of the word "discotex", stood at place 6,318 in the list. Soon after comes Narendra Modi, then a tweet and "Maryobiot bonus bank". My explanation is that one strange token from the tail stays in the context and everything after it has to continue from there. I did not test it. Without this text T=1 is at 33.0 and the halves are 28.6 and 38.1. Article by article it is less clear, T=1 is above people in 14 of 24. With k=40 nothing like this shows, 10.0 in the first half and 9.2 in the second, the worst text is at 13.6.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Perplexity by blocks of 16 tokens, 4 lines, logarithmic scale. T=1: from 25.8 in the first block to 37.9 in the last; people: from 28.2 in the first block to 21.8 in the last; k=40: from 9.2 in the first block to 9.6 in the last; greedy: from 3.8 in the first block to 1.1 in the last.">
  <line x1="60" y1="230.0" x2="590" y2="230.0" class="f-plain"/>
  <text x="52.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="60" y1="197.3" x2="590" y2="197.3" class="f-plain"/>
  <text x="52.0" y="201.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="60" y1="164.7" x2="590" y2="164.7" class="f-plain"/>
  <text x="52.0" y="168.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="60" y1="132.0" x2="590" y2="132.0" class="f-plain"/>
  <text x="52.0" y="136.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8</text>
  <line x1="60" y1="99.3" x2="590" y2="99.3" class="f-plain"/>
  <text x="52.0" y="103.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">16</text>
  <line x1="60" y1="66.7" x2="590" y2="66.7" class="f-plain"/>
  <text x="52.0" y="70.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">32</text>
  <line x1="60" y1="34.0" x2="590" y2="34.0" class="f-plain"/>
  <text x="52.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="60.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="126.3" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <text x="192.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">32</text>
  <text x="258.8" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">48</text>
  <text x="325.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="391.3" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="457.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">96</text>
  <text x="523.8" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">112</text>
  <text x="590.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">128</text>
  <polyline points="93.1,76.8 159.4,64.4 225.6,65.5 291.9,66.5 358.1,52.9 424.4,58.8 490.6,43.5 556.9,58.7" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <text x="596.0" y="62.7" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T=1</text>
  <polyline points="93.1,72.6 159.4,73.4 225.6,63.9 291.9,71.0 358.1,80.4 424.4,85.9 490.6,88.3 556.9,84.8" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="596.0" y="88.8" text-anchor="start" class="f-mono f-accent" style="font-size:11px">people</text>
  <polyline points="93.1,125.6 159.4,115.0 225.6,125.2 291.9,119.7 358.1,124.6 424.4,129.4 490.6,124.2 556.9,123.2" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="596.0" y="127.2" text-anchor="start" class="f-mono f-ink" style="font-size:11px">k=40</text>
  <polyline points="93.1,167.3 159.4,176.1 225.6,190.7 291.9,208.3 358.1,215.8 424.4,219.3 490.6,222.2 556.9,223.9" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 3"/>
  <text x="596.0" y="227.9" text-anchor="start" class="f-mono f-ink" style="font-size:11px">greedy</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">perplexity, log scale</text>
  <text x="325.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">tokens after the opening</text>
</svg>
<figcaption>Perplexity in blocks of 16 tokens, 24 texts. T=1 starts next to people and drifts up, greedy falls almost to 1.</figcaption>
</figure>

So maybe 40 keeps the text from derailing and the price is that it is much more predictable than what people write. Low perplexity alone says little, the lowest in the table is greedy with 1.8.

## My loop detector

My first guess was that more than half of the greedy texts end in a loop. The detector said 9 of 24. But Easter Island was not among the 9. I had limited the period to 24 tokens before the run and that sentence is 27. With periods up to 48 it finds 18 of 24 and still none in the sampled settings. By the criterion I wrote down the guess failed, so I report both numbers.

## What I didn't check

One model, one size, 24 short news texts, one continuation each. The interval for people is from 22.4 to 28.7 and for T=1 from 30.0 to 47.0, so the second digit of these numbers means little. Every opening begins with a date line, other genres may give another share beyond 40. Like `sample.py`, I did not stop at `<|endoftext|>`, it came up 7 times in all settings together. Nobody rated the texts. I find k=40 easier to read than T=1, but I also knew which was which.
