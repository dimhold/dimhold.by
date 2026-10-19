---
title: "Sandy пришёл на обычную полную воду"
description: "Данные приливомеров NOAA за 100 лет на The Battery и в Бостоне, сшитые с каталогом ураганов HURDAT2: большие нагоны приходят на любой прилив, Sandy пришёл на средний, самые высокие воды Бостона стоят на высоких приливах, а большинство нагонов, которые могли затопить город, не затопили из-за низкой воды."
date: 2022-12-21
lang: ru
translationKey: tide-storm-coincidence
tags: ["open-data", "statistics"]
---
В октябре исполнилось 10 лет урагану Sandy. Почти в каждом пересказе наводнение на Манхэттене сложилось из 2 вещей сразу: огромного штормового нагона и прилива в полнолуние. Я и сам пересказывал эту историю. При этом ни разу не спросил, как часто часть про прилив действительно есть, у Sandy или у других наводнений.

Поэтому я взял 2 приливомера с вековой записью, The Battery в Нью-Йорке и Бостон. Потом сшил их с каталогом атлантических ураганов.

## Что шторм добавляет к приливу

Прилив известен на годы вперёд. NOAA публикует предсказанное время и высоту каждой полной воды, а приливомер записывает, что пришло на самом деле. Самый высокий наблюдённый уровень около предсказанной полной воды минус предсказание называется skew surge, по-русски проще сказать нагон. Это то, что добавила погода.

Через API NOAA CO-OPS я скачал часовые высоты с 1921 года по 20 декабря 2022 года и предсказанные полные и малые воды. Это около 70 000 полных вод на станцию. Для ураганов взял HURDAT2 Национального центра по ураганам, октябрьскую версию, которая заканчивается 2021 годом. Анализ занимает около 300 строк на Python 3.10 только со стандартной библиотекой.

Предсказания привязаны к среднему уровню моря эпохи с 1983 по 2001 год, поэтому подъём моря входит в нагон. На The Battery медиана нагона растёт от −0,21 м в 1921 году до +0,11 м в 2022-м. Для статистики я вычитаю медиану каждого года. Уровни воды оставляю как есть, потому что именно эта вода была у людей на улицах.

До счёта я записал 4 ожидания. Самым большим нагонам будет всё равно, какой высоты прилив. В Бостоне размах прилива 3,1 м и я ожидал, что большинство из 20 самых высоких вод придут на полную воду из верхней четверти. На The Battery размах 1,5 м и там я ожидал меньше половины. О двух других ниже.

## Где я чуть не опубликовал неверный список

В моей первой двадцатке для The Battery не было ни Донны 1960 года, ни Айрин 2011-го. Донна держала рекорд до Sandy, но остальной список выглядел нормально и я чуть не пошёл дальше.

Скрипт использовал только 34 514 полных вод из примерно 70 000. Окно вокруг каждой предсказанной полной воды начинается посередине между ней и предыдущей малой водой. Когда промежуток равен нечётному числу минут, в этой точке оказывается 30 секунд. Я округлял её до целого часа: обнулял минуты и забыл про секунды. Поэтому ключи не совпадали с часовыми данными и окно выглядело дырявым. Окна с дырами скрипт молча пропускал. После исправления на The Battery полное окно есть у 66 689 полных вод и Донна стоит второй с 3,05 м.

## Шторм не выбирает прилив

Я взял верхний 1% нагонов на каждой станции. На The Battery это 669 полных вод с нагоном от 0,485 м, в Бостоне 714 от 0,41 м. Тау Кендалла между предсказанной полной водой и нагоном равен +0,007 на The Battery и −0,007 в Бостоне, p равно 0,80 и 0,77.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="2 точечные диаграммы, The Battery слева и Бостон справа. Каждая точка это одна полная вода из верхнего 1% нагонов с 1921 года: 669 и 711 точек. По горизонтали предсказанная полная вода в метрах над средним уровнем низших малых вод, по вертикали нагон в метрах за вычетом медианы своего года. Пунктирная вертикаль отмечает верхнюю четверть всех предсказанных полных вод. Точки лежат плоским облаком без наклона, тау Кендалла +0,007 и −0,007. Sandy отмечен вверху левой панели: нагон 2,70 м на приливе 1,48 м, левее границы верхней четверти.">
  <rect x="60" y="40" width="285" height="216" class="f-box" style="fill:none"/>
  <text x="60.0" y="30.0" text-anchor="start" class="f-label" style="font-size:12px">The Battery, Нью-Йорк, тау +0,007</text>
  <line x1="56" y1="240.6" x2="60" y2="240.6" class="f-plain"/>
  <text x="53.0" y="244.6" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0,5</text>
  <line x1="56" y1="163.4" x2="60" y2="163.4" class="f-plain"/>
  <text x="53.0" y="167.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1,0</text>
  <line x1="56" y1="86.3" x2="60" y2="86.3" class="f-plain"/>
  <text x="53.0" y="90.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1,5</text>
  <line x1="141.4" y1="256" x2="141.4" y2="260" class="f-plain"/>
  <text x="141.4" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1,0</text>
  <line x1="243.2" y1="256" x2="243.2" y2="260" class="f-plain"/>
  <text x="243.2" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1,5</text>
  <line x1="345.0" y1="256" x2="345.0" y2="260" class="f-plain"/>
  <text x="345.0" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2,0</text>
  <line x1="260.5" y1="40" x2="260.5" y2="256" class="f-line" style="stroke:var(--accent);stroke-dasharray:4 4"/>
  <text x="264.5" y="54" class="f-mono f-accent" style="font-size:10px"><tspan x="264.5">верхняя</tspan><tspan x="264.5" dy="12">четверть →</tspan></text>
  <circle cx="209.4" cy="227.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="241.6" cy="223.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.2" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.7" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.7" cy="204.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.2" cy="118.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="194.4" cy="205.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="213.7" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="228.6" cy="234.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="262.1" cy="203.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.8" cy="192.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="156.3" cy="223.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.4" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.0" cy="215.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.1" cy="216.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.0" cy="217.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.6" cy="197.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.3" cy="203.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.2" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.6" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.7" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="290.2" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="243.6" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.7" cy="155.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="232.4" cy="213.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="296.8" cy="229.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.4" cy="209.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.0" cy="224.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="161.2" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="228.8" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.4" cy="215.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="280.7" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="285.4" cy="230.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="271.5" cy="210.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.3" cy="161.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.0" cy="209.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="232.6" cy="179.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.9" cy="231.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.5" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="222.7" cy="200.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.5" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.9" cy="212.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.8" cy="151.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="251.8" cy="156.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.2" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.8" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="275.0" cy="218.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.3" cy="207.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="266.8" cy="197.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.1" cy="193.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="252.0" cy="224.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.6" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.9" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.7" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.5" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.4" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.5" cy="221.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.2" cy="230.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.0" cy="219.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.6" cy="141.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.8" cy="219.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="188.0" cy="242.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="138.0" cy="186.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="149.8" cy="223.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.4" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="268.3" cy="223.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.1" cy="201.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.8" cy="227.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="141.6" cy="232.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.7" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="231.4" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.1" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.2" cy="239.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="305.1" cy="239.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.8" cy="238.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.9" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="216.8" cy="222.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.5" cy="213.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.3" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="295.3" cy="201.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.4" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="176.4" cy="219.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.3" cy="237.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="166.9" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="176.0" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="201.3" cy="223.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.1" cy="198.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="170.1" cy="200.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.9" cy="230.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.3" cy="234.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.0" cy="225.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.4" cy="234.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="286.8" cy="241.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="187.6" cy="223.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="245.9" cy="234.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.4" cy="215.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="155.5" cy="232.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.1" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="241.2" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.0" cy="230.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.5" cy="192.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.5" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="251.6" cy="215.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="194.0" cy="176.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.1" cy="231.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="182.6" cy="234.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="187.4" cy="223.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.1" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="268.1" cy="216.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="248.5" cy="230.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.2" cy="172.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="263.6" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.9" cy="212.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.4" cy="225.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="227.3" cy="219.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.0" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.0" cy="218.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.7" cy="164.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.6" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.6" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="190.9" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="247.5" cy="234.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="306.1" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="182.3" cy="189.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="231.0" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="271.1" cy="233.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="230.2" cy="240.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.9" cy="181.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.6" cy="218.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="239.6" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.4" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="250.3" cy="218.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="250.5" cy="222.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.1" cy="237.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.7" cy="235.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.1" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="177.3" cy="216.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.3" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="298.0" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.0" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="206.8" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.9" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.2" cy="205.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="175.6" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.4" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.5" cy="225.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="247.3" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="171.1" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.4" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.6" cy="108.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.1" cy="96.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.7" cy="224.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="308.8" cy="218.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="298.2" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.8" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.3" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.6" cy="203.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="153.8" cy="222.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.9" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.9" cy="199.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="160.6" cy="230.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.5" cy="229.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="163.6" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.5" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="168.9" cy="231.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.3" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.6" cy="198.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="258.7" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.0" cy="241.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="239.1" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.3" cy="204.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.8" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.3" cy="187.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.1" cy="113.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="230.4" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="174.2" cy="221.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.5" cy="211.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="247.3" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.0" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="245.7" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="243.0" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.9" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.8" cy="223.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="264.8" cy="180.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="296.5" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="258.5" cy="231.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="294.7" cy="221.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="247.5" cy="218.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="166.3" cy="196.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.3" cy="204.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="174.6" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.0" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.3" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="235.7" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.3" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.0" cy="233.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="250.3" cy="216.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.8" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="205.1" cy="214.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.7" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.9" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.8" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.0" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.3" cy="196.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="288.4" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.6" cy="196.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="307.1" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.2" cy="227.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="307.9" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.7" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="183.4" cy="221.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.7" cy="186.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.9" cy="146.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.8" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.5" cy="59.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="188.9" cy="239.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.2" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.7" cy="213.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="298.2" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="242.0" cy="223.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.0" cy="177.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.5" cy="162.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.5" cy="160.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="286.0" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="304.9" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="278.2" cy="236.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="243.8" cy="233.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="295.5" cy="163.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="275.2" cy="142.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="293.5" cy="166.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="280.9" cy="184.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="281.9" cy="213.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.1" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.8" cy="238.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.0" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="308.2" cy="229.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="227.5" cy="205.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="216.8" cy="238.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.1" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="268.7" cy="226.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="257.5" cy="227.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="258.7" cy="233.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="154.1" cy="195.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.3" cy="234.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="176.6" cy="217.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="143.3" cy="225.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.7" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.4" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.6" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="142.7" cy="188.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.5" cy="138.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="151.2" cy="233.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.1" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="259.5" cy="225.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="181.3" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="268.1" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.8" cy="212.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.3" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.2" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="258.7" cy="231.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.1" cy="230.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.3" cy="226.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="177.1" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.5" cy="236.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="174.2" cy="175.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="175.6" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="129.8" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="187.4" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.0" cy="202.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.4" cy="123.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.0" cy="225.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="194.0" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="168.3" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.3" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.1" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.9" cy="163.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="232.2" cy="224.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.5" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.3" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.2" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="284.5" cy="229.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.7" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="182.1" cy="209.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="213.5" cy="202.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.4" cy="225.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="164.2" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.6" cy="207.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.6" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.1" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.7" cy="155.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.9" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="254.0" cy="222.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.0" cy="167.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.7" cy="237.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.9" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.4" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.5" cy="208.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="194.2" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.0" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="298.8" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.4" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="286.6" cy="213.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="135.3" cy="238.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="188.5" cy="208.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.5" cy="224.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.3" cy="215.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="230.6" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="183.2" cy="228.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.5" cy="232.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="182.3" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.8" cy="228.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.3" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.4" cy="210.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.9" cy="219.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.2" cy="214.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.0" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.6" cy="221.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.7" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.5" cy="228.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.7" cy="220.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="277.2" cy="219.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="320.2" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.9" cy="230.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="227.5" cy="182.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="259.5" cy="191.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.4" cy="216.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="190.3" cy="201.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.2" cy="208.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.4" cy="219.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.3" cy="212.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.6" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.6" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="304.7" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.5" cy="233.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.0" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.2" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="171.6" cy="197.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.7" cy="208.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="242.2" cy="142.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="290.6" cy="239.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="176.6" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.3" cy="173.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.8" cy="226.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="168.7" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.1" cy="194.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="248.1" cy="196.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="255.2" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="294.7" cy="233.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="269.9" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="303.1" cy="238.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="201.3" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="275.8" cy="232.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.5" cy="228.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="261.1" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.5" cy="225.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.5" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="331.6" cy="226.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="282.7" cy="227.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.1" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="168.9" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="181.1" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.2" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.3" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.2" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="264.6" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="171.6" cy="230.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.2" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="165.5" cy="218.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="206.0" cy="233.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.8" cy="214.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="149.0" cy="242.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.3" cy="209.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.5" cy="220.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.3" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.7" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="183.2" cy="224.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="281.3" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.6" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.9" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.9" cy="224.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="196.0" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.6" cy="125.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.3" cy="195.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.1" cy="226.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.8" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="182.6" cy="176.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.1" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.2" cy="211.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="171.1" cy="235.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="166.9" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="169.5" cy="176.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.8" cy="229.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="165.5" cy="223.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="222.9" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="230.4" cy="230.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="170.5" cy="211.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.4" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.4" cy="194.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="285.4" cy="190.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="174.4" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="166.7" cy="225.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.2" cy="231.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="216.3" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="172.2" cy="238.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.6" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="206.0" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="143.5" cy="223.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="264.6" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="176.2" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="271.5" cy="231.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.2" cy="230.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="280.3" cy="221.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.4" cy="232.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="286.6" cy="234.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="232.2" cy="227.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.7" cy="224.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="149.0" cy="234.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.3" cy="231.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.1" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.0" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.3" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.9" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="222.0" cy="223.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="253.4" cy="190.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="231.0" cy="124.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="246.5" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="264.0" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="242.2" cy="221.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.6" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.6" cy="229.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.1" cy="225.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="188.0" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.0" cy="187.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="282.7" cy="118.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.7" cy="130.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="278.0" cy="183.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.1" cy="187.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="267.6" cy="206.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.8" cy="192.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="254.0" cy="214.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.7" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.2" cy="218.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="236.1" cy="214.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.5" cy="178.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.7" cy="222.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.2" cy="215.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.5" cy="150.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="257.1" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.5" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.6" cy="227.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.4" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.3" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.4" cy="171.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.3" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.2" cy="198.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.8" cy="189.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="188.0" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.8" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.0" cy="226.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="206.2" cy="234.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="227.1" cy="237.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.7" cy="192.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.5" cy="203.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.3" cy="228.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.2" cy="178.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.6" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="286.8" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.9" cy="204.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.8" cy="212.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.8" cy="234.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="280.7" cy="192.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.8" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="263.2" cy="182.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.7" cy="221.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.4" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.7" cy="205.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.8" cy="225.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="287.4" cy="233.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.3" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.9" cy="230.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="190.7" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.0" cy="228.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.8" cy="231.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="150.0" cy="208.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.1" cy="233.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="280.7" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="222.9" cy="200.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.2" cy="194.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.6" cy="204.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.4" cy="211.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="249.1" cy="196.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.3" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="164.2" cy="209.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="205.4" cy="214.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.5" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="281.7" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="235.7" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="239.6" cy="223.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="177.1" cy="224.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.0" cy="217.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.9" cy="218.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.9" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="184.8" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="227.5" cy="169.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="276.4" cy="218.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.4" cy="225.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="268.5" cy="230.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="173.2" cy="236.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="192.7" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="245.7" cy="210.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="235.3" cy="202.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="170.7" cy="208.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="255.4" cy="229.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="216.5" cy="229.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.0" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="222.7" cy="230.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.7" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.4" cy="222.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.8" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="215.9" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="260.3" cy="220.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="228.1" cy="223.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="269.7" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.0" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="181.3" cy="214.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.4" cy="195.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="259.5" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="269.5" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.4" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.0" cy="219.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="283.5" cy="226.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.9" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.9" cy="206.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="173.4" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="245.0" cy="205.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="242.2" cy="232.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.6" cy="227.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="285.4" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="266.8" cy="207.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="261.9" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="213.3" cy="183.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.8" cy="238.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="216.3" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.9" cy="196.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="226.3" cy="188.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.2" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="271.7" cy="237.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="234.5" cy="232.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="285.1" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.6" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="159.3" cy="228.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.6" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.6" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="151.2" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="167.1" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="167.9" cy="234.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.0" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.9" cy="125.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.1" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.9" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="194.2" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="191.3" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.8" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.9" cy="221.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="306.3" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.7" cy="146.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="213.3" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.0" cy="234.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.0" cy="215.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="278.8" cy="171.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.9" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.9" cy="218.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.1" cy="241.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.6" cy="202.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.6" cy="202.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="239.3" cy="211.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="230.6" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.1" cy="209.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="189.5" cy="214.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="232.4" cy="215.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="242.8" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.7" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="255.4" cy="224.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="243.2" cy="223.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.7" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.0" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="193.3" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="245.7" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.3" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="291.7" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="246.9" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.0" cy="226.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="200.3" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="186.6" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="190.5" cy="242.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="251.6" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.3" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="208.4" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="228.6" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="265.6" cy="213.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="259.9" cy="222.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.2" cy="197.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="256.9" cy="225.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.7" cy="213.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="229.4" cy="207.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="276.2" cy="212.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="240.6" cy="227.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="197.6" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="198.0" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="154.7" cy="158.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="209.8" cy="188.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.1" cy="207.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.9" cy="227.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="201.7" cy="210.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="270.7" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="261.3" cy="206.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="254.0" cy="218.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="238.3" cy="223.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="211.5" cy="226.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="223.9" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="190.9" cy="204.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="210.2" cy="228.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.8" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="269.5" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="247.3" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="291.1" cy="208.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="180.9" cy="162.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.6" cy="233.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="178.1" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="218.8" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="248.7" cy="225.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="244.8" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="253.8" cy="227.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.0" cy="221.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.4" cy="212.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="217.4" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="220.2" cy="224.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="177.5" cy="205.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="235.7" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="204.7" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="264.6" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.0" cy="219.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="219.6" cy="228.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="273.3" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="202.9" cy="213.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.5" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="201.9" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="237.7" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="239.1" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="221.0" cy="186.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="224.5" cy="224.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="225.9" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="233.6" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="172.0" cy="231.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="214.9" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="169.9" cy="219.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="212.1" cy="226.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="174.0" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="185.4" cy="210.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="231.0" cy="203.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="195.0" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="199.0" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="172.0" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="203.3" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="207.4" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="172.6" cy="184.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="181.7" cy="196.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <path d="M 238.5 42 l -5 8 l 10 0 z" class="f-accent"/>
  <text x="230.5" y="51.0" text-anchor="end" class="f-mono f-accent" style="font-size:10px">Sandy 2,70 ↑</text>
  <rect x="395" y="40" width="275" height="216" class="f-box" style="fill:none"/>
  <text x="395.0" y="30.0" text-anchor="start" class="f-label" style="font-size:12px">Бостон, тау −0,007</text>
  <line x1="391" y1="240.6" x2="395" y2="240.6" class="f-plain"/>
  <text x="388.0" y="244.6" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0,5</text>
  <line x1="391" y1="163.4" x2="395" y2="163.4" class="f-plain"/>
  <text x="388.0" y="167.4" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1,0</text>
  <line x1="391" y1="86.3" x2="395" y2="86.3" class="f-plain"/>
  <text x="388.0" y="90.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1,5</text>
  <line x1="471.4" y1="256" x2="471.4" y2="260" class="f-plain"/>
  <text x="471.4" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2,5</text>
  <line x1="547.8" y1="256" x2="547.8" y2="260" class="f-plain"/>
  <text x="547.8" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3,0</text>
  <line x1="624.2" y1="256" x2="624.2" y2="260" class="f-plain"/>
  <text x="624.2" y="272.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3,5</text>
  <line x1="571.6" y1="40" x2="571.6" y2="256" class="f-line" style="stroke:var(--accent);stroke-dasharray:4 4"/>
  <text x="575.6" y="54" class="f-mono f-accent" style="font-size:10px"><tspan x="575.6">верхняя</tspan><tspan x="575.6" dy="12">четверть →</tspan></text>
  <circle cx="607.5" cy="243.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.1" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="608.0" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.7" cy="212.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.4" cy="252.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="523.2" cy="248.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.1" cy="206.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="515.5" cy="244.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="574.4" cy="241.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="518.4" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.7" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.9" cy="239.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="600.2" cy="241.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.9" cy="246.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.0" cy="192.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="513.3" cy="186.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="477.7" cy="240.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.9" cy="209.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.0" cy="223.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.2" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.7" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.4" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.5" cy="224.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.8" cy="252.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.7" cy="248.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="498.9" cy="185.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="590.6" cy="207.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.2" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="596.7" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="558.2" cy="250.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.3" cy="239.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.7" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.0" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.8" cy="248.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.3" cy="187.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.2" cy="240.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="498.9" cy="219.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="467.6" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.1" cy="250.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="511.0" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.1" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="440.8" cy="252.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="615.9" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.4" cy="173.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.4" cy="224.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="500.1" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.3" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="470.8" cy="225.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.7" cy="240.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.7" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.4" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="490.6" cy="236.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.3" cy="213.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="619.7" cy="240.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.3" cy="231.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="624.3" cy="202.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.1" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="461.6" cy="249.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.2" cy="217.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.6" cy="250.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.8" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.4" cy="229.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.7" cy="250.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="469.1" cy="235.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.4" cy="246.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="471.4" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="522.4" cy="200.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.8" cy="241.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.7" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.4" cy="246.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="516.3" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.9" cy="215.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="607.1" cy="245.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.3" cy="212.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="601.3" cy="215.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.6" cy="189.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="587.5" cy="192.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.3" cy="213.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.8" cy="252.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="568.6" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.7" cy="222.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.7" cy="244.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.7" cy="216.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="480.6" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.0" cy="208.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.0" cy="245.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="571.3" cy="230.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="506.2" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.5" cy="211.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="490.3" cy="252.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.6" cy="245.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="518.6" cy="200.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="492.3" cy="212.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.6" cy="239.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="449.7" cy="167.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="467.0" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="493.4" cy="245.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.0" cy="253.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="581.7" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.0" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.2" cy="245.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="519.1" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="498.0" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.8" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="588.3" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="514.3" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="485.0" cy="218.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.8" cy="229.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.6" cy="202.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.8" cy="249.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="594.8" cy="216.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.3" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.5" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.6" cy="184.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.4" cy="244.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.6" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="608.0" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="641.1" cy="224.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="611.0" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="511.4" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="504.8" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="501.3" cy="248.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="568.7" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.6" cy="222.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="471.2" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.0" cy="244.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.5" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.5" cy="245.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="581.8" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.2" cy="252.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.8" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="511.7" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.6" cy="249.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.8" cy="224.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.1" cy="246.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.8" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.1" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.3" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="574.8" cy="240.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.6" cy="211.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="511.1" cy="218.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.6" cy="251.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.5" cy="252.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="632.7" cy="218.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.4" cy="244.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.2" cy="200.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.3" cy="149.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.8" cy="168.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.6" cy="177.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.5" cy="202.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="505.8" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="499.3" cy="229.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.8" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.3" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="474.3" cy="247.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="610.1" cy="253.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="561.7" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="499.3" cy="240.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="536.9" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="597.7" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="515.1" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="466.7" cy="237.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="560.0" cy="223.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="484.5" cy="203.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="560.3" cy="219.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="498.4" cy="246.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.3" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.1" cy="253.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.3" cy="233.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="594.5" cy="211.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="513.4" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="529.0" cy="182.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.4" cy="197.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="461.8" cy="244.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="522.7" cy="230.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.5" cy="213.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.5" cy="235.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.6" cy="253.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.0" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="588.4" cy="248.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="588.7" cy="216.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="570.8" cy="235.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.7" cy="251.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="493.5" cy="167.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.2" cy="246.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="536.0" cy="252.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.5" cy="244.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.6" cy="249.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.4" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="461.8" cy="247.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.4" cy="250.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.8" cy="243.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.2" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="536.3" cy="165.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="598.8" cy="214.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.7" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="544.7" cy="235.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.8" cy="247.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="493.2" cy="239.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="536.5" cy="250.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.1" cy="252.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="511.1" cy="247.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.1" cy="219.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.3" cy="238.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.4" cy="166.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="478.7" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.1" cy="244.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.1" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.7" cy="244.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.0" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.3" cy="245.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="584.6" cy="241.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="546.7" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.1" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="474.4" cy="219.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.0" cy="208.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="478.1" cy="213.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.4" cy="234.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="484.5" cy="229.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.2" cy="245.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="579.7" cy="184.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.6" cy="211.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.5" cy="197.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.3" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.3" cy="248.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.3" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.5" cy="230.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="485.0" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="500.6" cy="229.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.4" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="563.4" cy="245.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.2" cy="214.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="505.8" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.9" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.8" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.0" cy="236.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.6" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.2" cy="243.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.2" cy="229.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.9" cy="248.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="505.0" cy="252.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="475.5" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.4" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="463.8" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="499.0" cy="237.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="575.6" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.3" cy="188.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="515.7" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="469.4" cy="249.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.4" cy="224.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.8" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="543.5" cy="211.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.9" cy="232.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="482.8" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.9" cy="244.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="572.8" cy="217.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="598.3" cy="210.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="605.5" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="615.0" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="641.0" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.7" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.0" cy="243.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="462.2" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.6" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="544.3" cy="244.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.4" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.5" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="647.1" cy="212.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="576.8" cy="225.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="569.8" cy="225.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.6" cy="208.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="609.0" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="521.8" cy="143.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="484.4" cy="214.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.6" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.9" cy="215.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="618.2" cy="213.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.4" cy="209.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.5" cy="214.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="504.5" cy="253.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.6" cy="236.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="596.7" cy="224.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="607.4" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="605.1" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="624.2" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="606.1" cy="248.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.8" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="486.4" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="604.9" cy="234.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="639.9" cy="246.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="618.8" cy="248.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.6" cy="250.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="488.5" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="570.7" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.2" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="588.4" cy="246.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="546.6" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.8" cy="227.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.0" cy="204.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.6" cy="248.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="608.0" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="578.3" cy="221.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.9" cy="234.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="554.7" cy="240.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="519.5" cy="247.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.3" cy="237.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.7" cy="248.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="490.6" cy="204.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.8" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="580.9" cy="220.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.9" cy="197.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.6" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="481.2" cy="232.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.0" cy="253.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="450.0" cy="218.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.5" cy="203.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.4" cy="213.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.1" cy="234.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.8" cy="247.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.6" cy="249.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="464.8" cy="219.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.8" cy="229.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="480.6" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.7" cy="203.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.4" cy="251.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.2" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="561.8" cy="247.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="627.8" cy="215.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.1" cy="243.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="487.0" cy="232.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="490.0" cy="233.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="435.3" cy="247.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.0" cy="217.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.5" cy="238.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="497.7" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.4" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.9" cy="150.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="468.5" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.1" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="606.6" cy="243.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.4" cy="219.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.4" cy="205.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="580.3" cy="251.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="437.3" cy="247.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.6" cy="248.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="437.6" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="448.2" cy="244.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.8" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.2" cy="231.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="610.3" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="544.1" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.4" cy="250.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.5" cy="207.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.3" cy="220.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.4" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.0" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="579.4" cy="235.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.6" cy="217.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.1" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.7" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.7" cy="249.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.7" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.0" cy="250.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.9" cy="249.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.0" cy="202.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.1" cy="151.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.7" cy="244.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="529.0" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.7" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.8" cy="192.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.3" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="569.5" cy="242.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="504.7" cy="225.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="487.6" cy="229.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.1" cy="234.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.3" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="497.2" cy="250.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.9" cy="225.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="617.1" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.9" cy="246.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.6" cy="240.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="614.1" cy="235.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.2" cy="247.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="519.2" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="488.0" cy="217.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.3" cy="248.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="628.0" cy="223.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="479.3" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.3" cy="249.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.2" cy="200.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.7" cy="217.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.4" cy="249.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.1" cy="199.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.2" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.7" cy="240.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.4" cy="231.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.6" cy="244.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.9" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="522.4" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.4" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.3" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.0" cy="247.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.0" cy="243.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="647.5" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.9" cy="249.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="480.6" cy="213.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.8" cy="105.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="629.5" cy="148.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="580.8" cy="221.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="561.4" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.5" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.2" cy="219.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.9" cy="242.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="487.7" cy="211.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.3" cy="248.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="577.3" cy="144.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.0" cy="239.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="603.5" cy="234.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="543.3" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="626.8" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.7" cy="252.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="642.2" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="583.8" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.6" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="585.7" cy="231.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="518.6" cy="253.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="482.7" cy="244.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.7" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="616.5" cy="250.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="598.5" cy="250.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.5" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="500.7" cy="246.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.8" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.5" cy="244.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="477.0" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="560.0" cy="239.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="563.4" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.2" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.3" cy="250.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.1" cy="212.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="463.4" cy="212.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.5" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="535.1" cy="236.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.3" cy="247.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.4" cy="226.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="483.8" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.9" cy="190.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="506.7" cy="178.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.1" cy="229.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.3" cy="250.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.3" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="554.2" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.7" cy="230.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="484.1" cy="252.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="541.4" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="629.8" cy="203.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.5" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.1" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="561.2" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="620.3" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="505.5" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="451.7" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.0" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.1" cy="253.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="585.7" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="471.2" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.6" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="452.6" cy="232.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="565.0" cy="211.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="479.8" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="454.3" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.7" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.8" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.7" cy="228.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="499.5" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.4" cy="239.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.0" cy="247.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="516.6" cy="211.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.7" cy="246.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.6" cy="208.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="563.1" cy="125.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.2" cy="236.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.2" cy="249.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="570.7" cy="229.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="472.8" cy="243.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="485.6" cy="252.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.8" cy="245.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="518.6" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="606.4" cy="217.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.9" cy="193.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="608.7" cy="182.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="541.7" cy="194.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="603.8" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.9" cy="242.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.5" cy="250.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="566.1" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.4" cy="236.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.8" cy="229.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="574.4" cy="249.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="500.7" cy="242.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="546.6" cy="244.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="596.1" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.7" cy="248.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="563.2" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.6" cy="208.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="577.3" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="575.0" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="544.7" cy="227.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.3" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.0" cy="218.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.8" cy="213.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.1" cy="238.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="615.6" cy="219.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.2" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.8" cy="234.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.2" cy="250.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.1" cy="236.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.2" cy="252.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="577.7" cy="246.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.0" cy="249.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="529.0" cy="238.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.0" cy="234.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.5" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="501.6" cy="220.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.5" cy="216.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="513.9" cy="218.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="518.8" cy="200.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.2" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.5" cy="247.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="526.7" cy="247.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.0" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="515.7" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.6" cy="241.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.2" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.0" cy="218.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.9" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="572.7" cy="214.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.4" cy="203.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="599.0" cy="250.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.4" cy="230.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="520.0" cy="215.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.7" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="558.2" cy="230.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="576.2" cy="222.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.8" cy="246.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.0" cy="231.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.2" cy="226.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="570.7" cy="199.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.5" cy="186.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.5" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.6" cy="225.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="510.0" cy="228.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.3" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.2" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.9" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="555.3" cy="224.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.5" cy="228.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="597.4" cy="204.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.7" cy="253.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="515.5" cy="248.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.3" cy="232.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="499.7" cy="162.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.5" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="487.7" cy="224.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.8" cy="243.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.2" cy="252.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.2" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.1" cy="224.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="546.7" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="592.4" cy="243.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="545.6" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.2" cy="248.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="619.9" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.0" cy="245.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="622.5" cy="233.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.5" cy="252.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="491.4" cy="252.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="468.0" cy="239.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="504.7" cy="190.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="630.7" cy="238.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="581.4" cy="227.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="542.9" cy="207.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="468.2" cy="249.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.0" cy="250.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="523.3" cy="245.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="595.6" cy="231.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="602.0" cy="231.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="643.6" cy="237.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="598.8" cy="252.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.6" cy="230.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.8" cy="215.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.6" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="486.5" cy="246.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.1" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="587.2" cy="240.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="503.3" cy="248.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.2" cy="211.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="496.8" cy="244.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="539.1" cy="230.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="473.2" cy="223.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.0" cy="244.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="509.1" cy="183.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="593.9" cy="253.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="534.5" cy="253.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="523.8" cy="222.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="538.5" cy="243.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.9" cy="240.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="513.7" cy="233.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.8" cy="174.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="528.5" cy="242.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="562.4" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="575.0" cy="250.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="583.4" cy="227.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="450.9" cy="232.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="576.8" cy="239.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="570.4" cy="209.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="532.3" cy="227.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="514.8" cy="226.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="507.1" cy="227.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.4" cy="237.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.1" cy="253.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.5" cy="228.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.1" cy="192.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="505.8" cy="233.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="546.7" cy="180.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="611.2" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="558.2" cy="248.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.1" cy="231.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="558.5" cy="213.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.0" cy="215.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="566.0" cy="205.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="530.7" cy="222.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="577.6" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="464.8" cy="240.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="567.0" cy="246.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="584.4" cy="229.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="647.8" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="508.4" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="540.1" cy="247.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="569.3" cy="237.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="543.2" cy="252.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="561.1" cy="251.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="547.2" cy="253.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.4" cy="248.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="557.4" cy="242.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="569.9" cy="168.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.6" cy="242.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="552.2" cy="225.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="535.3" cy="222.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="587.2" cy="252.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="602.0" cy="244.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="556.5" cy="223.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="614.8" cy="251.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="468.2" cy="246.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="524.7" cy="209.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="477.8" cy="238.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="596.8" cy="250.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="559.1" cy="244.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="553.6" cy="251.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.9" cy="217.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.9" cy="235.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="517.8" cy="253.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="525.0" cy="252.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="501.9" cy="245.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="640.5" cy="184.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="622.9" cy="253.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="619.1" cy="185.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="587.3" cy="188.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="612.3" cy="206.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="588.9" cy="233.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="596.5" cy="243.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.5" cy="229.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.3" cy="232.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="568.9" cy="231.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="550.8" cy="243.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="516.3" cy="228.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="531.3" cy="196.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.8" cy="207.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="578.5" cy="233.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="484.5" cy="212.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="551.6" cy="225.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="537.2" cy="247.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="527.9" cy="178.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="564.1" cy="249.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="501.9" cy="234.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="533.4" cy="222.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="492.3" cy="218.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="595.8" cy="246.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="502.7" cy="238.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="573.1" cy="245.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="576.7" cy="247.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="476.6" cy="241.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="535.9" cy="217.7" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.8" cy="232.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="500.4" cy="247.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="548.7" cy="243.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="614.4" cy="246.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="571.6" cy="235.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="558.9" cy="188.0" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="568.1" cy="231.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="563.4" cy="251.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="495.8" cy="230.9" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="470.0" cy="176.4" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="512.0" cy="228.8" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="464.1" cy="228.2" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="549.0" cy="209.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="582.5" cy="224.5" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="489.7" cy="251.1" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="486.5" cy="246.3" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="494.6" cy="242.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <circle cx="498.9" cy="239.6" r="1.8" class="f-ink" style="fill-opacity:0.35"/>
  <text x="202.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">предсказанная полная вода, м</text>
  <text x="532.0" y="288.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">предсказанная полная вода, м</text>
  <text x="10.0" y="10.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">↑ нагон, м</text>
</svg>
<figcaption>NOAA CO-OPS, часовые высоты и предсказанные полные воды с 1921 по 2022 год. Нагон за вычетом медианы своего года.</figcaption>
</figure>

В первом ожидании было и число: от 20 до 30% экстремальных нагонов придут на полную воду из верхней четверти. На The Battery вышло 14,9%, в Бостоне 19,5%, оба ниже моего диапазона. Я не сразу понял почему. Из 669 экстремумов на The Battery 144 пришлись на декабрь и 121 на январь, на июль ни одного. Средняя предсказанная полная вода в январе 1,34 м, в сентябре 1,55 м, то есть большинство штормов приходит, когда приливы ниже. Если считать по месяцам, ожидаемая доля 17,4% и 22,0% и разница незначима.

Уильямс, Хорсбург и соавторы показали это в 2016 году на 77 приливомерах, среди них Нью-Йорк, с учётом сезонного эффекта. Я только повторил это на открытых данных NOAA по 2022 год.

## Sandy и Бостон

Пик Sandy на The Battery был 4,28 м над средним уровнем низших малых вод (MLLW) по 6-минутным данным, в 01:12 UTC 30 октября. В часовых данных, которые я везде здесь использую, это 4,26 м. Полная вода, предсказанная на 00:48, была 1,48 м. Было полнолуние, но это была меньшая из 2 полных вод тех суток. Среди всех полных вод с 1921 года она стоит на 56-м перцентиле. Почти весь Sandy это нагон, 2,79 м, самый большой за все годы наблюдений, с большим отрывом. С самой высокой предсказанной полной водой в пределах 15 дней, 1,93 м, тот же нагон дал бы 4,71 м.

Бостон устроен иначе. Из его 20 самых высоких вод 16 пришли на полную воду из верхней четверти. Рекорд держит шторм 4 января 2018 года. NOAA поставила его на 2 см выше бурана 1978 года, в моих часовых данных у обоих 4,58 м. В 2018 году прилив стоял на 98,5-м перцентиле, а нагон был 0,97 м. После поправки на уровень моря он даже не входит в 20 крупнейших нагонов Бостона. На The Battery из 20 самых высоких вод на верхнюю четверть пришлись 10, то есть ровно половина, а не меньше, как я ожидал.

<figure class="fig">
<svg viewBox="0 0 680 442" role="img" aria-label="Горизонтальные столбцы для 10 самых высоких вод на каждой станции, The Battery сверху и Бостон снизу. В каждом столбце 2 части: предсказанный прилив и нагон поверх него, в метрах над средним уровнем низших малых вод. The Battery, Нью-Йорк: 2012-10-30 1,48 + 2,79 = 4,26; 1960-09-12 1,47 + 1,58 = 3,05; 1992-12-11 1,69 + 1,26 = 2,96; 2011-08-28 1,64 + 1,24 = 2,87; 1953-11-07 1,63 + 1,21 = 2,84; 1950-11-25 1,57 + 1,18 = 2,74; 1962-03-07 1,66 + 1,06 = 2,72; 2010-03-13 1,35 + 1,35 = 2,69; 1991-10-31 1,44 + 1,20 = 2,64; 1978-02-07 1,50 + 1,10 = 2,60. Бостон: 1978-02-07 3,54 + 1,04 = 4,58; 2018-01-04 3,61 + 0,97 = 4,58; 2018-03-02 3,47 + 0,97 = 4,43; 1991-10-30 3,10 + 1,22 = 4,32; 1987-01-02 3,54 + 0,73 = 4,27; 1992-12-12 3,40 + 0,87 = 4,27; 1979-01-25 3,19 + 1,05 = 4,25; 1959-12-29 3,65 + 0,57 = 4,22; 2014-01-03 3,65 + 0,55 = 4,20; 2007-04-18 3,63 + 0,57 = 4,19.">
  <rect x="120" y="6" width="12" height="10" class="f-ink" style="fill-opacity:0.3"/>
  <text x="136.0" y="15.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">предсказанный прилив</text>
  <rect x="290" y="6" width="12" height="10" class="f-accent"/>
  <text x="306.0" y="15.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">нагон</text>
  <text x="634.0" y="15.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">перц.</text>
  <text x="10.0" y="42.0" text-anchor="start" class="f-label" style="font-size:12px">The Battery, Нью-Йорк</text>
  <text x="112.0" y="60.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2012-10-30</text>
  <rect x="120" y="50" width="138.8" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="258.8" y="50" width="261.9" height="12" class="f-accent"/>
  <text x="525.7" y="60.0" text-anchor="start" class="f-mono" style="font-size:10px">4,26</text>
  <text x="634.0" y="60.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">56</text>
  <text x="112.0" y="77.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1960-09-12</text>
  <rect x="120" y="67" width="137.9" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="257.9" y="67" width="149.0" height="12" class="f-accent"/>
  <text x="411.9" y="77.0" text-anchor="start" class="f-mono" style="font-size:10px">3,05</text>
  <text x="634.0" y="77.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">54</text>
  <text x="112.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1992-12-11</text>
  <rect x="120" y="84" width="159.2" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="279.2" y="84" width="118.7" height="12" class="f-accent"/>
  <text x="403.0" y="94.0" text-anchor="start" class="f-mono" style="font-size:10px">2,96</text>
  <text x="634.0" y="94.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">89</text>
  <text x="112.0" y="111.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2011-08-28</text>
  <rect x="120" y="101" width="153.7" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="273.7" y="101" width="116.2" height="12" class="f-accent"/>
  <text x="394.9" y="111.0" text-anchor="start" class="f-mono" style="font-size:10px">2,87</text>
  <text x="634.0" y="111.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">82</text>
  <text x="112.0" y="128.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1953-11-07</text>
  <rect x="120" y="118" width="153.4" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="273.4" y="118" width="113.4" height="12" class="f-accent"/>
  <text x="391.8" y="128.0" text-anchor="start" class="f-mono" style="font-size:10px">2,84</text>
  <text x="634.0" y="128.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">82</text>
  <text x="112.0" y="145.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1950-11-25</text>
  <rect x="120" y="135" width="147.2" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="267.2" y="135" width="110.4" height="12" class="f-accent"/>
  <text x="382.7" y="145.0" text-anchor="start" class="f-mono" style="font-size:10px">2,74</text>
  <text x="634.0" y="145.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">72</text>
  <text x="112.0" y="162.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1962-03-07</text>
  <rect x="120" y="152" width="155.8" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="275.8" y="152" width="99.6" height="12" class="f-accent"/>
  <text x="380.4" y="162.0" text-anchor="start" class="f-mono" style="font-size:10px">2,72</text>
  <text x="634.0" y="162.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">85</text>
  <text x="112.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2010-03-13</text>
  <rect x="120" y="169" width="126.5" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="246.5" y="169" width="126.7" height="12" class="f-accent"/>
  <text x="378.2" y="179.0" text-anchor="start" class="f-mono" style="font-size:10px">2,69</text>
  <text x="634.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">29</text>
  <text x="112.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1991-10-31</text>
  <rect x="120" y="186" width="135.4" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="255.4" y="186" width="113.1" height="12" class="f-accent"/>
  <text x="373.4" y="196.0" text-anchor="start" class="f-mono" style="font-size:10px">2,64</text>
  <text x="634.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">48</text>
  <text x="112.0" y="213.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1978-02-07</text>
  <rect x="120" y="203" width="140.5" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="260.5" y="203" width="103.7" height="12" class="f-accent"/>
  <text x="369.2" y="213.0" text-anchor="start" class="f-mono" style="font-size:10px">2,60</text>
  <text x="634.0" y="213.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">60</text>
  <text x="10.0" y="236.0" text-anchor="start" class="f-label" style="font-size:12px">Бостон</text>
  <text x="112.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1978-02-07</text>
  <rect x="120" y="244" width="332.3" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="452.3" y="244" width="98.2" height="12" class="f-accent"/>
  <text x="555.5" y="254.0" text-anchor="start" class="f-mono" style="font-size:10px">4,58</text>
  <text x="634.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">96</text>
  <text x="112.0" y="271.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2018-01-04</text>
  <rect x="120" y="261" width="339.1" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="459.1" y="261" width="91.4" height="12" class="f-accent"/>
  <text x="555.4" y="271.0" text-anchor="start" class="f-mono" style="font-size:10px">4,58</text>
  <text x="634.0" y="271.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">98</text>
  <text x="112.0" y="288.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2018-03-02</text>
  <rect x="120" y="278" width="325.9" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="445.9" y="278" width="90.8" height="12" class="f-accent"/>
  <text x="541.7" y="288.0" text-anchor="start" class="f-mono" style="font-size:10px">4,43</text>
  <text x="634.0" y="288.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">94</text>
  <text x="112.0" y="305.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1991-10-30</text>
  <rect x="120" y="295" width="291.4" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="411.4" y="295" width="114.5" height="12" class="f-accent"/>
  <text x="530.9" y="305.0" text-anchor="start" class="f-mono" style="font-size:10px">4,32</text>
  <text x="634.0" y="305.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">68</text>
  <text x="112.0" y="322.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1987-01-02</text>
  <rect x="120" y="312" width="332.5" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="452.5" y="312" width="68.5" height="12" class="f-accent"/>
  <text x="526.0" y="322.0" text-anchor="start" class="f-mono" style="font-size:10px">4,27</text>
  <text x="634.0" y="322.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">96</text>
  <text x="112.0" y="339.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1992-12-12</text>
  <rect x="120" y="329" width="319.5" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="439.5" y="329" width="81.5" height="12" class="f-accent"/>
  <text x="526.0" y="339.0" text-anchor="start" class="f-mono" style="font-size:10px">4,27</text>
  <text x="634.0" y="339.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">91</text>
  <text x="112.0" y="356.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1979-01-25</text>
  <rect x="120" y="346" width="300.1" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="420.1" y="346" width="99.2" height="12" class="f-accent"/>
  <text x="524.3" y="356.0" text-anchor="start" class="f-mono" style="font-size:10px">4,25</text>
  <text x="634.0" y="356.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">78</text>
  <text x="112.0" y="373.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1959-12-29</text>
  <rect x="120" y="363" width="343.1" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="463.1" y="363" width="53.9" height="12" class="f-accent"/>
  <text x="522.0" y="373.0" text-anchor="start" class="f-mono" style="font-size:10px">4,22</text>
  <text x="634.0" y="373.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">99</text>
  <text x="112.0" y="390.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2014-01-03</text>
  <rect x="120" y="380" width="343.6" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="463.6" y="380" width="51.5" height="12" class="f-accent"/>
  <text x="520.1" y="390.0" text-anchor="start" class="f-mono" style="font-size:10px">4,20</text>
  <text x="634.0" y="390.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">99</text>
  <text x="112.0" y="407.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2007-04-18</text>
  <rect x="120" y="397" width="340.9" height="12" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="460.9" y="397" width="53.2" height="12" class="f-accent"/>
  <text x="519.1" y="407.0" text-anchor="start" class="f-mono" style="font-size:10px">4,19</text>
  <text x="634.0" y="407.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">98</text>
  <line x1="120.0" y1="418" x2="120.0" y2="422" class="f-plain"/>
  <text x="120.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0 м</text>
  <line x1="214.0" y1="418" x2="214.0" y2="422" class="f-plain"/>
  <text x="214.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">1 м</text>
  <line x1="308.0" y1="418" x2="308.0" y2="422" class="f-plain"/>
  <text x="308.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">2 м</text>
  <line x1="402.0" y1="418" x2="402.0" y2="422" class="f-plain"/>
  <text x="402.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3 м</text>
  <line x1="496.0" y1="418" x2="496.0" y2="422" class="f-plain"/>
  <text x="496.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4 м</text>
  <line x1="590.0" y1="418" x2="590.0" y2="422" class="f-plain"/>
  <text x="590.0" y="434.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5 м</text>
</svg>
<figcaption>Часовой максимум, без поправки на подъём моря. Число справа: перцентиль предсказанной полной воды среди всех полных вод с 1921 года.</figcaption>
</figure>

Совпадения, которые не случились, мне интереснее. 7 декабря 2003 года в Бостоне был нагон 1,04 м на приливе 13-го перцентиля. Вода остановилась на 3,73 м, ниже порога слабого затопления. С самой высокой полной водой в пределах 15 дней было бы 4,76 м, выше рекорда.

Я ожидал, что хотя бы 3 из 20 крупнейших нагонов на The Battery на таком приливе перешли бы порог сильного затопления. Из 15, что остались ниже него, перешли бы 12. В Бостоне порог сильного затопления, 4,43 м по Национальной океанской службе NOAA, перешёл только 1 из 20. Ещё 13 перешли бы его, 2 из них с запасом меньше 2 см. Это простая сумма, которая предполагает, что нагон не меняется вместе с приливом. Независимость, показанная выше, делает это допущение разумным, но не доказывает, что один и тот же шторм принёс бы на другом приливе тот же нагон.

<figure class="fig">
<svg viewBox="0 0 680 376" role="img" aria-label="Диаграмма 20 крупнейших нагонов в Бостоне с 1921 года. Для каждого полый кружок показывает воду, которая пришла на самом деле, а закрашенный ту, что дал бы тот же нагон на самой высокой предсказанной полной воде в пределах 15 дней, их соединяет линия. Пунктирные вертикали отмечают пороги слабого, умеренного и сильного затопления, 3,76, 4,02 и 4,43 м и рекорд 4,58 м. На деле порог сильного затопления перешёл только 1 шторм, февраль 1978 года. На самом высоком приливе его перешли бы ещё 13. 1929-04-16 3,44 → 4,18; 1936-01-20 3,16 → 4,25; 1945-11-30 3,70 → 4,72; 1950-11-26 3,51 → 4,57; 1952-02-18 3,85 → 4,40; 1954-08-31 3,94 → 4,46; 1960-03-04 3,89 → 4,46; 1968-11-12 3,78 → 4,72; 1972-02-19 4,17 → 4,43; 1978-02-07 4,45 → 4,87; 1979-01-25 4,25 → 4,71; 1984-03-30 3,62 → 4,42; 1991-10-30 4,32 → 4,66; 1992-12-12 4,27 → 4,27; 2003-12-07 3,73 → 4,76; 2010-12-27 4,16 → 4,44; 2013-02-09 3,97 → 4,42; 2015-01-27 4,16 → 4,60; 2019-10-17 3,90 → 4,63; 2021-10-27 3,53 → 4,72.">
  <line x1="318.0" y1="30" x2="318.0" y2="334" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="318.0" y="16.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">слабое 3,76</text>
  <line x1="391.9" y1="30" x2="391.9" y2="334" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="391.9" y="26.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">умеренное 4,02</text>
  <line x1="502.2" y1="30" x2="502.2" y2="334" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="502.2" y="16.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">сильное 4,43</text>
  <line x1="544.5" y1="30" x2="544.5" y2="334" class="f-line" style="stroke:var(--muted);stroke-dasharray:1 3"/>
  <text x="544.5" y="26.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">рекорд 4,58</text>
  <text x="102.0" y="45.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1929-04-16</text>
  <line x1="230.2" y1="41.5" x2="434.5" y2="41.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="434.5" cy="41.5" r="4" class="f-accent"/>
  <circle cx="230.2" cy="41.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="60.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1936-01-20</text>
  <line x1="154.8" y1="56.5" x2="454.8" y2="56.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="454.8" cy="56.5" r="4" class="f-accent"/>
  <circle cx="154.8" cy="56.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="75.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1945-11-30</text>
  <line x1="303.0" y1="71.5" x2="583.0" y2="71.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="583.0" cy="71.5" r="4" class="f-accent"/>
  <circle cx="303.0" cy="71.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="90.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1950-11-26</text>
  <line x1="251.1" y1="86.5" x2="540.9" y2="86.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="540.9" cy="86.5" r="4" class="f-accent"/>
  <circle cx="251.1" cy="86.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="105.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1952-02-18</text>
  <line x1="343.5" y1="101.5" x2="493.9" y2="101.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="493.9" cy="101.5" r="4" class="f-accent"/>
  <circle cx="343.5" cy="101.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="120.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1954-08-31</text>
  <line x1="368.5" y1="116.5" x2="512.9" y2="116.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="512.9" cy="116.5" r="4" class="f-accent"/>
  <circle cx="368.5" cy="116.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="135.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1960-03-04</text>
  <line x1="354.2" y1="131.5" x2="511.2" y2="131.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="511.2" cy="131.5" r="4" class="f-accent"/>
  <circle cx="354.2" cy="131.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="150.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1968-11-12</text>
  <line x1="324.8" y1="146.5" x2="583.8" y2="146.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="583.8" cy="146.5" r="4" class="f-accent"/>
  <circle cx="324.8" cy="146.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="165.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1972-02-19</text>
  <line x1="433.1" y1="161.5" x2="504.6" y2="161.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="504.6" cy="161.5" r="4" class="f-accent"/>
  <circle cx="433.1" cy="161.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="180.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1978-02-07</text>
  <line x1="507.6" y1="176.5" x2="624.3" y2="176.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="624.3" cy="176.5" r="4" class="f-accent"/>
  <circle cx="507.6" cy="176.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="195.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1979-01-25</text>
  <line x1="453.2" y1="191.5" x2="579.2" y2="191.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="579.2" cy="191.5" r="4" class="f-accent"/>
  <circle cx="453.2" cy="191.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="210.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1984-03-30</text>
  <line x1="281.3" y1="206.5" x2="499.7" y2="206.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="499.7" cy="206.5" r="4" class="f-accent"/>
  <circle cx="281.3" cy="206.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="225.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1991-10-30</text>
  <line x1="472.4" y1="221.5" x2="566.2" y2="221.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="566.2" cy="221.5" r="4" class="f-accent"/>
  <circle cx="472.4" cy="221.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="240.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1992-12-12</text>
  <line x1="458.1" y1="236.5" x2="458.1" y2="236.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="458.1" cy="236.5" r="4" class="f-accent"/>
  <circle cx="458.1" cy="236.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="255.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2003-12-07</text>
  <line x1="310.8" y1="251.5" x2="594.0" y2="251.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="594.0" cy="251.5" r="4" class="f-accent"/>
  <circle cx="310.8" cy="251.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="270.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2010-12-27</text>
  <line x1="429.0" y1="266.5" x2="506.0" y2="266.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="506.0" cy="266.5" r="4" class="f-accent"/>
  <circle cx="429.0" cy="266.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="285.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2013-02-09</text>
  <line x1="375.9" y1="281.5" x2="500.0" y2="281.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="500.0" cy="281.5" r="4" class="f-accent"/>
  <circle cx="375.9" cy="281.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="300.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2015-01-27</text>
  <line x1="427.6" y1="296.5" x2="550.3" y2="296.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="550.3" cy="296.5" r="4" class="f-accent"/>
  <circle cx="427.6" cy="296.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="315.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2019-10-17</text>
  <line x1="356.1" y1="311.5" x2="559.6" y2="311.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="559.6" cy="311.5" r="4" class="f-accent"/>
  <circle cx="356.1" cy="311.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="102.0" y="330.5" text-anchor="end" class="f-mono f-muted" style="font-size:10px">2021-10-27</text>
  <line x1="255.7" y1="326.5" x2="584.1" y2="326.5" class="f-line" style="stroke:var(--muted)"/>
  <circle cx="584.1" cy="326.5" r="4" class="f-accent"/>
  <circle cx="255.7" cy="326.5" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <line x1="110.0" y1="334" x2="110.0" y2="338" class="f-plain"/>
  <text x="110.0" y="350.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3,0 м</text>
  <line x1="247.5" y1="334" x2="247.5" y2="338" class="f-plain"/>
  <text x="247.5" y="350.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">3,5 м</text>
  <line x1="385.0" y1="334" x2="385.0" y2="338" class="f-plain"/>
  <text x="385.0" y="350.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4,0 м</text>
  <line x1="522.5" y1="334" x2="522.5" y2="338" class="f-plain"/>
  <text x="522.5" y="350.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">4,5 м</text>
  <line x1="660.0" y1="334" x2="660.0" y2="338" class="f-plain"/>
  <text x="660.0" y="350.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5,0 м</text>
  <circle cx="116" cy="362" r="4" style="fill:var(--bg, #fff);stroke:var(--ink, currentColor);stroke-width:1.5"/>
  <text x="126.0" y="366.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">на деле</text>
  <circle cx="236" cy="362" r="4" class="f-accent"/>
  <text x="246.0" y="366.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">на самой высокой воде за ±15 дней</text>
</svg>
<figcaption>Бостон, часовой максимум на той полной воде, где нагон шторма был наибольшим, поэтому у 1978 года 4,45 м, а не 4,58 м следующего прилива. Пороги затопления по формуле NOAA 2018 года (Sweet и соавторы). Сценарий прибавляет нагон к самой высокой предсказанной полной воде в пределах 15 дней.</figcaption>
</figure>

## Ураганы

Я сопоставил каждое событие с HURDAT2: точка трека циклона в пределах 500 км от приливомера и 24 часов от пика. На The Battery она есть у 4 из 20 крупнейших нагонов, в Бостоне у 3.

Потом я прочитал треки. 2 из этих штормов, октябрь 1991 года и Ванда 2021 года, начинаются в каталоге как внетропические циклоны, то есть здесь каталог записал сам нор'истер. Донна 1960 года и Айрин были тропическими возле Нью-Йорка. Кэрол 1954 года стала внетропической за несколько часов до пика в Бостоне, Sandy незадолго до выхода на берег. Значит, тропических циклонов 2 или 3 из 20 на The Battery и не больше 1 в Бостоне, меньше половины, как я и ожидал. Всё остальное обычные штормы, в основном с октября по март.

## Чего я не проверял

Обе станции стоят на одном побережье с одним типом прилива. По сравнению с 6-минутными полными водами NOAA часовые данные занижают пик не больше чем на 3,6 см на The Battery в 99% случаев. В Бостоне не больше чем на 7 см. Окно в 3 дня между событиями и радиус 500 км выбрал я сам и другие значения не пробовал. Сценарий с более высоким приливом не учитывает, как нагон и прилив влияют друг на друга на мелководье, Хорсбург и Уилсон описали это для Северного моря в 2007 году. Волн и дождя в приливомере нет вообще. Данные об ущербе я не смотрел, так что порог затопления здесь это только порог NOAA.
