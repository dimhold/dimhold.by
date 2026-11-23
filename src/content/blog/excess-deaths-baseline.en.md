---
title: "What the baseline does to excess deaths in England and Wales"
description: "ONS weekly death registrations for England and Wales, week ending 3 April 2020: how much of the excess over a normal year is in any COVID count, and how much the answer moves when the baseline changes. Easter in the 5 year average, a low winter and the highest year give an excess between 4,788 and 6,531."
date: 2020-04-19
lang: en
translationKey: excess-deaths-baseline
tags: ["open-data", "statistics"]
---
Every evening there is a new UK death count from the Department of Health and every evening someone in my chats posts it. On Tuesday the Office for National Statistics published its weekly file for the week ending 3 April. By that date the daily count for England and Wales was 4,093. The ONS count of deaths that happened by 3 April, with registrations up to 11 April, was 6,235. Counted by the day of registration it was 4,122. That is almost the same as the evening number and it confused me more than the difference.

I had been treating the evening number as the number of people who died. For England it counts hospital deaths with a positive test, reported by a certain day. The usual advice is to stop arguing about definitions and look at excess deaths, all deaths against a normal year. A death certificate does not depend on who got tested. I accepted that advice, but I never asked what a "normal year" is. I also did not know how much the answer moves when you pick a different one.

## The data

ONS publishes deaths registered each week in England and Wales as a spreadsheet. On 14 April it put out the file for week 14, which is 28 March to 3 April. At 10:45 the same morning it replaced the file with an updated one. The first file had place of death only as a total since 29 December. The new one splits weeks 11 to 14 and I almost missed it because the sheet name did not change. I use the updated file, which is still the current one, plus the final weekly files for 2015 to 2019. My script is a short pandas job that reads the sheets and subtracts.

Week 14 of 2020 had 16,387 registered deaths. The ONS average for the same week of 2015 to 2019 is 10,305. So the excess is 6,082. In the same week, 3,475 death certificates mentioned COVID-19. That leaves 2,607 deaths above normal that are not in any COVID count, 43 percent of the excess.

Before going further I wrote down what would make me drop this. If a reasonable baseline pushed those 2,607 to zero, the hidden deaths would just be a property of the average.

## The average has Easter in it

My own average from the 5 old files came out at 10,304, one death off the ONS number. Then I looked at the years separately. 2015 was 9,062, about 1,550 below the average of the other 4. Week 14 of 2015 ended on Good Friday, when register offices are closed. The ONS footnote says it directly: moveable public holidays affect registrations in the published weeks and in the same weeks of previous years. In 2020 Easter is on 12 April, so week 14 had all 5 working days.

I expected the other Easter years to look like 2015 and they don't. 2018 had Easter Monday in week 14 and still registered 10,794, above the mean. 2016 is the highest of all 5 at 11,599, with both Easter holidays in the 2 weeks before it. My guess is that both are catch up weeks after the holiday, but I did not check registrations by day.

So I tried 2 versions. Without the years that had a holiday in week 14, the base is 10,555 and the excess goes down to 5,832. Without the years that had a holiday in week 14 or the week before, only 2017 and 2019 are left. Then the base is 10,033 and the excess grows to 6,354. Easter moves the number by about 250 deaths in each direction. Most of my time went into this. The next correction moves the number more.

<figure class="fig">
<svg viewBox="0 0 680 332" role="img" aria-label="Week 14 of 2020 in England and Wales, 16,387 registered deaths. Excess deaths for 5 baselines, each bar split into 3,475 deaths with COVID-19 on the certificate and the rest. ONS average, 2015–2019: base 10,305, 6,082, not in any COVID count 2,607. Without Easter weeks (2016, 2017, 2019): base 10,555, 5,832, not in any COVID count 2,357. Without Easter and catch up (2017, 2019): base 10,033, 6,354, not in any COVID count 2,879. ONS average × 0.956 (2020 level): base 9,856, 6,531, not in any COVID count 3,056. Highest year (2016): base 11,599, 4,788, not in any COVID count 1,313.">
  <text x="20.0" y="26.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">ONS average, 2015–2019: base 10,305</text>
  <rect x="20" y="34" width="268.1" height="24" style="fill:var(--accent);opacity:0.8"/>
  <rect x="288.1" y="34" width="201.1" height="24" style="fill:var(--muted);opacity:0.45"/>
  <text x="497.2" y="51.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6,082 (2,607)</text>
  <text x="20.0" y="84.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">Without Easter weeks (2016, 2017, 2019): base 10,555</text>
  <rect x="20" y="92" width="268.1" height="24" style="fill:var(--accent);opacity:0.8"/>
  <rect x="288.1" y="92" width="181.8" height="24" style="fill:var(--muted);opacity:0.45"/>
  <text x="477.9" y="109.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">5,832 (2,357)</text>
  <text x="20.0" y="142.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">Without Easter and catch up (2017, 2019): base 10,033</text>
  <rect x="20" y="150" width="268.1" height="24" style="fill:var(--accent);opacity:0.8"/>
  <rect x="288.1" y="150" width="222.1" height="24" style="fill:var(--muted);opacity:0.45"/>
  <text x="518.2" y="167.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6,354 (2,879)</text>
  <text x="20.0" y="200.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">ONS average × 0.956 (2020 level): base 9,856</text>
  <rect x="20" y="208" width="268.1" height="24" style="fill:var(--accent);opacity:0.8"/>
  <rect x="288.1" y="208" width="235.7" height="24" style="fill:var(--muted);opacity:0.45"/>
  <text x="531.8" y="225.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6,531 (3,056)</text>
  <text x="20.0" y="258.0" text-anchor="start" class="f-label f-ink" style="font-size:12px">Highest year (2016): base 11,599</text>
  <rect x="20" y="266" width="268.1" height="24" style="fill:var(--accent);opacity:0.8"/>
  <rect x="288.1" y="266" width="101.3" height="24" style="fill:var(--muted);opacity:0.45"/>
  <text x="397.4" y="283.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4,788 (1,313)</text>
  <rect x="20" y="312" width="18" height="12" style="fill:var(--accent);opacity:0.8"/>
  <text x="44.0" y="322.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">COVID-19 on the certificate (3,475)</text>
  <rect x="320" y="312" width="18" height="12" style="fill:var(--muted);opacity:0.45"/>
  <text x="344.0" y="322.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">not in any COVID count</text>
</svg>
<figcaption>ONS weekly registrations, week ending 3 April 2020, updated file of 14 April. The COVID part is the same in every bar, only the baseline changes.</figcaption>
</figure>

In weeks 2 to 10, before COVID appeared on certificates, 2020 registered 4.4 percent fewer deaths than the 5 year average. I don't know why. If I scale the average down by the same share, the base for week 14 is 9,856 and the excess is 6,531. The harshest version takes the highest year for this week, the 2016 catch up week. Then the excess is 4,788.

Depending on the baseline, the excess in week 14 is between 4,788 and 6,531. The deaths not mentioned as COVID are between 1,313 and 3,056. None of the baselines brings them to zero, which is what I wanted to know. But the choice of baseline alone moves the excess by 1,700 deaths, half of the COVID count of the same week.

## Where the extra deaths happened

The updated file has the place of death by week. There is no 5 year average for it, so I compare week 14 with the mean of weeks 11 to 13 of 2020. This is a weaker comparison, because week 13 was already 1,011 above average.

In hospitals, deaths rose by 2,934 and COVID mentions rose by 2,908. Almost every additional hospital death has COVID on the certificate. In care homes and at home together, deaths rose by 2,462 and COVID mentions only by 302. Outside hospitals the rise without a COVID mention is about 2,200. It is of the same size as the 2,607 above, but the 2 numbers are counted against different bases.

<figure class="fig">
<svg viewBox="0 0 680 252" role="img" aria-label="Rise in deaths in week 14 against the mean of weeks 11 to 13 of 2020, by place of death, with the rise of deaths mentioning COVID-19. Hospital: rise of all deaths +2,934, rise of COVID-19 mentions +2,908. Care home: rise of all deaths +1,337, rise of COVID-19 mentions +188. Home: rise of all deaths +1,125, rise of COVID-19 mentions +115.">
  <text x="130.0" y="44.0" text-anchor="end" class="f-label f-ink" style="font-size:12px">Hospital</text>
  <rect x="140" y="20" width="421.8" height="22" style="fill:var(--muted);opacity:0.45"/>
  <rect x="140" y="46" width="418.0" height="22" style="fill:var(--accent);opacity:0.8"/>
  <text x="569.8" y="36.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">+2,934</text>
  <text x="566.0" y="62.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">+2,908</text>
  <text x="130.0" y="114.0" text-anchor="end" class="f-label f-ink" style="font-size:12px">Care home</text>
  <rect x="140" y="90" width="192.2" height="22" style="fill:var(--muted);opacity:0.45"/>
  <rect x="140" y="116" width="27.0" height="22" style="fill:var(--accent);opacity:0.8"/>
  <text x="340.2" y="106.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">+1,337</text>
  <text x="175.0" y="132.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">+188</text>
  <text x="130.0" y="184.0" text-anchor="end" class="f-label f-ink" style="font-size:12px">Home</text>
  <rect x="140" y="160" width="161.7" height="22" style="fill:var(--muted);opacity:0.45"/>
  <rect x="140" y="186" width="16.5" height="22" style="fill:var(--accent);opacity:0.8"/>
  <text x="309.7" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">+1,125</text>
  <text x="164.5" y="202.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">+115</text>
  <rect x="140" y="232" width="18" height="12" style="fill:var(--muted);opacity:0.45"/>
  <text x="164.0" y="242.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">rise of all deaths</text>
  <rect x="370" y="232" width="18" height="12" style="fill:var(--accent);opacity:0.8"/>
  <text x="394.0" y="242.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">rise of COVID-19 mentions</text>
</svg>
<figcaption>Same ONS file, sheet with place of occurrence. The comparison is with weeks 11 to 13 of 2020. There is no 5 year average by place in the file.</figcaption>
</figure>

This does not tell me that the care home deaths were COVID. They could be people who were never tested or people who did not go to hospital when in February they would have gone. The certificate only says what the doctor wrote. Against weeks 11 to 13 the file shows only where the gap is. In hospitals COVID mentions cover almost all of the rise, in care homes and at home about an eighth.

By region it looks similar. In London COVID mentions cover 76 percent of the excess against the 5 year average. In the South West and in Yorkshire and the Humber it is 37 and 39 percent. I have no explanation for that and did not try to find one.

## What I did not check

Everything here is by registration date, so a week of registrations is not a week of deaths. Since late March deaths can be registered by phone. I do not know if that delayed or sped up registrations in weeks 13 and 14. The averages are not adjusted for a growing and older population.

The ONS file for week 15 comes on Tuesday. Good Friday is inside that week, so it will be hard to compare with anything.
