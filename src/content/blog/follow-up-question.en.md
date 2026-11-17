---
title: "I asked a small model \"And Leon?\" to see what the chat in ChatGPT needs"
description: "ChatGPT opened on November 30 and my explanation for its first week was the text box. I gave Flan-T5 base and large and GPT-2 large a transcript with notes about 3 people and asked short questions like \"And Leon?\". Flan-T5 large answers all of them, Flan-T5 base answers \"And Leon?\" with the age and GPT-2, never tuned on instructions, gets it right 3 times out of 4."
date: 2022-12-11
lang: en
translationKey: follow-up-question
tags: ["llm", "machine-learning", "text"]
---
ChatGPT opened on Wednesday, November 30. On Monday Sam Altman wrote that it crossed 1 million users. OpenAI says the model is tuned from the GPT-3.5 series and GPT-3 itself has been in the API since 2020. So my first explanation for the week was the text box. As I understand it, a chat is a transcript that is sent back to the model with every new message, so the part people love should work on a much smaller model. The part I mean is the short question: you ask what Simon does, then type "And Leon?" and get Leon's job.

I have called chat products "just a wrapper" before and never checked what the wrapper needs from the model. So I checked it on models that anyone could download in December 2022. The question is not new. CoQA and QuAC (2018) collect questions that depend on earlier turns. CANARD (2019) has people rewrite them into standalone ones because QA models do worse on the dependent ones. My test is much smaller.

## The setup

The models are Flan-T5 base (248M parameters) and Flan-T5 large (783M), which Google released on October 20 after instruction tuning on 1836 tasks. As a control I took GPT-2 large (774M) from 2019, which was never tuned to follow instructions. I ran them with torch 1.13.0 and transformers 4.25.1 on 4 CPU cores with greedy decoding.

My first questions were about chemical elements: "What is the chemical symbol for gold?", then "And silver?". I dropped them after the first run. Flan-T5 base got none of the 40 atomic numbers right and wrote the symbols in lowercase, "li" for lithium. In a quick probe Flan-T5 large told me the atomic number of gold is 58 and that Hamlet was written by "thomas keats". I had assumed that a model which follows instructions also knows the periodic table.

So I moved the facts into the conversation. The first message has notes about 3 people, the model answers "OK." and then come the questions. There are 120 such records. In each, 2 people have the same gender, so "she" without the earlier turn could mean either of them.

For every record there is a full question ("How old is Leon?"). Then 2 short questions change the person ("And Leon?", "What about Leon?") and 2 change the field with a pronoun. One is a question like "How old is she?" or "Where does he live?", the other a form like "And her age?" or "And his city?". Each is asked with the earlier turn and without it. My first counting accepted "Leon is 58, works as a chef and lives" as an answer to "And Leon?". That is the whole line from the notes, so now an answer counts only if it has the right value and nothing else about that person or about somebody else. The rule applies to every answer, so it also takes away some right ones like "Laura is a pilot and lives in Torun."

Before the run I wrote down what would show that the chat is only a wrapper. Short questions with the earlier turn should be at most 10 points below the full question and without it close to guessing.

## The large model almost never missed

Flan-T5 large answered the full question in 113 of 120 records. With the earlier turn it answered all 4 kinds of short question in all 120 records. Without the earlier turn it was 50 of 240 for a new person and 77 of 240 for a new field.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="A transcript. User: Here are some notes about three people. Simon is 24, works as a teacher and lives in Wroclaw. Leon is 58, works as a chef and lives in Szczecin. Sofia is 54, works as a dentist and lives in Gdansk. Assistant: OK. User: What does Simon do for a living? Assistant: Teacher. User: And Leon? Answers with the earlier turn and without it. Flan-T5 large: Chef. Without it: Leon is 58, works as a chef and lives Flan-T5 base: Leon is 58. Without it: Simon is 24. GPT-2 large: Chef. Without it: Leon is a teacher.">
  <text x="12" y="18" class="f-label f-muted">Record 0 of 120, the earlier turn and the short question</text>
  <text x="12" y="44" class="f-label f-muted">User:</text>
  <text x="110" y="44" class="f-mono f-ink">Here are some notes about three people.</text>
  <text x="110" y="65" class="f-mono f-ink">Simon is 24, works as a teacher and lives in Wroclaw.</text>
  <text x="110" y="86" class="f-mono f-ink">Leon is 58, works as a chef and lives in Szczecin.</text>
  <text x="110" y="107" class="f-mono f-ink">Sofia is 54, works as a dentist and lives in Gdansk.</text>
  <text x="12" y="128" class="f-label f-muted">Assistant:</text>
  <text x="110" y="128" class="f-mono f-ink">OK.</text>
  <text x="12" y="149" class="f-label f-muted">User:</text>
  <text x="110" y="149" class="f-mono f-ink">What does Simon do for a living?</text>
  <text x="12" y="170" class="f-label f-muted">Assistant:</text>
  <text x="110" y="170" class="f-mono f-ink">Teacher.</text>
  <text x="12" y="191" class="f-label f-muted">User:</text>
  <text x="110" y="191" class="f-mono f-ink">And Leon?</text>
  <line x1="12" y1="210" x2="628" y2="210" class="f-plain"/>
  <text x="150" y="226" class="f-label f-muted">with the earlier turn</text>
  <text x="330" y="226" class="f-label f-muted">without it</text>
  <text x="12" y="250" class="f-label f-ink">Flan-T5 large</text>
  <text x="150" y="250" class="f-mono f-accent">Chef.</text>
  <text x="330" y="250" class="f-mono f-ink">Leon is 58, works as a chef and lives</text>
  <text x="12" y="272" class="f-label f-ink">Flan-T5 base</text>
  <text x="150" y="272" class="f-mono f-ink">Leon is 58.</text>
  <text x="330" y="272" class="f-mono f-ink">Simon is 24.</text>
  <text x="12" y="294" class="f-label f-ink">GPT-2 large</text>
  <text x="150" y="294" class="f-mono f-accent">Chef.</text>
  <text x="330" y="294" class="f-mono f-ink">Leon is a teacher.</text>
</svg>
<figcaption>The right answer is Chef. Flan-T5 base answers with the age, which is what it does in 84 of 120 records.</figcaption>
</figure>

Then I made the conversation longer. Between the notes and the questions I put up to 32 unrelated exchanges like "How many legs does a spider have?" "8.". With 32 of them the input is about 530 tokens. Between 2 and 16 exchanges the large model missed a few, at most 5 of 120. At 32 it answered both "And Leon?" and the pronoun questions in 120 of 120 records again. Before the run I wrote that up to 512 tokens the length should not matter. It held. At 32 exchanges the input is already past 512.

## The small model answers "And Leon?" with the age

Pronouns work for Flan-T5 base. Questions like "How old is she?" are right in 110 of 120 records and the form "And her age?" in 97. "And Leon?" is right in 36. Without the earlier turn it is 34, so the transcript adds almost nothing.

In 84 of the 120 answers it says the person's age: "Leon is 58." When the earlier question was about the age, that is right by accident, 29 of 39. After a question about the job it is right in 4 of 42 and after one about the city in 3 of 39. "What about Leon?" is better, 57 of 120. Maybe it simply copies the start of the person's line in the notes, where the age comes first.

<figure class="fig">
<svg viewBox="0 0 640 342" role="img" aria-label="Grouped bars, right answers out of 120 for 4 short questions and 3 models, with the earlier turn and without it. And Leon? Flan-T5 large: 120 with, 28 without. And Leon? Flan-T5 base: 36 with, 34 without. And Leon? GPT-2 large: 91 with, 6 without. What about Leon? Flan-T5 large: 120 with, 22 without. What about Leon? Flan-T5 base: 57 with, 39 without. What about Leon? GPT-2 large: 94 with, 24 without. How old is she? Flan-T5 large: 120 with, 37 without. How old is she? Flan-T5 base: 110 with, 42 without. How old is she? GPT-2 large: 81 with, 44 without. And her age? Flan-T5 large: 120 with, 40 without. And her age? Flan-T5 base: 97 with, 29 without. And her age? GPT-2 large: 72 with, 39 without.">
  <text x="12" y="18" class="f-label f-muted">Right answers out of 120 records</text>
  <rect x="12.0" y="30" width="12.0" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">with the earlier turn</text>
  <rect x="260.0" y="30" width="12.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="278" y="39" class="f-label f-ink">without it</text>
  <text x="12" y="73" class="f-mono f-ink">And Leon?</text>
  <text x="150" y="73" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="64" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="71" width="70.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="74" class="f-label f-ink">120 / 28</text>
  <text x="150" y="91" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="82" width="90.0" height="6" class="f-accent"/>
  <rect x="250.0" y="89" width="85.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="92" class="f-label f-ink">36 / 34</text>
  <text x="150" y="109" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="100" width="227.5" height="6" class="f-accent"/>
  <rect x="250.0" y="107" width="15.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="110" class="f-label f-ink">91 / 6</text>
  <text x="12" y="139" class="f-mono f-ink">What about Leon?</text>
  <text x="150" y="139" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="130" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="137" width="55.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="140" class="f-label f-ink">120 / 22</text>
  <text x="150" y="157" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="148" width="142.5" height="6" class="f-accent"/>
  <rect x="250.0" y="155" width="97.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="158" class="f-label f-ink">57 / 39</text>
  <text x="150" y="175" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="166" width="235.0" height="6" class="f-accent"/>
  <rect x="250.0" y="173" width="60.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="176" class="f-label f-ink">94 / 24</text>
  <text x="12" y="205" class="f-mono f-ink">How old is she?</text>
  <text x="150" y="205" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="196" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="203" width="92.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="206" class="f-label f-ink">120 / 37</text>
  <text x="150" y="223" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="214" width="275.0" height="6" class="f-accent"/>
  <rect x="250.0" y="221" width="105.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="224" class="f-label f-ink">110 / 42</text>
  <text x="150" y="241" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="232" width="202.5" height="6" class="f-accent"/>
  <rect x="250.0" y="239" width="110.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="242" class="f-label f-ink">81 / 44</text>
  <text x="12" y="271" class="f-mono f-ink">And her age?</text>
  <text x="150" y="271" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="262" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="269" width="100.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="272" class="f-label f-ink">120 / 40</text>
  <text x="150" y="289" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="280" width="242.5" height="6" class="f-accent"/>
  <rect x="250.0" y="287" width="72.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="290" class="f-label f-ink">97 / 29</text>
  <text x="150" y="307" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="298" width="180.0" height="6" class="f-accent"/>
  <rect x="250.0" y="305" width="97.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="308" class="f-label f-ink">72 / 39</text>
  <line x1="550" y1="56" x2="550" y2="318" class="f-plain"/>
  <text x="12" y="332" class="f-label f-muted">rows 3 and 4 cover all 3 fields and he/his in records about men</text>
</svg>
<figcaption>Flan-T5 large answers every short question. Flan-T5 base handles the pronoun but answers &quot;And Leon?&quot; about as often as without the earlier turn.</figcaption>
</figure>

As I see it, "she" only needs the model to find a person in the text. "And Leon?" needs it to take the question from the previous turn and put a new name into it. The 248M model only manages the pronoun. With 32 unrelated exchanges it gets worse at "And Leon?", 24 of 120, while its full questions at the same length are right in 115.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Line chart of right answers out of 120 to &quot;And Leon?&quot; as unrelated exchanges are added between the notes and the questions. Flan-T5 large: 0: 120, 2: 118, 8: 120, 16: 120, 32: 120. Flan-T5 base: 0: 36, 2: 39, 8: 41, 16: 36, 32: 24. GPT-2 large: 0: 91, 32: 102.">
  <text x="12" y="18" class="f-label f-muted">&quot;And Leon?&quot; with unrelated exchanges in between, right out of 120</text>
  <line x1="60" y1="200" x2="600" y2="200" class="f-plain"/>
  <text x="52" y="204" class="f-label f-muted" text-anchor="end">0</text>
  <line x1="60" y1="120" x2="600" y2="120" class="f-plain"/>
  <text x="52" y="124" class="f-label f-muted" text-anchor="end">60</text>
  <line x1="60" y1="40" x2="600" y2="40" class="f-plain"/>
  <text x="52" y="44" class="f-label f-muted" text-anchor="end">120</text>
  <text x="60" y="218" class="f-label f-ink" text-anchor="middle">0</text>
  <text x="60" y="232" class="f-label f-muted" text-anchor="middle">(85)</text>
  <text x="195" y="218" class="f-label f-ink" text-anchor="middle">2</text>
  <text x="195" y="232" class="f-label f-muted" text-anchor="middle">(113)</text>
  <text x="330" y="218" class="f-label f-ink" text-anchor="middle">8</text>
  <text x="330" y="232" class="f-label f-muted" text-anchor="middle">(196)</text>
  <text x="465" y="218" class="f-label f-ink" text-anchor="middle">16</text>
  <text x="465" y="232" class="f-label f-muted" text-anchor="middle">(307)</text>
  <text x="600" y="218" class="f-label f-ink" text-anchor="middle">32</text>
  <text x="600" y="232" class="f-label f-muted" text-anchor="middle">(529)</text>
  <text x="330" y="250" class="f-label f-muted" text-anchor="middle">unrelated exchanges (Flan-T5 input tokens)</text>
  <polyline points="60,40.0 195,42.7 330,40.0 465,40.0 600,40.0" class="f-line"/>
  <circle cx="60" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="195" cy="42.7" r="3.5" class="f-accent"/>
  <circle cx="330" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="465" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="600" cy="40.0" r="3.5" class="f-accent"/>
  <text x="592" y="30" class="f-label f-ink" text-anchor="end">Flan-T5 large</text>
  <polyline points="60,152.0 195,148.0 330,145.3 465,152.0 600,168.0" class="f-line"/>
  <circle cx="60" cy="152.0" r="3.5" class="f-ink"/>
  <circle cx="195" cy="148.0" r="3.5" class="f-ink"/>
  <circle cx="330" cy="145.3" r="3.5" class="f-ink"/>
  <circle cx="465" cy="152.0" r="3.5" class="f-ink"/>
  <circle cx="600" cy="168.0" r="3.5" class="f-ink"/>
  <text x="592" y="184" class="f-label f-ink" text-anchor="end">Flan-T5 base</text>
  <circle cx="60" cy="78.7" r="3.5" class="f-muted"/>
  <circle cx="600" cy="64.0" r="3.5" class="f-muted"/>
  <text x="592" y="80" class="f-label f-muted" text-anchor="end">GPT-2 large</text>
</svg>
<figcaption>With 32 unrelated exchanges the input is about 530 tokens. Flan-T5 large stays at 120, Flan-T5 base drops from 36 to 24, GPT-2 large goes from 91 to 102.</figcaption>
</figure>

## The model that was never taught to follow instructions

I expected GPT-2 large to fail everywhere. It answered the full question in 89 of 120 records, worse than both Flan models. But "And Leon?" with the earlier turn was right in 91 of 120 and without it in 6. That is 2.5 times more than Flan-T5 base. In 12 of its misses it gave the value of the previous person: Daniel is a plumber and it answered "Farmer.", the job of the person asked about before him. Pronouns are its weak side, questions like "How old is she?" are right in 81 with the earlier turn and in 44 without it. With 32 unrelated exchanges in between it got better at "And Leon?", 102 of 120. Each inserted exchange is one more example of a question followed by a short answer.

My explanation is a guess and I did not test it. For GPT-2 the transcript is only text to continue. After "What does Simon do for a living? Teacher." the likely continuation of "And Leon?" is another job. Flan-T5 learned to answer one instruction at a time and the small one reads the last line as the whole instruction. There is also a difference I did not control. The T5 tokenizer removes line breaks, so Flan-T5 sees the transcript as one line with "User:" and "Assistant:" inside.

## What it changes for me

The short question turned out to be cheap. A 783M model from October gets it right almost every time when the facts are in the transcript. Even GPT-2 from 2019 gets "And Leon?" right 3 times out of 4. That supports my wrapper theory, but only for the mechanics. The same large model fails at "What is the atomic number of gold?" and I would not keep talking to it for long. So my text box explanation covers only part of the week. The short question helps only after a good first answer and I did not measure the first answer here.

There is also a cost I had not thought about. In my setup the model has no memory between turns, so every short question sends the whole conversation again. In my longest case the 2 words "And Leon?" cost about 530 tokens of input.

## What I didn't check

- ChatGPT itself. It has no API, so I cannot run 1000 questions against it.
- Real conversations. People write "no, the other one" and "shorter please". My templates are much cleaner.
- Longer conversations and languages other than English.
- Flan-T5 XL with 3B parameters. It does not fit into the 5 GB of memory I have on this machine.
- Each number is one deterministic run with one prompt format. Another format could move the small model.
