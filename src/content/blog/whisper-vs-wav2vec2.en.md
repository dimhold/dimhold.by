---
title: "Whisper lost to wav2vec2 on LibriSpeech and won the meeting, but 4 sentences almost hid it"
description: "4 models, 3 kinds of audio, 200 sentences each. On LibriSpeech wav2vec2 is ahead of Whisper tiny.en and base.en, on parliament speeches and in meetings Whisper is. In the meeting 4 greedy loops of base.en hid it, until the temperature fallback was switched back on."
date: 2022-09-24
lang: en
translationKey: whisper-vs-wav2vec2
tags: ["machine-learning", "statistics"]
---
Whisper came out on Wednesday. Until now, for open English speech recognition I took wav2vec2 from Hugging Face. The model card of `facebook/wav2vec2-base-960h` gives 3.4% wrong words on the clean test part of LibriSpeech and the large `lv60-self` gives 1.9. For me this number was the quality of the model. I never checked it on audio that is not LibriSpeech.

Table 8 of the Whisper paper shows its small models worse than wav2vec2 on LibriSpeech and better than wav2vec2 base on almost everything else. Every paper shows something like this about itself, so I ran 4 models on 3 kinds of audio and counted.

## The setup

Whisper is at commit `8cf36f3` from 23 September, with torch 1.12.1 on CPU in fp32. I used `tiny.en` and `base.en` with `temperature=0`, which is greedy decoding as in table 8 of the paper. wav2vec2 base and large lv60 run through transformers 4.22.1 and take the most likely letter in every frame, with no language model. The machine has 4 virtual cores of an AMD EPYC 7713.

From every set I took 200 random sentences:

1. LibriSpeech, the clean test part, audiobooks. wav2vec2 was tuned on the training part of the same corpus.
2. VoxPopuli in English, speeches in the European Parliament.
3. AMI, recorded meetings with headset microphones, sentences of 3 words or more. I took only the first file of the test set on Hugging Face, so it is 3 meetings and 4 speakers.

Errors are WER from jiwer 2.5.1.

## The first number was 99%

My first result for `tiny.en` on LibriSpeech was 99.31% of words wrong. The reference is written in capitals with no punctuation. So `SUNDAY AUGUST SIXTEENTH` met `Sunday, August 16th.` and 3 words out of 3 did not match as strings. It looks like a broken model, but it is only capitals and commas.

Lowercase and no punctuation gave 6.02%. The paper counts after its own English normalizer, which also writes numbers as digits and drops `um` and `uh`. After it `16th` equals `sixteenth` and the result is 5.60%, the same as table 8. I used it for all 4 models.

## On LibriSpeech the model card is right

| model | my 200 sentences | paper, greedy |
|---|---|---|
| wav2vec2 large lv60 | 1.52 | 1.8 |
| wav2vec2 base | 2.83 | 3.3 |
| Whisper base.en | 3.43 | 4.2 |
| Whisper tiny.en | 5.60 | 5.6 |

Both wav2vec2 models are ahead in the total. Between `base.en` and wav2vec2 base the gap is 0.6 points. Resampling the sentences 2000 times gives a 95% interval from −0.22 to 1.37, so on 200 sentences I cannot tell these 2 apart. `tiny.en` is clearly worse than both of them.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Word error rate of 4 models on 3 sets, 200 sentences each. LibriSpeech, the clean test part: wav2vec2 large lv60 1.52%, wav2vec2 base 2.83%, Whisper base.en 3.43%, Whisper tiny.en 5.60%. VoxPopuli English: wav2vec2 large lv60 13.05%, wav2vec2 base 20.86%, Whisper base.en 10.51%, Whisper tiny.en 11.67%. AMI meetings, headset microphones: wav2vec2 large lv60 37.69%, wav2vec2 base 47.08%, Whisper base.en 49.93%, Whisper tiny.en 35.14%. On LibriSpeech both wav2vec2 models are ahead of both Whisper models. On VoxPopuli both Whisper models are ahead. In the meetings Whisper tiny.en is the best and Whisper base.en the worst, base.en without its 4 looping sentences: 22.61.">
  <text x="8" y="58" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60</text>
  <text x="8" y="92" class="f-mono f-ink" style="font-size:11px">wav2vec2 base</text>
  <text x="8" y="126" class="f-mono f-accent" style="font-size:11px">Whisper base.en</text>
  <text x="8" y="160" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en</text>
  <text x="150" y="24" class="f-label f-ink">LibriSpeech clean</text>
  <line x1="150" x2="150" y1="36" y2="176" class="f-plain"/>
  <rect x="150" y="44" width="31.5" height="20" rx="2" class="f-muted"/>
  <text x="186.5" y="59" class="f-mono f-ink" style="font-size:11px">1.52</text>
  <rect x="150" y="78" width="58.6" height="20" rx="2" class="f-muted"/>
  <text x="213.6" y="93" class="f-mono f-ink" style="font-size:11px">2.83</text>
  <rect x="150" y="112" width="71.1" height="20" rx="2" class="f-accent"/>
  <text x="226.1" y="127" class="f-mono f-ink" style="font-size:11px">3.43</text>
  <rect x="150" y="146" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="271.0" y="161" class="f-mono f-ink" style="font-size:11px">5.60</text>
  <text x="330" y="24" class="f-label f-ink">VoxPopuli</text>
  <line x1="330" x2="330" y1="36" y2="176" class="f-plain"/>
  <rect x="330" y="44" width="72.6" height="20" rx="2" class="f-muted"/>
  <text x="407.6" y="59" class="f-mono f-ink" style="font-size:11px">13.05</text>
  <rect x="330" y="78" width="116.0" height="20" rx="2" class="f-muted"/>
  <text x="451.0" y="93" class="f-mono f-ink" style="font-size:11px">20.86</text>
  <rect x="330" y="112" width="58.4" height="20" rx="2" class="f-accent"/>
  <text x="393.4" y="127" class="f-mono f-ink" style="font-size:11px">10.51</text>
  <rect x="330" y="146" width="64.9" height="20" rx="2" class="f-accent"/>
  <text x="399.9" y="161" class="f-mono f-ink" style="font-size:11px">11.67</text>
  <text x="510" y="24" class="f-label f-ink">AMI meeting</text>
  <line x1="510" x2="510" y1="36" y2="176" class="f-plain"/>
  <rect x="510" y="44" width="87.6" height="20" rx="2" class="f-muted"/>
  <text x="602.6" y="59" class="f-mono f-ink" style="font-size:11px">37.69</text>
  <rect x="510" y="78" width="109.4" height="20" rx="2" class="f-muted"/>
  <text x="624.4" y="93" class="f-mono f-ink" style="font-size:11px">47.08</text>
  <rect x="510" y="112" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="631.0" y="127" class="f-mono f-ink" style="font-size:11px">49.93</text>
  <rect x="510" y="146" width="81.6" height="20" rx="2" class="f-accent"/>
  <text x="596.6" y="161" class="f-mono f-ink" style="font-size:11px">35.14</text>
  <line x1="562.5" x2="562.5" y1="109" y2="135" style="stroke:var(--ink);stroke-width:2"/>
  <text x="676" y="198" text-anchor="end" class="f-mono f-ink" style="font-size:11px">base.en without its 4 looping sentences: 22.61</text>
  <line x1="562.5" x2="562.5" y1="135" y2="184" style="stroke:var(--ink);stroke-width:1"/>
</svg>
<figcaption>Words wrong, %, after Whisper's English normalizer. Grey is wav2vec2 tuned on LibriSpeech, color is Whisper. Bars are scaled per set.</figcaption>
</figure>

## On VoxPopuli the order turns over

On parliament speeches wav2vec2 base makes 20.86% errors, large 13.05, `tiny.en` 11.67 and `base.en` 10.51, close to the paper. `base.en` was better than wav2vec2 base on 153 sentences and worse on 9. Even `tiny.en`, the smallest Whisper with 39 million parameters, was ahead of wav2vec2 large by 1.4 points, interval −2.46 to −0.34.

## The meeting, where I almost believed the total

After the first 36 meeting sentences `base.en` had 17.68%. When all 200 were done it had 49.93, the worst of the 4 models: `tiny.en` 35.14, wav2vec2 large 37.69, wav2vec2 base 47.08.

Sentence by sentence `base.en` was better than wav2vec2 base on 159 sentences and worse on 22. The total is decided by 4 sentences, which hold 564 of the 1016 errors of `base.en`:

- `oh that's true`, 0.98 seconds of audio, became `Thank you.` 29 times;
- `yeah yeah or one that yeah or one that`, 2.62 seconds, became `yeah` 112 times;
- `mine is serious chaos`, 10.15 seconds, became `I'm screaming.` 56 times;
- `but yeah it depends I mean I I really wanna put the summary in somewhere you know` was written almost correctly, then came `I'm going to do` and after it `a little bit of` 54 times.

`tiny.en` had only 1 such sentence. The speaker said `D. and A.` in 0.41 seconds and the model wrote `See you in the next video.` 24 times.

Without its 4 sentences `base.en` makes 22.61% errors, against 37.32 for wav2vec2 large on the same 196 sentences. The paper gives 20.5 and 30.8 on the whole AMI test set.

Whisper has a check against exactly this and I switched it off myself. If the text of a window compresses with zlib more than 2.4 times, it counts as a loop. If the average log probability of its tokens is below −1, it counts as unsure. In both cases the window is decoded again at a higher temperature. With `temperature=0` there is nothing to go up to.

So I ran the meeting again with the default settings of `transcribe()`. The 4 loops of `base.en` were gone. `oh that's true` came back as empty text and `mine is serious chaos` turned into a longer text that is not in the reference: `Oh, they're all there. It's really on the other side of the car. I've got a phone in my iPhone. The mind is serious chaos.` In total `base.en` made 24.96% errors and was better than wav2vec2 large on 128 sentences, worse on 29.

The fallback is not free. On the same 4 cores a median sentence took 3.5 seconds of work and the 8 slowest took from 49 to 123 seconds each. The slowest of them was `she never said that`. Greedy decoding got it right, but with an average log probability of −1.01, just past the limit, so it was decoded again and came back as `But I don't have to look at further through this content.`

`tiny.en` with the default settings gave 32.83%. `See you in the next video` was gone, but now `D. and A.` became `Do you know what you're saying?`. The same `she never said that` came out as `She's never said bad.` 4 times, a loop that was still there at the last temperature.

The errors that are left look different. wav2vec2 writes the letters it heard. Whisper almost always writes a real word, even a wrong one.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="2 sentences from the AMI meeting set. Reference: IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW TRANSCRIPT OR TEXT OR WHATEVER. wav2vec2 large: IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT OR TEXT OR WHATEE. Whisper base.en: It does does an NXT search for the string, I don't know, transcript or text or whatever. Reference: JUST SORT BANG ON IT. wav2vec2 large: SER BANGONT ASY. Whisper base.en: just for bang on it.">
  <text x="8" y="20" class="f-label f-muted">reference</text>
  <text x="140" y="20" class="f-mono f-muted" style="font-size:11px">IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW</text>
  <text x="140" y="36" class="f-mono f-muted" style="font-size:11px">TRANSCRIPT OR TEXT OR WHATEVER</text>
  <text x="8" y="56" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="56" class="f-mono f-ink" style="font-size:11px">IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT</text>
  <text x="140" y="72" class="f-mono f-ink" style="font-size:11px">OR TEXT OR WHATEE</text>
  <text x="8" y="92" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="92" class="f-mono f-accent" style="font-size:11px">It does does an NXT search for the string, I don't know,</text>
  <text x="140" y="108" class="f-mono f-accent" style="font-size:11px">transcript or text or whatever.</text>
  <text x="8" y="142" class="f-label f-muted">reference</text>
  <text x="140" y="142" class="f-mono f-muted" style="font-size:11px">JUST SORT BANG ON IT</text>
  <text x="8" y="162" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="162" class="f-mono f-ink" style="font-size:11px">SER BANGONT ASY</text>
  <text x="8" y="182" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="182" class="f-mono f-accent" style="font-size:11px">just for bang on it.</text>
</svg>
<figcaption>AMI, headset microphone. The reference is in capitals as in the corpus, the model outputs are as they came.</figcaption>
</figure>

In the meeting 9.60% of the words of wav2vec2 base are not in the LibriSpeech lexicon of 200 thousand words. For wav2vec2 large it is 5.85% and for `tiny.en` 0.77%, the same as in the reference itself. A wrong word that looks like a real one is harder to notice when I read. Still, I would rather edit `the summary in somewhere` than `THE SUMMARYNE SOME WHAR` of wav2vec2 base.

## Noise

As in figure 5 of the paper, I took the first 100 of my LibriSpeech sentences. I added white noise at 10 dB and 0 dB signal to noise. At 0 dB the noise has the same average power as the recording, pauses included.

At 10 dB wav2vec2 large is still the best with 4.74 against 8.81 for `base.en`. The interval of this gap is 2.48 to 5.89 points. wav2vec2 base falls to 19.49, worse than `tiny.en` with 14.76. At 0 dB both Whisper models are ahead: `base.en` 36.12, `tiny.en` 52.15, wav2vec2 large 63.16 and wav2vec2 base 90.75. For 6 of the 100 sentences wav2vec2 base returned nothing at all.

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="Word error rate on the same 100 LibriSpeech sentences with white noise added. Clean, 10 dB and 0 dB signal to noise. wav2vec2 large lv60 1.65%, 4.74%, 63.16%; wav2vec2 base 3.36%, 19.49%, 90.75%; Whisper base.en 3.25%, 8.81%, 36.12%; Whisper tiny.en 6.00%, 14.76%, 52.15%.">
  <line x1="70" x2="460" y1="230.0" y2="230.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="234.0" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" x2="460" y1="180.0" y2="180.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="184.0" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" x2="460" y1="130.0" y2="130.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="134.0" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" x2="460" y1="80.0" y2="80.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="84.0" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" x2="460" y1="30.0" y2="30.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="34.0" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="90" y="250" text-anchor="middle" class="f-label f-ink">clean</text>
  <text x="270" y="250" text-anchor="middle" class="f-label f-ink">10 dB</text>
  <text x="450" y="250" text-anchor="middle" class="f-label f-ink">0 dB</text>
  <polyline points="90.0,226.7 270.0,220.5 450.0,103.7" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="90.0" cy="226.7" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="220.5" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="103.7" r="3.5" class="f-muted"/>
  <text x="464" y="107.7" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60 63.16</text>
  <polyline points="90.0,223.3 270.0,191.0 450.0,48.5" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="223.3" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="191.0" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="48.5" r="3.5" class="f-muted"/>
  <text x="464" y="52.5" class="f-mono f-ink" style="font-size:11px">wav2vec2 base 90.75</text>
  <polyline points="90.0,223.5 270.0,212.4 450.0,157.8" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="90.0" cy="223.5" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="212.4" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="157.8" r="3.5" class="f-accent"/>
  <text x="464" y="161.8" class="f-mono f-accent" style="font-size:11px">Whisper base.en 36.12</text>
  <polyline points="90.0,218.0 270.0,200.5 450.0,125.7" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="218.0" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="200.5" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="125.7" r="3.5" class="f-accent"/>
  <text x="464" y="129.7" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en 52.15</text>
</svg>
<figcaption>The same 100 sentences of clean LibriSpeech, white noise at 10 dB and 0 dB.</figcaption>
</figure>

## What I did not check

- Bigger models, beam search and the command line defaults, which use 5 beams.
- Pub noise and music. The noise here is white and added by me.
- AMI here is 3 meetings and 4 speakers. Every number above comes from 1 run on 200 sentences.
- Whether the Whisper normalizer is fair to wav2vec2. It was written for Whisper output.

For my own recordings I will start with `base.en` and keep the temperature fallback on, but I will read the short and quiet pieces after it.
