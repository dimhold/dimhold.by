---
title: "A plain classifier named the key by its sound 99 times in 100. Trained on the silence between presses, it still named it 39 times"
description: "I took the public keystroke datasets behind the 95% headline and a plain logistic regression. It named the key 92 to 99 times in 100, but the same model trained on the silence between presses still named it up to 39 times in 100. Every key in these sets is its own file. On passwords, where the file cannot help, it got 77 of 100. Another recording of the same MacBook brought it down to 5 or 6%."
date: 2026-09-27
lang: en
translationKey: keyboard-acoustic
tags: ["machine-learning", "open-data"]
---
The number that stays in my head about keyboard sound is 95%. In 2023 Harrison, Toreini and Mehrnezhad put an iPhone next to a MacBook Pro and trained a network on the sound of the keys. It got 95% of keystrokes right and 93% on a Zoom recording made with the laptop's own microphone. In 2025 Spata and coauthors got 98.3% on the same MacBook data, then recorded a mechanical keyboard and reported 99% on it. I have a small tool, earshot, that listens to the microphone and writes down speech. The same microphone hears every key I press. I had read the 95% several times and never asked what exactly it was measured on. Both datasets are public under MIT, so this time I downloaded them and looked.

## The setup

Both sets are built the same way. 36 keys, the digits and the letters. Every key is its own WAV file with 25 presses in a row, about 1 second apart. Harrison has 2 recordings of the same MacBook. One is from the phone lying on a microfibre cloth, the other from Zoom at 32 kHz with noise suppression set to the minimum. The KAD set from Spata is a mechanical keyboard and a smartphone 17 cm away, plus 10 passwords typed key by key, one recording each.

I wanted to see how much a simple model takes, so no deep network. Python 3.12, numpy 2.5.3, scipy 1.18.1, `scikit-learn` 1.9.0 on 4 CPU cores. Each press is cut out by an energy threshold that adapts until the file gives exactly 25 presses. Then 330 ms of sound becomes a log mel spectrogram with 64 bands and a logistic regression looks at it. Chance with 36 keys is 2.8%.

For testing I split the presses by position in the file: presses 0 to 4 in one fold, 5 to 9 in the next and so on. A random split would put the time neighbours of most test presses into training. Here only the presses at the edge of a fold have one.

The result was 92.4% on the MacBook through the phone, 84.6% through Zoom and 99.3% on the mechanical keyboard. A linear model with no augmentation came within 3 points of Harrison's network on the phone recording. On the mechanical keyboard it matched the 99% from Spata. I did not expect that. On Zoom it was 8 points behind. Spata also got 98.3% on the phone recording, 6 points more than mine. The papers split the data differently, so this is a rough comparison.

## Where I stopped believing it

Then I looked again at the file layout and it bothered me. Every key lives in its own recording. Say the phone moved a little between the recording of `a` and the recording of `b`. Then the classifier can learn the file instead of the key. The test above will not notice, because test presses come from the same files.

So I trained the same model on the silence. From each press I took 200 ms that start 400 ms after it, where the sound is 24 to 36 dB below the press. Then I asked which key this piece of silence belongs to. On the MacBook through the phone the silence named the key 29.4% of the time, through Zoom 16.1%, on the mechanical keyboard 39.4%. That is 6 to 14 times chance.

The recording alone carries enough to name the key. The classifier on the presses may be using it too. How much, I cannot say from these files.

<figure class="fig">
<svg viewBox="0 0 640 246" role="img" aria-label="Horizontal bars, share of presses where a logistic regression named the key right, chance is 2.8%. MacBook Pro through an iPhone: the press 92.4%, silence between presses 29.4%. MacBook Pro through Zoom: the press 84.6%, silence 16.1%. Mechanical keyboard: the press 99.3%, silence 39.4%, presses inside passwords typed key by key 77%.">
  <text x="12" y="16" class="f-label f-muted">share of presses where the key was named right</text>
  <text x="12" y="51" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="66" class="f-label f-muted">iPhone next to it</text>
  <text x="242" y="51" text-anchor="end" class="f-label f-muted">the press</text>
  <rect x="250" y="40" width="277.3" height="14" class="f-box"/>
  <text x="533.3" y="51" class="f-mono f-ink">92.4%</text>
  <text x="242" y="71" text-anchor="end" class="f-label f-muted">silence only</text>
  <rect x="250" y="60" width="88.2" height="14" class="f-plain"/>
  <text x="344.2" y="71" class="f-mono f-ink">29.4%</text>
  <text x="12" y="109" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="124" class="f-label f-muted">Zoom recording</text>
  <text x="242" y="109" text-anchor="end" class="f-label f-muted">the press</text>
  <rect x="250" y="98" width="253.7" height="14" class="f-box"/>
  <text x="509.7" y="109" class="f-mono f-ink">84.6%</text>
  <text x="242" y="129" text-anchor="end" class="f-label f-muted">silence only</text>
  <rect x="250" y="118" width="48.3" height="14" class="f-plain"/>
  <text x="304.3" y="129" class="f-mono f-ink">16.1%</text>
  <text x="12" y="167" class="f-mono f-ink">mechanical</text>
  <text x="12" y="182" class="f-label f-muted">phone at 17 cm</text>
  <text x="242" y="167" text-anchor="end" class="f-label f-muted">the press</text>
  <rect x="250" y="156" width="298.0" height="14" class="f-box"/>
  <text x="554.0" y="167" class="f-mono f-ink">99.3%</text>
  <text x="242" y="187" text-anchor="end" class="f-label f-muted">silence only</text>
  <rect x="250" y="176" width="118.3" height="14" class="f-plain"/>
  <text x="374.3" y="187" class="f-mono f-ink">39.4%</text>
  <text x="242" y="207" text-anchor="end" class="f-label f-muted">passwords</text>
  <rect x="250" y="196" width="231.0" height="14" class="f-accent"/>
  <text x="487.0" y="207" class="f-mono f-ink">77%</text>
  <line x1="258.3" y1="34" x2="258.3" y2="224" class="f-line" stroke-dasharray="3 3"/>
  <text x="258.3" y="238" text-anchor="middle" class="f-label f-muted">chance 2.8%</text>
</svg>
<figcaption>Silence is 200 ms that start 400 ms after a press, where the press has mostly died away. Every key of these datasets is its own file, so the silence most likely names the key through the recording. The passwords are 100 presses inside 10 words, a test where the file cannot help.</figcaption>
</figure>

The KAD passwords are the check that the file cannot help with. There the keys follow each other inside one recording. I trained on all 900 presses from the key files and tested on the 100 presses inside the 10 passwords. I told the isolator how many characters each password has. 77 of 100 were right. In 93 of 100 the right key was in the top 5. 1 password of 10 came out whole, `baseball47`. The worst was `position90`, heard as `ppsvtnpk00`.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Table of the 10 KAD passwords, each typed password next to what the classifier heard, wrong characters highlighted: baseball47 baseball47, cultural12 cultural10, fragrant34 fralrant34, friendly56 fzkendly56, grateful10 lznzeful10, hardship38 hardshil37, ideology78 idelkpgy73, nominate29 nominatex9, position90 ppsvtnpk00, suppress56 supnresx56. 77 of 100 characters right, 93 of 100 in the top 5.">
  <text x="12" y="16" class="f-label f-muted">KAD passwords: typed and heard</text>
  <text x="60" y="38" class="f-label f-muted">typed</text>
  <text x="230" y="38" class="f-label f-muted">heard</text>
  <text x="440" y="38" text-anchor="end" class="f-label f-muted">right</text>
  <text x="540" y="38" text-anchor="end" class="f-label f-muted">in top 5</text>
  <text x="60" y="63" class="f-mono f-ink">b</text>
  <text x="72" y="63" class="f-mono f-ink">a</text>
  <text x="84" y="63" class="f-mono f-ink">s</text>
  <text x="96" y="63" class="f-mono f-ink">e</text>
  <text x="108" y="63" class="f-mono f-ink">b</text>
  <text x="120" y="63" class="f-mono f-ink">a</text>
  <text x="132" y="63" class="f-mono f-ink">l</text>
  <text x="144" y="63" class="f-mono f-ink">l</text>
  <text x="156" y="63" class="f-mono f-ink">4</text>
  <text x="168" y="63" class="f-mono f-ink">7</text>
  <text x="230" y="63" class="f-mono f-muted">b</text>
  <text x="242" y="63" class="f-mono f-muted">a</text>
  <text x="254" y="63" class="f-mono f-muted">s</text>
  <text x="266" y="63" class="f-mono f-muted">e</text>
  <text x="278" y="63" class="f-mono f-muted">b</text>
  <text x="290" y="63" class="f-mono f-muted">a</text>
  <text x="302" y="63" class="f-mono f-muted">l</text>
  <text x="314" y="63" class="f-mono f-muted">l</text>
  <text x="326" y="63" class="f-mono f-muted">4</text>
  <text x="338" y="63" class="f-mono f-muted">7</text>
  <text x="440" y="63" text-anchor="end" class="f-mono f-ink">10/10</text>
  <text x="540" y="63" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="84" class="f-mono f-ink">c</text>
  <text x="72" y="84" class="f-mono f-ink">u</text>
  <text x="84" y="84" class="f-mono f-ink">l</text>
  <text x="96" y="84" class="f-mono f-ink">t</text>
  <text x="108" y="84" class="f-mono f-ink">u</text>
  <text x="120" y="84" class="f-mono f-ink">r</text>
  <text x="132" y="84" class="f-mono f-ink">a</text>
  <text x="144" y="84" class="f-mono f-ink">l</text>
  <text x="156" y="84" class="f-mono f-ink">1</text>
  <text x="168" y="84" class="f-mono f-ink">2</text>
  <text x="230" y="84" class="f-mono f-muted">c</text>
  <text x="242" y="84" class="f-mono f-muted">u</text>
  <text x="254" y="84" class="f-mono f-muted">l</text>
  <text x="266" y="84" class="f-mono f-muted">t</text>
  <text x="278" y="84" class="f-mono f-muted">u</text>
  <text x="290" y="84" class="f-mono f-muted">r</text>
  <text x="302" y="84" class="f-mono f-muted">a</text>
  <text x="314" y="84" class="f-mono f-muted">l</text>
  <text x="326" y="84" class="f-mono f-muted">1</text>
  <rect x="336" y="71" width="12" height="17" class="f-box"/>
  <text x="338" y="84" class="f-mono f-accent">0</text>
  <text x="440" y="84" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="84" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="105" class="f-mono f-ink">f</text>
  <text x="72" y="105" class="f-mono f-ink">r</text>
  <text x="84" y="105" class="f-mono f-ink">a</text>
  <text x="96" y="105" class="f-mono f-ink">g</text>
  <text x="108" y="105" class="f-mono f-ink">r</text>
  <text x="120" y="105" class="f-mono f-ink">a</text>
  <text x="132" y="105" class="f-mono f-ink">n</text>
  <text x="144" y="105" class="f-mono f-ink">t</text>
  <text x="156" y="105" class="f-mono f-ink">3</text>
  <text x="168" y="105" class="f-mono f-ink">4</text>
  <text x="230" y="105" class="f-mono f-muted">f</text>
  <text x="242" y="105" class="f-mono f-muted">r</text>
  <text x="254" y="105" class="f-mono f-muted">a</text>
  <rect x="264" y="92" width="12" height="17" class="f-box"/>
  <text x="266" y="105" class="f-mono f-accent">l</text>
  <text x="278" y="105" class="f-mono f-muted">r</text>
  <text x="290" y="105" class="f-mono f-muted">a</text>
  <text x="302" y="105" class="f-mono f-muted">n</text>
  <text x="314" y="105" class="f-mono f-muted">t</text>
  <text x="326" y="105" class="f-mono f-muted">3</text>
  <text x="338" y="105" class="f-mono f-muted">4</text>
  <text x="440" y="105" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="105" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="126" class="f-mono f-ink">f</text>
  <text x="72" y="126" class="f-mono f-ink">r</text>
  <text x="84" y="126" class="f-mono f-ink">i</text>
  <text x="96" y="126" class="f-mono f-ink">e</text>
  <text x="108" y="126" class="f-mono f-ink">n</text>
  <text x="120" y="126" class="f-mono f-ink">d</text>
  <text x="132" y="126" class="f-mono f-ink">l</text>
  <text x="144" y="126" class="f-mono f-ink">y</text>
  <text x="156" y="126" class="f-mono f-ink">5</text>
  <text x="168" y="126" class="f-mono f-ink">6</text>
  <text x="230" y="126" class="f-mono f-muted">f</text>
  <rect x="240" y="113" width="12" height="17" class="f-box"/>
  <text x="242" y="126" class="f-mono f-accent">z</text>
  <rect x="252" y="113" width="12" height="17" class="f-box"/>
  <text x="254" y="126" class="f-mono f-accent">k</text>
  <text x="266" y="126" class="f-mono f-muted">e</text>
  <text x="278" y="126" class="f-mono f-muted">n</text>
  <text x="290" y="126" class="f-mono f-muted">d</text>
  <text x="302" y="126" class="f-mono f-muted">l</text>
  <text x="314" y="126" class="f-mono f-muted">y</text>
  <text x="326" y="126" class="f-mono f-muted">5</text>
  <text x="338" y="126" class="f-mono f-muted">6</text>
  <text x="440" y="126" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="126" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="147" class="f-mono f-ink">g</text>
  <text x="72" y="147" class="f-mono f-ink">r</text>
  <text x="84" y="147" class="f-mono f-ink">a</text>
  <text x="96" y="147" class="f-mono f-ink">t</text>
  <text x="108" y="147" class="f-mono f-ink">e</text>
  <text x="120" y="147" class="f-mono f-ink">f</text>
  <text x="132" y="147" class="f-mono f-ink">u</text>
  <text x="144" y="147" class="f-mono f-ink">l</text>
  <text x="156" y="147" class="f-mono f-ink">1</text>
  <text x="168" y="147" class="f-mono f-ink">0</text>
  <rect x="228" y="134" width="12" height="17" class="f-box"/>
  <text x="230" y="147" class="f-mono f-accent">l</text>
  <rect x="240" y="134" width="12" height="17" class="f-box"/>
  <text x="242" y="147" class="f-mono f-accent">z</text>
  <rect x="252" y="134" width="12" height="17" class="f-box"/>
  <text x="254" y="147" class="f-mono f-accent">n</text>
  <rect x="264" y="134" width="12" height="17" class="f-box"/>
  <text x="266" y="147" class="f-mono f-accent">z</text>
  <text x="278" y="147" class="f-mono f-muted">e</text>
  <text x="290" y="147" class="f-mono f-muted">f</text>
  <text x="302" y="147" class="f-mono f-muted">u</text>
  <text x="314" y="147" class="f-mono f-muted">l</text>
  <text x="326" y="147" class="f-mono f-muted">1</text>
  <text x="338" y="147" class="f-mono f-muted">0</text>
  <text x="440" y="147" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="147" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="168" class="f-mono f-ink">h</text>
  <text x="72" y="168" class="f-mono f-ink">a</text>
  <text x="84" y="168" class="f-mono f-ink">r</text>
  <text x="96" y="168" class="f-mono f-ink">d</text>
  <text x="108" y="168" class="f-mono f-ink">s</text>
  <text x="120" y="168" class="f-mono f-ink">h</text>
  <text x="132" y="168" class="f-mono f-ink">i</text>
  <text x="144" y="168" class="f-mono f-ink">p</text>
  <text x="156" y="168" class="f-mono f-ink">3</text>
  <text x="168" y="168" class="f-mono f-ink">8</text>
  <text x="230" y="168" class="f-mono f-muted">h</text>
  <text x="242" y="168" class="f-mono f-muted">a</text>
  <text x="254" y="168" class="f-mono f-muted">r</text>
  <text x="266" y="168" class="f-mono f-muted">d</text>
  <text x="278" y="168" class="f-mono f-muted">s</text>
  <text x="290" y="168" class="f-mono f-muted">h</text>
  <text x="302" y="168" class="f-mono f-muted">i</text>
  <rect x="312" y="155" width="12" height="17" class="f-box"/>
  <text x="314" y="168" class="f-mono f-accent">l</text>
  <text x="326" y="168" class="f-mono f-muted">3</text>
  <rect x="336" y="155" width="12" height="17" class="f-box"/>
  <text x="338" y="168" class="f-mono f-accent">7</text>
  <text x="440" y="168" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="168" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="189" class="f-mono f-ink">i</text>
  <text x="72" y="189" class="f-mono f-ink">d</text>
  <text x="84" y="189" class="f-mono f-ink">e</text>
  <text x="96" y="189" class="f-mono f-ink">o</text>
  <text x="108" y="189" class="f-mono f-ink">l</text>
  <text x="120" y="189" class="f-mono f-ink">o</text>
  <text x="132" y="189" class="f-mono f-ink">g</text>
  <text x="144" y="189" class="f-mono f-ink">y</text>
  <text x="156" y="189" class="f-mono f-ink">7</text>
  <text x="168" y="189" class="f-mono f-ink">8</text>
  <text x="230" y="189" class="f-mono f-muted">i</text>
  <text x="242" y="189" class="f-mono f-muted">d</text>
  <text x="254" y="189" class="f-mono f-muted">e</text>
  <rect x="264" y="176" width="12" height="17" class="f-box"/>
  <text x="266" y="189" class="f-mono f-accent">l</text>
  <rect x="276" y="176" width="12" height="17" class="f-box"/>
  <text x="278" y="189" class="f-mono f-accent">k</text>
  <rect x="288" y="176" width="12" height="17" class="f-box"/>
  <text x="290" y="189" class="f-mono f-accent">p</text>
  <text x="302" y="189" class="f-mono f-muted">g</text>
  <text x="314" y="189" class="f-mono f-muted">y</text>
  <text x="326" y="189" class="f-mono f-muted">7</text>
  <rect x="336" y="176" width="12" height="17" class="f-box"/>
  <text x="338" y="189" class="f-mono f-accent">3</text>
  <text x="440" y="189" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="189" text-anchor="end" class="f-mono f-muted">7/10</text>
  <text x="60" y="210" class="f-mono f-ink">n</text>
  <text x="72" y="210" class="f-mono f-ink">o</text>
  <text x="84" y="210" class="f-mono f-ink">m</text>
  <text x="96" y="210" class="f-mono f-ink">i</text>
  <text x="108" y="210" class="f-mono f-ink">n</text>
  <text x="120" y="210" class="f-mono f-ink">a</text>
  <text x="132" y="210" class="f-mono f-ink">t</text>
  <text x="144" y="210" class="f-mono f-ink">e</text>
  <text x="156" y="210" class="f-mono f-ink">2</text>
  <text x="168" y="210" class="f-mono f-ink">9</text>
  <text x="230" y="210" class="f-mono f-muted">n</text>
  <text x="242" y="210" class="f-mono f-muted">o</text>
  <text x="254" y="210" class="f-mono f-muted">m</text>
  <text x="266" y="210" class="f-mono f-muted">i</text>
  <text x="278" y="210" class="f-mono f-muted">n</text>
  <text x="290" y="210" class="f-mono f-muted">a</text>
  <text x="302" y="210" class="f-mono f-muted">t</text>
  <text x="314" y="210" class="f-mono f-muted">e</text>
  <rect x="324" y="197" width="12" height="17" class="f-box"/>
  <text x="326" y="210" class="f-mono f-accent">x</text>
  <text x="338" y="210" class="f-mono f-muted">9</text>
  <text x="440" y="210" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="210" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="231" class="f-mono f-ink">p</text>
  <text x="72" y="231" class="f-mono f-ink">o</text>
  <text x="84" y="231" class="f-mono f-ink">s</text>
  <text x="96" y="231" class="f-mono f-ink">i</text>
  <text x="108" y="231" class="f-mono f-ink">t</text>
  <text x="120" y="231" class="f-mono f-ink">i</text>
  <text x="132" y="231" class="f-mono f-ink">o</text>
  <text x="144" y="231" class="f-mono f-ink">n</text>
  <text x="156" y="231" class="f-mono f-ink">9</text>
  <text x="168" y="231" class="f-mono f-ink">0</text>
  <text x="230" y="231" class="f-mono f-muted">p</text>
  <rect x="240" y="218" width="12" height="17" class="f-box"/>
  <text x="242" y="231" class="f-mono f-accent">p</text>
  <text x="254" y="231" class="f-mono f-muted">s</text>
  <rect x="264" y="218" width="12" height="17" class="f-box"/>
  <text x="266" y="231" class="f-mono f-accent">v</text>
  <text x="278" y="231" class="f-mono f-muted">t</text>
  <rect x="288" y="218" width="12" height="17" class="f-box"/>
  <text x="290" y="231" class="f-mono f-accent">n</text>
  <rect x="300" y="218" width="12" height="17" class="f-box"/>
  <text x="302" y="231" class="f-mono f-accent">p</text>
  <rect x="312" y="218" width="12" height="17" class="f-box"/>
  <text x="314" y="231" class="f-mono f-accent">k</text>
  <rect x="324" y="218" width="12" height="17" class="f-box"/>
  <text x="326" y="231" class="f-mono f-accent">0</text>
  <text x="338" y="231" class="f-mono f-muted">0</text>
  <text x="440" y="231" text-anchor="end" class="f-mono f-ink">4/10</text>
  <text x="540" y="231" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="252" class="f-mono f-ink">s</text>
  <text x="72" y="252" class="f-mono f-ink">u</text>
  <text x="84" y="252" class="f-mono f-ink">p</text>
  <text x="96" y="252" class="f-mono f-ink">p</text>
  <text x="108" y="252" class="f-mono f-ink">r</text>
  <text x="120" y="252" class="f-mono f-ink">e</text>
  <text x="132" y="252" class="f-mono f-ink">s</text>
  <text x="144" y="252" class="f-mono f-ink">s</text>
  <text x="156" y="252" class="f-mono f-ink">5</text>
  <text x="168" y="252" class="f-mono f-ink">6</text>
  <text x="230" y="252" class="f-mono f-muted">s</text>
  <text x="242" y="252" class="f-mono f-muted">u</text>
  <text x="254" y="252" class="f-mono f-muted">p</text>
  <rect x="264" y="239" width="12" height="17" class="f-box"/>
  <text x="266" y="252" class="f-mono f-accent">n</text>
  <text x="278" y="252" class="f-mono f-muted">r</text>
  <text x="290" y="252" class="f-mono f-muted">e</text>
  <text x="302" y="252" class="f-mono f-muted">s</text>
  <rect x="312" y="239" width="12" height="17" class="f-box"/>
  <text x="314" y="252" class="f-mono f-accent">x</text>
  <text x="326" y="252" class="f-mono f-muted">5</text>
  <text x="338" y="252" class="f-mono f-muted">6</text>
  <text x="440" y="252" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="252" text-anchor="end" class="f-mono f-muted">9/10</text>
  <line x1="60" y1="262" x2="545" y2="262" class="f-plain"/>
  <text x="440" y="278" text-anchor="end" class="f-mono f-ink">77/100</text>
  <text x="540" y="278" text-anchor="end" class="f-mono f-muted">93/100</text>
</svg>
<figcaption>Trained on the 900 presses of the key files, tested on the passwords. Highlighted characters are wrong guesses.</figcaption>
</figure>

Of the 23 wrong guesses, 10 landed on a physical neighbour of the right key. For a random pair of keys on this layout it is 13%. With a dictionary that is a useful list of candidates, but a password with digits at the end still needs 10 right guesses in a row.

Spata did a test of the same kind, on 8 passwords recorded later on the same keyboard. Their network got 89.1% on average. Their passwords are not in the public set, so I cannot compare directly, but it is 12 points above my 77. Harrison's paper has no test like this.

## Where it breaks

**Another recording of the same keyboard.** I trained on the phone and tested on Zoom, same MacBook and same typist. It got 6.3%. The other direction gave 4.9%. I thought the reason was the different band, Zoom at 32 kHz against 44.1 kHz on the phone. So I kept only the mel bands below 8 kHz and subtracted the mean log mel spectrum of each recording as a crude equaliser. The best of it was 12%, 4 times chance. The change here is a different microphone, a different session and Zoom's processing at once. I cannot separate them. The 92% and the 85% in the first figure are 2 separate models, each trained on its own recording.

**Noise.** This one I got wrong first. I added white noise 30 dB below the press and the MacBook model fell to chance. I spent some time looking for a bug in the noise code before I compared levels by band. Most of the room sound in the phone recording sits in the low bands. Above 1.1 kHz it is so quiet that even noise 60 dB below the press is louder than the room. This is so in 47 of 64 mel bands. With the last 5 presses of each file held out, the model had 88% on clean presses, 43% at 60 dB and 5.6% at 50 dB. My guess is that it leans on those nearly silent high bands.

Then I gave the training presses the same noise at the same level. The MacBook model holds 86% at 60 dB, 61% at 30 dB and 26% at 0 dB, where the noise is as loud as the press. The mechanical keyboard stays at 97% even at 0 dB. Each of these models knew the noise level in advance.

<figure class="fig">
<svg viewBox="0 0 640 328" role="img" aria-label="Line chart of accuracy against white noise added to the test presses, from clean to 0 dB below the press. MacBook, trained with noise: clean 87.8%, 60 dB 86.1%, 50 dB 85.6%, 40 dB 76.1%, 30 dB 61.1%, 20 dB 47.8%, 10 dB 33.9%, 0 dB 26.1%. MacBook, trained clean: clean 87.8%, 60 dB 43.3%, 50 dB 5.6%, 40 dB 2.8%, 30 dB 2.8%, 20 dB 2.8%, 10 dB 2.8%, 0 dB 2.8%. mechanical, trained with noise: clean 100%, 60 dB 100%, 50 dB 100%, 40 dB 100%, 30 dB 100%, 20 dB 100%, 10 dB 100%, 0 dB 96.7%. mechanical, trained clean: clean 100%, 60 dB 100%, 50 dB 100%, 40 dB 99.4%, 30 dB 97.8%, 20 dB 45.6%, 10 dB 19.4%, 0 dB 8.3%.">
  <text x="12" y="16" class="f-label f-muted">white noise added to the test presses</text>
  <line x1="70" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="62" y="244" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" y1="190" x2="590" y2="190" class="f-plain"/>
  <text x="62" y="194" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" y1="140" x2="590" y2="140" class="f-plain"/>
  <text x="62" y="144" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" y1="90" x2="590" y2="90" class="f-plain"/>
  <text x="62" y="94" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" y1="40" x2="590" y2="40" class="f-plain"/>
  <text x="62" y="44" text-anchor="end" class="f-label f-muted">100%</text>
  <line x1="70" y1="234.4" x2="590" y2="234.4" class="f-line" stroke-dasharray="3 3"/>
  <text x="70" y="258" text-anchor="middle" class="f-label f-muted">clean</text>
  <text x="144.28571428571428" y="258" text-anchor="middle" class="f-label f-muted">60</text>
  <text x="218.57142857142858" y="258" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="292.8571428571429" y="258" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="367.14285714285717" y="258" text-anchor="middle" class="f-label f-muted">30</text>
  <text x="441.42857142857144" y="258" text-anchor="middle" class="f-label f-muted">20</text>
  <text x="515.7142857142858" y="258" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="590" y="258" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="590" y="274" text-anchor="end" class="f-label f-muted">dB, noise below the press</text>
  <polyline points="70.0,64.4 144.3,67.8 218.6,68.9 292.9,87.8 367.1,117.8 441.4,144.4 515.7,172.2 590.0,187.8" fill="none" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="67.8" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="68.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="87.8" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="117.8" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="144.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="172.2" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="187.8" r="2.6" class="f-accent"/>
  <polyline points="70.0,64.4 144.3,153.3 218.6,228.9 292.9,234.4 367.1,234.4 441.4,234.4 515.7,234.4 590.0,234.4" fill="none" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="153.3" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="228.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="234.4" r="2.6" class="f-accent"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,40.0 367.1,40.0 441.4,40.0 515.7,40.0 590.0,46.7" fill="none" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="46.7" r="2.6" class="f-ink"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,41.1 367.1,44.4 441.4,148.9 515.7,201.1 590.0,223.3" fill="none" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="41.1" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="44.4" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="148.9" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="201.1" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="223.3" r="2.6" class="f-ink"/>
  <line x1="70" y1="294" x2="96" y2="294" style="stroke:var(--accent);stroke-width:2"/>
  <text x="104" y="298" class="f-label f-muted">MacBook, trained with noise</text>
  <line x1="340" y1="294" x2="366" y2="294" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="298" class="f-label f-muted">MacBook, trained clean</text>
  <line x1="70" y1="312" x2="96" y2="312" style="stroke:var(--ink);stroke-width:2"/>
  <text x="104" y="316" class="f-label f-muted">mechanical, trained with noise</text>
  <line x1="340" y1="312" x2="366" y2="312" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="316" class="f-label f-muted">mechanical, trained clean</text>
</svg>
<figcaption>Test is the last 5 presses of every key file, training the first 20. The noise level is set against the power of the first 100 ms of each press. The dashed horizontal line is chance, 2.8%.</figcaption>
</figure>

**Training data.** All of this needs labelled presses of exactly this keyboard in exactly this place. On the same held out presses, 1 labelled press per key gave the MacBook model 11%, 5 presses 41% and 20 presses 88%. The mechanical keyboard needs less, 50% from 1 press and 89% from 5. Somebody has to type every key into the microphone first or the attacker has to label the presses by other means. Papers that do it without labels use a language model. That is a separate piece of work and I did not repeat it.

## What I did not check

I did not record my own keyboard. The measurement ran on a server without a microphone, so everything above is 2 public datasets and 3 recordings. Harrison's set is one typist, KAD does not say. I did not try the deep networks from the papers, so the transfer between recordings may be better with them. I did not try typing at normal speed, where the presses overlap, because my isolator needs 200 ms between presses. On the MacBook recording the sound is still fading in the silence window, so a part of the 29% there may be the key itself. The password test does not depend on this. Every number here is 1 run. My models are deterministic and the noise has a fixed seed.

For me the result is narrower than the headline. The sound of a key does carry the key. On the password test my linear model got 77 of 100 and Spata's network got 89.1% on theirs. But in both cases it is the same keyboard, the same room and the same microphone as in training. With my model another recording of the same MacBook brings it down to 5 or 6%. What part of the 95% on the MacBook comes from the file, I cannot tell from this dataset.
