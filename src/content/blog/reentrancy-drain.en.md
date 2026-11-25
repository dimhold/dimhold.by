---
title: "The DAO paid out one balance 14,112 times and the balance shrank by 2 wei"
description: "The DAO attack counted from its own transactions: 488 of them, 14,112 payments of one balance, 29 levels deep. Then a toy bank in 8 versions on solc 0.4.15, where a lock on one function and checked subtraction did not work the way I expected."
date: 2017-08-12
lang: en
translationKey: reentrancy-drain
tags: ["open-data", "debugging", "code-quality"]
---

The first transaction of the DAO attack is in block 1,718,497. Its call trace has 81 calls, I printed the value of every call into the attacker's contract. `splitDAO` runs 9 times inside itself there and each time the attacker receives `0.000` ether. At first I took it for a parsing error. The value was 22,190,537,131 wei, about 22 gwei, my format had 3 digits after the point. With this payment the attacker gets control and calls `splitDAO` again, which sends another 258.06 ether to a child DAO.

I always explained reentrancy from the code. The contract pays first and zeroes the record afterwards, the receiver calls it again in between, so the loop runs until the money or the gas ends. I never opened the transactions. On July 25 the SEC published its report on The DAO and I decided to count.

The attack itself is well described. Vessenes wrote about the pattern on June 9, 2016, Reitwiessner explained the safe order in the Ethereum blog a day later and Daian took the DAO exploit apart on June 18. Atzei, Bartoletti and Cimoli have a survey of such attacks this year. I only add some counting and a local test of the fixes.

## 488 transactions

I took the `CreatedToken` events of the child DAO, the receipts of all transactions behind them and the call traces of 3. There were 14,112 payments, 3,641,694 ether in total, in 488 transactions, from 03:34 to 11:00 UTC on June 17, 2016. Each transaction sits in its own block.

I expected loops of all lengths, ending where the gas ended. The first 2 transactions have 9 payments each and the other 486 have exactly 29 each, with the same 2,848,937 gas used. It looks like a counter. The second transaction stopped at 9 with 3,327,362 gas given to its last level. In the trace with 29 payments each level takes 148,889 gas out of the limit of 4,712,388 and the last one still has 484,532, which looks enough for another round. Daian explained the factor of about 30 by a stack limit of 128. But the deepest call here is at depth 88 and the EVM allows 1,024, so the limit I always quoted had no part in it either.

Still, 29 payments of 258 ether is only 7,484 ether. After the loop the DAO writes zero into the balance of the attacker and it should end there. The last call at the bottom explains why it did not, an ordinary `transfer` of the tokens to a second contract of the attacker. Then the levels return one by one and the DAO writes zero 29 times into a record which is already empty.

<figure class="fig">
<svg viewBox="0 0 680 338" role="img" aria-label="One transaction of the attack, block 1,718,504. splitDAO is called 29 times, each call inside the previous one, each sends 258.06 ether to the child DAO and 22 gwei to contract A. At the bottom contract A calls transfer and moves its 258.06 worth of tokens to contract B. On the way back the record of A is set to zero 29 times although it is already empty. The next transaction starts from B and moves the tokens back to A, 488 transactions in turn.">
  <rect x="20" y="16" width="640" height="32" class="f-box"/>
  <text x="36.0" y="37.0" text-anchor="start" class="f-mono f-ink">1</text>
  <text x="68.0" y="37.0" text-anchor="start" class="f-mono f-ink">splitDAO</text>
  <text x="646.0" y="37.0" text-anchor="end" class="f-mono f-muted">child DAO +258.06, contract A +22 gwei</text>
  <line x1="44" y1="48" x2="60" y2="60" class="f-line"/>
  <rect x="52" y="60" width="608" height="32" class="f-box"/>
  <text x="68.0" y="81.0" text-anchor="start" class="f-mono f-ink">2</text>
  <text x="100.0" y="81.0" text-anchor="start" class="f-mono f-ink">splitDAO</text>
  <text x="646.0" y="81.0" text-anchor="end" class="f-mono f-muted">child DAO +258.06, contract A +22 gwei</text>
  <line x1="76" y1="92" x2="92" y2="104" class="f-line"/>
  <rect x="84" y="104" width="576" height="32" class="f-box"/>
  <text x="100.0" y="125.0" text-anchor="start" class="f-mono f-muted">...</text>
  <line x1="108" y1="136" x2="124" y2="148" class="f-line"/>
  <rect x="116" y="148" width="544" height="32" class="f-box"/>
  <text x="132.0" y="169.0" text-anchor="start" class="f-mono f-ink">29</text>
  <text x="164.0" y="169.0" text-anchor="start" class="f-mono f-ink">splitDAO</text>
  <text x="646.0" y="169.0" text-anchor="end" class="f-mono f-muted">child DAO +258.06, contract A +22 gwei</text>
  <line x1="140" y1="180" x2="156" y2="192" class="f-line"/>
  <rect x="148" y="192" width="512" height="32" class="f-box" style="stroke:var(--accent)"/>
  <text x="404.0" y="213.0" text-anchor="middle" class="f-mono f-accent">transfer: 258.06 from A to B</text>
  <text x="660.0" y="250.0" text-anchor="end" class="f-mono f-muted">way back: balance of A = 0, 29 times, it is already empty</text>
  <rect x="20" y="274" width="150" height="36" class="f-box"/>
  <text x="95.0" y="297.0" text-anchor="middle" class="f-mono f-ink">contract A</text>
  <rect x="510" y="274" width="150" height="36" class="f-box"/>
  <text x="585.0" y="297.0" text-anchor="middle" class="f-mono f-ink">contract B</text>
  <line x1="170" y1="286" x2="510" y2="286" class="f-line"/>
  <path d="M502 282 L510 286 L502 290" class="f-line" style="fill:none"/>
  <line x1="170" y1="300" x2="510" y2="300" class="f-line"/>
  <path d="M178 296 L170 300 L178 304" class="f-line" style="fill:none"/>
  <text x="340.0" y="326.0" text-anchor="middle" class="f-mono f-muted">488 transactions in turn</text>
</svg>
<figcaption>One transaction of 29 levels. The call in the accent colour is the one that lets the next transaction start with the same balance.</figcaption>
</figure>

The next transaction starts from the second contract and at the bottom moves the tokens back. I checked all 488, each has one such transfer, 244 in one direction and 244 in the other. So recursion gives a factor of 29 and the `transfer` gives 488. Daian has this in his post, with both contracts, my explanations had only the loop.

The smallest unit of the token was sold for 1 wei, so I count the balance in ether too. Before the first transaction it was 258.056141471 and the second contract had nothing. After the last one it was 258.056141470999999998, so 2 wei are missing. I wrote them down as lost, then looked at the token transfers around the place where the payments get smaller. Each contract sent exactly one unit away in a separate transaction, at 10:03 and 10:08 UTC. The receivers are 2 contracts with the same 2,142 bytes of code and they made none of the 488 transactions. Maybe it was a spare pair, the first 2 also held one unit each before the rest of the tokens came.

## A toy bank

Then I wrote a bank with the same order of operations and 7 other versions of it. It all runs in a local VM: solc 0.4.15, which came out this week, `ethereumjs-vm` 2.2.1 with the gas rules of EIP 150 and Node 8.3.0. The bank holds 1,000 ether of other people. My caller has 1 ether there and asks for 10 payments, in another run it moves its record to a friend in the middle of the call. The table shows what they got together for this 1 ether, 0 means that the transaction failed. The last column is an honest withdrawal, compared with the first row.

| version | `withdraw` again | move the record | honest gas |
|---|---|---|---|
| pay, then zero | 10 | 2 | 47,455 |
| pay, then subtract | 10 | 2 | +216 |
| pay, then checked subtract | 0 | 0 | +392 |
| zero, then pay | 1 | 1 | -65 |
| pay by `transfer`, then zero | 0 | 0 | +11 |
| lock on `withdraw` | 1 | 2 | +10,676 |
| lock on both functions | 1 | 1 | +10,676 |

The 8th version ignores the result of `call` and behaves like the first row. solc gave a warning about the unused return value there and said nothing about the order of lines in any bank.

Plain subtraction is worse than zeroing, the record of the caller underflows and becomes a huge number. The lock on `withdraw` alone adds more than 10 thousand gas and lets the second half of the DAO attack through.

Checked subtraction surprised me. With 10 payments the transaction fails, so I thought it always would, then I ran the counter from 1 to 12. Every even number fails and every odd number gives the caller exactly its own 1 ether. The level above the deepest one subtracts from an empty record and throws, so its own payment and the one below are cancelled. The next level up sees a normal record again and passes. Nothing was stolen in these runs, but from 3 payments on each odd run also burned 6,396,205 gas of 6,712,392 on the way to this 1 ether.

## Where the loop stops

Block 4,145,000 was mined yesterday, its gas limit is 6,712,392. With that limit my caller gets 62 payments from the first bank, at 4,712,388 it gets 52. The depth is 125, again far from 1,024.

A caller without a counter should take the maximum, but at a limit of 200,000 it takes 2 payments and with the counter at 3 it takes 3. So I scanned the counters. A caller that asks for too much does not lose everything, the call at the bottom fails and the levels above keep their money. At 6,712,392 every counter from 62 to 100 gave the same 62.

The run with the counter at 65 used only 1,420,252 gas of 6.7 million. The rest is held back on the way down. Since October 2016 and EIP 150 a call passes on at most 63/64 of the gas. solc also keeps a reserve for the calling side, the constants are in the bytecode, 34,710 in the bank and 25,710 in my caller. In both 25,000 is the price of creating an account, which does not happen here. With the caller's call rewritten in assembly, without the reserve, it got 69. For the DAO the line is straight because the 1/64 rule did not exist yet.

<figure class="fig">
<svg viewBox="0 0 680 304" role="img" aria-label="Gas available by call depth. The DAO transaction falls in a straight line from 4,653,424 at depth 1 to 484,532 at depth 85. The toy bank under EIP 150 falls along a curve from 6,690,608 at depth 0 to almost nothing at depth 125.">
  <line x1="60" y1="250.0" x2="650" y2="250.0" class="f-plain"/>
  <text x="50.0" y="254.0" text-anchor="end" class="f-mono f-muted">0</text>
  <line x1="60" y1="188.3" x2="650" y2="188.3" class="f-plain"/>
  <text x="50.0" y="192.3" text-anchor="end" class="f-mono f-muted">2</text>
  <line x1="60" y1="126.6" x2="650" y2="126.6" class="f-plain"/>
  <text x="50.0" y="130.6" text-anchor="end" class="f-mono f-muted">4</text>
  <line x1="60" y1="64.9" x2="650" y2="64.9" class="f-plain"/>
  <text x="50.0" y="68.9" text-anchor="end" class="f-mono f-muted">6</text>
  <text x="60.0" y="270.0" text-anchor="middle" class="f-mono f-muted">0</text>
  <text x="150.8" y="270.0" text-anchor="middle" class="f-mono f-muted">20</text>
  <text x="241.5" y="270.0" text-anchor="middle" class="f-mono f-muted">40</text>
  <text x="332.3" y="270.0" text-anchor="middle" class="f-mono f-muted">60</text>
  <text x="423.1" y="270.0" text-anchor="middle" class="f-mono f-muted">80</text>
  <text x="513.8" y="270.0" text-anchor="middle" class="f-mono f-muted">100</text>
  <text x="604.6" y="270.0" text-anchor="middle" class="f-mono f-muted">120</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted">gas available, millions</text>
  <text x="650.0" y="292.0" text-anchor="end" class="f-label f-muted">call depth</text>
  <polyline points="60.0,43.5 64.5,47.6 69.1,51.0 73.6,54.8 78.2,58.1 82.7,61.4 87.2,64.6 91.8,67.7 96.3,70.8 100.8,73.9 105.4,76.9 109.9,79.9 114.5,82.8 119.0,85.7 123.5,88.5 128.1,91.3 132.6,94.0 137.2,96.7 141.7,99.3 146.2,101.9 150.8,104.5 155.3,107.0 159.8,109.5 164.4,112.0 168.9,114.4 173.5,116.8 178.0,119.1 182.5,121.4 187.1,123.7 191.6,125.9 196.2,128.1 200.7,130.3 205.2,132.4 209.8,134.5 214.3,136.5 218.8,138.6 223.4,140.5 227.9,142.5 232.5,144.4 237.0,146.4 241.5,148.2 246.1,150.1 250.6,151.9 255.2,153.7 259.7,155.4 264.2,157.2 268.8,158.9 273.3,160.6 277.8,162.2 282.4,163.8 286.9,165.4 291.5,167.0 296.0,168.6 300.5,170.1 305.1,171.6 309.6,173.1 314.2,174.5 318.7,176.0 323.2,177.4 327.8,178.8 332.3,180.1 336.8,181.5 341.4,182.8 345.9,184.1 350.5,185.4 355.0,186.7 359.5,187.9 364.1,189.1 368.6,190.3 373.2,191.5 377.7,192.7 382.2,193.9 386.8,195.0 391.3,196.1 395.8,197.2 400.4,198.3 404.9,199.3 409.5,200.4 414.0,201.4 418.5,202.5 423.1,203.5 427.6,204.5 432.2,205.5 436.7,206.6 441.2,207.6 445.8,208.7 450.3,209.7 454.8,210.7 459.4,211.7 463.9,212.8 468.5,213.8 473.0,214.8 477.5,215.9 482.1,216.9 486.6,217.9 491.2,219.0 495.7,220.0 500.2,221.0 504.8,222.0 509.3,223.1 513.8,224.1 518.4,225.2 522.9,226.2 527.5,227.2 532.0,228.2 536.5,229.3 541.1,230.3 545.6,231.3 550.2,232.4 554.7,233.4 559.2,234.4 563.8,235.5 568.3,236.5 572.8,237.5 577.4,238.6 581.9,239.6 586.5,240.6 591.0,241.7 595.5,242.7 600.1,243.7 604.6,244.7 609.2,245.8 613.7,246.8 618.2,247.9 622.8,248.9 627.3,249.9" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <polyline points="64.5,106.4 78.2,111.0 91.8,115.6 105.4,120.2 119.0,124.8 132.6,129.4 146.2,134.0 159.8,138.6 173.5,143.2 187.1,147.8 200.7,152.4 214.3,156.9 227.9,161.5 241.5,166.1 255.2,170.7 268.8,175.3 282.4,179.9 296.0,184.5 309.6,189.1 323.2,193.7 336.8,198.3 350.5,202.9 364.1,207.5 377.7,212.1 391.3,216.7 404.9,221.3 418.5,225.9 432.2,230.5 445.8,235.0" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <circle cx="445.8" cy="235.0" r="3.5" style="fill:var(--ink)"/>
  <line x1="300" y1="84" x2="324" y2="84" style="stroke:var(--accent);stroke-width:2"/>
  <text x="332.0" y="88.0" text-anchor="start" class="f-mono f-ink">toy bank, EIP 150, 62 payments</text>
  <line x1="300" y1="106" x2="324" y2="106" style="stroke:var(--ink);stroke-width:2"/>
  <text x="332.0" y="110.0" text-anchor="start" class="f-mono f-ink">The DAO, June 2016, 29 payments</text>
</svg>
<figcaption>Gas available at each call depth. Both loops end long before the depth limit of 1,024, which is almost 8 chart widths from zero.</figcaption>
</figure>

A shorter loop is a weak defence anyway. My caller, at 60 payments per transaction, put all it had back into the bank before each run. It went from 1 ether to 60 and then to 960, in 2 transactions. The DAO attacker could not do it, the ether was locked in the child DAO for about 27 days and the sale of tokens was over in May, so the stake was the same for 488 steps.

## The price of 2300 gas

`transfer` in row 5 gives the receiver 2300 gas, so it stops the repeated call in any order of lines. I tried 4 honest contracts as clients of that bank. One with an empty fallback and one that logs an event get their money. One that adds to a counter and one that forwards the money don't, the transaction fails and burns all 200,000 gas. With zero first and `call` all 4 work.

I'd move the line first, it is even 65 gas cheaper here, then think about the rest.

## What I didn't check

The real DAO is compiled by an older solc and I only read its traces. The VM promises EIP 150, mainnet is already on Spurious Dragon and I did not compare them opcode by opcode. Metropolis should bring REVERT and the burned gas of failed calls will change. I read the data from public nodes and did not sync the chain myself. During these 7 hours the DAO lost about 25 thousand ether more than went into this child DAO and I did not look where.
