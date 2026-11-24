---
title: "One parameter of the ECB curve fell by 240 points in a day, no rate moved by 5 basis points"
description: "I checked the 6 Svensson parameters of the ECB yield curve against its published rates on 4964 days up to February 1, 2024. On some days 2 parameters jump by tens of points while no rate moves by 10 basis points, on one day the parameters belong to another curve. Whether the curve is inverted depends on which of the 2 curves is asked."
date: 2024-02-04
lang: en
translationKey: ecb-yield-curve
tags: ["open-data", "numbers", "statistics"]
---

On November 12, 2012 the parameter BETA2 of the ECB yield curve for all euro area governments was 141.49. On November 13 it was -98.51. Its unit is the percentage point, so it lost 240 of them overnight. The 10-year rate of the same curve was 3.221% on the first day and 3.224% on the second. Of 33 rates from 3 months to 30 years the one that moved the most was the 30-year one, by 4.4 basis points. A basis point is 0.01 of a percentage point.

My habit with such data is to treat the parameters as its compact form. The curve of one day is 6 numbers of the Svensson formula and any rate can be computed back from them, so why keep 33. I took for granted that when the curve moves a little the 6 numbers move a little too. I never looked.

The weakness itself is known. De Pooter described in 2007 and Gilli, Große and Schumann in 2010 that 2 terms of the formula become almost the same thing when their time constants are close. I wanted to see how it looks in the official daily numbers.

## What I took

The dataset YC of the ECB Data Portal, as CSV from its API, for 2 curves: AAA governments and all governments. I took the 6 parameters, 33 spot rates (the API has 358, one per month of maturity) and the forward rates at 10 and 30 years. It starts on September 6, 2004. The curve of a working day comes out at noon of the next one. Today is Sunday and the curve of Friday will come on Monday, so the last one here is Thursday, February 1. That is 4964 curves of each kind.

The prices of the bonds behind the curve are not in the dataset, so I cannot say how well it fits the bonds. I can only put the numbers of the ECB next to each other, with no forecasts. It ran on Python 3.11 with numpy 1.26.3, pandas 2.2.0 and scipy 1.12.0.

```
z(T) = b0 + b1*f(T/t1) + b2*h(T/t1) + b3*h(T/t2)
f(x) = (1 - exp(-x)) / x
h(x) = f(x) - exp(-x)
```

## 6 numbers against 33

First I computed the rates from the parameters and expected a full match. For all governments I got it, 4964 days of 4964, the largest difference is 1.4e-10 of a point. For AAA it is 4959. Of the 5 other days 4 are in May 2007 and differ by less than 0.01 basis point. The last one is June 23, 2022, where the parameters give a curve up to 5.6 basis points away from the published rates.

I thought the row was shifted by a day, but the parameters of neighbouring days fit worse. The published rates of that day do lie on a Svensson curve, only it is another one, with BETA0 equal to 2.106 where the table says 2.014. The published forward rates agree with the rates, so the parameters are the odd ones. My guess is that the day was estimated twice and the new parameters were not stored.

## 2 humps that cancel

<figure class="fig">
<svg viewBox="0 0 680 376" role="img" aria-label="Top: parameter BETA2 of the ECB curve for all euro area governments on 17 working days from November 1 to 23, 2012. It stays near -98, is -13.7 on November 9, jumps to 141.49 on November 12, returns to -98.51 on November 13 and is -11.0 on November 14. Bottom: the 2, 10 and 30 year rates of the same curve on the same days are 3 almost flat lines near 1.3, 3.2 and 4.3 percent.">
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">BETA2, percentage points</text>
  <line x1="60" y1="178.6" x2="600" y2="178.6" class="f-plain"/>
  <text x="52.0" y="182.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-100</text>
  <line x1="60" y1="121.4" x2="600" y2="121.4" class="f-plain"/>
  <text x="52.0" y="125.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="64.3" x2="600" y2="64.3" class="f-plain"/>
  <text x="52.0" y="68.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <polyline points="74.0,177.6 106.0,177.7 138.0,177.7 170.0,177.8 202.0,177.6 234.0,178.8 266.0,129.3 298.0,40.6 330.0,177.7 362.0,127.7 394.0,177.7 426.0,178.2 458.0,177.6 490.0,177.8 522.0,177.7 554.0,177.6 586.0,177.8" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="74.0" cy="177.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="106.0" cy="177.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="138.0" cy="177.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="170.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="202.0" cy="177.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="234.0" cy="178.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="266.0" cy="129.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="298.0" cy="40.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="330.0" cy="177.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="362.0" cy="127.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="394.0" cy="177.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="426.0" cy="178.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="458.0" cy="177.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="490.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="522.0" cy="177.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="554.0" cy="177.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="586.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="307.0" y="44.6" text-anchor="start" class="f-mono f-ink" style="font-size:11px">141.49</text>
  <text x="330.0" y="194.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">-98.51</text>
  <text x="10.0" y="214.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">spot rates, %</text>
  <line x1="60" y1="326.0" x2="600" y2="326.0" class="f-plain"/>
  <text x="52.0" y="330.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="286.0" x2="600" y2="286.0" class="f-plain"/>
  <text x="52.0" y="290.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="60" y1="246.0" x2="600" y2="246.0" class="f-plain"/>
  <text x="52.0" y="250.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <polyline points="74.0,299.4 106.0,299.2 138.0,299.5 170.0,299.8 202.0,300.2 234.0,300.0 266.0,300.2 298.0,299.4 330.0,299.8 362.0,300.0 394.0,299.8 426.0,300.1 458.0,299.6 490.0,299.8 522.0,300.0 554.0,300.7 586.0,301.4" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="608.0" y="305.4" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2Y</text>
  <polyline points="74.0,261.6 106.0,261.6 138.0,260.5 170.0,261.4 202.0,261.9 234.0,261.2 266.0,261.5 298.0,261.6 330.0,261.5 362.0,261.6 394.0,261.4 426.0,261.7 458.0,261.7 490.0,261.1 522.0,261.3 554.0,261.6 586.0,261.9" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="608.0" y="265.9" text-anchor="start" class="f-mono f-ink" style="font-size:11px">10Y</text>
  <polyline points="74.0,240.6 106.0,240.6 138.0,239.7 170.0,240.3 202.0,240.9 234.0,241.0 266.0,241.5 298.0,240.4 330.0,241.3 362.0,240.7 394.0,240.8 426.0,240.8 458.0,240.9 490.0,240.6 522.0,240.7 554.0,240.8 586.0,240.8" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="608.0" y="244.8" text-anchor="start" class="f-mono f-ink" style="font-size:11px">30Y</text>
  <text x="74.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="106.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="138.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="170.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="202.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="234.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="266.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="298.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <text x="330.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="362.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <text x="394.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="426.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <text x="458.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">19</text>
  <text x="490.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="522.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <text x="554.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">22</text>
  <text x="586.0" y="344.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">23</text>
  <text x="60.0" y="364.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">November 2012</text>
</svg>
<figcaption>The same 17 working days of November 2012, all governments. Above is BETA2 in percentage points, below are 3 rates computed from the same parameters.</figcaption>
</figure>

`h` is a hump, 0 at both ends. On November 12, 2012 the time constants were 1.218 and 1.254 years, so it is almost the same hump 2 times, with the coefficients 141.5 and -145.6. At the peak the first one adds 42.2 points to the rate, the second one takes away 43.5 and together they are never more than 1.6. The next day the first constant is the larger one, 1.212 against 1.161, so the signs swap. What stays is the sum of the coefficients, -4.12 and then -3.95.

<figure class="fig">
<svg viewBox="0 0 680 320" role="img" aria-label="2 terms of the Svensson formula on November 12, 2012 by maturity from 0 to 30 years. The BETA2 term rises to 42.2 percentage points near 2 years and falls towards 0. The BETA3 term is almost its mirror image and goes down to -43.5. Their sum is a line near 0 that never leaves the band of 1.6 points.">
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">percentage points</text>
  <line x1="60" y1="246.0" x2="660" y2="246.0" class="f-plain"/>
  <text x="52.0" y="250.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-40</text>
  <line x1="60" y1="198.0" x2="660" y2="198.0" class="f-plain"/>
  <text x="52.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-20</text>
  <line x1="60" y1="150.0" x2="660" y2="150.0" class="f-plain"/>
  <text x="52.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="102.0" x2="660" y2="102.0" class="f-plain"/>
  <text x="52.0" y="106.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="54.0" x2="660" y2="54.0" class="f-plain"/>
  <text x="52.0" y="58.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="60.0" y1="270" x2="60.0" y2="275" class="f-plain"/>
  <text x="60.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="100.0" y1="270" x2="100.0" y2="275" class="f-plain"/>
  <text x="100.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="160.0" y1="270" x2="160.0" y2="275" class="f-plain"/>
  <text x="160.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="260.0" y1="270" x2="260.0" y2="275" class="f-plain"/>
  <text x="260.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="460.0" y1="270" x2="460.0" y2="275" class="f-plain"/>
  <text x="460.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="660.0" y1="270" x2="660.0" y2="275" class="f-plain"/>
  <text x="660.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <polyline points="60.0,150.0 65.0,119.6 70.0,96.7 75.0,79.9 80.0,67.8 85.0,59.4 90.0,53.8 95.0,50.5 100.0,49.0 105.0,48.7 110.0,49.4 115.0,50.8 120.0,52.8 125.0,55.1 130.0,57.7 135.0,60.4 140.0,63.2 145.0,66.0 150.0,68.8 155.0,71.6 160.0,74.3 165.0,76.9 170.0,79.4 175.0,81.8 180.0,84.0 185.0,86.2 190.0,88.3 195.0,90.3 200.0,92.2 205.0,94.0 210.0,95.7 215.0,97.3 220.0,98.9 225.0,100.3 230.0,101.7 235.0,103.0 240.0,104.3 245.0,105.5 250.0,106.6 255.0,107.7 260.0,108.8 265.0,109.7 270.0,110.7 275.0,111.6 280.0,112.5 285.0,113.3 290.0,114.1 295.0,114.8 300.0,115.6 305.0,116.3 310.0,116.9 315.0,117.6 320.0,118.2 325.0,118.8 330.0,119.4 335.0,119.9 340.0,120.5 345.0,121.0 350.0,121.5 355.0,122.0 360.0,122.4 365.0,122.9 370.0,123.3 375.0,123.7 380.0,124.2 385.0,124.6 390.0,124.9 395.0,125.3 400.0,125.7 405.0,126.0 410.0,126.4 415.0,126.7 420.0,127.0 425.0,127.3 430.0,127.7 435.0,127.9 440.0,128.2 445.0,128.5 450.0,128.8 455.0,129.1 460.0,129.3 465.0,129.6 470.0,129.8 475.0,130.1 480.0,130.3 485.0,130.5 490.0,130.8 495.0,131.0 500.0,131.2 505.0,131.4 510.0,131.6 515.0,131.8 520.0,132.0 525.0,132.2 530.0,132.4 535.0,132.6 540.0,132.8 545.0,132.9 550.0,133.1 555.0,133.3 560.0,133.5 565.0,133.6 570.0,133.8 575.0,133.9 580.0,134.1 585.0,134.2 590.0,134.4 595.0,134.5 600.0,134.7 605.0,134.8 610.0,135.0 615.0,135.1 620.0,135.2 625.0,135.4 630.0,135.5 635.0,135.6 640.0,135.7 645.0,135.9 650.0,136.0 655.0,136.1 660.0,136.2" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <polyline points="60.0,150.0 65.0,180.5 70.0,203.7 75.0,220.9 80.0,233.4 85.0,242.2 90.0,248.2 95.0,251.8 100.0,253.7 105.0,254.3 110.0,253.8 115.0,252.6 120.0,250.8 125.0,248.6 130.0,246.1 135.0,243.4 140.0,240.6 145.0,237.8 150.0,235.0 155.0,232.2 160.0,229.5 165.0,226.9 170.0,224.3 175.0,221.9 180.0,219.5 185.0,217.2 190.0,215.1 195.0,213.0 200.0,211.0 205.0,209.2 210.0,207.4 215.0,205.7 220.0,204.1 225.0,202.5 230.0,201.1 235.0,199.7 240.0,198.4 245.0,197.1 250.0,195.9 255.0,194.8 260.0,193.7 265.0,192.6 270.0,191.6 275.0,190.7 280.0,189.8 285.0,188.9 290.0,188.1 295.0,187.3 300.0,186.5 305.0,185.7 310.0,185.0 315.0,184.3 320.0,183.7 325.0,183.1 330.0,182.4 335.0,181.9 340.0,181.3 345.0,180.7 350.0,180.2 355.0,179.7 360.0,179.2 365.0,178.7 370.0,178.3 375.0,177.8 380.0,177.4 385.0,177.0 390.0,176.6 395.0,176.2 400.0,175.8 405.0,175.4 410.0,175.0 415.0,174.7 420.0,174.3 425.0,174.0 430.0,173.7 435.0,173.4 440.0,173.1 445.0,172.8 450.0,172.5 455.0,172.2 460.0,171.9 465.0,171.6 470.0,171.4 475.0,171.1 480.0,170.9 485.0,170.6 490.0,170.4 495.0,170.1 500.0,169.9 505.0,169.7 510.0,169.5 515.0,169.3 520.0,169.0 525.0,168.8 530.0,168.6 535.0,168.4 540.0,168.3 545.0,168.1 550.0,167.9 555.0,167.7 560.0,167.5 565.0,167.4 570.0,167.2 575.0,167.0 580.0,166.9 585.0,166.7 590.0,166.5 595.0,166.4 600.0,166.2 605.0,166.1 610.0,165.9 615.0,165.8 620.0,165.6 625.0,165.5 630.0,165.4 635.0,165.2 640.0,165.1 645.0,165.0 650.0,164.9 655.0,164.7 660.0,164.6" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <polyline points="60.0,150.0 65.0,150.1 70.0,150.4 75.0,150.8 80.0,151.2 85.0,151.6 90.0,152.0 95.0,152.4 100.0,152.7 105.0,153.0 110.0,153.2 115.0,153.4 120.0,153.6 125.0,153.7 130.0,153.8 135.0,153.8 140.0,153.9 145.0,153.9 150.0,153.8 155.0,153.8 160.0,153.8 165.0,153.7 170.0,153.7 175.0,153.6 180.0,153.5 185.0,153.5 190.0,153.4 195.0,153.3 200.0,153.2 205.0,153.2 210.0,153.1 215.0,153.0 220.0,152.9 225.0,152.9 230.0,152.8 235.0,152.7 240.0,152.7 245.0,152.6 250.0,152.5 255.0,152.5 260.0,152.4 265.0,152.4 270.0,152.3 275.0,152.3 280.0,152.2 285.0,152.2 290.0,152.1 295.0,152.1 300.0,152.0 305.0,152.0 310.0,152.0 315.0,151.9 320.0,151.9 325.0,151.9 330.0,151.8 335.0,151.8 340.0,151.8 345.0,151.7 350.0,151.7 355.0,151.7 360.0,151.6 365.0,151.6 370.0,151.6 375.0,151.6 380.0,151.5 385.0,151.5 390.0,151.5 395.0,151.5 400.0,151.4 405.0,151.4 410.0,151.4 415.0,151.4 420.0,151.4 425.0,151.3 430.0,151.3 435.0,151.3 440.0,151.3 445.0,151.3 450.0,151.3 455.0,151.2 460.0,151.2 465.0,151.2 470.0,151.2 475.0,151.2 480.0,151.2 485.0,151.2 490.0,151.1 495.0,151.1 500.0,151.1 505.0,151.1 510.0,151.1 515.0,151.1 520.0,151.1 525.0,151.1 530.0,151.0 535.0,151.0 540.0,151.0 545.0,151.0 550.0,151.0 555.0,151.0 560.0,151.0 565.0,151.0 570.0,151.0 575.0,151.0 580.0,150.9 585.0,150.9 590.0,150.9 595.0,150.9 600.0,150.9 605.0,150.9 610.0,150.9 615.0,150.9 620.0,150.9 625.0,150.9 630.0,150.9 635.0,150.9 640.0,150.8 645.0,150.8 650.0,150.8 655.0,150.8 660.0,150.8" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>
  <text x="184.0" y="68.4" text-anchor="start" class="f-mono f-accent" style="font-size:11px">BETA2 141.5, TAU1 1.218</text>
  <text x="184.0" y="236.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">BETA3 -145.6, TAU2 1.254</text>
  <text x="200.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">sum of both</text>
  <text x="60.0" y="308.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">maturity, years</text>
</svg>
<figcaption>November 12, 2012. 2 humps with time constants 1.218 and 1.254 years and what is left when they are added.</figcaption>
</figure>

Then I counted how often it happens, the days when at least one beta moved by more than a threshold and no rate moved by 10 basis points.

| a beta moved by more than | AAA, all days | AAA, quiet curve | all governments, all days | all governments, quiet curve |
|---|---|---|---|---|
| 1 point | 99 | 63 | 174 | 104 |
| 10 points | 14 | 9 | 31 | 23 |
| 100 points | 0 | 0 | 4 | 4 |

Before the run I wrote down "less than 1% of days" for jumps above 1 point, counting only BETA0 and BETA2. It is 1.1% for AAA and 2.1% for all governments, with any beta as in the table 1.3% and 2.1%. In all 23 cases of the second row for all governments the 2 constants were within 10% of each other on that day or the day before. I was ready to explain AAA the same way, but there it is 4 cases of 9. And closeness alone is nothing rare, for all governments it holds on 2338 days of 4964.

## Back from the rates

I also tried the other direction and gave `least_squares` of scipy the 33 exact rates of a day and 60 random starts. For the AAA curve of February 1, 2024 21 of them came within 0.01 basis point of the rates and all 21 found the parameters of the ECB. For November 12, 2012 there were 20 such starts, with BETA2 anywhere from -128 to 121. None found 141.

I had already drafted here that exact points do not give one answer. Then I looked at the status of these searches and all 20 were cut by my own limit of 500 evaluations, they were still walking along an almost flat bottom. With a limit of 10000 every one of the 20 finished. 6 arrived at the parameters of the ECB and 14 at a mirror answer, where the humps are swapped and BETA2 is -145.54. The mirror misses the rates by at most 3.9e-9 of a basis point. That is less than the last digit the API prints for the rates of 2024, so in practice there are 2 answers.

Storing only the parameters works, but the digits matter. Round the 6 parameters of November 12 to 2 decimals and the curve shifts by up to 11.0 basis points, while the next day moved it by 4.4. With 4 decimals the worst day of both curves is 0.13.

## The long rate at 0.013

BETA0 is the limit of the formula at infinite maturity and I used to read it as the level of long rates. For all governments it was 0.013 on February 25, 2010 and 2.716 on the next day. The 10-year rate went from 3.828% to 3.826% and none of the 33 moved by 6 basis points. But if somebody continues the curve to 50 years, it gives 3.16% on one day and 3.75% on the next.

BETA0 + BETA1 is the other end, the rate at zero maturity. Until April 22, 2015 it is never below 0.01 and on 845 days for all governments it is exactly 0.01. The next day it is -0.12, for AAA -0.28. It looks like a bound in the estimation that was lifted or moved on that day.

## Inverted or not

A curve is called inverted when a longer rate is below a shorter one. I expected one long period now and maybe a few days in 2008.

| pair | AAA, days below 0 | all governments, days below 0 | AAA on February 1, bp | all governments on February 1, bp |
|---|---|---|---|---|
| 10Y minus 2Y | 303 | 32 | -21.8 | 22.3 |
| 10Y minus 3M | 256 | 176 | -155.8 | -98.1 |
| 30Y minus 10Y | 206 | 6 | 16.1 | 46.1 |

AAA fits the expectation: 2 days in June 2008 and all the rest from November 2022, the last 279 without a break. All governments have 32 days in total and on Thursday the sign was the opposite one. The 2 curves disagree on 271 days, each time it is AAA that is inverted. I suppose it is the extra yield that some countries pay for longer borrowing.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="The 10 year rate minus the 2 year rate in basis points from January 2022 to February 1, 2024. The AAA line falls below 0 in November 2022, reaches -64.4 on July 3, 2023 and ends at -21.8. The line for all governments stays above 0 except 31 days in 2023, its lowest value is -19.0 on the same July 3, and it ends at 22.3.">
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">basis points</text>
  <line x1="60" y1="223.0" x2="660" y2="223.0" class="f-plain"/>
  <text x="52.0" y="227.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-50</text>
  <line x1="60" y1="178.0" x2="660" y2="178.0" style="stroke:var(--ink);stroke-width:1"/>
  <text x="52.0" y="182.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="133.0" x2="660" y2="133.0" class="f-plain"/>
  <text x="52.0" y="137.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="60" y1="88.0" x2="660" y2="88.0" class="f-plain"/>
  <text x="52.0" y="92.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="43.0" x2="660" y2="43.0" class="f-plain"/>
  <text x="52.0" y="47.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <line x1="60.0" y1="250" x2="60.0" y2="255" class="f-plain"/>
  <text x="72.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 2022</text>
  <line x1="201.0" y1="250" x2="201.0" y2="255" class="f-plain"/>
  <text x="201.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul 2022</text>
  <line x1="344.4" y1="250" x2="344.4" y2="255" class="f-plain"/>
  <text x="344.4" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 2023</text>
  <line x1="485.5" y1="250" x2="485.5" y2="255" class="f-plain"/>
  <text x="485.5" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul 2023</text>
  <line x1="628.8" y1="250" x2="628.8" y2="255" class="f-plain"/>
  <text x="628.8" y="268.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Jan 2024</text>
  <polyline points="61.6,99.0 62.3,102.3 63.1,101.0 63.9,99.9 64.7,102.7 67.0,97.9 67.8,101.8 68.6,102.8 69.4,104.6 70.1,103.5 72.5,100.6 73.2,99.6 74.0,97.2 74.8,96.2 75.6,97.7 77.9,98.1 78.7,98.2 79.5,98.9 80.3,96.8 81.0,96.4 83.4,94.9 84.2,94.6 84.9,95.5 85.7,96.9 86.5,99.2 88.8,96.6 89.6,91.1 90.4,89.7 91.2,87.4 91.9,87.6 94.3,84.7 95.1,80.2 95.8,80.7 96.6,79.9 97.4,79.8 99.7,79.6 100.5,79.6 101.3,82.7 102.1,85.2 102.9,83.0 105.2,77.3 106.0,79.5 106.8,83.0 107.5,81.0 108.3,80.6 110.6,81.1 111.4,76.1 112.2,73.2 113.0,77.8 113.8,75.6 116.1,73.0 116.9,70.6 117.7,69.2 118.4,69.0 119.2,71.3 121.6,69.9 122.3,70.8 123.1,72.1 123.9,73.1 124.7,72.4 127.0,75.2 127.8,78.5 128.6,79.9 129.4,81.2 130.1,78.6 132.5,83.1 133.2,79.8 134.0,73.2 134.8,74.0 135.6,76.1 137.9,76.5 138.7,74.0 139.5,72.9 140.3,68.9 144.2,61.6 144.9,66.6 145.7,69.8 146.5,73.1 148.8,73.0 149.6,71.9 150.4,70.9 151.2,68.8 151.9,74.4 154.3,67.6 155.1,70.1 155.8,69.6 156.6,66.8 157.4,64.8 159.7,57.1 160.5,59.3 161.3,55.5 162.1,60.5 162.9,60.6 165.2,61.5 166.0,61.3 166.8,64.9 167.5,68.3 168.3,65.5 170.6,66.7 171.4,61.7 172.2,64.6 173.0,61.3 173.8,60.2 176.1,62.8 176.9,62.5 177.7,64.0 178.4,64.5 179.2,60.4 181.6,62.1 182.3,61.6 183.1,64.5 183.9,62.0 184.7,63.8 187.0,63.9 187.8,63.3 188.6,63.7 189.4,59.1 190.1,62.4 192.5,63.4 193.2,57.5 194.0,67.5 194.8,70.4 195.6,68.0 197.9,68.1 198.7,62.5 199.5,63.1 200.3,61.8 201.0,59.0 203.4,58.3 204.2,56.3 204.9,54.0 205.7,55.2 206.5,55.3 208.8,55.3 209.6,59.9 210.4,61.9 211.2,68.9 211.9,71.0 214.3,68.2 215.1,75.0 215.8,75.7 216.6,76.3 217.4,76.8 219.7,75.7 220.5,79.4 221.3,80.2 222.1,81.3 222.9,81.5 225.2,82.7 226.0,88.2 226.8,86.4 227.5,89.4 228.3,91.0 230.6,92.0 231.4,90.4 232.2,90.9 233.0,89.9 233.8,87.2 236.1,91.3 236.9,86.7 237.7,88.1 238.4,92.6 239.2,89.6 241.6,87.2 242.3,82.3 243.1,82.1 243.9,82.1 244.7,82.6 247.0,87.5 247.8,87.7 248.6,93.7 249.4,86.7 250.1,88.2 252.5,88.3 253.2,83.3 254.0,85.4 254.8,93.8 255.6,97.0 257.9,101.5 258.7,107.0 259.5,105.5 260.3,109.8 261.0,116.3 263.4,118.1 264.2,116.4 264.9,123.1 265.7,127.0 266.5,124.4 268.8,122.9 269.6,117.0 270.4,107.9 271.2,109.6 271.9,104.4 274.3,106.6 275.1,108.0 275.8,102.7 276.6,106.0 277.4,104.2 279.7,101.4 280.5,93.3 281.3,83.9 282.1,94.8 282.9,97.5 285.2,105.3 286.0,105.3 286.8,106.3 287.5,102.2 288.3,98.4 290.6,102.4 291.4,105.5 292.2,110.2 293.0,105.1 293.8,110.4 296.1,110.7 296.9,106.7 297.7,110.1 298.4,109.1 299.2,110.1 301.6,108.8 302.3,116.9 303.1,117.8 303.9,117.3 304.7,119.2 307.0,118.3 307.8,122.7 308.6,126.7 309.4,123.9 310.1,123.2 312.5,125.3 313.2,127.3 314.0,136.0 314.8,138.4 315.6,134.5 317.9,133.3 318.7,134.3 319.5,137.2 320.3,134.9 321.0,134.2 323.4,142.3 324.2,143.7 324.9,141.3 325.7,137.9 326.5,142.0 328.8,144.6 329.6,142.2 330.4,136.6 331.2,137.7 331.9,140.7 334.3,135.4 335.1,131.3 335.8,133.0 336.6,131.6 337.4,133.7 340.5,130.0 341.3,128.6 342.1,131.0 342.9,131.5 345.2,135.7 346.0,140.0 346.8,143.1 347.5,142.8 348.3,148.9 350.6,146.4 351.4,147.5 352.2,153.8 353.0,154.8 353.8,155.9 356.1,153.6 356.9,153.1 357.7,160.4 358.4,160.7 359.2,156.5 361.6,152.8 362.3,153.8 363.1,154.6 363.9,152.2 364.7,149.7 367.0,152.4 367.8,150.5 368.6,152.9 369.4,151.4 370.1,152.3 372.5,148.4 373.2,148.4 374.0,150.8 374.8,154.2 375.6,155.7 377.9,157.5 378.7,160.0 379.5,156.5 380.3,153.3 381.0,155.4 383.4,158.2 384.2,154.5 384.9,154.7 385.7,155.8 386.5,160.2 388.8,160.7 389.6,158.5 390.4,162.2 391.2,159.4 391.9,162.1 394.3,167.8 395.1,169.0 395.8,177.1 396.6,174.4 397.4,171.2 399.7,154.1 400.5,159.4 401.3,149.2 402.1,148.1 402.9,150.2 405.2,151.0 406.0,150.0 406.8,151.1 407.5,154.5 408.3,156.7 410.6,144.8 411.4,143.9 412.2,144.8 413.0,146.5 413.8,150.0 416.1,151.4 416.9,149.8 417.7,148.5 418.4,151.3 422.3,152.6 423.1,152.3 423.9,155.8 424.7,153.6 427.0,153.0 427.8,156.2 428.6,154.7 429.4,155.6 430.1,154.4 432.5,154.8 433.2,155.7 434.0,154.0 434.8,153.4 435.6,156.1 438.7,155.7 439.5,155.1 440.3,152.5 441.0,147.1 443.4,148.5 444.2,147.0 444.9,148.6 445.7,151.8 446.5,152.5 448.8,148.7 449.6,149.6 450.4,151.6 451.2,148.0 451.9,148.5 454.3,149.2 455.1,150.0 455.8,151.6 456.6,152.5 457.4,151.1 459.7,157.3 460.5,158.5 461.3,158.9 462.1,160.4 462.9,162.8 465.2,163.5 466.0,163.1 466.8,164.1 467.5,161.5 468.3,164.6 470.6,165.5 471.4,167.9 472.2,166.8 473.0,175.4 473.8,179.5 476.1,176.8 476.9,183.5 477.7,182.5 478.4,185.0 479.2,188.4 481.6,189.4 482.3,192.0 483.1,191.3 483.9,191.1 484.7,191.0 487.0,195.1 487.8,192.0 488.6,188.9 489.4,185.6 490.1,179.6 492.5,177.7 493.2,179.9 494.0,181.0 494.8,182.5 495.6,184.2 497.9,186.0 498.7,186.2 499.5,184.7 500.3,185.8 501.0,186.6 503.4,183.8 504.2,183.9 504.9,185.3 505.7,184.3 506.5,178.5 508.8,178.4 509.6,176.0 510.4,171.9 511.2,165.8 511.9,168.8 514.3,165.8 515.1,171.1 515.8,170.2 516.6,172.4 517.4,166.6 519.7,167.0 520.5,166.3 521.3,166.6 522.1,164.2 522.9,164.5 525.2,163.3 526.0,165.7 526.8,168.3 527.5,168.2 528.3,168.8 530.6,171.0 531.4,172.7 532.2,174.4 533.0,172.3 533.8,167.9 536.1,167.4 536.9,165.9 537.7,167.7 538.4,167.8 539.2,168.6 541.6,167.7 542.3,168.6 543.1,171.1 543.9,172.8 544.7,170.6 547.0,170.2 547.8,170.4 548.6,170.5 549.4,168.1 550.1,166.3 552.5,162.2 553.2,161.2 554.0,160.7 554.8,154.0 555.6,157.3 557.9,152.9 558.7,148.1 559.5,147.9 560.3,146.9 561.0,145.2 563.4,146.6 564.2,149.4 564.9,159.2 565.7,160.3 566.5,157.8 568.8,155.0 569.6,153.3 570.4,153.0 571.2,152.1 571.9,147.7 574.3,146.7 575.1,149.9 575.8,147.9 576.6,147.1 577.4,146.3 579.7,145.0 580.5,147.3 581.3,147.1 582.1,151.4 582.9,155.2 585.2,152.1 586.0,156.6 586.8,159.6 587.5,159.8 588.3,157.6 590.6,157.6 591.4,160.8 592.2,161.4 593.0,162.6 593.8,160.9 596.1,164.1 596.9,165.7 597.7,167.7 598.4,165.4 599.2,165.7 601.6,165.8 602.3,164.3 603.1,164.0 603.9,159.9 604.7,157.4 607.0,160.1 607.8,163.8 608.6,165.6 609.4,166.1 610.1,165.7 612.5,166.9 613.2,171.7 614.0,172.5 614.8,167.5 615.6,174.8 617.9,171.1 618.7,173.2 619.5,174.2 620.3,178.2 621.0,168.1 624.9,169.0 625.7,166.1 626.5,159.9 629.6,159.6 630.4,160.3 631.2,159.2 631.9,163.2 634.3,163.5 635.1,164.2 635.8,164.7 636.6,164.2 637.4,160.8 639.7,159.2 640.5,157.7 641.3,160.5 642.1,160.0 642.9,159.4 645.2,163.4 646.0,161.2 646.8,160.1 647.5,156.2 648.3,154.8 650.6,155.6 651.4,156.2 652.2,156.5 653.0,157.9" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>
  <polyline points="61.6,130.0 62.3,128.7 63.1,129.4 63.9,129.0 64.7,128.2 67.0,126.9 67.8,127.2 68.6,128.1 69.4,130.2 70.1,128.6 72.5,127.4 73.2,126.6 74.0,124.7 74.8,126.3 75.6,127.4 77.9,127.1 78.7,125.5 79.5,124.5 80.3,125.5 81.0,124.9 83.4,124.0 84.2,123.2 84.9,123.4 85.7,124.1 86.5,127.8 88.8,124.2 89.6,119.2 90.4,118.4 91.2,116.9 91.9,117.8 94.3,114.5 95.1,110.6 95.8,111.5 96.6,111.4 97.4,110.2 99.7,111.1 100.5,111.9 101.3,114.6 102.1,116.8 102.9,114.3 105.2,110.4 106.0,112.4 106.8,117.6 107.5,117.0 108.3,115.4 110.6,114.5 111.4,109.0 112.2,107.7 113.0,111.0 113.8,112.4 116.1,108.9 116.9,105.0 117.7,103.4 118.4,105.2 119.2,105.4 121.6,102.4 122.3,103.1 123.1,103.7 123.9,105.2 124.7,105.5 127.0,110.2 127.8,113.0 128.6,112.9 129.4,114.7 130.1,114.0 132.5,116.4 133.2,113.1 134.0,109.2 134.8,109.1 135.6,111.2 137.9,109.8 138.7,107.2 139.5,107.1 140.3,99.2 144.2,92.7 144.9,99.6 145.7,105.1 146.5,110.5 148.8,108.7 149.6,110.0 150.4,106.8 151.2,106.1 151.9,112.7 154.3,103.5 155.1,108.5 155.8,107.7 156.6,105.1 157.4,103.8 159.7,94.2 160.5,96.1 161.3,92.4 162.1,95.9 162.9,97.0 165.2,96.4 166.0,100.9 166.8,107.2 167.5,109.7 168.3,103.2 170.6,103.8 171.4,103.8 172.2,100.7 173.0,93.7 173.8,98.7 176.1,98.5 176.9,100.4 177.7,96.5 178.4,100.9 179.2,100.8 181.6,101.5 182.3,101.5 183.1,103.6 183.9,111.8 184.7,119.1 187.0,123.5 187.8,120.3 188.6,120.3 189.4,113.8 190.1,114.4 192.5,115.1 193.2,110.6 194.0,114.0 194.8,114.5 195.6,110.9 197.9,110.4 198.7,105.5 199.5,109.8 200.3,101.0 201.0,96.9 203.4,102.4 204.2,97.1 204.9,97.4 205.7,99.6 206.5,96.9 208.8,95.0 209.6,97.5 210.4,99.0 211.2,109.5 211.9,108.3 214.3,105.8 215.1,110.8 215.8,109.5 216.6,108.5 217.4,113.9 219.7,111.8 220.5,114.9 221.3,117.6 222.1,117.9 222.9,117.3 225.2,120.1 226.0,124.2 226.8,125.8 227.5,127.1 228.3,129.9 230.6,128.6 231.4,128.4 232.2,129.5 233.0,126.2 233.8,125.0 236.1,129.4 236.9,125.6 237.7,132.9 238.4,133.8 239.2,127.4 241.6,129.5 242.3,125.0 243.1,124.2 243.9,119.5 244.7,120.9 247.0,120.7 247.8,129.2 248.6,133.4 249.4,127.1 250.1,127.1 252.5,121.9 253.2,116.8 254.0,112.0 254.8,118.5 255.6,128.2 257.9,132.3 258.7,133.9 259.5,134.3 260.3,142.8 261.0,144.9 263.4,143.5 264.2,144.7 264.9,151.6 265.7,156.0 266.5,160.0 268.8,157.9 269.6,151.3 270.4,140.5 271.2,137.0 271.9,135.8 274.3,138.2 275.1,137.7 275.8,134.8 276.6,137.9 277.4,134.6 279.7,129.1 280.5,123.2 281.3,116.2 282.1,125.3 282.9,127.7 285.2,130.8 286.0,136.5 286.8,141.5 287.5,140.9 288.3,134.2 290.6,139.5 291.4,146.9 292.2,148.6 293.0,151.0 293.8,149.7 296.1,149.3 296.9,145.0 297.7,147.7 298.4,144.2 299.2,147.6 301.6,148.9 302.3,154.7 303.1,154.7 303.9,162.4 304.7,166.3 307.0,167.1 307.8,170.2 308.6,176.5 309.4,171.3 310.1,169.7 312.5,172.9 313.2,175.2 314.0,182.8 314.8,186.1 315.6,183.6 317.9,179.6 318.7,178.6 319.5,181.9 320.3,181.6 321.0,182.8 323.4,184.6 324.2,185.2 324.9,183.0 325.7,182.5 326.5,182.9 328.8,185.8 329.6,181.8 330.4,176.0 331.2,184.5 331.9,188.0 334.3,181.8 335.1,180.1 335.8,180.0 336.6,178.7 337.4,180.1 340.5,177.2 341.3,175.7 342.1,176.6 342.9,178.9 345.2,183.8 346.0,187.7 346.8,189.6 347.5,189.0 348.3,192.0 350.6,188.7 351.4,192.2 352.2,198.4 353.0,198.8 353.8,200.3 356.1,199.2 356.9,198.8 357.7,200.7 358.4,203.7 359.2,200.1 361.6,196.8 362.3,198.7 363.1,197.8 363.9,196.3 364.7,194.0 367.0,198.0 367.8,194.7 368.6,196.2 369.4,196.6 370.1,195.2 372.5,191.2 373.2,192.2 374.0,196.3 374.8,198.4 375.6,198.6 377.9,202.2 378.7,203.9 379.5,200.1 380.3,196.5 381.0,199.8 383.4,202.2 384.2,201.0 384.9,200.0 385.7,201.9 386.5,209.1 388.8,208.2 389.6,207.0 390.4,210.8 391.2,205.4 391.9,210.6 394.3,214.6 395.1,216.3 395.8,222.3 396.6,218.4 397.4,215.2 399.7,203.7 400.5,208.1 401.3,192.8 402.1,196.2 402.9,193.8 405.2,184.0 406.0,189.0 406.8,196.0 407.5,192.8 408.3,187.0 410.6,189.6 411.4,190.1 412.2,191.1 413.0,197.5 413.8,197.1 416.1,199.6 416.9,197.8 417.7,195.9 418.4,197.7 422.3,199.4 423.1,200.8 423.9,198.9 424.7,205.0 427.0,200.2 427.8,200.6 428.6,203.8 429.4,201.7 430.1,201.5 432.5,203.8 433.2,201.4 434.0,198.8 434.8,198.2 435.6,199.6 438.7,200.0 439.5,197.6 440.3,195.7 441.0,188.6 443.4,190.9 444.2,191.3 444.9,189.7 445.7,192.1 446.5,193.4 448.8,190.6 449.6,190.6 450.4,193.5 451.2,192.6 451.9,193.5 454.3,193.6 455.1,198.7 455.8,197.0 456.6,198.2 457.4,198.4 459.7,204.4 460.5,206.5 461.3,201.4 462.1,202.2 462.9,206.0 465.2,207.8 466.0,205.9 466.8,208.4 467.5,206.3 468.3,209.9 470.6,210.0 471.4,212.2 472.2,212.2 473.0,218.0 473.8,222.5 476.1,219.4 476.9,227.7 477.7,229.4 478.4,230.3 479.2,233.1 481.6,233.0 482.3,235.9 483.1,235.7 483.9,235.3 484.7,233.1 487.0,236.0 487.8,234.5 488.6,230.6 489.4,230.3 490.1,222.0 492.5,218.9 493.2,220.7 494.0,224.0 494.8,225.2 495.6,228.2 497.9,229.9 498.7,228.4 499.5,227.8 500.3,230.0 501.0,228.8 503.4,223.7 504.2,225.8 504.9,229.4 505.7,224.8 506.5,222.1 508.8,220.5 509.6,222.3 510.4,213.1 511.2,202.6 511.9,208.2 514.3,204.2 515.1,209.8 515.8,210.3 516.6,210.4 517.4,203.2 519.7,205.7 520.5,205.9 521.3,205.4 522.1,204.1 522.9,200.3 525.2,204.1 526.0,205.9 526.8,208.5 527.5,209.5 528.3,211.3 530.6,211.7 531.4,214.6 532.2,214.0 533.0,212.6 533.8,203.9 536.1,207.1 536.9,205.7 537.7,208.5 538.4,208.7 539.2,209.0 541.6,208.2 542.3,209.0 543.1,211.5 543.9,214.1 544.7,214.5 547.0,214.5 547.8,214.7 548.6,216.9 549.4,212.8 550.1,211.0 552.5,208.0 553.2,206.6 554.0,206.2 554.8,198.1 555.6,203.3 557.9,199.4 558.7,196.1 559.5,196.3 560.3,193.4 561.0,190.8 563.4,194.0 564.2,194.8 564.9,205.5 565.7,205.0 566.5,193.2 568.8,198.4 569.6,198.3 570.4,197.6 571.2,196.0 571.9,193.0 574.3,193.5 575.1,196.2 575.8,194.4 576.6,191.9 577.4,190.7 579.7,189.5 580.5,192.9 581.3,192.1 582.1,196.4 582.9,200.7 585.2,199.2 586.0,204.6 586.8,205.2 587.5,205.0 588.3,204.3 590.6,203.5 591.4,207.8 592.2,204.1 593.0,205.3 593.8,203.6 596.1,206.0 596.9,208.4 597.7,210.6 598.4,207.6 599.2,208.0 601.6,209.1 602.3,207.0 603.1,205.8 603.9,203.0 604.7,198.0 607.0,200.4 607.8,205.3 608.6,210.6 609.4,211.8 610.1,208.0 612.5,208.9 613.2,212.0 614.0,215.4 614.8,211.1 615.6,218.7 617.9,215.5 618.7,217.9 619.5,220.1 620.3,216.9 621.0,214.5 624.9,217.3 625.7,215.0 626.5,210.0 629.6,206.6 630.4,207.3 631.2,203.9 631.9,207.8 634.3,207.9 635.1,205.3 635.8,205.4 636.6,205.6 637.4,204.9 639.7,202.6 640.5,204.8 641.3,207.4 642.1,206.2 642.9,202.8 645.2,205.8 646.0,203.5 646.8,203.1 647.5,198.4 648.3,195.9 650.6,196.5 651.4,195.1 652.2,196.7 653.0,197.6" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <text x="272.7" y="71.8" text-anchor="start" class="f-mono f-ink" style="font-size:11px">all governments</text>
  <text x="359.2" y="221.2" text-anchor="end" class="f-mono f-accent" style="font-size:11px">AAA</text>
</svg>
<figcaption>10Y minus 2Y, spot rates, basis points. Accent line is AAA, dark line is all governments.</figcaption>
</figure>

## What I did not check

The bonds, as I said. The search on any other day. Whether the API shows exactly what was published in 2012: I asked it for the history of those days and got one version of each row. The 5 AAA jumps without close constants. The rates are continuously compounded, so a table of a bank will show slightly different ones.
