---
title: "Whisper base never connected out on 1460 sentences, but one of them added a point to its error rate"
description: "Whisper base at commit 2b0c297 under strace: 0 connect calls once base.pt is cached, but 3 ways to fail without network. Then LibriSpeech on 1460 sentences: one greedy loop costs a point of WER, and the readers differ more than chance."
date: 2022-10-01
lang: en
translationKey: whisper-offline-145mb
tags: ["machine-learning", "networking", "statistics"]
---
Whisper came out on 21 September. Since then I want one thing from it: turn my voice notes and recorded calls into text without sending the audio anywhere. The model I picked is `base` and on disk `base.pt` is 145262807 bytes, about 145 MB.

I had 2 beliefs about it and I checked neither. First, once the file is downloaded, transcription is local and nothing goes out. I never looked at what the package does with the network, I just trusted the word "local". Second, the paper says base makes 5.0% word errors on LibriSpeech `test-clean` with greedy decoding, so I expected roughly that. I also expected base to run at least 4 times faster than real time on my CPU.

## What goes to the network

I used the repository at commit `2b0c297` from 29 September with Python 3.9, torch 1.12.1 for CPU in fp32 and transformers 4.22.2. The machine has 4 virtual cores of an AMD EPYC 7713 and no GPU.

I could not switch the network off properly, because user namespaces are closed on this machine and I have no root. The accuracy runs and the main offline checks went under `strace -f -e trace=%network`, which records every socket call, including the ffmpeg that Whisper starts. The accuracy runs had the network up, so Whisper could fetch anything it wanted. To imitate "no network" for the other checks I pointed `https_proxy` to a closed local port. Every download attempt then fails.

<figure class="fig">
<svg viewBox="0 0 680 188" role="img" aria-label="How Whisper loads base at commit 2b0c297. If base.pt is in ~/.cache/whisper and its SHA256 equals the hash in the download URL, the file is read and there are 0 connect calls. If the file is missing or its hash does not match, Whisper downloads it with urlopen from openaipublic.azureedge.net, and without network this ends with URLError. The command line tool without --model asks for small, 484 MB.">
  <rect x="8" y="14" width="150" height="44" rx="4" class="f-plain"/>
  <text x="83" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">load_model(</text>
  <text x="83" y="48" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">&quot;base&quot;)</text>
  <rect x="180" y="14" width="150" height="44" rx="4" class="f-plain"/>
  <text x="255" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">base.pt in</text>
  <text x="255" y="48" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">~/.cache/whisper?</text>
  <rect x="352" y="14" width="150" height="44" rx="4" class="f-plain"/>
  <text x="427" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">SHA256 equals</text>
  <text x="427" y="48" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">hash in the URL?</text>
  <rect x="524" y="14" width="150" height="44" rx="4" class="f-box"/>
  <text x="599" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">read the file,</text>
  <text x="599" y="48" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0 connect calls</text>
  <line x1="158" y1="36" x2="179" y2="36" class="f-line"/>
  <polygon points="179,36 173.6,38.6 173.6,33.4" class="f-muted"/>
  <line x1="330" y1="36" x2="351" y2="36" class="f-line"/>
  <polygon points="351,36 345.6,38.6 345.6,33.4" class="f-muted"/>
  <text x="334" y="29" class="f-label f-muted">yes</text>
  <line x1="502" y1="36" x2="523" y2="36" class="f-line"/>
  <polygon points="523,36 517.6,38.6 517.6,33.4" class="f-muted"/>
  <text x="506" y="29" class="f-label f-muted">yes</text>
  <rect x="180" y="104" width="322" height="44" rx="4" class="f-plain"/>
  <text x="341" y="123" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">urlopen(): download from</text>
  <text x="341" y="138" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">openaipublic.azureedge.net</text>
  <rect x="524" y="104" width="150" height="44" rx="4" class="f-box"/>
  <text x="599" y="123" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">no network:</text>
  <text x="599" y="138" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">URLError</text>
  <line x1="255" y1="58" x2="255" y2="103" class="f-line"/>
  <polygon points="255,103 252.4,97.6 257.6,97.6" class="f-muted"/>
  <text x="261" y="86" class="f-label f-muted">no</text>
  <line x1="427" y1="58" x2="427" y2="103" class="f-line"/>
  <polygon points="427,103 424.4,97.6 429.6,97.6" class="f-muted"/>
  <text x="433" y="86" class="f-label f-muted">no</text>
  <line x1="502" y1="126" x2="523" y2="126" class="f-line"/>
  <polygon points="523,126 517.6,128.6 517.6,123.4" class="f-muted"/>
  <text x="8" y="178" class="f-label f-muted">the command line without --model asks for small, 484 MB</text>
</svg>
<figcaption>load_model() at commit 2b0c297. A file cut to 100 MB goes the same way as a missing one.</figcaption>
</figure>

Whether anything goes out is decided in `load_model()`. If `~/.cache/whisper/base.pt` exists, Whisper reads the whole file, computes its SHA256 and compares it with the hash written in the download URL. If the hash matches, the network is not touched. My accuracy runs below, 1460 sentences with base, made 0 `connect` calls. The tokenizer files come inside the package and transformers did not go to its hub either.

There are 3 weak places around it.

1. The first run downloads the model. With my dead proxy it ends with `URLError: Connection refused` and the error does not mention the model.
2. The command line tool uses `small` by default. On a machine without network `whisper file.flac` fails on the 484 MB download of `small`, even when `base.pt` is already there. With `--model base` it worked and made 0 `connect` calls.
3. A file that was not downloaded completely is not used. I cut `base.pt` to 100 MB and Whisper warned about the checksum, tried to download it again and failed. For an offline laptop this is correct, but the whole file has to be copied and checked once while the network is still there.

## The number that did not match

For accuracy I used LibriSpeech, read books with exact transcripts. The whole set was too slow for me. Base needed 0.93 seconds of work on 4 cores for every second of speech, so my "4 times faster" was off by almost 4 times.

So I took 20 random sentences from every reader. That is 800 sentences from 40 readers of `test-clean` and 660 from 33 readers of `test-other`, the harder half. Decoding is greedy with `temperature=0`, as in table 8 of the paper. The language is set to English. Errors are counted with jiwer 2.5.1 after Whisper's own English normalizer.

`test-clean` gave 6.22%. The paper says 5.0. My first thought was that I broke the normalizer, because spelling of numbers alone can move WER by a point. Before digging into it I sorted the sentences by number of errors.

The first one in the list had 186 errors on 64 words of reference. Whisper read the sentence almost to the end and where the last word should be it went back near the beginning:

```
... to recover le okadia from her breast she fell fainting into the arms of
the fainting girl shedding over her so many tears that there needed no other
sprinkling of water to recover le okadia from her breast she fell fainting ...
```

It wrote 243 words instead of 64. This one sentence holds 17% of all errors of the 800. Without it the result is 5.18%, close to the paper. One of Whisper's checks is for exactly this. If the text of a 30 second window compresses with zlib better than 2.4 times, it counts as a loop. The window is then decoded again at a higher temperature. With `temperature=0` I switched that off myself, because I wanted to compare with the greedy table.

<figure class="fig">
<svg viewBox="0 0 680 224" role="img" aria-label="Errors of Whisper base in each of the 800 sentences of LibriSpeech test-clean, sorted from most to fewest. The first sentence is a loop with 186 errors on 64 words of reference, 17.1% of all errors. The other 799 sentences have 903 errors together and 412 have none. WER is 6.22% with the loop and 5.18% without it. The paper gives 5.0% for greedy decoding.">
  <text x="16" y="18" class="f-label f-muted">errors in each of the 800 sentences of test-clean, sorted</text>
  <line x1="16" x2="664" y1="190" y2="190" class="f-plain"/>
  <rect x="16" y="40" width="4" height="150" class="f-accent"/>
  <path d="M16.00 190.0h0.81v-150.00h-0.81zM16.81 190.0h0.81v-8.06h-0.81zM17.62 190.0h0.81v-7.26h-0.81zM18.43 190.0h0.81v-7.26h-0.81zM19.24 190.0h0.81v-6.45h-0.81zM20.05 190.0h0.81v-6.45h-0.81zM20.86 190.0h0.81v-5.65h-0.81zM21.67 190.0h0.81v-5.65h-0.81zM22.48 190.0h0.81v-5.65h-0.81zM23.29 190.0h0.81v-4.84h-0.81zM24.10 190.0h0.81v-4.84h-0.81zM24.91 190.0h0.81v-4.84h-0.81zM25.72 190.0h0.81v-4.84h-0.81zM26.53 190.0h0.81v-4.84h-0.81zM27.34 190.0h0.81v-4.84h-0.81zM28.15 190.0h0.81v-4.84h-0.81zM28.96 190.0h0.81v-4.84h-0.81zM29.77 190.0h0.81v-4.84h-0.81zM30.58 190.0h0.81v-4.84h-0.81zM31.39 190.0h0.81v-4.84h-0.81zM32.20 190.0h0.81v-4.03h-0.81zM33.01 190.0h0.81v-4.03h-0.81zM33.82 190.0h0.81v-4.03h-0.81zM34.63 190.0h0.81v-4.03h-0.81zM35.44 190.0h0.81v-4.03h-0.81zM36.25 190.0h0.81v-4.03h-0.81zM37.06 190.0h0.81v-4.03h-0.81zM37.87 190.0h0.81v-4.03h-0.81zM38.68 190.0h0.81v-4.03h-0.81zM39.49 190.0h0.81v-4.03h-0.81zM40.30 190.0h0.81v-4.03h-0.81zM41.11 190.0h0.81v-4.03h-0.81zM41.92 190.0h0.81v-4.03h-0.81zM42.73 190.0h0.81v-4.03h-0.81zM43.54 190.0h0.81v-4.03h-0.81zM44.35 190.0h0.81v-4.03h-0.81zM45.16 190.0h0.81v-4.03h-0.81zM45.97 190.0h0.81v-4.03h-0.81zM46.78 190.0h0.81v-4.03h-0.81zM47.59 190.0h0.81v-4.03h-0.81zM48.40 190.0h0.81v-3.23h-0.81zM49.21 190.0h0.81v-3.23h-0.81zM50.02 190.0h0.81v-3.23h-0.81zM50.83 190.0h0.81v-3.23h-0.81zM51.64 190.0h0.81v-3.23h-0.81zM52.45 190.0h0.81v-3.23h-0.81zM53.26 190.0h0.81v-3.23h-0.81zM54.07 190.0h0.81v-3.23h-0.81zM54.88 190.0h0.81v-3.23h-0.81zM55.69 190.0h0.81v-3.23h-0.81zM56.50 190.0h0.81v-3.23h-0.81zM57.31 190.0h0.81v-3.23h-0.81zM58.12 190.0h0.81v-3.23h-0.81zM58.93 190.0h0.81v-3.23h-0.81zM59.74 190.0h0.81v-3.23h-0.81zM60.55 190.0h0.81v-3.23h-0.81zM61.36 190.0h0.81v-3.23h-0.81zM62.17 190.0h0.81v-3.23h-0.81zM62.98 190.0h0.81v-3.23h-0.81zM63.79 190.0h0.81v-3.23h-0.81zM64.60 190.0h0.81v-3.23h-0.81zM65.41 190.0h0.81v-3.23h-0.81zM66.22 190.0h0.81v-3.23h-0.81zM67.03 190.0h0.81v-3.23h-0.81zM67.84 190.0h0.81v-3.23h-0.81zM68.65 190.0h0.81v-3.23h-0.81zM69.46 190.0h0.81v-3.23h-0.81zM70.27 190.0h0.81v-3.23h-0.81zM71.08 190.0h0.81v-3.23h-0.81zM71.89 190.0h0.81v-3.23h-0.81zM72.70 190.0h0.81v-3.23h-0.81zM73.51 190.0h0.81v-3.23h-0.81zM74.32 190.0h0.81v-3.23h-0.81zM75.13 190.0h0.81v-3.23h-0.81zM75.94 190.0h0.81v-3.23h-0.81zM76.75 190.0h0.81v-3.23h-0.81zM77.56 190.0h0.81v-2.42h-0.81zM78.37 190.0h0.81v-2.42h-0.81zM79.18 190.0h0.81v-2.42h-0.81zM79.99 190.0h0.81v-2.42h-0.81zM80.80 190.0h0.81v-2.42h-0.81zM81.61 190.0h0.81v-2.42h-0.81zM82.42 190.0h0.81v-2.42h-0.81zM83.23 190.0h0.81v-2.42h-0.81zM84.04 190.0h0.81v-2.42h-0.81zM84.85 190.0h0.81v-2.42h-0.81zM85.66 190.0h0.81v-2.42h-0.81zM86.47 190.0h0.81v-2.42h-0.81zM87.28 190.0h0.81v-2.42h-0.81zM88.09 190.0h0.81v-2.42h-0.81zM88.90 190.0h0.81v-2.42h-0.81zM89.71 190.0h0.81v-2.42h-0.81zM90.52 190.0h0.81v-2.42h-0.81zM91.33 190.0h0.81v-2.42h-0.81zM92.14 190.0h0.81v-2.42h-0.81zM92.95 190.0h0.81v-2.42h-0.81zM93.76 190.0h0.81v-2.42h-0.81zM94.57 190.0h0.81v-2.42h-0.81zM95.38 190.0h0.81v-2.42h-0.81zM96.19 190.0h0.81v-2.42h-0.81zM97.00 190.0h0.81v-2.42h-0.81zM97.81 190.0h0.81v-2.42h-0.81zM98.62 190.0h0.81v-2.42h-0.81zM99.43 190.0h0.81v-2.42h-0.81zM100.24 190.0h0.81v-2.42h-0.81zM101.05 190.0h0.81v-2.42h-0.81zM101.86 190.0h0.81v-2.42h-0.81zM102.67 190.0h0.81v-2.42h-0.81zM103.48 190.0h0.81v-2.42h-0.81zM104.29 190.0h0.81v-2.42h-0.81zM105.10 190.0h0.81v-2.42h-0.81zM105.91 190.0h0.81v-2.42h-0.81zM106.72 190.0h0.81v-2.42h-0.81zM107.53 190.0h0.81v-2.42h-0.81zM108.34 190.0h0.81v-2.42h-0.81zM109.15 190.0h0.81v-2.42h-0.81zM109.96 190.0h0.81v-2.42h-0.81zM110.77 190.0h0.81v-2.42h-0.81zM111.58 190.0h0.81v-2.42h-0.81zM112.39 190.0h0.81v-2.42h-0.81zM113.20 190.0h0.81v-1.61h-0.81zM114.01 190.0h0.81v-1.61h-0.81zM114.82 190.0h0.81v-1.61h-0.81zM115.63 190.0h0.81v-1.61h-0.81zM116.44 190.0h0.81v-1.61h-0.81zM117.25 190.0h0.81v-1.61h-0.81zM118.06 190.0h0.81v-1.61h-0.81zM118.87 190.0h0.81v-1.61h-0.81zM119.68 190.0h0.81v-1.61h-0.81zM120.49 190.0h0.81v-1.61h-0.81zM121.30 190.0h0.81v-1.61h-0.81zM122.11 190.0h0.81v-1.61h-0.81zM122.92 190.0h0.81v-1.61h-0.81zM123.73 190.0h0.81v-1.61h-0.81zM124.54 190.0h0.81v-1.61h-0.81zM125.35 190.0h0.81v-1.61h-0.81zM126.16 190.0h0.81v-1.61h-0.81zM126.97 190.0h0.81v-1.61h-0.81zM127.78 190.0h0.81v-1.61h-0.81zM128.59 190.0h0.81v-1.61h-0.81zM129.40 190.0h0.81v-1.61h-0.81zM130.21 190.0h0.81v-1.61h-0.81zM131.02 190.0h0.81v-1.61h-0.81zM131.83 190.0h0.81v-1.61h-0.81zM132.64 190.0h0.81v-1.61h-0.81zM133.45 190.0h0.81v-1.61h-0.81zM134.26 190.0h0.81v-1.61h-0.81zM135.07 190.0h0.81v-1.61h-0.81zM135.88 190.0h0.81v-1.61h-0.81zM136.69 190.0h0.81v-1.61h-0.81zM137.50 190.0h0.81v-1.61h-0.81zM138.31 190.0h0.81v-1.61h-0.81zM139.12 190.0h0.81v-1.61h-0.81zM139.93 190.0h0.81v-1.61h-0.81zM140.74 190.0h0.81v-1.61h-0.81zM141.55 190.0h0.81v-1.61h-0.81zM142.36 190.0h0.81v-1.61h-0.81zM143.17 190.0h0.81v-1.61h-0.81zM143.98 190.0h0.81v-1.61h-0.81zM144.79 190.0h0.81v-1.61h-0.81zM145.60 190.0h0.81v-1.61h-0.81zM146.41 190.0h0.81v-1.61h-0.81zM147.22 190.0h0.81v-1.61h-0.81zM148.03 190.0h0.81v-1.61h-0.81zM148.84 190.0h0.81v-1.61h-0.81zM149.65 190.0h0.81v-1.61h-0.81zM150.46 190.0h0.81v-1.61h-0.81zM151.27 190.0h0.81v-1.61h-0.81zM152.08 190.0h0.81v-1.61h-0.81zM152.89 190.0h0.81v-1.61h-0.81zM153.70 190.0h0.81v-1.61h-0.81zM154.51 190.0h0.81v-1.61h-0.81zM155.32 190.0h0.81v-1.61h-0.81zM156.13 190.0h0.81v-1.61h-0.81zM156.94 190.0h0.81v-1.61h-0.81zM157.75 190.0h0.81v-1.61h-0.81zM158.56 190.0h0.81v-1.61h-0.81zM159.37 190.0h0.81v-1.61h-0.81zM160.18 190.0h0.81v-1.61h-0.81zM160.99 190.0h0.81v-1.61h-0.81zM161.80 190.0h0.81v-1.61h-0.81zM162.61 190.0h0.81v-1.61h-0.81zM163.42 190.0h0.81v-1.61h-0.81zM164.23 190.0h0.81v-1.61h-0.81zM165.04 190.0h0.81v-1.61h-0.81zM165.85 190.0h0.81v-1.61h-0.81zM166.66 190.0h0.81v-1.61h-0.81zM167.47 190.0h0.81v-1.61h-0.81zM168.28 190.0h0.81v-1.61h-0.81zM169.09 190.0h0.81v-1.61h-0.81zM169.90 190.0h0.81v-1.61h-0.81zM170.71 190.0h0.81v-1.61h-0.81zM171.52 190.0h0.81v-1.61h-0.81zM172.33 190.0h0.81v-1.61h-0.81zM173.14 190.0h0.81v-1.61h-0.81zM173.95 190.0h0.81v-1.61h-0.81zM174.76 190.0h0.81v-1.61h-0.81zM175.57 190.0h0.81v-1.61h-0.81zM176.38 190.0h0.81v-1.61h-0.81zM177.19 190.0h0.81v-1.61h-0.81zM178.00 190.0h0.81v-1.61h-0.81zM178.81 190.0h0.81v-1.61h-0.81zM179.62 190.0h0.81v-1.61h-0.81zM180.43 190.0h0.81v-1.61h-0.81zM181.24 190.0h0.81v-1.61h-0.81zM182.05 190.0h0.81v-1.61h-0.81zM182.86 190.0h0.81v-1.61h-0.81zM183.67 190.0h0.81v-1.61h-0.81zM184.48 190.0h0.81v-1.61h-0.81zM185.29 190.0h0.81v-1.61h-0.81zM186.10 190.0h0.81v-1.61h-0.81zM186.91 190.0h0.81v-1.61h-0.81zM187.72 190.0h0.81v-1.61h-0.81zM188.53 190.0h0.81v-1.61h-0.81zM189.34 190.0h0.81v-1.61h-0.81zM190.15 190.0h0.81v-1.61h-0.81zM190.96 190.0h0.81v-1.61h-0.81zM191.77 190.0h0.81v-1.61h-0.81zM192.58 190.0h0.81v-1.61h-0.81zM193.39 190.0h0.81v-1.61h-0.81zM194.20 190.0h0.81v-1.61h-0.81zM195.01 190.0h0.81v-1.61h-0.81zM195.82 190.0h0.81v-1.61h-0.81zM196.63 190.0h0.81v-1.61h-0.81zM197.44 190.0h0.81v-1.61h-0.81zM198.25 190.0h0.81v-1.61h-0.81zM199.06 190.0h0.81v-1.61h-0.81zM199.87 190.0h0.81v-1.61h-0.81zM200.68 190.0h0.81v-1.61h-0.81zM201.49 190.0h0.81v-1.61h-0.81zM202.30 190.0h0.81v-1.61h-0.81zM203.11 190.0h0.81v-1.61h-0.81zM203.92 190.0h0.81v-1.61h-0.81zM204.73 190.0h0.81v-1.61h-0.81zM205.54 190.0h0.81v-1.61h-0.81zM206.35 190.0h0.81v-1.61h-0.81zM207.16 190.0h0.81v-1.61h-0.81zM207.97 190.0h0.81v-1.61h-0.81zM208.78 190.0h0.81v-1.61h-0.81zM209.59 190.0h0.81v-1.61h-0.81zM210.40 190.0h0.81v-1.61h-0.81zM211.21 190.0h0.81v-1.61h-0.81zM212.02 190.0h0.81v-1.61h-0.81zM212.83 190.0h0.81v-1.61h-0.81zM213.64 190.0h0.81v-1.61h-0.81zM214.45 190.0h0.81v-1.61h-0.81zM215.26 190.0h0.81v-1.61h-0.81zM216.07 190.0h0.81v-1.61h-0.81zM216.88 190.0h0.81v-0.81h-0.81zM217.69 190.0h0.81v-0.81h-0.81zM218.50 190.0h0.81v-0.81h-0.81zM219.31 190.0h0.81v-0.81h-0.81zM220.12 190.0h0.81v-0.81h-0.81zM220.93 190.0h0.81v-0.81h-0.81zM221.74 190.0h0.81v-0.81h-0.81zM222.55 190.0h0.81v-0.81h-0.81zM223.36 190.0h0.81v-0.81h-0.81zM224.17 190.0h0.81v-0.81h-0.81zM224.98 190.0h0.81v-0.81h-0.81zM225.79 190.0h0.81v-0.81h-0.81zM226.60 190.0h0.81v-0.81h-0.81zM227.41 190.0h0.81v-0.81h-0.81zM228.22 190.0h0.81v-0.81h-0.81zM229.03 190.0h0.81v-0.81h-0.81zM229.84 190.0h0.81v-0.81h-0.81zM230.65 190.0h0.81v-0.81h-0.81zM231.46 190.0h0.81v-0.81h-0.81zM232.27 190.0h0.81v-0.81h-0.81zM233.08 190.0h0.81v-0.81h-0.81zM233.89 190.0h0.81v-0.81h-0.81zM234.70 190.0h0.81v-0.81h-0.81zM235.51 190.0h0.81v-0.81h-0.81zM236.32 190.0h0.81v-0.81h-0.81zM237.13 190.0h0.81v-0.81h-0.81zM237.94 190.0h0.81v-0.81h-0.81zM238.75 190.0h0.81v-0.81h-0.81zM239.56 190.0h0.81v-0.81h-0.81zM240.37 190.0h0.81v-0.81h-0.81zM241.18 190.0h0.81v-0.81h-0.81zM241.99 190.0h0.81v-0.81h-0.81zM242.80 190.0h0.81v-0.81h-0.81zM243.61 190.0h0.81v-0.81h-0.81zM244.42 190.0h0.81v-0.81h-0.81zM245.23 190.0h0.81v-0.81h-0.81zM246.04 190.0h0.81v-0.81h-0.81zM246.85 190.0h0.81v-0.81h-0.81zM247.66 190.0h0.81v-0.81h-0.81zM248.47 190.0h0.81v-0.81h-0.81zM249.28 190.0h0.81v-0.81h-0.81zM250.09 190.0h0.81v-0.81h-0.81zM250.90 190.0h0.81v-0.81h-0.81zM251.71 190.0h0.81v-0.81h-0.81zM252.52 190.0h0.81v-0.81h-0.81zM253.33 190.0h0.81v-0.81h-0.81zM254.14 190.0h0.81v-0.81h-0.81zM254.95 190.0h0.81v-0.81h-0.81zM255.76 190.0h0.81v-0.81h-0.81zM256.57 190.0h0.81v-0.81h-0.81zM257.38 190.0h0.81v-0.81h-0.81zM258.19 190.0h0.81v-0.81h-0.81zM259.00 190.0h0.81v-0.81h-0.81zM259.81 190.0h0.81v-0.81h-0.81zM260.62 190.0h0.81v-0.81h-0.81zM261.43 190.0h0.81v-0.81h-0.81zM262.24 190.0h0.81v-0.81h-0.81zM263.05 190.0h0.81v-0.81h-0.81zM263.86 190.0h0.81v-0.81h-0.81zM264.67 190.0h0.81v-0.81h-0.81zM265.48 190.0h0.81v-0.81h-0.81zM266.29 190.0h0.81v-0.81h-0.81zM267.10 190.0h0.81v-0.81h-0.81zM267.91 190.0h0.81v-0.81h-0.81zM268.72 190.0h0.81v-0.81h-0.81zM269.53 190.0h0.81v-0.81h-0.81zM270.34 190.0h0.81v-0.81h-0.81zM271.15 190.0h0.81v-0.81h-0.81zM271.96 190.0h0.81v-0.81h-0.81zM272.77 190.0h0.81v-0.81h-0.81zM273.58 190.0h0.81v-0.81h-0.81zM274.39 190.0h0.81v-0.81h-0.81zM275.20 190.0h0.81v-0.81h-0.81zM276.01 190.0h0.81v-0.81h-0.81zM276.82 190.0h0.81v-0.81h-0.81zM277.63 190.0h0.81v-0.81h-0.81zM278.44 190.0h0.81v-0.81h-0.81zM279.25 190.0h0.81v-0.81h-0.81zM280.06 190.0h0.81v-0.81h-0.81zM280.87 190.0h0.81v-0.81h-0.81zM281.68 190.0h0.81v-0.81h-0.81zM282.49 190.0h0.81v-0.81h-0.81zM283.30 190.0h0.81v-0.81h-0.81zM284.11 190.0h0.81v-0.81h-0.81zM284.92 190.0h0.81v-0.81h-0.81zM285.73 190.0h0.81v-0.81h-0.81zM286.54 190.0h0.81v-0.81h-0.81zM287.35 190.0h0.81v-0.81h-0.81zM288.16 190.0h0.81v-0.81h-0.81zM288.97 190.0h0.81v-0.81h-0.81zM289.78 190.0h0.81v-0.81h-0.81zM290.59 190.0h0.81v-0.81h-0.81zM291.40 190.0h0.81v-0.81h-0.81zM292.21 190.0h0.81v-0.81h-0.81zM293.02 190.0h0.81v-0.81h-0.81zM293.83 190.0h0.81v-0.81h-0.81zM294.64 190.0h0.81v-0.81h-0.81zM295.45 190.0h0.81v-0.81h-0.81zM296.26 190.0h0.81v-0.81h-0.81zM297.07 190.0h0.81v-0.81h-0.81zM297.88 190.0h0.81v-0.81h-0.81zM298.69 190.0h0.81v-0.81h-0.81zM299.50 190.0h0.81v-0.81h-0.81zM300.31 190.0h0.81v-0.81h-0.81zM301.12 190.0h0.81v-0.81h-0.81zM301.93 190.0h0.81v-0.81h-0.81zM302.74 190.0h0.81v-0.81h-0.81zM303.55 190.0h0.81v-0.81h-0.81zM304.36 190.0h0.81v-0.81h-0.81zM305.17 190.0h0.81v-0.81h-0.81zM305.98 190.0h0.81v-0.81h-0.81zM306.79 190.0h0.81v-0.81h-0.81zM307.60 190.0h0.81v-0.81h-0.81zM308.41 190.0h0.81v-0.81h-0.81zM309.22 190.0h0.81v-0.81h-0.81zM310.03 190.0h0.81v-0.81h-0.81zM310.84 190.0h0.81v-0.81h-0.81zM311.65 190.0h0.81v-0.81h-0.81zM312.46 190.0h0.81v-0.81h-0.81zM313.27 190.0h0.81v-0.81h-0.81zM314.08 190.0h0.81v-0.81h-0.81zM314.89 190.0h0.81v-0.81h-0.81zM315.70 190.0h0.81v-0.81h-0.81zM316.51 190.0h0.81v-0.81h-0.81zM317.32 190.0h0.81v-0.81h-0.81zM318.13 190.0h0.81v-0.81h-0.81zM318.94 190.0h0.81v-0.81h-0.81zM319.75 190.0h0.81v-0.81h-0.81zM320.56 190.0h0.81v-0.81h-0.81zM321.37 190.0h0.81v-0.81h-0.81zM322.18 190.0h0.81v-0.81h-0.81zM322.99 190.0h0.81v-0.81h-0.81zM323.80 190.0h0.81v-0.81h-0.81zM324.61 190.0h0.81v-0.81h-0.81zM325.42 190.0h0.81v-0.81h-0.81zM326.23 190.0h0.81v-0.81h-0.81zM327.04 190.0h0.81v-0.81h-0.81zM327.85 190.0h0.81v-0.81h-0.81zM328.66 190.0h0.81v-0.81h-0.81zM329.47 190.0h0.81v-0.81h-0.81z" class="f-muted"/>
  <text x="28" y="52" class="f-mono f-accent" style="font-size:12px">1 sentence: 186 errors on 64 words</text>
  <text x="136" y="152" class="f-mono f-muted" style="font-size:12px">the next worst sentence: 10 errors</text>
  <text x="136" y="170" class="f-mono f-ink" style="font-size:12px">the other 799: 903 errors together</text>
  <text x="16" y="212" class="f-mono f-ink" style="font-size:12px">WER 6.22% with it, 5.18% without it, paper 5.0%</text>
</svg>
<figcaption>Whisper base, greedy, temperature=0. One column is one sentence.</figcaption>
</figure>

I ran the same sentence again with the default settings of `transcribe()`. The loop was caught and the last window was decoded again with sampling, so 2 runs gave 2 different tails. In the run I kept, Whisper went up to temperature 1.0 and the sentence had 12 errors instead of 186. I did not rerun all 800 sentences this way, so I do not know what it does to the average.

`test-other` gave 13.69% against 12.4 in the paper, with no loops. My sample gives every reader the same weight and the full set does not, so the numbers are not exactly comparable. If I resample readers, the 95% interval is 11.56 to 16.22 and the paper's number is inside it.

## The readers

I expected the average to hide readers who get much worse text. On `test-clean` without the loop the range is 0.39% for the best reader to 10.74% for the worst. But with 20 sentences per reader a lot of that can be luck. I shuffled the sentences between readers 1000 times, keeping the same total of errors. Chance alone gives a median best of 2.28% and a median worst of 8.98%, so the extremes are only a bit wider than luck. The spread over all 40 readers is still wider than in any of the 1000 shuffles. But the 2 halves of each reader's sentences agree weakly, with correlation 0.37.

On `test-other` the picture is different. Readers go from 4.74% to 41.44%, against 7.63% to 21.94% by chance. The halves agree with correlation 0.79. The worst reader got `mister kite observed this also` as `miss akai deserves its awesome`. Whisper simply dropped the other 15 words of that sentence.

<figure class="fig">
<svg viewBox="0 0 680 192" role="img" aria-label="Word error rate of Whisper base for every reader, 20 sentences each, the looping sentence removed. test-clean: 40 readers from 0.39% to 10.74%, while shuffling sentences between readers gives a median range from 2.28% to 8.98%. test-other: 33 readers from 4.74% to 41.44%, by chance from 7.63% to 21.94%.">
  <text x="8" y="44" class="f-mono f-ink" style="font-size:12px">test-clean</text>
  <rect x="137.4" y="26" width="80.4" height="28" rx="3" class="f-box"/>
  <line x1="110" x2="650" y1="40" y2="40" class="f-plain"/>
  <circle cx="114.7" cy="34" r="3" class="f-ink"/>
  <circle cx="133.4" cy="40" r="3" class="f-ink"/>
  <circle cx="138.6" cy="46" r="3" class="f-ink"/>
  <circle cx="141.8" cy="34" r="3" class="f-ink"/>
  <circle cx="142.2" cy="40" r="3" class="f-ink"/>
  <circle cx="144.3" cy="46" r="3" class="f-ink"/>
  <circle cx="145.9" cy="34" r="3" class="f-ink"/>
  <circle cx="148.6" cy="40" r="3" class="f-ink"/>
  <circle cx="152.0" cy="46" r="3" class="f-ink"/>
  <circle cx="154.9" cy="34" r="3" class="f-ink"/>
  <circle cx="159.2" cy="40" r="3" class="f-ink"/>
  <circle cx="162.6" cy="46" r="3" class="f-ink"/>
  <circle cx="163.9" cy="34" r="3" class="f-ink"/>
  <circle cx="165.3" cy="40" r="3" class="f-ink"/>
  <circle cx="167.6" cy="46" r="3" class="f-ink"/>
  <circle cx="169.2" cy="34" r="3" class="f-ink"/>
  <circle cx="170.0" cy="40" r="3" class="f-ink"/>
  <circle cx="170.2" cy="46" r="3" class="f-ink"/>
  <circle cx="171.0" cy="34" r="3" class="f-ink"/>
  <circle cx="171.0" cy="40" r="3" class="f-ink"/>
  <circle cx="171.2" cy="46" r="3" class="f-ink"/>
  <circle cx="171.3" cy="34" r="3" class="f-ink"/>
  <circle cx="171.4" cy="40" r="3" class="f-ink"/>
  <circle cx="171.9" cy="46" r="3" class="f-ink"/>
  <circle cx="175.6" cy="34" r="3" class="f-ink"/>
  <circle cx="178.6" cy="40" r="3" class="f-ink"/>
  <circle cx="181.2" cy="46" r="3" class="f-ink"/>
  <circle cx="184.0" cy="34" r="3" class="f-ink"/>
  <circle cx="186.4" cy="40" r="3" class="f-ink"/>
  <circle cx="186.6" cy="46" r="3" class="f-ink"/>
  <circle cx="187.0" cy="34" r="3" class="f-ink"/>
  <circle cx="189.2" cy="40" r="3" class="f-ink"/>
  <circle cx="192.8" cy="46" r="3" class="f-ink"/>
  <circle cx="193.4" cy="34" r="3" class="f-ink"/>
  <circle cx="193.4" cy="40" r="3" class="f-ink"/>
  <circle cx="211.5" cy="46" r="3" class="f-ink"/>
  <circle cx="218.5" cy="34" r="3" class="f-ink"/>
  <circle cx="219.8" cy="40" r="3" class="f-ink"/>
  <circle cx="229.5" cy="46" r="3" class="f-ink"/>
  <circle cx="238.9" cy="34" r="3" class="f-ink"/>
  <text x="114.7" y="70" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.39</text>
  <text x="238.9" y="70" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10.74</text>
  <text x="8" y="110" class="f-mono f-ink" style="font-size:12px">test-other</text>
  <rect x="201.6" y="92" width="171.7" height="28" rx="3" class="f-box"/>
  <line x1="110" x2="650" y1="106" y2="106" class="f-plain"/>
  <circle cx="166.9" cy="100" r="3" class="f-ink"/>
  <circle cx="185.5" cy="106" r="3" class="f-ink"/>
  <circle cx="204.4" cy="112" r="3" class="f-ink"/>
  <circle cx="211.2" cy="100" r="3" class="f-ink"/>
  <circle cx="211.3" cy="106" r="3" class="f-ink"/>
  <circle cx="224.8" cy="112" r="3" class="f-ink"/>
  <circle cx="224.8" cy="100" r="3" class="f-ink"/>
  <circle cx="225.0" cy="106" r="3" class="f-ink"/>
  <circle cx="225.8" cy="112" r="3" class="f-ink"/>
  <circle cx="227.6" cy="100" r="3" class="f-ink"/>
  <circle cx="227.8" cy="106" r="3" class="f-ink"/>
  <circle cx="233.2" cy="112" r="3" class="f-ink"/>
  <circle cx="237.8" cy="100" r="3" class="f-ink"/>
  <circle cx="243.7" cy="106" r="3" class="f-ink"/>
  <circle cx="245.6" cy="112" r="3" class="f-ink"/>
  <circle cx="254.6" cy="100" r="3" class="f-ink"/>
  <circle cx="255.4" cy="106" r="3" class="f-ink"/>
  <circle cx="256.0" cy="112" r="3" class="f-ink"/>
  <circle cx="259.3" cy="100" r="3" class="f-ink"/>
  <circle cx="261.2" cy="106" r="3" class="f-ink"/>
  <circle cx="266.4" cy="112" r="3" class="f-ink"/>
  <circle cx="267.6" cy="100" r="3" class="f-ink"/>
  <circle cx="270.4" cy="106" r="3" class="f-ink"/>
  <circle cx="298.5" cy="112" r="3" class="f-ink"/>
  <circle cx="316.4" cy="100" r="3" class="f-ink"/>
  <circle cx="323.0" cy="106" r="3" class="f-ink"/>
  <circle cx="328.8" cy="112" r="3" class="f-ink"/>
  <circle cx="331.9" cy="100" r="3" class="f-ink"/>
  <circle cx="366.3" cy="106" r="3" class="f-ink"/>
  <circle cx="396.0" cy="112" r="3" class="f-ink"/>
  <circle cx="403.3" cy="100" r="3" class="f-ink"/>
  <circle cx="451.2" cy="106" r="3" class="f-ink"/>
  <circle cx="607.3" cy="112" r="3" class="f-ink"/>
  <text x="166.9" y="136" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4.74</text>
  <text x="607.3" y="136" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">41.44</text>
  <line x1="110" x2="110" y1="148" y2="154" class="f-plain"/>
  <text x="110" y="166" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="230" x2="230" y1="148" y2="154" class="f-plain"/>
  <text x="230" y="166" text-anchor="middle" class="f-label f-muted">10</text>
  <line x1="350" x2="350" y1="148" y2="154" class="f-plain"/>
  <text x="350" y="166" text-anchor="middle" class="f-label f-muted">20</text>
  <line x1="470" x2="470" y1="148" y2="154" class="f-plain"/>
  <text x="470" y="166" text-anchor="middle" class="f-label f-muted">30</text>
  <line x1="590" x2="590" y1="148" y2="154" class="f-plain"/>
  <text x="590" y="166" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="650" y="182" text-anchor="end" class="f-label f-muted">words wrong, % per reader</text>
  <rect x="110" y="173" width="14" height="10" rx="2" class="f-box"/>
  <text x="130" y="182" class="f-label f-muted">range by chance</text>
</svg>
<figcaption>One dot is one reader. The band is the median best and worst reader after 1000 shuffles of sentences between readers.</figcaption>
</figure>

To check whether this is about readers or about my sample, I ran the same 1460 sentences through `tiny`, the model below base, whose file is 76 MB. It gave 7.64% on `test-clean` and 18.02% on `test-other`, where the paper says 7.6 and 16.9. It did not loop once. Per reader, tiny and base agree with correlation 0.82 on `test-clean` and 0.90 on `test-other`. Leaving out the loop sentence, in both sets the best and the worst reader are the same people for both models. On clean speech my halves of 10 sentences were probably just too short to show it.

Tiny needs 0.37 seconds of work per second of speech, measured on 40 short sentences with nothing else running. It is 2.5 times faster than base. On clean speech it makes 7.64% errors against 6.22% for base and 5.18% if the loop is removed. For my notes the extra 70 MB of disk is fine.

Many of the other errors are words that sound alike: `diatribe` became `day a tribe` and `an air or two` became `an arrow to`. Part of the count is the reference itself. LibriSpeech writes `to day` and `to morrow` as 2 words and Whisper writes them as 1, which counts as 2 errors.

## What I did not check

I measured read books in English. My calls and Russian are what I actually want to transcribe and I did not measure them. For the network I had only strace and a dead proxy, because the machine does not allow a separate namespace. And `pip install` needs the network anyway, so offline starts after the first install and the first download.

For my voice notes I will take base with the default `transcribe()` settings, which catch loops. What they do to the average on all 800 sentences I have not measured yet.
