---
title: "My January and December venvs gave GPT-2 the same 20,000 tokens. The logits changed in between"
description: "I rebuilt my January 2022 venv (torch 1.10.1, transformers 4.15.0) next to the December one (torch 1.13.1, transformers 4.25.1) and ran GPT-2 on the same prompts. Greedy, generate() and seeded sampling gave the same text, 200 of 200 openings over 20,000 steps. The logits moved by up to 0.000107, all in one step between torch 1.11.0 and 1.12.1: a new AVX2 fold in reduce_all changed the order softmax adds its 8 lanes."
date: 2022-12-19
lang: en
translationKey: same-prompt-new-pip
tags: ["llm", "numbers", "reliability"]
---
Sampling off or a fixed seed should give the same answer to the same prompt. That is how I have treated it all year, without checking. When a local generation did not match something I had saved earlier, I said "sampling" and ran it again, without asking if maybe something under the model had changed instead. On my machine something does change every few weeks, because I run `pip install -U` whenever a new transformers release has a fix I want. There was no single broken output that sent me to look. It was the end of the year and I wanted to know what a year of these upgrades did.

I did not keep my January outputs, so I rebuilt the January venv from what was current then. That is torch 1.10.1 from 15 December 2021 and transformers 4.15.0 from 22 December 2021. The December venv is torch 1.13.1, released last Thursday, with transformers 4.25.1. Python 3.9 in both, CPU only, float32, 4 cores of a virtual machine on an AMD EPYC 7713. The weights are GPT-2 small, 124M parameters, the same `pytorch_model.bin` file for every run.

## The text did not move

I used 8 prompts, from "The capital of France is" to "Q: What is 17 times 23?", with 60 new tokens each. Every prompt ran greedy in my own argmax loop, greedy through `generate()` and with sampling (top_k 50, `torch.manual_seed(1234)` before each prompt). I expected sampling to break first, because it depends on the whole distribution and not only on which token is on top.

Nothing broke. January and December gave the same tokens for all 8 prompts in every mode, sampling included. To the arithmetic question GPT-2 answers " 17 times 23." and then asks the question again, in a loop, in both venvs.

The logits did change. A repeated run in the same venv gave the same bits. December against January differs in 6 of 8 prompts, by at most 0.000107 on the first step.

Then I swapped one package at a time. transformers from 4.15.0 to 4.25.1 under the same torch changed zero bits. It did change the GPT-2 attention code in between, the mask value and how the scale is divided, but neither change moved a bit here. torch 1.11.0 gives exactly the bits of 1.10.1 and 1.12.1 gives exactly the bits of 1.13.1. I did not try 1.12.0, so the whole year of my venv sits somewhere between 1.11.0 and 1.12.1.

<figure class="fig">
<svg viewBox="0 0 640 294" role="img" aria-label="Table of conditions compared with the January venv. Running again keeps all 8 prompts identical bit for bit. torch 1.11.0 does too. From torch 1.12.1 on, 6 of 8 prompts differ by up to 0.000107. Generic kernels change all 8. The generated text is the same in every row: 24 of 24.">
  <text x="12" y="18" class="f-label f-muted">against the January venv: torch 1.10.1, transformers 4.15.0</text>
  <text x="12" y="40" class="f-label f-muted">condition</text>
  <text x="296" y="40" class="f-label f-muted">logits, 8 prompts</text>
  <text x="452" y="40" class="f-label f-muted">max shift</text>
  <text x="566" y="40" class="f-label f-muted">text</text>
  <text x="12" y="63" class="f-mono f-ink" style="font-size:11px">January, run again</text>
  <rect x="296" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="350" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="386" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="404" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="52" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="63" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="566" y="63" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="89" class="f-mono f-ink" style="font-size:11px">January, 1 thread</text>
  <rect x="296" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="78" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="78" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="89" class="f-mono f-accent" style="font-size:12px">0.000023</text>
  <text x="566" y="89" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="115" class="f-mono f-ink" style="font-size:11px">January, generic kernels</text>
  <rect x="296" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="314" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="332" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="104" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="104" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="115" class="f-mono f-accent" style="font-size:12px">0.000061</text>
  <text x="566" y="115" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <line x1="12" y1="124" x2="628" y2="124" class="f-plain"/>
  <text x="12" y="141" class="f-mono f-ink" style="font-size:11px">torch 1.11.0</text>
  <rect x="296" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="350" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="368" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="386" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="404" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="422" y="130" width="14" height="14" rx="2" class="f-plain"/>
  <text x="452" y="141" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="566" y="141" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="167" class="f-mono f-ink" style="font-size:11px">torch 1.12.1</text>
  <rect x="296" y="156" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="156" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="156" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="156" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="167" class="f-mono f-accent" style="font-size:12px">0.000107</text>
  <text x="566" y="167" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="193" class="f-mono f-ink" style="font-size:11px">torch 1.13.1, transformers 4.15 to 4.22</text>
  <rect x="296" y="182" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="182" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="182" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="182" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="193" class="f-mono f-accent" style="font-size:12px">0.000107</text>
  <text x="566" y="193" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <line x1="12" y1="202" x2="628" y2="202" class="f-plain"/>
  <text x="12" y="219" class="f-mono f-ink" style="font-size:11px">December: 1.13.1 and 4.25.1</text>
  <rect x="296" y="208" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="314" y="208" width="14" height="14" rx="2" class="f-plain"/>
  <rect x="332" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="208" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="208" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="219" class="f-mono f-accent" style="font-size:12px">0.000107</text>
  <text x="566" y="219" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <text x="12" y="245" class="f-mono f-ink" style="font-size:11px">December, generic kernels</text>
  <rect x="296" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="314" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="332" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="350" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="368" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="386" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="404" y="234" width="14" height="14" rx="2" class="f-box"/>
  <rect x="422" y="234" width="14" height="14" rx="2" class="f-box"/>
  <text x="452" y="245" class="f-mono f-accent" style="font-size:12px">0.000061</text>
  <text x="566" y="245" class="f-mono f-ink" style="font-size:12px">24/24</text>
  <rect x="300" y="268" width="14" height="14" rx="2" class="f-plain"/><text x="320" y="279" class="f-label f-muted">same bits</text>
  <rect x="420" y="268" width="14" height="14" rx="2" class="f-box"/><text x="440" y="279" class="f-label f-muted">bits differ</text>
</svg>
<figcaption>Logits of the first step, compared bit for bit. Text: 8 prompts times 3 modes (greedy loop, generate, seeded sampling).</figcaption>
</figure>

## Where the step is

2 prompts kept their bits even across that step and I could not see why. I spent some time on MKL first. With `MKL_VERBOSE=1` torch shows MKL 2020.0 doing the `SGEMM` calls, so MKL does run the matrix multiplications. But setting `MKL_ENABLE_INSTRUCTIONS=SSE4_2` changed nothing at all, not one bit in either venv and I still do not know why.

Then I tried `ATEN_CPU_CAPABILITY=default`, which makes torch use its generic kernels instead of the AVX2 ones, like on an older CPU. The logits moved by up to 0.000122 against the normal December run. January and December became identical bit for bit. The change was inside some AVX2 kernel.

I dumped every layer on the prompt with the biggest change, the arithmetic one, 11 tokens. Embeddings and the first layer norm are the same. The first difference is the output of attention in block 0, 0.0000019, which grows to 0.00032 by the last block. Then I ran each operation alone on a fixed random input. Only softmax differs.

The 2 prompts that kept their bits have 5 and 7 tokens. All the others have 8 or more. I ran softmax on rows of every length from 1 to 64. Lengths 1 to 7 give the same bits in both versions. From 8 on, every length has rows that differ, except 23, which I think is luck.

8 floats is one AVX2 register. The diff of `aten/src/ATen/cpu/vec/functional_base.h` between the 2 tags shows the rest. Softmax sums the exponents with `reduce_all`, which keeps 8 partial sums in the register lanes and at the end folds them into one number. In 1.11.0 this fold goes lane after lane: lane 1 is added to lane 0, then lane 2 and so on up to lane 7. 1.12.1 added a faster fold for AVX2:

```cpp
// 128-bit shuffle
Vec v1 = _mm256_permute2f128_ps(v, v, 0x1);
v = vec_fun(v, v1);
// 64-bit shuffle
v1 = _mm256_shuffle_ps(v, v, 0x4E);
v = vec_fun(v, v1);
// 32-bit shuffle
v1 = _mm256_shuffle_ps(v, v, 0xB1);
v = vec_fun(v, v1);
```

It adds lanes 4 apart, then 2 apart, then neighbours. The numbers are the same but the order of additions is different and in float that can change the last bit. Rows shorter than one register never reach the new code. The generic kernels do not have it at all. Neither do builds made with MSVC, because the new fold sits under a GCC check, so on Windows this step probably does not exist.

<figure class="fig">
<svg viewBox="0 0 640 284" role="img" aria-label="Two ways to fold the 8 lanes of an AVX2 register into one sum. torch 1.11.0 adds them one after another, torch 1.12.1 adds lanes 4 apart, then 2 apart, then neighbours. Below, softmax on rows of length 1 to 64: lengths 1 to 7 give the same bits in both versions, from 8 on all differ except 23.">
  <text x="12" y="18" class="f-label f-muted">torch 1.11.0: lane after lane</text>
  <rect x="16" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="29" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a0</text>
  <rect x="50" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="63" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a1</text>
  <rect x="84" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="97" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a2</text>
  <rect x="118" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="131" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a3</text>
  <rect x="152" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="165" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a4</text>
  <rect x="186" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="199" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a5</text>
  <rect x="220" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="233" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a6</text>
  <rect x="254" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="267" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a7</text>
  <line x1="29" y1="52" x2="63" y2="63" class="f-line"/>
  <line x1="63" y1="52" x2="63" y2="63" class="f-line"/>
  <circle cx="63" cy="70" r="7" class="f-plain"/><text x="63" y="74" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="63" y1="77" x2="97" y2="81" class="f-line"/>
  <line x1="97" y1="52" x2="97" y2="81" class="f-line"/>
  <circle cx="97" cy="88" r="7" class="f-plain"/><text x="97" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="97" y1="95" x2="131" y2="99" class="f-line"/>
  <line x1="131" y1="52" x2="131" y2="99" class="f-line"/>
  <circle cx="131" cy="106" r="7" class="f-plain"/><text x="131" y="110" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="131" y1="113" x2="165" y2="117" class="f-line"/>
  <line x1="165" y1="52" x2="165" y2="117" class="f-line"/>
  <circle cx="165" cy="124" r="7" class="f-plain"/><text x="165" y="128" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="165" y1="131" x2="199" y2="135" class="f-line"/>
  <line x1="199" y1="52" x2="199" y2="135" class="f-line"/>
  <circle cx="199" cy="142" r="7" class="f-plain"/><text x="199" y="146" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="199" y1="149" x2="233" y2="153" class="f-line"/>
  <line x1="233" y1="52" x2="233" y2="153" class="f-line"/>
  <circle cx="233" cy="160" r="7" class="f-plain"/><text x="233" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="233" y1="167" x2="267" y2="171" class="f-line"/>
  <line x1="267" y1="52" x2="267" y2="171" class="f-line"/>
  <circle cx="267" cy="178" r="7" class="f-plain"/><text x="267" y="182" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <text x="336" y="18" class="f-label f-muted">1.12.1 with AVX2: 4, 2, 1 apart</text>
  <rect x="336" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="349" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a0</text>
  <rect x="370" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="383" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a1</text>
  <rect x="404" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="417" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a2</text>
  <rect x="438" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="451" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a3</text>
  <rect x="472" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="485" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a4</text>
  <rect x="506" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="519" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a5</text>
  <rect x="540" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="553" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a6</text>
  <rect x="574" y="30" width="26" height="22" rx="3" class="f-box"/>
  <text x="587" y="45" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">a7</text>
  <line x1="349" y1="52" x2="408" y2="81" class="f-line"/>
  <line x1="485" y1="52" x2="408" y2="81" class="f-line"/>
  <circle cx="408" cy="88" r="7" class="f-plain"/><text x="408" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="383" y1="52" x2="448" y2="81" class="f-line"/>
  <line x1="519" y1="52" x2="448" y2="81" class="f-line"/>
  <circle cx="448" cy="88" r="7" class="f-plain"/><text x="448" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="417" y1="52" x2="488" y2="81" class="f-line"/>
  <line x1="553" y1="52" x2="488" y2="81" class="f-line"/>
  <circle cx="488" cy="88" r="7" class="f-plain"/><text x="488" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="451" y1="52" x2="528" y2="81" class="f-line"/>
  <line x1="587" y1="52" x2="528" y2="81" class="f-line"/>
  <circle cx="528" cy="88" r="7" class="f-plain"/><text x="528" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="408" y1="95" x2="448" y2="115" class="f-line"/>
  <line x1="488" y1="95" x2="448" y2="115" class="f-line"/>
  <circle cx="448" cy="122" r="7" class="f-plain"/><text x="448" y="126" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="448" y1="95" x2="488" y2="115" class="f-line"/>
  <line x1="528" y1="95" x2="488" y2="115" class="f-line"/>
  <circle cx="488" cy="122" r="7" class="f-plain"/><text x="488" y="126" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <line x1="448" y1="129" x2="468" y2="149" class="f-line"/>
  <line x1="488" y1="129" x2="468" y2="149" class="f-line"/>
  <circle cx="468" cy="156" r="7" class="f-plain"/><text x="468" y="160" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+</text>
  <text x="12" y="214" class="f-label f-muted">softmax rows of length 1 to 64, 1.11.0 against 1.12.1</text>
  <rect x="12.0" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <text x="16.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <rect x="21.6" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="31.2" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="40.8" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="50.4" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="60.0" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="69.6" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <rect x="79.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <text x="83.2" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8</text>
  <rect x="88.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="98.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="108.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="117.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="127.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="136.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="146.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="156.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="165.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="175.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="184.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="194.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="204.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="213.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="223.2" y="222" width="8" height="16" rx="1" class="f-plain"/>
  <text x="227.2" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23</text>
  <rect x="232.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="242.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="252.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="261.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="271.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="280.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="290.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="300.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="309.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="319.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="328.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="338.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="348.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="357.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="367.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="376.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="386.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="396.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="405.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="415.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="424.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="434.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="444.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="453.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="463.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="472.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="482.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="492.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="501.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="511.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="520.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="530.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="540.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="549.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="559.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="568.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="578.4" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="588.0" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="597.6" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="607.2" y="222" width="8" height="16" rx="1" class="f-box"/>
  <rect x="616.8" y="222" width="8" height="16" rx="1" class="f-box"/>
  <text x="620.8" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">64</text>
  <rect x="12" y="262" width="8" height="12" rx="1" class="f-plain"/><text x="26" y="272" class="f-label f-muted">same</text>
  <rect x="120" y="262" width="8" height="12" rx="1" class="f-box"/><text x="134" y="272" class="f-label f-muted">differ</text>
</svg>
<figcaption>The same 8 numbers, a different order of additions. Rows shorter than one register never reach the new fold.</figcaption>
</figure>

## Why the tokens survived

A shift of 0.0001 only matters if the first and second token are closer than that. 8 prompts is too few to say anything about it, so I took 200 sentence openings from Alice in Wonderland and generated 100 greedy tokens for each, 20,000 steps per run.

I did 6 runs and they give only 3 different sets of gaps. December repeated and December with 1 thread are the same to the bit. Both generic kernel runs are the same too and January is the third set. All 200 continuations were the same in all 6.

The smallest gap between the first and second token was 0.000366, at step 14 of the opening that starts with "So she set to work". It was the same to the last bit in every run. No condition changed any gap by more than 0.000172, so the closest step had about twice the margin it needed.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Histogram of the gap between the first and second token over 20,000 greedy steps of GPT-2. The median is 4.02. The closest step has a gap of 0.000366. The largest change any condition made to a gap is 0.000172, so no step falls inside it.">
  <text x="12" y="18" class="f-label f-muted">gap between the first and second token, 20,000 greedy steps</text>
  <rect x="60.0" y="84" width="21.9" height="130" class="f-box" style="opacity:0.5"/>
  <rect x="107.7" y="203.7" width="21.3" height="10.3" class="f-muted"/>
  <rect x="131.0" y="187.4" width="21.3" height="26.6" class="f-muted"/>
  <rect x="154.3" y="193.4" width="21.3" height="20.6" class="f-muted"/>
  <rect x="177.7" y="185.1" width="21.3" height="28.9" class="f-muted"/>
  <rect x="201.0" y="179.8" width="21.3" height="34.2" class="f-muted"/>
  <rect x="224.3" y="171.1" width="21.3" height="42.9" class="f-muted"/>
  <rect x="247.7" y="162.5" width="21.3" height="51.5" class="f-muted"/>
  <rect x="271.0" y="150.5" width="21.3" height="63.5" class="f-muted"/>
  <rect x="294.3" y="143.0" width="21.3" height="71.0" class="f-muted"/>
  <rect x="317.7" y="137.7" width="21.3" height="76.3" class="f-muted"/>
  <rect x="341.0" y="127.2" width="21.3" height="86.8" class="f-muted"/>
  <rect x="364.3" y="120.7" width="21.3" height="93.3" class="f-muted"/>
  <rect x="387.7" y="113.1" width="21.3" height="100.9" class="f-muted"/>
  <rect x="411.0" y="106.3" width="21.3" height="107.7" class="f-muted"/>
  <rect x="434.3" y="101.9" width="21.3" height="112.1" class="f-muted"/>
  <rect x="457.7" y="97.0" width="21.3" height="117.0" class="f-muted"/>
  <rect x="481.0" y="86.7" width="21.3" height="127.3" class="f-muted"/>
  <rect x="504.3" y="84.0" width="21.3" height="130.0" class="f-muted"/>
  <rect x="527.7" y="133.9" width="21.3" height="80.1" class="f-muted"/>
  <line x1="60" y1="214" x2="620" y2="214" class="f-line"/>
  <line x1="60.0" y1="214" x2="60.0" y2="218" class="f-line"/>
  <text x="60.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0.0001</text>
  <line x1="153.3" y1="214" x2="153.3" y2="218" class="f-line"/>
  <text x="153.3" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0.001</text>
  <line x1="246.7" y1="214" x2="246.7" y2="218" class="f-line"/>
  <text x="246.7" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0.01</text>
  <line x1="340.0" y1="214" x2="340.0" y2="218" class="f-line"/>
  <text x="340.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0.1</text>
  <line x1="433.3" y1="214" x2="433.3" y2="218" class="f-line"/>
  <text x="433.3" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <line x1="526.7" y1="214" x2="526.7" y2="218" class="f-line"/>
  <text x="526.7" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="620.0" y1="214" x2="620.0" y2="218" class="f-line"/>
  <text x="620.0" y="230" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="620" y="246" text-anchor="end" class="f-label f-muted">gap, log scale</text>
  <text x="54" y="207.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="54" y="182.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="54" y="149.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="54" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1000</text>
  <text x="54" y="78" text-anchor="end" class="f-label f-muted">steps</text>
  <line x1="81.9" y1="46" x2="81.9" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="85.9" y="42" class="f-mono f-accent" style="font-size:11px">largest shift 0.000172</text>
  <line x1="112.6" y1="64" x2="112.6" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="116.6" y="60" class="f-mono f-ink" style="font-size:11px">closest step 0.000366</text>
  <line x1="489.7" y1="46" x2="489.7" y2="214" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="493.7" y="42" class="f-mono f-ink" style="font-size:11px">median 4.02</text>
</svg>
<figcaption>200 openings from Alice in Wonderland, 100 tokens each, December venv. No step is closer than twice the largest shift.</figcaption>
</figure>

Greedy GPT-2 falls into loops quickly and from the numbers a loop looks very sure of itself: the median gap is 0.70 over the first 10 steps and 6.27 over the last 10. A model that hesitates more would have more steps near zero, where the same 0.0001 has more chances to land.

1 thread instead of 4 also moved the first step logits, by up to 0.0000229 in both venvs and changed no token. I did not look at why.

## What I did not check

- GPU and float16, where the reduction order depends on other kernels that I did not read.
- Batching on a server, which is what users of a hosted API meet. My runs are batch 1, alone on the machine.
- Another real CPU. AVX-512 has its own fold in the same file. I only imitated an older CPU with an environment variable.
- The commit itself. I read the diff between tags v1.11.0 and v1.12.1, not the pull request.
- Bigger models and longer outputs. 20,000 steps of a looping 124M model is not a page of text from something larger.

On this machine I can stop blaming sampling for a changed output, at least with GPT-2. But the closest step had only twice the margin and I would not promise the same for a model that loops less.
