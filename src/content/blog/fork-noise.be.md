---
title: "У README я напісаў, што гэтаму замеру патрэбная розніца ў 2 разы, каб нешта ўбачыць. Калі яму далі вядомую затрымку, ён убачыў 3%"
description: "У README свайго замеру папярэдняга прагляду я напісаў, што харнэс не адрозніць 2 стратэгіі ў межах двухразовай розніцы. Я даў яму актыўнае чаканне вядомага памеру на PostgreSQL 16.14 і OpenJDK 21: 10 JVM на затрымку, па 300 пар. Парна ўнутры адной JVM ён убачыў 25 мкс на 800 (3%) у 10 JVM з 10, хоць медыяны JVM разыходзіліся на трэць. Параўнанне 2 асобных прагонаў дало правільны знак затрымкі 100 мкс у 68 выпадках з 90, а парадак блокамі з першай версіі назваў блок, павольнейшы на 50 мкс, хутчэйшым у 7 JVM з 10."
date: 2026-09-14
lang: be
translationKey: fork-noise
tags: ["performance", "statistics"]
---
У жніўні я памераў, колькі каштуе жывы папярэдні прагляд, калі будаваць яго на адкаце транзакцыі. Харнэс я выклаў на GitHub як [`preview-cost`](https://github.com/dimhold/preview-cost). На 4500 парах адкат кожны раз прайграваў копіі ў памяці, медыянная розніца выйшла ад 6 да 7 мс. У README я напісаў яшчэ і абзац пра шум. На 40 планах медыяны 5 асобных JVM разышліся ад 5,43 да 7,79 мс на аднолькавых уваходных даных. Адсюль я вывеў, што калі б 2 стратэгіі былі "within 2× of each other, this harness could not have told them apart". Гэта значыць, што ў межах розніцы ў 2 разы харнэс не адрозніў бы іх. Тая ж фраза дадавала, што не адрозніў бы іх і адзін прагон у кагосьці іншага.

Фраза мне падабалася, бо гучала сціпла. Я яе ні разу не правяраў. Гэта сцверджанне пра тое, што харнэс здольны ўбачыць. Такое можна памераць, калі даць харнэсу эфект, памер якога я ведаю загадзя.

## Затрымка вядомага памеру

У кожнай пары адно і тое ж прэв'ю з адкатам з рэпазіторыя выконваецца двойчы. Другому запуску зверху дададзена актыўнае чаканне, `Thread.onSpinWait()` да таго часу, пакуль `System.nanoTime()` не пройдзе зададзены тэрмін. Значыць ён каштуе на `d` мікрасекунд даражэй, плюс некалькі дзясяткаў нанасекунд. Я перабраў 8 значэнняў `d` ад 0 да 500 мкс. На кожнае прыйшлося 10 свежых JVM па 300 пар у кожнай, пасля 80 пар разагрэву. Унутры JVM прэв'ю без затрымкі і прэв'ю з затрымкай мяняюцца месцамі выпадкова ў кожнай пары, як у зыходным `Bench`.

На гэты раз замер ішоў на PostgreSQL 16.14, усталяваным лакальна, а не ў Docker, на OpenJDK 21.0.12.1 у віртуальнай машыне з 4 vCPU. Рэпазіторый просіць у Gradle JDK 25, але патрэбныя мне класы не выкарыстоўваюць нічога навейшага за records і text blocks, таму я сабраў іх звычайным `javac` разам з новым раннерам. У гэтай канфігурацыі прэв'ю з адкатам каштуе ад 0,7 да 1,1 мс замест 6,5. Зыходнае параўнанне застаецца ў сіле: адкат быў павольнейшы ў 2998 парах з 3000.

Раскід таксама вярнуўся. Пры `d = 0` абодва прэв'ю ў пары аднолькавыя і медыяны 10 JVM ляжалі ў межах ад 746 да 1005 мкс. Гэта трэць велічыні для адной і той жа каманды на адной і той жа машыне. У зыходным параўнанні копія ў памяці дала ў адной JVM 278 мкс, а ў астатніх 9 трымалася паміж 77 і 102.

<figure class="fig">
<svg viewBox="0 0 640 272" role="img" aria-label="Дзве панэлі, па радку на JVM, 10 радкоў. Злева медыяна прэв'ю з адкатам без затрымкі ў кожнай JVM, ад 743 да 956 мікрасекунд. Справа медыяна парных розніц з 95% інтэрвалам, ад 8 да 52 мікрасекунд, усе інтэрвалы вышэй за нуль, вакол пункціру на сапраўдных 25.">
  <text x="40" y="22" class="f-mono f-muted" style="font-size:11px">медыяна без затрымкі, мкс</text>
  <text x="380" y="22" class="f-mono f-muted" style="font-size:11px">парная розніца, мкс</text>
  <line x1="40" y1="38" x2="40" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="40" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">700</text>
  <line x1="136.66666666666666" y1="38" x2="136.66666666666666" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="136.66666666666666" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="233.33333333333331" y1="38" x2="233.33333333333331" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="233.33333333333331" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">900</text>
  <line x1="330" y1="38" x2="330" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="330" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <line x1="412.85714285714283" y1="38" x2="412.85714285714283" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="412.85714285714283" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="495" y1="38" x2="495" y2="244" class="f-line" style="stroke-dasharray:4 3;stroke:var(--accent)"/>
  <text x="495" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="577.1428571428571" y1="38" x2="577.1428571428571" y2="244" class="f-line" style="opacity:0.35"/>
  <text x="577.1428571428571" y="262" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="499" y="34" class="f-mono f-accent" style="font-size:11px">насамрэч +25</text>
  <circle cx="81.1" cy="46" r="4.5" style="fill:var(--ink)"/>
  <line x1="470.9" y1="46" x2="535.9" y2="46" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="506.5" cy="46" r="4" style="fill:var(--accent)"/>
  <circle cx="112.1" cy="66" r="4.5" style="fill:var(--ink)"/>
  <line x1="462.2" y1="66" x2="525.0" y2="66" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="496.4" cy="66" r="4" style="fill:var(--accent)"/>
  <circle cx="112.6" cy="86" r="4.5" style="fill:var(--ink)"/>
  <line x1="448.6" y1="86" x2="552.3" y2="86" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="498.3" cy="86" r="4" style="fill:var(--accent)"/>
  <circle cx="129.9" cy="106" r="4.5" style="fill:var(--ink)"/>
  <line x1="459.7" y1="106" x2="533.9" y2="106" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="487.8" cy="106" r="4" style="fill:var(--accent)"/>
  <circle cx="148.9" cy="126" r="4.5" style="fill:var(--ink)"/>
  <line x1="460.3" y1="126" x2="523.8" y2="126" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="492.7" cy="126" r="4" style="fill:var(--accent)"/>
  <circle cx="149.2" cy="146" r="4.5" style="fill:var(--ink)"/>
  <line x1="452.6" y1="146" x2="581.2" y2="146" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="505.9" cy="146" r="4" style="fill:var(--accent)"/>
  <circle cx="181.7" cy="166" r="4.5" style="fill:var(--ink)"/>
  <line x1="441.6" y1="166" x2="522.0" y2="166" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="480.5" cy="166" r="4" style="fill:var(--accent)"/>
  <circle cx="223.5" cy="186" r="4.5" style="fill:var(--ink)"/>
  <line x1="468.4" y1="186" x2="578.0" y2="186" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="523.1" cy="186" r="4" style="fill:var(--accent)"/>
  <circle cx="256.5" cy="206" r="4.5" style="fill:var(--ink)"/>
  <line x1="463.1" y1="206" x2="512.1" y2="206" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="484.8" cy="206" r="4" style="fill:var(--accent)"/>
  <circle cx="287.5" cy="226" r="4.5" style="fill:var(--ink)"/>
  <line x1="439.5" y1="226" x2="530.2" y2="226" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="490.2" cy="226" r="4" style="fill:var(--accent)"/>
</svg>
<figcaption>Прэв'ю з затрымкай павольнейшае на 25 мкс па пабудове. У медыяне прэв'ю без затрымкі JVM разыходзяцца прыкладна на 210 мкс, але ў кожнай з іх пары кладуць розніцу вышэй за нуль.</figcaption>
</figure>

## Што бачыць адна JVM

Для кожнай JVM я ўзяў розніцы ўнутры пар і інтэрвал бутстрэпу для іх медыяны, 2000 перавыбарак. Затрымку я лічу ўбачанай, калі ўвесь інтэрвал ляжыць вышэй за нуль.

| сапраўдная затрымка | JVM, якія яе ўбачылі | усе 3000 пар, медыяна і 95% інтэрвал |
|---|---|---|
| 0 мкс | 0 з 10 | 0,6 мкс [−3,1; 3,7] |
| 5 мкс | 3 з 10 | 8,1 мкс [5,1; 11,1] |
| 10 мкс | 6 з 10 | 12,2 мкс [8,1; 15,3] |
| 25 мкс | 10 з 10 | 25,0 мкс [21,5; 28,7] |

25 мкс паверх прыкладна 800 гэта 3% і ўсе 10 JVM яе знайшлі. Медыяны прэв'ю без затрымкі ў тых жа JVM разыходзіліся прыкладна на 210 мкс. Ні пры адной затрымцы ні ў адной JVM увесь інтэрвал не апынуўся ніжэй за нуль, уключна з прагонам A/A. Значыць для гэтага харнэса мая фраза была прыкладна ў 30 разоў асцярожнейшая, чым трэба: розніца ў 2 разы супраць 3%.

Тлумачыць гэта тое, што замеры ідуць парамі. Ад JVM да JVM медыяна прэв'ю без затрымкі і медыяна прэв'ю з затрымкай рухаюцца разам. Карэляцыя ад 0,95 да 0,996, у залежнасці ад затрымкі. Мая здагадка такая: тое, што робіць адну JVM павольнейшай, аплачваюць абедзве паловы пары, таму ў розніцы большая частка гэтага скарачаецца.

## Дзе фраза правільная

Правільная яе другая палова і яна апісвае іншую працэдуру. Гэтую працэдуру я і сам выкарыстоўваю часцей за ўсё: запусціў, нешта змяніў, запусціў яшчэ раз, параўнаў 2 медыяны. Я змадэляваў яе так: медыяна без затрымкі з адной JVM, медыяна з затрымкай з іншай. 10 JVM даюць 90 такіх спалучэнняў.

<figure class="fig">
<svg viewBox="0 0 640 154" role="img" aria-label="Сетка з 3 радкоў і 8 калонак для сапраўдных затрымак 0, 5, 10, 25, 50, 100, 250 і 500 мікрасекунд. У кожнай клетцы сказана, як часта спосаб назваў прэв'ю з затрымкай павольнейшым. Парна ў адной JVM, з 10: 0, 3, 6, 10, 10, 10, 10, 10. 2 асобныя прагоны, з 90: 47, 50, 46, 52, 62, 68, 90, 90. Блокамі ў адной JVM, з 10: 2, 3, 0, 4, 3, 6, 10, 10. На затрымцы 0 любы адказ памылковы.">
  <text x="170" y="18" class="f-mono f-muted" style="font-size:11px">сапраўдная затрымка, мкс</text>
  <text x="198" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="254" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">5</text>
  <text x="310" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10</text>
  <text x="366" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">25</text>
  <text x="422" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50</text>
  <text x="478" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">100</text>
  <text x="534" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">250</text>
  <text x="590" y="36" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">500</text>
  <text x="160" y="65" text-anchor="end" class="f-mono f-ink" style="font-size:11px">парна, адна JVM</text>
  <rect x="172" y="46" width="52" height="30" style="fill:var(--muted);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="228" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="340" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="396" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="452" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="508" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="46" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <text x="160" y="99" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 асобныя прагоны</text>
  <rect x="172" y="80" width="52" height="30" style="fill:var(--muted);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">47/90</text>
  <rect x="228" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.34;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">50/90</text>
  <rect x="284" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.32;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">46/90</text>
  <rect x="340" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.35;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">52/90</text>
  <rect x="396" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.40;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">62/90</text>
  <rect x="452" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.44;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">68/90</text>
  <rect x="508" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <rect x="564" y="80" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="99" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">90/90</text>
  <text x="160" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">блокамі, адна JVM</text>
  <rect x="172" y="114" width="52" height="30" style="fill:var(--muted);fill-opacity:0.16;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="198" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">2/10</text>
  <rect x="228" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="254" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="284" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.06;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="310" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0/10</text>
  <rect x="340" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.26;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="366" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">4/10</text>
  <rect x="396" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.21;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="422" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3/10</text>
  <rect x="452" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.36;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="478" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">6/10</text>
  <rect x="508" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="534" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
  <rect x="564" y="114" width="52" height="30" style="fill:var(--accent);fill-opacity:0.56;stroke:var(--muted);stroke-opacity:0.4"/>
  <text x="590" y="133" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">10/10</text>
</svg>
<figcaption>Як часта кожны спосаб сказаў, што прэв'ю з затрымкай павольнейшае. Парны лік залічвае JVM, толькі калі ўвесь 95% інтэрвал вышэй за нуль; 2 іншыя радкі лічаць знак розніцы медыян. На 0 мкс абодва прэв'ю аднолькавыя і любы лік гэта памылковы адказ.</figcaption>
</figure>

На 100 мкс, гэта 12% велічыні, правільны знак далі 68 параўнанняў з 90. Іх ацэнкі былі ад −157 да +385 мкс. На 50 мкс выйшла 62 з 90, а зусім без затрымкі 47 з 90 сказалі, што другое прэв'ю павольнейшае. Толькі на 250 мкс, блізка да раскіду паміж JVM, усе 90 паказалі ў правільны бок.

## Першая версія

Першая версія харнэса мерала спачатку ўсе прэв'ю з адкатам, потым усе прэв'ю ў памяці, унутры адной JVM. Я выклаў яе гістом 14 жніўня з адной медыянай на канфігурацыю: 4,85; 4,96 і 7,79 мс. Менш чым праз 2 гадзіны я замяніў яе парнай, бо ведаў, што парадак блокамі няправільны ў прынцыпе. Наколькі няправільны, я не ведаў, таму прагнаў і такі парадак. Мой раннер пакідае разагрэў новай версіі, так што ён паўтарае парадак старой, але не яе цалкам.

У выпадку A/A другі блок выйшаў хутчэйшым за першы ў 8 JVM з 10, на велічыню ад 119 да 173 мкс. У астатніх 2 ён быў павольнейшы на 10 і 16. З сапраўднай затрымкай 50 мкс на другім блоку 7 JVM з 10 назвалі яго хутчэйшым. На 100 мкс такіх было 4 з 10. Аддзяліць парадак ад часу, які JVM ужо паспела адпрацаваць, я не магу: у гэтай схеме гэта адно і тое ж. Побач з жнівеньскімі 6 мс зрушэнне такога памеру нічога б не змяніла, але ў той канфігурацыі я яго не мераў.

## Чаго я не правяраў

Я не ведаю, чаму JVM разыходзяцца на трэць. Я не глядзеў логі JIT і не глядзеў, што яшчэ круціцца на гэтай віртуальнай машыне. Ёсць і дробязь, якую я не магу растлумачыць. На 250 і 500 мкс ацэнка па ўсіх парах разам 244,7 і 488,5 і ніводны інтэрвал не даходзіць да сапраўднага значэння. Актыўнае чаканне не можа скончыцца раней за тэрмін, значыць частка розніцы губляецца дзесьці ў іншым месцы. Мой раннер не запісвае, якое прэв'ю ішло першым, таму сказаць, дзе менавіта, я не магу. На 5 мкс ацэнка 8,1. Гэта вышэй за сапраўднае значэнне і гэта я таксама растлумачыць не магу. Усе лічбы атрыманыя за адзін праход па сетцы, а не медыянай некалькіх праходаў.

Як метад усё гэта не новае. Georges, Buytaert і Eeckhout у 2007 годзе прапаноўвалі інтэрвалы па некалькіх запусках VM. Kalibera і Jones у 2013 годзе палічылі, колькі паўтораў трэба на кожным узроўні. А праверыў я толькі сваю фразу на сваім кодзе. Калі б я пісаў гэты радок README сёння, ён быў бы пра 2 асобныя прагоны. У гэтай канфігурацыі яны не адрознілі б варыянты, якія разыходзяцца менш чым на 30%. Унутры адной JVM хапіла 25 мкс.
