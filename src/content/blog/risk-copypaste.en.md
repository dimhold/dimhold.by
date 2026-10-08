---
title: "Companies copy their risk factors. Only 15% of the 2026 text was already there in 2016"
description: "I cut the Risk Factors section out of 11 years of 10-K reports of 500 random US companies. Year to year 75% of it is copied word for word, but only 15% of the 2026 text was already there in 2016. COVID still sits in 37% of the sections, LIBOR in 1%."
date: 2026-10-08
lang: en
translationKey: risk-copypaste
tags: ["open-data", "text", "statistics"]
---
Every 10-K has a section called Item 1A, Risk Factors. It lists everything that could hurt the company. The usual story is that it gets written once and then copied forward every year with the date changed. I have repeated that story myself and I never checked it.

In the Benford piece I only looked at the numbers of a 10-K. The text is free on EDGAR too. Before counting I wrote down my guess: at least 80% of the section copied word for word from the year before. And about a quarter of the 2026 text still standing from 2016.

## The setup

I took the quarterly EDGAR indexes for 2016 to 8 October 2026. From them I kept the companies that filed a 10-K, without amendments, in each of 11 years. That is 2930 of the 13168 companies that filed one at all. I drew 500 of them at random, downloaded the main document of each 10-K and cut out Item 1A. The year is the year of filing, so the 2026 report describes 2025.

Cutting turned out to be the slow part. Headings come split by a tag in the middle of a word, "RIS K FACTORS" or "I TEM 1A". I rewrote the regular expressions twice and downloaded the reports with short sections again after each fix. In the end 4752 of 5500 reports gave a section of at least 500 words. Everything is Python 3.12 with the standard library.

The unit is the sentence, lowercased, with sentences shorter than 5 words thrown away. The copied share of a year is the share of its words standing in sentences that were in last year's section exactly.

## 75%, but almost nobody copies everything

Across 4300 pairs of neighbouring years the median copied share is 75.0%. So my 80% was a bit high, but the direction was right. What surprised me was the other end. Only 8.9% of pairs are copied at 90% or more and only 0.4% at 99%.

Here my measure was too strict. Universal Health Realty Income Trust has this sentence in all 11 of its reports, including the one filed on 25 February 2026:

> Beginning in Federal Fiscal Year (FFY) 2015, hospitals that rank in the worst 25% of all hospitals nationally for hospital acquired conditions in the previous year will receive reduced Medicare reimbursements.

The sentence after it stood there all 11 years as well. But in 2019 "The ACA also prohibits" became "The Legislation also prohibits" and for an exact match it is a new sentence from then on. I counted near copies for the last pair of years. Of 47259 new sentences in the 2026 reports, 21.2% are a sentence from 2025 with at most 2 words changed. Over all pairs and counted by runs of 8 words instead of whole sentences, the copied share is 84.6%.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Top: a sentence from the Risk Factors of Universal Health Realty Income Trust in the reports of 2018 and 2019, the only difference is &quot;ACA&quot; replaced by &quot;Legislation&quot;. An exact sentence match counts it as new. Bottom: of 47259 sentences in the 2026 reports that were not in the 2025 report exactly, 21.2% are a 2025 sentence with at most 2 words changed.">
  <text x="10" y="16" class="f-label f-muted">the same sentence by an exact match and with up to 2 words changed</text>
  <text x="10" y="50" class="f-label f-muted">2018</text>
  <rect x="80.2" y="37" width="29.4" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="50" class="f-mono f-ink">The</text>
  <text x="83.2" y="50" class="f-mono f-accent">ACA</text>
  <text x="114.4" y="50" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="10" y="80" class="f-label f-muted">2019</text>
  <rect x="80.2" y="67" width="91.8" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="80" class="f-mono f-ink">The</text>
  <text x="83.2" y="80" class="f-mono f-accent">Legislation</text>
  <text x="176.8" y="80" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="52" y="122" class="f-label f-ink">✗ exact match: new sentence</text>
  <text x="52" y="142" class="f-label f-accent">✓ up to 2 words changed: the same sentence</text>
  <text x="52" y="188" class="f-label f-muted">new sentences in the 2026 reports, 47259</text>
  <rect x="52" y="200" width="118.5" height="30" style="fill:var(--accent)"/>
  <rect x="170.5" y="200" width="439.5" height="30" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="52" y="248" class="f-label f-accent">21.2% last year's with 1 or 2 words changed</text>
  <text x="610" y="248" text-anchor="end" class="f-label f-muted">78.8% the rest</text>
</svg>
<figcaption>Word level edit distance at most 2 against any sentence of the same company's 2025 section, 441 companies.</figcaption>
</figure>

## What is left of 2016

My second expectation was wrong by more. I took the 417 companies with a section in all 11 years. In their 2026 text the median share that stood word for word in 2016 is 15.4%, not 25%. Counted by runs of 8 words it is 28.6%. The 2016 text loses almost a quarter of its words in the first year and then goes slower. By 2026 21.9% of it is still there. In the 2026 text it is a smaller share, 15.4%, because the section grew by about a third.

Each year the median company deletes between 19% and 26% of last year's text and adds a bit more. The median length for the same 417 companies was 7933 words in 2016 and 11185 in 2026. 84.9% of them got longer.

<figure class="fig">
<svg viewBox="0 0 640 340" role="img" aria-label="Stacked bars for every filing year from 2016 to 2026, each bar is the Risk Factors section of the same 417 companies split by the year a sentence appeared and stayed. The part standing every year since 2016 shrinks from 100% in 2016 to 71% in 2017, 30% in 2021 and 17% in 2026. The part new in that year is 29% in 2017, 33% in 2021 and 27% in 2026. Median length grows from 7933 words to 11185.">
  <text x="10" y="16" class="f-label f-muted">where the words of each year's section come from, average of 417 companies</text>
  <rect x="104" y="30" width="14" height="10" style="fill:var(--accent)"/><text x="124" y="39" class="f-label f-ink">stands every year since 2016</text>
  <rect x="104" y="44" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="124" y="53" class="f-label f-ink">added later, kept since</text>
  <rect x="104" y="58" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="124" y="67" class="f-label f-ink">new that year</text>
  <text x="98" y="294" text-anchor="end" class="f-label f-muted">0%</text>
  <text x="98" y="194" text-anchor="end" class="f-label f-muted">50%</text>
  <text x="98" y="94" text-anchor="end" class="f-label f-muted">100%</text>
  <rect x="108.0" y="90.0" width="39.8" height="200.0" style="fill:var(--accent)"/>
  <text x="127.9" y="306" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="127.9" y="322" text-anchor="middle" class="f-label f-muted">7933</text>
  <rect x="155.8" y="147.1" width="39.8" height="142.9" style="fill:var(--accent)"/>
  <rect x="155.8" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="175.7" y="143.1" text-anchor="middle" class="f-label f-ink">71%</text>
  <text x="175.7" y="306" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="175.7" y="322" text-anchor="middle" class="f-label f-muted">8293</text>
  <rect x="203.6" y="176.7" width="39.8" height="113.3" style="fill:var(--accent)"/>
  <rect x="203.6" y="147.5" width="39.8" height="29.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="203.6" y="90.0" width="39.8" height="57.5" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="223.5" y="172.7" text-anchor="middle" class="f-label f-ink">57%</text>
  <text x="223.5" y="306" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="223.5" y="322" text-anchor="middle" class="f-label f-muted">8497</text>
  <rect x="251.5" y="197.0" width="39.8" height="93.0" style="fill:var(--accent)"/>
  <rect x="251.5" y="147.1" width="39.8" height="49.9" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="251.5" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="271.4" y="193.0" text-anchor="middle" class="f-label f-ink">46%</text>
  <text x="271.4" y="306" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="271.4" y="322" text-anchor="middle" class="f-label f-muted">8881</text>
  <rect x="299.3" y="213.5" width="39.8" height="76.5" style="fill:var(--accent)"/>
  <rect x="299.3" y="149.4" width="39.8" height="64.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="299.3" y="90.0" width="39.8" height="59.4" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="319.2" y="209.5" text-anchor="middle" class="f-label f-ink">38%</text>
  <text x="319.2" y="306" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="319.2" y="322" text-anchor="middle" class="f-label f-muted">9314</text>
  <rect x="347.1" y="229.3" width="39.8" height="60.7" style="fill:var(--accent)"/>
  <rect x="347.1" y="156.8" width="39.8" height="72.4" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="347.1" y="90.0" width="39.8" height="66.8" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="367.0" y="225.3" text-anchor="middle" class="f-label f-ink">30%</text>
  <text x="367.0" y="306" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="367.0" y="322" text-anchor="middle" class="f-label f-muted">10040</text>
  <rect x="394.9" y="236.0" width="39.8" height="54.0" style="fill:var(--accent)"/>
  <rect x="394.9" y="146.0" width="39.8" height="90.0" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="394.9" y="90.0" width="39.8" height="56.0" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="414.8" y="232.0" text-anchor="middle" class="f-label f-ink">27%</text>
  <text x="414.8" y="306" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="414.8" y="322" text-anchor="middle" class="f-label f-muted">10324</text>
  <rect x="442.7" y="241.4" width="39.8" height="48.6" style="fill:var(--accent)"/>
  <rect x="442.7" y="144.2" width="39.8" height="97.2" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="442.7" y="90.0" width="39.8" height="54.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="462.6" y="237.4" text-anchor="middle" class="f-label f-ink">24%</text>
  <text x="462.6" y="306" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="462.6" y="322" text-anchor="middle" class="f-label f-muted">10455</text>
  <rect x="490.5" y="245.8" width="39.8" height="44.2" style="fill:var(--accent)"/>
  <rect x="490.5" y="142.2" width="39.8" height="103.6" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="490.5" y="90.0" width="39.8" height="52.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="510.5" y="241.8" text-anchor="middle" class="f-label f-ink">22%</text>
  <text x="510.5" y="306" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="510.5" y="322" text-anchor="middle" class="f-label f-muted">10701</text>
  <rect x="538.4" y="250.5" width="39.8" height="39.5" style="fill:var(--accent)"/>
  <rect x="538.4" y="139.2" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="538.4" y="90.0" width="39.8" height="49.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="558.3" y="246.5" text-anchor="middle" class="f-label f-ink">20%</text>
  <text x="558.3" y="306" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="558.3" y="322" text-anchor="middle" class="f-label f-muted">10760</text>
  <rect x="586.2" y="255.3" width="39.8" height="34.7" style="fill:var(--accent)"/>
  <rect x="586.2" y="144.1" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="586.2" y="90.0" width="39.8" height="54.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="606.1" y="251.3" text-anchor="middle" class="f-label f-ink">17%</text>
  <text x="606.1" y="306" text-anchor="middle" class="f-label f-muted">2026</text>
  <text x="606.1" y="322" text-anchor="middle" class="f-label f-muted">11185</text>
  <text x="98" y="322" text-anchor="end" class="f-label f-muted">median words</text>
</svg>
<figcaption>Share of words, averaged over companies. A sentence belongs to the year since which it stands in every report without a break; one exact change makes it new again. The year is the year of filing.</figcaption>
</figure>

The figure counts a bit differently. A sentence keeps its year only while it stands in every report without a break and the shares are averages. That is why its 2026 bar shows 17%.

The least copied year is 2021, with 69.2%. Those reports describe 2020, the first COVID year. They are also the first after the SEC amended Item 105 of Regulation S-K on 9 November 2020. It asked companies to put generic risks at the end, under the heading "General Risk Factors". That heading stands on its own line in 19.5% of all sections in 2021 against 0.2% a year before. My measure ignores the order of sentences, so moved text still counts as copied. But in 2021 the median company deleted 25.9% of last year's text, more than in any other year. The median length still went from 9314 words to 10040.

## Words with a date

To see what is eternal I counted a few words that have a date attached.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Line chart of the share of companies whose Risk Factors section mentions a word, by filing year from 2016 to 2026. COVID: 2016 0.0%, 2020 52.3%, 2021 98.8%, 2023 90.6%, 2024 66.9%, 2026 37.1%; LIBOR: 2016 4.0%, 2020 39.3%, 2021 36.9%, 2023 26.1%, 2024 6.6%, 2026 1.4%; artificial intelligence: 2016 0.0%, 2020 3.0%, 2021 3.7%, 2023 8.5%, 2024 32.0%, 2026 64.9%; tariff: 2016 27.0%, 2020 52.3%, 2021 52.0%, 2023 51.8%, 2024 52.5%, 2026 83.3%.">
  <text x="10" y="16" class="f-label f-muted">share of companies whose section mentions the word</text>
  <line x1="50" y1="250" x2="420" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="254" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="50" y1="200" x2="420" y2="200" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="204" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="50" y1="150" x2="420" y2="150" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="154" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="50" y1="100" x2="420" y2="100" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="104" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="50" y1="50" x2="420" y2="50" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="54" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="50" y="268" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="124" y="268" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="198" y="268" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="272" y="268" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="346" y="268" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="420" y="268" text-anchor="middle" class="f-label f-muted">2026</text>
  <path d="M50.0,250.0 L87.0,250.0 L124.0,250.0 L161.0,250.0 L198.0,145.3 L235.0,52.3 L272.0,53.2 L309.0,68.8 L346.0,116.2 L383.0,150.7 L420.0,175.8" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="428" y="179.8" class="f-label f-accent">COVID 37%</text>
  <path d="M50.0,242.0 L87.0,241.6 L124.0,235.9 L161.0,200.9 L198.0,171.5 L235.0,176.2 L272.0,178.6 L309.0,197.7 L346.0,236.8 L383.0,245.5 L420.0,247.3" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <text x="428" y="251.3" class="f-label f-ink">LIBOR 1%</text>
  <path d="M50.0,250.0 L87.0,249.1 L124.0,246.7 L161.0,244.8 L198.0,243.9 L235.0,242.6 L272.0,240.3 L309.0,233.0 L346.0,186.1 L383.0,145.2 L420.0,120.1" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="6 4"/>
  <text x="428" y="124.1" class="f-label f-ink">artificial intelligence 65%</text>
  <path d="M50.0,196.0 L87.0,184.9 L124.0,181.3 L161.0,154.7 L198.0,145.3 L235.0,146.1 L272.0,146.3 L309.0,146.3 L346.0,145.0 L383.0,104.9 L420.0,83.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.5" opacity="0.5" stroke-dasharray="2 3"/>
  <text x="428" y="87.5" class="f-label f-ink">tariff 83%</text>
  <circle cx="235.0" cy="52.3" r="3.5" style="fill:var(--accent)"/>
  <text x="235.0" y="44.3" text-anchor="middle" class="f-label f-accent">99%</text>
  <circle cx="198.0" cy="171.5" r="3.5" class="f-ink" style="fill:currentColor"/>
  <text x="198.0" y="163.5" text-anchor="middle" class="f-label f-ink">39%</text>
</svg>
<figcaption>Of the companies with a section of at least 500 words in that year, 424 to 442 per year. A mention is any match of the word, also in history or in an example.</figcaption>
</figure>

COVID is in 98.8% of the sections filed in 2021 and in 37.1% in 2026. Of the 426 companies that mentioned it in 2021, 160 still do. I read 40 random 2026 sentences with it by hand. 20 talk about it as history, 11 use it only as an example ("such as COVID-19") and 9 still treat it as a live risk. Of all 325 such sentences in 2026, 52 stood word for word in the 2022 report. Ceres Orion is a futures fund, formerly called Orion Futures Fund. It put this line in its 10-K on 30 March 2020 and it is still there on 20 March 2026:

> The continuing spread of a new strain of coronavirus, which causes the viral disease known as COVID-19, may adversely affect our investments and operations.

LIBOR went differently. The last USD LIBOR panel rates were published on 30 June 2023. Of the 159 companies that mentioned LIBOR in 2021 only 5 still do in 2026. My guess is that a hard date matters. LIBOR had one. A pandemic gives a risk section nothing like it. New words get in fast. "Artificial intelligence" went from 3.7% in 2021 to 64.9% in 2026, tariffs from 52.5% in 2024 to 83.3%.

At the level of a whole sentence companies mostly copy themselves. The median share of the 2026 text in sentences that some other company of the 500 also has is 2.1%. The most common of them are headings like "Risks related to our business".

## What I did not check

I did not touch stock returns. That is the "Lazy Prices" paper by Lauren Cohen and coauthors (2020), which found that companies that change this text later have lower returns. Travis Dyer and coauthors (2017) showed the growth in length and stickiness of 10-K text for 1996 to 2013. My numbers are a repeat on fresh years with one question, how long a sentence lives.

The sample is the survivors, companies that filed every year for 11 years. Young companies may rewrite more, I did not measure them. Both measures compare exact text, so a paraphrase counts as new. A word in the section is not a risk either. And 40 sentences read by hand is a small sample. 203 reports I could not cut at all. They are not random, these are unusual layouts, some with a cross reference table instead of the section.
