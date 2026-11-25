---
title: "GitHub got 3 new MCP repositories on the day of the announcement and 54 a week later"
description: "I counted repositories with MCP in the name in GH Archive from November 11 to December 14, 2024. There were 3 on the day of the announcement, 54 a week later and 41 a day on average. About 4 of 5 substring matches before the announcement were somebody else's letters. On days 4 to 7 about 7 of 8 newborns are quiet, only slightly better than random repositories."
date: 2024-12-15
lang: en
translationKey: mcp-repos-born
tags: ["open-data", "agents", "numbers"]
---

On November 25 at 16:43 UTC the archive of public GitHub events shows a `PublicEvent` for `modelcontextprotocol/.github`. By 16:49 the same event has come for `specification`, `servers` and 4 more. This is Anthropic opening the Model Context Protocol, a common way for a language model application to talk to tools and data. These minutes are not exact, the first star on `python-sdk` is already there at 16:18. Then the first repository with MCP in its name is created in public, `spullara/mcp-server` at 19:40. The second one, at 20:20, is already an awesome list.

For 3 weeks I read that MCP is exploding. I repeated it too, with nothing behind it but my own feed. New repositories can be counted, so I counted them up to December 14.

## How I counted

GH Archive writes down every public event on GitHub. I used its full copy in the public ClickHouse playground, table `github_events`. One hour I also counted in the raw file, 10,383 repository creations both times. A birth is a `CreateEvent` with `ref_type` equal to `repository`.

I wrote the rules before the first query, because the letters are not exclusive. MCP is also a family of Microchip parts and the Minecraft people put it in `mcpe` and `mcpack`. So a name counts only if `mcp` stands there as a separate word (I split camel case) or if it says model context protocol. The 14 days before the announcement are the control. Everything the rule catches there I call noise.

I expected from 5 to 15 false names a day. It was 1.7.

## What came out

Before the announcement there were 24 such names in 14 days. If I just look for the substring it is 109, so about 4 of 5 are somebody else's letters. After the announcement the separate word gives 789 births in 20 days against 982 for the substring.

<figure class="fig">
<svg viewBox="0 0 680 272" role="img" aria-label="Public repositories created per day from November 11 to December 14, 2024, whose name contains mcp. Before November 25 there are 4 to 12 a day and only 0 to 6 of them have mcp as a separate word. On November 25 it is 3, on November 26 it is 33, the highest day is December 2 with 54. On the other days after November 25 it is between 26 and 50.">
  <line x1="46" y1="230.0" x2="664" y2="230.0" class="f-plain"/>
  <text x="38.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="46" y1="176.9" x2="664" y2="176.9" class="f-plain"/>
  <text x="38.0" y="180.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="46" y1="123.7" x2="664" y2="123.7" class="f-plain"/>
  <text x="38.0" y="127.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="46" y1="70.6" x2="664" y2="70.6" class="f-plain"/>
  <text x="38.0" y="74.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="48.0" y="211.4" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="48.0" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="55.1" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="66.2" y="198.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="66.2" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="84.4" y="219.4" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="84.4" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="91.4" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <rect x="102.5" y="206.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="102.5" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <rect x="120.7" y="198.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="120.7" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <text x="127.8" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <rect x="138.9" y="208.7" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="138.9" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <rect x="157.1" y="206.1" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="157.1" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="164.1" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">17</text>
  <rect x="175.2" y="214.1" width="14.2" height="15.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="175.2" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <rect x="193.4" y="219.4" width="14.2" height="8.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="193.4" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="200.5" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">19</text>
  <rect x="211.6" y="216.7" width="14.2" height="5.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="211.6" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="229.8" y="214.1" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="229.8" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="236.9" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">21</text>
  <rect x="247.9" y="203.4" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="247.9" y="214.1" width="14.2" height="15.9" style="fill:var(--accent);stroke:none"/>
  <rect x="266.1" y="211.4" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="266.1" y="224.7" width="14.2" height="5.3" style="fill:var(--accent);stroke:none"/>
  <text x="273.2" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23</text>
  <rect x="284.3" y="203.4" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="284.3" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="302.5" y="195.5" width="14.2" height="26.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="302.5" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <text x="309.6" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <line x1="300.5" y1="44" x2="300.5" y2="230" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="294.5" y="54.0" text-anchor="end" class="f-label f-ink" style="font-size:10px">announcement</text>
  <rect x="320.6" y="113.1" width="14.2" height="29.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="320.6" y="142.3" width="14.2" height="87.7" style="fill:var(--accent);stroke:none"/>
  <rect x="338.8" y="142.3" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="338.8" y="160.9" width="14.2" height="69.1" style="fill:var(--accent);stroke:none"/>
  <text x="345.9" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">27</text>
  <rect x="357.0" y="139.7" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="357.0" y="152.9" width="14.2" height="77.1" style="fill:var(--accent);stroke:none"/>
  <rect x="375.2" y="75.9" width="14.2" height="50.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="375.2" y="126.4" width="14.2" height="103.6" style="fill:var(--accent);stroke:none"/>
  <text x="382.3" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">29</text>
  <rect x="393.4" y="78.5" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="393.4" y="102.5" width="14.2" height="127.5" style="fill:var(--accent);stroke:none"/>
  <rect x="411.5" y="94.5" width="14.2" height="37.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="411.5" y="131.7" width="14.2" height="98.3" style="fill:var(--accent);stroke:none"/>
  <text x="418.6" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="411.5" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">December</text>
  <rect x="429.7" y="62.6" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="429.7" y="86.5" width="14.2" height="143.5" style="fill:var(--accent);stroke:none"/>
  <text x="436.8" y="57.6" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">54</text>
  <rect x="447.9" y="67.9" width="14.2" height="45.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="447.9" y="113.1" width="14.2" height="116.9" style="fill:var(--accent);stroke:none"/>
  <text x="455.0" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <rect x="466.1" y="86.5" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="466.1" y="97.1" width="14.2" height="132.9" style="fill:var(--accent);stroke:none"/>
  <rect x="484.2" y="86.5" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="484.2" y="107.8" width="14.2" height="122.2" style="fill:var(--accent);stroke:none"/>
  <text x="491.3" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <rect x="502.4" y="54.6" width="14.2" height="50.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="502.4" y="105.1" width="14.2" height="124.9" style="fill:var(--accent);stroke:none"/>
  <rect x="520.6" y="121.1" width="14.2" height="2.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="520.6" y="123.7" width="14.2" height="106.3" style="fill:var(--accent);stroke:none"/>
  <text x="527.7" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <rect x="538.8" y="99.8" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="538.8" y="121.1" width="14.2" height="108.9" style="fill:var(--accent);stroke:none"/>
  <rect x="556.9" y="97.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="556.9" y="121.1" width="14.2" height="108.9" style="fill:var(--accent);stroke:none"/>
  <text x="564.0" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <rect x="575.1" y="129.0" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="575.1" y="150.3" width="14.2" height="79.7" style="fill:var(--accent);stroke:none"/>
  <rect x="593.3" y="86.5" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="593.3" y="110.4" width="14.2" height="119.6" style="fill:var(--accent);stroke:none"/>
  <text x="600.4" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="611.5" y="97.1" width="14.2" height="8.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="611.5" y="105.1" width="14.2" height="124.9" style="fill:var(--accent);stroke:none"/>
  <rect x="629.6" y="81.2" width="14.2" height="29.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="629.6" y="110.4" width="14.2" height="119.6" style="fill:var(--accent);stroke:none"/>
  <text x="636.7" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <rect x="647.8" y="81.2" width="14.2" height="31.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="647.8" y="113.1" width="14.2" height="116.9" style="fill:var(--accent);stroke:none"/>
  <text x="46.0" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">November</text>
  <rect x="46.0" y="10.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="64.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">mcp as a word</text>
  <rect x="286.0" y="10.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="304.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">letters inside another word</text>
</svg>
<figcaption>New repositories per day (CreateEvent). Accent: mcp is a separate word in the name. Grey: the letters are inside another word. 54 is the accent part alone.</figcaption>
</figure>

On November 25 there were 3 and on the 26th 33. The 19 full days after the announcement average 41.4, which is 24 times the control. If the noise stayed at 1.7, it is about 4% of that. I wrote down that the peak would be in the first 3 days and then a decline. The peak is Monday December 2, with 54. After it every day is between 30 and 50 without an obvious slope. Weekly averages are 38.0 and 44.1, the last 5 days give 42.2. So far it looks like a step.

On weekends GitHub as a whole gets 16% fewer new repositories than on weekdays in this window. MCP got 42.0 on a weekend day and 41.1 on a weekday. I already had a sentence about people doing it in their own time, then I looked at the names. 11 of the 44 births on Saturday December 14 come from one account. One of its 2 organizations is called `TWI-Master-Control-Program`, this is another MCP, my rule can't tell. Without these 11 the weekend is 39.8 and the last 5 days are 40.0. There is still no dip of 16%, but 5 weekend days are not enough to say more.

Of 769 distinct names 217 have `server` or `servers` and only 16 have `client`. In 144 I see words like `test` or `demo`. One is called `built-by-claude-with-mcp` and describes itself as "A demonstration of creating and managing a repository using Claude". I think some of the tests were created through MCP, by asking Claude to make a repository, but I can't separate them by name.

## Do they live

Kalliamvakou and colleagues wrote in 2014 in "The Promises and Perils of Mining GitHub" that most projects there have few commits and are inactive. I added a comparison only when I already had my first death rate, so it is not in the rules I wrote before. I took all 483 MCP repositories born by December 7 and 4,194 random ones born in the same days, chosen by a hash of the name.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Share of repositories among 483 MCP ones and 4,194 random ones born in the same days. No push at all: 36.6 against 47.7 percent. A push on days 1 to 7: 28.2 against 18.4. A push on days 4 to 7: 12.4 against 8.6. At least one star: 33.3 against 3.4.">
  <rect x="200.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="218.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">MCP</text>
  <rect x="290.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="308.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">random</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">% of repositories</text>
  <text x="188.0" y="59.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">no push at all</text>
  <rect x="200.0" y="36.0" width="293.2" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="499.2" y="49.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">36.6</text>
  <rect x="200.0" y="55.0" width="381.9" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="587.9" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">47.7</text>
  <text x="188.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">push on days 1 to 7</text>
  <rect x="200.0" y="86.0" width="225.3" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="431.3" y="99.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">28.2</text>
  <rect x="200.0" y="105.0" width="147.4" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="353.4" y="118.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18.4</text>
  <text x="188.0" y="159.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">push on days 4 to 7</text>
  <rect x="200.0" y="136.0" width="99.4" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="305.4" y="149.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">12.4</text>
  <rect x="200.0" y="155.0" width="69.1" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="275.1" y="168.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">8.6</text>
  <text x="188.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">at least one star</text>
  <rect x="200.0" y="186.0" width="266.7" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="472.7" y="199.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">33.3</text>
  <rect x="200.0" y="205.0" width="27.5" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="233.5" y="218.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3.4</text>
  <line x1="200" y1="30" x2="200" y2="226" class="f-plain"/>
</svg>
<figcaption>What happened by December 14 to repositories born from November 25 to December 7. Accent: 483 with MCP in the name. Grey: 4,194 random ones of the same days.</figcaption>
</figure>

36.6% of the MCP repositories never had a push in the archive. That sounded bad until I saw 47.7% for the random ones. On days 1 to 7 after the birth 28.2% got a push against 18.4%. On days 4 to 7 it is 12.4% against 8.6%. Part of this is only that fewer of them were empty from the start. If I keep only those with at least one push, days 1 to 7 give 44.4% against 35.3% and days 4 to 7 give 19.6% against 16.5%. On the second pair I would not bet, there are only 306 MCP repositories in it. So the first days are livelier than for a random repository, but on days 4 to 7 about 7 of 8 are quiet.

With stars the gap is much wider, 33.3% of them got at least one against 3.4%. But 541 of all 769 have none and the top 10 hold 57% of 3,187 stars. The first place with 980 belongs to `punkpeye/awesome-mcp-servers`, which is a list of links. The official `modelcontextprotocol/servers` alone got 4,298 in the same time, more than all 769 together.

## Where my rule is blind

The official repositories are not in my count at all. They have MCP in the owner and I saw them only by mistake, one of my 2 patterns ran over the full name although my rule said the part after the slash. The 9 from the first days also have no birth in the archive, at least since September 1. 7 of them have a `PublicEvent`, so they were created closed and opened later. For the 2 TypeScript ones I don't see even that.

The same goes for other people who knew early. `anaisbetts/mcp-youtube` has no `CreateEvent`, only a `PublicEvent` at 17:14 on November 25. But repository ids on GitHub grow and the id in the raw file, 891110939, falls between 18:00 and 19:00 UTC on November 19, 6 days before the announcement. I counted 77 such openings with MCP in the name and did not look up the ids of the others.

Descriptions are not in the ClickHouse table, only in the raw files and the hour I compared weighs 199 MB. I read the first 6 MB of each of the 480 hours, 6.3% of all births. Of 35 repositories which mention MCP in the description my rule by name finds 32. The rule found 51 there, which scales to about 805 against the 789 of the full count. I wrote down that less than a third would be missed, this one was right.

## What I didn't check

I did not look at the code. An empty repository called `mcp-server` counts the same as a working one. The language is not in the birth event and from the names I can read it for only about 30 repositories. A rename or a repository made private later looks here like a death and maybe so does one where GitHub itself added the only README. The random ones I chose by a hash of the name and never looked at. People who write a server inside an existing repository are not here at all and the most serious integrations may be exactly there. And 20 days is short.
