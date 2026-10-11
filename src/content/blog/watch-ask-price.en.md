---
title: "My watch asks my laptop for $0 in API and every new question still costs 7 cents"
description: "The README of my watch app says one reply from the watch costs about $0.07 of subscription limit. I took it for the price of a cold start and measured it. 10 new questions cost $0.070 to $0.072 each and only a word for word repeat drops to about a cent, because every new question writes about 6,300 tokens to the one hour cache at double price. Without Claude Code's tools a new question costs $0.009."
date: 2026-10-11
lang: en
translationKey: watch-ask-price
tags: ["llm", "agents"]
---
`watch-ask` has been public since August. It is a Galaxy Watch app plus a small Node server. I press a button and say a question. The watch recognises the words on the device and posts the text to my own machine, where headless Claude Code answers. In the README I wrote "$0 in API". Under it I added that on my setup a single reply consumed roughly $0.07 of subscription limit and pulled about 27k tokens of context.

That sentence came from one reply. I looked at the log line, saw 7 cents, wrote it down and moved on. My silent assumption was that this was the price of a cold start and the prompt cache would make the next questions almost free. I never checked it, so this week I did.

## The setup

The server is the public repository at commit `edc8cae`, on Node 22.23.1, with all 43 of its tests passing. The backend is the default `claude-cli` adapter, which runs `claude -p --output-format json` with the question on stdin. I ran Claude Code 2.1.292 with model `claude-opus-5` and permission mode `default`.

There is no watch on this machine. A script asks the way the watch app does: `POST /ask?mode=async`, then `GET /result/<id>` every 2000 ms, which is `POLL_INTERVAL_MS` in `MainActivity.kt`. The server only logs the dollar figure and I wanted the tokens. So I put a small wrapper in `ASK_CLAUDE_BIN` that runs the real CLI and keeps a copy of its JSON envelope. On this node the CLI itself runs on another machine over ssh. That adds 0.29 s to every call at the watch, but not inside the CLI time.

The dollar figure is what the CLI reports in `total_cost_usd`. On a subscription nobody bills it, it is spent from the usage limit. I have no other number for that limit.

## The second pass and a wrong conclusion

The first pass asked 10 questions. 5 were general, like "What does HTTP status 502 mean?". The other 5 were about the repository, like "How many tests does the server have?". The general ones cost $0.07 each, the first one $0.096. Then I ran the same 10 again and the general ones dropped to $0.010 to $0.014.

The warm price was a seventh of the README number. I had that sentence half written before I looked at what the second pass actually asked. It asked the same questions, word for word. The cache matched the whole prompt including the question. I do not ask my watch the same thing twice in an hour.

So I needed questions the model has not seen. I wrote 10 new general questions and asked each one twice.

<figure class="fig">
<svg viewBox="0 0 640 178" role="img" aria-label="Dot plot on a dollar axis from 0 to 0.10. 15 questions asked for the first time cost from $0.070 to $0.096, median $0.071; the highest is the first call of the run. The same 15 questions asked again word for word cost from $0.010 to $0.014, median $0.011.">
  <text x="10" y="16" class="f-label f-muted">what one general question costs, by the CLI's own count, Claude Opus 5</text>
  <line x1="200.0" y1="34" x2="200.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="200.0" y="154" text-anchor="middle" class="f-label f-muted">$0.00</text>
  <line x1="282.0" y1="34" x2="282.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="282.0" y="154" text-anchor="middle" class="f-label f-muted">$0.02</text>
  <line x1="364.0" y1="34" x2="364.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="364.0" y="154" text-anchor="middle" class="f-label f-muted">$0.04</text>
  <line x1="446.0" y1="34" x2="446.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="446.0" y="154" text-anchor="middle" class="f-label f-muted">$0.06</text>
  <line x1="528.0" y1="34" x2="528.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="528.0" y="154" text-anchor="middle" class="f-label f-muted">$0.08</text>
  <line x1="610.0" y1="34" x2="610.0" y2="138" class="f-line" stroke-dasharray="3 3"/>
  <text x="610.0" y="154" text-anchor="middle" class="f-label f-muted">$0.10</text>
  <text x="188" y="60" text-anchor="end" class="f-mono f-ink">asked for the first time</text>
  <circle cx="594.5" cy="48" r="4" style="fill:var(--accent)"/>
  <circle cx="494.1" cy="52" r="4" style="fill:var(--accent)"/>
  <circle cx="490.3" cy="56" r="4" style="fill:var(--accent)"/>
  <circle cx="487.9" cy="60" r="4" style="fill:var(--accent)"/>
  <circle cx="500.0" cy="64" r="4" style="fill:var(--accent)"/>
  <circle cx="487.8" cy="48" r="4" style="fill:var(--accent)"/>
  <circle cx="493.5" cy="52" r="4" style="fill:var(--accent)"/>
  <circle cx="491.2" cy="56" r="4" style="fill:var(--accent)"/>
  <circle cx="491.8" cy="60" r="4" style="fill:var(--accent)"/>
  <circle cx="493.6" cy="64" r="4" style="fill:var(--accent)"/>
  <circle cx="494.3" cy="48" r="4" style="fill:var(--accent)"/>
  <circle cx="491.0" cy="52" r="4" style="fill:var(--accent)"/>
  <circle cx="494.0" cy="56" r="4" style="fill:var(--accent)"/>
  <circle cx="491.7" cy="60" r="4" style="fill:var(--accent)"/>
  <circle cx="489.4" cy="64" r="4" style="fill:var(--accent)"/>
  <line x1="491.8" y1="42" x2="491.8" y2="70" class="f-line" style="stroke:var(--ink)" stroke-width="2"/>
  <text x="491.8" y="38" text-anchor="middle" class="f-mono f-ink">$0.071</text>
  <text x="188" y="114" text-anchor="end" class="f-mono f-ink">same words, asked again</text>
  <circle cx="241.9" cy="102" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="247.2" cy="106" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="242.6" cy="110" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="241.8" cy="114" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="257.2" cy="118" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="243.7" cy="102" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="248.2" cy="106" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="246.1" cy="110" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="245.6" cy="114" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="247.1" cy="118" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="247.9" cy="102" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="244.5" cy="106" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="250.3" cy="110" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="246.4" cy="114" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <circle cx="245.1" cy="118" r="4" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <line x1="246.1" y1="96" x2="246.1" y2="124" class="f-line" style="stroke:var(--ink)" stroke-width="2"/>
  <text x="246.1" y="92" text-anchor="middle" class="f-mono f-ink">$0.011</text>
  <line x1="594.5" y1="54" x2="594.5" y2="78" class="f-line" style="stroke:var(--accent)"/>
  <text x="598.5" y="90" text-anchor="end" class="f-label f-muted">first call of the run $0.096</text>
</svg>
<figcaption>Default server setup: the CLI adapter with all Claude Code tools, CLI 2.1.292. Each dot is one call through the server, as the watch asks.</figcaption>
</figure>

All 10 new questions landed between $0.0702 and $0.0718. Their repeats landed between $0.0107 and $0.0123. The envelope shows why. Every general question carries about 20,000 tokens of context before the question starts. About 13,700 of them come from the cache every time. The rest, between 6,317 and 6,330 tokens per new question, is written to the cache again. Only an exact repeat reads it back.

Writing to the cache is the expensive part. The first call gives the price. $0.0962 minus 10,959 cached tokens at $0.50 per million, minus 8 output tokens, leaves $0.0905 for 9,052 written tokens. That is $10 per million, twice the $5 input price of Opus 5. In the envelope these tokens are counted under `ephemeral_1h_input_tokens`, so the CLI writes to the one hour cache. About 6,300 tokens are written this way for every new question and no later question reads them.

Why the CLI rewrites 6,300 tokens and not only the question, I don't know. My guess is that the CLI puts some context of its own after the last cache point, next to the question. Then it is new for every question. With tools cut down the rewrite also shrinks to about 700 tokens, which fits, but I did not verify it. So the 7 cents from the README is what every new question costs.

## Where the 20,000 tokens come from

Most of it goes away together with the tools. On this machine the CLI also lists 13 skills and the installed plugins. So part of the 20,000 is my setup and not Claude Code itself. I did not split the two. I asked 5 new general questions straight through the CLI with the same system prompt and `--tools ""`.

<figure class="fig">
<svg viewBox="0 0 640 198" role="img" aria-label="all tools (default): 13,689 tokens read from cache, 6,322 written, median $0.071 per new question. Read, Grep, Glob: 5,550 tokens read from cache, 773 written, median $0.011 per new question. no tools: 3,080 tokens read from cache, 704 written, median $0.009 per new question.">
  <text x="10" y="16" class="f-label f-muted">context of one new general question, tokens</text>
  <text x="240" y="56" text-anchor="end" class="f-mono f-ink">all tools (default)</text>
  <rect x="250" y="44" width="176.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426.0" y="44" width="81.3" height="18" style="fill:var(--accent)"/>
  <text x="513.3" y="57" class="f-mono f-ink">20,011, $0.071</text>
  <text x="240" y="94" text-anchor="end" class="f-mono f-ink">Read, Grep, Glob</text>
  <rect x="250" y="82" width="71.4" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="321.4" y="82" width="9.9" height="18" style="fill:var(--accent)"/>
  <text x="337.3" y="95" class="f-mono f-ink">6,323, $0.011</text>
  <text x="240" y="132" text-anchor="end" class="f-mono f-ink">no tools</text>
  <rect x="250" y="120" width="39.6" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="289.6" y="120" width="9.0" height="18" style="fill:var(--accent)"/>
  <text x="304.6" y="133" class="f-mono f-ink">3,784, $0.009</text>
  <rect x="250" y="176" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.3"/><text x="268" y="186" class="f-label f-ink">read from cache</text>
  <rect x="391" y="176" width="12" height="12" style="fill:var(--accent)"/><text x="409" y="186" class="f-label f-ink">written to cache</text>
</svg>
<figcaption>Medians of new general questions after the first call. Writing to the cache costs 20 times more per token than reading from it.</figcaption>
</figure>

Without tools the context shrinks to about 3,800 tokens and a new question writes about 700. After the first call that is $0.009 to $0.010. A general question from the watch does not need tools. A question about my code does, so I tried a narrower set, `--tools "Read,Grep,Glob"`. The context was about 6,300 tokens and a new general question cost $0.011 to $0.012. 2 questions about the repository cost $0.073 and $0.098. Both answers were right.

The adapter cannot do this today. It passes `--allowed-tools` from `ASK_CLAUDE_ALLOWED_TOOLS`. That flag only decides what may run without asking. The model is still told about every tool, because `--tools` is never passed. That is the line I would add, with a default of read only tools.

## The questions about code

All 10 answers were right. I checked them against the code. The port is 8787 and a wrong token gets a 401. After 300 seconds the watch gives up. There are 43 tests, split 14, 11, 10 and 8 between the test files. The last commit adds `CITATION.cff`. They took 2 to 7 turns and $0.05 to $0.21, median $0.12.

In 4 of the 10 calls the model tried Bash and permission mode `default` refused it. It went back to reading files and still answered correctly, which the README promises. I had not seen it happen before.

The polling adds time on the wrist. A general question took a median 2.1 s inside the CLI. The script had the answer after 6 s, because the watch only asks every 2 seconds. The `echo` adapter, which answers instantly, came back in 2.0 to 2.06 s every time. A question about code took a median 8.6 s in the CLI and 12 s at the watch. The README describes the answer arriving 15 seconds later. For 7 of these 10 questions that holds, the other 3 took 16 to 18 s. That is before speech recognition and the voice on a real watch.

## What I did not check

The watch itself. I did not test recognition, the restarted listening segments, error 11 at the start of a session or the voice reading the reply aloud. I only read that code. My README number was 27k tokens and here it is 20k. My guess is a different machine with a different set of skills and plugins, but I did not measure that machine. I don't know how $0.07 of CLI dollars maps to the weekly limit. I started a run with pauses of 10 and 60 seconds between questions and stopped it after 2 calls. A one hour cache stays warm through pauses that short. What a question costs after more than an hour of silence, which is the usual case on a walk, is still open.

In the README the "$0 in API" line can stay, the money really is zero. The sentence under it needs rewriting, to say 7 cents per new question and where they go.
