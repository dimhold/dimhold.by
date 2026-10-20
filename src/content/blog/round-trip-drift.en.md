---
title: "The tenant came back as the lessor after a round trip through Russian"
description: "I ran 600 English sentences through MarianMT to Russian and back, 5 times. Numbers came back 100 of 100. All 21 tenants came back as lessors and still passed my negation check. A correct Russian translation of a fee that is not refundable came back as not payable. In 16 sentences the Russian made 1 person look like 2, and the English that came back looked fine."
date: 2022-12-13
lang: en
translationKey: round-trip-drift
tags: ["machine-learning", "text", "reliability"]
---
There is an old check for machine translation. You translate the text, then translate the result back. If the original comes back, you trust the middle. I believed in this check and I never counted what it misses. To count that, I need a pair where I can read the middle step myself and say if it is right. For me this pair is English to Russian and back to English.

The doubt is not new. Harold Somers wrote in 2005 that round trip translation is a weak way to judge a translation system. A bad middle step can come back looking fine. I wanted to see it on my own sentences, with several kinds of meaning at once and with the middle step checked separately.

## The setup

The models are `opus-mt-en-ru` and `opus-mt-ru-en` from `Helsinki-NLP`, MarianMT, the revisions from September 2022 with their own config, which means beam search with 4 beams. Python 3.9, torch 1.13, transformers 4.25.1, CPU only, 4 cores of an AMD EPYC virtual machine. One round of 600 sentences there and 600 back takes about 4 minutes.

A script with seed 2022 wrote 600 short sentences, 100 of each of 6 kinds. Every sentence carries something a regex can check after the round trip:

- a number with a currency or a date, like `The invoice for 1,028,211 zlotys is due on 26 December.`;
- a negation word like `not` or `never` in 50 sentences and the same 50 without it;
- a modal verb, `must`, `may` or `should`;
- a bound, `at least`, `at most`, `more than` or `less than` with a number;
- a role and a pronoun, `The doctor called because she needs the invoice.`;
- names of people and companies, mostly Polish and Belarusian, some with diacritics.

Then I ran 5 rounds. Each round translates the English that came back from the previous one.

## The first round

The numbers came back 100 of 100. The negation word came back 50 of 50 and no negation appeared in the 50 sentences without it. Pronouns came back 100 of 100. Bounds came back 92 times. 7 times `at least` or `at most` just disappeared. `The office is at most 80 kilometers from the station` returned as `The office is 80 kilometres from the station`. Once 3631 dollars became 631.

The kind of modality came back 67 times. `should` became `должен` in Russian and `must` or `has to` in English 32 of 33 times. Russian has a softer word for it, `следует`, but the model used it once.

Names were the worst kind. Of 300 names 113 came back exactly. Of the 65 with Polish letters only 7 did. Piotr became Peter and Paweł Wiśniewski became Pavel Vignevsky. The shop chain Żabka became Абка in Russian and Abka in English, the company Mleczna Dolina became Melena Valley.

Up to here it was half my expectation. I expected the diacritics to go, but I did not expect Piotr to become Peter. And the pronouns I was most worried about came back every time.

<figure class="fig">
<svg viewBox="0 0 640 376" role="img" aria-label="Bars for round 1 and round 5. Number, currency and date: 100 and 98 of 100. Negation word: 100 and 100 of 100. Pronoun: 100 and 99 of 100. Bound: 92 and 91 of 100. Modal verb: 67 and 67 of 100. Names: 113 and 106 of 300. Found by reading round 1: tenant came back 0 of 21 times, refundable 0 of 10, invoice 46 of 66.">
  <text x="12" y="18" class="f-label f-muted">came back after the round trip, out of all sentences of the kind</text>
  <rect x="230" y="30" width="12" height="10" class="f-box"/>
  <text x="248" y="39" class="f-mono f-ink" style="font-size:11px">round 1</text>
  <rect x="340" y="30" width="12" height="10" class="f-plain"/>
  <text x="358" y="39" class="f-mono f-ink" style="font-size:11px">round 5</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">checked by a regex</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">number, currency, date</text>
  <rect x="230" y="82" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="77" width="280" height="11" class="f-box"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="96" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="91" width="274" height="11" class="f-plain"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">98/100</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">negation word</text>
  <rect x="230" y="116" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="111" width="280" height="11" class="f-box"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="130" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="125" width="280" height="11" class="f-plain"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <text x="24" y="162" class="f-mono f-ink" style="font-size:11px">pronoun she/he</text>
  <rect x="230" y="150" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="145" width="280" height="11" class="f-box"/>
  <text x="520" y="154" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="164" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="159" width="277" height="11" class="f-plain"/>
  <text x="520" y="168" class="f-mono f-ink" style="font-size:11px">99/100</text>
  <text x="24" y="196" class="f-mono f-ink" style="font-size:11px">at least / at most ...</text>
  <rect x="230" y="184" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="179" width="258" height="11" class="f-box"/>
  <text x="520" y="188" class="f-mono f-ink" style="font-size:11px">92/100</text>
  <rect x="230" y="198" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="193" width="255" height="11" class="f-plain"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">91/100</text>
  <text x="24" y="230" class="f-mono f-ink" style="font-size:11px">must / may / should</text>
  <rect x="230" y="218" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="213" width="188" height="11" class="f-box"/>
  <text x="520" y="222" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <rect x="230" y="232" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="227" width="188" height="11" class="f-plain"/>
  <text x="520" y="236" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <text x="24" y="264" class="f-mono f-ink" style="font-size:11px">names</text>
  <rect x="230" y="252" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="247" width="105" height="11" class="f-box"/>
  <text x="520" y="256" class="f-mono f-ink" style="font-size:11px">113/300</text>
  <rect x="230" y="266" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="261" width="99" height="11" class="f-plain"/>
  <text x="520" y="270" class="f-mono f-ink" style="font-size:11px">106/300</text>
  <text x="12" y="292" class="f-mono f-accent" style="font-size:12px">found by reading round 1</text>
  <text x="24" y="316" class="f-mono f-ink" style="font-size:11px">tenant</text>
  <rect x="230" y="312" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="316" class="f-mono f-ink" style="font-size:11px">0/21</text>
  <text x="24" y="338" class="f-mono f-ink" style="font-size:11px">refundable</text>
  <rect x="230" y="334" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="338" class="f-mono f-ink" style="font-size:11px">0/10</text>
  <text x="24" y="360" class="f-mono f-ink" style="font-size:11px">invoice</text>
  <rect x="230" y="356" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="351" width="195" height="11" class="f-box"/>
  <text x="520" y="360" class="f-mono f-ink" style="font-size:11px">46/66</text>
</svg>
<figcaption>The regex checks only the word that carries the meaning. The lower 3 words it did not look at.</figcaption>
</figure>

## Where my check was wrong

My script said that negation was perfect. Then I read all 600 Russian sentences of the first round by eye and found 3 things the script did not see.

All 21 tenants became landlords. `The tenant has not paid the rent for 30 months` went to Russian as `Арендодатель не платил арендную плату`. That is the landlord who did not pay. It came back as `The lessor did not pay rent for 30 months`. The `not` is still there, so the negation check passed, but now the other person owes the money.

The second one goes in the other direction. `The fee is not refundable after 3 days` became `не подлежит возмещению`, which is correct Russian for not refundable. It came back as `This fee is not payable`. In 9 of 10 such sentences the Russian was right and the English that came back was wrong. So in these 9 the error is on the way back.

The third is the invoice. Sometimes the model translates it as `счёт-фактура`, the formal invoice. Other times it is plain `счёт`. The formal word came back as invoice 46 of 46 times. Plain `счёт` came back as invoice 0 of 20 times, mostly as `account`. Plain `счёт` also means a bank account in Russian.

## The other direction

The pronouns, where the check said 100 of 100, had a problem of their own.

Russian puts gender on the verb in the past tense. In 16 of 60 sentences with such a verb, the verb follows the usual gender of the profession and not the pronoun. `The accountant called because she needs the invoice` became `Бухгалтер позвонил, потому что ей нужен счет`. A Russian reader is likely to see 2 people here, a man who called and some woman who needs the invoice. A masculine verb after бухгалтер is possible for a woman too, so it does not prove 2 people, but it pushes the reader there. In 13 of the 16 it is a male verb next to `she`. The nurse went the other way 3 times.

The English that came back was `The accountant called because she needs an account` and the pronoun check passed all 16. English verbs carry no gender, so the error in the middle has no place in the English that comes back. The English is a little ambiguous by itself, `she` could be someone else, but I read it as 1 person.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="A 2 by 2 table. Russian right and English back right: the check works, numbers 100 of 100. Russian right and English back wrong: a false alarm, not refundable became не подлежит возмещению, which is right, and came back as not payable, 9 of 10 sentences. Russian wrong and English back right: the check misses it, the accountant called because she needs the invoice became Бухгалтер позвонил, потому что ей нужен счет, 2 people in Russian, and came back with she, 16 of 16 sentences. Russian wrong and English back wrong: the check works, the tenant became Арендодатель and came back as the lessor, 21 of 21.">
  <text x="12" y="18" class="f-label f-muted">is the Russian right, and does the English look right when it comes back</text>
  <text x="250.5" y="46" class="f-label f-ink" text-anchor="middle">comes back right</text>
  <text x="507.5" y="46" class="f-label f-ink" text-anchor="middle">comes back wrong</text>
  <text x="12" y="110" class="f-label f-ink">Russian</text>
  <text x="12" y="124" class="f-label f-ink">right</text>
  <text x="12" y="230" class="f-label f-ink">Russian</text>
  <text x="12" y="244" class="f-label f-ink">wrong</text>
  <rect x="126" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="138" y="78" class="f-label f-muted">the check works</text>
  <text x="138" y="116" class="f-mono f-ink" style="font-size:13px">numbers 100 of 100</text>
  <rect x="383" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="78" class="f-label f-muted">false alarm</text>
  <text x="395" y="102" class="f-mono f-ink" style="font-size:11px">not refundable</text>
  <text x="395" y="120" class="f-mono f-ink" style="font-size:11px">→ не подлежит возмещению</text>
  <text x="395" y="138" class="f-mono f-ink" style="font-size:11px">→ not payable</text>
  <text x="620" y="158" class="f-mono f-ink" text-anchor="end" style="font-size:12px">9 of 10</text>
  <rect x="126" y="176" width="249" height="112" rx="4" class="f-accent" fill-opacity="0.18"/>
  <text x="138" y="198" class="f-label f-accent">the check misses it</text>
  <text x="138" y="222" class="f-mono f-ink" style="font-size:11px">the accountant ... she</text>
  <text x="138" y="240" class="f-mono f-ink" style="font-size:11px">→ Бухгалтер позвонил ... ей</text>
  <text x="138" y="258" class="f-mono f-ink" style="font-size:11px">→ the accountant ... she</text>
  <text x="363" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">16 of 16</text>
  <rect x="383" y="176" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="198" class="f-label f-muted">the check works</text>
  <text x="395" y="222" class="f-mono f-ink" style="font-size:11px">the tenant</text>
  <text x="395" y="240" class="f-mono f-ink" style="font-size:11px">→ Арендодатель</text>
  <text x="395" y="258" class="f-mono f-ink" style="font-size:11px">→ the lessor</text>
  <text x="620" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">21 of 21</text>
</svg>
<figcaption>The lower left cell is the dangerous one: the error was in the middle and there is nothing in English to bring it back.</figcaption>
</figure>

## More rounds

I expected that the text would stop changing after 2 or 3 rounds. It almost did. Compared with the previous round, 540 sentences changed in round 1, then 172, 63, 31 and 25. Only 60 of 600 came back word for word the same as the original.

138 sentences had lost something after the first round and 142 after 5 rounds. I was ready to write that later rounds add 4 new losses. Then I looked at them. 1 is my own regex: `at most 1817` came back as `does not require more than 1,817`, which means the same. My pattern only knew `not more than` written together. 1 is only a mix of separators in `1,028 211`. 2 change the meaning. `Our rent went up to 54,466 zlotys` became `54 466 человек` in round 2, which is 54,466 people. In round 5 the rent was `$54,466`. In round 2 the developer who was `she` became `Застройщик`, a property developer. The Russian dropped the pronoun and the English came back with `he`.

Of the 25 sentences still changing in round 5, 17 swing between 2 versions, mostly `she needs the bill` and `she needs an account`. Only 8 still change in some other way.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Changed since the previous round: 540, 172, 63, 31, 25 of 600 in rounds 1 to 5. Sentences that lost something by this round: 138, 142, 142, 142, 142.">
  <text x="12" y="18" class="f-label f-muted">600 sentences, 5 rounds</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">changed since the previous round</text>
  <rect x="320" y="30" width="12" height="10" class="f-accent"/>
  <text x="338" y="39" class="f-mono f-ink" style="font-size:11px">lost something by this round</text>
  <line x1="40" y1="230" x2="628" y2="230" class="f-line"/>
  <rect x="60" y="86" width="40" height="144" class="f-box"/>
  <text x="80" y="80" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">540</text>
  <rect x="104" y="193" width="40" height="37" class="f-accent"/>
  <text x="124" y="187" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">138</text>
  <text x="102" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">round 1</text>
  <rect x="172" y="184" width="40" height="46" class="f-box"/>
  <text x="192" y="178" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">172</text>
  <rect x="216" y="192" width="40" height="38" class="f-accent"/>
  <text x="236" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="214" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">round 2</text>
  <rect x="284" y="213" width="40" height="17" class="f-box"/>
  <text x="304" y="207" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">63</text>
  <rect x="328" y="192" width="40" height="38" class="f-accent"/>
  <text x="348" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="326" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">round 3</text>
  <rect x="396" y="222" width="40" height="8" class="f-box"/>
  <text x="416" y="216" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">31</text>
  <rect x="440" y="192" width="40" height="38" class="f-accent"/>
  <text x="460" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="438" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">round 4</text>
  <rect x="508" y="223" width="40" height="7" class="f-box"/>
  <text x="528" y="217" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">25</text>
  <rect x="552" y="192" width="40" height="38" class="f-accent"/>
  <text x="572" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="550" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">round 5</text>
</svg>
<figcaption>In round 1 the change is counted against the original. Of the 25 still changing in round 5, 17 swing between 2 versions.</figcaption>
</figure>

## What I did not check

It is one pair of models. I planned NLLB-200 with 600M parameters, released by Meta this July, as the second one. It did not fit on the disk of the machine. The checks are regexes on the words that carry the meaning and they do not understand meaning, so refundable to payable passed the negation check. I read the first round by eye. Rounds 2 to 5 I did not read, so there may be more there. The sentences are short, about 9 words, from templates. Negation has only 36 different ones, so 100 sentences there is less than it sounds. Russian was only the middle language. I did not try Polish or Belarusian in the middle.

Back translation was fine for numbers. It missed the accountant in all 16 sentences and it blamed a correct Russian fee 9 times of 10. Next time I need such a check I will read the middle myself or ask someone who reads it.
