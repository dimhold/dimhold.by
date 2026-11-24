---
title: "85% уваходных токенаў агента пайшло на адну шапку, якую адправілі 1253 разы"
description: "Я сабраў нанова ўсе промпты двух апублікаваных прагонаў агента ReAct і палічыў токены. У FEVER 84,9% уваходу гэта адна і тая ж шапка, паўторна адпраўленая гісторыя 13,3%. У WebShop слізгальнае акно згубіла задачу, а ў доўгім чаце gpt-4 абрэзка на мяжы кантэксту выйшла ў 7,9 раза даражэй за новы чат на кожную задачу."
date: 2023-04-02
lang: be
translationKey: agent-token-budget
tags: ["llm", "agents", "numbers"]
---

1 172 161 токен. Такі ўвесь уваход ноўтбука FEVER з рэпазіторыя ReAct, калі прагнаць tiktoken (cl100k_base) па кожным промпце: 500 сцверджанняў, 1253 выклікі. Потым я палічыў асобна шапку, гэта значыць радок інструкцыі і 3 разабраныя прыклады, якія цыкл ставіць у пачатак кожнага выкліку. На яе прыпала 994 882.

Кошт агента я заўсёды тлумачыў трохвугольнікам. Мадэль паміж выклікамі нічога не памятае, таму другі выклік наноў вязе першы крок, трэці першы і другі, а рахунак расце як квадрат колькасці крокаў. Малюнак правільны, але лікаў я ў яго ніколі не падстаўляў. Перад прагонам я запісаў чаканне: больш за палову ўваходу зойме гісторыя, якую адпраўляюць паўторна. Выйшла 13,3%.

Пра сам трохвугольнік усе ведаюць і лекі ад яго ўжо ёсць. У LangChain 0.0.128 адна памяць трымае апошнія 5 пар рэплік, другая пасля 2000 токенаў замяняе старыя паведамленні зводкай. Мне хацелася зразумець, колькі там увогуле можна адрэзаць.

## Што я лічыў

У рэпазіторыі ReAct (Yao з сааўтарамі, каміт 245c1aa ад 30 сакавіка) ляжаць логі двух агентаў, FEVER і WebShop, па 500 эпізодаў на `text-davinci-002`. У логу ёсць адказы мадэлі і адказы асяроддзя. Таму я сабраў кожны промпт нанова роўна так, як яго збірае код ноўтбука. API пры гэтым не выклікаў. Python 3.11, tiktoken 0.3.3.

У p50k_base па цяперашніх 0,02 долара за 1000 токенаў прагон FEVER каштуе 24,41 долара, WebShop 70,07. Для чат-мадэляў я палічыў тыя ж тэксты ў cl100k_base і дадаў 7 або 8 службовых токенаў на паведамленне, як гэта робіць OpenAI Cookbook. Цэны са старонкі тарыфаў гэтых дзён: gpt-4 8K 0,03 за ўваход і 0,06 за выхад, gpt-3.5-turbo 0,002 у абодва бакі. FEVER тады каштуе 37,76 або 2,44 долара. Сапраўдны gpt-4 напісаў бы іншыя думкі, так што гэта цана менавіта гэтага тэксту.

## Квадрату няма дзе вырасці

Няхай P гэта шапка, q задача, d тое, што дадае адзін крок. Тады n выклікаў вязуць n(P+q) + d·n(n−1)/2 токенаў. Другое складаемае даганяе першае пры n = 1 + 2(P+q)/d.

У FEVER P роўна 794, q 13, а паўторна адпраўлены крок d у сярэднім 152, атрымліваецца 11,6 выкліку. Цыкл у ноўтбуку спыняецца пасля 7 крокаў, а медыяннаму эпізоду хапае 2 выклікаў. Нават у 14 эпізодах, дзе выклікаў роўна 7, гісторыя займае 19,2% уваходу. У WebShop шапка карацейшая, 523 токены з адным прыкладам, задача 41 токен, крок у сярэднім 80. Перасячэнне на 15,1 выкліку, а цыкл абрываецца на 15. Там гісторыя за ўвесь прагон займае 36,2%. Шапка 59,2%.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Сярэдні памер аднаго выкліку ў токенах па нумары выкліку: шапка з задачай і паўторна адпраўленая гісторыя. FEVER: 1: 811 + 0; 2: 811 + 188; 3: 813 + 213; 4: 812 + 239; 5: 811 + 276; 6: 811 + 322; 7: 811 + 372. WebShop: 1: 563 + 0; 2: 563 + 188; 3: 563 + 234; 4: 563 + 372; 5: 563 + 421; 6: 563 + 451; 7: 563 + 475; 8: 563 + 508; 9: 563 + 551; 10: 563 + 587; 11: 563 + 633; 12: 563 + 681; 13: 563 + 717; 14: 563 + 764; 15: 563 + 791. Шапка ўсюды аднаго памеру, гісторыя становіцца большай за яе толькі з 10-га выкліку WebShop.">
  <line x1="60" y1="240.0" x2="260" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="188.6" x2="260" y2="188.6" class="f-plain"/>
  <text x="54.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="60" y1="137.1" x2="260" y2="137.1" class="f-plain"/>
  <text x="54.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="60" y1="85.7" x2="260" y2="85.7" class="f-plain"/>
  <text x="54.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1200</text>
  <rect x="64.6" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="74.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="93.1" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="93.1" y="111.6" width="19.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="102.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="121.7" y="135.5" width="19.4" height="104.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.7" y="108.1" width="19.4" height="27.4" style="fill:var(--accent);stroke:none"/>
  <text x="131.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="150.3" y="135.6" width="19.4" height="104.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="150.3" y="104.9" width="19.4" height="30.7" style="fill:var(--accent);stroke:none"/>
  <text x="160.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="178.9" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="178.9" y="100.2" width="19.4" height="35.5" style="fill:var(--accent);stroke:none"/>
  <text x="188.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="207.4" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.4" y="94.3" width="19.4" height="41.4" style="fill:var(--accent);stroke:none"/>
  <text x="217.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="236.0" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="236.0" y="87.9" width="19.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="245.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="60.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">FEVER</text>
  <line x1="330" y1="240.0" x2="670" y2="240.0" class="f-plain"/>
  <text x="324.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="330" y1="188.6" x2="670" y2="188.6" class="f-plain"/>
  <text x="324.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="330" y1="137.1" x2="670" y2="137.1" class="f-plain"/>
  <text x="324.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="330" y1="85.7" x2="670" y2="85.7" class="f-plain"/>
  <text x="324.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1200</text>
  <rect x="333.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="341.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="356.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.3" y="143.4" width="15.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="364.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="379.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="379.0" y="137.5" width="15.4" height="30.1" style="fill:var(--accent);stroke:none"/>
  <text x="386.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="401.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="401.6" y="119.8" width="15.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="409.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="424.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="424.3" y="113.5" width="15.4" height="54.1" style="fill:var(--accent);stroke:none"/>
  <text x="432.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="447.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="447.0" y="109.6" width="15.4" height="58.0" style="fill:var(--accent);stroke:none"/>
  <text x="454.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="469.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="469.6" y="106.5" width="15.4" height="61.1" style="fill:var(--accent);stroke:none"/>
  <text x="477.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <rect x="492.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="492.3" y="102.3" width="15.4" height="65.3" style="fill:var(--accent);stroke:none"/>
  <text x="500.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="515.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="515.0" y="96.8" width="15.4" height="70.8" style="fill:var(--accent);stroke:none"/>
  <text x="522.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <rect x="537.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="537.6" y="92.1" width="15.4" height="75.5" style="fill:var(--accent);stroke:none"/>
  <text x="545.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="560.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="560.3" y="86.2" width="15.4" height="81.4" style="fill:var(--accent);stroke:none"/>
  <text x="568.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="583.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="583.0" y="80.1" width="15.4" height="87.6" style="fill:var(--accent);stroke:none"/>
  <text x="590.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="605.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="605.6" y="75.4" width="15.4" height="92.2" style="fill:var(--accent);stroke:none"/>
  <text x="613.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="628.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="628.3" y="69.4" width="15.4" height="98.2" style="fill:var(--accent);stroke:none"/>
  <text x="636.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="651.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="651.0" y="65.9" width="15.4" height="101.7" style="fill:var(--accent);stroke:none"/>
  <text x="658.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="330.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">WebShop</text>
  <text x="60.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">нумар выкліку</text>
  <text x="330.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">нумар выкліку</text>
  <rect x="60.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="78.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">шапка і задача</text>
  <rect x="260.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">гісторыя</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">токенаў на выклік</text>
</svg>
<figcaption>Сярэдні памер промпта па нумары выкліку, токены cl100k_base. Далёка даходзяць нямногія: у FEVER пачынаюць 500 эпізодаў, да 7-га выкліку даходзяць 15, у WebShop да 15-га даходзяць 35.</figcaption>
</figure>

У цэнах gpt-4 з 37,76 долара за FEVER шапка каштуе 29,85, а гісторыя 4,67. Ідэальная і бясплатная памяць зэканоміла б 12%. Калі выкінуць самы доўгі з 3 прыкладаў, а гэта 315 токенаў, эканомія будзе 11,84 долара. Што пры гэтым будзе з дакладнасцю, не ведаю. У артыкуле пра ReAct сказана толькі, што ад большай колькасці прыкладаў лепш не стала.

Яшчэ адна рэч, драбнейшая. 35 эпізодаў WebShop, гэта 7%, дайшлі да мяжы ў 15 выклікаў, атрымалі нулявую ўзнагароду і з'елі 18,1% уваходных токенаў прагону. За адказ на 15-ы выклік заплачана, але ім ніхто не карыстаецца.

## Акно, якое забывае задачу

У ноўтбуку WebShop слізгальнае акно ўжо ёсць: `prompt[-(6400-len(init_prompt)):]`. Яно пакідае шапку і апошнія 4614 сімвалаў дыялогу. За 3472 выклікі акно нешта адрэзала 5 разоў у 2 эпізодах і зэканоміла 9 цэнтаў. Але дыялог пачынаецца з задачы, таму першай вылятае якраз яна. У адным эпізодзе зрэзана частка радка з задачай, у другім увесь.

У эпізодзе 114 просяць рулонныя шторы памерам w45*h56, пастэльна-блакітныя, танней за 90 долараў. Агент адкрывае старонку тавару на 6973 сімвалы, з іх 6531 гэта спіс з 350 памераў. Цана ў самым нізе, 66,9 долара. Пасля абрэзкі няма ні задачы, ні пошукавага запыту. Мадэль піша `think[The price is over 50 dollars.]`. На наступным выкліку акно пачынаецца роўна з `[w39 x h64 (inch)]`. Яго мадэль і націскае, а потым купляе. `[w45 x h56 (inch)]` у акне яшчэ заставаўся. Адзнака 0,6. Як ліміт цаны лік 50 ёсць толькі ў шапцы, у прыкладзе пра дэзадарант.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="WebShop, эпізод 114, выклік 4. Дыялог даўжынёй 8068 сімвалаў пачынаецца з задачы: памер w45*h56, да 90 долараў. Акно пакідае апошнія 4614 сімвалаў, усе яны са старонкі тавару. Спераду прыклеена шапка з прыкладам пра дэзадарант, да 50 долараў. Мадэль адказвае, што цана большая за 50 долараў.">
  <text x="40.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">дыялог, 8068 сімвалаў</text>
  <text x="40.0" y="40.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">задача: w45*h56, да 90</text>
  <line x1="45" y1="45" x2="45" y2="56" class="f-line"/>
  <rect x="40.0" y="58.0" width="256.9" height="34.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="296.9" y="58.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <rect x="40.0" y="58.0" width="11.7" height="34.0" style="fill:var(--accent);stroke:none"/>
  <line x1="120.8" y1="54" x2="120.8" y2="96" class="f-line"/>
  <text x="640.0" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">старонка тавару, 6973 сімвалы</text>
  <text x="40.0" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">адрэзана: 3454</text>
  <text x="640.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">засталося: 4614</text>
  <line x1="296.9" y1="54" x2="296.9" y2="148" class="f-line" stroke-dasharray="4 4"/>
  <text x="640.0" y="142.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">пайшло мадэлі, 6400 сімвалаў</text>
  <rect x="164.0" y="150.0" width="132.8" height="34.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="296.9" y="150.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="164.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">шапка, 1786</text>
  <text x="164.0" y="202.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">прыклад: да 50</text>
  <text x="640.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">рэшта старонкі тавару</text>
  <text x="40.0" y="236.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">адказ: think[The price is over 50 dollars.]</text>
</svg>
<figcaption>Эпізод 114 у WebShop, выклік 4, маштаб у сімвалах. Адзіны ліміт цаны, які застаўся ў промпце, узяты з прыкладу.</figcaption>
</figure>

Выснова ў мяне была гатовая: без сваёй задачы агент бярэ ліміт з прыкладу. Астатнія эпізоды яе аслабілі. У задачах з іншым лімітам думкі 328 разоў называюць правільны лік. А 50 долараў яны называюць 26 разоў у 22 эпізодах. У 21 з іх нічога не адрэзана. У адной задачы ліміт быў 40, а ў думцы стаіць "the price is 46.99 dollars which is lower than 50.00 dollars". Гэты тавар агент таксама купіў. Памылка "less then" з прыкладу трапіла ў 215 думак, хоць у ніводнай задачы яе няма. Так што шапка працякае і тады, калі задача цалкам перад вачыма. Якая з дзвюх прычын дала 50 долараў у эпізодзе 114, я сказаць не магу.

## Доўгі чат

Каб убачыць квадрат, яго давялося пабудаваць. Я паставіў 500 задач FEVER адну за адной у адзін чат з шапкай наверсе і кожны раз адпраўляў усё цалкам. Без 3 паўторных гэта 1250 выклікаў. Кантэкст gpt-4 на 8K заканчваецца пасярод 27-й задачы, я чакаў менш за 20. На 1000 выпадковых парадкаў медыяна 26 скончаных задач, у 90% парадкаў ад 23 да 29. Гэтыя 26 задач каштуюць 7,98 долара, а калі кожнай даць новы чат, то 1,95. На gpt-4-32k з падвойнай цаной выходзіць так: 10 задач 3,78 долара, 20 задач 10,39, 40 задач 33,54, 80 задач 140,89.

Потым я прагнаў усе 500 задач з рознымі спосабамі эканоміі. Зводку я прыняў за 150 токенаў, інструкцыю да яе за 60, бо саміх зводак ніхто не пісаў. Акно заўсёды трымае бягучае сцверджанне.

<figure class="fig">
<svg viewBox="0 0 680 252" role="img" aria-label="Кошт у доларах 500 задач FEVER у адным чаце gpt-4 пры розных спосабах: новы чат на задачу 37,50; акно 250 токенаў 38,62; акно 500 47,66; зводка раз на 3 крокі 53,40; акно 1000 66,35; акно 2000 103,48; зводка раз на 50 крокаў 143,53; акно 4000 176,40; рэзаць на мяжы 294,77. Адна толькі шапка ў кожным з іх каштуе 29,78.">
  <text x="210.0" y="27.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новы чат на задачу</text>
  <rect x="220.0" y="14.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="14.0" width="9.8" height="18.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="275.5" y="27.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">37,50</text>
  <text x="210.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">акно 250 токенаў</text>
  <rect x="220.0" y="40.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="40.0" width="11.2" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="276.9" y="53.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">38,62</text>
  <text x="210.0" y="79.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">акно 500</text>
  <rect x="220.0" y="66.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="66.0" width="22.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="288.4" y="79.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">47,66</text>
  <text x="210.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">зводка раз на 3 крокі</text>
  <rect x="220.0" y="92.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="92.0" width="29.9" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="295.6" y="105.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">53,40</text>
  <text x="210.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">акно 1000</text>
  <rect x="220.0" y="118.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="118.0" width="46.3" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="312.0" y="131.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">66,35</text>
  <text x="210.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">акно 2000</text>
  <rect x="220.0" y="144.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="144.0" width="93.4" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="359.1" y="157.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103,48</text>
  <text x="210.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">зводка раз на 50 крокаў</text>
  <rect x="220.0" y="170.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="170.0" width="144.1" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="409.8" y="183.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">143,53</text>
  <text x="210.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">акно 4000</text>
  <rect x="220.0" y="196.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="196.0" width="185.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="451.4" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">176,40</text>
  <text x="210.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">рэзаць на мяжы</text>
  <rect x="220.0" y="222.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="222.0" width="335.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="601.4" y="235.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">294,77</text>
</svg>
<figcaption>500 задач FEVER па цэнах gpt-4 8K, долары. Цёмная частка гэта шапка, у кожным радку тыя самыя 29,78.</figcaption>
</figure>

Ніжні радок гэта тое, што я напісаў бы не задумваючыся: выкідваць самыя старыя паведамленні, калі запыт не ўлазіць. Нічога не падае і рахунак лінейны, але кожны выклік каштуе каля 0,24 долара, бо кантэкст увесь час амаль поўны. Разам 294,77 долара, у 7,9 раза даражэй за новы чат на кожную задачу.

Зводка аказалася лепшай, чым я думаў. Сцісканне H токенаў у s з інструкцыяй i акупляецца праз (H + i + rs)/(H − s) наступных выклікаў, дзе r гэта цана выхаду, падзеленая на цану ўваходу. Для 1000 токенаў у 150 на gpt-4 выходзіць 1,6 выкліку. Я запісваў 5. Найлепшы перыяд роўны кораню з 2(i + (1+r)s)/d крокаў, той самы корань, што ў старой формуле Харыса для аптымальнага памеру заказу. У доўгім чаце адзін выклік дадае 111,5 токена (тут лічацца і кароткія апошнія крокі), так што з 7 службовымі токенамі ўнутры i формула дае 3,05, а сімуляцыя 3. Але за 500 задач набіраецца 416 зводак, кожная зроблена з папярэдняй. Што застаецца ад факта пасля дзясятай, я не мераў. І ўсё роўна гэта 53,40 долара супраць 37,50 за новы чат кожны раз.

## Чаго я не правяраў

Найперш якасці. Усё гэта арыфметыка па старых логах. Задачы FEVER адна ад адной не залежаць, таму новы чат там нічога не губляе, а ў сапраўднай размове згубіў бы. Крокі тут кароткія. Агент, які чытае файлы па 2000 токенаў, з шапкай FEVER прыходзіць да перасячэння ўжо на другім выкліку (1,8 па формуле). Там мой трохвугольнік працуе. Калі код у ноўтбуку не зусім той, што друкаваў лог, 5 абрэзак могуць зрушыцца. Для 35 выклікаў адказу ў логу няма і я лічыў яго нулявым, гэта не больш за 7 цэнтаў.

Далей хачу паглядзець, што кароткая шапка робіць з дакладнасцю. Тут ужо без API не абысціся.
