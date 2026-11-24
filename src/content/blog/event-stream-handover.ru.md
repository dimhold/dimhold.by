---
title: "Сигнал, который поймал бы event-stream 3.3.6, за год сработал бы 54 раза на 3000 пакетов npm"
description: "Я искал в метаданных npm сигнал, который сработал бы на event-stream 3.3.6, и посчитал его на релизах 3000 популярных пакетов за год. Новый аккаунт, который публикует пакет и добавляет зависимость внутри диапазона semver, это 54 релиза, с годом тишины перед ним 11. Самого релиза в реестре уже нет и его зависимости пришлось брать из git."
date: 2018-12-02
lang: ru
translationKey: event-stream-handover
tags: ["dependencies", "open-data"]
---

В документе `event-stream` из реестра npm версия 3.3.6 есть только в списке `time`: опубликована 9 сентября в 08:28 UTC. В списке `versions` после 3.3.5 сразу идёт 4.0.0. Это тот самый релиз, который притащил `flatmap-stream`, 26 ноября npm удалил оба. Я хотел посмотреть, что реестр знал про 3.3.6 до того, как узнали все. И первым делом увидел, что от этой записи почти ничего не осталось.

Историю к этому дню прочитали почти все. Доминик Тарр написал в issue 116, что человек прислал ему письмо, захотел поддерживать модуль и получил его. Потом аккаунт `right9ctrl` добавил зависимость, одна из следующих версий этой зависимости полезла в кошелёк Copay, 27 ноября npm всё это описал. Сам я патчи и минорные версии обновляю, глядя только на номер. Кто выпустил релиз, записано в том же документе, в поле `_npmUser`. Я туда ни разу не заглядывал.

Поэтому вопрос был такой: какой сигнал в метаданных сработал бы на 3.3.6 и как часто он срабатывал бы на других популярных пакетах. Тот, что срабатывает каждый день, я бы просто выключил.

## Что осталось в записях

3.3.4 вышла в июле 2016 года, 3.3.5 вышла 5 сентября 2018 года, между ними 780 дней. 3.3.5 это первый релиз `right9ctrl`, в списке мейнтейнеров рядом с ним ещё стоит `dominictarr`. В 4.0.0, через 11 дней, остался один `right9ctrl`.

Запись `flatmap-stream` тоже подменена, с 29 ноября там заглушка. Но joepie91 успел переписать её даты в issue 116. 0.1.0 появилась через 3 часа после 3.3.5. Зависимости 3.3.6 я взял из git, коммит `5999958d`. Это 3.3.5 плюс строка `"flatmap-stream": "^0.1.0"`. Без этой строки мой скрипт видел осенью 3 релиза `event-stream` и ни одной новой зависимости. 9 сентября новому пакету было 4 дня. Версия с вредоносным кодом, 0.1.1, вышла через 26 дней после 3.3.6 и попала в тот же диапазон.

<figure class="fig">
<svg viewBox="0 0 680 234" role="img" aria-label="Две дорожки с сентября по конец ноября 2018 года. event-stream: 3.3.5 вышла 5 сентября, 3.3.6 вышла 9 сентября, 4.0.0 вышла 16 сентября, 4.0.1 вышла 29 сентября. flatmap-stream: 0.1.0 вышла 5 сентября, 0.1.1 вышла 5 октября, 0.1.2 вышла 15 ноября. 3.3.6 ссылается на flatmap-stream диапазоном ^0.1.0, 4.0.0 не ссылается. Issue 115 открыт 19 ноября, npm убирает пакеты 26 ноября.">
  <text x="10.0" y="68.0" text-anchor="start" class="f-mono f-ink">event-stream</text>
  <text x="10.0" y="148.0" text-anchor="start" class="f-mono f-ink">flatmap-stream</text>
  <line x1="140.0" y1="64.0" x2="664.0" y2="64.0" class="f-line"/>
  <line x1="140.0" y1="144.0" x2="664.0" y2="144.0" class="f-line"/>
  <line x1="337.8" y1="144.0" x2="576.7" y2="144.0" class="f-line" style="stroke:var(--accent);stroke-width:5"/>
  <line x1="188.1" y1="64.0" x2="188.1" y2="137.0" class="f-line" style="stroke:var(--accent)"/>
  <path d="M184.1 132 L188.1 139 L192.1 132" class="f-line" style="stroke:var(--accent)"/>
  <text x="196.1" y="108.0" text-anchor="start" class="f-mono f-accent">^0.1.0</text>
  <circle cx="164.3" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="188.1" cy="64.0" r="4" style="fill:var(--accent);stroke:none"/>
  <circle cx="229.1" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <circle cx="302.9" cy="64.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="168.3" y="52.0" text-anchor="end" class="f-mono f-muted">3.3.5</text>
  <text x="190.1" y="34.0" text-anchor="middle" class="f-mono f-accent">3.3.6</text>
  <text x="229.1" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.0</text>
  <text x="302.9" y="52.0" text-anchor="middle" class="f-mono f-muted">4.0.1</text>
  <circle cx="165.0" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="165.0" y="168.0" text-anchor="middle" class="f-mono f-muted">0.1.0</text>
  <circle cx="337.8" cy="144.0" r="4" style="fill:var(--accent);stroke:none"/>
  <text x="337.8" y="168.0" text-anchor="middle" class="f-mono f-accent">0.1.1</text>
  <circle cx="576.7" cy="144.0" r="4" style="fill:var(--ink);stroke:none"/>
  <text x="584.7" y="168.0" text-anchor="end" class="f-mono f-muted">0.1.2</text>
  <text x="457.2" y="130.0" text-anchor="middle" class="f-label f-accent">самая новая 0.1.1</text>
  <line x1="140.0" y1="204.0" x2="664.0" y2="204.0" class="f-plain"/>
  <line x1="140.0" y1="204.0" x2="140.0" y2="209.0" class="f-plain"/>
  <text x="140.0" y="224.0" text-anchor="middle" class="f-mono f-muted">сен</text>
  <line x1="312.7" y1="204.0" x2="312.7" y2="209.0" class="f-plain"/>
  <text x="312.7" y="224.0" text-anchor="middle" class="f-mono f-muted">окт</text>
  <line x1="491.3" y1="204.0" x2="491.3" y2="209.0" class="f-plain"/>
  <text x="491.3" y="224.0" text-anchor="middle" class="f-mono f-muted">ноя</text>
  <line x1="664.0" y1="204.0" x2="664.0" y2="209.0" class="f-plain"/>
  <text x="664.0" y="224.0" text-anchor="end" class="f-mono f-muted">дек</text>
  <line x1="598.2" y1="34.0" x2="598.2" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="592.2" y="42.0" text-anchor="end" class="f-label f-ink">issue 115, 19 ноя</text>
  <line x1="638.1" y1="12.0" x2="638.1" y2="204.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="632.1" y="20.0" text-anchor="end" class="f-label f-ink">удалено, 26 ноя</text>
</svg>
<figcaption>Толстая часть линии это время, когда 0.1.1 была самой новой версией в диапазоне ^0.1.0. Что лежит в 0.1.2, я не проверял.</figcaption>
</figure>

Через 7 дней вышла 4.0.0 уже без зависимости, функцию переписали прямо в `index.js`. Кто смотрел на самую новую версию, никакого `flatmap-stream` там не видел, но в ветке 3.x последней осталась 3.3.6. Issue 115 про бэкдор открыли 19 ноября, через 71 день после 3.3.6.

## Как я считал

Имена взяты из `all-the-package-names` 1.3572.0 от 4 ноября. Судя по всему, список там идёт от пакетов, от которых зависит больше всего других, к тем, от которых не зависит никто. Я взял первые 30 000 имён без скоупа и оставил 3000 самых скачиваемых за ноябрь. `event-stream` среди них на 944-м месте с 8,9 млн скачиваний, у последнего 486 436. Дальше прочитал полные документы и взял стабильные релизы с декабря 2017 по ноябрь 2018, у которых есть предыдущая версия. Вышло 9205 релизов у 1597 пакетов. Диапазоны разбирает модуль `semver`.

Сигналы я записал до прогона:

- новый автор: аккаунт впервые опубликовал этот пакет не больше 30 дней назад, а до него публиковал кто-то другой;
- диапазон: `^` от предыдущей версии принимает новую;
- зависимость: в `dependencies` есть пакет, которого в предыдущей версии не было, молодая, если на npm он меньше 90 дней;
- тишина: год без релизов перед этим релизом или перед первым релизом аккаунта, который пришёл в последние 30 дней.

Я ждал несколько десятков релизов, где сошлись новый автор, диапазон и зависимость, а вместе с тишиной меньше десятка.

## Что срабатывает

| сигналы | релизов | пакетов |
|---|---|---|
| новый автор | 741 | 325 |
| тишина | 603 | 543 |
| зависимость | 716 | 419 |
| диапазон + молодая зависимость | 82 | 56 |
| новый автор + диапазон + зависимость | 54 | 45 |
| новый автор + диапазон + зависимость + тишина | 11 | 11 |
| новый автор + диапазон + молодая зависимость | 9 | 8 |

<figure class="fig">
<svg viewBox="0 0 680 222" role="img" aria-label="Сколько релизов 3000 пакетов за год подходит под каждое сочетание сигналов. новый автор: 741; зависимость: 716; диапазон + зависимость: 491; диапазон + молодая зависимость: 82; новый автор + диапазон + зависимость: 54; новый автор + диапазон + зависимость + тишина: 11; новый автор + диапазон + молодая зависимость: 9.">
  <rect x="362.0" y="12.0" width="251.5" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="25.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">новый автор</text>
  <text x="623.5" y="26.0" text-anchor="start" class="f-mono f-ink">741</text>
  <rect x="362.0" y="42.0" width="243.1" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="55.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">зависимость</text>
  <text x="615.1" y="56.0" text-anchor="start" class="f-mono f-ink">716</text>
  <rect x="362.0" y="72.0" width="166.7" height="18.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="354.0" y="85.0" text-anchor="end" class="f-mono f-muted" style="font-size:12px">диапазон + зависимость</text>
  <text x="538.7" y="86.0" text-anchor="start" class="f-mono f-ink">491</text>
  <rect x="362.0" y="102.0" width="27.8" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="115.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">диапазон + молодая зависимость</text>
  <text x="399.8" y="116.0" text-anchor="start" class="f-mono f-ink">82</text>
  <rect x="362.0" y="132.0" width="18.3" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="145.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новый автор + диапазон + зависимость</text>
  <text x="390.3" y="146.0" text-anchor="start" class="f-mono f-ink">54</text>
  <rect x="362.0" y="162.0" width="3.7" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="175.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новый автор + диапазон + зависимость + тишина</text>
  <text x="375.7" y="176.0" text-anchor="start" class="f-mono f-ink">11</text>
  <rect x="362.0" y="192.0" width="3.1" height="18.0" style="fill:var(--accent);stroke:none"/>
  <text x="354.0" y="205.0" text-anchor="end" class="f-mono f-ink" style="font-size:12px">новый автор + диапазон + молодая зависимость</text>
  <text x="375.1" y="206.0" text-anchor="start" class="f-mono f-ink">9</text>
</svg>
<figcaption>Релизы с декабря 2017 по ноябрь 2018, подходящие под все слова строки. 3.3.6 есть во всех 7 строках. Красным отмечено то, чего меньше 100.</figcaption>
</figure>

Новый автор сам по себе мало о чём говорит. За год кто-то новый появился у 325 пакетов из 3000, больше чем у каждого десятого. Вместе с диапазоном и зависимостью остаётся 54 релиза, примерно один в неделю. Строку, где только диапазон и молодая зависимость, я добавил уже после прогона.

С тишиной их 11, чуть больше, чем я ждал. Рядом с `event-stream` стоят `grunt` 1.0.2, `readdirp` 2.2.0, `for-each` 0.3.3, `browser-pack` 6.0.3. По метаданным это обычная поддержка. После долгой паузы публикует новый человек и добавляет один пакет, например `safe-buffer` или `is-callable`. По этим полям 3.3.6 выглядит так же. Код остальных 10 релизов я не читал.

С молодой зависимостью их 9. Тут я посмотрел, кто эти зависимости сделал. У 6 из остальных 8 релизов это тот же аккаунт, что выпустил и сам релиз. Ещё у 2 это аккаунт, у которого уже были пакеты в моих 3000. Кто опубликовал `flatmap-stream`, в реестре уже не видно, репозиторий лежал у `hugeglass`. Если и на npm это был тот же аккаунт, правило "молодая и от незнакомого аккаунта" оставило бы только `event-stream`. Но придумал я его уже после прогона на единственном настоящем случае, так что пока я бы ему не верил.

Правила с зависимостью срабатывают 9 сентября. В тот день, насколько я понял из issue 116, код был ещё безобидным. Новый автор вместе с тишиной сработали бы на 4 дня раньше, на 3.3.5. А 5 октября у `event-stream` вообще нет релиза, у `flatmap-stream` это обычный патч. С `eslint-scope` всё это, думаю, не помогло бы. Его 3.7.2 от 12 июля опубликовали с украденными учётными данными мейнтейнера, код запускался из `postinstall`. У 3.7.1 и 3.7.3 одни и те же 2 зависимости, поэтому и в 3.7.2, скорее всего, новых не было.

## Как далеко это ушло

С 27 августа по 8 сентября `flatmap-stream` скачали 22 раза. 10 сентября, в первый полный день, 114 753 раза. У `event-stream` в тот же день 354 919, выходит 32%. За неделю с 12 ноября доля дошла до 48%. С 9 сентября по 25 ноября у меня получается 9,52 млн. Snyk писал про почти 8 млн, какие дни они брали, я не знаю. Моя сумма проходит эту отметку 14 ноября.

<figure class="fig">
<svg viewBox="0 0 680 268" role="img" aria-label="Скачивания event-stream и flatmap-stream по дням с 27 августа по 1 декабря 2018 года. У flatmap-stream до 9 сентября всего 22 скачивания, затем 114 753 за 10 сентября и 204 253 за 21 ноября. 27 ноября уже 27 647, 30 ноября 308.">
  <line x1="56.0" y1="238.0" x2="664.0" y2="238.0" class="f-plain"/>
  <text x="48.0" y="242.0" text-anchor="end" class="f-mono f-muted">0</text>
  <line x1="56.0" y1="196.7" x2="664.0" y2="196.7" class="f-plain"/>
  <text x="48.0" y="200.7" text-anchor="end" class="f-mono f-muted">100</text>
  <line x1="56.0" y1="155.4" x2="664.0" y2="155.4" class="f-plain"/>
  <text x="48.0" y="159.4" text-anchor="end" class="f-mono f-muted">200</text>
  <line x1="56.0" y1="114.1" x2="664.0" y2="114.1" class="f-plain"/>
  <text x="48.0" y="118.1" text-anchor="end" class="f-mono f-muted">300</text>
  <line x1="56.0" y1="72.8" x2="664.0" y2="72.8" class="f-plain"/>
  <text x="48.0" y="76.8" text-anchor="end" class="f-mono f-muted">400</text>
  <rect x="56.6" y="121.1" width="5.1" height="116.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="62.9" y="106.5" width="5.1" height="131.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="69.1" y="114.7" width="5.1" height="123.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="75.4" y="99.9" width="5.1" height="138.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="81.7" y="126.1" width="5.1" height="111.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="87.9" y="210.4" width="5.1" height="27.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="87.9" y1="238.0" x2="87.9" y2="243.0" class="f-plain"/>
  <text x="87.9" y="258.0" text-anchor="middle" class="f-mono f-muted">сен</text>
  <rect x="94.2" y="209.2" width="5.1" height="28.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="100.5" y="144.4" width="5.1" height="93.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="106.7" y="105.0" width="5.1" height="133.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="113.0" y="84.1" width="5.1" height="153.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="119.3" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="125.5" y="106.4" width="5.1" height="131.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="131.8" y="200.2" width="5.1" height="37.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="199.2" width="5.1" height="38.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="138.1" y="227.8" width="5.1" height="10.2" style="fill:var(--accent);stroke:none"/>
  <rect x="144.4" y="91.4" width="5.1" height="146.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="144.4" y="190.6" width="5.1" height="47.4" style="fill:var(--accent);stroke:none"/>
  <rect x="150.6" y="76.0" width="5.1" height="162.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="150.6" y="187.8" width="5.1" height="50.2" style="fill:var(--accent);stroke:none"/>
  <rect x="156.9" y="82.8" width="5.1" height="155.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="156.9" y="187.7" width="5.1" height="50.3" style="fill:var(--accent);stroke:none"/>
  <rect x="163.2" y="91.3" width="5.1" height="146.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="163.2" y="191.5" width="5.1" height="46.5" style="fill:var(--accent);stroke:none"/>
  <rect x="169.4" y="104.9" width="5.1" height="133.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="169.4" y="194.8" width="5.1" height="43.2" style="fill:var(--accent);stroke:none"/>
  <rect x="175.7" y="193.4" width="5.1" height="44.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="175.7" y="220.2" width="5.1" height="17.8" style="fill:var(--accent);stroke:none"/>
  <rect x="182.0" y="195.3" width="5.1" height="42.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="182.0" y="223.1" width="5.1" height="14.9" style="fill:var(--accent);stroke:none"/>
  <rect x="188.2" y="89.7" width="5.1" height="148.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="188.2" y="189.8" width="5.1" height="48.2" style="fill:var(--accent);stroke:none"/>
  <rect x="194.5" y="88.1" width="5.1" height="149.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="194.5" y="188.2" width="5.1" height="49.8" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="85.4" width="5.1" height="152.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="200.8" y="187.3" width="5.1" height="50.7" style="fill:var(--accent);stroke:none"/>
  <rect x="207.0" y="79.8" width="5.1" height="158.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="207.0" y="185.4" width="5.1" height="52.6" style="fill:var(--accent);stroke:none"/>
  <rect x="213.3" y="99.7" width="5.1" height="138.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="213.3" y="192.1" width="5.1" height="45.9" style="fill:var(--accent);stroke:none"/>
  <rect x="219.6" y="192.3" width="5.1" height="45.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="219.6" y="222.2" width="5.1" height="15.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="225.8" y="222.6" width="5.1" height="15.4" style="fill:var(--accent);stroke:none"/>
  <rect x="232.1" y="94.9" width="5.1" height="143.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="232.1" y="189.4" width="5.1" height="48.6" style="fill:var(--accent);stroke:none"/>
  <rect x="238.4" y="73.9" width="5.1" height="164.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="238.4" y="184.3" width="5.1" height="53.7" style="fill:var(--accent);stroke:none"/>
  <rect x="244.6" y="68.5" width="5.1" height="169.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="244.6" y="181.9" width="5.1" height="56.1" style="fill:var(--accent);stroke:none"/>
  <rect x="250.9" y="67.5" width="5.1" height="170.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="250.9" y="182.2" width="5.1" height="55.8" style="fill:var(--accent);stroke:none"/>
  <rect x="257.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="257.2" y="188.9" width="5.1" height="49.1" style="fill:var(--accent);stroke:none"/>
  <rect x="263.4" y="180.7" width="5.1" height="57.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="263.4" y="221.1" width="5.1" height="16.9" style="fill:var(--accent);stroke:none"/>
  <rect x="269.7" y="182.6" width="5.1" height="55.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="269.7" y="221.2" width="5.1" height="16.8" style="fill:var(--accent);stroke:none"/>
  <rect x="276.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="276.0" y="185.8" width="5.1" height="52.2" style="fill:var(--accent);stroke:none"/>
  <line x1="276.0" y1="238.0" x2="276.0" y2="243.0" class="f-plain"/>
  <text x="276.0" y="258.0" text-anchor="middle" class="f-mono f-muted">окт</text>
  <rect x="282.2" y="50.5" width="5.1" height="187.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="282.2" y="180.3" width="5.1" height="57.7" style="fill:var(--accent);stroke:none"/>
  <rect x="288.5" y="53.1" width="5.1" height="184.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="288.5" y="180.6" width="5.1" height="57.4" style="fill:var(--accent);stroke:none"/>
  <rect x="294.8" y="52.4" width="5.1" height="185.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="294.8" y="179.4" width="5.1" height="58.6" style="fill:var(--accent);stroke:none"/>
  <rect x="301.1" y="69.8" width="5.1" height="168.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="301.1" y="176.3" width="5.1" height="61.7" style="fill:var(--accent);stroke:none"/>
  <rect x="307.3" y="166.5" width="5.1" height="71.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="307.3" y="218.6" width="5.1" height="19.4" style="fill:var(--accent);stroke:none"/>
  <rect x="313.6" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="313.6" y="219.6" width="5.1" height="18.4" style="fill:var(--accent);stroke:none"/>
  <rect x="319.9" y="70.1" width="5.1" height="167.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="319.9" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="326.1" y="54.8" width="5.1" height="183.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="326.1" y="171.3" width="5.1" height="66.7" style="fill:var(--accent);stroke:none"/>
  <rect x="332.4" y="52.6" width="5.1" height="185.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="332.4" y="170.7" width="5.1" height="67.3" style="fill:var(--accent);stroke:none"/>
  <rect x="338.7" y="54.2" width="5.1" height="183.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="338.7" y="171.1" width="5.1" height="66.9" style="fill:var(--accent);stroke:none"/>
  <rect x="344.9" y="77.1" width="5.1" height="160.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="344.9" y="180.2" width="5.1" height="57.8" style="fill:var(--accent);stroke:none"/>
  <rect x="351.2" y="171.0" width="5.1" height="67.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="351.2" y="219.3" width="5.1" height="18.7" style="fill:var(--accent);stroke:none"/>
  <rect x="357.5" y="170.9" width="5.1" height="67.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="357.5" y="219.2" width="5.1" height="18.8" style="fill:var(--accent);stroke:none"/>
  <rect x="363.7" y="70.6" width="5.1" height="167.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="363.7" y="173.1" width="5.1" height="64.9" style="fill:var(--accent);stroke:none"/>
  <rect x="370.0" y="70.2" width="5.1" height="167.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="370.0" y="167.7" width="5.1" height="70.3" style="fill:var(--accent);stroke:none"/>
  <rect x="376.3" y="71.7" width="5.1" height="166.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="376.3" y="167.8" width="5.1" height="70.2" style="fill:var(--accent);stroke:none"/>
  <rect x="382.5" y="72.1" width="5.1" height="165.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="382.5" y="168.2" width="5.1" height="69.8" style="fill:var(--accent);stroke:none"/>
  <rect x="388.8" y="93.9" width="5.1" height="144.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="388.8" y="175.5" width="5.1" height="62.5" style="fill:var(--accent);stroke:none"/>
  <rect x="395.1" y="194.4" width="5.1" height="43.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="395.1" y="217.4" width="5.1" height="20.6" style="fill:var(--accent);stroke:none"/>
  <rect x="401.3" y="196.6" width="5.1" height="41.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="401.3" y="218.0" width="5.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="407.6" y="102.2" width="5.1" height="135.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="407.6" y="177.4" width="5.1" height="60.6" style="fill:var(--accent);stroke:none"/>
  <rect x="413.9" y="65.4" width="5.1" height="172.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="413.9" y="161.6" width="5.1" height="76.4" style="fill:var(--accent);stroke:none"/>
  <rect x="420.1" y="71.3" width="5.1" height="166.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="420.1" y="164.5" width="5.1" height="73.5" style="fill:var(--accent);stroke:none"/>
  <rect x="426.4" y="75.7" width="5.1" height="162.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="426.4" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="432.7" y="90.7" width="5.1" height="147.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="432.7" y="169.9" width="5.1" height="68.1" style="fill:var(--accent);stroke:none"/>
  <rect x="439.0" y="195.1" width="5.1" height="42.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="439.0" y="216.5" width="5.1" height="21.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.2" y="195.7" width="5.1" height="42.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="445.2" y="217.0" width="5.1" height="21.0" style="fill:var(--accent);stroke:none"/>
  <rect x="451.5" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="451.5" y="169.3" width="5.1" height="68.7" style="fill:var(--accent);stroke:none"/>
  <rect x="457.8" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="457.8" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="464.0" y="77.7" width="5.1" height="160.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="464.0" y="172.1" width="5.1" height="65.9" style="fill:var(--accent);stroke:none"/>
  <rect x="470.3" y="84.6" width="5.1" height="153.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="470.3" y="174.9" width="5.1" height="63.1" style="fill:var(--accent);stroke:none"/>
  <line x1="470.3" y1="238.0" x2="470.3" y2="243.0" class="f-plain"/>
  <text x="470.3" y="258.0" text-anchor="middle" class="f-mono f-muted">ноя</text>
  <rect x="476.6" y="88.2" width="5.1" height="149.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="476.6" y="175.1" width="5.1" height="62.9" style="fill:var(--accent);stroke:none"/>
  <rect x="482.8" y="176.7" width="5.1" height="61.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="482.8" y="209.8" width="5.1" height="28.2" style="fill:var(--accent);stroke:none"/>
  <rect x="489.1" y="185.8" width="5.1" height="52.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="489.1" y="215.6" width="5.1" height="22.4" style="fill:var(--accent);stroke:none"/>
  <rect x="495.4" y="81.7" width="5.1" height="156.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="495.4" y="167.9" width="5.1" height="70.1" style="fill:var(--accent);stroke:none"/>
  <rect x="501.6" y="72.2" width="5.1" height="165.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="501.6" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="507.9" y="74.9" width="5.1" height="163.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="507.9" y="164.0" width="5.1" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="514.2" y="75.2" width="5.1" height="162.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="514.2" y="162.8" width="5.1" height="75.2" style="fill:var(--accent);stroke:none"/>
  <rect x="520.4" y="88.9" width="5.1" height="149.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="520.4" y="170.0" width="5.1" height="68.0" style="fill:var(--accent);stroke:none"/>
  <rect x="526.7" y="191.4" width="5.1" height="46.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="526.7" y="215.7" width="5.1" height="22.3" style="fill:var(--accent);stroke:none"/>
  <rect x="533.0" y="194.1" width="5.1" height="43.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="533.0" y="216.9" width="5.1" height="21.1" style="fill:var(--accent);stroke:none"/>
  <rect x="539.2" y="87.1" width="5.1" height="150.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="539.2" y="166.1" width="5.1" height="71.9" style="fill:var(--accent);stroke:none"/>
  <rect x="545.5" y="69.3" width="5.1" height="168.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="545.5" y="158.2" width="5.1" height="79.8" style="fill:var(--accent);stroke:none"/>
  <rect x="551.8" y="73.6" width="5.1" height="164.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="551.8" y="159.0" width="5.1" height="79.0" style="fill:var(--accent);stroke:none"/>
  <rect x="558.0" y="75.9" width="5.1" height="162.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="558.0" y="161.5" width="5.1" height="76.5" style="fill:var(--accent);stroke:none"/>
  <rect x="564.3" y="83.3" width="5.1" height="154.7" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="564.3" y="158.4" width="5.1" height="79.6" style="fill:var(--accent);stroke:none"/>
  <rect x="570.6" y="183.5" width="5.1" height="54.5" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="570.6" y="213.3" width="5.1" height="24.7" style="fill:var(--accent);stroke:none"/>
  <rect x="576.8" y="187.6" width="5.1" height="50.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="576.8" y="214.3" width="5.1" height="23.7" style="fill:var(--accent);stroke:none"/>
  <rect x="583.1" y="72.6" width="5.1" height="165.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="583.1" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="589.4" y="75.1" width="5.1" height="162.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="589.4" y="154.5" width="5.1" height="83.5" style="fill:var(--accent);stroke:none"/>
  <rect x="595.7" y="63.2" width="5.1" height="174.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="595.7" y="153.6" width="5.1" height="84.4" style="fill:var(--accent);stroke:none"/>
  <rect x="601.9" y="95.4" width="5.1" height="142.6" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="601.9" y="170.2" width="5.1" height="67.8" style="fill:var(--accent);stroke:none"/>
  <rect x="608.2" y="133.8" width="5.1" height="104.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="608.2" y="191.3" width="5.1" height="46.7" style="fill:var(--accent);stroke:none"/>
  <rect x="614.5" y="198.7" width="5.1" height="39.3" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="614.5" y="224.1" width="5.1" height="13.9" style="fill:var(--accent);stroke:none"/>
  <rect x="620.7" y="202.6" width="5.1" height="35.4" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="620.7" y="223.6" width="5.1" height="14.4" style="fill:var(--accent);stroke:none"/>
  <rect x="627.0" y="95.0" width="5.1" height="143.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="627.0" y="184.6" width="5.1" height="53.4" style="fill:var(--accent);stroke:none"/>
  <rect x="633.3" y="87.9" width="5.1" height="150.1" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="633.3" y="226.6" width="5.1" height="11.4" style="fill:var(--accent);stroke:none"/>
  <rect x="639.5" y="101.8" width="5.1" height="136.2" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="639.5" y="230.2" width="5.1" height="7.8" style="fill:var(--accent);stroke:none"/>
  <rect x="645.8" y="111.1" width="5.1" height="126.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="645.8" y="231.0" width="5.1" height="7.0" style="fill:var(--accent);stroke:none"/>
  <rect x="652.1" y="137.1" width="5.1" height="100.9" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.3" y="207.2" width="5.1" height="30.8" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <line x1="658.3" y1="238.0" x2="658.3" y2="243.0" class="f-plain"/>
  <text x="652.0" y="258.0" text-anchor="middle" class="f-mono f-muted">дек</text>
  <line x1="140.6" y1="38.0" x2="140.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="140.6" y="34.0" text-anchor="middle" class="f-mono f-ink">3.3.6</text>
  <line x1="303.6" y1="38.0" x2="303.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="303.6" y="34.0" text-anchor="middle" class="f-mono f-ink">0.1.1</text>
  <line x1="560.6" y1="38.0" x2="560.6" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="560.6" y="34.0" text-anchor="end" class="f-mono f-ink">0.1.2</text>
  <line x1="629.5" y1="38.0" x2="629.5" y2="238.0" class="f-line" style="stroke-dasharray:3 3"/>
  <text x="668.0" y="34.0" text-anchor="end" class="f-mono f-ink">удалено</text>
  <text x="10.0" y="12.0" text-anchor="start" class="f-label f-muted">скачиваний в день, тысяч</text>
  <rect x="300.0" y="3.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="320.0" y="13.0" text-anchor="start" class="f-mono f-muted">event-stream</text>
  <rect x="460.0" y="3.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="480.0" y="13.0" text-anchor="start" class="f-mono f-muted">flatmap-stream</text>
</svg>
<figcaption>У каждого пакета свой столбец за день, оба начинаются с 0.</figcaption>
</figure>

Для самых новых версий пакетов я развернул деревья зависимостей целиком, по состоянию на 20 ноября. Из 5726 версий, которые в них попали, напрямую 3.3.6 тянет одна: `ps-tree` 1.1.0. Диапазон у неё `~3.3.0`. Тильду я всегда считал осторожным вариантом, тут разницы не было никакой.

Первый подсчёт шёл только внутри 3000 имён и нашёл за `ps-tree` один `npm-run-all`. `nodemon` куда-то пропал. Он идёт через `pstree.remy`, которого в моём списке нет, поэтому пришлось догрузить ещё 1107 пакетов. С ними 3.3.6 есть в дереве у 3 пакетов из 2999 (у одного из 3000 нет стабильной версии). Число маленькое, но один `ps-tree` за ноябрь скачали 6,3 млн раз.

Реакция тоже видна по датам. `pstree.remy` убрал `ps-tree` 22 ноября, `npm-run-all` 24 ноября. npm пишет, что ему сообщили 26 ноября.

## Чего я не проверял

В этой теме я не первый. В 2017 году Никита Сковорода через слабые и утёкшие пароли получил право публиковать 14% пакетов npm. Декан, Менс и Константину на MSR 2018 изучали, как уязвимости расходятся по сети зависимостей npm. Подсчёта таких сигналов я не нашёл, но и искал недолго.

`_npmUser` это аккаунт, за ним может стоять бот или второй логин того же человека. Порядок в моём списке старый, поэтому новых пакетов и всего, что со скоупом, в выборке нет. Нет и релизов, которые из реестра удалили, вернул я только 3.3.6. Деревья считал только для самых новых версий.

Границы в 30, 90 и 365 дней я выбрал, когда даты `event-stream` уже видел. Потом подвигал первую: при 7 днях выходит 49 релизов, при 90 их 76, 3.3.6 каждый раз на месте.

Нового автора вместе с тишиной попробую, наверное, на своём lock-файле. В этой выборке таких 157 релизов у 97 пакетов за год, столько я прочитать могу. Посмотрим.
