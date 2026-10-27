---
title: "I tested prompt tips on GPT-2 and the order of the examples beat all of them"
description: "I ran popular prompt tips on GPT-2 medium and large over 872 SST-2 movie reviews: please, you are an expert, IMPORTANT, a clear instruction. On 10 sets of examples they moved the mean by 1 to 4 points, the plain instruction on medium was 9.5 points worse than none, and the order of the same 4 examples moved accuracy by up to 37 points."
date: 2022-03-25
lang: en
translationKey: prompt-superstition
tags: ["llm", "machine-learning", "statistics"]
---
Since GPT-3 came out, the advice on how to write a prompt keeps growing. Be polite. Tell the model it is an expert. Write IMPORTANT in capitals and ask it to think carefully. Put a clear instruction at the top. Most of this advice comes from someone who tried it once on the API and it worked. There is no second run behind it.

I read these tips and sorted them in my head without measuring anything. Politeness and "you are an expert" I took for superstition. A clear instruction I took for craft, the one part of the prompt that at least cannot hurt. I can't run GPT-3 at home. But the same few shot trick works on GPT-2, so I put both groups on the same task and counted.

## The setup

The task is SST-2 from GLUE: 872 short movie reviews from the dev set, 444 of them positive. A model that says "positive" to everything gets 50.9%.

The prompt starts with an instruction: "Classify the sentiment of each movie review as positive or negative." Then come 4 examples from the training set, 2 positive and 2 negative, as `Review: ...` and `Sentiment: positive`. Then the review to classify. The model does not generate anything. I compare the probability of " positive" and " negative" as the next word, so the same prompt always gives the same number.

The models are GPT-2 medium (355M parameters) and GPT-2 large (774M) in float32, on 4 cores of an AMD EPYC 7713 in a virtual machine. The scoring gives the same predictions on torch 1.11 with transformers 4.17. For medium I ran 217 prompts, for large 99 of them.

I chose 10 sets of 4 examples with a fixed seed. Every variant runs on the same 10 sets, so the change in the prompt is the only difference.

## The tips

<figure class="fig">
<svg viewBox="0 0 640 286" role="img" aria-label="Dot rows, one row per instruction, 10 dots per row for the 10 sets of examples. no instruction: from 50.9 to 84.5, mean 68.8. plain: from 48.9 to 82.1, mean 59.3. please ... thank you: from 49.2 to 85.2, mean 62.8. you are an expert: from 49 to 79.9, mean 60.7. IMPORTANT, think carefully: from 49 to 78.3, mean 60.3. translate into French: from 50.2 to 83.3, mean 65.5. comedy or drama: from 49.4 to 83.3, mean 64.5.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, accuracy on 872 reviews, %</text>
  <circle cx="18" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 dot = 1 set of 4 examples</text>
  <rect x="330" y="29" width="3" height="14" class="f-accent"/>
  <text x="340" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">mean of 10 sets</text>
  <line x1="262.2" y1="54" x2="262.2" y2="262" class="f-plain"/>
  <text x="262.2" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="346.7" y1="54" x2="346.7" y2="262" class="f-plain"/>
  <text x="346.7" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">60</text>
  <line x1="431.1" y1="54" x2="431.1" y2="262" class="f-plain"/>
  <text x="431.1" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="515.6" y1="54" x2="515.6" y2="262" class="f-plain"/>
  <text x="515.6" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">80</text>
  <line x1="600.0" y1="54" x2="600.0" y2="262" class="f-plain"/>
  <text x="600.0" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">90</text>
  <text x="12" y="72" text-anchor="start" class="f-mono f-ink" style="font-size:11px">no instruction</text>
  <circle cx="294.3" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="553.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="526.5" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="553.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="441.2" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="482.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="320.5" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="326.4" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="440.4" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="419.5" y="59" width="3" height="18" class="f-accent"/>
  <text x="12" y="102" text-anchor="start" class="f-mono f-accent" style="font-size:11px">plain</text>
  <circle cx="280.0" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="383.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="323.9" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="533.3" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="252.9" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="342.4" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="365.2" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="302.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="351.7" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="339.3" y="89" width="3" height="18" class="f-accent"/>
  <text x="12" y="132" text-anchor="start" class="f-mono f-ink" style="font-size:11px">please ... thank you</text>
  <circle cx="269.8" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="529.9" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="559.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="255.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="440.4" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="339.9" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="293.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="328.1" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="368.8" y="119" width="3" height="18" class="f-accent"/>
  <text x="12" y="162" text-anchor="start" class="f-mono f-ink" style="font-size:11px">you are an expert</text>
  <circle cx="271.5" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="438.7" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="359.3" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="514.7" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="253.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="353.4" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="317.1" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="329.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="351.1" y="149" width="3" height="18" class="f-accent"/>
  <text x="12" y="192" text-anchor="start" class="f-mono f-ink" style="font-size:11px">IMPORTANT, think carefully</text>
  <circle cx="290.9" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="439.6" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="339.1" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="501.2" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="253.8" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="392.3" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="328.1" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="311.2" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="363.6" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="347.7" y="179" width="3" height="18" class="f-accent"/>
  <text x="12" y="222" text-anchor="start" class="f-mono f-ink" style="font-size:11px">translate into French</text>
  <circle cx="355.1" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="524.0" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="543.4" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="385.5" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.9" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="322.2" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="332.3" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="519.8" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="391.6" y="209" width="3" height="18" class="f-accent"/>
  <text x="12" y="252" text-anchor="start" class="f-mono f-ink" style="font-size:11px">comedy or drama</text>
  <circle cx="297.7" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="535.0" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="424.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="543.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="257.2" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="462.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="394.0" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="301.9" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="356.8" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="383.2" y="239" width="3" height="18" class="f-accent"/>
</svg>
<figcaption>The same 10 sets of examples in every row. Within a row the dots spread over 29 to 36 points, between rows the means differ by 9.5 at most. The plain instruction has the lowest mean.</figcaption>
</figure>

On medium the plain instruction gives 59.3% on average over 10 sets. "Please ... Thank you!" gives 62.8%, "You are an expert film critic." 60.7%, IMPORTANT with "Think carefully and be accurate." 60.3%. Polite is better than plain on 5 sets and worse on 4, which is a coin flip. Capitals are better on 7 and worse on 2, but 10 sets are too few to be sure of that.

But look at the rows of the figure instead of the averages. With the plain instruction the set of examples alone moves the result from 48.9% to 82.1%. That is 33 points from the choice of 4 reviews. The words I was ready to argue about moved the mean by 1 to 4.

## Where I was wrong

The instruction was the part I believed in, so I also ran the prompt without it. Without the instruction medium gets 68.8%, 9.5 points more, better on 8 sets of 10 and worse on 1. Then I tried 2 wrong instructions. "Translate each sentence into French." gives 65.5% and "Classify each movie review by whether it is about a comedy or a drama." gives 64.5%, also more than the right one.

Without examples it is the same. The bare `Review: ... Sentiment:` gives 73.2%, with the plain instruction on top 60.8%, with the polite one 53.9%. With "please" the model answers positive to 97% of reviews.

I spent some time looking for a bug. I checked that the instruction really ends up in the prompt and that both label words are single tokens. The cached prefix also gave the same tokens as the full text. Everything was fine. I don't know why this instruction hurts medium.

## The order of the same 4 examples

<figure class="fig">
<svg viewBox="0 0 640 354" role="img" aria-label="Scatter of 72 points, one per order of the examples. The horizontal axis is the share of reviews the model called positive, the vertical one is accuracy. The 12 orders with labels positive, negative, positive, negative sit together in the corner at 99.2 to 100 percent positive answers and about 51 percent accuracy, the level of answering positive to everything. The other 60 orders spread from 1 to 99 percent positive answers and accuracy is highest when the answers are balanced.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, same 4 examples in 24 orders, 3 sets</text>
  <rect x="14" y="31" width="9" height="9" class="f-accent"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">labels in the order + - + -</text>
  <circle cx="334" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="344" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">any other order</text>
  <line x1="70" y1="74" x2="70" y2="310" class="f-plain"/>
  <text x="70" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="205" y1="74" x2="205" y2="310" class="f-plain"/>
  <text x="205" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <line x1="340" y1="74" x2="340" y2="310" class="f-plain"/>
  <text x="340" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="475" y1="74" x2="475" y2="310" class="f-plain"/>
  <text x="475" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">75</text>
  <line x1="610" y1="74" x2="610" y2="310" class="f-plain"/>
  <text x="610" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <line x1="70" y1="283.8" x2="610" y2="283.8" class="f-plain"/>
  <text x="62" y="287.77777777777777" text-anchor="end" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="70" y1="231.3" x2="610" y2="231.3" class="f-plain"/>
  <text x="62" y="235.33333333333334" text-anchor="end" class="f-mono f-muted" style="font-size:10px">60</text>
  <line x1="70" y1="178.9" x2="610" y2="178.9" class="f-plain"/>
  <text x="62" y="182.88888888888889" text-anchor="end" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="70" y1="126.4" x2="610" y2="126.4" class="f-plain"/>
  <text x="62" y="130.44444444444443" text-anchor="end" class="f-mono f-muted" style="font-size:10px">80</text>
  <line x1="70" y1="74.0" x2="610" y2="74.0" class="f-plain"/>
  <text x="62" y="78" text-anchor="end" class="f-mono f-muted" style="font-size:10px">90</text>
  <text x="340" y="344" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">answered &quot;positive&quot;, % of reviews</text>
  <text x="12" y="66" text-anchor="start" class="f-mono f-muted" style="font-size:11px">accuracy, %</text>
  <line x1="70" y1="279.1" x2="610" y2="279.1" class="f-line" stroke-dasharray="4 3"/>
  <text x="340" y="295.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">&quot;positive&quot; to everything: 50.9</text>
  <circle cx="604.1" cy="272.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="590.0" cy="260.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="387.0" cy="200.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="343.2" cy="207.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="603.0" cy="272.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="594.9" cy="265.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="268.2" cy="160.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.9" cy="171.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="604.1" cy="272.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="348.1" cy="135.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="585.2" cy="257.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="129.4" cy="239.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="528.5" cy="203.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="557.6" cy="229.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="538.2" cy="219.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="231.5" cy="185.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="527.4" cy="206.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="117.0" cy="248.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="513.9" cy="193.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="556.0" cy="227.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="168.8" cy="208.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="309.2" cy="177.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="423.2" cy="205.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="151.5" cy="217.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="478.8" cy="167.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="522.0" cy="204.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="318.9" cy="170.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="161.8" cy="228.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="247.7" cy="153.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="539.3" cy="215.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="550.1" cy="225.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="540.9" cy="235.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="538.7" cy="221.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="527.4" cy="205.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="243.9" cy="137.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="360.5" cy="102.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="147.8" cy="219.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="297.3" cy="156.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="75.9" cy="282.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="607.3" cy="276.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="119.7" cy="245.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="458.8" cy="173.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="455.0" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="446.9" cy="137.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="315.2" cy="132.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="313.0" cy="115.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="507.9" cy="188.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="230.4" cy="188.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="314.6" cy="123.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="448.5" cy="156.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="448.0" cy="149.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="436.7" cy="134.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="75.4" cy="283.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="147.2" cy="226.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.3" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="117.5" cy="244.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="542.5" cy="217.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="457.7" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="428.6" cy="139.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="110.5" cy="255.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="603.9" y="272.5" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="601.2" y="271.4" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.0" y="274.0" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.0" y="274.0" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="602.8" y="271.9" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="602.3" y="271.4" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <text x="593.8" y="301.6088888888889" text-anchor="end" class="f-mono f-accent" style="font-size:11px">all 12 orders + - + -</text>
  <line x1="595.96" y1="298.4622222222222" x2="605.68" y2="285.87555555555554" class="f-line"/>
</svg>
<figcaption>Accuracy is high only where the model splits its answers about evenly. The 12 orders where the labels alternate starting with positive all end in the same corner.</figcaption>
</figure>

For 3 of the sets I ran all 24 orders of the same 4 examples, not a word changed. On set 0 the accuracy goes from 50.9% to 78.3%, on set 1 from 50.2% to 84.5%, on set 2 from 50.1% to 82.1%. Zhao and colleagues showed this on GPT-3 last year. Lu and colleagues did it on GPT-2 with exactly this design, SST-2 and all 24 orders of 4 examples, so it is not new. But I did not expect it to be bigger than everything else in my grid.

The bad orders are not random. There are 12 orders with the labels `+ - + -` over the 3 sets. In all of them the model answers "positive" to 99.2% or more of the reviews and the accuracy is 50.9% to 51.5%. It looks like the model continues the pattern of the labels instead of reading the review. The mirror order `- + - +` is not so clean, there the share of positive answers goes from 1.0% to 51.5%.

## GPT-2 large

On large my story about the instruction fell apart. With 4 examples the wording hardly matters. Polite is 1.3 points above plain and no instruction 0.6 below. The 2 wrong instructions are now a bit worse than plain, French by 2.4 points and lower on 8 sets of 10. So the previous section belongs to medium only. The set of examples still moves the plain prompt from 53.6% to 87.6%.

I had time only for the 24 orders of set 0 on large. They go from 51.6% to 88.3%, but a different order breaks it. `+ - + -` is fine here, 75.0% to 88.3%. Large breaks when the last 2 examples have the same label. After `+ + - -` it answers positive to only 2.5% to 5.2% of reviews, after `- - + +` to 87.4% to 96.7%. Zhao and colleagues call this recency bias, the model leans to the label it saw last. It fits large only: on medium `+ - + -` ends with a negative example and the model still says positive.

<figure class="fig">
<svg viewBox="0 0 640 258" role="img" aria-label="Two dot panels, one row per order of labels in the 4 examples, 4 orders per row. Left panel accuracy, right panel share of reviews answered positive. + - + -: accuracy 75 to 88.3, positive 44 to 74.5. - + - +: accuracy 83.4 to 85.3, positive 50.2 to 61.4. - + + -: accuracy 85.2 to 87.7, positive 46 to 52.6. + - - +: accuracy 65.6 to 81.3, positive 67.5 to 84.6. - - + +: accuracy 54.2 to 63.5, positive 87.4 to 96.7. + + - -: accuracy 51.6 to 54.2, positive 2.5 to 5.2.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 large, set 0, 24 orders by the labels of the examples</text>
  <text x="240" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">accuracy, %</text>
  <text x="490" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">answered &quot;positive&quot;, %</text>
  <line x1="162.2" y1="56" x2="162.2" y2="234" class="f-plain"/>
  <text x="162.2" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="251.1" y1="56" x2="251.1" y2="234" class="f-plain"/>
  <text x="251.1" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="340.0" y1="56" x2="340.0" y2="234" class="f-plain"/>
  <text x="340.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">90</text>
  <line x1="390" y1="56" x2="390" y2="234" class="f-plain"/>
  <text x="390" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="490" y1="56" x2="490" y2="234" class="f-plain"/>
  <text x="490" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="590" y1="56" x2="590" y2="234" class="f-plain"/>
  <text x="590" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="12" y="70" text-anchor="start" class="f-mono f-ink" style="font-size:12px">+ - + -</text>
  <circle cx="273.3" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="539.0" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="325.3" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="509.2" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="332.4" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="505.6" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="327.6" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="478.0" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="100" text-anchor="start" class="f-mono f-ink" style="font-size:12px">- + - +</text>
  <circle cx="318.2" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="490.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="316.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="493.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="310.7" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="512.8" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="319.1" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="503.8" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="130" text-anchor="start" class="f-mono f-ink" style="font-size:12px">- + + -</text>
  <circle cx="324.0" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="495.2" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="329.8" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="493.4" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="324.4" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="486.8" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="318.7" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="482.0" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="160" text-anchor="start" class="f-mono f-ink" style="font-size:12px">+ - - +</text>
  <circle cx="232.4" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="558.8" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="231.6" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="559.2" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="301.3" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="525.0" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="287.6" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="531.8" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="190" text-anchor="start" class="f-mono f-accent" style="font-size:12px">- - + +</text>
  <circle cx="214.7" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="568.2" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="222.2" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="564.8" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="180.9" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="583.4" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="184.4" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="581.8" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <text x="12" y="220" text-anchor="start" class="f-mono f-accent" style="font-size:12px">+ + - -</text>
  <circle cx="178.2" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="399.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="169.3" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="395.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="180.9" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="400.4" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="171.6" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="396.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
</svg>
<figcaption>When the last 2 examples have the same label, large gives that label to most reviews. The alternating order starting with positive, which broke medium, is fine here.</figcaption>
</figure>

Without examples the wording matters on large a lot. The bare prompt gets 86.4%, polite 84.1%, capitals 78.7%, plain 71.9%, expert 68.6%. On medium polite was 6.9 points worse than plain. On large it is 12.2 points better. But every zero shot number is 1 prompt with no sets behind it. I can't say how much of these 18 points is the wording and how much is this exact sentence. That bare prompt at 86.4% is also above every variant with 4 examples on large, where the best mean is 65.8%.

## What else moved the number

The label words matter more than the polite words. With "good" and "bad" medium gets 68.4%, with "A" and "B" 49.0%, below answering positive to everything.

Calibration helps medium a little and large more. Zhao and colleagues ask the model about an empty input like "N/A" and divide the answer probabilities by what it says there. With the plain instruction this moves medium from 59.3% to 62.0% and large from 64.5% to 72.0%, better on 7 sets of 10 for both. On the zero shot prompt of medium it goes the other way, from 60.8% to 55.4%. After the correction the model says positive only to 7.7% of reviews.

Random labels in the examples cost medium 4.2 points, close to what Min and colleagues reported last month for bigger models. Flipped labels cost 6.7, but medium does not learn to flip from them. It just says positive more often, 89% of the time.

## What I did not check

- GPT-3 itself. Bigger models may well read the instruction better.
- Other tasks. Movie review sentiment is the easiest case. On a task where the model needs the instruction to know what to do, removing it would probably hurt.
- More sets. 10 sets show a spread of 33 points, but a difference of 3 between wordings stays inside the noise. Polite could be 2 points better in reality and I would not see it.

For small models I will now try a few orders of the examples before I touch any wording. And I don't take the instruction for the safe part anymore, even if on large it was only neutral.
