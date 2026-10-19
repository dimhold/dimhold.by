---
title: "My satellite GIF of Minsk showed 64 km² of new city and most of it was fields"
description: "7 summers of Sentinel-2 over Minsk: a pair of single scenes shows 64 km² of new bare land, 60% of it cropland. A rule that needs a pixel to stay changed finds 3.46 km² and 110 of 120 sample pixels are built up or construction sites. The largest patch is the old Minsk-1 airport while GHSL and WorldCover do not match my count."
date: 2022-12-18
lang: en
translationKey: city-growth-sentinel
tags: ["open-data", "statistics"]
---
Everybody has seen these GIFs: a city from space, one frame a year and the grey area gets bigger every frame. Google Earth Timelapse published such timelapses for the whole world last year. I always believed what they show and never asked how much of the movement is the city. This autumn I wanted one for Minsk, 10 years of it from Sentinel-2, because its data is free.

10 years was not possible. Sentinel-2A was launched in June 2015 and the first scene over the city in the archive is from 29 July 2015. In December 2022 there are 7 full summers, 2016 to 2022. For 10 years I would need Landsat at 30 metres.

## The first GIF

I took the Sentinel-2 L2A scenes from Planetary Computer for tile 35UNV. The window is about 32 by 28 km and holds the city with the ring road and the suburbs. For every summer, May to September, I picked the scene with the fewest clouds in the window and put the 7 frames together.

<figure class="fig">
<img src="/media/city-growth-sentinel/minsk-single.gif" width="810" height="702" alt="A GIF of 7 frames, the clearest Sentinel-2 scene of each summer from 2016 to 2022 over Minsk and its suburbs. Fields around the city jump between brown and green from frame to frame, the reservoir in the north west changes colour, small clouds appear in 2019. The city itself looks almost the same in every frame." aria-label="A GIF of 7 frames, the clearest Sentinel-2 scene of each summer from 2016 to 2022 over Minsk and its suburbs. Fields around the city jump between brown and green from frame to frame, the reservoir in the north west changes colour, small clouds appear in 2019. The city itself looks almost the same in every frame." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Sentinel-2 L2A, the clearest scene of each summer, about 32 by 28 km, 40 metres per pixel in the GIF. Date of the scene in the corner. Masked pixels are filled from the nearest pixel.</figcaption>
</figure>

It looked like a growing city, with fields jumping between brown and green and the reservoir in the north west changing colour. Then I tried to count it. A pixel is "bare" when its vegetation index (NDVI) is under 0.25 and it is not water. Between the frame of 22 August 2016 and the frame of 23 May 2022, 64 km² became bare. At the same time 51 km² stopped being bare, so the net is 13 km² on top of 108. If I read only the gains, as the eye does on a GIF, the bare area grew by more than half in less than 6 years.

I checked what lies under those 64 km² on the ESA WorldCover map for 2021. 60% of it is cropland. In May many fields have nothing grown on them yet, so they look like bare soil. My index cannot tell them from a new block of flats. Only 5% of the 64 km² got into the stricter count below.

## Medians instead of single scenes

The usual fix is a median. For each summer I took up to 12 clearest scenes and masked clouds and shadows with the scene classification layer (SCL) of L2A. Every pixel keeps its middle value. Then I counted pixels that change their state, bare or not bare, at least 2 times over the 7 frames. With single scenes it is 157 km², with medians 59 km², which is still a lot. The single scenes are counted on a smaller area, because more of their pixels are masked.

<figure class="fig">
<svg viewBox="0 0 680 275" role="img" aria-label="Line chart, years 2016 to 2022, bare land in the window in square kilometres. From the clearest single scene of each summer the line jumps: 93.4, 102.0, 100.9, 84.7, 80.4, 95.0, 107.0. From summer medians it stays almost flat: 81.6, 81.3, 86.9, 85.9, 82.6, 80.8, 83.4.">
  <line x1="70" y1="200.0" x2="560" y2="200.0" class="f-plain"/>
  <text x="64" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="70" y1="140.0" x2="560" y2="140.0" class="f-plain"/>
  <text x="64" y="144.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="70" y1="80.0" x2="560" y2="80.0" class="f-plain"/>
  <text x="64" y="84.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="70" y1="20.0" x2="560" y2="20.0" class="f-plain"/>
  <text x="64" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <text x="64" y="12" text-anchor="end" class="f-label f-muted">km²</text>
  <path d="M90.0,119.8 L165.0,68.2 L240.0,74.8 L315.0,171.6 L390.0,197.8 L465.0,110.2 L540.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M90.0,190.6 L165.0,192.4 L240.0,158.4 L315.0,164.7 L390.0,184.6 L465.0,195.0 L540.0,179.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="90.0" cy="119.8" r="3.5" class="f-accent"/>
  <circle cx="90.0" cy="190.6" r="3.5" class="f-ink"/>
  <text x="90.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="90.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">22 Aug</text>
  <circle cx="165.0" cy="68.2" r="3.5" class="f-accent"/>
  <circle cx="165.0" cy="192.4" r="3.5" class="f-ink"/>
  <text x="165.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="165.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">12 Aug</text>
  <circle cx="240.0" cy="74.8" r="3.5" class="f-accent"/>
  <circle cx="240.0" cy="158.4" r="3.5" class="f-ink"/>
  <text x="240.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="240.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">8 Jun</text>
  <circle cx="315.0" cy="171.6" r="3.5" class="f-accent"/>
  <circle cx="315.0" cy="164.7" r="3.5" class="f-ink"/>
  <text x="315.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="315.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13 Jun</text>
  <circle cx="390.0" cy="197.8" r="3.5" class="f-accent"/>
  <circle cx="390.0" cy="184.6" r="3.5" class="f-ink"/>
  <text x="390.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="390.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 Jun</text>
  <circle cx="465.0" cy="110.2" r="3.5" class="f-accent"/>
  <circle cx="465.0" cy="195.0" r="3.5" class="f-ink"/>
  <text x="465.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <text x="465.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10 Sep</text>
  <circle cx="540.0" cy="38.2" r="3.5" class="f-accent"/>
  <circle cx="540.0" cy="179.8" r="3.5" class="f-ink"/>
  <text x="540.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2022</text>
  <text x="540.0" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23 May</text>
  <text x="552" y="42.2" class="f-label">single scene</text>
  <text x="552" y="183.8" class="f-label f-muted">summer median</text>
</svg>
<figcaption>Bare land is NDVI under 0.25 and not water. The median line is counted over 891 km² of the window, the single scene line over the 817 km² that the mask kept in all 7 scenes. Under the axis is the date of the single scene.</figcaption>
</figure>

The bare area by medians stays between 81 and 87 km² every year with no trend, the most in 2018.

There was one more trap in the 2022 data. From 25 January 2022 ESA processes scenes with baseline 04.00, which adds 1000 to every reflectance value. I subtracted it. Without that, the same rule gives 154 km² of bare land in 2022 instead of 83 km².

## A rule that needs a pixel to stay changed

So I asked for more than one frame. A pixel is new city if it was green (NDVI 0.5 or more) in both 2016 and 2017 and bare in both 2021 and 2022. It also has to lie in a patch of at least 5 pixels. This gives 3.46 km² in 854 patches. The reverse, bare to green with the same patch rule, gives 0.51 km².

I did not trust this number either. So I drew 120 random pixels from those patches and looked at each in the medians of 2016, 2019 and 2022. My guess was that fields and forest clearings would be at least half of them. I was wrong. 77 pixels had a building, a road or a paved yard by 2022. 33 were construction sites or land cleared for one. 1 was a field and 9 I could not read at 10 metres, mostly in areas of private houses.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="A grid of 120 squares, one for each randomly drawn pixel of the change rule. 77 squares are filled dark: a building, road or paved yard by 2022. 33 are filled with the accent colour: a construction site or cleared land. 1 is a field. 9 are empty outlines: not readable at 10 metres.">
  <rect x="72.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="14" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="41" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="558.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="585.5" y="68" width="22" height="22" class="f-ink"/>
  <rect x="72.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="99.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="126.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="153.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="180.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="207.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="234.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="261.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="288.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="315.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="342.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="369.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="396.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="423.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="450.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="477.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="504.5" y="95" width="22" height="22" class="f-ink"/>
  <rect x="531.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="95" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="369.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="396.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="423.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="450.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="477.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="504.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="531.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="558.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="585.5" y="122" width="22" height="22" class="f-accent"/>
  <rect x="72.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="99.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="126.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="153.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="180.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="207.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="234.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="261.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="288.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="315.5" y="149" width="22" height="22" class="f-accent"/>
  <rect x="342.5" y="149" width="22" height="22" class="f-muted"/>
  <rect x="369.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="396.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="423.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="450.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="477.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="504.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="531.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="558.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="585.5" y="149" width="22" height="22" class="f-plain" style="stroke:var(--muted)"/>
  <rect x="60" y="190" width="12" height="12" class="f-ink"/>
  <text x="78" y="200" class="f-label">built by 2022 77</text>
  <rect x="209.6" y="190" width="12" height="12" class="f-accent"/>
  <text x="227.6" y="200" class="f-label">construction site 33</text>
  <rect x="385.6" y="190" width="12" height="12" class="f-muted"/>
  <text x="403.6" y="200" class="f-label">field 1</text>
  <rect x="475.8" y="190" width="12" height="12" class="f-plain" style="stroke:var(--muted)"/>
  <text x="493.8" y="200" class="f-label">can't tell 9</text>
</svg>
<figcaption>Each pixel was looked at in the medians of 2016, 2019 and 2022, at 10 metres per pixel. Labelled by me, alone.</figcaption>
</figure>

20 of the 120 pixels fell on one place, the former Minsk-1 airport. It was closed on 23 December 2015, so the first Sentinel-2 summer shows the runway still there. In the medians it lies in a green field until 2018 and sand comes in 2019. By 2022 the north west half has blocks of flats on it. Within 1 km of the middle of the runway lies 0.54 km² of the change, 15% of all of it in the window. The largest single patch is there too.

<figure class="fig">
<img src="/media/city-growth-sentinel/airport-median.gif" width="800" height="600" alt="A GIF of 7 summer medians from 2016 to 2022 over the former Minsk-1 airport, about 4 by 3 km. Until 2018 the runway lies in a green field. In 2019 sand of construction spreads over it. By 2022 rows of tall blocks of flats and new streets stand on the north west half of the runway, while the south east half is still sand." aria-label="A GIF of 7 summer medians from 2016 to 2022 over the former Minsk-1 airport, about 4 by 3 km. Until 2018 the runway lies in a green field. In 2019 sand of construction spreads over it. By 2022 rows of tall blocks of flats and new streets stand on the north west half of the runway, while the south east half is still sand." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Summer medians of Sentinel-2 L2A, 10 metres per pixel. Pixels without a single clean observation in the summer are filled from the nearest pixel.</figcaption>
</figure>

## Checking against ready maps

Before counting I planned to compare with 2 ready maps. The first is GHSL from the European Commission, release R2022A from this summer, with built surface every 5 years. On my grid it gives 73.9 km² of built surface in 2015 and 77.2 km² in 2020, so 3.3 km² more. My 3.46 km² for 2016 to 2022 is almost the same and I was glad about it.

Then I looked where these 3.3 km² are. 7% of the GHSL growth lies within 100 metres of my patches. That strip covers 3.4% of the window, so it is about twice what chance gives. Still the other 93% lies elsewhere. On cells of 500 metres the 2 maps correlate at 0.06. At the airport GHSL hardly moves: on my changed pixels its built share is 4.6% in 2015 and 4.9% in 2020. Then I read the GHSL description properly. It looks at the ground with Landsat in 2014 and with a Sentinel-2 composite of 2018. The epoch 2015 is interpolated and 2020 extrapolated, with a model that uses terrain, distance to water and the growth seen before, among others. So its 2020 number is not an observation.

WorldCover is worse for this question. The 2020 map was made with algorithm v100 and the 2021 map with v200. The release notes warn that changes between the 2 maps come from both the land and the algorithm. In my window the built class grows from 153.9 to 186.8 km² in one year, while my rule gives under 1 km² per year.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Horizontal bars, new land in square kilometres by method. 2 single scenes, 2016 → 2022: 64.2; 2 medians, 2016 → 2022: 23.2; WorldCover, 2020 → 2021: 32.9; GHSL, 2015 → 2020: 3.3; my rule, 2016–17 → 2021–22: 3.46.">
  <text x="240" y="29" text-anchor="end" class="f-label f-muted">2 single scenes, 2016 → 2022</text>
  <rect x="250" y="14" width="312.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="570.0" y="30" class="f-mono">64.2 km²</text>
  <text x="240" y="67" text-anchor="end" class="f-label f-muted">2 medians, 2016 → 2022</text>
  <rect x="250" y="52" width="112.4" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="370.4" y="68" class="f-mono">23.2 km²</text>
  <text x="240" y="105" text-anchor="end" class="f-label f-muted">WorldCover, 2020 → 2021</text>
  <rect x="250" y="90" width="159.8" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="417.8" y="106" class="f-mono">32.9 km²</text>
  <text x="240" y="143" text-anchor="end" class="f-label f-muted">GHSL, 2015 → 2020</text>
  <rect x="250" y="128" width="16.0" height="22" class="f-ink" style="fill-opacity:0.55"/>
  <text x="274.0" y="144" class="f-mono">3.3 km²</text>
  <text x="240" y="181" text-anchor="end" class="f-label">my rule, 2016–17 → 2021–22</text>
  <rect x="250" y="166" width="16.8" height="22" class="f-accent" style="fill-opacity:1"/>
  <text x="274.8" y="182" class="f-mono">3.46 km²</text>
</svg>
<figcaption>All on the same Sentinel-2 grid of the window. The single scene pair compares 22 August 2016 with 23 May 2022. The 2 pairs count only land that became bare, WorldCover and GHSL the net change of the built class.</figcaption>
</figure>

## What I take from it

In my window around Minsk the number is about 3.5 km² in 6 years, construction sites included. I think the real number is more likely higher than lower. A pixel had to be green 2 summers in a row before the change. Land built in small pieces does not pass the patch rule. But I did not measure what the rule missed.

## What I did not check

The thresholds 0.25 and 0.5 I chose once and did not tune. Land cleared before 2016 is not in the count and the window also holds villages outside the city. I labelled the sample alone at 10 metres, someone else could put a few points in another group. Where old houses with gardens were replaced by new blocks, my rule would count it as new city, although the land was built on before. A taller building in place of a lower one is not visible to it at all.

2.2% of the window had no clean pixel in at least one summer and is out of the count. I first thought the mask takes bright roofs for cloud. The classes say otherwise: about half of these pixels are "unclassified" and a third "dark area", 2 classes my own mask threw out. In the GIFs I filled the holes from the nearest pixel.
