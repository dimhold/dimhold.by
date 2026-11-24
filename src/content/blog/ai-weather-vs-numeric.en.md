---
title: "30 days of bias correction tied with the AI forecast thanks to 2 airports of 16"
description: "I compared AIFS, IFS and GFS temperature forecasts with the thermometers of 16 airports from March to July 2025. AIFS is better by 16% one day ahead. The old IFS minus its mean error of 30 days gave the same gain on average, but 2 airports made that tie."
date: 2025-08-03
lang: en
translationKey: ai-weather-vs-numeric
tags: ["open-data", "machine-learning", "numbers"]
---

GFS for Delhi airport, 1 day ahead, is wrong by 4.0 degrees on average. Repeating yesterday's thermometer there is wrong by 1.9. I found this row in a table I was building for another reason. It puts 5 months of forecasts from the free archive of `open-meteo.com` next to the reports of 16 airports.

I usually take the default model of whatever weather API I have and never put its answer next to a thermometer. Then the default got a neighbour. On February 25 ECMWF [made AIFS operational](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational), a neural network that runs beside its physical model IFS from the same initial conditions. The announcement says it is better for many measures, with gains of up to 20%. The API serves both and only one word in the request changes. I wanted to know what that word is worth for plain air temperature.

This is not a new question. [Ben Bouallègue and colleagues](https://arxiv.org/abs/2307.10128) compared the Pangu model with IFS in a setup close to operations, against stations too. [Bremnes and colleagues](https://arxiv.org/abs/2309.01247) did it at Norwegian stations, raw and corrected. I wanted to see AIFS the way a free API returns it.

## What I compared

The Previous Runs API of the same service keeps what a model said 1, 2, 3, 4 and 5 days before the hour. I took `ecmwf_ifs025`, `ecmwf_aifs025_single` (AIFS Single v1) and the American `gfs_global` from March 1 to July 31, with the elevation of the airport. As the truth I took METAR from the Iowa Environmental Mesonet, the closest report within 15 minutes. I fixed the list of airports before the run, from Minsk and Helsinki to Singapore and Sydney.

AIFS makes a step of 6 hours, so the main table has only 00, 06, 12 and 18 UTC. The error is averaged per airport first and then over the airports. Intervals are 95%, from a bootstrap over whole weeks. GraphCast was in the plan too. The archive had it for 69% of the hours at day 1 and for 27% at day 3, so I dropped it.

Before the run I wrote down 3 guesses. A tie at day 1, 5 to 10% for AIFS at days 3 to 5 and a loss for AIFS on the daily maximum. All 3 were wrong.

## AIFS against IFS

| days ahead | IFS | AIFS | GFS | same as N days ago |
|---|---|---|---|---|
| 1 | 1.41 | 1.19 | 1.57 | 2.47 |
| 2 | 1.50 | 1.25 | 1.71 | 3.15 |
| 3 | 1.61 | 1.34 | 1.82 | 3.31 |
| 4 | 1.70 | 1.47 | 1.96 | 3.45 |
| 5 | 1.86 | 1.61 | 2.17 | 3.60 |

At day 1 AIFS is better by 0.22 (from 0.19 to 0.25), which is 15.7%. It wins at 14 airports of 16. At day 3 the gain is 16.7%, at day 5 it is 13.3%. AIFS at day 5 is as wrong as IFS at day 3. But these are averages. Hour by hour at day 1 AIFS is closer in 56% of the cases and IFS in 39%, the rest are ties.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Mean absolute error of temperature at 16 airports by lead from 1 to 5 days, March to July 2025, degrees. AIFS: 1.19; 1.25; 1.34; 1.47; 1.61. IFS: 1.41; 1.50; 1.61; 1.70; 1.86. GFS: 1.57; 1.71; 1.82; 1.96; 2.17. Repeating the observation from N days ago: 2.47; 3.15; 3.31; 3.45; 3.60.">
  <line x1="50" y1="250.0" x2="470" y2="250.0" class="f-plain"/>
  <text x="42.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0</text>
  <line x1="50" y1="196.0" x2="470" y2="196.0" class="f-plain"/>
  <text x="42.0" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="50" y1="142.0" x2="470" y2="142.0" class="f-plain"/>
  <text x="42.0" y="146.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="50" y1="88.0" x2="470" y2="88.0" class="f-plain"/>
  <text x="42.0" y="92.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="50" y1="34.0" x2="470" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="70.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <text x="170.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <text x="270.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <text x="370.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="470.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">5</text>
  <polyline points="70.0,116.4 170.0,80.2 270.0,71.0 370.0,63.6 470.0,55.8" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:2 4"/>
  <circle cx="70.0" cy="116.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="80.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="71.0" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="63.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="55.8" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,165.3 170.0,157.5 270.0,151.9 370.0,144.2 470.0,133.0" style="fill:none;stroke:var(--muted);stroke-width:2;"/>
  <circle cx="70.0" cy="165.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="157.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="151.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="144.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="133.0" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,174.1 170.0,169.1 270.0,163.3 370.0,158.4 470.0,149.5" style="fill:none;stroke:var(--ink);stroke-width:2;"/>
  <circle cx="70.0" cy="174.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.0" cy="169.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="270.0" cy="163.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="370.0" cy="158.4" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="470.0" cy="149.5" r="3" style="fill:var(--ink);stroke:none"/>
  <polyline points="70.0,186.0 170.0,182.3 270.0,177.8 370.0,170.9 470.0,162.9" style="fill:none;stroke:var(--accent);stroke-width:2;"/>
  <circle cx="70.0" cy="186.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="170.0" cy="182.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="270.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="370.0" cy="170.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="470.0" cy="162.9" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="482.0" y="59.8" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3.60 same as N days ago</text>
  <text x="482.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2.17 GFS</text>
  <text x="482.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.86 IFS</text>
  <text x="482.0" y="171.9" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.61 AIFS</text>
  <line x1="270.0" y1="163.3" x2="470.0" y2="162.9" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">mean absolute error, °C</text>
  <text x="470.0" y="286.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">lead, days</text>
</svg>
<figcaption>The AIFS line at day 5 is where the IFS line is at day 3. All forecasts are against airport thermometers at 00, 06, 12, 18 UTC.</figcaption>
</figure>

AIFS loses in London and Johannesburg. In Johannesburg yesterday's temperature was as good as AIFS, 1.99 against 2.02. In Minsk it is 1.00 for AIFS and 1.19 for IFS.

<figure class="fig">
<svg viewBox="0 0 680 410" role="img" aria-label="One day ahead, mean absolute error at each airport. IFS, AIFS, GFS: Delhi 1.84; 1.23; 4.02, Chicago 1.61; 1.16; 1.53, Singapore 1.51; 1.07; 1.21, Helsinki 1.23; 0.89; 1.46, Denver 1.73; 1.40; 1.85, Madrid 1.22; 0.90; 1.47, Tokyo 1.40; 1.10; 0.95, Berlin 1.26; 0.96; 1.46, Sydney 1.85; 1.61; 1.03, Minsk 1.19; 1.00; 1.58, São Paulo 1.20; 1.06; 1.27, Warsaw 1.16; 1.05; 1.33, Nairobi 1.18; 1.07; 1.36, Toronto 1.49; 1.40; 1.69, London 0.98; 1.08; 1.24, Johannesburg 1.65; 2.02; 1.67.">
  <line x1="170.0" y1="40" x2="170.0" y2="366" class="f-plain"/>
  <text x="170.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="320.0" y1="40" x2="320.0" y2="366" class="f-plain"/>
  <text x="320.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="470.0" y1="40" x2="470.0" y2="366" class="f-plain"/>
  <text x="470.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="620.0" y1="40" x2="620.0" y2="366" class="f-plain"/>
  <text x="620.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="126.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Delhi</text>
  <line x1="296.0" y1="56" x2="205.1" y2="56" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="622.6" cy="56" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="296.0" cy="56" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="205.1" cy="56" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Chicago</text>
  <line x1="261.5" y1="76" x2="193.7" y2="76" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="249.5" cy="76" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="261.5" cy="76" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="193.7" cy="76" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Singapore</text>
  <line x1="245.9" y1="96" x2="179.9" y2="96" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="201.5" cy="96" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="245.9" cy="96" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="96" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Helsinki</text>
  <line x1="204.9" y1="116" x2="152.8" y2="116" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.7" cy="116" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="204.9" cy="116" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="152.8" cy="116" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="140.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Denver</text>
  <line x1="279.2" y1="136" x2="229.7" y2="136" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="298.1" cy="136" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="279.2" cy="136" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="136" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Madrid</text>
  <line x1="203.3" y1="156" x2="155.0" y2="156" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="240.3" cy="156" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="203.3" cy="156" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="155.0" cy="156" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="180.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Tokyo</text>
  <line x1="230.1" y1="176" x2="185.0" y2="176" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="162.2" cy="176" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="230.1" cy="176" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="176" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="200.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Berlin</text>
  <line x1="208.5" y1="196" x2="164.6" y2="196" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.3" cy="196" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="208.5" cy="196" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="164.6" cy="196" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="220.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Sydney</text>
  <line x1="298.1" y1="216" x2="260.9" y2="216" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="173.9" cy="216" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="298.1" cy="216" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.9" cy="216" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="240.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Minsk</text>
  <line x1="198.2" y1="236" x2="170.4" y2="236" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="256.7" cy="236" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="198.2" cy="236" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.4" cy="236" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="260.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">São Paulo</text>
  <line x1="199.4" y1="256" x2="178.7" y2="256" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="210.2" cy="256" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="199.4" cy="256" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="178.7" cy="256" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="280.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Warsaw</text>
  <line x1="194.6" y1="276" x2="177.2" y2="276" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="219.2" cy="276" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="194.6" cy="276" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="177.2" cy="276" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Nairobi</text>
  <line x1="197.1" y1="296" x2="179.9" y2="296" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="224.3" cy="296" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="197.1" cy="296" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="296" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="320.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Toronto</text>
  <line x1="244.1" y1="316" x2="229.7" y2="316" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="273.8" cy="316" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="244.1" cy="316" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="316" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="340.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">London</text>
  <line x1="167.1" y1="336" x2="181.5" y2="336" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="206.1" cy="336" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="167.1" cy="336" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="181.5" cy="336" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="360.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Johannesburg</text>
  <line x1="266.8" y1="356" x2="322.5" y2="356" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="270.6" cy="356" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="266.8" cy="356" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="322.5" cy="356" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="144" cy="18" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="154.0" y="22.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <circle cx="224" cy="18" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="22.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">AIFS</text>
  <circle cx="304" cy="18" r="4" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="314.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">GFS</text>
  <text x="650.0" y="400.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">mean absolute error, °C</text>
</svg>
<figcaption>One day ahead. AIFS is closer than IFS at 14 airports of 16. The lone dot on the right is GFS in Delhi, 4.0 degrees.</figcaption>
</figure>

Delhi almost gave me a false conclusion. By the table GFS is worse than IFS by 0.16 at day 1 (from 0.12 to 0.21). Without Delhi it is only 0.03 (from -0.01 to 0.06). I was ready to say that GFS is as good as IFS and one airport spoils it. Then I returned Delhi and took out Sydney, where GFS is the better one by 0.83. The gap grew to 0.23. By count GFS loses at 12 airports of 16, so the average goes where one airport pulls it. My intervals resample weeks and know nothing about another list of airports.

I don't know the reason for Delhi. The GFS error there is between 3.5 and 4.4 degrees at each of the 4 hours, from 3.1 in July to 5.2 in May. It looks like a shift that moves slowly.

## A slow shift can be subtracted

So I subtracted it everywhere. For each model and lead, at each airport and hour, I took the mean error of the last 30 days. I used only errors already known when the forecast was issued. It is one line of pandas:

```
bias = err.shift(lead + 1).rolling(30, min_periods=14).mean()
```

The window needs time to fill, so these numbers start on April 7 (7,329 pairs of airport and hour). On these hours IFS is 1.39 and AIFS is 1.20, a gain of 0.19. IFS after the subtraction is 1.21, also 0.19 less. Corrected IFS minus raw AIFS is 0.002 (from -0.030 to 0.035).

<figure class="fig">
<svg viewBox="0 0 680 316" role="img" aria-label="Error before and after subtracting the mean error of the last 30 days, the same hours for all bars. 1 day ahead, IFS: 1.39, 1.21; 1 day ahead, AIFS: 1.20, 1.03; 1 day ahead, GFS: 1.58, 1.29; 5 days ahead, IFS: 1.84, 1.69; 5 days ahead, AIFS: 1.61, 1.48; 5 days ahead, GFS: 2.19, 1.97.">
  <line x1="347.2" y1="44" x2="347.2" y2="170" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="70.0" y="52.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">1 day ahead</text>
  <text x="60.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="62" width="321.4" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="399.4" y="72.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1.39</text>
  <rect x="70" y="76" width="277.7" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="352.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.21</text>
  <text x="60.0" y="116.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="98" width="277.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="355.2" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1.20</text>
  <rect x="70" y="112" width="237.9" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="312.9" y="123.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.03</text>
  <text x="60.0" y="152.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="134" width="365.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="443.2" y="144.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1.58</text>
  <rect x="70" y="148" width="297.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="372.0" y="159.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.29</text>
  <text x="70.0" y="188.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">5 days ahead</text>
  <text x="60.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="198" width="423.5" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="501.5" y="208.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1.84</text>
  <rect x="70" y="212" width="388.3" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="463.3" y="223.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.69</text>
  <text x="60.0" y="252.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="234" width="370.8" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="448.8" y="244.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1.61</text>
  <rect x="70" y="248" width="341.6" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="416.6" y="259.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1.48</text>
  <text x="60.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="270" width="505.0" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="583.0" y="280.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2.19</text>
  <rect x="70" y="284" width="455.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="530.0" y="295.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.97</text>
  <rect x="70" y="10" width="14" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="92.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">raw</text>
  <rect x="220" y="10" width="14" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="242.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">corrected</text>
</svg>
<figcaption>Light bar is the raw forecast, solid bar is the forecast minus its mean error of the last 30 days. Dashed line is raw AIFS for day 1.</figcaption>
</figure>

I had a title ready about the same 0.19 for both. After Delhi I looked at the airports first. The correction helps IFS at 15 of 16, Minsk is the one where it gave nothing. But it beats raw AIFS only at 4. In Johannesburg raw AIFS is 2.3 and corrected IFS is 1.2, in Sydney 1.7 and 1.1. Only in these 2 places AIFS is colder than the thermometer by more than 1 degree. Without them raw AIFS is better by 0.12 (from 0.09 to 0.15). At day 5 it is better even with them, 1.61 against 1.69.

The practical answer is to do both. Corrected AIFS at day 1 is 1.03, a quarter less than raw IFS. It beats corrected IFS at 15 airports of 16.

## The choice of truth

Many comparisons use ERA5, the ECMWF reanalysis. Against it, up to July 27, AIFS at day 1 is 0.74 and IFS is 1.12. The gain grows from 0.22 to 0.37 and AIFS wins at 16 of 16. AIFS was trained on ERA5 and on ECMWF analyses, so I would expect it to look like ERA5. ERA5 itself is 1.04 away from the thermometers of these airports. From ERA5 alone I would have reported a gain 1.7 times larger.

## The middle of the step

Between its steps of 6 hours the API fills AIFS by interpolation. At its own hours AIFS is 1.19, 3 hours away from them it is 1.32. IFS only goes from 1.41 to 1.43. Over all 24 hours the gain of AIFS is 0.15. For the daily maximum it is 0.08 and AIFS wins at 9 airports. Both are too cold at the top, AIFS by 0.69 and IFS by 0.59.

To see how much of this is the step I kept only the 00, 06, 12 and 18 readings of METAR. The maximum of a cubic spline through them is too cold by 0.55, with the real thermometer. With 3 hours, the step of IFS in the open data, it is 0.19. My spline only stands in for the API's interpolation. If it is close, the step explains most of the AIFS miss and a third of the IFS one.

## What I did not check

Only temperature. Rain and wind can give another order. 5 months are spring and summer in the north, no winter inversions. Nairobi has reports for only 81% of the hours. METAR outside the US is mostly rounded to a whole degree. I trust the API that "1 day before" means the same for all 3 models and did not verify it on raw runs. IFS here is the open version at 0.25 degrees, not the full one. The window of 30 days is not tuned, 20 and 40 give the same 1.21 and 10 days give 1.26.
