---
title: "I quantized BERT to int8 with one line and the file got 2.45 times smaller"
description: "I ran the one line dynamic int8 quantization of PyTorch 1.3 on a fine tuned BERT for MRPC. The file went from 433 MB to 177 MB, not 110, because the embeddings stay in float32. Accuracy fell by 6 pairs of 408 and 11 of 12 changed answers moved to paraphrase. On 1 thread int8 was almost 2 times faster, on 4 threads slower."
date: 2019-10-19
lang: en
translationKey: bert-int8-mrpc
tags: ["machine-learning", "performance", "numbers"]
---
PyTorch 1.3 came out on October 10 and quantization is in it, marked experimental. The simplest part is dynamic quantization: you call `torch.quantization.quantize_dynamic` on a trained model and every `nn.Linear` gets its weights stored as 8 bit integers. The activations are converted on the fly during inference.

I have repeated the usual summary of int8 many times myself. 4 bytes become 1, so the model is 4 times smaller and the accuracy loss is small enough to ignore. I never measured it on a model I could actually use. A few days ago Zafrir and colleagues from Intel AI Lab posted Q8BERT. Their main result is BERT trained with quantization in mind. Their table also has a post training row, their own dynamic quantization with the embeddings quantized too. On MRPC it takes F1 from 90.0 to 87.9, clearly worse than the 89.6 they get with training, but that is their implementation and I wanted to know what the PyTorch line gives on a ready model and where the bytes go.

## The setup

The model is `bert-base-cased-finetuned-mrpc`, the ready fine tuned BERT base that transformers 2.1.1 ships for MRPC. The task: 2 sentences, are they a paraphrase or not. MRPC has 408 pairs in its dev set. Python 3.7, PyTorch 1.3.0 CPU build, 4 vCPU of an AMD EPYC, 8 GB of memory. I ran every pair separately, batch 1, as a service would.

```python
q = torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)
```

The default config in 1.3 keeps each weight matrix with 1 scale for the whole tensor. The largest absolute weight maps to about 127 and the rest is rounded to the nearest step.

## The size

The original file is 433 MB. I expected something around 110. The saved state dict of the quantized model is 177 MB. That is 2.45 times smaller.

My 110 was just 433 divided by 4, so I counted the parameters by group. BERT base cased has 108.3 million parameters. 85.5 million of them are weights of the 74 `Linear` layers. Those really went from 4 bytes to 1. But 22.7 million are embeddings, mostly the word embedding table of 28996 tokens by 768. There is no quantized embedding in 1.3 and the call only swaps `Linear`, so the embeddings stay in float32 and take 90.7 MB. That is 51% of the quantized file.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Two stacked bars of file size. Float32: 433 MB, of which Linear weights 342.1 MB and embeddings 90.7 MB. Int8: 177 MB, of which Linear weights 85.5 MB and the same 90.7 MB of float32 embeddings, 51% of the file.">
  <text x="98.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">float32</text>
  <rect x="110" y="26" width="371.1" height="34" class="f-box"/>
  <text x="295.5" y="47.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">342.1</text>
  <rect x="481.1" y="26" width="98.3" height="34" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="530.3" y="47.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90.7</text>
  <text x="588.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">433 MB</text>
  <text x="98.0" y="117.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">int8</text>
  <rect x="110" y="96" width="92.8" height="34" class="f-box"/>
  <text x="156.4" y="117.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">85.5</text>
  <rect x="202.8" y="96" width="98.3" height="34" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="251.9" y="117.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90.7</text>
  <text x="309.7" y="117.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">177 MB</text>
  <rect x="110" y="170" width="12" height="12" class="f-box"/>
  <text x="128.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">Linear weights</text>
  <rect x="310" y="170" width="12" height="12" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="328.0" y="180.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">embeddings, float32</text>
</svg>
<figcaption>State dict of the BERT model for MRPC before and after quantize_dynamic in PyTorch 1.3.0. Only the Linear part shrinks 4 times.</figcaption>
</figure>

## The accuracy

The float model gets 345 of 408 pairs right, 84.6% accuracy and F1 89.4. After quantization it gets 339, 83.1% and F1 88.6. 12 answers changed. 9 correct answers became wrong and 3 wrong ones became correct.

A net loss of 6 pairs out of 408 is not much to build a conclusion on. A sign test on 9 against 3 gives p about 0.15, it could be chance. The direction is another matter. 11 of the 12 changed answers moved to "paraphrase". Over all 408 pairs the gap between the 2 logits moved toward "paraphrase" in 74% of cases. If a decision threshold was tuned on the float model, this shift pushes some answers across it.

## Where it breaks

Then I simulated lower precision. I rounded the weights of all `Linear` layers to fewer bits, from 8 down to 2. The activations stayed in float. This is a simulation of accuracy only, the memory does not change.

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Correct answers out of 408 against the number of bits of the Linear weights. One scale per tensor: 8: 342, 6: 316, 5: 129, 4: 279, 3: 135, 2: 279. One scale per row: 8: 345, 6: 345, 5: 344, 4: 338, 3: 317, 2: 129. Float model 345, always &quot;paraphrase&quot; 279, real int8 model 339.">
  <line x1="100" y1="230" x2="410" y2="230" class="f-plain"/>
  <text x="92.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="100" y1="189.6153846153846" x2="410" y2="189.6153846153846" class="f-plain"/>
  <text x="92.0" y="193.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <line x1="100" y1="149.23076923076923" x2="410" y2="149.23076923076923" class="f-plain"/>
  <text x="92.0" y="153.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="100" y1="108.84615384615385" x2="410" y2="108.84615384615385" class="f-plain"/>
  <text x="92.0" y="112.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">250</text>
  <line x1="100" y1="68.46153846153845" x2="410" y2="68.46153846153845" class="f-plain"/>
  <text x="92.0" y="72.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="100" y1="28.076923076923066" x2="410" y2="28.076923076923066" class="f-plain"/>
  <text x="92.0" y="32.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">350</text>
  <text x="100.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="203.3" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="255.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="306.7" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="358.3" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <text x="410.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="255.0" y="264.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">bits per weight</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">correct of 408</text>
  <line x1="100" y1="32.1" x2="410" y2="32.1" style="stroke:var(--muted);"/>
  <text x="418.0" y="36.1" text-anchor="start" class="f-mono f-muted" style="font-size:11px">float 345</text>
  <line x1="100" y1="85.4" x2="410" y2="85.4" style="stroke:var(--muted);stroke-dasharray:3 3"/>
  <text x="418.0" y="89.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">always &quot;paraphrase&quot; 279</text>
  <polyline points="100.0,34.5 203.3,55.5 255.0,206.6 306.7,85.4 358.3,201.7 410.0,85.4" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="100.0" cy="34.5" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="203.3" cy="55.5" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="255.0" cy="206.6" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="306.7" cy="85.4" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="358.3" cy="201.7" r="3.5" class="f-ink" style="stroke:none"/>
  <circle cx="410.0" cy="85.4" r="3.5" class="f-ink" style="stroke:none"/>
  <polyline points="100.0,32.1 203.3,32.1 255.0,32.9 306.7,37.8 358.3,54.7 410.0,206.6" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="100.0" cy="32.1" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="203.3" cy="32.1" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="255.0" cy="32.9" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="306.7" cy="37.8" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="358.3" cy="54.7" r="3.5" class="f-accent" style="stroke:none"/>
  <circle cx="410.0" cy="206.6" r="3.5" class="f-accent" style="stroke:none"/>
  <rect x="96.0" y="33.0" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="110.0" y="55.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">real int8 339</text>
  <line x1="100" y1="284" x2="122" y2="284" style="stroke:var(--ink);stroke-width:1.6"/>
  <text x="128.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 scale per tensor</text>
  <line x1="330" y1="284" x2="352" y2="284" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="358.0" y="288.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">1 scale per row</text>
</svg>
<figcaption>Simulated rounding of Linear weights only, activations in float. At 279 the model answers &quot;paraphrase&quot; to every pair, near 130 &quot;not paraphrase&quot; to almost every pair.</figcaption>
</figure>

With 1 scale per tensor, 8 bits cost 3 pairs. The real int8 model loses 6. I assume the other 3 come from what I did not simulate, the activations rounded on the fly and the integer kernel itself. At 6 bits the model loses 29 pairs. At 5 bits it answers "not paraphrase" to everything, at 4 bits "paraphrase" to everything.

Then I gave every row of every matrix its own scale. 8 and 6 bits gave 345, the same count as float. 5 bits lost 1 pair, 4 bits lost 7, about as much as the real int8 model.

The reason is in a few matrices. Take the 12 feed forward output layers, the ones that go from 3072 back to 768. In each of them the largest weight is 10 to 32 times bigger than a typical row maximum. In layer 8 it is 4.60 against 0.14. That one number sets the scale for the whole matrix and 41% of its weights round to 0 at 8 bits. In every other layer of the model the ratio is below 7.

<figure class="fig">
<svg viewBox="0 0 680 254" role="img" aria-label="Ratio of the largest weight to the median row maximum for each of the 74 Linear layers. The 12 feed forward output layers are highlighted: 9.9, 11.4, 15.4, 18.3, 18.3, 20.5, 24.8, 24.9, 26.6, 27.1, 27.5, 32.1. All other layers are below 6.8.">
  <line x1="60" y1="200" x2="660" y2="200" class="f-plain"/>
  <text x="52.0" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="148" x2="660" y2="148" class="f-plain"/>
  <text x="52.0" y="152.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="60" y1="96" x2="660" y2="96" class="f-plain"/>
  <text x="52.0" y="100.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="44" x2="660" y2="44" class="f-plain"/>
  <text x="52.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <rect x="61.0" y="187.5" width="6.1" height="12.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="69.1" y="174.6" width="6.1" height="25.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="77.2" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="85.3" y="166.2" width="6.1" height="33.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="93.4" y="183.8" width="6.1" height="16.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="101.5" y="140.9" width="6.1" height="59.1" style="fill:var(--accent);stroke:none"/>
  <rect x="109.6" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="117.8" y="187.6" width="6.1" height="12.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="125.9" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="134.0" y="177.9" width="6.1" height="22.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="142.1" y="185.2" width="6.1" height="14.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="150.2" y="119.8" width="6.1" height="80.2" style="fill:var(--accent);stroke:none"/>
  <rect x="158.3" y="180.9" width="6.1" height="19.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="166.4" y="177.7" width="6.1" height="22.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="174.5" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="182.6" y="188.5" width="6.1" height="11.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="190.7" y="183.4" width="6.1" height="16.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="198.8" y="104.6" width="6.1" height="95.4" style="fill:var(--accent);stroke:none"/>
  <rect x="206.9" y="181.3" width="6.1" height="18.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="215.1" y="179.9" width="6.1" height="20.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="223.2" y="189.4" width="6.1" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="231.3" y="185.1" width="6.1" height="14.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="239.4" y="181.5" width="6.1" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="247.5" y="70.4" width="6.1" height="129.6" style="fill:var(--accent);stroke:none"/>
  <rect x="255.6" y="190.1" width="6.1" height="9.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="263.7" y="187.9" width="6.1" height="12.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="271.8" y="182.3" width="6.1" height="17.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="279.9" y="179.2" width="6.1" height="20.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="288.0" y="182.5" width="6.1" height="17.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="296.1" y="59.2" width="6.1" height="140.8" style="fill:var(--accent);stroke:none"/>
  <rect x="304.2" y="189.6" width="6.1" height="10.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="312.4" y="188.6" width="6.1" height="11.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="320.5" y="191.5" width="6.1" height="8.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="328.6" y="189.4" width="6.1" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="336.7" y="181.5" width="6.1" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="344.8" y="61.7" width="6.1" height="138.3" style="fill:var(--accent);stroke:none"/>
  <rect x="352.9" y="190.6" width="6.1" height="9.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="361.0" y="189.3" width="6.1" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="369.1" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="377.2" y="184.0" width="6.1" height="16.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="385.3" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="393.4" y="93.4" width="6.1" height="106.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.5" y="189.3" width="6.1" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="409.6" y="187.7" width="6.1" height="12.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="417.8" y="192.3" width="6.1" height="7.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="425.9" y="185.6" width="6.1" height="14.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="434.0" y="181.9" width="6.1" height="18.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="442.1" y="104.7" width="6.1" height="95.3" style="fill:var(--accent);stroke:none"/>
  <rect x="450.2" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="458.3" y="189.8" width="6.1" height="10.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="466.4" y="191.1" width="6.1" height="8.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="474.5" y="185.8" width="6.1" height="14.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="482.6" y="171.3" width="6.1" height="28.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="490.7" y="33.3" width="6.1" height="166.7" style="fill:var(--accent);stroke:none"/>
  <text x="494.8" y="27.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">32</text>
  <rect x="498.8" y="192.3" width="6.1" height="7.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="506.9" y="190.3" width="6.1" height="9.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="515.1" y="191.8" width="6.1" height="8.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="523.2" y="173.3" width="6.1" height="26.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="531.3" y="164.5" width="6.1" height="35.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="539.4" y="56.8" width="6.1" height="143.2" style="fill:var(--accent);stroke:none"/>
  <rect x="547.5" y="190.7" width="6.1" height="9.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="555.6" y="191.9" width="6.1" height="8.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="563.7" y="189.8" width="6.1" height="10.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="571.8" y="180.6" width="6.1" height="19.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="579.9" y="180.8" width="6.1" height="19.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="588.0" y="71.3" width="6.1" height="128.7" style="fill:var(--accent);stroke:none"/>
  <rect x="596.1" y="190.1" width="6.1" height="9.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="604.2" y="186.2" width="6.1" height="13.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612.4" y="191.3" width="6.1" height="8.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="620.5" y="182.3" width="6.1" height="17.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="628.6" y="186.6" width="6.1" height="13.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636.7" y="148.4" width="6.1" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="644.8" y="188.4" width="6.1" height="11.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="652.9" y="194.8" width="6.1" height="5.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="60.0" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 0</text>
  <text x="157.3" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 2</text>
  <text x="254.6" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 4</text>
  <text x="351.9" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 6</text>
  <text x="449.2" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 8</text>
  <text x="546.5" y="216.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">layer 10</text>
  <text x="52.0" y="12.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">max weight / median row max</text>
  <rect x="60" y="230" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">feed forward output, 3072 to 768</text>
  <rect x="360" y="230" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="378.0" y="240.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">other Linear layers</text>
</svg>
<figcaption>Layer 8 output: the largest weight is 4.60, a typical row maximum 0.14. With 1 scale for the matrix, 41% of its weights round to 0 at 8 bits.</figcaption>
</figure>

The obvious fix is to leave these 12 layers in float. I tried it. The file grows to 262 MB and the model gets 340 pairs instead of 339, so 85 MB more for 1 pair. I would not pay that.

`quantize_dynamic` in 1.3 has no option for per row scales, but the kernel accepts them if the weights are built by hand with `torch.quantize_per_channel`. I expected to get the 345 from the simulation. The model answered "paraphrase" to all 408 pairs. With the range cut to 7 bits it gave 339 again, exactly as the default. I suspect an overflow inside the integer kernel when every row uses its full range, but I did not dig into it.

## The speed

I expected int8 to be faster. The first full pass over the dev set said the opposite: 33 seconds for int8 against 27 for float, on 4 threads.

For timing I took the first 200 pairs to keep the runs short. With the median of 3 runs the int8 model takes 80 ms per pair on 1 thread against 151 ms for float. That is almost 2 times faster. With 4 threads float takes 60 ms and int8 still 80. I checked a single layer. The int8 `Linear` takes 1.7 ms with 1, 2 or 4 threads, the float one goes from 3.3 to 1.0 ms. In the 1.3.0 source the dynamic int8 `Linear` calls fbgemm with 1 thread, so on 4 cores the quantized model is slower.

The float numbers have their own catch. MKL inside this PyTorch picks its code path by the processor. On this AMD processor the default path is slow. Float then takes 433 ms per pair on 1 thread and int8 looks 5 times faster. I forced MKL to the fast path and all float numbers above are with it. The quantized `Linear` runs on fbgemm, so the int8 model barely notices: 84 ms against 80. On AMD I would not trust an int8 speedup in 1.3 without checking which MKL path the float side took.

## What I did not check

1 model and 1 small task. MRPC with 408 pairs is a noisy test. I did not measure the memory of a running process, only the saved weights. A model with a smaller vocabulary or with quantized embeddings, as in Q8BERT, will be closer to 4 times. I did not try static quantization or training with quantization.

For now I would use the one line for a single threaded service where memory matters, but I would check the decision threshold again on the quantized model before trusting it.
