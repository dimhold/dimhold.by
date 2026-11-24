---
title: "30 дней поправок дали столько же, сколько прогноз от ИИ, но только за счёт 2 аэропортов из 16"
description: "Я сравнил прогнозы температуры AIFS, IFS и GFS с термометрами 16 аэропортов с марта по июль 2025 года. На день вперёд AIFS точнее на 16%. Старая IFS за вычетом своей средней ошибки за 30 дней дала в среднем такой же выигрыш, но эту ничью сделали 2 аэропорта."
date: 2025-08-03
lang: ru
translationKey: ai-weather-vs-numeric
tags: ["open-data", "machine-learning", "numbers"]
---

GFS для аэропорта Дели на день вперёд ошибается в среднем на 4,0 градуса. Если просто повторить вчерашнюю температуру, ошибка там 1,9. На эту строку я наткнулся в таблице, которую собирал для другого. В ней прогнозы за 5 месяцев из бесплатного архива `open-meteo.com` стоят рядом со сводками 16 аэропортов.

Обычно я беру ту модель, которую погодный API отдаёт по умолчанию. С градусником я её ни разу не сверял. А теперь у привычной модели появилась соседка. 25 февраля ECMWF [перевёл в оперативную работу AIFS](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational), нейросеть, которая считает параллельно с физической моделью IFS и стартует из тех же начальных данных. В объявлении сказано, что по многим показателям она лучше, с выигрышем до 20%. API отдаёт обе, в запросе меняется одно слово. Мне стало интересно, чего это слово стоит для обычной температуры воздуха.

Вопрос не новый. [Бен Буаллег с коллегами](https://arxiv.org/abs/2307.10128) сравнивали модель Pangu с IFS в условиях, близких к оперативным, в том числе по станциям. [Бремнес с соавторами](https://arxiv.org/abs/2309.01247) делали это на норвежских станциях, с постобработкой и без неё. Мне хотелось посмотреть на AIFS в том виде, в каком её отдаёт бесплатный API.

## Что я сравнивал

Previous Runs API того же сервиса хранит, что модель говорила за 1, 2, 3, 4 и 5 дней до нужного часа. Я взял `ecmwf_ifs025`, `ecmwf_aifs025_single` (это AIFS Single v1) и американскую `gfs_global` с 1 марта по 31 июля и передал в запрос высоту аэропорта. За истину принял METAR из архива Iowa Environmental Mesonet, ближайшую сводку не дальше 15 минут от часа. Список аэропортов зафиксировал до прогона, от Минска и Хельсинки до Сингапура и Сиднея.

Шаг у AIFS 6 часов, поэтому в главной таблице только 00, 06, 12 и 18 UTC. Ошибка сначала усредняется по каждому аэропорту, потом по аэропортам. Интервалы 95-процентные, бутстрап по целым неделям. В планах была и GraphCast, но в архиве она есть для 69% часов на 1-й день и для 27% на 3-й, пришлось отказаться.

Перед прогоном я записал, чего жду: ничью на 1-й день, выигрыш AIFS от 5 до 10% на сроках от 3 до 5 дней и её проигрыш на дневном максимуме. Не сбылось ничего.

## AIFS против IFS

| срок, дней | IFS | AIFS | GFS | как N дней назад |
|---|---|---|---|---|
| 1 | 1,41 | 1,19 | 1,57 | 2,47 |
| 2 | 1,50 | 1,25 | 1,71 | 3,15 |
| 3 | 1,61 | 1,34 | 1,82 | 3,31 |
| 4 | 1,70 | 1,47 | 1,96 | 3,45 |
| 5 | 1,86 | 1,61 | 2,17 | 3,60 |

На 1-й день AIFS лучше на 0,22 (от 0,19 до 0,25), это 15,7%. Выигрывает она в 14 аэропортах из 16. На 3-й день выигрыш 16,7%, на 5-й 13,3%. На 5-й день AIFS ошибается так же, как IFS на 3-й. Но это всё средние. Если смотреть отдельные часы на 1-й день, AIFS ближе к термометру в 56% случаев, IFS в 39%, остальное ничьи.

<figure class="fig">
<svg viewBox="0 0 680 296" role="img" aria-label="Средняя абсолютная ошибка температуры в 16 аэропортах по срокам от 1 до 5 дней, март-июль 2025 года, градусы. AIFS: 1,19; 1,25; 1,34; 1,47; 1,61. IFS: 1,41; 1,50; 1,61; 1,70; 1,86. GFS: 1,57; 1,71; 1,82; 1,96; 2,17. Повтор наблюдения N дней назад: 2,47; 3,15; 3,31; 3,45; 3,60.">
  <line x1="50" y1="250.0" x2="470" y2="250.0" class="f-plain"/>
  <text x="42.0" y="254.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">0</text>
  <line x1="50" y1="196.0" x2="470" y2="196.0" class="f-plain"/>
  <text x="42.0" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="50" y1="142.0" x2="470" y2="142.0" class="f-plain"/>
  <text x="42.0" y="146.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="50" y1="88.0" x2="470" y2="88.0" class="f-plain"/>
  <text x="42.0" y="92.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="50" y1="34.0" x2="470" y2="34.0" class="f-plain"/>
  <text x="42.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="70.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <text x="170.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <text x="270.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <text x="370.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="470.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">5</text>
  <polyline points="70.0,116.4 170.0,80.2 270.0,71.0 370.0,63.6 470.0,55.8" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:2 4"/>
  <circle cx="70.0" cy="116.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="80.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="71.0" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="63.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="55.8" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,165.3 170.0,157.5 270.0,151.9 370.0,144.2 470.0,133.0" style="fill:none;stroke:var(--muted);stroke-width:2;"/>
  <circle cx="70.0" cy="165.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="170.0" cy="157.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="270.0" cy="151.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="370.0" cy="144.2" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="470.0" cy="133.0" r="3" style="fill:var(--muted);stroke:none"/>
  <polyline points="70.0,174.1 170.0,169.1 270.0,163.3 370.0,158.4 470.0,149.5" style="fill:none;stroke:var(--ink);stroke-width:2;"/>
  <circle cx="70.0" cy="174.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.0" cy="169.1" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="270.0" cy="163.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="370.0" cy="158.4" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="470.0" cy="149.5" r="3" style="fill:var(--ink);stroke:none"/>
  <polyline points="70.0,186.0 170.0,182.3 270.0,177.8 370.0,170.9 470.0,162.9" style="fill:none;stroke:var(--accent);stroke-width:2;"/>
  <circle cx="70.0" cy="186.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="170.0" cy="182.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="270.0" cy="177.8" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="370.0" cy="170.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="470.0" cy="162.9" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="482.0" y="59.8" text-anchor="start" class="f-mono f-muted" style="font-size:12px">3,60 как N дней назад</text>
  <text x="482.0" y="133.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2,17 GFS</text>
  <text x="482.0" y="153.5" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,86 IFS</text>
  <text x="482.0" y="171.9" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,61 AIFS</text>
  <line x1="270.0" y1="163.3" x2="470.0" y2="162.9" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="10.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">средняя абсолютная ошибка, °C</text>
  <text x="470.0" y="286.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">срок, дней</text>
</svg>
<figcaption>На 5-й день AIFS ошибается так же, как IFS на 3-й. Все прогнозы сверены с термометрами аэропортов в 00, 06, 12, 18 часов UTC.</figcaption>
</figure>

Проигрывает AIFS в Лондоне и Йоханнесбурге. В Йоханнесбурге вчерашняя температура предсказывала не хуже неё, 1,99 против 2,02. В Минске у AIFS 1,00, у IFS 1,19.

<figure class="fig">
<svg viewBox="0 0 680 410" role="img" aria-label="Прогноз на день вперёд, средняя абсолютная ошибка по аэропортам. IFS, AIFS, GFS: Дели 1,84; 1,23; 4,02, Чикаго 1,61; 1,16; 1,53, Сингапур 1,51; 1,07; 1,21, Хельсинки 1,23; 0,89; 1,46, Денвер 1,73; 1,40; 1,85, Мадрид 1,22; 0,90; 1,47, Токио 1,40; 1,10; 0,95, Берлин 1,26; 0,96; 1,46, Сидней 1,85; 1,61; 1,03, Минск 1,19; 1,00; 1,58, Сан-Паулу 1,20; 1,06; 1,27, Варшава 1,16; 1,05; 1,33, Найроби 1,18; 1,07; 1,36, Торонто 1,49; 1,40; 1,69, Лондон 0,98; 1,08; 1,24, Йоханнесбург 1,65; 2,02; 1,67.">
  <line x1="170.0" y1="40" x2="170.0" y2="366" class="f-plain"/>
  <text x="170.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">1</text>
  <line x1="320.0" y1="40" x2="320.0" y2="366" class="f-plain"/>
  <text x="320.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">2</text>
  <line x1="470.0" y1="40" x2="470.0" y2="366" class="f-plain"/>
  <text x="470.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">3</text>
  <line x1="620.0" y1="40" x2="620.0" y2="366" class="f-plain"/>
  <text x="620.0" y="382.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">4</text>
  <text x="126.0" y="60.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Дели</text>
  <line x1="296.0" y1="56" x2="205.1" y2="56" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="622.6" cy="56" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="296.0" cy="56" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="205.1" cy="56" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Чикаго</text>
  <line x1="261.5" y1="76" x2="193.7" y2="76" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="249.5" cy="76" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="261.5" cy="76" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="193.7" cy="76" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="100.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сингапур</text>
  <line x1="245.9" y1="96" x2="179.9" y2="96" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="201.5" cy="96" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="245.9" cy="96" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="96" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="120.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Хельсинки</text>
  <line x1="204.9" y1="116" x2="152.8" y2="116" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.7" cy="116" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="204.9" cy="116" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="152.8" cy="116" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="140.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Денвер</text>
  <line x1="279.2" y1="136" x2="229.7" y2="136" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="298.1" cy="136" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="279.2" cy="136" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="136" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="160.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Мадрид</text>
  <line x1="203.3" y1="156" x2="155.0" y2="156" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="240.3" cy="156" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="203.3" cy="156" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="155.0" cy="156" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="180.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Токио</text>
  <line x1="230.1" y1="176" x2="185.0" y2="176" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="162.2" cy="176" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="230.1" cy="176" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="176" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="200.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Берлин</text>
  <line x1="208.5" y1="196" x2="164.6" y2="196" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="238.3" cy="196" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="208.5" cy="196" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="164.6" cy="196" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="220.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сидней</text>
  <line x1="298.1" y1="216" x2="260.9" y2="216" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="173.9" cy="216" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="298.1" cy="216" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.9" cy="216" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="240.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Минск</text>
  <line x1="198.2" y1="236" x2="170.4" y2="236" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="256.7" cy="236" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="198.2" cy="236" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="170.4" cy="236" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="260.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Сан-Паулу</text>
  <line x1="199.4" y1="256" x2="178.7" y2="256" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="210.2" cy="256" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="199.4" cy="256" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="178.7" cy="256" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="280.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Варшава</text>
  <line x1="194.6" y1="276" x2="177.2" y2="276" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="219.2" cy="276" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="194.6" cy="276" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="177.2" cy="276" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="300.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Найроби</text>
  <line x1="197.1" y1="296" x2="179.9" y2="296" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="224.3" cy="296" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="197.1" cy="296" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="179.9" cy="296" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="320.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Торонто</text>
  <line x1="244.1" y1="316" x2="229.7" y2="316" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="273.8" cy="316" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="244.1" cy="316" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="229.7" cy="316" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="340.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Лондон</text>
  <line x1="167.1" y1="336" x2="181.5" y2="336" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="206.1" cy="336" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="167.1" cy="336" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="181.5" cy="336" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="126.0" y="360.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Йоханнесбург</text>
  <line x1="266.8" y1="356" x2="322.5" y2="356" style="stroke:var(--accent);stroke-width:2;opacity:0.5"/>
  <circle cx="270.6" cy="356" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <circle cx="266.8" cy="356" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="322.5" cy="356" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="144" cy="18" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="154.0" y="22.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <circle cx="224" cy="18" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="234.0" y="22.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">AIFS</text>
  <circle cx="304" cy="18" r="4" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="314.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">GFS</text>
  <text x="650.0" y="400.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">средняя абсолютная ошибка, °C</text>
</svg>
<figcaption>На день вперёд. AIFS точнее IFS в 14 аэропортах из 16. Одинокая точка справа это GFS в Дели, 4,0 градуса.</figcaption>
</figure>

Из-за Дели я чуть не сделал неверный вывод. По таблице GFS на 1-й день хуже IFS на 0,16 (от 0,12 до 0,21). Без Дели остаётся 0,03 (от -0,01 до 0,06). Я уже был готов написать, что GFS не хуже IFS и всё портит один аэропорт. Потом вернул Дели и выбросил Сидней, где GFS лучше на 0,83. Разрыв вырос до 0,23. По счёту GFS проигрывает в 12 аэропортах из 16, а среднее идёт туда, куда его потянет один из них. Мои интервалы перебирают недели и ничего не знают о другом списке аэропортов.

Что не так с Дели, я не знаю. Ошибка GFS там от 3,5 до 4,4 градуса в каждый из 4 часов, по месяцам от 3,1 в июле до 5,2 в мае. Похоже на сдвиг, который меняется медленно.

## Медленный сдвиг можно вычесть

Я и вычел, причём везде. Для каждой модели и срока, в каждом аэропорту и часе, взял среднюю ошибку за последние 30 дней. Брал только те ошибки, которые уже были известны к моменту выпуска прогноза. На pandas это одна строка:

```
bias = err.shift(lead + 1).rolling(30, min_periods=14).mean()
```

Окну нужно время, чтобы наполниться, поэтому эти числа начинаются с 7 апреля (7329 пар аэропорта и часа). На них у IFS 1,39, у AIFS 1,20, выигрыш 0,19. IFS после вычитания даёт 1,21, тоже на 0,19 меньше. Разность исправленной IFS и AIFS как есть 0,002 (от -0,030 до 0,035).

<figure class="fig">
<svg viewBox="0 0 680 316" role="img" aria-label="Ошибка до и после вычитания средней ошибки за последние 30 дней, часы для всех столбиков одни и те же. срок 1 дн., IFS: 1,39, 1,21; срок 1 дн., AIFS: 1,20, 1,03; срок 1 дн., GFS: 1,58, 1,29; срок 5 дн., IFS: 1,84, 1,69; срок 5 дн., AIFS: 1,61, 1,48; срок 5 дн., GFS: 2,19, 1,97.">
  <line x1="347.2" y1="44" x2="347.2" y2="170" style="stroke:var(--accent);stroke-width:1;stroke-dasharray:3 3"/>
  <text x="70.0" y="52.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">срок 1 дн.</text>
  <text x="60.0" y="80.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="62" width="321.4" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="399.4" y="72.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,39</text>
  <rect x="70" y="76" width="277.7" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="352.7" y="87.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,21</text>
  <text x="60.0" y="116.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="98" width="277.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="355.2" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,20</text>
  <rect x="70" y="112" width="237.9" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="312.9" y="123.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,03</text>
  <text x="60.0" y="152.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="134" width="365.2" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="443.2" y="144.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,58</text>
  <rect x="70" y="148" width="297.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="372.0" y="159.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,29</text>
  <text x="70.0" y="188.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">срок 5 дн.</text>
  <text x="60.0" y="216.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">IFS</text>
  <rect x="70" y="198" width="423.5" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="501.5" y="208.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,84</text>
  <rect x="70" y="212" width="388.3" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="463.3" y="223.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,69</text>
  <text x="60.0" y="252.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">AIFS</text>
  <rect x="70" y="234" width="370.8" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="448.8" y="244.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">1,61</text>
  <rect x="70" y="248" width="341.6" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="416.6" y="259.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,48</text>
  <text x="60.0" y="288.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">GFS</text>
  <rect x="70" y="270" width="505.0" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="583.0" y="280.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">2,19</text>
  <rect x="70" y="284" width="455.0" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="530.0" y="295.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">1,97</text>
  <rect x="70" y="10" width="14" height="12" style="fill:var(--muted);opacity:0.4;stroke:none"/>
  <text x="92.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">как есть</text>
  <rect x="220" y="10" width="14" height="12" style="fill:var(--ink);stroke:none"/>
  <text x="242.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">с поправкой</text>
</svg>
<figcaption>Светлая полоса это прогноз как есть, плотная это он же минус средняя ошибка за последние 30 дней. Пунктир отмечает AIFS без поправки на 1-й день.</figcaption>
</figure>

У меня уже был готов заголовок про одинаковые 0,19 у обеих. После Дели я сначала посмотрел на аэропорты. IFS поправка помогает в 15 из 16, только Минску она не дала ничего. А вот AIFS как есть исправленная IFS обходит лишь в 4. В Йоханнесбурге у AIFS 2,3, у исправленной IFS 1,2, в Сиднее 1,7 и 1,1. Только в этих 2 местах AIFS холоднее термометра больше чем на градус. Без них AIFS как есть впереди на 0,12 (от 0,09 до 0,15). На 5-й день она впереди и с ними, 1,61 против 1,69.

На практике ответ простой, делать и то и другое. У исправленной AIFS на 1-й день 1,03, на четверть меньше, чем у IFS как есть. Исправленную IFS она обходит в 15 аэропортах из 16.

## Что считать истиной

Во многих сравнениях за истину берут ERA5, реанализ того же ECMWF. По нему, до 27 июля, на 1-й день у AIFS 0,74, у IFS 1,12. Выигрыш вырос с 0,22 до 0,37 и AIFS впереди в 16 аэропортах из 16. AIFS училась на ERA5 и на анализах ECMWF, поэтому я и жду, что она будет на него похожа. Сам ERA5 расходится с термометрами этих аэропортов на 1,04. По одному ERA5 я бы написал, что выигрыш в 1,7 раза больше.

## Середина шага

Между шагами в 6 часов API достраивает AIFS интерполяцией. В свои часы у AIFS 1,19, а за 3 часа от них уже 1,32. У IFS меняется только с 1,41 на 1,43. По всем 24 часам выигрыш AIFS 0,15. На дневном максимуме он 0,08 и AIFS впереди в 9 аэропортах. Обе модели на пике слишком холодные, AIFS на 0,69, IFS на 0,59.

Чтобы понять, сколько здесь от шага, я оставил от METAR только 00, 06, 12 и 18 часов, провёл через них кубический сплайн и взял максимум. Он холоднее настоящего на 0,55, хотя термометр тот же. С шагом 3 часа, а это шаг IFS в открытых данных, на 0,19. Мой сплайн лишь замена тому, что делает API. Если он близок, шаг объясняет большую часть промаха AIFS и треть промаха IFS.

## Чего я не проверял

Здесь только температура. С дождём и ветром порядок может быть другим. 5 месяцев это весна и лето на севере, без зимних инверсий. У Найроби сводки есть для 81% часов, METAR вне США обычно округлён до целого градуса. Я верю API, что "за 1 день" у всех 3 моделей значит одно и то же, по сырым запускам я этого не сверял. IFS здесь открытая, с шагом 0,25 градуса, а не полная. Окно в 30 дней я не подбирал, при 20 и 40 выходит то же 1,21, при 10 выходит 1,26.
