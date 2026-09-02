---
title: "The timeout you did not set is 135 seconds"
description: "I used to say that a request without a timeout waits forever. Half of that is wrong. The kernel hands you a connect timeout whether you ask for it or not, and on this machine it fires after 135.3 seconds. The other half is worse than forever: once the connection is up, nobody is counting at all."
date: 2013-03-13
lang: en
translationKey: timeout-you-did-not-set
---

A request of ours hung and the thread that made it hung with it. I said what I had said before, that a client without a timeout waits forever, so set one. It is the advice I would still give. I had just never checked whether the first half of it is true. It is not.

The kernel has an opinion about how long to wait. You get that opinion for free.

The setup is 2 machines and 1 address that goes nowhere. 192.0.2.0/24 is the range reserved for documentation, so packets sent there are dropped somewhere upstream. No answer ever comes back. A connect to `192.0.2.1:80` therefore does the one thing I wanted to time: it waits for a reply that will not arrive.

On the server, running Linux 6.8 with `tcp_syn_retries` at the default 6, it waited 135.3 seconds and then failed with `ETIMEDOUT`. Nothing in my code chose that number.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="A timeline of a connect that never succeeds. The first SYN goes out at 0 seconds, and retransmissions follow at 1, 3, 7, 15, 31 and 63 seconds of elapsed time, each interval twice the one before. The doubling model puts the moment of giving up at 127 seconds. The measured failure came at 135.3 seconds, 8.3 seconds later than the model.">
  <text x="60" y="30" class="f-label f-muted">SYN sent again, each wait twice the last</text>
  <path d="M 60 110 L 600 110" class="f-line"/>
  <path d="M 60 100 L 60 120" class="f-line"/>
  <path d="M 64 100 L 64 120" class="f-line"/>
  <path d="M 72 100 L 72 120" class="f-line"/>
  <path d="M 87 100 L 87 120" class="f-line"/>
  <path d="M 118 100 L 118 120" class="f-line"/>
  <path d="M 180 100 L 180 120" class="f-line"/>
  <path d="M 303 100 L 303 120" class="f-line"/>
  <text x="60" y="140" class="f-label f-muted">0</text>
  <text x="84" y="140" class="f-label f-muted">7</text>
  <text x="114" y="140" class="f-label f-muted">15</text>
  <text x="176" y="140" class="f-label f-muted">31</text>
  <text x="299" y="140" class="f-label f-muted">63</text>
  <text x="60" y="160" class="f-label f-muted">seconds since the first packet</text>
  <path d="M 550 70 L 550 130" class="f-line"/>
  <text x="446" y="62" class="f-label f-muted">model: 127</text>
  <rect x="576" y="96" width="14" height="28" rx="3" class="f-accent"/>
  <text x="430" y="182" class="f-label f-accent">measured: 135.3 then ETIMEDOUT</text>
</svg>
<figcaption>Every wait is twice the one before it, so the last 2 intervals are most of the total. The doubling puts the end at 127 seconds. The machine took 135.3.</figcaption>
</figure>

The doubling is the whole mechanism. The first packet goes out. If nothing answers the next one goes after 1 second, then 2, then 4 and so on, so with 6 retransmissions the sum of the waits is 127 seconds. That model is worth exactly as much as its predictions, so I changed the setting and timed it again. At 2 retries it gave up after 7.2 seconds against a predicted 7. At 3 retries it took 19.4 seconds against a predicted 15.

So the model is right at the short end and runs over by 4.4 and then 8.3 seconds as the tail gets longer. My first guess was the kernel remembering the previous attempts: Linux caches round trip estimates per destination. A polluted estimate would stretch every later run. It is not that. There is no entry for the address at all. Flushing the cache gives 19.4 seconds again, the same number to the tenth. Where the extra seconds come from I do not know.

## The half that really is forever

The connect timeout is the half you are given. The other half you are not.

I started a local server that accepts the connection, reads the request and never answers. A client with nothing set of its own was still waiting when I stopped it at 30 seconds. There is no packet to retransmit here and no failure for the kernel to detect, because the connection is healthy and the peer is simply quiet. Nothing below the library has any reason to act. The same client with 2000 milliseconds set died at 2.0 seconds.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="The 2 phases of a request and who is counting during each. During connect the kernel counts, and it gave up after 135.3 seconds without being asked. During the wait for a response nobody counts, and the client was still waiting when it was stopped at 30 seconds. The same client with an explicit 2000 millisecond timeout stopped at 2.0 seconds.">
  <rect x="40" y="40" width="240" height="46" rx="3" class="f-box"/>
  <text x="160" y="60" class="f-mono f-ink" text-anchor="middle">connect</text>
  <text x="160" y="78" class="f-label f-muted" text-anchor="middle">the kernel counts</text>
  <path d="M 280 63 L 350 63" class="f-line"/>
  <rect x="350" y="40" width="240" height="46" rx="3" class="f-box"/>
  <text x="470" y="60" class="f-mono f-ink" text-anchor="middle">waiting for the answer</text>
  <text x="470" y="78" class="f-label f-muted" text-anchor="middle">nobody counts</text>
  <text x="40" y="112" class="f-label f-accent">gave up at 135.3 s</text>
  <text x="350" y="112" class="f-label f-accent">still waiting at 30 s</text>
  <text x="40" y="132" class="f-label f-muted">and you never asked for it</text>
  <text x="350" y="132" class="f-label f-muted">and it would have kept waiting</text>
  <path d="M 350 150 L 350 176" class="f-line"/>
  <rect x="350" y="176" width="240" height="24" rx="3" class="f-plain"/>
  <text x="470" y="192" class="f-mono f-ink" text-anchor="middle">2.0 s when set to 2000 ms</text>
</svg>
<figcaption>2 phases, 2 different owners of the clock. The phase you cannot control is bounded, the phase you can control is not.</figcaption>
</figure>

That is the shape of the trap. The failure everybody thinks about, a machine that is down, is the one already handled, badly but bounded. The failure nobody sets a timer for is a peer that took your request, said nothing and now holds a thread of yours until the process dies.

## Where I tripped

The first run of this took 0.0 seconds and reported success. I ran it at home. My home network answers `192.0.2.1` on port 80, an address that by standard belongs to nobody. It answers `10.255.255.1` the same way. There is no black hole to measure on a network where something always picks up, so the measurement moved to a machine with a clean route. The honest version of my first result is that I measured my router instead of the kernel.

## What I did not check

Where the extra 8.3 seconds come from. Whether the numbers are the same on Windows on a clean route, which I could not test because I do not have one at home. Whether a library timeout that fires mid request leaves the socket in a state the pool will reuse, which is the failure I actually worry about in production and it needs a different setup than this one. And retries: every client I know layers a retry over the timeout, so the number a caller waits is the product of 2 settings, not either of them.

The narrow claim is this. Nobody is counting after the connection is up. Before it is up the kernel is counting to something around 2 minutes with a number nobody in the code has ever seen.
