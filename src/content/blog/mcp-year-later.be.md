---
title: "85% пакетаў MCP у npm замоўклі, у новых CLI доля такая самая"
description: "Я ўзяў 17 724 імёны npm са словам mcp, якія з'явіліся за год пасля анонсу, і параўнаў іх з новымі CLI і выпадковымі імёнамі. 90 дзён маўчаць 85,4% пакетаў, у CLI 84,8%. У аднаго маўклівага пакета 203 821 спампоўванне за лістапад, у 11 архіўных эталонных сервераў 495 386."
date: 2025-12-07
lang: be
translationKey: mcp-year-later
tags: ["open-data", "dependencies", "agents"]
---

Першы радок маёй табліцы пакетаў MCP гэта `@expo/mcp-tunnel`, 5 482 633 спампоўванні за лістапад. Раней я пра яго не чуў. `@expo/cli` узяў яго ў залежнасці ў версіі 54.0.6 ад 16 верасня, а ў 54.0.17 ад 4 снежня яго ўжо няма. Другім ідзе `@playwright/mcp` з 3 298 211 спампоўваннямі, яго я і чакаў. Трэці, `@orval/mcp` з 1 484 239, таксама прыязджае залежнасцю, на гэты раз разам з генератарам API-кліентаў orval.

MCP абвясцілі 25 лістапада 2024 года. Для мяне MCP у npm быў могілкамі: чалавек за вечар публікуе сервер і больш да яго не вяртаецца. Ніякага ліку за гэтай думкай не стаяла, параўноўваць таксама не было з чым. Я і кожны іншы пакет ацэньваю так: гляджу на дату апошняй публікацыі і на спампоўванні і па іх вырашаю, жывы ён ці не.

Лічылі і да мяне. У чэрвені Hasan з суаўтарамі разабралі 1899 адкрытых сервераў MCP, у верасні Guo з суаўтарамі сабралі 17 630 запісаў з 6 пляцовак і больш за палову праектаў назвалі непрацоўнымі або малакаштоўнымі. Кантрольнай групы са звычайных пакетаў у анатацыях абедзвюх прац няма, а мне хацелася паставіць побач менавіта яе.

## Што я палічыў

Я ўзяў 2 здымкі ўсіх імёнаў npm з `all-the-package-names`: 2.0.1880 ад 25 лістапада 2024 года і 2.0.2287 ад 6 снежня 2025. Імёнаў, якія ёсць толькі ў другім здымку і маюць `mcp` асобным словам, знайшлося 17 724. Для кожнага я прачытаў дакумент з рэестра і выкінуў усё, што адбылося пасля 6 снежня. Па 1028 імёнах чытаць ужо не было чаго, пакет выдалены або зняты з публікацыі. Яшчэ ў некалькіх да гэтай даты не было ніводнай версіі, у выніку засталося 16 657.

Для кантролю ўзяў 2000 выпадковых новых імёнаў са словам `cli` і яшчэ 2000 выпадковых новых імёнаў без гэтай умовы, за той жа год і па тых жа правілах, прыдатныя з іх 1771 і 1754. Азначэнні запісаў да спампоўвання. Маўклівым лічу пакет, якому не менш за 90 дзён і ў якога за апошнія 90 дзён не было публікацый. Гэта яшчэ не значыць мёртвы: закончанай утыліце новыя версіі не патрэбныя, а звонку закончанае ад кінутага я не адрозню.

Перад тым як лічыць долі, я прыбраў скоўпы, у якіх 100 пакетаў і больш, гэтую мяжу выбраў ужо пасля першага погляду на даныя. У `@iflow-mcp` 1518 пакетаў, 162 з іх упершыню выйшлі ў адзін дзень, 28 кастрычніка. У `@mseep` 567, у 96,3% роўна адна версія. І яшчэ 180 у `@fastmcp-me`. З гэтых 2265 пакетаў 1417 маюць цёзку, пакет з тым самым імем па-за гэтымі 3 скоўпамі, так што пераважна гэта, відаць, нанова выкладзеныя копіі. Разам яны даюць 13,6% усяго, што выклалі з `mcp` у імені.

## Могілкі самыя звычайныя

Без гэтых скоўпаў пакетаў не маладзейшых за 90 дзён 10 121, маўчаць 8642. Кантрольныя групы ўзважаныя па тых жа месяцах нараджэння, бо ў сакавіцкага пакета было больш часу замоўкнуць, чым у жнівеньскага.

| | mcp | cli | выпадковыя |
|---|---|---|---|
| апошняя публікацыя ў межах сутак ад першай | 53,1% | 53,6% | 51,3% |
| маўчаць 90 дзён | 85,4% | 84,8% | 78,4% |
| публікаваліся за апошнія 30 дзён | 6,4% | 6,9% | 10,6% |

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля пакетаў, у якіх апошняя публікацыя адбылася пазней за пазначаную колькасць дзён пасля першай, для пакетаў не маладзейшых за 180 дзён. Праз 1 дзень: mcp 48,5%, cli 47,0%, выпадковыя імёны 48,6%. Праз 60 дзён: 19,9%, 18,9%, 26,4%. Праз 180 дзён: 8,2%, 9,8%, 14,7%. Лініі mcp і cli амаль супадаюць, выпадковыя імёны трымаюцца вышэй.">
  <line x1="56.0" y1="240.0" x2="570.0" y2="240.0" class="f-plain"/>
  <text x="48.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56.0" y1="187.5" x2="570.0" y2="187.5" class="f-plain"/>
  <text x="48.0" y="191.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="56.0" y1="135.0" x2="570.0" y2="135.0" class="f-plain"/>
  <text x="48.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="56.0" y1="82.5" x2="570.0" y2="82.5" class="f-plain"/>
  <text x="48.0" y="86.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="56.0" y1="30.0" x2="570.0" y2="30.0" class="f-plain"/>
  <text x="48.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="56.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="141.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <text x="227.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="313.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <text x="398.7" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="484.3" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="570.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <polyline points="56.0,57.6 56.1,85.9 58.9,112.4 61.7,121.1 64.6,124.5 70.3,133.4 76.0,139.5 84.6,144.7 96.0,150.5 116.0,157.1 141.7,160.5 184.5,164.9 227.3,170.7 270.2,174.6 313.0,177.5 355.8,180.7 398.7,184.3 441.5,188.3 484.3,191.7 527.2,195.6 570.0,201.4" style="fill:none;stroke:var(--muted);stroke-width:1.6"/>
  <polyline points="56.0,46.8 56.1,84.6 58.9,116.6 61.7,130.0 64.6,136.1 70.3,145.0 76.0,149.2 84.6,154.9 96.0,161.8 116.0,168.1 141.7,173.1 184.5,183.8 227.3,190.4 270.2,194.1 313.0,197.7 355.8,200.1 398.7,202.2 441.5,205.3 484.3,208.5 527.2,210.6 570.0,214.3" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 3"/>
  <polyline points="56.0,37.1 56.1,75.7 58.9,112.7 61.7,124.2 64.6,131.3 70.3,139.5 76.0,146.3 84.6,152.1 96.0,158.6 116.0,166.8 141.7,173.6 184.5,181.7 227.3,187.8 270.2,192.5 313.0,196.9 355.8,201.2 398.7,204.6 441.5,208.5 484.3,211.1 527.2,215.1 570.0,218.5" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="578.0" y="187.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">выпадковыя</text>
  <text x="578.0" y="201.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">14,7%</text>
  <text x="578.0" y="216.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">cli 9,8%</text>
  <text x="578.0" y="232.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">mcp 8,2%</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">публікаваліся пазней, %</text>
  <text x="570.0" y="276.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">дзён ад першай версіі</text>
</svg>
<figcaption>Колькі пакетаў яшчэ публікавалі пасля пазначанага дня. Толькі пакеты не маладзейшыя за 180 дзён: 5175 mcp без 3 масавых скоўпаў, 800 cli, 866 выпадковых. Узважвання па месяцах нараджэння тут няма.</figcaption>
</figure>

Я чакаў, што MCP будзе прыкметна горшы. Розніцы з CLI няма: бутстрэп дае для долі маўклівых CLI інтэрвал ад 82,5% да 87,0%. Выпадковыя імёны замаўкаюць радзей, у іх ад 76,0% да 80,7%, але CLI адстаяць ад іх гэтак жа. Мяжа для скоўпаў мала што мяняе: калі прыбраць скоўпы ад 100 новых імёнаў з усіх 3 груп, выйдзе 85,4%, 84,8% і 79,0%. Мяркую, што маленькі інструмент гэтак жа хутка замаўкае з любым ключавым словам.

Са спампоўваннямі ў MCP нават крыху лепш. Медыяна за лістапад у пакетаў без скоўпа 18, а ў CLI і ў выпадковых імёнаў па 8, тут ужо без узважвання па месяцах. У маўклівых пакетаў MCP з адзінай версіяй медыяна 4, так што вялікага сэнсу ў гэтых 18 я б не шукаў. На 1% такіх пакетаў, гэта значыць на 76 з 7603, прыпадае 84,4% іх спампоўванняў.

## Маўклівы пакет з 203 821 спампоўваннем

Для слова "ўзляцеў" у мяне быў запісаны парог, 10 000 спампоўванняў за лістапад. Такіх пакетаў я знайшоў 119, з іх 105 не маладзейшыя за 90 дзён і 29 з гэтых 105 маўчаць. Тут парог і зламаўся. Высока ў табліцы стаіць `n8n-nodes-mcp-client`, 203 821 спампоўванне. Усе 18 яго версій выйшлі 16 і 17 мая, а ў ліпені яго спампавалі 3071 раз.

<figure class="fig">
<svg viewBox="0 0 680 342" role="img" aria-label="Спампоўванні па днях з 1 кастрычніка па 6 снежня 2025 года. n8n-nodes-mcp-client кожны дзень да 17 лістапада трымаецца паміж 11 183 і 11 908, а 19 лістапада падае да 184. use-mcp у будні даходзіць да 8573, а ў большасць выхадных правальваецца да некалькіх соцень.">
  <line x1="64.0" y1="148.0" x2="664.0" y2="148.0" class="f-plain"/>
  <text x="56.0" y="152.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="93.0" x2="664.0" y2="93.0" class="f-plain"/>
  <text x="56.0" y="97.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6000</text>
  <line x1="64.0" y1="38.0" x2="664.0" y2="38.0" class="f-plain"/>
  <text x="56.0" y="42.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">12 000</text>
  <rect x="65.0" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="74.0" y="41.5" width="7.0" height="106.5" style="fill:var(--accent);stroke:none"/>
  <rect x="82.9" y="42.5" width="7.0" height="105.5" style="fill:var(--accent);stroke:none"/>
  <rect x="91.9" y="39.9" width="7.0" height="108.1" style="fill:var(--muted);stroke:none"/>
  <rect x="100.8" y="41.3" width="7.0" height="106.7" style="fill:var(--muted);stroke:none"/>
  <rect x="109.8" y="42.1" width="7.0" height="105.9" style="fill:var(--accent);stroke:none"/>
  <rect x="118.7" y="42.8" width="7.0" height="105.2" style="fill:var(--accent);stroke:none"/>
  <rect x="127.7" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="136.6" y="42.1" width="7.0" height="105.9" style="fill:var(--accent);stroke:none"/>
  <rect x="145.6" y="41.9" width="7.0" height="106.1" style="fill:var(--accent);stroke:none"/>
  <rect x="154.6" y="41.4" width="7.0" height="106.6" style="fill:var(--muted);stroke:none"/>
  <rect x="163.5" y="41.9" width="7.0" height="106.1" style="fill:var(--muted);stroke:none"/>
  <rect x="172.5" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="181.4" y="42.6" width="7.0" height="105.4" style="fill:var(--accent);stroke:none"/>
  <rect x="190.4" y="45.5" width="7.0" height="102.5" style="fill:var(--accent);stroke:none"/>
  <rect x="199.3" y="43.5" width="7.0" height="104.5" style="fill:var(--accent);stroke:none"/>
  <rect x="208.3" y="43.7" width="7.0" height="104.3" style="fill:var(--accent);stroke:none"/>
  <rect x="217.2" y="41.7" width="7.0" height="106.3" style="fill:var(--muted);stroke:none"/>
  <rect x="226.2" y="41.0" width="7.0" height="107.0" style="fill:var(--muted);stroke:none"/>
  <rect x="235.1" y="41.2" width="7.0" height="106.8" style="fill:var(--accent);stroke:none"/>
  <rect x="244.1" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="253.1" y="42.2" width="7.0" height="105.8" style="fill:var(--accent);stroke:none"/>
  <rect x="262.0" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="271.0" y="41.3" width="7.0" height="106.7" style="fill:var(--accent);stroke:none"/>
  <rect x="279.9" y="41.1" width="7.0" height="106.9" style="fill:var(--muted);stroke:none"/>
  <rect x="288.9" y="40.6" width="7.0" height="107.4" style="fill:var(--muted);stroke:none"/>
  <rect x="297.8" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="306.8" y="41.0" width="7.0" height="107.0" style="fill:var(--accent);stroke:none"/>
  <rect x="315.7" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="324.7" y="41.6" width="7.0" height="106.4" style="fill:var(--accent);stroke:none"/>
  <rect x="333.7" y="41.7" width="7.0" height="106.3" style="fill:var(--accent);stroke:none"/>
  <rect x="342.6" y="41.3" width="7.0" height="106.7" style="fill:var(--muted);stroke:none"/>
  <rect x="351.6" y="41.8" width="7.0" height="106.2" style="fill:var(--muted);stroke:none"/>
  <rect x="360.5" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="369.5" y="42.4" width="7.0" height="105.6" style="fill:var(--accent);stroke:none"/>
  <rect x="378.4" y="42.0" width="7.0" height="106.0" style="fill:var(--accent);stroke:none"/>
  <rect x="387.4" y="41.8" width="7.0" height="106.2" style="fill:var(--accent);stroke:none"/>
  <rect x="396.3" y="42.4" width="7.0" height="105.6" style="fill:var(--accent);stroke:none"/>
  <rect x="405.3" y="41.4" width="7.0" height="106.6" style="fill:var(--muted);stroke:none"/>
  <rect x="414.3" y="41.2" width="7.0" height="106.8" style="fill:var(--muted);stroke:none"/>
  <rect x="423.2" y="42.5" width="7.0" height="105.5" style="fill:var(--accent);stroke:none"/>
  <rect x="432.2" y="42.3" width="7.0" height="105.7" style="fill:var(--accent);stroke:none"/>
  <rect x="441.1" y="41.0" width="7.0" height="107.0" style="fill:var(--accent);stroke:none"/>
  <rect x="450.1" y="40.1" width="7.0" height="107.9" style="fill:var(--accent);stroke:none"/>
  <rect x="459.0" y="40.9" width="7.0" height="107.1" style="fill:var(--accent);stroke:none"/>
  <rect x="468.0" y="39.2" width="7.0" height="108.8" style="fill:var(--muted);stroke:none"/>
  <rect x="476.9" y="38.8" width="7.0" height="109.2" style="fill:var(--muted);stroke:none"/>
  <rect x="485.9" y="39.8" width="7.0" height="108.2" style="fill:var(--accent);stroke:none"/>
  <rect x="494.9" y="116.4" width="7.0" height="31.6" style="fill:var(--accent);stroke:none"/>
  <rect x="503.8" y="146.3" width="7.0" height="1.7" style="fill:var(--accent);stroke:none"/>
  <rect x="512.8" y="146.4" width="7.0" height="1.6" style="fill:var(--accent);stroke:none"/>
  <rect x="521.7" y="145.2" width="7.0" height="2.8" style="fill:var(--accent);stroke:none"/>
  <rect x="530.7" y="145.4" width="7.0" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="539.6" y="145.6" width="7.0" height="2.4" style="fill:var(--muted);stroke:none"/>
  <rect x="548.6" y="146.1" width="7.0" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="557.5" y="146.3" width="7.0" height="1.7" style="fill:var(--accent);stroke:none"/>
  <rect x="566.5" y="146.7" width="7.0" height="1.3" style="fill:var(--accent);stroke:none"/>
  <rect x="575.4" y="146.1" width="7.0" height="1.9" style="fill:var(--accent);stroke:none"/>
  <rect x="584.4" y="146.8" width="7.0" height="1.2" style="fill:var(--accent);stroke:none"/>
  <rect x="593.4" y="146.8" width="7.0" height="1.2" style="fill:var(--muted);stroke:none"/>
  <rect x="602.3" y="146.8" width="7.0" height="1.2" style="fill:var(--muted);stroke:none"/>
  <rect x="611.3" y="147.3" width="7.0" height="0.7" style="fill:var(--accent);stroke:none"/>
  <rect x="620.2" y="147.4" width="7.0" height="0.6" style="fill:var(--accent);stroke:none"/>
  <rect x="629.2" y="147.5" width="7.0" height="0.5" style="fill:var(--accent);stroke:none"/>
  <rect x="638.1" y="147.4" width="7.0" height="0.6" style="fill:var(--accent);stroke:none"/>
  <rect x="647.1" y="147.7" width="7.0" height="0.3" style="fill:var(--accent);stroke:none"/>
  <rect x="656.0" y="147.6" width="7.0" height="0.4" style="fill:var(--muted);stroke:none"/>
  <text x="64.0" y="30.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">n8n-nodes-mcp-client</text>
  <text x="65.0" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 кас</text>
  <text x="342.6" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 ліс</text>
  <text x="611.3" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 сне</text>
  <line x1="64.0" y1="316.0" x2="664.0" y2="316.0" class="f-plain"/>
  <text x="56.0" y="320.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="261.0" x2="664.0" y2="261.0" class="f-plain"/>
  <text x="56.0" y="265.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6000</text>
  <line x1="64.0" y1="206.0" x2="664.0" y2="206.0" class="f-plain"/>
  <text x="56.0" y="210.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">12 000</text>
  <rect x="65.0" y="265.9" width="7.0" height="50.1" style="fill:var(--accent);stroke:none"/>
  <rect x="74.0" y="252.9" width="7.0" height="63.1" style="fill:var(--accent);stroke:none"/>
  <rect x="82.9" y="267.5" width="7.0" height="48.5" style="fill:var(--accent);stroke:none"/>
  <rect x="91.9" y="303.3" width="7.0" height="12.7" style="fill:var(--muted);stroke:none"/>
  <rect x="100.8" y="307.0" width="7.0" height="9.0" style="fill:var(--muted);stroke:none"/>
  <rect x="109.8" y="257.5" width="7.0" height="58.5" style="fill:var(--accent);stroke:none"/>
  <rect x="118.7" y="252.7" width="7.0" height="63.3" style="fill:var(--accent);stroke:none"/>
  <rect x="127.7" y="242.0" width="7.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="136.6" y="258.5" width="7.0" height="57.5" style="fill:var(--accent);stroke:none"/>
  <rect x="145.6" y="273.1" width="7.0" height="42.9" style="fill:var(--accent);stroke:none"/>
  <rect x="154.6" y="310.0" width="7.0" height="6.0" style="fill:var(--muted);stroke:none"/>
  <rect x="163.5" y="312.8" width="7.0" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="172.5" y="267.1" width="7.0" height="48.9" style="fill:var(--accent);stroke:none"/>
  <rect x="181.4" y="272.3" width="7.0" height="43.7" style="fill:var(--accent);stroke:none"/>
  <rect x="190.4" y="249.3" width="7.0" height="66.7" style="fill:var(--accent);stroke:none"/>
  <rect x="199.3" y="241.4" width="7.0" height="74.6" style="fill:var(--accent);stroke:none"/>
  <rect x="208.3" y="265.0" width="7.0" height="51.0" style="fill:var(--accent);stroke:none"/>
  <rect x="217.2" y="313.6" width="7.0" height="2.4" style="fill:var(--muted);stroke:none"/>
  <rect x="226.2" y="311.2" width="7.0" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="235.1" y="290.8" width="7.0" height="25.2" style="fill:var(--accent);stroke:none"/>
  <rect x="244.1" y="241.3" width="7.0" height="74.7" style="fill:var(--accent);stroke:none"/>
  <rect x="253.1" y="244.3" width="7.0" height="71.7" style="fill:var(--accent);stroke:none"/>
  <rect x="262.0" y="258.2" width="7.0" height="57.8" style="fill:var(--accent);stroke:none"/>
  <rect x="271.0" y="274.8" width="7.0" height="41.2" style="fill:var(--accent);stroke:none"/>
  <rect x="279.9" y="309.6" width="7.0" height="6.4" style="fill:var(--muted);stroke:none"/>
  <rect x="288.9" y="308.9" width="7.0" height="7.1" style="fill:var(--muted);stroke:none"/>
  <rect x="297.8" y="261.5" width="7.0" height="54.5" style="fill:var(--accent);stroke:none"/>
  <rect x="306.8" y="260.6" width="7.0" height="55.4" style="fill:var(--accent);stroke:none"/>
  <rect x="315.7" y="261.7" width="7.0" height="54.3" style="fill:var(--accent);stroke:none"/>
  <rect x="324.7" y="260.1" width="7.0" height="55.9" style="fill:var(--accent);stroke:none"/>
  <rect x="333.7" y="264.4" width="7.0" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="342.6" y="314.3" width="7.0" height="1.7" style="fill:var(--muted);stroke:none"/>
  <rect x="351.6" y="314.9" width="7.0" height="1.1" style="fill:var(--muted);stroke:none"/>
  <rect x="360.5" y="249.9" width="7.0" height="66.1" style="fill:var(--accent);stroke:none"/>
  <rect x="369.5" y="282.7" width="7.0" height="33.3" style="fill:var(--accent);stroke:none"/>
  <rect x="378.4" y="261.0" width="7.0" height="55.0" style="fill:var(--accent);stroke:none"/>
  <rect x="387.4" y="261.9" width="7.0" height="54.1" style="fill:var(--accent);stroke:none"/>
  <rect x="396.3" y="237.4" width="7.0" height="78.6" style="fill:var(--accent);stroke:none"/>
  <rect x="405.3" y="308.0" width="7.0" height="8.0" style="fill:var(--muted);stroke:none"/>
  <rect x="414.3" y="303.4" width="7.0" height="12.6" style="fill:var(--muted);stroke:none"/>
  <rect x="423.2" y="242.0" width="7.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="432.2" y="240.0" width="7.0" height="76.0" style="fill:var(--accent);stroke:none"/>
  <rect x="441.1" y="248.6" width="7.0" height="67.4" style="fill:var(--accent);stroke:none"/>
  <rect x="450.1" y="246.0" width="7.0" height="70.0" style="fill:var(--accent);stroke:none"/>
  <rect x="459.0" y="239.5" width="7.0" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="468.0" y="315.2" width="7.0" height="0.8" style="fill:var(--muted);stroke:none"/>
  <rect x="476.9" y="315.1" width="7.0" height="0.9" style="fill:var(--muted);stroke:none"/>
  <rect x="485.9" y="238.2" width="7.0" height="77.8" style="fill:var(--accent);stroke:none"/>
  <rect x="494.9" y="246.4" width="7.0" height="69.6" style="fill:var(--accent);stroke:none"/>
  <rect x="503.8" y="258.7" width="7.0" height="57.3" style="fill:var(--accent);stroke:none"/>
  <rect x="512.8" y="251.4" width="7.0" height="64.6" style="fill:var(--accent);stroke:none"/>
  <rect x="521.7" y="264.4" width="7.0" height="51.6" style="fill:var(--accent);stroke:none"/>
  <rect x="530.7" y="311.1" width="7.0" height="4.9" style="fill:var(--muted);stroke:none"/>
  <rect x="539.6" y="311.9" width="7.0" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="548.6" y="257.3" width="7.0" height="58.7" style="fill:var(--accent);stroke:none"/>
  <rect x="557.5" y="252.3" width="7.0" height="63.7" style="fill:var(--accent);stroke:none"/>
  <rect x="566.5" y="246.5" width="7.0" height="69.5" style="fill:var(--accent);stroke:none"/>
  <rect x="575.4" y="290.9" width="7.0" height="25.1" style="fill:var(--accent);stroke:none"/>
  <rect x="584.4" y="288.4" width="7.0" height="27.6" style="fill:var(--accent);stroke:none"/>
  <rect x="593.4" y="310.6" width="7.0" height="5.4" style="fill:var(--muted);stroke:none"/>
  <rect x="602.3" y="302.6" width="7.0" height="13.4" style="fill:var(--muted);stroke:none"/>
  <rect x="611.3" y="249.0" width="7.0" height="67.0" style="fill:var(--accent);stroke:none"/>
  <rect x="620.2" y="273.8" width="7.0" height="42.2" style="fill:var(--accent);stroke:none"/>
  <rect x="629.2" y="282.2" width="7.0" height="33.8" style="fill:var(--accent);stroke:none"/>
  <rect x="638.1" y="260.5" width="7.0" height="55.5" style="fill:var(--accent);stroke:none"/>
  <rect x="647.1" y="267.5" width="7.0" height="48.5" style="fill:var(--accent);stroke:none"/>
  <rect x="656.0" y="312.1" width="7.0" height="3.9" style="fill:var(--muted);stroke:none"/>
  <text x="64.0" y="198.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">use-mcp</text>
  <text x="65.0" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 кас</text>
  <text x="342.6" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 ліс</text>
  <text x="611.3" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 сне</text>
  <text x="664.0" y="14.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">спампоўванняў за дзень</text>
</svg>
<figcaption>2 маўклівыя пакеты, спампоўванні па днях з 1 кастрычніка па 6 снежня, выхадныя шэрыя. Першы апошні раз публікавалі 17 мая, другі 25 ліпеня.</figcaption>
</figure>

З 1 кастрычніка па 17 лістапада яго спампоўвалі ад 11 183 да 11 908 разоў кожны дзень, у выхадныя таксама. 19 лістапада яго спампавалі 184 разы. У `@mzxrai/mcp-webresearch`, які апошні раз публікавалі ў снежні 2024 года, з 1 кастрычніка па 10 лістапада было ад 4543 да 5851 за дзень, а 11 лістапада стала 27. Людзі так не спампоўваюць. Па-мойму, гэта некалькі машын, якія нехта выключыў, чые яны, я не ведаю.

З месячных сум было ясна толькі, што парог кепскі, таму я запісаў яшчэ 2 і толькі потым спампаваў рады па днях для ўсіх 119. Пакет трымае працоўны тыдзень, калі ў лістападзе сярэдні выхадны ў яго меншы за 0,7 сярэдняга будняга дня. Усплёск гэта калі 3 дні даюць больш за 40% месяца. З 29 маўклівых працоўны тыдзень трымаюць 17, усплёскаў 4, адзін пакет трапіў у абедзве групы. Затое ў `use-mcp`, які маўчыць з 25 ліпеня, 138 495 спампоўванняў і ясны тыднёвы рытм, падобна на людзей і іх CI. Па даце апошняй версіі я б яго пахаваў.

## У архіве і 495 386 за месяц

28 мая з'явіўся рэпазіторый `servers-archived` і 11 эталонных сервераў з npm апынуліся ў ім. У маі ў іх было 476 704 спампоўванні, у лістападзе 495 386, гэта 27,2% ад усіх эталонных. Тыя 4, што засталіся, выраслі з 402 245 да 1 325 856. У `server-postgres` апошняя версія ад 4 снежня 2024 года і ўсё роўна ён вырас з 78 653 да 100 059 за месяц. У 8 з 11 версія `@modelcontextprotocol/sdk` зафіксаваная на 1.0.1.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Спампоўванні эталонных сервераў з npm па месяцах, са снежня 2024 па лістапад 2025, у тысячах. 11 архіўных: 38, 33, 45, 312, 454, 477, 635, 615, 452, 493, 568, 495. 4 астатнія: 32, 34, 42, 239, 321, 402, 481, 862, 1221, 1545, 1398, 1326.">
  <line x1="64.0" y1="230.0" x2="560.0" y2="230.0" class="f-plain"/>
  <text x="56.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="64.0" y1="180.0" x2="560.0" y2="180.0" class="f-plain"/>
  <text x="56.0" y="184.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="64.0" y1="130.0" x2="560.0" y2="130.0" class="f-plain"/>
  <text x="56.0" y="134.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="64.0" y1="80.0" x2="560.0" y2="80.0" class="f-plain"/>
  <text x="56.0" y="84.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1200</text>
  <line x1="64.0" y1="30.0" x2="560.0" y2="30.0" class="f-plain"/>
  <text x="56.0" y="34.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1600</text>
  <text x="64.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">сне</text>
  <text x="154.2" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">лют</text>
  <text x="244.4" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кра</text>
  <text x="334.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">чэр</text>
  <text x="424.7" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">жні</text>
  <text x="514.9" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">кас</text>
  <line x1="307.5" y1="30.0" x2="307.5" y2="230.0" class="f-plain" style="stroke-dasharray:4 4"/>
  <polyline points="64.0,226.0 109.1,225.7 154.2,224.7 199.3,200.1 244.4,189.9 289.5,179.7 334.5,169.9 379.6,122.2 424.7,77.4 469.8,36.9 514.9,55.2 560.0,64.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="64.0,225.2 109.1,225.9 154.2,224.4 199.3,190.9 244.4,173.2 289.5,170.4 334.5,150.6 379.6,153.2 424.7,173.6 469.8,168.3 514.9,159.0 560.0,168.1" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="568.0" y="61.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4 астатнія</text>
  <text x="568.0" y="76.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 325 856</text>
  <text x="568.0" y="165.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11 архіўных</text>
  <text x="568.0" y="180.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">495 386</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">спампоўванняў за месяц, тыс.</text>
</svg>
<figcaption>Эталонныя серверы ў npm, спампоўванні па месяцах. Пункцір гэта 28 мая, калі з'явіўся архіўны рэпазіторый.</figcaption>
</figure>

Ёсць яшчэ афіцыйны рэестр, яго адкрылі ў верасні. У блогу MCP 25 лістапада напісалі, што ў ім амаль 2000 запісаў. API аддае мне 2019 запісаў, апублікаваных да гэтага дня, але запісам там лічыцца кожная версія, а розных імёнаў 884. На маю дату выходзіць 2457 і 987. 430 сервераў даступныя толькі праз сетку, пакета ў іх няма.

## Чаго я не правяраў

Тут толькі npm і толькі імёны са словам `mcp`, гэта значыць ні PyPI, ні вобразаў Docker, ні сервераў, якія ляжаць проста ў рэпазіторыі. API спампоўванняў аддае імёны са скоўпам па адным і абмяжоўвае частату запытаў, таму імёны без скоўпа ў мяне ўсе, а са скоўпам 568 выпадковых і яшчэ 400, якія пошук npm паказвае першымі. Значыць 119 гэта ацэнка знізу, а маўклівага пакета са скоўпам, які пошук хавае, сярод гэтых 29 можа не быць. Выдаленых пакетаў у долях няма, думаю, большасць з іх маўчала б. Узважванне па месяцах прыбірае розніцу ва ўзросце, але аўтараў і кампаніі я не падбіраў. І ніводнага сервера я не запусціў.
