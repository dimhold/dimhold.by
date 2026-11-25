---
title: "Пасля 20 пытанняў меншая мадэль вяла 6:2"
description: "Я параўнаў Flan-T5 small і base на 2000 пытанняў MMLU і разрэзаў іх на блокі па 20. Слабейшая мадэль вяла ў 37 блоках са 100. Літаральнае параўнанне тэксту з ключом праз кропку зрабіла base амаль удвая горшай за small. Колькі пытанняў трэба, каб убачыць розніцу ў 3 пункты і ў 1,33 пункта."
date: 2023-01-28
lang: be
translationKey: eval-looks-good
tags: ["llm", "statistics", "machine-learning"]
---

Я задаў адны і тыя ж 20 пытанняў з MMLU дзвюм мадэлям: Flan-T5 small на 80 мільёнаў параметраў і Flan-T5 base на 250 мільёнаў. Small адказала правільна на 6, base на 2. Пасля першых 10 было 4:1. У артыкуле, з якім гэтыя мадэлі выйшлі, у small на гэтым тэсце 28,7%, у base 35,9%. Выходзіць, 20 адказаў паказалі не на тую мадэль, ды яшчэ і даволі пераканаўча.

Звычайна я так і выбіраю паміж дзвюма мадэлямі ці двума промптамі. Адкрываю 10 або 20 адказаў, чытаю, выбіраю сімпатычнейшы варыянт і іду далей. Як часта такі выбар памыляецца, я ні разу не лічыў. Палічыць гэта лёгка, калі адказаў хапае, таму я іх сабраў.

Матэматыку да мяне зрабілі іншыя. Дытэрых яшчэ ў 1998 годзе раіў для параўнання двух класіфікатараў тэст Макнемара. Кард з суаўтарамі ў артыкуле "With Little Power Comes Great Responsibility" (2020) пішуць, што ў NLP раз-пораз ставяць эксперыменты з замалой магутнасцю і што сама магутнасць залежыць ад таго, як часта мадэлі адказваюць аднолькава. Мне хацелася ўбачыць гэта ў ліках на сваім выпадку.

## Што я запускаў

У тэставай частцы MMLU 14 042 пытанні з 4 варыянтамі адказу. Роднасныя задачы аўтары Flan з данавучання прыбралі, таму ні small, ні base на гэтым тэсце не давучвалі. Вагі кастрычніка 2022 года, transformers 4.26.0, torch 1.13.1 на працэсары, прагнае дэкадаванне, не больш за 6 новых токенаў, промпт без прыкладаў. Промпт 1 узяты з рэпазіторыя MMLU, пачынаецца з "The following are multiple choice questions (with answers) about" і заканчваецца на "Answer:". Промпт 2 мой, у канцы ў яго "Give the letter of the correct option."

У пробным запуску адно пытанне па гісторыі заняло 657 токенаў, а ў мяне стаяла мяжа 512. Варыянты адказу адрэзала і small адказала `1: Of the Empire of Brazil,`. Пасля гэтага я пакінуў толькі пытанні, у якіх промпт укладваецца ў 256 токенаў. Іх 12 475, далей выбіраў выпадкова. Збіраўся ўзяць 3000. На агульнай машыне з 2 ядрамі часу хапіла на 2000 для абедзвюх мадэляў і на 1500 для промпта 2.

Кожны адказ я чытаў трыма спосабамі. Першы спосаб: `text == key`, гэты радок я пішу заўсёды. Другі бярэ з тэксту першую літару ад A да D, што стаіць асобна. Трэці на тэкст не глядзіць і выбірае найбольшы з 4 логітаў літар на першым кроку.

## Кропка

Да запуску я запісаў, што амаль кожны адказ будзе адной літарай і па форме пра якасць нічога не даведаешся. Small дала голую літару ў 1640 выпадках з 2000, а base толькі ў 795. Яшчэ 1179 адказаў base былі літарай з кропкай, накшталт `B.`

| як чытаем адказ | small | base |
|---|---|---|
| `text == key` | 25,80% | 13,45% |
| першая літара ў тэксце | 30,65% | 33,75% |
| найбольшы логіт літары | 31,05% | 34,05% |

Паводле першага радка small амаль удвая лепшая. Паводле двух іншых наперадзе base. Калі на ўсё адказваць C, на гэтых пытаннях выйдзе 26,35%, значыць, пры дакладным параўнанні абедзве мадэлі прайграюць канстанце. З base я пайшоў бы шукаць памылку, у 13% цяжка паверыць. Наконт small не ўпэўнены: 25,8% падобныя на слабую мадэль, а слабую я і чакаў.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Доля адказаў паводле формы. small, промпт 1: адна літара 82,0%, літара з кропкай 17,1%, нешта іншае 0,9%; дакладнасць 25,80% пры дакладным параўнанні і 30,65%, калі браць першую асобную літару. base, промпт 1: адна літара 39,8%, літара з кропкай 59,0%, нешта іншае 1,3%; дакладнасць 13,45% пры дакладным параўнанні і 33,75%, калі браць першую асобную літару. base, промпт 2: адна літара 98,5%, літара з кропкай 1,5%, нешта іншае 0,1%; дакладнасць 34,07% пры дакладным параўнанні і 34,40%, калі браць першую асобную літару">
  <text x="562.0" y="18.0" text-anchor="end" class="f-label f-muted">тэкст == ключ</text>
  <text x="668.0" y="18.0" text-anchor="end" class="f-label f-muted">першая літара</text>
  <text x="150.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">small, промпт 1</text>
  <rect x="160.0" y="32.0" width="246.0" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="406.0" y="32.0" width="51.3" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="457.3" y="32.0" width="2.7" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">25,80%</text>
  <text x="668.0" y="50.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">30,65%</text>
  <text x="150.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, промпт 1</text>
  <rect x="160.0" y="76.0" width="119.3" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="279.3" y="76.0" width="176.8" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="456.1" y="76.0" width="3.9" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="94.0" text-anchor="end" class="f-mono f-accent" style="font-size:13px">13,45%</text>
  <text x="668.0" y="94.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">33,75%</text>
  <text x="150.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">base, промпт 2</text>
  <rect x="160.0" y="120.0" width="295.4" height="28.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="455.4" y="120.0" width="4.4" height="28.0" style="fill:var(--accent);stroke:none"/>
  <rect x="459.8" y="120.0" width="1.0" height="28.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="562.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34,07%</text>
  <text x="668.0" y="138.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">34,40%</text>
  <rect x="160.0" y="172.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="178.0" y="182.0" text-anchor="start" class="f-label f-muted">адна літара</text>
  <rect x="275.7" y="172.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="293.7" y="182.0" text-anchor="start" class="f-label f-muted">літара з кропкай</text>
  <rect x="424.9" y="172.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="442.9" y="182.0" text-anchor="start" class="f-label f-muted">нешта іншае</text>
</svg>
<figcaption>Што напісалі мадэлі: па 2000 адказаў на першы промпт і 1500 на другі. Справа дакладнасць тых самых адказаў пры 2 спосабах іх чытаць.</figcaption>
</figure>

Промпт 2 кропку амаль прыбірае, яна засталася ў 22 адказах з 1500. На тых самых 1500 пытаннях `text == key` паказаў бы рост base з 13,33% да 34,07% і я расказваў бы, які ўдалы промпт знайшоў. Паводле логітаў там 33,07% і 34,40%.

Далей усё палічана паводле логітаў.

## 20 пытанняў 100 разоў

На ўсіх 2000 пытаннях у base 681 правільны адказ, у small 621. Розніца 3,0 працэнтнага пункта, давяральны інтэрвал 95% ад 0,4 да 5,6, тэст Макнемара дае p = 0,027. У артыкуле разрыў большы, 7,2 пункта, але там у промпце 5 прыкладаў і бяруць увесь тэст.

Я разрэзаў 2000 пытанняў на 100 блокаў па 20 у тым парадку, у якім яны выпалі. Base наперадзе ў 53 блоках, 10 нічыіх, small наперадзе ў 37. Маё 6:2 з пачатку гэта проста першы блок. Да запуску я запісаў, што хаця б у 10 блоках са 100 будзе нічыя або пераможа не тая мадэль. Выйшла 47.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Гістаграма 100 блокаў па 20 пытанняў паводле розніцы правільных адказаў, base мінус small. -6: 1, -5: 2, -4: 4, -3: 6, -2: 12, -1: 12, 0: 10, +1: 14, +2: 15, +3: 9, +4: 5, +5: 5, +6: 5. Small наперадзе ў 37 блоках, нічыіх 10, base наперадзе ў 53.">
  <line x1="50" y1="210.0" x2="660" y2="210.0" class="f-plain"/>
  <rect x="55.0" y="199.6" width="36.9" height="10.4" style="fill:var(--accent);stroke:none"/>
  <text x="73.5" y="194.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <text x="73.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-6</text>
  <rect x="101.9" y="189.3" width="36.9" height="20.8" style="fill:var(--accent);stroke:none"/>
  <text x="120.4" y="184.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">2</text>
  <text x="120.4" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-5</text>
  <rect x="148.8" y="168.5" width="36.9" height="41.5" style="fill:var(--accent);stroke:none"/>
  <text x="167.3" y="163.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">4</text>
  <text x="167.3" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-4</text>
  <rect x="195.8" y="147.8" width="36.9" height="62.3" style="fill:var(--accent);stroke:none"/>
  <text x="214.2" y="142.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">6</text>
  <text x="214.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-3</text>
  <rect x="242.7" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="261.2" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="261.2" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-2</text>
  <rect x="289.6" y="85.5" width="36.9" height="124.5" style="fill:var(--accent);stroke:none"/>
  <text x="308.1" y="80.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">12</text>
  <text x="308.1" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-1</text>
  <rect x="336.5" y="106.3" width="36.9" height="103.8" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="355.0" y="101.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">10</text>
  <text x="355.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <rect x="383.5" y="64.8" width="36.9" height="145.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="401.9" y="59.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">14</text>
  <text x="401.9" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+1</text>
  <rect x="430.4" y="54.4" width="36.9" height="155.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="448.8" y="49.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">15</text>
  <text x="448.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+2</text>
  <rect x="477.3" y="116.6" width="36.9" height="93.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="495.8" y="111.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">9</text>
  <text x="495.8" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+3</text>
  <rect x="524.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="542.7" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="542.7" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+4</text>
  <rect x="571.2" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="589.6" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="589.6" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+5</text>
  <rect x="618.1" y="158.1" width="36.9" height="51.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="636.5" y="153.1" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="636.5" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">+6</text>
  <text x="10.0" y="16.0" text-anchor="start" class="f-label f-muted">блокаў па 20 пытанняў</text>
  <text x="355.0" y="246.0" text-anchor="middle" class="f-label f-muted">правільных адказаў, base мінус small</text>
  <rect x="250.0" y="6.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="268.0" y="16.0" text-anchor="start" class="f-label f-muted">наперадзе small 37</text>
  <rect x="408.6" y="6.0" width="12.0" height="12.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <text x="426.6" y="16.0" text-anchor="start" class="f-label f-muted">нічыя 10</text>
  <rect x="500.2" y="6.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="518.2" y="16.0" text-anchor="start" class="f-label f-muted">наперадзе base 53</text>
</svg>
<figcaption>2000 пытанняў, разрэзаныя на 100 блокаў па 20. На ўсіх разам base наперадзе на 60 адказаў.</figcaption>
</figure>

Для іншых памераў я выбіраў пытанні з гэтых 2000 з вяртаннем, па 20 000 разоў на кожны памер.

| пытанняў | наперадзе base | нічыя | наперадзе small | Макнемар p < 0,05 на карысць base |
|---|---|---|---|---|
| 10 | 45,1% | 21,6% | 33,3% | 0,2% |
| 20 | 51,7% | 14,6% | 33,7% | 1,4% |
| 50 | 59,8% | 8,6% | 31,6% | 3,4% |
| 100 | 66,2% | 5,7% | 28,1% | 5,3% |
| 500 | 86,1% | 1,7% | 12,2% | 18,6% |
| 1000 | 94,3% | 0,6% | 5,1% | 33,9% |
| 2000 | 98,7% | 0,1% | 1,1% | 59,6% |

Узяць адзін знаёмы прадмет таксама не надта дапамагло б. У маёй выбарцы 37 прадметаў, па якіх набралася хаця б 20 пытанняў. У 15 з іх small не адстае ад base.

## Колькі трэба пытанняў

Потым я шукаў памер, пры якім тэст знаходзіць розніцу ў 80% выпадкаў.

| | Макнемар, тыя ж пытанні | параўнанне 2 доляў, тыя ж пытанні | параўнанне 2 доляў, розныя пытанні |
|---|---|---|---|
| small і base, 3,0 пункта | 3100 | 3600 | 3800 |
| промпты 1 і 2 на base, 1,33 пункта | 5700 | 14 600 | 19 800 |

Я быў упэўнены, што парнае параўнанне скароціць колькасць пытанняў хаця б удвая. Абедзвюм сістэмам задаюць адно і тое ж і глядзяць толькі туды, дзе адна адказала правільна, а другая памылілася, таму цяжкасць саміх пытанняў знікае. Для дзвюх мадэляў гэта зэканоміла 18%. Яны адказваюць правільна на розныя пытанні. Толькі small адказала правільна 324 разы, толькі base 384, абедзве 297, карэляцыя паміж двума слупкамі 0,195. Пры дакладнасці каля 30% і 4 варыянтах немалая частка правільных адказаў, думаю, проста ўгадана, а ўгадвае кожная мадэль сваё.

<figure class="fig">
<svg viewBox="0 0 680 236" role="img" aria-label="Як супадаюць адказы 2 сістэм па пытаннях. small і base, 2000 пытанняў: абедзве правільна 297, толькі першая 324, толькі другая 384, абедзве міма 995, для 80%: 3100 парна, 3800 на розных пытаннях. base, промпты 1 і 2, 1500 пытанняў: абедзве правільна 411, толькі першая 85, толькі другая 105, абедзве міма 899, для 80%: 5700 парна, 19 800 на розных пытаннях">
  <text x="20.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">small і base, 2000 пытанняў</text>
  <rect x="20.5" y="28.0" width="94.0" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="67.5" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">297</text>
  <rect x="115.5" y="28.0" width="102.7" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="166.9" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">324</text>
  <rect x="219.2" y="28.0" width="121.9" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="280.2" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">384</text>
  <rect x="342.1" y="28.0" width="317.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="500.8" y="69.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">995</text>
  <text x="660.0" y="90.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">для 80%: 3100 парна, 3800 на розных пытаннях</text>
  <text x="20.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">base, промпты 1 і 2, 1500 пытанняў</text>
  <rect x="20.5" y="128.0" width="174.4" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="107.7" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">411</text>
  <rect x="195.9" y="128.0" width="35.3" height="26.0" style="fill:var(--accent);stroke:none"/>
  <text x="213.5" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">85</text>
  <rect x="232.1" y="128.0" width="43.8" height="26.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="254.0" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">105</text>
  <rect x="276.9" y="128.0" width="382.6" height="26.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="468.2" y="169.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">899</text>
  <text x="660.0" y="190.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">для 80%: 5700 парна, 19 800 на розных пытаннях</text>
  <rect x="20.0" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="38.0" y="222.0" text-anchor="start" class="f-label f-muted">правільна толькі першая</text>
  <rect x="216.1" y="212.0" width="12.0" height="12.0" style="fill:var(--accent);opacity:0.45;stroke:none"/>
  <text x="234.1" y="222.0" text-anchor="start" class="f-label f-muted">правільна толькі другая</text>
  <rect x="412.2" y="212.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="430.2" y="222.0" text-anchor="start" class="f-label f-muted">злева абедзве правільна, справа міма</text>
</svg>
<figcaption>Тэст Макнемара глядзіць толькі на 2 каляровыя кавалкі ў сярэдзіне. Чым яны танчэйшыя, тым больш эканоміць парнасць.</figcaption>
</figure>

У двух промптаў на адной мадэлі карэляцыя 0,717. Пытанняў, дзе правільна адказаў толькі адзін з двух, усяго 85 і 105. Парнасць тут эканоміць у 3,5 раза. Так што правіла працуе там, дзе яно мне найбольш патрэбнае, бо промпты я мяняю значна часцей за мадэлі.

Сказаць, што промпт 2 лепшы, я ўсё роўна не магу. 1,33 пункта, інтэрвал ад -0,47 да 3,13, p = 0,17. Адказы ў яго на выгляд чысцейшыя. Да гэтага вымярэння мне такога хапіла б.

## Чаго я не правяраў

У апошняй табліцы вымераная розніца прынятая за сапраўдную, але ўзятая яна з тых самых 2000 адказаў і насамрэч можа быць меншай. Калі насамрэч паміж small і base 1 пункт, а інтэрвал гэта дапускае, пытанняў спатрэбіцца прыкладна ў 9 разоў больш. Мяжа ў 256 токенаў ударыла ў асноўным па 4 прадметах: на прафесійнае права і 3 прадметы па гісторыі прыпала 1419 з 1567 выкінутых пытанняў. Абедзве мадэлі маленькія і недалёка адышлі ад угадвання. Дакладнейшая пара можа часцей супадаць, тады пытанняў ёй хопіць менш. Вольны тэкст, дзе лепшы адказ выбірае чалавек, я таксама не чапаў. Там свой шум дадае суддзя, а колькі яго, я не ведаю. На 2000 пытанняў у base тут пайшло 19 хвілін, значыць, 3100 зоймуць каля паўгадзіны. Столькі я пачакаю, але для сваёй задачы гэтыя 3100 пытанняў спачатку давядзецца напісаць.
