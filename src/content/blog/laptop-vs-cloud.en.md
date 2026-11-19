---
title: "The biggest model I could load in 4 GB is about as good as the cheapest GPT-3"
description: "With the GPT-3 API behind a waitlist I checked what my machine runs with 4 GB for the model, on torch 1.10.0 and transformers 4.12.2. GPT-2 large did not load until I fixed the names in its file and changed a glibc setting. It then scored 47.6% on LAMBADA, about the level of ada, the cheapest API model."
date: 2021-10-30
lang: en
translationKey: laptop-vs-cloud
tags: ["llm", "machine-learning", "performance"]
---
The OpenAI API still has a waitlist, so GPT-3 is something I read about and do not run. What I can run is open weights, GPT-2 from OpenAI and the `GPT-Neo` models from EleutherAI. Since June there is also their GPT-J with 6 billion parameters. So the question for me is how much of this my own machine can actually do.

I had an answer ready and I never checked it. A model with N parameters in fp32 takes 4N bytes. So with 8 GB of memory anything up to 1.5B fits and the CPU only decides how long I wait. I counted parameters and stopped there.

## The setup

The machine has 4 cores and 8 GB and no GPU. About half of the memory is used by other services. So every run goes into a cgroup with a hard limit, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. The process gets no swap and is killed when it goes over 4096 MB. Versions are the ones of this week: Python 3.9, torch 1.10.0 on CPU, transformers 4.12.2, which came out yesterday.

For speed I generate 64 tokens greedily after a prompt of 12 tokens. I do it 3 times and take the median. For quality I use LAMBADA, where the model has to guess the last word of a passage. I count it the way EleutherAI does in their `lm-evaluation-harness`. The answer is right only when the most probable token is the correct one at every position of the word. EleutherAI ran the same harness through the API against ada, babbage, curie and davinci and published the numbers in the README of GPT-J. To check that I count the same thing, I ran Neo 125M on all 5153 passages. I got 37.36% and perplexity 30.265, the README of Neo says 37.36% and 30.266. So my numbers can stand next to their API numbers.

The other models I ran on 500 random passages, the same 500 for all of them. On these Neo 125M gets 34.6%, so my sample is 2.8 points harder than the full set.

## What loaded

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Memory while loading each model under a hard 4096 MB limit. GPT-2 small: weights file 523 MB, peak while loading 1358 MB; Neo 125M: weights file 502 MB, peak while loading 1392 MB; GPT-2 medium: weights file 1450 MB, peak while loading 3237 MB; GPT-2 large (as published, default): weights file 3097 MB, killed; GPT-2 large (prefix + flag + MALLOC_): weights file 3097 MB, peak while loading 3530 MB; Neo 1.3B: weights file 5067 MB, killed.">
  <rect x="190" y="8" width="14" height="8" rx="1" class="f-box"/>
  <text x="210" y="16" text-anchor="start" class="f-muted" style="font-size:11px">weights file</text>
  <rect x="340" y="8" width="14" height="8" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="360" y="16" text-anchor="start" class="f-muted" style="font-size:11px">peak while loading</text>
  <text x="20" y="43" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 small</text>
  <rect x="190" y="32" width="99.6" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="295.58666666666664" y="49" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1358 MB</text>
  <rect x="190" y="39" width="38.4" height="12" rx="1" class="f-box"/>
  <text x="20" y="81" text-anchor="start" class="f-ink" style="font-size:12px">Neo 125M</text>
  <rect x="190" y="70" width="102.1" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="298.08" y="87" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1392 MB</text>
  <rect x="190" y="77" width="36.8" height="12" rx="1" class="f-box"/>
  <text x="20" y="119" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 medium</text>
  <rect x="190" y="108" width="237.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="433.38" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3237 MB</text>
  <rect x="190" y="115" width="106.3" height="12" rx="1" class="f-box"/>
  <text x="20" y="157" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="171" text-anchor="start" class="f-mono f-muted" style="font-size:9px">as published, default</text>
  <rect x="190" y="146" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="496.37333333333333" y="163" text-anchor="start" class="f-mono f-accent" style="font-size:11px">killed (137)</text>
  <rect x="190" y="153" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="195" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="209" text-anchor="start" class="f-mono f-muted" style="font-size:9px">prefix + flag + MALLOC_</text>
  <rect x="190" y="184" width="258.9" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="454.8666666666667" y="201" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3530 MB</text>
  <rect x="190" y="191" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="233" text-anchor="start" class="f-ink" style="font-size:12px">Neo 1.3B</text>
  <rect x="190" y="222" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="567.58" y="239" text-anchor="start" class="f-mono f-accent" style="font-size:11px">killed (137)</text>
  <rect x="190" y="229" width="371.6" height="12" rx="1" class="f-box"/>
  <line x1="490.37333333333333" y1="26" x2="490.37333333333333" y2="262" class="f-line" style="stroke:var(--accent);stroke-dasharray:4 3"/>
  <text x="490.37333333333333" y="292" text-anchor="middle" class="f-accent f-mono" style="font-size:10px">4096 MB limit</text>
  <line x1="190" y1="262" x2="630" y2="262" class="f-line"/>
  <line x1="190" y1="262" x2="190" y2="266" class="f-line"/>
  <text x="190" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">0</text>
  <line x1="263.3333333333333" y1="262" x2="263.3333333333333" y2="266" class="f-line"/>
  <text x="263.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">1000</text>
  <line x1="336.66666666666663" y1="262" x2="336.66666666666663" y2="266" class="f-line"/>
  <text x="336.66666666666663" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">2000</text>
  <line x1="410" y1="262" x2="410" y2="266" class="f-line"/>
  <text x="410" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">3000</text>
  <line x1="483.3333333333333" y1="262" x2="483.3333333333333" y2="266" class="f-line"/>
  <text x="483.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">4000</text>
  <line x1="556.6666666666667" y1="262" x2="556.6666666666667" y2="266" class="f-line"/>
  <text x="556.6666666666667" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">5000</text>
  <line x1="630" y1="262" x2="630" y2="266" class="f-line"/>
  <text x="630" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">6000</text>
</svg>
<figcaption>Peak memory of from_pretrained in transformers 4.12.2, torch 1.10.0, fp32, one run each. The default loader holds the file and the model at the same time. GPT-2 large fits only after the names in its file got the transformer. prefix, low_cpu_mem_usage=True and MALLOC_MMAP_THRESHOLD_=131072.</figcaption>
</figure>

GPT-2 small and Neo 125M load in about 2 seconds and write about 30 tokens per second. GPT-2 medium with 355M parameters loads in 5 seconds and writes 10 to 12 tokens per second, depending on the run. Up to here everything was as I expected.

Then GPT-2 large, 774M. The file is 3097 MB and the limit is 4096 MB, so by my arithmetic it fits. The process was killed during the load. Neo 1.3B with a file of 5067 MB was killed too, but there the arithmetic said so in advance.

To see why, I recorded the memory of one load every 10 ms. For GPT-2 medium `from_pretrained` first reads the whole file with `torch.load`, which gives 1450 MB of tensors. Then it builds the model with its own 1450 MB and copies the weights in. The peak was 3237 MB, 2.2 times the file. By the same ratio GPT-2 large would need about 7 GB for a few seconds, this I did not measure. So my arithmetic was off by more than 2 times.

## The flag that loads nothing

For exactly this case transformers has a flag since version 4.11, `low_cpu_mem_usage=True`. The docstring says it tries to use not more than 1x model size in CPU memory and calls it experimental. With it GPT-2 large was killed again. GPT-2 small and medium loaded and the medium one continued my prompt about an invoice like this:

```
 that that that that that that that that that that that that that that that
```

There was no error and no warning. On LAMBADA GPT-2 small with this flag got 0 of 100 passages, without it 31 of 100 on the same passages. The reason is in the names of the weights. In the files from OpenAI they are stored without a prefix, `wte.weight`, `h.0.attn.c_attn.weight`. The normal loader notices this and puts them into the `transformer` part of the model. The new path looks for every name on the model as it is, does not find `wte` there and skips it without a word. So the model runs on the random weights it was created with. The Neo files have the prefix and with them the flag works.

I loaded the GPT-2 large file once, added `transformer.` to every name and saved it again. Loading this copy with the flag still went over 4096 MB. This one took me longer to understand. With the flag the loader reads the file 2 times, first a full read only to take the names and then a read for the weights. The trace showed that after the first read was deleted only about 250 of its 3100 MB went back to the system. The second read was allocated on top of the rest. I set `MALLOC_MMAP_THRESHOLD_=131072`, which tells glibc to give every big block its own mapping. By default glibc raises this threshold by itself when big blocks are freed, it is described in `man mallopt`. That this is what happened here is my guess, I see it only through RSS. With the variable the peak was 3530 MB, 1.14 times the file. GPT-2 large finally loaded in 15 seconds and writes 6.1 tokens per second.

## Fewer bytes did not help

The next thing to try is half precision, 2 bytes per parameter. On this CPU torch 1.10 runs bfloat16, but GPT-2 small then writes 1.5 tokens per second instead of 30. float16 does not run at all, the first step fails with `"LayerNormKernelImpl" not implemented for 'Half'`. And with `low_cpu_mem_usage` the dtype I ask for is ignored, the weights stay float32 as they are in the file. So on this CPU I stay with float32.

## Against the cloud

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="LAMBADA accuracy. GPT-2 small 29.2% (on my machine, 500 passages); Neo 125M 34.6% (on my machine, 500 passages); GPT-2 medium 43.2% (on my machine, 500 passages); GPT-2 large 47.6% (on my machine, 500 passages); ada 51.6%; babbage 62.4%; curie 69.3%; davinci 75%; Neo 1.3B 57.2% (did not load).">
  <text x="40" y="18" text-anchor="start" class="f-label f-ink" style="font-size:11px">on my machine, 500 passages</text>
  <text x="40" y="246" text-anchor="start" class="f-label f-ink" style="font-size:11px">API and Neo 1.3B, EleutherAI table, 5153 passages</text>
  <line x1="40" y1="120" x2="640" y2="120" class="f-line"/>
  <line x1="40.0" y1="117" x2="40.0" y2="123" class="f-line"/>
  <text x="40.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="140.0" y1="117" x2="140.0" y2="123" class="f-line"/>
  <text x="140.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">30%</text>
  <line x1="240.0" y1="117" x2="240.0" y2="123" class="f-line"/>
  <text x="240.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="340.0" y1="117" x2="340.0" y2="123" class="f-line"/>
  <text x="340.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">50%</text>
  <line x1="440.0" y1="117" x2="440.0" y2="123" class="f-line"/>
  <text x="440.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="540.0" y1="117" x2="540.0" y2="123" class="f-line"/>
  <text x="540.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">70%</text>
  <line x1="640.0" y1="117" x2="640.0" y2="123" class="f-line"/>
  <text x="640.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <line x1="132.0" y1="46" x2="132.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="132.0" cy="120" r="5" class="f-box"/>
  <text x="132.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 small 29.2%</text>
  <line x1="186.0" y1="72" x2="186.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="186.0" cy="120" r="5" class="f-box"/>
  <text x="186.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Neo 125M 34.6%</text>
  <line x1="272.0" y1="46" x2="272.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="272.0" cy="120" r="5" class="f-box"/>
  <text x="272.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 medium 43.2%</text>
  <line x1="316.0" y1="72" x2="316.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="316.0" cy="120" r="5" class="f-box"/>
  <text x="316.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 large 47.6%</text>
  <line x1="356.0" y1="142" x2="356.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="351.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="356.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">ada 51.6%</text>
  <line x1="412.0" y1="142" x2="412.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="407.0" y="115" width="10" height="10" class="f-plain" style="stroke:var(--muted)"/>
  <text x="412.0" y="194" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Neo 1.3B 57.2%</text>
  <text x="412.0" y="207" text-anchor="middle" class="f-muted" style="font-size:9px">did not load</text>
  <line x1="464.0" y1="142" x2="464.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="459.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="464.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">babbage 62.4%</text>
  <line x1="533.0" y1="142" x2="533.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="528.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="533.0" y="194" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">curie 69.3%</text>
  <line x1="590.0" y1="142" x2="590.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="585.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="590.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">davinci 75%</text>
</svg>
<figcaption>LAMBADA, last word guessed exactly, counted like the EleutherAI harness. My numbers are on 500 random passages, which are 2.8 points harder than the full set. The API numbers are from the README of GPT-J (EleutherAI, September 2021), all 5153 passages.</figcaption>
</figure>

GPT-2 large, the biggest model I got into 4 GB, scores 47.6% on my 500 passages. If the 2.8 points by which my sample is harder carry over to this model, it is about 50%. In the table of EleutherAI ada through the API has 51.6% and davinci 75%, babbage and curie are between them. Neo 1.3B, which did not load, has 57.2% there. GPT-2 1.5B, which I did not even try, has 51.21%.

So after 2 workarounds the best my machine runs is about at the level of the cheapest API model. Davinci is about 25 points above it. 6 tokens per second is slow, but I can work with it. What stopped me was memory, most of all the memory the loader takes on top of the weights.

## What I did not check

Int8 quantization. torch has `quantize_dynamic` for `nn.Linear`, but GPT-2 is built from its own `Conv1D` modules and only the output layer gets converted. For Neo it would work, but I did not measure it. I did not try a machine with 16 GB, GPT-J, a GPU or ONNX. Latency of the API I cannot measure while it has a waitlist. LAMBADA is 1 task and 500 passages give about 4 points of error in both directions. The speed is 1 run of 3 repeats on a machine where other services also work. EleutherAI themselves write under their table that because of differences in implementation the numbers "might not be directly comparable".
