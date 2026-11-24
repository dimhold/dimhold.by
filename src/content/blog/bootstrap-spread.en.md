---
title: "A 95% bootstrap interval that caught the true mean 68 times out of 100"
description: "I counted how often a 95% percentile bootstrap interval really holds the truth, on samples from the NASA HTTP log of July 1995 and on 4 known distributions. For the mean of 20 replies it was 68.5%, for the median 94.0%."
date: 2015-08-01
lang: en
translationKey: bootstrap-spread
tags: ["statistics", "numbers", "algorithms"]
---

I drew the first histogram from 0 to 60,000, because I knew that the true mean is 22,741. It cut off 3,185 values of 10,000. When I moved the edge to 240,000 I saw a hump, then a gap, then one more hump, 5 of them big enough to see. These are 10,000 bootstrap means of one sample of 20 web replies, in bytes. One reply of the 20 has 835,394 bytes. The humps differ by how many times a resample took it.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Histogram of 10,000 bootstrap means of one sample of 20 reply sizes. Separate humps with gaps between them: the resample took the reply of 835,394 bytes 0, 1, 2, 3, 4 or more times. The true mean 22,741 is inside the first hump. The interval runs from 8,818 to 141,714.">
  <rect x="30.5" y="239.7" width="9.3" height="0.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="40.8" y="223.2" width="9.3" height="16.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="51.2" y="152.2" width="9.3" height="87.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="61.5" y="85.8" width="9.3" height="154.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="71.8" y="127.2" width="9.3" height="112.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="82.2" y="203.4" width="9.3" height="36.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="92.5" y="233.7" width="9.3" height="6.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="102.8" y="239.4" width="9.3" height="0.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="144.2" y="233.3" width="9.3" height="6.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="154.5" y="173.7" width="9.3" height="66.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="164.8" y="91.1" width="9.3" height="148.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="175.2" y="105.0" width="9.3" height="135.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="185.5" y="185.9" width="9.3" height="54.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="195.8" y="229.3" width="9.3" height="10.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="206.2" y="239.2" width="9.3" height="0.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="216.5" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="247.5" y="239.0" width="9.3" height="1.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="257.8" y="221.1" width="9.3" height="18.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="268.2" y="169.7" width="9.3" height="70.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="278.5" y="162.6" width="9.3" height="77.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="288.8" y="202.0" width="9.3" height="38.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="299.2" y="231.2" width="9.3" height="8.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="309.5" y="239.1" width="9.3" height="0.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="319.8" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="350.8" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="361.2" y="237.1" width="9.3" height="2.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="371.5" y="222.8" width="9.3" height="17.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="381.8" y="216.5" width="9.3" height="23.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="392.2" y="224.6" width="9.3" height="15.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="402.5" y="236.9" width="9.3" height="3.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="412.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="464.5" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="474.8" y="238.1" width="9.3" height="1.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="485.2" y="234.0" width="9.3" height="6.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="495.5" y="236.3" width="9.3" height="3.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="505.8" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="516.2" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="578.2" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="588.5" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="598.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="609.2" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <line x1="30.0" y1="240.0" x2="650.0" y2="240.0" style="stroke:var(--muted);stroke-width:1"/>
  <text x="30.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="185.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="340.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="495.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <text x="650.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="650.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">mean of a resample, thousands of bytes</text>
  <text x="102.2" y="115.8" text-anchor="start" class="f-mono f-ink" style="font-size:13px">× 0</text>
  <text x="169.5" y="83.1" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 1</text>
  <text x="283.2" y="154.6" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 2</text>
  <text x="386.5" y="208.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 3</text>
  <text x="489.8" y="226.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 4</text>
  <line x1="52.8" y1="34.0" x2="396.1" y2="34.0" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="52.8" y1="29.0" x2="52.8" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="52.8" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8,818</text>
  <line x1="396.1" y1="29.0" x2="396.1" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.1" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">141,714</text>
  <text x="408.1" y="38.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">bootstrap interval, 95%</text>
  <line x1="88.7" y1="34.0" x2="88.7" y2="240.0" style="stroke:var(--accent);stroke-width:2"/>
  <text x="96.7" y="56.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">true mean 22,741</text>
</svg>
<figcaption>10,000 bootstrap means of the first sample, bytes. Numbers above the humps: how many times the resample took the one reply of 835,394 bytes. 7 means above 240,000 are not drawn.</figcaption>
</figure>

The bootstrap is what I reach for when I don't remember the formula. Write the 20 numbers on cards, pull a card 20 times and put it back every time, take the mean. Repeat many times, sort the means and cut 2.5% from each side. What is left is called a 95% interval. The same code works for a median or a p95. I always took the 95% on trust and never counted how often it is true.

The method was published by Efron in 1979 and its weak places are known. Bickel and Freedman described the failure for the maximum in 1981, Athreya the one for the mean with infinite variance in 1987. Hesterberg wrote last November that this kind of interval is too narrow on small samples. I wanted to see it on data from a real server.

## How I counted

To count misses I need to know the truth. I took the NASA HTTP log for July 1995 from the Internet Traffic Archive, 1,891,715 lines. My whole population is the 1,701,451 replies with status 200 and a known size. Their mean is 22,741 bytes, the median is 4,179, the p95 is 84,905. The largest 1% of replies carry 30% of the bytes.

Then I pull n replies at random, resample them 1,000 times with numpy (`RandomState`, fixed seed) and look if the interval holds the truth. This is repeated 4,000 times for n up to 200 and 2,000 times for larger n. The standard error of one cell is under one point. I did the same with a normal distribution, an exponential, a lognormal with sigma 1 and a Pareto with alpha 1.5, which has a mean but no finite variance. The normal is the control, at n = 1000 its mean was covered 94.7% of the time.

Before the run I wrote 7 expectations into a file. 2 of them held. This is the log, coverage in percent:

| n | mean | median | p95 | ratio of 2 means |
|---|---|---|---|---|
| 20 | 68.5 | 94.0 | 64.9 | 90.8 |
| 50 | 76.1 | 94.8 | 89.6 | 91.3 |
| 100 | 80.2 | 95.0 | 89.9 | 91.9 |
| 200 | 85.2 | 95.2 | 94.0 | 92.6 |
| 500 | 91.8 | 96.9 | 93.8 | 94.5 |
| 1000 | 93.2 | 96.5 | 95.5 | 94.0 |

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Coverage of the 95% percentile bootstrap on the NASA log for samples from 20 to 1000 replies. Mean: 68.5, 76.1, 80.2, 85.2, 91.8, 93.2. Median: 94.0, 94.8, 95.0, 95.2, 96.9, 96.5. p95: 64.9, 89.6, 89.9, 94.0, 93.8, 95.5. Ratio of 2 means: 90.8, 91.3, 91.9, 92.6, 94.5, 94.0.">
  <line x1="190.0" y1="254.0" x2="620.0" y2="254.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="258.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="190.0" y1="199.0" x2="620.0" y2="199.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">70</text>
  <line x1="190.0" y1="144.0" x2="620.0" y2="144.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="190.0" y1="89.0" x2="620.0" y2="89.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="93.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="190.0" y1="34.0" x2="620.0" y2="34.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="190.0" y1="61.5" x2="620.0" y2="61.5" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:5 4"/>
  <text x="630.0" y="65.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">95</text>
  <text x="190.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="290.7" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="366.9" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="443.1" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="543.8" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="620.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="405.0" y="296.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">sample size</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">coverage, %</text>
  <polyline points="190.0,207.4 290.7,165.6 366.9,143.0 443.1,115.7 543.8,79.1 620.0,71.4" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="190.0" cy="207.4" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="290.7" cy="165.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="366.9" cy="143.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.1" cy="115.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.8" cy="79.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="620.0" cy="71.4" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="180.0" y="208.4" text-anchor="end" class="f-mono f-accent" style="font-size:11px">mean 68.5</text>
  <polyline points="190.0,66.9 290.7,62.9 366.9,61.8 443.1,60.5 543.8,51.3 620.0,53.0" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <circle cx="190.0" cy="66.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="62.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="61.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="60.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="51.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="53.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="66.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">median 94.0</text>
  <polyline points="190.0,226.9 290.7,91.1 366.9,89.5 443.1,67.1 543.8,68.4 620.0,58.8" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="190.0" cy="226.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="290.7" cy="91.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="366.9" cy="89.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="443.1" cy="67.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.8" cy="68.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="620.0" cy="58.8" r="3" style="fill:var(--muted);stroke:none"/>
  <text x="180.0" y="233.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">p95 64.9</text>
  <polyline points="190.0,84.3 290.7,81.7 366.9,78.5 443.1,74.6 543.8,64.3 620.0,67.3" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:2 3"/>
  <circle cx="190.0" cy="84.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="81.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="78.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="74.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="64.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="67.3" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="92.3" text-anchor="end" class="f-mono f-ink" style="font-size:11px">ratio of 2 means 90.8</text>
</svg>
<figcaption>Share of samples whose interval holds the true value, NASA log, %. The dashed line is the promised 95%.</figcaption>
</figure>

## The mean

I expected the mean to be fine from n = 50. At n = 20 the interval held it in 2,739 samples of 4,000. The misses are almost all on one side, 1,258 times the whole interval was below the truth and 3 times above it. With 6 other seeds the mean was held from 2,700 to 2,776 times and those 3 became from 4 to 10. With the Pareto the coverage goes from 65.0% at n = 20 only to 78.0% at n = 1000.

I also expected the bootstrap to be no worse than the textbook t interval. On the log it is a draw at n = 20, t held the mean in 2,738 of the same samples, one less. On the normal of the same size t is better, 94.9 against 92.7. The gap never reached 3 points anywhere.

Then I split the samples of a new run by a simple question, whether there is at least one reply from the largest 1%, 298,302 bytes or more. At n = 20 there is no such reply in 82% of samples and their intervals hold the mean 61% of the time. When there is at least one, it is 99.6%. Of 1,276 misses 1,273 are in the first group.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Bars for samples of 20, 50, 100 and 200 replies, each split into 2 parts. Samples with none of the largest 1% of replies: 82.2, 60.3, 36.6, 13.6 percent. Missed the true mean among them: 31.8, 24.2, 19.1, 10.1 percent of all samples. Missed among the rest: 0.1, 0.3, 1.3, 4.7 percent.">
  <text x="60.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">no large reply</text>
  <text x="660.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">1 or more</text>
  <rect x="60.0" y="30" width="189.0" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="249.0" y="30" width="298.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="554.0" y="30" width="105.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="659.6" y="30" width="0.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="49.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">20</text>
  <text x="60.0" y="73.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">missed 31.8%</text>
  <text x="660.0" y="73.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">missed 0.1%</text>
  <rect x="60.0" y="86" width="143.9" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="203.9" y="86" width="214.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="424.2" y="86" width="233.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.1" y="86" width="1.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">50</text>
  <text x="60.0" y="129.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">missed 24.2%</text>
  <text x="660.0" y="129.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">missed 0.3%</text>
  <rect x="60.0" y="142" width="113.8" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="173.8" y="142" width="103.8" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283.6" y="142" width="369.0" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="652.6" y="142" width="7.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="161.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">100</text>
  <text x="60.0" y="185.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">missed 19.1%</text>
  <text x="660.0" y="185.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">missed 1.3%</text>
  <rect x="60.0" y="198" width="60.1" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="120.1" y="198" width="20.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="146.5" y="198" width="485.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="632.1" y="198" width="27.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="217.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">200</text>
  <text x="60.0" y="241.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">missed 10.1%</text>
  <text x="660.0" y="241.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">missed 4.7%</text>
  <rect x="60" y="259" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">missed</text>
  <rect x="180" y="259" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="198.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">held the mean</text>
</svg>
<figcaption>Every bar is 4,000 samples of the NASA log, the percents are of all 4,000. Accent: intervals that missed the true mean. Left of the gap are the samples without a single reply from the largest 1%.</figcaption>
</figure>

So the ugly histogram at the top is from a good sample. 75% of its bytes are in one reply, the interval runs from 8,818 to 141,714 and the truth is inside. My plan was to print the share of the largest value next to the interval, as a warning. I checked it on 4,000 more samples of 20 and it works backwards. Where this share was in the lowest quarter the interval held the mean 47% of the time, in the highest quarter 95%. With the width it is even worse, the narrowest quarter of intervals, shorter than 15,617 bytes, held the mean 1% of the time.

The means of 4,000 samples of 20 have a standard deviation of 17,845. The bootstrap estimate of it, the median over samples, is 6,609. For the median of 20 replies it is 2,238 in truth and 2,363 by bootstrap, close enough for me.

## Median, p95, maximum

The median held everywhere, from 93.4% to 96.9% on all the distributions. Its interval depends only on places in the sorted sample. For 21 values I counted the places exactly with the binomial distribution: from the 7th value to the 15th, whatever the values are, which holds the median 92.2% of the time.

For p95 at n = 20 the coverage is from 63% to 65% on every distribution, the normal too. In 0.95^20 = 35.8% of samples all 20 values are below the true p95 and no resampling can get above the largest of them. I expected it to be fine at n = 100. It was between 88% and 90% everywhere, when the same arithmetic explains only 0.6% of samples. The numpy estimate at this size is nearly the 95th value of 100, so I counted the places again: the interval goes from the 89th value to the 98th and in 11.8% of samples the true p95 is above the 98th. If I take the 96th value for p95, the places are 91 and 99. On 4,000 samples of the normal the coverage was 88.7% with the numpy estimate and 94.0% with the 96th value. I didn't know that one place is worth 5 points.

The maximum of the log was covered 0 times in 16,000 for n up to 200. The largest reply is one row of 1.7 million and the interval can't go above the largest value of the sample.

## The ratio

I expected a ratio of 2 bad means to be worse than one. It was 90.8% at n = 20. Both groups come from the same log, so both means are usually too low and the errors go both ways, 4.5% and 4.7%. But this is an A/A test, the easy case. Against an exponential of the same mean the coverage was 77.2% at n = 20 and 88.5% at n = 200.

I tried one repair, the bootstrap-t. At n = 20 on the log it gave 88.7% against 69.2% for the plain one on the same samples, with intervals 2.1 times wider. At n = 200 it was still 89.6%. And it needs a standard error inside every resample, the formula that I wanted to avoid.

## What I didn't check

I pulled replies independently and real traffic comes in bursts, so on consecutive lines of the log it is probably worse. I did not try BCa, levels other than 95% or more shapes for the ratio. It is one log from 1995. The split by the largest 1% needs the whole population. I don't know yet what to print next to the interval instead of the share.
