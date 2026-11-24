---
title: "Один и тот же сервер показал p99 в 4 мс и в 162 мс"
description: "Я 8 раз останавливал HTTP-сервер на 200 мс и мерил его 3 клиентами. Обычный цикл с ожиданием ответа получил p99 3,87 мс, клиент по часам 161,84 мс. HdrHistogram починил первый журнал до 152,83 мс. Среднее из p99 по секундам дало 42,0 мс вместо 153,1."
date: 2017-01-29
lang: ru
translationKey: p99-not-mean
tags: ["performance", "statistics", "networking"]
---

За 40 секунд я 8 раз останавливал маленький HTTP-сервер на 200 мс тем же сигналом, который шлёт `kill -STOP`. Мой нагрузочный цикл сделал 3810 запросов и напечатал среднее 2,83 мс и p99 3,87 мс. Похоже на здоровый сервер. Другой клиент слал по 100 запросов в секунду строго по часам и ответов не ждал. При таком же расписании пауз он получил p99 161,84 мс.

Этот цикл я писал много раз. Засечь время, послать, дождаться, засечь снова, положить разницу в список, отсортировать и взять позицию 99%. Совет смотреть на p99 вместо среднего я знал и выполнял. А что делает цикл, пока сервер молчит, я себя ни разу не спросил.

Ответ давно известен. Гил Тене называет это coordinated omission и с 2012 года рассказывает об этом в докладе "How NOT to Measure Latency". wrk2 и HdrHistogram тоже его. Из доклада обычно пересказывают простую проверку, нажать Ctrl-Z посреди теста. Мой скрипт делает то же самое. Но мне нужны были числа из моего собственного цикла.

## На чём мерил

Сервер это `com.sun.net.httpserver` на OpenJDK 8, 64 потока. Обработчик спит 2 мс вместо похода в базу и отдаёт 512 байт. Короткий скрипт на Python шлёт SIGSTOP и SIGCONT по расписанию, настоящие паузы длились от 200,2 до 204,3 мс. Клиент это 90 строк Java на голых сокетах. Для каждого запроса он пишет, когда его надо было послать, когда послали и когда ответ пришёл целиком. Всё живёт на одной виртуальной машине с 2 ядрами, так что шум у неё свой.

Самый первый прогон, ещё без пауз, дал медиану 42 998 мкс, хотя я ждал 2 тысячи. За 5 секунд уложилось всего 117 запросов. Сервер из JDK шлёт заголовки и тело отдельно, алгоритм Нейгла держит второй пакет до ACK, а другая сторона откладывает ACK примерно на 40 мс. Это описано в JDK-6968351 для Java 6 на Windows, на моём Linux то же самое. С `-Dsun.net.httpserver.nodelay=true` медиана стала 2,3 мс. Задержку поменьше я бы наверняка принял за сам сервер.

## Когда включают секундомер

Клиентов 3. `closed` это мой обычный цикл на одном соединении: следующий запрос уходит через 10 мс после отправки предыдущего или сразу после ответа, если ответ задержался. Наверстать упущенное он не пытается. `paced` тоже работает на одном соединении, но по расписанию и после задержки сразу досылает всё, что просрочил. У `open` 64 соединения, каждый запрос уходит в свой момент.

| клиент, от чего считаем задержку | запросов | среднее, мс | p99, мс | максимум, мс | медленнее 50 мс |
|---|---|---|---|---|---|
| closed, от отправки | 3810 | 2,83 | 3,87 | 202,77 | 8 |
| paced, от отправки | 4000 | 3,01 | 9,80 | 202,46 | 8 |
| paced, от расписания | 4000 | 8,77 | 171,78 | 202,54 | 179 |
| open, от расписания | 4000 | 7,21 | 161,84 | 205,44 | 129 |

<figure class="fig">
<svg viewBox="0 0 680 392" role="img" aria-label="Третья пауза в 2 отдельных прогонах с разными клиентами, 1 точка это 1 запрос, задержка по моменту отправки. У замкнутого цикла единственная медленная точка на 202,8 мс и пустота до конца паузы. У открытого клиента 20 запросов, которые спускаются от 203 мс до 16 мс с шагом 10 мс.">
  <rect x="160.0" y="36" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="166.0" x2="660" y2="166.0" class="f-plain"/>
  <text x="52.0" y="170.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="106.9" x2="660" y2="106.9" class="f-plain"/>
  <text x="52.0" y="110.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="47.8" x2="660" y2="47.8" class="f-plain"/>
  <text x="52.0" y="51.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="75.9" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="92.7" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="109.5" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.3" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.2" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="46.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="498.0" cy="163.8" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="514.8" cy="163.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="531.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="548.5" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="565.3" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="582.1" cy="164.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="598.9" cy="164.4" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="615.8" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="632.6" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="649.4" cy="164.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="26.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">замкнутый цикл</text>
  <text x="326.7" y="26.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">сервер остановлен</text>
  <text x="660.0" y="26.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">задержка, мс</text>
  <rect x="160.0" y="212" width="333.3" height="130" style="fill:var(--muted);opacity:0.12;stroke:none"/>
  <line x1="60" y1="342.0" x2="660" y2="342.0" class="f-plain"/>
  <text x="52.0" y="346.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="282.9" x2="660" y2="282.9" class="f-plain"/>
  <text x="52.0" y="286.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="223.8" x2="660" y2="223.8" class="f-plain"/>
  <text x="52.0" y="227.8" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <circle cx="60.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="76.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="93.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="110.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="126.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="143.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="160.0" cy="221.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="176.7" cy="226.1" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="193.3" cy="231.9" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="210.0" cy="237.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="226.7" cy="243.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="243.3" cy="249.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="260.0" cy="255.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="276.7" cy="261.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="293.3" cy="267.7" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="271.4" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="326.7" cy="277.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="343.3" cy="283.2" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="360.0" cy="291.0" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="376.7" cy="296.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="393.3" cy="302.6" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="410.0" cy="306.8" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="426.7" cy="314.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.3" cy="320.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="460.0" cy="326.5" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="476.7" cy="332.3" r="3.2" style="fill:var(--accent);stroke:none"/>
  <circle cx="493.3" cy="338.1" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="510.0" cy="339.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="526.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="560.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="576.7" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="593.3" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="610.0" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="626.7" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="643.3" cy="340.6" r="3.2" style="fill:var(--muted);stroke:none"/>
  <circle cx="660.0" cy="340.5" r="3.2" style="fill:var(--muted);stroke:none"/>
  <text x="60.0" y="202.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">открытый, по часам</text>
  <text x="326.7" y="202.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">сервер остановлен</text>
  <text x="660.0" y="202.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">задержка, мс</text>
  <text x="76.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">-50</text>
  <text x="160.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="243.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="326.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="410.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="493.3" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="576.7" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">250</text>
  <text x="650.0" y="360.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">300</text>
  <text x="360.0" y="380.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">мс от отправки самого медленного запроса</text>
</svg>
<figcaption>Третья пауза в 2 отдельных прогонах. Замкнутый цикл записал 1 медленный запрос, клиент по часам записал 20.</figcaption>
</figure>

Пауза останавливает цикл вместе с сервером. Один запрос в пути и получает свои 200 мс, а остальные 19 просто не отправляются. Поэтому 8 пауз это 8 медленных запросов из 3810. Это около 0,2% и p99 до них не дотягивается. Две строки `paced` это одни и те же запросы одного прогона, разница только в том, от чего считать. В остальных 2 прогонах `closed` показал p99 4,69 и 4,66 мс, `open` 158,41 и 162,12.

Откуда у `paced` от отправки 9,80, я сразу не понял, ведь пауз и там 8. Остальные 32 из 40 самых медленных запросов лежат между 7,2 и 10,1 с прогона, в одном шумном куске. В двух других прогонах вышло 8,28 и 9,71, снова в основном из-за такого куска. Что его вызывает, я не нашёл.

Среднее в той же строке тоже обманывает, 2,83 против 7,21. Переход со среднего на p99 здесь ничего мне не дал. Беду в строке `closed` видно только по максимуму.

HdrHistogram умеет чинить такой журнал. `recordValueWithExpectedInterval` с интервалом 10 мс добавляет к значению 200 мс недостающие 190, 180 и так далее. Версия 2.1.9 из 3 журналов `closed` получила p99 152,83, 156,03 и 156,80 мс, не больше чем на 6% ниже `open`. Я ждал худшего. Но чинит она только журнал с дырами. Я специально скормил ей журнал `open`, из 4000 запросов стало 5546 записей со средним 26,35 мс. И никакого предупреждения в выводе нет.

## p99 это порог

До прогона я записал прогноз для клиента `open`. Если f это доля времени в паузах, то p99 в миллисекундах равен `2 + 200 * (1 - 0.01 / f)` при f больше 1% и около 2 в остальных случаях. Для среднего получается `2 + 100 * f`. Каждая строка это прогон в 80 секунд.

| пауза раз в | доля | среднее, мс | прогноз | p99, мс | прогноз |
|---|---|---|---|---|---|
| нет пауз | 0% | 2,66 | 2 | 6,4 | 2 |
| 40 с | 0,5% | 3,26 | 2,5 | 16,5 | 2 |
| 16 с | 1,25% | 4,09 | 3,25 | 56,0 | 42 |
| 10 с | 2% | 4,97 | 4 | 114,2 | 102 |
| 5 с | 4% | 6,76 | 6 | 153,1 | 152 |

От первой строки к последней среднее выросло в 2,5 раза, а p99 в 24 раза. Прогноз среднего в каждой строке ниже на величину от 0,7 до 1 мс. Из них 0,66 есть уже в тихом прогоне, медианный запрос там занимает 2,4 мс.

В середине таблицы прогноз p99 ниже на 14 и 12 мс. Сначала я списал это на шум машины, но журнал говорит другое. Внутри паузы запросы стоят лесенкой с шагом около 10 мс, например 203, 197, 187 и так до 17. Лесенки большинства пауз почти совпадают, потому что пауза начинается почти в одном и том же месте 10-миллисекундного такта. В прогоне с 16 с p99 это 81-й среди самых медленных. В 4 паузах по 16 запросов от 56 мс и выше, в пятой их 17. Поэтому 81-й равен 56,0, а 82-й уже 50,0. Один лишний запрос двигает p99 на ступеньку, а моя формула раскладывает запросы равномерно. В последней строке прогноз совпал отчасти случайно, 80-й запрос там 158,8.

На строке 0,5% p99 и подвёл. Паузы по 200 мс есть, а p99 говорит 16,5. Из 80 самых медленных запросов в 2 паузы попали лишь 38. Остальные 42 пришли между 30,4 и 32,6 с, когда до ближайшей паузы было 10 с. Чем была занята машина, я не знаю. p99.9 равен 169,6.

## Среднее из p99

Прогон с паузой раз в 5 с я разрезал на секунды и взял p99 каждой, как это делает система мониторинга.

<figure class="fig">
<svg viewBox="0 0 680 270" role="img" aria-label="p99 каждого окна в 1 с за прогон в 80 с, 80 столбиков. 16 столбиков от 189 до 194 мс, по одному каждые 5 с, остальные 64 от 2,7 до 16,1 мс. Среднее этих 80 чисел 42,0 мс, p99 всего прогона 153,1 мс.">
  <line x1="60" y1="220.0" x2="460" y2="220.0" class="f-plain"/>
  <text x="52.0" y="224.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="138.2" x2="460" y2="138.2" class="f-plain"/>
  <text x="52.0" y="142.2" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="56.4" x2="460" y2="56.4" class="f-plain"/>
  <text x="52.0" y="60.4" text-anchor="end" class="f-mono f-muted" style="font-size:11px">200</text>
  <rect x="60.8" y="215.4" width="3.4" height="4.6" style="fill:var(--muted);stroke:none"/>
  <rect x="65.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="70.8" y="65.6" width="3.4" height="154.4" style="fill:var(--accent);stroke:none"/>
  <rect x="75.8" y="217.4" width="3.4" height="2.6" style="fill:var(--muted);stroke:none"/>
  <rect x="80.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="85.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="90.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="95.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="100.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="105.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="110.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="115.8" y="217.3" width="3.4" height="2.7" style="fill:var(--muted);stroke:none"/>
  <rect x="120.8" y="64.0" width="3.4" height="156.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="130.8" y="206.8" width="3.4" height="13.2" style="fill:var(--muted);stroke:none"/>
  <rect x="135.8" y="213.2" width="3.4" height="6.8" style="fill:var(--muted);stroke:none"/>
  <rect x="140.8" y="214.3" width="3.4" height="5.7" style="fill:var(--muted);stroke:none"/>
  <rect x="145.8" y="63.7" width="3.4" height="156.3" style="fill:var(--accent);stroke:none"/>
  <rect x="150.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="155.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="160.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="165.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="170.8" y="63.3" width="3.4" height="156.7" style="fill:var(--accent);stroke:none"/>
  <rect x="175.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="180.8" y="215.2" width="3.4" height="4.8" style="fill:var(--muted);stroke:none"/>
  <rect x="185.8" y="214.2" width="3.4" height="5.8" style="fill:var(--muted);stroke:none"/>
  <rect x="190.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="195.8" y="64.8" width="3.4" height="155.2" style="fill:var(--accent);stroke:none"/>
  <rect x="200.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="205.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="210.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="215.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="220.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="225.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="230.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="235.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="240.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="245.8" y="65.5" width="3.4" height="154.5" style="fill:var(--accent);stroke:none"/>
  <rect x="250.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="255.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="260.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="265.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="270.8" y="64.7" width="3.4" height="155.3" style="fill:var(--accent);stroke:none"/>
  <rect x="275.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="280.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="285.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="290.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="295.8" y="64.1" width="3.4" height="155.9" style="fill:var(--accent);stroke:none"/>
  <rect x="300.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="305.8" y="213.5" width="3.4" height="6.5" style="fill:var(--muted);stroke:none"/>
  <rect x="310.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="315.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="320.8" y="63.5" width="3.4" height="156.5" style="fill:var(--accent);stroke:none"/>
  <rect x="325.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="330.8" y="216.9" width="3.4" height="3.1" style="fill:var(--muted);stroke:none"/>
  <rect x="335.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="340.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="345.8" y="64.9" width="3.4" height="155.1" style="fill:var(--accent);stroke:none"/>
  <rect x="350.8" y="216.2" width="3.4" height="3.8" style="fill:var(--muted);stroke:none"/>
  <rect x="355.8" y="215.3" width="3.4" height="4.7" style="fill:var(--muted);stroke:none"/>
  <rect x="360.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="365.8" y="216.4" width="3.4" height="3.6" style="fill:var(--muted);stroke:none"/>
  <rect x="370.8" y="61.5" width="3.4" height="158.5" style="fill:var(--accent);stroke:none"/>
  <rect x="375.8" y="216.3" width="3.4" height="3.7" style="fill:var(--muted);stroke:none"/>
  <rect x="380.8" y="216.0" width="3.4" height="4.0" style="fill:var(--muted);stroke:none"/>
  <rect x="385.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="390.8" y="216.8" width="3.4" height="3.2" style="fill:var(--muted);stroke:none"/>
  <rect x="395.8" y="65.2" width="3.4" height="154.8" style="fill:var(--accent);stroke:none"/>
  <rect x="400.8" y="215.9" width="3.4" height="4.1" style="fill:var(--muted);stroke:none"/>
  <rect x="405.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <rect x="410.8" y="216.1" width="3.4" height="3.9" style="fill:var(--muted);stroke:none"/>
  <rect x="415.8" y="215.8" width="3.4" height="4.2" style="fill:var(--muted);stroke:none"/>
  <rect x="420.8" y="64.6" width="3.4" height="155.4" style="fill:var(--accent);stroke:none"/>
  <rect x="425.8" y="217.1" width="3.4" height="2.9" style="fill:var(--muted);stroke:none"/>
  <rect x="430.8" y="217.8" width="3.4" height="2.2" style="fill:var(--muted);stroke:none"/>
  <rect x="435.8" y="217.5" width="3.4" height="2.5" style="fill:var(--muted);stroke:none"/>
  <rect x="440.8" y="216.7" width="3.4" height="3.3" style="fill:var(--muted);stroke:none"/>
  <rect x="445.8" y="62.2" width="3.4" height="157.8" style="fill:var(--accent);stroke:none"/>
  <rect x="450.8" y="216.6" width="3.4" height="3.4" style="fill:var(--muted);stroke:none"/>
  <rect x="455.8" y="216.5" width="3.4" height="3.5" style="fill:var(--muted);stroke:none"/>
  <line x1="60" y1="94.7" x2="460" y2="94.7" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <line x1="60" y1="185.6" x2="460" y2="185.6" style="stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 4"/>
  <text x="60.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="160.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="260.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <text x="360.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="460.0" y="238.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">p99 за 1 с, мс</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">секунды прогона</text>
  <text x="470.0" y="98.7" text-anchor="start" class="f-mono f-ink" style="font-size:11px">p99 всех запросов 153,1</text>
  <text x="470.0" y="189.6" text-anchor="start" class="f-mono f-ink" style="font-size:11px">среднее 80 чисел 42,0</text>
</svg>
<figcaption>p99 за каждую секунду, пауза раз в 5 с. Среднее 80 столбиков равно 42,0 мс и ни одна секунда прогона на него не похожа.</figcaption>
</figure>

Среднее 80 чисел равно 42,0 мс, а настоящий p99 153,1. У медианной секунды 4,8 мс. Паузу захватили только 16 из 80. С окнами по 5 с среднее вышло 150,6, почти верно, но лишь потому, что в каждое окно попала ровно одна пауза. Сами средние усредняются честно, 6,76 в обоих случаях, потому что в каждой секунде по 100 запросов. Для 2 серверов, тихого прогона и прогона с паузами раз в 5 с, среднее из p99 равно 79,7, а p99 по всем запросам вместе 103,7. На слайдах Хайнриха Хартмана с OSMC в ноябре 2016 года так и написано: не агрегируйте перцентили, агрегируйте гистограммы.

## 63%, которые я взял взаймы

Дин и Баррозу в "The Tail at Scale" считают, что запрос к 100 серверам, каждый из которых медленный с вероятностью 1%, окажется медленным в 63% случаев. Я ждал тех же 63% для 100 запросов подряд к моему серверу. В журнале прогона с паузой раз в 5 с вышло 21,1%.

<figure class="fig">
<svg viewBox="0 0 680 280" role="img" aria-label="Доля серий из N запросов подряд, где есть хотя бы один медленнее p99. N от 10 до 200. Формула: 9,6, 18,2, 39,5, 63,4, 86,6 процента. Те же запросы вперемешку: 9,5, 18,2, 40,0, 61,3, 84,5. В настоящем порядке: 2,8, 4,8, 10,9, 21,1, 41,8.">
  <line x1="60" y1="230.0" x2="560" y2="230.0" class="f-plain"/>
  <text x="52.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="60" y1="182.5" x2="560" y2="182.5" class="f-plain"/>
  <text x="52.0" y="186.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">25</text>
  <line x1="60" y1="135.0" x2="560" y2="135.0" class="f-plain"/>
  <text x="52.0" y="139.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">50</text>
  <line x1="60" y1="87.5" x2="560" y2="87.5" class="f-plain"/>
  <text x="52.0" y="91.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">75</text>
  <line x1="60" y1="40.0" x2="560" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="85.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <text x="185.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="310.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="435.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">150</text>
  <text x="560.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <polyline points="85.0,211.8 110.0,195.4 185.0,154.9 310.0,109.5 560.0,65.5" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4"/>
  <polyline points="85.0,211.9 110.0,195.4 185.0,154.0 310.0,113.5 560.0,69.5" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>
  <circle cx="85.0" cy="211.9" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="110.0" cy="195.4" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="185.0" cy="154.0" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="310.0" cy="113.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <circle cx="560.0" cy="69.5" r="3.4" style="fill:var(--ink);stroke:none"/>
  <polyline points="85.0,224.7 110.0,220.9 185.0,209.3 310.0,189.9 560.0,150.6" style="fill:none;stroke:var(--accent);stroke-width:1.8"/>
  <circle cx="85.0" cy="224.7" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="110.0" cy="220.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="185.0" cy="209.3" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="310.0" cy="189.9" r="3.4" style="fill:var(--accent);stroke:none"/>
  <circle cx="560.0" cy="150.6" r="3.4" style="fill:var(--accent);stroke:none"/>
  <text x="570.0" y="61.5" text-anchor="start" class="f-mono f-muted" style="font-size:11px">формула</text>
  <text x="570.0" y="83.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">вперемешку</text>
  <text x="570.0" y="148.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">настоящий</text>
  <text x="570.0" y="162.6" text-anchor="start" class="f-mono f-accent" style="font-size:11px">порядок</text>
  <text x="310.0" y="95.5" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">63,4%</text>
  <text x="310.0" y="179.9" text-anchor="middle" class="f-mono f-accent" style="font-size:11px">21,1%</text>
  <text x="60.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">серии из N запросов с медленным, %</text>
  <text x="310.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">N</text>
</svg>
<figcaption>Сколько серий из N запросов встречают хотя бы один медленнее p99. Перемешанные запросы идут за формулой, настоящий порядок нет.</figcaption>
</figure>

На перемешанном журнале формула не соврала, 61,3%. Но медленные запросы у меня идут пачками по 5. Такая пачка бывает только в каждую пятую секунду. В задетой серии их в среднем 4,8. Формула требует независимости, а у 100 запросов подряд к одному серверу её нет, так что ошибся я сам.

## Чего я не проверял

Все паузы были одной длины, а запросы шли равномерно. Настоящие клиенты приходят как попало, настоящие паузы сборщика мусора отличаются друг от друга. Расписание пауз точное, поэтому 21,1% относится к периоду в 5 с и с другим периодом изменится. Каждую строку таблицы с паузами я прогнал один раз, а в строке 0,5% пауз всего 2. Клиент и сервер делят 2 ядра, поэтому часть хвоста тихого прогона может быть их взаимной помехой. Сам wrk2 я не запускал. Мои прежние числа сняты такими же циклами, как `closed`. Заново я их ещё не снимал.
