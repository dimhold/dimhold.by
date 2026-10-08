---
title: "Benford's law flags 84% of the 2025 annual reports. A perfectly honest source would get 60%"
description: "I ran Nigrini's first digit screen over 5399 annual reports filed with the SEC in 2025. It calls 83.9% of them nonconforming. An honest Benford source of the same sizes would get 60.3%. The flag did not point at later error corrections. To catch 60% of reports 70% of their numbers had to be invented."
date: 2026-10-08
lang: en
translationKey: benford-screen
tags: ["statistics", "open-data", "numbers"]
---
Benford's law is the fraud screen everybody near finance software has heard of. In real numbers the first digit is 1 about 30% of the time and 9 less than 5%. People who invent numbers do not reproduce that, so the histogram is supposed to point at the liar.

In 2013 I ran it on the git history of express, where nobody has a reason to fake anything. Of 4 columns, 3 failed. I blamed the data, those columns span too few orders of magnitude. Dollar amounts in an annual report span many, so there the screen should be at home. I also noted that MAD never asks how many rows produced it and left open how much faking it takes to be noticed. I never went back to either question.

So I took every annual report filed with the SEC in 2025 and ran it.

## The setup

The SEC publishes the XBRL numbers of all filings as quarterly archives, the Financial Statement Data Sets. On 8 October 2026 I took every 10-K filed in 2025, without amendments: 5530 reports. From each one I kept the values in US dollars, without segment breakdowns, at least 10 in absolute value and with exact repeats of a tag in the same period dropped. Reports with fewer than 50 such numbers were dropped, 5399 stayed.

The score is the one from Mark Nigrini's book: the mean absolute deviation (MAD) of the 9 first digit shares from Benford. His thresholds for the first digit are 0.006, 0.012 and 0.015. Above 0.015 a set of numbers "does not conform". The counting is Python 3.12 with numpy 2.5.

This is not a new idea. Klaus Henselmann and coauthors ran it on S&P 500 XBRL filings for 2010. In 2015 Dan Amiram and coauthors found their first digit score higher before SEC enforcement actions. In 2022 Stephen Walker answered that it predicts misstatements worse than the F-score or plain sales growth. I wanted to see it on fresh data.

## 1 million numbers and 5399 reports

All 1 116 430 numbers together are almost a textbook. The digit 1 starts 30.35% of them, Benford says 30.10%. The MAD of the whole pile is 0.00074.

Scored one by one, 2 reports were "close conformity", 289 "acceptable", 580 "marginal" and 4528 "nonconforming". That is 83.9% of the 5399 reports.

My first reaction was that the market is full of fiction, which is obviously wrong. The second was that the median report has only 210 numbers. If you draw 210 digits from a perfect Benford source, the shares will wobble and MAD measures exactly the wobble. I simulated it, 4000 draws for every report size.

<figure class="fig">
<svg viewBox="0 0 640 360" role="img" aria-label="Line chart. A perfect Benford source drawn 4000 times for each sample size from 50 to 1000 numbers. Its median MAD falls from 0.0328 at 50 numbers to 0.0158 at 210 and 0.0073 at 1000, and goes below Nigrini's nonconformity line of 0.015 at about 240 numbers. Below the chart a histogram of the 2025 10-K reports by count of numbers: the middle half of them has between 146 and 256 numbers, mostly left of the crossing.">
  <text x="10" y="16" class="f-label f-muted">MAD of a perfect Benford source by the size of the sample</text>
  <line x1="64" y1="230" x2="610" y2="230" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="234" text-anchor="end" class="f-label f-muted">0.00</text>
  <line x1="64" y1="166.66666666666666" x2="610" y2="166.66666666666666" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="170.66666666666666" text-anchor="end" class="f-label f-muted">0.02</text>
  <line x1="64" y1="103.33333333333331" x2="610" y2="103.33333333333331" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="107.33333333333331" text-anchor="end" class="f-label f-muted">0.04</text>
  <line x1="64" y1="40" x2="610" y2="40" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="56" y="44" text-anchor="end" class="f-label f-muted">0.06</text>
  <path d="M64.0,47.8 L69.7,67.0 L75.5,77.4 L81.2,86.8 L87.0,94.1 L92.7,101.1 L98.5,107.0 L104.2,111.5 L110.0,117.1 L115.7,123.2 L121.5,123.9 L127.2,126.6 L133.0,130.5 L138.7,133.7 L144.5,138.1 L150.2,138.4 L156.0,141.9 L161.7,143.6 L167.5,147.0 L173.2,146.4 L178.9,148.9 L184.7,151.1 L190.4,152.1 L196.2,153.2 L201.9,155.0 L207.7,156.8 L213.4,157.6 L219.2,158.0 L224.9,158.9 L230.7,160.2 L236.4,162.5 L242.2,162.3 L247.9,163.0 L253.7,165.3 L259.4,165.2 L265.2,166.1 L270.9,167.0 L276.7,168.4 L282.4,169.3 L288.1,167.5 L293.9,168.7 L299.6,170.3 L305.4,170.1 L311.1,171.1 L316.9,172.8 L322.6,172.5 L328.4,173.0 L334.1,173.8 L339.9,173.7 L345.6,174.4 L351.4,174.2 L357.1,174.9 L362.9,175.9 L368.6,175.7 L374.4,177.5 L380.1,177.3 L385.9,177.0 L391.6,178.0 L397.3,179.2 L403.1,178.6 L408.8,179.7 L414.6,180.5 L420.3,180.4 L426.1,180.2 L431.8,180.6 L437.6,182.1 L443.3,182.7 L449.1,182.4 L454.8,182.0 L460.6,183.4 L466.3,182.8 L472.1,182.7 L477.8,184.3 L483.6,184.1 L489.3,184.4 L495.1,185.5 L500.8,185.8 L506.5,185.7 L512.3,184.9 L518.0,185.3 L523.8,185.3 L529.5,186.5 L535.3,186.3 L541.0,185.6 L546.8,186.6 L552.5,186.7 L558.3,187.2 L564.0,186.9 L569.8,187.6 L575.5,187.4 L581.3,188.1 L587.0,188.4 L592.8,188.6 L598.5,189.4 L604.3,189.8 L610.0,189.2 L610.0,206.9 L604.3,207.0 L598.5,206.9 L592.8,206.6 L587.0,206.5 L581.3,206.5 L575.5,206.2 L569.8,206.1 L564.0,206.1 L558.3,205.7 L552.5,205.7 L546.8,205.4 L541.0,205.3 L535.3,205.4 L529.5,205.2 L523.8,205.2 L518.0,204.8 L512.3,204.4 L506.5,204.8 L500.8,204.5 L495.1,204.4 L489.3,203.8 L483.6,204.1 L477.8,203.9 L472.1,203.6 L466.3,203.5 L460.6,203.4 L454.8,202.9 L449.1,202.9 L443.3,202.6 L437.6,202.5 L431.8,202.1 L426.1,202.1 L420.3,201.8 L414.6,201.4 L408.8,201.2 L403.1,201.2 L397.3,201.2 L391.6,200.5 L385.9,200.5 L380.1,200.1 L374.4,200.0 L368.6,199.9 L362.9,199.7 L357.1,199.2 L351.4,198.9 L345.6,198.6 L339.9,198.6 L334.1,198.2 L328.4,197.6 L322.6,197.5 L316.9,197.3 L311.1,197.1 L305.4,196.3 L299.6,195.5 L293.9,195.6 L288.1,195.0 L282.4,195.0 L276.7,194.6 L270.9,194.2 L265.2,193.7 L259.4,192.6 L253.7,192.5 L247.9,192.2 L242.2,191.4 L236.4,191.0 L230.7,190.3 L224.9,190.2 L219.2,189.0 L213.4,188.7 L207.7,187.7 L201.9,186.8 L196.2,185.8 L190.4,185.9 L184.7,184.7 L178.9,183.7 L173.2,182.4 L167.5,181.0 L161.7,180.4 L156.0,180.0 L150.2,178.7 L144.5,177.2 L138.7,175.5 L133.0,173.9 L127.2,172.3 L121.5,170.5 L115.7,168.7 L110.0,164.9 L104.2,163.2 L98.5,160.5 L92.7,156.6 L87.0,153.4 L81.2,148.3 L75.5,142.7 L69.7,136.1 L64.0,126.0 Z" class="f-ink" style="fill:currentColor;stroke:none" opacity="0.12"/>
  <path d="M64.0,126.0 L69.7,136.1 L75.5,142.7 L81.2,148.3 L87.0,153.4 L92.7,156.6 L98.5,160.5 L104.2,163.2 L110.0,164.9 L115.7,168.7 L121.5,170.5 L127.2,172.3 L133.0,173.9 L138.7,175.5 L144.5,177.2 L150.2,178.7 L156.0,180.0 L161.7,180.4 L167.5,181.0 L173.2,182.4 L178.9,183.7 L184.7,184.7 L190.4,185.9 L196.2,185.8 L201.9,186.8 L207.7,187.7 L213.4,188.7 L219.2,189.0 L224.9,190.2 L230.7,190.3 L236.4,191.0 L242.2,191.4 L247.9,192.2 L253.7,192.5 L259.4,192.6 L265.2,193.7 L270.9,194.2 L276.7,194.6 L282.4,195.0 L288.1,195.0 L293.9,195.6 L299.6,195.5 L305.4,196.3 L311.1,197.1 L316.9,197.3 L322.6,197.5 L328.4,197.6 L334.1,198.2 L339.9,198.6 L345.6,198.6 L351.4,198.9 L357.1,199.2 L362.9,199.7 L368.6,199.9 L374.4,200.0 L380.1,200.1 L385.9,200.5 L391.6,200.5 L397.3,201.2 L403.1,201.2 L408.8,201.2 L414.6,201.4 L420.3,201.8 L426.1,202.1 L431.8,202.1 L437.6,202.5 L443.3,202.6 L449.1,202.9 L454.8,202.9 L460.6,203.4 L466.3,203.5 L472.1,203.6 L477.8,203.9 L483.6,204.1 L489.3,203.8 L495.1,204.4 L500.8,204.5 L506.5,204.8 L512.3,204.4 L518.0,204.8 L523.8,205.2 L529.5,205.2 L535.3,205.4 L541.0,205.3 L546.8,205.4 L552.5,205.7 L558.3,205.7 L564.0,206.1 L569.8,206.1 L575.5,206.2 L581.3,206.5 L587.0,206.5 L592.8,206.6 L598.5,206.9 L604.3,207.0 L610.0,206.9" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2.5"/>
  <line x1="64" y1="182.5" x2="610" y2="182.5" style="stroke:var(--accent);stroke-width:1.5" stroke-dasharray="6 4"/>
  <text x="610" y="176.5" text-anchor="end" class="f-label f-accent">0.015: Nigrini's &quot;nonconforming&quot;</text>
  <circle cx="156.0" cy="180.0" r="4" style="fill:var(--accent)"/>
  <text x="164.0" y="154.0" class="f-label f-ink">210 numbers: 0.0158</text>
  <line x1="364" y1="62" x2="388" y2="62" class="f-ink" style="stroke:currentColor;stroke-width:2.5"/><text x="394" y="66" class="f-label f-ink">median</text>
  <rect x="364" y="74" width="24" height="10" class="f-ink" style="fill:currentColor" opacity="0.12"/><text x="394" y="83" class="f-label f-muted">up to 99th percentile</text>
  <rect x="64.0" y="303.3" width="13.4" height="14.7" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="78.4" y="296.3" width="13.4" height="21.7" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="92.7" y="287.2" width="13.4" height="30.8" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="107.1" y="278.1" width="13.4" height="39.9" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="121.5" y="279.1" width="13.4" height="38.9" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="135.8" y="280.3" width="13.4" height="37.7" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="150.2" y="264.7" width="13.4" height="53.3" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="164.6" y="262.0" width="13.4" height="56.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="178.9" y="277.3" width="13.4" height="40.7" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="193.3" y="289.5" width="13.4" height="28.5" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="207.7" y="301.9" width="13.4" height="16.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="222.1" y="307.9" width="13.4" height="10.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="236.4" y="311.5" width="13.4" height="6.5" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="250.8" y="313.3" width="13.4" height="4.7" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="265.2" y="315.4" width="13.4" height="2.6" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="279.5" y="316.1" width="13.4" height="1.9" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="293.9" y="317.4" width="13.4" height="0.6" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="308.3" y="317.8" width="13.4" height="0.2" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="322.6" y="317.8" width="13.4" height="0.2" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="337.0" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="351.4" y="317.8" width="13.4" height="0.2" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="365.7" y="317.9" width="13.4" height="0.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="380.1" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="394.5" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="408.8" y="317.9" width="13.4" height="0.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="423.2" y="317.8" width="13.4" height="0.2" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="437.6" y="317.8" width="13.4" height="0.2" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="451.9" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="466.3" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="480.7" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="495.1" y="317.9" width="13.4" height="0.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="509.4" y="317.9" width="13.4" height="0.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="523.8" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="538.2" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="552.5" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="566.9" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="581.3" y="317.9" width="13.4" height="0.1" style="fill:var(--accent)" opacity="0.7"/>
  <rect x="595.6" y="318.0" width="13.4" height="0.0" style="fill:var(--accent)" opacity="0.7"/>
  <text x="334.12631578947367" y="276" class="f-label f-muted">2025 10-K reports by size</text>
  <text x="64.0" y="334" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="150.2" y="334" text-anchor="middle" class="f-label f-muted">200</text>
  <text x="265.2" y="334" text-anchor="middle" class="f-label f-muted">400</text>
  <text x="380.1" y="334" text-anchor="middle" class="f-label f-muted">600</text>
  <text x="495.1" y="334" text-anchor="middle" class="f-label f-muted">800</text>
  <text x="610.0" y="334" text-anchor="middle" class="f-label f-muted">1000</text>
  <text x="610" y="352" text-anchor="end" class="f-label f-muted">numbers in the report</text>
</svg>
<figcaption>4000 simulated draws from Benford for every size in steps of 10. Report size is the count of dollar values per 10-K after the filters in the text.</figcaption>
</figure>

A perfect source with 210 numbers has a median MAD of 0.0158, already above the line. It goes below 0.015 only at about 240 numbers. If every report were drawn from an honest generator, Nigrini's rule would still call 60.3% of them nonconforming. Most of the 83.9% comes from the size of the report.

Before counting I wrote down what would prove me wrong. If small reports were flagged less than twice as often as large ones, size is not the reason. They are flagged 97.5% against 68.0%, which is 1.43 times, so by my own rule this part failed. The rule was badly written, a share near 100% cannot double and the honest source shows the same slope from 88.9% to 32.8%. But I wrote it before the number and the number did not pass.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="Grouped bar chart for 4 quarters of the 2025 10-K reports by count of numbers. In each group the share Nigrini's rule calls nonconforming for the real reports and for a perfect Benford source of the same sizes: 50–146 numbers: 97.5% / 88.9%; 146–210 numbers: 87.8% / 68.5%; 210–256 numbers: 82.3% / 51.4%; 256–954 numbers: 68.0% / 32.8%.">
  <text x="10" y="16" class="f-label f-muted">share flagged &quot;nonconforming&quot; (MAD &gt; 0.015), by report size</text>
  <rect x="50" y="28" width="14" height="10" style="fill:var(--accent)"/><text x="70" y="37" class="f-label f-ink">real 10-K reports</text>
  <rect x="250" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="270" y="37" class="f-label f-ink">perfect Benford, same sizes</text>
  <line x1="50" y1="220" x2="620" y2="220" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="224" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="50" y1="140" x2="620" y2="140" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="144" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="50" y1="60" x2="620" y2="60" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="64" text-anchor="end" class="f-label f-muted">100%</text>
  <rect x="75.25" y="64.0" width="44" height="156.0" style="fill:var(--accent)"/>
  <text x="97.25" y="59.0" text-anchor="middle" class="f-label f-ink">97.5%</text>
  <rect x="123.25" y="77.8" width="44" height="142.2" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="145.25" y="72.8" text-anchor="middle" class="f-label f-ink">88.9%</text>
  <text x="121.25" y="238" text-anchor="middle" class="f-label f-muted">50–146 numbers</text>
  <text x="121.25" y="254" text-anchor="middle" class="f-label f-muted">n = 1334</text>
  <rect x="217.75" y="79.5" width="44" height="140.5" style="fill:var(--accent)"/>
  <text x="239.75" y="74.5" text-anchor="middle" class="f-label f-ink">87.8%</text>
  <rect x="265.75" y="110.3" width="44" height="109.7" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="287.75" y="105.3" text-anchor="middle" class="f-label f-ink">68.5%</text>
  <text x="263.75" y="238" text-anchor="middle" class="f-label f-muted">146–210 numbers</text>
  <text x="263.75" y="254" text-anchor="middle" class="f-label f-muted">n = 1357</text>
  <rect x="360.25" y="88.3" width="44" height="131.7" style="fill:var(--accent)"/>
  <text x="382.25" y="83.3" text-anchor="middle" class="f-label f-ink">82.3%</text>
  <rect x="408.25" y="137.8" width="44" height="82.2" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="430.25" y="132.8" text-anchor="middle" class="f-label f-ink">51.4%</text>
  <text x="406.25" y="238" text-anchor="middle" class="f-label f-muted">210–256 numbers</text>
  <text x="406.25" y="254" text-anchor="middle" class="f-label f-muted">n = 1351</text>
  <rect x="502.75" y="111.2" width="44" height="108.8" style="fill:var(--accent)"/>
  <text x="524.75" y="106.2" text-anchor="middle" class="f-label f-ink">68.0%</text>
  <rect x="550.75" y="167.5" width="44" height="52.5" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="572.75" y="162.5" text-anchor="middle" class="f-label f-ink">32.8%</text>
  <text x="548.75" y="238" text-anchor="middle" class="f-label f-muted">256–954 numbers</text>
  <text x="548.75" y="254" text-anchor="middle" class="f-label f-muted">n = 1357</text>
</svg>
<figcaption>Quarters of 5399 reports by count of numbers. The honest bars are the mean probability that a perfect Benford sample of the same size goes above 0.015.</figcaption>
</figure>

## Correcting for size

The fair question is how unusual a MAD is for its size. For each report I took the percentile of its MAD among simulated honest ones of the same size. Above the 99th percentile there should be 1% of reports. There are 15.9%.

My guess was that a report repeats itself, the same amount under several tags or as an unchanged balance in 2 years. When I counted every distinct value only once the share fell to 8.2%, over 5250 reports with enough distinct values. The rest is still 8 times more than chance and I can not say what it is. Totals are sums of the lines above them, so a report is not a set of independent draws, but I did not go deeper.

## Does any of this point at a problem

A screen is useful only if the flagged reports are worse. I needed an outcome I could count. The first idea was the `prevrpt` field, "this submission was later amended". It is 0 in all 5530 rows, so in these archives nobody fills it in after the fact.

The first outcome that worked: the next 10-K, filed in 2026, repeats last year's net income and equity. If either moved by more than 1%, something changed. For 4473 reports I had both filings. In 153 of them the old number moved. The area under the ROC curve (AUC) of the raw MAD was 0.53, with a 95% bootstrap interval from 0.49 to 0.58. Corrected for size it was 0.50, a coin. Report size alone gave 0.58: reports with fewer numbers had their old numbers changed more often and they also have higher MAD.

That outcome is dirty, it mixes error fixes with reverse mergers. So after seeing it I added a second one, chosen after the first result and not before. Since 2023 the cover page of a 10-K for listed companies has a checkbox: the statements reflect the correction of an error in previously issued statements. I downloaded the cover of the next 10-K for 4576 reports. 4520 have the box and 127 of them have it checked.

Among reports Nigrini's rule calls nonconforming, 2.64% later corrected an error. Among the rest, 3.63%. That gap alone could be chance, but the AUC of the raw MAD is 0.41 with an interval from 0.37 to 0.46, so the raw screen points the wrong way. Companies that tick the box have bigger reports, median 240 numbers against 212. Bigger reports get flagged less. I think that is the whole story, but I did not run a regression to prove it. Corrected for size the AUC is 0.47 and the interval from 0.42 to 0.53 includes the coin.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Two charts. Left: share of 2025 reports whose next 10-K ticked the error correction box, 2.64 percent of 3749 reports Nigrini's rule calls nonconforming and 3.63 percent of the other 771. Right: share of reports caught by the top 5 percent size corrected screen after a part of their numbers is replaced by invented ones with equally likely first digits: 30% → 5.3%, 50% → 21.8%, 70% → 60.3%, 100% → 92.1%.">
  <text x="10" y="16" class="f-label f-muted">later corrected an error, by Nigrini's verdict</text>
  <line x1="40" y1="230" x2="260" y2="230" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="34" y="234" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="40" y1="162" x2="260" y2="162" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="34" y="166" text-anchor="end" class="f-label f-muted">2%</text>
  <line x1="40" y1="94" x2="260" y2="94" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="34" y="98" text-anchor="end" class="f-label f-muted">4%</text>
  <rect x="70" y="140.2" width="60" height="89.8" style="fill:var(--accent)"/>
  <text x="100" y="134.2" text-anchor="middle" class="f-label f-ink">2.64%</text>
  <text x="100" y="248" text-anchor="middle" class="f-label f-muted">nonconforming</text>
  <text x="100" y="264" text-anchor="middle" class="f-label f-muted">n = 3749</text>
  <rect x="170" y="106.5" width="60" height="123.5" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="200" y="100.5" text-anchor="middle" class="f-label f-ink">3.63%</text>
  <text x="200" y="248" text-anchor="middle" class="f-label f-muted">the rest</text>
  <text x="200" y="264" text-anchor="middle" class="f-label f-muted">n = 771</text>
  <text x="310" y="40" class="f-label f-muted">invented numbers mixed in vs reports caught</text>
  <line x1="360" y1="230" x2="620" y2="230" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="354" y="234" text-anchor="end" class="f-label f-muted">0%</text>
  <text x="360" y="248" text-anchor="middle" class="f-label f-muted">0%</text>
  <line x1="360" y1="145" x2="620" y2="145" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="354" y="149" text-anchor="end" class="f-label f-muted">50%</text>
  <text x="490" y="248" text-anchor="middle" class="f-label f-muted">50%</text>
  <line x1="360" y1="60" x2="620" y2="60" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="354" y="64" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="620" y="248" text-anchor="middle" class="f-label f-muted">100%</text>
  <path d="M360.0,221.5 L373.0,223.1 L386.0,224.9 L412.0,224.2 L438.0,221.1 L464.0,211.6 L490.0,192.9 L542.0,127.4 L620.0,73.4" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="360.0" cy="221.5" r="3" style="fill:var(--accent)"/>
  <circle cx="373.0" cy="223.1" r="3" style="fill:var(--accent)"/>
  <circle cx="386.0" cy="224.9" r="3" style="fill:var(--accent)"/>
  <circle cx="412.0" cy="224.2" r="3" style="fill:var(--accent)"/>
  <circle cx="438.0" cy="221.1" r="3" style="fill:var(--accent)"/>
  <text x="432.0" y="213.1" text-anchor="end" class="f-label f-ink">5.3%</text>
  <circle cx="464.0" cy="211.6" r="3" style="fill:var(--accent)"/>
  <circle cx="490.0" cy="192.9" r="3" style="fill:var(--accent)"/>
  <text x="484.0" y="184.9" text-anchor="end" class="f-label f-ink">21.8%</text>
  <circle cx="542.0" cy="127.4" r="3" style="fill:var(--accent)"/>
  <text x="536.0" y="119.4" text-anchor="end" class="f-label f-ink">60.3%</text>
  <circle cx="620.0" cy="73.4" r="3" style="fill:var(--accent)"/>
  <text x="614.0" y="65.4" text-anchor="end" class="f-label f-ink">92.1%</text>
  <text x="620" y="264" text-anchor="end" class="f-label f-muted">share of numbers replaced</text>
</svg>
<figcaption>Left: 4520 reports whose next 10-K cover has the error correction checkbox. Right: the threshold is the top 5% of the same reports without invented numbers, so 0% replaced is caught 5% of the time by construction.</figcaption>
</figure>

## How much fiction it takes

The last check went the other way. I took the real reports and replaced a share of their numbers with invented ones. In those every first digit from 1 to 9 is equally likely. The screen flags the top 5% by size corrected score. At the first try the threshold came out as 1.0 and nothing was ever caught. The percentile saturates when a report is beyond all 4000 simulations. I almost wrote that down as a result. With a z score instead, replacing 30% of the numbers was caught in 5.3% of reports, the same as with no fiction at all. Half the numbers made up gave 21.8%. It takes 70% of invented numbers to catch 60.3% of reports.

Uniform digits are a crude model of a liar. My guess is that a real misstatement touches a few lines, like revenue or one reserve. A few numbers get lost among 210 even more easily.

## What I did not check

I did not match against SEC enforcement releases, the outcome where Amiram and coauthors found their signal. I used one year without any controls, so this does not refute their paper. The second and the last digits I did not count. I do not name any company, a Benford flag is not an accusation and after this run I am not sure it is even a hint.

In my data first digits raise the alarm mostly in small reports. The pile of all reports together still matches the law to 0.00074. As a screen for a single annual report I will not use it without a size correction. Even with it I have nothing that shows it finds errors.
