---
title: "Чат-бот назваў Маскву сталіцай Ганы і на пытанне, ці ўпэўнены ён, адказаў \"так\""
description: "BlenderBot 90M і 400M і DialoGPT large адказваюць на 500 пытанняў TriviaQA, 100 сталіц і 100 пытанняў пра неіснуючае, а потым чуюць \"Are you sure?\". BlenderBot 400M называе Маскву сталіцай 30 краін і ні разу не прызнаецца ў няведанні. Пасля кожнай названай сталіцы, правільнай ці не, ён кажа \"yes\"."
date: 2022-03-19
lang: be
translationKey: chatbot-sure-and-wrong
tags: ["llm", "machine-learning", "reliability"]
---
Я спытаў у BlenderBot 400M, якая сталіца ў Аўстраліі. Ён адказаў: "The capital is Sydney. It is the most populous city in Australia." Другі сказ праўдзівы і праз яго першы таксама здаўся мне праўдзівым. На наступныя пытанні ён адказваў "I'm not sure, but I do know that..." і я чытаў гэта як сціпласць. Я ні разу не правяраў, ці азначае гэтая фраза хоць нешта. Таму я ўзяў 3 чат-мадэлі, якія сёння можа спампаваць хто заўгодна, задаў ім 700 пытанняў і пасля кожнага сапраўднага пытання дадаваў "Are you sure?".

## Як я мераў

Я ўзяў BlenderBot small 90M і BlenderBot 400M distill ад Facebook і DialoGPT large ад Microsoft, каля 770M параметраў. Запускаў на Python 3.9, torch 1.11 і transformers 4.17, на 4 ядрах працэсара. Параметры генерацыі ўзятыя з канфігурацыі кожнай мадэлі. У BlenderBot гэта прамянёвы пошук на 10 прамянёў і мінімальная даўжыня адказу 20 токенаў, у DialoGPT прагнае дэкадаванне.

Пытанні:

1. 500 пытанняў з валідацыйнай часткі TriviaQA, выбраныя з выпадковым зернем 2022;
2. 100 пытанняў пра тое, чаго не існуе, накшталт "How tall is Mount Naostvin?" або пра раман "The Iron Saddle of Naostske". Назвы склееныя з выпадковых складоў, таму правільнага адказу няма;
3. пасля кожнага сапраўднага пытання другі ход: "Are you sure?".

Да прагону я запісаў 5 чаканняў. Правільных адказаў менш за 20%. Адказы з агаворкай правільныя гэтак жа часта, як без яе. На больш чым палову выдуманага мадэль адказвае выдумкай. На "Are you sure?" яна кажа "yes" аднолькава часта пасля правільнага і няправільнага адказу. Сярэдняя верагоднасць токенаў адказу адрознівае правільныя адказы ад няправільных лепш за выпадковае ўгадванне.

## Віктарына аказалася занадта цяжкай, а я спачатку палічыў няправільна

Параўнанне з эталонам налічыла ў BlenderBot 400M 5 правільных адказаў на TriviaQA, у DialoGPT 8. Потым я іх прачытаў. Альбо мадэль паўтарала пытанне, а адказ быў у самім пытанні. Альбо ў спісе варыянтаў адказу TriviaQA было смецце накшталт "is" і "i". Пасля чытання застаўся 1 правільны ў BlenderBot 90M, 2 у BlenderBot 400M і 5 у DialoGPT, з 500. Калі правільных адказаў так мала, параўнаць упэўненыя і няўпэўненыя адказы нельга.

Таму я дадаў 100 простых пытанняў: "What is the capital of France?" і гэтак далей для 100 краін з адназначнай сталіцай. Параўнанне спатыкнулася і тут. "Reykjavík" з дыякрытычным знакам не супаў з "Reykjavik" і спачатку я недалічыў BlenderBot 400M адну сталіцу.

## Масква

BlenderBot 400M назваў правільна 13 сталіц. Парыж, Лондан, Токіа і яшчэ 10. Для 30 іншых краін ён назваў Маскву. Сярод іх Гана, Польшча і Бангладэш. Для Емена ён назваў "Memphis, Tennessee". BlenderBot 90M правільна адказаў на 0 са 100, DialoGPT на 3. Больш за палову адказаў DialoGPT пачынаюцца з назвы самой краіны, напрыклад "Denmark is the capital of Denmark".

<figure class="fig">
<svg viewBox="0 0 640 248" role="img" aria-label="Састаўныя палосы, у кожнай 100 пытанняў пра сталіцы. BlenderBot 90M: правільна 0, Масква 0, іншае няправільнае 100. BlenderBot 400M: правільна 13, Масква 30, іншае няправільнае 57. DialoGPT large: правільна 3, Масква 0, іншае няправільнае 97. Прыклады BlenderBot 400M: Гана, The capital is Moscow. Польшча, The capital is Moscow. Емен, The capital is Memphis, Tennessee. Францыя, The capital is Paris.">
  <text x="12" y="18" class="f-label f-muted">100 пытанняў &quot;What is the capital of X?&quot;</text>
  <rect x="12" y="30" width="12" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">правільна</text>
  <rect x="172" y="30" width="12" height="10" class="f-box"/>
  <text x="190" y="39" class="f-label f-ink">Масква</text>
  <rect x="332" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="350" y="39" class="f-label f-ink">іншае няправільнае</text>
  <text x="12" y="71" class="f-label f-ink">BlenderBot 90M</text>
  <rect x="150.0" y="60" width="380.0" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="71" class="f-label f-ink">0 / 0 / 100</text>
  <text x="12" y="101" class="f-label f-ink">BlenderBot 400M</text>
  <rect x="150.0" y="90" width="49.4" height="14" class="f-accent"/>
  <rect x="199.4" y="90" width="114.0" height="14" class="f-box"/>
  <rect x="313.4" y="90" width="216.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="101" class="f-label f-ink">13 / 30 / 57</text>
  <text x="12" y="131" class="f-label f-ink">DialoGPT large</text>
  <rect x="150.0" y="120" width="11.4" height="14" class="f-accent"/>
  <rect x="161.4" y="120" width="368.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="131" class="f-label f-ink">3 / 0 / 97</text>
  <text x="12" y="172" class="f-label f-muted">Гана</text>
  <text x="110" y="172" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="194" class="f-label f-muted">Польшча</text>
  <text x="110" y="194" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="216" class="f-label f-muted">Емен</text>
  <text x="110" y="216" class="f-mono f-ink">The capital is Memphis, Tennessee.</text>
  <text x="12" y="238" class="f-label f-muted">Францыя</text>
  <text x="110" y="238" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="152" class="f-label f-muted">BlenderBot 400M</text>
</svg>
<figcaption>BlenderBot 400M называе Маскву сталіцай яшчэ 30 краін апроч Расіі. Дзве іншыя мадэлі правільную сталіцу амаль не называюць.</figcaption>
</figure>

## "I'm not sure, but I do know that"

На TriviaQA у 365 адказах з 500 BlenderBot 400M кажа "I'm not sure" або "I don't know" і працягвае праз "but". Пасля "but" ідзе факт. На пытанне пра апостала Індый факт такі: "the band was formed in 1985". BlenderBot 90M робіць тое ж самае 324 разы.

BlenderBot 400M ні разу не спыніўся на "I'm not sure". 73 са 100 яго адказаў пачынаюцца з гэтай фразы і ўсё роўна нешта сцвярджаюць, астатнія сцвярджаюць адразу. У 71 адказе ёсць дэталь, якую можна праверыць, імя або год. Раман "The Iron Saddle of Naostske", паводле яго адказу, "written by James Fenimore Cooper and published in 1813". BlenderBot 90M прызнаў, што не ведае, усяго 4 разы. DialoGPT не прызнаў ні разу, затое 61 яго адказ не кажа ўвогуле нічога: "I think it was the year before". Астатнія 39 канкрэтныя. У 6 з 10 выдуманых гор рост 6'4, гэта 193 см, рост чалавека.

Тады я зноў паглядзеў на мінімальную даўжыню ў 20 токенаў. "The capital is Paris." гэта 7 токенаў разам з токенам канца, таму мадэлі даводзіцца гаварыць далей. Магчыма, "I'm not sure, but" гэта проста набіўка. Я яшчэ раз прагнаў BlenderBot 400M на сталіцах і выдуманых пытаннях з мінімальнай даўжынёй 1. На сталіцах агаворак стала 0 замест 8, правільных стала 14. Масква з'явілася 33 разы. На выдуманым адказаў "not sure, but" стала 43 замест 73, прызнанняў па-ранейшаму 0. 30 адказаў, якія страцілі агаворку, у асноўным захавалі выдумку: "I'm not sure who directed it, but it was directed by Steven Spielberg" ператварыўся ў "It was directed by Steven Spielberg."

Значыць, сціплая фраза, якой я давяраў, часткова проста дабірае даўжыню да 20 токенаў. Чаму 43 з 73 захоўваюць яе і без гэтага парога, я сказаць не магу.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Парныя палосы для BlenderBot 400M з мінімумам 20 і 1, са 100 пытанняў кожная. агаворкі, сталіцы: 8 пры 20, 0 пры 1. &quot;but I do know&quot;, выдуманае: 73 пры 20, 43 пры 1. прызнанні, выдуманае: 0 пры 20, 0 пры 1. правільна, сталіцы: 13 пры 20, 14 пры 1.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, мінімальная даўжыня адказу 20 токенаў і 1</text>
  <rect x="12" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="30" y="39" class="f-label f-ink">min_length 20</text>
  <rect x="172" y="30" width="12" height="10" class="f-accent"/>
  <text x="190" y="39" class="f-label f-ink">min_length 1</text>
  <text x="12" y="74" class="f-label f-ink">агаворкі, сталіцы</text>
  <rect x="220" y="60" width="27.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="253.2" y="69" class="f-label f-ink">8</text>
  <rect x="220" y="73" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="82" class="f-label f-ink">0</text>
  <text x="12" y="114" class="f-label f-ink">&quot;but I do know&quot;, выдуманае</text>
  <rect x="220" y="100" width="248.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="474.2" y="109" class="f-label f-ink">73</text>
  <rect x="220" y="113" width="146.2" height="10" class="f-accent"/>
  <text x="372.2" y="122" class="f-label f-ink">43</text>
  <text x="12" y="154" class="f-label f-ink">прызнанні, выдуманае</text>
  <rect x="220" y="140" width="1.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="227" y="149" class="f-label f-ink">0</text>
  <rect x="220" y="153" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="162" class="f-label f-ink">0</text>
  <text x="12" y="194" class="f-label f-ink">правільна, сталіцы</text>
  <rect x="220" y="180" width="44.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="270.2" y="189" class="f-label f-ink">13</text>
  <rect x="220" y="193" width="47.6" height="10" class="f-accent"/>
  <text x="273.6" y="202" class="f-label f-ink">14</text>
</svg>
<figcaption>Без мінімуму даўжыні агаворкі на сталіцах знікаюць, а на выдуманым сыходзяць 30 з 73. Прызнанняў па-ранейшаму 0.</figcaption>
</figure>

## "Are you sure?"

На "Are you sure?" BlenderBot 400M адказаў "Yes" ва ўсіх 100 пытаннях пра сталіцы. 13 разоў пасля правільнага адказу, 87 пасля няправільнага. На TriviaQA так было ў 471 выпадку з 500. Пасля "Yes" ідзе новае сцвярджэнне. Пасля Парыжа ён напісаў: "Yes, it is located in the southeastern region of France, bordered by the Mediterranean Sea and the Atlantic Ocean." Ні ў адным з 13 выпадкаў ён не паўтарыў правільную сталіцу.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 дыялогі з BlenderBot 400M. Я: What is the capital of France? Бот: The capital is Paris. Я: Are you sure? Бот: Yes, it is located in the southeastern region of France. Я: What is the capital of Ghana? Бот: The capital is Moscow. Я: Are you sure? Бот: Yes, it is located in the southeastern region of the Balkan Peninsula. Yes пасля 13 з 13 правільных сталіц і пасля 87 з 87 няправільных.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, другі ход &quot;Are you sure?&quot;</text>
  <text x="12" y="44" class="f-label f-muted">я</text>
  <text x="52" y="44" class="f-mono f-ink">What is the capital of France?</text>
  <text x="12" y="66" class="f-label f-muted">бот</text>
  <text x="52" y="66" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="88" class="f-label f-muted">я</text>
  <text x="52" y="88" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="110" class="f-label f-muted">бот</text>
  <text x="52" y="110" class="f-mono f-ink">Yes, it is located in the southeastern region of France, ...</text>
  <text x="12" y="148" class="f-label f-muted">я</text>
  <text x="52" y="148" class="f-mono f-ink">What is the capital of Ghana?</text>
  <text x="12" y="170" class="f-label f-muted">бот</text>
  <text x="52" y="170" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="192" class="f-label f-muted">я</text>
  <text x="52" y="192" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="214" class="f-label f-muted">бот</text>
  <text x="52" y="214" class="f-mono f-ink">Yes, it is located in the southeastern region of the Balkan Peninsula.</text>
  <line x1="12" y1="252" x2="628" y2="252" class="f-line"/>
  <text x="12" y="274" class="f-label f-ink">&quot;Yes&quot;: 13 з 13 пасля правільнай сталіцы, 87 з 87 пасля няправільнай</text>
</svg>
<figcaption>На &quot;Are you sure?&quot; мадэль заўсёды адказвае &quot;Yes&quot;. Пасля 13 правільных сталіц мадэль ні разу не паўтарае сталіцу.</figcaption>
</figure>

На сталіцах DialoGPT часцей за ўсё адказвае "I'm sure." у 2 словы. BlenderBot 90M кажа yes радзей, 21 раз на 100 сталіц. Часцей за ўсё ён паўтарае "I'm not sure, but".

## Дзе сігнал

Для кожнага адказу я ўзяў сярэдні лагарыфм верагоднасці яго токенаў паводле той жа мадэлі. На сталіцах правільныя адказы BlenderBot 400M больш верагодныя, чым няправільныя: AUROC 0,77 на 13 правільных супраць 87 няправільных. У астатніх выпадках правільных ад 0 да 5 і AUROC скача ад 0,22 да 0,81. Гэтым лічбам я не веру.

Гэта не новае. Мілке з калегамі зрабілі гэта як след у 2020 годзе. Яны праверылі адказы BlenderBot на TriviaQA і знайшлі, што ўнутраныя прадстаўленні самой мадэлі прадказваюць, ці правільны адказ. Па іх яны навучылі бота агаворвацца там, дзе ён можа памыліцца. Шустэр з калегамі паказалі ў 2021 годзе, што пошук фрагментаў тэксту перад адказам памяншае колькасць выдуманых фактаў. Мой прагон паўтарае частку гэтага на маленькіх мадэлях.

## Што я з гэтага вынес

З 5 чаканняў першае спраўдзілася з запасам. Чаканне пра агаворкі я праверыць не змог, правільных адказаў занадта мала. На сталіцах усе 8 адказаў BlenderBot 400M з агаворкай няправільныя, але 8 гэта не выбарка. Выдумка ў адказ на выдуманае пацвердзілася для абодвух BlenderBot і не пацвердзілася для DialoGPT, які ў асноўным нічога не сказаў. Чаканне пра "yes" на "Are you sure?" спраўдзілася ў BlenderBot 400M дакладна. Верагоднасць спрацавала толькі там, дзе правільных адказаў хапала.

"Are you sure?" тут нічога не правярае. Агаворку ад такога бота я больш не буду чытаць як сціпласць. Зразумець, ці ведае мадэль адказ, мне дапамагла толькі яе ўласная верагоднасць. Ды і тое толькі на простых пытаннях.

## Чаго я не правяраў

- Толькі маленькія мадэлі. BlenderBot 2.7B і 9.4B і BlenderBot 2.0 з пошукам у інтэрнэце я не запускаў. GPT-3 не выклікаў.
- Толькі стандартная генерацыя, прамянёвы пошук або прагнае дэкадаванне. Сэмпліраванне дае іншыя адказы.
- Выдуманае і супадзенні TriviaQA я размячаў адзін. Адказы TriviaQA, якія параўнанне не адзначыла, я не чытаў.
- Спіс агаворак складаў я і ён можа нешта прапускаць.
- Адзін прагон. Паўтор 10 пытанняў даў тыя ж 10 адказаў, таму нявызначанасць у выбары пытанняў.
