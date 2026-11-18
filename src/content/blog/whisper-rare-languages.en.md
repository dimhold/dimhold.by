---
title: "Whisper took no Belarusian sentence for Belarusian and wrote Georgian in other alphabets"
description: "Whisper at its 25 September commit on the same 100 FLEURS sentences in 7 languages from English to Georgian. In automatic mode none of the 3 small models took a single Belarusian sentence for Belarusian. With the language set, base still writes Russian spelling and never writes ў, small gets to 78.1% wrong words. Georgian was mostly recognised, but no model wrote a single Georgian letter, it wrote Latin, Armenian or Chinese instead. Russian and Polish hold with small, Ukrainian too if the language is set."
date: 2022-10-02
lang: en
translationKey: whisper-rare-languages
tags: ["machine-learning", "text"]
---
This blog goes out in English, Russian and Belarusian, so when Whisper came out on 21 September, the first thing I looked for in its list of 99 languages was Belarusian. It is there, Georgian too. Then I opened figure 11 of the paper, which gives the hours behind each language. Of 680,000 hours of training audio, 2.4 hours are transcribed Belarusian, while Russian has 9761. Georgian has 0.6, close to the bottom of the figure. There are also 133 hours of Belarusian speech that the model learned to translate into English, but for writing Belarusian text it has 2.4. I wanted to see what that buys in the output itself and not only as a word error rate.

## The test

Google published FLEURS in May. It is one set of sentences read aloud in 102 languages, so the content is equal and only the language changes. I took 7 languages, from English with 438,218 hours down to Georgian with 0.6. 307 sentences are in the test part of all 7. I picked 100 of them with a fixed seed, so every language reads the same 100.

Whisper is at commit `5d8d3e7` of 25 September, on PyTorch 1.12.1, called from Python through `transcribe()`. It runs on a virtual machine with 4 cores of an AMD EPYC 7713 and no GPU. The text goes through the normalizers that Whisper ships for its own scores. tiny ran on all 100 sentences. base and small are slower, small spends 218 seconds per minute of English audio here. They got only the first 50 and the first 30.

My first run used the defaults of `transcribe()` and I did not read what they do before starting it. When a result looks bad, it decodes the same 30 second window again with more randomness, up to 6 attempts. The first 2 Lithuanian sentences took tiny 40 and 89 seconds, which meant days for base and small. I stopped and switched to plain greedy decoding. By then tiny with the defaults had done 400 sentences in the first 4 languages, enough to compare. English was worse with the retries, 22.4% wrong words against 17.0% and almost all of the difference is 1 sentence. Greedy misheard its last words and was done in 5 seconds. The retries spent 22 seconds and ended the same sentence with `Week 2-2-3-3-3-4-6-5-6-6`, then kept counting for another 200 characters.

The paper does not say how its table of all languages was decoded. But its English column is the same as in the table marked beam search. My greedy numbers are higher almost everywhere. For English the paper also gives greedy numbers and there tiny makes 13.7% against my 17.0% on 100 sentences. Down to Ukrainian the order of languages is the same as in the paper. The figure uses the first 30 sentences, the ones all 3 models ran.

<figure class="fig">
<svg viewBox="0 0 640 408" role="img" aria-label="Horizontal bars of the share of wrong words for Whisper tiny, base and small on the same 30 FLEURS sentences in 7 languages, ordered by hours of transcribed training audio. English, 438,218 hours: tiny 16.9%, base 12.6%, small 8.7%. Russian, 9761 hours: tiny 42.3%, base 30.1%, small 15.7%. Polish, 4278 hours: tiny 56.8%, base 32.0%, small 17.6%. Ukrainian, 697 hours: tiny 62.3%, base 46.8%, small 21.3%. Lithuanian, 67 hours: tiny 101.3%, base 94.0%, small 71.5%. Belarusian, 2.4 hours: tiny 137.2%, base 95.6%, small 78.1%. Georgian, 0.6 hours: tiny 175.7%, base 191.9%, small 113.3%. Bars are cut at 120%.">
<text x="12" y="18" class="f-label f-muted">Wrong words, %, the same 30 sentences in every language</text>
<text x="12" y="34" class="f-label f-muted">hours of transcribed training audio after the name</text>
<rect x="200" y="40" width="10" height="9" class="f-muted"/>
<text x="216" y="48" class="f-label f-ink">tiny</text>
<rect x="290" y="40" width="10" height="9" class="f-ink"/>
<text x="306" y="48" class="f-label f-ink">base</text>
<rect x="380" y="40" width="10" height="9" class="f-accent"/>
<text x="396" y="48" class="f-label f-ink">small</text>
<line x1="483.33333333333337" y1="52" x2="483.33333333333337" y2="370" class="f-line"/>
<text x="483.33333333333337" y="384" class="f-label f-muted" text-anchor="middle">100%</text>
<text x="12" y="74" class="f-label f-ink">English</text>
<text x="12" y="87" class="f-label f-muted">438,218 h</text>
<rect x="200" y="56" width="47.9" height="9" class="f-muted"/>
<text x="253.9" y="64" class="f-label f-ink">16.9%</text>
<rect x="200" y="68" width="35.7" height="9" class="f-ink"/>
<text x="241.7" y="76" class="f-label f-ink">12.6%</text>
<rect x="200" y="80" width="24.6" height="9" class="f-accent"/>
<text x="230.7" y="88" class="f-label f-ink">8.7%</text>
<text x="12" y="120" class="f-label f-ink">Russian</text>
<text x="12" y="133" class="f-label f-muted">9761 h</text>
<rect x="200" y="102" width="119.8" height="9" class="f-muted"/>
<text x="325.9" y="110" class="f-label f-ink">42.3%</text>
<rect x="200" y="114" width="85.3" height="9" class="f-ink"/>
<text x="291.3" y="122" class="f-label f-ink">30.1%</text>
<rect x="200" y="126" width="44.5" height="9" class="f-accent"/>
<text x="250.5" y="134" class="f-label f-ink">15.7%</text>
<text x="12" y="166" class="f-label f-ink">Polish</text>
<text x="12" y="179" class="f-label f-muted">4278 h</text>
<rect x="200" y="148" width="160.9" height="9" class="f-muted"/>
<text x="366.9" y="156" class="f-label f-ink">56.8%</text>
<rect x="200" y="160" width="90.7" height="9" class="f-ink"/>
<text x="296.7" y="168" class="f-label f-ink">32.0%</text>
<rect x="200" y="172" width="49.9" height="9" class="f-accent"/>
<text x="255.9" y="180" class="f-label f-ink">17.6%</text>
<text x="12" y="212" class="f-label f-ink">Ukrainian</text>
<text x="12" y="225" class="f-label f-muted">697 h</text>
<rect x="200" y="194" width="176.5" height="9" class="f-muted"/>
<text x="382.5" y="202" class="f-label f-ink">62.3%</text>
<rect x="200" y="206" width="132.6" height="9" class="f-ink"/>
<text x="338.6" y="214" class="f-label f-ink">46.8%</text>
<rect x="200" y="218" width="60.4" height="9" class="f-accent"/>
<text x="266.4" y="226" class="f-label f-ink">21.3%</text>
<text x="12" y="258" class="f-label f-ink">Lithuanian</text>
<text x="12" y="271" class="f-label f-muted">67 h</text>
<rect x="200" y="240" width="287.0" height="9" class="f-muted"/>
<text x="493.0" y="248" class="f-label f-ink">101.3%</text>
<rect x="200" y="252" width="266.3" height="9" class="f-ink"/>
<text x="472.3" y="260" class="f-label f-ink">94.0%</text>
<rect x="200" y="264" width="202.6" height="9" class="f-accent"/>
<text x="408.6" y="272" class="f-label f-ink">71.5%</text>
<text x="12" y="304" class="f-label f-ink">Belarusian</text>
<text x="12" y="317" class="f-label f-muted">2.4 h</text>
<rect x="200" y="286" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="294" class="f-label f-ink">&gt; 137.2%</text>
<rect x="200" y="298" width="270.9" height="9" class="f-ink"/>
<text x="476.9" y="306" class="f-label f-ink">95.6%</text>
<rect x="200" y="310" width="221.3" height="9" class="f-accent"/>
<text x="427.3" y="318" class="f-label f-ink">78.1%</text>
<text x="12" y="350" class="f-label f-ink">Georgian</text>
<text x="12" y="363" class="f-label f-muted">0.6 h</text>
<rect x="200" y="332" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="340" class="f-label f-ink">&gt; 175.7%</text>
<rect x="200" y="344" width="340.0" height="9" class="f-ink"/>
<text x="546.0" y="352" class="f-label f-ink">&gt; 191.9%</text>
<rect x="200" y="356" width="321.0" height="9" class="f-accent"/>
<text x="527.0" y="364" class="f-label f-ink">113.3%</text>
</svg>
<figcaption>Down to Ukrainian every size step helps. Below 100 hours tiny and base are at 94% or worse, small has 71.5% and 78.1% and Georgian is over 100% for all 3 because of loops.</figcaption>
</figure>

## Where it holds

On those 30 sentences small makes 15.7% wrong words in Russian and 17.6% in Polish. Character error rate in Russian is 4.7%, so most wrong words are close to the right ones.

Ukrainian holds with small. For the smaller models it matters to set the language. In automatic mode tiny took 21 of 100 Ukrainian sentences for Russian and base 9 of 50. Then it simply writes in Russian, `Начальник полиции` where the speaker said "Начальник поліції". With `language="uk"` tiny makes 59.7% wrong words, without it 72.1%. The README suggests setting the language for speech other than English and for Ukrainian this is worth doing.

## Belarusian

Before the run I wrote down that more than 30% of the Belarusian sentences would be taken for Russian. I did not expect that none of them would be taken for Belarusian, by any of the 3 models. The best chance it ever gave Belarusian was 7.7%, in base. tiny and base answered Russian or Ukrainian, about 2 to 1, small answered Russian every time.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Strips of cells, one per Belarusian FLEURS sentence, coloured by the language Whisper detected. tiny, 100 sentences: Russian 66, Ukrainian 32, Polish 2. Highest probability for Belarusian 3.6%. base, 50 sentences: Russian 32, Ukrainian 16, Polish 2. Highest probability for Belarusian 7.7%. small, 30 sentences: Russian 30. Highest probability for Belarusian 4.1%.">
<text x="12" y="18" class="f-label f-muted">Language Whisper chose for Belarusian sentences, one cell per sentence</text>
<rect x="12" y="30" width="10" height="10" class="f-ink"/>
<text x="28" y="39" class="f-label f-ink">Russian</text>
<rect x="142" y="30" width="10" height="10" class="f-muted"/>
<text x="158" y="39" class="f-label f-ink">Ukrainian</text>
<rect x="272" y="30" width="10" height="10" class="f-box"/>
<text x="288" y="39" class="f-label f-ink">Polish</text>
<rect x="402" y="30" width="10" height="10" class="f-accent"/>
<text x="418" y="39" class="f-label f-ink">Belarusian</text>
<text x="12" y="72" class="f-label f-ink">tiny</text>
<rect x="60" y="62" width="9" height="12" class="f-ink"/>
<rect x="71" y="62" width="9" height="12" class="f-ink"/>
<rect x="82" y="62" width="9" height="12" class="f-ink"/>
<rect x="93" y="62" width="9" height="12" class="f-ink"/>
<rect x="104" y="62" width="9" height="12" class="f-ink"/>
<rect x="115" y="62" width="9" height="12" class="f-muted"/>
<rect x="126" y="62" width="9" height="12" class="f-muted"/>
<rect x="137" y="62" width="9" height="12" class="f-muted"/>
<rect x="148" y="62" width="9" height="12" class="f-ink"/>
<rect x="159" y="62" width="9" height="12" class="f-ink"/>
<rect x="170" y="62" width="9" height="12" class="f-muted"/>
<rect x="181" y="62" width="9" height="12" class="f-ink"/>
<rect x="192" y="62" width="9" height="12" class="f-ink"/>
<rect x="203" y="62" width="9" height="12" class="f-ink"/>
<rect x="214" y="62" width="9" height="12" class="f-ink"/>
<rect x="225" y="62" width="9" height="12" class="f-ink"/>
<rect x="236" y="62" width="9" height="12" class="f-box"/>
<rect x="247" y="62" width="9" height="12" class="f-muted"/>
<rect x="258" y="62" width="9" height="12" class="f-muted"/>
<rect x="269" y="62" width="9" height="12" class="f-ink"/>
<rect x="280" y="62" width="9" height="12" class="f-ink"/>
<rect x="291" y="62" width="9" height="12" class="f-muted"/>
<rect x="302" y="62" width="9" height="12" class="f-muted"/>
<rect x="313" y="62" width="9" height="12" class="f-ink"/>
<rect x="324" y="62" width="9" height="12" class="f-ink"/>
<rect x="335" y="62" width="9" height="12" class="f-muted"/>
<rect x="346" y="62" width="9" height="12" class="f-ink"/>
<rect x="357" y="62" width="9" height="12" class="f-ink"/>
<rect x="368" y="62" width="9" height="12" class="f-muted"/>
<rect x="379" y="62" width="9" height="12" class="f-ink"/>
<rect x="390" y="62" width="9" height="12" class="f-ink"/>
<rect x="401" y="62" width="9" height="12" class="f-ink"/>
<rect x="412" y="62" width="9" height="12" class="f-muted"/>
<rect x="423" y="62" width="9" height="12" class="f-muted"/>
<rect x="434" y="62" width="9" height="12" class="f-ink"/>
<rect x="445" y="62" width="9" height="12" class="f-ink"/>
<rect x="456" y="62" width="9" height="12" class="f-ink"/>
<rect x="467" y="62" width="9" height="12" class="f-ink"/>
<rect x="478" y="62" width="9" height="12" class="f-muted"/>
<rect x="489" y="62" width="9" height="12" class="f-ink"/>
<rect x="500" y="62" width="9" height="12" class="f-ink"/>
<rect x="511" y="62" width="9" height="12" class="f-ink"/>
<rect x="522" y="62" width="9" height="12" class="f-ink"/>
<rect x="533" y="62" width="9" height="12" class="f-ink"/>
<rect x="544" y="62" width="9" height="12" class="f-ink"/>
<rect x="555" y="62" width="9" height="12" class="f-ink"/>
<rect x="566" y="62" width="9" height="12" class="f-ink"/>
<rect x="577" y="62" width="9" height="12" class="f-ink"/>
<rect x="588" y="62" width="9" height="12" class="f-muted"/>
<rect x="599" y="62" width="9" height="12" class="f-muted"/>
<rect x="60" y="76" width="9" height="12" class="f-ink"/>
<rect x="71" y="76" width="9" height="12" class="f-ink"/>
<rect x="82" y="76" width="9" height="12" class="f-ink"/>
<rect x="93" y="76" width="9" height="12" class="f-muted"/>
<rect x="104" y="76" width="9" height="12" class="f-ink"/>
<rect x="115" y="76" width="9" height="12" class="f-ink"/>
<rect x="126" y="76" width="9" height="12" class="f-ink"/>
<rect x="137" y="76" width="9" height="12" class="f-ink"/>
<rect x="148" y="76" width="9" height="12" class="f-muted"/>
<rect x="159" y="76" width="9" height="12" class="f-muted"/>
<rect x="170" y="76" width="9" height="12" class="f-ink"/>
<rect x="181" y="76" width="9" height="12" class="f-ink"/>
<rect x="192" y="76" width="9" height="12" class="f-ink"/>
<rect x="203" y="76" width="9" height="12" class="f-muted"/>
<rect x="214" y="76" width="9" height="12" class="f-ink"/>
<rect x="225" y="76" width="9" height="12" class="f-ink"/>
<rect x="236" y="76" width="9" height="12" class="f-muted"/>
<rect x="247" y="76" width="9" height="12" class="f-ink"/>
<rect x="258" y="76" width="9" height="12" class="f-muted"/>
<rect x="269" y="76" width="9" height="12" class="f-muted"/>
<rect x="280" y="76" width="9" height="12" class="f-ink"/>
<rect x="291" y="76" width="9" height="12" class="f-ink"/>
<rect x="302" y="76" width="9" height="12" class="f-ink"/>
<rect x="313" y="76" width="9" height="12" class="f-muted"/>
<rect x="324" y="76" width="9" height="12" class="f-muted"/>
<rect x="335" y="76" width="9" height="12" class="f-ink"/>
<rect x="346" y="76" width="9" height="12" class="f-ink"/>
<rect x="357" y="76" width="9" height="12" class="f-ink"/>
<rect x="368" y="76" width="9" height="12" class="f-muted"/>
<rect x="379" y="76" width="9" height="12" class="f-ink"/>
<rect x="390" y="76" width="9" height="12" class="f-ink"/>
<rect x="401" y="76" width="9" height="12" class="f-ink"/>
<rect x="412" y="76" width="9" height="12" class="f-ink"/>
<rect x="423" y="76" width="9" height="12" class="f-ink"/>
<rect x="434" y="76" width="9" height="12" class="f-box"/>
<rect x="445" y="76" width="9" height="12" class="f-ink"/>
<rect x="456" y="76" width="9" height="12" class="f-ink"/>
<rect x="467" y="76" width="9" height="12" class="f-muted"/>
<rect x="478" y="76" width="9" height="12" class="f-ink"/>
<rect x="489" y="76" width="9" height="12" class="f-muted"/>
<rect x="500" y="76" width="9" height="12" class="f-ink"/>
<rect x="511" y="76" width="9" height="12" class="f-ink"/>
<rect x="522" y="76" width="9" height="12" class="f-muted"/>
<rect x="533" y="76" width="9" height="12" class="f-ink"/>
<rect x="544" y="76" width="9" height="12" class="f-muted"/>
<rect x="555" y="76" width="9" height="12" class="f-muted"/>
<rect x="566" y="76" width="9" height="12" class="f-muted"/>
<rect x="577" y="76" width="9" height="12" class="f-muted"/>
<rect x="588" y="76" width="9" height="12" class="f-ink"/>
<rect x="599" y="76" width="9" height="12" class="f-ink"/>
<text x="60" y="100" class="f-label f-muted">best chance it gave Belarusian: 3.6%</text>
<text x="12" y="130" class="f-label f-ink">base</text>
<rect x="60" y="120" width="9" height="12" class="f-ink"/>
<rect x="71" y="120" width="9" height="12" class="f-ink"/>
<rect x="82" y="120" width="9" height="12" class="f-ink"/>
<rect x="93" y="120" width="9" height="12" class="f-ink"/>
<rect x="104" y="120" width="9" height="12" class="f-muted"/>
<rect x="115" y="120" width="9" height="12" class="f-ink"/>
<rect x="126" y="120" width="9" height="12" class="f-ink"/>
<rect x="137" y="120" width="9" height="12" class="f-box"/>
<rect x="148" y="120" width="9" height="12" class="f-muted"/>
<rect x="159" y="120" width="9" height="12" class="f-muted"/>
<rect x="170" y="120" width="9" height="12" class="f-ink"/>
<rect x="181" y="120" width="9" height="12" class="f-ink"/>
<rect x="192" y="120" width="9" height="12" class="f-ink"/>
<rect x="203" y="120" width="9" height="12" class="f-ink"/>
<rect x="214" y="120" width="9" height="12" class="f-muted"/>
<rect x="225" y="120" width="9" height="12" class="f-ink"/>
<rect x="236" y="120" width="9" height="12" class="f-box"/>
<rect x="247" y="120" width="9" height="12" class="f-muted"/>
<rect x="258" y="120" width="9" height="12" class="f-ink"/>
<rect x="269" y="120" width="9" height="12" class="f-ink"/>
<rect x="280" y="120" width="9" height="12" class="f-ink"/>
<rect x="291" y="120" width="9" height="12" class="f-muted"/>
<rect x="302" y="120" width="9" height="12" class="f-ink"/>
<rect x="313" y="120" width="9" height="12" class="f-ink"/>
<rect x="324" y="120" width="9" height="12" class="f-ink"/>
<rect x="335" y="120" width="9" height="12" class="f-muted"/>
<rect x="346" y="120" width="9" height="12" class="f-ink"/>
<rect x="357" y="120" width="9" height="12" class="f-muted"/>
<rect x="368" y="120" width="9" height="12" class="f-muted"/>
<rect x="379" y="120" width="9" height="12" class="f-ink"/>
<rect x="390" y="120" width="9" height="12" class="f-ink"/>
<rect x="401" y="120" width="9" height="12" class="f-ink"/>
<rect x="412" y="120" width="9" height="12" class="f-ink"/>
<rect x="423" y="120" width="9" height="12" class="f-ink"/>
<rect x="434" y="120" width="9" height="12" class="f-muted"/>
<rect x="445" y="120" width="9" height="12" class="f-ink"/>
<rect x="456" y="120" width="9" height="12" class="f-ink"/>
<rect x="467" y="120" width="9" height="12" class="f-ink"/>
<rect x="478" y="120" width="9" height="12" class="f-ink"/>
<rect x="489" y="120" width="9" height="12" class="f-ink"/>
<rect x="500" y="120" width="9" height="12" class="f-muted"/>
<rect x="511" y="120" width="9" height="12" class="f-muted"/>
<rect x="522" y="120" width="9" height="12" class="f-muted"/>
<rect x="533" y="120" width="9" height="12" class="f-ink"/>
<rect x="544" y="120" width="9" height="12" class="f-muted"/>
<rect x="555" y="120" width="9" height="12" class="f-ink"/>
<rect x="566" y="120" width="9" height="12" class="f-ink"/>
<rect x="577" y="120" width="9" height="12" class="f-ink"/>
<rect x="588" y="120" width="9" height="12" class="f-muted"/>
<rect x="599" y="120" width="9" height="12" class="f-muted"/>
<text x="60" y="144" class="f-label f-muted">best chance it gave Belarusian: 7.7%</text>
<text x="12" y="174" class="f-label f-ink">small</text>
<rect x="60" y="164" width="9" height="12" class="f-ink"/>
<rect x="71" y="164" width="9" height="12" class="f-ink"/>
<rect x="82" y="164" width="9" height="12" class="f-ink"/>
<rect x="93" y="164" width="9" height="12" class="f-ink"/>
<rect x="104" y="164" width="9" height="12" class="f-ink"/>
<rect x="115" y="164" width="9" height="12" class="f-ink"/>
<rect x="126" y="164" width="9" height="12" class="f-ink"/>
<rect x="137" y="164" width="9" height="12" class="f-ink"/>
<rect x="148" y="164" width="9" height="12" class="f-ink"/>
<rect x="159" y="164" width="9" height="12" class="f-ink"/>
<rect x="170" y="164" width="9" height="12" class="f-ink"/>
<rect x="181" y="164" width="9" height="12" class="f-ink"/>
<rect x="192" y="164" width="9" height="12" class="f-ink"/>
<rect x="203" y="164" width="9" height="12" class="f-ink"/>
<rect x="214" y="164" width="9" height="12" class="f-ink"/>
<rect x="225" y="164" width="9" height="12" class="f-ink"/>
<rect x="236" y="164" width="9" height="12" class="f-ink"/>
<rect x="247" y="164" width="9" height="12" class="f-ink"/>
<rect x="258" y="164" width="9" height="12" class="f-ink"/>
<rect x="269" y="164" width="9" height="12" class="f-ink"/>
<rect x="280" y="164" width="9" height="12" class="f-ink"/>
<rect x="291" y="164" width="9" height="12" class="f-ink"/>
<rect x="302" y="164" width="9" height="12" class="f-ink"/>
<rect x="313" y="164" width="9" height="12" class="f-ink"/>
<rect x="324" y="164" width="9" height="12" class="f-ink"/>
<rect x="335" y="164" width="9" height="12" class="f-ink"/>
<rect x="346" y="164" width="9" height="12" class="f-ink"/>
<rect x="357" y="164" width="9" height="12" class="f-ink"/>
<rect x="368" y="164" width="9" height="12" class="f-ink"/>
<rect x="379" y="164" width="9" height="12" class="f-ink"/>
<text x="60" y="188" class="f-label f-muted">best chance it gave Belarusian: 4.1%</text>
</svg>
<figcaption>Not one Belarusian sentence was detected as Belarusian.</figcaption>
</figure>

So I set `language="be"`. Once the language is set, the 2 smaller models change some words but keep Russian spelling. In base output 49 of 50 sentences contain и, щ or ъ, letters that Belarusian does not have. 36% of all words carry one of them. The letter ў is in 44 of the 50 reference sentences and base wrote it 0 times.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="The same sentence 3 times. Belarusian reference: У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў. Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць элементаў. Whisper base with the language set to Belarusian: Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на увазе, что пераядычная таблица замещая великую колькость элементу. Whisper base in automatic mode, which chose Russian: В большей стивыпадках с плавы это сумесь двух тенекальки металлов. Матя на увазе, что пероядочная таблица замещая великую колькость элементу. In 44 of 50 reference sentences there is ў. In base output with language=&quot;be&quot;: 0.">
<text x="12" y="18" class="f-label f-muted">1 FLEURS sentence, Whisper base</text>
<text x="12" y="44" class="f-label f-ink">Belarusian reference</text>
<text x="24" y="62" class="f-mono f-ink">У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў.</text>
<text x="24" y="80" class="f-mono f-ink">Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць</text>
<text x="24" y="98" class="f-mono f-ink">элементаў.</text>
<text x="12" y="126" class="f-label f-accent">base, language=&quot;be&quot;</text>
<text x="24" y="144" class="f-mono f-ink">Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на</text>
<text x="24" y="162" class="f-mono f-ink">увазе, что пераядычная таблица замещая великую колькость элементу.</text>
<text x="12" y="190" class="f-label f-accent">base, automatic (chose Russian)</text>
<text x="24" y="208" class="f-mono f-ink">В большей стивыпадках с плавы это сумесь двух тенекальки металлов.</text>
<text x="24" y="226" class="f-mono f-ink">Матя на увазе, что пероядочная таблица замещая великую колькость</text>
<text x="24" y="244" class="f-mono f-ink">элементу.</text>
<text x="12" y="276" class="f-label f-muted">In 44 of 50 reference sentences there is ў. In base output with language=&quot;be&quot;: 0.</text>
</svg>
<figcaption>Forcing the language changes some words, but the spelling stays Russian: у instead of ў and и instead of і.</figcaption>
</figure>

small is the first that writes some Belarusian letters. With the language forced it writes ў in 11 of 30 sentences, where the reference has it in 26. Only 9.5% of its words have a Russian letter. Wrong words go from 92.5% in automatic mode to 78.1%. The paper has 75.1% for small, so this is about what it should be. But it is still a mix. 28 of 30 sentences have a Russian letter somewhere and 8 have a Ukrainian word, like `існує` in the middle of a Belarusian sentence. Character error rate is 23.4%, almost 1 character in 4, which for me means I would retype it rather than correct it.

## Georgian

tiny recognised Georgian in only 44 of 100 sentences. base did in 46 of 50, more often than it recognised Lithuanian (82%). small did in all 30. None of the 3 models wrote a Georgian letter in any sentence.

base writes a kind of Latin transliteration, `Policisinspektorist Chandrashek` for "პოლიციის ინსპექტორის ჩანდრა შეკხარ". small, which picked Georgian for every sentence, writes Armenian script in 28 of 30. In 18 of them there are Armenian letters, usually `ԱՅՆՆՆՆ` with the same letter repeated to the end of the output. The other 10 have only the Armenian full stop `։` again and again. tiny writes Chinese in 33 of 100. One of those is `小朋友们记得点赞`, roughly "kids, remember to like", which is what Chinese video creators say at the end of a video. I can only guess, but it looks like a piece of somebody's subtitles from the training data.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Georgian reference: პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ... Whisper base, which detected Georgian, writes Latin letters: Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B... Whisper tiny on another Georgian sentence writes Chinese: 小朋友们记得点赞,收点赞,收点赞... Georgian letters in Whisper output: tiny 0 of 100, base 0 of 50, small 0 of 30. Chinese in tiny: 33 of 100.">
<text x="12" y="18" class="f-label f-muted">1 FLEURS sentence in Georgian</text>
<text x="12" y="44" class="f-label f-ink">Georgian reference</text>
<text x="24" y="62" class="f-mono f-ink">პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ...</text>
<text x="12" y="90" class="f-label f-accent">base, chose Georgian</text>
<text x="24" y="108" class="f-mono f-ink">Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B...</text>
<text x="12" y="136" class="f-label f-accent">tiny, another sentence</text>
<text x="24" y="154" class="f-mono f-ink">小朋友们记得点赞,收点赞,收点赞...</text>
<text x="12" y="186" class="f-label f-muted">Georgian letters in Whisper output: tiny 0 of 100, base 0 of 50, small 0 of 30.</text>
<text x="12" y="204" class="f-label f-muted">Chinese in tiny: 33 of 100.</text>
</svg>
<figcaption>base detected Georgian and wrote it in Latin letters.</figcaption>
</figure>

Word error rate for Georgian is above 100%, for tiny on all 100 sentences it is 228%. Loops add words that are not in the reference. So I would not look at this number much, most of it is the loops and the rest is wrong letters.

## What I did not check

medium and large did not run, they do not fit the time on this CPU. The paper gives 56.6% for Belarusian with large, so even there it is far from Russian. Beam search did not run either. The command line tool uses it by default, so its numbers are probably somewhat lower than mine. FLEURS is clean read speech and real recordings are likely worse. 30 to 100 sentences is a small sample and with other sentences the numbers for small can move by several points. Every configuration ran once, but greedy decoding gives the same result every time: I decoded 4 of the looped sentences again and got the same text byte for byte. I did not try fine tuning on Belarusian.

For now I would give Whisper a Belarusian recording only with `language="be"` and at least the small model. Even then I would read every line. With Georgian I would not start, the paper has 100.5% for it even with large.
