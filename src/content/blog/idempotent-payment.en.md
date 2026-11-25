---
title: "The table had 2,000 payments and no duplicates, the bank had 2,592 charges"
description: "I built 8 recipes of a payment with an idempotency key on PostgreSQL 9.3, killed the worker between the steps and counted charges at the bank. With a unique index the table had 2,000 clean rows and the bank had 2,592 charges. Only the recipe where the bank itself drops the duplicate had one charge per payment and an answer for every client."
date: 2014-11-02
lang: en
translationKey: idempotent-payment
tags: ["databases", "reliability", "debugging"]
---

`db_rows: 2000, client_ok: 2000, charges: 2592`. My service sees the first 2 numbers, 2,000 rows with a unique index on the key and 2,000 clients who got their 200. The third one is from the fake bank. It charged 478 payments more than once, the unluckiest one 5 times.

When somebody asked me how to avoid a double charge on retry, my answer was always the same: let the client send a key and put a unique index on it. I never counted what happens on the side where the money is. This time I trusted only the list of charges in the bank.

The topic is old. Pat Helland wrote "Idempotence Is Not a Medical Condition" in 2012 about systems where a message may come more than once. RFC 7230 from this June does not let a user agent repeat a POST on its own unless it knows that this is safe or that the first one was never applied. EC2 has had ClientToken in RunInstances for years. I did not invent any of the recipes below, I only wanted to see each of them fail.

## The setup

PostgreSQL 9.3.5, Python 3.4.2 and psycopg2 2.5.4 on one Linux machine. The payment service is a threaded HTTP server in one process. My bank is another process which sleeps, records the charge in the middle of the sleep and then answers. The client sends the same key in a header until it sees a 200. A crash is a real SIGKILL at a chosen line and the parent forks a new worker at once.

The 8 recipes:

- A, no key at all.
- B, SELECT by key, then charge, then INSERT.
- S, the same as B under SERIALIZABLE.
- C, B with a unique index on the key.
- D, INSERT of the key first and then the charge, all in one transaction.
- E, like D, but COMMIT goes before the charge. A row in `started` answers 409.
- F, E plus a row lock. Whoever gets the lock on a `started` row asks the bank about this key and charges only if there is nothing.
- G, the same lock, but it just repeats the charge with the same reference and the bank drops the duplicate.

There is no upsert in 9.3, so "INSERT first" means catching error 23505.

## Where the worker dies

20 payments per cell, one kill on the first attempt, then the client retries.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Charges at the bank per 20 payments, for 7 recipes and 6 places where the worker is killed. A: 20, 20, 40, 40, 40, 40. B: 20, 20, 40, 40, 40, 20. C: 20, 20, 40, 40, 40, 20. D: 20, 20, 40, 40, 40, 20. E: 20, 0, 20, 20, 20, 20. F: 20, 20, 40, 20, 20, 20. G: 20, 20, 20, 20, 20, 20.">
  <text x="258.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">on</text>
  <text x="258.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">entry</text>
  <text x="334.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">before</text>
  <text x="334.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">the bank</text>
  <text x="410.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">during</text>
  <text x="410.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">the call</text>
  <text x="486.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">after</text>
  <text x="486.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">the bank</text>
  <text x="562.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">before</text>
  <text x="562.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="638.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">after</text>
  <text x="638.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="4.0" y="64.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="64.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">no key</text>
  <rect x="222.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="638.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <text x="4.0" y="92.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="92.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, charge, INSERT</text>
  <rect x="222.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="120.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + unique index</text>
  <rect x="222.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="148.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, charge, COMMIT</text>
  <rect x="222.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, charge</text>
  <rect x="222.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="300" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="334.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="374.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="376" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="410.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="452" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="486.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="528" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="562.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="204.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="204.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + lock + ask bank</text>
  <rect x="222.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="188.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="232.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + lock + reference</text>
  <rect x="222.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="410.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
</svg>
<figcaption>Charges at the bank per 20 payments when the worker is killed once at that place and the client retries. 20 is correct. Colored cells charged somebody twice, framed cells left the client with 409.</figcaption>
</figure>

From B to D the row of numbers is the same. The key saves them in one place, when the worker dies after COMMIT and the client did not get the answer. If it dies between the bank and COMMIT, all 20 payments are charged twice because the only trace of the first charge was in a transaction which is gone. D looked safer to me, it writes the key before touching money, but the key sits in a transaction that is still open and is lost with it.

## A pair of copies at once

For the race I sent 2 copies of each of 50 payments with a gap between them, the bank took 50 ms. With a gap from 0 to 45 ms B charged all 50 payments twice and kept 100 rows. C charged from 46 to 50 of them twice and kept exactly 50 rows, almost the same loss with a clean table. From D to G it was 50 charges each. In D the second INSERT simply waits until the first transaction ends. With a gap of 100 ms the first copy is already committed and only A still charged twice. That is how I tested such things before, by pressing the button again by hand.

## The storm

Then 2,000 payments from 8 clients. The client gives up waiting after 250 ms, 5% of bank calls take 600 ms and 4% of first attempts ask for a kill somewhere (2% of the later ones). My service is one process, so one kill takes every payment in flight with it.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="The storm, 2,000 payments per recipe. Payments charged more than once, extra rows in the table, clients who never got 200. A: 497, 33, 0. B: 470, 5, 0. S: 750, 0, 77. C: 478, 0, 0. D: 478, 0, 0. E: 0, 0, 292. F: 68, 0, 0. G: 0, 0, 0.">
  <text x="4.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">payments charged more than once</text>
  <text x="570.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">extra rows</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">no 200</text>
  <text x="4.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="47.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">no key</text>
  <rect x="220.0" y="34.0" width="111.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="339.8" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">497</text>
  <text x="570.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">33</text>
  <text x="670.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, charge, INSERT</text>
  <rect x="220.0" y="60.0" width="105.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="333.8" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">470</text>
  <text x="570.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="670.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">S</text>
  <text x="24.0" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B, SERIALIZABLE</text>
  <rect x="220.0" y="86.0" width="168.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="396.8" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">750</text>
  <text x="570.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">77</text>
  <text x="4.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + unique index</text>
  <rect x="220.0" y="112.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, charge, COMMIT</text>
  <rect x="220.0" y="138.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, charge</text>
  <rect x="220.0" y="164.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">292</text>
  <text x="4.0" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + lock + ask bank</text>
  <rect x="220.0" y="190.0" width="15.3" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="243.3" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">68</text>
  <text x="570.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + lock + reference</text>
  <rect x="220.0" y="216.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>The storm, 2,000 payments per recipe. The bars are payments charged at the bank 2 or more times, the columns are done rows above 2,000 and clients who gave up without a 200.</figcaption>
</figure>

My criteria, written before the run, said the order of recipes would stay as in the small tests. It did not. SERIALIZABLE came out worse than no key, 750 payments charged more than once against 497, 6,277 charges in total. The worst payment was charged 15 times and only because my client stops after 15 attempts.

I knew that 40001 arrives after the charge. I did not expect it for unrelated payments. So I took 2 transactions with different keys, each selects its own missing key, inserts it and commits. In `pg_locks` the SELECT leaves an SIReadLock on a page of the index, so 2 missing keys from the same page look like a conflict. With random keys 100 pairs of 100 got a 40001 on an empty table, 14 on a table which started with 1,000 rows and 1 with 10,000. Every such error told the client to retry and every retry went to the bank.

My first version of this test said 100, 84 and 0 and I had already written an explanation for it. Then I looked at the keys. Most of them sorted after the first 1,000 rows and met on the last page, while with 10,000 rows the 2 keys were always about 5,000 rows apart. The storm has the same defect, its keys are numbers in order, `sS-120` next to `sS-121`. With consecutive keys it is 100 of 100 for each of the 3 sizes. So I repeated the storm for S with md5 of the same keys. It gave 4,178 charges instead of 6,277, but 774 payments charged more than once, still worse than no key.

I also took the storm apart. With only timeouts A and C each charged 92 payments more than once, because the seed is the same and the same calls were slow. D charged none twice. With only kills it was 527 for A, 496 for C and 474 for D. So D closed the race, but against a kill it is not much better than no key.

E never charged twice. But 292 clients got no 200 at all. The table holds 292 rows with the word `started`, the bank charged 278 of them and did not charge 14. From the table one cannot tell which.

## Asking the bank

F is the recipe I would have written myself. It was clean with only kills, where the bank writes within 30 ms and the client waits 50 before a retry. It was clean with only timeouts, where the lock is held by a living worker. With both it charged 68 payments more than once.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Recipe F. The worker dies 100 ms into a bank call, the bank writes the charge at 200 ms. Payments charged twice out of 20 by the pause before the retry: 20: 20, 50: 20, 80: 20, 110: 0, 150: 0, 250: 0.">
  <rect x="190.0" y="52.0" width="150.0" height="16.0" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <line x1="40" y1="60" x2="640" y2="60" class="f-line"/>
  <line x1="40" y1="55" x2="40" y2="65" class="f-line"/>
  <text x="40.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="190" y1="55" x2="190" y2="65" class="f-line"/>
  <text x="190.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="340" y1="55" x2="340" y2="65" class="f-line"/>
  <text x="340.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="490" y1="55" x2="490" y2="65" class="f-line"/>
  <text x="490.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="640" y1="55" x2="640" y2="65" class="f-line"/>
  <text x="640.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="190.0" y="20.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">worker dies</text>
  <text x="300.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">bank writes the charge</text>
  <text x="670.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ms since the call to the bank</text>
  <text x="40.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">pause before the retry, payments charged twice out of 20</text>
  <line x1="190" y1="134" x2="220.0" y2="134" class="f-line"/>
  <rect x="216.0" y="130.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="138.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+20</text>
  <text x="232.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="154" x2="265.0" y2="154" class="f-line"/>
  <rect x="261.0" y="150.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="158.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+50</text>
  <text x="277.0" y="158.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="174" x2="310.0" y2="174" class="f-line"/>
  <rect x="306.0" y="170.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="178.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+80</text>
  <text x="322.0" y="178.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="194" x2="355.0" y2="194" class="f-line"/>
  <rect x="351.0" y="190.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+110</text>
  <text x="367.0" y="198.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="214" x2="415.0" y2="214" class="f-line"/>
  <rect x="411.0" y="210.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="218.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+150</text>
  <text x="427.0" y="218.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="234" x2="565.0" y2="234" class="f-line"/>
  <rect x="561.0" y="230.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="238.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+250</text>
  <text x="577.0" y="238.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>Recipe F asks the bank before it charges again. A question that comes before the bank wrote the first charge gets an honest &quot;no such charge&quot;. Recipe G had 20 charges for every one of these pauses.</figcaption>
</figure>

In this test the worker dies 100 ms into the call and the bank writes the charge at 200 ms. A client which is back in 20, 50 or 80 ms gets a new worker, which asks the bank, hears that there is no such charge and charges again, 20 payments of 20. At 110, 150 and 250 ms it is 0.

My first run of this table said 14, 3 and 1. It ran on cores shared with other jobs and everything was probably late by some tens of milliseconds, enough for the bank to finish writing. On quiet cores it was 20, 20 and 20, so the busy machine was hiding the bug from me.

In the storm only G had 2,000 charges for 2,000 payments. It works because my bank agreed to drop duplicates under its own lock, so I moved the problem into the bank, a process that I never killed. If the processor does not take a reference, I have no recipe here that gives both one charge and an answer.

## Same key, other body

With D I sent 100 and then 500 under the same key. The second answer was 200 with amount 100. So the body needs a fingerprint and the first idea is a hash of the bytes. On G it rejected 99 of 100 honest retries with 422. A retry from a new client process serializes the same 5 fields in another order, because Python randomizes string hashes by default since 3.3. 200 processes gave 99 different byte strings. With sorted keys 100 of 100 passed.

## What I did not check

A kill of PostgreSQL itself, a lost disk and more than one service process. How long a real processor remembers a reference, which decides how late a retry may come. Refunds and a client which loses its key and makes a new one. The storm on the figure ran once per recipe and its counts move with every run. I repeated C, D and F one more time and got 467, 476 and 67 instead of 478, 478 and 68, so the equal numbers of C and D are a coincidence.
