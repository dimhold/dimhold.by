---
title: "Flan-T5 answered 2,000 calls with 200 OK and got 161 of 600 amounts wrong"
description: "I put Flan-T5 behind a small HTTP server and asked it for the amount in 600 synthetic payment documents. All 2,000 calls returned 200 OK and every answer parsed, yet base got 161 amounts wrong and large 35. Base dropped the decimal comma token and made amounts 100 times larger, both models answered with another amount from the same document. Which cheap checks catch which error, and the 10 that none of them catch."
date: 2022-12-16
lang: en
translationKey: silent-200-ok
tags: ["llm", "reliability", "numbers"]
---
2 weeks after ChatGPT came out, the first use I wanted to try was taking the amount out of a payment document. I wanted to see what a failure looks like inside a pipeline, because nobody reads the answers there and only the checks see them. ChatGPT has no API yet and I cannot see its tokens. So I took Flan-T5, a model from Google that I can run on my own machine.

The setup is boring on purpose. A small HTTP server wraps the model and answers with a `generated_text` field, like the Hugging Face Inference API. It returns 500 only if Python throws. My client sends the document and a question, plus the line "Answer with the amount only" at the end. Then it checks what I would check for any internal service: status is 200, the body is JSON, the answer parses as an amount. I wrote these 3 checks first without thinking. Only later I understood that a wrong number passes all 3.

Versions, because the numbers depend on them: Python 3.9, torch 1.13.1 on CPU, transformers 4.25.1, greedy decoding. Flan-T5 base has 250M parameters and large has 780M, both with the weights published on 21 October. The documents are 600 synthetic ones from a script with a fixed seed, so I know every right answer. There are 6 kinds with 100 of each. These are an invoice, an invoice with an unpaid previous balance, a transfer confirmation, a receipt, a refund email and a payment reminder. Half of the documents write numbers as `PLN 1,284.50` and half the European way, `1 284,50 PLN`.

## The dashboard

Base made 2,000 calls. Each document got the main question and the same question in other words. 4 kinds of documents also got 2 questions about other fields, which I need for a check later. All 2,000 calls came back 200 and every answer parsed. A Grafana panel for this service would show 0 errors.

161 of the 600 amounts were wrong.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Bars for Flan-T5 base and large. Status 200: 2,000 of 2,000 calls for both. Body is JSON: all calls. Amount parses: 600 of 600 documents. Amount is right: 439 of 600 for base, 565 of 600 for large.">
  <text x="12" y="18" class="f-label f-muted">what the client checked, and what was true</text>
  <text x="12" y="44" class="f-mono f-accent" style="font-size:12px">flan-t5-base</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:11px">status 200</text>
  <rect x="196" y="56" width="330" height="14" class="f-box"/>
  <text x="536" y="67" class="f-mono f-ink" style="font-size:11px">2,000/2,000</text>
  <text x="12" y="90" class="f-mono f-ink" style="font-size:11px">body is JSON</text>
  <rect x="196" y="80" width="330" height="14" class="f-box"/>
  <text x="536" y="91" class="f-mono f-ink" style="font-size:11px">2,000/2,000</text>
  <text x="12" y="114" class="f-mono f-ink" style="font-size:11px">amount parses</text>
  <rect x="196" y="104" width="330" height="14" class="f-box"/>
  <text x="536" y="115" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="138" class="f-mono f-ink" style="font-size:11px">amount is right</text>
  <rect x="196" y="128" width="241" height="14" class="f-box"/>
  <rect x="437" y="128" width="89" height="14" class="f-accent"/>
  <text x="536" y="139" class="f-mono f-ink" style="font-size:11px">439/600</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">flan-t5-large</text>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">status 200</text>
  <rect x="196" y="178" width="330" height="14" class="f-box"/>
  <text x="536" y="189" class="f-mono f-ink" style="font-size:11px">2,000/2,000</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">body is JSON</text>
  <rect x="196" y="202" width="330" height="14" class="f-box"/>
  <text x="536" y="213" class="f-mono f-ink" style="font-size:11px">2,000/2,000</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">amount parses</text>
  <rect x="196" y="226" width="330" height="14" class="f-box"/>
  <text x="536" y="237" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="260" class="f-mono f-ink" style="font-size:11px">amount is right</text>
  <rect x="196" y="250" width="311" height="14" class="f-box"/>
  <rect x="507" y="250" width="19" height="14" class="f-accent"/>
  <text x="536" y="261" class="f-mono f-ink" style="font-size:11px">565/600</text>
  <rect x="196" y="284" width="14" height="14" class="f-box"/>
  <text x="216" y="295" class="f-label f-muted">passed</text>
  <rect x="326" y="284" width="14" height="14" class="f-accent"/>
  <text x="346" y="295" class="f-label f-muted">wrong</text>
</svg>
<figcaption>Every check the client had passed on every call. Wrong amounts: 161 for base, 35 for large.</figcaption>
</figure>

The first wrong answer I opened was a receipt with `TOTAL 437,78 EUR` and the model answered `43778 EUR`. My first idea was that my parser had eaten the comma, then that the tokenizer drops it on decode. I checked both before I believed it was the model. The tokenizer splits the input as `▁4`, `37`, `,`, `78`, `▁EUR` and the model generated `▁4`, `37`, `78`, `▁EUR`. The comma was its second choice at that step, with a probability of 0.12 against 0.79 for `78`. So the amount becomes 100 times larger. This happened 52 times on the right number and 10 more times on another number from the document. All 52 are in the format with the decimal comma.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="Tokens of the receipt line: 4, 37, comma, 78, EUR. The answer of base: 4, 37, 78, EUR, without the comma, so 437.78 becomes 43778. Below, wrong amounts by kind, base and large: another amount from the document 68 and 28, copied text, a count or an id 27 and 0, decimal separator lost 62 and 5, other 4 and 2.">
  <text x="12" y="18" class="f-label f-muted">input, receipt line TOTAL</text>
  <rect x="12" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="32.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁TO</text>
  <rect x="61" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="81.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">TAL</text>
  <rect x="110" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="126" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="150" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="166" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="190" y="26" width="23" height="26" rx="3" class="f-accent"/>
  <text x="201.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">,</text>
  <rect x="221" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="237" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="261" y="26" width="50" height="26" rx="3" class="f-box"/>
  <text x="286" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="327" y="44" class="f-mono f-muted" style="font-size:13px">437,78</text>
  <text x="12" y="78" class="f-label f-muted">base answered</text>
  <rect x="12" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="28" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="52" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="68" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="92" y="86" width="34" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <rect x="134" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="150" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="174" y="86" width="50" height="26" rx="3" class="f-box"/>
  <text x="199" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="240" y="104" class="f-mono f-accent" style="font-size:13px">43778</text>
  <text x="12" y="150" class="f-label f-muted">wrong amounts by kind</text>
  <text x="420" y="150" class="f-label f-muted" text-anchor="end">base</text>
  <text x="560" y="150" class="f-label f-muted" text-anchor="end">large</text>
  <text x="12" y="178" class="f-mono f-ink" style="font-size:11px">another amount from the document</text>
  <text x="420" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">68</text>
  <text x="560" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">28</text>
  <line x1="12" y1="186" x2="570" y2="186" class="f-plain"/>
  <text x="12" y="204" class="f-mono f-ink" style="font-size:11px">copied text, a count or an id</text>
  <text x="420" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">27</text>
  <text x="560" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">0</text>
  <line x1="12" y1="212" x2="570" y2="212" class="f-plain"/>
  <text x="12" y="230" class="f-mono f-ink" style="font-size:11px">decimal separator lost, 100 times more</text>
  <text x="420" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">62</text>
  <text x="560" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">5</text>
  <line x1="12" y1="238" x2="570" y2="238" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:11px">other</text>
  <text x="420" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">4</text>
  <text x="560" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">2</text>
  <line x1="12" y1="270" x2="570" y2="270" class="f-line"/>
  <text x="420" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">161</text>
  <text x="560" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">35</text>
</svg>
<figcaption>Flan-T5 base skips the comma token. All 52 answers with the right digits 100 times too large come from documents written as 1 284,50.</figcaption>
</figure>

The bigger class is harder to see. 68 wrong answers are another amount from the document, written as a normal amount, just not the one I asked for. The reminder reads "Invoice 52081 dated 2022-05-02 for PLN 2,501.80 is overdue. We received PLN 500.36 from you on 2022-09-21. The remaining PLN 2,001.44 is due…" Base answered with the original invoice amount in 73 of 100 reminders, 10 of them with the comma lost as well. 1 more reminder was wrong in another way. I thought it simply takes the first amount. But in the invoice with a previous balance the amount to pay is the last line. Base got that one right 87 times of 100. So I do not know what decides it. 27 are text copied from the document, mostly receipt lines, where my parser took the first number. The last 4 have digits mangled in some other way.

## The checks I could add without labels

Before the run I wrote down what I expected, so I could not adjust it later. I expected the check "is this amount in the document" to catch less than half of the wrong answers. I expected asking the question twice in different words to catch more. Neither idea is mine. Wang et al. used agreement between answers in March and in July Kadavath et al. studied how well a model knows when it is right.

My first document check had a bug in the definition. It matched any run of digits, so an item count from a receipt line passed and the check caught 66 of 161. When I made it match only amounts with 2 decimals, it caught 91, more than half, so for base my expectation did not hold. It cannot raise a false alarm, since a right answer is always in the document. A strict format check wants a single number with groups of 3 digits and exactly 2 decimals. It catches almost the same answers, 91 of 161, with 2 false alarms on 439 right ones.

Asking twice did worse than I expected. It caught 53 wrong answers and flagged 105 of the 439 right ones. Base often gives 2 different answers and one of them is right. The model's own confidence did better, but not enough to use alone. I took the mean log probability of the answer tokens and flagged the 20% least confident answers. That caught 67 wrong ones and 53 right ones. The AUROC is 0.76, so a random wrong answer is less confident than a random right one about 3 times in 4.

Arithmetic looked like the winner at first. In 4 kinds of documents the fields add up: subtotal plus VAT is the total, the invoice total plus the old balance is the amount to pay, the refund plus the fee is the original charge, paid plus remaining is the invoice amount. I ask the model for the other 2 fields and add them up. Where it applies, this caught 103 of 103 wrong amounts and flagged 130 of 297 right ones. Then I looked at the invoices. Asked for the VAT, base never once gave the right number and returned the subtotal 67 times, so on invoices the check flags everything. Without invoices it caught 87 of 87 wrong amounts, with 46 false alarms on 213 right ones.

<figure class="fig">
<svg viewBox="0 0 640 220" role="img" aria-label="Table of checks. Amount is in the document: base 91 of 161 with 0 false alarms, large 7 of 35 with 0. Strict format: 91 and 8. Same answer to a paraphrase: 53 with 105 false alarms, 7 with 41. Least confident 20%: 67 with 53, 14 with 106. Arithmetic: 103 with 130, 21 with 8. All three together: 159 and 25.">
  <text x="12" y="18" class="f-label f-muted">wrong amounts caught, false alarms on right ones</text>
  <text x="12" y="42" class="f-label f-muted">check</text>
  <text x="340" y="42" class="f-label f-muted" text-anchor="end">base: caught</text>
  <text x="398" y="42" class="f-label f-muted" text-anchor="end">false</text>
  <text x="540" y="42" class="f-label f-muted" text-anchor="end">large: caught</text>
  <text x="600" y="42" class="f-label f-muted" text-anchor="end">false</text>
  <text x="12" y="69" class="f-mono f-ink" style="font-size:11px">amount is in the document</text>
  <rect x="214" y="60" width="70" height="12" class="f-plain"/>
  <rect x="214" y="60" width="40" height="12" class="f-box"/>
  <text x="340" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <rect x="414" y="60" width="70" height="12" class="f-plain"/>
  <rect x="414" y="60" width="14" height="12" class="f-box"/>
  <text x="540" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <text x="12" y="95" class="f-mono f-ink" style="font-size:11px">strict amount format</text>
  <rect x="214" y="86" width="70" height="12" class="f-plain"/>
  <rect x="214" y="86" width="40" height="12" class="f-box"/>
  <text x="340" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">2</text>
  <rect x="414" y="86" width="70" height="12" class="f-plain"/>
  <rect x="414" y="86" width="16" height="12" class="f-box"/>
  <text x="540" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">8/35</text>
  <text x="600" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">1</text>
  <text x="12" y="121" class="f-mono f-ink" style="font-size:11px">same answer to a paraphrase</text>
  <rect x="214" y="112" width="70" height="12" class="f-plain"/>
  <rect x="214" y="112" width="23" height="12" class="f-box"/>
  <text x="340" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">53/161</text>
  <text x="398" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">105</text>
  <rect x="414" y="112" width="70" height="12" class="f-plain"/>
  <rect x="414" y="112" width="14" height="12" class="f-box"/>
  <text x="540" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">41</text>
  <text x="12" y="147" class="f-mono f-ink" style="font-size:11px">least confident 20%</text>
  <rect x="214" y="138" width="70" height="12" class="f-plain"/>
  <rect x="214" y="138" width="29" height="12" class="f-box"/>
  <text x="340" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">67/161</text>
  <text x="398" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">53</text>
  <rect x="414" y="138" width="70" height="12" class="f-plain"/>
  <rect x="414" y="138" width="28" height="12" class="f-box"/>
  <text x="540" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">14/35</text>
  <text x="600" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">106</text>
  <text x="12" y="173" class="f-mono f-ink" style="font-size:11px">arithmetic of the document</text>
  <rect x="214" y="164" width="70" height="12" class="f-plain"/>
  <rect x="214" y="164" width="45" height="12" class="f-box"/>
  <text x="340" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">103/161</text>
  <text x="398" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="164" width="70" height="12" class="f-plain"/>
  <rect x="414" y="164" width="42" height="12" class="f-box"/>
  <text x="540" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">21/35</text>
  <text x="600" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">8</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-line"/>
  <text x="12" y="199" class="f-mono f-ink" style="font-size:11px">format + document + arithmetic</text>
  <rect x="214" y="190" width="70" height="12" class="f-plain"/>
  <rect x="214" y="190" width="69" height="12" class="f-box"/>
  <text x="340" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">159/161</text>
  <text x="398" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="190" width="70" height="12" class="f-plain"/>
  <rect x="414" y="190" width="50" height="12" class="f-box"/>
  <text x="540" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">25/35</text>
  <text x="600" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">9</text>
</svg>
<figcaption>Out of 161 wrong and 439 right answers for base, 35 and 565 for large. Arithmetic exists in 4 of 6 kinds of documents.</figcaption>
</figure>

## The bigger model

Large was much better, but 3 times slower. On 4 cores of a virtual machine with an AMD EPYC 7713 it takes 1.6 seconds per call against 0.5. It got 35 of 600 wrong, again all with 200 OK and all parsed. I expected fewer errors, but not that the cheap checks would mostly stop working. The document check caught 7 of 35 and the strict format 8. Asking twice caught 7 too, with 41 false alarms. The least confident 20% caught 14 with 106. 28 of the 35 wrong answers are other amounts from the document, so they look exactly like right answers.

Arithmetic still works where it applies: 21 of 21, with 8 false alarms in 379, because large got 791 of the 800 field answers right. Together with arithmetic, the document check and the strict format catch 25 of 35.

The other 10 are all the same mistake and base never made it. In the transfer confirmation large answered with "Balance after transfer" instead of the amount. It did so 11 times and the strict check rejected only 1 of them. Base had 5 errors on transfers too, but those were lost commas and mangled digits, which the checks see. My transfer template has no balance before the transfer, so no sum ties the amount to the other numbers. Asking twice flagged 5 of the 10 and the confidence 2. For the rest I would need a second source, like the bank's own record of the transaction.

## What I did not check

- ChatGPT and `text-davinci-003`. I measured 2 small open models only and I do not know if a much larger model loses commas. I guess it does not, but a right number from the wrong line is the error I would expect to stay.
- Real documents. My 6 templates are short and clean, so the rate per template describes my templates. Base getting 74 of 100 reminders wrong probably says more about how I wrote the reminder than about the model.
- Prompts. One wording of the instruction and one paraphrase of each question. Another instruction could change the reminder result a lot.
- Repeats. Greedy decoding only. Every number here is from one run. I reran 2 documents outside the server and got the same tokens, but I did not repeat the whole run.
