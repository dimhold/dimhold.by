---
title: "Мой инъектор сбоев прячет outputSchema от строгих клиентов. Claude Code 2.1.292 её не проверял вообще"
description: "README моего инъектора сбоев для MCP говорит, что он прячет outputSchema, потому что строгий клиент отбросит сбой схемы раньше агента. Я прогнал 9 профилей сбоев через сырой JSON-RPC, TypeScript SDK 1.32.1, Python SDK 2.3.0 и Claude Code 2.1.292. С опубликованной схемой TypeScript после listTools и Python бросили исключение на 4 сбоях из 8, включая empty и truncate. Без listTools клиент TypeScript не проверял ничего. Claude Code пропустил к модели каждый сбой схемы. Модель каждый раз отвечала $40 718,77. Один сбой не вышел даже из моего сервера."
date: 2026-10-12
lang: ru
translationKey: outputschema-trap
tags: ["agents", "reliability"]
---
В августе я выложил [`fault-mcp`](https://github.com/dimhold/fault-mcp), сервер MCP, который нарочно ломает собственные инструменты. Один из его 6 сбоев называется `schema`: инструмент отвечает данными, которые не совпадают с объявленной формой. Например, число приходит строкой или пропадает обязательное поле. В README про это есть пояснение к решению:

> A client that validates structured output rejects a `schema` fault at the transport boundary, so the agent never sees it and you end up measuring the client instead of the agent.

То есть клиент, который проверяет структурированный ответ, отбросит такой сбой на границе транспорта, агент его не увидит и замер получится про клиента, а не про агента. Поэтому сервер по умолчанию прячет `outputSchema`, а флаг `--advertise-output-schema` её публикует. В репозитории есть тест на то, что схема скрыта или видна в списке. Теста, который проводит сбой схемы через клиента с опубликованной схемой, нет. Через агента, которым я пользуюсь каждый день, я этот сбой тоже не прогонял. Фраза называет ловушку и не говорит, какие клиенты в неё попадают, а я принял её на веру, потому что звучала она убедительно.

## Стенд

`fault-mcp` 0.1.0 из npm, инструмент `get_account_balance`, счёт `ACC-4471`. Чистый ответ 4 071 877 центов, то есть $40 718,77, в `structuredContent` и одной строкой текста. Я написал 9 профилей с вероятностью 1: чистый, `error`, `empty`, `truncate`, 2 стратегии порчи и 3 режима схемы. `latency` я не брал, он отдаёт верный ответ, просто поздно. Каждый профиль шёл со скрытой схемой и с опубликованной.

На уровне SDK было 3 клиентские библиотеки в 4 вариантах. Сырой JSON-RPC по stdio без всякого SDK показывает, что сервер положил в канал. `Client` из пакета TypeScript `@modelcontextprotocol/sdk` 1.32.1, один раз с прямым `callTool` и один раз после `listTools()`. И `ClientSession` из пакета Python `mcp` 2.3.0. Потом агент: Claude Code 2.1.292 с `claude-opus-5`, без встроенных инструментов, только с этим одним сервером MCP, запущенный из свежей папки в `/tmp`, где лежал только конфиг MCP. Его потоковый лог записывает результат инструмента в том виде, в каком Claude Code передал его модели. Сервер и клиенты SDK работали на Node 22.23.1.

## Что сделали клиенты SDK

Со скрытой схемой все 5 клиентов, включая Claude Code, вернули то, что прислал сервер. Исключение одно, `wrong-container`, про него отдельный раздел ниже. С опубликованной схемой клиенты расходятся.

<figure class="fig">
<svg viewBox="0 0 638 324" role="img" aria-label="Сетка из 9 профилей, чистый и 8 сбоев, на 6 столбцов. Первый столбец это скрытая схема, результат одинаков для всех 5 клиентов. Остальные 5 столбцов это опубликованная схема: сырой JSON-RPC, TypeScript SDK callTool без списка, TypeScript SDK после listTools, Python SDK, Claude Code. чистый: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: прошёл, Python: прошёл, Claude: прошёл; error: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: прошёл, Python: прошёл, Claude: прошёл; empty: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: бросил, Python: бросил, Claude: прошёл; truncate: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: бросил, Python: бросил, Claude: прошёл; порча, правдоподобная: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: прошёл, Python: прошёл, Claude: прошёл; порча, обычная: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: прошёл, Python: прошёл, Claude: прошёл; schema, type-swap: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: бросил, Python: бросил, Claude: прошёл; schema, drop-required: все 5: прошёл, сырой: прошёл, TS: прошёл, TS+list: бросил, Python: бросил, Claude: прошёл; schema, wrong-container: все 5: сервер, сырой: сервер, TS: сервер, TS+list: сервер, Python: сервер, Claude: сервер.">
  <text x="239.5" y="16" text-anchor="middle" class="f-label f-muted">схема скрыта</text>
  <text x="452.5" y="16" text-anchor="middle" class="f-label f-muted">схема опубликована</text>
  <line x1="279" y1="22" x2="626" y2="22" class="f-line" style="opacity:0.5"/>
  <text x="239.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">все 5</text>
  <text x="310.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">сырой</text>
  <text x="381.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS</text>
  <text x="452.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS+list</text>
  <text x="523.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Python</text>
  <text x="594.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Claude</text>
  <line x1="274" y1="48" x2="274" y2="268" class="f-line" style="stroke-dasharray:3 2"/>
  <text x="194" y="68" text-anchor="end" class="f-mono f-ink" style="font-size:11px">чистый</text>
  <rect x="207" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="491" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="562" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="92" text-anchor="end" class="f-mono f-ink" style="font-size:11px">error</text>
  <rect x="207" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="491" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="562" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="116" text-anchor="end" class="f-mono f-ink" style="font-size:11px">empty</text>
  <rect x="207" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="491" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="562" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:11px">truncate</text>
  <rect x="207" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="491" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="562" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="164" text-anchor="end" class="f-mono f-ink" style="font-size:11px">порча, правдоподобная</text>
  <rect x="207" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="491" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="562" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="188" text-anchor="end" class="f-mono f-ink" style="font-size:11px">порча, обычная</text>
  <rect x="207" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="491" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="562" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="212" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, type-swap</text>
  <rect x="207" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="491" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="562" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, drop-required</text>
  <rect x="207" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="278" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="349" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <rect x="420" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="491" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">бросил</text>
  <rect x="562" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прошёл</text>
  <text x="194" y="260" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, wrong-container</text>
  <rect x="207" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="239.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <rect x="278" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="310.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <rect x="349" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="381.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <rect x="420" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="452.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <rect x="491" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="523.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <rect x="562" y="246" width="65" height="20" rx="3" class="f-plain" style="fill:var(--muted);fill-opacity:0.18;stroke:var(--muted)"/>
  <text x="594.5" y="260" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">сервер</text>
  <text x="194" y="286" class="f-mono f-muted" style="font-size:10px">прошёл: результат дошёл до вызывающей стороны</text>
  <text x="194" y="300" class="f-mono f-muted" style="font-size:10px">бросил: клиент выбросил исключение</text>
  <text x="194" y="314" class="f-mono f-muted" style="font-size:10px">сервер: SDK сервера отказался отправлять</text>
</svg>
<figcaption>TS это @modelcontextprotocol/sdk 1.32.1, Python это mcp 2.3.0, Claude это Claude Code 2.1.292. На опубликованную схему реагируют только 2 клиента и только когда у них есть список инструментов.</figcaption>
</figure>

Клиент TypeScript после `listTools` и клиент Python бросили исключение на 4 сбоях из 8. 2 из них это сбои схемы, о которых говорит README. Другие 2 меня удивили: `empty` и `truncate`. Оба убирают `structuredContent`, а инструмент с выходной схемой обязан его вернуть. Оба клиента бросают исключение с текстом "has an output schema but did not return structured content". Так `truncate`, который задуман тихим сбоем, становится исключением раньше, чем его кто-то прочитает.

Оба вида порчи прошли через всех клиентов в обоих режимах. Правдоподобная порча возвращает строку соседнего счёта под запрошенным номером: $9 381,67 с правильными типами и полями, но от другого счёта. Валидатор проверяет только форму, а форма была в порядке.

Клиент TypeScript без `listTools` ничего не сверял с выходной схемой. Я заглянул в код SDK. Валидаторы строятся в `cacheToolMetadata`, а он вызывается только после ответа на `listTools()`. `callTool` сам по себе валидатора не находит и отдаёт результат как есть. Python, если имя инструмента ему незнакомо, сам запрашивает список, поэтому проверяет в любом случае. Тестовая обвязка, которая зовёт инструмент по имени без списка, получает от строгого SDK нестрогое поведение.

## Строка, которую никто не получил

`wrong-container` кладёт массив на место объекта. До клиентов он не дошёл ни разу, ни со схемой, ни без. Сырой JSON-RPC получил ошибку -32602 "Invalid tools/call result" от самого сервера.

faultmcp построен на низкоуровневом `Server` из SDK. В README даже объяснено почему: инъектор сбоев должен уметь возвращать то, что строгий тип результата не пропустит. Но этот `Server` оборачивает каждый обработчик `tools/call` и перед отправкой разбирает результат через `CallToolResultSchema`. Приведение типа в TypeScript успокаивает только компилятор. Проверка во время выполнения в `Server` всё равно работает. Я проверил 1.30.0, самую старую версию, которую допускает `package.json` у faultmcp. Там происходит то же самое.

Выходит, один из моих 3 режимов схемы не работал через транспорт ни на одной проверенной версии. Его модульный тест зовёт `applyFault` напрямую и проходит. У меня было 85 зелёных тестов, но ни один не отправил этот сбой через канал.

## Что сделал агент

Больше всего меня интересовал Claude Code, потому что это агент, которым я пользуюсь. Я поставил между Claude Code и сервером маленький перехватчик в духе `tee`, чтобы видеть, что идёт по каналу. В ответе `tools/list` была полная `outputSchema`, где `balance_minor` объявлен целым числом и все 4 поля обязательны.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Схема пути результата инструмента при опубликованной схеме: результат, проверка в SDK сервера, stdio, проверка в клиенте, модель. Две дорожки. Для клиента TypeScript после listTools и для Python wrong-container останавливается в SDK сервера, empty, truncate, type-swap и drop-required останавливаются на проверке клиента, чистый ответ, error и оба вида порчи доходят до модели. Для Claude Code 2.1.292 wrong-container останавливается в SDK сервера, а все остальные сбои доходят до модели, потому что клиент ничего не проверяет.">
  <rect x="14" y="16" width="100" height="40" rx="4" class="f-plain"/>
  <text x="64" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">результат</text>
  <line x1="116" y1="36" x2="128" y2="36" class="f-line"/>
  <path d="M 128 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="132" y="16" width="120" height="40" rx="4" class="f-box"/>
  <text x="192" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">SDK сервера</text>
  <text x="192" y="48" text-anchor="middle" class="f-mono f-muted" style="font-size:9.5px">CallToolResultSchema</text>
  <line x1="254" y1="36" x2="264" y2="36" class="f-line"/>
  <path d="M 264 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="268" y="16" width="72" height="40" rx="4" class="f-plain"/>
  <text x="304" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">stdio</text>
  <line x1="342" y1="36" x2="356" y2="36" class="f-line"/>
  <path d="M 356 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="360" y="16" width="140" height="40" rx="4" class="f-box"/>
  <text x="430" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">клиент</text>
  <text x="430" y="48" text-anchor="middle" class="f-mono f-muted" style="font-size:9.5px">outputSchema</text>
  <line x1="502" y1="36" x2="516" y2="36" class="f-line"/>
  <path d="M 516 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="520" y="16" width="106" height="40" rx="4" class="f-plain"/>
  <text x="573" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">модель</text>
  <line x1="14" y1="78" x2="626" y2="78" class="f-plain"/>
  <text x="14" y="94" class="f-label f-muted">TS после listTools, Python</text>
  <text x="192" y="118" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="136" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="118" text-anchor="middle" class="f-glyph f-accent">×</text>
  <text x="500" y="136" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">empty, truncate</text>
  <text x="500" y="150" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">type-swap, drop-required</text>
  <text x="573" y="118" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="136" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">чистый, error</text>
  <text x="626" y="150" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">2 вида порчи</text>
  <line x1="14" y1="166" x2="626" y2="166" class="f-plain"/>
  <text x="14" y="182" class="f-label f-muted">Claude Code 2.1.292</text>
  <text x="192" y="206" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="224" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="206" text-anchor="middle" class="f-glyph f-muted">→</text>
  <text x="430" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">проверки нет</text>
  <text x="573" y="206" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="238" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">чистый, error, empty,</text>
  <text x="626" y="252" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">truncate, 2 вида порчи,</text>
  <text x="626" y="266" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">type-swap, drop-required</text>
</svg>
<figcaption>Первая проверка сидит в SDK самого faultmcp и срабатывает и при скрытой схеме. Вторая есть только в части клиентов.</figcaption>
</figure>

Потом сбой `type-swap` прислал `"balance_minor": "4071877"` строкой. Claude Code передал это модели без единого замечания. `drop-required` убрал `account_id`. Это тоже прошло. Со скрытой схемой было то же самое. Claude Code не проверил структурированный ответ ни в одном моём прогоне.

Модель ответила $40 718,77 во всех 6 прогонах с этими 2 сбоями. Ни про пропавший номер счёта, ни про число в кавычках она не сказала ни разу. Во всех прогонах, где прозвучала сумма, модель предупредила, что дате `as_of` уже несколько месяцев, но это просто дата в моём выдуманном реестре, а не сбой. На `empty`, `truncate`, `error` и `wrong-container` она каждый раз отвечала, что баланса нет. Правдоподобная порча оба раза прошла как $9 381,67.

Ещё одного различия между клиентами я не ждал. Если `structuredContent` есть, Claude Code отдаёт модели его JSON, а не текстовый блок. Обычная порча переписывает текст и структурированную часть по отдельности, поэтому в тексте стоял `ACC-4476`, а в структурированной части `ACC-9471`. Модель видела `ACC-9471` и оба раза заметила чужой счёт. Обвязка, которая читает `content[0].text`, получила бы верные $40 718,77 под `ACC-4476`, а модель в Claude Code получила `ACC-9471` с $43 035,36.

## Что же измеряет флаг

README прав в том, что строгий клиент может съесть сбой раньше, чем его увидит агент. Но протокол этого не требует. Версия спецификации, которую Claude Code согласовал с сервером, 2025-11-25, говорит, что клиенты SHOULD проверять структурированные результаты, а не MUST. Официальный TypeScript SDK строг только после `listTools`, Python строг всегда, Claude Code не строг вовсе. С моим сервером опубликованная схема поменяла 4 результата из 9 у 2 клиентов и 0 из 9 у агента.

По умолчанию схема остаётся скрытой, потому что со скрытой схемой все проверенные клиенты получили одно и то же. Но в объяснении в README надо назвать, какие клиенты проверяют. Ещё там надо сказать, что `empty` и `truncate` тоже превращаются в исключения. `wrong-container` надо починить или убрать, потому что сейчас он тестирует SDK сервера. Ничего из этого я пока не запушил.

## Чего я не проверял

Агента я запускал по одному разу на ячейку и ещё 2 раза с перехватчиком. Так что числа про модель это подсчёт на горстке прогонов, а не частоты. Модель была одна, `claude-opus-5`. Cursor, Codex CLI и других агентов я не пробовал, а они могут проверять. Оба SDK были последними релизами на тот день. Ветку 2.x клиента TypeScript, `@modelcontextprotocol/client` 2.3.1, я проверил только на 3 сбоях. Она вела себя как 1.32.1 и была строгой только после `listTools`. Транспорт был только stdio, HTTP я не трогал.
