---
title: "A transaction classifier with 94.5% on a random split gets 46.9% on a new merchant"
description: "I compared 22 hand rules, a lookup table, TF-IDF and MiniLM on 83,692 real card payments of the Washington city government. TF-IDF gets 94.5% on a random split, 91.5% on the next 2 months and 46.9% on merchants it has not seen."
date: 2024-04-06
lang: en
translationKey: transactions-rules-vs-model
tags: ["machine-learning", "text", "open-data"]
---

The city of Washington publishes the purchases made with its government cards (Open Data DC, CC BY 4.0). I took 2 years of them and counted the rows by the merchant category that comes with each payment. The biggest category is BOOK STORES with 15,079 rows. 14,785 of them are Amazon.

So the label I was going to predict says what the shop is for the card network and nothing about what was bought. But it comes free with every row.

I used to think about transaction categories as a closed exercise. Train TF-IDF with logistic regression, see something above 90 and move on. I never checked how much of that number comes from merchants that are both in training and in the test.

Vollset and colleagues in 2017 took about 220,000 Norwegian descriptions, used bag of words with logistic regression and then improved it with a company registry. García-Méndez and colleagues in 2020 used an SVM over character and word n-grams. I wanted to add hand rules and to count new merchants separately.

## What I took

The rows run from March 2022 to February 2024, only those the city had loaded before this post. Without disputes, fraud credits and unknown codes there are 83,692. Some names are already cleaned (`AMERICAN AIRLINES` or just `PAYPAL`), others are raw and cut at 22 characters, like `SQ *MARYLAND BASKETBAL`. I mapped 338 category descriptions into 16 before running any classifier, so BOOK STORES went to shopping.

Training is everything up to December 31, 2023, 77,011 rows. The test is January and February 2024, 6,681 rows. A merchant is a key made by a small script: it removes prefixes like `SQ *`, drops words with digits and keeps the first 2 words. A merchant is new if its key is not in the training part.

There are 5 methods:

- a table that gives every known merchant its most frequent category, a new one gets shopping;
- 22 regular expressions with 8 to 25 alternatives, written in one sitting from the 230 largest training merchants and common sense;
- TF-IDF over character n-grams from 2 to 4 with logistic regression;
- `all-MiniLM-L6-v2` embeddings with logistic regression;
- the same embeddings with 5 nearest neighbours.

Python 3.11, `scikit-learn` 1.4.1, `onnxruntime` 1.17.1. Before the run I wrote down what I expected. The table and TF-IDF pass 95% on a random split. On new merchants TF-IDF falls below 60%. MiniLM is at least 5 points better there, it knows words that my training set never saw.

## The numbers

<figure class="fig">
<svg viewBox="0 0 680 352" role="img" aria-label="Accuracy in percent for 5 methods on the random split, on January and February 2024 and on new merchants. lookup table: 92.5; 88.9; 13.8. 22 rules: 67.1; 66.4; 32.8. TF-IDF + LR: 94.5; 91.5; 46.9. MiniLM + LR: 84.9; 81.7; 40.3. MiniLM + 5 NN: 77.8; 77.4; 49.5.">
  <rect x="130.0" y="5.0" width="12.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="150.0" y="15.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">random 10% of the training period</text>
  <rect x="130.0" y="23.0" width="12.0" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="150.0" y="33.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">January and February 2024</text>
  <rect x="130.0" y="41.0" width="12.0" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="150.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">only new merchants there</text>
  <text x="120.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">lookup table</text>
  <rect x="130.0" y="72.0" width="453.3" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="589.3" y="81.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">92.5</text>
  <rect x="130.0" y="86.0" width="435.6" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="571.6" y="95.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">88.9</text>
  <rect x="130.0" y="100.0" width="67.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="203.6" y="109.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13.8</text>
  <text x="120.0" y="153.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22 rules</text>
  <rect x="130.0" y="128.0" width="328.8" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="464.8" y="137.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">67.1</text>
  <rect x="130.0" y="142.0" width="325.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="461.4" y="151.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">66.4</text>
  <rect x="130.0" y="156.0" width="160.7" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="296.7" y="165.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">32.8</text>
  <text x="120.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">TF-IDF + LR</text>
  <rect x="130.0" y="184.0" width="463.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="599.0" y="193.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">94.5</text>
  <rect x="130.0" y="198.0" width="448.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="584.4" y="207.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">91.5</text>
  <rect x="130.0" y="212.0" width="229.8" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="365.8" y="221.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">46.9</text>
  <text x="120.0" y="265.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + LR</text>
  <rect x="130.0" y="240.0" width="416.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="552.0" y="249.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">84.9</text>
  <rect x="130.0" y="254.0" width="400.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="536.3" y="263.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">81.7</text>
  <rect x="130.0" y="268.0" width="197.5" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="333.5" y="277.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">40.3</text>
  <text x="120.0" y="321.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + 5 NN</text>
  <rect x="130.0" y="296.0" width="381.2" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="517.2" y="305.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77.8</text>
  <rect x="130.0" y="310.0" width="379.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="515.3" y="319.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77.4</text>
  <rect x="130.0" y="324.0" width="242.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="378.6" y="333.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">49.5</text>
  <line x1="130" y1="66" x2="130" y2="342" class="f-line"/>
</svg>
<figcaption>Share of correct categories, %. The last bar of each group is 580 rows from merchants that are not in the training part. For the table it is just the fallback to shopping.</figcaption>
</figure>

On a random 10% of the training period TF-IDF gets 94.5% and the table 92.5%. Already below my 95. On January and February it is 91.5% and 88.9%. The rules have 66.4%, while the share of the biggest category is 33.8%.

Then I split the test. 6,101 rows are from merchants that were in the training part. There the table gives 96.1%, a bit more than TF-IDF with 95.7%. The other 580 rows, 8.7%, come from 409 new merchants. TF-IDF has 46.9% on them, the rules 32.8%. In the random split only 4.8% of the rows were new, which is one reason why it looks better. On those 367 rows TF-IDF had only 43.6%.

MiniLM did not help. The neighbours have 49.5% on new merchants against 46.9%. If I resample merchants, the 95% interval of the difference goes from -2.7 to 8.3. On the known ones the neighbours lose 16 points. I think the descriptors are too short and too broken for a sentence model, but I did not test this.

Even 46.9 is flattered by hotels. They are 91 of the 580 rows, a chain in another city often counts as a new merchant and TF-IDF is right in 84.6% of these rows. Without them it is 39.9%.

## The warnings I switched off

My first run gave other numbers for TF-IDF. It was 90.3% on January and February. On merchants that appear in the training part exactly once it was 61.5%, where the table has 94.7%. It looked like a model that forgets what it saw one time.

Then I repeated the fit with one thread instead of 2 and got 62.3%. A convex problem solved to the end should not do that. I had started Python with `-W ignore`, the limit was 100 iterations and the hidden line was a `ConvergenceWarning`. With a limit of 1000 it stops after 225 and the same merchants get 84.6%. The new ones moved from 49.0% to 46.9%, so the early stop even helped a little there.

The warning is gone, but the threads still matter. With 2 of them it stops after 213 iterations and gives 83.8% and 47.1%. So the default tolerance does not reach the exact optimum either. It is 2 rows of 247 and one of 580, I left it and all the final numbers here are from one thread.

<figure class="fig">
<svg viewBox="0 0 680 424" role="img" aria-label="Accuracy in percent by the number of transactions of the merchant in the training part. lookup table: 0: 13.8; 1: 94.7; 2 to 4: 95.1; 5 to 19: 91.6; 20+: 97.2. TF-IDF + LR: 0: 46.9; 1: 84.6; 2 to 4: 94.6; 5 to 19: 93.2; 20+: 96.9. MiniLM + 5 NN: 0: 49.5; 1: 77.7; 2 to 4: 77.9; 5 to 19: 75.8; 20+: 81.2. 22 rules: 0: 32.8; 1: 27.9; 2 to 4: 34.3; 5 to 19: 35.7; 20+: 82.1.">
  <line x1="70" y1="360.0" x2="620" y2="360.0" class="f-plain"/>
  <text x="64.0" y="364.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="285.5" x2="620" y2="285.5" class="f-plain"/>
  <text x="64.0" y="289.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="70" y1="211.0" x2="620" y2="211.0" class="f-plain"/>
  <text x="64.0" y="215.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="136.5" x2="620" y2="136.5" class="f-plain"/>
  <text x="64.0" y="140.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="70" y1="62.0" x2="620" y2="62.0" class="f-plain"/>
  <text x="64.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="4.0" y="50.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">correct, %</text>
  <text x="135.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="135.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">580 rows</text>
  <text x="253.8" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">1</text>
  <text x="253.8" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">247</text>
  <text x="372.5" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2 to 4</text>
  <text x="372.5" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">411</text>
  <text x="491.3" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">5 to 19</text>
  <text x="491.3" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">928</text>
  <text x="610.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">20+</text>
  <text x="610.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4,515</text>
  <text x="355.0" y="416.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">transactions of the merchant in training</text>
  <polyline points="135.0,318.9 253.8,77.8 372.5,76.6 491.3,87.0 610.0,70.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="135.0" cy="318.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="253.8" cy="77.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.5" cy="76.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="491.3" cy="87.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="610.0" cy="70.3" r="3" style="fill:var(--ink);stroke:none"/>
  <line x1="70" y1="16" x2="94" y2="16" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="100.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">lookup table</text>
  <polyline points="135.0,220.2 253.8,107.9 372.5,78.1 491.3,82.3 610.0,71.2" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="135.0" cy="220.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="107.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="78.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="82.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="71.2" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="218" y1="16" x2="242" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="248.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">TF-IDF + LR</text>
  <polyline points="135.0,212.5 253.8,128.5 372.5,127.9 491.3,134.1 610.0,118.0" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <circle cx="135.0" cy="212.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="128.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="127.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="134.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="118.0" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="366" y1="16" x2="390" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <text x="396.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">MiniLM + 5 NN</text>
  <polyline points="135.0,262.3 253.8,276.9 372.5,257.8 491.3,253.6 610.0,115.3" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <circle cx="135.0" cy="262.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="253.8" cy="276.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="372.5" cy="257.8" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="491.3" cy="253.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="115.3" r="3" style="fill:var(--muted);stroke:none"/>
  <line x1="514" y1="16" x2="538" y2="16" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <text x="544.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">22 rules</text>
  <text x="127.0" y="209.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">49.5</text>
  <text x="127.0" y="232.2" text-anchor="end" class="f-mono f-accent" style="font-size:11px">46.9</text>
  <text x="127.0" y="266.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">32.8</text>
  <text x="127.0" y="322.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">13.8</text>
  <text x="253.8" y="69.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">94.7</text>
  <text x="263.8" y="119.9" text-anchor="start" class="f-mono f-accent" style="font-size:11px">84.6</text>
  <text x="259.8" y="144.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77.7</text>
  <text x="253.8" y="292.9" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">27.9</text>
  <text x="620.0" y="133.3" text-anchor="start" class="f-mono f-muted" style="font-size:11px">82.1</text>
  <text x="620.0" y="75.2" text-anchor="start" class="f-mono f-accent" style="font-size:11px">96.9</text>
</svg>
<figcaption>The same test, split by how many times the merchant appears in the training part. Below the axis is the number of test rows in each group. The rules do not learn, they were written from the list of big merchants.</figcaption>
</figure>

The effect is still there, just smaller. For a merchant seen one time the table is better than the model. From 2 transactions they agree within 2 points and the rules stay far behind. I never tuned C, it stayed 10. With C=100 the merchants seen once get 91.1%, but the new ones go down to 45.3%.

## Rules and confidence

The rules are mostly silent. On new merchants a rule matched 228 rows of 580 and was right in 58.8% of them. TF-IDF on the same rows has 51.8%. The sample is small, I would not defend the difference.

My favourite mistake is `NATIONAL CAR RENTAL`. I had a rule that NATIONAL means an association, because the training list is full of national associations. TF-IDF said services, with a probability of 0.76. Only the neighbours guessed transport.

I hoped the probability would warn about new merchants. It does, only partly:

| top probability | known: share | known: correct | new: share | new: correct |
|---|---|---|---|---|
| 0.5 and more | 97.5% | 97.0% | 69.3% | 57.5% |
| 0.7 and more | 90.1% | 99.0% | 38.3% | 72.5% |
| 0.9 and more | 78.6% | 99.8% | 19.0% | 86.4% |

The same 0.9 means about one error in 500 for a known merchant and one in 7 for a new one.

In the total it changes less than I expected. The table alone has 88.9%, the table with 22 rules for new merchants 90.6%, the table with TF-IDF 91.8%. If I answer only when the merchant is known or the probability is at least 0.9, then 470 rows, 7.0% of the test, go to a person and 95.9% of the rest is right.

I would start from the table and spend the time on these 470 rows.

## What I didn't check

These are payments of a city government, 18.3% of the test rows are Amazon, so my percentages do not transfer to a family budget. The merchant key is my own heuristic and the same company with another spelling counts as new. Bare PAYPAL is 2,714 training rows in 14 categories, the most frequent has 61.2% and the string itself tells nothing more. A team that keeps its rules for years would have better ones than mine. The checks with hotels and the 470 rows I added after seeing the results. I did not try the amount, the agency or a large language model. The city edits old rows, so a download on another day can differ a little.
