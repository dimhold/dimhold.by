---
title: "PostgreSQL found 23 of 89 messages with the Russian word for array and Lucene stems it the same way"
description: "I loaded 95,127 Linux commit messages and the Russian messages of PostgreSQL itself into 9.4.1 to see where its full text search stops being cheap or right. A word in 9,652 commits cost fewer page accesses than one in 3,002. Full text found nothing for 267 of 300 typos. The Russian stemmer splits 3 everyday nouns and Lucene 4.10.4 gave the same stems on 16,354 forms."
date: 2015-03-28
lang: en
translationKey: postgres-fulltext
tags: ["databases", "performance", "text"]
---

```
=# select plainto_tsquery('russian', 'массив');
 'масс'
=# select to_tsvector('russian', 'массива');
 'массив':1
```

The first query has the Russian word for array in its dictionary form, the second has the same word in genitive. They get different lexemes. I loaded the Russian message catalogue of PostgreSQL itself, 4,172 messages from `ru.po`, then searched for the array. 89 messages have this word in some form. The query found 23.

I often repeat the advice to start with the full text search in the database and to bring Elasticsearch when it is not enough. But I could never say what "not enough" looks like. I had no numbers for it.

The parts are known. The manual says in 12.3.3 that ranking has to read the `tsvector` of every matching document. Korotkov and Bartunov showed at PGConf.EU 2012 how the sorting could live inside GIN. From that work 9.4 got the smaller lists and the fast scan, the sorting is still not there. Rachid Belaid wrote last year that the search in Postgres is good enough. I only wanted to see the edges on one corpus.

## The setup

PostgreSQL 9.4.1, `shared_buffers` 512 MB, `work_mem` 16 MB, a 2-core virtual machine. The corpus is 95,127 commit messages of Linux from v3.12 to v4.0-rc5, without merges and without lines like `Signed-off-by`. It is 34.6 MB of text. The `tsvector` column takes 38.0 MB, more than the text, with 26 lexemes per message on average. The GIN index takes 19.8 MB.

My load script passed 5 commands to `psql` with 5 `-c` options. It printed `VACUUM` and no errors, then the first query said that the index does not exist. psql 9.4 runs only the last `-c`.

## Where the sorting is paid

I took 9 stems of different frequency and counted page accesses with `EXPLAIN (ANALYZE, BUFFERS)`. Before the run I wrote down that the edge is where a top 10 by `ts_rank` reads more than 10% of the table. The table with its TOAST has 9,205 pages. A word found in 300 commits already needed 1,022 accesses, it is 0.3% of the corpus. The stem `use`, found in 33,679 commits, needed 15,104. That is more than the table has, because some pages are visited many times.

I expected this number to grow with the number of matches. Between 2 of the stems it went down.

<figure class="fig">
<svg viewBox="0 0 680 318" role="img" aria-label="Page accesses of a top 10 by ts_rank for 5 words, in commit order and in shuffled order. pid, 1,000 commits: 3,173 in commit order, 3,276 shuffled; pass, 3,002 commits: 3,558 in commit order, 3,815 shuffled; stage, 9,652 commits: 2,409 in commit order, 6,114 shuffled; remov, 18,353 commits: 9,535 in commit order, 10,535 shuffled; use, 33,679 commits: 15,104 in commit order, 15,535 shuffled. The part of every bar that goes to TOAST almost does not change after the shuffle.">
  <line x1="600.0" y1="268" x2="600.0" y2="276" class="f-plain"/>
  <line x1="482.5" y1="268" x2="482.5" y2="276" class="f-plain"/>
  <line x1="365.0" y1="268" x2="365.0" y2="276" class="f-plain"/>
  <line x1="247.5" y1="268" x2="247.5" y2="276" class="f-plain"/>
  <line x1="130.0" y1="32" x2="130.0" y2="276" class="f-plain"/>
  <text x="120.0" y="52.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pid</text>
  <text x="120.0" y="67.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,000</text>
  <rect x="130.0" y="40.0" width="25.2" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="155.2" y="40.0" width="68.0" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="229.2" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3,173</text>
  <rect x="130.0" y="58.0" width="28.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="158.1" y="58.0" width="68.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="232.2" y="69.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3,276</text>
  <text x="120.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">pass</text>
  <text x="120.0" y="115.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3,002</text>
  <rect x="130.0" y="88.0" width="68.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="198.1" y="88.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="240.5" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3,558</text>
  <rect x="130.0" y="106.0" width="75.7" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="205.7" y="106.0" width="36.4" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="248.1" y="117.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3,815</text>
  <text x="120.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">stage</text>
  <text x="120.0" y="163.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">9,652</text>
  <rect x="130.0" y="136.0" width="60.5" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="190.5" y="136.0" width="10.3" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="206.8" y="147.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">2,409</text>
  <rect x="130.0" y="154.0" width="169.4" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="299.4" y="154.0" width="10.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="315.6" y="165.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">6,114</text>
  <text x="120.0" y="196.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">remov</text>
  <text x="120.0" y="211.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">18,353</text>
  <rect x="130.0" y="184.0" width="193.6" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="323.6" y="184.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="416.1" y="195.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">9,535</text>
  <rect x="130.0" y="202.0" width="223.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="353.0" y="202.0" width="86.5" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="445.5" y="213.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">10,535</text>
  <text x="120.0" y="244.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">use</text>
  <text x="120.0" y="259.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">33,679</text>
  <rect x="130.0" y="232.0" width="233.0" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="363.0" y="232.0" width="210.7" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="579.7" y="243.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15,104</text>
  <rect x="130.0" y="250.0" width="246.1" height="14.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <rect x="376.1" y="250.0" width="210.2" height="14.0" style="fill:var(--accent);stroke:none"/>
  <text x="592.3" y="261.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">15,535</text>
  <text x="130.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="247.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4,000</text>
  <text x="365.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8,000</text>
  <text x="482.5" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12,000</text>
  <text x="600.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16,000</text>
  <text x="120.0" y="20.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">commits</text>
  <rect x="130.0" y="12.0" width="12.0" height="10.0" style="fill:var(--ink);opacity:0.7;stroke:none"/>
  <text x="148.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">index and heap</text>
  <rect x="290.0" y="12.0" width="12.0" height="10.0" style="fill:var(--accent);stroke:none"/>
  <text x="308.0" y="21.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">TOAST</text>
  <text x="600.0" y="308.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">page accesses</text>
</svg>
<figcaption>What a top 10 by ts_rank reads. The grey part is the index and the heap, the coloured part is TOAST. The upper bar of each pair is the table in commit order, the lower is the same rows shuffled.</figcaption>
</figure>

`pass` is in 3,002 commits and costs 3,558 accesses. `stage` is in 9,652 commits and costs 2,409. It is the stem of "staging", 9,070 of these subjects start with that word. These patches come in long series, so they lie next to each other in the table and the messages are short, 18 lexemes against 44 for `pass`. I copied the table in random order. The index and heap part for `stage` grew from 2,059 to 5,766 and the total to 6,114, while `pass` went only to 3,815.

The other part of the price is TOAST. A long message has a long `tsvector` that moves out of the row and each one costs about 3 more accesses. I checked it in `pg_statio_user_tables` and the TOAST index column did not fit, it was 2 times larger than `EXPLAIN` allows. The view joins the table with all its indexes and then sums, so this column is multiplied by their number. My table has 2. I added a third one and 2,964 became 4,446 for the same query, while the function under the view counted 1,482 both times.

In time nothing of this hurts yet. The slowest search took 42 ms with everything in memory, 46 on the shuffled table. An `ILIKE '%deadlock%'` took 451. The accesses start to matter when the table does not fit.

Without sorting I predicted less than 100 pages for any word. `stage` read 281, the planner chose a sequential scan for `LIMIT 10` and the matches were not at the beginning. In the shuffled table it read 25.

## A rare word has no weight

`ts_rank` knows nothing about the collection. I made 50 random pairs of a rare stem (from 10 to 30 commits) and a common one (from 3,000 to 10,000) and asked for one OR the other. The rare word got 67 of the 500 places in the top tens. In 14 pairs it got none. I expected more than a half of such pairs, so by default it is milder than I thought. With normalization 1, by the logarithm of the length, it is 34 pairs of 50.

## Typos need another table

The obvious thing is `subject % 'schedulr'` with pg_trgm. It returned 0 rows. Even the correct `scheduler` returned 2, while full text finds it in 159 subjects, because the similarity is counted against the whole subject.

So I made a separate vocabulary with `ts_stat`, 11,198 words of 5 to 14 letters, with a trigram index on it. Then I took 300 words that occur in at least 50 commits and made one random error in each. Full text found nothing for 267 of them. The trigrams put the right word first in 234 cases and in the first 5 in 282. I had predicted 80% in the first place and got 78%. Sorting the candidates with `levenshtein` gives 244.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="For 75 typos of each kind, how many times the right word came first and how many times it was in the first 5. extra letter: 73 and 75; wrong letter: 63 and 75; missing letter: 61 and 75; swapped letters: 37 and 57.">
  <text x="160.0" y="29.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">extra letter</text>
  <rect x="170.0" y="14.0" width="418.5" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="588.5" y="14.0" width="11.5" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="29.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">73 / 75</text>
  <text x="160.0" y="63.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">wrong letter</text>
  <rect x="170.0" y="48.0" width="361.2" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="531.2" y="48.0" width="68.8" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">63 / 75</text>
  <text x="160.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">missing letter</text>
  <rect x="170.0" y="82.0" width="349.7" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="519.7" y="82.0" width="80.3" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="97.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">61 / 75</text>
  <text x="160.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">swapped letters</text>
  <rect x="170.0" y="116.0" width="212.1" height="22.0" style="fill:var(--accent);stroke:none"/>
  <rect x="382.1" y="116.0" width="114.7" height="22.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="608.0" y="131.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">37 / 57</text>
  <line x1="170" y1="146" x2="600" y2="146" class="f-plain"/>
  <text x="170.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="313.3" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <text x="456.7" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="600.0" y="162.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">75</text>
</svg>
<figcaption>pg_trgm against a vocabulary of 11,198 words, 75 typos of each kind. Coloured is the right word in the first place, grey is places from 2 to 5.</figcaption>
</figure>

Swapped letters are the weak place, 37 of 75. 7 short words disappeared completely, `trsut` is one of them, for these no word passed the limit of 0.3.

## Back to the array

For the Russian part I took the OpenCorpora dictionary in the January build for pymorphy2. I kept only the words of the catalogue with one possible lemma, in the parts of speech that the table shows. The question is how many occurrences of other forms are found when I type the dictionary form.

| | lemmas | other forms in text | found |
|---|---|---|---|
| nouns | 571 | 5,754 | 91.4% |
| adjectives | 279 | 1,436 | 98.7% |
| verbs | 404 | 1,900 | 61.8% |
| all | 1,254 | 9,090 | 86.4% |

I expected 90%. Verbs spoil it and one form spoils the verbs, 190 of the 726 missed are существует (exists), mostly in "does not exist". The nouns bother me more, I think people type them more often. The words for table (243 of 243) and index (107 of 107) are complete. Массив ends like a gerund, запись (record) ends like a reflexive verb, память (memory) ends like an infinitive. Snowball cuts by endings and does not know the part of speech.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Dictionary form and the lexeme it becomes, next to another form of the same noun and its lexeme. массив becomes масс, массива becomes массив, the search finds 23 of 89 messages; запись becomes зап, записи becomes запис, the search finds 42 of 104 messages; память becomes памя, памяти becomes памят, the search finds 8 of 46 messages.">
  <text x="14.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">what is typed</text>
  <text x="326.0" y="22.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">what is in the text</text>
  <rect x="14" y="40" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массив</text>
  <line x1="126" y1="55" x2="156" y2="55" class="f-line"/>
  <path d="M 156 51 L 164 55 L 156 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="40" width="108" height="30" class="f-box"/>
  <text x="224.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">масс</text>
  <rect x="326" y="40" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="60.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">массива</text>
  <line x1="438" y1="55" x2="468" y2="55" class="f-line"/>
  <path d="M 468 51 L 476 55 L 468 59 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="40" width="108" height="30" class="f-box"/>
  <text x="536.0" y="60.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">массив</text>
  <text x="670.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">23/89</text>
  <rect x="14" y="84" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">запись</text>
  <line x1="126" y1="99" x2="156" y2="99" class="f-line"/>
  <path d="M 156 95 L 164 99 L 156 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="84" width="108" height="30" class="f-box"/>
  <text x="224.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">зап</text>
  <rect x="326" y="84" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="104.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">записи</text>
  <line x1="438" y1="99" x2="468" y2="99" class="f-line"/>
  <path d="M 468 95 L 476 99 L 468 103 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="84" width="108" height="30" class="f-box"/>
  <text x="536.0" y="104.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">запис</text>
  <text x="670.0" y="104.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">42/104</text>
  <rect x="14" y="128" width="108" height="30" class="f-plain"/>
  <text x="68.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">память</text>
  <line x1="126" y1="143" x2="156" y2="143" class="f-line"/>
  <path d="M 156 139 L 164 143 L 156 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="170" y="128" width="108" height="30" class="f-box"/>
  <text x="224.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памя</text>
  <rect x="326" y="128" width="108" height="30" class="f-plain"/>
  <text x="380.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">памяти</text>
  <line x1="438" y1="143" x2="468" y2="143" class="f-line"/>
  <path d="M 468 139 L 476 143 L 468 147 Z" style="fill:var(--ink);stroke:none"/>
  <rect x="482" y="128" width="108" height="30" class="f-box"/>
  <text x="536.0" y="148.0" text-anchor="middle" class="f-mono f-accent" style="font-size:13px">памят</text>
  <text x="670.0" y="148.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">8/46</text>
  <text x="670.0" y="184.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">messages found</text>
</svg>
<figcaption>3 nouns of the Russian catalogue. The dictionary form and the other forms get different lexemes, so a search by one does not see the other.</figcaption>
</figure>

A prefix query is the usual way around. `массив:*` finds all 89, `память:*` all 46. `запись:*` becomes `зап:*` and returns 319 messages for 104 real ones.

Then I ran Lucene 4.10.4, the one under Elasticsearch 1.5.0 released this week. Its `RussianAnalyzer`, also Snowball, gave the same stem as PostgreSQL on all 16,354 word forms, 0 differences. Its light stemmer fixes the array and lifts nouns to 95.2%, but verbs fall to 4.8% and the total to 76.8%. So I expect the Russian analyzer of Elasticsearch to split the same 3 nouns.

## What I did not check

I did not run Elasticsearch itself, only its stemmer. The ispell dictionaries of PostgreSQL are not tested either, they should go before Snowball and for Russian they would be my next step. Updates are skipped too. The cold cache I saw once and by accident: after a restart of PostgreSQL the first `stage` on the shuffled table took 1,328 ms with 5,893 pages read, I did not repeat it. Of the 21,781 Russian word occurrences 3,818 had several lemmas and were left out, my typos are random and not from people. There are 16 configurations in 9.4 and Belarusian is not among them.
