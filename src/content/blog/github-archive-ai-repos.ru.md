---
title: "В 2022 году доля новых репозиториев GitHub про ИИ не выросла. Выросли звёзды"
description: "Я взял по 2 часа каждого дня GH Archive за 2021 и 2022 годы и посчитал новые репозитории GitHub, у которых имя или описание про ИИ. Среди репозиториев с описанием это 1,36% в 2021 году и 1,44% в 2022, то есть скачка нет. Изменились звёзды: генеративные репозитории выросли с 0,10% всех звёзд в 2021 году до 3,07% в декабре 2022."
date: 2022-12-25
lang: ru
translationKey: github-archive-ai-repos
tags: ["open-data", "machine-learning", "statistics"]
---
ChatGPT вышел 3 недели назад. Я взял выборку событий GitHub за этот месяц и 4 из 6 репозиториев, получивших больше всего звёзд, оказались про него. Один это список промптов, остальные это расширение для браузера, неофициальный клиент API и бот для WeChat. Вокруг говорят, что в этом году все начали свой ИИ-проект. Я сам так говорил и не раз. Ни разу не проверял, хотя данные для проверки открыты. GH Archive записывает каждое публичное событие на GitHub, час за часом, с февраля 2011 года.

Вопрос получился простой. Было ли в 2022 году больше новых ИИ-репозиториев, чем в 2021, если считать долю от всех новых?

## Как я считал

Каждый час в GH Archive это один файл gzip с событиями JSON, в 2022 году от 30 до 200 МБ. Когда кто-то создаёт репозиторий, появляется `CreateEvent` с `ref_type`, равным `repository`. В нём лежит описание в том виде, в каком оно было в момент создания. Читать нужно 2 поля, имя и описание. Форки идут отдельным событием и в этот счёт не попадают.

Я взял 2 часа каждого дня, 04:00 и 16:00 UTC, с 1 января 2021 по 24 декабря 2022 года. Первый час приходится на день в Азии, второй на утро в Америке. Всего 1446 часов. 19 из них в GH Archive нет совсем: 2 дня в августе 2021 года и неделя в октябре 2021. Осталось 1427 часов. Диск у меня был почти забит, поэтому небольшой скрипт на Python читал каждый файл потоком через `curl` и `gzip` и сохранял только счётчики.

Репозиторий я отношу к ИИ, если об этом говорит его имя или описание. Слова такие: machine learning, deep learning, neural, NLP, computer vision, TensorFlow, PyTorch, YOLO, отдельное слово "AI" и ещё несколько вроде Keras, BERT или Kaggle. Внутри я выделил группу поменьше для генеративных моделей: GPT, ChatGPT, OpenAI без Gym, Stable Diffusion вместе с интерфейсами вроде AUTOMATIC1111, DreamBooth, DALL-E, Midjourney, Whisper. Whisper это распознавание речи, но он вышел у OpenAI той же осенью и я оставил его в этой группе.

Потом я вручную просмотрел 100 случайных репозиториев 2022 года. 60 из них метка взяла, а 40 поймал более широкий фильтр и метка отбросила. Ошибается метка редко, но пропускает много. Какой-нибудь "house price prediction" или проект на Vision Transformer обычно про машинное обучение, но нужных слов не содержит. Поэтому каждая доля ниже это нижняя граница, посчитанная одинаково для обоих лет.

## Октябрь 2022

Первый результат дал 1,05% новых репозиториев в 2021 году и 0,91% в 2022. Меньше. В октябре 2022 доля упала до 0,65% и у меня уже была готова фраза о том, что все ушли из ИИ во что-то другое.

Потом я посмотрел на сам октябрь. В сентябре в моей выборке 444 234 новых репозитория, в октябре 677 185. Я открыл один час, 10 октября 16:00 UTC. В нём 15 267 новых репозиториев и у 12 856 из них нет описания. 8 самых активных аккаунтов создали за этот час от 125 до 241 репозитория каждый, со случайными именами. 2 из них называются pgslotzaa и PGSLOTTH888, это похоже на тайские сайты онлайн-слотов. Это был спам. И не только в этот час, так выглядит почти весь октябрь.

В 2021 году в выборке 1 434 695 новых репозиториев с описанием, в 2022 году 1 427 656. Почти столько же. Рост GitHub на 25% в моей выборке целиком пришёлся на репозитории без описания, их доля выросла с 61,5% до 69,3%. Поэтому я стал считать долю среди репозиториев с описанием. Я исхожу из того, что спам-аккаунты описаний в основном не пишут. Октябрьский час это подтверждает.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Доля новых публичных репозиториев GitHub, у которых имя или описание про ИИ или машинное обучение, по месяцам с января 2021 по декабрь 2022 года, выборка в 04:00 и 16:00 UTC каждого дня. Среди репозиториев с описанием: янв 21 1,76%, фев 1,72%, мар 1,28%, апр 1,42%, май 1,95%, июн 1,63%, июл 1,11%, авг 0,81%, сен 1,28%, окт 1,30%, ноя 1,30%, дек 1,33%, янв 22 1,33%, фев 1,23%, мар 1,26%, апр 1,46%, май 1,51%, июн 1,36%, июл 1,61%, авг 1,44%, сен 1,46%, окт 1,50%, ноя 1,47%, дек 1,70%. Среди всех новых: янв 21 1,14%, фев 1,11%, мар 0,97%, апр 1,02%, май 1,27%, июн 1,43%, июл 0,98%, авг 0,81%, сен 0,95%, окт 0,99%, ноя 0,95%, дек 1,00%, янв 22 0,96%, фев 0,89%, мар 0,87%, апр 0,97%, май 1,06%, июн 0,93%, июл 0,99%, авг 0,95%, сен 0,87%, окт 0,65%, ноя 0,93%, дек 1,07%. Вторая линия падает до 0,65% в октябре 2022 года, когда спам-аккаунты создали много репозиториев без описания. Первая держится между 0,81% и 1,95%.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,0%</text>
  <line x1="56" y1="151.0" x2="650" y2="151.0" class="f-plain"/>
  <text x="50" y="155.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,5%</text>
  <line x1="56" y1="106.0" x2="650" y2="106.0" class="f-plain"/>
  <text x="50" y="110.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,0%</text>
  <line x1="56" y1="61.0" x2="650" y2="61.0" class="f-plain"/>
  <text x="50" y="65.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,5%</text>
  <line x1="56" y1="16.0" x2="650" y2="16.0" class="f-plain"/>
  <text x="50" y="20.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2,0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">янв 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">апр</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">июл</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">окт</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">янв 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">апр</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">июл</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">окт</text>
  <path d="M56.0,37.2L81.8,41.4L107.7,80.9L133.5,67.9L159.3,20.4L185.1,49.5L211.0,95.9L236.8,122.8L262.6,81.1L288.4,79.4L314.3,79.0L340.1,76.4L365.9,76.2L391.7,85.6L417.6,83.0L443.4,64.3L469.2,60.2L495.0,74.0L520.9,50.9L546.7,66.0L572.5,65.0L598.3,61.3L624.2,63.4L650.0,43.0" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,93.5L81.8,96.5L107.7,109.1L133.5,104.2L159.3,81.8L185.1,67.5L211.0,107.4L236.8,123.3L262.6,110.5L288.4,107.2L314.3,110.2L340.1,105.7L365.9,110.0L391.7,115.7L417.6,117.9L443.4,108.7L469.2,100.2L495.0,112.4L520.9,107.0L546.7,110.7L572.5,117.7L598.3,137.6L624.2,111.9L650.0,99.5" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="37.2" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="41.4" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="80.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="67.9" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="20.4" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="49.5" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="95.9" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="122.8" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="81.1" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="79.4" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="79.0" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="76.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="76.2" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="85.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="83.0" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="64.3" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="60.2" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="74.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="50.9" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="66.0" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="65.0" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="61.3" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="63.4" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="43.0" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="93.5" r="2" class="f-ink"/>
  <circle cx="81.8" cy="96.5" r="2" class="f-ink"/>
  <circle cx="107.7" cy="109.1" r="2" class="f-ink"/>
  <circle cx="133.5" cy="104.2" r="2" class="f-ink"/>
  <circle cx="159.3" cy="81.8" r="2" class="f-ink"/>
  <circle cx="185.1" cy="67.5" r="2" class="f-ink"/>
  <circle cx="211.0" cy="107.4" r="2" class="f-ink"/>
  <circle cx="236.8" cy="123.3" r="2" class="f-ink"/>
  <circle cx="262.6" cy="110.5" r="2" class="f-ink"/>
  <circle cx="288.4" cy="107.2" r="2" class="f-ink"/>
  <circle cx="314.3" cy="110.2" r="2" class="f-ink"/>
  <circle cx="340.1" cy="105.7" r="2" class="f-ink"/>
  <circle cx="365.9" cy="110.0" r="2" class="f-ink"/>
  <circle cx="391.7" cy="115.7" r="2" class="f-ink"/>
  <circle cx="417.6" cy="117.9" r="2" class="f-ink"/>
  <circle cx="443.4" cy="108.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="100.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="112.4" r="2" class="f-ink"/>
  <circle cx="520.9" cy="107.0" r="2" class="f-ink"/>
  <circle cx="546.7" cy="110.7" r="2" class="f-ink"/>
  <circle cx="572.5" cy="117.7" r="2" class="f-ink"/>
  <circle cx="598.3" cy="137.6" r="2" class="f-ink"/>
  <circle cx="624.2" cy="111.9" r="2" class="f-ink"/>
  <circle cx="650.0" cy="99.5" r="2" class="f-ink"/>
  <text x="592.3" y="141.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0,65%</text>
  <text x="644.0" y="35.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1,70%</text>
  <text x="598.3" y="155.6" text-anchor="middle" class="f-label f-muted">спам в октябре</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">среди новых репозиториев с описанием</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">среди всех новых репозиториев</text>
</svg>
<figcaption>GH Archive, CreateEvent, 2 часа в сутки. Декабрь 2022 года посчитан по 24 декабря.</figcaption>
</figure>

С таким знаменателем выходит 1,36% в 2021 году и 1,44% в 2022. За 24 месяца доля скачет от 0,81% до 1,95%. Декабрь 2022 года даёт 1,70%, но в мае 2021 было больше. Если 2022 год и был взрывом ИИ-репозиториев, то в том, что люди создают, я его не вижу.

Я проверял это не первым. OSS Insight в ноябре 2022 года выпустил отчёт за период с января по сентябрь, где ИИ-репозитории найдены по темам (topics). По их выводу, быстрый рост ИИ с открытым кодом пришёлся на 2016 и 2017 годы, а потом стал медленным. У меня только 2 года и про 2016 я ничего сказать не могу, но скачка в 2022 году я тоже не вижу. Их период кончается через 5 недель после выхода весов Stable Diffusion, ещё до ChatGPT.

## Где что-то изменилось

Генеративная группа маленькая, но она движется. В моей выборке это 255 репозиториев за весь 2021 год и 1152 за 2022. 70% репозиториев 2022 года приходится на период с сентября по декабрь.

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Новые репозитории в неделю про GPT, ChatGPT, Stable Diffusion и другие генеративные модели в 2022 году, 14 часов выборки в неделю (12 в последней). По неделям с понедельника: 01-03 7, 01-10 7, 01-17 9, 01-24 5, 01-31 10, 02-07 6, 02-14 6, 02-21 7, 02-28 13, 03-07 10, 03-14 13, 03-21 14, 03-28 5, 04-04 13, 04-11 10, 04-18 9, 04-25 9, 05-02 11, 05-09 14, 05-16 13, 05-23 6, 05-30 7, 06-06 7, 06-13 15, 06-20 9, 06-27 10, 07-04 7, 07-11 14, 07-18 9, 07-25 8, 08-01 9, 08-08 15, 08-15 9, 08-22 27, 08-29 18, 09-05 19, 09-12 25, 09-19 28, 09-26 24, 10-03 25, 10-10 34, 10-17 22, 10-24 19, 10-31 34, 11-07 31, 11-14 26, 11-21 26, 11-28 66, 12-05 155, 12-12 130, 12-19 126. В июле и первой половине августа от 7 до 15 в неделю, после выхода весов Stable Diffusion от 18 до 34, в 3 следующие недели после выхода ChatGPT 30 ноября по 155, 130 и 126.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="56" y1="142.3" x2="650" y2="142.3" class="f-plain"/>
  <text x="50" y="146.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="56" y1="88.5" x2="650" y2="88.5" class="f-plain"/>
  <text x="50" y="92.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="56" y1="34.8" x2="650" y2="34.8" class="f-plain"/>
  <text x="50" y="38.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="56" y="14" class="f-label f-muted">в неделю</text>
  <rect x="57.0" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="68.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="80.3" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="91.9" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="103.6" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="115.2" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="126.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="138.5" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="150.2" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="161.8" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="173.5" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="185.1" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="196.8" y="190.6" width="9.6" height="5.4" rx="1" class="f-box"/>
  <rect x="208.4" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="220.1" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="231.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="243.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="255.0" y="184.2" width="9.6" height="11.8" rx="1" class="f-box"/>
  <rect x="266.6" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="278.3" y="182.0" width="9.6" height="14.0" rx="1" class="f-box"/>
  <rect x="289.9" y="189.6" width="9.6" height="6.4" rx="1" class="f-box"/>
  <rect x="301.6" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="313.2" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="324.9" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="336.5" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="348.2" y="185.3" width="9.6" height="10.8" rx="1" class="f-box"/>
  <rect x="359.8" y="188.5" width="9.6" height="7.5" rx="1" class="f-box"/>
  <rect x="371.5" y="180.9" width="9.6" height="15.1" rx="1" class="f-box"/>
  <rect x="383.1" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="394.8" y="187.4" width="9.6" height="8.6" rx="1" class="f-box"/>
  <rect x="406.4" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="418.1" y="179.9" width="9.6" height="16.1" rx="1" class="f-box"/>
  <rect x="429.7" y="186.3" width="9.6" height="9.7" rx="1" class="f-box"/>
  <rect x="441.4" y="167.0" width="9.6" height="29.0" rx="1" class="f-box"/>
  <rect x="453.0" y="176.7" width="9.6" height="19.3" rx="1" class="f-box"/>
  <rect x="464.6" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="476.3" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="487.9" y="165.9" width="9.6" height="30.1" rx="1" class="f-box"/>
  <rect x="499.6" y="170.2" width="9.6" height="25.8" rx="1" class="f-box"/>
  <rect x="511.2" y="169.1" width="9.6" height="26.9" rx="1" class="f-box"/>
  <rect x="522.9" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="534.5" y="172.3" width="9.6" height="23.7" rx="1" class="f-box"/>
  <rect x="546.2" y="175.6" width="9.6" height="20.4" rx="1" class="f-box"/>
  <rect x="557.8" y="159.4" width="9.6" height="36.6" rx="1" class="f-box"/>
  <rect x="569.5" y="162.7" width="9.6" height="33.3" rx="1" class="f-box"/>
  <rect x="581.1" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="592.8" y="168.1" width="9.6" height="27.9" rx="1" class="f-box"/>
  <rect x="604.4" y="125.0" width="9.6" height="71.0" rx="1" class="f-accent"/>
  <rect x="616.1" y="29.4" width="9.6" height="166.6" rx="1" class="f-accent"/>
  <rect x="627.7" y="56.3" width="9.6" height="139.8" rx="1" class="f-accent"/>
  <rect x="639.4" y="60.6" width="9.6" height="135.4" rx="1" class="f-accent"/>
  <line x1="440.4" y1="34" x2="440.4" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="436.4" y="30" text-anchor="end" class="f-label f-muted">веса Stable Diffusion</text>
  <line x1="606.7" y1="34" x2="606.7" y2="196" class="f-plain" style="stroke-dasharray:3 3"/>
  <text x="602.7" y="30" text-anchor="end" class="f-label f-muted">ChatGPT</text>
  <text x="56.0" y="212" class="f-mono f-muted" style="font-size:11px">янв</text>
  <text x="160.8" y="212" class="f-mono f-muted" style="font-size:11px">мар</text>
  <text x="254.0" y="212" class="f-mono f-muted" style="font-size:11px">май</text>
  <text x="358.8" y="212" class="f-mono f-muted" style="font-size:11px">июл</text>
  <text x="463.6" y="212" class="f-mono f-muted" style="font-size:11px">сен</text>
  <text x="568.5" y="212" class="f-mono f-muted" style="font-size:11px">ноя</text>
</svg>
<figcaption>Неделя начинается с понедельника. В последнем столбце 12 часов выборки вместо 14.</figcaption>
</figure>

В июле и первой половине августа их было от 7 до 15 в неделю на мои 14 часов выборки. Stable Diffusion выложил веса 22 августа и с этой недели их стало от 18 до 34. ChatGPT вышел 30 ноября. На эту неделю приходится 66, на следующие 3 недели 155, 130 и 126. В последней из них только 12 часов, потому что мои данные кончаются 24 декабря. В декабре генеративная группа это 460 из 3268 ИИ-репозиториев, 14%. От всего, что создано на GitHub, это по-прежнему 0,15%.

Звезда в GH Archive это `WatchEvent` и описания у неё нет. Поэтому здесь я размечал репозитории по полному имени вместе с владельцем. Так в счёт попадает `openai/whisper`.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Доля всех звёзд GitHub в выборке, которая досталась ИИ-репозиториям, по месяцам с января 2021 по декабрь 2022 года. Генеративные репозитории: янв 21 0,17%, фев 0,10%, мар 0,14%, апр 0,09%, май 0,10%, июн 0,06%, июл 0,12%, авг 0,09%, сен 0,05%, окт 0,06%, ноя 0,08%, дек 0,09%, янв 22 0,06%, фев 0,09%, мар 0,05%, апр 0,20%, май 0,20%, июн 0,52%, июл 0,19%, авг 0,64%, сен 1,43%, окт 1,08%, ноя 0,75%, дек 3,07%. Остальные репозитории ИИ и машинного обучения: янв 21 2,91%, фев 2,63%, мар 2,72%, апр 2,65%, май 2,40%, июн 2,68%, июл 2,82%, авг 2,62%, сен 2,70%, окт 2,35%, ноя 2,70%, дек 2,32%, янв 22 2,28%, фев 2,16%, мар 2,45%, апр 2,46%, май 2,60%, июн 2,44%, июл 2,33%, авг 2,20%, сен 2,26%, окт 2,18%, ноя 2,21%, дек 2,32%. Вторая линия держится между 2,16% и 2,91%. Первая около 0,1% в 2021 году, 1,43% в сентябре 2022 и 3,07% в декабре 2022.">
  <line x1="56" y1="196.0" x2="650" y2="196.0" class="f-plain"/>
  <text x="50" y="200.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0,0%</text>
  <line x1="56" y1="144.6" x2="650" y2="144.6" class="f-plain"/>
  <text x="50" y="148.6" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1,0%</text>
  <line x1="56" y1="93.1" x2="650" y2="93.1" class="f-plain"/>
  <text x="50" y="97.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2,0%</text>
  <line x1="56" y1="41.7" x2="650" y2="41.7" class="f-plain"/>
  <text x="50" y="45.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">3,0%</text>
  <text x="56.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">янв 21</text>
  <text x="133.5" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">апр</text>
  <text x="211.0" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">июл</text>
  <text x="288.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">окт</text>
  <text x="365.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">янв 22</text>
  <text x="443.4" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">апр</text>
  <text x="520.9" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">июл</text>
  <text x="598.3" y="212" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">окт</text>
  <path d="M56.0,187.3L81.8,190.9L107.7,188.9L133.5,191.5L159.3,191.0L185.1,192.9L211.0,190.0L236.8,191.6L262.6,193.5L288.4,193.0L314.3,191.9L340.1,191.4L365.9,193.1L391.7,191.6L417.6,193.2L443.4,185.9L469.2,185.8L495.0,169.0L520.9,186.4L546.7,162.8L572.5,122.6L598.3,140.6L624.2,157.6L650.0,38.2" class="f-line" style="stroke:var(--accent);stroke-width:2"/>
  <path d="M56.0,46.6L81.8,60.7L107.7,56.2L133.5,59.9L159.3,72.4L185.1,58.1L211.0,50.8L236.8,61.2L262.6,57.0L288.4,75.1L314.3,57.1L340.1,76.9L365.9,78.7L391.7,84.9L417.6,70.2L443.4,69.7L469.2,62.2L495.0,70.7L520.9,76.3L546.7,83.0L572.5,79.8L598.3,83.7L624.2,82.6L650.0,76.9" class="f-line" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <circle cx="56.0" cy="187.3" r="2.5" class="f-accent"/>
  <circle cx="81.8" cy="190.9" r="2.5" class="f-accent"/>
  <circle cx="107.7" cy="188.9" r="2.5" class="f-accent"/>
  <circle cx="133.5" cy="191.5" r="2.5" class="f-accent"/>
  <circle cx="159.3" cy="191.0" r="2.5" class="f-accent"/>
  <circle cx="185.1" cy="192.9" r="2.5" class="f-accent"/>
  <circle cx="211.0" cy="190.0" r="2.5" class="f-accent"/>
  <circle cx="236.8" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="262.6" cy="193.5" r="2.5" class="f-accent"/>
  <circle cx="288.4" cy="193.0" r="2.5" class="f-accent"/>
  <circle cx="314.3" cy="191.9" r="2.5" class="f-accent"/>
  <circle cx="340.1" cy="191.4" r="2.5" class="f-accent"/>
  <circle cx="365.9" cy="193.1" r="2.5" class="f-accent"/>
  <circle cx="391.7" cy="191.6" r="2.5" class="f-accent"/>
  <circle cx="417.6" cy="193.2" r="2.5" class="f-accent"/>
  <circle cx="443.4" cy="185.9" r="2.5" class="f-accent"/>
  <circle cx="469.2" cy="185.8" r="2.5" class="f-accent"/>
  <circle cx="495.0" cy="169.0" r="2.5" class="f-accent"/>
  <circle cx="520.9" cy="186.4" r="2.5" class="f-accent"/>
  <circle cx="546.7" cy="162.8" r="2.5" class="f-accent"/>
  <circle cx="572.5" cy="122.6" r="2.5" class="f-accent"/>
  <circle cx="598.3" cy="140.6" r="2.5" class="f-accent"/>
  <circle cx="624.2" cy="157.6" r="2.5" class="f-accent"/>
  <circle cx="650.0" cy="38.2" r="2.5" class="f-accent"/>
  <circle cx="56.0" cy="46.6" r="2" class="f-ink"/>
  <circle cx="81.8" cy="60.7" r="2" class="f-ink"/>
  <circle cx="107.7" cy="56.2" r="2" class="f-ink"/>
  <circle cx="133.5" cy="59.9" r="2" class="f-ink"/>
  <circle cx="159.3" cy="72.4" r="2" class="f-ink"/>
  <circle cx="185.1" cy="58.1" r="2" class="f-ink"/>
  <circle cx="211.0" cy="50.8" r="2" class="f-ink"/>
  <circle cx="236.8" cy="61.2" r="2" class="f-ink"/>
  <circle cx="262.6" cy="57.0" r="2" class="f-ink"/>
  <circle cx="288.4" cy="75.1" r="2" class="f-ink"/>
  <circle cx="314.3" cy="57.1" r="2" class="f-ink"/>
  <circle cx="340.1" cy="76.9" r="2" class="f-ink"/>
  <circle cx="365.9" cy="78.7" r="2" class="f-ink"/>
  <circle cx="391.7" cy="84.9" r="2" class="f-ink"/>
  <circle cx="417.6" cy="70.2" r="2" class="f-ink"/>
  <circle cx="443.4" cy="69.7" r="2" class="f-ink"/>
  <circle cx="469.2" cy="62.2" r="2" class="f-ink"/>
  <circle cx="495.0" cy="70.7" r="2" class="f-ink"/>
  <circle cx="520.9" cy="76.3" r="2" class="f-ink"/>
  <circle cx="546.7" cy="83.0" r="2" class="f-ink"/>
  <circle cx="572.5" cy="79.8" r="2" class="f-ink"/>
  <circle cx="598.3" cy="83.7" r="2" class="f-ink"/>
  <circle cx="624.2" cy="82.6" r="2" class="f-ink"/>
  <circle cx="650.0" cy="76.9" r="2" class="f-ink"/>
  <text x="566.5" y="114.6" text-anchor="end" class="f-mono f-ink" style="font-size:11px">1,43%</text>
  <text x="644.0" y="30.2" text-anchor="end" class="f-mono f-ink" style="font-size:11px">3,07%</text>
  <line x1="56" y1="228" x2="78" y2="228" style="stroke:var(--accent);stroke-width:2"/>
  <text x="86" y="232" class="f-label f-muted">генеративные: GPT, ChatGPT, Stable Diffusion</text>
  <line x1="56" y1="246" x2="78" y2="246" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="86" y="250" class="f-label f-muted">остальные ИИ и машинное обучение</text>
</svg>
<figcaption>WatchEvent в GH Archive, 2 часа в сутки. Метка по владельцу и имени репозитория.</figcaption>
</figure>

Обычные репозитории машинного обучения получили 2,64% всех звёзд выборки в 2021 году и 2,32% в 2022. Роста нет совсем. Генеративные получили 0,10% в 2021 году, 1,43% в сентябре 2022 и 3,07% в декабре. В сентябре больше всего звёзд среди генеративных было у `CompVis/stable-diffusion` и `openai/whisper`. Кода ChatGPT на GitHub нет. В декабре первым идёт `f/awesome-chatgpt-prompts`, список текстовых промптов.

В декабре звёзды в моей выборке получили 699 генеративных репозиториев. Вместе у них 3,07% всех звёзд и первые 3 из них держат 22% этой доли.

## Чего я не проверял

- Темы (topics). OSS Insight считал по ним, я по именам и описаниям. Описание, добавленное после создания, мне не видно.
- 22 часа каждого дня. Мои числа это счёт по выборке. Настоящие числа намного больше и пересчитывать их на полные сутки я не пытался.
- Звёзды репозиториев, которые как ИИ помечает только имя владельца. Полный список я хранил только для имён, прошедших широкий фильтр, плюс топ-300 каждого часа.
- Приватные репозитории. GH Archive видит только публичные события.
- Не одни ли и те же люди стоят за этими 1,4%. Студент, который каждую неделю создаёт новый `ML-Homework-3`, считается каждую неделю.

Декабрь ещё не кончился. Если недели ChatGPT продолжатся в январе, доля среди новых репозиториев наконец сдвинется. Посмотрим.
