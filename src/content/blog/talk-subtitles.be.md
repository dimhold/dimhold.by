---
title: "Мае субтытры 2013 года да дакладу Рыча Хікі спыніліся на 5-й хвіліне. Whisper base на маім працэсары зрабіў бы ўвесь даклад за 9 гадзін"
description: "У 2013 годзе я парэзаў 153-хвілінны даклад Рыча Хікі на кавалкі па 5 секунд для распазнавання маўлення Google і правіў субтытры рукамі. Яны спыніліся на 5-й хвіліне і 37,3% слоў у іх разыходзяцца з пазнейшай адрэдагаванай расшыфроўкай. На 10 дакладах TED лакальны шлях, даступны да Whisper, гэта значыць Vosk з пунктуацыяй, памыляецца ў 8,02% слоў і траціць 17,9 секунды на хвіліну гуку. Whisper tiny.en і base.en на 3 дакладах даюць 3,91% і 3,27%, але на 4 ядрах працэсара base.en траціць 211 с на хвіліну."
date: 2022-10-09
lang: be
translationKey: talk-subtitles
tags: ["machine-learning", "text", "performance"]
---
10 мая 2013 года я завёў рэпазіторый, каб перакласці на рускую мову даклад Рыча Хікі Clojure Concurrency. Першы крок у README гэта англійскія субтытры ў WebVTT і ў гэтым радку дагэтуль стаіць 5%. 21 верасня OpenAI выпусціла Whisper. Праз 5 дзён яго камандны радок навучыўся пісаць файлы SRT. Таму я вярнуўся ў той рэпазіторый паглядзець, колькі мне каштавала праца 2013 года і колькі тая ж праца каштуе цяпер.

## Што я рабіў у 2013 годзе

Рэпазіторый захоўвае ўвесь працэс. Там ёсць старонка з відэа і кнопкай "Freeze time", якая піша `video.currentTime` у лог. З яе дапамогай я лавіў, дзе фраза пачынаецца і дзе канчаецца. 19 мая я закаміціў 1219 файлаў JSON з адказамі распазнавання маўлення Google, па адным на кожны пяцісекундны кавалак дакладу ў FLAC. Самы першы адказ: "hi welcome a thank you for waiting um my name is Ricky and I'm here to talk about".

153 хвіліны даюць 1838 такіх кавалкаў і для 619 з іх файла няма. Заканамернасць я заўважыў толькі цяпер. 592 кавалкі з тых, якіх бракуе, гэта трэці кавалак пятнаццацісекунднага блока, з 10-й па 15-ю секунду. Падобна на памылку ў маім уласным скрыпце нарэзкі, але гэтага скрыпта ў мяне больш няма, таму праверыць не магу. З файлаў, якія ёсць, у 19 напісана NO_MATCH, а 1 гэта старонка HTML з "Internal Server Error".

<figure class="fig">
<svg viewBox="0 0 640 162" role="img" aria-label="Паласа з 50 клетак на першыя 4 хвіліны 10 секунд дакладу, па клетцы на пяцісекундны кавалак. З адказам: 31. З памылкай: 1. Без файла: 18. Пустая амаль кожная трэцяя клетка. Ва ўсім дакладзе ў 619 з 1838 кавалкаў няма файла. 592 з іх гэта трэці кавалак пятнаццацісекунднага блока.">
  <text x="12" y="18" class="f-label f-muted">Першыя 4 хвіліны 10 секунд, клетка на кожны пяцісекундны кавалак, адпраўлены ў Google</text>
  <rect x="12" y="28" width="10" height="10" class="f-accent"/>
  <text x="28" y="37" class="f-label f-ink">адказ</text>
  <rect x="150" y="28" width="10" height="10" class="f-ink"/>
  <text x="166" y="37" class="f-label f-ink">памылка або NO_MATCH</text>
  <rect x="340" y="28" width="10" height="10" class="f-box"/>
  <text x="356" y="37" class="f-label f-ink">няма файла</text>
  <rect x="40" y="56" width="9" height="28" class="f-accent"/>
  <rect x="51" y="56" width="9" height="28" class="f-box"/>
  <rect x="62" y="56" width="9" height="28" class="f-box"/>
  <rect x="73" y="56" width="9" height="28" class="f-accent"/>
  <rect x="84" y="56" width="9" height="28" class="f-accent"/>
  <rect x="95" y="56" width="9" height="28" class="f-box"/>
  <rect x="106" y="56" width="9" height="28" class="f-accent"/>
  <rect x="117" y="56" width="9" height="28" class="f-ink"/>
  <rect x="128" y="56" width="9" height="28" class="f-box"/>
  <rect x="139" y="56" width="9" height="28" class="f-accent"/>
  <rect x="150" y="56" width="9" height="28" class="f-accent"/>
  <rect x="161" y="56" width="9" height="28" class="f-box"/>
  <rect x="172" y="56" width="9" height="28" class="f-accent"/>
  <rect x="183" y="56" width="9" height="28" class="f-accent"/>
  <rect x="194" y="56" width="9" height="28" class="f-box"/>
  <rect x="205" y="56" width="9" height="28" class="f-accent"/>
  <rect x="216" y="56" width="9" height="28" class="f-accent"/>
  <rect x="227" y="56" width="9" height="28" class="f-box"/>
  <rect x="238" y="56" width="9" height="28" class="f-accent"/>
  <rect x="249" y="56" width="9" height="28" class="f-accent"/>
  <rect x="260" y="56" width="9" height="28" class="f-box"/>
  <rect x="271" y="56" width="9" height="28" class="f-accent"/>
  <rect x="282" y="56" width="9" height="28" class="f-accent"/>
  <rect x="293" y="56" width="9" height="28" class="f-box"/>
  <rect x="304" y="56" width="9" height="28" class="f-accent"/>
  <rect x="315" y="56" width="9" height="28" class="f-accent"/>
  <rect x="326" y="56" width="9" height="28" class="f-box"/>
  <rect x="337" y="56" width="9" height="28" class="f-accent"/>
  <rect x="348" y="56" width="9" height="28" class="f-accent"/>
  <rect x="359" y="56" width="9" height="28" class="f-box"/>
  <rect x="370" y="56" width="9" height="28" class="f-accent"/>
  <rect x="381" y="56" width="9" height="28" class="f-accent"/>
  <rect x="392" y="56" width="9" height="28" class="f-box"/>
  <rect x="403" y="56" width="9" height="28" class="f-accent"/>
  <rect x="414" y="56" width="9" height="28" class="f-accent"/>
  <rect x="425" y="56" width="9" height="28" class="f-box"/>
  <rect x="436" y="56" width="9" height="28" class="f-accent"/>
  <rect x="447" y="56" width="9" height="28" class="f-accent"/>
  <rect x="458" y="56" width="9" height="28" class="f-box"/>
  <rect x="469" y="56" width="9" height="28" class="f-accent"/>
  <rect x="480" y="56" width="9" height="28" class="f-box"/>
  <rect x="491" y="56" width="9" height="28" class="f-accent"/>
  <rect x="502" y="56" width="9" height="28" class="f-box"/>
  <rect x="513" y="56" width="9" height="28" class="f-accent"/>
  <rect x="524" y="56" width="9" height="28" class="f-box"/>
  <rect x="535" y="56" width="9" height="28" class="f-accent"/>
  <rect x="546" y="56" width="9" height="28" class="f-accent"/>
  <rect x="557" y="56" width="9" height="28" class="f-box"/>
  <rect x="568" y="56" width="9" height="28" class="f-accent"/>
  <rect x="579" y="56" width="9" height="28" class="f-accent"/>
  <text x="40" y="100" class="f-label f-muted">0:00</text>
  <text x="172" y="100" class="f-label f-muted">1:00</text>
  <text x="304" y="100" class="f-label f-muted">2:00</text>
  <text x="436" y="100" class="f-label f-muted">3:00</text>
  <text x="568" y="100" class="f-label f-muted">4:00</text>
  <text x="12" y="130" class="f-label f-ink">Увесь даклад: у 619 з 1838 кавалкаў няма файла</text>
  <text x="12" y="150" class="f-label f-ink">592 з іх гэта кавалак з 10-й па 15-ю секунду пятнаццацісекунднага блока</text>
</svg>
<figcaption>Пропускі ідуць па маіх пятнаццацісекундных блоках, таму я падазраю свой скрыпт нарэзкі.</figcaption>
</figure>

Рэплікі я правіў рукамі, часткова да адказаў Google, часткова пасля. Файл `concurrency.vtt` чапаюць 52 каміты паміж 10 мая і 9 кастрычніка 2013 года. Многія з іх названыя паводле адзінай рэплікі, якую яны мяняюць, напрыклад "Update 00:01:11.361 --> 00:01:13.097". Чыстая частка канчаецца на 00:04:59. Далей ідуць чарнавікі без часу і адзін блок з часам каля 60-й хвіліны, з пытальнікамі там, дзе я не пачуў слова.

## Наколькі добра я чуў

У 2019 годзе нехта выклаў адрэдагаваную расшыфроўку гэтага дакладу ў рэпазіторый `talk-transcripts` на GitHub. Яна пачышчаная: "I am" замест "I'm" і без "um", таму сэнс яна перадае, але даслоўна маўлення не паўтарае. Я ўзяў частку да яе меткі `[Time 0:04:07]` і раскрыў скарачэнні ва ўсіх версіях. Потым усё прайшло праз англійскі нармалізатар, якім Whisper лічыць свае ж ацэнкі.

Кавалкі Google супалі ў 213 словах з 593. 273 слоў у тэксце Google няма, большасць з іх прыпадае на кавалкі без файла. Мае рэплікі супалі ў 390. З адрэдагаванай расшыфроўкай мае рэплікі разыходзяцца ў 37,3% слоў, а кавалкі Google у 65,3%. Частку гэтага дае рэдагаванне расшыфроўкі і колькі менавіта, я сказаць не магу. Я ніколі раней не правяраў свае рэплікі ні з чым і фраза на 0:24 паказвае, адкуль гэты лік. У расшыфроўцы стаіць "is built into the language", я запісаў "sponsored to a language", а Google пачуў "to Fort Worth". Гэта мая англійская 2013 года і Google тут не вінаваты.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="3 версіі фразы на 0:24. Расшыфроўка 2019 года: So tonight's talk is going to be sort of a general overview of Clojure, and a specific look at some of the concurrency support that is built into the language. Мая рэпліка 2013 года: So, tonight, talks is gone a be so a general overview of clojure and specific look at some of the concurrency support that sponsored to a language. Google 2013 года па кавалках: 0:20 programs in the way of soda, 0:25 няма файла, 0:30 cat some of the concurrency to Fort Worth, 0:35 памылка сервера.">
  <text x="12" y="18" class="f-label f-muted">З 0:20 па 0:40 дакладу</text>
  <text x="12" y="44" class="f-label f-ink">расшыфроўка, 2019</text>
  <text x="24" y="62" class="f-mono f-ink">So tonight's talk is going to be sort of a general overview of</text>
  <text x="24" y="80" class="f-mono f-ink">Clojure, and a specific look at some of the concurrency support</text>
  <text x="24" y="98" class="f-mono f-ink">that is built into the language.</text>
  <text x="12" y="126" class="f-label f-accent">мая рэпліка, 2013</text>
  <text x="24" y="144" class="f-mono f-ink">So, tonight, talks is gone a be so a general overview of</text>
  <text x="24" y="162" class="f-mono f-ink">clojure and specific look at some of the concurrency support</text>
  <text x="24" y="180" class="f-mono f-ink">that sponsored to a language.</text>
  <text x="12" y="208" class="f-label f-accent">Google, 2013</text>
  <text x="24" y="226" class="f-mono f-ink">0:20  programs in the way of soda</text>
  <text x="24" y="244" class="f-mono f-ink">0:25  [няма файла]</text>
  <text x="24" y="262" class="f-mono f-ink">0:30  cat some of the concurrency to Fort Worth</text>
  <text x="24" y="280" class="f-mono f-ink">0:35  [памылка сервера]</text>
</svg>
<figcaption>Сярэдзіна фразы прыпадае на кавалак 0:25, у якога няма файла.</figcaption>
</figure>

## Лакальны шлях, даступны да Whisper

Для Whisper мне патрэбны эталон, які супадае з маўленнем слова ў слова, а расшыфроўка Хікі адрэдагаваная. Копіі відэа, на якую спасылаецца мой README, таксама больш няма. Яна ляжала на rhcloud.com, а гэты хостынг закрыўся ў 2017 годзе. Таму параўнанне ідзе на тэставай частцы `TED-LIUM 3`, дзе расшыфроўкі амаль даслоўна супадаюць з маўленнем. У ёй 11 дакладаў, адзін доўжыцца 6 секунд і я яго выкінуў, так што застаецца 10 дакладаў і 148 хвілін.

Для лакальнага шляху я сабраў тое, што было даступна да верасня. Гэта ffmpeg, потым Vosk 0.3.43 з мадэллю `en-us-0.22-lgraph` (128 МБ), потым `vosk-recasepunc-en-0.22` для вялікіх літар і пунктуацыі. Пасля гэтага ідзе мой уласны нарэзчык рэплік. Ён пачынае новую рэпліку на паўзе ў 0,5 секунды або на канцы сказа. Яшчэ ён рэжа, калі тэкст перавысіў бы 84 знакі (2 радкі па 42) або 7 секунд. Склейка займае каля 70 радкоў на Python.

На ўсіх 10 дакладах гэты шлях памыляецца ў 8,02% слоў. Аўтары Vosk публікуюць для гэтай мадэлі на `TED-LIUM` 8,20% са сваёй нармалізацыяй. Усяму шляху трэба 17,9 секунды на хвіліну гуку на 1 ядры, пунктуацыя з іх займае 0,5 секунды. З кішэннай мадэллю `small-en-us-0.15` (40 МБ) хапае 4,5 секунды, але памылак 10,27%. Рэплікі чытаюцца, але мой нарэзчык рэжа па даўжыні. Першая рэпліка дакладу Гэры Флейка абрываецца пасярод фразы: "If I can leave you with one big idea today, it's that the whole of the data in which".

## Whisper на 4 ядрах

Я ўзяў Whisper на каміце ад 9 кастрычніка з PyTorch 1.12.1. Ён працаваў на віртуальнай машыне з 4 ядрамі AMD EPYC 7713 без GPU. Налады былі fp32 і камандны радок па змаўчанні, гэта значыць прамянёвы пошук шырынёй 5. Тут ён павольны. На дакладзе Гэры Флейка tiny.en траціць 83 секунды на хвіліну гуку, а base.en 211. Даклад на 20 хвілін у base.en займае больш за гадзіну. Таму tiny.en і base.en ішлі толькі на 3 самых кароткіх дакладах, разам 19 хвілін. small.en ішоў толькі на дакладзе Гэры Флейка і на іншай зборцы PyTorch. tiny.en і base.en на абедзвюх зборках запісалі байт у байт аднолькавыя файлы, таму таго ж я чакаю і ад small.en.

<figure class="fig">
<svg viewBox="0 0 640 276" role="img" aria-label="Доля няправільных слоў гарызантальнымі паласамі, для аднаго дакладу яшчэ машынны час у секундах на хвіліну гуку. 3 самыя кароткія даклады TED, 19 хвілін. Vosk small-en-us-0.15: няправільных 9,24%. Vosk en-us-0.22-lgraph: няправільных 7,84%. Vosk lgraph, кавалкі па 5 с: няправільных 12,20%. Whisper tiny.en: няправільных 3,91%. Whisper base.en: няправільных 3,27%. Толькі даклад Гэры Флейка, 6 хвілін. Vosk en-us-0.22-lgraph: няправільных 8,00%, 19 с на хвіліну, 1 ядро. Whisper tiny.en: няправільных 3,96%, 83 с на хвіліну, 4 ядры. Whisper base.en: няправільных 2,99%, 211 с на хвіліну, 4 ядры. Whisper small.en: няправільных 2,99%, 822 с на хвіліну, 4 ядры.">
  <text x="12" y="18" class="f-label f-muted">Няправільныя словы, %. Для дакладу Гэры Флейка яшчэ машынны час, с на хвіліну гуку</text>
  <text x="12" y="42" class="f-label f-ink">3 самыя кароткія даклады TED, 19 хвілін</text>
  <text x="12" y="71" class="f-label f-ink">Vosk small-en-us-0.15</text>
  <rect x="230" y="62" width="165.0" height="11" class="f-muted"/>
  <text x="401" y="72" class="f-label f-ink">9,24%</text>
  <text x="12" y="91" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="82" width="140.0" height="11" class="f-muted"/>
  <text x="376" y="92" class="f-label f-ink">7,84%</text>
  <text x="12" y="111" class="f-label f-ink">Vosk lgraph, кавалкі па 5 с</text>
  <rect x="230" y="102" width="217.9" height="11" class="f-muted"/>
  <text x="453.85714285714283" y="112" class="f-label f-ink">12,20%</text>
  <text x="12" y="131" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="122" width="69.8" height="11" class="f-accent"/>
  <text x="305.82142857142856" y="132" class="f-label f-ink">3,91%</text>
  <text x="12" y="151" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="142" width="58.4" height="11" class="f-accent"/>
  <text x="294.3928571428571" y="152" class="f-label f-ink">3,27%</text>
  <text x="12" y="172" class="f-label f-ink">Толькі даклад Гэры Флейка, 6 хвілін</text>
  <text x="12" y="201" class="f-label f-ink">Vosk en-us-0.22-lgraph</text>
  <rect x="230" y="192" width="142.9" height="11" class="f-muted"/>
  <text x="378.8571428571429" y="202" class="f-label f-ink">8,00%</text>
  <text x="560" y="202" class="f-label f-muted" text-anchor="end">19 с/хв</text>
  <text x="628" y="202" class="f-label f-muted" text-anchor="end">1 ядро</text>
  <text x="12" y="221" class="f-label f-ink">Whisper tiny.en</text>
  <rect x="230" y="212" width="70.7" height="11" class="f-accent"/>
  <text x="306.7142857142857" y="222" class="f-label f-ink">3,96%</text>
  <text x="560" y="222" class="f-label f-muted" text-anchor="end">83 с/хв</text>
  <text x="628" y="222" class="f-label f-muted" text-anchor="end">4 ядры</text>
  <text x="12" y="241" class="f-label f-ink">Whisper base.en</text>
  <rect x="230" y="232" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="242" class="f-label f-ink">2,99%</text>
  <text x="560" y="242" class="f-label f-muted" text-anchor="end">211 с/хв</text>
  <text x="628" y="242" class="f-label f-muted" text-anchor="end">4 ядры</text>
  <text x="12" y="261" class="f-label f-ink">Whisper small.en</text>
  <rect x="230" y="252" width="53.4" height="11" class="f-accent"/>
  <text x="289.39285714285717" y="262" class="f-label f-ink">2,99%</text>
  <text x="560" y="262" class="f-label f-muted" text-anchor="end">822 с/хв</text>
  <text x="628" y="262" class="f-label f-muted" text-anchor="end">4 ядры</text>
</svg>
<figcaption>Whisper памыляецца больш чым удвая радзей за Vosk. На дакладзе Гэры Флейка яму трэба ад 4 да 44 разоў больш часу, чым Vosk, на 4 ядрах супраць аднаго.</figcaption>
</figure>

Перад прагонам я запісаў, што tiny.en будзе прыкладна на ўзроўні Vosk. Гэта не так. На 3 дакладах Vosk памыляецца ў 7,84% слоў, а tiny.en у 3,91%. base.en памыляецца ў 3,27%. Для таго, хто правіць тэкст, гэта каля 78 выпраўленняў на 1000 слоў пасля Vosk і каля 33 пасля base.en. small.en на дакладзе Гэры Флейка памыляецца ў 2,99% слоў, роўна столькі ж, колькі base.en на тым жа дакладзе. Пры гэтым ён траціць 822 секунды на хвіліну гуку.

Яшчэ я чакаў, што сегменты Whisper будуць занадта доўгімі для субтытраў, бо ён працуе вокнамі па 30 секунд. Гэта таксама не пацвердзілася. Самы доўгі сегмент base.en займае 65 знакаў і ніводзін не даўжэйшы за 84. Прыкладна палова даўжэйшая за 42 знакі і ім патрэбны перанос радка. Whisper яго не ставіць, але і мой нарэзчык яго не ставіць.

Апошнім прагонам была мая схема 2013 года на навейшым распазнавальніку. Я даў Vosk тыя ж 10 дакладаў кавалкамі па 5 секунд і закрываў выказванне на кожнай мяжы. Ён памыліўся ў 12,49% слоў супраць 8,02% на цэлых файлах. Значыць, нават без зніклых кавалкаў нарэзка кожныя 5 секунд каштуе 4,5 пункта. На 3 кароткіх дакладах гэта 12,20% супраць 7,84%.

Для аднаго дакладу я ўзяў бы Whisper і пачакаў. Для дакладу Хікі, 153 хвіліны, base.en спатрэбілася б каля 9 гадзін на гэтых 4 ядрах.

## Чаго я не правяраў

- Час рэплік. Я не параўноўваў, дзе пачынаецца рэпліка і дзе пачынаецца фраза, хоць у 2013 годзе дзеля гэтага зрабіў асобную кнопку.
- GPU. На GPU хуткасць іншая і я яе не мераў.
- medium і large, на іх тут не хапіла б часу.
- Дакладчыкаў з акцэнтам. Дакладчыкі TED у асноўным гавораць на чыстай англійскай.
- Ці былі тэставыя даклады ў навучальных даных Whisper. Даклады TED з расшыфроўкамі ляжаць па ўсім інтэрнэце, таму выключыць гэта я не магу.
- Whisper на самім Хікі.
