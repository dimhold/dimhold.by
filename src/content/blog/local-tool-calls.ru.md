---
title: "Модель знает про 1440 минут в сутках и ставит напоминание через 24"
description: "Я дал Qwen3-0.6B в llama.cpp 10 инструментов и 80 запросов на 2 ядрах процессора. Все 49 вызовов оказались корректным JSON с существующими инструментами, верны из них 28. Проверка по схеме остановила бы один из 21 неверного."
date: 2025-06-01
lang: ru
translationKey: local-tool-calls
tags: ["llm", "agents", "reliability"]
---

Два ответа из одного прогона, модель та же и список инструментов тот же. Спрашиваю, сколько минут в сутках:

```
A day has 24 hours, and each hour has 60 minutes, so there are 24 × 60 = 1,440 minutes in a day.
```

Потом прошу "Remind me in a day with the text: water", то есть напомнить через сутки:

```
{"name": "create_reminder", "arguments": {"text": "water", "minutes": 24}}
```

Вызов корректный. Инструмент выбран тот, в поле целое число, как требует схема. Между моделью и моим напоминанием нет ничего, что бы его остановило.

Я привык думать, что маленькая локальная модель ломается на форме, портит JSON или вызывает инструмент, которого ей никто не давал. Поэтому для агента на своей машине я поставил бы проверку по схеме с повтором при ошибке. Что такая проверка ловит на самом деле, я ни разу не мерил.

## Что я запускал

Модель Qwen3-0.6B, официальный файл GGUF в квантовании Q8_0 на 639 МБ. Запускал её в llama.cpp, сборка b5554 от 31 мая, на 2 ядрах виртуальной машины и с контекстом в 4096 токенов. На пике сервер занял 1,2 ГБ памяти. Температура 0, рассуждение выключено пустым блоком think, как это делает шаблон чата. Обычно `llama-server` при наличии инструментов ограничивает вызов грамматикой. Мне хотелось увидеть саму модель, поэтому промпт из шаблона я отправлял как обычный текст на продолжение.

Инструментов 10, набор для помощника на домашнем компьютере. Запросов 80, все на английском и у каждого есть эталон. В 24 запросах все аргументы стоят в тексте как есть. В 16 один из аргументов надо сначала пересчитать. Ещё в 16 не хватает обязательного аргумента и правильно было бы переспросить. Для 16 подходящего инструмента нет, остальные 8 просто вопросы. Вызов засчитан, только если он в точности равен эталону. В последних 3 группах я считал ответ верным, если вызова в нём нет.

До прогона я записал, чего жду: от 3 до 10 выдуманных инструментов, а хуже всего будет с пропущенными аргументами.

Другие делают это на тысячах примеров. Рейтинг BFCL из Беркли сравнивает вызовы с эталоном, а выдуманные вызовы API ещё в 2023 году считали авторы Gorilla. Апрельская работа When2Call как раз о том, понимает ли модель, что вызывать ничего не надо.

## С формой всё хорошо

Вызов был в 49 ответах. Все 49 разбираются как JSON, все имена взяты из списка. Ни одного выдуманного имени аргумента и ни одного потерянного. Схему нарушил только `"minutes": 1.5`. Выдуманных инструментов я ждал хотя бы 3, а получил 0.

Верных вызовов из 49 оказалось 28. Из 21 неверного моя проверка по схеме остановила бы один.

<figure class="fig">
<svg viewBox="0 0 680 190" role="img" aria-label="49 ответов с вызовом инструмента. В 49 JSON разбирается, в 49 инструмент существует, в 48 аргументы подходят под схему, в 28 вызов верный.">
  <text x="198" y="31" text-anchor="end" class="f-mono f-muted" style="font-size:12px">ответы с вызовом</text>
  <rect x="210" y="14" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="14" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="31" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="65" text-anchor="end" class="f-mono f-muted" style="font-size:12px">JSON разбирается</text>
  <rect x="210" y="48" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="48" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="65" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="99" text-anchor="end" class="f-mono f-muted" style="font-size:12px">инструмент есть в списке</text>
  <rect x="210" y="82" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="82" width="420.0" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="99" text-anchor="start" class="f-mono f-ink" style="font-size:12px">49</text>
  <text x="198" y="133" text-anchor="end" class="f-mono f-muted" style="font-size:12px">аргументы по схеме</text>
  <rect x="210" y="116" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="116" width="411.4" height="24" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="640" y="133" text-anchor="start" class="f-mono f-ink" style="font-size:12px">48</text>
  <text x="198" y="167" text-anchor="end" class="f-mono f-muted" style="font-size:12px">вызов верный</text>
  <rect x="210" y="150" width="420" height="24" class="f-plain" style="fill:none"/>
  <rect x="210" y="150" width="240.0" height="24" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="640" y="167" text-anchor="start" class="f-mono f-ink" style="font-size:12px">28</text>
</svg>
<figcaption>Сколько из 49 вызовов остаётся после каждой проверки. Первые 4 полосы машина проверит сама, не зная, чего я хотел.</figcaption>
</figure>

## Где ломается

Когда аргументы стоят в тексте, проходят 22 запроса из 24. Когда что-то надо пересчитать, проходят 6 из 16. Это почти так же плохо, как с пропущенными аргументами, там 5.

Лучше всего видно на напоминаниях. Неверны все 5. Полтора часа превратились в 1.5, сутки в 24, похоже, в поле для минут пришли часы. Четверть часа стала числом 60 и объяснить это я не могу.

<figure class="fig">
<svg viewBox="0 0 680 186" role="img" aria-label="5 просьб о напоминании. Нужно минут: 90, 180, 15, 140, 1440. Без рассуждений модель даёт 1.5, 3, 60, 20, 24. С рассуждением 105, 180, 15, 140, 24. Если инструмент принимает слова: 1.5 hours, 3 hours, 30, 2 hours and 20 minutes, 1 day.">
  <text x="12" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">запрос</text>
  <text x="275" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">нужно минут</text>
  <text x="385" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">без рассуждений</text>
  <text x="488" y="22" text-anchor="end" class="f-label f-muted" style="font-size:10px">с рассуждением</text>
  <text x="504" y="22" text-anchor="start" class="f-label f-muted" style="font-size:10px">словами</text>
  <line x1="12" y1="32" x2="668" y2="32" class="f-plain"/>
  <text x="12" y="56" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in an hour and a half</text>
  <text x="275" y="56" text-anchor="end" class="f-mono f-ink" style="font-size:12px">90</text>
  <text x="385" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">1.5</text>
  <text x="488" y="56" text-anchor="end" class="f-mono f-accent" style="font-size:12px">105</text>
  <text x="504" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1.5 hours</text>
  <text x="12" y="84" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 3 hours</text>
  <text x="275" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="385" y="84" text-anchor="end" class="f-mono f-accent" style="font-size:12px">3</text>
  <text x="488" y="84" text-anchor="end" class="f-mono f-ink" style="font-size:12px">180</text>
  <text x="504" y="84" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3 hours</text>
  <text x="12" y="112" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a quarter of an hour</text>
  <text x="275" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="385" y="112" text-anchor="end" class="f-mono f-accent" style="font-size:12px">60</text>
  <text x="488" y="112" text-anchor="end" class="f-mono f-ink" style="font-size:12px">15</text>
  <text x="504" y="112" text-anchor="start" class="f-mono f-accent" style="font-size:11px">30</text>
  <text x="12" y="140" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in 2 hours and 20 minutes</text>
  <text x="275" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="385" y="140" text-anchor="end" class="f-mono f-accent" style="font-size:12px">20</text>
  <text x="488" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:12px">140</text>
  <text x="504" y="140" text-anchor="start" class="f-mono f-ink" style="font-size:11px">2 hours and 20 minutes</text>
  <text x="12" y="168" text-anchor="start" class="f-mono f-muted" style="font-size:11px">in a day</text>
  <text x="275" y="168" text-anchor="end" class="f-mono f-ink" style="font-size:12px">1440</text>
  <text x="385" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="488" y="168" text-anchor="end" class="f-mono f-accent" style="font-size:12px">24</text>
  <text x="504" y="168" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1 day</text>
</svg>
<figcaption>5 просьб о напоминании и то, что пришло в аргументе. Неверные значения выделены акцентным цветом. В последней колонке другой вариант инструмента, который принимает задержку строкой.</figcaption>
</figure>

С громкостью лучше, 3 из 4, но на "Mute the sound" вызова не было, только текст "Set the sound volume to 0." В календаре прошёл 1 запрос из 5. В 3 неудачах из 4 дата уехала в название, например "Dinner on June 14, 2025 at 7:30 pm". В 2 из них сами дата и время верны, так что судья помягче насчитал бы 8 из 16.

Когда аргумента не хватало, модель в 11 случаях из 16 придумала его сама. Хлебу достались 10 минут, картинке с котом 200 пикселей. Файл, который я не назвал, стал `/path/to/file.txt`, а в парикмахерскую без даты я записан на 18 сентября 2023 года.

## Мой подсчёт поверил двум выдумкам

Из 16 запросов без подходящего инструмента к вызову привёл только один. Я был этой группой доволен, пока не прочитал ответы. "The image `/home/me/cat.png` has been rotated by 90 degrees." Картинку якобы повернули, хотя вызова не было и такого инструмента тоже нет. По моему правилу ответ засчитан. В группе с пропущенными аргументами на "Move the file into /home/me/papers" модель сообщила, что файл перемещён. Тоже засчитано.

Критерий я оставил таким, каким записал до прогона, а эти 2 ответа называю отдельно. Переспросить, чего я и хотел от группы с пропущенными аргументами, модель догадалась в 2 случаях, хотя по подсчёту верных ответов там 5.

## Что я пробовал

Сначала правило в системном промпте: вызывать инструмент, только если он делает ровно то, о чём просят, недостающий аргумент спросить, а если ничего не подходит, так и сказать.

<figure class="fig">
<svg viewBox="0 0 680 244" role="img" aria-label="Верные ответы на 80 запросов без правила и с правилом. Аргументы как есть 22 и 21 из 24, надо пересчитать 6 и 3 из 16, аргумента не хватает 5 и 7 из 16, нет инструмента 15 и 16 из 16, просто вопрос 8 и 8 из 8.">
  <text x="12" y="36" text-anchor="start" class="f-mono f-ink" style="font-size:12px">аргументы как есть</text>
  <text x="274" y="23" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правила</text>
  <rect x="284" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="13" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="13" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="23" text-anchor="end" class="f-mono f-muted" style="font-size:11px">22/24</text>
  <text x="274" y="42" text-anchor="end" class="f-label f-muted" style="font-size:10px">с правилом</text>
  <rect x="284" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="508" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="522" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="536" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="550" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="564" y="32" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="578" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="592" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="606" y="32" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="42" text-anchor="end" class="f-mono f-muted" style="font-size:11px">21/24</text>
  <text x="12" y="82" text-anchor="start" class="f-mono f-ink" style="font-size:12px">надо пересчитать</text>
  <text x="274" y="69" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правила</text>
  <rect x="284" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="59" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="59" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="69" text-anchor="end" class="f-mono f-muted" style="font-size:11px">6/16</text>
  <text x="274" y="88" text-anchor="end" class="f-label f-muted" style="font-size:10px">с правилом</text>
  <rect x="284" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="78" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="78" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="88" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3/16</text>
  <text x="12" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:12px">аргумента не хватает</text>
  <text x="274" y="115" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правила</text>
  <rect x="284" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="105" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="105" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="115" text-anchor="end" class="f-mono f-muted" style="font-size:11px">5/16</text>
  <text x="274" y="134" text-anchor="end" class="f-label f-muted" style="font-size:10px">с правилом</text>
  <rect x="284" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="124" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="124" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="134" text-anchor="end" class="f-mono f-muted" style="font-size:11px">7/16</text>
  <text x="12" y="174" text-anchor="start" class="f-mono f-ink" style="font-size:12px">нет инструмента</text>
  <text x="274" y="161" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правила</text>
  <rect x="284" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="151" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="151" width="11" height="11" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="161" text-anchor="end" class="f-mono f-muted" style="font-size:11px">15/16</text>
  <text x="274" y="180" text-anchor="end" class="f-label f-muted" style="font-size:10px">с правилом</text>
  <rect x="284" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="396" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="410" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="424" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="438" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="452" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="466" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="480" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="494" y="170" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="180" text-anchor="end" class="f-mono f-muted" style="font-size:11px">16/16</text>
  <text x="12" y="220" text-anchor="start" class="f-mono f-ink" style="font-size:12px">просто вопрос</text>
  <text x="274" y="207" text-anchor="end" class="f-label f-muted" style="font-size:10px">без правила</text>
  <rect x="284" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="197" width="11" height="11" style="fill:var(--ink);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="207" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
  <text x="274" y="226" text-anchor="end" class="f-label f-muted" style="font-size:10px">с правилом</text>
  <rect x="284" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="298" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="312" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="326" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="340" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="354" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="368" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <rect x="382" y="216" width="11" height="11" style="fill:var(--accent);stroke:var(--muted);stroke-width:1"/>
  <text x="668" y="226" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8/8</text>
</svg>
<figcaption>Каждый квадрат это один запрос, закрашен, если засчитан. В 3 нижних группах для этого достаточно, чтобы вызова не было, что бы ни говорил текст.</figcaption>
</figure>

Вместо 56 верных ответов из 80 стало 55. Переспрашивает модель чаще, 6 раз из 16 против 2, но в 9 запросах аргумент по-прежнему выдуман. Расплата пришла, откуда я не ждал: по громкости было 3 из 4, стало 0.

```
You cannot set the volume to three quarters. The volume can be set between 0 and 100, inclusive.
```

Выходит, громкость бывает от 0 до 100 включительно, но три четверти поставить нельзя.

Потом рассуждение, с температурой, top_p, top_k и min_p из карточки модели. Первому скрипту хватило времени только на 4 задачи, поэтому я сделал второй прогон, уже на одних 16 запросах с пересчётом. Вышло 7 из 16 против 6. Медианный ответ занимает 8,1 секунды вместо 1,5 и 180,5 токена вместо 29. Напоминания поднялись с 0 до 3 из 5, календарь опустился с 1 до 0. Один запрос упёрся в мой предел в 600 токенов, хотя верное число 1920 в рассуждении уже прозвучало.

Сами рассуждения стоит почитать. Про выключение звука: "Muting sounds usually means setting the volume to 0. So I need to call set_volume with percent 100." Про сутки модель напоминает себе, что параметр в минутах, пишет "that's 24 hours" и отправляет 24.

Напоследок я попробовал отобрать у модели арифметику. В другом варианте инструментов задержку надо передать строкой, как её назвал пользователь, громкость и дату со временем тоже. Разбирал бы строки потом код. Таких запросов 13, дословно переписано 5. Если читать по смыслу, а такое чтение я добавил уже после прогона, выходит 7. С числами на тех же запросах было 4, с рассуждением 6, но если и там быть помягче и простить названия, получится 6 и 8. Я собирался назвать это половиной решения, а теперь выигрыша не вижу совсем. "3 hours" и "1 day" дошли, зато из "in 20 minutes" осталось "20" и единица потерялась. Разбора строк я не написал.

Проверку по схеме я бы оставил, она дешёвая, но рассчитывать на неё не стал бы. Всё, что пишет или перемещает файлы, пусть сначала показывает вызов мне.

## Чего я не проверял

Одна модель одного размера, запросы только на английском. У Qwen3 есть версии 1.7B и 4B, думаю, они лучше, но я их не пробовал. Без рассуждений карточка советует температуру 0,7, а я взял 0, чтобы прогон можно было повторить. Ещё она советует presence penalty 1,5, я его не выставил. Рассуждение, которое ходило по кругу до 600 токенов, может быть отчасти на моей совести. Каждое число получено за один прогон, группы маленькие, так что из 7 против 6 я бы ничего не выводил. С грамматикой `llama-server` я не запускал. По её исходникам у целого числа дробной части быть не может, так что 1.5 пройти не должно, но что встало бы на это место, не знаю. Переспросил ответ или соврал, решал я сам, список лежит в скрипте.
