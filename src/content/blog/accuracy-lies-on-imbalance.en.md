---
title: "9 models, accuracy between 92.5 and 93.3, and 1 of them finds nothing"
description: "On a task with 6.8 percent positives, every threshold I tried scored within 0.8 points of the same accuracy while recall fell from 19.6 percent to 0.6. Answering never at all scores 93.2. The confusion matrix separates these models instantly and the single number cannot tell them apart at all."
date: 2014-06-11
lang: en
translationKey: accuracy-lies-on-imbalance
tags: ["machine-learning", "statistics"]
---

Somebody presents a model at 93 percent accuracy and the room nods. I have been in that room and I nodded. This is what I should have asked for instead.

The task is real and small enough to check by hand. Take a repository, stand at the first of a month, then predict for every file whether anybody touches it in the next 7 days. The features come only from the past: how many times the file changed in the previous 180 days, how long since the last change, how big it is. Training uses the months before July 2013 while testing uses everything after, so the model never sees its own future. The classifier is logistic regression written by hand, 3 features, gradient descent, because the point is not the model.

6.8 percent of the test cases are positive. Answering never to everything therefore scores 93.2 percent accuracy, which is the number to beat.

<figure class="fig">
<svg viewBox="0 0 640 250" role="img" aria-label="Accuracy and recall of the same model at 9 thresholds. Accuracy stays between 92.5 and 93.3 percent across all of them, a flat line. Recall falls from 19.6 percent at threshold 0.1 to 10.4 at 0.2, then 4.9, 3.7, 1.8, 1.8, 1.8, 1.2 and 0.6 percent at threshold 0.9. The line for answering never at all sits at 93.2 percent accuracy, inside the same band as every model.">
  <text x="60" y="24" class="f-label f-muted">the same model at 9 thresholds, percent</text>
  <path d="M 70 200 L 610 200" class="f-line"/>
  <path d="M 70 40 L 70 200" class="f-line"/>
  <text x="42" y="204" class="f-label f-muted">0</text>
  <text x="34" y="124" class="f-label f-muted">50</text>
  <text x="28" y="44" class="f-label f-muted">100</text>
  <path d="M 70 51 L 610 51" class="f-line f-muted" stroke-dasharray="4 4"/>
  <text x="330" y="46" class="f-label f-muted">answering never: 93.2</text>
  <path d="M 90 52 L 155 51 L 220 51 L 285 51 L 350 51 L 415 51 L 480 51 L 545 51 L 600 51" class="f-line f-accent"/>
  <text x="90" y="68" class="f-label f-accent">accuracy: 92.5 to 93.3, all 9</text>
  <path d="M 90 169 L 155 183 L 220 192 L 285 194 L 350 197 L 415 197 L 480 197 L 545 198 L 600 199" class="f-line"/>
  <circle cx="90" cy="169" r="3" class="f-plain"/>
  <circle cx="600" cy="199" r="3" class="f-plain"/>
  <text x="110" y="163" class="f-mono f-ink">19.6</text>
  <text x="530" y="215" class="f-mono f-ink">0.6</text>
  <text x="230" y="176" class="f-label f-muted">recall, the share of real changes found</text>
  <text x="76" y="232" class="f-label f-muted">0.1</text>
  <text x="205" y="232" class="f-label f-muted">0.3</text>
  <text x="335" y="232" class="f-label f-muted">0.5</text>
  <text x="465" y="232" class="f-label f-muted">0.7</text>
  <text x="585" y="232" class="f-label f-muted">0.9</text>
  <text x="60" y="246" class="f-label f-muted">threshold</text>
</svg>
<figcaption>Accuracy spans 0.8 points across the whole sweep. Recall spans a factor of 32. A report that carries the first number carries no information about which of these 9 models was shipped.</figcaption>
</figure>

The best accuracy in the sweep is 93.3 percent. It belongs to the threshold at 0.7, which finds 3 of the 163 files that actually changed.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="The confusion matrix of the model with the highest accuracy, at threshold 0.7. It predicted a change 3 times and was right 3 times. It predicted no change for 2386 cases, of which 160 did change. That is 3 true positives, 0 false positives, 160 false negatives and 2226 true negatives, giving 93.3 percent accuracy, 100 percent precision and 1.8 percent recall.">
  <text x="10" y="24" class="f-label f-muted">the model with the best accuracy in the sweep, threshold 0.7</text>
  <text x="210" y="52" class="f-label f-muted">really changed</text>
  <text x="380" y="52" class="f-label f-muted">really did not</text>
  <text x="10" y="86" class="f-label f-ink">predicted a change</text>
  <rect x="200" y="66" width="140" height="30" rx="3" class="f-accent"/>
  <text x="270" y="86" class="f-mono f-ink" text-anchor="middle">3</text>
  <rect x="370" y="66" width="140" height="30" rx="3" class="f-plain"/>
  <text x="440" y="86" class="f-mono f-ink" text-anchor="middle">0</text>
  <text x="10" y="126" class="f-label f-ink">predicted nothing</text>
  <rect x="200" y="106" width="140" height="30" rx="3" class="f-accent"/>
  <text x="270" y="126" class="f-mono f-ink" text-anchor="middle">160</text>
  <rect x="370" y="106" width="140" height="30" rx="3" class="f-plain"/>
  <text x="440" y="126" class="f-mono f-ink" text-anchor="middle">2226</text>
  <path d="M 10 152 L 620 152" class="f-line"/>
  <text x="10" y="176" class="f-label f-muted">accuracy 93.3, precision 100, recall 1.8</text>
  <text x="330" y="176" class="f-label f-accent">it missed 160 of the 163 changes</text>
</svg>
<figcaption>Precision of 100 percent looks like a triumph until the other cell is read. The model is right whenever it speaks and it almost never speaks.</figcaption>
</figure>

Every threshold in the sweep sits inside the same band, from 92.5 to 93.3, while recall goes from 19.6 percent down to 0.6. The single number cannot separate a model that finds 1 change in 5 from a model that finds 1 in 163. It also cannot separate either of them from answering never at all.

The confusion matrix separates them in a glance. 3 against 160 is the thing itself rather than a summary of it.

## Where the metric works

I want to be fair to accuracy, so here is the same experiment with the horizon stretched from 7 days to 90. Now 34.6 percent of cases are positive, answering never scores 65.4, while the best model reaches 70.7 with recall at 31 percent. The number moves, ranks the thresholds and behaves like a metric.

That is the shape of the problem. Accuracy is a weighted average of 2 numbers whose weights are the class sizes. When 1 class is 93 percent of the data the average is that class. The other one is rounding.

## Where I tripped

I ran the 90 day version first, got the mild result above, then had to go back and shorten the horizon to make the imbalance sharp. That deserves saying plainly: I chose the task until the effect appeared. The honest form of my claim is narrower than "accuracy is useless": the same experiment shows the failure at 6.8 percent positives and hides it at 34.6. That is the sentence I could not have written from the first run.

## What I did not check

The area under the curve, which is the metric people reach for exactly here. By construction it ignores the threshold I swept. Whether the model is calibrated, meaning whether a score of 0.7 corresponds to anything happening 70 percent of the time. And the model is 3 features on 1 repository, so nothing here says anything about how well file changes can be predicted. It says something about what the reported number does or does not tell you.

The narrow claim is a question to ask in that meeting. Not what the accuracy is, but how many of the real cases the model found and how often it was wrong when it spoke.
