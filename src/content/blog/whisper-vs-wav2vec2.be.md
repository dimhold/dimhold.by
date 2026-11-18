---
title: "Whisper прайграў wav2vec2 на LibriSpeech і выйграў на нарадзе, але 4 фразы ледзь гэта не схавалі"
description: "4 мадэлі, 3 віды гуку, па 200 фраз. На LibriSpeech wav2vec2 наперадзе Whisper tiny.en і base.en, на прамовах у парламенце і на нарадах наперадзе Whisper. На нарадзе гэта хавалі 4 пятлі прагнага дэкадавання base.en, пакуль я не ўключыў адкат па тэмпературы."
date: 2022-09-24
lang: be
translationKey: whisper-vs-wav2vec2
tags: ["machine-learning", "statistics"]
---
Whisper выйшаў у сераду. Дагэтуль для адкрытага распазнавання англійскай мовы я браў wav2vec2 з Hugging Face. У картцы `facebook/wav2vec2-base-960h` напісана 3,4% памылковых слоў на чыстай тэставай частцы LibriSpeech, у картцы вялікай `lv60-self` 1,9. Для мяне гэты лік і быў якасцю мадэлі. На гуку не з LibriSpeech я яго ні разу не правяраў.

Табліца 8 артыкула пра Whisper паказвае, што маленькія мадэлі Whisper горшыя за wav2vec2 на LibriSpeech і лепшыя за wav2vec2 base амаль на ўсім астатнім. Кожны артыкул паказвае пра сябе нешта такое, таму я прагнаў 4 мадэлі на 3 відах гуку і палічыў.

## Стэнд

Whisper на каміце `8cf36f3` ад 23 верасня, torch 1.12.1 на CPU у fp32. Я ўзяў `tiny.en` і `base.en` з `temperature=0`, гэта значыць прагнае дэкадаванне, як у табліцы 8 артыкула. wav2vec2 base і large lv60 ідуць праз transformers 4.22.1 і ў кожным кадры бяруць найбольш верагодную літару, без моўнай мадэлі. Лічыў на 4 віртуальных ядрах AMD EPYC 7713.

З кожнага набору я ўзяў 200 выпадковых фраз:

1. LibriSpeech, чыстая тэставая частка, аўдыякнігі. wav2vec2 данавучалі на навучальнай частцы гэтага ж корпусу.
2. VoxPopuli на англійскай, выступы ў Еўрапейскім парламенце.
3. AMI, запісы нарад з мікрафонаў гарнітур, фразы ад 3 слоў. Я ўзяў толькі першы файл тэставай часткі на Hugging Face, таму гэта 3 нарады і 4 удзельнікі.

Памылкі лічацца як WER у jiwer 2.5.1.

## Першы лік быў 99%

Першы вынік `tiny.en` на LibriSpeech быў 99,31% слоў з памылкай. Эталон запісаны вялікімі літарамі без пунктуацыі. Таму `SUNDAY AUGUST SIXTEENTH` сустрэлася з `Sunday, August 16th.` і як радкі не супалі 3 словы з 3. Падобна на зламаную мадэль, але гэта толькі вялікія літары і коскі.

Ніжні рэгістр без пунктуацыі даў 6,02%. Артыкул лічыць пасля ўласнага англійскага нармалізатара, які яшчэ піша лікі лічбамі і выкідае `um` і `uh`. Пасля яго `16th` супадае з `sixteenth` і вынік 5,60%, як у табліцы 8. Я выкарыстоўваў яго для ўсіх 4 мадэляў.

## На LibriSpeech картка мае рацыю

| мадэль | мае 200 фраз | артыкул, прагна |
|---|---|---|
| wav2vec2 large lv60 | 1,52 | 1,8 |
| wav2vec2 base | 2,83 | 3,3 |
| Whisper base.en | 3,43 | 4,2 |
| Whisper tiny.en | 5,60 | 5,6 |

Па суме абедзве wav2vec2 наперадзе. Паміж `base.en` і wav2vec2 base розніца 0,6 пункта. Калі 2000 разоў перасабраць выбарку фраз, 95% інтэрвал ідзе ад −0,22 да 1,37, так што на 200 фразах гэтыя 2 мадэлі я адрозніць не магу. `tiny.en` відавочна горшая за абедзве.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="Доля памылковых слоў у 4 мадэляў на 3 наборах, па 200 фраз. Чысты LibriSpeech: wav2vec2 large lv60 1,52%, wav2vec2 base 2,83%, Whisper base.en 3,43%, Whisper tiny.en 5,60%. VoxPopuli на англійскай: wav2vec2 large lv60 13,05%, wav2vec2 base 20,86%, Whisper base.en 10,51%, Whisper tiny.en 11,67%. Нарады AMI, гарнітуры: wav2vec2 large lv60 37,69%, wav2vec2 base 47,08%, Whisper base.en 49,93%, Whisper tiny.en 35,14%. На LibriSpeech абедзве wav2vec2 наперадзе абедзвюх Whisper. На VoxPopuli наперадзе абедзве Whisper. На нарадах лепшая Whisper tiny.en, горшая Whisper base.en, без 4 зацыкленых фраз у base.en 22,61.">
  <text x="8" y="58" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60</text>
  <text x="8" y="92" class="f-mono f-ink" style="font-size:11px">wav2vec2 base</text>
  <text x="8" y="126" class="f-mono f-accent" style="font-size:11px">Whisper base.en</text>
  <text x="8" y="160" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en</text>
  <text x="150" y="24" class="f-label f-ink">LibriSpeech чысты</text>
  <line x1="150" x2="150" y1="36" y2="176" class="f-plain"/>
  <rect x="150" y="44" width="31.5" height="20" rx="2" class="f-muted"/>
  <text x="186.5" y="59" class="f-mono f-ink" style="font-size:11px">1,52</text>
  <rect x="150" y="78" width="58.6" height="20" rx="2" class="f-muted"/>
  <text x="213.6" y="93" class="f-mono f-ink" style="font-size:11px">2,83</text>
  <rect x="150" y="112" width="71.1" height="20" rx="2" class="f-accent"/>
  <text x="226.1" y="127" class="f-mono f-ink" style="font-size:11px">3,43</text>
  <rect x="150" y="146" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="271.0" y="161" class="f-mono f-ink" style="font-size:11px">5,60</text>
  <text x="330" y="24" class="f-label f-ink">VoxPopuli</text>
  <line x1="330" x2="330" y1="36" y2="176" class="f-plain"/>
  <rect x="330" y="44" width="72.6" height="20" rx="2" class="f-muted"/>
  <text x="407.6" y="59" class="f-mono f-ink" style="font-size:11px">13,05</text>
  <rect x="330" y="78" width="116.0" height="20" rx="2" class="f-muted"/>
  <text x="451.0" y="93" class="f-mono f-ink" style="font-size:11px">20,86</text>
  <rect x="330" y="112" width="58.4" height="20" rx="2" class="f-accent"/>
  <text x="393.4" y="127" class="f-mono f-ink" style="font-size:11px">10,51</text>
  <rect x="330" y="146" width="64.9" height="20" rx="2" class="f-accent"/>
  <text x="399.9" y="161" class="f-mono f-ink" style="font-size:11px">11,67</text>
  <text x="510" y="24" class="f-label f-ink">нарады AMI</text>
  <line x1="510" x2="510" y1="36" y2="176" class="f-plain"/>
  <rect x="510" y="44" width="87.6" height="20" rx="2" class="f-muted"/>
  <text x="602.6" y="59" class="f-mono f-ink" style="font-size:11px">37,69</text>
  <rect x="510" y="78" width="109.4" height="20" rx="2" class="f-muted"/>
  <text x="624.4" y="93" class="f-mono f-ink" style="font-size:11px">47,08</text>
  <rect x="510" y="112" width="116.0" height="20" rx="2" class="f-accent"/>
  <text x="631.0" y="127" class="f-mono f-ink" style="font-size:11px">49,93</text>
  <rect x="510" y="146" width="81.6" height="20" rx="2" class="f-accent"/>
  <text x="596.6" y="161" class="f-mono f-ink" style="font-size:11px">35,14</text>
  <line x1="562.5" x2="562.5" y1="109" y2="135" style="stroke:var(--ink);stroke-width:2"/>
  <text x="676" y="198" text-anchor="end" class="f-mono f-ink" style="font-size:11px">без 4 зацыкленых фраз у base.en 22,61</text>
  <line x1="562.5" x2="562.5" y1="135" y2="184" style="stroke:var(--ink);stroke-width:1"/>
</svg>
<figcaption>Памылковых слоў, %, пасля англійскага нармалізатара Whisper. Шэрыя гэта wav2vec2, данавучаныя на LibriSpeech, каляровыя гэта Whisper. Маштаб слупкоў у кожнага набору свой.</figcaption>
</figure>

## На VoxPopuli парадак мяняецца на адваротны

На прамовах у парламенце ў wav2vec2 base 20,86% памылак, у large 13,05, у `tiny.en` 11,67 і ў `base.en` 10,51, блізка да артыкула. `base.en` быў лепшы за wav2vec2 base на 153 фразах і горшы на 9. Нават `tiny.en`, самы маленькі Whisper з 39 мільёнамі параметраў, абышоў wav2vec2 large на 1,4 пункта, інтэрвал ад −2,46 да −0,34.

## Нарада, дзе я ледзь не паверыў суме

Пасля першых 36 фраз нарады ў `base.en` было 17,68%. Калі палічыліся ўсе 200, стала 49,93, найгоршы вынік з 4 мадэляў: `tiny.en` 35,14, wav2vec2 large 37,69, wav2vec2 base 47,08.

Па асобных фразах `base.en` быў лепшы за wav2vec2 base на 159 і горшы на 22. Суму вырашылі 4 фразы, у іх 564 з 1016 памылак `base.en`:

- `oh that's true`, 0,98 секунды гуку, ператварылася ў `Thank you.`, паўторанае 29 разоў;
- `yeah yeah or one that yeah or one that`, 2,62 секунды, ператварылася ў `yeah`, паўторанае 112 разоў;
- `mine is serious chaos`, 10,15 секунды, ператварылася ў `I'm screaming.`, паўторанае 56 разоў;
- `but yeah it depends I mean I I really wanna put the summary in somewhere you know` запісана амаль правільна, далей ідзе `I'm going to do` і пасля яго `a little bit of`, паўторанае 54 разы.

У `tiny.en` такая фраза адна. Чалавек сказаў `D. and A.` за 0,41 секунды, а мадэль 24 разы запар выдала `See you in the next video.`

Без сваіх 4 фраз `base.en` памыляецца ў 22,61% слоў, а wav2vec2 large на тых жа 196 фразах у 37,32. У артыкуле 20,5 і 30,8 на ўсёй тэставай частцы AMI.

У Whisper ёсць праверка якраз супраць гэтага і я сам яе выключыў. Калі тэкст акна сціскаецца zlib больш чым у 2,4 раза, гэта лічыцца пятлёй. Калі сярэдняя лагарыфмічная верагоднасць яго токенаў ніжэй за −1, гэта лічыцца няўпэўненасцю. У абодвух выпадках акно дэкадуецца нанова пры больш высокай тэмпературы. З `temperature=0` падымацца няма куды.

Таму я прагнаў нараду яшчэ раз з наладамі `transcribe()` па змаўчанні. 4 пятлі `base.en` зніклі. `oh that's true` вярнулася пустым тэкстам, а `mine is serious chaos` ператварылася ў доўгі тэкст, якога няма ў эталоне: `Oh, they're all there. It's really on the other side of the car. I've got a phone in my iPhone. The mind is serious chaos.` Усяго ў `base.en` 24,96% памылак, ён лепшы за wav2vec2 large на 128 фразах і горшы на 29.

Адкат не бясплатны. На тых жа 4 ядрах на медыянную фразу сыходзіла 3,5 секунды працы, а на кожную з 8 самых павольных ад 49 да 123 секунд. Самай павольнай аказалася `she never said that`. Прагнае дэкадаванне запісала яе правільна, але з сярэдняй лагарыфмічнай верагоднасцю −1,01, крыху за парогам. Таму яе дэкадавалі нанова і атрымалі `But I don't have to look at further through this content.`

`tiny.en` з наладамі па змаўчанні даў 32,83%. Фраза пра наступнае відэа знікла, але цяпер `D. and A.` ператварылася ў `Do you know what you're saying?`. Тая ж `she never said that` выйшла як `She's never said bad.`, паўторанае 4 разы. Гэтая пятля засталася нават на апошняй тэмпературы.

Астатнія памылкі ў гэтых мадэляў розныя. wav2vec2 піша літары, якія пачуў. Whisper амаль заўсёды піша сапраўднае слова, хай і няправільнае.

<figure class="fig">
<svg viewBox="0 0 680 206" role="img" aria-label="2 фразы з нарад AMI. Эталон: IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW TRANSCRIPT OR TEXT OR WHATEVER. wav2vec2 large: IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT OR TEXT OR WHATEE. Whisper base.en: It does does an NXT search for the string, I don't know, transcript or text or whatever. Эталон: JUST SORT BANG ON IT. wav2vec2 large: SER BANGONT ASY. Whisper base.en: just for bang on it.">
  <text x="8" y="20" class="f-label f-muted">эталон</text>
  <text x="140" y="20" class="f-mono f-muted" style="font-size:11px">IT DOES DOES AN N. X. T. SEARCH FOR THE STRING I DON'T KNOW</text>
  <text x="140" y="36" class="f-mono f-muted" style="font-size:11px">TRANSCRIPT OR TEXT OR WHATEVER</text>
  <text x="8" y="56" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="56" class="f-mono f-ink" style="font-size:11px">IT DOS DOES AN ANNEX SEARCH FOR THE STRING IDE NOTE TRANSCRIPT</text>
  <text x="140" y="72" class="f-mono f-ink" style="font-size:11px">OR TEXT OR WHATEE</text>
  <text x="8" y="92" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="92" class="f-mono f-accent" style="font-size:11px">It does does an NXT search for the string, I don't know,</text>
  <text x="140" y="108" class="f-mono f-accent" style="font-size:11px">transcript or text or whatever.</text>
  <text x="8" y="142" class="f-label f-muted">эталон</text>
  <text x="140" y="142" class="f-mono f-muted" style="font-size:11px">JUST SORT BANG ON IT</text>
  <text x="8" y="162" class="f-label f-muted">wav2vec2 large</text>
  <text x="140" y="162" class="f-mono f-ink" style="font-size:11px">SER BANGONT ASY</text>
  <text x="8" y="182" class="f-label f-muted">Whisper base.en</text>
  <text x="140" y="182" class="f-mono f-accent" style="font-size:11px">just for bang on it.</text>
</svg>
<figcaption>AMI, мікрафон гарнітуры. Эталон вялікімі літарамі, як у корпусе, адказы мадэляў як ёсць.</figcaption>
</figure>

На нарадзе 9,60% слоў у вывадзе wav2vec2 base няма ў слоўніку LibriSpeech на 200 тысяч слоў. У wav2vec2 large такіх 5,85%, у `tiny.en` 0,77%, столькі ж, колькі ў самім эталоне. Няправільнае слова, падобнае на сапраўднае, пры чытанні заўважыць цяжэй. І ўсё роўна я лепш буду правіць `the summary in somewhere`, чым `THE SUMMARYNE SOME WHAR` ад wav2vec2 base.

## Шум

Як на малюнку 5 артыкула, я ўзяў першыя 100 сваіх фраз LibriSpeech. Дадаў белы шум з адносінамі сігнал/шум 10 дБ і 0 дБ. Пры 0 дБ сярэдняя магутнасць шуму такая ж, як у запісу разам з паўзамі.

Пры 10 дБ лепшая ўсё яшчэ wav2vec2 large, 4,74 супраць 8,81 у `base.en`. Інтэрвал гэтай розніцы ад 2,48 да 5,89 пункта. wav2vec2 base падае да 19,49, горш за `tiny.en`, у якога 14,76. Пры 0 дБ наперадзе абедзве Whisper: `base.en` 36,12, `tiny.en` 52,15, wav2vec2 large 63,16 і wav2vec2 base 90,75. На 6 фразах са 100 wav2vec2 base не вярнуў зусім нічога.

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="Доля памылковых слоў на тых жа 100 фразах LibriSpeech з белым шумам. Без шуму, адносіны сігнал/шум 10 дБ і 0 дБ. wav2vec2 large lv60 1,65%, 4,74%, 63,16%; wav2vec2 base 3,36%, 19,49%, 90,75%; Whisper base.en 3,25%, 8,81%, 36,12%; Whisper tiny.en 6,00%, 14,76%, 52,15%.">
  <line x1="70" x2="460" y1="230.0" y2="230.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="234.0" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" x2="460" y1="180.0" y2="180.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="184.0" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" x2="460" y1="130.0" y2="130.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="134.0" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" x2="460" y1="80.0" y2="80.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="84.0" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" x2="460" y1="30.0" y2="30.0" class="f-plain" style="opacity:.35"/>
  <text x="62" y="34.0" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="90" y="250" text-anchor="middle" class="f-label f-ink">без шуму</text>
  <text x="270" y="250" text-anchor="middle" class="f-label f-ink">10 дБ</text>
  <text x="450" y="250" text-anchor="middle" class="f-label f-ink">0 дБ</text>
  <polyline points="90.0,226.7 270.0,220.5 450.0,103.7" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="90.0" cy="226.7" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="220.5" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="103.7" r="3.5" class="f-muted"/>
  <text x="464" y="107.7" class="f-mono f-ink" style="font-size:11px">wav2vec2 large lv60 63,16</text>
  <polyline points="90.0,223.3 270.0,191.0 450.0,48.5" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="223.3" r="3.5" class="f-muted"/>
  <circle cx="270.0" cy="191.0" r="3.5" class="f-muted"/>
  <circle cx="450.0" cy="48.5" r="3.5" class="f-muted"/>
  <text x="464" y="52.5" class="f-mono f-ink" style="font-size:11px">wav2vec2 base 90,75</text>
  <polyline points="90.0,223.5 270.0,212.4 450.0,157.8" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="90.0" cy="223.5" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="212.4" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="157.8" r="3.5" class="f-accent"/>
  <text x="464" y="161.8" class="f-mono f-accent" style="font-size:11px">Whisper base.en 36,12</text>
  <polyline points="90.0,218.0 270.0,200.5 450.0,125.7" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:5 4"/>
  <circle cx="90.0" cy="218.0" r="3.5" class="f-accent"/>
  <circle cx="270.0" cy="200.5" r="3.5" class="f-accent"/>
  <circle cx="450.0" cy="125.7" r="3.5" class="f-accent"/>
  <text x="464" y="129.7" class="f-mono f-accent" style="font-size:11px">Whisper tiny.en 52,15</text>
</svg>
<figcaption>Тыя ж 100 фраз чыстага LibriSpeech, белы шум 10 дБ і 0 дБ.</figcaption>
</figure>

## Чаго я не правяраў

- Мадэлі большага памеру, beam search і налады каманднага радка, дзе па змаўчанні beam 5.
- Шум паба і музыку. Шум тут белы і дададзены мной.
- AMI тут гэта 3 нарады і 4 удзельнікі. Кожны лік вышэй атрыманы адным прагонам на 200 фразах.
- Ці справядлівы нармалізатар Whisper у адносінах да wav2vec2. Ён напісаны для вываду Whisper.

Для сваіх запісаў я пачну з `base.en` і пакіну адкат па тэмпературы ўключаным, але кароткія і ціхія кавалкі пасля яго буду перачытваць.
