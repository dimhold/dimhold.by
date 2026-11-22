---
title: "Што над гарызонтам, калі верыць адкрытаму каталогу спадарожнікаў"
description: "Што з публічнага каталога спадарожнікаў CelesTrak у сярэдні момант над гарызонтам на 52° паўночнай шыраты? Я ўзяў копію Wayback ад 11 сакавіка 2021 года, праверыў метад праз SGP4 на 4010 дзейных спадарожніках і атрымаў каля 3000 аб'ектаў, палова з іх абломкі. Нізкія арбіты гэта 74% каталога, але толькі 39% гэтага неба."
date: 2021-04-11
lang: be
translationKey: space-debris
tags: ["open-data", "statistics"]
---
Кожны запуск Starlink вяртае ў маю стужку адну і тую ж спрэчку: неба становіцца цесным, нізкая арбіта ператвараецца ў сметнік. Меркаванне ў мяне было. Каталог, пра які спрачаюцца, я пры гэтым ні разу не адкрываў, хоць ён публічны і гэта проста тэкставы файл.

Файл называецца `satcat.txt` і ляжыць на CelesTrak. Гэта публічны каталог спадарожнікаў Касмічных сіл ЗША, які выкладвае Т. С. Келса. У ім па радку на кожны аб'ект, які калі-небудзь адсочвалі: даты запуску і сыходу з арбіты, а таксама яе форма. Я ўзяў копію, захаваную Wayback Machine 11 сакавіка 2021 года, апошнюю перад сённяшнім днём. Так кожны можа праверыць мае лічбы на тых жа байтах. Каталог заканчваецца нумарам NORAD 47721.

Пытанне было простае. Калі я стаю дзе-небудзь на 52° паўночнай шыраты і гляджу ўгору, што з гэтага файла зараз над маім гарызонтам?

## Што ў файле

З запуску першага спадарожніка ў каталог трапіў 47 721 аб'ект. 22 129 з іх дагэтуль на арбіце Зямлі.

Сярод іх 13 138 гэта абломкі і 6733 карысныя нагрузкі. Астатняе гэта ступені ракет і дзіўныя рэчы накшталт медных іголак праекта West Ford і актыўных зон рэактараў старых савецкіх спадарожнікаў. Дзейнымі пазначаны толькі 3855 з іх, гэта значыць нешта робіць прыкладна 1 аб'ект з 6.

Мой першы падлік згубіў 515 аб'ектаў. Вінаваты быў мой уласны парсер. Апошняя калонка кажа, вакол якога цела ляціць аб'ект. Я выкінуў усе коды, якія пачынаюцца з `NE`, бо гэта было падобна на Нептун. `NEA` азначае "no elements available", то бок элементаў няма. У 515 аб'ектаў на арбіце Зямлі стаіць гэты код. У 302 з іх калонкі арбіты сапраўды пустыя. Разам з некалькімі іншымі кодамі атрымліваецца 323 аб'екты на арбіце, у якіх у файле няма параметраў арбіты, 282 з іх амерыканскія.

Большая частка таго, у чаго элементы ёсць, лятае нізка. У 16 209 з 21 806 аб'ектаў апагей ніжэй за 2000 км, гэта 74%. У абломкаў выразны пік паміж 800 і 850 км: 1494 абломкі ў адным інтэрвале шырынёй 50 км. Другі пік ніжэй, паміж 500 і 550 км. Там 1337 з 1584 аб'ектаў гэта карысныя нагрузкі, 852 з іх Starlink.

<figure class="fig">
<svg viewBox="0 0 680 294" role="img" aria-label="Гістаграма 16 209 каталагізаваных аб'ектаў на нізкай арбіце па сярэдняй вышыні з крокам 50 км, па тыпах. Пераважаюць абломкі, пік на 800–850 км, абломкаў: 1494.">
  <rect x="60.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="78" y="23" text-anchor="start" class="f-muted" style="font-size:11px">абломкі</text>
  <rect x="260.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="278" y="23" text-anchor="start" class="f-muted" style="font-size:11px">карысныя нагрузкі</text>
  <rect x="460.0" y="14.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="478" y="23" text-anchor="start" class="f-muted" style="font-size:11px">ступені і іншае</text>
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
  <text x="660" y="284" text-anchor="end" class="f-muted" style="font-size:11px">км, сярэдняе апагея і перыгея</text>
  <text x="54" y="194.4" text-anchor="end" class="f-muted f-mono" style="font-size:10px">500</text>
  <line x1="60" y1="190.4" x2="660" y2="190.4" class="f-line" style="opacity:.2"/>
  <text x="54" y="134.7" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1000</text>
  <line x1="60" y1="130.7" x2="660" y2="130.7" class="f-line" style="opacity:.2"/>
  <text x="54" y="75.1" text-anchor="end" class="f-muted f-mono" style="font-size:10px">1500</text>
  <line x1="60" y1="71.1" x2="660" y2="71.1" class="f-line" style="opacity:.2"/>
  <text x="295.02702702702703" y="60" text-anchor="start" class="f-accent" style="font-size:12px">800–850 км, абломкаў: 1494</text>
</svg>
<figcaption>Аб'екты на арбіце Зямлі з апагеем ніжэй за 2000 км, копія SATCAT CelesTrak ад 11 сакавіка 2021 года. Вышыня гэта сярэдняе апагея і перыгея.</figcaption>
</figure>

Кожны абломак у каталогу нясе абазначэнне запуску, ад якога ён застаўся, таму крыніцы смецця можна палічыць. Абломкі, якія яшчэ лётаюць, пакінулі 857 розных запускаў, але большую частку абломкаў далі некалькі з іх. Fengyun 1C быў кітайскім метэаспадарожнікам, які ў студзені 2007 года збілі ракетай падчас выпрабавання. Ад яго на арбіце 2875 абломкаў з 3530 каталагізаваных за ўвесь час, гэта значыць праз 14 гадоў там усё яшчэ 81% воблака. Cosmos 2251 і Iridium 33, якія сутыкнуліся ў лютым 2009 года, дадаюць 1094 і 347. Разам гэта 4316 штук, 33% усіх абломкаў на арбіце.

<figure class="fig">
<svg viewBox="0 0 680 218" role="img" aria-label="Абломкі па падзеях, ад якіх яны засталіся, каталагізавана і яшчэ на арбіце: Fengyun 1C, 2007: 3530, 2875; Cosmos 2251, 2009: 1714, 1094; NOAA 16, 2015: 458, 456; Cosmos 1275, 1981: 478, 418; Iridium 33, 2009: 656, 347.">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="22" text-anchor="start" class="f-muted" style="font-size:11px">каталагізавана абломкаў за ўвесь час</text>
  <rect x="320.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="338" y="22" text-anchor="start" class="f-muted" style="font-size:11px">яшчэ на арбіце</text>
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
<figcaption>5 падзей, ад якіх на арбіце засталося найбольш абломкаў, па міжнародным абазначэнні. Год гэта год разбурэння. Fengyun 1C і сутыкненне Cosmos 2251 з Iridium 33 даюць 4316 з 13 138 абломкаў на арбіце.</figcaption>
</figure>

## Што над гарызонтам

Каардынат у каталогу няма, ёсць толькі форма кожнай арбіты. Для сярэдняй колькасці гэтага хапае. Я бяру кожную арбіту такой, як яна ёсць у файле, і задаю ёй выпадковую арыентацыю ў выпадковы момант. Доля варыянтаў, у якіх аб'ект над гарызонтам пункта на 52°, гэта імавернасць заспець яго там. Сума гэтых імавернасцей па каталогу дае чаканую колькасць аб'ектаў над гарызонтам. Лічыў на Python з numpy, 4000 варыянтаў на аб'ект.

Перш чым гэтаму верыць, я хацеў праверыць метад на сапраўдных каардынатах. CelesTrak выкладвае яшчэ `active.txt` са свежымі элементамі арбіт спадарожнікаў, якія працуюць. У Wayback Machine ёсць копія з сённяшняй раніцы, 11 красавіка, 9:06 UTC, у ёй 4010 спадарожнікаў. Я пралічыў іх рух праз SGP4 (пакет `sgp4` для Python) на працягу ўсіх сутак для пункта 52° пн. ш., 21° у. д. У сярэднім над гарызонтам было 500. Мой метад для тых жа 4010 арбіт даў 458.

Я нейкі час шукаў памылку ў геаметрыі, яе не было. Розніца была ў даўгаце. Тая ж праверка для 12 пунктаў уздоўж 52-й паралелі дае ад 406 да 534. У сярэднім па ўсіх 12 гэта 462. Амаль увесь роскід дае геастацыянарны пояс: з 60° у. д. у сярэднім відаць 297 геастацыянарных спадарожнікаў, са 120° з. д. толькі 168. Так што метад дае добрае сярэдняе для шыраты, але канкрэтнае месца можа адрознівацца ад яго да 17%.

Потым увесь каталог ад 11 сакавіка. На 52° паўночнай шыраты ў сярэдні момант над гарызонтам 3022 каталагізаваныя аб'екты.

<figure class="fig">
<svg viewBox="0 0 680 198" role="img" aria-label="Долі тыпаў арбіт. На арбіце: нізкія, апагей ніжэй за 2000 км 16 209 (74%), высокаэліптычныя 2707 (12%), сярэднія і іншыя высокія 1673 (8%), геастацыянарныя 1217 (6%). Над гарызонтам на 52 градусах паўночнай шыраты: нізкія, апагей ніжэй за 2000 км 1174 (39%), высокаэліптычныя 704 (23%), сярэднія і іншыя высокія 634 (21%), геастацыянарныя 510 (17%).">
  <rect x="20.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="21" text-anchor="start" class="f-muted" style="font-size:11px">нізкія, апагей ніжэй за 2000 км</text>
  <rect x="340.0" y="12.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="358" y="21" text-anchor="start" class="f-muted" style="font-size:11px">высокаэліптычныя</text>
  <rect x="20.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="38" y="39" text-anchor="start" class="f-muted" style="font-size:11px">сярэднія і іншыя высокія</text>
  <rect x="340.0" y="30.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="358" y="39" text-anchor="start" class="f-muted" style="font-size:11px">геастацыянарныя</text>
  <text x="20" y="70" text-anchor="start" class="f-ink" style="font-size:12px">на арбіце, 21 806 аб'ектаў</text>
  <rect x="20.0" y="78.0" width="474.7" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="257.9" y="97" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">74%</text>
  <rect x="495.7" y="78.0" width="78.4" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="535.5" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">12%</text>
  <rect x="575.2" y="78.0" width="48.1" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="599.7" y="97" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">8%</text>
  <rect x="624.3" y="78.0" width="34.7" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="20" y="146" text-anchor="start" class="f-ink" style="font-size:12px">над гарызонтам на 52° пн. ш., у сярэднім 3022</text>
  <rect x="20.0" y="154.0" width="247.6" height="28.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="144.3" y="173" text-anchor="middle" class="f-mono" style="fill:var(--bg);font-size:11px">39%</text>
  <rect x="268.6" y="154.0" width="148.1" height="28.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="343.2" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">23%</text>
  <rect x="417.7" y="154.0" width="133.3" height="28.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="484.9" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">21%</text>
  <rect x="552.0" y="154.0" width="107.0" height="28.0" class="f-box" style="fill:var(--accent);opacity:.3;stroke:none"/>
  <text x="606.0" y="173" text-anchor="middle" class="f-mono" style="fill:var(--ink);font-size:11px">17%</text>
</svg>
<figcaption>Над гарызонтам гэта чаканая колькасць у сярэдні момант на сярэдняй даўгаце: кожная арбіта з каталога павернутая выпадкова, 4000 варыянтаў на аб'ект. Праверка праз SGP4 на 4010 спадарожніках, якія працуюць, дала 462 супраць 458 па гэтым метадзе.</figcaption>
</figure>

Я думаў, што неба нада мной гэта ў асноўным нізкія арбіты, бо спрэчка якраз пра іх. У каталогу нізкія арбіты складаюць 74%. Над гарызонтам іх 1174 з 3022, гэта 39%. Аб'ект на вышыні 550 км бачны з круга радыусам каля 2560 км. Над маім гарызонтам ён бывае ўсяго некалькі хвілін за пралёт. Геастацыянарны спадарожнік на 35 786 км бачны з 42% паверхні Зямлі і стаіць на небе на адным месцы. Таму 510 аб'ектаў геастацыянарнага пояса і 1338 з іншых высокіх арбіт займаюць у маім небе больш месца, чым 16 209 нізкіх.

Са Starlink тое ж самае. На 11 сакавіка ў каталогу было 1079 спадарожнікаў Starlink, 28% усіх, якія працуюць. Над гарызонтам у сярэдні момант іх 51, а ўсяго дзейных спадарожнікаў над гарызонтам 463. Гэта 11%.

Палова таго, што над гарызонтам, гэта абломкі: 1492 аб'екты. Дзейных спадарожнікаў 15%. Вышэй за 30° над гарызонтам, дзе нешта сапраўды над галавой, а не над верхавінамі дрэў, 640 аб'ектаў і з іх працуюць 80.

Яшчэ я не чакаў, што колькасць расце з шыратой. На экватары метад дае 2656, на 70° паўночнай шыраты 3258. Я расклаў гэта па тыпах арбіт. На нізкіх арбітах над гарызонтам ад 668 аб'ектаў на экватары становіцца 1665 на 70°. Геастацыянарны пояс ідзе ў адваротны бок, ад 550 да 413, бо з поўначы ён вісіць нізка на поўдні. Для нізкіх арбіт у мяне ёсць здагадка: нахіленыя арбіты даўжэй бываюць каля сваёй найбольшай шыраты, дзе траса паварочвае. Па нахіле я гэта не правяраў.

## Чаго я не правяраў

У каталогу толькі тое, што можна адсачыць і апазнаць, на нізкай арбіце гэта прыкладна ад 10 см. Усяго, што меншае, у гэтых лічбах няма наогул. Няма ў падліку над гарызонтам і 323 аб'ектаў без арбіты.

Мой метад не ўлічвае, што ў некаторых арбіт арыентацыя замацаваная. Спадарожнікі на арбітах тыпу "Молнія" трымаюць апагей над паўночным паўшар'ем, так што для іх метад заніжае. На 22 высокаэліптычных спадарожніках з `active.txt` SGP4 дае 10,8 над гарызонтам, а метад 7,5. Большую частку розніцы даюць 8 расійскіх спадарожнікаў на арбітах тыпу "Молнія". Для 2707 высокаэліптычных аб'ектаў ва ўсім каталогу я гэта не правяраў.

Арбіты ўзяты з копіі ад 11 сакавіка. За месяц пасля яе былі новыя запускі. У сённяшнім `active.txt` ужо 1313 спадарожнікаў Starlink. Зводка CelesTrak ад 10 красавіка налічвае 22 712 аб'ектаў, якія не сышлі з арбіты. Той жа падлік па маёй копіі дае 22 377. Прапорцыі за месяц не павінны моцна змяніцца, але я іх не пералічваў.

Яшчэ я лічыў аб'екты, а не тое, што відаць вокам. Для гэтага патрэбныя вугал Сонца і памер кожнага аб'екта.

Так што наступным разам, калі спрэчка вернецца, у мяне будзе лічба. На 52° паўночнай шыраты над гарызонтам каля 3000 каталагізаваных аб'ектаў, палова з іх абломкі. Пералічу па наступнай копіі каталога праз некалькі месяцаў.
