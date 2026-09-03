---
title: "344 clock jumps this year, 2 of them a whole day"
description: "I read every zone in the database for 2011 and refined each jump to the minute. 336 of the 344 jumps are the familiar hour. The other 8 are 30 minutes, 2 hours, 3 hours and twice 1440 minutes: on 30 December, 9 days from now, 2 zones lose the whole day. And 26 zones will finish the year an hour away from where they started it."
date: 2011-12-21
lang: en
translationKey: timezones-that-skip
tags: ["time", "git"]
---

I add 24 hours when I want tomorrow. Everybody knows that this breaks twice a year, everybody says the word timezone in the review, then the change goes in with the 24 hours still in it because the fix is a library nobody wants to add today. That is roughly how it went for me in March. What I had never done is look at what the database says the year actually contains.

So I read all of it. Every zone the runtime knows about, the offset on each day of 2011, with every change refined down to the minute by bisecting inside the day. That is 418 zones, of which 185 moved at least once, for a total of 344 jumps.

336 of those 344 are the hour everybody argues about. The other 8 are the interesting ones.

<figure class="fig">
<svg viewBox="0 0 640 230" role="img" aria-label="The 344 offset jumps of 2011 sorted by size. 2 jumps of 30 minutes belong to Lord Howe Island. 336 jumps of 60 minutes are the ordinary ones. 3 jumps of 120 minutes belong to the Antarctic stations Troll and Davis. 1 jump of 180 minutes belongs to Casey. 2 jumps of 1440 minutes, a whole day, belong to Apia and Fakaofo on the 30th of December.">
  <text x="20" y="26" class="f-label f-muted">size of the jump</text>
  <text x="200" y="26" class="f-label f-muted">how many</text>
  <text x="330" y="26" class="f-label f-muted">who</text>
  <path d="M 20 36 L 620 36" class="f-line"/>
  <text x="20" y="62" class="f-mono f-ink">30 min</text>
  <rect x="200" y="48" width="6" height="18" class="f-box"/>
  <text x="216" y="62" class="f-mono f-ink">2</text>
  <text x="330" y="62" class="f-label f-muted">Lord Howe Island, both ways</text>
  <text x="20" y="96" class="f-mono f-ink">60 min</text>
  <rect x="200" y="82" width="120" height="18" class="f-plain"/>
  <text x="330" y="96" class="f-mono f-ink">336</text>
  <text x="380" y="96" class="f-label f-muted">the ordinary ones</text>
  <text x="20" y="130" class="f-mono f-ink">120 min</text>
  <rect x="200" y="116" width="9" height="18" class="f-box"/>
  <text x="216" y="130" class="f-mono f-ink">3</text>
  <text x="330" y="130" class="f-label f-muted">Troll twice, Davis once</text>
  <text x="20" y="164" class="f-mono f-ink">180 min</text>
  <rect x="200" y="150" width="3" height="18" class="f-box"/>
  <text x="216" y="164" class="f-mono f-ink">1</text>
  <text x="330" y="164" class="f-label f-muted">Casey, on 27 October</text>
  <text x="20" y="198" class="f-mono f-accent">1440 min</text>
  <rect x="200" y="184" width="6" height="18" class="f-accent"/>
  <text x="216" y="198" class="f-mono f-accent">2</text>
  <text x="330" y="198" class="f-label f-accent">Apia and Fakaofo, on 30 December</text>
  <text x="20" y="220" class="f-label f-muted">418 zones read, 185 of them moved</text>
</svg>
<figcaption>The bar for 60 minutes is cut to fit; it is 336 against 2. Everything anybody has ever written a helper function for is in that one row. The other 4 rows are what the helper gets wrong.</figcaption>
</figure>

Lord Howe Island moves by half an hour, which is the only zone in the database that does. The Antarctic stations move by 2 hours, twice for Troll and once for Davis. Casey moves by 3. Those are 6 jumps that a test suite full of 1 hour cases will never see.

Then there is 30 December, which has not happened yet. It is 9 days away.

## The day that will not exist

At 10:00 in the morning UTC on that day, Apia goes from minus 600 minutes to plus 840. An hour later Fakaofo does the same. Both are stepping across the date line, so the local calendar goes from Thursday 29 December straight to Saturday 31 December. For anybody standing there, Friday will not occur.

Every schedule that counts days by adding 86400000 milliseconds will produce a Friday in those zones. Every report that groups by local date will have an empty bucket in the middle. Every difference between 2 timestamps computed as days will be 1 too big.

I do not have a way to test that today. Neither does anybody else. The rule sits in the database with a date on it. That is the entire warning anybody is going to get.

## Spring forward, fall back, 26 exceptions

The count that made me suspect my own script: 186 of the jumps go forward and only 158 go back. Time is supposed to come home by the end of the year, so a difference of 28 looked like a bug in the way I scan the year boundary.

It is not a bug. 30 zones finish 2011 on a different offset than they started it.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="The 30 zones that end 2011 on a different offset than they began it. 25 zones in Russia and Belarus, including Moscow, Kaliningrad and Minsk, moved forward 60 minutes in March and never moved back. Bahia in Brazil is also 60 minutes ahead because its summer time is running on the 31st of December. Casey is 180 minutes ahead, Apia and Fakaofo are 1440 minutes ahead. Davis is 120 minutes behind.">
  <text x="20" y="26" class="f-label f-muted">zones whose offset on 31 December is not the offset on 1 January</text>
  <rect x="20" y="44" width="330" height="44" rx="3" class="f-accent"/>
  <text x="34" y="62" class="f-mono f-ink">25 zones, +60</text>
  <text x="34" y="80" class="f-label f-muted">Russia and Belarus: moved in March, stayed</text>
  <rect x="360" y="44" width="260" height="44" rx="3" class="f-box"/>
  <text x="374" y="62" class="f-mono f-ink">1 zone, +60</text>
  <text x="374" y="80" class="f-label f-muted">Bahia: summer time still running</text>
  <rect x="20" y="100" width="180" height="44" rx="3" class="f-box"/>
  <text x="34" y="118" class="f-mono f-accent">2 zones, +1440</text>
  <text x="34" y="136" class="f-label f-muted">Apia, Fakaofo</text>
  <rect x="210" y="100" width="140" height="44" rx="3" class="f-box"/>
  <text x="224" y="118" class="f-mono f-ink">1 zone, +180</text>
  <text x="224" y="136" class="f-label f-muted">Casey</text>
  <rect x="360" y="100" width="140" height="44" rx="3" class="f-box"/>
  <text x="374" y="118" class="f-mono f-ink">1 zone, -120</text>
  <text x="374" y="136" class="f-label f-muted">Davis</text>
  <text x="20" y="176" class="f-label f-muted">186 jumps forward against 158 back: here is where the 28 went</text>
</svg>
<figcaption>The symmetry people assume is not a property of the year. In 2011 it fails 30 times. 25 of those are one decision taken in one country in March.</figcaption>
</figure>

25 of the 30 are Russia and Belarus, which moved to summer time in March and stayed there. Minsk is on that list, which is the part I did not know until the script printed it. I have been reading that wall clock all year. The 26th zone at plus 60 is Bahia in Brazil, which is simply in the middle of its summer when the year ends.

## What the code has to survive

186 forward jumps mean 186 stretches of local time in 2011 that do not exist. Ask for 02:30 on the wrong night in the wrong zone and there is no such instant. 158 backward jumps mean 158 stretches that happen twice, so a local timestamp without an offset is ambiguous by an hour. On Lord Howe Island it is ambiguous by half an hour.

And the offsets themselves are not the round numbers a schema tends to assume. Across the year the database uses 41 distinct offsets from UTC. 15 of them are not whole hours: the familiar half hours plus 5.75, 8.75, 12.75 and 13.75.

## What I did not check

Whether the database I am reading today tells the truth about January. Zone data gets corrected after the fact, so the file describing 2011 is a file that has been edited during 2011. My scan cannot tell a rule from a later correction of a rule. I also read only what the runtime ships, which is 1 copy of the database rather than the several that a system usually has, so the operating system, the language and the database engine may each answer from a different vintage. That mismatch is a bug I have hit before and did not measure here.

The narrow claim is a rule of thumb about what to assume. A day is not 24 hours, an offset is not a whole number of hours, the clock does not come back by the end of the year. And in 9 days a Friday goes missing for 2 zones that have every right to expect Friday.
