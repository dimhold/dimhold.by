---
title: "The npm graph over 15 years. It grew to 4.45 million packages and one account still reaches a quarter of them"
description: "I took a random sample of 30000 npm names and rebuilt the dependency graph for every year from 2011 to October 2026, with a GIF of it growing. Packages went from about 2800 to 4.45 million and edges to 19.4 million. The jump of 2024 came from packages created that year, many of them spam that depends on spam. The 100 most used packages get half the share of edges they had in 2015, but the top account still reaches 25 percent of all packages and 14 to 19 accounts reach half."
date: 2026-10-08
lang: en
translationKey: npm-graph-years
tags: ["dependencies", "open-data", "statistics"]
---
There is a picture of npm I have had in my head for years. It is Andrei Kashcha's Software Galaxies, the whole registry drawn as a cloud of stars. I wanted the same picture but moving, one frame per year, to see the thing grow. His npm data stops at a snapshot from November 2020, so I had to build my own.

I also had an opinion ready before I counted anything. In 2019 Zimmermann and colleagues wrote that 20 maintainer accounts reach more than half of npm. I always filed it under the `left-pad` years. The registry grew from under a million packages to about 4.5 million since then, so I assumed the power had spread out with it. I never checked this, I just liked how it sounded.

## How I counted

On 8 October 2026 the replication endpoint of the registry listed 4465309 package names. Downloading all of them was not realistic, so I took a random sample of 30000 names and downloaded their full package documents. For every year from 2011 to 2026 I took the highest version that existed on 31 December of that year and its `dependencies`. 2026 is cut at the start of 8 October. Then I followed those dependencies down until nothing new was missing, which took 98736 package documents in the end.

These rules matter for every number below. A package exists in a year if it has a version with a date before the cut. An edge is one line in `dependencies` of that version, without dev or peer dependencies. Counts for the whole registry are the sample scaled by 4465309 / 30000. The counting is plain Python 3.12. The GIF was laid out with networkx 3.6, drawn with matplotlib 3.11 and packed with gifsicle 1.94.

Before trusting it I compared it with the old papers. Zimmermann had 1.3 direct dependencies per package in 2011 and 2.8 in 2018, I get 1.26 and 2.91. A 2026 paper by Robinson and colleagues found 61.3 percent of packages with at least 1 dependency, I get 60.7. Close enough to go on.

<figure class="fig">
<img src="/media/npm-graph-years/graph-en.gif" width="720" height="720" alt="Animated graph of a random sample of npm packages, one frame per year from 2011 to 8 October 2026. Green dots are packages with dependencies, grey dots in the outer ring are packages without them, orange circles are the 400 most used packages and blue lines are edges to them. The center grows from a few dots into a dense cloud around lodash, chalk, react and axios, and in 2024 a separate cluster of spam packages appears at the lower right. The counter goes from about 2800 packages to 4.45 million, and the share reached by the top account from 16 to 25 percent." aria-label="Animated graph of a random sample of npm packages, one frame per year from 2011 to 8 October 2026. Green dots are packages with dependencies, grey dots in the outer ring are packages without them, orange circles are the 400 most used packages and blue lines are edges to them. The center grows from a few dots into a dense cloud around lodash, chalk, react and axios, and in 2024 a separate cluster of spam packages appears at the lower right. The counter goes from about 2800 packages to 4.45 million, and the share reached by the top account from 16 to 25 percent." loading="lazy" style="display:block;width:100%;max-width:720px;height:auto;margin:0 auto;border-radius:8px">
<figcaption>One frame per year with the state on 31 December, the last one on 8 October 2026. The dots are the sample, the numbers in the corner are scaled to the whole registry.</figcaption>
</figure>

## Nodes and edges

At the end of 2011 the sample says about 2800 packages and 3600 edges. On 8 October 2026 it is 4.45 million packages and 19.4 million edges. Up to 2024 edges grow faster than nodes every year, which Kikas and colleagues already saw in 2017. In 2025 and 2026 it is the other way around.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Two lines on a log scale from 2011 to 2026, estimated for the whole registry from a random sample of 30000 names: 2011 2828 packages, 3572 edges; 2018 838 k packages, 2.44 M edges; 2023 2.51 M packages, 8.12 M edges; 2024 3.21 M packages, 16.1 M edges; 2026 4.45 M packages, 19.4 M edges. The edge line jumps in 2024, when edges doubled and packages grew by 28 percent.">
  <text x="10" y="16" class="f-label f-muted">npm packages and dependency edges at the end of each year, log scale</text>
  <line x1="64" y1="270.0" x2="600" y2="270.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="274.0" text-anchor="end" class="f-label f-muted">1 k</text>
  <line x1="64" y1="224.0" x2="600" y2="224.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="228.0" text-anchor="end" class="f-label f-muted">10 k</text>
  <line x1="64" y1="178.0" x2="600" y2="178.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="182.0" text-anchor="end" class="f-label f-muted">100 k</text>
  <line x1="64" y1="132.0" x2="600" y2="132.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="136.0" text-anchor="end" class="f-label f-muted">1 M</text>
  <line x1="64" y1="86.0" x2="600" y2="86.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="90.0" text-anchor="end" class="f-label f-muted">10 M</text>
  <line x1="64" y1="40.0" x2="600" y2="40.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="44.0" text-anchor="end" class="f-label f-muted">100 M</text>
  <path d="M64.0,244.6 L99.7,208.0 L135.5,179.3 L171.2,161.2 L206.9,146.3 L242.7,133.2 L278.4,122.6 L314.1,114.2 L349.9,108.0 L385.6,102.8 L421.3,98.2 L457.1,94.1 L492.8,90.2 L528.5,76.5 L564.3,74.7 L600.0,72.8" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <path d="M64.0,249.2 L99.7,215.3 L135.5,192.4 L171.2,175.7 L206.9,162.9 L242.7,151.4 L278.4,142.7 L314.1,135.5 L349.9,129.8 L385.6,125.1 L421.3,120.8 L457.1,117.0 L492.8,113.6 L528.5,108.7 L564.3,106.0 L600.0,102.2" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2.5"/>
  <circle cx="64.0" cy="244.6" r="3" style="fill:var(--accent)"/>
  <circle cx="64.0" cy="249.2" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="70.0" y="235.6" text-anchor="start" class="f-label f-ink">3572</text>
  <text x="70.0" y="266.2" text-anchor="start" class="f-label f-muted">2828</text>
  <circle cx="314.1" cy="114.2" r="3" style="fill:var(--accent)"/>
  <circle cx="314.1" cy="135.5" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="314.1" y="105.2" text-anchor="middle" class="f-label f-ink">2.44 M</text>
  <text x="314.1" y="152.5" text-anchor="middle" class="f-label f-muted">838 k</text>
  <circle cx="492.8" cy="90.2" r="3" style="fill:var(--accent)"/>
  <circle cx="492.8" cy="113.6" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="486.8" y="81.2" text-anchor="end" class="f-label f-ink">8.12 M</text>
  <text x="486.8" y="130.6" text-anchor="end" class="f-label f-muted">2.51 M</text>
  <circle cx="528.5" cy="76.5" r="3" style="fill:var(--accent)"/>
  <circle cx="528.5" cy="108.7" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="528.5" y="67.5" text-anchor="middle" class="f-label f-ink">16.1 M</text>
  <circle cx="600.0" cy="72.8" r="3" style="fill:var(--accent)"/>
  <circle cx="600.0" cy="102.2" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="594.0" y="63.8" text-anchor="end" class="f-label f-ink">19.4 M</text>
  <text x="594.0" y="119.2" text-anchor="end" class="f-label f-muted">4.45 M</text>
  <text x="514.5" y="50.5" text-anchor="end" class="f-label f-accent">2024: edges double</text>
  <line x1="74" y1="48" x2="98" y2="48" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="104" y="52" class="f-label f-ink">edges</text>
  <line x1="74" y1="66" x2="98" y2="66" class="f-ink" style="stroke:currentColor;stroke-width:2.5"/>
  <text x="104" y="70" class="f-label f-ink">packages</text>
  <text x="64.0" y="288" text-anchor="middle" class="f-label f-muted">2011</text>
  <text x="171.2" y="288" text-anchor="middle" class="f-label f-muted">2014</text>
  <text x="278.4" y="288" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="385.6" y="288" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="492.8" y="288" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="600.0" y="288" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Estimated for the whole registry: the sample count times 4465309 / 30000. 2026 is cut at the start of 8 October. Early years stand on few packages of the sample, 19 in 2011 and 104 in 2012.</figcaption>
</figure>

Then came 2024 and I thought I had a bug. Edges doubled in 1 year, from 8.1 million to 16.1 million, while packages grew by 28 percent. The average number of dependencies jumped from 3.24 to 5.02.

It was not a bug. Packages created in 2024 are 4724 in the sample and they carry 53391 edges, that is 41 percent of all edges in 2026. 431 of them have 20 or more dependencies and 81 percent of their edges go to other packages created in 2024 or later. The packages they point to have names like `gain-pleasant-prepare` and `anywhere-dream`. I opened the tarballs of those 431 and 430 could be read. 52 contain `tea.yaml`, the file of the tea.xyz reward protocol. Among 1376 packages created in 2023 with at least 1 dependency there were 0. So part of it is farming for that protocol and the rest I can not attribute.

I found them the annoying way. My download of the closure would not finish. Round after round 16 to 18 names were still missing, because `cadutdudut_128` depends on `cadutdudut_127`, which depends on `cadutdudut_126` and so on. I stopped with 15 names not downloaded. 11 of them are the next link of such a numbered chain, the other 4 hang off packages from the same months, March to May 2024. They change the closure sizes of spam a bit and nothing else.

## Who holds the graph

First the direct edges. In 2015 the 100 most used packages received 43 percent of all edges in the sample. In 2018 it was 34 percent, in 2023 it was 28 and in 2026 it is 20. Part of the last drop is the spam of 2024, because its edges go to each other. Still, on this measure my opinion was right and the graph spread out.

Then the transitive picture, which is what matters if an account gets stolen. For each package in the sample I took every package it pulls in through dependencies and every account listed as maintainer of those versions. Then I asked how many packages each account reaches.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Two lines from 2014 to 2026. The share of all direct dependency edges that go to the 100 most used packages falls: 2014 48.8%, 2015 42.6%, 2018 34%, 2023 28.4%, 2026 19.9%. The share of all packages that have a package of the top account somewhere in their dependencies stays between 25 and 35 percent from 2014: 2014 32.8% substack, 2015 35.2% substack, 2018 32.7% isaacs, 2023 29% sindresorhus, 2026 25.2% sindresorhus.">
  <text x="10" y="12" class="f-label f-muted">how concentrated the graph is, percent</text>
  <line x1="10" y1="28" x2="34" y2="28" class="f-ink" style="stroke:currentColor;stroke-width:2.5"/>
  <text x="40" y="32" class="f-label f-ink">edges that go to the 100 most used packages</text>
  <line x1="10" y1="48" x2="34" y2="48" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="40" y="52" class="f-label f-ink">packages reached by the top account</text>
  <line x1="64" y1="270.0" x2="600" y2="270.0" class="f-line" stroke-dasharray="2 4" opacity="1"/>
  <text x="56" y="274.0" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="64" y1="203.3" x2="600" y2="203.3" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="207.3" text-anchor="end" class="f-label f-muted">20%</text>
  <line x1="64" y1="136.7" x2="600" y2="136.7" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="140.7" text-anchor="end" class="f-label f-muted">40%</text>
  <line x1="64" y1="70.0" x2="600" y2="70.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="74.0" text-anchor="end" class="f-label f-muted">60%</text>
  <path d="M64.0,107.3 L108.7,128.0 L153.3,138.3 L198.0,150.3 L242.7,156.7 L287.3,160.3 L332.0,163.3 L376.7,167.7 L421.3,171.7 L466.0,175.3 L510.7,208.0 L555.3,206.3 L600.0,203.7" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2.5"/>
  <path d="M64.0,160.7 L108.7,152.7 L153.3,155.7 L198.0,161.0 L242.7,161.0 L287.3,160.0 L332.0,162.3 L376.7,169.0 L421.3,176.0 L466.0,173.3 L510.7,172.7 L555.3,178.7 L600.0,186.0" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="108.7" cy="128.0" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="112.7" y="118.0" text-anchor="start" class="f-label f-ink">43%</text>
  <circle cx="242.7" cy="156.7" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="242.7" y="174.7" text-anchor="middle" class="f-label f-ink">34%</text>
  <circle cx="466.0" cy="175.3" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="466.0" y="193.3" text-anchor="middle" class="f-label f-ink">28%</text>
  <circle cx="600.0" cy="203.7" r="3" class="f-ink" style="fill:currentColor"/>
  <text x="596.0" y="221.7" text-anchor="end" class="f-label f-ink">20%</text>
  <circle cx="108.7" cy="152.7" r="3" style="fill:var(--accent)"/>
  <text x="108.7" y="172.7" text-anchor="middle" class="f-label f-accent">35% substack</text>
  <circle cx="242.7" cy="161.0" r="3" style="fill:var(--accent)"/>
  <text x="242.7" y="151.0" text-anchor="middle" class="f-label f-accent">33% isaacs</text>
  <circle cx="600.0" cy="186.0" r="3" style="fill:var(--accent)"/>
  <text x="596.0" y="176.0" text-anchor="end" class="f-label f-accent">25% sindresorhus</text>
  <text x="64.0" y="288" text-anchor="middle" class="f-label f-muted">2014</text>
  <text x="153.3" y="288" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="242.7" y="288" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="332.0" y="288" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="421.3" y="288" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="510.7" y="288" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="600.0" y="288" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Reach of an account is the number of packages that pull in, through dependencies, a version where this account is listed as maintainer. The denominator is all packages, including the 39 percent without dependencies.</figcaption>
</figure>

The top account reached 35 percent of all packages in 2015 (`substack`), 33 percent in 2018 (`isaacs`) and 25 percent in 2026 (`sindresorhus`). All packages here means including the 39 percent that have no dependencies at all and can not be reached by anyone. Among packages with at least 1 dependency, 2 accounts are enough for half of them in every year since 2021.

How many accounts reach half of everything, in the same greedy order Zimmermann used: 11 in 2018 and 17 in 2026. I would not trust these to the unit. When I split the sample into 2 halves the result was 10 and 12 for 2018 and 14 and 19 for 2026, so the honest answer for today is "between 14 and 19". The share of the top account is stable, 25.0 and 25.5 percent on the 2 halves.

My count is not the same as theirs. They used the full registry up to April 2018, I used a sample and the highest version of each package. My 11 for 2018 against their 20 can be this difference and I would not read more into it.

So from 2015 the share of the top 100 packages in direct edges halved, but the reach of the top account went only from 35 to 25 percent. A quarter of npm still depends on one account. Some of the 17 accounts are not people: `types` is the account behind almost every `@types` package and `react-bot`, judging by the name, is a release bot of React.

## What I did not check

- "Maintainer" is the list in the version document. Being on the list says nothing about who publishes, who has 2FA or who uses trusted publishing.
- Packages that were unpublished or removed are missing from the registry today, so the early years are counted low. I do not know by how much.
- One version per package per year, without resolving the range of the parent. A real install can pull a different version with different dependencies.
- One random sample, one run. Early years stand on very few packages, 104 in 2012 and 754 in 2014, so I would not read anything from those years beyond the trend.

I still do not have a good picture of what to do with these 14 to 19 accounts. Most of them are people who did nothing wrong, they wrote small packages early and everybody depends on them.
