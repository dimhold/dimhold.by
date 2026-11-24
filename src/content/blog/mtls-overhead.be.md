---
title: "Літара m у mTLS каштавала серверу 21% з RSA і 189% з ECDSA"
description: "Я памераў, што дадае да TLS 1.2 сертыфікат кліента, на OpenSSL 1.1.0g і nginx 1.12.2. Рукапацісканне ў сервера вырасла ў 1,21 раза з RSA і ў 2,89 раза з ECDSA. А па тыкеце пратэрмінаваны сертыфікат кліента амаль 5 хвілін атрымліваў 200 OK."
date: 2018-01-28
lang: be
translationKey: mtls-overhead
tags: ["networking", "performance"]
---

Працэсарны час сервера на адно поўнае рукапацісканне ў мікрасекундах, да і пасля таго, як я запатрабаваў ад кліента сертыфікат:

```
rsa   tls  942   mtls  1137
ec    tls  228   mtls   659
```

Перад прагонам я запісаў адну здагадку на абодва радкі. Сертыфікатаў удвая больш, значыць і працы ў сервера прыкладна ўдвая больш, якія б ключы ні былі. Насамрэч множнікі 1,21 і 2,89, так што я памыліўся ў абодва бакі.

Прыйшоў я да гэтага з размоў пра service mesh. У Istio 0.4 ёсць асобны файл `istio-auth.yaml`, які ўключае ўзаемны TLS паміж усімі sidecar. Яго кошт сядзеў у мяне ў галаве адным лікам. Звычайна я адказваў, што дарагое само рукапацісканне, таму трымайце злучэнні адкрытымі. Паўтараў гэта гадамі і ні разу не памераў, што менавіта ў ім дарагое і хто за гэта плаціць.

Сцежка тут даўно пратаптаная. Адам Лэнглі ў 2010 годзе пісаў, што на франтэндах Gmail TLS займае менш за 1% працэсара. Венсан Берна ў 2011 годзе параўноўваў, як нераўнамерна рукапацісканне нагружае кліента і сервер. У Арніса Парсаўса на NDSS 2014 быў артыкул пра практычныя праблемы кліенцкіх сертыфікатаў у Apache і браўзерах. Мне былі патрэбныя лікі для 2 сэрвісаў, якія размаўляюць паміж сабой.

## На чым мераў

OpenSSL 1.1.0g і nginx 1.12.2, абодва сабраныя з зыходнага кода, 2 ядры віртуальнай машыны з апаратным AES. Толькі TLS 1.2, бо 1.3 пакуль чарнавік. Усюды ECDHE на P-256 і AES128-GCM, увесь ланцужок цалкам або RSA 2048, або ECDSA P-256, з адным прамежкавым CA.

Тэстаў 2. Праграма на C трымае кліента і сервер у адным працэсе, ганяе байты праз памяць і лічыць працэсарны час кожнага боку, па 1000 рукапацісканняў на варыянт, медыяны 5 прагонаў. Кантрольны прагон пазней даў множнікі 1,19 і 2,77, так што другому знаку я б не верыў. Потым адзін рабочы працэс nginx аддае праз loopback файл у 1 КБ, яго працэсарны час я бяру з `/proc/PID/schedstat`.

## Хто плаціць

<figure class="fig">
<svg viewBox="0 0 680 264" role="img" aria-label="Працэсарны час поўнага рукапаціскання TLS 1.2, медыяна 5 прагонаў. Сервер, RSA 2048, TLS: 942 мкс, подпісаў 1, праверак 0; Сервер, RSA 2048, mTLS: 1137 мкс, подпісаў 1, праверак 3; Сервер, ECDSA P-256, TLS: 228 мкс, подпісаў 1, праверак 0; Сервер, ECDSA P-256, mTLS: 659 мкс, подпісаў 1, праверак 3; Кліент, RSA 2048, TLS: 327 мкс, подпісаў 0, праверак 3; Кліент, RSA 2048, mTLS: 1110 мкс, подпісаў 1, праверак 3; Кліент, ECDSA P-256, TLS: 538 мкс, подпісаў 0, праверак 3; Кліент, ECDSA P-256, mTLS: 609 мкс, подпісаў 1, праверак 3.">
  <text x="150.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:11px">CPU на поўнае рукапацісканне, мкс</text>
  <text x="8.0" y="42.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">сервер</text>
  <text x="142.0" y="63.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="52" width="227.7" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="383.7" y="63.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">942</text>
  <text x="490.0" y="63.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 0</text>
  <text x="142.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="71" width="274.8" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="430.8" y="82.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1137</text>
  <text x="490.0" y="82.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 3</text>
  <text x="142.0" y="108.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="97" width="55.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="211.1" y="108.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">228</text>
  <text x="490.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 0</text>
  <text x="142.0" y="127.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="116" width="159.4" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="315.4" y="127.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">659</text>
  <text x="490.0" y="127.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 3</text>
  <text x="8.0" y="156.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">кліент</text>
  <text x="142.0" y="177.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA TLS</text>
  <rect x="150" y="166" width="79.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="235.1" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">327</text>
  <text x="490.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 0, праверак 3</text>
  <text x="142.0" y="196.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">RSA mTLS</text>
  <rect x="150" y="185" width="268.2" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="424.2" y="196.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">1110</text>
  <text x="490.0" y="196.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 3</text>
  <text x="142.0" y="222.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA TLS</text>
  <rect x="150" y="211" width="130.1" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="286.1" y="222.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">538</text>
  <text x="490.0" y="222.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 0, праверак 3</text>
  <text x="142.0" y="241.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">ECDSA mTLS</text>
  <rect x="150" y="230" width="147.3" height="14" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="303.3" y="241.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">609</text>
  <text x="490.0" y="241.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">подпісаў 1, праверак 3</text>
</svg>
<figcaption>Поўнае рукапацісканне ўнутры аднаго працэсу праз буферы ў памяці, сертыфікаты падпісаныя прамежкавым CA. Побач са слупком тое, што OpenSSL выклікаў насамрэч, падлічана перахопам функцый.</figcaption>
</figure>

У RSA дарагая аперацыя гэта подпіс. `openssl speed` паказвае тут 747 мкс на подпіс і 22 мкс на праверку. У ECDSA наадварот, 47 мкс на подпіс і 84 на праверку. Я павесіў на гэтыя функцыі перахопнікі і падлічыў выклікі. Узаемная аўтэнтыфікацыя дадае кліенту адзін подпіс, а серверу 3 праверкі: доказ, што ключ у кліента ёсць, сам кліенцкі сертыфікат і прамежкавы.

Выходзіць, што з RSA плаціць кліент, яго рукапацісканне вырасла з 327 да 1110 мкс. З ECDSA дарагая палова дастаецца серверу. Траціць ён усё роўна менш, чым з RSA, 659 супраць 1137. Для mTLS я б узяў ECDSA. Але другая мая здагадка, што ECDSA таннейшы для ўсіх, таксама не спраўдзілася. Кліент звычайнага аднабаковага TLS траціць 538 мкс з ECDSA і 327 з RSA.

Сума пры гэтым не сходзіцца. 3 праверкі ECDSA паводле `openssl speed` гэта 252 мкс, а серверу дадалося 431. З RSA 66 супраць 195. Я памераў крокі паасобку маленькай праграмай. Разабраць 2 сертыфікаты кліента і праверыць ланцужок, разам з 2 праверкамі подпісу ўсярэдзіне, каштуе 241 мкс з ECDSA і 87 з RSA. З апошняй праверкай выходзіць 325 і 109. Потым OpenSSL разбірае сертыфікат кліента яшчэ раз, бо перад запісам тыкета нанова чытае ўласную сесію, гэта 25 і 11 мкс. Усё роўна не хапае каля 80 мкс з ECDSA і 75 з RSA. На што яны пайшлі, не ведаю.

## Што відаць у сетцы

<figure class="fig">
<svg viewBox="0 0 680 312" role="img" aria-label="Дарожкі кліента і сервера ў рукапацісканні TLS 1.2. Пачка 1, кліент: ClientHello. Пачка 2, сервер: ServerHello, Certificate, ServerKeyExchange з подпісам, пры mTLS яшчэ CertificateRequest, потым ServerHelloDone. Пачка 3, кліент: пры mTLS Certificate адкрытым тэкстам, потым ClientKeyExchange, пры mTLS CertificateVerify з подпісам, ChangeCipherSpec, Finished. Пачка 4, сервер: NewSessionTicket, у якім пры mTLS ляжыць сертыфікат кліента, ChangeCipherSpec, Finished.">
  <text x="70.0" y="18.0" text-anchor="middle" class="f-label f-ink" style="font-size:11px">кліент</text>
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
  <text x="340.0" y="158.0" text-anchor="middle" class="f-mono f-accent" style="font-size:12px">Certificate: адкрытым тэкстам</text>
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
<figcaption>Поўнае рукапацісканне TLS 1.2. Акцэнтным колерам тое, што з'яўляецца або расце толькі пры ўзаемнай аўтэнтыфікацыі, пачак па-ранейшаму 4. Байты спачатку для RSA, потым для ECDSA, ланцужок з прамежкавым CA.</figcaption>
</figure>

Поўнае рукапацісканне з RSA вырасла з 2504 да 5336 байтаў, з ECDSA з 1527 да 2995. Пачак паведамленняў як было 4, так і засталося, лішняй паездкі туды і назад няма. Але сертыфікат кліента едзе адкрытым тэкстам. Я пашукаў у байтах рукапаціскання радок `sa/payments` з яго імя і ён знайшоўся ў поўным рукапацісканні mTLS ва ўсіх 6 варыянтах ключоў і ланцужкоў. Кожны, хто слухае сетку, прачытае, які сэрвіс звяртаецца. У чарнавіку TLS 1.3 гэтае паведамленне шыфруецца.

Потым я вырашыў зэканоміць і прыбраў прамежкавы сертыфікат. Сервер ECDSA без кліенцкіх сертыфікатаў стаў павольнейшым, 328 мкс замест 228, а адправіў тыя ж 1,3 КБ. Лічыльнік паказаў адну праверку на серверы, які нікога не правярае. Калі сховішча давераных сертыфікатаў ёсць, а ланцужок яўна не зададзены, OpenSSL 1.1.0g пры кожным рукапацісканні будуе яго сам, правярае ўласны сертыфікат і заадно адпраўляе каранёвы. Са сцягам `SSL_MODE_NO_AUTO_CHAIN` выйшла 227 мкс і каля 900 байтаў. У nginx гэты сцяг ужо стаіць, я знайшоў яго ў `ngx_event_openssl.c`. У маім кодзе яго не было.

## У разліку на запыт

Працэсарны час nginx на запыт у мкс у залежнасці ад таго, колькі запытаў праходзіць па адным злучэнні:

| | 1 | 1, па тыкеце | 10 | 100 | 1000 |
|---|---|---|---|---|---|
| HTTP | 103 | | 48 | 40 | 40 |
| TLS, RSA | 1293 | 251 | 171 | 59 | 50 |
| mTLS, RSA | 1509 | 276 | 200 | 67 | 50 |
| TLS, ECDSA | 529 | 242 | 99 | 53 | 48 |
| mTLS, ECDSA | 987 | 305 | 161 | 59 | 49 |

Трэцяя здагадка была такая: пры 100 запытах на злучэнне mTLS дадасць да HTTP менш за 10%. Дадаў 46% з ECDSA і 66% з RSA. Аддаць файл у 1 КБ гэта амаль ніякая праца, таму прыкладна 9 мкс шыфравання на запыт тут вельмі прыкметныя. Побач з апрацоўшчыкам, які заняты 1 мс, яны былі б каля 1%. А сама літара m пры 1000 запытаў знікае, TLS і mTLS разыходзяцца прыкладна на 1 мкс і прагоны перакрываюцца. Кожнае паведамленне робіцца даўжэйшым на 29 байтаў.

Здзівіў слупок з тыкетам. Тыкет пазбаўляе ад усіх подпісаў і праверак, так што розніцу паміж TLS і mTLS я чакаў у межах 10%. У ECDSA выйшла на 26% больш. У тэсце праз памяць 78 мкс супраць 41. Спачатку я вінаваціў памер тыкета. Без кліенцкага сертыфіката гэта 160 байтаў, з ECDSA 624, з RSA 1008, бо сервер кладзе ўнутр увесь сертыфікат кліента. Але ў RSA тыкет самы вялікі, а абыходзіцца ён танней, 58 мкс супраць 39 без сертыфіката. Расшыфраваць тыкет любога з гэтых памераў каштуе каля 1 мкс. Час ідзе на разбор сертыфіката. OpenSSL 1.1.0g адразу ж раскадоўвае з яго адкрыты ключ, нават калі ён нікому не спатрэбіцца, 17 мкс для P-256 і 1 для RSA 2048. Уся сесія з сертыфікатам чытаецца даўжэй на 25 мкс з ECDSA і на 11 з RSA. Гэта 70% розніцы ў ECDSA і крыху больш за палову ў RSA, астатняга я не знайшоў.

## Тэрмін сертыфіката скончыўся, 200 OK

Тут мне стала цікава, што сервер з гэтым сертыфікатам робіць. Я выпусціў сертыфікат на 60 секунд. На 70-й секундзе новае злучэнне атрымала 400 і `verify=FAILED:certificate has expired` у журнале. У тую ж секунду злучэнне з тыкетам атрымала 200 і `verify=SUCCESS`.

<figure class="fig">
<svg viewBox="0 0 680 196" role="img" aria-label="Шкала на 365 секунд. Сертыфікат кліента дзейнічае з 0 да 60 секунд. Новыя поўныя рукапацісканні: 200 на 0 і 50 секундзе, 400 на 70 і 200. Тыкет 1, атрыманы на 0 секундзе: 200 на 0, 50, 70, 200 і 290 секундзе, 400 на 315 і 345. Тыкет 2, атрыманы на 50 секундзе: 200 на 70, 200, 290, 315 і 345 секундзе, 400 на 365.">
  <rect x="170" y="24" width="77.4" height="14" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="160.0" y="35.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">сертыфікат дзейнічае</text>
  <line x1="247.4" y1="18" x2="247.4" y2="166" class="f-plain" stroke-dasharray="4 4"/>
  <text x="160.0" y="74.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">новае рукапацісканне</text>
  <line x1="170" y1="70" x2="660" y2="70" class="f-plain"/>
  <circle cx="170.0" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="70" r="6" style="fill:var(--ink);stroke:none"/>
  <path d="M255.3 65 L265.3 75 M255.3 75 L265.3 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M422.9 65 L432.9 75 M422.9 75 L432.9 65" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="112.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тыкет з 0 с</text>
  <line x1="170" y1="108" x2="660" y2="108" class="f-plain"/>
  <circle cx="170.0" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="234.5" cy="108" r="6" style="fill:var(--ink);stroke:none"/>
  <circle cx="260.3" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="427.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.9" cy="108" r="6" style="fill:var(--accent);stroke:none"/>
  <path d="M571.2 103 L581.2 113 M571.2 113 L581.2 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <path d="M609.9 103 L619.9 113 M609.9 113 L619.9 103" style="stroke:var(--ink);stroke-width:2;fill:none"/>
  <text x="160.0" y="150.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">тыкет з 50 с</text>
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
<figcaption>nginx 1.12.2 з ssl_verify_client on і стандартным ssl_session_timeout у 5 хвілін. Кружок гэта 200, крыжык 400. Тэрмін сертыфіката скончыўся на 60-й секундзе.</figcaption>
</figure>

Так цягнулася, пакуль не скончыўся тэрмін самога тыкета, у nginx гэта 5 хвілін, калі нічога не мяняць. Тыкет, атрыманы на 50-й секундзе, працаваў яшчэ на 345-й, праз 285 секунд пасля канца сертыфіката. Па полі `$ssl_client_verify` у журнале гэтага не ўбачыць, бо nginx паказвае вынік, захаваны ў сесіі. Сапраўдны тэрмін жыцця кароткага сертыфіката я цяпер лічу як яго ўласны плюс `ssl_session_timeout`.

## Чаго я не правяраў

Сеткі тут няма, толькі loopback, таму пра затрымкі нічога. Суадносіны подпісу і праверкі адносяцца да гэтай зборкі і гэтага працэсара. Для абмену ключамі я прымусова паставіў P-256, хоць сам 1.1.0 спачатку прапануе X25519. У Envoy стаіць BoringSSL, у Go свой `crypto/tls`, ні таго ні другога я не мераў і не ведаю, ці правяраюць яны тэрмін яшчэ раз пры аднаўленні сесіі. Ні CRL, ні OCSP не ўключаў. З імі частка сервера вырасце, але на колькі, не скажу.
