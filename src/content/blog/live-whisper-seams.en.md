---
title: "My live Whisper transcriber made 2.6 times more mistakes than Whisper on the whole file"
description: "The simplest live Whisper transcriber cuts the stream into 5 second pieces and gives each to transcribe(). On 19 minutes of LibriSpeech read speech, Whisper base at the 9 December commit gave 5.79% wrong words on the whole file and 14.89% on the pieces, at 4 times the compute. Longer pieces help at the cost of delay and the previous text as a prompt helped little. Cutting in the quietest spot between 4 and 6 seconds gave 10.01%. Even 30 second pieces stay worse than the file, because transcribe() can no longer go back to a cut word."
date: 2022-12-30
lang: en
translationKey: live-whisper-seams
tags: ["machine-learning", "performance", "text"]
---
Since September I run Whisper on recordings after a call is over. That works, but the text arrives when I no longer need it. I wanted it while people are still talking, so I wrote the simplest live version I could think of: read 5 seconds of audio, give them to `transcribe()`, print the text, repeat.

It is about 40 lines of Python. ffmpeg writes raw 16 kHz PCM to stdout, the script reads it and a line of text appears every few seconds. For a while I was happy with it. Then I ran the same cutting over an audiobook chapter, read a full page of the output and saw this:

```
... a golden fortune, and a-
a happy life. He was like unto my father in a way, and yet was not my f-.
father. Also, there was a stripling page who turned into a maid.
```

Every line is one 5 second piece. At the end of a piece Whisper sees half a word and writes `f-.`. In the next piece it sees the other half and writes `father` again. Elsewhere the end of a piece came out as `thank waitags heißa`, which is not a language.

I had assumed that cutting would cost a word here and there and I never measured it, so I did.

## The setup

I needed speech with a known correct text, so I did not use my own calls. LibriSpeech `test-clean` has read books with exact transcripts. I took 4 readers, 2 women and 2 men. For each of them I glued the first chapter into one stream, cut at 5 minutes where the chapter was longer. Together that is 19 minutes and about 3200 words.

Whisper is the repository as of 9 December, model `base`, on CPU in fp32 with the language set to English. The machine has 4 virtual cores of an AMD EPYC 7713 and torch 1.12.1. I count word error rate after Whisper's own English text normalizer, so commas and "Mr" against "mister" do not count.

The baseline is the whole 5 minute file given to `transcribe()` at once. That is how I used Whisper since September and it gave 5.79% of words wrong.

## What the cutting costs

The version with 5 second pieces gave 14.89%, 2.6 times more errors on the same audio. I split the errors by where they sit, counting the first 2 and the last 2 words of every piece as next to a cut. That zone is about 30% of the words and it holds 252 errors. The other 70% hold 224, while the whole file had 185 errors on all of its words. So the middle of a piece is also read worse, just less badly than the edges. Extra words went from 18 to 148, about half of them right at a cut.

My first suspicion was luck. Maybe this grid of cuts happened to hit many words, so I moved it by 2.5 seconds and ran it again. It gave 14.11%, so the position of the grid changes less than a point.

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="The same sentence transcribed 3 ways. The whole file gives it without errors. With 5 second pieces the word father is cut: one piece ends with my f-. and the next starts with father again, and a- appears before happy. With the quiet cut the word father survives, but the cut lands inside happy, which comes out as a ha- and be life.">
  <text x="16" y="22" class="f-label f-muted">whole file</text>
  <text x="28" y="43" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-ink">a golden fortune and a happy life. He was like unto my father, in a way, and yet was not my </tspan><tspan class="f-accent">father.</tspan></text>
  <rect x="16" y="32" width="4" height="14" rx="1" class="f-box"/>
  <text x="16" y="70" class="f-label f-muted">5 s pieces</text>
  <text x="28" y="91" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-ink">a golden fortune, and </tspan><tspan class="f-accent">a-</tspan></text>
  <text x="28" y="109" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-ink">a happy life. He was like unto my father in a way, and yet was not </tspan><tspan class="f-accent">my f-.</tspan></text>
  <text x="28" y="127" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-accent">father.</tspan><tspan class="f-ink"> Also ...</tspan></text>
  <rect x="16" y="80" width="4" height="50" rx="1" class="f-box"/>
  <line x1="24" x2="664" y1="97" y2="97" class="f-line" stroke-dasharray="2 3"/>
  <line x1="24" x2="664" y1="115" y2="115" class="f-line" stroke-dasharray="2 3"/>
  <text x="16" y="154" class="f-label f-muted">quiet cut, 4 to 6 s</text>
  <text x="28" y="175" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-ink">a golden fortune and a h</tspan><tspan class="f-accent">a-</tspan></text>
  <text x="28" y="193" class="f-mono" style="font-size:11px" xml:space="preserve"><tspan class="f-accent">be life,</tspan><tspan class="f-ink"> he was like unto my father in a way, and yet was not my </tspan><tspan class="f-accent">father.</tspan></text>
  <rect x="16" y="164" width="4" height="32" rx="1" class="f-box"/>
  <line x1="24" x2="664" y1="181" y2="181" class="f-line" stroke-dasharray="2 3"/>
  <text x="664" y="214" text-anchor="end" class="f-label f-muted">one line = one piece</text>
</svg>
<figcaption>Whisper base, the same reader, the same sentence. Accent marks the words broken by a cut.</figcaption>
</figure>

Then I tried the 3 fixes that seemed obvious.

1. Longer pieces. 10 seconds gave 11.76% and 30 seconds gave 8.20%. Better, but at 30 seconds the text arrives half a minute late.
2. Give Whisper the text of the previous piece as `initial_prompt`. 14.02%, practically the same. I expected a bit more from it and I do not know why it did so little.
3. Cut in a quiet place. The script looks between 4 and 6 seconds for the quietest 100 milliseconds. It cuts in the middle of them. This gave 10.01%, the biggest gain for the same delay.

The quiet cut also showed me where I was wrong. In the same sentence it produced `a ha-` and `be life`, because the quietest 100 milliseconds in that window were inside the word "happy". My guess is the short silence before the "p", but I did not check it on the waveform.

## Why even 30 seconds is worse than the whole file

This one surprised me. Whisper looks at 30 seconds of audio at a time, so I expected 30 second pieces to give the same result as the whole file. They gave 8.20% against 5.79%.

Part of the answer is in `transcribe()`. When it reads a long file, it moves the next window to the last timestamp where a phrase finished. A word cut by the window edge is simply read again, together with what comes after it. My script cuts the audio before Whisper sees it, so Whisper cannot go back. This does not explain everything: of the 77 errors above the whole file, 33 are in the middle of pieces. Maybe it is the lost text of the previous piece, which `transcribe()` keeps as context inside a file, but I did not separate that.

The same code explains the noise at the ends of pieces. If a piece ends in the middle of a phrase, `transcribe()` decodes the remaining tail once more as a separate window. When the decoder output looks bad, Whisper retries at a higher temperature. In 20 of the 235 pieces of 5 seconds some later part was decoded at temperature 0.6 or above. The piece with `heißa` went up to 1.0.

## What it costs in compute

Before the encoder, `transcribe()` pads the spectrogram of every piece to 30 seconds. On this machine the `base` encoder takes about 1.2 seconds for a padded 5 second piece and the same for a real 30 second one. The whole file costs 0.17 seconds of work per second of audio, the 5 second pieces cost 0.67, which is 4 times more.

<figure class="fig">
<svg viewBox="0 0 680 224" role="img" aria-label="Word error rate on 19 minutes of read speech, Whisper base. Whole file 5.79%, 30 second pieces 8.20%, quiet cut between 4 and 6 seconds 10.01%, 10 second pieces 11.76%, 5 second pieces with the previous text as prompt 14.02%, 5 second pieces shifted by 2.5 seconds 14.11%, 5 second pieces 14.89%. Compute per second of audio: 0.17 seconds for the whole file and 0.67 for 5 second pieces. Whisper small: whole file 3.60%, quiet cut 7.57%, 5 second pieces 13.80%.">
  <text x="16" y="18" class="f-label f-muted">how the audio is fed</text>
  <text x="170" y="18" class="f-label f-muted">words wrong</text>
  <text x="664" y="18" text-anchor="end" class="f-label f-muted">compute</text>
  <text x="16" y="44" class="f-mono f-ink" style="font-size:12px">whole file</text>
  <rect x="170" y="33" width="119.4" height="14" rx="2" class="f-box"/>
  <text x="295.4" y="44" class="f-mono f-ink" style="font-size:12px">5.79%</text>
  <circle cx="244.3" cy="40" r="4" class="f-accent"/>
  <text x="664" y="44" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.17</text>
  <text x="16" y="68" class="f-mono f-ink" style="font-size:12px">30 s pieces</text>
  <rect x="170" y="57" width="169.1" height="14" rx="2" class="f-box"/>
  <text x="345.1" y="68" class="f-mono f-ink" style="font-size:12px">8.20%</text>
  <text x="664" y="68" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.24</text>
  <text x="16" y="92" class="f-mono f-ink" style="font-size:12px">quiet cut 4 to 6 s</text>
  <rect x="170" y="81" width="206.5" height="14" rx="2" class="f-box"/>
  <text x="382.5" y="92" class="f-mono f-ink" style="font-size:12px">10.01%</text>
  <circle cx="326.1" cy="88" r="4" class="f-accent"/>
  <text x="664" y="92" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.61</text>
  <text x="16" y="116" class="f-mono f-ink" style="font-size:12px">10 s pieces</text>
  <rect x="170" y="105" width="242.5" height="14" rx="2" class="f-box"/>
  <text x="418.5" y="116" class="f-mono f-ink" style="font-size:12px">11.76%</text>
  <text x="664" y="116" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.64</text>
  <text x="16" y="140" class="f-mono f-ink" style="font-size:12px">5 s + prompt</text>
  <rect x="170" y="129" width="289.2" height="14" rx="2" class="f-box"/>
  <text x="465.2" y="140" class="f-mono f-ink" style="font-size:12px">14.02%</text>
  <text x="664" y="140" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.56</text>
  <text x="16" y="164" class="f-mono f-ink" style="font-size:12px">5 s, shifted</text>
  <rect x="170" y="153" width="291.0" height="14" rx="2" class="f-box"/>
  <text x="467.0" y="164" class="f-mono f-ink" style="font-size:12px">14.11%</text>
  <text x="664" y="164" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.68</text>
  <text x="16" y="188" class="f-mono f-ink" style="font-size:12px">5 s pieces</text>
  <rect x="170" y="177" width="307.1" height="14" rx="2" class="f-box"/>
  <text x="483.1" y="188" class="f-mono f-ink" style="font-size:12px">14.89%</text>
  <circle cx="454.6" cy="184" r="4" class="f-accent"/>
  <text x="664" y="188" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0.67</text>
  <rect x="170" y="204" width="14" height="10" rx="2" class="f-box"/>
  <text x="190" y="213" class="f-label f-muted">base</text>
  <circle cx="245" cy="209" r="4" class="f-accent"/>
  <text x="255" y="213" class="f-label f-muted">small</text>
</svg>
<figcaption>One run per configuration, 4 CPU cores. Compute is seconds of work per second of audio.</figcaption>
</figure>

I also ran the main variants with `small`, the next model up. On the whole file it gave 3.60%, with 5 second pieces 13.80% and with the quiet cut 7.57%. On this machine a 5 second piece takes about 12 seconds with `small`, so live it would fall behind the speech.

## What I took for the live version

I kept the quiet cut between 4 and 6 seconds and the `base` model. I played one chapter through it at real speed. On 51 of the 52 pieces Whisper took between 1.6 and 4.4 seconds. Once it took 11.4 seconds and that line ended with "Who couldn't believe for safety", which the reader never said. With a piece of up to 6 seconds on top, a word usually reached the screen within about 10 seconds. Around that stall it took up to about 17.

On this reader the live text had 3.83% wrong words, against 2.63% for the whole file. Over all 4 readers the quiet cut is 1.7 times the whole file, so the file after the call stays the version I keep. I use the live text only to follow the call.

The proper fix is probably overlapping windows. Keep part of the previous audio and transcribe it again, like `transcribe()` does inside a file. whisper.cpp already does something like this in its `stream` example. Every 3 seconds it transcribes again a window of up to 10 seconds. When it starts a new line, it keeps 200 milliseconds of the old audio. `whisper_mic` cuts the microphone on a pause of 0.8 seconds. I have not measured either of them.

## What I did not check

- Real conversation. These are books read by one person in a quiet room. 2 people talking over each other will change all the numbers, probably not in the same proportion.
- A real microphone. Only the live run went through ffmpeg at real speed and I did not record anything. All other numbers come from cutting the files directly.
- More than one run. With temperature fallback some pieces can decode differently on a repeat, so small differences like 14.11 against 14.02 mean nothing.
- A GPU. I did not try one. There the padding should cost much less time.
