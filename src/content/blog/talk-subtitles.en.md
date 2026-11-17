---
title: "My 2013 subtitles for a Rich Hickey talk stopped at minute 5. Whisper base would need 9 hours of my CPU for the whole talk"
description: "In 2013 I cut a 153 minute Rich Hickey talk into 5 second pieces for Google speech recognition and fixed the subtitles by hand. They stopped at minute 5, with 37.3% of the words different from a later edited transcript. On 10 TED talks the local way before Whisper, Vosk plus punctuation, makes 8.02% wrong words at 17.9 seconds per minute of audio. Whisper tiny.en and base.en make 3.91% and 3.27% on 3 talks, but on 4 CPU cores base.en needs 211 seconds per minute."
date: 2022-10-09
lang: en
translationKey: talk-subtitles
tags: ["machine-learning", "text", "performance"]
---
On 10 May 2013 I created a repository to translate a Rich Hickey talk, Clojure Concurrency, into Russian. The first step in the README is English subtitles in WebVTT and that row still says 5%. On 21 September OpenAI released Whisper. 5 days later its command line learned to write SRT files. So I went back to that repository to see what the 2013 work cost and what the same job costs now.

## What I did in 2013

The repository keeps the whole process. There is a page with the video and a "Freeze time" button that writes `video.currentTime` into a log. With it I could catch where a phrase starts and ends. On 19 May I committed 1219 JSON files with answers from Google speech recognition, one per 5 second FLAC piece of the talk. The very first answer is "hi welcome a thank you for waiting um my name is Ricky and I'm here to talk about".

153 minutes make 1838 such pieces and for 619 of them there is no file. I noticed the pattern only now. 592 of the missing ones are the third piece of a 15 second block, from second 10 to second 15. It looks like a bug in my own cutting script, but I do not have that script anymore, so I cannot check. Of the files that exist, 19 say NO_MATCH and 1 is an HTML page with "Internal Server Error".

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="A strip of 50 cells for the first 4 minutes 10 seconds of the talk, one per 5 second piece. With an answer: 31. With an error: 1. Without a file: 18. Almost every third cell is empty. In the whole talk 619 of 1838 pieces have no file. 592 of them are the third piece of a 15 second block.">
  <text x="12" y="18" class="f-label f-muted">The first 4 minutes 10 seconds, one cell per 5 second piece sent to Google</text>
  <rect x="12" y="28" width="10" height="10" class="f-accent"/>
  <text x="28" y="37" class="f-label f-ink">answer</text>
  <rect x="150" y="28" width="10" height="10" class="f-ink"/>
  <text x="166" y="37" class="f-label f-ink">error or NO_MATCH</text>
  <rect x="340" y="28" width="10" height="10" class="f-box"/>
  <text x="356" y="37" class="f-label f-ink">no file</text>
  <rect x="40" y="56" width="9" height="28" class="f-accent"/>
  <rect x="51" y="56" width="9" height="28" class="f-box"/>
  <rect x="62" y="56" width="9" height="28" class="f-box"/>
  <rect x="73" y="56" width="9" height="28" class="f-accent"/>
  <rect x="84" y="56" width="9" height="28" class="f-accent"/>
  <rect x="95" y="56" width="9" height="28" class="f-box"/>
  <rect x="106" y="56" width="9" height="28" class="f-accent"/>
  <rect x="117" y="56" width="9" height="28" class="f-ink"/>
  <rect x="128" y="56" width="9" height="28" class="f-box"/>
  <rect x="139" y="56" width="9" height="28" class="f-accent"/>
  <rect x="150" y="56" width="9" height="28" class="f-accent"/>
  <rect x="161" y="56" width="9" height="28" class="f-box"/>
  <rect x="172" y="56" width="9" height="28" class="f-accent"/>
  <rect x="183" y="56" width="9" height="28" class="f-accent"/>
  <rect x="194" y="56" width="9" height="28" class="f-box"/>
  <rect x="205" y="56" width="9" height="28" class="f-accent"/>
  <rect x="216" y="56" width="9" height="28" class="f-accent"/>
  <rect x="227" y="56" width="9" height="28" class="f-box"/>
  <rect x="238" y="56" width="9" height="28" class="f-accent"/>
  <rect x="249" y="56" width="9" height="28" class="f-accent"/>
  <rect x="260" y="56" width="9" height="28" class="f-box"/>
  <rect x="271" y="56" width="9" height="28" class="f-accent"/>
  <rect x="282" y="56" width="9" height="28" class="f-accent"/>
  <rect x="293" y="56" width="9" height="28" class="f-box"/>
  <rect x="304" y="56" width="9" height="28" class="f-accent"/>
  <rect x="315" y="56" width="9" height="28" class="f-accent"/>
  <rect x="326" y="56" width="9" height="28" class="f-box"/>
  <rect x="337" y="56" width="9" height="28" class="f-accent"/>
  <rect x="348" y="56" width="9" height="28" class="f-accent"/>
  <rect x="359" y="56" width="9" height="28" class="f-box"/>
  <rect x="370" y="56" width="9" height="28" class="f-accent"/>
  <rect x="381" y="56" width="9" height="28" class="f-accent"/>
  <rect x="392" y="56" width="9" height="28" class="f-box"/>
  <rect x="403" y="56" width="9" height="28" class="f-accent"/>
  <rect x="414" y="56" width="9" height="28" class="f-accent"/>
  <rect x="425" y="56" width="9" height="28" class="f-box"/>
  <rect x="436" y="56" width="9" height="28" class="f-accent"/>
  <rect x="447" y="56" width="9" height="28" class="f-accent"/>
  <rect x="458" y="56" width="9" height="28" class="f-box"/>
  <rect x="469" y="56" width="9" height="28" class="f-accent"/>
  <rect x="480" y="56" width="9" height="28" class="f-box"/>
  <rect x="491" y="56" width="9" height="28" class="f-accent"/>
  <rect x="502" y="56" width="9" height="28" class="f-box"/>
  <rect x="513" y="56" width="9" height="28" class="f-accent"/>
  <rect x="524" y="56" width="9" height="28" class="f-box"/>
  <rect x="535" y="56" width="9" height="28" class="f-accent"/>
  <rect x="546" y="56" width="9" height="28" class="f-accent"/>
  <rect x="557" y="56" width="9" height="28" class="f-box"/>
  <rect x="568" y="56" width="9" height="28" class="f-accent"/>
  <rect x="579" y="56" width="9" height="28" class="f-accent"/>
  <text x="40" y="100" class="f-label f-muted">0:00</text>
  <text x="172" y="100" class="f-label f-muted">1:00</text>
  <text x="304" y="100" class="f-label f-muted">2:00</text>
  <text x="436" y="100" class="f-label f-muted">3:00</text>
  <text x="568" y="100" class="f-label f-muted">4:00</text>
  <text x="12" y="130" class="f-label f-ink">Whole talk: 619 of 1838 pieces have no file</text>
  <text x="12" y="150" class="f-label f-ink">592 of them are the piece from second 10 to 15 of a 15 second block</text>
</svg>
<figcaption>The gaps follow my 15 second blocks, so I suspect my own cutting script.</figcaption>
</figure>

The cues I fixed by hand, partly before the Google answers and partly after. 52 commits touch `concurrency.vtt` between 10 May and 9 October 2013. Many of them are named after the single cue they change, like "Update 00:01:11.361 --> 00:01:13.097". The clean part ends at 00:04:59. After that come loose drafts and one timed block around minute 60, with question marks where I could not hear the word.

## How good my hand was

In 2019 someone published an edited transcript of this talk in the `talk-transcripts` repository on GitHub. It is cleaned up, with "I am" instead of "I'm" and no "um", so it keeps the meaning but does not follow every word. I took the part up to its mark `[Time 0:04:07]` and expanded the contractions in all versions. Then everything went through the English normalizer that Whisper uses for its own scores.

Google's pieces matched 213 of the 593 words. 273 words are missing from Google's text, most of them in the pieces that have no file. My cues matched 390. Against the edited transcript my cues differ in 37.3% of the words and Google's pieces in 65.3%. Some of it is the editing of the transcript and I cannot say how much. I had never checked my cues against anything before and the sentence at 0:24 shows where the number comes from. The transcript has "is built into the language", I wrote "sponsored to a language" and Google heard "to Fort Worth". That is my English of 2013 and I cannot blame Google for it.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="3 versions of the sentence at 0:24. Transcript, 2019: So tonight's talk is going to be sort of a general overview of Clojure, and a specific look at some of the concurrency support that is built into the language. My cue, 2013: So, tonight, talks is gone a be so a general overview of clojure and specific look at some of the concurrency support that sponsored to a language. Google, 2013, by pieces: 0:20 programs in the way of soda, 0:25 no file, 0:30 cat some of the concurrency to Fort Worth, 0:35 server error.">
  <text x="12" y="18" class="f-label f-muted">0:20 to 0:40 of the talk</text>
  <text x="12" y="44" class="f-label f-ink">transcript, 2019</text>
  <text x="24" y="62" class="f-mono f-ink">So tonight's talk is going to be sort of a general overview of</text>
  <text x="24" y="80" class="f-mono f-ink">Clojure, and a specific look at some of the concurrency support</text>
  <text x="24" y="98" class="f-mono f-ink">that is built into the language.</text>
  <text x="12" y="126" class="f-label f-accent">my cue, 2013</text>
  <text x="24" y="144" class="f-mono f-ink">So, tonight, talks is gone a be so a general overview of</text>
  <text x="24" y="162" class="f-mono f-ink">clojure and specific look at some of the concurrency support</text>
  <text x="24" y="180" class="f-mono f-ink">that sponsored to a language.</text>
  <text x="12" y="208" class="f-label f-accent">Google, 2013</text>
  <text x="24" y="226" class="f-mono f-ink">0:20  programs in the way of soda</text>
  <text x="24" y="244" class="f-mono f-ink">0:25  [no file]</text>
  <text x="24" y="262" class="f-mono f-ink">0:30  cat some of the concurrency to Fort Worth</text>
  <text x="24" y="280" class="f-mono f-ink">0:35  [server error]</text>
</svg>
<figcaption>The middle of the sentence falls on the piece at 0:25, which has no file.</figcaption>
</figure>

## The local pipeline before Whisper

For Whisper I need a reference that follows the speech word by word and the Hickey transcript is edited. The copy of the video my README points to is gone as well. It was on rhcloud.com and that hosting closed in 2017. So the comparison runs on the test part of `TED-LIUM 3`, where the transcripts follow the speech almost word by word. It has 11 talks, one of them is 6 seconds long and I dropped it, so 10 talks and 148 minutes are left.

For the local way I put together what was available before September. That is ffmpeg, then Vosk 0.3.43 with the `en-us-0.22-lgraph` model (128 MB), then `vosk-recasepunc-en-0.22` for capital letters and punctuation. After that comes my own cutter for the cues. It starts a new cue on a pause of 0.5 seconds or at the end of a sentence. It also cuts when the text would pass 84 characters (2 lines of 42) or 7 seconds. The glue is about 70 lines of Python.

On all 10 talks it makes 8.02% wrong words. The Vosk authors publish 8.20% for this model on `TED-LIUM`, with their own normalization. It needs 17.9 seconds per minute of audio on 1 core and the punctuation adds 0.5 seconds. With the pocket model `small-en-us-0.15` (40 MB) it needs only 4.5 seconds and makes 10.27%. The cues are readable, but my cutter cuts by length. The first cue of Gary Flake's talk ends in the middle of a phrase: "If I can leave you with one big idea today, it's that the whole of the data in which".

## Whisper on 4 cores

I took Whisper at the commit of 9 October with PyTorch 1.12.1. It ran on a virtual machine with 4 cores of an AMD EPYC 7713 and no GPU. Settings were fp32 and the command line defaults, which means beam search with 5 beams. It is slow here. On Gary Flake's talk tiny.en needs 83 seconds per minute of audio and base.en needs 211. A 20 minute talk takes base.en more than an hour. So tiny.en and base.en ran only on the 3 shortest talks, 19 minutes together. small.en ran only on Gary Flake's talk and on another PyTorch build. tiny.en and base.en wrote byte for byte the same files on both builds, so I expect the same for small.en.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Horizontal bars of the share of wrong words, for one talk also with machine seconds per minute of audio. 3 shortest TED talks, 19 minutes. Vosk small-en-us-0.15 9.24% wrong. Vosk en-us-0.22-lgraph 7.84% wrong. Vosk lgraph, 5 s pieces 12.20% wrong. Whisper tiny.en 3.91% wrong. Whisper base.en 3.27% wrong. Gary Flake's talk only, 6 minutes. Vosk en-us-0.22-lgraph 8.00% wrong, 19 s per minute on 1 core. Whisper tiny.en 3.96% wrong, 83 s per minute on 4 cores. Whisper base.en 2.99% wrong, 211 s per minute on 4 cores. Whisper small.en 2.99% wrong, 822 s per minute on 4 cores.">
  <text x="12" y="18" class="f-label f-muted">Wrong words, %. For Gary Flake's talk also machine seconds per minute of audio</text>
  <text x="12" y="42" class="f-label f-ink">3 shortest TED talks, 19 minutes</text>
  <text x="12" y="71" class="f-label f-ink">Vosk small-en-us-0.15</text>
  <rect x="230" y="62" width="165.0" height="11" class="f-muted"/>
  <text x="401" y="72" class="f-label f-ink">9.24%</text>
  <text x="12" y="91" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="82" width="140.0" height="11" class="f-muted"/>
  <text x="376" y="92" class="f-label f-ink">7.84%</text>
  <text x="12" y="111" class="f-label f-ink">Vosk lgraph, 5 s pieces</text>
  <rect x="230" y="102" width="217.9" height="11" class="f-muted"/>
  <text x="453.85714285714283" y="112" class="f-label f-ink">12.20%</text>
  <text x="12" y="131" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="122" width="69.8" height="11" class="f-accent"/>
  <text x="305.82142857142856" y="132" class="f-label f-ink">3.91%</text>
  <text x="12" y="151" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="142" width="58.4" height="11" class="f-accent"/>
  <text x="294.3928571428571" y="152" class="f-label f-ink">3.27%</text>
  <text x="12" y="172" class="f-label f-ink">Gary Flake's talk only, 6 minutes</text>
  <text x="12" y="201" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="192" width="142.9" height="11" class="f-muted"/>
  <text x="378.8571428571429" y="202" class="f-label f-ink">8.00%</text>
  <text x="560" y="202" class="f-label f-muted" text-anchor="end">19 s/min</text>
  <text x="628" y="202" class="f-label f-muted" text-anchor="end">1 core</text>
  <text x="12" y="221" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="212" width="70.7" height="11" class="f-accent"/>
  <text x="306.7142857142857" y="222" class="f-label f-ink">3.96%</text>
  <text x="560" y="222" class="f-label f-muted" text-anchor="end">83 s/min</text>
  <text x="628" y="222" class="f-label f-muted" text-anchor="end">4 cores</text>
  <text x="12" y="241" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="232" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="242" class="f-label f-ink">2.99%</text>
  <text x="560" y="242" class="f-label f-muted" text-anchor="end">211 s/min</text>
  <text x="628" y="242" class="f-label f-muted" text-anchor="end">4 cores</text>
  <text x="12" y="261" class="f-label f-ink">Whisper small.en</text>
  <rect x="230" y="252" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="262" class="f-label f-ink">2.99%</text>
  <text x="560" y="262" class="f-label f-muted" text-anchor="end">822 s/min</text>
  <text x="628" y="262" class="f-label f-muted" text-anchor="end">4 cores</text>
</svg>
<figcaption>Whisper makes less than half the errors of Vosk. On Gary Flake's talk it needs 4 to 44 times the time of Vosk, on 4 cores against 1.</figcaption>
</figure>

Before the run I wrote down that tiny.en would be about as good as Vosk. It is not. On the 3 talks Vosk makes 7.84% wrong words and tiny.en 3.91%. base.en makes 3.27%. For an editor this means about 78 corrections per 1000 words after Vosk and about 33 after base.en. small.en on Gary Flake's talk makes 2.99%, exactly as many as base.en on the same talk. It needs 822 seconds per minute of audio.

I also expected that Whisper's segments would be too long for subtitles, because it works in 30 second windows. That was wrong too. The longest segment of base.en has 65 characters and none passes 84. About half of them are longer than 42 characters and need a line break. Whisper does not insert it, but my cutter does not either.

The last run was my 2013 design on a newer recognizer. I gave Vosk the same 10 talks in 5 second pieces and closed the utterance at every border. It made 12.49% wrong words against 8.02% on whole files. So even with no missing pieces, cutting every 5 seconds costs 4.5 points. On the 3 short talks it is 12.20% against 7.84%.

For one talk I would take Whisper and wait. For the Hickey talk, 153 minutes, base.en would need about 9 hours on these 4 cores.

## What I did not check

- Timing. I did not compare where a cue starts with where the phrase starts, although in 2013 I built a button just for that.
- A GPU. On a GPU the speed is different and I did not measure it.
- medium and large, which do not fit my time here.
- Speakers with an accent. The TED speakers mostly speak clean English.
- Whether the test talks were in Whisper's training data. TED talks with transcripts are all over the web, so I cannot rule it out.
- Whisper on Hickey himself.
