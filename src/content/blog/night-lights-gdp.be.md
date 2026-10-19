---
title: "З космасу нафтавая акруга Паўночнай Дакоты дае ў 17 разоў больш святла, чым Манхэтэн"
description: "Гадавое начное святло VIIRS па 3080 акругах ЗША супраць ВУП акруг BEA з выпуску снежня 2022 года: узроўні супадаюць на 0,92, рост толькі праз нафтавыя радовішчы, святло па краіне ўпала на 9,5% да 2016 года без усякай рэцэсіі, а ў 2020 годзе звычайныя акругі пацямнелі менш, чым упаў іх ВУП."
date: 2022-12-20
lang: be
translationKey: night-lights-gdp
tags: ["open-data", "statistics"]
---
Ёсць здымак Карэйскага паўвострава ноччу: поўдзень увесь у агнях, поўнач амаль чорная. Я шмат разоў даставаў яго, калі мяне пыталіся, ці можна вымераць эканоміку па святле са спадарожніка. У размове ён заўсёды спрацоўваў. Сёлета начныя агні зноў з'явіліся ў эканоміцы. Луіс Марцінес апублікаваў працу, дзе па іх правярае, наколькі аўтакратыі завышаюць рост свайго ВУП. Я зразумеў, што ні разу не глядзеў на лічбы за гэтай карцінкай. Я толькі ведаў, што святло і грошы ідуць разам. Наколькі цесна, я не ведаў.

Таму я ўзяў месца, дзе афіцыйныя лічбы добрыя і зверыў з імі святло. 8 снежня BEA апублікавала ВУП па акругах за 2021 год. Гэта рабілі і да мяне. Хендэрсан, Сторыгард і Вейл пабудавалі метад на краінах у 2012 годзе. Джон Гібсан з суаўтарам у 2021 годзе зрабіў амаль такое самае параўнанне для акруг ЗША, артыкул выйшаў у Remote Sensing. Я прачытаў іх анатацыю і захацеў убачыць астатняе на свае вочы.

## Даныя

Святло гэта гадавыя кампазіты VIIRS ад Горнай школы Каларада, VNL версіі 2.1. Гэта сярэдняя яркасць пасля маскі, з якой прыбраныя фон і кароткачасовыя крыніцы накшталт пажараў. Сетка з крокам 15 вуглавых секунд, каля 500 метраў. Па кожнай акрузе я склаў яркасць усіх яе пікселяў з вагой па плошчы пікселя, бо на поўнач пікселі робяцца меншымі. ВУП узяты з выпуску BEA ад 8 снежня: рэальны ВУП акруг у ланцуговых доларах 2012 года. Вірджынія падае даныя па некаторых незалежных гарадах разам з іх акругамі, таму я гэтак жа аб'яднаў іх контуры. Атрымалася 3080 адзінак у 48 штатах і акрузе Калумбія. Аляску і Гаваі я з растра не выразаў.

Да падліку я запісаў, чаго чакаю. Узроўні супадуць добра, карэляцыя 0,8 або вышэй. Рост супадзе слаба, менш за 0,3. Змены з году ў год будуць блізкія да шуму. А ў 2020 годзе святло ўпадзе менш за ВУП або не ўпадзе зусім, бо людзі сядзелі дома з уключаным святлом.

<figure class="fig">
<svg viewBox="0 0 680 330" role="img" aria-label="Дзве дыяграмы шчыльнасці па 3080 адзінках акруг ЗША. Злева ўзроўні 2019 года: сумарнае начное святло ў лагарыфмічнай шкале супраць ВУП у лагарыфмічнай шкале. Ячэйкі ляжаць вузкай дыяганальнай паласой, карэляцыя 0,92. Манхэтэн стаіць уверсе, далёка над паласой: вялікі ВУП пры ўмераным святле. Акруга Макензі ў Паўночнай Дакоце стаіць далёка справа: святла больш, чым у Манхэтэна, ВУП малы. Справа рост з 2013 па 2019 год: змена святла супраць змены ВУП. Ячэйкі ляжаць шырокім воблакам з лёгкім нахілам, карэляцыя 0,33 па ўсіх акругах і 0,12 без 124 акруг, дзе здабыча большая за 30% ВУП. Акругі здабычы вылучаны іншым колерам і раскіданы значна шырэй за астатнія, найбольш уздоўж восі святла.">
  <text x="86" y="20" class="f-label">узровень, 2019</text>
  <rect x="86" y="30" width="234" height="230" class="f-plain" style="fill:none"/>
  <line x1="125.0" y1="30" x2="125.0" y2="260" class="f-plain"/>
  <text x="125.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10¹</text>
  <line x1="164.0" y1="30" x2="164.0" y2="260" class="f-plain"/>
  <text x="164.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10²</text>
  <line x1="203.0" y1="30" x2="203.0" y2="260" class="f-plain"/>
  <text x="203.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10³</text>
  <line x1="242.0" y1="30" x2="242.0" y2="260" class="f-plain"/>
  <text x="242.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁴</text>
  <line x1="281.0" y1="30" x2="281.0" y2="260" class="f-plain"/>
  <text x="281.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁵</text>
  <line x1="86" y1="214.0" x2="320" y2="214.0" class="f-plain"/>
  <text x="81" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100 млн $</text>
  <line x1="86" y1="168.0" x2="320" y2="168.0" class="f-plain"/>
  <text x="81" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1 млрд $</text>
  <line x1="86" y1="122.0" x2="320" y2="122.0" class="f-plain"/>
  <text x="81" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10 млрд $</text>
  <line x1="86" y1="76.0" x2="320" y2="76.0" class="f-plain"/>
  <text x="81" y="79.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100 млрд $</text>
  <rect x="207.9" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="232.3" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="233.2" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="198.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="198.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="223.5" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="203.0" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="203.0" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="188.4" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="212.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="223.5" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="188.4" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="228.3" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="188.4" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="242.0" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="243.0" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="246.9" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="237.1" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="227.4" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="218.6" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="246.9" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="203.0" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="223.5" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="178.6" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="173.8" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="183.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="173.8" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="207.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="251.8" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="125.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="193.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="183.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="242.0" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="188.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="189.3" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="285.9" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="165.0" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="266.4" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="266.4" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="251.8" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="193.3" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="261.5" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="222.5" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="139.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="188.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="189.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="232.3" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="242.0" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="203.0" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="198.1" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="164.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="237.1" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="222.5" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="188.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="164.0" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="149.4" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="150.3" y="209.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="178.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="179.6" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="199.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="188.4" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="189.3" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="178.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="179.6" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="115.3" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="169.8" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="164.0" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="149.4" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="203.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="129.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="198.1" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="246.9" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="242.0" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="212.8" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="246.9" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="256.6" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="173.8" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="261.5" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="251.8" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="271.3" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="242.0" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="173.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="160.1" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="183.5" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="164.0" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="154.3" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="155.2" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="173.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="174.7" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="164.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="159.1" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="207.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="256.6" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="222.5" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="227.4" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="154.3" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144.5" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="164.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="154.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="155.2" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="159.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="188.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="168.9" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="208.8" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="198.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="227.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="228.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="251.8" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="237.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="173.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="256.6" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="233.2" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="149.4" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="154.3" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="134.8" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="134.8" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="115.3" y="248.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="125.0" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="115.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="139.6" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="276.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="145.5" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="242.0" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="257.6" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="126.0" y="220.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="222.5" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="198.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="207.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="204.0" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="262.5" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="282.0" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="149.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="262.5" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="204.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="154.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="233.2" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="276.1" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="285.9" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="174.7" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="160.1" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="140.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="252.7" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="233.2" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="267.4" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="145.5" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="271.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="120.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <text x="203" y="290" text-anchor="middle" class="f-label f-muted">святло (лаг)</text>
  <text x="90" y="42" class="f-label f-muted">ВУП (лаг)</text>
  <text x="400" y="20" class="f-label">рост, 2013 → 2019</text>
  <rect x="400" y="30" width="260" height="230" class="f-plain" style="fill:none"/>
  <line x1="450.6" y1="30" x2="450.6" y2="260" class="f-plain"/>
  <text x="450.6" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">−60%</text>
  <line x1="530.0" y1="30" x2="530.0" y2="260" class="f-plain"/>
  <text x="530.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="609.4" y1="30" x2="609.4" y2="260" class="f-plain"/>
  <text x="609.4" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">+150%</text>
  <line x1="400" y1="223.3" x2="660" y2="223.3" class="f-plain"/>
  <text x="395" y="226.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">−40%</text>
  <line x1="400" y1="145.0" x2="660" y2="145.0" class="f-plain"/>
  <text x="395" y="148.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="400" y1="72.9" x2="660" y2="72.9" class="f-plain"/>
  <text x="395" y="75.9" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+60%</text>
  <rect x="524.6" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="551.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="540.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="546.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="519.2" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="547.3" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="557.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="540.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="540.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="541.9" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="535.4" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="536.5" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="536.5" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="524.6" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="536.5" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="525.7" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="530.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="519.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="492.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="536.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="513.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="514.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="513.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="514.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="540.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="486.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="541.9" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="504.0" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="493.2" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="497.5" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="508.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="519.2" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="502.9" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="557.1" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="54.1" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="508.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="134.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="551.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="525.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="541.9" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="551.7" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="513.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="530.0" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="535.4" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="595.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="497.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="567.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="569.0" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="237.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="551.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="562.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="514.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="508.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="519.2" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="502.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="520.3" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="498.6" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="509.4" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="254.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="567.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="530.0" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="531.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="502.9" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="486.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="497.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="30.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="486.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="530.0" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="531.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="502.9" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="551.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="552.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="574.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="584.2" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="519.2" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="639.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="632.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="611.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="470.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="471.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="497.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="498.6" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="498.6" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="486.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="498.6" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="481.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="595.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="492.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="519.2" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="567.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="35.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="563.6" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="215.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="552.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="541.9" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="530.0" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="238.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="590.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="601.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="481.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="401.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="634.0" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="601.5" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="444.4" y="249.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="579.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="611.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="437.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="632.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="584.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="65.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="643.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="427.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="487.8" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="605.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="470.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="476.9" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="225.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="567.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="578.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="590.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="573.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="411.9" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="574.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="639.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="627.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="482.3" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="459.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="448.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="41.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="650.3" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="612.3" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="558.2" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="562.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="487.8" y="232.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="459.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="220.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="509.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <text x="530" y="290" text-anchor="middle" class="f-label f-muted">змена святла</text>
  <text x="404" y="42" class="f-label f-muted">змена ВУП</text>
  <circle cx="233.7" cy="38.9" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="241.7" y="31.9" text-anchor="start" class="f-label">Манхэтэн</text>
  <circle cx="282.1" cy="136.2" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <line x1="282.1" y1="141.2" x2="282.1" y2="186.2" class="f-line" style="stroke:var(--accent);stroke-width:1"/>
  <text x="326.0" y="198.2" text-anchor="end" class="f-label">Макензі</text>
  <rect x="60" y="306" width="12" height="12" class="f-ink" style="fill-opacity:0.45"/>
  <text x="80" y="316" class="f-label f-muted">астатнія акругі</text>
  <rect x="262" y="308" width="8" height="8" class="f-accent"/>
  <text x="278" y="316" class="f-label f-muted">здабыча &gt; 30% ВУП</text>
</svg>
<figcaption>Гадавыя кампазіты VIIRS (VNL v2.1), прасумаваныя па кожнай акрузе, рэальны ВУП BEA з выпуску 8 снежня 2022 года. Чым цямнейшая ячэйка, тым больш у ёй акруг. Правая панэль паказвае святло ад −78% да +348% і ВУП ад −53% да +112%, за яе край выходзяць 30 акруг.</figcaption>
</figure>

## Узроўні

За 2019 год карэляцыя лагарыфма святла з лагарыфмам ВУП па 3080 акругах роўная 0,92. Нахіл 1,03, гэта значыць дзе святла на 10% больш, там і ВУП прыкладна на 10% большы. У 2013 і 2021 гадах тое самае. У сярэдніх 80% акруг ВУП на адзінку святла адрозніваецца прыкладна ў 4 разы.

Пару з краёў я б паказваў у дакладзе замест Карэі. Манхэтэн у 2019 годзе вырабіў 641 млрд долараў. Акруга Макензі ў Паўночнай Дакоце вырабіла 4,9 млрд. Макензі ў суме дае ў 17 разоў больш святла, але яна і ў 120 разоў большая па плошчы, так што на квадратны кіламетр яна цямнейшая. На долар ВУП розніца прыкладна ў 2300 разоў. Макензі ляжыць пасярод нафтавага радовішча Бакен. Я мяркую, што большая частка гэтага святла гэта газавыя факелы і асветленыя буравыя пляцоўкі, але на здымку я іх не раздзяляў.

124 акругі, дзе здабыча большая за 30% ВУП, даюць 1,1% ВУП маёй выбаркі ў бягучых доларах і 7,8% святла. Свеціцца пры гэтым не кожная такая акруга: у медыяннай ВУП на адзінку святла прыкладна як у звычайнай. Святло даюць некалькі гігантаў у Бакене і Пермскім басейне.

## Рост

З 2013 па 2019 год карэляцыя змены святла са зменай ВУП роўная 0,33, крыху вышэй, чым я чакаў. Потым я прыбраў гэтыя 124 акругі здабычы і яна ўпала да 0,12. Большая частка сігналу росту прыйшла з нафтавых радовішчаў, дзе бум азначае адначасова больш факелаў і больш грошай. У звычайнай акрузе святло расло або падала ў асноўным само па сабе, прынамсі ў гэтым маштабе.

Прасцейшая праверка кажа тое самае. Ці расла акруга хутчэй за медыянную па святле і па ВУП, супала ў 54% акруг: манетка з невялікім перакосам. З году ў год яшчэ горш. Па кожнай пары суседніх гадоў карэляцыя трымаецца паміж −0,02 і 0,15.

Складанне акруг у штаты мне не дапамагло. Па 49 штатах карэляцыя росту 0,10, а ўзроўні па-ранейшаму даюць 0,81. Я чакаў, што на ўзроўні штата шум згладзіцца, але гэтага не здарылася.

## Дзе я памыліўся наконт шэрагу

Потым я склаў святло па ўсёй краіне. Яно падала 3 гады, пакуль ВУП рос.

<figure class="fig">
<svg viewBox="0 0 680 320" role="img" aria-label="Лінейны графік, індэкс, 2013 год роўны 100, гады з 2013 па 2021. Рэальны ВУП 3080 адзінак акруг раўнамерна расце да 115,2 у 2019 годзе, асядае да 112,0 у 2020 і даходзіць да 118,5 у 2021. Сумарнае начное святло падае са 100 да 90,5 у 2016 годзе, скача да 98,1 у 2017, даходзіць да 101,5 у 2019, падае да 97,2 у 2020 і вяртаецца да 101,2 у 2021. Святло без акруг здабычы падае гэтак жа глыбока, да 90,6 у 2016 годзе, а потым ідзе ніжэй: 97,5 у 2019 і 95,9 у 2020.">
  <line x1="60" y1="208.5" x2="640" y2="208.5" class="f-plain"/>
  <text x="54" y="212.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="60" y1="153.5" x2="640" y2="153.5" class="f-plain"/>
  <text x="54" y="157.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="98.5" x2="640" y2="98.5" class="f-plain"/>
  <text x="54" y="102.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <line x1="60" y1="43.5" x2="640" y2="43.5" class="f-plain"/>
  <text x="54" y="47.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="60.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2013</text>
  <text x="132.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2014</text>
  <text x="205.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2015</text>
  <text x="277.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="350.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="422.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="495.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="567.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="640.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <path d="M60.0,153.5L132.5,140.3L205.0,124.9L277.5,115.0L350.0,101.8L422.5,84.8L495.0,69.9L567.5,87.5L640.0,51.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <path d="M60.0,153.5L132.5,166.1L205.0,186.5L277.5,205.2L350.0,167.3L422.5,170.5L495.0,167.3L567.5,176.0L640.0,149.6" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <path d="M60.0,153.5L132.5,162.3L205.0,182.1L277.5,205.8L350.0,164.0L422.5,156.8L495.0,145.3L567.5,168.9L640.0,146.9" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="153.5" r="3" class="f-accent"/>
  <circle cx="132.5" cy="162.3" r="3" class="f-accent"/>
  <circle cx="205.0" cy="182.1" r="3" class="f-accent"/>
  <circle cx="277.5" cy="205.8" r="3" class="f-accent"/>
  <circle cx="350.0" cy="164.0" r="3" class="f-accent"/>
  <circle cx="422.5" cy="156.8" r="3" class="f-accent"/>
  <circle cx="495.0" cy="145.3" r="3" class="f-accent"/>
  <circle cx="567.5" cy="168.9" r="3" class="f-accent"/>
  <circle cx="640.0" cy="146.9" r="3" class="f-accent"/>
  <text x="283.5" y="221.8" class="f-mono f-ink" style="font-size:11px">90,5</text>
  <text x="636.0" y="43.8" text-anchor="end" class="f-mono f-ink" style="font-size:11px">118,5</text>
  <line x1="60" y1="274" x2="82" y2="274" style="stroke:var(--ink);stroke-width:2"/>
  <text x="90" y="278" class="f-label f-muted">ВУП</text>
  <line x1="60" y1="292" x2="82" y2="292" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="90" y="296" class="f-label f-muted">святло, усе акругі</text>
  <line x1="60" y1="310" x2="82" y2="310" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="90" y="314" class="f-label f-muted">святло без акруг здабычы</text>
</svg>
<figcaption>Сумы па тых жа 3080 адзінках, індэкс 2013 = 100. Акругі здабычы гэта тыя, дзе здабыча ў 2019 годзе давала больш за 30% ВУП.</figcaption>
</figure>

З 2013 па 2016 год сума ўпала на 9,5%, а ВУП вырас на 7%. У 2017 годзе яна скачком амаль вярнулася. За адзін год пасвятлелі 95,6% акруг, медыянная акруга на 19%.

Першым тлумачэннем была нафта. Цэны абваліліся з сярэдзіны 2014 да пачатку 2016 года і 4 найбуйнейшыя акругі Бакена страцілі з 2014 па 2016 год каля 38% святла. Усё добра сыходзілася, таму я праверыў. Высветлілася, што не. Акругі здабычы тлумачаць менш за 5% падзення па краіне да 2016 года. Пункцір без іх падае гэтак жа глыбока. З 2013 па 2016 год святло ўпала ў 45 штатах з 49. Сярод іх Вермонт і Мэрыленд, дзе нафты няма зусім. Я не ведаю, чым гэта выклікана. Гэта можа быць апрацоўка кампазітаў або сам датчык. Сумняваюся, што якая-небудзь эканоміка за адзін год робіць святлейшымі 95,6% акруг.

Гэта змяніла і тое, як я чытаю 2020 год. Святло ўпала на 4,2%, ВУП на 2,8%, гэта значыць святло ўпала мацней за ВУП, насуперак майму чаканню. Але 63% гэтага падзення далі акругі здабычы, у асноўным нафтавыя радовішчы Тэхаса і Паўночнай Дакоты. Там святло, мусіць, упала разам з факеламі, калі ўпала цана нафты. Без іх святло ўпала на 1,7%, а ВУП на 2,8%. Для звычайных акруг гэта зноў маё чаканне. Медыянная акруга ў 2020 годзе нават пасвятлела на 1,9%, а Манхэтэн страціў 8% святла. Але той жа шэраг да 2016 года ўпаў на 9,5% наогул без рэцэсіі. Розніца ў адзін працэнтны пункт у ім мала што даказвае.

## Што мне гэта дае

Якая акруга вялікая, святло кажа даволі добра. Для росту яно ў асноўным спрацавала ў нафтавых акругах, дзе сам бум бачны як факелы. Для краіны без сумленнай статыстыкі ўзровень усё роўна лепш, чым нічога. Карэйскі здымак паказвае ўзроўні, а я даставаў яго ў спрэчках пра рост.

## Чаго я не правяраў

Свае лічбы з табліцамі артыкула Гібсана я не звяраў. BEA кожны год перагледжвае ВУП акруг, так што наступны выпуск зрушыць асобныя лічбы. Растр, які я складаў, захоўвае яркасць, акругленую да цэлых адзінак, таму пікселі слабейшыя за палову адзінкі ў ім нулявыя. Колькі святла так губляюць сельскія акругі, я не правяраў.

Газавыя факелы засталіся ў даных, хоць Горная школа Каларада публікуе асобны каталог факелаў. Папраўкі на насельніцтва і плошчу няма. Карэляцыі росту палічаны паміж акругамі, таму скачок, агульны для ўсіх акруг, іх не рухае. Іншыя адзінкі я таксама не спрабаваў. Гарады або ячэйкі па 10 км могуць паводзіць сябе інакш, чым акругі, межы якіх правялі задоўга да таго, як хтосьці пачаў мераць святло.

2022 года ў параўнанні няма: яго гадавы кампазіт і ВУП акруг яшчэ не апублікаваныя.
