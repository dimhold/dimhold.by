---
title: "How quiet Brussels got in the lockdown, measured by its seismometer"
description: "Public seismometer data for Brussels, January 2019 to September 2020. On working days the 4 to 14 Hz ground noise at Uccle fell 19 percent in the lockdown, a lockdown weekday stayed louder than a normal Sunday and Saturday nights lost 53 percent. The wind did not explain it, the ocean band fell 70 percent for the season and the control station did not work."
date: 2020-09-20
lang: en
translationKey: seismic-lockdown
tags: ["open-data", "statistics"]
---
At the end of March a plot from the Royal Observatory of Belgium went around Twitter. It was the seismometer in Uccle, on the south side of Brussels. Its line dropped on the days the lockdown started. In July the same idea came out in Science as a paper by Lecocq and many coauthors with 268 stations around the world. The short version in the news was that the Earth went quiet. I took that headline as it was. I had no idea what quiet means for a seismometer, in which units and compared to what. So I downloaded the data and counted it myself.

Before the first number I wrote down what I expected. Weekdays in Brussels would be 25 to 50 percent quieter after March 18. A lockdown weekday would look like a normal Sunday. The low frequencies that come from the ocean would show nothing. The first 2 turned out wrong.

## What I measured

The ORFEUS data centre serves the Belgian network over the FDSN web service. I took the vertical channel at 100 samples per second for 2 stations, every day from January 1, 2019 to September 19, 2020. UCC is the Uccle station in the city. It has a Trillium Compact 20 sensor since October 2018, so the whole period is one instrument. MEM is Membach, a station in an underground gallery in the east of the country, near the German border. I wanted it as the place without people.

ObsPy reads the files and gives the instrument response. For every 30 minutes I take the spectrum, divide by the response to get ground displacement and sum the energy in a band. I use 2 bands. The first is 4 to 14 Hz, where traffic and machines are. The second is 0.1 to 1 Hz, where the microseism from ocean waves is. That gives about 30 thousand half hour numbers per station, in nanometres.

My first version filtered the whole day and took 71 seconds per day, which is about a day of computing for 2 stations. The spectral version takes 8 seconds. It reads about 5 percent higher at UCC than the filter because of the band edges. The offset is the same everywhere, so it cancels in every ratio below.

## The drop is real and smaller than I thought

I take working days, from 7 in the morning to 7 in the evening, local time. The median at UCC was 1.38 nm from January 13 to March 13. From March 18 to May 3 it was 1.12 nm. That is 19 percent less.

<figure class="fig">
<svg viewBox="0 0 680 294" role="img" aria-label="Weekly median of the 4 to 14 Hz ground displacement at station UCC in Uccle, Brussels, working days from 7 to 19 local time, in nanometres. 2019 by ISO week: 1: 1.07, 2: 1.48, 3: 1.39, 4: 1.24, 5: 1.29, 6: 1.34, 7: 1.34, 8: 1.41, 9: 1.33, 10: 1.28, 11: 1.45, 12: 1.39, 13: 1.44, 14: 1.44, 15: 1.33, 16: 1.29, 17: 1.39, 18: 1.49, 19: 1.48, 20: 1.48, 21: 1.46, 22: 1.44, 23: 1.49, 24: 1.49, 25: 1.63, 26: 1.67, 27: 1.67, 28: 1.35, 29: 1.26, 30: 1.26, 31: 1.36, 32: 1.43, 33: 1.29, 34: 1.37, 35: 1.50, 36: 1.68, 37: 1.72, 38: 1.56. 2020: 1: 1.03, 2: 1.38, 3: 1.31, 4: 1.40, 5: 1.45, 6: 1.38, 7: 1.42, 8: 1.41, 9: 1.33, 10: 1.39, 11: 1.33, 12: 1.15, 13: 1.03, 14: 1.07, 15: 1.15, 16: 1.13, 17: 1.19, 18: 1.36, 19: 1.25, 20: 1.07, 21: 1.26, 22: 1.26, 23: 1.30, 24: 1.36, 25: 1.43, 26: 1.38, 27: 1.34, 28: 1.28, 29: 1.23, 30: 1.19, 31: 1.20, 32: 1.26, 33: 1.19, 34: 1.26, 35: 1.39, 36: 1.54, 37: 1.53, 38: 1.57. The 2020 line drops from about 1.4 to about 1.03 in the week of March 23 and comes back over May and June.">
  <line x1="60" y1="224.0" x2="660" y2="224.0" class="f-plain"/>
  <text x="54.0" y="228.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.9</text>
  <line x1="60" y1="157.3" x2="660" y2="157.3" class="f-plain"/>
  <text x="54.0" y="161.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.2</text>
  <line x1="60" y1="90.7" x2="660" y2="90.7" class="f-plain"/>
  <text x="54.0" y="94.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.5</text>
  <line x1="60" y1="24.0" x2="660" y2="24.0" class="f-plain"/>
  <text x="54.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.8</text>
  <text x="60" y="16" class="f-label f-muted">nm, 4 to 14 Hz</text>
  <text x="60.0" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="124.9" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="189.7" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="254.6" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="319.5" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">17</text>
  <text x="384.3" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <text x="449.2" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <text x="514.1" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">29</text>
  <text x="578.9" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">33</text>
  <text x="643.8" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">37</text>
  <text x="360" y="258" text-anchor="middle" class="f-label f-muted">ISO week</text>
  <line x1="244.9" y1="24" x2="244.9" y2="224" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="248.9" y="34.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">lockdown</text>
  <path d="M60.0,186.8L76.2,95.2L92.4,114.7L108.6,148.5L124.9,138.0L141.1,125.4L157.3,126.5L173.5,110.4L189.7,128.9L205.9,140.1L222.2,101.4L238.4,114.8L254.6,104.7L270.8,103.8L287.0,127.5L303.2,137.3L319.5,114.0L335.7,93.9L351.9,95.8L368.1,95.3L384.3,98.9L400.5,103.2L416.8,93.8L433.0,93.5L449.2,62.4L465.4,52.5L481.6,52.5L497.8,125.1L514.1,143.2L530.3,143.9L546.5,121.6L562.7,105.6L578.9,136.5L595.1,120.5L611.4,91.2L627.6,50.1L643.8,42.9L660.0,77.6" class="f-line" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 3"/>
  <path d="M60.0,195.3L76.2,118.0L92.4,133.8L108.6,113.4L124.9,102.1L141.1,116.6L157.3,107.9L173.5,111.2L189.7,128.3L205.9,114.6L222.2,128.0L238.4,167.8L254.6,194.8L270.8,185.3L287.0,168.0L303.2,173.9L319.5,160.7L335.7,122.5L351.9,146.5L368.1,187.1L384.3,144.6L400.5,143.7L416.8,134.2L433.0,122.0L449.2,107.0L465.4,117.8L481.6,125.3L497.8,140.6L514.1,150.6L530.3,160.3L546.5,158.1L562.7,144.8L578.9,159.0L595.1,143.6L611.4,115.2L627.6,80.7L643.8,84.0L660.0,74.5" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <circle cx="60.0" cy="195.3" r="2.2" class="f-accent"/>
  <circle cx="76.2" cy="118.0" r="2.2" class="f-accent"/>
  <circle cx="92.4" cy="133.8" r="2.2" class="f-accent"/>
  <circle cx="108.6" cy="113.4" r="2.2" class="f-accent"/>
  <circle cx="124.9" cy="102.1" r="2.2" class="f-accent"/>
  <circle cx="141.1" cy="116.6" r="2.2" class="f-accent"/>
  <circle cx="157.3" cy="107.9" r="2.2" class="f-accent"/>
  <circle cx="173.5" cy="111.2" r="2.2" class="f-accent"/>
  <circle cx="189.7" cy="128.3" r="2.2" class="f-accent"/>
  <circle cx="205.9" cy="114.6" r="2.2" class="f-accent"/>
  <circle cx="222.2" cy="128.0" r="2.2" class="f-accent"/>
  <circle cx="238.4" cy="167.8" r="2.2" class="f-accent"/>
  <circle cx="254.6" cy="194.8" r="2.2" class="f-accent"/>
  <circle cx="270.8" cy="185.3" r="2.2" class="f-accent"/>
  <circle cx="287.0" cy="168.0" r="2.2" class="f-accent"/>
  <circle cx="303.2" cy="173.9" r="2.2" class="f-accent"/>
  <circle cx="319.5" cy="160.7" r="2.2" class="f-accent"/>
  <circle cx="335.7" cy="122.5" r="2.2" class="f-accent"/>
  <circle cx="351.9" cy="146.5" r="2.2" class="f-accent"/>
  <circle cx="368.1" cy="187.1" r="2.2" class="f-accent"/>
  <circle cx="384.3" cy="144.6" r="2.2" class="f-accent"/>
  <circle cx="400.5" cy="143.7" r="2.2" class="f-accent"/>
  <circle cx="416.8" cy="134.2" r="2.2" class="f-accent"/>
  <circle cx="433.0" cy="122.0" r="2.2" class="f-accent"/>
  <circle cx="449.2" cy="107.0" r="2.2" class="f-accent"/>
  <circle cx="465.4" cy="117.8" r="2.2" class="f-accent"/>
  <circle cx="481.6" cy="125.3" r="2.2" class="f-accent"/>
  <circle cx="497.8" cy="140.6" r="2.2" class="f-accent"/>
  <circle cx="514.1" cy="150.6" r="2.2" class="f-accent"/>
  <circle cx="530.3" cy="160.3" r="2.2" class="f-accent"/>
  <circle cx="546.5" cy="158.1" r="2.2" class="f-accent"/>
  <circle cx="562.7" cy="144.8" r="2.2" class="f-accent"/>
  <circle cx="578.9" cy="159.0" r="2.2" class="f-accent"/>
  <circle cx="595.1" cy="143.6" r="2.2" class="f-accent"/>
  <circle cx="611.4" cy="115.2" r="2.2" class="f-accent"/>
  <circle cx="627.6" cy="80.7" r="2.2" class="f-accent"/>
  <circle cx="643.8" cy="84.0" r="2.2" class="f-accent"/>
  <circle cx="660.0" cy="74.5" r="2.2" class="f-accent"/>
  <text x="254.6" y="210.8" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1.03</text>
  <line x1="20" y1="280" x2="42" y2="280" style="stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="50" y="284" class="f-label f-muted" style="font-size:11px">2019</text>
  <line x1="140" y1="280" x2="162" y2="280" style="stroke:var(--accent);stroke-width:2.2"/>
  <text x="170" y="284" class="f-label f-muted" style="font-size:11px">2020</text>
</svg>
<figcaption>BE.UCC, vertical channel, ORFEUS data. One point is the median over the working days of an ISO week, daytime half hours only. The vertical line is March 18, 2020, the start of the Belgian lockdown.</figcaption>
</figure>

Then I did the same for the same weeks of 2019. There the spring was 3 percent louder than the winter. The 2020 lockdown weeks are 19 percent below the same weeks of 2019. Next I checked how much 2 neighbouring blocks of 7 weeks normally differ, sliding the blocks through 2019 by one week. The ratio stayed between 0.86 and 1.17. The lockdown ratio 0.81 is outside this range, but only just. Near the step the drop is bigger. The 2 weeks before March 14 give 1.34 nm and the 2 weeks from March 23 give 1.03 nm, 23 percent less.

So the lockdown is visible in the ground of Brussels. On a working day it took about a fifth of the noise away and I expected half.

## A lockdown weekday is still louder than a Sunday

This was the expectation I was most sure about. A normal Sunday before the lockdown, daytime, was 0.91 nm. A lockdown weekday was 1.12 nm, which is 23 percent louder than that Sunday.

<figure class="fig">
<svg viewBox="0 0 680 294" role="img" aria-label="Median 4 to 14 Hz displacement at UCC by hour of the day, local time, in nanometres. weekday, before: 0: 0.60, 3: 0.27, 6: 0.96, 9: 1.49, 12: 1.32, 15: 1.32, 18: 1.19, 21: 0.82. weekday, lockdown: 0: 0.52, 3: 0.24, 6: 0.87, 9: 1.18, 12: 1.13, 15: 1.08, 18: 1.06, 21: 0.67. Sunday, before: 0: 0.68, 3: 0.34, 6: 0.60, 9: 0.85, 12: 0.94, 15: 0.93, 18: 0.93, 21: 0.75. Sunday, lockdown: 0: 0.54, 3: 0.15, 6: 0.54, 9: 0.66, 12: 0.78, 15: 0.74, 18: 0.79, 21: 0.68.">
  <line x1="60" y1="224.0" x2="660" y2="224.0" class="f-plain"/>
  <text x="54.0" y="228.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.0</text>
  <line x1="60" y1="174.0" x2="660" y2="174.0" class="f-plain"/>
  <text x="54.0" y="178.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.4</text>
  <line x1="60" y1="124.0" x2="660" y2="124.0" class="f-plain"/>
  <text x="54.0" y="128.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.8</text>
  <line x1="60" y1="74.0" x2="660" y2="74.0" class="f-plain"/>
  <text x="54.0" y="78.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.2</text>
  <line x1="60" y1="24.0" x2="660" y2="24.0" class="f-plain"/>
  <text x="54.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1.6</text>
  <text x="60" y="16" class="f-label f-muted">nm, 4 to 14 Hz</text>
  <text x="60.0" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="138.3" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="216.5" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="294.8" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="373.0" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <text x="451.3" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="529.6" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">18</text>
  <text x="607.8" y="240.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <text x="360" y="258" text-anchor="middle" class="f-label f-muted">hour of the day, Brussels time</text>
  <path d="M60.0,149.4L86.1,188.7L112.2,192.2L138.3,190.3L164.3,180.5L190.4,154.9L216.5,104.4L242.6,40.6L268.7,35.6L294.8,38.1L320.9,45.8L347.0,49.9L373.0,59.3L399.1,49.2L425.2,41.9L451.3,59.0L477.4,61.8L503.5,71.0L529.6,75.8L555.7,85.8L581.7,110.8L607.8,121.8L633.9,123.6L660.0,128.2" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <path d="M60.0,158.9L86.1,189.5L112.2,200.2L138.3,194.5L164.3,191.0L190.4,163.2L216.5,115.2L242.6,81.7L268.7,73.6L294.8,76.7L320.9,76.3L347.0,75.5L373.0,82.4L399.1,79.2L425.2,86.3L451.3,89.3L477.4,86.7L503.5,88.3L529.6,91.1L555.7,108.2L581.7,128.4L607.8,139.8L633.9,143.5L660.0,144.5" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <path d="M60.0,139.2L86.1,167.4L112.2,176.4L138.3,181.1L164.3,190.8L190.4,170.0L216.5,149.1L242.6,142.7L268.7,134.4L294.8,118.2L320.9,112.7L347.0,110.3L373.0,106.7L399.1,108.4L425.2,111.8L451.3,108.2L477.4,109.1L503.5,106.3L529.6,107.7L555.7,117.8L581.7,121.4L607.8,130.0L633.9,131.9L660.0,131.9" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <path d="M60.0,157.1L86.1,193.2L112.2,205.2L138.3,205.6L164.3,202.9L190.4,182.0L216.5,155.9L242.6,149.9L268.7,143.2L294.8,141.7L320.9,131.7L347.0,129.8L373.0,126.6L399.1,130.8L425.2,135.9L451.3,131.3L477.4,128.4L503.5,127.7L529.6,125.7L555.7,124.6L581.7,134.6L607.8,139.4L633.9,141.0L660.0,142.6" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <line x1="20" y1="280" x2="42" y2="280" style="stroke:var(--ink);stroke-width:1.6"/>
  <text x="50" y="284" class="f-label f-muted" style="font-size:11px">weekday, before</text>
  <line x1="180" y1="280" x2="202" y2="280" style="stroke:var(--accent);stroke-width:2.2"/>
  <text x="210" y="284" class="f-label f-muted" style="font-size:11px">weekday, lockdown</text>
  <line x1="340" y1="280" x2="362" y2="280" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="370" y="284" class="f-label f-muted" style="font-size:11px">Sunday, before</text>
  <line x1="500" y1="280" x2="522" y2="280" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:4 3"/>
  <text x="530" y="284" class="f-label f-muted" style="font-size:11px">Sunday, lockdown</text>
</svg>
<figcaption>BE.UCC, median for each hour of the day. Before is January 13 to March 13, 2020, lockdown is March 18 to May 3, 2020. Hour 0 on a Sunday is Saturday night.</figcaption>
</figure>

The biggest change was somewhere I did not look at first. Between midnight and 5 in the morning on Sundays, which is Saturday night, UCC dropped from 0.37 to 0.17 nm. That is 53 percent. In the same weeks of 2019 that number went up a little, from 0.42 to 0.45. Weekday nights dropped only 16 percent. From the ground I cannot say what made that noise, cars or people going home or something else.

## The place where I was sure it was the weather

February 2020 was windy. At Brussels airport the mean daytime wind in my weekdays before the lockdown was 5.9 m/s. In the lockdown weeks it was 3.6 m/s. I was sure part of the drop is just calmer weather, so I pulled the NOAA hourly reports for the airport to subtract it.

There was almost nothing to subtract. On the working days of 2019 the daily wind and the log of the 4 to 14 Hz noise at UCC correlate at minus 0.03. Then I kept only calm days, below 3.5 m/s. That leaves 9 days before and 17 during the lockdown and the ratio is 0.81, the same as with all days. With so few calm days I cannot say the wind plays no part, but it does not explain the drop.

The weather matters a lot in the other band. Between the winter weeks and the lockdown weeks the 0.1 to 1 Hz noise at UCC fell by 70 percent, from 499 to 149 nm. In 2019 the same weeks fell by 61 percent and the winter of 2020 started higher, at 499 against 389 nm. The lockdown weeks of 2020 are 2 percent below the same weeks of 2019. The biggest drop in my data is a seasonal one and it comes every spring without any lockdown.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="Ratio of the median noise in the lockdown weeks to the median noise in the winter weeks before, in 2020 and for the same weeks of 2019. UCC 4 to 14 Hz, weekday daytime: 2020 0.81, 2019 1.03. UCC 4 to 14 Hz, Saturday night: 2020 0.47, 2019 1.08. UCC 0.1 to 1 Hz, weekday daytime: 2020 0.30, 2019 0.39. MEM 4 to 14 Hz, weekday daytime: 2020 0.89, 2019 1.02.">
  <line x1="250.0" y1="14" x2="250.0" y2="220" class="f-plain"/>
  <text x="250.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.0</text>
  <line x1="310.0" y1="14" x2="310.0" y2="220" class="f-plain"/>
  <text x="310.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.2</text>
  <line x1="370.0" y1="14" x2="370.0" y2="220" class="f-plain"/>
  <text x="370.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.4</text>
  <line x1="430.0" y1="14" x2="430.0" y2="220" class="f-plain"/>
  <text x="430.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.6</text>
  <line x1="490.0" y1="14" x2="490.0" y2="220" class="f-plain"/>
  <text x="490.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.8</text>
  <line x1="550.0" y1="14" x2="550.0" y2="220" class="f-plain" style="stroke:var(--muted)"/>
  <text x="550.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.0</text>
  <line x1="610.0" y1="14" x2="610.0" y2="220" class="f-plain"/>
  <text x="610.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1.2</text>
  <text x="430" y="254" text-anchor="middle" class="f-label f-muted">spring weeks divided by winter weeks</text>
  <text x="240" y="36" text-anchor="end" class="f-label f-ink" style="font-size:12px">UCC 4 to 14 Hz, weekday daytime</text>
  <rect x="250" y="20" width="243.6" height="14" style="fill:var(--accent)"/>
  <text x="499.6" y="31.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2020: 0.81</text>
  <rect x="250" y="38" width="309.0" height="14" style="fill:var(--muted);opacity:0.7"/>
  <text x="565.0" y="49.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2019: 1.03</text>
  <text x="240" y="86" text-anchor="end" class="f-label f-ink" style="font-size:12px">UCC 4 to 14 Hz, Saturday night</text>
  <rect x="250" y="70" width="141.1" height="14" style="fill:var(--accent)"/>
  <text x="397.1" y="81.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2020: 0.47</text>
  <rect x="250" y="88" width="324.3" height="14" style="fill:var(--muted);opacity:0.7"/>
  <text x="580.3" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2019: 1.08</text>
  <text x="240" y="136" text-anchor="end" class="f-label f-ink" style="font-size:12px">UCC 0.1 to 1 Hz, weekday daytime</text>
  <rect x="250" y="120" width="89.6" height="14" style="fill:var(--accent)"/>
  <text x="345.6" y="131.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2020: 0.30</text>
  <rect x="250" y="138" width="117.4" height="14" style="fill:var(--muted);opacity:0.7"/>
  <text x="373.4" y="149.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2019: 0.39</text>
  <text x="240" y="186" text-anchor="end" class="f-label f-ink" style="font-size:12px">MEM 4 to 14 Hz, weekday daytime</text>
  <rect x="250" y="170" width="265.6" height="14" style="fill:var(--accent)"/>
  <text x="521.6" y="181.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2020: 0.89</text>
  <rect x="250" y="188" width="306.0" height="14" style="fill:var(--muted);opacity:0.7"/>
  <text x="562.0" y="199.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2019: 1.02</text>
</svg>
<figcaption>Winter weeks are January 13 to March 13, lockdown weeks are March 18 to May 3. The 2019 bars use the same weeks shifted by 364 days. Below 1 means quieter in spring.</figcaption>
</figure>

The control station did not work as a control. MEM lost 11 percent in the day band. In 2019 its sliding 7 week blocks moved between 0.67 and 1.41 of each other, so 11 percent is lost in its own noise. I also doubt it is a place without people, because an ordinary weekday there is almost twice as loud as a Sunday.

## The way back

Against the same month of 2019 the lowest month at UCC was April, at 0.84. By June it was 0.90 and since then it stays around 0.91 to 0.93, also in the first 19 days of September. The return started before the first reopening on May 4. In the last week of April, with only 4 working days, UCC was already at 1.36 nm against 1.49 in the same week of 2019. The city is back to most of its noise, but not all of it. I do not know why the gap stays and the seismometer cannot tell me that.

## What I did not check

I have 2 stations in one country, so everything above is about Brussels. Lecocq and colleagues show the same direction on most of their 268 stations and they did it first and with much more care. Their tool computes the same 4 to 14 Hz displacement with other windows and smoothing, so I did not try to match my 19 percent to their curve for Uccle. There are 2 more things I cannot explain. Every night, in 2019 and in 2020, the median falls from about 0.6 to 0.35 nm between the half hour that starts at 0:30 and the one that starts at 1:00. My guess is the last trams and buses, but I did not check any timetable. The other one is a week. May 11 to 15, when shops opened again, is at 1.07 nm and lower than the weeks around it. All numbers are from one run over the data as it was on the ORFEUS server.
