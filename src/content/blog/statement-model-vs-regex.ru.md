---
title: "Модель за моими регулярками для выписок превратила 300 громких отказов в 249 тихих ошибок"
description: "Я написал регулярки под 2 формата банковской выписки и дал те же 600 операций в 4 форматах Flan-T5 base и large. Регулярка громко отказала на 2 форматах, которых не видела. Модель ошибалась в дате чаще, чем в сумме, отвечала первым днём периода и остатком. Почти никогда так, чтобы это вызвало ошибку. Схема сначала регулярка, потом модель дала больше верных ответов и 249 тихих неверных."
date: 2022-12-15
lang: ru
translationKey: statement-model-vs-regex
tags: ["llm", "reliability", "text"]
---
С тех пор как 2 недели назад вышел ChatGPT, у меня в ленте полно скриншотов, где человек вставляет в него документ и получает обратно поля. Банковская выписка тут классический случай. Каждый банк выгружает её по-своему. Обычное решение это парсер с регуляркой под каждый банк. Он ломается в тот день, когда банк меняет формат выгрузки. Я ни разу не замерял, как модель справляется по сравнению с таким парсером. Я считал, что дату модель хотя бы скопирует правильно. Поэтому вопрос для меня был только в том, как часто она ошибается в сумме.

## Стенд

Я взял 4 формата выписки и сгенерировал скриптом по 150 операций на формат, seed 2022, так что каждый верный ответ известен. Каждая операция должна превратиться в 3 поля: дату, сумму со знаком (расход с минусом) и контрагента. Форматы выглядят так:

```
A  14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37
B  Date: 2022-06-20  Description: Transfer to Piotr Wisniewski, title: gift  Amount: -2,327.19 PLN  Balance: -5,575.15 PLN
C  12 Jun 2022  CARD PAYMENT BOOKING.COM 33.40 EUR  157.32 DR  25,180.67 CR
D  15/06/2022  Card payment                4.55                 53,361.89
               AUCHAN 5293 GDANSK
```

Последнее число в каждой строке это остаток после операции. У оплат картой за границей в описании есть ещё сумма в валюте операции. Парсер на регулярках я написал только под A и B, 34 строки на Python. Написал до того, как посмотрел на C и D. C и D играют роль банка, который сменил формат выгрузки.

Модель это Flan-T5 от Google в двух размерах, base (250 млн параметров) и large (780 млн). Обе вышли в октябре и работают у меня на машине: 4 ядра виртуалки на AMD EPYC, Python 3.9, torch 1.13, transformers 4.25.1, жадное декодирование. На каждую операцию 4 вопроса: дата, сумма, направление платежа и кто вторая сторона. В промпте есть ещё строка выписки с первым и последним днём периода. В настоящей выписке она тоже есть, по ней видно, в каком формате банк пишет даты. Оба способа получают операции уже нарезанными на блоки, так что разбиение страницы в замер не входит.

Операция считается верной, только если верны все 3 поля. Неверный результат громкий, когда он не разбирается. Это значит, что регулярка не совпала или модель выдала вместо даты что-то, что датой не является. Тихий, когда он разбирается, но неверен.

## Регулярки

На A и B парсер верно разобрал 293 операции из 300. 7 неверных на моей совести. В строке перевода формата A имя и назначение платежа идут подряд капсом, без разделителя: `TRANSFER FROM JAN KOWALSKI LOAN BACK`. За имя я брал первые 2 слова. Для зарплаты от `SOFTHOUSE SP. Z O.O.` это даёт `SOFTHOUSE SP.`, а парсер молчит. Это правило я писал, не думая про компании.

На C и D не совпала ни одна регулярка, все 300 отказов громкие. Этого я и ждал. Это же обычный довод в пользу модели.

## Модель

Flan-T5 large верно разобрала 91 операцию из 600. Base разобрала 107, так что модель побольше лучше не оказалась.

<figure class="fig">
<svg viewBox="0 0 640 352" role="img" aria-label="Составные столбцы, 150 операций на формат. Регулярки под A и B, формат A: верно 143, громко 0, тихо 7. Регулярки под A и B, формат B: верно 150, громко 0, тихо 0. Регулярки под A и B, формат C: верно 0, громко 150, тихо 0. Регулярки под A и B, формат D: верно 0, громко 150, тихо 0. Flan-T5 base, формат A: верно 1, громко 64, тихо 85. Flan-T5 base, формат B: верно 74, громко 0, тихо 76. Flan-T5 base, формат C: верно 25, громко 23, тихо 102. Flan-T5 base, формат D: верно 7, громко 1, тихо 142. Flan-T5 large, формат A: верно 2, громко 23, тихо 125. Flan-T5 large, формат B: верно 47, громко 0, тихо 103. Flan-T5 large, формат C: верно 15, громко 9, тихо 126. Flan-T5 large, формат D: верно 27, громко 0, тихо 123.">
  <text x="12" y="18" class="f-label f-muted">операции по форматам, по 150</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">верно</text>
  <rect x="77" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="95" y="40" class="f-mono f-ink" style="font-size:11px">неверно, громко</text>
  <rect x="212" y="31" width="12" height="10" class="f-accent"/>
  <text x="230" y="40" class="f-mono f-ink" style="font-size:11px">неверно, тихо</text>
  <text x="12" y="68" class="f-mono f-accent" style="font-size:12px">регулярки под A и B</text>
  <text x="28" y="86" class="f-mono f-ink" style="font-size:11px">A  знакомые</text>
  <rect x="210" y="76" width="286" height="12" class="f-box"/>
  <rect x="496" y="76" width="14" height="12" class="f-accent"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">143/0/7</text>
  <text x="28" y="104" class="f-mono f-ink" style="font-size:11px">B  знакомые</text>
  <rect x="210" y="94" width="300" height="12" class="f-box"/>
  <text x="520" y="104" class="f-mono f-ink" style="font-size:11px">150/0/0</text>
  <text x="28" y="122" class="f-mono f-ink" style="font-size:11px">C  новые</text>
  <rect x="210" y="112" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="122" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="28" y="140" class="f-mono f-ink" style="font-size:11px">D  новые</text>
  <rect x="210" y="130" width="300" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="520" y="140" class="f-mono f-ink" style="font-size:11px">0/150/0</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">Flan-T5 base</text>
  <text x="28" y="184" class="f-mono f-ink" style="font-size:11px">A  знакомые</text>
  <rect x="210" y="174" width="2" height="12" class="f-box"/>
  <rect x="212" y="174" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="340" y="174" width="170" height="12" class="f-accent"/>
  <text x="520" y="184" class="f-mono f-ink" style="font-size:11px">1/64/85</text>
  <text x="28" y="202" class="f-mono f-ink" style="font-size:11px">B  знакомые</text>
  <rect x="210" y="192" width="148" height="12" class="f-box"/>
  <rect x="358" y="192" width="152" height="12" class="f-accent"/>
  <text x="520" y="202" class="f-mono f-ink" style="font-size:11px">74/0/76</text>
  <text x="28" y="220" class="f-mono f-ink" style="font-size:11px">C  новые</text>
  <rect x="210" y="210" width="50" height="12" class="f-box"/>
  <rect x="260" y="210" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="306" y="210" width="204" height="12" class="f-accent"/>
  <text x="520" y="220" class="f-mono f-ink" style="font-size:11px">25/23/102</text>
  <text x="28" y="238" class="f-mono f-ink" style="font-size:11px">D  новые</text>
  <rect x="210" y="228" width="14" height="12" class="f-box"/>
  <rect x="224" y="228" width="2" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="226" y="228" width="284" height="12" class="f-accent"/>
  <text x="520" y="238" class="f-mono f-ink" style="font-size:11px">7/1/142</text>
  <text x="12" y="264" class="f-mono f-accent" style="font-size:12px">Flan-T5 large</text>
  <text x="28" y="282" class="f-mono f-ink" style="font-size:11px">A  знакомые</text>
  <rect x="210" y="272" width="4" height="12" class="f-box"/>
  <rect x="214" y="272" width="46" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="260" y="272" width="250" height="12" class="f-accent"/>
  <text x="520" y="282" class="f-mono f-ink" style="font-size:11px">2/23/125</text>
  <text x="28" y="300" class="f-mono f-ink" style="font-size:11px">B  знакомые</text>
  <rect x="210" y="290" width="94" height="12" class="f-box"/>
  <rect x="304" y="290" width="206" height="12" class="f-accent"/>
  <text x="520" y="300" class="f-mono f-ink" style="font-size:11px">47/0/103</text>
  <text x="28" y="318" class="f-mono f-ink" style="font-size:11px">C  новые</text>
  <rect x="210" y="308" width="30" height="12" class="f-box"/>
  <rect x="240" y="308" width="18" height="12" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="308" width="252" height="12" class="f-accent"/>
  <text x="520" y="318" class="f-mono f-ink" style="font-size:11px">15/9/126</text>
  <text x="28" y="336" class="f-mono f-ink" style="font-size:11px">D  новые</text>
  <rect x="210" y="326" width="54" height="12" class="f-box"/>
  <rect x="264" y="326" width="246" height="12" class="f-accent"/>
  <text x="520" y="336" class="f-mono f-ink" style="font-size:11px">27/0/123</text>
</svg>
<figcaption>Все 3 поля верны, из 600 операций: регулярки 293, base 107, large 91. Форматов C и D регулярки не видели.</figcaption>
</figure>

Я ждал ошибок в сумме, но первой сломалась дата. Я какое-то время думал, что сломан мой разбор дат, пока не посмотрел на сырые ответы. Со строкой периода в промпте large в 360 операциях из 600 ответила первым днём периода. Для платежа от 14 июня она давала `01.06.2022`. Тогда я убрал строку периода и спросил ещё раз. Large назвала дату верно в 291 операции из 600, base в 567. Часто ответ large это не дата из строки: `01.10.2022` вместо 10.01.2022, `01/26/2022` в американском порядке вместо 26/01/2022. Иногда год был 2020. Только в формате B она дала 148 верных из 150, где дата уже была записана как `2022-06-20`. Когда я попросил скопировать дату ровно так, как она написана, модель так и сделала в 162 случаях из 600. 143 из них пришлись на B.

На каждый входящий перевод large отвечала "out", кроме формата D, где в строке словами написано `Incoming transfer`. Ответ "in" она дала на 33 входящих перевода из 129, все 33 в D. На строках без минуса и на строках с `CR` large всё равно отвечала "out". Я подумал, что виноват порядок вариантов в моём вопросе. Поэтому спросил ещё раз с "in or out" вместо "out or in". Large не поменяла ни одного ответа. Base от порядка зависела. Когда первым стоял "out", она отвечала "out" во всех 600 операциях, а когда первым стоял "in", отвечала "in" в 583 из 600.

Сумма без знака была верной в 423 операциях из 600. В 114 неверных модель вернула остаток, последнее число в строке. В 22 вернула сумму в евро или долларах из описания. Для контрагента large часто возвращала не только имя, например `SPOTIFY INTERNET`. 61 раз она вернула только город. Если принимать любой ответ, в котором есть верное имя, выходит 526 из 600. С таким нестрогим сравнением у large было бы 160 верных операций вместо 91.

<figure class="fig">
<svg viewBox="0 0 640 256" role="img" aria-label="Операция 80 формата A и строка периода над ней. Flan-T5 large ответила датой 01.06.2022, первым днём периода, вместо 14.06.2022; суммой 18 848,37, то есть остатком, вместо -248,22; направлением out, это верно; контрагентом GDANSK, то есть городом, вместо Media Expert. На 600 операциях: первый день периода 360 раз, остаток 114, город 61, входящие переводы названы out 96 из 129.">
  <text x="12" y="18" class="f-label f-muted">строка периода</text>
  <text x="12" y="36" class="f-mono f-ink" style="font-size:12px">Statement for the period 01.06.2022 - 30.06.2022</text>
  <text x="12" y="62" class="f-label f-muted">операция, формат A</text>
  <text x="12" y="80" class="f-mono f-ink" style="font-size:12px;white-space:pre" xml:space="preserve">14.06.2022  CARD PAYMENT MEDIA EXPERT 7734 GDANSK  -248,22  18 848,37</text>
  <text x="140" y="108" class="f-label f-muted">ответ large</text>
  <text x="290" y="108" class="f-label f-muted">верно</text>
  <text x="12" y="134" class="f-mono f-muted" style="font-size:12px">дата</text>
  <rect x="134" y="120" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="135" class="f-mono f-accent" style="font-size:12px">01.06.2022</text>
  <text x="290" y="135" class="f-mono f-ink" style="font-size:12px">14.06.2022</text>
  <text x="420" y="129" class="f-mono f-ink" style="font-size:10px">первый день периода</text>
  <text x="420" y="142" class="f-mono f-muted" style="font-size:10px">360 из 600</text>
  <line x1="12" y1="148" x2="628" y2="148" class="f-plain"/>
  <text x="12" y="168" class="f-mono f-muted" style="font-size:12px">сумма</text>
  <rect x="134" y="154" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="169" class="f-mono f-accent" style="font-size:12px">18 848,37</text>
  <text x="290" y="169" class="f-mono f-ink" style="font-size:12px">-248,22</text>
  <text x="420" y="163" class="f-mono f-ink" style="font-size:10px">остаток после операции</text>
  <text x="420" y="176" class="f-mono f-muted" style="font-size:10px">114 из 600</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-plain"/>
  <text x="12" y="202" class="f-mono f-muted" style="font-size:12px">направление</text>
  <rect x="134" y="188" width="140" height="22" rx="3" class="f-plain"/>
  <text x="140" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="290" y="203" class="f-mono f-ink" style="font-size:12px">out</text>
  <text x="420" y="197" class="f-mono f-ink" style="font-size:10px">верно</text>
  <text x="420" y="210" class="f-mono f-muted" style="font-size:10px">out: 96 из 129 входящих</text>
  <line x1="12" y1="216" x2="628" y2="216" class="f-plain"/>
  <text x="12" y="236" class="f-mono f-muted" style="font-size:12px">контрагент</text>
  <rect x="134" y="222" width="140" height="22" rx="3" class="f-box"/>
  <text x="140" y="237" class="f-mono f-accent" style="font-size:12px">GDANSK</text>
  <text x="290" y="237" class="f-mono f-ink" style="font-size:12px">Media Expert</text>
  <text x="420" y="231" class="f-mono f-ink" style="font-size:10px">город</text>
  <text x="420" y="244" class="f-mono f-muted" style="font-size:10px">61 из 600</text>
</svg>
<figcaption>Одна строка и 3 неверных поля, каждое из которых разбирается. В правом столбце та же ошибка, посчитанная по всем 600 операциям.</figcaption>
</figure>

Почти все эти ошибки тихие, потому что остаток разбирается как сумма ничуть не хуже самой суммы. Из 509 неверных операций large громкими были 32.

## Сначала регулярка, модель только там, где регулярка не совпала

Именно такую схему я бы и построил: парсер для знакомых форматов и модель только для строк, которые он не узнал. Она дала 335 верных из 600, больше, чем каждый из двух способов по отдельности. Но 256 операций вышли неверными, но ни одна не вызвала ошибки. Кроме моих 7 строк с зарплатой, все они пришли из C и D, тех 300 строк, на которых раньше был громкий отказ.

<figure class="fig">
<svg viewBox="0 0 640 180" role="img" aria-label="Составные столбцы на 600 операций. Регулярки под A и B: верно 293, неверно, громко 300, неверно, тихо 7. Flan-T5 large: верно 91, неверно, громко 32, неверно, тихо 477. Регулярка, затем large: верно 335, неверно, громко 9, неверно, тихо 256. Регулярки под все 4: верно 582, неверно, громко 0, неверно, тихо 18.">
  <text x="12" y="18" class="f-label f-muted">600 операций, все 4 формата</text>
  <rect x="12" y="31" width="12" height="10" class="f-box"/>
  <text x="30" y="40" class="f-mono f-ink" style="font-size:11px">верно</text>
  <rect x="77" y="31" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="95" y="40" class="f-mono f-ink" style="font-size:11px">неверно, громко</text>
  <rect x="212" y="31" width="12" height="10" class="f-accent"/>
  <text x="230" y="40" class="f-mono f-ink" style="font-size:11px">неверно, тихо</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:11px">регулярки под A и B</text>
  <rect x="190" y="59" width="161" height="14" class="f-box"/>
  <rect x="351" y="59" width="165" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="516" y="59" width="4" height="14" class="f-accent"/>
  <text x="530" y="70" class="f-mono f-ink" style="font-size:11px">293/300/7</text>
  <text x="12" y="100" class="f-mono f-ink" style="font-size:11px">Flan-T5 large</text>
  <rect x="190" y="89" width="50" height="14" class="f-box"/>
  <rect x="240" y="89" width="18" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="258" y="89" width="262" height="14" class="f-accent"/>
  <text x="530" y="100" class="f-mono f-ink" style="font-size:11px">91/32/477</text>
  <text x="12" y="130" class="f-mono f-ink" style="font-size:11px">регулярка, затем large</text>
  <rect x="190" y="119" width="184" height="14" class="f-box"/>
  <rect x="374" y="119" width="5" height="14" class="f-muted" fill-opacity="0.55"/>
  <rect x="379" y="119" width="141" height="14" class="f-accent"/>
  <text x="530" y="130" class="f-mono f-ink" style="font-size:11px">335/9/256</text>
  <text x="12" y="160" class="f-mono f-ink" style="font-size:11px">регулярки под все 4</text>
  <rect x="190" y="149" width="320" height="14" class="f-box"/>
  <rect x="510" y="149" width="10" height="14" class="f-accent"/>
  <text x="530" y="160" class="f-mono f-ink" style="font-size:11px">582/0/18</text>
</svg>
<figcaption>Модель на строках, где регулярка не совпала, добавляет 42 верные операции. Её неверные ответы в C и D не вызывают ошибки. Ещё 29 строк регулярок оставляют 18 неверных. Все они один и тот же баг с зарплатой.</figcaption>
</figure>

Потом я сделал то, что сделал бы в любом случае, когда банк меняет выгрузку: написал регулярки под C и D. Это ещё 29 строк. Парсер верно разобрал 582 из 600 и ни одной громкой ошибки. 18 неверных это тот же баг с зарплатой: я скопировал его в разбор формата C вместе с остальным кодом. Парсер тратит около 6 микросекунд на операцию. Large тратит в медиане 1,2 секунды на вопрос, то есть около 5 секунд на операцию.

## Чего я не проверял

Это одна маленькая модель, которую я могу запустить сам. Это не GPT-3 из API OpenAI и не ChatGPT, у которого API пока нет. Ничего крупнее я не пробовал. На каждое поле был один промпт без примеров. Ничего я не дообучал. Заставить модель выдать все поля сразу в JSON я тоже не пробовал. Выписки синтетические, это чистый текст без PDF и OCR.

Пока я оставляю регулярку под каждый банк. Модель я бы использовал только как подсказку разбора для строки, которую парсер не знает. Подсказку проверяет человек, прежде чем она пойдёт дальше.
