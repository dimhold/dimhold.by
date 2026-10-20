---
title: "Арандатар вярнуўся арандадаўцам пасля круга праз рускую"
description: "Я прагнаў 600 англійскіх сказаў праз MarianMT на рускую і назад, 5 кругоў. Лікі вярнуліся 100 з 100. Ва ўсіх 21 сказе арандатар вярнуўся арандадаўцам і ўсё роўна прайшоў маю праверку адмаўлення. Правільны рускі пераклад пра збор, які не вяртаецца, вярнуўся як not payable. У 16 сказах руская чытаецца як 2 чалавекі замест 1, а англійская, што вярнулася, выглядала нармальна."
date: 2022-12-13
lang: be
translationKey: round-trip-drift
tags: ["machine-learning", "text", "reliability"]
---
У машыннага перакладу ёсць старая праверка. Перакладаеш тэкст, потым перакладаеш вынік назад. Калі вярнуўся зыходнік, сярэдзіне можна верыць. Я ў гэтую праверку верыў і ні разу не лічыў, колькі яна прапускае. Каб гэта палічыць, патрэбна пара, у якой я сам магу прачытаць сярэдзіну і сказаць, ці правільная яна. Для мяне гэта пара з англійскай на рускую і назад.

Сумнеў не новы. Гаральд Сомерс яшчэ ў 2005 годзе пісаў, што зваротны пераклад дрэнна падыходзіць для ацэнкі сістэмы перакладу. Дрэнная сярэдзіна можа вярнуцца так, быццам усё ў парадку. Я хацеў паглядзець на гэта на сваіх сказах, адразу на некалькіх відах сэнсу і з асобнай праверкай сярэдзіны.

## Стэнд

Мадэлі `opus-mt-en-ru` і `opus-mt-ru-en` ад `Helsinki-NLP`, гэта MarianMT, рэвізіі верасня 2022 года са сваім канфігам, гэта значыць beam search на 4 прамяні. Python 3.9, torch 1.13, transformers 4.25.1, толькі CPU, 4 ядры віртуальнай машыны на AMD EPYC. Адзін круг з 600 сказаў туды і 600 назад займае каля 4 хвілін.

Скрыпт з seed 2022 напісаў 600 кароткіх англійскіх сказаў, па 100 кожнага з 6 відаў. У кожным ёсць тое, што рэгулярка можа праверыць пасля круга:

- лік з валютай або датай, напрыклад `The invoice for 1,028,211 zlotys is due on 26 December.`;
- слова адмаўлення накшталт `not` або `never` у 50 сказах і тыя ж 50 без яго;
- мадальны дзеяслоў `must`, `may` або `should`;
- мяжа `at least`, `at most`, `more than` або `less than` з лікам;
- роля і займеннік, `The doctor called because she needs the invoice.`;
- імёны людзей і назвы кампаній, у асноўным польскія і беларускія, частка з дыякрытыкай.

Потым я прагнаў 5 кругоў. Кожны круг перакладае англійскую, што вярнулася з папярэдняга.

## Першы круг

Лікі вярнуліся 100 з 100. Слова адмаўлення вярнулася 50 з 50. У 50 сказах без адмаўлення яно не з'явілася ні разу. Займеннікі вярнуліся 100 з 100. Межы вярнуліся 92 разы. 7 разоў `at least` або `at most` проста зніклі. `The office is at most 80 kilometers from the station` вярнулася як `The office is 80 kilometres from the station`. Адзін раз 3631 долар ператварыўся ў 631.

Від мадальнасці вярнуўся 67 разоў. `should` 32 разы з 33 стаў `должен` па-руску і `must` або `has to` па-англійску. У рускай ёсць мякчэйшае слова, `следует`, але мадэль узяла яго толькі адзін раз.

Горш за ўсё выйшла з імёнамі. З 300 імёнаў дакладна вярнуліся 113. З 65 з польскімі літарамі толькі 7. Piotr стаў Peter, Paweł Wiśniewski стаў Pavel Vignevsky. Сетка крам Żabka па-руску стала `Абка`, па-англійску `Abka`, кампанія Mleczna Dolina стала Melena Valley.

Да гэтага месца чаканне спраўдзілася напалову. Што знікне дыякрытыка, я чакаў, а што Piotr стане Peter, не. А займеннікі, за якія я хваляваўся больш за ўсё, вярнуліся ўсе.

<figure class="fig">
<svg viewBox="0 0 640 376" role="img" aria-label="Слупкі для 1-га і 5-га круга. Лік, валюта і дата: 100 і 98 з 100. Слова адмаўлення: 100 і 100 з 100. Займеннік: 100 і 99 з 100. Мяжа: 92 і 91 з 100. Мадальны дзеяслоў: 67 і 67 з 100. Імёны: 113 і 106 з 300. Знайшлося пры чытанні 1-га круга: tenant вярнулася 0 разоў з 21, refundable 0 з 10, invoice 46 з 66.">
  <text x="12" y="18" class="f-label f-muted">вярнулася пасля круга, з усіх сказаў гэтага віду</text>
  <rect x="230" y="30" width="12" height="10" class="f-box"/>
  <text x="248" y="39" class="f-mono f-ink" style="font-size:11px">1-ы круг</text>
  <rect x="340" y="30" width="12" height="10" class="f-plain"/>
  <text x="358" y="39" class="f-mono f-ink" style="font-size:11px">5-ы круг</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">правярала рэгулярка</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">лік, валюта, дата</text>
  <rect x="230" y="82" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="77" width="280" height="11" class="f-box"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="96" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="91" width="274" height="11" class="f-plain"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">98/100</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">слова адмаўлення</text>
  <rect x="230" y="116" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="111" width="280" height="11" class="f-box"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="130" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="125" width="280" height="11" class="f-plain"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <text x="24" y="162" class="f-mono f-ink" style="font-size:11px">займеннік she/he</text>
  <rect x="230" y="150" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="145" width="280" height="11" class="f-box"/>
  <text x="520" y="154" class="f-mono f-ink" style="font-size:11px">100/100</text>
  <rect x="230" y="164" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="159" width="277" height="11" class="f-plain"/>
  <text x="520" y="168" class="f-mono f-ink" style="font-size:11px">99/100</text>
  <text x="24" y="196" class="f-mono f-ink" style="font-size:11px">at least / at most ...</text>
  <rect x="230" y="184" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="179" width="258" height="11" class="f-box"/>
  <text x="520" y="188" class="f-mono f-ink" style="font-size:11px">92/100</text>
  <rect x="230" y="198" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="193" width="255" height="11" class="f-plain"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">91/100</text>
  <text x="24" y="230" class="f-mono f-ink" style="font-size:11px">must / may / should</text>
  <rect x="230" y="218" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="213" width="188" height="11" class="f-box"/>
  <text x="520" y="222" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <rect x="230" y="232" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="227" width="188" height="11" class="f-plain"/>
  <text x="520" y="236" class="f-mono f-ink" style="font-size:11px">67/100</text>
  <text x="24" y="264" class="f-mono f-ink" style="font-size:11px">імёны</text>
  <rect x="230" y="252" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="247" width="105" height="11" class="f-box"/>
  <text x="520" y="256" class="f-mono f-ink" style="font-size:11px">113/300</text>
  <rect x="230" y="266" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="261" width="99" height="11" class="f-plain"/>
  <text x="520" y="270" class="f-mono f-ink" style="font-size:11px">106/300</text>
  <text x="12" y="292" class="f-mono f-accent" style="font-size:12px">знайшлося пры чытанні 1-га круга</text>
  <text x="24" y="316" class="f-mono f-ink" style="font-size:11px">tenant</text>
  <rect x="230" y="312" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="316" class="f-mono f-ink" style="font-size:11px">0/21</text>
  <text x="24" y="338" class="f-mono f-ink" style="font-size:11px">refundable</text>
  <rect x="230" y="334" width="280" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="338" class="f-mono f-ink" style="font-size:11px">0/10</text>
  <text x="24" y="360" class="f-mono f-ink" style="font-size:11px">invoice</text>
  <rect x="230" y="356" width="280" height="1" class="f-line" opacity="0.3"/>
  <rect x="230" y="351" width="195" height="11" class="f-box"/>
  <text x="520" y="360" class="f-mono f-ink" style="font-size:11px">46/66</text>
</svg>
<figcaption>Рэгулярка правярае толькі слова, на якім трымаецца сэнс. На 3 ніжнія словы яна не глядзела.</figcaption>
</figure>

## Дзе памылілася мая праверка

Скрыпт сказаў, што з адмаўленнем усё ідэальна. Потым я вачыма прачытаў усе 600 рускіх сказаў першага круга і знайшоў 3 рэчы, якіх скрыпт не ўбачыў.

Арандатар стаў арандадаўцам ва ўсіх 21 сказе. `The tenant has not paid the rent for 30 months` пайшло на рускую як `Арендодатель не платил арендную плату`. Гэта значыць, не плаціў арандадавец. Вярнулася `The lessor did not pay rent for 30 months`. `not` на месцы, праверка адмаўлення прайшла, толькі грошы цяпер вінен іншы чалавек.

Другая памылка ў адваротны бок. `The fee is not refundable after 3 days` стала `не подлежит возмещению`. Па-руску гэта правільна. Вярнулася `This fee is not payable`. У 9 з 10 такіх сказаў руская была правільнай, а англійская, што вярнулася, не. Значыць, у гэтых 9 памылка здарылася на зваротным шляху.

Трэцяя рэч гэта invoice. Часам мадэль перакладае яго як `счёт-фактура`, фармальны дакумент. Часам проста як `счёт`. `счёт-фактура` вярнулася як invoice 46 разоў з 46. Просты `счёт` вярнуўся як invoice 0 разоў з 20, часцей за ўсё як `account`. Па-руску `счёт` гэта яшчэ і банкаўскі рахунак.

## У другі бок

З займеннікамі, дзе праверка паказала 100 з 100, знайшлася свая бяда.

У рускай у дзеяслова ў прошлым часе ёсць род. У 16 з 60 сказаў з такім дзеясловам род дзеяслова ідзе за звыклым родам прафесіі, а не за займеннікам. `The accountant called because she needs the invoice` стала `Бухгалтер позвонил, потому что ей нужен счет`. Рускі чытач хутчэй за ўсё ўбачыць тут 2 чалавекі. Пазваніў мужчына, а рахунак патрэбны нейкай жанчыне. Мужчынскі род дзеяслова пасля "бухгалтер" магчымы і пра жанчыну, таму гэта не доказ, што людзей 2, але чытача туды штурхае. У 13 выпадках з 16 гэта мужчынскі дзеяслоў побач з `she`. З медсястрой 3 разы было наадварот: жаночы дзеяслоў побач з `he`.

Вярнулася `The accountant called because she needs an account`. Праверку займенніка прайшлі ўсе 16 сказаў. У англійскага дзеяслова роду няма, таму памылцы з сярэдзіны ў англійскай, што вярнулася, проста няма дзе праявіцца. Англійская фраза і сама крыху двухсэнсоўная, `she` можа быць кімсьці іншым, але я чытаю яе як фразу пра 1 чалавека.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="Табліца 2 на 2. Руская правільная і англійская вярнулася правільна: праверка працуе, лікі 100 з 100. Руская правільная, англійская вярнулася няправільна: ілжывая трывога, not refundable стала &quot;не подлежит возмещению&quot;, гэта правільна, і вярнулася як not payable, 9 сказаў з 10. Руская няправільная, англійская вярнулася правільна: праверка не бачыць, the accountant called because she needs the invoice стала &quot;Бухгалтер позвонил, потому что ей нужен счет&quot;, па-руску гэта 2 чалавекі, а вярнулася з she, 16 сказаў з 16. Руская няправільная і англійская вярнулася няправільна: праверка працуе, the tenant стаў &quot;Арендодатель&quot; і вярнуўся як the lessor, 21 з 21.">
  <text x="12" y="18" class="f-label f-muted">ці правільная руская і ці выглядае правільнай англійская, што вярнулася</text>
  <text x="250.5" y="46" class="f-label f-ink" text-anchor="middle">вярнулася правільна</text>
  <text x="507.5" y="46" class="f-label f-ink" text-anchor="middle">вярнулася няправільна</text>
  <text x="12" y="110" class="f-label f-ink">руская</text>
  <text x="12" y="124" class="f-label f-ink">правільная</text>
  <text x="12" y="230" class="f-label f-ink">руская</text>
  <text x="12" y="244" class="f-label f-ink">няправільная</text>
  <rect x="126" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="138" y="78" class="f-label f-muted">праверка працуе</text>
  <text x="138" y="116" class="f-mono f-ink" style="font-size:13px">лікі 100 з 100</text>
  <rect x="383" y="56" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="78" class="f-label f-muted">ілжывая трывога</text>
  <text x="395" y="102" class="f-mono f-ink" style="font-size:11px">not refundable</text>
  <text x="395" y="120" class="f-mono f-ink" style="font-size:11px">→ не подлежит возмещению</text>
  <text x="395" y="138" class="f-mono f-ink" style="font-size:11px">→ not payable</text>
  <text x="620" y="158" class="f-mono f-ink" text-anchor="end" style="font-size:12px">9 з 10</text>
  <rect x="126" y="176" width="249" height="112" rx="4" class="f-accent" fill-opacity="0.18"/>
  <text x="138" y="198" class="f-label f-accent">праверка не бачыць</text>
  <text x="138" y="222" class="f-mono f-ink" style="font-size:11px">the accountant ... she</text>
  <text x="138" y="240" class="f-mono f-ink" style="font-size:11px">→ Бухгалтер позвонил ... ей</text>
  <text x="138" y="258" class="f-mono f-ink" style="font-size:11px">→ the accountant ... she</text>
  <text x="363" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">16 з 16</text>
  <rect x="383" y="176" width="249" height="112" rx="4" class="f-plain"/>
  <text x="395" y="198" class="f-label f-muted">праверка працуе</text>
  <text x="395" y="222" class="f-mono f-ink" style="font-size:11px">the tenant</text>
  <text x="395" y="240" class="f-mono f-ink" style="font-size:11px">→ Арендодатель</text>
  <text x="395" y="258" class="f-mono f-ink" style="font-size:11px">→ the lessor</text>
  <text x="620" y="278" class="f-mono f-ink" text-anchor="end" style="font-size:12px">21 з 21</text>
</svg>
<figcaption>Небяспечная тут ніжняя левая клетка: памылка была ў сярэдзіне, а ў англійскай ёй няма на чым вярнуцца.</figcaption>
</figure>

## Яшчэ кругі

Я чакаў, што тэкст перастане мяняцца пасля 2 або 3 кругоў. Амаль так і выйшла. У параўнанні з папярэднім кругам у 1-м змяніліся 540 сказаў, потым 172, 63, 31 і 25. Слова ў слова зыходнік вярнуўся толькі ў 60 выпадках з 600.

Пасля першага круга нешта страцілі 138 сказаў, пасля 5 кругоў 142. Я ўжо збіраўся напісаць, што кругі з 2-га па 5-ы дадаюць 4 новыя страты. Потым паглядзеў на іх. 1 гэта мая ўласная рэгулярка: `at most 1817` вярнулася як `does not require more than 1,817`, а гэта тое ж самае. Мой шаблон ведаў толькі `not more than`, напісанае запар. Яшчэ 1 гэта проста сумесь раздзяляльнікаў у `1,028 211`. 2 мяняюць сэнс. `Our rent went up to 54,466 zlotys` у 2-м крузе стала `54 466 человек`, гэта 54 466 чалавек. У 5-м крузе арэнда была ўжо `$54,466`. У 2-м крузе распрацоўшчык, які быў `she`, стаў `Застройщик`, гэта забудоўшчык. Руская страціла займеннік, а англійская вярнулася з `he`.

З 25 сказаў, якія яшчэ мяняюцца ў 5-м крузе, 17 хістаюцца паміж 2 варыянтамі, часцей за ўсё `she needs the bill` і `she needs an account`. Толькі 8 яшчэ мяняюцца неяк інакш.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Змянілася з папярэдняга круга: 540, 172, 63, 31, 25 з 600 у кругах з 1-га па 5-ы. Сказаў, што страцілі нешта да гэтага круга: 138, 142, 142, 142, 142.">
  <text x="12" y="18" class="f-label f-muted">600 сказаў, 5 кругоў</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">змянілася з папярэдняга круга</text>
  <rect x="320" y="30" width="12" height="10" class="f-accent"/>
  <text x="338" y="39" class="f-mono f-ink" style="font-size:11px">страціла нешта да гэтага круга</text>
  <line x1="40" y1="230" x2="628" y2="230" class="f-line"/>
  <rect x="60" y="86" width="40" height="144" class="f-box"/>
  <text x="80" y="80" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">540</text>
  <rect x="104" y="193" width="40" height="37" class="f-accent"/>
  <text x="124" y="187" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">138</text>
  <text x="102" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 1</text>
  <rect x="172" y="184" width="40" height="46" class="f-box"/>
  <text x="192" y="178" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">172</text>
  <rect x="216" y="192" width="40" height="38" class="f-accent"/>
  <text x="236" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="214" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 2</text>
  <rect x="284" y="213" width="40" height="17" class="f-box"/>
  <text x="304" y="207" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">63</text>
  <rect x="328" y="192" width="40" height="38" class="f-accent"/>
  <text x="348" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="326" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 3</text>
  <rect x="396" y="222" width="40" height="8" class="f-box"/>
  <text x="416" y="216" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">31</text>
  <rect x="440" y="192" width="40" height="38" class="f-accent"/>
  <text x="460" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="438" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 4</text>
  <rect x="508" y="223" width="40" height="7" class="f-box"/>
  <text x="528" y="217" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">25</text>
  <rect x="552" y="192" width="40" height="38" class="f-accent"/>
  <text x="572" y="186" class="f-mono f-ink" text-anchor="middle" style="font-size:12px">142</text>
  <text x="550" y="248" class="f-mono f-muted" text-anchor="middle" style="font-size:11px">круг 5</text>
</svg>
<figcaption>У 1-м крузе змена лічыцца ад зыходнага сказа. З 25 сказаў, якія яшчэ мяняюцца ў 5-м крузе, 17 хістаюцца паміж 2 варыянтамі.</figcaption>
</figure>

## Чаго я не правяраў

Гэта адна пара мадэляў. Другой я планаваў NLLB-200 на 600M параметраў, якую Meta выпусціла ў ліпені гэтага года. Яна не змясцілася на дыску машыны. Праверкі гэта рэгуляркі па словах, на якіх трымаецца сэнс. Сэнсу яны не разумеюць: замена refundable на payable прайшла праверку адмаўлення. Першы круг я прачытаў вачыма. Кругі з 2-га па 5-ы не чытаў, таму там можа быць нешта яшчэ. Сказы кароткія, каля 9 слоў, з шаблонаў. Розных сказаў з адмаўленнем усяго 36, таму 100 сказаў там важаць менш, чым здаецца. Руская была толькі сярэдзінай. Польскую або беларускую ў сярэдзіне я не спрабаваў.

З лікамі зваротны пераклад справіўся. Бухгалтара ён прапусціў ва ўсіх 16 сказах, а правільны рускі пераклад пра збор, які не вяртаецца, забракаваў 9 разоў з 10. Наступным разам, калі мне спатрэбіцца такая праверка, я прачытаю сярэдзіну сам або папрашу таго, хто ведае гэту мову.
