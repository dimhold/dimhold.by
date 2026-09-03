---
title: "How much further does a dog walk than the man walking it"
description: "2 phones, one wood, an hour and twenty. One in a pocket, one in a sock tied to a collar. GPS once a second. Zoom covered 5.42 km to my 4.09. The interesting part was not how much further, but why: our median speeds are almost the same and the whole difference lives in the tails."
date: 2026-08-20
lang: en
translationKey: dog-walks-further
tags: ["statistics", "numbers"]
walk: true
---

I walk Zoom most days. He is my restless dog. I had always wondered how much further he covers than I do.

Zoom almost never walks to heel. He circles me, disappears into the trees, wanders off to one side, sniffs at something, then bolts and comes back. All the while keeping careful track of where I am.

Time to actually measure it.

I borrowed my son's phone, put it in a sock and tied it to Zoom's collar. Mine went in my pocket. Both ran a GPS logger writing a position **once a second**. We went to a wood where he could run wherever he liked.

Here is that walk. 55 minutes in 25 seconds.

<div data-walk></div>

## The first answer

**Zoom covered 5.42 km. I covered 4.09 km.** That is 32.5% more.

My average speed was 4.44 km/h, his 5.88. That is the same 32.5%, which follows, since we were out for the same length of time.

I could have stopped there. The interesting part started when I looked at the distribution instead of the average.

## The second answer, which I like more

**Our median speeds differ by only 16%**: 4.44 km/h against 5.13.

So in a typical second of the walk we are moving much the same. Where does the extra third of a kilometre come from?

All of it lives in the tails:

| | Me | Zoom | |
| --- | ---: | ---: | --- |
| Median | 4.44 km/h | 5.13 km/h | +16% |
| 90th percentile | 6.41 | 11.27 | **+76%** |
| 99th percentile | 8.42 | 20.22 | **+140%** |
| Peak | 9.7 | 24.6 | |

I walk at a steady pace. Zoom is forever switching between standing still, walking and short bursts of speed.

**He stands still almost 9 times as often as I do.** I was stationary 1% of the time, he was 8.9%. Sniffing. Stopped. Saw something. Ran. Came back. Stopped again.

And for 3.8% of the walk he was moving faster than 15 km/h. I had no such moments at all. Not one. I just walk.

Those sprints are exactly where the extra 1.33 km comes from.

## How far does he actually go

Not as far as I thought.

The median distance between us was **28 metres**. He was more than 50 metres away for 16% of the walk. The furthest he got all day was 106 metres. But he was also within 10 metres only 19% of the time.

He seems to have a working radius of 20 to 40 metres. Inside it he does as he pleases, but he is always keeping tabs on where I am.

## The altitude, which is its own story

GPS gave me 412 metres of ascent. Zoom got 226. That looked wrong at first: we were walking together, tens of metres apart.

But this is how GPS behaves. Total ascent is the sum of every small positive change in height. Such a sum is extraordinarily sensitive to measurement noise: the more the receiver trembles, the more hills it invents. Zoom's track turned out to be the steadier one. His median satellite count was 29 against my 25. His phone rode on his back under open sky; mine lay in a pocket, shielded by me.

So that number measures reception quality, not terrain. Ascent from GPS without a barometer is not a measurement.

There is real relief on the route, mind: once smoothed, the height climbs from about 25 metres at the start to 45-50 in the middle of the walk, then comes back down.

## What it comes to

The conclusion turned out more interesting than I expected. It is not that the dog walks faster. **He spends the walk in a different mode**: stopping more often, constantly changing pace and now and then breaking into a sprint at up to 24.6 km/h.

I just walk.

Over the same outing he clocked 5.42 km to my 4.09. A difference of 1.33 km or 32.5%.

---

*The animation above is built from the real tracks. The coordinates are shifted into the Pacific by one shared offset and the heights are measured from the lowest point of the walk. Shape, distances and timing are untouched, but where exactly we go is nobody's business.*
