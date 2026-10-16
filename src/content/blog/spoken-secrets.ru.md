---
title: "Сканер секретов нашёл 2 секрета в заметках и ни одного в расшифровке Whisper того же разговора"
description: "Я написал выдуманный разговор с 11 приватными пунктами, записал его в виде заметок и прогнал устную версию через espeak-ng, MBROLA и Whisper base и small. В заметке gitleaks 8.15.2 нашёл ключ AWS и пароль. Вместе с Presidio 2.2.31 инструменты поймали 7 из 11 пунктов. На 4 расшифровках сканеры секретов не нашли ничего. Whisper сломал почти всё, у чего есть форма. Код от двери, код от банка, больную спину и зарплату он сохранил, а их не отметил ни один инструмент ни в одном документе."
date: 2022-12-26
lang: ru
translationKey: spoken-secrets
tags: ["machine-learning", "git", "text"]
---
С тех пор как в сентябре вышел Whisper, я прогоняю через него записи своих звонков. Расшифровки копятся в папке рядом с заметками. Очевидным местом для них был репозиторий git со сканером секретов в хуке на коммит, так же как защищают код. Потом я понял, что понятия не имею, что сканер видит в расшифровке: я запускал его только на коде.

Поэтому я это померил, но без своих настоящих звонков. Тащить настоящие разговоры в тест про их утечку мне не хотелось.

## Как я мерил

Я написал короткий разговор двух выдуманных людей, 12 реплик. В него я заложил 11 вещей, которые не должны выйти из комнаты: ключ доступа AWS, прочитанный по буквам, пароль от базы на стейджинге, код от двери офиса, код, который только что прислал банк, телефон, email, номер карты, IBAN, адрес, больную спину коллеги и зарплату, о которой просили молчать. Имён в нём два, Anna и Marek.

Каждая реплика есть в двух вариантах. Первый такой, как я набрал бы её в заметках во время звонка, например `DB_PASSWORD=PurpleOtter1987`. Второй такой, как её произнесли бы: "the staging database password is still purple otter nineteen eighty seven". Устный вариант я озвучил `espeak-ng` 1.51 двумя наборами голосов. Первый это обычные голоса espeak, второй MBROLA us1 и us2, на мой слух они звучат менее механически. Расшифровывал Whisper из репозитория в состоянии на 9 декабря, модели `base` и `small` на CPU, fp32, язык задан английский. Получилось 4 расшифровки одного разговора. Каждую реплику я синтезировал и расшифровывал отдельно, поэтому строка N расшифровки это всегда реплика N.

Для секретов я прогнал по каждому документу актуальные в этом году версии: gitleaks 8.15.2, trufflehog 3.21.0 и `detect-secrets` 1.4.0. Для личных данных я запускал Microsoft Presidio 2.2.31 с моделью spaCy `en_core_web_lg`. Повторный прогон Whisper дал те же 2 расшифровки MBROLA буква в букву. В расшифровках espeak поменялись 3 строки, потому что там Whisper переходил на сэмплирование: эти 3 строки декодируются при температуре 0,4 и выше. Ни одна ячейка таблицы ниже от этого не изменилась.

## Заметки

Здесь инструменты сделали примерно то, чего я ждал. gitleaks нашёл ключ AWS по форме: `AKIA` и ещё 16 знаков. Пароль он нашёл, потому что тот стоит после `PASSWORD=` и его энтропия 3,51 едва перешагивает порог правила, 3,5. Так что чуть менее случайный пароль прошёл бы. `detect-secrets` нашёл только ключ. trufflehog не нашёл ничего. Его детектору AWS нужен идентификатор ключа вместе с секретом, а секрет на 40 знаков в заметках к звонку бывает редко. Presidio нашёл телефон, email, карту, IBAN, город и оба имени. Ещё он решил, что `DE89 3704 0044` это человек.

Итого 7 из 11 пунктов поймал хотя бы один инструмент. Код от двери, код от банка, спину и зарплату не поймал никто. Ни у одного из этих 4 инструментов нет правила для четырёхзначного числа, которое кто-то назвал. Я не очень понимаю, как такое правило выглядело бы.

## Расшифровки

На 4 расшифровках 3 сканера секретов вместе выдали 0 находок.

Почему так, видно по строкам. Whisper `small` на голосах MBROLA записал ключ как `a KQX7 or HM2 PLT-4WZ6NB`. `AKIA` больше нет, так что регулярке не за что зацепиться. Пароль стал "purple under 1987", после слова password нет `=`, поэтому общее правило не срабатывает. Карта стала `for 1111 1111 1111 1111 1111`: первое "four" превратилось в предлог и появилась пятая группа. Presidio проверяет номера карт алгоритмом Луна. Оставшиеся цифры проверку не проходят. Email стал "hurrymail is in the dot calzcatexample.com". Marek стал "Merck" на голосах MBROLA и "America's" на espeak. Presidio принял America за географическое название. Anna уцелела один раз, внутри сломанной строки с email: espeak с `small` записал "Anna.Kaul's cat example.com". Только в этой расшифровке Presidio её и нашёл. В остальных она превратилась в "and", "in a" или пропала совсем. В расшифровке MBROLA `small` Presidio вместо неё нашёл человека по имени "hurrymail".

Я довольно долго читал эти строки, прежде чем увидел закономерность. Я ожидал, что на расшифровках инструментам будет труднее. Так и вышло, но теряется не что попало.

<figure class="fig">
<svg viewBox="0 0 640 350" role="img" aria-label="Сетка: 11 приватных пунктов против 5 документов (набранные заметки и 4 расшифровки Whisper). В заметке читаются все 11 значений, инструменты замечают 7. В расшифровках читаются от 4 до 5 значений, замечено от 1 до 2. Код от двери, код от банка, спина и зарплата читаются во всех 5 документах и не замечены ни в одном.">
  <text x="211" y="18" text-anchor="middle" class="f-label f-muted">заметки</text>
  <text x="211" y="32" text-anchor="middle" class="f-label f-muted">набраны</text>
  <text x="297" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="297" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="383" y="18" text-anchor="middle" class="f-label f-muted">espeak</text>
  <text x="383" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="469" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="469" y="32" text-anchor="middle" class="f-label f-muted">base</text>
  <text x="555" y="18" text-anchor="middle" class="f-label f-muted">MBROLA</text>
  <text x="555" y="32" text-anchor="middle" class="f-label f-muted">small</text>
  <text x="12" y="46" class="f-label f-accent">секреты</text>
  <text x="12" y="66" class="f-mono f-ink" style="font-size:12px">ключ AWS</text>
  <rect x="200" y="54" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="62" r="4" class="f-accent"/>
  <rect x="286" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="54" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="88" class="f-mono f-ink" style="font-size:12px">пароль базы</text>
  <rect x="200" y="76" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="84" r="4" class="f-accent"/>
  <rect x="286" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="76" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="110" class="f-mono f-ink" style="font-size:12px">код от двери</text>
  <rect x="200" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="98" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="98" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="132" class="f-mono f-ink" style="font-size:12px">код от банка</text>
  <rect x="200" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="120" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="120" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="148" class="f-label f-accent">личное</text>
  <text x="12" y="168" class="f-mono f-ink" style="font-size:12px">телефон</text>
  <rect x="200" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="164" r="4" class="f-accent"/>
  <rect x="286" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="156" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="492" cy="164" r="4" class="f-accent"/>
  <rect x="544" y="156" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="578" cy="164" r="4" class="f-accent"/>
  <text x="12" y="190" class="f-mono f-ink" style="font-size:12px">email</text>
  <rect x="200" y="178" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="186" r="4" class="f-accent"/>
  <rect x="286" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="178" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="212" class="f-mono f-ink" style="font-size:12px">карта</text>
  <rect x="200" y="200" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="208" r="4" class="f-accent"/>
  <rect x="286" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="200" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="234" class="f-mono f-ink" style="font-size:12px">IBAN</text>
  <rect x="200" y="222" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="230" r="4" class="f-accent"/>
  <rect x="286" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="372" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="458" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <rect x="544" y="222" width="22" height="16" rx="2" class="f-plain"/>
  <text x="12" y="256" class="f-mono f-ink" style="font-size:12px">адрес</text>
  <rect x="200" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="234" cy="252" r="4" class="f-accent"/>
  <rect x="286" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="320" cy="252" r="4" class="f-accent"/>
  <rect x="372" y="244" width="22" height="16" rx="2" class="f-box"/>
  <circle cx="406" cy="252" r="4" class="f-accent"/>
  <rect x="458" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="492" cy="252" r="4" class="f-accent"/>
  <rect x="544" y="244" width="22" height="16" rx="2" class="f-plain"/>
  <circle cx="578" cy="252" r="4" class="f-accent"/>
  <text x="12" y="278" class="f-mono f-ink" style="font-size:12px">спина коллеги</text>
  <rect x="200" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="266" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="266" width="22" height="16" rx="2" class="f-box"/>
  <text x="12" y="300" class="f-mono f-ink" style="font-size:12px">зарплата</text>
  <rect x="200" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="286" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="372" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="458" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="544" y="288" width="22" height="16" rx="2" class="f-box"/>
  <rect x="200" y="324" width="22" height="14" rx="2" class="f-box"/><text x="230" y="335" class="f-label f-muted">значение читается</text>
  <circle cx="420" cy="331" r="4" class="f-accent"/><text x="432" y="335" class="f-label f-muted">инструмент заметил</text>
</svg>
<figcaption>Whisper сохраняет короткие числа и простые слова и ломает то, у чего есть форма. Адрес считается замеченным, когда Presidio нашёл город.</figcaption>
</figure>

Whisper сломал большую часть того, что инструменты умеют искать, потому что у таких данных есть форма: префикс, контрольная сумма, `@`. Телефон тоже уцелел, но только на голосах MBROLA. Во всех расшифровках уцелели код от двери, код от банка, спина и зарплата, то есть ровно то, чего ни один инструмент не поймал ни в одном документе. Это короткие числа и простые слова. Whisper сохраняет числа и смысл, даже когда коверкает слова вокруг. В 1 расшифровке строка про дверь стала "The office norco is 4815". В расшифровках MBROLA читаемыми остались 5 из 11 пунктов. Presidio отметил 1 из этих 5, телефон, с оценкой 0,4. Ещё он отметил Springfield из адреса, который превратился в "14 ohms street".

<figure class="fig">
<svg viewBox="0 0 640 216" role="img" aria-label="3 пункта из разговора. Ключ AWS, прочитанный по буквам, выходит как a KQX7 or HM2 PLT-4WZ6NB, а правило ждёт AKIA и ещё 16 знаков, совпадения нет. Номер карты выходит как for 1111 1111 1111 1111 1111, это не 16 цифр с проверкой Луна, совпадения нет. Код от двери выходит как 4815, читается без ошибки, а правила для него нет.">
  <text x="12" y="18" class="f-label f-muted">сказано</text>
  <text x="212" y="18" class="f-label f-muted">Whisper small, MBROLA</text>
  <text x="444" y="18" class="f-label f-muted">что нужно инструменту</text>
  <rect x="12" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="49" class="f-mono f-muted" style="font-size:11px">A K I A Q X 7 R H M ...</text>
  <line x1="196" y1="45" x2="208" y2="45" class="f-line"/>
  <rect x="212" y="30" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="49" class="f-mono f-ink" style="font-size:11px">a KQX7 or HM2 PLT-4WZ6NB</text>
  <line x1="428" y1="45" x2="440" y2="45" class="f-line"/>
  <rect x="444" y="30" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="49" class="f-mono f-ink" style="font-size:11px">AKIA и ещё 16 знаков</text>
  <text x="452" y="76" class="f-mono f-muted" style="font-size:11px">не совпало</text>
  <rect x="12" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="111" class="f-mono f-muted" style="font-size:11px">four one one one, ...</text>
  <line x1="196" y1="107" x2="208" y2="107" class="f-line"/>
  <rect x="212" y="92" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="111" class="f-mono f-ink" style="font-size:11px">for 1111 1111 1111 1111 1111</text>
  <line x1="428" y1="107" x2="440" y2="107" class="f-line"/>
  <rect x="444" y="92" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="111" class="f-mono f-ink" style="font-size:11px">16 цифр, проверка Луна</text>
  <text x="452" y="138" class="f-mono f-muted" style="font-size:11px">не совпало</text>
  <rect x="12" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="20" y="173" class="f-mono f-muted" style="font-size:11px">four eight one five</text>
  <line x1="196" y1="169" x2="208" y2="169" class="f-line"/>
  <rect x="212" y="154" width="216" height="30" rx="3" class="f-box"/>
  <text x="220" y="173" class="f-mono f-ink" style="font-size:11px">4815</text>
  <line x1="428" y1="169" x2="440" y2="169" class="f-line"/>
  <rect x="444" y="154" width="184" height="30" rx="3" class="f-plain"/>
  <text x="452" y="173" class="f-mono f-ink" style="font-size:11px">правила нет</text>
  <text x="452" y="200" class="f-mono f-accent" style="font-size:11px">читается, не замечен</text>
</svg>
<figcaption>Те же 3 реплики, голоса MBROLA, Whisper small. Инструменты ищут форму, а речь её не сохраняет.</figcaption>
</figure>

Искажённые пункты по-прежнему читаются любым, кто знает команду: "Merck is up until Friday. The doctor says it is his back again."

## Что возвращает `git rm`

Вторая половина решения давно известна. Я проверил, как ведёт себя `git rm`, в основном затем, чтобы иметь право сказать, что проверил. Я закоммитил расшифровку, следующим коммитом удалил её через `git rm` и посмотрел. `git log -S'door'` находит оба коммита. Файл читается через `HEAD~1` после `git gc --prune=now`. Свежий клон его тоже содержит, потому что коммит, который его добавил, по-прежнему в истории. Чтобы убрать файл, надо переписать историю через `git filter-repo` или BFG и надеяться, что никто не успел склонировать. Страница GitHub про удаление конфиденциальных данных советует те же 2 инструмента и предупреждает о существующих клонах.

Так что расшифровки не попадают ни в один репозиторий. Папка лежит вне любых репозиториев. Сканер в хуке на коммит остаётся инструментом для кода.

## Чего я не проверял

Это 1 выдуманный разговор с синтетическими голосами. В настоящих звонках есть шум и акценты. Люди перебивают друг друга. С живым голосом Whisper, скорее всего, легче распознаёт имена. Я не пробовал модели `medium` и `large-v2`, которые могут восстановить ключ AWS или email. Я не пробовал русский. Presidio работал со стандартными распознавателями. Собственный шаблон для кодов от двери поймал бы часть из них, но, скорее всего, поймал бы и любое четырёхзначное число в разговоре. И я не пробовал языковую модель в роли детектора. Она, возможно, поняла бы "she asked us not to tell the team", но для этого ей пришлось бы прочитать расшифровку целиком.
