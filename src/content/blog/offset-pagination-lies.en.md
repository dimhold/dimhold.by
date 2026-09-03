---
title: "Page 2 repeated a row from page 1 and nothing was broken"
description: "A single insert at the front of the order made the second page start with the last row of the first one. Both queries are correct. Paging by offset also reads 900020 rows to return 20 at the deep end, taking 69.5 ms against 1.5 for the same page fetched by key, and the plan says so out loud."
date: 2012-10-10
lang: en
translationKey: offset-pagination-lies
tags: ["databases", "performance"]
---

Somebody reported seeing the same item twice while paging through a list. There was nothing in the logs, the query was ordinary, so I spent an afternoon looking for a bug in the application. The bug is in the paging itself, needing no concurrency drama to reproduce: 1 insert is enough.

The setup is a table of a million rows with an index on the sort key, pages of 20. Page 1 comes back as ids 1 to 20. Then 1 row arrives that sorts before all of them, which is the ordinary case of somebody backdating an entry. Then page 2 is fetched the usual way.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="What the reader sees on page 2 after 1 row is inserted at the front of the order. Page 1 was ids 1 to 20. Fetched with offset 20, page 2 begins with id 20, so the row the reader already saw appears again and id 40 is pushed out of view. Fetched by key, page 2 is ids 21 to 40 with nothing repeated.">
  <text x="10" y="24" class="f-label f-muted">page 1 was ids 1 to 20, then 1 row is inserted before all of them</text>
  <text x="10" y="58" class="f-label f-ink">page 2 by offset</text>
  <rect x="150" y="42" width="34" height="22" rx="3" class="f-accent"/>
  <text x="167" y="58" class="f-mono f-ink" text-anchor="middle">20</text>
  <text x="196" y="58" class="f-mono f-muted">21 22 23 ... 38 39</text>
  <text x="420" y="58" class="f-label f-accent">20 was already on page 1</text>
  <text x="10" y="98" class="f-label f-ink">page 2 by key</text>
  <rect x="150" y="82" width="34" height="22" rx="3" class="f-box"/>
  <text x="167" y="98" class="f-mono f-ink" text-anchor="middle">21</text>
  <text x="196" y="98" class="f-mono f-muted">22 23 24 ... 39 40</text>
  <text x="420" y="98" class="f-label f-muted">nothing repeated, nothing lost</text>
  <path d="M 10 122 L 620 122" class="f-line"/>
  <text x="10" y="148" class="f-label f-muted">offset counts positions in a list that changed under it</text>
  <text x="10" y="172" class="f-label f-muted">a key counts from the row the reader actually saw last</text>
  <text x="10" y="196" class="f-label f-muted">rows shown twice: 1 by offset, 0 by key</text>
</svg>
<figcaption>Both queries return the correct answer to the question they were asked. Offset asks for rows 21 to 40 of the list as it is now. The reader was looking at the list as it was a moment ago.</figcaption>
</figure>

The offset page starts with 20, a row the reader has already seen. Row 40 never appears at all. The key based page returns 21 to 40. Nobody is at fault: the offset query correctly returns rows 21 to 40 of the current ordering, which is 1 row longer at the front than it was when page 1 was drawn.

That is the part that took me the afternoon. I was looking for a race, a caching layer, a wrong sort. There is nothing to find. The scheme itself has the property that anything inserted or deleted ahead of your position shifts everything behind it, so a reader who pages slowly sees repeats after inserts and silently skips rows after deletes.

## The speed, since everybody talks about that instead

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="Median time of one page of 20 rows against how deep the page is. Paging by offset takes 1.483 milliseconds at the front, 1.470 at depth 1000, 2.499 at 10000, 10.832 at 100000, 43.680 at 500000 and 69.485 at 900000. Paging by key takes 1.774, 1.905, 2.036, 1.632, 1.661 and 1.519 milliseconds at the same depths, a flat line.">
  <text x="60" y="24" class="f-label f-muted">median of 5 runs, 1 page of 20 rows, milliseconds</text>
  <path d="M 70 190 L 610 190" class="f-line"/>
  <path d="M 70 30 L 70 190" class="f-line"/>
  <text x="42" y="194" class="f-label f-muted">0</text>
  <text x="34" y="118" class="f-label f-muted">35</text>
  <text x="34" y="42" class="f-label f-muted">70</text>
  <circle cx="90" cy="187" r="3" class="f-accent"/>
  <circle cx="180" cy="187" r="3" class="f-accent"/>
  <circle cx="270" cy="184" r="3" class="f-accent"/>
  <circle cx="360" cy="165" r="3" class="f-accent"/>
  <circle cx="470" cy="90" r="3" class="f-accent"/>
  <circle cx="580" cy="31" r="3" class="f-accent"/>
  <path d="M 90 187 L 180 187 L 270 184 L 360 165 L 470 90 L 580 31" class="f-line f-accent"/>
  <text x="500" y="52" class="f-label f-accent">by offset: 69.485</text>
  <circle cx="90" cy="186" r="3" class="f-plain"/>
  <circle cx="580" cy="187" r="3" class="f-plain"/>
  <path d="M 90 186 L 180 186 L 270 185 L 360 186 L 470 186 L 580 187" class="f-line"/>
  <text x="420" y="178" class="f-label f-muted">by key: 1.519 at the same depth</text>
  <text x="76" y="208" class="f-label f-muted">0</text>
  <text x="160" y="208" class="f-label f-muted">1000</text>
  <text x="250" y="208" class="f-label f-muted">10000</text>
  <text x="340" y="208" class="f-label f-muted">100000</text>
  <text x="450" y="208" class="f-label f-muted">500000</text>
  <text x="560" y="208" class="f-label f-muted">900000</text>
  <text x="60" y="224" class="f-label f-muted">how many rows deep the page sits</text>
</svg>
<figcaption>The 2 lines cross somewhere around 10000 rows deep. Below that the offset is the faster of the 2, which is why the habit survives.</figcaption>
</figure>

At the front of the list the offset query is the quicker one, 1.483 milliseconds against 1.774. That is worth saying out loud, because it is why nobody changes anything: on the pages that people actually open, the simple version wins.

By 100000 rows deep it costs 10.8 milliseconds and by 900000 it costs 69.5, while the key based query has not moved off 1.5. The plan explains it in 1 line: to return 20 rows the database reads 900020 of them, then throws away everything before the offset. The key based query reads exactly 20.

Crawling the whole table makes the shape obvious. In pages of 20 there are 50000 pages. The offset version reads 20 rows more on each one than on the last, so the total comes to about 25 billion row reads for a table of a million rows. The key based version reads 20 rows per page and finishes at a million. That is arithmetic rather than a measurement. It is the same arithmetic the plan showed on 1 page: the cost of a page is the position of that page.

An export job is exactly this. It walks every page once, politely, in a loop somebody wrote in an afternoon, turning a table scan into a quadratic one without a single line of the code looking wrong.

## What I did not check

Paging by key needs a unique tiebreaker. Mine is the primary key next to the timestamp. Without it, rows sharing a sort value land on both sides of a page boundary. I did not measure that, though I expect it to reproduce the duplicate in a different way.

The mirror of this bug, a delete ahead of your position silently skipping a row, I reasoned about rather than ran. The practical cost of key based paging is real too: you cannot jump to page 57, only forward and back, so any interface with numbered pages is asking for the scheme that miscounts.

The narrow claim is about what to fix first. The speed argument only applies to depths most applications never reach. The correctness argument applies on page 2.
