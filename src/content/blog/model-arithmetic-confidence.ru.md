---
title: "GPT-2 считает, что 94 плюс 4 это 108. Уверенность 1,4 %"
description: "GPT-2 трёх размеров на 1500 арифметических задачах каждая, в формате из статьи про GPT-3. Она права примерно в 1 случае из 100. Её собственные вероятности говорят то же: в среднем от 1,4 до 1,6 % на напечатанный ответ. Переуверенность, которую я ждал, оказалась в напечатанном тексте, а он выглядит одинаково у верного и неверного ответа."
date: 2020-07-18
lang: ru
translationKey: model-arithmetic-confidence
tags: ["llm", "machine-learning", "numbers"]
---
В конце мая OpenAI выложила статью про GPT-3. Одну таблицу в ней я перечитал несколько раз. С 50 решёнными примерами в промпте модель на 175B складывает двузначные числа верно в 100 % случаев. На трёхзначных у неё 80,4 %. Самая маленькая модель из той же таблицы, 125M параметров, на том же двузначном сложении набирает 2 %. С тех пор те, кто получил доступ к API, выкладывают демо GPT-3, но весов нет в открытом доступе, а API это закрытая бета. Сам я ничего из этого проверить не могу.

Проверить я могу GPT-2. Её веса OpenAI выложила в прошлом году. Маленькая версия на 124M параметров примерно того же размера, что самая маленькая GPT-3. А ещё у меня был вопрос, на который статья не отвечает. Когда модель ошибается, знает ли она об этом?

Я был уверен, что нет. Неверный ответ выходит ровно в том же виде, что верный: "A: 108", без всяких "кажется" и "примерно". К тому же Guo с соавторами в 2017 году показали, что современные классификаторы картинок переуверены. Я ждал того же. До этого я ни разу не смотрел на вероятности, которые стоят за напечатанным ответом, только на текст. Прежде чем что-то считать, я записал ожидание. На неверных ответах модель должна давать своему ответу больше 30 % вероятности. Её средняя уверенность должна быть хотя бы на 20 пунктов выше точности.

## Как мерил

Формат промпта взят из статьи про GPT-3: "Q: What is 94 plus 4?", перевод строки и "A:". Перед вопросом идут 5 решённых примеров того же вида, в статье их было 50. Задачи: сложение и вычитание двузначных и трёхзначных чисел плюс умножение двузначных. На каждый вид 300 случайных задач с фиксированным сидом. Я прогнал 3 размера GPT-2, 124M, 355M и 774M параметров, оригинальные веса во float32 на CPU. Декодировка жадная: на каждом шаге модель берёт самый вероятный токен, пока не напишет перевод строки.

Уверенность здесь это вероятность всего напечатанного ответа, то есть числа и перевода строки после него, перемноженная по токенам. Отдельно я беру вероятность верного ответа, чтобы видеть, насколько далеко от ответа была правда. Числа GPT-2 режет на токены неровно. " 98" и " 108" это по одному токену, " 517" это " 5" и "17". А " 1944" снова один токен, видимо потому, что это год.

Первый прогон потерял все отрицательные ответы. Минус GPT-2 пишет отдельным токеном " -", а цифры идут следом. Мой парсер ждал, что число начнётся с цифры, поэтому каждый отрицательный ответ превращался в "не число". Заметил я это только на тестовом прогоне из 20 задач, где каждый ответ с минусом вернулся пустым.

## Считает плохо

Из 1500 задач маленькая модель ответила верно 14 раз, средняя 10, большая 13. На двузначном сложении у маленькой 1,3 %. Это близко к 2 % у самой маленькой GPT-3 из статьи. Модель в 6 раз крупнее не помогла совсем: 774M ошибается так же часто, как 124M.

Большинство верных ответов приходится на лёгкие задачи. В 10 из 14 у маленькой модели одно из чисел 0 или 1, например 0 умножить на 13 или 796 плюс 0. Неверные ответы тоже не похожи на небольшие промахи. Только около 10 % из них отстоят от правды не больше чем на 10. Последняя цифра совпадает примерно в 11 % из них, а случайное число угадало бы её в 10 %. В статье про GPT-3 написано, что большая модель часто забывает перенести единицу. GPT-2 до такой ошибки обычно просто не добирается.

## Уверенность

Средняя уверенность трёх моделей от 1,4 до 1,6 %. Всего у трёх моделей 4463 неверных ответа. Только у 2 из них уверенность выше 50 %, а выше 90 % нет ни у одного. Модель права примерно в 1 случае из 100 и её собственные вероятности говорят примерно то же. Разрыв между средней уверенностью и точностью от 0,6 до 0,7 пункта, а я ждал хотя бы 20.

<figure class="fig">
<svg viewBox="0 0 680 340" role="img" aria-label="10 самых вероятных первых токенов GPT-2 774M после &quot;Q: What is 94 plus 4? A:&quot;, перед вопросом 5 решённых примеров. 108: 1,43 %. 111: 1,33 %. 110: 1,31 %. 104: 1,31 %. 109: 1,22 %. 115: 1,22 %. 114: 1,19 %. 105: 1,17 %. 99: 1,16 %. 103: 1,13 %. Верный ответ 98 на 15 месте с 1,05 %. Все токены, с которых начинается число, вместе получают 99,4 %.">
  <text x="20.0" y="18.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">Q: What is 94 plus 4?  A: …</text>
  <text x="44.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#1</text>
  <text x="98.0" y="44.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">108</text>
  <rect x="110" y="33" width="403.5" height="14" class="f-accent"/>
  <text x="519.5" y="44.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">1,43 %</text>
  <text x="575.5" y="44.0" text-anchor="start" class="f-label f-accent" style="font-size:11px">← напечатано</text>
  <text x="44.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#2</text>
  <text x="98.0" y="66.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">111</text>
  <rect x="110" y="55" width="373.2" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="489.2" y="66.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,33 %</text>
  <text x="44.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#3</text>
  <text x="98.0" y="88.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">110</text>
  <rect x="110" y="77" width="368.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="484.4" y="88.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,31 %</text>
  <text x="44.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#4</text>
  <text x="98.0" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">104</text>
  <rect x="110" y="99" width="367.4" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="483.4" y="110.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,31 %</text>
  <text x="44.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#5</text>
  <text x="98.0" y="132.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">109</text>
  <rect x="110" y="121" width="344.1" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="460.1" y="132.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,22 %</text>
  <text x="44.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#6</text>
  <text x="98.0" y="154.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">115</text>
  <rect x="110" y="143" width="343.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="459.9" y="154.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,22 %</text>
  <text x="44.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#7</text>
  <text x="98.0" y="176.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">114</text>
  <rect x="110" y="165" width="334.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="450.5" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,19 %</text>
  <text x="44.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#8</text>
  <text x="98.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">105</text>
  <rect x="110" y="187" width="330.5" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="446.5" y="198.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,17 %</text>
  <text x="44.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#9</text>
  <text x="98.0" y="220.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">99</text>
  <rect x="110" y="209" width="326.9" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="442.9" y="220.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,16 %</text>
  <text x="44.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#10</text>
  <text x="98.0" y="242.0" text-anchor="end" class="f-mono f-muted" style="font-size:13px">103</text>
  <rect x="110" y="231" width="317.0" height="14" class="f-muted" style="opacity:0.45"/>
  <text x="433.0" y="242.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,13 %</text>
  <text x="70.0" y="264.0" text-anchor="middle" class="f-mono f-muted" style="font-size:13px">…</text>
  <text x="116.0" y="264.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">ещё 4</text>
  <text x="44.0" y="286.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">#15</text>
  <text x="98.0" y="286.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">98</text>
  <rect x="110" y="275" width="295.7" height="14" class="f-ink"/>
  <text x="411.7" y="286.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">1,05 %</text>
  <text x="467.7" y="286.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">← верный ответ</text>
  <line x1="110" y1="26" x2="110" y2="296" class="f-line"/>
  <text x="110.0" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,0 %</text>
  <text x="250.6" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0,5 %</text>
  <text x="391.3" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,0 %</text>
  <text x="531.9" y="310.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1,5 %</text>
  <text x="335.0" y="328.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">вероятность токена</text>
</svg>
<figcaption>GPT-2 774M, float32, 5 примеров в промпте, первая задача набора. Вероятности первого токена ответа. Жадная декодировка печатает самый вероятный, 108. Верный ответ 98 на 15 месте. Токены, с которых начинается число, вместе держат 99,4 % вероятности, размазанной по множеству кандидатов.</figcaption>
</figure>

На рисунке первая задача набора, 94 плюс 4, у модели на 774M. Она напечатала 108. Как первый токен ответа 108 имело вероятность 1,43 %. Сразу за ним идут 111 с 1,33 и 110 с 1,31. Верный ответ 98 на 15 месте с 1,05. На "какое-то число" модель кладёт 99,4 % вероятности и размазывает её по всему, что около 100. Сумма двух чисел, каждое из которых меньше 100, в среднем как раз около 100. К тому же 3 из 5 ответов в примерах этого промпта равны 93, 101 и 104. Какая из двух причин важнее, я не проверял. Но похоже, что модель угадывает размер ответа, а не складывает.

Видимость уверенности, которую я ждал, берётся из декодировки. Жадная декодировка выбирает 1,43 против 1,33 и печатает победителя так же, как напечатала бы верный ответ. Почти 99 %, ушедших на другие варианты, в тексте не видно.

На рисунке 2 то же самое по всем задачам. У каждого размера медианная вероятность того, что ответ начнётся с числа, от 99,1 до 99,3 %. Во всех 4500 случаях самый вероятный первый токен это число. На двузначном сложении моделям нужно от 45 до 48 разных чисел, чтобы набрать половину этой вероятности.

<figure class="fig">
<svg viewBox="0 0 680 346" role="img" aria-label="Для каждого размера GPT-2 по 1500 задачам: медианная вероятность того, что ответ начнётся с числа, средняя вероятность напечатанного ответа и доля верных ответов. GPT-2 124M: ответ будет числом 99,2 %, уверенность в своём ответе 1,6 %, верные ответы 0,9 %. GPT-2 355M: ответ будет числом 99,1 %, уверенность в своём ответе 1,4 %, верные ответы 0,7 %. GPT-2 774M: ответ будет числом 99,3 %, уверенность в своём ответе 1,4 %, верные ответы 0,9 %.">
  <text x="20.0" y="32.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 124M</text>
  <text x="220.0" y="51.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">ответ будет числом</text>
  <rect x="230" y="40" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="40" width="367.0" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="51.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,2 %</text>
  <text x="220.0" y="71.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">уверенность в своём ответе</text>
  <rect x="230" y="60" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="60" width="6.0" height="14" class="f-accent"/>
  <text x="608.0" y="71.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,6 %</text>
  <text x="220.0" y="91.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">верные ответы</text>
  <rect x="230" y="80" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="80" width="3.5" height="14" class="f-ink"/>
  <text x="608.0" y="91.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,9 %</text>
  <text x="20.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 355M</text>
  <text x="220.0" y="157.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">ответ будет числом</text>
  <rect x="230" y="146" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="146" width="366.9" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="157.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,1 %</text>
  <text x="220.0" y="177.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">уверенность в своём ответе</text>
  <rect x="230" y="166" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="166" width="5.1" height="14" class="f-accent"/>
  <text x="608.0" y="177.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,4 %</text>
  <text x="220.0" y="197.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">верные ответы</text>
  <rect x="230" y="186" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="186" width="2.5" height="14" class="f-ink"/>
  <text x="608.0" y="197.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,7 %</text>
  <text x="20.0" y="244.0" text-anchor="start" class="f-mono f-ink" style="font-size:13px">GPT-2 774M</text>
  <text x="220.0" y="263.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">ответ будет числом</text>
  <rect x="230" y="252" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="252" width="367.4" height="14" class="f-muted" style="opacity:0.5"/>
  <text x="608.0" y="263.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">99,3 %</text>
  <text x="220.0" y="283.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">уверенность в своём ответе</text>
  <rect x="230" y="272" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="272" width="5.3" height="14" class="f-accent"/>
  <text x="608.0" y="283.0" text-anchor="start" class="f-mono f-accent" style="font-size:12px">1,4 %</text>
  <text x="220.0" y="303.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">верные ответы</text>
  <rect x="230" y="292" width="370.0" height="14" class="f-plain"/>
  <rect x="230" y="292" width="3.2" height="14" class="f-ink"/>
  <text x="608.0" y="303.0" text-anchor="start" class="f-mono f-muted" style="font-size:12px">0,9 %</text>
  <text x="230.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0 %</text>
  <text x="415.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50 %</text>
  <text x="600.0" y="332.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100 %</text>
</svg>
<figcaption>1500 задач на модель: сложение и вычитание двузначных и трёхзначных чисел, умножение двузначных, по 300 каждого вида. Верхняя полоса: медианная вероятность того, что первый токен ответа начинает число. В середине: средняя вероятность напечатанного ответа, перемноженная по его токенам. Нижняя: доля верных ответов.</figcaption>
</figure>

При этом вероятности кое-что говорят, но верных ответов, чтобы это проверить, мало. Возьмём случайный верный ответ и случайный неверный от одной модели. У верного уверенность выше в 83 % таких пар у маленькой модели и в 90 % у большой. Заметная часть этого приходится на лёгкие задачи: на 0 умножить на 13 маленькая модель отвечает "0" с вероятностью 49 %. Без задач с 0 или 1 доля падает до 68–80 %. Верных ответов при этом остаётся всего от 3 до 5 на модель.

У самых уверенных неверных ответов своя закономерность. На 374 плюс 917 маленькая модель ответила 917 с вероятностью 57 %, это её самая уверенная ошибка. Возьмём 10 % самых уверенных неверных ответов каждой модели. От 24 до 36 % из них просто повторяют одно из двух чисел вопроса. Среди всех неверных ответов таких от 6 до 10 %.

## Чего я не проверял

Саму GPT-3. Это самое интересное. Модель, которая верно складывает все двузначные числа, может быть откалибрована совсем по-другому. Доступа, чтобы это проверить, у меня нет. Самой большой GPT-2 на 1,5B параметров нужно больше памяти, чем было свободно на машине, где я мерил, поэтому её здесь нет. В промпте было 5 примеров, а не 50, как в статье. Сэмплирование и beam search я не пробовал и словами у модели, уверена ли она, не спрашивал. Каждое число выше получено за один прогон. При жадной декодировке и фиксированных задачах второй прогон даёт те же ответы.

Когда модель печатает число, сам текст ничего не говорит о том, насколько она была уверена. В следующий раз я хочу видеть рядом с ответом вероятности токенов.
