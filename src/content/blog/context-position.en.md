---
title: "Haiku 4.5 found the key 243 times of 245 in prompts up to 96 thousand tokens. For a key that was not there, it returned a value 12 times of 20."
description: "I had the Lost in the Middle chart in my head and never checked it on the model I use every day. On a key and value lookup haiku 4.5 found the key 243 times of 245 across 11 depths in prompts up to about 96 thousand tokens, with no dip in the middle. The degradation was somewhere else: asked for a key that was not in the object, it began returning values instead of NOT FOUND after 2000 pairs and at 6000 pairs returned a value 12 times of 20."
date: 2026-09-21
lang: en
translationKey: context-position
tags: ["llm", "reliability"]
---
The file my agent reads first in every session was started on 11 August. By now it is 934 lines long and has gone through 83 commits, most of them a correction of mine turned into a dated rule and put wherever it seemed to fit. When the agent ignored one of those rules, the first thing I suspected was where the rule sat in the file. I had the chart from Lost in the Middle in my head. Accuracy is high at both ends of the window and lower in the middle. I treated that curve as a property of language models in general, but I never checked it on the model I call every day.

So I took the task from that paper and ran it myself.

## The bench

Liu and colleagues (arXiv 2307.03172, TACL 2024) built a synthetic task I like because it needs no reasoning at all. A JSON object of random key and value pairs and a question about one key. I kept the shape and shortened the identifiers to 8 hex characters, so that 200 pairs still fit a model running on a CPU. Inside one size and one seed the object is the same for all 11 depths. Only the asked key moves, from the first line to the last. So the depth effect is not mixed with the effect of a different object.

After the object and the key every call gets the same instruction:

```
Answer with the value only, 8 hex characters, nothing else. If the key is not in the object, answer NOT FOUND.
```

The second sentence is the important one here. A separate series asks for a key that is not in the object at all, where NOT FOUND is the only correct answer. Without explicit permission to refuse, a model that never says it doesn't know would only be doing what I told it.

The small models are Qwen2.5 0.5B Instruct in float32 and 1.5B Instruct in bfloat16, greedy decoding, transformers 5.16.1 and torch 2.14.0 on 4 CPU cores. The model I actually use is `claude-haiku-4-5`. I called it through the Claude Code CLI with thinking off, tools off and an empty MCP config. The directory had no `CLAUDE.md` above it, because the CLI reads that file silently. Haiku went up to 6000 pairs, about 96 thousand tokens of prompt and about half of its window.

This was measured before, many times. Kamradt's needle in a haystack and RULER (arXiv 2404.06654) map where in the window a model fails. Zhang and colleagues (arXiv 2605.23170) look at what the wrong answers are made of. NoLiMa (arXiv 2502.05167) showed that literal matching like mine holds much longer than tasks that need a step of inference. The Context Rot report from Chroma, July 2025, notes that Claude Sonnet 4 and Opus 4 tend to abstain when unsure. I wanted to check 2 things myself: how far from the target a miss lands and whether the refusal holds.

## The curve I expected

<figure class="fig">
<svg viewBox="0 0 640 390" role="img" aria-label="Heatmap of the share of correct answers, one row per model and object size, one column per depth from the first line to the last. qwen2.5 0.5b is low everywhere and highest in the last column: 62.5 percent on the last line against 28.1 on the first. qwen2.5 1.5b is 90 of 99 with scattered misses. haiku 4.5 is 100 in every cell except 2 cells on 6000 pairs.">
  <text x="12" y="16" class="f-label f-muted">share of correct answers by where the key sits in the object</text>
  <text x="150.0" y="38" text-anchor="middle" class="f-label f-muted">first line</text>
  <text x="378.0" y="38" text-anchor="middle" class="f-label f-muted">middle</text>
  <text x="606.0" y="38" text-anchor="middle" class="f-label f-muted">last line</text>
  <text x="12" y="62" class="f-label f-accent">qwen2.5 0.5b</text>
  <text x="12" y="81" class="f-mono f-ink">25 pairs</text>
  <rect x="128.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="150.0" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="174.3" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.77"/>
  <text x="195.6" y="81" text-anchor="middle" class="f-mono f-ink">75</text>
  <rect x="219.9" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="241.2" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="265.5" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="286.8" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="311.1" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="332.4" y="81" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="356.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="378.0" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="402.3" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="423.6" y="81" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="447.9" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="469.2" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="493.5" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="514.8" y="81" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="539.1" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="560.4" y="81" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="584.7" y="66" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="606.0" y="81" text-anchor="middle" class="f-mono f-ink">50</text>
  <text x="12" y="107" class="f-mono f-ink">50 pairs</text>
  <rect x="128.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="150.0" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="174.3" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="195.6" y="107" text-anchor="middle" class="f-mono f-ink">63</text>
  <rect x="219.9" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="241.2" y="107" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="265.5" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="286.8" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="311.1" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.54"/>
  <text x="332.4" y="107" text-anchor="middle" class="f-mono f-ink">50</text>
  <rect x="356.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="378.0" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="402.3" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="423.6" y="107" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="447.9" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="469.2" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="493.5" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="514.8" y="107" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="539.1" y="92" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="560.4" y="107" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="584.7" y="92" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="107" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="133" class="f-mono f-ink">100 pairs</text>
  <rect x="128.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="150.0" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="174.3" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="195.6" y="133" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="219.9" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="241.2" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="265.5" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="286.8" y="133" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="311.1" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="332.4" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="356.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="378.0" y="133" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="402.3" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="423.6" y="133" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="447.9" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="469.2" y="133" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="493.5" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="514.8" y="133" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="539.1" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="560.4" y="133" text-anchor="middle" class="f-mono f-ink">38</text>
  <rect x="584.7" y="118" width="42.6" height="20" class="f-box" fill-opacity="0.65"/>
  <text x="606.0" y="133" text-anchor="middle" class="f-mono f-ink">63</text>
  <text x="12" y="159" class="f-mono f-ink">200 pairs</text>
  <rect x="128.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.31"/>
  <text x="150.0" y="159" text-anchor="middle" class="f-mono f-ink">25</text>
  <rect x="174.3" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.20"/>
  <text x="195.6" y="159" text-anchor="middle" class="f-mono f-ink">13</text>
  <rect x="219.9" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="241.2" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="265.5" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="286.8" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="311.1" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="332.4" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="356.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="378.0" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="402.3" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="423.6" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="447.9" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="469.2" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="493.5" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="514.8" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="539.1" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.08"/>
  <text x="560.4" y="159" text-anchor="middle" class="f-mono f-ink">0</text>
  <rect x="584.7" y="144" width="42.6" height="20" class="f-box" fill-opacity="0.42"/>
  <text x="606.0" y="159" text-anchor="middle" class="f-mono f-ink">38</text>
  <text x="12" y="182" class="f-label f-accent">qwen2.5 1.5b</text>
  <text x="12" y="201" class="f-mono f-ink">25 pairs</text>
  <rect x="128.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="186" width="42.6" height="20" class="f-box" fill-opacity="0.39"/>
  <text x="514.8" y="201" text-anchor="middle" class="f-mono f-ink">33</text>
  <rect x="539.1" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="186" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="201" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="227" class="f-mono f-ink">50 pairs</text>
  <rect x="128.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="212" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="286.8" y="227" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="311.1" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="378.0" y="227" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="402.3" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="212" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="227" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="253" class="f-mono f-ink">100 pairs</text>
  <rect x="128.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="286.8" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="311.1" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="332.4" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="356.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="378.0" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="402.3" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="469.2" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="493.5" y="238" width="42.6" height="20" class="f-box" fill-opacity="0.69"/>
  <text x="514.8" y="253" text-anchor="middle" class="f-mono f-ink">67</text>
  <rect x="539.1" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="238" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="253" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="276" class="f-label f-accent">haiku 4.5</text>
  <text x="12" y="295" class="f-mono f-ink">500 pairs</text>
  <rect x="128.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="280" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="295" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="321" class="f-mono f-ink">2000 pairs</text>
  <rect x="128.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="306" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="321" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="347" class="f-mono f-ink">4000 pairs</text>
  <rect x="128.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="378.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="402.3" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="560.4" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="584.7" y="332" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="347" text-anchor="middle" class="f-mono f-ink">100</text>
  <text x="12" y="373" class="f-mono f-ink">6000 pairs</text>
  <rect x="128.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="150.0" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="174.3" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="195.6" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="219.9" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="241.2" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="265.5" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="286.8" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="311.1" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="332.4" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="356.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="0.89"/>
  <text x="378.0" y="373" text-anchor="middle" class="f-mono f-ink">88</text>
  <rect x="402.3" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="423.6" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="447.9" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="469.2" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="493.5" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="514.8" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
  <rect x="539.1" y="358" width="42.6" height="20" class="f-box" fill-opacity="0.89"/>
  <text x="560.4" y="373" text-anchor="middle" class="f-mono f-ink">88</text>
  <rect x="584.7" y="358" width="42.6" height="20" class="f-box" fill-opacity="1.00"/>
  <text x="606.0" y="373" text-anchor="middle" class="f-mono f-ink">100</text>
</svg>
<figcaption>Percent correct in each cell. qwen rows are 8 seeds per cell for 0.5b and 3 for 1.5b, haiku rows are 3 seeds on 500 and 2000 pairs and 8 on 4000 and 6000. The same object is used at every depth of a row, only the asked key moves. 6000 pairs is 95706 tokens of prompt.</figcaption>
</figure>

The 0.5B model fails already on the smallest size: at 25 pairs and 565 tokens it gets only 45 of 88 right. But the shape is not a U. Pooled over the 4 sizes, the last line is found 62.5 percent of the time and every other depth is lower, with no dip in the middle. The 1.5B model gets 90 of 99. Its misses sit somewhere between 30 and 80 percent depth and with 3 seeds per cell I cannot call that a shape.

Haiku got 243 of 245 and 3 of those calls were a first probe at 100 pairs. Both misses are on 6000 pairs, one in the middle and one at 90 percent. Every other cell on every size is 100. My first surprise there was about something else. The envelope reports 3 input tokens for these prompts and for some time I thought the object never reached the model. In fact the whole volume is counted in `cache_creation_input_tokens`.

## Where a miss lands

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 charts for qwen2.5 0.5b. Top: its 253 wrong answers by kind, 140 another value from the object, 71 the key itself, 24 NOT FOUND, 16 a value not in the object, 2 with no value. Bottom: for the 140 answers that were another value from the object, how many lines from the target that value sat, against a dashed line for a uniform pick among the other lines. 1 line after the target: 16 observed against 2.5 expected. 1 line before: 7 against 2.5. The 2 outer bars collect everything 6 or more lines away and are drawn on their own scale.">
  <text x="12" y="16" class="f-label f-muted">0.5b: what came back instead of the right value</text>
  <text x="44" y="43" text-anchor="end" class="f-mono f-ink">140</text>
  <rect x="52" y="32" width="300.0" height="13" class="f-box"/>
  <text x="360.0" y="43" class="f-label f-muted">another value from the object</text>
  <text x="44" y="63" text-anchor="end" class="f-mono f-ink">71</text>
  <rect x="52" y="52" width="152.1" height="13" class="f-box"/>
  <text x="212.1" y="63" class="f-label f-muted">the key itself</text>
  <text x="44" y="83" text-anchor="end" class="f-mono f-ink">24</text>
  <rect x="52" y="72" width="51.4" height="13" class="f-box"/>
  <text x="111.4" y="83" class="f-label f-muted">NOT FOUND</text>
  <text x="44" y="103" text-anchor="end" class="f-mono f-ink">16</text>
  <rect x="52" y="92" width="34.3" height="13" class="f-box"/>
  <text x="94.3" y="103" class="f-label f-muted">a value not in the object</text>
  <text x="44" y="123" text-anchor="end" class="f-mono f-ink">2</text>
  <rect x="52" y="112" width="4.3" height="13" class="f-box"/>
  <text x="64.3" y="123" class="f-label f-muted">no value</text>
  <text x="12" y="152" class="f-label f-muted">another value from the object: how many lines from the target</text>
  <rect x="60" y="179.6" width="34" height="52.4" class="f-box"/>
  <line x1="58" y1="162.0" x2="96" y2="162.0" class="f-line" stroke-dasharray="3 2"/>
  <text x="77" y="246" text-anchor="middle" class="f-mono f-ink">47</text>
  <text x="77" y="260" text-anchor="middle" class="f-label f-muted">≤-6</text>
  <rect x="116" y="227.6" width="34" height="4.4" class="f-box"/>
  <line x1="114" y1="221.3" x2="152" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="133" y="246" text-anchor="middle" class="f-mono f-ink">1</text>
  <text x="133" y="260" text-anchor="middle" class="f-label f-muted">-5</text>
  <rect x="158" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="156" y1="221.3" x2="194" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="175" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="175" y="260" text-anchor="middle" class="f-label f-muted">-4</text>
  <rect x="200" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="198" y1="221.3" x2="236" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="217" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="217" y="260" text-anchor="middle" class="f-label f-muted">-3</text>
  <rect x="242" y="205.8" width="34" height="26.3" class="f-box"/>
  <line x1="240" y1="221.1" x2="278" y2="221.1" class="f-line" stroke-dasharray="3 2"/>
  <text x="259" y="246" text-anchor="middle" class="f-mono f-ink">6</text>
  <text x="259" y="260" text-anchor="middle" class="f-label f-muted">-2</text>
  <rect x="284" y="201.4" width="34" height="30.6" class="f-box"/>
  <line x1="282" y1="221.1" x2="320" y2="221.1" class="f-line" stroke-dasharray="3 2"/>
  <text x="301" y="246" text-anchor="middle" class="f-mono f-ink">7</text>
  <text x="301" y="260" text-anchor="middle" class="f-label f-muted">-1</text>
  <rect x="326" y="162.0" width="34" height="70.0" class="f-box"/>
  <line x1="324" y1="221.3" x2="362" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="343" y="246" text-anchor="middle" class="f-mono f-ink">16</text>
  <text x="343" y="260" text-anchor="middle" class="f-label f-muted">+1</text>
  <rect x="368" y="197.0" width="34" height="35.0" class="f-box"/>
  <line x1="366" y1="221.3" x2="404" y2="221.3" class="f-line" stroke-dasharray="3 2"/>
  <text x="385" y="246" text-anchor="middle" class="f-mono f-ink">8</text>
  <text x="385" y="260" text-anchor="middle" class="f-label f-muted">+2</text>
  <rect x="410" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="408" y1="221.8" x2="446" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="427" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="427" y="260" text-anchor="middle" class="f-label f-muted">+3</text>
  <rect x="452" y="192.6" width="34" height="39.4" class="f-box"/>
  <line x1="450" y1="221.8" x2="488" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="469" y="246" text-anchor="middle" class="f-mono f-ink">9</text>
  <text x="469" y="260" text-anchor="middle" class="f-label f-muted">+4</text>
  <rect x="494" y="214.5" width="34" height="17.5" class="f-box"/>
  <line x1="492" y1="221.8" x2="530" y2="221.8" class="f-line" stroke-dasharray="3 2"/>
  <text x="511" y="246" text-anchor="middle" class="f-mono f-ink">4</text>
  <text x="511" y="260" text-anchor="middle" class="f-label f-muted">+5</text>
  <rect x="550" y="198.6" width="34" height="33.4" class="f-box"/>
  <line x1="548" y1="172.9" x2="586" y2="172.9" class="f-line" stroke-dasharray="3 2"/>
  <text x="567" y="246" text-anchor="middle" class="f-mono f-ink">30</text>
  <text x="567" y="260" text-anchor="middle" class="f-label f-muted">≥+6</text>
  <rect x="60" y="271" width="18" height="10" class="f-box"/>
  <text x="84" y="280" class="f-label f-muted">observed</text>
  <line x1="240" y1="276" x2="258" y2="276" class="f-line" stroke-dasharray="3 2"/>
  <text x="264" y="280" class="f-label f-muted">uniform pick among the other lines</text>
</svg>
<figcaption>Minus is earlier in the object, plus is later. Within 1 line of the target: 23 of 140, 16.4 percent, where a uniform pick gives 3.5. Median distance 7 lines against 36. The outer bars have their own scale.</figcaption>
</figure>

The 0.5B model gave 253 wrong answers and 227 of them look exactly like a correct one, 8 hex characters and nothing else. Only 24 were NOT FOUND about a key that was there. 71 were a key instead of a value, 65 of them some other key from the object. 140 were another value from the same object, so I checked how far from the target they sit. With a uniform pick among the other lines 3.5 percent of those values would come from a line right next to the target. It was 16.4 percent and the single most frequent wrong line is the one right after the target. The median distance is 7 lines against 36 for a uniform pick. So its wrong values mostly come from near the target line, but not from it. Haiku's 2 misses are too few to say anything.

## The key that was not there

<figure class="fig">
<svg viewBox="0 0 640 404" role="img" aria-label="Bars for the share of NOT FOUND answers when the asked key is absent, by model and object size, with prompt length in tokens. qwen2.5 0.5b stays between 0 and 20 percent. qwen2.5 1.5b answers NOT FOUND every time up to 100 pairs. haiku 4.5 answers NOT FOUND every time up to 2000 pairs, then 16/20 at 3000, 15/20 at 4000 and 8/20 at 6000 pairs. A control row of 1000 pairs with prose in front, 82360 tokens long, is 10/10.">
  <text x="12" y="16" class="f-label f-muted">the key is absent and NOT FOUND is allowed</text>
  <text x="140" y="34" class="f-label f-muted">tokens</text>
  <text x="250" y="34" class="f-label f-muted">0</text>
  <text x="580" y="34" text-anchor="end" class="f-label f-muted">100%</text>
  <line x1="580" y1="40" x2="580" y2="398" class="f-plain"/>
  <text x="12" y="55" class="f-label f-accent">qwen2.5 0.5b</text>
  <text x="12" y="73" class="f-mono f-ink">25 pairs</text>
  <text x="140" y="73" class="f-mono f-muted">565</text>
  <rect x="250" y="62" width="66.0" height="13" class="f-box"/>
  <text x="588.0" y="73" class="f-mono f-ink">4/20</text>
  <text x="12" y="93" class="f-mono f-ink">50 pairs</text>
  <text x="140" y="93" class="f-mono f-muted">1050</text>
  <rect x="250" y="82" width="1.5" height="13" class="f-box"/>
  <text x="588.0" y="93" class="f-mono f-ink">0/20</text>
  <text x="12" y="113" class="f-mono f-ink">100 pairs</text>
  <text x="140" y="113" class="f-mono f-muted">2006</text>
  <rect x="250" y="102" width="33.0" height="13" class="f-box"/>
  <text x="588.0" y="113" class="f-mono f-ink">2/20</text>
  <text x="12" y="133" class="f-mono f-ink">200 pairs</text>
  <text x="140" y="133" class="f-mono f-muted">3944</text>
  <rect x="250" y="122" width="33.0" height="13" class="f-box"/>
  <text x="588.0" y="133" class="f-mono f-ink">2/20</text>
  <text x="12" y="153" class="f-label f-accent">qwen2.5 1.5b</text>
  <text x="12" y="171" class="f-mono f-ink">25 pairs</text>
  <text x="140" y="171" class="f-mono f-muted">561</text>
  <rect x="250" y="160" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="171" class="f-mono f-ink">8/8</text>
  <text x="12" y="191" class="f-mono f-ink">50 pairs</text>
  <text x="140" y="191" class="f-mono f-muted">1054</text>
  <rect x="250" y="180" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="191" class="f-mono f-ink">8/8</text>
  <text x="12" y="211" class="f-mono f-ink">100 pairs</text>
  <text x="140" y="211" class="f-mono f-muted">2003</text>
  <rect x="250" y="200" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="211" class="f-mono f-ink">8/8</text>
  <text x="12" y="231" class="f-label f-accent">haiku 4.5</text>
  <text x="12" y="249" class="f-mono f-ink">100 pairs</text>
  <text x="140" y="249" class="f-mono f-muted">1862</text>
  <rect x="250" y="238" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="249" class="f-mono f-ink">10/10</text>
  <text x="12" y="269" class="f-mono f-ink">500 pairs</text>
  <text x="140" y="269" class="f-mono f-muted">8313</text>
  <rect x="250" y="258" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="269" class="f-mono f-ink">10/10</text>
  <text x="12" y="289" class="f-mono f-ink">1000 pairs</text>
  <text x="140" y="289" class="f-mono f-muted">16152</text>
  <rect x="250" y="278" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="289" class="f-mono f-ink">10/10</text>
  <text x="12" y="309" class="f-mono f-ink">2000 pairs</text>
  <text x="140" y="309" class="f-mono f-muted">32138</text>
  <rect x="250" y="298" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="309" class="f-mono f-ink">10/10</text>
  <text x="12" y="329" class="f-mono f-ink">3000 pairs</text>
  <text x="140" y="329" class="f-mono f-muted">48067</text>
  <rect x="250" y="318" width="264.0" height="13" class="f-box"/>
  <text x="588.0" y="329" class="f-mono f-ink">16/20</text>
  <text x="12" y="349" class="f-mono f-ink">4000 pairs</text>
  <text x="140" y="349" class="f-mono f-muted">63950</text>
  <rect x="250" y="338" width="247.5" height="13" class="f-box"/>
  <text x="588.0" y="349" class="f-mono f-ink">15/20</text>
  <text x="12" y="369" class="f-mono f-ink">6000 pairs</text>
  <text x="140" y="369" class="f-mono f-muted">95706</text>
  <rect x="250" y="358" width="132.0" height="13" class="f-box"/>
  <text x="588.0" y="369" class="f-mono f-ink">8/20</text>
  <text x="12" y="389" class="f-mono f-accent">1000 + prose</text>
  <text x="140" y="389" class="f-mono f-muted">82360</text>
  <rect x="250" y="378" width="330.0" height="13" class="f-box"/>
  <text x="588.0" y="389" class="f-mono f-ink">10/10</text>
</svg>
<figcaption>The last haiku row is the control: 1000 pairs with prose in front of them that contains no hex word, 82360 tokens in total, longer than the 4000 pair prompt at 63950. It keeps every refusal.</figcaption>
</figure>

This is where haiku changes. Up to 2000 pairs, about 32 thousand tokens, it answered NOT FOUND 40 times out of 40. After that the share goes down with size, to 8 of 20 at 6000 pairs. The other 12 at 6000 were 8 hex characters each: 8 values from the object and 4 that are not in it anywhere. The calling code has no way to see that it is a guess.

Some answers ignored "value only" and added text. This one is from 3000 pairs:

```
Looking through the provided JSON object, I can find:

"7c98d2eb": "69e27874"

69e27874
```

There is no key `7c98d2eb` in that object. `69e27874` is the value on its last line. The model quoted a line that does not exist, made of the key I asked about and a value from the end of the prompt. In the 3000 and 4000 series 17 answers came with text around them like this. 13 of them ended with NOT FOUND and 4 quoted a line that is not there. The other wrong answers in those series were bare hex.

In the grid the length and the number of keys grow together, so either could be the cause. The control is 1000 pairs with prose in front of them, prose without a single hex word, about 82 thousand tokens in total. That is longer than the 4000 pair prompt where 5 refusals of 20 were already lost. NOT FOUND came back 10 times out of 10 and with a present key the answer was right 5 of 5. So on this task length alone did not break the refusal, at least when the length sits in front of the data. The number of similar keys is the better suspect. The control is small, only 15 calls. Neither of the small models helps here. 0.5B said NOT FOUND 8 times of 80 on objects of 25 to 200 pairs and 1.5B said it 24 times of 24 up to 100 pairs.

## What I did not check

It is one task and it is literal. A rule in my manual that gets ignored is a question of instruction following. NoLiMa is a good reason to think instruction following breaks earlier than a lookup of a hex string, so this does not prove the file is fine. It only removes the easiest explanation. Haiku counts the file at about 25 thousand tokens, less than the 32 thousand token prompts where it never failed to refuse. But in a real session the file sits inside a much bigger context, next to the system prompt and the conversation.

Haiku is the only API model here and I did not go past 96 thousand tokens. The 500 and 2000 pair rows have only 3 seeds per depth, the 4000 and 6000 rows have 8. The 2 Qwen models ran at different precision and I did not check whether that matters.

What I take from it is a check in code. A value returned from a big table has to be looked up again in that table, under the key that was asked. Checking only that the value exists is not enough, the invented line above would pass it. The haiku calls behind these numbers cost about 45 dollars.
