---
title: "В день анонса на GitHub появилось 3 MCP-репозитория, а через неделю 54 за сутки"
description: "Я посчитал по GH Archive репозитории с MCP в имени с 11 ноября по 14 декабря 2024 года. В день анонса их родилось 3, через неделю 54, в среднем 41 в день. До анонса примерно 4 совпадения подстроки из 5 оказались чужими буквами. С 4-го по 7-й день молчат примерно 7 новых репозиториев из 8, это лишь немного лучше случайных."
date: 2024-12-15
lang: ru
translationKey: mcp-repos-born
tags: ["open-data", "agents", "numbers"]
---

25 ноября в 16:43 UTC в архиве публичных событий GitHub стоит `PublicEvent` для `modelcontextprotocol/.github`. К 16:49 такое же событие приходит для `specification`, `servers` и ещё 4 репозиториев. Так выглядит момент, когда Anthropic открыла Model Context Protocol, общий способ подключать к языковой модели инструменты и данные. Минуты тут неточные: первая звезда у `python-sdk` стоит уже в 16:18. Первый репозиторий с MCP в имени, созданный после этого сразу открытым, называется `spullara/mcp-server`, 19:40 того же вечера. Второй, в 20:20, уже awesome-список.

Три недели я читал, что MCP взлетел. Сам это повторял, хотя ничего, кроме своей ленты, не видел. Новые репозитории можно посчитать и я посчитал, по 14 декабря включительно.

## Как считал

GH Archive записывает каждое публичное событие на GitHub. Я взял его полную копию в открытой песочнице ClickHouse, таблица `github_events`. Один час пересчитал ещё и по сырому файлу: оба раза 10 383 создания репозитория. Рождением считаю `CreateEvent`, у которого `ref_type` равен `repository`.

Правила записал до первого запроса, потому что буквы эти заняты. MCP это ещё и семейство микросхем Microchip, а у любителей Minecraft в ходу `mcpe` и `mcpack`. Поэтому имя засчитывается, только если `mcp` стоит в нём отдельным словом (camelCase разбиваю) или там написано model context protocol. Контролем служат 14 дней до анонса. Всё, что правило поймает там, считаю шумом.

Я ждал от 5 до 15 ложных имён в день. Вышло 1,7.

## Что получилось

До анонса таких имён набралось 24 за 14 дней. Если искать просто подстроку, будет 109, то есть примерно в 4 случаях из 5 это чужие буквы. После анонса отдельное слово даёт 789 рождений за 20 дней, а подстрока 982.

<figure class="fig">
<svg viewBox="0 0 680 272" role="img" aria-label="Публичные репозитории с mcp в имени, созданные за день, с 11 ноября по 14 декабря 2024 года. До 25 ноября их от 4 до 12 в день, а отдельным словом mcp стоит не больше чем у 6 из них. 25 ноября таких 3, 26 ноября 33, больше всего 2 декабря, 54. В остальные дни после 25 ноября от 26 до 50.">
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
  <text x="411.5" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">декабрь</text>
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
  <text x="46.0" y="262.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">ноябрь</text>
  <rect x="46.0" y="10.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="64.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">mcp отдельным словом</text>
  <rect x="286.0" y="10.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="304.0" y="20.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">буквы внутри другого слова</text>
</svg>
<figcaption>Новые репозитории по дням (CreateEvent). Акцентный цвет: mcp стоит в имени отдельным словом. Серый: эти буквы внутри другого слова. 54 относится только к цветной части.</figcaption>
</figure>

25 ноября их было 3. 26-го уже 33, а в среднем за 19 полных дней после анонса выходит 41,4 в день, в 24 раза больше контроля. Если шум остался прежним, 1,7 имени в день, то это около 4%. Заранее я записал, что пик будет в первые 3 дня, а потом пойдёт спад. На деле пик пришёлся на понедельник 2 декабря, 54 штуки. Дальше каждый день от 30 до 50 и никакого явного наклона. Средние по неделям 38,0 и 44,1, за последние 5 дней 42,2. Пока это похоже на ступеньку.

В выходные на всём GitHub в этом окне создают на 16% меньше репозиториев, чем в будни. У MCP в выходной день вышло 42,0, в будний 41,1. Я уже написал фразу про людей, которые занимаются этим в свободное время, а потом посмотрел на имена. 11 из 44 рождений субботы 14 декабря сделаны с одного аккаунта. Одна из двух его организаций называется `TWI-Master-Control-Program`, это другой MCP и моё правило их не различает. Без этих 11 в выходной день получается 39,8, а в последние 5 дней 40,0. Провала на 16% всё равно нет, но по 5 выходным дням больше ничего не скажешь.

По именам видно, что это за работа. Из 769 разных имён `server` или `servers` есть в 217, а `client` только в 16. В 144 встречаются слова вроде `test` и `demo`. Один репозиторий называется `built-by-claude-with-mcp` и описан так: "A demonstration of creating and managing a repository using Claude". Думаю, часть этих тестов завели через сам MCP, попросив Claude создать репозиторий, но по имени я их отделить не могу.

## Живут ли они

Каллиамваку с соавторами ещё в 2014 году писали в "The Promises and Perils of Mining GitHub", что у большинства проектов там мало коммитов и они неактивны. Сравнение я добавил, когда первая доля умерших уже была посчитана, поэтому в записанных заранее правилах его нет. Я взял все 483 MCP-репозитория, рождённые по 7 декабря. Для сравнения 4194 случайных из тех же дней, отобранных по хешу имени.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Доля репозиториев среди 483 с MCP и 4194 случайных, рождённых в те же дни. Ни одного пуша: 36,6 против 47,7 процента. Пуш с 1-го по 7-й день: 28,2 против 18,4. Пуш с 4-го по 7-й день: 12,4 против 8,6. Хотя бы одна звезда: 33,3 против 3,4.">
  <rect x="200.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="218.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">MCP</text>
  <rect x="290.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="308.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">случайные</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">% репозиториев</text>
  <text x="188.0" y="59.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ни одного пуша</text>
  <rect x="200.0" y="36.0" width="293.2" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="499.2" y="49.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">36,6</text>
  <rect x="200.0" y="55.0" width="381.9" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="587.9" y="68.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">47,7</text>
  <text x="188.0" y="109.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пуш в дни с 1 по 7</text>
  <rect x="200.0" y="86.0" width="225.3" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="431.3" y="99.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">28,2</text>
  <rect x="200.0" y="105.0" width="147.4" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="353.4" y="118.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">18,4</text>
  <text x="188.0" y="159.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пуш в дни с 4 по 7</text>
  <rect x="200.0" y="136.0" width="99.4" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="305.4" y="149.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">12,4</text>
  <rect x="200.0" y="155.0" width="69.1" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="275.1" y="168.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">8,6</text>
  <text x="188.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">хоть одна звезда</text>
  <rect x="200.0" y="186.0" width="266.7" height="17.0" style="fill:var(--accent);stroke:none"/>
  <text x="472.7" y="199.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">33,3</text>
  <rect x="200.0" y="205.0" width="27.5" height="17.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="233.5" y="218.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3,4</text>
  <line x1="200" y1="30" x2="200" y2="226" class="f-plain"/>
</svg>
<figcaption>Что к 14 декабря стало с репозиториями, рождёнными с 25 ноября по 7 декабря. Акцентный цвет: 483 с MCP в имени. Серый: 4194 случайных тех же дней.</figcaption>
</figure>

У 36,6% MCP-репозиториев в архиве нет ни одного пуша. Звучало плохо, пока я не увидел 47,7% у случайных. С 1-го по 7-й день после рождения пуш был у 28,2% против 18,4%. С 4-го по 7-й день 12,4% против 8,6%. Отчасти это лишь потому, что среди них меньше пустых с самого начала. Если оставить только те, где был хотя бы один пуш, с 1-го по 7-й день выходит 44,4% против 35,3%, а с 4-го по 7-й 19,6% против 16,5%. На вторую пару я бы не ставил, MCP-репозиториев в ней всего 306. Так что первые дни у них оживлённее, чем у случайных, но с 4-го по 7-й день примерно 7 из 8 молчат.

Со звёздами разрыв куда больше. Хотя бы одну получили 33,3% против 3,4% у случайных. Но у 541 из всех 769 нет ни одной, а на первую десятку приходится 57% от 3187 звёзд. Первое место с 980 звёздами у `punkpeye/awesome-mcp-servers`, а это список ссылок. Официальный `modelcontextprotocol/servers` один набрал за то же время 4298, больше, чем все 769 вместе.

## Чего моё правило не видит

Официальных репозиториев в моём счёте нет вообще. MCP у них стоит в названии организации, а увидел я их только из-за своей ошибки. Один из двух шаблонов в запросе проверял полное имя вместе с владельцем, хотя в правилах у меня записана часть после косой черты. Рождения у 9 репозиториев первых дней в архиве тоже нет, по крайней мере с 1 сентября. У 7 есть `PublicEvent`, значит их создали закрытыми и потом открыли. Для двух на TypeScript не видно даже этого.

То же с теми, кто знал заранее. У `anaisbetts/mcp-youtube` нет `CreateEvent`, есть только `PublicEvent` в 17:14 25 ноября. Но номера репозиториев на GitHub растут и номер из сырого файла, 891110939, приходится на промежуток между 18:00 и 19:00 UTC 19 ноября, за 6 дней до анонса. Таких открытий с MCP в имени я насчитал 77, у остальных номера не смотрел.

Описаний в таблице ClickHouse нет, они лежат в сырых файлах, по 24 в сутки. Тот час, который я сверял, весит 199 МБ. Я взял первые 6 МБ каждого из 480 часов, это 6,3% всех рождений. Из 35 репозиториев, у которых MCP упомянут в описании, правило по имени находит 32. Всего правило нашло в этой выборке 51 имя, в пересчёте на все рождения это около 805 против 789 при полном счёте. Заранее я записал, что потеряю меньше трети, тут угадал.

## Чего я не проверял

Код я не открывал. Пустой репозиторий с именем `mcp-server` считается наравне с работающим. Языка в событии рождения нет, а по именам его можно прочесть только примерно у 30. Переименованный или потом закрытый репозиторий выглядит здесь умершим. Возможно, тот, где единственный README добавил сам GitHub, тоже. Случайные я отобрал по хешу имени и глазами не просматривал. Тех, кто пишет сервер внутри уже существующего репозитория, здесь нет совсем, а самые серьёзные интеграции могут быть как раз там. И 20 дней это мало.
