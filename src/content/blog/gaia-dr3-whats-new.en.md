---
title: "Gaia DR3 is out. The 1.8 billion stars are the same ones as in 2020"
description: "Gaia DR3 has the same 1,811,709,771 sources as EDR3 and on a million random ones the positions and parallaxes do not differ at all, while G changed for 52.8% of them. The new part is on top: 33.8 million radial velocities instead of 7.2 million, temperatures and spectra. A distance better than about 20% is roughly 1 source in 10. Closer than 100 pc DR3 has 574,531 sources against 700,055 in DR2, and the difference sits in the Milky Way plane."
date: 2022-06-15
lang: en
translationKey: gaia-dr3-whats-new
tags: ["open-data", "numbers"]
---
On Monday ESA published Gaia DR3 and the headlines say 1.8 billion stars. I wanted to look at what is new. Only then I remembered that 1.8 billion was also the headline in December 2020, for Early DR3. So which part is new? I have always thought of Gaia as one big thing, a catalog with distances. I never checked what a release changes. For me a new data release was something like a new major version of a library. I decided to count it instead of reading the press release.

All of it is ADQL sent with plain curl to the TAP endpoints of the ESA archive and its mirror at ARI Heidelberg, plus a small Python script that adds up the results. No downloads, only counts. A full scan of 1.8 billion rows did not finish for me as an anonymous user. For questions about single sources I split the table into pieces of 50,000 rows by `random_index`. That column is a random permutation of row numbers, so the first million values are a random sample of a million sources.

## The same table with new columns

`gaiadr3.gaia_source` has 1,811,709,771 rows. `gaiaedr3.gaia_source` has the same 1,811,709,771.

Then I joined the tables by `source_id` on the million random sources. All of them are in EDR3. For `ra` and `dec` the largest difference between the releases is 0. The same holds for `parallax` with `parallax_error` and for `pmra` with `pmdec`. The positions and the parallaxes of DR3 are the ones from December 2020.

I expected the same for the brightness and wrote it down before the query. It was wrong. The mean G magnitude differs in 526,610 of the 997,022 sources that have a G at all, by at most 0.0255 magnitudes. At first I thought my join was broken. It was not, because the changes sit only in certain kinds of sources. Gaia solves the astrometry of a source with 5 parameters, with 6 when the color had to be estimated too. When there is nothing better, it gets only 2. Sources with 5 parameters have exactly the same G as before. Most sources with 6 parameters and about half of those with 2 got a correction. In a second check on rows after the first million, no source changed if it was brighter than G = 13 or had no BP−RP color. This is the correction the EDR3 photometry paper (Riello et al. 2021) described for these solutions. In EDR3 you had to apply it yourself. The DR3 summary paper says it is now included in the archive tables and should not be applied again.

<figure class="fig">
<svg viewBox="0 0 680 166" role="img" aria-label="Bar chart. Share of sources whose mean G magnitude in DR3 differs from EDR3, by type of astrometric solution, in a random sample of 1 million sources. 5 parameters: 0.0%, 0 of 324,108; 6 parameters: 86.6%, 419,375 of 484,372; 2 parameters: 56.9%, 107,235 of 188,542. The largest change is 0.0255 magnitudes.">
  <text x="0" y="18" class="f-label f-ink" style="font-weight:600">Share of sources whose G changed from EDR3 to DR3</text>
  <text x="0" y="57" class="f-label f-ink">5 parameters</text>
  <rect x="150" y="40" width="290" height="24" class="f-box"/>
  <text x="450" y="57" class="f-mono f-ink" style="font-size:12px">0.0%  0 of 324,108</text>
  <text x="0" y="97" class="f-label f-ink">6 parameters</text>
  <rect x="150" y="80" width="290" height="24" class="f-box"/>
  <rect x="150" y="80" width="251.1" height="24" style="fill:var(--accent)"/>
  <text x="450" y="97" class="f-mono f-ink" style="font-size:12px">86.6%  419,375 of 484,372</text>
  <text x="0" y="137" class="f-label f-ink">2 parameters</text>
  <rect x="150" y="120" width="290" height="24" class="f-box"/>
  <rect x="150" y="120" width="164.9" height="24" style="fill:var(--accent)"/>
  <text x="450" y="137" class="f-mono f-ink" style="font-size:12px">56.9%  107,235 of 188,542</text>
</svg>
<figcaption>Same 1 million random sources in both releases, joined by source_id. Positions and parallaxes are identical for all of them. So are the proper motions.</figcaption>
</figure>

A cached EDR3 query still gives DR3 parallaxes, but for about half of the sources its G is outdated. I would not have noticed this without the join, because 0.0255 magnitudes does not show up on any plot I usually make.

## What is actually new

The new part is everything that was hung on top of those positions. Radial velocity is the one I wanted most. DR2 had it for 7,224,631 sources and EDR3 carried those values over, 7,209,831 of them. I did not check where the other 14,800 went. DR3 has 33,812,183. In my sample of a million, 4,013 sources have both an old and a new value. They differ by up to 65 km/s.

Beyond that the table now has flags and parameters that did not exist before:

| what | sources |
|---|---|
| low resolution spectra (BP/RP) | 219,197,643 |
| temperature from those spectra | about 472 million (26.05% of my sample) |
| marked as variable | 10,509,536 |
| quasar candidates | 6,649,162 |
| galaxy candidates | 4,842,342 |
| binary or multiple star solutions | 813,687 |
| high resolution spectra (RVS) | 999,645 |

The temperatures also come from BP/RP spectra, but only 219 million of those spectra were published, so the table has more temperatures than spectra. The quasar and galaxy rows say something about the headline. Not all of the 1.8 billion are stars. DR3 is the first release where Gaia itself marks which sources might not be. The candidate lists are made to be complete, so they are not clean either.

## How many of them have a distance

This was the question I really cared about. 1,467,744,818 sources have a parallax at all, that is 81%. But a parallax with an error of 80% is not a distance. In my sample of a million, the parallax is more than 5 times its error for 10.66% of sources. That is about 193 million with a distance better than roughly 20% and about 99 million better than 10%. In DR2 the same shares were 8.75% and 4.28%.

<figure class="fig">
<svg viewBox="0 0 680 210" role="img" aria-label="Bar chart on a linear scale. all sources: 1,811,709,771 (100.0%); have a parallax: 1,467,744,818 (81.0%); parallax better than 20%: ≈ 193 million (10.7%); parallax better than 10%: ≈ 99 million (5.5%); have a radial velocity: 33,812,183 (1.9%). The bars for distances better than 20% and 10% are about a tenth and a twentieth of the first bar, the bar for radial velocity is barely visible.">
  <text x="0" y="18" class="f-label f-ink" style="font-weight:600">Of 1,811,709,771 sources in DR3</text>
  <text x="0" y="51" class="f-label f-ink">all sources</text>
  <rect x="200" y="36" width="260.0" height="20" style="fill:var(--accent)"/>
  <text x="468" y="51" class="f-mono f-ink" style="font-size:12px">1,811,709,771  (100.0%)</text>
  <text x="0" y="85" class="f-label f-ink">have a parallax</text>
  <rect x="200" y="70" width="210.6" height="20" style="fill:var(--accent)"/>
  <text x="418.6372989694496" y="85" class="f-mono f-ink" style="font-size:12px">1,467,744,818  (81.0%)</text>
  <text x="0" y="119" class="f-label f-ink">parallax better than 20%</text>
  <rect x="200" y="104" width="27.7" height="20" style="fill:var(--accent)"/>
  <text x="235.70819995759683" y="119" class="f-mono f-ink" style="font-size:12px">≈ 193 million  (10.7%)</text>
  <text x="0" y="153" class="f-label f-ink">parallax better than 10%</text>
  <rect x="200" y="138" width="14.2" height="20" style="fill:var(--accent)"/>
  <text x="222.17571998070324" y="153" class="f-mono f-ink" style="font-size:12px">≈ 99 million  (5.5%)</text>
  <text x="0" y="187" class="f-label f-ink">have a radial velocity</text>
  <rect x="200" y="172" width="4.9" height="20" style="fill:var(--accent)"/>
  <text x="212.85241495118038" y="187" class="f-mono f-ink" style="font-size:12px">33,812,183  (1.9%)</text>
</svg>
<figcaption>Rows with ≈ are scaled from a random sample of 1 million sources (95% interval within 0.1 percentage points), the rest are full counts.</figcaption>
</figure>

So a usable distance is roughly 1 in 10 sources. A radial velocity, so the full motion in space, is about 1 in 54.

## The neighborhood got smaller

Here I stumbled the second time. I counted sources with a parallax above 10 milliarcseconds, closer than 100 parsecs. DR2 has 700,055 of them. DR3 has 574,531. I expected a newer release to have more nearby stars.

The difference is not spread evenly. Among sources with a parallax more than 20 times its error, DR2 has 305,270 and DR3 has 297,421, almost the same. Almost all the loss is in the less precise group. And it has a place on the sky. A band within 10 degrees of the Milky Way plane is 17.4% of the sky. Stars within 100 parsecs should be spread almost evenly over the sky, because the disk of the Milky Way is a few hundred parsecs thick. The precise nearby sources in DR3 put 18.5% of themselves in that band. Of the less precise ones, 88.4% are there. My guess is that crowded fields in the plane produce parallaxes that look large and are not. The DR2 cut lets in more of them.

<figure class="fig">
<svg viewBox="0 0 680 412" role="img" aria-label="Grouped bar chart of DR2 and DR3 sources with parallax above 10 milliarcseconds, by parallax divided by its error. below 5: DR2 49,251, DR3 32,573; 5 to 10: DR2 211,784, DR3 169,732; 10 to 20: DR2 133,750, DR3 74,805; 20 and more: DR2 305,270, DR3 297,421. Below, a second chart shows the share of sources within 10 degrees of the Milky Way plane: share of the sky 17.4%, DR3, parallax / error ≥ 20 18.5%, DR3, parallax / error &lt; 20 88.4%.">
  <text x="0" y="18" class="f-label f-ink" style="font-weight:600">Sources with parallax above 10 mas (closer than 100 pc)</text>
  <line x1="60" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="54" y="224.0" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <line x1="60" y1="168.6" x2="660" y2="168.6" class="f-plain"/>
  <text x="54" y="172.6" class="f-mono f-muted" text-anchor="end" style="font-size:11px">100,000</text>
  <line x1="60" y1="117.1" x2="660" y2="117.1" class="f-plain"/>
  <text x="54" y="121.1" class="f-mono f-muted" text-anchor="end" style="font-size:11px">200,000</text>
  <line x1="60" y1="65.7" x2="660" y2="65.7" class="f-plain"/>
  <text x="54" y="69.7" class="f-mono f-muted" text-anchor="end" style="font-size:11px">300,000</text>
  <rect x="86.0" y="194.7" width="46" height="25.3" class="f-box"/>
  <text x="109.0" y="189.7" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">49,251</text>
  <rect x="138.0" y="203.2" width="46" height="16.8" style="fill:var(--accent)"/>
  <text x="161.0" y="198.2" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">32,573</text>
  <text x="135.0" y="236" class="f-label f-muted" text-anchor="middle">below 5</text>
  <rect x="236.0" y="111.1" width="46" height="108.9" class="f-box"/>
  <text x="259.0" y="106.1" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">211,784</text>
  <rect x="288.0" y="132.7" width="46" height="87.3" style="fill:var(--accent)"/>
  <text x="311.0" y="127.7" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">169,732</text>
  <text x="285.0" y="236" class="f-label f-muted" text-anchor="middle">5 to 10</text>
  <rect x="386.0" y="151.2" width="46" height="68.8" class="f-box"/>
  <text x="409.0" y="146.2" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">133,750</text>
  <rect x="438.0" y="181.5" width="46" height="38.5" style="fill:var(--accent)"/>
  <text x="461.0" y="176.5" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">74,805</text>
  <text x="435.0" y="236" class="f-label f-muted" text-anchor="middle">10 to 20</text>
  <rect x="536.0" y="63.0" width="46" height="157.0" class="f-box"/>
  <text x="559.0" y="58.0" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">305,270</text>
  <rect x="588.0" y="67.0" width="46" height="153.0" style="fill:var(--accent)"/>
  <text x="611.0" y="62.0" class="f-mono f-ink" text-anchor="middle" style="font-size:10.5px">297,421</text>
  <text x="585.0" y="236" class="f-label f-muted" text-anchor="middle">20 and more</text>
  <text x="360.0" y="254" class="f-label f-muted" text-anchor="middle">parallax / its error</text>
  <rect x="60" y="266" width="14" height="12" class="f-box"/>
  <text x="80" y="276" class="f-label f-muted">DR2</text>
  <rect x="140" y="266" width="14" height="12" style="fill:var(--accent)"/>
  <text x="160" y="276" class="f-label f-muted">DR3</text>
  <text x="0" y="310" class="f-label f-ink" style="font-weight:600">Share that lies within 10° of the Milky Way plane</text>
  <text x="0" y="337" class="f-label f-ink">share of the sky</text>
  <rect x="250" y="324" width="300" height="18" class="f-plain"/>
  <rect x="250" y="324" width="52.1" height="18" class="f-box"/>
  <text x="560" y="337" class="f-mono f-ink" style="font-size:12px">17.4%</text>
  <text x="0" y="365" class="f-label f-ink">DR3, parallax / error ≥ 20</text>
  <rect x="250" y="352" width="300" height="18" class="f-plain"/>
  <rect x="250" y="352" width="55.4" height="18" style="fill:var(--accent)"/>
  <text x="560" y="365" class="f-mono f-ink" style="font-size:12px">18.5%</text>
  <text x="0" y="393" class="f-label f-ink">DR3, parallax / error &lt; 20</text>
  <rect x="250" y="380" width="300" height="18" class="f-plain"/>
  <rect x="250" y="380" width="265.1" height="18" style="fill:var(--accent)"/>
  <text x="560" y="393" class="f-mono f-ink" style="font-size:12px">88.4%</text>
</svg>
<figcaption>Full counts from the ESA archive. A star in the real neighborhood has no reason to prefer the Milky Way plane.</figcaption>
</figure>

DR3 looks better here, but its raw cut still has 52% of the "nearby" sources in that band. I have no rule for how to clean it. With EDR3 the Gaia team published the Gaia Catalogue of Nearby Stars (Smart et al. 2021). They needed a random forest classifier for exactly this and kept 331,312 objects within 100 parsecs, against 574,531 in my raw cut.

Inside 100 parsecs the good news is again the velocities. DR2 had a radial velocity for 74,339 of those sources, DR3 has it for 169,741. All of them except 1 have a parallax more than 10 times its error.

## What I did not check

So far I only counted columns and compared values. I did not look inside the spectra, the orbits of the binaries or the asteroid tables, which grew from 14,099 objects in DR2 to 158,152. I did not recompute the G correction from the formula, I only saw where it was applied. The shares of distance quality and temperature come from a sample of a million, not a full count, so they are good to about 0.1 percentage points. The 65 km/s difference in radial velocity is one maximum and I do not know which release is wrong there. I counted all of this on 15 June, 2 days after the release.
