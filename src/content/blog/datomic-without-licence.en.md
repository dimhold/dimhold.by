---
title: "Datomic without a licence key: 68 bytes per update, 39 if nothing changes"
description: "Datomic Pro 1.0.6733 starts with a licence key that says nonsense. I ran 100,000 updates of one number through it and through SQLite with a history trigger. The bill is 68 bytes per update in Datomic and 30 in SQLite. An update that writes the same value still costs 39 bytes."
date: 2023-06-04
lang: en
translationKey: datomic-without-licence
tags: ["databases", "numbers", "time"]
---

I added the line `license-key=nonsense` to the properties file of the Datomic transactor and started it. The answer was `System started`. The key went to the log as it is and in 2 minutes there was no other line about a licence. A peer connected, read 5,000 accounts and wrote a balance. I stopped the process myself. Then I asked the same distribution to describe this key with `bin/datomic describe-license` and got a `BadPaddingException` from the RSA code. Without a key the same command prints `nil`.

So the key changed nothing that I could see, but the code that reads it is still shipped. On April 27 the Datomic team published version 1.0.6726 and moved the peer and transactor binaries to Apache 2.0. The change log says that a licence key is no longer needed. In 1.0.6733, which came out in May, none of the 8 property templates mentions a licence. The transactor jar still carries 10 classes named `license_inline`. Only the binaries are covered. The peer jar has 4,792 Datomic class files and the only Clojure source in it is `data_readers.clj`. The COPYRIGHT file says All Rights Reserved.

I know Datomic from talks, I have repeated many times that it never forgets and that this is expensive. But I had never started it and had no number for expensive.

## What I ran

Datomic Pro 1.0.6733 with dev storage, which is an H2 file, on JDK 17.0.7. On the other side SQLite 3.42.0 through the Xerial JDBC driver. 5,000 accounts with an owner, a city and a balance. Then 20 rounds, in each round every account gets a new random balance in random order, 100,000 updates in total. In Datomic I ask for indexing after every 5 rounds.

SQLite ran in 2 versions. The first is plain `UPDATE`, which forgets. In the second a trigger adds a row with the time to a table `tx` and writes the new balance to a history table. I would write something like this by hand.

As size I take the Datomic backup, because it contains only live segments, 359 of its 361 files are gzip. SQLite is measured as the file after `VACUUM`. From both I subtract the size after loading.

Nikita Prokopov described the internals in his unofficial guide in 2014 and Val Waeselynck wrote in 2018 about Datomic as event sourcing. I only count bytes.

## The bill

The transaction report shows what one update is made of. The old balance is retracted, the new one is added and the transaction itself gets a time. That is 3 datoms. Each of 100,000 transactions had exactly 3.

<figure class="fig">
<svg viewBox="0 0 660 220" role="img" aria-label="Three transactions as Datomic reports them. A new value is 3 datoms: the old balance retracted, the new balance added, the time of the transaction added, 67.9 bytes. The same value is 1 datom, only the time, 39.4 bytes. One hundred updates together are 201 datoms, 27.3 bytes per update.">
  <text x="109.0" y="20.0" text-anchor="middle" class="f-mono f-ink">new value</text>
  <rect x="5" y="30" width="208" height="32" class="f-box"/>
  <text x="15.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="33.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="51.0" text-anchor="end" class="f-mono f-muted">old</text>
  <rect x="5" y="68" width="208" height="32" class="f-box"/>
  <text x="15.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="203.0" y="89.0" text-anchor="end" class="f-mono f-muted">new</text>
  <rect x="5" y="106" width="208" height="32" class="f-box"/>
  <text x="15.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="33.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="203.0" y="127.0" text-anchor="end" class="f-mono f-muted">time</text>
  <text x="109.0" y="164.0" text-anchor="middle" class="f-label f-muted">3 datoms</text>
  <text x="109.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">67.9</text>
  <text x="109.0" y="208.0" text-anchor="middle" class="f-label f-muted">bytes per update</text>
  <text x="330.0" y="20.0" text-anchor="middle" class="f-mono f-ink">same value</text>
  <rect x="226" y="106" width="208" height="32" class="f-box"/>
  <text x="236.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="254.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="424.0" y="127.0" text-anchor="end" class="f-mono f-muted">time</text>
  <text x="330.0" y="60.0" text-anchor="middle" class="f-mono f-muted">nothing about</text>
  <text x="330.0" y="78.0" text-anchor="middle" class="f-mono f-muted">the balance</text>
  <text x="330.0" y="164.0" text-anchor="middle" class="f-label f-muted">1 datom</text>
  <text x="330.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">39.4</text>
  <text x="330.0" y="208.0" text-anchor="middle" class="f-label f-muted">bytes per update</text>
  <text x="551.0" y="20.0" text-anchor="middle" class="f-mono f-ink">100 in one</text>
  <rect x="447" y="30" width="208" height="32" class="f-box"/>
  <text x="457.0" y="51.0" text-anchor="start" class="f-mono f-accent">-</text>
  <text x="475.0" y="51.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="51.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="68" width="208" height="32" class="f-box"/>
  <text x="457.0" y="89.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="89.0" text-anchor="start" class="f-mono f-ink">:a/bal</text>
  <text x="645.0" y="89.0" text-anchor="end" class="f-mono f-muted">x 100</text>
  <rect x="447" y="106" width="208" height="32" class="f-box"/>
  <text x="457.0" y="127.0" text-anchor="start" class="f-mono f-accent">+</text>
  <text x="475.0" y="127.0" text-anchor="start" class="f-mono f-accent">:db/txInstant</text>
  <text x="645.0" y="127.0" text-anchor="end" class="f-mono f-muted">time</text>
  <text x="551.0" y="164.0" text-anchor="middle" class="f-label f-muted">201 datoms</text>
  <text x="551.0" y="190.0" text-anchor="middle" class="f-glyph f-ink">27.3</text>
  <text x="551.0" y="208.0" text-anchor="middle" class="f-label f-muted">bytes per update</text>
</svg>
<figcaption>What the transaction report contained. Minus is a retraction, plus is an assertion. Below is the growth of the backup per update.</figcaption>
</figure>

Plain SQLite did not grow at all. The file was 163,840 bytes before the updates and 163,840 bytes after. Datomic took 67.9 bytes per update and SQLite with the trigger 29.6, so the difference with my handwritten history is 2.3 times. I expected a bigger one, but Datomic compresses its segments and SQLite does not compress anything. Unpacked the same backup is 22.6 MB instead of 7.0.

Then I made an update which writes the value that is already there. Datomic notices it, the balance gets no new datoms and the history of the account has 1 datom instead of 41. But the transaction still happened and its time is a fact like any other. It costs 39.4 bytes, 58 percent of the real update. I would be careful with the exact share, because segments are compressed together and bytes do not add up so simply.

The other way to see it is to put 100 updates into one transaction. The report has 201 datoms then and the price falls to 27.3 bytes. SQLite with one `tx` row per 100 updates goes the same way, from 29.6 to 14.0. Before that the `tx` table alone was 1.57 MB of the 3.43 MB file, measured before `VACUUM`. In both databases a large part of the bill is the record about the transaction, but how much of it is the time itself I cannot say for Datomic.

<figure class="fig">
<svg viewBox="0 0 660 262" role="img" aria-label="Bytes per update after 100,000 updates, minus the size after loading. One update per transaction: Datomic 67.9, Datomic noHistory 52.4, Datomic same value 39.4, SQLite trigger 29.6, SQLite plain UPDATE 0. 100 updates per transaction: Datomic 27.3, Datomic noHistory 13.2, SQLite trigger 14.0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">one update per transaction, bytes</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="26.0" width="368.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="576.6" y="39.0" text-anchor="start" class="f-mono f-muted">67.9</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="50.0" width="284.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="492.3" y="63.0" text-anchor="start" class="f-mono f-muted">52.4</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">Datomic, same value</text>
  <rect x="200.0" y="74.0" width="213.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="421.8" y="87.0" text-anchor="start" class="f-mono f-muted">39.4</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">SQLite, trigger</text>
  <rect x="200.0" y="98.0" width="160.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="368.8" y="111.0" text-anchor="start" class="f-mono f-muted">29.6</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">SQLite, UPDATE</text>
  <text x="208.0" y="135.0" text-anchor="start" class="f-mono f-muted">0</text>
  <text x="5.0" y="172.0" text-anchor="start" class="f-label f-muted">100 updates per transaction, bytes</text>
  <text x="190.0" y="195.0" text-anchor="end" class="f-mono f-ink">Datomic</text>
  <rect x="200.0" y="182.0" width="148.3" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="356.3" y="195.0" text-anchor="start" class="f-mono f-muted">27.3</text>
  <text x="190.0" y="219.0" text-anchor="end" class="f-mono f-ink">Datomic, noHistory</text>
  <rect x="200.0" y="206.0" width="71.6" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="279.6" y="219.0" text-anchor="start" class="f-mono f-muted">13.2</text>
  <text x="190.0" y="243.0" text-anchor="end" class="f-mono f-ink">SQLite, trigger</text>
  <rect x="200.0" y="230.0" width="75.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="283.8" y="243.0" text-anchor="start" class="f-mono f-muted">14.0</text>
</svg>
<figcaption>Growth per update. Datomic is the backup with gzip segments, SQLite is the file after VACUUM without compression. In the lower group SQLite has one tx row per 100 updates.</figcaption>
</figure>

## noHistory forgets, but not everywhere

Datomic has an attribute flag `:db/noHistory`. With it the cost of a single update goes down from 67.9 to 52.4 bytes, less than I hoped for. The history index has 5,000 balance datoms left, but the log still has 205,000, the same number as without the flag. In batches of 100 the flag helps better, 13.2 bytes against 27.3.

What I did not expect is how `as-of` behaves on such an attribute. I had 21 snapshots of balances in memory, one after loading and one after each round. Without the flag all 105,000 values matched. With the flag the last snapshot matched and in each of the other 20 all 5,000 balances were missing. It returns neither the old value nor the current one. All 5,000 accounts are there with their owners, only without money.

And `as-of` is not free to read. Summing 5,000 balances of the current database touched 1 segment of the AEVT index. For the past it was 72. I asked for the beginning, for the middle and for the last round but one, it was 72 everywhere. After 500,000 updates it was 390. So the price grows with the history and a nearer date does not help, at least in this query.

## Where I got lost

The obvious thing to measure is the H2 file. It was 52.5 MB after the updates, more than 500 bytes for each. But the rows in the storage table took 19.4 MB, after `gc-storage` they took 8.0 MB and the file grew to 58.2 MB. When the transactor stopped, the file shrank to 20.8 MB. In another run, with an excision at the end, it stayed at 43.9 MB. The same database in the backup is 7.0 MB, so the file says more about H2 and old index segments than about history.

<figure class="fig">
<svg viewBox="0 0 660 180" role="img" aria-label="Sizes of the same Datomic database after 100,000 updates in megabytes. H2 file before gc-storage 52.5, H2 file after gc-storage 58.2, H2 file after the transactor stopped 20.8, rows in the storage table before gc-storage 19.4, rows after gc-storage 8.0, backup 7.0.">
  <text x="5.0" y="16.0" text-anchor="start" class="f-label f-muted">MB</text>
  <text x="190.0" y="39.0" text-anchor="end" class="f-mono f-ink">H2 file</text>
  <rect x="200.0" y="26.0" width="341.3" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="549.3" y="39.0" text-anchor="start" class="f-mono f-muted">52.5</text>
  <text x="190.0" y="63.0" text-anchor="end" class="f-mono f-ink">H2 file after gc</text>
  <rect x="200.0" y="50.0" width="378.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="586.2" y="63.0" text-anchor="start" class="f-mono f-muted">58.2</text>
  <text x="190.0" y="87.0" text-anchor="end" class="f-mono f-ink">H2 file, stopped</text>
  <rect x="200.0" y="74.0" width="134.9" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="342.9" y="87.0" text-anchor="start" class="f-mono f-muted">20.8</text>
  <text x="190.0" y="111.0" text-anchor="end" class="f-mono f-ink">table rows</text>
  <rect x="200.0" y="98.0" width="126.2" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="334.2" y="111.0" text-anchor="start" class="f-mono f-muted">19.4</text>
  <text x="190.0" y="135.0" text-anchor="end" class="f-mono f-ink">table rows after gc</text>
  <rect x="200.0" y="122.0" width="51.8" height="17" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="259.8" y="135.0" text-anchor="start" class="f-mono f-muted">8.0</text>
  <text x="190.0" y="159.0" text-anchor="end" class="f-mono f-ink">backup</text>
  <rect x="200.0" y="146.0" width="45.8" height="17" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="253.8" y="159.0" text-anchor="start" class="f-mono f-muted">7.0</text>
</svg>
<figcaption>One database and 100,000 updates. The text uses the backup.</figcaption>
</figure>

With batches of 100 the garbage collection removed nothing, 7,758,373 bytes before and 50 bytes more after, although the backup is 2.99 MB. I decided that I was too impatient and made a separate run with 3 calls and 2 minutes of waiting. The first call added the same 50 bytes and after that the number did not move by a byte. After 500,000 updates the same call worked, 91.8 MB became 26.9, but the backup is 13.95. I don't know what decides it.

Datomic can forget on purpose. I retracted one account and its history grew from 44 datoms to 48, the old balance of 21505 was still visible in the past. After `:db/excise` and `sync-excise` there were 0 datoms in history and 0 in the log, the past returned nothing. The storage grew by 740 KB in the process.

## What I did not check

All numbers here are sizes and counts, I did not measure speed. I ran only dev storage. SQL or Cassandra may have another overhead. Most variants ran once. The single updates and the batches ran twice, the backups differed by 1.3 percent at most and one of them had an excision inside. Random balances compress badly and real ones may compress better. A check of the key later than 2 minutes after the start I would not see. My trigger stores less than Datomic, it has no index by attribute and no retractions, so the 2.3 times compares different things.

At 3,000 updates a day 68 bytes each make about 74 MB a year, I would not notice it. I would still group them into transactions by meaning first and think about `noHistory` after that.
