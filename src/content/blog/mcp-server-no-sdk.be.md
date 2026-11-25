---
title: "Мой MCP-сервер без SDK заняў 114 радкоў. Пра кепскі радок або канверт кліенты прамаўчалі 26 разоў з 34"
description: "Я напісаў MCP-сервер для stdio без SDK і 51 спосабам сапсаваў яго размову з афіцыйнымі кліентамі на TypeScript і Python. На няправільнае поле ў выніку звычайна прыходзіць зразумелая памылка. Пра няправільны радок або канверт кліенты прамаўчалі ў 26 выпадках з 34."
date: 2025-02-02
lang: be
translationKey: mcp-server-no-sdk
tags: ["agents", "reliability", "debugging"]
---

Калі мой сервер упершыню адказаў афіцыйнаму кліенту MCP, я паставіў паміж імі `tee`, каб паглядзець, што кліент насамрэч шле. З яго боку ўся сесія змясцілася ў 6 радкоў JSON. Першы канчаўся на `"id":0`. Нуля я там не чакаў. Сервер, які пазнае апавяшчэнне праверкай `if (!id)`, на `initialize` не адкажа ніколі.

Калі ў пратакола ёсць SDK, я бяру SDK, а спецыфікацыю адкрываю толькі тады, калі нешта завісне. Узорныя серверы зроблены гэтаксама: у рэпазіторыі MCP іх 19 і ўсе залежаць ад афіцыйнага SDK. На гэты раз я напісаў сервер без яго, каб зразумець, чаго кліент патрабуе і што ён робіць, калі сервер памыляецца. Сама задума не новая, напрыклад, `mcp-go` гэта рэалізацыя на Go, зробленая па-за афіцыйнымі SDK. Мне хацелася ведаць, што кліенты даруюць.

## Што я ўзяў

Рэвізія пратакола 2024-11-05, транспарт stdio, Node 22.13. Сервер дае 3 інструменты для папкі з нататкамі ў markdown, толькі на чытанне: спіс, пошук і чытанне нататкі. Залежнасцяў няма, `wc -l` паказвае 114 радкоў.

Тыя ж інструменты на TypeScript SDK 1.4.1 занялі ў мяне 50 радкоў, да іх 17 пакетаў, 440 файлаў і 5,1 МБ у `node_modules`. Атрымліваецца, пратакол каштаваў 64 радкі. Ад запуску працэсу да адказу на `initialize` у мяне праходзіць 39 мс, у сервера на SDK 81 мс. Гэта медыяна 30 запускаў на віртуальнай машыне з 2 ядрамі. Пусты працэс Node адказвае за 33. Сервер з 12 радкоў з зашытымі адказамі мой сцэнарый таксама прайшоў.

Кліенты афіцыйныя, TypeScript SDK 1.4.1 і Python SDK 1.2.1, абодва студзеньскія. Паміж кліентам і серверам я паставіў маленькі проксі, які за адзін прагон псуе нешта адно. У сцэнарыі 5 крокаў, ад `initialize` да другога `tools/call`.

Адхіленняў 51. З іх 38 забараняе тэкст спецыфікацыі або яе `schema.json`, 6 цалкам законныя, пра 7 нічога пэўнага не сказана, напрыклад пра працэс, які завяршыўся. Расклаў я іх сам і некалькі пераклаў пасля першага прагону. Потым праверыў усё, што піша проксі, па схеме і па супадзенні id. Праверка злавіла 36 з 38 і ніводнага з 6.

Маўчаннем я называю выпадак, калі за 5 секунд няма ні адказу, ні памылкі. Самы павольны ўдалы крок заняў 1,7 с. Увесь спіс я прагнаў двойчы, на 2 выпусках Node 22, вынікі супалі.

Да прагону я запісаў 4 здагадкі. TypeScript з яго схемамі zod стражэйшы за Python. Радок тэксту ў stdout ламае абодвух. Калі вярнуць id радком, зламаюцца абодва. Калі не абвясціць tools у `capabilities`, таксама абодва.

## Палі правяраюць, канверт выкідваюць

| што сапсавана | кліент | працуе | памылка | маўчанне |
|---|---|---|---|---|
| радкі і канверт, 17 | TypeScript | 7 | 0 | 10 |
| | Python | 1 | 0 | 16 |
| палі выніку, 18 | TypeScript | 1 | 17 | 0 |
| | Python | 6 | 12 | 0 |
| цэлы радок не прыйшоў, 3 | TypeScript | 0 | 0 | 3 |
| | Python | 0 | 0 | 3 |

<figure class="fig">
<svg viewBox="0 0 700 448" role="img" aria-label="Табліца з 38 забароненых адхіленняў сервера і 2 кліентаў, лікі ў парадку працуе / памылка / маўчанне. Радкі і канверт, 17 радкоў: TypeScript 7 / 0 / 10, Python 1 / 0 / 16. Палі выніку, 18 радкоў: TypeScript 1 / 17 / 0, Python 6 / 12 / 0. Цэлы радок не прыйшоў, 3 радкі: TypeScript 0 / 0 / 3, Python 0 / 0 / 3.">
  <text x="10" y="18" text-anchor="start" class="f-label f-ink">радкі і канверт</text>
  <text x="277" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="313" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="10" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">радок тэксту на старце</text>
  <rect x="264" y="46" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="46" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">радок тэксту на кожны выклік</text>
  <rect x="264" y="64" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="64" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">радок JSON-лога на старце</text>
  <rect x="264" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="82" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">пусты радок пасля адказу</text>
  <rect x="264" y="100" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="100" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">JSON на некалькі радкоў</text>
  <rect x="264" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="118" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">загаловак Content-Length</text>
  <rect x="264" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="136" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">BOM у пачатку</text>
  <rect x="264" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="154" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">адказ у масіве</text>
  <rect x="264" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="172" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id радком</text>
  <rect x="264" y="190" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="190" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="218" text-anchor="start" class="f-mono f-ink" style="font-size:11px">адказ без id</text>
  <rect x="264" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="208" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="236" text-anchor="start" class="f-mono f-ink" style="font-size:11px">id: null</text>
  <rect x="264" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="226" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="254" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма поля jsonrpc</text>
  <rect x="264" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="244" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">error: null побач з result</text>
  <rect x="264" y="262" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="262" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">памылка ў адказ на апавяшчэнне</text>
  <rect x="264" y="280" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="280" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">result у адказ на апавяшчэнне</text>
  <rect x="264" y="298" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="300" y="298" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools/list: result масівам</text>
  <rect x="264" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="316" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">ping: result null</text>
  <rect x="264" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="334" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="365" y="18" text-anchor="start" class="f-label f-ink">палі выніку</text>
  <text x="632" y="34" text-anchor="middle" class="f-label f-muted">TS</text>
  <text x="668" y="34" text-anchor="middle" class="f-label f-muted">Py</text>
  <text x="365" y="56" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма protocolVersion</text>
  <rect x="619" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="46" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="74" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма capabilities</text>
  <rect x="619" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="64" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="92" text-anchor="start" class="f-mono f-ink" style="font-size:11px">capabilities: {}</text>
  <rect x="619" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <rect x="655" y="82" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">tools: true</text>
  <rect x="619" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="100" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="128" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма serverInfo</text>
  <rect x="619" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="118" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="146" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма serverInfo.version</text>
  <rect x="619" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="136" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:11px">instructions: null</text>
  <rect x="619" y="154" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="154" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="182" text-anchor="start" class="f-mono f-ink" style="font-size:11px">nextCursor: null</text>
  <rect x="619" y="172" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="172" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="365" y="200" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма inputSchema</text>
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
  <text x="365" y="272" text-anchor="start" class="f-mono f-ink" style="font-size:11px">content радком</text>
  <rect x="619" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="262" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="290" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма content</text>
  <rect x="619" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="280" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="308" text-anchor="start" class="f-mono f-ink" style="font-size:11px">content без type</text>
  <rect x="619" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="298" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="326" text-anchor="start" class="f-mono f-ink" style="font-size:11px">type: json</text>
  <rect x="619" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="316" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="344" text-anchor="start" class="f-mono f-ink" style="font-size:11px">text лікам</text>
  <rect x="619" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="334" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="365" y="362" text-anchor="start" class="f-mono f-ink" style="font-size:11px">isError радком</text>
  <rect x="619" y="352" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <rect x="655" y="352" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="10" y="377" text-anchor="start" class="f-label f-ink">цэлы радок не прыйшоў</text>
  <text x="10" y="396" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма пераводу радка</text>
  <rect x="264" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="386" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="414" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма адказу на id 0</text>
  <rect x="264" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="404" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="10" y="432" text-anchor="start" class="f-mono f-ink" style="font-size:11px">няма адказу на ping</text>
  <rect x="264" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="300" y="422" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <rect x="365" y="426" width="26" height="12" rx="2" style="fill:none;stroke:var(--muted);stroke-width:1"/>
  <text x="399" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">працуе</text>
  <rect x="475" y="426" width="26" height="12" rx="2" style="fill:var(--muted);opacity:0.55;stroke:none"/>
  <text x="509" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">памылка</text>
  <rect x="585" y="426" width="26" height="12" rx="2" style="fill:var(--accent);stroke:none"/>
  <text x="619" y="436" text-anchor="start" class="f-mono f-muted" style="font-size:11px">маўчанне</text>
</svg>
<figcaption>38 рэчаў, якія спецыфікацыя забараняе, па адной на прагон. TS гэта кліент TypeScript SDK 1.4.1, Py гэта кліент Python SDK 1.2.1. Маўчанне значыць, што за 5 секунд няма ні адказу, ні памылкі.</figcaption>
</figure>

Абодва кліенты чытаюць у 2 прыёмы. Спачатку радок мусіць стаць паведамленнем JSON-RPC, яго я і называю канвертам. Потым вынік звяраецца са схемай свайго метаду. Калі не сышлося на другім кроку, кліент скажа, якое поле няправільнае. Python піша `serverInfo.version Field required`, TypeScript друкуе шлях з zod.

Калі не сышлося на першым, запыт пра гэта не даведваецца і чакае далей. Для радкоў і канверта так выйшла ў 26 выпадках з 34, ніводнай памылкі я там не ўбачыў. Спачатку ў мяне атрымлівалася 30 з 38, але туды трапіў, напрыклад, сервер, які не адказвае на `ping`. Да кліента тады нічога не даходзіць і скардзіцца яму няма на што. 3 такія адхіленні я вынес у ніз табліцы.

Чакаюць кліенты па-рознаму. TypeScript здаўся праз 60 секунд з `MCP error -32001: Request timed out`. У Python таймаўту па змаўчанні няма, хоць у спецыфікацыі сказана, што рэалізацыі SHOULD ставіць яго на ўсе запыты. У адным прагоне я пачакаў 5 хвілін і спыніў яго сам.

Ва ўсіх 10 маўклівых выпадках, калі радок дайшоў, кліент на TypeScript прычыну ведаў і аддаваў памылку ў колбэк `onerror`. Толькі задаць гэты колбэк трэба самому.

## З 4 здагадак не пацвердзіліся 3 з паловай

Неабвешчаныя tools кліентам не замінаюць. `capabilities: {}` аказалася адзінай з 38 забароненых рэчаў, з якой працуюць абодва. Мой сервер з 12 радкоў адказвае менавіта так, то-бок сцэнарый ён прайшоў, хоць пратакол парушае.

id радком у TypeScript праходзіць, бо кліент прапускае яго праз `Number()`. Python на гэтым завісае. Радок тэксту ў stdout TypeScript таксама не спыніў, ён паведамляе пра яго ў `onerror` і чытае далей. Python завіс на `initialize` ад аднаго радка `notes server started`.

Да палёў TypeScript і праўда стражэйшы, таму палову здагадкі я сабе залічыў. Ён не прымае `null` там, дзе поля быць не павінна: у `nextCursor`, `description`, `instructions` і `error`. Python прымае ўсе 4.

Чаму завісае Python, я сам бы не здагадаўся. У 1.2.1 радок, які не ўдалося разабраць, перадаецца ў `session.incoming_messages`, а гэта паток без буфера. Калі яго ніхто не чытае, цыкл прыёму стаіць на гэтай перадачы і да правільнага адказу чарга не даходзіць. У той самы паток ідуць апавяшчэнні і запыты сервера, на якія сесія сама не адказала. У прыкладзе кліента з README пакета гэты паток не згадваецца.

<figure class="fig">
<svg viewBox="0 0 680 172" role="img" aria-label="Як завісае кліент Python SDK 1.2.1. Сервер друкуе радок notes server started і следам правільны адказ на id 0. Цыкл прыёму спрабуе перадаць першы радок у incoming_messages, у якога няма ні буфера, ні чытача, і чакае. Адказ так і не прачытаны, а initialize чакае id 0.">
  <text x="10" y="22" text-anchor="start" class="f-label f-muted">stdout сервера</text>
  <text x="270" y="22" text-anchor="start" class="f-label f-muted">цыкл прыёму</text>
  <text x="500" y="22" text-anchor="start" class="f-label f-muted">incoming_messages</text>
  <rect x="10" y="34" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="55" text-anchor="start" class="f-mono f-accent" style="font-size:12px">notes server started</text>
  <rect x="10" y="104" width="190" height="34" rx="4" class="f-box"/>
  <text x="20" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:12px">{ id: 0, result: ... }</text>
  <rect x="270" y="34" width="150" height="34" rx="4" class="f-box"/>
  <text x="345" y="55" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">send() чакае</text>
  <rect x="500" y="34" width="170" height="52" rx="4" class="f-box"/>
  <text x="585" y="55" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">буфера няма</text>
  <text x="585" y="74" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ніхто не чытае</text>
  <rect x="270" y="104" width="150" height="52" rx="4" class="f-box"/>
  <text x="345" y="125" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">initialize()</text>
  <text x="345" y="144" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">чакае id 0</text>
  <line x1="200" y1="51" x2="268" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="261,47 268,51 261,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="420" y1="51" x2="498" y2="51" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <polyline points="491,47 498,51 491,55" style="fill:none;stroke:var(--accent);stroke-width:1.5"/>
  <line x1="200" y1="121" x2="268" y2="121" style="fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 4"/>
  <polyline points="261,117 268,121 261,125" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>
  <text x="105" y="156" text-anchor="middle" class="f-label f-muted">не прачытаны</text>
</svg>
<figcaption>Кліент Python SDK 1.2.1. Цыкл затрымаўся на перадачы кепскага радка, правільны адказ застаўся за ім.</figcaption>
</figure>

Я даў скрыпту чытаць гэты паток у фоне і 9 завісанняў зніклі. 6 з іх былі на забароненым. Яшчэ 3 на цалкам законных паведамленнях: апавяшчэнне з логам да адказу на `initialize`, такое ж перад кожным выклікам і `ping` з боку сервера. То-бок гэты кліент можа завіснуць і з правільным серверам.

Калі працэс сервера памёр, TypeScript адразу кажа `Connection closed`. Python 2 хвіліны чакаў адказу ад працэсу, якога ўжо няма, далей я глядзець не стаў.

## Мая памылка

У першай версіі сервера было 113 радкоў. На радок, які не JSON, яна адказвала памылкай -32700 з `"id": null`, як патрабуе JSON-RPC 2.0. MCP кажа, што ўсе паведамленні MUST адпавядаць JSON-RPC. Але ў яго ж схеме id у памылкі гэта радок або цэлы лік, так што мой ветлівы адказ у MCP недапушчальны. Памылка з такім жа `id: null` была і сярод маіх 38 адхіленняў, у адказ на апавяшчэнне. Python на ёй завісае. Афіцыйныя кліенты няправільнага JSON не шлюць, таму на практыцы я б на гэта наўрад ці натрапіў.

Серверам на SDK я таксама скарміў 19 крывых радкоў. 4 з іх увогуле не паведамленні і на іх абодва маўчаць. Працэс сервера на Python SDK завяршыўся на іншых 4: невядомае апавяшчэнне, `id: null`, `id: 1.5` і `tools/call` без params. Сервер на TypeScript перажыў усе 19. Мая першая версія яшчэ і адказвала на запыты з `id: null` і без `jsonrpc`. Цяпер такія радкі ідуць у stderr, гэта каштавала аднаго лішняга радка кода.

## Чаго я не правяраў

Claude Desktop, хоць у выніку такі сервер патрэбны мне менавіта там. Inspector 0.3.0 пабудаваны на TypeScript SDK, але я яго не запускаў. SSE і рэсурсы я таксама не чапаў, а ўсе прагоны былі на Linux. Спіс адхіленняў склаў я сам, таму 26 з 34 залежыць і ад таго, што я ў яго паклаў. Доўгія чаканні я праверыў па адным разе, кожнае на адным адхіленні. Кліенты студзеньскія, у наступным выпуску ўсё можа памяняцца.

Для 3 інструментаў на чытанне я б пакінуў гэтыя 114 радкоў, але з праверкай па `schema.json` у тэстах, бо на падказку кліента разлічваць нельга. Для падпісак або SSE ўзяў бы SDK.
