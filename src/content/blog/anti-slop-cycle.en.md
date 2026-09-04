---
title: "The critic passes 13 of the 16 drafts my checks fail"
description: "Every draft here goes past 19 mechanical checks and then past a model critic that scores it from 0 to 10. I have been saying the checks own what has one answer while the critic owns judgment. I never put a number on that. On 16 real drafts all 16 fire the checks and 13 land at or under the passing score. Inject 8 violations of my comma rule and the critic still says 2.7."
date: 2026-09-03
lang: en
translationKey: anti-slop-cycle
tags: ["llm", "code-quality"]
---
Yesterday I ran my drafting cycle over 16 of my own topics and read the reports. The draft of a blog essay about keeping state in files came back with a critic score of 2 out of 10. In this setup that means it does not smell of a model and goes to me for reading. The mechanical checks on the same file counted 10 hits, 8 of them a comma before `and`.

That comma is not something the critic has to work out from my style. It is hard check number 3 in the critic's own prompt, written there as `Comma before and / or → 0`. And the critic did see one of the 8: its remarks on that draft quote a comma before `and` and call it a violation of the hard check. It named the thing and still returned a 2. The sentence I use to explain this cycle says anything with a definite answer gets decided in code before the model is asked anything. The model keeps only the judgement calls. That line sits in the header comment of `tells.ts` and I repeat it whenever somebody asks how the drafting works. I had never measured it.

## The cycle and the setup

A draft goes through `src/lib/tells.ts` first. There are 19 checks there. About half landed after a correction I made by hand: no dash in English, no comma before `and`, digits for counts. The rest arrived as a rubric I never tested. Then the draft goes to the critic in `prompts/_critic.md`, which returns remarks and a score from 0 to 10 where lower is better. At 3 or under it stops and waits for me. Above 3 it gets rewritten, up to 2 rounds.

Everything below ran with `claude-opus-5` through the claude CLI 2.1.235 on node 22.23.1, against `tells.ts` at commit `0f0b511`. The runs happen inside this repository on purpose. A clean directory is the right call when the model is what you measure. In August I counted 0 dashes across 30 machine texts and reported it as a property of the model. It was this repository's own ban being obeyed. The same model from an empty folder gave 6.10 dashes per 1000 words. Here I measure the cycle with the repository's own `CLAUDE.md` in the context, because that is how it works every day.

## 16 drafts through the real pipeline

16 topics, 12 approved for X and 4 blog essays. All 16 fired the checks: 125 hits in total, between 1 and 20 per draft. The critic gave scores from 2 to 5 with a mean of 2.9, so 13 of the 16 sit at or under the threshold. The loop would stop there and hand me the file.

That total needed a repair before it meant anything. One draft came back wrapped end to end in a single code fence. The check for welded hyphens strips fenced blocks before it looks, so that draft counted as 0 words of prose. Peeling off the one outer fence is the difference between 123 hits and 125.

62 of the 125 hits are that one comma. The correlation between the critic's score and the hit count looks encouraging at r = 0.51 over 16 points. Per 1000 words it is r = -0.21. Hits and draft length go together at r = 0.77. The score against length is r = 0.41, so that first number is mostly telling me that long drafts are long.

## Feeding it violations on purpose

So I held the text still and varied one thing. A clean piece of 857 words that fires nothing, with k violations of a single rule injected into it, k doubling from 1 up to 8. Every version went to the critic 3 times, the clean base included.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="A line chart of the critic score against the number of injected violations of one rule. The horizontal axis lists k equal to 0, 1, 2, 4 and 8, the vertical axis runs from 1.5 to 6.5. All three rules start from the same clean base scoring 2.3 at k equal to 0. Injected signposts climb from 2.0 at k equal to 1 to 2.7, then 4.0 and 6.0 at k equal to 8. Injected dashes climb from 2.0 to 3.0, 3.0 and 4.0. Injected commas before and stay at 2.0, 2.0, 2.7 and 2.7, below the dashed threshold line at 3 that stops the rewrite loop.">
  <text x="20" y="18" class="f-label f-muted">critic score against injected violations of one rule</text>
  <path d="M 90 210 L 476 210" class="f-plain"/>
  <path d="M 90 34 L 90 210" class="f-plain"/>
  <path d="M 85 193 L 90 193" class="f-plain"/>
  <text x="81" y="196.5" class="f-label f-muted" text-anchor="end">2</text>
  <path d="M 85 159 L 90 159" class="f-plain"/>
  <text x="81" y="162.5" class="f-label f-muted" text-anchor="end">3</text>
  <path d="M 85 125 L 90 125" class="f-plain"/>
  <text x="81" y="128.5" class="f-label f-muted" text-anchor="end">4</text>
  <path d="M 85 91 L 90 91" class="f-plain"/>
  <text x="81" y="94.5" class="f-label f-muted" text-anchor="end">5</text>
  <path d="M 85 57 L 90 57" class="f-plain"/>
  <text x="81" y="60.5" class="f-label f-muted" text-anchor="end">6</text>
  <path d="M 90 210 L 90 215" class="f-plain"/>
  <text x="90" y="229" class="f-label f-muted" text-anchor="middle">0</text>
  <path d="M 185 210 L 185 215" class="f-plain"/>
  <text x="185" y="229" class="f-label f-muted" text-anchor="middle">1</text>
  <path d="M 280 210 L 280 215" class="f-plain"/>
  <text x="280" y="229" class="f-label f-muted" text-anchor="middle">2</text>
  <path d="M 375 210 L 375 215" class="f-plain"/>
  <text x="375" y="229" class="f-label f-muted" text-anchor="middle">4</text>
  <path d="M 470 210 L 470 215" class="f-plain"/>
  <text x="470" y="229" class="f-label f-muted" text-anchor="middle">8</text>
  <text x="280" y="246" class="f-label f-muted" text-anchor="middle">violations injected, k</text>
  <path d="M 90 159 L 470 159" class="f-line" stroke-dasharray="3 3"/>
  <text x="96" y="153" class="f-label f-muted">threshold 3, the rewrite loop stops here</text>
  <path d="M 90 182.8 L 185 193 L 280 169.2 L 375 125 L 470 57" style="fill:none;stroke:var(--accent);stroke-width:1.2"/>
  <circle cx="90" cy="182.8" r="3.5" class="f-accent"/>
  <circle cx="185" cy="193" r="3.5" class="f-accent"/>
  <circle cx="280" cy="169.2" r="3.5" class="f-accent"/>
  <circle cx="375" cy="125" r="3.5" class="f-accent"/>
  <circle cx="470" cy="57" r="3.5" class="f-accent"/>
  <text x="478" y="60.5" class="f-label f-accent">signpost, 6.0</text>
  <path d="M 90 182.8 L 185 193 L 280 159 L 375 159 L 470 125" class="f-plain" fill="none" stroke-dasharray="6 4"/>
  <circle cx="90" cy="182.8" r="3.5" class="f-plain"/>
  <circle cx="185" cy="193" r="3.5" class="f-plain"/>
  <circle cx="280" cy="159" r="3.5" class="f-plain"/>
  <circle cx="375" cy="159" r="3.5" class="f-plain"/>
  <circle cx="470" cy="125" r="3.5" class="f-plain"/>
  <text x="478" y="128.5" class="f-label f-muted">dash, 4.0</text>
  <path d="M 90 182.8 L 185 193 L 280 193 L 375 169.2 L 470 169.2" class="f-plain" fill="none"/>
  <circle cx="90" cy="182.8" r="3.5" class="f-plain"/>
  <circle cx="185" cy="193" r="3.5" class="f-plain"/>
  <circle cx="280" cy="193" r="3.5" class="f-plain"/>
  <circle cx="375" cy="169.2" r="3.5" class="f-plain"/>
  <circle cx="470" cy="169.2" r="3.5" class="f-plain"/>
  <text x="478" y="172.7" class="f-label f-muted">comma before and, 2.7</text>
</svg>
<figcaption>Every point is the mean of 3 critic runs on the same 857 words. The base without injections scores 2.3. Signposting reaches 6.0 and my comma rule never leaves the passing band.</figcaption>
</figure>

Signposting behaves the way I hoped. At 8 injections it reaches 6.0, well above the threshold, named in every run. Dashes reach 4.0. My comma rule finishes at 2.7 with 8 of them in the text. That is inside the passing band, against 2.3 for the base with nothing injected. At 8 commas all 3 runs do name the rule in their remarks while the number stays where a draft goes out to me.

Counting how often the critic names a rule is where I tripped. My first pass matched the dash character inside its remarks, which gave a flattering answer until I looked at what it was matching. The critic writes dashes itself, in 42 of its 90 remarks, in a repository whose first English rule is that there are none. Matching the word `dash` dropped the answer to 1 of the 4 drafts that had one.

## The same text, 12 times

A mean of 2.9 is worth something only if the number repeats. I ran the critic 12 times on one text, then 12 times on the same text with 2 dashes in it.

<figure class="fig">
<svg viewBox="0 0 640 218" role="img" aria-label="A run chart of 12 critic runs on the same text, twice. The vertical axis is the score from 1 to 4. On the clean text the scores are 2, 3, 2, 2, 2, 1, 3, 2, 3, 2, 2 and 2, scattered across 1 to 3. On the same text with 2 dashes injected every one of the 12 runs returns 3, a flat line.">
  <circle cx="106" cy="29" r="3.5" class="f-plain"/>
  <text x="116" y="32" class="f-label f-muted">clean text, 12 runs</text>
  <circle cx="346" cy="29" r="3.5" class="f-accent"/>
  <text x="356" y="32" class="f-label f-accent">same text, 2 dashes</text>
  <path d="M 100 190 L 450 190" class="f-plain"/>
  <path d="M 100 44 L 100 190" class="f-plain"/>
  <path d="M 95 180 L 100 180" class="f-plain"/>
  <text x="91" y="183.5" class="f-label f-muted" text-anchor="end">1</text>
  <path d="M 95 136.7 L 100 136.7" class="f-plain"/>
  <text x="91" y="140.2" class="f-label f-muted" text-anchor="end">2</text>
  <path d="M 95 93.3 L 100 93.3" class="f-plain"/>
  <text x="91" y="96.8" class="f-label f-muted" text-anchor="end">3</text>
  <path d="M 95 50 L 100 50" class="f-plain"/>
  <text x="91" y="53.5" class="f-label f-muted" text-anchor="end">4</text>
  <path d="M 110 93.3 L 140 93.3 L 170 93.3 L 200 93.3 L 230 93.3 L 260 93.3 L 290 93.3 L 320 93.3 L 350 93.3 L 380 93.3 L 410 93.3 L 440 93.3" style="fill:none;stroke:var(--accent);stroke-width:1.2"/>
  <path d="M 110 136.7 L 140 93.3 L 170 136.7 L 200 136.7 L 230 136.7 L 260 180 L 290 93.3 L 320 136.7 L 350 93.3 L 380 136.7 L 410 136.7 L 440 136.7" class="f-plain" fill="none"/>
  <circle cx="110" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="140" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="170" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="200" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="230" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="260" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="290" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="320" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="350" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="380" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="410" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="440" cy="93.3" r="3.5" class="f-accent"/>
  <circle cx="110" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="140" cy="93.3" r="3.5" class="f-plain"/>
  <circle cx="170" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="200" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="230" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="260" cy="180" r="3.5" class="f-plain"/>
  <circle cx="290" cy="93.3" r="3.5" class="f-plain"/>
  <circle cx="320" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="350" cy="93.3" r="3.5" class="f-plain"/>
  <circle cx="380" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="410" cy="136.7" r="3.5" class="f-plain"/>
  <circle cx="440" cy="136.7" r="3.5" class="f-plain"/>
  <path d="M 110 190 L 110 195" class="f-plain"/>
  <text x="110" y="209" class="f-label f-muted" text-anchor="middle">1</text>
  <path d="M 440 190 L 440 195" class="f-plain"/>
  <text x="440" y="209" class="f-label f-muted" text-anchor="middle">12</text>
</svg>
<figcaption>Nothing changes between the runs except the 2 dashes injected into the lower line. The clean version scatters over 1 to 3 across 12 runs. With the dashes in it the answer is 3 every time.</figcaption>
</figure>

The clean text scatters over 1 to 3 with a mean of 2.2. The dosed one returns 3 on all 12 runs. The critic wobbles on clean prose and locks on dirty prose. That is backwards from what I assumed, but 1 text and 1 rule is thin evidence.

## Which report a rewrite should get

Here the question turns into a decision. A forced rewrite round on 15 drafts, 2 arms, the same model in both. Arm A gets the critic's remarks. Arm B gets the machine report, meaning rule names and counts. Both arms start from the text as the cycle left it, so their opening counts are lower than in the table above.

Arm B answered on 8 of the 15 drafts and took 4 of those 8 down to 0 hits, introducing no new rule anywhere. Arm A answered on 9 and took none of them to 0. In 4 of the 9 it introduced a rule that was not in the draft before. One essay went from 4 hits to 8 while doing exactly what the critic asked for. The missing cells are the CLI answering HTTP 429 on a spend limit. A tenth A cell finished and was lost, because the script writes its file after both arms and the process died in between.

## Where the checks fail, on a list I typed myself

The check named `spelled-number` fires on counts written as words. The rule is a sentence in a voice guide. The check that enforces it is a list of 15 words.

<figure class="fig">
<svg viewBox="0 0 640 204" role="img" aria-label="Two boxes of English counting words. The left box holds the 15 words the spelled-number check lists: two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, twenty, thirty, forty and fifty. The right box holds 11 counting words the check does not list: thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, sixty, seventy, eighty and ninety. 8 occurrences from the right box are present in essays already published on this site.">
  <text x="20" y="34" class="f-label f-muted">listed in the check, 15 words</text>
  <text x="330" y="34" class="f-label f-accent">missing from it, 11 words</text>
  <rect x="20" y="44" width="290" height="124" rx="4" class="f-plain"/>
  <rect x="330" y="44" width="290" height="124" rx="4" class="f-box"/>
  <text x="32" y="70" class="f-mono f-ink">two three four five</text>
  <text x="32" y="94" class="f-mono f-ink">six seven eight nine</text>
  <text x="32" y="118" class="f-mono f-ink">ten eleven twelve</text>
  <text x="32" y="142" class="f-mono f-ink">twenty thirty forty fifty</text>
  <text x="342" y="70" class="f-mono f-ink">thirteen fourteen</text>
  <text x="342" y="94" class="f-mono f-ink">fifteen sixteen seventeen</text>
  <text x="342" y="118" class="f-mono f-ink">eighteen nineteen sixty</text>
  <text x="342" y="142" class="f-mono f-ink">seventy eighty ninety</text>
  <text x="20" y="192" class="f-label f-muted">these fire the check</text>
  <text x="330" y="192" class="f-label f-accent">8 of these are in essays I published</text>
</svg>
<figcaption>The rule is about counts written as words. The check is a list of words and the 11 on the right were never on it.</figcaption>
</figure>

`thirteen` through `nineteen` are missing from that list, so are `sixty`, `seventy`, `eighty` and `ninety`. Across the 22 essays that were on this site before this one, 22578 words of prose, `spelled-number` fires zero times. 8 counts written as words are sitting in text I published. 6 of the 8 are in one essay about a multiply that never runs, where I wrote `sixteen` in words 5 times and `fifteen` once.

## What I changed and what I did not check

The rewrite step now gets the machine report alongside the critic's remarks, on the strength of arm B. Both at once is a third case nobody measured. I took it because the round only starts when the critic scored above 3, so throwing its remarks away would leave the reason for the round unanswered. The README line survives in a narrower form. The checks answer what somebody already typed into a list. The critic answers the rest. It can be handed a hard check in its own prompt and still pass a draft that breaks it 8 times. Neither one is a gate for the other, which is the part I had wrong.

I did not check whether the critic's number has anything to do with a text being good to read. There are no human ratings anywhere in this. 3 runs per cell is thin. This is a single prompt on a single model.

The counting has a hole I have not closed either. The drafts here were judged as whole files while the critic judges the post inside them. On the 10 X drafts where the post sits in a fenced block, the post halves fire 25 times against 47 in the notes. Those notes go to nobody. The 2 halves do not add up to the count over the whole file, because one of the checks strips fenced blocks before it looks.
