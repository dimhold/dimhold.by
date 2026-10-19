---
title: "A model behind my bank statement regexes turned 300 loud failures into 249 silent ones"
description: "I wrote regexes for 2 bank statement layouts and gave the same 600 transactions in 4 layouts to Flan-T5 base and large. The regex failed loudly on the 2 layouts it never saw. The model got the date wrong more often than the amount, answered with the first day of the period and the balance, and almost never in a way that raised an error. Regex first and model in the gap gave more right answers and 249 silent wrong ones."
date: 2022-12-15
lang: en
translationKey: statement-model-vs-regex
tags: ["llm", "reliability", "text"]
---
Since ChatGPT came out 2 weeks ago, my feed is full of screenshots where someone pastes a document into it and gets the fields back. A bank statement is the classic case for this. Every bank exports it in its own way. The usual answer is a parser with a regex for each bank, which breaks the day the bank changes the export. I have never measured how a model compares with such a parser. I assumed that a model would at least copy a date correctly. So the question for me was only how often it gets the amount wrong.

## The setup

I took 4 statement layouts and generated 150 transactions in each with a script, seed 2022, so every right answer is known. Every transaction should become 3 fields: the date, the amount with a sign (money out is negative) and the counterparty. The layouts look like this:

```
A  14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37
B  Date: 2022-06-20  Description: Transfer to Piotr Wisniewski, title: gift  Amount: -2,327.19 PLN  Balance: -5,575.15 PLN
C  12 Jun 2022  CARD PAYMENT BOOKING.COM 33.40 EUR  157.32 DR  25,180.67 CR
D  15/06/2022  Card payment                4.55                 53,361.89
               AUCHAN 5293 GDANSK
```

The last number in each line is the balance after the transaction. Card payments abroad also carry the amount in the original currency. I wrote the regex parser for A and B only, 34 lines of Python, before I looked at C and D. C and D play the bank that changed its export.

The model is Flan-T5 from Google, base (250M parameters) and large (780M), released in October. It runs on my machine, 4 cores of an AMD EPYC virtual machine, Python 3.9, torch 1.13, transformers 4.25.1, greedy decoding. Each transaction gets 4 questions: the date, the amount, the direction of the money and who the other party is. The prompt also has the line of the statement with the first and the last day of the period. A real page has it and it tells which date format the bank uses. Both methods get the transactions already cut into blocks, so splitting the page is not measured here.

I count a transaction as right only if all 3 fields are right. A wrong result is loud when it does not parse. That means the regex did not match or the model gave a date that is not a date. It is silent when it parses and is wrong.

## The regexes

On A and B the parser got 293 of 300 transactions right. The 7 wrong ones were mine. In layout A the name and the transfer title run together in capitals: `TRANSFER FROM JAN KOWALSKI LOAN BACK`. I took the first 2 words as the name. For the salary from `SOFTHOUSE SP. Z O.O.` this gives `SOFTHOUSE SP.`, without any error. I wrote that rule without thinking about companies.

On C and D the parser matched nothing, 300 of 300 loud. This was what I expected. It is also the usual argument for the model.

## The model

Flan-T5 large got 91 of 600 transactions right. Base got 107, so the larger model was not better.

<figure class="fig">
<svg viewBox="0 0 640 352" role="img" aria-label="Stacked bars, 150 transactions per layout. Regex for A and B, layout A: 143 right, 0 loud, 7 silent. Regex for A and B, layout B: 150 right, 0 loud, 0 silent. Regex for A and B, layout C: 0 right, 150 loud, 0 silent. Regex for A and B, layout D: 0 right, 150 loud, 0 silent. Flan-T5 base, layout A: 1 right, 64 loud, 85 silent. Flan-T5 base, layout B: 74 right, 0 loud, 76 silent. Flan-T5 base, layout C: 25 right, 23 loud, 102 silent. Flan-T5 base, layout D: 7 right, 1 loud, 142 silent. Flan-T5 large, layout A: 2 right, 23 loud, 125 silent. Flan-T5 large, layout B: 47 right, 0 loud, 103 silent. Flan-T5 large, layout C: 15 right, 9 loud, 126 silent. Flan-T5 large, layout D: 27 right, 0 loud, 123 silent.">
  <text x="12" y="18" class="f-label f-muted">transactions per layout, 150 each</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">right</text>
  <rect x="77" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="95" y="40" class="f-mono f-ink" style="font-size:11px">wrong, loud</text>
  <rect x="184" y="31" width="12" height="10" class="f-accent"/>
  <text x="202" y="40" class="f-mono f-ink" style="font-size:11px">wrong, silent</text>
  <text x="12" y="68" class="f-mono f-accent" style="font-size:12px">regex for A and B</text>
  <text x="28" y="86" class="f-mono f-ink" style="font-size:11px">A  known</text>
  <rect x="210" y="76" width="286" height="12" class="f-box"/>
  <rect x="496" y="76" width="14" height="12" class="f-accent"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">143/0/7</text>
  <text x="28" y="104" class="f-mono f-ink" style="font-size:11px">B  known</text>
  <rect x="210" y="94" width="300" height="12" class="f-box"/>
  <text x="520" y="104" class="f-mono f-ink" style="font-size:11px">150/0/0</text>
  <text x="28" y="122" class="f-mono f-ink" style="font-size:11px">C  new</text>
  <rect x="210" y="112" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="122" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="28" y="140" class="f-mono f-ink" style="font-size:11px">D  new</text>
  <rect x="210" y="130" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="140" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">Flan-T5 base</text>
  <text x="28" y="184" class="f-mono f-ink" style="font-size:11px">A  known</text>
  <rect x="210" y="174" width="2" height="12" class="f-box"/>
  <rect x="212" y="174" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="340" y="174" width="170" height="12" class="f-accent"/>
  <text x="520" y="184" class="f-mono f-ink" style="font-size:11px">1/64/85</text>
  <text x="28" y="202" class="f-mono f-ink" style="font-size:11px">B  known</text>
  <rect x="210" y="192" width="148" height="12" class="f-box"/>
  <rect x="358" y="192" width="152" height="12" class="f-accent"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">74/0/76</text>
  <text x="28" y="220" class="f-mono f-ink" style="font-size:11px">C  new</text>
  <rect x="210" y="210" width="50" height="12" class="f-box"/>
  <rect x="260" y="210" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="306" y="210" width="204" height="12" class="f-accent"/>
  <text x="520" y="220" class="f-mono f-ink" style="font-size:11px">25/23/102</text>
  <text x="28" y="238" class="f-mono f-ink" style="font-size:11px">D  new</text>
  <rect x="210" y="228" width="14" height="12" class="f-box"/>
  <rect x="224" y="228" width="2" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="226" y="228" width="284" height="12" class="f-accent"/>
  <text x="520" y="238" class="f-mono f-ink" style="font-size:11px">7/1/142</text>
  <text x="12" y="264" class="f-mono f-accent" style="font-size:12px">Flan-T5 large</text>
  <text x="28" y="282" class="f-mono f-ink" style="font-size:11px">A  known</text>
  <rect x="210" y="272" width="4" height="12" class="f-box"/>
  <rect x="214" y="272" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="260" y="272" width="250" height="12" class="f-accent"/>
  <text x="520" y="282" class="f-mono f-ink" style="font-size:11px">2/23/125</text>
  <text x="28" y="300" class="f-mono f-ink" style="font-size:11px">B  known</text>
  <rect x="210" y="290" width="94" height="12" class="f-box"/>
  <rect x="304" y="290" width="206" height="12" class="f-accent"/>
  <text x="520" y="300" class="f-mono f-ink" style="font-size:11px">47/0/103</text>
  <text x="28" y="318" class="f-mono f-ink" style="font-size:11px">C  new</text>
  <rect x="210" y="308" width="30" height="12" class="f-box"/>
  <rect x="240" y="308" width="18" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="308" width="252" height="12" class="f-accent"/>
  <text x="520" y="318" class="f-mono f-ink" style="font-size:11px">15/9/126</text>
  <text x="28" y="336" class="f-mono f-ink" style="font-size:11px">D  new</text>
  <rect x="210" y="326" width="54" height="12" class="f-box"/>
  <rect x="264" y="326" width="246" height="12" class="f-accent"/>
  <text x="520" y="336" class="f-mono f-ink" style="font-size:11px">27/0/123</text>
</svg>
<figcaption>Right on all 3 fields, of 600: regex 293, base 107, large 91. The regex never saw C and D.</figcaption>
</figure>

I expected mistakes in the amount, but the first thing that broke was the date. I spent some time thinking my date parser was broken before I looked at the raw answers. With the period line in the prompt, large answered with the first day of the period in 360 of 600 transactions. For a payment made on 14 June it gave `01.06.2022`. So I removed the period line and asked again. Large got the date right in 291 of 600 and base in 567. Often the answer of large is not the date from the line: `01.10.2022` for 10.01.2022, `01/26/2022` in the American order for 26/01/2022. Sometimes the year was 2020. It got 148 of 150 right only in layout B, where the date was already written as `2022-06-20`. When I asked it to copy the date exactly as written, it did so in 162 of 600. 143 of them were in B.

Large answered "out" for every incoming transfer except in layout D, where the line says `Incoming transfer` in words. It answered "in" for 33 of 129 incoming transfers, all 33 in D. Large still answered "out" on lines without a minus and on lines with `CR`. I thought the order of the options in my question was to blame. So I asked again with "in or out" instead of "out or in". Large did not change a single answer. Base did depend on the order. It answered "out" in all 600 when "out" came first and "in" in 583 of 600 when "in" came first.

The amount without the sign was right in 423 of 600. In 114 of the wrong ones the model returned the balance, the last number in the line. In 22 it returned the amount in euros or dollars from the description. As a counterparty large often returned more than the name, like `SPOTIFY INTERNET`. 61 times it returned only the city. If I accept any answer that contains the right name, it gets 526 of 600. With that lenient match large would get 160 transactions right instead of 91.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Transaction 80 of layout A with the period line above it. Flan-T5 large answered the date 01.06.2022, the first day of the period, instead of 14.06.2022; the amount 18 848,37, the balance, instead of -248,22; the direction out, which is right; the counterparty GDANSK, the city, instead of Media Expert. Over 600 transactions: first day of the period 360 times, balance 114, city 61, incoming transfers answered out 96 of 129.">
  <text x="12" y="18" class="f-label f-muted">period line</text>
  <text x="12" y="36" class="f-mono f-ink" style="font-size:12px">Statement for the period 01.06.2022 - 30.06.2022</text>
  <text x="12" y="62" class="f-label f-muted">transaction, layout A</text>
  <text x="12" y="80" class="f-mono f-ink" style="font-size:12px;white-space:pre" xml:space="preserve">14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37</text>
  <text x="140" y="108" class="f-label f-muted">large answered</text>
  <text x="290" y="108" class="f-label f-muted">right</text>
  <text x="12" y="134" class="f-mono f-muted" style="font-size:12px">date</text>
  <rect x="134" y="120" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="135" class="f-mono f-accent" style="font-size:12px">01.06.2022</text>
  <text x="290" y="135" class="f-mono f-ink" style="font-size:12px">14.06.2022</text>
  <text x="420" y="129" class="f-mono f-ink" style="font-size:10px">first day of the period</text>
  <text x="420" y="142" class="f-mono f-muted" style="font-size:10px">360 of 600</text>
  <line x1="12" y1="148" x2="628" y2="148" class="f-plain"/>
  <text x="12" y="168" class="f-mono f-muted" style="font-size:12px">amount</text>
  <rect x="134" y="154" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="169" class="f-mono f-accent" style="font-size:12px">18 848,37</text>
  <text x="290" y="169" class="f-mono f-ink" style="font-size:12px">-248,22</text>
  <text x="420" y="163" class="f-mono f-ink" style="font-size:10px">balance after it</text>
  <text x="420" y="176" class="f-mono f-muted" style="font-size:10px">114 of 600</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-plain"/>
  <text x="12" y="202" class="f-mono f-muted" style="font-size:12px">direction</text>
  <rect x="134" y="188" width="140" height="22" rx="3" class="f-plain"/>
  <text x="140" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="290" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="420" y="197" class="f-mono f-ink" style="font-size:10px">right</text>
  <text x="420" y="210" class="f-mono f-muted" style="font-size:10px">incoming: 96 of 129 out</text>
  <line x1="12" y1="216" x2="628" y2="216" class="f-plain"/>
  <text x="12" y="236" class="f-mono f-muted" style="font-size:12px">counterparty</text>
  <rect x="134" y="222" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="237" class="f-mono f-accent" style="font-size:12px">GDANSK</text>
  <text x="290" y="237" class="f-mono f-ink" style="font-size:12px">Media Expert</text>
  <text x="420" y="231" class="f-mono f-ink" style="font-size:10px">city</text>
  <text x="420" y="244" class="f-mono f-muted" style="font-size:10px">61 of 600</text>
</svg>
<figcaption>One line, 3 wrong fields, each of them parses. The right column counts the same mistake over all 600 transactions.</figcaption>
</figure>

Almost all of this is silent, because a balance parses as an amount just as well as the amount does. Of 509 wrong transactions of large, 32 were loud.

## Regex first, model when it does not match

This is the setup I would actually build: the parser for the formats I know and the model only for lines it does not recognise. It got 335 of 600 right, more than each of the 2 alone. But 256 transactions came out wrong without any error. Apart from my 7 salary lines, all of them came from C and D, the 300 lines that had failed loudly before.

<figure class="fig">
<svg viewBox="0 0 640 180" role="img" aria-label="Stacked bars over 600 transactions. Regex for A and B: right 293, wrong, loud 300, wrong, silent 7. Flan-T5 large: right 91, wrong, loud 32, wrong, silent 477. Regex, else large: right 335, wrong, loud 9, wrong, silent 256. Regex for all 4: right 582, wrong, loud 0, wrong, silent 18.">
  <text x="12" y="18" class="f-label f-muted">600 transactions, all 4 layouts</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">right</text>
  <rect x="77" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="95" y="40" class="f-mono f-ink" style="font-size:11px">wrong, loud</text>
  <rect x="184" y="31" width="12" height="10" class="f-accent"/>
  <text x="202" y="40" class="f-mono f-ink" style="font-size:11px">wrong, silent</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:11px">regex for A and B</text>
  <rect x="190" y="59" width="161" height="14" class="f-box"/>
  <rect x="351" y="59" width="165" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="516" y="59" width="4" height="14" class="f-accent"/>
  <text x="530" y="70" class="f-mono f-ink" style="font-size:11px">293/300/7</text>
  <text x="12" y="100" class="f-mono f-ink" style="font-size:11px">Flan-T5 large</text>
  <rect x="190" y="89" width="50" height="14" class="f-box"/>
  <rect x="240" y="89" width="18" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="89" width="262" height="14" class="f-accent"/>
  <text x="530" y="100" class="f-mono f-ink" style="font-size:11px">91/32/477</text>
  <text x="12" y="130" class="f-mono f-ink" style="font-size:11px">regex, else large</text>
  <rect x="190" y="119" width="184" height="14" class="f-box"/>
  <rect x="374" y="119" width="5" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="379" y="119" width="141" height="14" class="f-accent"/>
  <text x="530" y="130" class="f-mono f-ink" style="font-size:11px">335/9/256</text>
  <text x="12" y="160" class="f-mono f-ink" style="font-size:11px">regex for all 4</text>
  <rect x="190" y="149" width="320" height="14" class="f-box"/>
  <rect x="510" y="149" width="10" height="14" class="f-accent"/>
  <text x="530" y="160" class="f-mono f-ink" style="font-size:11px">582/0/18</text>
</svg>
<figcaption>The model in the gap adds 42 right transactions. Its wrong answers in C and D raise no error. 29 more lines of regex leave 18 wrong, all of them the same salary bug.</figcaption>
</figure>

Then I did what I would do anyway when a bank changes its export: I wrote the regexes for C and D. That took 29 more lines. The parser got 582 of 600 right and 0 loud. The 18 wrong are the same salary bug, which I copied into layout C together with the rest of the code. It costs about 6 microseconds per transaction. Large needs a median of 1.2 seconds per question, about 5 seconds per transaction.

## What I did not check

This is one small model that I can run myself. It is not the GPT-3 behind the OpenAI API and not ChatGPT, which has no API yet. Nothing larger was tested. I used one prompt per field without examples and did not train anything. Making the model output all fields at once in JSON is also something I did not try. The statements are synthetic and clean text, without PDF and OCR.

For now I keep the regex per bank. The model I would use only to suggest a parse for a line the parser does not know. A person checks it before it goes anywhere.
