---
title: "Under 1% of websites load a script that calls itself AI"
description: "I counted how many sites in the HTTP Archive crawl load a third party script whose own Wappalyzer description claims AI or machine learning. In November 2022 it is between 0.22% and 0.72% of mobile origins and almost half of it is 2 vendors, Ezoic and Dynatrace. The growth over the year came from new catalog entries: the technologies already detected in January went from 0.58% to 0.54%."
date: 2022-12-31
lang: en
translationKey: http-archive-ai-scripts
tags: ["dependencies", "open-data", "machine-learning"]
---
ChatGPT came out on the last day of November and this month everybody around me talks about AI on the web. I had a feeling that it was already there for years, in third party scripts that every site pulls in. Chat widgets, recommendations, "smart" search. I never put a number behind this feeling. It came from vendor landing pages and I had never counted.

HTTP Archive crawls millions of sites every month and runs Wappalyzer on every page. So the number exists somewhere and I decided to find it.

## How I counted

Wappalyzer is open source and keeps a catalog of technologies on GitHub, with a short description of each one. On 30 November 2022 it had 3470 technologies. I did not want to decide myself what is AI, so I let the vendors decide. A technology counts if its own description says "AI", "artificial intelligence", "machine learning", "deep learning", "neural", "natural language", "NLP" or "computer vision". The label is the vendor's marketing. Still, it is what the vendor tells you about the script you put on your page.

For each of these technologies the technology report of HTTP Archive gives the number of origins where it was detected, per month and per client. I took mobile, all ranks, January to November 2022. December is not published yet.

There is one limitation I could not get around with these numbers. The report counts each technology separately. A site with 2 AI scripts is counted twice, so the sum over technologies is an upper bound. The largest single technology is a lower bound. The real share is between them.

## The first count

My first version was wide. Besides the AI words it also took "chatbot" and "conversational", because a chat widget was the first thing I imagined. It also matched ".ai" in names.

It said 0.85% of mobile origins in January and 1.31% in November. Up by more than half in 10 months, in the year when everybody started to talk about AI. I almost wrote this down as the result.

Then I looked at what was inside. SendPulse is in it with 7,140 origins. It is an email marketing platform and its description lists Facebook and WhatsApp chatbots among its channels. Marchex got in as "call and conversational analytics". Rise.ai and Kontent.ai got in by the domain in their name, one is a loyalty tool and the other is a CMS. I removed the chatbot words and the ".ai" match and kept only what the description itself claims.

<figure class="fig">
<svg viewBox="0 0 680 138" role="img" aria-label="Share of 9,344,044 mobile origins in the November 2022 HTTP Archive crawl, under 4 definitions of an AI script. any AI or chatbot word: 1.31%. AI claimed in description: 0.82%. Dynatrace counted once: 0.72%. Ezoic alone: 0.22%. The first 3 are upper bounds, because a site with 2 such scripts is counted twice. The last is a lower bound.">
  <text x="16" y="27" class="f-mono f-ink" style="font-size:12px">any AI or chatbot word</text>
  <rect x="250" y="16" width="262.7" height="14" rx="2" class="f-box"/>
  <text x="518.7" y="27" class="f-mono f-ink" style="font-size:12px">1.31%</text>
  <text x="16" y="57" class="f-mono f-ink" style="font-size:12px">AI claimed in description</text>
  <rect x="250" y="46" width="164.5" height="14" rx="2" class="f-box"/>
  <text x="420.5" y="57" class="f-mono f-ink" style="font-size:12px">0.82%</text>
  <text x="16" y="87" class="f-mono f-ink" style="font-size:12px">Dynatrace counted once</text>
  <rect x="250" y="76" width="144.1" height="14" rx="2" class="f-box"/>
  <text x="400.1" y="87" class="f-mono f-ink" style="font-size:12px">0.72%</text>
  <text x="16" y="117" class="f-mono f-ink" style="font-size:12px">Ezoic alone</text>
  <rect x="250" y="106" width="44.0" height="14" rx="2" class="f-accent"/>
  <text x="300.0" y="117" class="f-mono f-ink" style="font-size:12px">0.22%</text>
  <line x1="250" y1="8" x2="250" y2="132" class="f-plain"/>
</svg>
<figcaption>November 2022, mobile. The first 3 bars are upper bounds, the last one is a lower bound.</figcaption>
</figure>

With the strict label it is 46 technologies in November and 76,848 origins together. Dynatrace is in the catalog twice, as Dynatrace and Dynatrace RUM, so I merged them into one vendor and got 67,340. That is 0.72% of 9,344,044 mobile origins. The largest single vendor, Ezoic, alone is 20,573, which is 0.22%. So the real share is between 0.22% and 0.72%.

## Who these vendors are

I expected chat bots on top. They are not. The top of the list in November:

| vendor | origins | what the description says |
|---|---|---|
| Ezoic | 20,573 | website optimisation for publishers, "powered by machine learning" |
| Dynatrace | 11,051 | monitoring, "based on artificial intelligence" |
| Invoca | 5,194 | "AI-powered call tracking" |
| AB Tasty | 5,074 | "AI-driven experimentation" |
| Cxense | 4,959 | "AI-powered" personalisation |

Ezoic and Dynatrace together make 47% of the merged sum. The first is an optimisation and ads platform for publishers, the second is monitoring. If someone tells me that the web depends on AI scripts, in 2022 almost half of that dependency is 2 companies. Neither of them is what I pictured.

None of the top descriptions talks about a model in the browser. I also looked for TensorFlow.js and ONNX in the catalog, there is no entry for them at all.

## The growth was the catalog

The wide count grew by more than half and the strict count also grew, from 0.58% in January to 0.72% in November. I wanted to know where this growth came from.

The catalog itself changes during the year. In January 28 of the strict technologies had at least one origin, in November 46. I took only the 28 technologies that were already detected in January and followed them through the year.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Share of mobile origins with a script whose description claims AI, from January to November 2022. All such technologies: Jan 0.58%, Feb 0.67%, Mar 0.67%, Apr 0.62%, May 0.77%, Jun 0.78%, Jul 0.72%, Aug 0.66%, Sep 0.68%, Oct 0.71%, Nov 0.72%. Only the 28 technologies detected already in January: Jan 0.58%, Feb 0.60%, Mar 0.60%, Apr 0.53%, May 0.62%, Jun 0.64%, Jul 0.57%, Aug 0.53%, Sep 0.54%, Oct 0.56%, Nov 0.54%. The first line grows from 0.58% to 0.72% while the catalog grows from 28 to 46 technologies. The second line ends at 0.54%.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.0%</text>
  <line x1="56" y1="136.0" x2="650" y2="136.0" class="f-plain"/>
  <text x="50" y="140.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.3%</text>
  <line x1="56" y1="76.0" x2="650" y2="76.0" class="f-plain"/>
  <text x="50" y="80.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.6%</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0.9%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jan</text>
  <text x="115.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Feb</text>
  <text x="174.8" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Mar</text>
  <text x="234.2" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Apr</text>
  <text x="293.6" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">May</text>
  <text x="353.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jun</text>
  <text x="412.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Jul</text>
  <text x="471.8" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Aug</text>
  <text x="531.2" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Sep</text>
  <text x="590.6" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Oct</text>
  <text x="650.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Nov</text>
  <path d="M56.0,79.1L115.4,61.6L174.8,63.0L234.2,71.9L293.6,42.9L353.0,39.7L412.4,51.1L471.8,63.4L531.2,60.4L590.6,54.1L650.0,51.9" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,79.1L115.4,76.1L174.8,76.6L234.2,89.2L293.6,71.7L353.0,68.8L412.4,81.6L471.8,90.9L531.2,88.5L590.6,85.0L650.0,88.2" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="79.1" r="3" class="f-accent"/>
  <circle cx="115.4" cy="61.6" r="3" class="f-accent"/>
  <circle cx="174.8" cy="63.0" r="3" class="f-accent"/>
  <circle cx="234.2" cy="71.9" r="3" class="f-accent"/>
  <circle cx="293.6" cy="42.9" r="3" class="f-accent"/>
  <circle cx="353.0" cy="39.7" r="3" class="f-accent"/>
  <circle cx="412.4" cy="51.1" r="3" class="f-accent"/>
  <circle cx="471.8" cy="63.4" r="3" class="f-accent"/>
  <circle cx="531.2" cy="60.4" r="3" class="f-accent"/>
  <circle cx="590.6" cy="54.1" r="3" class="f-accent"/>
  <circle cx="650.0" cy="51.9" r="3" class="f-accent"/>
  <circle cx="56.0" cy="79.1" r="2.5" class="f-ink"/>
  <circle cx="115.4" cy="76.1" r="2.5" class="f-ink"/>
  <circle cx="174.8" cy="76.6" r="2.5" class="f-ink"/>
  <circle cx="234.2" cy="89.2" r="2.5" class="f-ink"/>
  <circle cx="293.6" cy="71.7" r="2.5" class="f-ink"/>
  <circle cx="353.0" cy="68.8" r="2.5" class="f-ink"/>
  <circle cx="412.4" cy="81.6" r="2.5" class="f-ink"/>
  <circle cx="471.8" cy="90.9" r="2.5" class="f-ink"/>
  <circle cx="531.2" cy="88.5" r="2.5" class="f-ink"/>
  <circle cx="590.6" cy="85.0" r="2.5" class="f-ink"/>
  <circle cx="650.0" cy="88.2" r="2.5" class="f-ink"/>
  <text x="62.0" y="65.1" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0.58%</text>
  <text x="644.0" y="43.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0.72%</text>
  <text x="644.0" y="80.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0.54%</text>
  <line x1="56" y1="226" x2="78" y2="226" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="230" class="f-label f-muted">all technologies with an AI claim</text>
  <line x1="56" y1="244" x2="78" y2="244" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="248" class="f-label f-muted">only the 28 detected in January</text>
</svg>
<figcaption>Mobile, all ranks, Dynatrace counted once. From January to November the crawl grew from 6.35 to 9.34 million origins.</figcaption>
</figure>

Their share went from 0.58% to 0.54%. In absolute numbers they grew from 37,131 to 50,360 origins. But the crawl grew too, from 6.35 million mobile origins in January to 9.34 million in November, with the big jump in August. So the vendors that were already known did not grow faster than the crawl.

All of the growth in my strict number comes from the 18 technologies that were not there in January. I opened the catalog as it was on the last day of 2021. 16 of the 18 had no entry at all, so for them it is new rules. A new rule probably finds sites that had the script before, but I did not check this. Cxense had a rule, but the January data has no Cxense. It appears in February with 4,457 origins. That is a gap in the data and not a new rule. Onfido also had a rule and has only 31 origins.

The wide count does the same: its January set went from 0.85% to 0.79%.

## Bigger sites

Among the top 10,000 sites the picture is different. There are 8,631 mobile origins in this bucket and the strict sum is 657. That is 7.6% as an upper bound, about 10 times the share of the whole web. Cxense leads with 179, then Dynatrace with 133. Ezoic is not in the top 5. Scripts that call themselves chatbots are only 97 there, 1.1%.

## What I did not check

The real union. With per technology counts I only have bounds. HTTP Archive has the page level data in BigQuery. A query over it would give the exact number of sites with at least one such script and I did not run it.

Whether the label means anything. "Powered by machine learning" in a vendor description is a claim and I did not check any vendor's model. The count also misses vendors that use machine learning and never say so.

Desktop. The strict sum is higher there, 1.17% before merging Dynatrace. I did not look into why. I took mobile because it is the bigger crawl.

Models in the page. TensorFlow.js and similar libraries are not in the catalog, so I cannot see them here.
