---
title: "One in 7 \"Belarusian\" pages in mC4 is in Russian"
description: "mC4 is the corpus mT5 was trained on. fastText calls 14.3% of its Belarusian documents Russian, mostly tiny shop pages, but by words that is only 2.7%. CC-100 looks cleaner, but it was filtered with the same fastText model. About 1 in 5 long Belarusian texts in both corpora uses the classical spelling."
date: 2022-06-04
lang: en
translationKey: belarusian-in-mc4
tags: ["machine-learning", "open-data", "text"]
---
The mT5 paper lists 101 languages and Belarusian is one of them. In its appendix there is a table with the size of every language in mC4, the corpus mT5 was trained on. Belarusian has 2.0 billion tokens, Russian 713 billion. I read that table more than once and took from it only the ratio. It is small, but it is there. That the 2 billion tokens are Belarusian text I simply assumed, although the files are public and I never opened them.

So I opened them. mC4 is on Hugging Face in the AllenAI copy, the Belarusian part is 128 files and 3.4 GB compressed. Next to it I took CC-100, the corpus behind XLM-R, where Belarusian is 1 file of 0.72 GB. I did not save the corpora to disk. Every document went through 2 language detectors in Python and I wrote one line of features per document. The first is CLD3, the same detector mC4 used to pick the language of a page. The second is fastText 0.9.2 with its lid.176 model from 2017. mC4 did not use it. CC-100 did. I found that out only after counting and it matters below.

I am not the first to look inside. Kreutzer and others audited samples of many web corpora by hand and published it this year in TACL. For Belarusian in mC4 they rated about 100 sentences. 92% were correct, 4% another language and the rest not language at all. Before counting I wrote down what I expected: fastText says Belarusian on at least 90% of mC4 documents and at least 95% of CC-100. Below 80% I would call the label unreliable.

## Size

Russian against Belarusian in mC4 is 408 to 1 by compressed bytes and 357 to 1 by the mT5 token counts. mC4 was built from the Common Crawl scrapes up to 2020. For comparison, the latest crawl I took, from January 2022, labels 0.0153% of pages as Belarusian and has 408 Russian pages for every Belarusian one. The same 408 is luck. These are pages against bytes and a crawl mC4 never saw. It only says the order is the same.

CC-100 is different. There Russian is only 68 times larger than Belarusian. English is 121 times larger, against 1174 in mC4. Both corpora start from Common Crawl, but CC-100 took 1 crawl for English and 12 for the other languages. That explains much of the English gap. On Russian the 2 corpora end 6 times apart and that I cannot explain. CC-100 also has its own filtering and I did not dig into which step makes the difference.

<figure class="fig">
<svg viewBox="0 0 680 180" role="img" aria-label="Horizontal bars on a log scale, how many times more Russian than Belarusian text each source has. mT5 token counts for mC4: 357. mC4 compressed bytes: 408. Common Crawl CC-MAIN-2022-05 pages by CLD2 language: 408. CC-100 compressed bytes: 68.">
  <text x="10" y="16" class="f-label f-muted">times more Russian than Belarusian (log scale)</text>
  <line x1="250.0" y1="30" x2="250.0" y2="154" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="250.0" y="170" text-anchor="middle" class="f-label f-muted">1</text>
  <line x1="366.7" y1="30" x2="366.7" y2="154" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="366.7" y="170" text-anchor="middle" class="f-label f-muted">10</text>
  <line x1="483.3" y1="30" x2="483.3" y2="154" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="483.3" y="170" text-anchor="middle" class="f-label f-muted">100</text>
  <line x1="600.0" y1="30" x2="600.0" y2="154" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="600.0" y="170" text-anchor="middle" class="f-label f-muted">1000</text>
  <text x="242" y="51" text-anchor="end" class="f-label f-ink">mT5 table, mC4 tokens</text>
  <rect x="250" y="38" width="297.8" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="553.8" y="51" class="f-label f-ink">357</text>
  <text x="242" y="81" text-anchor="end" class="f-label f-ink">mC4, compressed bytes</text>
  <rect x="250" y="68" width="304.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="560.6" y="81" class="f-label f-ink">408</text>
  <text x="242" y="111" text-anchor="end" class="f-label f-ink">Common Crawl 2022-05, pages</text>
  <rect x="250" y="98" width="304.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="560.6" y="111" class="f-label f-ink">408</text>
  <text x="242" y="141" text-anchor="end" class="f-label f-ink">CC-100, compressed bytes</text>
  <rect x="250" y="128" width="213.8" height="20" style="fill:var(--accent)"/>
  <text x="469.8" y="141" class="f-label f-accent">68</text>
</svg>
<figcaption>Russian against Belarusian. mT5 paper table, file sizes of mC4 (AllenAI copy) and CC-100, Common Crawl statistics for the January 2022 crawl.</figcaption>
</figure>

## What the Belarusian folder contains

mC4 Belarusian has 1742030 documents. CLD3 calls all of them Belarusian, which is expected because that is how they got into the folder. fastText agrees on 81.6%. On 14.3% it says Russian, on 1.6% Ukrainian. So my 90% was wrong and the result landed just above the line I had drawn for an unreliable label.

Then I counted words instead of documents. By words fastText says Belarusian on 93.2% and Russian on only 2.7%. That is close to the 92% from the manual audit. I spent some time thinking my numbers disagreed with Kreutzer before I understood that they counted sentences and I counted documents. Words are not sentences either, so the match is partly luck. But the reason for the gap is clear: the Russian documents are tiny.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="4 stacked bars showing what fastText lid.176 says about the Belarusian part of 2 corpora. mC4 by documents: Belarusian 81.6%, Russian 14.3%, Ukrainian 1.6%, other 2.5%. mC4 by words: Belarusian 93.2%, Russian 2.7%. CC-100 by documents: Belarusian 98.8%. CC-100 by words: Belarusian 99.96%.">
  <text x="162" y="30" text-anchor="end" class="f-label f-ink">mC4, documents</text>
  <rect x="170.0" y="14" width="383.6" height="24" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="553.6" y="14" width="67.2" height="24" style="fill:var(--accent)"/>
  <rect x="620.9" y="14" width="7.5" height="24" class="f-ink" style="fill:currentColor" opacity="0.65"/>
  <rect x="628.4" y="14" width="11.6" height="24" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="176" y="30" class="f-label f-ink">81.6%</text>
  <text x="557.6" y="30" class="f-label" style="fill:var(--bg, #fff)">14.3%</text>
  <text x="162" y="70" text-anchor="end" class="f-label f-ink">mC4, words</text>
  <rect x="170.0" y="54" width="437.9" height="24" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="607.9" y="54" width="12.9" height="24" style="fill:var(--accent)"/>
  <rect x="620.8" y="54" width="5.0" height="24" class="f-ink" style="fill:currentColor" opacity="0.65"/>
  <rect x="625.7" y="54" width="14.3" height="24" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="176" y="70" class="f-label f-ink">93.2%</text>
  <text x="162" y="110" text-anchor="end" class="f-label f-ink">CC-100, documents</text>
  <rect x="170.0" y="94" width="464.5" height="24" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="634.5" y="94" width="2.2" height="24" style="fill:var(--accent)"/>
  <rect x="636.7" y="94" width="2.9" height="24" class="f-ink" style="fill:currentColor" opacity="0.65"/>
  <rect x="639.5" y="94" width="0.5" height="24" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="176" y="110" class="f-label f-ink">98.8%</text>
  <text x="162" y="150" text-anchor="end" class="f-label f-ink">CC-100, words</text>
  <rect x="170.0" y="134" width="469.8" height="24" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="639.8" y="134" width="0.1" height="24" style="fill:var(--accent)"/>
  <rect x="639.9" y="134" width="0.1" height="24" class="f-ink" style="fill:currentColor" opacity="0.65"/>
  <text x="176" y="150" class="f-label f-ink">99.96%</text>
  <rect x="170" y="182" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="187" y="192" class="f-label f-muted">Belarusian</text>
  <rect x="285" y="182" width="12" height="12" style="fill:var(--accent)"/>
  <text x="302" y="192" class="f-label f-muted">Russian</text>
  <rect x="400" y="182" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.65"/>
  <text x="417" y="192" class="f-label f-muted">Ukrainian</text>
  <rect x="515" y="182" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="532" y="192" class="f-label f-muted">other</text>
</svg>
<figcaption>All 1742030 documents of mC4 be and all 1450734 of CC-100 be. Language by fastText lid.176.</figcaption>
</figure>

There are 249162 of them. The median length is 27 words, 3 of 4 are shorter than 50 words. 146160 of them sit on .ru domains. I read the 47 that fell into a random sample of 400 documents. 14.3% would give 57, but 400 is a small sample. 26 of them are clearly shop pages: dry pastel, mattresses 90x205 in Samara, shower cabins, a battery for a SonyEricsson K770. 5 more are lists of products on pages that are not quite shops. The rest is torrents, a forum thread, a list of doctors, a casino, a recipe and similar. 3 of the 47 are not purely Russian. I did not find one ordinary article among them. A page of product titles has almost no ordinary Russian words, so the letters that separate Russian from Belarusian barely show up.

I took one such page, a grill from a Russian online shop. I gave CLD3 its lines one by one. With only the first line it says Russian. From the second line on it says Belarusian until line 7, where the word "доставка" (delivery) brings Russian back. With all 8 lines it is Belarusian again, with 0.797 confidence. mC4 dropped pages below 0.7, so this one passed.

<figure class="fig">
<svg viewBox="0 0 680 268" role="img" aria-label="8 lines of a Russian shop page about a grill, from mC4 Belarusian. For each line, the CLD3 label and confidence after reading the page up to that line. Line 1: Russian 0.424. Lines 2 to 6: Belarusian, 0.768 to 0.784. Line 7, with the word доставка: Russian 0.486. Line 8: Belarusian 0.797, above the 0.7 threshold mC4 used.">
  <text x="10" y="16" class="f-label f-muted">CLD3 label after reading lines 1..k</text>
  <line x1="575" y1="26" x2="575" y2="238" class="f-line" stroke-dasharray="4 3"/>
  <text x="575" y="252" text-anchor="middle" class="f-label f-muted">mC4 threshold 0.7</text>
  <text x="10" y="45" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="26" y="45" class="f-mono f-ink" style="font-size:10px">Барбекю : Гриль OFYR Classic 100 Black steel</text>
  <rect x="400" y="33" width="106.0" height="18" style="fill:var(--accent)"/>
  <text x="512.0" y="46" class="f-label f-accent">ru 0.424</text>
  <text x="10" y="71" class="f-mono f-muted" style="font-size:10px">2</text>
  <text x="26" y="71" class="f-mono f-ink" style="font-size:10px">Главная/Каталог/Барбекю/Гриль OFYR Classic 10…</text>
  <rect x="400" y="59" width="192.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="598.0" y="72" class="f-label f-ink">be 0.768</text>
  <text x="10" y="97" class="f-mono f-muted" style="font-size:10px">3</text>
  <text x="26" y="97" class="f-mono f-ink" style="font-size:10px">Гриль OFYR Classic 100 Black steel</text>
  <rect x="400" y="85" width="192.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="598.0" y="98" class="f-label f-ink">be 0.768</text>
  <text x="10" y="123" class="f-mono f-muted" style="font-size:10px">4</text>
  <text x="26" y="123" class="f-mono f-ink" style="font-size:10px">Гриль OFYR Classic 100 Black steel - характер…</text>
  <rect x="400" y="111" width="192.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="598.0" y="124" class="f-label f-ink">be 0.768</text>
  <text x="10" y="149" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="26" y="149" class="f-mono f-ink" style="font-size:10px">Описание: Гриль OFYR Classic 100 Black steel</text>
  <rect x="400" y="137" width="196.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="602.0" y="150" class="f-label f-ink">be 0.784</text>
  <text x="10" y="175" class="f-mono f-muted" style="font-size:10px">6</text>
  <text x="26" y="175" class="f-mono f-ink" style="font-size:10px">Отзывы Гриль OFYR Classic 100 Black steel</text>
  <rect x="400" y="163" width="196.0" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="602.0" y="176" class="f-label f-ink">be 0.784</text>
  <text x="10" y="201" class="f-mono f-muted" style="font-size:10px">7</text>
  <text x="26" y="201" class="f-mono f-ink" style="font-size:10px">Гриль OFYR Classic 100 Black steel - доставка</text>
  <rect x="400" y="189" width="121.5" height="18" style="fill:var(--accent)"/>
  <text x="527.5" y="202" class="f-label f-accent">ru 0.486</text>
  <text x="10" y="227" class="f-mono f-muted" style="font-size:10px">8</text>
  <text x="26" y="227" class="f-mono f-ink" style="font-size:10px">Гриль OFYR Classic 100 Black steel - монтаж</text>
  <rect x="400" y="215" width="199.3" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="605.3" y="228" class="f-label f-ink">be 0.797</text>
</svg>
<figcaption>CLD3 on the first k lines of a page from in-kamin.ru. The text of the page is in Russian.</figcaption>
</figure>

CC-100 looks cleaner. fastText says Belarusian on 98.8% of its 1450734 documents and on 99.96% of its words. My expectation of 95% held. But CC-100 was filtered with this same lid.176 model, so here fastText mostly confirms its own earlier decision.

## What this means for mT5

mT5 trained for 1 million steps on batches of 1024 sequences of 1024 tokens, which is about 1.05 trillion tokens. Its sampling gave Belarusian 0.59% of them. That is 6.19 billion tokens from a pile of 2.0 billion, so the model went over the Belarusian folder about 3 times. These are input tokens after the span corruption, so the real number is maybe a bit higher. Russian got 3.71% of the training, but its pile is so big that the model saw only about 5.5% of it once.

So the model repeats the Belarusian folder 3 times, Russian shop pages included. Of the real Russian pile it reads about 5.5%. By words Russian is 2.7% of what gets repeated and in my sample shops are most of it. For a model that is probably not a problem. But if you sample documents from mC4 to count something, fastText calls every seventh "Belarusian" page Russian.

## 2 spellings in one folder

Belarusian has 2 spellings in use, the official one and the classical one called taraškievica. Taraškievica is mostly used by independent media and has its own Wikipedia. The corpora do not separate them. I looked for a count of taraškievica in mC4 or CC-100 and did not find one.

The classical spelling writes a soft sign between consonants where the official one does not: сьнег against снег, жыцьцё against жыццё. I made a list of such clusters plus the letter ґ and checked it on about 200 random articles from each Belarusian Wikipedia. On the official one it found nothing at all. On the classical one it caught 49 of 52 articles of 100 to 200 words and every longer one.

Among Belarusian documents of at least 100 words, 22.0% in mC4 and 20.9% in CC-100 have the classical spelling. I expected between 15% and 40%. So roughly 1 in 5 long Belarusian texts in both corpora is in the classical spelling, which the official rules do not accept.

## What I did not check

fastText is not ground truth. Short Belarusian pages with few letters are hard for every detector. The mT5 paper says mC4 kept only pages with at least 3 lines of 200 characters. The Russian pages in the folder are much shorter than that. Maybe the long lines were removed later as duplicates, but I did not check it. The taraškievica count misses a few texts of 100 to 200 words, 3 of 52 in the Wikipedia check, so 22.0% is a bit low. Short texts I did not count at all. The count also takes a document as classical even if it only quotes the spelling once. I did not train anything, so what the Russian shops do to mT5 Belarusian is a guess.
