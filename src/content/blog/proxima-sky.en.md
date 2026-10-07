---
title: "The sky from Proxima Centauri. Half the stars move less than a Moon width, Sirius moves 27 degrees"
description: "I wanted the whole sky seen from Proxima Centauri, built from a catalog. Gaia DR3 does not have the 7 brightest stars within 10 parsecs, so the sky is Hipparcos 2007 with Gaia's distance to Proxima. With catalog parallaxes Alpha Centauri B lands 70 degrees from A. The Sun is a 0.38 star in Cassiopeia, the median naked eye star moves 0.50 degrees and Sirius 27, into Orion."
date: 2026-10-03
lang: en
translationKey: proxima-sky
tags: ["open-data", "numbers"]
---
That the Sun seen from Alpha Centauri is a bright star in Cassiopeia I have read many times, on Wikipedia and in Sky & Telescope. I never computed it and I did not know what happens to the rest of the sky. Does it look familiar from 4.2 light years or is it a different sky with a few known stars in it? I wanted a picture of the whole sky from Proxima Centauri made from a catalog, with the numbers behind it.

<figure class="fig">
<img src="/media/proxima-sky/cover-en.png" width="1600" height="900" alt="The whole sky seen from Proxima Centauri, stars down to magnitude 6 on an oval map. Alpha Centauri A and B shine at the left edge at magnitudes −6.7 and −5.3. The Sun is a star of magnitude 0.4 at the top, in Cassiopeia. Sirius stands in Orion next to Betelgeuse." aria-label="The whole sky seen from Proxima Centauri, stars down to magnitude 6 on an oval map. Alpha Centauri A and B shine at the left edge at magnitudes −6.7 and −5.3. The Sun is a star of magnitude 0.4 at the top, in Cassiopeia. Sirius stands in Orion next to Betelgeuse." loading="lazy" style="display:block;width:100%;height:auto;margin:0 auto;border-radius:8px">
<figcaption>The sky from Proxima, stars to magnitude 6.0, Hipparcos positions and Gaia's distance to Proxima. Right ascension grows to the left, 6 hours in the middle.</figcaption>
</figure>

## Gaia did not have the bright stars

It is 2026 and for anything about stars I take Gaia first, so the plan was Gaia DR3 for everything. I ran it on Python 3.12.3 with astropy 8.0.1 and astroquery 0.4.11. Proxima itself is fine there: parallax 768.0665 mas with an error of 0.05, which puts it 1.302 parsecs from the Sun.

Then I checked the stars that matter most for this picture, the close and bright ones. Hipparcos has 47 stars nearer than 10 parsecs and of magnitude 6 or brighter. Gaia DR3 has 38 of them with a parallax. The 9 missing include the 7 brightest: Sirius, Alpha Centauri A, Vega, Procyon, Altair, Fomalhaut and Alpha Centauri B. For 6 of them there is no Gaia source at all within 10 arcseconds. Near Sirius there is one, at G = 8.5 and parallax 374 mas, but this is Sirius B, the white dwarf. The brightest stars saturate Gaia's detectors. I knew this in principle, but I did not expect the gap to cover exactly the stars I needed.

So the sky is Hipparcos, the new reduction by van Leeuwen (2007), 117,955 stars at epoch 1991.25. Gaia gives the distance to Proxima. For Alpha Centauri A and B I took 747.17 mas from Kervella and others (2016), who got it from a fit of the orbit of the pair. The method itself is short. Each star is a point in 3D and I move the observer to Proxima. Then I take the new direction and correct the brightness for the new distance.

## Where the first run put Alpha Centauri B

My first run used the Hipparcos parallaxes for all stars, including A and B. B landed in Draco, 70 degrees away from A. A pair with an orbit of about 23 AU was split across the sky.

The reason is in the catalog. Hipparcos gives A 754.81 mas and B 796.92 ± 25.9. In distance this puts 14,400 AU between them along the line of sight, while from Proxima to A it is about 12,800 AU. So from Proxima these 2 catalog points land in different parts of the sky. My first thought was a sign error in my vectors and only after that I looked at the parallax errors. It was not the code. The error of B alone is about 8,400 AU in distance, the same order as the distance from Proxima to it. With one common parallax for the pair they are a few arcminutes apart, at magnitudes −6.7 and −5.3.

## The Sun is the 9th star

The Sun is where everybody says. Its direction from Proxima is exactly opposite to the direction of Proxima from us, so it sits at right ascension 37.4 degrees, declination +62.7, in Cassiopeia. From 1.302 parsecs its magnitude is 0.38. Sky & Telescope gives +0.4, so this agrees. Only 8 stars are brighter. Besides A and B these are 6 stars that are bright from Earth too, with Sirius first. Achernar is already fainter than the Sun, by 0.03.

In Cassiopeia it stands 4.1 degrees from Epsilon Cassiopeiae, the end of the W. The shape survives: 4 of its 5 stars move by less than 0.4 degrees and Caph by 1.2. The Sun sits just past that end.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Cassiopeia seen from Earth and from Proxima. The W of 5 stars keeps its shape: Segin, Ruchbah, Gamma and Schedar move by less than 0.4 degrees, Caph by 1.2. The Sun appears as a new star of magnitude 0.38 about 4 degrees east of Segin and extends the zigzag.">
  <polyline points="188.5,64.2 272.0,170.2 372.3,156.4 441.9,268.2 544.9,175.2" style="fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>
  <polyline points="71.6,65.1 187.3,64.2 263.9,165.9 370.1,155.7 435.1,264.5 511.0,167.3" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="188.5" cy="64.2" r="3" class="f-muted"/>
  <circle cx="187.3" cy="64.2" r="3.4" class="f-ink"/>
  <text x="187.3" y="50.2" text-anchor="middle" class="f-label f-ink">Segin 0.04°</text>
  <circle cx="272.0" cy="170.2" r="3" class="f-muted"/>
  <circle cx="263.9" cy="165.9" r="4.1" class="f-ink"/>
  <text x="263.9" y="187.9" text-anchor="middle" class="f-label f-ink">Ruchbah 0.33°</text>
  <circle cx="372.3" cy="156.4" r="3" class="f-muted"/>
  <circle cx="370.1" cy="155.7" r="4.8" class="f-ink"/>
  <text x="370.1" y="141.7" text-anchor="middle" class="f-label f-ink">Gamma 0.08°</text>
  <circle cx="441.9" cy="268.2" r="3" class="f-muted"/>
  <circle cx="435.1" cy="264.5" r="4.6" class="f-ink"/>
  <text x="435.1" y="286.5" text-anchor="middle" class="f-label f-ink">Schedar 0.27°</text>
  <circle cx="544.9" cy="175.2" r="3" class="f-muted"/>
  <circle cx="511.0" cy="167.3" r="4.5" class="f-ink"/>
  <text x="511.0" y="153.3" text-anchor="middle" class="f-label f-ink">Caph 1.22°</text>
  <circle cx="71.6" cy="65.1" r="6.7" style="fill:#e8a860"/>
  <circle cx="71.6" cy="65.1" r="12.7" style="fill:none;stroke:#e8a860;stroke-width:1"/>
  <text x="71.6" y="47.1" text-anchor="middle" class="f-label" style="fill:#e8a860">Sun 0.38</text>
</svg>
<figcaption>Cassiopeia from Earth (grey, dashed) and from Proxima (solid). Orange is the Sun. East is to the left, the frame is 20 degrees wide.</figcaption>
</figure>

## Most of the sky barely moves

Now the question I really had. Hipparcos has 5,039 stars of magnitude 6 or brighter, leaving out A and B. Their median shift on the sky is 0.50 degrees, about the width of the Moon. 2,529 stars move by less than that and 66 move by more than 5 degrees. Brightness barely changes either: only 122 stars change by more than 0.1 magnitude.

Parallax errors could make all of this noise, so I ran a Monte Carlo with 2,000 draws over the errors of every parallax. In 95% of the draws the median shift stays between 1,780 and 1,806 arcseconds.

<figure class="fig">
<svg viewBox="0 0 640 200" role="img" aria-label="Bar chart of how far the 5,039 naked eye stars move on the sky from Proxima. Under 0.1 degrees 363, 0.1 to 0.5 degrees 2,166, 0.5 to 1 degree 1,334, 1 to 5 degrees 1,110, over 5 degrees 66. The median is 0.50 degrees, about the width of the Moon.">
  <text x="160" y="33" text-anchor="end" class="f-label f-ink">under 0.1°</text>
  <rect x="170" y="20" width="67.0" height="18" class="f-muted"/>
  <text x="243.0" y="33" class="f-label f-ink">363</text>
  <text x="160" y="69" text-anchor="end" class="f-label f-ink">0.1° to 0.5°</text>
  <rect x="170" y="56" width="400.0" height="18" class="f-muted"/>
  <text x="576.0" y="69" class="f-label f-ink">2,166</text>
  <text x="160" y="105" text-anchor="end" class="f-label f-ink">0.5° to 1°</text>
  <rect x="170" y="92" width="246.4" height="18" class="f-muted"/>
  <text x="422.4" y="105" class="f-label f-ink">1,334</text>
  <text x="160" y="141" text-anchor="end" class="f-label f-ink">1° to 5°</text>
  <rect x="170" y="128" width="205.0" height="18" class="f-muted"/>
  <text x="381.0" y="141" class="f-label f-ink">1,110</text>
  <text x="160" y="177" text-anchor="end" class="f-label f-ink">over 5°</text>
  <rect x="170" y="164" width="12.2" height="18" class="f-muted"/>
  <text x="188.2" y="177" class="f-label f-ink">66</text>
</svg>
<figcaption>Shift on the sky for 5,039 stars of magnitude 6 or brighter, without Alpha Centauri A and B. Median 0.50 degrees.</figcaption>
</figure>

All big moves belong to near stars. Sirius moves 26.9 degrees, out of Canis Major into Orion. At −1.26 it is still the brightest star after A and B. Procyon moves 18.9 degrees into Gemini and Altair 14.0 degrees into Sagitta. 226 stars cross into another constellation. Most of them do not travel far. The median shift among them is 1.2 degrees.

Here I stumbled a second time. Wikipedia says that from Alpha Centauri Sirius stands less than a degree from Betelgeuse. I got 1.8 degrees. Wikipedia counts from A and B and I count from Proxima, so I repeated the projection from A and got 1.3 degrees. The 12,800 AU between Proxima and A change the gap between Sirius and Betelgeuse by half a degree, but even from A I do not get "less than a degree". Where that number comes from I did not find.

Faint stars, which Gaia does have, do not change the picture. Of its 315 sources nearer than 10 parsecs, none becomes visible to the eye from there. The largest gain is 0.7 magnitudes, for a star of G = 14.

## What I did not check

All positions are for 1991.25 and the stars have moved since then, Proxima by about 2.3 arcminutes, which does not change any number here. Brightness is the Hipparcos V magnitude corrected for distance only, without extinction, which at these distances does not matter. Variable stars keep their catalog value. The limit of magnitude 6.0 is a convention: the 60 stars that drop below it and the 28 that rise above it are all within 0.21 of the line. The least certain number here is the direction to A from Proxima. With the parallax error of 0.61 mas it moves by up to 1.8 degrees in 95% of the Monte Carlo draws. I also computed the sky from the star and not from its planet, which for this picture is the same thing.
