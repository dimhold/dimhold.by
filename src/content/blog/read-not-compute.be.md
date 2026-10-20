---
title: "Flan-T5 правільна прачытала 1393 радкі рахункаў з 1413 і правільна падлічыла вынік 1 рахунку з 400"
description: "Я даў Flan-T5 base і large 400 рахункаў і задаў пытанні 6 відаў. Large правільна прачытала 1393 сумы радкоў з 1413 і 388 надрукаваных вынікаў з 400. На пытанні з вылічэннем яна адказала правільна 6 разоў з 1600, а яе няправільныя вынікі выглядалі дакладна як вынікі. Калі яе прасілі разважаць па кроках, яна пісала правільны выраз і няправільную суму. Калі ж мадэль чытае радкі, а складае код, правільных вынікаў 386 з 400."
date: 2022-12-14
lang: be
translationKey: read-not-compute
tags: ["llm", "numbers", "reliability"]
---
Пасля выхаду ChatGPT 2 тыдні таму ў фінтэху я часцей за ўсё чую адну ідэю: хай моўная мадэль правярае дакументы. Бярэм рахунак і глядзім, ці сыходзяцца радкі з вынікам. У мяне было сваё меркаванне пра гэта. Я яго ніколі не правяраў. Я думаў, што цяжкая частка гэта чытанне. Мадэлі трэба знайсці патрэбны лік побач з патрэбнай назвай. Скласці пасля гэтага 4 лікі здавалася простым крокам.

У ChatGPT няма API, таму адправіць яму некалькі тысяч рахункаў я не магу. Замест гэтага я запусціў мадэль на сваёй машыне і вымераў, дзе яна перастае адказваць правільна.

## Стэнд

Мадэль гэта Flan-T5 ад Google, base (250M параметраў) і large (780M), выйшла ў кастрычніку. Працуе на 4 ядрах віртуальнай машыны AMD EPYC: Python 3.9, torch 1.13, transformers 4.25.1, прагнае дэкадаванне. Адно пытанне займае каля 0,4 с на base і 1,5 с на large.

Скрыпт згенераваў 400 рахункаў з seed 2022, так што правільны адказ вядомы для кожнага. Радкоў у кожным ад 2 да 5. У палове рахункаў сумы цэлыя, да 99, напрыклад `PLN 45`. У другой палове сумы з грошамі, да 999,99, напрыклад `PLN 412.35`. Рахунак выглядае так:

```
Invoice No. 55049
Seller: Marek Nowak Consulting
cable ties: PLN 9
paper reams: PLN 68
drill bits: PLN 90
desk lamps: PLN 92
```

Пра адны і тыя ж рахункі я задаў пытанні 6 відаў. Для 2 з іх дастаткова прачытаць: сума аднаго радка і вынік, калі ў рахунку ёсць радок `Total:`. Для 4 трэба палічыць. 2 з іх працуюць з 2 радкамі, гэта сума і розніца. 3-і гэта вынік, калі радка выніку няма. 4-ы гэта колькасць на цану для радка, запісанага як `6 x PLN 73.82`. Кожны промпт складаецца з дакумента і пытання, а за імі ідзе `Answer with the amount only.` Адказ правільны, толькі калі ў ім роўна 1 лік і гэты лік правільны.

## Чытанне

Large правільна прачытала 1393 сумы радкоў з 1413 і 388 надрукаваных вынікаў з 400. Base справілася горш, 1154 радкі і 360 вынікаў. Яна часта не спынялася пасля сумы і выдавала яшчэ і наступныя радкі.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Слупкі для Flan-T5 base і large. Сума радка: base 1154 з 1413, large 1393 з 1413. Надрукаваны вынік: 360 і 388 з 400. Сума 2 радкоў: 0 і 2 з 400. Розніца 2 радкоў: 0 і 3. Колькасць на цану: 0 і 0. Вынік без радка выніку: 0 і 1.">
  <text x="12" y="18" class="f-label f-muted">правільных адказаў з усіх пытанняў кожнага віду</text>
  <rect x="210" y="30" width="12" height="10" class="f-plain"/>
  <text x="228" y="39" class="f-mono f-ink" style="font-size:11px">base</text>
  <rect x="290" y="30" width="12" height="10" class="f-box"/>
  <text x="308" y="39" class="f-mono f-ink" style="font-size:11px">large</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">адказ надрукаваны</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">сума радка</text>
  <rect x="210" y="82" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="77" width="245" height="11" class="f-plain"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">1154/1413</text>
  <rect x="210" y="96" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="91" width="296" height="11" class="f-box"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">1393/1413</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">надрукаваны вынік</text>
  <rect x="210" y="116" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="111" width="270" height="11" class="f-plain"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">360/400</text>
  <rect x="210" y="130" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="125" width="291" height="11" class="f-box"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">388/400</text>
  <text x="12" y="156" class="f-mono f-accent" style="font-size:12px">адказ трэба палічыць</text>
  <text x="24" y="184" class="f-mono f-ink" style="font-size:11px">сума 2 радкоў</text>
  <rect x="210" y="172" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="176" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="186" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="181" width="2" height="11" class="f-box"/>
  <text x="520" y="190" class="f-mono f-ink" style="font-size:11px">2/400</text>
  <text x="24" y="218" class="f-mono f-ink" style="font-size:11px">розніца 2 радкоў</text>
  <rect x="210" y="206" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="210" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="220" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="215" width="2" height="11" class="f-box"/>
  <text x="520" y="224" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="24" y="252" class="f-mono f-ink" style="font-size:11px">колькасць x цана</text>
  <rect x="210" y="240" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="244" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="254" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="258" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <text x="24" y="286" class="f-mono f-ink" style="font-size:11px">вынік без радка выніку</text>
  <rect x="210" y="274" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="278" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="288" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="283" width="2" height="11" class="f-box"/>
  <text x="520" y="292" class="f-mono f-ink" style="font-size:11px">1/400</text>
</svg>
<figcaption>Адны і тыя ж 400 рахункаў. Large правільна адказала на 6 з 1600 пытанняў з вылічэннем, base на 0.</figcaption>
</figure>

Памылкі ў large не выпадковыя. З 20 яе няправільных адказаў пра суму радка ў 19 стаіць адна няправільная сума. У 18 з гэтых 19 гэта сума радка вышэй. 14 з гэтых 19 прыпадаюць на рахункі з 5 радкамі і цэлымі сумамі. Усе 12 няправільных вынікаў ад 1000 і вышэй. Толькі ў такіх вынікаў і ёсць раздзяляльнік тысяч. Замест 2188,24 large вярнула `PLN 1,218.24`, а замест 3005,03 вярнула `PLN 30005.03`. Усе 228 вынікаў да 1000 яна прачытала правільна.

## Вылічэнні

Large правільна адказала на 6 з 1600 пытанняў з вылічэннем. Base ні на адно. Усе 6 прыпалі на рахункі з цэлымі сумамі, так што нават там гэта 6 з 800. У 2 з 6 правільная сума была надрукаваная ў рахунку яшчэ і як іншы радок, 79 і 91. Large вярнула гэты лік. Склала яна ці спісала, я сказаць не магу.

Больш мяне турбавалі няправільныя адказы. На пытанне пра вынік, калі радка выніку няма, large у 201 выпадку з 400 вярнула суму аднаго з радкоў. Яшчэ ў 16 яна вярнула нумар рахунку. У астатніх 182 яна вярнула лік, якога ў рахунку няма. Усе яны выглядаюць дакладна як вынік. Адказ гэта 1 лік з `PLN` наперадзе. Парсер прымае яго без памылкі. З колькасцю на цану было інакш. Large ва ўсіх 400 выпадках паўтарыла радок, `6 x PLN 73.82`. У large гэта адзіны від пытанняў, дзе збой гучны, бо ў адказе 2 лікі.

## Просьба паказаць крокі

Flan-T5 вучылі на прыкладах з разважаннем па кроках, таму сумленная наступная спроба гэта дапісаць да пытанняў пра суму `Let's think step by step.` Тады large распісвае вылічэнне. На рахунку вышэй яна адказала:

```
The total amount of all items is PLN 9 + 68 + 90 + 92 = PLN 340. The answer: 340.
```

Правільны вынік 259. Тут кожны лік злева ад `=` правільны, а памылка толькі ў складанні.

<figure class="fig">
<svg viewBox="0 0 640 254" role="img" aria-label="У рахунку радкі 9, 68, 90 і 92. Large піша 9 + 68 + 90 + 92 = 340. Python лічыць той жа выраз і атрымлівае 259, гэта правільны вынік. На 400 пытаннях пра суму па кроках: выраз запісаны ў 398 выпадках, канчатковы адказ large правільны ў 3, выраз, палічаны ў Python, правільны ў 223.">
  <text x="12" y="18" class="f-label f-muted">рахунак</text>
  <text x="12" y="38" class="f-mono f-ink" style="font-size:12px">cable ties: PLN 9</text>
  <text x="12" y="54" class="f-mono f-ink" style="font-size:12px">paper reams: PLN 68</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:12px">drill bits: PLN 90</text>
  <text x="12" y="86" class="f-mono f-ink" style="font-size:12px">desk lamps: PLN 92</text>
  <path d="M190 60 L232 60" class="f-line" marker-end="url(#a519)"/>
  <defs><marker id="a519" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="f-muted"/></marker></defs>
  <text x="244" y="18" class="f-label f-muted">large піша</text>
  <rect x="244" y="44" width="24" height="26" rx="3" class="f-box"/>
  <text x="256" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">9</text>
  <text x="284" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="300" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="317" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">68</text>
  <text x="350" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="366" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="383" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">90</text>
  <text x="416" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="432" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="449" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">92</text>
  <text x="482" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">=</text>
  <rect x="498" y="44" width="48" height="26" rx="3" class="f-accent"/>
  <text x="522" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">340</text>
  <text x="522" y="88" class="f-label f-muted" text-anchor="middle">адказ large</text>
  <text x="244" y="118" class="f-label f-muted">той жа выраз лічыць Python</text>
  <text x="244" y="140" class="f-mono f-ink" style="font-size:13px">9 + 68 + 90 + 92 = 259</text>
  <text x="440" y="140" class="f-label f-muted">правільна</text>
  <line x1="12" y1="162" x2="628" y2="162" class="f-plain"/>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">выраз запісаны</text>
  <rect x="360" y="178" width="200" height="12" class="f-plain"/>
  <rect x="360" y="178" width="199" height="12" class="f-box"/>
  <text x="570" y="188" class="f-mono f-ink" style="font-size:11px">398/400</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">уласны адказ правільны</text>
  <rect x="360" y="202" width="200" height="12" class="f-plain"/>
  <rect x="360" y="202" width="2" height="12" class="f-accent"/>
  <text x="570" y="212" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">выраз правільны, калі яго палічыць Python</text>
  <rect x="360" y="226" width="200" height="12" class="f-plain"/>
  <rect x="360" y="226" width="112" height="12" class="f-box"/>
  <text x="570" y="236" class="f-mono f-ink" style="font-size:11px">223/400</text>
</svg>
<figcaption>Па кроках на першых 200 рахунках, 400 пытанняў пра суму, толькі Flan-T5 large.</figcaption>
</figure>

Я прагнаў гэта толькі на першых 200 рахунках, гэта 400 пытанняў пра суму, бо 1 адказ займае каля 8 секунд. Large запісала выраз у 398 з іх. Яе ўласны канчатковы адказ быў правільны ў 3. Потым я палічыў запісаны ёю выраз у Python. Правільнымі аказаліся 223 з 400. На хвіліну я падумаў, што гэта і ёсць рашэнне, але пытанні пра вынік рахунку ўсё сапсавалі. У пытаннях пра вынік без радка выніку выраз утрымліваў усе радкі рахунку толькі ў 89 выпадках з 198. Пры 2 радках гэта 51 з 55, пры 5 радках 8 з 43. У 99 з астатніх 109 мадэль выкінула частку радкоў з сумы. У апошніх 10 яна няправільна прачытала або паўтарыла суму.

## Чытае мадэль, складае код

Таму я падзяліў працу па гэтай мяжы. Мадэль чытае суму кожнага радка, па адным пытанні на радок, а Python іх складае. Тады large дала 386 правільных вынікаў з 400 супраць 1 з 400, калі яе пыталі пра вынік наўпрост. У кожным з 13 няправільных вынікаў ёсць няправільна прачытаны радок. У 1 рахунку радок вярнуўся з 2 лікамі, таму код адмовіўся яго складаць.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Прамое пытанне пра вынік 400 рахункаў. Base: правільных 0, ціхіх няправільных 355, гучных 45. Large: правільных 1, ціхіх няправільных 399, гучных 0. Мадэль чытае кожны радок, код складае: base: правільных 211, ціхіх няправільных 18, гучных 171. Large: правільных 386, ціхіх няправільных 13, гучных 1.">
  <text x="12" y="18" class="f-label f-muted">вынік 400 рахункаў 2 спосабамі</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">правільна</text>
  <rect x="182" y="30" width="12" height="10" class="f-accent"/>
  <text x="200" y="39" class="f-mono f-ink" style="font-size:11px">няправільна, ціха</text>
  <rect x="352" y="30" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="39" class="f-mono f-ink" style="font-size:11px">гучна, код адмаўляецца</text>
  <text x="12" y="64" class="f-mono f-accent" style="font-size:12px">спытаць у мадэлі вынік</text>
  <text x="24" y="86" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="76" width="266" height="12" class="f-accent"/>
  <rect x="496" y="76" width="34" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="86" class="f-mono f-ink" style="font-size:11px">0/355/45</text>
  <text x="24" y="108" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="98" width="1" height="12" class="f-box"/>
  <rect x="231" y="98" width="299" height="12" class="f-accent"/>
  <text x="540" y="108" class="f-mono f-ink" style="font-size:11px">1/399/0</text>
  <text x="12" y="136" class="f-mono f-accent" style="font-size:12px">мадэль чытае радкі, код складае</text>
  <text x="24" y="158" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="148" width="158" height="12" class="f-box"/>
  <rect x="388" y="148" width="14" height="12" class="f-accent"/>
  <rect x="402" y="148" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="158" class="f-mono f-ink" style="font-size:11px">211/18/171</text>
  <text x="24" y="180" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="170" width="290" height="12" class="f-box"/>
  <rect x="520" y="170" width="10" height="12" class="f-accent"/>
  <rect x="530" y="170" width="1" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="180" class="f-mono f-ink" style="font-size:11px">386/13/1</text>
</svg>
<figcaption>Гучна значыць, што ў адказе больш за 1 лік і код бачыць, што нешта не так. У другім спосабе для гэтага хапае 1 радка.</figcaption>
</figure>

Пры такім падзеле base дала 211 правільных вынікаў і 18 няправільных. У астатніх 171 нейкі радок вярнуўся ў выглядзе `PLN 9 paper reams 68`. Код такі радок скласці не можа. Калі base пыталі пра вынік наўпрост, яна так гучна памылілася 45 разоў, а ў астатніх 355 ціха.

Ідэя не мая. Артыкул мінулага месяца, PAL ад Gao з суаўтарамі, робіць тое ж самае ў агульным выглядзе. Мадэль піша праграму, а інтэрпрэтатар яе выконвае. Мадэлі, пабудаваныя для `FinQA` і `TAT-QA`, 2 набораў 2021 года з такімі пытаннямі па фінансавых справаздачах, таксама аддаюць вылічэнне коду.

## Дзе б я правёў мяжу

Для мяне мяжа цяпер ясней. Калі лік, які вярнула мадэль, надрукаваны ў дакуменце, я магу хаця б праверыць, што ён там ёсць. Памылку з радком вышэй такая праверка не зловіць, але гэта хоць нешта. Калі лік трэба палічыць, Flan-T5 на гэтых рахунках амаль ніколі не лічыць яго правільна. Яна вяртае нешта правільнай формы. Праверка, што адказу няма сярод лікаў дакумента, злавіла б 217 з 399 няправільных вынікаў large. Астатнія 182 прайшлі б.

Правіла для памылак чытання ў мяне дагэтуль няма: радок вышэй у доўгіх рахунках і вынікі ад 1000. Здараюцца яны рэдка, а парсер прымае іх як любы правільны адказ.

## Чаго я не правяраў

- Большыя мадэлі. `text-davinci-003` ад OpenAI даступная праз API каля 2 тыдняў. Для гэтага прагону мне была патрэбная мадэль на сваёй машыне, таму davinci я не спрабаваў. Большыя мадэлі, магчыма, складуць 4 лікі правільна.
- Сапраўдныя рахункі. Гэтыя сінтэтычныя, на англійскай, па адным радку на пазіцыю. У іх няма сканаў і памылак OCR.
- Іншыя промпты. Я выкарыстаў 1 фармулёўку на пытанне і прагнае дэкадаванне. Прыклады ў промпце маглі б змяніць гэтыя лічбы, асабліва ў base.
