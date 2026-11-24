---
title: "85% входных токенов агента ушло на одну шапку, отправленную 1253 раза"
description: "Я собрал заново все промпты двух опубликованных прогонов агента ReAct и посчитал токены. В FEVER 84,9% входа это одна и та же шапка, повторно отправленная история 13,3%. В WebShop скользящее окно потеряло задачу, а в длинном чате gpt-4 обрезка на пределе контекста вышла в 7,9 раза дороже нового чата на каждую задачу."
date: 2023-04-02
lang: ru
translationKey: agent-token-budget
tags: ["llm", "agents", "numbers"]
---

1 172 161 токен. Таков весь вход ноутбука FEVER из репозитория ReAct, если прогнать tiktoken (cl100k_base) по каждому промпту: 500 утверждений, 1253 вызова. Потом я посчитал отдельно шапку, то есть строчку инструкции и 3 разобранных примера, которые цикл подставляет в начало каждого вызова. На неё пришлось 994 882.

Цену агента я всегда объяснял треугольником. Модель между вызовами ничего не помнит, поэтому второй вызов заново везёт первый шаг, третий первый и второй, а счёт растёт как квадрат числа шагов. Картинка верная, но чисел я к ней ни разу не подставлял. До прогона я записал ожидание: больше половины входа это повторно отправленная история. Вышло 13,3%.

Сам треугольник всем известен и лекарства от него уже есть. В LangChain 0.0.128 одна память держит последние 5 пар реплик, другая после 2000 токенов заменяет старые сообщения сводкой. Мне хотелось понять, сколько там вообще можно отрезать.

## Что я считал

В репозитории ReAct (Yao и соавторы, коммит 245c1aa от 30 марта) лежат логи двух агентов, FEVER и WebShop, по 500 эпизодов на `text-davinci-002`. В логе есть ответы модели и ответы среды. Поэтому я собрал каждый промпт заново ровно так, как его собирает код ноутбука. API при этом не вызывал. Python 3.11, tiktoken 0.3.3.

В p50k_base по нынешним 0,02 доллара за 1000 токенов прогон FEVER стоит 24,41 доллара, WebShop 70,07. Для чат-моделей я посчитал те же тексты в cl100k_base и добавил 7 или 8 служебных токенов на сообщение, как это делает OpenAI Cookbook. Цены взяты со страницы тарифов этих дней: gpt-4 8K 0,03 за вход и 0,06 за выход, gpt-3.5-turbo 0,002 в обе стороны. FEVER тогда стоит 37,76 или 2,44 доллара. Настоящий gpt-4 написал бы другие мысли, так что это цена именно этого текста.

## Квадрату негде вырасти

Пусть P это шапка, q задача, d прибавка за один шаг. Тогда n вызовов везут n(P+q) + d·n(n−1)/2 токенов. Второе слагаемое догоняет первое при n = 1 + 2(P+q)/d.

В FEVER P равно 794, q 13, а повторно отправленный шаг d в среднем 152, получается 11,6 вызова. Цикл в ноутбуке останавливается после 7 шагов, а медианному эпизоду хватает 2 вызовов. Даже в 14 эпизодах, где вызовов ровно 7, история занимает 19,2% входа. У WebShop шапка короче, 523 токена с одним примером, задача 41 токен, шаг в среднем 80. Пересечение на 15,1 вызова, а цикл обрывается на 15. Там история за весь прогон занимает 36,2%. Шапка 59,2%.

<figure class="fig">
<svg viewBox="0 0 680 286" role="img" aria-label="Средний размер одного вызова в токенах по номеру вызова: шапка с задачей и повторно отправленная история. FEVER: 1: 811 + 0; 2: 811 + 188; 3: 813 + 213; 4: 812 + 239; 5: 811 + 276; 6: 811 + 322; 7: 811 + 372. WebShop: 1: 563 + 0; 2: 563 + 188; 3: 563 + 234; 4: 563 + 372; 5: 563 + 421; 6: 563 + 451; 7: 563 + 475; 8: 563 + 508; 9: 563 + 551; 10: 563 + 587; 11: 563 + 633; 12: 563 + 681; 13: 563 + 717; 14: 563 + 764; 15: 563 + 791. Шапка везде одного размера, история становится больше неё только с 10-го вызова WebShop.">
  <line x1="60" y1="240.0" x2="260" y2="240.0" class="f-plain"/>
  <text x="54.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="188.6" x2="260" y2="188.6" class="f-plain"/>
  <text x="54.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="60" y1="137.1" x2="260" y2="137.1" class="f-plain"/>
  <text x="54.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="60" y1="85.7" x2="260" y2="85.7" class="f-plain"/>
  <text x="54.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1200</text>
  <rect x="64.6" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="74.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="93.1" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="93.1" y="111.6" width="19.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="102.9" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="121.7" y="135.5" width="19.4" height="104.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.7" y="108.1" width="19.4" height="27.4" style="fill:var(--accent);stroke:none"/>
  <text x="131.4" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="150.3" y="135.6" width="19.4" height="104.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="150.3" y="104.9" width="19.4" height="30.7" style="fill:var(--accent);stroke:none"/>
  <text x="160.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="178.9" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="178.9" y="100.2" width="19.4" height="35.5" style="fill:var(--accent);stroke:none"/>
  <text x="188.6" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="207.4" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="207.4" y="94.3" width="19.4" height="41.4" style="fill:var(--accent);stroke:none"/>
  <text x="217.1" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="236.0" y="135.7" width="19.4" height="104.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="236.0" y="87.9" width="19.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="245.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <text x="60.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">FEVER</text>
  <line x1="330" y1="240.0" x2="670" y2="240.0" class="f-plain"/>
  <text x="324.0" y="244.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="330" y1="188.6" x2="670" y2="188.6" class="f-plain"/>
  <text x="324.0" y="192.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">400</text>
  <line x1="330" y1="137.1" x2="670" y2="137.1" class="f-plain"/>
  <text x="324.0" y="141.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">800</text>
  <line x1="330" y1="85.7" x2="670" y2="85.7" class="f-plain"/>
  <text x="324.0" y="89.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1200</text>
  <rect x="333.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="341.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1</text>
  <rect x="356.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="356.3" y="143.4" width="15.4" height="24.2" style="fill:var(--accent);stroke:none"/>
  <text x="364.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2</text>
  <rect x="379.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="379.0" y="137.5" width="15.4" height="30.1" style="fill:var(--accent);stroke:none"/>
  <text x="386.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">3</text>
  <rect x="401.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="401.6" y="119.8" width="15.4" height="47.8" style="fill:var(--accent);stroke:none"/>
  <text x="409.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">4</text>
  <rect x="424.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="424.3" y="113.5" width="15.4" height="54.1" style="fill:var(--accent);stroke:none"/>
  <text x="432.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">5</text>
  <rect x="447.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="447.0" y="109.6" width="15.4" height="58.0" style="fill:var(--accent);stroke:none"/>
  <text x="454.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">6</text>
  <rect x="469.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="469.6" y="106.5" width="15.4" height="61.1" style="fill:var(--accent);stroke:none"/>
  <text x="477.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">7</text>
  <rect x="492.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="492.3" y="102.3" width="15.4" height="65.3" style="fill:var(--accent);stroke:none"/>
  <text x="500.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">8</text>
  <rect x="515.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="515.0" y="96.8" width="15.4" height="70.8" style="fill:var(--accent);stroke:none"/>
  <text x="522.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">9</text>
  <rect x="537.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="537.6" y="92.1" width="15.4" height="75.5" style="fill:var(--accent);stroke:none"/>
  <text x="545.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="560.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="560.3" y="86.2" width="15.4" height="81.4" style="fill:var(--accent);stroke:none"/>
  <text x="568.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">11</text>
  <rect x="583.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="583.0" y="80.1" width="15.4" height="87.6" style="fill:var(--accent);stroke:none"/>
  <text x="590.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">12</text>
  <rect x="605.6" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="605.6" y="75.4" width="15.4" height="92.2" style="fill:var(--accent);stroke:none"/>
  <text x="613.3" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">13</text>
  <rect x="628.3" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="628.3" y="69.4" width="15.4" height="98.2" style="fill:var(--accent);stroke:none"/>
  <text x="636.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">14</text>
  <rect x="651.0" y="167.6" width="15.4" height="72.4" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="651.0" y="65.9" width="15.4" height="101.7" style="fill:var(--accent);stroke:none"/>
  <text x="658.7" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">15</text>
  <text x="330.0" y="46.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">WebShop</text>
  <text x="60.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">номер вызова</text>
  <text x="330.0" y="276.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">номер вызова</text>
  <rect x="60.0" y="8.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="78.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">шапка и задача</text>
  <rect x="260.0" y="8.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="278.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">история</text>
  <text x="670.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">токенов на вызов</text>
</svg>
<figcaption>Средний размер промпта по номеру вызова, токены cl100k_base. Далеко доходят немногие: в FEVER начинают 500 эпизодов, до 7-го вызова доходят 15, в WebShop до 15-го доходят 35.</figcaption>
</figure>

В ценах gpt-4 из 37,76 доллара за FEVER шапка стоит 29,85, а история 4,67. Идеальная и бесплатная память сэкономила бы 12%. Если выкинуть самый длинный из 3 примеров, а это 315 токенов, экономия будет 11,84 доллара. Что при этом станет с точностью, не знаю. В статье про ReAct сказано только, что от добавления примеров лучше не стало.

Ещё одна вещь, поменьше. 35 эпизодов WebShop, это 7%, дошли до предела в 15 вызовов, получили нулевую награду и съели 18,1% входных токенов прогона. За ответ на 15-й вызов заплачено, но его никто не использует.

## Окно, которое забывает задачу

В ноутбуке WebShop скользящее окно уже стоит: `prompt[-(6400-len(init_prompt)):]`. Оно оставляет шапку и последние 4614 символов диалога. За 3472 вызова окно что-то отрезало 5 раз в 2 эпизодах и сэкономило 9 центов. Но диалог начинается с задачи, поэтому первой вылетает именно она. В одном эпизоде срезана часть строки с задачей, в другом вся.

В эпизоде 114 просят рулонные шторы размером w45*h56, пастельно-голубые, дешевле 90 долларов. Агент открывает страницу товара на 6973 символа, из них 6531 это список из 350 размеров. Цена в самом низу, 66,9 доллара. После обрезки нет ни задачи, ни поискового запроса. Модель пишет `think[The price is over 50 dollars.]`. На следующем вызове окно начинается ровно с `[w39 x h64 (inch)]`. Его модель и нажимает, а потом покупает. `[w45 x h56 (inch)]` в окне ещё оставался. Оценка 0,6. Как лимит цены число 50 есть только в шапке, в примере про дезодорант.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="WebShop, эпизод 114, вызов 4. Диалог длиной 8068 символов начинается с задачи: размер w45*h56, до 90 долларов. Окно оставляет последние 4614 символов, все они со страницы товара. Впереди приклеена шапка с примером про дезодорант, до 50 долларов. Модель отвечает, что цена больше 50 долларов.">
  <text x="40.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">диалог, 8068 символов</text>
  <text x="40.0" y="40.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">задача: w45*h56, до 90</text>
  <line x1="45" y1="45" x2="45" y2="56" class="f-line"/>
  <rect x="40.0" y="58.0" width="256.9" height="34.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="296.9" y="58.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <rect x="40.0" y="58.0" width="11.7" height="34.0" style="fill:var(--accent);stroke:none"/>
  <line x1="120.8" y1="54" x2="120.8" y2="96" class="f-line"/>
  <text x="640.0" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">страница товара, 6973 символа</text>
  <text x="40.0" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">отрезано: 3454</text>
  <text x="640.0" y="110.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">осталось: 4614</text>
  <line x1="296.9" y1="54" x2="296.9" y2="148" class="f-line" stroke-dasharray="4 4"/>
  <text x="640.0" y="142.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">ушло модели, 6400 символов</text>
  <rect x="164.0" y="150.0" width="132.8" height="34.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="296.9" y="150.0" width="343.1" height="34.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="164.0" y="142.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">шапка, 1786</text>
  <text x="164.0" y="202.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">пример: до 50</text>
  <text x="640.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">остаток страницы товара</text>
  <text x="40.0" y="236.0" text-anchor="start" class="f-mono f-ink" style="font-size:12px">ответ: think[The price is over 50 dollars.]</text>
</svg>
<figcaption>Эпизод 114 в WebShop, вызов 4, масштаб в символах. Единственный лимит цены, который остался в промпте, взят из примера.</figcaption>
</figure>

Вывод у меня был готов: без своей задачи агент берёт лимит из примера. Остальные эпизоды его ослабили. В задачах с другим лимитом мысли 328 раз называют правильное число. А 50 долларов они называют 26 раз в 22 эпизодах. В 21 из них ничего не отрезано. В одной задаче лимит был 40, а в мысли стоит "the price is 46.99 dollars which is lower than 50.00 dollars". Этот товар агент тоже купил. Опечатка "less then" из примера попала в 215 мыслей, хотя ни в одной задаче её нет. Так что шапка протекает и тогда, когда задача целиком перед глазами. Какая из двух причин дала 50 долларов в эпизоде 114, я сказать не могу.

## Длинный чат

Чтобы увидеть квадрат, его пришлось построить. Я поставил 500 задач FEVER подряд в один чат с шапкой наверху и каждый раз отправлял всё целиком. Без 3 повторных это 1250 вызовов. Контекст gpt-4 на 8K кончается посреди 27-й задачи, я ожидал меньше 20. На 1000 случайных порядков медиана 26 законченных задач, в 90% порядков от 23 до 29. Эти 26 задач стоят 7,98 доллара, а если каждой дать новый чат, то 1,95. На gpt-4-32k с двойной ценой выходит так: 10 задач 3,78 доллара, 20 задач 10,39, 40 задач 33,54, 80 задач 140,89.

Потом я прогнал все 500 задач с разными способами экономии. Сводку я принял за 150 токенов, инструкцию к ней за 60, потому что самих сводок никто не писал. Окно всегда держит текущее утверждение.

<figure class="fig">
<svg viewBox="0 0 680 252" role="img" aria-label="Стоимость в долларах 500 задач FEVER в одном чате gpt-4 при разных способах: новый чат на задачу 37,50; окно 250 токенов 38,62; окно 500 47,66; сводка раз в 3 шага 53,40; окно 1000 66,35; окно 2000 103,48; сводка раз в 50 шагов 143,53; окно 4000 176,40; резать на пределе 294,77. Одна шапка в каждом из них это 29,78.">
  <text x="210.0" y="27.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новый чат на задачу</text>
  <rect x="220.0" y="14.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="14.0" width="9.8" height="18.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="275.5" y="27.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">37,50</text>
  <text x="210.0" y="53.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">окно 250 токенов</text>
  <rect x="220.0" y="40.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="40.0" width="11.2" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="276.9" y="53.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">38,62</text>
  <text x="210.0" y="79.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">окно 500</text>
  <rect x="220.0" y="66.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="66.0" width="22.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="288.4" y="79.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">47,66</text>
  <text x="210.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">сводка раз в 3 шага</text>
  <rect x="220.0" y="92.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="92.0" width="29.9" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="295.6" y="105.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">53,40</text>
  <text x="210.0" y="131.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">окно 1000</text>
  <rect x="220.0" y="118.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="118.0" width="46.3" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="312.0" y="131.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">66,35</text>
  <text x="210.0" y="157.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">окно 2000</text>
  <rect x="220.0" y="144.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="144.0" width="93.4" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="359.1" y="157.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">103,48</text>
  <text x="210.0" y="183.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">сводка раз в 50 шагов</text>
  <rect x="220.0" y="170.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="170.0" width="144.1" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="409.8" y="183.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">143,53</text>
  <text x="210.0" y="209.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">окно 4000</text>
  <rect x="220.0" y="196.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="196.0" width="185.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="451.4" y="209.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">176,40</text>
  <text x="210.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">резать на пределе</text>
  <rect x="220.0" y="222.0" width="37.7" height="18.0" style="fill:var(--ink);opacity:0.75;stroke:none"/>
  <rect x="257.7" y="222.0" width="335.7" height="18.0" style="fill:var(--accent);opacity:0.35;stroke:none"/>
  <text x="601.4" y="235.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">294,77</text>
</svg>
<figcaption>500 задач FEVER по ценам gpt-4 8K, доллары. Тёмная часть это шапка, в каждой строке одни и те же 29,78.</figcaption>
</figure>

Нижняя строка это то, что я бы написал не задумываясь: выбрасывать самые старые сообщения, когда запрос не влезает. Ничего не падает и счёт линейный, но каждый вызов стоит около 0,24 доллара, потому что контекст всё время почти полон. Итого 294,77 доллара, в 7,9 раза дороже нового чата на каждую задачу.

Сводка оказалась лучше, чем я думал. Сжатие H токенов в s с инструкцией i окупается через (H + i + rs)/(H − s) следующих вызовов, где r это цена выхода, делённая на цену входа. Для 1000 токенов в 150 на gpt-4 выходит 1,6 вызова. Я записывал 5. Лучший период равен корню из 2(i + (1+r)s)/d шагов, тот же корень, что в старой формуле Харриса для оптимального размера заказа. В длинном чате один вызов прибавляет 111,5 токена (тут считаются и короткие последние шаги), так что с 7 служебными токенами внутри i формула даёт 3,05, а симуляция 3. Но за 500 задач набирается 416 сводок, каждая сделана из предыдущей. Что остаётся от факта после десятой, я не мерил. И всё равно это 53,40 доллара против 37,50 за новый чат каждый раз.

## Чего я не проверял

Прежде всего качество. Всё это арифметика по старым логам. Задачи FEVER друг от друга не зависят, поэтому новый чат там ничего не теряет, а в настоящем разговоре потерял бы. Шаги тут короткие. Агент, который читает файлы по 2000 токенов, с шапкой FEVER приходит к пересечению уже на втором вызове (1,8 по формуле). Там мой треугольник работает. Если код в ноутбуке не совсем тот, что печатал лог, 5 обрезок могут сдвинуться. Для 35 вызовов ответа в логе нет и я считал его нулевым, это не больше 7 центов.

Дальше хочу посмотреть, что короткая шапка делает с точностью. Тут уже без API не обойтись.
