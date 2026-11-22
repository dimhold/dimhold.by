---
title: "Что над горизонтом, если верить открытому каталогу спутников"
description: "Что из публичного каталога спутников CelesTrak в средний момент над горизонтом на 52° северной широты? Я взял копию Wayback от 11 марта 2021 года, проверил метод через SGP4 на 4010 работающих спутниках и получил около 3000 объектов, половина из них обломки. Низкие орбиты это 74% каталога, но только 39% этого неба."
date: 2021-04-11
lang: ru
translationKey: space-debris
tags: ["open-data", "statistics"]
---
Каждый запуск Starlink возвращает в мою ленту один и тот же спор: небо становится тесным, низкая орбита превращается в свалку. Мнение у меня было. Каталог, о котором спорят, я при этом ни разу не открывал, хотя он публичный и это просто текстовый файл.

Файл называется `satcat.txt` и лежит на CelesTrak. Это публичный каталог спутников Космических сил США, который выкладывает Т. С. Келсо. В нём по строке на каждый объект, который когда-либо отслеживали: даты запуска и схода с орбиты, форма орбиты. Я взял копию, сохранённую Wayback Machine 11 марта 2021 года, последнюю перед сегодняшним днём. Так любой может проверить мои числа на том же самом файле. Каталог заканчивается номером NORAD 47721.

Вопрос был простой. Если я стою где-нибудь на 52° северной широты и смотрю вверх, что из этого файла сейчас над моим горизонтом?

## Что в файле

С запуска первого спутника в каталог попал 47 721 объект. 22 129 из них до сих пор на орбите Земли.

Из них 13 138 это обломки и 6733 полезные нагрузки. Остальное это ступени ракет и странные вещи вроде медных иголок проекта West Ford и активных зон реакторов старых советских спутников. Работающими помечены только 3855 из них, то есть что-то делает примерно 1 объект из 6.

При первом подсчёте я потерял 515 объектов. Виноват был мой парсер. В последней колонке файла указано, вокруг какого тела летает объект. Я выбросил все коды на `NE`, потому что это было похоже на Нептун. `NEA` значит "no elements available", то есть элементов нет. У 515 объектов на орбите Земли стоит этот код. У 302 из них колонки орбиты действительно пустые. Вместе с несколькими другими кодами получается 323 объекта на орбите, для которых в файле нет элементов орбиты, 282 из них американские.

Большая часть того, у чего элементы есть, летает низко. У 16 209 из 21 806 объектов апогей ниже 2000 км, это 74%. У обломков чёткий пик между 800 и 850 км: 1494 обломка в одном интервале шириной 50 км. Второй пик ниже, между 500 и 550 км. Там 1337 из 1584 объектов это полезные нагрузки, 852 из них Starlink.

<figure class="fig">
<svg viewBox="0 0 680 294" role="img" aria-label="Гистограмма 16 209 каталогизированных объектов на низкой орбите по средней высоте с шагом 50 км, по типам. Преобладают обломки, пик на 800–850 км, обломков: 1494.">
  <rect x="60.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="78" y="23" text-anchor="start" class="f-muted" style="font-size:11px">обломки</text>
  <rect x="260.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="278" y="23" text-anchor="start" class="f-muted" style="font-size:11px">полезные нагрузки</text>
  <rect x="460.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="478" y="23" text-anchor="start" class="f-muted" style="font-size:11px">ступени и прочее</text>
  <rect x="61.0" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="61.0" y="249.9" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="61.0" y="249.8" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="77.2" y="249.6" width="14.2" height="0.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="77.2" y="249.3" width="14.2" height="0.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="77.2" y="249.3" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="93.4" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="93.4" y="248.2" width="14.2" height="1.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="93.4" y="248.1" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="109.6" y="249.3" width="14.2" height="0.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="109.6" y="245.9" width="14.2" height="3.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="109.6" y="245.5" width="14.2" height="0.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="125.9" y="247.4" width="14.2" height="2.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="125.9" y="225.6" width="14.2" height="21.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="125.9" y="225.0" width="14.2" height="0.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="142.1" y="245.7" width="14.2" height="4.3" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="142.1" y="228.2" width="14.2" height="17.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="142.1" y="226.5" width="14.2" height="1.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="158.3" y="239.6" width="14.2" height="10.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="158.3" y="179.9" width="14.2" height="59.7" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="158.3" y="176.4" width="14.2" height="3.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="174.5" y="231.6" width="14.2" height="18.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="174.5" y="72.2" width="14.2" height="159.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="174.5" y="61.1" width="14.2" height="11.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="190.7" y="220.5" width="14.2" height="29.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="190.7" y="180.8" width="14.2" height="39.7" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="190.7" y="175.8" width="14.2" height="5.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="206.9" y="195.5" width="14.2" height="54.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="206.9" y="167.0" width="14.2" height="28.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="206.9" y="156.3" width="14.2" height="10.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="223.2" y="176.5" width="14.2" height="73.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="223.2" y="159.6" width="14.2" height="16.9" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="223.2" y="157.0" width="14.2" height="2.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="239.4" y="135.3" width="14.2" height="114.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="239.4" y="120.8" width="14.2" height="14.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="239.4" y="117.0" width="14.2" height="3.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="255.6" y="100.1" width="14.2" height="149.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="255.6" y="64.8" width="14.2" height="35.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="255.6" y="54.5" width="14.2" height="10.3" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="271.8" y="71.8" width="14.2" height="178.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="271.8" y="57.6" width="14.2" height="14.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="271.8" y="50.0" width="14.2" height="7.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="288.0" y="90.8" width="14.2" height="159.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="288.0" y="83.3" width="14.2" height="7.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="288.0" y="78.0" width="14.2" height="5.2" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="304.2" y="154.8" width="14.2" height="95.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="304.2" y="143.5" width="14.2" height="11.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="304.2" y="138.7" width="14.2" height="4.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="320.5" y="177.1" width="14.2" height="72.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="320.5" y="150.9" width="14.2" height="26.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="320.5" y="130.3" width="14.2" height="20.6" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="336.7" y="204.1" width="14.2" height="45.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="336.7" y="200.6" width="14.2" height="3.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="336.7" y="197.9" width="14.2" height="2.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="352.9" y="212.8" width="14.2" height="37.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="352.9" y="204.2" width="14.2" height="8.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="352.9" y="200.7" width="14.2" height="3.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="369.1" y="220.8" width="14.2" height="29.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="369.1" y="216.2" width="14.2" height="4.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="369.1" y="214.5" width="14.2" height="1.8" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="385.3" y="229.4" width="14.2" height="20.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="385.3" y="225.6" width="14.2" height="3.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="385.3" y="223.4" width="14.2" height="2.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="401.5" y="236.4" width="14.2" height="13.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="401.5" y="227.8" width="14.2" height="8.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="401.5" y="227.1" width="14.2" height="0.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="417.8" y="221.0" width="14.2" height="29.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="417.8" y="220.4" width="14.2" height="0.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="417.8" y="220.2" width="14.2" height="0.2" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="434.0" y="241.2" width="14.2" height="8.8" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="434.0" y="239.4" width="14.2" height="1.8" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="434.0" y="237.7" width="14.2" height="1.7" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="450.2" y="237.1" width="14.2" height="12.9" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="450.2" y="233.7" width="14.2" height="3.5" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="450.2" y="232.2" width="14.2" height="1.4" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="466.4" y="236.4" width="14.2" height="13.6" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="466.4" y="202.2" width="14.2" height="34.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="466.4" y="199.1" width="14.2" height="3.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="482.6" y="229.6" width="14.2" height="20.4" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="482.6" y="197.4" width="14.2" height="32.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="482.6" y="195.4" width="14.2" height="2.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="498.8" y="230.9" width="14.2" height="19.1" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="498.8" y="225.0" width="14.2" height="6.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="498.8" y="222.8" width="14.2" height="2.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="515.1" y="233.9" width="14.2" height="16.1" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="515.1" y="232.0" width="14.2" height="1.9" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="515.1" y="227.5" width="14.2" height="4.5" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="531.3" y="240.5" width="14.2" height="9.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="531.3" y="239.4" width="14.2" height="1.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="531.3" y="239.3" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="547.5" y="244.5" width="14.2" height="5.5" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="547.5" y="243.2" width="14.2" height="1.3" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="547.5" y="243.1" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="563.7" y="249.3" width="14.2" height="0.7" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="563.7" y="248.7" width="14.2" height="0.6" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="563.7" y="248.6" width="14.2" height="0.1" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="579.9" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="579.9" y="249.5" width="14.2" height="0.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="579.9" y="249.5" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="596.1" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="596.1" y="249.6" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="596.1" y="249.6" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="612.4" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="612.4" y="249.6" width="14.2" height="0.4" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="612.4" y="249.6" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="628.6" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="628.6" y="249.9" width="14.2" height="0.1" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="628.6" y="249.9" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="644.8" y="250.0" width="14.2" height="0.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="644.8" y="249.8" width="14.2" height="0.2" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <rect x="644.8" y="249.8" width="14.2" height="0.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <line x1="60" y1="250" x2="660" y2="250" class="f-line"/>
  <line x1="76.2" y1="250" x2="76.2" y2="254" class="f-line"/>
  <text x="76.2" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">200</text>
  <line x1="173.5" y1="250" x2="173.5" y2="254" class="f-line"/>
  <text x="173.5" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">500</text>
  <line x1="270.8" y1="250" x2="270.8" y2="254" class="f-line"/>
  <text x="270.8" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">800</text>
  <line x1="368.1" y1="250" x2="368.1" y2="254" class="f-line"/>
  <text x="368.1" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1100</text>
  <line x1="465.4" y1="250" x2="465.4" y2="254" class="f-line"/>
  <text x="465.4" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1400</text>
  <line x1="562.7" y1="250" x2="562.7" y2="254" class="f-line"/>
  <text x="562.7" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1700</text>
  <line x1="660.0" y1="250" x2="660.0" y2="254" class="f-line"/>
  <text x="660.0" y="267" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">2000</text>
  <text x="660" y="284" text-anchor="end" class="f-muted" style="font-size:11px">км, среднее апогея и перигея</text>
  <text x="54" y="194.4" text-anchor="end" class="f-muted f-mono" style="font-size:10px">500</text>
  <line x1="60" y1="190.4" x2="660" y2="190.4" class="f-line" style="opacity:.2"/>
  <text x="54" y="134.7" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1000</text>
  <line x1="60" y1="130.7" x2="660" y2="130.7" class="f-line" style="opacity:.2"/>
  <text x="54" y="75.1" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1500</text>
  <line x1="60" y1="71.1" x2="660" y2="71.1" class="f-line" style="opacity:.2"/>
  <text x="295.02702702702703" y="60" text-anchor="start" class="f-accent" style="font-size:12px">800–850 км, обломков: 1494</text>
</svg>
<figcaption>Объекты на орбите Земли с апогеем ниже 2000 км, копия SATCAT CelesTrak от 11 марта 2021 года. Высота это среднее апогея и перигея.</figcaption>
</figure>

У каждого обломка в каталоге стоит обозначение запуска, от которого он остался, поэтому источники мусора можно посчитать. Обломки, которые ещё летают, оставили 857 разных запусков, но основную долю дают несколько из них. Fengyun 1C был китайским метеоспутником, который в январе 2007 года сбили ракетой на испытании. От него на орбите 2875 обломков из 3530 каталогизированных за всё время, то есть через 14 лет там всё ещё 81% облака. Cosmos 2251 и Iridium 33, столкнувшиеся в феврале 2009 года, добавляют 1094 и 347. Вместе это 4316 штук, 33% всех обломков на орбите.

<figure class="fig">
<svg viewBox="0 0 680 218" role="img" aria-label="Обломки по событиям, от которых они остались, каталогизировано и ещё на орбите: Fengyun 1C, 2007: 3530, 2875; Cosmos 2251, 2009: 1714, 1094; NOAA 16, 2015: 458, 456; Cosmos 1275, 1981: 478, 418; Iridium 33, 2009: 656, 347.">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">каталогизировано обломков за всё время</text>
  <rect x="320.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="338" y="22" text-anchor="start" class="f-muted" style="font-size:11px">ещё на орбите</text>
  <text x="160" y="56" text-anchor="end" class="f-ink" style="font-size:11px">Fengyun 1C, 2007</text>
  <rect x="170.0" y="44.0" width="400.0" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="54.0" width="325.8" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="578" y="53" text-anchor="start" class="f-mono f-muted" style="font-size:11px">3530</text>
  <text x="503.77903682719545" y="64" text-anchor="start" class="f-mono f-accent" style="font-size:11px">2875, 81%</text>
  <text x="160" y="90" text-anchor="end" class="f-ink" style="font-size:11px">Cosmos 2251, 2009</text>
  <rect x="170.0" y="78.0" width="194.2" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="88.0" width="124.0" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="372.22096317280455" y="87" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1714</text>
  <text x="301.9660056657224" y="98" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1094, 64%</text>
  <text x="160" y="124" text-anchor="end" class="f-ink" style="font-size:11px">NOAA 16, 2015</text>
  <rect x="170.0" y="112.0" width="51.9" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="122.0" width="51.7" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="229.89801699716713" y="121" text-anchor="start" class="f-mono f-muted" style="font-size:11px">458</text>
  <text x="229.671388101983" y="132" text-anchor="start" class="f-mono f-accent" style="font-size:11px">456, 100%</text>
  <text x="160" y="158" text-anchor="end" class="f-ink" style="font-size:11px">Cosmos 1275, 1981</text>
  <rect x="170.0" y="146.0" width="54.2" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="156.0" width="47.4" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="232.1643059490085" y="155" text-anchor="start" class="f-mono f-muted" style="font-size:11px">478</text>
  <text x="225.3654390934844" y="166" text-anchor="start" class="f-mono f-accent" style="font-size:11px">418, 87%</text>
  <text x="160" y="192" text-anchor="end" class="f-ink" style="font-size:11px">Iridium 33, 2009</text>
  <rect x="170.0" y="180.0" width="74.3" height="9.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <rect x="170.0" y="190.0" width="39.3" height="9.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="252.33427762039662" y="189" text-anchor="start" class="f-mono f-muted" style="font-size:11px">656</text>
  <text x="217.32011331444758" y="200" text-anchor="start" class="f-mono f-accent" style="font-size:11px">347, 53%</text>
</svg>
<figcaption>5 событий, от которых на орбите осталось больше всего обломков, по международному обозначению. Год это год разрушения. Fengyun 1C и столкновение Cosmos 2251 с Iridium 33 дают 4316 из 13 138 обломков на орбите.</figcaption>
</figure>

## Что над горизонтом

Положений в каталоге нет, есть только форма каждой орбиты. Для среднего числа этого хватает. Каждую орбиту я беру из файла без изменений, задаю ей случайную ориентацию и смотрю на объект в случайный момент. Доля вариантов, в которых объект над горизонтом точки на 52°, это вероятность застать его там. Сумма этих вероятностей по каталогу даёт ожидаемое число объектов над горизонтом. Считал на Python с numpy, 4000 вариантов на объект.

Прежде чем этому верить, я хотел проверить метод на настоящих положениях. CelesTrak выкладывает ещё `active.txt` со свежими элементами орбит работающих спутников. У Wayback Machine есть копия с сегодняшнего утра, 11 апреля, 9:06 UTC, в ней 4010 спутников. Я прогнал их через SGP4 (пакет `sgp4` для Python) на целые сутки для точки 52° с. ш., 21° в. д. В среднем над горизонтом было 500. Мой метод для тех же 4010 орбит дал 458.

Я какое-то время искал ошибку в геометрии, её не было. Дело было в долготе. Та же проверка для 12 точек вдоль 52-й параллели даёт от 406 до 534. В среднем по всем 12 это 462. Почти весь разброс даёт геостационарный пояс: с 60° в. д. в среднем видно 297 геостационарных спутников, со 120° з. д. только 168. Так что метод даёт хорошее среднее для широты, но конкретное место может отличаться от него до 17%.

Потом весь каталог от 11 марта. На 52° северной широты в средний момент над горизонтом 3022 каталогизированных объекта.

<figure class="fig">
<svg viewBox="0 0 680 198" role="img" aria-label="Доли типов орбит. На орбите: низкие, апогей ниже 2000 км 16 209 (74%), высокоэллиптические 2707 (12%), средние и прочие высокие 1673 (8%), геостационарные 1217 (6%). Над горизонтом на 52 градусах северной широты: низкие, апогей ниже 2000 км 1174 (39%), высокоэллиптические 704 (23%), средние и прочие высокие 634 (21%), геостационарные 510 (17%).">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="21" text-anchor="start" class="f-muted" style="font-size:11px">низкие, апогей ниже 2000 км</text>
  <rect x="340.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="358" y="21" text-anchor="start" class="f-muted" style="font-size:11px">высокоэллиптические</text>
  <rect x="20.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="39" text-anchor="start" class="f-muted" style="font-size:11px">средние и прочие высокие</text>
  <rect x="340.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="358" y="39" text-anchor="start" class="f-muted" style="font-size:11px">геостационарные</text>
  <text x="20" y="70" text-anchor="start" class="f-ink" style="font-size:12px">на орбите, 21 806 объектов</text>
  <rect x="20.0" y="78.0" width="474.7" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="257.9" y="97" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">74%</text>
  <rect x="495.7" y="78.0" width="78.4" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="535.5" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">12%</text>
  <rect x="575.2" y="78.0" width="48.1" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="599.7" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">8%</text>
  <rect x="624.3" y="78.0" width="34.7" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="20" y="146" text-anchor="start" class="f-ink" style="font-size:12px">над горизонтом на 52° с. ш., в среднем 3022</text>
  <rect x="20.0" y="154.0" width="247.6" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="144.3" y="173" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">39%</text>
  <rect x="268.6" y="154.0" width="148.1" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="343.2" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">23%</text>
  <rect x="417.7" y="154.0" width="133.3" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="484.9" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">21%</text>
  <rect x="552.0" y="154.0" width="107.0" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="606.0" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">17%</text>
</svg>
<figcaption>Число над горизонтом это ожидаемое число в средний момент на средней долготе: каждая орбита из каталога повёрнута случайно, 4000 вариантов на объект. Проверка через SGP4 на 4010 работающих спутниках дала 462 против 458 по этому методу.</figcaption>
</figure>

Я думал, что небо надо мной это в основном низкие орбиты, потому что спор именно о них. В каталоге низкие орбиты составляют 74%. Над горизонтом их 1174 из 3022, это 39%. Объект на высоте 550 км виден из круга радиусом около 2560 км. Над моим горизонтом он бывает всего несколько минут за пролёт. Геостационарный спутник на 35 786 км виден с 42% поверхности Земли и стоит на небе на одном месте. Поэтому 510 объектов геостационарного пояса и 1338 с других высоких орбит дают над моим горизонтом больше объектов, чем 16 209 низких.

Со Starlink то же самое. На 11 марта в каталоге было 1079 спутников Starlink, 28% всех работающих. В средний момент над горизонтом их 51, а всего работающих спутников над горизонтом 463. Это 11%.

Половина того, что над горизонтом, обломки: 1492 объекта. Работающих спутников 15%. Выше 30° над горизонтом, где что-то действительно над головой, а не над верхушками деревьев, 640 объектов, из них работают 80.

Ещё я не ожидал, что число растёт с широтой. На экваторе метод даёт 2656, на 70° северной широты 3258. Я разложил это по типам орбит. Объектов на низких орбитах над горизонтом на экваторе 668, а на 70° уже 1665. Геостационарный пояс идёт в обратную сторону, от 550 до 413, потому что из северных широт он виден низко над южным горизонтом. Для низких орбит у меня есть догадка: наклонные орбиты проводят больше времени у крайних широт своей трассы, где она поворачивает. По наклонению я это не проверял.

## Чего я не проверял

В каталоге только то, что можно отследить и опознать, на низкой орбите это примерно от 10 см. Всего, что меньше, в этих числах нет вообще. Нет в подсчёте над горизонтом и 323 объектов без орбиты.

Мой метод не учитывает, что у некоторых орбит ориентация закреплена. Спутники на орбитах типа "Молния" держат апогей над северным полушарием, так что для них метод занижает. На 22 высокоэллиптических спутниках из `active.txt` SGP4 даёт 10,8 над горизонтом, а метод 7,5. Большую часть разницы дают 8 российских спутников на орбитах типа "Молния". Для 2707 высокоэллиптических объектов во всём каталоге я это не проверял.

Орбиты взяты из копии от 11 марта. За месяц после неё были новые запуски. В сегодняшнем `active.txt` уже 1313 спутников Starlink. Сводка CelesTrak от 10 апреля насчитывает 22 712 объектов, которые не сошли с орбиты. Тот же подсчёт по моей копии даёт 22 377. Пропорции за месяц не должны сильно поменяться, но я их не пересчитывал.

Ещё я считал объекты, а не то, что видно глазом. Для этого нужны положение Солнца и размер каждого объекта.

Так что в следующий раз, когда спор вернётся, у меня будет число. На 52° северной широты над горизонтом около 3000 каталогизированных объектов, половина из них обломки. Пересчитаю на следующей копии каталога через несколько месяцев.
