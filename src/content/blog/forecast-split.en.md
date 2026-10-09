---
title: "Claude forecast as well as ETS. When it explained the forecast, it invented a calendar"
description: "60 monthly M4 series, 18 months ahead. Claude Opus 5 without tools matched AutoETS on median MASE and beat it on 30 and 32 of 60, but 2 runs of the same input disagreed on the winner in 10 series. Explaining an AutoETS forecast from the raw series, it got 5.1% of claims wrong or invented, mostly a calendar the input never had. With a table of facts computed by software it was 0.5%."
date: 2026-10-08
lang: en
translationKey: forecast-split
tags: ["llm", "statistics"]
---
When someone asks me how to put a language model next to financial numbers, I give the same split every time. Software counts the forecast and the model explains it in words. It sounds reasonable and I have said it many times, but I never measured either half.

## The setup

For the forecast half I took M4, the public forecasting competition from 2018, with its monthly series. I picked 60 series at random with a fixed seed, 20 from each of 3 M4 categories. From every series I kept the last 72 months as history and asked for 18 months ahead, which is the M4 horizon for monthly data.

The software is statsforecast 2.1.1 on Python 3.12 with seasonal naive (the same month last year), AutoETS and AutoTheta. All 180 software forecasts took 4.8 seconds. The model is `claude-opus-5` through Claude Code 2.1.292, started with no tools and no MCP servers. It could not run code or read files and had to do everything in its head. It got the 72 numbers and had to answer with 18 numbers plus a line `TOTAL:` with the sum of its own 18. I ran every series 2 times. The first pass died after 45 series on an empty answer from the CLI. I finished it later with the same script.

Others measured this long before me. Gruver and coauthors showed in 2023 that GPT-3 and LLaMA 2 forecast series without any training about as well as specialised models. In 2024 Tan and coauthors removed the language model from 3 popular LLM forecasting methods. The results did not get worse, in most cases better. I only wanted to see it on numbers I counted myself.

Before counting I wrote down my guesses. AutoETS beats the model on more than half of the series. The `TOTAL` line is off from the model's own numbers in at least 1 answer of 10. 2 runs of one series differ by at least 1% in the sum of 18 months. For the explanations I expected at least 10% wrong claims.

I score with MASE, the forecast error divided by the error of "same month last year" on the history. Below 1 means better than that naive rule.

## My guesses about the forecast were wrong

<figure class="fig">
<svg viewBox="0 0 640 236" role="img" aria-label="Horizontal bars of median MASE on 60 monthly M4 series. Seasonal naive 1.072, AutoETS 0.789, AutoTheta 0.734, Claude first run 0.795, Claude second run 0.727. Claude is better than AutoETS on 30 of 60 series in the first run and 32 in the second.">
  <text x="10" y="16" class="f-label f-muted">median MASE on 60 M4 monthly series, lower is better</text>
  <line x1="358.3" y1="32" x2="358.3" y2="206" class="f-line" stroke-dasharray="3 3"/>
  <text x="140" y="52" text-anchor="end" class="f-mono f-ink">seasonal naive</text>
  <rect x="150" y="39" width="223.3" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="376.3" y="38" width="46" height="20" style="fill:var(--surface)"/>
  <text x="379.3" y="52" class="f-mono f-ink">1.072</text>
  <text x="140" y="86" text-anchor="end" class="f-mono f-ink">AutoETS</text>
  <rect x="150" y="73" width="164.5" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="317.5" y="72" width="46" height="20" style="fill:var(--surface)"/>
  <text x="320.5" y="86" class="f-mono f-ink">0.789</text>
  <text x="140" y="120" text-anchor="end" class="f-mono f-ink">AutoTheta</text>
  <rect x="150" y="107" width="153.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="306.0" y="106" width="46" height="20" style="fill:var(--surface)"/>
  <text x="309.0" y="120" class="f-mono f-ink">0.734</text>
  <text x="140" y="154" text-anchor="end" class="f-mono f-accent">Claude, run 1</text>
  <rect x="150" y="141" width="165.7" height="18" style="fill:var(--accent)"/>
  <rect x="318.7" y="140" width="46" height="20" style="fill:var(--surface)"/>
  <text x="321.7" y="154" class="f-mono f-ink">0.795</text>
  <text x="420" y="154" class="f-label f-muted">better than AutoETS on 30 of 60</text>
  <text x="140" y="188" text-anchor="end" class="f-mono f-accent">Claude, run 2</text>
  <rect x="150" y="175" width="151.4" height="18" style="fill:var(--accent)"/>
  <rect x="304.4" y="174" width="46" height="20" style="fill:var(--surface)"/>
  <text x="307.4" y="188" class="f-mono f-ink">0.727</text>
  <text x="420" y="188" class="f-label f-muted">better than AutoETS on 32 of 60</text>
  <text x="358.3" y="222" text-anchor="middle" class="f-label f-muted">1 = same month last year</text>
</svg>
<figcaption>72 months of history, 18 months ahead, true values from the M4 test file. statsforecast 2.1.1, Claude Opus 5 without tools.</figcaption>
</figure>

The median MASE of the model was 0.795 in the first run and 0.727 in the second. AutoETS got 0.789, AutoTheta 0.734 and seasonal naive 1.072. The model was better than AutoETS on 30 series of 60 in the first run and on 32 in the second. That is about a coin flip.

`TOTAL` matched the sum of the 18 numbers in all 120 answers, to the decimal. A median answer had about 3600 output tokens and almost all of them were thinking. I did not read it, so I can only guess that the adding happened there.

I was quite sure about the first guess and it is gone. By median MASE on 60 random series of one public dataset the model forecasts at the level of the standard methods. By median sMAPE it is a bit worse, 5.56 and 5.49 against 4.88 for AutoETS. It is also uneven by category: on the 20 Industry series its median MASE is 0.99 and 0.98 against 0.85 for AutoETS.

## Where it still differs from software

The 2 runs of one series differ less than I expected. The median difference of the 18 month sum is 0.51%, the largest 6.8%. But in 10 series of 60 the 2 runs disagree on whether they beat AutoETS. Here is the series with the largest difference:

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Line chart of series M16482. The last 24 months of history fall from about 2070 to 1540. AutoETS forecasts a flat 1534.2 for 18 months, MASE 0.806. Claude's first run stays around 1430 to 1690, MASE 0.789, and beats AutoETS. The second run on the same input goes lower, around 1395 to 1600, MASE 0.950, and loses. The actual values rise from 1534 to 2712 in month 12.">
  <text x="10" y="16" class="f-label f-muted">series M16482: the last 24 months, then 18 months ahead</text>
  <line x1="50" y1="230.0" x2="620" y2="230.0" class="f-plain"/>
  <text x="44" y="234.0" text-anchor="end" class="f-label f-muted">1200</text>
  <line x1="50" y1="182.5" x2="620" y2="182.5" class="f-plain"/>
  <text x="44" y="186.5" text-anchor="end" class="f-label f-muted">1600</text>
  <line x1="50" y1="135.0" x2="620" y2="135.0" class="f-plain"/>
  <text x="44" y="139.0" text-anchor="end" class="f-label f-muted">2000</text>
  <line x1="50" y1="87.5" x2="620" y2="87.5" class="f-plain"/>
  <text x="44" y="91.5" text-anchor="end" class="f-label f-muted">2400</text>
  <line x1="50" y1="40.0" x2="620" y2="40.0" class="f-plain"/>
  <text x="44" y="44.0" text-anchor="end" class="f-label f-muted">2800</text>
  <line x1="376.7" y1="34" x2="376.7" y2="230" class="f-line" stroke-dasharray="2 3"/>
  <path d="M50.0,127.0 L63.9,132.1 L77.8,134.3 L91.7,145.4 L105.6,140.6 L119.5,133.3 L133.4,153.5 L147.3,160.5 L161.2,158.0 L175.1,166.6 L189.0,156.6 L202.9,171.5 L216.8,183.9 L230.7,180.8 L244.6,163.5 L258.5,170.6 L272.4,173.9 L286.3,162.4 L300.2,161.1 L314.1,181.9 L328.0,178.8 L342.0,204.0 L355.9,193.7 L369.8,189.6" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/>
  <path d="M383.7,190.3 L397.6,196.6 L411.5,187.5 L425.4,195.1 L439.3,183.5 L453.2,180.8 L467.1,184.5 L481.0,171.9 L494.9,164.4 L508.8,173.6 L522.7,165.1 L536.6,50.4 L550.5,136.7 L564.4,82.7 L578.3,174.1 L592.2,153.3 L606.1,137.7 L620.0,137.3" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6" opacity="0.45"/>
  <path d="M383.7,190.3 L397.6,190.3 L411.5,190.3 L425.4,190.3 L439.3,190.3 L453.2,190.3 L467.1,190.3 L481.0,190.3 L494.9,190.3 L508.8,190.3 L522.7,190.3 L536.6,190.3 L550.5,190.3 L564.4,190.3 L578.3,190.3 L592.2,190.3 L606.1,190.3 L620.0,190.3" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="7 4"/>
  <path d="M383.7,182.9 L397.6,183.1 L411.5,175.0 L425.4,182.3 L439.3,181.3 L453.2,172.0 L467.1,178.8 L481.0,191.1 L494.9,187.8 L508.8,202.8 L522.7,192.4 L536.6,196.2 L550.5,184.9 L564.4,184.7 L578.3,176.4 L592.2,183.3 L606.1,182.2 L620.0,172.7" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <path d="M383.7,191.7 L397.6,187.6 L411.5,194.3 L425.4,199.9 L439.3,191.2 L453.2,182.2 L467.1,190.5 L481.0,205.8 L494.9,196.5 L508.8,201.3 L522.7,197.8 L536.6,201.5 L550.5,201.5 L564.4,196.7 L578.3,202.2 L592.2,206.8 L606.1,197.8 L620.0,188.5" style="fill:none;stroke:var(--accent);stroke-width:2.2" stroke-dasharray="3 3"/>
  <line x1="50" y1="254" x2="76" y2="254" class="f-ink" style="stroke:currentColor;stroke-width:1.6"/><text x="84" y="258" class="f-label f-ink">history</text>
  <line x1="340" y1="254" x2="366" y2="254" class="f-ink" style="stroke:currentColor;stroke-width:1.6" opacity="0.45"/><text x="374" y="258" class="f-label f-ink">what happened</text>
  <line x1="50" y1="272" x2="76" y2="272" class="f-ink" style="stroke:currentColor;stroke-width:2" stroke-dasharray="7 4"/><text x="84" y="276" class="f-label f-ink">AutoETS, MASE 0.806</text>
  <line x1="340" y1="272" x2="366" y2="272" style="stroke:var(--accent);stroke-width:2.2"/><text x="374" y="276" class="f-label f-ink">Claude run 1, MASE 0.789</text>
  <line x1="50" y1="290" x2="76" y2="290" style="stroke:var(--accent);stroke-width:2.2" stroke-dasharray="3 3"/><text x="84" y="294" class="f-label f-ink">Claude run 2, MASE 0.950</text>
</svg>
<figcaption>Same 72 numbers on the input both times. AutoETS gives the same line on every run.</figcaption>
</figure>

The first run has MASE 0.789 and beats AutoETS, which has 0.806 on this series. The second has 0.950 and loses. AutoETS gives exactly the same 18 numbers every time, I checked this by running it again. The 120 model forecasts cost me $13.93 at list price.

## Where the model makes things up

For the second half I took 20 of the 60 series with the AutoETS forecast. I asked the model to explain the forecast to a founder who is not a finance person, in about 120 words. One version got only the history and the forecast. The other also got a short table of facts computed by a script. The table has the last month and the sums of the last 12 months, the 12 before them and the 12 forecast months. It also has the 18 month forecast sum, the changes between these sums and the highest and lowest forecast month. It was told to use only numbers from that table. Each version ran 2 times, so 40 texts per version.

My first check pulled every number from the texts and looked for it among values derived from the input. In the first 10 texts it found nothing wrong. That was suspicious. With about 200 values and all differences and percentages between them, almost any small number has a match. I rewrote the check before the first text of the second version existed. Now code checks every claim against the series, including month positions and shapes like "doubled". 4 subagents did this in Python without knowing which version a text came from. I rechecked all errors by hand.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Two stacked bars. History only: 294 claims, 273 correct, 6 too vague, 5 wrong, 10 invented, 9 of 40 texts with at least one error. Plus table of facts: 379 claims, 373 correct, 4 too vague, 0 wrong, 2 invented, 2 of 40 texts with an error.">
  <text x="10" y="16" class="f-label f-muted">claims in 40 explanations per version, checked by code</text>
  <text x="152" y="60" text-anchor="end" class="f-mono f-ink">history only</text>
  <rect x="162" y="44" width="108" height="22" class="f-ink" style="fill:currentColor" opacity="0.15"/>
  <text x="170" y="59" class="f-mono f-ink">273 correct</text>
  <path d="M264,41 l6,14 l-6,14" class="f-line"/>
  <rect x="274.0" y="44" width="36.8" height="22" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="312.8" y="44" width="30.7" height="22" class="f-ink" style="fill:currentColor"/>
  <rect x="345.5" y="44" width="61.3" height="22" style="fill:var(--accent)"/>
  <text x="414.8" y="59" class="f-mono f-ink">6 / 5 / 10</text>
  <text x="274" y="82" class="f-label f-accent">9 of 40 texts with an error</text>
  <text x="152" y="114" text-anchor="end" class="f-mono f-ink">plus table of facts</text>
  <rect x="162" y="98" width="108" height="22" class="f-ink" style="fill:currentColor" opacity="0.15"/>
  <text x="170" y="113" class="f-mono f-ink">373 correct</text>
  <path d="M264,95 l6,14 l-6,14" class="f-line"/>
  <rect x="274.0" y="98" width="24.5" height="22" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="300.5" y="98" width="12.3" height="22" style="fill:var(--accent)"/>
  <text x="320.8" y="113" class="f-mono f-ink">4 / 0 / 2</text>
  <text x="274" y="136" class="f-label f-muted">2 of 40 texts with an error</text>
  <rect x="162" y="161" width="12" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="180" y="170" class="f-label f-ink">too vague to check</text>
  <rect x="328.4" y="161" width="12" height="10" class="f-ink" style="fill:currentColor"/><text x="346.4" y="170" class="f-label f-ink">wrong</text>
  <rect x="406.4" y="161" width="12" height="10" style="fill:var(--accent)"/><text x="424.4" y="170" class="f-label f-ink">invented (calendar)</text>
</svg>
<figcaption>20 series, each explained 2 times per version. Wrong and invented are shown to scale, the correct part is cut.</figcaption>
</figure>

Without the table 15 of 294 claims were wrong or invented, 5.1%: 5 wrong and 10 invented. With the table it was 2 of 379, 0.5%. Per claim this is less than the 10% I expected, even with the 6 claims too vague to check added. Per text it looks worse: 9 of 40 explanations without the table had at least 1 error, with the table 2 of 40.

One text says the metric "climbed from roughly 4,000" over the last 3 years. The series was near 4000 about 5 and a half years back, while 3 years ago it was 5847. In another text the third month of the cycle is "consistently your best" and the twelfth "consistently your worst" across all 6 years. The third month is the best in 4 years of 6 and the twelfth is the worst in 1.

Most errors, 12 of the 17, were not about numbers at all. The input had no dates, only 72 values. The model still wrote "slid steadily from mid-2022" and "your weakest February ever". In that last sentence the value is correct and it is the lowest month, but February is made up. The table did not fully stop this either, both errors in the second version are "winter months".

The table also helped where I did not expect it. One series ends at 2548, its highest month in 6 years. AutoETS kept the forecast flat at that level. The table had a line saying the next 12 months come out 10.6% above the last 12, while the last year grew 3.5%. Both texts with the table put these 2 numbers side by side. They warned that a flat forecast hides a 10.6% jump.

## What I did not check

M4 has been public since 2018, so the series could be in the training data. I gave them without their M4 ids, but I cannot exclude it. This is 1 model, 60 series and only AutoETS forecasts explained. The claims were checked with code by subagents on the same model that wrote the texts. By hand I rechecked the errors and a sample of 8 correct claims, not all 673 claims.

Next time someone asks, I will give the same split, but with the table of facts as a required part of it.
