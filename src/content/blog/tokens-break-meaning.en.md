---
title: "With the recommended threshold BPE cuts Belarusian finer than a vocabulary that never saw it"
description: "I trained one BPE vocabulary on English, Russian and a little Belarusian from Tatoeba. Belarusian costs 1.4 times more pieces per word than Russian, with equally little Russian the gap is gone. The vocabulary threshold of 50 from the README makes it worse than a vocabulary without Belarusian."
date: 2018-03-31
lang: en
translationKey: tokens-break-meaning
tags: ["machine-learning", "text", "open-data"]
---

I gave the Moses tokenizer one Belarusian word, "family", with 3 different apostrophes:

```
$ printf "сям'я сям’я сямʼя\n" | perl tokenizer.perl -q -l be
WARNING: No known abbreviations for language 'be', attempting fall-back to English version...
сям &apos; я сям ’ я сямʼя
```

The apostrophe belongs to the spelling, like a letter. With the typewriter `'` and with the typographic `’` the word becomes 3 tokens. With U+02BC it stays whole, because Unicode counts that character as a letter. In my sample nobody types U+02BC. The typewriter one is there 45 times, the typographic one 47.

<figure class="fig">
<svg viewBox="0 0 680 178" role="img" aria-label="The word family in Belarusian typed with 3 apostrophes. U+0027: 3 Moses tokens сям &amp;apos; я, 4 pieces ся м &amp;apos; я. U+2019: 3 Moses tokens сям ’ я, 4 pieces ся м ’ я. U+02BC: 1 Moses tokens сямʼя, 4 pieces ся м ʼ я.">
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">input</text>
  <text x="200.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">after Moses, -l be</text>
  <text x="440.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">after joint BPE</text>
  <text x="14.0" y="49.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям'я</text>
  <text x="76.0" y="49.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+0027</text>
  <rect x="200.0" y="32" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="272.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="308.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="319.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="32" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="32" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="32" width="60.8" height="26" class="f-box"/>
  <text x="531.8" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">&amp;apos;</text>
  <rect x="567.2" y="32" width="21.8" height="26" class="f-box"/>
  <text x="578.1" y="49.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="71" x2="666" y2="71" class="f-plain"/>
  <text x="14.0" y="101.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сям’я</text>
  <text x="76.0" y="101.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+2019</text>
  <rect x="200.0" y="84" width="37.4" height="26" class="f-box"/>
  <text x="218.7" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">сям</text>
  <rect x="242.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="253.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="269.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="280.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <rect x="440.0" y="84" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="84" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="84" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">’</text>
  <rect x="528.2" y="84" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="101.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
  <line x1="14" y1="123" x2="666" y2="123" class="f-plain"/>
  <text x="14.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:13px">сямʼя</text>
  <text x="76.0" y="153.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">U+02BC</text>
  <rect x="200.0" y="136" width="53.0" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="226.5" y="153.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">сямʼя</text>
  <rect x="440.0" y="136" width="29.6" height="26" class="f-box"/>
  <text x="454.8" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ся</text>
  <rect x="474.6" y="136" width="21.8" height="26" class="f-box"/>
  <text x="485.5" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">м</text>
  <rect x="501.4" y="136" width="21.8" height="26" class="f-box"/>
  <text x="512.3" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ʼ</text>
  <rect x="528.2" y="136" width="21.8" height="26" class="f-box"/>
  <text x="539.1" y="153.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">я</text>
</svg>
<figcaption>One word, 3 apostrophes. Only U+02BC passes the tokenizer whole. The joint BPE cuts it anyway.</figcaption>
</figure>

I have passed text through tokenizer plus BPE many times as one command and I looked only at the English side. I never checked what happens to a small language when it shares a vocabulary with 2 big ones, although one joint vocabulary is the usual advice.

BPE for translation comes from Sennrich and coauthors (2016). Johnson and colleagues at Google (2017) train one wordpiece vocabulary for many languages. Ataman et al. (2017) for Turkish and Huck et al. (2017) for German already compared splitting by frequency with splitting by morphology. I wanted to see the numbers for Belarusian.

## What I took

Tatoeba, only sentences whose last edit is before March 31, 2018. There are 3,671 Belarusian ones like that. 400 of them, with a Russian and an English translation, are the test. The other 3,270 went to training (one more repeated a test sentence) with 60,000 Russian and 60,000 English sentences. Belarusian is 2.4% of the tokens. Everything is lowercased.

The tools are the Moses `tokenizer.perl` and `subword-nmt` at the commit of March 28. All vocabularies except one have 10,000 merges. I count pieces per word on the same 400 sentences in 3 languages.

## The same sentences, 1.4 times more pieces

With the joint vocabulary an English word costs 1.33 pieces, a Russian one 1.51 and a Belarusian one 2.12. Before the run I wrote down that Belarusian would be at least 1.3 times worse than Russian. It is 1.40, bootstrap over sentences from 1.37 to 1.43.

Russian `информации` is one piece. Belarusian `інфармацыі` is `ін|фа|рма|цыі`.

Maybe the language is like that. So I cut Russian to the same 3,270 lines and trained again. Russian went to 1.93 and Belarusian was at 1.88. With equal data the ratio is 0.97, so on this corpus the gap is about the amount of data.

Then I went back to the full Russian and repeated the Belarusian lines 18 times, the crude trick. Belarusian became 1.62 and Russian 1.64, because the same 10,000 merges now serve everybody. English went from 1.33 to 1.43. A vocabulary of its own, with 4,000 merges and only Belarusian text, gives 1.70.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Pieces per Belarusian word on 400 test sentences under 6 vocabularies: joint, threshold 50 3.28; no Belarusian at all 2.96; joint 2.12; Russian cut to 3,270 1.88; Belarusian only, 4,000 1.70; Belarusian x18 1.62. A vertical line marks Russian under the joint vocabulary, 1.51.">
  <text x="210.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">pieces per Belarusian word</text>
  <text x="200.0" y="43.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">joint, threshold 50</text>
  <rect x="210" y="28" width="384.0" height="22" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="602.0" y="43.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">3.28</text>
  <text x="200.0" y="75.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">no Belarusian at all</text>
  <rect x="210" y="60" width="346.3" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="564.3" y="75.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2.96</text>
  <text x="200.0" y="107.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">joint</text>
  <rect x="210" y="92" width="247.8" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="465.8" y="107.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">2.12</text>
  <text x="200.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">Russian cut to 3,270</text>
  <rect x="210" y="124" width="220.0" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="438.0" y="139.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.88</text>
  <text x="200.0" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">Belarusian only, 4,000</text>
  <rect x="210" y="156" width="199.5" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="417.5" y="171.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.70</text>
  <text x="200.0" y="203.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">Belarusian x18</text>
  <rect x="210" y="188" width="189.7" height="22" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="407.7" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1.62</text>
  <line x1="387.2" y1="24" x2="387.2" y2="220" style="stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3"/>
  <text x="387.2" y="234.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Russian, joint 1.51</text>
</svg>
<figcaption>The same 2,323 Belarusian words under different vocabularies. In colour: the recipe from the README.</figcaption>
</figure>

## The threshold

The README of `subword-nmt` warns that with a joint vocabulary a word can be cut into pieces seen only in the other language. It recommends building a vocabulary per language and applying BPE again with `--vocabulary-threshold 50`. I had no expectation here, I followed the recipe.

Belarusian went from 2.12 to 3.28 pieces per word. A vocabulary trained only on English and Russian, which has not seen a single Belarusian line, gives 2.96. So the recipe is 1.11 times worse than no Belarusian at all (from 1.09 to 1.13). 53% of the pieces are single letters cut from longer words. `інфармацыі` is now `і|н|ф|а|р|ма|ц|ы|і`.

The reason is arithmetic. Under the joint codes the Belarusian training text has 1,774 different pieces, only 186 of them occur 50 times or more. The rest are split back. With a threshold of 20 it is 2.60, with 5 it is 2.24. Russian and English also lose, to 2.06 and 1.67, because even 60,000 sentences are few for this threshold. The advice was not meant for a corpus of 3,270 lines, but the README shows 50 and I would have copied it.

## Where the meaning breaks

The number of pieces says little about meaning, so I took Universal Dependencies 2.1, which has a dictionary form for every word. For content words (nouns, verbs, adjectives) of 5 letters or more I took the common beginning of the 2 forms, at least 3 letters, as the stem. Then I looked if some cut falls at the end of the stem. Russian and English gave many more pairs, so there I took a random sample of the same size.

My first table looked fine. Then I read the list of examples. The dictionary form of "banking" was cut with a lonely `i` at the end. It was a Latin i. The Belarusian treebank has 69 dictionary forms where a Latin letter sits inside a Cyrillic word. Tatoeba gave me 28 words like that. `краіну` with a Latin i goes to `кра|i|ну` instead of `краі|ну`. I dropped 85 pairs with Latin letters and 1,597 remained. The numbers moved by less than 1 point.

The second mistake I found when I was preparing the figure below. For `справах` my rule took the whole `справа` as the stem. So for Slavic nouns and adjectives I now remove the dictionary ending first. Verbs and English stay with the common beginning.

Among the Belarusian words that were cut, 25.8% have a cut at the end of the stem. The same number of cuts at random places would give 36.3%. For Russian it is 19.7% against 26.2%, for English 14.4% against 25.7%. In 59.8% of the cut Belarusian words there is no cut at the end of the stem but there is one a letter earlier, when random cuts would give 25.6%. The last letter of the stem goes into the ending. Last pieces like `ных` and `нага` are frequent, an ending with a consonant glued to it. 88% of the last pieces begin with a consonant.

By part of speech it differs a lot. For adjectives the cut is in the right place in 6.3% of words, for nouns in 15.5%. For verbs it is 70.1%, about 2 times more often than random cuts (33.7%). But my verb stem is the common beginning with the infinitive, it often ends with a vowel and what follows is `ў` or `ла`. So a part of this 70% is my own rule.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Seven forms of the Belarusian noun справа cut into pieces. Joint vocabulary: спра|ва, спра|вы, с|прав|е, с|прав|у, спра|вай, спра|ў, спра|вах. Belarusian lines repeated 18 times: справа, справы, справе, спра|ву, спра|вай, спра|ў, спра|ва|х. The stem is 5 letters long, спраў has no ending.">
  <text x="130.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">joint</text>
  <text x="420.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">Belarusian x18</text>
  <text x="14.0" y="47.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справа</text>
  <rect x="130.0" y="30" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="30" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M191.0 65 L199.0 65 L195.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="30" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="47.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справа</text>
  <path d="M462.0 65 L470.0 65 L466.0 58 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="89.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справы</text>
  <rect x="130.0" y="72" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="72" width="29.6" height="26" class="f-box"/>
  <text x="195.0" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вы</text>
  <path d="M191.0 107 L199.0 107 L195.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="72" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="89.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справы</text>
  <path d="M462.0 107 L470.0 107 L466.0 100 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="131.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справе</text>
  <rect x="130.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="114" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 149 L208.5 149 L204.5 142 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="114" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="131.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">е</text>
  <rect x="420.0" y="114" width="60.8" height="26" class="f-box"/>
  <text x="450.4" y="131.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">справе</text>
  <path d="M462.0 149 L470.0 149 L466.0 142 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="173.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справу</text>
  <rect x="130.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="140.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">с</text>
  <rect x="156.8" y="156" width="45.2" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="179.4" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">прав</text>
  <path d="M200.5 191 L208.5 191 L204.5 184 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="207.0" y="156" width="21.8" height="26" class="f-box" style="stroke:var(--accent)"/>
  <text x="217.9" y="173.5" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">у</text>
  <rect x="420.0" y="156" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="156" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="173.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ву</text>
  <path d="M481.0 191 L489.0 191 L485.0 184 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="215.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справай</text>
  <rect x="130.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M191.0 233 L199.0 233 L195.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="198" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="198" width="37.4" height="26" class="f-box"/>
  <text x="488.9" y="215.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вай</text>
  <path d="M481.0 233 L489.0 233 L485.0 226 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="257.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">спраў</text>
  <rect x="130.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="191.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M198.0 275 L206.0 275 L202.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="240" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="240" width="21.8" height="26" class="f-box"/>
  <text x="481.1" y="257.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ў</text>
  <path d="M488.0 275 L496.0 275 L492.0 268 Z" style="fill:var(--ink);stroke:none"/>
  <text x="14.0" y="299.5" text-anchor="start" class="f-mono f-muted" style="font-size:13px">справах</text>
  <rect x="130.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="152.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="180.2" y="282" width="37.4" height="26" class="f-box"/>
  <text x="198.9" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">вах</text>
  <path d="M191.0 317 L199.0 317 L195.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="420.0" y="282" width="45.2" height="26" class="f-box"/>
  <text x="442.6" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">спра</text>
  <rect x="470.2" y="282" width="29.6" height="26" class="f-box"/>
  <text x="485.0" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">ва</text>
  <path d="M481.0 317 L489.0 317 L485.0 310 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="504.8" y="282" width="21.8" height="26" class="f-box"/>
  <text x="515.7" y="299.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">х</text>
  <path d="M14 336 L22 336 L18 329 Z" style="fill:var(--ink);stroke:none"/>
  <text x="30.0" y="336.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">end of the stem</text>
</svg>
<figcaption>Forms of the noun справа (a matter). The triangle is the end of the stem. Only 2 of 7 joint forms are cut there. These 2 share no piece with the others.</figcaption>
</figure>

The noun `справа` (a matter) shows it. Under the joint vocabulary 5 of its forms begin with `спра` and 2 become `с|прав|е` and `с|прав|у`. The piece `прав` grew from Russian text. These 2 forms share no piece with the other 5.

After the repetition 3 forms are whole words without a common piece. In the whole set 60.7% of Belarusian pairs (a form and its dictionary form) had a common piece of 3 letters or more, after the repetition 57.3%. The drop is 3.4 points, bootstrap from 0.9 to 6.0.

I had expected that fewer pieces would also be better pieces and I don't see it. After the repetition 17.5% of the cut words have a cut at the end of the stem against 28.0% at random. The distance to random is the same 10.5 points as before.

## What I didn't check

I trained no translation model, so I don't know what any of this costs in BLEU. The stem is still a rough rule, when its last consonant changes it comes out shorter than a linguist would say. Tatoeba sentences are short and simple. At least 33 of the Belarusian training lines are in the old orthography, with a soft sign in `сьць`. There was one random sample of the training data and the same 400 test sentences all the time.
