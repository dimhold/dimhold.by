---
title: "Мой інжэктар збояў паўтарае прагон па адным seed. Профіль аказаўся часткай seed"
description: "Мой інжэктар збояў для MCP паўтарыў 3000 выклікаў байт у байт на 4 версіях Node, а прагон агента 5 разоў. Правіла, устаўленае наверх профілю, змяніла 48,52% вынікаў, новы seed 53,17%."
date: 2026-10-12
lang: be
translationKey: faultmcp-seed
tags: ["agents", "reliability"]
---
У жніўні я апублікаваў [`fault-mcp`](https://github.com/dimhold/fault-mcp), сервер MCP, які наўмысна ламае ўласныя інструменты. У яго 6 тыпаў збояў. `error` і `empty` паведамляюць пра сябе самі, а `latency` аддае правільны адказ са спазненнем. Астатнія 3 вяртаюць нешта няправільнае і маўчаць, `corrupt` у тым ліку. Гэта не першы такі інструмент. [`mcp-chaos`](https://github.com/ajinb/mcp-chaos) старэйшы прыкладна на 2 месяцы, у яго таксама ёсць seed, а яго README прайгравае сваё дэма з seed 42.

Сёння я ўжо праверыў адзін сказ з README `fault-mcp` на сапраўдных кліентах і ён пацвердзіўся толькі для часткі з іх. Таму я ўзяў абзац, у якім быў упэўнены больш за ўсё, той, што называецца Reproducibility:

> The decision for a given call depends only on `(seed, tool name, call number)`. Call 7 rolls the same numbers whether or not calls 1 through 6 ever happened, so a bad run replays from the seed alone with no session to re-drive. Change the seed and you get a different run; keep it and you get the same one, on any machine.

Калі коратка, рашэнне па выкліку залежыць толькі ад seed, імя інструмента і нумара выкліку. Выклік 7 атрымлівае тыя ж лікі, нават калі выклікаў з 1 па 6 не было. Няўдалы прагон паўтараецца па адным seed на любой машыне.

Гэты абзац і код пад ім пісаў я. Тэсты правяраюць дэтэрмінізм у адным працэсе: той жа seed і той жа нумар выкліку даюць тое ж рашэнне, а выклікі да яго ні на што не ўплываюць. CI ганяе іх на Linux, Windows і macOS, але ніводзін тэст не замацоўвае канкрэтнае значэнне, так што кожная машына згодная толькі сама з сабой. Я ні разу не паўтараў цэлы прагон на іншай версіі Node і ні разу не правіў профіль, каб параўнаць вынік. "На любой машыне" было сказана пра хэш-функцыю. Больш нідзе я гэта не запускаў.

## Умовы

`fault-mcp` 0.1.0 з npm, убудаваны профіль `chaos` (усе 6 тыпаў збояў, правілы з імавернасцямі ад 5 да 15%) і seed 1337. Скрыпт робіць фіксаваны спіс выклікаў да 3 прыкладных інструментаў. Ён друкуе журнал без палёў часу `ts` і `durationMs`, а потым яго SHA-256. У рэжыме бібліятэкі мой скрыпт падмяняе `setTimeout`, таму збой `latency` не чакае і скрыпт запісвае затрымку, якая выпала. Кліент па stdio гэта `@modelcontextprotocol/sdk` 1.32.1. Для агентнай часткі я ўзяў Claude Code 2.1.292 з `claude-opus-5`, толькі з гэтым адным серверам MCP, і запускаў яго з пустой тэчкі.

## Што пацвердзілася

3000 выклікаў на Node 18.17.0, 20.18.1, 22.23.1 і 24.11.0 далі адзін хэш. Тыя ж 3000 выклікаў на другім хосце з Node 22.23.1 далі той жа хэш. Абодва хосты x86_64 з адной і той жа мадэллю працэсара, так што "любая машына" ўсё яшчэ шырэйшая за тое, што я запускаў. Потым 150 выклікаў праз апублікаваны CLI па stdio, з сапраўднымі паўзамі. Гэта заняло хвіліну і журнал супаў з журналам бібліятэкі ў 150 радках са 150.

Частка пра нумар выкліку таксама пацвердзілася. Я перанёс усе выклікі `search` у пачатак, а астатнія інструменты паставіў пасля іх у адваротным парадку. Тып збою супаў на 300 з 300 пар (інструмент, нумар выкліку), а вынікі `search` супалі ў 100 выпадках са 100. Калі я ўручную выставіў лічыльнік на 69, выклік 70 інструмента `search` даў той жа `error`, што і ў поўным прагоне. Выклікі з 1 па 69 сапраўды могуць і не адбывацца. Тут дзве схемы seed і разыходзяцца. У `mcp-chaos` клас `FaultPlan` стварае адзін `random.Random(seed)` на ўвесь план і кожны выклік па чарзе цягне з яго лікі. Выклік там залежыць ад выклікаў да яго, любога інструмента.

## Агент 5 разоў зрабіў тыя ж 7 выклікаў

Я ўзяў профіль `flaky` з seed 1337. Промпт прасіў балансы рахункаў з ACC-1001 па ACC-1006 і дазваляў адзін паўтор, калі выклік упадзе. Ва ўсіх 5 прагонах агент змясціў 6 выклікаў у адно паведамленне, атрымаў `ETIMEDOUT` на ACC-1002 і паўтарыў яго. Калі не лічыць часу, журналы супалі. У кожным адказе стаялі тыя ж 6 лікаў, 2 з іх няправільныя. Выклікі 1 і 4 былі сапсаваныя. ACC-1001 вярнуўся як 76 462,65 PLN замест 86 996,23 USD, а ACC-1004 як 82 303,32 PLN замест 58 115,28 PLN. Агент перадаў абодва лікі далей ва ўсіх 5 прагонах. Ягоныя заўвагі тычыліся дат `as_of`, а ў 4 прагонах з 5 яшчэ і мінорных адзінак. Ніводная з іх не ставіла пад сумнеў гэтыя 2 лікі.

Потым я развярнуў парадак рахункаў у промпце і запусціў двойчы.

<figure class="fig">
<svg viewBox="0 0 630 174" role="img" aria-label="Два прагоны агента па 7 выклікаў інструмента, абодва з seed 1337. парадак промпта: выклік 1 ACC-1001 псаванне, выклік 2 ACC-1002 error, выклік 3 ACC-1003 чыста, выклік 4 ACC-1004 псаванне, выклік 5 ACC-1005 чыста, выклік 6 ACC-1006 latency, выклік 7 ACC-1002 чыста; адваротны: выклік 1 ACC-1006 псаванне, выклік 2 ACC-1005 error, выклік 3 ACC-1004 чыста, выклік 4 ACC-1003 псаванне, выклік 5 ACC-1002 чыста, выклік 6 ACC-1001 latency, выклік 7 ACC-1005 чыста. Выклікі 1 і 4 сапсаваныя ў абодвух радах, выклік 2 гэта памылка, выклік 6 спазняецца, выклік 7 гэта паўтор. Рахункі на гэтых выкліках розныя.">
  <text x="167" y="18" text-anchor="middle" class="f-label f-muted">выклік 1</text>
  <text x="237" y="18" text-anchor="middle" class="f-label f-muted">выклік 2</text>
  <text x="307" y="18" text-anchor="middle" class="f-label f-muted">выклік 3</text>
  <text x="377" y="18" text-anchor="middle" class="f-label f-muted">выклік 4</text>
  <text x="447" y="18" text-anchor="middle" class="f-label f-muted">выклік 5</text>
  <text x="517" y="18" text-anchor="middle" class="f-label f-muted">выклік 6</text>
  <text x="587" y="18" text-anchor="middle" class="f-label f-muted">выклік 7</text>
  <text x="122" y="57" text-anchor="end" class="f-mono f-ink" style="font-size:11px">парадак промпта</text>
  <rect x="135" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">псаванне</text>
  <text x="167" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1001</text>
  <rect x="205" y="32" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1002</text>
  <rect x="275" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="307" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1003</text>
  <rect x="345" y="32" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">псаванне</text>
  <text x="377" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1004</text>
  <rect x="415" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="447" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <rect x="485" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="49" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="65" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1006</text>
  <rect x="555" y="32" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="49" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="587" y="65" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <text x="122" y="109" text-anchor="end" class="f-mono f-ink" style="font-size:11px">адваротны</text>
  <rect x="135" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="167" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">псаванне</text>
  <text x="167" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1006</text>
  <rect x="205" y="84" width="64" height="44" rx="3" class="f-plain" style="stroke:var(--accent);stroke-width:2"/>
  <text x="237" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">error</text>
  <text x="237" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1005</text>
  <rect x="275" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="307" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="307" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1004</text>
  <rect x="345" y="84" width="64" height="44" rx="3" class="f-box" style="fill:var(--ink);fill-opacity:0.85"/>
  <text x="377" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">псаванне</text>
  <text x="377" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px;fill:var(--surface)">ACC-1003</text>
  <rect x="415" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="447" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="447" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1002</text>
  <rect x="485" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="517" y="101" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">latency</text>
  <text x="517" y="117" text-anchor="middle" class="f-mono f-ink" style="font-size:10.5px">ACC-1001</text>
  <rect x="555" y="84" width="64" height="44" rx="3" class="f-plain"/>
  <text x="587" y="101" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">чыста</text>
  <text x="587" y="117" text-anchor="middle" class="f-mono f-muted" style="font-size:10.5px">ACC-1005</text>
  <text x="8" y="152" class="f-mono f-muted" style="font-size:10px">цёмная клетка: ціхае псаванне, сіні контур: памылка</text>
  <text x="8" y="166" class="f-mono f-muted" style="font-size:10px">пад збоем: рахунак, запытаны гэтым выклікам</text>
</svg>
<figcaption>Claude Code 2.1.292, профіль flaky, seed 1337. Збой ідзе за нумарам выкліку. На які рахунак ён трапіць, залежыць ад парадку, які выбраў агент.</figcaption>
</figure>

Расклад застаўся на месцы, па нумарах выклікаў. Выклік 1 па-ранейшаму быў сапсаваны, а выклік 2 па-ранейшаму не дачакаўся адказу, але цяпер выклік 1 прыпаў на ACC-1006, а выклік 4 на ACC-1003. Значыць, seed фіксуе нумар выкліку, які зламаецца. Які рахунак апынецца пад гэтым нумарам, вырашае агент. Калі ён зменіць парадак, той жа seed зламае іншыя рахункі. Па той жа нумарацыі лішні паўтор павінен зрабіць тое ж самае, хоць лішняга паўтору ў маіх прагонах не было. У гэтых 7 прагонах Claude Code дастаўляў паралельныя выклікі ў парадку паведамлення. Нічога, што б гэта абяцала, я не бачу.

## Дзе я памыліўся

У маім селектары ёсць каментар:

> Probability 1 still draws, so that adding a certain rule in front of an uncertain one does not silently reshuffle the ones behind it.

Ён кажа, што правіла з імавернасцю 1 усё роўна цягне лік, каб устаўка такога правіла перад правілам з меншай імавернасцю не перамешвала моўчкі тыя, што стаяць за ім. Я разумеў яго як "профіль можна спакойна правіць". Спакойна правіць яго можна толькі адным спосабам. У кожнага выкліку адзін паток выпадковых лікаў і правілы бяруць з яго лікі зверху ўніз. Калі змяніць імавернасць, кожнае правіла захоўвае свой нумар у патоку. Вынік мяняецца толькі ў тых выкліках, дзе кідок трапіў паміж старым і новым значэннем. Калі ўставіць правіла наверх, кожнае правіла ніжэй атрымлівае наступны лік патоку, гэта значыць іншы лік. Выключэнне гэта правіла з `onCalls`. На астатніх выкліках яно прапускаецца без кідка.

Абгрунтаванне ў каментары таксама няправільнае. Правіла з імавернасцю 1 спрацоўвае заўсёды і адразу вяртае вынік, таму правілы за ім у гэтым выкліку наогул не правяраюцца. Яго кідок мяняе толькі змесціва яго ўласнага збою.

<figure class="fig">
<svg viewBox="0 0 634 250" role="img" aria-label="Першыя 6 выпадковых лікаў выкліку 5 інструмента get_account_balance, seed 1337: 0,810; 0,541; 0,161; 0,819; 0,036; 0,888. У профілі chaos як ёсць першыя 4 дастаюцца правілам error, empty, latency і truncate і не спрацоўваюць. Пяты лік, 0,036, запускае правіла schema. Калі першым уставіць правіла error з імавернасцю 2%, кожнае правіла атрымлівае наступны лік і на тым жа 0,036 спрацоўвае truncate. У абодвух выпадках наступныя лікі ідуць на змесціва збою, а не на правілы.">
  <text x="86" y="41" text-anchor="end" class="f-mono f-ink" style="font-size:11px">u</text>
  <text x="100" y="12" class="f-label f-muted">get_account_balance, выклік 5, seed 1337</text>
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
  <text x="100" y="84" class="f-label f-muted">chaos як ёсць</text>
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
  <text x="100" y="162" class="f-label f-muted">першым устаўлены error p 0,02</text>
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
  <text x="100" y="242" class="f-mono f-muted" style="font-size:10px">правіла спрацоўвае, калі яго лік меншы за p, іншыя не бяруць</text>
</svg>
<figcaption>Кожнае правіла бярэ наступны лік з патоку выкліку. Устаўленае правіла зрушвае ўсе правілы ніжэй за сябе на адзін лік.</figcaption>
</figure>

Я вымераў гэта на 30 000 выкліках, па 10 000 на інструмент, пры фіксаваным seed. Устаўленае правіла гэта `error` з p 0,02, так што само па сабе яно спрацоўвае прыкладна на 2% выклікаў. Устаўленае першым, яно змяніла вынік у 48,52% усіх выклікаў. Новы seed як кантроль змяніў 53,17%. Тое ж правіла, дададзенае ў канец, змяніла 1,21%.

<figure class="fig">
<svg viewBox="0 0 620 226" role="img" aria-label="Слупковая дыяграма, доля з 30 000 выклікаў, у якіх змяніўся вынік пасля адной праўкі профілю пры тым жа seed: новы seed (кантроль) 53,17%, новае правіла першым 48,52%, правіла выдаленае 36,77%, 2 правілы месцамі 13,96%, новае правіла апошнім 1,21%, першае p 0,08 → 0,09 1,06%, апошняе p 0,15 → 0,16 0,71%.">
  <text x="180" y="29" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новы seed (кантроль)</text>
  <rect x="190" y="17" width="319.0" height="17" rx="2" class="f-plain" style="stroke-dasharray:3 2"/>
  <text x="515.0" y="29" class="f-mono f-ink" style="font-size:11px">53,17</text>
  <text x="180" y="55" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новае правіла першым</text>
  <rect x="190" y="43" width="291.1" height="17" rx="2" class="f-box"/>
  <text x="487.1" y="55" class="f-mono f-accent" style="font-size:11px">48,52</text>
  <text x="180" y="81" text-anchor="end" class="f-mono f-ink" style="font-size:11px">правіла выдаленае</text>
  <rect x="190" y="69" width="220.6" height="17" rx="2" class="f-box"/>
  <text x="416.6" y="81" class="f-mono f-ink" style="font-size:11px">36,77</text>
  <text x="180" y="107" text-anchor="end" class="f-mono f-ink" style="font-size:11px">2 правілы месцамі</text>
  <rect x="190" y="95" width="83.8" height="17" rx="2" class="f-box"/>
  <text x="279.8" y="107" class="f-mono f-ink" style="font-size:11px">13,96</text>
  <text x="180" y="133" text-anchor="end" class="f-mono f-ink" style="font-size:11px">новае правіла апошнім</text>
  <rect x="190" y="121" width="7.3" height="17" rx="2" class="f-box"/>
  <text x="203.3" y="133" class="f-mono f-ink" style="font-size:11px">1,21</text>
  <text x="180" y="159" text-anchor="end" class="f-mono f-ink" style="font-size:11px">першае p 0,08 → 0,09</text>
  <rect x="190" y="147" width="6.4" height="17" rx="2" class="f-box"/>
  <text x="202.4" y="159" class="f-mono f-ink" style="font-size:11px">1,06</text>
  <text x="180" y="185" text-anchor="end" class="f-mono f-ink" style="font-size:11px">апошняе p 0,15 → 0,16</text>
  <rect x="190" y="173" width="4.3" height="17" rx="2" class="f-box"/>
  <text x="200.3" y="185" class="f-mono f-ink" style="font-size:11px">0,71</text>
  <text x="190" y="218" class="f-mono f-muted" style="font-size:10px">% з 30 000 выклікаў з іншым вынікам</text>
</svg>
<figcaption>faultmcp 0.1.0, профіль chaos, seed 1337, па 10 000 выклікаў на інструмент.</figcaption>
</figure>

Так што паведамлення пра памылку "ламаецца на seed 1337" недастаткова. Да яго трэба прыкладаць профіль, правіла ў правіла. Нават праўка тэксту паведамлення ў першым правіле змяніла 7,86% вынікаў. Устаўка правіла наверх змяніла амаль столькі ж, колькі новы seed. У маім README пра гэта няма ні слова.

Па дарозе выявілася яшчэ адна дробязь. `--seed` і `FAULTMCP_SEED` праходзяць праз `parseInt`, так што `0x10` моўчкі становіцца seed 0, а `1337abc` становіцца 1337. Стартавы радок у stderr паказвае seed, які сапраўды выкарыстаны, але памылкі не ўзнікае.

## Чаго я не правяраў

Я правяраў толькі x86_64 і толькі Linux. Не правяраў інструменты, праксіраваныя праз `--upstream`, дзе сапраўдны сервер можа адказваць па-рознаму ад прагону да прагону і сапсаваны адказ мяняецца разам з ім. Не правяраў іншых агентаў акрамя Claude Code і іншых мадэляў акрамя `claude-opus-5`. 5 аднолькавых прагонаў агента на адным промпце нічога не кажуць пра доўгую сесію, дзе ў мадэлі больш шанцаў выбраць іншы шлях. А яшчэ ў журнале няма поля для затрымкі, якая выпала збою `latency`. Яе паказвае толькі `durationMs` па гадзінніку, у маіх прагонах з дакладнасцю да 3 мс. Правіла ў журнале нясе значэнне па змаўчанні `ms: 2000`, якое падобна да затрымкі, але гэта не затрымка.

Абзацу Reproducibility патрэбны профіль побач з seed і слова пра парадак выклікаў. Я яго пакуль не змяніў.
