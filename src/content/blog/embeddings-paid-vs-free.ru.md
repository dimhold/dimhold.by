---
title: "Самая большая модель эмбеддингов OpenAI стоит в 75 раз дороже самой маленькой и проигрывает на ArguAna модели на 22 миллиона параметров"
description: "Бесплатные модели sentence-transformers 2021 года против чисел, которые OpenAI опубликовала для своих эмбеддингов, на 4 наборах BEIR на 4 ядрах CPU. Лучшая бесплатная модель отстаёт от самой большой модели OpenAI в среднем на 3,9 пункта nDCG@10, на ArguAna обходит все размеры OpenAI и работает на моём CPU, а Davinci на тех же корпусах стоил бы $9021,57."
date: 2022-05-13
lang: ru
translationKey: embeddings-paid-vs-free
tags: ["machine-learning", "llm", "text"]
---
Я хочу поиск по своим заметкам, то есть по постам этого блога. Сначала надо выбрать векторы. В январе OpenAI открыла эндпойнт эмбеддингов и опубликовала статью о моделях за ним. Таблица 6 в ней сравнивает их поисковые модели с 8 другими методами на 11 наборах из BEIR. BEIR это бенчмарк поиска по незнакомым данным. В колонке среднего самая большая модель `cpt-text` XL лучшая в таблице, 52,8.

Через несколько дней Нильс Реймерс, автор `sentence-transformers`, выложил длинный ответ. Он сам вызывал API на 6 поисковых наборах, с Ada и Babbage, ещё в бете в декабре. Его вывод: поисковые модели на уровне бесплатных, а в работе стоят дороже в 8000, а то и в 600000 раз. Так у меня оказалось 2 текста с числами, которые говорили разное. Своих чисел у меня не было.

До запуска я записал свою догадку. Лучшая бесплатная модель проиграет XL в среднем на величину от 3 до 8 пунктов. И обгонит самую маленькую модель OpenAI хотя бы на 2 наборах из 4. Эту вилку я взял только из колонки среднего, на строки не смотрел.

## Как мерил

API я не вызывал. Со стороны OpenAI беру числа из их статьи. По длине вектора самый маленький размер S это Ada в API, а самый большой XL это Davinci. У них 1024 и 12288 чисел в векторе. Со своей стороны гоняю бесплатные модели на тех же наборах с той же метрикой. Это nDCG@10, она смотрит на первые 10 результатов и даёт больший вес верхним.

Наборы это 4 самых маленьких из 11, потому что всё идёт на CPU с 4 ядрами. В SciFact 5183 аннотации и 300 научных утверждений для проверки. NFCorpus это медицинские статьи и 323 запроса, написанных для широкой публики. В FiQA 57638 ответов из раздела про инвестиции на Stack Exchange и 648 вопросов. В ArguAna 8674 аргумента. Для каждого из 1406 запросов верный результат это контраргумент.

Бесплатные модели это 5 моделей `sentence-transformers` с июня по август прошлого года. У `all-MiniLM-L6-v2` 22 миллиона параметров и векторы из 384 чисел. У `all-mpnet-base-v2` и `multi-qa-mpnet-base-dot-v1` около 110 миллионов и 768 чисел. `multi-qa-MiniLM-L6-cos-v1` это маленькая модель для вопросов. `msmarco-distilbert-base-tas-b` это TAS-B, она есть и в таблице OpenAI. Рядом с ними BM25 из `rank_bm25` 0.2.2, простое совпадение слов. Поиск точный, каждый запрос сравнивается с каждым документом.

По TAS-B я проверил, что мои числа значат то же, что их. На 4 наборах у меня 64,28, 31,89, 42,70 и 30,02, в таблице 64,3, 31,9, 42,9 и 30,0. Мой BM25 не совпадает с их BM25: на SciFact он на 1,3 пункта ниже, на ArguAna на 7 выше. BM25 в BEIR это Elasticsearch со своими настройками. Так что свой я оставляю только как ориентир.

Первый прогон показал, насколько это медленно. TAS-B на SciFact считала 55 минут на 5183 аннотации, на `sentence-transformers` 2.2.0 с torch 1.11. По дороге я потерял её из виду и запустил вторую копию. Вторую убил, только когда увидел обе в списке процессов. Большая часть сетки потом ушла на вторую установку, которая на этом CPU примерно в 3 раза быстрее. 4 ячейки я прогнал на обеих установках, nDCG@10 совпал точно.

## По наборам

<figure class="fig">
<svg viewBox="0 0 680 376" role="img" aria-label="nDCG@10 на 4 наборах BEIR. SciFact: OpenAI S 67,2, M 70,4, L 74,4, XL 75,4; all-MiniLM-L6-v2 64,5, multi-qa-MiniLM-L6-cos-v1 54,0, msmarco-distilbert-base-tas-b 64,3, multi-qa-mpnet-base-dot-v1 58,9, all-mpnet-base-v2 65,6; BM25 65,2. NFCorpus: OpenAI S 33,2, M 36,7, L 38,0, XL 40,7; all-MiniLM-L6-v2 31,6, multi-qa-MiniLM-L6-cos-v1 29,7, msmarco-distilbert-base-tas-b 31,9, multi-qa-mpnet-base-dot-v1 31,9, all-mpnet-base-v2 33,3; BM25 30,6. ArguAna: OpenAI S 47,0, M 49,2, L 46,9, XL 43,5; all-MiniLM-L6-v2 50,2, multi-qa-MiniLM-L6-cos-v1 49,1, msmarco-distilbert-base-tas-b 42,7, multi-qa-mpnet-base-dot-v1 50,4, all-mpnet-base-v2 46,5; BM25 38,5. FiQA: OpenAI S 38,4, M 42,2, L 45,2, XL 51,2; all-MiniLM-L6-v2 36,9, multi-qa-MiniLM-L6-cos-v1 36,4, msmarco-distilbert-base-tas-b 30,0, multi-qa-mpnet-base-dot-v1 48,8, all-mpnet-base-v2 50,0; BM25 21,7.">
  <text x="10" y="16" class="f-label f-muted">nDCG@10 на 4 наборах BEIR</text>
  <circle cx="16" cy="34" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/><text x="26" y="38" class="f-label f-ink">OpenAI, числа из их статьи</text>
  <circle cx="276" cy="34" r="4" class="f-ink"/><text x="286" y="38" class="f-label f-ink">бесплатные модели, мой прогон</text>
  <line x1="490" y1="28" x2="490" y2="40" class="f-line f-muted" stroke-width="2"/><text x="498" y="38" class="f-label f-muted">BM25, мой прогон</text>
  <text x="108" y="96" text-anchor="end" class="f-mono f-ink" style="font-size:12px">SciFact</text>
  <line x1="120" y1="92" x2="660" y2="92" class="f-line f-muted" opacity="0.4"/>
  <line x1="526.7" y1="85" x2="526.7" y2="99" class="f-line f-muted" stroke-width="2"/>
  <circle cx="544.8" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="544.8" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="573.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="573.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="609.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="609.6" y="74" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="618.6" cy="83" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="618.6" y="63" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="520.6" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="426.3" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="518.5" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="470.2" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="530.1" cy="101" r="4" class="f-ink" opacity="0.75"/>
  <text x="530.1" y="119" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лучшая бесплатная 65,6</text>
  <text x="108" y="166" text-anchor="end" class="f-mono f-ink" style="font-size:12px">NFCorpus</text>
  <line x1="120" y1="162" x2="660" y2="162" class="f-line f-muted" opacity="0.4"/>
  <line x1="215.5" y1="155" x2="215.5" y2="169" class="f-line f-muted" stroke-width="2"/>
  <circle cx="238.8" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="238.8" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="270.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="270.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="282.0" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="282.0" y="133" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="306.3" cy="153" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="306.3" y="144" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="224.3" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="207.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="227.0" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="239.6" cy="171" r="4" class="f-ink" opacity="0.75"/>
  <text x="239.6" y="189" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лучшая бесплатная 33,3</text>
  <text x="108" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ArguAna</text>
  <line x1="120" y1="232" x2="660" y2="232" class="f-line f-muted" opacity="0.4"/>
  <line x1="286.1" y1="225" x2="286.1" y2="239" class="f-line f-muted" stroke-width="2"/>
  <circle cx="331.5" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="331.5" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="362.1" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="362.1" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="363.0" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="363.0" y="203" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="382.8" cy="223" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="382.8" y="214" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="391.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="382.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="324.3" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="393.5" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="358.7" cy="241" r="4" class="f-ink" opacity="0.75"/>
  <text x="393.5" y="259" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лучшая бесплатная 50,4</text>
  <text x="108" y="306" text-anchor="end" class="f-mono f-ink" style="font-size:12px">FiQA</text>
  <line x1="120" y1="302" x2="660" y2="302" class="f-line f-muted" opacity="0.4"/>
  <line x1="135.0" y1="295" x2="135.0" y2="309" class="f-line f-muted" stroke-width="2"/>
  <circle cx="285.6" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="285.6" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">S</text>
  <circle cx="319.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="319.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">M</text>
  <circle cx="346.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="346.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">L</text>
  <circle cx="400.8" cy="293" r="5" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <text x="400.8" y="284" text-anchor="middle" class="f-label f-accent" style="font-size:11px">XL</text>
  <circle cx="271.8" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="267.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="210.2" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="379.1" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <circle cx="389.6" cy="311" r="4" class="f-ink" opacity="0.75"/>
  <text x="389.6" y="329" text-anchor="middle" class="f-label f-ink" style="font-size:11px">лучшая бесплатная 50,0</text>
  <line x1="120" y1="352" x2="120" y2="356" class="f-line f-muted"/><text x="120" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">20</text>
  <line x1="210" y1="352" x2="210" y2="356" class="f-line f-muted"/><text x="210" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">30</text>
  <line x1="300" y1="352" x2="300" y2="356" class="f-line f-muted"/><text x="300" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">40</text>
  <line x1="390" y1="352" x2="390" y2="356" class="f-line f-muted"/><text x="390" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">50</text>
  <line x1="480" y1="352" x2="480" y2="356" class="f-line f-muted"/><text x="480" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">60</text>
  <line x1="570" y1="352" x2="570" y2="356" class="f-line f-muted"/><text x="570" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">70</text>
  <line x1="660" y1="352" x2="660" y2="356" class="f-line f-muted"/><text x="660" y="370" text-anchor="middle" class="f-label f-muted" style="font-size:11px">80</text>
</svg>
<figcaption>Буквы это 4 размера OpenAI из таблицы 6 статьи. Точки это бесплатные модели, подписана лучшая из них на этом наборе.</figcaption>
</figure>

В среднем догадка подтвердилась, у нижнего края вилки. XL на этих 4 наборах даёт 52,7. Лучшая из бесплатных моделей по отдельности, `all-mpnet-base-v2`, даёт 48,8. Это на 3,9 пункта ниже и на 2,4 выше S. Если против S брать лучшую бесплатную модель на каждом наборе, бесплатные выигрывают на ArguAna и FiQA. На NFCorpus у `all-mpnet-base-v2` 33,29 против 33,2, это я считаю ничьей. На SciFact бесплатные проигрывают.

Но среднее сложено из очень разных строк. На SciFact у XL 75,4, а у `all-mpnet-base-v2` 65,6, почти на 10 пунктов меньше. На NFCorpus 40,7 против 33,3.

ArguAna показывает обратную картину. `multi-qa-mpnet-base-dot-v1` получает 50,4, а `all-MiniLM-L6-v2` 50,2. Из 4 размеров OpenAI лучший M, 49,2, а худший XL, 43,5. Это в собственной таблице OpenAI. Здесь запрос это целый аргумент, а ответ это аргумент против него. Предполагаю, что это задача другого рода, не поиск ответа на вопрос, но этого я не проверял. В той же таблице XL ниже S ещё на Quora и на `TREC-COVID`. Их я не гонял.

Больше всего меня удивила FiQA. `multi-qa-mpnet-base-dot-v1` досчитала там первой, с 48,8 против 51,2 у XL, то есть выше L. Это выглядело слишком хорошо, поэтому я открыл список того, на чём модель училась. Там есть пары из заголовка и ответа с money.stackexchange.com. FiQA собрана с того же сайта. Эти пары есть в обучении у 4 из 5 моих бесплатных моделей, у всех, кроме TAS-B. Авторы выложили эти пары, для этого сайта их 29404. Я сравнил. 532 из 648 тестовых вопросов FiQA стоят там заголовками. В паре к ним идёт ответ, который FiQA размечает как релевантный.

Я чуть не оставил `all-mpnet-base-v2` без FiQA, потому что там ей нужно 3,8 часа даже на быстрой установке. Она досчитала с 50,0. Это лучший бесплатный результат на FiQA и на 1,2 ниже XL. В её обучающих данных те же пары.

Я ждал, что на остальных 116 вопросах результат упадёт. Он почти не сдвинулся: 48,6 против 48,8 у `multi-qa-mpnet-base-dot-v1`, 48,3 против 50,3 у `all-mpnet-base-v2`. Но и 116 не чистые. 72 из них там тоже заголовки, но с другим ответом. Ещё у 5 релевантный ответ есть среди пар. Только 39 вопросов не встречаются ни тем, ни другим способом. На них 2 модели дают 44,8 и 43,4. TAS-B, которая этого сайта не видела, даёт там 31,7 против 29,9 на остальных 609. Значит, отрыв `all-mpnet-base-v2` от TAS-B 12 пунктов на 39 вопросах и 20 на остальных. На 39 вопросах его стандартная ошибка около 6. При таком малом числе вопросов я не могу сказать, помогает ли пересечение. OpenAI пишет, что их модели учились на данных из интернета, так что те же страницы могли быть и у них.

## Сколько это стоит

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="Корпуса и тестовые запросы всех 4 наборов, 15,0 миллиона токенов. Ada $120,29, среднее nDCG@10 46,5. Babbage $180,43, среднее nDCG@10 49,6. Curie $902,16, среднее nDCG@10 51,1. Davinci $9 021,57, среднее nDCG@10 52,7. all-mpnet на моём CPU $0, среднее nDCG@10 48,8.">
  <text x="10" y="16" class="f-label f-muted">Корпуса и тестовые запросы всех 4 наборов, 15,0 миллиона токенов</text>
  <text x="670" y="30" text-anchor="end" class="f-label f-muted" style="font-size:11px">среднее nDCG@10</text>
  <text x="220" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Ada (S)</text>
  <rect x="230" y="37" width="4.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="240.0" y="49" class="f-label f-ink">$120,29</text>
  <text x="670" y="49" text-anchor="end" class="f-mono f-ink" style="font-size:12px">46,5</text>
  <text x="220" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Babbage (M)</text>
  <rect x="230" y="67" width="6.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="242.0" y="79" class="f-label f-ink">$180,43</text>
  <text x="670" y="79" text-anchor="end" class="f-mono f-ink" style="font-size:12px">49,6</text>
  <text x="220" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Curie (L)</text>
  <rect x="230" y="97" width="30.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="266.0" y="109" class="f-label f-ink">$902,16</text>
  <text x="670" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:12px">51,1</text>
  <text x="220" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Davinci (XL)</text>
  <rect x="230" y="127" width="300.0" height="16" class="f-accent" opacity="0.8"/>
  <text x="536.0" y="139" class="f-label f-ink">$9 021,57</text>
  <text x="670" y="139" text-anchor="end" class="f-mono f-ink" style="font-size:12px">52,7</text>
  <line x1="10" y1="156" x2="670" y2="156" class="f-line f-muted" opacity="0.4"/>
  <text x="220" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">all-mpnet на моём CPU</text>
  <text x="236" y="175" class="f-label f-ink">$0</text>
  <text x="670" y="175" text-anchor="end" class="f-mono f-ink" style="font-size:12px">48,8</text>
</svg>
<figcaption>Цены со страницы OpenAI на конец апреля 2022 года, токены посчитаны токенизатором GPT-2. Размеры сопоставлены моделям API по длине вектора. Среднее по тем же 4 наборам, у OpenAI из их статьи, у лучшей одиночной бесплатной модели из моего прогона.</figcaption>
</figure>

Токены я считал токенизатором GPT-2 и обрезал документы до 2040 токенов. Эту обрезку Реймерс упоминает в дополнении к своему посту. Она из скрипта, который позже дал автор статьи. Цены со страницы OpenAI на конец апреля: $0,008 за 1000 токенов на Ada и $0,60 на Davinci, в 75 раз дороже. Корпуса и тестовые запросы всех 4 наборов это 15,0 миллиона токенов. Это $120,29 на Ada и $9021,57 на Davinci. Из них $5960 приходится на одну FiQA.

Davinci даёт 12288 чисел на документ. Во float32 векторы FiQA занимают 2,8 ГБ, против 89 МБ у MiniLM с её 384 числами.

За бесплатные модели платишь процессорным временем. `all-MiniLM-L6-v2` закодировала SciFact за 11 минут на той же версии 2.2.0 и тех же 4 ядрах. На быстрой установке 3 модели с 768 числами шли на SciFact в 6, а то и в 16 раз дольше MiniLM.

Так что выбор зависит от того, на что похожи мои заметки. Если на SciFact, XL в статье примерно на 10 пунктов nDCG@10 выше лучшей бесплатной. Закодировать одну SciFact на Davinci стоит $1015,80. Выходит около $1000 за 5000 аннотаций. Если на ArguAna, `all-MiniLM-L6-v2` с 22 миллионами параметров отстаёт от лучшей бесплатной на 0,2 и при этом обходит все размеры OpenAI. Узнаю я это, только когда напишу небольшой набор вопросов с размеченными ответами по своим заметкам. Для своего поиска я такого не делал ни разу.

## Чего я не проверял

- Сам API. Реймерс получил через API на FiQA не то, что в статье. Потом он нашёл причину в том, как режутся длинные тексты. Модели за API могли и поменяться со времени статьи.
- 7 из 11 наборов таблицы, в том числе Quora и `TREC-COVID`, где XL проигрывает S. На 4 ядрах это заняло бы недели для MiniLM и месяцы для больших моделей.
- Пересечение с обучающими данными на остальных 3 наборах. Я смотрел только FiQA, потому что её число выглядело подозрительно.
- Реранкеры и SPLADE. В статье у SPLADE v2 в среднем по 11 наборам 52,7, на 0,1 ниже XL.
