---
title: "85% of an agent's input tokens were one header, sent 1,253 times"
description: "I rebuilt every prompt of 2 published ReAct agent runs and counted the tokens. In FEVER 84.9% of the input is the same header and 13.3% is resent history. In WebShop a sliding window lost the task. In a long gpt-4 chat dropping old messages at the limit cost 7.9 times as much as a new chat per task."
date: 2023-04-02
lang: en
translationKey: agent-token-budget
tags: ["llm", "agents", "numbers"]
---

1,172,161 tokens. That is the input of the FEVER notebook from the ReAct repository when I run tiktoken (cl100k_base) over every prompt it sent, 500 claims and 1,253 calls. Then I counted the header alone, a line of instruction and 3 solved examples that the loop pastes in front of every call. That alone is 994,882.

I have always explained the price of an agent with a triangle. The model remembers nothing between calls, so call 2 resends step 1, call 3 resends steps 1 and 2, the bill grows as the square of the number of steps. The picture is correct, but I never put numbers on it. Before the run I wrote down that resent history would be more than half of the input. It is 13.3%.

The triangle is well known and the cures exist, LangChain 0.0.128 has a memory that keeps the last 5 exchanges and another one that summarizes old messages after 2,000 tokens. I wanted to know how much there is to cut.

## What I counted

The ReAct repository (Yao et al., I took commit 245c1aa from March 30) keeps the printed logs of 2 agents, FEVER and WebShop, 500 episodes each, on `text-davinci-002`. The answers of the model and of the environment are there, so I rebuilt every prompt the way the notebook code builds it and called no API. Python 3.11, tiktoken 0.3.3.

In p50k_base at today's $0.02 per 1,000 tokens the FEVER run is $24.41 and the WebShop run $70.07. For the chat models I counted the same texts in cl100k_base and added 7 or 8 tokens of message overhead, as the OpenAI cookbook does. The prices are from the pricing page of these days, gpt-4 8K $0.03 in and $0.06 out, gpt-3.5-turbo $0.002 both ways. FEVER becomes $37.76 or $2.44. A real gpt-4 would write other thoughts, so this is only the price of this text.

## The square has no room to grow

Let P be the header, q the task and d what one step adds. Then n calls send n(P+q) + d·n(n−1)/2 tokens. The second part catches up with the first at n = 1 + 2(P+q)/d.

For FEVER P is 794, q is 13 and a resent step d is 152 on average, which gives 11.6 calls. The loop in the notebook stops after 7 steps and the median episode needs 2. Even in the 14 episodes with exactly 7 calls the history is 19.2% of the input. WebShop has a shorter header of 523 tokens with one example, a task of 41 and steps of 80 on average. The crossing is at 15.1 calls and the loop stops at 15. There the history is 36.2% over the whole run. The header is 59.2%.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Mean tokens in one call by call number, split into header with task and resent history. FEVER: 1: 811 + 0; 2: 811 + 188; 3: 813 + 213; 4: 812 + 239; 5: 811 + 276; 6: 811 + 322; 7: 811 + 372. WebShop: 1: 563 + 0; 2: 563 + 188; 3: 563 + 234; 4: 563 + 372; 5: 563 + 421; 6: 563 + 451; 7: 563 + 475; 8: 563 + 508; 9: 563 + 551; 10: 563 + 587; 11: 563 + 633; 12: 563 + 681; 13: 563 + 717; 14: 563 + 764; 15: 563 + 791. The header part stays the same size and the history becomes larger than it only from call 10 of WebShop.">
  <line x1="60" y1="240.0" x2="260" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="188.6" x2="260" y2="188.6" class="f-plain"/>
  <text x="54.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="60" y1="137.1" x2="260" y2="137.1" class="f-plain"/>
  <text x="54.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="60" y1="85.7" x2="260" y2="85.7" class="f-plain"/>
  <text x="54.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,200</text>
  <rect x="64.6" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="74.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="93.1" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="93.1" y="111.6" width="19.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="102.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="121.7" y="135.5" width="19.4" height="104.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.7" y="108.1" width="19.4" height="27.4" style="fill:var(--accent);stroke:none"/>
  <text x="131.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="150.3" y="135.6" width="19.4" height="104.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="150.3" y="104.9" width="19.4" height="30.7" style="fill:var(--accent);stroke:none"/>
  <text x="160.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="178.9" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="178.9" y="100.2" width="19.4" height="35.5" style="fill:var(--accent);stroke:none"/>
  <text x="188.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="207.4" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.4" y="94.3" width="19.4" height="41.4" style="fill:var(--accent);stroke:none"/>
  <text x="217.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="236.0" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="236.0" y="87.9" width="19.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="245.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="60.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">FEVER</text>
  <line x1="330" y1="240.0" x2="670" y2="240.0" class="f-plain"/>
  <text x="324.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="330" y1="188.6" x2="670" y2="188.6" class="f-plain"/>
  <text x="324.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="330" y1="137.1" x2="670" y2="137.1" class="f-plain"/>
  <text x="324.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="330" y1="85.7" x2="670" y2="85.7" class="f-plain"/>
  <text x="324.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,200</text>
  <rect x="333.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="341.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="356.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.3" y="143.4" width="15.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="364.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="379.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="379.0" y="137.5" width="15.4" height="30.1" style="fill:var(--accent);stroke:none"/>
  <text x="386.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="401.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="401.6" y="119.8" width="15.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="409.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="424.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="424.3" y="113.5" width="15.4" height="54.1" style="fill:var(--accent);stroke:none"/>
  <text x="432.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="447.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="447.0" y="109.6" width="15.4" height="58.0" style="fill:var(--accent);stroke:none"/>
  <text x="454.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="469.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="469.6" y="106.5" width="15.4" height="61.1" style="fill:var(--accent);stroke:none"/>
  <text x="477.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <rect x="492.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="492.3" y="102.3" width="15.4" height="65.3" style="fill:var(--accent);stroke:none"/>
  <text x="500.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="515.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="515.0" y="96.8" width="15.4" height="70.8" style="fill:var(--accent);stroke:none"/>
  <text x="522.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <rect x="537.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="537.6" y="92.1" width="15.4" height="75.5" style="fill:var(--accent);stroke:none"/>
  <text x="545.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="560.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="560.3" y="86.2" width="15.4" height="81.4" style="fill:var(--accent);stroke:none"/>
  <text x="568.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="583.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="583.0" y="80.1" width="15.4" height="87.6" style="fill:var(--accent);stroke:none"/>
  <text x="590.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="605.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="605.6" y="75.4" width="15.4" height="92.2" style="fill:var(--accent);stroke:none"/>
  <text x="613.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="628.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="628.3" y="69.4" width="15.4" height="98.2" style="fill:var(--accent);stroke:none"/>
  <text x="636.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="651.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="651.0" y="65.9" width="15.4" height="101.7" style="fill:var(--accent);stroke:none"/>
  <text x="658.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="330.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">WebShop</text>
  <text x="60.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">call number</text>
  <text x="330.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">call number</text>
  <rect x="60.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="78.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">header and task</text>
  <rect x="260.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">resent history</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">tokens per call</text>
</svg>
<figcaption>Mean size of one prompt by call number, cl100k_base tokens. Few episodes get far: in FEVER 500 start and 15 reach call 7, in WebShop 35 reach call 15.</figcaption>
</figure>

In gpt-4 prices $29.85 of the $37.76 is the FEVER header and $4.67 is the history. A perfect memory that costs nothing would save 12%. Throwing out the longest of the 3 examples, 315 tokens, would save $11.84. I don't know what it does to accuracy. The paper says only that more examples did not help.

And 35 WebShop episodes, 7% of them, went to the limit of 15 calls, earned zero reward and took 18.1% of the input tokens. The answer to call 15 is paid and never used.

## A window that forgets the task

The WebShop notebook already has a sliding window, `prompt[-(6400-len(init_prompt)):]`. It keeps the header and the last 4,614 characters of the dialogue. Over 3,472 calls it cut something 5 times in 2 episodes and saved 9 cents. But the dialogue starts with the task, so the task goes first. In one episode it was part of the task line, in the other all of it.

Episode 114 asks for roller shades, size w45*h56, pastel blue, under 90 dollars. The agent opens a product page of 6,973 characters, 6,531 of them are a list of 350 sizes. The price at the bottom is $66.90. After the cut the task is gone together with the search query and the model writes `think[The price is over 50 dollars.]`. At the next call the window starts exactly with `[w39 x h64 (inch)]`. This is what the model clicks, then it buys. `[w45 x h56 (inch)]` was still in the window. Score 0.6. The number 50 as a price limit is only in the header, in the example about a deodorant.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="WebShop episode 114, call 4. The dialogue is 8,068 characters long and starts with the task: size w45*h56, under 90 dollars. The window keeps only the last 4,614 characters, all of them from the product page. The header with the deodorant example, under 50 dollars, is glued in front. The model answers that the price is over 50 dollars.">
  <text x="40.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">dialogue, 8,068 characters</text>
  <text x="40.0" y="40.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">task: w45*h56, under 90</text>
  <line x1="45" y1="45" x2="45" y2="56" class="f-line"/>
  <rect x="40.0" y="58.0" width="256.9" height="34.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="296.9" y="58.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <rect x="40.0" y="58.0" width="11.7" height="34.0" style="fill:var(--accent);stroke:none"/>
  <line x1="120.8" y1="54" x2="120.8" y2="96" class="f-line"/>
  <text x="640.0" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">product page, 6,973 characters</text>
  <text x="40.0" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">cut: 3,454</text>
  <text x="640.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">kept: last 4,614</text>
  <line x1="296.9" y1="54" x2="296.9" y2="148" class="f-line" stroke-dasharray="4 4"/>
  <text x="640.0" y="142.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">sent to the model, 6,400 characters</text>
  <rect x="164.0" y="150.0" width="132.8" height="34.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="296.9" y="150.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="164.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">header, 1,786</text>
  <text x="164.0" y="202.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">example: under 50</text>
  <text x="640.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">rest of the product page</text>
  <text x="40.0" y="236.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">answer: think[The price is over 50 dollars.]</text>
</svg>
<figcaption>Episode 114 of WebShop, call 4, to scale in characters. The only price limit left in the prompt belongs to the example.</figcaption>
</figure>

I had the conclusion ready, that without its task the agent takes the limit from the example. The other episodes made it weaker. Among tasks with a limit other than 50 the thoughts name the right limit 328 times. They name 50 dollars 26 times in 22 episodes. In 21 of these nothing was cut. One task had a limit of 40 and the thought says "the price is 46.99 dollars which is lower than 50.00 dollars". It bought that one too. The misspelled "less then" of the example is in 215 thoughts and in no task. So the header leaks with the task in full view. For the 50 dollars of episode 114 I can't say which of the 2 causes it was.

## A long chat

To see the square I had to build it. I put the 500 FEVER tasks one after another into one chat with the header at the top and resent everything. It is 1,250 calls without the 3 retries. The 8K context of gpt-4 ends inside task 27, I had guessed before 20. In 1,000 random orders the median is also 26 complete tasks, in 90% of them from 23 to 29. Those 26 tasks cost $7.98, against $1.95 if each gets a new chat. With gpt-4-32k at twice the price: 10 tasks $3.78, 20 tasks $10.39, 40 tasks $33.54, 80 tasks $140.89.

Then I ran all 500 tasks under different policies. The summary is assumed to be 150 tokens and its instruction 60, because nobody wrote these summaries. The windows always keep the current claim.

<figure class="fig">
<svg viewBox="0 0 680 252" role="img" aria-label="Cost in dollars of 500 FEVER tasks in one gpt-4 chat by policy: new chat per task 37.50; window, 250 tokens 38.62; window, 500 47.66; summary every 3 steps 53.40; window, 1,000 66.35; window, 2,000 103.48; summary every 50 steps 143.53; window, 4,000 176.40; drop oldest at the limit 294.77. The header alone is 29.78 in each of them.">
  <text x="210.0" y="27.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">new chat per task</text>
  <rect x="220.0" y="14.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="14.0" width="9.8" height="18.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="275.5" y="27.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">37.50</text>
  <text x="210.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">window, 250 tokens</text>
  <rect x="220.0" y="40.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="40.0" width="11.2" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="276.9" y="53.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">38.62</text>
  <text x="210.0" y="79.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">window, 500</text>
  <rect x="220.0" y="66.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="66.0" width="22.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="288.4" y="79.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">47.66</text>
  <text x="210.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">summary every 3 steps</text>
  <rect x="220.0" y="92.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="92.0" width="29.9" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="295.6" y="105.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">53.40</text>
  <text x="210.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">window, 1,000</text>
  <rect x="220.0" y="118.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="118.0" width="46.3" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="312.0" y="131.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">66.35</text>
  <text x="210.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">window, 2,000</text>
  <rect x="220.0" y="144.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="144.0" width="93.4" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="359.1" y="157.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103.48</text>
  <text x="210.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">summary every 50 steps</text>
  <rect x="220.0" y="170.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="170.0" width="144.1" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="409.8" y="183.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">143.53</text>
  <text x="210.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">window, 4,000</text>
  <rect x="220.0" y="196.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="196.0" width="185.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="451.4" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">176.40</text>
  <text x="210.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">drop oldest at the limit</text>
  <rect x="220.0" y="222.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="222.0" width="335.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="601.4" y="235.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">294.77</text>
</svg>
<figcaption>500 FEVER tasks at gpt-4 8K prices, dollars. The dark part is the header, the same 29.78 in every row.</figcaption>
</figure>

The last row is what I would have coded without thinking, drop the oldest messages when the request does not fit. It never fails and the bill is linear, but every call costs about $0.24 because the context is always almost full. The total is $294.77, 7.9 times a new chat per task.

The summary was better than I expected. Squeezing H tokens into s with an instruction of i pays off after (H + i + rs)/(H − s) further calls, where r is the output price over the input price. For 1,000 tokens into 150 on gpt-4 it is 1.6 calls. I had written 5. The best period is the square root of 2(i + (1+r)s)/d steps, the same root as in the old economic order quantity of Harris. In the long chat a call adds 111.5 tokens with the short last steps counted, so the formula gives 3.05 (7 tokens of overhead go into i) and the simulation 3. It means 416 summaries over the 500 tasks, each made from the previous one, what is left of a fact after 10 of them I did not measure. And it is still $53.40 against $37.50 for a new chat each time.

## What I didn't check

Quality, mostly. All of this is arithmetic over old logs. FEVER tasks do not depend on each other, so a new chat loses nothing there, in a real conversation it would. The steps are short. An agent that reads files of 2,000 tokens reaches the crossing with the FEVER header on the second call (1.8 by the formula), there my triangle works. If the code in the notebook is not exactly the code that printed the log, the 5 cuts may move. For 35 calls the answer was not printed and I counted it as zero, it is at most 7 cents.

Next I want to see what a shorter header does to accuracy. For that I will need the API after all.
