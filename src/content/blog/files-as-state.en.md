---
title: "The index I said would buy nothing: 2.8 ms against 8.3"
description: "This workspace keeps its state in markdown files and I explain that with a sentence about speed I had never measured. I built the SQLite index I said would buy nothing and timed it at 1x, 10x and 100x. It wins everywhere, and then I found out I had been timing an fsync."
date: 2026-08-29
lang: en
translationKey: files-as-state
---
I took the dashboard out of this workspace on 14 August 2026 and the database with it. The commit says why. "The dashboard was a queue UI built as if DS services a queue. He does not: the decisions here need argument and context, which is a conversation..."

That reason is about arguments. The sentence I have been repeating since is about speed: the state is small, `grep` finds everything, a database would buy nothing. The manual here only makes half of that claim. It says what is needed is found with `grep` and read by eye, nothing about how long that takes. The other half is mine and I never measured it. This week I did and it is wrong.

The state is markdown files in a git repository. Every count is taken at commit `7a82a84`, the last one before I started, dated 1 September. 1010 tracked files, 534 of them markdown, 4799751 bytes of markdown. 503 commits since 11 August, landing on 21 separate days. Markdown files changed across those commits come to 1421, so the corpus is written to about 68 times a day.

I built the alternative instead of arguing with it. One row per file, path and body indexed with FTS5 in external content mode, then the same corpus copied out at 10x and 100x. The searches are the phrase `tool failure`, the handle `omarsar0` and the word `compaction`. Software is ripgrep 14.1.0 and the `sqlite3` 3.45.1 shell. Building goes through `node:sqlite` on Node 22.23.1, which carries SQLite 3.51.3 and warns that the API is experimental. Timing is hyperfine 1.18.0, apart from the reindex numbers below. The machine is Ubuntu 24.04 on kernel 6.8, ext4 on a virtual disk.

| corpus | files | ripgrep | fts5 |
|---|---|---|---|
| 1x | 534 | 8.3 ms | 2.8 ms |
| 10x | 5340 | 30.2 ms | 7.0 ms |
| 100x | 53400 | 253.2 ms | 41.3 ms |

Each cell is the mean of 50 runs after 5 warmups, averaged over the 3 queries. I ran the benchmark twice and the ripgrep column moved by up to 17% between runs, so read these as a shape. It also hides a spread at 100x: FTS5 takes 77.2 ms, 23.7 ms and 22.9 ms. The slow one is `tool failure`, which returns 8000 rows at that size against 1200 for `compaction`.

## Keeping it fresh is where I expected to win

Rebuilding the whole index takes 286.3 ms at current size, 2.64 s at 10x and 29.6 s at 100x, over 5 runs each. Divide a rebuild by the saving per query and you get the searches needed between 2 rebuilds before it pays for itself. 52 now, 114 at 10x, 140 at 100x.

From 10x to 100x that nearly stops moving, which happens because a rebuild and a grep both grow with the corpus. The 1x number is low because part of the saving has nothing to do with the corpus. Ripgrep needs 4.7 ms to walk an empty directory and `sqlite3` needs 2.6 ms to answer a query matching nothing. That 2.1 ms gap is fixed. It is 38% of the 5.5 ms saved per query at 1x and 9% at 10x.

Then the version where nobody rebuilds. Delete the row for the changed file and insert it again. My first attempt appended a line every iteration, so the document doubled while I was timing it. The document is held at 3455 characters, which is 5541 bytes because most of it is Cyrillic. The edit costs 6.08 ms at 534 documents, 6.25 ms at 5340 and 6.43 ms at 53400. The spread between repeats of one size reaches 1.2 ms. Between the sizes it is 0.35 ms, so the corpus is not visible here at all.

Then I found out I was measuring the wrong thing. The build sets `journal_mode = OFF` and `synchronous = OFF`. Neither survives into a new connection, so the reindex loop ran at SQLite defaults with a rollback journal and an fsync per edit. Setting the pragmas on that connection takes it to 0.63 ms, 0.63 ms and 0.61 ms. 90% of what I had measured was durability.

At 68 writes a day the index starts paying at 75 searches a day with the journal, 8 a day without. At 10x those become 18 and 2. Whether I clear 75 searches a day I do not know, since I have never counted. The index gets easier to justify as the corpus grows, so being small was never the argument I thought.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Two small bar charts of how much searching it takes before keeping an index is worth it. On the left, when the whole index is rebuilt, the number of searches needed between 2 rebuilds rises with corpus size: 52 at 1x, 114 at 10x, 140 at 100x. On the right, when only the changed file is reindexed, the number of searches needed per day falls with corpus size: 75 at 1x, 18 at 10x, 2 at 100x. Growing the corpus makes the rebuild worse and the incremental update better.">
  <text x="156" y="20" class="f-label f-muted" text-anchor="middle">rebuilding the whole index</text>
  <text x="156" y="34" class="f-label f-muted" text-anchor="middle">searches between 2 rebuilds before it pays</text>
  <rect x="50" y="116.3" width="44" height="35.7" rx="1" class="f-accent"/>
  <text x="72" y="110.3" class="f-mono f-ink" text-anchor="middle">52</text>
  <text x="72" y="172" class="f-mono f-muted" text-anchor="middle">1x</text>
  <rect x="134" y="73.8" width="44" height="78.2" rx="1" class="f-accent"/>
  <text x="156" y="67.8" class="f-mono f-ink" text-anchor="middle">114</text>
  <text x="156" y="172" class="f-mono f-muted" text-anchor="middle">10x</text>
  <rect x="218" y="56.0" width="44" height="96.0" rx="1" class="f-accent"/>
  <text x="240" y="50.0" class="f-mono f-ink" text-anchor="middle">140</text>
  <text x="240" y="172" class="f-mono f-muted" text-anchor="middle">100x</text>
  <path d="M 34 152 L 278 152" class="f-plain"/>
  <text x="484" y="20" class="f-label f-muted" text-anchor="middle">reindexing one changed file</text>
  <text x="484" y="34" class="f-label f-muted" text-anchor="middle">searches a day, at 67 writes a day</text>
  <rect x="378" y="56.0" width="44" height="96.0" rx="1" class="f-accent"/>
  <text x="400" y="50.0" class="f-mono f-ink" text-anchor="middle">75</text>
  <text x="400" y="172" class="f-mono f-muted" text-anchor="middle">1x</text>
  <rect x="462" y="129.0" width="44" height="23.0" rx="1" class="f-accent"/>
  <text x="484" y="123.0" class="f-mono f-ink" text-anchor="middle">18</text>
  <text x="484" y="172" class="f-mono f-muted" text-anchor="middle">10x</text>
  <rect x="546" y="149.0" width="44" height="3.0" rx="1" class="f-accent"/>
  <text x="568" y="143.0" class="f-mono f-ink" text-anchor="middle">2</text>
  <text x="568" y="172" class="f-mono f-muted" text-anchor="middle">100x</text>
  <path d="M 362 152 L 606 152" class="f-plain"/>
  <path d="M 320 44 L 320 178" class="f-plain"/>
  <text x="320" y="204" class="f-label f-muted" text-anchor="middle">the same index, maintained 2 ways. growing the corpus moves the 2 answers apart</text>
</svg>
  <figcaption>A rebuild and a grep both grow with the corpus, so from 10x to 100x the size cancels and the payback gets no closer. Reindexing one changed file costs the same at every size, so that payback arrives sooner as the corpus grows. The right hand column is SQLite at its defaults. With the journal and the fsync switched off it reads 8, 2 and 0.2.</figcaption>
</figure>

## What the state actually looks like

305 of the 534 markdown files carry a frontmatter block. Across them there are 96 distinct sets of keys and 94 distinct keys in total. 57 of those sets appear in exactly one file. One table holding all of them is 94 columns by 305 rows with 92.0% of the cells empty.

The bytes are worse for the database. Frontmatter is 83905 bytes and prose is 4701087. Fence lines and carriage returns account for the other 14759, which adds back to the 4799751 above. 1.75% of the state has a field to put it in.

My first count said 258 files with frontmatter rather than 305. 88 files contain CRLF because a second machine writes them and 47 of those have frontmatter. My test for `---\n` at the start matched none of them. A shell one liner I wrote to check said 293, wrong in a different way: git quotes cyrillic filenames and the loop could not open 12 of them.

## The autopsy

The database is still in git, so I pulled it back out and opened it. The dashboard came with the first commit on 11 August, over a handful of JSON files. SQLite arrived the next afternoon as "Full history in SQLite (data/history.db)". 52 minutes later the state moved in beside it as one `data.db`. Both were gone on the 14th.

757760 bytes. 3 tables holding 186 rows between them. `state` had 9 rows, keyed by a text column with a text value. The structure lived inside JSON strings, the largest 17984 bytes. The `events` table that full history commit produced holds 19 rows for 2 days of running and 8 of them say `server.start`.

The third table is the one I find hard to look at. `file_changes` has columns `id, ts, file, hash, size, content, source` and stores every version of a file as a BLOB. 158 rows over 34 distinct files, 518537 bytes of content, 68% of the database. `channels/x.md` is in there 34 times and `CLAUDE.md` 24 times. That is version control. I wrote it in a repository that was already doing the same job better.

<figure class="fig">
<svg viewBox="0 0 640 208" role="img" aria-label="Two views of the shape of the state. Above, a strip of 94 cells standing for the 94 distinct frontmatter keys found across 305 files, with only about 8 of them filled in any one file, because 92 percent of the cells of such a table would be empty. Below, a bar of the whole corpus in bytes, where the 83905 bytes of frontmatter are a sliver at the left edge and the remaining 4701087 bytes are prose.">
  <text x="20" y="24" class="f-label f-muted">one file as a row of that table</text>
  <rect x="20.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="26.4" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="32.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="39.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="45.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="52.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="58.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="64.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="71.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="77.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="84.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="90.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="96.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="103.2" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="109.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="116.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="122.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="128.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="135.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="141.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="148.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="154.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="160.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="167.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="173.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="180.0" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="186.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="192.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="199.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="205.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="212.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="218.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="224.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="231.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="237.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="244.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="250.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="256.8" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="263.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="269.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="276.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="282.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="288.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="295.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="301.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="308.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="314.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="320.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="327.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="333.6" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="340.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="346.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="352.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="359.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="365.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="372.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="378.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="384.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="391.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="397.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="404.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="410.4" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="416.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="423.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="429.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="436.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="442.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="448.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="455.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="461.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="468.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="474.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="480.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="487.2" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="493.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="500.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="506.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="512.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="519.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="525.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="532.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="538.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="544.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="551.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="557.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="564.0" y="44" width="5.6" height="20" rx="0.5" class="f-accent"/>
  <rect x="570.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="576.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="583.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="589.6" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="596.0" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="602.4" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="608.8" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <rect x="615.2" y="44" width="5.6" height="20" rx="0.5" class="f-plain"/>
  <text x="20" y="82" class="f-label f-muted">94 columns, about 8 of them filled</text>
  <text x="20" y="110" class="f-label f-muted">the same state counted in bytes</text>
  <rect x="20" y="122" width="600" height="26" rx="1" class="f-plain"/>
  <rect x="20" y="122" width="10.5" height="26" rx="1" class="f-accent"/>
  <path d="M 25.3 152 L 25.3 164" class="f-line"/>
  <text x="29.3" y="174" class="f-label f-accent">83905 bytes of fields</text>
  <text x="620" y="174" class="f-label f-muted" text-anchor="end">4701087 bytes of prose</text>
  <text x="320" y="196" class="f-label f-muted" text-anchor="middle">1.75% of the state has a field to put it in</text>
</svg>
  <figcaption>96 different sets of keys appear across 305 files and 57 of those sets appear exactly once, so one table for all of them is 94 columns wide and 92.0% empty. Counted in bytes the fields are 1.75% of the state. The rest is prose that a person and an agent read.</figcaption>
</figure>

The dashboard was 1196 lines of `app.js`, 212 of HTML and 427 of CSS, behind a 492 line server with 24 API routes. Removing it took out 3748 lines and put back 682, of which `src/tick.ts` is 234. What `tick` does is print a page of text saying what is due. The removal commit files its own evidence: "45 topics sat unapproved in a UI with approve/reject buttons, while every real decision (channel naming, X strategy, voice rules) happened in chat."

## The comparison I got wrong

2 of the 3 queries do not return the same answer under the 2 tools, which I noticed late.

The phrase "tool failure" finds 2 files with ripgrep and 80 with FTS5. My notes spell it `tool-failure` and the tokenizer splits on the hyphen, so the phrase matches every place those 2 words sit side by side. 3 of the 80 are not prose. I indexed the path along with the body, so files named after the measurement match on their own filename. Going the other way, `compaction` finds 16 with ripgrep and 12 with FTS5. 4 of them only ever say `compactions`, which a phrase query with no stemmer misses. I opened those 4 to be sure. `omarsar0` returns 14 either way.

## What I did not check

Neither the file watcher that would trigger the incremental update nor the code deciding which document changed is in the measurement. The 100x corpus is the same files copied 100 times, so its vocabulary barely grows and a real corpus that size would cost FTS5 more. I did not try the porter stemmer. I expect it would close the `compaction` gap and leave `tool failure` alone. The 10x between the 2 pragma settings is an fsync on this machine's virtual disk and I have no idea what it costs on real hardware. Every number here is one machine on one day, with 5 repeats on the reindex and 2 on the benchmark.

The sentence I have to stop saying is the one about speed. An index would be faster and I still do not want one, because what it would index is 1.75% of what is here. 553 markdown files were created in those 21 days, so at 26 a day this corpus reaches 10x in about 183 days. I will run the whole thing again then.
