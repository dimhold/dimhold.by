---
title: "Компании копируют раздел о рисках. Только 15% текста 2026 года стояло там ещё в 2016"
description: "Я вырезал раздел Risk Factors из 10-K 500 случайных американских компаний за 11 лет. Из года в год 75% раздела копируется дословно, но в тексте 2026 года только 15% стояло там ещё в 2016. COVID до сих пор есть в 37% разделов, LIBOR в 1%."
date: 2026-10-08
lang: ru
translationKey: risk-copypaste
tags: ["open-data", "text", "statistics"]
---
В каждом 10-K есть раздел Item 1A, Risk Factors. В нём перечислено всё, что может навредить компании. Обычно про него говорят, что его пишут один раз, а дальше каждый год копируют с новой датой. Я сам это повторял и ни разу не проверял.

В статье про Бенфорда я смотрел только на числа из 10-K. Текст на EDGAR тоже лежит бесплатно. До счёта я записал свою догадку: не меньше 80% раздела дословно копируется из прошлого года. И примерно четверть текста 2026 года стоит там ещё с 2016.

## Как мерил

Я взял квартальные индексы EDGAR с 2016 года по 8 октября 2026. Из них оставил компании, которые подавали 10-K, без поправок, в каждом из 11 лет. Это 2930 из 13168 компаний, подававших его хоть раз. Отсюда я случайно выбрал 500, скачал основной документ каждого 10-K и вырезал Item 1A. Год здесь это год подачи, так что отчёт 2026 года описывает 2025.

Дольше всего пришлось возиться с вырезанием. Заголовки бывают разорваны тегом посреди слова: "RIS K FACTORS" или "I TEM 1A". Регулярные выражения я переписывал дважды и после каждой правки заново скачивал отчёты с короткими разделами. В итоге из 5500 отчётов 4752 дали раздел не короче 500 слов. Всё написано на Python 3.12, только стандартная библиотека.

Единица счёта это предложение, в нижнем регистре, предложения короче 5 слов выброшены. Доля скопированного в году это доля его слов в предложениях, которые слово в слово были в разделе прошлого года.

## 75%, но целиком почти никто не копирует

По 4300 парам соседних лет медианная доля скопированного 75,0%. Мои 80% оказались немного завышены, но направление верное. Удивил меня другой конец распределения. Только у 8,9% пар скопировано 90% и больше и только у 0,4% от 99%.

Тут моя мера оказалась слишком строгой. У Universal Health Realty Income Trust вот это предложение стоит во всех 11 отчётах, включая поданный 25 февраля 2026:

> Beginning in Federal Fiscal Year (FFY) 2015, hospitals that rank in the worst 25% of all hospitals nationally for hospital acquired conditions in the previous year will receive reduced Medicare reimbursements.

Следующее за ним предложение тоже простояло все 11 лет. Но в 2019 "The ACA also prohibits" превратилось в "The Legislation also prohibits". При точном сравнении с этого года оно считается новым. Я посчитал почти дословные копии для последней пары лет. Из 47259 новых предложений в отчётах 2026 года 21,2% это предложение 2025 года, в котором поменяли не больше 2 слов. По всем парам и по цепочкам из 8 слов вместо целых предложений доля скопированного 84,6%.

<figure class="fig">
<svg viewBox="0 0 640 260" role="img" aria-label="Сверху предложение из раздела Risk Factors компании Universal Health Realty Income Trust в отчётах 2018 и 2019 годов, разница только в замене &quot;ACA&quot; на &quot;Legislation&quot;. При точном совпадении оно считается новым. Снизу: из 47259 предложений отчётов 2026 года, которых дословно не было в отчёте 2025 года, 21,2% это предложение 2025 года с правкой не больше 2 слов.">
  <text x="10" y="16" class="f-label f-muted">одно предложение при точном совпадении и при правке до 2 слов</text>
  <text x="10" y="50" class="f-label f-muted">2018</text>
  <rect x="80.2" y="37" width="29.4" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="50" class="f-mono f-ink">The</text>
  <text x="83.2" y="50" class="f-mono f-accent">ACA</text>
  <text x="114.4" y="50" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="10" y="80" class="f-label f-muted">2019</text>
  <rect x="80.2" y="67" width="91.8" height="18" style="fill:var(--accent)" opacity="0.18"/>
  <text x="52" y="80" class="f-mono f-ink">The</text>
  <text x="83.2" y="80" class="f-mono f-accent">Legislation</text>
  <text x="176.8" y="80" class="f-mono f-ink">also prohibits the use of federal funds …</text>
  <text x="52" y="122" class="f-label f-ink">✗ точное совпадение: новое предложение</text>
  <text x="52" y="142" class="f-label f-accent">✓ правка до 2 слов: то же предложение</text>
  <text x="52" y="188" class="f-label f-muted">новые предложения в отчётах 2026 года, 47259</text>
  <rect x="52" y="200" width="118.5" height="30" style="fill:var(--accent)"/>
  <rect x="170.5" y="200" width="439.5" height="30" class="f-ink" style="fill:currentColor" opacity="0.12"/>
  <text x="52" y="248" class="f-label f-accent">21,2% прошлогоднее с правкой 1 или 2 слов</text>
  <text x="610" y="248" text-anchor="end" class="f-label f-muted">78,8% остальные</text>
</svg>
<figcaption>Расстояние правки по словам не больше 2 до любого предложения раздела той же компании за 2025 год, 441 компания.</figcaption>
</figure>

## Что осталось от 2016

Со второй догадкой я промахнулся сильнее. Я взял 417 компаний, у которых раздел есть во всех 11 отчётах. В их тексте 2026 года медианная доля того, что дословно стояло в 2016, 15,4%, а не 25%. По цепочкам из 8 слов 28,6%. Текст 2016 года теряет почти четверть слов в первый же год, а дальше убывает медленнее. К 2026 году от него остаётся 21,9%. В тексте 2026 года это меньшая доля, 15,4%, потому что раздел вырос примерно на треть.

Каждый год медианная компания удаляет от 19% до 26% прошлогоднего текста и добавляет чуть больше. Медианная длина у тех же 417 компаний была 7933 слова в 2016 и 11185 в 2026. Длиннее раздел стал у 84,9% из них.

<figure class="fig">
<svg viewBox="0 0 640 340" role="img" aria-label="Составные столбцы по годам подачи с 2016 по 2026, каждый столбец это раздел Risk Factors тех же 417 компаний, разложенный по году, с которого предложение стоит без перерыва. Часть, которая стоит каждый год с 2016, сокращается со 100% в 2016 до 71% в 2017, 30% в 2021 и 17% в 2026. Новое в своём году: 29% в 2017, 33% в 2021 и 27% в 2026. Медиана длины растёт с 7933 слов до 11185.">
  <text x="10" y="16" class="f-label f-muted">откуда слова раздела каждого года, среднее по 417 компаниям</text>
  <rect x="104" y="30" width="14" height="10" style="fill:var(--accent)"/><text x="124" y="39" class="f-label f-ink">стоит каждый год с 2016</text>
  <rect x="104" y="44" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.35"/><text x="124" y="53" class="f-label f-ink">добавлено позже и осталось</text>
  <rect x="104" y="58" width="14" height="10" class="f-ink" style="fill:currentColor" opacity="0.1"/><text x="124" y="67" class="f-label f-ink">новое в этом году</text>
  <text x="98" y="294" text-anchor="end" class="f-label f-muted">0%</text>
  <text x="98" y="194" text-anchor="end" class="f-label f-muted">50%</text>
  <text x="98" y="94" text-anchor="end" class="f-label f-muted">100%</text>
  <rect x="108.0" y="90.0" width="39.8" height="200.0" style="fill:var(--accent)"/>
  <text x="127.9" y="306" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="127.9" y="322" text-anchor="middle" class="f-label f-muted">7933</text>
  <rect x="155.8" y="147.1" width="39.8" height="142.9" style="fill:var(--accent)"/>
  <rect x="155.8" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="175.7" y="143.1" text-anchor="middle" class="f-label f-ink">71%</text>
  <text x="175.7" y="306" text-anchor="middle" class="f-label f-muted">2017</text>
  <text x="175.7" y="322" text-anchor="middle" class="f-label f-muted">8293</text>
  <rect x="203.6" y="176.7" width="39.8" height="113.3" style="fill:var(--accent)"/>
  <rect x="203.6" y="147.5" width="39.8" height="29.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="203.6" y="90.0" width="39.8" height="57.5" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="223.5" y="172.7" text-anchor="middle" class="f-label f-ink">57%</text>
  <text x="223.5" y="306" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="223.5" y="322" text-anchor="middle" class="f-label f-muted">8497</text>
  <rect x="251.5" y="197.0" width="39.8" height="93.0" style="fill:var(--accent)"/>
  <rect x="251.5" y="147.1" width="39.8" height="49.9" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="251.5" y="90.0" width="39.8" height="57.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="271.4" y="193.0" text-anchor="middle" class="f-label f-ink">46%</text>
  <text x="271.4" y="306" text-anchor="middle" class="f-label f-muted">2019</text>
  <text x="271.4" y="322" text-anchor="middle" class="f-label f-muted">8881</text>
  <rect x="299.3" y="213.5" width="39.8" height="76.5" style="fill:var(--accent)"/>
  <rect x="299.3" y="149.4" width="39.8" height="64.1" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="299.3" y="90.0" width="39.8" height="59.4" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="319.2" y="209.5" text-anchor="middle" class="f-label f-ink">38%</text>
  <text x="319.2" y="306" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="319.2" y="322" text-anchor="middle" class="f-label f-muted">9314</text>
  <rect x="347.1" y="229.3" width="39.8" height="60.7" style="fill:var(--accent)"/>
  <rect x="347.1" y="156.8" width="39.8" height="72.4" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="347.1" y="90.0" width="39.8" height="66.8" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="367.0" y="225.3" text-anchor="middle" class="f-label f-ink">30%</text>
  <text x="367.0" y="306" text-anchor="middle" class="f-label f-muted">2021</text>
  <text x="367.0" y="322" text-anchor="middle" class="f-label f-muted">10040</text>
  <rect x="394.9" y="236.0" width="39.8" height="54.0" style="fill:var(--accent)"/>
  <rect x="394.9" y="146.0" width="39.8" height="90.0" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="394.9" y="90.0" width="39.8" height="56.0" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="414.8" y="232.0" text-anchor="middle" class="f-label f-ink">27%</text>
  <text x="414.8" y="306" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="414.8" y="322" text-anchor="middle" class="f-label f-muted">10324</text>
  <rect x="442.7" y="241.4" width="39.8" height="48.6" style="fill:var(--accent)"/>
  <rect x="442.7" y="144.2" width="39.8" height="97.2" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="442.7" y="90.0" width="39.8" height="54.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="462.6" y="237.4" text-anchor="middle" class="f-label f-ink">24%</text>
  <text x="462.6" y="306" text-anchor="middle" class="f-label f-muted">2023</text>
  <text x="462.6" y="322" text-anchor="middle" class="f-label f-muted">10455</text>
  <rect x="490.5" y="245.8" width="39.8" height="44.2" style="fill:var(--accent)"/>
  <rect x="490.5" y="142.2" width="39.8" height="103.6" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="490.5" y="90.0" width="39.8" height="52.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="510.5" y="241.8" text-anchor="middle" class="f-label f-ink">22%</text>
  <text x="510.5" y="306" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="510.5" y="322" text-anchor="middle" class="f-label f-muted">10701</text>
  <rect x="538.4" y="250.5" width="39.8" height="39.5" style="fill:var(--accent)"/>
  <rect x="538.4" y="139.2" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="538.4" y="90.0" width="39.8" height="49.2" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="558.3" y="246.5" text-anchor="middle" class="f-label f-ink">20%</text>
  <text x="558.3" y="306" text-anchor="middle" class="f-label f-muted">2025</text>
  <text x="558.3" y="322" text-anchor="middle" class="f-label f-muted">10760</text>
  <rect x="586.2" y="255.3" width="39.8" height="34.7" style="fill:var(--accent)"/>
  <rect x="586.2" y="144.1" width="39.8" height="111.3" class="f-ink" style="fill:currentColor" opacity="0.35"/>
  <rect x="586.2" y="90.0" width="39.8" height="54.1" class="f-ink" style="fill:currentColor" opacity="0.1"/>
  <text x="606.1" y="251.3" text-anchor="middle" class="f-label f-ink">17%</text>
  <text x="606.1" y="306" text-anchor="middle" class="f-label f-muted">2026</text>
  <text x="606.1" y="322" text-anchor="middle" class="f-label f-muted">11185</text>
  <text x="98" y="322" text-anchor="end" class="f-label f-muted">медиана слов</text>
</svg>
<figcaption>Доля слов, среднее по компаниям. Предложение относится к году, с которого оно без перерыва стоит в каждом отчёте; одна правка делает его снова новым. Год это год подачи.</figcaption>
</figure>

На рисунке счёт немного другой. Предложение сохраняет свой год, только пока стоит в каждом отчёте без перерыва, а доли там средние. Поэтому столбец 2026 года показывает 17%.

Меньше всего копируют в 2021 году, 69,2%. Эти отчёты описывают 2020, первый год пандемии. И это первые отчёты после того, как SEC 9 ноября 2020 изменила Item 105 Regulation S-K. Новая редакция велит ставить общие риски, если они есть, в конец, под заголовок "General Risk Factors". Отдельной строкой этот заголовок стоит в 19,5% всех разделов 2021 года против 0,2% годом раньше. Моя мера не смотрит на порядок предложений, так что перенесённый текст всё равно считается копией. Но в 2021 медианная компания удалила 25,9% прошлогоднего текста, больше, чем в любой другой год. Медианная длина при этом всё равно выросла с 9314 слов до 10040.

## Слова с датой

Чтобы проверить, что в разделе живёт вечно, я посчитал несколько слов, к которым привязана дата.

<figure class="fig">
<svg viewBox="0 0 640 300" role="img" aria-label="Линейный график доли компаний, у которых в разделе Risk Factors есть слово, по годам подачи с 2016 по 2026. COVID: 2016 0,0%, 2020 52,3%, 2021 98,8%, 2023 90,6%, 2024 66,9%, 2026 37,1%; LIBOR: 2016 4,0%, 2020 39,3%, 2021 36,9%, 2023 26,1%, 2024 6,6%, 2026 1,4%; artificial intelligence: 2016 0,0%, 2020 3,0%, 2021 3,7%, 2023 8,5%, 2024 32,0%, 2026 64,9%; tariff: 2016 27,0%, 2020 52,3%, 2021 52,0%, 2023 51,8%, 2024 52,5%, 2026 83,3%.">
  <text x="10" y="16" class="f-label f-muted">доля компаний, у которых в разделе есть слово</text>
  <line x1="50" y1="250" x2="420" y2="250" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="254" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="50" y1="200" x2="420" y2="200" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="204" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="50" y1="150" x2="420" y2="150" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="154" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="50" y1="100" x2="420" y2="100" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="104" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="50" y1="50" x2="420" y2="50" class="f-line" stroke-dasharray="2 4" opacity="0.5"/>
  <text x="44" y="54" text-anchor="end" class="f-label f-muted">100%</text>
  <text x="50" y="268" text-anchor="middle" class="f-label f-muted">2016</text>
  <text x="124" y="268" text-anchor="middle" class="f-label f-muted">2018</text>
  <text x="198" y="268" text-anchor="middle" class="f-label f-muted">2020</text>
  <text x="272" y="268" text-anchor="middle" class="f-label f-muted">2022</text>
  <text x="346" y="268" text-anchor="middle" class="f-label f-muted">2024</text>
  <text x="420" y="268" text-anchor="middle" class="f-label f-muted">2026</text>
  <path d="M50.0,250.0 L87.0,250.0 L124.0,250.0 L161.0,250.0 L198.0,145.3 L235.0,52.3 L272.0,53.2 L309.0,68.8 L346.0,116.2 L383.0,150.7 L420.0,175.8" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
  <text x="428" y="179.8" class="f-label f-accent">COVID 37%</text>
  <path d="M50.0,242.0 L87.0,241.6 L124.0,235.9 L161.0,200.9 L198.0,171.5 L235.0,176.2 L272.0,178.6 L309.0,197.7 L346.0,236.8 L383.0,245.5 L420.0,247.3" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2"/>
  <text x="428" y="251.3" class="f-label f-ink">LIBOR 1%</text>
  <path d="M50.0,250.0 L87.0,249.1 L124.0,246.7 L161.0,244.8 L198.0,243.9 L235.0,242.6 L272.0,240.3 L309.0,233.0 L346.0,186.1 L383.0,145.2 L420.0,120.1" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:2" stroke-dasharray="6 4"/>
  <text x="428" y="124.1" class="f-label f-ink">artificial intelligence 65%</text>
  <path d="M50.0,196.0 L87.0,184.9 L124.0,181.3 L161.0,154.7 L198.0,145.3 L235.0,146.1 L272.0,146.3 L309.0,146.3 L346.0,145.0 L383.0,104.9 L420.0,83.5" class="f-ink" style="fill:none;stroke:currentColor;stroke-width:1.5" opacity="0.5" stroke-dasharray="2 3"/>
  <text x="428" y="87.5" class="f-label f-ink">tariff 83%</text>
  <circle cx="235.0" cy="52.3" r="3.5" style="fill:var(--accent)"/>
  <text x="235.0" y="44.3" text-anchor="middle" class="f-label f-accent">99%</text>
  <circle cx="198.0" cy="171.5" r="3.5" class="f-ink" style="fill:currentColor"/>
  <text x="198.0" y="163.5" text-anchor="middle" class="f-label f-ink">39%</text>
</svg>
<figcaption>Из компаний с разделом от 500 слов в этом году, от 424 до 442 в год. Упоминание это любое вхождение слова, в том числе в истории или в примере.</figcaption>
</figure>

COVID есть в 98,8% разделов из отчётов, поданных в 2021, а в 2026 в 37,1%. Из 426 компаний, упомянувших его в 2021, 160 упоминают до сих пор. Я вручную прочитал 40 случайных предложений 2026 года с ним. В 20 о нём говорят как о прошлом, в 11 только пример ("such as COVID-19"), в 9 его до сих пор считают живым риском. Из всех 325 таких предложений 2026 года 52 дословно стояли в отчёте 2022 года. Ceres Orion это фьючерсный фонд, раньше он назывался Orion Futures Fund. Эту строку он вписал в 10-K, поданный 30 марта 2020. В отчёте от 20 марта 2026 она стоит на месте:

> The continuing spread of a new strain of coronavirus, which causes the viral disease known as COVID-19, may adversely affect our investments and operations.

С LIBOR вышло иначе. Последние панельные ставки долларового LIBOR опубликовали 30 июня 2023. Из 159 компаний, упоминавших LIBOR в 2021, в 2026 его упоминают только 5. Моя догадка в том, что важна жёсткая дата. У LIBOR она была. Пандемия разделу рисков ничего похожего не даёт. Новые слова при этом появляются быстро. Доля "artificial intelligence" выросла с 3,7% в 2021 до 64,9% в 2026, пошлины (tariff) с 52,5% в 2024 до 83,3%.

На уровне целого предложения компании копируют в основном сами себя. У медианной компании только 2,1% текста 2026 года стоит в предложениях, которые есть ещё хотя бы у одной компании из 500. Самые частые из них это заголовки вроде "Risks related to our business".

## Чего я не проверял

Доходности акций я не трогал. Этим занималась статья "Lazy Prices" Лорен Коэн с соавторами (2020): компании, которые меняют этот текст, потом показывают более низкую доходность. Рост длины и "липкость" текста 10-K с 1996 по 2013 год уже показали Трэвис Дайер с соавторами (2017). Мои числа это повтор на свежих годах с одним вопросом: сколько живёт предложение.

Выборка состоит из выживших, то есть компаний, которые 11 лет подавали отчёт каждый год. Молодые компании, возможно, переписывают больше, их я не мерил. Обе меры сравнивают точный текст, поэтому перефразированное считается новым. Упоминание слова в разделе ещё не означает риска. И 40 прочитанных руками предложений это маленькая выборка. В 203 отчётах я не смог вырезать раздел вообще. Они не случайны: это отчёты с необычной вёрсткой, у некоторых вместо раздела таблица перекрёстных ссылок.
