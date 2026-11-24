---
title: "A number from a hat correlated with 298 of 968 World Bank indicators"
description: "I dealt random numbers to 214 countries 2,000 times and compared them with 968 World Bank indicators. The mean is the promised 5% of false hits, but the luckiest shuffle got 298 and half of the false hits repeated on another year. Bonferroni, Benjamini-Hochberg and a split of the countries, with counts."
date: 2015-01-25
lang: en
translationKey: false-discoveries
tags: ["statistics", "open-data", "numbers"]
---

I gave 214 countries the numbers from 1 to 214 in random order. Burundi got 1, Romania got 214. Then I compared this number with every column of the World Bank table for 2010. Telephone lines per 100 people gave a rank correlation of 0.36 with p = 0.00000012. Life expectancy and GDP per capita both came out with p below 0.0003. In total 298 columns of 968 had p below 0.05.

It was the luckiest of 2,000 shuffles and I searched for it on purpose. But I have often looked at data the same way, I open a table, compare everything with everything and keep what looks strong. Then I check the strong thing on another year, see it again and stop worrying. How much this check is worth I never measured.

## What I took

The data is World Development Indicators, the release of December 2014, one Excel file of 82 MB. I took the year 2010, threw away aggregates like World or Euro area and got 214 countries. Of 1,345 series 968 have a value for at least 100 countries and at least 20 different values. The test is always Spearman rank correlation with the p-value from the t approximation. The script is Python with numpy and scipy, the seed is fixed.

None of this is new. Bennett and colleagues found "brain activity" in a dead salmon in 2009. Tyler Vigen has been collecting spurious correlations on his site since last May. The procedure of Benjamini and Hochberg, BH below, is from 1995. Efron described in 2007 how correlated tests change the number of false hits. I wanted to see the sizes on a table where people really dig.

## A nonsense target that was not nonsense

I began with 2 targets without meaning and wrote down before the run that each should give about 5%, which is 48 columns. The place of the country in the alphabet gave 15. The length of its English name gave 84 and the strongest had p = 0.00007.

That one was land area, followed by surface area and arable land. In the quarter of countries with the largest population the mean name has 8.0 characters, in the smallest quarter 11.4. Small territories are called "Sint Maarten (Dutch part)" or "St. Vincent and the Grenadines". My nonsense target had a meaning and I did not see it. From the 84 columns BH with q = 0.05 kept only land area and surface area, almost the same column twice. I think it was right. As an example of nothing the target was lost, so I went to shuffles.

## 5% on average only

I dealt the numbers to the countries 2,000 times, always from 1 to 214. For comparison I made 968 independent columns of noise with the same gaps as in the real ones.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Histogram of 2,000 shuffles of a target with no meaning. Horizontal: how many of 968 columns got p below 0.05. With independent noise columns almost all shuffles lie between 30 and 70, the range of 5 to 95 percent is from 37 to 60. With real World Bank columns the range is from 13 to 134 and the tail reaches 298. The mean is 48.4 in both.">
  <line x1="60" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="52.0" y="244.0" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="60" y1="173.3" x2="660" y2="173.3" class="f-plain"/>
  <text x="52.0" y="177.3" text-anchor="end" class="f-label f-muted">400</text>
  <line x1="60" y1="106.7" x2="660" y2="106.7" class="f-plain"/>
  <text x="52.0" y="110.7" text-anchor="end" class="f-label f-muted">800</text>
  <line x1="60" y1="40.0" x2="660" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-label f-muted">1200</text>
  <rect x="101.0" y="239.0" width="18.0" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.0" y="208.8" width="18.0" height="31.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="141.0" y="80.7" width="18.0" height="159.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="161.0" y="119.0" width="18.0" height="121.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="181.0" y="219.8" width="18.0" height="20.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="201.0" y="239.5" width="18.0" height="0.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="221.0" y="239.8" width="18.0" height="0.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="65.0" y="235.3" width="10.0" height="4.7" style="fill:var(--accent);stroke:none"/>
  <rect x="85.0" y="187.5" width="10.0" height="52.5" style="fill:var(--accent);stroke:none"/>
  <rect x="105.0" y="166.0" width="10.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.0" y="182.8" width="10.0" height="57.2" style="fill:var(--accent);stroke:none"/>
  <rect x="145.0" y="201.2" width="10.0" height="38.8" style="fill:var(--accent);stroke:none"/>
  <rect x="165.0" y="214.8" width="10.0" height="25.2" style="fill:var(--accent);stroke:none"/>
  <rect x="185.0" y="223.5" width="10.0" height="16.5" style="fill:var(--accent);stroke:none"/>
  <rect x="205.0" y="228.2" width="10.0" height="11.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.0" y="230.3" width="10.0" height="9.7" style="fill:var(--accent);stroke:none"/>
  <rect x="245.0" y="231.2" width="10.0" height="8.8" style="fill:var(--accent);stroke:none"/>
  <rect x="265.0" y="234.0" width="10.0" height="6.0" style="fill:var(--accent);stroke:none"/>
  <rect x="285.0" y="235.0" width="10.0" height="5.0" style="fill:var(--accent);stroke:none"/>
  <rect x="305.0" y="236.0" width="10.0" height="4.0" style="fill:var(--accent);stroke:none"/>
  <rect x="325.0" y="235.5" width="10.0" height="4.5" style="fill:var(--accent);stroke:none"/>
  <rect x="345.0" y="236.3" width="10.0" height="3.7" style="fill:var(--accent);stroke:none"/>
  <rect x="365.0" y="236.7" width="10.0" height="3.3" style="fill:var(--accent);stroke:none"/>
  <rect x="385.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="405.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="425.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="485.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="505.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="545.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="565.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="605.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="625.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="645.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <text x="60.0" y="258.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="160.0" y="258.0" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-label f-muted">100</text>
  <text x="360.0" y="258.0" text-anchor="middle" class="f-label f-muted">150</text>
  <text x="460.0" y="258.0" text-anchor="middle" class="f-label f-muted">200</text>
  <text x="560.0" y="258.0" text-anchor="middle" class="f-label f-muted">250</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-label f-muted">300</text>
  <text x="654.0" y="230.0" text-anchor="end" class="f-label f-ink">max 298</text>
  <text x="10.0" y="22.0" text-anchor="start" class="f-label f-muted">shuffles</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted">columns with p below 0.05</text>
  <rect x="320.0" y="62.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="340.0" y="72.0" text-anchor="start" class="f-label f-ink">WDI columns</text>
  <rect x="320.0" y="84.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="340.0" y="94.0" text-anchor="start" class="f-label f-ink">noise columns, same gaps</text>
</svg>
<figcaption>How many of 968 columns got p below 0.05 in each of 2,000 shuffles. The mean is 48.4 in both histograms. In the right tail bars of 1 to 8 shuffles are drawn taller than scale to stay visible.</figcaption>
</figure>

| hits with p < 0.05 of 968 | WDI columns | noise columns |
|---|---|---|
| mean | 48.4 | 48.4 |
| median | 35 | 48 |
| 5th percentile | 13 | 37 |
| 95th percentile | 134 | 60 |
| maximum | 298 | 82 |
| shuffles with any Bonferroni hit | 48 | 98 |
| shuffles with any BH hit | 57 | 104 |

The mean is the promised 5% in both. But the standard deviation is 7 columns for noise and 40 for the real ones. WDI repeats itself, infant mortality for boys stands next to infant mortality for girls. 574 of the 968 columns have a twin with a rank correlation above 0.9 by absolute value. I counted only pairs with at least 50 common countries.

I guessed that the lucky numbers had lined up with wealth. So I took GDP per capita out with a partial rank correlation and 15 of the 298 hits remained. In 10.9% of all shuffles there were at least 2 times more hits than expected. When I shuffled the name lengths, 13.8% of the runs gave 84 hits or more. The count of hits alone tells me very little.

Bonferroni and BH kept their 5% promise, 2.4% and 2.9% of the shuffles had any discovery. But when BH failed, it could fail in bulk. In the lucky shuffle it accepted 117 columns.

## Another year, but the same countries

Now my habit. I took all false hits of 2010 in all shuffles and tested the same numbers on 2005. Only the 931 columns that are full enough in both years took part.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Bars: share of false findings that repeated with p below 0.05 and the same sign. Same countries in 2005: all hits 49.9 percent, the best column 60.1 percent. Another half of the countries: all hits 2.2 percent, the best column 2.5 percent, at least one of the 20 best 27.9 percent, at least one of the 50 best 48.5 percent.">
  <text x="10.0" y="30.0" text-anchor="start" class="f-label f-ink">same countries, 2005</text>
  <text x="180.0" y="57.0" text-anchor="end" class="f-label f-muted">all hits</text>
  <rect x="190.0" y="42.0" width="292.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="490.1" y="57.0" text-anchor="start" class="f-mono f-ink">49.9%</text>
  <text x="180.0" y="85.0" text-anchor="end" class="f-label f-muted">best column</text>
  <rect x="190.0" y="70.0" width="352.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="550.0" y="85.0" text-anchor="start" class="f-mono f-ink">60.1%</text>
  <text x="10.0" y="114.0" text-anchor="start" class="f-label f-ink">other half of the countries</text>
  <text x="180.0" y="141.0" text-anchor="end" class="f-label f-muted">all hits</text>
  <rect x="190.0" y="126.0" width="12.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="210.7" y="141.0" text-anchor="start" class="f-mono f-ink">2.2%</text>
  <text x="180.0" y="169.0" text-anchor="end" class="f-label f-muted">best column</text>
  <rect x="190.0" y="154.0" width="14.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="212.6" y="169.0" text-anchor="start" class="f-mono f-ink">2.5%</text>
  <text x="180.0" y="197.0" text-anchor="end" class="f-label f-muted">any of 20 best</text>
  <rect x="190.0" y="182.0" width="163.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="361.4" y="197.0" text-anchor="start" class="f-mono f-ink">27.9%</text>
  <text x="180.0" y="225.0" text-anchor="end" class="f-label f-muted">any of 50 best</text>
  <rect x="190.0" y="210.0" width="284.1" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="482.1" y="225.0" text-anchor="start" class="f-mono f-ink">48.5%</text>
  <line x1="190" y1="34" x2="190" y2="238" class="f-plain"/>
</svg>
<figcaption>How often a false finding is confirmed by the second check, at p below 0.05 and with the same sign. All hits of the other half come from 500 splits, the 3 bars below from 1,000.</figcaption>
</figure>

Of 93,302 false hits 46,527 repeated with p below 0.05 and the same sign. That is 49.9%, with independent data it would be 2.5%. The best column of a shuffle repeated in 60.1% of cases. In the lucky shuffle 188 of 281 hits repeated. Afterwards it is obvious, the median rank correlation of a column with itself 5 years later is 0.91. I stopped worrying too early.

The other half of the countries works much better. I cut the list at random, searched in one half and checked in the other. 2.2% of 24,120 hits from 500 splits repeated, the best column repeated in 2.5% of 1,000 other splits. But this is for one candidate. If I carry the 20 best columns to the second half, at least one of them repeats in 27.9% of runs, with 50 in 48.5%. Dividing the second threshold by the number of carried columns returned it to 1.8% for 20.

## With a known answer

Data with nothing inside is the easy case. So I made mixtures. The target is life expectancy in 60 random countries, then 100 real WDI columns without the demographic ones and 900 columns shuffled between countries. The second mixture has 10 real and 990 shuffled. Each was repeated 200 times. "Halves" means p below 0.05 in both halves of the countries with the same sign.

| method | real found of 100 | shuffled among found | real found of 10 | shuffled among found |
|---|---|---|---|---|
| p < 0.05 | 55.6 | 44.5% | 5.5 | 89.8% |
| Bonferroni | 21.9 | 0.3% | 2.1 | 1.8% |
| BH, q = 0.05 | 35.5 | 5.2% | 2.4 | 5.7% |
| halves | 27.7 | 4.4% | 2.7 | 29.0% |

<figure class="fig">
<svg viewBox="0 0 680 334" role="img" aria-label="What each method found in mixtures of real columns and shuffled ones, mean of 200 runs. 100 real + 900 shuffled: p &lt; 0.05: 55.6 real and 44.6 shuffled, Bonferroni: 21.9 real and 0.07 shuffled, BH, q = 0.05: 35.5 real and 2.0 shuffled, halves: 27.7 real and 1.2 shuffled. 10 real + 990 shuffled: p &lt; 0.05: 5.5 real and 49.5 shuffled, Bonferroni: 2.1 real and 0.07 shuffled, BH, q = 0.05: 2.4 real and 0.23 shuffled, halves: 2.7 real and 1.2 shuffled. The target is life expectancy in 60 countries.">
  <rect x="170.0" y="14.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="188.0" y="24.0" text-anchor="start" class="f-label f-ink">real</text>
  <rect x="300.0" y="14.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="318.0" y="24.0" text-anchor="start" class="f-label f-ink">shuffled</text>
  <text x="10.0" y="58.0" text-anchor="start" class="f-label f-ink">100 real + 900 shuffled</text>
  <text x="160.0" y="85.0" text-anchor="end" class="f-label f-muted">p &lt; 0.05</text>
  <rect x="170.0" y="70.0" width="206.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="376.4" y="70.0" width="165.5" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="549.9" y="85.0" text-anchor="start" class="f-mono f-ink">44.5%</text>
  <text x="160.0" y="112.0" text-anchor="end" class="f-label f-muted">Bonferroni</text>
  <rect x="170.0" y="97.0" width="81.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="251.4" y="97.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="259.7" y="112.0" text-anchor="start" class="f-mono f-ink">0.3%</text>
  <text x="160.0" y="139.0" text-anchor="end" class="f-label f-muted">BH, q = 0.05</text>
  <rect x="170.0" y="124.0" width="131.9" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="301.9" y="124.0" width="7.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="317.3" y="139.0" text-anchor="start" class="f-mono f-ink">5.2%</text>
  <text x="160.0" y="166.0" text-anchor="end" class="f-label f-muted">halves</text>
  <rect x="170.0" y="151.0" width="102.8" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="272.8" y="151.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="285.2" y="166.0" text-anchor="start" class="f-mono f-ink">4.4%</text>
  <text x="10.0" y="202.0" text-anchor="start" class="f-label f-ink">10 real + 990 shuffled</text>
  <text x="160.0" y="229.0" text-anchor="end" class="f-label f-muted">p &lt; 0.05</text>
  <rect x="170.0" y="214.0" width="20.5" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.5" y="214.0" width="183.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="382.2" y="229.0" text-anchor="start" class="f-mono f-ink">89.8%</text>
  <text x="160.0" y="256.0" text-anchor="end" class="f-label f-muted">Bonferroni</text>
  <rect x="170.0" y="241.0" width="7.7" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="177.7" y="241.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="185.9" y="256.0" text-anchor="start" class="f-mono f-ink">1.8%</text>
  <text x="160.0" y="283.0" text-anchor="end" class="f-label f-muted">BH, q = 0.05</text>
  <rect x="170.0" y="268.0" width="9.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="179.0" y="268.0" width="0.9" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="187.8" y="283.0" text-anchor="start" class="f-mono f-ink">5.7%</text>
  <text x="160.0" y="310.0" text-anchor="end" class="f-label f-muted">halves</text>
  <rect x="170.0" y="295.0" width="10.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="180.0" y="295.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="192.4" y="310.0" text-anchor="start" class="f-mono f-ink">29.0%</text>
</svg>
<figcaption>Mean number of found columns out of 1,000, 200 runs. The percentage is the share of shuffled ones among the found.</figcaption>
</figure>

In the first mixture halves and BH look similar, but BH finds more. In the second one halves gave 29.0% of false columns. About 1.2 shuffled columns pass both halves in either mixture, only there are fewer real ones next to them. The halves know nothing about how many columns I tried.

The 5.2% bothered me. With 90% of empty columns BH should give about 4.5%. I checked the t approximation on 2 million random permutations. For p below 0.002 and from 36 to 60 countries the real rate is from 7 to 14% higher than stated. I was ready to write that this explains it, but the standard error of a mean over 200 runs is about 0.27 points. I repeated the mixture 1,000 times with another seed and got 4.7%. With p from permutations instead of the t approximation the same runs gave 4.3%. The approximation costs about 0.4 of a point, the rest of my 5.2% was luck. And this is a mean, in 8.5% of the 1,000 runs more than a tenth of the BH list was false.

## What I didn't check

I took only pairwise rank correlations and only one year for the search. "Real" in the mixture is an assumption, 72% of these columns have p below 0.05 against life expectancy in 200 countries and the others may be empty. Neighbour countries resemble each other and a shuffle destroys that, so for a real target the halves are less independent than in my test. I did not run the version of BH for dependent tests, Benjamini and Yekutieli published it in 2001.
