---
title: "At 44,100 days per second the solar cycle is silent and the equinox is a note"
description: "I turned 28,505 days of sunspots, F10.7 and Ap into audio at one day per sample. The 11 year cycle falls below hearing and comes back only as loudness. The 27 day rotation is a hiss 2 semitones wide and the one clean line in all 3 series is at 241 Hz in Ap and it comes from the equinoxes of the Earth."
date: 2025-04-05
lang: en
translationKey: solar-cycle-sound
tags: ["open-data", "statistics"]
---

The daily sunspot file has 75,665 lines, from January 1, 1818 to February 28, 2025. If one day becomes one audio sample at the usual 44,100 samples per second, the file plays for 1.7 seconds. I did one more division before writing any code. The Sun turns in about 27 days as seen from the Earth and 44,100 / 27 gives 1,633 Hz, a whistle in the middle of the hearing range.

I have always taken sonifications of the Sun as decoration and I never computed what is left of the data on the way to the ear. I also assumed that the 11 year cycle is the thing you hear. Playing data straight as samples is called audification and the niche is occupied. Robert Alexander and colleagues described it for space physics in JGR in 2014. In 2011 he reported a hum in solar wind data and the hum was the solar rotation. I wanted to know what other notes there are.

## Setup

I took 3 daily series from February 14, 1947 to February 28, 2025. It is 28,505 days or 0.65 seconds of sound. The sunspot number is from SILSO, the file as it stood on March 29. F10.7 is the radio flux at 10.7 cm, measured in Penticton and earlier near Ottawa. F10.7 and the daily geomagnetic index Ap come from one GFZ Potsdam file. The script runs on Python 3.11 with NumPy 2.2.4 and SciPy 1.15.2.

I wrote the rules before the run. The cycle counts as silent if more than half of the variance is below 20 Hz, which here means periods longer than 6 years. It comes back as loudness if the loudness correlates with it above 0.8. The hump around 27 days counts as a tone if it stands 3 dB over both neighbours and is narrower than a quarter of an octave. A single line has to be 10 times higher than the median of the 200 bins around it. I expected a clean whistle from the spots and nothing else.

There is no listening test in this post. Everything about hearing is arithmetic on samples plus textbook curves.

## The cycle

11 years become 11 Hz, so the main fact about the Sun is below hearing. In the sunspot series 72% of the variance sits under 20 Hz. A-weighting is the standard curve for how the ear treats frequencies and at 11 Hz it is at minus 68 dB. After it this part is zero to 5 decimals.

<figure class="fig">
<svg viewBox="0 0 680 326" role="img" aria-label="Power spectra of 3 daily series played at 44,100 days per second, from 6 Hz to 20 kHz, in 1/6 octave bands. Sunspots and F10.7 are highest at 11 Hz and fall to a small hump at 1,633 Hz. Ap is much flatter, with a narrow peak at 241 Hz and a weak hump near 1,633 Hz.">
  <rect x="56" y="66" width="89.4" height="200" style="fill:var(--muted);opacity:0.15;stroke:none"/>
  <line x1="56.0" y1="266.0" x2="660.0" y2="266.0" class="f-plain"/>
  <text x="48.0" y="270.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-30</text>
  <line x1="56.0" y1="237.4" x2="660.0" y2="237.4" class="f-plain"/>
  <text x="48.0" y="241.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-20</text>
  <line x1="56.0" y1="208.9" x2="660.0" y2="208.9" class="f-plain"/>
  <text x="48.0" y="212.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-10</text>
  <line x1="56.0" y1="180.3" x2="660.0" y2="180.3" class="f-plain"/>
  <text x="48.0" y="184.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="151.7" x2="660.0" y2="151.7" class="f-plain"/>
  <text x="48.0" y="155.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="56.0" y1="123.1" x2="660.0" y2="123.1" class="f-plain"/>
  <text x="48.0" y="127.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="56.0" y1="94.6" x2="660.0" y2="94.6" class="f-plain"/>
  <text x="48.0" y="98.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="56.0" y1="66.0" x2="660.0" y2="66.0" class="f-plain"/>
  <text x="48.0" y="70.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="93.9" y1="266.0" x2="93.9" y2="271.0" class="f-plain"/>
  <text x="93.9" y="284.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="264.9" y1="266.0" x2="264.9" y2="271.0" class="f-plain"/>
  <text x="264.9" y="284.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="435.8" y1="266.0" x2="435.8" y2="271.0" class="f-plain"/>
  <text x="435.8" y="284.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,000</text>
  <line x1="606.7" y1="266.0" x2="606.7" y2="271.0" class="f-plain"/>
  <text x="606.7" y="284.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10,000</text>
  <text x="660.0" y="300.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">Hz</text>
  <line x1="100.8" y1="62.0" x2="100.8" y2="266.0" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="100.8" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11 years</text>
  <line x1="278.8" y1="62.0" x2="278.8" y2="266.0" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="278.8" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">year</text>
  <line x1="330.3" y1="62.0" x2="330.3" y2="266.0" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="330.3" y="42.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">half a year</text>
  <line x1="472.2" y1="62.0" x2="472.2" y2="266.0" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="472.2" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">27 days</text>
  <line x1="572.4" y1="62.0" x2="572.4" y2="266.0" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="572.4" y="56.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">week</text>
  <polyline points="56.5,128.0 73.7,148.0 90.8,114.9 99.4,76.8 108.0,106.4 116.6,112.3 125.1,118.7 133.7,142.2 142.3,146.0 150.9,123.7 159.4,144.0 168.0,163.4 176.6,164.1 185.2,159.0 193.7,150.0 202.3,162.6 210.9,149.4 219.5,151.6 228.0,170.9 236.6,165.5 245.2,170.5 253.8,174.0 262.3,167.5 270.9,167.7 279.5,157.5 288.1,163.9 296.6,167.2 305.2,171.4 313.8,170.7 322.4,178.9 331.0,179.9 339.5,172.7 348.1,179.4 356.7,181.1 365.3,182.7 373.8,184.2 382.4,184.1 391.0,186.1 399.6,183.6 408.1,190.1 416.7,194.6 425.3,188.4 433.9,190.3 442.4,192.0 451.0,187.3 459.6,184.3 468.2,174.8 476.7,175.7 485.3,189.6 493.9,195.6 502.5,202.0 511.0,205.5 519.6,208.5 528.2,211.6 536.8,216.5 545.3,221.7 553.9,220.2 562.5,225.1 571.1,227.4 579.7,229.9 588.2,229.9 596.8,230.0 605.4,230.0 614.0,230.7 622.5,231.7 631.1,232.9 639.7,234.1 648.3,235.0 656.8,233.7" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 3"/>
  <polyline points="56.5,177.0 73.7,161.1 90.8,144.3 99.4,126.0 108.0,164.9 116.6,148.1 125.1,143.8 133.7,160.2 142.3,163.1 150.9,168.7 159.4,157.4 168.0,152.2 176.6,172.2 185.2,161.9 193.7,166.4 202.3,177.5 210.9,171.9 219.5,172.5 228.0,178.7 236.6,169.1 245.2,176.4 253.8,173.0 262.3,171.6 270.9,170.6 279.5,178.4 288.1,187.0 296.6,186.0 305.2,181.9 313.8,181.2 322.4,181.2 331.0,162.7 339.5,183.0 348.1,188.1 356.7,188.0 365.3,188.2 373.8,187.7 382.4,184.4 391.0,187.0 399.6,182.9 408.1,189.4 416.7,189.8 425.3,189.6 433.9,189.8 442.4,189.7 451.0,184.5 459.6,184.5 468.2,178.7 476.7,178.9 485.3,187.1 493.9,191.7 502.5,187.1 511.0,190.0 519.6,182.6 528.2,187.9 536.8,192.2 545.3,191.1 553.9,186.0 562.5,193.2 571.1,191.6 579.7,192.9 588.2,195.2 596.8,197.2 605.4,197.1 614.0,199.0 622.5,202.3 631.1,203.9 639.7,205.3 648.3,206.7 656.8,208.4" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <polyline points="56.5,136.8 73.7,167.6 90.8,117.1 99.4,77.8 108.0,103.7 116.6,116.0 125.1,117.0 133.7,140.0 142.3,154.8 150.9,124.6 159.4,140.0 168.0,151.3 176.6,156.1 185.2,167.2 193.7,153.4 202.3,165.5 210.9,162.4 219.5,157.9 228.0,168.4 236.6,168.0 245.2,174.1 253.8,174.7 262.3,167.7 270.9,167.4 279.5,161.5 288.1,167.1 296.6,173.3 305.2,174.3 313.8,174.0 322.4,179.3 331.0,180.6 339.5,174.0 348.1,176.8 356.7,176.5 365.3,179.5 373.8,180.5 382.4,183.7 391.0,181.8 399.6,183.4 408.1,184.1 416.7,186.5 425.3,186.3 433.9,186.4 442.4,186.7 451.0,183.3 459.6,179.4 468.2,173.3 476.7,174.1 485.3,184.6 493.9,188.2 502.5,192.5 511.0,197.1 519.6,195.4 528.2,199.9 536.8,207.2 545.3,212.2 553.9,216.4 562.5,220.9 571.1,222.5 579.7,226.7 588.2,228.3 596.8,232.7 605.4,234.7 614.0,238.0 622.5,241.7 631.1,243.6 639.7,245.8 648.3,247.1 656.8,248.2" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">dB over own mean</text>
  <polyline points="56.0,312.0 82.0,312.0" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="90.0" y="316.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">sunspots</text>
  <polyline points="186.0,312.0 212.0,312.0" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 3"/>
  <text x="220.0" y="316.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F10.7</text>
  <polyline points="316.0,312.0 342.0,312.0" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>
  <text x="350.0" y="316.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Ap</text>
</svg>
<figcaption>Spectra in 1/6 octave bands. The grey area on the left is below 20 Hz, where a listener gets nothing as pitch.</figcaption>
</figure>

| series | below 20 Hz | 24 to 31 days | 24 to 31 days, A-weighted |
|---|---|---|---|
| sunspots | 71.9% | 5.7% | 32.0% |
| F10.7 | 75.3% | 5.0% | 39.3% |
| Ap | 7.5% | 6.4% | 11.2% |

But the cycle comes back as loudness. I removed everything below 20 Hz and computed the standard deviation of the rest inside every 365 days. It follows the yearly mean of the sunspot number with a correlation of 0.95 and its range is 21 dB. My written rule said RMS, which keeps the slow leftovers of the filter. With RMS the correlation is 0.92. So the file should flutter 11 times a second. It manages only about 7 flutters before it ends.

<figure class="fig">
<svg viewBox="0 0 680 248" role="img" aria-label="Yearly mean sunspot number from 1947 to 2025 as bars and the standard deviation of the sunspot signal above 20 Hz as a line. Both go up and down together through cycles 18 to 25, correlation 0.95.">
  <line x1="56.0" y1="220.0" x2="624.0" y2="220.0" class="f-plain"/>
  <text x="48.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="158.0" x2="624.0" y2="158.0" class="f-plain"/>
  <text x="48.0" y="162.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56.0" y1="96.0" x2="624.0" y2="96.0" class="f-plain"/>
  <text x="48.0" y="100.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="56.0" y1="34.0" x2="624.0" y2="34.0" class="f-plain"/>
  <text x="48.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="632.0" y="224.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="632.0" y="162.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">30</text>
  <text x="632.0" y="100.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">60</text>
  <text x="632.0" y="38.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">90</text>
  <rect x="56.8" y="88.8" width="5.7" height="131.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="64.1" y="96.6" width="5.7" height="123.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="71.4" y="107.2" width="5.7" height="112.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="78.6" y="148.8" width="5.7" height="71.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="85.9" y="161.8" width="5.7" height="58.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="93.2" y="193.4" width="5.7" height="26.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="100.5" y="209.7" width="5.7" height="10.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="107.8" y="213.4" width="5.7" height="6.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="115.1" y="182.3" width="5.7" height="37.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="122.3" y="86.5" width="5.7" height="133.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="129.6" y="49.2" width="5.7" height="170.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="136.9" y="57.8" width="5.7" height="162.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="144.2" y="85.0" width="5.7" height="135.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="151.5" y="130.0" width="5.7" height="90.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="158.7" y="174.4" width="5.7" height="45.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="166.0" y="188.4" width="5.7" height="31.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="173.3" y="196.3" width="5.7" height="23.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="180.6" y="210.3" width="5.7" height="9.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="187.9" y="205.6" width="5.7" height="14.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="195.2" y="170.9" width="5.7" height="49.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="202.4" y="135.7" width="5.7" height="84.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="209.7" y="129.3" width="5.7" height="90.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="217.0" y="127.0" width="5.7" height="93.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="224.3" y="129.9" width="5.7" height="90.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="231.6" y="164.3" width="5.7" height="55.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="238.9" y="161.1" width="5.7" height="58.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="246.1" y="187.9" width="5.7" height="32.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="253.4" y="189.9" width="5.7" height="30.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="260.7" y="207.2" width="5.7" height="12.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="268.0" y="207.7" width="5.7" height="12.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="275.3" y="191.6" width="5.7" height="28.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="282.5" y="130.3" width="5.7" height="89.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="289.8" y="83.4" width="5.7" height="136.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="297.1" y="88.5" width="5.7" height="131.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="304.4" y="96.0" width="5.7" height="124.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="311.7" y="122.5" width="5.7" height="97.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="319.0" y="165.9" width="5.7" height="54.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="326.2" y="186.0" width="5.7" height="34.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="333.5" y="208.0" width="5.7" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="340.8" y="210.7" width="5.7" height="9.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="348.1" y="195.4" width="5.7" height="24.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="355.4" y="136.0" width="5.7" height="84.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="362.6" y="88.1" width="5.7" height="131.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="369.9" y="102.5" width="5.7" height="117.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="377.2" y="93.7" width="5.7" height="126.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="384.5" y="144.5" width="5.7" height="75.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="391.8" y="172.6" width="5.7" height="47.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="399.1" y="194.9" width="5.7" height="25.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="406.3" y="205.5" width="5.7" height="14.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="413.6" y="213.1" width="5.7" height="6.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="420.9" y="200.1" width="5.7" height="19.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="428.2" y="163.1" width="5.7" height="56.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="435.5" y="133.0" width="5.7" height="87.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="442.7" y="111.6" width="5.7" height="108.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="450.0" y="112.2" width="5.7" height="107.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="457.3" y="121.1" width="5.7" height="98.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="464.6" y="162.3" width="5.7" height="57.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="471.9" y="180.1" width="5.7" height="39.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="479.2" y="192.9" width="5.7" height="27.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="486.4" y="204.4" width="5.7" height="15.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="493.7" y="213.4" width="5.7" height="6.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="501.0" y="217.5" width="5.7" height="2.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="508.3" y="216.1" width="5.7" height="3.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="515.6" y="204.2" width="5.7" height="15.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="522.9" y="166.6" width="5.7" height="53.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="530.1" y="167.4" width="5.7" height="52.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="537.4" y="160.9" width="5.7" height="59.1" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="544.7" y="151.4" width="5.7" height="68.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="552.0" y="178.0" width="5.7" height="42.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="559.3" y="196.8" width="5.7" height="23.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="566.5" y="207.3" width="5.7" height="12.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="573.8" y="215.7" width="5.7" height="4.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="581.1" y="217.8" width="5.7" height="2.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="588.4" y="214.3" width="5.7" height="5.7" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="595.7" y="200.0" width="5.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="603.0" y="163.8" width="5.7" height="56.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="610.2" y="143.1" width="5.7" height="76.9" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="617.5" y="123.7" width="5.7" height="96.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <polyline points="59.6,61.2 66.9,71.2 74.2,103.7 81.5,127.2 88.8,110.1 96.1,155.6 103.3,174.0 110.6,189.9 117.9,144.1 125.2,96.6 132.5,76.2 139.7,78.0 147.0,104.1 154.3,104.6 161.6,140.8 168.9,159.4 176.2,163.4 183.4,190.2 190.7,174.6 198.0,147.2 205.3,106.8 212.6,137.6 219.8,101.6 227.1,137.2 234.4,149.0 241.7,138.7 249.0,149.7 256.3,150.5 263.5,172.0 270.8,184.6 278.1,162.7 285.4,118.7 292.7,96.0 299.9,90.2 307.2,79.1 314.5,102.3 321.8,135.2 329.1,148.7 336.4,179.3 343.6,180.3 350.9,168.5 358.2,117.5 365.5,98.9 372.8,87.2 380.1,92.5 387.3,122.8 394.6,148.3 401.9,166.1 409.2,180.1 416.5,192.0 423.7,177.7 431.0,146.1 438.3,105.4 445.6,105.2 452.9,102.2 460.2,123.8 467.4,126.9 474.7,151.2 482.0,161.8 489.3,178.7 496.6,192.6 503.8,201.2 511.1,202.0 518.4,186.9 525.7,144.5 533.0,146.7 540.3,145.2 547.5,141.4 554.8,154.5 562.1,173.0 569.4,177.9 576.7,200.0 583.9,205.7 591.2,194.0 598.5,169.7 605.8,146.8 613.1,134.5 620.4,111.4" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <line x1="77.0" y1="220.0" x2="77.0" y2="225.0" class="f-plain"/>
  <text x="77.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1950</text>
  <line x1="149.9" y1="220.0" x2="149.9" y2="225.0" class="f-plain"/>
  <text x="149.9" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1960</text>
  <line x1="222.7" y1="220.0" x2="222.7" y2="225.0" class="f-plain"/>
  <text x="222.7" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1970</text>
  <line x1="295.6" y1="220.0" x2="295.6" y2="225.0" class="f-plain"/>
  <text x="295.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1980</text>
  <line x1="368.5" y1="220.0" x2="368.5" y2="225.0" class="f-plain"/>
  <text x="368.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1990</text>
  <line x1="441.3" y1="220.0" x2="441.3" y2="225.0" class="f-plain"/>
  <text x="441.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2000</text>
  <line x1="514.2" y1="220.0" x2="514.2" y2="225.0" class="f-plain"/>
  <text x="514.2" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2010</text>
  <line x1="587.1" y1="220.0" x2="587.1" y2="225.0" class="f-plain"/>
  <text x="587.1" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">sunspot number, yearly mean</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-label f-accent" style="font-size:11px">std. dev. above 20 Hz</text>
</svg>
<figcaption>What is left after removing everything below 20 Hz gets louder and quieter with the cycle. Line: standard deviation inside 365 days, from 6.9 to 76.9. Bars: the cycle itself.</figcaption>
</figure>

## The rotation

The whistle exists, but I would call it coloured hiss. For sunspots the hump is at 1,637 Hz, which is 26.9 days. It stands 5.7 and 3.8 dB above its neighbours. Its width at half of the power is 0.15 octaves, about 2 semitones. By my rule it is a tone.

The autocorrelation is less generous. After removing slow variations it is 0.26 at 27 days, 0.16 at 54 and 0.11 at 81. Spot groups rarely live longer than one or 2 rotations, so my guess is that the whistle keeps starting again from a new phase.

Ap failed the rule. Its hump is 0.43 octaves wide and one of the neighbours is only 2.9 dB down. My first run used a finer spectrum and put the Ap maximum at 29.47 days. The Moon goes through its phases in 29.53 days, which would make a much better title. Then I computed the line at the lunar period directly on the whole record. It is 3.9 times the median, against the 10 that I asked for. With other windows the maximum sits at 25.6 or 26.9 days. It wanders over the hump and I see no Moon in it.

## The only clean note

I ran the 10 times rule over every bin above 156 Hz, 14,050 bins per series. Pure noise should give about 14 hits. The sunspots gave 14, F10.7 gave 9. Their highest bins are 12.9 and 14.4 times the median, so I take them as noise.

A full year is at 121 Hz, too low for this scan. I computed this line separately and it did not pass anywhere, with 8.1 in F10.7, 4.4 in the sunspots and 3.2 in Ap. In the F10.7 column corrected for the distance to the Sun the 8.1 becomes 3.4, so a part of it was only the Earth coming closer and going away.

Ap gave 30, more than twice the noise. One of them is far above the rest. It is at 241 Hz, 40 cents below B3, the period is 182.7 days. This bin is 91.5 times the median of its neighbours, the next one in Ap has 15.2. In the first half of the record the line is 48 times the median, in the second 37. Among the other 29 one is 2 bins away from the line, at 185 days. 4 more sit between 13.5 and 14.1 days and 2 at 9.0 days, which is close to the rotation divided by 2 and by 3. I can't tell which of the rest are noise.

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="Raw spectrum bins of Ap between 200 and 285 Hz. One bin at 241.3 Hz is far above the rest.">
  <line x1="56.0" y1="220.0" x2="660.0" y2="220.0" class="f-plain"/>
  <text x="48.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="182.8" x2="660.0" y2="182.8" class="f-plain"/>
  <text x="48.0" y="186.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="56.0" y1="145.6" x2="660.0" y2="145.6" class="f-plain"/>
  <text x="48.0" y="149.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="56.0" y1="108.4" x2="660.0" y2="108.4" class="f-plain"/>
  <text x="48.0" y="112.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="56.0" y1="71.2" x2="660.0" y2="71.2" class="f-plain"/>
  <text x="48.0" y="75.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="56.0" y1="34.0" x2="660.0" y2="34.0" class="f-plain"/>
  <text x="48.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="62.1" y="215.5" width="9.1" height="4.5" style="fill:var(--muted);stroke:none"/>
  <rect x="72.6" y="215.1" width="9.1" height="4.9" style="fill:var(--muted);stroke:none"/>
  <rect x="83.1" y="219.7" width="9.1" height="0.3" style="fill:var(--muted);stroke:none"/>
  <rect x="93.6" y="213.5" width="9.1" height="6.5" style="fill:var(--muted);stroke:none"/>
  <rect x="104.1" y="217.2" width="9.1" height="2.8" style="fill:var(--muted);stroke:none"/>
  <rect x="114.6" y="215.5" width="9.1" height="4.5" style="fill:var(--muted);stroke:none"/>
  <rect x="125.1" y="219.9" width="9.1" height="0.1" style="fill:var(--muted);stroke:none"/>
  <rect x="135.6" y="214.1" width="9.1" height="5.9" style="fill:var(--muted);stroke:none"/>
  <rect x="146.1" y="218.2" width="9.1" height="1.8" style="fill:var(--muted);stroke:none"/>
  <rect x="156.6" y="217.5" width="9.1" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="167.1" y="217.3" width="9.1" height="2.7" style="fill:var(--muted);stroke:none"/>
  <rect x="177.6" y="215.9" width="9.1" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="188.1" y="218.2" width="9.1" height="1.8" style="fill:var(--muted);stroke:none"/>
  <rect x="198.6" y="219.1" width="9.1" height="0.9" style="fill:var(--muted);stroke:none"/>
  <rect x="209.1" y="210.0" width="9.1" height="10.0" style="fill:var(--muted);stroke:none"/>
  <rect x="219.6" y="219.6" width="9.1" height="0.4" style="fill:var(--muted);stroke:none"/>
  <rect x="230.1" y="215.2" width="9.1" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="240.6" y="219.5" width="9.1" height="0.5" style="fill:var(--muted);stroke:none"/>
  <rect x="251.1" y="217.5" width="9.1" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="261.6" y="219.5" width="9.1" height="0.5" style="fill:var(--muted);stroke:none"/>
  <rect x="272.1" y="219.2" width="9.1" height="0.8" style="fill:var(--muted);stroke:none"/>
  <rect x="282.6" y="214.5" width="9.1" height="5.5" style="fill:var(--muted);stroke:none"/>
  <rect x="293.1" y="219.8" width="9.1" height="0.2" style="fill:var(--muted);stroke:none"/>
  <rect x="303.6" y="218.9" width="9.1" height="1.1" style="fill:var(--muted);stroke:none"/>
  <rect x="314.1" y="213.4" width="9.1" height="6.6" style="fill:var(--muted);stroke:none"/>
  <rect x="324.6" y="197.6" width="9.1" height="22.4" style="fill:var(--muted);stroke:none"/>
  <rect x="335.1" y="217.8" width="9.1" height="2.2" style="fill:var(--muted);stroke:none"/>
  <rect x="345.6" y="49.8" width="9.1" height="170.2" style="fill:var(--accent);stroke:none"/>
  <rect x="356.1" y="219.0" width="9.1" height="1.0" style="fill:var(--muted);stroke:none"/>
  <rect x="366.6" y="213.8" width="9.1" height="6.2" style="fill:var(--muted);stroke:none"/>
  <rect x="377.1" y="216.1" width="9.1" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="387.6" y="217.9" width="9.1" height="2.1" style="fill:var(--muted);stroke:none"/>
  <rect x="398.1" y="218.7" width="9.1" height="1.3" style="fill:var(--muted);stroke:none"/>
  <rect x="408.6" y="219.4" width="9.1" height="0.6" style="fill:var(--muted);stroke:none"/>
  <rect x="419.1" y="219.3" width="9.1" height="0.7" style="fill:var(--muted);stroke:none"/>
  <rect x="429.6" y="219.8" width="9.1" height="0.2" style="fill:var(--muted);stroke:none"/>
  <rect x="440.1" y="219.7" width="9.1" height="0.3" style="fill:var(--muted);stroke:none"/>
  <rect x="450.6" y="217.0" width="9.1" height="3.0" style="fill:var(--muted);stroke:none"/>
  <rect x="461.1" y="219.9" width="9.1" height="0.1" style="fill:var(--muted);stroke:none"/>
  <rect x="471.6" y="218.7" width="9.1" height="1.3" style="fill:var(--muted);stroke:none"/>
  <rect x="482.1" y="217.4" width="9.1" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="492.6" y="215.3" width="9.1" height="4.7" style="fill:var(--muted);stroke:none"/>
  <rect x="503.1" y="218.7" width="9.1" height="1.3" style="fill:var(--muted);stroke:none"/>
  <rect x="513.6" y="219.1" width="9.1" height="0.9" style="fill:var(--muted);stroke:none"/>
  <rect x="524.1" y="216.2" width="9.1" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="534.6" y="219.4" width="9.1" height="0.6" style="fill:var(--muted);stroke:none"/>
  <rect x="545.1" y="217.4" width="9.1" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="555.6" y="216.0" width="9.1" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="566.1" y="218.4" width="9.1" height="1.6" style="fill:var(--muted);stroke:none"/>
  <rect x="576.6" y="215.6" width="9.1" height="4.4" style="fill:var(--muted);stroke:none"/>
  <rect x="587.1" y="216.8" width="9.1" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="597.6" y="217.7" width="9.1" height="2.3" style="fill:var(--muted);stroke:none"/>
  <rect x="608.1" y="219.6" width="9.1" height="0.4" style="fill:var(--muted);stroke:none"/>
  <rect x="618.6" y="216.6" width="9.1" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="629.1" y="217.2" width="9.1" height="2.8" style="fill:var(--muted);stroke:none"/>
  <rect x="639.6" y="218.1" width="9.1" height="1.9" style="fill:var(--muted);stroke:none"/>
  <text x="69.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="205.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">220</text>
  <text x="341.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="476.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">260</text>
  <text x="612.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">280</text>
  <text x="660.0" y="254.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">Hz</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">times the median</text>
  <text x="362.2" y="61.8" text-anchor="start" class="f-mono f-accent" style="font-size:12px">241.3 Hz</text>
</svg>
<figcaption>Ap, single bins from 200 to 285 Hz, relative to the median of 200 neighbours of the tall bin. It is 91.5 times higher and its period is 182.7 days.</figcaption>
</figure>

Half a year means the Earth. The mean Ap is 15.4 in March and 15.8 in September, against 12.0 in June and 10.6 in December. The fitted wave peaks around March 29 and September 28, about a week after the equinoxes. Cortie wrote about these maxima in spring and autumn in 1912. Russell and McPherron explained in 1973 how the tilt of the Earth's axis and of its magnetic dipole lets more of the solar wind in at these seasons. Their effect alone should peak around April 5, a week later than my wave, so it may not be the whole story. I knew about it from reading, but I didn't expect it to be the cleanest thing in the sound.

On paper one can hear it. The tone is 19.8 dB over the noise density around it and a tone near 250 Hz becomes audible at about 17 or 18 dB in the classic measurements. The margin is 2 or 3 dB.

## Is the note of cycle 25 over

The newest half year of the file is 4 milliseconds long. Last October NASA and NOAA announced that the Sun had reached its maximum period. The 13 month smoothing needs 6 months after the point, so on April 5 the last smoothed value is 159.3 for September 2024. The curve is still rising, although the highest month is August 2024 with 216.0 and March gave 134.2.

In 6 of the 24 finished cycles the smoothed curve made a record, stayed under it for 6 months or more and then broke it. In cycle 24 the record of March 2012 stood for 17 months. I counted only records above 75% of the final maximum, a condition that was not in the rules written before the run.

## What I didn't check

I used one rate and one mapping, where a storm in Ap is a click and nothing softens it. 654 days of F10.7 are interpolated, 633 of them before 1965. One day, March 7, 2011, has F10.7 of 938.6 against a median of 108.7 and I left it in. The noise in Ap is not stationary and 0.65 seconds is not a steady tone, so I would not argue about a margin of 2 dB.
