---
title: "Flan-T5 адказала на 2000 выклікаў кодам 200 OK і памылілася ў 161 суме з 600"
description: "Я паставіў Flan-T5 за маленькі HTTP-сервер і спытаў суму ў 600 сінтэтычных плацёжных дакументах. Усе 2000 выклікаў вярнулі 200 OK, кожны адказ разабраўся, а base памылілася ў 161 суме, large у 35. Base губляла токен дзесятковай коскі і рабіла сумы ў 100 разоў большымі, абедзве мадэлі адказвалі іншай сумай з таго ж дакумента. Якія танныя праверкі што ловяць і 10 памылак, якіх не ловіць ніводная."
date: 2022-12-16
lang: be
translationKey: silent-200-ok
tags: ["llm", "reliability", "numbers"]
---
Праз 2 тыдні пасля выхаду ChatGPT першае, што мне захацелася паспрабаваць, гэта выцягнуць мадэллю суму з плацёжнага дакумента. Я хацеў убачыць, як выглядае памылка ўнутры канвеера, бо там адказы ніхто не чытае і бачаць іх толькі праверкі. API ў ChatGPT пакуль няма. Яго токенаў я не бачу. Таму я ўзяў Flan-T5, мадэль Google, якую можна запусціць на сваёй машыне.

Стэнд наўмысна нудны. Мадэль абгорнутая маленькім HTTP-серверам, які вяртае адказ у полі `generated_text`, як Hugging Face Inference API. Код 500 ён вяртае, толькі калі ў Python узнікла выключэнне. Мой кліент адпраўляе дакумент і пытанне, а ў канцы радок "Answer with the amount only". Потым правярае тое, што я праверыў бы ў любога ўнутранага сэрвісу: статус 200, цела гэта JSON, адказ разбіраецца як сума. Гэтыя 3 праверкі я напісаў першымі, не задумваючыся. Толькі потым зразумеў, што няправільны лік праходзіць усе 3.

Версіі, бо ад іх залежаць лічбы: Python 3.9, torch 1.13.1 на CPU, transformers 4.25.1, прагнае дэкадаванне. У Flan-T5 base 250M параметраў, у large 780M, вагі ў абедзвюх апублікаваныя 21 кастрычніка. Дакументаў 600, яны сінтэтычныя і згенераваныя скрыптам з фіксаваным seed, так што правільны адказ я ведаю для кожнага. Відаў 6, па 100 кожнага. Гэта рахунак, рахунак з неаплачанай папярэдняй запазычанасцю, пацвярджэнне пераказу, чэк, ліст пра вяртанне грошай і напамін пра аплату. Палова дакументаў піша лікі як `PLN 1,284.50`, палова па-еўрапейску, `1 284,50 PLN`.

## Дашборд

Base зрабіла 2000 выклікаў. Кожны дакумент атрымаў асноўнае пытанне і тое ж пытанне іншымі словамі. 4 віды дакументаў атрымалі яшчэ па 2 пытанні пра іншыя палі, яны патрэбныя для адной праверкі ніжэй. Усе 2000 выклікаў вярнулі 200, кожны адказ удалося разабраць. Панэль у Grafana для такога сэрвісу паказала б 0 памылак.

Няправільнай аказалася 161 сума з 600.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Палосы для Flan-T5 base і large. Статус 200: 2000 з 2000 выклікаў у абедзвюх. Цела гэта JSON: усе выклікі. Сума разбіраецца: 600 з 600 дакументаў. Сума правільная: 439 з 600 у base, 565 з 600 у large.">
  <text x="12" y="18" class="f-label f-muted">што правяраў кліент і што было насамрэч</text>
  <text x="12" y="44" class="f-mono f-accent" style="font-size:12px">flan-t5-base</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:11px">статус 200</text>
  <rect x="196" y="56" width="330" height="14" class="f-box"/>
  <text x="536" y="67" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="90" class="f-mono f-ink" style="font-size:11px">цела гэта JSON</text>
  <rect x="196" y="80" width="330" height="14" class="f-box"/>
  <text x="536" y="91" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="114" class="f-mono f-ink" style="font-size:11px">сума разбіраецца</text>
  <rect x="196" y="104" width="330" height="14" class="f-box"/>
  <text x="536" y="115" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="138" class="f-mono f-ink" style="font-size:11px">сума правільная</text>
  <rect x="196" y="128" width="241" height="14" class="f-box"/>
  <rect x="437" y="128" width="89" height="14" class="f-accent"/>
  <text x="536" y="139" class="f-mono f-ink" style="font-size:11px">439/600</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">flan-t5-large</text>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">статус 200</text>
  <rect x="196" y="178" width="330" height="14" class="f-box"/>
  <text x="536" y="189" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">цела гэта JSON</text>
  <rect x="196" y="202" width="330" height="14" class="f-box"/>
  <text x="536" y="213" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">сума разбіраецца</text>
  <rect x="196" y="226" width="330" height="14" class="f-box"/>
  <text x="536" y="237" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="260" class="f-mono f-ink" style="font-size:11px">сума правільная</text>
  <rect x="196" y="250" width="311" height="14" class="f-box"/>
  <rect x="507" y="250" width="19" height="14" class="f-accent"/>
  <text x="536" y="261" class="f-mono f-ink" style="font-size:11px">565/600</text>
  <rect x="196" y="284" width="14" height="14" class="f-box"/>
  <text x="216" y="295" class="f-label f-muted">прайшло</text>
  <rect x="326" y="284" width="14" height="14" class="f-accent"/>
  <text x="346" y="295" class="f-label f-muted">няправільна</text>
</svg>
<figcaption>Кожная праверка кліента прайшла на кожным выкліку. Няправільных сум 161 у base і 35 у large.</figcaption>
</figure>

Першым няправільным адказам, які я адкрыў, быў чэк з `TOTAL 437,78 EUR`, а мадэль адказала `43778 EUR`. Спачатку я вырашыў, што коску з'еў мой парсер, потым, што яе губляе токенізатар пры дэкадаванні. Праверыў і тое і другое, перш чым паверыў, што гэта мадэль. Токенізатар разбівае ўваход на `▁4`, `37`, `,`, `78`, `▁EUR`, а мадэль згенеравала `▁4`, `37`, `78`, `▁EUR`. Коска на гэтым кроку была ў яе другім варыянтам, з імавернасцю 0,12 супраць 0,79 у `78`. У выніку сума становіцца ў 100 разоў большай. Так здарылася 52 разы на правільным ліку і яшчэ 10 разоў на іншым ліку з дакумента. Усе 52 выпадкі ў запісе з дзесятковай коскай.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="Токены радка чэка: 4, 37, коска, 78, EUR. Адказ base: 4, 37, 78, EUR, без коскі, так што 437,78 становіцца 43778. Ніжэй няправільныя сумы па відах, base і large: іншая сума з дакумента 68 і 28, кавалак тэксту, колькасць або нумар 27 і 0, згублены дзесятковы падзельнік 62 і 5, іншае 4 і 2.">
  <text x="12" y="18" class="f-label f-muted">уваход, радок чэка TOTAL</text>
  <rect x="12" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="32.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁TO</text>
  <rect x="61" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="81.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">TAL</text>
  <rect x="110" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="126" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="150" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="166" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="190" y="26" width="23" height="26" rx="3" class="f-accent"/>
  <text x="201.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">,</text>
  <rect x="221" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="237" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="261" y="26" width="50" height="26" rx="3" class="f-box"/>
  <text x="286" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="327" y="44" class="f-mono f-muted" style="font-size:13px">437,78</text>
  <text x="12" y="78" class="f-label f-muted">адказ base</text>
  <rect x="12" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="28" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="52" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="68" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="92" y="86" width="34" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <rect x="134" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="150" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="174" y="86" width="50" height="26" rx="3" class="f-box"/>
  <text x="199" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="240" y="104" class="f-mono f-accent" style="font-size:13px">43778</text>
  <text x="12" y="150" class="f-label f-muted">няправільныя сумы па відах</text>
  <text x="420" y="150" class="f-label f-muted" text-anchor="end">base</text>
  <text x="560" y="150" class="f-label f-muted" text-anchor="end">large</text>
  <text x="12" y="178" class="f-mono f-ink" style="font-size:11px">іншая сума з дакумента</text>
  <text x="420" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">68</text>
  <text x="560" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">28</text>
  <line x1="12" y1="186" x2="570" y2="186" class="f-plain"/>
  <text x="12" y="204" class="f-mono f-ink" style="font-size:11px">кавалак тэксту, колькасць, нумар</text>
  <text x="420" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">27</text>
  <text x="560" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">0</text>
  <line x1="12" y1="212" x2="570" y2="212" class="f-plain"/>
  <text x="12" y="230" class="f-mono f-ink" style="font-size:11px">згублены дзесятковы падзельнік</text>
  <text x="420" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">62</text>
  <text x="560" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">5</text>
  <line x1="12" y1="238" x2="570" y2="238" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:11px">іншае</text>
  <text x="420" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">4</text>
  <text x="560" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">2</text>
  <line x1="12" y1="270" x2="570" y2="270" class="f-line"/>
  <text x="420" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">161</text>
  <text x="560" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">35</text>
</svg>
<figcaption>Flan-T5 base прапускае токен коскі. Усе 52 адказы, дзе лічбы правільныя, а сума ў 100 разоў большая, прыйшлі з дакументаў у запісе 1 284,50.</figcaption>
</figure>

Большы клас памылак заўважыць цяжэй. 68 няправільных адказаў гэта іншыя сумы з таго ж дакумента, запісаныя як звычайныя сумы, проста не тая, пра якую я пытаўся. У напаміне напісана "Invoice 52081 dated 2022-05-02 for PLN 2,501.80 is overdue. We received PLN 500.36 from you on 2022-09-21. The remaining PLN 2,001.44 is due…" Base адказала зыходнай сумай рахунку ў 73 напамінах з 100, прычым у 10 з іх яшчэ і згубіла коску. Яшчэ ў 1 напаміне яна памылілася па-іншаму. Я думаў, што яна проста бярэ першую суму. Але ў рахунку з папярэдняй запазычанасцю сума да аплаты стаіць апошнім радком. Там base адказала правільна 87 разоў з 100. Так што я не ведаю, ад чаго гэта залежыць. 27 адказаў гэта кавалкі тэксту, скапіяваныя з дакумента, часцей за ўсё радкі чэка, з якіх мой парсер узяў першы лік. У апошніх 4 лічбы сапсаваныя неяк інакш.

## Праверкі, якія можна дадаць без разметкі

Да прагону я запісаў, чаго чакаю, каб потым не падганяць пад вынік. Я чакаў, што праверка "ці ёсць гэтая сума ў дакуменце" зловіць менш за палову няправільных адказаў. Яшчэ я чакаў, што пытанне, зададзенае двойчы рознымі словамі, зловіць больш. Абедзве ідэі не мае. Узгодненасць адказаў выкарыстоўвалі Wang et al. у сакавіку, а ў ліпені Kadavath et al. вывучалі, наколькі мадэль ведае, калі яна мае рацыю.

У азначэнні маёй першай праверкі па дакуменце была памылка. Яна параўноўвала з любым ланцужком лічбаў, таму колькасць тавару з радка чэка праходзіла. Злавіла яна 66 з 161. Калі я пакінуў толькі сумы з 2 знакамі пасля падзельніка, яна злавіла 91, больш за палову, так што для base маё чаканне не спраўдзілася. Ілжывай трывогі гэтая праверка даць не можа, бо правільны адказ заўсёды ёсць у дакуменце. Строгая праверка фармату патрабуе адзін лік з групамі па 3 лічбы і роўна 2 знакі пасля падзельніка. Яна ловіць амаль тыя ж адказы, 91 з 161, пры 2 ілжывых трывогах на 439 правільных.

Двайное пытанне спрацавала горш, чым я чакаў. Яно злавіла 53 няправільныя адказы і пазначыла 105 правільных з 439. Base часта дае 2 розныя адказы, адзін з якіх правільны. Уласная ўпэўненасць мадэлі справілася лепш, але не настолькі, каб спадзявацца толькі на яе. Я ўзяў сярэднюю лагарыфмічную імавернасць токенаў адказу і пазначыў 20% найменш упэўненых адказаў. Пазначанымі аказаліся 67 няправільных і 53 правільныя. AUROC роўны 0,76, гэта значыць выпадковы няправільны адказ менш упэўнены, чым выпадковы правільны, прыкладна ў 3 выпадках з 4.

Арыфметыка спачатку выглядала пераможцай. У 4 відах дакументаў палі складваюцца: сума без ПДВ (subtotal) плюс ПДВ (VAT) дае выніковую суму, сума рахунку плюс папярэдняя запазычанасць дае суму да аплаты, вяртанне плюс утрыманы збор дае зыходнае спісанне, аплачанае плюс рэшта да аплаты дае суму рахунку. Я пытаю ў мадэлі значэнні 2 іншых палёў і складваю. Там, дзе гэта дастасавальна, праверка злавіла 103 няправільныя сумы з 103 і пазначыла 130 правільных з 297. Потым я паглядзеў на рахункі. На пытанне пра VAT base ні разу не дала правільнага ліку і 67 разоў вярнула subtotal, так што на рахунках праверка пазначае ўсё запар. Без рахункаў яна злавіла 87 няправільных сум з 87 пры 46 ілжывых трывогах на 213 правільных.

<figure class="fig">
<svg viewBox="0 0 640 220" role="img" aria-label="Табліца праверак. Сума ёсць у дакуменце: base 91 з 161 без ілжывых трывог, large 7 з 35, таксама без. Строгі фармат: 91 і 8. Той жа адказ на перафраз: base 53, ілжывых трывог 105, large 7, ілжывых трывог 41. 20% найменш упэўненых: base 67, ілжывых трывог 53, large 14, ілжывых трывог 106. Арыфметыка: base 103, ілжывых трывог 130, large 21, ілжывых трывог 8. Усе тры разам: 159 і 25.">
  <text x="12" y="18" class="f-label f-muted">злоўлена няправільных сум і ілжывых трывог на правільных</text>
  <text x="12" y="42" class="f-label f-muted">праверка</text>
  <text x="340" y="42" class="f-label f-muted" text-anchor="end">base: злоўлена</text>
  <text x="398" y="42" class="f-label f-muted" text-anchor="end">ілжывых</text>
  <text x="540" y="42" class="f-label f-muted" text-anchor="end">large: злоўлена</text>
  <text x="600" y="42" class="f-label f-muted" text-anchor="end">ілжывых</text>
  <text x="12" y="69" class="f-mono f-ink" style="font-size:11px">сума ёсць у дакуменце</text>
  <rect x="214" y="60" width="70" height="12" class="f-plain"/>
  <rect x="214" y="60" width="40" height="12" class="f-box"/>
  <text x="340" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <rect x="414" y="60" width="70" height="12" class="f-plain"/>
  <rect x="414" y="60" width="14" height="12" class="f-box"/>
  <text x="540" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <text x="12" y="95" class="f-mono f-ink" style="font-size:11px">строгі фармат сумы</text>
  <rect x="214" y="86" width="70" height="12" class="f-plain"/>
  <rect x="214" y="86" width="40" height="12" class="f-box"/>
  <text x="340" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">2</text>
  <rect x="414" y="86" width="70" height="12" class="f-plain"/>
  <rect x="414" y="86" width="16" height="12" class="f-box"/>
  <text x="540" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">8/35</text>
  <text x="600" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">1</text>
  <text x="12" y="121" class="f-mono f-ink" style="font-size:11px">той жа адказ на перафраз</text>
  <rect x="214" y="112" width="70" height="12" class="f-plain"/>
  <rect x="214" y="112" width="23" height="12" class="f-box"/>
  <text x="340" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">53/161</text>
  <text x="398" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">105</text>
  <rect x="414" y="112" width="70" height="12" class="f-plain"/>
  <rect x="414" y="112" width="14" height="12" class="f-box"/>
  <text x="540" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">41</text>
  <text x="12" y="147" class="f-mono f-ink" style="font-size:11px">20% найменш упэўненых</text>
  <rect x="214" y="138" width="70" height="12" class="f-plain"/>
  <rect x="214" y="138" width="29" height="12" class="f-box"/>
  <text x="340" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">67/161</text>
  <text x="398" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">53</text>
  <rect x="414" y="138" width="70" height="12" class="f-plain"/>
  <rect x="414" y="138" width="28" height="12" class="f-box"/>
  <text x="540" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">14/35</text>
  <text x="600" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">106</text>
  <text x="12" y="173" class="f-mono f-ink" style="font-size:11px">арыфметыка дакумента</text>
  <rect x="214" y="164" width="70" height="12" class="f-plain"/>
  <rect x="214" y="164" width="45" height="12" class="f-box"/>
  <text x="340" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">103/161</text>
  <text x="398" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="164" width="70" height="12" class="f-plain"/>
  <rect x="414" y="164" width="42" height="12" class="f-box"/>
  <text x="540" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">21/35</text>
  <text x="600" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">8</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-line"/>
  <text x="12" y="199" class="f-mono f-ink" style="font-size:11px">фармат, дакумент, арыфметыка</text>
  <rect x="214" y="190" width="70" height="12" class="f-plain"/>
  <rect x="214" y="190" width="69" height="12" class="f-box"/>
  <text x="340" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">159/161</text>
  <text x="398" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="190" width="70" height="12" class="f-plain"/>
  <rect x="414" y="190" width="50" height="12" class="f-box"/>
  <text x="540" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">25/35</text>
  <text x="600" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">9</text>
</svg>
<figcaption>З 161 няправільных і 439 правільных адказаў у base, 35 і 565 у large. Арыфметыка ёсць у 4 відах дакументаў з 6.</figcaption>
</figure>

## Большая мадэль

Large значна лепшая, але ў 3 разы павольнейшая. На 4 ядрах віртуальнай машыны з AMD EPYC 7713 у яе 1,6 секунды на выклік супраць 0,5. Яна памылілася ў 35 сумах з 600. Зноў усе выклікі вярнулі 200 OK. Усе адказы ўдалося разабраць. Я чакаў менш памылак, але не чакаў, што танныя праверкі амаль перастануць працаваць. Праверка па дакуменце злавіла 7 з 35, строгі фармат 8. Двайное пытанне таксама 7, пры 41 ілжывай трывозе. 20% найменш упэўненых злавілі 14 пры 106 ілжывых. 28 няправільных адказаў з 35 гэта іншыя сумы з дакумента. Выглядаюць яны дакладна як правільныя.

Арыфметыка там, дзе дастасавальная, працуе і тут: 21 з 21 пры 8 ілжывых трывогах на 379, бо large правільна адказала на 791 пытанне пра палі з 800. Разам з арыфметыкай праверка па дакуменце і строгі фармат ловяць 25 з 35.

Астатнія 10 гэта адна і тая ж памылка. Base яе ні разу не рабіла. У пацвярджэнні пераказу large адказвала сумай з радка "Balance after transfer", гэта значыць астаткам на рахунку пасля пераказу, а не сумай. Так было 11 разоў, строгая праверка адкінула толькі 1 з іх. У base на пераказах таксама было 5 памылак, але гэта згубленыя коскі і сапсаваныя лічбы, іх праверкі бачаць. У маім шаблоне пераказу няма астатку да пераказу, таму ніякая сума не звязвае суму пераказу з іншымі лікамі. Двайное пытанне пазначыла 5 з 10, упэўненасць 2. Для астатніх патрэбна другая крыніца, напрыклад уласны запіс банка пра аперацыю.

## Чаго я не правяраў

- ChatGPT і `text-davinci-003`. Я мераў толькі 2 невялікія адкрытыя мадэлі і не ведаю, ці губляе коскі значна большая мадэль. Думаю, што не. Але правільны лік не з таго радка гэта памылка, якая, як я чакаю, застанецца.
- Сапраўдныя дакументы. Мае 6 шаблонаў кароткія і чыстыя, таму доля памылак па шаблоне кажа пра мае шаблоны. Тое, што base памылілася ў 74 напамінах з 100, хутчэй кажа пра тое, як я напісаў напамін, чым пра мадэль.
- Промпты. Адна фармулёўка інструкцыі і адзін перафраз кожнага пытання. Іншая інструкцыя магла б моцна змяніць вынік на напамінах.
- Паўторы. Толькі прагнае дэкадаванне. Усе вынікі тут з аднаго прагону. Я перазапусціў 2 дакументы па-за серверам і атрымаў тыя ж токены, але ўвесь прагон не паўтараў.
