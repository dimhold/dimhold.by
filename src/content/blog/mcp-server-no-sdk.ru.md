---
title: "Мой MCP-сервер без SDK занял 114 строк. О плохой строке или конверте клиенты промолчали 26 раз из 34"
description: "Я написал MCP-сервер для stdio без SDK и 51 способом испортил его разговор с официальными клиентами на TypeScript и Python. На неправильное поле в результате обычно приходит внятная ошибка. О неправильной строке или конверте клиенты промолчали в 26 случаях из 34."
date: 2025-02-02
lang: ru
translationKey: mcp-server-no-sdk
tags: ["agents", "reliability", "debugging"]
---

Когда мой сервер впервые ответил официальному клиенту MCP, я поставил между ними `tee`, чтобы посмотреть, что клиент на самом деле шлёт. С его стороны вся сессия уместилась в 6 строк JSON. Первая кончалась на `"id":0`. Нуля я там не ждал. Сервер, который отличает уведомление проверкой `if (!id)`, на `initialize` не ответит никогда.

Если у протокола есть SDK, я беру SDK, а спецификацию открываю, только когда что-нибудь зависнет. Эталонные серверы сделаны так же: в репозитории MCP их 19 и все зависят от официального SDK. В этот раз я написал сервер без него, чтобы понять, чего клиент требует и что он делает, когда сервер неправ. Сама затея не новая, скажем, `mcp-go` это реализация на Go, сделанная помимо официальных SDK. Мне хотелось узнать, что клиенты прощают.

## Что я взял

Ревизия протокола 2024-11-05, транспорт stdio, Node 22.13. Сервер даёт 3 инструмента над папкой с заметками в markdown, только на чтение: список, поиск и чтение заметки. Зависимостей нет, `wc -l` показывает 114 строк.

Те же инструменты на TypeScript SDK 1.4.1 заняли у меня 50 строк, к ним 17 пакетов, 440 файлов и 5,1 МБ в `node_modules`. Выходит, протокол обошёлся в 64 строки. От запуска процесса до ответа на `initialize` у меня проходит 39 мс, у сервера на SDK 81 мс. Это медиана 30 запусков на виртуальной машине с 2 ядрами. Пустой процесс Node отвечает за 33. Сервер из 12 строк с зашитыми ответами мой сценарий тоже прошёл.

Клиенты официальные, TypeScript SDK 1.4.1 и Python SDK 1.2.1, оба январские. Между клиентом и сервером я поставил маленький прокси, который за прогон портит что-нибудь одно. В сценарии 5 шагов, от `initialize` до второго `tools/call`.

Отклонений 51. Из них 38 запрещает текст спецификации или её `schema.json`, 6 вполне законны, про 7 ничего определённого не сказано, например про завершившийся процесс. Разложил я их сам и несколько переложил после первого прогона. Потом проверил всё, что пишет прокси, по схеме и по совпадению id. Проверка поймала 36 из 38 и ни одного из 6.

Молчанием я называю случай, когда за 5 секунд нет ни ответа, ни ошибки. Самый медленный удачный шаг занял 1,7 с. Весь список я прогнал дважды, на 2 выпусках Node 22, исходы совпали.

До прогона я записал 4 догадки. TypeScript с его схемами zod строже, чем Python. Строка текста в stdout ломает обоих. Если вернуть id строкой, сломаются оба. Если не объявить tools в `capabilities`, тоже оба.

## Поля проверяют, конверт выбрасывают

| что испорчено | клиент | работает | ошибка | молчание |
|---|---|---|---|---|
| строки и конверт, 17 | TypeScript | 7 | 0 | 10 |
| | Python | 1 | 0 | 16 |
| поля результата, 18 | TypeScript | 1 | 17 | 0 |
| | Python | 6 | 12 | 0 |
| целая строка не пришла, 3 | TypeScript | 0 | 0 | 3 |
| | Python | 0 | 0 | 3 |

<figure class="fig">
<svg viewBox="0 0 700 448" role="img" aria-label="Таблица из 38 запрещённых отклонений сервера и 2 клиентов, числа в порядке работает / ошибка / молчание. Строки и конверт, 17 строк: TypeScript 7 / 0 / 10, Python 1 / 0 / 16. Поля результата, 18 строк: TypeScript 1 / 17 / 0, Python 6 / 12 / 0. Целая строка не пришла, 3 строки: TypeScript 0 / 0 / 3, Python 0 / 0 / 3.">
  <text x="10" y="18" text-anchor="start" class="f-label f-ink">строки и конверт</text>
  <text x="277" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="313" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="10" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">строка текста на старте</text>
  <rect x="264" y="46" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="46" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">строка текста на каждый вызов</text>
  <rect x="264" y="64" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="64" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">строка JSON-лога на старте</text>
  <rect x="264" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="82" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">пустая строка после ответа</text>
  <rect x="264" y="100" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="100" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">JSON на несколько строк</text>
  <rect x="264" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">заголовок Content-Length</text>
  <rect x="264" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">BOM в начале</text>
  <rect x="264" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ответ в массиве</text>
  <rect x="264" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id строкой</text>
  <rect x="264" y="190" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="190" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="218" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ответ без id</text>
  <rect x="264" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="236" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id: null</text>
  <rect x="264" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="254" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет поля jsonrpc</text>
  <rect x="264" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">error: null рядом с result</text>
  <rect x="264" y="262" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="262" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ошибка в ответ на уведомление</text>
  <rect x="264" y="280" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="280" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">result в ответ на уведомление</text>
  <rect x="264" y="298" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="298" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools/list: result массивом</text>
  <rect x="264" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ping: result null</text>
  <rect x="264" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="365" y="18" text-anchor="start" class="f-label f-ink">поля результата</text>
  <text x="632" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="668" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="365" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет protocolVersion</text>
  <rect x="619" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет capabilities</text>
  <rect x="619" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">capabilities: {}</text>
  <rect x="619" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="655" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools: true</text>
  <rect x="619" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет serverInfo</text>
  <rect x="619" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет serverInfo.version</text>
  <rect x="619" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">instructions: null</text>
  <rect x="619" y="154" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="154" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">nextCursor: null</text>
  <rect x="619" y="172" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="172" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет inputSchema</text>
  <rect x="619" y="190" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="190" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="218" text-anchor="start" class="f-mono f-ink" style="font-size:11px">inputSchema: {}</text>
  <rect x="619" y="208" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="208" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="236" text-anchor="start" class="f-mono f-ink" style="font-size:11px">input_schema</text>
  <rect x="619" y="226" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="226" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="254" text-anchor="start" class="f-mono f-ink" style="font-size:11px">description: null</text>
  <rect x="619" y="244" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="244" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">content строкой</text>
  <rect x="619" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет content</text>
  <rect x="619" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">content без type</text>
  <rect x="619" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">type: json</text>
  <rect x="619" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">text числом</text>
  <rect x="619" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="362" text-anchor="start" class="f-mono f-ink" style="font-size:11px">isError строкой</text>
  <rect x="619" y="352" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="352" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="377" text-anchor="start" class="f-label f-ink">целая строка не пришла</text>
  <text x="10" y="396" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет перевода строки</text>
  <rect x="264" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="414" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет ответа на id 0</text>
  <rect x="264" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="432" text-anchor="start" class="f-mono f-ink" style="font-size:11px">нет ответа на ping</text>
  <rect x="264" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="365" y="426" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="399" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">работает</text>
  <rect x="475" y="426" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="509" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">ошибка</text>
  <rect x="585" y="426" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="619" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">молчание</text>
</svg>
<figcaption>38 вещей, которые спецификация запрещает, по одной на прогон. TS это клиент TypeScript SDK 1.4.1, Py это клиент Python SDK 1.2.1. Молчание значит, что за 5 секунд нет ни ответа, ни ошибки.</figcaption>
</figure>

Оба клиента читают в 2 приёма. Сначала строка должна стать сообщением JSON-RPC, его я и называю конвертом. Потом результат сверяется со схемой своего метода. Если не сошлось на втором шаге, клиент скажет, какое поле неправильное. Python пишет `serverInfo.version Field required`, TypeScript печатает путь из zod.

Если не сошлось на первом, запрос об этом не узнаёт и ждёт дальше. Для строк и конверта так вышло в 26 случаях из 34, ни одной ошибки я там не увидел. Сначала у меня получалось 30 из 38, но туда попал, например, сервер, который не отвечает на `ping`. До клиента тогда ничего не доходит и жаловаться ему не на что. 3 таких отклонения я вынес вниз таблицы.

Ждут клиенты по-разному. TypeScript сдался через 60 секунд с `MCP error -32001: Request timed out`. У Python таймаута по умолчанию нет, хотя в спецификации сказано, что реализации SHOULD ставить его на все запросы. В одном прогоне я подождал 5 минут и остановил его сам.

Во всех 10 молчаливых случаях, когда строка дошла, клиент на TypeScript причину знал и отдавал ошибку в колбэк `onerror`. Только задать этот колбэк надо самому.

## Из 4 догадок не подтвердились 3 с половиной

Необъявленные tools клиентам не мешают. `capabilities: {}` оказалась единственной из 38 запрещённых вещей, с которой работают оба. Мой сервер из 12 строк отвечает именно так, то есть сценарий он прошёл, хотя протокол нарушает.

id строкой в TypeScript проходит, потому что клиент пропускает его через `Number()`. Python на этом зависает. Строка текста в stdout TypeScript тоже не остановила, он сообщает о ней в `onerror` и читает дальше. Python завис на `initialize` от одной строки `notes server started`.

К полям TypeScript и правда строже, поэтому половину догадки я себе засчитал. Он не принимает `null` там, где поля быть не должно: в `nextCursor`, `description`, `instructions` и `error`. Python принимает все 4.

Почему зависает Python, я сам бы не догадался. В 1.2.1 строка, которую не удалось разобрать, передаётся в `session.incoming_messages`, а это поток без буфера. Если его никто не читает, цикл приёма стоит на этой передаче и до правильного ответа очередь не доходит. В тот же поток идут уведомления и запросы сервера, на которые сессия сама не ответила. В примере клиента из README пакета этот поток не упоминается.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="Как зависает клиент Python SDK 1.2.1. Сервер печатает строку notes server started и следом правильный ответ на id 0. Цикл приёма пытается передать первую строку в incoming_messages, у которого нет ни буфера, ни читателя, и ждёт. Ответ так и не прочитан, а initialize ждёт id 0.">
  <text x="10" y="22" text-anchor="start" class="f-label f-muted">stdout сервера</text>
  <text x="270" y="22" text-anchor="start" class="f-label f-muted">цикл приёма</text>
  <text x="500" y="22" text-anchor="start" class="f-label f-muted">incoming_messages</text>
  <rect x="10" y="34" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="55" text-anchor="start" class="f-mono f-accent" style="font-size:12px">notes server started</text>
  <rect x="10" y="104" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:12px">{ id: 0, result: ... }</text>
  <rect x="270" y="34" width="150" height="34" rx="4" class="f-box"/>
  <text x="345" y="55" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">send() ждёт</text>
  <rect x="500" y="34" width="170" height="52" rx="4" class="f-box"/>
  <text x="585" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">буфера нет</text>
  <text x="585" y="74" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">никто не читает</text>
  <rect x="270" y="104" width="150" height="52" rx="4" class="f-box"/>
  <text x="345" y="125" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">initialize()</text>
  <text x="345" y="144" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ждёт id 0</text>
  <line x1="200" y1="51" x2="268" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="261,47 268,51 261,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="420" y1="51" x2="498" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="491,47 498,51 491,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="200" y1="121" x2="268" y2="121" style="fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 4"/>
  <polyline points="261,117 268,121 261,125" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="105" y="156" text-anchor="middle" class="f-label f-muted">не прочитан</text>
</svg>
<figcaption>Клиент Python SDK 1.2.1. Цикл застрял на передаче плохой строки, правильный ответ остался в очереди за ней.</figcaption>
</figure>

Я дал скрипту читать этот поток в фоне и 9 зависаний исчезли. 6 из них были на запрещённом. Ещё 3 на вполне законных сообщениях: уведомление с логом до ответа на `initialize`, такое же перед каждым вызовом и `ping` со стороны сервера. То есть этот клиент может зависнуть и с правильным сервером.

Если процесс сервера умер, TypeScript сразу говорит `Connection closed`. Python 2 минуты ждал ответа от процесса, которого уже нет, дальше я не стал смотреть.

## Моя ошибка

В первой версии сервера было 113 строк. На строку, которая не JSON, она отвечала ошибкой -32700 с `"id": null`, как велит JSON-RPC 2.0. MCP говорит, что все сообщения MUST следовать JSON-RPC. Но в его же схеме id у ошибки это строка или целое число, так что мой вежливый ответ в MCP недопустим. Ошибка с таким же `id: null` была и среди моих 38 отклонений, в ответ на уведомление. Python на ней виснет. Официальные клиенты битого JSON не шлют, поэтому на практике я бы на это вряд ли наткнулся.

Серверам на SDK я тоже скормил 19 кривых строк. 4 из них вообще не сообщения и на них оба молчат. Процесс сервера на Python SDK завершился на других 4: неизвестное уведомление, `id: null`, `id: 1.5` и `tools/call` без params. Сервер на TypeScript пережил все 19. Моя первая версия ещё и отвечала на запросы с `id: null` и без `jsonrpc`. Теперь такие строки уходят в stderr, это стоило одной лишней строки кода.

## Чего я не проверял

Claude Desktop, хотя в итоге такой сервер нужен мне именно там. Inspector 0.3.0 построен на TypeScript SDK, но я его не запускал. SSE и ресурсы я тоже не трогал, а все прогоны были на Linux. Список отклонений составил я сам, поэтому 26 из 34 зависит и от того, что я в него положил. Долгие ожидания я проверил по разу, каждое на одном отклонении. Клиенты январские, в следующем выпуске всё может поменяться.

Для 3 инструментов на чтение я бы оставил эти 114 строк, но с проверкой по `schema.json` в тестах, потому что на подсказку клиента рассчитывать нельзя. Для подписок или SSE взял бы SDK.
