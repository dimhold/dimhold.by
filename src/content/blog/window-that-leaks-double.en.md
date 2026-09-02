---
title: "199 requests through a limit of 100, with nobody attacking"
description: "The fixed window counter leaks double at the boundary, which is the famous flaw. It also needs somebody who knows where the boundary is. The token bucket I switched to instead leaked 199 in a single window against ordinary steady traffic. Only the sliding log held the limit in all 4 traffic shapes, at 50 times the memory."
date: 2012-11-14
lang: en
translationKey: window-that-leaks-double
---

I needed a rate limit and wrote the 3 line version: a counter and the start of the current window. In review somebody said the words boundary problem, I switched to a token bucket, everybody nodded, the change went in. I could not have told you what either one lets through, so I built all of them and pushed 4 shapes of traffic at each.

The limit is 100 requests per 60 seconds throughout. What I measure is not how many requests got in overall, but the worst 60 seconds anywhere in the admitted stream, because that is the number the service behind the limiter has to survive.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="A table of the worst 60 second window admitted by each limiter under each traffic shape, with a limit of 100. The fixed window counter admits 200 at the window boundary, 100 under steady traffic, 128 under random traffic and 100 for a burst after silence. The sliding log admits 100 in all 4. The token bucket with capacity equal to the limit admits 101, 199, 177 and 100. The token bucket with capacity 10 admits 11, 109, 109 and 10.">
  <text x="10" y="26" class="f-label f-muted">worst 60 seconds admitted, limit is 100</text>
  <text x="200" y="52" class="f-label f-muted">boundary</text>
  <text x="300" y="52" class="f-label f-muted">steady 2x</text>
  <text x="404" y="52" class="f-label f-muted">random 1.5x</text>
  <text x="520" y="52" class="f-label f-muted">burst</text>
  <path d="M 10 60 L 620 60" class="f-line"/>
  <text x="10" y="86" class="f-label f-ink">fixed window</text>
  <text x="200" y="86" class="f-mono f-accent">200</text>
  <text x="300" y="86" class="f-mono f-ink">100</text>
  <text x="404" y="86" class="f-mono f-ink">128</text>
  <text x="520" y="86" class="f-mono f-ink">100</text>
  <text x="10" y="118" class="f-label f-ink">sliding log</text>
  <text x="200" y="118" class="f-mono f-ink">100</text>
  <text x="300" y="118" class="f-mono f-ink">100</text>
  <text x="404" y="118" class="f-mono f-ink">100</text>
  <text x="520" y="118" class="f-mono f-ink">100</text>
  <text x="10" y="150" class="f-label f-ink">token bucket, capacity 100</text>
  <text x="200" y="150" class="f-mono f-ink">101</text>
  <text x="300" y="150" class="f-mono f-accent">199</text>
  <text x="404" y="150" class="f-mono f-accent">177</text>
  <text x="520" y="150" class="f-mono f-ink">100</text>
  <text x="10" y="182" class="f-label f-ink">token bucket, capacity 10</text>
  <text x="200" y="182" class="f-mono f-ink">11</text>
  <text x="300" y="182" class="f-mono f-ink">109</text>
  <text x="404" y="182" class="f-mono f-ink">109</text>
  <text x="520" y="182" class="f-mono f-accent">10</text>
  <text x="10" y="212" class="f-label f-muted">marked: the 2 that leak double and the 1 that refuses 90 percent of a legal burst</text>
</svg>
<figcaption>Every row except the sliding log has a column where it is the worst option in the table. The last row is not a leak, it is the opposite failure: a client that stayed quiet for 9 minutes gets 10 of the 100 requests it was entitled to.</figcaption>
</figure>

The famous flaw is real. Put 100 requests in the last second of one window and 100 in the first second of the next. The counter admits all 200, because from its point of view those are 2 different windows with 100 each. The 60 seconds straddling the boundary contain double the limit.

It also needs an adversary who knows where the boundary is. Under steady traffic at twice the limit, the same counter never exceeds 100.

## The one I switched to

The token bucket sized the obvious way, capacity equal to the limit, admits 199 in a window under plain steady overload. No adversary, no timing, just a client sending faster than it is allowed.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Why a token bucket with capacity equal to the limit admits nearly double. At the start of a window the bucket is full with 100 tokens, all of which can be spent at once. During the same 60 seconds the bucket refills at 100 tokens per 60 seconds, adding another 99 spendable tokens. The sum inside 1 window is 199.">
  <rect x="40" y="46" width="150" height="40" rx="3" class="f-box"/>
  <text x="115" y="62" class="f-mono f-ink" text-anchor="middle">bucket is full</text>
  <text x="115" y="80" class="f-label f-muted" text-anchor="middle">100 tokens, spent at once</text>
  <text x="210" y="70" class="f-mono f-ink">+</text>
  <rect x="240" y="46" width="180" height="40" rx="3" class="f-box"/>
  <text x="330" y="62" class="f-mono f-ink" text-anchor="middle">refill during the window</text>
  <text x="330" y="80" class="f-label f-muted" text-anchor="middle">100 per 60 s, spent as it arrives</text>
  <text x="440" y="70" class="f-mono f-ink">=</text>
  <rect x="470" y="46" width="150" height="40" rx="3" class="f-accent"/>
  <text x="545" y="62" class="f-mono f-ink" text-anchor="middle">199 in 60 s</text>
  <text x="545" y="80" class="f-label f-muted" text-anchor="middle">measured, not derived</text>
  <path d="M 40 120 L 620 120" class="f-line"/>
  <text x="40" y="112" class="f-label f-muted">capacity 100</text>
  <text x="40" y="140" class="f-mono f-ink">199</text>
  <text x="200" y="112" class="f-label f-muted">capacity 10</text>
  <text x="200" y="140" class="f-mono f-ink">109</text>
  <text x="360" y="112" class="f-label f-muted">capacity 1</text>
  <text x="360" y="140" class="f-mono f-muted">100 by the same arithmetic</text>
  <text x="40" y="176" class="f-label f-muted">a bucket permits a burst of its capacity, which is what gets set to the limit</text>
</svg>
<figcaption>The bucket is 2 numbers added together: what it was holding and what arrives while you spend it. Sizing the capacity at the limit means the window can pay out twice.</figcaption>
</figure>

The arithmetic is not subtle once the number is in front of you. The bucket starts a window holding its capacity, which is spendable immediately. It refills at exactly the limit over the window, so that part is spendable as it lands. Capacity plus refill is what a window can pay out. Set the capacity to the limit and the answer is double.

Shrinking the bucket fixes that. Capacity 10 keeps the worst window at 109 across every shape I threw at it.

## The cost of shrinking it

The fourth traffic shape is a client that says nothing for 9 minutes then sends 300 requests at once. Every limiter should let 100 of those through, since the client has been under its limit all along and now asks for exactly a window worth of work.

The fixed window admits 100. The sliding log admits 100. The bucket sized at the limit admits 100. The bucket I shrank to 10 admits 10, turning away 90 requests that were within the client rights.

That is the whole trade in 1 line of the table. A large bucket is generous to a quiet client. It also lets an overloaded one through at double. A small bucket holds the line and punishes exactly the well behaved caller who saved up nothing.

## The one that never leaks

The sliding log admits exactly 100 in all 4 shapes, which is what it promises: it keeps the timestamps then counts what actually happened in the last 60 seconds.

It also keeps up to 100 timestamps per client. At 8 bytes each that is 800 bytes against the 16 a counter and a window start need. A token count with a refill time costs the same 16. 50 times the memory per client, plus a walk down the front of the list on every request. That is the price of a limiter with no scenario where it is the worst row in the table.

## What I did not check

Any of this spread over more than 1 machine, which is where I actually needed it. 3 nodes with a counter each is 3 windows and 3 times the leak. The fix is either a shared store on the hot path or an allowance split 3 ways that wastes 2 thirds of the limit under uneven traffic. I measured none of that. I also gave every limiter a perfect clock. The sliding log in particular is exactly as correct as the timestamps it is handed.

The narrow claim is that the choice is not between a broken limiter and a correct one. Each of the cheap ones is the worst one in some traffic shape. The shape you get decides which flaw you bought.
