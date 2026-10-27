---
title: "Я проверил советы по промптам на GPT-2 и порядок примеров оказался важнее их всех"
description: "Я прогнал популярные советы по промптам на GPT-2 medium и large на 872 отзывах SST-2: please, you are an expert, IMPORTANT, чёткая инструкция. На 10 наборах примеров они сдвинули среднее на 1-4 пункта, обычная инструкция на medium оказалась на 9,5 пункта хуже, чем никакая, а порядок тех же 4 примеров двигал точность до 37 пунктов."
date: 2022-03-25
lang: ru
translationKey: prompt-superstition
tags: ["llm", "machine-learning", "statistics"]
---
С тех пор как вышла GPT-3, советов о том, как писать промпт, становится всё больше. Будь вежлив. Скажи модели, что она эксперт. Напиши IMPORTANT заглавными и попроси думать внимательно. Поставь наверх чёткую инструкцию. Большая часть этих советов идёт от человека, который один раз попробовал через API и у него сработало. Второго прогона за этим нет.

Я читал эти советы и раскладывал их в голове, ничего не измеряя. Вежливость и "you are an expert" я записал в суеверия. Чёткую инструкцию записал в ремесло, единственную часть промпта, которая хотя бы не навредит. Запустить GPT-3 дома я не могу. Но тот же приём с несколькими примерами в промпте работает и на GPT-2, поэтому я проверил обе группы советов на одной задаче и посчитал.

## Стенд

Задача SST-2 из GLUE: 872 коротких отзыва о фильмах из dev-части, 444 из них положительные. Модель, которая на всё отвечает "positive", получает 50,9%.

Промпт начинается с инструкции: "Classify the sentiment of each movie review as positive or negative." Дальше идут 4 примера из обучающей части, 2 положительных и 2 отрицательных, в виде `Review: ...` и `Sentiment: positive`. Потом отзыв, который надо классифицировать. Модель ничего не генерирует. Я сравниваю, какое следующее слово вероятнее, " positive" или " negative", поэтому один и тот же промпт всегда даёт одно и то же число.

Модели GPT-2 medium (355M параметров) и GPT-2 large (774M) в float32, на 4 ядрах AMD EPYC 7713 в виртуалке. Способ подсчёта даёт те же предсказания и на torch 1.11 с transformers 4.17. Для medium я прогнал 217 промптов, для large 99 из них.

Я выбрал 10 наборов по 4 примера с фиксированным seed. Каждый вариант идёт на тех же 10 наборах, так что правка промпта остаётся единственной разницей.

## Советы

<figure class="fig">
<svg viewBox="0 0 640 286" role="img" aria-label="Ряды точек, по ряду на инструкцию, в каждом 10 точек по 10 наборам примеров. без инструкции: от 50,9 до 84,5, среднее 68,8. обычная: от 48,9 до 82,1, среднее 59,3. please ... thank you: от 49,2 до 85,2, среднее 62,8. you are an expert: от 49 до 79,9, среднее 60,7. IMPORTANT, think carefully: от 49 до 78,3, среднее 60,3. переведи на французский: от 50,2 до 83,3, среднее 65,5. комедия или драма: от 49,4 до 83,3, среднее 64,5.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, точность на 872 отзывах, %</text>
  <circle cx="18" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 точка = 1 набор из 4 примеров</text>
  <rect x="330" y="29" width="3" height="14" class="f-accent"/>
  <text x="340" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">среднее по 10 наборам</text>
  <line x1="262.2" y1="54" x2="262.2" y2="262" class="f-plain"/>
  <text x="262.2" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="346.7" y1="54" x2="346.7" y2="262" class="f-plain"/>
  <text x="346.7" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">60</text>
  <line x1="431.1" y1="54" x2="431.1" y2="262" class="f-plain"/>
  <text x="431.1" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="515.6" y1="54" x2="515.6" y2="262" class="f-plain"/>
  <text x="515.6" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">80</text>
  <line x1="600.0" y1="54" x2="600.0" y2="262" class="f-plain"/>
  <text x="600.0" y="276" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">90</text>
  <text x="12" y="72" text-anchor="start" class="f-mono f-ink" style="font-size:11px">без инструкции</text>
  <circle cx="294.3" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="553.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="526.5" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="553.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="441.2" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="482.6" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="320.5" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="326.4" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="440.4" cy="68" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="419.5" y="59" width="3" height="18" class="f-accent"/>
  <text x="12" y="102" text-anchor="start" class="f-mono f-accent" style="font-size:11px">обычная</text>
  <circle cx="280.0" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="383.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="323.9" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="533.3" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="252.9" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="342.4" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="365.2" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="302.8" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="351.7" cy="98" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="339.3" y="89" width="3" height="18" class="f-accent"/>
  <text x="12" y="132" text-anchor="start" class="f-mono f-ink" style="font-size:11px">please ... thank you</text>
  <circle cx="269.8" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="529.9" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="559.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="255.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="440.4" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="339.9" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="293.5" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="328.1" cy="128" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="368.8" y="119" width="3" height="18" class="f-accent"/>
  <text x="12" y="162" text-anchor="start" class="f-mono f-ink" style="font-size:11px">you are an expert</text>
  <circle cx="271.5" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="438.7" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="359.3" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="514.7" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="253.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="353.4" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="317.1" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="329.8" cy="158" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="351.1" y="149" width="3" height="18" class="f-accent"/>
  <text x="12" y="192" text-anchor="start" class="f-mono f-ink" style="font-size:11px">IMPORTANT, think carefully</text>
  <circle cx="290.9" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="439.6" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="339.1" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="501.2" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="253.8" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="392.3" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="328.1" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="311.2" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="363.6" cy="188" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="347.7" y="179" width="3" height="18" class="f-accent"/>
  <text x="12" y="222" text-anchor="start" class="f-mono f-ink" style="font-size:11px">переведи на французский</text>
  <circle cx="355.1" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="524.0" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="543.4" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="385.5" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.9" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="414.2" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="322.2" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="332.3" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="519.8" cy="218" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="391.6" y="209" width="3" height="18" class="f-accent"/>
  <text x="12" y="252" text-anchor="start" class="f-mono f-ink" style="font-size:11px">комедия или драма</text>
  <circle cx="297.7" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="535.0" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="424.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="543.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="257.2" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="462.4" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="269.8" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="394.0" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="301.9" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="356.8" cy="248" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="383.2" y="239" width="3" height="18" class="f-accent"/>
</svg>
<figcaption>Во всех рядах те же 10 наборов примеров. Внутри ряда точки расходятся на 29-36 пунктов, средние между рядами отличаются не больше чем на 9,5. У обычной инструкции среднее самое низкое.</figcaption>
</figure>

На medium обычная инструкция даёт в среднем 59,3% по 10 наборам. "Please ... Thank you!" даёт 62,8%, "You are an expert film critic." 60,7%, IMPORTANT с "Think carefully and be accurate." 60,3%. Вежливая лучше обычной на 5 наборах и хуже на 4, это как подбросить монетку. Вариант с заглавными лучше на 7 и хуже на 2, но 10 наборов слишком мало, чтобы в этом быть уверенным.

Но посмотрите на ряды рисунка, а не на средние. При обычной инструкции один только набор примеров двигает результат от 48,9% до 82,1%. Это 33 пункта от выбора 4 отзывов. Слова, о которых я готов был спорить, сдвинули среднее на 1-4 пункта.

## Где я ошибся

В инструкцию я как раз верил, поэтому прогнал промпт и без неё. Без инструкции medium получает 68,8%, на 9,5 пункта больше, лучше на 8 наборах из 10 и хуже на 1. Потом я попробовал 2 неправильные инструкции. "Translate each sentence into French." даёт 65,5%, а "Classify each movie review by whether it is about a comedy or a drama." 64,5%, тоже больше, чем правильная.

Без примеров то же самое. Голый `Review: ... Sentiment:` даёт 73,2%, с обычной инструкцией сверху 60,8%, с вежливой 53,9%. С "please" модель отвечает positive на 97% отзывов.

Я какое-то время искал ошибку. Проверил, что инструкция действительно попадает в промпт и что каждое из двух слов-меток занимает ровно 1 токен. Закешированный префикс тоже дал те же токены, что и полный текст. Всё было в порядке. Почему эта инструкция вредит medium, я не знаю.

## Порядок тех же 4 примеров

<figure class="fig">
<svg viewBox="0 0 640 354" role="img" aria-label="Точечная диаграмма, 72 точки, по одной на порядок примеров. По горизонтали доля отзывов, которые модель назвала положительными, по вертикали точность. 12 порядков с метками положительный, отрицательный, положительный, отрицательный собрались в углу: от 99,2 до 100 процента положительных ответов и около 51 процента точности, это уровень ответа positive на всё. Остальные 60 порядков разбросаны от 1 до 99 процентов положительных ответов и точность выше всего там, где ответы поделены поровну.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 medium, те же 4 примера в 24 порядках, 3 набора</text>
  <rect x="14" y="31" width="9" height="9" class="f-accent"/>
  <text x="28" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">метки в порядке + - + -</text>
  <circle cx="334" cy="36" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="344" y="40" text-anchor="start" class="f-mono f-ink" style="font-size:11px">любой другой порядок</text>
  <line x1="70" y1="74" x2="70" y2="310" class="f-plain"/>
  <text x="70" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="205" y1="74" x2="205" y2="310" class="f-plain"/>
  <text x="205" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <line x1="340" y1="74" x2="340" y2="310" class="f-plain"/>
  <text x="340" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="475" y1="74" x2="475" y2="310" class="f-plain"/>
  <text x="475" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">75</text>
  <line x1="610" y1="74" x2="610" y2="310" class="f-plain"/>
  <text x="610" y="326" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <line x1="70" y1="283.8" x2="610" y2="283.8" class="f-plain"/>
  <text x="62" y="287.77777777777777" text-anchor="end" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="70" y1="231.3" x2="610" y2="231.3" class="f-plain"/>
  <text x="62" y="235.33333333333334" text-anchor="end" class="f-mono f-muted" style="font-size:10px">60</text>
  <line x1="70" y1="178.9" x2="610" y2="178.9" class="f-plain"/>
  <text x="62" y="182.88888888888889" text-anchor="end" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="70" y1="126.4" x2="610" y2="126.4" class="f-plain"/>
  <text x="62" y="130.44444444444443" text-anchor="end" class="f-mono f-muted" style="font-size:10px">80</text>
  <line x1="70" y1="74.0" x2="610" y2="74.0" class="f-plain"/>
  <text x="62" y="78" text-anchor="end" class="f-mono f-muted" style="font-size:10px">90</text>
  <text x="340" y="344" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">ответ &quot;positive&quot;, % отзывов</text>
  <text x="12" y="66" text-anchor="start" class="f-mono f-muted" style="font-size:11px">точность, %</text>
  <line x1="70" y1="279.1" x2="610" y2="279.1" class="f-line" stroke-dasharray="4 3"/>
  <text x="340" y="295.1" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">всё &quot;positive&quot;: 50,9</text>
  <circle cx="604.1" cy="272.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="590.0" cy="260.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="387.0" cy="200.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="343.2" cy="207.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="603.0" cy="272.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="594.9" cy="265.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="268.2" cy="160.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.9" cy="171.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="604.1" cy="272.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="348.1" cy="135.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="585.2" cy="257.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="129.4" cy="239.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="528.5" cy="203.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="557.6" cy="229.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="538.2" cy="219.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="231.5" cy="185.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="527.4" cy="206.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="117.0" cy="248.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="513.9" cy="193.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="556.0" cy="227.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="168.8" cy="208.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="309.2" cy="177.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="423.2" cy="205.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="151.5" cy="217.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="478.8" cy="167.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="522.0" cy="204.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="318.9" cy="170.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="161.8" cy="228.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="247.7" cy="153.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="539.3" cy="215.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="550.1" cy="225.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="540.9" cy="235.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="538.7" cy="221.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="527.4" cy="205.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="243.9" cy="137.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="360.5" cy="102.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="147.8" cy="219.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="297.3" cy="156.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="75.9" cy="282.7" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="607.3" cy="276.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="119.7" cy="245.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="458.8" cy="173.1" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="455.0" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="446.9" cy="137.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="315.2" cy="132.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="313.0" cy="115.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="507.9" cy="188.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="230.4" cy="188.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="314.6" cy="123.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="448.5" cy="156.9" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="448.0" cy="149.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="436.7" cy="134.8" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="75.4" cy="283.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="147.2" cy="226.6" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="263.3" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="117.5" cy="244.4" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="542.5" cy="217.2" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="457.7" cy="144.3" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="428.6" cy="139.0" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="110.5" cy="255.5" r="4" class="f-muted" fill-opacity="0.6"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="603.9" y="272.5" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="601.2" y="271.4" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.0" y="274.0" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.0" y="274.0" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="605.5" y="274.6" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="602.8" y="271.9" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <rect x="602.3" y="271.4" width="9" height="9" class="f-accent" fill-opacity="0.7"/>
  <text x="593.8" y="301.6088888888889" text-anchor="end" class="f-mono f-accent" style="font-size:11px">все 12 порядков + - + -</text>
  <line x1="595.96" y1="298.4622222222222" x2="605.68" y2="285.87555555555554" class="f-line"/>
</svg>
<figcaption>Точность высокая только там, где модель делит ответы примерно поровну. Все 12 порядков, где метки чередуются, начиная с положительной, оказались в одном углу.</figcaption>
</figure>

Для 3 наборов я прогнал все 24 порядка тех же 4 примеров, не меняя ни слова. На наборе 0 точность идёт от 50,9% до 78,3%, на наборе 1 от 50,2% до 84,5%, на наборе 2 от 50,1% до 82,1%. Чжао с коллегами показали это на GPT-3 в прошлом году. Лу с коллегами сделали это на GPT-2 ровно по такой схеме, SST-2 и все 24 порядка 4 примеров, так что это не новость. Но я не ожидал, что этот эффект окажется сильнее всего остального в моей сетке.

Плохие порядки не случайны. На 3 наборах есть 12 порядков с метками `+ - + -`. Во всех модель отвечает "positive" на 99,2% отзывов и больше, а точность 50,9-51,5%. Похоже, модель продолжает последовательность меток вместо того, чтобы читать отзыв. Зеркальный порядок `- + - +` не такой чистый, там доля положительных ответов от 1,0% до 51,5%.

## GPT-2 large

На large моя история про инструкцию развалилась. С 4 примерами формулировка почти не важна. Вежливая на 1,3 пункта выше обычной, без инструкции на 0,6 ниже. Обе неправильные инструкции теперь немного хуже обычной, французская на 2,4 пункта и ниже на 8 наборах из 10. Так что предыдущий раздел относится только к medium. Набор примеров всё так же двигает обычный промпт от 53,6% до 87,6%.

На large я успел прогнать только 24 порядка набора 0. Они идут от 51,6% до 88,3%, но модель здесь ломается на другом порядке. `+ - + -` здесь работает нормально, 75,0-88,3%. Large ломается, когда у 2 последних примеров одна метка. После `+ + - -` модель отвечает positive лишь на 2,5-5,2% отзывов, после `- - + +` на 87,4-96,7%. Чжао с коллегами называют это recency bias: модель тянется к метке, которую видела последней. Это объяснение подходит только к large: у medium порядок `+ - + -` заканчивается отрицательным примером, а модель всё равно говорит positive.

<figure class="fig">
<svg viewBox="0 0 640 258" role="img" aria-label="Две панели точек, по ряду на порядок меток в 4 примерах, по 4 порядка в ряду. Слева точность, справа доля отзывов с ответом positive. + - + -: точность от 75 до 88,3, positive от 44 до 74,5. - + - +: точность от 83,4 до 85,3, positive от 50,2 до 61,4. - + + -: точность от 85,2 до 87,7, positive от 46 до 52,6. + - - +: точность от 65,6 до 81,3, positive от 67,5 до 84,6. - - + +: точность от 54,2 до 63,5, positive от 87,4 до 96,7. + + - -: точность от 51,6 до 54,2, positive от 2,5 до 5,2.">
  <text x="12" y="18" class="f-label f-muted">GPT-2 large, набор 0, 24 порядка по меткам примеров</text>
  <text x="240" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">точность, %</text>
  <text x="490" y="44" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">ответ &quot;positive&quot;, %</text>
  <line x1="162.2" y1="56" x2="162.2" y2="234" class="f-plain"/>
  <text x="162.2" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="251.1" y1="56" x2="251.1" y2="234" class="f-plain"/>
  <text x="251.1" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">70</text>
  <line x1="340.0" y1="56" x2="340.0" y2="234" class="f-plain"/>
  <text x="340.0" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">90</text>
  <line x1="390" y1="56" x2="390" y2="234" class="f-plain"/>
  <text x="390" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="490" y1="56" x2="490" y2="234" class="f-plain"/>
  <text x="490" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="590" y1="56" x2="590" y2="234" class="f-plain"/>
  <text x="590" y="248" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">100</text>
  <text x="12" y="70" text-anchor="start" class="f-mono f-ink" style="font-size:12px">+ - + -</text>
  <circle cx="273.3" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="539.0" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="325.3" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="509.2" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="332.4" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="505.6" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="327.6" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="478.0" cy="66" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="100" text-anchor="start" class="f-mono f-ink" style="font-size:12px">- + - +</text>
  <circle cx="318.2" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="490.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="316.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="493.4" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="310.7" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="512.8" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="319.1" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="503.8" cy="96" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="130" text-anchor="start" class="f-mono f-ink" style="font-size:12px">- + + -</text>
  <circle cx="324.0" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="495.2" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="329.8" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="493.4" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="324.4" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="486.8" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="318.7" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="482.0" cy="126" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="160" text-anchor="start" class="f-mono f-ink" style="font-size:12px">+ - - +</text>
  <circle cx="232.4" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="558.8" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="231.6" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="559.2" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="301.3" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="525.0" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="287.6" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <circle cx="531.8" cy="156" r="4" class="f-muted" fill-opacity="0.6"/>
  <text x="12" y="190" text-anchor="start" class="f-mono f-accent" style="font-size:12px">- - + +</text>
  <circle cx="214.7" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="568.2" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="222.2" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="564.8" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="180.9" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="583.4" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="184.4" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="581.8" cy="186" r="4" class="f-accent" fill-opacity="0.75"/>
  <text x="12" y="220" text-anchor="start" class="f-mono f-accent" style="font-size:12px">+ + - -</text>
  <circle cx="178.2" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="399.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="169.3" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="395.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="180.9" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="400.4" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="171.6" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
  <circle cx="396.0" cy="216" r="4" class="f-accent" fill-opacity="0.75"/>
</svg>
<figcaption>Когда у 2 последних примеров одна метка, large ставит её большинству отзывов. Чередование с положительной метки, которое ломало medium, здесь работает нормально.</figcaption>
</figure>

Без примеров на large формулировка важна очень сильно. Голый промпт получает 86,4%, вежливый 84,1%, заглавные 78,7%, обычный 71,9%, эксперт 68,6%. На medium вежливый был на 6,9 пункта хуже обычного. На large он на 12,2 пункта лучше. Но каждое число без примеров это 1 промпт, за которым нет наборов. Я не могу сказать, сколько из этих 18 пунктов дала формулировка, а сколько именно эта фраза. Этот голый промпт с 86,4% к тому же выше любого варианта с 4 примерами на large, где лучшее среднее 65,8%.

## Что ещё двигало число

Слова-метки важнее вежливых слов. С "good" и "bad" medium получает 68,4%, с "A" и "B" 49,0%, хуже, чем если на всё отвечать positive.

Калибровка немного помогает medium и сильнее large. Чжао с коллегами спрашивают модель о пустом входе вроде "N/A" и делят вероятности ответов на то, что она говорит там. С обычной инструкцией это сдвигает medium с 59,3% до 62,0%, а large с 64,5% до 72,0%, лучше на 7 наборах из 10 у обеих. На промпте medium без примеров выходит наоборот, с 60,8% до 55,4%. После поправки модель говорит positive лишь на 7,7% отзывов.

Случайные метки в примерах стоят medium 4,2 пункта. Это близко к тому, что Мин с коллегами в прошлом месяце сообщили для моделей побольше. Перевёрнутые метки стоят 6,7 пункта, но переворачивать ответы medium по ним не учится. Она просто чаще говорит positive, в 89% случаев.

## Чего я не проверял

- Саму GPT-3. Большие модели вполне могут читать инструкцию лучше.
- Другие задачи. Тональность отзывов о фильмах это самый простой случай. На задаче, где модели нужна инструкция, чтобы понять, что делать, её удаление скорее всего навредит.
- Больше наборов. 10 наборов показывают разброс в 33 пункта, но разница в 3 пункта между формулировками остаётся в пределах шума. Вежливая могла бы на деле быть на 2 пункта лучше и я бы этого не увидел.

Для маленьких моделей я теперь сначала попробую несколько порядков примеров и только потом буду трогать формулировку. И инструкцию я больше не считаю безопасной частью, хотя на large она была просто нейтральной.
