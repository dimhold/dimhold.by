---
title: "The timezone my public commits give away is the wrong one"
description: "26 public repositories and 510 of my own commits. Guessing a timezone from the hours those commits were made has one clean minimum at +1. 422 of the 510 commit objects say +03:00. More timestamps make the wrong answer more confident. The offset I built 26 bare clones to read turned out to sit in a single unauthenticated GET."
date: 2026-08-27
lang: en
translationKey: red-line-open-data
tags: ["git", "time", "open-data"]
---

Last week I published a post about walking my dog. It carried 2 GPS tracks. I shifted every coordinate into the Pacific first, which keeps the shape of a walk and drops where it happened. That felt like the whole of my duty on the subject.

Then I noticed I have been pushing commits to public repositories since 2012 without shifting anything or looking at what they say. Guessing somebody's timezone from public commit times gets described as easy and I had assumed it works. I had only ever seen it demonstrated on people who were already found.

So I ran it on myself. 26 of my public repositories that are not forks, cloned bare with `--filter=blob:none`, which pulls the commit graph and skips file contents. 675 commits in the clones, 574 of them mine, 510 of those dated before today in UTC. git 2.43.0, gh 2.45.0, Python 3.12.3, Ubuntu 24.04.

My first pass found 23 fewer, because I filtered on the string `dimhold` and 23 of my commits carry a former employer's work address instead. That address names the company and brackets 6 years.

## The 26 clones I did not need

The commits endpoint of the REST API normalises author dates to Z. Commit `8c290e4` comes back as `2026-08-19T14:18:38Z`. So does `/git/commits/{sha}`, which is the endpoint I expected to be raw. The commit object in the clone says more:

```
author Dmitriy Semenkevich <dimhold@gmail.com> 1787149118 +0300
```

A unix second and a UTC offset. 17:18:38 local. That offset is what everything below is about and it is why I cloned 26 repositories. I did not need to. GitHub serves any commit as a patch with a mail header:

```
$ curl -s https://github.com/dimhold/whotop/commit/8c290e4.patch | sed -n 3p
Date: Wed, 19 Aug 2026 17:18:38 +0300
```

No token and no clone. There is a fourth route and GitHub documents it. `/stats/punch_card` counts commits per weekday and hour. The docs say the hours are "based on the time zone of individual commits". Unauthenticated, it reports `[3, 17, 3]` for that Wednesday, which is the local 17:00 rather than the 14:00 in UTC. Differencing it against `/commits` over all 26 repositories lands on +3, in 52 requests and no clone. Per repository it is weaker, with +3 winning outright in 18 of the 26 and +2 winning in 6. I found all this out with 26 bare clones already on disk.

<figure class="fig">
<svg viewBox="0 0 640 132" role="img" aria-label="Commit 8c290e4 read 4 ways, none of them needing a login. The commits endpoint of the REST API returns 14:18:38 Z with no offset. The raw object in a bare clone holds 1787149118 plus 0300. The patch route returns 17:18:38 plus 0300. The punch card endpoint reports weekday 3 hour 17 with 3 commits, which is the local hour. Only the commits endpoint loses the clock.">
  <defs>
    <marker id="rlArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="85" y="18" class="f-label f-muted" text-anchor="middle">commits api</text>
  <rect x="10" y="28" width="150" height="32" rx="3" class="f-plain"/>
  <text x="85" y="49" class="f-mono f-muted" text-anchor="middle">14:18:38Z</text>
  <path d="M 85 62 L 85 76" class="f-line" marker-end="url(#rlArrow)"/>
  <text x="85" y="92" class="f-label f-muted" text-anchor="middle">offset gone</text>
  <text x="245" y="18" class="f-label f-muted" text-anchor="middle">bare clone</text>
  <rect x="170" y="28" width="150" height="32" rx="3" class="f-box"/>
  <text x="245" y="49" class="f-mono f-accent" text-anchor="middle">1787149118 +0300</text>
  <path d="M 245 62 L 245 76" class="f-line" marker-end="url(#rlArrow)"/>
  <text x="245" y="92" class="f-label f-accent" text-anchor="middle">offset kept</text>
  <text x="405" y="18" class="f-label f-muted" text-anchor="middle">commit.patch</text>
  <rect x="330" y="28" width="150" height="32" rx="3" class="f-box"/>
  <text x="405" y="49" class="f-mono f-accent" text-anchor="middle">17:18:38 +0300</text>
  <path d="M 405 62 L 405 76" class="f-line" marker-end="url(#rlArrow)"/>
  <text x="405" y="92" class="f-label f-accent" text-anchor="middle">offset kept</text>
  <text x="565" y="18" class="f-label f-muted" text-anchor="middle">punch_card</text>
  <rect x="490" y="28" width="150" height="32" rx="3" class="f-box"/>
  <text x="565" y="49" class="f-mono f-accent" text-anchor="middle">[3, 17, 3]</text>
  <path d="M 565 62 L 565 76" class="f-line" marker-end="url(#rlArrow)"/>
  <text x="565" y="92" class="f-label f-accent" text-anchor="middle">local hour kept</text>
  <text x="320" y="122" class="f-label f-muted" text-anchor="middle">the same wednesday afternoon, only 1 of the 4 routes loses the clock</text>
</svg>
  <figcaption>One commit, 4 public routes, no login on any of them. The commits endpoint normalises the offset away, which is why I cloned 26 repositories. The patch route hands over the same field in 1 request and punch_card counts by local hour because GitHub documents it that way.</figcaption>
</figure>

## The estimator and the 2 hours it misses

The trick is simple. Take the public commit times in UTC and try all 27 whole hour offsets. Keep the one that puts the fewest commits inside the hours a working adult is assumed to sleep. I used 01:00 to 06:59 local.

Across the 496 commits the REST API returned, one offset wins outright. It is +1, with 6 of them in the sleeping window. 422 of my 510 commit objects say +03:00, which makes +3 the mode rather than a constant. At +3 the same 496 put 28 in the window.

So the estimate is off by 2 hours. `+01:00` does not appear in a single one of my 510 commits, so the trick returns an offset I have never committed from.

<figure class="fig">
<svg viewBox="0 0 640 244" role="img" aria-label="For 10 of the 27 candidate UTC offsets, the number of the 496 commits the REST API returned that would fall inside the assumed sleeping window. The curve drops from 45 at minus 2 to a single clean minimum of 6 at plus 1, rises to 9 at plus 2 and 28 at plus 3, then climbs to 134 at plus 7. Plus 3 is the offset written in most of the commit objects, so the minimum picks an answer that is wrong by 2 hours.">
  <rect x="42" y="135.7" width="36" height="40.3" rx="1" class="f-ink"/>
  <text x="60" y="129.7" class="f-mono f-muted" text-anchor="middle">45</text>
  <text x="60" y="196" class="f-mono f-ink" text-anchor="middle">-2</text>
  <rect x="98" y="152.7" width="36" height="23.3" rx="1" class="f-ink"/>
  <text x="116" y="146.7" class="f-mono f-muted" text-anchor="middle">26</text>
  <text x="116" y="196" class="f-mono f-ink" text-anchor="middle">-1</text>
  <rect x="154" y="166.1" width="36" height="9.9" rx="1" class="f-ink"/>
  <text x="172" y="160.1" class="f-mono f-muted" text-anchor="middle">11</text>
  <text x="172" y="196" class="f-mono f-ink" text-anchor="middle">+0</text>
  <rect x="210" y="170.6" width="36" height="5.4" rx="1" class="f-accent"/>
  <text x="228" y="164.6" class="f-mono f-muted" text-anchor="middle">6</text>
  <text x="228" y="196" class="f-mono f-ink" text-anchor="middle">+1</text>
  <rect x="266" y="167.9" width="36" height="8.1" rx="1" class="f-ink"/>
  <text x="284" y="161.9" class="f-mono f-muted" text-anchor="middle">9</text>
  <text x="284" y="196" class="f-mono f-ink" text-anchor="middle">+2</text>
  <rect x="322" y="150.9" width="36" height="25.1" rx="1" class="f-muted"/>
  <text x="340" y="144.9" class="f-mono f-muted" text-anchor="middle">28</text>
  <text x="340" y="196" class="f-mono f-ink" text-anchor="middle">+3</text>
  <rect x="378" y="135.7" width="36" height="40.3" rx="1" class="f-ink"/>
  <text x="396" y="129.7" class="f-mono f-muted" text-anchor="middle">45</text>
  <text x="396" y="196" class="f-mono f-ink" text-anchor="middle">+4</text>
  <rect x="434" y="107.9" width="36" height="68.1" rx="1" class="f-ink"/>
  <text x="452" y="101.9" class="f-mono f-muted" text-anchor="middle">76</text>
  <text x="452" y="196" class="f-mono f-ink" text-anchor="middle">+5</text>
  <rect x="490" y="82.0" width="36" height="94.0" rx="1" class="f-ink"/>
  <text x="508" y="76.0" class="f-mono f-muted" text-anchor="middle">105</text>
  <text x="508" y="196" class="f-mono f-ink" text-anchor="middle">+6</text>
  <rect x="546" y="56.0" width="36" height="120.0" rx="1" class="f-ink"/>
  <text x="564" y="50.0" class="f-mono f-muted" text-anchor="middle">134</text>
  <text x="564" y="196" class="f-mono f-ink" text-anchor="middle">+7</text>
  <path d="M 34 176 L 590 176" class="f-plain"/>
  <text x="20" y="20" class="f-label f-muted">commits landing in the assumed sleep window</text>
  <text x="20" y="214" class="f-label f-muted">candidate offset applied to the utc hours</text>
  <text x="228" y="234" class="f-label f-accent" text-anchor="middle">the minimum, also the wrong answer</text>
  <text x="474.40000000000003" y="234" class="f-label f-muted" text-anchor="middle">what 422 of 510 commits say</text>
  <path d="M 340 204 L 429.59999999999997 228" class="f-line"/>
</svg>
  <figcaption>The estimator has one clean minimum over all 27 candidates and it sits 2 hours from the offset most of my commits state outright. No commit of mine carries plus 01:00 at all.</figcaption>
</figure>

## Why it misses

I work after midnight. 32 of my commits sit in local hours 00 and 01. The window the trick assumes to be sleep holds 28. Counting the 510 from the clones gives the same number as the 496 from REST. Measured at the same 6 hour width, my quietest window starts at 03:00 and holds 12. The 2 windows are 2 hours apart, which is the size of the error.

What the estimator finds is the offset that makes me look like a normal sleeper. It gets there by sliding my clock back until the work after midnight reads as late evening. I have not tested that story by dropping those commits and estimating again.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="Local hour histogram of 510 public commits. The bars stand at 16 at midnight and 16 at 01:00, dip to 1 at 03:00 and 04:00 and 0 at 06:00, then rise to a peak of 62 at 17:00 while evenings stay heavy at 30 to 42 an hour. The window an estimator assumes to be sleep, 01:00 to 06:59, holds 28 commits. Measured at the same 6 hour width, the quietest window starts at 03:00 and holds 12.">
  <rect x="68.6" y="30" width="146.00000000000003" height="166" rx="2" class="f-box"/>
  <rect x="44.0" y="157.3" width="23" height="38.7" rx="1" class="f-ink"/>
  <rect x="68.6" y="157.3" width="23" height="38.7" rx="1" class="f-ink"/>
  <rect x="93.2" y="179.1" width="23" height="16.9" rx="1" class="f-ink"/>
  <rect x="117.8" y="193.6" width="23" height="2.4" rx="1" class="f-ink"/>
  <rect x="142.4" y="193.6" width="23" height="2.4" rx="1" class="f-ink"/>
  <rect x="167.0" y="188.7" width="23" height="7.3" rx="1" class="f-ink"/>
  <rect x="216.2" y="193.6" width="23" height="2.4" rx="1" class="f-ink"/>
  <rect x="240.8" y="181.5" width="23" height="14.5" rx="1" class="f-ink"/>
  <rect x="265.4" y="181.5" width="23" height="14.5" rx="1" class="f-ink"/>
  <rect x="290.0" y="137.9" width="23" height="58.1" rx="1" class="f-ink"/>
  <rect x="314.6" y="157.3" width="23" height="38.7" rx="1" class="f-ink"/>
  <rect x="339.2" y="157.3" width="23" height="38.7" rx="1" class="f-ink"/>
  <rect x="363.8" y="128.3" width="23" height="67.7" rx="1" class="f-ink"/>
  <rect x="388.4" y="118.6" width="23" height="77.4" rx="1" class="f-ink"/>
  <rect x="413.0" y="82.3" width="23" height="113.7" rx="1" class="f-ink"/>
  <rect x="437.6" y="135.5" width="23" height="60.5" rx="1" class="f-ink"/>
  <rect x="462.2" y="46.0" width="23" height="150.0" rx="1" class="f-ink"/>
  <rect x="486.8" y="94.4" width="23" height="101.6" rx="1" class="f-ink"/>
  <rect x="511.4" y="121.0" width="23" height="75.0" rx="1" class="f-ink"/>
  <rect x="536.0" y="106.5" width="23" height="89.5" rx="1" class="f-ink"/>
  <rect x="560.6" y="123.4" width="23" height="72.6" rx="1" class="f-ink"/>
  <rect x="585.2" y="118.6" width="23" height="77.4" rx="1" class="f-ink"/>
  <rect x="609.8" y="121.0" width="23" height="75.0" rx="1" class="f-ink"/>
  <path d="M 44 196 L 632.8 196" class="f-plain"/>
  <text x="55.5" y="212" class="f-mono f-muted" text-anchor="middle">00</text>
  <text x="129.3" y="212" class="f-mono f-muted" text-anchor="middle">03</text>
  <text x="203.1" y="212" class="f-mono f-muted" text-anchor="middle">06</text>
  <text x="276.9" y="212" class="f-mono f-muted" text-anchor="middle">09</text>
  <text x="350.7" y="212" class="f-mono f-muted" text-anchor="middle">12</text>
  <text x="424.5" y="212" class="f-mono f-muted" text-anchor="middle">15</text>
  <text x="498.3" y="212" class="f-mono f-muted" text-anchor="middle">18</text>
  <text x="572.1" y="212" class="f-mono f-muted" text-anchor="middle">21</text>
  <path d="M 117.8 222 L 263.8 222" class="f-line"/>
  <text x="20" y="22" class="f-label f-muted">hour of day, as the commit object records it</text>
  <text x="68.6" y="44" class="f-label f-accent">assumed asleep 01:00 to 06:59, holds 28</text>
  <text x="20" y="240" class="f-label f-muted">quietest 6 hours start at 03:00 and hold 12</text>
  <text x="473.7" y="34" class="f-label f-muted" text-anchor="middle">62 at 17:00</text>
</svg>
  <figcaption>The assumed sleeping window and the quietest window of the same width start 2 hours apart. That gap is where the error comes from. Every hour here is read off the offset stored in the commit.</figcaption>
</figure>

I expected more data to fix this and it does the opposite. I drew 2000 random subsamples of the 496 UTC hours at each size. At n=20 the estimate says +1 in 41.2% of runs. At n=100 it says +1 in 59.5% of them and at n=200 in 67.3%. Over the same range +3 falls from 9.8% to 0.1%. The subsamples show the estimate converging on one person's schedule, so they cannot separate a broken assumption from an unusual sleeper.

## Who has done this already

The offset field is old ground. An OpenSym paper in 2016 read it off git logs and mailing lists. A SWAN paper in 2017 ran circular statistics over it. An MSR paper in 2022 used it to help place 2.2 billion commits on a map. Mo Beigi published the patch route in May 2025 and used it to reconstruct a colleague's travel. The estimator is where the ground gets thin. In the xz backdoor threads of April 2024 one analyst counted the offsets and read +0800. Another looked at the hour histogram and wrote that the UTC+03 hypothesis "seems to have been backwards". Same commits, 2 competent people, 2 answers. Neither had ground truth to settle it.

## What the offset actually describes

7 of my commits carry -07:00 and -08:00, dated between 2012 and 2014. I had no idea why. All 7 match `America/Los_Angeles` across the 4 daylight saving switches that fall between them. One sits at -08:00 a full 4 days before that year's switch. A clock nobody configured does not track US daylight saving for 21 months.

Then I checked what those commits were. 6 of the 7 are an `Initial commit` with no parent, each stamped within 1 second of the repository's own creation time. The 7th is a merge of pull request #1. So 6 of the 7 came out of GitHub's servers rather than a machine of mine. The 7th I am inferring from the message alone. Whose clock was set to US Pacific the data does not say, only that all 7 follow it.

It cuts the other way too. 96 of my 510 commits land on an exact minute, which is 18.8% where 1 in 60 is what a keyboard produces. 41 of the 96 sit exactly on the hour. Almost all of them were set by hand or by a script. A fifth of what I call ground truth is not when I worked.

## The red line

The clones did not hold only my commits. 101 of the 675 rows belonged to 5 other addresses. Their objects carry offsets in the same field mine do.

That looked like the experiment this post wanted. Other people, answers known in advance, a way to tell a broken assumption from an unusual sleeper. I deleted the rows and the clones instead. The count of what was destroyed went into `others-count.txt` without the addresses.

The refusal cost me less than I expected. 1 of the 5 addresses is a bot with 3 commits. The 4 people hold 57, 34, 5 and 2. An estimate from 3 timestamps hits +3 only 12.2% of the time in those subsamples. Only 2 of those 4 were worth calibrating against. My headline number is still measured on a sample of 1.

Those timestamps sit in my working directory only because I cloned a repository their owners once contributed to. One line of awk would have profiled them and I do not think the ease of it is an argument.

## What I did not check

The candidate grid is whole hours, so it cannot express +05:30 or +05:45. One of the other people in the same clones committed with an offset of -04:30. I did not look at the GraphQL API. I also did not check whether a rebase had rewritten any 2026 commit dates. If it had, the offsets I am treating as ground truth for this year are younger than the commits they sit in.
