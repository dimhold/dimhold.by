---
title: "54 threads waited for a connection and the database showed 9.7 of 10 as idle"
description: "I put a pool of 1 to 64 connections in front of PostgreSQL 9.3 and held each connection 20 ms longer than the query. 10 connections gave 458.8 requests per second with 0.42 of 2 cores busy, 54 threads stood in the queue and the statistics of the database showed queries of 0.90 ms."
date: 2014-01-26
lang: en
translationKey: pool-ceiling
tags: ["databases", "performance", "numbers"]
---

My load program has 64 threads and a pool of 10 connections to PostgreSQL. While it ran, a separate connection asked `pg_stat_activity` about those 10, roughly 75 times per run. On average 9.7 of them were `idle` and 0.26 were `active`. At the same time 54 threads were standing in the queue for a connection and waited 115 ms on average. The database used 0.38 of 2 cores.

I never calculated a pool size. I leave the default or copy a number from the previous config, it works and I forget about it. When something is slow I look at slow queries and at the CPU of the database.

The subject is not new. The PostgreSQL wiki has the page "Number Of Database Connections" with the formula `((core_count * 2) + effective_spindle_count)`. Goetz and his coauthors in "Java Concurrency in Practice" size a thread pool as cores × (1 + wait time / compute time). Below I also use Little's law, proved in 1961.

First I opened the jars of 4 Java pools with `javap` and read the defaults:

| library | max connections | waits for a free one |
|---|---|---|
| Commons DBCP 1.4 | 8 | without a limit |
| c3p0 0.9.2.1 | 15 | without a limit |
| HikariCP 1.2.8 | 60 | 5 s |
| Tomcat JDBC 7.0.50 | 100 | 30 s |

From 8 to 100 for the same job. With the first 2 a thread can stand in the queue forever and nobody gets an exception.

## The setup

PostgreSQL 9.3.2 built from source, `shared_buffers` 256 MB, pinned to 2 cores of a virtual machine where other jobs were running too. The table is `pgbench_accounts` with 1 million rows, 128 MB, all in memory. One request is a prepared SELECT that sums 4000 neighbouring rows and costs from 0.6 to 1.1 ms of CPU, depending on the variant. It comes from a C program on libpq with its own FIFO pool, on the same 2 cores. Its 64 threads send requests without pauses, 3 runs of 6 seconds per pool size, the first 2 seconds are thrown away. The numbers below are medians unless I name a single run.

There are 3 variants. The first one holds the connection only for the query. In the second one it is BEGIN, the query, 20 ms of sleep, COMMIT. Here the sleep stands for everything that happens while the connection is in hand, like a call to another service. In the third the thread returns the connection right after the query and then sleeps the same 20 ms.

## N divided by the hold time

The second variant, where the connection is held during the sleep:

| pool | requests/s | wait for a connection, ms | busy cores |
|---|---|---|---|
| 1 | 46.5 | 1354 | 0.05 |
| 8 | 372.8 | 150 | 0.37 |
| 10 | 458.8 | 118 | 0.42 |
| 16 | 702.5 | 68 | 0.72 |
| 32 | 1413.5 | 23 | 1.14 |
| 64 | 2219.0 | 0 | 1.77 |

One connection is held for 21.47 ms, so it can serve 46.5 requests per second and no more. With 10 it is 10 times more within 2%, with 16 it is 5.7% below the straight line. Little's law gives the same from the other side: 458.8 per second × 21.74 ms is 9.97 connections in use.

The database says everything is fine. Its own mean time for this query is 0.90 ms and its processes take 21% of the 2 cores. A faster server would take something off that 1 ms, but the other 20 ms do not depend on it. The DBCP default of 8 means about 373 requests per second on this machine.

In a transaction there is at least a trace, 9.62 connections of 10 are `idle in transaction`. I also ran the same without BEGIN and COMMIT, in autocommit. The ceiling is almost the same, 468.5 per second, but the state is just `idle`. A connection nobody needs looks the same. The first paragraph is about this run.

<figure class="fig">
<svg viewBox="0 0 680 336" role="img" aria-label="Closed loop, 64 threads and a pool of 10. In the pool 10 threads hold a connection and 54 wait. Below, what pg_stat_activity shows for the same 10 connections on average: 0.26 active and 9.74 idle when the connection is held in autocommit, 0.22 active, 0.15 idle and 9.62 idle in transaction when it is held inside a transaction, 3.31 active and 6.69 idle when it is returned right after the query.">
  <text x="20.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">64 threads, pool of 10</text>
  <rect x="20.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="40.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="60.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="80.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="100.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="120.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="140.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="160.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="180.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="200.0" y="30.0" width="15.0" height="15.0" style="fill:var(--accent);stroke:none"/>
  <rect x="220.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="240.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="260.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="280.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="320.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="360.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="380.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="400.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="440.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="460.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="500.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="520.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="540.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="560.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="580.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="600.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="620.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="640.0" y="30.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="20.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="40.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="80.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="100.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="140.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="160.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="200.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="220.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="240.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="260.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="280.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="320.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="360.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="380.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="400.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="440.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="460.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="500.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="520.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="540.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="560.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="580.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="600.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="620.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="640.0" y="50.0" width="15.0" height="15.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="20.0" y="78.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="38.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">10 hold a connection</text>
  <rect x="250.0" y="78.5" width="11.0" height="11.0" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="268.0" y="88.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">54 wait for one</text>
  <line x1="20" y1="108" x2="660" y2="108" class="f-plain"/>
  <text x="20.0" y="128.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">pg_stat_activity</text>
  <text x="170.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">held, autocommit</text>
  <rect x="180.0" y="142.0" width="12.0" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="192.0" y="142.0" width="448.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="180.0" y="182.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0.26 active, 9.74 idle</text>
  <text x="170.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">held, transaction</text>
  <rect x="180.0" y="198.0" width="10.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.3" y="198.0" width="6.8" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="197.1" y="198.0" width="442.9" height="26.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="180.0" y="238.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0.22 active, 0.15 idle, 9.62 idle in transaction</text>
  <text x="170.0" y="272.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">returned at once</text>
  <rect x="180.0" y="254.0" width="152.1" height="26.0" style="fill:var(--accent);stroke:none"/>
  <rect x="332.1" y="254.0" width="307.9" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="180.0" y="294.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3.31 active, 6.69 idle</text>
  <rect x="180.0" y="312.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="198.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">active</text>
  <rect x="290.0" y="312.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="308.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">idle</text>
  <rect x="380.0" y="312.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="398.0" y="322.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">idle in transaction</text>
</svg>
<figcaption>Squares are threads around the pool, bars are the states that pg_stat_activity reports, averaged over about 75 looks per run. Each bar is the median of 3 runs. The squares show the 2 cases where the connection is held. In the third one the queue was under 2 threads.</figcaption>
</figure>

With 2 connections the third variant gave 2178 requests per second, 4.7 times more than the second one with 10. Even 1 connection gave 1343.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Throughput against pool size on logarithmic axes. Holding the connection for 20 ms more gives a straight line: 46.5 requests per second with 1 connection, 372.8 with 8, 458.8 with 10, 1413.5 with 32 and 2219 with 64. Holding it for the query only gives 1376 with 1, 3033 with 3 and then a slow fall to 2546 with 64. Doing the 20 ms after the return gives 1343, 2178, 2722 and stays near 2650.">
  <line x1="70" y1="287.4" x2="650" y2="287.4" class="f-plain"/>
  <text x="62.0" y="291.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="248.3" x2="650" y2="248.3" class="f-plain"/>
  <text x="62.0" y="252.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="209.1" x2="650" y2="209.1" class="f-plain"/>
  <text x="62.0" y="213.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="70" y1="170.0" x2="650" y2="170.0" class="f-plain"/>
  <text x="62.0" y="174.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="70" y1="130.9" x2="650" y2="130.9" class="f-plain"/>
  <text x="62.0" y="134.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="70" y1="91.7" x2="650" y2="91.7" class="f-plain"/>
  <text x="62.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1600</text>
  <line x1="70" y1="52.6" x2="650" y2="52.6" class="f-plain"/>
  <text x="62.0" y="56.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3200</text>
  <line x1="70.0" y1="300" x2="70.0" y2="305" class="f-plain"/>
  <text x="70.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="166.7" y1="300" x2="166.7" y2="305" class="f-plain"/>
  <text x="166.7" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="263.3" y1="300" x2="263.3" y2="305" class="f-plain"/>
  <text x="263.3" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="360.0" y1="300" x2="360.0" y2="305" class="f-plain"/>
  <text x="360.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <line x1="456.7" y1="300" x2="456.7" y2="305" class="f-plain"/>
  <text x="456.7" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <line x1="553.3" y1="300" x2="553.3" y2="305" class="f-plain"/>
  <text x="553.3" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">32</text>
  <line x1="650.0" y1="300" x2="650.0" y2="305" class="f-plain"/>
  <text x="650.0" y="318.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="360.0" y="336.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">connections in the pool</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">requests per second</text>
  <line x1="70.0" y1="291.4" x2="650.0" y2="56.6" style="stroke:var(--muted);stroke-width:1.2;stroke-dasharray:5 4;fill:none"/>
  <polyline points="70.0,100.3 166.7,77.7 223.2,55.6 263.3,60.3 360.0,60.4 456.7,61.1 553.3,60.6 650.0,65.5" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <circle cx="70.0" cy="100.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="166.7" cy="77.7" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="223.2" cy="55.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="263.3" cy="60.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="360.0" cy="60.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="456.7" cy="61.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="553.3" cy="60.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="650.0" cy="65.5" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,101.6 166.7,74.3 223.2,61.7 263.3,62.3 360.0,62.7 391.1,62.9 456.7,63.8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="70.0" cy="101.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="166.7" cy="74.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="223.2" cy="61.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="263.3" cy="62.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="360.0" cy="62.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="391.1" cy="62.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="456.7" cy="63.8" r="3" style="fill:var(--ink);stroke:none"/>
  <polyline points="70.0,291.5 166.7,253.0 263.3,213.3 360.0,174.0 391.1,162.3 456.7,138.2 553.3,98.7 609.9,82.0 650.0,73.3" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="70.0" cy="291.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="166.7" cy="253.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="263.3" cy="213.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="360.0" cy="174.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="391.1" cy="162.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="456.7" cy="138.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="553.3" cy="98.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="609.9" cy="82.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="650.0" cy="73.3" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="281.3" y="229.4" text-anchor="start" class="f-label f-accent" style="font-size:10px">query + 20 ms, connection held</text>
  <text x="171.7" y="108.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">query, return, then 20 ms</text>
  <text x="263.3" y="40.6" text-anchor="start" class="f-label f-muted" style="font-size:10px">query only</text>
</svg>
<figcaption>Requests per second, 64 threads, medians of 3 runs. Dashed line: N / 21.47 ms.</figcaption>
</figure>

For 2 cores and cached data the wiki formula says 4 connections. With the sleep inside, 4 connections are 185.8 requests per second. The page does say "actively doing work" and I would have skipped these words. It also warns that version 9.2 may need another formula. The Goetz formula with my 0.92 ms of CPU and 20.8 ms of everything else gives 47. I measured 48 and it was 1900.5 per second with 1.62 cores busy.

## My guesses

I wrote down what I expected before the first run. For the first variant, query only, I was sure that 2 connections are enough for 2 cores. It was 2053 requests per second with 2 and 3033 with 3. With 2 connections the database used only 1.31 cores. I think a connection stands empty while the next thread wakes up, so the third one covers the gap. After 3 nothing grew, at 64 it was 2546. The runs at 64 were uneven, from 1536 to 2639.

The second guess was worse. With 64 connections there is no queue in the pool, so it must be inside the database. I expected the database to report slow queries. The client saw 25.2 ms per query, `pg_stat_statements` said 3.4. With one connection it was 0.71 against 0.63. `pg_stat_activity` showed about 10 active backends of 64. As far as I understand, a backend that has not got a core has not read the query yet. For the statistics that query has not started. `pg_stat_statements` would not have led me to this queue.

## Close to the ceiling

In a closed loop a thread does not send anything while it waits, so the queue can't grow past 54. So I added a mode where requests arrive at random moments at a given rate, whoever is waiting. Pool of 10, the sleep inside the transaction, 25 seconds per run, 3 runs per point.

<figure class="fig">
<svg viewBox="0 0 680 354" role="img" aria-label="Pool of 10 connections, Poisson arrivals. Mean wait for a connection at 25, 50, 70, 80, 90, 95, 99 and 105 percent of the measured ceiling: 0.14, 0.28, 3.7, 2.4, 10.7, 15.0, 159 and 596 ms. Busy cores of the database in the same runs: 0.12, 0.20, 0.31, 0.30, 0.37, 0.35, 0.40 and 0.40 out of 2.">
  <line x1="70" y1="179.5" x2="650" y2="179.5" class="f-plain"/>
  <text x="62.0" y="183.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.1</text>
  <line x1="70" y1="144.8" x2="650" y2="144.8" class="f-plain"/>
  <text x="62.0" y="148.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="70" y1="110.0" x2="650" y2="110.0" class="f-plain"/>
  <text x="62.0" y="114.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="70" y1="75.2" x2="650" y2="75.2" class="f-plain"/>
  <text x="62.0" y="79.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="40.5" x2="650" y2="40.5" class="f-plain"/>
  <text x="62.0" y="44.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="70" y1="306.0" x2="650" y2="306.0" class="f-plain"/>
  <text x="62.0" y="310.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="271.0" x2="650" y2="271.0" class="f-plain"/>
  <text x="62.0" y="275.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="70" y1="236.0" x2="650" y2="236.0" class="f-plain"/>
  <text x="62.0" y="240.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">mean wait for a connection, ms</text>
  <text x="10.0" y="224.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">busy cores of the database, of 2</text>
  <line x1="585.6" y1="30" x2="585.6" y2="306" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <polyline points="102.2,174.5 263.3,164.1 392.2,125.1 456.7,131.4 521.1,109.0 553.3,103.9 579.1,68.2 617.8,48.3" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <polyline points="102.2,301.9 263.3,299.0 392.2,295.1 456.7,295.5 521.1,292.9 553.3,293.7 579.1,292.1 617.8,291.8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <line x1="102.2" y1="175.8" x2="102.2" y2="174.3" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="102.2" cy="174.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="102.2" cy="301.9" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="102.2" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="263.3" y1="167.0" x2="263.3" y2="157.9" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="263.3" cy="164.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="263.3" cy="299.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="263.3" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="392.2" y1="132.1" x2="392.2" y2="120.8" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="392.2" cy="125.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="392.2" cy="295.1" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="392.2" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">70</text>
  <line x1="456.7" y1="131.6" x2="456.7" y2="131.1" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="456.7" cy="131.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="456.7" cy="295.5" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="456.7" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="521.1" y1="116.5" x2="521.1" y2="104.0" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="521.1" cy="109.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="521.1" cy="292.9" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="521.1" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="553.3" y1="108.5" x2="553.3" y2="95.2" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="553.3" cy="103.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="553.3" cy="293.7" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="553.3" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">95</text>
  <line x1="579.1" y1="93.4" x2="579.1" y2="50.3" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="579.1" cy="68.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="579.1" cy="292.1" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="579.1" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">99</text>
  <line x1="617.8" y1="52.4" x2="617.8" y2="37.0" style="stroke:var(--accent);stroke-width:1"/>
  <circle cx="617.8" cy="48.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="617.8" cy="291.8" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="617.8" y="324.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">105</text>
  <text x="102.2" y="164.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.14</text>
  <text x="263.3" y="140.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.28</text>
  <text x="456.7" y="161.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2.4</text>
  <text x="545.3" y="95.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">15.0</text>
  <text x="571.1" y="62.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">159</text>
  <text x="625.8" y="58.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">596</text>
  <text x="263.3" y="291.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0.20</text>
  <text x="625.8" y="285.8" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0.40</text>
  <text x="360.0" y="344.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">arrival rate, % of the ceiling (458.8 per second)</text>
</svg>
<figcaption>Pool of 10, medians of 3 runs of 25 seconds, whiskers show the lowest and the highest run. The wait has a logarithmic scale.</figcaption>
</figure>

Between 80% and 99% of the ceiling the mean wait for a connection grew from 2.4 to 159 ms. The query went from 0.94 to 1.16 ms and the CPU from 0.30 to 0.40 cores. My forecast allowed the CPU to grow 1.3 times and it was 1.32, a small miss. At 105% the wait kept growing until the end of the run. Most of the 596 ms there is the length of the run.

The 3 runs at 99% gave 30, 159 and 520 ms. In the worst one the query took 1.56 ms on average, against 1.16 and 1.05 in the other 2. The connection was held for 22.59 ms, so the pool could serve 443 requests per second and 456 were arriving. Why the query got slower I do not know.

The points at 70% are strange. At this rate the wait is 3.7 ms, more than at 80%, with single waits up to 107 ms. The queue that I sampled separately was 0.85 and Little's law gives 1.17. At 99% the same 2 numbers are 72.7 and 73.4. Maybe other jobs took the cores for a moment and my sampler stopped together with the program, but I did not find the cause.

## What I did not check

Only reads, no commits that wait for a disk and no row locks. The closed runs are short, 4 seconds of counting each. I always sleep 20 ms, with a varying time the wait near the ceiling should be longer. The client and the other jobs share the cores with the database and there is no network. I wrote the pool myself, the 4 libraries did not run. I also can't split the 25 ms at 64 connections between the backend waiting for a core and the client.
