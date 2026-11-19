---
title: "\"Please\" made GPT-2 small worse and GPT-2 medium better"
description: "GPT-3 bills per token, so I counted what politeness costs and measured what it does. On 872 SST-2 reviews a single \"Please\" made GPT-2 small worse and GPT-2 medium better, like any other small change of the instruction. The full \"Could you please... Thank you.\" made none of the 4 models worse and made answers longer."
date: 2021-11-21
lang: en
translationKey: polite-prompt
tags: ["llm", "machine-learning"]
---
On Thursday OpenAI removed the waitlist from its API. Now anyone in a supported country can pay for GPT-3 and the payment is per token. Davinci costs $0.06 per 1000 tokens, the prompt and the answer counted together. So every word in a prompt has a price, also the words added only to be polite.

I have heard 2 opposite opinions about this. One says a polite request gets a better answer, because the model learned from texts where polite questions got careful replies. The other says "please" is a wasted token and the model does not care. I had no number for either of them, so I measured the price and the answer.

## What it costs

GPT-3 uses the same tokenizer as GPT-2, so the tokens can be counted locally. My instruction for the test below is `Tell me whether this movie review is positive or negative.` with 11 tokens. "Please" in front of it is 1 more token. The full polite version with "Could you please" and "Thank you" at the end is 17 tokens.

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="Three versions of the instruction cut into GPT-2 tokens, the same tokens GPT-3 bills. Tell me whether this movie review is positive or negative.: 11 tokens, baseline; Please tell me whether this movie review is positive or negative.: 12 tokens, +$60 per million calls; Could you please tell me whether this movie review is positive or negative? Thank you.: 17 tokens, +$360 per million calls. Tokens added by politeness are highlighted.">
  <rect x="20.0" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="37.2" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Tell</text>
  <rect x="58.4" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="69.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="83.6" y="22" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="110.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="141.8" y="22" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="159.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="180.2" y="22" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="200.7" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="225.2" y="22" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="249.0" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="276.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="302.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="332.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="366.8" y="22" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="392.0" y="22" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="422.4" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="456.8" y="22" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="464.1" y="36.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="60.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">11 tokens, baseline</text>
  <rect x="20.0" y="80" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="43.8" y="94.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Please</text>
  <rect x="71.6" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="88.8" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="110.0" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="120.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="135.2" y="80" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="162.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="193.4" y="80" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="210.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="231.8" y="80" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="252.3" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="276.8" y="80" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="300.6" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="328.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="339.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="353.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="384.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="418.4" y="80" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="429.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="443.6" y="80" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="474.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="508.4" y="80" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="515.7" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">.</text>
  <text x="20.0" y="118.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">12 tokens, +$60 per million calls</text>
  <rect x="20.0" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="40.5" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Could</text>
  <rect x="65.0" y="138" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="78.9" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="96.8" y="138" width="47.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="120.6" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">please</text>
  <rect x="148.4" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="165.6" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">tell</text>
  <rect x="186.8" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="197.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">me</text>
  <rect x="212.0" y="138" width="54.2" height="20" rx="2" class="f-plain"/>
  <text x="239.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">whether</text>
  <rect x="270.2" y="138" width="34.4" height="20" rx="2" class="f-plain"/>
  <text x="287.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">this</text>
  <rect x="308.6" y="138" width="41.0" height="20" rx="2" class="f-plain"/>
  <text x="329.1" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">movie</text>
  <rect x="353.6" y="138" width="47.6" height="20" rx="2" class="f-plain"/>
  <text x="377.4" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">review</text>
  <rect x="405.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="415.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">is</text>
  <rect x="430.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="460.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">positive</text>
  <rect x="495.2" y="138" width="21.2" height="20" rx="2" class="f-plain"/>
  <text x="505.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">or</text>
  <rect x="520.4" y="138" width="60.8" height="20" rx="2" class="f-plain"/>
  <text x="550.8" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">negative</text>
  <rect x="585.2" y="138" width="14.6" height="20" rx="2" class="f-plain"/>
  <text x="592.5" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">?</text>
  <rect x="603.8" y="138" width="41.0" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="624.3" y="152.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">Thank</text>
  <rect x="20.0" y="164" width="27.8" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="33.9" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">you</text>
  <rect x="51.8" y="164" width="14.6" height="20" rx="2" class="f-box" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="59.1" y="178.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">.</text>
  <text x="20.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17 tokens, +$360 per million calls</text>
</svg>
<figcaption>The instruction alone, cut by the GPT-2 tokenizer, which GPT-3 also uses. Highlighted tokens are the ones politeness adds. Prices for davinci at $0.06 per 1000 tokens.</figcaption>
</figure>

1 token per call on davinci is $60 per million calls, the full polite version is $360. It sounds small. But my whole prompt with a review was about 41 tokens on average, so the 6 polite tokens made the input bill about 15% bigger. With 4 examples in the prompt it was around 135 tokens and the same 6 tokens added 4%.

## The setup

The task is the sentiment of a movie review, 872 sentences from the validation set of SST-2. The prompt looks like this:

```
Tell me whether this movie review is positive or negative.

Review: it 's a charming and often affecting journey .
Answer:
```

Nothing is generated here. I compare the probability of the next token " positive" with " negative" and take the bigger one. A repeated run gives the same numbers. The models are the ones my CPU with 4 cores can run: GPT-2 small, medium and large from OpenAI and `GPT-Neo 125M` from EleutherAI, below just Neo.

The plain comparison has a problem. GPT-2 small says "positive" to 80% of the reviews whatever they say, while about half of them are positive. GPT-2 large leans the other way and says it to 16%. So for each version of the instruction I set the threshold with a simplified form of the contextual calibration from Zhao et al. (February). The same prompt with an empty review like "N/A" shows where the model leans and this lean is subtracted.

Besides the 2 polite versions I took 4 that are not polite. `Now tell me...` has the same length as `Please tell me...` and `Say whether...` changes 1 word. A neutral tail, `Now look at it and tell me... That is all.`, is about as long as the full polite version. The last one is rude: `Just tell me... Don't waste my time.`

## The first number

The first model that finished was GPT-2 small. With "Please" its accuracy fell from 68.8% to 65.7%, 41 reviews became wrong and 14 became right, which is far from noise for a paired test. I was ready to write that politeness costs accuracy.

Then GPT-2 medium gave the opposite. With "Please" it went from 69.2% to 72.4%, 36 reviews became right and 8 became wrong. GPT-2 large went up by 2.5 points like medium, Neo moved by 0.3, which is nothing.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="Change of accuracy without examples on 872 SST-2 reviews against the plain instruction, by version of the instruction and by model. Please tell me… GPT-2 small −3.1, GPT-2 medium +3.2, GPT-2 large +2.5, GPT-Neo 125M +0.3; Could you please… Thank you. GPT-2 small +1.3, GPT-2 medium +3.8, GPT-2 large +3.4, GPT-Neo 125M +2.1; Now tell me… GPT-2 small −0.5, GPT-2 medium −1.1, GPT-2 large +0.6, GPT-Neo 125M −0.7; Say whether… GPT-2 small +0.1, GPT-2 medium +4.7, GPT-2 large −1.0, GPT-Neo 125M +3.3; Now look at it… That is all. GPT-2 small −1.3, GPT-2 medium +4.0, GPT-2 large +2.5, GPT-Neo 125M −0.3; Just tell me… Don't waste my time. GPT-2 small −4.4, GPT-2 medium +4.4, GPT-2 large −0.7, GPT-Neo 125M +1.6.">
  <line x1="250.0" x2="250.0" y1="34" y2="220" class="f-plain"/>
  <text x="250.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−6</text>
  <line x1="316.7" x2="316.7" y1="34" y2="220" class="f-plain"/>
  <text x="316.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−4</text>
  <line x1="383.3" x2="383.3" y1="34" y2="220" class="f-plain"/>
  <text x="383.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−2</text>
  <line x1="450.0" x2="450.0" y1="34" y2="220" class="f-plain" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="450.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="516.7" x2="516.7" y1="34" y2="220" class="f-plain"/>
  <text x="516.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <line x1="583.3" x2="583.3" y1="34" y2="220" class="f-plain"/>
  <text x="583.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <line x1="650.0" x2="650.0" y1="34" y2="220" class="f-plain"/>
  <text x="650.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="20.0" y="254.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">change of accuracy against &quot;Tell me whether…&quot;, percentage points</text>
  <text x="20.0" y="59.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please tell me…</text>
  <circle cx="346.7" cy="55.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="553.7" y="51.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 50.5 L538.5 58.5 L529.5 58.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M461.7 50.5 L466.2 55.0 L461.7 59.5 L457.2 55.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="89.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <circle cx="492.0" cy="85.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="573.0" y="81.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M564.7 80.5 L569.2 88.5 L560.2 88.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M519.0 80.5 L523.5 85.0 L519.0 89.5 L514.5 85.0 Z" style="fill:var(--muted);stroke:none"/>
  <line x1="20" x2="650" y1="100.0" y2="100.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="20.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now tell me…</text>
  <circle cx="434.7" cy="115.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="408.4" y="111.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M469.0 110.5 L473.5 118.5 L464.5 118.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M427.3 110.5 L431.8 115.0 L427.3 119.5 L422.8 115.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="149.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Say whether…</text>
  <circle cx="453.7" cy="145.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="603.4" y="141.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M415.3 140.5 L419.8 148.5 L410.8 148.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M561.0 140.5 L565.5 145.0 L561.0 149.5 L556.5 145.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="179.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now look at it… That is all.</text>
  <circle cx="408.0" cy="175.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="580.7" y="171.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M534.0 170.5 L538.5 178.5 L529.5 178.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M438.7 170.5 L443.2 175.0 L438.7 179.5 L434.2 175.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="20.0" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Just tell me… Don't waste my time.</text>
  <circle cx="304.7" cy="205.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <rect x="592.0" y="201.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <path d="M427.0 200.5 L431.5 208.5 L422.5 208.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <path d="M503.7 200.5 L508.2 205.0 L503.7 209.5 L499.2 205.0 Z" style="fill:var(--muted);stroke:none"/>
  <circle cx="24.0" cy="16.0" r="3.6" style="fill:var(--accent);stroke:none"/>
  <text x="32.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 small</text>
  <rect x="127.3" y="12.7" width="6.6" height="6.6" style="fill:var(--ink);stroke:none"/>
  <text x="138.6" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 medium</text>
  <path d="M243.8 11.5 L248.3 19.5 L239.3 19.5 Z" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <text x="251.8" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-2 large</text>
  <path d="M350.4 11.5 L354.9 16.0 L350.4 20.5 L345.9 16.0 Z" style="fill:var(--muted);stroke:none"/>
  <text x="358.4" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">GPT-Neo 125M</text>
</svg>
<figcaption>Without examples, 872 reviews of SST-2 validation, threshold set by contextual calibration for each version separately. Polite versions on the top 2 rows. 1 point is about 9 reviews.</figcaption>
</figure>

The control versions behaved the same way. The rude version gave GPT-2 medium +4.4 points, more than "Please". From GPT-2 small it took 4.4 points. Only `Now tell me...`, the one with exactly the length of "Please", stayed within about a point on every model. So a single "please" behaved like any other small change of the instruction, with a sign that depends on the model. I could not guess the sign in advance.

The full polite version did not fit this picture and I did not expect it. By accuracy it was the only version that made none of the 4 models worse. On medium and large it gave more than 3 points, Neo got 2 and on small the gain is within noise. The neutral tail of about the same length helped medium and large too, but it took 1.3 points from small and did nothing on Neo. What in the polite phrase does it I cannot say. It is also the only version that is a question, with "Could you" in front and a question mark.

## What actually moved

To see if a model started to read the reviews better or worse, I took a measure without a threshold. It is the share of pairs of a positive and a negative review that the model puts in the right order. For GPT-2 small "Please" lowered it from 0.796 to 0.782 and `Now` did about the same. For GPT-2 medium "Please" raised it from 0.859 to 0.872, for large from 0.917 to 0.924. These shifts are small, though the paired bootstrap says they are not noise. The full polite version lowered it on GPT-2 large a little, while its accuracy went up by 3.4 points.

In my numbers it looks like an instruction mostly changes how far the model leans to one answer. The reviews that change their answer are mostly the ones near the threshold. Of the 55 reviews that "Please" flipped on GPT-2 small, 53 were in the quarter of reviews closest to it.

With 4 examples in the prompt GPT-2 small and medium answered "positive" to almost every review whatever the instruction and the calibration did not fix it. Of the 3 models I ran with examples only Neo worked, 75.2% with the plain instruction. "Please" moved it within noise and `Now` took 3 points.

## The output side

The answer is billed at the same price, so politeness could also cost on the output side. Here GPT-2 medium answered 300 questions from the validation set of TriviaQA without context. It generated greedily until the first line break or 32 tokens.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="Mean length of the answer of GPT-2 medium to 300 TriviaQA questions for 4 versions of the instruction. Answer the question. 16.0, 39 of 300 right; Please answer the question. 17.1, 40 of 300 right; Could you please… Thank you. 18.1, 36 of 300 right; Now answer the question. 14.8, 42 of 300 right.">
  <text x="20.0" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Answer the question.</text>
  <rect x="230" y="23" width="152.2" height="16" class="f-box"/>
  <text x="388.2" y="35.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">16.0</text>
  <text x="660.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">39 of 300 right</text>
  <text x="20.0" y="65.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Please answer the question.</text>
  <rect x="230" y="53" width="162.4" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="398.4" y="65.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">17.1</text>
  <text x="660.0" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40 of 300 right</text>
  <text x="20.0" y="95.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">Could you please… Thank you.</text>
  <rect x="230" y="83" width="171.7" height="16" class="f-box" style="stroke:var(--accent)"/>
  <text x="407.7" y="95.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">18.1</text>
  <text x="660.0" y="95.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">36 of 300 right</text>
  <text x="20.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Now answer the question.</text>
  <rect x="230" y="113" width="140.3" height="16" class="f-box"/>
  <text x="376.3" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">14.8</text>
  <text x="660.0" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">42 of 300 right</text>
  <line x1="230.0" x2="230.0" y1="144" y2="148" class="f-line"/>
  <text x="230.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="277.5" x2="277.5" y1="144" y2="148" class="f-line"/>
  <text x="277.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="325.0" x2="325.0" y1="144" y2="148" class="f-line"/>
  <text x="325.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="372.5" x2="372.5" y1="144" y2="148" class="f-line"/>
  <text x="372.5" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <line x1="420.0" x2="420.0" y1="144" y2="148" class="f-line"/>
  <text x="420.0" y="160.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="325.0" y="176.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">answer length, tokens (mean)</text>
</svg>
<figcaption>GPT-2 medium, 300 TriviaQA questions without context, greedy decoding up to the first line break or 32 tokens. The bar is the mean answer length, the number on the right is the count of answers that contain a right answer.</figcaption>
</figure>

With "Please" the answers were 1.1 tokens longer on average and with the full polite version 2.1 tokens longer. The full polite version also ran into the limit of 32 tokens in 93 answers of 300, the plain one in 63. `Now` made the answers 1.2 tokens shorter. Answers that contain a right answer stayed between 36 and 42 of 300 for all 4 versions. The longer answers were not more often right.

## What I take from it

Webson and Pavlick showed something close in September. In their paper models trained with prompts learned almost as well from irrelevant and misleading instructions as from good ones. A single "please" fits that, it moved my numbers but in a direction I could not know beforehand.

The full polite phrase is the part I did not expect and I am not ready to call it a rule. 4 small models and 1 task is not enough, but by accuracy on all 4 it helped or did nothing. It also costs 6 tokens at the input and about 2 at the output. If I paid for millions of such calls, I would test this phrase against the plain one on my own data.

## What I did not check

OpenAI also has the instruct models in beta, trained to follow instructions. GPT-3 and these models I did not run. They may react to politeness differently. I do not know. The classification is 1 task with 2 answers, read by probability. The calibration uses only 3 empty inputs and it is noisy, which is why I also give the measure without a threshold. GPT-2 large I ran only without examples, because on this CPU the full run would take more than 3 hours. I did not split the polite phrase into its parts, the question form, "Could you" and "Thank you". The generation test is 1 model.
