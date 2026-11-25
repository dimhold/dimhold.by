---
title: "В таблице 2000 платежей без дублей, а в банке 2592 списания"
description: "Я собрал 8 рецептов платежа с ключом идемпотентности на PostgreSQL 9.3, убивал процесс между шагами и считал списания в банке. С уникальным индексом в таблице 2000 чистых строк, а в банке 2592 списания. Одно списание на платёж и ответ каждому клиенту дал только рецепт, в котором дубль отсекает сам банк."
date: 2014-11-02
lang: ru
translationKey: idempotent-payment
tags: ["databases", "reliability", "debugging"]
---

`db_rows: 2000, client_ok: 2000, charges: 2592`. Первые 2 числа видит мой сервис: 2000 строк с уникальным индексом по ключу и 2000 клиентов, получивших свой ответ 200. Третье число взято из игрушечного банка. 478 платежей он списал больше одного раза, самый невезучий 5 раз.

На вопрос, как не списать деньги дважды при повторе запроса, я всегда отвечал одинаково: пусть клиент пришлёт ключ, а на ключ повесьте уникальный индекс. Что при этом происходит там, где лежат деньги, я ни разу не считал. В этот раз я верил только списку списаний в банке.

Тема старая. Пэт Хелланд ещё в 2012 году написал статью "Idempotence Is Not a Medical Condition" про системы, в которых сообщение может прийти не один раз. RFC 7230, вышедший в июне, запрещает клиенту самому повторять POST, если тот не знает, что это безопасно или что первый запрос не был выполнен. В EC2 у RunInstances давно есть ClientToken. Ни один рецепт ниже придумал не я, мне хотелось увидеть, где каждый из них ломается.

## На чём мерил

PostgreSQL 9.3.5, Python 3.4.2 и psycopg2 2.5.4, всё на одной машине с Linux. Платёжный сервис это многопоточный HTTP-сервер в одном процессе. Банк живёт в другом процессе: он спит, посередине сна записывает списание, потом отвечает. Клиент шлёт в заголовке один и тот же ключ, пока не увидит 200. Падение настоящее, SIGKILL в выбранной строке, после чего родительский процесс сразу порождает новый рабочий.

Рецептов вышло 8:

- A, без ключа.
- B, SELECT по ключу, списание, INSERT.
- S, то же самое под SERIALIZABLE.
- C, рецепт B с уникальным индексом по ключу.
- D, сначала INSERT ключа, потом списание, всё в одной транзакции.
- E, INSERT и COMMIT до списания. На строку `started` сервис отвечает 409.
- F, рецепт E с блокировкой строки. Кто получил блокировку на строке `started`, спрашивает банк про этот ключ и списывает, только если там пусто.
- G, та же блокировка, но списание просто повторяется с той же ссылкой, а дубль отбрасывает банк.

Upsert в 9.3 нет, поэтому "сначала INSERT" означает ловить ошибку 23505.

## Где умирает процесс

В каждой клетке 20 платежей, одно убийство на первой попытке, дальше клиент повторяет запрос.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Списаний в банке на 20 платежей для 7 рецептов и 6 мест, где убивают процесс. A: 20, 20, 40, 40, 40, 40. B: 20, 20, 40, 40, 40, 20. C: 20, 20, 40, 40, 40, 20. D: 20, 20, 40, 40, 40, 20. E: 20, 0, 20, 20, 20, 20. F: 20, 20, 40, 20, 20, 20. G: 20, 20, 20, 20, 20, 20.">
  <text x="258.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">на</text>
  <text x="258.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">входе</text>
  <text x="334.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">до</text>
  <text x="334.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">банка</text>
  <text x="410.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">во время</text>
  <text x="410.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">вызова</text>
  <text x="486.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">после</text>
  <text x="486.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">банка</text>
  <text x="562.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">до</text>
  <text x="562.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="638.0" y="18.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">после</text>
  <text x="638.0" y="33.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">COMMIT</text>
  <text x="4.0" y="64.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="64.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">без ключа</text>
  <rect x="222.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="48.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="48.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="638.0" y="64.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <text x="4.0" y="92.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="92.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, списание, INSERT</text>
  <rect x="222.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="76.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="76.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="92.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="120.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="120.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + уникальный индекс</text>
  <rect x="222.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="104.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="104.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="120.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="148.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, списание, COMMIT</text>
  <rect x="222.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="486.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="526.0" y="132.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="562.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="602.0" y="132.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="148.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="176.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="176.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, списание</text>
  <rect x="222.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="300" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="334.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <rect x="374.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="376" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="410.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="452" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="486.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <rect x="528" y="162" width="68" height="20" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>
  <text x="562.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="160.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="176.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="204.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="204.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блокировка + вопрос</text>
  <rect x="222.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="188.0" width="72.0" height="24.0" style="fill:var(--accent);opacity:0.7;stroke:none"/>
  <text x="410.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">40</text>
  <rect x="450.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="188.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <text x="4.0" y="232.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="232.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блокировка + ссылка</text>
  <rect x="222.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="258.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="298.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="334.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="374.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="410.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="450.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="486.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="526.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="562.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
  <rect x="602.0" y="216.0" width="72.0" height="24.0" style="fill:var(--muted);opacity:0.1;stroke:none"/>
  <text x="638.0" y="232.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">20</text>
</svg>
<figcaption>Сколько списаний увидел банк на 20 платежей, если процесс один раз убит в этом месте, а клиент повторил запрос. Правильно 20. Цветом отмечены двойные списания, рамкой клетки, где клиент остался с 409.</figcaption>
</figure>

У B, C и D строки одинаковые. Ключ выручает ровно в одном месте: когда процесс умер после COMMIT и клиент не дождался ответа. Если он умер между ответом банка и COMMIT, все 20 платежей списаны дважды, ведь единственный след первого списания был в транзакции, которой больше нет. D казался мне надёжнее, он записывает ключ раньше, чем трогает деньги, но ключ лежит в ещё открытой транзакции и пропадает вместе с ней.

## Две копии сразу

Для гонки я отправлял по 2 копии каждого из 50 платежей с зазором, банк отвечал за 50 мс. При зазоре от 0 до 45 мс рецепт B списал дважды все 50 платежей и оставил 100 строк. C списал дважды от 46 до 50 платежей и оставил ровно 50 строк, то есть потеря почти та же, только таблица чистая. У D, E, F и G по 50 списаний. В D второй INSERT просто ждёт, пока закончится первая транзакция. При зазоре 100 мс, когда первая копия уже зафиксирована, дважды списывает один A. Примерно так я раньше и проверял: ещё раз нажимал кнопку руками.

## Шторм

Дальше 2000 платежей от 8 клиентов. Клиент ждёт ответа 250 мс, 5% вызовов банка длятся 600 мс, 4% первых попыток просят убить процесс в случайном месте (из повторных 2%). Процесс у сервиса один, поэтому вместе с ним гибнут все платежи, которые были в работе.

<figure class="fig">
<svg viewBox="0 0 680 246" role="img" aria-label="Шторм, по 2000 платежей на рецепт. Платежи, списанные больше одного раза, лишние строки в таблице, клиенты без ответа 200. A: 497, 33, 0. B: 470, 5, 0. S: 750, 0, 77. C: 478, 0, 0. D: 478, 0, 0. E: 0, 0, 292. F: 68, 0, 0. G: 0, 0, 0.">
  <text x="4.0" y="16.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">платежи, списанные больше одного раза</text>
  <text x="570.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">лишние строки</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">без 200</text>
  <text x="4.0" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">A</text>
  <text x="24.0" y="47.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">без ключа</text>
  <rect x="220.0" y="34.0" width="111.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="339.8" y="47.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">497</text>
  <text x="570.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">33</text>
  <text x="670.0" y="47.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">B</text>
  <text x="24.0" y="73.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">SELECT, списание, INSERT</text>
  <rect x="220.0" y="60.0" width="105.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="333.8" y="73.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">470</text>
  <text x="570.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">5</text>
  <text x="670.0" y="73.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">S</text>
  <text x="24.0" y="99.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B, SERIALIZABLE</text>
  <rect x="220.0" y="86.0" width="168.8" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="396.8" y="99.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">750</text>
  <text x="570.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="99.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">77</text>
  <text x="4.0" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">C</text>
  <text x="24.0" y="125.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">B + уникальный индекс</text>
  <rect x="220.0" y="112.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="125.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="125.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">D</text>
  <text x="24.0" y="151.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, списание, COMMIT</text>
  <rect x="220.0" y="138.0" width="107.6" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="335.6" y="151.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">478</text>
  <text x="570.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">E</text>
  <text x="24.0" y="177.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">INSERT, COMMIT, списание</text>
  <rect x="220.0" y="164.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="177.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="177.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">292</text>
  <text x="4.0" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">F</text>
  <text x="24.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блокировка + вопрос</text>
  <rect x="220.0" y="190.0" width="15.3" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="243.3" y="203.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">68</text>
  <text x="570.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="203.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="4.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">G</text>
  <text x="24.0" y="229.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">E + блокировка + ссылка</text>
  <rect x="220.0" y="216.0" width="1.0" height="18.0" style="fill:var(--accent);opacity:0.8;stroke:none"/>
  <text x="228.0" y="229.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="570.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="670.0" y="229.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>Шторм, по 2000 платежей на рецепт. Столбики это платежи, списанные в банке 2 и больше раз, в колонках справа строки done сверх 2000 и клиенты, которые сдались без 200.</figcaption>
</figure>

В критериях, записанных до прогона, у меня стояло, что порядок рецептов будет тем же, что и в мелких тестах. Не вышло. SERIALIZABLE оказался хуже, чем вообще без ключа: 750 платежей, списанных больше одного раза, против 497, всего 6277 списаний. Самый невезучий платёж списали 15 раз и лишь потому, что после 15 попыток мой клиент сдаётся.

Что 40001 приходит уже после списания, я знал. Что он достанется посторонним платежам, не ожидал. Тогда я взял 2 транзакции с разными ключами: каждая ищет свой отсутствующий ключ, вставляет его и делает COMMIT. По `pg_locks` видно, что SELECT оставляет SIReadLock на странице индекса, так что 2 отсутствующих ключа с одной страницы выглядят как конфликт. Со случайными ключами 40001 получили 100 пар из 100 на пустой таблице, 14 на таблице с 1000 строк в начале теста и только одна на таблице с 10 000. Каждая такая ошибка велела клиенту повторить запрос и каждый повтор шёл в банк.

Первый вариант этого теста показал 100, 84 и 0. Я даже успел написать к нему объяснение, а потом посмотрел на ключи. Почти все они по порядку шли после первой тысячи строк и встречались на последней странице, а при 10 000 строк между двумя ключами всегда лежало около 5000 других. У шторма тот же изъян: ключи там пронумерованы подряд, `sS-120` рядом с `sS-121`. С соседними номерами выходит 100 из 100 на каждом из трёх размеров. Поэтому для S я повторил шторм, взяв md5 от тех же ключей. Вышло 4178 списаний вместо 6277, зато больше одного раза списаны 774 платежа. Это всё равно хуже, чем без ключа.

Шторм я ещё и разобрал на части. Когда есть только таймауты, у A и C больше одного раза списано по 92 платежа, потому что seed общий и медленными были одни и те же вызовы. У D ни одного. Когда есть только убийства, у A таких 527, у C 496, у D 474. Выходит, гонку D закрыл, но от убийства спасает ненамного лучше, чем отсутствие ключа.

E дважды не списал ни разу. Зато 292 клиента так и не получили 200. В таблице 292 строки со словом `started`, по 278 из них банк деньги списал, по 14 нет. По самой таблице их не различить.

## Спросить банк

Рецепт F я бы и написал сам. С одними убийствами он чист: банк записывает списание за 30 мс, а клиент ждёт перед повтором 50. С одними таймаутами тоже чист, блокировку держит живой процесс. Когда есть и то и другое, больше одного раза списано 68 платежей.

<figure class="fig">
<svg viewBox="0 0 680 258" role="img" aria-label="Рецепт F. Процесс умирает через 100 мс после вызова банка, банк записывает списание на 200 мс. Сколько платежей из 20 списано дважды в зависимости от паузы перед повтором: 20: 20, 50: 20, 80: 20, 110: 0, 150: 0, 250: 0.">
  <rect x="190.0" y="52.0" width="150.0" height="16.0" style="fill:var(--accent);opacity:0.25;stroke:none"/>
  <line x1="40" y1="60" x2="640" y2="60" class="f-line"/>
  <line x1="40" y1="55" x2="40" y2="65" class="f-line"/>
  <text x="40.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="190" y1="55" x2="190" y2="65" class="f-line"/>
  <text x="190.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="340" y1="55" x2="340" y2="65" class="f-line"/>
  <text x="340.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <line x1="490" y1="55" x2="490" y2="65" class="f-line"/>
  <text x="490.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <line x1="640" y1="55" x2="640" y2="65" class="f-line"/>
  <text x="640.0" y="46.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">400</text>
  <text x="190.0" y="20.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">процесс умер</text>
  <text x="300.0" y="20.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">банк записал списание</text>
  <text x="670.0" y="82.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">мс от вызова банка</text>
  <text x="40.0" y="108.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">пауза перед повтором, сколько платежей из 20 списано дважды</text>
  <line x1="190" y1="134" x2="220.0" y2="134" class="f-line"/>
  <rect x="216.0" y="130.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="138.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+20</text>
  <text x="232.0" y="138.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="154" x2="265.0" y2="154" class="f-line"/>
  <rect x="261.0" y="150.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="158.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+50</text>
  <text x="277.0" y="158.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="174" x2="310.0" y2="174" class="f-line"/>
  <rect x="306.0" y="170.0" width="8.0" height="8.0" style="fill:var(--accent);opacity:1;stroke:none"/>
  <text x="182.0" y="178.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+80</text>
  <text x="322.0" y="178.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">20</text>
  <line x1="190" y1="194" x2="355.0" y2="194" class="f-line"/>
  <rect x="351.0" y="190.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="198.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+110</text>
  <text x="367.0" y="198.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="214" x2="415.0" y2="214" class="f-line"/>
  <rect x="411.0" y="210.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="218.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+150</text>
  <text x="427.0" y="218.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
  <line x1="190" y1="234" x2="565.0" y2="234" class="f-line"/>
  <rect x="561.0" y="230.0" width="8.0" height="8.0" style="fill:var(--ink);opacity:1;stroke:none"/>
  <text x="182.0" y="238.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">+250</text>
  <text x="577.0" y="238.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">0</text>
</svg>
<figcaption>Рецепт F спрашивает банк, прежде чем списывать снова. Если вопрос пришёл раньше, чем банк записал первое списание, тот честно отвечает, что такого нет. У рецепта G при каждой из этих пауз ровно 20 списаний.</figcaption>
</figure>

Процесс умирает через 100 мс после вызова, банк записывает списание на 200 мс. Клиент, вернувшийся через 20, 50 или 80 мс, попадает в новый рабочий процесс. Тот спрашивает банк и, услышав, что такого списания нет, списывает ещё раз, 20 платежей из 20. При 110, 150 и 250 мс ноль.

Первый прогон этой таблицы дал 14, 3 и 1. Он шёл на ядрах, занятых ещё и чужими задачами, всё, видимо, опаздывало на десятки миллисекунд и банк успевал дописать. На тихих ядрах вышло 20, 20 и 20, то есть занятая машина прятала от меня ошибку.

В шторме 2000 списаний на 2000 платежей получилось только у G. Но получилось потому, что мой банк согласился отсекать дубли под своей блокировкой, то есть я перенёс задачу в банк, а его я ни разу не убивал. Если процессинг ссылку не принимает, рецепта, который даёт одно списание вместе с ответом, у меня здесь нет.

## Тот же ключ, другое тело

В рецепте D я отправил 100, а потом 500 с тем же ключом. Второй ответ был 200 с суммой 100. Значит, нужен отпечаток тела и первым делом хочется взять хеш байтов. На G такой отпечаток отверг 99 честных повторов из 100, все с кодом 422. Новый процесс клиента сериализует те же 5 полей в другом порядке, потому что начиная с Python 3.3 хеши строк по умолчанию рандомизированы. 200 процессов дали 99 разных байтовых строк. С отсортированными ключами прошли 100 из 100.

## Чего я не проверял

Убийство самого PostgreSQL, потерю диска и сервис из нескольких процессов. Сколько настоящий процессинг помнит ссылку, а от этого зависит, насколько поздним может быть повтор. Возвраты. Клиента, который потерял ключ и сделал новый. Шторм на рисунке прошёл по одному разу на рецепт и его числа при каждом прогоне будут другими. C, D и F я прогнал ещё раз и получил 467, 476 и 67 вместо 478, 478 и 68, так что одинаковые числа у C и D совпали случайно.
