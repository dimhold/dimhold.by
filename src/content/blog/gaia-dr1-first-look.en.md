---
title: "In Gaia DR1 the star with random index i has a neighbour at 2i or 2i + 1"
description: "The first Gaia catalogue has 1,142,679,769 rows and a random_index column for sampling. Star i turns out to have a neighbour on the sky at 2i or 2i + 1 in 89.3% of cases, and the first 50,000 rows hold twice as many close pairs as 2 other windows of the same size. Of the 100 nearest Hipparcos stars 32 have a parallax in the release."
date: 2016-10-02
lang: en
translationKey: gaia-dr1-first-look
tags: ["open-data", "algorithms", "statistics"]
---

I asked the Gaia archive for the 60 stars with `random_index` below 60 and printed their galactic coordinates. Row 2 was at longitude 344.75 and latitude 17.90. Row 5 was at 344.72 and 18.39, row 11 at 344.92 and 17.92, row 23 at 344.43 and 18.56. These 4 stars fit into a patch less than 1 degree across. Rows 0, 1, 3, 7 and 15 were together in another one.

The table has 1,142,679,769 rows and I have no place to put it, so I started with a random sample. If a table has a column for that I just use it and never check. The documentation invites you to. It says the column "contains a random permutation of the numbers from 0 to N-1" and gives subsets that are "still representative". I wanted to look at stars and looked mostly at the column.

## What is in the release

ESA opened the first Gaia catalogue on September 14. I queried it through the TAP service of the archive. The main table `gaia_source` has 57 columns, but almost all rows hold only a position and one brightness, G. The rest is errors and service fields. There are no colours. A parallax, the thing that gives a distance, is there for 2,057,050 rows, which is 0.18%. These are the TGAS stars, for which Gaia was combined with the old Hipparcos and Tycho-2 catalogues.

Of these parallaxes 30,840 (1.5%) are negative and 1,019,970 (49.6%) are smaller than 5 of their own errors. So for half of them one divided by parallax is a bad distance. Tri Astraatmadja with a coauthor has already posted a paper with proper distances to all 2 million (arXiv 1609.07369).

Then I took the 100 nearest stars of Hipparcos (new reduction, error below 10 mas) and looked them up in TGAS by HIP number. Only 32 have a TGAS parallax. The 8 nearest have none. Of all Hipparcos stars 93,635 of 117,955 are found, 79.4%.

<figure class="fig">
<svg viewBox="0 0 680 192" role="img" aria-label="100 squares for the 100 nearest stars of Hipparcos from the nearest to the 100th. 32 have a TGAS parallax, 25 more have a row in gaia_source without a parallax, 43 have no row. The first 8 squares have no TGAS parallax.">
  <rect x="60" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="29.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="84" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="108" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="132" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="156" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="204" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="228" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="252" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="276" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="372" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="396" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="420" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="444" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="468" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="492" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="516" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="540" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="564" y="14" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="588" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612" y="14" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636" y="14" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="60" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="53.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">26</text>
  <rect x="84" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="108" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="132" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="156" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="180" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="204" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="252" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="276" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="324" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="372" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="420" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="444" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="468" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="492" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="516" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="540" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="564" y="38" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="588" y="38" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="612" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="636" y="38" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="48.0" y="77.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">51</text>
  <rect x="84" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="108" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="132" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="156" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="180" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="204" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="228" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="252" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="276" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="348" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="372" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="396" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="420" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="444" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="468" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="492" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="516" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="540" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="62" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="588" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="612" y="62" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="636" y="62" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="60" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="48.0" y="101.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">76</text>
  <rect x="84" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="108" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="132" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="156" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="180" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="204" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="228" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="252" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="276" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="300" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="324" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="348" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="372" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="396" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="420" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="444" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="468" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="492" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="516" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="540" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="564" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="588" y="86" width="20" height="20" style="fill:var(--accent);stroke:none"/>
  <rect x="612" y="86" width="20" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="636" y="86" width="20" height="20" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="60" y="124" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="80.0" y="134.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">parallax in TGAS: 32</text>
  <rect x="60" y="144" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="80.0" y="154.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">a row without parallax: 25</text>
  <rect x="60" y="164" width="12" height="12" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="80.0" y="174.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">no row within 2 arcsec: 43</text>
</svg>
<figcaption>100 nearest stars of the Hipparcos catalogue, left to right and top to bottom from the nearest.</figcaption>
</figure>

For the other 68 I searched `gaia_source` by position. Hipparcos positions are from 1991 and these stars move fast, so I moved each one to 2015. At the old coordinates a 5 arcsecond circle found something for 7 of them, at the moved ones for 27. One of the 27 was a star of magnitude 18, 3.7 arcsec from the place of Proxima. It cannot be Proxima. With 2 arcseconds 25 are left and all 25 have about the right brightness, within 1.8 magnitudes of the Hipparcos one. Brown and coauthors in the summary paper of the release warn that many stars brighter than 7 are missing. Stars faster than 3.5 arcsec a year they call missing. My list has 14 of those and none has a parallax, but Kapteyn's star does have a row.

## 2i or 2i + 1

In the first 100 rows of `random_index` there are 55 different HEALPix cells of about 0.9 degrees, in 100 rows from the millionth there are 99. Where to look I got from the opening, 2, 5, 11, 23 is doubling and adding one.

For every i from 1 to 24,999 I measured the distance to the star 2i and the star 2i + 1 and took the nearer. Median 19.4 arcminutes, 89.3% within 1 degree. If I shuffle the second stars the median is 46 degrees and 0.1% are within 1 degree. Neighbouring indices, i and i + 1, are within 1 degree in 0.02% of cases, so if you compare a row with the following one the column looks fine. Both 2i and 2i + 1 are near only 6 times in 24,999.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Distance on the sky between the star with index i and the nearer of the stars 2i and 2i + 1, 24,999 pairs, in 13 bins from less than 1 arcminute to 180 degrees. Most real pairs are between 5 arcminutes and 1 degree, 94% of the shuffled control lies beyond 10 degrees.">
  <line x1="60" y1="220.0" x2="650" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="175.0" x2="650" y2="175.0" class="f-plain"/>
  <text x="52.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="60" y1="130.0" x2="650" y2="130.0" class="f-plain"/>
  <text x="52.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="85.0" x2="650" y2="85.0" class="f-plain"/>
  <text x="52.0" y="89.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">30</text>
  <line x1="60" y1="40.0" x2="650" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="64.0" y="218.1" width="17.7" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="83.7" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="109.4" y="214.3" width="17.7" height="5.7" style="fill:var(--accent);stroke:none"/>
  <rect x="154.8" y="188.4" width="17.7" height="31.6" style="fill:var(--accent);stroke:none"/>
  <rect x="200.2" y="152.8" width="17.7" height="67.2" style="fill:var(--accent);stroke:none"/>
  <rect x="219.8" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="245.5" y="95.6" width="17.7" height="124.4" style="fill:var(--accent);stroke:none"/>
  <rect x="265.2" y="220.0" width="17.7" height="0.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="290.9" y="97.4" width="17.7" height="122.6" style="fill:var(--accent);stroke:none"/>
  <rect x="310.6" y="219.9" width="17.7" height="0.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="336.3" y="171.4" width="17.7" height="48.6" style="fill:var(--accent);stroke:none"/>
  <rect x="356.0" y="219.7" width="17.7" height="0.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="381.7" y="184.4" width="17.7" height="35.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.4" y="219.2" width="17.7" height="0.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="427.1" y="210.5" width="17.7" height="9.5" style="fill:var(--accent);stroke:none"/>
  <rect x="446.8" y="213.5" width="17.7" height="6.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="472.5" y="217.9" width="17.7" height="2.1" style="fill:var(--accent);stroke:none"/>
  <rect x="492.2" y="201.5" width="17.7" height="18.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="517.8" y="219.3" width="17.7" height="0.7" style="fill:var(--accent);stroke:none"/>
  <rect x="537.5" y="105.6" width="17.7" height="114.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="563.2" y="219.9" width="17.7" height="0.1" style="fill:var(--accent);stroke:none"/>
  <rect x="582.9" y="74.1" width="17.7" height="145.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="628.3" y="56.6" width="17.7" height="163.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="105.4" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1′</text>
  <text x="150.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2′</text>
  <text x="196.2" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5′</text>
  <text x="241.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10′</text>
  <text x="286.9" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20′</text>
  <text x="332.3" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40′</text>
  <text x="377.7" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1°</text>
  <text x="423.1" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2°</text>
  <text x="468.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5°</text>
  <text x="513.8" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10°</text>
  <text x="559.2" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30°</text>
  <text x="604.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60°</text>
  <text x="650.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180°</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">share of pairs, %</text>
  <rect x="230" y="9" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="248.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">2i or 2i + 1</text>
  <rect x="410" y="9" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="428.0" y="19.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">shuffled</text>
</svg>
<figcaption>Distance from star i to the nearer of 2i and 2i + 1 (accent) and to the same stars shuffled (grey). 24,999 pairs each.</figcaption>
</figure>

## Which one

Doubling with one new bit on the right is what a linear feedback shift register does. It is an old cheap way to run through all numbers in a scattered order. Each new bit is an XOR of a few old ones. I wrote out 5,912 equations from pairs closer than 10 arcminutes and tried to solve them for the bits. 2,946 of them contradicted the others, about what a coin would give. It looked like chance, but the mistake was mine, I had no constant term. With it all 5,912 agree. The new bit is the inverted XOR of something.

Flipping bits one by one gave the rest. Of the 14 low bits only bit 9 changes the answer (99.99% of pairs). Of the bits from 14 to 29 only bit 29 does. For i above 571 million the doubled number is larger than the table, so bits 30 and 31 I had to guess. A register of 32 bits with taps at 31, 30, 29 and 9, skipping all numbers that do not fit into the table, held. In code one step is this line, repeated until x is less than 1,142,679,769:

```
x = ((x << 1) & 0xffffffff) | (1 ^ ((x >> 31 ^ x >> 30 ^ x >> 29 ^ x >> 9) & 1))
```

I took 2,000 rows from each of 7 places in the index, predicted one next index for every row and got 12,543 of 14,000 (89.6%) within 1 degree.

<figure class="fig">
<svg viewBox="0 0 680 208" role="img" aria-label="4 states of a 32-bit register, one per row: 33,235,623; 66,471,246; 132,942,493; 265,884,986. Each row is the previous one shifted left by one bit, and a new bit comes in on the right. Bits 31, 30, 29 and 9 are marked, the new bit is made from them.">
  <text x="148.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">31</text>
  <text x="164.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">30</text>
  <text x="180.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">29</text>
  <text x="500.0" y="26.0" text-anchor="middle" class="f-label f-accent" style="font-size:10px">9</text>
  <text x="644.0" y="26.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">0</text>
  <text x="126.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">33,235,623</text>
  <rect x="140" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="236" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="252" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="364" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="380" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="396" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="444" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="492" y="34" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="49.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <rect x="508" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="524" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="540" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="572" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="588" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="604" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="34" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="644.0" y="49.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <line x1="356" y1="58" x2="340" y2="77" class="f-line"/>
  <text x="652.0" y="72.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">new bit</text>
  <text x="126.0" y="96.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">66,471,246</text>
  <rect x="140" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="236" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="348" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="364" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="380" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="396" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="428" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="492" y="80" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="508" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="524" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="540" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="556" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="572" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="588" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="80" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="95.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="80" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <line x1="356" y1="104" x2="340" y2="123" class="f-line"/>
  <text x="652.0" y="118.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">new bit</text>
  <text x="126.0" y="142.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">132,942,493</text>
  <rect x="140" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="220" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="236" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="316" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="332" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="364" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="380" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="396" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="412" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="460" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="476" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="492" y="126" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <rect x="508" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="524" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="540" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="572" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="588" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="620" y="126" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="141.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="636" y="126" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="141.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">1</text>
  <line x1="356" y1="150" x2="340" y2="169" class="f-line"/>
  <text x="652.0" y="164.0" text-anchor="end" class="f-label f-accent" style="font-size:10px">new bit</text>
  <text x="126.0" y="188.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">265,884,986</text>
  <rect x="140" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="148.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="156" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="164.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="172" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="180.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="188" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="196.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="204" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="212.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="220" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="228.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="236" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="244.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="252" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="260.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="268" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="276.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="284" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="292.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="300" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="308.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="316" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="324.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="332" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="340.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="348" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="356.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="364" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="372.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="380" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="388.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="396" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="404.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="412" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="420.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="428" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="436.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="444" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="452.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="460" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="468.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="476" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="484.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="492" y="172" width="16" height="22" class="f-box" style="fill:none"/>
  <text x="500.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
  <rect x="508" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="516.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="524" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="532.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="540" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="548.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="556" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="564.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="572" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="580.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="588" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="596.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="604" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="612.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="620" y="172" width="16" height="22" class="f-plain" style="fill:none"/>
  <text x="628.0" y="187.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <rect x="636" y="172" width="16" height="22" class="f-plain" style="stroke:var(--accent);stroke-width:2;fill:none"/>
  <text x="644.0" y="187.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0</text>
</svg>
<figcaption>4 consecutive random indices from the first file of the dump. Every number is the previous one shifted left, the new right bit is the inverted XOR of the marked bits.</figcaption>
</figure>

The strongest check was a file. The csv dump starts with `GaiaSource_000-000-000.csv.gz`, 218,453 rows sorted by `source_id`. For 216,634 of them (99.2%) the next index is in the same file. By chance it would be about 42.

Then I ran the register from zero. It came back after 4,294,967,295 steps, the longest circle 32 bits allow, so on the way it meets every number below 1,142,679,769 exactly once. This agrees with the permutation of the documentation. I numbered these states and the rows of the file got places from 478,825,166 to 479,202,346. 14 unbroken runs of 1,000 places or more cover 215,358 of them.

My guess is that at some moment the rows lay region after region and were numbered in that order, then the number went through the register. I don't see that table. TGAS has its own `random_index` and the doubling is there too, 81.3% of pairs are within 1 degree.

## Does it matter

For averages hardly. I took 3 samples of 50,000 rows, the first from 0 and the others from 300 and 700 million. The mean G is 18.65 or 18.66 in each. But the first one has 25,165 pairs of stars closer than 10 arcminutes, the others have 12,434 and 12,582. Half of the close pairs in the first sample are extra. The median distance to the nearest star in the sample is 10.2 arcminutes against 14.0 in both others.

So `random_index < K`, the natural way to write it, is the bad one. In the first sample exactly half of the rows have the next index inside the same sample, in the other 2 not one does. After 2 and after 3 steps of the register the stars are still near, 89.5% and 89.2% of pairs are within 1 degree.

The documentation also suggests 10 random subsets. If I cut the index into 10 equal ranges, for a star of the first range the next one is in the first or the second. I would not call such subsets independent.

## What I did not check

I read only the documentation page of the column, the generator may be described somewhere else. Bits 30 and 31 I guessed and then confirmed, I did not derive them like bits 9 and 29. Of the dump I checked one file. A hash of `source_id` would probably be safer, but I did not try it. A row within 2 arcseconds I counted as the star itself, in a binary it can be the other component. And the nearest 100 are the nearest of Hipparcos, which does not see faint stars.
