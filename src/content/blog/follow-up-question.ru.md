---
title: "Я спросил маленькую модель \"And Leon?\", чтобы понять, что нужно чату в ChatGPT"
description: "ChatGPT открылся 30 ноября. Сначала я объяснял его первую неделю полем ввода. Я дал Flan-T5 base и large и GPT-2 large переписку с заметками о 3 людях и задал короткие вопросы вроде \"And Leon?\". Flan-T5 large отвечает верно на все, Flan-T5 base отвечает на \"And Leon?\" возрастом, а GPT-2, которую не учили следовать инструкциям, отвечает верно 3 раза из 4."
date: 2022-12-11
lang: ru
translationKey: follow-up-question
tags: ["llm", "machine-learning", "text"]
---
ChatGPT открылся в среду, 30 ноября. В понедельник Сэм Альтман написал, что у него больше 1 миллиона пользователей. По словам OpenAI, модель дообучили на основе модели из серии GPT-3.5, а сама GPT-3 доступна через API с 2020 года. Поэтому сначала я объяснял успех этой недели самим полем ввода. Как я это понимаю, чат это вся переписка, которую с каждым новым сообщением снова отправляют модели, так что то, за что его полюбили, должно работать и на гораздо меньшей модели. Я имею в виду короткий вопрос: спрашиваешь, кем работает Simon, потом пишешь "And Leon?" и получаешь ответ, кем работает Leon.

Я и раньше называл продукты с чатом "просто обёрткой" и ни разу не проверял, что этой обёртке нужно от модели. Поэтому проверил на моделях, которые в декабре 2022 года может скачать кто угодно. Вопрос не новый. CoQA и QuAC (2018) собирают вопросы, которые зависят от предыдущих реплик. В CANARD (2019) люди переписывают такие вопросы в самостоятельные, потому что модели, которые отвечают на вопросы, с зависимыми справляются хуже. Мой тест намного меньше.

## Стенд

Модели: Flan-T5 base (248M параметров) и Flan-T5 large (783M), которые Google выложил 20 октября после дообучения на инструкциях из 1836 задач. Для контроля я взял GPT-2 large (774M) 2019 года. Её следовать инструкциям не учили вовсе. Запускал на torch 1.13.0 и transformers 4.25.1, на 4 ядрах процессора, с жадным декодированием.

Первые вопросы были про химические элементы: "What is the chemical symbol for gold?", потом "And silver?". После первого прогона я их выбросил. Flan-T5 base не назвала верно ни одного из 40 атомных номеров, а символы писала строчными буквами, "li" для лития. В быстрой проверке Flan-T5 large сообщила мне, что атомный номер золота 58, а "Гамлета" написал "thomas keats". Я считал, что модель, которая следует инструкциям, знает и таблицу Менделеева.

Тогда я перенёс факты в сам разговор. Первое сообщение содержит заметки о 3 людях, модель отвечает "OK." и дальше идут вопросы. Таких записей 120. В каждой двое одного пола, так что "she" без предыдущей реплики может относиться к любому из них.

Для каждой записи есть полный вопрос ("How old is Leon?"). Дальше 2 коротких вопроса меняют человека ("And Leon?", "What about Leon?") и 2 меняют поле через местоимение. Один это вопрос вроде "How old is she?" или "Where does he live?", другой короткий оборот без глагола вроде "And her age?" или "And his city?". Каждый задаётся с предыдущей репликой и без неё. При первом подсчёте я засчитывал "Leon is 58, works as a chef and lives" как ответ на "And Leon?". Это вся строка из заметок. Правило теперь строже: ответ засчитывается, только если в нём есть верное значение и нет ничего другого про этого человека или про кого-то ещё. Правило действует на все ответы, так что оно отнимает и некоторые верные, вроде "Laura is a pilot and lives in Torun."

До прогона я записал, какой результат покажет, что чат всего лишь обёртка. Короткие вопросы с предыдущей репликой должны отставать от полного вопроса не больше чем на 10 пунктов, а без неё держаться около уровня угадывания.

## Большая модель почти не ошибалась

Flan-T5 large верно ответила на полный вопрос в 113 записях из 120. С предыдущей репликой она верно ответила на все 4 вида коротких вопросов во всех 120 записях. Без неё вышло 50 из 240 для нового человека и 77 из 240 для нового поля.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Стенограмма. User: Here are some notes about three people. Simon is 24, works as a teacher and lives in Wroclaw. Leon is 58, works as a chef and lives in Szczecin. Sofia is 54, works as a dentist and lives in Gdansk. Assistant: OK. User: What does Simon do for a living? Assistant: Teacher. User: And Leon? Ответы с предыдущей репликой и без неё. Flan-T5 large: Chef. Без неё: Leon is 58, works as a chef and lives Flan-T5 base: Leon is 58. Без неё: Simon is 24. GPT-2 large: Chef. Без неё: Leon is a teacher.">
  <text x="12" y="18" class="f-label f-muted">Запись 0 из 120, предыдущая реплика и короткий вопрос</text>
  <text x="12" y="44" class="f-label f-muted">User:</text>
  <text x="110" y="44" class="f-mono f-ink">Here are some notes about three people.</text>
  <text x="110" y="65" class="f-mono f-ink">Simon is 24, works as a teacher and lives in Wroclaw.</text>
  <text x="110" y="86" class="f-mono f-ink">Leon is 58, works as a chef and lives in Szczecin.</text>
  <text x="110" y="107" class="f-mono f-ink">Sofia is 54, works as a dentist and lives in Gdansk.</text>
  <text x="12" y="128" class="f-label f-muted">Assistant:</text>
  <text x="110" y="128" class="f-mono f-ink">OK.</text>
  <text x="12" y="149" class="f-label f-muted">User:</text>
  <text x="110" y="149" class="f-mono f-ink">What does Simon do for a living?</text>
  <text x="12" y="170" class="f-label f-muted">Assistant:</text>
  <text x="110" y="170" class="f-mono f-ink">Teacher.</text>
  <text x="12" y="191" class="f-label f-muted">User:</text>
  <text x="110" y="191" class="f-mono f-ink">And Leon?</text>
  <line x1="12" y1="210" x2="628" y2="210" class="f-plain"/>
  <text x="150" y="226" class="f-label f-muted">с предыдущей репликой</text>
  <text x="330" y="226" class="f-label f-muted">без неё</text>
  <text x="12" y="250" class="f-label f-ink">Flan-T5 large</text>
  <text x="150" y="250" class="f-mono f-accent">Chef.</text>
  <text x="330" y="250" class="f-mono f-ink">Leon is 58, works as a chef and lives</text>
  <text x="12" y="272" class="f-label f-ink">Flan-T5 base</text>
  <text x="150" y="272" class="f-mono f-ink">Leon is 58.</text>
  <text x="330" y="272" class="f-mono f-ink">Simon is 24.</text>
  <text x="12" y="294" class="f-label f-ink">GPT-2 large</text>
  <text x="150" y="294" class="f-mono f-accent">Chef.</text>
  <text x="330" y="294" class="f-mono f-ink">Leon is a teacher.</text>
</svg>
<figcaption>Верный ответ Chef. Flan-T5 base отвечает возрастом. Так она делает в 84 записях из 120.</figcaption>
</figure>

Потом я сделал разговор длиннее. Между заметками и вопросами я вставлял до 32 посторонних вопросов с ответами вроде "How many legs does a spider have?" "8.". С 32 вставками на входе около 530 токенов. При 2-16 вставках большая модель изредка ошибалась, не больше чем в 5 записях из 120. При 32 она снова верно ответила на "And Leon?" и на вопросы с местоимением в 120 записях из 120. До прогона я записал, что до 512 токенов длина не должна иметь значения. Так и вышло. При 32 вставках вход уже длиннее 512.

## Маленькая модель отвечает на "And Leon?" возрастом

Местоимения у Flan-T5 base работают. Ответы на вопросы вроде "How old is she?" верны в 110 записях из 120, на оборот "And her age?" в 97. На "And Leon?" она отвечает верно в 36. Без предыдущей реплики в 34, так что переписка почти ничего не добавляет.

В 84 ответах из 120 она называет возраст человека: "Leon is 58." Если предыдущий вопрос был про возраст, это случайно верно, 29 из 39. После вопроса про работу верно 4 из 42, после вопроса про город 3 из 39. "What about Leon?" лучше, 57 из 120. Возможно, она просто копирует начало строки этого человека в заметках, а возраст там стоит первым.

<figure class="fig">
<svg viewBox="0 0 640 342" role="img" aria-label="Сгруппированные полосы: верные ответы из 120 на 4 коротких вопроса у 3 моделей, с предыдущей репликой и без неё. And Leon? Flan-T5 large: 120 с ней, 28 без неё. And Leon? Flan-T5 base: 36 с ней, 34 без неё. And Leon? GPT-2 large: 91 с ней, 6 без неё. What about Leon? Flan-T5 large: 120 с ней, 22 без неё. What about Leon? Flan-T5 base: 57 с ней, 39 без неё. What about Leon? GPT-2 large: 94 с ней, 24 без неё. How old is she? Flan-T5 large: 120 с ней, 37 без неё. How old is she? Flan-T5 base: 110 с ней, 42 без неё. How old is she? GPT-2 large: 81 с ней, 44 без неё. And her age? Flan-T5 large: 120 с ней, 40 без неё. And her age? Flan-T5 base: 97 с ней, 29 без неё. And her age? GPT-2 large: 72 с ней, 39 без неё.">
  <text x="12" y="18" class="f-label f-muted">Верных ответов из 120 записей</text>
  <rect x="12.0" y="30" width="12.0" height="10" class="f-accent"/>
  <text x="30" y="39" class="f-label f-ink">с предыдущей репликой</text>
  <rect x="260.0" y="30" width="12.0" height="10" class="f-muted" fill-opacity="0.35"/>
  <text x="278" y="39" class="f-label f-ink">без неё</text>
  <text x="12" y="73" class="f-mono f-ink">And Leon?</text>
  <text x="150" y="73" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="64" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="71" width="70.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="74" class="f-label f-ink">120 / 28</text>
  <text x="150" y="91" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="82" width="90.0" height="6" class="f-accent"/>
  <rect x="250.0" y="89" width="85.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="92" class="f-label f-ink">36 / 34</text>
  <text x="150" y="109" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="100" width="227.5" height="6" class="f-accent"/>
  <rect x="250.0" y="107" width="15.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="110" class="f-label f-ink">91 / 6</text>
  <text x="12" y="139" class="f-mono f-ink">What about Leon?</text>
  <text x="150" y="139" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="130" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="137" width="55.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="140" class="f-label f-ink">120 / 22</text>
  <text x="150" y="157" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="148" width="142.5" height="6" class="f-accent"/>
  <rect x="250.0" y="155" width="97.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="158" class="f-label f-ink">57 / 39</text>
  <text x="150" y="175" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="166" width="235.0" height="6" class="f-accent"/>
  <rect x="250.0" y="173" width="60.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="176" class="f-label f-ink">94 / 24</text>
  <text x="12" y="205" class="f-mono f-ink">How old is she?</text>
  <text x="150" y="205" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="196" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="203" width="92.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="206" class="f-label f-ink">120 / 37</text>
  <text x="150" y="223" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="214" width="275.0" height="6" class="f-accent"/>
  <rect x="250.0" y="221" width="105.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="224" class="f-label f-ink">110 / 42</text>
  <text x="150" y="241" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="232" width="202.5" height="6" class="f-accent"/>
  <rect x="250.0" y="239" width="110.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="242" class="f-label f-ink">81 / 44</text>
  <text x="12" y="271" class="f-mono f-ink">And her age?</text>
  <text x="150" y="271" class="f-label f-muted">Flan-T5 large</text>
  <rect x="250.0" y="262" width="300.0" height="6" class="f-accent"/>
  <rect x="250.0" y="269" width="100.0" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="272" class="f-label f-ink">120 / 40</text>
  <text x="150" y="289" class="f-label f-muted">Flan-T5 base</text>
  <rect x="250.0" y="280" width="242.5" height="6" class="f-accent"/>
  <rect x="250.0" y="287" width="72.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="290" class="f-label f-ink">97 / 29</text>
  <text x="150" y="307" class="f-label f-muted">GPT-2 large</text>
  <rect x="250.0" y="298" width="180.0" height="6" class="f-accent"/>
  <rect x="250.0" y="305" width="97.5" height="6" class="f-muted" fill-opacity="0.35"/>
  <text x="556" y="308" class="f-label f-ink">72 / 39</text>
  <line x1="550" y1="56" x2="550" y2="318" class="f-plain"/>
  <text x="12" y="332" class="f-label f-muted">ряды 3 и 4 включают все 3 поля и he/his в записях о мужчинах</text>
</svg>
<figcaption>Flan-T5 large отвечает на все короткие вопросы. Flan-T5 base справляется с местоимением, а на &quot;And Leon?&quot; отвечает почти так же, как без предыдущей реплики.</figcaption>
</figure>

Как я это вижу, для "she" модели достаточно найти человека в тексте. Для "And Leon?" ей надо взять вопрос из предыдущей реплики и подставить в него новое имя. Модель на 248M справляется только с местоимением. При 32 вставках результат на "And Leon?" у неё падает до 24 из 120, а полные вопросы при той же длине верны в 115.

<figure class="fig">
<svg viewBox="0 0 640 262" role="img" aria-label="Линии: верные ответы из 120 на &quot;And Leon?&quot; по мере того, как между заметками и вопросами добавляются посторонние вопросы с ответами. Flan-T5 large: 0: 120, 2: 118, 8: 120, 16: 120, 32: 120. Flan-T5 base: 0: 36, 2: 39, 8: 41, 16: 36, 32: 24. GPT-2 large: 0: 91, 32: 102.">
  <text x="12" y="18" class="f-label f-muted">&quot;And Leon?&quot; с посторонними вставками посередине, верных из 120</text>
  <line x1="60" y1="200" x2="600" y2="200" class="f-plain"/>
  <text x="52" y="204" class="f-label f-muted" text-anchor="end">0</text>
  <line x1="60" y1="120" x2="600" y2="120" class="f-plain"/>
  <text x="52" y="124" class="f-label f-muted" text-anchor="end">60</text>
  <line x1="60" y1="40" x2="600" y2="40" class="f-plain"/>
  <text x="52" y="44" class="f-label f-muted" text-anchor="end">120</text>
  <text x="60" y="218" class="f-label f-ink" text-anchor="middle">0</text>
  <text x="60" y="232" class="f-label f-muted" text-anchor="middle">(85)</text>
  <text x="195" y="218" class="f-label f-ink" text-anchor="middle">2</text>
  <text x="195" y="232" class="f-label f-muted" text-anchor="middle">(113)</text>
  <text x="330" y="218" class="f-label f-ink" text-anchor="middle">8</text>
  <text x="330" y="232" class="f-label f-muted" text-anchor="middle">(196)</text>
  <text x="465" y="218" class="f-label f-ink" text-anchor="middle">16</text>
  <text x="465" y="232" class="f-label f-muted" text-anchor="middle">(307)</text>
  <text x="600" y="218" class="f-label f-ink" text-anchor="middle">32</text>
  <text x="600" y="232" class="f-label f-muted" text-anchor="middle">(529)</text>
  <text x="330" y="250" class="f-label f-muted" text-anchor="middle">посторонних вставок (токенов Flan-T5 на входе)</text>
  <polyline points="60,40.0 195,42.7 330,40.0 465,40.0 600,40.0" class="f-line"/>
  <circle cx="60" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="195" cy="42.7" r="3.5" class="f-accent"/>
  <circle cx="330" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="465" cy="40.0" r="3.5" class="f-accent"/>
  <circle cx="600" cy="40.0" r="3.5" class="f-accent"/>
  <text x="592" y="30" class="f-label f-ink" text-anchor="end">Flan-T5 large</text>
  <polyline points="60,152.0 195,148.0 330,145.3 465,152.0 600,168.0" class="f-line"/>
  <circle cx="60" cy="152.0" r="3.5" class="f-ink"/>
  <circle cx="195" cy="148.0" r="3.5" class="f-ink"/>
  <circle cx="330" cy="145.3" r="3.5" class="f-ink"/>
  <circle cx="465" cy="152.0" r="3.5" class="f-ink"/>
  <circle cx="600" cy="168.0" r="3.5" class="f-ink"/>
  <text x="592" y="184" class="f-label f-ink" text-anchor="end">Flan-T5 base</text>
  <circle cx="60" cy="78.7" r="3.5" class="f-muted"/>
  <circle cx="600" cy="64.0" r="3.5" class="f-muted"/>
  <text x="592" y="80" class="f-label f-muted" text-anchor="end">GPT-2 large</text>
</svg>
<figcaption>С 32 вставками на входе около 530 токенов. Flan-T5 large держится на 120, Flan-T5 base падает с 36 до 24, GPT-2 large растёт с 91 до 102.</figcaption>
</figure>

## Модель, которую не учили следовать инструкциям

Я ждал, что GPT-2 large провалится везде. На полный вопрос она верно ответила в 89 записях из 120, хуже обеих моделей Flan. Но на "And Leon?" с предыдущей репликой она отвечает верно в 91 из 120, в 2,5 раза чаще, чем Flan-T5 base. Без реплики только в 6. В 12 своих промахах она ответила данными предыдущего человека: Daniel сантехник, а она ответила "Farmer.", то есть профессией того, о ком спрашивали перед ним. Местоимения у неё слабое место. Ответы на вопросы вроде "How old is she?" верны в 81 с предыдущей репликой и в 44 без неё. При 32 посторонних вставках она стала отвечать на "And Leon?" лучше, 102 из 120. Каждая вставка это ещё один пример вопроса с коротким ответом.

Моё объяснение это догадка. Я его не проверял. Для GPT-2 переписка просто текст, который надо продолжить. После "What does Simon do for a living? Teacher." вероятное продолжение "And Leon?" это ещё одна профессия. Flan-T5 учили отвечать на одну инструкцию за раз. Маленькая из них читает последнюю строку как инструкцию целиком. Есть и разница, которую я не контролировал. Токенизатор T5 выбрасывает переводы строк, поэтому Flan-T5 видит переписку одной строкой с "User:" и "Assistant:" внутри.

## Что это меняет для меня

Короткий вопрос оказался дешёвым. Модель на 783M из октября отвечает на него верно почти всегда, если факты лежат в переписке. Даже GPT-2 2019 года отвечает на "And Leon?" верно 3 раза из 4. Это подтверждает мою версию про обёртку, но только в части механики. Та же большая модель не знает атомный номер золота. Долго разговаривать с ней я бы не стал. Так что поле ввода объясняет успех этой недели только отчасти. Короткий вопрос помогает только после хорошего первого ответа, а первый ответ я здесь не мерил.

Есть ещё цена, о которой я не думал. В моей схеме у модели нет памяти между репликами, поэтому каждый короткий вопрос снова отправляет весь разговор. В самом длинном моём случае 2 слова "And Leon?" стоили около 530 токенов на входе.

## Чего я не проверял

- Сам ChatGPT. У него нет API, так что прогнать по нему 1000 вопросов нельзя.
- Настоящие разговоры. Люди пишут "нет, другой" и "покороче". Мои шаблоны намного чище.
- Более длинные разговоры и языки, кроме английского.
- Flan-T5 XL на 3B параметров. Она не помещается в 5 ГБ памяти, которые у меня есть на этой машине.
- Каждое число это один детерминированный прогон с одним форматом промпта. Другой формат мог бы сдвинуть результаты маленькой модели.
