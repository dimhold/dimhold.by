---
title: "A chatbot told me the capital of Ghana is Moscow and said yes when I asked if it was sure"
description: "BlenderBot 90M and 400M and DialoGPT large answer 500 TriviaQA questions, 100 capitals and 100 questions about things that do not exist, then hear \"Are you sure?\". BlenderBot 400M names Moscow for 30 countries, never admits it does not know and says yes after every capital, right or wrong."
date: 2022-03-19
lang: en
translationKey: chatbot-sure-and-wrong
tags: ["llm", "machine-learning", "reliability"]
---
I asked BlenderBot 400M what the capital of Australia is. It answered: "The capital is Sydney. It is the most populous city in Australia." The second sentence is true and to me it made the first one sound right. To the next questions it answered "I'm not sure, but I do know that..." and I read that as modesty. I never checked if that phrase means anything. So I took 3 chat models that anyone can download today, asked them 700 questions and after each real question asked "Are you sure?".

## The setup

The models are BlenderBot small 90M and BlenderBot 400M distill from Facebook and DialoGPT large from Microsoft, about 770M parameters. I ran them with Python 3.9, torch 1.11 and transformers 4.17 on 4 CPU cores. The generation settings come from each model's own config. For BlenderBot that is beam search with 10 beams and a minimum length of 20 tokens, for DialoGPT greedy decoding.

The questions:

1. 500 questions from the TriviaQA validation set, picked with seed 2022;
2. 100 questions about things that do not exist, like "How tall is Mount Naostvin?" or a novel "The Iron Saddle of Naostske". The names are glued from random syllables, so there is no right answer;
3. after every real question, a second turn: "Are you sure?".

Before the run I wrote down 5 expectations. Fewer than 20% of answers are right. Answers with a hedge are right as often as answers without one. More than half of the invented things get an invented answer. "Are you sure?" gets "yes" equally often after right and wrong answers. The average probability of the answer tokens separates right from wrong answers better than chance.

## Trivia was too hard and I first counted it wrong

My matcher said BlenderBot 400M answered 5 TriviaQA questions right and DialoGPT 8. Then I read them. Either the model repeated the question and the question contained the answer. Or TriviaQA's list of answer aliases had junk like "is" and "i" in it. After reading, it was 1 right for BlenderBot 90M, 2 for BlenderBot 400M and 5 for DialoGPT, out of 500. With so few right answers I cannot compare confident and unsure answers.

So I added 100 easy questions: "What is the capital of France?" and so on for 100 countries with a clear capital. The matcher stumbled there as well. "Reykjavík" with the accent did not match "Reykjavik" and I first counted BlenderBot 400M one capital short.

## Moscow

BlenderBot 400M got 13 capitals right. Paris, London, Tokyo and 10 more. For 30 other countries it answered Moscow. Ghana, Poland and Bangladesh among them. Yemen got "Memphis, Tennessee". BlenderBot 90M got 0 of 100 and DialoGPT 3. More than half of DialoGPT's answers start with the name of the country itself, like "Denmark is the capital of Denmark".

<figure class="fig">
<svg viewBox="0 0 640 248" role="img" aria-label="Stacked bars of 100 capital questions per model. BlenderBot 90M: right 0, Moscow 0, other wrong 100. BlenderBot 400M: right 13, Moscow 30, other wrong 57. DialoGPT large: right 3, Moscow 0, other wrong 97. Examples from BlenderBot 400M: Ghana, The capital is Moscow. Poland, The capital is Moscow. Yemen, The capital is Memphis, Tennessee. France, The capital is Paris.">
  <text x="12" y="18" class="f-label f-muted">100 questions &quot;What is the capital of X?&quot;</text>
  <rect x="12" y="30" width="12" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">right</text>
  <rect x="172" y="30" width="12" height="10" class="f-box"/>
  <text x="190" y="39" class="f-label f-ink">Moscow</text>
  <rect x="332" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="350" y="39" class="f-label f-ink">other wrong</text>
  <text x="12" y="71" class="f-label f-ink">BlenderBot 90M</text>
  <rect x="150.0" y="60" width="380.0" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="71" class="f-label f-ink">0 / 0 / 100</text>
  <text x="12" y="101" class="f-label f-ink">BlenderBot 400M</text>
  <rect x="150.0" y="90" width="49.4" height="14" class="f-accent"/>
  <rect x="199.4" y="90" width="114.0" height="14" class="f-box"/>
  <rect x="313.4" y="90" width="216.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="101" class="f-label f-ink">13 / 30 / 57</text>
  <text x="12" y="131" class="f-label f-ink">DialoGPT large</text>
  <rect x="150.0" y="120" width="11.4" height="14" class="f-accent"/>
  <rect x="161.4" y="120" width="368.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="131" class="f-label f-ink">3 / 0 / 97</text>
  <text x="12" y="172" class="f-label f-muted">Ghana</text>
  <text x="110" y="172" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="194" class="f-label f-muted">Poland</text>
  <text x="110" y="194" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="216" class="f-label f-muted">Yemen</text>
  <text x="110" y="216" class="f-mono f-ink">The capital is Memphis, Tennessee.</text>
  <text x="12" y="238" class="f-label f-muted">France</text>
  <text x="110" y="238" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="152" class="f-label f-muted">BlenderBot 400M</text>
</svg>
<figcaption>BlenderBot 400M names Moscow for 30 countries other than Russia. The other 2 models almost never name the right capital.</figcaption>
</figure>

## "I'm not sure, but I do know that"

On TriviaQA 365 of 500 answers of BlenderBot 400M say "I'm not sure" or "I don't know" and then go on with "but". After the "but" comes a fact. For the question about the Apostle of the Indies the fact is "the band was formed in 1985". BlenderBot 90M does the same 324 times.

BlenderBot 400M never stopped at "I'm not sure". 73 of its 100 answers start with it and then claim something anyway, the rest claim straight away. 71 answers have a detail that could be checked, a name or a year. "The Iron Saddle of Naostske" was "written by James Fenimore Cooper and published in 1813". BlenderBot 90M only admitted it did not know 4 times. DialoGPT never admitted, but 61 of its answers say nothing at all: "I think it was the year before". The other 39 are concrete. 6 of the 10 invented mountains are "6'4" tall.

Then I looked at the minimum length of 20 tokens again. "The capital is Paris." is 7 tokens with the end token, so the model has to say more. Maybe "I'm not sure, but" is simply filler. I ran BlenderBot 400M on capitals and invented things again with the minimum set to 1. On capitals the hedges went from 8 to 0 and 14 answers were right. Moscow came 33 times. On invented things the "not sure, but" answers went from 73 to 43 and admissions stayed at 0. The 30 answers that lost the hedge mostly kept the invention: "I'm not sure who directed it, but it was directed by Steven Spielberg" became "It was directed by Steven Spielberg."

So part of the modest phrase I trusted is filler for the 20 token floor. Why 43 of 73 keep it without the floor I cannot say.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Paired bars for BlenderBot 400M with minimum length 20 and 1, out of 100 questions each. hedges, capitals: 8 with 20, 0 with 1. &quot;but I do know&quot;, invented: 73 with 20, 43 with 1. admissions, invented: 0 with 20, 0 with 1. right, capitals: 13 with 20, 14 with 1.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, minimum answer length 20 tokens (default) and 1</text>
  <rect x="12" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="30" y="39" class="f-label f-ink">min_length 20</text>
  <rect x="172" y="30" width="12" height="10" class="f-accent"/>
  <text x="190" y="39" class="f-label f-ink">min_length 1</text>
  <text x="12" y="74" class="f-label f-ink">hedges, capitals</text>
  <rect x="220" y="60" width="27.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="253.2" y="69" class="f-label f-ink">8</text>
  <rect x="220" y="73" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="82" class="f-label f-ink">0</text>
  <text x="12" y="114" class="f-label f-ink">&quot;but I do know&quot;, invented</text>
  <rect x="220" y="100" width="248.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="474.2" y="109" class="f-label f-ink">73</text>
  <rect x="220" y="113" width="146.2" height="10" class="f-accent"/>
  <text x="372.2" y="122" class="f-label f-ink">43</text>
  <text x="12" y="154" class="f-label f-ink">admissions, invented</text>
  <rect x="220" y="140" width="1.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="227" y="149" class="f-label f-ink">0</text>
  <rect x="220" y="153" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="162" class="f-label f-ink">0</text>
  <text x="12" y="194" class="f-label f-ink">right, capitals</text>
  <rect x="220" y="180" width="44.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="270.2" y="189" class="f-label f-ink">13</text>
  <rect x="220" y="193" width="47.6" height="10" class="f-accent"/>
  <text x="273.6" y="202" class="f-label f-ink">14</text>
</svg>
<figcaption>Without the minimum length the hedges on capitals disappear and on invented things 30 of 73 go away. Admissions stay at 0.</figcaption>
</figure>

## "Are you sure?"

BlenderBot 400M answered "Yes" to all 100 capitals. 13 after a right answer, 87 after a wrong one. On TriviaQA it was 471 of 500. What comes after the "Yes" is a new claim. After Paris it wrote: "Yes, it is located in the southeastern region of France, bordered by the Mediterranean Sea and the Atlantic Ocean." In none of the 13 cases did it repeat the right capital.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 dialogues with BlenderBot 400M. Me: What is the capital of France? Bot: The capital is Paris. Me: Are you sure? Bot: Yes, it is located in the southeastern region of France. Me: What is the capital of Ghana? Bot: The capital is Moscow. Me: Are you sure? Bot: Yes, it is located in the southeastern region of the Balkan Peninsula. Yes after 13 of 13 right capitals and after 87 of 87 wrong ones.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, second turn &quot;Are you sure?&quot;</text>
  <text x="12" y="44" class="f-label f-muted">me</text>
  <text x="52" y="44" class="f-mono f-ink">What is the capital of France?</text>
  <text x="12" y="66" class="f-label f-muted">bot</text>
  <text x="52" y="66" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="88" class="f-label f-muted">me</text>
  <text x="52" y="88" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="110" class="f-label f-muted">bot</text>
  <text x="52" y="110" class="f-mono f-ink">Yes, it is located in the southeastern region of France, ...</text>
  <text x="12" y="148" class="f-label f-muted">me</text>
  <text x="52" y="148" class="f-mono f-ink">What is the capital of Ghana?</text>
  <text x="12" y="170" class="f-label f-muted">bot</text>
  <text x="52" y="170" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="192" class="f-label f-muted">me</text>
  <text x="52" y="192" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="214" class="f-label f-muted">bot</text>
  <text x="52" y="214" class="f-mono f-ink">Yes, it is located in the southeastern region of the Balkan Peninsula.</text>
  <line x1="12" y1="252" x2="628" y2="252" class="f-line"/>
  <text x="12" y="274" class="f-label f-ink">&quot;Yes&quot;: 13 of 13 after a right capital, 87 of 87 after a wrong one</text>
</svg>
<figcaption>The answer to &quot;Are you sure?&quot; is always yes. After the 13 right capitals it never repeats the capital.</figcaption>
</figure>

On capitals DialoGPT mostly answers "I'm sure." in 2 words. BlenderBot 90M says yes less often, 21 times on 100 capitals. Mostly it repeats "I'm not sure, but" again.

## Where the signal is

For every answer I took the average log probability of its tokens under the same model. On capitals the right answers of BlenderBot 400M are more probable than the wrong ones: AUROC 0.77 on 13 right answers against 87 wrong. In the other cases there are 0 to 5 right answers and the AUROC jumps between 0.22 and 0.81, which I do not trust.

This is not new. Mielke and colleagues did it properly in 2020. They checked BlenderBot answers on TriviaQA, found that the model's own internal representations predict when the answer is right and used that to teach the bot when to hedge. Shuster and colleagues showed in 2021 that retrieving passages before answering reduces invented facts. My run repeats a part of it on small models.

## What I take from it

Of my 5 expectations the first held too well. The one about hedges I could not test, there are too few right answers. On capitals all 8 hedged answers of BlenderBot 400M are wrong, but 8 is not a sample. Invented answers to invented things held for both BlenderBots and failed for DialoGPT, which mostly said nothing. The "yes" to "Are you sure?" held exactly for BlenderBot 400M. Probability worked only where there were enough right answers.

"Are you sure?" checks nothing here. A hedge from such a bot I will not read as modesty any more. If I want to know whether the model knows, the only thing that helped was its own probability. Even that worked only on the easy questions.

## What I did not check

- Only small models. I did not run BlenderBot 2.7B and 9.4B or BlenderBot 2.0 with internet search. GPT-3 I did not call.
- Only the default generation, beam search or greedy. Sampling gives other answers.
- I labeled the invented things and the TriviaQA matches alone. TriviaQA answers the matcher did not flag I did not read.
- The list of hedge phrases is mine and may miss some.
- One run. A rerun of 10 questions gave the same 10 answers, so the uncertainty is in the choice of questions.
