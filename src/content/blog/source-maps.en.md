---
title: "How often a sourceMappingURL leads to the source"
description: "A sourceMappingURL comment is on 30% of home pages in my 2021 sample, but does the map really give the code back? I checked 2000 sites only through the Wayback Machine. The archive has a copy for 9.0% of the referenced maps. On just over half of the sites with original files in such a copy, all of them come from vendor SDKs. Own code of the site itself shows up on 12 sites."
date: 2021-09-11
lang: en
translationKey: source-maps
tags: ["debugging", "statistics", "open-data"]
---
I always took it as given that a `//# sourceMappingURL=` at the end of a minified bundle means the original code of the site is one request away. I never counted how often that is true.

The belief has a reason. In `react-scripts` 4.0.3 there is a line `const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';` and the production config turns it into `devtool: 'source-map'`. So a Create React App build writes a `.map` file next to every bundle unless somebody types the word false. Vue CLI 4.5 does the same with `productionSourceMap`, which is true by default. Webpack 5 on its own sets `devtool` to false in production, so it depends on who wrote the config.

A source map is a JSON file with the original file names in `sources`. Often it also has the original files in `sourcesContent`, with comments and the folder layout.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="A minified bundle ends with a sourceMappingURL comment that points to a .map file. The map lists the original file names in sources and can carry the original files with comments in sourcesContent. The browser downloads the map only when developer tools ask for it.">
  <rect x="20" y="20" width="640" height="74" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="40" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js, what the browser runs</text>
  <text x="32" y="60" text-anchor="start" class="f-mono f-ink" style="font-size:11px">!function(e){var t={};function n(r){if(t[r])return t[r].exports;…</text>
  <text x="32" y="82" text-anchor="start" class="f-mono f-accent" style="font-size:12px">//# sourceMappingURL=main.3f9c2a.js.map</text>
  <text x="648" y="82" text-anchor="end" class="f-muted" style="font-size:10px">last line of the bundle</text>
  <line x1="200" y1="96" x2="200" y2="124" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,118 L200,124 L206,118" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <rect x="20" y="126" width="640" height="98" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="146" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js.map, fetched only on request</text>
  <text x="32" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:11px">{&quot;version&quot;:3,&quot;file&quot;:&quot;main.3f9c2a.js&quot;,</text>
  <text x="32" y="184" text-anchor="start" class="f-mono f-ink" style="font-size:11px"> &quot;sources&quot;:[&quot;webpack:///./src/hooks/useQueryParam/index.js&quot;,…],</text>
  <text x="32" y="202" text-anchor="start" class="f-mono f-accent" style="font-size:11px"> &quot;sourcesContent&quot;:[&quot;// TODO: …\nexport default function …&quot;,…],</text>
  <text x="32" y="218" text-anchor="start" class="f-mono f-muted" style="font-size:11px"> &quot;mappings&quot;:&quot;AAAA,SAASA,EAAE…&quot;}</text>
  <line x1="200" y1="226" x2="200" y2="254" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,248 L200,254 L206,248" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="32" y="274" text-anchor="start" class="f-muted" style="font-size:11px">what the map can give back</text>
  <text x="48" y="294" text-anchor="start" class="f-ink" style="font-size:11px">sources: file names and folders</text>
  <text x="48" y="312" text-anchor="start" class="f-accent" style="font-size:11px">sourcesContent: the files themselves</text>
  <text x="48" y="330" text-anchor="start" class="f-accent" style="font-size:11px">comments, TODO, dead code</text>
</svg>
<figcaption>The comment is only an address. Whether the original code is exposed depends on the second file, which no browser downloads by itself and which is the part a crawl does not see.</figcaption>
</figure>

## What was already counted

The Web Almanac 2019 counted the first half. In the HTTP Archive crawl of July 2019 it was 18% of desktop pages and 17% of mobile. They counted pages with a first party script that has `sourceMappingURL`, so the comment. A thread on the HTTP Archive forum from August 2019 points at the limit. Chrome itself never requests a map, only devtools do, so a crawl that runs a browser does not see whether the file exists. That second half is what I wanted to see.

## How I measured

I took the Tranco list created on 10 September 2021 (id 2779, 30 days of ranks before that date). All 1000 top domains and 1000 random domains from ranks 1001 to 100000. For every domain I took the last Wayback Machine capture of the home page between 1 August and 10 September 2021. I used the raw `id_` form, without the archive's rewriting. Then every external script on that page, up to 40, again from the archive and only captures from June to 10 September.

I did not send a single request to the live sites. The same run against the archive should give the same files, plus maybe a few copies the archive indexed later.

1606 of 2000 home pages came back as HTML in the window, 856 in the top 1000 and 750 in the tail. Some top domains are infrastructure without a home page, like `googletagmanager.com`. Of the script tags I checked, 83% had a capture in the window.

The archive itself cost me most of a night. After about 2 hours of crawling it started refusing connections. My first version wrote every refused request down as "no copy". I had to redo 203 domains and every map with a crawler that keeps a failure separate from an empty answer. 140 more domains were still waiting for the archive when I stopped, so the number of home pages may be a little low.

## How many pages point to a map

At least one script with a map reference: **31.8%** of the top 1000 home pages and **28.4%** of the tail. Counting only scripts from the page's own registered domain, it is 15.7% and 15.3%. The Almanac had 17 to 18% in 2019, with another crawl and another list. Part of the rest is open source libraries from public CDNs like jsDelivr or cdnjs. Some are copies of Bootstrap and jQuery on the site's own server. There the map is published on purpose and the source is public anyway, so from here on I count those separately.

I also expected maps embedded right into the bundle as a `data:` URL and the first pass found 11 sites with them. 10 of them were the same code from `style-loader`. It builds that comment as a string at runtime, to attach a map to injected CSS. My regex found the string literal. One embedded map was real and had no `sourcesContent`. I almost wrote it down as 0.7% of sites.

## How often the archive has the map

The pages point to 1607 different external map URLs. For **145** of them, 9.0%, the archive has a copy made on or before 10 September 2021. By owner the difference is larger than I thought. Maps of open libraries have a copy in 69 of 188 cases. Maps on the page's own domain have it in 39 of 827. My guess is that the archive keeps what many people request. A popular library map gets opened in devtools by many people. A map of one site's build is opened only by its own developers, if at all. I did not check this.

Inside the 145 copies, 84 have `sourcesContent`. Library maps are often empty, 36 of 69 have only names and mappings. For code that is not a library it goes the other way, 51 of 76 copies carry original files.

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Funnel per stratum. Top 1000: home page in the archive 856; points to a map (not a library) 234, 27.3%; map copy by 10 Sep 70, 8.2%; copy has original files 34, 4.0%; map on the page's own domain 11, 1.3%. Ranks 1001 to 100000: home page in the archive 750; points to a map (not a library) 159, 21.2%; map copy by 10 Sep 44, 5.9%; copy has original files 38, 5.1%; map on the page's own domain 1, 0.1%.">
  <text x="20" y="24" text-anchor="start" class="f-ink" style="font-size:13px">top 1000</text>
  <text x="320" y="53" text-anchor="end" class="f-muted" style="font-size:11px">home page in the archive</text>
  <rect x="330" y="41" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="53" text-anchor="start" class="f-ink f-mono" style="font-size:11px">856</text>
  <text x="320" y="75" text-anchor="end" class="f-muted" style="font-size:11px">points to a map (not a library)</text>
  <rect x="330" y="63" width="62.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="400.8" y="75" text-anchor="start" class="f-ink f-mono" style="font-size:11px">234, 27.3%</text>
  <text x="320" y="97" text-anchor="end" class="f-muted" style="font-size:11px">map copy by 10 Sep</text>
  <rect x="330" y="85" width="18.9" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="356.9" y="97" text-anchor="start" class="f-ink f-mono" style="font-size:11px">70, 8.2%</text>
  <text x="320" y="119" text-anchor="end" class="f-muted" style="font-size:11px">copy has original files</text>
  <rect x="330" y="107" width="9.2" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="347.2" y="119" text-anchor="start" class="f-ink f-mono" style="font-size:11px">34, 4.0%</text>
  <text x="320" y="141" text-anchor="end" class="f-muted" style="font-size:11px">map on the page's own domain</text>
  <rect x="330" y="129" width="3.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="341.0" y="141" text-anchor="start" class="f-ink f-mono" style="font-size:11px">11, 1.3%</text>
  <text x="20" y="170" text-anchor="start" class="f-ink" style="font-size:13px">ranks 1001 to 100000, 1000 random</text>
  <text x="320" y="199" text-anchor="end" class="f-muted" style="font-size:11px">home page in the archive</text>
  <rect x="330" y="187" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="199" text-anchor="start" class="f-ink f-mono" style="font-size:11px">750</text>
  <text x="320" y="221" text-anchor="end" class="f-muted" style="font-size:11px">points to a map (not a library)</text>
  <rect x="330" y="209" width="48.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="386.8" y="221" text-anchor="start" class="f-ink f-mono" style="font-size:11px">159, 21.2%</text>
  <text x="320" y="243" text-anchor="end" class="f-muted" style="font-size:11px">map copy by 10 Sep</text>
  <rect x="330" y="231" width="13.6" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="351.6" y="243" text-anchor="start" class="f-ink f-mono" style="font-size:11px">44, 5.9%</text>
  <text x="320" y="265" text-anchor="end" class="f-muted" style="font-size:11px">copy has original files</text>
  <rect x="330" y="253" width="11.7" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="349.7" y="265" text-anchor="start" class="f-ink f-mono" style="font-size:11px">38, 5.1%</text>
  <text x="320" y="287" text-anchor="end" class="f-muted" style="font-size:11px">map on the page's own domain</text>
  <rect x="330" y="275" width="1.5" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="339.5" y="287" text-anchor="start" class="f-ink f-mono" style="font-size:11px">1, 0.1%</text>
</svg>
<figcaption>Home pages with a capture between 1 August and 10 September 2021. Scripts of open libraries are left out, from public CDNs and own copies alike. A map copy counts only if it was made on or before 10 September 2021. Most of the drop between the last 2 rows is vendor scripts.</figcaption>
</figure>

## Whose code it is

Leaving the libraries out, 34 home pages in the top 1000 and 38 in the tail have at least one archived map with original files. I expected these to be the sites' own apps. Often they are not. For 38 of these 72 pages all such files come from 4 vendor scripts. The OneSignal push notification SDK alone is on 26 of them. The others are Concert ads, Sailthru and the Trustpilot widget. OneSignal has its SDK repository on GitHub since 2015, so this map hardly shows anything new. The rest are maps on other hosts, often the company's own CDN on another domain.

Maps with original files on the page's own domain: **11 home pages in the top 1000 and 1 in the tail**. And a copy from before 10 September is not necessarily the build that was running then. For the maps with original files the median copy is 308 days older than its home page. If the copy must be at most 100 days older, 16 sites are left, 10 of them in the top 1000, vendors included.

What is in those files is the part minification removes. In half of the 47 maps with files of the site or its vendor at least 9% of the lines are comments and 11 of them have TODO markers. The folder layout is there too, things like `src/hooks/useQueryParam/index.js`.

<figure class="fig">
<svg viewBox="0 0 680 176" role="img" aria-label="External map URLs by owner of the script. same domain as the page: 827, 39 of 827 (4.7%), sourcesContent 26; other host (own CDN, vendor): 592, 37 of 592 (6.3%), sourcesContent 25; open library (CDN, own copy): 188, 69 of 188 (36.7%), sourcesContent 33.">
  <rect x="20" y="12" width="12" height="10" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">map URLs referenced</text>
  <rect x="240" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <text x="258" y="22" text-anchor="start" class="f-muted" style="font-size:11px">copy by 10 Sep</text>
  <rect x="460" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="478" y="22" text-anchor="start" class="f-muted" style="font-size:11px">copy with sourcesContent</text>
  <text x="290" y="60" text-anchor="end" class="f-ink" style="font-size:11px">same domain as the page</text>
  <rect x="300" y="46" width="260.0" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="54" width="12.3" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="62" width="8.2" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="568" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">827</text>
  <text x="340" y="70" text-anchor="start" class="f-mono f-accent" style="font-size:11px">39 of 827, 4.7%, with files 26</text>
  <text x="290" y="104" text-anchor="end" class="f-ink" style="font-size:11px">other host (own CDN, vendor)</text>
  <rect x="300" y="90" width="186.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="98" width="11.6" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="106" width="7.9" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="494.11850060459494" y="100" text-anchor="start" class="f-mono f-muted" style="font-size:11px">592</text>
  <text x="340" y="114" text-anchor="start" class="f-mono f-accent" style="font-size:11px">37 of 592, 6.3%, with files 25</text>
  <text x="290" y="148" text-anchor="end" class="f-ink" style="font-size:11px">open library (CDN, own copy)</text>
  <rect x="300" y="134" width="59.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="142" width="21.7" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="150" width="10.4" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="367.1051995163241" y="144" text-anchor="start" class="f-mono f-muted" style="font-size:11px">188</text>
  <text x="340" y="158" text-anchor="start" class="f-mono f-accent" style="font-size:11px">69 of 188, 36.7%, with files 33</text>
</svg>
<figcaption>Distinct map URLs from all home pages, by the host of the script. Libraries include copies of files like jQuery on the site's own server. The archive has a copy for over a third of the library maps and for under 5% of the maps on the page's own domain.</figcaption>
</figure>

So the first half of my belief holds. Nearly a third of the pages point to a map. The second half I cannot confirm from the archive. The map is there for a few percent of pages, more often with a vendor's code than with the site's own. A fresh copy exists for about 1 site in 100.

## What I did not check

The main thing is the live servers. The archive says "I have it" or "I don't know", it does not say that the server returned 404. So 30% is how many pages point somewhere and 12 sites are what I can show for own code behind that pointer. Some of those servers may well return the map to anyone who asks.

Only home pages were checked, so the share of sites with a map reference somewhere is likely higher. 17% of script tags had no capture in the window, so the real share is likely higher than 30% for this reason too. The tail is 750 pages of a random sample, so 28.4% has an interval of about 25 to 32%. I did not search the files for secrets. I am also not naming the sites whose own code is in the archive. The split between own code and vendor is mine, done by hand for the 4 SDKs after counting.

For how many sites the map is really there I only have a lower bound. The next step is to ask the servers for the 1607 maps, with a HEAD request and nothing more.
