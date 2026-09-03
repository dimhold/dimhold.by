---
title: "A model reading my essays gives back 2 of my 16 rules"
description: "I keep being told the voice guide is unnecessary: show the model what you have already published and let it work the voice out. I gave claude-opus-5 8 of my 11 English essays and asked for the guide. Over 5 runs it wrote 92 entries and 2 of them are mine. All 16 checks score 0 across 12587 words of published prose, and for 6 of them even the baselines score 0, so there was nothing there to find."
date: 2026-09-02
lang: en
translationKey: voice-beats-inference
tags: ["llm", "machine-learning"]
---
On 20 August I had a post typed into the LinkedIn composer and I changed 1 word before it went out. It said `Six node processes` and I made it `7 node processes`. The day before, the same phrase had gone out on X with `Six` spelled. That edit is a line in a file now, with a regular expression under it. The machine that drafts for me runs it over every English text before I read one. There are 19 of those checks and 16 apply to English. 5 arrived one at a time after that day, each out of a correction like it. The other 11 went in on the first day. Part of them are a generic list of machine tells and part are preferences I stated that evening.

The objection I keep meeting is that none of this is needed. Show the model what you have already published, let it work the voice out and stop writing rules down. There were 11 essays in English on this site when I started, so the material was sitting right there. I half believed it. The guide reads like a description of how I write and I had never checked whether it is one.

## The setup

The runs happen in an empty directory outside this repository, because I skipped that once. A corpus I generated from inside it picked up the `CLAUDE.md` sitting here, which states the rules in words. What I reported as a property of the model was obedience. `context-check.mjs` from `tells-baseline` walks from the working directory up to the root and lists every file the CLI loads. This time it found one, `~/.claude/settings.json`, holding a single key named `theme`.

The corpus is those 11 essays without frontmatter, figures or code blocks, which is 12587 words of prose at commit `d4650ea`. The 8 oldest go to the model and the 3 newest are held back. What I asked for: here are 8 essays by one author, write the style guide a machine should follow to draft in his voice. Every entry that can carry a regular expression has to carry one. 5 runs, one prompt, `claude-opus-5` through the claude CLI 2.1.235 on node 22.23.1.

## What came back

Each run returned 18 or 19 entries, 92 across the 5. I clustered them by hand and wrote the clustering down, so somebody can disagree with it.

| | clusters | entries |
|---|---:|---:|
| one of my 16 voice checks | 2 | 10 |
| another instruction the drafting machine is given | 6 | 23 |
| a match I would defend and would not insist on | 5 | 17 |
| nothing written down anywhere | 16 | 42 |

The 2 it found are the ban on the dash and the rule that counts are written as digits. Both turned up in all 5 runs.

What it recovered beyond them comes from the procedure I follow when writing these posts rather than from the voice guide. There are 6 of those and every one asks for something to be put on the page. A section under a given heading, a version string, a sentence naming the belief I never measured. Another naming the place where I tripped, an opening on a concrete moment and a note when a figure rests on a single run.

## The 14 that were never there to find

All 16 checks score 0 across the whole 12587 words, which is what a gate is for and no surprise by itself. The useful question is how big a hole those zeros make.

`tells-baseline` has 2 public corpora for exactly this. Corpus A is 40 engineering texts published before 2020, 72573 words. I rebuilt it from the sources with its own script. All 40 hashes came back unchanged. Corpus B is 30 texts written by `claude-opus-5` in an empty directory, 35907 words. That is the interesting one here, since the guide exists to stop that model rather than to stop a person.

For each check I take whichever of the 2 corpora produces it more often, so that nothing looks harder to spot than it is. At those rates my 8001 shown words should have carried 129.5 commas before `and` and 75.6 words welded with a hyphen. They should also have carried 63.3 counts spelled out and 39.7 dashes. Those 4 leave a hole big enough to see. The other 12 give 1.3 hits and less and 6 of them scored nothing at all in the 108480 words of both corpora together.

<figure class="fig">
<svg viewBox="0 0 640 228" role="img" aria-label="A logarithmic axis running from 100 to 1000000 words, showing how much of my own writing a reader would need before the absence of each rule carries information. A dashed marker at 12587 words is everything I have published in English. 4 of the 16 checks fall to the left of it: the comma before and at 185 words, the word welded with a hyphen at 317, counts written as digits at 379 and the dash at 605. The 2 the model recovered, digits and the dash, are drawn filled. 4 more fall far to the right: not just x but y at 18143, the llm word list at 53861, the hashtag at 108860 and 3 further checks at 217719. The remaining 6 sit in a separate box because they scored no hit at all in the 108480 words of the 2 baselines, so no rate can be put on them at any corpus size.">
  <text x="20" y="18" class="f-label f-muted">words of mine needed before a missing rule means anything</text>
  <path d="M 40 170 L 470 170" class="f-plain"/>
  <path d="M 40.0 170 L 40.0 175" class="f-plain"/>
  <text x="40.0" y="188" class="f-label f-muted" text-anchor="middle">100</text>
  <path d="M 147.5 170 L 147.5 175" class="f-plain"/>
  <text x="147.5" y="188" class="f-label f-muted" text-anchor="middle">1000</text>
  <path d="M 255.0 170 L 255.0 175" class="f-plain"/>
  <text x="255.0" y="188" class="f-label f-muted" text-anchor="middle">10000</text>
  <path d="M 362.5 170 L 362.5 175" class="f-plain"/>
  <text x="362.5" y="188" class="f-label f-muted" text-anchor="middle">100000</text>
  <path d="M 470.0 170 L 470.0 175" class="f-plain"/>
  <text x="470.0" y="188" class="f-label f-muted" text-anchor="middle">1000000</text>
  <path d="M 265.7 48 L 265.7 170" class="f-line" stroke-dasharray="3 3"/>
  <text x="265.7" y="42" class="f-label f-accent" text-anchor="middle">everything I have published, 12587 words</text>
  <circle cx="68.7" cy="170" r="3.5" class="f-plain"/>
  <path d="M 68.7 164 L 68.7 105" class="f-plain"/>
  <text x="73.7" y="102" class="f-label f-muted">comma before and, 185</text>
  <circle cx="93.9" cy="170" r="3.5" class="f-plain"/>
  <path d="M 93.9 164 L 93.9 121" class="f-plain"/>
  <text x="98.9" y="118" class="f-label f-muted">hyphen weld, 317</text>
  <circle cx="102.2" cy="170" r="3.5" class="f-accent"/>
  <path d="M 102.2 164 L 102.2 137" class="f-plain"/>
  <text x="107.2" y="134" class="f-label f-accent">digits, 379</text>
  <circle cx="124.0" cy="170" r="3.5" class="f-accent"/>
  <path d="M 124.0 164 L 124.0 153" class="f-plain"/>
  <text x="129.0" y="150" class="f-label f-accent">dash, 605</text>
  <circle cx="282.8" cy="170" r="3.5" class="f-plain"/>
  <path d="M 282.8 164 L 282.8 153" class="f-plain"/>
  <text x="287.8" y="150" class="f-label f-muted">not just x but y, 18143</text>
  <circle cx="333.6" cy="170" r="3.5" class="f-plain"/>
  <path d="M 333.6 164 L 333.6 137" class="f-plain"/>
  <text x="338.6" y="134" class="f-label f-muted">llm words, 53861</text>
  <circle cx="366.5" cy="170" r="3.5" class="f-plain"/>
  <path d="M 366.5 164 L 366.5 121" class="f-plain"/>
  <text x="371.5" y="118" class="f-label f-muted">hashtag, 108860</text>
  <circle cx="398.8" cy="170" r="3.5" class="f-plain"/>
  <circle cx="398.8" cy="161" r="3.5" class="f-plain"/>
  <circle cx="398.8" cy="152" r="3.5" class="f-plain"/>
  <path d="M 398.8 164 L 398.8 105" class="f-plain"/>
  <text x="403.8" y="102" class="f-label f-muted">3 more, 217719</text>
  <rect x="500" y="136" width="120" height="48" rx="2" class="f-plain"/>
  <circle cx="516" cy="148" r="3.5" class="f-plain"/>
  <circle cx="532" cy="148" r="3.5" class="f-plain"/>
  <circle cx="548" cy="148" r="3.5" class="f-plain"/>
  <circle cx="516" cy="162" r="3.5" class="f-plain"/>
  <circle cx="532" cy="162" r="3.5" class="f-plain"/>
  <circle cx="548" cy="162" r="3.5" class="f-plain"/>
  <text x="560" y="188" class="f-label f-muted" text-anchor="middle">no rate at all</text>
  <text x="320" y="212" class="f-label f-muted" text-anchor="middle">each dot is 1 of my 16 checks. the 2 the model found are filled</text>
</svg>
  <figcaption>The bar is 3 expected hits, which leaves a 5% chance of seeing none by luck. Each rate comes from whichever of the 2 baselines produces the check more often, so nothing here looks harder to spot than it is. 4 checks of the 16 leave a hole big enough to see inside what I have published and the model found 2 of those 4.</figcaption>
</figure>

Turn that into how much I would have to publish before a reader could tell. The bar is 3 expected hits, which leaves a 5% chance of seeing none by luck. The dash needs 605 words of mine and the comma before `and` needs 185. `not-just-x-but-y` needs 18143 and `it-s-not-x-it-s-y` needs 217719, both at a person's rate, since the model never wrote either construction at all. I have 12587.

Now the part I should have seen coming. All 4 of the visible checks are ones I have stated in my own words. Of the 12 invisible ones, 9 belong to that generic first day list. The rocket emoji is on it, so is the engagement bait ending and `delve` with its neighbours. Neither corpus produces those, so obeying them costs nothing and my essays were never going to show them.

## Why the dash and not the comma

The comma before `and` is the loudest hole of the 4 and it did not come back once. Look at what the model invented instead and a line shows up. It forbade the exclamation mark, the semicolon, the thousands separator, the bulleted list and the contraction. Every one of those is a character or a string that does not occur in my essays anywhere. The comma before `and` has a different shape. My 8 essays hold 245 commas and 170 uses of `and` and never those 2 next to each other. The hyphen is the same case. There are 102 of them, the check counts 9 welded pairs and all 9 sit inside backticks where they are code. It walks past `on-stack` in the prose of the essay about the JIT, because it wants 3 letters to the left of the hyphen. 4 checks is a thin base for a rule about rules, so I am calling this a reading rather than a result.

## What it wrote instead

42 of the 92 entries correspond to nothing anybody ever told this machine and most of them are true. `against, not versus` came back in all 5 runs and it is real. I had never noticed it. The heading rules came back 6 times, the ban on exclamation marks 4, the backticks round machine tokens 4. 30 of the 42 sit in clusters that 3 or more separate runs agreed on and I would sign most of them.

The rest is the sample talking. Run 4 tells the drafter to spell distance as metre and kilometre, which it took from one essay about walking a dog. 2 runs want the file to open with a level 3 heading and a date in brackets under it. That describes the script that glued the corpus together.

Of the 48 forbidding entries carrying an expression, 10 fire on my own sentences. Reading them by hand, 7 are genuine and 3 are the expression failing to say what the rule says. The genuine ones come down to 4 sentences. 2 address the reader as `you`, 1 has `really` in it and 1 has a semicolon. That semicolon also makes 3 of the 5 dash entries wider than my rule. Runs 3, 4 and 5 bundle it in with the dash.

<figure class="fig">
<svg viewBox="0 0 640 190" role="img" aria-label="Two blocks of squares. On the left, 16 squares stand for the 16 mechanical checks in my voice guide, of which 2 are filled: the ban on the dash and the rule that counts are written as digits. Both came back in all 5 runs. On the right, 92 squares stand for every entry the 5 runs produced, shaded by what they correspond to: 10 are one of my 16 checks, 23 are another instruction the drafting machine really gets, all of them from the writing procedure rather than the voice guide, 17 are a match I would defend and would not insist on, and 42 correspond to nothing written down anywhere.">
  <text x="20" y="18" class="f-label f-muted">my guide, 16 checks</text>
  <rect x="20" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="32" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="44" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="56" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="68" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="80" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="92" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="104" y="34" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="20" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="32" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="44" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="56" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="68" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="80" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="92" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="104" y="46" width="10" height="10" rx="1" class="f-plain"/>
  <text x="20" y="74" class="f-label f-accent">2 came back</text>
  <text x="250" y="18" class="f-label f-muted">what 5 runs wrote, 92 entries</text>
  <rect x="250" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="262" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="274" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="286" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="298" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="310" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="322" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="334" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="346" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="358" y="34" width="10" height="10" rx="1" class="f-accent"/>
  <rect x="370" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="382" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="394" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="406" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="418" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="430" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="442" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="454" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="466" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="478" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="490" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="502" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="514" y="34" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="250" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="262" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="274" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="286" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="298" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="310" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="322" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="334" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="346" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="358" y="46" width="10" height="10" rx="1" class="f-ink"/>
  <rect x="370" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="382" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="394" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="406" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="418" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="430" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="442" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="454" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="466" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="478" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="490" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="502" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="514" y="46" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="250" y="58" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="262" y="58" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="274" y="58" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="286" y="58" width="10" height="10" rx="1" class="f-muted"/>
  <rect x="298" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="310" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="322" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="334" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="346" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="358" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="370" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="382" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="394" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="406" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="418" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="430" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="442" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="454" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="466" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="478" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="490" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="502" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="514" y="58" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="250" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="262" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="274" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="286" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="298" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="310" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="322" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="334" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="346" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="358" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="370" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="382" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="394" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="406" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="418" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="430" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="442" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="454" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="466" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="478" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="490" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="502" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="514" y="70" width="10" height="10" rx="1" class="f-plain"/>
  <rect x="250" y="98" width="10" height="10" rx="1" class="f-accent"/>
  <text x="266" y="106" class="f-label f-muted">one of my 16, 10</text>
  <rect x="250" y="116" width="10" height="10" rx="1" class="f-ink"/>
  <text x="266" y="124" class="f-label f-muted">another written instruction, 23</text>
  <rect x="250" y="134" width="10" height="10" rx="1" class="f-muted"/>
  <text x="266" y="142" class="f-label f-muted">a match I would defend, 17</text>
  <rect x="250" y="152" width="10" height="10" rx="1" class="f-plain"/>
  <text x="266" y="160" class="f-label f-muted">nothing written anywhere, 42</text>
</svg>
  <figcaption>The overlap is the 10 squares on the right that match the 2 on the left. The 23 it recovered beyond them all ask for something to be put into the essay, a section or a version string. Of the 14 checks it never named, 9 came from a generic list of machine tells that neither baseline produces either.</figcaption>
</figure>

Then the near miss. The top entry in 4 runs out of 5 forbids contractions and my first count said the held back essays break it 5 times. All 5 are somebody else's words. 4 are Rich Hickey being quoted and the 5th is `What's in your Toolkit`, a slide of his that I name without quotation marks. Outside quotation marks the count is that 1 slide title. I had the paragraph about it written before I looked.

## The rule it got more right than I did

The digits rule is the one place the model beat the file. I said it on 20 August in 4 words. The check written from it put `hundred`, `thousand`, `million` and `billion` into the same list as the small counts. On my own published corpus that form fires 25 times, on `million rows` and `million keys` and `billion commits`. The corrected form fires 0. The old form stood for 12 days and came out on 1 September, when the acceptance script was calibrated against articles that had already been published. Run 4 wrote that exception into its own version of the rule without being asked. Runs 2 and 3 recovered the exception for `one`.

Inference is accurate about the 8 essays it read, apart from those 7 entries. On one rule it was more accurate than the sentence I said. What it cannot reach is a decision, since a decision is about the text I have not written yet. The `hyphen-compound` check went in on 28 August after a detector scored a comment of mine at 100% machine written. 3 words welded with a hyphen were the whole difference. Each of the 5 checks added after 14 August arrived out of one text going wrong. On 19 August my published writing still said `Six node processes`.

## What I did not check

One model, one prompt, 5 runs, 8 essays. Asking for expressions may have pushed the answers towards things an expression can hold. I did not try showing it 3 essays or 30, so I have no curve. I did not try telling it what kind of rules to look for. That would lift the count and it would also be me writing the guide again. Nothing here separates a rule the model read off my text from one it already knew as folklore. That would need a run with the folklore names withheld. The 3 held back essays are a weak test, since 4586 words will not refute a rule that fires once in 20000. A model asked for a blog post in another register would give different rates than corpus B.
