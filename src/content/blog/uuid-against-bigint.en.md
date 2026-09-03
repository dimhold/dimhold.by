---
title: "A uuid primary key: 172 seconds against 59"
description: "16 bytes against 8 is 40 percent more index. Arrival order adds another 23 percent on top of that, plus 3 times the insert time once the index outgrows shared_buffers."
date: 2011-11-23
lang: en
translationKey: uuid-against-bigint
tags: ["databases", "performance"]
---

Every argument I have had about uuid keys was about the width of the key. 16 bytes against 8, the index gets bigger, move on. I set 4 tables next to each other to see whether that is the whole bill.

```
create table t_seq    (id bigint primary key, payload text);
create table t_rand   (id uuid   primary key, payload text);
create table t_sorted (id uuid   primary key, payload text);
create table t_comb   (id uuid   primary key, payload text);
```

A million rows each, 40 bytes of payload each. `t_rand` and `t_sorted` get the same million uuids, one table in generated order and the other sorted before the insert. `t_comb` gets uuids built from a 6 byte millisecond prefix in front of 10 random bytes.

```
select pg_size_pretty(pg_relation_size('t_seq'))         as seq_heap,
       pg_size_pretty(pg_relation_size('t_rand'))        as uuid_heap,
       pg_size_pretty(pg_relation_size('t_seq_pkey'))    as seq_index,
       pg_size_pretty(pg_relation_size('t_sorted_pkey')) as uuid_sorted_index,
       pg_size_pretty(pg_relation_size('t_rand_pkey'))   as uuid_random_index;

 seq_heap | uuid_heap | seq_index | uuid_sorted_index | uuid_random_index
----------+-----------+-----------+-------------------+-------------------
 81 MB    | 89 MB     | 21 MB     | 30 MB             | 37 MB
```

There are 2 separate costs in that row. 21 to 30 is the width of the key. The next 7 MB comes from arrival order alone, because t_sorted and t_rand hold the same million keys.

## The width

The heap goes from 84459520 bytes to 93093888 for the same million rows. That is 8.6 bytes a row for a key that is 8 bytes wider. The tuple difference is exactly 8, because both layouts pad to the same boundary. The rest is what falls off the end of a page: 97 bigint rows fit on one against 88 uuid rows, which leaves 20 bytes unused against 72.

The index goes from 21 MB to 30 MB, which is less than the ratio of the keys on their own. A leaf entry is the key plus an 8 byte index tuple header plus a 4 byte line pointer, so 20 bytes against 28. The 2 fixed parts dilute 16 over 8 down to 28 over 20, which is 1.40. The measured leaf pages are 2733 against 3832, a ratio of 1.402.

The page arithmetic falls out the same way. An 8192 byte page loses 24 bytes to the page header and 16 to the btree special area, leaving 8152. The default fill is 90 percent of that. 367 bigint entries at 20 bytes is 7340. 262 uuid entries at 28 bytes is 7336. Both sit on the line. One slot on every leaf except the rightmost holds the high key, so the data entries are 366 and 261, which predicts 2733 pages and 3832. Those are the 2 numbers pgstatindex reports.

## The order

Same million keys in both tables, so the width is held fixed and only the arrival order changes.

```
select leaf_pages, avg_leaf_density, leaf_fragmentation from pgstatindex('t_sorted_pkey');

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       3832 |            90.03 |                  0

select leaf_pages, avg_leaf_density, leaf_fragmentation from pgstatindex('t_rand_pkey');

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       4724 |             73.1 |              49.56
```

A sorted insert always lands at the right hand edge of the tree. The page there fills to 90 percent and a new one opens. A random insert lands inside a page that is already full. That page splits in half, so both halves sit at 50 percent until later arrivals fill them in. Averaged over a million arrivals it settles at 73.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Leaf pages filled to ninety percent by ascending inserts against half filled pages left by random inserts">
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">ascending</text>
  <rect x="109" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="109" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="163" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="163" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="217" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="217" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="271" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="271" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="325" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="325" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="379" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="379" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="433" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="433" y="32" width="44" height="50" rx="3" class="f-box"/>
  <rect x="487" y="26" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="487" y="63" width="44" height="19" rx="3" class="f-box"/>
  <text x="320" y="112" class="f-label f-muted" text-anchor="middle">90.06</text>
  <text x="320" y="140" class="f-label f-muted" text-anchor="middle">random arrival</text>
  <rect x="109" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="109" y="178" width="44" height="28" rx="3" class="f-box"/>
  <rect x="163" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="163" y="156" width="44" height="50" rx="3" class="f-box"/>
  <rect x="217" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="217" y="177" width="44" height="29" rx="3" class="f-box"/>
  <rect x="271" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="271" y="157" width="44" height="49" rx="3" class="f-box"/>
  <rect x="325" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="325" y="178" width="44" height="28" rx="3" class="f-box"/>
  <rect x="379" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="379" y="156" width="44" height="50" rx="3" class="f-box"/>
  <rect x="433" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="433" y="175" width="44" height="31" rx="3" class="f-box"/>
  <rect x="487" y="150" width="44" height="56" rx="3" class="f-plain"/>
  <rect x="487" y="178" width="44" height="28" rx="3" class="f-box"/>
  <text x="320" y="212" class="f-label f-muted" text-anchor="middle">73.1</text>
</svg>
<figcaption>A sorted insert always lands at the right edge, fills the page to ninety percent and opens the next one.<br>A random insert lands inside a full page, which splits in half. Measured density 90.06 against 73.1. Leaf pages 2733 against 4724.</figcaption>
</figure>

Fragmentation went from zero to 49.56. That counts leaves whose right sibling sits at a lower block number. Half the leaves are out of physical order, so an ordered index scan walks the file back and forth instead of reading it through. 49.56 is also about as bad as the number gets, since a fully shuffled index saturates near 50.

## A rebuild gives the space back

```
reindex index t_rand_pkey;
Time: 1143,292 ms

 leaf_pages | avg_leaf_density | leaf_fragmentation
------------+------------------+--------------------
       3832 |            90.03 |                  0
```

3832 pages, the same number the sorted table had. The 7 extra megabytes were fragmentation left by the arrival order. Reindex removed them in 1.1 seconds on a table this size.

## 10 million rows against 128 megabytes of cache

At a million rows the whole index fits in `shared_buffers`, which is 128 MB on this machine. Median of 3 runs:

| key | insert time |
|---|---|
| bigint ascending | 4130 ms |
| uuid sorted | 4472 ms |
| uuid time prefix | 4466 ms |
| uuid in arrival order | 5942 ms |

Then I raised it to 10 million rows, where the index no longer fits. I ran the 2 ends of the range:

```
-- 10M uuid random
INSERT 0 10000000
Time: 172414,407 ms

-- 10M uuid time prefix
INSERT 0 10000000
Time: 59225,842 ms
```

2.911 times, against 1.330 at a million rows. That is one run at each end. A repeat of the pair came out at 2.53, so the honest reading is close to 3 times rather than 2.911. The ordered insert works on one leaf page until it fills. The random insert lands almost anywhere, so the working set is the whole index rather than a page. Once the index stops fitting in memory every row turns into a read of its own. The indexes moved the same way, 397 MB against 301 MB, with density at 68.4 against 90.04.

## 6 bytes of clock

The prefix is the whole trick. 12 hex digits of millisecond time, then 20 hex digits of md5:

```
(lpad(to_hex(1322000000000 + g), 12, '0') || substr(md5(g::text || 'k'), 1, 20))::uuid
```

At a million rows it matched the sorted table to the page: 3832 leaves, 90.03 density, zero fragmentation. It is still 16 bytes wide, so the index comes out the same size as the sorted one. The fragmentation is what goes away.

<figure class="fig">
<svg viewBox="0 0 640 170" role="img" aria-label="Sixteen random bytes against six bytes of millisecond time in front of ten random bytes">
  <defs>
    <marker id="kArrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" class="f-muted"/>
    </marker>
  </defs>
  <text x="320" y="16" class="f-label f-muted" text-anchor="middle">16 random bytes</text>
  <rect x="50" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="65" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="84" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="99" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="118" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="133" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="152" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="167" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="186" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="201" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="220" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="235" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="254" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="269" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="288" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="322" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="356" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="390" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="424" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="458" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="492" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="526" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="560" y="26" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="45" class="f-label f-muted" text-anchor="middle">rnd</text>
  <text x="320" y="94" class="f-label f-muted" text-anchor="middle">6 bytes of ms + 10 random bytes</text>
  <rect x="50" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="65" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="84" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="99" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="118" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="133" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="152" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="167" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="186" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="201" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="220" y="104" width="30" height="30" rx="4" class="f-box"/>
  <text x="235" y="123" class="f-label f-accent" text-anchor="middle">ms</text>
  <rect x="254" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="269" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="288" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="303" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="322" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="337" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="356" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="371" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="390" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="405" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="424" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="439" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="458" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="473" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="492" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="507" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="526" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="541" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <rect x="560" y="104" width="30" height="30" rx="4" class="f-plain"/>
  <text x="575" y="123" class="f-label f-muted" text-anchor="middle">rnd</text>
  <path d="M 50 152 L 244 152" class="f-line" marker-end="url(#kArrow)"/>
  <text x="255" y="156" class="f-label f-accent" text-anchor="start">sorts by creation time</text>
</svg>
<figcaption>Same 16 bytes either way. The prefix costs 48 bits of randomness and buys back the insertion order:<br>4724 leaf pages become 3832, which is what the sorted table used, to the page.</figcaption>
</figure>

The cost is 6 of the 16 bytes. 2 uuids generated in the same millisecond now have 80 random bits between them instead of the 128 that md5 handed t_rand. A real version 4 uuid starts from 122, because 6 bits go to the version and the variant. 6 bytes of milliseconds also run out after close to 9000 years. I am willing to accept that. The other cost is that the key now tells anyone holding it when the row was made. That is fine on an invoice id. I would not put it on a password reset token.

## What I have not checked

Everything above is inserts on a clean table. Reads are untouched. So is what happens over months of real traffic with deletes and updates mixed in.

I also have not run this on InnoDB, where the primary key is the table itself rather than a separate index. The same random arrival should hit the heap as well as the index there, so I expect the gap to be wider than 2.91.
