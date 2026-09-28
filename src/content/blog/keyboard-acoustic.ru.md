---
title: "Простой классификатор назвал клавишу по звуку 99 раз из 100. Обученный на тишине между нажатиями, он всё равно назвал её 39 раз"
description: "Я взял открытые датасеты нажатий, на которых стоит заголовок про 95%, и простую логистическую регрессию. Она назвала клавишу в 92–99 случаях из 100, но та же модель, обученная на тишине между нажатиями, всё равно называла её до 39 раз из 100. Каждая клавиша в этих наборах лежит своим файлом. На паролях, где файл не помогает, вышло 77 из 100. Другая запись того же MacBook опустила результат до 5 или 6%."
date: 2026-09-27
lang: ru
translationKey: keyboard-acoustic
tags: ["machine-learning", "open-data"]
---
Когда речь заходит о звуке клавиатуры, в голове у меня сидит одно число: 95%. В 2023 году Харрисон, Тореини и Мехрнежад положили iPhone рядом с MacBook Pro и обучили нейросеть на звуке клавиш. Она угадала 95% нажатий и 93% на записи Zoom, сделанной через микрофон самого ноутбука. В 2025 году Спата с соавторами получили 98,3% на тех же данных MacBook, потом записали механическую клавиатуру и сообщили о 99% на ней. У меня есть небольшой инструмент earshot, он слушает микрофон и переводит речь в текст. Тот же микрофон слышит каждую клавишу, которую я нажимаю. Про 95% я читал несколько раз и ни разу не спросил, на чём именно это мерили. Оба датасета открыты под лицензией MIT, поэтому в этот раз я их скачал и посмотрел.

## Как устроен замер

Оба набора устроены одинаково. 36 клавиш, цифры и буквы. Каждая клавиша записана отдельным файлом WAV, в нём 25 нажатий подряд примерно раз в секунду. У Харрисона 2 записи одного и того же MacBook. Одна сделана телефоном, лежащим на салфетке из микрофибры, другая через Zoom с частотой 32 кГц с шумоподавлением на минимуме. Набор KAD от Спаты это механическая клавиатура и смартфон в 17 см от неё, плюс 10 паролей, набранных клавиша за клавишей, каждый своей записью.

Я хотел посмотреть, сколько возьмёт простая модель, поэтому без глубокой сети. Python 3.12, numpy 2.5.3, scipy 1.18.1, `scikit-learn` 1.9.0 на 4 ядрах. Каждое нажатие вырезается по порогу энергии, который подстраивается, пока в файле не найдётся ровно 25 нажатий. Потом 330 мс звука превращаются в логарифмическую мел-спектрограмму из 64 полос и на неё смотрит логистическая регрессия. Случайное угадывание при 36 клавишах даёт 2,8%.

Для проверки я делил нажатия по их месту в файле: нажатия с 0 по 4 в одном блоке, с 5 по 9 в следующем и так далее. При случайном разбиении у большинства тестовых нажатий соседи по времени попали бы в обучение. Здесь сосед в обучении есть только у нажатий на краю блока.

Вышло 92,4% на MacBook через телефон, 84,6% через Zoom и 99,3% на механической клавиатуре. Линейная модель без аугментации оказалась в пределах 3 пунктов от сети Харрисона на записи с телефона. На механической клавиатуре она сравнялась с 99% у Спаты. Этого я не ждал. На Zoom она отстала на 8 пунктов. На записи с телефона Спата с соавторами получили 98,3%, на 6 пунктов больше моего. В статьях данные делили иначе, так что сравнение грубое.

## Где я перестал верить

Потом я ещё раз посмотрел на устройство файлов и меня это насторожило. Каждая клавиша живёт в своей записи. Допустим, телефон немного сдвинулся между записью `a` и записью `b`. Тогда классификатор может выучить файл вместо клавиши. Проверка выше этого не заметит, потому что тестовые нажатия берутся из тех же файлов.

Поэтому я обучил ту же модель на тишине. От каждого нажатия я взял 200 мс, которые начинаются через 400 мс после него. Звук там уже на 24–36 дБ тише нажатия. И спросил, какой клавише принадлежит этот кусок тишины. На MacBook через телефон тишина назвала клавишу в 29,4% случаев, через Zoom в 16,1%, на механической клавиатуре в 39,4%. Это в 6–14 раз выше случайного уровня.

Самой записи, без нажатия, хватает, чтобы назвать клавишу. Классификатор на нажатиях, возможно, тоже этим пользуется. Насколько, по этим файлам я сказать не могу.

<figure class="fig">
<svg viewBox="0 0 640 246" role="img" aria-label="Горизонтальные столбцы, доля нажатий, где логистическая регрессия назвала клавишу верно, случайное угадывание 2,8%. MacBook Pro через iPhone: нажатие 92,4%, тишина между нажатиями 29,4%. MacBook Pro через Zoom: нажатие 84,6%, тишина 16,1%. Механическая клавиатура: нажатие 99,3%, тишина 39,4%, нажатия внутри паролей, набранных клавиша за клавишей, 77%.">
  <text x="12" y="16" class="f-label f-muted">доля нажатий, где клавиша названа верно</text>
  <text x="12" y="51" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="66" class="f-label f-muted">iPhone рядом</text>
  <text x="242" y="51" text-anchor="end" class="f-label f-muted">нажатие</text>
  <rect x="250" y="40" width="277.3" height="14" class="f-box"/>
  <text x="533.3" y="51" class="f-mono f-ink">92,4%</text>
  <text x="242" y="71" text-anchor="end" class="f-label f-muted">только тишина</text>
  <rect x="250" y="60" width="88.2" height="14" class="f-plain"/>
  <text x="344.2" y="71" class="f-mono f-ink">29,4%</text>
  <text x="12" y="109" class="f-mono f-ink">MacBook Pro</text>
  <text x="12" y="124" class="f-label f-muted">запись Zoom</text>
  <text x="242" y="109" text-anchor="end" class="f-label f-muted">нажатие</text>
  <rect x="250" y="98" width="253.7" height="14" class="f-box"/>
  <text x="509.7" y="109" class="f-mono f-ink">84,6%</text>
  <text x="242" y="129" text-anchor="end" class="f-label f-muted">только тишина</text>
  <rect x="250" y="118" width="48.3" height="14" class="f-plain"/>
  <text x="304.3" y="129" class="f-mono f-ink">16,1%</text>
  <text x="12" y="167" class="f-mono f-ink">механическая</text>
  <text x="12" y="182" class="f-label f-muted">телефон в 17 см</text>
  <text x="242" y="167" text-anchor="end" class="f-label f-muted">нажатие</text>
  <rect x="250" y="156" width="298.0" height="14" class="f-box"/>
  <text x="554.0" y="167" class="f-mono f-ink">99,3%</text>
  <text x="242" y="187" text-anchor="end" class="f-label f-muted">только тишина</text>
  <rect x="250" y="176" width="118.3" height="14" class="f-plain"/>
  <text x="374.3" y="187" class="f-mono f-ink">39,4%</text>
  <text x="242" y="207" text-anchor="end" class="f-label f-muted">пароли</text>
  <rect x="250" y="196" width="231.0" height="14" class="f-accent"/>
  <text x="487.0" y="207" class="f-mono f-ink">77%</text>
  <line x1="258.3" y1="34" x2="258.3" y2="224" class="f-line" stroke-dasharray="3 3"/>
  <text x="258.3" y="238" text-anchor="middle" class="f-label f-muted">наугад 2,8%</text>
</svg>
<figcaption>Тишина это 200 мс, которые начинаются через 400 мс после нажатия, когда звук нажатия по большей части затих. Каждая клавиша в этих датасетах лежит своим файлом, поэтому тишина, скорее всего, называет клавишу через запись. Пароли это 100 нажатий внутри 10 слов, проверка, где файл помочь не может.</figcaption>
</figure>

Пароли KAD это проверка, в которой файл помочь не может. Там клавиши идут друг за другом внутри одной записи. Я обучил модель на всех 900 нажатиях из файлов клавиш и проверил на 100 нажатиях внутри 10 паролей. Сколько символов в каждом пароле, я заранее сообщил коду, который вырезает нажатия. Верными оказались 77 из 100. В 93 из 100 верная клавиша была в первой пятёрке. Целиком угадался 1 пароль из 10, `baseball47`. Хуже всех вышел `position90`, услышанный как `ppsvtnpk00`.

<figure class="fig">
<svg viewBox="0 0 640 288" role="img" aria-label="Таблица из 10 паролей KAD, рядом с каждым набранным паролем то, что услышал классификатор, неверные символы выделены: baseball47 baseball47, cultural12 cultural10, fragrant34 fralrant34, friendly56 fzkendly56, grateful10 lznzeful10, hardship38 hardshil37, ideology78 idelkpgy73, nominate29 nominatex9, position90 ppsvtnpk00, suppress56 supnresx56. Верно 77 символов из 100, в первой пятёрке 93 из 100.">
  <text x="12" y="16" class="f-label f-muted">пароли KAD: что набрано и что услышано</text>
  <text x="60" y="38" class="f-label f-muted">набрано</text>
  <text x="230" y="38" class="f-label f-muted">услышано</text>
  <text x="440" y="38" text-anchor="end" class="f-label f-muted">верно</text>
  <text x="540" y="38" text-anchor="end" class="f-label f-muted">в пятёрке</text>
  <text x="60" y="63" class="f-mono f-ink">b</text>
  <text x="72" y="63" class="f-mono f-ink">a</text>
  <text x="84" y="63" class="f-mono f-ink">s</text>
  <text x="96" y="63" class="f-mono f-ink">e</text>
  <text x="108" y="63" class="f-mono f-ink">b</text>
  <text x="120" y="63" class="f-mono f-ink">a</text>
  <text x="132" y="63" class="f-mono f-ink">l</text>
  <text x="144" y="63" class="f-mono f-ink">l</text>
  <text x="156" y="63" class="f-mono f-ink">4</text>
  <text x="168" y="63" class="f-mono f-ink">7</text>
  <text x="230" y="63" class="f-mono f-muted">b</text>
  <text x="242" y="63" class="f-mono f-muted">a</text>
  <text x="254" y="63" class="f-mono f-muted">s</text>
  <text x="266" y="63" class="f-mono f-muted">e</text>
  <text x="278" y="63" class="f-mono f-muted">b</text>
  <text x="290" y="63" class="f-mono f-muted">a</text>
  <text x="302" y="63" class="f-mono f-muted">l</text>
  <text x="314" y="63" class="f-mono f-muted">l</text>
  <text x="326" y="63" class="f-mono f-muted">4</text>
  <text x="338" y="63" class="f-mono f-muted">7</text>
  <text x="440" y="63" text-anchor="end" class="f-mono f-ink">10/10</text>
  <text x="540" y="63" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="84" class="f-mono f-ink">c</text>
  <text x="72" y="84" class="f-mono f-ink">u</text>
  <text x="84" y="84" class="f-mono f-ink">l</text>
  <text x="96" y="84" class="f-mono f-ink">t</text>
  <text x="108" y="84" class="f-mono f-ink">u</text>
  <text x="120" y="84" class="f-mono f-ink">r</text>
  <text x="132" y="84" class="f-mono f-ink">a</text>
  <text x="144" y="84" class="f-mono f-ink">l</text>
  <text x="156" y="84" class="f-mono f-ink">1</text>
  <text x="168" y="84" class="f-mono f-ink">2</text>
  <text x="230" y="84" class="f-mono f-muted">c</text>
  <text x="242" y="84" class="f-mono f-muted">u</text>
  <text x="254" y="84" class="f-mono f-muted">l</text>
  <text x="266" y="84" class="f-mono f-muted">t</text>
  <text x="278" y="84" class="f-mono f-muted">u</text>
  <text x="290" y="84" class="f-mono f-muted">r</text>
  <text x="302" y="84" class="f-mono f-muted">a</text>
  <text x="314" y="84" class="f-mono f-muted">l</text>
  <text x="326" y="84" class="f-mono f-muted">1</text>
  <rect x="336" y="71" width="12" height="17" class="f-box"/>
  <text x="338" y="84" class="f-mono f-accent">0</text>
  <text x="440" y="84" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="84" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="105" class="f-mono f-ink">f</text>
  <text x="72" y="105" class="f-mono f-ink">r</text>
  <text x="84" y="105" class="f-mono f-ink">a</text>
  <text x="96" y="105" class="f-mono f-ink">g</text>
  <text x="108" y="105" class="f-mono f-ink">r</text>
  <text x="120" y="105" class="f-mono f-ink">a</text>
  <text x="132" y="105" class="f-mono f-ink">n</text>
  <text x="144" y="105" class="f-mono f-ink">t</text>
  <text x="156" y="105" class="f-mono f-ink">3</text>
  <text x="168" y="105" class="f-mono f-ink">4</text>
  <text x="230" y="105" class="f-mono f-muted">f</text>
  <text x="242" y="105" class="f-mono f-muted">r</text>
  <text x="254" y="105" class="f-mono f-muted">a</text>
  <rect x="264" y="92" width="12" height="17" class="f-box"/>
  <text x="266" y="105" class="f-mono f-accent">l</text>
  <text x="278" y="105" class="f-mono f-muted">r</text>
  <text x="290" y="105" class="f-mono f-muted">a</text>
  <text x="302" y="105" class="f-mono f-muted">n</text>
  <text x="314" y="105" class="f-mono f-muted">t</text>
  <text x="326" y="105" class="f-mono f-muted">3</text>
  <text x="338" y="105" class="f-mono f-muted">4</text>
  <text x="440" y="105" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="105" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="126" class="f-mono f-ink">f</text>
  <text x="72" y="126" class="f-mono f-ink">r</text>
  <text x="84" y="126" class="f-mono f-ink">i</text>
  <text x="96" y="126" class="f-mono f-ink">e</text>
  <text x="108" y="126" class="f-mono f-ink">n</text>
  <text x="120" y="126" class="f-mono f-ink">d</text>
  <text x="132" y="126" class="f-mono f-ink">l</text>
  <text x="144" y="126" class="f-mono f-ink">y</text>
  <text x="156" y="126" class="f-mono f-ink">5</text>
  <text x="168" y="126" class="f-mono f-ink">6</text>
  <text x="230" y="126" class="f-mono f-muted">f</text>
  <rect x="240" y="113" width="12" height="17" class="f-box"/>
  <text x="242" y="126" class="f-mono f-accent">z</text>
  <rect x="252" y="113" width="12" height="17" class="f-box"/>
  <text x="254" y="126" class="f-mono f-accent">k</text>
  <text x="266" y="126" class="f-mono f-muted">e</text>
  <text x="278" y="126" class="f-mono f-muted">n</text>
  <text x="290" y="126" class="f-mono f-muted">d</text>
  <text x="302" y="126" class="f-mono f-muted">l</text>
  <text x="314" y="126" class="f-mono f-muted">y</text>
  <text x="326" y="126" class="f-mono f-muted">5</text>
  <text x="338" y="126" class="f-mono f-muted">6</text>
  <text x="440" y="126" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="126" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="147" class="f-mono f-ink">g</text>
  <text x="72" y="147" class="f-mono f-ink">r</text>
  <text x="84" y="147" class="f-mono f-ink">a</text>
  <text x="96" y="147" class="f-mono f-ink">t</text>
  <text x="108" y="147" class="f-mono f-ink">e</text>
  <text x="120" y="147" class="f-mono f-ink">f</text>
  <text x="132" y="147" class="f-mono f-ink">u</text>
  <text x="144" y="147" class="f-mono f-ink">l</text>
  <text x="156" y="147" class="f-mono f-ink">1</text>
  <text x="168" y="147" class="f-mono f-ink">0</text>
  <rect x="228" y="134" width="12" height="17" class="f-box"/>
  <text x="230" y="147" class="f-mono f-accent">l</text>
  <rect x="240" y="134" width="12" height="17" class="f-box"/>
  <text x="242" y="147" class="f-mono f-accent">z</text>
  <rect x="252" y="134" width="12" height="17" class="f-box"/>
  <text x="254" y="147" class="f-mono f-accent">n</text>
  <rect x="264" y="134" width="12" height="17" class="f-box"/>
  <text x="266" y="147" class="f-mono f-accent">z</text>
  <text x="278" y="147" class="f-mono f-muted">e</text>
  <text x="290" y="147" class="f-mono f-muted">f</text>
  <text x="302" y="147" class="f-mono f-muted">u</text>
  <text x="314" y="147" class="f-mono f-muted">l</text>
  <text x="326" y="147" class="f-mono f-muted">1</text>
  <text x="338" y="147" class="f-mono f-muted">0</text>
  <text x="440" y="147" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="147" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="168" class="f-mono f-ink">h</text>
  <text x="72" y="168" class="f-mono f-ink">a</text>
  <text x="84" y="168" class="f-mono f-ink">r</text>
  <text x="96" y="168" class="f-mono f-ink">d</text>
  <text x="108" y="168" class="f-mono f-ink">s</text>
  <text x="120" y="168" class="f-mono f-ink">h</text>
  <text x="132" y="168" class="f-mono f-ink">i</text>
  <text x="144" y="168" class="f-mono f-ink">p</text>
  <text x="156" y="168" class="f-mono f-ink">3</text>
  <text x="168" y="168" class="f-mono f-ink">8</text>
  <text x="230" y="168" class="f-mono f-muted">h</text>
  <text x="242" y="168" class="f-mono f-muted">a</text>
  <text x="254" y="168" class="f-mono f-muted">r</text>
  <text x="266" y="168" class="f-mono f-muted">d</text>
  <text x="278" y="168" class="f-mono f-muted">s</text>
  <text x="290" y="168" class="f-mono f-muted">h</text>
  <text x="302" y="168" class="f-mono f-muted">i</text>
  <rect x="312" y="155" width="12" height="17" class="f-box"/>
  <text x="314" y="168" class="f-mono f-accent">l</text>
  <text x="326" y="168" class="f-mono f-muted">3</text>
  <rect x="336" y="155" width="12" height="17" class="f-box"/>
  <text x="338" y="168" class="f-mono f-accent">7</text>
  <text x="440" y="168" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="168" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="189" class="f-mono f-ink">i</text>
  <text x="72" y="189" class="f-mono f-ink">d</text>
  <text x="84" y="189" class="f-mono f-ink">e</text>
  <text x="96" y="189" class="f-mono f-ink">o</text>
  <text x="108" y="189" class="f-mono f-ink">l</text>
  <text x="120" y="189" class="f-mono f-ink">o</text>
  <text x="132" y="189" class="f-mono f-ink">g</text>
  <text x="144" y="189" class="f-mono f-ink">y</text>
  <text x="156" y="189" class="f-mono f-ink">7</text>
  <text x="168" y="189" class="f-mono f-ink">8</text>
  <text x="230" y="189" class="f-mono f-muted">i</text>
  <text x="242" y="189" class="f-mono f-muted">d</text>
  <text x="254" y="189" class="f-mono f-muted">e</text>
  <rect x="264" y="176" width="12" height="17" class="f-box"/>
  <text x="266" y="189" class="f-mono f-accent">l</text>
  <rect x="276" y="176" width="12" height="17" class="f-box"/>
  <text x="278" y="189" class="f-mono f-accent">k</text>
  <rect x="288" y="176" width="12" height="17" class="f-box"/>
  <text x="290" y="189" class="f-mono f-accent">p</text>
  <text x="302" y="189" class="f-mono f-muted">g</text>
  <text x="314" y="189" class="f-mono f-muted">y</text>
  <text x="326" y="189" class="f-mono f-muted">7</text>
  <rect x="336" y="176" width="12" height="17" class="f-box"/>
  <text x="338" y="189" class="f-mono f-accent">3</text>
  <text x="440" y="189" text-anchor="end" class="f-mono f-ink">6/10</text>
  <text x="540" y="189" text-anchor="end" class="f-mono f-muted">7/10</text>
  <text x="60" y="210" class="f-mono f-ink">n</text>
  <text x="72" y="210" class="f-mono f-ink">o</text>
  <text x="84" y="210" class="f-mono f-ink">m</text>
  <text x="96" y="210" class="f-mono f-ink">i</text>
  <text x="108" y="210" class="f-mono f-ink">n</text>
  <text x="120" y="210" class="f-mono f-ink">a</text>
  <text x="132" y="210" class="f-mono f-ink">t</text>
  <text x="144" y="210" class="f-mono f-ink">e</text>
  <text x="156" y="210" class="f-mono f-ink">2</text>
  <text x="168" y="210" class="f-mono f-ink">9</text>
  <text x="230" y="210" class="f-mono f-muted">n</text>
  <text x="242" y="210" class="f-mono f-muted">o</text>
  <text x="254" y="210" class="f-mono f-muted">m</text>
  <text x="266" y="210" class="f-mono f-muted">i</text>
  <text x="278" y="210" class="f-mono f-muted">n</text>
  <text x="290" y="210" class="f-mono f-muted">a</text>
  <text x="302" y="210" class="f-mono f-muted">t</text>
  <text x="314" y="210" class="f-mono f-muted">e</text>
  <rect x="324" y="197" width="12" height="17" class="f-box"/>
  <text x="326" y="210" class="f-mono f-accent">x</text>
  <text x="338" y="210" class="f-mono f-muted">9</text>
  <text x="440" y="210" text-anchor="end" class="f-mono f-ink">9/10</text>
  <text x="540" y="210" text-anchor="end" class="f-mono f-muted">10/10</text>
  <text x="60" y="231" class="f-mono f-ink">p</text>
  <text x="72" y="231" class="f-mono f-ink">o</text>
  <text x="84" y="231" class="f-mono f-ink">s</text>
  <text x="96" y="231" class="f-mono f-ink">i</text>
  <text x="108" y="231" class="f-mono f-ink">t</text>
  <text x="120" y="231" class="f-mono f-ink">i</text>
  <text x="132" y="231" class="f-mono f-ink">o</text>
  <text x="144" y="231" class="f-mono f-ink">n</text>
  <text x="156" y="231" class="f-mono f-ink">9</text>
  <text x="168" y="231" class="f-mono f-ink">0</text>
  <text x="230" y="231" class="f-mono f-muted">p</text>
  <rect x="240" y="218" width="12" height="17" class="f-box"/>
  <text x="242" y="231" class="f-mono f-accent">p</text>
  <text x="254" y="231" class="f-mono f-muted">s</text>
  <rect x="264" y="218" width="12" height="17" class="f-box"/>
  <text x="266" y="231" class="f-mono f-accent">v</text>
  <text x="278" y="231" class="f-mono f-muted">t</text>
  <rect x="288" y="218" width="12" height="17" class="f-box"/>
  <text x="290" y="231" class="f-mono f-accent">n</text>
  <rect x="300" y="218" width="12" height="17" class="f-box"/>
  <text x="302" y="231" class="f-mono f-accent">p</text>
  <rect x="312" y="218" width="12" height="17" class="f-box"/>
  <text x="314" y="231" class="f-mono f-accent">k</text>
  <rect x="324" y="218" width="12" height="17" class="f-box"/>
  <text x="326" y="231" class="f-mono f-accent">0</text>
  <text x="338" y="231" class="f-mono f-muted">0</text>
  <text x="440" y="231" text-anchor="end" class="f-mono f-ink">4/10</text>
  <text x="540" y="231" text-anchor="end" class="f-mono f-muted">9/10</text>
  <text x="60" y="252" class="f-mono f-ink">s</text>
  <text x="72" y="252" class="f-mono f-ink">u</text>
  <text x="84" y="252" class="f-mono f-ink">p</text>
  <text x="96" y="252" class="f-mono f-ink">p</text>
  <text x="108" y="252" class="f-mono f-ink">r</text>
  <text x="120" y="252" class="f-mono f-ink">e</text>
  <text x="132" y="252" class="f-mono f-ink">s</text>
  <text x="144" y="252" class="f-mono f-ink">s</text>
  <text x="156" y="252" class="f-mono f-ink">5</text>
  <text x="168" y="252" class="f-mono f-ink">6</text>
  <text x="230" y="252" class="f-mono f-muted">s</text>
  <text x="242" y="252" class="f-mono f-muted">u</text>
  <text x="254" y="252" class="f-mono f-muted">p</text>
  <rect x="264" y="239" width="12" height="17" class="f-box"/>
  <text x="266" y="252" class="f-mono f-accent">n</text>
  <text x="278" y="252" class="f-mono f-muted">r</text>
  <text x="290" y="252" class="f-mono f-muted">e</text>
  <text x="302" y="252" class="f-mono f-muted">s</text>
  <rect x="312" y="239" width="12" height="17" class="f-box"/>
  <text x="314" y="252" class="f-mono f-accent">x</text>
  <text x="326" y="252" class="f-mono f-muted">5</text>
  <text x="338" y="252" class="f-mono f-muted">6</text>
  <text x="440" y="252" text-anchor="end" class="f-mono f-ink">8/10</text>
  <text x="540" y="252" text-anchor="end" class="f-mono f-muted">9/10</text>
  <line x1="60" y1="262" x2="545" y2="262" class="f-plain"/>
  <text x="440" y="278" text-anchor="end" class="f-mono f-ink">77/100</text>
  <text x="540" y="278" text-anchor="end" class="f-mono f-muted">93/100</text>
</svg>
<figcaption>Обучение на 900 нажатиях из файлов клавиш, проверка на паролях. Выделены неверно угаданные символы.</figcaption>
</figure>

Из 23 неверных догадок 10 попали на физического соседа верной клавиши. Случайная пара клавиш на этой раскладке оказывается соседней в 13% случаев. Со словарём это полезный список кандидатов, но для пароля с цифрами в конце всё равно нужно 10 верных догадок подряд.

Спата с соавторами сделали похожую проверку, на 8 паролях, записанных позже на той же клавиатуре. Их сеть получила в среднем 89,1%. Их паролей в открытом наборе нет, поэтому напрямую сравнить я не могу, но это на 12 пунктов выше моих 77. В статье Харрисона такой проверки нет.

## Где ломается

**Другая запись той же клавиатуры.** Я обучил модель на записи с телефона и проверил на записи Zoom, тот же MacBook и тот же человек за клавиатурой. Вышло 6,3%. Обратное направление дало 4,9%. Я думал, что причина в разной полосе частот: Zoom на 32 кГц против 44,1 кГц у телефона. Поэтому я оставил только мел-полосы ниже 8 кГц и вычел из каждой записи её средний логарифмический мел-спектр, это вроде грубого эквалайзера. Лучшее, что из этого вышло, 12%, в 4 раза выше случайного. Здесь меняются сразу три вещи: микрофон, сеанс записи и обработка Zoom. Разделить их я не могу. 92% и 85% на первом графике это 2 отдельные модели, каждая обучена на своей записи.

**Шум.** Здесь я сначала ошибся. Я добавил белый шум на 30 дБ тише нажатия и модель MacBook упала до случайного угадывания. Я какое-то время искал ошибку в коде шума, прежде чем сравнил уровни по полосам. Большая часть звука комнаты в записи телефона приходится на нижние полосы. Выше 1,1 кГц там так тихо, что даже шум на 60 дБ тише нажатия громче комнаты. Так в 47 полосах из 64. Когда последние 5 нажатий каждого файла отложены на проверку, у модели было 88% на чистых нажатиях, 43% при 60 дБ и 5,6% при 50 дБ. Я предполагаю, что она опирается на эти почти беззвучные верхние полосы.

Тогда я добавил тот же шум того же уровня и в обучающие нажатия. Модель MacBook держит 86% при 60 дБ, 61% при 30 дБ и 26% при 0 дБ, где шум так же громок, как само нажатие. Механическая клавиатура остаётся на 97% даже при 0 дБ. Каждая из этих моделей знала уровень шума заранее.

<figure class="fig">
<svg viewBox="0 0 640 328" role="img" aria-label="Линейный график: точность в зависимости от белого шума в тестовых нажатиях, от записи без шума до шума на уровне нажатия, 0 дБ. MacBook, обучен с шумом: без шума 87,8%, 60 дБ 86,1%, 50 дБ 85,6%, 40 дБ 76,1%, 30 дБ 61,1%, 20 дБ 47,8%, 10 дБ 33,9%, 0 дБ 26,1%. MacBook, обучен без шума: без шума 87,8%, 60 дБ 43,3%, 50 дБ 5,6%, 40 дБ 2,8%, 30 дБ 2,8%, 20 дБ 2,8%, 10 дБ 2,8%, 0 дБ 2,8%. механическая, обучена с шумом: без шума 100%, 60 дБ 100%, 50 дБ 100%, 40 дБ 100%, 30 дБ 100%, 20 дБ 100%, 10 дБ 100%, 0 дБ 96,7%. механическая, обучена без шума: без шума 100%, 60 дБ 100%, 50 дБ 100%, 40 дБ 99,4%, 30 дБ 97,8%, 20 дБ 45,6%, 10 дБ 19,4%, 0 дБ 8,3%.">
  <text x="12" y="16" class="f-label f-muted">белый шум, добавленный к тестовым нажатиям</text>
  <line x1="70" y1="240" x2="590" y2="240" class="f-plain"/>
  <text x="62" y="244" text-anchor="end" class="f-label f-muted">0%</text>
  <line x1="70" y1="190" x2="590" y2="190" class="f-plain"/>
  <text x="62" y="194" text-anchor="end" class="f-label f-muted">25%</text>
  <line x1="70" y1="140" x2="590" y2="140" class="f-plain"/>
  <text x="62" y="144" text-anchor="end" class="f-label f-muted">50%</text>
  <line x1="70" y1="90" x2="590" y2="90" class="f-plain"/>
  <text x="62" y="94" text-anchor="end" class="f-label f-muted">75%</text>
  <line x1="70" y1="40" x2="590" y2="40" class="f-plain"/>
  <text x="62" y="44" text-anchor="end" class="f-label f-muted">100%</text>
  <line x1="70" y1="234.4" x2="590" y2="234.4" class="f-line" stroke-dasharray="3 3"/>
  <text x="70" y="258" text-anchor="middle" class="f-label f-muted">без шума</text>
  <text x="144.28571428571428" y="258" text-anchor="middle" class="f-label f-muted">60</text>
  <text x="218.57142857142858" y="258" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="292.8571428571429" y="258" text-anchor="middle" class="f-label f-muted">40</text>
  <text x="367.14285714285717" y="258" text-anchor="middle" class="f-label f-muted">30</text>
  <text x="441.42857142857144" y="258" text-anchor="middle" class="f-label f-muted">20</text>
  <text x="515.7142857142858" y="258" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="590" y="258" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="590" y="274" text-anchor="end" class="f-label f-muted">дБ, насколько шум тише нажатия</text>
  <polyline points="70.0,64.4 144.3,67.8 218.6,68.9 292.9,87.8 367.1,117.8 441.4,144.4 515.7,172.2 590.0,187.8" fill="none" style="stroke:var(--accent);stroke-width:2"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="67.8" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="68.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="87.8" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="117.8" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="144.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="172.2" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="187.8" r="2.6" class="f-accent"/>
  <polyline points="70.0,64.4 144.3,153.3 218.6,228.9 292.9,234.4 367.1,234.4 441.4,234.4 515.7,234.4 590.0,234.4" fill="none" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="64.4" r="2.6" class="f-accent"/>
  <circle cx="144.3" cy="153.3" r="2.6" class="f-accent"/>
  <circle cx="218.6" cy="228.9" r="2.6" class="f-accent"/>
  <circle cx="292.9" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="367.1" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="441.4" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="515.7" cy="234.4" r="2.6" class="f-accent"/>
  <circle cx="590.0" cy="234.4" r="2.6" class="f-accent"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,40.0 367.1,40.0 441.4,40.0 515.7,40.0 590.0,46.7" fill="none" style="stroke:var(--ink);stroke-width:2"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="46.7" r="2.6" class="f-ink"/>
  <polyline points="70.0,40.0 144.3,40.0 218.6,40.0 292.9,41.1 367.1,44.4 441.4,148.9 515.7,201.1 590.0,223.3" fill="none" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <circle cx="70.0" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="144.3" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="218.6" cy="40.0" r="2.6" class="f-ink"/>
  <circle cx="292.9" cy="41.1" r="2.6" class="f-ink"/>
  <circle cx="367.1" cy="44.4" r="2.6" class="f-ink"/>
  <circle cx="441.4" cy="148.9" r="2.6" class="f-ink"/>
  <circle cx="515.7" cy="201.1" r="2.6" class="f-ink"/>
  <circle cx="590.0" cy="223.3" r="2.6" class="f-ink"/>
  <line x1="70" y1="294" x2="96" y2="294" style="stroke:var(--accent);stroke-width:2"/>
  <text x="104" y="298" class="f-label f-muted">MacBook, обучен с шумом</text>
  <line x1="340" y1="294" x2="366" y2="294" style="stroke:var(--accent);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="298" class="f-label f-muted">MacBook, обучен без шума</text>
  <line x1="70" y1="312" x2="96" y2="312" style="stroke:var(--ink);stroke-width:2"/>
  <text x="104" y="316" class="f-label f-muted">механическая, обучена с шумом</text>
  <line x1="340" y1="312" x2="366" y2="312" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="5 4"/>
  <text x="374" y="316" class="f-label f-muted">механическая, обучена без шума</text>
</svg>
<figcaption>Проверка на последних 5 нажатиях каждого файла клавиши, обучение на первых 20. Уровень шума отсчитан от мощности первых 100 мс каждого нажатия. Пунктирная горизонталь это случайное угадывание, 2,8%.</figcaption>
</figure>

**Обучающие данные.** Всё это требует размеченных нажатий именно этой клавиатуры именно в этом месте. На тех же отложенных нажатиях 1 размеченное нажатие на клавишу дало модели MacBook 11%, 5 нажатий 41%, 20 нажатий 88%. Механической клавиатуре нужно меньше: 50% с 1 нажатия и 89% с 5. Кто-то должен сначала нажать каждую клавишу под запись или атакующему придётся разметить нажатия другим способом. Работы, где это делают без разметки, используют языковую модель. Это отдельная задача и я её не повторял.

## Чего я не проверял

Я не записывал свою клавиатуру. Замер шёл на сервере без микрофона, так что всё выше это 2 открытых датасета и 3 записи. В наборе Харрисона печатал один человек, про KAD не сказано. Я не пробовал глубокие сети из статей, так что перенос между записями с ними может выйти лучше. Я не пробовал печатать в обычном темпе, где нажатия накладываются, потому что моей нарезке нужно 200 мс между нажатиями. На записи MacBook в окне тишины звук ещё затухает, так что часть из этих 29% может приходиться на звук самой клавиши. Проверка на паролях от этого не зависит. Каждое число здесь получено за 1 прогон. Мои модели детерминированы, а генератор шума запускается с фиксированным зерном.

Для меня итог скромнее заголовка. Звук клавиши действительно выдаёт клавишу. На проверке паролями моя линейная модель получила 77 из 100, а сеть Спаты 89,1% на своих. Но в обоих случаях это та же клавиатура, та же комната и тот же микрофон, что и при обучении. С моей моделью другая запись того же MacBook опускает результат до 5 или 6%. Какая часть из 95% на MacBook пришла из файла, по этому датасету я сказать не могу.
