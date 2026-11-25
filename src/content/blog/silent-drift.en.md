---
title: "The model ran 36% low for a year and the PSI of its inputs was 0.06"
description: "I trained a bike rental model on 2011, froze it and served 2012. It ran 36% low, while the yearly PSI of its inputs stayed under 0.07. By months the PSI alarm fired in all 24 months, the good ones of 2011 too. KS fired in 397 of 400 samples where nothing had changed."
date: 2018-10-06
lang: en
translationKey: silent-drift
tags: ["machine-learning", "statistics", "reliability"]
---

`psi_pred: 0.0054`. This is the distance between the predictions of my model for 2012 and for 2011 by the population stability index (PSI), the one that credit scoring people use. Under 0.1 is read as "nothing happened". In 2012 the model predicted 1,306,797 bike rentals and there were 2,049,576.

When I think about watching a model in production, the first thing that comes to my mind is comparing input distributions, because the inputs are there at once and the right answers come later. It looks reasonable, but I never tried it on data where I already know the answers and I didn't know how often such a check fires for nothing.

That a check of inputs cannot see every drift is known. The 2014 survey of Gama and colleagues separates a change in the inputs from a change in how the answer depends on them and the second kind needs answers. I wanted to count the misses and the false alarms.

## What I ran

The data is Bike Sharing from UCI, collected by Fanaee-T and Gama: hourly rentals of Capital Bikeshare in Washington with weather, 8,645 hours of 2011 and 8,734 hours of 2012. Kaggle had a competition on it in 2014. I trained gradient boosting on 2011, 300 trees of depth 5, without the year column, froze it and let it serve 2012. Python 3.6, sklearn 0.20.0, pandas 0.23.4, scipy 1.1.0.

The error is WAPE, the sum of absolute errors divided by the sum of rentals. Validation on 2011 with whole weeks held out gives 18.3%. On 2012 the frozen model has 38.3% and all 12 months are worse than the worst month of 2011. Rentals grew by 65% in a year and the model had no way to know.

Now the monitor. For 4 weather inputs I compute PSI with deciles of 2011 as bins (the weather type has its own categories). An alarm is anything above 0.25, as in Siddiqi's book on scorecards. Year against year it is 0.043 for temperature, 0.063 for humidity and 0.004 for wind and for the weather type. The "feels like" temperature is an input too, I left it without an alarm, its PSI is 0.030. Even the rentals themselves, the answer, have a PSI of 0.244. So 65% of growth stays under the threshold.

## By months

Nobody waits a year to look, so I took every month against the whole of 2011. Before the run I wrote down the criteria and my expectation: the alarm will be late, but it will fire by summer.

<figure class="fig">
<svg viewBox="0 0 680 332" role="img" aria-label="24 months in two panels. Top, model error WAPE: from 11.8 to 26.2 percent in 2011 on held out weeks and from 29.5 to 53.6 percent in 2012. Bottom, the largest PSI of 4 weather inputs against the whole of 2011: above the 0.25 line in all 24 months, from 1.08 to 4.09 in 2011 and from 0.92 to 3.99 in 2012.">
  <line x1="50.0" y1="138.0" x2="664.0" y2="138.0" class="f-plain"/>
  <text x="42.0" y="142.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="101.3" x2="664.0" y2="101.3" class="f-plain"/>
  <text x="42.0" y="105.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="50.0" y1="64.7" x2="664.0" y2="64.7" class="f-plain"/>
  <text x="42.0" y="68.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="50.0" y1="28.0" x2="664.0" y2="28.0" class="f-plain"/>
  <text x="42.0" y="32.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="53.0" y="95.4" width="19.0" height="42.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="90.0" width="19.0" height="48.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="93.7" width="19.0" height="44.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="92.8" width="19.0" height="45.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="110.2" width="19.0" height="27.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="116.3" width="19.0" height="21.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="111.8" width="19.0" height="26.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="111.3" width="19.0" height="26.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="105.7" width="19.0" height="32.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="108.1" width="19.0" height="29.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="92.1" width="19.0" height="45.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="93.2" width="19.0" height="44.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="39.7" width="19.0" height="98.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="48.2" width="19.0" height="89.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="44.5" width="19.0" height="93.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="62.8" width="19.0" height="75.2" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="83.9" width="19.0" height="54.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="79.3" width="19.0" height="58.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="74.9" width="19.0" height="63.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="72.3" width="19.0" height="65.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="72.9" width="19.0" height="65.1" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="67.6" width="19.0" height="70.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="70.1" width="19.0" height="67.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="67.7" width="19.0" height="70.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">WAPE, %</text>
  <line x1="50.0" y1="290.0" x2="664.0" y2="290.0" class="f-plain"/>
  <text x="42.0" y="294.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="268.0" x2="664.0" y2="268.0" class="f-plain"/>
  <text x="42.0" y="272.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="50.0" y1="246.0" x2="664.0" y2="246.0" class="f-plain"/>
  <text x="42.0" y="250.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="50.0" y1="224.0" x2="664.0" y2="224.0" class="f-plain"/>
  <text x="42.0" y="228.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3</text>
  <line x1="50.0" y1="202.0" x2="664.0" y2="202.0" class="f-plain"/>
  <text x="42.0" y="206.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="50.0" y1="180.0" x2="664.0" y2="180.0" class="f-plain"/>
  <text x="42.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="53.0" y="204.5" width="19.0" height="85.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="78.0" y="248.6" width="19.0" height="41.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="103.0" y="251.0" width="19.0" height="39.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.0" y="266.2" width="19.0" height="23.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="153.0" y="255.1" width="19.0" height="34.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="178.0" y="228.0" width="19.0" height="62.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="203.0" y="200.0" width="19.0" height="90.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228.0" y="217.1" width="19.0" height="72.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="253.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="278.0" y="259.8" width="19.0" height="30.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="303.0" y="245.0" width="19.0" height="45.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.0" y="235.9" width="19.0" height="54.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="367.0" y="235.2" width="19.0" height="54.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="392.0" y="241.4" width="19.0" height="48.6" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="417.0" y="269.7" width="19.0" height="20.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="442.0" y="260.2" width="19.0" height="29.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="467.0" y="238.5" width="19.0" height="51.5" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="492.0" y="236.7" width="19.0" height="53.3" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="517.0" y="202.2" width="19.0" height="87.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="542.0" y="212.2" width="19.0" height="77.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="567.0" y="241.0" width="19.0" height="49.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="592.0" y="255.2" width="19.0" height="34.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="617.0" y="237.1" width="19.0" height="52.9" style="fill:var(--accent);opacity:1;stroke:none"/>
  <rect x="642.0" y="238.3" width="19.0" height="51.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="10.0" y="168.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">largest PSI</text>
  <line x1="50.0" y1="284.5" x2="664.0" y2="284.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="62.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="87.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="112.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="137.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="162.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="187.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="212.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="237.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="262.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="287.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="312.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="337.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="376.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="401.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="426.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="451.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="476.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="501.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="526.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="551.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="576.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <text x="601.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="626.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="651.5" y="304.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="200.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2011</text>
  <text x="514.0" y="322.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2012</text>
</svg>
<figcaption>Top: model error, 2011 on held out weeks (gray) and 2012 (colored). Bottom: the largest PSI of 4 inputs of the month against the whole of 2011. The dashed line is the 0.25 threshold.</figcaption>
</figure>

It fired in all 12 months of 2012. It also fired in all 12 months of 2011, when the model was fine. Temperature alone does it every time, with PSI from 0.9 to 4.1, because a month does not look like a year. I can't use an alarm like this for anything.

The standard answer is to compare with the same month of the previous year. Then 7 months of 12 fire. Here are the 5 silent ones:

| month of 2012 | largest PSI of 4 inputs | total forecast vs actual |
|---|---|---|
| June | 0.22 | -30% |
| July | 0.13 | -33% |
| August | 0.11 | -35% |
| October | 0.16 | -36% |
| December | 0.20 | -33% |

With the softer threshold of 0.1 all 12 fire. What they react to is the weather. March 2012 was warmer than March 2011, 13.1 degrees on average against 7.6, PSI 1.25. The model was 51% low. But it was 35% low in August too, with almost the same weather. For predictions against the same month the 0.25 alarm never fired. My expectation about summer was wrong in both variants.

I was also wrong about the shape. I expected an error that grows little by little. The worst month is the first one, January, 53% low. In 2011 rentals went from 38,189 in January to 87,323 in December and the model seems to take this growth for the season, it had only one year to look at. Validation inside 2011 could not show it, because the held out weeks were scattered between the training ones.

## 30 random days

The KS test of Kolmogorov and Smirnov is also popular. I checked it on a case where nothing changes at all: 30 random whole days of 2011 against the other days of the same year, 400 times. I counted p below 0.05 for temperature, humidity and wind.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Share of 400 random samples of 2011 for which KS gives p below 0.05. 30 random days: temperature 361, humidity 296, wind 167, any of 3 397. The same number of random hours: temperature 13, humidity 17, wind 8, any of 3 37.">
  <line x1="50.0" y1="200.0" x2="664.0" y2="200.0" class="f-plain"/>
  <text x="42.0" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50.0" y1="157.5" x2="664.0" y2="157.5" class="f-plain"/>
  <text x="42.0" y="161.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50.0" y1="115.0" x2="664.0" y2="115.0" class="f-plain"/>
  <text x="42.0" y="119.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50.0" y1="72.5" x2="664.0" y2="72.5" class="f-plain"/>
  <text x="42.0" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="50.0" y1="30.0" x2="664.0" y2="30.0" class="f-plain"/>
  <text x="42.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">samples with p &lt; 0.05, of 400</text>
  <rect x="80.8" y="46.6" width="42.0" height="153.4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="101.8" y="41.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">361</text>
  <rect x="130.8" y="194.5" width="42.0" height="5.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="151.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13</text>
  <text x="126.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">temperature</text>
  <rect x="234.3" y="74.2" width="42.0" height="125.8" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="255.3" y="69.2" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">296</text>
  <rect x="284.3" y="192.8" width="42.0" height="7.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="305.3" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">17</text>
  <text x="280.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">humidity</text>
  <rect x="387.8" y="129.0" width="42.0" height="71.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="408.8" y="124.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">167</text>
  <rect x="437.8" y="196.6" width="42.0" height="3.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="458.8" y="186.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8</text>
  <text x="433.8" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">wind</text>
  <rect x="541.3" y="31.3" width="42.0" height="168.7" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="562.3" y="26.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">397</text>
  <rect x="591.3" y="184.3" width="42.0" height="15.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="612.3" y="179.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">37</text>
  <text x="587.3" y="218.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">any of 3</text>
  <line x1="50.0" y1="191.5" x2="664.0" y2="191.5" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <rect x="50.0" y="234.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="68.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">30 random days</text>
  <rect x="280.0" y="234.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="298.0" y="244.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">as many random hours</text>
</svg>
<figcaption>400 samples where nothing changed by construction. Dashed line: the 5% that the test promises for one input.</figcaption>
</figure>

At least one of 3 tests fired in 397 sets of 400. If I take the same number of random hours instead of days, any of 3 fires in 37 sets. KS thinks that it has about 700 independent rows, but hours of one day come together: 91% of the variance of temperature is between days and it fired in 361. For wind it is 39% and 167. PSI with 0.25 is calmer here, 27 sets of 400. With 0.1 it is 228.

## With answers

Here I was sure and I still stumbled. My rule was: take the last 7 days and fire when WAPE is above the worst 7 days of 2011. It never fired, 0 of 360 windows. The median window went from 17% to 37% and the alarm stayed silent. What set the bar is a window that ends on December 27, 2011, with 62%. That is Christmas, 754 rentals on the 25th when a day between December 5 and 18 had 3,072 on average. The worst of 2012 is 60.4%.

Then I took the sign of the error. In 2011 the worst 7 day underestimate is 22.6%. In 2012 the first full window, up to January 7, is already below it, as are 346 windows of 360. The answers and the 7 days are the same, I only kept the sign.

## Monthly retraining returned half a point

The frozen model is 38.3%. I retrained it on the first day of each month on all the past data and got 37.8%. I suspected a bug and wrote a second script, it gave the same 37.8%. Then I tried other ways.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="WAPE on 2012, percent: frozen on 2011 38.3; monthly, all the past 37.8; same, no month and season 30.7; monthly, last 90 days 20.7; all the past + year column 19.0; frozen × actual / predicted, 28 d 17.3. The dashed line is the error on held out weeks of 2011, 18.3.">
  <line x1="280.0" y1="14.0" x2="280.0" y2="206.0" class="f-plain"/>
  <text x="280.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="367.5" y1="14.0" x2="367.5" y2="206.0" class="f-plain"/>
  <text x="367.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="455.0" y1="14.0" x2="455.0" y2="206.0" class="f-plain"/>
  <text x="455.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="542.5" y1="14.0" x2="542.5" y2="206.0" class="f-plain"/>
  <text x="542.5" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="630.0" y1="14.0" x2="630.0" y2="206.0" class="f-plain"/>
  <text x="630.0" y="222.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="280.0" y="21.0" width="335.4" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">frozen on 2011</text>
  <text x="674.0" y="34.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">38.3</text>
  <rect x="280.0" y="53.0" width="330.6" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="270.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">monthly, all the past</text>
  <text x="674.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">37.8</text>
  <rect x="280.0" y="85.0" width="268.6" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">same, no month and season</text>
  <text x="674.0" y="98.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">30.7</text>
  <rect x="280.0" y="117.0" width="181.1" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">monthly, last 90 days</text>
  <text x="674.0" y="130.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">20.7</text>
  <rect x="280.0" y="149.0" width="166.0" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">all the past + year column</text>
  <text x="674.0" y="162.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">19.0</text>
  <rect x="280.0" y="181.0" width="151.4" height="18.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="270.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">frozen × actual / predicted, 28 d</text>
  <text x="674.0" y="194.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">17.3</text>
  <line x1="440.1" y1="10.0" x2="440.1" y2="206.0" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
</svg>
<figcaption>WAPE on 2012, %. The dashed line is 18.3%, the error on held out weeks of 2011. The multiplier is updated daily, retraining is monthly.</figcaption>
</figure>

Part of it is the month column, I think. For September 2012 the only September in the training data is the old one. Without month and season it is 30.7%, still bad. I can only guess that the old rows weigh too much, even for December they are 8,645 of 16,637. Training only on the last 90 days gives 20.7%, all the past plus the year column gives 19.0%. The best is the old frozen model multiplied by actual / predicted over the previous 28 days, 17.3%. The race is not quite fair, the multiplier moves every day and the retraining is monthly. And in January it has no 28 days yet, that month stays at 49%.

## What I didn't check

One city, one model and growth in one direction, very large. A slow drift of 5% a year would be harder for the sign of the error too. I assumed that the answers are known the next day, for credit they come in months. An empty PSI bin is half a row for me, with 5 rows the monthly PSI of temperature goes from 0.7 to 2.7. The multiplier was not in the criteria and the other ways to retrain came after the first results. DDM and ADWIN on the stream of errors I did not try.
