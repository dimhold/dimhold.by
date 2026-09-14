---
title: "Please costs 24 dollars per million calls, which is nothing. Just the answer cost me 32.5 points of accuracy."
description: "A year ago I stripped every please and thank you out of my prompt templates because of a joke Sam Altman made about electricity. I never checked what I saved. 20171 calls later the polite wrapper costs 24 dollars per million requests on sonnet and moves the answer no more than a control wrapper with no social word in it. The wrapper that did move things was the one telling the model how much to write: Just the answer takes haiku on GSM8K from 88.5 percent down to 56.0."
date: 2026-09-14
lang: en
translationKey: politeness-cost
tags: ["llm", "statistics", "performance"]
---
In April 2025 someone on X wondered out loud how much electricity OpenAI was burning on people saying please and thank you to its models. Sam Altman answered the next day: tens of millions of dollars well spent, you never know. It was a joke. No calculation was ever published. I took it as a budget figure anyway, opened the prompt templates in my own tooling and pulled every please and every thank you out of them. It cost me an afternoon and I felt slightly better about the bill afterwards.

I never checked what I'd saved. The number I was reacting to came with no denominator anywhere near it. My own monthly total moves by more than a rounding error whenever one agent run goes badly, so the saving stayed a feeling for more than a year. This week I put it on a bench. The number I came back with was not the one I went looking for.

## The bench

5 wrappers around a task, with the task text inside them identical character for character. The plain one, `bare`, is the task on its own. `please` puts `Please help me with this.` in front of it and `Thank you.` behind. A longer friendly frame, `warm`, opens with `Hello! I hope you are having a good day.` and closes with thanks. The harsh one, `rude`, is `Do this now.` in front and `Just the answer. Do not waste my time.` behind.

`filler` is the control I care about most. Same length in tokens as `warm`, no social word in it: `Record 44 of the batch. The batch was compiled on a Tuesday morning. <task> The batch identifier is QF-2231 and it carries no meaning for it.` If `warm` moves something that `filler` leaves alone, that is politeness doing it. If both move it, then all I built was a longer prompt. I built that control first because the 2 papers I found do not have one. Yin and colleagues (arXiv 2402.14531) ran 8 politeness levels across English, Chinese and Japanese and report that rude prompts do worse while extra politeness buys nothing. Dobariya and Kumar (arXiv 2510.04950) got 84.8 percent for very rude against 80.8 for very polite on GPT-4o. Neither holds the prompt length fixed.

The tasks are 40 problems from the GSM8K test split and 12 open questions with no format constraint. 30 multiplications of 5 digits by 3 digits and 30 of 4 digits by 4 digits carry the middle of the scale, because GSM8K is too easy to show damage on the bigger model. Every task ran 5 times under every wrapper on both models. The open questions ran 4 times each, which is where counts like 200 calls and 48 answers come from.

Claude Code 2.1.235 driving `claude-haiku-4-5` and `claude-sonnet-5`, thinking mode off, tools off, empty MCP config. Offline token counts come from tiktoken 0.14.0 and transformers 5.16.1 on Python 3.12.3. Every call was issued from an empty directory under `/tmp` with no `CLAUDE.md` anywhere above it. That last part is fussiness with a reason: the CLI reads instructions out of the working directory without saying so. One of my earlier measurements was quietly ruined by my own house style file telling the model how to write.

Prices came off the Anthropic page on 14 September 2026. Haiku is 1 dollar in and 5 out per million tokens, sonnet 5 is 2 and 10. I had 3 and 15 written down for sonnet from memory. That is the previous generation's price. It put every sonnet dollar in my first draft 50 percent too high.

Tools off matters for a different reason. With the default tool set the preamble of one call is 18658 input tokens on haiku and 24729 on sonnet. The effect I am looking for is 9 tokens wide.

## The input side

9 tokens on haiku, 12 on sonnet. Across all 112 tasks the minimum and the maximum are the same number. The wrapper is a fixed string and the task sits between its halves without disturbing either. Offline, `cl100k_base`, `o200k_base`, Qwen2.5-7B and Mistral-7B all put it at 8 or 9 tokens, so this is not an Anthropic quirk. At those prices please is 9 dollars on haiku and 24 on sonnet per million requests. A long warm frame costs 35 and 90.

<figure class="fig">
<svg viewBox="0 0 640 274" role="img" aria-label="One row per model and task family. Each row gives the exact input surcharge of a polite wrapper in dollars per 1000000 requests and, as a bar, the 95 percent interval of the output surcharge measured on the same tasks. haiku 4.5 gsm8k please: input $9, output between $1 and $83; haiku 4.5 open please: input $9, output between -$72 and -$6; haiku 4.5 open warm: input $35, output between -$78 and -$8; sonnet 5 gsm8k please: input $24, output between -$129 and -$5; sonnet 5 open please: input $24, output between -$120 and $537; sonnet 5 open warm: input $90, output between -$232 and $584. The input figure is a single exact number in every row. 2 of the 6 output intervals contain 0.">
  <text x="12" y="16" class="f-label f-muted">what one polite wrapper does to the bill, per 1000000 requests</text>
  <text x="12" y="36" class="f-label f-muted">input, exact</text>
  <text x="130" y="36" class="f-label f-muted">output, measured</text>
  <line x1="317.3" y1="44" x2="317.3" y2="266" class="f-plain"/>
  <text x="317.3" y="56" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="12" y="76" class="f-label f-ink">haiku 4.5 gsm8k please</text>
  <text x="12" y="89" class="f-mono f-accent">$9</text>
  <text x="130" y="89" class="f-mono f-ink">$1 .. $83</text>
  <rect x="317.5" y="68" width="30.1" height="14" class="f-box"/>
  <line x1="332" y1="64" x2="332" y2="86" class="f-line"/>
  <text x="12" y="110" class="f-label f-ink">haiku 4.5 open please</text>
  <text x="12" y="123" class="f-mono f-accent">$9</text>
  <text x="130" y="123" class="f-mono f-ink">-$72 .. -$6</text>
  <rect x="290.8" y="102" width="24.4" height="14" class="f-box"/>
  <line x1="302.2" y1="98" x2="302.2" y2="120" class="f-line"/>
  <text x="12" y="144" class="f-label f-ink">haiku 4.5 open warm</text>
  <text x="12" y="157" class="f-mono f-accent">$35</text>
  <text x="130" y="157" class="f-mono f-ink">-$78 .. -$8</text>
  <rect x="288.6" y="136" width="25.9" height="14" class="f-box"/>
  <line x1="302.8" y1="132" x2="302.8" y2="154" class="f-line"/>
  <text x="12" y="178" class="f-label f-ink">sonnet 5 gsm8k please</text>
  <text x="12" y="191" class="f-mono f-accent">$24</text>
  <text x="130" y="191" class="f-mono f-ink">-$129 .. -$5</text>
  <rect x="269.9" y="170" width="45.6" height="14" class="f-box"/>
  <line x1="296.3" y1="166" x2="296.3" y2="188" class="f-line"/>
  <text x="12" y="212" class="f-label f-ink">sonnet 5 open please</text>
  <text x="12" y="225" class="f-mono f-accent">$24</text>
  <text x="130" y="225" class="f-mono f-ink">-$120 .. $537</text>
  <rect x="273.2" y="204" width="241.5" height="14" class="f-box"/>
  <line x1="394.9" y1="200" x2="394.9" y2="222" class="f-line"/>
  <text x="12" y="246" class="f-label f-ink">sonnet 5 open warm</text>
  <text x="12" y="259" class="f-mono f-accent">$90</text>
  <text x="130" y="259" class="f-mono f-ink">-$232 .. $584</text>
  <rect x="232" y="238" width="300" height="14" class="f-box"/>
  <line x1="396" y1="234" x2="396" y2="256" class="f-line"/>
</svg>
<figcaption>The 2 sides of the bill for one polite wrapper, in dollars per 1000000 requests. Input is exact and comes from the token counts in the envelope: 9 tokens on haiku and 12 on sonnet, so $9 and $24. The output figure is measured and the bar is its 95 percent interval, paired by task. On GSM8K it runs from $1 to $83 for haiku and from -$129 to -$5 for sonnet. 2 of the 6 bars contain 0. Of the 4 that do not, 3 lie on the side of shorter answers and 1 on the side of longer ones.</figcaption>
</figure>

## Where the bill lands

Output costs 5 times input on both models. If thank you makes the model answer you are welcome, the extra words land on the output side.

The echo is real and easy to find. On the open questions 47 of 48 sonnet answers under the warm wrapper carry an offer of more help, the `let me know if` kind. The plain task gets there 9 times out of 48. On haiku it is 40 against 0. One haiku answer about database indexes ends its last paragraph with `You're welcome!` before offering to explain anything else about databases. Whether that is the model answering the greeting or matching the register it was handed, a closing line cannot tell me.

Almost none of it reaches the bill. Paired by task on the open questions, the warm wrapper adds 21.4 output tokens on sonnet with a 95 percent interval from -23.2 to 58.4. Please adds 21.1. Both intervals contain 0. On haiku both come out slightly negative. A closing sentence is 15 tokens while the sonnet answers around it average between 561 and 1138 depending on the question, so it drowns.

One cell does buy measurably more output, haiku on GSM8K, at 8.0 tokens with an interval from 0.1 to 16.5. That is 40 dollars per million requests against 9 on the input side, the only interval in the figure above that clears 0. Sonnet on the same family goes the other way and writes 5.7 tokens less when asked politely.

## Does please change the answer

The cleanest version of that question ignores whether the answer is right. Run the same wrapper twice and count how often the 2 runs disagree, then run the plain wrapper against the polite one and count the same thing. On haiku GSM8K the same wrapper disagrees with itself 20.9 percent of the time while plain against polite disagrees 12.4 percent. On sonnet it goes the other way, 6.8 against 12.8.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="One axis per model and task family, running from 0 to 100 percent. A tick marks how often 2 runs of the same wrapper give different answers and a box marks how often the plain wrapper and the polite one give different answers. haiku 4.5 gsm8k: 20.9% when the wrapper is the same and 12.4% when one side is polite; haiku 4.5 m53: 58.4% when the wrapper is the same and 62.3% when one side is polite; haiku 4.5 m44: 85.0% when the wrapper is the same and 85.7% when one side is polite; sonnet 5 gsm8k: 6.8% when the wrapper is the same and 12.8% when one side is polite; sonnet 5 m53: 13.0% when the wrapper is the same and 18.7% when one side is polite; sonnet 5 m44: 40.4% when the wrapper is the same and 44.9% when one side is polite. The 2 marks sit close together on every row.">
  <text x="12" y="16" class="f-label f-muted">how often the answer changes between 2 runs</text>
  <text x="190" y="36" class="f-label f-muted">same wrapper twice</text>
  <text x="350" y="36" class="f-label f-muted">bare against please</text>
  <text x="190" y="54" class="f-label f-muted">0%</text>
  <text x="490" y="54" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="12" y="73" class="f-label f-ink">haiku 4.5 gsm8k</text>
  <line x1="190" y1="68" x2="490" y2="68" class="f-plain"/>
  <rect x="251.2" y="60" width="3" height="17" class="f-line"/>
  <text x="252.7" y="59" text-anchor="middle" class="f-label f-muted">20.9</text>
  <rect x="223.2" y="64" width="8" height="9" class="f-box"/>
  <text x="227.2" y="85" text-anchor="middle" class="f-label f-accent">12.4</text>
  <text x="12" y="111" class="f-label f-ink">haiku 4.5 m53</text>
  <line x1="190" y1="106" x2="490" y2="106" class="f-plain"/>
  <rect x="363.7" y="98" width="3" height="17" class="f-line"/>
  <text x="365.2" y="97" text-anchor="middle" class="f-label f-muted">58.4</text>
  <rect x="372.9" y="102" width="8" height="9" class="f-box"/>
  <text x="376.9" y="123" text-anchor="middle" class="f-label f-accent">62.3</text>
  <text x="12" y="149" class="f-label f-ink">haiku 4.5 m44</text>
  <line x1="190" y1="144" x2="490" y2="144" class="f-plain"/>
  <rect x="443.5" y="136" width="3" height="17" class="f-line"/>
  <text x="445" y="135" text-anchor="middle" class="f-label f-muted">85.0</text>
  <rect x="443.1" y="140" width="8" height="9" class="f-box"/>
  <text x="447.1" y="161" text-anchor="middle" class="f-label f-accent">85.7</text>
  <text x="12" y="187" class="f-label f-ink">sonnet 5 gsm8k</text>
  <line x1="190" y1="182" x2="490" y2="182" class="f-plain"/>
  <rect x="208.9" y="174" width="3" height="17" class="f-line"/>
  <text x="210.4" y="173" text-anchor="middle" class="f-label f-muted">6.8</text>
  <rect x="224.4" y="178" width="8" height="9" class="f-box"/>
  <text x="228.4" y="199" text-anchor="middle" class="f-label f-accent">12.8</text>
  <text x="12" y="225" class="f-label f-ink">sonnet 5 m53</text>
  <line x1="190" y1="220" x2="490" y2="220" class="f-plain"/>
  <rect x="227.5" y="212" width="3" height="17" class="f-line"/>
  <text x="229" y="211" text-anchor="middle" class="f-label f-muted">13.0</text>
  <rect x="242.1" y="216" width="8" height="9" class="f-box"/>
  <text x="246.1" y="237" text-anchor="middle" class="f-label f-accent">18.7</text>
  <text x="12" y="263" class="f-label f-ink">sonnet 5 m44</text>
  <line x1="190" y1="258" x2="490" y2="258" class="f-plain"/>
  <rect x="309.7" y="250" width="3" height="17" class="f-line"/>
  <text x="311.2" y="249" text-anchor="middle" class="f-label f-muted">40.4</text>
  <rect x="320.7" y="254" width="8" height="9" class="f-box"/>
  <text x="324.7" y="275" text-anchor="middle" class="f-label f-accent">44.9</text>
  <text x="12" y="292" class="f-label f-muted">share of pairs that disagree</text>
</svg>
<figcaption>How often 2 runs give different answers. The tick is 2 runs of the same wrapper and the box is a plain run against a polite one. On haiku GSM8K that is 20.9% against 12.4%, on sonnet 6.8% against 12.8%. The 4 by 4 multiplications are where both numbers go past 40%, because the model is guessing there and a guess differs from itself.</figcaption>
</figure>

So politeness is worth a few points of instability in either direction, depending on the model. The filler control is what settles it. Plain against filler is 13.6 percent on haiku GSM8K and 10.1 on sonnet. Both land on top of the polite number for the same cell. So do the 4 remaining cells. A wrapper with no social word in it disturbs the answer exactly as much as a polite one does. Changing the wrapper moves the answer a little. Whether the change is polite makes no difference to how much.

The correctness numbers agree. On haiku GSM8K the plain task scores 88.5 percent over 200 calls and the polite one 89.0. Every interval overlaps every other one. The warm frame and the filler control both sit lower, in the low 80s, which is the opposite of what politeness would predict and still inside the noise.

## The wrapper that did move

The rude one. On haiku GSM8K it takes correctness from 88.5 percent down to 53.5 and the average answer from 79.7 output tokens down to 11.7.

I had written `rude` as `Do this now. <task> Just the answer. Do not waste my time.` Only after the first run did I read that string properly and see 2 different things welded together. One of them is a tone. The other is an instruction about the shape of the answer. So I added 2 more wrappers. `rude_soft` is the same harsh frame with `Just the answer.` removed. In `terse` the format instruction stands alone with nothing harsh around it.

`rude_soft` scores 65.5 percent and `terse` scores 56.0. Both land under the plain task at 88.5. Their intervals overlap across most of their length, so I won't claim one half is worse than the other. What the run rules out is the reading I walked in with, where the damage was the rudeness. `terse` carries no rudeness at all and lands lower than the harsh frame does.

Output lengths run alongside: 31.6 tokens for the harsh frame, 20.1 for the bare instruction, 79.7 for the plain task. My reading is that the model stops writing the steps out and then gets the arithmetic wrong, which is a guess about the mechanism. What the run measured is that short answers and wrong answers arrive together. Sonnet stays between 88.5 and 95.5 percent on every wrapper.

<figure class="fig">
<svg viewBox="0 0 640 272" role="img" aria-label="Two columns, share of correct answers and mean output tokens, for 4 wrappers on GSM8K and 2 models. The wrappers are the plain task, the rude frame without the format instruction, the format instruction without the rude frame, and both together. haiku 4.5 bare: 88.5% correct on 200 calls, 79.7 output tokens; haiku 4.5 rude_soft: 65.5% correct on 200 calls, 31.6 output tokens; haiku 4.5 terse: 56.0% correct on 200 calls, 20.1 output tokens; haiku 4.5 rude: 53.5% correct on 200 calls, 11.7 output tokens; sonnet 5 bare: 93.5% correct on 200 calls, 15.8 output tokens; sonnet 5 rude_soft: 94.5% correct on 200 calls, 10.0 output tokens; sonnet 5 terse: 95.0% correct on 200 calls, 6.1 output tokens; sonnet 5 rude: 92.0% correct on 200 calls, 5.5 output tokens. The rows carrying the format instruction have the short answers.">
  <text x="12" y="16" class="f-label f-muted">the rude wrapper taken apart, GSM8K</text>
  <text x="196" y="40" class="f-label f-muted">correct</text>
  <text x="404" y="40" class="f-label f-muted">output tokens</text>
  <text x="12" y="63" class="f-label f-ink">haiku 4.5 bare</text>
  <rect x="196" y="50" width="132" height="16" class="f-plain"/>
  <rect x="196" y="50" width="116.8" height="16" class="f-box"/>
  <text x="336" y="63" class="f-mono f-ink">88.5%</text>
  <rect x="404" y="50" width="132" height="16" class="f-plain"/>
  <rect x="404" y="50" width="132" height="16" class="f-box"/>
  <text x="544" y="63" class="f-mono f-ink">79.7</text>
  <text x="12" y="89" class="f-label f-ink">haiku 4.5 rude_soft</text>
  <rect x="196" y="76" width="132" height="16" class="f-plain"/>
  <rect x="196" y="76" width="86.5" height="16" class="f-box"/>
  <text x="336" y="89" class="f-mono f-ink">65.5%</text>
  <rect x="404" y="76" width="132" height="16" class="f-plain"/>
  <rect x="404" y="76" width="52.3" height="16" class="f-box"/>
  <text x="544" y="89" class="f-mono f-ink">31.6</text>
  <text x="12" y="115" class="f-label f-ink">haiku 4.5 terse</text>
  <rect x="196" y="102" width="132" height="16" class="f-plain"/>
  <rect x="196" y="102" width="73.9" height="16" class="f-box"/>
  <text x="336" y="115" class="f-mono f-ink">56.0%</text>
  <rect x="404" y="102" width="132" height="16" class="f-plain"/>
  <rect x="404" y="102" width="33.3" height="16" class="f-box"/>
  <text x="544" y="115" class="f-mono f-ink">20.1</text>
  <text x="12" y="141" class="f-label f-ink">haiku 4.5 rude</text>
  <rect x="196" y="128" width="132" height="16" class="f-plain"/>
  <rect x="196" y="128" width="70.6" height="16" class="f-box"/>
  <text x="336" y="141" class="f-mono f-ink">53.5%</text>
  <rect x="404" y="128" width="132" height="16" class="f-plain"/>
  <rect x="404" y="128" width="19.4" height="16" class="f-box"/>
  <text x="544" y="141" class="f-mono f-ink">11.7</text>
  <text x="12" y="167" class="f-label f-ink">sonnet 5 bare</text>
  <rect x="196" y="154" width="132" height="16" class="f-plain"/>
  <rect x="196" y="154" width="123.4" height="16" class="f-box"/>
  <text x="336" y="167" class="f-mono f-ink">93.5%</text>
  <rect x="404" y="154" width="132" height="16" class="f-plain"/>
  <rect x="404" y="154" width="26.2" height="16" class="f-box"/>
  <text x="544" y="167" class="f-mono f-ink">15.8</text>
  <text x="12" y="193" class="f-label f-ink">sonnet 5 rude_soft</text>
  <rect x="196" y="180" width="132" height="16" class="f-plain"/>
  <rect x="196" y="180" width="124.7" height="16" class="f-box"/>
  <text x="336" y="193" class="f-mono f-ink">94.5%</text>
  <rect x="404" y="180" width="132" height="16" class="f-plain"/>
  <rect x="404" y="180" width="16.6" height="16" class="f-box"/>
  <text x="544" y="193" class="f-mono f-ink">10.0</text>
  <text x="12" y="219" class="f-label f-ink">sonnet 5 terse</text>
  <rect x="196" y="206" width="132" height="16" class="f-plain"/>
  <rect x="196" y="206" width="125.4" height="16" class="f-box"/>
  <text x="336" y="219" class="f-mono f-ink">95.0%</text>
  <rect x="404" y="206" width="132" height="16" class="f-plain"/>
  <rect x="404" y="206" width="10.1" height="16" class="f-box"/>
  <text x="544" y="219" class="f-mono f-ink">6.1</text>
  <text x="12" y="245" class="f-label f-ink">sonnet 5 rude</text>
  <rect x="196" y="232" width="132" height="16" class="f-plain"/>
  <rect x="196" y="232" width="121.4" height="16" class="f-box"/>
  <text x="336" y="245" class="f-mono f-ink">92.0%</text>
  <rect x="404" y="232" width="132" height="16" class="f-plain"/>
  <rect x="404" y="232" width="9.1" height="16" class="f-box"/>
  <text x="544" y="245" class="f-mono f-ink">5.5</text>
</svg>
<figcaption>The rude wrapper split into its 2 parts on GSM8K. Without the format instruction the harsh frame scores 65.5% on haiku against 88.5% for the plain task and writes 31.6 output tokens against 79.7. The format instruction on its own, with nothing rude around it, scores 56.0% and writes 20.1. Both halves land under the plain task. The 2 of them together give the 53.5% of the full rude wrapper.</figcaption>
</figure>

The same split shows up in dollars on the open questions. Paired by task, the full rude wrapper cuts 614.2 output tokens per sonnet answer, the harsh frame alone cuts 495.4 and the format instruction alone 470.2. At the published output price that rude wrapper saves 6142 dollars per million requests.

## What I did not check

`filler` is not a clean length control. It drops the social words and adds unrelated content about batch QF-2231. It matches `warm` in tokens. The tokens say something else entirely. 2 models from one lab, with the whole GSM8K result resting on the small one. The system prompt was pinned to `You are a helpful assistant.` on every call, so a real system prompt that already sets a tone is outside what I measured.

My first pass died after 1848 calls and 2.83 dollars against a spend limit, which returned 429 for the next 3152. It took 3 more sittings to finish the grid. I kept the failed log instead of deleting it: the call order was shuffled before the run started, so a stop halfway leaves a random subsample rather than a slice through one variant.

One thing I got wrong and only caught at the end. My grader compared answers as strings and stripped exactly one trailing `.0`, so `16.00` against an expected `16` went into the wrong pile. That is 117 calls out of 7000. They did not fall evenly: 17 of them in the filler cell against 1 in the plain cell on sonnet. Every accuracy number above comes from regrading the saved answers, not from a new run.

I'm putting please back into the templates. On sonnet it is 24 dollars per million requests and I spend more than that on one bad afternoon.
