---
title: "For every Belarusian page in Common Crawl there are 400 in Russian"
description: "Belarusian is 0.017% of Common Crawl: for every Belarusian page there are 399 in Russian and the open corpora agree. Only Wikipedia makes it look like 1 to 6. More than a quarter of all Belarusian web text sits on 10 domains. On .by only about 2% of pages are Belarusian."
date: 2026-10-08
lang: en
translationKey: be-web-share
tags: ["open-data", "text", "statistics"]
---
Every article on this blog goes out in 3 languages and one of them is Belarusian. I knew Belarusian is small on the internet, but I never had a number, only a feeling. The one figure I could quote was Wikipedia. On 8 October 2026 Belarusian has 358692 articles in its 2 editions and Russian has 2121411. One to six. That does not sound so bad.

The first real number I got was from Common Crawl. It was 1 to 400. After that I wrote down what I expected from everything else before counting it: Wikipedia at about 1 to 6, the open text corpora near Common Crawl, the .by domain under 10% Belarusian and 2 different language detectors agreeing there within 10%. The last guess was wrong.

## Where I counted

Common Crawl is the open copy of the web that many language models and open text corpora start from. Since August 2018 it labels every HTML page with its main language using CLD2 and publishes the totals. I took them for all 77 crawls up to September 2026. I also took the sizes of 3 big cleaned corpora from their dataset cards as they were on 8 October 2026. FineWeb-2 and MADLAD-400 are built from Common Crawl, HPLT 2.0 mostly from the Internet Archive.

The latest crawl, CC-MAIN-2026-39, has 2171285702 pages and 364316 of them are in Belarusian. That is 0.017%. W3Techs, which looks at sites and not pages, says Belarusian is used by less than 0.1% of all websites, so this part is not news. For every Belarusian page in the crawl there are 399 Russian ones and 2495 English ones. In the corpora Russian against Belarusian lands between 333 and 505, depending on the corpus and on whether you count documents or words.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Horizontal bars on a log scale, how many times Russian is bigger than Belarusian in each source. Wikipedia, articles: 5.9; Wikipedia, article dump: 13.5; Wikipedia, active editors: 27.6; MADLAD-400, documents: 368; Common Crawl 2026-39, pages: 399; HPLT 2.0, words: 447; FineWeb-2, words: 505. The 3 Wikipedia bars are between 5 and 30, the 4 web bars are between 360 and 510.">
  <text x="10" y="16" class="f-label f-muted">how many times more Russian than Belarusian, by source (log scale)</text>
  <line x1="250.0" y1="34" x2="250.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="250.0" y="266" text-anchor="middle" class="f-label f-muted">1</text>
  <line x1="366.7" y1="34" x2="366.7" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="366.7" y="266" text-anchor="middle" class="f-label f-muted">10</text>
  <line x1="483.3" y1="34" x2="483.3" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="483.3" y="266" text-anchor="middle" class="f-label f-muted">100</text>
  <line x1="600.0" y1="34" x2="600.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="600.0" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <text x="242" y="55" text-anchor="end" class="f-label f-ink">Wikipedia, articles</text>
  <rect x="250" y="43" width="90.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="346.0" y="55" class="f-label f-ink">5.9</text>
  <text x="242" y="85" text-anchor="end" class="f-label f-ink">Wikipedia, article dump</text>
  <rect x="250" y="73" width="131.8" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="387.8" y="85" class="f-label f-ink">13.5</text>
  <text x="242" y="115" text-anchor="end" class="f-label f-ink">Wikipedia, active editors</text>
  <rect x="250" y="103" width="168.1" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="424.1" y="115" class="f-label f-ink">27.6</text>
  <text x="242" y="145" text-anchor="end" class="f-label f-ink">MADLAD-400, documents</text>
  <rect x="250" y="133" width="299.4" height="20" style="fill:var(--accent)"/>
  <text x="555.4" y="145" class="f-label f-accent">368</text>
  <text x="242" y="175" text-anchor="end" class="f-label f-ink">Common Crawl 2026-39, pages</text>
  <rect x="250" y="163" width="303.5" height="20" style="fill:var(--accent)"/>
  <text x="559.5" y="175" class="f-label f-accent">399</text>
  <text x="242" y="205" text-anchor="end" class="f-label f-ink">HPLT 2.0, words</text>
  <rect x="250" y="193" width="309.2" height="20" style="fill:var(--accent)"/>
  <text x="565.2" y="205" class="f-label f-accent">447</text>
  <text x="242" y="235" text-anchor="end" class="f-label f-ink">FineWeb-2, words</text>
  <rect x="250" y="223" width="315.3" height="20" style="fill:var(--accent)"/>
  <text x="571.3" y="235" class="f-label f-accent">505</text>
</svg>
<figcaption>Belarusian Wikipedia is both editions, be and be-tarask. Corpora sizes from their dataset cards, Wikipedia on 8 October 2026.</figcaption>
</figure>

So Wikipedia is the exception by a lot. The gap there is 5.9 times by articles and 13.5 times by the size of the article dump. The 2 Belarusian Wikipedias together are even larger than the Lithuanian one, 358692 articles against 226895. In Common Crawl Lithuanian has 10 times more pages than Belarusian. On the same day the 2 Belarusian editions had 584 registered users active in the last 30 days, Russian had 16120.

My feeling came from the one place where the language looks almost normal. I never checked it against anything else, although the other numbers were always public.

## The ratio over 8 years

I took the median of the crawls of each year. Russian against Belarusian fell from 713 in 2018 to about 400 and has stayed between 359 and 412 since 2019. Single crawls jump around much more than that, so I only trust the medians. Lithuanian stayed between 9.6 and 10.8 all 8 years. Ukrainian went from 30 in 2018 down to between 19 and 26 in 2019 to 2023. Then it rose to 49 this year.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Line chart on a log scale, years 2018 to 2026. Russian: 2018 713, 2019 393, 2020 359, 2021 412, 2022 379, 2023 363, 2024 382, 2025 395, 2026 399; Ukrainian: 2018 30, 2019 20, 2020 19, 2021 24, 2022 26, 2023 22, 2024 36, 2025 41, 2026 49; Lithuanian: 2018 11, 2019 10, 2020 10, 2021 10, 2022 10, 2023 10, 2024 10, 2025 11, 2026 11.">
  <text x="10" y="16" class="f-label f-muted">Common Crawl pages per 1 Belarusian page, median of the crawls of each year (log scale)</text>
  <line x1="50" y1="260.0" x2="470" y2="260.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="264.0" text-anchor="end" class="f-label f-muted">5</text>
  <line x1="50" y1="231.2" x2="470" y2="231.2" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="235.2" text-anchor="end" class="f-label f-muted">10</text>
  <line x1="50" y1="164.4" x2="470" y2="164.4" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="168.4" text-anchor="end" class="f-label f-muted">50</text>
  <line x1="50" y1="135.6" x2="470" y2="135.6" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="139.6" text-anchor="end" class="f-label f-muted">100</text>
  <line x1="50" y1="68.8" x2="470" y2="68.8" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="72.8" text-anchor="end" class="f-label f-muted">500</text>
  <line x1="50" y1="40.0" x2="470" y2="40.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="44.0" text-anchor="end" class="f-label f-muted">1000</text>
  <text x="50.0" y="278" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="102.5" y="278" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="155.0" y="278" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="207.5" y="278" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="260.0" y="278" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="312.5" y="278" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="365.0" y="278" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="417.5" y="278" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="470.0" y="278" text-anchor="middle" class="f-label f-muted">2026</text>
  <path d="M50.0,54.1 L102.5,78.8 L155.0,82.5 L207.5,76.8 L260.0,80.2 L312.5,82.0 L365.0,80.0 L417.5,78.6 L470.0,78.1" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <circle cx="50.0" cy="54.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="102.5" cy="78.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="155.0" cy="82.5" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="207.5" cy="76.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="260.0" cy="80.2" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="312.5" cy="82.0" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="365.0" cy="80.0" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="417.5" cy="78.6" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="470.0" cy="78.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <text x="480" y="82.1" class="f-label f-ink">Russian 399</text>
  <path d="M50.0,185.4 L102.5,202.4 L155.0,205.0 L207.5,195.4 L260.0,191.0 L312.5,197.8 L365.0,177.6 L417.5,172.4 L470.0,165.5" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="50.0" cy="185.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="102.5" cy="202.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="155.0" cy="205.0" r="2.5" style="fill:var(--accent)"/>
  <circle cx="207.5" cy="195.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="260.0" cy="191.0" r="2.5" style="fill:var(--accent)"/>
  <circle cx="312.5" cy="197.8" r="2.5" style="fill:var(--accent)"/>
  <circle cx="365.0" cy="177.6" r="2.5" style="fill:var(--accent)"/>
  <circle cx="417.5" cy="172.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="470.0" cy="165.5" r="2.5" style="fill:var(--accent)"/>
  <text x="480" y="169.5" class="f-label f-accent">Ukrainian 48.7</text>
  <path d="M50.0,227.9 L102.5,229.5 L155.0,232.3 L207.5,232.8 L260.0,230.1 L312.5,229.4 L365.0,230.8 L417.5,228.7 L470.0,228.4" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="6 4"/>
  <circle cx="50.0" cy="227.9" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="102.5" cy="229.5" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="155.0" cy="232.3" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="207.5" cy="232.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="260.0" cy="230.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="312.5" cy="229.4" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="365.0" cy="230.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="417.5" cy="228.7" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="470.0" cy="228.4" r="2.5" class="f-ink" style="fill:currentColor"/>
  <text x="480" y="232.4" class="f-label f-ink">Lithuanian 10.7</text>
</svg>
<figcaption>Main language of the page as labeled by CLD2 in Common Crawl, 77 crawls from August 2018 to September 2026.</figcaption>
</figure>

I can not say from this whether the Ukrainian web grew or the crawler started to visit it more. Common Crawl decides what to fetch and that changes from crawl to crawl. Belarusian did not follow either way, its median share was 0.0128% in 2018 and between 0.015% and 0.019% in every year after.

## Where the Belarusian text lives

FineWeb-2 has 1.17 billion words of Belarusian by its own count. I split the text by spaces instead and got 965 million words on 22588 domains. All shares below are of that count. One site, Radio Svaboda, holds 8.5% of all of it. Next come zviazda.by, which is a state newspaper, Wikipedia, the book library knihi.com and cloudfront.net. The last one surprised me. I opened a few of its pages. Most of the text there is copies of Nasha Niva articles, with the same article numbers as on nashaniva.com. The 10 biggest domains hold 28.9% of the words and the 100 biggest hold 59.5%.

For comparison I took 2 of the 6 Lithuanian files in the same corpus. Each has about 1.3 billion words, a third more than all of Belarusian. There the 10 biggest domains hold 13.7% and 12.8%, about half of the Belarusian share.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Stacked horizontal bars, the share of text on the 10 biggest domains, the next 90 and the rest. Belarusian, FineWeb-2, words: the 10 biggest domains 28.9%, the 100 biggest 59.5%; Belarusian, Common Crawl 2026-39, pages: the 10 biggest domains 33.0%, the 100 biggest 62.5%; Lithuanian, FineWeb-2, file 1 of 6, words: the 10 biggest domains 13.7%, the 100 biggest 32.3%; Lithuanian, FineWeb-2, file 4 of 6, words: the 10 biggest domains 12.8%, the 100 biggest 30.9%.">
  <text x="10" y="16" class="f-label f-muted">share of all text held by the biggest domains</text>
  <rect x="10" y="28" width="14" height="10" style="fill:var(--accent)"/><text x="30" y="37" class="f-label f-ink">10 biggest</text>
  <rect x="180" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="200" y="37" class="f-label f-ink">next 90</text>
  <rect x="350" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="370" y="37" class="f-label f-ink">the rest</text>
  <text x="10" y="66" class="f-label f-ink">Belarusian, FineWeb-2, words</text>
  <rect x="10" y="72" width="179.2" height="20" style="fill:var(--accent)"/>
  <rect x="189.2" y="72" width="189.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="378.8" y="72" width="251.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="185.2" y="86" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">28.9%</text>
  <text x="374.8" y="86" text-anchor="end" class="f-label f-ink">59.5%</text>
  <text x="10" y="116" class="f-label f-ink">Belarusian, Common Crawl 2026-39, pages</text>
  <rect x="10" y="122" width="204.8" height="20" style="fill:var(--accent)"/>
  <rect x="214.8" y="122" width="182.9" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="397.7" y="122" width="232.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="210.8" y="136" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">33.0%</text>
  <text x="393.7" y="136" text-anchor="end" class="f-label f-ink">62.5%</text>
  <text x="10" y="166" class="f-label f-ink">Lithuanian, FineWeb-2, file 1 of 6, words</text>
  <rect x="10" y="172" width="84.9" height="20" style="fill:var(--accent)"/>
  <rect x="94.9" y="172" width="115.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="210.4" y="172" width="419.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="90.9" y="186" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">13.7%</text>
  <text x="206.4" y="186" text-anchor="end" class="f-label f-ink">32.3%</text>
  <text x="10" y="216" class="f-label f-ink">Lithuanian, FineWeb-2, file 4 of 6, words</text>
  <rect x="10" y="222" width="79.2" height="20" style="fill:var(--accent)"/>
  <rect x="89.2" y="222" width="112.5" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="201.8" y="222" width="428.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="85.2" y="236" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">12.8%</text>
  <text x="197.8" y="236" text-anchor="end" class="f-label f-ink">30.9%</text>
</svg>
<figcaption>Domains as registered, so all language editions of Wikipedia count as wikipedia.org. Belarusian FineWeb-2 has 965 million words, each Lithuanian file about 1.3 billion.</figcaption>
</figure>

The current crawl looks the same. Its 364316 Belarusian pages are on 6394 domains and the 10 biggest have 33% of them. Wikipedia alone is 9.9%. Only 39% of the Belarusian pages are on .by, the rest are mostly on .org and .com.

## The .by check

From the other side, I took every HTML page under .by in the September crawl. My first try was the page API of the index. It answered with 504 and 400 and gave me roughly 1 block of 3000 records a minute, so I gave up on it. The columnar index of Common Crawl gave me all 4843281 pages on 34107 domains in a few seconds. Then the data server started to return 403 to me and I waited until it let me back in.

CLD2 says only 2.7% of .by pages are Belarusian, against 86.6% Russian. Only 208 domains have most of their pages in Belarusian, 0.6% of all of them. W3Techs gives 0.9% of .by sites.

I did not want to trust one detector on 2 languages this close. So I sampled 500 .by pages labeled Belarusian and 1000 labeled Russian and downloaded them. Then I ran 2 other checks. One was fastText lid.176, the other a plain count of letters only Belarusian has (ў, і) against letters only Russian has (и, щ, ъ).

On 489 Belarusian pages with enough text fastText agrees on 85.5% and both checks agree on 79.8%. But more than a third of the rest are entries of skarnik.by, a Belarusian and Russian dictionary. Such an entry is half one language and half the other by design. In the 985 Russian pages the 2 checks together found no Belarusian page. fastText alone flagged 1. So on this sample CLD2 counts Belarusian a bit too generously and the corrected .by share is between 2.1% and 2.3%. That is up to 20% less than CLD2 says, up to twice the gap I expected.

## What I did not check

Common Crawl barely sees Telegram channels and nothing behind a login. Whatever is written in Belarusian there is not in these numbers.

I did not split the 2 spellings of Belarusian, the official one and tarashkevitsa. CLD2 has one label for both and in Wikipedia I added them together. Belarusian in Latin letters I did not look for at all. Pages that CLD2 labeled English or left without a label I did not sample.

The 1 to 400 is a count of pages and words. How many people read Belarusian online is a different question and I did not try to answer it here.
