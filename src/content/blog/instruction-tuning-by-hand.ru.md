---
title: "Я руками дообучил маленький T5 на инструкциях. Он выучил слова ответов и игнорирует варианты, которыми никогда не отвечал"
description: "Дообучил T5 base (248M) на 6000 примерах с инструкциями. Отвечать словами из обучения он научился за 408 примеров, а варианты, которыми никогда не отвечал, вроде true/false, игнорирует."
date: 2022-02-23
lang: ru
translationKey: instruction-tuning-by-hand
tags: ["llm", "machine-learning"]
---
В конце января OpenAI написала, что за их API теперь стоят модели InstructGPT, настроенные следовать инструкциям. FLAN от Google в сентябре и T0 от Hugging Face и BigScience в октябре сделали похожее без обратной связи от людей. Они переписывают много наборов данных в виде инструкций и дообучают на них модель. После этого модель отвечает на задачи, которых не видела.

Я и сам пишу такие промпты со строкой "Options: yes, no" в конце и жду, что модель её прочитает. Но я ни разу не проверял, что модель на самом деле делает с этой строкой. Поэтому я взял самую маленькую версию рецепта T0, которой хватает 4 ядер процессора. Её я и повторил руками.

## Стенд

Модель это `t5-base-lm-adapt` от Google. Это T5 v1.1 base на 248M параметров, дополнительно обученный как обычная языковая модель. T0 обучали, начиная с чекпоинтов той же линейки, только размером 3B и 11B. Обучал я оптимизатором Adafactor со скоростью обучения 0,001 и батчем 8. Каждый пример модель видит один раз. Все оценки ниже я посчитал ещё раз на torch 1.10.2 и transformers 4.16.2.

Для обучения я взял 6 наборов по 1000 примеров. SST-2 и IMDB это тональность, AG News это темы новостей. QQP и MRPC спрашивают, значат ли 2 текста одно и то же, BoolQ задаёт вопросы да/нет по отрывку текста. Для проверки я взял типы задач, которых в обучении нет вообще, как это делает T0. В RTE и CB надо решить, следует ли одно предложение из другого. В WiC надо решить, в одном ли значении слово стоит в 2 предложениях. Ещё я взял те же 277 пар из RTE с "Options: true, false" вместо "yes, no". Эти 2 слова ни разу не встречаются в обучении как ответ. Maybe, третий вариант в CB, тоже не встречается. Чтобы проверить и задачу из обучения, я отложил 300 отзывов SST-2, которых в обучении не было.

Проверочный промпт true/false выглядит так:

```
Pibul Songgram was the pro-Japanese military dictator of Thailand during World War 2.

Is it true or false that "Pibul was the dictator of Thailand."?

Options: true, false
```

Модель я считал послушной, когда весь её ответ это одно из перечисленных слов.

## Базовая модель вообще не отвечает

Ответ получили 0 из 1548 проверочных промптов. В 126 промптах из 300 про тональность базовая модель написала ", positive, negative,". В 273 промптах из 277 с true/false она написала ", false.". На таких промптах она продолжает последнюю строку вместо ответа. Я понимаю это так: для языковой модели эта строка это начало списка, вот она его и продолжает. На промптах да/нет она чаще всего пишет одну точку или ", no.".

Тут я ошибся. Мой первый скрипт подсчёта выкидывал всю пунктуацию перед сравнением, так что ", false." превращалось в "false". На true/false базовая модель выходила послушной на 98,6%. Я в это верил, пока не посмотрел на сырые ответы и не увидел запятую перед каждым ответом.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Промпт про Пибула Сонграма, который кончается строкой &quot;Options: true, false&quot;. Ответы: базовая модель &quot;, false.&quot;, обученная без инструкций &quot;no&quot;, обученная с инструкциями &quot;yes&quot;, обученная с меняющимися вариантами &quot;yes&quot;. Правильный ответ true.">
  <text x="12" y="18" class="f-label f-muted">1 пара из RTE с вариантами, которыми модель никогда не отвечала</text>
  <text x="12" y="42" class="f-label f-muted">Промпт</text>
  <text x="24" y="62" class="f-mono f-ink">Pibul Songgram was the pro-Japanese military dictator of</text>
  <text x="24" y="80" class="f-mono f-ink">Thailand during World War 2.</text>
  <text x="24" y="98" class="f-mono f-ink">Is it true or false that &quot;Pibul was the dictator of Thailand.&quot;?</text>
  <text x="24" y="116" class="f-mono f-ink">Options: true, false</text>
  <rect x="12" y="46" width="560" height="84" class="f-plain"/>
  <text x="12" y="152" class="f-label f-ink">базовая модель</text>
  <line x1="300" y1="148" x2="350" y2="148" class="f-line"/>
  <text x="362" y="152" class="f-mono f-muted">&quot;, false.&quot;</text>
  <text x="12" y="176" class="f-label f-ink">обучена без инструкций</text>
  <line x1="300" y1="172" x2="350" y2="172" class="f-line"/>
  <text x="362" y="176" class="f-mono f-accent">&quot;no&quot;</text>
  <text x="12" y="200" class="f-label f-ink">обучена с инструкциями</text>
  <line x1="300" y1="196" x2="350" y2="196" class="f-line"/>
  <text x="362" y="200" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="224" class="f-label f-ink">обучена с меняющимися вариантами</text>
  <line x1="300" y1="220" x2="350" y2="220" class="f-line"/>
  <text x="362" y="224" class="f-mono f-accent">&quot;yes&quot;</text>
  <text x="12" y="252" class="f-label f-muted">правильный ответ: true</text>
</svg>
<figcaption>Базовая модель продолжает строку Options. Дообученные отвечают словами из своего обучения.</figcaption>
</figure>

## Около 400 примеров хватает, чтобы модель начала отвечать

Сначала я обучил версию с инструкциями. Каждый обучающий пример это вопрос плюс "Options: ..." как выше. Уже после 51 шага она отвечает перечисленным словом почти на каждый промпт да/нет и про тональность. Это всего 408 примеров. Но ответ почти на каждую пару "yes", в RTE на 276 из 277.

После полного прохода она всё ещё говорит "yes" на 261 из 277 пар RTE. Точность 51,6%, а если всегда отвечать "yes", выходит 52,7%. На WiC точность 54,5%, а монетка даёт 50%. CB даёт 46,4%, это ниже 50%, которые даёт ответ "no" на всё. На SST-2, задаче из обучения, она даёт 87,0%. Так что на новых типах задач это почти угадывание. Почти всё выученное, что я там вижу, это формат.

## Потом она игнорирует варианты

На версии true/false она ответила "yes" 239 раз и "no" 35 раз. True или false она не ответила ни разу. В CB она ни разу не сказала maybe. Послушание на true/false 0%. Те же пары с yes/no дают 99,6%.

## Модель без инструкций

Чтобы понять, что инструкции добавляют к простому обучению на многих задачах, я обучил вторую модель без всякой инструкции. Она видела те же 6000 примеров, только сырые текстовые поля и слово ответа. Я ждал, что на true/false модель с инструкциями обгонит её больше чем на 30 пунктов. С ответом да/нет она почти так же послушна на новых задачах, 94,6% на RTE и 96,1% на WiC. В отличие от модели с инструкциями, любимое слово у неё "no", 256 раз на RTE. True/false и тут даёт 0%, так что разрыва не оказалось вовсе. На моём стенде инструкция для новых слов ответа не дала ничего.

SST-2 меня удивил. Эта модель тоже училась на тональности. Но когда отзыв был обёрнут в мою инструкцию, она ответила "no" или "yes" на 234 из 300, так что послушание всего 22,0%. Моя догадка: отзыв внутри инструкции выглядит для неё как вопрос да/нет.

<figure class="fig">
<svg viewBox="0 0 640 204" role="img" aria-label="Таблица послушания. базовая, SST-2 из обучения: 0%. базовая, RTE yes, no: 0%. базовая, WiC yes, no: 0%. базовая, CB yes, no, maybe: 0%. базовая, RTE true, false: 0%. без инструкций, SST-2 из обучения: 22%. без инструкций, RTE yes, no: 94,6%. без инструкций, WiC yes, no: 96,1%. без инструкций, CB yes, no, maybe: 89,3%. без инструкций, RTE true, false: 0%. с инструкциями, SST-2 из обучения: 100%. с инструкциями, RTE yes, no: 99,6%. с инструкциями, WiC yes, no: 100%. с инструкциями, CB yes, no, maybe: 100%. с инструкциями, RTE true, false: 0%. с меняющимися, SST-2 из обучения: 100%. с меняющимися, RTE yes, no: 100%. с меняющимися, WiC yes, no: 100%. с меняющимися, CB yes, no, maybe: 94,6%. с меняющимися, RTE true, false: 0%.">
  <text x="12" y="18" class="f-label f-muted">Доля ответов, совпадающих ровно с одним из перечисленных вариантов, %</text>
  <text x="170" y="44" class="f-label f-ink">SST-2</text>
  <text x="170" y="58" class="f-label f-muted">из обучения</text>
  <text x="262" y="44" class="f-label f-ink">RTE</text>
  <text x="262" y="58" class="f-label f-muted">yes, no</text>
  <text x="354" y="44" class="f-label f-ink">WiC</text>
  <text x="354" y="58" class="f-label f-muted">yes, no</text>
  <text x="446" y="44" class="f-label f-ink">CB</text>
  <text x="446" y="58" class="f-label f-muted">yes, no, maybe</text>
  <text x="538" y="44" class="f-label f-ink">RTE</text>
  <text x="538" y="58" class="f-label f-muted">true, false</text>
  <text x="12" y="84" class="f-label f-ink">базовая</text>
  <text x="170" y="84" class="f-mono f-ink">0</text>
  <rect x="170" y="90" width="80" height="5" class="f-plain"/>
  <text x="262" y="84" class="f-mono f-ink">0</text>
  <rect x="262" y="90" width="80" height="5" class="f-plain"/>
  <text x="354" y="84" class="f-mono f-ink">0</text>
  <rect x="354" y="90" width="80" height="5" class="f-plain"/>
  <text x="446" y="84" class="f-mono f-ink">0</text>
  <rect x="446" y="90" width="80" height="5" class="f-plain"/>
  <text x="538" y="84" class="f-mono f-ink">0</text>
  <rect x="538" y="90" width="80" height="5" class="f-plain"/>
  <text x="12" y="114" class="f-label f-ink">без инструкций</text>
  <text x="170" y="114" class="f-mono f-ink">22</text>
  <rect x="170" y="120" width="80" height="5" class="f-plain"/>
  <rect x="170" y="120" width="17.6" height="5" class="f-accent"/>
  <text x="262" y="114" class="f-mono f-accent">94,6</text>
  <rect x="262" y="120" width="80" height="5" class="f-plain"/>
  <rect x="262" y="120" width="75.7" height="5" class="f-accent"/>
  <text x="354" y="114" class="f-mono f-accent">96,1</text>
  <rect x="354" y="120" width="80" height="5" class="f-plain"/>
  <rect x="354" y="120" width="76.9" height="5" class="f-accent"/>
  <text x="446" y="114" class="f-mono f-ink">89,3</text>
  <rect x="446" y="120" width="80" height="5" class="f-plain"/>
  <rect x="446" y="120" width="71.4" height="5" class="f-accent"/>
  <text x="538" y="114" class="f-mono f-ink">0</text>
  <rect x="538" y="120" width="80" height="5" class="f-plain"/>
  <text x="12" y="144" class="f-label f-ink">с инструкциями</text>
  <text x="170" y="144" class="f-mono f-accent">100</text>
  <rect x="170" y="150" width="80" height="5" class="f-plain"/>
  <rect x="170" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="144" class="f-mono f-accent">99,6</text>
  <rect x="262" y="150" width="80" height="5" class="f-plain"/>
  <rect x="262" y="150" width="79.7" height="5" class="f-accent"/>
  <text x="354" y="144" class="f-mono f-accent">100</text>
  <rect x="354" y="150" width="80" height="5" class="f-plain"/>
  <rect x="354" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="144" class="f-mono f-accent">100</text>
  <rect x="446" y="150" width="80" height="5" class="f-plain"/>
  <rect x="446" y="150" width="80.0" height="5" class="f-accent"/>
  <text x="538" y="144" class="f-mono f-ink">0</text>
  <rect x="538" y="150" width="80" height="5" class="f-plain"/>
  <text x="12" y="174" class="f-label f-ink">с меняющимися</text>
  <text x="170" y="174" class="f-mono f-accent">100</text>
  <rect x="170" y="180" width="80" height="5" class="f-plain"/>
  <rect x="170" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="262" y="174" class="f-mono f-accent">100</text>
  <rect x="262" y="180" width="80" height="5" class="f-plain"/>
  <rect x="262" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="354" y="174" class="f-mono f-accent">100</text>
  <rect x="354" y="180" width="80" height="5" class="f-plain"/>
  <rect x="354" y="180" width="80.0" height="5" class="f-accent"/>
  <text x="446" y="174" class="f-mono f-accent">94,6</text>
  <rect x="446" y="180" width="80" height="5" class="f-plain"/>
  <rect x="446" y="180" width="75.7" height="5" class="f-accent"/>
  <text x="538" y="174" class="f-mono f-ink">0</text>
  <rect x="538" y="180" width="80" height="5" class="f-plain"/>
</svg>
<figcaption>Все дообученные модели отвечают в нужной форме на незнакомых задачах да/нет и ни одна не говорит true или false.</figcaption>
</figure>

## Меняю варианты в обучении

Я думал, что в обучении строка Options никогда не менялась, поэтому модели незачем было её читать. Перед следующим прогоном я записал, что её опровергнет послушание ниже 20% на true/false. Потом я обучил третью модель на тех же примерах. Для каждого примера слова вариантов брались случайно из нескольких наборов. Для тональности это пары вроде good/bad и great/terrible, для задач да/нет пары вроде correct/incorrect и right/wrong. Ни в одном наборе не было true, false или maybe. Вопрос про тональность при этом лишился своего "positive or negative".

На true/false она всё равно ответила "yes", 265 раз из 277. Потом я проверил её и модель с неизменными вариантами на SST-2 с другими строками Options. В самом вопросе меток не было. С "good, bad" она послушна на 100%, с "great, terrible" на 99,7%. С "fine, awful", парой, которую она ни разу не видела, послушание 0%. Вместо этого она ответила "great" или "terrible". Тональность была верной в 229 отзывах из 300. Похоже, она читает в отзыве тональность и потом берёт слово из пары, которую уже знает. Модель с неизменными вариантами не справляется уже с "good, bad". Она отвечает "positive" или "negative". Тем не менее, если сравнить её вероятности "good" и "bad", она выбирает правильное слово в 87,3% отзывов.

"Correct, incorrect" на RTE тоже даёт 0%. Модель видела эту пару как ответы в обучении, только в других задачах. На паре из RTE она говорит "yes".

<figure class="fig">
<svg viewBox="0 0 640 244" role="img" aria-label="Послушание 2 моделей при разных строках вариантов. positive, negative: с инструкциями 100%, с меняющимися вариантами 100%. good, bad: с инструкциями 0%, с меняющимися вариантами 100%. great, terrible: с инструкциями 0%, с меняющимися вариантами 99,7%. fine, awful: с инструкциями 0%, с меняющимися вариантами 0%. correct, incorrect: с инструкциями 0%, с меняющимися вариантами 0%.">
  <text x="12" y="18" class="f-label f-muted">SST-2 и RTE с другими словами в строке Options</text>
  <text x="12" y="44" class="f-label f-muted">строка Options</text>
  <text x="260" y="44" class="f-label f-muted">с инструкциями</text>
  <text x="420" y="44" class="f-label f-muted">с меняющимися вариантами</text>
  <text x="12" y="74" class="f-mono f-ink">positive, negative</text>
  <rect x="260" y="63" width="120" height="14" class="f-plain"/>
  <rect x="260" y="63" width="120.0" height="14" class="f-box"/>
  <text x="260" y="90" class="f-label f-ink">100%</text>
  <rect x="420" y="63" width="120" height="14" class="f-plain"/>
  <rect x="420" y="63" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="90" class="f-label f-ink">100%</text>
  <text x="12" y="108" class="f-mono f-ink">good, bad</text>
  <text x="12" y="122" class="f-label f-muted">(правая модель на них училась)</text>
  <rect x="260" y="97" width="120" height="14" class="f-plain"/>
  <text x="260" y="124" class="f-label f-ink">0%</text>
  <rect x="420" y="97" width="120" height="14" class="f-plain"/>
  <rect x="420" y="97" width="120.0" height="14" class="f-accent"/>
  <text x="420" y="124" class="f-label f-ink">100%</text>
  <text x="12" y="142" class="f-mono f-ink">great, terrible</text>
  <text x="12" y="156" class="f-label f-muted">(правая модель на них училась)</text>
  <rect x="260" y="131" width="120" height="14" class="f-plain"/>
  <text x="260" y="158" class="f-label f-ink">0%</text>
  <rect x="420" y="131" width="120" height="14" class="f-plain"/>
  <rect x="420" y="131" width="119.6" height="14" class="f-accent"/>
  <text x="420" y="158" class="f-label f-ink">99,7%</text>
  <text x="12" y="176" class="f-mono f-ink">fine, awful</text>
  <text x="12" y="190" class="f-label f-muted">(не было в обучении)</text>
  <rect x="260" y="165" width="120" height="14" class="f-plain"/>
  <text x="260" y="192" class="f-label f-ink">0%</text>
  <rect x="420" y="165" width="120" height="14" class="f-plain"/>
  <text x="420" y="192" class="f-label f-ink">0%</text>
  <text x="12" y="210" class="f-mono f-ink">correct, incorrect</text>
  <text x="12" y="224" class="f-label f-muted">(из других задач)</text>
  <rect x="260" y="199" width="120" height="14" class="f-plain"/>
  <text x="260" y="226" class="f-label f-ink">0%</text>
  <rect x="420" y="199" width="120" height="14" class="f-plain"/>
  <text x="420" y="226" class="f-label f-ink">0%</text>
  <text x="460" y="192" class="f-label f-muted">отвечает great / terrible</text>
  <text x="460" y="226" class="f-label f-muted">отвечает yes</text>
</svg>
<figcaption>С меняющимися вариантами модель выбирает из наборов слов, которые знает. Незнакомая пара ничего не меняет.</figcaption>
</figure>

## Что я из этого вынес

Так что модель кое-что выучила про инструкцию, но меньше, чем я думал. Она выучила, какие слова бывают ответами для какого вида входа. С меняющимися вариантами в обучении строка Options стала переключателем между наборами слов тональности, которые она уже знает. На RTE этот переключатель не сработал даже для пары, которой она отвечала на других задачах. Слова, которые в обучении ни разу не были ответами, она не использовала никогда. Думаю, причина в этом, но модель, у которой они были, я не обучал. Я ждал больше 50% на true/false от модели с неизменными вариантами и от модели с меняющимися. Для модели на 248M я ошибся оба раза.

Ничего нового тут нет. FLAN и T0 проверяли шаблоны и размер на моделях намного больше тех, что я могу обучить. Строку Options я писать продолжу. Но для маленькой дообученной модели сначала проверю, были ли эти слова ответами в её обучающих данных.

## Чего я не проверял

- 1 шаблон на задачу. Модель с инструкциями я обучил второй раз с другим seed. Она снова ни разу не сказала true или false, "yes" 257 раз из 277. Остальные модели я обучал по одному разу.
- 248M параметров. В FLAN дообучение на новых задачах вредило при 8B и меньше и помогало на 68B и 137B. В T0 модель на 3B уже обгоняет исходный чекпоинт без дообучения. Модель побольше, возможно, читает строку Options. Я этого не проверял.
- У всех моделей точность на новых задачах близка к угадыванию. Так что это про форму ответа. Про умение я ничего сказать не могу.
- Оценки я повторил на torch 1.10.2 и transformers 4.16.2. Обучение шло в другом окружении на этой машине. Его я не повторял.
