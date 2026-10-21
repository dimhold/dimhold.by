---
title: "My README said H2 cannot reproduce my Postgres numbers. Over TCP it landed next to local Postgres"
description: "The README of my preview benchmark says H2 in memory does not reproduce what a write and discard costs a real database. I ran the unchanged harness on H2 2.3.232 and on local PostgreSQL 16.14. H2 gave the same verdict with a penalty of 0.5 ms against 0.8 to 1.2. H2 as a TCP server landed within 0.1 ms of local Postgres on a quiet machine. A proxy that delays each of the 3 round trips reaches the 6 ms of the README at about 1.6 ms per round trip. The 10 seconds are true from the second run, the first one took 24 s."
date: 2026-10-11
lang: en
translationKey: preview-cost-h2
tags: ["databases", "performance"]
---
In August I put a small benchmark on GitHub, [`preview-cost`](https://github.com/dimhold/preview-cost). It asks what a live preview costs if you build it on a transaction rollback. The preview writes the slider's overrides, reads the model back, computes and rolls back. The other strategy is a copy in memory that never touches the database. On Postgres 16 in Docker the rollback lost all 4,500 pairs, by 6.16 ms at 40 plans.

The run section of the README makes 2 promises. H2 in Postgres mode is the default, so it promises a run in 10 seconds "with nothing installed". The numbers in the table come from real Postgres, "because H2 in memory does not reproduce what a write and discard costs a real database."

I wrote the second sentence without ever looking at an H2 run closely. It is what everybody says about H2 and I say it too when somebody wants to test against it. Use the real database, the embedded one lies. So the default mode of my repository was a mode the same README says does not reproduce the numbers. This time I ran it.

## 10 seconds

I cloned the repository at commit `26dd519` into an empty directory with an empty Gradle cache, on a VM with 4 vCPU and Gradle 9.8.0. There is no Gradle wrapper in the repository, so "nothing installed" already means JDK 25 plus Gradle. To be fair, the README says so in the sentence right before it.

With only JDK 21 on the machine the build stops after 16 s. The toolchain asks for version 25 and Gradle has no repository to download it from. With Temurin 25.0.4.1 the first `gradle run` on the empty cache took 24 s. The next 3 runs took 6 to 7 s each. So 10 seconds is true from the second run. Somebody who clones the repository for the first time waits 24 s.

## What H2 says

The default run is 5 fresh JVMs with 300 paired previews each. I ran the unchanged `Bench` against H2 2.3.232 in memory and against PostgreSQL 16.14 installed locally on the same VM with pgjdbc 42.7.4. Every size ran twice. The table shows the median of rollback minus copy.

| plans | H2 in memory | PostgreSQL 16.14, local | README, Postgres in Docker |
|---|---|---|---|
| 10 | 0.50 / 0.54 ms | 0.78 / 0.76 ms | 6.54 ms |
| 40 | 0.50 / 0.46 ms | 0.91 / 0.83 ms | 6.16 ms |
| 120 | 0.49 / 0.47 ms | 1.22 / 1.18 ms | 7.02 ms |

On every backend and size the rollback was slower in 99.4% to 100% of pairs. H2 gives the same verdict as the README, with a number 12 to 15 times smaller. Local Postgres is 1.4 to 2.6 times away from H2 while the README Postgres is 6 to 9 times away from local Postgres.

I expected H2 to make the rollback nearly free, because nothing leaves the process. It does not. I split the rollback preview into its steps in one JVM. On H2 in memory the update of 4 rows alone took 238 to 291 µs. At 40 plans that is about 4 times the whole calculation, which took 59 µs.

## Where the difference sits

H2 can also run as a server. It is the same engine with the same storage in memory. But the driver talks to it over a TCP socket on localhost, the way pgjdbc talks to Postgres. I added it to the grid next to the others, together with H2 on a file on disk. The file landed on H2 in memory, 0.49 to 0.59 ms, so it is not in the chart.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Horizontal bars, 3 groups for 10, 40 and 120 plans. Each group shows the median penalty of the rollback preview over the in memory copy. 10 plans: H2 in memory 0.50 / 0.54, H2 over TCP 0.84 / 0.83, local PostgreSQL 0.78 / 0.76, README 6.54 ms; 40 plans: H2 in memory 0.50 / 0.46, H2 over TCP 0.82 / 0.82, local PostgreSQL 0.91 / 0.83, README 6.16 ms; 120 plans: H2 in memory 0.49 / 0.47, H2 over TCP 1.22 / 1.25, local PostgreSQL 1.22 / 1.18, README 7.02 ms. H2 over TCP and local Postgres are within 0.1 ms of each other at every size, the README numbers from Postgres in Docker are 6 to 9 times larger.">
  <line x1="523.3333333333333" y1="22" x2="523.3333333333333" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="470" y1="22" x2="470" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="416.66666666666663" y1="22" x2="416.66666666666663" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="363.33333333333337" y1="22" x2="363.33333333333337" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="310" y1="22" x2="310" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="256.6666666666667" y1="22" x2="256.6666666666667" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="203.33333333333334" y1="22" x2="203.33333333333334" y2="256" class="f-line" style="opacity:0.25"/>
  <line x1="150" y1="22" x2="150" y2="256" class="f-line" style="opacity:0.25"/>
  <text x="10" y="66" class="f-mono f-ink" style="font-size:12px">10 plans</text>
  <rect x="150" y="30" width="27.7" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="183.7" y="41" class="f-mono f-ink" style="font-size:11px">0.50 / 0.54  H2 in memory</text>
  <rect x="150" y="46" width="44.5" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="200.5" y="57" class="f-mono f-ink" style="font-size:11px">0.84 / 0.83  H2 over TCP</text>
  <rect x="150" y="62" width="41.1" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="197.1" y="73" class="f-mono f-ink" style="font-size:11px">0.78 / 0.76  PostgreSQL, local</text>
  <rect x="150" y="78" width="348.8" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="89" class="f-mono f-muted" style="font-size:11px">6.54  README, Docker</text>
  <text x="10" y="144" class="f-mono f-ink" style="font-size:12px">40 plans</text>
  <rect x="150" y="108" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="119" class="f-mono f-ink" style="font-size:11px">0.50 / 0.46  H2 in memory</text>
  <rect x="150" y="124" width="43.7" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="199.7" y="135" class="f-mono f-ink" style="font-size:11px">0.82 / 0.82  H2 over TCP</text>
  <rect x="150" y="140" width="46.4" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="202.4" y="151" class="f-mono f-ink" style="font-size:11px">0.91 / 0.83  PostgreSQL, local</text>
  <rect x="150" y="156" width="328.5" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="167" class="f-mono f-muted" style="font-size:11px">6.16  README, Docker</text>
  <text x="10" y="222" class="f-mono f-ink" style="font-size:12px">120 plans</text>
  <rect x="150" y="186" width="25.6" height="13" style="fill:var(--accent);fill-opacity:0.45"/>
  <text x="181.6" y="197" class="f-mono f-ink" style="font-size:11px">0.49 / 0.47  H2 in memory</text>
  <rect x="150" y="202" width="65.9" height="13" style="fill:var(--accent);fill-opacity:0.9"/>
  <text x="221.9" y="213" class="f-mono f-ink" style="font-size:11px">1.22 / 1.25  H2 over TCP</text>
  <rect x="150" y="218" width="64.0" height="13" style="fill:var(--ink);fill-opacity:0.9"/>
  <text x="220.0" y="229" class="f-mono f-ink" style="font-size:11px">1.22 / 1.18  PostgreSQL, local</text>
  <rect x="150" y="234" width="374.4" height="13" style="fill:none;stroke:var(--muted);stroke-dasharray:3 2"/>
  <text x="156" y="245" class="f-mono f-muted" style="font-size:11px">7.02  README, Docker</text>
  <text x="150" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="203.33333333333334" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="256.6666666666667" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="310" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="363.33333333333337" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="416.66666666666663" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="470" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="523.3333333333333" y="270" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150" y="14" class="f-mono f-muted" style="font-size:11px">rollback minus copy, ms (2 runs each)</text>
</svg>
<figcaption>Each bar is the mean of 2 passes, the label shows both. H2 over TCP lands on local Postgres at every size. The README bar is one number from August.</figcaption>
</figure>

H2 over TCP gave 0.84 / 0.83, 0.82 / 0.82 and 1.22 / 1.25 ms. That is within 0.1 ms of local Postgres at every size, including the rise at 120 plans. So on this harness most of the gap between H2 and Postgres goes with the socket and the server behind it. My sentence did not mention either. I checked it again on the same VM while another job was loading it. Then H2 over TCP sat 0.04 to 0.23 ms above Postgres at 40 plans, so the 0.1 ms is from a quiet machine.

The write and the discard differ less than I thought. On H2 in memory the update took 238 to 291 µs, on Postgres 312 to 389 µs. For the rollback step it was 78 to 90 µs against 188 to 205 µs, where Postgres also pays a round trip.

Most of the rise with plans comes from the read back. Each preview reads every field of the model, 42 rows at 10 plans and 482 at 120. On Postgres that read took 387 µs and 1,006 µs. H2 in memory hands the same rows over in 128 and 174 µs, I think because no bytes cross a socket. My README called the overhead "a constant" and made it the main finding. On local Postgres it grew by about half, from 0.76 to 0.78 ms at 10 plans to 1.18 to 1.22 ms at 120.

## Round trips

A rollback preview on Postgres is 3 round trips: the batch of 4 updates, the select and the rollback. I counted them with a small proxy between the driver and the database. 100 previews added 300 writes from the client to the 12 writes that the setup with its schema and seed rows took without any preview.

The same proxy can hold every client write for a fixed time before passing it on. That is a crude model of a slower path to the database. I ran the unchanged `Bench` through it at 40 plans with 5 different delays.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="A line chart at 40 plans. Horizontal axis: delay added by a proxy to every client write, 0 to 2000 microseconds. Vertical axis: median penalty in milliseconds. Measured points: 0 µs 1.12 ms, 250 µs 2.12 ms, 500 µs 2.85 ms, 1000 µs 4.40 ms, 2000 µs 7.52 ms. A dashed line shows the 0 delay point plus 3 times the delay. Without the proxy the penalty was 0.83 to 0.91 ms. A horizontal dashed line marks 6.16 ms from the README.">
  <line x1="70" y1="230" x2="600" y2="230" class="f-line" style="opacity:0.25"/>
  <text x="62" y="234" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="177.5" x2="600" y2="177.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="181.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="70" y1="125" x2="600" y2="125" class="f-line" style="opacity:0.25"/>
  <text x="62" y="129" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="70" y1="72.5" x2="600" y2="72.5" class="f-line" style="opacity:0.25"/>
  <text x="62" y="76.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <line x1="70" y1="20" x2="600" y2="20" class="f-line" style="opacity:0.25"/>
  <text x="62" y="24" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="70" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="136.25" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="202.5" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="335" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="600" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <text x="335" y="266" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">delay added to every round trip, µs</text>
  <text x="70" y="12" class="f-mono f-muted" style="font-size:11px">penalty, ms</text>
  <line x1="70" y1="68.29999999999998" x2="600" y2="68.29999999999998" class="f-line" style="stroke-dasharray:5 3"/>
  <text x="76" y="62.29999999999998" class="f-mono f-ink" style="font-size:11px">README, 40 plans: 6.16</text>
  <line x1="70" y1="200.6" x2="600" y2="43.099999999999994" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="449" y="106.35" class="f-mono f-muted" style="font-size:11px">+3 × delay</text>
  <line x1="64" y1="208.2125" x2="64" y2="206.1125" style="stroke:var(--ink);stroke-width:6"/>
  <text x="122" y="218.6" class="f-mono f-muted" style="font-size:11px">(no proxy: 0.83-0.91)</text>
  <polyline points="70.0,200.6 136.3,174.3 202.5,155.2 335.0,114.5 600.0,32.6" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="200.6" r="4" style="fill:var(--accent)"/>
  <circle cx="136.3" cy="174.3" r="4" style="fill:var(--accent)"/>
  <text x="128.3" y="166.3" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2.12</text>
  <circle cx="202.5" cy="155.2" r="4" style="fill:var(--accent)"/>
  <text x="194.5" y="147.2" text-anchor="end" class="f-mono f-accent" style="font-size:12px">2.85</text>
  <circle cx="335.0" cy="114.5" r="4" style="fill:var(--accent)"/>
  <text x="327.0" y="106.5" text-anchor="end" class="f-mono f-accent" style="font-size:12px">4.40</text>
  <circle cx="600.0" cy="32.6" r="4" style="fill:var(--accent)"/>
  <text x="592.0" y="24.6" text-anchor="end" class="f-mono f-accent" style="font-size:12px">7.52</text>
  <text x="80" y="218.6" class="f-mono f-accent" style="font-size:12px">1.12</text>
</svg>
<figcaption>After the first delay the measured penalty runs about 0.25 ms above the 3 round trips line. The README level is reached between 1000 and 2000 µs per round trip.</figcaption>
</figure>

Without a delay the proxy itself added about 0.2 to 0.3 ms in that run, 1.12 ms against 0.83 to 0.91 directly. The first 250 µs of delay added 1 ms, more than 3 times 250. After that the line goes up about 3 µs for every microsecond of delay, which is the 3 round trips. The extra 0.25 ms is probably the proxy's own wait overshooting each time it sleeps, but I did not measure that separately. At 2 ms per round trip the penalty was 7.52 ms, a bit above the README numbers.

Between the measured points at 1000 and 2000 µs, 6.16 ms falls at about 1.6 ms per round trip. This is only arithmetic. I don't have the August setup here. This harness reaches the README numbers at a round trip of that size, but I can't say Docker on that machine had one.

## What I would change in the README

The 10 seconds can stay, with a note that the first run takes about 25. The H2 sentence is wrong in its reason. H2 in memory gives the same verdict as Postgres with a number within 3 times of a local Postgres. It has no socket and H2 in server mode adds one back. The results table should say which Postgres was measured and how far away it was. On my numbers the distance is most of the 6 ms.

The conclusion of the original README does not move. 1 ms or 6 ms behind a 400 ms debounce is invisible to the user. The cost that matters is the rows written and locked for every preview.

## What I did not check

I did not run Docker at all, on any machine. Concurrency is also missing, which the README already names as the next thing to build and which is where the locks start to cost. H2 was only 2.3.232 and the driver only pgjdbc 42.7.4. The grid ran twice and the proxy series once. For the step split I used one JVM per cell, so its microseconds are rough. On this VM the calculation is also up to 2.6 times faster than on the August machine. The copy in memory takes 0.17 ms at 120 plans against 0.45 in the README. The calculation cancels in the difference, because both sides of a pair run it. But the driver and the database run on the same CPU, so on a slower machine my 0.9 ms would probably grow too.
