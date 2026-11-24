---
title: "95-процентный бутстрап-интервал накрыл истинное среднее 68 раз из 100"
description: "Я посчитал, как часто 95-процентный перцентильный бутстрап-интервал накрывает правду, на выборках из HTTP-лога NASA за июль 1995 года и на 4 известных распределениях. Для среднего 20 ответов вышло 68,5%, для медианы 94,0%."
date: 2015-08-01
lang: ru
translationKey: bootstrap-spread
tags: ["statistics", "numbers", "algorithms"]
---

Первую гистограмму я построил от 0 до 60 000, потому что знал истинное среднее, 22 741. За краем осталось 3185 значений из 10 000. Когда я отодвинул край до 240 000, на графике появились горб, дыра, ещё горб, хорошо видно 5 горбов. Это 10 000 бутстрап-средних одной выборки из 20 ответов веб-сервера, в байтах. Один из этих 20 ответов весит 835 394 байта. Горбы различаются тем, сколько раз он попал в бутстрап-выборку.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Гистограмма 10 000 бутстрап-средних одной выборки из 20 размеров ответа. Отдельные горбы с промежутками: ответ в 835 394 байта попал в бутстрап-выборку 0, 1, 2, 3, 4 раза или больше. Истинное среднее 22 741 лежит в первом горбе. Интервал от 8818 до 141 714.">
  <rect x="30.5" y="239.7" width="9.3" height="0.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="40.8" y="223.2" width="9.3" height="16.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="51.2" y="152.2" width="9.3" height="87.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="61.5" y="85.8" width="9.3" height="154.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="71.8" y="127.2" width="9.3" height="112.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="82.2" y="203.4" width="9.3" height="36.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="92.5" y="233.7" width="9.3" height="6.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="102.8" y="239.4" width="9.3" height="0.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="144.2" y="233.3" width="9.3" height="6.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="154.5" y="173.7" width="9.3" height="66.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="164.8" y="91.1" width="9.3" height="148.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="175.2" y="105.0" width="9.3" height="135.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="185.5" y="185.9" width="9.3" height="54.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="195.8" y="229.3" width="9.3" height="10.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="206.2" y="239.2" width="9.3" height="0.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="216.5" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="247.5" y="239.0" width="9.3" height="1.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="257.8" y="221.1" width="9.3" height="18.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="268.2" y="169.7" width="9.3" height="70.3" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="278.5" y="162.6" width="9.3" height="77.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="288.8" y="202.0" width="9.3" height="38.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="299.2" y="231.2" width="9.3" height="8.8" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="309.5" y="239.1" width="9.3" height="0.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="319.8" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="350.8" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="361.2" y="237.1" width="9.3" height="2.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="371.5" y="222.8" width="9.3" height="17.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="381.8" y="216.5" width="9.3" height="23.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="392.2" y="224.6" width="9.3" height="15.4" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="402.5" y="236.9" width="9.3" height="3.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="412.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="464.5" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="474.8" y="238.1" width="9.3" height="1.9" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="485.2" y="234.0" width="9.3" height="6.0" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="495.5" y="236.3" width="9.3" height="3.7" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="505.8" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="516.2" y="239.8" width="9.3" height="0.2" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="578.2" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="588.5" y="238.4" width="9.3" height="1.6" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="598.8" y="239.5" width="9.3" height="0.5" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <rect x="609.2" y="239.9" width="9.3" height="0.1" style="fill:var(--muted);opacity:0.6;stroke:none"/>
  <line x1="30.0" y1="240.0" x2="650.0" y2="240.0" style="stroke:var(--muted);stroke-width:1"/>
  <text x="30.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="185.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <text x="340.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="495.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">180</text>
  <text x="650.0" y="258.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">240</text>
  <text x="650.0" y="278.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">среднее бутстрап-выборки, тысячи байт</text>
  <text x="102.2" y="115.8" text-anchor="start" class="f-mono f-ink" style="font-size:13px">× 0</text>
  <text x="169.5" y="83.1" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 1</text>
  <text x="283.2" y="154.6" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 2</text>
  <text x="386.5" y="208.5" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 3</text>
  <text x="489.8" y="226.0" text-anchor="middle" class="f-mono f-ink" style="font-size:13px">× 4</text>
  <line x1="52.8" y1="34.0" x2="396.1" y2="34.0" style="stroke:var(--ink);stroke-width:2"/>
  <line x1="52.8" y1="29.0" x2="52.8" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="52.8" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">8818</text>
  <line x1="396.1" y1="29.0" x2="396.1" y2="39.0" style="stroke:var(--ink);stroke-width:2"/>
  <text x="396.1" y="22.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">141 714</text>
  <text x="408.1" y="38.0" text-anchor="start" class="f-label f-ink" style="font-size:10px">бутстрап-интервал, 95%</text>
  <line x1="88.7" y1="34.0" x2="88.7" y2="240.0" style="stroke:var(--accent);stroke-width:2"/>
  <text x="96.7" y="56.0" text-anchor="start" class="f-label f-accent" style="font-size:10px">истинное среднее 22 741</text>
</svg>
<figcaption>10 000 бутстрап-средних первой выборки, байты. Над горбами подписано, сколько раз в бутстрап-выборку попал единственный ответ в 835 394 байта. 7 средних больше 240 000 не показаны.</figcaption>
</figure>

За бутстрап я берусь, когда не помню формулу. Пишем 20 чисел на карточках, 20 раз вытягиваем карточку и каждый раз кладём её обратно, считаем среднее. Повторяем много раз, сортируем средние и отрезаем по 2,5% с каждого края. То, что осталось, называют 95-процентным интервалом. Тот же код годится для медианы и для p95, за это я его и люблю. В эти 95% я всегда верил на слово и ни разу не посчитал, как часто они сбываются.

Метод придумал Эфрон в 1979 году, слабые места тоже давно известны. Бикел и Фридман описали провал на максимуме в 1981 году, Атрея разобрал среднее при бесконечной дисперсии в 1987. Хестерберг в ноябре прошлого года писал, что на малых выборках такой интервал слишком узкий. Мне хотелось увидеть это в процентах и на данных настоящего сервера.

## Как я считал

Чтобы считать промахи, надо знать правду. Я взял HTTP-лог NASA за июль 1995 года из Internet Traffic Archive, 1 891 715 строк. Моя генеральная совокупность: все ответы со статусом 200 и известным размером, их 1 701 451. Среднее 22 741 байт, медиана 4179, p95 84 905. На самый крупный 1% ответов приходится 30% байт.

Дальше я вытягиваю n случайных ответов, делаю из них 1000 бутстрап-выборок на numpy (`RandomState`, seed зафиксирован) и смотрю, попала ли правда в интервал. При n до 200 это 4000 повторов, при больших n 2000. Стандартная ошибка одной клетки меньше одного пункта. То же самое я прогнал на нормальном распределении, экспоненциальном, логнормальном с сигмой 1 и Парето с альфой 1,5, у которого среднее есть, а конечной дисперсии нет. Нормальное служит контролем: при n = 1000 его среднее накрыто в 94,7% случаев.

До прогона я записал в файл 7 ожиданий. Сбылись 2. Вот лог, покрытие в процентах:

| n | среднее | медиана | p95 | отношение двух средних |
|---|---|---|---|---|
| 20 | 68,5 | 94,0 | 64,9 | 90,8 |
| 50 | 76,1 | 94,8 | 89,6 | 91,3 |
| 100 | 80,2 | 95,0 | 89,9 | 91,9 |
| 200 | 85,2 | 95,2 | 94,0 | 92,6 |
| 500 | 91,8 | 96,9 | 93,8 | 94,5 |
| 1000 | 93,2 | 96,5 | 95,5 | 94,0 |

<figure class="fig">
<svg viewBox="0 0 680 306" role="img" aria-label="Покрытие 95% перцентильного бутстрапа на логе NASA для выборок от 20 до 1000 ответов. Среднее: 68,5; 76,1; 80,2; 85,2; 91,8; 93,2. Медиана: 94,0; 94,8; 95,0; 95,2; 96,9; 96,5. p95: 64,9; 89,6; 89,9; 94,0; 93,8; 95,5. Отношение двух средних: 90,8; 91,3; 91,9; 92,6; 94,5; 94,0.">
  <line x1="190.0" y1="254.0" x2="620.0" y2="254.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="258.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">60</text>
  <line x1="190.0" y1="199.0" x2="620.0" y2="199.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="203.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">70</text>
  <line x1="190.0" y1="144.0" x2="620.0" y2="144.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="148.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">80</text>
  <line x1="190.0" y1="89.0" x2="620.0" y2="89.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="93.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="190.0" y1="34.0" x2="620.0" y2="34.0" style="stroke:var(--muted);stroke-width:0.5;opacity:0.5"/>
  <text x="630.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="190.0" y1="61.5" x2="620.0" y2="61.5" style="stroke:var(--ink);stroke-width:1;stroke-dasharray:5 4"/>
  <text x="630.0" y="65.5" text-anchor="start" class="f-mono f-ink" style="font-size:11px">95</text>
  <text x="190.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <text x="290.7" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <text x="366.9" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="443.1" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">200</text>
  <text x="543.8" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">500</text>
  <text x="620.0" y="274.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">1000</text>
  <text x="405.0" y="296.0" text-anchor="middle" class="f-label f-muted" style="font-size:10px">размер выборки</text>
  <text x="670.0" y="16.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">покрытие, %</text>
  <polyline points="190.0,207.4 290.7,165.6 366.9,143.0 443.1,115.7 543.8,79.1 620.0,71.4" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <circle cx="190.0" cy="207.4" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="290.7" cy="165.6" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="366.9" cy="143.0" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="443.1" cy="115.7" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="543.8" cy="79.1" r="3" style="fill:var(--accent);stroke:none"/>
  <circle cx="620.0" cy="71.4" r="3" style="fill:var(--accent);stroke:none"/>
  <text x="180.0" y="208.4" text-anchor="end" class="f-mono f-accent" style="font-size:11px">среднее 68,5</text>
  <polyline points="190.0,66.9 290.7,62.9 366.9,61.8 443.1,60.5 543.8,51.3 620.0,53.0" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <circle cx="190.0" cy="66.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="62.9" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="61.8" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="60.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="51.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="53.0" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="66.9" text-anchor="end" class="f-mono f-ink" style="font-size:11px">медиана 94,0</text>
  <polyline points="190.0,226.9 290.7,91.1 366.9,89.5 443.1,67.1 543.8,68.4 620.0,58.8" style="fill:none;stroke:var(--muted);stroke-width:2"/>
  <circle cx="190.0" cy="226.9" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="290.7" cy="91.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="366.9" cy="89.5" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="443.1" cy="67.1" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="543.8" cy="68.4" r="3" style="fill:var(--muted);stroke:none"/>
  <circle cx="620.0" cy="58.8" r="3" style="fill:var(--muted);stroke:none"/>
  <text x="180.0" y="233.9" text-anchor="end" class="f-mono f-muted" style="font-size:11px">p95 64,9</text>
  <polyline points="190.0,84.3 290.7,81.7 366.9,78.5 443.1,74.6 543.8,64.3 620.0,67.3" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:2 3"/>
  <circle cx="190.0" cy="84.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="290.7" cy="81.7" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="366.9" cy="78.5" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="443.1" cy="74.6" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="543.8" cy="64.3" r="3" style="fill:var(--ink);stroke:none"/>
  <circle cx="620.0" cy="67.3" r="3" style="fill:var(--ink);stroke:none"/>
  <text x="180.0" y="92.3" text-anchor="end" class="f-mono f-ink" style="font-size:11px">отношение средних 90,8</text>
</svg>
<figcaption>Доля выборок, чей интервал накрыл истинное значение, лог NASA, %. Пунктиром обещанные 95%.</figcaption>
</figure>

## Среднее

Я думал, что со средним всё будет в порядке уже с n = 50. При n = 20 интервал накрыл его в 2739 выборках из 4000. Промахи почти все в одну сторону: 1258 раз интервал целиком лежал ниже правды и 3 раза выше. Эту клетку я повторил с 6 другими seed: среднее накрыто от 2700 до 2776 раз, а вместо тех 3 получается от 4 до 10. У Парето покрытие растёт с 65,0% при n = 20 всего до 78,0% при n = 1000.

Ещё я думал, что бутстрап будет не хуже t-интервала из учебника. На логе при n = 20 вышла ничья: на тех же выборках t-интервал накрыл среднее 2738 раз, на один меньше. А на нормальном при том же n он лучше, 94,9% против 92,7%. До 3 пунктов разница не дошла нигде.

Потом я взял новый прогон и разделил выборки по простому признаку: попал ли в выборку хоть один ответ из самого крупного 1%, от 298 302 байт. При n = 20 такого ответа нет в 82% выборок, их интервалы накрывают среднее в 61% случаев. Если хоть один есть, накрывают в 99,6%. Из 1276 промахов 1273 пришлись на первую группу.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Полосы для выборок по 20, 50, 100 и 200 ответов, каждая разбита на 2 части. Выборки без единого ответа из самого крупного 1%, в процентах: 82,2; 60,3; 36,6; 13,6. Из всех выборок промахнулись в этой части: 31,8; 24,2; 19,1; 10,1. В остальной части: 0,1; 0,3; 1,3; 4,7.">
  <text x="60.0" y="18.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">нет крупных ответов</text>
  <text x="660.0" y="18.0" text-anchor="end" class="f-label f-muted" style="font-size:10px">есть хотя бы один</text>
  <rect x="60.0" y="30" width="189.0" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="249.0" y="30" width="298.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="554.0" y="30" width="105.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="659.6" y="30" width="0.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="49.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">20</text>
  <text x="60.0" y="73.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">мимо 31,8%</text>
  <text x="660.0" y="73.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">мимо 0,1%</text>
  <rect x="60.0" y="86" width="143.9" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="203.9" y="86" width="214.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="424.2" y="86" width="233.9" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="658.1" y="86" width="1.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="105.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">50</text>
  <text x="60.0" y="129.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">мимо 24,2%</text>
  <text x="660.0" y="129.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">мимо 0,3%</text>
  <rect x="60.0" y="142" width="113.8" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="173.8" y="142" width="103.8" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="283.6" y="142" width="369.0" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="652.6" y="142" width="7.4" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="161.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">100</text>
  <text x="60.0" y="185.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">мимо 19,1%</text>
  <text x="660.0" y="185.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">мимо 1,3%</text>
  <rect x="60.0" y="198" width="60.1" height="28" style="fill:var(--accent);stroke:none"/>
  <rect x="120.1" y="198" width="20.3" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="146.5" y="198" width="485.6" height="28" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <rect x="632.1" y="198" width="27.9" height="28" style="fill:var(--accent);stroke:none"/>
  <text x="50.0" y="217.0" text-anchor="end" class="f-mono f-ink" style="font-size:13px">200</text>
  <text x="60.0" y="241.0" text-anchor="start" class="f-mono f-accent" style="font-size:11px">мимо 10,1%</text>
  <text x="660.0" y="241.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">мимо 4,7%</text>
  <rect x="60" y="259" width="12" height="12" style="fill:var(--accent);stroke:none"/>
  <text x="78.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">мимо</text>
  <rect x="180" y="259" width="12" height="12" style="fill:var(--muted);opacity:0.35;stroke:none"/>
  <text x="198.0" y="268.0" text-anchor="start" class="f-label f-muted" style="font-size:10px">накрыл среднее</text>
</svg>
<figcaption>В каждой полосе 4000 выборок из лога NASA, проценты от всех 4000. Акцентным цветом интервалы, которые не накрыли истинное среднее. Слева от разрыва выборки без единого ответа из самого крупного 1%.</figcaption>
</figure>

Так что уродливая гистограмма в начале получилась из хорошей выборки. 75% её байт приходится на один ответ, интервал идёт от 8818 до 141 714 и правда внутри. Рядом с интервалом я собирался печатать долю самого большого значения, как предупреждение. Проверил на других 4000 выборках по 20, оно работает наоборот. В четверти выборок, где эта доля меньше всего, среднее накрыто в 47% случаев, в четверти с самой большой долей в 95%. С шириной ещё хуже. Самая узкая четверть интервалов, короче 15 617 байт, накрыла среднее в 1% случаев.

У средних 4000 выборок по 20 стандартное отклонение 17 845. Бутстрап оценивает его в 6609, это медиана по выборкам. У медианы 20 ответов на самом деле 2238, по бутстрапу 2363, мне такой точности хватает.

## Медиана, p95, максимум

Медиана держится везде, от 93,4% до 96,9% на всех распределениях. Её интервал зависит только от мест в отсортированной выборке. Для 21 значения я посчитал эти места точно, по биномиальному распределению: с 7-го значения по 15-е, какими бы они ни были, медиана при этом накрыта в 92,2% случаев.

Для p95 при n = 20 покрытие от 63% до 65% на любом распределении, на нормальном тоже. Тут хватает арифметики. В 0,95^20 = 35,8% выборок все 20 значений меньше истинного p95 и никакой бутстрап выше самого большого из них не поднимется. При n = 100 я ждал, что всё будет в норме. Вышло от 88% до 90% везде, хотя та же арифметика объясняет только 0,6% выборок. Оценка numpy при таком размере это почти 95-е значение из 100, поэтому я снова посчитал места. Интервал идёт от 89-го значения до 98-го, а истинный p95 в 11,8% выборок больше 98-го. Если за p95 брать 96-е значение, места будут 91 и 99. На 4000 выборках из нормального распределения с оценкой numpy накрыто 88,7%, с 96-м значением 94,0%. Я не знал, что одно место стоит 5 пунктов.

Максимум лога накрыт 0 раз из 16 000 при n до 200. Самый большой ответ это одна строка из 1,7 миллиона, а выше самого большого значения в выборке интервал не поднимается.

## Отношение

Я ждал, что отношение двух плохих средних окажется хуже одного плохого среднего. А вышло 90,8% при n = 20. Обе группы взяты из одного лога, оба средних обычно занижены и промахи расходятся в обе стороны, 4,5% и 4,7%. Но это A/A-тест, самый лёгкий случай. Когда я сравнил лог с экспоненциальным распределением с тем же средним, покрытие было 77,2% при n = 20 и 88,5% при n = 200.

Попробовал одно лекарство, bootstrap-t. На логе при n = 20 он дал 88,7% против 69,2% у обычного на тех же выборках, интервалы при этом в 2,1 раза шире. При n = 200 всё ещё 89,6%. И внутри каждой бутстрап-выборки ему нужна стандартная ошибка, то есть та самая формула, без которой я хотел обойтись.

## Чего я не проверял

Ответы я вытягивал независимо, а настоящий трафик идёт пачками, так что на подряд идущих строках лога, скорее всего, будет хуже. Не пробовал BCa, другие уровни вместо 95% и другие пары форм для отношения. Лог всего один, 1995 года. Чтобы делить выборки по самому крупному 1%, нужна вся совокупность. Что печатать рядом с интервалом вместо доли, я пока не знаю.
