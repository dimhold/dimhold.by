---
title: "The median home page went from 540 KB to 3009 KB. The crawler that weighs it does not scroll"
description: "15 years of HTTP Archive page weight as a GIF: where the method changed, why the image line went flat and what my own crawler found below the fold."
date: 2026-10-08
lang: en
translationKey: web-weight
tags: ["performance", "open-data", "statistics"]
---
Every argument about bundle size I have been in ends with somebody posting the HTTP Archive chart of page weight. The line goes up and the argument is over. I have posted it myself more than once. In my head the growth was images, bigger photos for bigger screens. JavaScript was a thing we complained about on the side.

I never read how that line is made. This time I wanted a GIF of 15 years of it, so I had to.

## How I counted

HTTP Archive publishes the series as JSON on `cdn.httparchive.org/reports/`. On 8 October 2026 the last crawl there was from 1 September. Before using any number I read the SQL that builds these files in their `dataform` repository. Only home pages are counted and 1 KB is 1024 bytes. The median for images or JavaScript is taken only over pages that have that type, so the parts do not add up to the whole page.

I took the desktop series and the July crawl of every year. The counting is Python 3.12 and the GIF is matplotlib 3.11. Gifsicle 1.94 squeezes it.

<figure class="fig">
<img src="/media/web-weight/weight-en.gif" width="720" height="480" alt="Animated chart, one frame per quarter from November 2010 to September 2026. Three squares show the median desktop home page in HTTP Archive, its images and its JavaScript, each with a dashed outline of the July 2011 value. The whole page grows from about 470 KB to 2994 KB, images to 1040 KB and JavaScript to 773 KB. Below, a line of the median page climbs with two dashed marks in 2018 where the URL list changed." aria-label="Animated chart, one frame per quarter from November 2010 to September 2026. Three squares show the median desktop home page in HTTP Archive, its images and its JavaScript, each with a dashed outline of the July 2011 value. The whole page grows from about 470 KB to 2994 KB, images to 1040 KB and JavaScript to 773 KB. Below, a line of the median page climbs with two dashed marks in 2018 where the URL list changed." loading="lazy" style="display:block;width:100%;max-width:720px;height:auto;margin:0 auto;border-radius:8px">
<figcaption>Square area is the median in KB, where HTTP Archive counts 1 KB as 1024 bytes. Images and JavaScript are medians over pages that have them, so the 3 squares do not add up to the first one.</figcaption>
</figure>

## What grew

In July 2011 the median desktop home page was 540 KB, in July 2026 it is 3009 KB, 5.6 times more. Images went from 269 to 1062 KB and JavaScript from 109 to 767 KB, 7 times. Requests barely moved, from 64 to 76, so the files got bigger.

My picture was half right. Images are still the largest part, but their line in the GIF stops. From July 2019 to July 2026 the median image weight went from 987 to 1062 KB, 8 percent in 7 years, while JavaScript almost doubled.

## The summer the web got lighter

The first thing I noticed in the frames was a drop. On 15 June 2018 the median page was 1709 KB and on 1 July it was 1503 KB, images fell from 864 to 650 KB. I spent a while looking for what happened on the web that month and found nothing.

HTTP Archive keeps a changelog. On 1 July 2018 the crawl switched to 1.3 million URLs from the Chrome UX Report. The URL count in the data goes from 461 thousand to 1.28 million. On 15 December 2018 the list was synced with the whole report, 3.84 million pages. The median went up 17 percent in 1 crawl, images 41 percent.

<figure class="fig">
<svg viewBox="0 0 640 322" role="img" aria-label="Two lines for the median desktop home page in HTTP Archive from January 2016 to June 2019, one point per crawl. May 2017: 1562 to 1355 KB, images 841 to 794; August 2017: 1421 to 1639 KB, images 824 to 869; July 2018: 1709 to 1503 KB, images 864 to 650; December 2018: 1585 to 1848 KB, images 658 to 930. Between those steps a crawl usually differs from the previous one by less than 1 percent.">
  <text x="10" y="16" class="f-label f-muted">median desktop home page in KB, 2016 to 2019, every crawl</text>
  <line x1="84" y1="254.75" x2="600" y2="254.75" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="76" y="258.75" text-anchor="end" class="f-label f-muted">500</text>
  <line x1="84" y1="198.5" x2="600" y2="198.5" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="76" y="202.5" text-anchor="end" class="f-label f-muted">1000</text>
  <line x1="84" y1="142.25" x2="600" y2="142.25" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="76" y="146.25" text-anchor="end" class="f-label f-muted">1500</text>
  <line x1="84" y1="86" x2="600" y2="86" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="76" y="90" text-anchor="end" class="f-label f-muted">2000</text>
  <path d="M84.0,148.0 L89.8,148.8 L96.6,147.5 L102.4,146.1 L109.2,144.8 L115.0,144.3 L121.8,144.6 L127.5,145.7 L134.3,144.5 L140.1,145.7 L146.9,146.3 L152.7,147.8 L159.5,146.0 L165.3,144.7 L172.1,143.0 L177.9,143.0 L184.7,142.8 L190.5,143.3 L197.3,139.5 L203.1,140.5 L209.9,141.6 L215.6,141.2 L228.2,142.0 L247.6,144.5 L253.4,143.9 L260.2,138.6 L266.0,135.6 L272.8,135.5 L278.6,135.3 L285.4,158.6 L291.2,156.2 L298.0,155.5 L303.7,154.4 L310.5,152.1 L316.3,151.2 L323.1,126.6 L328.9,125.1 L335.7,124.8 L341.5,124.1 L348.3,123.6 L354.1,124.8 L360.9,122.4 L366.7,121.8 L373.5,120.3 L379.3,109.1 L386.0,111.6 L391.8,111.2 L398.6,110.1 L404.4,119.9 L411.2,119.9 L417.0,118.3 L429.6,116.3 L436.4,115.6 L442.2,117.5 L449.0,119.5 L454.8,118.7 L461.6,142.0 L467.4,140.8 L474.1,141.0 L479.9,140.3 L486.7,139.4 L492.5,137.2 L499.3,137.7 L505.1,138.5 L511.9,132.3 L517.7,127.9 L524.5,132.7 L530.3,103.1 L537.1,104.4 L549.7,101.5 L562.2,105.3 L587.4,97.6 L600.0,96.6" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <path d="M84.0,228.2 L89.8,228.7 L96.6,228.2 L102.4,227.9 L109.2,227.0 L115.0,226.4 L121.8,226.3 L127.5,226.6 L134.3,225.4 L140.1,221.9 L146.9,220.8 L152.7,221.3 L159.5,219.8 L165.3,219.0 L172.1,218.3 L177.9,217.8 L184.7,217.6 L190.5,217.3 L197.3,215.1 L203.1,215.5 L209.9,217.3 L215.6,217.6 L228.2,215.1 L247.6,217.6 L253.4,217.8 L260.2,217.2 L266.0,216.8 L272.8,216.9 L278.6,216.4 L285.4,221.7 L291.2,221.5 L298.0,220.8 L303.7,220.2 L310.5,218.7 L316.3,218.3 L323.1,213.3 L328.9,212.6 L335.7,212.6 L341.5,212.5 L348.3,212.6 L354.1,213.6 L360.9,212.5 L366.7,212.3 L373.5,211.8 L379.3,209.7 L386.0,211.6 L391.8,212.1 L398.6,211.9 L404.4,213.2 L411.2,213.5 L417.0,213.4 L429.6,214.1 L436.4,214.2 L442.2,214.2 L449.0,213.8 L454.8,213.8 L461.6,237.9 L467.4,237.6 L474.1,237.9 L479.9,237.5 L486.7,237.7 L492.5,237.1 L499.3,237.3 L505.1,237.5 L511.9,237.4 L517.7,237.1 L524.5,237.0 L530.3,206.3 L537.1,207.9 L549.7,206.3 L562.2,209.8 L587.4,201.7 L600.0,201.7" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <line x1="285.4" y1="64" x2="285.4" y2="266" style="stroke:var(--accent);stroke-width:1" stroke-dasharray="2 3" opacity="0.7"/>
  <text x="285.4" y="290" text-anchor="middle" class="f-label f-accent">May 2017: −13%</text>
  <text x="285.4" y="306" text-anchor="middle" class="f-label f-muted">Linux agents</text>
  <line x1="323.1" y1="64" x2="323.1" y2="266" style="stroke:var(--accent);stroke-width:1" stroke-dasharray="2 3" opacity="0.7"/>
  <text x="323.1" y="42" text-anchor="middle" class="f-label f-accent">Aug 2017: +15%</text>
  <text x="323.1" y="58" text-anchor="middle" class="f-label f-muted">no entry</text>
  <line x1="461.6" y1="64" x2="461.6" y2="266" style="stroke:var(--accent);stroke-width:1" stroke-dasharray="2 3" opacity="0.7"/>
  <text x="461.6" y="290" text-anchor="middle" class="f-label f-accent">Jul 2018: −12%</text>
  <text x="461.6" y="306" text-anchor="middle" class="f-label f-muted">1.3 M CrUX URLs</text>
  <line x1="530.3" y1="64" x2="530.3" y2="266" style="stroke:var(--accent);stroke-width:1" stroke-dasharray="2 3" opacity="0.7"/>
  <text x="530.3" y="42" text-anchor="middle" class="f-label f-accent">Dec 2018: +17%</text>
  <text x="530.3" y="58" text-anchor="middle" class="f-label f-muted">whole CrUX</text>
  <line x1="94" y1="92" x2="118" y2="92" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="124" y="96" class="f-label f-ink">whole page</text>
  <line x1="94" y1="108" x2="118" y2="108" class="f-ink" style="stroke:currentColor;stroke-width:2"/>
  <text x="124" y="112" class="f-label f-ink">images</text>
</svg>
<figcaption>Each step is a change of the crawler or of the URL list, from the HTTP Archive changelog. The step of August 2017 has no entry there.</figcaption>
</figure>

Over all 281 desktop crawls the median change between 2 neighbouring crawls is 0.89 percent. These steps are 14 to 19 times that. There are 2 more of the same size in 2017. On 1 May the test agents moved to Linux and the median fell 13 percent. On 1 August it went up 15 percent with no changelog entry. HTML alone went from 29 to 14 KB in May and back to 28 KB in August. I think this is the measurement, pages do not lose half of their HTML for 3 months. Steve Souders wrote about method changes bending this series back in 2013, I only found the newer ones.

The list kept growing up to 13.2 million home pages in March 2025, the September crawl has 11.4 million. Rank slices exist since May 2021, so I checked if recent growth is just a different crowd. The 1000 most visited sites went from 1704 to 2843 KB in these 5 years, faster than the whole list.

## Where the images went

In July 2017 the median home page made 41 image requests, in July 2026 it makes 19. Over the same years the share of pages with `loading="lazy"` on an image went from 0 to 42.5 percent.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Three lines indexed to July 2019 = 100 for the median desktop home page in HTTP Archive: JavaScript KB from 406 to 767, 189; image KB from 987 to 1062, 108; image requests from 31 to 19, 61. Under the lines, the share of pages that use loading=lazy grows from 0 percent in 2019 to 42.5 percent in 2026.">
  <text x="10" y="16" class="f-label f-muted">desktop home pages since 2019, July of each year, 2019 = 100</text>
  <line x1="60" y1="218.125" x2="456" y2="218.125" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="52" y="222.125" text-anchor="end" class="f-label f-muted">50</text>
  <line x1="60" y1="158.75" x2="456" y2="158.75" class="f-line" stroke-dasharray="2 4" opacity="1"/>
  <text x="52" y="162.75" text-anchor="end" class="f-label f-muted">100</text>
  <line x1="60" y1="99.375" x2="456" y2="99.375" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="52" y="103.375" text-anchor="end" class="f-label f-muted">150</text>
  <line x1="60" y1="40" x2="456" y2="40" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="52" y="44" text-anchor="end" class="f-label f-muted">200</text>
  <path d="M60.0,158.8 L116.6,145.0 L173.1,138.2 L229.7,127.6 L286.3,108.7 L342.9,88.0 L399.4,64.3 L456.0,53.1" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="464" y="57.1" class="f-label f-accent">189</text>
  <text x="464" y="70.1" class="f-label f-muted">JavaScript KB</text>
  <path d="M60.0,158.8 L116.6,159.3 L173.1,159.2 L229.7,152.5 L286.3,156.0 L342.9,149.1 L399.4,149.3 L456.0,149.8" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2.5"/>
  <text x="464" y="153.8" class="f-label f-ink">108</text>
  <text x="464" y="166.8" class="f-label f-muted">image KB</text>
  <path d="M60.0,158.8 L116.6,166.4 L173.1,181.7 L229.7,181.7 L286.3,197.1 L342.9,197.1 L399.4,200.9 L456.0,204.7" class="f-muted" style="fill:none;stroke:currentColor;stroke-width:2.5"/>
  <text x="464" y="208.7" class="f-label f-muted">61</text>
  <text x="464" y="221.7" class="f-label f-muted">image requests</text>
  <text x="60" y="258" class="f-label f-muted">pages with loading=lazy, %</text>
  <text x="60.0" y="276" text-anchor="middle" class="f-label f-ink">0</text>
  <text x="60.0" y="292" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="116.6" y="276" text-anchor="middle" class="f-label f-ink">1.6</text>
  <text x="116.6" y="292" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="173.1" y="276" text-anchor="middle" class="f-label f-ink">17.9</text>
  <text x="173.1" y="292" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="229.7" y="276" text-anchor="middle" class="f-label f-ink">24</text>
  <text x="229.7" y="292" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="286.3" y="276" text-anchor="middle" class="f-label f-ink">27.3</text>
  <text x="286.3" y="292" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="342.9" y="276" text-anchor="middle" class="f-label f-ink">33.2</text>
  <text x="342.9" y="292" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="399.4" y="276" text-anchor="middle" class="f-label f-ink">37.8</text>
  <text x="399.4" y="292" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="456.0" y="276" text-anchor="middle" class="f-label f-ink">42.5</text>
  <text x="456.0" y="292" text-anchor="middle" class="f-label f-muted">2026</text>
</svg>
<figcaption>Medians of HTTP Archive, July crawl of each year. The share with loading=lazy is the imgLazy metric of HTTP Archive.</figcaption>
</figure>

Lazy images load when they come close to the viewport, so I checked the viewport. The crawl configuration in `HTTPArchive/crawl` opens desktop pages in a 1920 by 1080 window and mobile pages at 360 by 512. I found no scroll step there or in their fork of wptagent. Pat Meenan, the author of WebPageTest, answered the same question on the HTTP Archive forum in April 2021. Lazy images outside the viewport are not loaded, so they are not measured. He called that accurate for the initial load. In the same thread he wrote that the desktop window was 1024 by 768 until that month, so in 2019 even less of the page was in view.

Accurate for the initial load is fair, but it is not the weight I had in mind when I posted the chart. The Web Almanac of 2021 guessed that lazy loading is why pages make fewer image requests, without a measurement. I did not find anyone who counted the bytes below the fold.

## My run

My crawler is Playwright 1.64 on Node 22 with Chromium 156. For every site it opens a fresh context with the cache off and a 1920 by 1080 window. It loads the home page and waits for 2 seconds of network silence, 30 seconds at most. This is what a crawler that does not scroll would see. Then it stands still for 10 seconds as a control. Then it scrolls to the bottom by 80 percent of the window every 400 ms and waits again. Bytes are transfer sizes.

The sites are 300 random domains from the Tranco top million (seed 699). 185 loaded and 167 weighed at least 100 KB, which cuts parked domains. 45 percent of them have a lazy image, close to the 44.6 percent HTTP Archive reports for September.

Before the run I wrote down what would prove me wrong. The median page gains less than 3 percent from scrolling, the median page with lazy images less than 5 percent. Both happened, 0.1 and 4.1 percent. 43 percent of pages did not load a single byte more. Standing still added 1.5 percent of all bytes. Scrolling added 12.6.

But the chart shows the median page, not the median gain. The median of my whole sample after scrolling moved from 2943 to 3568 KB, 21 percent up. Images moved from 1187 to 1647 KB. I looked for a bug in my script for a while. Pages with lazy images are heavier, 3901 KB at the median against 2352 KB without. 8 of the 83 pages below the median ended above it after scrolling. I chose this second measure after the run, so I trust it less. With 167 pages the 95 percent bootstrap interval is wide: 7 to 40 percent for the page, 12 to 77 percent for images.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Bar chart from my own run of Chromium 156 through Playwright on home pages of a random Tranco sample: whole page, desktop, n = 167: 2943 → 3568 KB, +21% (7–40%); images, desktop, n = 167: 1187 → 1647 KB, +39% (12–77%); whole page, mobile, n = 120: 2915 → 3806 KB, +31% (5–62%); images, mobile, n = 120: 1154 → 1588 KB, +38% (11–84%)">
  <text x="10" y="16" class="f-label f-muted">median home page before and after scrolling to the bottom, my run</text>
  <rect x="200" y="26" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="220" y="35" class="f-label f-muted">before scrolling</text>
  <rect x="370" y="26" width="14" height="10" style="fill:var(--accent)"/><text x="390" y="35" class="f-label f-muted">added by scrolling</text>
  <text x="190" y="62" text-anchor="end" class="f-label f-ink">whole page</text>
  <text x="190" y="76" text-anchor="end" class="f-label f-muted">desktop, n = 167</text>
  <rect x="200" y="48" width="309.3" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="509.3" y="48" width="65.7" height="18" style="fill:var(--accent)"/>
  <text x="200" y="81" class="f-label f-muted">2943 → 3568 KB, +21% (7–40%)</text>
  <text x="190" y="112" text-anchor="end" class="f-label f-ink">images</text>
  <text x="190" y="126" text-anchor="end" class="f-label f-muted">desktop, n = 167</text>
  <rect x="200" y="98" width="124.8" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="324.8" y="98" width="48.3" height="18" style="fill:var(--accent)"/>
  <text x="200" y="131" class="f-label f-muted">1187 → 1647 KB, +39% (12–77%)</text>
  <text x="190" y="162" text-anchor="end" class="f-label f-ink">whole page</text>
  <text x="190" y="176" text-anchor="end" class="f-label f-muted">mobile, n = 120</text>
  <rect x="200" y="148" width="306.4" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="506.4" y="148" width="93.6" height="18" style="fill:var(--accent)"/>
  <text x="200" y="181" class="f-label f-muted">2915 → 3806 KB, +31% (5–62%)</text>
  <text x="190" y="212" text-anchor="end" class="f-label f-ink">images</text>
  <text x="190" y="226" text-anchor="end" class="f-label f-muted">mobile, n = 120</text>
  <rect x="200" y="198" width="121.3" height="18" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="321.3" y="198" width="45.6" height="18" style="fill:var(--accent)"/>
  <text x="200" y="231" class="f-label f-muted">1154 → 1588 KB, +38% (11–84%)</text>
</svg>
<figcaption>Medians over pages that loaded and weighed at least 100 KB before scrolling. Desktop is a 1920×1080 window, mobile 360×512 at device pixel ratio 3. In brackets a 95 percent bootstrap interval for the growth of the median.</figcaption>
</figure>

Then I ran the first 200 of the same domains as a phone, 360 by 512 at device pixel ratio 3. 120 pages counted. The median page with lazy images gained 11.7 percent, above my threshold. A third of all pages gained 10 percent or more. The median of the sample moved from 2915 to 3806 KB, 31 percent up, with an interval from 5 to 62 percent. The Web Almanac of 2022 guessed that phones show fewer images than desktops because lazy loading does not fire on a small first screen. My phone run fits that guess.

Most of the bytes that came during scrolling were images, 75 percent on desktop and 71 on the phone. Whether this explains the flat image line I can not say. My run is one day in 2026 and in 2019 lazy loading was done mostly by JavaScript, which I can not replay now.

## What I did not check

- My sample is Tranco domains, not the CrUX list HTTP Archive uses. One run per page from one server.
- About a third of the desktop pages never went quiet before scrolling, so some of their scroll bytes may be background traffic. In total the scrolling brought more than 8 times the bytes of the control phase, but per page I can not separate them.
- HTTP Archive also reports a Lighthouse estimate of offscreen image bytes. I did not compare my numbers with it.
