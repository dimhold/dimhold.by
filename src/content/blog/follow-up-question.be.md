---
title: "Я спытаў маленькую мадэль \"And Leon?\", каб зразумець, што патрэбна чату ў ChatGPT"
description: "ChatGPT адкрыўся 30 лістапада. Спачатку я тлумачыў яго першы тыдзень полем для тэксту. Я даў Flan-T5 base і large і GPT-2 large перапіску з нататкамі пра 3 людзей і задаў кароткія пытанні кшталту \"And Leon?\". Flan-T5 large правільна адказвае на ўсе, Flan-T5 base адказвае на \"And Leon?\" узростам, а GPT-2, якую не вучылі слухацца інструкцый, адказвае правільна 3 разы з 4."
date: 2022-12-11
lang: be
translationKey: follow-up-question
tags: ["llm", "machine-learning", "text"]
---
ChatGPT адкрыўся ў сераду, 30 лістапада. У панядзелак Сэм Альтман напісаў, што ў яго больш за 1 мільён карыстальнікаў. Паводле OpenAI, мадэль дапрацавалі на аснове мадэлі з серыі GPT-3.5, а сама GPT-3 даступная праз API з 2020 года. Таму спачатку я тлумачыў гэты тыдзень полем для тэксту. Наколькі я разумею, чат гэта ўся перапіска, якую з кожным новым паведамленнем зноў адпраўляюць мадэлі, так што тое, што людзям падабаецца найбольш, павінна працаваць і на значна меншай мадэлі. Я маю на ўвазе кароткае пытанне: пытаешся, кім працуе Simon, потым пішаш "And Leon?" і атрымліваеш адказ, кім працуе Leon.

Я і раней называў прадукты з чатам "проста абгорткай" і ні разу не правяраў, што гэтай абгортцы трэба ад мадэлі. Таму праверыў на мадэлях, якія ў снежні 2022 года можа спампаваць хто заўгодна. Пытанне не новае. CoQA і QuAC (2018) збіраюць пытанні, якія залежаць ад папярэдніх рэплік. У CANARD (2019) людзі перапісваюць такія пытанні ў самастойныя, бо мадэлі, якія адказваюць на пытанні, з залежнымі спраўляюцца горш. Мой тэст значна меншы.

## Стэнд

Мадэлі: Flan-T5 base (248M параметраў) і Flan-T5 large (783M), якія Google выклаў 20 кастрычніка пасля таго, як іх навучылі выконваць інструкцыі на 1836 задачах. Для кантролю я ўзяў GPT-2 large (774M) 2019 года, якую слухацца інструкцый не вучылі зусім. Запускаў на torch 1.13.0 і transformers 4.25.1, на 4 ядрах працэсара, з прагным (greedy) дэкадаваннем.

Першыя пытанні былі пра хімічныя элементы: "What is the chemical symbol for gold?", потым "And silver?". Пасля першага прагону я іх выкінуў. Flan-T5 base не назвала правільна ніводнага з 40 атамных нумароў, а сімвалы пісала малымі літарамі, "li" для літыю. У хуткай праверцы Flan-T5 large паведаміла мне, што атамны нумар золата 58, а "Гамлета" напісаў "thomas keats". Я лічыў, што мадэль, якая выконвае інструкцыі, ведае і табліцу Мендзялеева.

Тады я перанёс факты ў саму размову. У першым паведамленні нататкі пра 3 людзей, мадэль адказвае "OK." і далей ідуць пытанні. Такіх запісаў 120. У кожным двое аднаго полу, так што "she" без папярэдняй рэплікі можа датычыць любога з іх.

Для кожнага запісу ёсць поўнае пытанне ("How old is Leon?"). Далей 2 кароткія пытанні мяняюць чалавека ("And Leon?", "What about Leon?") і 2 мяняюць поле праз займеннік. Адно гэта пытанне кшталту "How old is she?" або "Where does he live?", другое кароткі зварот без дзеяслова, напрыклад "And her age?" або "And his city?". Кожнае задаецца з папярэдняй рэплікай і без яе. Пры першым падліку я залічваў "Leon is 58, works as a chef and lives" як адказ на "And Leon?". Гэта ўвесь радок з нататак, і правіла цяпер строгае: адказ залічваецца, толькі калі ў ім ёсць правільнае значэнне і няма нічога іншага пра гэтага чалавека або пра кагосьці яшчэ. Правіла датычыць усіх адказаў, так што яно адсявае і некаторыя правільныя, напрыклад "Laura is a pilot and lives in Torun."

Да прагону я запісаў, па чым будзе відаць, што чат толькі абгортка. Кароткія пытанні з папярэдняй рэплікай павінны адставаць ад поўнага пытання не больш чым на 10 пунктаў, а без яе быць амаль на ўзроўні выпадковага адгадвання.

## Вялікая мадэль амаль не памылялася

Flan-T5 large правільна адказала на поўнае пытанне ў 113 запісах з 120. З папярэдняй рэплікай яна правільна адказала на ўсе 4 віды кароткіх пытанняў ва ўсіх 120 запісах. Без яе выйшла 50 з 240 для новага чалавека і 77 з 240 для новага поля.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Стэнаграма. User: Here are some notes about three people. Simon is 24, works as a teacher and lives in Wroclaw. Leon is 58, works as a chef and lives in Szczecin. Sofia is 54, works as a dentist and lives in Gdansk. Assistant: OK. User: What does Simon do for a living? Assistant: Teacher. User: And Leon? Адказы з папярэдняй рэплікай і без яе. Flan-T5 large: Chef. Без яе: Leon is 58, works as a chef and lives Flan-T5 base: Leon is 58. Без яе: Simon is 24. GPT-2 large: Chef. Без яе: Leon is a teacher.">
  <text x="12" y="18" class="f-label f-muted">Запіс 0 з 120, папярэдняя рэпліка і кароткае пытанне</text>
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
  <text x="150" y="226" class="f-label f-muted">з папярэдняй рэплікай</text>
  <text x="330" y="226" class="f-label f-muted">без яе</text>
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
<figcaption>Правільны адказ Chef. Flan-T5 base адказвае ўзростам. Так яна робіць у 84 запісах з 120.</figcaption>
</figure>

Потым я зрабіў размову даўжэйшай. Паміж нататкамі і пытаннямі я ўстаўляў да 32 пабочных пытанняў з адказамі, напрыклад "How many legs does a spider have?" "8.". З 32 устаўкамі на ўваходзе каля 530 токенаў. Пры 2-16 устаўках вялікая мадэль зрэдку памылялася, не больш чым у 5 запісах з 120. Пры 32 яна зноў правільна адказала на "And Leon?" і на пытанні з займеннікам у 120 запісах з 120. Да прагону я запісаў, што да 512 токенаў даўжыня не павінна мець значэння. Так і выйшла. Пры 32 устаўках уваход ужо даўжэйшы за 512.

## Маленькая мадэль адказвае на "And Leon?" узростам

Займеннікі ў Flan-T5 base працуюць. Адказы на пытанні кшталту "How old is she?" правільныя ў 110 запісах з 120, на зварот "And her age?" у 97. На "And Leon?" яна правільна адказвае ў 36. Без папярэдняй рэплікі ў 34, так што перапіска амаль нічога не дадае.

У 84 адказах з 120 яна называе ўзрост чалавека: "Leon is 58." Калі папярэдняе пытанне было пра ўзрост, гэта выпадкова правільна, 29 з 39. Пасля пытання пра працу правільна 4 з 42, пасля пытання пра горад 3 з 39. "What about Leon?" лепш, 57 з 120. Магчыма, яна проста капіюе пачатак радка гэтага чалавека ў нататках, а ўзрост там стаіць першым.

<figure class="fig">
<svg viewBox="0 0 640 342" role="img" aria-label="Згрупаваныя палосы: правільныя адказы з 120 на 4 кароткія пытанні ў 3 мадэляў, з папярэдняй рэплікай і без яе. And Leon? Flan-T5 large: 120 з ёй, 28 без яе. And Leon? Flan-T5 base: 36 з ёй, 34 без яе. And Leon? GPT-2 large: 91 з ёй, 6 без яе. What about Leon? Flan-T5 large: 120 з ёй, 22 без яе. What about Leon? Flan-T5 base: 57 з ёй, 39 без яе. What about Leon? GPT-2 large: 94 з ёй, 24 без яе. How old is she? Flan-T5 large: 120 з ёй, 37 без яе. How old is she? Flan-T5 base: 110 з ёй, 42 без яе. How old is she? GPT-2 large: 81 з ёй, 44 без яе. And her age? Flan-T5 large: 120 з ёй, 40 без яе. And her age? Flan-T5 base: 97 з ёй, 29 без яе. And her age? GPT-2 large: 72 з ёй, 39 без яе.">
  <text x="12" y="18" class="f-label f-muted">Правільных адказаў з 120 запісаў</text>
  <rect x="12.0" y="30" width="12.0" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">з папярэдняй рэплікай</text>
  <rect x="260.0" y="30" width="12.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="278" y="39" class="f-label f-ink">без яе</text>
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
  <text x="12" y="332" class="f-label f-muted">рады 3 і 4 уключаюць усе 3 палі і he/his у запісах пра мужчын</text>
</svg>
<figcaption>Flan-T5 large адказвае на ўсе кароткія пытанні. Flan-T5 base спраўляецца з займеннікам, а на &quot;And Leon?&quot; адказвае амаль гэтак жа, як без папярэдняй рэплікі.</figcaption>
</figure>

На мой погляд, для "she" мадэлі дастаткова знайсці чалавека ў тэксце. Для "And Leon?" ёй трэба ўзяць пытанне з папярэдняй рэплікі і падставіць у яго новае імя. Мадэль на 248M спраўляецца толькі з займеннікам. Пры 32 устаўках вынік на "And Leon?" у яе падае да 24 з 120, а поўныя пытанні пры той жа даўжыні правільныя ў 115.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Лініі: правільныя адказы з 120 на &quot;And Leon?&quot; па меры таго, як паміж нататкамі і пытаннямі дадаюцца пабочныя пытанні з адказамі. Flan-T5 large: 0: 120, 2: 118, 8: 120, 16: 120, 32: 120. Flan-T5 base: 0: 36, 2: 39, 8: 41, 16: 36, 32: 24. GPT-2 large: 0: 91, 32: 102.">
  <text x="12" y="18" class="f-label f-muted">&quot;And Leon?&quot; з пабочнымі ўстаўкамі пасярэдзіне, правільных з 120</text>
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
  <text x="330" y="250" class="f-label f-muted" text-anchor="middle">пабочных устаўак (токенаў Flan-T5 на ўваходзе)</text>
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
<figcaption>З 32 устаўкамі на ўваходзе каля 530 токенаў. Flan-T5 large трымаецца на 120, Flan-T5 base падае з 36 да 24, GPT-2 large расце з 91 да 102.</figcaption>
</figure>

## Мадэль, якую не вучылі слухацца інструкцый

Я чакаў, што GPT-2 large праваліцца ўсюды. На поўнае пытанне яна правільна адказала ў 89 запісах з 120, горш за абедзве мадэлі Flan. Але на "And Leon?" з папярэдняй рэплікай яна правільна адказвае ў 91 з 120, у 2,5 раза часцей за Flan-T5 base. Без рэплікі толькі ў 6. У 12 са сваіх промахаў яна адказала данымі папярэдняга чалавека: Daniel сантэхнік, а яна адказала "Farmer.", гэта значыць прафесіяй таго, пра каго пыталіся перад ім. Займеннікі ў яе слабае месца. Адказы на пытанні кшталту "How old is she?" правільныя ў 81 з папярэдняй рэплікай і ў 44 без яе. Пры 32 пабочных устаўках яна стала адказваць на "And Leon?" лепш, 102 з 120. Кожная ўстаўка гэта яшчэ адзін прыклад пытання з кароткім адказам.

Маё тлумачэнне гэта здагадка. Я яго не правяраў. Для GPT-2 перапіска проста тэкст, які трэба працягнуць. Пасля "What does Simon do for a living? Teacher." верагодны працяг "And Leon?" гэта яшчэ адна прафесія. Flan-T5 вучылі адказваць на інструкцыі па адной. Маленькая з іх чытае апошні радок як інструкцыю цалкам. Ёсць і розніца, якую я не кантраляваў. Токенізатар T5 выкідае пераносы радкоў, таму Flan-T5 бачыць перапіску адным радком з "User:" і "Assistant:" унутры.

## Што гэта мяняе для мяне

Кароткае пытанне аказалася танным. Мадэль на 783M, выпушчаная ў кастрычніку, амаль заўсёды адказвае на яго правільна, калі факты ляжаць у перапісцы. Нават GPT-2 2019 года адказвае на "And Leon?" правільна 3 разы з 4. Гэта падтрымлівае маю версію пра абгортку, але толькі што да механікі. Тая ж вялікая мадэль не ведае атамнага нумара золата. Доўга размаўляць з ёй я б не стаў. Так што поле для тэксту тлумачыць толькі частку таго, што адбылося за тыдзень. Кароткае пытанне дапамагае толькі пасля добрага першага адказу, а першы адказ я тут не мераў.

Ёсць яшчэ кошт, пра які я не думаў. У маёй схеме ў мадэлі няма памяці паміж рэплікамі, таму кожнае кароткае пытанне зноў адпраўляе ўсю размову. У самым доўгім маім выпадку 2 словы "And Leon?" каштавалі каля 530 токенаў на ўваходзе.

## Чаго я не правяраў

- Сам ChatGPT. У яго няма API, так што прагнаць праз яго 1000 пытанняў нельга.
- Сапраўдныя размовы. Людзі пішуць "не, другі" і "карацей". Мае шаблоны значна чысцейшыя.
- Даўжэйшыя размовы і іншыя мовы, акрамя англійскай.
- Flan-T5 XL на 3B параметраў. Яна не змяшчаецца ў 5 ГБ памяці, якія ў мяне ёсць на гэтай машыне.
- Кожны лік гэта адзін дэтэрмінаваны прагон з адным фарматам промпта. Іншы фармат мог бы зрушыць вынікі маленькай мадэлі.
