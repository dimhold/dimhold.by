---
title: "Claude wrote a correct invoice program 19 times out of 19, then made up what it printed"
description: "I always say that money is counted by a deterministic engine and the model only talks, but I never measured the invoice half. On Polish VAT invoices Claude Opus 5 without tools was exact to the grosz in 18 of 20 at 5 lines and 19 of 20 at 40 lines when told to count by hand. Every wrong answer still added up. Without that instruction it wrote a program in 18 of 20 answers. All 19 programs it wrote were right and in 9 answers it invented what the program printed."
date: 2026-10-10
lang: en
translationKey: engine-cents
tags: ["llm", "numbers"]
---
When someone asks me where a language model belongs next to money, I answer with one sentence. The totals come from a deterministic engine and the model only talks about them. On 8 October I measured the forecast side of that split. The invoice side I never measured at all, I just repeated it, so this time I took an invoice.

## The setup

I live in Warsaw, so the invoice is a Polish VAT invoice. Every line has a quantity, a net unit price in złoty, a discount and a VAT rate of 23, 8, 5 or 0 percent. The rule is written in the prompt. Each line net is rounded to the grosz half up. Then the lines are grouped by rate, VAT is taken from the sum of each group and rounded again. Gross is net plus VAT.

The engine is about 20 lines of Python 3.12.3 with `decimal` and `ROUND_HALF_UP`. 10,000 invoices of 40 lines take from 0.83 to 1.18 seconds, about 0.1 ms per invoice. 3 repeats give the same hash of all results.

The model is `claude-opus-5` through Claude Code 2.1.292, started from an empty folder with no tools and no MCP servers. With a fixed seed I generated 10 invoices of 5 lines, 10 of 15 lines and 10 of 40. Every invoice went to the model 2 times. The answer had to be one line of JSON with the 3 totals. A match means net, VAT and gross all equal the engine to the grosz.

Before counting I wrote down what I expected. At 5 lines the model is exact in at least 9 of 10. At 40 lines it is exact in fewer than 7 of 10 and the 2 runs of the same invoice disagree at least once.

The idea that code counts better than the model is old and not mine. PAL and Program of Thoughts in 2022 moved the arithmetic out of the model into a program. I had just never seen it on an invoice.

## Small invoices

At 5 lines the model was exact 9 times in each run. At 15 lines it was 9 and 10. The misses were small. One invoice was off by 5 grosz and another by 85 grosz. The third was off by exactly 1.00 złoty net, which moved VAT by 8 grosz.

What bothers me more than the size is that every wrong answer was consistent with itself. Net plus VAT equals gross in all of them, to the grosz. The first check I would write adds up the 3 totals. It passes every one of these.

## 40 lines, the answer I did not ask for

At 40 lines I got 2 JSON answers of 20. Both were exact. The other 18 were a Python program with `Decimal`. Some came as a bash code block and some as a call to a Bash tool the model did not have. I had not planned for that at all. So I stopped and wrote down a new rule before counting further: take each program out of the answer and run it.

There were 19 such programs in the whole run, 18 here and 1 more from another part of the experiment. I ran each with `python3 -I` in an empty temporary folder. All 19 printed the right totals to the grosz.

Then I read further down the answers. In 10 of the 19 the model did not stop at the program and wrote the tool output itself. 9 times it was numbers, 3 of them under a heading `Tool Result`. Once it was just `<redacted>`. None of the 9 matched the right totals or even what its own program prints. On one invoice the program prints net 739,434.56 and the invented output under it says 58,923.85. Another invoice got 2 different invented outputs in the 2 runs, 995,552.96 and 1,304,665.13, while the right net is 962,434.28.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="Dot plot of 9 invoices of 40 lines. For each, the net total its own program prints, which equals the right total, and the net the model wrote as if the tool had answered. Run 1, invoice 0: program 962,434.28, written 995,552.96. Run 1, invoice 6: program 634,763.20, written 710,176.19. Run 2, invoice 0: program 962,434.28, written 1,304,665.13. Run 2, invoice 1: program 724,844.42, written 368,319.24. Run 2, invoice 3: program 843,126.24, written 1,448,668.85. Run 2, invoice 4: program 739,434.56, written 58,923.85. Run 2, invoice 5: program 759,314.37, written 861,885.72. Run 2, invoice 7: program 664,085.65, written 1,188,622.57. Run 2, invoice 8: program 888,420.29, written 1,403,374.42. None of the 9 written values matches.">
  <text x="10" y="16" class="f-label f-muted">net total in złoty: what the model's program prints and what the model said it printed</text>
  <circle cx="176" cy="36" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/><text x="186" y="40" class="f-label f-ink">its program prints (= right total)</text>
  <circle cx="176" cy="52" r="5" style="fill:var(--accent)"/><text x="186" y="56" class="f-label f-ink">the model wrote as the output</text>
  <line x1="170.0" y1="58" x2="170.0" y2="262" class="f-plain"/>
  <text x="170.0" y="278" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="316.7" y1="58" x2="316.7" y2="262" class="f-plain"/>
  <text x="316.7" y="278" text-anchor="middle" class="f-label f-muted">500,000</text>
  <line x1="463.3" y1="58" x2="463.3" y2="262" class="f-plain"/>
  <text x="463.3" y="278" text-anchor="middle" class="f-label f-muted">1,000,000</text>
  <line x1="610.0" y1="58" x2="610.0" y2="262" class="f-plain"/>
  <text x="610.0" y="278" text-anchor="middle" class="f-label f-muted">1,500,000</text>
  <text x="160" y="76" text-anchor="end" class="f-mono f-ink">run 1, invoice 0</text>
  <line x1="452.3" y1="72" x2="462.0" y2="72" class="f-line"/>
  <circle cx="452.3" cy="72" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="462.0" cy="72" r="5" style="fill:var(--accent)"/>
  <text x="160" y="98" text-anchor="end" class="f-mono f-ink">run 1, invoice 6</text>
  <line x1="356.2" y1="94" x2="378.3" y2="94" class="f-line"/>
  <circle cx="356.2" cy="94" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="378.3" cy="94" r="5" style="fill:var(--accent)"/>
  <text x="160" y="120" text-anchor="end" class="f-mono f-ink">run 2, invoice 0</text>
  <line x1="452.3" y1="116" x2="552.7" y2="116" class="f-line"/>
  <circle cx="452.3" cy="116" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="552.7" cy="116" r="5" style="fill:var(--accent)"/>
  <text x="160" y="142" text-anchor="end" class="f-mono f-ink">run 2, invoice 1</text>
  <line x1="382.6" y1="138" x2="278.0" y2="138" class="f-line"/>
  <circle cx="382.6" cy="138" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="278.0" cy="138" r="5" style="fill:var(--accent)"/>
  <text x="160" y="164" text-anchor="end" class="f-mono f-ink">run 2, invoice 3</text>
  <line x1="417.3" y1="160" x2="594.9" y2="160" class="f-line"/>
  <circle cx="417.3" cy="160" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="594.9" cy="160" r="5" style="fill:var(--accent)"/>
  <text x="160" y="186" text-anchor="end" class="f-mono f-ink">run 2, invoice 4</text>
  <line x1="386.9" y1="182" x2="187.3" y2="182" class="f-line"/>
  <circle cx="386.9" cy="182" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="187.3" cy="182" r="5" style="fill:var(--accent)"/>
  <text x="160" y="208" text-anchor="end" class="f-mono f-ink">run 2, invoice 5</text>
  <line x1="392.7" y1="204" x2="422.8" y2="204" class="f-line"/>
  <circle cx="392.7" cy="204" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="422.8" cy="204" r="5" style="fill:var(--accent)"/>
  <text x="160" y="230" text-anchor="end" class="f-mono f-ink">run 2, invoice 7</text>
  <line x1="364.8" y1="226" x2="518.7" y2="226" class="f-line"/>
  <circle cx="364.8" cy="226" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="518.7" cy="226" r="5" style="fill:var(--accent)"/>
  <text x="160" y="252" text-anchor="end" class="f-mono f-ink">run 2, invoice 8</text>
  <line x1="430.6" y1="248" x2="581.7" y2="248" class="f-line"/>
  <circle cx="430.6" cy="248" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="581.7" cy="248" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>The model had no tools. All 19 programs it wrote print the right totals when run. In 10 answers it also wrote the output itself, 9 times as numbers and once as &lt;redacted&gt;.</figcaption>
</figure>

For a while I believed 9 of these answers had no code at all. My first extractor found programs in only 10 of the 19 and marked the rest as "no code". The model had wrapped the same program in 3 different formats and I had not expected more than one.

## Told to count by hand

So I sent the same 10 invoices of 40 lines 2 more times with one more sentence in the prompt: "You have no tools and cannot run code. Compute the totals yourself."

It was exact in 10 of 10 in the first run and 9 of 10 in the second. My guess of fewer than 7 is wrong. The one miss is also not about rounding. The model left out row 27 completely, 40 units at 2,462.10 with 15% discount, so net is lower by 83,711.40 and VAT by 19,253.63.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Grid of 8 rows by 10 invoices. 5 lines: exact in 9 and 9 of 10, misses of 5 and 85 grosz net. 15 lines: exact in 9 and 10, one miss of 1.00 złoty net. 40 lines: 18 of 20 answers are a program instead of numbers, the 2 numeric answers are exact. 40 lines with code forbidden: exact in 10 and 9, the miss leaves out row 27.">
  <text x="10" y="16" class="f-label f-muted">10 invoices per size, 2 runs each: exact to the grosz or not</text>
  <text x="180" y="50" text-anchor="end" class="f-mono f-ink">5 lines, run 1</text>
  <rect x="192" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="38" width="20" height="18" style="fill:var(--accent)"/>
  <rect x="426" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="458" y="50" class="f-label f-accent">net −0.05</text>
  <text x="180" y="74" text-anchor="end" class="f-mono f-ink">5 lines, run 2</text>
  <rect x="192" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="62" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="74" class="f-label f-accent">net −0.85</text>
  <text x="180" y="98" text-anchor="end" class="f-mono f-ink">15 lines, run 1</text>
  <rect x="192" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="86" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="98" class="f-label f-accent">net +1.00</text>
  <text x="180" y="122" text-anchor="end" class="f-mono f-ink">15 lines, run 2</text>
  <rect x="192" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="146" text-anchor="end" class="f-mono f-ink">40 lines, run 1</text>
  <rect x="192" y="134" width="20" height="18" class="f-box"/><text x="202" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="134" width="20" height="18" class="f-box"/><text x="228" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="134" width="20" height="18" class="f-box"/><text x="254" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="270" y="134" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="134" width="20" height="18" class="f-box"/><text x="306" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="134" width="20" height="18" class="f-box"/><text x="332" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="134" width="20" height="18" class="f-box"/><text x="358" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="134" width="20" height="18" class="f-box"/><text x="384" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="134" width="20" height="18" class="f-box"/><text x="410" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="134" width="20" height="18" class="f-box"/><text x="436" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="170" text-anchor="end" class="f-mono f-ink">40 lines, run 2</text>
  <rect x="192" y="158" width="20" height="18" class="f-box"/><text x="202" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="158" width="20" height="18" class="f-box"/><text x="228" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="158" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="158" width="20" height="18" class="f-box"/><text x="280" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="296" y="158" width="20" height="18" class="f-box"/><text x="306" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="158" width="20" height="18" class="f-box"/><text x="332" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="158" width="20" height="18" class="f-box"/><text x="358" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="158" width="20" height="18" class="f-box"/><text x="384" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="158" width="20" height="18" class="f-box"/><text x="410" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="158" width="20" height="18" class="f-box"/><text x="436" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="200" text-anchor="end" class="f-mono f-accent">40, no code, run 1</text>
  <rect x="192" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="224" text-anchor="end" class="f-mono f-accent">40, no code, run 2</text>
  <rect x="192" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="212" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="224" class="f-label f-accent">row 27 left out</text>
  <rect x="190" y="242" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.3"/><text x="208" y="252" class="f-label f-ink">exact</text>
  <rect x="265" y="242" width="12" height="12" style="fill:var(--accent)"/><text x="283" y="252" class="f-label f-ink">wrong</text>
  <rect x="340" y="242" width="12" height="12" class="f-box"/><text x="358" y="252" class="f-label f-ink">program instead of numbers</text>
</svg>
<figcaption>Claude Opus 5 without tools, the rule named in the prompt. In every wrong answer net plus VAT still equals gross.</figcaption>
</figure>

A median call took 42.9 seconds and $0.11, with about 4,000 thinking tokens. At 5 lines it was 13.6 seconds and $0.024. The engine does the same 40 line invoice in about 0.1 ms. All 100 calls of this measurement cost $5.71.

<figure class="fig">
<svg viewBox="0 0 640 184" role="img" aria-label="Horizontal bars on a log scale of seconds. The Decimal code takes about 0.1 ms for a 40 line invoice. The model takes a median 13.6 seconds and $0.024 for 5 lines, 19.6 seconds and $0.045 for 15 lines, 42.9 seconds and $0.11 for 40 lines with code forbidden.">
  <text x="10" y="16" class="f-label f-muted">time per invoice, log scale</text>
  <line x1="330.0" y1="30" x2="330.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="330.0" y="170" text-anchor="middle" class="f-label f-muted">1 ms</text>
  <line x1="450.0" y1="30" x2="450.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="450.0" y="170" text-anchor="middle" class="f-label f-muted">1 s</text>
  <line x1="521.1" y1="30" x2="521.1" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="521.1" y="170" text-anchor="middle" class="f-label f-muted">1 min</text>
  <text x="240" y="49" text-anchor="end" class="f-mono f-ink">Decimal code, 40 lines</text>
  <rect x="250" y="37" width="36.7" height="16" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="289.7" y="35" width="104.4" height="20" style="fill:var(--surface)"/>
  <text x="292.7" y="49" class="f-mono f-ink">about 0.1 ms</text>
  <text x="240" y="79" text-anchor="end" class="f-mono f-ink">model, 5 lines</text>
  <rect x="250" y="67" width="245.3" height="16" style="fill:var(--accent)"/>
  <rect x="498.3" y="65" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="501.3" y="79" class="f-mono f-ink">13.6 s, $0.024</text>
  <text x="240" y="109" text-anchor="end" class="f-mono f-ink">model, 15 lines</text>
  <rect x="250" y="97" width="251.7" height="16" style="fill:var(--accent)"/>
  <rect x="504.7" y="95" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="507.7" y="109" class="f-mono f-ink">19.6 s, $0.045</text>
  <text x="240" y="139" text-anchor="end" class="f-mono f-ink">model, 40 lines, no code</text>
  <rect x="250" y="127" width="265.3" height="16" style="fill:var(--accent)"/>
  <rect x="518.3" y="125" width="112.6" height="20" style="fill:var(--surface)"/>
  <text x="521.3" y="139" class="f-mono f-ink">42.9 s, $0.11</text>
</svg>
<figcaption>Model: median of 20 calls each, cost as reported by the CLI. Decimal code: 10,000 invoices of 40 lines in 0.83 to 1.18 s, Python 3.12.3.</figcaption>
</figure>

## When I did not name the rule

My other guess was about rounding. I gave 10 invoices of 15 lines without the rule, only "to the grosz". I expected the model to switch between rounding VAT per line, per rate or only at the end.

It did not switch. 18 of 20 answers were numbers and all 18 match VAT taken from the sum per rate. Per line and per rate give different totals in 4 of these 10 invoices. In those 4 the model chose per rate both times. In one answer it called this "standard Polish practice". The other 2 answers were a plan and a program. The program was right too.

## What I take from it

I was ready to write that the model cannot count an invoice. It can, in 19 of 20 cases at 40 lines when told to count. Its code was right every time. A wrong total that still adds up gets past my first check. A tool result that nobody ran looks like proof and is not. So my totals still come from the Decimal code.

## What I did not check

I tested 1 model with 2 runs per invoice and the invoices are synthetic. There were no credit notes or foreign currency and nothing scanned from paper. The model never got a real tool, so I know its programs are right but not what it does with a real result. I also did not set the thinking budget myself and did not read the thinking, so I do not know where row 27 got lost.
