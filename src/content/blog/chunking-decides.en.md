---
title: "I replaced the second half of a chunk and its vector did not change by a single bit"
description: "MiniLM L6 v2 reads 256 tokens and says nothing about the rest. On 1,409 SQuAD questions I measured what this does to chunk size, overlap and the default 4,000-character splitter, where 35.1% of the text reaches the vectors."
date: 2023-08-06
lang: en
translationKey: chunking-decides
tags: ["llm", "machine-learning", "numbers"]
---

The SHA-256 of the vector starts with `8b5453f091`. It belongs to a chunk about Super Bowl 50, 3,478 characters long. I kept the first half and replaced the second with the second half of a chunk about the United Methodist Church. At the joint it now reads `2½ sacks,he Methodists", being methodical`. The SHA-256 of the new vector starts with `8b5453f091`.

Nothing is broken. The model is `all-MiniLM-L6-v2`, it reads 256 tokens and the replaced half begins after token 347. There was no warning. The index gets a normal row, the search works.

I knew there was a limit. But I always took the chunk size from an example, in characters, tried several queries by eye and moved on. I never counted how much of my text is really inside the vectors.

## One model, 3 limits

The revision of the model on the Hugging Face hub is from November 2022. Its `tokenizer.json` truncates at 128 tokens. `sentence_bert_config.json` says 256, while `config.json` and `tokenizer_config.json` both say 512. The model card says that longer input is truncated at 256 and that training was limited to 128.

`sentence-transformers` 2.2.2 takes the 256 and passes `truncation='longest_first'` to the tokenizer, there is no warning anywhere in that file. Chroma 0.4.5 downloads an archive with the same `tokenizer.json` and overrides it with 256 in code. If you load that file on your own you get 128.

On the other side there is the splitter. LangChain 0.0.250 by default makes chunks up to 4,000 characters with an overlap of 200. That number does not know about the model at all.

<figure class="fig">
<svg viewBox="0 0 680 214" role="img" aria-label="A chunk of 729 tokens, whose second half from token 347 was replaced. With a limit of 128 or 256 tokens the hash of the vector stays the same: dc3316731f and 8b5453f091. With 512 it changes from 127b2a3216 to ef6685435c.">
  <text x="80.0" y="18.0" text-anchor="start" class="f-label f-muted">first half, kept</text>
  <text x="450.0" y="18.0" text-anchor="end" class="f-label f-muted">second half, replaced</text>
  <text x="560.0" y="18.0" text-anchor="middle" class="f-label f-muted">hash before / after</text>
  <text x="68.0" y="51.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">128</text>
  <rect x="80" y="34" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="34.0" width="64.0" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="44.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="560.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">dc3316731f</text>
  <text x="68.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">256</text>
  <rect x="80" y="82" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="82.0" width="128.9" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="560.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">8b5453f091</text>
  <text x="68.0" y="147.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">512</text>
  <rect x="80" y="130" width="370" height="24" class="f-box"/>
  <rect x="80.0" y="130.0" width="258.8" height="24.0" style="fill:var(--accent);stroke:none;opacity:0.75"/>
  <text x="560.0" y="140.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">127b2a3216</text>
  <text x="560.0" y="156.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">ef6685435c</text>
  <line x1="256.1" y1="26" x2="256.1" y2="166" class="f-line" style="stroke-dasharray:4 3"/>
  <text x="80.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">0</text>
  <text x="256.1" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">347</text>
  <text x="450.0" y="184.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">729</text>
  <text x="80.0" y="204.0" text-anchor="start" class="f-label f-muted">token of the chunk</text>
</svg>
<figcaption>One chunk of the default splitter, 729 tokens. The filled part is what the model reads at each limit. Cosine between the 2 vectors at 512 is 0.907.</figcaption>
</figure>

## Setup

I took 8 articles from SQuAD 1.1 dev and glued their paragraphs back into whole documents, 69,384 tokens in total. Each gave up to 200 questions, because Super Bowl 50 alone has 810 and would decide everything. That leaves 1,409 questions. The model is the ONNX file from the Chroma archive, onnxruntime 1.15.1 and tokenizers 0.13.3 on Python 3.11, mean pooling and cosine over the chunks of all 8 articles at once. A question counts as found if the gold answer lies completely inside one of the returned chunks, by offset.

Recall in the top 5 is not enough here. 5 chunks of 64 tokens are 320 tokens and 5 chunks of 1,016 are 5,080. So I also count recall inside a budget: take chunks by rank while they fit into 2,032 tokens of prompt. After "Lost in the Middle" by Liu and coauthors in July I would not want to send more text only because it fits.

Chunk sizes are 64, 127, 254 and so on, because 2 of 256 places go to the special tokens. I wrote my expectations down before the run.

## Where the size matters and where it is the truncation

<figure class="fig">
<svg viewBox="0 0 680 310" role="img" aria-label="Recall by chunk size, share of tokens read in brackets, top 5 and then the budget of 2,032 tokens. 64 (100.0%): 74.3 / 90.7; 127 (100.0%): 79.8 / 92.2; 254 (100.0%): 82.5 / 89.3; 508 (50.8%): 72.5 / 68.3; 508 (100.0%): 83.1 / 80.3; 1016 (26.2%): 71.8 / 47.8.">
  <line x1="50" y1="220.0" x2="670" y2="220.0" class="f-plain"/>
  <text x="42.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="173.5" x2="670" y2="173.5" class="f-plain"/>
  <text x="42.0" y="177.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="50" y1="127.0" x2="670" y2="127.0" class="f-plain"/>
  <text x="42.0" y="131.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="50" y1="80.5" x2="670" y2="80.5" class="f-plain"/>
  <text x="42.0" y="84.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="50" y1="34.0" x2="670" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <rect x="62.0" y="81.8" width="37.7" height="138.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="103.7" y="51.3" width="37.7" height="168.7" style="fill:var(--accent);stroke:none"/>
  <text x="80.8" y="76.8" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">74.3</text>
  <text x="122.5" y="46.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">90.7</text>
  <text x="101.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">64</text>
  <text x="101.7" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="165.3" y="71.6" width="37.7" height="148.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.0" y="48.5" width="37.7" height="171.5" style="fill:var(--accent);stroke:none"/>
  <text x="184.2" y="66.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">79.8</text>
  <text x="225.8" y="43.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">92.2</text>
  <text x="205.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">127</text>
  <text x="205.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="268.7" y="66.6" width="37.7" height="153.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="310.3" y="53.9" width="37.7" height="166.1" style="fill:var(--accent);stroke:none"/>
  <text x="287.5" y="61.6" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">82.5</text>
  <text x="329.2" y="48.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">89.3</text>
  <text x="308.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">254</text>
  <text x="308.3" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="372.0" y="85.2" width="37.7" height="134.8" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="413.7" y="93.0" width="37.7" height="127.0" style="fill:var(--accent);stroke:none"/>
  <text x="390.8" y="80.2" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">72.5</text>
  <text x="432.5" y="88.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">68.3</text>
  <text x="411.7" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="411.7" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">50.8%</text>
  <rect x="475.3" y="65.4" width="37.7" height="154.6" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="517.0" y="70.6" width="37.7" height="149.4" style="fill:var(--accent);stroke:none"/>
  <text x="494.2" y="60.4" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">83.1</text>
  <text x="535.8" y="65.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">80.3</text>
  <text x="515.0" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">508</text>
  <text x="515.0" y="254.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100%</text>
  <rect x="578.7" y="86.5" width="37.7" height="133.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="620.3" y="131.1" width="37.7" height="88.9" style="fill:var(--accent);stroke:none"/>
  <text x="597.5" y="81.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">71.8</text>
  <text x="639.2" y="126.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">47.8</text>
  <text x="618.3" y="238.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">1016</text>
  <text x="618.3" y="254.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">26.2%</text>
  <text x="50.0" y="16.0" text-anchor="start" class="f-label f-muted">found, % of 1,409 questions</text>
  <text x="50.0" y="276.0" text-anchor="start" class="f-label f-muted">below: chunk size in tokens, share of tokens the model reads</text>
  <rect x="50.0" y="288.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="68.0" y="298.0" text-anchor="start" class="f-label f-muted">top 5 chunks</text>
  <rect x="270.0" y="288.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="288.0" y="298.0" text-anchor="start" class="f-label f-muted">chunks that fit 2,032 tokens</text>
</svg>
<figcaption>Chunks of 508 tokens are shown twice, truncated at 256 and read whole at 512.</figcaption>
</figure>

From 64 to 254 tokens the result inside the budget is nearly flat: 90.7%, 92.2% and 89.3%. At 508 it falls to 68.3%, at 1,016 to 47.8%. The usual explanation is that a big chunk has a blurry vector. But I can lift the limit to 512 and let the model read the same 508-token chunks to the end. That gives 80.3%. So of the 21 points lost between 254 and 508, 12 come back when the text is really read. The other 9 are the size of the chunk mixed with an input 4 times longer than the model saw in training, I can't separate these 2.

I expected the smallest chunks to win at an equal budget and they did not. 64 tokens are 1.5 points below 127 with an interval from -3.3 to 0.4, so it is a draw at best. In the top 5 they lose by 5.5. 49 answers are cut by a chunk border at 64 tokens and 12 at 254.

Overlap was my other expectation. 254-token chunks with an overlap of 127 raise the first place from 50.7% to 60.8%, which is a lot. The top 5 gets 3.8 points more. Inside the budget it is 1.3 points, with an interval from -0.2 to 2.8, while the index is twice as big.

## Why I would not have noticed

In the top 5 the truncated 508-token chunks find 72.5%. The 64-token chunks, which are read completely, find 74.3%. From these 2 numbers alone I would suspect nothing.

So I split the questions by the place of the answer. If it is in the part that was read, the top 5 finds it in 92.5% of cases, if it is in the tail then in 51.9%. That is a lot for text the model never saw. The part it did read is about the same thing, I think this pulls the right chunk up. But it is also just a small corpus. An article is 17.5 such chunks on average. A search that only guesses the article and takes 5 of its chunks at random would get 32.0% of the same tail questions.

So about a half of the questions about invisible text still get the right chunk. A few queries checked by eye would pass.

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="Recall in the top 5 for answers in the head and in the tail of the chunk. Chunk size and limit, head / tail. 508, 256: 92.5 / 51.9; 508, 512: 87.8 / 78.9; 4000, 256: 96.0 / 55.4; 4000, 512: 92.9 / 73.9.">
  <line x1="130.0" y1="36" x2="130.0" y2="214" class="f-plain"/>
  <text x="130.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="300.0" y1="36" x2="300.0" y2="214" class="f-plain"/>
  <text x="300.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="470.0" y1="36" x2="470.0" y2="214" class="f-plain"/>
  <text x="470.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="640.0" y1="36" x2="640.0" y2="214" class="f-plain"/>
  <text x="640.0" y="232.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="110.0" y="66.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 256</text>
  <line x1="231.1" y1="62" x2="576.3" y2="62" class="f-line"/>
  <circle cx="231.1" cy="62" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.3" cy="62" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="231.1" y="51.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">51.9</text>
  <text x="576.3" y="51.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92.5</text>
  <text x="110.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">508, 512</text>
  <line x1="460.7" y1="106" x2="536.3" y2="106" class="f-line"/>
  <circle cx="460.7" cy="106" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="536.3" cy="106" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="460.7" y="95.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">78.9</text>
  <text x="536.3" y="95.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">87.8</text>
  <text x="110.0" y="154.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 256</text>
  <line x1="260.9" y1="150" x2="606.0" y2="150" class="f-line"/>
  <circle cx="260.9" cy="150" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="606.0" cy="150" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="260.9" y="139.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">55.4</text>
  <text x="606.0" y="139.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">96.0</text>
  <text x="110.0" y="198.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">4000, 512</text>
  <line x1="418.2" y1="194" x2="579.7" y2="194" class="f-line"/>
  <circle cx="418.2" cy="194" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="579.7" cy="194" r="6" style="fill:var(--muted);stroke:none"/>
  <text x="418.2" y="183.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">73.9</text>
  <text x="579.7" y="183.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">92.9</text>
  <text x="14.0" y="18.0" text-anchor="start" class="f-label f-muted">chunk, limit</text>
  <circle cx="136" cy="14" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="148.0" y="18.0" text-anchor="start" class="f-label f-muted">answer in the tail</text>
  <circle cx="356" cy="14" r="5" style="fill:var(--muted);stroke:none"/>
  <text x="368.0" y="18.0" text-anchor="start" class="f-label f-muted">answer in the head</text>
  <text x="640.0" y="254.0" text-anchor="end" class="f-label f-muted">found in the top 5, %</text>
</svg>
<figcaption>The tail is everything after the first 254 tokens, in all 4 rows. 508 is in tokens, 4000 in characters. At 512 the 508 chunks are read whole and the 4000 ones still only to 70.1%.</figcaption>
</figure>

When the same chunks are read whole, the same 2 groups give 87.8% and 78.9%. The gap goes from 40.6 points to 8.9. The answers in the head got a bit worse, I think because the vector now has to describe twice as much text.

## The default splitter

Here is the LangChain recursive splitter with different arguments and the same model.

| chunks | limit | tokens read | top 5 | in 2,032 tokens |
|---|---|---|---|---|
| 4,000 / 200, default | 128 | 17.4% | 63.1% | 42.5% |
| 4,000 / 200, default | 256 | 35.1% | 69.2% | 50.5% |
| 4,000 / 200, default | 512 | 70.1% | 80.3% | 62.7% |
| 1,000 / 200 | 256 | 100.0% | 88.5% | 95.2% |
| paragraphs as they are | 256 | 96.5% | 89.4% | 95.5% |

The default made 96 chunks and all 96 are longer than the limit. For 66% of the questions the answer lies in text that went into no vector. The same splitter with `chunk_size=1000` wins by 44.7 points inside the budget, from 39.0 to 52.7 in separate articles. The truncation does not explain all of it. With the limit at 512 the default gets back only 12.2 points, although 30% of the tokens are still unread there. I think the rest is mostly the budget, it holds 2.2 such chunks against 12.8 small ones.

I don't trust the top of this table much. SQuAD questions were written from these very paragraphs. The 1,000-character splitter also prefers to cut at the blank line between them.

And I measured 1,000 characters only in English, 2 of 489 chunks went over the limit there. For Russian I counted tokens in XQuAD, the same 240 paragraphs in both languages. 1,000 characters are 205 tokens in English and 822 in Russian, so 254 tokens hold 314 Russian characters. The vocabulary is English and nobody should use this model for Russian. The multilingual `paraphrase-multilingual-MiniLM-L12-v2` has an even lower `max_seq_length` of 128, but I did not count its tokens.

## What I do now

```python
tok.no_truncation()
n = [len(tok.encode(c).ids) for c in chunks]
print(max(n), sum(x > 256 for x in n), "of", len(n))
```

3 lines before the index is built. For the default splitter the last one prints `872 96 of 96`, counted together with the 2 special tokens.

## What I didn't check

One model, one seed, 8 articles. The corpus is small, so absolute percentages would be lower on a real one. The intervals come from a bootstrap over questions, but questions of one article are not really independent, so they are probably too narrow. My fixed chunks cut anywhere, even inside a word. I did not try BM25, a reranker or an actual LLM answer. SQuAD questions share many words with their paragraph and real users are less polite. Chunking strategies are described well in the June article on the Pinecone site. DPR in 2020 simply took passages of 100 words. My draft said that this fits under any of the 3 limits. Then I cut the same 8 articles that way and counted: 132 tokens on average with the special ones, 287 of 528 passages are over 128, none is over 256.
