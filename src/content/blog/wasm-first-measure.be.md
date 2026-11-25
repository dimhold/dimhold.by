---
title: "WebAssembly абганяў мой JS у 7,9 раза, пакуль я не перапісаў total += k"
description: "6 маленькіх цыклаў, выклікі праз мяжу і час кампіляцыі на Node 8.1.2, JS супраць WebAssembly, напісанага ўручную. Выйгрыш wasm у 7,9 раза на Мандэльброце даў let, ад якога адмовіўся аптымізавальны кампілятар. Пасля праўкі аднаго радка JS стаў хутчэйшы ў 1,35 раза. А вось 64-бітны генератар на wasm сапраўды хутчэйшы ў 10 разоў."
date: 2017-06-17
lang: be
translationKey: wasm-first-measure
tags: ["performance", "compilers"]
---

Цыкл Мандэльброта на Node 8.1.2 заняў 427 мс на JavaScript і 54 мс на WebAssembly. Да прагону я запісаў, што wasm павінен выйграць хаця б у 1,2 раза, таму 7,9 выглядала поспехам. Але з ключом `node --trace-opt` версія на JavaScript друкуе вось што (адрас я прыбраў):

```
[disabled optimization for <SharedFunctionInfo mandel>, reason: Unsupported let compound assignment]
```

Аптымізавальны кампілятар узяўся за функцыю і адмовіўся ад яе. Спатыкнуўся ён на радку `total += k`, адным з 14, дзе `total` абвешчаны праз `let`. Я замяніў яго на `total = total + k` і тая ж функцыя стала працаваць 40 мс. Цяпер JS хутчэйшы за wasm у 1,35 раза.

Я звычайна пішу `let` і ніколі не глядзеў, ці прымае яго аптымізатар. Таму гэты допіс адразу пра 2 рэчы.

## Як я мераў

Node 8.1.2 выйшаў у гэты чацвер, унутры V8 5.8.283.41. `WebAssembly` у восьмай галіне працуе без ключа. Машына віртуальная, 2 ядры, Linux x64. Emscripten я не браў, бо тады мераў бы заадно яго аптымізатар. Функцыі wasm запісаныя ўручную як спісы інструкцый, у байты іх збірае скрыпт на 57 радкоў. Модуль, які складае 2 цэлыя лікі, займае 41 байт:

```
00 61 73 6d 01 00 00 00 01 07 01 60 02 7f 7f 01 7f 03 02 01 00
07 07 01 03 61 64 64 00 00 0a 09 01 07 00 20 00 20 01 6a 0b
```

Кожны цыкл ёсць у 3 выглядах: JS з `let` і `const`, як я напісаў бы яго сам, той жа тэкст, дзе абодва словы замененыя на `var`, а трэці выгляд гэта wasm. Для кожнай канфігурацыі запускалася 11 новых працэсаў, у кожным па 7 паўтораў. Ніжэй усюды медыяна па працэсах ад найлепшага паўтору. Калі вынікі разышліся, скрыпт падае.

Хаас з суаўтарамі параўноўваюць wasm з натыўным кодам і asm.js у артыкуле для PLDI, яго тэкст з сакавіка ляжыць у рэпазіторыі спецыфікацыі. Лін Кларк у лютым тлумачыла на Mozilla Hacks, чаму wasm павінен быць хуткім. Мне хацелася маленькіх прыкладаў на Node, якія відаць цалкам.

## 6 цыклаў

| цыкл | let, мс | var, мс | wasm, мс | let / wasm | var / wasm |
|---|---|---|---|---|---|
| collatz, int32 | 28,2 | 25,6 | 20,7 | 1,36 | 1,24 |
| мандэльброт, f64 | 427 | 39,6 | 54,0 | 7,90 | 0,73 |
| генератар, 64 біты | 211 | 208 | 2,63 | 80,4 | 79,2 |
| ён жа, толькі int32 | 26,9 | 26,9 | 2,63 | 10,2 | 10,2 |
| рэшата, 5 млн байтаў | 313 | 34,6 | 23,3 | 13,4 | 1,49 |
| fib(30) | 9,72 | 10,06 | 7,26 | 1,34 | 1,39 |

У `fib` няма ніводнага `let`, таму ў першых 2 слупках у яго адзін і той жа тэкст, а 3% паміж імі гэта хіба самой схемы. Варыянт з `let` у працэсе заўсёды ідзе першым, варыянт з `var` збіраецца з радка.

<figure class="fig">
<svg viewBox="0 0 680 284" role="img" aria-label="Найлепшы час 6 цыклаў на Node 8.1.2 па лагарыфмічнай шкале: JS з let, JS з var і wasm. collatz, int32: let 28,2, var 25,6, wasm 20,7 мс; мандэльброт, f64: let 427, var 39,6, wasm 54,0 мс; генератар, 64 біты: let 211, var 208, wasm 2,63 мс; ён жа, int32: let 26,9, var 26,9, wasm 2,63 мс; рэшата, байты: let 313, var 34,6, wasm 23,3 мс; fib(30), выклікі: let 9,72, var 10,06, wasm 7,26 мс.">
  <circle cx="188.0" cy="16.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="204.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS з let</text>
  <circle cx="323.0" cy="16.0" r="5" style="fill:var(--ink);stroke:none"/>
  <text x="339.0" y="20.0" text-anchor="start" class="f-mono f-muted">JS з var</text>
  <circle cx="458.0" cy="16.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="474.0" y="20.0" text-anchor="start" class="f-mono f-muted">wasm</text>
  <line x1="180.0" y1="42.0" x2="180.0" y2="252.0" class="f-plain"/>
  <text x="180.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <line x1="333.3" y1="42.0" x2="333.3" y2="252.0" class="f-plain"/>
  <text x="333.3" y="272.0" text-anchor="middle" class="f-mono f-muted">10</text>
  <line x1="486.7" y1="42.0" x2="486.7" y2="252.0" class="f-plain"/>
  <text x="486.7" y="272.0" text-anchor="middle" class="f-mono f-muted">100</text>
  <line x1="640.0" y1="42.0" x2="640.0" y2="252.0" class="f-plain"/>
  <text x="640.0" y="272.0" text-anchor="middle" class="f-mono f-muted">1 000</text>
  <text x="168.0" y="64.0" text-anchor="end" class="f-mono f-ink">collatz, int32</text>
  <line x1="381.9" y1="60.0" x2="402.3" y2="60.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="402.3" cy="60.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="396.1" cy="60.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="381.9" cy="60.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="98.0" text-anchor="end" class="f-mono f-ink">мандэльброт, f64</text>
  <line x1="425.0" y1="94.0" x2="583.3" y2="94.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="583.3" cy="94.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="425.0" cy="94.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="445.7" cy="94.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="132.0" text-anchor="end" class="f-mono f-ink">генератар, 64 біты</text>
  <line x1="244.4" y1="128.0" x2="536.5" y2="128.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="536.5" cy="128.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="535.5" cy="128.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="128.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="166.0" text-anchor="end" class="f-mono f-ink">ён жа, int32</text>
  <line x1="244.4" y1="162.0" x2="399.4" y2="162.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="399.4" cy="162.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="399.2" cy="162.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="244.4" cy="162.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="200.0" text-anchor="end" class="f-mono f-ink">рэшата, байты</text>
  <line x1="389.5" y1="196.0" x2="562.6" y2="196.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="562.6" cy="196.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="416.0" cy="196.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="389.5" cy="196.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="234.0" text-anchor="end" class="f-mono f-ink">fib(30), выклікі</text>
  <line x1="312.0" y1="230.0" x2="333.7" y2="230.0" style="stroke:var(--muted);stroke-width:1"/>
  <circle cx="331.4" cy="230.0" r="8" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="333.7" cy="230.0" r="5" style="fill:var(--ink);stroke:none"/>
  <circle cx="312.0" cy="230.0" r="5" style="fill:var(--accent);stroke:none"/>
  <text x="168.0" y="272.0" text-anchor="end" class="f-label f-muted">мс, лаг. шкала</text>
</svg>
<figcaption>Медыяна па 11 працэсах, з працэсу ўзяты найлепшы з 7 паўтораў. Там, дзе пусты кружок стаіць далёка ад чорнага, аптымізавальны кампілятар ад функцыі адмовіўся.</figcaption>
</figure>

У рэшаце я паспрабаваў тую ж папраўку, `j = j + i` замест `j += i`. Гэта асобны скрыпт, 7 працэсаў па 5 паўтораў, 40 мс на пачатку допісу таксама адтуль. Было 296 мс, засталося 296 мс. Кампілятар проста перайшоў да наступнай прэтэнзіі, `Unsupported phi use of const or let variable`. Далей папраўляць я не стаў, замяніў усё на `var` і атрымаў 35 мс.

Пастка вядомая. Petka Antonov вядзе ў вікі Bluebird спіс забойцаў аптымізацыі, састаўное прысвойванне `let` там ёсць, з паметай "Optimized as of Chrome 56 / V8 5.6!". У мяне V8 5.8, таму паводле гэтага спіса ўсё павінна быць выпраўлена. Але `node --v8-options` паказвае, што ў гэтай зборцы ключ `--turbo` стандартна выключаны. З ім Мандэльброт з `let` займае 39,5 мс па 7 працэсах. У невялікай пробе запіс `s += a[i]` з `let` Node 6.11.0 прымае, а 7.10.0 ужо не.

З парай `--ignition --turbo`, якую V8 5.9 уключае ўсім, Мандэльброт з `let` займае 39,6 мс па 11 працэсах. Дарма гэта не даецца. Рэшата з `var` стала займаць 52 мс замест 34,6. З `let` яно паскорылася з 313 да 83, але да ранейшага `var` усё роўна не дацягнула.

## Адкуль узяліся 80 разоў

Цэлых на 64 біты ў JS няма, таму генератар `x = x * a + c` даводзіцца рэзаць на паловы. На звычайнай маёй версіі кампілятар здаецца нават з `var`, пасля некалькіх спроб ён піша `Deoptimized too many times`. Я вырашыў, што прамежкавыя здабыткі выходзяць за int32. Перапісаў усё праз `Math.imul`, стала хутчэй амаль у 8 разоў, але wasm усё роўна наперадзе ў 10,2 раза, а на новым канвееры ў 3,1. У wasm на гэтым месцы адзін `i64.mul`.

Тлумачэнне аказалася няслушным. `--trace-deopt` паказвае 11 выхадаў з аптымізаванага коду, усе з прычынай `lost precision` і ўсе на 2 выкліках `Math.imul`, куды трапляюць самі паловы. Паловы я трымаў беззнакавымі праз `>>> 0`. З `| 0` у гэтых 2 месцах стары тэкст займае 30,5 мс, а было 200 (7 працэсаў, у перапісанага там 26,9). Перапісваць амаль усё не было патрэбы.

Гэтаму выйгрышу я веру. Але `i64` праз мяжу не праходзіць. Функцыя wasm, якая прымае і аддае `i64`, кампілюецца, а потым `exports.id(1)` кідае `TypeError: invalid type`. Мой генератар прымае і аддае int32.

З Мандэльбротам усё наадварот. Я падазраваў свой wasm і замяніў `2 * x` на `x + x`, а канстанты вынес у лакальныя зменныя. Нічога не змянілася, 54,0 і 54,4 мс. Перанос праверкі ў канец цыкла даў 50,1. Гэта ўсё яшчэ на 25% павольней за JS з адным перапісаным радком. Чаму, я не ведаю.

## Мяжа

<figure class="fig">
<svg viewBox="0 0 680 242" role="img" aria-label="Кошт аднаго выкліку ў нанасекундах. wasm з wasm: 1,96; wasm з JS, без аргументаў: 3,65; JS з JS: 3,99; JS з wasm, 2 int32: 6,53; wasm з JS, 2 int32: 8,24; wasm з JS, 2 f64: 11,75; JS з JS, убудаваны: 0,67.">
  <text x="235.0" y="14.0" text-anchor="start" class="f-label f-muted">нс на выклік</text>
  <text x="223.0" y="42.0" text-anchor="end" class="f-mono f-ink">wasm з wasm</text>
  <rect x="235" y="30" width="61.3" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="304.3" y="42.0" text-anchor="start" class="f-mono f-ink">1,96</text>
  <text x="223.0" y="72.0" text-anchor="end" class="f-mono f-ink">wasm з JS, без аргументаў</text>
  <rect x="235" y="60" width="114.1" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="357.1" y="72.0" text-anchor="start" class="f-mono f-ink">3,65</text>
  <text x="223.0" y="102.0" text-anchor="end" class="f-mono f-ink">JS з JS</text>
  <rect x="235" y="90" width="124.7" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="367.7" y="102.0" text-anchor="start" class="f-mono f-ink">3,99</text>
  <text x="223.0" y="132.0" text-anchor="end" class="f-mono f-ink">JS з wasm, 2 int32</text>
  <rect x="235" y="120" width="204.1" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="447.1" y="132.0" text-anchor="start" class="f-mono f-ink">6,53</text>
  <text x="223.0" y="162.0" text-anchor="end" class="f-mono f-ink">wasm з JS, 2 int32</text>
  <rect x="235" y="150" width="257.5" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="500.5" y="162.0" text-anchor="start" class="f-mono f-ink">8,24</text>
  <text x="223.0" y="192.0" text-anchor="end" class="f-mono f-ink">wasm з JS, 2 f64</text>
  <rect x="235" y="180" width="367.2" height="16" style="fill:var(--accent);stroke:none"/>
  <text x="610.2" y="192.0" text-anchor="start" class="f-mono f-ink">11,75</text>
  <text x="223.0" y="222.0" text-anchor="end" class="f-mono f-ink">JS з JS, убудаваны</text>
  <rect x="235" y="210" width="20.9" height="16" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <text x="263.9" y="222.0" text-anchor="start" class="f-mono f-ink">0,67</text>
</svg>
<figcaption>Убудоўванне выключана ва ўсіх радках, апрача апошняга. Пусты цыкл, 0,48 нс, не адняты.</figcaption>
</figure>

Выклік wasm з JS з 2 цэлымі каштуе 8,24 нс супраць 3,99 у функцыі на JS, якую V8 забаранілі ўбудоўваць. Гэта ў 2 разы больш, а я закладваў да 10. Без аргументаў выходзіць 3,65, з 2 лікамі double 11,75. Зваротная дарога, з wasm у JS, каштуе 6,53. Калі ўбудоўванне дазволіць, выклік JS амаль знікае, 0,67 нс разам з цыклам, а выклік wasm так і застаецца 8,26.

Яшчэ я хацеў зразумець, з якога аб'ёму працы перанос у wasm акупляецца. Правяраў на суме квадратаў n лікаў double.

<figure class="fig">
<svg viewBox="0 0 680 338" role="img" aria-label="Час аднаго выкліку, які лічыць суму квадратаў n лікаў double, n ад 1 да 4096, абедзве восі лагарыфмічныя. JS з let ідзе верхняй лініяй ад 33,1 да 97 166 нс. JS з var ад 1,6 да 3 992 нс, wasm па сваёй памяці ад 9,5 да 4 023 нс, wasm з капіраваннем масіву ад 44,1 да 4 726 нс. На некалькіх сотнях элементаў wasm падыходзіць да лініі var, але не перасякае яе.">
  <line x1="80.0" y1="290.0" x2="520.0" y2="290.0" class="f-plain"/>
  <text x="72.0" y="294.0" text-anchor="end" class="f-mono f-muted">1</text>
  <line x1="80.0" y1="238.8" x2="520.0" y2="238.8" class="f-plain"/>
  <text x="72.0" y="242.8" text-anchor="end" class="f-mono f-muted">10</text>
  <line x1="80.0" y1="187.6" x2="520.0" y2="187.6" class="f-plain"/>
  <text x="72.0" y="191.6" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="80.0" y1="136.4" x2="520.0" y2="136.4" class="f-plain"/>
  <text x="72.0" y="140.4" text-anchor="end" class="f-mono f-muted">1 000</text>
  <line x1="80.0" y1="85.2" x2="520.0" y2="85.2" class="f-plain"/>
  <text x="72.0" y="89.2" text-anchor="end" class="f-mono f-muted">10 000</text>
  <line x1="80.0" y1="34.0" x2="520.0" y2="34.0" class="f-plain"/>
  <text x="72.0" y="38.0" text-anchor="end" class="f-mono f-muted">100 000</text>
  <text x="80.0" y="310.0" text-anchor="middle" class="f-mono f-muted">1</text>
  <text x="190.0" y="310.0" text-anchor="middle" class="f-mono f-muted">8</text>
  <text x="300.0" y="310.0" text-anchor="middle" class="f-mono f-muted">64</text>
  <text x="410.0" y="310.0" text-anchor="middle" class="f-mono f-muted">512</text>
  <text x="520.0" y="310.0" text-anchor="middle" class="f-mono f-muted">4096</text>
  <polyline points="80.0,212.2 116.7,200.4 153.3,186.3 190.0,171.1 226.7,156.4 263.3,141.4 300.0,126.4 336.7,110.8 373.3,95.8 410.0,80.5 446.7,65.2 483.3,49.8 520.0,34.6" style="fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:2 4"/>
  <polyline points="80.0,279.5 116.7,271.5 153.3,261.5 190.0,249.8 226.7,236.1 263.3,219.6 300.0,203.1 336.7,184.1 373.3,167.8 410.0,152.1 446.7,136.5 483.3,121.0 520.0,105.6" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="80.0,205.8 116.7,203.9 153.3,202.9 190.0,203.1 226.7,199.5 263.3,193.7 300.0,185.5 336.7,174.4 373.3,161.9 410.0,147.7 446.7,133.3 483.3,118.3 520.0,101.9" style="fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:6 4"/>
  <polyline points="80.0,239.9 116.7,236.1 153.3,233.5 190.0,230.5 226.7,220.7 263.3,210.6 300.0,198.3 336.7,181.9 373.3,166.7 410.0,151.7 446.7,136.1 483.3,120.9 520.0,105.4" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="530.0" y="38.6" text-anchor="start" class="f-mono f-ink">JS з let</text>
  <text x="530.0" y="91.9" text-anchor="start" class="f-mono f-accent">wasm + копія</text>
  <text x="530.0" y="113.4" text-anchor="start" class="f-mono f-accent">wasm</text>
  <text x="530.0" y="131.6" text-anchor="start" class="f-mono f-ink">JS з var</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">нс на выклік, лаг</text>
  <text x="520.0" y="328.0" text-anchor="end" class="f-label f-muted">n, лікаў double за выклік, лаг</text>
</svg>
<figcaption>Сума квадратаў n лікаў double, адзін выклік. Ніводная лінія wasm не апускаецца ніжэй за JS з var.</figcaption>
</figure>

Такога аб'ёму няма. З 13 значэнняў n ад 1 да 4096 wasm ні разу не абагнаў JS з `var`: 9,5 нс супраць 1,6 на адным элеменце і 4023 супраць 3992 на 4096. З 1024 элементаў роскіды па працэсах ужо перакрываюцца. У абодвух выходзіць каля 1 нс на элемент, падазраю ланцужок складанняў double. Калі масіў трэба спачатку скапіраваць у памяць wasm, на 4096 элементах гэта 4726 нс. З `let` карціна іншая: 97 166 нс на 4096 элементах і wasm выйграе з першага. Без `--trace-opt` я б апублікаваў менавіта яе.

## Кампіляцыя і памер

`new WebAssembly.Module` кампілюе ўсё да першага выкліку, у кожным працэсе я засякаў адну такую кампіляцыю. Модуль з 2 функцый і 390 байтаў займае 0,74 мс. На 2000 функцый і 364 кБ ідзе 120 мс, прыкладна 60 мкс на функцыю. Адзін толькі `WebAssembly.validate` на вялікім модулі каштуе 3,2 мс.

6 функцый на JS гэта 1400 байтаў, у wasm 710. Пасля gzip 610 супраць 441. JS у мяне не сціснуты, без прабелаў гэта 962 байты і 523 пасля gzip. Праверак межаў памяці я не ўбачыў: з `--wasm_no_bounds_checks` рэшата займае 21,9 мс замест 23,3 і роскіды па працэсах перакрываюцца. Чакаў я 10%.

## Чаго я не правяраў

Ні emscripten, ні браўзераў, толькі Node на адной машыне. Мой wasm напісаны ўручную, сапраўдны кампілятар з Мандэльбротам, пэўна, справіўся б лепш. Патокавай загрузкі і росту памяці тут няма. Адмова ад `let` гэта ўласцівасць цяперашняга канвеера V8 і ў наступных выпусках восьмай галіны яна можа знікнуць. Сам V8 5.9 я не глядзеў, толькі пару яго ключоў у 5.8.

Генератар сваіх 103 байтаў у wasm, па-мойму, варты. Цыкл Мандэльброта я пакінуў бы на JS, але спачатку запусціў бы `--trace-opt`.
