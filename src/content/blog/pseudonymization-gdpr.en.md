---
title: "100,000 hashed phone numbers came back in 23 seconds"
description: "The GDPR measures anonymity by the cost and time of identification, so I measured them. All 40,000,000 Belarusian mobile numbers against 100,000 hashes, with salts, HMAC keys and PBKDF2, and then the UCI Adult table, which has no names at all."
date: 2018-05-27
lang: en
translationKey: pseudonymization-gdpr
tags: ["open-data", "numbers", "reliability"]
---

```
sha256_seconds = [22.4, 23.8, 22.6]
sha256_recovered = 100000
```

These 2 lines are the output of a small Java program. I gave it a column of 100,000 mobile numbers replaced with their SHA-256. It went through all 40,000,000 mobile numbers possible in Belarus and looked for the hash of each one in the column. It took 23 seconds on one core and no row was lost.

The GDPR applies since Friday and a column like this is often described as anonymized. I used the word the same way, if the name was dropped and the id was hashed. I had never tried to turn such a column back and I had never opened the regulation to see what it calls anonymous. Now I did both.

The attack itself is old. Ed Felten explained it on the FTC blog in 2012, with social security numbers. In 2014 Vijay Pandurangan reversed the MD5 of New York taxi licences. The same year the Article 29 Working Party described it in Opinion 05/2014, where hashing is on the list of pseudonymisation techniques. What I was missing was the price in seconds.

## What the text says

Article 4(5) defines pseudonymisation as processing "in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately" and protected. Recital 26 says that such data "should be considered to be information on an identifiable natural person", so they remain personal data.

I counted words in the official English text. The stem "pseudonymi" occurs 15 times, 6 of them in the articles. "Anonymous" occurs 3 times, all of them in recital 26 and never in the articles. The word "hash" does not occur at all. I expected to find which techniques make data anonymous, but there is only a test. Among other things you look at "the costs of and the amount of time required for identification", which I can measure. Before the run I wrote down a limit of 10 minutes on one core. A column that comes back faster I would treat as the same phone numbers in another notation.

## Prices

The setup is Java 8, one thread on one core of a virtual machine. The space is 375, then one of 25, 29, 33, 44, then 7 digits. My 100,000 numbers come from a seeded random generator, there is no real list behind them. Not every range is really given out, so a real search would be shorter, I don't know by how much.

<figure class="fig">
<svg viewBox="0 0 680 224" role="img" aria-label="Horizontal bars on a logarithmic time axis, the time to recover 100,000 phone numbers on one core. MD5: 12.6 s; SHA-256: 22.6 s; SHA-256, one salt: 22.0 s; HMAC, known key: 71.6 s; PBKDF2, one salt: 9.3 days; SHA-256, row salt: 11.2 days. The last 2 are extrapolated.">
  <line x1="220.6" y1="196" x2="220.6" y2="202" class="f-plain"/>
  <text x="220.6" y="214.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 s</text>
  <line x1="273.7" y1="196" x2="273.7" y2="202" class="f-plain"/>
  <text x="273.7" y="214.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 min</text>
  <line x1="395.2" y1="196" x2="395.2" y2="202" class="f-plain"/>
  <text x="395.2" y="214.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 hour</text>
  <line x1="489.5" y1="196" x2="489.5" y2="202" class="f-plain"/>
  <text x="489.5" y="214.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1 day</text>
  <line x1="557.9" y1="196" x2="557.9" y2="202" class="f-plain"/>
  <text x="557.9" y="214.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10 days</text>
  <text x="190.0" y="24.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MD5</text>
  <rect x="200" y="10" width="27.4" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="235.4" y="24.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">12.6 s</text>
  <text x="190.0" y="56.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SHA-256</text>
  <rect x="200" y="42" width="44.8" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="252.8" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">22.6 s</text>
  <text x="190.0" y="88.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SHA-256, one salt</text>
  <rect x="200" y="74" width="44.0" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="252.0" y="88.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">22.0 s</text>
  <text x="190.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">HMAC, known key</text>
  <rect x="200" y="106" width="79.0" height="20" style="fill:var(--accent);stroke:none"/>
  <text x="287.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">71.6 s</text>
  <text x="190.0" y="152.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">PBKDF2, one salt</text>
  <rect x="200" y="138" width="355.8" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="563.8" y="152.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">9.3 days</text>
  <text x="190.0" y="184.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SHA-256, row salt</text>
  <rect x="200" y="170" width="361.2" height="20" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="569.2" y="184.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">11.2 days</text>
</svg>
<figcaption>Time to recover all 100,000 numbers on one core, logarithmic axis. Coloured bars are measured passes over 40,000,000 candidates, grey bars are multiplied from 600 PBKDF2 calls and from 20 rows with their own salts.</figcaption>
</figure>

A salt of 16 random bytes, one for the whole table and known to the attacker, changed nothing, 22.0 seconds against 22.6. With a salt per row, stored next to the hash, the search starts again for every row. I ran it for 20 rows and all 20 came back, 9.66 seconds each on average, 18.73 the worst. For the whole table it would be 11.2 days by multiplication. But one person still costs about 10 seconds.

HMAC on SHA-256 with a key that leaked took 71.6 seconds. With a random 128-bit key that did not leak there is nothing to enumerate, so I have no number for it. The key has to be random though. I took a key of 5 lowercase letters and an attacker who knows one row, his own. The key `okeyg` was found after 7,052,013 attempts in 13.4 seconds. There are 12,356,630 keys of up to 5 letters, fewer than phone numbers.

PBKDF2 with 10,000 iterations and one salt costs 20.17 ms per number. The owner spends 34 minutes on the table. The attacker spends 224 hours on one core, which is 9.3 days. It is more expensive, but 10 rented cores make it one day.

Here I finally understood the words "additional information". For HMAC it is the key and it can be kept separately. For a bare hash I don't see what could be, the missing part is the list of all phone numbers, which everybody can produce with a loop. It is my reading, I'm not a lawyer. The Opinion counts a bare hash as pseudonymisation and warns about this attack in the same paragraph.

## Cutting the hash

Another habit is to keep only the first characters of the hash, so that several numbers share one value. I expected about 610 candidates per row at 16 bits and almost no protection at 32, which is simple division.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Five groups of dots, one dot is one phone number that fits the same cut hash. candidates for the median row, distinct values left of 100,000: 32 bits: 1, 100,000; 28 bits: 1, 99,986; 24 bits: 3, 99,706; 20 bits: 39, 95,278; 16 bits: 611, 51,209.">
  <text x="16.0" y="16.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">candidates for the median row</text>
  <rect x="16" y="60" width="3.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="16.0" y="40.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">32 bits: 1</text>
  <text x="16.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">100,000</text>
  <rect x="147" y="60" width="3.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="147.0" y="40.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">28 bits: 1</text>
  <text x="147.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">99,986</text>
  <path d="M278 60h3.4v3.4h-3.4zM278 65h3.4v3.4h-3.4z" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="283" y="60" width="3.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="40.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">24 bits: 3</text>
  <text x="278.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">99,706</text>
  <path d="M409 60h3.4v3.4h-3.4zM414 60h3.4v3.4h-3.4zM419 60h3.4v3.4h-3.4zM424 60h3.4v3.4h-3.4zM429 60h3.4v3.4h-3.4zM434 60h3.4v3.4h-3.4zM439 60h3.4v3.4h-3.4zM409 65h3.4v3.4h-3.4zM414 65h3.4v3.4h-3.4zM419 65h3.4v3.4h-3.4zM424 65h3.4v3.4h-3.4zM429 65h3.4v3.4h-3.4zM434 65h3.4v3.4h-3.4zM439 65h3.4v3.4h-3.4zM409 70h3.4v3.4h-3.4zM414 70h3.4v3.4h-3.4zM419 70h3.4v3.4h-3.4zM424 70h3.4v3.4h-3.4zM429 70h3.4v3.4h-3.4zM434 70h3.4v3.4h-3.4zM439 70h3.4v3.4h-3.4zM414 75h3.4v3.4h-3.4zM419 75h3.4v3.4h-3.4zM424 75h3.4v3.4h-3.4zM429 75h3.4v3.4h-3.4zM434 75h3.4v3.4h-3.4zM439 75h3.4v3.4h-3.4zM409 80h3.4v3.4h-3.4zM414 80h3.4v3.4h-3.4zM419 80h3.4v3.4h-3.4zM424 80h3.4v3.4h-3.4zM429 80h3.4v3.4h-3.4zM434 80h3.4v3.4h-3.4zM439 80h3.4v3.4h-3.4zM409 85h3.4v3.4h-3.4zM414 85h3.4v3.4h-3.4zM419 85h3.4v3.4h-3.4zM424 85h3.4v3.4h-3.4z" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="409" y="75" width="3.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="409.0" y="40.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">20 bits: 39</text>
  <text x="409.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">95,278</text>
  <path d="M540 60h3.4v3.4h-3.4zM545 60h3.4v3.4h-3.4zM550 60h3.4v3.4h-3.4zM555 60h3.4v3.4h-3.4zM560 60h3.4v3.4h-3.4zM565 60h3.4v3.4h-3.4zM570 60h3.4v3.4h-3.4zM575 60h3.4v3.4h-3.4zM580 60h3.4v3.4h-3.4zM585 60h3.4v3.4h-3.4zM590 60h3.4v3.4h-3.4zM595 60h3.4v3.4h-3.4zM600 60h3.4v3.4h-3.4zM605 60h3.4v3.4h-3.4zM610 60h3.4v3.4h-3.4zM615 60h3.4v3.4h-3.4zM620 60h3.4v3.4h-3.4zM625 60h3.4v3.4h-3.4zM630 60h3.4v3.4h-3.4zM635 60h3.4v3.4h-3.4zM640 60h3.4v3.4h-3.4zM645 60h3.4v3.4h-3.4zM650 60h3.4v3.4h-3.4zM655 60h3.4v3.4h-3.4zM660 60h3.4v3.4h-3.4zM540 65h3.4v3.4h-3.4zM545 65h3.4v3.4h-3.4zM550 65h3.4v3.4h-3.4zM555 65h3.4v3.4h-3.4zM560 65h3.4v3.4h-3.4zM565 65h3.4v3.4h-3.4zM570 65h3.4v3.4h-3.4zM575 65h3.4v3.4h-3.4zM580 65h3.4v3.4h-3.4zM585 65h3.4v3.4h-3.4zM590 65h3.4v3.4h-3.4zM595 65h3.4v3.4h-3.4zM600 65h3.4v3.4h-3.4zM605 65h3.4v3.4h-3.4zM610 65h3.4v3.4h-3.4zM615 65h3.4v3.4h-3.4zM620 65h3.4v3.4h-3.4zM625 65h3.4v3.4h-3.4zM630 65h3.4v3.4h-3.4zM635 65h3.4v3.4h-3.4zM640 65h3.4v3.4h-3.4zM645 65h3.4v3.4h-3.4zM650 65h3.4v3.4h-3.4zM655 65h3.4v3.4h-3.4zM660 65h3.4v3.4h-3.4zM540 70h3.4v3.4h-3.4zM545 70h3.4v3.4h-3.4zM550 70h3.4v3.4h-3.4zM555 70h3.4v3.4h-3.4zM560 70h3.4v3.4h-3.4zM565 70h3.4v3.4h-3.4zM570 70h3.4v3.4h-3.4zM575 70h3.4v3.4h-3.4zM580 70h3.4v3.4h-3.4zM585 70h3.4v3.4h-3.4zM590 70h3.4v3.4h-3.4zM595 70h3.4v3.4h-3.4zM600 70h3.4v3.4h-3.4zM605 70h3.4v3.4h-3.4zM610 70h3.4v3.4h-3.4zM615 70h3.4v3.4h-3.4zM620 70h3.4v3.4h-3.4zM625 70h3.4v3.4h-3.4zM630 70h3.4v3.4h-3.4zM635 70h3.4v3.4h-3.4zM640 70h3.4v3.4h-3.4zM645 70h3.4v3.4h-3.4zM650 70h3.4v3.4h-3.4zM655 70h3.4v3.4h-3.4zM660 70h3.4v3.4h-3.4zM540 75h3.4v3.4h-3.4zM545 75h3.4v3.4h-3.4zM550 75h3.4v3.4h-3.4zM555 75h3.4v3.4h-3.4zM560 75h3.4v3.4h-3.4zM565 75h3.4v3.4h-3.4zM570 75h3.4v3.4h-3.4zM575 75h3.4v3.4h-3.4zM580 75h3.4v3.4h-3.4zM585 75h3.4v3.4h-3.4zM590 75h3.4v3.4h-3.4zM595 75h3.4v3.4h-3.4zM600 75h3.4v3.4h-3.4zM605 75h3.4v3.4h-3.4zM610 75h3.4v3.4h-3.4zM615 75h3.4v3.4h-3.4zM620 75h3.4v3.4h-3.4zM625 75h3.4v3.4h-3.4zM630 75h3.4v3.4h-3.4zM635 75h3.4v3.4h-3.4zM640 75h3.4v3.4h-3.4zM645 75h3.4v3.4h-3.4zM650 75h3.4v3.4h-3.4zM655 75h3.4v3.4h-3.4zM660 75h3.4v3.4h-3.4zM540 80h3.4v3.4h-3.4zM545 80h3.4v3.4h-3.4zM550 80h3.4v3.4h-3.4zM555 80h3.4v3.4h-3.4zM560 80h3.4v3.4h-3.4zM565 80h3.4v3.4h-3.4zM570 80h3.4v3.4h-3.4zM575 80h3.4v3.4h-3.4zM580 80h3.4v3.4h-3.4zM585 80h3.4v3.4h-3.4zM590 80h3.4v3.4h-3.4zM595 80h3.4v3.4h-3.4zM600 80h3.4v3.4h-3.4zM605 80h3.4v3.4h-3.4zM610 80h3.4v3.4h-3.4zM615 80h3.4v3.4h-3.4zM620 80h3.4v3.4h-3.4zM625 80h3.4v3.4h-3.4zM630 80h3.4v3.4h-3.4zM635 80h3.4v3.4h-3.4zM640 80h3.4v3.4h-3.4zM645 80h3.4v3.4h-3.4zM650 80h3.4v3.4h-3.4zM655 80h3.4v3.4h-3.4zM660 80h3.4v3.4h-3.4zM540 85h3.4v3.4h-3.4zM545 85h3.4v3.4h-3.4zM550 85h3.4v3.4h-3.4zM555 85h3.4v3.4h-3.4zM560 85h3.4v3.4h-3.4zM565 85h3.4v3.4h-3.4zM570 85h3.4v3.4h-3.4zM575 85h3.4v3.4h-3.4zM580 85h3.4v3.4h-3.4zM585 85h3.4v3.4h-3.4zM590 85h3.4v3.4h-3.4zM595 85h3.4v3.4h-3.4zM600 85h3.4v3.4h-3.4zM605 85h3.4v3.4h-3.4zM610 85h3.4v3.4h-3.4zM615 85h3.4v3.4h-3.4zM620 85h3.4v3.4h-3.4zM625 85h3.4v3.4h-3.4zM630 85h3.4v3.4h-3.4zM635 85h3.4v3.4h-3.4zM640 85h3.4v3.4h-3.4zM645 85h3.4v3.4h-3.4zM650 85h3.4v3.4h-3.4zM655 85h3.4v3.4h-3.4zM660 85h3.4v3.4h-3.4zM540 90h3.4v3.4h-3.4zM545 90h3.4v3.4h-3.4zM550 90h3.4v3.4h-3.4zM555 90h3.4v3.4h-3.4zM560 90h3.4v3.4h-3.4zM565 90h3.4v3.4h-3.4zM570 90h3.4v3.4h-3.4zM575 90h3.4v3.4h-3.4zM580 90h3.4v3.4h-3.4zM585 90h3.4v3.4h-3.4zM590 90h3.4v3.4h-3.4zM595 90h3.4v3.4h-3.4zM600 90h3.4v3.4h-3.4zM605 90h3.4v3.4h-3.4zM610 90h3.4v3.4h-3.4zM615 90h3.4v3.4h-3.4zM620 90h3.4v3.4h-3.4zM625 90h3.4v3.4h-3.4zM630 90h3.4v3.4h-3.4zM635 90h3.4v3.4h-3.4zM640 90h3.4v3.4h-3.4zM645 90h3.4v3.4h-3.4zM650 90h3.4v3.4h-3.4zM655 90h3.4v3.4h-3.4zM660 90h3.4v3.4h-3.4zM540 95h3.4v3.4h-3.4zM545 95h3.4v3.4h-3.4zM550 95h3.4v3.4h-3.4zM555 95h3.4v3.4h-3.4zM560 95h3.4v3.4h-3.4zM565 95h3.4v3.4h-3.4zM570 95h3.4v3.4h-3.4zM575 95h3.4v3.4h-3.4zM580 95h3.4v3.4h-3.4zM585 95h3.4v3.4h-3.4zM590 95h3.4v3.4h-3.4zM595 95h3.4v3.4h-3.4zM600 95h3.4v3.4h-3.4zM605 95h3.4v3.4h-3.4zM610 95h3.4v3.4h-3.4zM615 95h3.4v3.4h-3.4zM620 95h3.4v3.4h-3.4zM625 95h3.4v3.4h-3.4zM630 95h3.4v3.4h-3.4zM635 95h3.4v3.4h-3.4zM640 95h3.4v3.4h-3.4zM645 95h3.4v3.4h-3.4zM650 95h3.4v3.4h-3.4zM655 95h3.4v3.4h-3.4zM660 95h3.4v3.4h-3.4zM540 100h3.4v3.4h-3.4zM545 100h3.4v3.4h-3.4zM550 100h3.4v3.4h-3.4zM555 100h3.4v3.4h-3.4zM560 100h3.4v3.4h-3.4zM565 100h3.4v3.4h-3.4zM570 100h3.4v3.4h-3.4zM575 100h3.4v3.4h-3.4zM580 100h3.4v3.4h-3.4zM585 100h3.4v3.4h-3.4zM590 100h3.4v3.4h-3.4zM595 100h3.4v3.4h-3.4zM600 100h3.4v3.4h-3.4zM605 100h3.4v3.4h-3.4zM610 100h3.4v3.4h-3.4zM615 100h3.4v3.4h-3.4zM620 100h3.4v3.4h-3.4zM625 100h3.4v3.4h-3.4zM630 100h3.4v3.4h-3.4zM635 100h3.4v3.4h-3.4zM640 100h3.4v3.4h-3.4zM645 100h3.4v3.4h-3.4zM650 100h3.4v3.4h-3.4zM655 100h3.4v3.4h-3.4zM660 100h3.4v3.4h-3.4zM540 105h3.4v3.4h-3.4zM545 105h3.4v3.4h-3.4zM550 105h3.4v3.4h-3.4zM555 105h3.4v3.4h-3.4zM560 105h3.4v3.4h-3.4zM565 105h3.4v3.4h-3.4zM570 105h3.4v3.4h-3.4zM575 105h3.4v3.4h-3.4zM580 105h3.4v3.4h-3.4zM585 105h3.4v3.4h-3.4zM590 105h3.4v3.4h-3.4zM595 105h3.4v3.4h-3.4zM600 105h3.4v3.4h-3.4zM605 105h3.4v3.4h-3.4zM610 105h3.4v3.4h-3.4zM615 105h3.4v3.4h-3.4zM620 105h3.4v3.4h-3.4zM625 105h3.4v3.4h-3.4zM630 105h3.4v3.4h-3.4zM635 105h3.4v3.4h-3.4zM640 105h3.4v3.4h-3.4zM645 105h3.4v3.4h-3.4zM650 105h3.4v3.4h-3.4zM655 105h3.4v3.4h-3.4zM660 105h3.4v3.4h-3.4zM540 110h3.4v3.4h-3.4zM545 110h3.4v3.4h-3.4zM550 110h3.4v3.4h-3.4zM555 110h3.4v3.4h-3.4zM560 110h3.4v3.4h-3.4zM565 110h3.4v3.4h-3.4zM570 110h3.4v3.4h-3.4zM575 110h3.4v3.4h-3.4zM580 110h3.4v3.4h-3.4zM585 110h3.4v3.4h-3.4zM590 110h3.4v3.4h-3.4zM595 110h3.4v3.4h-3.4zM600 110h3.4v3.4h-3.4zM605 110h3.4v3.4h-3.4zM610 110h3.4v3.4h-3.4zM615 110h3.4v3.4h-3.4zM620 110h3.4v3.4h-3.4zM625 110h3.4v3.4h-3.4zM630 110h3.4v3.4h-3.4zM635 110h3.4v3.4h-3.4zM640 110h3.4v3.4h-3.4zM645 110h3.4v3.4h-3.4zM650 110h3.4v3.4h-3.4zM655 110h3.4v3.4h-3.4zM660 110h3.4v3.4h-3.4zM540 115h3.4v3.4h-3.4zM545 115h3.4v3.4h-3.4zM550 115h3.4v3.4h-3.4zM555 115h3.4v3.4h-3.4zM560 115h3.4v3.4h-3.4zM565 115h3.4v3.4h-3.4zM570 115h3.4v3.4h-3.4zM575 115h3.4v3.4h-3.4zM580 115h3.4v3.4h-3.4zM585 115h3.4v3.4h-3.4zM590 115h3.4v3.4h-3.4zM595 115h3.4v3.4h-3.4zM600 115h3.4v3.4h-3.4zM605 115h3.4v3.4h-3.4zM610 115h3.4v3.4h-3.4zM615 115h3.4v3.4h-3.4zM620 115h3.4v3.4h-3.4zM625 115h3.4v3.4h-3.4zM630 115h3.4v3.4h-3.4zM635 115h3.4v3.4h-3.4zM640 115h3.4v3.4h-3.4zM645 115h3.4v3.4h-3.4zM650 115h3.4v3.4h-3.4zM655 115h3.4v3.4h-3.4zM660 115h3.4v3.4h-3.4zM540 120h3.4v3.4h-3.4zM545 120h3.4v3.4h-3.4zM550 120h3.4v3.4h-3.4zM555 120h3.4v3.4h-3.4zM560 120h3.4v3.4h-3.4zM565 120h3.4v3.4h-3.4zM570 120h3.4v3.4h-3.4zM575 120h3.4v3.4h-3.4zM580 120h3.4v3.4h-3.4zM585 120h3.4v3.4h-3.4zM590 120h3.4v3.4h-3.4zM595 120h3.4v3.4h-3.4zM600 120h3.4v3.4h-3.4zM605 120h3.4v3.4h-3.4zM610 120h3.4v3.4h-3.4zM615 120h3.4v3.4h-3.4zM620 120h3.4v3.4h-3.4zM625 120h3.4v3.4h-3.4zM630 120h3.4v3.4h-3.4zM635 120h3.4v3.4h-3.4zM640 120h3.4v3.4h-3.4zM645 120h3.4v3.4h-3.4zM650 120h3.4v3.4h-3.4zM655 120h3.4v3.4h-3.4zM660 120h3.4v3.4h-3.4zM540 125h3.4v3.4h-3.4zM545 125h3.4v3.4h-3.4zM550 125h3.4v3.4h-3.4zM555 125h3.4v3.4h-3.4zM560 125h3.4v3.4h-3.4zM565 125h3.4v3.4h-3.4zM570 125h3.4v3.4h-3.4zM575 125h3.4v3.4h-3.4zM580 125h3.4v3.4h-3.4zM585 125h3.4v3.4h-3.4zM590 125h3.4v3.4h-3.4zM600 125h3.4v3.4h-3.4zM605 125h3.4v3.4h-3.4zM610 125h3.4v3.4h-3.4zM615 125h3.4v3.4h-3.4zM620 125h3.4v3.4h-3.4zM625 125h3.4v3.4h-3.4zM630 125h3.4v3.4h-3.4zM635 125h3.4v3.4h-3.4zM640 125h3.4v3.4h-3.4zM645 125h3.4v3.4h-3.4zM650 125h3.4v3.4h-3.4zM655 125h3.4v3.4h-3.4zM660 125h3.4v3.4h-3.4zM540 130h3.4v3.4h-3.4zM545 130h3.4v3.4h-3.4zM550 130h3.4v3.4h-3.4zM555 130h3.4v3.4h-3.4zM560 130h3.4v3.4h-3.4zM565 130h3.4v3.4h-3.4zM570 130h3.4v3.4h-3.4zM575 130h3.4v3.4h-3.4zM580 130h3.4v3.4h-3.4zM585 130h3.4v3.4h-3.4zM590 130h3.4v3.4h-3.4zM595 130h3.4v3.4h-3.4zM600 130h3.4v3.4h-3.4zM605 130h3.4v3.4h-3.4zM610 130h3.4v3.4h-3.4zM615 130h3.4v3.4h-3.4zM620 130h3.4v3.4h-3.4zM625 130h3.4v3.4h-3.4zM630 130h3.4v3.4h-3.4zM635 130h3.4v3.4h-3.4zM640 130h3.4v3.4h-3.4zM645 130h3.4v3.4h-3.4zM650 130h3.4v3.4h-3.4zM655 130h3.4v3.4h-3.4zM660 130h3.4v3.4h-3.4zM540 135h3.4v3.4h-3.4zM545 135h3.4v3.4h-3.4zM550 135h3.4v3.4h-3.4zM555 135h3.4v3.4h-3.4zM560 135h3.4v3.4h-3.4zM565 135h3.4v3.4h-3.4zM570 135h3.4v3.4h-3.4zM575 135h3.4v3.4h-3.4zM580 135h3.4v3.4h-3.4zM585 135h3.4v3.4h-3.4zM590 135h3.4v3.4h-3.4zM595 135h3.4v3.4h-3.4zM600 135h3.4v3.4h-3.4zM605 135h3.4v3.4h-3.4zM610 135h3.4v3.4h-3.4zM615 135h3.4v3.4h-3.4zM620 135h3.4v3.4h-3.4zM625 135h3.4v3.4h-3.4zM630 135h3.4v3.4h-3.4zM635 135h3.4v3.4h-3.4zM640 135h3.4v3.4h-3.4zM645 135h3.4v3.4h-3.4zM650 135h3.4v3.4h-3.4zM655 135h3.4v3.4h-3.4zM660 135h3.4v3.4h-3.4zM540 140h3.4v3.4h-3.4zM545 140h3.4v3.4h-3.4zM550 140h3.4v3.4h-3.4zM555 140h3.4v3.4h-3.4zM560 140h3.4v3.4h-3.4zM565 140h3.4v3.4h-3.4zM570 140h3.4v3.4h-3.4zM575 140h3.4v3.4h-3.4zM580 140h3.4v3.4h-3.4zM585 140h3.4v3.4h-3.4zM590 140h3.4v3.4h-3.4zM595 140h3.4v3.4h-3.4zM600 140h3.4v3.4h-3.4zM605 140h3.4v3.4h-3.4zM610 140h3.4v3.4h-3.4zM615 140h3.4v3.4h-3.4zM620 140h3.4v3.4h-3.4zM625 140h3.4v3.4h-3.4zM630 140h3.4v3.4h-3.4zM635 140h3.4v3.4h-3.4zM640 140h3.4v3.4h-3.4zM645 140h3.4v3.4h-3.4zM650 140h3.4v3.4h-3.4zM655 140h3.4v3.4h-3.4zM660 140h3.4v3.4h-3.4zM540 145h3.4v3.4h-3.4zM545 145h3.4v3.4h-3.4zM550 145h3.4v3.4h-3.4zM555 145h3.4v3.4h-3.4zM560 145h3.4v3.4h-3.4zM565 145h3.4v3.4h-3.4zM570 145h3.4v3.4h-3.4zM575 145h3.4v3.4h-3.4zM580 145h3.4v3.4h-3.4zM585 145h3.4v3.4h-3.4zM590 145h3.4v3.4h-3.4zM595 145h3.4v3.4h-3.4zM600 145h3.4v3.4h-3.4zM605 145h3.4v3.4h-3.4zM610 145h3.4v3.4h-3.4zM615 145h3.4v3.4h-3.4zM620 145h3.4v3.4h-3.4zM625 145h3.4v3.4h-3.4zM630 145h3.4v3.4h-3.4zM635 145h3.4v3.4h-3.4zM640 145h3.4v3.4h-3.4zM645 145h3.4v3.4h-3.4zM650 145h3.4v3.4h-3.4zM655 145h3.4v3.4h-3.4zM660 145h3.4v3.4h-3.4zM540 150h3.4v3.4h-3.4zM545 150h3.4v3.4h-3.4zM550 150h3.4v3.4h-3.4zM555 150h3.4v3.4h-3.4zM560 150h3.4v3.4h-3.4zM565 150h3.4v3.4h-3.4zM570 150h3.4v3.4h-3.4zM575 150h3.4v3.4h-3.4zM580 150h3.4v3.4h-3.4zM585 150h3.4v3.4h-3.4zM590 150h3.4v3.4h-3.4zM595 150h3.4v3.4h-3.4zM600 150h3.4v3.4h-3.4zM605 150h3.4v3.4h-3.4zM610 150h3.4v3.4h-3.4zM615 150h3.4v3.4h-3.4zM620 150h3.4v3.4h-3.4zM625 150h3.4v3.4h-3.4zM630 150h3.4v3.4h-3.4zM635 150h3.4v3.4h-3.4zM640 150h3.4v3.4h-3.4zM645 150h3.4v3.4h-3.4zM650 150h3.4v3.4h-3.4zM655 150h3.4v3.4h-3.4zM660 150h3.4v3.4h-3.4zM540 155h3.4v3.4h-3.4zM545 155h3.4v3.4h-3.4zM550 155h3.4v3.4h-3.4zM555 155h3.4v3.4h-3.4zM560 155h3.4v3.4h-3.4zM565 155h3.4v3.4h-3.4zM570 155h3.4v3.4h-3.4zM575 155h3.4v3.4h-3.4zM580 155h3.4v3.4h-3.4zM585 155h3.4v3.4h-3.4zM590 155h3.4v3.4h-3.4zM595 155h3.4v3.4h-3.4zM600 155h3.4v3.4h-3.4zM605 155h3.4v3.4h-3.4zM610 155h3.4v3.4h-3.4zM615 155h3.4v3.4h-3.4zM620 155h3.4v3.4h-3.4zM625 155h3.4v3.4h-3.4zM630 155h3.4v3.4h-3.4zM635 155h3.4v3.4h-3.4zM640 155h3.4v3.4h-3.4zM645 155h3.4v3.4h-3.4zM650 155h3.4v3.4h-3.4zM655 155h3.4v3.4h-3.4zM660 155h3.4v3.4h-3.4zM540 160h3.4v3.4h-3.4zM545 160h3.4v3.4h-3.4zM550 160h3.4v3.4h-3.4zM555 160h3.4v3.4h-3.4zM560 160h3.4v3.4h-3.4zM565 160h3.4v3.4h-3.4zM570 160h3.4v3.4h-3.4zM575 160h3.4v3.4h-3.4zM580 160h3.4v3.4h-3.4zM585 160h3.4v3.4h-3.4zM590 160h3.4v3.4h-3.4zM595 160h3.4v3.4h-3.4zM600 160h3.4v3.4h-3.4zM605 160h3.4v3.4h-3.4zM610 160h3.4v3.4h-3.4zM615 160h3.4v3.4h-3.4zM620 160h3.4v3.4h-3.4zM625 160h3.4v3.4h-3.4zM630 160h3.4v3.4h-3.4zM635 160h3.4v3.4h-3.4zM640 160h3.4v3.4h-3.4zM645 160h3.4v3.4h-3.4zM650 160h3.4v3.4h-3.4zM655 160h3.4v3.4h-3.4zM660 160h3.4v3.4h-3.4zM540 165h3.4v3.4h-3.4zM545 165h3.4v3.4h-3.4zM550 165h3.4v3.4h-3.4zM555 165h3.4v3.4h-3.4zM560 165h3.4v3.4h-3.4zM565 165h3.4v3.4h-3.4zM570 165h3.4v3.4h-3.4zM575 165h3.4v3.4h-3.4zM580 165h3.4v3.4h-3.4zM585 165h3.4v3.4h-3.4zM590 165h3.4v3.4h-3.4zM595 165h3.4v3.4h-3.4zM600 165h3.4v3.4h-3.4zM605 165h3.4v3.4h-3.4zM610 165h3.4v3.4h-3.4zM615 165h3.4v3.4h-3.4zM620 165h3.4v3.4h-3.4zM625 165h3.4v3.4h-3.4zM630 165h3.4v3.4h-3.4zM635 165h3.4v3.4h-3.4zM640 165h3.4v3.4h-3.4zM645 165h3.4v3.4h-3.4zM650 165h3.4v3.4h-3.4zM655 165h3.4v3.4h-3.4zM660 165h3.4v3.4h-3.4zM540 170h3.4v3.4h-3.4zM545 170h3.4v3.4h-3.4zM550 170h3.4v3.4h-3.4zM555 170h3.4v3.4h-3.4zM560 170h3.4v3.4h-3.4zM565 170h3.4v3.4h-3.4zM570 170h3.4v3.4h-3.4zM575 170h3.4v3.4h-3.4zM580 170h3.4v3.4h-3.4zM585 170h3.4v3.4h-3.4zM590 170h3.4v3.4h-3.4zM595 170h3.4v3.4h-3.4zM600 170h3.4v3.4h-3.4zM605 170h3.4v3.4h-3.4zM610 170h3.4v3.4h-3.4zM615 170h3.4v3.4h-3.4zM620 170h3.4v3.4h-3.4zM625 170h3.4v3.4h-3.4zM630 170h3.4v3.4h-3.4zM635 170h3.4v3.4h-3.4zM640 170h3.4v3.4h-3.4zM645 170h3.4v3.4h-3.4zM650 170h3.4v3.4h-3.4zM655 170h3.4v3.4h-3.4zM660 170h3.4v3.4h-3.4zM540 175h3.4v3.4h-3.4zM545 175h3.4v3.4h-3.4zM550 175h3.4v3.4h-3.4zM555 175h3.4v3.4h-3.4zM560 175h3.4v3.4h-3.4zM565 175h3.4v3.4h-3.4zM570 175h3.4v3.4h-3.4zM575 175h3.4v3.4h-3.4zM580 175h3.4v3.4h-3.4zM585 175h3.4v3.4h-3.4zM590 175h3.4v3.4h-3.4zM595 175h3.4v3.4h-3.4zM600 175h3.4v3.4h-3.4zM605 175h3.4v3.4h-3.4zM610 175h3.4v3.4h-3.4zM615 175h3.4v3.4h-3.4zM620 175h3.4v3.4h-3.4zM625 175h3.4v3.4h-3.4zM630 175h3.4v3.4h-3.4zM635 175h3.4v3.4h-3.4zM640 175h3.4v3.4h-3.4zM645 175h3.4v3.4h-3.4zM650 175h3.4v3.4h-3.4zM655 175h3.4v3.4h-3.4zM660 175h3.4v3.4h-3.4zM540 180h3.4v3.4h-3.4zM545 180h3.4v3.4h-3.4zM550 180h3.4v3.4h-3.4zM555 180h3.4v3.4h-3.4zM560 180h3.4v3.4h-3.4zM565 180h3.4v3.4h-3.4zM570 180h3.4v3.4h-3.4zM575 180h3.4v3.4h-3.4zM580 180h3.4v3.4h-3.4zM585 180h3.4v3.4h-3.4zM590 180h3.4v3.4h-3.4z" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="595" y="125" width="3.4" height="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="540.0" y="40.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">16 bits: 611</text>
  <text x="540.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">51,209</text>
  <text x="16.0" y="210.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">distinct values left of 100,000</text>
</svg>
<figcaption>One dot is a phone number with the same beginning of SHA-256, the coloured dot is the real one. At 16 bits it hides among 611, but the column keeps only about half of its distinct values.</figcaption>
</figure>

99.1% of rows still have a single candidate at 32 bits, 86.1% at 28 and 9.4% at 24. The median row at 16 bits has 611. It is something, but only 51,209 distinct values remain of 100,000, so a join on this column glues different people together. With 20 bits there are 39 candidates and 95,278 values. And 39 people are few if the row also has an age and a town.

## A table without names

The second part is UCI Adult, 48,842 rows from a 1994 survey of the US Census Bureau. I took 6 ordinary columns (sex, age, education, marital status, race, country). I expected more than 20% of rows to be the only ones of their kind and got 14.6%, that is 7,152 rows. With 3 more columns, down to hours per week, the unique ones become 67.7%.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Horizontal bars, share of unique rows in UCI Adult when columns are added one by one. sex: 0.0%; + age: 0.0%; + education: 0.5%; + marital-status: 3.9%; + race: 8.1%; + native-country: 14.6%; + occupation: 32.0%; + workclass: 42.2%; + hours-per-week: 67.7%; sex, age, fnlwgt: 74.3%.">
  <text x="170.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">rows with a combination nobody else has, %</text>
  <text x="160.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">sex</text>
  <line x1="170" y1="34" x2="170" y2="52" class="f-plain"/>
  <text x="178.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">0.0</text>
  <text x="160.0" y="71.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ age</text>
  <line x1="170" y1="58" x2="170" y2="76" class="f-plain"/>
  <text x="178.0" y="71.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">0.0</text>
  <text x="160.0" y="95.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ education</text>
  <line x1="170" y1="82" x2="170" y2="100" class="f-plain"/>
  <rect x="170" y="82" width="2.7" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="180.7" y="95.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">0.5</text>
  <text x="160.0" y="119.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ marital-status</text>
  <line x1="170" y1="106" x2="170" y2="124" class="f-plain"/>
  <rect x="170" y="106" width="21.0" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="199.0" y="119.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">3.9</text>
  <text x="160.0" y="143.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ race</text>
  <line x1="170" y1="130" x2="170" y2="148" class="f-plain"/>
  <rect x="170" y="130" width="43.5" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="221.5" y="143.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">8.1</text>
  <text x="160.0" y="167.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ native-country</text>
  <line x1="170" y1="154" x2="170" y2="172" class="f-plain"/>
  <rect x="170" y="154" width="78.5" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="256.5" y="167.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">14.6</text>
  <text x="160.0" y="191.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ occupation</text>
  <line x1="170" y1="178" x2="170" y2="196" class="f-plain"/>
  <rect x="170" y="178" width="172.0" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="350.0" y="191.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">32.0</text>
  <text x="160.0" y="215.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ workclass</text>
  <line x1="170" y1="202" x2="170" y2="220" class="f-plain"/>
  <rect x="170" y="202" width="226.8" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="404.8" y="215.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">42.2</text>
  <text x="160.0" y="239.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">+ hours-per-week</text>
  <line x1="170" y1="226" x2="170" y2="244" class="f-plain"/>
  <rect x="170" y="226" width="363.9" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="541.9" y="239.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">67.7</text>
  <text x="160.0" y="275.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">sex, age, fnlwgt</text>
  <line x1="170" y1="262" x2="170" y2="280" class="f-plain"/>
  <rect x="170" y="262" width="399.4" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="577.4" y="275.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">74.3</text>
</svg>
<figcaption>UCI Adult, 48,842 rows. Columns are added from top to bottom, the grey bar is a separate set of 3 columns.</figcaption>
</figure>

The column I had left out of my list is `fnlwgt`, the survey weight, which nobody would call a personal attribute. Alone it is unique for 37.5% of rows, together with sex and age for 74.3%. It also says how to read my own numbers. In the Census Bureau dictionary of 1994 the last 2 digits of such a weight are decimals. If the same holds here, the median unique row stands for 1,817 people in the country. Unique in the file is far from unique in the country, unless you know that the person was surveyed.

Then I made the table k-anonymous with k = 5. Of 1,080 ways to coarsen the 6 columns 541 work with at most 1% of rows removed. I took the one with the smallest sum of squared group sizes. It kept age and sex, cut education to 5 levels, dropped the other columns and removed 196 rows. Of its 578 groups 83 have the same income bracket for everybody. That is 4,318 rows, 8.8%. With shuffled incomes the average is 87 rows.

I took it for a big leak, the homogeneity attack that Machanavajjhala and colleagues described in 2006. Then I looked at who is in there. 3,228 of the 4,318 are 22 or younger. In all 83 groups the income is at most 50K. In the whole file 27 of 5,897 people of that age earn more. I did not need the table to guess it. What is left is mostly 807 rows aged 23 to 69. For them it is a leak, but it is 1.7% of the file.

## What I didn't check

I didn't try emails or names, where the space is not a plain range. There was no GPU, which would make the times much smaller. The multiplied days assume that the speed of 20 rows and of 600 calls holds for the whole run. For k-anonymity I took my own hierarchies and one criterion of choice, other ones will give other groups. It is one year of one survey. I also did not read how regulators treat a leaked key. I only saw that recitals 75 and 85 put "unauthorised reversal of pseudonymisation" in the list of harms, close to identity theft.
