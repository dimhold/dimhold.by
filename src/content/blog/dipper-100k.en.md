---
title: "The Big Dipper in 100,000 years. 5 of its 7 stars keep the shape within 0.17 degrees"
description: "I wanted an animation of the Big Dipper from 100,000 years ago to 100,000 years ahead and expected 7 stars going in 7 directions. Gaia DR3 does not have Dubhe at all, so the data is Hipparcos 2007 with radial velocities from SIMBAD, straight lines in 3D. A fit on the 5 middle stars leaves them within 0.17 degrees after 100,000 years, while Dubhe is off by 6.9 and Alkaid by 7.3. The whole falling apart is the 2 end stars."
date: 2026-10-07
lang: en
translationKey: dipper-100k
tags: ["open-data", "numbers"]
---
I wanted a short animation of the Big Dipper from 100,000 years ago to 100,000 years ahead. The idea is old. Richard Pogge at Ohio State has [such a movie](https://www.astronomy.ohio-state.edu/~pogge/Ast162/Movies/proper.html) on his course page, last updated in 2007. Before I computed anything I pictured the Dipper in 100,000 years as 7 stars going in 7 directions. Which star goes where, I had no idea. So I computed it and then measured what is left of the shape.

## Gaia did not have the stars

It is 2026 and Gaia is what I would take for anything about stars, so I started there. Python 3.12, astropy 8.0.1, astroquery 0.4.11, a query to Gaia DR3 around each of the 7 positions. Dubhe was not there at all. The brightest source within 3 arcminutes of it has G = 14.0, while Dubhe in Hipparcos has Hp = 1.95. Phecda and Alioth are in the catalog with a position only, without parallax or proper motion. Alkaid too. The other 3 have full astrometry with RUWE between 2.6 and 6.0. Above 1.4 such a solution is usually not trusted. I widened the search radius to 3 arcminutes before I believed it. Then I accepted that for these 7 stars Gaia is not the source.

So the data is older. Positions and motions on the sky come from the Hipparcos new reduction by van Leeuwen (2007), epoch 1991.25. Radial velocities come from SIMBAD, for 5 stars from Gontcharov 2006. Megrez has its value from Gaia DR3 and Mizar from Pourbaix 2004. Each star gets a position and a velocity in 3D and moves on a straight line. Every 500 years I project it back onto the sky. That is 401 frames from minus 100,000 to plus 100,000 years. At 24 frames per second the video is 16.7 seconds. The frames are drawn with numpy 2.5.3 and matplotlib 3.11.2, then ffmpeg 6.1.1 glues them into the video.

<figure class="fig">
<video controls muted loop playsinline preload="none" poster="/media/dipper-100k/poster-en.jpg" src="/media/dipper-100k/dipper-en.mp4" width="1080" height="720" aria-label="The Big Dipper from 100,000 years ago to 100,000 years ahead, a frame every 500 years. The 5 middle stars move together and keep their shape. Dubhe at the end of the bowl and Alkaid at the end of the handle drift away from them, the bowl opens and the handle bends." style="display:block;width:100%;max-width:720px;height:auto;margin:0 auto;background:#0b0f14"></video>
<figcaption>A frame every 500 years, played at 24 per second. The dashed outline is today's Dipper on the sky. Orange: Dubhe and Alkaid.</figcaption>
</figure>

## The middle of the Dipper moves as one piece

In 100,000 years every star of the Dipper moves 2.6 to 3.9 degrees across the sky, which is 5 to 8 Moon widths. This agrees with [Sky & Telescope](https://skyandtelescope.org/astronomy-news/a-new-way-to-see-the-big-dipper/), which gives one Moon diameter per 16,000 years for the group. But the video does not look like 7 stars scattering. The handle bends at Mizar and most of the figure travels as one piece.

To put a number on "one piece" I took the 5 middle stars, from Merak to Mizar. I fitted a shift, a rotation and a scale that take them from today to their places in 100,000 years. Then I looked at how far each of the 7 stars is from where this fit puts it. For the 5 stars the residual is at most 0.17 degrees. Dubhe is off by 6.9 degrees and Alkaid by 7.3. The rotation is 0.13 degrees. The scale is 1.044 because the 5 stars come toward us, Merak from 24.4 to 23.1 parsecs. Going back 100,000 years gives the same picture: the 5 hold, Dubhe is off by 6.4 and Alkaid by 6.8.

<figure class="fig">
<svg viewBox="0 0 640 278" role="img" aria-label="The Big Dipper with the motion of its 5 middle stars taken out. Merak, Phecda, Megrez, Alioth and Mizar stay in place within 0.18 degrees over 200,000 years. Dubhe drifts 6.6 degrees to the west and Alkaid 7.0 degrees, both measured at plus 100,000 years.">
  <line x1="500.6" y1="48.3" x2="527.0" y2="126.0" class="f-plain"/>
  <line x1="527.0" y1="126.0" x2="423.1" y2="186.9" class="f-plain"/>
  <line x1="423.1" y1="186.9" x2="374.3" y2="139.4" class="f-plain"/>
  <line x1="374.3" y1="139.4" x2="500.6" y2="48.3" class="f-plain"/>
  <line x1="374.3" y1="139.4" x2="293.6" y2="151.2" class="f-plain"/>
  <line x1="293.6" y1="151.2" x2="227.3" y2="155.3" class="f-plain"/>
  <line x1="227.3" y1="155.3" x2="149.0" y2="223.9" class="f-plain"/>
  <polyline points="401.1,44.3 403.1,44.4 405.0,44.5 407.0,44.6 409.0,44.6 411.0,44.7 413.0,44.8 415.0,44.9 417.0,44.9 419.0,45.0 421.0,45.1 423.0,45.2 425.0,45.2 427.0,45.3 429.0,45.4 431.0,45.5 433.0,45.6 434.9,45.6 436.9,45.7 438.9,45.8 440.9,45.9 442.9,45.9 444.9,46.0 446.9,46.1 448.9,46.2 450.9,46.3 452.9,46.3 454.8,46.4 456.8,46.5 458.8,46.6 460.8,46.7 462.8,46.7 464.8,46.8 466.8,46.9 468.8,47.0 470.8,47.1 472.7,47.1 474.7,47.2 476.7,47.3 478.7,47.4 480.7,47.5 482.7,47.5 484.7,47.6 486.7,47.7 488.6,47.8 490.6,47.9 492.6,48.0 494.6,48.0 496.6,48.1 498.6,48.2 500.6,48.3 502.5,48.4 504.5,48.5 506.5,48.5 508.5,48.6 510.5,48.7 512.5,48.8 514.5,48.9 516.4,49.0 518.4,49.0 520.4,49.1 522.4,49.2 524.4,49.3 526.4,49.4 528.3,49.5 530.3,49.5 532.3,49.6 534.3,49.7 536.3,49.8 538.3,49.9 540.2,50.0 542.2,50.1 544.2,50.1 546.2,50.2 548.2,50.3 550.2,50.4 552.1,50.5 554.1,50.6 556.1,50.7 558.1,50.8 560.1,50.8 562.1,50.9 564.0,51.0 566.0,51.1 568.0,51.2 570.0,51.3 572.0,51.4 574.0,51.5 575.9,51.5 577.9,51.6 579.9,51.7 581.9,51.8 583.9,51.9 585.9,52.0 587.9,52.1 589.8,52.2 591.8,52.3 593.8,52.4 595.8,52.4 597.8,52.5 599.8,52.6" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="401.1" cy="44.3" r="2.2" class="f-accent"/>
  <circle cx="421.0" cy="45.1" r="2.2" class="f-accent"/>
  <circle cx="440.9" cy="45.9" r="2.2" class="f-accent"/>
  <circle cx="460.8" cy="46.7" r="2.2" class="f-accent"/>
  <circle cx="480.7" cy="47.5" r="2.2" class="f-accent"/>
  <circle cx="500.6" cy="48.3" r="2.2" class="f-accent"/>
  <circle cx="520.4" cy="49.1" r="2.2" class="f-accent"/>
  <circle cx="540.2" cy="50.0" r="2.2" class="f-accent"/>
  <circle cx="560.1" cy="50.8" r="2.2" class="f-accent"/>
  <circle cx="579.9" cy="51.7" r="2.2" class="f-accent"/>
  <circle cx="599.8" cy="52.6" r="2.2" class="f-accent"/>
  <text x="395.1" y="36.3" text-anchor="end" class="f-label f-muted">−100,000 years</text>
  <text x="593.8" y="44.6" text-anchor="end" class="f-label f-muted">+100,000 years</text>
  <polyline points="44.8,204.0 46.9,204.4 49.0,204.8 51.1,205.2 53.2,205.6 55.3,206.0 57.4,206.4 59.5,206.8 61.6,207.2 63.7,207.6 65.8,208.0 67.9,208.4 70.0,208.8 72.0,209.2 74.1,209.6 76.2,210.0 78.3,210.4 80.4,210.8 82.5,211.2 84.6,211.6 86.7,212.0 88.7,212.4 90.8,212.8 92.9,213.2 95.0,213.6 97.1,214.0 99.2,214.4 101.3,214.8 103.3,215.1 105.4,215.5 107.5,215.9 109.6,216.3 111.7,216.7 113.7,217.1 115.8,217.5 117.9,217.9 120.0,218.3 122.1,218.7 124.1,219.1 126.2,219.5 128.3,219.9 130.4,220.3 132.4,220.7 134.5,221.1 136.6,221.5 138.7,221.9 140.7,222.3 142.8,222.7 144.9,223.1 147.0,223.5 149.0,223.9 151.1,224.3 153.2,224.7 155.2,225.1 157.3,225.5 159.4,225.9 161.4,226.3 163.5,226.7 165.6,227.1 167.6,227.5 169.7,227.8 171.8,228.2 173.8,228.6 175.9,229.0 178.0,229.4 180.0,229.8 182.1,230.2 184.2,230.6 186.2,231.0 188.3,231.4 190.4,231.8 192.4,232.2 194.5,232.6 196.5,233.0 198.6,233.4 200.7,233.8 202.7,234.2 204.8,234.6 206.8,235.0 208.9,235.4 210.9,235.8 213.0,236.2 215.1,236.6 217.1,237.0 219.2,237.4 221.2,237.8 223.3,238.2 225.3,238.6 227.4,239.0 229.4,239.4 231.5,239.8 233.5,240.2 235.6,240.5 237.7,240.9 239.7,241.3 241.8,241.7 243.8,242.1 245.9,242.5 247.9,242.9 250.0,243.3 252.0,243.7" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="44.8" cy="204.0" r="2.2" class="f-accent"/>
  <circle cx="65.8" cy="208.0" r="2.2" class="f-accent"/>
  <circle cx="86.7" cy="212.0" r="2.2" class="f-accent"/>
  <circle cx="107.5" cy="215.9" r="2.2" class="f-accent"/>
  <circle cx="128.3" cy="219.9" r="2.2" class="f-accent"/>
  <circle cx="149.0" cy="223.9" r="2.2" class="f-accent"/>
  <circle cx="169.7" cy="227.8" r="2.2" class="f-accent"/>
  <circle cx="190.4" cy="231.8" r="2.2" class="f-accent"/>
  <circle cx="210.9" cy="235.8" r="2.2" class="f-accent"/>
  <circle cx="231.5" cy="239.8" r="2.2" class="f-accent"/>
  <circle cx="252.0" cy="243.7" r="2.2" class="f-accent"/>
  <text x="50.8" y="196.0" text-anchor="start" class="f-label f-muted">−100,000 years</text>
  <text x="258.0" y="235.7" text-anchor="start" class="f-label f-muted">+100,000 years</text>
  <circle cx="500.6" cy="48.3" r="4.5" class="f-accent"/>
  <text x="500.6" y="66.3" text-anchor="middle" class="f-label f-ink">Dubhe</text>
  <circle cx="527.0" cy="126.0" r="4" class="f-ink"/>
  <text x="527.0" y="144.0" text-anchor="middle" class="f-label f-ink">Merak</text>
  <circle cx="423.1" cy="186.9" r="4" class="f-ink"/>
  <text x="423.1" y="204.9" text-anchor="middle" class="f-label f-ink">Phecda</text>
  <circle cx="374.3" cy="139.4" r="4" class="f-ink"/>
  <text x="374.3" y="157.4" text-anchor="middle" class="f-label f-ink">Megrez</text>
  <circle cx="293.6" cy="151.2" r="4" class="f-ink"/>
  <text x="293.6" y="169.2" text-anchor="middle" class="f-label f-ink">Alioth</text>
  <circle cx="227.3" cy="155.3" r="4" class="f-ink"/>
  <text x="227.3" y="173.3" text-anchor="middle" class="f-label f-ink">Mizar</text>
  <circle cx="149.0" cy="223.9" r="4.5" class="f-accent"/>
  <text x="149.0" y="241.9" text-anchor="middle" class="f-label f-ink">Alkaid</text>
</svg>
<figcaption>The same 200,000 years, seen from the 5 middle stars: each frame is moved and scaled so that they sit as today. They stay within 0.18 degrees. The 2 orange lines are where Dubhe and Alkaid go, with a dot every 20,000 years. Here the future is scaled back to today, so the numbers differ a little from the fit in the text.</figcaption>
</figure>

The velocities explain it. Relative to the mean of the 5, each of them moves at 0.7 to 2.9 km/s. Dubhe moves at 36 km/s and Alkaid at 33. The 5 middle stars belong to the Ursa Major moving group and the 2 end stars do not. This is old knowledge. S&T says it in the same article. Still, before the fit I did not expect that the whole "falling apart" is only these 2 stars.

Alkaid leaves the fitted shape by a Moon width in about 7,100 years and Dubhe in 7,600. The first of the 5 to do the same is Phecda, after about 300,000 years. That number I trust less. Phecda moves at 0.9 km/s relative to the group and at such speeds the catalog errors matter. Pushed through them, its residual at 300,000 years lands anywhere from 0.34 to 0.66 degrees.

## How much the straight line lies

The model is simple, so I checked what it ignores. Everything below is in degrees at plus 100,000 years and it is all in the chart after this section.

The easy way to do this is to add the proper motion to today's coordinates and forget the distance. Against my 3D lines this differs by 0.16 to 0.26 degrees per star. 2 things make this difference and they are of the same size. Without the radial velocity the stars land 0.08 to 0.17 degrees from where they land with it. Coming closer speeds up their motion on the sky. Adding degrees to coordinates near the pole is the second error, 0.09 to 0.26 degrees, largest for Dubhe at 62 degrees north.

The catalog errors I pushed through a Monte Carlo with 4,000 draws per star. For 6 stars the 95th percentile of the shift is at most 0.03 degrees. Mizar has 0.11, because its Hipparcos proper motion error is about 1.5 mas per year against 0.1 to 0.4 for the others. Mizar is a multiple star and its radial velocity depends on the source. With Gaia's value for Mizar B, minus 10.3 km/s instead of minus 6.3, it ends up 0.06 degrees away. The bend of the orbit in the Galaxy I estimated from above with the vertical tide of the disk. It gives 6 arcseconds.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Bar chart on a log scale, degrees at plus 100,000 years. Alkaid leaves the shape by 7.3 and Dubhe by 6.9. Everything else is below 0.3: flat sum of coordinates against the 3D line 0.26, residual of the 5 middle stars 0.17, catalog errors 0.11, other radial velocity for Mizar 0.06, tide of the Galaxy 0.0016.">
  <line x1="240.0" y1="14" x2="240.0" y2="224" class="f-plain"/>
  <text x="240.0" y="234" text-anchor="middle" class="f-label f-muted">0.001</text>
  <line x1="327.5" y1="14" x2="327.5" y2="224" class="f-plain"/>
  <text x="327.5" y="234" text-anchor="middle" class="f-label f-muted">0.01</text>
  <line x1="415.0" y1="14" x2="415.0" y2="224" class="f-plain"/>
  <text x="415.0" y="234" text-anchor="middle" class="f-label f-muted">0.1</text>
  <line x1="502.5" y1="14" x2="502.5" y2="224" class="f-plain"/>
  <text x="502.5" y="234" text-anchor="middle" class="f-label f-muted">1</text>
  <line x1="590.0" y1="14" x2="590.0" y2="224" class="f-plain"/>
  <text x="590.0" y="234" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="230" y="33" text-anchor="end" class="f-label f-ink">Alkaid leaves the shape</text>
  <rect x="240" y="22" width="338.0" height="16" class="f-accent"/>
  <text x="584.0" y="34" class="f-label f-ink">7.3</text>
  <text x="230" y="63" text-anchor="end" class="f-label f-ink">Dubhe leaves the shape</text>
  <rect x="240" y="52" width="336.0" height="16" class="f-accent"/>
  <text x="582.0" y="64" class="f-label f-ink">6.9</text>
  <text x="230" y="93" text-anchor="end" class="f-label f-ink">flat sum against 3D line</text>
  <rect x="240" y="82" width="210.7" height="16" class="f-muted"/>
  <text x="456.7" y="94" class="f-label f-ink">0.26</text>
  <text x="230" y="123" text-anchor="end" class="f-label f-ink">5 middle stars, residual</text>
  <rect x="240" y="112" width="195.7" height="16" class="f-muted"/>
  <text x="441.7" y="124" class="f-label f-ink">0.17</text>
  <text x="230" y="153" text-anchor="end" class="f-label f-ink">catalog errors, 95%</text>
  <rect x="240" y="142" width="178.5" height="16" class="f-muted"/>
  <text x="424.5" y="154" class="f-label f-ink">0.11</text>
  <text x="230" y="183" text-anchor="end" class="f-label f-ink">Mizar, other velocity</text>
  <rect x="240" y="172" width="153.3" height="16" class="f-muted"/>
  <text x="399.3" y="184" class="f-label f-ink">0.06</text>
  <text x="230" y="213" text-anchor="end" class="f-label f-ink">tide of the Galaxy</text>
  <rect x="240" y="202" width="18.3" height="16" class="f-muted"/>
  <text x="264.3" y="214" class="f-label f-ink">0.0016</text>
  <text x="590" y="252" text-anchor="end" class="f-label f-muted">degrees</text>
</svg>
<figcaption>Largest value over the 7 stars for each row, at plus 100,000 years. The scale is logarithmic, each step is 10 times.</figcaption>
</figure>

None of this comes close to the 7 degrees of Dubhe and Alkaid. The straight line is fine for this horizon. The 0.17 degrees of Phecda is also not noise from the catalog: with the errors pushed through the fit, it stays between 0.15 and 0.20. So within this data the 5 stars really do change shape a little.

## What I did not check

The brightness in the video is only the Hipparcos magnitude corrected for distance. Megrez gets brighter by 0.11 because it comes closer. Other stars of the constellation are not in the video, only the 7. I did not model the orbits inside Mizar and Alcor. The 300,000 years for Phecda depend on a velocity difference of about 1 km/s. I did not test how they change with other radial velocity catalogs.
