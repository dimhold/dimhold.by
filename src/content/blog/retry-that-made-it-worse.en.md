---
title: "93 percent of the work went to clients who had already left"
description: "I set out to measure how retries knock over a service under load. They do triple the traffic, 2.88 times in my rig, but they did not cause the collapse. The collapse was already there at 1.2 times capacity, because the queue got deeper than the client timeout and the server spent its whole day finishing requests nobody was waiting for."
date: 2013-04-10
lang: en
translationKey: retry-that-made-it-worse
tags: ["reliability", "networking"]
---

The story everybody tells about an outage is that the retries finished it off. A service gets slow, every client tries again, the extra load lands on a machine that is already behind. The thing never comes back until you turn the clients off. I believed it well enough to repeat it in a design review. I had never seen the numbers with the retries removed.

So I built the smallest rig where the effect could be seen. A service that handles 20 requests at once for 20 milliseconds each, which is a ceiling of 1000 per second. A queue of 100 in front of it. Anything arriving when the queue is full gets a 503 immediately. A client that opens requests on a schedule instead of waiting for the previous one to finish, with a timeout of 100 milliseconds, because that is what a crowd of users looks like.

Then I ran the load past the ceiling with the retries switched off, which is the arm I had never bothered to run.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="Useful responses per second against offered load. At 800 offered the service returns 727 useful responses per second with or without retries. At 1000 offered it returns 909 either way. At 1200 offered, which is 1.2 times the ceiling, useful output falls to 65 per second without retries and 76 per second with 2 retries. At 1500 offered it is 32 without retries and 43 with them. The ceiling of the service is 1000 per second and it is drawn as a flat line above the collapse.">
  <text x="60" y="24" class="f-label f-muted">useful responses per second</text>
  <path d="M 70 200 L 620 200" class="f-line"/>
  <path d="M 70 40 L 70 200" class="f-line"/>
  <text x="30" y="204" class="f-label f-muted">0</text>
  <text x="24" y="124" class="f-label f-muted">500</text>
  <text x="18" y="44" class="f-label f-muted">1000</text>
  <path d="M 70 40 L 620 40" class="f-line f-muted" stroke-dasharray="4 4"/>
  <text x="470" y="36" class="f-label f-muted">ceiling 1000 per second</text>
  <circle cx="140" cy="84" r="4" class="f-accent"/>
  <circle cx="300" cy="55" r="4" class="f-accent"/>
  <circle cx="460" cy="190" r="4" class="f-accent"/>
  <circle cx="600" cy="195" r="4" class="f-accent"/>
  <path d="M 140 84 L 300 55 L 460 190 L 600 195" class="f-line f-accent"/>
  <circle cx="140" cy="84" r="2" class="f-plain"/>
  <circle cx="460" cy="188" r="7" class="f-plain"/>
  <circle cx="600" cy="193" r="7" class="f-plain"/>
  <text x="110" y="218" class="f-label f-muted">800</text>
  <text x="270" y="218" class="f-label f-muted">1000</text>
  <text x="430" y="218" class="f-label f-muted">1200</text>
  <text x="570" y="218" class="f-label f-muted">1500</text>
  <text x="60" y="238" class="f-label f-muted">offered load per second</text>
  <text x="380" y="150" class="f-label f-accent">65 and 76 per second</text>
</svg>
<figcaption>The line is the useful output with retries off. The open rings are the same points with 2 retries, which land 11 per second higher. The cliff sits between 1000 offered and 1200 offered, a difference of 20 percent in load.</figcaption>
</figure>

At 800 per second everything succeeds. At 1000 per second everything still succeeds, at a median of 58 milliseconds. At 1200 per second, which is 20 percent more load, useful output falls from 909 per second to 65. That is a factor of 14 for a factor of 1.2. No client is retrying anything.

The service is not broken during this. It completes 6067 requests in the 6.6 seconds of the run, which is about 920 per second, close to the ceiling it always had. It is simply that 5627 of those 6067 completions, 93 percent, are written to clients that had already given up and gone. The queue holds 100 requests and the service drains 1000 per second, so a request landing at the back of the queue waits about 100 milliseconds, exactly the timeout the client set. Everything past that point is work for nobody.

## Now switch the retries on

Same rig, same loads, each failure retried up to 2 times.

<figure class="fig">
<svg viewBox="0 0 640 220" role="img" aria-label="Where the traffic goes at 1200 offered per second. Without retries the clients make 7200 attempts, the service completes 6067 of them, 5627 of those completions go to clients that already left, 431 are useful and 1133 attempts get an immediate 503. With 2 retries the clients make 20701 attempts, 2.88 times more, the service completes 6180, of which 5664 are wasted and 500 useful, and rejections rise from 1133 to 14521.">
  <text x="10" y="24" class="f-label f-muted">at 1200 offered per second, 6 seconds of load</text>
  <text x="10" y="58" class="f-label f-ink">no retries</text>
  <rect x="120" y="44" width="72" height="20" rx="2" class="f-plain"/>
  <text x="200" y="58" class="f-label f-muted">7200 attempts</text>
  <text x="10" y="92" class="f-label f-ink">2 retries</text>
  <rect x="120" y="78" width="207" height="20" rx="2" class="f-accent"/>
  <text x="335" y="92" class="f-label f-muted">20701 attempts, 2.88 times more</text>
  <path d="M 10 116 L 620 116" class="f-line"/>
  <text x="10" y="140" class="f-label f-muted">useful responses</text>
  <text x="240" y="140" class="f-mono f-ink">431</text>
  <text x="380" y="140" class="f-mono f-accent">500</text>
  <text x="10" y="162" class="f-label f-muted">completed for clients that left</text>
  <text x="240" y="162" class="f-mono f-ink">5627</text>
  <text x="380" y="162" class="f-mono f-accent">5664</text>
  <text x="10" y="184" class="f-label f-muted">refused with 503</text>
  <text x="240" y="184" class="f-mono f-ink">1133</text>
  <text x="380" y="184" class="f-mono f-accent">14521</text>
  <text x="240" y="206" class="f-label f-muted">no retries</text>
  <text x="380" y="206" class="f-label f-accent">2 retries</text>
</svg>
<figcaption>The retries multiply the attempts by 2.88 and the refusals by 13. The 2 numbers that matter to a user, the useful responses and the wasted completions, barely move.</figcaption>
</figure>

The traffic goes from 7200 attempts to 20701, which is 2.88 times. At 1500 offered it is 2.95 times. The 503s go from 1133 to 14521. And the useful output goes from 65 per second to 76.

Up. Not down. The retries in this rig bought 11 more successes per second while tripling the traffic, because the queue was already full. The extra attempts got refused at the door in a microsecond each, without touching the 20 worker slots. My story had the cause and the passenger swapped: the collapse was the timeout meeting the queue. The retry storm rode on top of it without making the number that matters any worse.

I want to be careful about how far that carries. The rejection here is cheap, a single syscall and a 503, with a bounded queue behind it. In a service where the overflow path costs real work, a database connection or a thread, the same 3 times traffic goes straight into the part that is already the bottleneck. I would expect the sign to flip there. That is the version of the experiment I have not run.

## The number I nearly missed

The server looked healthy the whole time. Requests completed, the completion rate stayed near the ceiling, latency inside the service never moved, because each unit of work still took its 20 milliseconds. I only saw the problem after adding a counter for responses written to a client that had already disconnected. Before that counter existed, the graph on the service side said 920 per second and the graph on the client side said 65. Both were true.

## What I did not check

Backoff, which is the obvious next arm: these retries fire immediately. Spacing them out is exactly the fix the folklore recommends. A retry budget, which caps attempts as a fraction of traffic rather than per request. A closed loop client, where users wait instead of piling on, since that alone removes most of the amplification. And a real network between the 2 sides, which adds its own queue that I did not model at all.

The narrow claim is about which knob to reach for. If the queue in front of a service can hold more work than the client timeout will wait for, the service will spend the outage finishing requests for people who left, whether or not anybody retries.
