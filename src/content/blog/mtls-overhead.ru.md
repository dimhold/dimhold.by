---
title: "Буква m в mTLS обошлась серверу в 21% с RSA и в 189% с ECDSA"
description: "Я измерил, что добавляет к TLS 1.2 сертификат клиента, на OpenSSL 1.1.0g и nginx 1.12.2. Рукопожатие у сервера выросло в 1,21 раза с RSA и в 2,89 раза с ECDSA. А по тикету истёкший сертификат клиента почти 5 минут получал 200 OK."
date: 2018-01-28
lang: ru
translationKey: mtls-overhead
tags: ["networking", "performance"]
---

Процессорное время сервера на одно полное рукопожатие в микросекундах, до и после того, как я потребовал у клиента сертификат:

```
rsa   tls  942   mtls  1137
ec    tls  228   mtls   659
```

Перед прогоном я записал одну догадку на обе строки. Сертификатов вдвое больше, значит и работы у сервера примерно вдвое больше, какие бы ключи ни были. На деле множители 1,21 и 2,89, то есть я промахнулся в обе стороны.

Пришёл я к этому из разговоров про service mesh. В Istio 0.4 есть отдельный файл `istio-auth.yaml`, который включает взаимный TLS между всеми sidecar. Его цена была у меня в голове одним числом. Обычно я отвечал, что дорого стоит рукопожатие, поэтому держите соединения открытыми. Повторял это годами и ни разу не измерил, что именно в нём дорого и кто за это платит.

Тема исхоженная. Адам Лэнгли в 2010 году писал, что на фронтендах Gmail TLS занимает меньше 1% процессора. Венсан Берна в 2011 году сравнивал, насколько неравномерно рукопожатие нагружает клиента и сервер. У Арниса Парсовса на NDSS 2014 была статья о практических проблемах клиентских сертификатов в Apache и браузерах. Мне нужны были числа для 2 сервисов, которые разговаривают друг с другом.

## На чём мерил

OpenSSL 1.1.0g и nginx 1.12.2, оба собраны из исходников, 2 ядра виртуальной машины с аппаратным AES. Только TLS 1.2, потому что 1.3 пока черновик. Везде ECDHE на P-256 и AES128-GCM, вся цепочка целиком либо RSA 2048, либо ECDSA P-256, с одним промежуточным CA.

Тестов 2. Программа на C держит клиента и сервер в одном процессе, гоняет байты через память и считает процессорное время каждой стороны, по 1000 рукопожатий на вариант, медианы 5 прогонов. Контрольный прогон позже дал множители 1,19 и 2,77, так что второму знаку я бы не верил. Потом один рабочий процесс nginx отдаёт по loopback файл в 1 КБ, его процессорное время я беру из `/proc/PID/schedstat`.

## Кто платит

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="Процессорное время полного рукопожатия TLS 1.2, медиана 5 прогонов. Сервер, RSA 2048, TLS: 942 мкс, подписей 1, проверок 0; Сервер, RSA 2048, mTLS: 1137 мкс, подписей 1, проверок 3; Сервер, ECDSA P-256, TLS: 228 мкс, подписей 1, проверок 0; Сервер, ECDSA P-256, mTLS: 659 мкс, подписей 1, проверок 3; Клиент, RSA 2048, TLS: 327 мкс, подписей 0, проверок 3; Клиент, RSA 2048, mTLS: 1110 мкс, подписей 1, проверок 3; Клиент, ECDSA P-256, TLS: 538 мкс, подписей 0, проверок 3; Клиент, ECDSA P-256, mTLS: 609 мкс, подписей 1, проверок 3.">
  <text x="150.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">CPU на полное рукопожатие, мкс</text>
  <text x="8.0" y="42.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">сервер</text>
  <text x="142.0" y="63.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="52" width="227.7" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="383.7" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">942</text>
  <text x="490.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 0</text>
  <text x="142.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="71" width="274.8" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="430.8" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1137</text>
  <text x="490.0" y="82.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 3</text>
  <text x="142.0" y="108.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="97" width="55.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="211.1" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">228</text>
  <text x="490.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 0</text>
  <text x="142.0" y="127.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="116" width="159.4" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="315.4" y="127.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">659</text>
  <text x="490.0" y="127.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 3</text>
  <text x="8.0" y="156.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">клиент</text>
  <text x="142.0" y="177.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="166" width="79.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="235.1" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">327</text>
  <text x="490.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 0, проверок 3</text>
  <text x="142.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="185" width="268.2" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="424.2" y="196.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1110</text>
  <text x="490.0" y="196.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 3</text>
  <text x="142.0" y="222.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="211" width="130.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="286.1" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">538</text>
  <text x="490.0" y="222.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 0, проверок 3</text>
  <text x="142.0" y="241.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="230" width="147.3" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="303.3" y="241.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">609</text>
  <text x="490.0" y="241.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подписей 1, проверок 3</text>
</svg>
<figcaption>Полное рукопожатие внутри одного процесса через буферы в памяти, сертификаты подписаны промежуточным CA. Рядом со столбиком то, что OpenSSL вызвал на самом деле, посчитано перехватом функций.</figcaption>
</figure>

У RSA дорогая операция это подпись. `openssl speed` показывает здесь 747 мкс на подпись и 22 мкс на проверку. У ECDSA наоборот, 47 мкс на подпись и 84 на проверку. Я повесил на эти функции перехватчики и посчитал вызовы. Взаимная аутентификация добавляет клиенту одну подпись, а серверу 3 проверки: доказательство, что ключ у клиента есть, сам клиентский сертификат и промежуточный.

Получается, что с RSA счёт уходит клиенту, его рукопожатие выросло с 327 до 1110 мкс. С ECDSA дорогая половина достаётся серверу. Тратит он всё равно меньше, чем с RSA, 659 против 1137. Для mTLS я бы взял ECDSA. Но вторая моя догадка, что ECDSA дешевле для всех, тоже не подтвердилась. Клиент обычного одностороннего TLS тратит 538 мкс с ECDSA и 327 с RSA.

Сумма при этом не сходится. 3 проверки ECDSA по `openssl speed` это 252 мкс, а серверу добавилось 431. С RSA 66 против 195. Я замерил шаги по отдельности маленькой программой. Разобрать 2 сертификата клиента и проверить цепочку, вместе с 2 проверками подписи внутри, стоит 241 мкс с ECDSA и 87 с RSA. С последней проверкой выходит 325 и 109. Потом OpenSSL разбирает сертификат клиента ещё раз, потому что перед записью тикета заново читает собственную сессию, это 25 и 11 мкс. Всё равно не хватает около 80 мкс с ECDSA и 75 с RSA. На что они ушли, не знаю.

## Что видно в сети

<figure class="fig">
<svg viewBox="0 0 680 312" role="img" aria-label="Дорожки клиента и сервера в рукопожатии TLS 1.2. Пачка 1, клиент: ClientHello. Пачка 2, сервер: ServerHello, Certificate, ServerKeyExchange с подписью, при mTLS ещё CertificateRequest, затем ServerHelloDone. Пачка 3, клиент: при mTLS Certificate открытым текстом, затем ClientKeyExchange, при mTLS CertificateVerify с подписью, ChangeCipherSpec, Finished. Пачка 4, сервер: NewSessionTicket, в котором при mTLS лежит сертификат клиента, ChangeCipherSpec, Finished.">
  <text x="70.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">клиент</text>
  <text x="610.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">сервер</text>
  <line x1="70" y1="26" x2="70" y2="278" class="f-plain"/>
  <line x1="610" y1="26" x2="610" y2="278" class="f-plain"/>
  <text x="340.0" y="42.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ClientHello</text>
  <line x1="74" y1="50" x2="606" y2="50" class="f-line"/>
  <path d="M598 45 L606 50 L598 55" class="f-line" style="fill:none"/>
  <text x="340.0" y="76.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerHello, Certificate</text>
  <text x="340.0" y="92.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerKeyExchange</text>
  <text x="340.0" y="108.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">CertificateRequest</text>
  <text x="340.0" y="124.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ServerHelloDone</text>
  <line x1="606" y1="132" x2="74" y2="132" class="f-line"/>
  <path d="M82 127 L74 132 L82 137" class="f-line" style="fill:none"/>
  <text x="340.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">Certificate: открытым текстом</text>
  <text x="340.0" y="174.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ClientKeyExchange</text>
  <text x="340.0" y="190.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">CertificateVerify</text>
  <text x="340.0" y="206.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ChangeCipherSpec, Finished</text>
  <line x1="74" y1="214" x2="606" y2="214" class="f-line"/>
  <path d="M598 209 L606 214 L598 219" class="f-line" style="fill:none"/>
  <text x="340.0" y="240.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">NewSessionTicket: 1008 / 624 Б, было 160</text>
  <text x="340.0" y="256.0" text-anchor="middle" class="f-mono f-muted" style="font-size:12px">ChangeCipherSpec, Finished</text>
  <line x1="606" y1="264" x2="74" y2="264" class="f-line"/>
  <path d="M82 259 L74 264 L82 269" class="f-line" style="fill:none"/>
  <text x="340.0" y="298.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">TLS: 2504 / 1527 Б, mTLS: 5336 / 2995 Б</text>
</svg>
<figcaption>Полное рукопожатие TLS 1.2. Акцентным цветом то, что появляется или растёт только при взаимной аутентификации, пачек по-прежнему 4. Байты сначала для RSA, потом для ECDSA, цепочка с промежуточным CA.</figcaption>
</figure>

Полное рукопожатие с RSA выросло с 2504 до 5336 байт, с ECDSA с 1527 до 2995. Пачек сообщений как было 4, так и осталось, лишнего похода туда и обратно нет. Но сертификат клиента едет открытым текстом. Я поискал в байтах рукопожатия строку `sa/payments` из его имени и она нашлась в полном рукопожатии mTLS во всех 6 вариантах ключей и цепочек. Любой, кто слушает сеть, прочитает, какой сервис обращается. В черновике TLS 1.3 это сообщение шифруется.

Потом я решил сэкономить и убрал промежуточный сертификат. Сервер ECDSA без клиентских сертификатов стал медленнее, 328 мкс вместо 228, а отправил те же 1,3 КБ. Счётчик показал одну проверку на сервере, который никого не проверяет. Если хранилище доверенных сертификатов задано, а цепочка явно не указана, OpenSSL 1.1.0g на каждом рукопожатии строит её сам, проверяет собственный сертификат и заодно отправляет корневой. С флагом `SSL_MODE_NO_AUTO_CHAIN` вышло 227 мкс и около 900 байт. В nginx этот флаг уже стоит, я нашёл его в `ngx_event_openssl.c`. В моём коде его не было.

## В пересчёте на запрос

Процессорное время nginx на запрос в мкс в зависимости от того, сколько запросов проходит по одному соединению:

| | 1 | 1, по тикету | 10 | 100 | 1000 |
|---|---|---|---|---|---|
| HTTP | 103 | | 48 | 40 | 40 |
| TLS, RSA | 1293 | 251 | 171 | 59 | 50 |
| mTLS, RSA | 1509 | 276 | 200 | 67 | 50 |
| TLS, ECDSA | 529 | 242 | 99 | 53 | 48 |
| mTLS, ECDSA | 987 | 305 | 161 | 59 | 49 |

Третья догадка была такая: при 100 запросах на соединение mTLS добавит к HTTP меньше 10%. Добавил 46% с ECDSA и 66% с RSA. Отдать файл в 1 КБ это почти никакая работа, поэтому примерно 9 мкс шифрования на запрос здесь очень заметны. Рядом с обработчиком, который занят 1 мс, они были бы около 1%. А сама буква m при 1000 запросов пропадает, TLS и mTLS расходятся примерно на 1 мкс и прогоны перекрываются. Каждое сообщение становится длиннее на 29 байт.

Удивила колонка с тикетом. Тикет избавляет от всех подписей и проверок, так что разницу между TLS и mTLS я ждал в пределах 10%. У ECDSA вышло на 26% больше. В тесте через память 78 мкс против 41. Сначала я грешил на размер тикета. Без клиентского сертификата это 160 байт, с ECDSA 624, с RSA 1008, потому что сервер кладёт внутрь весь сертификат клиента. Но у RSA тикет самый большой, а обходится он дешевле, 58 мкс против 39 без сертификата. Расшифровать тикет любого из этих размеров стоит около 1 мкс. Время уходит на разбор сертификата. OpenSSL 1.1.0g сразу же раскодирует из него открытый ключ, даже если он никому не понадобится, 17 мкс для P-256 и 1 для RSA 2048. Вся сессия с сертификатом читается дольше на 25 мкс с ECDSA и на 11 с RSA. Это 70% разницы у ECDSA и чуть больше половины у RSA, остальное я не нашёл.

## Сертификат истёк, 200 OK

Тут мне стало интересно, что сервер с этим сертификатом делает. Я выпустил сертификат на 60 секунд. На 70-й секунде новое соединение получило 400 и `verify=FAILED:certificate has expired` в журнале. В ту же секунду соединение с тикетом получило 200 и `verify=SUCCESS`.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Шкала на 365 секунд. Сертификат клиента действует с 0 до 60 секунд. Новые полные рукопожатия: 200 на 0 и 50 секунде, 400 на 70 и 200. Тикет 1, полученный на 0 секунде: 200 на 0, 50, 70, 200 и 290 секунде, 400 на 315 и 345. Тикет 2, полученный на 50 секунде: 200 на 70, 200, 290, 315 и 345 секунде, 400 на 365.">
  <rect x="170" y="24" width="77.4" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="160.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">сертификат действует</text>
  <line x1="247.4" y1="18" x2="247.4" y2="166" class="f-plain" stroke-dasharray="4 4"/>
  <text x="160.0" y="74.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">новое рукопожатие</text>
  <line x1="170" y1="70" x2="660" y2="70" class="f-plain"/>
  <circle cx="170.0" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <path d="M255.3 65 L265.3 75 M255.3 75 L265.3 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M422.9 65 L432.9 75 M422.9 75 L432.9 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="112.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тикет с 0 с</text>
  <line x1="170" y1="108" x2="660" y2="108" class="f-plain"/>
  <circle cx="170.0" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.3" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="427.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <path d="M571.2 103 L581.2 113 M571.2 113 L581.2 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M609.9 103 L619.9 113 M609.9 113 L619.9 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="150.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тикет с 50 с</text>
  <line x1="170" y1="146" x2="660" y2="146" class="f-plain"/>
  <circle cx="260.3" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="427.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="576.2" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="614.9" cy="146" r="6" style="fill:var(--accent);stroke:none"/>
  <path d="M635.7 141 L645.7 151 M635.7 151 L645.7 141" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="170.0" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="247.4" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="324.7" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="402.1" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <text x="479.5" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="556.8" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="634.2" y="186.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">360</text>
  <text x="160.0" y="186.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">с</text>
</svg>
<figcaption>nginx 1.12.2 с ssl_verify_client on и стандартным ssl_session_timeout в 5 минут. Кружок это 200, крестик 400. Сертификат истёк на 60-й секунде.</figcaption>
</figure>

Так продолжалось, пока не истёк сам тикет, в nginx это по умолчанию 5 минут. Тикет, полученный на 50-й секунде, работал ещё на 345-й, через 285 секунд после конца сертификата. По полю `$ssl_client_verify` в журнале этого не увидеть, потому что nginx показывает результат, сохранённый в сессии. Настоящий срок жизни короткого сертификата я теперь считаю как его собственный плюс `ssl_session_timeout`.

## Чего я не проверял

Сети здесь нет, только loopback, поэтому про задержки ничего. Соотношение подписи и проверки относится к этой сборке и этому процессору. Для обмена ключами я принудительно поставил P-256, хотя 1.1.0 по умолчанию предпочитает X25519. В Envoy стоит BoringSSL, у Go свой `crypto/tls`, ни того ни другого я не мерил и не знаю, проверяют ли они срок ещё раз при возобновлении. Ни CRL, ни OCSP не включал. С ними доля сервера вырастет, но на сколько, не скажу.
