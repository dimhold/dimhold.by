---
title: "Flan-T5 read 1,393 of 1,413 invoice lines right and added up 1 of 400 invoices"
description: "I gave Flan-T5 base and large 400 invoices and asked 6 kinds of questions. Large read 1,393 of 1,413 line amounts and 388 of 400 printed totals right. It got 6 of 1,600 calculation questions right. Its wrong totals looked exactly like totals. Step by step it wrote the right expression and the wrong sum. With the model reading each line and code adding them, 386 of 400 totals were right."
date: 2022-12-14
lang: en
translationKey: read-not-compute
tags: ["llm", "numbers", "reliability"]
---
Since ChatGPT came out 2 weeks ago, the idea I hear most in fintech is to let a language model check documents. Take an invoice and check that the lines add up to the total. I had my own assumption about it and I never tested it. I thought reading is the hard part. The model has to find the right number next to the right name. Adding 4 numbers after that looked like the easy step.

ChatGPT has no API, so I cannot send it a few thousand invoices. I took a model I can run on my own machine and measured where it stops being right.

## The setup

The model is Flan-T5 from Google, base (250M parameters) and large (780M), released in October. It runs on 4 cores of an AMD EPYC virtual machine, Python 3.9, torch 1.13, transformers 4.25.1, greedy decoding. One question takes about 0.4 s on base and 1.5 s on large.

A script generated 400 invoices with seed 2022, so every right answer is known. Each has 2 to 5 lines. Half of the invoices have whole amounts up to 99, like `PLN 45`. The other half have amounts with grosze up to 999.99, like `PLN 412.35`. An invoice looks like this:

```
Invoice No. 55049
Seller: Marek Nowak Consulting
cable ties: PLN 9
paper reams: PLN 68
drill bits: PLN 90
desk lamps: PLN 92
```

I asked 6 kinds of questions about the same invoices. 2 of them only need reading: the amount of one line and the total when the invoice has a `Total:` line. 4 need a calculation. 2 of them work on 2 lines, the sum and the difference. The 3rd is the total when there is no total line. The 4th is quantity times price, for a line written as `6 x PLN 73.82`. Each prompt is the document and the question, followed by `Answer with the amount only.` An answer is right only if it has exactly 1 number and that number is the right one.

## Reading

Large read 1,393 of 1,413 line amounts right and 388 of 400 printed totals. Base was worse with 1,154 lines and 360 totals. It often did not stop after the amount and gave the next lines too.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Bars for Flan-T5 base and large. Amount of a line: base 1154 of 1,413, large 1,393 of 1,413. Printed total: 360 and 388 of 400. Sum of 2 lines: 0 and 2 of 400. Difference of 2 lines: 0 and 3. Quantity times price: 0 and 0. Total without a total line: 0 and 1.">
  <text x="12" y="18" class="f-label f-muted">right answers out of all questions of each kind</text>
  <rect x="210" y="30" width="12" height="10" class="f-plain"/>
  <text x="228" y="39" class="f-mono f-ink" style="font-size:11px">base</text>
  <rect x="290" y="30" width="12" height="10" class="f-box"/>
  <text x="308" y="39" class="f-mono f-ink" style="font-size:11px">large</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">the answer is printed</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">amount of a line</text>
  <rect x="210" y="82" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="77" width="245" height="11" class="f-plain"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">1,154/1,413</text>
  <rect x="210" y="96" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="91" width="296" height="11" class="f-box"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">1,393/1,413</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">printed total</text>
  <rect x="210" y="116" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="111" width="270" height="11" class="f-plain"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">360/400</text>
  <rect x="210" y="130" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="125" width="291" height="11" class="f-box"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">388/400</text>
  <text x="12" y="156" class="f-mono f-accent" style="font-size:12px">the answer has to be calculated</text>
  <text x="24" y="184" class="f-mono f-ink" style="font-size:11px">sum of 2 lines</text>
  <rect x="210" y="172" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="176" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="186" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="181" width="2" height="11" class="f-box"/>
  <text x="520" y="190" class="f-mono f-ink" style="font-size:11px">2/400</text>
  <text x="24" y="218" class="f-mono f-ink" style="font-size:11px">difference of 2 lines</text>
  <rect x="210" y="206" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="210" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="220" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="215" width="2" height="11" class="f-box"/>
  <text x="520" y="224" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="24" y="252" class="f-mono f-ink" style="font-size:11px">quantity x price</text>
  <rect x="210" y="240" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="244" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="254" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="258" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <text x="24" y="286" class="f-mono f-ink" style="font-size:11px">total, no total line</text>
  <rect x="210" y="274" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="278" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="288" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="283" width="2" height="11" class="f-box"/>
  <text x="520" y="292" class="f-mono f-ink" style="font-size:11px">1/400</text>
</svg>
<figcaption>The same 400 invoices. Large got 6 of 1,600 calculation questions right, base 0.</figcaption>
</figure>

The mistakes of large are not random. Of its 20 wrong line answers, 19 are a single wrong amount and 18 of those are the amount of the line above. 14 of the 19 are in invoices with 5 lines and whole amounts. All 12 wrong totals are 1,000 or more. These are also the only totals with a thousands separator. Large returned `PLN 1,218.24` for 2,188.24 and `PLN 30005.03` for 3,005.03. Totals under 1,000 it read right 228 of 228 times.

## Calculating

Large got 6 of 1,600 calculation questions right. Base got 0. All 6 were on invoices with whole amounts, so even there it is 6 of 800. In 2 of the 6 the right sum was also printed as another line of the invoice, 79 and 91. Large returned that number and I cannot tell if it added or copied.

The wrong answers are what worried me more. For the total without a total line, large returned the amount of one of the lines in 201 of 400 cases. In 16 more it returned the invoice number. In the other 182 it returned a number that is not in the invoice. All of them look exactly like a total. The answer is 1 number with `PLN` in front of it and a parser accepts it without an error. For quantity times price it was different. Large copied the line back, `6 x PLN 73.82`, in all 400 cases. For large that is the only kind of question where the failure is loud, because the answer has 2 numbers in it.

## Asking it to show the steps

Flan-T5 was trained with chain of thought examples, so the fair next try was to add `Let's think step by step.` to the sum questions. Large then writes the calculation out. On the invoice above it answered:

```
The total amount of all items is PLN 9 + 68 + 90 + 92 = PLN 340. The answer: 340.
```

The right total is 259. Here every number to the left of `=` is right and only the addition is wrong.

<figure class="fig">
<svg viewBox="0 0 640 254" role="img" aria-label="The invoice has lines 9, 68, 90 and 92. Large writes 9 + 68 + 90 + 92 = 340. Python evaluates the same expression and gets 259, which is the right total. Over 400 sum questions with step by step: an expression was written 398 times, the final answer of large was right 3 times, the expression evaluated by Python was right 223 times.">
  <text x="12" y="18" class="f-label f-muted">invoice</text>
  <text x="12" y="38" class="f-mono f-ink" style="font-size:12px">cable ties: PLN 9</text>
  <text x="12" y="54" class="f-mono f-ink" style="font-size:12px">paper reams: PLN 68</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:12px">drill bits: PLN 90</text>
  <text x="12" y="86" class="f-mono f-ink" style="font-size:12px">desk lamps: PLN 92</text>
  <path d="M190 60 L232 60" class="f-line" marker-end="url(#a519)"/>
  <defs><marker id="a519" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="f-muted"/></marker></defs>
  <text x="244" y="18" class="f-label f-muted">large writes</text>
  <rect x="244" y="44" width="24" height="26" rx="3" class="f-box"/>
  <text x="256" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">9</text>
  <text x="284" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="300" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="317" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">68</text>
  <text x="350" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="366" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="383" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">90</text>
  <text x="416" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="432" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="449" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">92</text>
  <text x="482" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">=</text>
  <rect x="498" y="44" width="48" height="26" rx="3" class="f-accent"/>
  <text x="522" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">340</text>
  <text x="522" y="88" class="f-label f-muted" text-anchor="middle">large says</text>
  <text x="244" y="118" class="f-label f-muted">Python evaluates the same expression</text>
  <text x="244" y="140" class="f-mono f-ink" style="font-size:13px">9 + 68 + 90 + 92 = 259</text>
  <text x="440" y="140" class="f-label f-muted">right</text>
  <line x1="12" y1="162" x2="628" y2="162" class="f-plain"/>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">expression written</text>
  <rect x="360" y="178" width="200" height="12" class="f-plain"/>
  <rect x="360" y="178" width="199" height="12" class="f-box"/>
  <text x="570" y="188" class="f-mono f-ink" style="font-size:11px">398/400</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">its own answer right</text>
  <rect x="360" y="202" width="200" height="12" class="f-plain"/>
  <rect x="360" y="202" width="2" height="12" class="f-accent"/>
  <text x="570" y="212" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">the expression right when Python evaluates it</text>
  <rect x="360" y="226" width="200" height="12" class="f-plain"/>
  <rect x="360" y="226" width="112" height="12" class="f-box"/>
  <text x="570" y="236" class="f-mono f-ink" style="font-size:11px">223/400</text>
</svg>
<figcaption>Step by step on the first 200 invoices, 400 sum questions, Flan-T5 large only.</figcaption>
</figure>

I ran this only on the first 200 invoices, 400 sum questions, because 1 answer takes about 8 seconds. Large wrote an expression in 398 of them. Its own final answer was right in 3. Then I took the expression it wrote and evaluated it in Python. 223 of 400 were right. For a moment I thought this was the fix, but the totals spoiled it. In the questions about the total without a total line, the expression had every line of the invoice in only 89 of 198 cases. With 2 lines it was 51 of 55, with 5 lines 8 of 43. In 99 of the other 109 the model left some lines out of the sum. In the rest it misread or repeated an amount.

## Reading with the model, adding with code

So I split the work along that line. The model reads each line amount with one question per line and Python adds them up. Large then got 386 of 400 totals right, against 1 of 400 when it was asked for the total directly. Each of the 13 wrong totals has a misread line in it. For 1 invoice a line came back with 2 numbers, so the code refused to add it.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Asking for the total directly: base 0 right of 400, 355 wrong silent, 45 loud. Large 1 right, 399 wrong silent, 0 loud. Model reads each line and code adds: base 211 right, 18 wrong silent, 171 loud. Large 386 right, 13 wrong silent, 1 loud.">
  <text x="12" y="18" class="f-label f-muted">the total of 400 invoices, 2 ways</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">right</text>
  <rect x="182" y="30" width="12" height="10" class="f-accent"/>
  <text x="200" y="39" class="f-mono f-ink" style="font-size:11px">wrong, silent</text>
  <rect x="352" y="30" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="39" class="f-mono f-ink" style="font-size:11px">loud, code refuses</text>
  <text x="12" y="64" class="f-mono f-accent" style="font-size:12px">ask the model for the total</text>
  <text x="24" y="86" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="76" width="266" height="12" class="f-accent"/>
  <rect x="496" y="76" width="34" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="86" class="f-mono f-ink" style="font-size:11px">0/355/45</text>
  <text x="24" y="108" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="98" width="1" height="12" class="f-box"/>
  <rect x="231" y="98" width="299" height="12" class="f-accent"/>
  <text x="540" y="108" class="f-mono f-ink" style="font-size:11px">1/399/0</text>
  <text x="12" y="136" class="f-mono f-accent" style="font-size:12px">model reads each line, code adds</text>
  <text x="24" y="158" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="148" width="158" height="12" class="f-box"/>
  <rect x="388" y="148" width="14" height="12" class="f-accent"/>
  <rect x="402" y="148" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="158" class="f-mono f-ink" style="font-size:11px">211/18/171</text>
  <text x="24" y="180" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="170" width="290" height="12" class="f-box"/>
  <rect x="520" y="170" width="10" height="12" class="f-accent"/>
  <rect x="530" y="170" width="1" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="180" class="f-mono f-ink" style="font-size:11px">386/13/1</text>
</svg>
<figcaption>Loud means the answer has more than 1 number, so code can see that something is wrong. With the second way it is enough for 1 line.</figcaption>
</figure>

Base gave 211 right totals this way and 18 wrong ones. In the other 171 some line came back as `PLN 9 paper reams 68` and the code could not add it. Asked for the total directly, base was loud like that 45 times and silent the other 355.

This is not my idea. A paper from last month, PAL by Gao and others, does the same thing in general. The model writes a program and the interpreter runs it. The models built for `FinQA` and `TAT-QA`, 2 datasets of such questions about financial reports from 2021, also let code compute the result.

## Where I would put the line

For me the boundary is clearer now. If the number the model returns is printed in the document, I can at least check that it is there. It would not catch the line above, but it is something. If the number has to be calculated, Flan-T5 on these invoices almost never gets it right. It returns something with the right shape. A check that the answer is not a number from the document would catch 217 of the 399 wrong totals of large. The other 182 would still pass.

What I still do not have is a rule for the reading mistakes, the line above in long invoices and the totals over 1,000. They are rare and a parser takes them like any right answer.

## What I did not check

- Larger models. `text-davinci-003` from OpenAI has been available through the API for about 2 weeks. I wanted a model on my own machine for this run and did not try it. Bigger models may add 4 numbers correctly.
- Real invoices. These are synthetic, in English, one line per item. There are no scans and no OCR errors.
- Other prompts. I used 1 wording per question and greedy decoding. Few shot examples could change the numbers, mostly for base.
