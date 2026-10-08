---
title: "На каждую беларусскую страницу в Common Crawl приходится 400 русских"
description: "Беларусский это 0,017% Common Crawl: на каждую беларусскую страницу приходится 399 русских и открытые корпуса с этим согласны. Только Википедия делает из этого 1 к 6. Больше четверти всего беларусского текста в вебе лежит на 10 доменах, а на .by беларусских страниц около 2%."
date: 2026-10-08
lang: ru
translationKey: be-web-share
tags: ["open-data", "text", "statistics"]
---
Каждая статья в этом блоге выходит на 3 языках и один из них беларусский. Я знал, что беларусского в интернете мало, но числа у меня не было, только ощущение. Единственное, что я мог назвать, это Википедия. На 8 октября 2026 года у беларусской в 2 редакциях 358692 статьи, у русской 2121411. Один к шести. Звучит не так уж плохо.

Первое настоящее число я получил из Common Crawl. Оно было 1 к 400. После этого я записал, чего жду от всего остального, ещё до подсчёта: Википедия около 1 к 6, у открытых корпусов текстов примерно то же, что у Common Crawl, на домене .by меньше 10% беларусского и 2 разных определителя языка, которые сходятся там в пределах 10%. Последняя догадка не подтвердилась.

## Где я считал

Common Crawl это открытая копия веба, с которой начинают многие языковые модели и открытые корпуса текстов. С августа 2018 года он помечает каждую HTML-страницу её основным языком с помощью CLD2 и публикует итоги. Я взял их по всем 77 краулам по сентябрь 2026 года включительно. Ещё я взял размеры 3 больших очищенных корпусов из их карточек, в том виде, в каком они были на 8 октября 2026 года. FineWeb-2 и MADLAD-400 собраны из Common Crawl, HPLT 2.0 в основном из Internet Archive.

В последнем крауле, CC-MAIN-2026-39, 2171285702 страницы. Из них 364316 беларусские. Это 0,017%. W3Techs, который считает сайты, а не страницы, пишет, что беларусский используют меньше 0,1% всех сайтов, так что эта часть не новость. На каждую беларусскую страницу в крауле приходится 399 русских и 2495 английских. В корпусах разрыв между русским и беларусским от 333 до 505 раз. Это зависит от корпуса и от того, считать документы или слова.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Горизонтальные столбцы на логарифмической шкале, во сколько раз русского больше, чем беларусского, в каждом источнике. Википедия, статьи: 5,9; Википедия, дамп статей: 13,5; Википедия, активные участники: 27,6; MADLAD-400, документы: 368; Common Crawl 2026-39, страницы: 399; HPLT 2.0, слова: 447; FineWeb-2, слова: 505. 3 столбца Википедии лежат между 5 и 30, 4 столбца веба между 360 и 510.">
  <text x="10" y="16" class="f-label f-muted">во сколько раз русского больше, чем беларусского, по источникам (логарифмическая шкала)</text>
  <line x1="250.0" y1="34" x2="250.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="250.0" y="266" text-anchor="middle" class="f-label f-muted">1</text>
  <line x1="366.7" y1="34" x2="366.7" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="366.7" y="266" text-anchor="middle" class="f-label f-muted">10</text>
  <line x1="483.3" y1="34" x2="483.3" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="483.3" y="266" text-anchor="middle" class="f-label f-muted">100</text>
  <line x1="600.0" y1="34" x2="600.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="600.0" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <text x="242" y="55" text-anchor="end" class="f-label f-ink">Википедия, статьи</text>
  <rect x="250" y="43" width="90.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="346.0" y="55" class="f-label f-ink">5,9</text>
  <text x="242" y="85" text-anchor="end" class="f-label f-ink">Википедия, дамп статей</text>
  <rect x="250" y="73" width="131.8" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="387.8" y="85" class="f-label f-ink">13,5</text>
  <text x="242" y="115" text-anchor="end" class="f-label f-ink">Википедия, активные участники</text>
  <rect x="250" y="103" width="168.1" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="424.1" y="115" class="f-label f-ink">27,6</text>
  <text x="242" y="145" text-anchor="end" class="f-label f-ink">MADLAD-400, документы</text>
  <rect x="250" y="133" width="299.4" height="20" style="fill:var(--accent)"/>
  <text x="555.4" y="145" class="f-label f-accent">368</text>
  <text x="242" y="175" text-anchor="end" class="f-label f-ink">Common Crawl 2026-39, страницы</text>
  <rect x="250" y="163" width="303.5" height="20" style="fill:var(--accent)"/>
  <text x="559.5" y="175" class="f-label f-accent">399</text>
  <text x="242" y="205" text-anchor="end" class="f-label f-ink">HPLT 2.0, слова</text>
  <rect x="250" y="193" width="309.2" height="20" style="fill:var(--accent)"/>
  <text x="565.2" y="205" class="f-label f-accent">447</text>
  <text x="242" y="235" text-anchor="end" class="f-label f-ink">FineWeb-2, слова</text>
  <rect x="250" y="223" width="315.3" height="20" style="fill:var(--accent)"/>
  <text x="571.3" y="235" class="f-label f-accent">505</text>
</svg>
<figcaption>Беларусская Википедия это обе редакции, be и be-tarask. Размеры корпусов из их карточек, данные Википедии на 8 октября 2026 года.</figcaption>
</figure>

Так что Википедия исключение, причём сильное. Разрыв там в 5,9 раза по статьям и в 13,5 раза по размеру дампа статей. 2 беларусские Википедии вместе даже больше литовской, 358692 статьи против 226895. В Common Crawl литовских страниц в 10 раз больше, чем беларусских. В тот же день в 2 беларусских редакциях было 584 зарегистрированных участника, активных за последние 30 дней, в русской 16120.

Моё ощущение выросло из единственного места, где язык выглядит почти нормально. Я ни разу не сверил его ни с чем другим, хотя остальные числа всегда были открыты.

## Отношение за 8 лет

Я брал медиану по краулам каждого года. Русских страниц на одну беларусскую было 713 в 2018 году, потом около 400. С 2019 года это число держится между 359 и 412. Отдельные краулы скачут гораздо сильнее, поэтому я верю только медианам. Литовский все 8 лет держался между 9,6 и 10,8. Украинский опустился с 30 в 2018 году до значений от 19 до 26 с 2019 по 2023 год. Потом он вырос до 49 в этом году.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Линейный график на логарифмической шкале, годы с 2018 по 2026. русский: 2018 713, 2019 393, 2020 359, 2021 412, 2022 379, 2023 363, 2024 382, 2025 395, 2026 399; украинский: 2018 30, 2019 20, 2020 19, 2021 24, 2022 26, 2023 22, 2024 36, 2025 41, 2026 49; литовский: 2018 11, 2019 10, 2020 10, 2021 10, 2022 10, 2023 10, 2024 10, 2025 11, 2026 11.">
  <text x="10" y="16" class="f-label f-muted">страниц Common Crawl на 1 беларусскую, медиана краулов каждого года (логарифмическая шкала)</text>
  <line x1="50" y1="260.0" x2="470" y2="260.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="264.0" text-anchor="end" class="f-label f-muted">5</text>
  <line x1="50" y1="231.2" x2="470" y2="231.2" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="235.2" text-anchor="end" class="f-label f-muted">10</text>
  <line x1="50" y1="164.4" x2="470" y2="164.4" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="168.4" text-anchor="end" class="f-label f-muted">50</text>
  <line x1="50" y1="135.6" x2="470" y2="135.6" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="139.6" text-anchor="end" class="f-label f-muted">100</text>
  <line x1="50" y1="68.8" x2="470" y2="68.8" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="72.8" text-anchor="end" class="f-label f-muted">500</text>
  <line x1="50" y1="40.0" x2="470" y2="40.0" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="44.0" text-anchor="end" class="f-label f-muted">1000</text>
  <text x="50.0" y="278" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="102.5" y="278" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="155.0" y="278" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="207.5" y="278" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="260.0" y="278" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="312.5" y="278" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="365.0" y="278" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="417.5" y="278" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="470.0" y="278" text-anchor="middle" class="f-label f-muted">2026</text>
  <path d="M50.0,54.1 L102.5,78.8 L155.0,82.5 L207.5,76.8 L260.0,80.2 L312.5,82.0 L365.0,80.0 L417.5,78.6 L470.0,78.1" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <circle cx="50.0" cy="54.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="102.5" cy="78.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="155.0" cy="82.5" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="207.5" cy="76.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="260.0" cy="80.2" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="312.5" cy="82.0" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="365.0" cy="80.0" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="417.5" cy="78.6" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="470.0" cy="78.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <text x="480" y="82.1" class="f-label f-ink">русский 399</text>
  <path d="M50.0,185.4 L102.5,202.4 L155.0,205.0 L207.5,195.4 L260.0,191.0 L312.5,197.8 L365.0,177.6 L417.5,172.4 L470.0,165.5" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="50.0" cy="185.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="102.5" cy="202.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="155.0" cy="205.0" r="2.5" style="fill:var(--accent)"/>
  <circle cx="207.5" cy="195.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="260.0" cy="191.0" r="2.5" style="fill:var(--accent)"/>
  <circle cx="312.5" cy="197.8" r="2.5" style="fill:var(--accent)"/>
  <circle cx="365.0" cy="177.6" r="2.5" style="fill:var(--accent)"/>
  <circle cx="417.5" cy="172.4" r="2.5" style="fill:var(--accent)"/>
  <circle cx="470.0" cy="165.5" r="2.5" style="fill:var(--accent)"/>
  <text x="480" y="169.5" class="f-label f-accent">украинский 48,7</text>
  <path d="M50.0,227.9 L102.5,229.5 L155.0,232.3 L207.5,232.8 L260.0,230.1 L312.5,229.4 L365.0,230.8 L417.5,228.7 L470.0,228.4" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="6 4"/>
  <circle cx="50.0" cy="227.9" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="102.5" cy="229.5" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="155.0" cy="232.3" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="207.5" cy="232.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="260.0" cy="230.1" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="312.5" cy="229.4" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="365.0" cy="230.8" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="417.5" cy="228.7" r="2.5" class="f-ink" style="fill:currentColor"/>
  <circle cx="470.0" cy="228.4" r="2.5" class="f-ink" style="fill:currentColor"/>
  <text x="480" y="232.4" class="f-label f-ink">литовский 10,7</text>
</svg>
<figcaption>Основной язык страницы по метке CLD2 в Common Crawl, 77 краулов с августа 2018 по сентябрь 2026.</figcaption>
</figure>

Из этих данных я не могу сказать, вырос украинский веб или краулер стал чаще туда ходить. Common Crawl сам решает, что скачивать. И это меняется от краула к краулу. Беларусский в любом случае не пошёл следом, его медианная доля была 0,0128% в 2018 году и от 0,015% до 0,019% в каждом следующем году.

## Где живёт беларусский текст

В FineWeb-2 по его собственному подсчёту 1,17 миллиарда беларусских слов. Я сам разбил текст по пробелам и получил 965 миллионов слов на 22588 доменах. Все доли ниже посчитаны от этого числа. На один сайт, Радио Свабода, приходится 8,5% всех слов. Дальше идут государственная газета zviazda.by, Википедия, электронная библиотека knihi.com и cloudfront.net. Последний меня удивил. Я открыл несколько его страниц. Большая часть текста там это копии статей Нашай Нівы с теми же номерами, что и на nashaniva.com. На 10 самых больших доменов приходится 28,9% слов, на 100 самых больших 59,5%.

Для сравнения я взял 2 из 6 литовских файлов того же корпуса. В каждом около 1,3 миллиарда слов, на треть больше, чем во всём беларусском. Там на 10 самых больших доменов приходится 13,7% и 12,8%, примерно половину беларусской доли.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Составные горизонтальные столбцы, доля текста у 10 самых больших доменов, у следующих 90 и у остальных. беларусский, FineWeb-2, слова: 10 самых больших доменов 28,9%, 100 самых больших 59,5%; беларусский, Common Crawl 2026-39, страницы: 10 самых больших доменов 33,0%, 100 самых больших 62,5%; литовский, FineWeb-2, файл 1 из 6, слова: 10 самых больших доменов 13,7%, 100 самых больших 32,3%; литовский, FineWeb-2, файл 4 из 6, слова: 10 самых больших доменов 12,8%, 100 самых больших 30,9%.">
  <text x="10" y="16" class="f-label f-muted">доля всего текста у самых больших доменов</text>
  <rect x="10" y="28" width="14" height="10" style="fill:var(--accent)"/><text x="30" y="37" class="f-label f-ink">10 самых больших</text>
  <rect x="180" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="200" y="37" class="f-label f-ink">следующие 90</text>
  <rect x="350" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="370" y="37" class="f-label f-ink">остальные</text>
  <text x="10" y="66" class="f-label f-ink">беларусский, FineWeb-2, слова</text>
  <rect x="10" y="72" width="179.2" height="20" style="fill:var(--accent)"/>
  <rect x="189.2" y="72" width="189.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="378.8" y="72" width="251.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="185.2" y="86" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">28,9%</text>
  <text x="374.8" y="86" text-anchor="end" class="f-label f-ink">59,5%</text>
  <text x="10" y="116" class="f-label f-ink">беларусский, Common Crawl 2026-39, страницы</text>
  <rect x="10" y="122" width="204.8" height="20" style="fill:var(--accent)"/>
  <rect x="214.8" y="122" width="182.9" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="397.7" y="122" width="232.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="210.8" y="136" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">33,0%</text>
  <text x="393.7" y="136" text-anchor="end" class="f-label f-ink">62,5%</text>
  <text x="10" y="166" class="f-label f-ink">литовский, FineWeb-2, файл 1 из 6, слова</text>
  <rect x="10" y="172" width="84.9" height="20" style="fill:var(--accent)"/>
  <rect x="94.9" y="172" width="115.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="210.4" y="172" width="419.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="90.9" y="186" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">13,7%</text>
  <text x="206.4" y="186" text-anchor="end" class="f-label f-ink">32,3%</text>
  <text x="10" y="216" class="f-label f-ink">литовский, FineWeb-2, файл 4 из 6, слова</text>
  <rect x="10" y="222" width="79.2" height="20" style="fill:var(--accent)"/>
  <rect x="89.2" y="222" width="112.5" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="201.8" y="222" width="428.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="85.2" y="236" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">12,8%</text>
  <text x="197.8" y="236" text-anchor="end" class="f-label f-ink">30,9%</text>
</svg>
<figcaption>Домены взяты по зарегистрированному имени, без поддоменов, поэтому все языковые разделы Википедии идут одним доменом wikipedia.org. В беларусской части FineWeb-2 965 миллионов слов, в каждом литовском файле около 1,3 миллиарда.</figcaption>
</figure>

В текущем крауле то же самое. Его 364316 беларусских страниц лежат на 6394 доменах. У 10 самых больших из них 33%. На одну Википедию приходится 9,9%. На .by только 39% беларусских страниц, остальные в основном на .org и .com.

## Проверка на .by

Потом я зашёл с другой стороны и взял все HTML-страницы в зоне .by из сентябрьского краула. Сначала я попробовал постраничный API индекса. Он отвечал ошибками 504 и 400 и отдавал примерно 1 блок в 3000 записей в минуту, так что я от него отказался. Колоночный индекс Common Crawl отдал все 4843281 страницу на 34107 доменах за несколько секунд. Потом сервер данных начал отвечать мне 403 и я ждал, пока он снова меня пустит.

CLD2 говорит, что беларусских страниц на .by только 2,7%, русских 86,6%. Только у 208 доменов большинство страниц беларусские, это 0,6% всех доменов. W3Techs даёт 0,9% сайтов на .by.

Доверять одному определителю на 2 таких близких языках я не хотел. Поэтому я взял случайные 500 страниц .by с меткой беларусского и 1000 с меткой русского и скачал их. Потом прогнал 2 другие проверки. Первая fastText lid.176, вторая простой счёт букв, которые есть только в беларусском (ў, і), против букв, которые есть только в русском (и, щ, ъ).

На 489 беларусских страницах с достаточным количеством текста fastText согласен в 85,5% случаев, обе проверки сразу в 79,8%. Но больше трети остальных это статьи skarnik.by, беларусско-русского словаря. Такая статья по своему устройству наполовину на одном языке и наполовину на другом. На 985 русских страницах обе проверки вместе не нашли ни одной беларусской. fastText в одиночку отметил 1 страницу. Значит, на этой выборке CLD2 немного завышает беларусский. Поправленная доля на .by от 2,1% до 2,3%. Это до 20% меньше, чем у CLD2, то есть расхождение до 2 раз больше того, что я ждал.

## Чего я не проверял

Common Crawl почти не видит каналы в Telegram и совсем не видит того, что закрыто логином. Всё, что там написано по-беларусски, в эти числа не попало.

Я не разделял 2 правописания беларусского, официальное и тарашкевицу. У CLD2 для них одна метка, а в Википедии я сложил их вместе. Беларусский латиницей я не искал вообще. Страницы, которые CLD2 пометил английскими или оставил без метки, я в выборку не брал.

1 к 400 это счёт страниц и слов. Сколько людей читает по-беларусски в интернете, это другой вопрос. Отвечать на него здесь я не пытался.
