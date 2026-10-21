---
title: "2 lists of 30 test names from the same Claude model share a name in up to 98% of pairs. Faker does it in 1.29%"
description: "I asked 7 Claude models for test fixtures in 1274 calls, each a fresh process with no history. For person names, 2 independent lists of 30 shared at least 1 name in 64 to 98% of pairs depending on the model, against 1.29% for Faker at the same size. A request for variety removed email collisions and left names colliding in 58 of 105 pairs. That model fake data can be less varied than Faker's has been reported before; this run measures the collision between 2 runs, which is what breaks a seed with a UNIQUE constraint."
date: 2026-10-21
lang: en
translationKey: fixture-entropy
tags: ["llm", "databases", "reliability"]
draft: false
---
When I need test data and a model is already open, I just ask it. "Generate 30 random email addresses for test fixtures." The answer comes in a second and the list looks random. A colleague does the same an hour later for another test. Then both fixtures end up in 1 database seed with a `UNIQUE` constraint on the column.

Here 1 list looking random tells me nothing. The seed fails when 2 lists from 2 separate requests share at least 1 value. I wanted that number, so I measured it. In the paper it is called `P_pair`, the share of pairs of independent runs that have a value in common.

## Others were here first

The broad idea is not mine. That models repeat themselves on open questions is well measured and Artificial Hivemind lists name generation among the tasks where diversity had already been evaluated. The closest study is about fake personal data ([arXiv:2605.13538](https://arxiv.org/abs/2605.13538)). A small model invented names and addresses and the authors compared them with Faker directly. Judged by a downstream NER task, the model's fakes made a less varied training set than Faker's. An earlier study of synthetic identity documents ([arXiv:2411.14962](https://arxiv.org/abs/2411.14962)) reported the opposite: fields from the LLM were more diverse than Faker's templates.

So "model fake data is less varied than Faker" is already said and even in both directions. What I add is narrow. The unit is a pair of independent runs, exactly as in the seed above. Identifiers are in the test, email addresses and usernames. Faker runs at the same sizes as the models. The models are 7 Claude models, current and previous, through the CLI a developer actually types into.

## How I asked

There were 7 value types, each in the plainest wording I could think of, like "Generate 30 random person full names for test fixtures." Each request came in 3 versions. In the first the model had to give one value per line. The second asked for a JSON array. In the third it got the same one value per line plus a sentence asking to make the values as different from each other as possible.

From the current generation I took Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1, from the previous Opus 5, Sonnet 5 and Haiku 4.5. The 1274 calls ran on 19 and 20 October 2026. Every call was a separate `claude -p` process with no history and tools turned off, so 2 runs know nothing about each other. For the baseline Faker 40.43.0 made 300 sets of 30 values per type.

## Names

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Bar chart of the share of pairs of independent runs whose lists of 30 person names share at least 1 name, plain request. Opus 5.5 96%, Sonnet 5.5 64%, Haiku 5.5 98%, Fable 5.1 80%, Opus 5 64%, Sonnet 5 96%, Haiku 4.5 71%. Faker at the same size 1.29%.">
  <text x="10" y="16" class="f-label f-muted">share of pairs of runs with at least 1 name in common, plain request</text>
  <line x1="140.0" y1="34" x2="140.0" y2="266" class="f-plain"/>
  <text x="140.0" y="282" text-anchor="middle" class="f-label f-muted">0%</text>
  <line x1="350.0" y1="34" x2="350.0" y2="266" class="f-plain"/>
  <text x="350.0" y="282" text-anchor="middle" class="f-label f-muted">50%</text>
  <line x1="560.0" y1="34" x2="560.0" y2="266" class="f-plain"/>
  <text x="560.0" y="282" text-anchor="middle" class="f-label f-muted">100%</text>
  <text x="128" y="51" text-anchor="end" class="f-mono f-ink">Opus 5.5</text>
  <rect x="140" y="40" width="401.3" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="549.3" y="51" class="f-mono f-ink">96%</text>
  <text x="128" y="79" text-anchor="end" class="f-mono f-ink">Sonnet 5.5</text>
  <rect x="140" y="68" width="270.7" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="418.7" y="79" class="f-mono f-ink">64%</text>
  <text x="128" y="107" text-anchor="end" class="f-mono f-ink">Haiku 5.5</text>
  <rect x="140" y="96" width="410.7" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="558.7" y="107" class="f-mono f-ink">98%</text>
  <text x="128" y="135" text-anchor="end" class="f-mono f-ink">Fable 5.1</text>
  <rect x="140" y="124" width="336.0" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="484.0" y="135" class="f-mono f-ink">80%</text>
  <text x="128" y="163" text-anchor="end" class="f-mono f-ink">Opus 5</text>
  <rect x="140" y="152" width="270.7" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="418.7" y="163" class="f-mono f-ink">64%</text>
  <text x="128" y="191" text-anchor="end" class="f-mono f-ink">Sonnet 5</text>
  <rect x="140" y="180" width="401.3" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="549.3" y="191" class="f-mono f-ink">96%</text>
  <text x="128" y="219" text-anchor="end" class="f-mono f-ink">Haiku 4.5</text>
  <rect x="140" y="208" width="298.7" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="446.7" y="219" class="f-mono f-ink">71%</text>
  <text x="128" y="255" text-anchor="end" class="f-mono f-ink">Faker</text>
  <rect x="140" y="244" width="5.4" height="14" style="fill:var(--accent)"/>
  <text x="153.4" y="255" class="f-mono f-ink">1.29%</text>
</svg>
<figcaption>45 pairs from 10 runs per model. Faker: 300 sets of 30, 44,850 pairs. The paper gives a 95% interval for every cell.</figcaption>
</figure>

With the plain request, 2 lists of 30 names from the same model shared at least 1 name in 64% to 98% of pairs. Faker at the same size did it in 1.29% of pairs. Over all 7 models it is 256 of 315 pairs.

Inside a single reply no model repeated a name, so every list on its own looks fine. The repetition is only between runs. Dmitri Volkov came back in 26 of 70 plain runs, Priya Raghunathan in 24 and Kwame Asante in 19.

## Identifiers depend on the model

Email addresses split by model. 2 lists from Opus 5.5 collided in 56% of pairs and from Sonnet 5.5 in 36%, while Haiku 5.5 never collided in 45 pairs. The address `alice.morgan@example.com` came back in 7 of 70 runs. For usernames 4 models of 7 stay above Faker even at the lower end of their interval.

I expected the JSON version to reduce variety, because a 2026 study found exactly that for single word answers. Here it did not hold as a rule. The shifts went up for some models and down for others.

## Asking for variety

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="Bar chart of pooled pairs of runs sharing a value over all 7 models. Names with the plain request 256 of 315, with the request for variety 58 of 105. Email with the plain request 59 of 315, with the request for variety 0 of 105.">
  <text x="10" y="16" class="f-label f-muted">pairs of runs that share a value, all 7 models together</text>
  <text x="50" y="40" class="f-label f-muted">names, plain request</text>
  <rect x="50" y="47" width="357.6" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="415.6" y="58" class="f-mono f-ink">81%  256 of 315</text>
  <text x="50" y="86" class="f-label f-muted">names, request asks for variety</text>
  <rect x="50" y="93" width="243.0" height="14" style="fill:var(--accent)"/>
  <text x="301.0" y="104" class="f-mono f-ink">55%  58 of 105</text>
  <text x="50" y="146" class="f-label f-muted">email, plain request</text>
  <rect x="50" y="153" width="82.4" height="14" class="f-ink" style="fill:currentColor" opacity="0.55"/>
  <text x="140.4" y="164" class="f-mono f-ink">19%  59 of 315</text>
  <text x="50" y="192" class="f-label f-muted">email, request asks for variety</text>
  <rect x="50" y="199" width="1.5" height="14" style="fill:var(--accent)"/>
  <text x="59.5" y="210" class="f-mono f-ink">0%  0 of 105</text>
</svg>
<figcaption>The request for variety ran 6 times per model, so 15 pairs per model and 105 in all. Faker at the same size: 1.29% for names, 0.38% for email.</figcaption>
</figure>

The extra sentence about variety fixed email completely, with 0 collisions in 105 pairs over all 7 models. It did not fix names. Names got more varied with every model, but none reached Faker and 58 of 105 pairs still shared a name.

## What I could not separate

The CLI is not a bare API. It sends its own system prompt and that context carried my account details. In 1 reply a model reproduced the account email address, my GitHub handle and a city matching the time zone of the machine. So that information reached the model.

The top name is Dmitri Volkov and Dmitri is my own first name. Over all 3 versions of the request it appears in 66 of 182 name runs. Did my account context push it up or do the models like it anyway? I did not test that. Removing this name from every list moves the pooled count from 256 to 254 of 315 pairs, so the rates do not rest on it. Which names come out on top may still depend on the context. A run through the bare API without account context would settle it and I have not done that run.

There are 2 more things to say plainly. The UUID results mean nothing here, because with tools off several models answered the UUID request with tool call markup instead of values. And I wrote down my expectations 18 minutes before the run started, but committed them only when 52 replies were already in the journal. No collision rate had been computed by then and the paper lists what I saw and changed in between.

## What I do now

For any column with a `UNIQUE` constraint I would not take values from a model. 30 values is a small fixture and a bigger one gives more chances to collide. The worst part is that the failure is intermittent, it depends on which reply each fixture happened to get. A generator like Faker solves it and the model can still write the call to the generator. A request for variety was enough for email in this panel, but not for names.

The full write up with all tables is on the [paper page](https://dimhold.by/papers/fixture-entropy/). The harness, every reply in full and the analysis scripts are in the [repository](https://github.com/dimhold/fixture-entropy).
