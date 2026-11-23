---
title: "Did the lockdown clean the air? I checked the US monitors 3 ways"
description: "EPA monitor data for the US, January to June of 2014 to 2020, counted 3 ways and checked against placebo years without a lockdown. NO2 fell by about a fifth in the spring of 2020, less than the headline 25.5 percent. The PM2.5 drop was already there in January and ozone fell when I expected it to stay flat."
date: 2020-08-16
lang: en
translationKey: air-lockdown
tags: ["open-data", "statistics"]
---
In April my feed was full of maps where the air over cities turned from orange to green. At the start of June a paper by Berman and Ebisu put a number on it. NO2 in 122 US counties fell 25.5 percent from March 13 to April 21, compared with the same days of 2017 to 2019. I believed it, because less traffic means cleaner air and the number was in a journal. I never asked what exactly 2020 was compared to or if the same comparison shows a drop in a normal year.

So I took the EPA data and tried to check the headline before believing it.

## The data and the 3 comparisons

EPA publishes daily summaries for every regulatory monitor as CSV files in its AirData archive. I took January to June of 2014 to 2020 for NO2, PM2.5 and ozone. For NO2 I use the daily mean of hourly values. Ozone is the daily maximum of the 8 hour average, PM2.5 the 24 hour mean. Wind speed and temperature come from the same archive. A station counts if it has at least 70 percent of the days in both windows in each of the 4 years being compared. For NO2 that left 289 stations in 2020.

The lockdown window is March 15 to April 30. California had the first statewide stay at home order on March 19 and most states had one by early April. I count the change in this window 3 ways:

1. Naive. The 2020 window against the same days of the 3 previous years.
2. With a control. The same change for January 6 to February 29, before anything closed, is taken out.
3. With weather. For each station I fit a regression of the log value on season and day of week, plus wind and temperature. Each year gets its own level. The level for 2020 is learned from January 1 to March 14 only. Then I compare the window with the prediction.

The weather version needs a weather station within 25 km. For NO2 that is 169 stations, mostly with the weather sensor on the same site. All averages are on the log scale, so one very bad day does not pull a station too much. The code is Python with pandas and plain least squares from numpy.

Before counting I wrote down my guesses. For NO2 it was minus 20 to 30 percent naively and 10 to 20 after corrections. I expected PM2.5 to drop a little and lose it after the control. Ozone I expected to stay flat. I also ran the same 3 comparisons for 2017, 2018 and 2019, each against its own 3 previous years. There was no lockdown in those springs, so this shows how much these methods move on their own.

## NO2 drops, but by a fifth and not a quarter

The naive median over 289 stations is minus 24 percent. With ordinary averages instead of the log scale it is minus 26, close to the 25.5 in the paper. The match is partly luck, the methods differ. They used the real time feed for 2020 and county averages of the daily maximum hourly value. I use the daily mean at single stations.

My first table here was wrong. I had the naive number with ordinary averages and the control with log averages. The control looked like it took 4 points. Most of that was the switch between the 2 kinds of mean. On the same scale January and February 2020 were 0.1 percent above their baseline. So the control changes almost nothing and gives minus 22.

The weather model gives minus 18 on its 169 stations. Without wind and temperature the same model gives minus 20.5, so the weather terms take 3 points. In the placebo years the same terms moved the result by up to 9 points. So I cannot say the spring of 2020 had unusual weather for NO2.

<figure class="fig">
<svg viewBox="0 0 680 304" role="img" aria-label="Median change of NO2 at US monitors against the average of the same week in the 3 previous years, by week of the year, January to June. 2020: 1: −3%, 2: −6%, 3: −13%, 4: +3%, 5: −12%, 6: −4%, 7: +2%, 8: +8%, 9: −2%, 10: −13%, 11: −26%, 12: −31%, 13: −28%, 14: −27%, 15: −37%, 16: −16%, 17: −15%, 18: −23%, 19: −15%, 20: −21%, 21: −19%, 22: −17%, 23: −17%, 24: −21%, 25: −10%, 26: −17%. Range of 2017, 2018 and 2019, each against its own 3 previous years: 1: −26% … +18%, 2: −26% … −7%, 3: −25% … +7%, 4: −31% … +4%, 5: −6% … −1%, 6: −28% … +9%, 7: −20% … −13%, 8: −20% … +3%, 9: −13% … −8%, 10: −29% … −3%, 11: −13% … +5%, 12: −18% … +12%, 13: −15% … +8%, 14: −10% … +1%, 15: −14% … −1%, 16: −23% … −7%, 17: −14% … +8%, 18: −11% … −2%, 19: −16% … 0%, 20: −9% … −2%, 21: −24% … +2%, 22: −10% … −3%, 23: −11% … −8%, 24: −7% … −2%, 25: −14% … −10%, 26: −14% … −3%. Before week 11 the 2020 line moves up and down around zero like the placebo years. In weeks 11 to 15 it is between minus 26 and minus 37 percent, below the whole range.">
  <rect x="290.4" y="24" width="187.2" height="210" style="fill:var(--muted);opacity:0.12"/>
  <text x="384.0" y="36.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">window</text>
  <line x1="60" y1="234.0" x2="660" y2="234.0" class="f-plain"/>
  <text x="54.0" y="238.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−40%</text>
  <line x1="60" y1="199.0" x2="660" y2="199.0" class="f-plain"/>
  <text x="54.0" y="203.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−30%</text>
  <line x1="60" y1="164.0" x2="660" y2="164.0" class="f-plain"/>
  <text x="54.0" y="168.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−20%</text>
  <line x1="60" y1="129.0" x2="660" y2="129.0" class="f-plain"/>
  <text x="54.0" y="133.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">−10%</text>
  <line x1="60" y1="94.0" x2="660" y2="94.0" class="f-plain" style="stroke:var(--muted)"/>
  <text x="54.0" y="98.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="60" y1="59.0" x2="660" y2="59.0" class="f-plain"/>
  <text x="54.0" y="63.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+10%</text>
  <line x1="60" y1="24.0" x2="660" y2="24.0" class="f-plain"/>
  <text x="54.0" y="28.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+20%</text>
  <text x="60" y="16" class="f-label f-muted">change against 3 previous years</text>
  <text x="60.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="180.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="300.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <text x="420.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <text x="540.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21</text>
  <text x="660.0" y="250.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">26</text>
  <text x="360" y="268" text-anchor="middle" class="f-label f-muted">week of the year</text>
  <path d="M60.0,32.4L84.0,119.1L108.0,69.0L132.0,78.6L156.0,96.9L180.0,63.0L204.0,140.2L228.0,84.7L252.0,122.5L276.0,103.1L300.0,77.3L324.0,53.5L348.0,66.6L372.0,89.9L396.0,98.4L420.0,118.7L444.0,65.6L468.0,101.1L492.0,94.1L516.0,99.9L540.0,86.1L564.0,104.9L588.0,120.9L612.0,100.0L636.0,129.2L660.0,106.0L660.0,143.6L636.0,144.1L612.0,118.3L588.0,132.2L564.0,129.8L540.0,177.4L516.0,124.9L492.0,150.1L468.0,131.4L444.0,142.5L420.0,175.5L396.0,142.0L372.0,129.0L348.0,146.7L324.0,155.9L300.0,140.1L276.0,193.9L252.0,140.9L228.0,164.6L204.0,163.5L180.0,190.8L156.0,113.9L132.0,201.5L108.0,181.5L84.0,186.3L60.0,184.9Z" style="fill:var(--muted);opacity:0.3;stroke:none"/>
  <path d="M60.0,105.1L84.0,115.0L108.0,139.5L132.0,84.2L156.0,136.4L180.0,108.0L204.0,85.4L228.0,64.6L252.0,101.3L276.0,139.3L300.0,186.6L324.0,203.4L348.0,193.0L372.0,187.8L396.0,222.5L420.0,148.9L444.0,147.0L468.0,175.8L492.0,148.2L516.0,169.0L540.0,161.0L564.0,153.2L588.0,154.0L612.0,165.8L636.0,128.9L660.0,154.3" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <circle cx="60.0" cy="105.1" r="2.2" class="f-accent"/>
  <circle cx="84.0" cy="115.0" r="2.2" class="f-accent"/>
  <circle cx="108.0" cy="139.5" r="2.2" class="f-accent"/>
  <circle cx="132.0" cy="84.2" r="2.2" class="f-accent"/>
  <circle cx="156.0" cy="136.4" r="2.2" class="f-accent"/>
  <circle cx="180.0" cy="108.0" r="2.2" class="f-accent"/>
  <circle cx="204.0" cy="85.4" r="2.2" class="f-accent"/>
  <circle cx="228.0" cy="64.6" r="2.2" class="f-accent"/>
  <circle cx="252.0" cy="101.3" r="2.2" class="f-accent"/>
  <circle cx="276.0" cy="139.3" r="2.2" class="f-accent"/>
  <circle cx="300.0" cy="186.6" r="2.2" class="f-accent"/>
  <circle cx="324.0" cy="203.4" r="2.2" class="f-accent"/>
  <circle cx="348.0" cy="193.0" r="2.2" class="f-accent"/>
  <circle cx="372.0" cy="187.8" r="2.2" class="f-accent"/>
  <circle cx="396.0" cy="222.5" r="2.2" class="f-accent"/>
  <circle cx="420.0" cy="148.9" r="2.2" class="f-accent"/>
  <circle cx="444.0" cy="147.0" r="2.2" class="f-accent"/>
  <circle cx="468.0" cy="175.8" r="2.2" class="f-accent"/>
  <circle cx="492.0" cy="148.2" r="2.2" class="f-accent"/>
  <circle cx="516.0" cy="169.0" r="2.2" class="f-accent"/>
  <circle cx="540.0" cy="161.0" r="2.2" class="f-accent"/>
  <circle cx="564.0" cy="153.2" r="2.2" class="f-accent"/>
  <circle cx="588.0" cy="154.0" r="2.2" class="f-accent"/>
  <circle cx="612.0" cy="165.8" r="2.2" class="f-accent"/>
  <circle cx="636.0" cy="128.9" r="2.2" class="f-accent"/>
  <circle cx="660.0" cy="154.3" r="2.2" class="f-accent"/>
  <text x="396.0" y="238.5" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">−37%</text>
  <line x1="20" y1="290" x2="42" y2="290" style="stroke:var(--accent);stroke-width:2.2"/>
  <text x="50" y="294" class="f-label f-muted" style="font-size:11px">2020</text>
  <rect x="140" y="284" width="22" height="12" style="fill:var(--muted);opacity:0.3"/>
  <text x="170" y="294" class="f-label f-muted" style="font-size:11px">2017 to 2019, no lockdown</text>
</svg>
<figcaption>EPA AirData daily NO2, median over monitors of the week mean against the mean of the same week in the 3 previous years. A week is a 7 day block from January 1. The grey band is the lowest and highest of the 3 placebo years 2017 to 2019. The shaded weeks are the window March 15 to April 30.</figcaption>
</figure>

In 2018 and 2019 the naive method gives minus 3 and minus 1 percent. In 2017 it gives minus 10 percent. Nothing closed in 2017. NO2 in the US goes down slowly by itself. At the 331 stations with data in all 7 years, the January to June mean in 2019 was 20 percent lower than in 2014. A 2014 to 2016 baseline sits high on that slope, which fits the 2017 result. 2017 itself is also a low year, 2018 is higher again.

With weather the placebo years land between minus 1 and plus 9 percent. In that version 85 percent of the stations are below zero in 2020, against 29 to 51 percent in the placebo years. So the lockdown cut NO2 by something like a fifth, but I would not give it a precise number.

There is one more check that worried me. If the model learns the 2020 level also from May and June, the effect shrinks to minus 11 percent. Traffic was still low in May and the model takes it as normal 2020.

## The PM2.5 paragraph I almost wrote

For PM2.5 the naive number is minus 9 percent. At first I took it as the second confirmation. Then I looked at the control window. In January and February, before any order, the same stations were already 8 percent below their baseline. With the control the change in the window is plus 5 percent, with weather plus 6. Both are inside what the placebo years give for the same methods, so I see no lockdown effect on PM2.5 at all.

The naive number is not special either. In 2017 the same method gave minus 11 percent for PM2.5 with nothing happening. But minus 9 is exactly the number I would have quoted if I had stopped at the first step. I knew that a large part of PM2.5 does not come from traffic, I just did not connect it with this number.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Median change in the March 15 to April 30 window by pollutant and method, 2020 against the range of the placebo years 2017 to 2019. NO2, naive: 2020 −24%, placebo years −10% … −1%. NO2, control: 2020 −22%, placebo years −2% … +13%. NO2, weather: 2020 −18%, placebo years −1% … +9%. PM2.5, naive: 2020 −9%, placebo years −11% … 0%. PM2.5, control: 2020 +5%, placebo years +1% … +7%. PM2.5, weather: 2020 +6%, placebo years −7% … +21%. Ozone, naive: 2020 −9%, placebo years +1% … +4%. Ozone, control: 2020 −10%, placebo years −1% … +6%. Ozone, weather: 2020 −8%, placebo years −2% … +5%.">
  <line x1="200.0" y1="14" x2="200.0" y2="276" class="f-plain"/>
  <text x="200.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−30%</text>
  <line x1="280.0" y1="14" x2="280.0" y2="276" class="f-plain"/>
  <text x="280.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−20%</text>
  <line x1="360.0" y1="14" x2="360.0" y2="276" class="f-plain"/>
  <text x="360.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−10%</text>
  <line x1="440.0" y1="14" x2="440.0" y2="276" class="f-plain" style="stroke:var(--muted)"/>
  <text x="440.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0%</text>
  <line x1="520.0" y1="14" x2="520.0" y2="276" class="f-plain"/>
  <text x="520.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+10%</text>
  <line x1="600.0" y1="14" x2="600.0" y2="276" class="f-plain"/>
  <text x="600.0" y="292.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+20%</text>
  <text x="420" y="310" text-anchor="middle" class="f-label f-muted">median change in the window</text>
  <text x="20" y="36" class="f-label f-ink" style="font-size:12px">NO2</text>
  <text x="190" y="36" text-anchor="end" class="f-label f-muted" style="font-size:11px">naive</text>
  <rect x="358.2" y="27" width="73.2" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="251.7" cy="32" r="4.5" class="f-accent"/>
  <text x="242.7" y="36.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−24%</text>
  <text x="190" y="60" text-anchor="end" class="f-label f-muted" style="font-size:11px">control</text>
  <rect x="425.7" y="51" width="119.3" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="263.4" cy="56" r="4.5" class="f-accent"/>
  <text x="254.4" y="60.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−22%</text>
  <text x="190" y="84" text-anchor="end" class="f-label f-muted" style="font-size:11px">weather</text>
  <rect x="434.0" y="75" width="77.4" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="299.5" cy="80" r="4.5" class="f-accent"/>
  <text x="290.5" y="84.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−18%</text>
  <text x="20" y="124" class="f-label f-ink" style="font-size:12px">PM2.5</text>
  <text x="190" y="124" text-anchor="end" class="f-label f-muted" style="font-size:11px">naive</text>
  <rect x="348.0" y="115" width="90.9" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="369.7" cy="120" r="4.5" class="f-accent"/>
  <text x="448.0" y="124.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">−9%</text>
  <text x="190" y="148" text-anchor="end" class="f-label f-muted" style="font-size:11px">control</text>
  <rect x="446.5" y="139" width="46.2" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="483.4" cy="144" r="4.5" class="f-accent"/>
  <text x="501.7" y="148.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">+5%</text>
  <text x="190" y="172" text-anchor="end" class="f-label f-muted" style="font-size:11px">weather</text>
  <rect x="382.9" y="163" width="221.4" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="489.8" cy="168" r="4.5" class="f-accent"/>
  <text x="613.3" y="172.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">+6%</text>
  <text x="20" y="212" class="f-label f-ink" style="font-size:12px">ozone</text>
  <text x="190" y="212" text-anchor="end" class="f-label f-muted" style="font-size:11px">naive</text>
  <rect x="448.4" y="203" width="20.8" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="366.3" cy="208" r="4.5" class="f-accent"/>
  <text x="357.3" y="212.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−9%</text>
  <text x="190" y="236" text-anchor="end" class="f-label f-muted" style="font-size:11px">control</text>
  <rect x="432.9" y="227" width="51.6" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="363.5" cy="232" r="4.5" class="f-accent"/>
  <text x="354.5" y="236.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−10%</text>
  <text x="190" y="260" text-anchor="end" class="f-label f-muted" style="font-size:11px">weather</text>
  <rect x="427.3" y="251" width="52.7" height="10" style="fill:var(--muted);opacity:0.35"/>
  <circle cx="378.3" cy="256" r="4.5" class="f-accent"/>
  <text x="369.3" y="260.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">−8%</text>
  <circle cx="30" cy="332" r="4.5" class="f-accent"/>
  <text x="42" y="336" class="f-label f-muted" style="font-size:11px">2020</text>
  <rect x="120" y="327" width="22" height="10" style="fill:var(--muted);opacity:0.35"/>
  <text x="150" y="336" class="f-label f-muted" style="font-size:11px">placebo years 2017 to 2019</text>
</svg>
<figcaption>Median over monitors. Naive is the window against the same days of the 3 previous years, control also takes out the January 6 to February 29 change, weather compares with a per monitor regression on season and day of week plus wind and temperature. The grey bar is the range of the same method in 2017, 2018 and 2019. All averages are on the log scale.</figcaption>
</figure>

## Ozone went the other way from what I expected

I expected ozone to stay flat or go up a little, because less NO near the road means less ozone destroyed there. Instead it fell by 9 percent on 600 stations. In the placebo years the same comparison gives a small rise, 1 to 4 percent. The weather model on 298 stations barely changes it. Ozone forms from NOx and organic compounds over hours and far from the source, so a regional drop is plausible. But this is a guess and I did not measure it.

## What I did not check

My control assumes that without the lockdown March and April would follow January and February. The weather model has only wind speed and temperature. The height of the mixing layer matters a lot for NO2. It is not in the model, like a few other things. Every number is a median over stations, so a big city and a rural station count the same. EPA also revises these files for months after quality checks, so the 2020 rows can still change.

For NO2 my number is minus 18 to minus 22 against minus 25.5 in the paper. For PM2.5 the drop was already there in January. Next I want to try the same placebo on the satellite NO2, where the coverage is much wider than these 289 stations.
