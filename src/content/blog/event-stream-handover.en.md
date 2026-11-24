---
title: "An alarm that catches event-stream 3.3.6 would ring 54 times a year on 3000 npm packages"
description: "I looked for a signal in npm metadata that would have rung on event-stream 3.3.6 and counted it on a year of releases of 3000 popular packages. A new account that publishes and adds a dependency inside the semver range gives 54 releases, with a year of silence before it 11. The release itself is no longer in the registry and I had to take its dependencies from git."
date: 2018-12-02
lang: en
translationKey: event-stream-handover
tags: ["dependencies", "open-data"]
---

The registry document of `event-stream` has 3.3.6 in its `time` list, published on September 9 at 08:28 UTC. The `versions` list goes from 3.3.5 straight to 4.0.0. This is the release that brought in `flatmap-stream`, npm removed both on November 26. I wanted to see what the registry knew about 3.3.6 before everybody knew. First I found out that most of that record is gone.

Most people have read the story by now. Dominic Tarr wrote in issue 116 that somebody "emailed me and said he wanted to maintain the module, so I gave it to him". The account `right9ctrl` then added a dependency, a later version of that dependency went after the Copay wallet. npm described it on November 27. I update patch and minor versions of my dependencies by looking at the number. The account that published a release is in the same document, in the field `_npmUser`. I never opened it.

So I asked which signal in the metadata would have rung on 3.3.6 and how often it would ring on other popular packages. An alarm that rings every day I would switch off.

## What is left in the record

3.3.4 came out in July 2016 and 3.3.5 on September 5, 2018, after 780 days. 3.3.5 is the first release by `right9ctrl`, `dominictarr` is still next to it in the maintainers. In 4.0.0, 11 days later, only `right9ctrl` is left.

The record of `flatmap-stream` is replaced too, since November 29 there is only a placeholder. But joepie91 had copied its dates into issue 116. 0.1.0 appeared 3 hours after 3.3.5. The dependency list of 3.3.6 I took from git, commit `5999958d`. It is 3.3.5 plus `"flatmap-stream": "^0.1.0"`. Without this line my script saw 3 releases of `event-stream` in the autumn and not a single new dependency. On September 9 the new package was 4 days old. The version with the malicious code, 0.1.1, came 26 days after 3.3.6 and fell into the same range.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Two lanes from September to the end of November 2018. event-stream: 3.3.5 on September 5, 3.3.6 on September 9, 4.0.0 on September 16, 4.0.1 on September 29. flatmap-stream: 0.1.0 on September 5, 0.1.1 on October 5, 0.1.2 on November 15. 3.3.6 points to flatmap-stream with the range ^0.1.0, 4.0.0 does not. Issue 115 is opened on November 19, npm removes the packages on November 26.">
  <text x="10.0" y="68.0" text-anchor="start" class="f-mono f-ink">event-stream</text>
  <text x="10.0" y="148.0" text-anchor="start" class="f-mono f-ink">flatmap-stream</text>
  <line x1="140.0" y1="64.0" x2="664.0" y2="64.0" class="f-line"/>
  <line x1="140.0" y1="144.0" x2="664.0" y2="144.0" class="f-line"/>
  <line x1="337.8" y1="144.0" x2="576.7" y2="144.0" class="f-line" style="stroke:var(--accent);stroke-width:5"/>
  <line x1="188.1" y1="64.0" x2="188.1" y2="137.0" class="f-line" style="stroke:var(--accent)"/>
  <path d="M184.1 132 L188.1 139 L192.1 132" class="f-line" style="stroke:var(--accent)"/>
  <text x="196.1" y="108.0" text-anchor="start" class="f-mono f-accent">^0.1.0</text>
  <circle cx="164.3" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="188.1" cy="64.0" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="229.1" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="302.9" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="168.3" y="52.0" text-anchor="end" class="f-mono f-muted">3.3.5</text>
  <text x="190.1" y="34.0" text-anchor="middle" class="f-mono f-accent">3.3.6</text>
  <text x="229.1" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.0</text>
  <text x="302.9" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.1</text>
  <circle cx="165.0" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="165.0" y="168.0" text-anchor="middle" class="f-mono f-muted">0.1.0</text>
  <circle cx="337.8" cy="144.0" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="337.8" y="168.0" text-anchor="middle" class="f-mono f-accent">0.1.1</text>
  <circle cx="576.7" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="584.7" y="168.0" text-anchor="end" class="f-mono f-muted">0.1.2</text>
  <text x="457.2" y="130.0" text-anchor="middle" class="f-label f-accent">0.1.1 is the newest</text>
  <line x1="140.0" y1="204.0" x2="664.0" y2="204.0" class="f-plain"/>
  <line x1="140.0" y1="204.0" x2="140.0" y2="209.0" class="f-plain"/>
  <text x="140.0" y="224.0" text-anchor="middle" class="f-mono f-muted">Sep</text>
  <line x1="312.7" y1="204.0" x2="312.7" y2="209.0" class="f-plain"/>
  <text x="312.7" y="224.0" text-anchor="middle" class="f-mono f-muted">Oct</text>
  <line x1="491.3" y1="204.0" x2="491.3" y2="209.0" class="f-plain"/>
  <text x="491.3" y="224.0" text-anchor="middle" class="f-mono f-muted">Nov</text>
  <line x1="664.0" y1="204.0" x2="664.0" y2="209.0" class="f-plain"/>
  <text x="664.0" y="224.0" text-anchor="end" class="f-mono f-muted">Dec</text>
  <line x1="598.2" y1="34.0" x2="598.2" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="592.2" y="42.0" text-anchor="end" class="f-label f-ink">issue 115, Nov 19</text>
  <line x1="638.1" y1="12.0" x2="638.1" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="632.1" y="20.0" text-anchor="end" class="f-label f-ink">removed, Nov 26</text>
</svg>
<figcaption>The thick part is the time when 0.1.1 was the newest version that the range ^0.1.0 accepts. What is inside 0.1.2 I did not check.</figcaption>
</figure>

4.0.0 followed in 7 days without the dependency, the function was rewritten inside `index.js`. Whoever looked at the newest version saw no `flatmap-stream`, but 3.3.6 stayed the newest 3.x. Issue 115 about a backdoor was opened on November 19, 71 days after 3.3.6.

## Setup

The names come from `all-the-package-names` 1.3572.0 of November 4. By the look of it the list goes from the most depended upon to the least. From its first 30,000 names without a scope I kept the 3000 with most downloads in November. `event-stream` is number 944 with 8.9 million, the last one has 486,436. Then I read the full documents and took stable releases from December 2017 to November 2018 that have a predecessor, 9205 releases of 1597 packages. Ranges are resolved by the `semver` module.

I wrote down the signals before the run:

- new publisher: the account published this package for the first time in the last 30 days and somebody else published it before;
- range: a caret on the previous version accepts the new one;
- dependency: the previous version did not have it in `dependencies`, young if it appeared on npm less than 90 days before;
- silence: a year without releases right before this one or before the first release of an account that came in the last 30 days.

I expected a few dozen releases with new publisher + range + dependency and single digits with silence on top.

## What rings

| signals | releases | packages |
|---|---|---|
| new publisher | 741 | 325 |
| silence | 603 | 543 |
| dependency | 716 | 419 |
| range + young dependency | 82 | 56 |
| new publisher + range + dependency | 54 | 45 |
| new publisher + range + dependency + silence | 11 | 11 |
| new publisher + range + young dependency | 9 | 8 |

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Releases in a year among 3000 packages that match each combination of signals. new publisher: 741; dependency: 716; range + dependency: 491; range + young dependency: 82; new publisher + range + dependency: 54; new publisher + range + dependency + silence: 11; new publisher + range + young dependency: 9.">
  <rect x="362.0" y="12.0" width="251.5" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="25.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">new publisher</text>
  <text x="623.5" y="26.0" text-anchor="start" class="f-mono f-ink">741</text>
  <rect x="362.0" y="42.0" width="243.1" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">dependency</text>
  <text x="615.1" y="56.0" text-anchor="start" class="f-mono f-ink">716</text>
  <rect x="362.0" y="72.0" width="166.7" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="85.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">range + dependency</text>
  <text x="538.7" y="86.0" text-anchor="start" class="f-mono f-ink">491</text>
  <rect x="362.0" y="102.0" width="27.8" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="115.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">range + young dependency</text>
  <text x="399.8" y="116.0" text-anchor="start" class="f-mono f-ink">82</text>
  <rect x="362.0" y="132.0" width="18.3" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="145.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">new publisher + range + dependency</text>
  <text x="390.3" y="146.0" text-anchor="start" class="f-mono f-ink">54</text>
  <rect x="362.0" y="162.0" width="3.7" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="175.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">new publisher + range + dependency + silence</text>
  <text x="375.7" y="176.0" text-anchor="start" class="f-mono f-ink">11</text>
  <rect x="362.0" y="192.0" width="3.1" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="205.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">new publisher + range + young dependency</text>
  <text x="375.1" y="206.0" text-anchor="start" class="f-mono f-ink">9</text>
</svg>
<figcaption>Releases from December 2017 to November 2018 that match every word in the row. 3.3.6 is in all 7 rows. Red is fewer than 100.</figcaption>
</figure>

A new publisher alone says little. In 325 packages of 3000 somebody new published during the year, more than 1 in 10. With range and dependency it is 54 releases, about 1 a week. The row with only range and young dependency I added after the run.

With silence there are 11, a little more than I expected. Next to `event-stream` stand `grunt` 1.0.2, `readdirp` 2.2.0, `for-each` 0.3.3, `browser-pack` 6.0.3. From the metadata they look like ordinary maintenance. After a long pause a new person publishes and adds one package, for example `safe-buffer` or `is-callable`. In these fields 3.3.6 looks the same. The code of the other 10 I did not read.

With a young dependency there are 9 and I looked at who made those dependencies. In 6 of the other 8 releases it is the same account that made the release. In 2 it is an account that already had packages in my 3000. The publisher of `flatmap-stream` I cannot see anymore, its repository was under `hugeglass`. If that was also the account on npm, a rule "young and from an unknown account" would leave only `event-stream`. But I found this rule after the run, with 1 true case, so it needs another set before I trust it.

The rules with a dependency ring on September 9, when the code was still harmless, as far as I understand from issue 116. New publisher + silence would ring 4 days earlier, on 3.3.5. On October 5 `event-stream` has no release at all, for `flatmap-stream` it is an ordinary patch. I don't think any of this would help with `eslint-scope`. Its 3.7.2 of July 12 was published with the stolen credentials of a maintainer and ran its code from `postinstall`. 3.7.1 and 3.7.3 have the same 2 dependencies, so I guess 3.7.2 had nothing new there.

## How far it went

From August 27 to September 8 `flatmap-stream` was downloaded 22 times. On September 10, the first full day, it was 114,753 against 354,919 for `event-stream`, which is 32%. In the week of November 12 it was 48%. From September 9 to November 25 I count 9.52 million. Snyk wrote about nearly 8 million, I don't know which days they took. My sum passes that on November 14.

<figure class="fig">
<svg viewBox="0 0 680 268" role="img" aria-label="Daily downloads of event-stream and flatmap-stream from August 27 to December 1, 2018. flatmap-stream has 22 downloads in total before September 9, then 114,753 on September 10 and 204,253 on November 21. On November 27 it is 27,647, on November 30 it is 308.">
  <line x1="56.0" y1="238.0" x2="664.0" y2="238.0" class="f-plain"/>
  <text x="48.0" y="242.0" text-anchor="end" class="f-mono f-muted">0</text>
  <line x1="56.0" y1="196.7" x2="664.0" y2="196.7" class="f-plain"/>
  <text x="48.0" y="200.7" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="56.0" y1="155.4" x2="664.0" y2="155.4" class="f-plain"/>
  <text x="48.0" y="159.4" text-anchor="end" class="f-mono f-muted">200</text>
  <line x1="56.0" y1="114.1" x2="664.0" y2="114.1" class="f-plain"/>
  <text x="48.0" y="118.1" text-anchor="end" class="f-mono f-muted">300</text>
  <line x1="56.0" y1="72.8" x2="664.0" y2="72.8" class="f-plain"/>
  <text x="48.0" y="76.8" text-anchor="end" class="f-mono f-muted">400</text>
  <rect x="56.6" y="121.1" width="5.1" height="116.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="62.9" y="106.5" width="5.1" height="131.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="69.1" y="114.7" width="5.1" height="123.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="75.4" y="99.9" width="5.1" height="138.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="81.7" y="126.1" width="5.1" height="111.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="87.9" y="210.4" width="5.1" height="27.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="87.9" y1="238.0" x2="87.9" y2="243.0" class="f-plain"/>
  <text x="87.9" y="258.0" text-anchor="middle" class="f-mono f-muted">Sep</text>
  <rect x="94.2" y="209.2" width="5.1" height="28.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="100.5" y="144.4" width="5.1" height="93.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="106.7" y="105.0" width="5.1" height="133.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="113.0" y="84.1" width="5.1" height="153.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="119.3" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="125.5" y="106.4" width="5.1" height="131.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131.8" y="200.2" width="5.1" height="37.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="199.2" width="5.1" height="38.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="227.8" width="5.1" height="10.2" style="fill:var(--accent);stroke:none"/>
  <rect x="144.4" y="91.4" width="5.1" height="146.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="144.4" y="190.6" width="5.1" height="47.4" style="fill:var(--accent);stroke:none"/>
  <rect x="150.6" y="76.0" width="5.1" height="162.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150.6" y="187.8" width="5.1" height="50.2" style="fill:var(--accent);stroke:none"/>
  <rect x="156.9" y="82.8" width="5.1" height="155.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="156.9" y="187.7" width="5.1" height="50.3" style="fill:var(--accent);stroke:none"/>
  <rect x="163.2" y="91.3" width="5.1" height="146.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="163.2" y="191.5" width="5.1" height="46.5" style="fill:var(--accent);stroke:none"/>
  <rect x="169.4" y="104.9" width="5.1" height="133.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169.4" y="194.8" width="5.1" height="43.2" style="fill:var(--accent);stroke:none"/>
  <rect x="175.7" y="193.4" width="5.1" height="44.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="175.7" y="220.2" width="5.1" height="17.8" style="fill:var(--accent);stroke:none"/>
  <rect x="182.0" y="195.3" width="5.1" height="42.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="182.0" y="223.1" width="5.1" height="14.9" style="fill:var(--accent);stroke:none"/>
  <rect x="188.2" y="89.7" width="5.1" height="148.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188.2" y="189.8" width="5.1" height="48.2" style="fill:var(--accent);stroke:none"/>
  <rect x="194.5" y="88.1" width="5.1" height="149.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="194.5" y="188.2" width="5.1" height="49.8" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="85.4" width="5.1" height="152.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="200.8" y="187.3" width="5.1" height="50.7" style="fill:var(--accent);stroke:none"/>
  <rect x="207.0" y="79.8" width="5.1" height="158.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207.0" y="185.4" width="5.1" height="52.6" style="fill:var(--accent);stroke:none"/>
  <rect x="213.3" y="99.7" width="5.1" height="138.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="213.3" y="192.1" width="5.1" height="45.9" style="fill:var(--accent);stroke:none"/>
  <rect x="219.6" y="192.3" width="5.1" height="45.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="219.6" y="222.2" width="5.1" height="15.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="225.8" y="222.6" width="5.1" height="15.4" style="fill:var(--accent);stroke:none"/>
  <rect x="232.1" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="232.1" y="189.4" width="5.1" height="48.6" style="fill:var(--accent);stroke:none"/>
  <rect x="238.4" y="73.9" width="5.1" height="164.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="238.4" y="184.3" width="5.1" height="53.7" style="fill:var(--accent);stroke:none"/>
  <rect x="244.6" y="68.5" width="5.1" height="169.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="244.6" y="181.9" width="5.1" height="56.1" style="fill:var(--accent);stroke:none"/>
  <rect x="250.9" y="67.5" width="5.1" height="170.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="250.9" y="182.2" width="5.1" height="55.8" style="fill:var(--accent);stroke:none"/>
  <rect x="257.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="257.2" y="188.9" width="5.1" height="49.1" style="fill:var(--accent);stroke:none"/>
  <rect x="263.4" y="180.7" width="5.1" height="57.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="263.4" y="221.1" width="5.1" height="16.9" style="fill:var(--accent);stroke:none"/>
  <rect x="269.7" y="182.6" width="5.1" height="55.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="269.7" y="221.2" width="5.1" height="16.8" style="fill:var(--accent);stroke:none"/>
  <rect x="276.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="276.0" y="185.8" width="5.1" height="52.2" style="fill:var(--accent);stroke:none"/>
  <line x1="276.0" y1="238.0" x2="276.0" y2="243.0" class="f-plain"/>
  <text x="276.0" y="258.0" text-anchor="middle" class="f-mono f-muted">Oct</text>
  <rect x="282.2" y="50.5" width="5.1" height="187.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="282.2" y="180.3" width="5.1" height="57.7" style="fill:var(--accent);stroke:none"/>
  <rect x="288.5" y="53.1" width="5.1" height="184.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="288.5" y="180.6" width="5.1" height="57.4" style="fill:var(--accent);stroke:none"/>
  <rect x="294.8" y="52.4" width="5.1" height="185.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="294.8" y="179.4" width="5.1" height="58.6" style="fill:var(--accent);stroke:none"/>
  <rect x="301.1" y="69.8" width="5.1" height="168.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="301.1" y="176.3" width="5.1" height="61.7" style="fill:var(--accent);stroke:none"/>
  <rect x="307.3" y="166.5" width="5.1" height="71.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="307.3" y="218.6" width="5.1" height="19.4" style="fill:var(--accent);stroke:none"/>
  <rect x="313.6" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="313.6" y="219.6" width="5.1" height="18.4" style="fill:var(--accent);stroke:none"/>
  <rect x="319.9" y="70.1" width="5.1" height="167.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="319.9" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="326.1" y="54.8" width="5.1" height="183.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="326.1" y="171.3" width="5.1" height="66.7" style="fill:var(--accent);stroke:none"/>
  <rect x="332.4" y="52.6" width="5.1" height="185.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="332.4" y="170.7" width="5.1" height="67.3" style="fill:var(--accent);stroke:none"/>
  <rect x="338.7" y="54.2" width="5.1" height="183.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="338.7" y="171.1" width="5.1" height="66.9" style="fill:var(--accent);stroke:none"/>
  <rect x="344.9" y="77.1" width="5.1" height="160.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="344.9" y="180.2" width="5.1" height="57.8" style="fill:var(--accent);stroke:none"/>
  <rect x="351.2" y="171.0" width="5.1" height="67.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="351.2" y="219.3" width="5.1" height="18.7" style="fill:var(--accent);stroke:none"/>
  <rect x="357.5" y="170.9" width="5.1" height="67.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="357.5" y="219.2" width="5.1" height="18.8" style="fill:var(--accent);stroke:none"/>
  <rect x="363.7" y="70.6" width="5.1" height="167.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="363.7" y="173.1" width="5.1" height="64.9" style="fill:var(--accent);stroke:none"/>
  <rect x="370.0" y="70.2" width="5.1" height="167.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="370.0" y="167.7" width="5.1" height="70.3" style="fill:var(--accent);stroke:none"/>
  <rect x="376.3" y="71.7" width="5.1" height="166.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="376.3" y="167.8" width="5.1" height="70.2" style="fill:var(--accent);stroke:none"/>
  <rect x="382.5" y="72.1" width="5.1" height="165.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="382.5" y="168.2" width="5.1" height="69.8" style="fill:var(--accent);stroke:none"/>
  <rect x="388.8" y="93.9" width="5.1" height="144.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="388.8" y="175.5" width="5.1" height="62.5" style="fill:var(--accent);stroke:none"/>
  <rect x="395.1" y="194.4" width="5.1" height="43.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="395.1" y="217.4" width="5.1" height="20.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.3" y="196.6" width="5.1" height="41.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="401.3" y="218.0" width="5.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="407.6" y="102.2" width="5.1" height="135.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="407.6" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="413.9" y="65.4" width="5.1" height="172.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="413.9" y="161.6" width="5.1" height="76.4" style="fill:var(--accent);stroke:none"/>
  <rect x="420.1" y="71.3" width="5.1" height="166.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="420.1" y="164.5" width="5.1" height="73.5" style="fill:var(--accent);stroke:none"/>
  <rect x="426.4" y="75.7" width="5.1" height="162.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="426.4" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="432.7" y="90.7" width="5.1" height="147.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="432.7" y="169.9" width="5.1" height="68.1" style="fill:var(--accent);stroke:none"/>
  <rect x="439.0" y="195.1" width="5.1" height="42.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="439.0" y="216.5" width="5.1" height="21.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.2" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="445.2" y="217.0" width="5.1" height="21.0" style="fill:var(--accent);stroke:none"/>
  <rect x="451.5" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="451.5" y="169.3" width="5.1" height="68.7" style="fill:var(--accent);stroke:none"/>
  <rect x="457.8" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="457.8" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="464.0" y="77.7" width="5.1" height="160.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="464.0" y="172.1" width="5.1" height="65.9" style="fill:var(--accent);stroke:none"/>
  <rect x="470.3" y="84.6" width="5.1" height="153.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="470.3" y="174.9" width="5.1" height="63.1" style="fill:var(--accent);stroke:none"/>
  <line x1="470.3" y1="238.0" x2="470.3" y2="243.0" class="f-plain"/>
  <text x="470.3" y="258.0" text-anchor="middle" class="f-mono f-muted">Nov</text>
  <rect x="476.6" y="88.2" width="5.1" height="149.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="476.6" y="175.1" width="5.1" height="62.9" style="fill:var(--accent);stroke:none"/>
  <rect x="482.8" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="482.8" y="209.8" width="5.1" height="28.2" style="fill:var(--accent);stroke:none"/>
  <rect x="489.1" y="185.8" width="5.1" height="52.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="489.1" y="215.6" width="5.1" height="22.4" style="fill:var(--accent);stroke:none"/>
  <rect x="495.4" y="81.7" width="5.1" height="156.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="495.4" y="167.9" width="5.1" height="70.1" style="fill:var(--accent);stroke:none"/>
  <rect x="501.6" y="72.2" width="5.1" height="165.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="501.6" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.9" y="74.9" width="5.1" height="163.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="507.9" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="514.2" y="75.2" width="5.1" height="162.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="514.2" y="162.8" width="5.1" height="75.2" style="fill:var(--accent);stroke:none"/>
  <rect x="520.4" y="88.9" width="5.1" height="149.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="520.4" y="170.0" width="5.1" height="68.0" style="fill:var(--accent);stroke:none"/>
  <rect x="526.7" y="191.4" width="5.1" height="46.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="526.7" y="215.7" width="5.1" height="22.3" style="fill:var(--accent);stroke:none"/>
  <rect x="533.0" y="194.1" width="5.1" height="43.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="533.0" y="216.9" width="5.1" height="21.1" style="fill:var(--accent);stroke:none"/>
  <rect x="539.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="539.2" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="545.5" y="69.3" width="5.1" height="168.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="545.5" y="158.2" width="5.1" height="79.8" style="fill:var(--accent);stroke:none"/>
  <rect x="551.8" y="73.6" width="5.1" height="164.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="551.8" y="159.0" width="5.1" height="79.0" style="fill:var(--accent);stroke:none"/>
  <rect x="558.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="558.0" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="564.3" y="83.3" width="5.1" height="154.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="564.3" y="158.4" width="5.1" height="79.6" style="fill:var(--accent);stroke:none"/>
  <rect x="570.6" y="183.5" width="5.1" height="54.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="570.6" y="213.3" width="5.1" height="24.7" style="fill:var(--accent);stroke:none"/>
  <rect x="576.8" y="187.6" width="5.1" height="50.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="576.8" y="214.3" width="5.1" height="23.7" style="fill:var(--accent);stroke:none"/>
  <rect x="583.1" y="72.6" width="5.1" height="165.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="583.1" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="589.4" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="589.4" y="154.5" width="5.1" height="83.5" style="fill:var(--accent);stroke:none"/>
  <rect x="595.7" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="595.7" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="601.9" y="95.4" width="5.1" height="142.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="601.9" y="170.2" width="5.1" height="67.8" style="fill:var(--accent);stroke:none"/>
  <rect x="608.2" y="133.8" width="5.1" height="104.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="608.2" y="191.3" width="5.1" height="46.7" style="fill:var(--accent);stroke:none"/>
  <rect x="614.5" y="198.7" width="5.1" height="39.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="614.5" y="224.1" width="5.1" height="13.9" style="fill:var(--accent);stroke:none"/>
  <rect x="620.7" y="202.6" width="5.1" height="35.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="620.7" y="223.6" width="5.1" height="14.4" style="fill:var(--accent);stroke:none"/>
  <rect x="627.0" y="95.0" width="5.1" height="143.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="627.0" y="184.6" width="5.1" height="53.4" style="fill:var(--accent);stroke:none"/>
  <rect x="633.3" y="87.9" width="5.1" height="150.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="633.3" y="226.6" width="5.1" height="11.4" style="fill:var(--accent);stroke:none"/>
  <rect x="639.5" y="101.8" width="5.1" height="136.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="639.5" y="230.2" width="5.1" height="7.8" style="fill:var(--accent);stroke:none"/>
  <rect x="645.8" y="111.1" width="5.1" height="126.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="645.8" y="231.0" width="5.1" height="7.0" style="fill:var(--accent);stroke:none"/>
  <rect x="652.1" y="137.1" width="5.1" height="100.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.3" y="207.2" width="5.1" height="30.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="658.3" y1="238.0" x2="658.3" y2="243.0" class="f-plain"/>
  <text x="652.0" y="258.0" text-anchor="middle" class="f-mono f-muted">Dec</text>
  <line x1="140.6" y1="38.0" x2="140.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="140.6" y="34.0" text-anchor="middle" class="f-mono f-ink">3.3.6</text>
  <line x1="303.6" y1="38.0" x2="303.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="303.6" y="34.0" text-anchor="middle" class="f-mono f-ink">0.1.1</text>
  <line x1="560.6" y1="38.0" x2="560.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="560.6" y="34.0" text-anchor="end" class="f-mono f-ink">0.1.2</text>
  <line x1="629.5" y1="38.0" x2="629.5" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="668.0" y="34.0" text-anchor="end" class="f-mono f-ink">removed</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">downloads a day, thousands</text>
  <rect x="300.0" y="3.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="320.0" y="13.0" text-anchor="start" class="f-mono f-muted">event-stream</text>
  <rect x="460.0" y="3.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="480.0" y="13.0" text-anchor="start" class="f-mono f-muted">flatmap-stream</text>
</svg>
<figcaption>Each package has its own bar for the day, both start at 0.</figcaption>
</figure>

I resolved the newest versions of the packages to their whole trees as of November 20. Of 5726 package versions in them only `ps-tree` 1.1.0 pulls 3.3.6 directly. Its range is `~3.3.0`. I always thought of the tilde as the careful one, here it made no difference.

My first count stayed inside the 3000 names and found only `npm-run-all` behind `ps-tree`. `nodemon` was missing. It goes through `pstree.remy`, which is not in my list, so I had to load 1107 more packages. With them 3 packages of 2999 have 3.3.6 in the tree (one of the 3000 has no stable version), but `ps-tree` alone had 6.3 million downloads in November.

The reaction is in the dates too. `pstree.remy` dropped `ps-tree` on November 22 and `npm-run-all` did it on November 24. npm says it was notified on November 26.

## What I did not check

In 2017 Nikita Skovoroda got publish access to 14% of npm packages through weak and leaked credentials. Decan, Mens and Constantinou studied at MSR 2018 how vulnerabilities spread in the npm dependency network. A count of such alarms I did not find, but I also did not search for long.

`_npmUser` is an account, it can be a bot or a second account of the same person. My list has an old order, so new packages and everything with a scope are missing. So are the releases that were removed from the registry, I restored only 3.3.6. The trees are only for newest versions.

The limits of 30, 90 and 365 days I chose after I had seen the dates of `event-stream`. Afterwards I moved the 30 and got from 49 releases with 7 days to 76 with 90, 3.3.6 is there every time.

I will probably try new publisher + silence on my own lock file. In this set it is 157 releases of 97 packages a year, which I could read. We'll see.
