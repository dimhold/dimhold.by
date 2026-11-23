---
title: "GPT-2 лічыць, што 94 плюс 4 гэта 108. Упэўненасць 1,4 %"
description: "GPT-2 трох памераў на 1500 арыфметычных задачах кожная, у фармаце з артыкула пра GPT-3. Яна мае рацыю прыкладна ў 1 выпадку са 100. Яе ўласныя імавернасці кажуць тое ж: у сярэднім ад 1,4 да 1,6 % на надрукаваны адказ. Залішняя ўпэўненасць, якой я чакаў, аказалася ў надрукаваным тэксце, а ён выглядае аднолькава ў правільнага і няправільнага адказу."
date: 2020-07-18
lang: be
translationKey: model-arithmetic-confidence
tags: ["llm", "machine-learning", "numbers"]
---
У канцы мая OpenAI выклала артыкул пра GPT-3. Адну табліцу ў ім я перачытаў некалькі разоў. З 50 вырашанымі прыкладамі ў промпце мадэль на 175B складае двухзначныя лікі правільна ў 100 % выпадкаў. На трохзначных у яе 80,4 %. Самая маленькая мадэль з той жа табліцы, 125M параметраў, на тым жа двухзначным складанні набірае 2 %. З таго часу тыя, хто атрымаў доступ да API, выкладаюць дэма GPT-3, але вагаў у адкрытым доступе няма, а API гэта закрытая бэта. Сам я нічога з гэтага праверыць не магу.

Праверыць я магу GPT-2. Яе вагі OpenAI выклала ў мінулым годзе. Маленькая версія на 124M параметраў прыкладна такога ж памеру, як самая маленькая GPT-3. А яшчэ ў мяне было пытанне, на якое артыкул не адказвае. Калі мадэль памыляецца, ці ведае яна пра гэта?

Я быў упэўнены, што не. Няправільны адказ выходзіць дакладна ў такім жа выглядзе, як правільны: "A: 108", без усякіх "здаецца" і "прыкладна". Да таго ж Guo з сааўтарамі ў 2017 годзе паказалі, што сучасныя класіфікатары выяў залішне ўпэўненыя. Я чакаў таго ж. Да гэтага я ні разу не глядзеў на імавернасці за надрукаваным адказам, толькі на тэкст. Перад падлікам я запісаў чаканне. На няправільных адказах мадэль павінна даваць свайму адказу больш за 30 % імавернасці. Яе сярэдняя ўпэўненасць павінна быць хаця б на 20 пунктаў вышэй за дакладнасць.

## Як мераў

Фармат промпта ўзяты з артыкула пра GPT-3: "Q: What is 94 plus 4?", новы радок і "A:". Перад пытаннем ідуць 5 вырашаных прыкладаў таго ж віду, у артыкуле іх было 50. Задачы: складанне і адніманне двухзначных і трохзначных лікаў плюс множанне двухзначных. На кожны від 300 выпадковых задач з фіксаваным сідам. Я прагнаў 3 памеры GPT-2, 124M, 355M і 774M параметраў, арыгінальныя вагі ў float32 на CPU. Дэкадаванне прагнае: на кожным кроку мадэль бярэ самы імаверны токен, пакуль не напіша знак новага радка.

Упэўненасць тут гэта імавернасць, якую мадэль дае ўсяму надрукаванаму адказу. Гэта значыць імавернасць ліку і знака новага радка, якім ён заканчваецца, перамножаная па токенах. Асобна я бяру імавернасць правільнага адказу, каб бачыць, наколькі далёка была праўда. Лікі GPT-2 рэжа на токены няроўна. " 98" і " 108" гэта адзін токен кожны, " 517" гэта " 5" і "17". А " 1944" зноў адзін токен, мабыць, таму што гэта год.

Першы прагон згубіў усе адмоўныя адказы. Мінус GPT-2 піша асобным токенам " -", а лічбы ідуць следам. Мой парсер чакаў, што лік пачынаецца з лічбы, таму кожны адмоўны адказ ператвараўся ў "не лік". Заўважыў я гэта толькі на тэставым прагоне з 20 задач, дзе кожны адказ з мінусам вярнуўся пустым.

## Лічыць дрэнна

З 1500 задач маленькая мадэль адказала правільна 14 разоў, сярэдняя 10, вялікая 13. На двухзначным складанні ў маленькай 1,3 %. Гэта блізка да 2 % у самай маленькай GPT-3 з артыкула. У 6 разоў большая мадэль зусім не дапамагла: 774M памыляецца гэтак жа часта, як 124M.

Большасць правільных адказаў прыпадае на лёгкія задачы. У 10 з 14 у маленькай мадэлі адзін з лікаў 0 або 1, напрыклад 0 памножыць на 13 або 796 плюс 0. Няправільныя адказы таксама не падобныя на промахі побач з мэтай. Толькі каля 10 % з іх адстаюць ад праўды не больш чым на 10. Апошняя лічба супадае прыкладна ў 11 % з іх, а выпадковы лік угадаў бы яе ў 10 %. У артыкуле пра GPT-3 напісана, што вялікая мадэль часта забывае перанесці адзінку. GPT-2 да такой памылкі звычайна проста не дабіраецца.

## Упэўненасць

Сярэдняя ўпэўненасць трох мадэляў ад 1,4 да 1,6 %. Усяго ў трох мадэляў 4463 няправільныя адказы. Толькі ў 2 з іх упэўненасць вышэй за 50 %, а вышэй за 90 % няма ні ў аднаго. Мадэль мае рацыю прыкладна ў 1 выпадку са 100 і яе ўласныя імавернасці кажуць прыкладна тое ж. Розніца паміж сярэдняй упэўненасцю і дакладнасцю ад 0,6 да 0,7 пункта, а я чакаў хаця б 20.

<figure class="fig">
<svg viewBox="0 0 680 340" role="img" aria-label="10 самых імаверных першых токенаў GPT-2 774M пасля &quot;Q: What is 94 plus 4? A:&quot;, перад пытаннем 5 вырашаных прыкладаў. 108: 1,43 %. 111: 1,33 %. 110: 1,31 %. 104: 1,31 %. 109: 1,22 %. 115: 1,22 %. 114: 1,19 %. 105: 1,17 %. 99: 1,16 %. 103: 1,13 %. Правільны адказ 98 на 15 месцы з 1,05 %. Усе токены, з якіх пачынаецца лік, разам атрымліваюць 99,4 %.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">Q: What is 94 plus 4?  A: …</text>
  <text x="44.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#1</text>
  <text x="98.0" y="44.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">108</text>
  <rect x="110" y="33" width="403.5" height="14" class="f-accent"/>
  <text x="519.5" y="44.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1,43 %</text>
  <text x="575.5" y="44.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">← надрукавана</text>
  <text x="44.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#2</text>
  <text x="98.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">111</text>
  <rect x="110" y="55" width="373.2" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="489.2" y="66.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,33 %</text>
  <text x="44.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#3</text>
  <text x="98.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">110</text>
  <rect x="110" y="77" width="368.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="484.4" y="88.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,31 %</text>
  <text x="44.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#4</text>
  <text x="98.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">104</text>
  <rect x="110" y="99" width="367.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="483.4" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,31 %</text>
  <text x="44.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#5</text>
  <text x="98.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">109</text>
  <rect x="110" y="121" width="344.1" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="460.1" y="132.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,22 %</text>
  <text x="44.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#6</text>
  <text x="98.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">115</text>
  <rect x="110" y="143" width="343.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="459.9" y="154.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,22 %</text>
  <text x="44.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#7</text>
  <text x="98.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">114</text>
  <rect x="110" y="165" width="334.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="450.5" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,19 %</text>
  <text x="44.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#8</text>
  <text x="98.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">105</text>
  <rect x="110" y="187" width="330.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="446.5" y="198.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,17 %</text>
  <text x="44.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#9</text>
  <text x="98.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">99</text>
  <rect x="110" y="209" width="326.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="442.9" y="220.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,16 %</text>
  <text x="44.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#10</text>
  <text x="98.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">103</text>
  <rect x="110" y="231" width="317.0" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="433.0" y="242.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,13 %</text>
  <text x="70.0" y="264.0" text-anchor="middle" class="f-mono f-muted" style="font-size:13px">…</text>
  <text x="116.0" y="264.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">яшчэ 4</text>
  <text x="44.0" y="286.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#15</text>
  <text x="98.0" y="286.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">98</text>
  <rect x="110" y="275" width="295.7" height="14" class="f-ink"/>
  <text x="411.7" y="286.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,05 %</text>
  <text x="467.7" y="286.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">← правільны адказ</text>
  <line x1="110" y1="26" x2="110" y2="296" class="f-line"/>
  <text x="110.0" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,0 %</text>
  <text x="250.6" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,5 %</text>
  <text x="391.3" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,0 %</text>
  <text x="531.9" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,5 %</text>
  <text x="335.0" y="328.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">імавернасць токена</text>
</svg>
<figcaption>GPT-2 774M, float32, 5 прыкладаў у промпце, першая задача набору. Імавернасці першага токена адказу. Прагнае дэкадаванне друкуе самы імаверны, 108. Правільны адказ 98 на 15 месцы. Токены, з якіх пачынаецца лік, разам трымаюць 99,4 % імавернасці, размазанай па мностве кандыдатаў.</figcaption>
</figure>

На малюнку першая задача набору, 94 плюс 4, у мадэлі на 774M. Яна надрукавала 108. Як першы токен адказу, 108 меў імавернасць 1,43 %. Адразу за ім ідуць 111 з 1,33 і 110 з 1,31. Правільны адказ 98 на 15 месцы з 1,05. На "нейкі лік" мадэль кладзе 99,4 % імавернасці і размазвае яе па ўсім, што каля 100. Сума двух лікаў, меншых за 100, у сярэднім якраз каля 100. Да таго ж 3 з 5 адказаў у прыкладах гэтага промпта роўныя 93, 101 і 104. Якая з дзвюх прычын важнейшая, я не правяраў. Але падобна, што мадэль угадвае памер адказу, а не складае.

Выгляд упэўненасці, якога я чакаў, бярэцца з дэкадавання. Прагнае дэкадаванне выбірае 1,43 супраць 1,33 і друкуе пераможцу гэтак жа, як надрукавала б правільны адказ. Амаль 99 %, што пайшлі на іншыя варыянты, у тэксце не відаць.

На малюнку 2 тое ж самае па ўсіх задачах. У кожнага памеру медыянная імавернасць таго, што адказ пачнецца з ліку, ад 99,1 да 99,3 %. Ва ўсіх 4500 выпадках самы імаверны першы токен гэта лік. На двухзначным складанні мадэлям трэба ад 45 да 48 розных лікаў, каб набраць палову гэтай імавернасці.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Для кожнага памеру GPT-2 па 1500 задачах: медыянная імавернасць таго, што адказ пачнецца з ліку, сярэдняя імавернасць надрукаванага адказу і доля правільных адказаў. GPT-2 124M: адказ будзе лікам 99,2 %, упэўненасць у сваім адказе 1,6 %, правільныя адказы 0,9 %. GPT-2 355M: адказ будзе лікам 99,1 %, упэўненасць у сваім адказе 1,4 %, правільныя адказы 0,7 %. GPT-2 774M: адказ будзе лікам 99,3 %, упэўненасць у сваім адказе 1,4 %, правільныя адказы 0,9 %.">
  <text x="20.0" y="32.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 124M</text>
  <text x="220.0" y="51.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">адказ будзе лікам</text>
  <rect x="230" y="40" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="40" width="367.0" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,2 %</text>
  <text x="220.0" y="71.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">упэўненасць у сваім адказе</text>
  <rect x="230" y="60" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="60" width="6.0" height="14" class="f-accent"/>
  <text x="608.0" y="71.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,6 %</text>
  <text x="220.0" y="91.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">правільныя адказы</text>
  <rect x="230" y="80" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="80" width="3.5" height="14" class="f-ink"/>
  <text x="608.0" y="91.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,9 %</text>
  <text x="20.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 355M</text>
  <text x="220.0" y="157.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">адказ будзе лікам</text>
  <rect x="230" y="146" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="146" width="366.9" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,1 %</text>
  <text x="220.0" y="177.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">упэўненасць у сваім адказе</text>
  <rect x="230" y="166" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="166" width="5.1" height="14" class="f-accent"/>
  <text x="608.0" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,4 %</text>
  <text x="220.0" y="197.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">правільныя адказы</text>
  <rect x="230" y="186" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="186" width="2.5" height="14" class="f-ink"/>
  <text x="608.0" y="197.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,7 %</text>
  <text x="20.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 774M</text>
  <text x="220.0" y="263.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">адказ будзе лікам</text>
  <rect x="230" y="252" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="252" width="367.4" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="263.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,3 %</text>
  <text x="220.0" y="283.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">упэўненасць у сваім адказе</text>
  <rect x="230" y="272" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="272" width="5.3" height="14" class="f-accent"/>
  <text x="608.0" y="283.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,4 %</text>
  <text x="220.0" y="303.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">правільныя адказы</text>
  <rect x="230" y="292" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="292" width="3.2" height="14" class="f-ink"/>
  <text x="608.0" y="303.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,9 %</text>
  <text x="230.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0 %</text>
  <text x="415.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50 %</text>
  <text x="600.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 %</text>
</svg>
<figcaption>1500 задач на мадэль: складанне і адніманне двухзначных і трохзначных лікаў, множанне двухзначных, па 300 кожнага віду. Верхняя паласа: медыянная імавернасць таго, што першы токен адказу пачынае лік. У сярэдзіне: сярэдняя імавернасць надрукаванага адказу, перамножаная па яго токенах. Ніжняя: доля правільных адказаў.</figcaption>
</figure>

Пры гэтым імавернасці сёе-тое кажуць, але правільных адказаў, каб гэта праверыць, мала. Возьмем выпадковы правільны адказ і выпадковы няправільны ад адной мадэлі. У правільнага ўпэўненасць вышэй у 83 % такіх пар у маленькай мадэлі і ў 90 % у вялікай. Прыкметная частка гэтага прыпадае на лёгкія задачы: на 0 памножыць на 13 маленькая мадэль адказвае "0" з імавернасцю 49 %. Без задач з 0 або 1 доля падае да 68–80 %. Правільных адказаў пры гэтым застаецца ўсяго ад 3 да 5 на мадэль.

У самых упэўненых няправільных адказаў свая заканамернасць. На 374 плюс 917 маленькая мадэль адказала 917 з імавернасцю 57 %, гэта яе самая ўпэўненая памылка. Возьмем 10 % самых упэўненых няправільных адказаў кожнай мадэлі. Ад 24 да 36 % з іх проста паўтараюць адзін з двух лікаў пытання. Сярод усіх няправільных адказаў такіх ад 6 да 10 %.

## Чаго я не правяраў

Саму GPT-3. Гэта самае цікавае. Мадэль, якая правільна складае ўсе двухзначныя лікі, можа быць адкалібраваная зусім па-іншаму. Доступу, каб гэта праверыць, у мяне няма. Самай вялікай GPT-2 на 1,5B параметраў трэба больш памяці, чым было вольнай на машыне, дзе я мераў, таму яе тут няма. У промпце было 5 прыкладаў, а не 50, як у артыкуле. Сэмплаванне і beam search я не спрабаваў і словамі ў мадэлі, ці ўпэўненая яна, не пытаўся. Кожны лік вышэй атрыманы адным прагонам. Пры прагным дэкадаванні і фіксаваных задачах другі прагон дае тыя ж адказы.

Калі мадэль друкуе лік, сам тэкст нічога не кажа пра тое, наколькі яна была ўпэўненая. Наступным разам я хачу бачыць побач з адказам імавернасці токенаў.
