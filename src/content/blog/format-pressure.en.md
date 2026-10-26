---
title: "I added \"none of the above\" and the model refused as often as before, but a third of the questions switched"
description: "UnifiedQA T5 large answers 300 SQuAD 2.0 questions that the paragraph does not answer, in 4 formats. A list without an exit refuses 11 times and picks the lure 177 times. With \"none of the above\" it refuses 134 times against 133 in free text, but 103 of the 300 questions switch between refusal and an invented answer."
date: 2022-04-16
lang: en
translationKey: format-pressure
tags: ["llm", "machine-learning", "reliability"]
---
When a model has to pick its answer from a fixed list, it cannot say that it does not know. This is the usual explanation for why a strict answer format makes a model invent things. I agreed with it without much thought. The usual fix is one more option, "none of the above". For me the question was closed with that. I had never measured how much honesty this option gives back, so I measured it.

## The setup

For a fair comparison I needed a model that can refuse in its own format. UnifiedQA from AI2 fits: it is T5 trained on many question answering sets in different formats, SQuAD 2.0 among them. SQuAD 2.0 has questions that the paragraph does not answer and the model is trained to write `no answer>` on them. The bracket is on one side only because T5's vocabulary has no `<`.

I took UnifiedQA T5 large, about 740M parameters. From the SQuAD 2.0 dev set I chose 300 questions with an answer and 300 without, with seed 2022. Every question goes to the model 4 times with the same paragraph:

1. free: question and paragraph, the format the model was trained on for SQuAD;
2. a list of 3 options and no way out;
3. the same 3 options plus "(d) none of the above";
4. the same 3 options plus "(d) no answer>", the same text that the model writes when it refuses.

The options come from the SQuAD annotation. For a question with an answer it is the right answer and 2 answers to other questions about the same paragraph. For a question without an answer SQuAD 2.0 keeps a "plausible answer", a piece of the paragraph that looks like the answer. It takes the place of the right one, so every list for a question without an answer holds a lure.

It ran on 4 CPU cores of a virtual machine, Python 3.9, torch 1.11, transformers 4.18, greedy decoding, about 3 seconds per question. The weights are 3 GB in float32 and transformers 4.18 loads the whole file next to the model, more than my 5 GiB limit allows. So I cut the weights into 16 parts and build the model from its config.

Before the run I wrote down what I expected. Free format refuses on more than half of the questions without an answer. The list with "none of the above" refuses less than half as often as free format.

## No way out

The list without an exit did what I expected. On 300 questions without an answer the model picked the lure 177 times and something else 112 times. 11 times it wrote `no answer>`, although that was not one of the options. I like these 11 most. The model broke my format to say the truth.

## With a way out

Free format refused 133 times out of 300. That is 44%. My first expectation was already wrong. Even in the format it was trained on, the model invents an answer for more than half of the questions it should refuse. 101 of these answers are close to the lure.

The list with "none of the above" refused 134 times, one more than free format. This is the outcome I had written down as the one that would refute my idea. So with an exit the list refuses as often as free text. The 177 lures came from the list without one.

With "no answer>" as option (d) the model refused 152 times. That is more than with "none of the above" and on paired answers the difference holds (McNemar, p = 0.013). Against free format it is 152 to 133 with p = 0.059 and I would not call that a result.

<figure class="fig">
<svg viewBox="0 0 640 186" role="img" aria-label="Stacked bars, 300 questions without an answer each. free: refuses 133, lure 101, other answer 66. list, no exit: refuses 11, lure 177, other answer 112. + none of the above: refuses 134, lure 120, other answer 46. + no answer&gt;: refuses 152, lure 113, other answer 35.">
  <text x="12" y="18" class="f-label f-muted">300 questions without an answer, UnifiedQA T5 large</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain" stroke-width="1"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">refuses</text>
  <rect x="172" y="31" width="12" height="10" class="f-accent"/>
  <text x="190" y="40" class="f-mono f-ink" style="font-size:11px">picks the lure</text>
  <rect x="352" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="40" class="f-mono f-ink" style="font-size:11px">other answer</text>
  <text x="12" y="77" class="f-mono f-ink" style="font-size:11px">free</text>
  <rect x="190" y="66" width="146" height="14" class="f-plain"/>
  <rect x="336" y="66" width="111" height="14" class="f-accent"/>
  <rect x="447" y="66" width="73" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="77" class="f-mono f-ink" style="font-size:11px">133/101/66</text>
  <text x="12" y="107" class="f-mono f-ink" style="font-size:11px">list, no exit</text>
  <rect x="190" y="96" width="12" height="14" class="f-plain"/>
  <rect x="202" y="96" width="195" height="14" class="f-accent"/>
  <rect x="397" y="96" width="123" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="107" class="f-mono f-ink" style="font-size:11px">11/177/112</text>
  <text x="12" y="137" class="f-mono f-ink" style="font-size:11px">+ none of the above</text>
  <rect x="190" y="126" width="147" height="14" class="f-plain"/>
  <rect x="337" y="126" width="132" height="14" class="f-accent"/>
  <rect x="469" y="126" width="51" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="137" class="f-mono f-ink" style="font-size:11px">134/120/46</text>
  <text x="12" y="167" class="f-mono f-ink" style="font-size:11px">+ no answer&gt;</text>
  <rect x="190" y="156" width="167" height="14" class="f-plain"/>
  <rect x="357" y="156" width="124" height="14" class="f-accent"/>
  <rect x="481" y="156" width="39" height="14" class="f-muted" fill-opacity="0.55"/>
  <text x="530" y="167" class="f-mono f-ink" style="font-size:11px">152/113/35</text>
</svg>
<figcaption>Without an exit the model refuses 11 times by writing a string that is not in the list. With an exit it refuses about as often as in free format.</figcaption>
</figure>

## Where the totals hide something

Then I compared the answers question by question and the equal totals fell apart. Free format and the list with "none of the above" agree on refusal for 82 questions and both invent an answer for 115. On 51 questions only free format refuses, on 52 only the list. So 103 of 300 questions switch between refusal and an invented answer. The totals are equal only because 51 go one way and 52 the other.

Here are 2 examples from the run. "In what country does the Danube empty?" The paragraph is about the Rhine, which empties into the North Sea in the Netherlands. The Danube appears there only as a longer river. Free format answers `no answer>`, all 3 lists answer "the netherlands". "When did the Archduke Sigismund of Austria die?" The paragraph says that he sold Alsace to Burgundy in 1469. Free format and the list without an exit answer "1469", both lists with an exit refuse.

<figure class="fig">
<svg viewBox="0 0 640 252" role="img" aria-label="Question 1, In what country does the Danube empty, the paragraph is about the Rhine: free format refuses, the list without an exit answers the netherlands, the list with none of the above answers the netherlands, the list with no answer&gt; answers the netherlands. Question 2, When did the Archduke Sigismund of Austria die, the paragraph says he sold Alsace in 1469: free format answers 1469, the list without an exit answers 1469, the list with none of the above refuses, the list with no answer&gt; refuses.">
  <text x="12" y="18" class="f-label f-muted">2 questions the paragraph does not answer, 4 answer formats</text>
  <text x="12" y="44" class="f-mono f-muted" style="font-size:11px">free</text>
  <text x="168" y="44" class="f-mono f-muted" style="font-size:11px">list, no exit</text>
  <text x="324" y="44" class="f-mono f-muted" style="font-size:11px">+ none of the above</text>
  <text x="480" y="44" class="f-mono f-muted" style="font-size:11px">+ no answer&gt;</text>
  <text x="12" y="74" class="f-mono f-ink" style="font-size:12px">In what country does the Danube empty?</text>
  <text x="12" y="90" class="f-mono f-muted" style="font-size:10px">the paragraph is about the Rhine</text>
  <rect x="12" y="100" width="148" height="26" rx="3" class="f-plain"/>
  <text x="18" y="117" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="168" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="324" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="330" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <rect x="480" y="100" width="148" height="26" rx="3" class="f-box"/>
  <text x="486" y="117" class="f-mono f-accent" style="font-size:11px">the netherlands</text>
  <text x="12" y="166" class="f-mono f-ink" style="font-size:12px">When did the Archduke Sigismund of Austria die?</text>
  <text x="12" y="182" class="f-mono f-muted" style="font-size:10px">the paragraph: he sold Alsace in 1469</text>
  <rect x="12" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="18" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="168" y="192" width="148" height="26" rx="3" class="f-box"/>
  <text x="174" y="209" class="f-mono f-accent" style="font-size:11px">1469</text>
  <rect x="324" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="330" y="209" class="f-mono f-ink" style="font-size:11px">none of the above</text>
  <rect x="480" y="192" width="148" height="26" rx="3" class="f-plain"/>
  <text x="486" y="209" class="f-mono f-ink" style="font-size:11px">no answer&gt;</text>
  <rect x="12" y="232" width="12" height="10" class="f-plain"/>
  <text x="30" y="241" class="f-mono f-ink" style="font-size:10px">refusal</text>
  <rect x="120" y="232" width="12" height="10" class="f-box"/>
  <text x="138" y="241" class="f-mono f-ink" style="font-size:10px">invented answer</text>
</svg>
<figcaption>The same model, the same paragraph for each question. Free format refuses the Danube question and answers 1469 to the second. Both lists with an exit do the reverse.</figcaption>
</figure>

I was not sure whether 103 says anything about format or only shows how greedy decoding jumps on any change of input. So I compared the 2 lists with an exit, which differ in one phrase of option (d). They disagree on 48 questions. This is not a clean measure of noise, because these 2 lists also refuse at different rates. And the change from free text to a list is a bigger edit than one phrase. Still, 103 against 48 tells me that the format moves more than the noise does.

<figure class="fig">
<svg viewBox="0 0 640 198" role="img" aria-label="2 bars of 300 questions without an answer. Free format against the list with none of the above: both refuse 82, both answer 115, only free refuses 51, only the list refuses 52, 103 differ. The list with none of the above against the list with no answer&gt;: both refuse 119, both answer 133, only the first refuses 15, only the second refuses 33, 48 differ.">
  <text x="12" y="18" class="f-label f-muted">the same 300 questions, answer by answer</text>
  <rect x="12" y="31" width="12" height="10" class="f-plain"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:10px">both refuse</text>
  <rect x="212" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="230" y="40" class="f-mono f-ink" style="font-size:10px">both answer</text>
  <rect x="12" y="47" width="12" height="10" class="f-accent"/>
  <text x="30" y="56" class="f-mono f-ink" style="font-size:10px">only the first refuses</text>
  <rect x="212" y="47" width="12" height="10" class="f-accent" fill-opacity="0.6"/>
  <text x="230" y="56" class="f-mono f-ink" style="font-size:10px">only the second refuses</text>
  <text x="12" y="84" class="f-mono f-ink" style="font-size:11px">free against + none of the above</text>
  <rect x="12" y="90" width="131" height="16" class="f-plain"/>
  <text x="16" y="102" class="f-mono f-ink" style="font-size:10px">82</text>
  <rect x="143" y="90" width="184" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="147" y="102" class="f-mono f-ink" style="font-size:10px">115</text>
  <rect x="327" y="90" width="82" height="16" class="f-accent"/>
  <text x="331" y="102" class="f-mono f-ink" style="font-size:10px">51</text>
  <rect x="409" y="90" width="83" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="413" y="102" class="f-mono f-ink" style="font-size:10px">52</text>
  <text x="500" y="102" class="f-mono f-accent" style="font-size:11px">103 differ</text>
  <text x="12" y="142" class="f-mono f-ink" style="font-size:11px">+ none of the above against + no answer&gt;</text>
  <rect x="12" y="148" width="190" height="16" class="f-plain"/>
  <text x="16" y="160" class="f-mono f-ink" style="font-size:10px">119</text>
  <rect x="202" y="148" width="213" height="16" class="f-muted" fill-opacity="0.55"/>
  <text x="206" y="160" class="f-mono f-ink" style="font-size:10px">133</text>
  <rect x="415" y="148" width="24" height="16" class="f-accent"/>
  <text x="419" y="160" class="f-mono f-ink" style="font-size:10px">15</text>
  <rect x="439" y="148" width="53" height="16" class="f-accent" fill-opacity="0.6"/>
  <text x="443" y="160" class="f-mono f-ink" style="font-size:10px">33</text>
  <text x="500" y="160" class="f-mono f-accent" style="font-size:11px">48 differ</text>
</svg>
<figcaption>Changing the format moves 103 questions, changing one phrase of option (d) moves 48.</figcaption>
</figure>

## What the exit costs

On 300 questions with an answer free format is right 281 times and the list without an exit 282. With an exit it is 273 right with "none of the above" and 275 with "no answer>". With "none of the above" the model refused 13 questions that free format answered, the reverse happened once.

Over all 600 questions, 23 answers in the list without an exit matched no option and 15 in each list with an exit. Most of them are the right option or the lure with a piece missing. Either my limit of 24 output tokens cut them or a character like `ł` was missing from the vocabulary. I count them as answers. They do not move the refusals and lower the right answers by a few in each list.

## What I take from it

If I count only totals, "none of the above" bought back all the honesty here. But a refusal rate measured in one format no longer tells me much about another one. If I check a sample of answers in one format and then ship a different format, a third of the questions without an answer may behave differently. My check would not see it.

Here "no answer>" worked better than "none of the above" and I can only guess why. It looks like the model's own refusal, but the model learned it from `<no answer>`, which is split into other tokens than my option. Which wording to use I would test on my own data.

## What I did not check

- One model. UnifiedQA learned to refuse on SQuAD 2.0, so it has a refusal to give. A model without such training, GPT-3 for example, I did not call.
- One order of options per question. Shuffling the options is also a change of input and I do not know how many questions it moves.
- Every list for a question without an answer had the lure in it. Without the plausible answer among the options a refusal may come easier.
- Greedy decoding and one full run. A repeat of 8 questions in all 4 formats gave the same 32 answers, so the uncertainty is in the choice of 300 questions.
- The input limit of 512 tokens. For 6 to 12 questions per format the end of the paragraph was cut.
- Questions that annotators wrote to look answerable. Real users ask in a different way.
