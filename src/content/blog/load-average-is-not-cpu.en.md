---
title: "Load average 8 twice, and it meant 2 different things"
description: "On a 4 core server I produced a load average of 8.19 with the processor at 99 percent and a load average of 8.10 with the processor doing real work 36 percent of the time and 7 processes stuck on the disk. Same alarm, opposite fix. And after a full minute of 4 pegged cores the 1 minute figure still read 2.67."
date: 2012-08-15
lang: en
translationKey: load-average-is-not-cpu
---

Load average 8 on a 4 core box, so the box needs more cores. I have said that sentence in a meeting. Nobody objected. What I had never done is make the number go up on purpose in more than 1 way, so I did that on a quiet 4 core server with nothing else on it.

The first run puts 4 processes into a pure arithmetic loop, which is as close to a definition of processor load as I can build. The second run starts 8 processes writing to disk. Both push the load average past 8. Only 1 is about the processor.

## The number lags by more than people think

Before the interesting part, the boring part that turned out not to be boring. The 4 loops start at a load of 0.18. The processor sits at 100 percent from the first second, so the machine is fully busy immediately.

<figure class="fig">
<svg viewBox="0 0 640 240" role="img" aria-label="The 1 minute load average climbing while 4 cores are fully busy. After 5 seconds it reads 0.49, after 30 seconds 1.69, after 60 seconds 2.67 and after 120 seconds 3.58. The exponential model predicts 0.32, 1.57, 2.53 and 3.46 for the same moments. The true answer, 4, is drawn as a flat line the curve approaches but does not reach.">
  <text x="60" y="24" class="f-label f-muted">1 minute load average, 4 cores fully busy the whole time</text>
  <path d="M 70 200 L 610 200" class="f-line"/>
  <path d="M 70 40 L 70 200" class="f-line"/>
  <path d="M 70 40 L 610 40" class="f-line f-muted" stroke-dasharray="4 4"/>
  <text x="450" y="34" class="f-label f-muted">the truth: 4 busy cores</text>
  <text x="46" y="204" class="f-label f-muted">0</text>
  <text x="46" y="124" class="f-label f-muted">2</text>
  <text x="46" y="44" class="f-label f-muted">4</text>
  <circle cx="92" cy="180" r="4" class="f-accent"/>
  <circle cx="160" cy="132" r="4" class="f-accent"/>
  <circle cx="250" cy="93" r="4" class="f-accent"/>
  <circle cx="430" cy="57" r="4" class="f-accent"/>
  <path d="M 92 180 L 160 132 L 250 93 L 430 57 L 520 50" class="f-line f-accent"/>
  <text x="86" y="172" class="f-mono f-ink">0.49</text>
  <text x="150" y="124" class="f-mono f-ink">1.69</text>
  <text x="240" y="85" class="f-mono f-ink">2.67</text>
  <text x="420" y="49" class="f-mono f-ink">3.58</text>
  <text x="80" y="218" class="f-label f-muted">5 s</text>
  <text x="146" y="218" class="f-label f-muted">30 s</text>
  <text x="236" y="218" class="f-label f-muted">60 s</text>
  <text x="416" y="218" class="f-label f-muted">120 s</text>
  <text x="60" y="234" class="f-label f-muted">time since the load started</text>
</svg>
<figcaption>The model for a damped average with a 60 second constant predicts 0.32, 1.57, 2.53 and 3.46 at these 4 moments. Every measured point sits about 0.15 above it, which is the load that was already decaying when the run started.</figcaption>
</figure>

After a full minute of 4 saturated cores the 1 minute average reads 2.67. Not 4. The number is a damped average with a 60 second constant, so a minute in you are seeing about 63 percent of what is happening. The rest of it only arrives after 3 or 4 minutes.

That cuts both ways during an incident. A machine that just went under water looks 2 thirds as bad as it is. A machine you just rescued looks bad for another 3 minutes.

## The same 8, built out of different things

Then the disk. 8 processes writing 300 megabytes each in a loop, bypassing the page cache so the writes actually go to the device.

<figure class="fig">
<svg viewBox="0 0 640 210" role="img" aria-label="Two runs with almost the same load average and completely different composition. In the first, writes absorbed by the page cache, the load average is 8.19, the processor is busy 99.4 percent of the time and no process is blocked. In the second, writes going straight to the device, the load average is 8.10, the processor does real work 36.5 percent of the time, waits on input and output 63.3 percent and 7 processes are blocked in uninterruptible sleep.">
  <text x="10" y="24" class="f-label f-muted">2 runs, both alarming, nothing in common underneath</text>
  <rect x="10" y="42" width="300" height="120" rx="3" class="f-box"/>
  <text x="24" y="66" class="f-mono f-ink">load 8.19</text>
  <text x="24" y="90" class="f-label f-muted">writes absorbed by the page cache</text>
  <text x="24" y="114" class="f-label f-ink">processor busy 99.4 percent</text>
  <text x="24" y="138" class="f-label f-ink">blocked processes: 0</text>
  <text x="24" y="156" class="f-label f-muted">more cores would help</text>
  <rect x="330" y="42" width="300" height="120" rx="3" class="f-accent"/>
  <text x="344" y="66" class="f-mono f-ink">load 8.10</text>
  <text x="344" y="90" class="f-label f-muted">writes going to the device</text>
  <text x="344" y="114" class="f-label f-ink">processor working 36.5 percent</text>
  <text x="344" y="138" class="f-label f-ink">blocked processes: 7</text>
  <text x="344" y="156" class="f-label f-muted">more cores would change nothing</text>
  <text x="10" y="190" class="f-label f-muted">the number counts processes that want to run plus processes stuck waiting for a device</text>
</svg>
<figcaption>The load average adds 2 quantities that have no reason to be added. On the right the machine spends 63.3 percent of its time waiting on the disk. Buying processors for that number would buy nothing.</figcaption>
</figure>

Load 8.10, with the processor doing real work 36.5 percent of the time. It waits on the disk 63.3 percent. 7 of the 8 writers sit in uninterruptible sleep at any moment, which is the state Linux counts alongside the runnable ones. That decision is the whole reason the number is not a processor metric.

The pair is the point. 8.19 and 8.10 are the same alarm on a dashboard. One of them is fixed by more cores. The other one is fixed by a faster disk or by writing less, while the cores sit 2 thirds idle.

## Where I tripped

My first attempt at the disk half did not measure the disk. I had the 8 writers call fdatasync but let the page cache take the writes. The run came back with a load of 8.19 at 99 percent processor and no blocked processes, which is the left box in that figure. I had written a memory copy benchmark and called it disk pressure.

The fix was to bypass the cache so the writes reach the device. That is the honest version of the number on the left: it is real, it is 8.19, it says nothing at all about a disk.

## What I did not check

Whether the kernel samples this often enough to be trusted at 5 second resolution, since it computes the average on a timer rather than on every change, so my sampling could easily be reading its rounding. Whether uninterruptible sleep on network storage counts the same way, which is the case that matters in a datacenter. And what any of this looks like inside a container, where the load average belongs to the host while the limits belong to the cgroup. I expect that to be its own kind of misleading.

The narrow claim is about the sentence I used to say. A load of 8 on 4 cores does not mean the processor is the bottleneck. Before saying anything about cores, look at what the processes are doing: the same 8 can be 4 cores of arithmetic or 7 processes waiting on a device that will not go faster because you bought a bigger machine.
