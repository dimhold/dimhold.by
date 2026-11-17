---
title: "Я ўласнаручна данавучыў маленькі T5 на інструкцыях. Ён вывучыў словы адказаў і ігнаруе варыянты, якімі ніколі не адказваў"
description: "Данавучыў T5 base (248M) на 6000 прыкладах з інструкцыямі. Адказваць словамі з навучання ён навучыўся за 408 прыкладаў, а варыянты, якімі ніколі не адказваў, накшталт true/false, ігнаруе."
date: 2022-02-23
lang: be
translationKey: instruction-tuning-by-hand
tags: ["llm", "machine-learning"]
---
У канцы студзеня OpenAI напісала, што за іх API цяпер стаяць мадэлі InstructGPT, данавучаныя выконваць інструкцыі. FLAN ад Google у верасні і T0 ад Hugging Face і BigScience у кастрычніку зрабілі падобнае без зваротнай сувязі ад людзей. Яны перапісваюць шмат набораў даных у выглядзе інструкцый і данавучаюць на іх мадэль. Пасля гэтага мадэль адказвае на задачы, якіх не бачыла.

Я сам пішу такія промпты з радком "Options: yes, no" у канцы і чакаю, што мадэль яго прачытае. Але я ні разу не правяраў, што мадэль насамрэч робіць з гэтым радком. Таму я ўзяў найменшую версію рэцэпта T0, якая змяшчаецца на 4 ядрах працэсара. Яе я і паўтарыў уласнаручна.

## Стэнд

Я ўзяў мадэль `t5-base-lm-adapt` ад Google. Гэта T5 v1.1 base на 248M параметраў, дадаткова навучаны як звычайная моўная мадэль. T0 пачынаецца з таго ж сямейства чэкпойнтаў, толькі на 3B і 11B. Вучыў я з Adafactor з хуткасцю навучання 0,001 і батчам 8. Кожны прыклад мадэль бачыць адзін раз. Усе ацэнкі ніжэй я палічыў яшчэ раз на torch 1.10.2 і transformers 4.16.2.

Для навучання я ўзяў 6 набораў па 1000 прыкладаў. SST-2 і IMDB гэта танальнасць, AG News гэта тэмы навін. QQP і MRPC пытаюцца, ці значаць 2 тэксты адно і тое ж, BoolQ задае пытанні так/не па ўрыўку тэксту. Для праверкі я ўзяў тыпы задач, на якіх мадэль ніколі не вучылася, як гэта робіць T0. У RTE і CB трэба вырашыць, ці вынікае адзін сказ з другога. У WiC трэба вырашыць, ці мае слова адно і тое ж значэнне ў 2 сказах. Яшчэ я ўзяў тыя ж 277 пар з RTE з "Options: true, false" замест "yes, no". Гэтыя 2 словы ні разу не сустракаюцца ў навучанні як адказ. Не сустракаецца і maybe, трэці варыянт у CB. Каб праверыць і задачу з навучання, я адклаў 300 водгукаў SST-2, якіх у навучанні не было.

Праверачны промпт true/false выглядае так:

```
Pibul Songgram was the pro-Japanese military dictator of Thailand during World War 2.

Is it true or false that "Pibul was the dictator of Thailand."?

Options: true, false
```

Мадэль я лічыў паслухмянай, калі ўвесь яе адказ гэта адно з пералічаных слоў.

## Базавая мадэль наогул не адказвае

Адказ атрымалі 0 з 1548 праверачных промптаў. У 126 промптах з 300 пра танальнасць базавая мадэль напісала ", positive, negative,". У 273 промптах з 277 з true/false яна напісала ", false.". На такіх промптах яна працягвае апошні радок замест адказу. Я разумею гэта так: для моўнай мадэлі гэты радок пачатак спіса. Яна яго і працягвае. На промптах так/не яна часцей за ўсё піша адну кропку ці ", no.".

Тут я памыліўся. Мой першы скрыпт падліку выкідваў усю пунктуацыю перад параўнаннем, таму ", false." ператваралася ў "false". Базавая мадэль атрымлівалася паслухмянай на 98,6% на true/false. Я ў гэта верыў, пакуль не паглядзеў на сырыя адказы і не ўбачыў коску перад кожным адказам.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Промпт пра Пібула Сонграма, які заканчваецца радком &quot;Options: true, false&quot;. Адказы: базавая мадэль &quot;, false.&quot;, навучаная без інструкцый &quot;no&quot;, навучаная з інструкцыямі &quot;yes&quot;, навучаная са зменлівымі варыянтамі &quot;yes&quot;. Правільны адказ true.">
  <text x="12" y="18" class="f-label f-muted">1 пара з RTE з варыянтамі, якімі мадэль ніколі не адказвала</text>
  <text x="12" y="42" class="f-label f-muted">Промпт</text>
  <text x="24" y="62" class="f-mono f-ink">Pibul Songgram was the pro-Japanese military dictator of</text>
  <text x="24" y="80" class="f-mono f-ink">Thailand during World War 2.</text>
  <text x="24" y="98" class="f-mono f-ink">Is it true or false that &quot;Pibul was the dictator of Thailand.&quot;?</text>
  <text x="24" y="116" class="f-mono f-ink">Options: true, false</text>
  <rect x="12" y="46" width="560" height="84" class="f-plain"/>
  <text x="12" y="152" class="f-label f-ink">базавая мадэль</text>
  <line x1="300" y1="148" x2="350" y2="148" class="f-line"/>
  <text x="362" y="152" class="f-mono f-muted">&quot;, false.&quot;</text>
  <text x="12" y="176" class="f-label f-ink">навучаная без інструкцый</text>
  <line x1="300" y1="172" x2="350" y2="172" class="f-line"/>
  <text x="362" y="176" class="f-mono f-accent">&quot;no&quot;</text>
  <text x="12" y="200" class="f-label f-ink">навучаная з інструкцыямі</text>
  <line x1="300" y1="196" x2="350" y2="196" class="f-line"/>
  <text x="362" y="200" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="224" class="f-label f-ink">навучаная са зменлівымі варыянтамі</text>
  <line x1="300" y1="220" x2="350" y2="220" class="f-line"/>
  <text x="362" y="224" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="252" class="f-label f-muted">правільны адказ: true</text>
</svg>
<figcaption>Базавая мадэль працягвае радок Options. Данавучаныя адказваюць словамі са свайго навучання.</figcaption>
</figure>

## Каля 400 прыкладаў хапае, каб яна пачала адказваць

Спачатку я навучыў версію з інструкцыямі. Кожны навучальны прыклад гэта пытанне плюс "Options: ..." як вышэй. Ужо пасля 51 кроку яна адказвае пералічаным словам амаль на кожны промпт так/не і пра танальнасць. Гэта ўсяго 408 прыкладаў. Але амаль на кожную пару яна адказвае "yes", на RTE 276 разоў з 277.

Пасля поўнага праходу яна ўсё яшчэ кажа "yes" на 261 з 277 пар RTE. Дакладнасць 51,6%, а заўсёды "yes" дае 52,7%. На WiC яна дае 54,5%, а манета дае 50%. CB дае 46,4%, гэта ніжэй за 50%, якія дае адказ "no" на ўсё. На SST-2, задачы з навучання, яна дае 87,0%. Так што на новых тыпах задач гэта амаль угадванне. Фармат там гэта амаль усё, што я бачу з вывучанага.

## Потым яна ігнаруе варыянты

На версіі true/false яна адказала "yes" 239 разоў і "no" 35 разоў. Ні разу не адказала true ці false. На CB яна ні разу не сказала maybe. Паслухмянасць на true/false роўная 0%. Тыя ж пары з yes/no даюць 99,6%.

## Мадэль без інструкцый

Каб зразумець, што інструкцыі дадаюць да простага навучання на многіх задачах, я навучыў другую мадэль без ніякай інструкцыі. Яна бачыла тыя ж 6000 прыкладаў, толькі сырыя палі тэксту і слова адказу. Я чакаў, што на true/false мадэль з інструкцыямі апярэдзіць яе больш чым на 30 пунктаў. З адказам так/не яна амаль гэтак жа паслухмяная на новых задачах, 94,6% на RTE і 96,1% на WiC. У адрозненне ад мадэлі з інструкцыямі, любімае слова ў яе "no", 256 разоў на RTE. True/false і тут дае 0%, так што разрыву не аказалася зусім. У маім стэндзе інструкцыя для новых слоў адказу не дала нічога.

SST-2 мяне здзівіў. Гэтая мадэль таксама вучылася на танальнасці. Але з маёй інструкцыяй вакол водгуку яна адказала "no" ці "yes" на 234 з 300, так што паслухмянасць усяго 22,0%. Мне здаецца, што водгук унутры інструкцыі выглядае для яе як пытанне так/не.

<figure class="fig">
<svg viewBox="0 0 640 204" role="img" aria-label="Табліца паслухмянасці. базавая, SST-2 знаёмая задача: 0%. базавая, RTE yes, no: 0%. базавая, WiC yes, no: 0%. базавая, CB yes, no, maybe: 0%. базавая, RTE true, false: 0%. без інструкцый, SST-2 знаёмая задача: 22%. без інструкцый, RTE yes, no: 94,6%. без інструкцый, WiC yes, no: 96,1%. без інструкцый, CB yes, no, maybe: 89,3%. без інструкцый, RTE true, false: 0%. з інструкцыямі, SST-2 знаёмая задача: 100%. з інструкцыямі, RTE yes, no: 99,6%. з інструкцыямі, WiC yes, no: 100%. з інструкцыямі, CB yes, no, maybe: 100%. з інструкцыямі, RTE true, false: 0%. зменлівыя варыянты, SST-2 знаёмая задача: 100%. зменлівыя варыянты, RTE yes, no: 100%. зменлівыя варыянты, WiC yes, no: 100%. зменлівыя варыянты, CB yes, no, maybe: 94,6%. зменлівыя варыянты, RTE true, false: 0%.">
  <text x="12" y="18" class="f-label f-muted">Доля адказаў, якія дакладна супадаюць з адным з пералічаных варыянтаў, %</text>
  <text x="170" y="44" class="f-label f-ink">SST-2</text>
  <text x="170" y="58" class="f-label f-muted">знаёмая задача</text>
  <text x="262" y="44" class="f-label f-ink">RTE</text>
  <text x="262" y="58" class="f-label f-muted">yes, no</text>
  <text x="354" y="44" class="f-label f-ink">WiC</text>
  <text x="354" y="58" class="f-label f-muted">yes, no</text>
  <text x="446" y="44" class="f-label f-ink">CB</text>
  <text x="446" y="58" class="f-label f-muted">yes, no, maybe</text>
  <text x="538" y="44" class="f-label f-ink">RTE</text>
  <text x="538" y="58" class="f-label f-muted">true, false</text>
  <text x="12" y="84" class="f-label f-ink">базавая</text>
  <text x="170" y="84" class="f-mono f-ink">0</text>
  <rect x="170" y="90" width="80" height="5" class="f-plain"/>
  <text x="262" y="84" class="f-mono f-ink">0</text>
  <rect x="262" y="90" width="80" height="5" class="f-plain"/>
  <text x="354" y="84" class="f-mono f-ink">0</text>
  <rect x="354" y="90" width="80" height="5" class="f-plain"/>
  <text x="446" y="84" class="f-mono f-ink">0</text>
  <rect x="446" y="90" width="80" height="5" class="f-plain"/>
  <text x="538" y="84" class="f-mono f-ink">0</text>
  <rect x="538" y="90" width="80" height="5" class="f-plain"/>
  <text x="12" y="114" class="f-label f-ink">без інструкцый</text>
  <text x="170" y="114" class="f-mono f-ink">22</text>
  <rect x="170" y="120" width="80" height="5" class="f-plain"/>
  <rect x="170" y="120" width="17.6" height="5" class="f-accent"/>
  <text x="262" y="114" class="f-mono f-accent">94,6</text>
  <rect x="262" y="120" width="80" height="5" class="f-plain"/>
  <rect x="262" y="120" width="75.7" height="5" class="f-accent"/>
  <text x="354" y="114" class="f-mono f-accent">96,1</text>
  <rect x="354" y="120" width="80" height="5" class="f-plain"/>
  <rect x="354" y="120" width="76.9" height="5" class="f-accent"/>
  <text x="446" y="114" class="f-mono f-ink">89,3</text>
  <rect x="446" y="120" width="80" height="5" class="f-plain"/>
  <rect x="446" y="120" width="71.4" height="5" class="f-accent"/>
  <text x="538" y="114" class="f-mono f-ink">0</text>
  <rect x="538" y="120" width="80" height="5" class="f-plain"/>
  <text x="12" y="144" class="f-label f-ink">з інструкцыямі</text>
  <text x="170" y="144" class="f-mono f-accent">100</text>
  <rect x="170" y="150" width="80" height="5" class="f-plain"/>
  <rect x="170" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="144" class="f-mono f-accent">99,6</text>
  <rect x="262" y="150" width="80" height="5" class="f-plain"/>
  <rect x="262" y="150" width="79.7" height="5" class="f-accent"/>
  <text x="354" y="144" class="f-mono f-accent">100</text>
  <rect x="354" y="150" width="80" height="5" class="f-plain"/>
  <rect x="354" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="144" class="f-mono f-accent">100</text>
  <rect x="446" y="150" width="80" height="5" class="f-plain"/>
  <rect x="446" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="538" y="144" class="f-mono f-ink">0</text>
  <rect x="538" y="150" width="80" height="5" class="f-plain"/>
  <text x="12" y="174" class="f-label f-ink">зменлівыя варыянты</text>
  <text x="170" y="174" class="f-mono f-accent">100</text>
  <rect x="170" y="180" width="80" height="5" class="f-plain"/>
  <rect x="170" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="174" class="f-mono f-accent">100</text>
  <rect x="262" y="180" width="80" height="5" class="f-plain"/>
  <rect x="262" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="354" y="174" class="f-mono f-accent">100</text>
  <rect x="354" y="180" width="80" height="5" class="f-plain"/>
  <rect x="354" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="174" class="f-mono f-accent">94,6</text>
  <rect x="446" y="180" width="80" height="5" class="f-plain"/>
  <rect x="446" y="180" width="75.7" height="5" class="f-accent"/>
  <text x="538" y="174" class="f-mono f-ink">0</text>
  <rect x="538" y="180" width="80" height="5" class="f-plain"/>
</svg>
<figcaption>Усе данавучаныя мадэлі адказваюць у патрэбнай форме на задачах з yes/no, якіх не бачылі. Ніводная не кажа true ці false.</figcaption>
</figure>

## Прымушаю варыянты мяняцца

Я думаў, што ў навучанні радок Options ніколі не мяняўся, таму мадэлі не было навошта яго чытаць. Перад наступным прагонам я запісаў, што паслухмянасць ніжэй за 20% на true/false яе абвергне. Потым я навучыў трэцюю мадэль на тых жа прыкладах. Для кожнага прыкладу словы варыянтаў браліся выпадкова з некалькіх набораў. Для танальнасці гэта пары накшталт good/bad і great/terrible, для задач так/не пары накшталт correct/incorrect і right/wrong. Ні ў адным наборы не было true, false ці maybe. Пытанне пра танальнасць пры гэтым страціла сваё "positive or negative".

На true/false яна ўсё роўна адказала "yes", 265 разоў з 277. Потым я праверыў яе і мадэль з нязменнымі варыянтамі на SST-2 з іншымі радкамі Options. Пытанне ішло без слоў адказу. З "good, bad" яна паслухмяная на 100%, з "great, terrible" на 99,7%. З "fine, awful", парай, якой яна ніколі не бачыла, на 0%. Замест іх яна адказвала "great" ці "terrible", з правільнай танальнасцю ў 229 водгуках з 300. Падобна, што яна чытае ў водгуку танальнасць і потым бярэ слова з пары, якую ўжо ведае. Мадэль з нязменнымі варыянтамі не спраўляецца ўжо з "good, bad". Яна адказвае "positive" ці "negative". Але калі параўнаць яе верагоднасці "good" і "bad", яна выбірае правільнае слова ў 87,3% выпадкаў.

"Correct, incorrect" на RTE таксама дае 0%. Мадэль бачыла гэтую пару як адказы ў навучанні, толькі ў іншых задачах. На пары з RTE яна кажа "yes".

<figure class="fig">
<svg viewBox="0 0 640 244" role="img" aria-label="Паслухмянасць 2 мадэляў пры розных радках Options. positive, negative: з інструкцыямі 100%, зменлівыя варыянты 100%. good, bad: з інструкцыямі 0%, зменлівыя варыянты 100%. great, terrible: з інструкцыямі 0%, зменлівыя варыянты 99,7%. fine, awful: з інструкцыямі 0%, зменлівыя варыянты 0%. correct, incorrect: з інструкцыямі 0%, зменлівыя варыянты 0%.">
  <text x="12" y="18" class="f-label f-muted">SST-2 і RTE з іншымі словамі ў радку Options</text>
  <text x="12" y="44" class="f-label f-muted">радок Options</text>
  <text x="260" y="44" class="f-label f-muted">з інструкцыямі</text>
  <text x="420" y="44" class="f-label f-muted">зменлівыя варыянты</text>
  <text x="12" y="74" class="f-mono f-ink">positive, negative</text>
  <rect x="260" y="63" width="120" height="14" class="f-plain"/>
  <rect x="260" y="63" width="120.0" height="14" class="f-box"/>
  <text x="260" y="90" class="f-label f-ink">100%</text>
  <rect x="420" y="63" width="120" height="14" class="f-plain"/>
  <rect x="420" y="63" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="90" class="f-label f-ink">100%</text>
  <text x="12" y="108" class="f-mono f-ink">good, bad</text>
  <text x="12" y="122" class="f-label f-muted">(правая мадэль на іх вучылася)</text>
  <rect x="260" y="97" width="120" height="14" class="f-plain"/>
  <text x="260" y="124" class="f-label f-ink">0%</text>
  <rect x="420" y="97" width="120" height="14" class="f-plain"/>
  <rect x="420" y="97" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="124" class="f-label f-ink">100%</text>
  <text x="12" y="142" class="f-mono f-ink">great, terrible</text>
  <text x="12" y="156" class="f-label f-muted">(правая мадэль на іх вучылася)</text>
  <rect x="260" y="131" width="120" height="14" class="f-plain"/>
  <text x="260" y="158" class="f-label f-ink">0%</text>
  <rect x="420" y="131" width="120" height="14" class="f-plain"/>
  <rect x="420" y="131" width="119.6" height="14" class="f-accent"/>
  <text x="420" y="158" class="f-label f-ink">99,7%</text>
  <text x="12" y="176" class="f-mono f-ink">fine, awful</text>
  <text x="12" y="190" class="f-label f-muted">(не бачыла ніколі)</text>
  <rect x="260" y="165" width="120" height="14" class="f-plain"/>
  <text x="260" y="192" class="f-label f-ink">0%</text>
  <rect x="420" y="165" width="120" height="14" class="f-plain"/>
  <text x="420" y="192" class="f-label f-ink">0%</text>
  <text x="12" y="210" class="f-mono f-ink">correct, incorrect</text>
  <text x="12" y="224" class="f-label f-muted">(з іншых задач)</text>
  <rect x="260" y="199" width="120" height="14" class="f-plain"/>
  <text x="260" y="226" class="f-label f-ink">0%</text>
  <rect x="420" y="199" width="120" height="14" class="f-plain"/>
  <text x="420" y="226" class="f-label f-ink">0%</text>
  <text x="460" y="192" class="f-label f-muted">адказвае great / terrible</text>
  <text x="460" y="226" class="f-label f-muted">адказвае yes</text>
</svg>
<figcaption>Са зменлівымі варыянтамі мадэль выбірае з набораў слоў, якія ведае. Незнаёмая пара не дзейнічае.</figcaption>
</figure>

## Што я з гэтага вынес

Значыць, мадэль сёе-тое вывучыла пра інструкцыю, але менш, чым я думаў. Яна вывучыла, якія словы бываюць адказамі для якога віду ўваходных даных. Са зменлівымі варыянтамі ў навучанні радок Options стаў пераключальнікам паміж наборамі слоў танальнасці, якія яна ўжо ведае. На RTE гэты пераключальнік не спрацаваў нават для пары, якой яна адказвала на іншых задачах. Словамі, якія ў навучанні ніколі не былі адказамі, яна не адказала ні разу. Я мяркую, што прычына ў гэтым, але мадэлі, у якой яны былі адказамі, я не навучаў. Я чакаў больш за 50% на true/false ад мадэлі з нязменнымі варыянтамі і ад мадэлі са зменлівымі. Для мадэлі на 248M абодва чаканні не спраўдзіліся.

Нічога новага тут няма. FLAN і T0 правяралі шаблоны і памер мадэлі на мадэлях, значна большых за тыя, што я магу навучыць. Радок Options я пісаць працягну. Але для маленькай данавучанай мадэлі спачатку праверу, ці былі гэтыя словы адказамі ў яе навучальных даных.

## Чаго я не правяраў

- 1 шаблон на задачу. Мадэль з інструкцыямі я навучыў другі раз з іншым seed. Яна зноў ні разу не сказала true ці false, "yes" 257 разоў з 277. Астатнія мадэлі я навучаў па адным разе.
- 248M параметраў. У FLAN данавучанне на новых задачах шкодзіла на 8B і менш і дапамагала на 68B і 137B. У T0 ужо мадэль на 3B апярэджвае сваю базу без данавучання. Большая мадэль, магчыма, чытае радок Options. Я гэтага не правяраў.
- Дакладнасць на новых задачах ва ўсіх мадэляў блізкая да ўгадвання. Так што гэта пра форму адказу. Пра ўменне я нічога сказаць не магу.
- Ацэнкі я паўтарыў на torch 1.10.2 і transformers 4.16.2. Навучанне ішло ў іншым асяроддзі на гэтай машыне. Яго я не паўтараў.
