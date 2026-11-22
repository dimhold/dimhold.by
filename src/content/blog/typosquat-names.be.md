---
title: "Што ловіць праверка на адну літару ў тайпсквотынгу npm"
description: "Я думаў, што праверка імёнаў на адну праўку ад папулярных пакетаў npm зловіць большасць тайпсквотаў. На 417 вядомых шкодных імёнах яна ловіць палову, пазначае 27 196 імёнаў рэестра, а мой першы рэйтынг папулярнасці аказаўся 2016 года."
date: 2021-02-12
lang: be
translationKey: typosquat-names
tags: ["dependencies", "open-data"]
---
У аўторак Алекс Бірсан апублікаваў допіс пра dependency confusion. Ён пранёс код у зборкі Apple і Microsoft праз публічныя пакеты з такімі ж імёнамі, як у іх унутраных. Я прачытаў яго двойчы. Атака іншая, але яна нагадала мне пра старэйшую і прасцейшую. Нехта публікуе `reqest` і чакае чалавека, які занадта хутка друкуе.

Пакеты я ўсталёўваю, набіраючы імя па памяці. Я ніводнага разу не глядзеў, што ляжыць на адлегласці адной літары ад імёнаў, якія я набіраю. Абарона, якую я заўсёды сабе ўяўляў, простая. Перад усталёўкай праверыць, ці не адрозніваецца імя ад папулярнага пакета на адну праўку. Калі так, спытаць "вы мелі на ўвазе?". Я быў упэўнены, што яна зловіць большасць атак, бо нападнікам патрэбныя вялікія пакеты. І быў упэўнены, што перашкаджаць яна будзе рэдка. Таму я змераў.

## Даныя

Для npm я ўзяў `all-the-package-names` 1.3905.0. Гэта апошні рэліз, ад 22 лістапада 2019 года, у ім 1 106 544 імёны. Для PyPI ўзяў просты індэкс ад 30 студзеня з 286 566 імёнамі. Папулярнасць там гэта спіс 4000 праектаў, якія найбольш спампоўвалі ў студзені.

Вядомым шкодным бокам стала GitHub Advisory Database: 419 бюлетэняў пра шкодныя пакеты npm, апублікаваных да сённяшняга дня, на 417 імёнаў. Большасць дадалі туды ў верасні мінулага года. Мой першы фільтр пакідаў толькі загалоўкі са словам "Malicious" і страціў 48 бюлетэняў з загалоўкамі накшталт "X is malware". Сярод іх быў `crossenv` 2017 года, выпадак, які прыводзяць усе. Я заўважыў гэта толькі пры другім праходзе па даных. Для PyPI такой базы няма, таму я ўзяў 2 публічныя справаздачы, дзе названы пакет, які падрабляюць. Першая гэта бюлетэнь SK-CSIRT ад верасня 2017 года з 10 падробленымі пакетамі. Другая гэта `jeIlyfish` разам з `python3-dateutil` ад снежня 2019 года.

У праверкі 4 правілы. Імя падазронае, калі ад папулярнага імя яго аддзяляе адно выдаленне, устаўка або замена. Яно падазронае, калі 2 суседнія сімвалы памяняныя месцамі або калі адрозненне толькі ў пунктуацыі. Апошняе правіла гэта папулярнае імя плюс частая прыстаўка або суфікс накшталт `node-` або `-js`.

## Шмат што тут не пра імёны

У 108 з 417 шкодных імёнаў няма суседа паводле гэтых правілаў нідзе ў рэестры, ні сярод папулярных, ні сярод астатніх. Многія з іх гэта тэставыя загрузкі з імёнамі накшталт `harmlesspackage`. А некаторыя гэта атакі, якім падобнае імя і не было патрэбнае. `flatmap-stream`, які трапіў у `event-stream` у 2018 годзе, ёсць сярод іх. `eslint-scope` таксама сярод іх, сапраўдны пакет, апублікаваны з украдзенага акаўнта. Абедзве гісторыі я ведаў, але ніводнага разу не спытаў сябе, якую долю праблемы яны складаюць.

## Рэйтынг, які я не праверыў

Спіс пакетаў прыходзіць адсартаваным паводле папулярнасці, таму спачатку я ўзяў яго парадак. Топ 1000 злавіў 87 імёнаў і пазначыў яшчэ 9451 імя. Потым я паглядзеў, што ён прапускае. Найбуйнейшай групай аказаліся 46 імёнаў вакол `buffer-xor`, які стаяў на месцы 10 931. У студзені яго спампавалі 41 мільён разоў.

Толькі тады я прачытаў, адкуль бярэцца парадак. Гэта `dependent-counts` 2.0.0, апублікаваны 26 снежня 2016 года. Ён лічыць і devDependencies, таму першым ідзе `mocha`. І ранжуе ён толькі 86 143 імёны. Астатні мільён імёнаў ідзе без усялякага парадку паводле папулярнасці. Выходзіць, для атакі 2021 года я ўзяў рэйтынг 2016 года і не паглядзеў на яго.

Я папрасіў у API спампоўванняў npm студзеньскія лічбы 2021 года для гэтых 86 143 імёнаў. Ён прымае 128 імёнаў за запыт і хутка пачынае адказваць 429, так што гэта заняло больш за гадзіну. `buffer-xor` падняўся на месца 610, а `webpack-cli` з месца 14 123 на 1005.

## Паўната супраць шуму

Паводле спампоўванняў карціна такая:

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Для кожнага парога імёнаў npm паводле спампоўванняў за студзень 2021 года: колькі з 417 вядомых шкодных імёнаў ловіць праверка і колькі імёнаў рэестра яна пазначае: топ 100: 22 / 1093; топ 1000: 108 / 6425; топ 8568 *: 215 / 27 196; топ 30 000: 237 / 54 543. У 108 шкодных імёнаў няма суседа ва ўсім рэестры.">
  <text x="100" y="16" text-anchor="start" class="f-muted" style="font-size:11px">злоўлена шкодных імёнаў з 417</text>
  <text x="440" y="16" text-anchor="start" class="f-muted" style="font-size:11px">пазначана імёнаў рэестра</text>
  <text x="90" y="43" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 100</text>
  <rect x="100.0" y="31.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="31.0" width="14.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="120.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">22</text>
  <rect x="440.0" y="31.0" width="3.2" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="449.2" y="44" text-anchor="start" class="f-mono" style="font-size:12px">1093</text>
  <text x="90" y="73" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 1000</text>
  <rect x="100.0" y="61.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="61.0" width="69.9" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="175.9" y="74" text-anchor="start" class="f-mono" style="font-size:12px">108</text>
  <rect x="440.0" y="61.0" width="18.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="464.8" y="74" text-anchor="start" class="f-mono" style="font-size:12px">6425</text>
  <text x="90" y="103" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 8568 *</text>
  <rect x="100.0" y="91.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="91.0" width="139.2" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="245.2" y="104" text-anchor="start" class="f-mono" style="font-size:12px">215</text>
  <rect x="440.0" y="91.0" width="79.8" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="525.8" y="104" text-anchor="start" class="f-mono" style="font-size:12px">27 196</text>
  <text x="90" y="133" text-anchor="end" class="f-ink f-mono" style="font-size:12px">топ 30 000</text>
  <rect x="100.0" y="121.0" width="270.0" height="18.0" class="f-box" style="fill:var(--muted);opacity:.25;stroke:none"/>
  <rect x="100.0" y="121.0" width="153.5" height="18.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="259.5" y="134" text-anchor="start" class="f-mono" style="font-size:12px">237</text>
  <rect x="440.0" y="121.0" width="160.0" height="18.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="606.0" y="134" text-anchor="start" class="f-mono" style="font-size:12px">54 543</text>
  <line x1="300.1" y1="28" x2="300.1" y2="152" class="f-line" style="stroke:var(--ink);stroke-dasharray:4 3"/>
  <text x="300.1" y="166" text-anchor="middle" class="f-muted" style="font-size:11px">у 309 ёсць хоць нейкі сусед</text>
  <text x="100" y="186" text-anchor="start" class="f-muted" style="font-size:11px">* усе імёны ад 15 000 спампоўванняў за тыдзень, мяжа SpellBound</text>
</svg>
<figcaption>Імёны npm на 22 лістапада 2019 года (1 106 544), упарадкаваныя паводле спампоўванняў за студзень 2021 года. Злева: колькі з 417 шкодных імёнаў з GitHub Advisory Database адрозніваюцца ад імя з топ N адной праўкай, перастаноўкай, зменай пунктуацыі або частым афіксам. Пункцір гэта 309, імёны, у якіх такі сусед ёсць хоць дзе ў рэестры. Справа: колькі іншых імёнаў рэестра пазначаюць тыя самыя правілы.</figcaption>
</figure>

Топ 1000 цяпер ловіць 108 імёнаў замест 87 і пазначае 6425 замест 9451. SpellBound, артыкул сакавіка мінулага года, лічыць папулярным пакет ад 15 000 спампоўванняў за тыдзень. Тут гэта 8568 імёнаў. Праверка ловіць 215 з 417 і пазначае 27 196 імёнаў, 2,5% рэестра. Маё чаканне не спраўдзілася двойчы. У большасці шкодных імёнаў няма суседа ў топ 1000. А пазначаныя імёны лічацца тысячамі, так што рукамі іх ніхто разбіраць не будзе.

Некаторыя мэты такія, як я чакаў. У `request` у спісе 2019 года 51 зарэгістраванае імя на адлегласці адной праўкі. 18 з іх ёсць у бюлетэнях, ад `reqest` да `rrequest`. Але `request` стаіць на месцы 130, так што спіс топ 100 не абараніў бы нават яго.

## Хто набірае `bwffer-xor`

Імёны вакол `buffer-xor` дзіўныя і ў іншым:

<figure class="fig">
<svg viewBox="0 0 680 262" role="img" aria-label="46 шкодных імёнаў npm на адлегласці аднаго сімвала ад buffer-xor. Памылак друку суседняй клавішай сярод іх 9: budfer-xor, bufder-xor, buffdr-xor, buffer-xkr, buffer-zor, bufger-xor, bufver-xor, bugfer-xor, buvfer-xor. Астатнія гэта замены, якіх не дае палец, які саслізнуў.">
  <rect x="22.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="40" y="14" text-anchor="start" class="f-muted" style="font-size:11px">суседняя клавіша (9)</text>
  <rect x="352.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.6;stroke:none"/>
  <text x="370" y="14" text-anchor="start" class="f-muted" style="font-size:11px">любая іншая замена (37)</text>
  <text x="340" y="40" text-anchor="middle" class="f-ink f-mono" style="font-size:15px">buffer-xor</text>
  <text x="22" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">b5ffer-xor</text>
  <text x="150" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">beffer-xor</text>
  <text x="278" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bqffer-xor</text>
  <text x="406" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">btffer-xor</text>
  <text x="534" y="62" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bubfer-xor</text>
  <text x="22" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">budfer-xor</text>
  <text x="150" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufber-xor</text>
  <text x="278" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufder-xor</text>
  <text x="406" y="82" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffar-xor</text>
  <text x="534" y="82" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffdr-xor</text>
  <text x="22" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffe2-xor</text>
  <text x="150" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffeb-xor</text>
  <text x="278" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffep-xor</text>
  <text x="406" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-8or</text>
  <text x="534" y="102" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-hor</text>
  <text x="22" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-por</text>
  <text x="150" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xgr</text>
  <text x="278" y="122" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-xkr</text>
  <text x="406" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xmr</text>
  <text x="534" y="122" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xnr</text>
  <text x="22" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xo2</text>
  <text x="150" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xob</text>
  <text x="278" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xop</text>
  <text x="406" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xos</text>
  <text x="534" y="142" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xov</text>
  <text x="22" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-xoz</text>
  <text x="150" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffer-yor</text>
  <text x="278" y="162" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buffer-zor</text>
  <text x="406" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffermxor</text>
  <text x="534" y="162" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffes-xor</text>
  <text x="22" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffev-xor</text>
  <text x="150" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffez-xor</text>
  <text x="278" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffgr-xor</text>
  <text x="406" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffmr-xor</text>
  <text x="534" y="182" text-anchor="start" class="f-muted f-mono" style="font-size:12px">buffur-xor</text>
  <text x="22" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufger-xor</text>
  <text x="150" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bufner-xor</text>
  <text x="278" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bufver-xor</text>
  <text x="406" y="202" text-anchor="start" class="f-accent f-mono" style="font-size:12px">bugfer-xor</text>
  <text x="534" y="202" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bunfer-xor</text>
  <text x="22" y="222" text-anchor="start" class="f-accent f-mono" style="font-size:12px">buvfer-xor</text>
  <text x="150" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">bwffer-xor</text>
  <text x="278" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">cuffer-xor</text>
  <text x="406" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">fuffer-xor</text>
  <text x="534" y="222" text-anchor="start" class="f-muted f-mono" style="font-size:12px">juffer-xor</text>
  <text x="22" y="242" text-anchor="start" class="f-muted f-mono" style="font-size:12px">ruffer-xor</text>
</svg>
<figcaption>Усе 46 шкодных імёнаў з GitHub Advisory Database на адлегласці адной праўкі ад пакета ўверсе. У кожным заменены адзін сімвал. Вылучаны імёны, дзе новы сімвал стаіць на суседняй клавішы QWERTY, іх 9. Шэрым усе астатнія замены.</figcaption>
</figure>

Усе 46 той самай даўжыні, што і арыгінал, у кожным заменены адзін сімвал. Толькі 9 з іх гэта памылкі друку, якія можа зрабіць чалавек, суседняя клавіша на клавіятуры. `bwffer-xor` або `buffer-8or` не атрымаюцца ад пальца, які саслізнуў. Думаю, тут скрыпт прайшоўся па алфавіце, але даказаць гэтага не магу. SpellBound прыводзіць `bwffer-xor` як свой уласны прыклад і піша, што такія імёны аўтары свядома не пазначаюць, бо папярэджанняў было б занадта шмат.

## Папулярныя імёны блізкія адно да аднаго

Унутры топ 1000 npm паводле спампоўванняў ёсць 44 пары імёнаў на адлегласці адной праўкі, напрыклад `qs` і `ws` або `through2` і `through`. У топ 1000 PyPI такіх пар 24, сярод іх `boto3` і `boto`. Праверка, якая папярэджвае пра любое блізкае імя, папярэдзіць і пра `qs`, усталяваны знарок. Таму яна мусіць быць аднабаковай і спрацоўваць толькі на імя, якое само непапулярнае.

## Пунктуацыя і PyPI

PyPI нармалізуе імёны, таму `python_dateutil` і `Python.Dateutil` гэта адзін праект і другое імя ніхто зарэгістраваць не можа. У npm падобнае правіла дзейнічае з 26 снежня 2017 года: новае імя не можа адрознівацца ад існага толькі пунктуацыяй. Маё правіла пра раздзяляльнікі ловіць 4 імёны з мэтай у топ 10 000. Усе 4, сярод іх `crossenv` і `nodesass`, апублікаваў адзін акаўнт у ліпені 2017 года, да гэтага правіла.

З 12 старых атак на PyPI 7 адрозніваюцца на адну праўку ад пакета, які яны падраблялі. Астатнія 5 гэта імёны накшталт `telnet` для `telnetsrvlib`. Мая праверка прапускае 4 з іх, а пяты, `pwd`, пазначае як падобны да `pid`, пакета, які ён ніколі не падрабляў.

## Што я з гэтага бяру

SpellBound Тэйлара і суаўтараў зрабіў гэта як след. Яны выкарыстоўваюць спампоўванні і правілы клавіятуры і папярэджваюць, толькі калі непапулярнае імя блізкае да папулярнага. У іх артыкуле ёсць нават 3% пазначаных пакетаў і пары блізкіх папулярных імёнаў. Я прыйшоў туды ж даўжэйшай дарогай, затое цяпер разумею, чаму іх правілы выглядаюць менавіта так.

Сабе я пакіну праверку пры ўсталёўцы на імені, якое я набіраю. Папулярнасць у ёй будзе паводле спампоўванняў, а не паводле залежных. Яна ловіць памылкі накшталт `reqest`, але супраць `flatmap-stream` або ўкрадзенага акаўнта не робіць нічога. Там у мяне, як і раней, толькі файл з зафіксаванымі версіямі і чытанне таго, што я дадаю.

## Чаго я не правяраў

Спіс npm ад 22 лістапада 2019 года, таму навейшых імёнаў у ім няма, сярод іх 51 шкоднае. Спампоўванні ў мяне ёсць толькі для імёнаў, у якіх у 2016 годзе былі залежныя. Папулярнага новага пакета накшталт `prettier` з 48 мільёнамі спампоўванняў у студзені ў маім рэйтынгу няма. Значыць, сапраўдныя месцы ніжэйшыя, а колькасць пазначаных гэта ніжняя мяжа. Што пакеты шкодныя, я паверыў GitHub на слова. Для кожнага шкоднага імя мэтай я лічыў самага папулярнага суседа, а гэта не заўсёды тое, што падрабляў нападнік. Я не мераў, якія памылкі друку людзі робяць насамрэч. Імёны са скоупам я не спрабаваў наогул.
