---
title: "colors and faker were broken by their author in January. In December both names still belong to the same account"
description: "In January the author of colors and faker broke both packages. I ran the code that is left, including a 1.4.2 tarball from the Wayback Machine, against the 9 top npm packages that depended on colors. 7 of them would hang with 1.4.2 and most reacted within 5 days. But in December both names still belong to the author and most of the downloads still go there."
date: 2022-12-27
lang: en
translationKey: maintainer-sabotage
tags: ["dependencies", "reliability"]
---
On 8 January the author of colors published version `1.4.44-liberty-2`. It printed "LIBERTY LIBERTY LIBERTY", an ASCII flag and then garbage in an endless loop. 3 days earlier faker 6.6.6 had come out with no code at all. The threads that followed argued about whether the author had the right to do this. My own answer to such stories has always been the standard one, commit the lockfile and pin the versions. But I had no idea how many projects this actually reached.

In November 2020 the same author had opened a GitHub issue called "No more free work from Marak". It gave companies 2 options, a yearly contract with the author or a fork, "fork the project and have someone else work on it". Before the year ends I wanted to check how far one maintainer can reach by breaking their own package and which of the 2 options happened.

## The first version I could read

The broken versions are gone from npm. The registry still lists `1.4.44-liberty-2`, 1.4.1 and 1.4.2 with their publish times, but the tarballs are deleted. 4 other places I tried, including npmmirror and jsDelivr, answer 404. So I started with the git history of `Marak/colors.js`. 3 minutes before the commit that bumps the version to liberty-2, another commit adds 10 lines to `lib/index.js`. They don't even parse. A "Fix bug" commit 2 minutes later removes a stray semicolon. After the fix:

```js
/* remove this line after testing */
let am = require('../lib/custom/american');
am();
for (let i = 666; i < Infinity; i++) {
  if (i % 333) {
    // console.log('testing'.zalgo.rainbow)
  }
  console.log('testing testing testing testing testing testing testing'.zalgo)
}
```

I ran this under Node 16.13.1, the current LTS on 8 January. `require('colors')` printed about 60 MB before my 3 second timeout killed it and never got to the next line of my script. `require('colors/safe')`, the entry that does not touch `String.prototype`, returned in 0.1 seconds with no output. The reason is that `safe.js` loads `lib/colors.js` directly and the loop is only in `lib/index.js`.

Then I checked who would install liberty-2 at all. It is a prerelease and a range like `^1.4.0` never matches a prerelease. I used `npm-pick-manifest` 6.1.1, the code that npm 8.1 uses to choose a version. With the prerelease as `latest`, `^1.4.0` gives 1.4.0. Only `latest` and `*` give the broken one. Live Server had `"colors": "latest"` in its package.json and the first comment in the issue about the loop came from one of its users.

For the list of packages I took `npm-high-impact` 1.1.0 and its part with at least 1 million downloads per week, 4366 npm packages. The list is from November, so it is the top of the end of the year and not of January. 31 of them had colors in their dependencies at some point. On 8 January 9 had it directly, with 21 million downloads together in the first week of January. None of the 9 would pick liberty-2. 8 of them load only `colors/safe` and only `cli-progress` loads the plain `colors`.

At this point I had half of this post written. The title said that 1 of 9 top packages would hang. I assumed 1.4.2 had the same loop as liberty-2 and I had not checked it.

## 1.4.2

1.4.1 came out the same evening and 1.4.2 a day later. These are normal versions, so every caret range went to them on a fresh install without a lockfile. 7 of the 9 resolved to 1.4.2 and only `cli-table` (pinned to 1.0.3) and `jasmine-spec-reporter` (pinned to 1.4.0) did not. On 11 January DABH, who had committed to colors since 2018, wrote that npm had deleted them. GitHub's advisory from 10 January names all 3 versions as containing the loop, but it does not say where in the code.

The Wayback Machine saved the 1.4.2 tarball on 10 January. I checked it against the integrity hash in the lockfile of `ngx-ui-scroll`. That repository had 1.4.2 installed on 9 January and rolled it back the same day with the message "tests don't work with 1.4.2". The hash matches. `lib/index.js` has the same loop. `safe.js` has it too, after a new comment:

```js
/* attempting to patch existing bug */
```

So `colors/safe` was safe for 1 day only. I installed each of the 9 packages in the version current on 8 January with npm 8.1.2. Then I replaced every copy of colors in the tree with 1.4.2 and ran it under the same Node. 3 of them hang on `require`: logform, `cli-progress` and the Playwright test runner. The other 4 load fine as libraries and hang as soon as the part that uses colour is loaded. For the `http-server` and jscodeshift commands that is the start. karma hangs when it loads its reporter and `cli-table3` on the first table with a coloured header. The 2 pinned packages work.

<figure class="fig">
<svg viewBox="0 0 680 266" role="img" aria-label="The 9 packages from the list of 4366 most downloaded npm packages that depended directly on colors on 8 January 2022. For each: its colors range, the version npm resolves it to after 1.4.2 was published, what happened when I ran it with 1.4.2 and what it depends on at the end of 2022. logform: range ^1.2.1, resolves to 1.4.2, hangs on require, end of 2022 @colors/colors. cli-progress: range ^1.1.2, resolves to 1.4.2, hangs on require, end of 2022 no colors. @playwright/test: range ^1.4.0, resolves to 1.4.2, hangs on require, end of 2022 no colors. cli-table3: range ^1.1.2, resolves to 1.4.2, hangs on first use, end of 2022 @colors/colors. karma: range ^1.4.0, resolves to 1.4.2, hangs on first use, end of 2022 @colors/colors. jscodeshift: range ^1.1.2, resolves to 1.4.2, hangs on first use, end of 2022 no colors. http-server: range ^1.4.0, resolves to 1.4.2, hangs on first use, end of 2022 no colors. cli-table: range 1.0.3, resolves to 1.0.3, works, end of 2022 pinned 1.0.3. jasmine-spec-reporter: range 1.4.0, resolves to 1.4.0, works, end of 2022 pinned 1.4.0.">
  <text x="16" y="26" class="f-label f-muted">package</text>
  <text x="214" y="26" class="f-label f-muted">range</text>
  <text x="300" y="26" class="f-label f-muted">on 9 Jan</text>
  <text x="392" y="26" class="f-label f-muted">with 1.4.2</text>
  <text x="540" y="26" class="f-label f-muted">end of 2022</text>
  <line x1="16" y1="34" x2="664" y2="34" class="f-plain"/>
  <rect x="8" y="42" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="58" class="f-mono f-ink" style="font-size:12px">logform</text>
  <text x="214" y="58" class="f-mono f-muted" style="font-size:12px">^1.2.1</text>
  <text x="300" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="58" class="f-mono f-accent" style="font-size:12px;font-weight:600">hangs on require</text>
  <text x="540" y="58" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <rect x="8" y="66" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="82" class="f-mono f-ink" style="font-size:12px">cli-progress</text>
  <text x="214" y="82" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="82" class="f-mono f-accent" style="font-size:12px;font-weight:600">hangs on require</text>
  <text x="540" y="82" class="f-mono f-ink" style="font-size:12px">no colors</text>
  <rect x="8" y="90" width="664" height="22" rx="3" class="f-box"/>
  <text x="16" y="106" class="f-mono f-ink" style="font-size:12px">@playwright/test</text>
  <text x="214" y="106" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="106" class="f-mono f-accent" style="font-size:12px;font-weight:600">hangs on require</text>
  <text x="540" y="106" class="f-mono f-ink" style="font-size:12px">no colors</text>
  <text x="16" y="130" class="f-mono f-ink" style="font-size:12px">cli-table3</text>
  <text x="214" y="130" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="130" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="130" class="f-mono f-accent" style="font-size:12px">hangs on first use</text>
  <text x="540" y="130" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="154" class="f-mono f-ink" style="font-size:12px">karma</text>
  <text x="214" y="154" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="154" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="154" class="f-mono f-accent" style="font-size:12px">hangs on first use</text>
  <text x="540" y="154" class="f-mono f-ink" style="font-size:12px">@colors/colors</text>
  <text x="16" y="178" class="f-mono f-ink" style="font-size:12px">jscodeshift</text>
  <text x="214" y="178" class="f-mono f-muted" style="font-size:12px">^1.1.2</text>
  <text x="300" y="178" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="178" class="f-mono f-accent" style="font-size:12px">hangs on first use</text>
  <text x="540" y="178" class="f-mono f-ink" style="font-size:12px">no colors</text>
  <text x="16" y="202" class="f-mono f-ink" style="font-size:12px">http-server</text>
  <text x="214" y="202" class="f-mono f-muted" style="font-size:12px">^1.4.0</text>
  <text x="300" y="202" class="f-mono f-accent" style="font-size:12px;font-weight:600">1.4.2</text>
  <text x="392" y="202" class="f-mono f-accent" style="font-size:12px">hangs on first use</text>
  <text x="540" y="202" class="f-mono f-ink" style="font-size:12px">no colors</text>
  <text x="16" y="226" class="f-mono f-ink" style="font-size:12px">cli-table</text>
  <text x="214" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="300" y="226" class="f-mono f-muted" style="font-size:12px">1.0.3</text>
  <text x="392" y="226" class="f-mono f-muted" style="font-size:12px">works</text>
  <text x="540" y="226" class="f-mono f-ink" style="font-size:12px">pinned 1.0.3</text>
  <text x="16" y="250" class="f-mono f-ink" style="font-size:12px">jasmine-spec-reporter</text>
  <text x="214" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="300" y="250" class="f-mono f-muted" style="font-size:12px">1.4.0</text>
  <text x="392" y="250" class="f-mono f-muted" style="font-size:12px">works</text>
  <text x="540" y="250" class="f-mono f-ink" style="font-size:12px">pinned 1.4.0</text>
</svg>
<figcaption>Versions current on 8 January 2022, ranges resolved the way npm 8.1 does it, run under Node 16.13.1 with every copy of colors replaced by 1.4.2 from the Wayback Machine.</figcaption>
</figure>

I don't know what 1.4.1 did, because I found no copy of it, not even in the Wayback Machine. In `ngx-ui-scroll` 1.4.1 had been in the lockfile for 17 hours, through commits that fixed tests and the karma config. It was the version they first went back to. Their tests run through karma, which loads only `colors/safe`. That fits a 1.4.1 with the loop only in `lib/index.js`. But 90 minutes later they moved to 1.4.0 without saying why. And it is 1 repository.

## How fast they left

7 of the 9 reacted within 5 days. `cli-progress` released a version without colors on 9 January and `cli-table3` pinned 1.4.0 on the same day. 4 more followed on 10 January, among them logform and Playwright. karma did it on 13 January. By the end of the year 3 of the 9 depend on `@colors/colors`, a fork that DABH published in February. winston, which got colors through logform, moved to it too. DABH is also a maintainer of logform and winston.

faker got a community fork too, `@faker-js/faker`, 5 days after 6.6.6. faker itself was in the runtime dependencies of none of the 4366. It lives in devDependencies and 6.6.6 is a new major version, so `^5.5.3` still resolves to 5.5.3.

## The name stays

This is the part that I find strange. On npmjs.com in December colors shows version 1.4.0 and faker shows 6.6.6. Both list 1 maintainer, marak. The broken colors versions were deleted but nobody moved the name. faker 6.6.6 is still `latest` and it has no code. The README is one line about Aaron Swartz and `.github/FUNDING.yml` still says `github: marak`. `npm install faker` today gives a package where `require('faker')` throws `MODULE_NOT_FOUND`.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Monthly npm downloads from January 2021 to November 2022. colors: 96.7 million in November 2021, 88.5 million in November 2022. @colors/colors: from February 2022, 47.7 million in November 2022. faker: 11.8 million in November 2021, 11.0 million in November 2022. @faker-js/faker: from January 2022, 6.6 million in November 2022.">
  <text x="70" y="16" class="f-mono f-muted" style="font-size:11px">million per month</text>
  <line x1="70" y1="150.0" x2="600" y2="150.0" class="f-plain"/>
  <text x="64" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="103.8" x2="600" y2="103.8" class="f-plain"/>
  <text x="64" y="107.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="57.7" x2="600" y2="57.7" class="f-plain"/>
  <text x="64" y="61.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="359.1" y1="26" x2="359.1" y2="150" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,74.5 94.1,68.1 118.2,53.3 142.3,63.8 166.4,64.1 190.5,64.8 214.5,69.0 238.6,65.8 262.7,63.2 286.8,57.6 310.9,60.8 335.0,61.1 359.1,47.5 383.2,48.6 407.3,36.5 431.4,60.5 455.5,65.7 479.5,61.9 503.6,74.4 527.7,64.8 551.8,67.6 575.9,71.1 600.0,68.3" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="383.2,142.9 407.3,132.2 431.4,133.6 455.5,127.1 479.5,120.6 503.6,121.3 527.7,114.3 551.8,112.2 575.9,110.2 600.0,106.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="72.3" class="f-mono f-ink" style="font-size:11px">colors</text>
  <text x="606" y="110.0" class="f-mono f-accent" style="font-size:11px">@colors</text>
  <line x1="70" y1="265.0" x2="600" y2="265.0" class="f-plain"/>
  <text x="64" y="269.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="236.4" x2="600" y2="236.4" class="f-plain"/>
  <text x="64" y="240.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="70" y1="207.9" x2="600" y2="207.9" class="f-plain"/>
  <text x="64" y="211.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="359.1" y1="181" x2="359.1" y2="265" class="f-line" style="stroke-dasharray:3 3"/>
  <polyline points="70.0,224.0 94.1,219.1 118.2,209.1 142.3,212.8 166.4,212.8 190.5,207.5 214.5,207.2 238.6,205.7 262.7,201.3 286.8,200.0 310.9,197.4 335.0,202.6 359.1,197.6 383.2,200.0 407.3,191.4 431.4,201.7 455.5,199.4 479.5,198.2 503.6,204.1 527.7,194.8 551.8,199.1 575.9,201.2 600.0,202.1" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <polyline points="359.1,264.1 383.2,261.0 407.3,256.6 431.4,253.4 455.5,246.3 479.5,241.8 503.6,240.9 527.7,231.5 551.8,231.0 575.9,230.1 600.0,227.3" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="606" y="206.1" class="f-mono f-ink" style="font-size:11px">faker</text>
  <text x="606" y="231.3" class="f-mono f-accent" style="font-size:11px">@faker-js</text>
  <text x="70" y="284" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Jan 2021</text>
  <text x="359.1" y="284" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 2022</text>
  <text x="600" y="284" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Nov 2022</text>
</svg>
<figcaption>npm downloads API, monthly sums. The vertical line is January 2022.</figcaption>
</figure>

The downloads did not move much either. In November colors had 88.5 million downloads, 8% less than in November 2021, while `@colors/colors` had 47.7 million. faker had 11.0 million, 7% less than a year before, against 6.6 million for the fork. The npm API does not split downloads by version, so I can't say how many of the 11 million are the old 5.5.3.

Of the 2 options from 2020, the fork is the one I can see. The top packages reacted within a week, most of them by pinning 1.4.0. But the name stayed with the author and most of the downloads still go to it. The fork of colors was published by DABH, whose own logform and winston depended on it. I suspect this is how a lot of infrastructure is held, but 9 packages are too few to say that.

## What I did not check

Transitive dependents outside the top list. Most of the 88 million downloads of colors probably come from there. How many projects had a lockfile and never saw the broken versions. The code of 1.4.1. And the exact time npm deleted the 3 versions, because the registry does not show it.
