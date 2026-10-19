---
title: "The storm that took 38 Starlinks was a weak one and the catalog saw only 6"
description: "GFZ Kp, Kyoto Dst and the CelesTrak catalog against the February 2022 storm that took 38 Starlink satellites: an ordinary G1 with 35 days like it in 2022, a catalog that shows only 6 of the losses as rows, and 2 launches that met worse weather and lost nothing."
date: 2022-12-22
lang: en
translationKey: space-weather-starlink
tags: ["open-data", "reliability"]
---
In February I read the headline that a solar storm had destroyed 40 Starlink satellites. I pictured something large and took the story as it was, without looking at a single number. This month I finally did, because I wanted to know 2 things. How strong was that storm compared with the rest of 2022? And was it special for Starlink or did other launches fly through the same weather without losses?

Kataoka and colleagues posted a preprint in March that is now accepted by a journal. Dang and colleagues published theirs in August. A NOAA and CIRES team wrote a third one together with SpaceX engineers. All of them are about how dense the upper air was during those days. I did not repeat their models, I only wanted to check the story against public tables that anyone can download.

## The tables

Kp from GFZ Potsdam is one number for every 3 hours, from 0 to 9, that says how disturbed the Earth's magnetic field is globally. NOAA's storm scale is built on it: Kp 5 is a G1 storm, 6 is G2, 7 is G3. Kp goes in thirds, so 5+ means 5 and a third. The same file has ap, a linear version of Kp that can be summed. Its daily mean is Ap.

The satellite catalog from CelesTrak lists every tracked object with its launch date and, if it has reentered, its decay date. Launch times I took from the Wikipedia list of Starlink launches, because the catalog only has dates. The analysis is about 110 lines of Python 3.10 with only the standard library.

Before counting I wrote down what I expected. The February storm would be a weak one, with more than 10 similar days in 2022. Group 4-7 would be the only launch with a large early loss. And at least one other launch would meet Kp 5 or more in its first days and lose nothing.

## How strong it was

Group 4-7 launched on February 3 at 18:13 UTC with 49 satellites. SpaceX puts new satellites into a low orbit of about 210 km and raises them later, so that a broken one burns up fast.

On February 3 Kp reached 5+ in the morning, hours before the launch. From the launch until the next afternoon it stayed between 2.7 and 4. Then on February 4 between 15 and 18 UTC it went to 5+ again, about 21 hours after the satellites were released. Kyoto's real time Dst, the other usual storm index, bottomed at −66 nT on February 3 and −61 on February 4. A strong storm goes below −100.

Between January 1 and December 21 this year there were 35 days with Kp of 5 or more, about 3 a month. 20 of them reached 5+, like February 3 and 4. Only 5 days reached G2 and none reached G3. Some services count 5 minus as G1 already. With that rule the year has 52 storm days, 9 of them G2 and 2 G3. Either way February is not near the top. By daily Ap, February 4 shares the 5th place among the most disturbed days of the year and February 3 the 11th. For this point of the solar cycle it is an ordinary count: 2012, also on the rise of a cycle, had 35 such days too.
<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Bar chart of the 3 hour Kp index from GFZ Potsdam, February 2 to 6, 2022, 40 bars. A dashed line marks Kp 5, the G1 storm level, and a second one Kp 6, G2. On February 3 Kp reaches 5+ between 09 and 12 UTC. A vertical line marks the Group 4-7 launch at 18:13 UTC on February 3, when Kp is 3. After it Kp stays between 2.7 and 4 until February 4, then reaches 5+ between 15 and 18 UTC and 5 between 18 and 21 UTC. No bar reaches 6.">
  <text x="32" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="32" y="150.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="32" y="97.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="32" y="44.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="40" y="12" class="f-label f-muted">Kp</text>
  <rect x="41.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="57.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="72.5" y="182.3" width="12.5" height="17.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="88.0" y="191.2" width="12.5" height="8.8" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="103.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="119.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="134.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="150.0" y="164.6" width="12.5" height="35.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="165.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="181.0" y="84.9" width="12.5" height="115.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="196.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="212.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="227.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="243.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="258.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="274.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="289.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="305.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="320.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="336.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="351.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="367.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="382.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="398.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="413.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="429.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="444.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="460.0" y="138.0" width="12.5" height="62.0" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="475.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="491.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="506.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="522.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="537.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="553.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="568.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="584.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="599.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="615.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="630.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="646.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <line x1="40" y1="67.1" x2="660" y2="67.1" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="63.1" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G1</text>
  <line x1="40" y1="40.6" x2="660" y2="40.6" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="36.6" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G2</text>
  <line x1="40.0" y1="200" x2="40.0" y2="206" class="f-plain"/>
  <text x="102.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb 2</text>
  <line x1="164.0" y1="200" x2="164.0" y2="206" class="f-plain"/>
  <text x="226.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb 3</text>
  <line x1="288.0" y1="200" x2="288.0" y2="206" class="f-plain"/>
  <text x="350.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb 4</text>
  <line x1="412.0" y1="200" x2="412.0" y2="206" class="f-plain"/>
  <text x="474.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb 5</text>
  <line x1="536.0" y1="200" x2="536.0" y2="206" class="f-plain"/>
  <text x="598.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb 6</text>
  <line x1="660.0" y1="200" x2="660.0" y2="206" class="f-plain"/>
  <line x1="258.1" y1="20" x2="258.1" y2="200" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="263.1" y="30" class="f-label f-accent">launch 18:13 UTC</text>
</svg>
<figcaption>GFZ Kp, 3 hour values. Bars at Kp 5 or more are highlighted.</figcaption>
</figure>

## Where I made a mistake

Then I counted early losses. For every Starlink launch since 2019 I took the satellites that reentered within 30 days. My first table showed Group 4-7 with 6 early losses. A calm launch on March 19 also had 6.

It took me a while to look at the other column. The catalog has between 46 and 54 objects for every 2022 Starlink launch except 2. The September 11 launch shared the rocket with BlueWalker 3 and has 34. Group 4-7 has 17. Of these, 11 are the satellites that survived. The other 6 are objects named only by a letter, like STARLINK A. They reentered between February 6 and 12. The other 32 reentered before they got public catalog numbers.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="49 squares, one for each satellite of Group 4-7. 11 filled squares are satellites that survived and have catalog entries. 6 outlined squares in accent colour are objects that got a catalog entry with a letter name and reentered between February 6 and 12. 32 dashed squares are satellites that reentered without ever getting a catalog entry. 6 plus 32 is 38 lost.">
  <rect x="30" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="182" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="220" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="258" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="30" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="183" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="221" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="259" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="31" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="69" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="107" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="145" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="320" y="50" width="18" height="18" class="f-ink" style="fill-opacity:0.75"/>
  <text x="348" y="64" class="f-label"><tspan x="348" dy="0">11 survived, catalogued</tspan></text>
  <rect x="321" y="111" width="16" height="16" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="348" y="117" class="f-label"><tspan x="348" dy="0">6 catalogued as STARLINK A, B,</tspan><tspan x="348" dy="14">..., reentered Feb 6 to 12</tspan></text>
  <rect x="321" y="171" width="16" height="16" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <text x="348" y="177" class="f-label"><tspan x="348" dy="0">32 reentered with no catalog</tspan><tspan x="348" dy="14">entry</tspan></text>
</svg>
<figcaption>CelesTrak SATCAT, launch 2022-010. The 32 missing satellites are counted as 49 launched minus 17 catalogued.</figcaption>
</figure>

49 minus 11 is 38, the same number the papers give. So the catalog does confirm the loss, but only as a hole. If you count reentries row by row, as I did first, you see 6. The March 19 launch went up in quiet weather and has all its satellites in the catalog. Its 6 reentries came 13 to 30 days later, a few days after G2 storms on April 10 and 14. Satellites that failed their checks and were deorbited on purpose would fit as well, which I did not check.

## Was the weather special for Starlink

For each of the 33 Starlink launches in 2022 I summed ap over the 3 hour slots from launch to about one day after. Group 4-7 had a sum of 256 with a maximum Kp of 5+.

It is not the worst. The launch on January 19, 2 weeks before, went up at 02:02 UTC straight into a Kp 5+ slot. Its first day sum is 199 and all 49 satellites are in the catalog with no losses in the first month. On July 7 the sum was 266 with Kp 5+. On September 5 it was 319 with Kp 5. The solar radio flux at 10.7 cm tracks how much the Sun heats the upper atmosphere. It was 130 that day, about the same as 127 and 130 on February 3 and 4. None of these 3 launches lost a satellite in the first month.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Bar chart of 33 Starlink launches in 2022 in date order. Bar height is the sum of ap over the 3 hour slots from launch to about one day later. Highlighted: Jan 19 199, lost 0; Group 4-7 256, lost 6; Jul 7 266, lost 0; Sep 5 319, lost 0. Group 4-7 is not the highest bar. July 7 and September 5 have higher sums, January 19 went up straight into Kp 5+, and none of the 3 lost a satellite in the first month.">
  <line x1="50" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="44" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="165.7" x2="660" y2="165.7" class="f-plain"/>
  <text x="44" y="169.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="111.4" x2="660" y2="111.4" class="f-plain"/>
  <text x="44" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50" y1="57.1" x2="660" y2="57.1" class="f-plain"/>
  <text x="44" y="61.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="50" y="16" class="f-label f-muted">sum of ap, first day</text>
  <rect x="52.0" y="220.0" width="14.5" height="0.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="70.5" y="112.0" width="14.5" height="108.0" class="f-ink" style="fill-opacity:0.7"/>
  <text x="77.7" y="106.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">199</text>
  <text x="81.7" y="236" text-anchor="end" class="f-label f-ink" style="font-size:11px">Jan 19</text>
  <text x="81.7" y="251" text-anchor="end" class="f-mono f-muted" style="font-size:10px">lost 0</text>
  <rect x="89.0" y="81.0" width="14.5" height="139.0" class="f-accent" style="fill-opacity:1"/>
  <text x="96.2" y="75.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">256</text>
  <text x="92.2" y="236" text-anchor="start" class="f-label f-accent" style="font-size:11px">Group 4-7</text>
  <text x="92.2" y="251" text-anchor="start" class="f-mono f-muted" style="font-size:10px">lost 6</text>
  <rect x="107.5" y="123.9" width="14.5" height="96.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="125.9" y="214.0" width="14.5" height="6.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="144.4" y="180.4" width="14.5" height="39.6" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="162.9" y="198.8" width="14.5" height="21.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="181.4" y="184.7" width="14.5" height="35.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="199.9" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="218.4" y="152.1" width="14.5" height="67.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="236.8" y="208.6" width="14.5" height="11.4" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="255.3" y="186.3" width="14.5" height="33.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="273.8" y="171.7" width="14.5" height="48.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="292.3" y="186.9" width="14.5" height="33.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="310.8" y="171.1" width="14.5" height="48.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="329.3" y="75.6" width="14.5" height="144.4" class="f-ink" style="fill-opacity:0.7"/>
  <text x="336.5" y="69.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">266</text>
  <text x="336.5" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">Jul 7</text>
  <text x="336.5" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">lost 0</text>
  <rect x="347.8" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="366.2" y="195.0" width="14.5" height="25.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="384.7" y="143.5" width="14.5" height="76.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="403.2" y="191.2" width="14.5" height="28.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="421.7" y="164.1" width="14.5" height="55.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="440.2" y="185.8" width="14.5" height="34.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="458.7" y="137.5" width="14.5" height="82.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="477.2" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="495.6" y="157.0" width="14.5" height="63.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="514.1" y="46.8" width="14.5" height="173.2" class="f-ink" style="fill-opacity:0.7"/>
  <text x="521.4" y="40.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">319</text>
  <text x="521.4" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">Sep 5</text>
  <text x="521.4" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">lost 0</text>
  <rect x="532.6" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="551.1" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="569.6" y="193.9" width="14.5" height="26.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="588.1" y="141.3" width="14.5" height="78.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="606.5" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="625.0" y="140.2" width="14.5" height="79.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="643.5" y="205.3" width="14.5" height="14.7" class="f-ink" style="fill-opacity:0.25"/>
</svg>
<figcaption>GFZ ap, launch times from the Wikipedia list of Starlink launches. Number under a label: satellites that reentered within 30 days, as the catalog shows them.</figcaption>
</figure>

The third expectation also held. That is the part I cannot explain with Kp. By the numbers I had, Group 4-7 had a bad day, but 2 other launches had worse days and survived. SpaceX wrote at the time that onboard GPS showed drag up to 50% higher than on previous launches. Kp does not show that. It is built from magnetometers on the ground and does not measure the density of air at 210 km above a specific orbit. The papers estimate that density with models of the upper atmosphere.

Maybe the release orbit of January 19 and September 5 was higher. For September 5, maybe SpaceX handled new batches differently after February. My tables cannot tell which.

## What I did not check

The release altitude of each launch. First orbits are on the US Space Force catalog site, which needs an account. The public catalog keeps only the latest orbit. Without them the comparison covers only the weather. How exposed each batch was I cannot say.

The Kp for the last weeks of the year is still preliminary and a few late counts can move. I used 30 days as the line for an early loss. A satellite that failed in orbit and reentered later is not counted and a planned deorbit within 30 days is counted as a loss.

I did not check the Wikipedia launch times against SpaceX. An error of an hour would move a window by one 3 hour slot at most.

I also did not look at the ground side, power grids and radio. The only network I could check with public tables was the one in orbit. Why January 19 and September 5 survived the same weather I still do not know.
