---
title: "Кампаніі капіруюць раздзел пра рызыкі. Толькі 15% тэксту 2026 года стаяла там яшчэ ў 2016"
description: "Я выразаў раздзел Risk Factors з 10-K 500 выпадковых амерыканскіх кампаній за 11 гадоў. З году ў год 75% раздзела капіруецца даслоўна, але ў тэксце 2026 года толькі 15% стаяла там яшчэ ў 2016. COVID дагэтуль ёсць у 37% раздзелаў, LIBOR у 1%."
date: 2026-10-08
lang: be
translationKey: risk-copypaste
tags: ["open-data", "text", "statistics"]
---
У кожным 10-K ёсць раздзел Item 1A, Risk Factors. У ім пералічана ўсё, што можа нашкодзіць кампаніі. Звычайна пра яго кажуць, што яго пішуць адзін раз, а потым кожны год капіруюць з новай датай. Я сам гэта паўтараў і ні разу не правяраў.

У артыкуле пра Бэнфарда я глядзеў толькі на лікі з 10-K. Тэкст на EDGAR таксама ляжыць бясплатна. Да падліку я запісаў сваю здагадку: не менш за 80% раздзела даслоўна капіруецца з мінулага года. І прыкладна чвэрць тэксту 2026 года стаіць там яшчэ з 2016.

## Як мераў

Я ўзяў квартальныя індэксы EDGAR з 2016 года па 8 кастрычніка 2026. З іх пакінуў кампаніі, якія падавалі 10-K, без паправак, у кожным з 11 гадоў. Гэта 2930 з 13168 кампаній, якія падавалі яго хоць раз. З іх я выпадкова выбраў 500, спампаваў асноўны дакумент кожнага 10-K і выразаў Item 1A. Год тут гэта год падачы, таму справаздача 2026 года апісвае 2025.

Найдаўжэй давялося важдацца з выразаннем. Загалоўкі бываюць разарваныя тэгам пасярэдзіне слова: "RIS K FACTORS" або "I TEM 1A". Рэгулярныя выразы я перапісваў двойчы і пасля кожнай праўкі зноў спампоўваў справаздачы з кароткімі раздзеламі. У выніку з 5500 справаздач 4752 далі раздзел не карацейшы за 500 слоў. Усё на Python 3.12 і стандартнай бібліятэцы.

Адзінка падліку гэта сказ, у ніжнім рэгістры, сказы карацейшыя за 5 слоў выкінуты. Доля копіі ў годзе гэта доля яго слоў, якія стаяць у сказах, што даслоўна былі ў раздзеле мінулага года.

## 75%, але цалкам амаль ніхто не капіруе

Па 4300 парах суседніх гадоў медыянная доля копіі 75,0%. Мае 80% аказаліся крыху завышанымі, але кірунак правільны. Здзівіў мяне іншы канец размеркавання. Толькі ў 8,9% пар скапіравана 90% і больш а 99% і больш толькі ў 0,4%.

Тут мая мера аказалася занадта строгай. У Universal Health Realty Income Trust вось гэты сказ стаіць ва ўсіх 11 справаздачах, уключна з пададзенай 25 лютага 2026:

> Beginning in Federal Fiscal Year (FFY) 2015, hospitals that rank in the worst 25% of all hospitals nationally for hospital acquired conditions in the previous year will receive reduced Medicare reimbursements.

Наступны за ім сказ таксама прастаяў усе 11 гадоў. Але ў 2019 "The ACA also prohibits" ператварылася ў "The Legislation also prohibits". Для дакладнага супадзення з гэтага моманту гэта новы сказ. Я палічыў амаль дакладныя копіі для апошняй пары гадоў. З 47259 новых сказаў у справаздачах 2026 года 21,2% гэта сказ 2025 года, у якім памянялі не больш за 2 словы. Па ўсіх парах і па ланцужках з 8 слоў замест цэлых сказаў доля копіі 84,6%.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Зверху сказ з раздзела Risk Factors кампаніі Universal Health Realty Income Trust у справаздачах 2018 і 2019 гадоў, розніца толькі ў замене &quot;ACA&quot; на &quot;Legislation&quot;. Пры дакладным супадзенні ён лічыцца новым. Знізу: з 47259 сказаў справаздач 2026 года, якіх даслоўна не было ў справаздачы 2025 года, 21,2% гэта сказ 2025 года з праўкай не больш за 2 словы.">
  <text x="10" y="16" class="f-label f-muted">адзін сказ пры дакладным супадзенні і пры праўцы да 2 слоў</text>
  <text x="10" y="50" class="f-label f-muted">2018</text>
  <rect x="80.2" y="37" width="29.4" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="50" class="f-mono f-ink">The</text>
  <text x="83.2" y="50" class="f-mono f-accent">ACA</text>
  <text x="114.4" y="50" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="10" y="80" class="f-label f-muted">2019</text>
  <rect x="80.2" y="67" width="91.8" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="80" class="f-mono f-ink">The</text>
  <text x="83.2" y="80" class="f-mono f-accent">Legislation</text>
  <text x="176.8" y="80" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="52" y="122" class="f-label f-ink">✗ дакладнае супадзенне: новы сказ</text>
  <text x="52" y="142" class="f-label f-accent">✓ праўка да 2 слоў: той жа сказ</text>
  <text x="52" y="188" class="f-label f-muted">новыя сказы ў справаздачах 2026 года, 47259</text>
  <rect x="52" y="200" width="118.5" height="30" style="fill:var(--accent)"/>
  <rect x="170.5" y="200" width="439.5" height="30" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="52" y="248" class="f-label f-accent">21,2% леташні з праўкай у 1 ці 2 словы</text>
  <text x="610" y="248" text-anchor="end" class="f-label f-muted">78,8% астатнія</text>
</svg>
<figcaption>Адлегласць праўкі па словах не больш за 2 да любога сказа раздзела той жа кампаніі за 2025 год, 441 кампанія.</figcaption>
</figure>

## Што засталося ад 2016

Другая здагадка прамахнулася мацней. Я ўзяў 417 кампаній, у якіх раздзел ёсць за ўсе 11 гадоў. У іх тэксце 2026 года медыянная доля таго, што даслоўна стаяла ў 2016, 15,4%, а не 25%. Па ланцужках з 8 слоў 28,6%. Тэкст 2016 года губляе амаль чвэрць слоў у першы ж год, а далей сыходзіць павольней. Да 2026 года ад яго застаецца 21,9%. У тэксце 2026 года гэта меншая доля, 15,4%, бо раздзел вырас прыкладна на траціну.

Кожны год медыянная кампанія выдаляе ад 19% да 26% леташняга тэксту і дадае крыху больш. Медыянная даўжыня ў тых жа 417 кампаній была 7933 словы ў 2016 і 11185 у 2026. Даўжэйшым раздзел стаў у 84,9% з іх.

<figure class="fig">
<svg viewBox="0 0 640 340" role="img" aria-label="Састаўныя слупкі па гадах падачы з 2016 па 2026, кожны слупок гэта раздзел Risk Factors тых жа 417 кампаній, раскладзены па годзе, з якога сказ стаіць без перапынку. Частка, якая стаіць кожны год з 2016, скарачаецца са 100% у 2016 да 71% у 2017, 30% у 2021 і 17% у 2026. Новае ў сваім годзе: 29% у 2017, 33% у 2021 і 27% у 2026. Медыяна даўжыні расце з 7933 слоў да 11185.">
  <text x="10" y="16" class="f-label f-muted">адкуль словы раздзела кожнага года, сярэдняе па 417 кампаніях</text>
  <rect x="104" y="30" width="14" height="10" style="fill:var(--accent)"/><text x="124" y="39" class="f-label f-ink">стаіць кожны год з 2016</text>
  <rect x="104" y="44" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="124" y="53" class="f-label f-ink">дададзена пазней і засталося</text>
  <rect x="104" y="58" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="124" y="67" class="f-label f-ink">новае ў гэтым годзе</text>
  <text x="98" y="294" text-anchor="end" class="f-label f-muted">0%</text>
  <text x="98" y="194" text-anchor="end" class="f-label f-muted">50%</text>
  <text x="98" y="94" text-anchor="end" class="f-label f-muted">100%</text>
  <rect x="108.0" y="90.0" width="39.8" height="200.0" style="fill:var(--accent)"/>
  <text x="127.9" y="306" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="127.9" y="322" text-anchor="middle" class="f-label f-muted">7933</text>
  <rect x="155.8" y="147.1" width="39.8" height="142.9" style="fill:var(--accent)"/>
  <rect x="155.8" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="175.7" y="143.1" text-anchor="middle" class="f-label f-ink">71%</text>
  <text x="175.7" y="306" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="175.7" y="322" text-anchor="middle" class="f-label f-muted">8293</text>
  <rect x="203.6" y="176.7" width="39.8" height="113.3" style="fill:var(--accent)"/>
  <rect x="203.6" y="147.5" width="39.8" height="29.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="203.6" y="90.0" width="39.8" height="57.5" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="223.5" y="172.7" text-anchor="middle" class="f-label f-ink">57%</text>
  <text x="223.5" y="306" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="223.5" y="322" text-anchor="middle" class="f-label f-muted">8497</text>
  <rect x="251.5" y="197.0" width="39.8" height="93.0" style="fill:var(--accent)"/>
  <rect x="251.5" y="147.1" width="39.8" height="49.9" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="251.5" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="271.4" y="193.0" text-anchor="middle" class="f-label f-ink">46%</text>
  <text x="271.4" y="306" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="271.4" y="322" text-anchor="middle" class="f-label f-muted">8881</text>
  <rect x="299.3" y="213.5" width="39.8" height="76.5" style="fill:var(--accent)"/>
  <rect x="299.3" y="149.4" width="39.8" height="64.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="299.3" y="90.0" width="39.8" height="59.4" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="319.2" y="209.5" text-anchor="middle" class="f-label f-ink">38%</text>
  <text x="319.2" y="306" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="319.2" y="322" text-anchor="middle" class="f-label f-muted">9314</text>
  <rect x="347.1" y="229.3" width="39.8" height="60.7" style="fill:var(--accent)"/>
  <rect x="347.1" y="156.8" width="39.8" height="72.4" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="347.1" y="90.0" width="39.8" height="66.8" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="367.0" y="225.3" text-anchor="middle" class="f-label f-ink">30%</text>
  <text x="367.0" y="306" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="367.0" y="322" text-anchor="middle" class="f-label f-muted">10040</text>
  <rect x="394.9" y="236.0" width="39.8" height="54.0" style="fill:var(--accent)"/>
  <rect x="394.9" y="146.0" width="39.8" height="90.0" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="394.9" y="90.0" width="39.8" height="56.0" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="414.8" y="232.0" text-anchor="middle" class="f-label f-ink">27%</text>
  <text x="414.8" y="306" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="414.8" y="322" text-anchor="middle" class="f-label f-muted">10324</text>
  <rect x="442.7" y="241.4" width="39.8" height="48.6" style="fill:var(--accent)"/>
  <rect x="442.7" y="144.2" width="39.8" height="97.2" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="442.7" y="90.0" width="39.8" height="54.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="462.6" y="237.4" text-anchor="middle" class="f-label f-ink">24%</text>
  <text x="462.6" y="306" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="462.6" y="322" text-anchor="middle" class="f-label f-muted">10455</text>
  <rect x="490.5" y="245.8" width="39.8" height="44.2" style="fill:var(--accent)"/>
  <rect x="490.5" y="142.2" width="39.8" height="103.6" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="490.5" y="90.0" width="39.8" height="52.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="510.5" y="241.8" text-anchor="middle" class="f-label f-ink">22%</text>
  <text x="510.5" y="306" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="510.5" y="322" text-anchor="middle" class="f-label f-muted">10701</text>
  <rect x="538.4" y="250.5" width="39.8" height="39.5" style="fill:var(--accent)"/>
  <rect x="538.4" y="139.2" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="538.4" y="90.0" width="39.8" height="49.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="558.3" y="246.5" text-anchor="middle" class="f-label f-ink">20%</text>
  <text x="558.3" y="306" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="558.3" y="322" text-anchor="middle" class="f-label f-muted">10760</text>
  <rect x="586.2" y="255.3" width="39.8" height="34.7" style="fill:var(--accent)"/>
  <rect x="586.2" y="144.1" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="586.2" y="90.0" width="39.8" height="54.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="606.1" y="251.3" text-anchor="middle" class="f-label f-ink">17%</text>
  <text x="606.1" y="306" text-anchor="middle" class="f-label f-muted">2026</text>
  <text x="606.1" y="322" text-anchor="middle" class="f-label f-muted">11185</text>
  <text x="98" y="322" text-anchor="end" class="f-label f-muted">медыяна слоў</text>
</svg>
<figcaption>Доля слоў, сярэдняе па кампаніях. Сказ адносіцца да года, з якога ён без перапынку стаіць у кожнай справаздачы; адна праўка робіць яго зноў новым. Год гэта год падачы.</figcaption>
</figure>

На малюнку падлік крыху іншы. Сказ захоўвае свой год, толькі пакуль стаіць у кожнай справаздачы без перапынку, а долі там сярэднія. Таму слупок 2026 года паказвае 17%.

Найменш капіруюць у 2021 годзе, 69,2%. Гэтыя справаздачы апісваюць 2020, першы год пандэміі. І гэта першыя справаздачы пасля таго, як SEC 9 лістапада 2020 змяніла Item 105 Regulation S-K. Новая рэдакцыя загадвае ставіць агульныя рызыкі, калі яны ёсць, у канец, пад загаловак "General Risk Factors". Асобным радком гэты загаловак стаіць у 19,5% усіх раздзелаў 2021 года супраць 0,2% годам раней. Мая мера не глядзіць на парадак сказаў, таму перанесены тэкст усё роўна лічыцца копіяй. Але ў 2021 медыянная кампанія выдаліла 25,9% леташняга тэксту, больш, чым у любы іншы год. Медыянная даўжыня пры гэтым усё роўна вырасла з 9314 слоў да 10040.

## Словы з датай

Каб убачыць, што вечнае, я палічыў некалькі слоў, да якіх прывязана дата.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Лінейны графік долі кампаній, у раздзеле Risk Factors якіх ёсць слова, па гадах падачы з 2016 па 2026. COVID: 2016 0,0%, 2020 52,3%, 2021 98,8%, 2023 90,6%, 2024 66,9%, 2026 37,1%; LIBOR: 2016 4,0%, 2020 39,3%, 2021 36,9%, 2023 26,1%, 2024 6,6%, 2026 1,4%; artificial intelligence: 2016 0,0%, 2020 3,0%, 2021 3,7%, 2023 8,5%, 2024 32,0%, 2026 64,9%; tariff: 2016 27,0%, 2020 52,3%, 2021 52,0%, 2023 51,8%, 2024 52,5%, 2026 83,3%.">
  <text x="10" y="16" class="f-label f-muted">доля кампаній, у раздзеле якіх ёсць слова</text>
  <line x1="50" y1="250" x2="420" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="254" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="50" y1="200" x2="420" y2="200" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="204" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="50" y1="150" x2="420" y2="150" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="154" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="50" y1="100" x2="420" y2="100" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="104" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="50" y1="50" x2="420" y2="50" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="54" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="50" y="268" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="124" y="268" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="198" y="268" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="272" y="268" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="346" y="268" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="420" y="268" text-anchor="middle" class="f-label f-muted">2026</text>
  <path d="M50.0,250.0 L87.0,250.0 L124.0,250.0 L161.0,250.0 L198.0,145.3 L235.0,52.3 L272.0,53.2 L309.0,68.8 L346.0,116.2 L383.0,150.7 L420.0,175.8" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="428" y="179.8" class="f-label f-accent">COVID 37%</text>
  <path d="M50.0,242.0 L87.0,241.6 L124.0,235.9 L161.0,200.9 L198.0,171.5 L235.0,176.2 L272.0,178.6 L309.0,197.7 L346.0,236.8 L383.0,245.5 L420.0,247.3" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <text x="428" y="251.3" class="f-label f-ink">LIBOR 1%</text>
  <path d="M50.0,250.0 L87.0,249.1 L124.0,246.7 L161.0,244.8 L198.0,243.9 L235.0,242.6 L272.0,240.3 L309.0,233.0 L346.0,186.1 L383.0,145.2 L420.0,120.1" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="6 4"/>
  <text x="428" y="124.1" class="f-label f-ink">artificial intelligence 65%</text>
  <path d="M50.0,196.0 L87.0,184.9 L124.0,181.3 L161.0,154.7 L198.0,145.3 L235.0,146.1 L272.0,146.3 L309.0,146.3 L346.0,145.0 L383.0,104.9 L420.0,83.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.5" opacity="0.5" stroke-dasharray="2 3"/>
  <text x="428" y="87.5" class="f-label f-ink">tariff 83%</text>
  <circle cx="235.0" cy="52.3" r="3.5" style="fill:var(--accent)"/>
  <text x="235.0" y="44.3" text-anchor="middle" class="f-label f-accent">99%</text>
  <circle cx="198.0" cy="171.5" r="3.5" class="f-ink" style="fill:currentColor"/>
  <text x="198.0" y="163.5" text-anchor="middle" class="f-label f-ink">39%</text>
</svg>
<figcaption>З кампаній з раздзелам ад 500 слоў у гэтым годзе, ад 424 да 442 за год. Згадка гэта любое ўваходжанне слова, у тым ліку ў гісторыі або ў прыкладзе.</figcaption>
</figure>

COVID ёсць у 98,8% раздзелаў са справаздач, пададзеных у 2021, а ў 2026 у 37,1%. З 426 кампаній, якія згадвалі яго ў 2021, 160 згадваюць дагэтуль. Я рукамі прачытаў 40 выпадковых сказаў 2026 года з ім. У 20 гэта гісторыя, у 11 толькі прыклад ("such as COVID-19"), у 9 яго дагэтуль лічаць жывой рызыкай. З усіх 325 такіх сказаў 2026 года 52 даслоўна стаялі ў справаздачы 2022 года. Ceres Orion гэта ф'ючарсны фонд, раней ён называўся Orion Futures Fund. Вось гэты радок ён упісаў у 10-K 30 сакавіка 2020. Ён стаіць там жа і 20 сакавіка 2026:

> The continuing spread of a new strain of coronavirus, which causes the viral disease known as COVID-19, may adversely affect our investments and operations.

З LIBOR выйшла інакш. Апошнія стаўкі даляравага LIBOR ад панэлі банкаў апублікавалі 30 чэрвеня 2023. З 159 кампаній, якія згадвалі LIBOR у 2021, у 2026 яго згадваюць толькі 5. Мая здагадка ў тым, што важная жорсткая дата. У LIBOR яна была. Пандэмія раздзелу рызык нічога падобнага не дае. Новыя словы пры гэтым заходзяць хутка. Доля "artificial intelligence" вырасла з 3,7% у 2021 да 64,9% у 2026, мыты (tariff) з 52,5% у 2024 да 83,3%.

На ўзроўні цэлага сказа кампаніі капіруюць у асноўным саміх сябе. Медыянная доля тэксту 2026 года ў сказах, якія ёсць яшчэ ў нейкай іншай кампаніі з 500, 2,1%. Самыя частыя з іх гэта загалоўкі накшталт "Risks related to our business".

## Чаго я не правяраў

Даходнасці акцый я не чапаў. Гэта артыкул "Lazy Prices" Ларэн Коэн з суаўтарамі (2020): кампаніі, якія мяняюць гэты тэкст, потым паказваюць ніжэйшую даходнасць. Рост даўжыні і "ліпкасць" тэксту 10-K з 1996 па 2013 год ужо паказалі Трэвіс Дайер з суаўтарамі (2017). Мае лікі гэта паўтор на свежых гадах з адным пытаннем: колькі жыве сказ.

Выбарка складаецца з тых, хто выжыў, гэта значыць кампаній, якія 11 гадоў падавалі справаздачу кожны год. Маладыя кампаніі, магчыма, перапісваюць больш, іх я не мераў. Абедзве меры параўноўваюць дакладны тэкст, таму перафразаванае лічыцца новым. Згадка слова ў раздзеле яшчэ не азначае рызыкі. І 40 прачытаных рукамі сказаў гэта маленькая выбарка. У 203 справаздачах я не змог выразаць раздзел наогул. Яны не выпадковыя: гэта справаздачы з незвычайнай вёрсткай, у некаторых замест раздзела табліца перакрыжаваных спасылак.
