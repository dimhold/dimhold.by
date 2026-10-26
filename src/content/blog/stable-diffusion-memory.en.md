---
title: "Stable Diffusion asks for 10 GB of video memory and the weights take 4 of them"
description: "The Stable Diffusion README asks for a GPU with at least 10 GB, while its weights are 4.26 GB in float32. On a CPU with PyTorch 1.12.1 I measured where the rest goes: one attention layer at 512x512 builds 2 GiB of score matrices, a loop over the heads brings that to 387 MiB with the same output bit for bit. The default txt2img command adds up to about 10 GiB on paper."
date: 2022-08-27
lang: en
translationKey: stable-diffusion-memory
tags: ["machine-learning", "performance"]
---
On Monday CompVis published the weights of Stable Diffusion. Their README says the model has "860M UNet and 123M text encoder" and "runs on a GPU with at least 10GB VRAM". I multiplied in my head. About a billion numbers at 4 bytes each is 4 GB. The rest of the 10 I expected to be a reserve for CUDA and a habit of rounding up.

That was my whole model of GPU memory: the weights plus a bit. I never checked it, because everything I ran before fit anywhere. The machine where I do these experiments has no video card at all. It has 4 cores of an AMD EPYC and a bit less than 5 GiB that I can give to one process. This turned out useful, because a process that asks for too much is killed at once instead of slowing down. Everything below ran on PyTorch 1.12.1 on the CPU in float32.

## Counting the weights

The files of `CompVis/stable-diffusion-v1-4` hold 859.5 million numbers in the UNet alone. With the text encoder and the VAE, the part that turns the result into pixels, it comes to 1.07 billion. That is 4.26 GB in float32 and 2.13 GB in half precision. My estimate of the weights was right. It explained less than half of the 10.

The UNet alone is 3.2 GiB in float32. Loading it pushed the memory of the process up to 3.76 GiB, file cache included. Before I had clean numbers I spent a while on kills that made no sense. Then I found that my user session has its own ceiling of 5 GiB and everything else I had open counts against it.

## Where the rest goes

The answer is in `ldm/modules/attention.py`. The UNet looks at the image through attention layers and the first of them works at 1/8 of the picture. At 512x512 it sees 64 by 64, which is 4096 positions. Every position is compared with every other one, a matrix of 4096 by 4096 numbers. There are 8 heads and the sampler runs the prompt and an empty prompt together, so there are 16 such matrices. The code computes all of them in one `einsum` and then `softmax` makes a second tensor of the same size.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="One attention layer at 512x512, prompt and empty prompt, 8 heads. all heads at once: 16 + 16 matrices of 64 MiB = 2 GiB, measured above baseline +2241 MiB. one head at a time: 1 + 1 matrix of 64 MiB = 128 MiB, measured above baseline +387 MiB.">
  <text x="10" y="18" class="f-label f-muted">One attention layer at 512x512, prompt and empty prompt, 8 heads</text>
  <text x="20" y="50" class="f-mono f-ink" style="font-size:13px">all heads at once</text>
  <text x="20" y="74" class="f-label f-muted">scores</text>
  <rect x="20" y="82" width="26" height="26" class="f-box"/>
  <rect x="50" y="82" width="26" height="26" class="f-box"/>
  <rect x="80" y="82" width="26" height="26" class="f-box"/>
  <rect x="110" y="82" width="26" height="26" class="f-box"/>
  <rect x="20" y="112" width="26" height="26" class="f-box"/>
  <rect x="50" y="112" width="26" height="26" class="f-box"/>
  <rect x="80" y="112" width="26" height="26" class="f-box"/>
  <rect x="110" y="112" width="26" height="26" class="f-box"/>
  <rect x="20" y="142" width="26" height="26" class="f-box"/>
  <rect x="50" y="142" width="26" height="26" class="f-box"/>
  <rect x="80" y="142" width="26" height="26" class="f-box"/>
  <rect x="110" y="142" width="26" height="26" class="f-box"/>
  <rect x="20" y="172" width="26" height="26" class="f-box"/>
  <rect x="50" y="172" width="26" height="26" class="f-box"/>
  <rect x="80" y="172" width="26" height="26" class="f-box"/>
  <rect x="110" y="172" width="26" height="26" class="f-box"/>
  <text x="170" y="74" class="f-label f-muted">after softmax</text>
  <rect x="170" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="112" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="142" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="170" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="200" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="230" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <rect x="260" y="172" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="20" y="218" class="f-label f-ink">16 + 16 matrices of 64 MiB = 2 GiB</text>
  <text x="20" y="240" class="f-mono f-ink" style="font-size:13px">measured above baseline: +2241 MiB</text>
  <line x1="340" y1="40" x2="340" y2="250" class="f-line f-muted" opacity="0.4"/>
  <text x="370" y="50" class="f-mono f-ink" style="font-size:13px">one head at a time</text>
  <text x="370" y="74" class="f-label f-muted">scores</text>
  <rect x="370" y="82" width="26" height="26" class="f-box"/>
  <text x="520" y="74" class="f-label f-muted">after softmax</text>
  <rect x="520" y="82" width="26" height="26" class="f-box" style="fill:var(--accent);fill-opacity:0.6"/>
  <text x="370" y="140" class="f-label f-muted">4096 x 4096, 64 MiB</text>
  <text x="370" y="218" class="f-label f-ink">1 + 1 matrix of 64 MiB = 128 MiB</text>
  <text x="370" y="240" class="f-mono f-ink" style="font-size:13px">measured above baseline: +387 MiB</text>
</svg>
<figcaption>Each square is one matrix of 4096 by 4096 float32 numbers, 64 MiB. The CompVis code builds all 16 at once and softmax adds 16 more. The loop over heads keeps 2 at a time and gives the same output bit for bit.</figcaption>
</figure>

16 matrices of 64 MiB give 1 GiB in float32 and with the softmax copy it is 2 GiB, which is 2048 MiB. I took this block out of the UNet and ran it alone with the real weights. Memory went up by 2241 MiB above the baseline, so the 2 tensors explain 91% of it. The rest is the other tensors of the block. Then I rewrote the same math as a loop over the heads, one matrix at a time. It took 387 MiB. A repeat run gave 405. The outputs were the same bit for bit.

I expected the loop to cost time. In 3 runs of each it took 2.04 to 2.16 seconds against 1.85 to 2.19 for all heads at once. On this CPU the difference is lost in the noise. On a card it may look different, but I would take this trade on any card that is short of memory.

The matrix grows with the square of the number of positions and this is the part I did not feel until I saw it. At 640x640 one layer needs 2.4 GiB and at 768x768 it needs 5.1 GiB, before the softmax copy. With all heads at once both runs were killed at a cap of 4 GiB. One head at a time they took 795 MiB and 1390 MiB.

<figure class="fig">
<svg viewBox="0 0 680 290" role="img" aria-label="Memory above baseline for the first attention block, float32, cap 4 GiB. 512x512: all heads at once +2241 MiB. one head at a time +387 MiB. 640x640: all heads at once killed at the 4 GiB cap, scores alone 2.4 GiB. one head at a time +795 MiB. 768x768: all heads at once killed at the 4 GiB cap, scores alone 5.1 GiB. one head at a time +1390 MiB.">
  <text x="10" y="18" class="f-label f-muted">Memory above baseline for the first attention block, float32, cap 4 GiB</text>
  <text x="108" y="70" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512x512</text>
  <rect x="120" y="46" width="264.8" height="18" class="f-box f-accent"/>
  <text x="390.8" y="59" class="f-label f-ink">all heads at once +2241 MiB</text>
  <rect x="120" y="70" width="45.7" height="18" class="f-box"/>
  <text x="171.7" y="83" class="f-label f-ink">one head at a time +387 MiB</text>
  <text x="108" y="142" text-anchor="end" class="f-mono f-ink" style="font-size:13px">640x640</text>
  <rect x="120" y="118" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="131" class="f-label f-ink">all heads at once: killed at the 4 GiB cap</text>
  <text x="596.1" y="131" text-anchor="end" class="f-label f-muted">scores alone 2.4 GiB</text>
  <rect x="120" y="142" width="94.0" height="18" class="f-box"/>
  <text x="220.0" y="155" class="f-label f-ink">one head at a time +795 MiB</text>
  <text x="108" y="214" text-anchor="end" class="f-mono f-ink" style="font-size:13px">768x768</text>
  <rect x="120" y="190" width="484.1" height="18" class="f-box f-plain" style="stroke-dasharray:4 3"/>
  <text x="128" y="203" class="f-label f-ink">all heads at once: killed at the 4 GiB cap</text>
  <text x="596.1" y="203" text-anchor="end" class="f-label f-muted">scores alone 5.1 GiB</text>
  <rect x="120" y="214" width="164.3" height="18" class="f-box"/>
  <text x="290.3" y="227" class="f-label f-ink">one head at a time +1390 MiB</text>
  <line x1="604.1" y1="40" x2="604.1" y2="246" class="f-line f-muted" style="stroke-dasharray:2 3"/>
  <line x1="120" y1="252" x2="640" y2="252" class="f-line f-muted"/>
  <line x1="120.0" y1="248" x2="120.0" y2="252" class="f-line f-muted"/><text x="120.0" y="266" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="238.2" y1="248" x2="238.2" y2="252" class="f-line f-muted"/><text x="238.2" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <line x1="356.4" y1="248" x2="356.4" y2="252" class="f-line f-muted"/><text x="356.4" y="266" text-anchor="middle" class="f-label f-muted">2000</text>
  <line x1="474.5" y1="248" x2="474.5" y2="252" class="f-line f-muted"/><text x="474.5" y="266" text-anchor="middle" class="f-label f-muted">3000</text>
  <line x1="592.7" y1="248" x2="592.7" y2="252" class="f-line f-muted"/><text x="592.7" y="266" text-anchor="middle" class="f-label f-muted">4000</text>
  <text x="640" y="282" text-anchor="end" class="f-label f-muted">MiB</text>
</svg>
<figcaption>3 runs per bar on 4 CPU cores, PyTorch 1.12.1. Every run with all heads at once above 512x512 was killed at the 4 GiB cap. The grey text is the size of the score matrix for that size, before the softmax copy.</figcaption>
</figure>

## The default command

`scripts/txt2img.py` by default makes 3 images per batch and the sampler doubles that for the empty prompt, so the UNet sees 6. It keeps the weights in float32 and runs under `autocast`. The queries and keys come out of the linear layers in half precision, so the scores do too. `softmax` is on the list of operations that autocast returns in float32. For one layer at 512x512 I count 1.5 GiB of scores in half precision and 3 GiB after the softmax. The code keeps the first one alive while it uses the second. The next `einsum` runs on `bmm`, which autocast casts to half precision, so that makes another copy of 1.5 GiB. Together it is 6 GiB for one layer, next to 3.97 GiB of weights.

That is close to 10 GiB, which fits the README surprisingly well. I did not run it on a card, so it is my reading of the code, but it can be off in both directions. Autocast may also keep half copies of the weights it has cast and I do not know how much the CUDA context takes. So I read most of the 10 GB as the default batch of 6 under autocast and less of it as the model.

## One whole image

At the end I made one picture, to see that the pieces work together. The prompt was "a photograph of an astronaut riding a horse" with 50 steps of the PLMS sampler and attention one head at a time. As in the CompVis code, the prompt and the empty prompt went through the UNet as one batch of 2. Each of the 3 parts ran as a separate process, so they were never in memory together. The UNet process peaked at 3.76 GiB. Loading alone had already reached 3.70, so the 51 passes of the sampler added only 64 MiB on top. The other 2 stayed under 1.7 GiB.

On 4 cores the whole thing took 16 minutes, with 17.4 seconds for a typical step. The astronaut is there and so is the horse. How long the same work takes on a card I cannot say, I have no number of my own for it.

On paper the floor for 512x512 is now far below 10 GB. It is about 2 GiB of weights in half precision and about 0.1 GiB for the scores of one head, counting every copy autocast makes. I would want to see it on a real card before I believe it.

## What I did not check

- Nothing here ran on a GPU. I have no measurement of the CUDA context or of speed on a card.
- The 10 GiB for the default command comes from the code and the documented autocast rules, not from a run.
- Every time is from 1 to 3 runs on a machine that had other work on it.
- With all heads at once I measured only the first attention block. In the whole UNet I ran only attention one head at a time. That run used the diffusers code of the UNet, not my loop.
- The VAE has its own attention at 64 by 64 and I did not look at it separately.
