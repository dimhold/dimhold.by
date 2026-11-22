---
title: "What lockdown did to the hours people push to GitHub"
description: "In GH Archive the share of weekend pushes grew 3.4 points more from February to April 2020 than a year before. With local time taken from the commit offset, weekend pushes are +4.1 points and weekday pushes outside 9 to 18 are +3.8. My first sample showed almost nothing for weekends and I nearly wrote that. By October the weekends were back, the late weekday hours were not."
date: 2020-11-22
lang: en
translationKey: remote-push-hours
tags: ["git", "open-data", "statistics"]
---
All spring I kept reading the same picture of remote work. People commit at 11 at night and the weekend is gone. GitHub wrote on May 6 that in paid organizations the day between the first and the last push got longer by up to an hour, on weekdays and on weekends. I took the picture as obvious and never looked myself. GH Archive keeps every public GitHub event by the hour, so I wanted to check it on public repositories, for the whole world and in local time.

## The hour in the archive is UTC

Every event in GH Archive has `created_at` in UTC. A push at 14:00 UTC is after lunch in Warsaw and 22:00 in Beijing. Without the time zone of the person the hour means almost nothing and the archive does not have it.

The commit has it. Git writes the date with the offset of the machine where the commit was made, like `2020-04-15T15:59:55+02:00`. The REST API gives this date back in UTC and the offset is lost. GraphQL keeps it in `committer { date }` and one query can ask for 50 commits by repository and sha. For a sampled push I take the head commit and add its offset to the UTC time of the push. I keep the push only if the commit was made at most 12 hours before it. Then the offset is from the same evening or morning as the push. Usually it is the offset of the person who pushed, but a merge or a rebased commit can carry somebody else's.

## Setup

I took 6 weeks, Monday to Sunday, in February, April and October 2020. The same months of 2019 are the control for the season. The April weeks avoid Western Easter and May 1. In 2020 the April week is April 20 to 26, when most of Europe and the US were in lockdown. From each hour of the archive I kept only `PushEvent`. Then I dropped logins with "bot" in them and accounts with more than 200 pushes in a week. The rest is between 4.4 million pushes a week in February 2019 and 6.6 million in April 2020.

From February to April 2020 pushes grew by 25%, against 9% in 2019. The share of pushes made on Saturday and Sunday in UTC went from 21.7% to 24.6% in 2020, while in 2019 it went slightly down. Counted as a difference of differences, this is 3.4 points and 3.6 if I fill a 2 hour hole that the archive has on April 9, 2019.

## Where I nearly wrote the wrong thing

My first sample was 12 000 random pushes per week, which gave about 8 600 usable ones. The change in the weekend share came out +1.4 points against 2019. The 95% interval from a bootstrap over people went from −0.3 to +3.2. I was close to writing that weekends did not change much. At the same time the whole archive in UTC was saying +3.4, which did not fit.

So I took 24 000 more pushes per week. This second batch alone gives +5.4 and its interval does not even touch the first one. That looked like a bug, but the same 2 batches counted in UTC give 2.8 and 4.5 against 3.4 for the whole archive, so most of the gap is in which pushes were drawn. Together, with about 26 000 pushes per week, the weekend change is +4.1 points, interval 3.1 to 5.2. I would not trust its exact size to better than a point or two, while the 3.4 from the whole archive needs no sample.

## Weekdays

<figure class="fig">
<svg viewBox="0 0 680 284" role="img" aria-label="Share of weekday pushes in each local hour, in percent, three weeks. February 2020: 0:00 3.0, 1:00 1.7, 2:00 1.2, 3:00 0.8, 4:00 0.7, 5:00 0.7, 6:00 0.8, 7:00 1.1, 8:00 2.3, 9:00 4.2, 10:00 5.8, 11:00 6.9, 12:00 6.2, 13:00 6.5, 14:00 7.3, 15:00 7.5, 16:00 7.8, 17:00 6.7, 18:00 5.4, 19:00 4.8, 20:00 4.8, 21:00 4.8, 22:00 4.9, 23:00 4.2. April 2020: 0:00 3.6, 1:00 2.4, 2:00 1.5, 3:00 1.1, 4:00 0.8, 5:00 0.7, 6:00 0.8, 7:00 1.2, 8:00 2.1, 9:00 3.7, 10:00 5.4, 11:00 5.8, 12:00 6.0, 13:00 6.0, 14:00 6.5, 15:00 7.1, 16:00 7.7, 17:00 6.9, 18:00 5.6, 19:00 5.1, 20:00 5.1, 21:00 5.3, 22:00 5.0, 23:00 4.7. April 2019: 0:00 3.1, 1:00 2.1, 2:00 1.1, 3:00 0.9, 4:00 0.7, 5:00 0.5, 6:00 0.7, 7:00 1.2, 8:00 2.1, 9:00 4.2, 10:00 6.4, 11:00 6.9, 12:00 5.7, 13:00 6.6, 14:00 6.9, 15:00 7.4, 16:00 7.9, 17:00 7.1, 18:00 5.1, 19:00 4.7, 20:00 4.9, 21:00 4.8, 22:00 4.6, 23:00 4.3. In April 2020 the curve is lower from 9 to 15 and higher in the evening and at night, while April 2019 stays close to February 2020.">
  <rect x="278.8" y="20" width="228.8" height="200" class="f-box" style="stroke:none;opacity:0.6"/>
  <line x1="50" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="44.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="153.3" x2="660" y2="153.3" class="f-plain"/>
  <text x="44.0" y="157.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3</text>
  <line x1="50" y1="86.7" x2="660" y2="86.7" class="f-plain"/>
  <text x="44.0" y="90.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <line x1="50" y1="20.0" x2="660" y2="20.0" class="f-plain"/>
  <text x="44.0" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">9</text>
  <text x="50" y="14" class="f-label f-muted">% of weekday pushes</text>
  <text x="50.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0:00</text>
  <text x="126.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3:00</text>
  <text x="202.5" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6:00</text>
  <text x="278.8" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9:00</text>
  <text x="355.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12:00</text>
  <text x="431.3" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15:00</text>
  <text x="507.5" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">18:00</text>
  <text x="583.8" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">21:00</text>
  <text x="660.0" y="236.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">24:00</text>
  <text x="355" y="252" text-anchor="middle" class="f-label f-muted">local hour</text>
  <path d="M62.7,152.7L88.1,182.1L113.5,193.5L139.0,202.9L164.4,204.8L189.8,204.6L215.2,202.8L240.6,195.8L266.0,167.9L291.5,126.5L316.9,91.0L342.3,66.2L367.7,81.7L393.1,76.5L418.5,57.6L444.0,53.7L469.4,47.5L494.8,71.6L520.2,101.1L545.6,112.2L571.0,114.0L596.5,112.7L621.9,111.5L647.3,126.9" class="f-line" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <circle cx="62.7" cy="152.7" r="2.2" class="f-ink"/>
  <circle cx="88.1" cy="182.1" r="2.2" class="f-ink"/>
  <circle cx="113.5" cy="193.5" r="2.2" class="f-ink"/>
  <circle cx="139.0" cy="202.9" r="2.2" class="f-ink"/>
  <circle cx="164.4" cy="204.8" r="2.2" class="f-ink"/>
  <circle cx="189.8" cy="204.6" r="2.2" class="f-ink"/>
  <circle cx="215.2" cy="202.8" r="2.2" class="f-ink"/>
  <circle cx="240.6" cy="195.8" r="2.2" class="f-ink"/>
  <circle cx="266.0" cy="167.9" r="2.2" class="f-ink"/>
  <circle cx="291.5" cy="126.5" r="2.2" class="f-ink"/>
  <circle cx="316.9" cy="91.0" r="2.2" class="f-ink"/>
  <circle cx="342.3" cy="66.2" r="2.2" class="f-ink"/>
  <circle cx="367.7" cy="81.7" r="2.2" class="f-ink"/>
  <circle cx="393.1" cy="76.5" r="2.2" class="f-ink"/>
  <circle cx="418.5" cy="57.6" r="2.2" class="f-ink"/>
  <circle cx="444.0" cy="53.7" r="2.2" class="f-ink"/>
  <circle cx="469.4" cy="47.5" r="2.2" class="f-ink"/>
  <circle cx="494.8" cy="71.6" r="2.2" class="f-ink"/>
  <circle cx="520.2" cy="101.1" r="2.2" class="f-ink"/>
  <circle cx="545.6" cy="112.2" r="2.2" class="f-ink"/>
  <circle cx="571.0" cy="114.0" r="2.2" class="f-ink"/>
  <circle cx="596.5" cy="112.7" r="2.2" class="f-ink"/>
  <circle cx="621.9" cy="111.5" r="2.2" class="f-ink"/>
  <circle cx="647.3" cy="126.9" r="2.2" class="f-ink"/>
  <path d="M62.7,140.9L88.1,167.8L113.5,186.2L139.0,196.2L164.4,203.2L189.8,205.3L215.2,202.1L240.6,194.0L266.0,172.6L291.5,136.7L316.9,100.4L342.3,92.2L367.7,86.4L393.1,86.7L418.5,74.7L444.0,61.5L469.4,50.0L494.8,66.2L520.2,94.6L545.6,107.0L571.0,107.6L596.5,102.1L621.9,108.1L647.3,115.5" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2.4"/>
  <circle cx="62.7" cy="140.9" r="2.2" class="f-accent"/>
  <circle cx="88.1" cy="167.8" r="2.2" class="f-accent"/>
  <circle cx="113.5" cy="186.2" r="2.2" class="f-accent"/>
  <circle cx="139.0" cy="196.2" r="2.2" class="f-accent"/>
  <circle cx="164.4" cy="203.2" r="2.2" class="f-accent"/>
  <circle cx="189.8" cy="205.3" r="2.2" class="f-accent"/>
  <circle cx="215.2" cy="202.1" r="2.2" class="f-accent"/>
  <circle cx="240.6" cy="194.0" r="2.2" class="f-accent"/>
  <circle cx="266.0" cy="172.6" r="2.2" class="f-accent"/>
  <circle cx="291.5" cy="136.7" r="2.2" class="f-accent"/>
  <circle cx="316.9" cy="100.4" r="2.2" class="f-accent"/>
  <circle cx="342.3" cy="92.2" r="2.2" class="f-accent"/>
  <circle cx="367.7" cy="86.4" r="2.2" class="f-accent"/>
  <circle cx="393.1" cy="86.7" r="2.2" class="f-accent"/>
  <circle cx="418.5" cy="74.7" r="2.2" class="f-accent"/>
  <circle cx="444.0" cy="61.5" r="2.2" class="f-accent"/>
  <circle cx="469.4" cy="50.0" r="2.2" class="f-accent"/>
  <circle cx="494.8" cy="66.2" r="2.2" class="f-accent"/>
  <circle cx="520.2" cy="94.6" r="2.2" class="f-accent"/>
  <circle cx="545.6" cy="107.0" r="2.2" class="f-accent"/>
  <circle cx="571.0" cy="107.6" r="2.2" class="f-accent"/>
  <circle cx="596.5" cy="102.1" r="2.2" class="f-accent"/>
  <circle cx="621.9" cy="108.1" r="2.2" class="f-accent"/>
  <circle cx="647.3" cy="115.5" r="2.2" class="f-accent"/>
  <path d="M62.7,151.4L88.1,173.5L113.5,195.1L139.0,200.1L164.4,205.5L189.8,208.0L215.2,204.3L240.6,193.4L266.0,172.6L291.5,126.6L316.9,77.7L342.3,66.4L367.7,92.9L393.1,72.9L418.5,67.0L444.0,54.8L469.4,44.8L494.8,62.4L520.2,106.6L545.6,115.6L571.0,111.0L596.5,113.2L621.9,117.8L647.3,123.9" class="f-line" style="fill:none;stroke:var(--muted);stroke-width:1.3;stroke-dasharray:4 3"/>
  <line x1="50" y1="272" x2="72" y2="272" style="stroke:var(--ink);stroke-width:1.6"/>
  <text x="80" y="276" class="f-label f-muted">February 2020</text>
  <line x1="240" y1="272" x2="262" y2="272" style="stroke:var(--accent);stroke-width:2.4"/>
  <text x="270" y="276" class="f-label f-muted">April 2020</text>
  <line x1="430" y1="272" x2="452" y2="272" style="stroke:var(--muted);stroke-width:1.3;stroke-dasharray:4 3"/>
  <text x="460" y="276" class="f-label f-muted">April 2019</text>
</svg>
<figcaption>Weekday pushes by local hour of the pusher, share of all weekday pushes of the week. The shaded band is 9:00 to 18:00. About 26 000 sampled pushes per week, local time from the offset in the commit date.</figcaption>
</figure>

On weekdays the share of pushes outside 9:00 to 18:00 local time was 41.2% in February 2020 and 44.9% in April. Against the same months of 2019 this is +3.8 points, interval 2.4 to 5.2. Almost all of it is late, +2.0 between 18:00 and midnight and +1.7 after midnight. The middle of the day is thinner, but the peak is still at 16:00.

I also expected that without the commute the morning would start later. It did not. The share between 6:00 and 10:00 moved by −0.4 points, which is inside the noise.

<figure class="fig">
<svg viewBox="0 0 680 324" role="img" aria-label="Change against the same months of 2019, in percentage points, with 95% intervals. weekend share: April, everybody +4.1 [3.1; 5.2], April, same people +2.8 [1.3; 4.2], October, everybody +0.9 [−0.2; 2.0]. weekdays outside 9 to 18: April, everybody +3.8 [2.4; 5.1], April, same people +1.4 [−0.5; 3.2], October, everybody +2.4 [1.0; 3.8]. weekdays 18 to 24: April, everybody +2.0 [0.7; 3.2], April, same people +1.2 [−0.6; 2.8], October, everybody +1.0 [−0.3; 2.3]. weekdays 0 to 6: April, everybody +1.7 [0.9; 2.5], April, same people +1.0 [−0.1; 2.0], October, everybody +1.1 [0.3; 1.8]. weekdays 6 to 10: April, everybody −0.4 [−1.1; 0.4], April, same people −0.8 [−1.9; 0.3], October, everybody +0.4 [−0.4; 1.2].">
  <line x1="210.0" y1="26" x2="210.0" y2="256" class="f-plain"/>
  <text x="210.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−2</text>
  <line x1="265.0" y1="26" x2="265.0" y2="256" class="f-plain"/>
  <text x="265.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">−1</text>
  <line x1="320.0" y1="26" x2="320.0" y2="256" class="f-plain" style="stroke:var(--muted)"/>
  <text x="320.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="375.0" y1="26" x2="375.0" y2="256" class="f-plain"/>
  <text x="375.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+1</text>
  <line x1="430.0" y1="26" x2="430.0" y2="256" class="f-plain"/>
  <text x="430.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <line x1="485.0" y1="26" x2="485.0" y2="256" class="f-plain"/>
  <text x="485.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+3</text>
  <line x1="540.0" y1="26" x2="540.0" y2="256" class="f-plain"/>
  <text x="540.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <line x1="595.0" y1="26" x2="595.0" y2="256" class="f-plain"/>
  <text x="595.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+5</text>
  <line x1="650.0" y1="26" x2="650.0" y2="256" class="f-plain"/>
  <text x="650.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="430" y="288" text-anchor="middle" class="f-label f-muted">percentage points</text>
  <text x="198" y="40.0" text-anchor="end" class="f-label f-ink">weekend share</text>
  <line x1="489.0" y1="28" x2="603.3" y2="28" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="544.3" cy="28" r="4" style="fill:var(--accent)"/>
  <line x1="394.0" y1="38" x2="551.3" y2="38" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="469.6" y="34.5" width="7" height="7" style="fill:var(--ink)"/>
  <line x1="310.9" y1="48" x2="429.3" y2="48" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M370.2,43.5L374.7,48L370.2,52.5L365.7,48Z" style="fill:var(--muted)"/>
  <text x="198" y="86.0" text-anchor="end" class="f-label f-ink">weekdays outside 9 to 18</text>
  <line x1="453.6" y1="74" x2="603.2" y2="74" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="529.0" cy="74" r="4" style="fill:var(--accent)"/>
  <line x1="292.2" y1="84" x2="496.5" y2="84" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="393.7" y="80.5" width="7" height="7" style="fill:var(--ink)"/>
  <line x1="376.7" y1="94" x2="528.5" y2="94" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M452.1,89.5L456.6,94L452.1,98.5L447.6,94Z" style="fill:var(--muted)"/>
  <text x="198" y="132.0" text-anchor="end" class="f-label f-ink">weekdays 18 to 24</text>
  <line x1="360.7" y1="120" x2="495.4" y2="120" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="427.4" cy="120" r="4" style="fill:var(--accent)"/>
  <line x1="288.0" y1="130" x2="474.5" y2="130" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="381.5" y="126.5" width="7" height="7" style="fill:var(--ink)"/>
  <line x1="304.2" y1="140" x2="449.1" y2="140" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M377.7,135.5L382.2,140L377.7,144.5L373.2,140Z" style="fill:var(--muted)"/>
  <text x="198" y="178.0" text-anchor="end" class="f-label f-ink">weekdays 0 to 6</text>
  <line x1="370.4" y1="166" x2="455.8" y2="166" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="413.3" cy="166" r="4" style="fill:var(--accent)"/>
  <line x1="316.2" y1="176" x2="430.1" y2="176" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="371.1" y="172.5" width="7" height="7" style="fill:var(--ink)"/>
  <line x1="335.2" y1="186" x2="421.5" y2="186" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M379.9,181.5L384.4,186L379.9,190.5L375.4,186Z" style="fill:var(--muted)"/>
  <text x="198" y="224.0" text-anchor="end" class="f-label f-ink">weekdays 6 to 10</text>
  <line x1="257.5" y1="212" x2="341.8" y2="212" style="stroke:var(--accent);stroke-width:1.6"/>
  <circle cx="300.4" cy="212" r="4" style="fill:var(--accent)"/>
  <line x1="218.2" y1="222" x2="334.2" y2="222" style="stroke:var(--ink);stroke-width:1.6"/>
  <rect x="273.5" y="218.5" width="7" height="7" style="fill:var(--ink)"/>
  <line x1="296.8" y1="232" x2="383.9" y2="232" style="stroke:var(--muted);stroke-width:1.6"/>
  <path d="M341.2,227.5L345.7,232L341.2,236.5L336.7,232Z" style="fill:var(--muted)"/>
  <circle cx="25" cy="312" r="4" style="fill:var(--accent)"/>
  <text x="36" y="316" class="f-label f-muted">April, everybody</text>
  <rect x="231.5" y="308.5" width="7" height="7" style="fill:var(--ink)"/>
  <text x="246" y="316" class="f-label f-muted">April, same people</text>
  <path d="M445,307.5L449.5,312L445,316.5L440.5,312Z" style="fill:var(--muted)"/>
  <text x="456" y="316" class="f-label f-muted">October, everybody</text>
</svg>
<figcaption>Difference of differences: (2020 month minus February 2020) minus (2019 month minus February 2019). Lines are 95% intervals from a bootstrap over people. Same people: those who pushed in both the February and the April week.</figcaption>
</figure>

## The same people or other people

In April 2020 there were 20% more people pushing than in February, against 11% a year before. So the shift could come just from who pushes. To check, I took 12 000 random people per year who pushed in both the February and the April week. I kept up to 2 pushes of each per week. After the same filters, 8 386 people were left for 2020 and 8 240 for 2019.

For them the weekend share also grew, by 2.8 points, interval 1.3 to 4.2. That is smaller than for everybody but above zero. Weekday pushes outside 9 to 18 are less clear, +1.4 with the interval from −0.5 to +3.2. That points to newcomers, but the gap between this number and the one for everybody is itself within the noise. Students sent home is one guess I cannot check from this data.

## Regions

The offset also gives a rough region. For Central Europe, with summer time taken into account, the weekday share outside 9 to 18 grew by 6.0 points in April. In October it was back to the 2019 level. On the US west coast the weekend share grew by 5.9 points and in October it was still 5.1 above. India shows the biggest jumps, +9.6 points of weekend and +11.6 of weekday pushes outside 9 to 18. But its February and April weeks have only about 1 200 to 1 800 pushes each in the sample.

UTC+8, which is mostly China, shows almost nothing for April and that is the part I like most. In the February 2020 week it already had 27.3% of pushes on weekends against 21.5% a year before. In 2019 that week was also the first one after the New Year holiday, but in 2020 the holiday had been extended and a lot of people came back to work from home. This is what I know from the news, the data only shows the shift. So for this zone February is not a baseline.

## October

By the middle of October the weekend share is back to +0.9 points against 2019 and the interval crosses zero. Outside 9 to 18 on weekdays is still +2.4. October is also Hacktoberfest in both years, so it pushes both Octobers up and the 2019 control should take most of it out.

## What I did not check

- Only public repositories. GitHub's own numbers are about paid organizations, so these are not the same people.
- Only commits that still exist. If the repository was deleted or the history was rewritten, the commit does not come back from the API.
- The offset is the offset of the machine. Somebody with a laptop set to UTC counts as UTC and I did not look at commits made in the web interface separately.
- An offset is not a country. In February +1 is also West Africa and in April +2 is also South Africa and Egypt. The 2019 control has the same mix, so it mostly cancels.
- Monday April 20, 2020 was Orthodox Easter Monday and Ramadan started at the end of that week. In the 2019 control week there was neither.
- A push is not the moment of work. A person can commit all evening and push in the morning.

For the same people only the weekend interval stayed above zero, so of the 2 numbers I trust that one more.
