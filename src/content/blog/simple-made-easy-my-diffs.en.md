---
title: "Simple Made Easy on my own diffs: 85% of the discarded code went in one commit"
description: "I took a dashboard out of this workspace 2 days and 22 hours after the machine wrote it and never counted how much else went the same way. 508 commits later: 57.4% of the code words are gone and 85.0% of that went in one commit. The 5 files with the widest braid in the history are the 5 that commit deleted."
date: 2026-09-10
lang: en
translationKey: simple-made-easy-my-diffs
---
On 14 August 2026 I took the dashboard out of this workspace. The commit strips 3748 lines. 3581 of those are 10 files deleted whole, plus a SQLite database. The machine had written the first of those files 2 days and 22 hours before that commit. The reason sits in the commit body and it is about the premise. The thing was a queue of cards with approve and reject buttons, built as if I service a queue, when every real decision here happens in a conversation.

I called it one bad call and moved on. What I never did was count how much of everything else went the same way. My working assumption was that I keep most of what this machine writes.

Rich Hickey turns that assumption into something I can measure. Simple Made Easy, Strange Loop, September 2011. About an hour in he says: "It's the artifacts. It's not the authoring." In his account the cost of complexity lands on whoever has to change the thing later. Around 18 minutes in he says what that looks like on a calendar. If you focus on ease and ignore simplicity, "Most sprints be about completely redoing things you've already done."

The reply I keep meeting in 2026 is that authoring became free, so the argument is closed. This repository is a fair place to test that. I did not type it. An agent working in this directory did, across 508 commits from 11 August to 2 September, landing on 21 separate days. Every count below is taken at commit `aaaf1c5`, the last one before I started, on git 2.43.0.

## The volume first

The only repository I own that has both eras in it is the site. I started it by hand in 2014 and put Jekyll under it in 2019. The machine rebuilt it on Astro in 2026. This is `git log --numstat --no-renames` over source extensions, no lock files and no content, divided by days that have a commit.

| | commits | days | code lines | of those mine | per working day |
|---|---|---|---|---|---|
| dimhold.by by hand, 2014-2019 | 15 | 7 | 1159 | 464 | 66 |
| dimhold.by by machine, 2026 | 51 | 10 | 23747 | 23747 | 2375 |
| this workspace, 2026 | 508 | 21 | 36542 | 36542 | 1740 |

The first row needed the extra column. 695 of its 1159 lines are `github-markdown.css`, a stylesheet I dropped in whole, so what I typed is 464 lines over 7 days. Against 2375 that is 36x. The largest files of the machine rows have nothing vendored in them. Those 7 days are evenings of hobby work on a stack that no longer exists, so read 36x as an order of magnitude.

## How much of it is still here

The number Hickey's claim actually touches is survival. For each file I summed the lines git recorded as added, then put that next to what stands at the pinned commit. Under `src`, `scripts` and `public` that comes to 31.7% surviving. For `CLAUDE.md`, `TICK.md` and the prompts it is 25.7%. Those paths are not the set the era table counts.

Counting prose by line is a bad idea though. These files wrap at 80 columns, so an edit inside a paragraph rewrites the rest of it and every rewrapped line counts as new. That is not the whole gap: `src/lib/tells.ts` is code and it still shows 47.3% by line against 88.5% by word. I switched to words, taken with `git show --word-diff=porcelain` over each commit.

The counter I wrote for that had a bug in it. It split each changed run on whitespace and counted the empty leading field as a word, which inflated everything by 13%. The code column read 42202 words added where the truth is 37224. I only found it because added minus deleted is supposed to land on what `wc` reports. It did not. On the code paths it now lands within 3 words. On the rules paths it is still 634 words out, around 3.5%. Why that is I have not worked out.

| | words added | words deleted | at that commit | survived |
|---|---|---|---|---|
| code | 37224 | 21382 | 15845 | 42.6% |
| rules and prompts | 24680 | 6028 | 18018 | 73.0% |

57.4% of the code this machine wrote in 3 weeks is gone. On that number Hickey's sentence about redoing what you have already done looks right.

The shape is wrong for his story though. 18171 of the 21382 discarded words went in a single commit, the one from 14 August. That is 85.0%. The other 62 commits that touch code threw away 3211 words between them.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="A bar of all 37224 words of code this workspace has ever added. The left part, 15845 words, is what still stands at HEAD. The right part, 21382 words, was thrown away. A second bar below zooms into that discarded part and splits it in two: 18171 words removed by a single commit on 14 August 2026 and 3211 words removed by all the other commits together.">
  <text x="320" y="18" class="f-label f-muted" text-anchor="middle">37224 words of code typed in 3 weeks</text>
  <rect x="40" y="50" width="238.4" height="30" rx="1" class="f-accent"/>
  <rect x="278.4" y="50" width="321.6" height="30" rx="1" class="f-muted"/>
  <text x="159.2" y="44" class="f-mono f-ink" text-anchor="middle">15845 still here</text>
  <text x="439.2" y="44" class="f-mono f-ink" text-anchor="middle">21382 thrown away</text>
  <path d="M 278.4 80 L 40 140" class="f-plain"/>
  <path d="M 600 80 L 600 140" class="f-plain"/>
  <rect x="40" y="140" width="475.9" height="30" rx="1" class="f-accent"/>
  <rect x="515.9" y="140" width="84.1" height="30" rx="1" class="f-muted"/>
  <text x="278" y="134" class="f-mono f-ink" text-anchor="middle">18171</text>
  <text x="558" y="134" class="f-mono f-ink" text-anchor="middle">3211</text>
  <text x="278" y="188" class="f-label f-muted" text-anchor="middle">one commit, 14 aug 2026</text>
  <text x="600" y="188" class="f-label f-muted" text-anchor="end">every other commit</text>
</svg>
<figcaption>Every word of code this workspace has added, by what happened to it. The lower bar zooms into the part that was thrown away. Its left block is one commit on 14 August, 18171 words. Its right block is every other commit that ever touched code, 3211 words between 62 of them.</figcaption>
</figure>

## The tangle was between the files

So I went back to that commit with his own definition. Complect means to braid. Git only records what changed together. Whether it had to is not in there, so the closest I can get is a frequency. For each file I took the commits that touch it and asked how often each other file changes with it. I counted a file as a partner at 50% and up. I dropped the 11 commits that touch more than 20 files, since a sweep across the tree ties everything to everything.

There are 10 files under `src`, `scripts` and `public` with at least 5 commits. The 5 with the widest braid are the 5 that commit deleted. `public/app.js` moved together with `public/styles.css` in 93% of its commits and with `src/server.ts` in 79%. `src/lib/funnel.ts` has 6 partners.

The survivors are not all clean. `src/lib/refine.ts` carries 4 partners, one below `public/app.js`. It only has 6 commits, so a partner at 50% means 3 occurrences there. One of the 4 is a dashboard file. `src/lib/tells.ts` has exactly one partner. The 3 remaining survivors have none.

Inside the files there was nothing special. I measured the same tree just before the deletion and at the pinned commit. Branches per 100 lines went from 25.6 to 21.9. Imports per file went from 3.3 to 2.1 and deepest nesting from 8 to 7. Hickey has a line for this. "You can write modular software with all kinds of interconnections between them. They may not call each other, but they're completely complected."

I wanted to write that the braid is why nobody trimmed the dashboard. The history does not support it. 601 lines came off those files before the end, so parts did get removed. What holds is narrower: no commit ever made the set smaller and no file of it was ever taken out alone. When it went it went as 10 files in one diff. `src/lib/files.ts` came in at 252 lines to hold the state.

<figure class="fig">
<svg viewBox="0 0 640 270" role="img" aria-label="A ranked list of the 10 files under src, scripts and public with at least 5 commits. Each file is a dot with one spoke for every other file that changes in the same commit at least half of the time. funnel.ts has 6 spokes, app.js, styles.css, index.html and server.ts have 5 each, and all 5 of these are marked as deleted on 14 August. refine.ts has 4 spokes, tells.ts has 1 and backfill-loop.sh, critique.ts and llm.ts have none, all 5 of them still on HEAD.">
  <text x="270" y="24" class="f-label f-muted" text-anchor="end">file</text>
  <text x="286" y="24" class="f-label f-muted">moves together with</text>
  <text x="600" y="24" class="f-label f-muted" text-anchor="end">on head</text>
  <text x="270" y="56" class="f-mono f-ink" text-anchor="end">funnel.ts</text>
  <path d="M 286 52 L 313 19.8" class="f-line"/><circle cx="313" cy="19.8" r="2.5" class="f-muted"/>
  <path d="M 286 52 L 322.4 31" class="f-line"/><circle cx="322.4" cy="31" r="2.5" class="f-muted"/>
  <path d="M 286 52 L 327.4 44.7" class="f-line"/><circle cx="327.4" cy="44.7" r="2.5" class="f-muted"/>
  <path d="M 286 52 L 327.4 59.3" class="f-line"/><circle cx="327.4" cy="59.3" r="2.5" class="f-muted"/>
  <path d="M 286 52 L 322.4 73" class="f-line"/><circle cx="322.4" cy="73" r="2.5" class="f-muted"/>
  <path d="M 286 52 L 313 84.2" class="f-line"/><circle cx="313" cy="84.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="52" r="4.5" class="f-accent"/>
  <text x="352" y="56" class="f-mono f-muted">6</text>
  <text x="600" y="55" class="f-label f-muted" text-anchor="end">deleted 14 aug</text>
  <text x="270" y="77" class="f-mono f-ink" text-anchor="end">app.js</text>
  <path d="M 286 73 L 313 40.8" class="f-line"/><circle cx="313" cy="40.8" r="2.5" class="f-muted"/>
  <path d="M 286 73 L 324.1 55.3" class="f-line"/><circle cx="324.1" cy="55.3" r="2.5" class="f-muted"/>
  <path d="M 286 73 L 328 73" class="f-line"/><circle cx="328" cy="73" r="2.5" class="f-muted"/>
  <path d="M 286 73 L 324.1 90.7" class="f-line"/><circle cx="324.1" cy="90.7" r="2.5" class="f-muted"/>
  <path d="M 286 73 L 313 105.2" class="f-line"/><circle cx="313" cy="105.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="73" r="4.5" class="f-accent"/>
  <text x="352" y="77" class="f-mono f-muted">5</text>
  <text x="600" y="76" class="f-label f-muted" text-anchor="end">deleted 14 aug</text>
  <text x="270" y="98" class="f-mono f-ink" text-anchor="end">styles.css</text>
  <path d="M 286 94 L 313 61.8" class="f-line"/><circle cx="313" cy="61.8" r="2.5" class="f-muted"/>
  <path d="M 286 94 L 324.1 76.3" class="f-line"/><circle cx="324.1" cy="76.3" r="2.5" class="f-muted"/>
  <path d="M 286 94 L 328 94" class="f-line"/><circle cx="328" cy="94" r="2.5" class="f-muted"/>
  <path d="M 286 94 L 324.1 111.7" class="f-line"/><circle cx="324.1" cy="111.7" r="2.5" class="f-muted"/>
  <path d="M 286 94 L 313 126.2" class="f-line"/><circle cx="313" cy="126.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="94" r="4.5" class="f-accent"/>
  <text x="352" y="98" class="f-mono f-muted">5</text>
  <text x="600" y="97" class="f-label f-muted" text-anchor="end">deleted 14 aug</text>
  <text x="270" y="119" class="f-mono f-ink" text-anchor="end">index.html</text>
  <path d="M 286 115 L 313 82.8" class="f-line"/><circle cx="313" cy="82.8" r="2.5" class="f-muted"/>
  <path d="M 286 115 L 324.1 97.3" class="f-line"/><circle cx="324.1" cy="97.3" r="2.5" class="f-muted"/>
  <path d="M 286 115 L 328 115" class="f-line"/><circle cx="328" cy="115" r="2.5" class="f-muted"/>
  <path d="M 286 115 L 324.1 132.7" class="f-line"/><circle cx="324.1" cy="132.7" r="2.5" class="f-muted"/>
  <path d="M 286 115 L 313 147.2" class="f-line"/><circle cx="313" cy="147.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="115" r="4.5" class="f-accent"/>
  <text x="352" y="119" class="f-mono f-muted">5</text>
  <text x="600" y="118" class="f-label f-muted" text-anchor="end">deleted 14 aug</text>
  <text x="270" y="140" class="f-mono f-ink" text-anchor="end">server.ts</text>
  <path d="M 286 136 L 313 103.8" class="f-line"/><circle cx="313" cy="103.8" r="2.5" class="f-muted"/>
  <path d="M 286 136 L 324.1 118.3" class="f-line"/><circle cx="324.1" cy="118.3" r="2.5" class="f-muted"/>
  <path d="M 286 136 L 328 136" class="f-line"/><circle cx="328" cy="136" r="2.5" class="f-muted"/>
  <path d="M 286 136 L 324.1 153.7" class="f-line"/><circle cx="324.1" cy="153.7" r="2.5" class="f-muted"/>
  <path d="M 286 136 L 313 168.2" class="f-line"/><circle cx="313" cy="168.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="136" r="4.5" class="f-accent"/>
  <text x="352" y="140" class="f-mono f-muted">5</text>
  <text x="600" y="139" class="f-label f-muted" text-anchor="end">deleted 14 aug</text>
  <text x="270" y="161" class="f-mono f-ink" text-anchor="end">refine.ts</text>
  <path d="M 286 157 L 313 124.8" class="f-line"/><circle cx="313" cy="124.8" r="2.5" class="f-muted"/>
  <path d="M 286 157 L 326.2 145" class="f-line"/><circle cx="326.2" cy="145" r="2.5" class="f-muted"/>
  <path d="M 286 157 L 326.2 169" class="f-line"/><circle cx="326.2" cy="169" r="2.5" class="f-muted"/>
  <path d="M 286 157 L 313 189.2" class="f-line"/><circle cx="313" cy="189.2" r="2.5" class="f-muted"/>
  <circle cx="286" cy="157" r="4.5" class="f-ink"/>
  <text x="352" y="161" class="f-mono f-muted">4</text>
  <text x="600" y="160" class="f-label f-muted" text-anchor="end">still here</text>
  <text x="270" y="182" class="f-mono f-ink" text-anchor="end">tells.ts</text>
  <path d="M 286 178 L 328 178" class="f-line"/><circle cx="328" cy="178" r="2.5" class="f-muted"/>
  <circle cx="286" cy="178" r="4.5" class="f-ink"/>
  <text x="352" y="182" class="f-mono f-muted">1</text>
  <text x="600" y="181" class="f-label f-muted" text-anchor="end">still here</text>
  <text x="270" y="203" class="f-mono f-ink" text-anchor="end">backfill-loop.sh</text>
  
  <circle cx="286" cy="199" r="4.5" class="f-ink"/>
  <text x="352" y="203" class="f-mono f-muted">0</text>
  <text x="600" y="202" class="f-label f-muted" text-anchor="end">still here</text>
  <text x="270" y="224" class="f-mono f-ink" text-anchor="end">critique.ts</text>
  
  <circle cx="286" cy="220" r="4.5" class="f-ink"/>
  <text x="352" y="224" class="f-mono f-muted">0</text>
  <text x="600" y="223" class="f-label f-muted" text-anchor="end">still here</text>
  <text x="270" y="245" class="f-mono f-ink" text-anchor="end">llm.ts</text>
  
  <circle cx="286" cy="241" r="4.5" class="f-ink"/>
  <text x="352" y="245" class="f-mono f-muted">0</text>
  <text x="600" y="244" class="f-label f-muted" text-anchor="end">still here</text>
</svg>
<figcaption>The 10 files under src, scripts and public with at least 5 commits, ranked by how many other files ride along in at least half of those commits. The 5 widest are the 5 that went on 14 August. The widest survivor is refine.ts at 4, on only 6 commits. One of its 4 partners is a dashboard file.</figcaption>
</figure>

## The braid that is still here

The mechanical writing checks live in code, in `src/lib/tells.ts`. The same rules also live as prose in the manual and the prompts. Of the 19 checks, 6 are named in the manual by their identifier. All 6 came from rules dictated to me by hand. Each landed in the code and in the manual in the same commit. `tells.ts` changed 13 times with `CLAUDE.md` alongside in 8 of them, 62%. From the other side `CLAUDE.md` changed 67 times with `tells.ts` alongside 8 times, 12%.

Grepping for the identifier is the only mechanical count I have and it undercounts badly. The dash rule is written out in prose in 5 documents as well as the code. The engagement bait rule is in 3. A rule restated in prose does not announce that it has a twin, so how wide this goes I cannot say.

I was going to write that the braid costs nothing, because one writer holds both ends and writes them in the same act. Then I ran probes through the checker to see whether those 6 pairs still say the same thing. 2 of them do not. One is quotes. The manual promises straight quotes in any text in any language, while the check looks for the guillemets only, so a curly quote goes through. The other is the number parade, where the manual describes a run of 3 number and word pairs and the regex wants commas between them. `1 tool 2 models 100 calls` is not caught at all. I have been running that checker over every draft since 26 August. It has been letting curly quotes past the whole time.

## What I did not check

Whether 3 weeks is long enough for the effect Hickey describes, which is about years. Whether 7 evenings in 2019 are a baseline at all. I computed the correlation between braid width and rework, then dropped it: only 5 surviving code files have enough commits to compute it on. And the word counter treats a renamed variable as churn. That goes into the denominator, so every survival number here is pushed down.

The habit I came in with was that generated code is cheap to write and therefore not worth being careful about. 85.0% is what changed it. Nearly all the code this repository has thrown away went on one decision about a premise. That decision was made in a conversation. Hickey puts a Dijkstra slide up at 49 minutes and reads it as programming being about thinking. None of my numbers tell me what that conversation cost. That is the figure I would actually want. I have not found a way to get it out of a repository.
