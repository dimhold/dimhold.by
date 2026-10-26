---
title: "OpenAI's biggest embedding model costs 75 times more than the smallest and loses ArguAna to a 22M one"
description: "Free sentence-transformers models of 2021 against the numbers OpenAI published for its embeddings, on 4 BEIR datasets on a 4 core CPU. The best free model is 3.9 points of nDCG@10 behind the biggest OpenAI model on average, beats every OpenAI size on ArguAna and runs on my own CPU, while Davinci would cost $9021.57 for the same corpora."
date: 2022-05-13
lang: en
translationKey: embeddings-paid-vs-free
tags: ["machine-learning", "llm", "text"]
---
I want search over my own notes, which are the posts of this blog. First I have to choose the vectors. In January OpenAI opened an embeddings endpoint and published the paper behind it. Table 6 there compares their search models with 8 other methods on 11 datasets from BEIR, a benchmark for search on unfamiliar data. In the average column the biggest model, `cpt-text` XL, is the best in the table with 52.8.

A few days later Nils Reimers, who wrote `sentence-transformers`, posted a long answer. He had called the API himself on 6 search datasets, with Ada and Babbage during the beta in December. His conclusion was that the search models are on par with free ones, while costing 8000 to 600000 times more to run. So I had 2 texts with numbers that said different things. I had no numbers of my own.

Before running anything I wrote my guess down. The best free model would lose to XL by 3 to 8 points on average. It would also beat the smallest OpenAI model on at least 2 of 4 datasets. The 3 to 8 points came only from the average column, I did not look at the rows.

## The setup

I did not call the API. On the OpenAI side I take the numbers from their paper. By vector length the smallest size S is Ada in the API and the biggest XL is Davinci. They give 1024 and 12288 numbers per vector. On my side I run free models on the same datasets with the same metric. It is nDCG@10, which looks at the first 10 results and gives more weight to the higher ones.

The datasets are the 4 smallest of the 11, because everything runs on a CPU with 4 cores. SciFact has 5183 abstracts and 300 scientific claims to check. NFCorpus is medical articles with 323 queries written for the general public. FiQA has 57638 answers from the investment section of Stack Exchange with 648 questions. ArguAna has 8674 arguments. For each of its 1406 queries the right result is the counterargument.

The free models are 5 `sentence-transformers` models from June to August last year. `all-MiniLM-L6-v2` has 22 million parameters and vectors of 384 numbers. `all-mpnet-base-v2` and `multi-qa-mpnet-base-dot-v1` have about 110 million and 768 numbers. The small `multi-qa-MiniLM-L6-cos-v1` is made for questions. `msmarco-distilbert-base-tas-b` is TAS-B, which is in the OpenAI table too. Next to them is BM25 from `rank_bm25` 0.2.2, plain word matching. Search is exact, every query against every document.

TAS-B is how I checked that my numbers mean the same as theirs. On the 4 datasets I got 64.28, 31.89, 42.70 and 30.02, where the table has 64.3, 31.9, 42.9 and 30.0. My BM25 is not theirs: on SciFact it is 1.3 points lower, on ArguAna 7 points higher. BM25 in BEIR is Elasticsearch with its own settings, so I keep mine only for orientation.

The first run showed me how slow this is. TAS-B on SciFact took 55 minutes for 5183 abstracts, on `sentence-transformers` 2.2.0 with torch 1.11. On the way I lost track of it, started a second copy and killed it only when I saw both in the process list. Most of the grid then went to a second install that is about 3 times faster on this CPU. I ran 4 cells on both installs and nDCG@10 came out exactly the same.

## Per dataset

<figure class="fig">
<svg viewBox="0 0 680 376" role="img" aria-label="nDCG@10 on 4 BEIR datasets. SciFact: OpenAI S 67.2, M 70.4, L 74.4, XL 75.4; all-MiniLM-L6-v2 64.5, multi-qa-MiniLM-L6-cos-v1 54.0, msmarco-distilbert-base-tas-b 64.3, multi-qa-mpnet-base-dot-v1 58.9, all-mpnet-base-v2 65.6; BM25 65.2. NFCorpus: OpenAI S 33.2, M 36.7, L 38.0, XL 40.7; all-MiniLM-L6-v2 31.6, multi-qa-MiniLM-L6-cos-v1 29.7, msmarco-distilbert-base-tas-b 31.9, multi-qa-mpnet-base-dot-v1 31.9, all-mpnet-base-v2 33.3; BM25 30.6. ArguAna: OpenAI S 47.0, M 49.2, L 46.9, XL 43.5; all-MiniLM-L6-v2 50.2, multi-qa-MiniLM-L6-cos-v1 49.1, msmarco-distilbert-base-tas-b 42.7, multi-qa-mpnet-base-dot-v1 50.4, all-mpnet-base-v2 46.5; BM25 38.5. FiQA: OpenAI S 38.4, M 42.2, L 45.2, XL 51.2; all-MiniLM-L6-v2 36.9, multi-qa-MiniLM-L6-cos-v1 36.4, msmarco-distilbert-base-tas-b 30.0, multi-qa-mpnet-base-dot-v1 48.8, all-mpnet-base-v2 50.0; BM25 21.7.">
  <text x="10" y="16" class="f-label f-muted">nDCG@10 on 4 BEIR datasets</text>
  <circle cx="16" cy="34" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/><text x="26" y="38" class="f-label f-ink">OpenAI, numbers from their paper</text>
  <circle cx="276" cy="34" r="4" class="f-ink"/><text x="286" y="38" class="f-label f-ink">free models, my run</text>
  <line x1="490" y1="28" x2="490" y2="40" class="f-line f-muted" stroke-width="2"/><text x="498" y="38" class="f-label f-muted">BM25, my run</text>
  <text x="108" y="96" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SciFact</text>
  <line x1="120" y1="92" x2="660" y2="92" class="f-line f-muted" opacity="0.4"/>
  <line x1="526.7" y1="85" x2="526.7" y2="99" class="f-line f-muted" stroke-width="2"/>
  <circle cx="544.8" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="544.8" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="573.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="573.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="609.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="609.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="618.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="618.6" y="63" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="520.6" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="426.3" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="518.5" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="470.2" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="530.1" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <text x="530.1" y="119" text-anchor="middle" class="f-label f-ink" style="font-size:11px">best free 65.6</text>
  <text x="108" y="166" text-anchor="end" class="f-mono f-ink" style="font-size:12px">NFCorpus</text>
  <line x1="120" y1="162" x2="660" y2="162" class="f-line f-muted" opacity="0.4"/>
  <line x1="215.5" y1="155" x2="215.5" y2="169" class="f-line f-muted" stroke-width="2"/>
  <circle cx="238.8" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="238.8" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="270.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="270.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="282.0" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="282.0" y="133" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="306.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="306.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="224.3" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="207.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="239.6" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <text x="239.6" y="189" text-anchor="middle" class="f-label f-ink" style="font-size:11px">best free 33.3</text>
  <text x="108" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ArguAna</text>
  <line x1="120" y1="232" x2="660" y2="232" class="f-line f-muted" opacity="0.4"/>
  <line x1="286.1" y1="225" x2="286.1" y2="239" class="f-line f-muted" stroke-width="2"/>
  <circle cx="331.5" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="331.5" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="362.1" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="362.1" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="363.0" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="363.0" y="203" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="382.8" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="382.8" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="391.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="382.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="324.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="393.5" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="358.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <text x="393.5" y="259" text-anchor="middle" class="f-label f-ink" style="font-size:11px">best free 50.4</text>
  <text x="108" y="306" text-anchor="end" class="f-mono f-ink" style="font-size:12px">FiQA</text>
  <line x1="120" y1="302" x2="660" y2="302" class="f-line f-muted" opacity="0.4"/>
  <line x1="135.0" y1="295" x2="135.0" y2="309" class="f-line f-muted" stroke-width="2"/>
  <circle cx="285.6" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="285.6" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="319.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="319.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="346.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="346.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="400.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="400.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="271.8" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="267.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="210.2" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="379.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="389.6" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <text x="389.6" y="329" text-anchor="middle" class="f-label f-ink" style="font-size:11px">best free 50.0</text>
  <line x1="120" y1="352" x2="120" y2="356" class="f-line f-muted"/><text x="120" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">20</text>
  <line x1="210" y1="352" x2="210" y2="356" class="f-line f-muted"/><text x="210" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">30</text>
  <line x1="300" y1="352" x2="300" y2="356" class="f-line f-muted"/><text x="300" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">40</text>
  <line x1="390" y1="352" x2="390" y2="356" class="f-line f-muted"/><text x="390" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">50</text>
  <line x1="480" y1="352" x2="480" y2="356" class="f-line f-muted"/><text x="480" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">60</text>
  <line x1="570" y1="352" x2="570" y2="356" class="f-line f-muted"/><text x="570" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">70</text>
  <line x1="660" y1="352" x2="660" y2="356" class="f-line f-muted"/><text x="660" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">80</text>
</svg>
<figcaption>Letters are the 4 OpenAI sizes from table 6 of the paper. Dots are the free models, the labelled dot is the best of them on that dataset.</figcaption>
</figure>

On average my guess held, close to its lower edge. XL is at 52.7 on these 4 datasets. The best single free model, `all-mpnet-base-v2`, is at 48.8. That is 3.9 points lower and 2.4 above S. Against S, taking the best free model on each dataset, the free side wins on ArguAna and FiQA. On NFCorpus `all-mpnet-base-v2` has 33.29 against 33.2, which I count as a draw. On SciFact the free side loses.

But the average is made of very different rows. On SciFact XL has 75.4 and `all-mpnet-base-v2` has 65.6, almost 10 points less. On NFCorpus it is 40.7 against 33.3.

ArguAna goes the other way. `multi-qa-mpnet-base-dot-v1` gets 50.4 and `all-MiniLM-L6-v2` gets 50.2. Of the 4 OpenAI sizes M is the best with 49.2 and XL the worst with 43.5, in OpenAI's own table. Here the query is a whole argument and the answer is the argument against it. My guess is that this is just a different task from answering a question, but I did not test it. In the same table XL is also below S on Quora and `TREC-COVID`, which I did not run.

FiQA surprised me the most. `multi-qa-mpnet-base-dot-v1` was the first to finish there, with 48.8 against 51.2 for XL, above L. That looked too good, so I opened the list of what the model was trained on. It includes title and answer pairs from money.stackexchange.com. FiQA is built from the same site. 4 of my 5 free models have it, all except TAS-B. Their authors published those pairs, 29404 for this site, so I compared. For 532 of the 648 test questions the question is a title there, paired with an answer that FiQA marks as relevant.

I nearly left `all-mpnet-base-v2` out of FiQA, because it needs 3.8 hours there even on the faster install. It finished with 50.0, the best free result there and 1.2 below XL. Its training list has the same pairs.

I expected the scores to fall on the other 116 questions. They barely moved: 48.6 against 48.8 for `multi-qa-mpnet-base-dot-v1`, 48.3 against 50.3 for `all-mpnet-base-v2`. But the 116 are not clean either. 72 of them are titles there too with another answer. 5 more have a relevant answer among the pairs. Only 39 questions appear in neither way. On them the 2 models get 44.8 and 43.4. TAS-B, which never saw this site, gets 31.7 there against 29.9 on the other 609. So the lead of `all-mpnet-base-v2` over TAS-B is 12 points on the 39 and 20 on the rest. On the 39 its standard error is about 6. With so few questions I cannot tell if the overlap helps. OpenAI says their models were trained on data from the internet, so the same pages could be in theirs too.

## What it costs

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="Encoding the corpora and test queries of all 4 datasets, 15.0 million tokens. Ada $120.29, average nDCG@10 46.5. Babbage $180.43, average nDCG@10 49.6. Curie $902.16, average nDCG@10 51.1. Davinci $9,021.57, average nDCG@10 52.7. all-mpnet on my CPU $0, average nDCG@10 48.8.">
  <text x="10" y="16" class="f-label f-muted">Encoding the corpora and test queries of all 4 datasets, 15.0 million tokens</text>
  <text x="670" y="30" text-anchor="end" class="f-label f-muted" style="font-size:11px">average nDCG@10</text>
  <text x="220" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Ada (S)</text>
  <rect x="230" y="37" width="4.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="240.0" y="49" class="f-label f-ink">$120.29</text>
  <text x="670" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">46.5</text>
  <text x="220" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Babbage (M)</text>
  <rect x="230" y="67" width="6.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="242.0" y="79" class="f-label f-ink">$180.43</text>
  <text x="670" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">49.6</text>
  <text x="220" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Curie (L)</text>
  <rect x="230" y="97" width="30.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="266.0" y="109" class="f-label f-ink">$902.16</text>
  <text x="670" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">51.1</text>
  <text x="220" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Davinci (XL)</text>
  <rect x="230" y="127" width="300.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="536.0" y="139" class="f-label f-ink">$9,021.57</text>
  <text x="670" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">52.7</text>
  <line x1="10" y1="156" x2="670" y2="156" class="f-line f-muted" opacity="0.4"/>
  <text x="220" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">all-mpnet on my CPU</text>
  <text x="236" y="175" class="f-label f-ink">$0</text>
  <text x="670" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">48.8</text>
</svg>
<figcaption>Prices from the OpenAI page as of late April 2022, tokens counted with the GPT-2 tokenizer. Sizes are matched to API models by vector length. Averages over the same 4 datasets, OpenAI from their paper, the best single free model from my run.</figcaption>
</figure>

I counted the tokens with the GPT-2 tokenizer and cut documents at 2040 tokens. Reimers mentions this cut in an update to his post, from a script the paper's author later provided. The prices are from the OpenAI page at the end of April: $0.008 per 1000 tokens on Ada and $0.60 on Davinci, 75 times more. The corpora and test queries of all 4 datasets are 15.0 million tokens. That is $120.29 on Ada and $9021.57 on Davinci. FiQA alone is $5960 of it.

Davinci gives 12288 numbers per document. In float32 the vectors of FiQA take 2.8 GB, against 89 MB with the 384 numbers of MiniLM.

The free side costs CPU time. `all-MiniLM-L6-v2` encoded SciFact in 11 minutes on the same 2.2.0 and 4 cores. On the faster install the 3 models with 768 numbers took 6 to 16 times longer than MiniLM on SciFact.

So which one I should use depends on what my notes look like. If they look like SciFact, XL in the paper is about 10 points of nDCG@10 above the best free model. SciFact alone costs $1015.80 to encode on Davinci, so it is about $1000 per 5000 abstracts. If they look like ArguAna, `all-MiniLM-L6-v2` with 22M parameters is 0.2 behind the best free model and above every OpenAI size. I will only know after I write a small set of questions with marked answers for my own notes. I have never done that for anything I search.

## What I did not check

- The API itself. Reimers got different results from the paper on FiQA with the API and later traced it to how long texts are cut. The models behind the API could also have changed since the paper.
- 7 of the 11 datasets from the table, including Quora and `TREC-COVID` where XL loses to S. On 4 cores they would take weeks for MiniLM and months for the bigger models.
- Overlap with training data on the other 3 datasets. I only looked at FiQA because its number looked suspicious.
- Rerankers and SPLADE. In the paper SPLADE v2 has 52.7 on average over the 11, 0.1 below XL.
