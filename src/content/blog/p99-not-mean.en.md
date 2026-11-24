---
title: "The same server showed a p99 of 4 ms and of 162 ms"
description: "I stopped an HTTP server 8 times for 200 ms and measured it with 3 clients. The usual send and wait loop got a p99 of 3.87 ms, a client working by the clock got 161.84 ms. HdrHistogram repaired the first log to 152.83 ms. Averaging p99 over 1 s windows gave 42.0 ms instead of 153.1."
date: 2017-01-29
lang: en
translationKey: p99-not-mean
tags: ["performance", "statistics", "networking"]
---

I stopped a small HTTP server 8 times in 40 seconds, each time for 200 ms, with the same signal that `kill -STOP` sends. My load loop made 3,810 requests and printed a mean of 2.83 ms and a p99 of 3.87 ms. It looks like a healthy server. Another client sent 100 requests per second by the clock and did not wait for answers. With the same schedule of pauses it got a p99 of 161.84 ms.

I have written this loop many times. Take the time, send, wait, take the time again, put the difference in a list, sort the list, look at position 99%. I knew the advice to look at p99 instead of the mean and I followed it. I never asked what the loop does while the server is silent.

The question has an old answer. Gil Tene calls it coordinated omission and has been giving the talk "How NOT to Measure Latency" since 2012. wrk2 and HdrHistogram are also his. The simple check that people retell after the talk is to press Ctrl-Z in the middle of a test, my script does the same. But I wanted numbers from my own loop.

## Setup

The server is `com.sun.net.httpserver` on OpenJDK 8 with 64 threads. Its handler sleeps 2 ms in place of a database and returns 512 bytes. A short Python script sends SIGSTOP and SIGCONT on schedule, the real pauses lasted from 200.2 to 204.3 ms. The client is 90 lines of Java on raw sockets. For every request it writes when it should have been sent, when it was sent and when the answer was complete. All of this lives on one 2-core virtual machine, so the machine has its own noise.

The first run without any pauses gave a median of 42,998 µs where I expected 2 thousand. Only 117 requests fit in 5 seconds. The JDK server sends headers and body separately, Nagle's algorithm keeps the second packet until the ACK and the other side delays the ACK for about 40 ms. JDK-6968351 describes it for Java 6 on Windows, my Linux machine does the same. With `-Dsun.net.httpserver.nodelay=true` the median became 2.3 ms. A smaller delay of this kind I would have taken for the server itself.

## Where the stopwatch starts

There are 3 clients. `closed` is my usual loop on one connection, the next request leaves 10 ms after the previous one was sent or as soon as the answer comes. It never catches up. `paced` also has one connection but follows a schedule. After a delay it sends the overdue requests at once. `open` has 64 connections and every request leaves at its own moment.

| client, latency counted from | requests | mean, ms | p99, ms | max, ms | slower than 50 ms |
|---|---|---|---|---|---|
| closed, sending | 3,810 | 2.83 | 3.87 | 202.77 | 8 |
| paced, sending | 4,000 | 3.01 | 9.80 | 202.46 | 8 |
| paced, schedule | 4,000 | 8.77 | 171.78 | 202.54 | 179 |
| open, schedule | 4,000 | 7.21 | 161.84 | 205.44 | 129 |

<figure class="fig">
<svg viewBox="0 0 680 392" role="img" aria-label="Pause number 3 in 2 separate runs, 1 dot per request, latency against the moment of sending. The closed loop has a single slow dot at 202.8 ms and nothing for the rest of the pause. The open client has 20 requests going down from 203 ms to 16 ms in steps of 10 ms.">
  <rect x="160.0" y="36" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="166.0" x2="660" y2="166.0" class="f-plain"/>
  <text x="52.0" y="170.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="106.9" x2="660" y2="106.9" class="f-plain"/>
  <text x="52.0" y="110.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="47.8" x2="660" y2="47.8" class="f-plain"/>
  <text x="52.0" y="51.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="75.9" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="92.7" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="109.5" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.3" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.2" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="46.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="498.0" cy="163.8" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="514.8" cy="163.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="531.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="548.5" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="565.3" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="582.1" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="598.9" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="615.8" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="632.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="649.4" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="26.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">closed loop</text>
  <text x="326.7" y="26.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">server stopped</text>
  <text x="660.0" y="26.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">latency, ms</text>
  <rect x="160.0" y="212" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="342.0" x2="660" y2="342.0" class="f-plain"/>
  <text x="52.0" y="346.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="282.9" x2="660" y2="282.9" class="f-plain"/>
  <text x="52.0" y="286.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="223.8" x2="660" y2="223.8" class="f-plain"/>
  <text x="52.0" y="227.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="60.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="76.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="93.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="110.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="221.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="176.7" cy="226.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="193.3" cy="231.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="210.0" cy="237.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="226.7" cy="243.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="243.3" cy="249.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="260.0" cy="255.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="276.7" cy="261.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="293.3" cy="267.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="271.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="326.7" cy="277.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="343.3" cy="283.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="360.0" cy="291.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="376.7" cy="296.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="393.3" cy="302.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="410.0" cy="306.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="426.7" cy="314.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.3" cy="320.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="460.0" cy="326.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="476.7" cy="332.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="493.3" cy="338.1" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="510.0" cy="339.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="526.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="560.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="576.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="593.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="626.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="643.3" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="660.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">open, by the clock</text>
  <text x="326.7" y="202.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">server stopped</text>
  <text x="660.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">latency, ms</text>
  <text x="76.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-50</text>
  <text x="160.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="243.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="326.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="410.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="493.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="576.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="650.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="360.0" y="380.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ms since the slowest request was sent</text>
</svg>
<figcaption>Pause number 3 in 2 separate runs. The closed loop wrote down 1 slow request, the client that works by the clock wrote down 20.</figcaption>
</figure>

The pause stops the loop together with the server. One request is in flight and gets its 200 ms, the other 19 are never sent. So 8 pauses are 8 slow requests out of 3,810. That is about 0.2% and p99 does not reach them. Both rows of `paced` are the same requests from the same run, only the zero of the stopwatch is different. In the other 2 runs `closed` had a p99 of 4.69 and 4.66 ms, `open` had 158.41 and 162.12.

I did not understand the 9.80 of `paced` from sending, pauses hit 8 requests there too. The other 32 of its 40 slowest requests all lie between 7.2 and 10.1 s of the run, in one noisy patch. In 2 more runs it was 8.28 and 9.71, again mostly because of such a patch. I did not find what makes them.

The mean in this row lies too, 2.83 against 7.21. Moving from the mean to p99 gave me nothing here. Only max in the `closed` row shows the trouble.

HdrHistogram can repair such a log. `recordValueWithExpectedInterval` with a 10 ms interval adds the missing 190, 180 and so on to a 200 ms value. Version 2.1.9 turned the 3 closed logs into p99 of 152.83, 156.03 and 156.80 ms, at most 6% below `open`. I expected worse. But it repairs only a log with holes. I gave it the `open` log on purpose and 4,000 requests became 5,546 records with a mean of 26.35 ms. Nothing in the output warns about it.

## p99 is a threshold

Before the run I wrote a prediction for the `open` client. If f is the share of time in pauses, p99 in ms is `2 + 200 * (1 - 0.01 / f)` when f is over 1% and about 2 otherwise. For the mean it is `2 + 100 * f`. Each row is an 80 s run.

| pause every | share | mean, ms | predicted | p99, ms | predicted |
|---|---|---|---|---|---|
| never | 0% | 2.66 | 2 | 6.4 | 2 |
| 40 s | 0.5% | 3.26 | 2.5 | 16.5 | 2 |
| 16 s | 1.25% | 4.09 | 3.25 | 56.0 | 42 |
| 10 s | 2% | 4.97 | 4 | 114.2 | 102 |
| 5 s | 4% | 6.76 | 6 | 153.1 | 152 |

From the first row to the last the mean grew 2.5 times and p99 grew 24 times. The predicted means are low by 0.7 to 1 ms in every row. The quiet run already has 0.66 of it, its median request takes 2.4 ms.

In the middle the predicted p99 is low by 14 and 12 ms. I first blamed the noise of the machine, but the log does not say so. Inside a pause the requests form a ladder with a step of about 10 ms, like 203, 197, 187 and so on down to 17. The ladders of most pauses nearly coincide, because the pause begins at nearly the same place of the 10 ms clock. In the 16 s run p99 is the 81st slowest request. Each of 4 pauses has 16 requests of 56 ms or more, the fifth has 17. So the 81st is 56.0 and the 82nd is 50.0. One extra request moves p99 by a step and my formula spreads requests evenly. The match in the last row is partly luck, the 80th there is 158.8.

The 0.5% row is where p99 failed. 200 ms pauses are there and p99 says 16.5. Of the 80 slowest requests only 38 are in the 2 pauses. The other 42 all came between 30.4 and 32.6 s, when the nearest pause was 10 s away. I do not know what the machine was doing. p99.9 was 169.6.

## Averaging p99

I split the 5 s run into seconds and took p99 of each, like a monitoring system does.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="p99 of every 1 s window of an 80 s run, 80 bars. 16 bars are between 189 and 194 ms, one every 5 s, the other 64 are between 2.7 and 16.1 ms. The average of the 80 values is 42.0 ms, the p99 of the whole run is 153.1 ms.">
  <line x1="60" y1="220.0" x2="460" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="138.2" x2="460" y2="138.2" class="f-plain"/>
  <text x="52.0" y="142.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="56.4" x2="460" y2="56.4" class="f-plain"/>
  <text x="52.0" y="60.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <rect x="60.8" y="215.4" width="3.4" height="4.6" style="fill:var(--muted);stroke:none"/>
  <rect x="65.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="70.8" y="65.6" width="3.4" height="154.4" style="fill:var(--accent);stroke:none"/>
  <rect x="75.8" y="217.4" width="3.4" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="80.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="85.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="90.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="95.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="100.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="105.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="110.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="115.8" y="217.3" width="3.4" height="2.7" style="fill:var(--muted);stroke:none"/>
  <rect x="120.8" y="64.0" width="3.4" height="156.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="130.8" y="206.8" width="3.4" height="13.2" style="fill:var(--muted);stroke:none"/>
  <rect x="135.8" y="213.2" width="3.4" height="6.8" style="fill:var(--muted);stroke:none"/>
  <rect x="140.8" y="214.3" width="3.4" height="5.7" style="fill:var(--muted);stroke:none"/>
  <rect x="145.8" y="63.7" width="3.4" height="156.3" style="fill:var(--accent);stroke:none"/>
  <rect x="150.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="155.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="160.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="165.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="170.8" y="63.3" width="3.4" height="156.7" style="fill:var(--accent);stroke:none"/>
  <rect x="175.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="180.8" y="215.2" width="3.4" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="185.8" y="214.2" width="3.4" height="5.8" style="fill:var(--muted);stroke:none"/>
  <rect x="190.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="195.8" y="64.8" width="3.4" height="155.2" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="205.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="210.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="215.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="220.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="230.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="235.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="240.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="245.8" y="65.5" width="3.4" height="154.5" style="fill:var(--accent);stroke:none"/>
  <rect x="250.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="255.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="260.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="265.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="270.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="275.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="280.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="285.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="290.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="295.8" y="64.1" width="3.4" height="155.9" style="fill:var(--accent);stroke:none"/>
  <rect x="300.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="305.8" y="213.5" width="3.4" height="6.5" style="fill:var(--muted);stroke:none"/>
  <rect x="310.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="315.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="320.8" y="63.5" width="3.4" height="156.5" style="fill:var(--accent);stroke:none"/>
  <rect x="325.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="330.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="335.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="340.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="345.8" y="64.9" width="3.4" height="155.1" style="fill:var(--accent);stroke:none"/>
  <rect x="350.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="355.8" y="215.3" width="3.4" height="4.7" style="fill:var(--muted);stroke:none"/>
  <rect x="360.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="365.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="370.8" y="61.5" width="3.4" height="158.5" style="fill:var(--accent);stroke:none"/>
  <rect x="375.8" y="216.3" width="3.4" height="3.7" style="fill:var(--muted);stroke:none"/>
  <rect x="380.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="385.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="390.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="395.8" y="65.2" width="3.4" height="154.8" style="fill:var(--accent);stroke:none"/>
  <rect x="400.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="405.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <rect x="410.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="415.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="420.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="425.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="430.8" y="217.8" width="3.4" height="2.2" style="fill:var(--muted);stroke:none"/>
  <rect x="435.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="440.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="445.8" y="62.2" width="3.4" height="157.8" style="fill:var(--accent);stroke:none"/>
  <rect x="450.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="455.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <line x1="60" y1="94.7" x2="460" y2="94.7" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <line x1="60" y1="185.6" x2="460" y2="185.6" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="160.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="260.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="360.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="460.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">p99 in 1 s, ms</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">seconds of the run</text>
  <text x="470.0" y="98.7" text-anchor="start" class="f-mono f-ink" style="font-size:11px">p99 of all requests 153.1</text>
  <text x="470.0" y="189.6" text-anchor="start" class="f-mono f-ink" style="font-size:11px">average of 80 values 42.0</text>
</svg>
<figcaption>p99 of every second, a pause every 5 s. The average of 80 bars is 42.0 ms and no second of the run looks like that.</figcaption>
</figure>

The average of 80 values is 42.0 ms and the true p99 is 153.1. Half of the seconds are at 4.8 ms or lower and only 16 of 80 contain a pause. With 5 s windows the average was 150.6, almost right, but only because every window has exactly one pause. The means do average, 6.76 in both, because every second has 100 requests. For 2 servers, the quiet run and the 5 s run, the average of the p99 values is 79.7 and the p99 of all requests together is 103.7. Heinrich Hartmann's slides from OSMC in November 2016 say it directly: don't aggregate percentiles, aggregate histograms.

## The 63% that I borrowed

Dean and Barroso in "The Tail at Scale" count that a request to 100 servers, each slow with probability 1%, is slow in 63% of cases. I expected the same 63% for 100 requests in a row to my server. In the log of the 5 s run it is 21.1%.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Share of series of N requests in a row that contain at least one request slower than p99. N from 10 to 200. Formula: 9.6, 18.2, 39.5, 63.4, 86.6 percent. Same requests shuffled: 9.5, 18.2, 40.0, 61.3, 84.5. In the real order: 2.8, 4.8, 10.9, 21.1, 41.8.">
  <line x1="60" y1="230.0" x2="560" y2="230.0" class="f-plain"/>
  <text x="52.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="182.5" x2="560" y2="182.5" class="f-plain"/>
  <text x="52.0" y="186.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="60" y1="135.0" x2="560" y2="135.0" class="f-plain"/>
  <text x="52.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="60" y1="87.5" x2="560" y2="87.5" class="f-plain"/>
  <text x="52.0" y="91.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="60" y1="40.0" x2="560" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="85.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="185.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="310.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="435.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="560.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <polyline points="85.0,211.8 110.0,195.4 185.0,154.9 310.0,109.5 560.0,65.5" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4"/>
  <polyline points="85.0,211.9 110.0,195.4 185.0,154.0 310.0,113.5 560.0,69.5" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>
  <circle cx="85.0" cy="211.9" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="110.0" cy="195.4" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="154.0" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="310.0" cy="113.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="560.0" cy="69.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <polyline points="85.0,224.7 110.0,220.9 185.0,209.3 310.0,189.9 560.0,150.6" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="85.0" cy="224.7" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="110.0" cy="220.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="185.0" cy="209.3" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="189.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="560.0" cy="150.6" r="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="570.0" y="61.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">formula</text>
  <text x="570.0" y="83.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">shuffled</text>
  <text x="570.0" y="148.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">real</text>
  <text x="570.0" y="162.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">order</text>
  <text x="310.0" y="95.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">63.4%</text>
  <text x="310.0" y="179.9" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">21.1%</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">series of N requests with a slow one, %</text>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">N</text>
</svg>
<figcaption>How many series of N requests meet at least one slower than p99. Shuffled requests follow the formula, the real order does not.</figcaption>
</figure>

The formula is right about the shuffled log, 61.3%. But my slow requests come in packs of 5 and only every fifth second has one. A series that is hit has 4.8 slow requests on average. The formula needs independence and 100 requests in a row to one server are not that, so the mistake is mine.

## What I did not check

Every pause had the same length and requests came evenly. Real clients come irregularly and real GC pauses differ from each other. The schedule of pauses is exact, so the 21.1% belongs to the 5 s period and would change with it. I ran each row of the sweep once and the 0.5% row has only 2 pauses. Client and server share the 2 cores, so a part of the quiet tail may be them disturbing each other. I have not run wrk2 itself. My old numbers came from loops like `closed` and I have not repeated them yet.
