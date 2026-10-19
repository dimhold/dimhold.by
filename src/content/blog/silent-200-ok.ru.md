---
title: "Flan-T5 ответила на 2000 вызовов кодом 200 OK и ошиблась в 161 сумме из 600"
description: "Я поставил Flan-T5 за маленький HTTP-сервер и спросил сумму в 600 синтетических платёжных документах. Все 2000 вызовов вернули 200 OK, каждый ответ разобрался, а base ошиблась в 161 сумме, large в 35. Base теряла токен десятичной запятой и делала суммы в 100 раз больше, обе модели отвечали другой суммой из того же документа. Какие дешёвые проверки что ловят и 10 ошибок, которые не ловит ни одна."
date: 2022-12-16
lang: ru
translationKey: silent-200-ok
tags: ["llm", "reliability", "numbers"]
---
Через 2 недели после выхода ChatGPT первое, что мне захотелось попробовать, это вытащить моделью сумму из платёжного документа. Я хотел увидеть, как выглядит ошибка внутри конвейера, потому что там ответы никто не читает и видят их только проверки. У ChatGPT пока нет API. Его токенов я не вижу. Поэтому я взял Flan-T5, модель Google, которую можно запустить на своей машине.

Стенд нарочно скучный. Модель обёрнута в маленький HTTP-сервер, который возвращает ответ в поле `generated_text`, как Hugging Face Inference API. Код 500 он возвращает, только если Python бросил исключение. Мой клиент отправляет документ и вопрос, а в конце строку "Answer with the amount only". Потом проверяет то, что я проверил бы у любого внутреннего сервиса: статус 200, тело это JSON, ответ разбирается как сумма. Эти 3 проверки я написал первыми, не задумываясь. Только потом понял, что неверное число проходит все 3.

Версии, потому что от них зависят числа: Python 3.9, torch 1.13.1 на CPU, transformers 4.25.1, жадное декодирование. У Flan-T5 base 250M параметров, у large 780M, веса у обеих те, что выложены 21 октября. Документов 600, они синтетические и сделаны скриптом с фиксированным сидом, так что правильный ответ я знаю для каждого. Видов 6, по 100 каждого. Это счёт, счёт с задолженностью за прошлый период, подтверждение перевода, чек, письмо о возврате средств и напоминание об оплате. В половине документов числа записаны как `PLN 1,284.50`, в другой половине по-европейски, `1 284,50 PLN`.

## Дашборд

Base получила 2000 вызовов. По каждому документу я задал основной вопрос и тот же вопрос другими словами. Для 4 видов документов было ещё по 2 вопроса о других полях, они нужны для одной проверки ниже. Все 2000 вызовов вернули 200, каждый ответ удалось разобрать. Панель в Grafana для такого сервиса показала бы 0 ошибок.

Неверной оказалась 161 сумма из 600.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Столбчатая диаграмма для Flan-T5 base и large. Статус 200: 2000 из 2000 вызовов у обеих. Тело это JSON: все вызовы. Сумма разбирается: 600 из 600 документов. Сумма верная: 439 из 600 у base, 565 из 600 у large.">
  <text x="12" y="18" class="f-label f-muted">что проверял клиент и что было на самом деле</text>
  <text x="12" y="44" class="f-mono f-accent" style="font-size:12px">flan-t5-base</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:11px">статус 200</text>
  <rect x="196" y="56" width="330" height="14" class="f-box"/>
  <text x="536" y="67" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="90" class="f-mono f-ink" style="font-size:11px">тело это JSON</text>
  <rect x="196" y="80" width="330" height="14" class="f-box"/>
  <text x="536" y="91" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="114" class="f-mono f-ink" style="font-size:11px">сумма разбирается</text>
  <rect x="196" y="104" width="330" height="14" class="f-box"/>
  <text x="536" y="115" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="138" class="f-mono f-ink" style="font-size:11px">сумма верная</text>
  <rect x="196" y="128" width="241" height="14" class="f-box"/>
  <rect x="437" y="128" width="89" height="14" class="f-accent"/>
  <text x="536" y="139" class="f-mono f-ink" style="font-size:11px">439/600</text>
  <text x="12" y="166" class="f-mono f-accent" style="font-size:12px">flan-t5-large</text>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">статус 200</text>
  <rect x="196" y="178" width="330" height="14" class="f-box"/>
  <text x="536" y="189" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">тело это JSON</text>
  <rect x="196" y="202" width="330" height="14" class="f-box"/>
  <text x="536" y="213" class="f-mono f-ink" style="font-size:11px">2000/2000</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">сумма разбирается</text>
  <rect x="196" y="226" width="330" height="14" class="f-box"/>
  <text x="536" y="237" class="f-mono f-ink" style="font-size:11px">600/600</text>
  <text x="12" y="260" class="f-mono f-ink" style="font-size:11px">сумма верная</text>
  <rect x="196" y="250" width="311" height="14" class="f-box"/>
  <rect x="507" y="250" width="19" height="14" class="f-accent"/>
  <text x="536" y="261" class="f-mono f-ink" style="font-size:11px">565/600</text>
  <rect x="196" y="284" width="14" height="14" class="f-box"/>
  <text x="216" y="295" class="f-label f-muted">прошло</text>
  <rect x="326" y="284" width="14" height="14" class="f-accent"/>
  <text x="346" y="295" class="f-label f-muted">неверно</text>
</svg>
<figcaption>Каждый вызов прошёл все проверки клиента. Неверных сумм 161 у base и 35 у large.</figcaption>
</figure>

Первый неверный ответ, который я открыл, был по чеку с `TOTAL 437,78 EUR`, а модель ответила `43778 EUR`. Сначала я решил, что запятую съел мой парсер, а потом, что её теряет токенизатор при декодировании. Проверил и то и другое, прежде чем поверил, что это модель. Токенизатор режет вход на `▁4`, `37`, `,`, `78`, `▁EUR`, а модель сгенерировала `▁4`, `37`, `78`, `▁EUR`. Запятая на этом шаге была у неё вторым по вероятности токеном, с вероятностью 0,12 против 0,79 у `78`. В итоге сумма становится в 100 раз больше. Так вышло 52 раза с правильным числом и ещё 10 раз с другим числом из документа. Все 52 случая приходятся на запись с десятичной запятой.

<figure class="fig">
<svg viewBox="0 0 640 298" role="img" aria-label="Токены строки чека: 4, 37, запятая, 78, EUR. Ответ base: 4, 37, 78, EUR, без запятой, так что 437,78 становится 43778. Ниже неверные суммы по видам, base и large: другая сумма из документа 68 и 28, кусок текста, количество или номер 27 и 0, потерян десятичный разделитель 62 и 5, прочее 4 и 2.">
  <text x="12" y="18" class="f-label f-muted">вход, строка чека TOTAL</text>
  <rect x="12" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="32.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁TO</text>
  <rect x="61" y="26" width="41" height="26" rx="3" class="f-box"/>
  <text x="81.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">TAL</text>
  <rect x="110" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="126" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="150" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="166" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="190" y="26" width="23" height="26" rx="3" class="f-accent"/>
  <text x="201.5" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">,</text>
  <rect x="221" y="26" width="32" height="26" rx="3" class="f-box"/>
  <text x="237" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="261" y="26" width="50" height="26" rx="3" class="f-box"/>
  <text x="286" y="44" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="327" y="44" class="f-mono f-muted" style="font-size:13px">437,78</text>
  <text x="12" y="78" class="f-label f-muted">ответ base</text>
  <rect x="12" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="28" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁4</text>
  <rect x="52" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="68" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">37</text>
  <rect x="92" y="86" width="34" height="26" rx="3" class="f-plain" stroke-dasharray="3 3"/>
  <rect x="134" y="86" width="32" height="26" rx="3" class="f-box"/>
  <text x="150" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">78</text>
  <rect x="174" y="86" width="50" height="26" rx="3" class="f-box"/>
  <text x="199" y="104" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">▁EUR</text>
  <text x="240" y="104" class="f-mono f-accent" style="font-size:13px">43778</text>
  <text x="12" y="150" class="f-label f-muted">неверные суммы по видам</text>
  <text x="420" y="150" class="f-label f-muted" text-anchor="end">base</text>
  <text x="560" y="150" class="f-label f-muted" text-anchor="end">large</text>
  <text x="12" y="178" class="f-mono f-ink" style="font-size:11px">другая сумма из документа</text>
  <text x="420" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">68</text>
  <text x="560" y="178" class="f-mono f-ink" text-anchor="end" style="font-size:12px">28</text>
  <line x1="12" y1="186" x2="570" y2="186" class="f-plain"/>
  <text x="12" y="204" class="f-mono f-ink" style="font-size:11px">кусок текста, количество, номер</text>
  <text x="420" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">27</text>
  <text x="560" y="204" class="f-mono f-ink" text-anchor="end" style="font-size:12px">0</text>
  <line x1="12" y1="212" x2="570" y2="212" class="f-plain"/>
  <text x="12" y="230" class="f-mono f-ink" style="font-size:11px">потерян десятичный разделитель</text>
  <text x="420" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">62</text>
  <text x="560" y="230" class="f-mono f-ink" text-anchor="end" style="font-size:12px">5</text>
  <line x1="12" y1="238" x2="570" y2="238" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:11px">прочее</text>
  <text x="420" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">4</text>
  <text x="560" y="256" class="f-mono f-ink" text-anchor="end" style="font-size:12px">2</text>
  <line x1="12" y1="270" x2="570" y2="270" class="f-line"/>
  <text x="420" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">161</text>
  <text x="560" y="286" class="f-mono f-accent" text-anchor="end" style="font-size:12px">35</text>
</svg>
<figcaption>Flan-T5 base пропускает токен запятой. Все 52 ответа с верными цифрами и суммой в 100 раз больше взяты из документов с записью вида 1 284,50.</figcaption>
</figure>

Класс побольше заметить труднее. 68 неверных ответов это другая сумма из того же документа, записанная как нормальная сумма, просто не та, о которой я спрашивал. В напоминании написано "Invoice 52081 dated 2022-05-02 for PLN 2,501.80 is overdue. We received PLN 500.36 from you on 2022-09-21. The remaining PLN 2,001.44 is due…" Base назвала исходную сумму счёта в 73 напоминаниях из 100, причём в 10 из них ещё и потеряла запятую. Ещё в 1 напоминании она ошиблась по-другому. Я думал, что она просто берёт первую сумму. Но в счёте с задолженностью за прошлый период сумма к оплате стоит последней строкой. Там base была права 87 раз из 100. Так что я не знаю, от чего это зависит. 27 ответов это скопированный из документа текст, чаще всего строки чека, из которых мой парсер взял первое число. В последних 4 цифры искажены как-то иначе.

## Проверки, которые можно добавить без разметки

До прогона я записал, чего жду, чтобы потом не подгонять ожидания под результат. Я ждал, что проверка "есть ли эта сумма в документе" поймает меньше половины неверных ответов. Ещё я ждал, что вопрос, заданный дважды разными словами, поймает больше. Обе идеи не мои. Согласованность ответов использовали Wang et al. в марте, а в июле Kadavath et al. изучали, насколько хорошо модель знает, когда она права.

В определении моей первой проверки по документу была ошибка. Она сравнивала с любой цепочкой цифр, поэтому количество товара из строки чека проходило. Поймала она 66 из 161. Когда я оставил только суммы с 2 знаками после разделителя, она поймала 91, больше половины, так что для base моё ожидание не сбылось. Ложной тревоги эта проверка дать не может, потому что правильный ответ всегда есть в документе. Строгая проверка формата требует одно число с группами по 3 цифры и ровно 2 знака после разделителя. Она ловит почти те же ответы, 91 из 161, при 2 ложных тревогах на 439 правильных.

Двойной вопрос сработал хуже, чем я ждал. Он поймал 53 неверных ответа и пометил 105 правильных из 439. Base часто даёт 2 разных ответа, один из которых правильный. Уверенность самой модели сработала лучше, но не настолько, чтобы полагаться только на неё. Я взял средний логарифм вероятности токенов ответа и пометил 20% наименее уверенных ответов. Попались 67 неверных и 53 правильных. AUROC равен 0,76, то есть в случайном неверном ответе модель уверена меньше, чем в случайном правильном, примерно в 3 случаях из 4.

Арифметика сначала выглядела победителем. В 4 видах документов поля складываются: сумма без НДС плюс НДС даёт итог, сумма счёта плюс прошлая задолженность даёт сумму к оплате, возврат плюс удержанный сбор даёт исходное списание, оплаченное плюс остаток даёт сумму счёта. Я спрашиваю у модели значения 2 других полей и складываю их. Там, где это применимо, проверка поймала 103 неверные суммы из 103 и пометила 130 правильных из 297. Потом я посмотрел на счета. На вопрос про НДС base ни разу не дала правильного числа и 67 раз вернула сумму без НДС, так что на счетах проверка помечает всё подряд. Без счетов она поймала 87 неверных сумм из 87 при 46 ложных тревогах на 213 правильных.

<figure class="fig">
<svg viewBox="0 0 640 220" role="img" aria-label="Таблица проверок. Сумма есть в документе: base 91 из 161 без ложных тревог, large 7 из 35, тоже без. Строгий формат: 91 и 8. Тот же ответ на переформулировку: base 53, ложных тревог 105, large 7, ложных тревог 41. 20% наименее уверенных: base 67, ложных тревог 53, large 14, ложных тревог 106. Арифметика: base 103, ложных тревог 130, large 21, ложных тревог 8. Все три вместе: 159 и 25.">
  <text x="12" y="18" class="f-label f-muted">пойманные неверные суммы и ложные тревоги на верных</text>
  <text x="12" y="42" class="f-label f-muted">проверка</text>
  <text x="340" y="42" class="f-label f-muted" text-anchor="end">base: поймано</text>
  <text x="398" y="42" class="f-label f-muted" text-anchor="end">ложные</text>
  <text x="540" y="42" class="f-label f-muted" text-anchor="end">large: поймано</text>
  <text x="600" y="42" class="f-label f-muted" text-anchor="end">ложные</text>
  <text x="12" y="69" class="f-mono f-ink" style="font-size:11px">сумма есть в документе</text>
  <rect x="214" y="60" width="70" height="12" class="f-plain"/>
  <rect x="214" y="60" width="40" height="12" class="f-box"/>
  <text x="340" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <rect x="414" y="60" width="70" height="12" class="f-plain"/>
  <rect x="414" y="60" width="14" height="12" class="f-box"/>
  <text x="540" y="70" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="70" class="f-mono f-muted" text-anchor="end" style="font-size:11px">0</text>
  <text x="12" y="95" class="f-mono f-ink" style="font-size:11px">строгий формат суммы</text>
  <rect x="214" y="86" width="70" height="12" class="f-plain"/>
  <rect x="214" y="86" width="40" height="12" class="f-box"/>
  <text x="340" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">91/161</text>
  <text x="398" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">2</text>
  <rect x="414" y="86" width="70" height="12" class="f-plain"/>
  <rect x="414" y="86" width="16" height="12" class="f-box"/>
  <text x="540" y="96" class="f-mono f-ink" text-anchor="end" style="font-size:11px">8/35</text>
  <text x="600" y="96" class="f-mono f-accent" text-anchor="end" style="font-size:11px">1</text>
  <text x="12" y="121" class="f-mono f-ink" style="font-size:11px">тот же ответ на переформулировку</text>
  <rect x="214" y="112" width="70" height="12" class="f-plain"/>
  <rect x="214" y="112" width="23" height="12" class="f-box"/>
  <text x="340" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">53/161</text>
  <text x="398" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">105</text>
  <rect x="414" y="112" width="70" height="12" class="f-plain"/>
  <rect x="414" y="112" width="14" height="12" class="f-box"/>
  <text x="540" y="122" class="f-mono f-ink" text-anchor="end" style="font-size:11px">7/35</text>
  <text x="600" y="122" class="f-mono f-accent" text-anchor="end" style="font-size:11px">41</text>
  <text x="12" y="147" class="f-mono f-ink" style="font-size:11px">20% наименее уверенных</text>
  <rect x="214" y="138" width="70" height="12" class="f-plain"/>
  <rect x="214" y="138" width="29" height="12" class="f-box"/>
  <text x="340" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">67/161</text>
  <text x="398" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">53</text>
  <rect x="414" y="138" width="70" height="12" class="f-plain"/>
  <rect x="414" y="138" width="28" height="12" class="f-box"/>
  <text x="540" y="148" class="f-mono f-ink" text-anchor="end" style="font-size:11px">14/35</text>
  <text x="600" y="148" class="f-mono f-accent" text-anchor="end" style="font-size:11px">106</text>
  <text x="12" y="173" class="f-mono f-ink" style="font-size:11px">арифметика документа</text>
  <rect x="214" y="164" width="70" height="12" class="f-plain"/>
  <rect x="214" y="164" width="45" height="12" class="f-box"/>
  <text x="340" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">103/161</text>
  <text x="398" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="164" width="70" height="12" class="f-plain"/>
  <rect x="414" y="164" width="42" height="12" class="f-box"/>
  <text x="540" y="174" class="f-mono f-ink" text-anchor="end" style="font-size:11px">21/35</text>
  <text x="600" y="174" class="f-mono f-accent" text-anchor="end" style="font-size:11px">8</text>
  <line x1="12" y1="182" x2="628" y2="182" class="f-line"/>
  <text x="12" y="199" class="f-mono f-ink" style="font-size:11px">формат, документ, арифметика</text>
  <rect x="214" y="190" width="70" height="12" class="f-plain"/>
  <rect x="214" y="190" width="69" height="12" class="f-box"/>
  <text x="340" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">159/161</text>
  <text x="398" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">130</text>
  <rect x="414" y="190" width="70" height="12" class="f-plain"/>
  <rect x="414" y="190" width="50" height="12" class="f-box"/>
  <text x="540" y="200" class="f-mono f-ink" text-anchor="end" style="font-size:11px">25/35</text>
  <text x="600" y="200" class="f-mono f-accent" text-anchor="end" style="font-size:11px">9</text>
</svg>
<figcaption>У base неверных ответов 161, верных 439. У large 35 и 565. Арифметика есть в 4 видах документов из 6.</figcaption>
</figure>

## Модель побольше

Large намного лучше, но в 3 раза медленнее. На 4 ядрах виртуалки с AMD EPYC 7713 у неё 1,6 секунды на вызов против 0,5. Она ошиблась в 35 суммах из 600. Снова все вызовы вернули 200 OK. Все ответы удалось разобрать. Я ждал меньше ошибок, но не ждал, что дешёвые проверки почти перестанут работать. Проверка по документу поймала 7 из 35, строгий формат 8. Двойной вопрос тоже 7, при 41 ложной тревоге. Отсечка по 20% наименее уверенных поймала 14 при 106 ложных. 28 неверных ответов из 35 это другие суммы из документа. Выглядят они в точности как правильные.

Арифметика там, где применима, работает и здесь: 21 из 21 при 8 ложных тревогах на 379, потому что large правильно ответила на 791 вопрос о полях из 800. Вместе с арифметикой проверка по документу и строгий формат ловят 25 из 35.

Остальные 10 это одна и та же ошибка. Base её ни разу не допускала. В подтверждении перевода large вместо суммы перевода называла остаток на счёте из строки "Balance after transfer". Так было 11 раз, строгая проверка отбросила только 1 из них. У base на переводах тоже было 5 ошибок, но это были потерянные запятые и искажённые цифры, а такие ошибки проверки ловят. В моём шаблоне перевода нет остатка до перевода, поэтому никакое равенство не связывает сумму перевода с другими числами. Двойной вопрос пометил 5 из 10, уверенность 2. Для остальных нужен второй источник, например банковская выписка по этой операции.

## Чего я не проверял

- ChatGPT и `text-davinci-003`. Я мерил только 2 небольшие открытые модели и не знаю, теряет ли запятые намного более крупная модель. Думаю, что нет. Но нормально записанная сумма не из той строки, думаю, останется.
- Настоящие документы. Мои 6 шаблонов короткие и чистые, поэтому доля ошибок по шаблону говорит о моих шаблонах. То, что base ошиблась в 74 напоминаниях из 100, скорее говорит о том, как я написал напоминание, чем о модели.
- Промпты. Одна формулировка инструкции и одна переформулировка каждого вопроса. Другая инструкция могла бы сильно поменять результат на напоминаниях.
- Повторные прогоны. Только жадное декодирование. Каждое число здесь из одного прогона. Я повторно прогнал 2 документа вне сервера и получил те же токены, но весь прогон не повторял.
