---
title: "How many days deaths lag cases and why my cross correlation found a lag everywhere"
description: "On US data as of October 16, 2020 the cross correlation of cases and deaths peaks at 16 days with r = 0.94. Raw daily numbers give teeth every 7 days, the whole period gives no peak at all. Cases of one country against deaths of another often score as high as the right pair. What the peak is worth and what I would report instead."
date: 2020-10-18
lang: en
translationKey: lag-cross-correlation
tags: ["statistics", "open-data", "time"]
---
Cases are going up again in Europe this month and I wanted one number: how many days after the cases do the deaths come. If the delay is stable, the October rise already tells when the deaths will show up. The US had a clear summer wave, so I took it as the test. My habit for this kind of question is short. I compute the correlation at every shift and take the highest. I had never checked what that highest value is worth.

The data is the JHU CSSE time series from GitHub, commit 13baea2 of October 17 with the last day October 16. New cases and new deaths per day are differences of the cumulative columns. The code is numpy and pandas with a plain Pearson correlation in a loop. The simulated numbers below come from one fixed random seed, so another seed moves them by a little.

## The first answer looked fine

On the 7 day averages from July 1 to October 16 the peak is at 16 days with r = 0.94. A smooth curve with one clear maximum. It is close to the 14 days that Baud and colleagues used in March when they divided deaths by earlier cases. I nearly stopped there.

<figure class="fig">
<svg viewBox="0 0 680 314" role="img" aria-label="Correlation of US new cases with US new deaths shifted by 0 to 35 days. Raw daily numbers, July 1 to October 16: 0: 0.43, 7: 0.53, 14: 0.61, 16: 0.08, 21: 0.59, 28: 0.59, 35: 0.51. 7 day averages, same window: 0: 0.32, 7: 0.71, 14: 0.93, 16: 0.94, 21: 0.88, 28: 0.85, 35: 0.75. 7 day averages, March 1 to October 16: 0: 0.12, 7: 0.11, 14: −0.01, 16: −0.07, 21: −0.23, 28: −0.42, 35: −0.51. The raw curve has teeth every 7 days, the smoothed one has a flat top from 13 to 19 days.">
  <rect x="282.9" y="24" width="102.9" height="220" class="f-box" style="stroke:none;opacity:0.6"/>
  <line x1="60" y1="244.0" x2="660" y2="244.0" class="f-plain"/>
  <text x="54.0" y="248.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−0.6</text>
  <line x1="60" y1="216.5" x2="660" y2="216.5" class="f-plain"/>
  <text x="54.0" y="220.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−0.4</text>
  <line x1="60" y1="189.0" x2="660" y2="189.0" class="f-plain"/>
  <text x="54.0" y="193.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−0.2</text>
  <line x1="60" y1="161.5" x2="660" y2="161.5" class="f-plain" style="stroke:var(--muted)"/>
  <text x="54.0" y="165.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.0</text>
  <line x1="60" y1="134.0" x2="660" y2="134.0" class="f-plain"/>
  <text x="54.0" y="138.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.2</text>
  <line x1="60" y1="106.5" x2="660" y2="106.5" class="f-plain"/>
  <text x="54.0" y="110.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.4</text>
  <line x1="60" y1="79.0" x2="660" y2="79.0" class="f-plain"/>
  <text x="54.0" y="83.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.6</text>
  <line x1="60" y1="51.5" x2="660" y2="51.5" class="f-plain"/>
  <text x="54.0" y="55.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.8</text>
  <line x1="60" y1="24.0" x2="660" y2="24.0" class="f-plain"/>
  <text x="54.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.0</text>
  <text x="60" y="16" class="f-label f-muted">correlation r</text>
  <text x="60.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="180.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="300.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <text x="420.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <text x="540.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">28</text>
  <text x="660.0" y="260.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">35</text>
  <text x="360" y="278" text-anchor="middle" class="f-label f-muted">deaths later than cases, days</text>
  <path d="M60.0,101.8L77.1,139.7L94.3,176.5L111.4,181.9L128.6,150.2L145.7,123.3L162.9,97.4L180.0,88.8L197.1,116.7L214.3,160.0L231.4,160.5L248.6,132.4L265.7,110.5L282.9,85.1L300.0,76.9L317.1,108.3L334.3,150.0L351.4,154.1L368.6,131.6L385.7,109.2L402.9,86.1L420.0,80.5L437.1,108.9L454.3,152.1L471.4,161.3L488.6,142.6L505.7,118.7L522.9,92.6L540.0,81.0L557.1,115.5L574.3,154.3L591.4,168.6L608.6,148.2L625.7,125.3L642.9,97.2L660.0,91.2" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>
  <circle cx="60.0" cy="101.8" r="2.4" class="f-ink"/>
  <circle cx="180.0" cy="88.8" r="2.4" class="f-ink"/>
  <circle cx="300.0" cy="76.9" r="2.4" class="f-ink"/>
  <circle cx="420.0" cy="80.5" r="2.4" class="f-ink"/>
  <circle cx="540.0" cy="81.0" r="2.4" class="f-ink"/>
  <circle cx="660.0" cy="91.2" r="2.4" class="f-ink"/>
  <path d="M60.0,117.7L77.1,108.6L94.3,99.8L111.4,91.9L128.6,84.3L145.7,77.3L162.9,70.6L180.0,64.2L197.1,57.5L214.3,51.7L231.4,46.2L248.6,41.6L265.7,38.1L282.9,35.4L300.0,33.4L317.1,32.6L334.3,32.3L351.4,32.7L368.6,33.9L385.7,35.7L402.9,37.9L420.0,39.9L437.1,41.5L454.3,43.1L471.4,44.3L488.6,45.1L505.7,44.5L522.9,44.0L540.0,45.2L557.1,46.8L574.3,48.2L591.4,49.8L608.6,51.2L625.7,53.4L642.9,55.3L660.0,57.8" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.4"/>
  <circle cx="60.0" cy="117.7" r="2.4" class="f-accent"/>
  <circle cx="180.0" cy="64.2" r="2.4" class="f-accent"/>
  <circle cx="300.0" cy="33.4" r="2.4" class="f-accent"/>
  <circle cx="334.3" cy="32.3" r="2.4" class="f-accent"/>
  <circle cx="420.0" cy="39.9" r="2.4" class="f-accent"/>
  <circle cx="540.0" cy="45.2" r="2.4" class="f-accent"/>
  <circle cx="660.0" cy="57.8" r="2.4" class="f-accent"/>
  <path d="M60.0,145.2L77.1,144.6L94.3,144.4L111.4,144.4L128.6,144.6L145.7,145.1L162.9,145.9L180.0,147.0L197.1,148.4L214.3,150.0L231.4,152.1L248.6,154.4L265.7,157.2L282.9,160.2L300.0,163.5L317.1,167.2L334.3,171.1L351.4,175.3L368.6,179.6L385.7,184.1L402.9,188.6L420.0,193.1L437.1,197.6L454.3,201.9L471.4,206.1L488.6,210.1L505.7,213.6L522.9,216.8L540.0,219.7L557.1,222.3L574.3,224.6L591.4,226.5L608.6,228.1L625.7,229.4L642.9,230.6L660.0,231.8" class="f-line" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="334.3" y="24.3" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">16: 0.94</text>
  <line x1="20" y1="300" x2="42" y2="300" style="stroke:var(--ink);stroke-width:1.4"/>
  <text x="50" y="304" class="f-label f-muted" style="font-size:11px">daily, Jul 1 to Oct 16</text>
  <line x1="235" y1="300" x2="257" y2="300" style="stroke:var(--accent);stroke-width:2.4"/>
  <text x="265" y="304" class="f-label f-muted" style="font-size:11px">7 day average, same</text>
  <line x1="450" y1="300" x2="472" y2="300" style="stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="480" y="304" class="f-label f-muted" style="font-size:11px">7 day average, Mar 1 to Oct 16</text>
</svg>
<figcaption>US, JHU CSSE data as of October 16, 2020. Correlation between new cases on day t and new deaths on day t plus the lag. The shaded band is where the 7 day average curve is above 0.9.</figcaption>
</figure>

Then I ran the same function on the raw daily numbers and the curve became a saw. The highest point is at 14 days with 0.615, but 21 days gives 0.589 and 28 gives 0.586. The teeth are 7 days apart. On an average Sunday in this window the US reports about 7% of the week's deaths and on a Wednesday about 19%. So I am fairly sure what I see is the week of the reporting offices. With teeth that close in height the argmax picks one of them more or less by luck.

The smooth curve has the same problem, only hidden. From 15 to 17 days it is at 0.936 or more and at 28 days it is still 0.846. With a peak that flat, 16 is one point on a plateau. r stays above 0.9 from 13 to 19.

On all data from March 1 there was no peak to speak of, the best was 0.12 at 3 days. Up to June 30 the US reported 4.85 deaths per 100 cases and after it 1.68. My guess is that one straight line through both waves fits neither of them. Taken alone, the spring gives 6 days.

## How much is r = 0.94

I generated 2000 pairs of independent random walks, 200 steps each. I searched lags from −30 to 30 like before. The median best |r| was 0.635 and in 73% of pairs it was above 0.5. Even at lag 0 alone, 82% of the pairs were outside the band of 2/√n that a textbook gives for one correlation. This is the old Yule problem. Series that know nothing about each other look correlated because each of them changes slowly. After the first difference the median best |r| drops to 0.19.

I also gave the same procedure a pair where the answer is known. One autocorrelated series and its copy shifted by 10 days, with noise as large as the signal. On levels it found exactly 10 in 96% of runs and the median best r was 0.71. That 0.71 is set by how much noise I chose, but it sits in the same range as the unrelated walks. So the height of the peak alone did not tell me which kind of pair I had.

The better null for real data was other countries. I took 10 countries and correlated the cases of each with the deaths of every other one. That is 90 wrong pairs with the same method and window.

<figure class="fig">
<svg viewBox="0 0 680 310" role="img" aria-label="Best correlation over lags 0 to 35 for cases of one country against deaths of the same country and of 9 other countries. summer, 7 day average: wrong pair median 0.29, right pair median 0.91. summer, growth: wrong pair median 0.28, right pair median 0.61. spring, 7 day average: wrong pair median 0.52, right pair median 0.95. spring, growth: wrong pair median 0.87, right pair median 0.88.">
  <line x1="200.0" y1="16" x2="200.0" y2="238" class="f-plain"/>
  <text x="200.0" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−0.8</text>
  <line x1="251.1" y1="16" x2="251.1" y2="238" class="f-plain"/>
  <text x="251.1" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−0.6</text>
  <line x1="302.2" y1="16" x2="302.2" y2="238" class="f-plain"/>
  <text x="302.2" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−0.4</text>
  <line x1="353.3" y1="16" x2="353.3" y2="238" class="f-plain"/>
  <text x="353.3" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−0.2</text>
  <line x1="404.4" y1="16" x2="404.4" y2="238" class="f-plain" style="stroke:var(--muted)"/>
  <text x="404.4" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.0</text>
  <line x1="455.6" y1="16" x2="455.6" y2="238" class="f-plain"/>
  <text x="455.6" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.2</text>
  <line x1="506.7" y1="16" x2="506.7" y2="238" class="f-plain"/>
  <text x="506.7" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.4</text>
  <line x1="557.8" y1="16" x2="557.8" y2="238" class="f-plain"/>
  <text x="557.8" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.6</text>
  <line x1="608.9" y1="16" x2="608.9" y2="238" class="f-plain"/>
  <text x="608.9" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.8</text>
  <line x1="660.0" y1="16" x2="660.0" y2="238" class="f-plain"/>
  <text x="660.0" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.0</text>
  <text x="430" y="270" text-anchor="middle" class="f-label f-muted">best correlation r over lags 0 to 35</text>
  <text x="188" y="34.0" text-anchor="end" class="f-label f-ink">summer, 7 day average</text>
  <circle cx="386.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="383.7" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="252.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="416.7" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="316.3" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="625.2" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="548.1" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="403.7" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="572.1" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="276.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.1" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="650.3" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="646.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="196.7" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="399.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="551.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="361.3" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="299.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="587.7" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="644.9" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="610.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="640.8" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="187.5" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="437.2" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="549.3" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="287.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="297.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="565.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="614.5" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.1" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="649.3" cy="32.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="173.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="408.5" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="626.0" cy="32.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="328.0" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="269.3" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="604.0" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="646.5" cy="19.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="617.1" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="637.0" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="201.5" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="418.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="471.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="350.5" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="254.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="586.1" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="635.7" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="650.8" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="648.5" cy="35.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="194.1" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="405.5" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="552.4" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="337.2" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="619.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="299.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="257.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="367.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="257.5" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="309.9" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="443.0" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="566.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="556.8" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="540.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="607.6" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="635.7" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="561.4" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="641.9" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="601.7" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="539.6" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="447.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="481.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="362.8" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="557.0" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="589.2" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.9" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="610.9" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.1" cy="19.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="215.6" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="418.8" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="302.5" cy="22.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="634.2" cy="32.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="447.9" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="460.4" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="313.5" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="474.2" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="350.5" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="632.7" cy="19.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="471.4" cy="29.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="421.1" cy="26.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="644.7" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="580.5" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="621.9" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="650.8" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="654.4" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="650.8" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="628.3" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="509.5" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="654.9" cy="44.0" r="3" style="fill:var(--accent)"/>
  <circle cx="630.1" cy="44.0" r="3" style="fill:var(--accent)"/>
  <line x1="477.8" y1="18" x2="477.8" y2="34" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="637.4" y1="36" x2="637.4" y2="52" style="stroke:var(--accent);stroke-width:2"/>
  <text x="188" y="86.0" text-anchor="end" class="f-label f-ink">summer, growth</text>
  <circle cx="477.8" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="508.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="507.9" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="467.3" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="448.1" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="503.1" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="476.0" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="480.1" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="465.5" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="476.3" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="513.8" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="486.5" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="528.4" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="552.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="476.3" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="546.5" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="514.6" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="448.1" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="494.7" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="446.6" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="505.9" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="453.8" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="469.6" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="433.3" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="434.3" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="492.1" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="484.7" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="531.7" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="430.5" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="394.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="326.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="457.3" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="521.7" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="423.1" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="600.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="444.8" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="504.6" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="532.0" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="529.4" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="446.6" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="479.3" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="407.3" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="473.2" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="330.3" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="525.6" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="473.7" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="474.5" cy="68.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="472.4" cy="90.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="510.8" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="496.4" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="489.3" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="504.1" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="456.3" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="439.2" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="553.7" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="498.0" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="452.5" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="470.4" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="382.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="450.2" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="449.9" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="515.6" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="536.8" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="413.9" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="494.1" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="516.9" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="495.2" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="562.4" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="504.1" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="470.4" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="420.5" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="446.9" cy="68.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="532.0" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="435.9" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="409.3" cy="81.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="532.0" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="306.6" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="424.4" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="505.1" cy="68.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="380.7" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="468.3" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="489.3" cy="84.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="498.0" cy="74.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="497.0" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="492.4" cy="68.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="453.8" cy="71.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="457.9" cy="87.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="492.4" cy="90.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="461.2" cy="78.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="477.3" cy="65.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="547.3" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="432.8" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="530.4" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="574.1" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="573.6" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="512.5" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="573.1" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="487.8" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="630.1" cy="96.0" r="3" style="fill:var(--accent)"/>
  <circle cx="633.9" cy="96.0" r="3" style="fill:var(--accent)"/>
  <line x1="476.8" y1="70" x2="476.8" y2="86" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="560.2" y1="88" x2="560.2" y2="104" style="stroke:var(--accent);stroke-width:2"/>
  <text x="188" y="138.0" text-anchor="end" class="f-label f-ink">spring, 7 day average</text>
  <circle cx="419.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="549.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="481.4" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="568.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="524.0" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="620.1" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="597.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="514.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="552.7" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="655.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="652.3" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="651.6" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="657.4" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="649.8" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="293.5" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="655.9" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="237.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="239.6" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.1" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="649.0" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.4" cy="123.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.4" cy="139.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="657.7" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="348.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="640.1" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="288.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="291.5" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.9" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="652.1" cy="120.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="650.5" cy="142.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.6" cy="117.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="655.1" cy="146.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="360.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="643.4" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="291.0" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="294.6" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="654.9" cy="114.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="578.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="645.7" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="599.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="626.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="583.8" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.4" cy="149.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="457.6" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="497.5" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="609.1" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="606.1" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="634.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="612.2" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="625.5" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="416.2" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="603.5" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="314.2" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="334.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="356.1" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="218.9" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="279.0" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="254.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="294.3" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="269.8" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="338.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="649.3" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="657.4" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="461.4" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="283.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="391.7" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="336.5" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="404.4" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="371.5" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="648.0" cy="123.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="626.5" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="626.8" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="353.6" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="223.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="284.8" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="263.6" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="296.6" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="277.4" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.6" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="336.2" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="655.4" cy="110.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="370.2" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="213.3" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="287.1" cy="136.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="255.2" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="304.0" cy="130.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="272.3" cy="133.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="648.2" cy="139.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="350.5" cy="126.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="645.2" cy="120.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="613.0" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="659.2" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="652.8" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="653.1" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="649.8" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="630.9" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="644.4" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="448.7" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="646.7" cy="148.0" r="3" style="fill:var(--accent)"/>
  <circle cx="657.7" cy="148.0" r="3" style="fill:var(--accent)"/>
  <line x1="537.0" y1="122" x2="537.0" y2="138" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="648.2" y1="140" x2="648.2" y2="156" style="stroke:var(--accent);stroke-width:2"/>
  <text x="188" y="190.0" text-anchor="end" class="f-label f-ink">spring, growth</text>
  <circle cx="627.5" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="648.0" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="533.0" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="654.6" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="637.8" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.4" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="646.7" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="609.9" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.9" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="653.1" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="641.9" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="535.5" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="651.1" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="623.5" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="636.7" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="646.7" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="607.4" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="634.7" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="651.3" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="611.7" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="549.6" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="648.2" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="628.6" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="619.4" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="645.9" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="601.7" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="640.6" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="637.0" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="615.3" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="636.7" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="639.6" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="632.9" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="622.2" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="637.8" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="600.7" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="633.9" cy="172.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="652.8" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.6" cy="172.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="649.5" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="556.2" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="633.7" cy="194.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="643.1" cy="194.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="651.3" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="614.0" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="643.6" cy="169.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="582.1" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="567.5" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="583.3" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="530.7" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="581.3" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="566.0" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="578.0" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="583.8" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="579.5" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="643.1" cy="198.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="633.9" cy="169.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="636.0" cy="198.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="543.2" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="640.8" cy="166.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="625.0" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="643.4" cy="201.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="606.3" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="645.2" cy="172.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="586.4" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="581.5" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="580.8" cy="172.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="487.8" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="595.6" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="585.4" cy="194.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="591.5" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="574.9" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="595.6" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="629.6" cy="188.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="560.3" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="611.4" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="509.2" cy="182.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="600.2" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="613.5" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="625.8" cy="175.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="609.4" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="631.6" cy="166.0" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="644.4" cy="194.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="632.9" cy="201.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="635.5" cy="162.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="541.7" cy="185.2" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.6" cy="162.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="627.8" cy="191.6" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="652.8" cy="172.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="642.9" cy="204.4" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="597.9" cy="178.8" r="1.9" class="f-muted" style="fill:var(--muted);opacity:0.7"/>
  <circle cx="652.6" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="624.5" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="643.6" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="536.3" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="654.4" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="591.5" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="647.2" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="589.0" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="608.6" cy="200.0" r="3" style="fill:var(--accent)"/>
  <circle cx="635.5" cy="200.0" r="3" style="fill:var(--accent)"/>
  <line x1="627.7" y1="174" x2="627.7" y2="190" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="630.0" y1="192" x2="630.0" y2="208" style="stroke:var(--accent);stroke-width:2"/>
  <text x="654.6" y="218.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">US cases × UK deaths: 0.979</text>
  <circle cx="25" cy="296" r="2.2" style="fill:var(--muted)"/>
  <text x="36" y="300" class="f-label f-muted">wrong pair</text>
  <circle cx="195" cy="296" r="3" style="fill:var(--accent)"/>
  <text x="206" y="300" class="f-label f-muted">right pair</text>
  <line x1="365" y1="289" x2="365" y2="303" style="stroke:var(--ink);stroke-width:2"/>
  <text x="376" y="300" class="f-label f-muted">median</text>
</svg>
<figcaption>10 countries. Each grey dot is cases of one country against deaths of another one, 90 per row. Blue dots are the right pairs. The vertical marks are the medians. Growth is the weekly change of the log of the 7 day average.</figcaption>
</figure>

In the summer, on 7 day averages, the right pairs have median 0.91 and the wrong ones 0.29. That looks like a working test, but 16% of the wrong pairs are above 0.9. In spring the same test separates less, 31% of the wrong pairs are above 0.9. On the weekly growth of the averages in spring it does not separate at all. Wrong pairs have median 0.87 and right pairs 0.88. US cases against United Kingdom deaths give 0.979 at 8 days, more than US cases against US deaths at 0.971. I think in spring all these countries simply had the same shape, growth fast and then slower. I didn't test it.

## The textbook fix

The usual answer is prewhitening. I took the day to day changes of the 7 day averages and fitted an autoregressive model with 7 lags to the cases. Then I filtered both series with it and correlated what was left. The first difference alone already cost a lot on my known pair. It found exactly 10 days in 75% of runs against 96% on levels. Prewhitening on top gave 76%. After the difference the smooth signal is small and the noise I added is large.

For the real countries, spring and summer, prewhitening gives lag 0 in 9 of the 20 country and season pairs. The rest spread from 2 to 33 days and r is under 0.5 in 17 of the 20. I wouldn't take any of these lags.

## What I would report

For the US summer I believe something like 2 weeks, but not 16 days. The 7 day averages peak on July 22 for cases and August 1 for deaths, which is 10 days, while the correlation says 16. I also slid a 90 day window by a week from March to July.

<figure class="fig">
<svg viewBox="0 0 680 248" role="img" aria-label="Lag of US deaths after US cases on 7 day averages, for 90 day windows starting every week from March 1 to July 12. 03-01: 4, 03-08: 3, 03-15: 2, 03-22: 3, 03-29: 12, 04-05: 16, 04-12: 24, 04-19: 27, 04-26: 30, 05-03: 29, 05-10: 26, 05-17: 19, 05-24: 17, 05-31: 16, 06-07: 16, 06-14: 15, 06-21: 16, 06-28: 16, 07-05: 15, 07-12: 19">
  <line x1="60" y1="204.0" x2="660" y2="204.0" class="f-plain"/>
  <text x="54.0" y="208.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="168.0" x2="660" y2="168.0" class="f-plain"/>
  <text x="54.0" y="172.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">7</text>
  <line x1="60" y1="132.0" x2="660" y2="132.0" class="f-plain"/>
  <text x="54.0" y="136.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">14</text>
  <line x1="60" y1="96.0" x2="660" y2="96.0" class="f-plain"/>
  <text x="54.0" y="100.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">21</text>
  <line x1="60" y1="60.0" x2="660" y2="60.0" class="f-plain"/>
  <text x="54.0" y="64.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">28</text>
  <line x1="60" y1="24.0" x2="660" y2="24.0" class="f-plain"/>
  <text x="54.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">35</text>
  <text x="60" y="16" class="f-label f-muted">lag, days</text>
  <text x="60.0" y="220.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 Mar</text>
  <text x="196.8" y="220.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 Apr</text>
  <text x="329.1" y="220.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 May</text>
  <text x="465.9" y="220.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 Jun</text>
  <text x="598.2" y="220.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 Jul</text>
  <text x="360" y="238" text-anchor="middle" class="f-label f-muted">first day of the 90 day window</text>
  <path d="M60.0,183.4L90.9,188.6L121.8,193.7L152.6,188.6L183.5,142.3L214.4,121.7L245.3,80.6L276.2,65.1L307.1,49.7L337.9,54.9L368.8,70.3L399.7,106.3L430.6,116.6L461.5,121.7L492.4,121.7L523.2,126.9L554.1,121.7L585.0,121.7L615.9,126.9L646.8,106.3" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="60.0" cy="183.4" r="3" class="f-accent"/>
  <circle cx="90.9" cy="188.6" r="3" class="f-accent"/>
  <circle cx="121.8" cy="193.7" r="3" class="f-accent"/>
  <circle cx="152.6" cy="188.6" r="3" class="f-accent"/>
  <circle cx="183.5" cy="142.3" r="3" class="f-accent"/>
  <circle cx="214.4" cy="121.7" r="3" class="f-accent"/>
  <circle cx="245.3" cy="80.6" r="3" class="f-accent"/>
  <circle cx="276.2" cy="65.1" r="3" class="f-accent"/>
  <circle cx="307.1" cy="49.7" r="3" class="f-accent"/>
  <circle cx="337.9" cy="54.9" r="3" class="f-accent"/>
  <circle cx="368.8" cy="70.3" r="3" class="f-accent"/>
  <circle cx="399.7" cy="106.3" r="3" class="f-accent"/>
  <circle cx="430.6" cy="116.6" r="3" class="f-accent"/>
  <circle cx="461.5" cy="121.7" r="3" class="f-accent"/>
  <circle cx="492.4" cy="121.7" r="3" class="f-accent"/>
  <circle cx="523.2" cy="126.9" r="3" class="f-accent"/>
  <circle cx="554.1" cy="121.7" r="3" class="f-accent"/>
  <circle cx="585.0" cy="121.7" r="3" class="f-accent"/>
  <circle cx="615.9" cy="126.9" r="3" class="f-accent"/>
  <circle cx="646.8" cy="106.3" r="3" class="f-accent"/>
</svg>
<figcaption>US, the lag with the highest correlation for a 90 day window. The x axis is the first day of the window. Lags searched from 0 to 35 days.</figcaption>
</figure>

The windows starting March 1 to 22 give 2 to 4 days and the one starting March 29 gives 12. For the windows starting April 12 to May 10 the lag sits between 24 and 30. For those starting in June it is 15 or 16. I don't know what pulls the April windows so far. They end between July 10 and August 7 and hold the start of the summer rise.

So my procedure now is longer:

1. Pick a window with one distinct event in both series.
2. Smooth out the weekly reporting before correlating.
3. Report the plateau and the date of the peaks, not only the argmax.
4. Compare the r with pairs that cannot be related. If they score as high, I do not report a lag.

## What I did not check

JHU counts by the day of the report and not by the day of death, so part of what I measured is the reporting pipeline. I did not use line lists with the real delay for each patient. The number of tests and methods other than correlation, for example fitting a delay distribution, are also outside this post. I picked the 10 countries by hand among those with large numbers on both curves, so they are not a random sample. In the country runs I searched only 0 to 35 days and some windows hit that edge.
