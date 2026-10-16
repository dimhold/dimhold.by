---
title: "A secret scanner found 2 secrets in typed notes and none in the Whisper transcript of the same call"
description: "I wrote an invented call with 11 private items, typed it as notes and ran the spoken version through espeak-ng, MBROLA and Whisper base and small. On the notes gitleaks 8.15.2 found the AWS key and the password. With Presidio 2.2.31 added, the tools caught 7 of 11 items. On the 4 transcripts the secret scanners found nothing. Whisper broke the items with a shape and kept the door code, the bank code, a back problem and a salary, which no tool flagged anywhere."
date: 2022-12-26
lang: en
translationKey: spoken-secrets
tags: ["machine-learning", "git", "text"]
---
Since Whisper came out in September I run it on recordings of my calls. The transcripts pile up in a folder next to my notes. The obvious home for them was a git repository with a secret scanner in a commit hook, the same way people protect code. Then I realised I had no idea what a scanner sees in a transcript, because I had only ever run one over code.

So I measured it, without my real calls. I did not want real conversations in a test about leaking them.

## The setup

I wrote a short call between 2 invented people, 12 lines. Into it I put 11 things that should not leave the room: an AWS access key read letter by letter, a staging database password, the office door code, the code the bank just sent, a phone number, an email, a card number, an IBAN, a street address, a colleague's back problem and a salary someone asked to keep quiet. Anna and Marek are the only names in it.

Each line exists twice. Once as I would type it in notes during the call, for example `DB_PASSWORD=PurpleOtter1987`. Once as it would be said, "the staging database password is still purple otter nineteen eighty seven". The spoken version went through `espeak-ng` 1.51 with 2 sets of voices. One is the plain espeak voices, the other is MBROLA us1 and us2, which sound less robotic to me. Whisper transcribed it, from the repository as of 9 December, with models `base` and `small` on CPU, fp32, language set to English. That gives 4 transcripts of the same call. I synthesized and transcribed every line separately, so line N of a transcript is always line N of the call.

For secrets I ran the versions that are current this year on every document: gitleaks 8.15.2, trufflehog 3.21.0 and `detect-secrets` 1.4.0. For personal data I ran Microsoft Presidio 2.2.31 with the spaCy `en_core_web_lg` model. A second run of Whisper gave the same 2 MBROLA transcripts letter for letter. The espeak ones changed on 3 lines, because Whisper fell back to sampling there: those 3 lines decode at temperature 0.4 and above. No cell of the grid below changed.

## The typed notes

Here the tools did roughly what I expected. gitleaks found the AWS key by its shape, `AKIA` and 16 more characters. It found the password because it sits after `PASSWORD=` and its entropy, 3.51, just clears the rule's floor of 3.5, so a slightly less random password would have passed. `detect-secrets` found only the key. trufflehog found nothing. Its AWS detector wants the key id and the secret together. The 40 character secret is rarely in call notes. Presidio found the phone, the email, the card, the IBAN, the city and both names. It also decided that `DE89 3704 0044` is a person.

So 7 of the 11 items were caught by at least one tool. Nothing caught the door code, the bank code, the back problem or the salary. None of these 4 tools has a rule for a 4 digit number someone mentioned. I am not sure what such a rule would look like.

## The transcripts

On the 4 transcripts the 3 secret scanners together produced 0 findings.

You can see why line by line. Whisper `small` with MBROLA voices wrote the key as `a KQX7 or HM2 PLT-4WZ6NB`. There is no `AKIA` anymore, so the regex has nothing to start from. The password became "purple under 1987", with no `=` after the word password, so the generic rule does not fire. The card became `for 1111 1111 1111 1111 1111`: the first "four" turned into a preposition and a fifth group appeared. Presidio checks card numbers with Luhn and what is left does not pass it. The email became "hurrymail is in the dot calzcatexample.com". Marek became "Merck" with MBROLA and "America's" with espeak. Presidio took America for a place. Anna survived once, inside the broken email line, where espeak with `small` wrote "Anna.Kaul's cat example.com". That is the only transcript where Presidio found her. Everywhere else she became "and", "in a" or nothing. In the MBROLA `small` transcript Presidio found a person called "hurrymail" instead.

I spent some time reading these lines before I saw the pattern. I expected the transcripts to be worse for the tools and they are, but not at random.

<figure class="fig">
<svg viewBox="0 0 640 350" role="img" aria-label="Grid of 11 private items against 5 documents: the typed notes and 4 Whisper transcripts. In the notes all 11 values are readable and 7 are flagged by a tool. In the transcripts 4 to 5 values are readable and 1 to 2 items are flagged. The door code, the bank code, the back problem and the salary are readable in all 5 documents and flagged in none.">
  <text x="211" y="18" text-anchor="middle" class="f-label f-muted">typed</text>
  <text x="211" y="32" text-anchor="middle" class="f-label f-muted">notes</text>
  <text x="297" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="297" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="383" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="383" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="469" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="469" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="555" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="555" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="12" y="46" class="f-label f-accent">secrets</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:12px">AWS key</text>
  <rect x="200" y="54" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="62" r="4" class="f-accent"/>
  <rect x="286" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="88" class="f-mono f-ink" style="font-size:12px">DB password</text>
  <rect x="200" y="76" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="84" r="4" class="f-accent"/>
  <rect x="286" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="110" class="f-mono f-ink" style="font-size:12px">door code</text>
  <rect x="200" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="98" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="132" class="f-mono f-ink" style="font-size:12px">bank code</text>
  <rect x="200" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="120" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="148" class="f-label f-accent">personal</text>
  <text x="12" y="168" class="f-mono f-ink" style="font-size:12px">phone</text>
  <rect x="200" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="164" r="4" class="f-accent"/>
  <rect x="286" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="492" cy="164" r="4" class="f-accent"/>
  <rect x="544" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="578" cy="164" r="4" class="f-accent"/>
  <text x="12" y="190" class="f-mono f-ink" style="font-size:12px">email</text>
  <rect x="200" y="178" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="186" r="4" class="f-accent"/>
  <rect x="286" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:12px">card</text>
  <rect x="200" y="200" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="208" r="4" class="f-accent"/>
  <rect x="286" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="234" class="f-mono f-ink" style="font-size:12px">IBAN</text>
  <rect x="200" y="222" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="230" r="4" class="f-accent"/>
  <rect x="286" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:12px">address</text>
  <rect x="200" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="252" r="4" class="f-accent"/>
  <rect x="286" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="320" cy="252" r="4" class="f-accent"/>
  <rect x="372" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="406" cy="252" r="4" class="f-accent"/>
  <rect x="458" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="492" cy="252" r="4" class="f-accent"/>
  <rect x="544" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="578" cy="252" r="4" class="f-accent"/>
  <text x="12" y="278" class="f-mono f-ink" style="font-size:12px">back problem</text>
  <rect x="200" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="266" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="300" class="f-mono f-ink" style="font-size:12px">salary</text>
  <rect x="200" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="200" y="324" width="22" height="14" rx="2" class="f-box"/><text x="230" y="335" class="f-label f-muted">value readable</text>
  <circle cx="420" cy="331" r="4" class="f-accent"/><text x="432" y="335" class="f-label f-muted">flagged by a tool</text>
</svg>
<figcaption>Whisper keeps the short numbers and plain words and breaks the items that have a shape. The address counts as flagged when Presidio found the city.</figcaption>
</figure>

Whisper broke most of the items the tools know how to look for, because those have a shape: a prefix, a checksum, an `@`. The phone number survived too, but only with the MBROLA voices. What survived in every transcript is the door code, the bank code, the back problem and the salary, the items no tool caught in any document. Those are short numbers and plain words. Whisper keeps the numbers and the meaning even when it garbles the words around them. In 1 transcript the door code line became "The office norco is 4815". The MBROLA transcripts were readable on 5 of 11 items. Presidio flagged 1 of those 5, the phone number, at a score of 0.4. It also flagged Springfield, from an address that had become "14 ohms street".

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="3 items from the call. The AWS key spoken letter by letter comes out as a KQX7 or HM2 PLT-4WZ6NB, and the rule wants AKIA followed by 16 characters, so no match. The card number comes out as for 1111 1111 1111 1111 1111, which is not 16 digits passing Luhn, so no match. The door code comes out as 4815, perfectly readable, and there is no rule for it.">
  <text x="12" y="18" class="f-label f-muted">said</text>
  <text x="212" y="18" class="f-label f-muted">Whisper small, MBROLA</text>
  <text x="444" y="18" class="f-label f-muted">what the tool needs</text>
  <rect x="12" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="49" class="f-mono f-muted" style="font-size:11px">A K I A Q X 7 R H M ...</text>
  <line x1="196" y1="45" x2="208" y2="45" class="f-line"/>
  <rect x="212" y="30" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="49" class="f-mono f-ink" style="font-size:11px">a KQX7 or HM2 PLT-4WZ6NB</text>
  <line x1="428" y1="45" x2="440" y2="45" class="f-line"/>
  <rect x="444" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="49" class="f-mono f-ink" style="font-size:11px">AKIA and 16 characters</text>
  <text x="452" y="76" class="f-mono f-muted" style="font-size:11px">no match</text>
  <rect x="12" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="111" class="f-mono f-muted" style="font-size:11px">four one one one, ...</text>
  <line x1="196" y1="107" x2="208" y2="107" class="f-line"/>
  <rect x="212" y="92" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="111" class="f-mono f-ink" style="font-size:11px">for 1111 1111 1111 1111 1111</text>
  <line x1="428" y1="107" x2="440" y2="107" class="f-line"/>
  <rect x="444" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="111" class="f-mono f-ink" style="font-size:11px">16 digits that pass Luhn</text>
  <text x="452" y="138" class="f-mono f-muted" style="font-size:11px">no match</text>
  <rect x="12" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="173" class="f-mono f-muted" style="font-size:11px">four eight one five</text>
  <line x1="196" y1="169" x2="208" y2="169" class="f-line"/>
  <rect x="212" y="154" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="173" class="f-mono f-ink" style="font-size:11px">4815</text>
  <line x1="428" y1="169" x2="440" y2="169" class="f-line"/>
  <rect x="444" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="173" class="f-mono f-ink" style="font-size:11px">no rule exists</text>
  <text x="452" y="200" class="f-mono f-accent" style="font-size:11px">readable, not flagged</text>
</svg>
<figcaption>Same 3 lines, MBROLA voices, Whisper small. The tools look for shapes. Speech does not keep them.</figcaption>
</figure>

The garbled items are still readable to anyone who knows the team: "Merck is up until Friday. The doctor says it is his back again."

## What `git rm` gives back

The other half of the decision is old knowledge. I checked how `git rm` behaves mostly to be able to say I did. I committed a transcript, removed it with `git rm` in the next commit and looked. `git log -S'door'` finds both commits. The file is readable through `HEAD~1` after `git gc --prune=now`. A fresh clone has it too, because the commit that added it is still in the history. Getting it out means rewriting history with `git filter-repo` or BFG and hoping nobody cloned in between. GitHub's page about removing sensitive data recommends the same 2 tools and warns about existing clones.

So transcripts do not go into any repository. The folder lives outside of them. The scanner in a commit hook stays a tool for code.

## What I did not check

This is 1 invented call with synthetic voices. Real calls have noise and accents. People talk over each other. A real voice probably makes names easier for Whisper. I did not try the `medium` and `large-v2` models, which may rebuild the AWS key or the email. I did not try Russian. Presidio ran with its default recognizers. A custom pattern for door codes would catch some of them, but it would probably also catch every 4 digit number in the call. And I did not try a language model as the detector. It might understand "she asked us not to tell the team", but it has to read the whole transcript to do that.
