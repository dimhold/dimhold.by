---
title: "Найбольшая мадэль, якую я змог загрузіць у 4 ГБ, прыкладна роўная самаму таннаму GPT-3"
description: "Пакуль у GPT-3 API спіс чакання, я праверыў, што запускае мая машына, калі даць мадэлі 4 ГБ, на torch 1.10.0 і transformers 4.12.2. GPT-2 large не загрузілася, пакуль я не паправіў імёны ў яе файле і наладу glibc. Пасля гэтага яна дала 47,6% на LAMBADA, прыкладна на ўзроўні ada, самай таннай мадэлі API."
date: 2021-10-30
lang: be
translationKey: laptop-vs-cloud
tags: ["llm", "machine-learning", "performance"]
---
У OpenAI API дагэтуль спіс чакання, таму GPT-3 для мяне тое, пра што я чытаю, а не тое, што я запускаю. Запусціць я магу адкрытыя вагі, GPT-2 ад OpenAI і мадэлі `GPT-Neo` ад EleutherAI. З чэрвеня ёсць яшчэ іх GPT-J на 6 мільярдаў параметраў. Адсюль маё пытанне: колькі з гэтага насамрэч можа запусціць мая ўласная машына.

Адказ у мяне быў гатовы і я яго ні разу не правяраў. Мадэль з N параметрамі ў fp32 займае 4N байтаў. Значыць, у 8 ГБ змяшчаецца ўсё да 1.5B, а працэсар вырашае толькі тое, колькі я буду чакаць. Я палічыў параметры і на гэтым спыніўся.

## Стэнд

У машыны 4 ядры і 8 ГБ, GPU няма. Прыкладна палову памяці займаюць іншыя службы. Таму кожны прагон ідзе ў cgroup з жорсткім лімітам, `systemd-run --user --scope -p MemoryMax=4G -p MemorySwapMax=0`. Свопа працэс не атрымлівае, а калі выходзіць за 4096 МБ, яго забіваюць. Версіі гэтага тыдня: Python 3.9, torch 1.10.0 на CPU, transformers 4.12.2, які выйшаў учора.

Для хуткасці я генерую 64 токены прагным дэкадаваннем пасля промпта з 12 токенаў. Раблю гэта 3 разы і бяру медыяну. Для якасці бяру LAMBADA, дзе мадэль павінна адгадаць апошняе слова ўрыўка. Лічу гэтак жа, як EleutherAI у сваім `lm-evaluation-harness`. Адказ правільны, толькі калі самы імавернасны токен правільны на кожнай пазіцыі слова. EleutherAI прагналі той жа harness праз API на ada, babbage, curie і davinci і выклалі лічбы ў README GPT-J. Каб праверыць, што я лічу тое ж самае, я прагнаў Neo 125M на ўсіх 5153 урыўках. Атрымалася 37,36% і перплексія 30,265, у README Neo стаіць 37,36% і 30,266. Значыць, мае лічбы можна ставіць побач з іх лічбамі для API.

Астатнія мадэлі я прагнаў на 500 выпадковых урыўках, адных і тых жа для ўсіх. На іх Neo 125M дае 34,6%, гэта значыць мая выбарка на 2,8 пункта цяжэйшая за поўны набор.

## Што загрузілася

<figure class="fig">
<svg viewBox="0 0 680 302" role="img" aria-label="Памяць пры загрузцы кожнай мадэлі пад жорсткім лімітам 4096 МБ. GPT-2 small: файл вагаў 523 МБ, пік пры загрузцы 1358 МБ; Neo 125M: файл вагаў 502 МБ, пік пры загрузцы 1392 МБ; GPT-2 medium: файл вагаў 1450 МБ, пік пры загрузцы 3237 МБ; GPT-2 large (як апублікавана, па змаўчанні): файл вагаў 3097 МБ, забіты; GPT-2 large (прэфікс + параметр + MALLOC_): файл вагаў 3097 МБ, пік пры загрузцы 3530 МБ; Neo 1.3B: файл вагаў 5067 МБ, забіты.">
  <rect x="190" y="8" width="14" height="8" rx="1" class="f-box"/>
  <text x="210" y="16" text-anchor="start" class="f-muted" style="font-size:11px">файл вагаў</text>
  <rect x="340" y="8" width="14" height="8" rx="1" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="360" y="16" text-anchor="start" class="f-muted" style="font-size:11px">пік пры загрузцы</text>
  <text x="20" y="43" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 small</text>
  <rect x="190" y="32" width="99.6" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="295.58666666666664" y="49" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1358 МБ</text>
  <rect x="190" y="39" width="38.4" height="12" rx="1" class="f-box"/>
  <text x="20" y="81" text-anchor="start" class="f-ink" style="font-size:12px">Neo 125M</text>
  <rect x="190" y="70" width="102.1" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="298.08" y="87" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1392 МБ</text>
  <rect x="190" y="77" width="36.8" height="12" rx="1" class="f-box"/>
  <text x="20" y="119" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 medium</text>
  <rect x="190" y="108" width="237.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="433.38" y="125" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3237 МБ</text>
  <rect x="190" y="115" width="106.3" height="12" rx="1" class="f-box"/>
  <text x="20" y="157" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="171" text-anchor="start" class="f-mono f-muted" style="font-size:9px">як апублікавана, па змаўчанні</text>
  <rect x="190" y="146" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="496.37333333333333" y="163" text-anchor="start" class="f-mono f-accent" style="font-size:11px">забіты (137)</text>
  <rect x="190" y="153" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="195" text-anchor="start" class="f-ink" style="font-size:12px">GPT-2 large</text>
  <text x="20" y="209" text-anchor="start" class="f-mono f-muted" style="font-size:9px">прэфікс + параметр + MALLOC_</text>
  <rect x="190" y="184" width="258.9" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.45"/>
  <text x="454.8666666666667" y="201" text-anchor="start" class="f-mono f-ink" style="font-size:11px">3530 МБ</text>
  <rect x="190" y="191" width="227.1" height="12" rx="1" class="f-box"/>
  <text x="20" y="233" text-anchor="start" class="f-ink" style="font-size:12px">Neo 1.3B</text>
  <rect x="190" y="222" width="300.4" height="26" rx="2" class="f-plain" style="fill:var(--muted);opacity:.25"/>
  <text x="567.58" y="239" text-anchor="start" class="f-mono f-accent" style="font-size:11px">забіты (137)</text>
  <rect x="190" y="229" width="371.6" height="12" rx="1" class="f-box"/>
  <line x1="490.37333333333333" y1="26" x2="490.37333333333333" y2="262" class="f-line" style="stroke:var(--accent);stroke-dasharray:4 3"/>
  <text x="490.37333333333333" y="292" text-anchor="middle" class="f-accent f-mono" style="font-size:10px">ліміт 4096 МБ</text>
  <line x1="190" y1="262" x2="630" y2="262" class="f-line"/>
  <line x1="190" y1="262" x2="190" y2="266" class="f-line"/>
  <text x="190" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">0</text>
  <line x1="263.3333333333333" y1="262" x2="263.3333333333333" y2="266" class="f-line"/>
  <text x="263.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">1000</text>
  <line x1="336.66666666666663" y1="262" x2="336.66666666666663" y2="266" class="f-line"/>
  <text x="336.66666666666663" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">2000</text>
  <line x1="410" y1="262" x2="410" y2="266" class="f-line"/>
  <text x="410" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">3000</text>
  <line x1="483.3333333333333" y1="262" x2="483.3333333333333" y2="266" class="f-line"/>
  <text x="483.3333333333333" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">4000</text>
  <line x1="556.6666666666667" y1="262" x2="556.6666666666667" y2="266" class="f-line"/>
  <text x="556.6666666666667" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">5000</text>
  <line x1="630" y1="262" x2="630" y2="266" class="f-line"/>
  <text x="630" y="278" text-anchor="middle" class="f-muted" style="font-size:10px">6000</text>
</svg>
<figcaption>Пікавая памяць from_pretrained у transformers 4.12.2, torch 1.10.0, fp32, па адным прагоне. Загрузчык па змаўчанні трымае ў памяці адначасова файл і мадэль. GPT-2 large змяшчаецца толькі з прэфіксам transformer. у імёнах файла, з low_cpu_mem_usage=True і MALLOC_MMAP_THRESHOLD_=131072.</figcaption>
</figure>

GPT-2 small і Neo 125M загружаюцца прыкладна за 2 секунды і пішуць каля 30 токенаў у секунду. GPT-2 medium на 355M параметраў загружаецца за 5 секунд і піша ад 10 да 12 токенаў у секунду, залежна ад прагону. Да гэтага месца ўсё было так, як я чакаў.

Далей GPT-2 large, 774M. Файл 3097 МБ, ліміт 4096 МБ, па маёй арыфметыцы змяшчаецца. Працэс забілі падчас загрузкі. Neo 1.3B з файлам 5067 МБ таксама забілі, але там гэта было відаць па арыфметыцы загадзя.

Каб зразумець чаму, я запісваў расход памяці пры адной загрузцы кожныя 10 мс. Для GPT-2 medium `from_pretrained` спачатку чытае ўвесь файл праз `torch.load`, гэта 1450 МБ тэнзараў. Потым будуе мадэль са сваімі 1450 МБ і капіюе ў яе вагі. Пік быў 3237 МБ, у 2,2 раза больш за файл. Пры той жа прапорцыі GPT-2 large на некалькі секунд спатрэбілася б каля 7 ГБ, гэтага я не мераў. Мая арыфметыка памылілася больш чым удвая.

## Параметр, які нічога не загружае

Якраз на гэты выпадак у transformers з версіі 4.11 ёсць параметр `low_cpu_mem_usage=True`. У дакстрынгу напісана, што ён стараецца займаць у памяці не больш, чым важыць сама мадэль. Параметр пазначаны як эксперыментальны. З ім GPT-2 large зноў забілі. GPT-2 small і medium загрузіліся і medium працягнула мой промпт пра рахунак на аплату вось так:

```
 that that that that that that that that that that that that that that that
```

Ні памылкі, ні папярэджання. На LAMBADA GPT-2 small з гэтым параметрам адгадала 0 урыўкаў са 100, без яго 31 са 100 на тых жа ўрыўках. Прычына ў імёнах вагаў. У файлах ад OpenAI яны запісаныя без прэфікса, `wte.weight`, `h.0.attn.c_attn.weight`. Звычайны загрузчык гэта заўважае і кладзе іх у частку мадэлі `transformer`. Новы шлях шукае кожнае імя ў мадэлі як ёсць, не знаходзіць там `wte` і моўчкі яго прапускае. У выніку мадэль працуе на выпадковых вагах, з якімі яе стварылі. У файлах Neo прэфікс ёсць і з імі параметр працуе.

Я адзін раз загрузіў файл GPT-2 large, дадаў да кожнага імя прэфікс `transformer.` і захаваў нанова. Загрузка гэтай копіі з параметрам усё роўна выйшла за 4096 МБ. Вось тут я разбіраўся даўжэй за ўсё. З параметрам загрузчык чытае файл 2 разы: спачатку цалкам, толькі каб узяць імёны, потым дзеля вагаў. Запіс расходу памяці паказаў, што пасля выдалення першага чытання сістэме вярнулася толькі каля 250 МБ з яго 3100. Памяць для другога чытання выдзелілася паверх астатняга. Я паставіў `MALLOC_MMAP_THRESHOLD_=131072`, гэтая зменная загадвае glibc выдаваць кожнаму вялікаму блоку асобнае адлюстраванне. Па змаўчанні glibc сама падымае гэты парог, калі вызваляюцца вялікія блокі, гэта апісана ў `man mallopt`. Што справа была менавіта ў гэтым, я толькі мяркую: бачу гэта толькі па RSS. Са зменнай пік быў 3530 МБ, у 1,14 раза больш за файл. GPT-2 large нарэшце загрузілася за 15 секунд і піша 6,1 токена ў секунду.

## Менш байтаў не дапамагло

Наступнае, што варта паспрабаваць, гэта палавінная дакладнасць, 2 байты на параметр. На гэтым працэсары torch 1.10 умее лічыць у bfloat16, але GPT-2 small тады піша 1,5 токена ў секунду замест 30. float16 не працуе зусім, першы ж крок падае з `"LayerNormKernelImpl" not implemented for 'Half'`. А з `low_cpu_mem_usage` тып, які я прашу, ігнаруецца, вагі застаюцца float32, як у файле. Так што на гэтым працэсары я застаюся на float32.

## Супраць воблака

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Дакладнасць на LAMBADA. GPT-2 small 29,2% (на маёй машыне, 500 урыўкаў); Neo 125M 34,6% (на маёй машыне, 500 урыўкаў); GPT-2 medium 43,2% (на маёй машыне, 500 урыўкаў); GPT-2 large 47,6% (на маёй машыне, 500 урыўкаў); ada 51,6%; babbage 62,4%; curie 69,3%; davinci 75%; Neo 1.3B 57,2% (не загрузілася).">
  <text x="40" y="18" text-anchor="start" class="f-label f-ink" style="font-size:11px">на маёй машыне, 500 урыўкаў</text>
  <text x="40" y="246" text-anchor="start" class="f-label f-ink" style="font-size:11px">API і Neo 1.3B, табліца EleutherAI, 5153 урыўкі</text>
  <line x1="40" y1="120" x2="640" y2="120" class="f-line"/>
  <line x1="40.0" y1="117" x2="40.0" y2="123" class="f-line"/>
  <text x="40.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">20%</text>
  <line x1="140.0" y1="117" x2="140.0" y2="123" class="f-line"/>
  <text x="140.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">30%</text>
  <line x1="240.0" y1="117" x2="240.0" y2="123" class="f-line"/>
  <text x="240.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">40%</text>
  <line x1="340.0" y1="117" x2="340.0" y2="123" class="f-line"/>
  <text x="340.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">50%</text>
  <line x1="440.0" y1="117" x2="440.0" y2="123" class="f-line"/>
  <text x="440.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">60%</text>
  <line x1="540.0" y1="117" x2="540.0" y2="123" class="f-line"/>
  <text x="540.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">70%</text>
  <line x1="640.0" y1="117" x2="640.0" y2="123" class="f-line"/>
  <text x="640.0" y="136" text-anchor="middle" class="f-muted" style="font-size:10px">80%</text>
  <line x1="132.0" y1="46" x2="132.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="132.0" cy="120" r="5" class="f-box"/>
  <text x="132.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 small 29,2%</text>
  <line x1="186.0" y1="72" x2="186.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="186.0" cy="120" r="5" class="f-box"/>
  <text x="186.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">Neo 125M 34,6%</text>
  <line x1="272.0" y1="46" x2="272.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="272.0" cy="120" r="5" class="f-box"/>
  <text x="272.0" y="40" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 medium 43,2%</text>
  <line x1="316.0" y1="72" x2="316.0" y2="114" class="f-line" style="stroke-dasharray:2 2"/>
  <circle cx="316.0" cy="120" r="5" class="f-box"/>
  <text x="316.0" y="66" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">GPT-2 large 47,6%</text>
  <line x1="356.0" y1="142" x2="356.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="351.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="356.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">ada 51,6%</text>
  <line x1="412.0" y1="142" x2="412.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="407.0" y="115" width="10" height="10" class="f-plain" style="stroke:var(--muted)"/>
  <text x="412.0" y="194" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">Neo 1.3B 57,2%</text>
  <text x="412.0" y="207" text-anchor="middle" class="f-muted" style="font-size:9px">не загрузілася</text>
  <line x1="464.0" y1="142" x2="464.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="459.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="464.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">babbage 62,4%</text>
  <line x1="533.0" y1="142" x2="533.0" y2="182" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="528.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="533.0" y="194" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">curie 69,3%</text>
  <line x1="590.0" y1="142" x2="590.0" y2="156" class="f-line" style="stroke-dasharray:2 2"/>
  <rect x="585.0" y="115" width="10" height="10" class="f-box" style="fill:var(--accent)"/>
  <text x="590.0" y="168" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">davinci 75%</text>
</svg>
<figcaption>LAMBADA, апошняе слова адгадана цалкам, падлік як у harness ад EleutherAI. Мае лічбы атрыманыя на 500 выпадковых урыўках, гэтая выбарка на 2,8 пункта цяжэйшая за поўны набор. Лічбы API з README GPT-J (EleutherAI, верасень 2021), усе 5153 урыўкі.</figcaption>
</figure>

GPT-2 large, найбольшая мадэль, якую я ўціснуў у 4 ГБ, набірае 47,6% на маіх 500 урыўках. Калі папраўка на 2,8 пункта, на якія мая выбарка цяжэйшая, дакладная і для гэтай мадэлі, то гэта каля 50%. У табліцы EleutherAI у ada праз API 51,6%, у davinci 75%, babbage і curie паміж імі. Neo 1.3B, якая не загрузілася, набірае там 57,2%. GPT-2 1.5B, якую я нават не спрабаваў, набірае 51,21%.

Выходзіць, пасля 2 абыходных рашэнняў лепшае, што запускае мая машына, прыкладна на ўзроўні самай таннай мадэлі API. Davinci вышэй прыкладна на 25 пунктаў. 6 токенаў у секунду гэта павольна, але працаваць з гэтым можна. Спыніла мяне памяць. Найбольш тая, якую загрузчык бярэ звыш саміх вагаў.

## Што я не правяраў

Квантаванне ў int8. У torch ёсць `quantize_dynamic` для `nn.Linear`, але GPT-2 сабраная са сваіх модуляў `Conv1D` і пераўтвараецца толькі выходны слой. Для Neo гэта спрацавала б, але я гэтага не мераў. Не спрабаваў ні машыну з 16 ГБ, ні GPT-J, ні GPU, ні ONNX. Затрымку API я не магу вымераць, пакуль у яго спіс чакання. LAMBADA гэта 1 задача. 500 урыўкаў даюць хібнасць каля 4 пунктаў у абодва бакі. Хуткасць гэта 1 прагон з 3 паўтораў на машыне, дзе працуюць і іншыя службы. EleutherAI самі пішуць пад сваёй табліцай, што праз адрозненні ў рэалізацыі лічбы "might not be directly comparable".
