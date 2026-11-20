---
title: "Как часто sourceMappingURL ведёт к исходникам"
description: "Комментарий sourceMappingURL есть на 30% главных страниц из моей выборки 2021 года, но отдаёт ли карта код на самом деле? Я проверил 2000 сайтов только через Wayback Machine. Копия есть для 9,0% карт из ссылок. У чуть больше чем половины сайтов с исходными файлами в такой копии все они из SDK вендоров, а собственный код нашёлся у 12 сайтов."
date: 2021-09-11
lang: ru
translationKey: source-maps
tags: ["debugging", "statistics", "open-data"]
---
Я всегда считал само собой разумеющимся, что `//# sourceMappingURL=` в конце минифицированного бандла означает, что до исходного кода сайта один запрос. Как часто это правда, я никогда не считал.

У этой уверенности есть причина. В `react-scripts` 4.0.3 есть строка `const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';`. Продовый конфиг превращает её в `devtool: 'source-map'`. То есть сборка Create React App кладёт файл `.map` рядом с каждым бандлом, если только кто-нибудь не напишет слово false. Vue CLI 4.5 делает то же самое через `productionSourceMap`, который по умолчанию true. Сам webpack 5 в продакшене ставит `devtool` в false, так что всё зависит от того, кто писал конфиг.

Карта исходников это JSON с именами исходных файлов в `sources`. Часто в ней лежат и сами файлы, в `sourcesContent`, с комментариями и раскладкой папок.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Минифицированный бандл кончается комментарием sourceMappingURL, который указывает на файл .map. Карта перечисляет имена исходных файлов в sources и может нести сами файлы с комментариями в sourcesContent. Браузер скачивает карту, только когда её просят инструменты разработчика.">
  <rect x="20" y="20" width="640" height="74" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="40" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js, то, что исполняет браузер</text>
  <text x="32" y="60" text-anchor="start" class="f-mono f-ink" style="font-size:11px">!function(e){var t={};function n(r){if(t[r])return t[r].exports;…</text>
  <text x="32" y="82" text-anchor="start" class="f-mono f-accent" style="font-size:12px">//# sourceMappingURL=main.3f9c2a.js.map</text>
  <text x="648" y="82" text-anchor="end" class="f-muted" style="font-size:10px">последняя строка бандла</text>
  <line x1="200" y1="96" x2="200" y2="124" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,118 L200,124 L206,118" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <rect x="20" y="126" width="640" height="98" rx="3" class="f-box" style="fill:none"/>
  <text x="32" y="146" text-anchor="start" class="f-muted" style="font-size:11px">main.3f9c2a.js.map, скачивается только по запросу</text>
  <text x="32" y="166" text-anchor="start" class="f-mono f-ink" style="font-size:11px">{&quot;version&quot;:3,&quot;file&quot;:&quot;main.3f9c2a.js&quot;,</text>
  <text x="32" y="184" text-anchor="start" class="f-mono f-ink" style="font-size:11px"> &quot;sources&quot;:[&quot;webpack:///./src/hooks/useQueryParam/index.js&quot;,…],</text>
  <text x="32" y="202" text-anchor="start" class="f-mono f-accent" style="font-size:11px"> &quot;sourcesContent&quot;:[&quot;// TODO: …\nexport default function …&quot;,…],</text>
  <text x="32" y="218" text-anchor="start" class="f-mono f-muted" style="font-size:11px"> &quot;mappings&quot;:&quot;AAAA,SAASA,EAAE…&quot;}</text>
  <line x1="200" y1="226" x2="200" y2="254" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M194,248 L200,254 L206,248" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="32" y="274" text-anchor="start" class="f-muted" style="font-size:11px">что карта может вернуть</text>
  <text x="48" y="294" text-anchor="start" class="f-ink" style="font-size:11px">sources: имена файлов и папки</text>
  <text x="48" y="312" text-anchor="start" class="f-accent" style="font-size:11px">sourcesContent: сами файлы</text>
  <text x="48" y="330" text-anchor="start" class="f-accent" style="font-size:11px">комментарии, TODO, мёртвый код</text>
</svg>
<figcaption>Комментарий это только адрес. Открыт ли исходный код, решает второй файл, который ни один браузер сам не скачивает. Именно его краул и не видит.</figcaption>
</figure>

## Что уже посчитали

Первую половину посчитал Web Almanac 2019. В крауле HTTP Archive за июль 2019 года это было 18% десктопных страниц и 17% мобильных. Считались страницы, где у собственного скрипта сайта есть `sourceMappingURL`, то есть комментарий. Ветка на форуме HTTP Archive от августа 2019 года указывает на ограничение. Сам Chrome карту никогда не запрашивает, её запрашивают только devtools, поэтому краул, который гоняет браузер, не видит, существует ли файл. Вот эту вторую половину я и хотел увидеть.

## Как я мерил

Я взял список Tranco, созданный 10 сентября 2021 года (id 2779, ранги за 30 дней до этой даты). Взял все 1000 верхних доменов и 1000 случайных доменов с рангами от 1001 до 100000. Для каждого домена я взял последнюю копию главной страницы в Wayback Machine с 1 августа по 10 сентября 2021 года. Брал сырой вид `id_`, без переписывания архивом. Потом взял каждый внешний скрипт этой страницы, не больше 40, тоже из архива и только копии с июня по 10 сентября.

Я не отправил ни одного запроса живым сайтам. Тот же прогон по архиву должен дать те же файлы, разве что архив задним числом проиндексирует ещё несколько копий.

Из 2000 главных страниц как HTML в нужном окне вернулись 1606: 856 в топ-1000 и 750 в хвосте. Часть верхних доменов это инфраструктура без главной страницы, вроде `googletagmanager.com`. Из проверенных тегов script копия в окне нашлась у 83%.

Сам архив отнял у меня почти всю ночь. Примерно через 2 часа краула он начал отказывать в соединении. Первая версия моего краулера записывала каждый отказ как "копии нет". Пришлось заново пройти 203 домена и все карты краулером, который отделяет сбой от пустого ответа. Ещё 140 доменов ждали архив, когда я остановился, так что главных может быть чуть больше.

## Сколько страниц ссылается на карту

Хотя бы один скрипт со ссылкой на карту: **31,8%** главных в топ-1000 и **28,4%** в хвосте. Если считать только скрипты с зарегистрированного домена самой страницы, выходит 15,7% и 15,3%. У Almanac в 2019 году было от 17 до 18%, при другом крауле и другом списке. Остальное отчасти открытые библиотеки с публичных CDN вроде jsDelivr или cdnjs. Ещё часть это копии Bootstrap и jQuery на собственном сервере сайта. Там карта выложена намеренно, а исходник и так открыт, поэтому дальше я считаю их отдельно.

Ещё я ждал карт, встроенных прямо в бандл как `data:` URL. Первый проход нашёл их у 11 сайтов. 10 из них оказались одним и тем же кодом из `style-loader`. Он собирает этот комментарий строкой во время выполнения, чтобы привязать карту к вставленному CSS. Моя регулярка нашла строковый литерал. Одна встроенная карта была настоящей, без `sourcesContent`. Я чуть было не записал это как 0,7% сайтов.

## Как часто у архива есть сама карта

Страницы ссылаются на 1607 адресов внешних карт. Для **145** из них, 9,0%, у архива есть копия, сделанная не позже 10 сентября 2021 года. Если разбить по владельцу, разница больше, чем я думал. Среди карт открытых библиотек копия есть у 69 из 188. Среди карт на домене самой страницы только у 39 из 827. Моя догадка такая: архив хранит то, что запрашивают многие. Карту популярной библиотеки открывают в devtools многие. Карту сборки одного сайта открывают только его разработчики, если вообще открывают. Этого я не проверял.

Из этих 145 копий `sourcesContent` есть у 84. Карты библиотек часто пустые, у 36 из 69 только имена и `mappings`. С кодом, который не библиотека, наоборот: исходные файлы есть в 51 копии из 76.

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Воронка по стратам. Топ 1000: главная есть в архиве 856; ссылается на карту (не библиотеки) 234, 27,3%; копия карты до 10 сентября 70, 8,2%; в копии есть исходные файлы 34, 4,0%; карта на домене страницы 11, 1,3%. Ранги 1001–100000: главная есть в архиве 750; ссылается на карту (не библиотеки) 159, 21,2%; копия карты до 10 сентября 44, 5,9%; в копии есть исходные файлы 38, 5,1%; карта на домене страницы 1, 0,1%.">
  <text x="20" y="24" text-anchor="start" class="f-ink" style="font-size:13px">топ 1000</text>
  <text x="320" y="53" text-anchor="end" class="f-muted" style="font-size:11px">главная есть в архиве</text>
  <rect x="330" y="41" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="53" text-anchor="start" class="f-ink f-mono" style="font-size:11px">856</text>
  <text x="320" y="75" text-anchor="end" class="f-muted" style="font-size:11px">ссылается на карту (не библиотеки)</text>
  <rect x="330" y="63" width="62.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="400.8" y="75" text-anchor="start" class="f-ink f-mono" style="font-size:11px">234, 27,3%</text>
  <text x="320" y="97" text-anchor="end" class="f-muted" style="font-size:11px">копия карты до 10 сентября</text>
  <rect x="330" y="85" width="18.9" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="356.9" y="97" text-anchor="start" class="f-ink f-mono" style="font-size:11px">70, 8,2%</text>
  <text x="320" y="119" text-anchor="end" class="f-muted" style="font-size:11px">в копии есть исходные файлы</text>
  <rect x="330" y="107" width="9.2" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="347.2" y="119" text-anchor="start" class="f-ink f-mono" style="font-size:11px">34, 4,0%</text>
  <text x="320" y="141" text-anchor="end" class="f-muted" style="font-size:11px">карта на домене страницы</text>
  <rect x="330" y="129" width="3.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="341.0" y="141" text-anchor="start" class="f-ink f-mono" style="font-size:11px">11, 1,3%</text>
  <text x="20" y="170" text-anchor="start" class="f-ink" style="font-size:13px">ранги 1001–100000, 1000 случайных</text>
  <text x="320" y="199" text-anchor="end" class="f-muted" style="font-size:11px">главная есть в архиве</text>
  <rect x="330" y="187" width="230.0" height="16" class="f-box" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <text x="568.0" y="199" text-anchor="start" class="f-ink f-mono" style="font-size:11px">750</text>
  <text x="320" y="221" text-anchor="end" class="f-muted" style="font-size:11px">ссылается на карту (не библиотеки)</text>
  <rect x="330" y="209" width="48.8" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="386.8" y="221" text-anchor="start" class="f-ink f-mono" style="font-size:11px">159, 21,2%</text>
  <text x="320" y="243" text-anchor="end" class="f-muted" style="font-size:11px">копия карты до 10 сентября</text>
  <rect x="330" y="231" width="13.6" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="351.6" y="243" text-anchor="start" class="f-ink f-mono" style="font-size:11px">44, 5,9%</text>
  <text x="320" y="265" text-anchor="end" class="f-muted" style="font-size:11px">в копии есть исходные файлы</text>
  <rect x="330" y="253" width="11.7" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="349.7" y="265" text-anchor="start" class="f-ink f-mono" style="font-size:11px">38, 5,1%</text>
  <text x="320" y="287" text-anchor="end" class="f-muted" style="font-size:11px">карта на домене страницы</text>
  <rect x="330" y="275" width="1.5" height="16" class="f-box" style="fill:var(--accent);opacity:0.85;stroke:none"/>
  <text x="339.5" y="287" text-anchor="start" class="f-ink f-mono" style="font-size:11px">1, 0,1%</text>
</svg>
<figcaption>Главные страницы с копией с 1 августа по 10 сентября 2021 года. Скрипты открытых библиотек не считаются, ни с публичных CDN, ни свои копии. Копия карты учитывается, только если сделана не позже 10 сентября 2021 года. Большая часть спада между двумя последними строками это скрипты вендоров.</figcaption>
</figure>

## Чей это код

Если убрать библиотеки, у 34 главных в топ-1000 и 38 в хвосте есть хотя бы одна сохранённая карта с исходными файлами. Я ждал, что это будут собственные приложения сайтов. Часто нет. У 38 из этих 72 страниц все такие файлы приходят из 4 скриптов вендоров. Один только SDK пуш-уведомлений OneSignal стоит на 26 из них. Остальные это реклама Concert, Sailthru и виджет Trustpilot. Репозиторий SDK OneSignal лежит на GitHub с 2015 года, так что эта карта почти ничего нового не показывает. Остальные страницы держат карты на других хостах, часто на собственном CDN компании с другим доменом.

Карты с исходными файлами на домене самой страницы: **11 главных в топ-1000 и 1 в хвосте**. И копия, снятая до 10 сентября, не обязательно та сборка, что работала тогда. У карт с исходными файлами копия в медиане на 308 дней старше копии главной страницы. Если допустить разницу не больше 100 дней, остаётся 16 сайтов, из них 10 в топ-1000, с учётом вендоров.

В этих файлах лежит то, что минификация выбрасывает. В половине из 47 карт с файлами сайта или его вендора комментарии занимают хотя бы 9% строк, а в 11 картах есть пометки TODO. Раскладка папок тоже на месте, что-то вроде `src/hooks/useQueryParam/index.js`.

<figure class="fig">
<svg viewBox="0 0 680 176" role="img" aria-label="Адреса внешних карт по владельцу скрипта. домен самой страницы: 827, 39 из 827 (4,7%), sourcesContent 26; другой хост (свой CDN, вендор): 592, 37 из 592 (6,3%), sourcesContent 25; открытая библиотека: 188, 69 из 188 (36,7%), sourcesContent 33.">
  <rect x="20" y="12" width="12" height="10" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">адресов в ссылках</text>
  <rect x="240" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <text x="258" y="22" text-anchor="start" class="f-muted" style="font-size:11px">копия до 10 сентября</text>
  <rect x="460" y="12" width="12" height="10" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="478" y="22" text-anchor="start" class="f-muted" style="font-size:11px">с sourcesContent</text>
  <text x="290" y="60" text-anchor="end" class="f-ink" style="font-size:11px">домен самой страницы</text>
  <rect x="300" y="46" width="260.0" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="54" width="12.3" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="62" width="8.2" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="568" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">827</text>
  <text x="340" y="70" text-anchor="start" class="f-mono f-accent" style="font-size:11px">39 из 827, 4,7%, с файлами 26</text>
  <text x="290" y="104" text-anchor="end" class="f-ink" style="font-size:11px">другой хост (свой CDN, вендор)</text>
  <rect x="300" y="90" width="186.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="98" width="11.6" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="106" width="7.9" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="494.11850060459494" y="100" text-anchor="start" class="f-mono f-muted" style="font-size:11px">592</text>
  <text x="340" y="114" text-anchor="start" class="f-mono f-accent" style="font-size:11px">37 из 592, 6,3%, с файлами 25</text>
  <text x="290" y="148" text-anchor="end" class="f-ink" style="font-size:11px">открытая библиотека</text>
  <rect x="300" y="134" width="59.1" height="7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="300" y="142" width="21.7" height="7" class="f-box" style="fill:var(--accent);opacity:.55;stroke:none"/>
  <rect x="300" y="150" width="10.4" height="7" class="f-box" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="367.1051995163241" y="144" text-anchor="start" class="f-mono f-muted" style="font-size:11px">188</text>
  <text x="340" y="158" text-anchor="start" class="f-mono f-accent" style="font-size:11px">69 из 188, 36,7%, с файлами 33</text>
</svg>
<figcaption>Разные адреса карт со всех главных, по хосту скрипта. К библиотекам отнесены и копии файлов вроде jQuery на сервере самого сайта. У архива есть копия больше чем для трети карт библиотек и меньше чем для 5% карт на домене самой страницы.</figcaption>
</figure>

Выходит, первая половина моей уверенности держится. Почти треть страниц ссылается на карту. Вторую половину по архиву я подтвердить не могу. Карта есть у нескольких процентов страниц и чаще с кодом вендора, чем с кодом самого сайта. Свежая копия есть примерно у 1 сайта из 100.

## Что я не проверял

Главное это живые серверы. Архив говорит "у меня есть" или "не знаю", но не говорит, что сервер ответил 404. Так что 30% это доля страниц, которые куда-то ссылаются. А сайтов, где я могу показать собственный код за такой ссылкой, всего 12. Часть этих серверов вполне может отдать карту любому, кто попросит.

Проверялись только главные, так что доля сайтов, где карта упоминается хоть на какой-то странице, скорее всего, выше. У 17% тегов script копии в окне не было, так что и по этой причине настоящая доля, скорее всего, выше 30%. Хвост это 750 страниц случайной выборки, поэтому у 28,4% интервал примерно от 25 до 32%. Секреты в файлах я не искал. Сайты, чей собственный код лежит в архиве, я тоже не называю. Разделение на собственный код и вендоров моё, сделано руками для 4 SDK уже после счёта.

Для числа сайтов, где карта действительно есть, у меня только нижняя граница. Следующий шаг это спросить у серверов про 1607 карт, запросом HEAD и ничем больше.
