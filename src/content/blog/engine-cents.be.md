---
title: "Claude 19 разоў з 19 напісаў правільную праграму для рахунку, а потым выдумаў, што яна надрукавала"
description: "Я заўсёды кажу, што грошы лічыць дэтэрмінаваны рухавік, а мадэль толькі распавядае, але палову з рахункамі ні разу не мераў. На польскіх рахунках з VAT Claude Opus 5 без інструментаў быў дакладны да гроша ў 18 з 20 на 5 радках і ў 19 з 20 на 40 радках, калі яму загадалі лічыць самому. Кожны няправільны адказ усё роўна сыходзіўся. Без гэтага ўказання ён у 18 адказах з 20 пісаў праграму. Усе 19 яго праграм правільныя, а ў 9 адказах ён выдумаў, што праграма надрукавала."
date: 2026-11-22
lang: be
translationKey: engine-cents
tags: ["llm", "numbers"]
---
Калі мяне пытаюцца, дзе месца моўнай мадэлі побач з грашыма, я адказваю адным сказам. Вынікі лічыць дэтэрмінаваны рухавік, а мадэль толькі пра іх распавядае. 8 кастрычніка я памераў прагнозную палову гэтага падзелу. Палову з рахункамі я не мераў ніколі, проста паўтараў, таму на гэты раз узяў рахунак.

## Пастаноўка

Я жыву ў Варшаве, таму рахунак польскі, з VAT. У кожным радку колькасць, цана нета за адзінку ў злотых, зніжка і стаўка VAT 23, 8, 5 або 0 працэнтаў. Правіла напісана ў задачы. Нета кожнага радка акругляецца да гроша, паўгроша ўверх. Потым радкі групуюцца па стаўцы, VAT бярэцца ад сумы кожнай групы і зноў акругляецца. Брута роўнае нета плюс VAT.

Рухавік гэта каля 20 радкоў на Python 3.12.3 з `decimal` і `ROUND_HALF_UP`. 10 000 рахункаў па 40 радкоў ён лічыць ад 0,83 да 1,18 секунды, прыкладна 0,1 мс на рахунак. 3 паўторы даюць адзін і той жа хэш усіх вынікаў.

Мадэль гэта `claude-opus-5` праз Claude Code 2.1.292. Запускаў я яе з пустога каталога без інструментаў і без сервераў MCP. З фіксаваным зернем я згенераваў 10 рахункаў па 5 радкоў, 10 па 15 і 10 па 40. Кожны рахунак пайшоў мадэлі 2 разы. Адказ павінен быў быць адным радком JSON з 3 вынікамі. Супадзеннем лічыцца, калі нета, VAT і брута ўсе да гроша супадаюць з рухавіком.

Да падліку я запісаў, чаго чакаю. На 5 радках мадэль дакладная хаця б у 9 выпадках з 10. На 40 радках яна дакладная менш чым у 7 з 10 і 2 прагоны аднаго рахунку хаця б раз разыходзяцца.

Думка, што код лічыць лепш за мадэль, старая і не мая. PAL і Program of Thoughts у 2022 годзе вынеслі арыфметыку з мадэлі ў праграму. Я проста ні разу не бачыў гэтага на рахунку.

## Маленькія рахункі

На 5 радках мадэль была дакладная 9 разоў у кожным прагоне. На 15 радках яна была дакладная 9 і 10 разоў. Промахі былі невялікія. Адзін рахунак разышоўся на 5 грошаў, другі на 85. Трэці разышоўся акурат на 1,00 злотага нета. VAT ад гэтага зрушыўся на 8 грошаў.

Больш за памер мяне турбуе тое, што кожны няправільны адказ сыходзіцца сам з сабой. Нета плюс VAT ва ўсіх роўнае брута да гроша. Першая праверка, якую я б напісаў, складае 3 вынікі. Кожны з гэтых адказаў яе праходзіць.

## 40 радкоў і адказ, якога я не прасіў

На 40 радках я атрымаў 2 адказы JSON з 20. Абодва былі дакладныя. Астатнія 18 аказаліся праграмай на Python з `Decimal`. Частка прыйшла блокам кода bash, частка выклікам інструмента Bash, якога ў мадэлі не было. Такога я ўвогуле не планаваў. Таму я спыніўся і да далейшага падліку запісаў новае правіла: выняць кожную праграму з адказу і запусціць.

Усяго такіх праграм набралася 19, тут 18 і яшчэ адна з іншай часткі доследу. Кожную я запусціў праз `python3 -I` у пустым часовым каталогу. Усе 19 надрукавалі правільныя вынікі да гроша.

Потым я дачытаў адказы да канца. У 10 з 19 мадэль не спынілася на праграме і сама напісала вывад інструмента. 9 разоў гэта былі лікі, 3 з іх пад загалоўкам `Tool Result`. Адзін раз проста `<redacted>`. Ніводзін з 9 не супаў ні з правільнымі вынікамі, ні нават з тым, што друкуе яе ўласная праграма. На адным рахунку праграма друкуе нета 739 434,56, а выдуманы вывад пад ёй кажа 58 923,85. Іншы рахунак атрымаў у 2 прагонах 2 розныя выдуманыя вывады, 995 552,96 і 1 304 665,13, пры правільным нета 962 434,28.

<figure class="fig">
<svg viewBox="0 0 640 296" role="img" aria-label="Кропкавая дыяграма па 9 рахунках з 40 радкоў. Для кожнага нета, якое друкуе ўласная праграма мадэлі і якое супадае з правільным вынікам, і нета, якое мадэль напісала так, нібыта адказаў інструмент. Прагон 1, рахунак 0: праграма 962 434,28, выдумана 995 552,96. Прагон 1, рахунак 6: праграма 634 763,20, выдумана 710 176,19. Прагон 2, рахунак 0: праграма 962 434,28, выдумана 1 304 665,13. Прагон 2, рахунак 1: праграма 724 844,42, выдумана 368 319,24. Прагон 2, рахунак 3: праграма 843 126,24, выдумана 1 448 668,85. Прагон 2, рахунак 4: праграма 739 434,56, выдумана 58 923,85. Прагон 2, рахунак 5: праграма 759 314,37, выдумана 861 885,72. Прагон 2, рахунак 7: праграма 664 085,65, выдумана 1 188 622,57. Прагон 2, рахунак 8: праграма 888 420,29, выдумана 1 403 374,42. Ніводны з 9 выдуманых лікаў не супадае з правільным.">
  <text x="10" y="16" class="f-label f-muted">нета ў злотых: што друкуе праграма мадэлі і што мадэль выдала за яе вывад</text>
  <circle cx="176" cy="36" r="5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.6"/><text x="186" y="40" class="f-label f-ink">друкуе яе праграма (= правільны вынік)</text>
  <circle cx="176" cy="52" r="5" style="fill:var(--accent)"/><text x="186" y="56" class="f-label f-ink">мадэль напісала як вывад</text>
  <line x1="170.0" y1="58" x2="170.0" y2="262" class="f-plain"/>
  <text x="170.0" y="278" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="316.7" y1="58" x2="316.7" y2="262" class="f-plain"/>
  <text x="316.7" y="278" text-anchor="middle" class="f-label f-muted">500 000</text>
  <line x1="463.3" y1="58" x2="463.3" y2="262" class="f-plain"/>
  <text x="463.3" y="278" text-anchor="middle" class="f-label f-muted">1 000 000</text>
  <line x1="610.0" y1="58" x2="610.0" y2="262" class="f-plain"/>
  <text x="610.0" y="278" text-anchor="middle" class="f-label f-muted">1 500 000</text>
  <text x="160" y="76" text-anchor="end" class="f-mono f-ink">прагон 1, рахунак 0</text>
  <line x1="452.3" y1="72" x2="462.0" y2="72" class="f-line"/>
  <circle cx="452.3" cy="72" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="462.0" cy="72" r="5" style="fill:var(--accent)"/>
  <text x="160" y="98" text-anchor="end" class="f-mono f-ink">прагон 1, рахунак 6</text>
  <line x1="356.2" y1="94" x2="378.3" y2="94" class="f-line"/>
  <circle cx="356.2" cy="94" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="378.3" cy="94" r="5" style="fill:var(--accent)"/>
  <text x="160" y="120" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 0</text>
  <line x1="452.3" y1="116" x2="552.7" y2="116" class="f-line"/>
  <circle cx="452.3" cy="116" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="552.7" cy="116" r="5" style="fill:var(--accent)"/>
  <text x="160" y="142" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 1</text>
  <line x1="382.6" y1="138" x2="278.0" y2="138" class="f-line"/>
  <circle cx="382.6" cy="138" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="278.0" cy="138" r="5" style="fill:var(--accent)"/>
  <text x="160" y="164" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 3</text>
  <line x1="417.3" y1="160" x2="594.9" y2="160" class="f-line"/>
  <circle cx="417.3" cy="160" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="594.9" cy="160" r="5" style="fill:var(--accent)"/>
  <text x="160" y="186" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 4</text>
  <line x1="386.9" y1="182" x2="187.3" y2="182" class="f-line"/>
  <circle cx="386.9" cy="182" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="187.3" cy="182" r="5" style="fill:var(--accent)"/>
  <text x="160" y="208" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 5</text>
  <line x1="392.7" y1="204" x2="422.8" y2="204" class="f-line"/>
  <circle cx="392.7" cy="204" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="422.8" cy="204" r="5" style="fill:var(--accent)"/>
  <text x="160" y="230" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 7</text>
  <line x1="364.8" y1="226" x2="518.7" y2="226" class="f-line"/>
  <circle cx="364.8" cy="226" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="518.7" cy="226" r="5" style="fill:var(--accent)"/>
  <text x="160" y="252" text-anchor="end" class="f-mono f-ink">прагон 2, рахунак 8</text>
  <line x1="430.6" y1="248" x2="581.7" y2="248" class="f-line"/>
  <circle cx="430.6" cy="248" r="5" class="f-ink" style="fill:var(--surface);stroke:currentColor;stroke-width:1.6"/>
  <circle cx="581.7" cy="248" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>Інструментаў у мадэлі не было. Усе 19 яе праграм пры запуску друкуюць правільныя вынікі. У 10 адказах яна яшчэ і сама напісала вывад, 9 разоў лікамі і адзін раз &lt;redacted&gt;.</figcaption>
</figure>

Нейкі час я думаў, што ў 9 з гэтых адказаў кода няма ўвогуле. Мой першы скрыпт, які выцягваў праграмы, знайшоў іх толькі ў 10 з 19, а астатнія пазначыў як "кода няма". Мадэль загарнула адну і тую ж праграму ў 3 розныя фарматы, а я не чакаў больш за адзін.

## Лічыць уручную

Тады я адправіў тыя ж 10 рахункаў па 40 радкоў яшчэ 2 разы, дадаўшы ў задачу адзін сказ: "You have no tools and cannot run code. Compute the totals yourself." Гэта значыць, інструментаў няма, код запусціць нельга, лічы сам.

Мадэль была дакладная ў 10 з 10 у першым прагоне і ў 9 з 10 у другім. Мая здагадка пра менш чым 7 не пацвердзілася. І адзіны промах таксама не пра акругленне. Мадэль цалкам прапусціла радок 27, 40 штук па 2462,10 са зніжкай 15%, таму нета меншае на 83 711,40, а VAT на 19 253,63.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Сетка з 8 шэрагаў на 10 рахункаў. 5 радкоў: дакладна ў 9 і 9 з 10, промахі на 5 і 85 грошаў нета. 15 радкоў: дакладна ў 9 і 10, адзін промах на 1,00 злотага нета. 40 радкоў: 18 адказаў з 20 гэта праграма замест лікаў, 2 адказы лікамі дакладныя. 40 радкоў з забаронай кода: дакладна ў 10 і 9, у промаху прапушчаны радок 27.">
  <text x="10" y="16" class="f-label f-muted">па 10 рахункаў на памер, па 2 прагоны: дакладна да гроша ці не</text>
  <text x="180" y="50" text-anchor="end" class="f-mono f-ink">5 радкоў, прагон 1</text>
  <rect x="192" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="38" width="20" height="18" style="fill:var(--accent)"/>
  <rect x="426" y="38" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="458" y="50" class="f-label f-accent">нета −0,05</text>
  <text x="180" y="74" text-anchor="end" class="f-mono f-ink">5 радкоў, прагон 2</text>
  <rect x="192" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="62" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="62" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="74" class="f-label f-accent">нета −0,85</text>
  <text x="180" y="98" text-anchor="end" class="f-mono f-ink">15 радкоў, прагон 1</text>
  <rect x="192" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="86" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="86" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="98" class="f-label f-accent">нета +1,00</text>
  <text x="180" y="122" text-anchor="end" class="f-mono f-ink">15 радкоў, прагон 2</text>
  <rect x="192" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="110" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="146" text-anchor="end" class="f-mono f-ink">40 радкоў, прагон 1</text>
  <rect x="192" y="134" width="20" height="18" class="f-box"/><text x="202" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="134" width="20" height="18" class="f-box"/><text x="228" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="134" width="20" height="18" class="f-box"/><text x="254" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="270" y="134" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="134" width="20" height="18" class="f-box"/><text x="306" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="134" width="20" height="18" class="f-box"/><text x="332" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="134" width="20" height="18" class="f-box"/><text x="358" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="134" width="20" height="18" class="f-box"/><text x="384" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="134" width="20" height="18" class="f-box"/><text x="410" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="134" width="20" height="18" class="f-box"/><text x="436" y="147" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="170" text-anchor="end" class="f-mono f-ink">40 радкоў, прагон 2</text>
  <rect x="192" y="158" width="20" height="18" class="f-box"/><text x="202" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="218" y="158" width="20" height="18" class="f-box"/><text x="228" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="244" y="158" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="158" width="20" height="18" class="f-box"/><text x="280" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="296" y="158" width="20" height="18" class="f-box"/><text x="306" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="322" y="158" width="20" height="18" class="f-box"/><text x="332" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="348" y="158" width="20" height="18" class="f-box"/><text x="358" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="374" y="158" width="20" height="18" class="f-box"/><text x="384" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="400" y="158" width="20" height="18" class="f-box"/><text x="410" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <rect x="426" y="158" width="20" height="18" class="f-box"/><text x="436" y="171" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">{}</text>
  <text x="180" y="200" text-anchor="end" class="f-mono f-accent">40, без кода, прагон 1</text>
  <rect x="192" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="188" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <text x="180" y="224" text-anchor="end" class="f-mono f-accent">40, без кода, прагон 2</text>
  <rect x="192" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="218" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="244" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="270" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="296" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="322" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="348" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="374" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="400" y="212" width="20" height="18" class="f-ink" style="fill:currentColor" opacity="0.3"/>
  <rect x="426" y="212" width="20" height="18" style="fill:var(--accent)"/>
  <text x="458" y="224" class="f-label f-accent">прапушчаны радок 27</text>
  <rect x="190" y="242" width="12" height="12" class="f-ink" style="fill:currentColor" opacity="0.3"/><text x="208" y="252" class="f-label f-ink">дакладна</text>
  <rect x="284.8" y="242" width="12" height="12" style="fill:var(--accent)"/><text x="302.8" y="252" class="f-label f-ink">памылка</text>
  <rect x="373" y="242" width="12" height="12" class="f-box"/><text x="391" y="252" class="f-label f-ink">праграма замест лікаў</text>
</svg>
<figcaption>Claude Opus 5 без інструментаў, правіла названа ў задачы. У кожным няправільным адказе нета плюс VAT усё адно сыходзіцца з брута.</figcaption>
</figure>

Медыянны выклік заняў 42,9 секунды і каштаваў $0,11, на разважанне пайшло каля 4000 токенаў. На 5 радках гэта было 13,6 секунды і $0,024. Рухавік лічыць той жа рахунак з 40 радкоў прыкладна за 0,1 мс. Усе 100 выклікаў гэтага замеру каштавалі $5,71.

<figure class="fig">
<svg viewBox="0 0 640 184" role="img" aria-label="Гарызантальныя слупкі на лагарыфмічнай шкале секунд. Рухавік на Decimal траціць каля 0,1 мс на рахунак з 40 радкоў. Мадэль траціць у медыяне 13,6 секунды і $0,024 на 5 радкоў, 19,6 секунды і $0,045 на 15 радкоў, 42,9 секунды і $0,11 на 40 радкоў з забаронай кода.">
  <text x="10" y="16" class="f-label f-muted">час на адзін рахунак, лагарыфмічная шкала</text>
  <line x1="330.0" y1="30" x2="330.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="330.0" y="170" text-anchor="middle" class="f-label f-muted">1 мс</text>
  <line x1="450.0" y1="30" x2="450.0" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="450.0" y="170" text-anchor="middle" class="f-label f-muted">1 с</text>
  <line x1="521.1" y1="30" x2="521.1" y2="154" class="f-line" stroke-dasharray="3 3"/>
  <text x="521.1" y="170" text-anchor="middle" class="f-label f-muted">1 хв</text>
  <text x="240" y="49" text-anchor="end" class="f-mono f-ink">рухавік на Decimal, 40 радкоў</text>
  <rect x="250" y="37" width="36.7" height="16" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="289.7" y="35" width="96.2" height="20" style="fill:var(--surface)"/>
  <text x="292.7" y="49" class="f-mono f-ink">каля 0,1 мс</text>
  <text x="240" y="79" text-anchor="end" class="f-mono f-ink">мадэль, 5 радкоў</text>
  <rect x="250" y="67" width="245.3" height="16" style="fill:var(--accent)"/>
  <rect x="498.3" y="65" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="501.3" y="79" class="f-mono f-ink">13,6 с, $0,024</text>
  <text x="240" y="109" text-anchor="end" class="f-mono f-ink">мадэль, 15 радкоў</text>
  <rect x="250" y="97" width="251.7" height="16" style="fill:var(--accent)"/>
  <rect x="504.7" y="95" width="120.8" height="20" style="fill:var(--surface)"/>
  <text x="507.7" y="109" class="f-mono f-ink">19,6 с, $0,045</text>
  <text x="240" y="139" text-anchor="end" class="f-mono f-ink">мадэль, 40 радкоў, без кода</text>
  <rect x="250" y="127" width="265.3" height="16" style="fill:var(--accent)"/>
  <rect x="518.3" y="125" width="112.6" height="20" style="fill:var(--surface)"/>
  <text x="521.3" y="139" class="f-mono f-ink">42,9 с, $0,11</text>
</svg>
<figcaption>Мадэль: медыяна 20 выклікаў на кожны слупок, кошт паводле справаздачы CLI. Рухавік: 10 000 рахункаў па 40 радкоў за 0,83–1,18 с, Python 3.12.3.</figcaption>
</figure>

## Калі правіла не названа

Другая мая здагадка была пра акругленне. Я даў 10 рахункаў па 15 радкоў без правіла, толькі "да гроша". Я чакаў, што мадэль будзе пераскокваць паміж акругленнем VAT у кожным радку, па стаўцы або толькі ў самым канцы.

Яна не пераскоквала. 18 адказаў з 20 былі лікамі і ўсе 18 супадаюць з VAT ад сумы па стаўцы. Акругленне па радках і па стаўцы дае розныя вынікі ў 4 з гэтых 10 рахункаў. У гэтых 4 мадэль абодва разы выбрала акругленне па стаўцы. У адным адказе яна назвала гэта "standard Polish practice", стандартнай польскай практыкай. Астатнія 2 адказы былі планам і праграмай. Праграма таксама аказалася правільнай.

## Што я з гэтага вынес

Я ўжо быў гатовы напісаць, што мадэль не ўмее лічыць рахунак. Умее, у 19 выпадках з 20 на 40 радках, калі ёй загадана лічыць самой. Яе код быў правільны кожны раз. Няправільны вынік, які ўсё роўна сыходзіцца, праходзіць маю першую праверку. Вывад інструмента, які ніхто не запускаў, выглядае як доказ, хоць ім не з'яўляецца. Таму мае вынікі па-ранейшаму лічыць код на Decimal.

## Чаго я не правяраў

Я праверыў 1 мадэль па 2 прагоны на рахунак і рахункі сінтэтычныя. Не было карэкцыйных рахункаў і замежнай валюты, нічога не сканавалася з паперы. Сапраўднага інструмента мадэль так і не атрымала, таму я ведаю, што яе праграмы правільныя, але не ведаю, што яна робіць з сапраўдным вынікам. Бюджэт разважання я сам не задаваў і само разважанне не чытаў, так што дзе згубіўся радок 27, я не ведаю.
