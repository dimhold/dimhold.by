---
title: "The model knows that a day has 1,440 minutes and sets the reminder for 24"
description: "I gave Qwen3-0.6B in llama.cpp 10 tools and 80 requests on 2 CPU cores. All 49 calls were valid JSON with existing tools and 28 of them were right. A schema check would stop one of the 21 wrong ones."
date: 2025-06-01
lang: en
translationKey: local-tool-calls
tags: ["llm", "agents", "reliability"]
---

Here are 2 answers from the same run, the same model with the same list of tools. I ask how many minutes there are in a day:

```
A day has 24 hours, and each hour has 60 minutes, so there are 24 × 60 = 1,440 minutes in a day.
```

Then I say "Remind me in a day with the text: water":

```
{"name": "create_reminder", "arguments": {"text": "water", "minutes": 24}}
```

It is a valid call, with the right tool and an integer as the schema wants. Nothing between the model and my reminder would stop it.

I always thought that a small local model fails on the form, it breaks the JSON or calls a tool that nobody gave it. So for an agent on my own machine I would add a schema check with a retry. I never measured what such a check would really catch.

## What I ran

The model is Qwen3-0.6B, the official Q8_0 GGUF file of 639 MB. I ran it with llama.cpp b5554 from May 31 on 2 cores of a virtual machine, with 4096 tokens of context. At the peak the server took 1.2 GB of memory. Temperature is 0 and thinking is off, with an empty think block like the chat template does it. With tools `llama-server` normally constrains the call with a grammar. I wanted to see the model on its own, so I sent the prompt from the template as a plain completion.

There are 10 tools of a desktop assistant and 80 requests, each with an expected answer. In 24 requests all the arguments stand in the text as they are. In 16 one of them has to be converted first. 16 more lack a required argument and the right move is to ask. For 16 there is no tool at all and 8 are just questions. A call passes only if it is exactly the expected one. In the last 3 groups I counted an answer as right if it had no call.

Before the run I wrote down what I expected, from 3 to 10 invented tools and the missing arguments as the worst group.

Others do this on thousands of examples. BFCL, the Berkeley leaderboard, compares calls with the expected ones and Gorilla counted invented API calls back in 2023. When2Call from this April is about knowing when not to call.

## The form is fine

49 answers had a call. All 49 parse as JSON and all the names are from the list. No argument name was invented and none was lost. The only violation of the schema is `"minutes": 1.5`. I expected at least 3 invented tools and got 0.

28 of the 49 calls are right. My schema check would stop one of the 21 wrong ones.

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="49 answers with a tool call. In 49 the JSON parses, in 49 the tool exists, in 48 the arguments fit the schema, in 28 the call is right.">
  <text x="198" y="31" text-anchor="end" class="f-mono f-muted" style="font-size:12px">answers with a call</text>
  <rect x="210" y="14" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="14" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="31" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="65" text-anchor="end" class="f-mono f-muted" style="font-size:12px">JSON parses</text>
  <rect x="210" y="48" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="48" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="65" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="99" text-anchor="end" class="f-mono f-muted" style="font-size:12px">the tool exists</text>
  <rect x="210" y="82" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="82" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="99" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="133" text-anchor="end" class="f-mono f-muted" style="font-size:12px">arguments fit the schema</text>
  <rect x="210" y="116" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="116" width="411.4" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="133" text-anchor="start" class="f-mono f-ink" style="font-size:12px">48</text>
  <text x="198" y="167" text-anchor="end" class="f-mono f-muted" style="font-size:12px">the call is right</text>
  <rect x="210" y="150" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="150" width="240.0" height="24" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="640" y="167" text-anchor="start" class="f-mono f-ink" style="font-size:12px">28</text>
</svg>
<figcaption>What is left of 49 calls after each check. The first 4 bars are what a machine can check without knowing what I wanted.</figcaption>
</figure>

## Where they break

When the arguments are in the text, 22 of 24 requests pass. When something has to be converted it is 6 of 16, almost as bad as the missing arguments with 5.

Reminders are the clearest case. All 5 are wrong. An hour and a half becomes 1.5 and a day becomes 24, so these look like hours in the field for minutes. A quarter of an hour became 60 and I cannot explain it.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="5 reminder requests. Needed minutes 90, 180, 15, 140, 1440. Without thinking the model gives 1.5, 3, 60, 20, 24. With thinking 105, 180, 15, 140, 24. When the tool takes words: 1.5 hours, 3 hours, 30, 2 hours and 20 minutes, 1 day.">
  <text x="12" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">request</text>
  <text x="275" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">minutes needed</text>
  <text x="385" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">no thinking</text>
  <text x="488" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">thinking</text>
  <text x="504" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">as words</text>
  <line x1="12" y1="32" x2="668" y2="32" class="f-plain"/>
  <text x="12" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in an hour and a half</text>
  <text x="275" y="56" text-anchor="end" class="f-mono f-ink" style="font-size:12px">90</text>
  <text x="385" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">1.5</text>
  <text x="488" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">105</text>
  <text x="504" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1.5 hours</text>
  <text x="12" y="84" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 3 hours</text>
  <text x="275" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="385" y="84" text-anchor="end" class="f-mono f-accent" style="font-size:12px">3</text>
  <text x="488" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="504" y="84" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3 hours</text>
  <text x="12" y="112" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a quarter of an hour</text>
  <text x="275" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="385" y="112" text-anchor="end" class="f-mono f-accent" style="font-size:12px">60</text>
  <text x="488" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="504" y="112" text-anchor="start" class="f-mono f-accent" style="font-size:11px">30</text>
  <text x="12" y="140" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 2 hours and 20 minutes</text>
  <text x="275" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="385" y="140" text-anchor="end" class="f-mono f-accent" style="font-size:12px">20</text>
  <text x="488" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="504" y="140" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2 hours and 20 minutes</text>
  <text x="12" y="168" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a day</text>
  <text x="275" y="168" text-anchor="end" class="f-mono f-ink" style="font-size:12px">1440</text>
  <text x="385" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="488" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="504" y="168" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 day</text>
</svg>
<figcaption>The 5 reminder requests and what came in the argument. Wrong values are in the accent color. The last column is another version of the tool, where the delay is a string.</figcaption>
</figure>

With the volume it is better, 3 of 4, but "Mute the sound" got no call, only the text "Set the sound volume to 0." In the calendar 1 of 5 passed. In 3 of the 4 failures the date slipped into the title, as in "Dinner on June 14, 2025 at 7:30 pm". In 2 of these the date and the time are right, so a softer judge would give 8 of 16.

With a missing argument the model filled the hole itself in 11 cases of 16. It gave 10 minutes to the bread and 200 pixels to the cat. A file I did not name became `/path/to/file.txt` and the barber without a date was booked for September 18, 2023.

## My score believed 2 lies

Out of 16 requests with no tool only one led to a call. I was pleased with this group until I read the answers. "The image `/home/me/cat.png` has been rotated by 90 degrees." No call was made and there is no tool for it, but by my rule it passed. In the missing group "Move the file into /home/me/papers" was answered with "The file has been moved". It passed too.

I left the criterion as it was written before the run and report these 2 separately. A question back, which is what I wanted from the missing group, came in 2 cases, while the score says 5.

## What I tried

First a rule in the system prompt. Call only if the tool does exactly what is asked, ask for a missing argument, refuse if no tool fits.

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Right answers of 80 requests without and with the rule. Arguments as is 22 and 21 of 24, to convert 6 and 3 of 16, argument missing 5 and 7 of 16, no such tool 15 and 16 of 16, just a question 8 and 8 of 8.">
  <text x="12" y="36" text-anchor="start" class="f-mono f-ink" style="font-size:12px">arguments as is</text>
  <text x="274" y="23" text-anchor="end" class="f-label f-muted" style="font-size:10px">plain</text>
  <rect x="284" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="23" text-anchor="end" class="f-mono f-muted" style="font-size:11px">22/24</text>
  <text x="274" y="42" text-anchor="end" class="f-label f-muted" style="font-size:10px">rule</text>
  <rect x="284" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="42" text-anchor="end" class="f-mono f-muted" style="font-size:11px">21/24</text>
  <text x="12" y="82" text-anchor="start" class="f-mono f-ink" style="font-size:12px">to convert</text>
  <text x="274" y="69" text-anchor="end" class="f-label f-muted" style="font-size:10px">plain</text>
  <rect x="284" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6/16</text>
  <text x="274" y="88" text-anchor="end" class="f-label f-muted" style="font-size:10px">rule</text>
  <rect x="284" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="88" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3/16</text>
  <text x="12" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:12px">argument missing</text>
  <text x="274" y="115" text-anchor="end" class="f-label f-muted" style="font-size:10px">plain</text>
  <rect x="284" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="115" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5/16</text>
  <text x="274" y="134" text-anchor="end" class="f-label f-muted" style="font-size:10px">rule</text>
  <rect x="284" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="134" text-anchor="end" class="f-mono f-muted" style="font-size:11px">7/16</text>
  <text x="12" y="174" text-anchor="start" class="f-mono f-ink" style="font-size:12px">no such tool</text>
  <text x="274" y="161" text-anchor="end" class="f-label f-muted" style="font-size:10px">plain</text>
  <rect x="284" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="151" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="161" text-anchor="end" class="f-mono f-muted" style="font-size:11px">15/16</text>
  <text x="274" y="180" text-anchor="end" class="f-label f-muted" style="font-size:10px">rule</text>
  <rect x="284" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="180" text-anchor="end" class="f-mono f-muted" style="font-size:11px">16/16</text>
  <text x="12" y="220" text-anchor="start" class="f-mono f-ink" style="font-size:12px">just a question</text>
  <text x="274" y="207" text-anchor="end" class="f-label f-muted" style="font-size:10px">plain</text>
  <rect x="284" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="207" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
  <text x="274" y="226" text-anchor="end" class="f-label f-muted" style="font-size:10px">rule</text>
  <rect x="284" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="226" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
</svg>
<figcaption>Each square is one request, filled when it passed. In the lower 3 groups it passes if there was no call, whatever the text says.</figcaption>
</figure>

The total went from 56 to 55 of 80. It asks more, 6 times of 16 instead of 2, but in 9 requests the argument is still made up. I paid for it where I did not expect, the volume went from 3 of 4 to 0.

```
You cannot set the volume to three quarters. The volume can be set between 0 and 100, inclusive.
```

Then thinking, with the temperature, top_p, top_k and min_p from the model card. My script ran out of time after 4 tasks, so I made a second run on the 16 requests with conversion only. It gives 7 of 16 against 6. The median answer takes 8.1 seconds instead of 1.5 and 180.5 tokens instead of 29. Reminders went from 0 to 3 of 5, the calendar from 1 to 0. One request ran into my limit of 600 tokens with the correct 1920 already in its thoughts.

The thinking itself is worth reading. About the mute: "Muting sounds usually means setting the volume to 0. So I need to call set_volume with percent 100." About the day it repeats that the parameter is in minutes, says "that's 24 hours" and sends 24.

My last try was to take the arithmetic away from the model. In another version of the tools the delay is a string copied from the words of the user, the volume and the date with the time too. Code would parse them later. This touches 13 requests and 5 of them are copied literally. If I read by meaning, a reading I added after the run, it is 7. With numbers the same requests gave 4, with thinking 6, but if I am soft there too and forgive the titles, it is 6 and 8. I was going to call it half of a solution, now I don't see a gain at all. "3 hours" and "1 day" arrive fine, but "in 20 minutes" became "20" and the unit is gone. I did not write the parser.

I would keep the schema check because it is cheap, but I would not count on it. Anything that writes or moves a file should show me the call before it runs.

## What I didn't check

One model of one size, English only. Qwen3 has 1.7B and 4B versions, I expect them to be better but have not tried. Without thinking the card suggests temperature 0.7 and I used 0 to make the run repeatable. It also suggests a presence penalty of 1.5 and I did not set it, so the thinking that went in circles up to 600 tokens may be partly my fault. Every number is from a single run and the groups are small, I would not read anything into 6 against 7. I did not run it with the grammar of `llama-server`. In its source an integer has no place for a fraction, so 1.5 should not pass, but I don't know what it would put there instead. Whether a text asks back or lies is my own reading, the list is in the script.
