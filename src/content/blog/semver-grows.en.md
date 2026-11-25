---
title: "npm 2.14.0 added a command and npm te stopped running tests"
description: "I loaded 10,301 versions of the 200 npm packages with the most dependents and compared the exported names. Minor and patch releases lose a name rarely, but there are 73 of them against 64 majors. And npm te stopped working because npm added a command."
date: 2016-12-10
lang: en
translationKey: semver-grows
tags: ["dependencies", "open-data"]
---

I made an empty project whose test script prints one line and called `npm te` there with 2 neighbouring versions of npm.

```
$ npm te   # 2.13.5
> x@1.0.0 test ...
> echo tests ran

tests ran

$ npm te   # 2.14.0

Usage: npm <command>
```

Between these versions npm got one new command, `team`. By the rules of semver this is a textbook minor release, something was added and nothing was taken away. But `te` used to be a shortcut for `test` and now it fits 2 commands, so it means nothing.

I came to this from Rich Hickey's talk `Spec-ulation`, given at Clojure/conj on December 2. He sorts changes into growth and breakage. Growth means that the library requires less or provides more, breakage is the opposite. As for version numbers, his slide says that a new minor means "you don't care" and a new major means "you're screwed".

I agreed while listening, but I have put a `^` in front of every dependency for years and never counted what it lets through. So I counted.

I am late with this. Raemaekers, van Deursen and Visser did it for Maven in 2014 with far more care. About a third of the releases there had at least one breaking change and major differed little from minor. The Elm package manager compares the types and computes the number for the author. For npm I wanted something cruder.

## What I took

The packages are the first 200 rows of the anvaka/npmrank list that ranks packages by how many others depend on them, revision of December 3. I took all stable versions published before that day, 11,715 of them. Each one was unpacked with the dependencies it would have got on December 3, without install scripts, then loaded with `require` in Node.js 6.9.1. From 10,301 versions I got a list of exported names. Inherited ones count and so do the methods on the prototype of an exported constructor, names with a leading `_` do not. The other 1,414 did not load, 627 of them because some module was not found.

Each version is compared with the highest lower version that already existed on its day. A release "removed" something if at least one name is gone. This is the weakest possible check of "provides less", because a function can keep its name and change everything else. Before the run I wrote down an expectation, single digits of percent for minor and patch, about half for major.

## The count

| step | pairs | removed a name | only added | same names |
|---|---|---|---|---|
| patch | 4,305 | 34 | 179 | 4,092 |
| minor | 1,506 | 39 | 282 | 1,185 |
| major | 205 | 64 | 30 | 111 |
| 0.x patch | 2,380 | 47 | 189 | 2,144 |
| 0.x minor | 700 | 97 | 138 | 465 |
| 0.x to 1 and up | 83 | 21 | 17 | 45 |

<figure class="fig">
<svg viewBox="0 0 680 314" role="img" aria-label="Share of releases that removed an exported name and share that only added names, by step. patch: 0.8%, 4.2%; minor: 2.6%, 18.7%; 0.x patch: 2.0%, 7.9%; 0.x minor: 13.9%, 19.7%; 0.x to 1 and up: 25.3%, 20.5%; major: 31.2%, 14.6%.">
  <line x1="160.0" y1="40" x2="160.0" y2="284" class="f-plain"/>
  <text x="160.0" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0%</text>
  <line x1="285.7" y1="40" x2="285.7" y2="284" class="f-plain"/>
  <text x="285.7" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">10%</text>
  <line x1="411.4" y1="40" x2="411.4" y2="284" class="f-plain"/>
  <text x="411.4" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">20%</text>
  <line x1="537.1" y1="40" x2="537.1" y2="284" class="f-plain"/>
  <text x="537.1" y="302.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">30%</text>
  <text x="148.0" y="64.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">patch</text>
  <rect x="160.0" y="46.0" width="9.9" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="176.9" y="57.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">0.8</text>
  <rect x="160.0" y="62.0" width="52.3" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="219.3" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">4.2</text>
  <text x="148.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">minor</text>
  <rect x="160.0" y="86.0" width="32.6" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="199.6" y="97.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2.6</text>
  <rect x="160.0" y="102.0" width="235.4" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="402.4" y="113.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18.7</text>
  <text x="148.0" y="144.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x patch</text>
  <rect x="160.0" y="126.0" width="24.8" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="191.8" y="137.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">2.0</text>
  <rect x="160.0" y="142.0" width="99.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="266.8" y="153.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">7.9</text>
  <text x="148.0" y="184.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x minor</text>
  <rect x="160.0" y="166.0" width="174.2" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="341.2" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">13.9</text>
  <rect x="160.0" y="182.0" width="247.8" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="414.8" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">19.7</text>
  <text x="148.0" y="224.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">0.x to 1 and up</text>
  <rect x="160.0" y="206.0" width="318.1" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="485.1" y="217.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">25.3</text>
  <rect x="160.0" y="222.0" width="257.5" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="424.5" y="233.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">20.5</text>
  <text x="148.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">major</text>
  <rect x="160.0" y="246.0" width="392.5" height="13.0" style="fill:var(--accent);stroke:none"/>
  <text x="559.5" y="257.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">31.2</text>
  <rect x="160.0" y="262.0" width="184.0" height="13.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="351.0" y="273.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">14.6</text>
  <rect x="160.0" y="12.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="179.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">removed a name</text>
  <rect x="360.0" y="12.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="379.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">only added names</text>
</svg>
<figcaption>Share of pairs, percent. The 200 npm packages with the most dependents, versions before December 3, 2016.</figcaption>
</figure>

For minor and patch I guessed right, 2.6% and 0.8%. The caret looks decent in this table. But majors are rare. From version 1 up there are 73 minor and patch releases that lost a name and only 64 majors that did.

Over the life of one major the small numbers add up. I took the first and the last loaded version of each major line. In 35 of 319 lines at least one name from the first version is missing in the last one.

I expected the 73 to be internals that leaked out, so I read the list. 13 releases lost a name that came back later in the same major, some of these look like accidents. chalk 1.1.2 lost `hasColor` and `stripColor` and 45 minutes later 1.1.3 had them again, `aws-sdk` was without `SimpleWorkflow` for 11 days. Another 13 belong to npm, more on that below. In 12 of the remaining 47 the README of the older version mentions the removed name. That is an upper bound, words like `log` and `then` match by chance, but `node-uuid` 1.4.0 really dropped 3 documented random number generators. Most of the other 35 do look internal to me, TypeScript alone gives 7.

41 of the 73 added something in the same release. Some of these are plain renames, in immutable 2.0.2 `fromJSON` became `fromJS`. Hickey's advice would cost one line there, leave the old name and put the new one next to it.

## Majors that lost nothing

With majors I was wrong. I expected half of them to remove something and got 64 of 205. Another 22 lost a name one level deeper, in an object or a prototype or changed the type of the export. The other 119 lost nothing I can see and 102 of them have exactly the same top names before and after. lodash 2.0.0 kept all 262 names and added 24. 8 majors of browserify, from 6 to 13, have the same 9 names.

<figure class="fig">
<svg viewBox="0 0 680 204" role="img" aria-label="205 major releases as one bar divided into 4 parts. 64: lost a top name; 22: lost a name one level deeper or changed type; 17: lost nothing, added names; 102: exactly the same top names.">
  <rect x="30.0" y="34.0" width="191.6" height="44.0" style="fill:var(--accent);stroke:none"/>
  <text x="125.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <rect x="223.6" y="34.0" width="64.5" height="44.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="255.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">22</text>
  <rect x="290.1" y="34.0" width="49.4" height="44.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="314.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">17</text>
  <rect x="341.5" y="34.0" width="306.5" height="44.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="494.8" y="26.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">102</text>
  <rect x="30.0" y="98.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="82.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">64</text>
  <text x="94.0" y="109.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">lost a top name</text>
  <rect x="30.0" y="122.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="82.0" y="133.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22</text>
  <text x="94.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">lost a name one level deeper or changed type</text>
  <rect x="30.0" y="146.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <text x="82.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">17</text>
  <text x="94.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">lost nothing, added names</text>
  <rect x="30.0" y="170.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="82.0" y="181.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">102</text>
  <text x="94.0" y="181.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">exactly the same top names</text>
</svg>
<figcaption>205 majors by what is visible in the exports. In 119 of them nothing is lost.</figcaption>
</figure>

Something probably did break there, in options or in output, the number does not say where. In 10 of the 119 the `package.json` gives a hint, it asks for a newer Node or a new peer dependency.

"Requires more" does not wait for a major either. From version 1 up 68 releases raised the minimal Node in `engines` and only 17 of them were majors.

## The te case

npm builds its shortcuts itself. Any prefix that fits only one command works as that command.

<figure class="fig">
<svg viewBox="0 0 680 180" role="img" aria-label="Prefixes of npm commands. In npm 2.13.5 te and tes both lead to test. In npm 2.14.0 tes leads to test, tea leads to team and te leads to nothing, because it fits both commands.">
  <text x="20.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.13.5</text>
  <text x="370.0" y="24.0" text-anchor="start" class="f-mono f-muted" style="font-size:13px">npm 2.14.0</text>
  <rect x="20" y="44" width="60" height="30" class="f-box"/>
  <text x="50.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">te</text>
  <rect x="20" y="88" width="60" height="30" class="f-box"/>
  <text x="50.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="200" y="66" width="90" height="30" class="f-box"/>
  <text x="245.0" y="86.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <line x1="80" y1="59" x2="200" y2="78" class="f-line"/>
  <line x1="80" y1="103" x2="200" y2="86" class="f-line"/>
  <rect x="370" y="44" width="60" height="30" class="f-box"/>
  <text x="400.0" y="64.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">te</text>
  <rect x="370" y="88" width="60" height="30" class="f-box"/>
  <text x="400.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tes</text>
  <rect x="370" y="132" width="60" height="30" class="f-box"/>
  <text x="400.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">tea</text>
  <rect x="550" y="88" width="90" height="30" class="f-box"/>
  <text x="595.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">test</text>
  <rect x="550" y="132" width="90" height="30" class="f-box"/>
  <text x="595.0" y="152.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">team</text>
  <line x1="430" y1="103" x2="550" y2="103" class="f-line"/>
  <line x1="430" y1="147" x2="550" y2="147" class="f-line"/>
  <line x1="430" y1="59" x2="520" y2="59" class="f-line" style="stroke-dasharray:4 4"/>
  <text x="532.0" y="63.0" text-anchor="start" class="f-mono f-accent" style="font-size:13px">nothing</text>
</svg>
<figcaption>A new command takes the short prefix away from the old one.</figcaption>
</figure>

So every added command takes some prefixes from its neighbours. `logout` in 2.6.0 took away `npm log`, which meant login. After `install-test` in 3.4.0 even `instal` resolves to nothing. In 2.1.12 npm learned the typo `verison` and forgot `ver`. In 2.1.9 the misspelled alias `isntall` began to count among the prefixes and `npm is` stopped meaning issues, the comment in that code says "we have our reasons". Of the 13 npm releases in my list 11 look like this, the other 2 are patches that removed a command, first `submodule` and later `faq`.

By Hickey's definition this is breakage, npm provides less than before. In the same talk he says that adding to a collection is growth, period. Here the added name took an old one away. I would have called it growth and bumped the minor too.

## Where the run broke

In my first run 25 packages loaded fine, then one version of optimist out of 39, then nothing at all for the next 38 packages. optimist 0.1.4 inserts 2 elements at the start of `process.argv`. My probe took the output path from there after `require`, so it wrote its JSON over its own source. Now it copies the arguments first and lies in a directory it cannot write to.

The README search was wrong too. I built the regular expression from a string and the backslash of `\w` got lost there, so it found `obj` inside "object" and gave 15 releases instead of 12.

## What I didn't check

The rule I wrote down for the pairs was plain semver order, but that compares a backport with versions that came out after it, so I changed the rule while writing the analysis. By the first rule the minor row has 38 removals instead of 39.

Behaviour, arguments and options are out of reach of this method. Packages that export one bare function have no names, so they are not in the table. 4 of the 13 npm pairs are one change counted 4 times, because npm versions of that time have strange publish dates in the registry, immutable has one such repeat too. Without them the 73 becomes 69. I don't know what the tail of npm looks like behind the top 200. I also did not look whether anybody used the names that disappeared, `npm te` included.
