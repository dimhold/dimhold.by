---
title: "Who holds the key to an npm package. In 2026 most releases carry the name of a machine"
description: "I read the publish record of the 5000 most downloaded npm packages. Almost half have 1 maintainer, in 19 percent the first author is gone from the list and 1798 have not released for 2 years. In 2026 most releases come from a machine, 1429 through trusted publishing. That change made my own count of abandoned packages wrong: the honest range is 213 to 369."
date: 2026-10-08
lang: en
translationKey: npm-maintainer-life
tags: ["dependencies", "open-data", "statistics"]
---
In 2018 the author of `event-stream` gave the package to a stranger who asked for it. The stranger added code that went after a bitcoin wallet app, Copay. I have used this story for years as the short version of how an npm package lives. One person writes it, gets tired, then either hands it to someone or walks away. I told it in code reviews, but I never counted how often each of these endings happens.

The registry keeps enough to count it. Every version in a package document carries `_npmUser`, the account that published it. Next to it are the publish time and the maintainers at that moment. On 8 October 2026 I took the 5000 most downloaded names from `npm-high-impact` 1.13.0, a list from June 2026. A small script in Python 3.12 downloaded the full document of each one. 4 could not be used, which leaves 4996 packages and 965617 versions with a date.

`_npmUser` is the account that pressed publish or whose token did. It says nothing about who wrote the code, for that you need git history, which I did not open. Everything below is about who holds the key.

## Who publishes

Almost half of the list is one person. 2351 packages, 47 percent, have exactly 1 maintainer today. 2504 never had a version published by a second human account. Where 2 or more people have rights, the median package still got 73 percent of its versions from one account.

My first table of "authors" was wrong in a funny way. In second place, with 217 packages, stood `types`, which is the DefinitelyTyped bot from Microsoft. Google's `google-wombot` had published 78061 versions. Before counting people I had to separate machines. A version is machine made if npm marks it as trusted publishing. It also counts if the name looks like a bot or a release pipeline. I added 14 company accounts by hand. Then I took 10 accounts back out of the pattern, because `ceejbot` and `jonkoops` are people. I would not trust this split further than a few percent.

## Who hands over

4539 packages had at least one version from a human account. In 2864 of them, 63 percent, the first human publisher is also the last one. 2035 packages got a second human publisher at some point, with a median of 14 months after the first.

Of those 2035, 1292 still list the first author as a maintainer. Across all 4539 the first author is gone from the list in 878 packages, 19 percent. Among them are `debug`, `commander` and `express`. The first recorded publisher of all 3 is TJ Holowaychuk and none of them lists him today. `event-stream` is here too, its only maintainer now is npm's own account `npm`.

## Who disappears

1798 packages, 36 percent, have not released anything in 2 years. I use the 2 year line from the study "What are Weak Links in the npm Supply Chain?" (ICSE SEIP 2022). Many small libraries are simply finished. 104 of the quiet ones are marked deprecated, so somebody said goodbye explicitly.

Is anybody still there? My first answer was 664 packages where no human maintainer had published anything in 2 years. I was ready to put it in the text, then I saw that I had checked people only inside my 5000, while they may publish other packages every week. So I asked the registry search, `/-/v1/search`, about each of the 1077 maintainers of quiet packages. For each one I took the newest package they had published anywhere. This took 25 minutes and cut the number to 369.

In 369 packages that are quiet and not deprecated, no human maintainer has published anything anywhere in the registry for 2 years. 316 of them have a single maintainer. The median one of them was downloaded 13 million times last week and `shebang-command` almost 300 million times. Miller and colleagues at ICSE 2025 found 14.6 percent of 28100 widely used npm packages abandoned between 2015 and 2020. They counted more carefully than me and with their own definition.

## The name that disappears

I went in to count abandoned packages, but the biggest change was elsewhere. In 2024, 2836 packages from my list released something. For 672 of them the last release of the year came from a machine account. None came through trusted publishing, because it did not exist yet. In 2026, up to 8 October, 2542 packages released. For 1704 of them the last release came from a machine. In 1429 of those it came through trusted publishing.

Trusted publishing became generally available on npm on 31 July 2025 and the first such version in my set is from 25 July. It lets a GitHub or GitLab CI workflow publish with a token issued for 1 run. In September 2025 the Shai Hulud worm spread through stolen npm tokens. On 9 December 2025 npm revoked all classic tokens. The jump after the worm is visible in the monthly numbers, from 15 percent of releasing packages in September 2025 to 33 percent in October. The peak was June 2026 with 941 of 1387, 68 percent. In September 2026 it was 58 percent.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Monthly bars from June 2025 to September 2026. Each bar is the share of packages from the top 4996 that released that month and whose last release in the month came through trusted publishing: 2025-06 0%, 2025-07 1%, 2025-08 6%, 2025-09 15%, 2025-10 33%, 2025-11 32%, 2025-12 40%, 2026-01 48%, 2026-02 51%, 2026-03 52%, 2026-04 57%, 2026-05 56%, 2026-06 68%, 2026-07 62%, 2026-08 63%, 2026-09 58%. Markers show general availability on 31 July 2025, the Shai Hulud worm in September 2025 and the revocation of classic tokens on 9 December 2025.">
  <text x="10" y="12" class="f-label f-muted">packages that released in a month, share through trusted publishing</text>
  <line x1="50" y1="232" x2="620" y2="232" class="f-line"/>
  <text x="42" y="66" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="42" y="232" text-anchor="end" class="f-label f-muted">0</text>
  <rect x="54.0" y="232.0" width="27.6" height="0.5" style="fill:var(--accent)"/>
  <text x="67.8" y="227.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="67.8" y="248" text-anchor="middle" class="f-label f-muted">Jun</text>
  <rect x="89.6" y="230.3" width="27.6" height="1.7" style="fill:var(--accent)"/>
  <text x="103.4" y="225.3" text-anchor="middle" class="f-label f-muted">1</text>
  <text x="103.4" y="248" text-anchor="middle" class="f-label f-muted">Jul</text>
  <rect x="125.3" y="221.8" width="27.6" height="10.2" style="fill:var(--accent)"/>
  <text x="139.1" y="216.8" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="139.1" y="248" text-anchor="middle" class="f-label f-muted">Aug</text>
  <rect x="160.9" y="206.5" width="27.6" height="25.5" style="fill:var(--accent)"/>
  <text x="174.7" y="201.5" text-anchor="middle" class="f-label f-muted">15</text>
  <text x="174.7" y="248" text-anchor="middle" class="f-label f-muted">Sep</text>
  <rect x="196.5" y="175.9" width="27.6" height="56.1" style="fill:var(--accent)"/>
  <text x="210.3" y="170.9" text-anchor="middle" class="f-label f-muted">33</text>
  <text x="210.3" y="248" text-anchor="middle" class="f-label f-muted">Oct</text>
  <rect x="232.1" y="177.6" width="27.6" height="54.4" style="fill:var(--accent)"/>
  <text x="245.9" y="172.6" text-anchor="middle" class="f-label f-muted">32</text>
  <text x="245.9" y="248" text-anchor="middle" class="f-label f-muted">Nov</text>
  <rect x="267.8" y="164.0" width="27.6" height="68.0" style="fill:var(--accent)"/>
  <text x="281.6" y="159.0" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="281.6" y="248" text-anchor="middle" class="f-label f-muted">Dec</text>
  <rect x="303.4" y="150.4" width="27.6" height="81.6" style="fill:var(--accent)"/>
  <text x="317.2" y="145.4" text-anchor="middle" class="f-label f-muted">48</text>
  <text x="317.2" y="248" text-anchor="middle" class="f-label f-muted">Jan</text>
  <rect x="339.0" y="145.3" width="27.6" height="86.7" style="fill:var(--accent)"/>
  <text x="352.8" y="140.3" text-anchor="middle" class="f-label f-muted">51</text>
  <text x="352.8" y="248" text-anchor="middle" class="f-label f-muted">Feb</text>
  <rect x="374.6" y="143.6" width="27.6" height="88.4" style="fill:var(--accent)"/>
  <text x="388.4" y="138.6" text-anchor="middle" class="f-label f-muted">52</text>
  <text x="388.4" y="248" text-anchor="middle" class="f-label f-muted">Mar</text>
  <rect x="410.3" y="135.1" width="27.6" height="96.9" style="fill:var(--accent)"/>
  <text x="424.1" y="130.1" text-anchor="middle" class="f-label f-muted">57</text>
  <text x="424.1" y="248" text-anchor="middle" class="f-label f-muted">Apr</text>
  <rect x="445.9" y="136.8" width="27.6" height="95.2" style="fill:var(--accent)"/>
  <text x="459.7" y="131.8" text-anchor="middle" class="f-label f-muted">56</text>
  <text x="459.7" y="248" text-anchor="middle" class="f-label f-muted">May</text>
  <rect x="481.5" y="116.4" width="27.6" height="115.6" style="fill:var(--accent)"/>
  <text x="495.3" y="111.4" text-anchor="middle" class="f-label f-muted">68</text>
  <text x="495.3" y="248" text-anchor="middle" class="f-label f-muted">Jun</text>
  <rect x="517.1" y="126.6" width="27.6" height="105.4" style="fill:var(--accent)"/>
  <text x="530.9" y="121.6" text-anchor="middle" class="f-label f-muted">62</text>
  <text x="530.9" y="248" text-anchor="middle" class="f-label f-muted">Jul</text>
  <rect x="552.8" y="124.9" width="27.6" height="107.1" style="fill:var(--accent)"/>
  <text x="566.6" y="119.9" text-anchor="middle" class="f-label f-muted">63</text>
  <text x="566.6" y="248" text-anchor="middle" class="f-label f-muted">Aug</text>
  <rect x="588.4" y="133.4" width="27.6" height="98.6" style="fill:var(--accent)"/>
  <text x="602.2" y="128.4" text-anchor="middle" class="f-label f-muted">58</text>
  <text x="602.2" y="248" text-anchor="middle" class="f-label f-muted">Sep</text>
  <text x="54" y="266" class="f-label f-ink">2025</text>
  <text x="303.4" y="266" class="f-label f-ink">2026</text>
  <line x1="121.3" y1="46" x2="121.3" y2="201.8" class="f-line" stroke-dasharray="3 3"/>
  <text x="117.3" y="42" text-anchor="end" class="f-label f-ink">available, 31 Jul</text>
  <line x1="172.9" y1="46" x2="172.9" y2="186.5" class="f-line" stroke-dasharray="3 3"/>
  <text x="176.9" y="42" text-anchor="start" class="f-label f-ink">worm, Sep</text>
  <line x1="274.4" y1="60" x2="274.4" y2="144.0" class="f-line" stroke-dasharray="3 3"/>
  <text x="278.4" y="56" text-anchor="start" class="f-label f-ink">tokens revoked, 9 Dec</text>
</svg>
<figcaption>The share was 0 until July 2025 and reached 68 percent in June 2026. It is counted per package, so a package that released 50 canaries in a month counts once.</figcaption>
</figure>

1452 packages now have their most recent version published this way. For 1063 of them the version just before the switch was published by a person. `semver` shows the whole path in one record. The first versions with a recorded publisher, from October 2011, came from Isaac Schlueter. Since 2023 most releases came from the npm team's account `npm-cli-ops` and since October 2025 the publisher field says `GitHub Actions`.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Timeline of every semver version with a recorded publisher, from 2011 to 2026, in three lanes. From 2011 to 2023 the versions sit in the lane for a person: isaacs, then othiym23, lukekarrys and gar. From 2023 to 2025 they move to the lane of the npm team account npm-cli-ops. From October 2025 on they are in the trusted publishing lane, where the publisher is GitHub Actions.">
  <text x="158" y="42" text-anchor="end" class="f-label f-ink">a person</text>
  <line x1="170" y1="54" x2="620" y2="54" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="86" text-anchor="end" class="f-label f-ink">npm team account</text>
  <line x1="170" y1="98" x2="620" y2="98" class="f-line" stroke-opacity="0.3"/>
  <text x="158" y="130" text-anchor="end" class="f-label f-ink">trusted publishing</text>
  <line x1="170" y1="142" x2="620" y2="142" class="f-line" stroke-opacity="0.3"/>
  <line x1="191.3" y1="26" x2="191.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.5" y1="26" x2="194.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="194.7" y1="26" x2="194.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="197.3" y1="26" x2="197.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="209.4" y1="26" x2="209.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="219.3" y1="26" x2="219.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="223.7" y1="26" x2="223.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="226.7" y1="26" x2="226.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="229.1" y1="26" x2="229.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="230.8" y1="26" x2="230.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.0" y1="26" x2="239.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.2" y1="26" x2="239.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.4" y1="26" x2="239.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="239.7" y1="26" x2="239.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.6" y1="26" x2="240.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="240.8" y1="26" x2="240.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.0" y1="26" x2="242.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="242.6" y1="26" x2="242.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.2" y1="26" x2="249.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="249.4" y1="26" x2="249.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="264.1" y1="26" x2="264.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="267.3" y1="26" x2="267.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="269.9" y1="26" x2="269.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.0" y1="26" x2="270.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="270.1" y1="26" x2="270.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="273.9" y1="26" x2="273.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.3" y1="26" x2="275.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="275.4" y1="26" x2="275.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="276.6" y1="26" x2="276.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.5" y1="26" x2="281.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="281.8" y1="26" x2="281.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.6" y1="26" x2="285.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="285.7" y1="26" x2="285.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="286.7" y1="26" x2="286.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="289.0" y1="26" x2="289.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="292.0" y1="26" x2="292.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="293.9" y1="26" x2="293.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="294.1" y1="26" x2="294.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.2" y1="26" x2="297.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="297.4" y1="26" x2="297.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="302.0" y1="26" x2="302.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="307.2" y1="26" x2="307.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.0" y1="26" x2="324.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="324.4" y1="26" x2="324.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="325.6" y1="26" x2="325.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="354.5" y1="26" x2="354.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="368.0" y1="26" x2="368.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="384.5" y1="26" x2="384.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="388.6" y1="26" x2="388.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="401.5" y1="26" x2="401.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="405.9" y1="26" x2="405.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="406.3" y1="26" x2="406.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.4" y1="26" x2="408.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="408.9" y1="26" x2="408.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="410.6" y1="26" x2="410.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="412.2" y1="26" x2="412.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="421.7" y1="26" x2="421.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="422.0" y1="26" x2="422.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="425.4" y1="26" x2="425.4" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="426.3" y1="26" x2="426.3" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.5" y1="26" x2="430.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="430.8" y1="26" x2="430.8" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.0" y1="26" x2="431.0" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="431.1" y1="26" x2="431.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="448.9" y1="26" x2="448.9" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="457.5" y1="26" x2="457.5" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="486.7" y1="26" x2="486.7" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="487.2" y1="26" x2="487.2" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="500.6" y1="26" x2="500.6" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="515.1" y1="70" x2="515.1" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="515.7" y1="70" x2="515.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="517.6" y1="70" x2="517.6" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.2" y1="70" x2="520.2" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="520.7" y1="70" x2="520.7" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="521.9" y1="70" x2="521.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="522.1" y1="26" x2="522.1" y2="48" class="f-line" stroke-width="1.5"/>
  <line x1="538.3" y1="70" x2="538.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.4" y1="70" x2="545.4" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="545.5" y1="70" x2="545.5" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="550.8" y1="70" x2="550.8" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="565.9" y1="70" x2="565.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="566.3" y1="70" x2="566.3" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="573.9" y1="70" x2="573.9" y2="92" class="f-line" stroke-width="1.5"/>
  <line x1="585.3" y1="114" x2="585.3" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="594.6" y1="114" x2="594.6" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="601.7" y1="114" x2="601.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="602.7" y1="114" x2="602.7" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="603.8" y1="114" x2="603.8" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.1" y1="114" x2="604.1" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <line x1="604.9" y1="114" x2="604.9" y2="136" style="stroke:var(--accent)" stroke-width="1.5"/>
  <text x="193.3" y="22" text-anchor="start" class="f-mono f-muted">isaacs</text>
  <text x="488.7" y="22" text-anchor="start" class="f-mono f-muted">lukekarrys, gar</text>
  <text x="517.1" y="66" text-anchor="start" class="f-mono f-muted">npm-cli-ops</text>
  <text x="579.3" y="110" text-anchor="end" class="f-mono f-muted">GitHub Actions</text>
  <text x="170.0" y="160" text-anchor="middle" class="f-label f-muted">2011</text>
  <text x="254.4" y="160" text-anchor="middle" class="f-label f-muted">2014</text>
  <text x="338.8" y="160" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="423.1" y="160" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="507.5" y="160" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="591.9" y="160" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Every semver version with a recorded publisher, 1 tick per version. The name on the release moved from a person to a team account and then to a workflow.</figcaption>
</figure>

Then I went back to my 369. The registry search tells me who published the latest version of each package. For a maintainer who moved their packages to trusted publishing that is now `GitHub Actions`. So exactly the people who followed the advice after the worm look silent in my count. The maintainer of `buffer` is listed on packages released through GitHub Actions yesterday. If I count a person as present when any package they maintain had a release in 2 years, the number drops to 213. That rule is too generous, being listed on a busy package is not the same as working on it. The honest answer is somewhere between 213 and 369. I could not make it more precise from the registry alone.

<figure class="fig">
<svg viewBox="0 0 640 264" role="img" aria-label="Horizontal bars for 4996 of the most downloaded npm packages: 1 maintainer today 2351, first human is still the last 2864, first author gone from the list 878, no release in 2 years 1798, silent, by their own releases 369, silent, counting listed packages 213. The last 2 bars, packages where every human maintainer looks silent for 2 years by 2 different rules, are filled in the accent colour.">
  <text x="10" y="18" class="f-label f-muted">what the registry says about 4996 packages</text>
  <line x1="580" y1="28" x2="580" y2="254" class="f-line" stroke-dasharray="3 3"/>
  <text x="580" y="24" text-anchor="end" class="f-label f-muted">4996</text>
  <text x="252" y="51.8" text-anchor="end" class="f-label f-ink">1 maintainer today</text>
  <rect x="262" y="36" width="149.6" height="22" class="f-box"/>
  <text x="419.6" y="51.8" class="f-label f-muted">2351</text>
  <text x="252" y="89.8" text-anchor="end" class="f-label f-ink">first human is still the last</text>
  <rect x="262" y="74" width="182.3" height="22" class="f-box"/>
  <text x="452.3" y="89.8" class="f-label f-muted">2864</text>
  <text x="252" y="127.8" text-anchor="end" class="f-label f-ink">first author gone from the list</text>
  <rect x="262" y="112" width="55.9" height="22" class="f-box"/>
  <text x="325.9" y="127.8" class="f-label f-muted">878</text>
  <text x="252" y="165.8" text-anchor="end" class="f-label f-ink">no release in 2 years</text>
  <rect x="262" y="150" width="114.4" height="22" class="f-box"/>
  <text x="384.4" y="165.8" class="f-label f-muted">1798</text>
  <text x="252" y="203.8" text-anchor="end" class="f-label f-ink">silent, by their own releases</text>
  <rect x="262" y="188" width="23.5" height="22" style="fill:var(--accent)"/>
  <text x="293.5" y="203.8" class="f-label f-muted">369</text>
  <text x="252" y="241.8" text-anchor="end" class="f-label f-ink">silent, counting listed packages</text>
  <rect x="262" y="226" width="13.6" height="22" style="fill:var(--accent)"/>
  <text x="283.6" y="241.8" class="f-label f-muted">213</text>
</svg>
<figcaption>Out of 4996 packages. The 2 bottom bars are packages without a release for 2 years and not deprecated, where no human maintainer published anything in the registry for 2 years. Of these, the upper one counts only releases under their own name, the lower one counts any release of a package they are listed on. Somewhere between them is the truth.</figcaption>
</figure>

I like this change, a token that lives for one run is much harder to steal than one that lives for years. But the publisher field now names a workflow. The person is at best in an optional `approver` field, which I saw on `express` 4.22.3. Otherwise there is only the provenance attestation that links to the CI run. The same change fooled my own count of abandoned packages.

I am not the first to count trusted publishing. sxzz keeps a tracker of OIDC and provenance across the whole `npm-high-impact` list of more than 17000 packages. My numbers only answer whose name stands on the release.

## What I did not check

- Code authorship. I did not open git history, so a package with 1 publisher may have 40 contributors.
- 5415 of 12197 human maintainer seats, 44 percent, belong to people who never published that package. Some review and let CI publish, some may be keys nobody remembers. The registry does not tell them apart.
- All numbers come from one pass on 8 October 2026. A repeat on another day will move the tails, because packages keep releasing.
