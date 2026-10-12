---
title: "Мой инъектор сбоев повторяет прогон по одному seed. Профиль оказался частью seed"
description: "Мой инъектор сбоев для MCP повторил 3000 вызовов байт в байт на 4 версиях Node, а прогон агента 5 раз. Правило, вставленное наверх профиля, изменило 48,52% результатов, новый seed 53,17%."
date: 2026-10-12
lang: ru
translationKey: faultmcp-seed
tags: ["agents", "reliability"]
---
В августе я опубликовал [`fault-mcp`](https://github.com/dimhold/fault-mcp), сервер MCP, который нарочно ломает собственные инструменты. У него 6 типов сбоев. `error` и `empty` сообщают о себе сами, а `latency` отдаёт верный ответ с опозданием. Остальные 3 возвращают что-то неверное и молчат, `corrupt` в их числе. Это не первый такой инструмент. [`mcp-chaos`](https://github.com/ajinb/mcp-chaos) старше примерно на 2 месяца, у него тоже есть seed, а README воспроизводит своё демо с seed 42.

Сегодня я уже проверил одно предложение из README `fault-mcp` на настоящих клиентах и оно подтвердилось только для части из них. Поэтому я взял абзац, в котором был уверен больше всего, раздел Reproducibility:

> The decision for a given call depends only on `(seed, tool name, call number)`. Call 7 rolls the same numbers whether or not calls 1 through 6 ever happened, so a bad run replays from the seed alone with no session to re-drive. Change the seed and you get a different run; keep it and you get the same one, on any machine.

Если коротко, решение по вызову зависит только от seed, имени инструмента и номера вызова. Вызов 7 бросает те же числа, были вызовы с 1 по 6 или нет. Поэтому неудачный прогон повторяется по одному seed на любой машине.

Этот абзац и код под ним писал я. Тесты проверяют детерминизм в одном процессе: тот же seed и тот же номер вызова дают то же решение, а вызовы до него ни на что не влияют. CI гоняет их на Linux, Windows и macOS, но ни один тест не закрепляет конкретное значение, так что каждая машина согласна только сама с собой. Я ни разу не повторял целый прогон на другой версии Node и ни разу не правил профиль и не сравнивал результат. "На любой машине" было сказано про хеш-функцию. Больше нигде я прогон не запускал.

## Как мерил

Я взял `fault-mcp` 0.1.0 из npm, встроенный профиль `chaos` (все 6 типов сбоев, правила с вероятностями от 5 до 15%) и seed 1337. Скрипт делает фиксированный список вызовов к 3 инструментам из примера. Он печатает журнал без полей времени `ts` и `durationMs`, а затем его SHA-256. В режиме библиотеки мой скрипт подменяет `setTimeout`, поэтому сбой `latency` не ждёт и скрипт записывает выпавшую задержку. Клиент по stdio это `@modelcontextprotocol/sdk` 1.32.1. Для агентской части я взял Claude Code 2.1.292 с `claude-opus-5`, только с этим одним сервером MCP, запущенный из пустой папки.

## Что подтвердилось

3000 вызовов на Node 18.17.0, 20.18.1, 22.23.1 и 24.11.0 дали один хеш. Те же 3000 вызовов на втором хосте с Node 22.23.1 дали тот же хеш. Оба хоста x86_64 с одной и той же моделью процессора, так что "любая машина" всё ещё шире того, что я запускал. Потом я прогнал 150 вызовов через опубликованный CLI по stdio, с настоящими паузами. Это заняло минуту и журнал совпал с журналом библиотеки в 150 строках из 150.

Часть про номер вызова тоже подтвердилась. Я перенёс все вызовы `search` в начало, а остальные инструменты поставил после них в обратном порядке. Тип сбоя совпал на 300 из 300 пар (инструмент, номер вызова), а результаты `search` совпали в 100 случаях из 100. Когда я вручную выставил счётчик на 69, вызов 70 инструмента `search` дал тот же `error`, что и в полном прогоне. Вызовы с 1 по 69 действительно можно не делать. Здесь две схемы seed и расходятся. В `mcp-chaos` класс `FaultPlan` создаёт один `random.Random(seed)` на весь план и каждый вызов по очереди тянет из него числа. Вызов там зависит от вызовов до него, любого инструмента.

## Агент 5 раз сделал те же 7 вызовов

Здесь я взял профиль `flaky` и seed 1337. Промпт просил остатки на счетах с ACC-1001 по ACC-1006 и разрешал один повтор, если вызов упадёт. Во всех 5 прогонах агент сложил 6 вызовов в одно сообщение, получил `ETIMEDOUT` на ACC-1002 и повторил его. Если не считать времени, журналы совпали. В каждом ответе стояли те же 6 чисел, 2 из них неверные. Вызовы 1 и 4 были испорчены. ACC-1001 вернулся как 76 462,65 PLN вместо 86 996,23 USD, а ACC-1004 как 82 303,32 PLN вместо 58 115,28 PLN. Агент передал оба числа дальше во всех 5 прогонах. Его замечания касались дат `as_of`, а в 4 прогонах из 5 ещё и минорных единиц. Ни одно из них не ставило под сомнение эти 2 числа.

Потом я развернул порядок счетов в промпте и запустил прогон дважды.

<figure class="fig">
<svg viewBox="0 0 630 174" role="img" aria-label="Два прогона агента по 7 вызовов инструмента, оба с seed 1337. как в промпте: вызов 1 ACC-1001 порча, вызов 2 ACC-1002 error, вызов 3 ACC-1003 чисто, вызов 4 ACC-1004 порча, вызов 5 ACC-1005 чисто, вызов 6 ACC-1006 latency, вызов 7 ACC-1002 чисто; обратный: вызов 1 ACC-1006 порча, вызов 2 ACC-1005 error, вызов 3 ACC-1004 чисто, вызов 4 ACC-1003 порча, вызов 5 ACC-1002 чисто, вызов 6 ACC-1001 latency, вызов 7 ACC-1005 чисто. Вызовы 1 и 4 испорчены в обоих рядах, вызов 2 это ошибка, вызов 6 опаздывает, вызов 7 это повтор. Счета на этих вызовах разные.">
  <text x="167" y="18" text-anchor="middle" class="f-label f-muted">вызов 1</text>
  <text x="237" y="18" text-anchor="middle" class="f-label f-muted">вызов 2</text>
  <text x="307" y="18" text-anchor="middle" class="f-label f-muted">вызов 3</text>
  <text x="377" y="18" text-anchor="middle" class="f-label f-muted">вызов 4</text>
  <text x="447" y="18" text-anchor="middle" class="f-label f-muted">вызов 5</text>
  <text x="517" y="18" text-anchor="middle" class="f-label f-muted">вызов 6</text>
  <text x="587" y="18" text-anchor="middle" class="f-label f-muted">вызов 7</text>
  <text x="122" y="57" text-anchor="end" class="f-mono f-ink" style="font-size:11px">как в промпте</text>
  <rect x="135" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">порча</text>
  <text x="167" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1001</text>
  <rect x="205" y="32" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1002</text>
  <rect x="275" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="307" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1003</text>
  <rect x="345" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">порча</text>
  <text x="377" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1004</text>
  <rect x="415" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="447" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <rect x="485" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1006</text>
  <rect x="555" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="587" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <text x="122" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:11px">обратный</text>
  <rect x="135" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">порча</text>
  <text x="167" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1006</text>
  <rect x="205" y="84" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1005</text>
  <rect x="275" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="307" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1004</text>
  <rect x="345" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">порча</text>
  <text x="377" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1003</text>
  <rect x="415" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="447" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <rect x="485" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1001</text>
  <rect x="555" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чисто</text>
  <text x="587" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <text x="8" y="152" class="f-mono f-muted" style="font-size:10px">тёмная ячейка: тихая порча, синий контур: ошибка</text>
  <text x="8" y="166" class="f-mono f-muted" style="font-size:10px">под сбоем: счёт, запрошенный этим вызовом</text>
</svg>
<figcaption>Claude Code 2.1.292, профиль flaky, seed 1337. Сбой идёт за номером вызова. На какой счёт он попадёт, зависит от порядка, который выбрал агент.</figcaption>
</figure>

Расписание сбоев осталось привязано к номерам вызовов. Вызов 1 по-прежнему был испорчен, а вызов 2 по-прежнему упал по таймауту, но теперь вызов 1 пришёлся на ACC-1006, а вызов 4 на ACC-1003. Значит, seed фиксирует номер вызова, который сломается. Какой счёт окажется под этим номером, решает агент. Если он сменит порядок, тот же seed сломает другие счета. По той же нумерации лишний повтор должен сделать то же самое, хотя лишнего повтора в моих прогонах не было. В этих 7 прогонах Claude Code доставлял параллельные вызовы в порядке сообщения. Но я не вижу ничего, что бы это гарантировало.

## Где я ошибся

В моём селекторе есть комментарий:

> Probability 1 still draws, so that adding a certain rule in front of an uncertain one does not silently reshuffle the ones behind it.

Он говорит, что правило с вероятностью 1 всё равно тянет число, чтобы такое правило, вставленное перед вероятностным, молча не перетасовало правила за ним. Я понимал его как "профиль можно спокойно править". Спокойно можно только одним способом. У каждого вызова один поток случайных чисел и правила берут из него числа сверху вниз. Если поменять вероятность, каждое правило сохраняет свой номер в потоке. Результат меняется только у тех вызовов, где бросок этого правила попал между старым и новым значением. Если вставить правило наверх, каждое правило ниже берёт из потока число на одну позицию дальше, чем раньше, то есть уже другое. Исключение это правило с `onCalls`. На остальных вызовах оно пропускается без броска.

Обоснование в комментарии тоже неверное. Правило с вероятностью 1 срабатывает всегда и сразу возвращает результат, поэтому правила за ним в этом вызове вообще не проверяются. Его бросок меняет только содержимое его собственного сбоя.

<figure class="fig">
<svg viewBox="0 0 634 250" role="img" aria-label="Первые 6 случайных чисел вызова 5 инструмента get_account_balance, seed 1337: 0,810; 0,541; 0,161; 0,819; 0,036; 0,888. В профиле chaos как есть первые 4 достаются правилам error, empty, latency и truncate и не срабатывают. На пятом, 0,036, срабатывает правило schema. Если первым вставить правило error с вероятностью 2%, каждое правило получает следующее число и на том же 0,036 срабатывает truncate. В обоих случаях следующие числа идут на содержимое сбоя, а не на правила.">
  <text x="86" y="41" text-anchor="end" class="f-mono f-ink" style="font-size:11px">u</text>
  <text x="100" y="12" class="f-label f-muted">get_account_balance, вызов 5, seed 1337</text>
  <rect x="100" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="140" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,810</text>
  <rect x="188" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="228" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,541</text>
  <rect x="276" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="316" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,161</text>
  <rect x="364" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="404" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0,819</text>
  <rect x="452" y="24" width="80" height="26" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="492" y="41" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">0,036</text>
  <rect x="540" y="24" width="80" height="26" rx="3" class="f-plain"/>
  <text x="580" y="41" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">0,888</text>
  <text x="100" y="84" class="f-label f-muted">chaos как есть</text>
  <rect x="100" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="140" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="140" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,08</text>
  <rect x="188" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="228" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">empty</text>
  <text x="228" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,05</text>
  <rect x="276" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="316" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">latency</text>
  <text x="316" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,1</text>
  <rect x="364" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="404" y="108" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">truncate</text>
  <text x="404" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,08</text>
  <rect x="452" y="92" width="80" height="38" rx="3" class="f-box"/>
  <text x="492" y="108" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">schema</text>
  <text x="492" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,06</text>
  <rect x="540" y="92" width="80" height="38" rx="3" class="f-plain"/>
  <text x="580" y="108" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">corrupt</text>
  <text x="580" y="123" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,15</text>
  <text x="86" y="115" text-anchor="end" class="f-mono f-accent" style="font-size:11px">schema</text>
  <text x="100" y="162" class="f-label f-muted">первым вставлен error p 0,02</text>
  <rect x="100" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="140" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="140" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,02</text>
  <rect x="188" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="228" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">error</text>
  <text x="228" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,08</text>
  <rect x="276" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="316" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">empty</text>
  <text x="316" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,05</text>
  <rect x="364" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="404" y="186" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">latency</text>
  <text x="404" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,1</text>
  <rect x="452" y="170" width="80" height="38" rx="3" class="f-box"/>
  <text x="492" y="186" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">truncate</text>
  <text x="492" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,08</text>
  <rect x="540" y="170" width="80" height="38" rx="3" class="f-plain"/>
  <text x="580" y="186" text-anchor="middle" class="f-mono f-muted" style="font-size:11px;opacity:0.5">schema</text>
  <text x="580" y="201" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">p 0,06</text>
  <text x="86" y="193" text-anchor="end" class="f-mono f-accent" style="font-size:11px">truncate</text>
  <text x="100" y="242" class="f-mono f-muted" style="font-size:10px">правило срабатывает, если его число меньше p, другие не тянут</text>
</svg>
<figcaption>Каждое правило берёт следующее число из потока вызова. Вставленное правило сдвигает все правила ниже себя на одно число.</figcaption>
</figure>

Я измерил это на 30 000 вызовах, по 10 000 на инструмент, при фиксированном seed. Вставленное правило это `error` с p 0,02, так что само по себе оно срабатывает примерно на 2% вызовов. Вставленное первым, оно изменило результат у 48,52% всех вызовов. Новый seed как контроль изменил 53,17%. То же правило, добавленное в конец, изменило 1,21%.

<figure class="fig">
<svg viewBox="0 0 620 226" role="img" aria-label="Столбчатая диаграмма, доля вызовов из 30 000, у которых изменился результат после одной правки профиля при том же seed: новый seed (контроль) 53,17%, новое правило первым 48,52%, правило удалено 36,77%, 2 правила местами 13,96%, новое правило последним 1,21%, первое p 0,08 → 0,09 1,06%, последнее p 0,15 → 0,16 0,71%.">
  <text x="180" y="29" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новый seed (контроль)</text>
  <rect x="190" y="17" width="319.0" height="17" rx="2" class="f-plain" style="stroke-dasharray:3 2"/>
  <text x="515.0" y="29" class="f-mono f-ink" style="font-size:11px">53,17</text>
  <text x="180" y="55" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новое правило первым</text>
  <rect x="190" y="43" width="291.1" height="17" rx="2" class="f-box"/>
  <text x="487.1" y="55" class="f-mono f-accent" style="font-size:11px">48,52</text>
  <text x="180" y="81" text-anchor="end" class="f-mono f-ink" style="font-size:11px">правило удалено</text>
  <rect x="190" y="69" width="220.6" height="17" rx="2" class="f-box"/>
  <text x="416.6" y="81" class="f-mono f-ink" style="font-size:11px">36,77</text>
  <text x="180" y="107" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 правила местами</text>
  <rect x="190" y="95" width="83.8" height="17" rx="2" class="f-box"/>
  <text x="279.8" y="107" class="f-mono f-ink" style="font-size:11px">13,96</text>
  <text x="180" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новое правило последним</text>
  <rect x="190" y="121" width="7.3" height="17" rx="2" class="f-box"/>
  <text x="203.3" y="133" class="f-mono f-ink" style="font-size:11px">1,21</text>
  <text x="180" y="159" text-anchor="end" class="f-mono f-ink" style="font-size:11px">первое p 0,08 → 0,09</text>
  <rect x="190" y="147" width="6.4" height="17" rx="2" class="f-box"/>
  <text x="202.4" y="159" class="f-mono f-ink" style="font-size:11px">1,06</text>
  <text x="180" y="185" text-anchor="end" class="f-mono f-ink" style="font-size:11px">последнее p 0,15 → 0,16</text>
  <rect x="190" y="173" width="4.3" height="17" rx="2" class="f-box"/>
  <text x="200.3" y="185" class="f-mono f-ink" style="font-size:11px">0,71</text>
  <text x="190" y="218" class="f-mono f-muted" style="font-size:10px">% из 30 000 вызовов с другим результатом</text>
</svg>
<figcaption>faultmcp 0.1.0, профиль chaos, seed 1337, по 10 000 вызовов на инструмент.</figcaption>
</figure>

Так что сообщения об ошибке "ломается на seed 1337" недостаточно. К нему нужно прикладывать профиль, правило в правило. Даже правка текста сообщения в первом правиле изменила 7,86% результатов. Вставка правила наверх изменила почти столько же, сколько новый seed. В моём README об этом нет ни слова.

По пути вылезла мелочь. `--seed` и `FAULTMCP_SEED` проходят через `parseInt`, так что `0x10` молча становится seed 0, а `1337abc` в 1337. Стартовая строка в stderr показывает seed, который реально использован, но ничего не падает.

## Чего я не проверял

Я гонял только x86_64 и только Linux. Не проверял проксированные инструменты через `--upstream`, где настоящий сервер может отвечать по-разному от прогона к прогону и испорченный ответ меняется вместе с ним. Не пробовал других агентов кроме Claude Code и других моделей кроме `claude-opus-5`. 5 одинаковых прогонов агента на одном промпте ничего не говорят о долгой сессии, где у модели больше шансов выбрать другой путь. А ещё в журнале нет поля для задержки, которая выпала сбою `latency`. Её показывает только `durationMs` по часам, в моих прогонах с точностью до 3 мс. У правила в журнале стоит значение по умолчанию `ms: 2000`, похожее на задержку, но это не она.

Абзацу Reproducibility нужен профиль рядом с seed и слово про порядок вызовов. Я его пока не исправил.
