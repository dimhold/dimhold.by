---
title: "New Ebola cases in Kivu tripled and views of the Wikipedia article went down"
description: "I put daily views of 4 English Wikipedia articles from 2015 to September 2019 next to the case numbers. Flu views follow ILI with a correlation of 0.805. In Kivu monthly Ebola cases tripled from October to April while views went down. Then they doubled after a WHO declaration with the same number of cases. The record days of Measles and Influenza turned out to be one platform and one day."
date: 2019-09-21
lang: en
translationKey: wikipedia-panic-views
tags: ["open-data", "statistics"]
---
On July 18 the English Wikipedia article "Ebola virus disease" was opened 23,455 times. The day before, WHO had declared the outbreak in North Kivu a public health emergency of international concern. The first case in Goma had been confirmed on July 14. In the 4 weeks before it a normal day of the article was about 2,000.

I have looked at charts like this many times and read them the simple way. Many people opened the article, so many people were worried, so something got worse. Wikipedia views are free, daily and go back to 2015, which makes them an attractive barometer of what people are afraid of. I never put such a chart next to the case numbers. This time I did.

The idea is not new. McIver and Brownstein showed in 2014 that views of flu articles follow ILI almost in real time. ILI is the share of US doctor visits for flu symptoms. Towers and colleagues found in 2015 that searches and tweets about Ebola in America in 2014 followed news coverage. I wanted to see it with my own hands on the Kivu outbreak, which is now in its second year.

## What I took

I took daily views of 4 English Wikipedia articles from the Wikimedia pageviews API, agent type `user`: Influenza, Measles, Ebola virus disease and Zika virus. The series run from July 2015 to September 20, 2019. For flu the ground truth is ILINet, which CDC publishes every week. Each season is taken as CDC published it by the following September, the last one from the release of week 37 of this year. For Ebola I used the daily reports of the DRC health ministry for North Kivu and Ituri, by report date up to September 20.

The script is 170 lines of pandas. Everything is cut one day before this post.

## The biggest day was not about measles

First I looked for spikes, days with more than 4 times the median of the previous 28 days. There are 47 such days across the 4 articles. The largest one belongs to Measles: November 9, 2015, with 82,441 views, almost 20 times a normal day. I was ready to search for measles news from that week, but splitting the views by platform answered faster. 98.9% of the extra views came from desktop, mobile barely moved and the next day was back to normal. Scared people read on phones too, so my guess is a script that the `user` filter did not catch. A single link placed somewhere on desktop would look the same.

<figure class="fig">
<svg viewBox="0 0 680 292" role="img" aria-label="Daily views of the English Wikipedia article Measles from November 5 to 13, 2015, split into desktop and mobile. 5: 1,960 + 2,519; 6: 1,653 + 2,148; 7: 1,246 + 2,003; 8: 1,346 + 2,108; 9: 79,314 + 3,127; 10: 1,845 + 2,114; 11: 1,763 + 2,166; 12: 1,771 + 2,030; 13: 1,477 + 1,964. On November 9 desktop jumps to 79,314 while mobile stays near 2,000 to 3,000.">
  <line x1="80" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="72.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="80" y1="173.9" x2="660" y2="173.9" class="f-plain"/>
  <text x="72.0" y="177.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20,000</text>
  <line x1="80" y1="127.8" x2="660" y2="127.8" class="f-plain"/>
  <text x="72.0" y="131.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40,000</text>
  <line x1="80" y1="81.6" x2="660" y2="81.6" class="f-plain"/>
  <text x="72.0" y="85.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60,000</text>
  <line x1="80" y1="35.5" x2="660" y2="35.5" class="f-plain"/>
  <text x="72.0" y="39.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80,000</text>
  <rect x="88.0" y="214.2" width="48.4" height="5.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="88.0" y="209.7" width="48.4" height="4.5" style="fill:var(--accent);stroke:none"/>
  <text x="112.2" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="152.4" y="215.0" width="48.4" height="5.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="152.4" y="211.2" width="48.4" height="3.8" style="fill:var(--accent);stroke:none"/>
  <text x="176.7" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="216.9" y="215.4" width="48.4" height="4.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="216.9" y="212.5" width="48.4" height="2.9" style="fill:var(--accent);stroke:none"/>
  <text x="241.1" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <rect x="281.3" y="215.1" width="48.4" height="4.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="281.3" y="212.0" width="48.4" height="3.1" style="fill:var(--accent);stroke:none"/>
  <text x="305.6" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="345.8" y="212.8" width="48.4" height="7.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="345.8" y="29.9" width="48.4" height="182.9" style="fill:var(--accent);stroke:none"/>
  <text x="370.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="370.0" y="23.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">82,441</text>
  <rect x="410.2" y="215.1" width="48.4" height="4.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="410.2" y="210.9" width="48.4" height="4.3" style="fill:var(--accent);stroke:none"/>
  <text x="434.4" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="474.7" y="215.0" width="48.4" height="5.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="474.7" y="210.9" width="48.4" height="4.1" style="fill:var(--accent);stroke:none"/>
  <text x="498.9" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="539.1" y="215.3" width="48.4" height="4.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="539.1" y="211.2" width="48.4" height="4.1" style="fill:var(--accent);stroke:none"/>
  <text x="563.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="603.6" y="215.5" width="48.4" height="4.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="603.6" y="212.1" width="48.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="627.8" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <text x="80.0" y="254.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">Nov 2015</text>
  <text x="10.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">views per day</text>
  <rect x="80" y="268" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="98.0" y="278.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">desktop</text>
  <rect x="280" y="268" width="12" height="12" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="298.0" y="278.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">mobile web and app</text>
</svg>
<figcaption>Measles, November 2015. The record day of the article in 4 years is almost entirely desktop and is gone the next day.</figcaption>
</figure>

The biggest day of the Influenza article has the same shape. October 23, 2017, 20,696 views, 91.5% of the extra from the mobile web, the next day only 1.4 times a normal day. There was no flu to speak of in October. I don't know what it was.

Only 2 of 47 spike days have this shape. But they are the biggest days of Measles and Influenza in 4 years. The biggest day is the one that ends up in a chart. Since then I split every spike by platform before reading anything into it.

## Flu views follow ILI

For flu the barometer works. Over 206 weeks the correlation between weekly views and ILI is 0.805. If I replace the October 2017 day with a normal one it is 0.814.

I expected panic to be visible in the 2017-18 season. It was the heaviest of the 4, ILI peaked at 7.52% against 3.5 to 5.1 in the others. The article did get its biggest week, 66,522 views. But per point of ILI over the season the views do not stand out:

| season | ILI peak | views per ILI point |
|---|---|---|
| 2015-16 | 3.53 | 15,969 |
| 2016-17 | 5.06 | 12,232 |
| 2017-18 | 7.52 | 10,331 |
| 2018-19 | 5.07 | 8,230 |

The ratio falls every season and 2017-18 sits on the same falling line. I don't know why it falls, maybe people just read Wikipedia about flu less every year. If there was extra fear that winter, this number does not show it. But if I divide the peak week by the peak ILI, 2017-18 is about a fifth above the trend. So a little extra attention at the top is possible.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Weekly views of the English Wikipedia article Influenza and weekly ILI in the US from October 2015 to September 2019, 206 weeks. Both rise every winter and fall every spring. Peaks of ILI: 3.53, 5.06, 7.52 and 5.07 percent. Correlation 0.805.">
  <line x1="60" y1="220.0" x2="620" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="164.0" x2="620" y2="164.0" class="f-plain"/>
  <text x="52.0" y="168.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="60" y1="108.0" x2="620" y2="108.0" class="f-plain"/>
  <text x="52.0" y="112.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="60" y1="52.0" x2="620" y2="52.0" class="f-plain"/>
  <text x="52.0" y="56.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="628.0" y="224.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="628.0" y="175.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="628.0" y="126.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4</text>
  <text x="628.0" y="77.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="628.0" y="28.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">8</text>
  <line x1="95.5" y1="220" x2="95.5" y2="225" class="f-plain"/>
  <text x="95.5" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <line x1="237.6" y1="220" x2="237.6" y2="225" class="f-plain"/>
  <text x="237.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <line x1="379.6" y1="220" x2="379.6" y2="225" class="f-plain"/>
  <text x="379.6" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <line x1="521.7" y1="220" x2="521.7" y2="225" class="f-plain"/>
  <text x="521.7" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <polyline points="60.0,145.5 62.7,143.9 65.5,143.1 68.2,147.0 70.9,142.4 73.7,142.9 76.4,140.6 79.1,146.1 81.9,140.3 84.6,139.9 87.3,142.7 90.0,160.5 92.8,136.7 95.5,129.3 98.2,125.7 101.0,120.9 103.7,111.1 106.4,106.5 109.2,104.9 111.9,98.8 114.6,83.1 117.4,88.8 120.1,93.4 122.8,107.8 125.6,121.3 128.3,128.9 131.0,135.2 133.8,126.3 136.5,80.8 139.2,107.8 142.0,145.1 144.7,150.2 147.4,154.2 150.1,157.8 152.9,162.9 155.6,166.7 158.3,169.1 161.1,169.0 163.8,172.2 166.5,175.0 169.3,174.7 172.0,171.9 174.7,172.4 177.5,174.0 180.2,172.7 182.9,169.1 185.7,166.3 188.4,164.0 191.1,157.7 193.9,152.7 196.6,147.8 199.3,147.5 202.0,145.5 204.8,145.4 207.5,142.0 210.2,141.8 213.0,144.9 215.7,140.2 218.4,134.9 221.2,141.3 223.9,133.7 226.6,132.3 229.4,133.8 232.1,132.2 234.8,122.8 237.6,98.4 240.3,99.7 243.0,106.4 245.8,110.9 248.5,105.9 251.2,98.9 254.0,101.8 256.7,109.3 259.4,115.9 262.1,128.6 264.9,137.1 267.6,137.4 270.3,141.1 273.1,144.9 275.8,156.3 278.5,155.3 281.3,157.6 284.0,163.9 286.7,162.5 289.5,164.2 292.2,168.1 294.9,169.7 297.7,170.3 300.4,170.1 303.1,172.9 305.9,173.8 308.6,174.5 311.3,172.6 314.0,169.6 316.8,170.6 319.5,166.6 322.2,167.7 325.0,166.0 327.7,166.7 330.4,167.2 333.2,161.7 335.9,155.0 338.6,149.6 341.4,154.4 344.1,150.6 346.8,146.8 349.6,147.0 352.3,98.6 355.0,151.3 357.8,146.0 360.5,146.1 363.2,146.5 366.0,143.7 368.7,136.2 371.4,132.7 374.1,124.8 376.9,110.7 379.6,71.6 382.3,33.7 385.1,42.6 387.8,35.8 390.5,42.8 393.3,61.0 396.0,72.6 398.7,102.6 401.5,119.7 404.2,124.5 406.9,135.2 409.7,142.6 412.4,150.8 415.1,154.8 417.9,157.5 420.6,158.6 423.3,159.9 426.0,167.3 428.8,167.9 431.5,169.3 434.2,168.0 437.0,172.2 439.7,170.4 442.4,175.6 445.2,174.4 447.9,177.1 450.6,179.8 453.4,179.1 456.1,178.9 458.8,175.8 461.6,180.8 464.3,182.1 467.0,182.7 469.8,181.5 472.5,179.3 475.2,174.0 478.0,170.0 480.7,167.2 483.4,164.4 486.1,160.1 488.9,160.1 491.6,156.9 494.3,155.4 497.1,157.5 499.8,158.0 502.5,152.4 505.3,149.3 508.0,151.0 510.7,154.9 513.5,155.5 516.2,155.2 518.9,157.1 521.7,144.3 524.4,134.2 527.1,137.7 529.9,131.9 532.6,131.6 535.3,133.2 538.0,136.6 540.8,145.2 543.5,149.7 546.2,153.1 549.0,153.3 551.7,159.4 554.4,161.2 557.2,158.9 559.9,167.7 562.6,172.8 565.4,172.4 568.1,172.7 570.8,173.9 573.6,174.0 576.3,173.2 579.0,172.5 581.8,179.3 584.5,179.2 587.2,179.0 590.0,181.2 592.7,179.6 595.4,180.1 598.1,178.9 600.9,182.5 603.6,181.2 606.3,181.6 609.1,186.1 611.8,182.4 614.5,181.4 617.3,179.5 620.0,176.2" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="60.0,189.5 62.7,187.9 65.5,186.5 68.2,186.2 70.9,184.6 73.7,182.9 76.4,180.7 79.1,173.2 81.9,178.6 84.6,176.1 87.3,173.9 90.0,162.9 92.8,160.7 95.5,172.2 98.2,170.9 101.0,168.0 103.7,165.1 106.4,161.7 109.2,151.3 111.9,143.5 114.6,142.9 117.4,138.8 120.1,133.5 122.8,145.3 125.6,152.3 128.3,160.3 131.0,170.5 133.8,171.5 136.5,173.1 139.2,178.3 142.0,181.4 144.7,186.4 147.4,188.2 150.1,191.3 152.9,192.3 155.6,194.4 158.3,196.2 161.1,199.1 163.8,199.6 166.5,200.8 169.3,202.1 172.0,202.9 174.7,202.4 177.5,203.7 180.2,203.1 182.9,202.6 185.7,199.9 188.4,195.9 191.1,195.0 193.9,193.4 196.6,192.2 199.3,189.1 202.0,190.7 204.8,189.9 207.5,189.0 210.2,186.6 213.0,183.6 215.7,181.8 218.4,179.7 221.2,173.2 223.9,175.6 226.6,173.0 229.4,165.9 232.1,153.1 234.8,137.6 237.6,144.2 240.3,144.6 243.0,134.1 245.8,126.9 248.5,111.3 251.2,96.0 254.0,100.9 256.7,107.8 259.4,132.9 262.1,134.1 264.9,141.3 267.6,144.1 270.3,151.5 273.1,161.5 275.8,171.8 278.5,177.5 281.3,181.7 284.0,185.6 286.7,188.7 289.5,188.6 292.2,191.4 294.9,192.8 297.7,194.4 300.4,197.8 303.1,197.9 305.9,198.9 308.6,199.9 311.3,201.6 314.0,201.9 316.8,202.0 319.5,202.1 322.2,203.1 325.0,202.1 327.7,197.7 330.4,195.0 333.2,193.2 335.9,193.2 338.6,193.1 341.4,190.9 344.1,189.0 346.8,188.0 349.6,187.2 352.3,182.8 355.0,177.2 357.8,173.8 360.5,169.5 363.2,164.1 366.0,164.0 368.7,156.7 371.4,137.5 374.1,104.1 376.9,80.1 379.6,79.2 382.3,75.6 385.1,60.3 387.8,44.5 390.5,35.7 393.3,39.0 396.0,62.1 398.7,98.5 401.5,129.7 404.2,141.9 406.9,152.2 409.7,159.1 412.4,161.0 415.1,169.2 417.9,176.4 420.6,180.4 423.3,182.3 426.0,182.6 428.8,188.4 431.5,191.0 434.2,189.4 437.0,192.0 439.7,195.8 442.4,198.1 445.2,198.1 447.9,198.5 450.6,200.9 453.4,202.2 456.1,203.3 458.8,204.3 461.6,204.3 464.3,202.7 467.0,202.7 469.8,199.8 472.5,198.9 475.2,193.0 478.0,191.7 480.7,190.6 483.4,189.4 486.1,185.2 488.9,185.6 491.6,183.9 494.3,179.8 497.1,176.1 499.8,174.2 502.5,171.2 505.3,165.1 508.0,167.3 510.7,164.4 513.5,155.2 516.2,143.1 518.9,122.7 521.7,135.2 524.4,144.0 527.1,138.6 529.9,127.1 532.6,113.5 535.3,100.8 538.0,95.9 540.8,99.5 543.5,107.6 546.2,112.1 549.0,115.9 551.7,129.8 554.4,143.8 557.2,153.7 559.9,163.4 562.6,170.2 565.4,177.6 568.1,181.1 570.8,182.8 573.6,183.3 576.3,184.8 579.0,185.5 581.8,189.7 584.5,192.3 587.2,195.5 590.0,196.6 592.7,198.5 595.4,199.9 598.1,201.2 600.9,201.9 603.6,202.2 606.3,201.2 609.1,201.9 611.8,199.2 614.5,195.7 617.3,191.7 620.0,191.1" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>
  <text x="10.0" y="14.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">views per week, thousands</text>
  <text x="670.0" y="14.0" text-anchor="end" class="f-label f-ink" style="font-size:11px">ILI, %</text>
</svg>
<figcaption>Influenza views (accent) and ILI as published by CDC in week 37 of 2019 (dark). Each line has its own scale.</figcaption>
</figure>

In 3 seasons of 4 the views peaked 2 to 5 weeks before ILI. In 2015-16 it was the other way, 6 weeks after. Week by week a 1 week lead gives 0.819 against 0.814 without a lead, which is noise. I would not build a forecast on it.

## Ebola in Kivu

The ministry reported 43 cases on August 3, 2018 and 3,160 by September 20, 2019. In October 2018 there were 124 new cases and the article had 64,929 views. In April 2019 there were 406 new cases, more than 3 times as many. The article had 55,968 views. The epidemic grew and the views went down, from 524 views per new case to 138. I picked these 2 months on purpose, but every month from October to April has between 55,000 and 78,000 views. From May the views more than doubled. May is the month of The Hot Zone. Week by week the correlation of views with new cases is 0.32.

Then the jumps. On May 28 the article had 16,996 views, 6.3 times its median of the previous 4 weeks. New cases that week were lower than in the 3 weeks before. The same day the article about the National Geographic series The Hot Zone, which aired May 27 to 29, had 47,910 views. I can only see that the dates match. On the weekly chart the week of the series, 69,589 views, is as high as the week of the emergency declaration in July, 69,406. A smaller jump on June 12 and 13, about 11,000 a day, came right after the first cases in Uganda. That one is probably about cases, like the jump to 6,192 on July 15, the day after the case in Goma.

The emergency declaration is the clearest one. In the 4 weeks before July 17 the ministry counted 332 new cases and the article had 66,670 views. In the 4 weeks after it counted 320 and the article had 141,709. The same epidemic at the same speed was read 2.1 times more. It did not last long. By July 24 the daily views were already below twice the level of the 4 weeks before Goma.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Weekly new Ebola cases in North Kivu and Ituri as bars and weekly views of the English Wikipedia article Ebola virus disease as a line, 58 weeks from August 2018 to September 2019. Cases grow from about 10 to over 100 per week while views stay near 15,000 until two jumps: the week of The Hot Zone series in late May 2019 and the week of the WHO emergency declaration in July 2019.">
  <line x1="60" y1="220.0" x2="620" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="172.5" x2="620" y2="172.5" class="f-plain"/>
  <text x="52.0" y="176.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="60" y1="125.0" x2="620" y2="125.0" class="f-plain"/>
  <text x="52.0" y="129.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="60" y1="77.5" x2="620" y2="77.5" class="f-plain"/>
  <text x="52.0" y="81.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">120</text>
  <line x1="60" y1="30.0" x2="620" y2="30.0" class="f-plain"/>
  <text x="52.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">160</text>
  <text x="628.0" y="224.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">0</text>
  <text x="628.0" y="176.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">20</text>
  <text x="628.0" y="129.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">40</text>
  <text x="628.0" y="81.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">60</text>
  <text x="628.0" y="34.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">80</text>
  <rect x="61.0" y="209.3" width="7.7" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="70.7" y="173.7" width="7.7" height="46.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="80.3" y="196.3" width="7.7" height="23.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="90.0" y="209.3" width="7.7" height="10.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="99.6" y="206.9" width="7.7" height="13.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="109.3" y="206.9" width="7.7" height="13.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="118.9" y="211.7" width="7.7" height="8.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="128.6" y="208.1" width="7.7" height="11.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="138.2" y="198.6" width="7.7" height="21.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="143.1" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct 2018</text>
  <rect x="147.9" y="179.6" width="7.7" height="40.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="157.6" y="189.1" width="7.7" height="30.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="167.2" y="184.4" width="7.7" height="35.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="176.9" y="183.2" width="7.7" height="36.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="186.5" y="183.2" width="7.7" height="36.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="196.2" y="176.1" width="7.7" height="43.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="205.8" y="165.4" width="7.7" height="54.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="215.5" y="186.8" width="7.7" height="33.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="225.1" y="155.9" width="7.7" height="64.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="234.8" y="176.1" width="7.7" height="43.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="244.4" y="168.9" width="7.7" height="51.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="254.1" y="193.9" width="7.7" height="26.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="263.8" y="187.9" width="7.7" height="32.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="268.6" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan 2019</text>
  <rect x="273.4" y="195.1" width="7.7" height="24.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="283.1" y="171.3" width="7.7" height="48.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="292.7" y="163.0" width="7.7" height="57.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="302.4" y="171.3" width="7.7" height="48.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="312.0" y="176.1" width="7.7" height="43.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="321.7" y="187.9" width="7.7" height="32.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="331.3" y="183.2" width="7.7" height="36.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="341.0" y="190.3" width="7.7" height="29.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="350.7" y="187.9" width="7.7" height="32.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="360.3" y="184.4" width="7.7" height="35.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="370.0" y="151.1" width="7.7" height="68.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="379.6" y="133.3" width="7.7" height="86.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="389.3" y="144.0" width="7.7" height="76.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="394.1" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr 2019</text>
  <rect x="398.9" y="95.3" width="7.7" height="124.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="408.6" y="119.1" width="7.7" height="100.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="418.2" y="97.7" width="7.7" height="122.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="427.9" y="83.4" width="7.7" height="136.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="437.6" y="70.4" width="7.7" height="149.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="447.2" y="58.5" width="7.7" height="161.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="456.9" y="106.0" width="7.7" height="114.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="466.5" y="122.6" width="7.7" height="97.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="476.2" y="146.4" width="7.7" height="73.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="485.8" y="110.8" width="7.7" height="109.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="495.5" y="111.9" width="7.7" height="108.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="505.1" y="117.9" width="7.7" height="102.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="514.8" y="121.4" width="7.7" height="98.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="519.6" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul 2019</text>
  <rect x="524.4" y="123.8" width="7.7" height="96.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="534.1" y="114.3" width="7.7" height="105.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="543.8" y="123.8" width="7.7" height="96.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="553.4" y="108.4" width="7.7" height="111.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="563.1" y="145.2" width="7.7" height="74.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="572.7" y="147.6" width="7.7" height="72.4" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="582.4" y="111.9" width="7.7" height="108.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="592.0" y="145.2" width="7.7" height="74.8" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="601.7" y="163.0" width="7.7" height="57.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="611.3" y="165.4" width="7.7" height="54.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <polyline points="64.8,186.4 74.5,191.5 84.1,188.9 93.8,190.1 103.4,180.2 113.1,184.2 122.8,188.4 132.4,175.8 142.1,183.4 151.7,185.5 161.4,182.8 171.0,186.4 180.7,189.8 190.3,185.1 200.0,161.3 209.7,186.6 219.3,176.8 229.0,169.2 238.6,181.4 248.3,176.3 257.9,193.5 267.6,172.0 277.2,188.0 286.9,184.9 296.6,182.7 306.2,187.7 315.9,184.9 325.5,156.0 335.2,190.5 344.8,190.6 354.5,185.3 364.1,191.7 373.8,193.0 383.4,187.2 393.1,190.8 402.8,185.7 412.4,187.7 422.1,192.3 431.7,177.5 441.4,178.2 451.0,172.7 460.7,166.9 470.3,54.7 480.0,134.4 489.7,97.8 499.3,152.6 509.0,182.8 518.6,188.8 528.3,189.4 537.9,55.2 547.6,153.2 557.2,159.2 566.9,174.6 576.6,154.2 586.2,182.8 595.9,185.6 605.5,186.3 615.2,180.4" style="fill:none;stroke:var(--accent);stroke-width:1.6"/>
  <text x="464.3" y="46.7" text-anchor="end" class="f-label f-ink" style="font-size:11px">The Hot Zone</text>
  <text x="543.9" y="47.2" text-anchor="start" class="f-label f-ink" style="font-size:11px">WHO emergency</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">new cases per week</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-label f-accent" style="font-size:11px">views per week, thousands</text>
</svg>
<figcaption>Cases (bars) from the DRC health ministry, views (line) from English Wikipedia. Each has its own scale.</figcaption>
</figure>

I thought that maybe English is the wrong language for Kivu, where French is official. The French article is 30 to 40 times smaller and the shape is the same. It stayed between 1,500 and 2,300 views a month from October to April and had 4,362 in July.

Zika shows how far a short burst of attention can go. 44% of all views of that article in 4 years fell into the 46 days from January 15 to February 29, 2016.

## What I didn't check

Only 2 languages and only Wikipedia. Google Trends could look different. The spike threshold of 4 times the median is my choice. The flu correlation is helped by seasonality itself. Both series go up every winter, so 0.805 is less impressive than it sounds. Maybe flu works as a barometer only because it comes every winter on schedule. I did not find the cause of the October 2017 flu spike or the November 2015 measles one. The ministry numbers are a later compilation of the daily reports and I did not compare them with the original bulletins.
