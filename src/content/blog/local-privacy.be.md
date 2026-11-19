---
title: "Мой лакальны GPT-2 зрабіў 13 запытаў да huggingface.co, перш чым адказаць"
description: "Я трымаю GPT-2 у сябе, каб промпты заставаліся на машыне. З transformers 4.12.3 і мадэллю ў кэшы адзін выклік пайплайна ўсё роўна зрабіў 13 запытаў да huggingface.co. Промпта не было ні ў адным, але без сеткі той жа выклік падаў. За файрволам, які адкідае пакеты, падзення давялося чакаць 187,8 секунды."
date: 2021-11-14
lang: be
translationKey: local-privacy
tags: ["llm", "networking", "machine-learning"]
---
Аргумент за тое, каб трымаць мадэль у сябе на машыне, кароткі. Воблачны API атрымлівае кожны промпт цалкам і што з ім адбываецца далей, вырашае палітыка правайдара. Калі мадэль ляжыць у мяне на дыску, сеткі ў ланцужку няма, таму ніхто нічога не атрымлівае.

На гэтым тыдні я хацеў запісаць, чаму трымаю мадэль лакальна і ўвесь мой аргумент змясціўся ў абзац вышэй. Другую яго палову я ніколі не правяраў. Мая "лакальная" ўстаноўка гэта `pipeline("text-generation", model="gpt2")` і выклік. Пасля першага запуску вагі ляжаць у кэшы, таму я лічыў, што пасля першага запуску з машыны нічога не сыходзіць. У трафік гэтых радкоў я ні разу не глядзеў, таму паглядзеў.

## Абстаноўка

Версіі, актуальныя на гэтым тыдні: Python 3.9, torch 1.10.0 на CPU, transformers 4.12.3 (выйшаў 3 лістапада), tokenizers 0.10.3. Мадэль GPT-2 small, 124 млн параметраў. Промпт гэта выдуманы радок рахунку, `Invoice 4471 for ACME, net 30, total`. `ACME` працуе канарэйкай: калі гэтае слова апынецца хоць у адным байце хоць аднаго запыту, значыць тэкст сышоў.

Увесь HTTPS працэсу ідзе праз mitmproxy, яго сертыфікат ляжыць у `REQUESTS_CA_BUNDLE`, таму кожны запыт я бачу адкрытым тэкстам разам з загалоўкамі. Асобна я запусціў той жа скрыпт пад `strace -f -e trace=connect` без ніякага проксі. Так відаць кожнае злучэнне кожнага патоку, у тым ліку тыя, што міма проксі.

## Што сыходзіць

Першы запуск з пустым кэшам спампаваў каля 550 МБ, большая частка з іх вагі. Гэтага я чакаў, адкуль-небудзь яны павінны ўзяцца.

Другі запуск, калі ўсё ўжо ў кэшы, зрабіў 13 запытаў. Трэці і чацвёрты таксама 13. 12 з іх гэта запыты `HEAD`, па адным на кожны файл, які можа спатрэбіцца пайплайну. `config.json` запытваюць 4 разы. Некаторых файлаў токенізатара ў гэтым рэпазіторыі няма і на іх прыходзіць 404, але іх усё роўна запытваюць. Астатні запыт гэта `GET /api/models/gpt2`, ён вяртае спіс файлаў рэпазіторыя. Акрамя гэтага спісу нічога не спампоўваецца, `HEAD` толькі звярае ETag з кэшам. Вонкі сыходзіць каля 4 КБ за выклік.

<figure class="fig">
<svg viewBox="0 0 680 325" role="img" aria-label="13 запытаў, якія адзін выклік пайплайна з поўным кэшам адпраўляе на huggingface.co, па парадку: HEAD config.json, HEAD config.json, HEAD pytorch_model.bin, HEAD tokenizer_config.json, HEAD config.json, GET /api/models/gpt2, HEAD vocab.json, HEAD merges.txt, HEAD tokenizer.json, HEAD added_tokens.json, HEAD special_tokens_map.json, HEAD tokenizer_config.json, HEAD config.json. Промпт застаецца на машыне: яго няма ні ў адным з 13 запытаў.">
  <rect x="20" y="40" width="200" height="150" rx="4" class="f-box"/>
  <text x="30" y="62" text-anchor="start" class="f-label f-ink" style="font-size:13px">мая машына</text>
  <text x="30" y="92" text-anchor="start" class="f-muted" style="font-size:12px">промпт:</text>
  <text x="30" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Invoice 4471 for</text>
  <text x="30" y="125" text-anchor="start" class="f-mono f-accent" style="font-size:11px">ACME, net 30, total</text>
  <text x="30" y="160" text-anchor="start" class="f-ink" style="font-size:13px">0 з 13 запытаў</text>
  <text x="30" y="176" text-anchor="start" class="f-muted" style="font-size:12px">яго ўтрымліваюць</text>
  <line x1="222" y1="115" x2="262" y2="115" class="f-line"/>
  <path d="M262 115 l-7 -4 v8 z" class="f-ink"/>
  <text x="270" y="26" text-anchor="start" class="f-label f-ink" style="font-size:12px">huggingface.co, адзін выклік з поўным кэшам</text>
  <rect x="270" y="38" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="50" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 1</text>
  <text x="298" y="50" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="50" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="57" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="69" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 2</text>
  <text x="298" y="69" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="69" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="76" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="88" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 3</text>
  <text x="298" y="88" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="88" text-anchor="start" class="f-mono f-ink" style="font-size:10px">pytorch_model.bin</text>
  <rect x="270" y="95" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="107" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 4</text>
  <text x="298" y="107" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="107" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer_config.json</text>
  <rect x="270" y="114" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="126" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 5</text>
  <text x="298" y="126" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="126" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <rect x="270" y="133" width="390" height="16" rx="2" class="f-box"/>
  <text x="276" y="145" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 6</text>
  <text x="298" y="145" text-anchor="start" class="f-mono f-accent" style="font-size:10px">GET</text>
  <text x="340" y="145" text-anchor="start" class="f-mono f-ink" style="font-size:10px">/api/models/gpt2</text>
  <rect x="270" y="152" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="164" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 7</text>
  <text x="298" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="164" text-anchor="start" class="f-mono f-ink" style="font-size:10px">vocab.json</text>
  <rect x="270" y="171" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="183" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 8</text>
  <text x="298" y="183" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="183" text-anchor="start" class="f-mono f-ink" style="font-size:10px">merges.txt</text>
  <rect x="270" y="190" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="202" text-anchor="start" class="f-mono f-muted" style="font-size:10px"> 9</text>
  <text x="298" y="202" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="202" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer.json</text>
  <rect x="270" y="209" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="221" text-anchor="start" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="298" y="221" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="221" text-anchor="start" class="f-mono f-ink" style="font-size:10px">added_tokens.json</text>
  <rect x="270" y="228" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="240" text-anchor="start" class="f-mono f-muted" style="font-size:10px">11</text>
  <text x="298" y="240" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="240" text-anchor="start" class="f-mono f-ink" style="font-size:10px">special_tokens_map.json</text>
  <rect x="270" y="247" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="259" text-anchor="start" class="f-mono f-muted" style="font-size:10px">12</text>
  <text x="298" y="259" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="259" text-anchor="start" class="f-mono f-ink" style="font-size:10px">tokenizer_config.json</text>
  <rect x="270" y="266" width="390" height="16" rx="2" class="f-plain"/>
  <text x="276" y="278" text-anchor="start" class="f-mono f-muted" style="font-size:10px">13</text>
  <text x="298" y="278" text-anchor="start" class="f-mono f-ink" style="font-size:10px">HEAD</text>
  <text x="340" y="278" text-anchor="start" class="f-mono f-ink" style="font-size:10px">config.json</text>
  <text x="270" y="299" text-anchor="start" class="f-muted" style="font-size:11px">у кожным HEAD: версіі transformers, Python і torch,</text>
  <text x="270" y="314" text-anchor="start" class="f-mono f-muted" style="font-size:10px">session_id, file_type, using_pipeline</text>
</svg>
<figcaption>Адзін выклік пайплайна для GPT-2, калі ўсё ўжо ляжыць у кэшы, transformers 4.12.3. Тэксту промпта няма ні ў адным запыце. Вонкі ідуць user agent і імёны файлаў мадэлі, якую я загружаю.</figcaption>
</figure>

Канарэйкі няма ні ў адным запыце. Тэкст промпта не сышоў, так што галоўная палова аргумента трымаецца. Але кожны `HEAD` нясе такі user agent:

```
transformers/4.12.3; python/3.9.<patch>; session_id/<32 hex chars>; torch/1.10.0+cpu;
file_type/model; framework/pytorch; from_auto_class/True; using_pipeline/text-generation
```

Гэта значыць, пры кожнай загрузцы хаб даведваецца, якую мадэль я выкарыстоўваю і што выклікаю яе праз пайплайн генерацыі тэксту. Яшчэ ён атрымлівае мае версіі Python і torch, мой IP-адрас і час. `session_id` гэта `uuid4`, які ствараецца адзін раз на працэс (`file_utils.py`, радок 253). У маіх 3 запусках ён меў 3 розныя значэнні. Запыты аднаго працэсу ён звязвае паміж сабой. Паміж днямі іх звязвае толькі IP-адрас, калі ён не памяняўся. Гэта публічна: поле з'явілася ў сакавіку ў пул-рэквесце "Add transformers id to hub requests".

Ёсць яшчэ `DISABLE_TELEMETRY=1`. З ім сыходзяць тыя ж 13 запытаў. З user agent знікаюць `file_type`, `from_auto_class` і `using_pipeline`, замест іх з'яўляецца `telemetry/off`, але `session_id` застаецца, а імя мадэлі ўсё роўна стаіць у кожным URL. Так што сцяг памяншае тое, што хаб даведваецца пра маё карыстанне мадэллю, але трафік застаецца тымі ж 13 запытамі.

## Дзе я памыліўся

Я ўжо збіраўся напісаць, што ўся цана гэта 13 маленькіх запытаў. Потым я выключыў сетку і пайплайн не запусціўся.

Правоў root на гэтай машыне няма, таму сетку я адабраў унутры працэсу. Пошук імёнаў заўсёды падае, як на ноўтбуку з выключаным вайфаем. Кэш поўны, URL тыя ж. У докстрынгу `get_from_cache` напісана, што калі сеткі няма, вяртаецца апошняя версія з кэша. Для канфіга і вагаў так і адбываецца. Потым токенізатар запытвае ў `/api/models/gpt2` спіс файлаў і вакол гэтага выкліку няма `try`. Праз 2,7 секунды скрыпт падае з `requests.exceptions.ConnectionError`, хоць 550 МБ мадэлі ляжаць на дыску.

Другі выпадак горшы. Калі пакеты не адхіляюцца, а моўчкі адкідаюцца, як за файрволам з DROP, тое ж падзенне прыходзіць праз 187,8 секунды. Перад выклікам, які падае, ідуць 5 запытаў `HEAD`, у кожнага таймаўт 10 секунд. У выкліку `/api/models` таймаўту няма зусім, таму ён чакае, пакуль ядро не адмовіцца ад злучэння. У strace гэтае чаканне каля 135 секунд. 50 плюс 135 плюс 3 секунды на старт і загрузку мадэлі даюць тыя самыя 187,8.

Я праверыў пакеты wheel 4.10.3 і 4.11.3, там той жа выклік.

<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Час ад старту да канца скрыпта без сеткі, калі ўся мадэль у кэшы. Няма DNS, без сцяга: 2,7 с, ConnectionError; пакеты адкідаюцца, без сцяга: 187,8 с, ConnectionError; няма DNS, TRANSFORMERS_OFFLINE=1: 3,4 с, адказ; пакеты адкідаюцца, TRANSFORMERS_OFFLINE=1: 4,0 с, адказ.">
  <text x="20" y="33" text-anchor="start" class="f-ink" style="font-size:12px">няма DNS</text>
  <text x="20" y="48" text-anchor="start" class="f-mono f-muted" style="font-size:10px">без сцяга</text>
  <rect x="230" y="24" width="5.7" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="243.68421052631578" y="39" text-anchor="start" class="f-ink f-mono" style="font-size:11px">2,7 с, ConnectionError</text>
  <text x="20" y="77" text-anchor="start" class="f-ink" style="font-size:12px">пакеты адкідаюцца</text>
  <text x="20" y="92" text-anchor="start" class="f-mono f-muted" style="font-size:10px">без сцяга</text>
  <rect x="230" y="68" width="395.4" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="617.3684210526317" y="83" text-anchor="end" class="f-ink f-mono" style="font-size:11px">187,8 с, ConnectionError</text>
  <text x="20" y="121" text-anchor="start" class="f-ink" style="font-size:12px">няма DNS</text>
  <text x="20" y="136" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="112" width="7.2" height="22" rx="2" class="f-box" style=""/>
  <text x="245.1578947368421" y="127" text-anchor="start" class="f-accent f-mono" style="font-size:11px">3,4 с, адказ</text>
  <text x="20" y="165" text-anchor="start" class="f-ink" style="font-size:12px">пакеты адкідаюцца</text>
  <text x="20" y="180" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="156" width="8.4" height="22" rx="2" class="f-box" style=""/>
  <text x="246.42105263157896" y="171" text-anchor="start" class="f-accent f-mono" style="font-size:11px">4,0 с, адказ</text>
  <line x1="230" y1="202" x2="630" y2="202" class="f-line"/>
  <line x1="230" y1="202" x2="230" y2="206" class="f-line"/>
  <text x="230" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">0 с</text>
  <line x1="356.3157894736842" y1="202" x2="356.3157894736842" y2="206" class="f-line"/>
  <text x="356.3157894736842" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">60 с</text>
  <line x1="482.63157894736844" y1="202" x2="482.63157894736844" y2="206" class="f-line"/>
  <text x="482.63157894736844" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">120 с</text>
  <line x1="608.9473684210526" y1="202" x2="608.9473684210526" y2="206" class="f-line"/>
  <text x="608.9473684210526" y="218" text-anchor="middle" class="f-muted" style="font-size:10px">180 с</text>
</svg>
<figcaption>Без сеткі і без сцяга скрыпт падае на запыце спісу файлаў, хоць усе 550 МБ ляжаць у кэшы. Калі пакеты моўчкі адкідаюцца, падзення даводзіцца чакаць каля 3 хвілін. Кожнае значэнне з аднаго прагону.</figcaption>
</figure>

## Сцяг

У дакументацыі ёсць раздзел "Offline mode" з `TRANSFORMERS_OFFLINE=1`. Там сказана, што з ім скрыпт "should succeed without any hanging waiting to timeout". Са сцягам абодва выпадкі без сеткі працуюць і даюць той жа тэкст: 3,4 і 4,0 секунды ад старту да адказу. Пад strace са сцягам працэс не робіць ніводнага выкліку `connect()`, нават да DNS. Без сцяга той жа strace паказвае 13 зваротаў да порта 53, столькі ж, колькі запытаў.

Заадно загрузка хутчэйшая: 2,1 секунды са сцягам і 4,2 без яго, пад strace. Гэта адзінкавыя прагоны на агульнай машыне, таму веру я толькі кірунку.

Мадэль я па-ранейшаму трымаю дома і галоўная прычына не памянялася: промпт застаецца на маёй машыне. Але "вагі ляжаць на дыску" і "у сетку нічога не сыходзіць" аказаліся 2 рознымі станамі. Розніца паміж імі гэта `TRANSFORMERS_OFFLINE=1` і да гэтага тыдня я пра яго не ведаў.

## Чаго я не правяраў

- Толькі GPT-2 і толькі пайплайн на PyTorch. У іншых мадэлей іншыя файлы і колькасць запытаў будзе іншай.
- Колькасць запытаў задае кліенцкі код 4.12.3. Коды адказаў задае сервер, а сервер можа памяняцца ў любы дзень.
- Сетку я прыбраў унутры працэсу, падмяніўшы пошук імёнаў, а не выдраў кабель і не падняў сеткавую прастору імёнаў. Пры сапраўдным абрыве падзенне можа быць у іншым месцы, напрыклад на рукапацісканні TLS.
- Я не глядзеў, што хаб захоўвае з гэтых запытаў і як доўга. Я бачу толькі тое, што сыходзіць з маёй машыны.
- У `datasets` свой `HF_DATASETS_OFFLINE` і яго я не мераў.
