---
title: "2 comment lines turned 62 findings into 0"
description: "Code review here runs in 3 stages and I had never picked the size of any of them on evidence. After 191 model calls the stage I would have defended hardest had not once disagreed with itself. The thing that kept turning out to be wrong was my own apparatus: 2 comment lines in the control file took 62 findings down to 0."
date: 2026-09-06
lang: en
translationKey: multi-agent-review
tags: ["agents", "code-quality", "llm"]
---
Code review here runs in 3 stages. N agents read the file and report defects, K skeptics try to refute every report, one agent merges what survives into a list. I set it up that way because the claude CLI I run agents with ships a research workflow built on that shape. Its phases sit in the binary as plain strings: fan out the searches, extract falsifiable claims, 3 votes of adversarial verification per claim with 2 refutes to kill, then merge the semantic duplicates. I copied that into code review without asking whether code review wants it. I have been paying for all 3 stages since and I never once picked N or K on evidence.

This week I measured it. 191 model calls and $11.76, counting a control round I threw away. The stage I would have defended hardest took $4.57 of that and never once disagreed with itself. What I did not expect is how often the thing that turned out to be wrong was my own apparatus rather than the agents. It happened 5 times. The worst of the 5 nearly went out as the headline of this post.

## The file

`clean.mjs` is a metrics collector of the kind this workspace actually needs. 184 lines: a semaphore over a FIFO queue, retries with backoff and jitter, a cache key, a nearest rank percentile and a daily summary line. A second script plants 12 defects into it by literal string replacement and the file the agents read comes out at 176 lines. A ledger records where each defect went. There is one file per defect carrying that defect alone.

Every defect is then proven by running the clean file against the file that carries only it. Proving them against the mutated file is the obvious thing to do and it gives the wrong answer. One defect can hide behind another there. One of mine does.

Every stage runs from a fresh temporary directory. No `CLAUDE.md` on the path and no tools. I checked that by hand rather than had the harness report it. The MCP config is empty. The operating manual of this repository is 889 lines of rules I wrote for myself. It goes into the prompt silently if the working directory is the repository. Node is 22.23.1, the claude CLI is 2.1.235, the model is `claude-opus-5` on 4 cores.

## Finding

8 finders got one identical prompt, 4 running at a time. They came back with 108 findings for $0.76. My scorer matches a finding to a planted defect when the reported line falls inside the planted span widened by 2 on each side. It said the mean finder catches 10.25 of 12 and the one nobody found is the semaphore.

I read the 108 claims because that last part looked wrong. All 8 finders had found the semaphore. 6 of them reported it at line 25 and 2 at line 26. That is the one `live++` the file still has. I had deleted the other one at line 18 and I had scored them on the position of my own edit. The window also handed 2 finders credit for defect 12. Their claims on those lines are about other things: a 200 response with a body that is not JSON and a journal directory nobody creates.

So nobody found defect 12 and in this file no failing status reaches it. Defect 12 removes the status check after the retry loop. Another planted defect removes the check that stops a bad status from being retried at all. The loop now either returns a good response or throws. I swept 9 failing statuses through the file and 0 of them reach the response body. Through the file carrying only defect 12, 6 do.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="A grid of 12 columns, one per planted defect, over 2 rows. The top row is what the line window scorer counted, the bottom row is what reading the claims counted. 10 columns hold 8 in both rows. The 2 that differ are P1 0 against 8, P12 2 against 0. They differ in opposite directions.">
  <text x="12" y="18" class="f-label f-muted">how many of 8 finders got each planted defect</text>
  <text x="146.83333333333334" y="44" class="f-label f-muted" text-anchor="middle">P1</text>
  <text x="188.5" y="44" class="f-label f-muted" text-anchor="middle">P2</text>
  <text x="230.16666666666666" y="44" class="f-label f-muted" text-anchor="middle">P3</text>
  <text x="271.8333333333333" y="44" class="f-label f-muted" text-anchor="middle">P4</text>
  <text x="313.49999999999994" y="44" class="f-label f-muted" text-anchor="middle">P5</text>
  <text x="355.16666666666663" y="44" class="f-label f-muted" text-anchor="middle">P6</text>
  <text x="396.8333333333333" y="44" class="f-label f-muted" text-anchor="middle">P7</text>
  <text x="438.49999999999994" y="44" class="f-label f-muted" text-anchor="middle">P8</text>
  <text x="480.16666666666663" y="44" class="f-label f-muted" text-anchor="middle">P9</text>
  <text x="521.8333333333334" y="44" class="f-label f-muted" text-anchor="middle">P10</text>
  <text x="563.5" y="44" class="f-label f-muted" text-anchor="middle">P11</text>
  <text x="605.1666666666666" y="44" class="f-label f-muted" text-anchor="middle">P12</text>
  <text x="12" y="69" class="f-label f-muted">line window</text>
  <rect x="128" y="52" width="37.666666666666664" height="26" class="f-box"/>
  <text x="146.83333333333334" y="70" class="f-mono f-accent" text-anchor="middle">0</text>
  <rect x="169.66666666666666" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="188.5" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="211.33333333333331" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="230.16666666666666" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="253" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="271.8333333333333" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="294.66666666666663" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="313.49999999999994" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="336.3333333333333" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="355.16666666666663" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="378" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="396.8333333333333" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="419.66666666666663" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="438.49999999999994" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="461.3333333333333" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="480.16666666666663" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="503" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="521.8333333333334" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="544.6666666666666" y="52" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="563.5" y="70" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="586.3333333333333" y="52" width="37.666666666666664" height="26" class="f-box"/>
  <text x="605.1666666666666" y="70" class="f-mono f-accent" text-anchor="middle">2</text>
  <text x="12" y="101" class="f-label f-muted">after reading</text>
  <rect x="128" y="84" width="37.666666666666664" height="26" class="f-box"/>
  <text x="146.83333333333334" y="102" class="f-mono f-accent" text-anchor="middle">8</text>
  <rect x="169.66666666666666" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="188.5" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="211.33333333333331" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="230.16666666666666" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="253" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="271.8333333333333" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="294.66666666666663" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="313.49999999999994" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="336.3333333333333" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="355.16666666666663" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="378" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="396.8333333333333" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="419.66666666666663" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="438.49999999999994" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="461.3333333333333" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="480.16666666666663" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="503" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="521.8333333333334" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="544.6666666666666" y="84" width="37.666666666666664" height="26" class="f-plain"/>
  <text x="563.5" y="102" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="586.3333333333333" y="84" width="37.666666666666664" height="26" class="f-box"/>
  <text x="605.1666666666666" y="102" class="f-mono f-accent" text-anchor="middle">0</text>
  <path d="M 146.83333333333334 110 L 146.83333333333334 130" class="f-line" stroke-dasharray="3 3"/>
  <text x="146.83333333333334" y="144" class="f-label f-accent" text-anchor="middle">P1</text>
  <text x="146.83333333333334" y="158" class="f-label f-muted" text-anchor="middle">L18</text>
  <path d="M 605.1666666666666 110 L 605.1666666666666 130" class="f-line" stroke-dasharray="3 3"/>
  <text x="605.1666666666666" y="144" class="f-label f-accent" text-anchor="middle">P12</text>
  <text x="605.1666666666666" y="158" class="f-label f-muted" text-anchor="middle">L155</text>
</svg>
<figcaption>12 planted defects, scored 2 ways. The line window counts a finding as a hit when its line falls inside the planted span widened by 2. Reading the claims moves P1 from 0 to 8 and P12 from 2 to 0.</figcaption>
</figure>

Corrected by reading, all 8 finders found the same 11 defects. On the planted defects, in this round, 7 of the 8 bought me nothing. Both ways of scoring end at 11 of 12 with different defects inside them.

That is one round, so I ran the 8 finders again on the same file with the same prompt. 108 findings, the same total, which I take as a coincidence. Of the 26 lines named in either round only 18 were named in both. The union was 11 again and the same 11, but one finder came back with 10. It missed the retry policy that retries a 400 and it really did miss it. There is nothing about retry policy anywhere in its 14 findings. The prompt allows 15, so nothing was crowded out.

## The file with nothing planted

The same 8 finders on the original `clean.mjs` returned 0 findings. 8 empty lists out of 8. I wrote that down as the false positive rate and moved on, pleased with the code.

`clean.mjs` opens with a docblock whose lines 4 to 6 say that this is the clean version. They also say that another script plants the defects into it. Line 4 is a blank comment line. The other 2 carry the statement. The mutation script strips exactly those lines when it writes the file the finders read. So in my control I had told 8 reviewers, in the first thing they laid eyes on, that the defects live in some other file.

I cut the lines, ran the same 8 finders and got 74 findings. Not one empty list. That looked like the answer, it was nearly the headline of this post and it was still not clean. Cutting 3 lines moves every line below them up by 3. The prompt hands the model a listing with the numbers on it. The finders had seen 2 changes where I meant them to see 1.

So I wrote a third file. The 2 lines that carry the statement, replaced in place by 2 that describe what the code does. Counters are pulled once per post and cached in the journal. The daily summary reads that back. 184 lines like `clean.mjs`, every line number where it was, every byte of code untouched. `diff` gives back those 2 lines and nothing else. 62 findings from the same 8 finders. 1 of the 8 still came back empty. There was an earlier run of that same file which I threw away because 2 finders hit a 429. The 6 that answered returned 59 findings between them and not one empty list.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="4 rows, one per file the finders were given. subject.mjs with 12 planted defects: 108 findings and the unguarded JSON.parse in readJournal flagged by 7 of 8 finders. clean.mjs with nothing planted, whose docblock carries 2 extra lines saying it is the clean version: 0 findings and 0 of 8 on that same parse. clean-noheader.mjs, the same clean code with those 2 lines and the blank comment line above them cut, which shortens the file to 181 lines: 74 findings and 8 of 8. clean-filler.mjs, the same clean code with those lines replaced by neutral ones so the file stays 184 lines and every line number stays where it was: 62 findings and 7 of 8. The function is 5 lines and byte identical in all 4.">
  <text x="12" y="18" class="f-label f-muted">the same 5 lines of code, read 4 times</text>
  <text x="196" y="46" class="f-label f-muted">docblock</text>
  <text x="300" y="46" class="f-label f-muted">findings</text>
  <text x="628" y="46" class="f-label f-muted" text-anchor="end">flagged the unguarded JSON.parse</text>
  <text x="12" y="74" class="f-mono f-ink">subject.mjs</text>
  <text x="12" y="89" class="f-label f-muted">12 defects planted</text>
  <text x="12" y="102" class="f-label f-muted">176 lines</text>
  <rect x="196" y="62" width="62" height="3" class="f-muted"/>
  <rect x="196" y="67" width="62" height="3" class="f-muted"/>
  <rect x="196" y="72" width="62" height="3" class="f-muted"/>
  <rect x="196" y="77" width="62" height="3" class="f-muted"/>
  <rect x="300" y="62" width="176" height="18" class="f-box"/>
  <text x="484" y="76" class="f-mono f-ink">108</text>
  <text x="628" y="76" class="f-mono f-ink" text-anchor="end">7 / 8</text>
  <text x="12" y="128" class="f-mono f-ink">clean.mjs</text>
  <text x="12" y="143" class="f-label f-muted">nothing planted</text>
  <text x="12" y="156" class="f-label f-muted">184 lines</text>
  <rect x="196" y="116" width="62" height="3" class="f-muted"/>
  <rect x="196" y="121" width="62" height="3" class="f-muted"/>
  <rect x="196" y="126" width="62" height="3" class="f-muted"/>
  <rect x="196" y="131" width="84" height="3" class="f-accent"/>
  <rect x="196" y="136" width="84" height="3" class="f-accent"/>
  <rect x="196" y="141" width="62" height="3" class="f-muted"/>
  <rect x="196" y="146" width="62" height="3" class="f-muted"/>
  <text x="196" y="163" class="f-label f-accent">says the file is the clean one</text>
  <rect x="300" y="116" width="2" height="18" class="f-box"/>
  <text x="310" y="130" class="f-mono f-ink">0</text>
  <text x="628" y="130" class="f-mono f-accent" text-anchor="end">0 / 8</text>
  <text x="12" y="182" class="f-mono f-ink">clean-noheader.mjs</text>
  <text x="12" y="197" class="f-label f-muted">nothing planted</text>
  <text x="12" y="210" class="f-label f-muted">181 lines</text>
  <rect x="196" y="170" width="62" height="3" class="f-muted"/>
  <rect x="196" y="175" width="62" height="3" class="f-muted"/>
  <rect x="196" y="180" width="62" height="3" class="f-muted"/>
  <rect x="196" y="185" width="62" height="3" class="f-muted"/>
  <rect x="300" y="170" width="120.5925925925926" height="18" class="f-box"/>
  <text x="428.5925925925926" y="184" class="f-mono f-ink">74</text>
  <text x="628" y="184" class="f-mono f-ink" text-anchor="end">8 / 8</text>
  <text x="12" y="236" class="f-mono f-ink">clean-filler.mjs</text>
  <text x="12" y="251" class="f-label f-muted">nothing planted</text>
  <text x="12" y="264" class="f-label f-muted">184 lines</text>
  <rect x="196" y="224" width="62" height="3" class="f-muted"/>
  <rect x="196" y="229" width="62" height="3" class="f-muted"/>
  <rect x="196" y="234" width="62" height="3" class="f-muted"/>
  <rect x="196" y="239" width="62" height="3" class="f-muted"/>
  <rect x="196" y="244" width="62" height="3" class="f-muted"/>
  <rect x="196" y="249" width="62" height="3" class="f-muted"/>
  <rect x="196" y="254" width="62" height="3" class="f-muted"/>
  <rect x="300" y="224" width="101.03703703703704" height="18" class="f-box"/>
  <text x="409.03703703703707" y="238" class="f-mono f-ink">62</text>
  <text x="628" y="238" class="f-mono f-ink" text-anchor="end">7 / 8</text>
</svg>
<figcaption>One and the same metrics collector, read 4 times. The 2nd file has nothing planted and a docblock that says so. It is the only one of the 4 that came back empty. The 3rd cuts those lines and the 4th replaces them in place, which is why the 4th is back at 184 lines with the parse on its original line. The last column is one function of 5 lines, byte identical in all 4 files.</figcaption>
</figure>

Whether those findings are any good is a question I can only settle by running the file. I collapsed the 74 into 16 distinct claims and decided each one with a script. All 16 hold and they cover all 74. 1 of the 16 is only half decided by a run and I come back to it at the end. Here are 5 of them. A cap of 0 deadlocks the semaphore. The abort timer is cleared before the body is read, so a timeout of 40 milliseconds let a body read of 120 milliseconds finish. `cacheKey("a", "b c", ["views"])` and `cacheKey("a b", "c", ["views"])` both return `0f7d1e1c5f119f46`. One failing post makes `Promise.all` discard every row already collected. And `summaryLine` builds its date prefix out of a filename, so it hands a person the string `2026-09-05.md: 12 posts, 400 views, p90 90`. My clean file was not clean.

The line window says 60 of the 62 findings from the third file sit within 2 lines of something those 16 claims already decided. I did not believe it this time. Reading them, 4 findings are about requests in flight that nobody deduplicates. The window files those under the claim that a journal hit of any age comes back without a request. What decides them is a different claim, that 2 posts on the same key both miss the cache and both fetch. Another 4 are about `fields` never reaching the request. Those 4 the window scatters over 2 other claims, when the one that settles them says `fields` changes the cache key and nothing else. The 16 claims do decide all 8 of these findings. The window is wrong about which claim decides which.

What I keep coming back to is `readJournal`. 5 lines, an unguarded `JSON.parse`, byte identical in all 4 files. In the mutated file 7 of 8 finders flagged it and 7 of 8 again in the repeat round. None of the 8 flagged it in `clean.mjs`, where it sits on line 83. 7 of 8 flagged it in the third file, where it also sits on line 83. I had an explanation ready for the first pair of numbers, something about the rest of the file changing what looks suspicious. It survives that pair, because the mutated file really does carry 12 defects. It does nothing for the last 2 of those. Same 184 lines, same line 83, 2 comment lines apart. What moved the answer was a sentence I had written about my own code.

## Verifying

For the second stage I needed claims that are false, because almost everything the finders said was true. I wrote 12 in the same register as theirs and falsified each one by running the code. The queue is LIFO, the percentile sorts in place and 10 more. Against them stand the 11 true claims in the finders' own words, unedited. Then 3 independent verifiers per claim, twice over. The adversarial prompt says to refute and to fall back on refuted when unsure. The neutral one only asks whether the claim is true.

That came to 138 calls and $4.57.

<figure class="fig">
<svg viewBox="0 0 640 172" role="img" aria-label="3 horizontal bars of cost in dollars, one per stage of a review, with the number of model calls beside each. Find: 8 calls, $0.76, 11 of 12 defects found. Verify: 138 calls, $4.57, 0 of 23 verdicts moved. Merge: 3 calls, $0.68, 16 entries. The verify bar is the longest and it is the one that changed nothing.">
  <text x="12" y="18" class="f-label f-muted">what each stage of a review cost and what it changed</text>
  <text x="12" y="59" class="f-label f-muted">find</text>
  <text x="12" y="72" class="f-label f-muted">8 calls</text>
  <rect x="128" y="44" width="46.63201904250765" height="21" class="f-box"/>
  <text x="182.63201904250764" y="60" class="f-mono f-ink">$0.76</text>
  <text x="128" y="78" class="f-label f-muted">11 of 12 found</text>
  <text x="12" y="97" class="f-label f-muted">verify</text>
  <text x="12" y="110" class="f-label f-muted">138 calls</text>
  <rect x="128" y="82" width="282" height="21" class="f-box"/>
  <text x="418" y="98" class="f-mono f-ink">$4.57</text>
  <text x="128" y="116" class="f-label f-muted">0 of 23 verdicts moved</text>
  <text x="12" y="135" class="f-label f-muted">merge</text>
  <text x="12" y="148" class="f-label f-muted">3 calls</text>
  <rect x="128" y="120" width="42.02463872412307" height="21" class="f-box"/>
  <text x="178.02463872412307" y="136" class="f-mono f-ink">$0.68</text>
  <text x="128" y="154" class="f-label f-muted">16 entries</text>
</svg>
<figcaption>149 model calls over the 3 stages of one review. The bar is what the stage cost, the line under it is what came out. Wall clock is not on the chart: verify took 219.7 seconds at 5 in flight against 70.4 for find at 4.</figcaption>
</figure>

All 3 verifiers agreed on all 23 claims in both modes and the 2 prompts produced identical verdicts on every claim. The vote bought nothing. Neither did the adversarial framing.

That result is narrow because of the way I built the test. My 12 false claims can be refuted by reading 3 to 5 lines of the file. A claim that needs 2 functions held in mind at once is where a second opinion should pay and I have no measurement of that. The 11 true claims are built one per planted defect, so the 18 findings that landed on no planted line never reached a verifier at all. Those are the ones most likely to have been false. That almost everything the finders said was true is an impression I got from reading them, not a number. The number I have is for the control file.

## Merging

108 findings across 23 distinct lines, 6 of which one finder saw alone. The merge agent gets the reports. It never sees the file. 3 runs gave 16 entries each at $0.227 a run. Once I had told the scorer about the 2 merges below, they dropped nothing and invented nothing. The prompt tells the merge agent not to drop a defect because only one reviewer saw it, so that property was asked for rather than discovered.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="2 horizontal axes of line numbers from 25 to 160. The upper axis carries 23 ticks, one per line the finders reported, with 6 of them drawn thick because only one finder saw them. The lower axis carries the 16 entries the merge produced. 2 curves cross between the axes, folding 158 into 82 and 160 into 152. The wider of the 2 spans 76 lines.">
  <text x="12" y="18" class="f-label f-muted">23 lines reported, 16 entries after the merge</text>
  <path d="M 40 62 L 600 62" class="f-plain"/>
  <path d="M 40 148 L 600 148" class="f-plain"/>
  <text x="12" y="48" class="f-label f-muted">reported 23</text>
  <text x="12" y="174" class="f-label f-muted">merged 16</text>
  <path d="M 40 53 L 40 71" class="f-plain" />
  <path d="M 44.1 53 L 44.1 71" class="f-plain" />
  <path d="M 110.5 53 L 110.5 71" class="f-plain" />
  <path d="M 152 53 L 152 71" class="f-plain" />
  <path d="M 156.1 53 L 156.1 71" class="f-plain" />
  <path d="M 176.9 53 L 176.9 71" class="f-plain" />
  <path d="M 214.2 53 L 214.2 71" class="f-line" stroke-width="2.2"/>
  <path d="M 218.4 53 L 218.4 71" class="f-plain" />
  <path d="M 243.3 53 L 243.3 71" class="f-plain" />
  <path d="M 276.4 53 L 276.4 71" class="f-line" stroke-width="2.2"/>
  <path d="M 301.3 53 L 301.3 71" class="f-plain" />
  <path d="M 334.5 53 L 334.5 71" class="f-plain" />
  <path d="M 371.9 53 L 371.9 71" class="f-plain" />
  <path d="M 409.2 53 L 409.2 71" class="f-plain" />
  <path d="M 434.1 53 L 434.1 71" class="f-plain" />
  <path d="M 438.2 53 L 438.2 71" class="f-plain" />
  <path d="M 442.4 53 L 442.4 71" class="f-plain" />
  <path d="M 479.7 53 L 479.7 71" class="f-plain" />
  <path d="M 537.8 53 L 537.8 71" class="f-line" stroke-width="2.2"/>
  <path d="M 566.8 53 L 566.8 71" class="f-plain" />
  <path d="M 583.4 53 L 583.4 71" class="f-line" stroke-width="2.2"/>
  <path d="M 591.7 53 L 591.7 71" class="f-line" stroke-width="2.2"/>
  <path d="M 600 53 L 600 71" class="f-line" stroke-width="2.2"/>
  <path d="M 40 139 L 40 157" class="f-plain"/>
  <path d="M 110.5 139 L 110.5 157" class="f-plain"/>
  <path d="M 156.1 139 L 156.1 157" class="f-plain"/>
  <path d="M 176.9 139 L 176.9 157" class="f-plain"/>
  <path d="M 218.4 139 L 218.4 157" class="f-plain"/>
  <path d="M 243.3 139 L 243.3 157" class="f-plain"/>
  <path d="M 276.4 139 L 276.4 157" class="f-plain"/>
  <path d="M 301.3 139 L 301.3 157" class="f-plain"/>
  <path d="M 334.5 139 L 334.5 157" class="f-plain"/>
  <path d="M 371.9 139 L 371.9 157" class="f-plain"/>
  <path d="M 409.2 139 L 409.2 157" class="f-plain"/>
  <path d="M 438.2 139 L 438.2 157" class="f-plain"/>
  <path d="M 479.7 139 L 479.7 157" class="f-plain"/>
  <path d="M 537.8 139 L 537.8 157" class="f-plain"/>
  <path d="M 566.8 139 L 566.8 157" class="f-plain"/>
  <path d="M 583.4 139 L 583.4 157" class="f-plain"/>
  <path d="M 591.7 72 C 591.7 105, 276.4 105, 276.4 138" class="f-line"/>
  <circle cx="591.7" cy="62" r="4" class="f-box"/>
  <circle cx="276.4" cy="148" r="4" class="f-box"/>
  <text x="599.7" y="48" class="f-label f-accent" text-anchor="end">158</text>
  <text x="276.4" y="174" class="f-label f-accent" text-anchor="middle">82</text>
  <path d="M 600 72 C 600 105, 566.8 105, 566.8 138" class="f-line"/>
  <circle cx="600" cy="62" r="4" class="f-box"/>
  <circle cx="566.8" cy="148" r="4" class="f-box"/>
  <text x="608" y="35" class="f-label f-accent" text-anchor="end">160</text>
  <text x="566.8" y="174" class="f-label f-accent" text-anchor="middle">152</text>
  <text x="12" y="206" class="f-label f-muted">lines 25 to 160</text>
  <path d="M 340 202 L 356 202" class="f-line" stroke-width="2.2"/>
  <text x="362" y="206" class="f-label f-muted">seen by one finder, 6</text>
</svg>
<figcaption>Where the 8 finders reported something and where the merge put it. The 2 curves are the merges that a scorer working on line distance cannot see.</figcaption>
</figure>

It also merged 2 findings that sit 76 lines apart: the journal write that is not atomic and the missing directory. It named both reviewers on the merged entry. My scorer called that 2 wrong attributions. A second merge like it, it called a dropped finding. Both stood until I read the entries and told it about them. The scorer only compares line numbers. One merge said so outright in the entry, the other only said both paths.

That is the fifth one. The line window was wrong about 2 defects in opposite directions. It was wrong again about which claim covers which finding in the control. The docblock in my control was wrong about the whole control. My fix for that docblock moved 178 line numbers I had not meant to move. The merge scorer was wrong about both merges. All 5 were mistakes in my apparatus. Every time my apparatus and an agent disagreed, the apparatus was the one that was wrong.

## What I did not check

One file, defects planted by replacing between 1 and 6 lines each. Real review work is a diff across files and the defect lives in the interaction. The finding stage ran twice and the merge 3 times. Verify ran once in each of its 2 prompt modes. Each version of the docblock got a single run, so 62 against 0 is one pair of rounds and not a distribution. False claims for the verifiers are mine and they are easy. Of the 16 control claims, 1 is only half decided by a run. I showed that the journal write does not create its directory. The missing rename I took on reading. The rename is what all 8 findings on that line were about. In the third control round 1 finder of the 8 returned an empty list. Why that one, I did not establish. The 2 lines I put in place of the giveaway are not a blank. They describe the journal and the cache, which is where a good part of the 62 findings live. So what I compared is an author saying the file is clean against an author describing the caching. That is not a tell against nothing. The 2 lines I took out also carried 2 signals at once, an all clear and a pointer at another file. I removed them together. Which of the 2 did the work, I did not separate. The $0.094 per finder call that $2.07 rests on comes from the mutated file. The clean file drew longer answers and ran up to $0.29 a call, so $2.07 is the cheap end of what I saw.

Of the 191 calls, 138 are verifiers and 48 are finders over 6 rounds. 3 went to the merge and the last 2 are retries after a 429. $4.57 against $0.76 looks like 6 times the price for the stage that changed nothing. Most of that gap is the second prompt mode and the 12 claims I wrote myself. A review does neither. Priced like for like, one review of this file is $2.07. Finding is $0.76 of that, the merge $0.23 and verifying the 11 claims that survive deduplication $1.09. Those 3 add to a cent more than the total, because each of them is rounded. At 2 finders and 1 verifier the same review is $0.78. I am moving to that, but I am keeping the second finder because of the run that came back with 10.

152 of the 190 JavaScript and TypeScript files in this repository open with a docblock saying what the file is for. I wrote most of them by hand. What I want to measure next is a defect that spans 2 files.
