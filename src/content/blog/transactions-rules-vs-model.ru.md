---
title: "Классификатор операций: 94,5% на случайном разбиении и 46,9% на новом продавце"
description: "Я сравнил 22 ручных правила, таблицу продавцов, TF-IDF и MiniLM на 83 692 настоящих карточных платежах властей Вашингтона. У TF-IDF 94,5% на случайном разбиении, 91,5% на следующих 2 месяцах и 46,9% на продавцах, которых он не видел."
date: 2024-04-06
lang: ru
translationKey: transactions-rules-vs-model
tags: ["machine-learning", "text", "open-data"]
---

Город Вашингтон публикует покупки по своим служебным картам (Open Data DC, CC BY 4.0). Я взял 2 года и посчитал строки по категории продавца, которая приходит вместе с платежом. Самая большая категория называется BOOK STORES, книжные магазины, в ней 15 079 строк. Из них 14 785 это Amazon.

Получается, метка, которую я собирался предсказывать, сообщает, кем продавец числится в платёжной системе, а про саму покупку не говорит ничего. Зато она есть у каждой строки и достаётся даром.

Категории операций я считал закрытым упражнением. Обучил TF-IDF с логистической регрессией, увидел что-нибудь выше 90 и пошёл дальше. Сколько в этом числе продавцов, которые были и в обучении и в тесте, я ни разу не проверял.

Воллсет с коллегами в 2017 году взяли около 220 тысяч норвежских описаний, мешок слов и логистическую регрессию, а потом улучшили результат данными из реестра компаний. Гарсия-Мендес с коллегами в 2020 году обучали SVM на n-граммах символов и слов. Мне хотелось добавить сюда ручные правила и отдельно посчитать новых продавцов.

## Что я взял

Строки с марта 2022 по февраль 2024 года, только те, что город успел выложить до этого поста. Без споров, возвратов за мошенничество и неизвестных кодов их 83 692. Часть имён уже причёсана (`AMERICAN AIRLINES` или просто `PAYPAL`), часть сырая и обрезана на 22 символах, вроде `SQ *MARYLAND BASKETBAL`. 338 описаний категорий я свёл к 16 до запуска классификаторов, так что BOOK STORES ушли в "покупки".

Обучение это всё до 31 декабря 2023 года, 77 011 строк. Тест это январь и февраль 2024 года, 6681 строка. Продавца задаёт ключ из небольшого скрипта: он убирает префиксы вроде `SQ *`, выбрасывает слова с цифрами и оставляет первые 2 слова. Продавец новый, если его ключа нет в обучающей части.

Методов 5:

- таблица, которая даёт известному продавцу его самую частую категорию, а новому "покупки";
- 22 правила, регулярные выражения, в каждом от 8 до 25 вариантов, написанные за один присест по 230 крупнейшим продавцам обучающей части и здравому смыслу;
- TF-IDF по символьным n-граммам от 2 до 4 и логистическая регрессия;
- эмбеддинги `all-MiniLM-L6-v2` и логистическая регрессия;
- те же эмбеддинги и 5 ближайших соседей.

Python 3.11, `scikit-learn` 1.4.1, `onnxruntime` 1.17.1. До запуска я записал, чего жду. На случайном разбиении таблица и TF-IDF пройдут 95%. На новых продавцах TF-IDF упадёт ниже 60%. MiniLM будет там лучше хотя бы на 5 пунктов, потому что знает слова, которых в моём обучении не было.

## Числа

<figure class="fig">
<svg viewBox="0 0 680 352" role="img" aria-label="Точность 5 методов в процентах на случайном разбиении, на январе и феврале 2024 года и на новых продавцах. таблица: 92,5; 88,9; 13,8. 22 правила: 67,1; 66,4; 32,8. TF-IDF + LR: 94,5; 91,5; 46,9. MiniLM + LR: 84,9; 81,7; 40,3. MiniLM + 5 NN: 77,8; 77,4; 49,5.">
  <rect x="130.0" y="5.0" width="12.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="150.0" y="15.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">случайные 10% обучающего периода</text>
  <rect x="130.0" y="23.0" width="12.0" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="150.0" y="33.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">январь и февраль 2024</text>
  <rect x="130.0" y="41.0" width="12.0" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="150.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">из них только новые продавцы</text>
  <text x="120.0" y="97.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">таблица</text>
  <rect x="130.0" y="72.0" width="453.3" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="589.3" y="81.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">92,5</text>
  <rect x="130.0" y="86.0" width="435.6" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="571.6" y="95.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">88,9</text>
  <rect x="130.0" y="100.0" width="67.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="203.6" y="109.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">13,8</text>
  <text x="120.0" y="153.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">22 правила</text>
  <rect x="130.0" y="128.0" width="328.8" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="464.8" y="137.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">67,1</text>
  <rect x="130.0" y="142.0" width="325.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="461.4" y="151.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">66,4</text>
  <rect x="130.0" y="156.0" width="160.7" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="296.7" y="165.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">32,8</text>
  <text x="120.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">TF-IDF + LR</text>
  <rect x="130.0" y="184.0" width="463.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="599.0" y="193.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">94,5</text>
  <rect x="130.0" y="198.0" width="448.4" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="584.4" y="207.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">91,5</text>
  <rect x="130.0" y="212.0" width="229.8" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="365.8" y="221.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">46,9</text>
  <text x="120.0" y="265.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + LR</text>
  <rect x="130.0" y="240.0" width="416.0" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="552.0" y="249.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">84,9</text>
  <rect x="130.0" y="254.0" width="400.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="536.3" y="263.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">81,7</text>
  <rect x="130.0" y="268.0" width="197.5" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="333.5" y="277.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">40,3</text>
  <text x="120.0" y="321.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">MiniLM + 5 NN</text>
  <rect x="130.0" y="296.0" width="381.2" height="11.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="517.2" y="305.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,8</text>
  <rect x="130.0" y="310.0" width="379.3" height="11.0" style="fill:var(--ink);opacity:0.8;stroke:none"/>
  <text x="515.3" y="319.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,4</text>
  <rect x="130.0" y="324.0" width="242.6" height="11.0" style="fill:var(--accent);stroke:none"/>
  <text x="378.6" y="333.5" text-anchor="start" class="f-mono f-accent" style="font-size:11px">49,5</text>
  <line x1="130" y1="66" x2="130" y2="342" class="f-line"/>
</svg>
<figcaption>Доля верных категорий, %. Последняя полоса в каждой группе это 580 строк от продавцов, которых нет в обучении. У таблицы там просто запасной ответ 'покупки'.</figcaption>
</figure>

На случайных 10% обучающего периода у TF-IDF 94,5%, у таблицы 92,5%. Уже меньше моих 95. На январе и феврале 91,5% и 88,9%. У правил 66,4%, при том что доля самой большой категории 33,8%.

Потом я разделил тест. 6101 строка приходится на продавцов, которые были в обучении. Там таблица даёт 96,1%, чуть больше, чем TF-IDF с его 95,7%. Остальные 580 строк, 8,7%, это 409 новых продавцов. На них у TF-IDF 46,9%, у правил 32,8%. В случайном разбиении новых строк было всего 4,8%, это одна из причин, почему оно выглядит лучше. На этих 367 строках у TF-IDF всего 43,6%.

MiniLM не помог. У соседей на новых продавцах 49,5% против 46,9%. Бутстреп по продавцам даёт для разницы 95-процентный интервал от -2,7 до 8,3. На знакомых соседи теряют 16 пунктов. Думаю, описания слишком короткие и обрубленные для модели, обученной на предложениях, но этого я не проверял.

Да и 46,9% получились такими благодаря гостиницам. Их 91 строка из 580, сеть в другом городе часто считается новым продавцом, а TF-IDF угадывает 84,6% таких строк. Без гостиниц остаётся 39,9%.

## Предупреждения, которые я выключил

Первый прогон дал для TF-IDF другие числа. На январе и феврале было 90,3%, а на продавцах, которые в обучении встретились ровно один раз, 61,5% при 94,7% у таблицы. Выглядело так, будто модель забывает то, что видела однажды.

Затем я повторил обучение в одном потоке вместо 2 и получил 62,3%. Выпуклая задача, решённая до конца, так себя вести не должна. Python я запускал с `-W ignore`, предел стоял 100 итераций, а спрятанной строкой был `ConvergenceWarning`. С пределом 1000 обучение останавливается на 225-й и те же продавцы получают 84,6%. Новые сдвинулись с 49,0% на 46,9%, то есть там ранняя остановка даже немного помогала.

Предупреждения больше нет, но от числа потоков результат всё равно зависит. В 2 потока обучение останавливается на 213-й итерации и даёт 83,8% и 47,1%. Выходит, допуск по умолчанию тоже не доводит до точного оптимума. Это 2 строки из 247 и одна из 580, я оставил как есть, все итоговые числа здесь получены в одном потоке.

<figure class="fig">
<svg viewBox="0 0 680 424" role="img" aria-label="Точность в процентах в зависимости от того, сколько операций продавца было в обучении. таблица: 0: 13,8; 1: 94,7; от 2 до 4: 95,1; от 5 до 19: 91,6; 20+: 97,2. TF-IDF + LR: 0: 46,9; 1: 84,6; от 2 до 4: 94,6; от 5 до 19: 93,2; 20+: 96,9. MiniLM + 5 NN: 0: 49,5; 1: 77,7; от 2 до 4: 77,9; от 5 до 19: 75,8; 20+: 81,2. 22 правила: 0: 32,8; 1: 27,9; от 2 до 4: 34,3; от 5 до 19: 35,7; 20+: 82,1.">
  <line x1="70" y1="360.0" x2="620" y2="360.0" class="f-plain"/>
  <text x="64.0" y="364.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="285.5" x2="620" y2="285.5" class="f-plain"/>
  <text x="64.0" y="289.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="70" y1="211.0" x2="620" y2="211.0" class="f-plain"/>
  <text x="64.0" y="215.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="70" y1="136.5" x2="620" y2="136.5" class="f-plain"/>
  <text x="64.0" y="140.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="70" y1="62.0" x2="620" y2="62.0" class="f-plain"/>
  <text x="64.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="4.0" y="50.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">верно, %</text>
  <text x="135.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">0</text>
  <text x="135.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">580 строк</text>
  <text x="253.8" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">1</text>
  <text x="253.8" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">247</text>
  <text x="372.5" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">от 2 до 4</text>
  <text x="372.5" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">411</text>
  <text x="491.3" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">от 5 до 19</text>
  <text x="491.3" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">928</text>
  <text x="610.0" y="378.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">20+</text>
  <text x="610.0" y="394.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4515</text>
  <text x="355.0" y="416.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">операций продавца в обучении</text>
  <polyline points="135.0,318.9 253.8,77.8 372.5,76.6 491.3,87.0 610.0,70.3" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <circle cx="135.0" cy="318.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="253.8" cy="77.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="372.5" cy="76.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="491.3" cy="87.0" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="610.0" cy="70.3" r="3" style="fill:var(--ink);stroke:none"/>
  <line x1="70" y1="16" x2="94" y2="16" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>
  <text x="100.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">таблица</text>
  <polyline points="135.0,220.2 253.8,107.9 372.5,78.1 491.3,82.3 610.0,71.2" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="135.0" cy="220.2" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="107.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="78.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="82.3" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="71.2" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="218" y1="16" x2="242" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <text x="248.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">TF-IDF + LR</text>
  <polyline points="135.0,212.5 253.8,128.5 372.5,127.9 491.3,134.1 610.0,118.0" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <circle cx="135.0" cy="212.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="253.8" cy="128.5" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="372.5" cy="127.9" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="491.3" cy="134.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="610.0" cy="118.0" r="3" style="fill:var(--accent);stroke:none"/>
  <line x1="366" y1="16" x2="390" y2="16" style="fill:none;stroke:var(--accent);stroke-width:1.4;stroke-dasharray:5 4"/>
  <text x="396.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">MiniLM + 5 NN</text>
  <polyline points="135.0,262.3 253.8,276.9 372.5,257.8 491.3,253.6 610.0,115.3" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <circle cx="135.0" cy="262.3" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="253.8" cy="276.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="372.5" cy="257.8" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="491.3" cy="253.6" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="115.3" r="3" style="fill:var(--muted);stroke:none"/>
  <line x1="514" y1="16" x2="538" y2="16" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <text x="544.0" y="20.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">22 правила</text>
  <text x="127.0" y="209.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">49,5</text>
  <text x="127.0" y="232.2" text-anchor="end" class="f-mono f-accent" style="font-size:11px">46,9</text>
  <text x="127.0" y="266.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">32,8</text>
  <text x="127.0" y="322.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">13,8</text>
  <text x="253.8" y="69.8" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">94,7</text>
  <text x="263.8" y="119.9" text-anchor="start" class="f-mono f-accent" style="font-size:11px">84,6</text>
  <text x="259.8" y="144.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">77,7</text>
  <text x="253.8" y="292.9" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">27,9</text>
  <text x="620.0" y="133.3" text-anchor="start" class="f-mono f-muted" style="font-size:11px">82,1</text>
  <text x="620.0" y="75.2" text-anchor="start" class="f-mono f-accent" style="font-size:11px">96,9</text>
</svg>
<figcaption>Тот же тест, разложенный по тому, сколько раз продавец встретился в обучении. Под осью число строк теста в каждой группе. Правила не учатся, они написаны по списку крупных продавцов.</figcaption>
</figure>

Эффект никуда не делся, просто стал меньше. Для продавца, которого видели один раз, таблица лучше модели. Начиная с 2 операций таблица и TF-IDF расходятся не больше чем на 2 пункта, а правила остаются далеко позади. C я не подбирал, осталось 10 из первого прогона. При C=100 у виденных один раз выходит 91,1%, но новые опускаются до 45,3%.

## Правила и уверенность

Правила по большей части молчат. На новых продавцах правило сработало в 228 строках из 580 и оказалось верным в 58,8% случаев. У TF-IDF на тех же строках 51,8%. Выборка маленькая, эту разницу я бы защищать не стал.

Больше всего мне нравится ошибка на `NATIONAL CAR RENTAL`. У меня было правило, что NATIONAL означает ассоциацию, потому что в обучающем списке национальных ассоциаций полно. TF-IDF ответил "услуги" с вероятностью 0,76. Про транспорт догадались только соседи.

Я надеялся, что вероятность предупредит о новом продавце. Предупреждает, но только отчасти:

| вероятность | знакомые: доля | знакомые: верно | новые: доля | новые: верно |
|---|---|---|---|---|
| от 0,5 | 97,5% | 97,0% | 69,3% | 57,5% |
| от 0,7 | 90,1% | 99,0% | 38,3% | 72,5% |
| от 0,9 | 78,6% | 99,8% | 19,0% | 86,4% |

Одни и те же 0,9 означают примерно одну ошибку на 500 у знакомого продавца и одну на 7 у нового.

На общий итог всё это влияет слабее, чем я ждал. Одна таблица даёт 88,9%, таблица с 22 правилами для новых 90,6%, таблица с TF-IDF 91,8%. Если отвечать, только когда продавец знаком или вероятность не ниже 0,9, человеку уйдут 470 строк, 7,0% теста, а среди остальных верны 95,9%.

Я бы начинал с таблицы, а время тратил на эти 470 строк.

## Чего я не проверял

Это платежи городских служб, 18,3% строк теста приходится на Amazon, так что на семейный бюджет мои проценты не переносятся. Ключ продавца придумал я сам, та же компания в другом написании считается новой. Голое PAYPAL это 2714 обучающих строк в 14 категориях, самая частая занимает 61,2%, а больше из самой строки ничего не узнать. У команды, которая ведёт правила годами, они были бы лучше моих. Проверки с гостиницами и 470 строками я добавил уже после того, как увидел результаты. Сумму, ведомство и большую языковую модель я не пробовал. Город правит старые строки, поэтому выгрузка в другой день может немного отличаться.
