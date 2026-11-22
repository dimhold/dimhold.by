---
title: "Откуда берётся скорость поиска в HNSW"
description: "Скорость HNSW я всегда объяснял уровнями. На SIFT1M с faiss 1.7.0 я посчитал расстояния на запрос и выключил верхние уровни. Цена не изменилась."
date: 2021-03-13
lang: ru
translationKey: hnsw-inside
tags: ["algorithms", "databases", "performance"]
---
Когда кто-нибудь объясняет HNSW, всегда появляется одна и та же картинка. Несколько графов сложены слоями, верхний почти пустой, в нижнем все векторы. Поиск начинается сверху, делает там длинные прыжки, спускается и заканчивает короткими шагами возле ответа. Похоже на skip list и я сам не раз так объяснял. Когда меня спрашивали, почему приближённый поиск такой быстрый, я отвечал "из-за уровней" и дальше никто не спрашивал.

Я ни разу это не проверял. В конце января вышел faiss 1.7.0, я его поставил и решил посмотреть, что происходит внутри одного поиска.

## Как мерил

Данные SIFT1M: 1 000 000 векторов по 128 чисел типа float. К ним прилагаются 10 000 запросов и точные 100 ближайших соседей для каждого. Я взял копию из `ann-benchmarks` и использовал первые 1000 запросов. Всё работало на Python 3.8 с `faiss-cpu` 1.7.0, на 4 виртуальных ядрах облачной машины. Время поиска везде для 1 потока и 1 запроса за раз.

Сначала полный перебор, чтобы было с чем сравнивать. `IndexFlatL2` считает 1 000 000 расстояний на запрос и тратит на это 96 мс.

Потом `IndexHNSWFlat` с M=16 и `efConstruction` 40, это значение по умолчанию. Индекс строился 62 секунды в 4 потока. Faiss назначает каждому вектору случайный верхний уровень. Шанс подняться на уровень выше равен 1 из 16 и реальные числа хорошо с этим совпадают:

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Число векторов в зависимости от их верхнего уровня в HNSW, логарифмическая шкала: уровень 0 937 597, уровень 1 58 500, уровень 2 3693, уровень 3 194, уровень 4 15, уровень 5 1. На каждом уровне примерно в 16 раз меньше векторов, чем на уровне ниже.">
  <line x1="110" y1="6" x2="110" y2="16" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="118" y="15" text-anchor="start" class="f-muted" style="font-size:11px">ожидаемое при 1 из 16</text>
  <text x="100" y="40" text-anchor="end" class="f-ink" style="font-size:12px">уровень 0</text>
  <rect x="110.0" y="29.0" width="437.9" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="547.9" y1="26" x2="547.9" y2="48" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="555.9" y="41" text-anchor="start" class="f-mono" style="font-size:12px">937 597</text>
  <text x="100" y="68" text-anchor="end" class="f-ink" style="font-size:12px">уровень 1</text>
  <rect x="110.0" y="57.0" width="349.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="459.6" y1="54" x2="459.6" y2="76" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="467.6" y="69" text-anchor="start" class="f-mono" style="font-size:12px">58 500</text>
  <text x="100" y="96" text-anchor="end" class="f-ink" style="font-size:12px">уровень 2</text>
  <rect x="110.0" y="85.0" width="261.6" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="371.3" y1="82" x2="371.3" y2="104" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="379.6" y="97" text-anchor="start" class="f-mono" style="font-size:12px">3693</text>
  <text x="100" y="124" text-anchor="end" class="f-ink" style="font-size:12px">уровень 3</text>
  <rect x="110.0" y="113.0" width="167.8" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="283.0" y1="110" x2="283.0" y2="132" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="291.0" y="125" text-anchor="start" class="f-mono" style="font-size:12px">194</text>
  <text x="100" y="152" text-anchor="end" class="f-ink" style="font-size:12px">уровень 4</text>
  <rect x="110.0" y="141.0" width="86.2" height="16.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <line x1="194.7" y1="138" x2="194.7" y2="160" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="204.2" y="153" text-anchor="start" class="f-mono" style="font-size:12px">15</text>
  <text x="100" y="180" text-anchor="end" class="f-ink" style="font-size:12px">уровень 5</text>
  <rect x="110.0" y="169.0" width="4.0" height="16.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <line x1="110.0" y1="166" x2="110.0" y2="188" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <text x="122.0" y="181" text-anchor="start" class="f-mono" style="font-size:12px">1</text>
  <line x1="110" y1="196" x2="550" y2="196" class="f-line"/>
  <line x1="110.0" y1="196" x2="110.0" y2="200" class="f-line"/>
  <text x="110.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1</text>
  <line x1="256.7" y1="196" x2="256.7" y2="200" class="f-line"/>
  <text x="256.7" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">100</text>
  <line x1="403.3" y1="196" x2="403.3" y2="200" class="f-line"/>
  <text x="403.3" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">10 000</text>
  <line x1="550.0" y1="196" x2="550.0" y2="200" class="f-line"/>
  <text x="550.0" y="213" text-anchor="middle" class="f-muted f-mono" style="font-size:11px">1 000 000</text>
</svg>
<figcaption>Верхний уровень каждого из 1 000 000 векторов SIFT1M в IndexHNSWFlat, M=16, faiss 1.7.0. Полоса это число, засечка это ожидаемое число 1 000 000 × 16^−l × 15/16. Шкала логарифмическая.</figcaption>
</figure>

937 597 векторов живут только на нижнем уровне. До уровня 5 доходит единственный вектор и с него начинается каждый поиск.

Скорость поиска зависит от `efSearch`, длины списка кандидатов на нижнем уровне. При ef=64 один запрос занимает 0,32 мс и находит 90,5% из 10 настоящих ближайших соседей. При ef=256 это 1,08 мс и 98,6%. Если хватает 9 правильных соседей из 10, получается примерно в 300 раз быстрее перебора.

## Считаю расстояния

Время зависит от машины, поэтому мне нужно было число вычисленных расстояний. В faiss 1.7.0 счётчик `hnsw_stats.ndis` остаётся равным нулю. Я посмотрел в исходники, в него ничего не записывается. Настоящее число расстояний на нижнем уровне пишется в `n3`, а верхние уровни не считаются нигде.

Тогда я написал поиск сам, на Python. Он ходит по тому же графу, списки соседей взяты из индекса faiss. Алгоритм из статьи про HNSW: жадный спуск по верхним уровням, потом поиск со списком кандидатов размера ef на нижнем.

При ef=64 и ef=256 мой поиск находит почти ту же долю соседей, что и faiss. Расстояний на нижнем уровне он тоже считает примерно столько же, 904 против 876 при ef=64. При ef=16 он находит больше, 70,7% против 64,0%. У faiss другое правило остановки и ограниченная очередь кандидатов. Подгонять одно под другое я не стал.

При ef=64 один запрос стоит примерно 1020 расстояний из 1 000 000 в базе. 116 из них уходят на верхние уровни, остальные 904 на нижний.

## Выключаю уровни

Здесь я ожидал увидеть, что дают уровни. Взял тот же граф, пропустил спуск и начал поиск на нижнем уровне прямо с точки входа. Если длинные прыжки делают уровни, то одному нижнему уровню должно понадобиться заметно больше шагов, чтобы добраться до нужной области.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Число вычисленных расстояний на запрос при ef 16, 64 и 256 для трёх способов начать поиск на нижнем уровне: ef 16, с верхними уровнями: 431, 70,7%; ef 16, только нижний уровень, от точки входа: 433, 69,3%; ef 16, только нижний уровень, случайный старт: 472, 57,7%; ef 64, с верхними уровнями: 1020, 91,0%; ef 64, только нижний уровень, от точки входа: 1022, 90,3%; ef 64, только нижний уровень, случайный старт: 1103, 82,9%; ef 256, с верхними уровнями: 3005, 98,6%; ef 256, только нижний уровень, от точки входа: 3000, 98,5%; ef 256, только нижний уровень, случайный старт: 3160, 97,2%.">
  <rect x="20.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <text x="38" y="14" text-anchor="start" class="f-muted" style="font-size:11px">верхние уровни</text>
  <rect x="180.0" y="5.0" width="12.0" height="10.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="198" y="14" text-anchor="start" class="f-muted" style="font-size:11px">нижний уровень</text>
  <text x="660" y="14" text-anchor="end" class="f-muted" style="font-size:11px">recall@10</text>
  <text x="20" y="59" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=16</text>
  <text x="88" y="41" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="30.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="30.0" width="44.9" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.4" y="41" text-anchor="start" class="f-mono" style="font-size:11px">431</text>
  <text x="660" y="41" text-anchor="end" class="f-mono f-muted" style="font-size:11px">70,7%</text>
  <text x="88" y="59" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="48.0" width="61.6" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="163.6" y="59" text-anchor="start" class="f-mono" style="font-size:11px">433</text>
  <text x="660" y="59" text-anchor="end" class="f-mono f-muted" style="font-size:11px">69,3%</text>
  <text x="88" y="77" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="66.0" width="67.3" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="169.3" y="77" text-anchor="start" class="f-mono" style="font-size:11px">472</text>
  <text x="660" y="77" text-anchor="end" class="f-mono f-muted" style="font-size:11px">57,7%</text>
  <text x="20" y="125" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=64</text>
  <text x="88" y="107" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="96.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="96.0" width="128.7" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.3" y="107" text-anchor="start" class="f-mono" style="font-size:11px">1020</text>
  <text x="660" y="107" text-anchor="end" class="f-mono f-muted" style="font-size:11px">91,0%</text>
  <text x="88" y="125" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="114.0" width="145.5" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="247.5" y="125" text-anchor="start" class="f-mono" style="font-size:11px">1022</text>
  <text x="660" y="125" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90,3%</text>
  <text x="88" y="143" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="132.0" width="157.1" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="259.1" y="143" text-anchor="start" class="f-mono" style="font-size:11px">1103</text>
  <text x="660" y="143" text-anchor="end" class="f-mono f-muted" style="font-size:11px">82,9%</text>
  <text x="20" y="191" text-anchor="start" class="f-ink f-mono" style="font-size:12px">ef=256</text>
  <text x="88" y="173" text-anchor="end" class="f-muted f-mono" style="font-size:11px">1</text>
  <rect x="96.0" y="162.0" width="16.6" height="14.0" class="f-box" style="fill:var(--accent);stroke:none"/>
  <rect x="112.6" y="162.0" width="411.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.9" y="173" text-anchor="start" class="f-mono" style="font-size:11px">3005</text>
  <text x="660" y="173" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98,6%</text>
  <text x="88" y="191" text-anchor="end" class="f-muted f-mono" style="font-size:11px">2</text>
  <rect x="96.0" y="180.0" width="427.3" height="14.0" class="f-box" style="fill:var(--ink);opacity:.55;stroke:none"/>
  <text x="529.3" y="191" text-anchor="start" class="f-mono" style="font-size:11px">3000</text>
  <text x="660" y="191" text-anchor="end" class="f-mono f-muted" style="font-size:11px">98,5%</text>
  <text x="88" y="209" text-anchor="end" class="f-muted f-mono" style="font-size:11px">3</text>
  <rect x="96.0" y="198.0" width="450.0" height="14.0" class="f-box" style="fill:var(--muted);opacity:.35;stroke:none"/>
  <text x="552.0" y="209" text-anchor="start" class="f-mono" style="font-size:11px">3160</text>
  <text x="660" y="209" text-anchor="end" class="f-mono f-muted" style="font-size:11px">97,2%</text>
  <text x="20" y="228" text-anchor="start" class="f-muted" style="font-size:11px">1. с верхними уровнями</text>
  <text x="20" y="246" text-anchor="start" class="f-muted" style="font-size:11px">2. только нижний уровень, от точки входа</text>
  <text x="20" y="264" text-anchor="start" class="f-muted" style="font-size:11px">3. только нижний уровень, случайный старт</text>
</svg>
<figcaption>Расстояний на запрос в среднем по 1000 запросам SIFT1M, мой поиск на Python по графу faiss. Выделенная часть полосы 1 потрачена на верхние уровни. Справа от каждой полосы recall@10.</figcaption>
</figure>

Не понадобилось. При ef=64 поиск без верхних уровней посчитал 1022 расстояния, с уровнями 1020. Полнота (recall@10) 90,3% против 91,0%. При ef=256 вышло 3000 против 3005, то есть без уровней даже чуть дешевле.

Сам спуск работает. Он приводит поиск в точку на медианном расстоянии 251 от запроса, а случайный вектор базы находится на расстоянии 556. У 55% запросов это уже ближе сотого соседа. Но поиску без спуска нужно всего около 7 лишних шагов на нижнем уровне. Они стоят примерно те же 116 расстояний, что потратил спуск.

Это не новость. В литературе я нашёл это уже после замера. В статье про HNSW сказано, что на данных высокой размерности трудно ждать от уровней того же ускорения, что и на данных низкой размерности. На SIFT выигрыш от уровней заметен меньше, чем выигрыш от способа выбора соседей. Какой-то выигрыш от уровней авторы всё же измерили, на 5 миллионах векторов SIFT и с другими настройками. Lin и Zhao в 2019 году мерили это на SIFT1M и других наборах и написали, что на реальных данных иерархия не даёт дополнительного выигрыша. Статью я читал. Этого места я не помнил.

## Где я споткнулся

Потом я попробовал начинать поиск на нижнем уровне со случайного вектора для каждого запроса и результат стал хуже. При ef=64 полнота упала до 82,9%, а цена выросла до 1103 расстояний. Я решил, что уровни всё-таки важны, потому что дают хороший старт.

Это было неверно. Старт со случайного вектора уровня 2 и выше дал 85,0% против 83,5% со случайного вектора только нижнего уровня. Как стартовые точки векторы верхних уровней ненамного лучше остальных. Faiss выбирает уровень вектора случайно и на данные не смотрит.

Тогда я подумал, что точка входа просто ближе к запросам. Так и есть, медианное расстояние 504, это ближе любого из 10 случайных стартовых векторов, которые я пробовал. Все эти старты я сравнивал при ef=16 и точка входа там даёт 69,3%. Вектор, ближайший к среднему по базе, ещё ближе и старт с него даёт 70,4%. Полный спуск даёт 70,7%. Но среди 10 случайных стартов расстояние результат не предсказывало: старт на расстоянии 521 дал 60,4%, а более далёкий, на 571, дал 61,8%. Так что у меня есть 2 хороших старта, которые оказались и 2 самыми близкими. Что делает старт хорошим, я не знаю.

## Нижний уровень

У каждого вектора на нижнем уровне есть место для 32 соседей. Вектор, который живёт только там, после прореживания сохраняет в среднем 14. Поиск при ef=64 делает около 66 шагов и на каждом шаге считает расстояния только до новых соседей одного вектора. Авторы HNSW приписывают эвристике прореживания разнообразие связей и связность графа. Я её не выключал, поэтому не могу сказать, какая часть скорости от неё. Цена всего этого 132 МБ списков соседей сверх 512 МБ векторов и минута на построение.

## Чего я не проверял

Я проверил только SIFT1M с M=16 и `efConstruction` 40 и построил индекс один раз. В статье про HNSW показано, что на данных с 4 измерениями уровни дают большое ускорение, это я не повторял. Время взято из одиночных прогонов и между прогонами плавает примерно на 10%, а число расстояний каждый раз одно и то же. Мой поиск это модель алгоритма на Python, а не сам faiss. С faiss он совпадает при ef 64 и 256, но не при 16.

Уровни я и дальше буду рисовать, когда объясняю HNSW. Про SIFT теперь буду добавлять, что в моём замере они ничего не сэкономили.
