---
title: "У 2022 годзе доля новых рэпазіторыяў GitHub пра ШІ не вырасла. Выраслі зоркі"
description: "Я ўзяў па 2 гадзіны кожнага дня GH Archive за 2021 і 2022 гады і палічыў новыя рэпазіторыі GitHub, у якіх імя або апісанне пра ШІ. Сярод рэпазіторыяў з апісаннем гэта 1,36% у 2021 годзе і 1,44% у 2022, гэта значыць скачка няма. Змяніліся зоркі: генератыўныя рэпазіторыі выраслі з 0,10% усіх зорак у 2021 годзе да 3,07% у снежні 2022."
date: 2022-12-25
lang: be
translationKey: github-archive-ai-repos
tags: ["open-data", "machine-learning", "statistics"]
---
ChatGPT выйшаў 3 тыдні таму. Я ўзяў выбарку падзей GitHub за гэты месяц і 4 з 6 рэпазіторыяў, якія атрымалі найбольш зорак, аказаліся пра яго. Адзін гэта спіс падказак, астатнія гэта пашырэнне для браўзера, неафіцыйны кліент API і бот для WeChat. Вакол мяне кажуць, што сёлета ўсе пачалі свой ШІ-праект. Я і сам так казаў і не адзін раз. Ні разу не правяраў, хоць даныя для праверкі адкрытыя. GH Archive запісвае кожную публічную падзею на GitHub, гадзіну за гадзінай, з лютага 2011 года.

Пытанне атрымалася простае. Ці было ў 2022 годзе больш новых ШІ-рэпазіторыяў, чым у 2021, калі лічыць долю ад усіх новых?

## Як я лічыў

Кожная гадзіна ў GH Archive гэта адзін файл з падзеямі ў JSON, сціснуты gzip, у 2022 годзе ад 30 да 200 МБ. Калі нехта стварае рэпазіторый, з'яўляецца `CreateEvent` з `ref_type`, роўным `repository`. У ім ляжыць апісанне ў тым выглядзе, у якім яно было ў момант стварэння. Чытаць трэба 2 палі, імя і апісанне. Форкі ідуць асобнай падзеяй і ў гэты лік не трапляюць.

Я ўзяў 2 гадзіны кожнага дня, 04:00 і 16:00 UTC, з 1 студзеня 2021 па 24 снежня 2022 года. Першая гадзіна прыпадае на дзень у Азіі, другая на раніцу ў Амерыцы. Усяго 1446 гадзін. 19 з іх у GH Archive няма зусім: 2 дні ў жніўні 2021 года і тыдзень у кастрычніку 2021. Засталося 1427 гадзін. Дыск у мяне быў амаль поўны, таму невялікі скрыпт на Python чытаў кожны файл патокам праз `curl` і `gzip` і захоўваў толькі лічыльнікі.

Рэпазіторый лічыцца ШІ, калі пра гэта кажа яго імя або апісанне. Словы такія: machine learning, deep learning, neural, NLP, computer vision, TensorFlow, PyTorch, YOLO, асобнае слова "AI" і яшчэ некалькі накшталт Keras, BERT або Kaggle. Унутры гэтага я вылучыў меншую групу для генератыўных рэчаў: GPT, ChatGPT, OpenAI без Gym, Stable Diffusion разам з інтэрфейсамі накшталт AUTOMATIC1111, DreamBooth, DALL-E, Midjourney, Whisper. Whisper гэта распазнаванне маўлення, але ён выйшаў у OpenAI той самай восенню і я пакінуў яго ў гэтай групе.

Потым я прачытаў вачыма 100 выпадковых рэпазіторыяў 2022 года. 60 з іх метка ўзяла, а 40 злавіў шырэйшы фільтр і метка адкінула. Памыляецца метка рэдка, але прапускае шмат. Які-небудзь "house price prediction" або праект на Vision Transformer звычайна пра машыннае навучанне, але патрэбных слоў не мае. Таму кожная доля ніжэй гэта ніжняя мяжа, палічаная аднолькава для абодвух гадоў.

## Кастрычнік 2022

Першы вынік: 1,05% новых рэпазіторыяў у 2021 годзе і 0,91% у 2022. Менш. У кастрычніку 2022 доля ўпала да 0,65% і ў мяне ўжо была гатовая фраза пра тое, што ўсе пайшлі з ШІ ў нешта іншае.

Потым я паглядзеў на сам кастрычнік. У верасні ў маёй выбарцы 444 234 новыя рэпазіторыі, у кастрычніку 677 185. Я адкрыў адну гадзіну, 10 кастрычніка 16:00 UTC. У ёй 15 267 новых рэпазіторыяў і ў 12 856 з іх няма апісання. 8 самых актыўных акаўнтаў стварылі за гэтую гадзіну ад 125 да 241 рэпазіторыя кожны, з выпадковымі імёнамі. 2 з іх называюцца pgslotzaa і PGSLOTTH888, гэта падобна на тайскія сайты анлайн-слотаў. Гэта быў спам. І не толькі ў гэтую гадзіну, так выглядае амаль увесь кастрычнік.

У 2021 годзе ў выбарцы 1 434 695 новых рэпазіторыяў з апісаннем, у 2022 годзе 1 427 656. Амаль столькі ж. Рост GitHub у маёй выбарцы на 25% далі толькі рэпазіторыі без апісання, іх доля вырасла з 61,5% да 69,3%. Таму я стаў лічыць долю сярод рэпазіторыяў з апісаннем. Я зыходжу з таго, што спам-акаўнты апісанняў здебольшага не пішуць. Кастрычніцкая гадзіна гэта пацвярджае.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Доля новых публічных рэпазіторыяў GitHub, у якіх імя або апісанне пра ШІ або машыннае навучанне, па месяцах са студзеня 2021 па снежань 2022 года, выбарка ў 04:00 і 16:00 UTC кожнага дня. Сярод рэпазіторыяў з апісаннем: студз 21 1,76%, лют 1,72%, сак 1,28%, крас 1,42%, трав 1,95%, чэрв 1,63%, ліп 1,11%, жн 0,81%, вер 1,28%, кастр 1,30%, ліст 1,30%, снеж 1,33%, студз 22 1,33%, лют 1,23%, сак 1,26%, крас 1,46%, трав 1,51%, чэрв 1,36%, ліп 1,61%, жн 1,44%, вер 1,46%, кастр 1,50%, ліст 1,47%, снеж 1,70%. Сярод усіх новых: студз 21 1,14%, лют 1,11%, сак 0,97%, крас 1,02%, трав 1,27%, чэрв 1,43%, ліп 0,98%, жн 0,81%, вер 0,95%, кастр 0,99%, ліст 0,95%, снеж 1,00%, студз 22 0,96%, лют 0,89%, сак 0,87%, крас 0,97%, трав 1,06%, чэрв 0,93%, ліп 0,99%, жн 0,95%, вер 0,87%, кастр 0,65%, ліст 0,93%, снеж 1,07%. Другая лінія падае да 0,65% у кастрычніку 2022 года, калі спам-акаўнты стварылі шмат рэпазіторыяў без апісання. Першая трымаецца паміж 0,81% і 1,95%.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,0%</text>
  <line x1="56" y1="151.0" x2="650" y2="151.0" class="f-plain"/>
  <text x="50" y="155.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,5%</text>
  <line x1="56" y1="106.0" x2="650" y2="106.0" class="f-plain"/>
  <text x="50" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,0%</text>
  <line x1="56" y1="61.0" x2="650" y2="61.0" class="f-plain"/>
  <text x="50" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,5%</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2,0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">студз 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">крас</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ліп</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кастр</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">студз 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">крас</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ліп</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кастр</text>
  <path d="M56.0,37.2L81.8,41.4L107.7,80.9L133.5,67.9L159.3,20.4L185.1,49.5L211.0,95.9L236.8,122.8L262.6,81.1L288.4,79.4L314.3,79.0L340.1,76.4L365.9,76.2L391.7,85.6L417.6,83.0L443.4,64.3L469.2,60.2L495.0,74.0L520.9,50.9L546.7,66.0L572.5,65.0L598.3,61.3L624.2,63.4L650.0,43.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,93.5L81.8,96.5L107.7,109.1L133.5,104.2L159.3,81.8L185.1,67.5L211.0,107.4L236.8,123.3L262.6,110.5L288.4,107.2L314.3,110.2L340.1,105.7L365.9,110.0L391.7,115.7L417.6,117.9L443.4,108.7L469.2,100.2L495.0,112.4L520.9,107.0L546.7,110.7L572.5,117.7L598.3,137.6L624.2,111.9L650.0,99.5" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="37.2" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="41.4" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="80.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="67.9" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="20.4" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="49.5" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="95.9" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="122.8" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="81.1" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="79.4" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="79.0" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="76.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="76.2" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="85.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="83.0" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="64.3" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="60.2" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="74.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="50.9" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="66.0" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="65.0" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="61.3" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="63.4" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="43.0" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="93.5" r="2" class="f-ink"/>
  <circle cx="81.8" cy="96.5" r="2" class="f-ink"/>
  <circle cx="107.7" cy="109.1" r="2" class="f-ink"/>
  <circle cx="133.5" cy="104.2" r="2" class="f-ink"/>
  <circle cx="159.3" cy="81.8" r="2" class="f-ink"/>
  <circle cx="185.1" cy="67.5" r="2" class="f-ink"/>
  <circle cx="211.0" cy="107.4" r="2" class="f-ink"/>
  <circle cx="236.8" cy="123.3" r="2" class="f-ink"/>
  <circle cx="262.6" cy="110.5" r="2" class="f-ink"/>
  <circle cx="288.4" cy="107.2" r="2" class="f-ink"/>
  <circle cx="314.3" cy="110.2" r="2" class="f-ink"/>
  <circle cx="340.1" cy="105.7" r="2" class="f-ink"/>
  <circle cx="365.9" cy="110.0" r="2" class="f-ink"/>
  <circle cx="391.7" cy="115.7" r="2" class="f-ink"/>
  <circle cx="417.6" cy="117.9" r="2" class="f-ink"/>
  <circle cx="443.4" cy="108.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="100.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="112.4" r="2" class="f-ink"/>
  <circle cx="520.9" cy="107.0" r="2" class="f-ink"/>
  <circle cx="546.7" cy="110.7" r="2" class="f-ink"/>
  <circle cx="572.5" cy="117.7" r="2" class="f-ink"/>
  <circle cx="598.3" cy="137.6" r="2" class="f-ink"/>
  <circle cx="624.2" cy="111.9" r="2" class="f-ink"/>
  <circle cx="650.0" cy="99.5" r="2" class="f-ink"/>
  <text x="592.3" y="141.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0,65%</text>
  <text x="644.0" y="35.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1,70%</text>
  <text x="598.3" y="155.6" text-anchor="middle" class="f-label f-muted">спам у кастрычніку</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">сярод новых рэпазіторыяў з апісаннем</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">сярод усіх новых рэпазіторыяў</text>
</svg>
<figcaption>GH Archive, CreateEvent, 2 гадзіны ў суткі. Снежань 2022 года палічаны па 24 снежня.</figcaption>
</figure>

З такім назоўнікам выходзіць 1,36% у 2021 годзе і 1,44% у 2022. За 24 месяцы доля скача паміж 0,81% і 1,95%. Снежань 2022 года дае 1,70%, але ў маі 2021 было больш. Калі 2022 год і быў выбухам ШІ-рэпазіторыяў, то ў тым, што людзі ствараюць, я яго не бачу.

Я не першы, хто гэта правяраў. OSS Insight у лістападзе 2022 года выпусціў справаздачу, дзе ШІ-рэпазіторыі знойдзены па іх тэмах (topics), са студзеня па верасень. Паводле іх высновы, хуткі рост адкрытага ШІ прыпаў на 2016 і 2017 гады, а потым стаў павольным. У мяне толькі 2 гады і пра 2016 я нічога сказаць не магу, але скачка ў 2022 годзе я таксама не бачу. Іх перыяд заканчваецца яшчэ да ChatGPT, праз 5 тыдняў пасля таго, як Stable Diffusion выклаў вагі.

## Дзе змена

Генератыўная група маленькая, але яна рухаецца. У маёй выбарцы гэта 255 рэпазіторыяў за ўвесь 2021 год і 1152 за 2022. 70% рэпазіторыяў 2022 года прыпадаюць на перыяд з верасня па снежань.

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Новыя рэпазіторыі ў тыдзень пра GPT, ChatGPT, Stable Diffusion і іншыя генератыўныя мадэлі ў 2022 годзе, 14 гадзін выбаркі ў тыдзень (12 у апошнім). Па тыднях з панядзелка: 01-03 7, 01-10 7, 01-17 9, 01-24 5, 01-31 10, 02-07 6, 02-14 6, 02-21 7, 02-28 13, 03-07 10, 03-14 13, 03-21 14, 03-28 5, 04-04 13, 04-11 10, 04-18 9, 04-25 9, 05-02 11, 05-09 14, 05-16 13, 05-23 6, 05-30 7, 06-06 7, 06-13 15, 06-20 9, 06-27 10, 07-04 7, 07-11 14, 07-18 9, 07-25 8, 08-01 9, 08-08 15, 08-15 9, 08-22 27, 08-29 18, 09-05 19, 09-12 25, 09-19 28, 09-26 24, 10-03 25, 10-10 34, 10-17 22, 10-24 19, 10-31 34, 11-07 31, 11-14 26, 11-21 26, 11-28 66, 12-05 155, 12-12 130, 12-19 126. У ліпені і першай палове жніўня ад 7 да 15 у тыдзень, пасля выхаду вагаў Stable Diffusion ад 18 да 34, у 3 наступныя тыдні пасля выхаду ChatGPT 30 лістапада па 155, 130 і 126.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56" y1="142.3" x2="650" y2="142.3" class="f-plain"/>
  <text x="50" y="146.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="56" y1="88.5" x2="650" y2="88.5" class="f-plain"/>
  <text x="50" y="92.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56" y1="34.8" x2="650" y2="34.8" class="f-plain"/>
  <text x="50" y="38.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="56" y="14" class="f-label f-muted">у тыдзень</text>
  <rect x="57.0" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="68.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="80.3" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="91.9" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="103.6" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="115.2" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="126.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="138.5" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="150.2" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="161.8" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="173.5" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="185.1" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="196.8" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="208.4" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="220.1" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="231.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="243.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="255.0" y="184.2" width="9.6" height="11.8" rx="1" class="f-box"/>
  <rect x="266.6" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="278.3" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="289.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="301.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="313.2" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="324.9" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="336.5" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="348.2" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="359.8" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="371.5" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="383.1" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="394.8" y="187.4" width="9.6" height="8.6" rx="1" class="f-box"/>
  <rect x="406.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="418.1" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="429.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="441.4" y="167.0" width="9.6" height="29.0" rx="1" class="f-box"/>
  <rect x="453.0" y="176.7" width="9.6" height="19.3" rx="1" class="f-box"/>
  <rect x="464.6" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="476.3" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="487.9" y="165.9" width="9.6" height="30.1" rx="1" class="f-box"/>
  <rect x="499.6" y="170.2" width="9.6" height="25.8" rx="1" class="f-box"/>
  <rect x="511.2" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="522.9" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="534.5" y="172.3" width="9.6" height="23.7" rx="1" class="f-box"/>
  <rect x="546.2" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="557.8" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="569.5" y="162.7" width="9.6" height="33.3" rx="1" class="f-box"/>
  <rect x="581.1" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="592.8" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="604.4" y="125.0" width="9.6" height="71.0" rx="1" class="f-accent"/>
  <rect x="616.1" y="29.4" width="9.6" height="166.6" rx="1" class="f-accent"/>
  <rect x="627.7" y="56.3" width="9.6" height="139.8" rx="1" class="f-accent"/>
  <rect x="639.4" y="60.6" width="9.6" height="135.4" rx="1" class="f-accent"/>
  <line x1="440.4" y1="34" x2="440.4" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="436.4" y="30" text-anchor="end" class="f-label f-muted">вагі Stable Diffusion</text>
  <line x1="606.7" y1="34" x2="606.7" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="602.7" y="30" text-anchor="end" class="f-label f-muted">ChatGPT</text>
  <text x="56.0" y="212" class="f-mono f-muted" style="font-size:11px">студз</text>
  <text x="160.8" y="212" class="f-mono f-muted" style="font-size:11px">сак</text>
  <text x="254.0" y="212" class="f-mono f-muted" style="font-size:11px">трав</text>
  <text x="358.8" y="212" class="f-mono f-muted" style="font-size:11px">ліп</text>
  <text x="463.6" y="212" class="f-mono f-muted" style="font-size:11px">вер</text>
  <text x="568.5" y="212" class="f-mono f-muted" style="font-size:11px">ліст</text>
</svg>
<figcaption>Тыдзень пачынаецца з панядзелка. У апошнім слупку 12 гадзін выбаркі замест 14.</figcaption>
</figure>

У ліпені і першай палове жніўня іх было ад 7 да 15 у тыдзень на мае 14 гадзін выбаркі. Stable Diffusion выклаў вагі 22 жніўня і з гэтага тыдня іх стала ад 18 да 34. ChatGPT выйшаў 30 лістапада. На гэты тыдзень прыпадае 66, на наступныя 3 тыдні 155, 130 і 126. У апошнім з іх толькі 12 гадзін, бо мае даныя заканчваюцца 24 снежня. У снежні генератыўная група гэта 460 з 3268 ШІ-рэпазіторыяў, 14%. Ад усяго, што створана на GitHub, гэта па-ранейшаму 0,15%.

Зорка ў GH Archive гэта `WatchEvent` і апісання ў яе няма. Таму тут я размячаў рэпазіторыі па поўным імені разам з уладальнікам. Так у лік трапляе `openai/whisper`.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Доля ўсіх зорак GitHub у выбарцы, якая дасталася ШІ-рэпазіторыям, па месяцах са студзеня 2021 па снежань 2022 года. Генератыўныя рэпазіторыі: студз 21 0,17%, лют 0,10%, сак 0,14%, крас 0,09%, трав 0,10%, чэрв 0,06%, ліп 0,12%, жн 0,09%, вер 0,05%, кастр 0,06%, ліст 0,08%, снеж 0,09%, студз 22 0,06%, лют 0,09%, сак 0,05%, крас 0,20%, трав 0,20%, чэрв 0,52%, ліп 0,19%, жн 0,64%, вер 1,43%, кастр 1,08%, ліст 0,75%, снеж 3,07%. Астатнія рэпазіторыі ШІ і машыннага навучання: студз 21 2,91%, лют 2,63%, сак 2,72%, крас 2,65%, трав 2,40%, чэрв 2,68%, ліп 2,82%, жн 2,62%, вер 2,70%, кастр 2,35%, ліст 2,70%, снеж 2,32%, студз 22 2,28%, лют 2,16%, сак 2,45%, крас 2,46%, трав 2,60%, чэрв 2,44%, ліп 2,33%, жн 2,20%, вер 2,26%, кастр 2,18%, ліст 2,21%, снеж 2,32%. Другая лінія трымаецца паміж 2,16% і 2,91%. Першая каля 0,1% у 2021 годзе, 1,43% у верасні 2022 і 3,07% у снежні 2022.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,0%</text>
  <line x1="56" y1="144.6" x2="650" y2="144.6" class="f-plain"/>
  <text x="50" y="148.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,0%</text>
  <line x1="56" y1="93.1" x2="650" y2="93.1" class="f-plain"/>
  <text x="50" y="97.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2,0%</text>
  <line x1="56" y1="41.7" x2="650" y2="41.7" class="f-plain"/>
  <text x="50" y="45.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3,0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">студз 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">крас</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ліп</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кастр</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">студз 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">крас</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ліп</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кастр</text>
  <path d="M56.0,187.3L81.8,190.9L107.7,188.9L133.5,191.5L159.3,191.0L185.1,192.9L211.0,190.0L236.8,191.6L262.6,193.5L288.4,193.0L314.3,191.9L340.1,191.4L365.9,193.1L391.7,191.6L417.6,193.2L443.4,185.9L469.2,185.8L495.0,169.0L520.9,186.4L546.7,162.8L572.5,122.6L598.3,140.6L624.2,157.6L650.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,46.6L81.8,60.7L107.7,56.2L133.5,59.9L159.3,72.4L185.1,58.1L211.0,50.8L236.8,61.2L262.6,57.0L288.4,75.1L314.3,57.1L340.1,76.9L365.9,78.7L391.7,84.9L417.6,70.2L443.4,69.7L469.2,62.2L495.0,70.7L520.9,76.3L546.7,83.0L572.5,79.8L598.3,83.7L624.2,82.6L650.0,76.9" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="187.3" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="190.9" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="188.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="191.5" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="191.0" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="192.9" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="190.0" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="193.5" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="193.0" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="191.9" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="191.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="193.1" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="193.2" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="185.9" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="185.8" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="169.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="186.4" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="162.8" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="122.6" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="140.6" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="157.6" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="38.2" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="46.6" r="2" class="f-ink"/>
  <circle cx="81.8" cy="60.7" r="2" class="f-ink"/>
  <circle cx="107.7" cy="56.2" r="2" class="f-ink"/>
  <circle cx="133.5" cy="59.9" r="2" class="f-ink"/>
  <circle cx="159.3" cy="72.4" r="2" class="f-ink"/>
  <circle cx="185.1" cy="58.1" r="2" class="f-ink"/>
  <circle cx="211.0" cy="50.8" r="2" class="f-ink"/>
  <circle cx="236.8" cy="61.2" r="2" class="f-ink"/>
  <circle cx="262.6" cy="57.0" r="2" class="f-ink"/>
  <circle cx="288.4" cy="75.1" r="2" class="f-ink"/>
  <circle cx="314.3" cy="57.1" r="2" class="f-ink"/>
  <circle cx="340.1" cy="76.9" r="2" class="f-ink"/>
  <circle cx="365.9" cy="78.7" r="2" class="f-ink"/>
  <circle cx="391.7" cy="84.9" r="2" class="f-ink"/>
  <circle cx="417.6" cy="70.2" r="2" class="f-ink"/>
  <circle cx="443.4" cy="69.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="62.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="70.7" r="2" class="f-ink"/>
  <circle cx="520.9" cy="76.3" r="2" class="f-ink"/>
  <circle cx="546.7" cy="83.0" r="2" class="f-ink"/>
  <circle cx="572.5" cy="79.8" r="2" class="f-ink"/>
  <circle cx="598.3" cy="83.7" r="2" class="f-ink"/>
  <circle cx="624.2" cy="82.6" r="2" class="f-ink"/>
  <circle cx="650.0" cy="76.9" r="2" class="f-ink"/>
  <text x="566.5" y="114.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1,43%</text>
  <text x="644.0" y="30.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">3,07%</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">генератыўныя: GPT, ChatGPT, Stable Diffusion</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">астатнія ШІ і машыннае навучанне</text>
</svg>
<figcaption>WatchEvent у GH Archive, 2 гадзіны ў суткі. Метка па ўладальніку і імені рэпазіторыя.</figcaption>
</figure>

Звычайныя рэпазіторыі машыннага навучання атрымалі 2,64% усіх зорак выбаркі ў 2021 годзе і 2,32% у 2022. Росту няма зусім. Генератыўныя атрымалі 0,10% у 2021 годзе, 1,43% у верасні 2022 і 3,07% у снежні. У верасні найбольш зорак сярод генератыўных было ў `CompVis/stable-diffusion` і `openai/whisper`. Кода ChatGPT на GitHub няма. У снежні першым ідзе `f/awesome-chatgpt-prompts`, спіс тэкставых падказак.

У снежні зоркі ў маёй выбарцы атрымалі 699 генератыўных рэпазіторыяў. Разам у іх 3,07% усіх зорак і першыя 3 з іх трымаюць 22% гэтай долі.

## Чаго я не правяраў

- Тэмы (topics). OSS Insight лічыў па іх, я па імёнах і апісаннях. Апісанне, дададзенае пасля стварэння, мне не відаць.
- 22 гадзіны кожнага дня. Мае лічбы гэта лік па выбарцы. Сапраўдныя лічбы значна большыя і пераводзіць іх на поўныя суткі я не спрабаваў.
- Зоркі рэпазіторыяў, якія як ШІ пазначае толькі імя ўладальніка. Поўны спіс я захоўваў толькі для імёнаў, што прайшлі шырокі фільтр, плюс топ-300 кожнай гадзіны.
- Прыватныя рэпазіторыі. GH Archive бачыць толькі публічныя падзеі.
- Ці не адны і тыя ж людзі стаяць за гэтымі 1,4%. Студэнт, які кожны тыдзень стварае новы `ML-Homework-3`, лічыцца кожны тыдзень.

Снежань яшчэ не скончыўся. Калі тыдні ChatGPT працягнуцца ў студзені, доля сярод новых рэпазіторыяў нарэшце зрушыцца. Пабачым.
