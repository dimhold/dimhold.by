---
title: "The cheapest language on T5 is the one it cannot read"
description: "The same 5010 XNLI test pairs in 15 languages on the tokenizers of January 2020. GPT-2 charges Thai 7.99 times English. T5 makes Thai 3 times cheaper than English by losing 95% of it in <unk>. On mBERT the --max_seq_length=128 from the README cuts 1 Thai pair in 4 and no English one."
date: 2020-01-15
lang: en
translationKey: token-tax-xnli
tags: ["llm", "machine-learning", "text"]
---
The multilingual BERT README has a command for training on XNLI, a test set in 15 languages. One of the flags is `--max_seq_length=128`, which is also the default in `run_classifier.py`. I have always read "128 tokens" as "a long sentence", in any language. A token in my head is a word, give or take a suffix. I never counted what 128 means in Thai or in Greek.

So I counted, on the 4 tokenizers I could get this January, to see whether the problem belongs to BERT or to the language.

## The setup

XNLI test has 5010 pairs of a premise and a hypothesis. Both sides start in English, the premises from existing texts and the hypotheses from crowd workers. Professional translators put them into 14 other languages, so only the language changes. My tax below is the token count of a language divided by the token count of English on the same tokenizer. It is counted over all 5010 pairs, without special tokens.

The tokenizers:

- GPT-2, a byte level BPE with 50257 entries, from February last year;
- T5, a SentencePiece vocabulary of 32000 pieces plus 100 sentinels, from October. The paper says it was trained mostly on English, with some German, French and Romanian;
- multilingual BERT, cased, a WordPiece vocabulary of 119547 entries for 104 languages;
- XLM-R, a SentencePiece vocabulary of 250002 entries for 100 languages, published in November.

I counted with the Hugging Face code. Then I checked every count on all 15 languages against the original code. For T5 and XLM-R that is their sentencepiece model files, for mBERT it is `tokenization.py` from Google's repository. For mBERT the first check did not match, I come back to it below.

Before counting I wrote down what I expected. On GPT-2 Russian should cost 4 to 6 times English. For Thai and Hindi I wrote 8 or more, because their letters are 3 bytes in UTF-8. mBERT between 1.1 and 1.8, XLM-R between 1.0 and 1.4. T5 should throw everything outside Latin script into `<unk>`.

## GPT-2

On GPT-2 the English pairs are 171534 tokens. Russian is 5.26 times that, Greek 5.77, Hindi 6.86 and Thai 7.99. The 3 Western European languages stay between 1.77 and 2.00. Chinese is only 2.81. Its characters cost about 2 tokens each, but the same pairs need about 3 times fewer of them than English needs letters.

An English pair is 34 tokens on average and a Thai one 273. GPT-2 has a window of 1024 tokens, so about 30 English pairs fit in it and 3 Thai ones. "We had a great talk." is 6 tokens in English and its Thai translation is 50.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="&quot;We had a great talk.&quot; in English and in Thai, cut into tokens. GPT-2, English: 6 tokens. GPT-2, Thai: 50 tokens. T5, English: 7 tokens. T5, Thai: 2 tokens. mBERT, English: 6 tokens. mBERT, Thai: 21 tokens. XLM-R, English: 6 tokens. XLM-R, Thai: 7 tokens.">
  <text x="10" y="33" class="f-mono f-ink" style="font-size:12px">GPT-2</text>
  <text x="142.0" y="33.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">English</text>
  <rect x="150.0" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="23" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="33.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Thai</text>
  <rect x="150.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="362.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="372.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="382.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="392.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="402.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="412.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="422.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="432.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="442.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="453.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="463.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="473.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="483.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="493.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="503.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="513.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="523.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="533.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="543.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="554.0" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="564.1" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="574.2" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="584.3" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="594.4" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="604.5" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="614.6" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="624.7" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="634.8" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="644.9" y="45" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="661.0" y="55.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">50</text>
  <text x="10" y="87" class="f-mono f-ink" style="font-size:12px">T5</text>
  <text x="142.0" y="87.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">English</text>
  <rect x="150.0" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="210.6" y="77" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="226.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
  <text x="142.0" y="109.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Thai</text>
  <rect x="150.0" y="99" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="99" width="60" height="13" rx="1.5" class="f-accent" style="stroke:none"/>
  <text x="190.1" y="109" text-anchor="middle" class="f-mono" style="font-size:10px;fill:var(--surface)">&lt;unk&gt;</text>
  <text x="241.4" y="109.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="10" y="141" class="f-mono f-ink" style="font-size:12px">mBERT</text>
  <text x="142.0" y="141.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">English</text>
  <rect x="150.0" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="131" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="141.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Thai</text>
  <rect x="150.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="220.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="230.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="240.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="251.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="261.1" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="271.2" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="281.3" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="291.4" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="301.5" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="311.6" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="321.7" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="331.8" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="341.9" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="352.0" y="153" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="368.1" y="163.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">21</text>
  <text x="10" y="195" class="f-mono f-ink" style="font-size:12px">XLM-R</text>
  <text x="142.0" y="195.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">English</text>
  <rect x="150.0" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="160.1" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="170.2" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="180.3" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="190.4" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <rect x="200.5" y="185" width="8.8" height="13" rx="1.5" class="f-box"/>
  <text x="216.6" y="195.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="142.0" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">Thai</text>
  <rect x="150.0" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="160.1" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="170.2" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="180.3" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="190.4" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="200.5" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <rect x="210.6" y="207" width="8.8" height="13" rx="1.5" style="fill:var(--muted);stroke:none;opacity:0.55"/>
  <text x="226.7" y="217.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">7</text>
</svg>
<figcaption>The same XNLI hypothesis in English next to its Thai translation. Every cell is one token. On T5 the Thai sentence is a space marker and one &lt;unk&gt;.</figcaption>
</figure>

## T5 and the cheap Thai

Then T5 gave me Thai at 0.31 times English and Chinese at 0.27. I had written that T5 loses text outside Latin script. Still, for a moment I looked at the number as a discount.

The Thai sentence about the talk is 2 tokens on T5: a space marker and one `<unk>`. A run of unknown characters becomes a single `<unk>`, so a Thai sentence without spaces collapses into almost nothing. I counted the characters that end up inside `<unk>` pieces. In Thai it is 95.4% of them, in Arabic 96.5%, Hindi 93.5%, Greek 93.2%, Chinese 87.0%.

Russian is a more confusing case. On T5 it costs 3.24 times English and 21.8% of its letters still disappear. The vocabulary has 80 pieces with Cyrillic in them, like "ре" or "ра". Probably they came from Cyrillic leftovers in the English training data. But there is no п, ы, я or ь. So the model pays more than for English and also does not see a fifth of the letters. Spanish loses 0.9% of its characters, which surprised me more. T5 has no "í", so "aquí" goes to the model as "aqu" and a hole.

If I had ranked by tax only, T5 would show Thai and Chinese as its best languages. So the figure marks where most of the text went to `<unk>`.

<figure class="fig">
<svg viewBox="0 0 680 382" role="img" aria-label="Tokens per language as a multiple of English, XNLI test, 5010 pairs, logarithmic scale. English: GPT-2 1.00, T5 1.00, mBERT 1.00, XLM-R 1.00. Spanish: GPT-2 1.77, T5 1.96, mBERT 1.14, XLM-R 1.07. French: GPT-2 1.86, T5 1.52, mBERT 1.28, XLM-R 1.25. Swahili: GPT-2 1.93, T5 2.40, mBERT 1.39, XLM-R 1.07. German: GPT-2 2.00, T5 1.27, mBERT 1.19, XLM-R 1.11. Turkish: GPT-2 2.24, T5 2.44, mBERT 1.31, XLM-R 0.99. Chinese: GPT-2 2.81, T5 0.27 &lt;unk&gt;, mBERT 1.26, XLM-R 0.86. Arabic: GPT-2 3.99, T5 1.32 &lt;unk&gt;, mBERT 1.38, XLM-R 1.08. Vietnamese: GPT-2 4.31, T5 3.50, mBERT 1.24, XLM-R 1.15. Bulgarian: GPT-2 5.20, T5 3.17, mBERT 1.50, XLM-R 1.13. Russian: GPT-2 5.26, T5 3.24, mBERT 1.38, XLM-R 1.11. Urdu: GPT-2 5.65, T5 1.82 &lt;unk&gt;, mBERT 1.56, XLM-R 1.16. Greek: GPT-2 5.77, T5 1.58 &lt;unk&gt;, mBERT 2.00, XLM-R 1.31. Hindi: GPT-2 6.86, T5 1.74 &lt;unk&gt;, mBERT 1.67, XLM-R 1.20. Thai: GPT-2 7.99, T5 0.31 &lt;unk&gt;, mBERT 2.67, XLM-R 0.99.">
  <line x1="150.8" y1="16" x2="150.8" y2="318" class="f-plain" />
  <text x="150.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.25</text>
  <line x1="246.5" y1="16" x2="246.5" y2="318" class="f-plain" />
  <text x="246.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0.5</text>
  <line x1="342.2" y1="16" x2="342.2" y2="318" class="f-plain" style="stroke:var(--muted)"/>
  <text x="342.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="437.8" y1="16" x2="437.8" y2="318" class="f-plain" />
  <text x="437.8" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="533.5" y1="16" x2="533.5" y2="318" class="f-plain" />
  <text x="533.5" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="629.2" y1="16" x2="629.2" y2="318" class="f-plain" />
  <text x="629.2" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <text x="110.0" y="28.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">English</text>
  <circle cx="342.2" cy="24" r="4" style="fill:var(--muted)"/>
  <circle cx="342.2" cy="24" r="4" class="f-accent"/>
  <rect x="338.2" y="20" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="342.2" cy="24" r="4" class="f-ink"/>
  <text x="110.0" y="48.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Spanish</text>
  <circle cx="360.2" cy="44" r="4" style="fill:var(--muted)"/>
  <circle cx="351.8" cy="44" r="4" class="f-accent"/>
  <rect x="431.1" y="40" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="420.8" cy="44" r="4" class="f-ink"/>
  <text x="110.0" y="68.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">French</text>
  <circle cx="376.6" cy="64" r="4" style="fill:var(--muted)"/>
  <circle cx="372.6" cy="64" r="4" class="f-accent"/>
  <rect x="395.8" y="60" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="427.8" cy="64" r="4" class="f-ink"/>
  <text x="110.0" y="88.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Swahili</text>
  <circle cx="388.0" cy="84" r="4" style="fill:var(--muted)"/>
  <circle cx="351.4" cy="84" r="4" class="f-accent"/>
  <rect x="459.0" y="80" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="433.2" cy="84" r="4" class="f-ink"/>
  <text x="110.0" y="108.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">German</text>
  <circle cx="365.8" cy="104" r="4" style="fill:var(--muted)"/>
  <circle cx="355.9" cy="104" r="4" class="f-accent"/>
  <rect x="371.1" y="100" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="438.0" cy="104" r="4" class="f-ink"/>
  <text x="110.0" y="128.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Turkish</text>
  <circle cx="379.3" cy="124" r="4" style="fill:var(--muted)"/>
  <circle cx="341.0" cy="124" r="4" class="f-accent"/>
  <rect x="461.1" y="120" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="453.3" cy="124" r="4" class="f-ink"/>
  <text x="110.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Chinese</text>
  <circle cx="373.7" cy="144" r="4" style="fill:var(--muted)"/>
  <circle cx="321.8" cy="144" r="4" class="f-accent"/>
  <rect x="159.2" y="140" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M159.2,140l8,8M167.2,140l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="484.6" cy="144" r="4" class="f-ink"/>
  <text x="110.0" y="168.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Arabic</text>
  <circle cx="386.5" cy="164" r="4" style="fill:var(--muted)"/>
  <circle cx="352.1" cy="164" r="4" class="f-accent"/>
  <rect x="376.9" y="160" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M376.9,160l8,8M384.9,160l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="533.0" cy="164" r="4" class="f-ink"/>
  <text x="110.0" y="188.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Vietnamese</text>
  <circle cx="372.1" cy="184" r="4" style="fill:var(--muted)"/>
  <circle cx="361.9" cy="184" r="4" class="f-accent"/>
  <rect x="511.0" y="180" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="543.8" cy="184" r="4" class="f-ink"/>
  <text x="110.0" y="208.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Bulgarian</text>
  <circle cx="398.2" cy="204" r="4" style="fill:var(--muted)"/>
  <circle cx="358.6" cy="204" r="4" class="f-accent"/>
  <rect x="497.4" y="200" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="569.8" cy="204" r="4" class="f-ink"/>
  <text x="110.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Russian</text>
  <circle cx="386.4" cy="224" r="4" style="fill:var(--muted)"/>
  <circle cx="356.3" cy="224" r="4" class="f-accent"/>
  <rect x="500.3" y="220" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="571.2" cy="224" r="4" class="f-ink"/>
  <text x="110.0" y="248.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Urdu</text>
  <circle cx="403.2" cy="244" r="4" style="fill:var(--muted)"/>
  <circle cx="362.9" cy="244" r="4" class="f-accent"/>
  <rect x="421.1" y="240" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M421.1,240l8,8M429.1,240l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="581.2" cy="244" r="4" class="f-ink"/>
  <text x="110.0" y="268.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Greek</text>
  <circle cx="437.6" cy="264" r="4" style="fill:var(--muted)"/>
  <circle cx="379.7" cy="264" r="4" class="f-accent"/>
  <rect x="401.2" y="260" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M401.2,260l8,8M409.2,260l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="584.2" cy="264" r="4" class="f-ink"/>
  <text x="110.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Hindi</text>
  <circle cx="412.8" cy="284" r="4" style="fill:var(--muted)"/>
  <circle cx="367.0" cy="284" r="4" class="f-accent"/>
  <rect x="415.0" y="280" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M415.0,280l8,8M423.0,280l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="608.0" cy="284" r="4" class="f-ink"/>
  <text x="110.0" y="308.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Thai</text>
  <circle cx="477.6" cy="304" r="4" style="fill:var(--muted)"/>
  <circle cx="340.2" cy="304" r="4" class="f-accent"/>
  <rect x="175.4" y="300" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <path d="M175.4,300l8,8M183.4,300l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <circle cx="629.0" cy="304" r="4" class="f-ink"/>
  <text x="390" y="350" text-anchor="middle" class="f-label f-muted" style="font-size:10px">times English, log scale</text>
  <circle cx="24" cy="368" r="4" class="f-ink"/>
  <text x="34.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">GPT-2</text>
  <rect x="100" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="114.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5</text>
  <rect x="160" y="364" width="8" height="8" style="fill:none;stroke:var(--ink);stroke-width:1.2"/><path d="M160,364l8,8M168,364l-8,8" style="stroke:var(--ink);stroke-width:1.2"/>
  <text x="174.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T5, mostly &lt;unk&gt;</text>
  <circle cx="379" cy="368" r="4" style="fill:var(--muted)"/>
  <text x="389.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">mBERT</text>
  <circle cx="459" cy="368" r="4" class="f-accent"/>
  <text x="469.0" y="372.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">XLM-R</text>
</svg>
<figcaption>Token count of each language divided by the English count on the same tokenizer, 5010 XNLI test pairs. A crossed T5 square means more than half of the characters went into &lt;unk&gt;.</figcaption>
</figure>

## mBERT and the 128

mBERT is in the range I expected for most languages: Spanish 1.14, Russian 1.38, Hindi 1.67. Greek is 2.00 and Thai 2.67.

With `[CLS]` and 2 `[SEP]` added, no English pair goes above 128 tokens, the longest one is 92. In Thai 1222 of the 5010 pairs go above. That is 24.4%. For those pairs `_truncate_seq_pair` cuts tokens from the longer sentence until the pair fits. In total 6.5% of the Thai text tokens never reach the model. Greek has 213 such pairs, Hindi 24, Urdu 7, Russian 1. For Thai the flag keeps the full text in 3 pairs of 4.

My first numbers for Thai were different. The Hugging Face port gave 2.47 and 7.7% of the Thai characters in `[UNK]`. I nearly wrote it down as a fact about mBERT. Thai has no spaces between words and BERT's basic tokenizer splits on spaces and punctuation. So a Thai "word" here is often a long piece of a sentence. The port marks any word longer than 100 characters as `[UNK]`. Google's `tokenization.py` uses 200, it was 100 there too until November 2018. With 200 the Thai `[UNK]` share falls to 0.23% and the count matches Google's code line by line. The 100 is still the default in the port, in version 2.3.0 from December too. Anyone who tokenizes Thai through it loses those pieces without an error. The number they get is also cheaper than the one Google's own code gives.

<figure class="fig">
<svg viewBox="0 0 680 358" role="img" aria-label="XNLI test pairs longer than 128 mBERT tokens with [CLS] and 2 [SEP], of 5010. Thai 1222, Thai, port, limit 100: 939, Greek 213, Hindi 24, Urdu 7, Bulgarian 1, Swahili 1, Arabic 1, Russian 1, French 1, Turkish 0, Chinese 0, Vietnamese 0, German 0, Spanish 0, English 0.">
  <line x1="160.0" y1="12" x2="160.0" y2="300" class="f-plain"/>
  <text x="160.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="313.3" y1="12" x2="313.3" y2="300" class="f-plain"/>
  <text x="313.3" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <line x1="466.7" y1="12" x2="466.7" y2="300" class="f-plain"/>
  <text x="466.7" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="620.0" y1="12" x2="620.0" y2="300" class="f-plain"/>
  <text x="620.0" y="314.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="150.0" y="30.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Thai</text>
  <rect x="160" y="22" width="374.0" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="540.0" y="31.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1222</text>
  <text x="150.0" y="48.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">port, limit 100</text>
  <rect x="160" y="40" width="287.4" height="11" style="fill:var(--muted);stroke:none;opacity:0.5"/>
  <text x="453.4" y="49.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">939</text>
  <text x="150.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Greek</text>
  <rect x="160" y="58" width="65.2" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="231.2" y="67.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">213</text>
  <text x="150.0" y="84.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Hindi</text>
  <rect x="160" y="76" width="7.3" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="173.3" y="85.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">24</text>
  <text x="150.0" y="102.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Urdu</text>
  <rect x="160" y="94" width="2.1" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="168.1" y="103.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="150.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Bulgarian</text>
  <rect x="160" y="112" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="121.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Swahili</text>
  <rect x="160" y="130" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="139.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="156.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Arabic</text>
  <rect x="160" y="148" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="174.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Russian</text>
  <rect x="160" y="166" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="175.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="192.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">French</text>
  <rect x="160" y="184" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.3" y="193.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1</text>
  <text x="150.0" y="210.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Turkish</text>
  <rect x="160" y="202" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="211.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="228.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Chinese</text>
  <rect x="160" y="220" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="246.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Vietnamese</text>
  <rect x="160" y="238" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="247.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="264.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">German</text>
  <rect x="160" y="256" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="265.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="282.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">Spanish</text>
  <rect x="160" y="274" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="283.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="150.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">English</text>
  <rect x="160" y="292" width="0.8" height="11" style="fill:var(--ink);stroke:none"/>
  <text x="166.0" y="301.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="390" y="348" text-anchor="middle" class="f-label f-muted" style="font-size:10px">pairs over 128 tokens, % of 5010</text>
</svg>
<figcaption>mBERT cased. Dark bars: word limit 200 characters as in Google's tokenization.py. The light bar for Thai: limit 100 as in the Hugging Face port, where long Thai words become one [UNK].</figcaption>
</figure>

## XLM-R

XLM-R is flat. Everything is between 0.86 and 1.31 times English. Turkish and Thai are 0.99. Chinese is the lowest at 0.86, so it is cheaper than English. Only 1 French pair and 1 Greek pair go over 128. Nothing goes to `<unk>` except 16 Chinese tokens. The Thai talk sentence is 7 tokens, 1 more than English.

It is the only tokenizer of the 4 where every language stays within a third of English. The cost is a vocabulary 5 times bigger than GPT-2's. The embedding matrix grows with it and I did not measure what that costs.

## Hindi in Latin letters

One more thing moved my counts. This one is in the XNLI data itself. Some Hindi lines in the test set are in Latin letters, for example "Wo thoda deri se aaya". 319 Hindi pairs and 517 Urdu ones have at least one line without Devanagari or Arabic script. Without them the Hindi tax on GPT-2 goes from 6.86 to 7.05 and Urdu from 5.65 to 5.85. The numbers above are for the full set.

## What I did not check

- Only the token counts and truncation, not accuracy. Whether the cut Thai pairs make mBERT worse on XNLI I did not measure.
- XNLI is short sentences translated from English. Long documents written in the language from the start may tokenize differently.
- I did not test any T5 trained on more languages, because there is none published.
- The `<unk>` share counts characters, not meaning. A Russian word with 2 letters missing may still be guessed by the model. How often, I did not test.
