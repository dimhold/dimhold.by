---
title: "Halfway through the upgrade, half of my corpus scored 0"
description: "A version bump inside one model family looked like a patch release, so I measured what it does to retrieval. 2.19 of the top 10 slots change while nDCG@10 moves in the third decimal, a fixed 0.8 cosine cutoff goes from passing 97.5% of results to passing 1.8%. The index that is halfway through the migration returns 0 relevant documents for half the corpus."
date: 2026-09-13
lang: en
translationKey: embedding-version-drift
tags: ["machine-learning", "llm", "reliability"]
---
2 version bumps had been sitting in my notes for months, one line each: `bge-base-en` to `bge-base-en-v1.5` and `e5-base` to `e5-base-v2`. The bge note promises better retrieval. e5 ships v2 with no note at all, just a higher number in a score table. Both look like an upgrade you take without thinking, the way you take a patch release of a library.

The only question I asked was how many hours the corpus needs to be encoded again, because that is the part with a bill attached.

What the bump does to the answers I had never measured. I assumed a version inside one family is a small step, with the old vectors and the new ones in roughly the same place. In the end I ran 4 pairs, 2 families at 2 sizes, which took 5 hours of CPU against the 1.5 one pair needs.

## The setup

SciFact from BEIR: 5183 documents and 300 test queries with 339 lines of relevance labels. Exact cosine over normalized vectors, no approximate index anywhere, so nothing below comes from a graph rebuild. Python 3.12.3, torch 2.14.0 on CPU, `sentence-transformers` 6.0.1, numpy 2.5.3, 4 cores and no GPU. Encoding the corpus once takes from 15 minutes on the small models to 85 minutes on a base model. The machine had other work on it, so treat those minutes as an order of magnitude. Input is capped at 512 tokens, e5 gets its `query: ` and `passage: ` prefixes and bge gets the query instruction from its card.

Before trusting any of it I checked the harness against published MTEB scores on the same dataset. 4 of the 8 land on the published number to 4 decimals: `e5-base` at 0.7308, `e5-base-v2` at 0.7194, `bge-small-en-v1.5` at 0.7127, `e5-small` at 0.6560. 3 more differ in the fourth decimal. The odd one is `bge-base-en-v1.5`, where I get 0.7404, which is exactly what the BAAI model card says, while the MTEB results repository says 0.7435.

## The list moves and the score does not

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="One row per pair of model versions. A bar shows how much of the old top 10 is still there after the bump and 2 numbers show nDCG@10 before and after. bge-base-en 1 -&gt; 1.5: 7.81 of 10 kept, nDCG@10 0.732 against 0.740; e5-base 1 -&gt; 2: 5.76 of 10 kept, nDCG@10 0.731 against 0.719; bge-small-en 1 -&gt; 1.5: 7.85 of 10 kept, nDCG@10 0.700 against 0.713; e5-small 1 -&gt; 2: 4.43 of 10 kept, nDCG@10 0.656 against 0.688. The bars lose between a fifth and more than half of the slots while the quality numbers move in the second or third decimal, and in one row the newer version scores lower.">
  <text x="12" y="16" class="f-label f-muted">300 queries, what a version bump does to the top 10</text>
  <text x="176" y="36" class="f-label f-muted">of the old top 10 still there</text>
  <text x="440" y="36" class="f-label f-muted">kept</text>
  <text x="500" y="36" class="f-label f-muted">nDCG@10 before</text>
  <text x="598" y="36" class="f-label f-muted">after</text>
  <text x="12" y="61" class="f-label f-ink">bge-base-en 1 -&gt; 1.5</text>
  <rect x="176" y="46" width="240" height="20" class="f-box"/>
  <rect x="176" y="46" width="187.4" height="20" class="f-plain"/>
  <text x="440" y="61" class="f-mono f-ink">7.81</text>
  <text x="500" y="61" class="f-mono f-muted">0.732</text>
  <text x="598" y="61" class="f-mono f-accent">0.740</text>
  <text x="12" y="91" class="f-label f-ink">e5-base 1 -&gt; 2</text>
  <rect x="176" y="76" width="240" height="20" class="f-box"/>
  <rect x="176" y="76" width="138.2" height="20" class="f-plain"/>
  <text x="440" y="91" class="f-mono f-ink">5.76</text>
  <text x="500" y="91" class="f-mono f-muted">0.731</text>
  <text x="598" y="91" class="f-mono f-accent">0.719</text>
  <text x="12" y="121" class="f-label f-ink">bge-small-en 1 -&gt; 1.5</text>
  <rect x="176" y="106" width="240" height="20" class="f-box"/>
  <rect x="176" y="106" width="188.5" height="20" class="f-plain"/>
  <text x="440" y="121" class="f-mono f-ink">7.85</text>
  <text x="500" y="121" class="f-mono f-muted">0.700</text>
  <text x="598" y="121" class="f-mono f-accent">0.713</text>
  <text x="12" y="151" class="f-label f-ink">e5-small 1 -&gt; 2</text>
  <rect x="176" y="136" width="240" height="20" class="f-box"/>
  <rect x="176" y="136" width="106.3" height="20" class="f-plain"/>
  <text x="440" y="151" class="f-mono f-ink">4.43</text>
  <text x="500" y="151" class="f-mono f-muted">0.656</text>
  <text x="598" y="151" class="f-mono f-accent">0.688</text>
</svg>
<figcaption>4 pairs of model versions over the same 5183 documents and 300 queries. The bar is how much of the old top 10 the bump left in place, the 2 numbers are nDCG@10 before and after. bge base 1 -> 1.5 keeps 7.81 slots and gains 0.0081, e5 small 1 -> 2 keeps 4.43 and gains 0.0315, e5 base 1 -> 2 keeps 5.76 and scores 0.0114 lower than the version it replaces.</figcaption>
</figure>

`bge-base-en-v1.5` keeps 7.81 of the old top 10 and 85.3% of the first places. Its nDCG@10 goes from 0.7323 to 0.7404 and recall@10 from 0.8712 to 0.8742. 240 of the 300 queries come back with exactly the same nDCG as before, 37 improve and 23 get worse. So 2.19 slots out of 10 hold a different document while the quality number moves in the third decimal.

`e5-small-v2` is the loud one. It keeps 4.43 of 10 and 59% of first places. For 1 query the old winner comes back at rank 1423. Its nDCG goes up anyway, 0.6560 to 0.6875. `e5-base-v2` moves 4.24 slots out of 10 and scores lower than the version it replaces, 0.7194 against 0.7308, which is also what MTEB says.

The churn lands where the old ranking was a coin flip. For `bge-base-en` the queries that kept their winner had it leading the runner up by 0.0221 on average. The queries that lost it had a lead of 0.0033. That gap runs the same way in all 4 pairs. What they cost is a separate question, where I have only 4 points: in 3 the queries that lost a winner came out ahead anyway, the 44 bge ones going from 0.3959 to 0.4135. The e5 base pair is the exception, 80 queries losing a winner and dropping from 0.5020 to 0.4451.

## 2 ways to break

<figure class="fig">
<svg viewBox="0 0 640 176" role="img" aria-label="A table with 2 columns for 4 pairs of model versions. The left column is how close the 2 versions place the same document, as a bar from 0 to 1. The right column is the share of top 10 scores above a fixed 0.8 cutoff, before and after the bump. bge-base-en 1 -&gt; 1.5: same document cosine 0.892, top 10 above 0.8 goes from 97.5% to 1.8%; e5-base 1 -&gt; 2: same document cosine 0.606, top 10 above 0.8 goes from 82.1% to 75.6%; bge-small-en 1 -&gt; 1.5: same document cosine 0.914, top 10 above 0.8 goes from 99.9% to 8.3%; e5-small 1 -&gt; 2: same document cosine -0.007, top 10 above 0.8 goes from 98.5% to 98.6%. The 2 columns do not move together: the pair that keeps its geometry loses the cutoff and the pair that keeps the cutoff loses its geometry.">
  <text x="12" y="16" class="f-label f-muted">2 ways to break, one per column</text>
  <text x="190" y="34" class="f-label f-muted">same document, both versions</text>
  <text x="190" y="50" class="f-label f-muted">0</text>
  <text x="310" y="50" text-anchor="middle" class="f-label f-muted">1</text>
  <text x="430" y="34" class="f-label f-muted">top 10 above 0.8</text>
  <text x="430" y="50" class="f-label f-muted">before</text>
  <text x="548" y="50" class="f-label f-muted">after</text>
  <text x="12" y="72" class="f-label f-ink">bge-base-en 1 -&gt; 1.5</text>
  <rect x="190" y="58" width="120" height="18" class="f-box"/>
  <rect x="190" y="58" width="107" height="18" class="f-plain"/>
  <text x="318" y="72" class="f-mono f-ink">0.892</text>
  <text x="430" y="72" class="f-mono f-muted">97.5%</text>
  <text x="548" y="72" class="f-mono f-accent">1.8%</text>
  <text x="12" y="100" class="f-label f-ink">e5-base 1 -&gt; 2</text>
  <rect x="190" y="86" width="120" height="18" class="f-box"/>
  <rect x="190" y="86" width="72.7" height="18" class="f-plain"/>
  <text x="318" y="100" class="f-mono f-ink">0.606</text>
  <text x="430" y="100" class="f-mono f-muted">82.1%</text>
  <text x="548" y="100" class="f-mono f-accent">75.6%</text>
  <text x="12" y="128" class="f-label f-ink">bge-small-en 1 -&gt; 1.5</text>
  <rect x="190" y="114" width="120" height="18" class="f-box"/>
  <rect x="190" y="114" width="109.6" height="18" class="f-plain"/>
  <text x="318" y="128" class="f-mono f-ink">0.914</text>
  <text x="430" y="128" class="f-mono f-muted">99.9%</text>
  <text x="548" y="128" class="f-mono f-accent">8.3%</text>
  <text x="12" y="156" class="f-label f-ink">e5-small 1 -&gt; 2</text>
  <rect x="190" y="142" width="120" height="18" class="f-box"/>
  <rect x="190" y="142" width="0" height="18" class="f-plain"/>
  <text x="318" y="156" class="f-mono f-ink">-0.007</text>
  <text x="430" y="156" class="f-mono f-muted">98.5%</text>
  <text x="548" y="156" class="f-mono f-accent">98.6%</text>
</svg>
<figcaption>The same 4 pairs, 2 things that can break. On the left, where the 2 versions put one and the same document: 0.892 for the bge base pair against -0.007 for the e5 small one. On the right, how much of the top 10 clears a fixed 0.8 cutoff. The bge pair keeps its geometry and takes the share clearing that cutoff from 97.5% to 1.8%. On the e5 small pair that share barely moves, 98.6% against 98.5%. There is no geometry left to keep.</figcaption>
</figure>

The bge bump keeps the geometry. The same document sits at cosine 0.892 with itself across the 2 versions. A new query against the old index scores 0.7261 nDCG against 0.7323 native, so a stale index still answers. What moved is the scale. A cutoff of `cos > 0.8` is the sort of number that ends up in a config file. It passes 97.5% of top 10 scores before the bump against 1.8% after. 2 random documents in the collection sat at 0.82 in the old version and sit at 0.58 in the new one. `bge-small-en` does the same thing harder, 99.9% down to 8.3%.

That part was announced and I had not read it. The v1.5 release note says the models alleviate the issue of the similarity distribution, which is exactly this number. I had read the words about better retrieval in the same sentence and stopped there.

e5 small breaks the other way round. The share clearing that cutoff barely moves, 98.5% against 98.6%. The same document across its 2 versions sits at cosine -0.007. Searching the old index with a new query gives 0.0021 where the old model on its own index gives 0.6560. I spent a while looking for a sign error in my own code before I accepted the number. The e5 base pair sits between the two, with the same document at 0.6061 and the share going from 82.1% to 75.6%.

One number here deserves a warning, because a dashboard usually watches it. The mean similarity of the top hit is flat across the e5 small bump, 0.8682 before and 0.8724 after. It cannot tell you that the space moved underneath. In the actually broken state it does not stay quiet: the mean top hit is 0.0573, with 0% of the top 10 above 0.8.

## The state in the middle

<figure class="fig">
<svg viewBox="0 0 640 208" role="img" aria-label="4 pairs of bars, one pair per model version pair, on an nDCG@10 scale that starts at zero. The upper bar of each pair is the queries whose labelled document already carries a new vector, the lower one is the queries whose document does not. bge-base-en 1 -&gt; 1.5: 0.8011 against 0.4868, 83.7% of the slots to the re-embedded half; e5-base 1 -&gt; 2: 0.7670 against 0.0000, 100.0% of the slots to the re-embedded half; bge-small-en 1 -&gt; 1.5: 0.7261 against 0.5799, 59.6% of the slots to the re-embedded half; e5-small 1 -&gt; 2: 0.7153 against 0.0000, 100.0% of the slots to the re-embedded half. In 2 of the 4 the lower bar is zero, and in the friendliest pair it is still a third shorter than the upper one.">
  <text x="12" y="16" class="f-label f-muted">half of the corpus re-embedded, the other half not</text>
  <rect x="214" y="24" width="12" height="10" class="f-plain"/>
  <text x="232" y="33" class="f-label f-muted">queries whose labelled document is in the re-embedded half</text>
  <rect x="214" y="40" width="12" height="10" class="f-box"/>
  <text x="232" y="49" class="f-label f-muted">queries whose labelled document is not</text>
  <text x="12" y="33" class="f-label f-muted">nDCG@10</text>
  <text x="12" y="74" class="f-label f-ink">bge-base-en 1 -&gt; 1.5</text>
  <rect x="214" y="62" width="301.6" height="12" class="f-plain"/>
  <text x="523.6" y="72" class="f-mono f-ink">0.8011</text>
  <rect x="214" y="77" width="183.3" height="12" class="f-box"/>
  <text x="405.3" y="87" class="f-mono f-accent">0.4868</text>
  <text x="12" y="108" class="f-label f-ink">e5-base 1 -&gt; 2</text>
  <rect x="214" y="96" width="288.8" height="12" class="f-plain"/>
  <text x="510.8" y="106" class="f-mono f-ink">0.7670</text>
  <rect x="214" y="111" width="0" height="12" class="f-box"/>
  <text x="222" y="121" class="f-mono f-accent">0.0000</text>
  <text x="12" y="142" class="f-label f-ink">bge-small-en 1 -&gt; 1.5</text>
  <rect x="214" y="130" width="273.4" height="12" class="f-plain"/>
  <text x="495.4" y="140" class="f-mono f-ink">0.7261</text>
  <rect x="214" y="145" width="218.3" height="12" class="f-box"/>
  <text x="440.3" y="155" class="f-mono f-accent">0.5799</text>
  <text x="12" y="176" class="f-label f-ink">e5-small 1 -&gt; 2</text>
  <rect x="214" y="164" width="269.3" height="12" class="f-plain"/>
  <text x="491.3" y="174" class="f-mono f-ink">0.7153</text>
  <rect x="214" y="179" width="0" height="12" class="f-box"/>
  <text x="222" y="189" class="f-mono f-accent">0.0000</text>
</svg>
<figcaption>Every second document encoded again, read by which half holds the labelled document. 143 queries have all their labels in the re-encoded half and 148 in the untouched one, 9 have labels in both and are not on the chart. On the finished index the same 2 groups sit within 0.0136 of each other for the bge base pair, so the gap here is made by the mixed index.</figcaption>
</figure>

The state nobody publishes numbers for is the migration itself. For hours or days half the collection carries new vectors and the other half old ones. I built that index directly: every second document encoded again, the rest untouched, queries from the new model. A real backfill walks a growing set instead, so this is the shape of the problem and not its schedule.

For `bge-base-en-v1.5` the half index scores 0.6408, below both clean ends. The migrated half takes 83.7% of all top 10 slots against 48.9% in the finished index. Queries whose labelled document had already been encoded again score 0.8011, better than they do in the finished index. Queries whose document was still waiting score 0.4868. On the full index those same 2 groups score 0.7335 and 0.7471. So the mixed index is what makes that split. 9 of the 300 queries have labels in both halves and fall outside both groups.

Both e5 pairs take that to the end. 100% of the slots go to the migrated half. The queries waiting on the other half score 0.0000, which is 0 relevant documents in the 1480 slots those 148 queries get. Why the migrated half wins I can explain for one family only. For `e5-base` the 2 halves are on different scales, mean cosine 0.7289 to the new side against 0.4391 to the old one. `e5-small` is starker still at 0.7774 against -0.0146. For `bge-base-en` the means run the other way, 0.4623 against 0.4861, so whatever takes the slots there is not the mean. I do not know what it is.

## A rotation instead of a rebuild

There is a paper on exactly this, `Drift-Adapter` (arXiv:2509.23471). It fits a small map from the new space into the old one and reports 95 to 99% of the recall of a full rebuild. On this data an orthogonal Procrustes map fitted on 4000 document pairs gives nDCG 0.7317 for the bge base pair against 0.7323 native, 0.7177 against 0.7308 for e5 base, 0.5606 against 0.6560 for e5 small. The last one is 85% of the way back between 2 spaces whose mean cosine on the same document is 0.

I read that as a shortfall until I noticed I was answering a different question. The paper counts Recall@10 against a full rebuild. On that metric this data gives 100.2% for bge base, 99.2% for e5 base, 97.8% for bge small and 86.1% for e5 small. 3 of my 4 pairs sit inside its band. My framing was what made them look worse.

My 4000 pairs are also not the small sample the paper has in mind. They are 4000 of the 5183 documents in the index the queries then search. 214 of the 283 labelled documents are among them. So I fitted the same map from `bge-small-en` to itself, where the right answer is the identity matrix. At 200 pairs it loses 0.036, 0.6635 against 0.6995. At 4000 it loses nothing at all. That kills the excuse I wanted: at the sample size I used, the gap above is drift rather than the price of a cheap fit.

## What I did not check

No approximate index, so I have no number for what an HNSW graph adds on top. One corpus, one domain and English only. No vendor jump anywhere, which is what most postmortems are about. I ran the bge v1.5 models with the query instruction even though their card calls it optional.

What changed here: the encoder version goes into the same file as any score threshold. A partly encoded index does not get served. Cutting over both halves at once was already the plan for other reasons. The number for the alternative is 0.6408 against 0.7404.
