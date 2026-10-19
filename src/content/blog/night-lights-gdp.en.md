---
title: "From space, an oil county in North Dakota gives off 17 times more light than Manhattan"
description: "Annual VIIRS night lights summed over 3080 US counties against BEA county GDP from the December 2022 release: levels match at 0.92, growth only through oil fields, the national light series fell 9.5% to 2016 with no recession, and in 2020 ordinary counties dimmed less than their GDP."
date: 2022-12-20
lang: en
translationKey: night-lights-gdp
tags: ["open-data", "statistics"]
---
There is a picture of the Korean peninsula at night, with the South full of light and the North almost black. I have used it many times when someone asked whether satellite lights can measure an economy. It always worked in conversation. This year night lights came up again in economics. Luis Martinez published a paper that uses them to check how much autocracies inflate their GDP growth. I realized I had never looked at the numbers behind the picture. I only knew that lights and money go together. How well they go together I did not know.

So I took a place where the official numbers are good and checked the lights against them. On December 8 BEA published GDP by county for 2021. Others did this before me. Henderson, Storeygard and Weil built the method on countries in 2012. John Gibson did almost exactly this comparison for US counties in 2021, in a paper with his coauthor in Remote Sensing. I read their abstract and wanted to see the rest with my own eyes.

## The data

The lights are the annual VIIRS composites from the Colorado School of Mines, VNL version 2.1. It is the masked average radiance, with background and short lived lights like fires removed. The grid is 15 arc seconds, about 500 metres. For every county I summed the radiance over all its pixels, weighted by pixel area, since pixels get smaller towards the north. GDP is the BEA release from December 8, real GDP by county in chained 2012 dollars. Virginia reports some independent cities together with their counties, so I merged those shapes the same way. That leaves 3080 units in the 48 states and DC. Alaska and Hawaii I did not cut from the raster.

Before counting I wrote down what I expected. Levels will match well, a correlation of 0.8 or more. Growth will match weakly, under 0.3. Year to year changes will be close to noise. And in 2020 the lights will fall less than GDP or not at all, because people stayed home with the lights on.

<figure class="fig">
<svg viewBox="0 0 680 330" role="img" aria-label="Two density charts of 3080 US county units. Left, levels in 2019: total night light on a log scale against GDP on a log scale. The cells form a tight diagonal band, correlation 0.92. Manhattan sits at the top, far above the band, with high GDP and moderate light. McKenzie County, North Dakota, sits far to the right of it, with more light than Manhattan and a small GDP. Right, growth from 2013 to 2019: change in light against change in GDP. The cells form a wide cloud with only a weak tilt, correlation 0.33 for all counties and 0.12 without the 124 counties where mining is over 30% of GDP. The mining counties, marked in a different colour, spread far wider than the rest, most of all along the light axis.">
  <text x="86" y="20" class="f-label">level, 2019</text>
  <rect x="86" y="30" width="234" height="230" class="f-plain" style="fill:none"/>
  <line x1="125.0" y1="30" x2="125.0" y2="260" class="f-plain"/>
  <text x="125.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10¹</text>
  <line x1="164.0" y1="30" x2="164.0" y2="260" class="f-plain"/>
  <text x="164.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10²</text>
  <line x1="203.0" y1="30" x2="203.0" y2="260" class="f-plain"/>
  <text x="203.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10³</text>
  <line x1="242.0" y1="30" x2="242.0" y2="260" class="f-plain"/>
  <text x="242.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁴</text>
  <line x1="281.0" y1="30" x2="281.0" y2="260" class="f-plain"/>
  <text x="281.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁵</text>
  <line x1="86" y1="214.0" x2="320" y2="214.0" class="f-plain"/>
  <text x="81" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">$100M</text>
  <line x1="86" y1="168.0" x2="320" y2="168.0" class="f-plain"/>
  <text x="81" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">$1B</text>
  <line x1="86" y1="122.0" x2="320" y2="122.0" class="f-plain"/>
  <text x="81" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">$10B</text>
  <line x1="86" y1="76.0" x2="320" y2="76.0" class="f-plain"/>
  <text x="81" y="79.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">$100B</text>
  <rect x="207.9" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="232.3" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="233.2" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="198.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="198.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="223.5" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="203.0" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="203.0" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="188.4" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="212.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="223.5" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="188.4" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="228.3" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="188.4" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="242.0" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="243.0" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="246.9" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="237.1" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="227.4" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="218.6" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="246.9" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="203.0" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="223.5" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="178.6" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="173.8" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="183.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="173.8" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="207.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="251.8" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="125.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="193.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="183.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="242.0" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="188.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="189.3" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="285.9" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="165.0" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="266.4" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="266.4" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="251.8" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="193.3" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="261.5" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="222.5" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="139.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="188.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="189.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="232.3" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="242.0" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="203.0" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="198.1" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="164.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="237.1" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="222.5" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="188.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="164.0" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="149.4" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="150.3" y="209.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="178.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="179.6" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="199.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="188.4" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="189.3" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="178.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="179.6" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="115.3" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="169.8" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="164.0" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="149.4" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="203.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="129.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="198.1" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="246.9" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="242.0" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="212.8" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="246.9" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="256.6" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="173.8" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="261.5" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="251.8" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="271.3" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="242.0" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="173.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="160.1" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="183.5" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="164.0" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="154.3" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="155.2" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="173.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="174.7" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="164.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="159.1" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="207.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="256.6" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="222.5" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="227.4" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="154.3" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144.5" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="164.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="154.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="155.2" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="159.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="188.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="168.9" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="208.8" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="198.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="227.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="228.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="251.8" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="237.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="173.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="256.6" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="233.2" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="149.4" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="154.3" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="134.8" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="134.8" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="115.3" y="248.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="125.0" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="115.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="139.6" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="276.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="145.5" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="242.0" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="257.6" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="126.0" y="220.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="222.5" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="198.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="207.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="204.0" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="262.5" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="282.0" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="149.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="262.5" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="204.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="154.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="233.2" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="276.1" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="285.9" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="174.7" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="160.1" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="140.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="252.7" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="233.2" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="267.4" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="145.5" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="271.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="120.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <text x="203" y="290" text-anchor="middle" class="f-label f-muted">light (log)</text>
  <text x="90" y="42" class="f-label f-muted">GDP (log)</text>
  <text x="400" y="20" class="f-label">growth, 2013 → 2019</text>
  <rect x="400" y="30" width="260" height="230" class="f-plain" style="fill:none"/>
  <line x1="450.6" y1="30" x2="450.6" y2="260" class="f-plain"/>
  <text x="450.6" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">−60%</text>
  <line x1="530.0" y1="30" x2="530.0" y2="260" class="f-plain"/>
  <text x="530.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="609.4" y1="30" x2="609.4" y2="260" class="f-plain"/>
  <text x="609.4" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">+150%</text>
  <line x1="400" y1="223.3" x2="660" y2="223.3" class="f-plain"/>
  <text x="395" y="226.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">−40%</text>
  <line x1="400" y1="145.0" x2="660" y2="145.0" class="f-plain"/>
  <text x="395" y="148.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="400" y1="72.9" x2="660" y2="72.9" class="f-plain"/>
  <text x="395" y="75.9" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+60%</text>
  <rect x="524.6" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="551.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="540.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="546.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="519.2" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="547.3" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="557.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="540.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="540.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="541.9" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="535.4" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="536.5" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="536.5" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="524.6" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="536.5" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="525.7" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="530.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="519.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="492.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="536.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="513.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="514.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="513.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="514.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="540.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="486.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="541.9" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="504.0" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="493.2" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="497.5" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="508.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="519.2" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="502.9" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="557.1" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="54.1" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="508.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="134.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="551.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="525.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="541.9" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="551.7" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="513.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="530.0" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="535.4" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="595.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="497.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="567.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="569.0" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="237.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="551.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="562.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="514.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="508.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="519.2" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="502.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="520.3" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="498.6" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="509.4" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="254.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="567.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="530.0" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="531.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="502.9" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="486.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="497.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="30.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="486.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="530.0" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="531.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="502.9" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="551.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="552.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="574.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="584.2" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="519.2" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="639.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="632.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="611.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="470.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="471.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="497.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="498.6" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="498.6" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="486.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="498.6" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="481.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="595.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="492.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="519.2" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="567.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="35.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="563.6" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="215.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="552.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="541.9" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="530.0" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="238.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="590.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="601.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="481.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="401.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="634.0" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="601.5" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="444.4" y="249.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="579.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="611.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="437.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="632.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="584.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="65.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="643.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="427.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="487.8" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="605.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="470.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="476.9" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="225.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="567.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="578.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="590.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="573.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="411.9" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="574.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="639.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="627.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="482.3" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="459.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="448.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="41.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="650.3" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="612.3" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="558.2" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="562.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="487.8" y="232.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="459.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="220.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="509.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <text x="530" y="290" text-anchor="middle" class="f-label f-muted">change in light</text>
  <text x="404" y="42" class="f-label f-muted">change in GDP</text>
  <circle cx="233.7" cy="38.9" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="241.7" y="31.9" text-anchor="start" class="f-label">Manhattan</text>
  <circle cx="282.1" cy="136.2" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <line x1="282.1" y1="141.2" x2="282.1" y2="186.2" class="f-line" style="stroke:var(--accent);stroke-width:1"/>
  <text x="326.0" y="198.2" text-anchor="end" class="f-label">McKenzie</text>
  <rect x="60" y="306" width="12" height="12" class="f-ink" style="fill-opacity:0.45"/>
  <text x="80" y="316" class="f-label f-muted">other counties</text>
  <rect x="262" y="308" width="8" height="8" class="f-accent"/>
  <text x="278" y="316" class="f-label f-muted">mining &gt; 30% of GDP</text>
</svg>
<figcaption>Annual VIIRS composites (VNL v2.1) summed over each county, BEA real GDP from the release of December 8, 2022. Darker cells hold more counties. The right panel shows light from −78% to +348% and GDP from −53% to +112%, 30 counties fall outside.</figcaption>
</figure>

## Levels

For 2019 the correlation between log light and log GDP over 3080 counties is 0.92. The slope is 1.03, so 10% more light goes with about 10% more GDP. In 2013 and 2021 it is the same. In the middle 80% of counties GDP per unit of light differs about 4 times.

The pair at the extremes is what I would put in a talk instead of Korea. Manhattan produced $641 billion in 2019. McKenzie County in North Dakota produced $4.9 billion. McKenzie gives off 17 times more light in total, but it is also 120 times larger, so per square kilometre it is darker. Per dollar of GDP the difference is about 2300 times. McKenzie sits in the middle of the Bakken oil field. I assume most of that light is gas flares and lit drilling pads, but I did not separate them in the image.

The 124 counties where mining is more than 30% of GDP make 1.1% of the GDP in my sample in current dollars and 7.8% of the light. Not every mining county glows: the median one has about the same GDP per unit of light as an ordinary county. The light comes from a few giants in the Bakken and the Permian basin.

## Growth

Between 2013 and 2019 the correlation between the change in light and the change in GDP is 0.33, slightly above what I expected. Then I removed those 124 mining counties and it fell to 0.12. Most of the growth signal came from oil fields, where a boom means more flares and more money at the same time. In an ordinary county the light went up or down mostly on its own, at least at this scale.

A simpler test says the same. Whether a county grew faster than the median county, by light and by GDP, agreed in 54% of counties, a coin with a small bias. Year to year it is worse. For each pair of neighbouring years the correlation stays between −0.02 and 0.15.

Adding counties into states did not help me. Over 49 states the growth correlation is 0.10, while the levels still give 0.81. I expected the noise to average out at the state level but it did not.

## Where I was wrong about the series

Then I summed the light over the whole country. It fell for 3 years while GDP grew.

<figure class="fig">
<svg viewBox="0 0 680 320" role="img" aria-label="Line chart, index with 2013 at 100, years 2013 to 2021. Real GDP of the 3080 county units rises steadily to 115.2 in 2019, dips to 112.0 in 2020 and reaches 118.5 in 2021. Total night light falls from 100 to 90.5 in 2016, jumps to 98.1 in 2017, reaches 101.5 in 2019, falls to 97.2 in 2020 and returns to 101.2 in 2021. Light without the mining counties falls just as deep, to 90.6 in 2016, then stays lower, 97.5 in 2019 and 95.9 in 2020.">
  <line x1="60" y1="208.5" x2="640" y2="208.5" class="f-plain"/>
  <text x="54" y="212.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="60" y1="153.5" x2="640" y2="153.5" class="f-plain"/>
  <text x="54" y="157.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="98.5" x2="640" y2="98.5" class="f-plain"/>
  <text x="54" y="102.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <line x1="60" y1="43.5" x2="640" y2="43.5" class="f-plain"/>
  <text x="54" y="47.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="60.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2013</text>
  <text x="132.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2014</text>
  <text x="205.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2015</text>
  <text x="277.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="350.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="422.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="495.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="567.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="640.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <path d="M60.0,153.5L132.5,140.3L205.0,124.9L277.5,115.0L350.0,101.8L422.5,84.8L495.0,69.9L567.5,87.5L640.0,51.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <path d="M60.0,153.5L132.5,166.1L205.0,186.5L277.5,205.2L350.0,167.3L422.5,170.5L495.0,167.3L567.5,176.0L640.0,149.6" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <path d="M60.0,153.5L132.5,162.3L205.0,182.1L277.5,205.8L350.0,164.0L422.5,156.8L495.0,145.3L567.5,168.9L640.0,146.9" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="153.5" r="3" class="f-accent"/>
  <circle cx="132.5" cy="162.3" r="3" class="f-accent"/>
  <circle cx="205.0" cy="182.1" r="3" class="f-accent"/>
  <circle cx="277.5" cy="205.8" r="3" class="f-accent"/>
  <circle cx="350.0" cy="164.0" r="3" class="f-accent"/>
  <circle cx="422.5" cy="156.8" r="3" class="f-accent"/>
  <circle cx="495.0" cy="145.3" r="3" class="f-accent"/>
  <circle cx="567.5" cy="168.9" r="3" class="f-accent"/>
  <circle cx="640.0" cy="146.9" r="3" class="f-accent"/>
  <text x="283.5" y="221.8" class="f-mono f-ink" style="font-size:11px">90.5</text>
  <text x="636.0" y="43.8" text-anchor="end" class="f-mono f-ink" style="font-size:11px">118.5</text>
  <line x1="60" y1="274" x2="82" y2="274" style="stroke:var(--ink);stroke-width:2"/>
  <text x="90" y="278" class="f-label f-muted">GDP</text>
  <line x1="60" y1="292" x2="82" y2="292" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="90" y="296" class="f-label f-muted">light, all counties</text>
  <line x1="60" y1="310" x2="82" y2="310" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="90" y="314" class="f-label f-muted">light without mining counties</text>
</svg>
<figcaption>Sums over the same 3080 units, index 2013 = 100. Mining counties are those where mining made more than 30% of GDP in 2019.</figcaption>
</figure>

From 2013 to 2016 the total fell by 9.5%, while GDP grew by 7%. In 2017 it jumped almost back. 95.6% of counties became brighter in one year, with the median county up by 19%.

My first explanation was oil. Prices collapsed from mid 2014 to early 2016 and the 4 biggest Bakken counties lost about 38% of their light between 2014 and 2016. It fit nicely, so I checked it. It was wrong. Mining counties explain less than 5% of the national drop to 2016. The dashed line without them falls just as deep. Between 2013 and 2016 the light went down in 45 of 49 states. Among them were Vermont and Maryland, which have no oil at all. I do not know what caused it. It could be the processing of the composites or the sensor. I doubt any economy makes 95.6% of counties brighter in one year.

This also changed how I read 2020. Light fell by 4.2% and GDP by 2.8%, so the lights fell more than GDP, the opposite of what I expected. But 63% of that drop came from the mining counties, mostly the oil fields of Texas and North Dakota. There the light probably fell with flaring, when the oil price fell. Without them light fell by 1.7% and GDP by 2.8%. That is my expectation again, for ordinary counties. The median county was even 1.9% brighter in 2020, while Manhattan lost 8% of its light. But the same series fell by 9.5% to 2016 with no recession at all. A difference of one percentage point in it does not prove much.

## What it gives me

Lights tell which county is big quite well. For growth they mostly worked in oil counties, where the boom itself is visible as flares. For a country without honest statistics a level is still better than nothing. The Korean picture shows levels, but I used it in arguments about growth.

## What I did not check

I did not compare my numbers with the tables of the Gibson paper. BEA revises county GDP every year, so the next release will move single numbers. The raster I summed stores radiance rounded to whole units, so pixels fainter than half a unit are zero. How much light rural counties lose this way I did not check.

Gas flares stay in, although Colorado School of Mines publishes a separate flare catalogue. Population and area are not controlled for. The growth correlations are computed across counties, so a jump shared by all counties does not move them. Other units I did not try either. Cities or 10 km cells could behave differently from counties, whose borders were drawn long before anyone measured light.

2022 is not in the comparison, because its annual composite and its county GDP are not published yet.
