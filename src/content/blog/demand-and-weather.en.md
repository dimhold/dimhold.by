---
title: "Wind improved my forecast of British electricity demand as much as temperature did"
description: "Two open files, demand from National Grid ESO and weather from ERA5, one model and a test year split by time. Wind took as much error off the forecast as temperature, apparently because small wind farms hide inside the demand column."
date: 2024-08-04
lang: en
translationKey: demand-and-weather
tags: ["open-data", "machine-learning", "statistics"]
---

On November 30, 2023 the simplest forecast of British electricity demand, the same half hour last week, missed by 7,446 MW on average over the whole day. It is the worst day of that rule in my test year. The mean temperature of 8 cities went from 11.6 °C a week earlier to 0.8 °C. The obvious reading is that it got cold and people turned the heaters on. But the same demand file has an estimate for small wind farms and between these 2 days it fell from 4,112 to 1,127 MW. Almost 3 GW of the 7.4 could be wind that stopped blowing.

For me weather in a demand forecast was always temperature. I had read this so many times that I never measured what the other weather columns are worth.

The subject is old. Taylor and Buizza put weather ensembles with temperature, wind speed and cloud cover into a demand model for England and Wales in 2003. Wind enters there as "cooling power of the wind". Hor with co-authors looked at monthly demand in 2005. I wanted to see the size of it in recent data.

## The 2 files

Demand is the `ND` column of the historic demand files of National Grid ESO, half hour by half hour, as they stood in the Wayback Machine on July 13. The 2024 file ends on June 22.

Weather is ERA5 from `open-meteo.com`, the plain mean of London, Birmingham, Manchester, Leeds, Newcastle, Glasgow, Cardiff, Bristol. ERA5 is a reanalysis, a weather model fitted to observations afterwards and below I call it measured. The same service keeps old GFS forecasts, so I took the temperature that was forecast 2 days ahead.

I train on April 2021 to June 2023 and test on July 2023 to June 22, 2024. The forecast is made in the morning of the day before, so the last full day of demand it knows is 2 days old. The model is always `HistGradientBoostingRegressor` from `scikit-learn` 1.5.1 with 400 trees and a learning rate of 0.05, only the columns change. Temperature has 2 of them, the current value and the mean of the last 24 hours. Wind and sun have one each. I wrote down what I expected before the first run.

The GFS archive has no temperature from December 30 to January 20, 22 days in the middle of winter. This model accepts empty values without a word. I found the hole only because the script counts them. So every variant is scored on the 16,165 half hours of 17,184 where the forecast exists.

## Temperature

Last week's value has a mean absolute error of 1,978 MW, 7.7% of demand. A model with the calendar alone has 1,794. Past demand brings it to 1,414. Measured temperature takes away another 307 ± 56 (one standard error, bootstrap over weeks) and leaves 1,107.

Measured temperature is cheating, because in the morning of the day before nobody has it. I expected a real forecast to lose from a third to half of the gain. It lost 16 ± 13 MW. The 2 day GFS misses the mean of 8 cities by 0.78 °C on average, which turned out to be good enough. From the calendar model I expected temperature to remove half of the error and it removed 353 MW, a fifth.

<figure class="fig">
<svg viewBox="0 0 680 254" role="img" aria-label="Bar chart of the mean absolute error in megawatts for the test year. same time last week: 1978; calendar: 1794; calendar, past demand: 1414; + measured temperature: 1107; + temperature forecast: 1123; + measured wind: 1115; + temp., sun, wind measured: 815; grid operator's forecast: 612; almost all columns (leak): 215.">
  <text x="240.0" y="27.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">same time last week</text>
  <rect x="250.0" y="14.0" width="365.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="621.8" y="27.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1978</text>
  <text x="240.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">calendar</text>
  <rect x="250.0" y="40.0" width="331.9" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="587.9" y="53.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1794</text>
  <text x="240.0" y="79.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">calendar, past demand</text>
  <rect x="250.0" y="66.0" width="261.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="517.6" y="79.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1414</text>
  <text x="240.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">+ measured temperature</text>
  <rect x="250.0" y="92.0" width="204.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="460.8" y="105.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1107</text>
  <text x="240.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">+ temperature forecast</text>
  <rect x="250.0" y="118.0" width="207.7" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="463.7" y="131.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1123</text>
  <text x="240.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">+ measured wind</text>
  <rect x="250.0" y="144.0" width="206.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="462.2" y="157.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1115</text>
  <text x="240.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">+ temp., sun, wind measured</text>
  <rect x="250.0" y="170.0" width="150.7" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="406.7" y="183.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">815</text>
  <text x="240.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">grid operator's forecast</text>
  <rect x="250.0" y="196.0" width="113.3" height="17" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="369.3" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">612</text>
  <text x="240.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">almost all columns (leak)</text>
  <rect x="250.0" y="222.0" width="39.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="295.8" y="235.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">215</text>
</svg>
<figcaption>Mean absolute error on the test year, MW. The same model in every row except the first one and the operator. A plus adds to the third row only. Grey rows know something that a forecast cannot know in the morning of the day before.</figcaption>
</figure>

## Then the wind

Wind and sun were in my plan only as an upper bound. Instead of temperature, the ERA5 wind speed at 100 m over the same 8 cities removes 299 ± 46 MW. The 2 models differ by 8 ± 38 MW, so I can't tell them apart. Sunshine alone removes 65 ± 18. All of this is measured weather, forecasts come below.

I don't think this is about cold walls. `ND` is what the transmission network sees. Rooftop panels and small wind farms sit on local networks, so for the operator their output looks like customers who switched something off. The demand file has an estimate of both. The wind part is between 490 and 4,337 MW in 90% of the test half hours and its correlation with my 8 city wind is 0.94.

So I added both estimates back to the demand, past demand included, then trained everything again. Now temperature removes 184 ± 37 MW, wind 24 ± 13 and sun 1 ± 4.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="How many megawatts of mean absolute error each weather input removes from the model without weather. temperature: demand as the grid sees it 307 ± 56, with small wind and solar added back 184 ± 37; wind: demand as the grid sees it 299 ± 46, with small wind and solar added back 24 ± 13; sun: demand as the grid sees it 65 ± 18, with small wind and solar added back 1 ± 4.">
  <rect x="130.0" y="8.0" width="12.0" height="12" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="148.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">demand as the grid sees it</text>
  <rect x="370.0" y="8.0" width="12.0" height="12" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="388.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">with small wind and solar added back</text>
  <text x="118.0" y="57.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">temperature</text>
  <rect x="130.0" y="34.0" width="330.4" height="15" style="fill:var(--accent);opacity:1;stroke:none"/>
  <line x1="339.1" y1="41.5" x2="581.8" y2="41.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="589.8" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">307 ± 56</text>
  <rect x="130.0" y="53.0" width="197.3" height="15" style="fill:var(--ink);opacity:1;stroke:none"/>
  <line x1="247.0" y1="60.5" x2="407.6" y2="60.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="415.6" y="65.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">184 ± 37</text>
  <text x="118.0" y="107.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">wind</text>
  <rect x="130.0" y="84.0" width="321.9" height="15" style="fill:var(--accent);opacity:1;stroke:none"/>
  <line x1="352.8" y1="91.5" x2="551.1" y2="91.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="559.1" y="96.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">299 ± 46</text>
  <rect x="130.0" y="103.0" width="26.1" height="15" style="fill:var(--ink);opacity:1;stroke:none"/>
  <line x1="130.0" y1="110.5" x2="183.3" y2="110.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="191.3" y="115.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">24 ± 13</text>
  <text x="118.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">sun</text>
  <rect x="130.0" y="134.0" width="69.9" height="15" style="fill:var(--accent);opacity:1;stroke:none"/>
  <line x1="161.0" y1="141.5" x2="238.7" y2="141.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="246.7" y="146.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">65 ± 18</text>
  <rect x="130.0" y="153.0" width="1.5" height="15" style="fill:var(--ink);opacity:1;stroke:none"/>
  <line x1="130.0" y1="160.5" x2="139.8" y2="160.5" class="f-line" style="stroke:var(--muted)"/>
  <text x="147.8" y="165.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 ± 4</text>
</svg>
<figcaption>Error removed by one weather input, MW, for 2 targets. When the operator's estimate of small wind and solar plants is added back to demand, wind and sun have almost nothing left to explain. After ± is one standard error, the thin line is 2 of them.</figcaption>
</figure>

Temperature lost something too. In winter its correlation with wind is 0.59, so a part of the 307 was probably wind. There is one more reason why wind looks so strong. The demand of 2 days ago already carries some of the weather and temperature changes slower. With the season taken out, the daily mean temperature correlates with itself 2 days earlier at 0.56, the wind at 0.34.

The check is a bit circular. These estimates are themselves models and I suppose weather goes into them. It shows the way wind gets into `ND`, but I can't say the estimates are right.

## The operator

National Grid ESO publishes its own forecast for the day ahead. I took the earliest issue from the Elexon API, from 19 to 45 hours before the half hour. It misses by 612 MW, 2.4%. My model with forecast temperature misses by 1,123 and is better than the operator on 16% of days. Even with all weather measured after the fact I get 815.

The gap is widest in the middle of a summer day. From 11:00 to 14:00, April to September, the operator has 880 MW and my model with measured temperature has 1,744. Sun and wind bring it to 1,240.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Mean absolute error by time of day for April to September, 3 lines. The model with measured temperature grows from about 700 MW at night to about 1800 MW around 13:00. With measured sun and wind added it peaks near 1300 MW. The operator's forecast stays below 910 MW.">
  <line x1="60" y1="250.0" x2="660" y2="250.0" class="f-plain"/>
  <text x="52.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="199.5" x2="660" y2="199.5" class="f-plain"/>
  <text x="52.0" y="203.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">500</text>
  <line x1="60" y1="149.0" x2="660" y2="149.0" class="f-plain"/>
  <text x="52.0" y="153.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="60" y1="98.5" x2="660" y2="98.5" class="f-plain"/>
  <text x="52.0" y="102.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1500</text>
  <line x1="60" y1="48.0" x2="660" y2="48.0" class="f-plain"/>
  <text x="52.0" y="52.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2000</text>
  <text x="66.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0:00</text>
  <text x="141.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3:00</text>
  <text x="216.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6:00</text>
  <text x="291.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9:00</text>
  <text x="366.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12:00</text>
  <text x="441.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15:00</text>
  <text x="516.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">18:00</text>
  <text x="591.3" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21:00</text>
  <polyline points="66.3,179.6 78.8,181.0 91.3,180.5 103.8,179.4 116.3,180.2 128.8,180.5 141.3,180.2 153.8,178.9 166.3,178.8 178.8,179.5 191.3,180.8 203.8,179.4 216.3,183.1 228.8,178.3 241.3,171.6 253.8,164.7 266.3,154.4 278.8,145.4 291.3,128.3 303.8,113.5 316.3,104.1 328.8,94.3 341.3,84.9 353.8,78.7 366.3,73.4 378.8,69.3 391.3,67.1 403.8,69.5 416.3,72.2 428.8,74.0 441.3,75.7 453.8,83.3 466.3,95.8 478.8,106.7 491.3,123.3 503.8,132.8 516.3,148.0 528.8,161.1 541.3,165.6 553.8,170.7 566.3,171.4 578.8,171.4 591.3,175.0 603.8,170.6 616.3,177.3 628.8,179.6 641.3,179.0 653.8,182.5" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <polyline points="66.3,205.7 78.8,205.0 91.3,204.6 103.8,203.3 116.3,204.5 128.8,206.2 141.3,205.0 153.8,205.4 166.3,204.2 178.8,204.4 191.3,202.7 203.8,199.5 216.3,198.0 228.8,189.7 241.3,182.0 253.8,175.8 266.3,173.3 278.8,164.9 291.3,153.9 303.8,148.7 316.3,140.2 328.8,135.0 341.3,127.1 353.8,128.2 366.3,121.8 378.8,123.9 391.3,125.1 403.8,122.6 416.3,120.8 428.8,120.0 441.3,123.5 453.8,129.8 466.3,135.7 478.8,141.5 491.3,156.2 503.8,155.5 516.3,161.4 528.8,174.5 541.3,186.0 553.8,190.0 566.3,190.0 578.8,190.0 591.3,193.6 603.8,195.6 616.3,197.1 628.8,198.0 641.3,200.4 653.8,201.1" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <polyline points="66.3,214.2 78.8,215.6 91.3,215.8 103.8,214.9 116.3,213.9 128.8,215.0 141.3,213.9 153.8,214.7 166.3,215.6 178.8,214.4 191.3,216.0 203.8,213.9 216.3,208.1 228.8,203.3 241.3,194.7 253.8,191.3 266.3,197.7 278.8,194.9 291.3,191.9 303.8,186.2 316.3,180.1 328.8,174.6 341.3,163.9 353.8,160.8 366.3,158.7 378.8,159.2 391.3,161.2 403.8,162.7 416.3,163.6 428.8,163.4 441.3,163.0 453.8,165.0 466.3,165.7 478.8,169.5 491.3,173.0 503.8,177.5 516.3,185.3 528.8,190.8 541.3,195.4 553.8,198.8 566.3,194.9 578.8,195.5 591.3,194.3 603.8,199.6 616.3,204.1 628.8,208.3 641.3,209.4 653.8,211.4" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <text x="8.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">MAE, MW</text>
  <rect x="120.0" y="7.0" width="16.0" height="4" style="fill:var(--muted);opacity:1;stroke:none"/>
  <text x="142.0" y="15.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">temperature</text>
  <rect x="255.2" y="7.0" width="16.0" height="4" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="277.2" y="15.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">temperature, sun, wind</text>
  <rect x="469.6" y="7.0" width="16.0" height="4" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="491.6" y="15.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">operator</text>
</svg>
<figcaption>Error by local time of day, April to September. The middle of the day is the hard part. Between 11:00 and 14:00 measured temperature takes only a tenth off the error of the model without weather (1938 to 1744).</figcaption>
</figure>

For sun and wind the forecast archive starts in January 2024, so an honest test was possible only on 114 days from March, with wind at 10 m. I trained on ERA5 and corrected the forecasts against it on January and February. Without weather the error is 1,365 MW, with forecast temperature 1,176, with forecast wind instead 1,204. The last 2 differ by 28 ± 62, so the tie holds but the test is weak. All 3 forecasts together give 952. With everything measured it is 870 and the operator has 679 on the same days.

## Where it is easy to cheat

The same CSV row holds columns that nobody knows the day before. I gave the model almost all of them and it got 215 MW, 0.8%, almost 3 times better than the operator. A random split instead of a split by time is quieter. If the test half hours are picked at random, the model with past demand and forecast temperature shows 777 MW instead of 1,123. Picking whole random days gives 1,099, which is almost the honest number.

## What I didn't check

One family of models and one test year. With 8 leaves per tree instead of the default 31 the tie stays, 1,114 for temperature and 1,119 for wind, but another kind of model can use them differently. The points are cities, I did not look where the wind farms really are. I also have not looked at what the operator knows and I don't, I suppose it is a much better picture of small generation.
