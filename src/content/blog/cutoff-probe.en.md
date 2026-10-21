---
title: "Claude 5.5 says its knowledge ends in June 2026. It got no package release from March 2026 right"
description: "I asked 7 Claude models about 552 npm and PyPI releases dated by the registries. For the 4 models stated as June 2026, the last month with at least half of the 2024 level of correct answers falls between September and December 2025 and correct answers reach 0 by March 2026. Asked inside Claude Code, the same models name June 2026 in 63 of 70 answers. The gap itself is known from LLMLagBench and HindsightBench; this run adds the 5.5 generation and package releases."
date: 2026-10-21
lang: en
translationKey: cutoff-probe
tags: ["llm", "dependencies", "time"]
draft: false
---
Every time a coding model tells me which version of a library to install, I trust one date without thinking about it: its knowledge cutoff. For the Claude 5.5 models the vendor states June 2026 and the models repeat it when asked. I wanted to see what that month means in practice, so I asked 7 Claude models about package releases whose dates I could check. The 5.5 generation here is Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1, all stated as June 2026.

## A clock that nobody wrote from memory

Package registries are a good clock. npm and PyPI record when each version was published, to the second. I took 100 popular packages, half from each registry. From every package I kept the first stable release of each minor line. From those I drew 12 releases per month from January 2023 to October 2026, 552 in total.

For each release the model had to say whether it knows that this version came out and if so, in which month. "I do not know" was allowed. An answer counts as correct when the month is at most 1 off from the registry.

A model that says yes to everything would look very knowledgeable on such a test. So I mixed in 200 versions that do not exist, the next major and the next minor after the latest release of each package. The 4 models of the 5.5 generation claimed to know at most 3 of them in 400 answers each.

Before the first call I wrote down the rule for the measured cutoff. I also wrote down what I expected: a gap of at least 2 months from the stated date. I expected the models to name an earlier date for themselves too.

## Where the curve goes down

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Line chart of the share of correct answers by month of release, July 2024 to October 2026, for Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1. All stay near 70 to 100% until mid 2025, fall through late 2025 and reach 0 by March 2026. A dashed line marks the stated cutoff, June 2026, where every curve is already at 0.">
  <text x="10" y="16" class="f-label f-muted">share of 24 answers correct, by month the release came out</text>
  <line x1="50" y1="200.0" x2="620" y2="200.0" class="f-plain"/>
  <text x="44" y="204.0" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="50" y1="120.0" x2="620" y2="120.0" class="f-plain"/>
  <text x="44" y="124.0" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="50" y1="40.0" x2="620" y2="40.0" class="f-plain"/>
  <text x="44" y="44.0" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="50.0" y="216" text-anchor="middle" class="f-label f-muted">2024-07</text>
  <text x="176.7" y="216" text-anchor="middle" class="f-label f-muted">2025-01</text>
  <text x="303.3" y="216" text-anchor="middle" class="f-label f-muted">2025-07</text>
  <text x="430.0" y="216" text-anchor="middle" class="f-label f-muted">2026-01</text>
  <text x="556.7" y="216" text-anchor="middle" class="f-label f-muted">2026-07</text>
  <line x1="535.6" y1="34" x2="535.6" y2="200" class="f-line" stroke-dasharray="3 3"/>
  <text x="531.6" y="44" text-anchor="end" class="f-label f-muted">stated cutoff</text>
  <path d="M50.0,53.3 L71.1,40.0 L92.2,46.7 L113.3,46.7 L134.4,53.3 L155.6,53.3 L176.7,53.3 L197.8,40.0 L218.9,46.7 L240.0,46.7 L261.1,40.0 L282.2,60.0 L303.3,46.7 L324.4,60.0 L345.6,53.3 L366.7,40.0 L387.8,60.0 L408.9,86.7 L430.0,113.3 L451.1,180.0 L472.2,200.0 L493.3,200.0 L514.4,200.0 L535.6,200.0 L556.7,200.0 L577.8,200.0 L598.9,200.0 L620.0,200.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.4" opacity="0.4"/>
  <path d="M50.0,86.7 L71.1,66.7 L92.2,66.7 L113.3,60.0 L134.4,46.7 L155.6,66.7 L176.7,93.3 L197.8,66.7 L218.9,60.0 L240.0,66.7 L261.1,86.7 L282.2,80.0 L303.3,93.3 L324.4,86.7 L345.6,133.3 L366.7,133.3 L387.8,166.7 L408.9,193.3 L430.0,186.7 L451.1,200.0 L472.2,200.0 L493.3,200.0 L514.4,200.0 L535.6,200.0 L556.7,200.0 L577.8,200.0 L598.9,200.0 L620.0,200.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.4" opacity="0.4"/>
  <path d="M50.0,40.0 L71.1,40.0 L92.2,40.0 L113.3,40.0 L134.4,40.0 L155.6,40.0 L176.7,46.7 L197.8,40.0 L218.9,40.0 L240.0,40.0 L261.1,40.0 L282.2,53.3 L303.3,46.7 L324.4,66.7 L345.6,66.7 L366.7,60.0 L387.8,106.7 L408.9,160.0 L430.0,166.7 L451.1,200.0 L472.2,200.0 L493.3,200.0 L514.4,200.0 L535.6,200.0 L556.7,200.0 L577.8,200.0 L598.9,200.0 L620.0,200.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.4" opacity="0.4"/>
  <path d="M50.0,40.0 L71.1,40.0 L92.2,53.3 L113.3,40.0 L134.4,53.3 L155.6,53.3 L176.7,53.3 L197.8,60.0 L218.9,53.3 L240.0,40.0 L261.1,46.7 L282.2,86.7 L303.3,66.7 L324.4,126.7 L345.6,113.3 L366.7,133.3 L387.8,153.3 L408.9,180.0 L430.0,166.7 L451.1,200.0 L472.2,200.0 L493.3,200.0 L514.4,200.0 L535.6,200.0 L556.7,200.0 L577.8,200.0 L598.9,200.0 L620.0,200.0" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <line x1="50" y1="242" x2="76" y2="242" style="stroke:var(--accent);stroke-width:2.2"/><text x="84" y="246" class="f-label f-ink">Opus 5.5</text>
  <line x1="200" y1="242" x2="226" y2="242" class="f-ink" style="stroke:currentColor;stroke-width:1.4" opacity="0.4"/><text x="234" y="246" class="f-label f-ink">Sonnet 5.5, Haiku 5.5, Fable 5.1</text>
</svg>
<figcaption>12 releases per month, 2 repeats, so 24 answers per point. Correct means the model knows the release and names the month within 1.</figcaption>
</figure>

Up to the middle of 2025 the 5.5 models get almost every release right. Then the curve goes down. For Opus 5.5 it is 22 of 24 in January 2025, 17 in June, 11 in August, 3 in December and 0 from February 2026 on.

My rule takes the last month where the 3 month rolling share is still at least half of the 2024 level. For the 4 models that month falls between September and December 2025, which is 6 to 9 months before June 2026. From March 2026 none of them gets a single release right.

The fall is gradual. For Opus 5.5 the way from 90% of its 2024 level down to 10% takes 9 months, for Sonnet 5.5 it takes 4. The older Opus 5 is stated a month earlier than Opus 5.5 and measures at October 2025, a month later. The newer model does not know further on this battery.

## What the model says about itself

Then I asked the models directly, in 6 different wordings. Inside Claude Code the 5.5 models answered June 2026 in 63 of 70 answers.

Claude Code is how I ran all the calls and it adds its own system prompt. Haiku 5.5 quoted that prompt back to me. Next to the model name there is a line "Assistant knowledge cutoff is June 2026."

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Dot plot with one row per model. Measured cutoff: Opus 5.5 2025-09, Sonnet 5.5 2025-12, Haiku 5.5 2025-09, Fable 5.1 2025-11. Answer inside Claude Code: June 2026 in 18 of 18, 18 of 19, 12 of 13 and 15 of 20. Answers when told the cutoff line may be wrong fall between 2025-01 and 2025-09, before each measured cutoff.">
  <text x="10" y="16" class="f-label f-muted">3 dates per model, month axis</text>
  <line x1="133.7" y1="34" x2="133.7" y2="160" class="f-plain"/>
  <text x="133.7" y="176" text-anchor="middle" class="f-label f-muted">2025-01</text>
  <line x1="275.8" y1="34" x2="275.8" y2="160" class="f-plain"/>
  <text x="275.8" y="176" text-anchor="middle" class="f-label f-muted">2025-07</text>
  <line x1="417.9" y1="34" x2="417.9" y2="160" class="f-plain"/>
  <text x="417.9" y="176" text-anchor="middle" class="f-label f-muted">2026-01</text>
  <line x1="536.3" y1="34" x2="536.3" y2="160" class="f-plain"/>
  <text x="536.3" y="176" text-anchor="middle" class="f-label f-muted">2026-06</text>
  <text x="98" y="50" text-anchor="end" class="f-mono f-ink">Opus 5.5</text>
  <circle cx="133.7" cy="46" r="10.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="323.2" cy="46" r="5" style="fill:var(--accent)"/>
  <rect x="531.3" y="41" width="10" height="10" class="f-ink" style="fill:currentColor"/>
  <text x="550.3" y="50" class="f-mono f-ink">18 of 18</text>
  <text x="98" y="84" text-anchor="end" class="f-mono f-ink">Sonnet 5.5</text>
  <circle cx="228.4" cy="80" r="6.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="252.1" cy="80" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="299.5" cy="80" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="323.2" cy="80" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="394.2" cy="80" r="5" style="fill:var(--accent)"/>
  <rect x="531.3" y="75" width="10" height="10" class="f-ink" style="fill:currentColor"/>
  <text x="550.3" y="84" class="f-mono f-ink">18 of 19</text>
  <text x="98" y="118" text-anchor="end" class="f-mono f-ink">Haiku 5.5</text>
  <circle cx="133.7" cy="114" r="6.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="181.1" cy="114" r="6.0" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="228.4" cy="114" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="323.2" cy="114" r="5" style="fill:var(--accent)"/>
  <rect x="531.3" y="109" width="10" height="10" class="f-ink" style="fill:currentColor"/>
  <text x="550.3" y="118" class="f-mono f-ink">12 of 13</text>
  <text x="98" y="152" text-anchor="end" class="f-mono f-ink">Fable 5.1</text>
  <circle cx="133.7" cy="148" r="7.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="181.1" cy="148" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="228.4" cy="148" r="4.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/>
  <circle cx="370.5" cy="148" r="5" style="fill:var(--accent)"/>
  <rect x="531.3" y="143" width="10" height="10" class="f-ink" style="fill:currentColor"/>
  <text x="550.3" y="152" class="f-mono f-ink">15 of 20</text>
  <circle cx="16" cy="200" r="5" style="fill:var(--accent)"/><text x="26" y="204" class="f-label f-ink">measured</text>
  <rect x="140" y="195" width="10" height="10" class="f-ink" style="fill:currentColor"/><text x="156" y="204" class="f-label f-ink">said in Claude Code</text>
  <circle cx="318" cy="200" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.2"/><text x="328" y="204" class="f-label f-ink">told the line may be wrong</text>
</svg>
<figcaption>Filled dot: measured cutoff. Square: June 2026, with how many self reports inside Claude Code named it. Rings: answers under the leading wording, larger for more answers.</figcaption>
</figure>

The answers match that line. That the line causes them I cannot say. I captured the context for 1 model of 7 and never ran a condition without the line. A model that knows its own name may also know its official date.

I added one more wording during the run. It said the line was inserted by the client software and may be wrong. Under it every answer of the 5.5 models fell between January and September 2025, before each model's own curve. That wording is leading, so I read it as a hint and not as a measurement.

## I was not first

Before the run I searched for prior work and found Dated Data from 2024. It showed on open models that the effective cutoff differs from the stated one. My search did not really reach arXiv, because the API throttled me after 5 requests.

At review 2 days later I found what I had missed. LLMLagBench (2025) put the vendor date, the model's own date and a measured date side by side for 35 models. HindsightBench (2026) found black box effective cutoffs up to 8 months before the vendor date, for 5 of the 7 models where one is published. So the gap is known and my registration claimed more novelty than was left.

What this run adds is narrow. Neither study covers the Claude 5.5 models. Mine uses package releases dated by the registry, has the control of versions that do not exist and asks for the self report the way Claude Code delivers it. LLMLagBench saw older Claude models name a date earlier than the vendor's. Inside Claude Code the 5.5 models name the vendor date.

There are limits. This is popular packages and not knowledge in general. Questions went in batches of 20 through a subscription, so I did not control the sampling settings.

For a package version from February 2026 on, the model's silence tells me nothing about whether the version exists. Asking the model about its cutoff inside Claude Code gives me the vendor's date back.

The full write up with all tables is on the [paper page](https://dimhold.by/papers/cutoff-probe/). The battery, the harness and the journal of every call are in the [repository](https://github.com/dimhold/cutoff-probe).
