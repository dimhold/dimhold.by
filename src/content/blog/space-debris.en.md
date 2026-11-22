---
title: "What is above the horizon, according to the open satellite catalog"
description: "What from the public CelesTrak satellite catalog is above the horizon at 52° north at an average moment? I took the Wayback copy of 11 March 2021, checked my method against SGP4 on 4010 working satellites and got about 3000 objects, half of them debris. Low orbits are 74% of the catalog but only 39% of that sky."
date: 2021-04-11
lang: en
translationKey: space-debris
tags: ["open-data", "statistics"]
---
Every Starlink launch brings the same argument back into my feeds: the sky is getting crowded and low orbit is turning into a junkyard. I had an opinion on it. I never opened the catalog the argument is about, although it is public and is just a text file.

The file is `satcat.txt` from CelesTrak, the public satellite catalog of the US Space Force republished by T.S. Kelso. It has one line per object that was ever tracked, with launch and decay dates and the shape of the orbit. I took the copy saved by the Wayback Machine on 11 March 2021, the latest one before today. So anybody can check my numbers on the same bytes. It ends at NORAD number 47721.

My question was simple. If I stand somewhere at 52° north and look up, what from this file is above my horizon right now?

## What is in the file

47721 objects were catalogued since Sputnik. 22129 of them are still in Earth orbit.

Of those, 13138 are debris and 6733 are payloads. The rest are rocket bodies and odd things like the copper needles of Project West Ford and the fuel cores of old Soviet reactor satellites. Only 3855 payloads are marked as working, so about 1 object in 6 does something.

My first count lost 515 objects. It was my own parser. The last column of the file says around which body the object flies. I dropped every code starting with `NE`, because that looked like Neptune. `NEA` means "no elements available" and 515 objects in Earth orbit carry it. For 302 of them the orbit columns are really empty. Together with a few other codes, 323 objects in orbit have no orbit in the file, 282 of them American.

Most of what has elements is low. 16209 of 21806 objects have apogee below 2000 km, it is 74%. The debris has a clear peak between 800 and 850 km, with 1494 fragments in a single 50 km step. A second peak is lower, between 500 and 550 km. 1337 of the 1584 objects there are payloads, 852 of them Starlink.

<figure class="fig">
<svg viewBox="0 0 680 294" role="img" aria-label="Histogram of 16209 catalogued objects in low orbit by mean altitude in 50 km steps, stacked by type. Debris dominates and peaks at 800 to 850 km with 1494 fragments.">
  <rect x="60.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="78" y="23" text-anchor="start" class="f-muted" style="font-size:11px">debris</text>
  <rect x="260.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="278" y="23" text-anchor="start" class="f-muted" style="font-size:11px">payloads</text>
  <rect x="460.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="478" y="23" text-anchor="start" class="f-muted" style="font-size:11px">rocket bodies and other</text>
  <rect x="61.0" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="61.0" y="249.9" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="61.0" y="249.8" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="77.2" y="249.6" width="14.2" height="0.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="77.2" y="249.3" width="14.2" height="0.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="77.2" y="249.3" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="93.4" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="93.4" y="248.2" width="14.2" height="1.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="93.4" y="248.1" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="109.6" y="249.3" width="14.2" height="0.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="109.6" y="245.9" width="14.2" height="3.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="109.6" y="245.5" width="14.2" height="0.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="125.9" y="247.4" width="14.2" height="2.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="125.9" y="225.6" width="14.2" height="21.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="125.9" y="225.0" width="14.2" height="0.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="142.1" y="245.7" width="14.2" height="4.3" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="142.1" y="228.2" width="14.2" height="17.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="142.1" y="226.5" width="14.2" height="1.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="158.3" y="239.6" width="14.2" height="10.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="158.3" y="179.9" width="14.2" height="59.7" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="158.3" y="176.4" width="14.2" height="3.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="174.5" y="231.6" width="14.2" height="18.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="174.5" y="72.2" width="14.2" height="159.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="174.5" y="61.1" width="14.2" height="11.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="190.7" y="220.5" width="14.2" height="29.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="190.7" y="180.8" width="14.2" height="39.7" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="190.7" y="175.8" width="14.2" height="5.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="206.9" y="195.5" width="14.2" height="54.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="206.9" y="167.0" width="14.2" height="28.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="206.9" y="156.3" width="14.2" height="10.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="223.2" y="176.5" width="14.2" height="73.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="223.2" y="159.6" width="14.2" height="16.9" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="223.2" y="157.0" width="14.2" height="2.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="239.4" y="135.3" width="14.2" height="114.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="239.4" y="120.8" width="14.2" height="14.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="239.4" y="117.0" width="14.2" height="3.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="255.6" y="100.1" width="14.2" height="149.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="255.6" y="64.8" width="14.2" height="35.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="255.6" y="54.5" width="14.2" height="10.3" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="271.8" y="71.8" width="14.2" height="178.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="271.8" y="57.6" width="14.2" height="14.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="271.8" y="50.0" width="14.2" height="7.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="288.0" y="90.8" width="14.2" height="159.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="288.0" y="83.3" width="14.2" height="7.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="288.0" y="78.0" width="14.2" height="5.2" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="304.2" y="154.8" width="14.2" height="95.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="304.2" y="143.5" width="14.2" height="11.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="304.2" y="138.7" width="14.2" height="4.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="320.5" y="177.1" width="14.2" height="72.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="320.5" y="150.9" width="14.2" height="26.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="320.5" y="130.3" width="14.2" height="20.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="336.7" y="204.1" width="14.2" height="45.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="336.7" y="200.6" width="14.2" height="3.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="336.7" y="197.9" width="14.2" height="2.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="352.9" y="212.8" width="14.2" height="37.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="352.9" y="204.2" width="14.2" height="8.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="352.9" y="200.7" width="14.2" height="3.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="369.1" y="220.8" width="14.2" height="29.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="369.1" y="216.2" width="14.2" height="4.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="369.1" y="214.5" width="14.2" height="1.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="385.3" y="229.4" width="14.2" height="20.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="385.3" y="225.6" width="14.2" height="3.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="385.3" y="223.4" width="14.2" height="2.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="401.5" y="236.4" width="14.2" height="13.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="401.5" y="227.8" width="14.2" height="8.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="401.5" y="227.1" width="14.2" height="0.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="417.8" y="221.0" width="14.2" height="29.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="417.8" y="220.4" width="14.2" height="0.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="417.8" y="220.2" width="14.2" height="0.2" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="434.0" y="241.2" width="14.2" height="8.8" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="434.0" y="239.4" width="14.2" height="1.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="434.0" y="237.7" width="14.2" height="1.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="450.2" y="237.1" width="14.2" height="12.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="450.2" y="233.7" width="14.2" height="3.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="450.2" y="232.2" width="14.2" height="1.4" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="466.4" y="236.4" width="14.2" height="13.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="466.4" y="202.2" width="14.2" height="34.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="466.4" y="199.1" width="14.2" height="3.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="482.6" y="229.6" width="14.2" height="20.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="482.6" y="197.4" width="14.2" height="32.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="482.6" y="195.4" width="14.2" height="2.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="498.8" y="230.9" width="14.2" height="19.1" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="498.8" y="225.0" width="14.2" height="6.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="498.8" y="222.8" width="14.2" height="2.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="515.1" y="233.9" width="14.2" height="16.1" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="515.1" y="232.0" width="14.2" height="1.9" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="515.1" y="227.5" width="14.2" height="4.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="531.3" y="240.5" width="14.2" height="9.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="531.3" y="239.4" width="14.2" height="1.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="531.3" y="239.3" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="547.5" y="244.5" width="14.2" height="5.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="547.5" y="243.2" width="14.2" height="1.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="547.5" y="243.1" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="563.7" y="249.3" width="14.2" height="0.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="563.7" y="248.7" width="14.2" height="0.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="563.7" y="248.6" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="579.9" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="579.9" y="249.5" width="14.2" height="0.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="579.9" y="249.5" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="596.1" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="596.1" y="249.6" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="596.1" y="249.6" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="612.4" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="612.4" y="249.6" width="14.2" height="0.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="612.4" y="249.6" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="628.6" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="628.6" y="249.9" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="628.6" y="249.9" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="644.8" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="644.8" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="644.8" y="249.8" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <line x1="60" y1="250" x2="660" y2="250" class="f-line"/>
  <line x1="76.2" y1="250" x2="76.2" y2="254" class="f-line"/>
  <text x="76.2" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">200</text>
  <line x1="173.5" y1="250" x2="173.5" y2="254" class="f-line"/>
  <text x="173.5" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">500</text>
  <line x1="270.8" y1="250" x2="270.8" y2="254" class="f-line"/>
  <text x="270.8" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">800</text>
  <line x1="368.1" y1="250" x2="368.1" y2="254" class="f-line"/>
  <text x="368.1" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1100</text>
  <line x1="465.4" y1="250" x2="465.4" y2="254" class="f-line"/>
  <text x="465.4" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1400</text>
  <line x1="562.7" y1="250" x2="562.7" y2="254" class="f-line"/>
  <text x="562.7" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1700</text>
  <line x1="660.0" y1="250" x2="660.0" y2="254" class="f-line"/>
  <text x="660.0" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">2000</text>
  <text x="660" y="284" text-anchor="end" class="f-muted" style="font-size:11px">km, mean of apogee and perigee</text>
  <text x="54" y="194.4" text-anchor="end" class="f-muted f-mono" style="font-size:10px">500</text>
  <line x1="60" y1="190.4" x2="660" y2="190.4" class="f-line" style="opacity:.2"/>
  <text x="54" y="134.7" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1000</text>
  <line x1="60" y1="130.7" x2="660" y2="130.7" class="f-line" style="opacity:.2"/>
  <text x="54" y="75.1" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1500</text>
  <line x1="60" y1="71.1" x2="660" y2="71.1" class="f-line" style="opacity:.2"/>
  <text x="295.02702702702703" y="60" text-anchor="start" class="f-accent" style="font-size:12px">800–850 km: 1494 fragments</text>
</svg>
<figcaption>Objects in Earth orbit with apogee below 2000 km, CelesTrak SATCAT copy of 11 March 2021. Altitude is the mean of apogee and perigee.</figcaption>
</figure>

Every fragment in the catalog carries the designator of the launch it came from, so the sources of the debris can be counted. 857 different launches left debris that is still up, but a few of them dominate. Fengyun 1C was a Chinese weather satellite destroyed by a missile test in January 2007. It has 2875 fragments in orbit out of 3530 ever catalogued, so after 14 years 81% of the cloud is still there. Cosmos 2251 and Iridium 33, which collided in February 2009, add 1094 and 347. Together it is 4316 pieces, 33% of all debris in orbit.

<figure class="fig">
<svg viewBox="0 0 680 218" role="img" aria-label="Debris by source event, catalogued and still in orbit: Fengyun 1C, 2007: 3530, 2875; Cosmos 2251, 2009: 1714, 1094; NOAA 16, 2015: 458, 456; Cosmos 1275, 1981: 478, 418; Iridium 33, 2009: 656, 347.">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">catalogued fragments, ever</text>
  <rect x="320.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="338" y="22" text-anchor="start" class="f-muted" style="font-size:11px">still in orbit</text>
  <text x="160" y="56" text-anchor="end" class="f-ink" style="font-size:11px">Fengyun 1C, 2007</text>
  <rect x="170.0" y="44.0" width="400.0" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="54.0" width="325.8" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="578" y="53" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3530</text>
  <text x="503.77903682719545" y="64" text-anchor="start" class="f-mono f-accent" style="font-size:11px">2875, 81%</text>
  <text x="160" y="90" text-anchor="end" class="f-ink" style="font-size:11px">Cosmos 2251, 2009</text>
  <rect x="170.0" y="78.0" width="194.2" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="88.0" width="124.0" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="372.22096317280455" y="87" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1714</text>
  <text x="301.9660056657224" y="98" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1094, 64%</text>
  <text x="160" y="124" text-anchor="end" class="f-ink" style="font-size:11px">NOAA 16, 2015</text>
  <rect x="170.0" y="112.0" width="51.9" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="122.0" width="51.7" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="229.89801699716713" y="121" text-anchor="start" class="f-mono f-muted" style="font-size:11px">458</text>
  <text x="229.671388101983" y="132" text-anchor="start" class="f-mono f-accent" style="font-size:11px">456, 100%</text>
  <text x="160" y="158" text-anchor="end" class="f-ink" style="font-size:11px">Cosmos 1275, 1981</text>
  <rect x="170.0" y="146.0" width="54.2" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="156.0" width="47.4" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="232.1643059490085" y="155" text-anchor="start" class="f-mono f-muted" style="font-size:11px">478</text>
  <text x="225.3654390934844" y="166" text-anchor="start" class="f-mono f-accent" style="font-size:11px">418, 87%</text>
  <text x="160" y="192" text-anchor="end" class="f-ink" style="font-size:11px">Iridium 33, 2009</text>
  <rect x="170.0" y="180.0" width="74.3" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="190.0" width="39.3" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="252.33427762039662" y="189" text-anchor="start" class="f-mono f-muted" style="font-size:11px">656</text>
  <text x="217.32011331444758" y="200" text-anchor="start" class="f-mono f-accent" style="font-size:11px">347, 53%</text>
</svg>
<figcaption>The 5 events with most fragments still in orbit, by international designator. The year is the year of the breakup. Fengyun 1C and the collision of Cosmos 2251 with Iridium 33 give 4316 of 13138 debris objects in orbit.</figcaption>
</figure>

## What is above the horizon

The catalog has no positions, only the shape of each orbit. For an average count this is enough. I take each orbit as it is in the file and turn it to a random orientation at a random moment. The share of samples where the object is above the horizon of a point at 52° is the probability to find it there. The sum of these probabilities over the catalog is the expected number above the horizon. I did it in Python with numpy, 4000 samples per object.

Before trusting it I wanted to check it on real positions. CelesTrak also publishes `active.txt` with fresh orbital elements for working satellites. The Wayback Machine has a copy from this morning, 11 April, 9:06 UTC, with 4010 satellites. I propagated them with SGP4 (the `sgp4` package for Python) through the whole day for a point at 52° N, 21° E. The average was 500 above the horizon. My method for the same 4010 orbits gave 458.

I spent some time looking for a bug in the geometry, there was none. The difference was the longitude. The same check for 12 points along the 52nd parallel gives from 406 to 534. Averaged over all 12 it is 462. Almost all of the spread is the geostationary belt: from 60° E a point sees 297 geostationary satellites on average, from 120° W only 168. So the method gives a good average for the latitude, but a concrete place can differ from it by up to 17%.

Then the whole catalog of 11 March. At 52° north, at an average moment, 3022 catalogued objects are above the horizon.

<figure class="fig">
<svg viewBox="0 0 680 198" role="img" aria-label="Share of orbit types. In orbit: low, apogee below 2000 km 16209 (74%), high elliptical 2707 (12%), medium and other high 1673 (8%), geostationary 1217 (6%). Above the horizon at 52 degrees north: low, apogee below 2000 km 1174 (39%), high elliptical 704 (23%), medium and other high 634 (21%), geostationary 510 (17%).">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="21" text-anchor="start" class="f-muted" style="font-size:11px">low, apogee below 2000 km</text>
  <rect x="340.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="358" y="21" text-anchor="start" class="f-muted" style="font-size:11px">high elliptical</text>
  <rect x="20.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="39" text-anchor="start" class="f-muted" style="font-size:11px">medium and other high</text>
  <rect x="340.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="358" y="39" text-anchor="start" class="f-muted" style="font-size:11px">geostationary</text>
  <text x="20" y="70" text-anchor="start" class="f-ink" style="font-size:12px">in orbit, 21806 objects</text>
  <rect x="20.0" y="78.0" width="474.7" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="257.9" y="97" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">74%</text>
  <rect x="495.7" y="78.0" width="78.4" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="535.5" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">12%</text>
  <rect x="575.2" y="78.0" width="48.1" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="599.7" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">8%</text>
  <rect x="624.3" y="78.0" width="34.7" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="20" y="146" text-anchor="start" class="f-ink" style="font-size:12px">above the horizon at 52° N, 3022 on average</text>
  <rect x="20.0" y="154.0" width="247.6" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="144.3" y="173" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">39%</text>
  <rect x="268.6" y="154.0" width="148.1" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="343.2" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">23%</text>
  <rect x="417.7" y="154.0" width="133.3" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="484.9" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">21%</text>
  <rect x="552.0" y="154.0" width="107.0" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="606.0" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">17%</text>
</svg>
<figcaption>Above the horizon is the expected count at an average moment and longitude: each orbit from the catalog turned to random orientations, 4000 samples per object. A check with SGP4 on 4010 working satellites gave 462 against 458 from this method.</figcaption>
</figure>

I thought the sky above me is mostly low orbits, because that is what the argument is about. In the catalog low orbits are 74%. Above the horizon they are 1174 of 3022, it is 39%. An object at 550 km is visible from a circle about 2560 km in radius. It is above my horizon only a few minutes per pass. A geostationary satellite at 35786 km is visible from 42% of the Earth surface and does not move in my sky. So 510 objects from the geostationary belt and 1338 from other high orbits take more of my sky than 16209 low ones.

Starlink shows the same effect. On 11 March there were 1079 Starlink satellites in the catalog, 28% of all working ones. Above the horizon at an average moment there are 51 of them, out of 463 working satellites above the horizon in total. That is 11%.

And half of what is above the horizon is debris, 1492 objects. Working satellites are 15%. Above 30° of elevation, where something is really overhead and not near the tree line, there are 640 objects and 80 of them work.

I also did not expect the count to grow with latitude. On the equator the method gives 2656, at 70° north 3258. I split it by orbit type. Low orbits go from 668 above the horizon on the equator to 1665 at 70°. The geostationary belt goes from 550 to 413, because from the north it sits low in the south. My guess for the low orbits is that inclined ones spend more time near their highest latitude, where the ground track turns. I did not check it by inclination.

## What I did not check

The catalog has only what can be tracked and identified, in low orbit roughly 10 cm and bigger. Everything smaller is not in these numbers at all. The 323 objects without an orbit are not in the sky count either.

My method ignores that some orbits have a fixed orientation. Molniya type satellites keep the apogee above the northern hemisphere, so for them it underestimates. On the 22 high elliptical satellites from `active.txt` SGP4 gives 10.8 above the horizon and the method 7.5. Most of the gap is 8 Russian satellites on Molniya type orbits. For the 2707 high elliptical objects in the whole catalog I did not check it.

Orbits are from the copy of 11 March. In the month after it there were new launches. `active.txt` from today already lists 1313 Starlink satellites. CelesTrak's summary from 10 April counts 22712 objects that have not decayed. The same count on my copy gives 22377. The proportions should not change much from one month, but I did not recount them.

I also counted objects, not what can be seen with the eye. That needs the Sun angle and the size of each object.

So next time the argument comes back I will have a number for it. About 3000 catalogued objects are above the horizon at 52° north, half of them debris. I will recount it on the next copy of the catalog in a few months.
