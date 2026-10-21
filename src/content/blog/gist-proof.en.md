---
title: "I wrote \"rerun it yourself\" under 4 gists. None of them ran as written"
description: "In August 4 posts on X linked a gist with the whole run and the promise that anyone can rerun it. I cloned each gist into an empty folder and ran its own command. 0 of 4 worked: the files carry number prefixes, a package.json is missing and the Java gist reported a green build with 0 tests. After 2 fixes each, the stored results reproduced and small live runs matched August. One gist was updated in place under a post that now quotes different numbers."
date: 2026-12-05
lang: en
translationKey: gist-proof
tags: ["reliability", "llm", "git"]
---
In August I published small measurements on X and under 4 of those posts the first reply was a link to a gist. The wording changed a little, the promise did not: "The whole run, if you want to check it or rerun it." Inside are the prompts, every reply and the script. The gist was supposed to be the proof.

I never opened those gists the way a stranger would. I checked that the page showed all the files and that the encoding survived the upload, then moved on to the next measurement. The scripts ran fine in my workspace, which is the only place I ever ran them.

On 12 October I did it. A fresh `git clone` of each gist into an empty folder, then the exact command from its own instructions. Node 22.23.1, tsx 4.23.15 through `npx`, Claude Code 2.1.292 and for the Java gist Temurin 25 with Gradle 9.8.0. The stranger here is me, a generous stranger who knows what the files are supposed to do. The problem is old: [Gistable](https://arxiv.org/abs/1808.04919) found that 75.6% of the Python gists it studied need real setup before they run. I had just never checked my own.

## 0 of 4

None of the 4 ran as written. In all 3 TypeScript gists the first error was a missing file, the one the instructions name:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../run.ts'
```

The instructions say `npx tsx run.ts`, but the file in the gist is `3-run.ts`. Every file in the gist has a number in front, so that the page, which sorts files by name, shows the method on top and the code at the bottom. The instructions were written in the workspace, where the file is called `run.ts`. Even the order does not hold: in the Java gist `10-PreviewsAgreeTest.java` sorts between `1-build.gradle.kts` and `2-settings.gradle.kts`.

Renaming is the obvious fix, but it is not enough. After it 2 of the 3 scripts fail inside esbuild:

```
ERROR: Top-level await is currently not supported with the "cjs" output format
```

Without a `package.json` that says `"type": "module"`, tsx compiles the file as CommonJS, while my scripts use `await` at the top level. My workspace has that `package.json`. The gists never had one. In the tool failure gist `reclassify.ts` has no such `await` and runs after the rename alone. Its `run.ts`, the script that makes the calls, fails like the others.

The Java gist failed first in Gradle, which found no build file in a folder holding `1-build.gradle.kts`. After the rename I got the result I liked least:

```
> Task :compileJava NO-SOURCE
> Task :test NO-SOURCE
BUILD SUCCESSFUL in 16s
```

The README comment next to `gradle test` promises that both strategies agree. Gradle looks for sources in `src/main/java`, the gist keeps everything in one folder, so it compiled nothing and reported success with 0 tests. I would have taken that as a pass. With the sources moved to `src/main/java` and the test to `src/test/java`, 3 tests passed and `gradle run` printed its table.

Every gist needed 2 fixes and each fix needs knowledge that is not in the gist.

<figure class="fig">
<svg viewBox="0 0 640 252" role="img" aria-label="A table of 4 gists and 3 attempts. arithmetic: as written × no run.ts, files renamed × await in CJS, + 1 more fix ✓ runs. tool failure: as written × no reclassify.ts, files renamed ✓ runs, + 1 more fix ✓ runs. tool honesty: as written × no run.ts, files renamed × await in CJS, + 1 more fix ✓ runs. preview cost: as written × no build file, files renamed ? 0 tests, green, + 1 more fix ✓ runs. Note: for tool failure the rename is enough for reclassify.ts, its run.ts also needs package.json.">
  <text x="239" y="18" text-anchor="middle" class="f-label f-muted">as written</text>
  <text x="399" y="18" text-anchor="middle" class="f-label f-muted">files renamed</text>
  <text x="559" y="18" text-anchor="middle" class="f-label f-muted">+ 1 more fix</text>
  <text x="150" y="50" text-anchor="end" class="f-mono f-ink" style="font-size:12px">arithmetic</text>
  <text x="150" y="66" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+ package.json</text>
  <rect x="162" y="30" width="154" height="44" rx="4" class="f-plain"/>
  <text x="178" y="57" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="192" y="56" class="f-mono f-muted" style="font-size:11.5px">no run.ts</text>
  <rect x="322" y="30" width="154" height="44" rx="4" class="f-plain"/>
  <text x="338" y="57" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="352" y="56" class="f-mono f-muted" style="font-size:11.5px">await in CJS</text>
  <rect x="482" y="30" width="154" height="44" rx="4" class="f-box"/>
  <text x="498" y="57" text-anchor="middle" class="f-mono f-ink" style="font-size:16px">✓</text>
  <text x="512" y="56" class="f-mono f-ink" style="font-size:11.5px">runs</text>
  <text x="150" y="100" text-anchor="end" class="f-mono f-ink" style="font-size:12px">tool failure</text>
  <text x="150" y="116" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+ package.json</text>
  <rect x="162" y="80" width="154" height="44" rx="4" class="f-plain"/>
  <text x="178" y="107" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="192" y="106" class="f-mono f-muted" style="font-size:11.5px">no reclassify.ts</text>
  <rect x="322" y="80" width="154" height="44" rx="4" class="f-box"/>
  <text x="338" y="107" text-anchor="middle" class="f-mono f-ink" style="font-size:16px">✓</text>
  <text x="352" y="106" class="f-mono f-ink" style="font-size:11.5px">runs *</text>
  <rect x="482" y="80" width="154" height="44" rx="4" class="f-box"/>
  <text x="498" y="107" text-anchor="middle" class="f-mono f-ink" style="font-size:16px">✓</text>
  <text x="512" y="106" class="f-mono f-ink" style="font-size:11.5px">runs</text>
  <text x="150" y="150" text-anchor="end" class="f-mono f-ink" style="font-size:12px">tool honesty</text>
  <text x="150" y="166" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+ package.json</text>
  <rect x="162" y="130" width="154" height="44" rx="4" class="f-plain"/>
  <text x="178" y="157" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="192" y="156" class="f-mono f-muted" style="font-size:11.5px">no run.ts</text>
  <rect x="322" y="130" width="154" height="44" rx="4" class="f-plain"/>
  <text x="338" y="157" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="352" y="156" class="f-mono f-muted" style="font-size:11.5px">await in CJS</text>
  <rect x="482" y="130" width="154" height="44" rx="4" class="f-box"/>
  <text x="498" y="157" text-anchor="middle" class="f-mono f-ink" style="font-size:16px">✓</text>
  <text x="512" y="156" class="f-mono f-ink" style="font-size:11.5px">runs</text>
  <text x="150" y="200" text-anchor="end" class="f-mono f-ink" style="font-size:12px">preview cost</text>
  <text x="150" y="216" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+ src/main/java</text>
  <rect x="162" y="180" width="154" height="44" rx="4" class="f-plain"/>
  <text x="178" y="207" text-anchor="middle" class="f-mono f-muted" style="font-size:16px">×</text>
  <text x="192" y="206" class="f-mono f-muted" style="font-size:11.5px">no build file</text>
  <rect x="322" y="180" width="154" height="44" rx="4" class="f-plain"/>
  <text x="338" y="207" text-anchor="middle" class="f-mono f-accent" style="font-size:16px">?</text>
  <text x="352" y="206" class="f-mono f-accent" style="font-size:11.5px">0 tests, green</text>
  <rect x="482" y="180" width="154" height="44" rx="4" class="f-box"/>
  <text x="498" y="207" text-anchor="middle" class="f-mono f-ink" style="font-size:16px">✓</text>
  <text x="512" y="206" class="f-mono f-ink" style="font-size:11.5px">runs</text>
  <text x="14" y="242" class="f-mono f-muted" style="font-size:10.5px">* reclassify.ts runs after the rename, run.ts needs package.json</text>
</svg>
<figcaption>Each gist from a fresh clone with the command from its own README, then one fix at a time. The Java gist after the rename is the only green result that tested nothing.</figcaption>
</figure>

## The quiet way to fail

There is one more path, the one a real stranger would take. The error names `run.ts`, so you rename `3-run.ts` and nothing else. Then you search the esbuild error and add `package.json`. The arithmetic script runs and prints:

```
claude-opus-5        answered 0/1  exact 0  <=1% 0  <=5% 0  median n/a ...
```

It exits with code 0. The call failed because the script passes `--mcp-config no-mcp.json` and the file is still `5-no-mcp.json`. The reason scrolls past as one line above the summary and goes into `results.json`, while the summary says 0 of 1 answered. My script checks carefully which model answered and throws if it is not the requested one. It does not check that any call worked at all.

## What held after the fixes

First I ran what costs nothing. For tool honesty that is a `--reclassify` mode, which exists in the script but not in the instructions. The arithmetic gist generates its 10 questions from a seed and gave the same questions with the same expected values as the stored results. The tool failure gist derives every verdict from the stored replies: 100 of 100 came out the same. Tool honesty has the same mode, 48 of 48.

Then real calls in small runs, with the 2 models the scripts use by default, haiku 4.5 and opus 5. Arithmetic: opus 10 of 10 exact, haiku 4 of 10, close to its 3 of 10 in August. Exact here means a relative error under 1 in a million, the same rule as in August.

Tool failure, 1 call per cell, reached the tool 20 of 20 times. An error or an empty result was reported in 7 of 8 replies. A truncated or swapped token was handed over in 8 of 8, the same split as in August. The odd reply was haiku writing `TOKEN: [file not found or empty]`, which the rules count as neither. In August the single miss was in the same cell.

In tool honesty the control with tools was right for both models, but only by my reading. The script scored one opus reply as invented: opus wrote "The token is:" with the token on the next line and the pattern took the colon as the value. The repository fixed this in September, the gist did not.

On H2 in memory, its default, the Java benchmark ran fine. Rollback was slower in 99.8% of 1500 pairs, by a median of 0.50 ms. The README table is from Postgres and says itself that H2 in memory does not reproduce that cost. [I measured that gap in another post](https://dimhold.by/blog/preview-cost-h2/).

## The gist moved under the post

The post of August 12 says haiku's worst answer was $5,775 short on a 5 year cash forecast. It also says haiku spent 3 times more reasoning tokens than opus. On August 16 I ran the same 10 questions on 4 models and updated the gist in place. I did it on purpose, so the old link would lead to the fuller run. That same link now shows haiku $8,451 over on the same task and 7.5 times the reasoning tokens of opus. My run on 12 October gave a third answer, $200 over.

Both runs are honest, but a reader who clicks from the August 12 post to check a number finds a different number. Nothing on the page says the post was about an earlier revision. That revision has not gone anywhere, because a gist is a git repository with an address for every revision, `gist.github.com/dimhold/<id>/<revision>`. I linked the bare id and the bare id always opens the latest.

<figure class="fig">
<svg viewBox="0 0 640 246" role="img" aria-label="The August 12 post says haiku was $5,775 short and spent 3 times more reasoning tokens. Its link has only the gist id. Revision of August 12: $5,775 short, 3.0 times the tokens of opus, 2 models. Revision of August 16: $8,451 over, 7.5 times, 4 models. The link opens the August 16 revision. The August 12 revision is still there at its own address.">
  <text x="14" y="22" class="f-label f-muted">post, August 12</text>
  <rect x="14" y="32" width="214" height="62" rx="5" class="f-plain"/>
  <text x="26" y="56" class="f-mono f-ink" style="font-size:11.5px">$5,775 short</text>
  <text x="26" y="78" class="f-mono f-ink" style="font-size:11.5px">3x the reasoning tokens</text>
  <text x="14" y="122" class="f-mono f-muted" style="font-size:11px">the link: gist id only</text>
  <text x="14" y="140" class="f-mono f-muted" style="font-size:10.5px">gist.github.com/dimhold/912566cf…</text>
  <rect x="264" y="14" width="362" height="84" rx="5" class="f-plain"/>
  <text x="276" y="34" class="f-label f-muted">revision Aug 12  0f12dde  ·  2 models</text>
  <text x="276" y="58" class="f-mono f-ink" style="font-size:12px">haiku $5,775 short</text>
  <text x="276" y="78" class="f-mono f-ink" style="font-size:11.5px">tokens 3.0x of opus</text>
  <rect x="264" y="132" width="362" height="84" rx="5" class="f-box"/>
  <text x="276" y="152" class="f-label f-muted">revision Aug 16  ca74721  ·  4 models</text>
  <text x="276" y="176" class="f-mono f-ink" style="font-size:12px">haiku $8,451 over</text>
  <text x="276" y="196" class="f-mono f-ink" style="font-size:11.5px">tokens 7.5x of opus</text>
  <text x="626" y="112" text-anchor="end" class="f-mono f-muted" style="font-size:10.5px">still there, at its own address</text>
  <text x="626" y="236" text-anchor="end" class="f-mono f-accent" style="font-size:11px">what the link opens now</text>
  <path d="M 150 150 C 200 170, 220 174, 256 174" class="f-line" fill="none"/>
  <path d="M 262 174 l -8 -4 l 0 8 z" class="f-accent"/>
</svg>
<figcaption>The same task cash-6 in both revisions. The post quotes the first one.</figcaption>
</figure>

## The repositories

On August 16 all 4 measurements also became repositories. There the file names are normal, `package.json` says `"type": "module"` and the Java code sits where Gradle looks for it. From a fresh clone the no cost runs worked for arithmetic and tool failure and `gradle test` in the preview repository ran 3 tests. The tool honesty repository has no run that costs nothing in its instructions, so I skipped it.

The repository has a trap of its own. `run.ts` writes `results.json` next to itself and in the repository that is the published data. My no cost run of the arithmetic script replaced it with an empty run, `git diff` shows 4 lines added and 530 removed. In the gist the data file is `4-results.json`, so the same thing happens there only after you rename everything, as I did. The tool honesty README already records that this happened there on September 6 and that git is the only reason the first results survived.

The posts still link the gists and none of the gists links its repository, so a reader coming from X lands on the version that does not run.

## What I did not check

- Windows. I wrote these scripts on Windows and reran them only on Linux.
- Whether the numbers hold. The live runs were small and only show that the scripts work.
- The Postgres path of the Java gist.
- A real stranger. I knew which files should exist and what each one does.

The fixes are cheap. The instructions should use the names that are in the gist, a `package.json` goes in and each gist gets a link to its repository. A post should point to a revision. I have not made these changes yet, because the gists sit under posts that are already out and I want to decide first how to mark an edit on them.
