---
title: "Мой афлайн галасавы пульт адказвае за секунду, толькі часцей за ўсё не на тое пытанне"
description: "Я сабраў у ланцужок Vosk, GPT-2 medium і eSpeak NG на ноўтбуку з 4 ГБ на ўсё. Адказ гатовы прыкладна праз секунду пасля адпускання клавішы, але на жывым маўленні маленькая мадэль Vosk памыляецца ў кожным трэцім слове, а GPT-2 гэтак жа ўпэўнена адказвае на няправільна пачутае пытанне. Упэўненасць Vosk па словах ловіць шмат такіх памылак."
date: 2021-10-23
lang: be
translationKey: voice-remote
tags: ["llm", "machine-learning", "performance"]
---
Мне хацелася задаваць пытанне мадэлі на ноўтбуку, не набіраючы яго. Пытанні пра ўласную працу часта прыходзяць, калі я не сяджу за клавіятурай. Заціскаеш клавішу, задаеш пытанне, адпускаеш і чуеш адказ, прычым нічога не сыходзіць з машыны. Дэталі для гэтага ёсць: Vosk распазнае маўленне, GPT-2 адказвае, `espeak-ng` агучвае. Я сабраў іх разам і замераў час.

Чаканне ў мяне было простае і я яго ні разу не правяраў. Распазнаванне гэта вырашаная частка. У README `vosk-model-small-en-us-0.15` напісана, што доля памылак у словах на LibriSpeech `test-clean` 9,85%, а затрымка 0,15 с. Павольнае і слабое месца гэта моўная мадэль, на яе я і збіраўся патраціць час.

## Стэнд

У машыны 4 ядры і няма GPU. Кожны прагон ідзе ў cgroup з жорсткім лімітам 4 ГБ і без свопу, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. Прыкладна столькі я аддаў бы пабочнаму праекту на ноўтбуку. Версіі гэтага тыдня: Python 3.9, torch 1.10.0 на CPU, transformers 4.11.3, vosk 0.3.31.

Сябе я не запісваў. Маўленне ўзяў з SLURP, гэта адкрыты набор, дзе людзі чытаюць з планшэта каманды і пытанні для хатняга асістэнта. Усё там запісана мікрафонным масівам у пакоі. Частка дыктараў была яшчэ і ў гарнітуры, таму некаторыя фразы ёсць у двух запісах. Я выбраў 150 розных фраз, у якіх ёсць абодва, гэта значыць 300 файлаў.

Клавіша тут умоўная. Гук ідзе ў распазнавальнік кавалкамі па 0,2 с у тэмпе маўлення. Адлік часу пачынаецца, калі файл скончыўся, гэта момант, калі я адпусціў клавішу. Калі распазнавальнік павольнейшы за маўленне, чарга расце і ўваходзіць у затрымку.

## Ланцужок хуткі

<figure class="fig">
<svg viewBox="0 0 680 212" role="img" aria-label="Час ад адпускання клавішы да гатовага адказу, 50 фраз з гарнітуры. Vosk 0,05 с; GPT-2 medium 0,87 с; eSpeak NG 0,13 с; медыяна 1,06 с; 90-ы перцэнтыль 3,09 с; горшая 3,6 с.">
  <rect x="47.5" y="60" width="217.5" height="26" rx="2" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="156.3" y="77" text-anchor="middle" class="f-muted" style="font-size:10px">маўленне, Vosk ужо працуе</text>
  <rect x="265.0" y="60" width="3.8" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="259.0" y="52" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">Vosk 0,05 с</text>
  <rect x="268.8" y="60" width="65.2" height="26" rx="1" class="f-box"/>
  <text x="272.8" y="100" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">GPT-2 medium 0,87 с</text>
  <rect x="333.9" y="60" width="9.9" height="26" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="333.9" y="52" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">eSpeak NG 0,13 с</text>
  <line x1="265" y1="24" x2="265" y2="166" class="f-line" style="stroke:var(--accent)"/>
  <text x="269" y="34" text-anchor="start" class="f-accent" style="font-size:10px">клавіша адпушчана</text>
  <line x1="265" y1="126" x2="344.3" y2="126" class="f-line" style="stroke-width:3"/>
  <text x="350.3" y="130" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">медыяна 1,06 с</text>
  <line x1="265" y1="144" x2="496.8" y2="144" class="f-line" style="stroke-width:1.5"/>
  <text x="502.8" y="148" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">90-ы перцэнтыль 3,09 с</text>
  <line x1="265" y1="162" x2="535.1" y2="162" class="f-line" style="stroke-width:1.5"/>
  <text x="541.1" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:10.5px">горшая 3,6 с</text>
  <line x1="40" y1="186" x2="640" y2="186" class="f-line"/>
  <line x1="40" y1="186" x2="40" y2="190" class="f-line"/>
  <text x="40" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-3 с</text>
  <line x1="115" y1="186" x2="115" y2="190" class="f-line"/>
  <text x="115" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-2 с</text>
  <line x1="190" y1="186" x2="190" y2="190" class="f-line"/>
  <text x="190" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">-1 с</text>
  <line x1="265" y1="186" x2="265" y2="190" class="f-line"/>
  <text x="265" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">0 с</text>
  <line x1="340" y1="186" x2="340" y2="190" class="f-line"/>
  <text x="340" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+1 с</text>
  <line x1="415" y1="186" x2="415" y2="190" class="f-line"/>
  <text x="415" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+2 с</text>
  <line x1="490" y1="186" x2="490" y2="190" class="f-line"/>
  <text x="490" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+3 с</text>
  <line x1="565" y1="186" x2="565" y2="190" class="f-line"/>
  <text x="565" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+4 с</text>
  <line x1="640" y1="186" x2="640" y2="190" class="f-line"/>
  <text x="640" y="202" text-anchor="middle" class="f-muted" style="font-size:10px">+5 с</text>
</svg>
<figcaption>Медыяны кожнага кроку на 50 фразах SLURP з гарнітуры: Vosk small 0.15, GPT-2 medium з прагным дэкадаваннем да 40 токенаў, eSpeak NG піша wav. Ніжэй увесь ланцужок: медыяна, 90-ы перцэнтыль і горшая фраза. Адзін прагон, 4 ядры, ліміт 4 ГБ.</figcaption>
</figure>

На 50 фразах з гарнітуры ланцужок быў такі: Vosk small, потым GPT-2 medium, потым `espeak-ng`. Ад адпускання клавішы да гатовага адказу медыяна выйшла 1,06 с, горшы выпадак 3,6 с. Распазнавальнік заняў з гэтага 0,05 с, бо працаваў, пакуль чалавек яшчэ гаварыў. На медыяннай фразе GPT-2 medium заняла 84% часу. 5 самых павольных адказаў гэта тыя, што дайшлі да майго ліміту ў 40 токенаў. Усё разам дало пік 3363 МБ, так што ў 4 ГБ змяшчаецца.

Пакуль усё супадала з чаканнем: мадэль павольная, распазнаванне амаль нічога не каштуе. Потым я паклаў расшыфроўкі побач з эталоннымі тэкстамі SLURP.

## Слабае месца гэта слых

Адна з першых фраз была "is it sunny what's the temperature". Vosk пачуў "is it son new what's the temperature". GPT-2 medium адказала:

```
it's not son new, it's son new.
```

Гэта не адзінкавы выпадак. З 50 пытанняў замеру ў 38 GPT-2 атрымала расшыфроўку, якая не супадала з тым, што сказалі. На ўсіх 150 фразах з гарнітуры маленькая мадэль Vosk распазнала цалкам правільна 32. Доля памылак у словах у яе 32,7%, больш чым у 3 разы вышэйшая за лічбу з README. З мікрафонам у пакоі 53,2%.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Доля памылак у словах у чатырох распазнавальнікаў на адных і тых жа 150 фразах, гарнітура і мікрафон у пакоі. Vosk small 0.15: гарнітура 32,7%, мікрафон у пакоі 53,2%, 0,05 с пасля адпускання, пік 205 МБ; Vosk 0.21, rescore, без rnnlm: гарнітура 25,2%, мікрафон у пакоі 43,2%, 0,22 с пасля адпускання, пік 2214 МБ; Vosk 0.21, без rescore і rnnlm: гарнітура 29,8%, мікрафон у пакоі 47,8%, 0,22 с пасля адпускання, пік 339 МБ; wav2vec2 base 960h: гарнітура 43,4%, мікрафон у пакоі 69,1%, 0,43 с пасля адпускання, пік 1377 МБ; Vosk 0.21 як ёсць: забітая пры загрузцы, пры ліміце 4 ГБ і 5,5 ГБ.">
  <circle cx="230" cy="14" r="5" class="f-box"/>
  <text x="240" y="18" text-anchor="start" class="f-muted" style="font-size:11px">гарнітура</text>
  <circle cx="350" cy="14" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="360" y="18" text-anchor="start" class="f-muted" style="font-size:11px">мікрафон у пакоі</text>
  <text x="20" y="44" text-anchor="start" class="f-ink" style="font-size:12px">Vosk small 0.15</text>
  <text x="20" y="59" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,05 с пасля адпускання, пік 205 МБ</text>
  <line x1="393.5" y1="40" x2="496.0" y2="40" class="f-line"/>
  <circle cx="393.5" cy="40" r="5" class="f-box"/>
  <circle cx="496.0" cy="40" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="393.5" y="31" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">32,7%</text>
  <text x="496.0" y="31" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">53,2%</text>
  <text x="20" y="88" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, rescore, без rnnlm</text>
  <text x="20" y="103" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,22 с пасля адпускання, пік 2214 МБ</text>
  <line x1="356.0" y1="84" x2="446.0" y2="84" class="f-line"/>
  <circle cx="356.0" cy="84" r="5" class="f-box"/>
  <circle cx="446.0" cy="84" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="356.0" y="75" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">25,2%</text>
  <text x="446.0" y="75" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">43,2%</text>
  <text x="20" y="132" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21, без rescore і rnnlm</text>
  <text x="20" y="147" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,22 с пасля адпускання, пік 339 МБ</text>
  <line x1="379.0" y1="128" x2="469.0" y2="128" class="f-line"/>
  <circle cx="379.0" cy="128" r="5" class="f-box"/>
  <circle cx="469.0" cy="128" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="379.0" y="119" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">29,8%</text>
  <text x="469.0" y="119" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">47,8%</text>
  <text x="20" y="176" text-anchor="start" class="f-ink" style="font-size:12px">wav2vec2 base 960h</text>
  <text x="20" y="191" text-anchor="start" class="f-mono f-muted" style="font-size:9.5px">0,43 с пасля адпускання, пік 1377 МБ</text>
  <line x1="447.0" y1="172" x2="575.5" y2="172" class="f-line"/>
  <circle cx="447.0" cy="172" r="5" class="f-box"/>
  <circle cx="575.5" cy="172" r="5" class="f-plain" style="fill:var(--muted)"/>
  <text x="447.0" y="163" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">43,4%</text>
  <text x="575.5" y="163" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">69,1%</text>
  <text x="20" y="220" text-anchor="start" class="f-ink" style="font-size:12px">Vosk 0.21 як ёсць</text>
  <text x="230" y="220" text-anchor="start" class="f-mono f-accent" style="font-size:10.5px">забітая пры загрузцы, пры ліміце 4 ГБ і 5,5 ГБ</text>
  <line x1="230" y1="238" x2="630" y2="238" class="f-line"/>
  <line x1="230" y1="238" x2="230" y2="242" class="f-line"/>
  <text x="230" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">0%</text>
  <line x1="330" y1="238" x2="330" y2="242" class="f-line"/>
  <text x="330" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="430" y1="238" x2="430" y2="242" class="f-line"/>
  <text x="430" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="530" y1="238" x2="530" y2="242" class="f-line"/>
  <text x="530" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="630" y1="238" x2="630" y2="242" class="f-line"/>
  <text x="630" y="254" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <text x="630" y="270" text-anchor="end" class="f-muted" style="font-size:10px">доля памылак у словах</text>
</svg>
<figcaption>Адны і тыя ж 150 фраз SLURP, кожная запісаная гарнітурай і мікрафонам у пакоі. Пад кожнай назвай: медыяна чакання пасля адпускання клавішы і пік памяці прагону. Словы параўноўваюцца без уліку рэгістра і пунктуацыі.</figcaption>
</figure>

Я паспрабаваў яшчэ 2 распазнавальнікі. `facebook/wav2vec2-base-960h` праз transformers тут аказаўся горшым, 43,4% на гарнітуры. Акрамя таго, яму патрэбны ўвесь запіс, таму пасля адпускання клавішы ён працуе яшчэ 0,43 с, гэта медыяна. Навучаны ён толькі на LibriSpeech, гэта значыць на аўдыякнігах.

Вялікая мадэль Vosk, `vosk-model-en-us-0.21`, важыць 1,75 ГБ у архіве і я чакаў, што яна спакойна змесціцца. Яе забілі пры ліміце 4 ГБ і яшчэ раз пры 5,5 ГБ, абодва разы падчас загрузкі. Я пакапаўся ў `model.cc`, пакуль не зразумеў, у чым справа. Акрамя графа ў мадэлі 2 папкі: `rescore` з моўнай мадэллю на 1,9 ГБ і `rnnlm` з нейрасеткавай. Пры загрузцы Vosk разгортвае прыкметы слоў RNNLM у поўную матрыцу. З `rnnlm` і без `rescore` пік загрузкі быў 3315 МБ, без абедзвюх папак 293 МБ.

Без `rnnlm` і з `rescore` пік загрузкі 2157 МБ, а доля памылак на гарнітуры 25,2%. Гэта мой лепшы вынік, але ўсё роўна памылковае кожнае чацвёртае слова. Без абедзвюх папак 29,8%.

Выходзіць, чаканне падвяло там, куды я не глядзеў. Я прачытаў 9,85% у README і не падумаў, што такое `test-clean`. Гэта доўгія сказы з аўдыякніг, начытаныя ў добры мікрафон. SLURP гэта кароткія каманды, прачытаныя ў пакоі.

## Vosk ведае, калі не ўпэўнены

З памылкамі я гатовы жыць, але нішто ў ланцужку не кажа "я не пачуў". Vosk выдае адзін радок. GPT-2 адказвае на яго гэтак жа ўпэўнена, як на правільны.

Vosk умее сказаць больш. З `SetWords(True)` кожнае слова ў выніку прыходзіць з упэўненасцю ад 0 да 1. Я ўзяў самую нізкую ўпэўненасць у слове ў кожнай фразе і зрабіў з яе фільтр. Ніжэй за парог пульт просіць паўтарыць, а не думае над адказам.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="150 фраз з гарнітуры, Vosk small, парог па самай нізкай упэўненасці ў слове 0,5. Пачуў правільна і адказаў: 31. Пачуў правільна і перапытаў: 1. Пачуў няправільна і перапытаў: 45. Пачуў няправільна і адказаў: 73.">
  <text x="40" y="26" text-anchor="start" class="f-ink" style="font-size:12px">пачуў правільна, адказаў: 31</text>
  <rect x="40" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="142" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="159" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="176" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="193" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="210" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="227" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="244" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="261" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="278" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="295" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="312" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="329" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="346" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="363" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="380" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="397" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="414" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="431" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="448" y="34" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="40" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="57" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="74" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="91" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="108" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <rect x="125" y="51" width="14" height="14" rx="2" class="f-plain" style="stroke:var(--accent)"/>
  <text x="40" y="92" text-anchor="start" class="f-ink" style="font-size:12px">пачуў правільна, перапытаў: 1</text>
  <rect x="40" y="100" width="14" height="14" rx="2" class="f-box" style="stroke-dasharray:2 2"/>
  <text x="40" y="141" text-anchor="start" class="f-ink" style="font-size:12px">пачуў няправільна, перапытаў: 45</text>
  <rect x="40" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="380" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="397" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="414" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="431" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="448" y="149" width="14" height="14" rx="2" class="f-box"/>
  <rect x="40" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="57" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="74" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="91" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="108" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="125" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="142" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="159" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="176" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="193" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="210" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="227" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="244" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="261" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="278" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="295" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="312" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="329" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="346" y="166" width="14" height="14" rx="2" class="f-box"/>
  <rect x="363" y="166" width="14" height="14" rx="2" class="f-box"/>
  <text x="40" y="207" text-anchor="start" class="f-ink" style="font-size:12px">пачуў няправільна, адказаў: 73</text>
  <rect x="40" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="215" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="431" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="448" y="232" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="40" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="57" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="74" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="91" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="108" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="125" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="142" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="159" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="176" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="193" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="210" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="227" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="244" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="261" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="278" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="295" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="312" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="329" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="346" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="363" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="380" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="397" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <rect x="414" y="249" width="14" height="14" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
</svg>
<figcaption>Адзін квадрат гэта адна фраза. Фільтр глядзіць на самую нізкую ўпэўненасць у слове з SetWords(True) і перапытвае, калі яна ніжэй за 0,5. Vosk small 0.15, 150 запісаў з гарнітуры.</figcaption>
</figure>

У маленькай мадэлі на 150 фразах з гарнітуры фільтр з парогам 0,5 спыніў 45 са 118 няправільных расшыфровак. Правільных ён спыніў толькі 1 з 32. Пры парозе 0,7 ён спыніў 90 няправільных, але і 5 правільных. З мікрафонам у пакоі пры 0,5 ён спыніў 66 са 139 няправільных і 1 з 11 правільных. Пры 0,5 міма яго ўсё яшчэ праходзяць 73 няправільныя расшыфроўкі, але 45 няправільных менш коштам 1 страчанага правільнага пытання гэта добры абмен за некалькі радкоў кода.

Другая танная рэч гэта прагаварыць расшыфроўку перад адказам. Адказ і так рыхтуецца каля секунды. Калі першым я чую "is it son new", я перастаю слухаць і пытаюся зноў.

У наступнай версіі пульт паўторыць пачутае і перапытае, калі самая нізкая ўпэўненасць ніжэй за 0,5. Моўная мадэль пакуль застаецца GPT-2 medium.

## Чаго я не правяраў

- Свой голас і свой мікрафон. У SLURP іншыя людзі ў іншых пакоях, а мікрафон у пакоі там гэта масіў, а не той, што ў маім ноўтбуку.
- Гукавую прыладу. Час сканчаецца, калі `espeak-ng` запісаў гук, прайграванне ў яго не ўваходзіць.
- Словы абуджэння і аўтаматычнае вызначэнне канца маўлення. Клавіша замяняе і тое і другое.
- Якасць адказаў. GPT-2 medium не мадэль для адказаў на пытанні. На правільных расшыфроўках яна таксама кажа дзіўнае. Я лічыў толькі, ці атрымала яна тое пытанне, якое задалі.
- Паўторы. Кожная лічба ўзятая з аднаго прагону на агульнай машыне. Другі прагон зрушыў асобныя замеры часу максімум на траціну, а медыяны менш чым на 10%, расшыфроўкі не змяніліся.
- Як параўноўваліся словы. Рэгістр, пунктуацыю і апострафы я не ўлічваў. 5 са 150 фраз пачынаюцца з "olly", гэта імя асістэнта ў SLURP. Ніводзін распазнавальнік не запісаў яго ні разу.
