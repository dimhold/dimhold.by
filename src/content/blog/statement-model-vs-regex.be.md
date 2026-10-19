---
title: "Мадэль за маімі рэгуляркамі для выпісак ператварыла 300 гучных збояў у 249 ціхіх памылак"
description: "Я напісаў рэгуляркі пад 2 фарматы банкаўскай выпіскі і даў тыя ж 600 аперацый у 4 фарматах Flan-T5 base і large. Рэгулярка гучна адмовіла на 2 фарматах, якіх не бачыла. Мадэль памылялася ў даце часцей, чым у суме, адказвала першым днём перыяду і рэштай. Амаль ніколі так, каб гэта выклікала памылку. Схема спачатку рэгулярка, потым мадэль дала больш правільных адказаў і 249 ціхіх няправільных."
date: 2022-12-15
lang: be
translationKey: statement-model-vs-regex
tags: ["llm", "reliability", "text"]
---
Ужо 2 тыдні, як выйшаў ChatGPT. З таго часу ў маёй стужцы поўна скрыншотаў, дзе чалавек устаўляе туды дакумент і атрымлівае назад палі. Банкаўская выпіска тут класічны выпадак. Кожны банк выгружае яе па-свойму. Звычайны адказ на гэта парсер з рэгуляркай для кожнага банка, які ламаецца ў той дзень, калі банк мяняе выгрузку. Я ні разу не мераў, як мадэль выглядае побач з такім парсерам. Я лічыў, што дату мадэль хаця б скапіюе правільна. Таму пытанне для мяне было толькі ў тым, як часта яна памыляецца ў суме.

## Як я мераў

Я ўзяў 4 фарматы выпіскі і згенераваў скрыптам па 150 аперацый у кожным, seed 2022, так што кожны правільны адказ вядомы. Кожная аперацыя павінна ператварыцца ў 3 палі: дату, суму са знакам (спісанне з мінусам) і контрагента. Фарматы выглядаюць так:

```
A  14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37
B  Date: 2022-06-20  Description: Transfer to Piotr Wisniewski, title: gift  Amount: -2,327.19 PLN  Balance: -5,575.15 PLN
C  12 Jun 2022  CARD PAYMENT BOOKING.COM 33.40 EUR  157.32 DR  25,180.67 CR
D  15/06/2022  Card payment                4.55                 53,361.89
               AUCHAN 5293 GDANSK
```

Апошні лік у кожным радку гэта рэшта на рахунку пасля аперацыі. У аплат карткай за мяжой у апісанні ёсць яшчэ сума ў валюце пакупкі. Парсер на рэгулярках я напісаў толькі для A і B, 34 радкі на Python. Напісаў да таго, як паглядзеў на C і D. C і D гуляюць ролю банка, які змяніў выгрузку.

Мадэль гэта Flan-T5 ад Google, base (250 млн параметраў) і large (780 млн), якія выйшлі ў кастрычніку. Яна працуе ў мяне на машыне: 4 ядры віртуалкі на AMD EPYC, Python 3.9, torch 1.13, transformers 4.25.1, прагнае дэкадаванне. На кожную аперацыю 4 пытанні: дата, сума, кірунак грошай і хто другі бок. У промпце ёсць яшчэ радок выпіскі з першым і апошнім днём перыяду. На сапраўднай старонцы ён ёсць і з яго відаць, у якім фармаце банк піша даты. Абодва спосабы атрымліваюць аперацыі ўжо нарэзанымі на блокі, так што разбіццё старонкі тут не мераецца.

Аперацыя лічыцца правільнай, толькі калі правільныя ўсе 3 палі. Няправільны вынік гучны, калі ён не разбіраецца. Гэта значыць, што рэгулярка не знайшла супадзення або мадэль дала дату, якая не дата. Ціхі, калі разбіраецца і няправільны.

## Рэгуляркі

На A і B парсер даў 293 правільныя аперацыі з 300. 7 няправільных на маім сумленні. У радку пераводу фармату A імя і прызначэнне плацяжу ідуць запар, без раздзяляльніка, вялікімі літарамі: `TRANSFER FROM JAN KOWALSKI LOAN BACK`. Я браў за імя першыя 2 словы. Для заробку ад `SOFTHOUSE SP. Z O.O.` гэта дае `SOFTHOUSE SP.`, без аніякай памылкі. Гэтае правіла я пісаў, не думаючы пра кампаніі.

На C і D парсер не разабраў ніводнага радка, 300 з 300 гучна. Гэтага я і чакаў. Гэта ж звычайны довад на карысць мадэлі.

## Мадэль

Flan-T5 large дала 91 правільную аперацыю з 600. Base дала 107, так што большая мадэль лепшай не была.

<figure class="fig">
<svg viewBox="0 0 640 352" role="img" aria-label="Састаўныя слупкі, 150 аперацый на фармат. Рэгуляркі для A і B, фармат A: правільна 143, гучна 0, ціха 7. Рэгуляркі для A і B, фармат B: правільна 150, гучна 0, ціха 0. Рэгуляркі для A і B, фармат C: правільна 0, гучна 150, ціха 0. Рэгуляркі для A і B, фармат D: правільна 0, гучна 150, ціха 0. Flan-T5 base, фармат A: правільна 1, гучна 64, ціха 85. Flan-T5 base, фармат B: правільна 74, гучна 0, ціха 76. Flan-T5 base, фармат C: правільна 25, гучна 23, ціха 102. Flan-T5 base, фармат D: правільна 7, гучна 1, ціха 142. Flan-T5 large, фармат A: правільна 2, гучна 23, ціха 125. Flan-T5 large, фармат B: правільна 47, гучна 0, ціха 103. Flan-T5 large, фармат C: правільна 15, гучна 9, ціха 126. Flan-T5 large, фармат D: правільна 27, гучна 0, ціха 123.">
  <text x="12" y="18" class="f-label f-muted">аперацыі па фарматах, па 150</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">правільна</text>
  <rect x="105" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="123" y="40" class="f-mono f-ink" style="font-size:11px">памылка, гучна</text>
  <rect x="233" y="31" width="12" height="10" class="f-accent"/>
  <text x="251" y="40" class="f-mono f-ink" style="font-size:11px">памылка, ціха</text>
  <text x="12" y="68" class="f-mono f-accent" style="font-size:12px">рэгуляркі для A і B</text>
  <text x="28" y="86" class="f-mono f-ink" style="font-size:11px">A  знаёмыя</text>
  <rect x="210" y="76" width="286" height="12" class="f-box"/>
  <rect x="496" y="76" width="14" height="12" class="f-accent"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">143/0/7</text>
  <text x="28" y="104" class="f-mono f-ink" style="font-size:11px">B  знаёмыя</text>
  <rect x="210" y="94" width="300" height="12" class="f-box"/>
  <text x="520" y="104" class="f-mono f-ink" style="font-size:11px">150/0/0</text>
  <text x="28" y="122" class="f-mono f-ink" style="font-size:11px">C  новыя</text>
  <rect x="210" y="112" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="122" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="28" y="140" class="f-mono f-ink" style="font-size:11px">D  новыя</text>
  <rect x="210" y="130" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="140" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">Flan-T5 base</text>
  <text x="28" y="184" class="f-mono f-ink" style="font-size:11px">A  знаёмыя</text>
  <rect x="210" y="174" width="2" height="12" class="f-box"/>
  <rect x="212" y="174" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="340" y="174" width="170" height="12" class="f-accent"/>
  <text x="520" y="184" class="f-mono f-ink" style="font-size:11px">1/64/85</text>
  <text x="28" y="202" class="f-mono f-ink" style="font-size:11px">B  знаёмыя</text>
  <rect x="210" y="192" width="148" height="12" class="f-box"/>
  <rect x="358" y="192" width="152" height="12" class="f-accent"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">74/0/76</text>
  <text x="28" y="220" class="f-mono f-ink" style="font-size:11px">C  новыя</text>
  <rect x="210" y="210" width="50" height="12" class="f-box"/>
  <rect x="260" y="210" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="306" y="210" width="204" height="12" class="f-accent"/>
  <text x="520" y="220" class="f-mono f-ink" style="font-size:11px">25/23/102</text>
  <text x="28" y="238" class="f-mono f-ink" style="font-size:11px">D  новыя</text>
  <rect x="210" y="228" width="14" height="12" class="f-box"/>
  <rect x="224" y="228" width="2" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="226" y="228" width="284" height="12" class="f-accent"/>
  <text x="520" y="238" class="f-mono f-ink" style="font-size:11px">7/1/142</text>
  <text x="12" y="264" class="f-mono f-accent" style="font-size:12px">Flan-T5 large</text>
  <text x="28" y="282" class="f-mono f-ink" style="font-size:11px">A  знаёмыя</text>
  <rect x="210" y="272" width="4" height="12" class="f-box"/>
  <rect x="214" y="272" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="260" y="272" width="250" height="12" class="f-accent"/>
  <text x="520" y="282" class="f-mono f-ink" style="font-size:11px">2/23/125</text>
  <text x="28" y="300" class="f-mono f-ink" style="font-size:11px">B  знаёмыя</text>
  <rect x="210" y="290" width="94" height="12" class="f-box"/>
  <rect x="304" y="290" width="206" height="12" class="f-accent"/>
  <text x="520" y="300" class="f-mono f-ink" style="font-size:11px">47/0/103</text>
  <text x="28" y="318" class="f-mono f-ink" style="font-size:11px">C  новыя</text>
  <rect x="210" y="308" width="30" height="12" class="f-box"/>
  <rect x="240" y="308" width="18" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="308" width="252" height="12" class="f-accent"/>
  <text x="520" y="318" class="f-mono f-ink" style="font-size:11px">15/9/126</text>
  <text x="28" y="336" class="f-mono f-ink" style="font-size:11px">D  новыя</text>
  <rect x="210" y="326" width="54" height="12" class="f-box"/>
  <rect x="264" y="326" width="246" height="12" class="f-accent"/>
  <text x="520" y="336" class="f-mono f-ink" style="font-size:11px">27/0/123</text>
</svg>
<figcaption>Правільна па ўсіх 3 палях з 600: рэгуляркі 293, base 107, large 91. Фарматаў C і D рэгуляркі не бачылі.</figcaption>
</figure>

Я чакаў памылак у суме, але першай зламалася дата. Я нейкі час думаў, што зламаны мой разбор дат, пакуль не паглядзеў на сырыя адказы. З радком перыяду ў промпце large у 360 аперацыях з 600 адказала першым днём перыяду. Для плацяжу ад 14 чэрвеня яна давала `01.06.2022`. Тады я прыбраў радок перыяду і спытаў яшчэ раз. Large назвала дату правільна ў 291 аперацыі з 600, base у 567. Часта адказ large гэта не дата з радка: `01.10.2022` замест 10.01.2022, `01/26/2022` у амерыканскім парадку замест 26/01/2022. Часам год быў 2020. 148 з 150 яна набрала толькі ў фармаце B, дзе дата ўжо была запісана як `2022-06-20`. Калі я папрасіў скапіяваць дату дакладна так, як яна напісана, яна зрабіла гэта ў 162 выпадках з 600. 143 з іх прыпалі на B.

На кожны ўваходны пераклад large адказвала "out", акрамя фармату D, дзе ў радку словамі напісана `Incoming transfer`. "in" яна адказала на 33 уваходныя пераводы з 129, усе 33 у D. На радках без мінуса і на радках з `CR` large усё роўна адказвала "out". Я падумаў, што вінаваты парадак варыянтаў у маім пытанні. Таму спытаў яшчэ раз з "in or out" замест "out or in". Large не змяніла ніводнага адказу. Base ад парадку залежала. Калі першым стаяў "out", яна адказвала "out" ва ўсіх 600 аперацыях, а калі першым стаяў "in", адказвала "in" у 583 з 600.

Сума без знака была правільнай у 423 аперацыях з 600. У 114 няправільных мадэль вярнула рэшту, апошні лік у радку. У 22 вярнула суму ў еўра ці доларах з апісання. За контрагента large часта вяртала больш за адно імя, напрыклад `SPOTIFY INTERNET`. 61 раз яна вярнула толькі горад. Калі прымаць любы адказ, у якім ёсць правільнае імя, выходзіць 526 з 600. З такім нястрогім параўнаннем у large было б 160 правільных аперацый замест 91.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Аперацыя 80 фармату A і радок перыяду над ёй. Flan-T5 large адказала датай 01.06.2022, першым днём перыяду, замест 14.06.2022; сумай 18 848,37, гэта значыць рэштай, замест -248,22; кірункам out, гэта правільна; контрагентам GDANSK, гэта значыць горадам, замест Media Expert. На 600 аперацыях: першы дзень перыяду 360 разоў, рэшта 114, горад 61, уваходныя пераводы названы out 96 з 129.">
  <text x="12" y="18" class="f-label f-muted">радок перыяду</text>
  <text x="12" y="36" class="f-mono f-ink" style="font-size:12px">Statement for the period 01.06.2022 - 30.06.2022</text>
  <text x="12" y="62" class="f-label f-muted">аперацыя, фармат A</text>
  <text x="12" y="80" class="f-mono f-ink" style="font-size:12px;white-space:pre" xml:space="preserve">14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37</text>
  <text x="140" y="108" class="f-label f-muted">адказ large</text>
  <text x="290" y="108" class="f-label f-muted">правільна</text>
  <text x="12" y="134" class="f-mono f-muted" style="font-size:12px">дата</text>
  <rect x="134" y="120" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="135" class="f-mono f-accent" style="font-size:12px">01.06.2022</text>
  <text x="290" y="135" class="f-mono f-ink" style="font-size:12px">14.06.2022</text>
  <text x="420" y="129" class="f-mono f-ink" style="font-size:10px">першы дзень перыяду</text>
  <text x="420" y="142" class="f-mono f-muted" style="font-size:10px">360 з 600</text>
  <line x1="12" y1="148" x2="628" y2="148" class="f-plain"/>
  <text x="12" y="168" class="f-mono f-muted" style="font-size:12px">сума</text>
  <rect x="134" y="154" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="169" class="f-mono f-accent" style="font-size:12px">18 848,37</text>
  <text x="290" y="169" class="f-mono f-ink" style="font-size:12px">-248,22</text>
  <text x="420" y="163" class="f-mono f-ink" style="font-size:10px">рэшта пасля аперацыі</text>
  <text x="420" y="176" class="f-mono f-muted" style="font-size:10px">114 з 600</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-plain"/>
  <text x="12" y="202" class="f-mono f-muted" style="font-size:12px">кірунак</text>
  <rect x="134" y="188" width="140" height="22" rx="3" class="f-plain"/>
  <text x="140" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="290" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="420" y="197" class="f-mono f-ink" style="font-size:10px">правільна</text>
  <text x="420" y="210" class="f-mono f-muted" style="font-size:10px">out: 96 з 129 уваходных</text>
  <line x1="12" y1="216" x2="628" y2="216" class="f-plain"/>
  <text x="12" y="236" class="f-mono f-muted" style="font-size:12px">контрагент</text>
  <rect x="134" y="222" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="237" class="f-mono f-accent" style="font-size:12px">GDANSK</text>
  <text x="290" y="237" class="f-mono f-ink" style="font-size:12px">Media Expert</text>
  <text x="420" y="231" class="f-mono f-ink" style="font-size:10px">горад</text>
  <text x="420" y="244" class="f-mono f-muted" style="font-size:10px">61 з 600</text>
</svg>
<figcaption>Адзін радок і 3 няправільныя палі, кожнае з якіх разбіраецца. Справа тая ж памылка, падлічаная на ўсіх 600 аперацыях.</figcaption>
</figure>

Амаль усе гэтыя памылкі ціхія, бо рэшта разбіраецца як сума гэтак жа добра, як сама сума. З 509 няправільных аперацый large гучнымі былі 32.

## Спачатку рэгулярка, мадэль там, дзе рэгулярка не спрацавала

Менавіта такую схему я б і пабудаваў: парсер для знаёмых фарматаў і мадэль толькі для радкоў, якія ён не пазнаў. Яна дала 335 правільных з 600, больш, чым кожны з двух спосабаў паасобку. Але 256 аперацый выйшлі няправільнымі без аніякай памылкі. Акрамя маіх 7 радкоў з заробкам, усе яны прыйшлі з C і D, тых 300 радкоў, на якіх раней была гучная памылка.

<figure class="fig">
<svg viewBox="0 0 640 180" role="img" aria-label="Састаўныя слупкі на 600 аперацый. Рэгуляркі для A і B: правільна 293, памылка, гучна 300, памылка, ціха 7. Flan-T5 large: правільна 91, памылка, гучна 32, памылка, ціха 477. Рэгулярка, потым large: правільна 335, памылка, гучна 9, памылка, ціха 256. Рэгуляркі для ўсіх 4: правільна 582, памылка, гучна 0, памылка, ціха 18.">
  <text x="12" y="18" class="f-label f-muted">600 аперацый, усе 4 фарматы</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">правільна</text>
  <rect x="105" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="123" y="40" class="f-mono f-ink" style="font-size:11px">памылка, гучна</text>
  <rect x="233" y="31" width="12" height="10" class="f-accent"/>
  <text x="251" y="40" class="f-mono f-ink" style="font-size:11px">памылка, ціха</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:11px">рэгуляркі для A і B</text>
  <rect x="190" y="59" width="161" height="14" class="f-box"/>
  <rect x="351" y="59" width="165" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="516" y="59" width="4" height="14" class="f-accent"/>
  <text x="530" y="70" class="f-mono f-ink" style="font-size:11px">293/300/7</text>
  <text x="12" y="100" class="f-mono f-ink" style="font-size:11px">Flan-T5 large</text>
  <rect x="190" y="89" width="50" height="14" class="f-box"/>
  <rect x="240" y="89" width="18" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="89" width="262" height="14" class="f-accent"/>
  <text x="530" y="100" class="f-mono f-ink" style="font-size:11px">91/32/477</text>
  <text x="12" y="130" class="f-mono f-ink" style="font-size:11px">рэгулярка, потым large</text>
  <rect x="190" y="119" width="184" height="14" class="f-box"/>
  <rect x="374" y="119" width="5" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="379" y="119" width="141" height="14" class="f-accent"/>
  <text x="530" y="130" class="f-mono f-ink" style="font-size:11px">335/9/256</text>
  <text x="12" y="160" class="f-mono f-ink" style="font-size:11px">рэгуляркі для ўсіх 4</text>
  <rect x="190" y="149" width="320" height="14" class="f-box"/>
  <rect x="510" y="149" width="10" height="14" class="f-accent"/>
  <text x="530" y="160" class="f-mono f-ink" style="font-size:11px">582/0/18</text>
</svg>
<figcaption>Мадэль на радках, якіх рэгулярка не пазнала, дадае 42 правільныя аперацыі. Яе няправільныя адказы ў C і D не выклікаюць памылкі. Яшчэ 29 радкоў рэгулярак пакідаюць 18 няправільных. Усе яны адна і тая ж памылка з заробкам.</figcaption>
</figure>

Потым я зрабіў тое, што зрабіў бы ў любым выпадку, калі банк мяняе выгрузку: напісаў рэгуляркі для C і D. Гэта яшчэ 29 радкоў. Парсер даў 582 правільныя з 600 і ніводнай гучнай памылкі. 18 няправільных гэта тая ж памылка з заробкам, якую я разам з астатнім кодам перанёс у фармат C. Парсеру трэба каля 6 мікрасекунд на аперацыю. Large трэба ў медыяне 1,2 секунды на пытанне, гэта значыць каля 5 секунд на аперацыю.

## Чаго я не правяраў

Гэта адна маленькая мадэль, якую я магу запусціць сам. Гэта не GPT-3 з API OpenAI і не ChatGPT, у якога API пакуль няма. Нічога большага я не правяраў. Я даваў па адным промпце на поле без прыкладаў і нічога не данавучваў. Прымусіць мадэль выдаць усе палі адразу ў JSON я таксама не спрабаваў. Выпіскі сінтэтычныя, у выглядзе чыстага тэксту, без PDF і OCR.

Пакуль я пакідаю рэгулярку для кожнага банка. Мадэль я б выкарыстаў толькі як падказку разбору для радка, які парсер не ведае. Падказку правярае чалавек, перш чым яна некуды пойдзе.
