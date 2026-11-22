---
title: "How fast the Galaxy turns in Gaia EDR3 and which part of the answer I typed in myself"
description: "From proper motions of 153 678 Gaia EDR3 stars within 500 pc the Oort constants are A = 14.0 and B = −13.1 km/s per kpc, so the Sun's neighborhood turns at 220 km/s. My first fit gave 28.5 instead of 27.0 for A − B because of how I clipped outliers. With radial velocities the disk curve is flat near 227 km/s, but its level is the speed of the Sun that I typed in."
date: 2020-12-20
lang: en
translationKey: gaia-disk-rotation
tags: ["open-data", "statistics"]
---
For years I have carried one number about our Galaxy around with me. The Sun goes around the center at something like 220 to 230 km/s. I never derived it. It is a textbook number, like the age of the Earth. I had no idea how people actually get it. Gaia EDR3 came out on December 3, with parallaxes and proper motions for 1.47 billion sources. I wanted to see if the public catalog and an evening are enough to get that number myself.

It took more than an evening. All the data is ADQL queries to the EDR3 table in slices of `random_index`. This is a random number per source, so a slice is a fair sample of the sky. The rest is about 200 lines of Python with numpy and astropy.

## Rotation without radial velocities

If the disk turned like a solid plate, there would be no wave in the proper motions of the stars around us. It does not turn like that. Stars closer to the center overtake us and stars further out fall behind. Seen from the Sun, this leaves a wave in the proper motions along Galactic longitude. It goes around the sky twice: A·cos 2l + B. Oort wrote this down in 1927. A measures the shear and B the local spin. For an axisymmetric disk, A − B is the angular speed of the rotation at the Sun. For that number you need no radial velocities and no distance to the center.

I took stars closer than 500 pc (parallax above 2 mas, at least 10 times its error) from a random 1.1% of the catalog. After a cut for a clean astrometric fit (RUWE below 1.4), 153 678 stars were left. The fit also has terms for the reflex of the Sun's own motion, which for nearby stars is much bigger than the wave.

My first fit was in the units of proper motion, with 3σ outliers clipped. It gave A = 15.5 and B = −13.0 km/s per kpc. Bovy got 15.3 and −11.9 from Gaia DR1 in 2017, so this looked right. Then I split the sample by distance and the first bin was nonsense: closer than 100 pc A was 51. My first suspect was the Hyades. It is a big cluster 47 pc away at l = 180°, exactly where cos 2l peaks. I removed a circle of 20° around it, which took out 51 of the 1 540 stars in that bin. A went from 51 to 53. So it was not the Hyades.

It was my clipping. In proper motion units a star at 50 pc with an ordinary velocity looks 10 times more extreme than the same star at 500 pc. So the 3σ cut kept only 1 540 of the 3 033 nearest stars. Of the far ones it threw out almost none. I redid the fit in velocity units, multiplying by the distance. There the scatter is just how fast stars move relative to each other. I left out the clipping completely.

A = 14.0 ± 0.4 and B = −13.1 ± 0.3 km/s per kpc. A − B is 27.0 ± 0.6. Multiplied by the distance to the center, 8.122 kpc from the GRAVITY collaboration in 2018, it gives 220 km/s. So the textbook number does come out of proper motions of nearby stars. But the first fit gave 28.5. The change of method moved the result by about 3 of its own error bars.

<figure class="fig">
<svg viewBox="0 0 680 284" role="img" aria-label="Proper motion along Galactic longitude, converted to km/s per kpc, for 60 229 stars between 200 and 500 pc and within 20 degrees of the Galactic plane, after removing the reflex of the Sun's own motion. One dot per 15 degrees of longitude, the least squares mean. The dots follow a wave with two peaks, near 0 and 180 degrees, and two troughs, near 90 and 270 degrees. The fitted curve has amplitude A = 14.0 and sits around the level B = -13.1, so most of the wave is below zero.">
  <line x1="70" y1="242.0" x2="650" y2="242.0" class="f-plain"/>
  <text x="64.0" y="246.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-40</text>
  <line x1="70" y1="202.0" x2="650" y2="202.0" class="f-plain"/>
  <text x="64.0" y="206.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-30</text>
  <line x1="70" y1="162.0" x2="650" y2="162.0" class="f-plain"/>
  <text x="64.0" y="166.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-20</text>
  <line x1="70" y1="122.0" x2="650" y2="122.0" class="f-plain"/>
  <text x="64.0" y="126.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">-10</text>
  <line x1="70" y1="82.0" x2="650" y2="82.0" class="f-plain" style="stroke:var(--muted)"/>
  <text x="64.0" y="86.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="42.0" x2="650" y2="42.0" class="f-plain"/>
  <text x="64.0" y="46.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="70" y="18" class="f-label f-muted">km/s per kpc</text>
  <text x="70.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0°</text>
  <text x="142.5" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">45°</text>
  <text x="215.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90°</text>
  <text x="287.5" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">135°</text>
  <text x="360.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180°</text>
  <text x="432.5" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">225°</text>
  <text x="505.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">270°</text>
  <text x="577.5" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">315°</text>
  <text x="650.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">360°</text>
  <text x="360" y="274" text-anchor="middle" class="f-label f-muted">Galactic longitude l, degrees</text>
  <line x1="70" y1="134.3" x2="650" y2="134.3" class="f-line" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:5 4"/>
  <line x1="546" y1="14" x2="574" y2="14" class="f-line" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:5 4"/>
  <text x="650.0" y="18.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">B = -13.1</text>
  <path d="M70.0,78.4L73.2,77.8L76.4,77.5L79.7,77.5L82.9,77.8L86.1,78.3L89.3,79.1L92.6,80.2L95.8,81.5L99.0,83.1L102.2,84.9L105.4,87.0L108.7,89.3L111.9,91.8L115.1,94.6L118.3,97.5L121.6,100.6L124.8,103.9L128.0,107.3L131.2,110.9L134.4,114.5L137.7,118.3L140.9,122.1L144.1,126.0L147.3,130.0L150.6,133.9L153.8,137.9L157.0,141.9L160.2,145.8L163.4,149.6L166.7,153.4L169.9,157.1L173.1,160.7L176.3,164.1L179.6,167.4L182.8,170.5L186.0,173.5L189.2,176.3L192.4,178.8L195.7,181.2L198.9,183.3L202.1,185.2L205.3,186.8L208.6,188.2L211.8,189.3L215.0,190.2L218.2,190.8L221.4,191.1L224.7,191.1L227.9,190.8L231.1,190.3L234.3,189.5L237.6,188.4L240.8,187.1L244.0,185.5L247.2,183.7L250.4,181.6L253.7,179.3L256.9,176.7L260.1,174.0L263.3,171.1L266.6,168.0L269.8,164.7L273.0,161.3L276.2,157.7L279.4,154.0L282.7,150.3L285.9,146.4L289.1,142.5L292.3,138.6L295.6,134.6L298.8,130.7L302.0,126.7L305.2,122.8L308.4,119.0L311.7,115.2L314.9,111.5L318.1,107.9L321.3,104.5L324.6,101.2L327.8,98.0L331.0,95.1L334.2,92.3L337.4,89.7L340.7,87.4L343.9,85.3L347.1,83.4L350.3,81.7L353.6,80.4L356.8,79.2L360.0,78.4L363.2,77.8L366.4,77.5L369.7,77.5L372.9,77.8L376.1,78.3L379.3,79.1L382.6,80.2L385.8,81.5L389.0,83.1L392.2,84.9L395.4,87.0L398.7,89.3L401.9,91.8L405.1,94.6L408.3,97.5L411.6,100.6L414.8,103.9L418.0,107.3L421.2,110.9L424.4,114.5L427.7,118.3L430.9,122.1L434.1,126.0L437.3,130.0L440.6,133.9L443.8,137.9L447.0,141.9L450.2,145.8L453.4,149.6L456.7,153.4L459.9,157.1L463.1,160.7L466.3,164.1L469.6,167.4L472.8,170.5L476.0,173.5L479.2,176.3L482.4,178.8L485.7,181.2L488.9,183.3L492.1,185.2L495.3,186.8L498.6,188.2L501.8,189.3L505.0,190.2L508.2,190.8L511.4,191.1L514.7,191.1L517.9,190.8L521.1,190.3L524.3,189.5L527.6,188.4L530.8,187.1L534.0,185.5L537.2,183.7L540.4,181.6L543.7,179.3L546.9,176.7L550.1,174.0L553.3,171.1L556.6,168.0L559.8,164.7L563.0,161.3L566.2,157.7L569.4,154.0L572.7,150.3L575.9,146.4L579.1,142.5L582.3,138.6L585.6,134.6L588.8,130.7L592.0,126.7L595.2,122.8L598.4,119.0L601.7,115.2L604.9,111.5L608.1,107.9L611.3,104.5L614.6,101.2L617.8,98.0L621.0,95.1L624.2,92.3L627.4,89.7L630.7,87.4L633.9,85.3L637.1,83.4L640.3,81.7L643.6,80.4L646.8,79.2L650.0,78.4" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <line x1="82.1" y1="60.3" x2="82.1" y2="46.7" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="82.1" cy="53.5" r="3" class="f-ink"/>
  <line x1="106.3" y1="63.0" x2="106.3" y2="50.9" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="106.3" cy="56.9" r="3" class="f-ink"/>
  <line x1="130.4" y1="104.6" x2="130.4" y2="91.9" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="130.4" cy="98.2" r="3" class="f-ink"/>
  <line x1="154.6" y1="147.7" x2="154.6" y2="134.4" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="154.6" cy="141.0" r="3" class="f-ink"/>
  <line x1="178.8" y1="171.8" x2="178.8" y2="157.7" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="178.8" cy="164.8" r="3" class="f-ink"/>
  <line x1="202.9" y1="193.5" x2="202.9" y2="178.6" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="202.9" cy="186.0" r="3" class="f-ink"/>
  <line x1="227.1" y1="202.1" x2="227.1" y2="187.2" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="227.1" cy="194.6" r="3" class="f-ink"/>
  <line x1="251.3" y1="198.2" x2="251.3" y2="182.4" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="251.3" cy="190.3" r="3" class="f-ink"/>
  <line x1="275.4" y1="181.8" x2="275.4" y2="166.3" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="275.4" cy="174.0" r="3" class="f-ink"/>
  <line x1="299.6" y1="147.9" x2="299.6" y2="133.2" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="299.6" cy="140.5" r="3" class="f-ink"/>
  <line x1="323.8" y1="111.9" x2="323.8" y2="96.6" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="323.8" cy="104.2" r="3" class="f-ink"/>
  <line x1="347.9" y1="108.3" x2="347.9" y2="94.0" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="347.9" cy="101.1" r="3" class="f-ink"/>
  <line x1="372.1" y1="102.9" x2="372.1" y2="89.9" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="372.1" cy="96.4" r="3" class="f-ink"/>
  <line x1="396.3" y1="119.8" x2="396.3" y2="106.4" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="396.3" cy="113.1" r="3" class="f-ink"/>
  <line x1="420.4" y1="129.6" x2="420.4" y2="117.1" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="420.4" cy="123.4" r="3" class="f-ink"/>
  <line x1="444.6" y1="168.8" x2="444.6" y2="154.3" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="444.6" cy="161.6" r="3" class="f-ink"/>
  <line x1="468.8" y1="171.2" x2="468.8" y2="156.2" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="468.8" cy="163.7" r="3" class="f-ink"/>
  <line x1="492.9" y1="183.4" x2="492.9" y2="168.8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="492.9" cy="176.1" r="3" class="f-ink"/>
  <line x1="517.1" y1="209.4" x2="517.1" y2="193.0" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="517.1" cy="201.2" r="3" class="f-ink"/>
  <line x1="541.3" y1="173.2" x2="541.3" y2="158.5" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="541.3" cy="165.8" r="3" class="f-ink"/>
  <line x1="565.4" y1="155.2" x2="565.4" y2="140.0" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="565.4" cy="147.6" r="3" class="f-ink"/>
  <line x1="589.6" y1="144.1" x2="589.6" y2="129.0" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="589.6" cy="136.6" r="3" class="f-ink"/>
  <line x1="613.8" y1="101.9" x2="613.8" y2="87.8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="613.8" cy="94.9" r="3" class="f-ink"/>
  <line x1="637.9" y1="65.3" x2="637.9" y2="52.5" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="637.9" cy="58.9" r="3" class="f-ink"/>
</svg>
<figcaption>Stars between 200 and 500 pc. Dots are least squares means per 15° of longitude. The curve is A·cos 2l − C·sin 2l + B from the fit, the dashed line is the level B.</figcaption>
</figure>

## All 6 numbers per star

The second way is the direct one. EDR3 has no new radial velocities, it carries the DR2 ones for 7 209 831 stars in the column `dr2_radial_velocity`. I took the stars that have one and a parallax at least 5 times its error, from 11% of the catalog. 670 686 of them passed the RUWE cut. With position, parallax, proper motion and radial velocity, astropy turns every star into a velocity around the Galactic center. For that it needs the Sun's position and velocity. I used the parameter set that astropy calls `v4.0`. It is the default since astropy 4.1 in October: 8.122 kpc from the center, 20.8 pc above the plane, velocity (12.9, 245.6, 7.78) km/s.

99.35% of the stars go around in the same direction. For the thin disk, stars within 0.3 kpc of the plane, the median rotation speed near the Sun is 227 km/s. Between 6 and 10 kpc from the center the curve is almost flat, it falls by 1.0 ± 0.7 km/s per kpc. Stars more than 1 kpc above or below the plane go around at 191 km/s near the Sun, 36 km/s slower. Their speeds also scatter almost 3 times more.

<figure class="fig">
<svg viewBox="0 0 680 334" role="img" aria-label="Median rotation speed V_phi of Gaia EDR3 stars with a DR2 radial velocity, against the distance R from the Galactic center, 4 to 12.5 kpc, in three layers by height above the plane. |z| &lt; 0.3 kpc: 4.25 kpc 198, 4.75 kpc 207, 5.25 kpc 214, 5.75 kpc 219, 6.25 kpc 224, 6.75 kpc 226, 7.25 kpc 226, 7.75 kpc 228, 8.25 kpc 227, 8.75 kpc 224, 9.25 kpc 222, 9.75 kpc 222, 10.25 kpc 221, 10.75 kpc 220, 11.25 kpc 219, 11.75 kpc 220, 12.25 kpc 222. 0.3 to 1 kpc: 4.25 kpc 184, 4.75 kpc 194, 5.25 kpc 203, 5.75 kpc 210, 6.25 kpc 214, 6.75 kpc 215, 7.25 kpc 218, 7.75 kpc 223, 8.25 kpc 223, 8.75 kpc 222, 9.25 kpc 221, 9.75 kpc 222, 10.25 kpc 220, 10.75 kpc 218, 11.25 kpc 218, 11.75 kpc 219, 12.25 kpc 219. above 1 kpc: 4.25 kpc 153, 4.75 kpc 165, 5.25 kpc 174, 5.75 kpc 184, 6.25 kpc 185, 6.75 kpc 188, 7.25 kpc 187, 7.75 kpc 187, 8.25 kpc 194, 8.75 kpc 198, 9.25 kpc 201, 9.75 kpc 206, 10.25 kpc 207, 10.75 kpc 207, 11.25 kpc 212, 11.75 kpc 210, 12.25 kpc 213. The Sun is at 8.122 kpc.">
  <line x1="60" y1="236.0" x2="650" y2="236.0" class="f-plain"/>
  <text x="54.0" y="240.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">140</text>
  <line x1="60" y1="192.0" x2="650" y2="192.0" class="f-plain"/>
  <text x="54.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">160</text>
  <line x1="60" y1="148.0" x2="650" y2="148.0" class="f-plain"/>
  <text x="54.0" y="152.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">180</text>
  <line x1="60" y1="104.0" x2="650" y2="104.0" class="f-plain"/>
  <text x="54.0" y="108.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="60" y1="60.0" x2="650" y2="60.0" class="f-plain"/>
  <text x="54.0" y="64.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">220</text>
  <line x1="60" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="54.0" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="60" y="12" class="f-label f-muted">V_phi, km/s</text>
  <text x="60.0" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="129.4" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <text x="198.8" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="268.2" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="337.6" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="407.1" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="476.5" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="545.9" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="615.3" y="252.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <text x="355" y="268" text-anchor="middle" class="f-label f-muted">distance from the Galactic center R, kpc</text>
  <line x1="346.1" y1="16" x2="346.1" y2="236" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:2 3"/>
  <text x="350.1" y="230.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">Sun</text>
  <path d="M77.4,108.4L112.1,88.2L146.8,72.4L181.5,61.4L216.2,51.7L250.9,47.9L285.6,45.8L320.3,42.0L355.0,45.2L389.7,50.8L424.4,56.6L459.1,55.8L493.8,58.6L528.5,60.4L563.2,63.2L597.9,61.0L632.6,56.6" class="f-line" style="stroke:var(--accent);stroke-width:2.2"/>
  <circle cx="77.4" cy="108.4" r="2.3" class="f-accent"/>
  <circle cx="112.1" cy="88.2" r="2.3" class="f-accent"/>
  <circle cx="146.8" cy="72.4" r="2.3" class="f-accent"/>
  <circle cx="181.5" cy="61.4" r="2.3" class="f-accent"/>
  <circle cx="216.2" cy="51.7" r="2.3" class="f-accent"/>
  <circle cx="250.9" cy="47.9" r="2.3" class="f-accent"/>
  <circle cx="285.6" cy="45.8" r="2.3" class="f-accent"/>
  <circle cx="320.3" cy="42.0" r="2.3" class="f-accent"/>
  <circle cx="355.0" cy="45.2" r="2.3" class="f-accent"/>
  <circle cx="389.7" cy="50.8" r="2.3" class="f-accent"/>
  <circle cx="424.4" cy="56.6" r="2.3" class="f-accent"/>
  <circle cx="459.1" cy="55.8" r="2.3" class="f-accent"/>
  <circle cx="493.8" cy="58.6" r="2.3" class="f-accent"/>
  <circle cx="528.5" cy="60.4" r="2.3" class="f-accent"/>
  <circle cx="563.2" cy="63.2" r="2.3" class="f-accent"/>
  <circle cx="597.9" cy="61.0" r="2.3" class="f-accent"/>
  <circle cx="632.6" cy="56.6" r="2.3" class="f-accent"/>
  <path d="M77.4,139.6L112.1,116.4L146.8,96.7L181.5,82.7L216.2,73.5L250.9,70.2L285.6,63.9L320.3,53.5L355.0,52.4L389.7,55.5L424.4,58.2L459.1,56.6L493.8,59.8L528.5,65.2L563.2,63.5L597.9,62.8L632.6,61.7" class="f-line" style="stroke:var(--ink);stroke-width:1.5"/>
  <circle cx="77.4" cy="139.6" r="2.3" class="f-ink"/>
  <circle cx="112.1" cy="116.4" r="2.3" class="f-ink"/>
  <circle cx="146.8" cy="96.7" r="2.3" class="f-ink"/>
  <circle cx="181.5" cy="82.7" r="2.3" class="f-ink"/>
  <circle cx="216.2" cy="73.5" r="2.3" class="f-ink"/>
  <circle cx="250.9" cy="70.2" r="2.3" class="f-ink"/>
  <circle cx="285.6" cy="63.9" r="2.3" class="f-ink"/>
  <circle cx="320.3" cy="53.5" r="2.3" class="f-ink"/>
  <circle cx="355.0" cy="52.4" r="2.3" class="f-ink"/>
  <circle cx="389.7" cy="55.5" r="2.3" class="f-ink"/>
  <circle cx="424.4" cy="58.2" r="2.3" class="f-ink"/>
  <circle cx="459.1" cy="56.6" r="2.3" class="f-ink"/>
  <circle cx="493.8" cy="59.8" r="2.3" class="f-ink"/>
  <circle cx="528.5" cy="65.2" r="2.3" class="f-ink"/>
  <circle cx="563.2" cy="63.5" r="2.3" class="f-ink"/>
  <circle cx="597.9" cy="62.8" r="2.3" class="f-ink"/>
  <circle cx="632.6" cy="61.7" r="2.3" class="f-ink"/>
  <path d="M77.4,208.4L112.1,180.0L146.8,161.5L181.5,139.5L216.2,137.5L250.9,131.5L285.6,132.3L320.3,132.9L355.0,116.3L389.7,108.2L424.4,101.9L459.1,91.5L493.8,89.5L528.5,87.8L563.2,77.9L597.9,82.1L632.6,75.4" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="77.4" cy="208.4" r="2.3" class="f-ink"/>
  <circle cx="112.1" cy="180.0" r="2.3" class="f-ink"/>
  <circle cx="146.8" cy="161.5" r="2.3" class="f-ink"/>
  <circle cx="181.5" cy="139.5" r="2.3" class="f-ink"/>
  <circle cx="216.2" cy="137.5" r="2.3" class="f-ink"/>
  <circle cx="250.9" cy="131.5" r="2.3" class="f-ink"/>
  <circle cx="285.6" cy="132.3" r="2.3" class="f-ink"/>
  <circle cx="320.3" cy="132.9" r="2.3" class="f-ink"/>
  <circle cx="355.0" cy="116.3" r="2.3" class="f-ink"/>
  <circle cx="389.7" cy="108.2" r="2.3" class="f-ink"/>
  <circle cx="424.4" cy="101.9" r="2.3" class="f-ink"/>
  <circle cx="459.1" cy="91.5" r="2.3" class="f-ink"/>
  <circle cx="493.8" cy="89.5" r="2.3" class="f-ink"/>
  <circle cx="528.5" cy="87.8" r="2.3" class="f-ink"/>
  <circle cx="563.2" cy="77.9" r="2.3" class="f-ink"/>
  <circle cx="597.9" cy="82.1" r="2.3" class="f-ink"/>
  <circle cx="632.6" cy="75.4" r="2.3" class="f-ink"/>
  <line x1="60" y1="286" x2="82" y2="286" style="stroke:var(--accent);stroke-width:2.2"/>
  <text x="90" y="290" class="f-label f-muted">|z| &lt; 0.3 kpc</text>
  <line x1="60" y1="304" x2="82" y2="304" style="stroke:var(--ink);stroke-width:1.5"/>
  <text x="90" y="308" class="f-label f-muted">0.3 to 1 kpc</text>
  <line x1="60" y1="322" x2="82" y2="322" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="90" y="326" class="f-label f-muted">above 1 kpc</text>
</svg>
<figcaption>Median V_phi in bins of 0.5 kpc, bins with at least 200 stars. The vertical line is the Sun. The level of the curves depends on the speed I assumed for the Sun, see the text.</figcaption>
</figure>

## The part that came from me

At this point I wanted to see how much the result depends on my inputs. I raised the Sun's speed along the rotation by 10 km/s and the median near the Sun went from 227.2 to 237.2. When I lowered the speed by 10, the median went to 217.3, so it follows the input exactly.

Gaia measures every velocity relative to the Sun. To get it relative to the center, you add the Sun's own velocity. That number does not come from Gaia. The 245.6 comes from Sgr A*, the black hole in the center. Reid and Brunthaler measured in 2004 that it moves 6.379 mas per year across the sky. This times the distance gives the speed. So the level of my curve is a radio measurement of one object that I typed in.

I had it backwards in my head. I thought the 6D way was the real measurement and Oort constants a warm up. But A − B has no velocity of the Sun in it, so A − B can be checked against Sgr A* directly. 6.379 mas per year is 30.24 km/s per kpc for the Sun's full angular speed. The Sun itself runs 12.24 km/s ahead of a circular orbit (Schönrich, Binney and Dehnen, 2010). That is 1.51 per kpc, so a circular orbit here should turn at 28.73. My first fit gave 28.47 and I was quite happy with it. The proper fit gives 27.0 ± 0.6, 1.7 lower. That is 6% and about 3 of its error bars. For 2 methods that share only the distance to the center this is not bad, but it is not the perfect match I saw first.

The same correction fixed something else. The slope of the curve is −(A + B). My first fit gave −2.5 km/s per kpc and I was ready to write that it disagrees with the 6D curve. The velocity fit gives −0.9 ± 0.5 and the 6D curve says −1.0 ± 0.7.

## What I did not check

The distance is 1/parallax with one global offset of −0.017 mas from the EDR3 papers, not the correction per star. Far from the Sun this is biased, so I don't trust the drop inside 5 kpc on the chart. 227 is a median, not the circular speed, because I did not correct for the lag of stars with large random motions. The stars with radial velocities are bright ones from DR2 and I did not model which stars got into that list. A also drifts with distance, 18.4 at 100 to 200 pc and 13.7 at 300 to 500 pc. I don't know why. Everything is one run on one slice of the catalog. And none of this is new. Oort did it in 1927 and Bovy on DR1. Eilers and colleagues measured the whole curve from 5 to 25 kpc in 2019, much more carefully than here.
