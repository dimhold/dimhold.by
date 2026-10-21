---
title: "From space, July 2012 in Illinois looked better than July 1990"
description: "July satellite indices from NOAA against corn yield in 12 Corn Belt states, 2000 to 2021, forecast only from earlier years: greenness cuts the error of a trend line by 10%, VHI with its thermal part by 21%, the USDA August forecast is still better. In 2012 Illinois July greenness was only 10th lowest of 41."
date: 2022-09-03
lang: en
translationKey: ndvi-corn-yield
tags: ["open-data", "statistics"]
---
The idea that a satellite can see the harvest before it happens sounds like plain physics to me. More green leaves mean more grain. I have nodded at it many times and never checked it myself. People did check it, of course. Felix Kogan at NOAA, who built the Vegetation Health indices, has published yield models on them for years. David Johnson at USDA compared MODIS greenness and temperature against county corn yields in 2014. What I wanted was smaller. How much does the satellite add over a plain trend line if it is not allowed to look into the future? And how does it stand next to the forecast USDA publishes at the same moment?

## The data

NOAA STAR Vegetation Health publishes a weekly series for every US state, averaged over cropland only, since 1982. It has smoothed NDVI, which is the greenness. On top of it there are 3 indices: VCI for the green part, TCI for the thermal part and VHI that mixes both. Until 2012 the series comes from AVHRR satellites, from 2013 from VIIRS.

USDA NASS Quick Stats has the final corn yield for every state and year in bushels per acre. It also keeps the forecasts NASS published during the season. The August forecast is based on conditions on August 1 and comes out around August 10, at the same time as my July satellite data, so this is the forecast to compare with and not the final number that arrives in January.

I took the 12 Corn Belt states, from Illinois and Iowa to the Dakotas and Kansas, years 1982 to 2021. 2022 is not in it, because the final number for this year comes only in January. That is 480 state years. The scripts are about 130 lines of Python with pandas and numpy.

Before counting anything I wrote down what I expected. The raw correlation will be visible, around 0.4 or more. Out of sample the satellite will beat a trend line by 15 to 35%. NASS in August will still be better. And almost all of the gain will come from 2012, the drought year, while in normal years the satellite adds nearly nothing.

## The raw correlation is mostly the calendar

If you put July greenness against yield for all 480 state years, the correlation is 0.33. Between the year and the yield it is 0.71. In 11 of the 12 states the corn yield grows by about 2 bushels per acre every year. Kansas is the exception, only 0.26 bushels a year. Any feature that drifts in time gets part of that growth for free. Differences between states add more: Iowa is greener and yields more than North Dakota, which says nothing about a bad July in Iowa.

So the question has to be smaller. Take the yield trend of each state. Does July greenness tell how far this year falls above or below that line?

Every forecast uses only the past. For a year Y the trend and the coefficient are fitted on the years before Y. Then year Y is predicted for all 12 states at once. Features are averages over weeks 27 to 30, which is roughly July, so all of it is known before the NASS August report. Test years are 2000 to 2021, 264 state years.

## What it gave

Error is RMSE in bushels per acre, over the same 264 state years.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Horizontal bars of forecast error, RMSE in bushels per acre, for corn yield in 12 Corn Belt states, 2000 to 2021, 264 state years, each forecast made only from earlier years: state trend only 16.4, NDVI (greenness) 14.8, VCI (green part) 14.6, TCI (thermal part) 14.0, VHI (green + thermal) 13.0, NASS August forecast 9.5. The satellite indices are all better than the trend and all worse than the NASS August forecast. VHI is the best of them.">
  <line x1="210.0" y1="6" x2="210.0" y2="206" class="f-plain"/>
  <text x="210.0" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="318.3" y1="6" x2="318.3" y2="206" class="f-plain"/>
  <text x="318.3" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <line x1="426.7" y1="6" x2="426.7" y2="206" class="f-plain"/>
  <text x="426.7" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="535.0" y1="6" x2="535.0" y2="206" class="f-plain"/>
  <text x="535.0" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="200" y="25" text-anchor="end" class="f-label">state trend only</text>
  <rect x="210" y="10" width="356.2" height="22" class="f-ink" style="fill-opacity:0.35"/>
  <text x="572.2" y="25" class="f-mono f-ink" style="font-size:12px">16.4</text>
  <text x="200" y="59" text-anchor="end" class="f-label">NDVI (greenness)</text>
  <rect x="210" y="44" width="320.1" height="22" class="f-accent" style="fill-opacity:0.6"/>
  <text x="536.1" y="59" class="f-mono f-ink" style="font-size:12px">14.8</text>
  <text x="200" y="93" text-anchor="end" class="f-label">VCI (green part)</text>
  <rect x="210" y="78" width="316.3" height="22" class="f-accent" style="fill-opacity:0.6"/>
  <text x="532.3" y="93" class="f-mono f-ink" style="font-size:12px">14.6</text>
  <text x="200" y="127" text-anchor="end" class="f-label">TCI (thermal part)</text>
  <rect x="210" y="112" width="303.1" height="22" class="f-accent" style="fill-opacity:0.6"/>
  <text x="519.1" y="127" class="f-mono f-ink" style="font-size:12px">14.0</text>
  <text x="200" y="161" text-anchor="end" class="f-label">VHI (green + thermal)</text>
  <rect x="210" y="146" width="280.6" height="22" class="f-accent" style="fill-opacity:1"/>
  <text x="496.6" y="161" class="f-mono f-ink" style="font-size:12px">13.0</text>
  <text x="200" y="195" text-anchor="end" class="f-label">NASS August forecast</text>
  <rect x="210" y="180" width="204.9" height="22" class="f-ink" style="fill-opacity:0.35"/>
  <text x="420.9" y="195" class="f-mono f-ink" style="font-size:12px">9.5</text>
  <text x="405" y="242" text-anchor="middle" class="f-label f-muted">RMSE, bushels per acre (lower is better)</text>
</svg>
<figcaption>Satellite features are averages of weeks 27 to 30. The NASS forecast is published around August 10.</figcaption>
</figure>

A trend alone misses by 16.4. Plain greenness improves it to 14.8, which is 10%. VHI improves it to 13.0, which is 21%. It beats the trend in 19 of the 22 years. With a bootstrap over whole years the gain of VHI is between 13 and 26%, of greenness between 5 and 15%. NASS in August misses by 9.5, so the USDA survey is clearly ahead. But not every year: in 7 of the 22 years VHI was closer than NASS.

The split surprised me more than the total. The green index VCI gives 11% and the thermal TCI gives 15%. Greenness alone was the weakest of the 4 satellite features. VHI got its gain only with the thermal part added.

## 2012

Over the 12 states the 2012 yield fell 36.9 bushels below the trend on average. VHI predicted 11.5, about a third of the real drop. The RMSE of NASS in August over these 12 states was 10.3. In Illinois the yield was 105, the trend said 173, VHI said 159 and NASS in August said 116.

Then I looked at Illinois week by week. Here I made a mistake that almost became the title of this post. My first comparison said that July 2012 had a greenness of 0.492 and an average July of 2000 to 2011 had 0.490. It looked as green as usual in the worst year. I liked that result a lot. Then I drew the range of the earlier years and it went down to minus 1. NOAA writes minus 1 for a missing week. In Illinois 2004 has 8 of them between May and September. My baseline had averaged them in as real values. The main model dropped them. The quick script I wrote for this chart did not.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Weekly smoothed NDVI of Illinois cropland, weeks 18 to 40. A grey band shows the range of 2000 to 2011 and a dashed line their median, which rises from 0.28 in week 18 to a peak of 0.55 in week 31. The 2012 line rises about 2 weeks earlier, crosses the median around week 26 and then stays flat near 0.49 until week 32 before falling. The July window, weeks 27 to 30, is marked. Over it 2012 averages 0.492 against 0.523 for the earlier years.">
  <rect x="285.5" y="16" width="108.0" height="204" style="fill:var(--accent-wash)"/>
  <text x="339.5" y="214" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">July window</text>
  <line x1="56" y1="190.9" x2="650" y2="190.9" class="f-plain"/>
  <text x="50" y="194.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.3</text>
  <line x1="56" y1="132.6" x2="650" y2="132.6" class="f-plain"/>
  <text x="50" y="136.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.4</text>
  <line x1="56" y1="74.3" x2="650" y2="74.3" class="f-plain"/>
  <text x="50" y="78.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.6</text>
  <text x="56" y="12" class="f-label f-muted">NDVI</text>
  <text x="56.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">18</text>
  <text x="164.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">22</text>
  <text x="272.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">26</text>
  <text x="380.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="488.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">34</text>
  <text x="596.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">38</text>
  <text x="650.0" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="353" y="252" text-anchor="middle" class="f-label f-muted">week of the year</text>
  <path d="M56.0,187.4L83.0,179.8L110.0,170.5L137.0,159.4L164.0,143.6L191.0,124.4L218.0,102.3L245.0,49.2L272.0,47.5L299.0,46.3L326.0,44.0L353.0,38.1L380.0,37.0L407.0,35.2L434.0,34.1L461.0,35.8L488.0,39.9L515.0,48.1L542.0,60.3L569.0,76.0L596.0,95.3L623.0,118.0L650.0,138.4L650.0,206.0L623.0,183.9L596.0,161.1L569.0,137.8L542.0,117.4L515.0,97.0L488.0,80.7L461.0,70.2L434.0,69.0L407.0,70.2L380.0,73.7L353.0,83.0L326.0,95.9L299.0,109.8L272.0,123.8L245.0,137.2L218.0,150.1L191.0,161.7L164.0,171.0L137.0,182.7L110.0,197.3L83.0,203.7L56.0,213.0Z" style="fill:var(--muted);fill-opacity:0.18;stroke:none"/>
  <path d="M56.0,201.9L83.0,191.4L110.0,183.3L137.0,172.8L164.0,157.6L191.0,141.3L218.0,120.9L245.0,102.3L272.0,87.1L299.0,74.3L326.0,62.6L353.0,54.5L380.0,46.3L407.0,45.1L434.0,49.8L461.0,52.1L488.0,63.8L515.0,78.9L542.0,96.4L569.0,115.1L596.0,134.9L623.0,154.7L650.0,174.5" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <path d="M56.0,184.4L83.0,176.3L110.0,168.1L137.0,160.0L164.0,132.6L191.0,119.2L218.0,105.8L245.0,94.7L272.0,87.1L299.0,80.7L326.0,78.9L353.0,78.4L380.0,76.6L407.0,77.2L434.0,80.7L461.0,87.1L488.0,94.1L515.0,102.3L542.0,113.3L569.0,125.6L596.0,139.6L623.0,154.1L650.0,171.6" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <line x1="56" y1="270" x2="78" y2="270" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="86" y="274" class="f-label f-muted">2012</text>
  <line x1="56" y1="288" x2="78" y2="288" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="292" class="f-label f-muted">median 2000–2011</text>
  <rect x="56" y="300" width="22" height="12" style="fill:var(--muted);fill-opacity:0.18"/>
  <text x="86" y="310" class="f-label f-muted">range 2000–2011</text>
</svg>
<figcaption>NOAA STAR VHP, smoothed NDVI averaged over Illinois cropland. The shaded column is the July window used in the forecast.</figcaption>
</figure>

With the missing weeks removed, the average July is 0.523 and 2012 is 0.492. So it was paler, but not by much. In May the fields were up to 2 weeks ahead of the median and by late June the lead was gone. Then they stopped near 0.49, while a normal year continues to about 0.55. Among 41 Julys since 1982 this one is 10th from the bottom, while the yield was about 40% below the trend. July 1990 was paler, at 0.460. Illinois harvested 2.6 bushels above its trend that year, counting the trend over all 40 years. 1996 and 1989 were also paler and ended near the trend. 1988 was paler too and fell 47 bushels below it.

VHI over the same weeks was 25 against a normal 58. Only 1988, the other big drought, had a lower July VHI in Illinois among the 40 years.

So my expectation was wrong twice. In 2012 greenness improved the trend by only 9%, about as much as in an average year. And the total gain does not depend on 2012. Without it VHI still improves the trend by 19%.

## What I did not check

The mask is all cropland of the state, not corn fields. In Kansas and the Dakotas a big part of it is wheat and pasture. County data with a corn mask would probably do better. I did not try it.

VCI and TCI are scaled by the minimum and maximum of a long record. VHI is built from them. Which years go into that record I did not find in the NOAA documentation. If the record includes years after the one I predict, the indices know a bit of the future. Plain NDVI has no such scaling and still gives 10%, but how much of the rest is this leak I did not measure. The smoothing of NDVI itself probably uses neighbouring weeks too, including a few after July.

NOAA serves a reprocessed series now. Its July greenness over the 12 states is 0.487 on average in 2003 to 2012 on AVHRR and 0.490 in 2013 to 2021 on VIIRS. I see no jump at the sensor change, but the values served in older years could differ in details.

I chose the window of weeks before counting. Other windows give from 13% for June to 21% for late July and early August, so the choice did not create the result. Still, July came out the best, by 0.2 points over late July and early August. Each model is one line per feature, without weather data. More features would probably close part of the gap to NASS.

A prediction for 2022 I did not make, because the final yield to check it against comes only in January.
