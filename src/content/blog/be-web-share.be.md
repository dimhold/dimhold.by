---
title: "На кожную беларускую старонку ў Common Crawl прыпадае 400 рускіх"
description: "Беларуская гэта 0,017% Common Crawl: на кожную беларускую старонку прыпадае 399 рускіх і адкрытыя корпусы з гэтым згодныя. Толькі Вікіпедыя робіць з гэтага 1 да 6. Больш за чвэрць усяго беларускага тэксту ў вэбе ляжыць на 10 даменах, а на .by беларускіх старонак каля 2%."
date: 2026-10-08
lang: be
translationKey: be-web-share
tags: ["open-data", "text", "statistics"]
---
Кожны артыкул у гэтым блогу выходзіць на 3 мовах і адна з іх беларуская. Я ведаў, што беларускай у інтэрнэце мала, але ліку ў мяне не было, толькі адчуванне. Адзінае, што я мог назваць, гэта Вікіпедыя. На 8 кастрычніка 2026 года ў беларускай у 2 рэдакцыях 358692 артыкулы, у рускай 2121411. Адзін да шасці. Гучыць не так ужо і дрэнна.

Першы сапраўдны лік я атрымаў з Common Crawl. Ён быў 1 да 400. Пасля гэтага я запісаў, чаго чакаю ад усяго астатняга, яшчэ да падліку: Вікіпедыя каля 1 да 6, адкрытыя корпусы тэкстаў блізка да Common Crawl, на дамене .by менш за 10% беларускай і 2 розныя вызначальнікі мовы, якія сыходзяцца там у межах 10%. Апошняя здагадка не спраўдзілася.

## Дзе я лічыў

Common Crawl гэта адкрытая копія вэбу, з якой пачынаюць многія моўныя мадэлі і адкрытыя корпусы тэкстаў. З жніўня 2018 года ён пазначае кожную HTML старонку яе асноўнай мовай з дапамогай CLD2 і публікуе вынікі. Я ўзяў іх па ўсіх 77 краўлах па верасень 2026 года. Яшчэ я ўзяў памеры 3 вялікіх ачышчаных корпусаў з іх картак, такімі, якімі яны былі на 8 кастрычніка 2026 года. FineWeb-2 і MADLAD-400 сабраныя з Common Crawl, HPLT 2.0 у асноўным з Internet Archive.

У апошнім краўле, CC-MAIN-2026-39, 2171285702 старонкі. З іх 364316 беларускіх. Гэта 0,017%. W3Techs, які лічыць сайты, а не старонкі, піша, што беларускую выкарыстоўваюць менш за 0,1% усіх сайтаў, так што гэтая частка не навіна. На кожную беларускую старонку ў краўле прыпадае 399 рускіх і 2495 англійскіх. У корпусах рускай больш за беларускую ад 333 да 505 разоў. Гэта залежыць ад корпуса і ад таго, лічыць дакументы ці словы.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Гарызантальныя слупкі на лагарыфмічнай шкале, у колькі разоў рускай больш, чым беларускай, у кожнай крыніцы. Вікіпедыя, артыкулы: 5,9; Вікіпедыя, дамп артыкулаў: 13,5; Вікіпедыя, актыўныя ўдзельнікі: 27,6; MADLAD-400, дакументы: 368; Common Crawl 2026-39, старонкі: 399; HPLT 2.0, словы: 447; FineWeb-2, словы: 505. 3 слупкі Вікіпедыі ляжаць паміж 5 і 30, 4 слупкі вэбу паміж 360 і 510.">
  <text x="10" y="16" class="f-label f-muted">у колькі разоў рускай больш, чым беларускай, па крыніцах (лагарыфмічная шкала)</text>
  <line x1="250.0" y1="34" x2="250.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="250.0" y="266" text-anchor="middle" class="f-label f-muted">1</text>
  <line x1="366.7" y1="34" x2="366.7" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="366.7" y="266" text-anchor="middle" class="f-label f-muted">10</text>
  <line x1="483.3" y1="34" x2="483.3" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="483.3" y="266" text-anchor="middle" class="f-label f-muted">100</text>
  <line x1="600.0" y1="34" x2="600.0" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="600.0" y="266" text-anchor="middle" class="f-label f-muted">1000</text>
  <text x="242" y="55" text-anchor="end" class="f-label f-ink">Вікіпедыя, артыкулы</text>
  <rect x="250" y="43" width="90.0" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="346.0" y="55" class="f-label f-ink">5,9</text>
  <text x="242" y="85" text-anchor="end" class="f-label f-ink">Вікіпедыя, дамп артыкулаў</text>
  <rect x="250" y="73" width="131.8" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="387.8" y="85" class="f-label f-ink">13,5</text>
  <text x="242" y="115" text-anchor="end" class="f-label f-ink">Вікіпедыя, актыўныя ўдзельнікі</text>
  <rect x="250" y="103" width="168.1" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <text x="424.1" y="115" class="f-label f-ink">27,6</text>
  <text x="242" y="145" text-anchor="end" class="f-label f-ink">MADLAD-400, дакументы</text>
  <rect x="250" y="133" width="299.4" height="20" style="fill:var(--accent)"/>
  <text x="555.4" y="145" class="f-label f-accent">368</text>
  <text x="242" y="175" text-anchor="end" class="f-label f-ink">Common Crawl 2026-39, старонкі</text>
  <rect x="250" y="163" width="303.5" height="20" style="fill:var(--accent)"/>
  <text x="559.5" y="175" class="f-label f-accent">399</text>
  <text x="242" y="205" text-anchor="end" class="f-label f-ink">HPLT 2.0, словы</text>
  <rect x="250" y="193" width="309.2" height="20" style="fill:var(--accent)"/>
  <text x="565.2" y="205" class="f-label f-accent">447</text>
  <text x="242" y="235" text-anchor="end" class="f-label f-ink">FineWeb-2, словы</text>
  <rect x="250" y="223" width="315.3" height="20" style="fill:var(--accent)"/>
  <text x="571.3" y="235" class="f-label f-accent">505</text>
</svg>
<figcaption>Беларуская Вікіпедыя гэта абедзве рэдакцыі, be і be-tarask. Памеры корпусаў з іх картак, Вікіпедыя на 8 кастрычніка 2026 года.</figcaption>
</figure>

Так што Вікіпедыя выключэнне, прычым моцнае. Разрыў там 5,9 раза па артыкулах і 13,5 раза па памеры дампа артыкулаў. 2 беларускія Вікіпедыі разам нават большыя за літоўскую, 358692 артыкулы супраць 226895. У Common Crawl літоўскіх старонак у 10 разоў больш, чым беларускіх. У той жа дзень у 2 беларускіх рэдакцыях было 584 зарэгістраваныя ўдзельнікі, актыўныя за апошнія 30 дзён, у рускай 16120.

Маё адчуванне вырасла з адзінага месца, дзе мова выглядае амаль нармальна. Я ні разу не звярыў яго ні з чым іншым, хоць астатнія лікі заўсёды былі адкрытыя.

## Суадносіны за 8 гадоў

Я браў медыяну краўлаў кожнага года. Рускіх старонак на 1 беларускую было 713 у 2018 годзе, потым каля 400. З 2019 года гэты лік трымаецца паміж 359 і 412. Асобныя краўлы скачуць значна мацней, таму я веру толькі медыянам. Літоўская ўсе 8 гадоў трымалася паміж 9,6 і 10,8. Украінская апусцілася з 30 у 2018 годзе да значэнняў ад 19 да 26 з 2019 па 2023 год. Потым яна вырасла да 49 у гэтым годзе.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Лінейны графік на лагарыфмічнай шкале, гады з 2018 па 2026. руская: 2018 713, 2019 393, 2020 359, 2021 412, 2022 379, 2023 363, 2024 382, 2025 395, 2026 399; украінская: 2018 30, 2019 20, 2020 19, 2021 24, 2022 26, 2023 22, 2024 36, 2025 41, 2026 49; літоўская: 2018 11, 2019 10, 2020 10, 2021 10, 2022 10, 2023 10, 2024 10, 2025 11, 2026 11.">
  <text x="10" y="16" class="f-label f-muted">старонак Common Crawl на 1 беларускую, медыяна краўлаў кожнага года (лагарыфмічная шкала)</text>
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
  <text x="480" y="82.1" class="f-label f-ink">руская 399</text>
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
  <text x="480" y="169.5" class="f-label f-accent">украінская 48,7</text>
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
  <text x="480" y="232.4" class="f-label f-ink">літоўская 10,7</text>
</svg>
<figcaption>Асноўная мова старонкі паводле меткі CLD2 у Common Crawl, 77 краўлаў з жніўня 2018 па верасень 2026.</figcaption>
</figure>

З гэтых даных я не магу сказаць, ці вырас украінскі вэб, ці краўлер стаў часцей туды хадзіць. Common Crawl сам вырашае, што спампоўваць, і гэта мяняецца ад краўла да краўла. Беларуская ў любым выпадку следам не пайшла, яе медыянная доля была 0,0128% у 2018 годзе і ад 0,015% да 0,019% у кожным годзе пасля.

## Дзе жыве беларускі тэкст

У FineWeb-2 паводле яго ўласнага падліку 1,17 мільярда беларускіх слоў. Я разбіў тэкст па прабелах і атрымаў 965 мільёнаў слоў на 22588 даменах. Усе долі ніжэй лічацца ад гэтага падліку. Адзін сайт, Радыё Свабода, трымае 8,5% усяго. Далей ідуць сайт дзяржаўнай газеты zviazda.by, Вікіпедыя, кніжная бібліятэка knihi.com і cloudfront.net. Апошні мяне здзівіў. Я адкрыў некалькі яго старонак. Большая частка тэксту там гэта копіі артыкулаў Нашай Нівы з тымі ж нумарамі артыкулаў, што і на nashaniva.com. 10 самых вялікіх даменаў трымаюць 28,9% слоў, 100 самых вялікіх 59,5%.

Для параўнання я ўзяў 2 з 6 літоўскіх файлаў таго ж корпуса. У кожным каля 1,3 мільярда слоў, на трэць больш, чым ва ўсёй беларускай. Там 10 самых вялікіх даменаў трымаюць 13,7% і 12,8%, прыкладна палову беларускай долі.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Састаўныя гарызантальныя слупкі, доля тэксту ў 10 самых вялікіх даменаў, у наступных 90 і ў астатніх. беларуская, FineWeb-2, словы: 10 самых вялікіх даменаў 28,9%, 100 самых вялікіх 59,5%; беларуская, Common Crawl 2026-39, старонкі: 10 самых вялікіх даменаў 33,0%, 100 самых вялікіх 62,5%; літоўская, FineWeb-2, файл 1 з 6, словы: 10 самых вялікіх даменаў 13,7%, 100 самых вялікіх 32,3%; літоўская, FineWeb-2, файл 4 з 6, словы: 10 самых вялікіх даменаў 12,8%, 100 самых вялікіх 30,9%.">
  <text x="10" y="16" class="f-label f-muted">доля ўсяго тэксту ў самых вялікіх даменаў</text>
  <rect x="10" y="28" width="14" height="10" style="fill:var(--accent)"/><text x="30" y="37" class="f-label f-ink">10 самых вялікіх</text>
  <rect x="180" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="200" y="37" class="f-label f-ink">наступныя 90</text>
  <rect x="350" y="28" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="370" y="37" class="f-label f-ink">астатнія</text>
  <text x="10" y="66" class="f-label f-ink">беларуская, FineWeb-2, словы</text>
  <rect x="10" y="72" width="179.2" height="20" style="fill:var(--accent)"/>
  <rect x="189.2" y="72" width="189.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="378.8" y="72" width="251.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="185.2" y="86" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">28,9%</text>
  <text x="374.8" y="86" text-anchor="end" class="f-label f-ink">59,5%</text>
  <text x="10" y="116" class="f-label f-ink">беларуская, Common Crawl 2026-39, старонкі</text>
  <rect x="10" y="122" width="204.8" height="20" style="fill:var(--accent)"/>
  <rect x="214.8" y="122" width="182.9" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="397.7" y="122" width="232.3" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="210.8" y="136" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">33,0%</text>
  <text x="393.7" y="136" text-anchor="end" class="f-label f-ink">62,5%</text>
  <text x="10" y="166" class="f-label f-ink">літоўская, FineWeb-2, файл 1 з 6, словы</text>
  <rect x="10" y="172" width="84.9" height="20" style="fill:var(--accent)"/>
  <rect x="94.9" y="172" width="115.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="210.4" y="172" width="419.6" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="90.9" y="186" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">13,7%</text>
  <text x="206.4" y="186" text-anchor="end" class="f-label f-ink">32,3%</text>
  <text x="10" y="216" class="f-label f-ink">літоўская, FineWeb-2, файл 4 з 6, словы</text>
  <rect x="10" y="222" width="79.2" height="20" style="fill:var(--accent)"/>
  <rect x="89.2" y="222" width="112.5" height="20" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="201.8" y="222" width="428.2" height="20" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="85.2" y="236" text-anchor="end" class="f-label" style="fill:var(--surface, #fff)">12,8%</text>
  <text x="197.8" y="236" text-anchor="end" class="f-label f-ink">30,9%</text>
</svg>
<figcaption>Дамены па рэгістрацыі, таму ўсе моўныя раздзелы Вікіпедыі ідуць пад wikipedia.org. У беларускім FineWeb-2 965 мільёнаў слоў, у кожным літоўскім файле каля 1,3 мільярда.</figcaption>
</figure>

У бягучым краўле карціна тая самая. Яго 364316 беларускіх старонак ляжаць на 6394 даменах. У 10 самых вялікіх з іх 33%. Адна Вікіпедыя гэта 9,9%. На .by толькі 39% беларускіх старонак, астатнія ў асноўным на .org і .com.

## Праверка на .by

З другога боку я ўзяў усе HTML старонкі на .by з верасеньскага краўла. Спачатку я паспрабаваў пастаронкавы API індэкса. Ён адказваў 504 і 400 і аддаваў прыкладна 1 блок у 3000 запісаў за хвіліну, так што я ад яго адмовіўся. Калонкавы індэкс Common Crawl аддаў усе 4843281 старонку на 34107 даменах за некалькі секунд. Потым сервер даных пачаў адказваць мне 403 і я чакаў, пакуль ён зноў мяне пусціць.

CLD2 кажа, што беларускіх старонак на .by толькі 2,7%, рускіх 86,6%. Толькі ў 208 даменаў большасць старонак беларускія, гэта 0,6% ад усіх. W3Techs дае 0,9% сайтаў на .by.

Давяраць аднаму вызначальніку, калі 2 мовы такія блізкія, я не хацеў. Таму я выпадкова выбраў 500 старонак .by з меткай беларускай мовы і 1000 з меткай рускай і спампаваў іх. Потым прагнаў 2 іншыя праверкі. Першая fastText lid.176, другая просты падлік літар, якія ёсць толькі ў беларускай (ў, і), супраць літар, якія ёсць толькі ў рускай (и, щ, ъ).

На 489 беларускіх старонках з дастатковай колькасцю тэксту fastText згодны ў 85,5% выпадкаў, абедзве праверкі адначасова ў 79,8%. Але больш за трэць астатніх гэта артыкулы skarnik.by, беларуска-рускага слоўніка. Такі артыкул паводле свайго ўладкавання напалову на адной мове і напалову на другой. На 985 рускіх старонках абедзве праверкі разам не знайшлі ніводнай беларускай. Сам fastText пазначыў 1 такую старонку. Значыць, на гэтай выбарцы CLD2 лічыць беларускую крыху зашчодра. Папраўленая доля на .by ад 2,1% да 2,3%. Гэта да 20% менш, чым у CLD2, то бок разыходжанне да 2 разоў большае за тое, якога я чакаў.

## Чаго я не правяраў

Common Crawl амаль не бачыць каналаў Telegram і зусім не бачыць таго, што за лагінам. Усё, што напісана па-беларуску там, у гэтыя лікі не трапіла.

Я не раздзяляў 2 правапісы беларускай, афіцыйны і тарашкевіцу. У CLD2 для іх адна метка, а ў Вікіпедыі я склаў іх разам. Беларускую лацінкай я не шукаў зусім. Старонкі, якія CLD2 пазначыў англійскімі або пакінуў без меткі, я ў выбарку не браў.

1 да 400 гэта падлік старонак і слоў. Колькі людзей чытае па-беларуску ў інтэрнэце, гэта іншае пытанне. Тут я і не спрабаваў на яго адказаць.
