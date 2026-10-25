---
title: "I asked my notes 15 questions they cannot answer and got 13 answers"
description: "Search plus generation over 16 of my own posts with the tools of May 2022: BM25, MiniLM, UnifiedQA, OPT. Search puts the right paragraph in the top 3 for 40 of 60 questions. On 15 questions with no answer the reader answers 13, 5 of them copied from my own \"What I did not check\" sections."
date: 2022-05-21
lang: en
translationKey: rag-own-notes
tags: ["llm", "machine-learning", "text"]
---
This blog is the closest thing I have to notes, 16 posts from 2011 to 2014. When I need a number from them, like the time 10 million random uuids took to insert, I open the post and search the page. It works if I remember which post.

Retrieval augmented generation, the idea of Lewis and others from 2020, is supposed to fix exactly this. You find the paragraphs that look relevant, give them to a model with the question and let it write the answer. I wanted to see what it does on my own texts.

Before the first run I wrote down what I expected. Search would lose more answers than the reader. On questions with no answer in the notes both models would answer anyway, almost every time. Most of the questions without an answer I took from the section at the end of almost every post, "What I did not check". I wrote those sections as lists of things I do not know and assumed a machine would read them the same way.

## The setup

The notes are the English versions of the 16 posts, cut into 383 paragraphs. I wrote 75 questions before running anything. 60 have an answer in the posts and for each I marked the one paragraph that holds it. 15 have no answer. 12 ask about things the posts list as not checked, like how the uuid test would go on InnoDB. 1 asks for a detail I never wrote down, the PostgreSQL version. 2 are about topics I never wrote about.

I wrote the questions right after rereading the posts, so they borrow my wording. To see how much that helps, I split the results at the median share of question words found in the right paragraph, 0.5.

For search I took BM25 from `rank_bm25` 0.2.2, which counts shared words. Next to it are 2 `sentence-transformers` models from last August, `all-MiniLM-L6-v2` and `multi-qa-MiniLM-L6-cos-v1`, which compare meaning as vectors. The fourth option merges the BM25 list with the second vector list by reciprocal rank fusion. The DPR replication study last year found that mixing BM25 and dense scores beats dense search alone. I mix ranks instead of scores.

For the answer I took UnifiedQA-v2 on T5-large, released by AllenAI in February and trained to answer from a given text. The second model was supposed to be OPT-1.3B, which Meta published this month as an open alternative to GPT-3. Everything runs on CPU with greedy decoding, with transformers 4.19.2, `sentence-transformers` 2.2.0 and torch 1.11. The machine has 4 cores and 8 GB of memory, about 4.5 of it free next to the other services.

That memory was the first problem. torch 1.11 could not load T5-large with `from_pretrained` in what was free, the process was killed by the kernel. I cut the weights into shards and loaded them piece by piece. OPT-1.3B in float32 is 5.3 GB of weights, more than that. In bfloat16 it fits, but one answer of 40 tokens to a question with no notes at all took 9 minutes. So the second model became OPT-350m from the same release, in float32.

## Search finds the post, then the wrong paragraph

With the hybrid, the right paragraph is in the top 3 for 40 of 60 questions. BM25 alone gets 38, the 2 vector models 38 and 39. That is less than I expected, but the misses are close. With the hybrid the right post is in the top 3 for all 60. In 13 of the 20 misses the top 3 holds a paragraph 1 or 2 away from the one I needed.

<figure class="fig">
<svg viewBox="0 0 680 162" role="img" aria-label="Bars, 4 search methods, how often the right paragraph is in the top 3. Questions sharing half or more of their words with the paragraph, 32 of them: BM25 28, all-MiniLM 25, multi-qa 24, hybrid 26. Questions sharing less than half, 28 of them: BM25 10, all-MiniLM 13, multi-qa 15, hybrid 14.">
  <text x="10" y="16" class="f-label f-muted">right paragraph in the top 3, by how many question words it shares</text>
  <text x="110" y="42" class="f-label f-ink">half or more of the words shared (32)</text>
  <text x="102" y="66" text-anchor="end" class="f-mono f-ink" style="font-size:12px">BM25</text>
  <rect x="110.0" y="52" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="110.0" y="52" width="192.5" height="18" class="f-ink" opacity="0.4"/>
  <text x="308.5" y="66" class="f-label f-ink">28/32</text>
  <text x="102" y="92" text-anchor="end" class="f-mono f-ink" style="font-size:12px">all-MiniLM</text>
  <rect x="110.0" y="78" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="110.0" y="78" width="171.9" height="18" class="f-ink" opacity="0.4"/>
  <text x="287.9" y="92" class="f-label f-ink">25/32</text>
  <text x="102" y="118" text-anchor="end" class="f-mono f-ink" style="font-size:12px">multi-qa</text>
  <rect x="110.0" y="104" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="110.0" y="104" width="165.0" height="18" class="f-ink" opacity="0.4"/>
  <text x="281.0" y="118" class="f-label f-ink">24/32</text>
  <text x="102" y="144" text-anchor="end" class="f-mono f-ink" style="font-size:12px">hybrid</text>
  <rect x="110.0" y="130" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="110.0" y="130" width="178.8" height="18" class="f-ink" opacity="0.4"/>
  <text x="294.8" y="144" class="f-label f-ink">26/32</text>
  <text x="440" y="42" class="f-label f-ink">less than half shared (28)</text>
  <rect x="440.0" y="52" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="440.0" y="52" width="78.6" height="18" class="f-accent" opacity="0.8"/>
  <text x="524.6" y="66" class="f-label f-accent">10/28</text>
  <rect x="440.0" y="78" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="440.0" y="78" width="102.1" height="18" class="f-accent" opacity="0.8"/>
  <text x="548.1" y="92" class="f-label f-accent">13/28</text>
  <rect x="440.0" y="104" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="440.0" y="104" width="117.9" height="18" class="f-accent" opacity="0.8"/>
  <text x="563.9" y="118" class="f-label f-accent">15/28</text>
  <rect x="440.0" y="130" width="220.0" height="18" class="f-ink" opacity="0.12"/>
  <rect x="440.0" y="130" width="110.0" height="18" class="f-accent" opacity="0.8"/>
  <text x="556.0" y="144" class="f-label f-accent">14/28</text>
</svg>
<figcaption>60 questions with an answer, split at the median word overlap with the right paragraph.</figcaption>
</figure>

When the question shares at least half its words with the paragraph, BM25 finds 28 of 32 and the vector models 24 or 25. Below that BM25 drops to 10 of 28 and the second vector model gets 15. So vectors help where I would have searched with the wrong word, on average they are not better.

I tried one obvious fix. Adding the post title to every paragraph before indexing moved the hybrid from 40 to 39, which is noise. The title plus the previous paragraph dropped it to 35. My guess is that paragraphs of one post start to look alike.

## The reader is fine when it gets the right paragraph

UnifiedQA given the right paragraph answers 52 of 60. Given the top 3 from the hybrid it answers 34, with no context at all 2.

It gets 26 questions wrong after search. For 18 of them the right paragraph was not in the top 3. Of the 20 questions where search missed the paragraph, the model still got 2 right. Both times the post states the same fact a second time, once only in a heading. So most failures are search failures, as I expected.

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Stacked bars for 60 questions with an answer. Given the right paragraph, UnifiedQA answers 52 correctly and 8 wrong. Given the top 3 from search: in 40 cases the right paragraph is there and 32 of those are correct; in 20 cases it is not there and 2 of those are correct. With no context, 2 correct.">
  <text x="10" y="16" class="f-label f-muted">60 questions with an answer, UnifiedQA</text>
  <text x="162" y="50" text-anchor="end" class="f-label f-ink">right paragraph given</text>
  <rect x="170.0" y="34" width="380.3" height="24" class="f-accent" opacity="0.85"/>
  <text x="360.7" y="50" text-anchor="middle" class="f-label f-ink">52</text>
  <rect x="551.3" y="34" width="57.7" height="24" class="f-ink" opacity="0.15"/>
  <text x="580.7" y="50" text-anchor="middle" class="f-label f-muted">8</text>
  <text x="162" y="108" text-anchor="end" class="f-label f-ink">top 3 from search</text>
  <rect x="170.0" y="92" width="233.7" height="24" class="f-accent" opacity="0.85"/>
  <text x="287.3" y="108" text-anchor="middle" class="f-label f-ink">32</text>
  <rect x="404.7" y="92" width="57.7" height="24" class="f-ink" opacity="0.15"/>
  <text x="434.0" y="108" text-anchor="middle" class="f-label f-muted">8</text>
  <rect x="463.3" y="92" width="13.7" height="24" class="f-accent" opacity="0.85"/>
  <text x="470.7" y="108" text-anchor="middle" class="f-label f-ink">2</text>
  <rect x="478.0" y="92" width="131.0" height="24" class="f-ink" opacity="0.15"/>
  <text x="544.0" y="108" text-anchor="middle" class="f-label f-muted">18</text>
  <line x1="463.3" y1="86" x2="463.3" y2="122" class="f-line"/>
  <text x="316.7" y="134" text-anchor="middle" class="f-label f-muted">paragraph in the top 3: 40</text>
  <text x="536.7" y="134" text-anchor="middle" class="f-label f-muted">not in the top 3: 20</text>
  <text x="162" y="166" text-anchor="end" class="f-label f-ink">no context</text>
  <rect x="170.0" y="150" width="13.7" height="24" class="f-accent" opacity="0.85"/>
  <text x="177.3" y="166" text-anchor="middle" class="f-label f-ink">2</text>
  <rect x="184.7" y="150" width="424.3" height="24" class="f-ink" opacity="0.15"/>
  <text x="397.3" y="166" text-anchor="middle" class="f-label f-muted">58</text>
  <rect x="170.0" y="200" width="14.0" height="12" class="f-accent" opacity="0.8"/>
  <text x="190" y="211" class="f-label f-ink">correct</text>
  <rect x="280.0" y="200" width="14.0" height="12" class="f-ink" opacity="0.18"/>
  <text x="300" y="211" class="f-label f-ink">wrong</text>
</svg>
<figcaption>Of the 26 wrong answers after search, 18 are questions where search did not return the right paragraph.</figcaption>
</figure>

6 of the 8 failures where search did return the right paragraph are a wrong number taken from the text in front of it. I asked how many requests of a burst of 300 a bucket of capacity 10 admits. It answered 90, the number the bucket turned away. I asked how many rounds it took before the median wandered less than 3 percent. It answered 30, the last row of the list instead of the first that passes.

OPT-350m is no reader at all here. With the right paragraph it gets 20 of 60 by my automatic check. At least half of those are a long stretch of the paragraph copied word for word, with the number somewhere inside. With the top 3 it gets 7. The prompt told it to say "not in my notes" when the notes do not contain the answer. It never did. Once it came close by accident: asked about InnoDB, it copied my own line "I have not run this on InnoDB". The rest of this post is about UnifiedQA.

## 13 answers to 15 questions without an answer

On the 15 questions with no answer in my notes, UnifiedQA refused twice. The other 13 got a short confident answer.

For 12 of the 15 the top 3 contained a paragraph about something I had not checked. 11 of them come from a "What I did not check" section. 5 answers are copied out of those paragraphs. "How did BigDecimal handle currencies with 3 decimals?" came back as "splitting one amount across several invoice lines". The source is "Still open: currencies with 3 decimals. Splitting one amount across several invoice lines...". It is a list of open questions. The model answered with the next item.

"What does the load average show inside a container?" got "the load average belongs to the host, while the limits belong to the cgroup". That is almost exactly my sentence, from a paragraph that starts with "Whether" and ends with "I expect that to be its own kind of misleading". In the post it sits inside a list of things I had not checked.

5 more answers are a number from another paragraph in the top 3, one about something else. "How much slower were random uuid inserts on InnoDB?" got 172414,407 ms, the PostgreSQL number from the same post, with the comma psql printed. The last 3 do not appear in those 3 paragraphs at all. For how long an unreachable git commit survives before prune, it answered "15 minutes". I do not know where it came from, my posts do not have it.

<figure class="fig">
<svg viewBox="0 0 680 184" role="img" aria-label="15 squares, 1 per question without an answer. 2 refused. 5 answers are taken from a What I did not check paragraph. 5 are a number from another paragraph in the top 3. 3 are not in the 3 paragraphs at all. A dot marks the 12 questions where the top 3 contained a paragraph about something not checked.">
  <text x="10" y="16" class="f-label f-muted">15 questions with no answer in the notes, UnifiedQA on the top 3</text>
  <rect x="20" y="34" width="34" height="34" class="f-plain"/>
  <rect x="60" y="34" width="34" height="34" class="f-plain"/>
  <circle cx="77" cy="51" r="4" class="f-ink"/>
  <rect x="100.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.9"/>
  <circle cx="117" cy="51" r="4" class="f-ink"/>
  <rect x="140.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.9"/>
  <circle cx="157" cy="51" r="4" class="f-ink"/>
  <rect x="180.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.9"/>
  <circle cx="197" cy="51" r="4" class="f-ink"/>
  <rect x="220.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.9"/>
  <circle cx="237" cy="51" r="4" class="f-ink"/>
  <rect x="260.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.9"/>
  <circle cx="277" cy="51" r="4" class="f-ink"/>
  <rect x="300.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.35"/>
  <circle cx="317" cy="51" r="4" class="f-ink"/>
  <rect x="340.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.35"/>
  <circle cx="357" cy="51" r="4" class="f-ink"/>
  <rect x="380.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.35"/>
  <circle cx="397" cy="51" r="4" class="f-ink"/>
  <rect x="420.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.35"/>
  <rect x="460.0" y="34" width="34.0" height="34" class="f-accent" opacity="0.35"/>
  <circle cx="477" cy="51" r="4" class="f-ink"/>
  <rect x="500.0" y="34" width="34.0" height="34" class="f-ink" opacity="0.55"/>
  <rect x="540.0" y="34" width="34.0" height="34" class="f-ink" opacity="0.55"/>
  <circle cx="557" cy="51" r="4" class="f-ink"/>
  <rect x="580.0" y="34" width="34.0" height="34" class="f-ink" opacity="0.55"/>
  <circle cx="597" cy="51" r="4" class="f-ink"/>
  <rect x="20" y="90" width="14" height="14" class="f-plain"/>
  <text x="42" y="102" class="f-label f-ink">2  refused</text>
  <rect x="20.0" y="112" width="14.0" height="14" class="f-accent" opacity="0.9"/>
  <text x="42" y="124" class="f-label f-ink">5  taken from a &quot;What I did not check&quot; paragraph</text>
  <rect x="20.0" y="134" width="14.0" height="14" class="f-accent" opacity="0.35"/>
  <text x="42" y="146" class="f-label f-ink">5  a number from another paragraph in the top 3</text>
  <rect x="20.0" y="156" width="14.0" height="14" class="f-ink" opacity="0.55"/>
  <text x="42" y="168" class="f-label f-ink">3  not in the 3 paragraphs at all</text>
</svg>
<figcaption>A dot means the top 3 held a paragraph about something I had not checked, 11 of the 12 from a &quot;What I did not check&quot; section.</figcaption>
</figure>

The best cosine of the second vector model is lower for unanswerable questions, a median of 0.56 against 0.66, but the 2 groups overlap. The best single threshold keeps 59 of 60 good questions and rejects only 5 of the 15 bad ones. With BM25 scores the same approach rejects at most 1.

## What I did not check

Larger models, GPT-3 among them. On the 18 questions where search did not return the paragraph, a better reader can only guess.

Questions written by someone else or by me a year from now. The overlap split shows the direction but does not replace that test.

A reranker, other paragraph sizes, other prompts. And this is one run on 75 questions, so a difference of 1 or 2 questions between methods means nothing.

The first thing I will change is my posts. The open questions sections need a mark that lets search leave them out. Or one that tells the model it is reading a list of things I do not know. I have not tried either yet.
