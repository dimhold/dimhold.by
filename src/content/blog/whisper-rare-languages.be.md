---
title: "Whisper не прыняў ніводнага беларускага сказа за беларускі, а грузінскую запісаў чужымі алфавітамі"
description: "Whisper на каміце ад 25 верасня на адных і тых жа 100 сказах FLEURS на 7 мовах, ад англійскай да грузінскай. У аўтаматычным рэжыме ніводная з 3 меншых мадэляў не прыняла за беларускі ніводны беларускі сказ. З пазначанай мовай base усё роўна піша рускім правапісам і ніводнага разу не піша ў, у small 78,1% няправільных слоў. Грузінскую мадэлі ў асноўным пазнаюць, але ніводная не напісала ніводнай грузінскай літары: замест іх лацінка, армянскія знакі або кітайская. Руская і польская ў small трымаюцца, украінская таксама, калі пазначыць мову."
date: 2022-10-02
lang: be
translationKey: whisper-rare-languages
tags: ["machine-learning", "text"]
---
Гэты блог выходзіць па-англійску, па-руску і па-беларуску, таму калі 21 верасня выйшаў Whisper, найперш я шукаў у яго спісе з 99 моў беларускую. Яна там ёсць, грузінская таксама. Потым я адкрыў малюнак 11 артыкула, дзе для кожнай мовы пазначаны гадзіны навучальнага гуку. З 680 000 гадзін на размечаную беларускую прыпадае 2,4 гадзіны, а на рускую 9761. У грузінскай 0,6, гэта амаль самы ніз малюнка. Ёсць яшчэ 133 гадзіны беларускага маўлення, якое мадэль вучылася перакладаць на англійскую, але пісаць беларускі тэкст яна вучылася на 2,4. Мне хацелася паглядзець, што гэтыя гадзіны даюць у самім вывадзе, а не толькі ў долі няправільных слоў.

## Тэст

Google у траўні выклаў FLEURS. Гэта адзін набор сказаў, прачытаных уголас на 102 мовах, так што змест аднолькавы і мяняецца толькі мова. Я ўзяў 7 моў, ад англійскай з 438 218 гадзінамі да грузінскай з 0,6. У тэставай частцы ўсіх 7 ёсць 307 агульных сказаў. Я выбраў з іх 100 з фіксаваным зернем генератара, так што кожная мова чытае адны і тыя ж 100.

Whisper я ўзяў на каміце `5d8d3e7` ад 25 верасня, запускаў на PyTorch 1.12.1 і выклікаў з Python праз `transcribe()`. Усё працавала на віртуальнай машыне з 4 ядрамі AMD EPYC 7713, без GPU. Тэкст праходзіць праз нармалізатары, якія ідуць разам з Whisper для яго ўласных ацэнак. tiny прайшоў усе 100 сказаў. base і small павольнейшыя, small траціць тут 218 секунд на хвіліну англійскага гуку. Ім дасталіся толькі першыя 50 і першыя 30.

Першы прагон ішоў з наладамі `transcribe()` па змаўчанні, а што яны робяць, я перад запускам не прачытаў. Калі вынік выглядае дрэнна, `transcribe()` дэкадуе тое ж акно ў 30 секунд яшчэ раз з большай выпадковасцю, да 6 спроб. На першыя 2 літоўскія сказы tiny патраціў 40 і 89 секунд, а для base і small гэта азначала дні. Я спыніў прагон і перайшоў на простае прагнае дэкадаванне. Да таго часу tiny з наладамі па змаўчанні прайшоў 400 сказаў на першых 4 мовах, гэтага хапіла для параўнання. З паўторамі англійская выйшла горш, 22,4% няправільных слоў супраць 17,0% і амаль уся розніца прыпадае на 1 сказ. Пры прагным дэкадаванні мадэль недачула апошнія словы і скончыла за 5 секунд. Паўторы патрацілі 22 секунды і скончылі той жа сказ так: `Week 2-2-3-3-3-4-6-5-6-6`, а далей лічылі яшчэ 200 знакаў.

У артыкуле не сказана, якім дэкадаваннем атрымана табліца па ўсіх мовах. Але англійскі слупок у ёй такі ж, як у табліцы з пазнакай "прамянёвы пошук". Мае лічбы з прагным дэкадаваннем амаль усюды вышэйшыя. Для англійскай у артыкуле ёсць і лічбы прагнага дэкадавання, там у tiny 13,7% супраць маіх 17,0% на 100 сказах. Да ўкраінскай парадак моў такі ж, як у артыкуле. На малюнку першыя 30 сказаў, тыя, што прайшлі ўсе 3 мадэлі.

<figure class="fig">
<svg viewBox="0 0 640 408" role="img" aria-label="Гарызантальныя слупкі долі няправільных слоў у Whisper tiny, base і small на адных і тых жа 30 сказах FLEURS на 7 мовах, па змяншэнні гадзін размечанага гуку ў навучанні. англійская, 438 218 гадз.: tiny 16,9%, base 12,6%, small 8,7%. руская, 9761 гадз.: tiny 42,3%, base 30,1%, small 15,7%. польская, 4278 гадз.: tiny 56,8%, base 32,0%, small 17,6%. украінская, 697 гадз.: tiny 62,3%, base 46,8%, small 21,3%. літоўская, 67 гадз.: tiny 101,3%, base 94,0%, small 71,5%. беларуская, 2,4 гадз.: tiny 137,2%, base 95,6%, small 78,1%. грузінская, 0,6 гадз.: tiny 175,7%, base 191,9%, small 113,3%. Слупкі абрэзаныя на 120%.">
<text x="12" y="18" class="f-label f-muted">Няправільныя словы, %, адны і тыя ж 30 сказаў на кожнай мове</text>
<text x="12" y="34" class="f-label f-muted">пасля назвы гадзіны размечанага гуку ў навучанні</text>
<rect x="200" y="40" width="10" height="9" class="f-muted"/>
<text x="216" y="48" class="f-label f-ink">tiny</text>
<rect x="290" y="40" width="10" height="9" class="f-ink"/>
<text x="306" y="48" class="f-label f-ink">base</text>
<rect x="380" y="40" width="10" height="9" class="f-accent"/>
<text x="396" y="48" class="f-label f-ink">small</text>
<line x1="483.33333333333337" y1="52" x2="483.33333333333337" y2="370" class="f-line"/>
<text x="483.33333333333337" y="384" class="f-label f-muted" text-anchor="middle">100%</text>
<text x="12" y="74" class="f-label f-ink">англійская</text>
<text x="12" y="87" class="f-label f-muted">438 218 гадз.</text>
<rect x="200" y="56" width="47.9" height="9" class="f-muted"/>
<text x="253.9" y="64" class="f-label f-ink">16,9%</text>
<rect x="200" y="68" width="35.7" height="9" class="f-ink"/>
<text x="241.7" y="76" class="f-label f-ink">12,6%</text>
<rect x="200" y="80" width="24.6" height="9" class="f-accent"/>
<text x="230.7" y="88" class="f-label f-ink">8,7%</text>
<text x="12" y="120" class="f-label f-ink">руская</text>
<text x="12" y="133" class="f-label f-muted">9761 гадз.</text>
<rect x="200" y="102" width="119.8" height="9" class="f-muted"/>
<text x="325.9" y="110" class="f-label f-ink">42,3%</text>
<rect x="200" y="114" width="85.3" height="9" class="f-ink"/>
<text x="291.3" y="122" class="f-label f-ink">30,1%</text>
<rect x="200" y="126" width="44.5" height="9" class="f-accent"/>
<text x="250.5" y="134" class="f-label f-ink">15,7%</text>
<text x="12" y="166" class="f-label f-ink">польская</text>
<text x="12" y="179" class="f-label f-muted">4278 гадз.</text>
<rect x="200" y="148" width="160.9" height="9" class="f-muted"/>
<text x="366.9" y="156" class="f-label f-ink">56,8%</text>
<rect x="200" y="160" width="90.7" height="9" class="f-ink"/>
<text x="296.7" y="168" class="f-label f-ink">32,0%</text>
<rect x="200" y="172" width="49.9" height="9" class="f-accent"/>
<text x="255.9" y="180" class="f-label f-ink">17,6%</text>
<text x="12" y="212" class="f-label f-ink">украінская</text>
<text x="12" y="225" class="f-label f-muted">697 гадз.</text>
<rect x="200" y="194" width="176.5" height="9" class="f-muted"/>
<text x="382.5" y="202" class="f-label f-ink">62,3%</text>
<rect x="200" y="206" width="132.6" height="9" class="f-ink"/>
<text x="338.6" y="214" class="f-label f-ink">46,8%</text>
<rect x="200" y="218" width="60.4" height="9" class="f-accent"/>
<text x="266.4" y="226" class="f-label f-ink">21,3%</text>
<text x="12" y="258" class="f-label f-ink">літоўская</text>
<text x="12" y="271" class="f-label f-muted">67 гадз.</text>
<rect x="200" y="240" width="287.0" height="9" class="f-muted"/>
<text x="493.0" y="248" class="f-label f-ink">101,3%</text>
<rect x="200" y="252" width="266.3" height="9" class="f-ink"/>
<text x="472.3" y="260" class="f-label f-ink">94,0%</text>
<rect x="200" y="264" width="202.6" height="9" class="f-accent"/>
<text x="408.6" y="272" class="f-label f-ink">71,5%</text>
<text x="12" y="304" class="f-label f-ink">беларуская</text>
<text x="12" y="317" class="f-label f-muted">2,4 гадз.</text>
<rect x="200" y="286" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="294" class="f-label f-ink">&gt; 137,2%</text>
<rect x="200" y="298" width="270.9" height="9" class="f-ink"/>
<text x="476.9" y="306" class="f-label f-ink">95,6%</text>
<rect x="200" y="310" width="221.3" height="9" class="f-accent"/>
<text x="427.3" y="318" class="f-label f-ink">78,1%</text>
<text x="12" y="350" class="f-label f-ink">грузінская</text>
<text x="12" y="363" class="f-label f-muted">0,6 гадз.</text>
<rect x="200" y="332" width="340.0" height="9" class="f-muted"/>
<text x="546.0" y="340" class="f-label f-ink">&gt; 175,7%</text>
<rect x="200" y="344" width="340.0" height="9" class="f-ink"/>
<text x="546.0" y="352" class="f-label f-ink">&gt; 191,9%</text>
<rect x="200" y="356" width="321.0" height="9" class="f-accent"/>
<text x="527.0" y="364" class="f-label f-ink">113,3%</text>
</svg>
<figcaption>Да ўкраінскай кожная большая мадэль дапамагае. Ніжэй за 100 гадзін у tiny і base 94% і горш, у small 71,5% і 78,1%, а грузінская ва ўсіх трох вышэй за 100% праз цыклы.</figcaption>
</figure>

## Дзе трымаецца

На гэтых 30 сказах у small 15,7% няправільных слоў па-руску і 17,6% па-польску. Памылка па знаках па-руску 4,7%, так што большасць няправільных слоў блізкая да правільных.

Украінская ў small трымаецца. Меншым мадэлям мову важна пазначыць. У аўтаматычным рэжыме tiny прыняў за рускую 21 украінскі сказ са 100, а base 9 з 50. Тады мадэль проста піша па-руску: `Начальник полиции` там, дзе дыктар сказаў "Начальник поліції". З `language="uk"` у tiny 59,7% няправільных слоў, без яго 72,1%. README раіць пазначаць мову для неанглійскага маўлення і для ўкраінскай так і варта рабіць.

## Беларуская

Перад прагонам я запісаў, што больш за 30% беларускіх сказаў будуць прыняты за рускія. Я не чакаў, што ніводная з 3 мадэляў не прыме за беларускі ніводнага. Найбольшая верагоднасць, якую Whisper хоць раз даў беларускай, была 7,7%, у base. tiny і base выбіралі рускую або ўкраінскую прыкладна 2 да 1, а small кожны раз выбіраў рускую.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Палосы клетак, па адной на беларускі сказ FLEURS, колер па мове, якую вызначыў Whisper. tiny, сказаў 100: руская 66, украінская 32, польская 2. Найбольшая верагоднасць беларускай 3,6%. base, сказаў 50: руская 32, украінская 16, польская 2. Найбольшая верагоднасць беларускай 7,7%. small, сказаў 30: руская 30. Найбольшая верагоднасць беларускай 4,1%.">
<text x="12" y="18" class="f-label f-muted">Якую мову Whisper выбраў для беларускіх сказаў, клетка на сказ</text>
<rect x="12" y="30" width="10" height="10" class="f-ink"/>
<text x="28" y="39" class="f-label f-ink">руская</text>
<rect x="142" y="30" width="10" height="10" class="f-muted"/>
<text x="158" y="39" class="f-label f-ink">украінская</text>
<rect x="272" y="30" width="10" height="10" class="f-box"/>
<text x="288" y="39" class="f-label f-ink">польская</text>
<rect x="402" y="30" width="10" height="10" class="f-accent"/>
<text x="418" y="39" class="f-label f-ink">беларуская</text>
<text x="12" y="72" class="f-label f-ink">tiny</text>
<rect x="60" y="62" width="9" height="12" class="f-ink"/>
<rect x="71" y="62" width="9" height="12" class="f-ink"/>
<rect x="82" y="62" width="9" height="12" class="f-ink"/>
<rect x="93" y="62" width="9" height="12" class="f-ink"/>
<rect x="104" y="62" width="9" height="12" class="f-ink"/>
<rect x="115" y="62" width="9" height="12" class="f-muted"/>
<rect x="126" y="62" width="9" height="12" class="f-muted"/>
<rect x="137" y="62" width="9" height="12" class="f-muted"/>
<rect x="148" y="62" width="9" height="12" class="f-ink"/>
<rect x="159" y="62" width="9" height="12" class="f-ink"/>
<rect x="170" y="62" width="9" height="12" class="f-muted"/>
<rect x="181" y="62" width="9" height="12" class="f-ink"/>
<rect x="192" y="62" width="9" height="12" class="f-ink"/>
<rect x="203" y="62" width="9" height="12" class="f-ink"/>
<rect x="214" y="62" width="9" height="12" class="f-ink"/>
<rect x="225" y="62" width="9" height="12" class="f-ink"/>
<rect x="236" y="62" width="9" height="12" class="f-box"/>
<rect x="247" y="62" width="9" height="12" class="f-muted"/>
<rect x="258" y="62" width="9" height="12" class="f-muted"/>
<rect x="269" y="62" width="9" height="12" class="f-ink"/>
<rect x="280" y="62" width="9" height="12" class="f-ink"/>
<rect x="291" y="62" width="9" height="12" class="f-muted"/>
<rect x="302" y="62" width="9" height="12" class="f-muted"/>
<rect x="313" y="62" width="9" height="12" class="f-ink"/>
<rect x="324" y="62" width="9" height="12" class="f-ink"/>
<rect x="335" y="62" width="9" height="12" class="f-muted"/>
<rect x="346" y="62" width="9" height="12" class="f-ink"/>
<rect x="357" y="62" width="9" height="12" class="f-ink"/>
<rect x="368" y="62" width="9" height="12" class="f-muted"/>
<rect x="379" y="62" width="9" height="12" class="f-ink"/>
<rect x="390" y="62" width="9" height="12" class="f-ink"/>
<rect x="401" y="62" width="9" height="12" class="f-ink"/>
<rect x="412" y="62" width="9" height="12" class="f-muted"/>
<rect x="423" y="62" width="9" height="12" class="f-muted"/>
<rect x="434" y="62" width="9" height="12" class="f-ink"/>
<rect x="445" y="62" width="9" height="12" class="f-ink"/>
<rect x="456" y="62" width="9" height="12" class="f-ink"/>
<rect x="467" y="62" width="9" height="12" class="f-ink"/>
<rect x="478" y="62" width="9" height="12" class="f-muted"/>
<rect x="489" y="62" width="9" height="12" class="f-ink"/>
<rect x="500" y="62" width="9" height="12" class="f-ink"/>
<rect x="511" y="62" width="9" height="12" class="f-ink"/>
<rect x="522" y="62" width="9" height="12" class="f-ink"/>
<rect x="533" y="62" width="9" height="12" class="f-ink"/>
<rect x="544" y="62" width="9" height="12" class="f-ink"/>
<rect x="555" y="62" width="9" height="12" class="f-ink"/>
<rect x="566" y="62" width="9" height="12" class="f-ink"/>
<rect x="577" y="62" width="9" height="12" class="f-ink"/>
<rect x="588" y="62" width="9" height="12" class="f-muted"/>
<rect x="599" y="62" width="9" height="12" class="f-muted"/>
<rect x="60" y="76" width="9" height="12" class="f-ink"/>
<rect x="71" y="76" width="9" height="12" class="f-ink"/>
<rect x="82" y="76" width="9" height="12" class="f-ink"/>
<rect x="93" y="76" width="9" height="12" class="f-muted"/>
<rect x="104" y="76" width="9" height="12" class="f-ink"/>
<rect x="115" y="76" width="9" height="12" class="f-ink"/>
<rect x="126" y="76" width="9" height="12" class="f-ink"/>
<rect x="137" y="76" width="9" height="12" class="f-ink"/>
<rect x="148" y="76" width="9" height="12" class="f-muted"/>
<rect x="159" y="76" width="9" height="12" class="f-muted"/>
<rect x="170" y="76" width="9" height="12" class="f-ink"/>
<rect x="181" y="76" width="9" height="12" class="f-ink"/>
<rect x="192" y="76" width="9" height="12" class="f-ink"/>
<rect x="203" y="76" width="9" height="12" class="f-muted"/>
<rect x="214" y="76" width="9" height="12" class="f-ink"/>
<rect x="225" y="76" width="9" height="12" class="f-ink"/>
<rect x="236" y="76" width="9" height="12" class="f-muted"/>
<rect x="247" y="76" width="9" height="12" class="f-ink"/>
<rect x="258" y="76" width="9" height="12" class="f-muted"/>
<rect x="269" y="76" width="9" height="12" class="f-muted"/>
<rect x="280" y="76" width="9" height="12" class="f-ink"/>
<rect x="291" y="76" width="9" height="12" class="f-ink"/>
<rect x="302" y="76" width="9" height="12" class="f-ink"/>
<rect x="313" y="76" width="9" height="12" class="f-muted"/>
<rect x="324" y="76" width="9" height="12" class="f-muted"/>
<rect x="335" y="76" width="9" height="12" class="f-ink"/>
<rect x="346" y="76" width="9" height="12" class="f-ink"/>
<rect x="357" y="76" width="9" height="12" class="f-ink"/>
<rect x="368" y="76" width="9" height="12" class="f-muted"/>
<rect x="379" y="76" width="9" height="12" class="f-ink"/>
<rect x="390" y="76" width="9" height="12" class="f-ink"/>
<rect x="401" y="76" width="9" height="12" class="f-ink"/>
<rect x="412" y="76" width="9" height="12" class="f-ink"/>
<rect x="423" y="76" width="9" height="12" class="f-ink"/>
<rect x="434" y="76" width="9" height="12" class="f-box"/>
<rect x="445" y="76" width="9" height="12" class="f-ink"/>
<rect x="456" y="76" width="9" height="12" class="f-ink"/>
<rect x="467" y="76" width="9" height="12" class="f-muted"/>
<rect x="478" y="76" width="9" height="12" class="f-ink"/>
<rect x="489" y="76" width="9" height="12" class="f-muted"/>
<rect x="500" y="76" width="9" height="12" class="f-ink"/>
<rect x="511" y="76" width="9" height="12" class="f-ink"/>
<rect x="522" y="76" width="9" height="12" class="f-muted"/>
<rect x="533" y="76" width="9" height="12" class="f-ink"/>
<rect x="544" y="76" width="9" height="12" class="f-muted"/>
<rect x="555" y="76" width="9" height="12" class="f-muted"/>
<rect x="566" y="76" width="9" height="12" class="f-muted"/>
<rect x="577" y="76" width="9" height="12" class="f-muted"/>
<rect x="588" y="76" width="9" height="12" class="f-ink"/>
<rect x="599" y="76" width="9" height="12" class="f-ink"/>
<text x="60" y="100" class="f-label f-muted">максімум для беларускай: 3,6%</text>
<text x="12" y="130" class="f-label f-ink">base</text>
<rect x="60" y="120" width="9" height="12" class="f-ink"/>
<rect x="71" y="120" width="9" height="12" class="f-ink"/>
<rect x="82" y="120" width="9" height="12" class="f-ink"/>
<rect x="93" y="120" width="9" height="12" class="f-ink"/>
<rect x="104" y="120" width="9" height="12" class="f-muted"/>
<rect x="115" y="120" width="9" height="12" class="f-ink"/>
<rect x="126" y="120" width="9" height="12" class="f-ink"/>
<rect x="137" y="120" width="9" height="12" class="f-box"/>
<rect x="148" y="120" width="9" height="12" class="f-muted"/>
<rect x="159" y="120" width="9" height="12" class="f-muted"/>
<rect x="170" y="120" width="9" height="12" class="f-ink"/>
<rect x="181" y="120" width="9" height="12" class="f-ink"/>
<rect x="192" y="120" width="9" height="12" class="f-ink"/>
<rect x="203" y="120" width="9" height="12" class="f-ink"/>
<rect x="214" y="120" width="9" height="12" class="f-muted"/>
<rect x="225" y="120" width="9" height="12" class="f-ink"/>
<rect x="236" y="120" width="9" height="12" class="f-box"/>
<rect x="247" y="120" width="9" height="12" class="f-muted"/>
<rect x="258" y="120" width="9" height="12" class="f-ink"/>
<rect x="269" y="120" width="9" height="12" class="f-ink"/>
<rect x="280" y="120" width="9" height="12" class="f-ink"/>
<rect x="291" y="120" width="9" height="12" class="f-muted"/>
<rect x="302" y="120" width="9" height="12" class="f-ink"/>
<rect x="313" y="120" width="9" height="12" class="f-ink"/>
<rect x="324" y="120" width="9" height="12" class="f-ink"/>
<rect x="335" y="120" width="9" height="12" class="f-muted"/>
<rect x="346" y="120" width="9" height="12" class="f-ink"/>
<rect x="357" y="120" width="9" height="12" class="f-muted"/>
<rect x="368" y="120" width="9" height="12" class="f-muted"/>
<rect x="379" y="120" width="9" height="12" class="f-ink"/>
<rect x="390" y="120" width="9" height="12" class="f-ink"/>
<rect x="401" y="120" width="9" height="12" class="f-ink"/>
<rect x="412" y="120" width="9" height="12" class="f-ink"/>
<rect x="423" y="120" width="9" height="12" class="f-ink"/>
<rect x="434" y="120" width="9" height="12" class="f-muted"/>
<rect x="445" y="120" width="9" height="12" class="f-ink"/>
<rect x="456" y="120" width="9" height="12" class="f-ink"/>
<rect x="467" y="120" width="9" height="12" class="f-ink"/>
<rect x="478" y="120" width="9" height="12" class="f-ink"/>
<rect x="489" y="120" width="9" height="12" class="f-ink"/>
<rect x="500" y="120" width="9" height="12" class="f-muted"/>
<rect x="511" y="120" width="9" height="12" class="f-muted"/>
<rect x="522" y="120" width="9" height="12" class="f-muted"/>
<rect x="533" y="120" width="9" height="12" class="f-ink"/>
<rect x="544" y="120" width="9" height="12" class="f-muted"/>
<rect x="555" y="120" width="9" height="12" class="f-ink"/>
<rect x="566" y="120" width="9" height="12" class="f-ink"/>
<rect x="577" y="120" width="9" height="12" class="f-ink"/>
<rect x="588" y="120" width="9" height="12" class="f-muted"/>
<rect x="599" y="120" width="9" height="12" class="f-muted"/>
<text x="60" y="144" class="f-label f-muted">максімум для беларускай: 7,7%</text>
<text x="12" y="174" class="f-label f-ink">small</text>
<rect x="60" y="164" width="9" height="12" class="f-ink"/>
<rect x="71" y="164" width="9" height="12" class="f-ink"/>
<rect x="82" y="164" width="9" height="12" class="f-ink"/>
<rect x="93" y="164" width="9" height="12" class="f-ink"/>
<rect x="104" y="164" width="9" height="12" class="f-ink"/>
<rect x="115" y="164" width="9" height="12" class="f-ink"/>
<rect x="126" y="164" width="9" height="12" class="f-ink"/>
<rect x="137" y="164" width="9" height="12" class="f-ink"/>
<rect x="148" y="164" width="9" height="12" class="f-ink"/>
<rect x="159" y="164" width="9" height="12" class="f-ink"/>
<rect x="170" y="164" width="9" height="12" class="f-ink"/>
<rect x="181" y="164" width="9" height="12" class="f-ink"/>
<rect x="192" y="164" width="9" height="12" class="f-ink"/>
<rect x="203" y="164" width="9" height="12" class="f-ink"/>
<rect x="214" y="164" width="9" height="12" class="f-ink"/>
<rect x="225" y="164" width="9" height="12" class="f-ink"/>
<rect x="236" y="164" width="9" height="12" class="f-ink"/>
<rect x="247" y="164" width="9" height="12" class="f-ink"/>
<rect x="258" y="164" width="9" height="12" class="f-ink"/>
<rect x="269" y="164" width="9" height="12" class="f-ink"/>
<rect x="280" y="164" width="9" height="12" class="f-ink"/>
<rect x="291" y="164" width="9" height="12" class="f-ink"/>
<rect x="302" y="164" width="9" height="12" class="f-ink"/>
<rect x="313" y="164" width="9" height="12" class="f-ink"/>
<rect x="324" y="164" width="9" height="12" class="f-ink"/>
<rect x="335" y="164" width="9" height="12" class="f-ink"/>
<rect x="346" y="164" width="9" height="12" class="f-ink"/>
<rect x="357" y="164" width="9" height="12" class="f-ink"/>
<rect x="368" y="164" width="9" height="12" class="f-ink"/>
<rect x="379" y="164" width="9" height="12" class="f-ink"/>
<text x="60" y="188" class="f-label f-muted">максімум для беларускай: 4,1%</text>
</svg>
<figcaption>Ніводзін беларускі сказ не вызначаны як беларускі.</figcaption>
</figure>

Тады я пазначыў `language="be"`. З пазначанай мовай 2 меншыя мадэлі мяняюць асобныя словы, але пакідаюць рускі правапіс. У вывадзе base у 49 сказах з 50 ёсць и, щ або ъ, літары, якіх у беларускай няма. Такая літара ёсць у 36% усіх слоў. Літара ў ёсць у 44 эталонных сказах з 50, а base не напісаў яе ніводнага разу.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Адзін сказ 3 разы. Беларускі эталон: У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў. Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць элементаў. Whisper base з зададзенай беларускай мовай: Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на увазе, что пераядычная таблица замещая великую колькость элементу. Whisper base у аўтаматычным рэжыме, які выбраў рускую: В большей стивыпадках с плавы это сумесь двух тенекальки металлов. Матя на увазе, что пероядочная таблица замещая великую колькость элементу. ў ёсць у 44 эталонах з 50. У вывадзе base з language=&quot;be&quot;: 0.">
<text x="12" y="18" class="f-label f-muted">1 сказ FLEURS, Whisper base</text>
<text x="12" y="44" class="f-label f-ink">беларускі эталон</text>
<text x="24" y="62" class="f-mono f-ink">У большасці выпадкаў сплавы — гэта сумесь дзвюх ці некалькіх металаў.</text>
<text x="24" y="80" class="f-mono f-ink">Майце на ўвазе, што перыядычная табліца змяшчае вялікую колькасць</text>
<text x="24" y="98" class="f-mono f-ink">элементаў.</text>
<text x="12" y="126" class="f-label f-accent">base, language=&quot;be&quot;</text>
<text x="24" y="144" class="f-mono f-ink">Больше стивыпатков, сплавы, это сумесь двух тенекальки металл. Метя на</text>
<text x="24" y="162" class="f-mono f-ink">увазе, что пераядычная таблица замещая великую колькость элементу.</text>
<text x="12" y="190" class="f-label f-accent">base, аўтаматычна (выбраў рускую)</text>
<text x="24" y="208" class="f-mono f-ink">В большей стивыпадках с плавы это сумесь двух тенекальки металлов.</text>
<text x="24" y="226" class="f-mono f-ink">Матя на увазе, что пероядочная таблица замещая великую колькость</text>
<text x="24" y="244" class="f-mono f-ink">элементу.</text>
<text x="12" y="276" class="f-label f-muted">ў ёсць у 44 эталонах з 50. У вывадзе base з language=&quot;be&quot;: 0.</text>
</svg>
<figcaption>З пазначанай мовай мяняюцца асобныя словы, але правапіс застаецца рускім: у замест ў, а и замест і.</figcaption>
</figure>

small першы піша хоць нейкія беларускія літары. З пазначанай мовай ён піша ў у 11 сказах з 30, а ў эталоне яна ёсць у 26. Руская літара толькі ў 9,5% яго слоў. Няправільных слоў становіцца 78,1% замест 92,5% у аўтаматычным рэжыме. У артыкуле ў small 75,1%, так што гэта прыкладна тое, што і павінна быць. Але гэта ўсё роўна мешаніна. У 28 сказах з 30 недзе ёсць руская літара, у 8 ёсць украінскае слова, накшталт `існує` пасярод беларускага сказа. Памылка па знаках 23,4%, гэта амаль кожны чацвёрты знак. Для мяне гэта значыць, што такі тэкст прасцей набраць нанова, чым выпраўляць.

## Грузінская

tiny пазнаў грузінскую толькі ў 44 сказах са 100. base пазнаў у 46 з 50, часцей, чым літоўскую (82%). small пазнаў ва ўсіх 30. Ніводная з 3 мадэляў не напісала ніводнай грузінскай літары ні ў адным сказе.

base піша нешта накшталт лацінскай транслітарацыі, `Policisinspektorist Chandrashek` замест "პოლიციის ინსპექტორის ჩანდრა შეკხარ". small, які кожны сказ вызначыў як грузінскі, піша армянскім пісьмом у 28 сказах з 30. У 18 з іх армянскія літары, звычайна `ԱՅՆՆՆՆ`, дзе адна і тая ж літара паўтараецца да канца вываду. У астатніх 10 толькі армянская кропка `։`, зноў і зноў. tiny піша па-кітайску ў 33 сказах са 100. У адным з іх ёсць `小朋友们记得点赞`, прыкладна "дзеці, не забудзьцеся лайкнуць", так кітайскія відэаблогеры кажуць у канцы ролікаў. Магу толькі здагадвацца, але гэта падобна на кавалак чыіхсьці субтытраў з навучальных даных.

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="Грузінскі эталон: პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ... Whisper base, які вызначыў грузінскую, піша лацінкай: Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B... Whisper tiny на іншым грузінскім сказе піша па-кітайску: 小朋友们记得点赞,收点赞,收点赞... Грузінскія літары ў вывадзе Whisper: tiny 0 з 100, base 0 з 50, small 0 з 30. Па-кітайску ў tiny: 33 з 100.">
<text x="12" y="18" class="f-label f-muted">1 сказ FLEURS па-грузінску</text>
<text x="12" y="44" class="f-label f-ink">грузінскі эталон</text>
<text x="24" y="62" class="f-mono f-ink">პოლიციის ინსპექტორის ჩანდრა შეკხარ სოლანკის თქმით, დანაშაულში ბრალ...</text>
<text x="12" y="90" class="f-label f-accent">base, выбраў грузінскую</text>
<text x="24" y="108" class="f-mono f-ink">Policisinspektorist Chandrashek, Kharsolankistkmitta, Naša Olši, B...</text>
<text x="12" y="136" class="f-label f-accent">tiny, іншы сказ</text>
<text x="24" y="154" class="f-mono f-ink">小朋友们记得点赞,收点赞,收点赞...</text>
<text x="12" y="186" class="f-label f-muted">Грузінскія літары ў вывадзе Whisper: tiny 0 з 100, base 0 з 50, small 0 з 30.</text>
<text x="12" y="204" class="f-label f-muted">Па-кітайску ў tiny: 33 з 100.</text>
</svg>
<figcaption>base вызначыў грузінскую і запісаў яе лацінкай.</figcaption>
</figure>

Доля няправільных слоў па-грузінску большая за 100%, у tiny на ўсіх 100 сказах гэта 228%. Цыклы дадаюць словы, якіх няма ў эталоне. Так што на гэтую лічбу я б асабліва не глядзеў, большая яе частка гэта цыклы, а астатняе няправільныя літары.

## Чаго я не правяраў

medium і large не запускаліся, на гэтым працэсары яны не ўкладваюцца ў час. У артыкуле ў large па-беларуску 56,6%, так што нават там да рускай далёка. Прамянёвы пошук я таксама не запускаў. Кансольная ўтыліта выкарыстоўвае яго па змаўчанні, так што ў яе лічбы, імаверна, будуць крыху ніжэйшыя за мае. FLEURS гэта чыстае чытанае маўленне, на рэальных запісах, хутчэй за ўсё, горш. Ад 30 да 100 сказаў гэта малая выбарка і на іншых сказах лічбы ў small могуць зрушыцца на некалькі пунктаў. Кожная канфігурацыя запускалася адзін раз, але прагнае дэкадаванне кожны раз дае той жа вынік: я нанова дэкадаваў 4 зацыкленыя сказы і атрымаў той жа тэкст байт у байт. Данавучанне на беларускай я не спрабаваў.

Пакуль я б аддаваў Whisper беларускі запіс толькі з `language="be"` і на мадэлі не меншай за small. І нават тады чытаў бы кожны радок. З грузінскай я б не пачынаў, у артыкуле ў яе 100,5% нават на large.
