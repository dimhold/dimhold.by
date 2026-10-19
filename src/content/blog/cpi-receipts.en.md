---
title: "Cheap food rose 33% in a year, until I read the same prices backwards"
description: "I rebuilt UK food inflation from the raw ONS price quotes and got close to the official 16.4%. Cheap shelves seemed to rise 33% in a year, until I counted the same prices backwards. Then I checked how far a basket of 15 items can drift by chance."
date: 2022-12-17
lang: en
translationKey: cpi-receipts
tags: ["open-data", "statistics"]
---
On Wednesday the UK statistics office published inflation for November. In its CPI tables food and non alcoholic drinks cost 16.4% more than a year ago. This year the argument about such numbers is mostly about cheap food. In January Jack Monroe wrote that a 500 g pack of the cheapest pasta went from 29p to 70p. Later that month the New Statesman took the raw prices that ONS publishes. It showed that the cheapest tenth of prices rose much faster than the median.

I knew the official number and never looked at how it is made. The idea was to build my own index from receipts. But one person's receipts are 15 or 20 things from 1 or 2 shops. I did not know what an index from such a small basket can say at all. So first I wanted to see it on data where I can check the answer.

## The receipts ONS publishes

Every month ONS puts online the prices its collectors write down in local shops. The dataset is called "item indices and price quotes". One line is one price: the item, a shop code, a region, the price and a flag for a sale or a replacement product. For food and drinks it is about 42 thousand valid prices a month for about 175 items. An item is something like "large loaf white unsliced 800g" or "milk semi skimmed 2 pints". The same dataset has the official index of every item and its weight in CPI for 2022.

This is the closest thing to receipts that is open. I took the files from November 2021 to November 2022, the last one came out together with the 16.4%. Then I wrote a short Python script with pandas.

Others have asked the same question. In October ONS itself published an experimental index of the cheapest product in each of 30 everyday items, scraped from supermarket websites. It got about 17% to September. I am not the first here. What I wanted to see is how much the answer depends on how you count.

## First, can I get 16.4% back

I counted it 3 ways. The official item indices, combined with their CPI weights and chain linked through January the way ONS does it, give 16.0%. My own index from the raw prices gives 16.8%. There I compare one shelf a year apart, which means the same item in the same region and the same shop code. The naive version is what you do with a pile of receipts. Take the geometric mean of all prices of an item in November 2022 and divide it by the same for November 2021. No matching at all. It gives 16.6%.

The gap between 16.0% and 16.4% I could not close. One potato item worth 0.8 of 116 has no published index, but it can explain at most about 0.1 point. The rest sits inside the published subclass indices and I did not trace it.

The naive version came out closer than my matched one, which surprised me, but per item it is much worse than it looks. Of the 175 items, 170 have an official index in both years. For 90% of them the naive count misses the official item index somewhere between 6 points too low and 8 points too high. Over 170 items these errors mostly cancel, which I would not count on for a basket of 15.

<figure class="fig">
<svg viewBox="0 0 680 370" role="img" aria-label="Scatter plot of 170 food and drink items. The horizontal axis is the official price change of the item from November 2021 to November 2022, from about −2% to 46%. The vertical axis is the naive change from the same raw prices: geometric mean of all prices in November 2022 divided by the same in November 2021. Most points lie near the diagonal but spread several points around it, for 90% of items between 6 points below and 8 points above. Weighted together the naive version gives 16.6%, the official item indices give 16.0% and the published number is 16.4%.">
  <rect x="70" y="20" width="360" height="310" class="f-plain"/>
  <line x1="130.0" y1="330.0" x2="130.0" y2="334.0" class="f-plain"/>
  <text x="130.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="66.0" y1="278.3" x2="70.0" y2="278.3" class="f-plain"/>
  <text x="63.0" y="282.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="190.0" y1="330.0" x2="190.0" y2="334.0" class="f-plain"/>
  <text x="190.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="66.0" y1="226.7" x2="70.0" y2="226.7" class="f-plain"/>
  <text x="63.0" y="230.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="250.0" y1="330.0" x2="250.0" y2="334.0" class="f-plain"/>
  <text x="250.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">20</text>
  <line x1="66.0" y1="175.0" x2="70.0" y2="175.0" class="f-plain"/>
  <text x="63.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">20</text>
  <line x1="310.0" y1="330.0" x2="310.0" y2="334.0" class="f-plain"/>
  <text x="310.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">30</text>
  <line x1="66.0" y1="123.3" x2="70.0" y2="123.3" class="f-plain"/>
  <text x="63.0" y="127.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">30</text>
  <line x1="370.0" y1="330.0" x2="370.0" y2="334.0" class="f-plain"/>
  <text x="370.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">40</text>
  <line x1="66.0" y1="71.7" x2="70.0" y2="71.7" class="f-plain"/>
  <text x="63.0" y="75.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">40</text>
  <line x1="430.0" y1="330.0" x2="430.0" y2="334.0" class="f-plain"/>
  <text x="430.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="66.0" y1="20.0" x2="70.0" y2="20.0" class="f-plain"/>
  <text x="63.0" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="70.0" y1="330.0" x2="430.0" y2="20.0" class="f-line" style="stroke-dasharray:4 3"/>
  <circle cx="206.5" cy="180.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.8" cy="180.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="285.9" cy="152.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="294.1" cy="135.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="220.7" cy="145.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="299.8" cy="163.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="338.9" cy="84.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.7" cy="284.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.8" cy="179.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="150.5" cy="247.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="181.4" cy="261.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="143.8" cy="252.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="202.5" cy="193.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="147.3" cy="277.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.3" cy="226.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="193.4" cy="225.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="253.2" cy="146.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.6" cy="139.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.9" cy="145.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.5" cy="144.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="254.7" cy="130.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="214.1" cy="187.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="151.2" cy="195.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="195.9" cy="224.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="208.8" cy="221.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="286.5" cy="172.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.6" cy="219.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="218.4" cy="204.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.0" cy="207.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="236.8" cy="211.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.3" cy="237.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.7" cy="209.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.3" cy="170.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.6" cy="171.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="212.8" cy="212.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="171.2" cy="222.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="227.1" cy="188.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.6" cy="151.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="222.0" cy="216.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.6" cy="145.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="221.5" cy="177.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.7" cy="265.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="189.4" cy="196.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="305.7" cy="130.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="323.3" cy="139.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="203.4" cy="207.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="230.6" cy="192.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="206.0" cy="195.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.8" cy="185.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="253.5" cy="182.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.6" cy="220.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="183.5" cy="263.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="307.3" cy="141.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="283.2" cy="124.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="281.2" cy="150.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="315.7" cy="120.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="357.1" cy="78.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="271.5" cy="160.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="148.9" cy="253.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.4" cy="80.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.9" cy="190.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="334.8" cy="89.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.5" cy="218.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="318.9" cy="74.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="330.2" cy="108.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="405.5" cy="32.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="194.8" cy="232.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.3" cy="176.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.5" cy="230.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="222.7" cy="218.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="284.6" cy="137.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="241.1" cy="186.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.8" cy="207.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="184.1" cy="252.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="170.2" cy="218.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.7" cy="179.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="206.2" cy="230.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="223.1" cy="180.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="368.8" cy="81.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="274.8" cy="120.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="215.6" cy="223.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="215.0" cy="206.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="204.2" cy="218.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="258.5" cy="190.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="267.2" cy="209.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="207.5" cy="211.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="199.3" cy="228.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="256.4" cy="175.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="207.0" cy="204.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="254.9" cy="197.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="115.4" cy="235.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="289.3" cy="119.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="267.1" cy="141.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="184.6" cy="240.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="153.9" cy="249.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="167.7" cy="246.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="153.0" cy="269.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="219.2" cy="178.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="205.6" cy="233.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="145.8" cy="254.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="195.8" cy="214.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="155.5" cy="237.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="137.6" cy="237.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="178.0" cy="232.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="193.0" cy="233.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.0" cy="234.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.6" cy="187.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="258.2" cy="181.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="282.1" cy="163.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.0" cy="205.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="219.3" cy="195.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="350.7" cy="134.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="291.6" cy="168.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.2" cy="212.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="187.3" cy="230.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="192.2" cy="224.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="134.5" cy="264.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="150.2" cy="249.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="143.9" cy="264.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="263.7" cy="156.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.1" cy="163.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="183.0" cy="224.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.0" cy="217.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="147.7" cy="264.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="197.3" cy="212.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="357.4" cy="92.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="286.3" cy="167.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="269.9" cy="120.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="274.0" cy="80.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="158.8" cy="244.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="152.3" cy="241.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="155.1" cy="246.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="164.0" cy="234.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="173.1" cy="244.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="158.9" cy="246.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="125.5" cy="270.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="159.7" cy="254.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="204.3" cy="246.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.0" cy="220.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="133.1" cy="231.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.4" cy="212.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="213.5" cy="205.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="224.6" cy="186.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="351.9" cy="52.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="138.4" cy="268.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="148.2" cy="293.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="175.9" cy="238.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="165.0" cy="277.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="230.9" cy="187.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="168.6" cy="247.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.4" cy="225.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="347.5" cy="100.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="362.1" cy="193.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.3" cy="199.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.9" cy="152.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.2" cy="159.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.7" cy="127.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="182.0" cy="220.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="365.5" cy="94.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.5" cy="173.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.7" cy="185.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.1" cy="161.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="233.4" cy="152.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="275.0" cy="141.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.7" cy="172.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="179.5" cy="184.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="236.3" cy="221.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="154.6" cy="213.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.3" cy="248.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="140.9" cy="301.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <text x="250.0" y="364.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">official item index, %</text>
  <text transform="translate(22 175) rotate(-90)" text-anchor="middle" class="f-label f-muted" style="font-size:10px">naive, all prices, %</text>
  <line x1="470.0" y1="200.0" x2="655.0" y2="200.0" class="f-line"/>
  <line x1="470.0" y1="200.0" x2="470.0" y2="204.0" class="f-plain"/>
  <text x="470.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15.5</text>
  <line x1="531.7" y1="200.0" x2="531.7" y2="204.0" class="f-plain"/>
  <text x="531.7" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">16.0</text>
  <line x1="593.3" y1="200.0" x2="593.3" y2="204.0" class="f-plain"/>
  <text x="593.3" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">16.5</text>
  <line x1="655.0" y1="200.0" x2="655.0" y2="204.0" class="f-plain"/>
  <text x="655.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">17.0</text>
  <circle cx="611.5" cy="200" r="5" class="f-accent"/>
  <circle cx="476.0" cy="246" r="5" class="f-accent"/>
  <text x="488.0" y="250.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">naive 16.6%</text>
  <rect x="521.0" y="195" width="10" height="10" class="f-box"/>
  <rect x="471.0" y="261" width="10" height="10" class="f-box"/>
  <text x="488.0" y="270.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">official items 16.0%</text>
  <circle cx="581.0" cy="200" r="5" class="f-ink"/>
  <circle cx="476.0" cy="286" r="5" class="f-ink"/>
  <text x="488.0" y="290.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">published 16.4%</text>
</svg>
<figcaption>ONS price quotes and item indices, November 2021 and November 2022. Diagonal: naive equals official.</figcaption>
</figure>

## Cheap food

The New Statesman method on November prices is simple: take the 10th percentile and the median of each item in both years. The 10th percentile rose faster than the median in 98 of 170 items, slower in 68 and the same in 4. Weighted, cheap prices rose 20.4% against 16.3% for the median. The claim holds on these numbers too.

But the 10th percentile in 2021 and in 2022 are different shelves. I wanted the same shelf. I took the prices that were in the cheapest tenth of their item in November 2021 and looked at the same shelf a year later. By my first count they rose 32.9%. All the rest rose 13.6%. Cheap shelves rose faster in 125 of the 150 items that have enough matched shelves. I checked if it is sales, a cheap price that is just a promotion and comes back. It is not. 6.2% of these shelves were on sale against 5.5% of the others.

At this point I had the title of this post. Then I counted it the other way. Take the shelves that are cheapest in November 2022 and look how much they rose from a year before. If cheap shelves really climb faster, these should rise at least as much as everybody else. They rose 3.8%, against 16.3% for the rest.

The pairs mirror each other. That is what regression to the mean looks like. Suppose part of the price difference between shelves is noise. Then shelves picked as cheapest at the start seem to climb out later while the ones picked at the end look like they barely moved.

The noise was in the files, I just did not look at the flags. In a month about 1 in 10 food prices carries a mark that the product was replaced or its size changed. A shelf can also disappear for some months and come back. The same item and shop code a year apart is often not the same product. My first guess was the yearly sample change in February. It was wrong, because 99.9% of shelves carry their January price into February.

So I kept only unbroken shelves: a price in all 13 months and no mark of any kind except sales. That leaves 11,082 shelves in 142 items. The cheapest tenth of November 2021 rose 25.0%, the rest 15.7%. Backwards, the cheapest tenth of November 2022 rose 14.4%, the rest 16.6%. Most of the backwards gap is gone.

<figure class="fig">
<svg viewBox="0 0 680 300" role="img" aria-label="Two panels of bars, both November 2021 to November 2022. Left panel, all shelves matched by item, region and shop code: shelves in the cheapest tenth in November 2021 rose 32.9%, the rest 13.6%; shelves in the cheapest tenth in November 2022 rose 3.8%, the rest 16.3%. The two pairs mirror each other. Right panel, only shelves with a price in all 13 months and no mark except sales: cheapest tenth at the start rose 25.0%, the rest 15.7%; cheapest tenth at the end rose 14.4%, the rest 16.6%. The mirror is mostly gone.">
  <text x="30.0" y="22.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">all matched shelves</text>
  <text x="30.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">cheapest tenth picked in</text>
  <line x1="30.0" y1="250.0" x2="315.0" y2="250.0" class="f-line"/>
  <rect x="40" y="71.6" width="52" height="178.4" class="f-accent"/>
  <text x="66.0" y="65.6" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">32.9%</text>
  <text x="66.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">cheapest</text>
  <rect x="102" y="176.1" width="52" height="73.9" class="f-box"/>
  <text x="128.0" y="170.1" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">13.6%</text>
  <text x="128.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">rest</text>
  <text x="97.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">Nov 2021</text>
  <rect x="185" y="229.3" width="52" height="20.7" class="f-accent"/>
  <text x="211.0" y="223.3" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3.8%</text>
  <text x="211.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">cheapest</text>
  <rect x="247" y="161.3" width="52" height="88.7" class="f-box"/>
  <text x="273.0" y="155.3" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">16.3%</text>
  <text x="273.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">rest</text>
  <text x="242.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">Nov 2022</text>
  <text x="365.0" y="22.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">unbroken shelves, no marks</text>
  <text x="365.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">cheapest tenth picked in</text>
  <line x1="365.0" y1="250.0" x2="650.0" y2="250.0" class="f-line"/>
  <rect x="375" y="114.0" width="52" height="136.0" class="f-accent"/>
  <text x="401.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">25.0%</text>
  <text x="401.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">cheapest</text>
  <rect x="437" y="164.9" width="52" height="85.1" class="f-box"/>
  <text x="463.0" y="158.9" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">15.7%</text>
  <text x="463.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">rest</text>
  <text x="432.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">Nov 2021</text>
  <rect x="520" y="172.0" width="52" height="78.0" class="f-accent"/>
  <text x="546.0" y="166.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">14.4%</text>
  <text x="546.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">cheapest</text>
  <rect x="582" y="160.0" width="52" height="90.0" class="f-box"/>
  <text x="608.0" y="154.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">16.6%</text>
  <text x="608.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">rest</text>
  <text x="577.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">Nov 2022</text>
</svg>
<figcaption>Geometric mean of price change per shelf. A shelf is the same item, region and shop code. Right: 11,082 shelves in 142 items.</figcaption>
</figure>

Some gap is still there. Forwards, the cheap tenth beat the rest by 9.4 points. Backwards it was 2.2 points behind. Real catch up makes cheap shelves gain in both directions, while noise helps them one way and hurts them the other. If the noise is the same both ways, (9.4 − 2.2) / 2 = 3.6 points is real catch up and (9.4 + 2.2) / 2 = 5.8 is noise. The same split on all matched shelves, with the 33%, gives 3.4 points of catch up and 15.9 of noise. Cheap shelves did rise faster, by about 3 or 4 points a year. Most of the gap between 33% and the rest came from shelves broken during the year: replaced, resized or missing for some months.

## A basket of 15

Now the question I started with. I made baskets of 15 random items on unbroken shelves, all with equal weight. Each item is bought on 1 random shelf, so the shops are random too. 90% of such baskets landed between 9.1% and 26.4%. The official number is 16.4%.

If instead of 1 shelf I take the average change of each item, the same baskets of 15 land between 11.8% and 20.6%. With 2 other random seeds these bounds move by 0.1 or 0.2 points. The list of items gives about 9 points of spread and the shelf doubles it to about 17.

<figure class="fig">
<svg viewBox="0 0 680 325" role="img" aria-label="Two histograms of 20,000 random baskets of 15 food items, November 2021 to November 2022, unbroken shelves. The narrow one: average change of each item; 90% of baskets lie between 11.8% and 20.6%. The wide one: each item bought on 1 random shelf; 90% lie between 9.1% and 26.4%. A vertical line marks the published 16.4%.">
  <text x="40.0" y="42.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">item average</text>
  <rect x="140.8" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="148.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="156.3" y="149.7" width="6.8" height="0.3" class="f-box"/>
  <rect x="164.0" y="149.8" width="6.8" height="0.2" class="f-box"/>
  <rect x="171.8" y="148.8" width="6.8" height="1.2" class="f-box"/>
  <rect x="179.5" y="147.5" width="6.8" height="2.5" class="f-box"/>
  <rect x="187.3" y="145.2" width="6.8" height="4.8" class="f-box"/>
  <rect x="195.0" y="141.5" width="6.8" height="8.5" class="f-box"/>
  <rect x="202.8" y="136.8" width="6.8" height="13.2" class="f-box"/>
  <rect x="210.5" y="129.6" width="6.8" height="20.4" class="f-box"/>
  <rect x="218.3" y="120.0" width="6.8" height="30.0" class="f-box"/>
  <rect x="226.0" y="112.7" width="6.8" height="37.3" class="f-box"/>
  <rect x="233.8" y="99.6" width="6.8" height="50.4" class="f-box"/>
  <rect x="241.5" y="89.4" width="6.8" height="60.6" class="f-box"/>
  <rect x="249.3" y="75.0" width="6.8" height="75.0" class="f-box"/>
  <rect x="257.0" y="65.8" width="6.8" height="84.2" class="f-box"/>
  <rect x="264.8" y="56.4" width="6.8" height="93.6" class="f-box"/>
  <rect x="272.5" y="50.0" width="6.8" height="100.0" class="f-box"/>
  <rect x="280.3" y="50.3" width="6.8" height="99.7" class="f-box"/>
  <rect x="288.0" y="50.4" width="6.8" height="99.6" class="f-box"/>
  <rect x="295.8" y="52.2" width="6.8" height="97.8" class="f-box"/>
  <rect x="303.5" y="63.0" width="6.8" height="87.0" class="f-box"/>
  <rect x="311.3" y="68.5" width="6.8" height="81.5" class="f-box"/>
  <rect x="319.0" y="78.7" width="6.8" height="71.3" class="f-box"/>
  <rect x="326.8" y="90.3" width="6.8" height="59.7" class="f-box"/>
  <rect x="334.5" y="98.2" width="6.8" height="51.8" class="f-box"/>
  <rect x="342.3" y="107.9" width="6.8" height="42.1" class="f-box"/>
  <rect x="350.0" y="119.7" width="6.8" height="30.3" class="f-box"/>
  <rect x="357.8" y="126.3" width="6.8" height="23.7" class="f-box"/>
  <rect x="365.5" y="134.6" width="6.8" height="15.4" class="f-box"/>
  <rect x="373.3" y="138.0" width="6.8" height="12.0" class="f-box"/>
  <rect x="381.0" y="141.5" width="6.8" height="8.5" class="f-box"/>
  <rect x="388.8" y="144.2" width="6.8" height="5.8" class="f-box"/>
  <rect x="396.5" y="146.3" width="6.8" height="3.7" class="f-box"/>
  <rect x="404.3" y="148.0" width="6.8" height="2.0" class="f-box"/>
  <rect x="412.0" y="148.7" width="6.8" height="1.3" class="f-box"/>
  <rect x="419.8" y="149.3" width="6.8" height="0.7" class="f-box"/>
  <rect x="427.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="435.3" y="149.5" width="6.8" height="0.5" class="f-box"/>
  <rect x="443.0" y="149.7" width="6.8" height="0.3" class="f-box"/>
  <rect x="458.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <line x1="40.0" y1="150.0" x2="660.0" y2="150.0" class="f-line"/>
  <line x1="223.4" y1="52.0" x2="359.1" y2="52.0" class="f-line"/>
  <line x1="223.4" y1="52.0" x2="223.4" y2="58.0" class="f-line"/>
  <line x1="359.1" y1="52.0" x2="359.1" y2="58.0" class="f-line"/>
  <text x="365.1" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">90%: 11.8 … 20.6</text>
  <text x="40.0" y="172.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">1 random shelf per item</text>
  <rect x="40.0" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="47.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="55.5" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="63.3" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="71.0" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="78.8" y="279.3" width="6.8" height="0.7" class="f-accent"/>
  <rect x="86.5" y="279.4" width="6.8" height="0.6" class="f-accent"/>
  <rect x="94.3" y="278.8" width="6.8" height="1.2" class="f-accent"/>
  <rect x="102.0" y="278.1" width="6.8" height="1.9" class="f-accent"/>
  <rect x="109.8" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="117.5" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="125.3" y="276.4" width="6.8" height="3.6" class="f-accent"/>
  <rect x="133.0" y="274.7" width="6.8" height="5.3" class="f-accent"/>
  <rect x="140.8" y="274.6" width="6.8" height="5.4" class="f-accent"/>
  <rect x="148.5" y="273.6" width="6.8" height="6.4" class="f-accent"/>
  <rect x="156.3" y="269.9" width="6.8" height="10.1" class="f-accent"/>
  <rect x="164.0" y="266.6" width="6.8" height="13.4" class="f-accent"/>
  <rect x="171.8" y="266.7" width="6.8" height="13.3" class="f-accent"/>
  <rect x="179.5" y="262.9" width="6.8" height="17.1" class="f-accent"/>
  <rect x="187.3" y="259.1" width="6.8" height="20.9" class="f-accent"/>
  <rect x="195.0" y="258.3" width="6.8" height="21.7" class="f-accent"/>
  <rect x="202.8" y="255.1" width="6.8" height="24.9" class="f-accent"/>
  <rect x="210.5" y="250.7" width="6.8" height="29.3" class="f-accent"/>
  <rect x="218.3" y="247.1" width="6.8" height="32.9" class="f-accent"/>
  <rect x="226.0" y="244.2" width="6.8" height="35.8" class="f-accent"/>
  <rect x="233.8" y="240.4" width="6.8" height="39.6" class="f-accent"/>
  <rect x="241.5" y="238.2" width="6.8" height="41.8" class="f-accent"/>
  <rect x="249.3" y="236.5" width="6.8" height="43.5" class="f-accent"/>
  <rect x="257.0" y="237.0" width="6.8" height="43.0" class="f-accent"/>
  <rect x="264.8" y="231.6" width="6.8" height="48.4" class="f-accent"/>
  <rect x="272.5" y="232.8" width="6.8" height="47.2" class="f-accent"/>
  <rect x="280.3" y="228.3" width="6.8" height="51.7" class="f-accent"/>
  <rect x="288.0" y="226.1" width="6.8" height="53.9" class="f-accent"/>
  <rect x="295.8" y="230.1" width="6.8" height="49.9" class="f-accent"/>
  <rect x="303.5" y="224.5" width="6.8" height="55.5" class="f-accent"/>
  <rect x="311.3" y="227.4" width="6.8" height="52.6" class="f-accent"/>
  <rect x="319.0" y="230.6" width="6.8" height="49.4" class="f-accent"/>
  <rect x="326.8" y="229.0" width="6.8" height="51.0" class="f-accent"/>
  <rect x="334.5" y="233.9" width="6.8" height="46.1" class="f-accent"/>
  <rect x="342.3" y="235.1" width="6.8" height="44.9" class="f-accent"/>
  <rect x="350.0" y="237.9" width="6.8" height="42.1" class="f-accent"/>
  <rect x="357.8" y="241.6" width="6.8" height="38.4" class="f-accent"/>
  <rect x="365.5" y="243.2" width="6.8" height="36.8" class="f-accent"/>
  <rect x="373.3" y="246.3" width="6.8" height="33.7" class="f-accent"/>
  <rect x="381.0" y="249.2" width="6.8" height="30.8" class="f-accent"/>
  <rect x="388.8" y="251.2" width="6.8" height="28.8" class="f-accent"/>
  <rect x="396.5" y="255.6" width="6.8" height="24.4" class="f-accent"/>
  <rect x="404.3" y="256.3" width="6.8" height="23.7" class="f-accent"/>
  <rect x="412.0" y="259.3" width="6.8" height="20.7" class="f-accent"/>
  <rect x="419.8" y="258.7" width="6.8" height="21.3" class="f-accent"/>
  <rect x="427.5" y="264.6" width="6.8" height="15.4" class="f-accent"/>
  <rect x="435.3" y="266.7" width="6.8" height="13.3" class="f-accent"/>
  <rect x="443.0" y="268.4" width="6.8" height="11.6" class="f-accent"/>
  <rect x="450.8" y="268.6" width="6.8" height="11.4" class="f-accent"/>
  <rect x="458.5" y="271.2" width="6.8" height="8.8" class="f-accent"/>
  <rect x="466.3" y="273.1" width="6.8" height="6.9" class="f-accent"/>
  <rect x="474.0" y="272.1" width="6.8" height="7.9" class="f-accent"/>
  <rect x="481.8" y="274.1" width="6.8" height="5.9" class="f-accent"/>
  <rect x="489.5" y="276.1" width="6.8" height="3.9" class="f-accent"/>
  <rect x="497.3" y="276.3" width="6.8" height="3.7" class="f-accent"/>
  <rect x="505.0" y="276.1" width="6.8" height="3.9" class="f-accent"/>
  <rect x="512.8" y="276.6" width="6.8" height="3.4" class="f-accent"/>
  <rect x="520.5" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="528.3" y="278.3" width="6.8" height="1.7" class="f-accent"/>
  <rect x="536.0" y="278.8" width="6.8" height="1.2" class="f-accent"/>
  <rect x="543.8" y="278.4" width="6.8" height="1.6" class="f-accent"/>
  <rect x="551.5" y="279.2" width="6.8" height="0.8" class="f-accent"/>
  <rect x="559.3" y="279.0" width="6.8" height="1.0" class="f-accent"/>
  <rect x="567.0" y="279.3" width="6.8" height="0.7" class="f-accent"/>
  <rect x="574.8" y="279.4" width="6.8" height="0.6" class="f-accent"/>
  <rect x="582.5" y="279.6" width="6.8" height="0.4" class="f-accent"/>
  <rect x="590.3" y="279.2" width="6.8" height="0.8" class="f-accent"/>
  <rect x="598.0" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="605.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="613.5" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="621.3" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="629.0" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="636.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <line x1="40.0" y1="280.0" x2="660.0" y2="280.0" class="f-line"/>
  <line x1="180.3" y1="182.0" x2="450.0" y2="182.0" class="f-line"/>
  <line x1="180.3" y1="182.0" x2="180.3" y2="188.0" class="f-line"/>
  <line x1="450.0" y1="182.0" x2="450.0" y2="188.0" class="f-line"/>
  <text x="456.0" y="186.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">90%: 9.1 … 26.4</text>
  <line x1="294.2" y1="26.0" x2="294.2" y2="280.0" class="f-line" style="stroke-dasharray:4 3"/>
  <text x="290.2" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">published 16.4%</text>
  <text x="40.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <text x="117.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="195.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="272.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <text x="350.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">20</text>
  <text x="427.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <text x="505.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">30</text>
  <text x="582.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">35</text>
  <text x="660.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">40</text>
  <text x="350.0" y="314.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">basket price change, Nov 2021 → Nov 2022, %</text>
</svg>
<figcaption>Equal weights, unbroken shelves from figure 2. Brackets show where 90% of baskets land. 5 of 20,000 wide baskets fall outside the axis.</figcaption>
</figure>

If somebody's receipts say 25%, it is no proof that the official number is wrong. A small basket on random shelves gives that by chance.

## What I did not check

- Quantities. Real receipts have 3 packs of milk and 1 jar of coffee, my baskets have equal weights.
- Size changes. Items are defined by a size range, like 750 to 800 g. ONS adjusts for size changes. I only dropped flagged replacements, I did not look how often a pack shrank inside the range.
- The split into catch up and noise assumes the noise is the same in both directions. It is an assumption, I did not measure it. Unbroken shelves may also be a different kind of shelf, not just a cleaner one.
- The rest of the gap between 16.0% and 16.4%.
- Online shopping and discounters beyond what collectors visit. This is the UK and only food and drinks.
- The basket size of 15 is my choice.
