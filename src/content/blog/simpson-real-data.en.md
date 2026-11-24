---
title: "Alaska is late less often than Hawaiian at 14 of 15 airports and more often in total"
description: "In 2015 Alaska was late less often than Hawaiian at 14 of 15 shared airports and more often in total. I searched flights, baseball and the Berkeley table for Simpson reversals and counted how many of them chance gives."
date: 2016-04-03
lang: en
translationKey: simpson-real-data
tags: ["statistics", "open-data"]
---

`origin AS HA 0.1301 0.1159 raw 0.0142 mh -0.0595 14 / 15 9.0 -19.2`

My script printed this line for Alaska (AS) and Hawaiian (HA) on US domestic flights of 2015. The 2 airlines share 15 departure airports with at least 100 flights each. Of Alaska's flights from there 13.01% arrived 15 or more minutes late, of Hawaiian's 11.59%. But at 14 of these 15 airports Alaska had the lower share. The 2 numbers at the end are the raw and the adjusted difference in standard errors.

I knew Simpson's paradox only from the Berkeley admissions of 1973, retold that story from memory and never opened the table. I also never asked how often real data does this. So I wrote down my expectations, took 3 public datasets and let a Python script look.

Barnett described the airline version in 1994, with Alaska and America West at 5 airports in June 1991.

## The table I had never opened

R ships the 6 largest departments of Berkeley, 4,526 applicants. Bickel and co-authors wrote them up in 1975. 44.5% of men were admitted and 30.4% of women. In the story as I retold it women were ahead in every department. In the table they are ahead in 4 of 6, in C and E men lead by 2.9 and 3.8 points.

Adjusted for department, women lead by 1.84 points. I used the weights of Mantel and Haenszel, where a department counts more if both sexes are well represented. Then I dropped departments one at a time. Without department A, where 82.4% of women and 62.1% of men got in, the adjusted lead goes back to men, 0.55 points. The raw gap without A is 9.66, so it melts in both cases, but the change of sign rests on one department where 108 women applied. And the standard error of both adjusted numbers is about 1.5 points. I would not bet on either sign.

## 91 pairs of airlines

Flights are the on-time files of the Bureau of Transportation Statistics, 12 months of 2015, 5,819,079 rows. Without cancelled and diverted flights 5,714,008 are left, from 14 carriers, which gives 91 pairs. For each pair I kept the groups where both have 100 flights or more and compared the raw and the adjusted difference there. A flip means that the sign changes. A full reversal means that every group goes against the total.

| split by | pairs | flips | full reversals |
|---|---|---|---|
| departure airport | 90 | 10 | 0 |
| airport and hour | 89 | 6 | 0 |
| arrival airport | 90 | 5 | 0 |
| distance group | 87 | 4 | 0 |
| route | 77 | 3 | 0 |
| route and month | 52 | 1 | 0 |
| departure hour | 91 | 1 | 0 |
| month | 91 | 0 | 0 |
| day of week | 91 | 0 | 0 |

I expected at most one full reversal and about 10% of flips by airport. Both guesses held. 6 of the 10 airport flips involve Hawaiian. In 4 of the 10 the raw or the adjusted difference is within 3 standard errors, so I would not retell those.

My guess about stability did not hold. I searched on even days of the year and expected almost every flip to repeat on odd days. 9 of 13 did. Of the 4 lost ones 3 had a raw gap under 0.4 points, the last had 2 shared airports. The threshold matters too. With 30 flights per airport there are 12 flips, with 1,000 only 4.

<figure class="fig">
<svg viewBox="0 0 700 435" role="img" aria-label="Share of flights in 2015 that arrived 15 or more minutes late for Alaska and Hawaiian at 15 shared departure airports. HNL: 11.5, 9.2; OGG: 8.4, 12.7; KOA: 9.5, 9.5; LIH: 9.5, 9.7; LAX: 11.4, 18.8; LAS: 11.3, 25.4; OAK: 10.7, 19.8; SEA: 14.5, 22.4; SFO: 18.7, 29.9; SJC: 10.7, 23.0; PDX: 10.9, 23.6; SMF: 11.3, 31.0; SAN: 10.8, 36.2; PHX: 10.7, 31.3; JFK: 16.0, 30.0. Alaska is lower at every airport except Honolulu, but in total it has 13.01% against 11.59%.">
  <line x1="70.0" y1="32" x2="70.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="70.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="222.5" y1="32" x2="222.5" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="222.5" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="375.0" y1="32" x2="375.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="375.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="527.5" y1="32" x2="527.5" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="527.5" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="680.0" y1="32" x2="680.0" y2="407" class="f-plain" style="stroke-width:0.7"/>
  <text x="680.0" y="425.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="58.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">HNL</text>
  <line x1="245.4" y1="44" x2="210.1" y2="44" class="f-line" style="stroke-width:1"/>
  <circle cx="210.1" cy="44" r="7.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="245.4" cy="44" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="71.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">OGG</text>
  <line x1="198.3" y1="67" x2="264.1" y2="67" class="f-line" style="stroke-width:1"/>
  <circle cx="264.1" cy="67" r="5.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="198.3" cy="67" r="2.3" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">KOA</text>
  <line x1="214.6" y1="90" x2="215.5" y2="90" class="f-line" style="stroke-width:1"/>
  <circle cx="215.5" cy="90" r="3.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="214.6" cy="90" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="117.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LIH</text>
  <line x1="214.9" y1="113" x2="217.9" y2="113" class="f-line" style="stroke-width:1"/>
  <circle cx="217.9" cy="113" r="3.8" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="214.9" cy="113" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="140.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LAX</text>
  <line x1="244.2" y1="136" x2="356.9" y2="136" class="f-line" style="stroke-width:1"/>
  <circle cx="356.9" cy="136" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="244.2" cy="136" r="4.1" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">LAS</text>
  <line x1="242.8" y1="159" x2="456.9" y2="159" class="f-line" style="stroke-width:1"/>
  <circle cx="456.9" cy="159" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="242.8" cy="159" r="2.8" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="186.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">OAK</text>
  <line x1="233.6" y1="182" x2="372.4" y2="182" class="f-line" style="stroke-width:1"/>
  <circle cx="372.4" cy="182" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.6" cy="182" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="209.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SEA</text>
  <line x1="291.7" y1="205" x2="411.0" y2="205" class="f-line" style="stroke-width:1"/>
  <circle cx="411.0" cy="205" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="291.7" cy="205" r="10.0" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="232.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SFO</text>
  <line x1="354.6" y1="228" x2="526.4" y2="228" class="f-line" style="stroke-width:1"/>
  <circle cx="526.4" cy="228" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="354.6" cy="228" r="3.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="255.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SJC</text>
  <line x1="233.6" y1="251" x2="420.6" y2="251" class="f-line" style="stroke-width:1"/>
  <circle cx="420.6" cy="251" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.6" cy="251" r="2.9" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="278.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">PDX</text>
  <line x1="236.7" y1="274" x2="429.3" y2="274" class="f-line" style="stroke-width:1"/>
  <circle cx="429.3" cy="274" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="236.7" cy="274" r="5.1" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="301.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SMF</text>
  <line x1="242.8" y1="297" x2="542.1" y2="297" class="f-line" style="stroke-width:1"/>
  <circle cx="542.1" cy="297" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="242.8" cy="297" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="324.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">SAN</text>
  <line x1="234.1" y1="320" x2="621.4" y2="320" class="f-line" style="stroke-width:1"/>
  <circle cx="621.4" cy="320" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="234.1" cy="320" r="3.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="347.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">PHX</text>
  <line x1="233.0" y1="343" x2="547.6" y2="343" class="f-line" style="stroke-width:1"/>
  <circle cx="547.6" cy="343" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="233.0" cy="343" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="58.0" y="370.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">JFK</text>
  <line x1="314.6" y1="366" x2="527.5" y2="366" class="f-line" style="stroke-width:1"/>
  <circle cx="527.5" cy="366" r="2.2" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <circle cx="314.6" cy="366" r="2.2" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <line x1="10" y1="378" x2="680" y2="378" class="f-plain"/>
  <text x="58.0" y="399.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">total</text>
  <path d="M239.7,395 L246.7,388 L253.7,395 L246.7,402 Z" style="fill:var(--muted);stroke:none"/>
  <path d="M261.4,395 L268.4,388 L275.4,395 L268.4,402 Z" style="fill:var(--accent);stroke:none"/>
  <text x="234.7" y="399.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">11.59</text>
  <text x="280.4" y="399.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13.01</text>
  <circle cx="76" cy="14" r="6" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="88.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Alaska</text>
  <circle cx="166" cy="14" r="6" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="178.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Hawaiian</text>
  <text x="680.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">late arrivals, %</text>
</svg>
<figcaption>Late arrivals by airport of departure. Dot area grows with the number of flights. Alaska has its big dot at Seattle and Hawaiian has them on the islands, so the totals change places.</figcaption>
</figure>

The mechanism is visible in the dots. 61,148 of Hawaiian's 76,041 flights are hops between islands and 9.07% of them were late. When they flew to the islands from anywhere else, it was 24.49%. At the shared airports 89.5% of Hawaiian's flights leave from 4 island airports, for Alaska it is 7.3%. Almost half of Alaska's leave from Seattle, where 14.54% were late. 2 of the 14 wins are almost ties, 0.06 points in Kona and 0.2 in Lihue.

## The answer depends on the column

<figure class="fig">
<svg viewBox="0 0 700 212" role="img" aria-label="Difference in the share of late flights, first airline minus second, in points, under 8 ways to compare. Alaska, Hawaiian: all +1.7, origin -6.0, dest -0.5, route -8.5, month +1.7, hour +1.8, distance -0.1, orig+hour -5.9; Delta, Hawaiian: all +2.2, origin -5.1, dest +2.6, route +0.5, month +2.3, hour +2.1, distance +3.8, orig+hour -3.4; SkyWest, United: all -1.9, origin +1.2, dest 0.0, route +3.6, month -2.0, hour -2.2, distance -1.7, orig+hour +0.2; JetBlue, Envoy: all +0.9, origin -3.1, dest -1.1, route -3.5, month +1.4, hour +0.5, distance -2.1, orig+hour -0.3; ExpressJet, SkyWest: all +1.0, origin -2.2, dest -2.4, route -4.0, month +0.9, hour +0.9, distance +1.2, orig+hour -2.5.">
  <text x="193.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">all</text>
  <text x="259.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">origin</text>
  <text x="325.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">dest</text>
  <text x="391.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">route</text>
  <text x="457.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">month</text>
  <text x="523.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">hour</text>
  <text x="589.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">distance</text>
  <text x="655.0" y="22.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">orig+hour</text>
  <text x="152.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Alaska, Hawaiian</text>
  <rect x="162" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.7</text>
  <rect x="228" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-6.0</text>
  <rect x="294" y="36" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0.5</text>
  <rect x="360" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-8.5</text>
  <rect x="426" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.7</text>
  <rect x="492" y="36" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.8</text>
  <rect x="558" y="36" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0.1</text>
  <rect x="624" y="36" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="54.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-5.9</text>
  <text x="152.0" y="87.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Delta, Hawaiian</text>
  <rect x="162" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2.2</text>
  <rect x="228" y="70" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-5.1</text>
  <rect x="294" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2.6</text>
  <rect x="360" y="70" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.5</text>
  <rect x="426" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2.3</text>
  <rect x="492" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+2.1</text>
  <rect x="558" y="70" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+3.8</text>
  <rect x="624" y="70" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3.4</text>
  <text x="152.0" y="121.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">SkyWest, United</text>
  <rect x="162" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1.9</text>
  <rect x="228" y="104" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.2</text>
  <rect x="294" y="104" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0.0</text>
  <rect x="360" y="104" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+3.6</text>
  <rect x="426" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.0</text>
  <rect x="492" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.2</text>
  <rect x="558" y="104" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1.7</text>
  <rect x="624" y="104" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="122.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.2</text>
  <text x="152.0" y="155.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">JetBlue, Envoy</text>
  <rect x="162" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.9</text>
  <rect x="228" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3.1</text>
  <rect x="294" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-1.1</text>
  <rect x="360" y="138" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-3.5</text>
  <rect x="426" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.4</text>
  <rect x="492" y="138" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.5</text>
  <rect x="558" y="138" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.1</text>
  <rect x="624" y="138" width="62" height="28" rx="3" style="fill:none;fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="156.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-0.3</text>
  <text x="152.0" y="189.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">ExpressJet, SkyWest</text>
  <rect x="162" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="193.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.0</text>
  <rect x="228" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="259.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.2</text>
  <rect x="294" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="325.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.4</text>
  <rect x="360" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="391.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-4.0</text>
  <rect x="426" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="457.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.9</text>
  <rect x="492" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="523.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+0.9</text>
  <rect x="558" y="172" width="62" height="28" rx="3" style="fill:var(--accent);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="589.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">+1.2</text>
  <rect x="624" y="172" width="62" height="28" rx="3" style="fill:var(--muted);fill-opacity:0.28;stroke:var(--line);stroke-width:1"/>
  <text x="655.0" y="190.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">-2.5</text>
</svg>
<figcaption>First airline minus second, points of late flights. The first column is the plain difference over the whole year, the others are adjusted for their variable. Coloured cells: the first airline is late more often. Grey cells: less often. No fill: below 3 standard errors.</figcaption>
</figure>

Adjusted for month, day of week or hour, Hawaiian stays ahead by 1.7 or 1.8 points. By departure airport Alaska is ahead by 5.95. The arrival airport gives it 0.47, inside the noise. On equal routes Alaska is ahead by 8.52.

I was surprised not to find this pair among the route flips. But Alaska does not fly between islands, so on 16 shared routes only 5,806 Hawaiian flights are left. On those the raw total already says 13.05 against 21.10. There is nothing to reverse, the hops are already out of the total.

In 24 of 91 pairs some split puts one airline ahead by a point or more and another split does the same for the other. I counted only differences above 3 standard errors with the same sign on even and on odd days. 9 of these pairs include Hawaiian, 15 do not. Every split keeps its own set of shared flights, so a part of the 24 may come only from that. SkyWest beats United by 1.9 points in total and by 2.2 at equal hours. It loses by 1.2 at equal airports and by 3.6 on equal routes. SkyWest operates part of its flights under the United brand, so a passenger may not know which of the 2 is flying.

The arithmetic of every column is correct. A passenger from Seattle to Honolulu needs the route. Somebody who asks what share of Hawaiian's flights came late needs the total. The airline picks the departure hour itself, so adjusting for it forgives a late evening schedule. Pearl argued in 2014 that the table cannot choose for you, because the choice follows from what causes what. I agree, but before this run I would have taken the finest split and called it the truth.

## How many come from chance

Pavlides and Perlman showed in 2009 that a random 2x2x2 table reverses with probability 1/60. 4 million random tables gave me 66,274 reversals, 1.657%. With 6 groups, as at Berkeley, it is 0.018%. For flights I kept the size and the delay share of every carrier and dealt its flights to airports at random, in proportion to the real sizes. In 1,820 comparisons there were 0 flips. So noise of counting alone does not make a flip at this size.

Baseball is the opposite. Ross made one pair famous: David Justice hit better than Derek Jeter in 1995 and in 1996 and worse in the 2 years together. I searched the Lahman database, both major leagues from 1901 to 2015. A pair needed at least 40 at bats from each player in 2 consecutive seasons. I expected dozens. The same 2 players may count again in other seasons. There are 20,392 among 5,750,272 pairs, 275 of them for 1995-96 alone. 82 have a gap as big as Jeter and Justice or bigger. Second by gap is Jeter again: Pete Kozma beat him .333 to .316 in 2012 and .217 to .190 in 2013. Over both years Kozma has .234 and Jeter .306.

<figure class="fig">
<svg viewBox="0 0 700 286" role="img" aria-label="Reversals per 10,000 pairs of players by the minimum number of at bats in a season. 40: real 35.5, constant ability 29.6, all equal 55.0; 100: real 23.6, constant ability 19.5, all equal 34.9; 200: real 11.4, constant ability 9.1, all equal 18.2; 300: real 5.5, constant ability 4.1, all equal 9.1; 400: real 2.5, constant ability 1.7, all equal 3.9.">
  <line x1="50" y1="240.0" x2="690" y2="240.0" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="45" y1="179.3" x2="50" y2="179.3" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="183.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="45" y1="118.7" x2="50" y2="118.7" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="122.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="45" y1="58.0" x2="50" y2="58.0" class="f-plain" style="stroke-width:0.7"/>
  <text x="42.0" y="62.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="59.0" y="132.4" width="34" height="107.6" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="76.0" y="127.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">35.5</text>
  <rect x="97.0" y="150.1" width="34" height="89.9" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="114.0" y="145.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">29.6</text>
  <rect x="135.0" y="73.0" width="34" height="167.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="152.0" y="68.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">55.0</text>
  <text x="114.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="187.0" y="168.5" width="34" height="71.5" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="204.0" y="163.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">23.6</text>
  <rect x="225.0" y="180.9" width="34" height="59.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="242.0" y="175.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">19.5</text>
  <rect x="263.0" y="134.1" width="34" height="105.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="280.0" y="129.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">34.9</text>
  <text x="242.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="315.0" y="205.4" width="34" height="34.6" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="332.0" y="200.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">11.4</text>
  <rect x="353.0" y="212.4" width="34" height="27.6" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="370.0" y="207.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9.1</text>
  <rect x="391.0" y="184.7" width="34" height="55.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="408.0" y="179.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">18.2</text>
  <text x="370.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <rect x="443.0" y="223.3" width="34" height="16.7" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="460.0" y="218.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5.5</text>
  <rect x="481.0" y="227.5" width="34" height="12.5" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="498.0" y="222.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4.1</text>
  <rect x="519.0" y="212.4" width="34" height="27.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="536.0" y="207.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9.1</text>
  <text x="498.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <rect x="571.0" y="232.5" width="34" height="7.5" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="588.0" y="227.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2.5</text>
  <rect x="609.0" y="234.9" width="34" height="5.1" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="626.0" y="229.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1.7</text>
  <rect x="647.0" y="228.3" width="34" height="11.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="664.0" y="223.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">3.9</text>
  <text x="626.0" y="257.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <rect x="50" y="28" width="12" height="12" style="fill:var(--accent);opacity:0.9;stroke:none"/>
  <text x="68.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">real</text>
  <rect x="124.4" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.75;stroke:none"/>
  <text x="142.4" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">constant ability</text>
  <rect x="278" y="28" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="296.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">all equal</text>
  <text x="50.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">reversals per 10,000 pairs</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">at bats in each season, at least</text>
</svg>
<figcaption>Reversals per 10,000 pairs, real seasons against hits redrawn at random for the same at bats. One simulated run per bar.</figcaption>
</figure>

Then I kept the at bats and redrew the hits. If every player has the same ability in both seasons, there are 17,048 reversals. If everybody is the league average, 31,650. The real count is between these 2, closer to the first. With 400 at bats there are 108 pairs of 437,316 left and the largest gap is .0048.

## What I didn't check

One bad day delays many flights, so they are not independent and my standard errors are too small. Even and odd days are the only protection I used. 105,071 cancelled and diverted flights dropped out, maybe unevenly by airline. US Airways is in the files only through June, after that its flights are counted as American's, so pairs with either of them mix different months. Mantel and Haenszel is only one way to weigh, with the airport mix of one airline the numbers would differ. And I looked at 2015 only, I don't know if Hawaiian does it every year.
