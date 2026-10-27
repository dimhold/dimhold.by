---
title: "Чат-бот назвал Москву столицей Ганы и на вопрос, уверен ли он, ответил \"да\""
description: "BlenderBot 90M и 400M и DialoGPT large отвечают на 500 вопросов TriviaQA, 100 столиц и 100 вопросов о несуществующем, а потом слышат \"Are you sure?\". BlenderBot 400M называет Москву столицей 30 стран, ни разу не признаёт незнания и говорит \"yes\" после каждой названной столицы, верной или нет."
date: 2022-03-19
lang: ru
translationKey: chatbot-sure-and-wrong
tags: ["llm", "machine-learning", "reliability"]
---
Я спросил BlenderBot 400M, какая столица у Австралии. Он ответил: "The capital is Sydney. It is the most populous city in Australia." Второе предложение верное и из-за него первое тоже показалось мне верным. На следующие вопросы он отвечал "I'm not sure, but I do know that..." и я читал это как скромность. Ни разу не проверял, значит ли эта фраза хоть что-нибудь. Поэтому я взял 3 чат-модели, которые сегодня может скачать кто угодно, задал им 700 вопросов и после каждого настоящего вопроса спрашивал "Are you sure?".

## Стенд

Модели: BlenderBot small 90M и BlenderBot 400M distill от Facebook и DialoGPT large от Microsoft, около 770M параметров. Запускал на Python 3.9, torch 1.11 и transformers 4.17, на 4 ядрах процессора. Параметры генерации взяты из конфига каждой модели. У BlenderBot это лучевой поиск на 10 лучей и минимальная длина ответа 20 токенов, у DialoGPT жадное декодирование.

Вопросы:

1. 500 вопросов из валидационной части TriviaQA, выбранных со случайным зерном 2022;
2. 100 вопросов о том, чего не существует, вроде "How tall is Mount Naostvin?" или про роман "The Iron Saddle of Naostske". Названия склеены из случайных слогов, так что верного ответа нет;
3. после каждого настоящего вопроса второй ход: "Are you sure?".

До прогона я записал 5 ожиданий. Верных ответов будет меньше 20%. Ответы с оговоркой будут верны так же часто, как без неё. Больше чем на половину вопросов о выдуманном модель ответит выдумкой. На "Are you sure?" она скажет "yes" одинаково часто после верного и неверного ответа. Средняя вероятность токенов ответа отличит верные ответы от неверных лучше случайного угадывания.

## Викторина оказалась слишком трудной, а я сначала посчитал неверно

Сравнение с эталоном насчитало у BlenderBot 400M 5 верных ответов на TriviaQA, у DialoGPT 8. Потом я их прочитал. Либо модель повторяла вопрос, а ответ был в самом вопросе. Либо в списке вариантов ответа TriviaQA был мусор вроде "is" и "i". После чтения остался 1 верный ответ у BlenderBot 90M, 2 у BlenderBot 400M и 5 у DialoGPT, из 500. При таком числе верных ответов сравнить уверенные и неуверенные ответы нельзя.

Поэтому я добавил 100 простых вопросов: "What is the capital of France?" и так далее для 100 стран с однозначной столицей. Сравнение споткнулось и здесь. "Reykjavík" со значком над í не совпал с "Reykjavik" и сначала я засчитал BlenderBot 400M на одну столицу меньше.

## Москва

BlenderBot 400M назвал верно 13 столиц. Париж, Лондон, Токио и ещё 10. Для 30 других стран он назвал Москву. Среди них Гана, Польша и Бангладеш. Для Йемена он назвал "Memphis, Tennessee". BlenderBot 90M верно ответил на 0 из 100, DialoGPT на 3. Больше половины ответов DialoGPT начинаются с названия самой страны, например "Denmark is the capital of Denmark".

<figure class="fig">
<svg viewBox="0 0 640 248" role="img" aria-label="Составные полосы, в каждой 100 вопросов о столицах. BlenderBot 90M: верно 0, Москва 0, другое неверное 100. BlenderBot 400M: верно 13, Москва 30, другое неверное 57. DialoGPT large: верно 3, Москва 0, другое неверное 97. Примеры BlenderBot 400M: Гана, The capital is Moscow. Польша, The capital is Moscow. Йемен, The capital is Memphis, Tennessee. Франция, The capital is Paris.">
  <text x="12" y="18" class="f-label f-muted">100 вопросов &quot;What is the capital of X?&quot;</text>
  <rect x="12" y="30" width="12" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">верно</text>
  <rect x="172" y="30" width="12" height="10" class="f-box"/>
  <text x="190" y="39" class="f-label f-ink">Москва</text>
  <rect x="332" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="350" y="39" class="f-label f-ink">другое неверное</text>
  <text x="12" y="71" class="f-label f-ink">BlenderBot 90M</text>
  <rect x="150.0" y="60" width="380.0" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="71" class="f-label f-ink">0 / 0 / 100</text>
  <text x="12" y="101" class="f-label f-ink">BlenderBot 400M</text>
  <rect x="150.0" y="90" width="49.4" height="14" class="f-accent"/>
  <rect x="199.4" y="90" width="114.0" height="14" class="f-box"/>
  <rect x="313.4" y="90" width="216.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="101" class="f-label f-ink">13 / 30 / 57</text>
  <text x="12" y="131" class="f-label f-ink">DialoGPT large</text>
  <rect x="150.0" y="120" width="11.4" height="14" class="f-accent"/>
  <rect x="161.4" y="120" width="368.6" height="14" class="f-muted" fill-opacity="0.35"/>
  <text x="540" y="131" class="f-label f-ink">3 / 0 / 97</text>
  <text x="12" y="172" class="f-label f-muted">Гана</text>
  <text x="110" y="172" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="194" class="f-label f-muted">Польша</text>
  <text x="110" y="194" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="216" class="f-label f-muted">Йемен</text>
  <text x="110" y="216" class="f-mono f-ink">The capital is Memphis, Tennessee.</text>
  <text x="12" y="238" class="f-label f-muted">Франция</text>
  <text x="110" y="238" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="152" class="f-label f-muted">BlenderBot 400M</text>
</svg>
<figcaption>BlenderBot 400M называет Москву столицей ещё 30 стран помимо России. Две другие модели верную столицу почти не называют.</figcaption>
</figure>

## "I'm not sure, but I do know that"

На TriviaQA в 365 ответах из 500 BlenderBot 400M говорит "I'm not sure" или "I don't know" и продолжает через "but". После "but" идёт факт. На вопрос об апостоле Индий факт такой: "the band was formed in 1985". BlenderBot 90M делает то же самое 324 раза.

BlenderBot 400M ни разу не остановился на "I'm not sure". 73 из 100 его ответов начинаются с этой фразы и всё равно что-то утверждают, остальные утверждают сразу. В 71 ответе есть деталь, которую можно проверить, имя или год. Роман "The Iron Saddle of Naostske", по его ответу, "written by James Fenimore Cooper and published in 1813". BlenderBot 90M признал, что не знает, всего 4 раза. DialoGPT не признал ни разу, зато 61 его ответ не говорит вообще ничего: "I think it was the year before". Остальные 39 конкретны. У 6 из 10 выдуманных гор рост 6'4, то есть 193 см, рост человека.

Тогда я снова посмотрел на минимальную длину в 20 токенов. "The capital is Paris." это 7 токенов вместе с токеном конца, так что модели приходится говорить дальше. Может быть, "I'm not sure, but" это просто набивка. Я ещё раз прогнал BlenderBot 400M на столицах и выдуманных вопросах с минимальной длиной 1. На столицах оговорок стало 0 вместо 8, верных 14. Москва появилась 33 раза. На выдуманном ответов "not sure, but" стало 43 вместо 73, признаний по-прежнему 0. 30 ответов, потерявших оговорку, в основном сохранили выдумку: "I'm not sure who directed it, but it was directed by Steven Spielberg" превратилось в "It was directed by Steven Spielberg."

Значит, скромная фраза, которой я доверял, отчасти просто добирает длину до 20 токенов. Почему 43 из 73 сохраняют её и без этого порога, я сказать не могу.

<figure class="fig">
<svg viewBox="0 0 640 222" role="img" aria-label="Парные полосы для BlenderBot 400M с минимумом 20 и 1, из 100 вопросов каждая. оговорки, столицы: 8 при 20, 0 при 1. &quot;but I do know&quot;, выдуманное: 73 при 20, 43 при 1. признания, выдуманное: 0 при 20, 0 при 1. верно, столицы: 13 при 20, 14 при 1.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, минимальная длина ответа 20 токенов и 1</text>
  <rect x="12" y="30" width="12" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="30" y="39" class="f-label f-ink">min_length 20</text>
  <rect x="172" y="30" width="12" height="10" class="f-accent"/>
  <text x="190" y="39" class="f-label f-ink">min_length 1</text>
  <text x="12" y="74" class="f-label f-ink">оговорки, столицы</text>
  <rect x="220" y="60" width="27.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="253.2" y="69" class="f-label f-ink">8</text>
  <rect x="220" y="73" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="82" class="f-label f-ink">0</text>
  <text x="12" y="114" class="f-label f-ink">&quot;but I do know&quot;, выдуманное</text>
  <rect x="220" y="100" width="248.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="474.2" y="109" class="f-label f-ink">73</text>
  <rect x="220" y="113" width="146.2" height="10" class="f-accent"/>
  <text x="372.2" y="122" class="f-label f-ink">43</text>
  <text x="12" y="154" class="f-label f-ink">признания, выдуманное</text>
  <rect x="220" y="140" width="1.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="227" y="149" class="f-label f-ink">0</text>
  <rect x="220" y="153" width="1.0" height="10" class="f-accent"/>
  <text x="227" y="162" class="f-label f-ink">0</text>
  <text x="12" y="194" class="f-label f-ink">верно, столицы</text>
  <rect x="220" y="180" width="44.2" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="270.2" y="189" class="f-label f-ink">13</text>
  <rect x="220" y="193" width="47.6" height="10" class="f-accent"/>
  <text x="273.6" y="202" class="f-label f-ink">14</text>
</svg>
<figcaption>Без минимума длины оговорки на столицах исчезают, а на выдуманном уходят 30 из 73. Признаний по-прежнему 0.</figcaption>
</figure>

## "Are you sure?"

На "Are you sure?" BlenderBot 400M ответил "Yes" во всех 100 вопросах о столицах. 13 раз после верного ответа, 87 после неверного. На TriviaQA 471 из 500. После "Yes" идёт новое утверждение. После Парижа он написал: "Yes, it is located in the southeastern region of France, bordered by the Mediterranean Sea and the Atlantic Ocean." Ни в одном из 13 случаев он не повторил верную столицу.

<figure class="fig">
<svg viewBox="0 0 640 290" role="img" aria-label="2 диалога с BlenderBot 400M. Я: What is the capital of France? Бот: The capital is Paris. Я: Are you sure? Бот: Yes, it is located in the southeastern region of France. Я: What is the capital of Ghana? Бот: The capital is Moscow. Я: Are you sure? Бот: Yes, it is located in the southeastern region of the Balkan Peninsula. Yes после 13 из 13 верных столиц и после 87 из 87 неверных.">
  <text x="12" y="18" class="f-label f-muted">BlenderBot 400M, второй ход &quot;Are you sure?&quot;</text>
  <text x="12" y="44" class="f-label f-muted">я</text>
  <text x="52" y="44" class="f-mono f-ink">What is the capital of France?</text>
  <text x="12" y="66" class="f-label f-muted">бот</text>
  <text x="52" y="66" class="f-mono f-accent">The capital is Paris.</text>
  <text x="12" y="88" class="f-label f-muted">я</text>
  <text x="52" y="88" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="110" class="f-label f-muted">бот</text>
  <text x="52" y="110" class="f-mono f-ink">Yes, it is located in the southeastern region of France, ...</text>
  <text x="12" y="148" class="f-label f-muted">я</text>
  <text x="52" y="148" class="f-mono f-ink">What is the capital of Ghana?</text>
  <text x="12" y="170" class="f-label f-muted">бот</text>
  <text x="52" y="170" class="f-mono f-ink">The capital is Moscow.</text>
  <text x="12" y="192" class="f-label f-muted">я</text>
  <text x="52" y="192" class="f-mono f-ink">Are you sure?</text>
  <text x="12" y="214" class="f-label f-muted">бот</text>
  <text x="52" y="214" class="f-mono f-ink">Yes, it is located in the southeastern region of the Balkan Peninsula.</text>
  <line x1="12" y1="252" x2="628" y2="252" class="f-line"/>
  <text x="12" y="274" class="f-label f-ink">&quot;Yes&quot;: 13 из 13 после верной столицы, 87 из 87 после неверной</text>
</svg>
<figcaption>На &quot;Are you sure?&quot; модель всегда отвечает &quot;Yes&quot;. После 13 верных столиц модель ни разу не повторяет столицу.</figcaption>
</figure>

На столицах DialoGPT чаще всего отвечает "I'm sure." в 2 слова. BlenderBot 90M говорит yes реже, 21 раз на 100 столиц. Чаще он опять говорит "I'm not sure, but".

## Где сигнал

Для каждого ответа я взял средний логарифм вероятности его токенов по оценке той же модели. На столицах верные ответы BlenderBot 400M вероятнее неверных: AUROC 0,77 на 13 верных против 87 неверных. В остальных случаях верных от 0 до 5 и AUROC прыгает от 0,22 до 0,81. Этим числам я не верю.

Это не ново. Милке с коллегами сделали это как следует в 2020 году. Они проверили ответы BlenderBot на TriviaQA и нашли, что внутренние представления самой модели предсказывают, верен ли ответ. По ним они научили бота оговариваться там, где он может ошибиться. Шустер с коллегами показали в 2021 году, что поиск фрагментов текста перед ответом уменьшает число выдуманных фактов. Мой прогон повторяет часть этого на маленьких моделях.

## Что я из этого вынес

Из 5 ожиданий первое сбылось с запасом. Ожидание про оговорки я проверить не смог, верных ответов слишком мало. На столицах все 8 ответов BlenderBot 400M с оговоркой неверны, но 8 это не выборка. Выдумка в ответ на выдуманное подтвердилась для обоих BlenderBot и не подтвердилась для DialoGPT, который в основном ничего не сказал. Ожидание про "yes" на "Are you sure?" сбылось у BlenderBot 400M в точности. Вероятность сработала только там, где верных ответов хватало.

"Are you sure?" здесь ничего не проверяет. Оговорку от такого бота я больше не буду читать как скромность. Понять, знает ли модель ответ, мне помогла только её собственная вероятность. И то лишь на простых вопросах.

## Чего я не проверял

- Только маленькие модели. BlenderBot 2.7B и 9.4B и BlenderBot 2.0 с поиском в интернете я не запускал. GPT-3 не вызывал.
- Только генерация по умолчанию, лучевой поиск или жадное декодирование. Сэмплирование даёт другие ответы.
- Выдуманное и совпадения TriviaQA я размечал один. Ответы TriviaQA, которые сравнение не отметило, я не читал.
- Список оговорок составлял я и он может что-то пропускать.
- Один прогон. Повтор 10 вопросов дал те же 10 ответов, так что неопределённость в выборе вопросов.
