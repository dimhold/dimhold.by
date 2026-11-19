---
title: "My offline voice remote answers in a second, mostly to a question I did not ask"
description: "I chained Vosk, GPT-2 medium and eSpeak NG on a laptop with 4 GB for the whole thing. The answer is ready about a second after I let go of the key, but on real speech the small Vosk model gets every third word wrong and GPT-2 answers the misheard question with the same confidence. The per-word confidence of Vosk catches many of these errors."
date: 2021-10-23
lang: en
translationKey: voice-remote
tags: ["llm", "machine-learning", "performance"]
---
I wanted to ask the model on my laptop a question without typing it. The questions about my own work often come when I am not sitting at the keyboard. Hold a key and say the question, then hear the answer when I let go, with nothing leaving the machine. The pieces exist: Vosk for recognition, GPT-2 for the answer, `espeak-ng` for the voice. So I put them together and timed them.

My expectation was simple and I never checked it. Recognition is the solved part. The README of `vosk-model-small-en-us-0.15` says 9.85% word error rate on LibriSpeech `test-clean` and a latency of 0.15 s. The slow and weak part is the language model, so that is where I planned to spend my time.

## The setup

The machine has 4 cores and no GPU. Every run goes into a cgroup with a hard limit of 4 GB and no swap, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. I would give about this much to a side project on a laptop. The versions are the ones of this week: Python 3.9, torch 1.10.0 on CPU, transformers 4.11.3, vosk 0.3.31.

I did not record myself. For the speech I took SLURP, a public set where people read out commands and questions for a home assistant from a tablet. Everything there is recorded by a microphone array in the room. Some speakers also wore a headset, so part of the phrases exist twice. I picked 150 different phrases that have both recordings, so 300 files.

The key is simulated. Audio goes into the recognizer in pieces of 0.2 s at the pace of speech. The clock starts when the file ends, which is the moment I let go of the key. If the recognizer is slower than speech, the queue grows and the delay includes it.

## The chain is fast

<figure class="fig">
<svg viewBox="0 0 680 212" role="img" aria-label="Time from releasing the key to a ready answer, 50 headset phrases. Vosk 0.05 s; GPT-2 medium 0.87 s; eSpeak NG 0.13 s; median 1.06 s; 90th pct 3.09 s; worst 3.6 s.">
  <rect x="47.5" y="60" width="217.5" height="26" rx="2" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="156.3" y="77" text-anchor="middle" class="f-muted" style="font-size:10px">speech, Vosk already working</text>
  <rect x="265.0" y="60" width="3.8" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="259.0" y="52" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">Vosk 0.05 s</text>
  <rect x="268.8" y="60" width="65.2" height="26" rx="1" class="f-box"/>
  <text x="272.8" y="100" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">GPT-2 medium 0.87 s</text>
  <rect x="333.9" y="60" width="9.9" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="333.9" y="52" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">eSpeak NG 0.13 s</text>
  <line x1="265" y1="24" x2="265" y2="166" class="f-line" style="stroke:var(--accent)"/>
  <text x="269" y="34" text-anchor="start" class="f-accent" style="font-size:10px">key released</text>
  <line x1="265" y1="126" x2="344.3" y2="126" class="f-line" style="stroke-width:3"/>
  <text x="350.3" y="130" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">median 1.06 s</text>
  <line x1="265" y1="144" x2="496.8" y2="144" class="f-line" style="stroke-width:1.5"/>
  <text x="502.8" y="148" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">90th pct 3.09 s</text>
  <line x1="265" y1="162" x2="535.1" y2="162" class="f-line" style="stroke-width:1.5"/>
  <text x="541.1" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">worst 3.6 s</text>
  <line x1="40" y1="186" x2="640" y2="186" class="f-line"/>
  <line x1="40" y1="186" x2="40" y2="190" class="f-line"/>
  <text x="40" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-3 s</text>
  <line x1="115" y1="186" x2="115" y2="190" class="f-line"/>
  <text x="115" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-2 s</text>
  <line x1="190" y1="186" x2="190" y2="190" class="f-line"/>
  <text x="190" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-1 s</text>
  <line x1="265" y1="186" x2="265" y2="190" class="f-line"/>
  <text x="265" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">0 s</text>
  <line x1="340" y1="186" x2="340" y2="190" class="f-line"/>
  <text x="340" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+1 s</text>
  <line x1="415" y1="186" x2="415" y2="190" class="f-line"/>
  <text x="415" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+2 s</text>
  <line x1="490" y1="186" x2="490" y2="190" class="f-line"/>
  <text x="490" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+3 s</text>
  <line x1="565" y1="186" x2="565" y2="190" class="f-line"/>
  <text x="565" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+4 s</text>
  <line x1="640" y1="186" x2="640" y2="190" class="f-line"/>
  <text x="640" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+5 s</text>
</svg>
<figcaption>Medians of each step on 50 headset phrases from SLURP: Vosk small 0.15, GPT-2 medium greedy up to 40 tokens, eSpeak NG writing a wav. Below, the whole chain: median, 90th percentile and the worst phrase. One run, 4 cores, 4 GB limit.</figcaption>
</figure>

On 50 headset phrases the chain was Vosk small, then GPT-2 medium, then `espeak-ng`. From releasing the key to a ready answer the median was 1.06 s and the worst 3.6 s. The recognizer took 0.05 s of it, because it did its work while the person was still talking. In the median phrase GPT-2 medium took 84% of the time. The 5 slowest answers are the ones that ran into my limit of 40 tokens. Everything together had a peak of 3363 MB, so it fits in the 4 GB.

So far this matched what I expected, the model is slow and recognition costs almost nothing. After that I put the transcripts next to the SLURP references.

## The ear is the weak part

One of the first phrases was "is it sunny what's the temperature". Vosk heard "is it son new what's the temperature". GPT-2 medium answered:

```
it's not son new, it's son new.
```

It was not a single case. Of the 50 questions in the timed run, GPT-2 got a transcript that was not what was said in 38. Over all 150 headset phrases the small Vosk model got 32 completely right. Its word error rate was 32.7%, more than 3 times the README number. With the room microphone it was 53.2%.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Word error rate of four recognizers on the same 150 phrases, headset and room microphone. Vosk small 0.15: headset 32.7%, room microphone 53.2%, 0.05 s after release, peak 205 MB; Vosk 0.21, rescore, no rnnlm: headset 25.2%, room microphone 43.2%, 0.22 s after release, peak 2214 MB; Vosk 0.21, no rescore, no rnnlm: headset 29.8%, room microphone 47.8%, 0.22 s after release, peak 339 MB; wav2vec2 base 960h: headset 43.4%, room microphone 69.1%, 0.43 s after release, peak 1377 MB; Vosk 0.21 as published: killed while loading, at 4 GB and at 5.5 GB.">
  <circle cx="230" cy="14" r="5" class="f-box"/>
  <text x="240" y="18" text-anchor="start" class="f-muted" style="font-size:11px">headset</text>
  <circle cx="350" cy="14" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="360" y="18" text-anchor="start" class="f-muted" style="font-size:11px">room microphone</text>
  <text x="20" y="44" text-anchor="start" class="f-ink" style="font-size:12px">Vosk small 0.15</text>
  <text x="20" y="59" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0.05 s after release, peak 205 MB</text>
  <line x1="393.5" y1="40" x2="496.0" y2="40" class="f-line"/>
  <circle cx="393.5" cy="40" r="5" class="f-box"/>
  <circle cx="496.0" cy="40" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="393.5" y="31" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">32.7%</text>
  <text x="496.0" y="31" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">53.2%</text>
  <text x="20" y="88" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, rescore, no rnnlm</text>
  <text x="20" y="103" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0.22 s after release, peak 2214 MB</text>
  <line x1="356.0" y1="84" x2="446.0" y2="84" class="f-line"/>
  <circle cx="356.0" cy="84" r="5" class="f-box"/>
  <circle cx="446.0" cy="84" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="356.0" y="75" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">25.2%</text>
  <text x="446.0" y="75" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">43.2%</text>
  <text x="20" y="132" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, no rescore, no rnnlm</text>
  <text x="20" y="147" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0.22 s after release, peak 339 MB</text>
  <line x1="379.0" y1="128" x2="469.0" y2="128" class="f-line"/>
  <circle cx="379.0" cy="128" r="5" class="f-box"/>
  <circle cx="469.0" cy="128" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="379.0" y="119" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">29.8%</text>
  <text x="469.0" y="119" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">47.8%</text>
  <text x="20" y="176" text-anchor="start" class="f-ink" style="font-size:12px">wav2vec2 base 960h</text>
  <text x="20" y="191" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0.43 s after release, peak 1377 MB</text>
  <line x1="447.0" y1="172" x2="575.5" y2="172" class="f-line"/>
  <circle cx="447.0" cy="172" r="5" class="f-box"/>
  <circle cx="575.5" cy="172" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="447.0" y="163" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">43.4%</text>
  <text x="575.5" y="163" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">69.1%</text>
  <text x="20" y="220" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21 as published</text>
  <text x="230" y="220" text-anchor="start" class="f-mono f-accent" style="font-size:10.5px">killed while loading, at 4 GB and at 5.5 GB</text>
  <line x1="230" y1="238" x2="630" y2="238" class="f-line"/>
  <line x1="230" y1="238" x2="230" y2="242" class="f-line"/>
  <text x="230" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">0%</text>
  <line x1="330" y1="238" x2="330" y2="242" class="f-line"/>
  <text x="330" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="430" y1="238" x2="430" y2="242" class="f-line"/>
  <text x="430" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="530" y1="238" x2="530" y2="242" class="f-line"/>
  <text x="530" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="630" y1="238" x2="630" y2="242" class="f-line"/>
  <text x="630" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <text x="630" y="270" text-anchor="end" class="f-muted" style="font-size:10px">word error rate</text>
</svg>
<figcaption>The same 150 SLURP phrases, each recorded by a headset and by a microphone in the room. Under each name: median wait after the key is released and peak memory of the run. Words compared without case and punctuation.</figcaption>
</figure>

I tried 2 other recognizers. `facebook/wav2vec2-base-960h` through transformers was worse here, 43.4% on the headset. It also needs the whole recording, so after release it works for 0.43 s in the median. It is trained on LibriSpeech only, which is audiobooks.

The big Vosk model, `vosk-model-en-us-0.21`, is a 1.75 GB download and I expected it to fit easily. It was killed at 4 GB and again at 5.5 GB, while still loading. I spent some time in `model.cc` before I understood it. Next to the graph the model has 2 folders, `rescore` with a 1.9 GB language model and `rnnlm` with a neural one. At load Vosk multiplies the RNNLM word features out into a full matrix. With `rnnlm` and without `rescore` the load peak was 3315 MB, without both 293 MB.

Without `rnnlm` and with `rescore` the load peak was 2157 MB and the word error rate on the headset was 25.2%. That is my best number, but still every fourth word is wrong. Without both folders it is 29.8%.

So my expectation was wrong in the place where I did not look. I read the 9.85% in the README and did not think about what `test-clean` is. It is long sentences from audiobooks, read into a good microphone. SLURP is short commands read in a room.

## Vosk knows when it is unsure

Errors I can accept, but nothing in the chain says "I did not catch that". Vosk gives one line and GPT-2 answers it with the same confidence as a right one.

Vosk can say more. With `SetWords(True)` every word in the result comes with a confidence from 0 to 1. I took the lowest word confidence of each phrase and used it as a gate. Below a threshold the remote asks me to repeat instead of thinking.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="150 headset phrases, Vosk small, gate at lowest word confidence 0.5. Heard right and answered: 31. Heard right and asked to repeat: 1. Heard wrong and asked to repeat: 45. Heard wrong and answered: 73.">
  <text x="40" y="26" text-anchor="start" class="f-ink" style="font-size:12px">heard right, answered: 31</text>
  <rect x="40" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="142" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="159" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="176" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="193" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="210" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="227" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="244" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="261" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="278" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="295" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="312" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="329" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="346" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="363" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="380" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="397" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="414" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="431" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="448" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="40" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <text x="40" y="92" text-anchor="start" class="f-ink" style="font-size:12px">heard right, asked to repeat: 1</text>
  <rect x="40" y="100" width="14" height="14" rx="2" class="f-box" style="stroke-dasharray:2 2"/>
  <text x="40" y="141" text-anchor="start" class="f-ink" style="font-size:12px">heard wrong, asked to repeat: 45</text>
  <rect x="40" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="380" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="397" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="414" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="431" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="448" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="40" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="166" width="14" height="14" rx="2" class="f-box"/>
  <text x="40" y="207" text-anchor="start" class="f-ink" style="font-size:12px">heard wrong, answered: 73</text>
  <rect x="40" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
</svg>
<figcaption>One square is one phrase. The gate looks at the lowest word confidence from SetWords(True) and asks to repeat when it is under 0.5. Vosk small 0.15, the 150 headset recordings.</figcaption>
</figure>

On the 150 headset phrases with the small model, the gate at 0.5 stopped 45 of the 118 wrong transcripts. It stopped only 1 of the 32 right ones. At 0.7 it stopped 90 of the wrong ones, but also 5 of the right ones. With the room microphone at 0.5 it stopped 66 of 139 wrong ones and 1 of 11 right ones. At 0.5 it still lets 73 wrong transcripts through, but 45 wrong transcripts fewer for 1 lost right question is a good trade for a few lines of code.

The other cheap thing is to say the transcript back before the answer. The answer takes about a second anyway. If I hear "is it son new" first, I stop listening and ask again.

The next version will repeat what it heard and ask again when the lowest confidence is under 0.5. The language model stays GPT-2 medium for now.

## What I did not check

- My own voice and my own microphone. SLURP is other people in other rooms and its room microphone is an array, not the one in my laptop.
- The sound device. The time ends when `espeak-ng` has written the audio, the playback is not in it.
- Wake words and automatic end of speech. The key replaces both.
- The quality of the answers. GPT-2 medium is not a question answering model and it says strange things on right transcripts too. I only counted whether it got the question that was asked.
- Repeats. Every number is from one run on a shared machine. A second run moved single timings by up to a third and the medians by less than 10%, the transcripts were the same.
- How words were compared. I ignored case, punctuation and apostrophes. 5 of the 150 phrases start with "olly", the name of the assistant in SLURP. No recognizer wrote it down even once.
