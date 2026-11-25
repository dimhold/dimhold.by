---
title: "85% пакетов MCP в npm замолчали, у новых CLI доля та же"
description: "Я взял 17 724 имени npm со словом mcp, появившихся за год после анонса, и сравнил их с новыми CLI и случайными именами. 90 дней молчат 85,4% пакетов, у CLI 84,8%. У одного молчащего пакета 203 821 скачивание за ноябрь, у 11 архивных эталонных серверов 495 386."
date: 2025-12-07
lang: ru
translationKey: mcp-year-later
tags: ["open-data", "dependencies", "agents"]
---

Первая строка моей таблицы пакетов MCP это `@expo/mcp-tunnel`, 5 482 633 скачивания за ноябрь. Раньше я о нём не слышал. `@expo/cli` взял его в зависимости в версии 54.0.6 от 16 сентября, а в 54.0.17 от 4 декабря его уже нет. Вторым идёт `@playwright/mcp` с 3 298 211 скачиваниями, его я и ожидал увидеть. Третий, `@orval/mcp` с 1 484 239, тоже приезжает зависимостью, на этот раз вместе с генератором API-клиентов orval.

MCP анонсировали 25 ноября 2024 года. Для меня MCP в npm был кладбищем: человек за вечер публикует сервер и больше к нему не возвращается. Числа за этим мнением не стояло, сравнивать тоже было не с чем. Я и любой другой пакет оцениваю так: смотрю на дату последней публикации и на скачивания и по ним решаю, живой он или нет.

Считали и до меня. В июне Hasan с соавторами разобрали 1899 открытых серверов MCP, в сентябре Guo с соавторами собрали 17 630 записей с 6 площадок и больше половины проектов назвали нерабочими или малоценными. Контрольной группы из обычных пакетов в аннотациях обеих работ нет, а мне хотелось увидеть рядом именно её.

## Что я посчитал

Я взял 2 снимка всех имён npm из `all-the-package-names`: 2.0.1880 от 25 ноября 2024 года и 2.0.2287 от 6 декабря 2025. Имён, которые есть только во втором снимке и содержат `mcp` отдельным словом, нашлось 17 724. Для каждого я прочитал документ из реестра и выбросил всё, что случилось после 6 декабря. По 1028 именам читать было уже нечего, пакет удалён или снят с публикации. Ещё у нескольких до этой даты не было ни одной версии, в итоге осталось 16 657.

Для контроля взял 2000 случайных новых имён со словом `cli` и 2000 случайных новых имён любых, за тот же год и по тем же правилам, пригодны из них 1771 и 1754. Определения записал до загрузки. Молчащим считаю пакет, которому не меньше 90 дней и у которого за последние 90 дней не было публикаций. Это ещё не значит мёртвый: законченной утилите новые версии не нужны, а снаружи законченное от брошенного я не отличу.

Перед подсчётом долей я убрал скоупы, в которых 100 пакетов и больше, эту границу выбрал уже после первого взгляда на данные. В `@iflow-mcp` 1518 пакетов, 162 из них впервые вышли в один день, 28 октября. В `@mseep` 567, у 96,3% ровно одна версия. И ещё 180 в `@fastmcp-me`. У 1417 из этих 2265 пакетов есть тёзка, пакет с тем же именем вне этих 3 скоупов, так что в основном это, похоже, перепубликованные копии. Вместе они дают 13,6% всего, что выложили с `mcp` в имени.

## Кладбище самое обычное

Без этих скоупов пакетов не моложе 90 дней 10 121, молчат 8642. Контрольные группы взвешены по тем же месяцам рождения, потому что у мартовского пакета было больше времени замолчать, чем у августовского.

| | mcp | cli | случайные |
|---|---|---|---|
| последняя публикация в пределах суток от первой | 53,1% | 53,6% | 51,3% |
| молчат 90 дней | 85,4% | 84,8% | 78,4% |
| публиковались за последние 30 дней | 6,4% | 6,9% | 10,6% |

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Доля пакетов, у которых последняя публикация случилась позже указанного числа дней после первой, для пакетов не моложе 180 дней. Через 1 день: mcp 48,5%, cli 47,0%, случайные имена 48,6%. Через 60 дней: 19,9%, 18,9%, 26,4%. Через 180 дней: 8,2%, 9,8%, 14,7%. Линии mcp и cli почти совпадают, случайные имена держатся выше.">
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
  <text x="578.0" y="187.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">случайные</text>
  <text x="578.0" y="201.4" text-anchor="start" class="f-mono f-muted" style="font-size:11px">14,7%</text>
  <text x="578.0" y="216.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">cli 9,8%</text>
  <text x="578.0" y="232.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">mcp 8,2%</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">публиковались позже, %</text>
  <text x="570.0" y="276.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">дней с первой версии</text>
</svg>
<figcaption>Сколько пакетов ещё публиковали после указанного дня. Только пакеты не моложе 180 дней: 5175 mcp без 3 массовых скоупов, 800 cli, 866 случайных. Взвешивания по месяцам рождения тут нет.</figcaption>
</figure>

Я ждал, что MCP окажется заметно хуже. С CLI разницы нет: бутстрэп даёт для доли молчащих CLI интервал от 82,5% до 87,0%. Случайные имена замолкают реже, у них от 76,0% до 80,7%, но CLI отстоят от них точно так же. Граница для скоупов мало что меняет: если убрать скоупы от 100 новых имён из всех 3 групп, выйдет 85,4%, 84,8% и 79,0%. Могу предположить, что маленький инструмент так же быстро замолкает с любым ключевым словом.

Со скачиваниями у MCP даже чуть лучше. Медиана за ноябрь у пакетов без скоупа 18, а у CLI и у случайных имён по 8, тут уже без взвешивания по месяцам. У молчащих пакетов MCP с единственной версией медиана 4, так что большого смысла в этих 18 я бы не искал. На 1% таких пакетов, то есть на 76 из 7603, приходится 84,4% их скачиваний.

## Молчащий пакет с 203 821 скачиванием

Для слова "взлетел" у меня был записан порог, 10 000 скачиваний за ноябрь. Таких пакетов я нашёл 119, из них 105 не моложе 90 дней и 29 из этих 105 молчат. Тут порог и сломался. Высоко в таблице стоит `n8n-nodes-mcp-client`, 203 821 скачивание. Все 18 его версий вышли 16 и 17 мая, а в июле его скачали 3071 раз.

<figure class="fig">
<svg viewBox="0 0 680 342" role="img" aria-label="Скачивания по дням с 1 октября по 6 декабря 2025 года. n8n-nodes-mcp-client каждый день до 17 ноября держится между 11 183 и 11 908, а 19 ноября падает до 184. use-mcp в будни доходит до 8573, а в большинство выходных проваливается до нескольких сотен.">
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
  <text x="65.0" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 окт</text>
  <text x="342.6" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 ноя</text>
  <text x="611.3" y="164.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 дек</text>
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
  <text x="65.0" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 окт</text>
  <text x="342.6" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 ноя</text>
  <text x="611.3" y="332.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1 дек</text>
  <text x="664.0" y="14.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">скачиваний в день</text>
</svg>
<figcaption>2 молчащих пакета, скачивания по дням с 1 октября по 6 декабря, выходные серые. Первый последний раз публиковали 17 мая, второй 25 июля.</figcaption>
</figure>

С 1 октября по 17 ноября его скачивали от 11 183 до 11 908 раз каждый день, в выходные тоже. 19 ноября его скачали 184 раза. У `@mzxrai/mcp-webresearch`, который последний раз публиковали в декабре 2024 года, с 1 октября по 10 ноября было от 4543 до 5851 в день, а 11 ноября стало 27. Люди так не качают. По-моему, это несколько машин, которые кто-то выключил, чьи они, я не знаю.

По месячным суммам было ясно только, что порог плохой, поэтому я записал ещё 2 и лишь потом скачал посуточные ряды для всех 119. Пакет держит рабочую неделю, если в ноябре средний выходной у него меньше 0,7 среднего буднего дня. Всплеск это когда 3 дня дают больше 40% месяца. Из 29 молчащих рабочую неделю держат 17, всплесков 4, один пакет попал в обе группы. Зато у `use-mcp`, который молчит с 25 июля, 138 495 скачиваний и ясный недельный ритм, похоже на людей и их CI. По дате последней версии я бы его похоронил.

## В архиве и 495 386 в месяц

28 мая появился репозиторий `servers-archived` и 11 эталонных серверов из npm оказались в нём. В мае у них было 476 704 скачивания, в ноябре 495 386, это 27,2% от всех эталонных. Те 4, что остались, выросли с 402 245 до 1 325 856. У `server-postgres` последняя версия от 4 декабря 2024 года и всё равно он прошёл путь от 78 653 до 100 059 в месяц. У 8 из 11 версия `@modelcontextprotocol/sdk` зафиксирована на 1.0.1.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Скачивания эталонных серверов из npm по месяцам, с декабря 2024 по ноябрь 2025, в тысячах. 11 архивных: 38, 33, 45, 312, 454, 477, 635, 615, 452, 493, 568, 495. 4 оставшихся: 32, 34, 42, 239, 321, 402, 481, 862, 1221, 1545, 1398, 1326.">
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
  <text x="64.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">дек</text>
  <text x="154.2" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">фев</text>
  <text x="244.4" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">апр</text>
  <text x="334.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">июн</text>
  <text x="424.7" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">авг</text>
  <text x="514.9" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">окт</text>
  <line x1="307.5" y1="30.0" x2="307.5" y2="230.0" class="f-plain" style="stroke-dasharray:4 4"/>
  <polyline points="64.0,226.0 109.1,225.7 154.2,224.7 199.3,200.1 244.4,189.9 289.5,179.7 334.5,169.9 379.6,122.2 424.7,77.4 469.8,36.9 514.9,55.2 560.0,64.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <polyline points="64.0,225.2 109.1,225.9 154.2,224.4 199.3,190.9 244.4,173.2 289.5,170.4 334.5,150.6 379.6,153.2 424.7,173.6 469.8,168.3 514.9,159.0 560.0,168.1" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="568.0" y="61.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">4 оставшихся</text>
  <text x="568.0" y="76.3" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 325 856</text>
  <text x="568.0" y="165.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">11 архивных</text>
  <text x="568.0" y="180.1" text-anchor="start" class="f-mono f-accent" style="font-size:11px">495 386</text>
  <text x="8.0" y="14.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">скачиваний в месяц, тыс.</text>
</svg>
<figcaption>Эталонные серверы в npm, скачивания по месяцам. Пунктир это 28 мая, когда появился архивный репозиторий.</figcaption>
</figure>

Есть ещё официальный реестр, его открыли в сентябре. В блоге MCP 25 ноября написали, что в нём почти 2000 записей. API отдаёт мне 2019 записей, опубликованных до этого дня, но записью там считается каждая версия, а разных имён 884. На мою дату получается 2457 и 987. 430 серверов доступны только по сети, пакета у них нет.

## Чего я не проверял

Здесь только npm и только имена со словом `mcp`, то есть ни PyPI, ни образов Docker, ни серверов, которые лежат прямо в репозитории. API скачиваний отдаёт имена со скоупом по одному и ограничивает частоту запросов, поэтому имена без скоупа у меня все, а со скоупом 568 случайных и ещё 400, которые поиск npm показывает первыми. Значит 119 это оценка снизу, а молчащего пакета со скоупом, который поиск прячет, среди этих 29 может не быть. Удалённых пакетов в долях нет, думаю, большинство из них молчало бы. Взвешивание по месяцам убирает разницу в возрасте, но авторов и компании я не подбирал. И ни одного сервера я не запустил.
