---
title: "GPT-3 reads Belarusian at 6.5 times the price of English"
description: "The same 1012 FLORES-101 sentences on the tokenizers of 2022. On GPT-2, which GPT-3 reuses, Russian costs 5.68 times English and Belarusian 6.47. Written in łacinka, Belarusian gets 54% cheaper there, but more expensive than Cyrillic on all 4 other tokenizers."
date: 2022-05-29
lang: en
translationKey: belarusian-token-tax
tags: ["llm", "machine-learning", "text"]
---
I am from Belarus and every post on this blog goes out in Belarusian too. GPT-3 is the obvious helper for that work now and it is paid by the token. Before using it I wanted to know what Belarusian costs there.

The OpenAI help page on tokens gives a rule of thumb: 1 token is about 4 characters of English text. I took that rule and applied it to Russian in my head with a correction. A Cyrillic letter is 2 bytes in UTF-8, the tokenizer works on bytes, so Russian should cost about twice as much, maybe a bit more. The same page has an example in Spanish and a sentence saying that other languages can be more expensive. I read past it and never counted either language.

Before counting I wrote my guess down: Russian about 4 times English, Belarusian about 5. It was still too low.

## The setup

The corpus is FLORES-101 devtest, published by Facebook last June. It has 1012 sentences translated by people from English into 100 other languages, so the meaning stays fixed and only the language changes. I took English, Russian, Belarusian, plus Ukrainian and Polish to compare. Every sentence is encoded alone, without special tokens. The tax is the token count of a language divided by the token count of English on the same tokenizer.

The GPT-3 paper says the model reuses the tokenization of GPT-2, a byte level BPE whose vocabulary is public since 2019. Next to it I took 4 more tokenizers. ruGPT-3 from Sber was trained on Russian. mBERT, XLM-R and mT5 are multilingual and had Belarusian in their training data. The counting is done with tokenizers 0.12.1 and sentencepiece 0.1.96.

People counted this before me for mBERT. Ács looked at its vocabulary in 2019 and measured how it splits words in 54 of its 104 languages. Rust and others compared it with monolingual tokenizers last year, Russian included. I did not find anyone who put Belarusian through the GPT-3 tokenizer or compared it in Cyrillic and in Latin letters on the same sentences.

## 6.47 times

On GPT-2 English is 27044 tokens. Russian is 5.68 times that and Belarusian 6.47. Ukrainian is 5.71, almost the same as Russian. Polish, which uses Latin letters with diacritics, is 2.68.

At the Davinci price, $0.06 per 1000 tokens, the English corpus costs $1.62 and the Belarusian one $10.50. The base Davinci model takes 2048 tokens for prompt and answer together. An average English sentence here is 27 tokens and a Belarusian one 173, so the window fits 76 English sentences and 11 Belarusian ones.

The multilingual tokenizers are much milder: on XLM-R Russian is 1.16 times English and Belarusian 1.45, on mBERT Belarusian is 1.99.

<figure class="fig">
<svg viewBox="0 0 680 200" role="img" aria-label="Horizontal bars, tokens for the same 1012 FLORES-101 sentences on the GPT-2 tokenizer, which GPT-3 reuses. English 27044 tokens, $1.62 at the Davinci price. Polish 72506, 2.68 times English. Belarusian in łacinka 80633, 2.98 times. Russian 153482, 5.68 times. Ukrainian 154487, 5.71 times. Belarusian in Cyrillic 175080, 6.47 times, $10.50.">
  <text x="10" y="16" class="f-label f-muted">tokens on GPT-2, times English, price at Davinci</text>
  <text x="182" y="44" text-anchor="end" class="f-label f-ink">English</text>
  <rect x="190" y="30" width="51.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="247.0" y="44" class="f-label f-ink">×1  $1.62</text>
  <text x="182" y="72" text-anchor="end" class="f-label f-ink">Polish</text>
  <rect x="190" y="58" width="136.7" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="332.7" y="72" class="f-label f-ink">×2.68  $4.35</text>
  <text x="182" y="100" text-anchor="end" class="f-label f-ink">Belarusian, łacinka</text>
  <rect x="190" y="86" width="152.0" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="348.0" y="100" class="f-label f-accent">×2.98  $4.84</text>
  <text x="182" y="128" text-anchor="end" class="f-label f-ink">Russian</text>
  <rect x="190" y="114" width="289.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="485.3" y="128" class="f-label f-ink">×5.68  $9.21</text>
  <text x="182" y="156" text-anchor="end" class="f-label f-ink">Ukrainian</text>
  <rect x="190" y="142" width="291.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="487.2" y="156" class="f-label f-ink">×5.71  $9.27</text>
  <text x="182" y="184" text-anchor="end" class="f-label f-ink">Belarusian</text>
  <rect x="190" y="170" width="330.0" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="526.0" y="184" class="f-label f-accent">×6.47  $10.50</text>
</svg>
<figcaption>The same 1012 sentences of FLORES-101 devtest on the GPT-2 tokenizer. Price at $0.06 per 1000 tokens, Davinci.</figcaption>
</figure>

Then I wanted to see the vocabulary itself. My first count said that GPT-2 has no Cyrillic in it at all. That cannot be right, because Russian came out at 1.08 tokens per character and not about 1.8, its bytes per character. I had forgotten to turn the byte pieces back into text before searching. The second count found 18 entries with Cyrillic out of 50257. 17 of them are single lowercase letters: о, а, е, и, т and others that are frequent in Russian. Every other letter is 2 tokens, its 2 bytes. Every capital is 2 tokens too.

So GPT-2 reads Cyrillic letter by letter and Belarusian uses the expensive letters more. ў and і are not among the 17 and together they are 7.4% of all Belarusian letters. With з, ц, ч, ш, the capitals and the others, 29.1% of Belarusian letters cost 2 tokens, against 17.0% of Russian ones. The Belarusian translation also has about 4% more letters. A count of only the letters, 1 token or 2 each, explains about 90% of the 21598 tokens Belarusian takes over Russian.

## Latin letters

Belarusian has its own Latin alphabet, łacinka, with č, š, ž, ŭ and ł. If the cost comes from the alphabet, the same words written in łacinka should be much cheaper on GPT-2. I wrote a rough converter with the classical rules for ł/l, ia/ja and the soft ś before a soft consonant. It has no exceptions for loanwords. A Belarusian reader would find mistakes in its output, but the words stay the same and only the letters change.

On GPT-2 łacinka costs 2.98 times English instead of 6.47, so the bill drops by 54%. "навукоўцы" (scientists) is 12 tokens in Cyrillic and 5 as "navukoŭcy". This part matched my expectation, I had written down at least 30% cheaper.

<figure class="fig">
<svg viewBox="0 0 680 148" role="img" aria-label="How 3 tokenizers cut the word навукоўцы (scientists). GPT-2, Cyrillic: 12 tokens. The letters а, в, у, к, о, ы are 1 token each, н, ў and ц are split into their 2 bytes, and the first byte of н is glued to the space. GPT-2, the same word in łacinka, navukoŭcy: 5 tokens, nav, uko, 2 halves of ŭ, cy. XLM-R, Cyrillic: 2 tokens, навук and оўцы.">
  <text x="140" y="34" text-anchor="end" class="f-label f-ink">GPT-2, Cyrillic</text>
  <rect x="150" y="14" width="41" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="170.5" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">␣½н</text>
  <rect x="195" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="211" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½н</text>
  <rect x="231" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="246" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">а</text>
  <rect x="265" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="280" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">в</text>
  <rect x="299" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="314" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">у</text>
  <rect x="333" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="348" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">к</text>
  <rect x="367" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="382" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">о</text>
  <rect x="401" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="417" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ў</text>
  <rect x="437" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="453" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ў</text>
  <rect x="473" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="489" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ц</text>
  <rect x="509" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="525" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ц</text>
  <rect x="545" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="560" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">ы</text>
  <text x="585" y="34" class="f-label f-muted">12</text>
  <text x="140" y="78" text-anchor="end" class="f-label f-ink">GPT-2, łacinka</text>
  <rect x="150" y="58" width="50" height="30" rx="3" class="f-box"/>
  <text x="175" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">␣nav</text>
  <rect x="204" y="58" width="41" height="30" rx="3" class="f-box"/>
  <text x="224.5" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">uko</text>
  <rect x="249" y="58" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="265" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ŭ</text>
  <rect x="285" y="58" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="301" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ŭ</text>
  <rect x="321" y="58" width="32" height="30" rx="3" class="f-box"/>
  <text x="337" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">cy</text>
  <text x="363" y="78" class="f-label f-muted">5</text>
  <text x="140" y="122" text-anchor="end" class="f-label f-ink">XLM-R, Cyrillic</text>
  <rect x="150" y="102" width="68" height="30" rx="3" class="f-box"/>
  <text x="184" y="122" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">▁навук</text>
  <rect x="222" y="102" width="50" height="30" rx="3" class="f-box"/>
  <text x="247" y="122" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">оўцы</text>
  <text x="282" y="122" class="f-label f-muted">2</text>
</svg>
<figcaption>The word navukoŭcy, scientists. Half a letter means one of its 2 UTF-8 bytes. н is 1 token alone, here the leading space takes its first byte. English scientists is 1 token on GPT-2, Russian учёные 9.</figcaption>
</figure>

Then I ran the same conversion on the other 4 tokenizers and it went the other way on every one of them. On mBERT łacinka is 6% more expensive than Cyrillic and on ruGPT-3 52%, with mT5 and XLM-R between. The 3 multilingual tokenizers saw Belarusian in Cyrillic during training. I think they learned its pieces and Latin spellings of the same words were rare in their data, ŭ especially. On XLM-R "навукоўцы" is 2 tokens, one less than Russian "учёные". In łacinka it is 4. ruGPT-3 has only 2 vocabulary entries with ў, but probably the same works there: it learned Cyrillic pieces from Russian and łacinka throws them away.

<figure class="fig">
<svg viewBox="0 0 680 200" role="img" aria-label="Bars, cost of Belarusian in łacinka divided by its cost in Cyrillic, on 5 tokenizers. Below 1 means łacinka is cheaper. GPT-2: 0.46. mBERT: 1.06. mT5: 1.12. XLM-R: 1.31. ruGPT-3: 1.52.">
  <text x="10" y="16" class="f-label f-muted">łacinka tokens / Cyrillic tokens</text>
  <line x1="382.5" y1="26" x2="382.5" y2="170" class="f-line" stroke-dasharray="4 3"/>
  <text x="376.5" y="184" text-anchor="end" class="f-label f-muted">← cheaper</text>
  <text x="388.5" y="184" class="f-label f-muted">more expensive →</text>
  <text x="112" y="44" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GPT-2</text>
  <rect x="120" y="30" width="120.8" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="246.8" y="44" class="f-label f-accent">0.46</text>
  <text x="112" y="72" text-anchor="end" class="f-mono f-ink" style="font-size:12px">mBERT</text>
  <rect x="120" y="58" width="278.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="404.3" y="72" class="f-label f-ink">1.06</text>
  <text x="112" y="100" text-anchor="end" class="f-mono f-ink" style="font-size:12px">mT5</text>
  <rect x="120" y="86" width="294.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="420.0" y="100" class="f-label f-ink">1.12</text>
  <text x="112" y="128" text-anchor="end" class="f-mono f-ink" style="font-size:12px">XLM-R</text>
  <rect x="120" y="114" width="343.9" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="469.9" y="128" class="f-label f-ink">1.31</text>
  <text x="112" y="156" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ruGPT-3</text>
  <rect x="120" y="142" width="399.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="525.0" y="156" class="f-label f-ink">1.52</text>
</svg>
<figcaption>The same Belarusian sentences converted to łacinka by my rough converter. Only GPT-2 gets cheaper.</figcaption>
</figure>

## The neighbour's tokenizer

ruGPT-3 has the same structure as GPT-2, a byte level BPE with 50257 entries, but it learned its merges on Russian. For Russian, Sber removed most of the tax: on it Russian takes 29833 tokens, 1.10 times what English takes on GPT-2.

I expected Belarusian to profit from that, the languages are close and most of the letters are shared. On ruGPT-3 Belarusian is 2.12 times Russian. On GPT-2 the gap was only 1.14, because both languages were equally badly served there. 78% of Russian words are a single token on ruGPT-3 and 27% of Belarusian ones. "навукоўцы" is 5 tokens where "учёные" is 1.

The 2 letters again looked like the cause. I replaced ў with у and і with и in the whole Belarusian corpus. On GPT-2 that closes 42% of the gap to Russian, which fits the letter by letter reading. On ruGPT-3 only 16%. There the vocabulary has whole Russian words and Belarusian words are simply different words, so swapping letters does not make them Russian. My guess is that this is the bigger part of the 2.12, but I did not separate it.

## What I did not check

- Only the cost in tokens. Whether GPT-3 answers worse in Belarusian, I did not measure.
- My łacinka converter is rough. My first version had no ji after vowels and no soft ś. Adding them moved GPT-2 from 2.91 to 2.98 and the other 4 stayed more expensive than Cyrillic. A careful human transliteration may move it a bit more.
- FLORES is text from Wikimedia projects like Wikinews, translated from English. Text written in Belarusian from the start may tokenize differently.
- OpenAI may change the tokenizer for newer models. I counted with the GPT-2 vocabulary, which the GPT-3 paper itself calls "developed for an almost entirely English training dataset".
