---
title: "Guessing the key class by sound gave 72.5% on a random split and 26.8% on keyboards the model never heard"
description: "I took 141 key presses from 31 Freesound uploaders before November 2019 and asked a logistic regression whether each was the space bar, Enter or an ordinary key. A random split gave 72.5%. Tested on uploaders it never heard, it gave 26.8%, below guessing, while the same features named the uploader 91.5% of the time."
date: 2019-11-15
lang: en
translationKey: keyboard-key-classes
tags: ["machine-learning", "open-data", "statistics"]
---
The CCS 2005 paper by Zhuang and colleagues starts with a number that is hard to forget. From a 10 minute recording of someone typing English text they recovered up to 96% of the characters, with no labelled training data. Asonov and Agrawal had trained a neural network on the sound of key presses in 2004. As Zhuang and colleagues retell it, that worked at about 80%, but only when the network was trained on the same keyboard typed by the same person. Impressive, but both groups had many presses from one keyboard.

My own picture of this was much simpler and I never checked it. A space bar is long and has a stabilizer, so it must sound different. Enter is big too. Letters are the same small plastic keys, so they blend together. If anything leaks from a keyboard to any microphone, I assumed it would be at least this: which class of key was pressed. I wanted to see how much of that survives when the keyboard, the microphone and the room all change.

## Recordings of other people

I have no recording of my own for this, so I used Freesound. I searched for sounds uploaded before 15 November 2019 with queries like "spacebar" and "enter key". There were 459 of them and I read the title and description of each. A file went into the space or Enter class only when the uploader named the key, for example "I smashed my Enter key". The third class is single presses where the uploader named a letter or no key at all, like "Hard Keystroke". In the end I had 55 files from 31 uploaders. I downloaded only the mp3 previews, because the originals need a logged in account.

I made a mistake already when cutting the files into presses. One file is described as "Guy hits space bar 5 times" and my energy threshold found 10 events in it. 3 of the extra events came about 300 ms after a press and they were releases. I had set 250 ms between events, because the Zhuang paper says push to release is about 100 ms. I added a rule that an event less than 1 second after the previous one and 12 dB quieter is a release. The file went from 10 events to 6, for 5 hits, so at least 1 release is probably still in there. After this and 1 more cleanup there were 141 presses, the biggest class being ordinary keys with 63.

For each press I turned the first 40 ms into 32 log mel bands up to 12 kHz, close to what the Zhuang paper does. Separately I took the loudness shape over the first 200 ms, in 10 ms steps. On top of that sits a logistic regression from `scikit-learn` 0.21.3 on Python 3.7, with balanced class weights because the classes are not equal.

## 2 ways to split the same 141 presses

The usual check is to shuffle the presses and split them into 5 parts, train on 4 and test on the 5th. Repeated 20 times, the balanced accuracy is 72.5%, against 33.3% for guessing among 3 classes. I would have stopped there, but most presses come in groups. 35 of the ordinary key presses come from 1 file of "isolated keystroke punches" on a Mac keyboard. With a random split they land in training and in the test at once.

So the second check leaves out 1 uploader at a time. The model is trained on 30 uploaders and tested on the 31st, whose recordings it has never heard. Leaving out only the file gives 31.2%.

<figure class="fig">
<svg viewBox="0 0 680 218" role="img" aria-label="Balanced accuracy of 1 classifier telling space, Enter and ordinary keys apart on 141 presses from 31 Freesound uploaders, checked 3 ways. Random split of presses: 72.5%. Leaving out 1 file at a time: 31.2%. Leaving out 1 uploader at a time: 26.8%, with an interval of 14.8 to 42.6% from resampling uploaders. Guessing among 3 classes gives 33.3%.">
  <line x1="210.0" y1="26" x2="210.0" y2="174" class="f-plain"/>
  <text x="210.0" y="190.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="320.0" y1="26" x2="320.0" y2="174" class="f-plain"/>
  <text x="320.0" y="190.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="430.0" y1="26" x2="430.0" y2="174" class="f-plain"/>
  <text x="430.0" y="190.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="540.0" y1="26" x2="540.0" y2="174" class="f-plain"/>
  <text x="540.0" y="190.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="650.0" y1="26" x2="650.0" y2="174" class="f-plain"/>
  <text x="650.0" y="190.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="430.0" y="208.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">balanced accuracy, %</text>
  <text x="198.0" y="44.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">random split of presses</text>
  <rect x="210" y="28" width="319.1" height="24" class="f-ink" style="stroke:none;fill:var(--ink);opacity:0.75"/>
  <text x="537.1" y="44.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">72.5</text>
  <text x="198.0" y="94.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">leave out 1 file</text>
  <rect x="210" y="78" width="137.5" height="24" class="f-accent" style="stroke:none;fill:var(--accent);opacity:0.85"/>
  <text x="355.5" y="94.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">31.2</text>
  <text x="198.0" y="144.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">leave out 1 uploader</text>
  <rect x="210" y="128" width="117.9" height="24" class="f-accent" style="stroke:none;fill:var(--accent);opacity:0.85"/>
  <line x1="275.0" y1="140" x2="397.3" y2="140" style="stroke:var(--ink);stroke-width:1.5"/>
  <line x1="275.0" y1="134" x2="275.0" y2="146" style="stroke:var(--ink);stroke-width:1.5"/>
  <line x1="397.3" y1="134" x2="397.3" y2="146" style="stroke:var(--ink);stroke-width:1.5"/>
  <text x="405.3" y="144.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">26.8</text>
  <line x1="356.7" y1="22" x2="356.7" y2="174" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="356.7" y="16.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">guessing 33.3</text>
</svg>
<figcaption>Logistic regression on 32 log mel bands of the first 40 ms plus the loudness shape of the first 200 ms. The whisker on the last bar is the 95% interval from resampling uploaders.</figcaption>
</figure>

Leaving out the uploader gives 26.8%, below guessing. The 95% interval from resampling uploaders goes from 14.8% to 42.6%, so I read it as no better than a coin with 3 sides. I also tried 5 classifiers on the spectrum alone, among them a random forest and 3 nearest neighbours. Leaving out an uploader gave between 13.3% and 24.0% every time.

Most of the mistakes go one way. 40 of 63 ordinary key presses are called Enter.

<figure class="fig">
<svg viewBox="0 0 680 300" role="img" aria-label="Confusion matrix when the model is tested on an uploader it never heard. Space presses: 24 called space, 8 Enter, 12 ordinary. Enter presses: 8 space, 5 Enter, 21 ordinary. Ordinary key presses: 16 space, 40 Enter, 7 ordinary.">
  <text x="417.0" y="20.0" text-anchor="middle" class="f-label f-muted" style="font-size:12px">model says</text>
  <text x="286.0" y="38.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">pressed</text>
  <text x="339.0" y="38.0" text-anchor="middle" class="f-label f-muted" style="font-size:12px">space</text>
  <text x="417.0" y="38.0" text-anchor="middle" class="f-label f-muted" style="font-size:12px">Enter</text>
  <text x="495.0" y="38.0" text-anchor="middle" class="f-label f-muted" style="font-size:12px">ordinary</text>
  <text x="286.0" y="93.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">space (44)</text>
  <rect x="302" y="52" width="74" height="74" style="fill:var(--accent);opacity:0.54;stroke:var(--ink);stroke-width:1.5"/>
  <text x="339.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">24</text>
  <rect x="380" y="52" width="74" height="74" style="fill:var(--accent);opacity:0.23;stroke:none;stroke-width:1.5"/>
  <text x="417.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">8</text>
  <rect x="458" y="52" width="74" height="74" style="fill:var(--accent);opacity:0.31;stroke:none;stroke-width:1.5"/>
  <text x="495.0" y="94.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">12</text>
  <text x="286.0" y="171.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">Enter (34)</text>
  <rect x="302" y="130" width="74" height="74" style="fill:var(--accent);opacity:0.28;stroke:none;stroke-width:1.5"/>
  <text x="339.0" y="172.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">8</text>
  <rect x="380" y="130" width="74" height="74" style="fill:var(--accent);opacity:0.21;stroke:var(--ink);stroke-width:1.5"/>
  <text x="417.0" y="172.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">5</text>
  <rect x="458" y="130" width="74" height="74" style="fill:var(--accent);opacity:0.60;stroke:none;stroke-width:1.5"/>
  <text x="495.0" y="172.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">21</text>
  <text x="286.0" y="249.0" text-anchor="end" class="f-label f-muted" style="font-size:12px">ordinary (63)</text>
  <rect x="302" y="208" width="74" height="74" style="fill:var(--accent);opacity:0.30;stroke:none;stroke-width:1.5"/>
  <text x="339.0" y="250.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">16</text>
  <rect x="380" y="208" width="74" height="74" style="fill:var(--accent);opacity:0.62;stroke:none;stroke-width:1.5"/>
  <text x="417.0" y="250.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">40</text>
  <rect x="458" y="208" width="74" height="74" style="fill:var(--accent);opacity:0.17;stroke:var(--ink);stroke-width:1.5"/>
  <text x="495.0" y="250.0" text-anchor="middle" class="f-mono f-ink" style="font-size:15px">7</text>
</svg>
<figcaption>Rows are the key the uploader named, columns are the answer of the model trained on the other 30 uploaders. The darker the cell, the larger its share of the row. The diagonal holds the correct answers.</figcaption>
</figure>

I think the model mostly learned the recording. On the 10 uploaders with at least 5 presses I asked it a different question, who recorded this press. It answered correctly 91.5% of the time, where always naming the uploader with the most presses gives 30.7%. Presses from the same file are again in training and in the test, so part of the 91.5% is the file. Among these 10 there is a Zoom H1 and also a Rode NT5 with noise reduction afterwards.

## The number I liked for a moment

The loudness shape alone gave 46.7% when leaving out an uploader. That looked like the one thing that carries over between keyboards. It also fit my picture, since a space bar should ring longer. Then I looked at which presses it got right. 15 of the 20 correct Enter presses are from 1 file. Its description says the noise was removed in iZotope RX7.

200 ms after a press that file is 52 dB below the peak. For the other uploaders with 4 or more presses it is 16 to 36 dB, apart from 1 whose clips end before 200 ms. If I don't count the presses of the noise reduced file, the same predictions give 37.5%, which is close to guessing.

## What is left

As a yes or no question, space or not, the model trained on the other uploaders gets 60.1% balanced accuracy with an AUC of 0.653. Resampling uploaders, the AUC goes from 0.45 to 0.81, so 0.5 is inside the interval. 6 uploaders recorded the space bar and another key. For 4 of them the model mostly scores their space presses higher than their other presses. One of the 6 says that the space presses come from 2 different keyboards. Each uploader has 1 to 7 presses per class. So it is a hint at most.

The last check was typing. One uploader in the training set also has a 92 second recording of typing on a Razer BlackWidow. My cutter kept 99 events from it, the louder ones. The model called 57.6% of them a space. In English text a space is about 1 character in 6. In a second typing file, from another uploader, it called 46.7% of 30 events a space.

## What I did not check

- My own keyboard. Every press here went through someone else's microphone and editor, with their title as the label.
- The cutting by ear. Some files probably still have a release counted as a press, the space bar file above has 6 events for 5 hits.
- Original files. The previews are lossy mp3. 2 of them are sampled at 22.05 kHz and 16 kHz, so they stop at 11 kHz and 8 kHz, below the 12 kHz I used.
- The setting from the papers. My numbers say nothing about it.
- More data. 141 presses from 31 uploaders is all I could label from Freesound titles. 3 of the uploaders look like students of one school, maybe in one room.

I started with the idea that the class of a key is written in its sound the same way on every keyboard. On 31 keyboards from Freesound I could not find it, except for a weak trace of the space bar. On my own keyboard with my own microphone it may look different. I did not try.
