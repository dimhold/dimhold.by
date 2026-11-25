---
title: "У дзень анонсу на GitHub з'явілася 3 MCP-рэпазіторыі, а праз тыдзень 54 за суткі"
description: "Я палічыў па GH Archive рэпазіторыі з MCP у назве з 11 лістапада па 14 снежня 2024 года. У дзень анонсу іх нарадзілася 3, праз тыдзень 54, у сярэднім 41 у дзень. Да анонсу прыкладна 4 супадзенні падрадка з 5 аказаліся чужымі літарамі. З 4-га па 7-ы дзень маўчаць прыкладна 7 новых рэпазіторыяў з 8, гэта толькі крыху лепш за выпадковыя."
date: 2024-12-15
lang: be
translationKey: mcp-repos-born
tags: ["open-data", "agents", "numbers"]
---

25 лістапада а 16:43 UTC у архіве публічных падзей GitHub стаіць `PublicEvent` для `modelcontextprotocol/.github`. Да 16:49 такая самая падзея прыходзіць для `specification`, `servers` і яшчэ 4 рэпазіторыяў. Так выглядае момант, калі Anthropic адкрыла Model Context Protocol, агульны спосаб падлучаць да моўнай мадэлі інструменты і даныя. Хвіліны тут недакладныя: першая зорка ў `python-sdk` стаіць ужо а 16:18. Першы рэпазіторый з MCP у назве, які пасля гэтага стварылі адразу адкрытым, завецца `spullara/mcp-server`, 19:40 таго ж вечара. Другі, а 20:20, ужо awesome-спіс.

Тры тыдні я чытаў, што MCP узляцеў. Сам гэта паўтараў, хоць нічога, акрамя ўласнай стужкі, не бачыў. Новыя рэпазіторыі можна палічыць і я палічыў, па 14 снежня ўключна.

## Як лічыў

GH Archive запісвае кожную публічную падзею на GitHub. Я ўзяў яго поўную копію ў адкрытай пясочніцы ClickHouse, табліца `github_events`. Адну гадзіну пералічыў яшчэ і па сырым файле: абодва разы 10 383 стварэнні рэпазіторыяў. Нараджэннем лічу `CreateEvent`, у якога `ref_type` роўны `repository`.

Правілы запісаў да першага запыту, бо літары гэтыя занятыя. MCP гэта яшчэ і сям'я мікрасхем Microchip, а ў аматараў Minecraft сустракаюцца `mcpe` і `mcpack`. Таму назва залічваецца, толькі калі `mcp` стаіць у ёй асобным словам (camelCase разбіваю) або там напісана model context protocol. Кантролем служаць 14 дзён да анонсу. Усё, што правіла зловіць там, лічу шумам.

Я чакаў ад 5 да 15 фальшывых назваў у дзень. Выйшла 1,7.

## Што атрымалася

Да анонсу такіх назваў набралася 24 за 14 дзён. Калі шукаць проста падрадок, будзе 109, то-бок прыкладна ў 4 выпадках з 5 гэта чужыя літары. Пасля анонсу асобнае слова дае 789 нараджэнняў за 20 дзён, а падрадок 982.

<figure class="fig">
<svg viewBox="0 0 680 272" role="img" aria-label="Публічныя рэпазіторыі з mcp у назве, створаныя за дзень, з 11 лістапада па 14 снежня 2024 года. Да 25 лістапада іх ад 4 да 12 у дзень, а асобным словам mcp стаіць не больш чым у 6 з іх. 25 лістапада такіх 3, 26 лістапада 33, больш за ўсё 2 снежня, 54. У астатнія дні пасля 25 лістапада ад 26 да 50.">
  <line x1="46" y1="230.0" x2="664" y2="230.0" class="f-plain"/>
  <text x="38.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="46" y1="176.9" x2="664" y2="176.9" class="f-plain"/>
  <text x="38.0" y="180.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">20</text>
  <line x1="46" y1="123.7" x2="664" y2="123.7" class="f-plain"/>
  <text x="38.0" y="127.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">40</text>
  <line x1="46" y1="70.6" x2="664" y2="70.6" class="f-plain"/>
  <text x="38.0" y="74.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="48.0" y="211.4" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="48.0" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="55.1" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="66.2" y="198.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="66.2" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="84.4" y="219.4" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="84.4" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="91.4" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <rect x="102.5" y="206.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="102.5" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <rect x="120.7" y="198.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="120.7" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <text x="127.8" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <rect x="138.9" y="208.7" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="138.9" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <rect x="157.1" y="206.1" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="157.1" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="164.1" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">17</text>
  <rect x="175.2" y="214.1" width="14.2" height="15.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="175.2" y="230.0" width="14.2" height="0.0" style="fill:var(--accent);stroke:none"/>
  <rect x="193.4" y="219.4" width="14.2" height="8.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="193.4" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="200.5" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">19</text>
  <rect x="211.6" y="216.7" width="14.2" height="5.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="211.6" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="229.8" y="214.1" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="229.8" y="227.3" width="14.2" height="2.7" style="fill:var(--accent);stroke:none"/>
  <text x="236.9" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">21</text>
  <rect x="247.9" y="203.4" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="247.9" y="214.1" width="14.2" height="15.9" style="fill:var(--accent);stroke:none"/>
  <rect x="266.1" y="211.4" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="266.1" y="224.7" width="14.2" height="5.3" style="fill:var(--accent);stroke:none"/>
  <text x="273.2" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">23</text>
  <rect x="284.3" y="203.4" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="284.3" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <rect x="302.5" y="195.5" width="14.2" height="26.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="302.5" y="222.0" width="14.2" height="8.0" style="fill:var(--accent);stroke:none"/>
  <text x="309.6" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <line x1="300.5" y1="44" x2="300.5" y2="230" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="294.5" y="54.0" text-anchor="end" class="f-label f-ink" style="font-size:10px">анонс</text>
  <rect x="320.6" y="113.1" width="14.2" height="29.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="320.6" y="142.3" width="14.2" height="87.7" style="fill:var(--accent);stroke:none"/>
  <rect x="338.8" y="142.3" width="14.2" height="18.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="338.8" y="160.9" width="14.2" height="69.1" style="fill:var(--accent);stroke:none"/>
  <text x="345.9" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">27</text>
  <rect x="357.0" y="139.7" width="14.2" height="13.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="357.0" y="152.9" width="14.2" height="77.1" style="fill:var(--accent);stroke:none"/>
  <rect x="375.2" y="75.9" width="14.2" height="50.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="375.2" y="126.4" width="14.2" height="103.6" style="fill:var(--accent);stroke:none"/>
  <text x="382.3" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">29</text>
  <rect x="393.4" y="78.5" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="393.4" y="102.5" width="14.2" height="127.5" style="fill:var(--accent);stroke:none"/>
  <rect x="411.5" y="94.5" width="14.2" height="37.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="411.5" y="131.7" width="14.2" height="98.3" style="fill:var(--accent);stroke:none"/>
  <text x="418.6" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1</text>
  <text x="411.5" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">снежань</text>
  <rect x="429.7" y="62.6" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="429.7" y="86.5" width="14.2" height="143.5" style="fill:var(--accent);stroke:none"/>
  <text x="436.8" y="57.6" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">54</text>
  <rect x="447.9" y="67.9" width="14.2" height="45.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="447.9" y="113.1" width="14.2" height="116.9" style="fill:var(--accent);stroke:none"/>
  <text x="455.0" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3</text>
  <rect x="466.1" y="86.5" width="14.2" height="10.6" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="466.1" y="97.1" width="14.2" height="132.9" style="fill:var(--accent);stroke:none"/>
  <rect x="484.2" y="86.5" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="484.2" y="107.8" width="14.2" height="122.2" style="fill:var(--accent);stroke:none"/>
  <text x="491.3" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <rect x="502.4" y="54.6" width="14.2" height="50.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="502.4" y="105.1" width="14.2" height="124.9" style="fill:var(--accent);stroke:none"/>
  <rect x="520.6" y="121.1" width="14.2" height="2.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="520.6" y="123.7" width="14.2" height="106.3" style="fill:var(--accent);stroke:none"/>
  <text x="527.7" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">7</text>
  <rect x="538.8" y="99.8" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="538.8" y="121.1" width="14.2" height="108.9" style="fill:var(--accent);stroke:none"/>
  <rect x="556.9" y="97.1" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="556.9" y="121.1" width="14.2" height="108.9" style="fill:var(--accent);stroke:none"/>
  <text x="564.0" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">9</text>
  <rect x="575.1" y="129.0" width="14.2" height="21.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="575.1" y="150.3" width="14.2" height="79.7" style="fill:var(--accent);stroke:none"/>
  <rect x="593.3" y="86.5" width="14.2" height="23.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="593.3" y="110.4" width="14.2" height="119.6" style="fill:var(--accent);stroke:none"/>
  <text x="600.4" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">11</text>
  <rect x="611.5" y="97.1" width="14.2" height="8.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="611.5" y="105.1" width="14.2" height="124.9" style="fill:var(--accent);stroke:none"/>
  <rect x="629.6" y="81.2" width="14.2" height="29.2" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="629.6" y="110.4" width="14.2" height="119.6" style="fill:var(--accent);stroke:none"/>
  <text x="636.7" y="245.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">13</text>
  <rect x="647.8" y="81.2" width="14.2" height="31.9" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="647.8" y="113.1" width="14.2" height="116.9" style="fill:var(--accent);stroke:none"/>
  <text x="46.0" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">лістапад</text>
  <rect x="46.0" y="10.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="64.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">mcp асобным словам</text>
  <rect x="286.0" y="10.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="304.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">літары ўнутры іншага слова</text>
</svg>
<figcaption>Новыя рэпазіторыі па днях (CreateEvent). Акцэнтны колер: mcp стаіць у назве асобным словам. Шэры: гэтыя літары ўнутры іншага слова. 54 адносіцца толькі да каляровай часткі.</figcaption>
</figure>

25 лістапада іх было 3. 26-га ўжо 33, а ў сярэднім за 19 поўных дзён пасля анонсу выходзіць 41,4 у дзень, у 24 разы больш за кантроль. Калі шум застаўся такі самы, 1,7 назвы ў дзень, то гэта каля 4%. Загадзя я запісаў, што пік будзе ў першыя 3 дні, а потым пойдзе спад. Насамрэч пік прыпаў на панядзелак 2 снежня, 54 штукі. Далей кожны дзень ад 30 да 50 і ніякага яўнага нахілу. Сярэднія па тыднях 38,0 і 44,1, за апошнія 5 дзён 42,2. Пакуль што гэта падобна да прыступкі.

У выхадныя на ўсім GitHub у гэтым акне ствараюць на 16% менш рэпазіторыяў, чым у будні. У MCP у выхадны дзень выйшла 42,0, у будні 41,1. Я ўжо напісаў сказ пра людзей, якія займаюцца гэтым у вольны час, а потым паглядзеў на назвы. 11 з 44 нараджэнняў суботы 14 снежня зробленыя з аднаго акаўнта. Адна з дзвюх яго арганізацый завецца `TWI-Master-Control-Program`, гэта іншы MCP і маё правіла іх не адрознівае. Без гэтых 11 у выхадны дзень атрымліваецца 39,8, а ў апошнія 5 дзён 40,0. Правалу на 16% усё адно няма, але па 5 выхадных днях больш нічога не скажаш.

Па назвах відаць, што гэта за праца. З 769 розных назваў `server` або `servers` ёсць у 217, а `client` толькі ў 16. У 144 трапляюцца словы накшталт `test` і `demo`. Адзін рэпазіторый завецца `built-by-claude-with-mcp` і апісаны так: "A demonstration of creating and managing a repository using Claude". Думаю, частку гэтых тэстаў завялі праз сам MCP, папрасіўшы Claude стварыць рэпазіторый, але па назве я іх аддзяліць не магу.

## Ці жывуць яны

Каліямваку з суаўтарамі яшчэ ў 2014 годзе пісалі ў "The Promises and Perils of Mining GitHub", што ў большасці праектаў там мала камітаў і яны неактыўныя. Параўнанне я дадаў, калі першая доля памерлых ужо была палічаная, таму ў запісаных загадзя правілах яго няма. Я ўзяў усе 483 MCP-рэпазіторыі, народжаныя па 7 снежня. Для параўнання 4194 выпадковыя з тых жа дзён, адабраныя па хэшы назвы.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Доля рэпазіторыяў сярод 483 з MCP і 4194 выпадковых, народжаных у тыя ж дні. Ніводнага пуша: 36,6 супраць 47,7 працэнта. Пуш з 1-га па 7-ы дзень: 28,2 супраць 18,4. Пуш з 4-га па 7-ы дзень: 12,4 супраць 8,6. Хоць адна зорка: 33,3 супраць 3,4.">
  <rect x="200.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="218.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">MCP</text>
  <rect x="290.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="308.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">выпадковыя</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">% рэпазіторыяў</text>
  <text x="188.0" y="59.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ніводнага пуша</text>
  <rect x="200.0" y="36.0" width="293.2" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="499.2" y="49.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">36,6</text>
  <rect x="200.0" y="55.0" width="381.9" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="587.9" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">47,7</text>
  <text x="188.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пуш у дні з 1 па 7</text>
  <rect x="200.0" y="86.0" width="225.3" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="431.3" y="99.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">28,2</text>
  <rect x="200.0" y="105.0" width="147.4" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="353.4" y="118.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18,4</text>
  <text x="188.0" y="159.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пуш у дні з 4 па 7</text>
  <rect x="200.0" y="136.0" width="99.4" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="305.4" y="149.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">12,4</text>
  <rect x="200.0" y="155.0" width="69.1" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="275.1" y="168.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">8,6</text>
  <text x="188.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">хоць адна зорка</text>
  <rect x="200.0" y="186.0" width="266.7" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="472.7" y="199.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">33,3</text>
  <rect x="200.0" y="205.0" width="27.5" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="233.5" y="218.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3,4</text>
  <line x1="200" y1="30" x2="200" y2="226" class="f-plain"/>
</svg>
<figcaption>Што да 14 снежня сталася з рэпазіторыямі, народжанымі з 25 лістапада па 7 снежня. Акцэнтны колер: 483 з MCP у назве. Шэры: 4194 выпадковыя тых жа дзён.</figcaption>
</figure>

У 36,6% MCP-рэпазіторыяў у архіве няма ніводнага пуша. Гучала кепска, пакуль я не ўбачыў 47,7% у выпадковых. З 1-га па 7-ы дзень пасля нараджэння пуш быў у 28,2% супраць 18,4%. З 4-га па 7-ы дзень 12,4% супраць 8,6%. Часткова гэта толькі таму, што сярод іх менш пустых ад самага пачатку. Калі пакінуць толькі тыя, дзе быў хоць адзін пуш, з 1-га па 7-ы дзень выходзіць 44,4% супраць 35,3%, а з 4-га па 7-ы 19,6% супраць 16,5%. На другую пару я б не ставіў, MCP-рэпазіторыяў у ёй усяго 306. Так што першыя дні ў іх больш ажыўленыя, чым у выпадковых, але з 4-га па 7-ы дзень прыкладна 7 з 8 маўчаць.

З зоркамі разрыў куды большы. Хоць адну атрымалі 33,3% супраць 3,4% у выпадковых. Але ў 541 з усіх 769 няма ніводнай, а на першую дзясятку прыпадае 57% з 3187 зорак. Першае месца з 980 зоркамі ў `punkpeye/awesome-mcp-servers`, а гэта спіс спасылак. Афіцыйны `modelcontextprotocol/servers` адзін набраў за той жа час 4298, больш, чым усе 769 разам.

## Чаго маё правіла не бачыць

Афіцыйных рэпазіторыяў у маім падліку няма зусім. MCP у іх стаіць у назве арганізацыі, а ўбачыў я іх толькі праз сваю памылку. Адзін з двух шаблонаў у запыце правяраў поўную назву разам з уладальнікам, хоць у правілах у мяне запісана частка пасля касой рысы. Нараджэння ў 9 рэпазіторыяў першых дзён у архіве таксама няма, прынамсі з 1 верасня. У 7 ёсць `PublicEvent`, значыць іх стварылі закрытымі і потым адкрылі. Для двух на TypeScript не відаць нават гэтага.

Тое самае з тымі, хто ведаў загадзя. У `anaisbetts/mcp-youtube` няма `CreateEvent`, ёсць толькі `PublicEvent` а 17:14 25 лістапада. Але нумары рэпазіторыяў на GitHub растуць і нумар з сырога файла, 891110939, прыпадае на прамежак паміж 18:00 і 19:00 UTC 19 лістапада, за 6 дзён да анонсу. Такіх адкрыццяў з MCP у назве я налічыў 77, у астатніх нумары не глядзеў.

Апісанняў у табліцы ClickHouse няма, яны ляжаць у сырых файлах, па 24 на суткі. Тая гадзіна, якую я звяраў, важыць 199 МБ. Я ўзяў першыя 6 МБ кожнай з 480 гадзін, гэта 6,3% усіх нараджэнняў. З 35 рэпазіторыяў, у якіх MCP згаданы ў апісанні, правіла па назве знаходзіць 32. Усяго правіла знайшло ў гэтай выбарцы 51 назву. Калі пералічыць на ўсе нараджэнні, гэта каля 805 супраць 789 пры поўным падліку. Загадзя я запісаў, што страчу менш за траціну, тут угадаў.

## Чаго я не правяраў

Код я не адкрываў. Пусты рэпазіторый з назвай `mcp-server` лічыцца нароўні з тым, дзе ўсё працуе. Мовы ў падзеі нараджэння няма, а па назвах яе можна прачытаць толькі прыкладна ў 30. Перайменаваны або потым закрыты рэпазіторый выглядае тут памерлым. Магчыма, той, дзе адзіны README дадаў сам GitHub, таксама. Выпадковыя я адабраў па хэшы назвы і вачыма не праглядаў. Тых, хто піша сервер унутры ўжо наяўнага рэпазіторыя, тут няма зусім, а самыя сур'ёзныя інтэграцыі могуць быць якраз там. І 20 дзён гэта мала.
