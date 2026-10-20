---
title: "Flan-T5 верно прочитала 1393 строки счетов из 1413, а сложила верно 1 счёт из 400"
description: "Я дал Flan-T5 base и large 400 счетов и задал вопросы 6 видов. Large верно прочитала 1393 суммы строк из 1413 и 388 напечатанных итогов из 400. На вопросы с вычислением она ответила верно 6 раз из 1600, а её неверные итоги выглядели в точности как итоги. Когда её просили рассуждать по шагам, она писала верное выражение и неверную сумму. Если модель читает строки, а складывает код, верных итогов 386 из 400."
date: 2022-12-14
lang: ru
translationKey: read-not-compute
tags: ["llm", "numbers", "reliability"]
---
С тех пор как 2 недели назад вышел ChatGPT, в финтехе я чаще всего слышу одну идею: пусть языковая модель проверяет документы. Берём счёт и смотрим, сходятся ли строки с итогом. У меня было своё представление об этом и я его ни разу не проверял. Я думал, что трудная часть это чтение. Модели надо найти нужное число рядом с нужным названием. Сложить после этого 4 числа казалось простым шагом.

У ChatGPT нет API, поэтому отправить ему несколько тысяч счетов я не могу. Вместо этого я запустил модель на своей машине и измерил, где она перестаёт отвечать верно.

## Стенд

Модель — Flan-T5 от Google. Я взял 2 размера, base (250M параметров) и large (780M), обе вышли в октябре. Работает на 4 ядрах виртуальной машины AMD EPYC: Python 3.9, torch 1.13, transformers 4.25.1, жадное декодирование. Один вопрос занимает около 0,4 с на base и 1,5 с на large.

Скрипт сгенерировал 400 счетов с seed 2022, так что каждый правильный ответ известен заранее. Строк в каждом от 2 до 5. В половине счетов суммы целые, до 99, например `PLN 45`. В другой половине суммы с грошами, до 999,99, например `PLN 412.35`. Счёт выглядит так:

```
Invoice No. 55049
Seller: Marek Nowak Consulting
cable ties: PLN 9
paper reams: PLN 68
drill bits: PLN 90
desk lamps: PLN 92
```

По одним и тем же счетам я задал вопросы 6 видов. Для 2 из них достаточно прочитать: сумма одной строки и итог, когда в счёте есть строка `Total:`. Для 4 надо посчитать. 2 из них работают с 2 строками, это сумма и разница. 3-й это итог, когда строки итога нет. 4-й это произведение количества на цену для строки вида `6 x PLN 73.82`. Каждый промпт состоит из документа и вопроса, а за ними идёт `Answer with the amount only.` Ответ верен, только если в нём ровно 1 число и это число правильное.

## Чтение

Large верно прочитала 1393 суммы строк из 1413 и 388 напечатанных итогов из 400. Base справилась хуже, 1154 строки и 360 итогов. Она часто не останавливалась на сумме и выдавала ещё и следующие строки.

<figure class="fig">
<svg viewBox="0 0 640 308" role="img" aria-label="Столбцы для Flan-T5 base и large. Сумма строки: base 1154 из 1413, large 1393 из 1413. Напечатанный итог: 360 и 388 из 400. Сумма 2 строк: 0 и 2 из 400. Разница 2 строк: 0 и 3. Количество на цену: 0 и 0. Итог без строки итога: 0 и 1.">
  <text x="12" y="18" class="f-label f-muted">верных ответов из всех вопросов каждого вида</text>
  <rect x="210" y="30" width="12" height="10" class="f-plain"/>
  <text x="228" y="39" class="f-mono f-ink" style="font-size:11px">base</text>
  <rect x="290" y="30" width="12" height="10" class="f-box"/>
  <text x="308" y="39" class="f-mono f-ink" style="font-size:11px">large</text>
  <text x="12" y="66" class="f-mono f-accent" style="font-size:12px">ответ напечатан</text>
  <text x="24" y="94" class="f-mono f-ink" style="font-size:11px">сумма строки</text>
  <rect x="210" y="82" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="77" width="245" height="11" class="f-plain"/>
  <text x="520" y="86" class="f-mono f-ink" style="font-size:11px">1154/1413</text>
  <rect x="210" y="96" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="91" width="296" height="11" class="f-box"/>
  <text x="520" y="100" class="f-mono f-ink" style="font-size:11px">1393/1413</text>
  <text x="24" y="128" class="f-mono f-ink" style="font-size:11px">напечатанный итог</text>
  <rect x="210" y="116" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="111" width="270" height="11" class="f-plain"/>
  <text x="520" y="120" class="f-mono f-ink" style="font-size:11px">360/400</text>
  <rect x="210" y="130" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="125" width="291" height="11" class="f-box"/>
  <text x="520" y="134" class="f-mono f-ink" style="font-size:11px">388/400</text>
  <text x="12" y="156" class="f-mono f-accent" style="font-size:12px">ответ надо посчитать</text>
  <text x="24" y="184" class="f-mono f-ink" style="font-size:11px">сумма 2 строк</text>
  <rect x="210" y="172" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="176" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="186" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="181" width="2" height="11" class="f-box"/>
  <text x="520" y="190" class="f-mono f-ink" style="font-size:11px">2/400</text>
  <text x="24" y="218" class="f-mono f-ink" style="font-size:11px">разница 2 строк</text>
  <rect x="210" y="206" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="210" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="220" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="215" width="2" height="11" class="f-box"/>
  <text x="520" y="224" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="24" y="252" class="f-mono f-ink" style="font-size:11px">количество x цена</text>
  <rect x="210" y="240" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="244" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="254" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="258" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <text x="24" y="286" class="f-mono f-ink" style="font-size:11px">итог без строки итога</text>
  <rect x="210" y="274" width="300" height="1" class="f-line" opacity="0.3"/>
  <text x="520" y="278" class="f-mono f-ink" style="font-size:11px">0/400</text>
  <rect x="210" y="288" width="300" height="1" class="f-line" opacity="0.3"/>
  <rect x="210" y="283" width="2" height="11" class="f-box"/>
  <text x="520" y="292" class="f-mono f-ink" style="font-size:11px">1/400</text>
</svg>
<figcaption>Одни и те же 400 счетов. Large верно ответила на 6 из 1600 вопросов с вычислением, base на 0.</figcaption>
</figure>

Ошибки у large не случайные. Из 20 неверных ответов про сумму строки 19 состоят из одной неверной суммы. В 18 из этих 19 это сумма строки выше. 14 из этих 19 приходятся на счета из 5 строк с целыми суммами. Все 12 неверных итогов не меньше 1000. Только у таких итогов и есть разделитель тысяч. Вместо 2188,24 large ответила `PLN 1,218.24`, вместо 3005,03 `PLN 30005.03`. Итоги меньше 1000 она прочитала верно 228 раз из 228.

## Вычисления

Large верно ответила на 6 из 1600 вопросов с вычислением. Base ни на один. Все 6 пришлись на счета с целыми суммами, так что даже там это 6 из 800. В 2 из 6 правильная сумма совпала с суммой другой строки счёта, 79 и 91. Large вернула это число. Сложила она его или списала, я сказать не могу.

Больше меня беспокоили неверные ответы. На вопрос про итог, когда строки итога нет, large в 201 случае из 400 вернула сумму одной из строк. Ещё в 16 она вернула номер счёта. В остальных 182 она вернула число, которого в счёте нет. Все они выглядят в точности как итог. Ответ это 1 число с `PLN` перед ним и парсер принимает его без ошибки. С количеством на цену было иначе. Large во всех 400 случаях просто повторила строку, `6 x PLN 73.82`. У large это единственный вид вопросов, где ошибка громкая, потому что в ответе 2 числа.

## Просьба показать шаги

Flan-T5 обучали на примерах с рассуждением по шагам, поэтому следующим логично было дописать к вопросам про сумму `Let's think step by step.` Тогда large расписывает вычисление. По счёту выше она ответила:

```
The total amount of all items is PLN 9 + 68 + 90 + 92 = PLN 340. The answer: 340.
```

Правильный итог 259. Здесь каждое число слева от `=` верное и неверно только сложение.

<figure class="fig">
<svg viewBox="0 0 640 254" role="img" aria-label="В счёте строки 9, 68, 90 и 92. Large пишет 9 + 68 + 90 + 92 = 340. Python считает то же выражение и получает 259, это верный итог. На 400 вопросах про сумму по шагам: выражение записано в 398 случаях, итоговый ответ large верен в 3 случаях из 400, выражение, посчитанное в Python, верно в 223.">
  <text x="12" y="18" class="f-label f-muted">счёт</text>
  <text x="12" y="38" class="f-mono f-ink" style="font-size:12px">cable ties: PLN 9</text>
  <text x="12" y="54" class="f-mono f-ink" style="font-size:12px">paper reams: PLN 68</text>
  <text x="12" y="70" class="f-mono f-ink" style="font-size:12px">drill bits: PLN 90</text>
  <text x="12" y="86" class="f-mono f-ink" style="font-size:12px">desk lamps: PLN 92</text>
  <path d="M190 60 L232 60" class="f-line" marker-end="url(#a519)"/>
  <defs><marker id="a519" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="f-muted"/></marker></defs>
  <text x="244" y="18" class="f-label f-muted">large пишет</text>
  <rect x="244" y="44" width="24" height="26" rx="3" class="f-box"/>
  <text x="256" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">9</text>
  <text x="284" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="300" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="317" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">68</text>
  <text x="350" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="366" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="383" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">90</text>
  <text x="416" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">+</text>
  <rect x="432" y="44" width="34" height="26" rx="3" class="f-box"/>
  <text x="449" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">92</text>
  <text x="482" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">=</text>
  <rect x="498" y="44" width="48" height="26" rx="3" class="f-accent"/>
  <text x="522" y="62" class="f-mono f-ink" text-anchor="middle" style="font-size:13px">340</text>
  <text x="522" y="88" class="f-label f-muted" text-anchor="middle">ответ large</text>
  <text x="244" y="118" class="f-label f-muted">то же выражение считает Python</text>
  <text x="244" y="140" class="f-mono f-ink" style="font-size:13px">9 + 68 + 90 + 92 = 259</text>
  <text x="440" y="140" class="f-label f-muted">верно</text>
  <line x1="12" y1="162" x2="628" y2="162" class="f-plain"/>
  <text x="12" y="188" class="f-mono f-ink" style="font-size:11px">выражение записано</text>
  <rect x="360" y="178" width="200" height="12" class="f-plain"/>
  <rect x="360" y="178" width="199" height="12" class="f-box"/>
  <text x="570" y="188" class="f-mono f-ink" style="font-size:11px">398/400</text>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:11px">собственный ответ верен</text>
  <rect x="360" y="202" width="200" height="12" class="f-plain"/>
  <rect x="360" y="202" width="2" height="12" class="f-accent"/>
  <text x="570" y="212" class="f-mono f-ink" style="font-size:11px">3/400</text>
  <text x="12" y="236" class="f-mono f-ink" style="font-size:11px">выражение верно, если его посчитает Python</text>
  <rect x="360" y="226" width="200" height="12" class="f-plain"/>
  <rect x="360" y="226" width="112" height="12" class="f-box"/>
  <text x="570" y="236" class="f-mono f-ink" style="font-size:11px">223/400</text>
</svg>
<figcaption>По шагам на первых 200 счетах, 400 вопросов про сумму, только Flan-T5 large.</figcaption>
</figure>

Я прогнал это только на первых 200 счетах, это 400 вопросов про сумму, потому что 1 ответ занимает около 8 секунд. Large записала выражение в 398 из них. Её собственный итоговый ответ был верен в 3. Потом я посчитал записанное ею выражение в Python. Верными оказались 223 из 400. На минуту мне показалось, что это и есть выход, но итоги всё испортили. В вопросах про итог без строки итога выражение содержало все строки счёта только в 89 случаях из 198. При 2 строках это 51 из 55, при 5 строках 8 из 43. В 99 из остальных 109 модель выбросила часть строк из суммы. В оставшихся она неверно прочитала одну из сумм или повторила её.

## Читает модель, складывает код

Так я и разделил работу. Модель читает сумму каждой строки, по одному вопросу на строку, а Python их складывает. Тогда large дала 386 верных итогов из 400 против 1 из 400, когда её спрашивали про итог напрямую. В каждом из 13 неверных итогов есть неверно прочитанная строка. В 1 счёте строка вернулась с 2 числами, поэтому код отказался её складывать.

<figure class="fig">
<svg viewBox="0 0 640 202" role="img" aria-label="Прямой вопрос про итог из 400 счетов. Base: верных 0, тихих неверных 355, громких 45. Large: верных 1, тихих неверных 399, громких 0. Модель читает каждую строку, код складывает: base: верных 211, тихих неверных 18, громких 171. Large: верных 386, тихих неверных 13, громких 1.">
  <text x="12" y="18" class="f-label f-muted">итог 400 счетов 2 способами</text>
  <rect x="12" y="30" width="12" height="10" class="f-box"/>
  <text x="30" y="39" class="f-mono f-ink" style="font-size:11px">верно</text>
  <rect x="182" y="30" width="12" height="10" class="f-accent"/>
  <text x="200" y="39" class="f-mono f-ink" style="font-size:11px">неверно, тихо</text>
  <rect x="352" y="30" width="12" height="10" class="f-muted" fill-opacity="0.55"/>
  <text x="370" y="39" class="f-mono f-ink" style="font-size:11px">громко, код отказывается</text>
  <text x="12" y="64" class="f-mono f-accent" style="font-size:12px">спросить у модели итог</text>
  <text x="24" y="86" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="76" width="266" height="12" class="f-accent"/>
  <rect x="496" y="76" width="34" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="86" class="f-mono f-ink" style="font-size:11px">0/355/45</text>
  <text x="24" y="108" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="98" width="1" height="12" class="f-box"/>
  <rect x="231" y="98" width="299" height="12" class="f-accent"/>
  <text x="540" y="108" class="f-mono f-ink" style="font-size:11px">1/399/0</text>
  <text x="12" y="136" class="f-mono f-accent" style="font-size:12px">модель читает строки, код складывает</text>
  <text x="24" y="158" class="f-mono f-ink" style="font-size:11px">flan-t5-base</text>
  <rect x="230" y="148" width="158" height="12" class="f-box"/>
  <rect x="388" y="148" width="14" height="12" class="f-accent"/>
  <rect x="402" y="148" width="128" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="158" class="f-mono f-ink" style="font-size:11px">211/18/171</text>
  <text x="24" y="180" class="f-mono f-ink" style="font-size:11px">flan-t5-large</text>
  <rect x="230" y="170" width="290" height="12" class="f-box"/>
  <rect x="520" y="170" width="10" height="12" class="f-accent"/>
  <rect x="530" y="170" width="1" height="12" class="f-muted" fill-opacity="0.55"/>
  <text x="540" y="180" class="f-mono f-ink" style="font-size:11px">386/13/1</text>
</svg>
<figcaption>Громко значит, что в ответе больше 1 числа и код видит, что что-то не так. Во втором способе для этого хватает 1 строки.</figcaption>
</figure>

При таком разделении base дала 211 верных итогов и 18 неверных. В остальных 171 какая-то строка вернулась в виде `PLN 9 paper reams 68`, поэтому код не смог её сложить. При прямом вопросе про итог base ошиблась так же громко 45 раз, а в остальных 355 тихо.

Идея не моя. Статья прошлого месяца, PAL от Gao с соавторами, делает то же самое в общем виде. Модель пишет программу, а интерпретатор её выполняет. Модели, построенные для `FinQA` и `TAT-QA`, 2 наборов 2021 года с такими вопросами по финансовым отчётам, тоже отдают вычисление коду.

## Где я бы провёл границу

Для меня граница теперь яснее. Если число, которое вернула модель, напечатано в документе, я могу хотя бы проверить, что оно там есть. Ответ со строки выше такая проверка не поймает, но это хоть что-то. Если число надо посчитать, Flan-T5 на этих счетах почти никогда не считает его верно. Она возвращает что-то правильной формы. Проверка, что ответ не является числом из документа, поймала бы 217 из 399 неверных итогов large. Остальные 182 прошли бы.

Правила для ошибок чтения у меня до сих пор нет: строка выше в длинных счетах и итоги больше 1000. Они редкие и парсер принимает их как любой верный ответ.

## Чего я не проверял

- Модели крупнее. `text-davinci-003` от OpenAI доступна через API около 2 недель. Для этого прогона мне нужна была модель на своей машине, поэтому davinci я не пробовал. Крупные модели, может быть, сложат 4 числа верно.
- Настоящие счета. Мои синтетические, на английском, по одной строке на позицию. В них нет сканов и ошибок OCR.
- Другие промпты. Я использовал 1 формулировку на вопрос и жадное декодирование. Примеры в промпте могли бы изменить числа, особенно у base.
