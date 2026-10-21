---
title: "codecard отказывается рисовать сниппет, который выдаёт кодовую базу. Все 569 строк пакета Kotlin, которые я ему дал, он пропустил"
description: "codecard отказывается рисовать карточку, если сниппет выдаёт кодовую базу. Я прогнал его гард по 9 публичным репозиториям и 31 форме утечки. Он отказал 2,2% случайных окон публичного кода, отчасти из-за флага регистра, который превращает маршруты /users/ в пути сборки. Из 569 строк пакета Kotlin он не поймал ни одной, потому что правилу нужна точка с запятой. Рядом с gitleaks 8.30.1 он поймал 6 из 13 секретов и 10 из 18 форм, выдающих кодовую базу."
date: 2026-10-18
lang: ru
translationKey: codecard-guard
tags: ["code-quality", "text"]
---
В августе я открыл [codecard](https://github.com/dimhold/codecard). Он рисует сниппет кода или лога как карточку для ленты. Перед тем как рисовать, он читает текст и отказывается, если текст выдаёт кодовую базу. То есть строка пакета, импорт вашего собственного кода, путь сборки с именем пользователя, внутренний хост или что-то похожее на учётные данные. Отказ у него жёсткий: код возврата 2 и никакого файла. Я сделал так потому, что предупреждение в час ночи пролистывают, а картинка остаётся в чужой ленте.

У гарда 11 правил и 171 тест и все они проходят. Но каждый случай в этих тестах написан для этих тестов. Пример в README это файл на Java, который я придумал так, чтобы в нём было ровно 5 утечек. Гард ни разу не видел кода, который писал не я, поэтому я запустил его на чужом коде.

Я взял codecard с GitHub на последнем коммите, `f10a09e`, на Python 3.12. Рядом положил 9 публичных репозиториев на их последнем коммите до 1 октября. Это 8 языков от Java до Rust, среди них `spring-petclinic` и `vite`. Из каждого репозитория я взял до 300 файлов. Из каждого файла взял 2 окна по 15 строк: начало файла и одно случайное окно из остального. Второе окно примерно то, что я копирую, когда хочу показать функцию.

## Как часто он отказывает публичному коду

Всё в этом корпусе уже опубликовано, так что каждый отказ здесь это отказ коду, который не секрет. На случайных окнах из середины файла он отказал в 17 случаях из 790, это 2,2%. На первых строках файлов он отказал в 138 из 1200. 132 из них это файлы C# в MediatR, где namespace стоит в первых 15 строках. По его же определению гард тут прав: namespace действительно называет кодовую базу. Эта база публичная и для такого случая есть `--guard off`.

Часть из 17 это шум. В express он отказал тесту с URL `/users/0-2`. Правило путей ищет среди прочего `/Users/` на macOS и `/home/` на Linux. Но codecard компилирует все правила по умолчанию с `re.I`, поэтому маршрут в нижнем регистре тоже подходит. По всем файлам корпуса правило путей срабатывает на 107 строках и 23 из них только из-за этого флага. В okhttp он отказал импортам `org.robolectric` и `org.bouncycastle`. У правила приватных импортов есть белый список из 26 имён групп, а любое другое имя оно считает вашим собственным кодом.

2,2% это цена, которую я принял в августе вслепую. Теперь я знаю число. Отказ стоит мне одного `--guard off`. С флагом регистра другое дело, его надо чинить.

## Строка, которую он обещал ловить

Потом я прогнал гард по строке объявления каждого файла, без выборки и по одной строке. Java дала 106 пойманных из 106, C# дал 133 из 133. Kotlin дал 0 из 569.

<figure class="fig">
<svg viewBox="0 0 640 214" role="img" aria-label="Правило package-declaration в codecard кончается точкой с запятой. Под ним две строки: строка Java package com.acmebank.ledger.settlement с точкой с запятой, поймана в 106 из 106 файлов Java, и та же строка Kotlin без точки с запятой в конце, поймана в 0 из 569 файлов Kotlin.">
  <text x="24" y="34" class="f-label f-muted">правило:</text>
  <text x="110" y="34" textLength="218.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-muted">^[ \t]*package\s+[\w.]+\s*</text>
  <text x="328.4" y="34" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="24" y="92" class="f-label f-ink">Java</text>
  <text x="110" y="92" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="74" width="10.4" height="24" style="fill:var(--accent);fill-opacity:0.18;stroke:var(--accent);stroke-width:1"/>
  <text x="429.2" y="92" textLength="8.4" lengthAdjust="spacingAndGlyphs" class="f-mono f-accent">;</text>
  <text x="110" y="118" class="f-label f-muted">поймано в 106 из 106 файлов</text>
  <text x="24" y="170" class="f-label f-ink">Kotlin</text>
  <text x="110" y="170" textLength="319.2" lengthAdjust="spacingAndGlyphs" class="f-mono f-ink">package com.acmebank.ledger.settlement</text>
  <rect x="428.2" y="152" width="10.4" height="24" style="fill:none;stroke:var(--accent);stroke-width:1;stroke-dasharray:3 2"/>
  <text x="447.6" y="168" class="f-label f-accent">этого ждёт правило</text>
  <text x="110" y="196" class="f-label f-accent">поймано в 0 из 569 файлов</text>
</svg>
<figcaption>Строка пакета каждого файла корпуса, проверенная отдельно. Правило для namespace в C# допускает строку без точки с запятой и поймало 133 из 133.</figcaption>
</figure>

Правилу нужна точка с запятой в конце строки пакета, а Kotlin её там не ставит. Когда правило срабатывает, оно печатает причину "a Java or Kotlin package name is your company and product, spelled out", то есть имя пакета Java или Kotlin это название вашей компании и продукта открытым текстом. Эту фразу и регулярку я писал, глядя на файл Java. Тесты к ним тоже на Java.

Это хуже, чем одна пропущенная строка. Я взял пример с утечками из README и переписал его на Kotlin. Гард всё равно отказывает, с 4 находками: импорт, ключ, хост и путь. Пакета в списке нет. Когда я исправляю 4 вещи, о которых он сказал, карточка рисуется с `package com.acmebank.ledger.settlement` в первой строке и кодом возврата 0. Тот же файл с точкой с запятой даёт код 2. В час ночи список выглядит полным, так что я бы исправил эти 4 и опубликовал.

## Рядом со сканером секретов

Потом я захотел узнать, что гард пропускает. Настоящие утечки я посчитать не могу, поэтому составил список из 31 формы утечки, какие бывают при вставке из редактора или в логе. Я прогнал их через codecard и через gitleaks 8.30.1, сканер, который я бы поставил на репозиторий. Секреты в списке это случайные строки нужного формата, они генерируются при запуске.

<figure class="fig">
<svg viewBox="0 0 640 617" role="img" aria-label="Таблица из 31 формы утечки в 2 группах и 2 колонках, codecard и gitleaks 8.30.1. Формы, которые выдают кодовую базу: codecard поймал 10 из 18, gitleaks 0. Секреты: codecard поймал 6 из 13, gitleaks 12. 8 форм не ловит ни один инструмент, все из первой группы.">
  <text x="420" y="22" text-anchor="middle" class="f-label f-ink">codecard</text>
  <text x="540" y="22" text-anchor="middle" class="f-label f-ink">gitleaks</text>
  <text x="24" y="46" class="f-label f-muted">выдаёт кодовую базу (18)</text>
  <text x="420" y="46" text-anchor="middle" class="f-label f-muted">10</text>
  <text x="540" y="46" text-anchor="middle" class="f-label f-muted">0</text>
  <line x1="24" y1="51" x2="616" y2="51" class="f-line"/>
  <text x="330" y="69" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пакет Java</text>
  <circle cx="420" cy="65" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="65" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="86" text-anchor="end" class="f-mono f-accent" style="font-size:12px">пакет Kotlin</text>
  <circle cx="420" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="82" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="103" text-anchor="end" class="f-mono f-ink" style="font-size:12px">namespace C#</text>
  <circle cx="420" cy="99" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="99" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="120" text-anchor="end" class="f-mono f-ink" style="font-size:12px">импорт Java</text>
  <circle cx="420" cy="116" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="116" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="137" text-anchor="end" class="f-mono f-ink" style="font-size:12px">импорт Kotlin</text>
  <circle cx="420" cy="133" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="133" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="154" text-anchor="end" class="f-mono f-accent" style="font-size:12px">импорт Python</text>
  <circle cx="420" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="150" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="171" text-anchor="end" class="f-mono f-accent" style="font-size:12px">импорт Go</text>
  <circle cx="420" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="167" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="188" text-anchor="end" class="f-mono f-accent" style="font-size:12px">импорт TypeScript</text>
  <circle cx="420" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="184" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="205" text-anchor="end" class="f-mono f-ink" style="font-size:12px">C:\Users\ в трассировке .NET</text>
  <circle cx="420" cy="201" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="201" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="222" text-anchor="end" class="f-mono f-ink" style="font-size:12px">путь /home/ в ошибке</text>
  <circle cx="420" cy="218" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="218" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="239" text-anchor="end" class="f-mono f-ink" style="font-size:12px">путь /Users/ в стеке</text>
  <circle cx="420" cy="235" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="235" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="256" text-anchor="end" class="f-mono f-ink" style="font-size:12px">путь в трассе Python</text>
  <circle cx="420" cy="252" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="252" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="273" text-anchor="end" class="f-mono f-accent" style="font-size:12px">путь с ~</text>
  <circle cx="420" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="269" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="290" text-anchor="end" class="f-mono f-ink" style="font-size:12px">URL https://*.internal</text>
  <circle cx="420" cy="286" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="286" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="307" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.internal:5432 без схемы</text>
  <circle cx="420" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="303" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="324" text-anchor="end" class="f-mono f-accent" style="font-size:12px">*.svc.cluster.local</text>
  <circle cx="420" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="320" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="341" text-anchor="end" class="f-mono f-accent" style="font-size:12px">хост на домене компании</text>
  <circle cx="420" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="337" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="358" text-anchor="end" class="f-mono f-ink" style="font-size:12px">адрес 10.x</text>
  <circle cx="420" cy="354" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="354" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="24" y="376" class="f-label f-muted">секреты (13)</text>
  <text x="420" y="376" text-anchor="middle" class="f-label f-muted">6</text>
  <text x="540" y="376" text-anchor="middle" class="f-label f-muted">12</text>
  <line x1="24" y1="381" x2="616" y2="381" class="f-line"/>
  <text x="330" y="399" text-anchor="end" class="f-mono f-ink" style="font-size:12px">API_KEY = &quot;...&quot;</text>
  <circle cx="420" cy="395" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="395" r="5" style="fill:var(--accent)"/>
  <text x="330" y="416" text-anchor="end" class="f-mono f-ink" style="font-size:12px">строка .env без кавычек</text>
  <circle cx="420" cy="412" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="412" r="5" style="fill:var(--accent)"/>
  <text x="330" y="433" text-anchor="end" class="f-mono f-ink" style="font-size:12px">пароль в YAML без кавычек</text>
  <circle cx="420" cy="429" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="429" r="5" style="fill:var(--accent)"/>
  <text x="330" y="450" text-anchor="end" class="f-mono f-ink" style="font-size:12px">Authorization: Bearer</text>
  <circle cx="420" cy="446" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="446" r="5" style="fill:var(--accent)"/>
  <text x="330" y="467" text-anchor="end" class="f-mono f-ink" style="font-size:12px">заголовок token в curl</text>
  <circle cx="420" cy="463" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="463" r="5" style="fill:var(--accent)"/>
  <text x="330" y="484" text-anchor="end" class="f-mono f-ink" style="font-size:12px">ключ AWS AKIA...</text>
  <circle cx="420" cy="480" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="480" r="5" style="fill:var(--accent)"/>
  <text x="330" y="501" text-anchor="end" class="f-mono f-ink" style="font-size:12px">секретный ключ AWS</text>
  <circle cx="420" cy="497" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="497" r="5" style="fill:var(--accent)"/>
  <text x="330" y="518" text-anchor="end" class="f-mono f-ink" style="font-size:12px">блок приватного ключа</text>
  <circle cx="420" cy="514" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="514" r="5" style="fill:var(--accent)"/>
  <text x="330" y="535" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JWT</text>
  <circle cx="420" cy="531" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="531" r="5" style="fill:var(--accent)"/>
  <text x="330" y="552" text-anchor="end" class="f-mono f-ink" style="font-size:12px">postgres://user:pass@</text>
  <circle cx="420" cy="548" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="548" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="330" y="569" text-anchor="end" class="f-mono f-ink" style="font-size:12px">JDBC ?password=</text>
  <circle cx="420" cy="565" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="565" r="5" style="fill:var(--accent)"/>
  <text x="330" y="586" text-anchor="end" class="f-mono f-ink" style="font-size:12px">вебхук Slack</text>
  <circle cx="420" cy="582" r="5" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <circle cx="540" cy="582" r="5" style="fill:var(--accent)"/>
  <text x="330" y="603" text-anchor="end" class="f-mono f-ink" style="font-size:12px">api_key=&quot;sk-proj-...&quot;</text>
  <circle cx="420" cy="599" r="5" style="fill:var(--accent)"/>
  <circle cx="540" cy="599" r="5" style="fill:var(--accent)"/>
</svg>
<figcaption>31 форма утечки, по строке на каждую. Закрашенная точка значит, что инструмент строку поймал, синяя подпись значит, что не поймал ни один. Секреты это случайные строки нужного формата.</figcaption>
</figure>

Эти 2 инструмента почти не пересекаются. Из 18 форм, которые выдают кодовую базу, codecard поймал 10, а gitleaks ни одной. Это справедливо: gitleaks сделан для секретов. Из 13 секретов gitleaks поймал 12, а codecard 6. Его правило для учётных данных видит значение только в кавычках после имени вроде `api_key` или `password`. Строка из файла `.env` рисуется. Рисуются и пароль в YAML без кавычек и заголовок `Authorization: Bearer` в логе и URL вебхука Slack. Вот это немного обидно. Тему `ember` я сделал для упавших логов, а в логе токен Bearer как раз стоит без кавычек.

Вместе они поймали 23 из 31. Все 8, которых не поймал ни один из них, выдают кодовую базу. Среди них пакет Kotlin и внутренний хост без `https://` в начале. Труднее всего хост на собственном домене компании и я не представляю, как его ловить, не зная самой компании. В README уже написано, что гард не знает, как называется ваша компания.

## Первая строка README

Установка в README начинается с `pip install codecard`. Я запустил её в чистом virtualenv и pip не нашёл ни одного дистрибутива. Имя на PyPI вообще не зарегистрировано. Выходит, README инструмента, который существует ради защиты от утечек, предлагает ставить имя, которое может зарегистрировать кто угодно. Так было с середины августа, а я не замечал.

## Чего я не проверял

31 форма это мой собственный список, поэтому он говорит, какие формы проходят, а не как часто люди их вставляют. Корпус это 9 репозиториев и 1 случайное зерно. Другой размер окна мог бы сдвинуть 2,2%. trufflehog я не запускал. И я ещё ничего не починил. Точка с запятой, флаг регистра, секреты без кавычек и имя на PyPI так и остаются открытыми в codecard на `f10a09e`.
