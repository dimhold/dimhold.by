---
title: "85% of MCP packages on npm have gone silent, the same share as new CLIs"
description: "I took 17,724 npm names with the word mcp that appeared in the year after the announcement and compared them with new CLIs and random names. 85.4% of the packages are silent for 90 days, CLIs give 84.8%. One silent package had 203,821 downloads in November, the 11 archived reference servers had 495,386."
date: 2025-12-07
lang: en
translationKey: mcp-year-later
tags: ["open-data", "dependencies", "agents"]
---

The first line of my table of MCP packages was `@expo/mcp-tunnel`, 5,482,633 downloads in November. I had never heard of it. `@expo/cli` took it as a dependency in 54.0.6 on September 16 and 54.0.17, released on December 4, does not have it any more. The second line was `@playwright/mcp` with 3,298,211, which I expected to see. The third, `@orval/mcp` with 1,484,239, again comes as a dependency, this time of the API client generator orval.

MCP was announced on November 25, 2024. For me MCP on npm was a graveyard, somebody publishes a server in an evening and never comes back. I had no number for it. With any package I look at the last publish date and the downloads and that decides whether it is alive.

Others have counted too. Hasan and colleagues studied 1,899 open source MCP servers in June, Guo and colleagues collected 17,630 entries from 6 markets in September and called more than half of the listed projects invalid or low value. Neither abstract has a control group of ordinary packages, so I wanted one.

## What I counted

I took 2 snapshots of all npm names from `all-the-package-names`, 2.0.1880 from November 25, 2024 and 2.0.2287 from December 6, 2025. Names that are only in the second one and have `mcp` as a separate word in them: 17,724. For each I read the registry document and threw away everything after December 6. For 1,028 names there was nothing to read by the time I asked, the package was removed or unpublished. A few more had no version before the cut, so 16,657 remain.

The controls are 2,000 random new names with the word `cli` and 2,000 of any kind, the same year and the same rules, 1,771 and 1,754 of them usable. I wrote the definitions down before the download. A package is silent if it is at least 90 days old and had no publication in the last 90 days. This is weaker than dead, a finished tool needs no releases and from outside I can't tell which one is finished.

Before any shares I removed the scopes with 100 packages or more, a limit I set only after a first look at the data. `@iflow-mcp` has 1,518 packages, 162 of them were first published on October 28 alone. `@mseep` has 567, 96.3% of them with exactly one version. There is also `@fastmcp-me` with 180. Of these 2,265 packages 1,417 have a twin, a package with the same name outside of the 3 scopes, so I think they are mostly republished copies. Together it is 13.6% of everything with `mcp` in the name.

## The graveyard is an ordinary one

Without these scopes 10,121 packages are at least 90 days old and 8,642 of them are silent. The controls are weighted to the same birth months, because a package from March had more time to go silent than one from August.

| | mcp | cli | random |
|---|---|---|---|
| last publication within a day of the first | 53.1% | 53.6% | 51.3% |
| silent for 90 days | 85.4% | 84.8% | 78.4% |
| published in the last 30 days | 6.4% | 6.9% | 10.6% |

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Share of packages whose last publication came later than a given number of days after the first one, for packages at least 180 days old. After 1 day: mcp 48.5%, cli 47.0%, random names 48.6%. After 60 days: 19.9%, 18.9%, 26.4%. After 180 days: 8.2%, 9.8%, 14.7%. The mcp and cli lines almost coincide, random names stay higher.">
  <line x1="56.0" y1="240.0" x2="570.0" y2="240.0" class="f-plain"/>
  <text x="48.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="187.5" x2="570.0" y2="187.5" class="f-plain"/>
  <text x="48.0" y="191.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="56.0" y1="135.0" x2="570.0" y2="135.0" class="f-plain"/>
  <text x="48.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="56.0" y1="82.5" x2="570.0" y2="82.5" class="f-plain"/>
  <text x="48.0" y="86.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="56.0" y1="30.0" x2="570.0" y2="30.0" class="f-plain"/>
  <text x="48.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="56.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="141.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="227.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="313.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <text x="398.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="484.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="570.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <polyline points="56.0,57.6 56.1,85.9 58.9,112.4 61.7,121.1 64.6,124.5 70.3,133.4 76.0,139.5 84.6,144.7 96.0,150.5 116.0,157.1 141.7,160.5 184.5,164.9 227.3,170.7 270.2,174.6 313.0,177.5 355.8,180.7 398.7,184.3 441.5,188.3 484.3,191.7 527.2,195.6 570.0,201.4" style="fill:none;stroke:var(--muted);stroke-width:1.6"/>
  <polyline points="56.0,46.8 56.1,84.6 58.9,116.6 61.7,130.0 64.6,136.1 70.3,145.0 76.0,149.2 84.6,154.9 96.0,161.8 116.0,168.1 141.7,173.1 184.5,183.8 227.3,190.4 270.2,194.1 313.0,197.7 355.8,200.1 398.7,202.2 441.5,205.3 484.3,208.5 527.2,210.6 570.0,214.3" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 3"/>
  <polyline points="56.0,37.1 56.1,75.7 58.9,112.7 61.7,124.2 64.6,131.3 70.3,139.5 76.0,146.3 84.6,152.1 96.0,158.6 116.0,166.8 141.7,173.6 184.5,181.7 227.3,187.8 270.2,192.5 313.0,196.9 355.8,201.2 398.7,204.6 441.5,208.5 484.3,211.1 527.2,215.1 570.0,218.5" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="578.0" y="187.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">random</text>
  <text x="578.0" y="201.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">14.7%</text>
  <text x="578.0" y="216.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">cli 9.8%</text>
  <text x="578.0" y="232.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">mcp 8.2%</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">published later, %</text>
  <text x="570.0" y="276.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">days since the first version</text>
</svg>
<figcaption>How many packages were still published after a given day. Only packages at least 180 days old: 5,175 mcp without the 3 mass scopes, 800 cli, 866 random. Birth months are not weighted here.</figcaption>
</figure>

I expected MCP to be clearly worse. Against CLIs there is no difference, the bootstrap interval for the silent CLIs is from 82.5% to 87.0%. Random names go silent less often, from 76.0% to 80.7%, but CLIs are just as far from them. My limit for scopes changes little, with scopes of 100 new names or more removed from all 3 groups it is 85.4%, 84.8% and 79.0%. My guess is that a small tool goes silent like this under any keyword.

Downloads are even a bit better. The median for packages without a scope is 18 in November, against 8 for CLIs and 8 for random names, here without the month weighting. A silent MCP package with a single version has a median of 4, so I would not read much into 18. 1% of these packages, 76 of 7,603, take 84.4% of their downloads.

## A silent package with 203,821 downloads

I had a criterion for "took off": 10,000 downloads in November. I found 119 such packages, 105 of them are at least 90 days old and 29 of these are silent. This is where my criterion broke. `n8n-nodes-mcp-client` is in the upper part of the table with 203,821 downloads. All its 18 versions came out on May 16 and 17 and in July it had 3,071 downloads.

<figure class="fig">
<svg viewBox="0 0 680 342" role="img" aria-label="Daily downloads from October 1 to December 6, 2025. n8n-nodes-mcp-client stays between 11,183 and 11,908 every day until November 17 and falls to 184 on November 19. use-mcp goes up to 8,573 on weekdays and drops to a few hundred on most weekends.">
  <line x1="64.0" y1="148.0" x2="664.0" y2="148.0" class="f-plain"/>
  <text x="56.0" y="152.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="93.0" x2="664.0" y2="93.0" class="f-plain"/>
  <text x="56.0" y="97.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6,000</text>
  <line x1="64.0" y1="38.0" x2="664.0" y2="38.0" class="f-plain"/>
  <text x="56.0" y="42.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">12,000</text>
  <rect x="65.0" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="74.0" y="41.5" width="7.0" height="106.5" style="fill:var(--accent);stroke:none"/>
  <rect x="82.9" y="42.5" width="7.0" height="105.5" style="fill:var(--accent);stroke:none"/>
  <rect x="91.9" y="39.9" width="7.0" height="108.1" style="fill:var(--muted);stroke:none"/>
  <rect x="100.8" y="41.3" width="7.0" height="106.7" style="fill:var(--muted);stroke:none"/>
  <rect x="109.8" y="42.1" width="7.0" height="105.9" style="fill:var(--accent);stroke:none"/>
  <rect x="118.7" y="42.8" width="7.0" height="105.2" style="fill:var(--accent);stroke:none"/>
  <rect x="127.7" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="136.6" y="42.1" width="7.0" height="105.9" style="fill:var(--accent);stroke:none"/>
  <rect x="145.6" y="41.9" width="7.0" height="106.1" style="fill:var(--accent);stroke:none"/>
  <rect x="154.6" y="41.4" width="7.0" height="106.6" style="fill:var(--muted);stroke:none"/>
  <rect x="163.5" y="41.9" width="7.0" height="106.1" style="fill:var(--muted);stroke:none"/>
  <rect x="172.5" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="181.4" y="42.6" width="7.0" height="105.4" style="fill:var(--accent);stroke:none"/>
  <rect x="190.4" y="45.5" width="7.0" height="102.5" style="fill:var(--accent);stroke:none"/>
  <rect x="199.3" y="43.5" width="7.0" height="104.5" style="fill:var(--accent);stroke:none"/>
  <rect x="208.3" y="43.7" width="7.0" height="104.3" style="fill:var(--accent);stroke:none"/>
  <rect x="217.2" y="41.7" width="7.0" height="106.3" style="fill:var(--muted);stroke:none"/>
  <rect x="226.2" y="41.0" width="7.0" height="107.0" style="fill:var(--muted);stroke:none"/>
  <rect x="235.1" y="41.2" width="7.0" height="106.8" style="fill:var(--accent);stroke:none"/>
  <rect x="244.1" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="253.1" y="42.2" width="7.0" height="105.8" style="fill:var(--accent);stroke:none"/>
  <rect x="262.0" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="271.0" y="41.3" width="7.0" height="106.7" style="fill:var(--accent);stroke:none"/>
  <rect x="279.9" y="41.1" width="7.0" height="106.9" style="fill:var(--muted);stroke:none"/>
  <rect x="288.9" y="40.6" width="7.0" height="107.4" style="fill:var(--muted);stroke:none"/>
  <rect x="297.8" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="306.8" y="41.0" width="7.0" height="107.0" style="fill:var(--accent);stroke:none"/>
  <rect x="315.7" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="324.7" y="41.6" width="7.0" height="106.4" style="fill:var(--accent);stroke:none"/>
  <rect x="333.7" y="41.7" width="7.0" height="106.3" style="fill:var(--accent);stroke:none"/>
  <rect x="342.6" y="41.3" width="7.0" height="106.7" style="fill:var(--muted);stroke:none"/>
  <rect x="351.6" y="41.8" width="7.0" height="106.2" style="fill:var(--muted);stroke:none"/>
  <rect x="360.5" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="369.5" y="42.4" width="7.0" height="105.6" style="fill:var(--accent);stroke:none"/>
  <rect x="378.4" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="387.4" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="396.3" y="42.4" width="7.0" height="105.6" style="fill:var(--accent);stroke:none"/>
  <rect x="405.3" y="41.4" width="7.0" height="106.6" style="fill:var(--muted);stroke:none"/>
  <rect x="414.3" y="41.2" width="7.0" height="106.8" style="fill:var(--muted);stroke:none"/>
  <rect x="423.2" y="42.5" width="7.0" height="105.5" style="fill:var(--accent);stroke:none"/>
  <rect x="432.2" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="441.1" y="41.0" width="7.0" height="107.0" style="fill:var(--accent);stroke:none"/>
  <rect x="450.1" y="40.1" width="7.0" height="107.9" style="fill:var(--accent);stroke:none"/>
  <rect x="459.0" y="40.9" width="7.0" height="107.1" style="fill:var(--accent);stroke:none"/>
  <rect x="468.0" y="39.2" width="7.0" height="108.8" style="fill:var(--muted);stroke:none"/>
  <rect x="476.9" y="38.8" width="7.0" height="109.2" style="fill:var(--muted);stroke:none"/>
  <rect x="485.9" y="39.8" width="7.0" height="108.2" style="fill:var(--accent);stroke:none"/>
  <rect x="494.9" y="116.4" width="7.0" height="31.6" style="fill:var(--accent);stroke:none"/>
  <rect x="503.8" y="146.3" width="7.0" height="1.7" style="fill:var(--accent);stroke:none"/>
  <rect x="512.8" y="146.4" width="7.0" height="1.6" style="fill:var(--accent);stroke:none"/>
  <rect x="521.7" y="145.2" width="7.0" height="2.8" style="fill:var(--accent);stroke:none"/>
  <rect x="530.7" y="145.4" width="7.0" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="539.6" y="145.6" width="7.0" height="2.4" style="fill:var(--muted);stroke:none"/>
  <rect x="548.6" y="146.1" width="7.0" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="557.5" y="146.3" width="7.0" height="1.7" style="fill:var(--accent);stroke:none"/>
  <rect x="566.5" y="146.7" width="7.0" height="1.3" style="fill:var(--accent);stroke:none"/>
  <rect x="575.4" y="146.1" width="7.0" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="584.4" y="146.8" width="7.0" height="1.2" style="fill:var(--accent);stroke:none"/>
  <rect x="593.4" y="146.8" width="7.0" height="1.2" style="fill:var(--muted);stroke:none"/>
  <rect x="602.3" y="146.8" width="7.0" height="1.2" style="fill:var(--muted);stroke:none"/>
  <rect x="611.3" y="147.3" width="7.0" height="0.7" style="fill:var(--accent);stroke:none"/>
  <rect x="620.2" y="147.4" width="7.0" height="0.6" style="fill:var(--accent);stroke:none"/>
  <rect x="629.2" y="147.5" width="7.0" height="0.5" style="fill:var(--accent);stroke:none"/>
  <rect x="638.1" y="147.4" width="7.0" height="0.6" style="fill:var(--accent);stroke:none"/>
  <rect x="647.1" y="147.7" width="7.0" height="0.3" style="fill:var(--accent);stroke:none"/>
  <rect x="656.0" y="147.6" width="7.0" height="0.4" style="fill:var(--muted);stroke:none"/>
  <text x="64.0" y="30.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">n8n-nodes-mcp-client</text>
  <text x="65.0" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Oct 1</text>
  <text x="342.6" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Nov 1</text>
  <text x="611.3" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Dec 1</text>
  <line x1="64.0" y1="316.0" x2="664.0" y2="316.0" class="f-plain"/>
  <text x="56.0" y="320.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="261.0" x2="664.0" y2="261.0" class="f-plain"/>
  <text x="56.0" y="265.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6,000</text>
  <line x1="64.0" y1="206.0" x2="664.0" y2="206.0" class="f-plain"/>
  <text x="56.0" y="210.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">12,000</text>
  <rect x="65.0" y="265.9" width="7.0" height="50.1" style="fill:var(--accent);stroke:none"/>
  <rect x="74.0" y="252.9" width="7.0" height="63.1" style="fill:var(--accent);stroke:none"/>
  <rect x="82.9" y="267.5" width="7.0" height="48.5" style="fill:var(--accent);stroke:none"/>
  <rect x="91.9" y="303.3" width="7.0" height="12.7" style="fill:var(--muted);stroke:none"/>
  <rect x="100.8" y="307.0" width="7.0" height="9.0" style="fill:var(--muted);stroke:none"/>
  <rect x="109.8" y="257.5" width="7.0" height="58.5" style="fill:var(--accent);stroke:none"/>
  <rect x="118.7" y="252.7" width="7.0" height="63.3" style="fill:var(--accent);stroke:none"/>
  <rect x="127.7" y="242.0" width="7.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="136.6" y="258.5" width="7.0" height="57.5" style="fill:var(--accent);stroke:none"/>
  <rect x="145.6" y="273.1" width="7.0" height="42.9" style="fill:var(--accent);stroke:none"/>
  <rect x="154.6" y="310.0" width="7.0" height="6.0" style="fill:var(--muted);stroke:none"/>
  <rect x="163.5" y="312.8" width="7.0" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="172.5" y="267.1" width="7.0" height="48.9" style="fill:var(--accent);stroke:none"/>
  <rect x="181.4" y="272.3" width="7.0" height="43.7" style="fill:var(--accent);stroke:none"/>
  <rect x="190.4" y="249.3" width="7.0" height="66.7" style="fill:var(--accent);stroke:none"/>
  <rect x="199.3" y="241.4" width="7.0" height="74.6" style="fill:var(--accent);stroke:none"/>
  <rect x="208.3" y="265.0" width="7.0" height="51.0" style="fill:var(--accent);stroke:none"/>
  <rect x="217.2" y="313.6" width="7.0" height="2.4" style="fill:var(--muted);stroke:none"/>
  <rect x="226.2" y="311.2" width="7.0" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="235.1" y="290.8" width="7.0" height="25.2" style="fill:var(--accent);stroke:none"/>
  <rect x="244.1" y="241.3" width="7.0" height="74.7" style="fill:var(--accent);stroke:none"/>
  <rect x="253.1" y="244.3" width="7.0" height="71.7" style="fill:var(--accent);stroke:none"/>
  <rect x="262.0" y="258.2" width="7.0" height="57.8" style="fill:var(--accent);stroke:none"/>
  <rect x="271.0" y="274.8" width="7.0" height="41.2" style="fill:var(--accent);stroke:none"/>
  <rect x="279.9" y="309.6" width="7.0" height="6.4" style="fill:var(--muted);stroke:none"/>
  <rect x="288.9" y="308.9" width="7.0" height="7.1" style="fill:var(--muted);stroke:none"/>
  <rect x="297.8" y="261.5" width="7.0" height="54.5" style="fill:var(--accent);stroke:none"/>
  <rect x="306.8" y="260.6" width="7.0" height="55.4" style="fill:var(--accent);stroke:none"/>
  <rect x="315.7" y="261.7" width="7.0" height="54.3" style="fill:var(--accent);stroke:none"/>
  <rect x="324.7" y="260.1" width="7.0" height="55.9" style="fill:var(--accent);stroke:none"/>
  <rect x="333.7" y="264.4" width="7.0" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="342.6" y="314.3" width="7.0" height="1.7" style="fill:var(--muted);stroke:none"/>
  <rect x="351.6" y="314.9" width="7.0" height="1.1" style="fill:var(--muted);stroke:none"/>
  <rect x="360.5" y="249.9" width="7.0" height="66.1" style="fill:var(--accent);stroke:none"/>
  <rect x="369.5" y="282.7" width="7.0" height="33.3" style="fill:var(--accent);stroke:none"/>
  <rect x="378.4" y="261.0" width="7.0" height="55.0" style="fill:var(--accent);stroke:none"/>
  <rect x="387.4" y="261.9" width="7.0" height="54.1" style="fill:var(--accent);stroke:none"/>
  <rect x="396.3" y="237.4" width="7.0" height="78.6" style="fill:var(--accent);stroke:none"/>
  <rect x="405.3" y="308.0" width="7.0" height="8.0" style="fill:var(--muted);stroke:none"/>
  <rect x="414.3" y="303.4" width="7.0" height="12.6" style="fill:var(--muted);stroke:none"/>
  <rect x="423.2" y="242.0" width="7.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="432.2" y="240.0" width="7.0" height="76.0" style="fill:var(--accent);stroke:none"/>
  <rect x="441.1" y="248.6" width="7.0" height="67.4" style="fill:var(--accent);stroke:none"/>
  <rect x="450.1" y="246.0" width="7.0" height="70.0" style="fill:var(--accent);stroke:none"/>
  <rect x="459.0" y="239.5" width="7.0" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="468.0" y="315.2" width="7.0" height="0.8" style="fill:var(--muted);stroke:none"/>
  <rect x="476.9" y="315.1" width="7.0" height="0.9" style="fill:var(--muted);stroke:none"/>
  <rect x="485.9" y="238.2" width="7.0" height="77.8" style="fill:var(--accent);stroke:none"/>
  <rect x="494.9" y="246.4" width="7.0" height="69.6" style="fill:var(--accent);stroke:none"/>
  <rect x="503.8" y="258.7" width="7.0" height="57.3" style="fill:var(--accent);stroke:none"/>
  <rect x="512.8" y="251.4" width="7.0" height="64.6" style="fill:var(--accent);stroke:none"/>
  <rect x="521.7" y="264.4" width="7.0" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="530.7" y="311.1" width="7.0" height="4.9" style="fill:var(--muted);stroke:none"/>
  <rect x="539.6" y="311.9" width="7.0" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="548.6" y="257.3" width="7.0" height="58.7" style="fill:var(--accent);stroke:none"/>
  <rect x="557.5" y="252.3" width="7.0" height="63.7" style="fill:var(--accent);stroke:none"/>
  <rect x="566.5" y="246.5" width="7.0" height="69.5" style="fill:var(--accent);stroke:none"/>
  <rect x="575.4" y="290.9" width="7.0" height="25.1" style="fill:var(--accent);stroke:none"/>
  <rect x="584.4" y="288.4" width="7.0" height="27.6" style="fill:var(--accent);stroke:none"/>
  <rect x="593.4" y="310.6" width="7.0" height="5.4" style="fill:var(--muted);stroke:none"/>
  <rect x="602.3" y="302.6" width="7.0" height="13.4" style="fill:var(--muted);stroke:none"/>
  <rect x="611.3" y="249.0" width="7.0" height="67.0" style="fill:var(--accent);stroke:none"/>
  <rect x="620.2" y="273.8" width="7.0" height="42.2" style="fill:var(--accent);stroke:none"/>
  <rect x="629.2" y="282.2" width="7.0" height="33.8" style="fill:var(--accent);stroke:none"/>
  <rect x="638.1" y="260.5" width="7.0" height="55.5" style="fill:var(--accent);stroke:none"/>
  <rect x="647.1" y="267.5" width="7.0" height="48.5" style="fill:var(--accent);stroke:none"/>
  <rect x="656.0" y="312.1" width="7.0" height="3.9" style="fill:var(--muted);stroke:none"/>
  <text x="64.0" y="198.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">use-mcp</text>
  <text x="65.0" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Oct 1</text>
  <text x="342.6" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Nov 1</text>
  <text x="611.3" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Dec 1</text>
  <text x="664.0" y="14.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">downloads per day</text>
</svg>
<figcaption>2 silent packages, downloads per day from October 1 to December 6, weekends in grey. The first was last published on May 17, the second on July 25.</figcaption>
</figure>

From October 1 to November 17 it was downloaded between 11,183 and 11,908 times every day, weekends included. On November 19 it had 184. `@mzxrai/mcp-webresearch`, last published in December 2024, was between 4,543 and 5,851 a day from October 1 to November 10 and had 27 on November 11. People do not download like this. I think these are a few machines that somebody switched off, I do not know whose.

The monthly sums only told me that my criterion was bad, so I wrote down 2 more thresholds and then fetched the daily series for all 119. A package keeps the working week if its average weekend day in November is below 0.7 of a weekday. It is a spike if 3 days give more than 40% of the month. Of 29 silent packages 17 keep the working week and 4 are spikes, with one in both groups. But `use-mcp`, silent since July 25, has 138,495 downloads and a clear weekly rhythm, which looks like people and their CI. By the release date I would have buried it.

## Archived, 495,386 a month

On May 28 the repository `servers-archived` appeared and 11 of the reference servers on npm ended up there. They had 476,704 downloads in May and 495,386 in November, 27.2% of everything the reference servers got. The 4 that stayed grew from 402,245 to 1,325,856. `server-postgres` has a last version from December 4, 2024 and it still went from 78,653 to 100,059 a month. 8 of the 11 pin `@modelcontextprotocol/sdk` to exactly 1.0.1.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Monthly npm downloads of the reference servers from December 2024 to November 2025, thousands. 11 archived servers: 38, 33, 45, 312, 454, 477, 635, 615, 452, 493, 568, 495. 4 remaining servers: 32, 34, 42, 239, 321, 402, 481, 862, 1221, 1545, 1398, 1326.">
  <line x1="64.0" y1="230.0" x2="560.0" y2="230.0" class="f-plain"/>
  <text x="56.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="180.0" x2="560.0" y2="180.0" class="f-plain"/>
  <text x="56.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="64.0" y1="130.0" x2="560.0" y2="130.0" class="f-plain"/>
  <text x="56.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="64.0" y1="80.0" x2="560.0" y2="80.0" class="f-plain"/>
  <text x="56.0" y="84.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,200</text>
  <line x1="64.0" y1="30.0" x2="560.0" y2="30.0" class="f-plain"/>
  <text x="56.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,600</text>
  <text x="64.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Dec</text>
  <text x="154.2" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb</text>
  <text x="244.4" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="334.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jun</text>
  <text x="424.7" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Aug</text>
  <text x="514.9" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <line x1="307.5" y1="30.0" x2="307.5" y2="230.0" class="f-plain" style="stroke-dasharray:4 4"/>
  <polyline points="64.0,226.0 109.1,225.7 154.2,224.7 199.3,200.1 244.4,189.9 289.5,179.7 334.5,169.9 379.6,122.2 424.7,77.4 469.8,36.9 514.9,55.2 560.0,64.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="64.0,225.2 109.1,225.9 154.2,224.4 199.3,190.9 244.4,173.2 289.5,170.4 334.5,150.6 379.6,153.2 424.7,173.6 469.8,168.3 514.9,159.0 560.0,168.1" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="568.0" y="61.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4 remaining</text>
  <text x="568.0" y="76.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1,325,856</text>
  <text x="568.0" y="165.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11 archived</text>
  <text x="568.0" y="180.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">495,386</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">downloads per month, thousands</text>
</svg>
<figcaption>Reference servers on npm, downloads per month. The dashed line is May 28, when the archive repository appeared.</figcaption>
</figure>

Then there is the official registry, opened in September. The MCP blog wrote on November 25 that it has close to 2,000 entries. The API gives me 2,019 entries published before that day, but every version is an entry there and I count 884 distinct names. By my cut it is 2,457 and 987, 430 of the names are only remote, with no package at all.

## What I did not check

Only npm and only names with the word `mcp`, so no PyPI, no Docker images and no servers that live in a repository. The downloads API gives scoped names one at a time and throttles, so I have all unscoped names but only 568 random scoped ones and 400 that npm search shows first. 119 is a lower bound and a silent scoped package that the search hides could be missing from the 29. Removed packages are not in the shares, I would expect most of them to be silent. The month weighting covers the age, but I did not match authors or companies. I did not run a single server.
