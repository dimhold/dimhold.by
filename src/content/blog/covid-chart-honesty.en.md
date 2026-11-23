---
title: "One COVID file, drawn 3 ways"
description: "The Johns Hopkins CSSE file as it was on 20 March 2020, drawn with a linear and a log axis, by calendar and by days since the 100th case, in absolute cases and per million. Each choice tells a different story. Between Wednesday and Friday the file itself moved Aruba into the Netherlands."
date: 2020-03-20
lang: en
translationKey: covid-chart-honesty
tags: ["statistics", "open-data"]
---
Most COVID charts I see this week I read very fast. I look only at the top line and move on. I rarely check which axis the chart used or on which day the numbers were taken. So before looking at one more chart I wanted to draw them myself, from the file most of them are drawn from.

The file is the time series of confirmed cases from Johns Hopkins CSSE on GitHub, as it was this morning. It is commit `1eb3728`, pushed at 00:36 UTC on 20 March with 19 March as the last column. It has 468 rows, which become 155 country names after summing provinces. Population is the World Bank number for 2018 from their February release. The arithmetic is sums and divisions in pandas, nothing in it depends on a library version.

<figure class="fig">
<svg viewBox="0 0 680 300" role="img" aria-label="Confirmed cases from 15 February to 19 March 2020 for 6 countries, drawn twice. On the linear axis China reaches the top and Italy half of it, the others stay in the bottom fifth. On the log axis China and South Korea are flat and the US, Spain and Germany are the steepest lines. Values on 19 March: China 81,156, Italy 41,035, Spain 17,963, Germany 15,320, US 13,677, South Korea 8,565.">
  <text x="56.0" y="14.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">linear axis</text>
  <line x1="56.0" y1="276.0" x2="250.0" y2="276.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="52.0" y="280.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">0</text>
  <line x1="56.0" y1="215.0" x2="250.0" y2="215.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="52.0" y="219.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">20,000</text>
  <line x1="56.0" y1="154.0" x2="250.0" y2="154.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="52.0" y="158.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">40,000</text>
  <line x1="56.0" y1="93.1" x2="250.0" y2="93.1" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="52.0" y="97.1" text-anchor="end" class="f-mono f-muted" style="font-size:9px">60,000</text>
  <line x1="56.0" y1="32.1" x2="250.0" y2="32.1" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="52.0" y="36.1" text-anchor="end" class="f-mono f-muted" style="font-size:9px">80,000</text>
  <text x="56.0" y="290.0" text-anchor="start" class="f-mono f-muted" style="font-size:9px">15 Feb</text>
  <text x="144.2" y="290.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">1 Mar</text>
  <text x="250.0" y="290.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">19 Mar</text>
  <polyline points="56.0,67.4 61.9,61.0 67.8,55.2 73.6,49.7 79.5,48.5 85.4,47.1 91.3,45.7 97.2,41.2 103.0,41.2 108.9,40.5 114.8,38.9 120.7,37.7 126.5,36.4 132.4,35.4 138.3,34.1 144.2,32.3 150.1,31.7 155.9,31.3 161.8,30.9 167.7,30.5 173.6,30.0 179.5,29.8 185.3,29.6 191.2,29.5 197.1,29.4 203.0,29.3 208.8,29.3 214.7,29.2 220.6,29.1 226.5,29.0 232.4,28.9 238.2,28.9 244.1,28.7 250.0,28.6" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="56.0,276.0 61.9,276.0 67.8,276.0 73.6,276.0 79.5,276.0 85.4,276.0 91.3,275.9 97.2,275.8 103.0,275.5 108.9,275.3 114.8,275.0 120.7,274.6 126.5,274.0 132.4,273.3 138.3,272.6 144.2,270.8 150.1,269.8 155.9,268.4 161.8,266.6 167.7,264.2 173.6,261.9 179.5,258.1 185.3,253.5 191.2,248.0 197.1,245.1 203.0,238.0 208.8,238.0 214.7,222.2 220.6,211.5 226.5,200.6 232.4,190.7 238.2,179.9 244.1,167.1 250.0,150.9" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="56.0,276.0 61.9,276.0 67.8,276.0 73.6,276.0 79.5,276.0 85.4,276.0 91.3,276.0 97.2,276.0 103.0,276.0 108.9,276.0 114.8,276.0 120.7,276.0 126.5,276.0 132.4,275.9 138.3,275.9 144.2,275.7 150.1,275.6 155.9,275.5 161.8,275.3 167.7,275.2 173.6,274.8 179.5,274.5 185.3,273.9 191.2,272.7 197.1,270.8 203.0,269.1 208.8,269.1 214.7,260.0 220.6,256.5 226.5,252.2 232.4,245.7 238.2,240.2 244.1,233.6 250.0,221.2" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="56.0,276.0 61.9,276.0 67.8,276.0 73.6,276.0 79.5,276.0 85.4,276.0 91.3,276.0 97.2,276.0 103.0,276.0 108.9,276.0 114.8,275.9 120.7,275.9 126.5,275.9 132.4,275.9 138.3,275.8 144.2,275.6 150.1,275.5 155.9,275.4 161.8,275.2 167.7,274.5 173.6,274.0 179.5,273.6 185.3,272.8 191.2,272.4 197.1,271.6 203.0,270.2 208.8,269.7 214.7,264.8 220.6,262.0 226.5,258.3 232.4,253.8 238.2,247.8 244.1,238.4 250.0,229.3" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="56.0,276.0 61.9,276.0 67.8,276.0 73.6,276.0 79.5,276.0 85.4,276.0 91.3,276.0 97.2,276.0 103.0,276.0 108.9,275.8 114.8,275.8 120.7,275.8 126.5,275.8 132.4,275.8 138.3,275.8 144.2,275.8 150.1,275.7 155.9,275.6 161.8,275.5 167.7,275.3 173.6,275.2 179.5,274.8 185.3,274.4 191.2,274.2 197.1,273.1 203.0,272.1 208.8,270.9 214.7,269.4 220.6,267.7 226.5,265.3 232.4,261.9 238.2,256.4 244.1,252.3 250.0,234.3" style="fill:none;stroke:var(--accent);stroke-width:2.5;opacity:1"/>
  <polyline points="56.0,275.9 61.9,275.9 67.8,275.9 73.6,275.9 79.5,275.9 85.4,275.7 91.3,275.4 97.2,274.7 103.0,274.2 108.9,273.5 114.8,273.0 120.7,272.2 126.5,270.6 132.4,268.9 138.3,266.4 144.2,264.6 150.1,262.8 155.9,260.2 161.8,258.9 167.7,257.4 173.6,255.9 179.5,254.5 185.3,253.7 191.2,253.2 197.1,253.1 203.0,252.4 208.8,252.0 214.7,251.7 220.6,251.3 226.5,251.1 232.4,250.9 238.2,250.6 244.1,250.4 250.0,249.9" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <text x="256.0" y="32.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">China</text>
  <text x="256.0" y="154.9" text-anchor="start" class="f-label f-muted" style="font-size:10px">Italy</text>
  <text x="256.0" y="225.2" text-anchor="start" class="f-label f-muted" style="font-size:10px">Spain</text>
  <text x="256.0" y="236.2" text-anchor="start" class="f-label f-muted" style="font-size:10px">Germany</text>
  <text x="256.0" y="247.2" text-anchor="start" class="f-label f-accent" style="font-size:10px">US</text>
  <text x="256.0" y="258.2" text-anchor="start" class="f-label f-muted" style="font-size:10px">South Korea</text>
  <text x="384.0" y="14.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">log axis</text>
  <line x1="384.0" y1="276.0" x2="560.0" y2="276.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="380.0" y="280.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">10</text>
  <line x1="384.0" y1="213.5" x2="560.0" y2="213.5" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="380.0" y="217.5" text-anchor="end" class="f-mono f-muted" style="font-size:9px">100</text>
  <line x1="384.0" y1="151.0" x2="560.0" y2="151.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="380.0" y="155.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">1,000</text>
  <line x1="384.0" y1="88.5" x2="560.0" y2="88.5" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="380.0" y="92.5" text-anchor="end" class="f-mono f-muted" style="font-size:9px">10,000</text>
  <line x1="384.0" y1="26.0" x2="560.0" y2="26.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="380.0" y="30.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">100,000</text>
  <text x="384.0" y="290.0" text-anchor="start" class="f-mono f-muted" style="font-size:9px">15 Feb</text>
  <text x="464.0" y="290.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">1 Mar</text>
  <text x="560.0" y="290.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">19 Mar</text>
  <polyline points="384.0,36.3 389.3,35.5 394.7,34.8 400.0,34.1 405.3,33.9 410.7,33.8 416.0,33.6 421.3,33.1 426.7,33.1 432.0,33.0 437.3,32.8 442.7,32.7 448.0,32.5 453.3,32.4 458.7,32.3 464.0,32.1 469.3,32.0 474.7,32.0 480.0,31.9 485.3,31.9 490.7,31.8 496.0,31.8 501.3,31.8 506.7,31.8 512.0,31.8 517.3,31.7 522.7,31.7 528.0,31.7 533.3,31.7 538.7,31.7 544.0,31.7 549.3,31.7 554.7,31.7 560.0,31.7" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="416.0,257.2 421.3,226.5 426.7,201.6 432.0,191.0 437.3,181.8 442.7,172.5 448.0,162.5 453.3,154.2 458.7,147.7 464.0,136.7 469.3,131.7 474.7,126.1 480.0,120.4 485.3,114.4 490.7,109.4 496.0,102.9 501.3,96.8 506.7,90.8 512.0,88.1 517.3,82.5 522.7,82.5 528.0,73.1 533.3,68.2 538.7,63.9 544.0,60.6 549.3,57.4 554.7,53.9 560.0,50.2" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="442.7,268.9 448.0,265.0 453.3,244.4 458.7,235.2 464.0,218.2 469.3,208.6 474.7,199.9 480.0,191.9 485.3,187.7 490.7,175.9 496.0,169.8 501.3,161.7 506.7,149.1 512.0,136.7 517.3,128.7 522.7,128.7 528.0,106.1 533.3,100.7 538.7,95.3 544.0,88.7 549.3,84.1 554.7,79.5 560.0,72.6" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="384.0,263.2 389.3,263.2 394.7,263.2 400.0,263.2 405.3,263.2 410.7,263.2 416.0,263.2 421.3,263.2 426.7,263.2 432.0,263.2 437.3,261.6 442.7,249.0 448.0,234.6 453.3,233.4 458.7,219.9 464.0,206.4 469.3,200.9 474.7,195.2 480.0,187.4 485.3,170.8 490.7,161.9 496.0,157.1 501.3,149.9 506.7,146.6 512.0,140.8 517.3,133.5 522.7,131.1 528.0,115.7 533.3,109.7 538.7,103.3 544.0,97.1 549.3,90.6 554.7,82.8 560.0,76.9" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="384.0,268.9 389.3,268.9 394.7,268.9 400.0,268.9 405.3,268.9 410.7,268.9 416.0,265.0 421.3,265.0 426.7,265.0 432.0,231.8 437.3,231.8 442.7,228.8 448.0,228.3 453.3,227.4 458.7,224.0 464.0,221.7 469.3,214.0 474.7,209.0 480.0,202.7 485.3,192.5 490.7,187.4 496.0,175.7 501.3,168.9 506.7,165.6 512.0,152.1 517.3,144.3 522.7,137.2 528.0,129.9 533.3,123.8 538.7,117.0 544.0,109.4 549.3,100.5 554.7,95.3 560.0,80.0" style="fill:none;stroke:var(--accent);stroke-width:2.5;opacity:1"/>
  <polyline points="384.0,248.1 389.3,247.1 394.7,246.2 400.0,245.3 405.3,245.3 410.7,212.4 416.0,194.1 421.3,173.7 426.7,164.8 432.0,156.0 437.3,151.6 442.7,144.7 448.0,135.6 453.3,128.0 458.7,119.9 464.0,115.2 469.3,111.2 474.7,106.3 480.0,104.1 485.3,102.0 490.7,99.8 496.0,98.0 501.3,97.0 506.7,96.4 512.0,96.3 517.3,95.4 522.7,95.0 528.0,94.6 533.3,94.3 538.7,94.0 544.0,93.8 549.3,93.5 554.7,93.2 560.0,92.7" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <text x="566.0" y="35.7" text-anchor="start" class="f-label f-muted" style="font-size:10px">China</text>
  <text x="566.0" y="54.2" text-anchor="start" class="f-label f-muted" style="font-size:10px">Italy</text>
  <text x="566.0" y="76.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">Spain</text>
  <text x="566.0" y="87.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">Germany</text>
  <text x="566.0" y="98.6" text-anchor="start" class="f-label f-accent" style="font-size:10px">US</text>
  <text x="566.0" y="109.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">South Korea</text>
</svg>
<figcaption>JHU CSSE time series, commit 1eb3728 (20 March 2020). Same data in both panels, only the axis changes.</figcaption>
</figure>

## The linear axis

My first chart was linear, because that is the default everywhere and I did not think about it. China is at the top with 81,156 cases, Italy is at half the height with 41,035. Everything else sits in the bottom fifth. The US with 13,677 cases takes 17% of the height, South Korea with 8,565 takes 11%.

From this chart I would say China and Italy are the story and the rest are smaller versions of it. But I took the growth over the last 7 days and turned it into doubling time:

| country | 12 March | 19 March | doubles every |
|---|---|---|---|
| US | 1,663 | 13,677 | 2.3 days |
| Spain | 2,277 | 17,963 | 2.3 days |
| Germany | 2,078 | 15,320 | 2.4 days |
| Italy | 12,462 | 41,035 | 4.1 days |
| South Korea | 7,869 | 8,565 | 57 days |
| China | 80,932 | 81,156 | flat, 224 new cases in a week |

The 3 countries in the bottom fifth grow almost twice as fast as Italy per day. Those 2 that almost stopped are China at the very top and Korea right next to the US. On a linear axis growth is the slope, but a line at 13,000 has almost no visible slope on a scale that goes to 80,000. I saw the US as small, while it grows faster than any country that had 100 cases a week ago.

On the log axis the picture turns over. Each step up is 10 times more, so a constant growth rate is a straight line and the steepness is the rate. China and Korea become almost horizontal and the steepest lines on the chart are the US and Spain. For this question the log chart is better. But the distance between 13,677 and 41,035 is a factor of 3 and on the log axis it looks like a small step. I noticed it only when I read the tick labels.

## Days since the 100th case

Most charts I have seen also put the calendar on the horizontal axis. Italy passed 100 cases on 23 February, the US on 3 March. On a calendar the US is 9 days "behind" and looks like a smaller problem. The Financial Times chart that is going around now aligns countries by the day they passed 100 cases instead. I did the same.

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Confirmed cases by days since each country passed 100 cases, log axis, days 0 to 16 or as far as the data goes. Values on day 16: Italy 10,149, Spain 13,910, Germany 9,257, US 13,677, South Korea 7,041.">
  <line x1="60.0" y1="266.0" x2="520.0" y2="266.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="56.0" y="270.0" text-anchor="end" class="f-mono f-muted" style="font-size:9px">100</text>
  <line x1="60.0" y1="157.3" x2="520.0" y2="157.3" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="56.0" y="161.3" text-anchor="end" class="f-mono f-muted" style="font-size:9px">1,000</text>
  <line x1="60.0" y1="48.6" x2="520.0" y2="48.6" style="stroke:var(--muted);stroke-width:0.5;opacity:0.3"/>
  <text x="56.0" y="52.6" text-anchor="end" class="f-mono f-muted" style="font-size:9px">10,000</text>
  <text x="60.0" y="280.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">0</text>
  <text x="175.0" y="280.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">4</text>
  <text x="290.0" y="280.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">8</text>
  <text x="405.0" y="280.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">12</text>
  <text x="520.0" y="280.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">16</text>
  <text x="290.0" y="296.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">days since the 100th case</text>
  <line x1="520.0" y1="16.0" x2="520.0" y2="266.0" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3;opacity:0.6"/>
  <text x="520.0" y="12.0" text-anchor="middle" class="f-mono f-muted" style="font-size:9px">day 16</text>
  <polyline points="60.0,245.3 88.8,226.9 117.5,210.8 146.3,194.7 175.0,177.3 203.8,162.9 232.5,151.6 261.3,132.4 290.0,123.7 318.8,114.0 347.5,104.1 376.3,93.6 405.0,84.9 433.8,73.7 462.5,63.0 491.3,52.7 520.0,47.9" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="60.0,257.4 88.8,242.4 117.5,228.4 146.3,221.1 175.0,200.6 203.8,190.0 232.5,176.0 261.3,154.0 290.0,132.4 318.8,118.5 347.5,118.5 376.3,79.2 405.0,69.7 433.8,60.3 462.5,48.9 491.3,41.0 520.0,33.0" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="60.0,253.6 88.8,244.1 117.5,234.2 146.3,220.5 175.0,191.8 203.8,176.2 232.5,167.9 261.3,155.5 290.0,149.7 318.8,139.5 347.5,126.8 376.3,122.8 405.0,95.9 433.8,85.4 462.5,74.4 491.3,63.6 520.0,52.3" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <polyline points="60.0,258.2 88.8,247.2 117.5,229.4 146.3,220.5 175.0,200.3 203.8,188.4 232.5,182.8 261.3,159.3 290.0,145.6 318.8,133.3 347.5,120.5 376.3,109.9 405.0,98.2 433.8,84.9 462.5,69.5 491.3,60.4 520.0,33.8" style="fill:none;stroke:var(--accent);stroke-width:2.5;opacity:1"/>
  <polyline points="60.0,264.1 88.8,232.3 117.5,196.8 146.3,181.3 175.0,165.9 203.8,158.4 232.5,146.4 261.3,130.5 290.0,117.2 318.8,103.1 347.5,95.1 376.3,88.1 405.0,79.6 433.8,75.8 462.5,72.0 491.3,68.3 520.0,65.2" style="fill:none;stroke:var(--muted);stroke-width:1.5;opacity:0.8"/>
  <text x="528.0" y="37.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">Spain 13,910</text>
  <text x="528.0" y="49.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">US 13,677</text>
  <text x="528.0" y="61.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">Italy 10,149</text>
  <text x="528.0" y="73.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">Germany 9,257</text>
  <text x="528.0" y="85.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">South Korea 7,041</text>
</svg>
<figcaption>Same file. China is left out, it was already over 100 in the first column on 22 January.</figcaption>
</figure>

On day 16 after its 100th case Italy had 10,149 cases. The US reached its day 16 in yesterday's column and has 13,677. Spain had 13,910 on its day 16, Germany 9,257. At the same stage the US has 35% more cases than Italy had, which at its current growth is about 1 day ahead. This is in absolute cases only, per million Italy on its day 16 was much higher. I am also not sure 100 is a fair start for everyone. In a country that tests little the 100th confirmed case comes later than the 100th infection.

## Per million people

The third decision is the denominator. Dividing by population sounds like the honest thing, but it changes the ranking a lot:

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Two top 10 lists for 19 March 2020. By confirmed cases: China 81,156, Italy 41,035, Iran 18,407, Spain 17,963, Germany 15,320, US 13,677, France 10,947, South Korea 8,565, Switzerland 4,075, UK 2,716. By cases per million, countries over 1 million people: Italy 679, Switzerland 479, Spain 385, Norway 329, Austria 228, Iran 225, Denmark 211, Estonia 202, Germany 185, Bahrain 177. 5 countries are in both lists.">
  <text x="170.0" y="18.0" text-anchor="end" class="f-label f-ink" style="font-size:12px">by cases</text>
  <text x="470.0" y="18.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">per million people (1 million+)</text>
  <text x="110.0" y="40.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">China</text>
  <text x="170.0" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">81,156</text>
  <text x="110.0" y="64.0" text-anchor="end" class="f-label f-accent" style="font-size:12px">Italy</text>
  <text x="170.0" y="64.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">41,035</text>
  <text x="110.0" y="88.0" text-anchor="end" class="f-label f-accent" style="font-size:12px">Iran</text>
  <text x="170.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">18,407</text>
  <text x="110.0" y="112.0" text-anchor="end" class="f-label f-accent" style="font-size:12px">Spain</text>
  <text x="170.0" y="112.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">17,963</text>
  <text x="110.0" y="136.0" text-anchor="end" class="f-label f-accent" style="font-size:12px">Germany</text>
  <text x="170.0" y="136.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">15,320</text>
  <text x="110.0" y="160.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">US</text>
  <text x="170.0" y="160.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">13,677</text>
  <text x="110.0" y="184.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">France</text>
  <text x="170.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10,947</text>
  <text x="110.0" y="208.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">South Korea</text>
  <text x="170.0" y="208.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8,565</text>
  <text x="110.0" y="232.0" text-anchor="end" class="f-label f-accent" style="font-size:12px">Switzerland</text>
  <text x="170.0" y="232.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4,075</text>
  <text x="110.0" y="256.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">UK</text>
  <text x="170.0" y="256.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2,716</text>
  <text x="470.0" y="40.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">679</text>
  <text x="514.0" y="40.0" text-anchor="start" class="f-label f-accent" style="font-size:12px">Italy</text>
  <line x1="180.0" y1="60.0" x2="460.0" y2="36.0" style="stroke:var(--accent);stroke-width:1.5;opacity:0.8"/>
  <text x="470.0" y="64.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">479</text>
  <text x="514.0" y="64.0" text-anchor="start" class="f-label f-accent" style="font-size:12px">Switzerland</text>
  <line x1="180.0" y1="228.0" x2="460.0" y2="60.0" style="stroke:var(--accent);stroke-width:1.5;opacity:0.8"/>
  <text x="470.0" y="88.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">385</text>
  <text x="514.0" y="88.0" text-anchor="start" class="f-label f-accent" style="font-size:12px">Spain</text>
  <line x1="180.0" y1="108.0" x2="460.0" y2="84.0" style="stroke:var(--accent);stroke-width:1.5;opacity:0.8"/>
  <text x="470.0" y="112.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">329</text>
  <text x="514.0" y="112.0" text-anchor="start" class="f-label f-muted" style="font-size:12px">Norway</text>
  <text x="470.0" y="136.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">228</text>
  <text x="514.0" y="136.0" text-anchor="start" class="f-label f-muted" style="font-size:12px">Austria</text>
  <text x="470.0" y="160.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">225</text>
  <text x="514.0" y="160.0" text-anchor="start" class="f-label f-accent" style="font-size:12px">Iran</text>
  <line x1="180.0" y1="84.0" x2="460.0" y2="156.0" style="stroke:var(--accent);stroke-width:1.5;opacity:0.8"/>
  <text x="470.0" y="184.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">211</text>
  <text x="514.0" y="184.0" text-anchor="start" class="f-label f-muted" style="font-size:12px">Denmark</text>
  <text x="470.0" y="208.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">202</text>
  <text x="514.0" y="208.0" text-anchor="start" class="f-label f-muted" style="font-size:12px">Estonia</text>
  <text x="470.0" y="232.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">185</text>
  <text x="514.0" y="232.0" text-anchor="start" class="f-label f-accent" style="font-size:12px">Germany</text>
  <line x1="180.0" y1="132.0" x2="460.0" y2="228.0" style="stroke:var(--accent);stroke-width:1.5;opacity:0.8"/>
  <text x="470.0" y="256.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">177</text>
  <text x="514.0" y="256.0" text-anchor="start" class="f-label f-muted" style="font-size:12px">Bahrain</text>
</svg>
<figcaption>Lines join the 5 countries that are in both lists. Population: World Bank, 2018, February 2020 release.</figcaption>
</figure>

Without any filter the top of the per million list is San Marino with 3,522, then 3 more small states. Italy comes only fifth. San Marino has 119 cases and 33,785 people. A single new case there adds about 30 per million, in Italy the same case adds 0.02. So I added a filter of 1 million people, because without it the top of the list changes with every single case.

With the filter the top 10 runs from Italy with 679 per million down to Bahrain with 177. Only 5 of these 10 are also in the top 10 by absolute cases. The US is at 42 per million, the UK at 41, China at 58. I cannot say which list is the right one. The absolute number is closer to the load on hospitals. Per million would show how widespread the outbreak is, but only if every country counted the same way.

They do not count the same way and here I have no fix. A confirmed case is a positive test, while the file has no column for the number of tests. I expect a country that tests more to look worse per million, but nothing in this CSV lets me separate testing from spread.

## The file moves under you

One more thing I found is in the file itself. I also took the same file as it was on Wednesday evening (commit `4297d6d`, data to 17 March) and compared every cell that exists in both. 7 of 8,120 country cells for past dates changed. The Netherlands gained 2 or 3 cases on each day from 13 to 17 March, Denmark gained 1 on 16 and 17 March.

I first thought these were corrections of the counts. They were not. Between the 2 commits Aruba stopped being its own country and became a province of the Netherlands. Greenland became a province of Denmark. Jersey and Guernsey disappeared, they were duplicates of a "Channel Islands" row that the United Kingdom already had. "The Bahamas" became "Bahamas, The" and "The Gambia" became "Gambia, The". The counts for the Netherlands itself did not change, only the row now includes Aruba.

A script that joins this file with population by country name matched the Bahamas on Friday and missed them on Wednesday, without any error. The Denmark row also has the Faroe Islands inside: 72 of its 1,225 cases are there, with about 48,000 people. On its own the Faroe Islands would be at 1,485 per million, second after San Marino. Inside Denmark, with Denmark's population as the denominator, they only move it from 199 to 211.

## What I did not check

- Deaths. A death rate from this file has the same problems as cases with an extra lag, so I did not put a number on it.
- Testing. Without a test count per country I cannot say how much of the per million ranking is testing policy.
- Other territories. The Faroe Islands are the only ones I looked at by hand, France and the United Kingdom also have overseas rows inside.

For myself I will look at 2 charts for anything about this. One is log by days since 100 cases, for speed. The other is linear, for size, with the date of the data under both. We'll see if I keep to it.
