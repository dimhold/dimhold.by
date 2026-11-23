---
title: "Looking for routes that stopped flying in April"
description: "OpenSky flight list v0.2, January to April 2020: which regular air routes had no flights at all in April. Half vanished, but the raw count mixed real closures with airports that dropped out of receiver coverage and with phantom routes to small fields under the approach."
date: 2020-05-17
lang: en
translationKey: missing-routes
tags: ["open-data", "statistics"]
---
All of April people were sharing the same chart, flights per day falling off a cliff in the second half of March. I wanted something else from it: the list of routes that were flown every week in winter and are gone now. That is a search for something missing and I realised I do not really know how to do it. When my query returns a zero I read it as "nothing happened". A missing route gives no row at all and nothing tells you why.

So I took the data to find out how much of the missing is real.

## The data

OpenSky Network collects ADS-B messages from receivers run by volunteers, more than 2500 members by their own count. In April they started publishing a cleaned flight list for the pandemic on Zenodo. I used version 0.2, published on May 2. It has 4 monthly CSV files, January to April. One row is one flight. Besides the callsign and timestamps it has 2 fields that matter here, `origin` and `destination`. They do not come from a schedule. OpenSky computes them from the trajectory on takeoff and approach and leaves the field empty when no airport is found.

A route for me is a directed pair of airports. It is regular if it had at least 8 flights from January 6 to March 1. The flights also had to fall in at least 6 of those 8 weeks. A route vanished if it has 0 flights in the window, April 6 to 26. The code is Python with pandas and one Poisson exponent.

Before counting I wrote down my guesses. The main one was that 30 to 50 percent of regular routes would be gone.

## The first number

Flights with both airports known went from 198,560 a week to 40,763, minus 79 percent. I guessed 60 to 70. Of 13,416 regular routes, 7,129 had no flights at all in the window. 53 percent. I had a sentence ready for it.

Then I checked if a zero is a zero. On the regular routes alone traffic fell by 81 percent. Say every route lost exactly that share. Then a route with 2 flights a week would often show 0 in 3 weeks by chance. The sum of that probability over all routes is 1,658, so almost a quarter of my "closed routes" could be routes that just got thin. I wrote that down and went on to the airports.

## Airports that went dark

Next I listed airports from regular routes that do not appear in any row of the window, not even with the other end empty. There were 373 of them and 1,555 vanished routes go through at least one.

Many of them look right. Paris Orly closed for passenger flights at the end of March and London City on March 25. Of the 389 callsigns that used to land at Orly, 6 show up in April and all of them land at Charles de Gaulle. London City's callsigns do not show up at all.

Next on the list were Cancún and Oklahoma City. Neither was closed in April as far as I know, but both went silent on the same day, February 28. That is weeks before anything closed in the US or Mexico. Oklahoma City had between 23 and 58 rows a day in the 2 weeks before and then 0. The 135 callsigns that used to land there kept flying in early March. The share of their rows with an empty destination went from 7 to 40 percent. For Cancún it went from 34 to 74 percent with about the same number of rows. As far as I can tell the planes were still landing there and nobody heard them land. Probably one or a few receivers went offline. Why 2 places 1900 km apart went silent on the same day I do not know, the dataset does not say. It is not a general processing failure, since the number of distinct airports per day stays flat around that date.

It took me a while to understand that for part of the list I had been mapping which receivers went offline. 49 airports disappeared before March 9 and 192 of my vanished routes run through them.

<figure class="fig">
<svg viewBox="0 0 680 348" role="img" aria-label="2 panels, February 14 to March 13, 2020. Bars are rows per day where the airport is origin or destination, the line is the share of rows with an empty destination among callsigns that landed there before February 28. Oklahoma City: rows a day with the airport 23…58 → 0, empty destination, its callsigns 7% → 40%. Cancún: rows a day with the airport 26…121 → 0, empty destination, its callsigns 34% → 74%. Both airports drop to 0 rows after February 28 while the empty share jumps.">
  <text x="60" y="24" class="f-label f-ink" style="font-size:12px">Oklahoma City (KOKC)</text>
  <line x1="60" y1="144" x2="620" y2="144" class="f-plain" style="stroke:var(--muted)"/>
  <text x="54.0" y="148.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="54.0" y="93.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="54.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="626.0" y="148.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0%</text>
  <text x="626.0" y="93.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">50%</text>
  <text x="626.0" y="38.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">100%</text>
  <rect x="61.0" y="70.7" width="17.3" height="73.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="80.3" y="94.5" width="17.3" height="49.5" style="fill:var(--muted);opacity:0.45"/>
  <rect x="99.6" y="101.8" width="17.3" height="42.2" style="fill:var(--muted);opacity:0.45"/>
  <rect x="118.9" y="92.7" width="17.3" height="51.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="138.2" y="59.7" width="17.3" height="84.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="157.6" y="85.3" width="17.3" height="58.7" style="fill:var(--muted);opacity:0.45"/>
  <rect x="176.9" y="56.0" width="17.3" height="88.0" style="fill:var(--muted);opacity:0.45"/>
  <rect x="196.2" y="68.8" width="17.3" height="75.2" style="fill:var(--muted);opacity:0.45"/>
  <rect x="215.5" y="37.7" width="17.3" height="106.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="234.8" y="50.5" width="17.3" height="93.5" style="fill:var(--muted);opacity:0.45"/>
  <rect x="254.1" y="48.7" width="17.3" height="95.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="273.4" y="52.3" width="17.3" height="91.7" style="fill:var(--muted);opacity:0.45"/>
  <rect x="292.7" y="50.5" width="17.3" height="93.5" style="fill:var(--muted);opacity:0.45"/>
  <rect x="312.0" y="39.5" width="17.3" height="104.5" style="fill:var(--muted);opacity:0.45"/>
  <rect x="331.3" y="68.8" width="17.3" height="75.2" style="fill:var(--muted);opacity:0.45"/>
  <path d="M69.7,135.5L89.0,136.1L108.3,132.7L127.6,134.5L146.9,129.5L166.2,134.4L185.5,137.7L204.8,142.7L224.1,137.7L243.4,131.3L262.8,138.0L282.1,135.7L301.4,139.0L320.7,138.5L340.0,129.8L359.3,97.0L378.6,89.6L397.9,96.7L417.2,97.7L436.6,101.0L455.9,101.5L475.2,103.1L494.5,101.8L513.8,106.6L533.1,104.7L552.4,97.3L571.7,100.4L591.0,102.8L610.3,96.3" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <line x1="349.7" y1="34" x2="349.7" y2="144" style="stroke:var(--ink);stroke-dasharray:3 3"/>
  <text x="353.7" y="44.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Feb 28</text>
  <text x="69.7" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.14</text>
  <text x="204.8" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.21</text>
  <text x="340.0" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.28</text>
  <text x="475.2" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">03.06</text>
  <text x="610.3" y="158.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">03.13</text>
  <text x="60" y="180" class="f-label f-ink" style="font-size:12px">Cancún (MMUN)</text>
  <line x1="60" y1="300" x2="620" y2="300" class="f-plain" style="stroke:var(--muted)"/>
  <text x="54.0" y="304.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="54.0" y="249.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">70</text>
  <text x="54.0" y="194.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">140</text>
  <text x="626.0" y="304.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0%</text>
  <text x="626.0" y="249.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">50%</text>
  <text x="626.0" y="194.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">100%</text>
  <rect x="61.0" y="253.6" width="17.3" height="46.4" style="fill:var(--muted);opacity:0.45"/>
  <rect x="80.3" y="247.4" width="17.3" height="52.6" style="fill:var(--muted);opacity:0.45"/>
  <rect x="99.6" y="241.9" width="17.3" height="58.1" style="fill:var(--muted);opacity:0.45"/>
  <rect x="118.9" y="249.7" width="17.3" height="50.3" style="fill:var(--muted);opacity:0.45"/>
  <rect x="138.2" y="245.0" width="17.3" height="55.0" style="fill:var(--muted);opacity:0.45"/>
  <rect x="157.6" y="237.1" width="17.3" height="62.9" style="fill:var(--muted);opacity:0.45"/>
  <rect x="176.9" y="220.6" width="17.3" height="79.4" style="fill:var(--muted);opacity:0.45"/>
  <rect x="196.2" y="229.3" width="17.3" height="70.7" style="fill:var(--muted);opacity:0.45"/>
  <rect x="215.5" y="211.2" width="17.3" height="88.8" style="fill:var(--muted);opacity:0.45"/>
  <rect x="234.8" y="204.9" width="17.3" height="95.1" style="fill:var(--muted);opacity:0.45"/>
  <rect x="254.1" y="226.1" width="17.3" height="73.9" style="fill:var(--muted);opacity:0.45"/>
  <rect x="273.4" y="240.3" width="17.3" height="59.7" style="fill:var(--muted);opacity:0.45"/>
  <rect x="292.7" y="226.9" width="17.3" height="73.1" style="fill:var(--muted);opacity:0.45"/>
  <rect x="312.0" y="232.4" width="17.3" height="67.6" style="fill:var(--muted);opacity:0.45"/>
  <rect x="331.3" y="279.6" width="17.3" height="20.4" style="fill:var(--muted);opacity:0.45"/>
  <path d="M69.7,265.1L89.0,252.9L108.3,263.9L127.6,258.6L146.9,257.6L166.2,262.1L185.5,262.6L204.8,266.5L224.1,271.2L243.4,266.5L262.8,261.3L282.1,255.2L301.4,265.6L320.7,271.4L340.0,227.8L359.3,214.9L378.6,219.4L397.9,220.2L417.2,219.1L436.6,218.0L455.9,215.9L475.2,219.7L494.5,215.5L513.8,218.9L533.1,219.5L552.4,217.6L571.7,222.5L591.0,216.2L610.3,215.8" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <line x1="349.7" y1="190" x2="349.7" y2="300" style="stroke:var(--ink);stroke-dasharray:3 3"/>
  <text x="353.7" y="200.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Feb 28</text>
  <text x="69.7" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.14</text>
  <text x="204.8" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.21</text>
  <text x="340.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">02.28</text>
  <text x="475.2" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">03.06</text>
  <text x="610.3" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">03.13</text>
  <rect x="60" y="328" width="18" height="12" style="fill:var(--muted);opacity:0.45"/>
  <text x="86" y="338" class="f-label f-muted" style="font-size:11px">rows a day with the airport</text>
  <line x1="330" y1="334" x2="352" y2="334" style="stroke:var(--accent);stroke-width:2"/>
  <text x="360" y="338" class="f-label f-muted" style="font-size:11px">empty destination, its callsigns</text>
</svg>
<figcaption>OpenSky flight list v0.2. Both airports disappear from the data after February 28. The callsigns that used to land there keep flying, but more and more of their rows have no destination: the landing was not heard.</figcaption>
</figure>

## The placebo that should have been empty

To see what this method finds when nothing happens, I ran it on February. The window was February 3 to 23. The base was January 6 to February 2, where regular meant at least 8 flights spread over at least 3 of the 4 weeks. I expected almost nothing. It found 371 vanished routes where chance predicts 2.

The biggest was New York LaGuardia to Waxhaw, about 30 flights a week. Waxhaw is a small airfield south of Charlotte. The same callsigns landed at Charlotte 252 times in the February window. So these routes never existed. The airport is guessed from the last part of the track. Sometimes the guess is a small field under the final turn to a big airport. When that stops, probably with a change of landing direction, the "route" is gone. London Heathrow to Alverca, an air base next to Lisbon, is the same story. So on top of dropping dark airports I added a second filter: both ends must be airports with scheduled flights in the OurAirports list.

With both filters February has 42 vanished routes out of 8,373, against 1.1 expected by chance. So February already had a small real signal. 17 of the 42 routes touch China if Hong Kong and Macau are counted. Shenzhen to Los Angeles is one of them.

## The clean count

For April the clean set has 8,240 regular routes between scheduled airports that are both visible in the window. 4,146 of them vanished, 50.3 percent. The headline barely moved from 53, which surprised me after all that filtering. 2,983 of the first 7,129 went through dark airports or airports without scheduled flights, mostly small fields under the approach path like Waxhaw. The share stayed high only because the filters also removed many routes that survived.

Domestic routes vanished in 23 percent of cases (882 of 3,836) and international ones in 74 percent (3,264 of 4,404), about 3 times more often. I guessed twice. Routes that survived fly at a median 0.30 of their winter frequency.

The thinning model still expects 686 zeros among the clean routes, but not evenly spread:

<figure class="fig">
<svg viewBox="0 0 680 298" role="img" aria-label="Clean April count by frequency in winter. For each class: regular routes, routes with 0 flights from April 6 to 26 and the number of zeros expected if every route lost the same 81 percent of flights. 1–2 a week: regular 756, vanished 554, expected by thinning 335. 2–7 a week: regular 2941, vanished 1991, expected by thinning 342. 7–21 a week: regular 2428, vanished 1163, expected by thinning 9. 21+ a week: regular 2115, vanished 438, expected by thinning 0.001.">
  <text x="120" y="42" text-anchor="end" class="f-label f-ink" style="font-size:12px">1–2 a week</text>
  <rect x="130" y="26" width="85.7" height="26" class="f-box" style="fill:none"/>
  <rect x="130" y="26" width="62.8" height="26" style="fill:var(--accent);opacity:0.75"/>
  <line x1="168.0" y1="20" x2="168.0" y2="58" style="stroke:var(--ink);stroke-width:2.5"/>
  <text x="223.7" y="38.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">554 of 756</text>
  <text x="223.7" y="52.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">expected by thinning: 335</text>
  <text x="120" y="104" text-anchor="end" class="f-label f-ink" style="font-size:12px">2–7 a week</text>
  <rect x="130" y="88" width="333.3" height="26" class="f-box" style="fill:none"/>
  <rect x="130" y="88" width="225.6" height="26" style="fill:var(--accent);opacity:0.75"/>
  <line x1="168.7" y1="82" x2="168.7" y2="120" style="stroke:var(--ink);stroke-width:2.5"/>
  <text x="471.3" y="100.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1991 of 2941</text>
  <text x="471.3" y="114.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">expected by thinning: 342</text>
  <text x="120" y="166" text-anchor="end" class="f-label f-ink" style="font-size:12px">7–21 a week</text>
  <rect x="130" y="150" width="275.2" height="26" class="f-box" style="fill:none"/>
  <rect x="130" y="150" width="131.8" height="26" style="fill:var(--accent);opacity:0.75"/>
  <line x1="131.5" y1="144" x2="131.5" y2="182" style="stroke:var(--ink);stroke-width:2.5"/>
  <text x="413.2" y="162.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1163 of 2428</text>
  <text x="413.2" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">expected by thinning: 9</text>
  <text x="120" y="228" text-anchor="end" class="f-label f-ink" style="font-size:12px">21+ a week</text>
  <rect x="130" y="212" width="239.7" height="26" class="f-box" style="fill:none"/>
  <rect x="130" y="212" width="49.6" height="26" style="fill:var(--accent);opacity:0.75"/>
  <line x1="131.5" y1="206" x2="131.5" y2="244" style="stroke:var(--ink);stroke-width:2.5"/>
  <text x="377.7" y="224.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">438 of 2115</text>
  <text x="377.7" y="238.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">expected by thinning: 0.001</text>
  <rect x="130" y="278" width="18" height="12" style="fill:var(--accent);opacity:0.75"/>
  <text x="154" y="288" class="f-label f-muted" style="font-size:11px">vanished</text>
  <rect x="250" y="278" width="18" height="12" class="f-box" style="fill:none"/>
  <text x="274" y="288" class="f-label f-muted" style="font-size:11px">regular</text>
  <line x1="390" y1="277" x2="390" y2="291" style="stroke:var(--ink);stroke-width:2.5"/>
  <text x="398" y="288" class="f-label f-muted" style="font-size:11px">expected by thinning</text>
</svg>
<figcaption>Routes between airports with scheduled flights, both seen in the window. Expected zeros: sum of exp(−λ·0.19·3) over the routes of the class, λ is flights a week in January and February.</figcaption>
</figure>

A route with 21 or more flights a week that now has none is a closure. 438 of them vanished where chance gives 0.001. Bengaluru to New Delhi had 261 flights a week in winter and none in April, which matches India stopping domestic flights on March 25. LaGuardia to Toronto had 146. For routes with 1 or 2 flights a week it is the opposite: 554 of 756 vanished and thinning alone explains 335.

## What I did not check

This version of the dataset has no 2019, so I cannot separate the usual season from the January to April change. The threshold of exactly 0 flights is arbitrary. New Delhi to Bengaluru had 1 flight in the window and does not count as vanished, while the opposite direction does. 232 clean vanished routes have a row in the window with the same callsign and an empty field where the missing airport should be. Some of them might still be flown and unheard. Mainland China is barely covered. Only 20 regular routes in my April base touch it, so the February signal there is a few routes. The scheduled flights flag comes from the current OurAirports list, so a small airport that lost or gained scheduled service is counted wrong. I did not look at cargo separately.

I will rerun this when the next version comes out with May, mostly to see which of the dark airports come back.
