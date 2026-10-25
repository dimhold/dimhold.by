---
title: "GPT-3 чытае беларускую ў 6,5 раза даражэй за англійскую"
description: "Адны і тыя ж 1012 сказаў FLORES-101 на токенізатарах 2022 года. На GPT-2, якім карыстаецца GPT-3, руская мова каштуе ў 5,68 раза больш за англійскую, беларуская ў 6,47. Лацінкай беларуская там танее на 54%, але на ўсіх 4 астатніх токенізатарах выходзіць даражэй за кірыліцу."
date: 2022-05-29
lang: be
translationKey: belarusian-token-tax
tags: ["llm", "machine-learning", "text"]
---
Я з Беларусі і кожны пост у гэтым блогу выходзіць яшчэ і па-беларуску. GPT-3 цяпер відавочны памочнік для такой працы, а плацяць за яго па токенах. Перш чым ім карыстацца, я хацеў ведаць, колькі там каштуе беларуская.

На старонцы дапамогі OpenAI пра токены ёсць правіла на вока: 1 токен гэта прыкладна 4 сімвалы англійскага тэксту. Я ўзяў гэтае правіла і ў галаве перанёс яго на рускую з папраўкай. Кірылічная літара ў UTF-8 займае 2 байты, токенізатар працуе з байтамі, значыць руская павінна каштаваць прыкладна ўдвая даражэй, мабыць, крыху больш. На той жа старонцы ёсць прыклад па-іспанску і фраза пра тое, што іншыя мовы бываюць даражэйшыя. Я яе прапусціў і ніводную з дзвюх моваў так і не палічыў.

Перад падлікам я запісаў сваю здагадку: руская прыкладна ў 4 разы даражэй за англійскую, беларуская прыкладна ў 5. Яна ўсё роўна аказалася заніжанай.

## Як мераў

Корпус гэта FLORES-101 devtest, які Facebook выклаў у чэрвені мінулага года. У ім 1012 сказаў, перакладзеных людзьмі з англійскай на 100 іншых моваў, так што сэнс аднолькавы і змяняецца толькі мова. Я ўзяў англійскую, рускую, беларускую, а для параўнання ўкраінскую і польскую. Кожны сказ кадуецца асобна, без службовых токенаў. Падатак гэта колькасць токенаў мовы, падзеленая на колькасць токенаў англійскай на тым жа токенізатары.

У артыкуле пра GPT-3 сказана, што мадэль выкарыстоўвае токенізацыю GPT-2. Гэта BPE на ўзроўні байтаў і яго слоўнік адкрыты з 2019 года. Акрамя яго я ўзяў яшчэ 4 токенізатары. ruGPT-3 ад Сбера навучаны на рускай. mBERT, XLM-R і mT5 шматмоўныя і беларуская была ў іх навучальных даных. Лічыў я бібліятэкамі tokenizers 0.12.1 і sentencepiece 0.1.96.

Для mBERT гэта лічылі да мяне. Ács у 2019 годзе разабрала яго слоўнік і вымерала, як ён рэжа словы ў 54 са сваіх 104 моў. Rust з суаўтарамі ў мінулым годзе параўналі яго з аднамоўнымі токенізатарамі, руская там таксама ёсць. Я не знайшоў нікога, хто прагнаў бы беларускую праз токенізатар GPT-3 або параўнаў бы яе на кірыліцы і на лацініцы на адных і тых жа сказах.

## У 6,47 раза

На GPT-2 англійскі корпус займае 27044 токены. Руская ў 5,68 раза больш, беларуская ў 6,47. Украінская 5,71, амаль як руская. Польская, якая пішацца лацініцай з дыякрытыкай, 2,68.

Па цане Davinci, 0,06 долара за 1000 токенаў, англійскі корпус каштуе 1,62 долара, а беларускі 10,50. Базавая мадэль Davinci прымае 2048 токенаў на запыт і адказ разам. Сярэдні англійскі сказ тут займае 27 токенаў, беларускі 173, таму ў акно змяшчаецца 76 англійскіх сказаў і 11 беларускіх.

Шматмоўныя токенізатары нашмат мякчэйшыя: на XLM-R руская ў 1,16 раза даражэй за англійскую, беларуская ў 1,45, на mBERT беларуская ў 1,99.

<figure class="fig">
<svg viewBox="0 0 680 200" role="img" aria-label="Гарызантальныя слупкі: токены на адных і тых жа 1012 сказах FLORES-101 на токенізатары GPT-2, якім карыстаецца GPT-3. Англійская 27044 токены, 1,62 долара па цане Davinci. Польская 72506, у 2,68 раза больш за англійскую. Беларуская лацінкай 80633, у 2,98 раза. Руская 153482, у 5,68 раза. Украінская 154487, у 5,71 раза. Беларуская кірыліцай 175080, у 6,47 раза, 10,50 долара.">
  <text x="10" y="16" class="f-label f-muted">токены на GPT-2, у колькі разоў больш за англійскую, цана Davinci</text>
  <text x="182" y="44" text-anchor="end" class="f-label f-ink">англійская</text>
  <rect x="190" y="30" width="51.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="247.0" y="44" class="f-label f-ink">×1  $1,62</text>
  <text x="182" y="72" text-anchor="end" class="f-label f-ink">польская</text>
  <rect x="190" y="58" width="136.7" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="332.7" y="72" class="f-label f-ink">×2,68  $4,35</text>
  <text x="182" y="100" text-anchor="end" class="f-label f-ink">беларуская, лацінка</text>
  <rect x="190" y="86" width="152.0" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="348.0" y="100" class="f-label f-accent">×2,98  $4,84</text>
  <text x="182" y="128" text-anchor="end" class="f-label f-ink">руская</text>
  <rect x="190" y="114" width="289.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="485.3" y="128" class="f-label f-ink">×5,68  $9,21</text>
  <text x="182" y="156" text-anchor="end" class="f-label f-ink">украінская</text>
  <rect x="190" y="142" width="291.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="487.2" y="156" class="f-label f-ink">×5,71  $9,27</text>
  <text x="182" y="184" text-anchor="end" class="f-label f-ink">беларуская</text>
  <rect x="190" y="170" width="330.0" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="526.0" y="184" class="f-label f-accent">×6,47  $10,50</text>
</svg>
<figcaption>Адны і тыя ж 1012 сказаў FLORES-101 devtest на токенізатары GPT-2. Цана 0,06 долара за 1000 токенаў, Davinci.</figcaption>
</figure>

Потым я захацеў паглядзець на сам слоўнік. Першы падлік паказаў, што кірыліцы ў GPT-2 няма зусім. Так быць не можа, бо ў рускай выйшла 1,08 токена на сімвал, а не каля 1,8, столькі, колькі ў яе байтаў на сімвал. Я забыўся перавесці байтавыя кавалкі назад у тэкст перад пошукам. Другі падлік знайшоў 18 запісаў з кірыліцай сярод 50257. 17 з іх гэта адзіночныя малыя літары: о, а, е, и, т і іншыя частыя ў рускай. Любая іншая літара гэта 2 токены, яе 2 байты. Вялікія літары таксама па 2 токены.

Выходзіць, GPT-2 чытае кірыліцу па літарах, а беларуская часцей карыстаецца дарагімі літарамі. Літары ў і і ў гэтыя 17 не ўваходзяць, разам гэта 7,4% усіх беларускіх літар. Калі дадаць з, ц, ч, ш, вялікія і астатнія, па 2 токены каштуюць 29,1% беларускіх літар супраць 17,0% рускіх. Да таго ж у беларускім перакладзе прыкладна на 4% больш літар. Падлік адных толькі літар, па 1 або 2 токены на кожную, тлумачыць прыкладна 90% з тых 21598 токенаў, якія беларуская траціць звыш рускай.

## Лацініца

У беларускай ёсць свая лацініца, лацінка, з č, š, ž, ŭ і ł. Калі кошт ідзе ад алфавіта, то тыя ж словы лацінкай павінны выйсці на GPT-2 значна танней. Я напісаў грубы канвертар з класічнымі правіламі для ł/l, ia/ja і мяккага ś перад мяккім зычным. Выключэнняў для запазычанняў у ім няма. Беларускі чытач знойдзе ў яго выніку памылкі, але словы застаюцца тымі ж, мяняюцца толькі літары.

На GPT-2 лацінка ў 2,98 раза даражэй за англійскую, а не ў 6,47, гэта значыць рахунак падае на 54%. "навукоўцы" гэта 12 токенаў на кірыліцы і 5 у выглядзе "navukoŭcy". Гэтая частка супала з чаканнем, я запісаў: прынамсі на 30% танней.

<figure class="fig">
<svg viewBox="0 0 680 148" role="img" aria-label="Як 3 токенізатары рэжуць слова навукоўцы. GPT-2, кірыліца: 12 токенаў. Літары а, в, у, к, о, ы па 1 токене, н, ў і ц разрэзаныя на 2 байты, першы байт н прыклеены да прабелу. GPT-2, тое ж слова лацінкай, navukoŭcy: 5 токенаў, nav, uko, 2 паловы ŭ, cy. XLM-R, кірыліца: 2 токены, навук і оўцы.">
  <text x="140" y="34" text-anchor="end" class="f-label f-ink">GPT-2, кірыліца</text>
  <rect x="150" y="14" width="41" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="170.5" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">␣½н</text>
  <rect x="195" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="211" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½н</text>
  <rect x="231" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="246" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">а</text>
  <rect x="265" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="280" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">в</text>
  <rect x="299" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="314" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">у</text>
  <rect x="333" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="348" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">к</text>
  <rect x="367" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="382" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">о</text>
  <rect x="401" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="417" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ў</text>
  <rect x="437" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="453" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ў</text>
  <rect x="473" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="489" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ц</text>
  <rect x="509" y="14" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="525" y="34" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ц</text>
  <rect x="545" y="14" width="30" height="30" rx="3" class="f-box"/>
  <text x="560" y="34" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">ы</text>
  <text x="585" y="34" class="f-label f-muted">12</text>
  <text x="140" y="78" text-anchor="end" class="f-label f-ink">GPT-2, лацінка</text>
  <rect x="150" y="58" width="50" height="30" rx="3" class="f-box"/>
  <text x="175" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">␣nav</text>
  <rect x="204" y="58" width="41" height="30" rx="3" class="f-box"/>
  <text x="224.5" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">uko</text>
  <rect x="249" y="58" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="265" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ŭ</text>
  <rect x="285" y="58" width="32" height="30" rx="3" class="f-box" stroke-dasharray="3 2"/>
  <text x="301" y="78" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">½ŭ</text>
  <rect x="321" y="58" width="32" height="30" rx="3" class="f-box"/>
  <text x="337" y="78" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">cy</text>
  <text x="363" y="78" class="f-label f-muted">5</text>
  <text x="140" y="122" text-anchor="end" class="f-label f-ink">XLM-R, кірыліца</text>
  <rect x="150" y="102" width="68" height="30" rx="3" class="f-box"/>
  <text x="184" y="122" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">▁навук</text>
  <rect x="222" y="102" width="50" height="30" rx="3" class="f-box"/>
  <text x="247" y="122" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">оўцы</text>
  <text x="282" y="122" class="f-label f-muted">2</text>
</svg>
<figcaption>Слова навукоўцы. Палова літары гэта адзін з яе 2 байтаў у UTF-8. Асобна літара н гэта 1 токен, тут прабел наперадзе забірае яе першы байт. Англійскае scientists на GPT-2 гэта 1 токен, рускае учёные 9.</figcaption>
</figure>

Потым я прагнаў тое ж пераўтварэнне на астатніх 4 токенізатарах і на кожным выйшла наадварот. На mBERT лацінка на 6% даражэй за кірыліцу, на ruGPT-3 на 52%, mT5 і XLM-R пасярэдзіне. 3 шматмоўныя токенізатары бачылі беларускую на кірыліцы падчас навучання. Думаю, яны вывучылі яе кавалкі, а лацінскае напісанне тых жа слоў у іх даных сустракалася рэдка, асабліва ŭ. На XLM-R "навукоўцы" гэта 2 токены, на адзін менш, чым рускае "учёные". Лацінкай гэтае слова займае 4. У слоўніку ruGPT-3 усяго 2 запісы з літарай ў, але там, хутчэй за ўсё, працуе тое ж самае. Ён вывучыў кірылічныя кавалкі на рускай, а лацінка іх выкідае.

<figure class="fig">
<svg viewBox="0 0 680 200" role="img" aria-label="Слупкі: кошт беларускага тэксту лацінкай, падзелены на кошт кірыліцай, на 5 токенізатарах. Менш за 1 значыць, што лацінка танней. GPT-2: 0,46. mBERT: 1,06. mT5: 1,12. XLM-R: 1,31. ruGPT-3: 1,52.">
  <text x="10" y="16" class="f-label f-muted">токены лацінкай / токены кірыліцай</text>
  <line x1="382.5" y1="26" x2="382.5" y2="170" class="f-line" stroke-dasharray="4 3"/>
  <text x="376.5" y="184" text-anchor="end" class="f-label f-muted">← танней</text>
  <text x="388.5" y="184" class="f-label f-muted">даражэй →</text>
  <text x="112" y="44" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GPT-2</text>
  <rect x="120" y="30" width="120.8" height="20" class="f-accent" style="fill:currentColor" opacity="0.8"/>
  <text x="246.8" y="44" class="f-label f-accent">0,46</text>
  <text x="112" y="72" text-anchor="end" class="f-mono f-ink" style="font-size:12px">mBERT</text>
  <rect x="120" y="58" width="278.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="404.3" y="72" class="f-label f-ink">1,06</text>
  <text x="112" y="100" text-anchor="end" class="f-mono f-ink" style="font-size:12px">mT5</text>
  <rect x="120" y="86" width="294.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="420.0" y="100" class="f-label f-ink">1,12</text>
  <text x="112" y="128" text-anchor="end" class="f-mono f-ink" style="font-size:12px">XLM-R</text>
  <rect x="120" y="114" width="343.9" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="469.9" y="128" class="f-label f-ink">1,31</text>
  <text x="112" y="156" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ruGPT-3</text>
  <rect x="120" y="142" width="399.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="525.0" y="156" class="f-label f-ink">1,52</text>
</svg>
<figcaption>Тыя ж беларускія сказы, пераведзеныя ў лацінку маім грубым канвертарам. Танней становіцца толькі на GPT-2.</figcaption>
</figure>

## Токенізатар суседа

ruGPT-3 уладкаваны гэтаксама, як GPT-2: BPE на ўзроўні байтаў на 50257 запісаў, толькі зліцці ён вывучыў на рускай. Для рускай Сбер зняў большую частку падатку: рускі корпус займае на ім 29833 токены, у 1,10 раза больш, чым англійскі на GPT-2.

Я чакаў, што беларускай гэта таксама дапаможа: мовы блізкія і большасць літар агульныя. На ruGPT-3 беларуская ў 2,12 раза даражэй за рускую. На GPT-2 разрыў быў усяго 1,14, бо абедзве мовы там абслугоўваліся аднолькава дрэнна. 78% рускіх слоў на ruGPT-3 змяшчаюцца ў адзін токен, а беларускіх 27%. "навукоўцы" займае 5 токенаў, "учёные" 1.

Зноў здавалася, што вінаватыя 2 літары. Я замяніў літару ў на у, а і на и ва ўсім беларускім корпусе. На GPT-2 гэта закрывае 42% разрыву з рускай, што адпавядае чытанню па літарах. На ruGPT-3 толькі 16%. Там у слоўніку цэлыя рускія словы, а беларускія словы проста іншыя і замена літар не робіць іх рускімі. Думаю, гэта і ёсць большая частка тых 2,12, але асобна я гэтага не вылучаў.

## Чаго я не правяраў

- Толькі кошт у токенах. Ці горш GPT-3 адказвае па-беларуску, я не вымяраў.
- Мой канвертар у лацінку грубы. У першай версіі не было ji пасля галосных і мяккага ś. Калі я іх дадаў, GPT-2 зрушыўся з 2,91 да 2,98, а астатнія 4 засталіся даражэйшымі за кірыліцу. Акуратная ручная транслітарацыя можа зрушыць лічбы яшчэ крыху.
- FLORES гэта тэксты з праектаў Вікімедыя накшталт Вікінавін, перакладзеныя з англійскай. Тэкст, які адразу пісаўся па-беларуску, можа токенізавацца інакш.
- OpenAI можа змяніць токенізатар у новых мадэлях. Я лічыў на слоўніку GPT-2, пра які сам артыкул аб GPT-3 піша, што ён "распрацаваны для амаль цалкам англійскага навучальнага набору".
