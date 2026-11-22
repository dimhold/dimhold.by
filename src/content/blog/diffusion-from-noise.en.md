---
title: "How a diffusion model picks a digit out of noise"
description: "I trained a small DDPM on 8 by 8 digits to see how a picture comes out of noise. The first 400 of 1000 steps barely choose the digit. Half the samples were copies of training digits."
date: 2021-01-16
lang: en
translationKey: diffusion-from-noise
tags: ["machine-learning", "statistics"]
---
Since the DDPM paper came out last summer, I have explained diffusion models to people the same way. You start with pure noise and every step removes a little of it. After 1000 steps there is a picture, a bit like a photo slowly appearing in a developer tray. It sounds right and nobody argued. But I had never trained one, so I did not know if any of it was true, especially the "slowly" part.

So I trained one on the smallest images I could find and watched what happens inside.

## The setup

There is no GPU here, only 4 cores of a cloud machine, so the data had to be tiny. `scikit-learn` ships 1797 handwritten digits of 8 by 8 pixels. Each pixel has a brightness from 0 to 16. I kept 1347 for training and put 450 aside. The model follows Ho et al. as closely as I could, with 1000 steps and noise added on a linear schedule from 0.0001 to 0.02. The network looks at a noisy image and guesses the noise. Ho et al. use a U-Net. I used a plain MLP with 2.5 million parameters because the images are so small. I used Python 3.8, PyTorch 1.7.1 and `scikit-learn` 0.24. Training ran 60,000 steps and took 64 minutes.

I also needed something that tells which digit a picture is, without me looking at thousands of them. A logistic regression trained on the same 1347 digits does that. It gets 97.6% right on the 450 I put aside. I call it the judge.

## Adding noise

This is the easy direction and it is just a formula. After t steps an image is a weighted sum of the original and fresh noise. The weights are known in advance. At step 500 the original keeps 0.28 and the noise 0.96. At step 1000 the original is down to 0.006.

The judge agrees. On noised versions of the 450 held out digits it is right 52.6% of the time at step 300. At step 1000 it is right 9.6%, which is chance with 10 classes. Up to here this was what I expected.

## Generating

Then I generated. I wanted to know at which step the model decides that it is drawing a 2 and not a 7.

I ran 200 generations from noise to the end and saved each one at 16 points along the way. Then from every saved point I restarted the rest of the way 10 times with fresh random noise. The judge said whether each restart ended with the same digit as the original run. If the digit is already decided at that step, the restarts should agree.

<figure class="fig">
<svg viewBox="0 0 680 416" role="img" aria-label="One generation of a digit shown at steps 1000, 600, 450, 350, 300, 250, 150 and at the end, where it is a 2. Restarts from the same point: from 600: 3, 1, 3, 1, 7, 1; from 450: 3, 9, 8, 9, 7, 1; from 300: 2, 3, 2, 2, 3, 2; from 150: 2, 2, 2, 2, 2, 2.">
  <text x="20" y="16" text-anchor="start" class="f-muted" style="font-size:12px">one generation, from noise to the end</text>
  <rect x="20" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="27.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="34.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="41.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="48.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="55.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="62.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="69.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="20.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="27.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="41.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="48.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="55.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="62.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="69.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="20.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="34.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="41.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="48.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="55.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="69.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="20.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="27.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="41.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="48.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="69.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="20.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="34.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="41.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="48.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="62.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="69.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="20.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="27.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="34.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="41.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="55.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="62.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="20.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="27.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="34.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="41.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="55.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="69.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="20.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="27.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="34.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="48.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="55.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <text x="48" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 1000</text>
  <rect x="102" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="102.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="109.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="123.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="130.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="137.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="144.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="151.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="102.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="109.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="123.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="137.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="144.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="151.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="102.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="109.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="116.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="123.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="130.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="137.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="144.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="151.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="102.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="109.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="116.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="123.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="137.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="151.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="109.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="123.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="130.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="137.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="151.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="102.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="109.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="123.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="144.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="151.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="102.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="109.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="116.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="123.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="137.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="144.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="102.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="116.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="137.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="144.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="151.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="130" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 600</text>
  <rect x="184" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="184.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="191.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="198.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="205.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="212.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="219.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="226.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="233.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="184.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="198.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="205.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="212.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="219.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="226.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="191.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="198.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="205.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="212.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="219.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="226.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="191.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="198.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="205.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="212.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="219.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="233.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="205.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="212.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="219.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="226.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="233.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="184.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="198.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="205.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="212.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="219.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="226.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="233.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="184.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="191.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="198.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="205.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="212.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="219.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="226.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="233.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="191.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="198.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="219.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="226.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="233.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <text x="212" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 450</text>
  <rect x="266" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="273.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="280.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="287.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="294.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="301.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="315.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="266.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="273.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="280.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="287.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="294.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="301.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="315.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="266.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="273.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="280.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="287.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="294.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="301.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="315.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="266.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="280.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="287.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="294.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="301.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="315.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="266.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="273.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="287.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="294.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="301.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="308.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="315.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="266.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="273.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="280.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="287.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="294.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="301.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="308.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="315.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="266.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="280.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="287.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="294.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="301.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="266.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="273.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="280.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="287.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="294.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="301.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="315.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="294" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 350</text>
  <rect x="348" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="355.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="362.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="369.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="376.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="397.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="348.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="355.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="362.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="369.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="376.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="383.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="390.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="397.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="348.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="355.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="362.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="369.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="376.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="383.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="390.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="397.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="348.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="362.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="369.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="376.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="383.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="390.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="397.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="348.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="355.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="369.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="376.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="383.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="390.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="397.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="348.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="355.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="362.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="369.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="376.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="390.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="397.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="355.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="362.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="376.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="383.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="390.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="355.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="362.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="369.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="376.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="383.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="390.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="397.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="376" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 300</text>
  <rect x="430" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="437.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="444.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="451.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="458.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="472.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="479.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="430.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="437.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="444.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="451.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="458.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="465.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="472.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="479.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="430.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="437.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="444.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="451.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="458.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="465.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="472.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="479.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="430.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="444.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="458.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="465.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="472.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="479.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="430.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="458.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="465.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="472.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="479.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="430.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="437.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="451.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="458.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="472.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="479.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="437.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="444.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="451.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="458.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="465.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="472.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="444.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="451.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="458.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="465.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <text x="458" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 250</text>
  <rect x="512" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="519.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="526.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="533.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="561.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="512.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="519.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="526.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="533.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="540.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="547.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="561.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="512.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="526.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="533.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="540.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="554.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="561.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="526.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="533.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="540.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="554.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="561.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="512.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="519.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="533.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="540.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="547.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="561.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="519.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="533.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="547.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="554.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="561.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="512.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="519.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="526.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="533.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="547.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="554.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="512.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="526.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="533.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="540.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="547.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="554.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="561.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="540" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">step 150</text>
  <rect x="594" y="26" width="56" height="56" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="601.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="622.0" y="26.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="601.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="608.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="622.0" y="33.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="601.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="608.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="615.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="622.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="629.0" y="40.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="615.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="622.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="629.0" y="47.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="601.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="615.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="622.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="629.0" y="54.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="608.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="615.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="622.0" y="61.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="601.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="622.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="629.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="636.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="643.0" y="68.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="601.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="608.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="615.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="622.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="629.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="636.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="643.0" y="75.0" width="7.00" height="7.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="622" y="98" text-anchor="middle" class="f-ink" style="font-size:11px">end</text>
  <text x="20" y="140" text-anchor="start" class="f-muted" style="font-size:12px">6 restarts from the same point, digit the judge sees</text>
  <text x="96" y="176" text-anchor="end" class="f-ink" style="font-size:12px">from 600</text>
  <rect x="110" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="125.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="115.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="135.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="120.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="130.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="135.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="125.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="130.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="125.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="130.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="135.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="120.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="135.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="140.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="115.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="125.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="135.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="140.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="120.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="125.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="130" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="166" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="181.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="171.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="181.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="171.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="181.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="176.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="181.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="191.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="171.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="176.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="176.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="181.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="186.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="196.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="186" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <rect x="222" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="237.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="232.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="237.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="247.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="227.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="232.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="237.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="242.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="247.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="227.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="237.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="242.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="237.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="242.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="247.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="252.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="237.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="247.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="252.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="232.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="242.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="252.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <text x="242" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="278" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="288.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="303.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="283.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="308.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="288.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="283.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="298.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="283.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="298.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="288.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="298.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="293.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="298.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="298" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <rect x="334" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="349.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="344.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="349.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="354.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="359.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="344.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="359.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="364.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="354.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="359.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="339.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="349.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="339.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="349.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="364.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="349.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="354.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="354" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">7</text>
  <rect x="390" y="152" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="415.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="152.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="405.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="410.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="157.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="395.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="400.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="405.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="162.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="405.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="167.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="172.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="177.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="410.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="182.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="410.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="415.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="187.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="410" y="206" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <text x="96" y="242" text-anchor="end" class="f-ink" style="font-size:12px">from 450</text>
  <rect x="110" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="115.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="140.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="125.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="130.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="140.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="125.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="140.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="130.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="125.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="130.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="130.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="135.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="115.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="125.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="130.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="115.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="120.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="135.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <text x="130" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="166" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="196.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="171.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="186.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="176.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="181.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="191.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="186.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="191.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="196.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="191.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="191.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="196.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="186.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="191.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="186" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">9</text>
  <rect x="222" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="232.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="237.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="242.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="252.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="247.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="252.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="242.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="252.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="237.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="232.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="237.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="247.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="232.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="227.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="237.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <text x="242" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">8</text>
  <rect x="278" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="288.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="298.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="288.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="293.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="303.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="288.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="288.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="293.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="303.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="308.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="303.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="283.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="288.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="298.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="303.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="293.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="298.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="308.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="298" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">9</text>
  <rect x="334" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="349.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="359.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="349.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="359.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="364.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="349.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="359.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="344.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="354.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="354.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="364.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="354.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="349.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="354.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <text x="354" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">7</text>
  <rect x="390" y="218" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="415.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="218.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="400.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="405.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="410.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="223.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="395.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="400.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="415.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="228.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="395.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="410.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="415.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="233.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="238.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="415.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="243.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="410.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="415.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="248.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="410.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="415.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="420.0" y="253.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <text x="410" y="272" text-anchor="middle" class="f-mono" style="font-size:12px">1</text>
  <text x="96" y="308" text-anchor="end" class="f-ink" style="font-size:12px">from 300</text>
  <rect x="110" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="120.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="130.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="125.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="120.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="125.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="130.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="125.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="135.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="130.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="140.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="120.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="140.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="145.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="125.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="135.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="140.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="145.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="130" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="166" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="171.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="181.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="171.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="176.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="186.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="171.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="186.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="176.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="181.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="186.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="181.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="186.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="191.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="196.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="181.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="191.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="196.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="171.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="181.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="186.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="191.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="196.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="176.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="181.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="191.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="196.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="186" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="222" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="227.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="242.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="227.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="227.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="232.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="237.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="242.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="242.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="227.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="247.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="252.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="227.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="237.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="252.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="227.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="242.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="247.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <text x="242" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="278" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="283.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="293.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="283.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="288.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="298.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="283.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="293.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="298.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="298.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="293.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="298.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="293.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="303.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="308.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="288.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="293.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="308.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="283.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="293.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="298.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="303.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <text x="298" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="334" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="344.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="349.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="354.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="339.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="349.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="354.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="359.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="339.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="344.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="349.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="359.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="349.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="354.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="344.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="354.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="359.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="364.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="359.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="364.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="344.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="354.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="359.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="364.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="349.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="364.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="354" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">3</text>
  <rect x="390" y="284" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="395.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="284.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="395.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="400.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="405.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="410.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="289.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="395.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="294.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="405.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="410.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="299.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="410.0" y="304.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="400.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="405.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="420.0" y="309.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="405.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="420.0" y="314.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="395.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="415.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="420.0" y="319.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <text x="410" y="338" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <text x="96" y="374" text-anchor="end" class="f-ink" style="font-size:12px">from 150</text>
  <rect x="110" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="115.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="130.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="115.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="120.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="130.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="115.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="120.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="125.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="130.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="125.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="130.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="135.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="125.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="130.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="135.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="125.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="130.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="115.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="120.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="125.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="130.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="140.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="115.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="120.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="125.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="130.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="135.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="140.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="145.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="130" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="166" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="176.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="171.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="181.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="186.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="171.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="176.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="186.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="171.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="181.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="186.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="181.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="186.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="191.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="176.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="181.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="171.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="176.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="181.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="191.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="196.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="176.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="181.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="186.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="191.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="196.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="201.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <text x="186" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="222" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="227.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="232.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="237.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="227.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="232.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="237.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="242.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="247.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="232.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="237.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="242.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="242.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="247.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="242.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="232.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="237.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="242.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="252.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="232.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="237.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="247.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="252.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="257.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="227.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="232.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="237.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="242.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="247.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="252.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <text x="242" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="278" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="283.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="283.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="288.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="293.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="298.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="303.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="288.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="293.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="298.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="283.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="298.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="298.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="288.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="293.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="303.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="308.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="288.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="293.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="298.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="303.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="308.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="283.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.25;stroke:none"/>
  <rect x="288.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="293.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="298.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="303.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="308.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <text x="298" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="334" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="339.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="344.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="349.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="339.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="344.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="349.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="354.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="339.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.44;stroke:none"/>
  <rect x="344.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="354.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="344.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="354.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="359.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="349.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.31;stroke:none"/>
  <rect x="354.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="349.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="354.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="344.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="349.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="354.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="359.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="369.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="339.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="344.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="349.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="354.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="359.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="364.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="369.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <text x="354" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
  <rect x="390" y="350" width="40" height="40" class="f-box" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="395.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="350.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="395.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="400.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="410.0" y="355.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="395.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.50;stroke:none"/>
  <rect x="400.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.56;stroke:none"/>
  <rect x="405.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="410.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="415.0" y="360.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="400.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.38;stroke:none"/>
  <rect x="410.0" y="365.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="405.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.63;stroke:none"/>
  <rect x="410.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.81;stroke:none"/>
  <rect x="415.0" y="370.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="400.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="405.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.69;stroke:none"/>
  <rect x="420.0" y="375.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.13;stroke:none"/>
  <rect x="400.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:1.00;stroke:none"/>
  <rect x="410.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="415.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="420.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="425.0" y="380.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.06;stroke:none"/>
  <rect x="395.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.19;stroke:none"/>
  <rect x="400.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="405.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.94;stroke:none"/>
  <rect x="410.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="415.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.88;stroke:none"/>
  <rect x="420.0" y="385.0" width="5.00" height="5.00" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="410" y="404" text-anchor="middle" class="f-mono" style="font-size:12px">2</text>
</svg>
<figcaption>Top: one run of my DDPM on 8×8 digits, x_t at each step (clipped to the pixel range). Bottom: 6 restarts of the rest of the way with fresh noise from the same x_t, with the digit the judge reads at the end. This run ends as a 2.</figcaption>
</figure>

For a long time they did not. Counting down from 1000, at step 600 only 11.9% of restarts end with the same digit, which is chance plus a little. Then it goes quickly and by step 150 the restarts agree 90.2% of the time.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Share of restarts that end on the same digit, by step: 1000 9.3%, 600 11.9%, 500 18.2%, 400 33.4%, 300 57.6%, 200 80.8%, 150 90.2%, 100 95.2%. It stays near chance until step 500 and reaches 90% at step 150.">
  <line x1="60.0" y1="214.0" x2="640.0" y2="214.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="218" text-anchor="end" class="f-muted" style="font-size:11px">0%</text>
  <line x1="60.0" y1="114.0" x2="640.0" y2="114.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="118" text-anchor="end" class="f-muted" style="font-size:11px">50%</text>
  <line x1="60.0" y1="14.0" x2="640.0" y2="14.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="18" text-anchor="end" class="f-muted" style="font-size:11px">100%</text>
  <line x1="60.0" y1="214.0" x2="60.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="60" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1000</text>
  <line x1="176.0" y1="214.0" x2="176.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="176" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">800</text>
  <line x1="292.0" y1="214.0" x2="292.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="292" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">600</text>
  <line x1="408.0" y1="214.0" x2="408.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="408" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">400</text>
  <line x1="524.0" y1="214.0" x2="524.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="524" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">200</text>
  <line x1="639.4" y1="214.0" x2="639.4" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="639.42" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1</text>
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">step, counting down</text>
  <line x1="60.0" y1="194.0" x2="640.0" y2="194.0" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <text x="66" y="189" text-anchor="start" class="f-muted" style="font-size:11px">chance</text>
  <polyline points="639.4,18.8 610.4,22.1 581.4,28.5 552.4,40.3 523.4,58.9 494.4,84.3 465.4,108.8 436.4,128.7 407.4,145.3 378.4,161.0 349.4,165.2 291.4,180.7 233.4,187.3 175.4,191.5 117.4,193.7 60.0,194.7" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.55"/>
  <polyline points="60.0,195.3 118.0,193.2 176.0,194.9 234.0,192.1 292.0,190.2 350.0,177.6 379.0,169.3 408.0,147.2 437.0,122.0 466.0,98.8 495.0,78.1 524.0,52.3 553.0,33.6 582.0,23.7 611.0,17.3 639.4,14.0" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="195.3" r="3" style="fill:var(--accent)"/>
  <circle cx="118.0" cy="193.2" r="3" style="fill:var(--accent)"/>
  <circle cx="176.0" cy="194.9" r="3" style="fill:var(--accent)"/>
  <circle cx="234.0" cy="192.1" r="3" style="fill:var(--accent)"/>
  <circle cx="292.0" cy="190.2" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="177.6" r="3" style="fill:var(--accent)"/>
  <circle cx="379.0" cy="169.3" r="3" style="fill:var(--accent)"/>
  <circle cx="408.0" cy="147.2" r="3" style="fill:var(--accent)"/>
  <circle cx="437.0" cy="122.0" r="3" style="fill:var(--accent)"/>
  <circle cx="466.0" cy="98.8" r="3" style="fill:var(--accent)"/>
  <circle cx="495.0" cy="78.1" r="3" style="fill:var(--accent)"/>
  <circle cx="524.0" cy="52.3" r="3" style="fill:var(--accent)"/>
  <circle cx="553.0" cy="33.6" r="3" style="fill:var(--accent)"/>
  <circle cx="582.0" cy="23.7" r="3" style="fill:var(--accent)"/>
  <circle cx="611.0" cy="17.3" r="3" style="fill:var(--accent)"/>
  <circle cx="639.4" cy="14.0" r="3" style="fill:var(--accent)"/>
  <line x1="60.0" y1="272.0" x2="86.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">restarts end on the same digit</text>
  <line x1="390.0" y1="272.0" x2="416.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.55"/>
  <text x="424" y="276" text-anchor="start" class="f-ink" style="font-size:12px">judge on noised real digits</text>
</svg>
<figcaption>200 generations, 10 restarts from each of 16 steps. The second line is the judge on the 450 held out digits noised to the same step, mean of 10 draws of noise.</figcaption>
</figure>

So the first 400 steps do almost nothing for the choice of the digit. Between step 400 and step 150, which is a quarter of the way, the agreement goes from a third to 90%. I wrote this down before the run as the result that would show my "slowly developing photo" wrong and it did. Ho et al. say almost the same in their paper: large scale features appear first and details last. I had read that sentence and still kept telling the tray story.

## Too good

The samples looked very good. The judge called 87.4% of them readable, meaning it was at least 90% sure about the digit. For the 450 real held out digits the same number is 84.7%.

I was pleased for about a minute, then it made me suspicious. So I took every one of 2000 samples and found the closest training digit. I did the same for the real held out digits, which by construction the model never saw. The closest any held out digit gets to a training one is a distance of 1.008.

999 of the 2000 samples are closer than that. They are copies of 677 different training digits, with a median difference of less than half a brightness level per pixel. A typical sample sits half as far from its closest training digit as a typical real held out digit does.

The readable number splits the same way. The copies are 90.0% readable, the rest 84.8%, which is where the real held out digits are.

I do not know if this says anything about big models. With 1347 images and 2.5 million parameters I would expect remembering to be easy. I also trained for 60,000 steps.

## Fewer steps

The DDIM paper from October shows that a trained DDPM can sample with far fewer steps. It writes the sampler with a parameter η. With η 1 it is a random sampler of the DDPM kind. The new DDIM sampler is η 0 and adds no noise. I tried both with skipped steps.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Readable and copied samples by number of sampling steps: 10: readable, η 1 66.4%, readable, η 0 (DDIM) 66.6%, copies, η 1 2.4%; 20: readable, η 1 78.7%, readable, η 0 (DDIM) 74.9%, copies, η 1 13.8%; 50: readable, η 1 86.6%, readable, η 0 (DDIM) 80.8%, copies, η 1 31.8%; 100: readable, η 1 86.6%, readable, η 0 (DDIM) 81.8%, copies, η 1 41.8%; 250: readable, η 1 87.8%, readable, η 0 (DDIM) 82.3%, copies, η 1 48.5%; 1000: readable, η 1 88.9%, readable, η 0 (DDIM) 82.8%, copies, η 1 52.7%.">
  <line x1="60.0" y1="214.0" x2="640.0" y2="214.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="218" text-anchor="end" class="f-muted" style="font-size:11px">0%</text>
  <line x1="60.0" y1="114.0" x2="640.0" y2="114.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="118" text-anchor="end" class="f-muted" style="font-size:11px">50%</text>
  <line x1="60.0" y1="14.0" x2="640.0" y2="14.0" class="f-line" style="stroke:var(--muted);stroke-width:1;opacity:.4"/>
  <text x="52" y="18" text-anchor="end" class="f-muted" style="font-size:11px">100%</text>
  <line x1="60.0" y1="214.0" x2="60.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="60" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">10</text>
  <line x1="147.3" y1="214.0" x2="147.3" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="147.29869874255456" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">20</text>
  <line x1="262.7" y1="214.0" x2="262.7" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="262.7013012574455" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">50</text>
  <line x1="350.0" y1="214.0" x2="350.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="350" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">100</text>
  <line x1="465.4" y1="214.0" x2="465.4" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="465.40260251489093" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">250</text>
  <line x1="640.0" y1="214.0" x2="640.0" y2="219.0" class="f-line" style="stroke:var(--muted);stroke-width:1"/>
  <text x="640" y="232" text-anchor="middle" class="f-muted" style="font-size:11px">1000</text>
  <text x="350" y="250" text-anchor="middle" class="f-muted" style="font-size:11px">sampling steps</text>
  <line x1="60.0" y1="44.7" x2="640.0" y2="44.7" class="f-line" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:2 3"/>
  <text x="66" y="38.66666666666666" text-anchor="start" class="f-muted" style="font-size:11px">real held out digits 84.7%</text>
  <polyline points="60.0,81.2 147.3,56.6 262.7,40.8 350.0,40.9 465.4,38.5 640.0,36.1" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="81.2" r="3" style="fill:var(--accent)"/>
  <circle cx="147.3" cy="56.6" r="3" style="fill:var(--accent)"/>
  <circle cx="262.7" cy="40.8" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="40.9" r="3" style="fill:var(--accent)"/>
  <circle cx="465.4" cy="38.5" r="3" style="fill:var(--accent)"/>
  <circle cx="640.0" cy="36.1" r="3" style="fill:var(--accent)"/>
  <polyline points="60.0,80.7 147.3,64.3 262.7,52.3 350.0,50.3 465.4,49.3 640.0,48.4" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.5;opacity:.6"/>
  <circle cx="60.0" cy="80.7" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="147.3" cy="64.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="262.7" cy="52.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="350.0" cy="50.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="465.4" cy="49.3" r="3" style="fill:var(--ink);opacity:.6"/>
  <circle cx="640.0" cy="48.4" r="3" style="fill:var(--ink);opacity:.6"/>
  <polyline points="60.0,209.3 147.3,186.5 262.7,150.5 350.0,130.4 465.4,117.0 640.0,108.6" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="60.0" cy="209.3" r="3" style="fill:var(--accent)"/>
  <circle cx="147.3" cy="186.5" r="3" style="fill:var(--accent)"/>
  <circle cx="262.7" cy="150.5" r="3" style="fill:var(--accent)"/>
  <circle cx="350.0" cy="130.4" r="3" style="fill:var(--accent)"/>
  <circle cx="465.4" cy="117.0" r="3" style="fill:var(--accent)"/>
  <circle cx="640.0" cy="108.6" r="3" style="fill:var(--accent)"/>
  <line x1="60.0" y1="272.0" x2="86.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="94" y="276" text-anchor="start" class="f-ink" style="font-size:12px">readable, η 1</text>
  <line x1="260.0" y1="272.0" x2="286.0" y2="272.0" class="f-line" style="stroke:var(--ink);stroke-width:1.5;opacity:.6"/>
  <text x="294" y="276" text-anchor="start" class="f-ink" style="font-size:12px">readable, η 0 (DDIM)</text>
  <line x1="480.0" y1="272.0" x2="506.0" y2="272.0" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="514" y="276" text-anchor="start" class="f-ink" style="font-size:12px">copies, η 1</text>
</svg>
<figcaption>2000 samples per point. Readable means the judge is at least 90% sure. A copy is a sample closer to a training digit than any of the 450 held out digits gets (distance 1.008).</figcaption>
</figure>

With η 1, 50 steps give 86.6% readable against 89.0% for all 1000 steps of the same sampler and 2000 samples take 6 seconds instead of 132. Its noise is a little smaller than in Ho et al., so it is a different sampler from the one behind the 87.4% above. At 10 steps it drops to 66.4%. The DDIM sampler was lower at every count above 10, for example 80.9% at 50 steps. It stays lower even at 1000 steps. The DDIM paper reports the opposite for CIFAR-10. Maybe it is the linear judge or the 8 by 8 images. I do not really have an explanation.

The copies changed too. The η 1 sampler copies about half of its samples at 1000 steps and only 2.4% at 10 steps. Readable and copied go up together, so I suspect a shorter sampler looks a little worse partly because it remembers less. I did not test that separately.

## What I did not check

There was only one training run. With 3 seeds the full sampler gave between 87.4% and 89.2% readable, so differences under 2 points are noise. I did not save checkpoints and cannot say when during training the copying started. The network is an MLP and the judge is linear. Ho et al. split their chain on CelebA faces. Samples split at step 750 already shared pose and hair color. So on faces, at 256 by 256, the decision seems to start much earlier than on my digits. I have not tried anything bigger than 8 by 8.
