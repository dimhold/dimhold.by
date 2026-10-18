---
title: "Almost half of npm's top downloads come from packages with one maintainer. I looked at who pays them"
description: "I took the 4362 npm packages with at least 1 million weekly downloads at the end of 2022 and counted who can publish them, who asks for money and how much money is public. 47% of the downloads come from packages with 1 maintainer, 19% of packages ask for money and only 13 READMEs found by my word list say anything about the people. Open Collective shows 1.65 million dollars for 2022, 16 per million downloads. 53% of it went to 5 collectives."
date: 2022-12-28
lang: en
translationKey: free-package-economics
tags: ["dependencies", "open-data", "statistics"]
---
In January the author of colors and faker broke both packages on purpose. faker 6.6.6 came out without the code and colors started to print "LIBERTY LIBERTY LIBERTY" in an endless loop. It hit everyone whose install picked up the new version. In November 2020 he had already written on GitHub that there would be no more free work from him. The threads I read were mostly about whether he had the right to do it. I had a different question and no answer to it. Who maintains the packages under my node_modules and does anybody pay them?

npm has printed "N packages are looking for funding" after install since version 6.13 in 2019. I always scrolled past this line. So I decided to count, before the year ends.

## What I took

The list is `npm-high-impact` 1.1.0 from November 2022. Its author collected the packages that match the definition npm uses for high impact. I took the part with 1 million downloads per week or more, 4366 packages. For each one I took the newest stable version published before 28 December 2022. From that version I read the npm accounts that can publish it and the README inside its tarball. So the text is what the authors wrote this year. Downloads are from the npm API for 1 January to 27 December 2022. 4 packages with 2 letter names (yn, pn, rx, is) get 0 from the API. 4362 are left, with 2.0 trillion downloads together.

Before the first number I wrote down what I expected. More than half of the downloads come from packages with 1 or 2 maintainers. Less than a third of packages ask for money. And on Open Collective, where the money a project receives is public, less than 1 dollar per million downloads.

## Who holds them

The median package in the list has 2 maintainers. 2086 packages, 48% of the list, have exactly 1 and they give 47% of all downloads. Packages with 1 or 2 maintainers give 65% of the downloads, so the first expectation holds.

<figure class="fig">
<svg viewBox="0 0 680 216" role="img" aria-label="4362 npm packages with at least 1 million weekly downloads, grouped by the number of npm accounts that can publish the version current on 28 December 2022. 1 maintainer: share of downloads 47%, share of packages 48%. 2: share of downloads 17%, share of packages 18%. 3 to 5: share of downloads 25%, share of packages 23%. 6 or more: share of downloads 10%, share of packages 11%.">
  <text x="16" y="33" class="f-mono f-ink" style="font-size:12px">1 maintainer</text>
  <rect x="150" y="18" width="321.2" height="13" rx="2" class="f-accent"/>
  <text x="477.2" y="29" class="f-mono f-ink" style="font-size:12px">47%</text>
  <rect x="150" y="34" width="328.0" height="13" rx="2" class="f-box"/>
  <text x="484.0" y="45" class="f-mono f-muted" style="font-size:12px">48%</text>
  <text x="16" y="77" class="f-mono f-ink" style="font-size:12px">2</text>
  <rect x="150" y="62" width="116.2" height="13" rx="2" class="f-accent"/>
  <text x="272.2" y="73" class="f-mono f-ink" style="font-size:12px">17%</text>
  <rect x="150" y="78" width="123.0" height="13" rx="2" class="f-box"/>
  <text x="279.0" y="89" class="f-mono f-muted" style="font-size:12px">18%</text>
  <text x="16" y="121" class="f-mono f-ink" style="font-size:12px">3 to 5</text>
  <rect x="150" y="106" width="170.8" height="13" rx="2" class="f-accent"/>
  <text x="326.8" y="117" class="f-mono f-ink" style="font-size:12px">25%</text>
  <rect x="150" y="122" width="157.2" height="13" rx="2" class="f-box"/>
  <text x="313.2" y="133" class="f-mono f-muted" style="font-size:12px">23%</text>
  <text x="16" y="165" class="f-mono f-ink" style="font-size:12px">6 or more</text>
  <rect x="150" y="150" width="68.3" height="13" rx="2" class="f-accent"/>
  <text x="224.3" y="161" class="f-mono f-ink" style="font-size:12px">10%</text>
  <rect x="150" y="166" width="75.2" height="13" rx="2" class="f-box"/>
  <text x="231.2" y="177" class="f-mono f-muted" style="font-size:12px">11%</text>
  <rect x="150" y="195" width="14" height="10" rx="2" class="f-accent"/>
  <text x="170" y="204" class="f-mono f-ink" style="font-size:11px">share of downloads</text>
  <rect x="370" y="195" width="14" height="10" rx="2" class="f-box"/>
  <text x="390" y="204" class="f-mono f-ink" style="font-size:11px">share of packages</text>
  <line x1="150" y1="8" x2="150" y2="190" class="f-plain"/>
</svg>
<figcaption>Downloads from 1 January to 27 December 2022, 2.0 trillion together. An account is not always a person.</figcaption>
</figure>

Then I counted accounts and not packages. I picked accounts greedily: first the account whose packages give the most downloads, then the one that adds the most new downloads and so on. A package counts as covered when at least one of its maintainers is picked. 3 accounts cover a quarter of all downloads and 12 accounts are enough for half. One account, sindresorhus, is a maintainer on 274 packages with 14% of all downloads. On 222 of them he is the only one. `has-flag` and `find-up` are among them.

An npm account is not a person. 170 of the packages with 1 maintainer belong to "types", the bot that publishes DefinitelyTyped. "fb" publishes React and Jest packages. The median package with 1 maintainer is 7 years old. 1579 of them are older than 5 years and at least 460 of those had a new release this year.

## What they write

731 packages have the funding field in package.json. This field is what `npm fund` and the line after install read. With sponsor links in the README it is 812 packages, 19% of the list and 26% of the downloads. The second expectation holds. GitHub Sponsors is the most common link with 478 packages, Open Collective has 302. Another 205 READMEs mention a Tidelift subscription. Tidelift sells a subscription to companies, so I did not count it as asking.

I searched the READMEs for words about the people behind the code: volunteers, free time, spare time, hobby project, not backed by a company. My word list found 13 packages out of 4362. When I read other READMEs I saw that it misses some. ioredis, for example, says that open source is hard and time consuming. So it is at least 13 of 4362. Some of them:

`core-js`, 2.1 billion downloads this year, one maintainer. Above the text there is a heading "As advertising: the author is looking for a good job" and then the text:

> `core-js` isn't backed by a company, so the future of this project depends on you.

webpack:

> Most of the core team members, webpack contributors and contributors in the ecosystem do this open source work in their free time.

msw, created in 2018, 61 million downloads:

> Despite that, this library remains a hobby project maintained in spare time

In the same sentence it says that it cannot pay even one contributor to work on it full time.

`core-js` also has a postinstall script that prints the same request into the terminal. I installed it with npm 6.14 and the request was there. With npm 8.19 it was not, because npm 7 and newer hide the output of install scripts. The funding line was printed by both.

## How much money is visible

Open Collective publishes the books of every collective. I asked its API how much each collective linked from these packages received in 2022.

My first sum was almost 2 million dollars and it looked too good. Then I saw airbnb with 200,000 and salesforce with 44,000 in the list. These are funds that give money. Their logos are in the sponsor list of the eslint README and my regex took every Open Collective link. I kept only accounts of the collective type and removed 3 links that point to another project in an example. After that it was 1.65 million dollars for 75 collectives. They are linked from 286 packages with 5% of all downloads.

That is 16 dollars per million downloads. My expectation was less than 1, so here I was wrong by more than 10 times.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="75 Open Collective collectives linked from the 4362 most downloaded npm packages, sorted by dollars received in 2022, 1.65 million together. The 5 largest: babel 226,287, eslint 182,608, socketio 165,712, webpack 157,850, nest 142,825. Together they received 53% of the money. The lower 38 collectives together received 23,824 dollars. core-js received 11,377 dollars, its collective is linked from 3 packages with 3.8 billion downloads.">
  <line x1="70" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="64" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$0</text>
  <line x1="70" y1="140.8" x2="660" y2="140.8" class="f-plain"/>
  <text x="64" y="144.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$100,000</text>
  <line x1="70" y1="61.7" x2="660" y2="61.7" class="f-plain"/>
  <text x="64" y="65.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">$200,000</text>
  <text x="660" y="18" text-anchor="end" class="f-mono f-muted" style="font-size:11px">dollars received in 2022</text>
  <rect x="70.8" y="40.9" width="6.3" height="179.1" class="f-accent"/>
  <rect x="78.7" y="75.4" width="6.3" height="144.6" class="f-accent"/>
  <rect x="86.5" y="88.8" width="6.3" height="131.2" class="f-accent"/>
  <rect x="94.4" y="95.0" width="6.3" height="125.0" class="f-accent"/>
  <rect x="102.3" y="106.9" width="6.3" height="113.1" class="f-accent"/>
  <rect x="110.1" y="148.4" width="6.3" height="71.6" class="f-box"/>
  <rect x="118.0" y="153.4" width="6.3" height="66.6" class="f-box"/>
  <rect x="125.9" y="177.1" width="6.3" height="42.9" class="f-box"/>
  <rect x="133.7" y="180.9" width="6.3" height="39.1" class="f-box"/>
  <rect x="141.6" y="183.7" width="6.3" height="36.3" class="f-box"/>
  <rect x="149.5" y="184.0" width="6.3" height="36.0" class="f-box"/>
  <rect x="157.3" y="188.0" width="6.3" height="32.0" class="f-box"/>
  <rect x="165.2" y="191.8" width="6.3" height="28.2" class="f-box"/>
  <rect x="173.1" y="198.1" width="6.3" height="21.9" class="f-box"/>
  <rect x="180.9" y="202.0" width="6.3" height="18.0" class="f-box"/>
  <rect x="188.8" y="203.5" width="6.3" height="16.5" class="f-box"/>
  <rect x="196.7" y="204.0" width="6.3" height="16.0" class="f-box"/>
  <rect x="204.5" y="204.5" width="6.3" height="15.5" class="f-box"/>
  <rect x="212.4" y="205.2" width="6.3" height="14.8" class="f-box"/>
  <rect x="220.3" y="205.3" width="6.3" height="14.7" class="f-box"/>
  <rect x="228.1" y="205.6" width="6.3" height="14.4" class="f-box"/>
  <rect x="236.0" y="206.1" width="6.3" height="13.9" class="f-box"/>
  <rect x="243.9" y="207.6" width="6.3" height="12.4" class="f-box"/>
  <rect x="251.7" y="209.4" width="6.3" height="10.6" class="f-box"/>
  <rect x="259.6" y="209.6" width="6.3" height="10.4" class="f-box"/>
  <rect x="267.5" y="210.1" width="6.3" height="9.9" class="f-box"/>
  <rect x="275.3" y="211.0" width="6.3" height="9.0" class="f-ink"/>
  <rect x="283.2" y="214.1" width="6.3" height="5.9" class="f-box"/>
  <rect x="291.1" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="298.9" y="214.3" width="6.3" height="5.7" class="f-box"/>
  <rect x="306.8" y="214.8" width="6.3" height="5.2" class="f-box"/>
  <rect x="314.7" y="216.2" width="6.3" height="3.8" class="f-box"/>
  <rect x="322.5" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="330.4" y="217.0" width="6.3" height="3.0" class="f-box"/>
  <rect x="338.3" y="217.2" width="6.3" height="2.8" class="f-box"/>
  <rect x="346.1" y="217.3" width="6.3" height="2.7" class="f-box"/>
  <rect x="354.0" y="217.5" width="6.3" height="2.5" class="f-box"/>
  <rect x="361.9" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="369.7" y="218.2" width="6.3" height="1.8" class="f-box"/>
  <rect x="377.6" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="385.5" y="218.8" width="6.3" height="1.2" class="f-box"/>
  <rect x="393.3" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="401.2" y="218.9" width="6.3" height="1.1" class="f-box"/>
  <rect x="409.1" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="416.9" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="424.8" y="219.0" width="6.3" height="1.0" class="f-box"/>
  <rect x="432.7" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="440.5" y="219.1" width="6.3" height="0.9" class="f-box"/>
  <rect x="448.4" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="456.3" y="219.2" width="6.3" height="0.8" class="f-box"/>
  <rect x="464.1" y="219.3" width="6.3" height="0.7" class="f-box"/>
  <rect x="472.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="479.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="487.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="495.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="503.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="511.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="519.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="527.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="534.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="542.8" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="550.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="558.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="566.4" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="574.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="582.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="590.0" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="597.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="605.7" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="613.6" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="621.5" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="629.3" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="637.2" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="645.1" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <rect x="652.9" y="219.4" width="6.3" height="0.6" class="f-box"/>
  <text x="119.3" y="88.8" class="f-mono f-ink" style="font-size:11px">top 5: 53% of all</text>
  <text x="119.3" y="103.8" class="f-mono f-muted" style="font-size:11px">babel, eslint, socketio, webpack, nest</text>
  <line x1="278.5" y1="216.0" x2="278.5" y2="172.0" class="f-line"/>
  <text x="278.5" y="168.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">core-js $11,377</text>
  <line x1="361.1" y1="228" x2="660" y2="228" class="f-line"/>
  <line x1="361.1" y1="224" x2="361.1" y2="232" class="f-line"/>
  <line x1="660" y1="224" x2="660" y2="232" class="f-line"/>
  <text x="510.5" y="246" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">lower 38 together: $23,824</text>
</svg>
<figcaption>Only accounts of the collective type. Funds and companies that appear in the sponsor lists are not counted.</figcaption>
</figure>

The top 5 collectives (babel, eslint, socketio, webpack, nest) received 53% of the money. Together the lower 38 received 23,824 dollars for the whole year and 25 collectives received less than 1000 each. The `core-js` collective received 11,377 dollars. It is linked from 3 packages with 3.8 billion downloads together, about 3 dollars per million.

The packages with 1 maintainer are almost not in this picture. Only 3% of their downloads come from packages that link any collective. 481 of the 2086 ask for money at all, 386 of them through GitHub Sponsors. GitHub Sponsors does not publish amounts, so for these packages I have no number.

## What I did not check

Money from employers. Some maintainers are paid by their employer for this work. The npm CLI team at GitHub is an example, its accounts darcyclarke and nlf are in the list too. npm does not show such money and I did not search the READMEs for it.

Amounts on GitHub Sponsors and Patreon are not public, I only counted the links. Downloads include CI and mirrors and they are not people. The money of a collective goes to the whole project. I divided it only by the downloads of the packages from my list that link to it, so dollars per download are rather too high. MUI is not in the sum, because its README links an address that the API did not resolve.
