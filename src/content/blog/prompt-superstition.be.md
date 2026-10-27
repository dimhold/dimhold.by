---
title: "Я праверыў парады па промптах на GPT-2 і парадак прыкладаў аказаўся важнейшым за іх усе"
description: "Я прагнаў папулярныя парады па промптах на GPT-2 medium і large на 872 водгуках SST-2: please, you are an expert, IMPORTANT, выразная інструкцыя. На 10 наборах прыкладаў яны зрушылі сярэдняе на 1-4 пункты, звычайная інструкцыя на medium аказалася на 9,5 пункта горшай, чым ніякая, а парадак тых самых 4 прыкладаў рухаў дакладнасць да 37 пунктаў."
date: 2022-03-25
lang: be
translationKey: prompt-superstition
tags: ["llm", "machine-learning", "statistics"]
---
З таго часу, як выйшла GPT-3, парад пра тое, як пісаць промпт, становіцца ўсё больш. Будзь ветлівы. Скажы мадэлі, што яна эксперт. Напішы IMPORTANT вялікімі літарамі і папрасі думаць уважліва. Пастаў наверх выразную інструкцыю. Большая частка гэтых парад ідзе ад чалавека, які адзін раз паспрабаваў праз API і ў яго спрацавала. Другога прагону за гэтым няма.

Я чытаў гэтыя парады і раскладаў іх у галаве, нічога не вымяраючы. Ветлівасць і "you are an expert" я запісаў у забабоны. Выразную інструкцыю запісаў у рамяство, адзіную частку промпта, якая прынамсі не можа нашкодзіць. Запусціць GPT-3 дома я не магу. Але той самы прыём з некалькімі прыкладамі ў промпце працуе і на GPT-2, таму я паставіў абедзве групы парад на адну задачу і палічыў.

## Стэнд

Задача SST-2 з GLUE: 872 кароткія водгукі пра фільмы з dev-часткі, 444 з іх станоўчыя. Мадэль, якая на ўсё адказвае "positive", атрымлівае 50,9%.

Промпт пачынаецца з інструкцыі: "Classify the sentiment of each movie review as positive or negative." Далей ідуць 4 прыклады з навучальнай часткі, 2 станоўчыя і 2 адмоўныя, у выглядзе `Review: ...` і `Sentiment: positive`. Потым водгук, які трэба класіфікаваць. Мадэль нічога не генеруе. Я параўноўваю імавернасць слоў " positive" і " negative" як наступнага слова, таму адзін і той самы промпт заўсёды дае адзін і той самы лік.

Мадэлі GPT-2 medium (355M параметраў) і GPT-2 large (774M) у float32, на 4 ядрах AMD EPYC 7713 на віртуальнай машыне. На torch 1.11 з transformers 4.17 падлік дае тыя самыя прадказанні. Для medium я прагнаў 217 промптаў, для large 99 з іх.

Я выбраў 10 набораў па 4 прыклады з фіксаваным seed. Кожны варыянт ідзе на тых самых 10 наборах, так што змена ў промпце застаецца адзінай розніцай.

## Парады

<figure class="fig">
<svg viewBox="0 0 640 286" role="img" aria-label="Шэрагі кропак, па шэрагу на інструкцыю, у кожным 10 кропак, па адной на набор прыкладаў. без інструкцыі: ад 50,9 да 84,5, сярэдняе 68,8. звычайная: ад 48,9 да 82,1, сярэдняе 59,3. please ... thank you: ад 49,2 да 85,2, сярэдняе 62,8. you are an expert: ад 49 да 79,9, сярэдняе 60,7. IMPORTANT, think carefully: ад 49 да 78,3, сярэдняе 60,3. перакладзі на французскую: ад 50,2 да 83,3, сярэдняе 65,5. камедыя ці драма: ад 49,4 да 83,3, сярэдняе 64,5.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, дакладнасць на 872 водгуках, %</text>
  <circle cx="18" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 кропка = 1 набор з 4 прыкладаў</text>
  <rect x="330" y="29" width="3" height="14" class="f-accent"/>
  <text x="340" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">сярэдняе па 10 наборах</text>
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
  <text x="12" y="72" text-anchor="start" class="f-mono f-ink" style="font-size:11px">без інструкцыі</text>
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
  <text x="12" y="102" text-anchor="start" class="f-mono f-accent" style="font-size:11px">звычайная</text>
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
  <text x="12" y="222" text-anchor="start" class="f-mono f-ink" style="font-size:11px">перакладзі на французскую</text>
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
  <text x="12" y="252" text-anchor="start" class="f-mono f-ink" style="font-size:11px">камедыя ці драма</text>
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
<figcaption>Ва ўсіх шэрагах тыя самыя 10 набораў прыкладаў. Унутры шэрагу кропкі разыходзяцца на 29-36 пунктаў, сярэднія паміж шэрагамі адрозніваюцца не больш чым на 9,5. У звычайнай інструкцыі сярэдняе самае нізкае.</figcaption>
</figure>

На medium звычайная інструкцыя дае ў сярэднім 59,3% па 10 наборах. "Please ... Thank you!" дае 62,8%, "You are an expert film critic." 60,7%, IMPORTANT з "Think carefully and be accurate." 60,3%. Ветлівая лепшая за звычайную на 5 наборах і горшая на 4, гэта як падкінуць манету. Варыянт з вялікімі літарамі лепшы на 7 і горшы на 2, але 10 набораў замала, каб быць у гэтым упэўненым.

Але паглядзіце на шэрагі малюнка, а не на сярэднія. Пры звычайнай інструкцыі адзін толькі набор прыкладаў рухае вынік ад 48,9% да 82,1%. Гэта 33 пункты ад выбару 4 водгукаў. Словы, пра якія я гатовы быў спрачацца, зрушылі сярэдняе на 1-4 пункты.

## Дзе я памыліўся

У інструкцыю я якраз верыў, таму прагнаў промпт і без яе. Без інструкцыі medium атрымлівае 68,8%, на 9,5 пункта больш, лепш на 8 наборах з 10 і горш на 1. Потым я паспрабаваў 2 няправільныя інструкцыі. "Translate each sentence into French." дае 65,5%, а "Classify each movie review by whether it is about a comedy or a drama." 64,5%, таксама больш, чым правільная.

Без прыкладаў тое самае. Голы `Review: ... Sentiment:` дае 73,2%, са звычайнай інструкцыяй зверху 60,8%, з ветлівай 53,9%. З "please" мадэль адказвае positive на 97% водгукаў.

Я нейкі час шукаў памылку. Праверыў, што інструкцыя сапраўды трапляе ў промпт і што кожнае з двух слоў-метак займае адзін токен. Закэшаваны прэфікс таксама даў тыя самыя токены, што і поўны тэкст. Усё было ў парадку. Чаму гэтая інструкцыя шкодзіць medium, я не ведаю.

## Парадак тых самых 4 прыкладаў

<figure class="fig">
<svg viewBox="0 0 640 354" role="img" aria-label="Кропкавая дыяграма, 72 кропкі, па адной на парадак прыкладаў. Па гарызанталі доля водгукаў, якія мадэль назвала станоўчымі, па вертыкалі дакладнасць. 12 парадкаў з меткамі станоўчы, адмоўны, станоўчы, адмоўны сабраліся ў куце: ад 99,2 да 100 працэнта станоўчых адказаў і каля 51 працэнта дакладнасці, гэта ўзровень адказу positive на ўсё. Астатнія 60 парадкаў раскіданыя ад 1 да 99 працэнтаў станоўчых адказаў і дакладнасць найвышэйшая там, дзе адказы падзеленыя пароўну.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, тыя самыя 4 прыклады ў 24 парадках, 3 наборы</text>
  <rect x="14" y="31" width="9" height="9" class="f-accent"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">меткі ў парадку + - + -</text>
  <circle cx="334" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="344" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">любы іншы парадак</text>
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
  <text x="340" y="344" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">адказ &quot;positive&quot;, % водгукаў</text>
  <text x="12" y="66" text-anchor="start" class="f-mono f-muted" style="font-size:11px">дакладнасць, %</text>
  <line x1="70" y1="279.1" x2="610" y2="279.1" class="f-line" stroke-dasharray="4 3"/>
  <text x="340" y="295.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">усё &quot;positive&quot;: 50,9</text>
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
  <text x="593.8" y="301.6088888888889" text-anchor="end" class="f-mono f-accent" style="font-size:11px">усе 12 парадкаў + - + -</text>
  <line x1="595.96" y1="298.4622222222222" x2="605.68" y2="285.87555555555554" class="f-line"/>
</svg>
<figcaption>Дакладнасць высокая толькі там, дзе мадэль дзеліць адказы прыкладна пароўну. Усе 12 парадкаў, дзе меткі чаргуюцца, пачынаючы са станоўчай, апынуліся ў адным куце.</figcaption>
</figure>

Для 3 набораў я прагнаў усе 24 парадкі тых самых 4 прыкладаў, не мяняючы ніводнага слова. На наборы 0 дакладнасць ідзе ад 50,9% да 78,3%, на наборы 1 ад 50,2% да 84,5%, на наборы 2 ад 50,1% да 82,1%. Чжао з калегамі паказалі гэта на GPT-3 летась. Лу з калегамі зрабілі гэта на GPT-2 якраз па такой схеме, SST-2 і ўсе 24 парадкі 4 прыкладаў, так што гэта не навіна. Але я не чакаў, што гэты эфект акажацца большым за ўсё астатняе ў маёй сетцы.

Дрэнныя парадкі не выпадковыя. На 3 наборах ёсць 12 парадкаў з меткамі `+ - + -`. Ва ўсіх мадэль адказвае "positive" на 99,2% водгукаў і больш, а дакладнасць 50,9-51,5%. Падобна на тое, што мадэль працягвае паслядоўнасць метак замест таго, каб чытаць водгук. Люстраны парадак `- + - +` не такі чысты, там доля станоўчых адказаў ад 1,0% да 51,5%.

## GPT-2 large

На large мая гісторыя пра інструкцыю развалілася. З 4 прыкладамі фармулёўка амаль не мае значэння. Ветлівая на 1,3 пункта вышэйшая за звычайную, без інструкцыі на 0,6 ніжэй. Абедзве няправільныя інструкцыі цяпер крыху горшыя за звычайную, французская на 2,4 пункта і ніжэйшая на 8 наборах з 10. Так што папярэдні раздзел датычыцца толькі medium. Набор прыкладаў усё гэтак жа рухае звычайны промпт ад 53,6% да 87,6%.

На large я паспеў прагнаць толькі 24 парадкі набору 0. Яны ідуць ад 51,6% да 88,3%, але мадэль ламае іншы парадак, чым у medium. `+ - + -` тут працуе нармальна, 75,0-88,3%. Large ламаецца, калі ў 2 апошніх прыкладаў адна метка. Пасля `+ + - -` яна адказвае positive толькі на 2,5-5,2% водгукаў, пасля `- - + +` на 87,4-96,7%. Чжао з калегамі называюць гэта recency bias: мадэль цягнецца да меткі, якую бачыла апошняй. Гэта тлумачэнне пасуе толькі да large: у medium парадак `+ - + -` заканчваецца адмоўным прыкладам, а мадэль усё роўна кажа positive.

<figure class="fig">
<svg viewBox="0 0 640 258" role="img" aria-label="Дзве панэлі кропак, па шэрагу на парадак метак у 4 прыкладах, па 4 парадкі ў шэрагу. Злева дакладнасць, справа доля водгукаў з адказам positive. + - + -: дакладнасць ад 75 да 88,3, positive ад 44 да 74,5. - + - +: дакладнасць ад 83,4 да 85,3, positive ад 50,2 да 61,4. - + + -: дакладнасць ад 85,2 да 87,7, positive ад 46 да 52,6. + - - +: дакладнасць ад 65,6 да 81,3, positive ад 67,5 да 84,6. - - + +: дакладнасць ад 54,2 да 63,5, positive ад 87,4 да 96,7. + + - -: дакладнасць ад 51,6 да 54,2, positive ад 2,5 да 5,2.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 large, набор 0, 24 парадкі, згрупаваныя па метках прыкладаў</text>
  <text x="240" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">дакладнасць, %</text>
  <text x="490" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">адказ &quot;positive&quot;, %</text>
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
<figcaption>Калі ў 2 апошніх прыкладаў адна метка, large ставіць яе большасці водгукаў. Чаргаванне, якое пачынаецца са станоўчай меткі і ламала medium, тут працуе нармальна.</figcaption>
</figure>

Без прыкладаў фармулёўка на large мае вялікае значэнне. Голы промпт атрымлівае 86,4%, ветлівы 84,1%, вялікія літары 78,7%, звычайны 71,9%, эксперт 68,6%. На medium ветлівы быў на 6,9 пункта горшы за звычайны. На large ён на 12,2 пункта лепшы. Але кожны лік без прыкладаў гэта 1 промпт, за якім няма набораў. Я не магу сказаць, колькі з гэтых 18 пунктаў дала фармулёўка, а колькі менавіта гэтая фраза. Гэты голы промпт з 86,4% да таго ж вышэйшы за любы варыянт з 4 прыкладамі на large, дзе найлепшае сярэдняе 65,8%.

## Што яшчэ рухала лік

Словы-меткі важнейшыя за ветлівыя словы. З "good" і "bad" medium атрымлівае 68,4%, з "A" і "B" 49,0%, ніжэй за адказ positive на ўсё.

Каліброўка крыху дапамагае medium і мацней large. Чжао з калегамі пытаюцца ў мадэлі пра пусты ўваход накшталт "N/A" і дзеляць імавернасці адказаў на тое, што яна кажа там. Са звычайнай інструкцыяй гэта зрушвае medium з 59,3% да 62,0%, а large з 64,5% да 72,0%, лепш на 7 наборах з 10 у абедзвюх. На промпце medium без прыкладаў выходзіць наадварот, з 60,8% да 55,4%. Пасля папраўкі мадэль кажа positive толькі на 7,7% водгукаў.

Выпадковыя меткі ў прыкладах каштуюць medium 4,2 пункта. Гэта блізка да таго, што Мін з калегамі ў мінулым месяцы паведамілі для большых мадэляў. Перавернутыя меткі каштуюць 6,7 пункта, але medium не вучыцца па іх пераварочваць адказы. Яна проста часцей кажа positive, у 89% выпадкаў.

## Чаго я не правяраў

- Саму GPT-3. Большыя мадэлі цалкам могуць чытаць інструкцыю лепш.
- Іншыя задачы. Танальнасць водгукаў пра фільмы гэта самы просты выпадак. На задачы, дзе мадэлі патрэбна інструкцыя, каб зразумець, што рабіць, яе выдаленне хутчэй за ўсё нашкодзіць.
- Больш набораў. 10 набораў паказваюць раскід у 33 пункты, але розніца ў 3 пункты паміж фармулёўкамі застаецца ўнутры шуму. Ветлівая магла б насамрэч быць на 2 пункты лепшай і я б гэтага не ўбачыў.

Для маленькіх мадэляў я цяпер спачатку паспрабую некалькі парадкаў прыкладаў і толькі потым буду чапаць фармулёўку. І інструкцыю я больш не лічу бяспечнай часткай, хоць на large яна была проста нейтральнай.
