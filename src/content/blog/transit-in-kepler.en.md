---
title: "10,000 trial periods find Kepler-10c and miss Kepler-10b"
description: "A box search over the Kepler light curve of Kepler-10. 10,000 periods even in period found the weaker planet c in 20 runs of 20 and never b, the same number even in frequency found b in 25 of 25 and then lost c. What I almost took for noise was the same planet c again."
date: 2018-08-04
lang: en
translationKey: transit-in-kepler
tags: ["open-data", "algorithms", "statistics"]
---

I gave a transit search 10,000 trial periods spread evenly from 0.4 to 50 days and the light curve of Kepler-10. I shifted the grid 20 times by a random fraction of its step. The answer was 45.29 days in all 20 runs, with S/N about 115.

This is a real planet, Kepler-10c. But the same star has Kepler-10b with a period of 0.8375 days and S/N 169.6 in the same data. The search did not see it once.

I had read many times how transits are found: the star dims a little, the dimming repeats, the period comes out. The list of periods to try always looked trivial to me, you take enough of them and go. I never checked what "enough" means.

## The setup

The long cadence files are public at MAST, one point per 29.4 minutes. For Kepler-10 (KIC 11904151) there are 15 files, in the other 3 quarters the star fell on the detector module that died in January 2010. I took the corrected flux (pipeline 9.3) and removed every point with a nonzero quality flag. 51,973 points became 45,498, over 1,470 days. The rule is blunt, so I checked that it does not eat the transits: it removes 12.5% of the points inside the transits of b and 12.4% outside.

Every continuous piece is divided by its running median with a window of 1 day. After that 16 points above 4 sigma are dropped. What remains has a scatter of 57.6 ppm per point.

The search is box least squares by Kovács, Zucker and Mazeh from 2002: fold the points on a trial period, slide a box, keep the deepest one. It is numpy 1.15 on Python 3.6, astropy 3.0 reads the files. The numpy loop would need about 5 minutes for the full grid, so I killed it and moved the inner part to C. On 441 frequencies both give exactly the same S/N. S/N here is the depth of the box over the expected error of that depth, as if the noise were white.

<figure class="fig">
<svg viewBox="0 0 680 272" role="img" aria-label="Brightness of Kepler-10 folded on 2 periods, against hours from mid transit. Left, planet b, 0.8375 days: flat at 0, a dip about 2 hours wide, bottom near minus 187 ppm. Right, planet c, 45.294 days: a dip about 7 hours wide, bottom near minus 448 ppm, with raised shoulders of 20 to 50 ppm on both sides.">
  <line x1="64.0" y1="59.7" x2="346.0" y2="59.7" class="f-plain"/>
  <text x="56.0" y="63.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="91.7" x2="346.0" y2="91.7" class="f-plain"/>
  <text x="56.0" y="95.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−100</text>
  <line x1="64.0" y1="123.8" x2="346.0" y2="123.8" class="f-plain"/>
  <text x="56.0" y="127.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−200</text>
  <line x1="64.0" y1="155.9" x2="346.0" y2="155.9" class="f-plain"/>
  <text x="56.0" y="159.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−300</text>
  <line x1="64.0" y1="187.9" x2="346.0" y2="187.9" class="f-plain"/>
  <text x="56.0" y="191.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−400</text>
  <line x1="64.0" y1="220.0" x2="346.0" y2="220.0" class="f-plain"/>
  <text x="56.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−500</text>
  <text x="64.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−4</text>
  <text x="134.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−2</text>
  <text x="205.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="275.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="346.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <circle cx="66.2" cy="58.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="72.2" cy="59.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="78.1" cy="59.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="84.0" cy="57.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="89.9" cy="59.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="95.8" cy="57.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="101.7" cy="59.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="107.6" cy="59.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="113.5" cy="59.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="119.4" cy="58.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="125.3" cy="57.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="131.2" cy="58.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="137.1" cy="60.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="143.0" cy="59.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="148.9" cy="58.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="154.8" cy="61.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="160.7" cy="59.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="166.6" cy="62.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="172.5" cy="78.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="178.4" cy="95.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="184.3" cy="110.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="190.2" cy="117.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="196.1" cy="117.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="202.0" cy="119.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="208.0" cy="119.8" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="213.9" cy="117.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="219.8" cy="115.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="225.7" cy="110.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="231.6" cy="94.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="237.5" cy="76.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="243.4" cy="63.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="249.3" cy="58.4" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="255.2" cy="59.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="261.1" cy="60.9" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="267.0" cy="57.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="272.9" cy="58.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="278.8" cy="60.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="284.7" cy="59.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="290.6" cy="59.0" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="296.5" cy="60.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="302.4" cy="59.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="308.3" cy="59.7" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="314.2" cy="60.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="320.1" cy="60.6" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="326.0" cy="59.1" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="331.9" cy="59.3" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="337.8" cy="59.5" r="2.6" style="fill:var(--accent);stroke:none"/>
  <circle cx="343.8" cy="59.2" r="2.6" style="fill:var(--accent);stroke:none"/>
  <text x="346.0" y="20.0" text-anchor="end" class="f-mono f-accent" style="font-size:12px">b, 0.8375</text>
  <line x1="380.0" y1="59.7" x2="662.0" y2="59.7" class="f-plain"/>
  <line x1="380.0" y1="91.7" x2="662.0" y2="91.7" class="f-plain"/>
  <line x1="380.0" y1="123.8" x2="662.0" y2="123.8" class="f-plain"/>
  <line x1="380.0" y1="155.9" x2="662.0" y2="155.9" class="f-plain"/>
  <line x1="380.0" y1="187.9" x2="662.0" y2="187.9" class="f-plain"/>
  <line x1="380.0" y1="220.0" x2="662.0" y2="220.0" class="f-plain"/>
  <text x="380.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−12</text>
  <text x="427.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−8</text>
  <text x="474.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−4</text>
  <text x="521.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="568.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="615.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="662.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <circle cx="382.9" cy="55.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="388.8" cy="55.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="394.7" cy="57.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="400.6" cy="56.1" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="406.4" cy="54.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="412.3" cy="49.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="418.2" cy="45.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="424.1" cy="46.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="429.9" cy="44.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="435.8" cy="44.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="441.7" cy="52.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="447.6" cy="51.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="453.4" cy="53.1" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="459.3" cy="43.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="465.2" cy="49.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="471.1" cy="46.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="476.9" cy="56.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="482.8" cy="111.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="488.7" cy="170.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="494.6" cy="186.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="500.4" cy="196.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="506.3" cy="193.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="512.2" cy="202.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="518.1" cy="203.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="523.9" cy="203.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="529.8" cy="198.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="535.7" cy="190.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="541.6" cy="197.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="547.4" cy="190.1" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="553.3" cy="171.1" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="559.2" cy="123.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="565.1" cy="52.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="570.9" cy="55.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="576.8" cy="51.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="582.7" cy="44.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="588.6" cy="47.7" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="594.4" cy="54.0" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="600.3" cy="47.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="606.2" cy="52.9" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="612.1" cy="44.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="617.9" cy="49.5" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="623.8" cy="49.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="629.7" cy="47.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="635.6" cy="48.6" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="641.4" cy="58.8" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="647.3" cy="49.3" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="653.2" cy="53.2" r="2.6" style="fill:var(--ink);stroke:none"/>
  <circle cx="659.1" cy="56.4" r="2.6" style="fill:var(--ink);stroke:none"/>
  <text x="662.0" y="20.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">c, 45.294</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">ppm</text>
  <text x="363.0" y="260.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">hours from mid transit</text>
</svg>
<figcaption>Flattened curve folded on both periods, means in bins of 10 minutes (b) and 30 minutes (c). Most of the shoulder next to c is made by my 1 day median.</figcaption>
</figure>

The depths are compared with the DR25 catalog, which Thompson and colleagues published this spring. HAT-P-7 is the easy control, the dip is 35 times deeper than that of Kepler-10b.

| planet | depth, ppm | catalog, ppm |
|---|---|---|
| Kepler-10b | 182.8 ± 1.4 | 190.4 |
| Kepler-10c | 452.0 ± 5.7 | 477.1 |
| HAT-P-7b | 6556.3 ± 1.5 | 6674.7 |

I am lower by 2 to 5%. My limit, written before the run, was 10%. But the errors are much smaller than the differences, I come back to this below.

## 60 peaks and 2 planets

On a dense grid of 360,000 frequencies the first peak is b and the second is c. Then come twice the period of b with S/N 118.5 and half of it with 111.9. In theory both should have 0.71 of the main peak, I got 0.70 and 0.66.

I expected something unrelated after a few such echoes. Before the run I wrote a rule: a period is an echo if it is m/n of a planet with both numbers up to 6. By this rule half of the 40 strongest peaks were something else. Then I looked at them. They were 7, 8, 10, 11 periods of b, 1/7 and 1/8 of c, the same kind further on. My rule was too short.

With a wider rule, drawn after looking, all 60 strongest peaks belong to the 2 planets, 41 to b and 19 to c. A random period would pass it in 8% of cases. With the transits of b cut out, the first peak is c with 126.5.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="60 strongest periods of the search from 0.4 to 50 days, as stems on a logarithmic period axis. 41 belong to planet b, 19 to planet c. Planet b 0.8375 days S/N 169.6, planet c 45.29 days S/N 120.1, twice the period of b 118.5, half of it 111.9. No stem is unrelated.">
  <line x1="56.0" y1="220.0" x2="662.0" y2="220.0" class="f-plain"/>
  <text x="48.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="168.3" x2="662.0" y2="168.3" class="f-plain"/>
  <text x="48.0" y="172.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="56.0" y1="116.7" x2="662.0" y2="116.7" class="f-plain"/>
  <text x="48.0" y="120.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56.0" y1="65.0" x2="662.0" y2="65.0" class="f-plain"/>
  <text x="48.0" y="69.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="89.4" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <text x="173.9" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="258.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="369.9" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="454.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="538.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="650.4" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="152.3" y1="220" x2="152.3" y2="44.8" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="638.3" y1="220" x2="638.3" y2="95.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="236.7" y1="220" x2="236.7" y2="97.5" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="67.8" y1="220" x2="67.8" y2="104.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="286.1" y1="220" x2="286.1" y2="121.1" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="553.9" y1="220" x2="553.9" y2="129.4" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="321.1" y1="220" x2="321.1" y2="134.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="348.3" y1="220" x2="348.3" y2="143.2" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="504.5" y1="220" x2="504.5" y2="145.8" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="370.5" y1="220" x2="370.5" y2="150.7" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="389.3" y1="220" x2="389.3" y2="155.2" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="201.6" y1="220" x2="201.6" y2="155.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="469.5" y1="220" x2="469.5" y2="155.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="405.6" y1="220" x2="405.6" y2="158.3" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="102.9" y1="220" x2="102.9" y2="161.1" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="442.3" y1="220" x2="442.3" y2="161.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="419.9" y1="220" x2="419.9" y2="162.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="432.7" y1="220" x2="432.7" y2="164.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="444.3" y1="220" x2="444.3" y2="166.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="589.0" y1="220" x2="589.0" y2="167.1" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="464.7" y1="220" x2="464.7" y2="169.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="454.9" y1="220" x2="454.9" y2="169.8" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="263.9" y1="220" x2="263.9" y2="170.3" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="401.3" y1="220" x2="401.3" y2="170.5" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="473.7" y1="220" x2="473.7" y2="173.1" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="497.4" y1="220" x2="497.4" y2="173.2" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="385.0" y1="220" x2="385.0" y2="173.6" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="490.0" y1="220" x2="490.0" y2="174.1" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="482.1" y1="220" x2="482.1" y2="174.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="304.9" y1="220" x2="304.9" y2="177.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="611.2" y1="220" x2="611.2" y2="178.6" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="526.7" y1="220" x2="526.7" y2="178.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="187.3" y1="220" x2="187.3" y2="179.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="510.9" y1="220" x2="510.9" y2="179.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="357.9" y1="220" x2="357.9" y2="179.5" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="517.2" y1="220" x2="517.2" y2="180.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="523.1" y1="220" x2="523.1" y2="180.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="346.3" y1="220" x2="346.3" y2="180.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="528.8" y1="220" x2="528.8" y2="180.9" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="335.5" y1="220" x2="335.5" y2="181.5" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="603.3" y1="220" x2="603.3" y2="181.5" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="117.2" y1="220" x2="117.2" y2="181.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="534.2" y1="220" x2="534.2" y2="182.9" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="214.5" y1="220" x2="214.5" y2="183.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="549.1" y1="220" x2="549.1" y2="183.5" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="585.3" y1="220" x2="585.3" y2="183.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="539.4" y1="220" x2="539.4" y2="184.3" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="359.9" y1="220" x2="359.9" y2="184.5" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="544.4" y1="220" x2="544.4" y2="184.7" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="576.1" y1="220" x2="576.1" y2="184.7" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="485.8" y1="220" x2="485.8" y2="184.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="570.2" y1="220" x2="570.2" y2="184.9" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="325.9" y1="220" x2="325.9" y2="185.0" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="581.8" y1="220" x2="581.8" y2="185.0" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="578.2" y1="220" x2="578.2" y2="185.2" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="316.9" y1="220" x2="316.9" y2="185.6" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="308.5" y1="220" x2="308.5" y2="186.1" style="stroke:var(--ink);stroke-width:1.6"/>
  <line x1="558.2" y1="220" x2="558.2" y2="186.6" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="562.4" y1="220" x2="562.4" y2="186.9" style="stroke:var(--accent);stroke-width:1.6"/>
  <line x1="595.4" y1="220" x2="595.4" y2="187.4" style="stroke:var(--accent);stroke-width:1.6"/>
  <text x="152.3" y="38.8" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">b 169.6</text>
  <text x="646.3" y="89.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">c 120.1</text>
  <text x="236.7" y="91.5" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">2P 118.5</text>
  <text x="61.8" y="98.4" text-anchor="start" class="f-mono f-accent" style="font-size:11px">P/2 111.9</text>
  <rect x="56" y="257" width="12" height="10" style="fill:var(--accent);stroke:none"/>
  <text x="74.0" y="266.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">b, its fractions and multiples</text>
  <rect x="306" y="257" width="12" height="10" style="fill:var(--ink);stroke:none"/>
  <text x="324.0" y="266.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">the same for c</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">S/N</text>
  <text x="662.0" y="266.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">period, days</text>
</svg>
<figcaption>60 strongest peaks of one spectrum, 360,000 frequencies. All of them are fractions or multiples of the 2 periods.</figcaption>
</figure>

As a control I searched for rises in place of dips. With both planets cut the strongest dip is 10.6 and the strongest rise is 12.4. I almost took 12.4 as the level of noise. Its period is 45.29 days though, so this is c again, the raised shoulders that are visible in the first figure.

## The shape of the grid

The peak of b is 0.00038 cycles per day wide at half height. The grid even in period has a step of 0.005 days. At the period of b this is 0.0071 cycles per day, 19 times wider than the peak. At the period of c the same step is 0.0000024. The grid spends its points on long periods and steps over the short one.

<figure class="fig">
<svg viewBox="0 0 680 344" role="img" aria-label="S/N around the frequency of planet b, plus and minus 0.004 cycles per day. The peak is 0.00038 wide at half height. Below are the points of 3 grids of about 10,000: even in period has 1 point in the whole window, even in log period has 14, even in frequency has 32.">
  <line x1="56.0" y1="170.0" x2="662.0" y2="170.0" class="f-plain"/>
  <text x="48.0" y="174.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="132.2" x2="662.0" y2="132.2" class="f-plain"/>
  <text x="48.0" y="136.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="56.0" y1="94.4" x2="662.0" y2="94.4" class="f-plain"/>
  <text x="48.0" y="98.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56.0" y1="56.7" x2="662.0" y2="56.7" class="f-plain"/>
  <text x="48.0" y="60.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <polyline points="56.0,163.5 56.8,163.5 57.5,163.7 58.3,164.1 59.0,164.1 59.8,164.6 60.5,165.0 61.3,165.1 62.1,165.3 62.8,165.4 63.6,165.6 64.3,165.8 65.1,165.7 65.8,165.7 66.6,165.8 67.4,165.9 68.1,165.9 68.9,165.6 69.6,165.4 70.4,165.5 71.2,165.4 71.9,165.5 72.7,165.4 73.4,165.4 74.2,165.5 74.9,165.6 75.7,165.8 76.5,166.2 77.2,166.5 78.0,166.5 78.7,166.9 79.5,167.1 80.2,167.2 81.0,167.2 81.8,167.4 82.5,167.4 83.3,167.4 84.0,167.5 84.8,167.4 85.5,167.3 86.3,167.3 87.1,167.8 87.8,167.8 88.6,167.4 89.3,167.1 90.1,167.1 90.8,167.3 91.6,167.4 92.4,167.6 93.1,167.6 93.9,167.3 94.6,167.1 95.4,167.1 96.1,167.1 96.9,167.0 97.7,167.5 98.4,167.7 99.2,167.8 99.9,168.0 100.7,168.0 101.5,168.1 102.2,168.2 103.0,168.2 103.7,168.2 104.5,168.2 105.2,168.3 106.0,168.1 106.8,167.7 107.5,167.3 108.3,167.2 109.0,167.0 109.8,166.8 110.5,166.6 111.3,166.4 112.1,166.2 112.8,166.2 113.6,165.9 114.3,165.7 115.1,165.6 115.8,165.6 116.6,165.8 117.4,165.8 118.1,165.9 118.9,165.9 119.6,166.0 120.4,165.8 121.1,165.8 121.9,165.6 122.7,165.6 123.4,165.4 124.2,165.3 124.9,165.3 125.7,165.1 126.4,165.0 127.2,165.0 128.0,165.0 128.7,165.0 129.5,164.8 130.2,164.8 131.0,164.7 131.8,164.7 132.5,164.8 133.3,164.8 134.0,164.8 134.8,164.8 135.5,164.9 136.3,164.9 137.1,164.8 137.8,164.7 138.6,164.6 139.3,164.7 140.1,164.6 140.8,164.7 141.6,164.6 142.4,164.4 143.1,164.0 143.9,163.7 144.6,163.4 145.4,163.3 146.1,163.2 146.9,163.1 147.7,162.9 148.4,163.2 149.2,163.3 149.9,163.4 150.7,163.3 151.4,163.0 152.2,163.0 153.0,162.9 153.7,162.7 154.5,162.4 155.2,162.4 156.0,162.2 156.7,162.0 157.5,161.9 158.3,161.6 159.0,161.4 159.8,161.4 160.5,161.0 161.3,160.8 162.1,160.7 162.8,160.5 163.6,160.2 164.3,160.1 165.1,160.0 165.8,159.8 166.6,159.7 167.4,159.5 168.1,159.4 168.9,159.4 169.6,159.5 170.4,159.5 171.1,159.4 171.9,159.5 172.7,159.6 173.4,159.6 174.2,159.7 174.9,159.6 175.7,159.6 176.4,159.4 177.2,159.5 178.0,159.5 178.7,159.5 179.5,159.4 180.2,159.4 181.0,159.6 181.7,159.7 182.5,159.8 183.3,160.1 184.0,160.0 184.8,160.0 185.5,159.6 186.3,159.6 187.0,159.4 187.8,159.2 188.6,159.0 189.3,158.9 190.1,158.9 190.8,158.8 191.6,158.5 192.3,158.5 193.1,158.3 193.9,158.1 194.6,157.8 195.4,157.5 196.1,157.7 196.9,157.6 197.7,157.5 198.4,157.5 199.2,157.4 199.9,157.5 200.7,157.5 201.4,157.6 202.2,157.8 203.0,157.8 203.7,157.9 204.5,158.1 205.2,158.2 206.0,157.9 206.7,158.5 207.5,158.8 208.3,158.7 209.0,158.9 209.8,159.1 210.5,158.9 211.3,158.9 212.0,158.8 212.8,158.9 213.6,159.1 214.3,159.1 215.1,159.0 215.8,158.9 216.6,158.7 217.3,158.5 218.1,158.4 218.9,158.5 219.6,158.3 220.4,158.3 221.1,158.2 221.9,158.2 222.7,158.3 223.4,158.1 224.2,158.2 224.9,158.3 225.7,158.4 226.4,158.4 227.2,158.4 228.0,158.3 228.7,158.6 229.5,158.5 230.2,158.5 231.0,158.6 231.7,158.3 232.5,158.4 233.3,158.4 234.0,158.4 234.8,158.3 235.5,158.6 236.3,158.8 237.0,159.1 237.8,159.2 238.6,159.5 239.3,159.6 240.1,159.8 240.8,159.9 241.6,159.9 242.3,159.7 243.1,159.7 243.9,159.8 244.6,160.0 245.4,160.1 246.1,159.9 246.9,160.3 247.6,160.3 248.4,160.3 249.2,160.5 249.9,160.6 250.7,160.8 251.4,160.7 252.2,160.9 252.9,161.1 253.7,161.4 254.5,161.6 255.2,162.0 256.0,162.3 256.7,162.4 257.5,162.4 258.3,162.4 259.0,162.5 259.8,162.4 260.5,162.1 261.3,161.9 262.0,161.5 262.8,161.3 263.6,161.0 264.3,160.7 265.1,160.4 265.8,160.0 266.6,159.7 267.3,159.4 268.1,159.1 268.9,158.9 269.6,158.9 270.4,158.8 271.1,158.7 271.9,158.8 272.6,158.9 273.4,158.8 274.2,158.8 274.9,159.1 275.7,159.3 276.4,159.2 277.2,158.9 277.9,158.8 278.7,158.3 279.5,158.3 280.2,158.0 281.0,157.8 281.7,157.8 282.5,157.5 283.3,156.6 284.0,155.7 284.8,155.2 285.5,154.5 286.3,153.9 287.0,153.0 287.8,152.5 288.6,152.3 289.3,151.9 290.1,151.4 290.8,151.3 291.6,151.0 292.3,150.8 293.1,151.7 293.9,152.5 294.6,153.0 295.4,153.1 296.1,153.6 296.9,154.6 297.6,155.0 298.4,155.5 299.2,156.1 299.9,156.9 300.7,158.0 301.4,159.0 302.2,160.2 302.9,161.2 303.7,162.2 304.5,162.5 305.2,163.0 306.0,163.2 306.7,163.7 307.5,163.9 308.2,164.0 309.0,163.6 309.8,163.5 310.5,163.1 311.3,162.7 312.0,162.4 312.8,162.0 313.6,161.7 314.3,161.3 315.1,161.3 315.8,160.9 316.6,160.4 317.3,159.6 318.1,159.4 318.9,158.9 319.6,158.0 320.4,157.1 321.1,155.8 321.9,154.8 322.6,154.4 323.4,153.8 324.2,151.4 324.9,149.2 325.7,148.6 326.4,148.5 327.2,148.2 327.9,147.9 328.7,144.8 329.5,144.0 330.2,143.8 331.0,143.2 331.7,141.6 332.5,141.0 333.2,140.2 334.0,138.5 334.8,137.7 335.5,136.6 336.3,134.2 337.0,132.8 337.8,131.5 338.5,129.3 339.3,126.8 340.1,124.6 340.8,122.1 341.6,119.5 342.3,116.7 343.1,113.4 343.8,109.7 344.6,107.1 345.4,103.1 346.1,100.5 346.9,97.4 347.6,94.9 348.4,92.4 349.2,90.4 349.9,88.6 350.7,85.8 351.4,81.5 352.2,78.0 352.9,74.8 353.7,71.5 354.5,65.0 355.2,60.6 356.0,55.4 356.7,50.3 357.5,46.4 358.2,43.4 359.0,41.8 359.8,43.0 360.5,47.2 361.3,50.5 362.0,55.4 362.8,60.2 363.5,65.0 364.3,71.0 365.1,74.1 365.8,77.4 366.6,81.4 367.3,85.4 368.1,88.7 368.8,90.1 369.6,91.9 370.4,94.1 371.1,96.7 371.9,99.5 372.6,102.5 373.4,105.5 374.1,109.1 374.9,112.5 375.7,115.6 376.4,118.5 377.2,121.3 377.9,123.8 378.7,125.9 379.5,128.1 380.2,130.4 381.0,132.4 381.7,134.2 382.5,135.8 383.2,137.3 384.0,138.6 384.8,139.9 385.5,141.0 386.3,142.0 387.0,142.9 387.8,143.9 388.5,144.9 389.3,145.7 390.1,146.7 390.8,147.7 391.6,148.6 392.3,149.4 393.1,150.3 393.8,151.5 394.6,152.5 395.4,153.5 396.1,154.6 396.9,155.5 397.6,156.6 398.4,157.3 399.1,158.0 399.9,158.1 400.7,158.5 401.4,159.1 402.2,159.3 402.9,159.6 403.7,159.9 404.4,160.2 405.2,160.5 406.0,160.9 406.7,161.0 407.5,161.2 408.2,161.5 409.0,161.5 409.8,161.5 410.5,162.0 411.3,162.1 412.0,162.4 412.8,163.0 413.5,163.3 414.3,163.7 415.1,164.0 415.8,163.1 416.6,161.9 417.3,160.9 418.1,159.9 418.8,159.0 419.6,158.1 420.4,156.9 421.1,156.2 421.9,155.4 422.6,154.8 423.4,154.1 424.1,153.3 424.9,152.6 425.7,152.3 426.4,152.2 427.2,152.2 427.9,152.2 428.7,152.2 429.4,152.5 430.2,152.6 431.0,153.0 431.7,153.8 432.5,154.3 433.2,155.0 434.0,155.7 434.8,156.4 435.5,157.2 436.3,158.1 437.0,158.8 437.8,159.4 438.5,160.0 439.3,160.5 440.1,161.3 440.8,161.8 441.6,162.2 442.3,162.0 443.1,161.7 443.8,161.7 444.6,161.5 445.4,161.3 446.1,161.7 446.9,161.6 447.6,161.7 448.4,161.6 449.1,161.4 449.9,161.7 450.7,161.6 451.4,161.8 452.2,161.8 452.9,161.7 453.7,161.9 454.4,161.7 455.2,161.7 456.0,161.8 456.7,162.0 457.5,162.2 458.2,162.2 459.0,162.4 459.7,162.7 460.5,162.5 461.3,162.9 462.0,163.1 462.8,163.2 463.5,163.0 464.3,162.6 465.1,162.6 465.8,162.5 466.6,162.4 467.3,162.4 468.1,162.5 468.8,162.6 469.6,162.8 470.4,163.0 471.1,163.1 471.9,163.3 472.6,163.4 473.4,163.4 474.1,163.1 474.9,163.0 475.7,162.8 476.4,162.6 477.2,162.5 477.9,162.2 478.7,162.1 479.4,162.1 480.2,162.2 481.0,162.2 481.7,161.7 482.5,161.6 483.2,161.3 484.0,160.8 484.7,160.5 485.5,160.5 486.3,160.5 487.0,160.5 487.8,160.5 488.5,160.3 489.3,160.2 490.0,160.2 490.8,160.1 491.6,159.9 492.3,159.9 493.1,159.8 493.8,160.0 494.6,159.9 495.3,160.0 496.1,160.0 496.9,159.9 497.6,160.0 498.4,160.1 499.1,160.5 499.9,160.7 500.7,161.0 501.4,161.3 502.2,161.6 502.9,161.8 503.7,162.3 504.4,162.6 505.2,162.9 506.0,163.2 506.7,163.5 507.5,163.7 508.2,164.0 509.0,164.0 509.7,164.3 510.5,164.6 511.3,164.6 512.0,165.0 512.8,165.4 513.5,165.6 514.3,165.7 515.0,165.8 515.8,165.4 516.6,165.3 517.3,165.4 518.1,165.2 518.8,165.1 519.6,164.9 520.3,164.8 521.1,164.6 521.9,164.5 522.6,164.2 523.4,164.1 524.1,163.8 524.9,163.7 525.7,163.4 526.4,163.2 527.2,163.4 527.9,163.0 528.7,162.6 529.4,162.1 530.2,161.6 531.0,161.3 531.7,160.9 532.5,160.3 533.2,160.0 534.0,159.7 534.7,159.4 535.5,159.1 536.3,158.8 537.0,158.5 537.8,158.3 538.5,158.1 539.3,157.8 540.0,157.7 540.8,157.6 541.6,157.3 542.3,157.3 543.1,157.5 543.8,157.6 544.6,157.8 545.3,157.8 546.1,157.8 546.9,157.9 547.6,157.9 548.4,158.0 549.1,158.0 549.9,158.0 550.6,158.0 551.4,158.0 552.2,158.1 552.9,158.1 553.7,158.2 554.4,158.3 555.2,158.5 556.0,158.6 556.7,158.6 557.5,158.7 558.2,158.8 559.0,158.8 559.7,158.9 560.5,159.0 561.3,159.1 562.0,159.3 562.8,159.3 563.5,159.1 564.3,159.2 565.0,159.2 565.8,159.4 566.6,159.5 567.3,159.8 568.1,159.9 568.8,160.1 569.6,160.2 570.3,160.3 571.1,160.7 571.9,160.9 572.6,161.0 573.4,161.5 574.1,161.7 574.9,161.9 575.6,161.7 576.4,161.9 577.2,161.9 577.9,161.9 578.7,161.9 579.4,161.9 580.2,161.8 580.9,161.7 581.7,161.6 582.5,161.7 583.2,161.5 584.0,161.5 584.7,161.4 585.5,161.7 586.3,161.5 587.0,161.7 587.8,161.8 588.5,162.1 589.3,162.2 590.0,162.3 590.8,162.4 591.6,162.5 592.3,162.6 593.1,162.8 593.8,163.1 594.6,163.1 595.3,163.4 596.1,163.6 596.9,163.8 597.6,164.0 598.4,164.2 599.1,164.6 599.9,164.9 600.6,165.1 601.4,165.5 602.2,165.8 602.9,166.0 603.7,166.5 604.4,166.6 605.2,166.9 605.9,166.9 606.7,166.9 607.5,166.9 608.2,166.9 609.0,166.8 609.7,166.7 610.5,166.8 611.2,166.8 612.0,166.9 612.8,166.8 613.5,166.6 614.3,166.7 615.0,166.8 615.8,166.5 616.6,166.6 617.3,166.4 618.1,166.4 618.8,166.6 619.6,166.7 620.3,166.6 621.1,166.5 621.9,166.5 622.6,166.4 623.4,166.3 624.1,166.4 624.9,166.0 625.6,166.0 626.4,166.0 627.2,166.2 627.9,166.1 628.7,166.2 629.4,166.2 630.2,166.1 630.9,166.1 631.7,166.1 632.5,165.8 633.2,165.9 634.0,165.9 634.7,165.9 635.5,166.0 636.2,165.9 637.0,166.0 637.8,166.1 638.5,166.1 639.3,166.0 640.0,166.0 640.8,166.1 641.5,166.0 642.3,166.1 643.1,166.0 643.8,165.9 644.6,166.2 645.3,166.6 646.1,166.6 646.9,166.7 647.6,166.8 648.4,167.0 649.1,166.8 649.9,167.1 650.6,167.1 651.4,167.2 652.2,167.2 652.9,167.2 653.7,167.0 654.4,166.6 655.2,166.5 655.9,166.3 656.7,165.9 657.5,165.6 658.2,165.3 659.0,164.9 659.7,164.5 660.5,164.2 661.2,163.9 662.0,163.5" style="fill:none;stroke:var(--accent);stroke-width:1.4"/>
  <text x="56.0" y="200.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">even in period: 1</text>
  <line x1="56.0" y1="214.0" x2="662.0" y2="214.0" class="f-plain"/>
  <circle cx="479.8" cy="214.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="56.0" y="238.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">even in log period: 14</text>
  <line x1="56.0" y1="252.0" x2="662.0" y2="252.0" class="f-plain"/>
  <circle cx="634.8" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="591.0" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="547.2" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="503.5" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="459.7" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="416.0" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.3" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="328.7" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="285.0" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="241.4" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="197.8" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="154.2" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="110.7" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="67.1" cy="252.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="56.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">even in frequency: 32</text>
  <line x1="56.0" y1="290.0" x2="662.0" y2="290.0" class="f-plain"/>
  <circle cx="71.7" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="90.7" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="109.6" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="128.5" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="147.5" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="166.4" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.4" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="204.3" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="223.2" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="242.2" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="261.1" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="280.0" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="299.0" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="317.9" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="336.9" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="355.8" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="374.7" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="393.7" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="412.6" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="431.5" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="450.5" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="469.4" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="488.4" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="507.3" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="526.2" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="545.2" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="564.1" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="583.0" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="602.0" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.9" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="639.9" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="658.8" cy="290.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="56.0" y="312.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">−0.004</text>
  <text x="207.5" y="312.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−0.002</text>
  <text x="359.0" y="312.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="510.5" y="312.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.002</text>
  <text x="662.0" y="312.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.004</text>
  <text x="10.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">S/N</text>
  <text x="662.0" y="332.0" text-anchor="end" class="f-label f-muted" style="font-size:11px">frequency minus 1/P of b, cycles per day</text>
</svg>
<figcaption>Peak of b and the points of 3 grids with about 10,000 periods each. Positions are those of the first runs.</figcaption>
</figure>

I tried about the same number of points in 3 layouts. The columns count which period won, "echo" is a multiple or a fraction of b.

| grid | runs | b | c | echo |
|---|---|---|---|---|
| 10,000 even in period | 20 | 0 | 20 | 0 |
| 10,000 even in log period | 20 | 8 | 6 | 6 |
| 9,920 even in frequency | 25 | 25 | 0 | 0 |
| 100,000 even in period | 3 | 0 | 3 | 0 |
| 100,000 even in log period | 3 | 3 | 0 | 0 |

My written expectation was that 10,000 would find b. But 20 runs are few and 3 are nothing, so later I took the grid even in period, spread 500 shifts over one step and compared only the points near the 2 planets. b was above c in 14 of them. With 100,000 periods, 17 of them within 0.5% of b, it was 53 of 200. My 3 runs could not show this.

I was going to write that even in frequency is correct. Then I cut b out and took the same 9,920 frequencies. They hit c in 3 cases of 25. The peak of c is 0.000018 wide, 21 times narrower than that of b, the step is 14 times wider than this peak. Ofir described the proper spacing in 2014, the step in frequency has to change along the grid.

## The window of the median

Its length is the other number I would pick by eye. A transit of c lasts 6.8 hours.

| window, days | scatter, ppm | b S/N | c depth, ppm | c S/N |
|---|---|---|---|---|
| 0.2 | 48.6 | 161.7 | 18.4 | 6.9 |
| 0.3 | 51.5 | 166.8 | 37.5 | 10.9 |
| 0.5 | 54.4 | 170.2 | 168.4 | 44.5 |
| 1 | 57.6 | 169.6 | 452.0 | 126.5 |
| 2 | 60.4 | 158.5 | 469.0 | 125.4 |

Half a day has a lower scatter than 1 day and the best S/N for b in this table. It also eats 65% of the depth of c. With 0.2 the search after removing b does not find c at all, the winner is 2.5128 days, 3 periods of b.

Even 1 day leaves a trace. The points next to the transit of c stand above the level farther away by 44 ppm. I left the points of both transits out of the median and repeated it. The step became 8 ppm and the depth of c became 478.1 ± 5.6, against 477.1 in the catalog. With both planets cut, the strongest dip is now 7.9 and the strongest rise 8.2. That is closer to a real level of noise.

b moved only to 183.2. The catalog depth is the deepest point of a fitted model and mine is the mean over the middle half of the transit, so some difference has to be there. I did not compute how much.

## What I didn't check

2 stars, both with planets known for years. The cuts use the catalog times and not my own, so a blind search would not get the clean median in one pass. I have no false alarm probability, only the rises as a ruler. I also did not implement the spacing of Ofir, so I still don't know how many frequencies are enough for both planets in one run.
