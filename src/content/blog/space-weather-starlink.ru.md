---
title: "Буря, которая унесла 38 Starlink, была слабой, а каталог увидел только 6"
description: "Kp GFZ, Dst Киото и каталог CelesTrak против февральской бури 2022 года, которая забрала 38 спутников Starlink: обычная G1, таких дней в 2022 году 35, каталог показывает строками только 6 потерь, а 2 запуска встретили погоду хуже и ничего не потеряли."
date: 2022-12-22
lang: ru
translationKey: space-weather-starlink
tags: ["open-data", "reliability"]
---
В феврале я прочитал заголовок о том, что солнечная буря уничтожила 40 спутников Starlink. Я представил себе что-то огромное и принял историю как есть, не посмотрев ни на одно число. В этом месяце я наконец посмотрел, потому что хотел знать 2 вещи. Насколько сильной была эта буря по сравнению с остальным 2022 годом? И была ли она особенной для Starlink или другие запуски проходили через такую же погоду без потерь?

Катаока с соавторами выложили препринт в марте, сейчас он принят в журнал. Данг с соавторами опубликовали свою работу в августе. Команда NOAA и CIRES написала третью вместе с инженерами SpaceX. Все три о том, насколько плотной была верхняя атмосфера в те дни. Их модели я не повторял, я хотел только сверить историю с открытыми таблицами, которые может скачать любой.

## Таблицы

Индекс Kp от GFZ в Потсдаме это одно число на каждые 3 часа, от 0 до 9, которое говорит, насколько возмущено магнитное поле Земли в целом. На нём построена шкала бурь NOAA: Kp 5 это буря G1, 6 это G2, 7 это G3. Kp меняется с шагом в треть, так что 5+ это 5 и одна треть. В том же файле есть ap, линейный аналог Kp, который можно складывать. Его среднее за сутки называется Ap.

В каталоге спутников CelesTrak есть каждый отслеживаемый объект с датой запуска и, если объект уже сошёл с орбиты, с датой схода. Время стартов я взял из списка запусков Starlink в Википедии, потому что в каталоге только даты. Весь разбор это около 110 строк на Python 3.10 без библиотек сверх стандартной.

Перед подсчётом я записал, чего жду. Февральская буря окажется слабой и таких дней в 2022 году будет больше 10. Group 4-7 будет единственным запуском с большими ранними потерями. И найдётся хотя бы один другой запуск, который в первые дни попал под Kp 5 или выше и ничего не потерял.

## Насколько сильной она была

Group 4-7 стартовал 3 февраля в 18:13 UTC с 49 спутниками. SpaceX выводит новые спутники на низкую орбиту высотой около 210 км и поднимает их позже, чтобы неисправный быстро сгорел.

3 февраля Kp дошёл до 5+ утром, за несколько часов до старта. От запуска до второй половины следующего дня он держался от 2,7 до 4. Потом 4 февраля с 15 до 18 UTC снова дошёл до 5+, примерно через 21 час после отделения спутников. Индекс Dst реального времени из Киото, второй стандартный индекс геомагнитных бурь, 3 февраля опустился до −66 нТл, а 4 февраля до −61. У сильной бури он уходит ниже −100 нТл.

С 1 января по 21 декабря этого года было 35 дней с Kp 5 или выше, примерно 3 в месяц. 20 из них дошли до 5+, как 3 и 4 февраля. До G2 дошли только 5 дней, до G3 ни одного. Некоторые службы считают G1 уже от 5 с минусом. По такому правилу в году 52 дня с бурей, из них 9 дней G2 и 2 дня G3. В любом случае февраль далеко не в начале списка. По суточному Ap 4 февраля делит 5-е место среди самых возмущённых дней года, а 3 февраля на 11-м месте. Для этой фазы солнечного цикла это обычное число: в 2012 году, тоже на подъёме цикла, таких дней тоже было 35.

<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Столбчатая диаграмма трёхчасового индекса Kp от GFZ в Потсдаме со 2 по 6 февраля 2022 года, 40 столбцов. Пунктир отмечает Kp 5, уровень бури G1, второй пунктир Kp 6, уровень G2. 3 февраля с 09 до 12 UTC Kp доходит до 5+. Вертикальная линия отмечает запуск Group 4-7 в 18:13 UTC 3 февраля, в этот момент Kp равен 3. После запуска Kp держится от 2,7 до 4, потом 4 февраля с 15 до 18 UTC доходит до 5+ и с 18 до 21 UTC держится на 5. Ни один столбец не доходит до 6.">
  <text x="32" y="204.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="32" y="150.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <text x="32" y="97.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <text x="32" y="44.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6</text>
  <text x="40" y="12" class="f-label f-muted">Kp</text>
  <rect x="41.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="57.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="72.5" y="182.3" width="12.5" height="17.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="88.0" y="191.2" width="12.5" height="8.8" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="103.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="119.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="134.5" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="150.0" y="164.6" width="12.5" height="35.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="165.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="181.0" y="84.9" width="12.5" height="115.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="196.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="212.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="227.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="243.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="258.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="274.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="289.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="305.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="320.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="336.0" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="351.5" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="367.0" y="58.3" width="12.5" height="141.7" class="f-accent" style="fill-opacity:1"/>
  <rect x="382.5" y="67.1" width="12.5" height="132.9" class="f-accent" style="fill-opacity:1"/>
  <rect x="398.0" y="93.7" width="12.5" height="106.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="413.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="429.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="444.5" y="146.9" width="12.5" height="53.1" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="460.0" y="138.0" width="12.5" height="62.0" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="475.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="491.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="506.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="522.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="537.5" y="102.6" width="12.5" height="97.4" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="553.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="568.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="584.0" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="599.5" y="120.3" width="12.5" height="79.7" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="615.0" y="155.7" width="12.5" height="44.3" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="630.5" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <rect x="646.0" y="129.1" width="12.5" height="70.9" class="f-ink" style="fill-opacity:0.3"/>
  <line x1="40" y1="67.1" x2="660" y2="67.1" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="63.1" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G1</text>
  <line x1="40" y1="40.6" x2="660" y2="40.6" class="f-line" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  <text x="660" y="36.6" text-anchor="end" class="f-mono f-muted" style="font-size:10px">G2</text>
  <line x1="40.0" y1="200" x2="40.0" y2="206" class="f-plain"/>
  <text x="102.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2 фев</text>
  <line x1="164.0" y1="200" x2="164.0" y2="206" class="f-plain"/>
  <text x="226.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3 фев</text>
  <line x1="288.0" y1="200" x2="288.0" y2="206" class="f-plain"/>
  <text x="350.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4 фев</text>
  <line x1="412.0" y1="200" x2="412.0" y2="206" class="f-plain"/>
  <text x="474.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5 фев</text>
  <line x1="536.0" y1="200" x2="536.0" y2="206" class="f-plain"/>
  <text x="598.0" y="218" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6 фев</text>
  <line x1="660.0" y1="200" x2="660.0" y2="206" class="f-plain"/>
  <line x1="258.1" y1="20" x2="258.1" y2="200" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <text x="263.1" y="30" class="f-label f-accent">запуск 18:13 UTC</text>
</svg>
<figcaption>Kp GFZ, трёхчасовые значения. Столбцы с Kp 5 и выше выделены.</figcaption>
</figure>

## Где я ошибся

Потом я посчитал ранние потери. Для каждого запуска Starlink с 2019 года я взял спутники, сошедшие с орбиты в первые 30 дней. В моей первой таблице у Group 4-7 было 6 ранних потерь. У спокойного запуска 19 марта тоже было 6.

До другого столбца я дошёл не сразу. Для каждого запуска Starlink 2022 года в каталоге от 46 до 54 объектов, кроме двух. Запуск 11 сентября делил ракету с BlueWalker 3, у него 34. У Group 4-7 их 17. Из них 11 это спутники, которые уцелели. Остальные 6 это объекты с буквой вместо номера, вроде STARLINK A. Они сошли с орбиты с 6 по 12 февраля. Ещё 32 спутника сошли с орбиты раньше, чем получили публичные номера в каталоге.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="49 квадратов, по одному на каждый спутник Group 4-7. 11 закрашенных квадратов это спутники, которые уцелели и есть в каталоге. 6 квадратов с контуром акцентного цвета это объекты, которые попали в каталог под буквенным именем и сошли с орбиты с 6 по 12 февраля. 32 пунктирных квадрата это спутники, которые сошли с орбиты, так и не получив записи в каталоге. 6 плюс 32 это 38 потерянных.">
  <rect x="30" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="182" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="220" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="258" y="10" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="30" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="68" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="106" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144" y="48" width="30" height="30" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="183" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="221" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="259" y="49" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="31" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="69" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="107" y="87" width="28" height="28" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <rect x="145" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="87" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="125" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="163" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="201" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="31" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="69" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="107" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="145" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="183" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="221" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="259" y="239" width="28" height="28" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <rect x="320" y="50" width="18" height="18" class="f-ink" style="fill-opacity:0.75"/>
  <text x="348" y="64" class="f-label"><tspan x="348" dy="0">11 уцелели, есть в каталоге</tspan></text>
  <rect x="321" y="111" width="16" height="16" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="348" y="110" class="f-label"><tspan x="348" dy="0">6 в каталоге как STARLINK A,</tspan><tspan x="348" dy="14">B, ..., сошли с 6 по 12</tspan><tspan x="348" dy="14">февраля</tspan></text>
  <rect x="321" y="171" width="16" height="16" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3"/>
  <text x="348" y="184" class="f-label"><tspan x="348" dy="0">32 сошли без записи в каталоге</tspan></text>
</svg>
<figcaption>CelesTrak SATCAT, запуск 2022-010. 32 недостающих спутника посчитаны как 49 запущенных минус 17 записей в каталоге.</figcaption>
</figure>

49 минус 11 это 38, то же число, что в статьях. Значит, каталог потерю подтверждает, но только как дыру. Если считать сходы с орбиты строка за строкой, как я сначала и сделал, видно 6. Запуск 19 марта ушёл в спокойную погоду и все его спутники в каталоге есть. Его 6 сходов пришлись на дни с 13-го по 30-й после старта, через несколько дней после бурь уровня G2, случившихся 10 и 14 апреля. Так же хорошо это объясняется тем, что спутники не прошли проверку и их свели с орбиты намеренно, но этого я не проверял.

## Была ли погода особенной для Starlink

Для каждого из 33 запусков Starlink в 2022 году я сложил ap по трёхчасовым интервалам от старта примерно до конца первых суток. У Group 4-7 сумма 256 при максимальном Kp 5+.

Это не худший случай. Запуск 19 января, за 2 недели до того, ушёл в 02:02 UTC прямо в интервал с Kp 5+. Его сумма за первые сутки 199, все 49 спутников есть в каталоге и потерь в первый месяц нет. 7 июля сумма была 266 при Kp 5+. 5 сентября она была 319 при Kp 5. Радиопоток Солнца на волне 10,7 см (F10.7) показывает, насколько Солнце греет верхнюю атмосферу. В тот день он был 130, почти как 3 и 4 февраля, когда было 127 и 130. Ни один из этих трёх запусков не потерял в первый месяц ни одного спутника.

<figure class="fig">
<svg viewBox="0 0 680 260" role="img" aria-label="Столбчатая диаграмма 33 запусков Starlink 2022 года в порядке дат. Высота столбца это сумма ap по трёхчасовым интервалам от запуска примерно до конца первых суток. Выделены: 19 янв 199, потеряно 0; Group 4-7 256, потеряно 6; 7 июл 266, потеряно 0; 5 сен 319, потеряно 0. Group 4-7 не самый высокий столбец. У 7 июля и 5 сентября сумма выше, запуск 19 января ушёл прямо в Kp 5+ и ни один из трёх не потерял за первый месяц ни одного спутника.">
  <line x1="50" y1="220.0" x2="660" y2="220.0" class="f-plain"/>
  <text x="44" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="50" y1="165.7" x2="660" y2="165.7" class="f-plain"/>
  <text x="44" y="169.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="50" y1="111.4" x2="660" y2="111.4" class="f-plain"/>
  <text x="44" y="115.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="50" y1="57.1" x2="660" y2="57.1" class="f-plain"/>
  <text x="44" y="61.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="50" y="16" class="f-label f-muted">сумма ap за первые сутки</text>
  <rect x="52.0" y="220.0" width="14.5" height="0.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="70.5" y="112.0" width="14.5" height="108.0" class="f-ink" style="fill-opacity:0.7"/>
  <text x="77.7" y="106.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">199</text>
  <text x="81.7" y="236" text-anchor="end" class="f-label f-ink" style="font-size:11px">19 янв</text>
  <text x="81.7" y="251" text-anchor="end" class="f-mono f-muted" style="font-size:10px">потеряно 0</text>
  <rect x="89.0" y="81.0" width="14.5" height="139.0" class="f-accent" style="fill-opacity:1"/>
  <text x="96.2" y="75.0" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">256</text>
  <text x="92.2" y="236" text-anchor="start" class="f-label f-accent" style="font-size:11px">Group 4-7</text>
  <text x="92.2" y="251" text-anchor="start" class="f-mono f-muted" style="font-size:10px">потеряно 6</text>
  <rect x="107.5" y="123.9" width="14.5" height="96.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="125.9" y="214.0" width="14.5" height="6.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="144.4" y="180.4" width="14.5" height="39.6" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="162.9" y="198.8" width="14.5" height="21.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="181.4" y="184.7" width="14.5" height="35.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="199.9" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="218.4" y="152.1" width="14.5" height="67.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="236.8" y="208.6" width="14.5" height="11.4" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="255.3" y="186.3" width="14.5" height="33.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="273.8" y="171.7" width="14.5" height="48.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="292.3" y="186.9" width="14.5" height="33.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="310.8" y="171.1" width="14.5" height="48.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="329.3" y="75.6" width="14.5" height="144.4" class="f-ink" style="fill-opacity:0.7"/>
  <text x="336.5" y="69.6" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">266</text>
  <text x="336.5" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">7 июл</text>
  <text x="336.5" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">потеряно 0</text>
  <rect x="347.8" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="366.2" y="195.0" width="14.5" height="25.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="384.7" y="143.5" width="14.5" height="76.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="403.2" y="191.2" width="14.5" height="28.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="421.7" y="164.1" width="14.5" height="55.9" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="440.2" y="185.8" width="14.5" height="34.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="458.7" y="137.5" width="14.5" height="82.5" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="477.2" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="495.6" y="157.0" width="14.5" height="63.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="514.1" y="46.8" width="14.5" height="173.2" class="f-ink" style="fill-opacity:0.7"/>
  <text x="521.4" y="40.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">319</text>
  <text x="521.4" y="236" text-anchor="middle" class="f-label f-ink" style="font-size:11px">5 сен</text>
  <text x="521.4" y="251" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">потеряно 0</text>
  <rect x="532.6" y="178.7" width="14.5" height="41.3" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="551.1" y="169.0" width="14.5" height="51.0" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="569.6" y="193.9" width="14.5" height="26.1" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="588.1" y="141.3" width="14.5" height="78.7" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="606.5" y="191.8" width="14.5" height="28.2" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="625.0" y="140.2" width="14.5" height="79.8" class="f-ink" style="fill-opacity:0.25"/>
  <rect x="643.5" y="205.3" width="14.5" height="14.7" class="f-ink" style="fill-opacity:0.25"/>
</svg>
<figcaption>ap GFZ, время запусков из списка запусков Starlink в Википедии. Число под подписью: сколько спутников сошло с орбиты в первые 30 дней, по данным каталога.</figcaption>
</figure>

Третье ожидание тоже подтвердилось. Именно это я не могу объяснить одним Kp. По моим числам у Group 4-7 был плохой день, но у двух других запусков дни были хуже и они уцелели. SpaceX тогда писала, что бортовой GPS показал атмосферное сопротивление до 50% выше, чем на предыдущих запусках. Kp этого не показывает. Он строится по наземным магнитометрам и не измеряет плотность воздуха на конкретной орбите высотой 210 км. В статьях эту плотность оценивают по моделям верхней атмосферы.

Может быть, орбита отделения 19 января и 5 сентября была выше. Для 5 сентября, может быть, SpaceX после февраля иначе обращалась с новыми партиями. Мои таблицы не говорят, что из этого верно.

## Чего я не проверял

Высоту отделения на каждом запуске. Элементы первых орбит лежат на сайте каталога Космических сил США, а там нужна учётная запись. Открытый каталог хранит только последнюю орбиту. Без них сравнение запусков касается только погоды. Насколько каждая партия была уязвима, я сказать не могу.

Kp за последние недели года ещё предварительный и несколько подсчётов за конец года ещё могут сдвинуться. Границей ранней потери я взял 30 дней. Спутник, который отказал на орбите и сошёл с орбиты позже, не засчитан, а плановый сход в первые 30 дней засчитан как потеря.

Время стартов из Википедии я не сверял с SpaceX. Ошибка на час сдвинула бы окно не больше чем на один трёхчасовой интервал.

Наземные последствия, энергосети и радиосвязь, я тоже не смотрел. Единственная сеть, которую я мог проверить по открытым таблицам, была на орбите. Почему 19 января и 5 сентября пережили такую же погоду, я так и не знаю.
