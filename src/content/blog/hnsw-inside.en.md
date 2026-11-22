---
title: "Where the speed of HNSW search comes from"
description: "I always explained HNSW speed with its layers. On SIFT1M with faiss 1.7.0 I counted distances per query and switched the upper layers off. The cost did not change."
date: 2021-03-13
lang: en
translationKey: hnsw-inside
tags: ["algorithms", "databases", "performance"]
---
Whenever somebody explains HNSW, there is the same picture. A few graphs are stacked as layers, the top one almost empty, the bottom one with every vector. The search starts at the top, makes long jumps there, goes down and finishes with short steps near the answer. It looks like a skip list and I repeated this explanation myself more than once. When people asked why approximate search is so fast, I said "because of the layers" and nobody asked more.

I never checked it. Faiss 1.7.0 came out at the end of January, so I installed it and decided to look at what happens inside one search.

## The setup

The data is SIFT1M, 1,000,000 vectors of 128 floats. It comes with 10,000 queries and the true 100 nearest neighbors for each of them. I took the copy from `ann-benchmarks` and used the first 1000 queries. Everything ran on Python 3.8 with `faiss-cpu` 1.7.0, on 4 virtual cores of a cloud machine. Search times are for 1 thread and 1 query at a time.

Brute force first, so there is something to compare with. `IndexFlatL2` computes 1,000,000 distances per query and needs 96 ms for it.

Then `IndexHNSWFlat` with M=16 and the default `efConstruction` of 40. It was built in 62 seconds on 4 threads. Faiss gives each vector a random top layer and the chance to go one layer higher is 1 in 16. The counts follow this closely:

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Number of vectors by top HNSW layer, log scale: layer 0 937,597, layer 1 58,500, layer 2 3,693, layer 3 194, layer 4 15, layer 5 1. Each layer has about 16 times fewer vectors than the one below.">
  <line x1="110" y1="6" x2="110" y2="16" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="118" y="15" text-anchor="start" class="f-muted" style="font-size:11px">expected at 1 in 16</text>
  <text x="100" y="40" text-anchor="end" class="f-ink" style="font-size:12px">layer 0</text>
  <rect x="110.0" y="29.0" width="437.9" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="547.9" y1="26" x2="547.9" y2="48" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="555.9" y="41" text-anchor="start" class="f-mono" style="font-size:12px">937,597</text>
  <text x="100" y="68" text-anchor="end" class="f-ink" style="font-size:12px">layer 1</text>
  <rect x="110.0" y="57.0" width="349.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="459.6" y1="54" x2="459.6" y2="76" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="467.6" y="69" text-anchor="start" class="f-mono" style="font-size:12px">58,500</text>
  <text x="100" y="96" text-anchor="end" class="f-ink" style="font-size:12px">layer 2</text>
  <rect x="110.0" y="85.0" width="261.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="371.3" y1="82" x2="371.3" y2="104" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="379.6" y="97" text-anchor="start" class="f-mono" style="font-size:12px">3,693</text>
  <text x="100" y="124" text-anchor="end" class="f-ink" style="font-size:12px">layer 3</text>
  <rect x="110.0" y="113.0" width="167.8" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="283.0" y1="110" x2="283.0" y2="132" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="291.0" y="125" text-anchor="start" class="f-mono" style="font-size:12px">194</text>
  <text x="100" y="152" text-anchor="end" class="f-ink" style="font-size:12px">layer 4</text>
  <rect x="110.0" y="141.0" width="86.2" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="194.7" y1="138" x2="194.7" y2="160" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="204.2" y="153" text-anchor="start" class="f-mono" style="font-size:12px">15</text>
  <text x="100" y="180" text-anchor="end" class="f-ink" style="font-size:12px">layer 5</text>
  <rect x="110.0" y="169.0" width="4.0" height="16.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <line x1="110.0" y1="166" x2="110.0" y2="188" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="122.0" y="181" text-anchor="start" class="f-mono" style="font-size:12px">1</text>
  <line x1="110" y1="196" x2="550" y2="196" class="f-line"/>
  <line x1="110.0" y1="196" x2="110.0" y2="200" class="f-line"/>
  <text x="110.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1</text>
  <line x1="256.7" y1="196" x2="256.7" y2="200" class="f-line"/>
  <text x="256.7" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">100</text>
  <line x1="403.3" y1="196" x2="403.3" y2="200" class="f-line"/>
  <text x="403.3" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">10,000</text>
  <line x1="550.0" y1="196" x2="550.0" y2="200" class="f-line"/>
  <text x="550.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1,000,000</text>
</svg>
<figcaption>Top layer of each of the 1,000,000 SIFT1M vectors in IndexHNSWFlat, M=16, faiss 1.7.0. The bar is the count, the tick is the expectation 1,000,000 × 16^−l × 15/16. The scale is logarithmic.</figcaption>
</figure>

937,597 vectors live only on the bottom layer. A single vector reaches layer 5 and every search starts from it.

The search speed depends on `efSearch`, the length of the candidate list on the bottom layer. With ef=64 one query takes 0.32 ms and finds 90.5% of the true 10 nearest neighbors. With ef=256 it is 1.08 ms and 98.6%. If 9 correct neighbors of 10 are enough, this is about 300 times faster than brute force.

## Counting distances

Time depends on the machine, so I wanted the number of distances. In faiss 1.7.0 the counter `hnsw_stats.ndis` stays at zero. I looked in the source and nothing writes to it. The real count of the bottom layer goes to `n3` and the upper layers are not counted anywhere.

So I wrote the search myself in Python. It walks the same graph with the neighbor lists taken from the faiss index. The algorithm is from the HNSW paper: greedy descent on the upper layers, then a search with a candidate list of size ef on the bottom one.

At ef=64 and ef=256 my search finds almost the same share of neighbors as faiss. It also computes about the same number of distances on the bottom layer, 904 against 876 at ef=64. At ef=16 it finds more, 70.7% against 64.0%. Faiss uses a different stop rule and caps the candidate queue. I did not try to make them equal.

At ef=64 one query costs about 1020 distances out of 1,000,000 in the base. 116 of them are spent on the upper layers, the other 904 on the bottom layer.

## Switching the layers off

Here I expected to see the effect of the layers. I took the same graph, skipped the descent and started the bottom layer search directly from the entry point. If the layers do the long jumps, the bottom layer alone should need many more steps to get to the right region.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Distances computed per query at ef 16, 64 and 256 for three ways to start the bottom layer search: ef 16, with upper layers: 431, 70.7%; ef 16, bottom layer only, from the entry point: 433, 69.3%; ef 16, bottom layer only, random start: 472, 57.7%; ef 64, with upper layers: 1,020, 91.0%; ef 64, bottom layer only, from the entry point: 1,022, 90.3%; ef 64, bottom layer only, random start: 1,103, 82.9%; ef 256, with upper layers: 3,005, 98.6%; ef 256, bottom layer only, from the entry point: 3,000, 98.5%; ef 256, bottom layer only, random start: 3,160, 97.2%.">
  <rect x="20.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="14" text-anchor="start" class="f-muted" style="font-size:11px">upper layers</text>
  <rect x="180.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="198" y="14" text-anchor="start" class="f-muted" style="font-size:11px">bottom layer</text>
  <text x="660" y="14" text-anchor="end" class="f-muted" style="font-size:11px">recall@10</text>
  <text x="20" y="59" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=16</text>
  <text x="88" y="41" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="30.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="30.0" width="44.9" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.4" y="41" text-anchor="start" class="f-mono" style="font-size:11px">431</text>
  <text x="660" y="41" text-anchor="end" class="f-mono f-muted" style="font-size:11px">70.7%</text>
  <text x="88" y="59" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="48.0" width="61.6" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.6" y="59" text-anchor="start" class="f-mono" style="font-size:11px">433</text>
  <text x="660" y="59" text-anchor="end" class="f-mono f-muted" style="font-size:11px">69.3%</text>
  <text x="88" y="77" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="66.0" width="67.3" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="169.3" y="77" text-anchor="start" class="f-mono" style="font-size:11px">472</text>
  <text x="660" y="77" text-anchor="end" class="f-mono f-muted" style="font-size:11px">57.7%</text>
  <text x="20" y="125" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=64</text>
  <text x="88" y="107" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="96.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="96.0" width="128.7" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.3" y="107" text-anchor="start" class="f-mono" style="font-size:11px">1,020</text>
  <text x="660" y="107" text-anchor="end" class="f-mono f-muted" style="font-size:11px">91.0%</text>
  <text x="88" y="125" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="114.0" width="145.5" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.5" y="125" text-anchor="start" class="f-mono" style="font-size:11px">1,022</text>
  <text x="660" y="125" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90.3%</text>
  <text x="88" y="143" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="132.0" width="157.1" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="259.1" y="143" text-anchor="start" class="f-mono" style="font-size:11px">1,103</text>
  <text x="660" y="143" text-anchor="end" class="f-mono f-muted" style="font-size:11px">82.9%</text>
  <text x="20" y="191" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=256</text>
  <text x="88" y="173" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="162.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="162.0" width="411.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.9" y="173" text-anchor="start" class="f-mono" style="font-size:11px">3,005</text>
  <text x="660" y="173" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98.6%</text>
  <text x="88" y="191" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="180.0" width="427.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.3" y="191" text-anchor="start" class="f-mono" style="font-size:11px">3,000</text>
  <text x="660" y="191" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98.5%</text>
  <text x="88" y="209" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="198.0" width="450.0" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="552.0" y="209" text-anchor="start" class="f-mono" style="font-size:11px">3,160</text>
  <text x="660" y="209" text-anchor="end" class="f-mono f-muted" style="font-size:11px">97.2%</text>
  <text x="20" y="228" text-anchor="start" class="f-muted" style="font-size:11px">1. with upper layers</text>
  <text x="20" y="246" text-anchor="start" class="f-muted" style="font-size:11px">2. bottom layer only, from the entry point</text>
  <text x="20" y="264" text-anchor="start" class="f-muted" style="font-size:11px">3. bottom layer only, random start</text>
</svg>
<figcaption>Distances per query, mean of 1000 SIFT1M queries, my Python search over the faiss graph. The accent part of bar 1 is spent on the upper layers. Recall@10 is to the right of each bar.</figcaption>
</figure>

It did not. At ef=64 the search without the upper layers computed 1022 distances, with the layers 1020. Recall@10 was 90.3% against 91.0%. At ef=256 it was 3000 against 3005, so the version without the layers was even a bit cheaper.

The descent itself works. It lands at a median distance of 251 from the query, where a random vector of the base is at 556. For 55% of queries this is already closer than the 100th neighbor. But the search without it needs only about 7 extra steps on the bottom layer. They cost about the same 116 distances that the descent spent.

This is not news, I found it in the literature after the measurement. The HNSW paper says that on high dimensional data it is hard to expect the same speedup from the layers as on low dimensional data. On SIFT their gain is less visible than the gain from how neighbors are selected. The authors still measured some gain on 5 million SIFT vectors, with other settings. Lin and Zhao measured it in 2019 on SIFT1M and other sets and wrote that the hierarchy brings no extra bonus on real data. I had read the paper. I did not remember this part.

## Where I tripped

Then I tried to start the bottom layer from a random vector for each query and the result got worse. At ef=64 the recall fell to 82.9% and the cost grew to 1103 distances. So I decided that the layers matter after all, because they give a good start.

That was wrong. Starting from a random vector of layer 2 or higher gave 85.0%, against 83.5% from a random vector of the bottom layer only. As starts, the vectors of the upper layers are not much better. Faiss picks the level of a vector at random and does not look at the data.

Then I thought the entry point is just closer to the queries. It is, with a median distance of 504, closer than any of the 10 random start vectors I tried. I compared all these starts at ef=16, where the entry point gives 69.3%. The vector nearest to the mean of the base is closer still and starting from it gives 70.4%. The full descent gives 70.7%. But among the 10 random starts the distance did not predict the result: the one at 521 gave 60.4% and a farther one, at 571, gave 61.8%. So I have 2 good starts that are also the 2 closest ones and I do not know what makes a start good.

## The bottom layer

Every vector on the bottom layer has room for 32 neighbors. A vector that lives only there keeps 14 on average after pruning. The search with ef=64 takes about 66 steps and each step computes distances only to the new neighbors of one vector. The HNSW authors credit the pruning heuristic with diverse links and a connected graph. I did not switch it off, so I cannot say how much of the speed is from it. The price of all this is 132 MB of neighbor lists on top of 512 MB of vectors and a minute of build time.

## What I did not check

I tested only SIFT1M with M=16 and `efConstruction` 40 and built the index once. The HNSW paper shows that on data with 4 dimensions the layers give a large speedup, I did not repeat this. Times are from single runs and differ by about 10% between runs, while the distance counts are the same every time. My search is a Python model of the algorithm and not faiss itself. It agrees with faiss at ef 64 and 256 but not at 16.

I will keep drawing the layers when I explain HNSW. On SIFT I will now add that in my test they did not save anything.
