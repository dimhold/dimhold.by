---
title: "What a one letter check catches in npm typosquatting"
description: "I thought a check for names one edit away from popular npm packages would catch most typosquats. On 417 known malicious names it catches about half and flags 27,196 registry names. My first popularity ranking turned out to be from 2016."
date: 2021-02-12
lang: en
translationKey: typosquat-names
tags: ["dependencies", "open-data"]
---
On Tuesday Alex Birsan published his post about dependency confusion. He got code into Apple and Microsoft builds through public packages named like their internal ones. I read it twice. It is a different attack, but it reminded me of the older and simpler one. Somebody publishes `reqest` and waits for a person who types too fast.

I install packages by typing the name from memory and I have never looked at what sits one letter away from the names I type. The defense I always imagined is simple. Before installing, check if the name is one edit away from a popular package and ask "did you mean?". I was sure it would catch most attacks because attackers want the big packages. I was also sure it would rarely bother anyone. So I measured it.

## The data

For npm I took `all-the-package-names` 1.3905.0. It is the last release, from 22 November 2019, with 1,106,544 names. For PyPI I took the simple index from 30 January with 286,566 names. Popularity there is the list of the 4000 most downloaded projects in January.

As the known bad side I took the GitHub Advisory Database: 419 advisories about malicious npm packages published before today, on 417 names. Most of them were added there last September. My first filter kept only titles with the word "Malicious" and lost 48 advisories titled "X is malware" and similar. Among them was `crossenv` from 2017, the case everybody cites. I found this only on a second pass over the data. For PyPI there is no such database, so I used 2 public reports that name the imitated package. One is the SK-CSIRT advisory of September 2017 with 10 fake packages. The other is `jeIlyfish` with `python3-dateutil` from December 2019.

The check has 4 rules. A name is suspicious if it is 1 deletion, insertion or substitution away from a popular name. It is suspicious if 2 neighboring characters are swapped or if it differs only by punctuation. The last rule is a popular name plus a common prefix or suffix like `node-` or `-js`.

## Much of it is not about names

108 of the 417 malicious names have no neighbor by these rules anywhere in the registry, popular or not. Many are test uploads with names like `harmlesspackage`. And some are attacks that never needed a similar name. `flatmap-stream`, which went into `event-stream` in 2018, is there. `eslint-scope` is there too, a real package that was published from a stolen account. I knew both stories, but I never asked what share of the problem they are.

## The ranking I did not check

The package list comes sorted by popularity, so first I used its order. The top 1000 caught 87 names and flagged 9451 others. Then I looked at what it misses. The biggest group was 46 names around `buffer-xor`, which was on place 10,931. In January it was downloaded 41 million times.

Only then I read where the order comes from. It is `dependent-counts` 2.0.0, published on 26 December 2016. It counts devDependencies too, so `mocha` is first. And it ranks only 86,143 names. The other million names follow in no popularity order. So for an attack in 2021 I used a ranking from 2016 without looking at it.

I asked the npm downloads API for January 2021 numbers of those 86,143 names. It takes 128 names per request and soon starts to answer 429, so this took more than an hour. `buffer-xor` moved to place 610 and `webpack-cli` from 14,123 to 1005.

## Recall against noise

By downloads it looks like this:

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="For each cut of npm names by January 2021 downloads, how many of 417 known malicious names the check catches and how many registry names it flags: top 100: 22 / 1093; top 1000: 108 / 6425; top 8568 *: 215 / 27,196; top 30,000: 237 / 54,543. 108 malicious names have no neighbor in the whole registry.">
  <text x="100" y="16" text-anchor="start" class="f-muted" style="font-size:11px">malicious names caught, of 417</text>
  <text x="440" y="16" text-anchor="start" class="f-muted" style="font-size:11px">registry names flagged</text>
  <text x="90" y="43" text-anchor="end" class="f-ink f-mono" style="font-size:12px">top 100</text>
  <rect x="100.0" y="31.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="31.0" width="14.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="120.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">22</text>
  <rect x="440.0" y="31.0" width="3.2" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="449.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">1093</text>
  <text x="90" y="73" text-anchor="end" class="f-ink f-mono" style="font-size:12px">top 1000</text>
  <rect x="100.0" y="61.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="61.0" width="69.9" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="175.9" y="74" text-anchor="start" class="f-mono" style="font-size:12px">108</text>
  <rect x="440.0" y="61.0" width="18.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="464.8" y="74" text-anchor="start" class="f-mono" style="font-size:12px">6425</text>
  <text x="90" y="103" text-anchor="end" class="f-ink f-mono" style="font-size:12px">top 8568 *</text>
  <rect x="100.0" y="91.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="91.0" width="139.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="245.2" y="104" text-anchor="start" class="f-mono" style="font-size:12px">215</text>
  <rect x="440.0" y="91.0" width="79.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="525.8" y="104" text-anchor="start" class="f-mono" style="font-size:12px">27,196</text>
  <text x="90" y="133" text-anchor="end" class="f-ink f-mono" style="font-size:12px">top 30,000</text>
  <rect x="100.0" y="121.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="121.0" width="153.5" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="259.5" y="134" text-anchor="start" class="f-mono" style="font-size:12px">237</text>
  <rect x="440.0" y="121.0" width="160.0" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="606.0" y="134" text-anchor="start" class="f-mono" style="font-size:12px">54,543</text>
  <line x1="300.1" y1="28" x2="300.1" y2="152" class="f-line" style="stroke:var(--ink);stroke-dasharray:4 3"/>
  <text x="300.1" y="166" text-anchor="middle" class="f-muted" style="font-size:11px">309 have any neighbor at all</text>
  <text x="100" y="186" text-anchor="start" class="f-muted" style="font-size:11px">* every name with 15,000 downloads a week or more, the SpellBound line</text>
</svg>
<figcaption>npm names of 22 November 2019 (1,106,544), ranked by downloads in January 2021. Left: how many of 417 malicious names from the GitHub Advisory Database are one edit, a swap, a punctuation change or a common affix away from a name in the top N. The dashed line is 309, the names with such a neighbor anywhere in the registry. Right: how many other registry names the same rules flag.</figcaption>
</figure>

The top 1000 now catches 108 names instead of 87 and flags 6425 instead of 9451. SpellBound, a paper from last March, uses 15,000 downloads a week as the line of popular. Here that is 8568 names. The check catches 215 of 417 and flags 27,196 names, 2.5% of the registry. My expectation failed twice. Most malicious names have no neighbor in the top 1000. And the flagged names are counted in thousands, so nobody will review them by hand.

Some targets are what I expected. `request` has 51 registered names one edit away in the 2019 list. 18 of them are in the advisories, from `reqest` to `rrequest`. But `request` is on place 130, so a list of the top 100 would not protect even it.

## Who types `bwffer-xor`

The names around `buffer-xor` are strange in another way:

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="The 46 malicious npm names one character away from buffer-xor. 9 are neighboring key typos: budfer-xor, bufder-xor, buffdr-xor, buffer-xkr, buffer-zor, bufger-xor, bufver-xor, bugfer-xor, buvfer-xor. The rest are changes no slipped finger makes.">
  <rect x="22.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="40" y="14" text-anchor="start" class="f-muted" style="font-size:11px">a neighboring key (9)</text>
  <rect x="352.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.6;stroke:none"/>
  <text x="370" y="14" text-anchor="start" class="f-muted" style="font-size:11px">any other replaced character (37)</text>
  <text x="340" y="40" text-anchor="middle" class="f-ink f-mono" style="font-size:15px">buffer-xor</text>
  <text x="22" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">b5ffer-xor</text>
  <text x="150" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">beffer-xor</text>
  <text x="278" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bqffer-xor</text>
  <text x="406" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">btffer-xor</text>
  <text x="534" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bubfer-xor</text>
  <text x="22" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">budfer-xor</text>
  <text x="150" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufber-xor</text>
  <text x="278" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufder-xor</text>
  <text x="406" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffar-xor</text>
  <text x="534" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffdr-xor</text>
  <text x="22" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffe2-xor</text>
  <text x="150" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffeb-xor</text>
  <text x="278" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffep-xor</text>
  <text x="406" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-8or</text>
  <text x="534" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-hor</text>
  <text x="22" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-por</text>
  <text x="150" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xgr</text>
  <text x="278" y="122" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-xkr</text>
  <text x="406" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xmr</text>
  <text x="534" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xnr</text>
  <text x="22" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xo2</text>
  <text x="150" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xob</text>
  <text x="278" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xop</text>
  <text x="406" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xos</text>
  <text x="534" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xov</text>
  <text x="22" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xoz</text>
  <text x="150" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-yor</text>
  <text x="278" y="162" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-zor</text>
  <text x="406" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffermxor</text>
  <text x="534" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffes-xor</text>
  <text x="22" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffev-xor</text>
  <text x="150" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffez-xor</text>
  <text x="278" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffgr-xor</text>
  <text x="406" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffmr-xor</text>
  <text x="534" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffur-xor</text>
  <text x="22" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufger-xor</text>
  <text x="150" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufner-xor</text>
  <text x="278" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufver-xor</text>
  <text x="406" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bugfer-xor</text>
  <text x="534" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bunfer-xor</text>
  <text x="22" y="222" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buvfer-xor</text>
  <text x="150" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bwffer-xor</text>
  <text x="278" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">cuffer-xor</text>
  <text x="406" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">fuffer-xor</text>
  <text x="534" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">juffer-xor</text>
  <text x="22" y="242" text-anchor="start" class="f-muted f-mono" style="font-size:12px">ruffer-xor</text>
</svg>
<figcaption>All 46 malicious names in the GitHub Advisory Database that are one edit away from the package at the top. Each has one character replaced. Accent: the new character is a neighboring key on a QWERTY keyboard, 9 names. Grey: every other replacement.</figcaption>
</figure>

All 46 have the same length as the original, one character replaced. Only 9 are typos a person could make, a neighboring key on the keyboard. `bwffer-xor` or `buffer-8or` will not come from a slipped finger. I think a script went through the alphabet here, but I cannot prove it. SpellBound uses `bwffer-xor` as its own example and writes that they consciously do not flag such names, since there would be too many warnings.

## Popular names are close to each other

Inside the npm top 1000 by downloads there are 44 pairs of names one edit apart, like `qs` and `ws` or `through2` and `through`. On PyPI the top 1000 has 24 such pairs, among them `boto3` and `boto`. A check that warns on any close name will warn on `qs` installed on purpose, so it has to be one sided and fire only for a name that is itself unpopular.

## Punctuation and PyPI

PyPI normalizes names, so `python_dateutil` and `Python.Dateutil` are the same project and nobody can register the second one. npm has a similar rule since 26 December 2017: a new name cannot differ from an existing one only by punctuation. My separator rule catches 4 names with a target in the top 10,000. All 4, `crossenv` and `nodesass` among them, were published by one account in July 2017, before the rule.

Of the 12 old PyPI attacks, 7 are one edit from the package they imitated. The other 5 are names like `telnet` for `telnetsrvlib`. My check misses 4 of them and flags the fifth, `pwd`, against `pid`, a package it never imitated.

## What I take from it

SpellBound by Taylor and coauthors did this properly. They use downloads and keyboard rules and warn only when an unpopular name is close to a popular one. Their paper even has the 3% of flagged packages and the pairs of close popular names. I came to the same place by a longer road, but now I understand why their rules look like this.

For myself I will keep the check at install time, on the name I type, with downloads instead of dependents. It catches the `reqest` kind of mistake, but against `flatmap-stream` or a stolen account it does nothing. There I still have only the lock file and reading what I add.

## What I did not check

The npm list is from 22 November 2019, so newer names are missing, 51 of the malicious ones among them. Downloads I have only for names that had dependents in 2016. A popular newer package like `prettier`, with 48 million downloads in January, is not in my ranking. So the real places are lower and the flagged counts are a floor. I took GitHub's word that the packages are malicious. For each malicious name I took its most popular neighbor as the target, which is not always what the attacker imitated. I did not measure which typos people really make. Scoped names I did not try at all.
