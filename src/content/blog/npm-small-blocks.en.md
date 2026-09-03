---
title: "Installing grunt puts code from 32 people on my disk"
description: "I walked the dependency graph of 6 packages as the registry recorded them today. Grunt brings 51 packages written by 32 people. The small blocks pitch is literally true, since 40 of the 67 packages have no dependencies at all, but 56 of those 67 have exactly 1 maintainer and 3 names account for 26 of them."
date: 2012-05-16
lang: en
translationKey: npm-small-blocks
---

The pitch for npm is small blocks. Write a module that does 1 thing, publish it, let other people assemble. I have repeated that pitch for months without ever counting what a single install actually puts on my disk.

The registry keeps the publish date of every version, so I can ask what each package looks like as of today rather than as of whenever I happen to run this. I took 6 roots I actually use, resolved each to its newest version published on or before today, then walked the dependency names to the bottom.

<figure class="fig">
<svg viewBox="0 0 640 220" role="img" aria-label="Six roots and the size of what each pulls in. Request at version 2.9.202 pulls 1 package written by 1 person. Connect 2.2.2 pulls 6 packages from 6 people. Mocha 1.0.3 pulls 7 packages from 3 people. Express 2.5.9 pulls 8 packages from 7 people. Socket.io 0.9.6 pulls 12 packages from 12 people. Grunt 0.3.9 pulls 51 packages from 32 people, which is 6 times the size of the express tree.">
  <text x="10" y="24" class="f-label f-muted">what one install brings in, as of today</text>
  <text x="150" y="48" class="f-label f-muted">packages</text>
  <text x="260" y="48" class="f-label f-muted">people</text>
  <path d="M 10 56 L 620 56" class="f-line"/>
  <text x="10" y="80" class="f-mono f-ink">request</text>
  <text x="150" y="80" class="f-mono f-ink">1</text>
  <text x="260" y="80" class="f-mono f-ink">1</text>
  <rect x="330" y="68" width="5" height="14" class="f-plain"/>
  <text x="10" y="104" class="f-mono f-ink">connect</text>
  <text x="150" y="104" class="f-mono f-ink">6</text>
  <text x="260" y="104" class="f-mono f-ink">6</text>
  <rect x="330" y="92" width="32" height="14" class="f-plain"/>
  <text x="10" y="128" class="f-mono f-ink">mocha</text>
  <text x="150" y="128" class="f-mono f-ink">7</text>
  <text x="260" y="128" class="f-mono f-ink">3</text>
  <rect x="330" y="116" width="37" height="14" class="f-plain"/>
  <text x="10" y="152" class="f-mono f-ink">express</text>
  <text x="150" y="152" class="f-mono f-ink">8</text>
  <text x="260" y="152" class="f-mono f-ink">7</text>
  <rect x="330" y="140" width="43" height="14" class="f-plain"/>
  <text x="10" y="176" class="f-mono f-ink">socket.io</text>
  <text x="150" y="176" class="f-mono f-ink">12</text>
  <text x="260" y="176" class="f-mono f-ink">12</text>
  <rect x="330" y="164" width="64" height="14" class="f-plain"/>
  <text x="10" y="200" class="f-mono f-accent">grunt</text>
  <text x="150" y="200" class="f-mono f-accent">51</text>
  <text x="260" y="200" class="f-mono f-accent">32</text>
  <rect x="330" y="188" width="272" height="14" class="f-accent"/>
</svg>
<figcaption>The spread between the smallest and the largest tree is 51 to 1. Request, the client everybody uses to talk to the outside world, is 1 file of nobody else's code.</figcaption>
</figure>

Grunt is the outlier at 51 packages from 32 people. Express, which I would have guessed was the heavy one, brings 8. Request brings nothing at all. It is 1 package with no dependencies and a single maintainer, the thing I reach for whenever a program has to make an HTTP call.

## The pitch is true

Across the 6 trees there are 67 distinct packages. 40 of them, a clear majority, declare no dependencies whatsoever. The median package in this graph depends on nothing, the heaviest depends on 16 others.

That is the small blocks idea working exactly as advertised. Most of what lands on my disk is somebody's single file that parses a query string or walks a directory. It drags no world in behind it.

## The part nobody puts on the slide

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Two facts about the same 67 packages. 56 of the 67 have exactly 1 maintainer, which is 84 percent. And 3 names account for 26 of the 67 packages: isaacs with 10, tjholowaychuk with 8 and substack with 8, which is 39 percent of the graph.">
  <text x="10" y="24" class="f-label f-muted">the same 67 packages, counted by people instead</text>
  <rect x="10" y="40" width="290" height="70" rx="3" class="f-box"/>
  <text x="24" y="66" class="f-mono f-accent">56 of 67</text>
  <text x="24" y="88" class="f-label f-muted">have exactly 1 maintainer, 84 percent</text>
  <rect x="330" y="40" width="290" height="70" rx="3" class="f-box"/>
  <text x="344" y="66" class="f-mono f-accent">26 of 67</text>
  <text x="344" y="88" class="f-label f-muted">belong to just 3 of the 40 people</text>
  <text x="10" y="138" class="f-label f-muted">isaacs</text>
  <rect x="90" y="126" width="100" height="14" class="f-accent"/>
  <text x="200" y="138" class="f-mono f-ink">10</text>
  <text x="10" y="160" class="f-label f-muted">tjholowaychuk</text>
  <rect x="90" y="148" width="80" height="14" class="f-accent"/>
  <text x="200" y="160" class="f-mono f-ink">8</text>
  <text x="10" y="182" class="f-label f-muted">substack</text>
  <rect x="90" y="170" width="80" height="14" class="f-accent"/>
  <text x="200" y="182" class="f-mono f-ink">8</text>
  <text x="260" y="182" class="f-label f-muted">then indexzero with 6 and felixge with 5</text>
</svg>
<figcaption>40 people wrote the graph. 3 of them wrote 39 percent of it. 84 percent of the packages have nobody standing behind them but the author.</figcaption>
</figure>

56 of the 67 packages have exactly 1 maintainer. There is no second person with the rights to publish, which means a package is 1 lost password or 1 lost interest away from being stuck. That is not a hypothetical property of the design. It is the current state of the graph under 6 ordinary installs.

And the graph is less diverse than 40 names suggest. isaacs appears on 10 of the 67 packages, tjholowaychuk on 8, substack on 8. Those 3 hold 26 of the 67, which is 39 percent of everything the 6 installs put on my disk.

I do not read this as a scandal. Those 3 wrote the layer everybody needed and published it instead of keeping it, so the concentration describes who did the work. It describes my exposure at the same time.

## What I did not check

The version ranges. I walked package names, not the ranges in the dependency lists, so the tree I counted is the shape of the graph rather than the exact set of tarballs a given install would fetch. For counting distinct packages and distinct people that makes no difference. For anything else it would.

The maintainer lists are also not perfectly historical. 63 of the 67 packages carry a maintainer list inside the published version, which is a snapshot from the day it went out. The other 4 do not, so for those I fell back to the list the registry shows now, which may have changed since.

And I did not open a single tarball, so I know how many packages arrive and from whom, while knowing nothing about how much code that actually is.

The narrow claim is that both halves of the pitch are measured now. Small blocks is real, because most of these packages depend on nothing. The cost of small blocks is also real: 6 installs bring 67 packages, with exactly 1 person standing behind 84 percent of them.
