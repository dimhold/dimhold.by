---
title: "The fraud screen fires on numbers nobody faked"
description: "Benford's law is sold as a screen you point at a column of numbers. I pointed it at 4 columns from one repository, where nobody had any reason to fake anything. 3 of them failed. Worse, the 2 standard tests disagree with each other on the same data: the one column MAD lets through is the one chi square rejects."
date: 2013-06-12
lang: en
translationKey: benford-first-digits
tags: ["statistics", "numbers"]
---

The pitch for Benford's law is that you point it at a column of numbers and the faked ones stand out. Real quantities start with 1 about 30 percent of the time and with 9 about 4.6 percent of the time, invented ones spread out flat, so the histogram does the accusing for you. I have seen that histogram in slides for 2 years and I never once ran it on numbers I knew were clean.

So I ran it on 4 columns where nobody has a motive. All of them come from the git history of express, cut off at 2013-06-12, which is 4108 commits and a tree of 197 files at `aec34284`. Nobody inflates how many lines a commit adds. The columns are the lines added by each commit, the size of every file in bytes, the length of every file in lines and the seconds between one commit and the next.

3 of the 4 fail.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Grouped bars of first digit share for 2 of the columns against Benford. For digit 1 Benford predicts 30.1 percent, lines added by a commit give 41.5 percent, seconds between commits give 28.5 percent. For digit 2 the three are 17.6, 17.8 and 17.4. For digit 3 they are 12.5, 10.9 and 11.4. For digit 4 they are 9.7, 8.7 and 9.8. For digit 5 they are 7.9, 5.5 and 9.0. For digit 6 they are 6.7, 5.4 and 7.4. For digit 7 they are 5.8, 3.5 and 6.0. For digit 8 they are 5.1, 3.3 and 5.7. For digit 9 they are 4.6, 3.4 and 4.8. The commit column leans hard on digit 1 and runs short everywhere above 4, the interval column tracks the prediction closely.">
  <rect x="60" y="12" width="10" height="10" class="f-plain"/>
  <text x="76" y="21" class="f-label f-muted">Benford</text>
  <rect x="150" y="12" width="10" height="10" class="f-box"/>
  <text x="166" y="21" class="f-label f-muted">lines added by a commit</text>
  <rect x="330" y="12" width="10" height="10" class="f-accent"/>
  <text x="346" y="21" class="f-label f-muted">seconds between commits</text>
  <text x="30" y="213" class="f-label f-muted">0</text>
  <text x="24" y="133" class="f-label f-muted">20</text>
  <text x="24" y="53" class="f-label f-muted">40</text>
  <path d="M 55 210 L 620 210" class="f-line"/>
  <rect x="64" y="90" width="16" height="120" class="f-plain"/>
  <rect x="82" y="44" width="16" height="166" class="f-box"/>
  <rect x="100" y="96" width="16" height="114" class="f-accent"/>
  <text x="90" y="226" class="f-mono f-ink" text-anchor="middle">1</text>
  <rect x="126" y="140" width="16" height="70" class="f-plain"/>
  <rect x="144" y="139" width="16" height="71" class="f-box"/>
  <rect x="162" y="140" width="16" height="70" class="f-accent"/>
  <text x="152" y="226" class="f-mono f-ink" text-anchor="middle">2</text>
  <rect x="188" y="160" width="16" height="50" class="f-plain"/>
  <rect x="206" y="166" width="16" height="44" class="f-box"/>
  <rect x="224" y="164" width="16" height="46" class="f-accent"/>
  <text x="214" y="226" class="f-mono f-ink" text-anchor="middle">3</text>
  <rect x="250" y="171" width="16" height="39" class="f-plain"/>
  <rect x="268" y="175" width="16" height="35" class="f-box"/>
  <rect x="286" y="171" width="16" height="39" class="f-accent"/>
  <text x="276" y="226" class="f-mono f-ink" text-anchor="middle">4</text>
  <rect x="312" y="178" width="16" height="32" class="f-plain"/>
  <rect x="330" y="188" width="16" height="22" class="f-box"/>
  <rect x="348" y="174" width="16" height="36" class="f-accent"/>
  <text x="338" y="226" class="f-mono f-ink" text-anchor="middle">5</text>
  <rect x="374" y="183" width="16" height="27" class="f-plain"/>
  <rect x="392" y="188" width="16" height="22" class="f-box"/>
  <rect x="410" y="180" width="16" height="30" class="f-accent"/>
  <text x="400" y="226" class="f-mono f-ink" text-anchor="middle">6</text>
  <rect x="436" y="187" width="16" height="23" class="f-plain"/>
  <rect x="454" y="196" width="16" height="14" class="f-box"/>
  <rect x="472" y="186" width="16" height="24" class="f-accent"/>
  <text x="462" y="226" class="f-mono f-ink" text-anchor="middle">7</text>
  <rect x="498" y="190" width="16" height="20" class="f-plain"/>
  <rect x="516" y="197" width="16" height="13" class="f-box"/>
  <rect x="534" y="187" width="16" height="23" class="f-accent"/>
  <text x="524" y="226" class="f-mono f-ink" text-anchor="middle">8</text>
  <rect x="560" y="192" width="16" height="18" class="f-plain"/>
  <rect x="578" y="196" width="16" height="14" class="f-box"/>
  <rect x="596" y="191" width="16" height="19" class="f-accent"/>
  <text x="586" y="226" class="f-mono f-ink" text-anchor="middle">9</text>
  <text x="60" y="248" class="f-label f-muted">share of the first digit, percent</text>
</svg>
<figcaption>2 of the 4 columns against the prediction. The commit column leans on 1 because a great many commits change a handful of lines. The interval column has no such floor and it tracks Benford almost everywhere.</figcaption>
</figure>

The numbers behind the picture. Mean absolute deviation is the average gap between the 9 observed shares and the 9 predicted ones. Nigrini's thresholds put close conformity under 0.006, acceptable under 0.012 and nonconformity above 0.015. Lines added by a commit give 0.0259. File sizes give 0.0242. File lengths give 0.0287. Seconds between commits give 0.0065, which is the only column that passes.

I expected the span of the data to explain that. The intervals run from 1 second to 6209407 seconds, which is 6.79 orders of magnitude. A column that covers that much room has to spread its first digits the way Benford says. The other 3 columns cover 3.06, 3.36 and 4.61 orders. That is the standard explanation and it is half right: the file sizes cover 4.61 orders, half again as much room as the file lengths. They still come out at 0.0242 while the file lengths come out at 0.0287.

## The 2 screens disagree

Then I ran the other standard test, chi square, on the same 4 columns. With 8 degrees of freedom the table says 15.51 at 5 percent and 20.09 at 1 percent.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="A table of verdicts. Lines added by a commit, 3587 values, MAD fails, chi square rejects. Size of every file in bytes, 197 values, MAD fails, chi square does not reject. Length of every file in lines, 158 values, MAD fails, chi square rejects. Seconds between commits, 4043 values, MAD passes, chi square rejects. The second and fourth rows are boxed because the 2 screens return opposite verdicts on them. Both of those rows are the extremes of sample size.">
  <text x="10" y="28" class="f-label f-muted">column</text>
  <text x="250" y="28" class="f-label f-muted">n</text>
  <text x="330" y="28" class="f-label f-muted">MAD verdict</text>
  <text x="470" y="28" class="f-label f-muted">chi square verdict</text>
  <path d="M 10 38 L 620 38" class="f-line"/>
  <text x="10" y="62" class="f-label f-ink">lines added by a commit</text>
  <text x="250" y="62" class="f-mono f-ink">3587</text>
  <text x="330" y="62" class="f-label f-ink">fails</text>
  <text x="470" y="62" class="f-label f-ink">rejects</text>
  <rect x="320" y="84" width="300" height="22" rx="3" class="f-box"/>
  <text x="10" y="98" class="f-label f-ink">size of every file in bytes</text>
  <text x="250" y="98" class="f-mono f-ink">197</text>
  <text x="330" y="98" class="f-label f-accent">fails</text>
  <text x="470" y="98" class="f-label f-accent">does not reject</text>
  <text x="10" y="134" class="f-label f-ink">length of every file in lines</text>
  <text x="250" y="134" class="f-mono f-ink">158</text>
  <text x="330" y="134" class="f-label f-ink">fails</text>
  <text x="470" y="134" class="f-label f-ink">rejects</text>
  <rect x="320" y="156" width="300" height="22" rx="3" class="f-box"/>
  <text x="10" y="170" class="f-label f-accent">seconds between commits</text>
  <text x="250" y="170" class="f-mono f-ink">4043</text>
  <text x="330" y="170" class="f-label f-accent">passes</text>
  <text x="470" y="170" class="f-label f-accent">rejects</text>
  <text x="10" y="200" class="f-label f-muted">boxed: the 2 screens return opposite verdicts on the same column</text>
</svg>
<figcaption>The same 4 columns, 2 accepted tests, opposite answers on 2 of them. The column with the fewest values is the one chi square lets through and the column with the most values is the one it rejects hardest.</figcaption>
</figure>

The file sizes score 13.3 and chi square does not reject them, while MAD calls them nonconformant. The intervals score 20.1 against a threshold of 20.09, which is as close to the line as a verdict gets. Chi square rejects them at 1 percent while MAD says they are fine. So on the same repository, in the same hour, 2 published screens hand back opposite verdicts. Which one you get depends on which test the auditor happens to run.

The mechanism is not subtle once you write the formula down. Chi square multiplies every squared deviation by the sample size, so a fixed shape of error crosses the threshold as soon as you have enough rows. The file sizes have 197 values and the intervals have 4043. That ratio of 20 is doing more work in the verdict than any property of the numbers. MAD has the opposite blindness: it divides the deviation by 9 and never asks how many rows produced it, so it treats 158 file lengths and 4043 intervals as equally trustworthy.

## Where I tripped

The commit column has 4108 rows in git and 3587 in my histogram. 521 commits add no lines at all: merges, deletions, a permission change. A leading digit does not exist for 0, so those rows drop out silently. It took me a while to notice that my sample was quietly 13 percent smaller than the history I said I was measuring. Dropping them is not neutral either. They are exactly the commits at the small end. The small end is where the excess of 1 comes from.

The excess is real and it has an ordinary cause. A repository at this age is mostly small changes. Once a great many commits touch between 1 and 9 lines, the digit 1 collects them all. Nothing is being hidden. The screen sees the honest shape of software work and calls it suspicious.

## What I did not check

Whether a planted fraud would even move these columns. If honest data sits at 0.026 and the threshold is 0.015, the interesting question is how much faking you would have to add before the number changes in a way an auditor could tell from this baseline. I have not measured that. I also ran only the first digit test. The second digit test and the last 2 digits test are the ones the accounting literature leans on. They may behave better or worse here. And this is 1 repository of 197 files, chosen because I had it on disk.

The claim I would keep is narrow. Benford's law is a statement about numbers that span many orders of magnitude. A screen built on it inherits that condition, but the condition is not stated on the slide with the histogram. Point it at a column that lives inside 3 orders and it will fire, every time, at nobody.
