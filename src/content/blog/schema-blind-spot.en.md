---
title: "I forced GPT-2 to follow my JSON schema and USD 11,113.79 came out as 11"
description: "GPT-2 large pulls 5 invoice fields from 150 emails into JSON. Free generation passes the schema in 74 cases. Decoding by the schema passes in all 150 and gets fewer emails fully right: every loud failure became a silent one, USD 11,113.79 became 11, and a missing invoice number was filled with the order number in 51 of 53 emails."
date: 2022-04-23
lang: en
translationKey: schema-blind-spot
tags: ["llm", "types", "reliability"]
---
I wanted a language model to read invoice emails and give me 5 fields as JSON, from the sender to the due date. With GPT-2 large and 3 examples in the prompt, about half of the answers did not pass the schema. The fix that looked obvious was to stop the model from writing anything the schema does not allow, the way PICARD does for SQL. My plan was simple: if the output passes `jsonschema`, it goes into the table. I had not measured what that plan actually lets through, so I measured it.

## The setup

I generated 150 short emails with a script, seed 2022, so every right answer is known. Some fields are missing on purpose. 53 emails have no invoice number but do have an order number. 51 have no due date but do have the date the invoice was issued. 40 do not say the currency. The amount comes in 4 shapes:

```
Amount to pay: USD 11,113.79.
Amount to pay: 1 951,01 USD.
Amount to pay: €15060.75.
Amount to pay: 16 128,82 EUR.
```

The schema has 5 required keys, the amount is a number, the currency is one of 3 codes (PLN, EUR or USD), the due date matches `^\d{4}-\d{2}-\d{2}$`. Invoice number, currency and due date may be null. My prompt says "Use null when a field is not in the text" and one of the 3 examples shows null in 3 fields.

I used GPT-2 large (774M parameters), on 4 CPU cores of a virtual machine, Python 3.9, torch 1.11, transformers 4.18, jsonschema 4.4, greedy decoding. transformers 4.18 loads the whole weights file into memory next to the model. My 5 GiB limit did not allow that, so I load the weights in shards. This changes nothing in the numbers, but it cost me 2 killed runs before I understood why.

I count an email as right only if all 5 fields are right. A missing field is right only as null.

## Free generation

Here the model writes the JSON itself, then `json.loads` and the schema check. 74 of 150 answers pass the schema. 12 of them have all 5 fields right.

58 of the 76 broken ones fail for one reason. The model copies the amount as it is printed, `"amount": 11,113.79` or `"amount": 1 951,01`. JSON stops at the comma or at the space. The other 18 write the due date as `"10.04.2022"`, which the pattern rejects. Both are loud failures, the parser stops and I know the email needs a look.

As for null, the instruction did almost nothing. In 150 answers the model wrote null once.

## Decoding by the schema

My second run uses the same model and the same prompt. Now my code writes the keys, the commas and the braces. The model only chooses the values. At every step I sort the tokens by the model's score. Then I take the first one after which the value is still a valid beginning of its type. A number may contain digits and one dot. A date may only grow towards the shape `2022-04-10`. For the currency only the 3 codes are left.

My first version ended a number only on a comma or on a closing brace. In the email the amount is followed by a space or a full stop, both were forbidden there, so the model kept adding digits until my limit of 40 tokens: `15060.750000100000000080000...` on every one of 32 emails in a test run with GPT-2 medium. JSON allows a space after a value, so a space now also ends a number. For a good while I thought this was the model. It was my grammar.

With the fixed decoder all 150 answers pass the schema. 11 of them have all 5 fields right, one less than without it.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Email 3: invoice for order no. 53407, amount USD 11,113.79, due by 10.04.2022, no invoice number. Free generation gave invoice_number &quot;53407&quot;, amount 11,113.79, which breaks the JSON, and due_date &quot;10.04.2022&quot;, which fails the pattern. Decoding by the schema gave invoice_number &quot;53407&quot;, amount 11 and due_date &quot;1034-04-20&quot;, and the answer passes the schema. Right: null, 11113.79, 2022-04-10.">
  <text x="12" y="18" class="f-label f-muted">one email, the same model, 2 ways to get JSON</text>
  <text x="12" y="42" class="f-mono f-ink" style="font-size:12px">please find attached the invoice for order no. 53407.</text>
  <text x="12" y="58" class="f-mono f-ink" style="font-size:12px">Issued: 11.03.2022.</text>
  <text x="12" y="74" class="f-mono f-ink" style="font-size:12px">Amount to pay: USD 11,113.79.</text>
  <text x="12" y="90" class="f-mono f-ink" style="font-size:12px">Payment due by 10.04.2022.</text>
  <text x="12" y="124" class="f-label f-muted">field</text>
  <text x="140" y="124" class="f-label f-muted">free</text>
  <text x="320" y="124" class="f-label f-muted">by the schema</text>
  <text x="490" y="124" class="f-label f-muted">right</text>
  <text x="12" y="152" class="f-mono f-muted" style="font-size:12px">invoice_number</text>
  <rect x="134" y="136" width="164" height="24" rx="3" class="f-box"/>
  <text x="140" y="152" class="f-mono f-accent" style="font-size:12px">53407</text>
  <rect x="314" y="136" width="150" height="24" rx="3" class="f-box"/>
  <text x="320" y="152" class="f-mono f-accent" style="font-size:12px">53407</text>
  <text x="490" y="152" class="f-mono f-ink" style="font-size:12px">null</text>
  <text x="12" y="192" class="f-mono f-muted" style="font-size:12px">amount</text>
  <rect x="134" y="176" width="164" height="34" rx="3" class="f-plain"/>
  <text x="140" y="192" class="f-mono f-ink" style="font-size:12px">11,113.79</text>
  <text x="140" y="205" class="f-mono f-muted" style="font-size:10px">JSON breaks here</text>
  <rect x="314" y="176" width="150" height="24" rx="3" class="f-box"/>
  <text x="320" y="192" class="f-mono f-accent" style="font-size:12px">11</text>
  <text x="490" y="192" class="f-mono f-ink" style="font-size:12px">11113.79</text>
  <text x="12" y="232" class="f-mono f-muted" style="font-size:12px">due_date</text>
  <rect x="134" y="216" width="164" height="34" rx="3" class="f-plain"/>
  <text x="140" y="232" class="f-mono f-ink" style="font-size:12px">10.04.2022</text>
  <text x="140" y="245" class="f-mono f-muted" style="font-size:10px">fails the pattern</text>
  <rect x="314" y="216" width="150" height="24" rx="3" class="f-box"/>
  <text x="320" y="232" class="f-mono f-accent" style="font-size:12px">1034-04-20</text>
  <text x="490" y="232" class="f-mono f-ink" style="font-size:12px">2022-04-10</text>
</svg>
<figcaption>Free generation fails loudly on 2 fields. The schema decoder passes with 3 wrong fields: the order number, the digits before the comma and a date in the year 1034.</figcaption>
</figure>

## Where the loud failures went

Every one of the 76 emails that failed loudly in free generation now passes and is wrong. Not one of them became right.

The amounts explain a big part of it. GPT-2 starts copying `11,113.79` exactly as before. After `11` the best token the grammar accepts starts with a comma. In JSON a comma ends the number, so the value is `11`. With `1 951,01` the space ends it and the value is `1`. 62 amounts are wrong. 56 of them are the digits before the first space or comma. 55 of these 56 emails had broken JSON in free generation. In the last one free generation wrote `668.29`, which is right. The decoder made it `668`.

Dates went the same way. 25 emails print the due date as `10.04.2022`. The model starts with `10` as in the email, the pattern needs 2 more digits before the dash and the answer is `1034-04-20`. None of these 25 dates is right. 21 of them are in years like 1034, 2603 and 0501, the other 4 are dates from the prompt examples. jsonschema has a `format: date` check, off by default. I turned it on and it rejected 4 answers of 150, the ones with month 17, 20, 24 or 26. `2603-04-16` is a real date, so it passes.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="Stacked bars, 150 emails each. GPT-2 large, free: 12 right, 76 fail the schema, 62 pass and are wrong. GPT-2 large, by the schema: 11 right, 0 fail the schema, 139 pass and are wrong. GPT-2 large, by the schema, null allowed: 10 right, 0 fail the schema, 140 pass and are wrong. GPT-2 medium, free: 1 right, 98 fail the schema, 51 pass and are wrong. GPT-2 medium, by the schema: 2 right, 1 fail the schema, 147 pass and are wrong. GPT-2 medium, by the schema, null allowed: 2 right, 1 fail the schema, 147 pass and are wrong.">
  <text x="12" y="18" class="f-label f-muted">150 emails, GPT-2 large and medium</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">all 5 fields right</text>
  <rect x="172" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="190" y="40" class="f-mono f-ink" style="font-size:11px">fails the schema</text>
  <rect x="318" y="31" width="12" height="10" class="f-accent"/>
  <text x="336" y="40" class="f-mono f-ink" style="font-size:11px">passes, wrong</text>
  <text x="12" y="68" class="f-mono f-accent" style="font-size:12px">GPT-2 large</text>
  <text x="28" y="86" class="f-mono f-ink" style="font-size:11px">free</text>
  <rect x="230" y="76" width="24" height="12" class="f-box"/>
  <rect x="254" y="76" width="152" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="406" y="76" width="124" height="12" class="f-accent"/>
  <text x="540" y="86" class="f-mono f-ink" style="font-size:11px">12/76/62</text>
  <text x="28" y="104" class="f-mono f-ink" style="font-size:11px">by the schema</text>
  <rect x="230" y="94" width="22" height="12" class="f-box"/>
  <rect x="252" y="94" width="278" height="12" class="f-accent"/>
  <text x="540" y="104" class="f-mono f-ink" style="font-size:11px">11/0/139</text>
  <text x="28" y="122" class="f-mono f-ink" style="font-size:11px">by the schema, null allowed</text>
  <rect x="230" y="112" width="20" height="12" class="f-box"/>
  <rect x="250" y="112" width="280" height="12" class="f-accent"/>
  <text x="540" y="122" class="f-mono f-ink" style="font-size:11px">10/0/140</text>
  <text x="12" y="146" class="f-mono f-accent" style="font-size:12px">GPT-2 medium</text>
  <text x="28" y="164" class="f-mono f-ink" style="font-size:11px">free</text>
  <rect x="230" y="154" width="2" height="12" class="f-box"/>
  <rect x="232" y="154" width="196" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="428" y="154" width="102" height="12" class="f-accent"/>
  <text x="540" y="164" class="f-mono f-ink" style="font-size:11px">1/98/51</text>
  <text x="28" y="182" class="f-mono f-ink" style="font-size:11px">by the schema</text>
  <rect x="230" y="172" width="4" height="12" class="f-box"/>
  <rect x="234" y="172" width="2" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="236" y="172" width="294" height="12" class="f-accent"/>
  <text x="540" y="182" class="f-mono f-ink" style="font-size:11px">2/1/147</text>
  <text x="28" y="200" class="f-mono f-ink" style="font-size:11px">by the schema, null allowed</text>
  <rect x="230" y="190" width="4" height="12" class="f-box"/>
  <rect x="234" y="190" width="2" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="236" y="190" width="294" height="12" class="f-accent"/>
  <text x="540" y="200" class="f-mono f-ink" style="font-size:11px">2/1/147</text>
</svg>
<figcaption>The decoder removes the middle part of the bar and adds it to the right part. For GPT-2 large the left part does not grow.</figcaption>
</figure>

## What goes into a field that is not there

Every key has to be there and this decoder never offers null, so a missing field gets filled with something. What it gets filled with is not random:

- invoice number: the order number in 51 of 53 emails, the order number with a prefix in the other 2;
- currency: EUR in all 40;
- due date: a date from the prompt examples in 17 of 51, the issue date in 14, a date not in 2022 in 15, some other date in 5.

Every one of those values passes the schema and most of them look right. An order number in the invoice number field is a number of 4 or 5 digits from the same email. My schema check would not have caught it.

<figure class="fig">
<svg viewBox="0 0 640 236" role="img" aria-label="Bars for 3 fields that are missing from the email. invoice number, 53: order number 51, order no. with prefix 2. currency, 40: EUR 40. due date, 51: date from the prompt 17, not in 2022 15, issue date 14, other date 5.">
  <text x="12" y="18" class="f-label f-muted">what the schema decoder put into fields missing from the email, GPT-2 large</text>
  <text x="12" y="60" class="f-mono f-ink" style="font-size:12px">invoice number, 53</text>
  <rect x="150" y="48" width="450" height="18" class="f-box"/>
  <text x="154" y="61" class="f-mono f-accent" style="font-size:11px">51</text>
  <text x="154" y="80" class="f-mono f-muted" style="font-size:10px">order number</text>
  <rect x="602" y="48" width="16" height="18" class="f-plain"/>
  <text x="606" y="61" class="f-mono f-accent" style="font-size:11px">2</text>
  <text x="618" y="90" class="f-mono f-muted" style="font-size:10px" text-anchor="end">order no. with prefix</text>
  <text x="12" y="126" class="f-mono f-ink" style="font-size:12px">currency, 40</text>
  <rect x="150" y="114" width="353" height="18" class="f-box"/>
  <text x="154" y="127" class="f-mono f-accent" style="font-size:11px">40</text>
  <text x="154" y="146" class="f-mono f-muted" style="font-size:10px">EUR</text>
  <text x="12" y="192" class="f-mono f-ink" style="font-size:12px">due date, 51</text>
  <rect x="150" y="180" width="149" height="18" class="f-box"/>
  <text x="154" y="193" class="f-mono f-accent" style="font-size:11px">17</text>
  <text x="154" y="212" class="f-mono f-muted" style="font-size:10px">date from the prompt</text>
  <rect x="301" y="180" width="131" height="18" class="f-plain"/>
  <text x="305" y="193" class="f-mono f-accent" style="font-size:11px">15</text>
  <text x="305" y="222" class="f-mono f-muted" style="font-size:10px">not in 2022</text>
  <rect x="434" y="180" width="122" height="18" class="f-box"/>
  <text x="438" y="193" class="f-mono f-accent" style="font-size:11px">14</text>
  <text x="438" y="212" class="f-mono f-muted" style="font-size:10px">issue date</text>
  <rect x="558" y="180" width="42" height="18" class="f-plain"/>
  <text x="562" y="193" class="f-mono f-accent" style="font-size:11px">5</text>
  <text x="562" y="222" class="f-mono f-muted" style="font-size:10px">other date</text>
</svg>
<figcaption>Every value here passes the schema. Most of them come from the same email or from the examples in the prompt.</figcaption>
</figure>

## Letting it say null

The third run is the same decoder, but the 3 fields that can be missing may also be null. The model chose null 9 times out of the 450 fields where it could. 4 of them were on fields that are really missing, out of 144. The other 5 were on fields that were in the email. All 5 fields right: 10 of 150, one less than without null.

## The smaller model

I ran the same 3 runs with GPT-2 medium (355M parameters). In free generation 52 of 150 answers pass the schema and 1 has all 5 fields right. Decoding by the schema passes 149. The last one is mine: its invoice number went `KOW-S-S-S-...` until my limit of 40 tokens. 2 emails are right. Of its 98 loud failures, 95 became silent and 2 became right, so for this model the decoder did help, by 1 email. With null allowed, it never chose null and gave the same 150 answers as without it. Its missing invoice numbers are mostly the order number with letters from the sender's name in front, like `ORZ-34592`, in 36 of 53.

## What I take from it

Before this, the schema check was for me the last step before the table. It checks the shape of the value. Where the value came from, it does not know. With GPT-2 large the decoder made it worse: it took the cases where the parser stopped and I would have looked and turned them into rows that look fine.

For this task I would rather keep free generation with its loud failures and then check every value against the email itself, but I have not measured such a check yet.

## What I did not check

- Bigger models. GPT-2 large is small for this. I do not know how the 76 would split with GPT-3, which I did not call.
- Beam search, sampling or a prompt without examples.
- A grammar that allows a comma inside a number and fixes it later. It would rescue `11,113.79` and would still not rescue the order number.
- The cost. Decoding by the schema was not slower here, 16 seconds per email on average against 19 for free generation, but these are times of one run on a shared machine.
- Real invoices. These are 150 generated emails from one template, with 4 amount formats and 3 date formats.
