---
title: "The code was inside the window and GPT-2 still answered with another one"
description: "I put 8 records like 'The code for the blue room is 17004.' into 1000 tokens of WikiText and asked GPT-2 and GPT-Neo for one of them. A single record is found at any distance. With 8, one similar record between the fact and the question takes away more than half of the right answers."
date: 2021-11-27
lang: en
translationKey: long-context-decay
tags: ["llm", "machine-learning"]
---
The first thing everybody wants from GPT-3 is to paste a long document and ask a question about it. GPT-2 reads 1024 tokens, GPT-3 and the models from EleutherAI read 2048. What happens past that limit I knew. A longer input to GPT-2 in PyTorch stops with `IndexError: index out of range in self`. There is simply no position embedding for token 1025. With `truncation=True` the tokenizer cuts the end instead and the question at the end goes with it.

Inside the window I had a simple picture. The window is a buffer, what fits is read and what does not fit is lost. I never checked the first half of that sentence. A model does not report which part of the input it used. If it reads the last 200 tokens well and the rest badly, the answer looks just as confident.

## The setup

I took the models that run on a CPU with 4 cores: GPT-2 small (124M) and GPT-2 medium (355M) from OpenAI with 1024 tokens. The third is `GPT-Neo 125M` from EleutherAI, released in March, with 2048 tokens. Below I call it Neo. Weights in fp32, nothing is generated. I read the probabilities of the next token, so a repeated run gives the same numbers.

The text is real English, consecutive sentences from the WikiText-103 test set, with very short and very long ones skipped. Between the sentences I put records like this:

```
The code for the blue room is 17004.
```

There are 8 records with 8 different colours and random codes of 5 digits, in random places. The input is 1000 tokens. At the very end comes the question, `The code for the blue room is`. For each of the 8 codes I take the probability of its first token as the next token. The code with the highest one is the model's choice. A guess is right 1 time in 8, 12.5%. The distance is the number of tokens between the end of the asked record and the question.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="A strip of 1000 tokens with 8 records placed in it, each with its colour. The question at the right end asks for the blue room. The blue record ends 439 tokens before the question and 3 other records stand between them. The most likely next token of GPT-2 medium is the start of the code of the yellow room, 13135, which stands 347 tokens before the question.">
  <rect x="20" y="64" width="570" height="18" class="f-plain"/>
  <rect x="594" y="64" width="82" height="18" rx="2" class="f-box"/>
  <text x="598.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">question</text>
  <polyline points="47.4,34 47.4,56 47.4,82" class="f-line"/>
  <text x="47.4" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">grey</text>
  <polyline points="213.6,34 218.4,56 218.4,82" class="f-line"/>
  <text x="213.6" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">green</text>
  <polyline points="261.9,34 290.2,56 290.2,82" class="f-line"/>
  <text x="261.9" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">orange</text>
  <polyline points="310.2,34 309.6,56 309.6,82" class="f-line"/>
  <text x="310.2" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">brown</text>
  <polyline points="351.9,34 335.8,56 335.8,82" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="351.9" y="30.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">blue</text>
  <polyline points="396.9,34 388.2,56 388.2,82" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.9" y="30.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">yellow</text>
  <polyline points="448.5,34 440.7,56 440.7,82" class="f-line"/>
  <text x="448.5" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">silver</text>
  <polyline points="578.1,34 586.0,56 586.0,82" class="f-line"/>
  <text x="578.1" y="30.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">red</text>
  <line x1="335.8" x2="590" y1="98" y2="98" class="f-line"/>
  <line x1="335.8" x2="335.8" y1="93" y2="103" class="f-line"/>
  <line x1="590" x2="590" y1="93" y2="103" class="f-line"/>
  <text x="462.9" y="116.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">439 tokens, 3 records between</text>
  <text x="20.0" y="102.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1000 tokens of WikiText-103 text</text>
  <text x="20.0" y="144.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">asked: blue → 34359</text>
  <text x="20.0" y="162.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium, next token: 13 → yellow (13135)</text>
</svg>
<figcaption>One real trial of GPT-2 medium. The question asks for the blue room (34359). The model's most likely next token is the start of the code of the yellow room (13135).</figcaption>
</figure>

## One record is not a problem

First the control, with only one record in the same 1000 tokens. Here I check if the most likely next token is the start of the right code. All 3 models found the single record at any distance, in 88 to 100% of trials. Neo missed once in 330 trials. GPT-2 small copied the rest of the code worse, but that also did not depend on the distance.

So with a single record the distance did not matter. I expected the opposite and half of the article I had in my head was gone.

## 8 records

With 8 records the picture is different. When the record stood right before the question, GPT-2 small chose the right code in 38% of trials. At about 860 tokens it fell to 12%, which is a guess. Near the start of the window it came back to 32%. GPT-2 medium started better with 62% and was at 14% already at about 220 tokens. Neo had 37% next to the question and between 17 and 32% everywhere else.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Share of right answers by distance to the question. Solid lines: 8 records, the right code chosen among the 8. Dashed lines: 1 record, the most likely next token is the start of the right code. GPT-2 small, 1: 0 88%, 100 98%, 200 100%, 298 100%, 400 100%, 500 100%, 599 100%, 701 98%, 799 100%, 899 100%, 922 100%; GPT-2 small, 8: 0 38%, 109 31%, 217 29%, 323 35%, 430 27%, 534 20%, 645 19%, 753 15%, 861 12%, 972 32%, 981 34%; GPT-2 medium, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 90%, 698 97%, 797 97%, 902 100%, 920 100%; GPT-2 medium, 8: 0 62%, 106 38%, 218 14%, 320 12%, 430 20%, 539 14%, 646 24%, 755 12%, 858 26%, 972 34%, 981 52%; GPT-Neo 125M, 1: 0 100%, 99 100%, 201 100%, 295 100%, 400 100%, 502 100%, 596 100%, 698 100%, 797 100%, 902 100%, 920 97%; GPT-Neo 125M, 8: 0 37%, 110 23%, 214 17%, 323 17%, 431 27%, 537 27%, 646 25%, 753 20%, 858 32%, 973 23%, 982 20%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="178.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="296.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="414.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">600</text>
  <text x="532.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">distance from the record to the question, tokens</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">share of trials</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">guess, 1 of 8</text>
  <polyline points="60.0,65.0 118.8,45.0 177.9,40.0 235.9,40.0 295.9,40.0 354.7,40.0 413.5,40.0 473.3,45.0 531.5,40.0 590.4,40.0 603.7,40.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,164.0 124.3,178.0 187.8,182.0 250.5,170.0 313.8,186.0 374.8,200.0 440.3,202.0 504.4,210.0 567.8,216.0 633.3,176.0 638.8,172.0" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="164.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="124.3" cy="178.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="187.8" cy="182.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="250.5" cy="170.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="313.8" cy="186.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="374.8" cy="200.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="440.3" cy="202.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="504.4" cy="210.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="567.8" cy="216.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="633.3" cy="176.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="638.8" cy="172.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,60.0 471.6,46.6 530.1,46.6 591.9,40.0 602.7,40.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,116.0 122.8,164.0 188.4,212.0 249.0,216.0 313.8,200.0 377.8,212.0 440.9,192.0 505.4,216.0 566.5,188.0 633.2,172.0 638.7,136.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="113.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="119.8" y="161.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="185.4" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="246.0" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="310.8" y="197.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="374.8" y="209.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="437.9" y="189.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="502.4" y="213.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="563.5" y="185.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="630.2" y="169.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="635.7" y="133.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,40.0 118.4,40.0 178.6,40.0 233.9,40.0 296.0,40.0 355.9,40.0 411.6,40.0 471.6,40.0 530.1,40.0 591.9,40.0 602.7,46.6" class="f-line" style="stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4"/>
  <polyline points="60.0,166.6 125.1,193.4 186.4,206.6 250.7,206.6 314.5,186.6 377.0,186.6 441.1,190.0 504.3,200.0 566.0,176.6 634.2,193.4 639.1,200.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 162.6 L64.0 166.6 L60.0 170.6 L56.0 166.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M125.1 189.4 L129.1 193.4 L125.1 197.4 L121.1 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M186.4 202.6 L190.4 206.6 L186.4 210.6 L182.4 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M250.7 202.6 L254.7 206.6 L250.7 210.6 L246.7 206.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M314.5 182.6 L318.5 186.6 L314.5 190.6 L310.5 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M377.0 182.6 L381.0 186.6 L377.0 190.6 L373.0 186.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M441.1 186.0 L445.1 190.0 L441.1 194.0 L437.1 190.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M504.3 196.0 L508.3 200.0 L504.3 204.0 L500.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M566.0 172.6 L570.0 176.6 L566.0 180.6 L562.0 176.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M634.2 189.4 L638.2 193.4 L634.2 197.4 L630.2 193.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M639.1 196.0 L643.1 200.0 L639.1 204.0 L635.1 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Input of 1000 tokens. Solid: 8 records, the asked one at the given distance and 7 others in random places, share of trials where the right code has the highest probability among the 8 (50 to 100 trials per point). Dashed: only one record, share of trials where the most likely next token is the start of its code (30 to 40 trials). These are 2 different measures.</figcaption>
</figure>

I read this as "the further, the worse" and almost stopped there. The second series did not fit. In it the asked record was always 50 to 65 tokens before the question and only the input length changed. GPT-2 small got 13% with 250 tokens and 45% with 1000 tokens, GPT-2 medium 22% and 48%. A longer input made the answer better, which made no sense to me.

My first explanation was the other records. In 250 tokens the 7 others are packed close and often land between the asked record and the question. I grouped the trials of the first series by the number of other records standing between. For GPT-2 small it is 45% with none between and 25% with one. With 2 or 3 between it is still 24 to 27%, with 4 to 6 it is 15 to 17%. Part of this is distance, because with more records between the asked one usually stands further away. So I also compared only trials where the asked record was 50 to 250 tokens away. There GPT-2 small chose right in 57% with none between and in 20% with one.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Share of trials where the right code is chosen among the 8, by the number of other records between the asked record and the question. GPT-2 small: 0: 45%, 1: 25%, 2: 24%, 3: 27%, 4: 16%, 5: 17%, 6: 15%, 7: 32%; GPT-2 medium: 0: 51%, 1: 21%, 2: 13%, 3: 20%, 4: 16%, 5: 19%, 6: 20%, 7: 43%; GPT-Neo 125M: 0: 34%, 1: 20%, 2: 15%, 3: 19%, 4: 21%, 5: 35%, 6: 29%, 7: 21%.">
  <line x1="60" x2="650" y1="240.0" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" x2="650" y1="190.0" y2="190.0" class="f-plain"/>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25%</text>
  <line x1="60" x2="650" y1="140.0" y2="140.0" class="f-plain"/>
  <text x="54.0" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50%</text>
  <line x1="60" x2="650" y1="90.0" y2="90.0" class="f-plain"/>
  <text x="54.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75%</text>
  <line x1="60" x2="650" y1="40.0" y2="40.0" class="f-plain"/>
  <text x="54.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100%</text>
  <text x="60.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="144.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="228.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="312.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="397.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="481.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="565.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="650.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="355.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">other records between the asked one and the question</text>
  <text x="60.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">share of trials</text>
  <line x1="60" x2="650" y1="215.0" y2="215.0" class="f-line" style="stroke-dasharray:2 3"/>
  <text x="66.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">guess, 1 of 8</text>
  <polyline points="60.0,149.8 144.3,189.6 228.6,192.8 312.9,185.2 397.1,208.0 481.4,206.2 565.7,209.2 650.0,176.4" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="149.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="144.3" cy="189.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="228.6" cy="192.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="312.9" cy="185.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="397.1" cy="208.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="481.4" cy="206.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="565.7" cy="209.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="650.0" cy="176.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <polyline points="60.0,139.0 144.3,198.4 228.6,214.2 312.9,200.8 397.1,208.0 481.4,202.8 565.7,200.6 650.0,154.0" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="57.0" y="136.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="141.3" y="195.4" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="225.6" y="211.2" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="309.9" y="197.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="394.1" y="205.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="478.4" y="199.8" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="562.7" y="197.6" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <rect x="647.0" y="151.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <polyline points="60.0,171.4 144.3,200.0 228.6,210.6 312.9,202.8 397.1,199.0 481.4,170.4 565.7,182.4 650.0,199.0" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M60.0 167.4 L64.0 171.4 L60.0 175.4 L56.0 171.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M144.3 196.0 L148.3 200.0 L144.3 204.0 L140.3 200.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M228.6 206.6 L232.6 210.6 L228.6 214.6 L224.6 210.6 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M312.9 198.8 L316.9 202.8 L312.9 206.8 L308.9 202.8 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M397.1 195.0 L401.1 199.0 L397.1 203.0 L393.1 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M481.4 166.4 L485.4 170.4 L481.4 174.4 L477.4 170.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M565.7 178.4 L569.7 182.4 L565.7 186.4 L561.7 182.4 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M650.0 195.0 L654.0 199.0 L650.0 203.0 L646.0 199.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="210" x2="228" y1="12" y2="12" class="f-line" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="219.0" cy="12.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <line x1="324.6" x2="342.6" y1="12" y2="12" class="f-line" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="330.6" y="9.0" width="6" height="6" style="fill:var(--ink);stroke:none"/>
  <text x="348.6" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <line x1="445.8" x2="463.8" y1="12" y2="12" class="f-line" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M454.8 8.0 L458.8 12.0 L454.8 16.0 L450.8 12.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="469.8" y="16.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>The same trials as the solid lines above, grouped differently: share of trials where the right code is chosen among the 8. 7 between means the asked record is the first of the 8. 50 to 198 trials per point.</figcaption>
</figure>

At the same distances GPT-2 medium went from 43% to 17% and Neo from 32% to 11%. Further on the points of Neo jump up and down.

The records between did not explain the second series to the end, though. I took only the trials of it where nothing stood between. GPT-2 small still chose right in 8 of 44 trials with 250 and 500 tokens and in 42 of 77 with 750 and 1000. In a short input the 8 records are about a third of the text, so maybe the model sees a list there. I did not test that and I do not know.

When GPT-2 small was wrong with at least one record between, it picked the record nearest to the question in 27% of those trials. That is about twice as often as a random wrong choice, 1 in 7, but most wrong answers still went to other records.

One more thing I did not expect. Sometimes the asked record was the first of the 8 and all 7 others stood after it. Then GPT-2 medium chose right in 43% of trials and GPT-2 small in 32%. For both of them the start of the window worked better than its middle, which I would not guess from any of the numbers above.

## What the usual metric says

The usual check of context is the accuracy of the next token by position. I counted it on the same WikiText-103 test. With 1 token of context GPT-2 small predicts the next one right in 6% of cases, at positions 769 to 1023 in 41%. Neo goes from 10% to 42% and flattens in the second half of its 2048 tokens. By this metric the end of a long window is the best place for a token. For the average token it is true. On my test with 8 records the same window gave anything from 12 to 62%, depending on where the record stood and what stood between.

## What I take from it

When a prompt holds several similar facts, the answer about one of them is much better if nothing similar stands between it and the question. So I would put the needed fact last. At the same distance one similar record in between took away more than half of the right answers. Sun et al. from September found that context beyond 2K tokens helped models built for long text mostly on tokens that can be copied from far back. My lookup is such a copy. With one record it worked over the whole window. The older result of Khandelwal et al. is close in spirit, an LSTM there uses word order only in the nearest 50 tokens or so.

## What I did not check

These are 3 small models. Neo did not show the better start of the window, 21%. GPT-3 through the API and GPT-J 6B I did not run, they would likely do better and I do not know by how much. All records follow one template with 8 colours. A point on the charts is 30 to 200 trials. The interval is about 6 percentage points either way at 200 trials and about 16 at 30. Single points jump inside it. Neo also has a detail I did not separate: half of its layers see only the last 256 tokens. I also ran Neo on 2000 tokens, close to its full window, with only 30 trials per point. Directly before the question it chose the right code in 67% of trials, at about 200 tokens in 37% and further on between 7 and 40% without a clear direction.
