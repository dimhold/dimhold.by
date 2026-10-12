---
title: "Мой інжэктар збояў хавае outputSchema ад строгіх кліентаў. Claude Code 2.1.292 яе не правяраў зусім"
description: "README майго інжэктара збояў для MCP кажа, што ён хавае outputSchema, бо строгі кліент адкіне збой схемы раней за агента. Я прагнаў 9 профіляў збояў праз сыры JSON-RPC, TypeScript SDK 1.32.1, Python SDK 2.3.0 і Claude Code 2.1.292. З апублікаванай схемай TypeScript пасля listTools і Python кінулі выключэнне на 4 збоях з 8, у тым ліку empty і truncate. Без listTools кліент TypeScript не правяраў нічога. Claude Code прапусціў да мадэлі кожны збой схемы. Мадэль кожны раз адказвала $40 718,77. Адзін збой не выйшаў нават з майго сервера."
date: 2026-10-12
lang: be
translationKey: outputschema-trap
tags: ["agents", "reliability"]
---
У жніўні я выклаў [`fault-mcp`](https://github.com/dimhold/fault-mcp), сервер MCP, які наўмысна ламае ўласныя інструменты. Адзін з яго 6 збояў называецца `schema`: інструмент адказвае данымі, якія не супадаюць з абвешчанай формай. Напрыклад, лік прыходзіць радком або знікае абавязковае поле. У README ёсць нататка пра гэтае рашэнне:

> A client that validates structured output rejects a `schema` fault at the transport boundary, so the agent never sees it and you end up measuring the client instead of the agent.

Гэта значыць, што кліент, які правярае структураваны адказ, адкіне такі збой на мяжы транспарту, агент яго не ўбачыць і замер атрымаецца пра кліента, а не пра агента. Таму сервер па змаўчанні хавае `outputSchema`, а сцяг `--advertise-output-schema` яе публікуе. У рэпазіторыі ёсць тэст на тое, што схема схаваная або бачная ў спісе. Тэста, які праводзіць збой схемы праз кліента з апублікаванай схемай, няма. Праз агента, якім я карыстаюся кожны дзень, я такі збой таксама не праганяў. Фраза называе пастку і не кажа, якія кліенты ў яе трапляюць, а я лічыў яе слушнай, бо яна гучала правільна.

## Стэнд

`fault-mcp` 0.1.0 з npm, інструмент `get_account_balance`, рахунак `ACC-4471`. Чысты адказ складае 4 071 877 у найменшых адзінках, центах, гэта значыць $40 718,77, у `structuredContent` і адным радком тэксту. Я напісаў 9 профіляў з імавернасцю 1: чысты, `error`, `empty`, `truncate`, 2 стратэгіі псавання і 3 рэжымы схемы. `latency` я не браў, ён аддае правільны адказ, проста позна. Кожны профіль я праганяў са схаванай схемай і з апублікаванай.

На ўзроўні SDK было 3 кліенцкія бібліятэкі ў 4 варыянтах. Сыры JSON-RPC па stdio без аніякага SDK паказвае, што сервер паклаў у канал. `Client` з TypeScript `@modelcontextprotocol/sdk` 1.32.1, адзін раз з простым `callTool` і адзін раз пасля `listTools()`. І `ClientSession` з Python `mcp` 2.3.0. Потым агент: Claude Code 2.1.292 з `claude-opus-5`, без убудаваных інструментаў, толькі з гэтым адным серверам MCP, запушчаны са свежай папкі ў `/tmp`, дзе ляжаў толькі канфіг MCP. Яго струменевы лог запісвае вынік інструмента ў тым выглядзе, у якім Claude Code перадаў яго мадэлі. Сервер і кліенты SDK працавалі на Node 22.23.1.

## Што зрабілі кліенты SDK

Са схаванай схемай усе 5 кліентаў, у тым ліку Claude Code, вярнулі тое, што даслаў сервер. Выключэнне адно, `wrong-container`, пра яго асобны раздзел ніжэй. З апублікаванай схемай карціна разыходзіцца.

<figure class="fig">
<svg viewBox="0 0 638 324" role="img" aria-label="Сетка з 9 профіляў, чысты і 8 збояў, на 6 слупкоў. Першы слупок гэта схаваная схема, вынік аднолькавы для ўсіх 5 кліентаў. Астатнія 5 слупкоў гэта апублікаваная схема: сыры JSON-RPC, TypeScript SDK callTool без спісу, TypeScript SDK пасля listTools, Python SDK, Claude Code. чысты: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: прайшоў, Python: прайшоў, Claude: прайшоў; error: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: прайшоў, Python: прайшоў, Claude: прайшоў; empty: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: кінуў, Python: кінуў, Claude: прайшоў; truncate: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: кінуў, Python: кінуў, Claude: прайшоў; псаванне, праўдападобнае: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: прайшоў, Python: прайшоў, Claude: прайшоў; псаванне, звычайнае: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: прайшоў, Python: прайшоў, Claude: прайшоў; schema, type-swap: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: кінуў, Python: кінуў, Claude: прайшоў; schema, drop-required: усе 5: прайшоў, сыры: прайшоў, TS: прайшоў, TS+list: кінуў, Python: кінуў, Claude: прайшоў; schema, wrong-container: усе 5: сервер, сыры: сервер, TS: сервер, TS+list: сервер, Python: сервер, Claude: сервер.">
  <text x="239.5" y="16" text-anchor="middle" class="f-label f-muted">схема схавана</text>
  <text x="452.5" y="16" text-anchor="middle" class="f-label f-muted">схема апублікавана</text>
  <line x1="279" y1="22" x2="626" y2="22" class="f-line" style="opacity:0.5"/>
  <text x="239.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">усе 5</text>
  <text x="310.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">сыры</text>
  <text x="381.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS</text>
  <text x="452.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">TS+list</text>
  <text x="523.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Python</text>
  <text x="594.5" y="42" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Claude</text>
  <line x1="274" y1="48" x2="274" y2="268" class="f-line" style="stroke-dasharray:3 2"/>
  <text x="194" y="68" text-anchor="end" class="f-mono f-ink" style="font-size:11px">чысты</text>
  <rect x="207" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="491" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="562" y="54" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="68" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="92" text-anchor="end" class="f-mono f-ink" style="font-size:11px">error</text>
  <rect x="207" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="491" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="562" y="78" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="92" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="116" text-anchor="end" class="f-mono f-ink" style="font-size:11px">empty</text>
  <rect x="207" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="491" y="102" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="116" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="562" y="102" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="116" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="140" text-anchor="end" class="f-mono f-ink" style="font-size:11px">truncate</text>
  <rect x="207" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="491" y="126" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="140" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="562" y="126" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="140" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="164" text-anchor="end" class="f-mono f-ink" style="font-size:11px">псаванне, праўдападобнае</text>
  <rect x="207" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="491" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="562" y="150" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="164" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="188" text-anchor="end" class="f-mono f-ink" style="font-size:11px">псаванне, звычайнае</text>
  <rect x="207" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="452.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="491" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="523.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="562" y="174" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="188" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="212" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, type-swap</text>
  <rect x="207" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="491" y="198" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="212" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="562" y="198" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <text x="194" y="236" text-anchor="end" class="f-mono f-ink" style="font-size:11px">schema, drop-required</text>
  <rect x="207" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="239.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="278" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="310.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="349" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="381.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
  <rect x="420" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="452.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="491" y="222" width="65" height="20" rx="3" class="f-box"/>
  <text x="523.5" y="236" text-anchor="middle" class="f-mono f-accent" style="font-size:10.5px">кінуў</text>
  <rect x="562" y="222" width="65" height="20" rx="3" class="f-plain"/>
  <text x="594.5" y="236" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">прайшоў</text>
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
  <text x="194" y="286" class="f-mono f-muted" style="font-size:10px">прайшоў: вынік дайшоў да боку, які кліча</text>
  <text x="194" y="300" class="f-mono f-muted" style="font-size:10px">кінуў: кліент выкінуў выключэнне</text>
  <text x="194" y="314" class="f-mono f-muted" style="font-size:10px">сервер: SDK сервера адмовіўся адпраўляць</text>
</svg>
<figcaption>TS гэта @modelcontextprotocol/sdk 1.32.1, Python гэта mcp 2.3.0, Claude гэта Claude Code 2.1.292. На апублікаваную схему рэагуюць толькі 2 кліенты і толькі калі ў іх ёсць спіс інструментаў.</figcaption>
</figure>

Кліент TypeScript пасля `listTools` і кліент Python кінулі выключэнне на 4 збоях з 8. 2 з іх гэта збоі схемы, пра якія кажа README. Іншыя 2 мяне здзівілі: `empty` і `truncate`. Абодва губляюць `structuredContent`, а інструмент з выходнай схемай абавязаны яго вярнуць. Абодва кліенты кідаюць выключэнне з паведамленнем "has an output schema but did not return structured content". Так `truncate`, які задуманы ціхім збоем, становіцца выключэннем перш чым яго хтосьці прачытае.

Абодва віды псавання прайшлі праз усіх кліентаў у абодвух рэжымах. Праўдападобнае псаванне вяртае радок суседняга рахунку пад запытаным нумарам: $9 381,67 з правільнымі тыпамі і палямі, але іншага рахунку. Валідатар правярае толькі форму, а форма была ў парадку.

Кліент TypeScript без `listTools` нічога не зверыў з выходнай схемай. Я зазірнуў у код SDK. Валідатары будуюцца ў `cacheToolMetadata`, а ён запускаецца толькі тады, калі вяртаецца `listTools()`. `callTool` сам па сабе валідатара не знаходзіць і аддае вынік як ёсць. Python, калі імя інструмента яму незнаёмае, сам запытвае спіс, таму правярае ў любым выпадку. Тэставая абвязка, якая кліча інструмент па імені без спісу, атрымлівае ад строгага SDK нястрогія паводзіны.

## Радок, які ніхто не атрымаў

`wrong-container` кладзе масіў на месца аб'екта. Да кліентаў ён не дайшоў ні разу, ні са схемай, ні без яе. Сыры JSON-RPC атрымаў памылку -32602 "Invalid tools/call result" ад самога сервера.

faultmcp пабудаваны на нізкаўзроўневым `Server` з SDK. У README нават растлумачана чаму: інжэктар збояў павінен умець вяртаць тое, што строгі тып выніку не прапусціць. Але гэты `Server` абгортвае кожны апрацоўшчык `tools/call` і перад адпраўкай разбірае вынік праз `CallToolResultSchema`. Прывядзенне тыпу ў TypeScript супакойвае толькі кампілятар. Праверка падчас выканання ў `Server` усё роўна працуе. Я праверыў 1.30.0, самую старую версію, якую дапускае `package.json` у faultmcp. Там адбываецца тое самае.

Выходзіць, адзін з маіх 3 рэжымаў схемы не працаваў праз транспарт ні на адной праверанай версіі. Яго модульны тэст кліча `applyFault` наўпрост і праходзіць. У мяне было 85 зялёных тэстаў, але ніводзін не адправіў гэты збой праз канал.

## Што зрабіў агент

Найбольш мяне цікавіў Claude Code, бо гэта агент, якім я карыстаюся. Я паставіў паміж Claude Code і серверам маленькі перахопнік у духу `tee`, каб бачыць, што ідзе па канале. У адказе `tools/list` была поўная `outputSchema`, дзе `balance_minor` абвешчаны цэлым лікам і ўсе 4 палі абавязковыя.

<figure class="fig">
<svg viewBox="0 0 640 280" role="img" aria-label="Схема шляху выніку інструмента пры апублікаванай схеме: вынік, праверка ў SDK сервера, stdio, праверка ў кліенце, мадэль. Дзве дарожкі. Для кліента TypeScript пасля listTools і для Python wrong-container спыняецца ў SDK сервера, empty, truncate, type-swap і drop-required спыняюцца на праверцы кліента, чысты адказ, error і абодва віды псавання даходзяць да мадэлі. Для Claude Code 2.1.292 wrong-container спыняецца ў SDK сервера, а ўсе астатнія збоі даходзяць да мадэлі, бо кліент нічога не правярае.">
  <rect x="14" y="16" width="100" height="40" rx="4" class="f-plain"/>
  <text x="64" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">вынік</text>
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
  <text x="430" y="33" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">кліент</text>
  <text x="430" y="48" text-anchor="middle" class="f-mono f-muted" style="font-size:9.5px">outputSchema</text>
  <line x1="502" y1="36" x2="516" y2="36" class="f-line"/>
  <path d="M 516 36 l -6 -4 l 0 8 z" class="f-muted"/>
  <rect x="520" y="16" width="106" height="40" rx="4" class="f-plain"/>
  <text x="573" y="41" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">мадэль</text>
  <line x1="14" y1="78" x2="626" y2="78" class="f-plain"/>
  <text x="14" y="94" class="f-label f-muted">TS пасля listTools, Python</text>
  <text x="192" y="118" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="136" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="118" text-anchor="middle" class="f-glyph f-accent">×</text>
  <text x="500" y="136" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">empty, truncate</text>
  <text x="500" y="150" text-anchor="end" class="f-mono f-accent" style="font-size:10.5px">type-swap, drop-required</text>
  <text x="573" y="118" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="136" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">чысты, error</text>
  <text x="626" y="150" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">2 віды псавання</text>
  <line x1="14" y1="166" x2="626" y2="166" class="f-plain"/>
  <text x="14" y="182" class="f-label f-muted">Claude Code 2.1.292</text>
  <text x="192" y="206" text-anchor="middle" class="f-glyph f-ink">×</text>
  <text x="192" y="224" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">wrong-container</text>
  <text x="430" y="206" text-anchor="middle" class="f-glyph f-muted">→</text>
  <text x="430" y="224" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">праверкі няма</text>
  <text x="573" y="206" text-anchor="middle" class="f-glyph f-ink">✓</text>
  <text x="626" y="238" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">чысты, error, empty,</text>
  <text x="626" y="252" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">truncate, 2 віды псавання,</text>
  <text x="626" y="266" text-anchor="end" class="f-mono f-ink" style="font-size:10.5px">type-swap, drop-required</text>
</svg>
<figcaption>Першая праверка сядзіць у SDK самога faultmcp і спрацоўвае і пры схаванай схеме. Другая ёсць толькі ў частцы кліентаў.</figcaption>
</figure>

Потым збой `type-swap` даслаў `"balance_minor": "4071877"` радком. Claude Code перадаў гэта мадэлі без аніводнай заўвагі. `drop-required` прыбраў `account_id`. Гэта таксама прайшло. Са схаванай схемай было тое самае. Claude Code не праверыў структураваны адказ ні ў адным маім прагоне.

Мадэль адказала $40 718,77 ва ўсіх 6 прагонах з гэтымі 2 збоямі. Ні пра зніклы нумар рахунку, ні пра лік у двукоссі яна не сказала ні разу. Ва ўсіх прагонах, дзе яна назвала суму, яна папярэдзіла, што даце `as_of` ужо некалькі месяцаў, але гэта проста дата ў маім выдуманым рэестры, а не збой. На `empty`, `truncate`, `error` і `wrong-container` яна кожны раз адказвала, што балансу няма. Праўдападобнае псаванне абодва разы прайшло як $9 381,67.

Яшчэ адной розніцы паміж кліентамі я не чакаў. Калі `structuredContent` ёсць, Claude Code аддае мадэлі яго JSON, а не тэкставы блок. Звычайнае псаванне перапісвае тэкст і структураваную частку паасобку, таму ў тэксце стаяў `ACC-4476`, а ў структураванай частцы `ACC-9471`. Мадэль бачыла `ACC-9471` і абодва разы заўважыла чужы рахунак. Абвязка, якая чытае `content[0].text`, атрымала б правільныя $40 718,77 пад `ACC-4476`, а мадэль у Claude Code атрымала `ACC-9471` з $43 035,36.

## Дык што мерае сцяг

README мае рацыю ў тым, што строгі кліент можа з'есці збой раней, чым яго ўбачыць агент. Але пратакол гэтага не патрабуе. Версія спецыфікацыі, якую Claude Code узгадніў з серверам, 2025-11-25, кажа, што кліенты SHOULD правяраць структураваныя вынікі, а не MUST. Афіцыйны TypeScript SDK строгі толькі пасля `listTools`, Python строгі заўсёды, Claude Code зусім не строгі. З маім серверам апублікаваная схема змяніла 4 вынікі з 9 у 2 кліентаў і 0 з 9 у агента.

Схема па змаўчанні застаецца схаванай, бо са схаванай схемай усе правераныя кліенты атрымалі адно і тое ж. Але ў тлумачэнні ў README трэба назваць, якія кліенты правяраюць. Яшчэ там трэба сказаць, што `empty` і `truncate` таксама ператвараюцца ў выключэнні. `wrong-container` трэба паправіць або прыбраць, бо цяпер ён тэстуе SDK сервера. Нічога з гэтага я пакуль не запушыў.

## Чаго я не правяраў

Агента я запускаў па адным разе на кожную клетку табліцы і яшчэ 2 разы з перахопнікам. Так што лічбы пра мадэль гэта лік па жменьцы прагонаў, а не долі. Мадэль была адна, `claude-opus-5`. Cursor, Codex CLI і іншых агентаў я не спрабаваў, а яны могуць правяраць. Абодва SDK былі апошнімі рэлізамі на той дзень. Галіну 2.x кліента TypeScript, `@modelcontextprotocol/client` 2.3.1, я праверыў толькі на 3 збоях. Яна паводзіла сябе як 1.32.1 і была строгай толькі пасля `listTools`. Транспарт быў толькі stdio, HTTP я не чапаў.
