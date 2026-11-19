---
title: "Мой локальный GPT-2 сделал 13 запросов к huggingface.co, прежде чем ответить"
description: "Я держу GPT-2 у себя, чтобы промпты оставались на машине. С transformers 4.12.3 и моделью в кэше один вызов пайплайна всё равно сделал 13 запросов к huggingface.co. Промпта не было ни в одном, но без сети тот же вызов падал. За файрволом, который отбрасывает пакеты, падения пришлось ждать 187,8 секунды."
date: 2021-11-14
lang: ru
translationKey: local-privacy
tags: ["llm", "networking", "machine-learning"]
---
Довод за то, чтобы держать модель у себя на машине, короткий. Облачный API получает каждый промпт целиком и что с ним происходит дальше, решает политика провайдера. Когда модель лежит у меня на диске, сети в цепочке нет, поэтому никто ничего не получает.

На этой неделе я хотел записать, почему держу модель локально. Весь мой довод уместился в абзац выше. Вторую его половину я никогда не проверял. Моя "локальная" установка это `pipeline("text-generation", model="gpt2")` и вызов. После первого запуска веса лежат в кэше, поэтому я считал, что после первого запуска с машины ничего не уходит. Какой трафик дают эти строки, я ни разу не смотрел, поэтому посмотрел.

## Стенд

Версии, актуальные на этой неделе: Python 3.9, torch 1.10.0 на CPU, transformers 4.12.3 (вышел 3 ноября), tokenizers 0.10.3. Модель GPT-2 small, 124 млн параметров. Промпт это выдуманная строка счёта, `Invoice 4471 for ACME, net 30, total`. `ACME` работает канарейкой: если это слово окажется хоть в одном байте хоть одного запроса, значит текст ушёл.

Весь трафик процесса по HTTPS идёт через mitmproxy, его сертификат лежит в `REQUESTS_CA_BUNDLE`, поэтому каждый запрос я вижу открытым текстом вместе с заголовками. Отдельно я запустил тот же скрипт под `strace -f -e trace=connect` без всякого прокси. Так видно каждое соединение каждого потока, в том числе те, что мимо прокси.

## Что уходит

Первый запуск с пустым кэшем скачал около 550 МБ, большая часть это веса. Этого я ждал, откуда-то они должны взяться.

Второй запуск, когда всё уже в кэше, сделал 13 запросов. Третий и четвёртый тоже 13. 12 из них это запросы `HEAD`, по одному на каждый файл, который может понадобиться пайплайну. `config.json` спрашивается 4 раза. Некоторых файлов токенизатора в этом репозитории нет и на них приходит 404, но спрашиваются они всё равно. Оставшийся запрос это `GET /api/models/gpt2`, он возвращает список файлов репозитория. Кроме этого списка ничего не скачивается, `HEAD` только сверяет ETag с кэшем. Наружу уходит около 4 КБ за вызов.

<figure class="fig">
<svg viewBox="0 0 680 325" role="img" aria-label="13 запросов, которые один вызов пайплайна с полным кэшем отправляет на huggingface.co, по порядку: HEAD config.json, HEAD config.json, HEAD pytorch_model.bin, HEAD tokenizer_config.json, HEAD config.json, GET /api/models/gpt2, HEAD vocab.json, HEAD merges.txt, HEAD tokenizer.json, HEAD added_tokens.json, HEAD special_tokens_map.json, HEAD tokenizer_config.json, HEAD config.json. Промпт остаётся на машине: его нет ни в одном из 13 запросов.">
  <rect x="20" y="40" width="200" height="150" rx="4" class="f-box"/>
  <text x="30" y="62" text-anchor="start" class="f-label f-ink" style="font-size:13px">моя машина</text>
  <text x="30" y="92" text-anchor="start" class="f-muted" style="font-size:12px">промпт:</text>
  <text x="30" y="110" text-anchor="start" class="f-mono f-ink" style="font-size:11px">Invoice 4471 for</text>
  <text x="30" y="125" text-anchor="start" class="f-mono f-accent" style="font-size:11px">ACME, net 30, total</text>
  <text x="30" y="160" text-anchor="start" class="f-ink" style="font-size:13px">0 из 13 запросов</text>
  <text x="30" y="176" text-anchor="start" class="f-muted" style="font-size:12px">его содержат</text>
  <line x1="222" y1="115" x2="262" y2="115" class="f-line"/>
  <path d="M262 115 l-7 -4 v8 z" class="f-ink"/>
  <text x="270" y="26" text-anchor="start" class="f-label f-ink" style="font-size:12px">huggingface.co, один вызов с полным кэшем</text>
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
  <text x="270" y="299" text-anchor="start" class="f-muted" style="font-size:11px">в каждом HEAD: версии transformers, Python и torch,</text>
  <text x="270" y="314" text-anchor="start" class="f-mono f-muted" style="font-size:10px">session_id, file_type, using_pipeline</text>
</svg>
<figcaption>Один вызов пайплайна для GPT-2, когда всё уже лежит в кэше, transformers 4.12.3. Текста промпта нет ни в одном запросе. Наружу уходят user agent и имена файлов модели, которую я загружаю.</figcaption>
</figure>

Канарейки нет ни в одном запросе. Текст промпта не ушёл, так что главная половина довода держится. Но каждый `HEAD` несёт такой user agent:

```
transformers/4.12.3; python/3.9.<patch>; session_id/<32 hex chars>; torch/1.10.0+cpu;
file_type/model; framework/pytorch; from_auto_class/True; using_pipeline/text-generation
```

То есть при каждой загрузке хаб узнаёт, какую модель я использую и что вызываю её через пайплайн генерации текста. Ещё он получает мои версии Python и torch, мой IP-адрес и время. `session_id` это `uuid4`, который создаётся один раз на процесс (`file_utils.py`, строка 253). В моих 3 запусках у него было 3 разных значения. Запросы одного процесса он связывает между собой. Между днями их связывает только IP-адрес, если он не поменялся. Это публично: поле появилось в марте с пул-реквестом "Add transformers id to hub requests".

Есть ещё `DISABLE_TELEMETRY=1`. С ним уходят те же 13 запросов. Из user agent пропадают `file_type`, `from_auto_class` и `using_pipeline`, вместо них появляется `telemetry/off`, но `session_id` остаётся, а имя модели всё равно стоит в каждом URL. Так что флаг сокращает то, что хаб узнаёт о моём использовании модели, но трафик остаётся теми же 13 запросами.

## Где я ошибся

Я уже собирался написать, что вся цена это 13 маленьких запросов. Потом я выключил сеть и пайплайн не запустился.

Рута на этой машине нет, поэтому сеть я отнял внутри процесса. Имя не резолвится никогда, как на ноутбуке с выключенным вайфаем. Кэш полный, URL те же. В докстринге `get_from_cache` написано, что если сети нет, возвращается последняя версия из кэша. Для конфига и весов так и происходит. Потом токенизатор спрашивает у `/api/models/gpt2` список файлов и вокруг этого вызова нет `try`. Через 2,7 секунды скрипт падает с `requests.exceptions.ConnectionError`, хотя 550 МБ модели лежат на диске.

Второй случай хуже. Когда пакеты не отклоняются, а молча отбрасываются, как за файрволом с DROP, то же падение приходит через 187,8 секунды. Перед падающим вызовом идут 5 запросов `HEAD`, у каждого таймаут 10 секунд. У вызова `/api/models` таймаута нет совсем, поэтому он ждёт, пока ядро само не бросит попытку соединиться. В strace это ожидание около 135 секунд. 50 плюс 135 плюс 3 секунды на старт и загрузку модели дают те самые 187,8.

Я проверил пакеты 4.10.3 и 4.11.3 с PyPI, там тот же вызов.

<figure class="fig">
<svg viewBox="0 0 680 228" role="img" aria-label="Время от старта до конца скрипта без сети, когда вся модель в кэше. Нет DNS, без флага: 2,7 с, ConnectionError; пакеты отбрасываются, без флага: 187,8 с, ConnectionError; нет DNS, TRANSFORMERS_OFFLINE=1: 3,4 с, ответ; пакеты отбрасываются, TRANSFORMERS_OFFLINE=1: 4,0 с, ответ.">
  <text x="20" y="33" text-anchor="start" class="f-ink" style="font-size:12px">нет DNS</text>
  <text x="20" y="48" text-anchor="start" class="f-mono f-muted" style="font-size:10px">без флага</text>
  <rect x="230" y="24" width="5.7" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="243.68421052631578" y="39" text-anchor="start" class="f-ink f-mono" style="font-size:11px">2,7 с, ConnectionError</text>
  <text x="20" y="77" text-anchor="start" class="f-ink" style="font-size:12px">пакеты отбрасываются</text>
  <text x="20" y="92" text-anchor="start" class="f-mono f-muted" style="font-size:10px">без флага</text>
  <rect x="230" y="68" width="395.4" height="22" rx="2" class="f-plain" style="fill:var(--muted);opacity:.55"/>
  <text x="617.3684210526317" y="83" text-anchor="end" class="f-ink f-mono" style="font-size:11px">187,8 с, ConnectionError</text>
  <text x="20" y="121" text-anchor="start" class="f-ink" style="font-size:12px">нет DNS</text>
  <text x="20" y="136" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="112" width="7.2" height="22" rx="2" class="f-box" style=""/>
  <text x="245.1578947368421" y="127" text-anchor="start" class="f-accent f-mono" style="font-size:11px">3,4 с, ответ</text>
  <text x="20" y="165" text-anchor="start" class="f-ink" style="font-size:12px">пакеты отбрасываются</text>
  <text x="20" y="180" text-anchor="start" class="f-mono f-muted" style="font-size:10px">TRANSFORMERS_OFFLINE=1</text>
  <rect x="230" y="156" width="8.4" height="22" rx="2" class="f-box" style=""/>
  <text x="246.42105263157896" y="171" text-anchor="start" class="f-accent f-mono" style="font-size:11px">4,0 с, ответ</text>
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
<figcaption>Без сети и без флага скрипт падает на запросе списка файлов, хотя все 550 МБ лежат в кэше. Когда пакеты молча отбрасываются, падения приходится ждать около 3 минут. Каждое значение из одного прогона.</figcaption>
</figure>

## Флаг

В документации есть раздел "Offline mode" с `TRANSFORMERS_OFFLINE=1`. Там сказано, что с ним скрипт "should succeed without any hanging waiting to timeout". С флагом оба случая без сети работают и дают тот же текст: 3,4 и 4,0 секунды от старта до ответа. Под strace с флагом процесс не делает ни одного вызова `connect()`, даже к DNS. Без флага тот же strace показывает 13 обращений к порту 53, столько же, сколько запросов.

Заодно загрузка быстрее: 2,1 секунды с флагом и 4,2 без него, под strace. Это одиночные прогоны на общей машине, поэтому верю я только направлению.

Модель я по-прежнему держу дома и главная причина не поменялась: промпт остаётся на моей машине. Но "веса лежат на диске" и "в сеть ничего не уходит" оказались 2 разными состояниями. Разница между ними это `TRANSFORMERS_OFFLINE=1` и до этой недели я о нём не знал.

## Чего я не проверял

- Только GPT-2 и только пайплайн на PyTorch. У других моделей другие файлы и число запросов будет другим.
- Число запросов задаёт клиентский код 4.12.3. Коды ответов задаёт сервер, а сервер может поменяться в любой день.
- Сеть я убрал внутри процесса, подменив резолв имён, а не выдернул кабель и не поднял сетевой неймспейс. При настоящем обрыве скрипт может упасть в другом месте, например на рукопожатии TLS.
- Я не смотрел, что хаб хранит из этих запросов и как долго. Я вижу только то, что уходит с моей машины.
- У `datasets` свой `HF_DATASETS_OFFLINE` и его я не мерил.
