---
title: "Число из шляпы коррелирует с 298 из 968 показателей Всемирного банка"
description: "Я 2000 раз раздал 214 странам случайные числа и сравнил их с 968 показателями Всемирного банка. В среднем вышли обещанные 5% ложных попаданий, но самое удачное перемешивание дало 298, а половина ложных попаданий повторилась в данных за другой год. Бонферрони, Бенджамини-Хохберг и деление стран пополам, с числами."
date: 2015-01-25
lang: ru
translationKey: false-discoveries
tags: ["statistics", "open-data", "numbers"]
---

Я раздал 214 странам числа от 1 до 214 в случайном порядке. Бурунди досталась единица, Румынии 214. Потом сравнил это число с каждой колонкой таблицы Всемирного банка за 2010 год. Телефонные линии на 100 человек дали ранговую корреляцию 0,36 при p = 0,00000012. У продолжительности жизни и ВВП на душу населения p меньше 0,0003. Всего p ниже 0,05 получили 298 колонок из 968.

Это самое удачное перемешивание из 2000 и искал я его нарочно. Но и на обычные данные я часто смотрел точно так же: открою таблицу, сравню всё со всем и оставлю то, что выглядит сильным. Потом проверю сильное на данных за другой год, увижу его и там и успокоюсь. Чего стоит такая проверка, я ни разу не измерял.

## Что я взял

Данные взяты из World Development Indicators, это выпуск декабря 2014 года, один файл Excel на 82 МБ. Я оставил 2010 год, выбросил агрегаты вроде "мира" и "зоны евро" и получил 214 стран. Из 1345 рядов подошли 968, в них есть данные хотя бы по 100 странам и хотя бы 20 разных значений. Тест везде один, ранговая корреляция Спирмена, p считается через t-приближение. Скрипт на Python с numpy и scipy, зерно генератора закреплено.

Ничего нового тут нет. Беннетт с соавторами в 2009 году нашёл "активность мозга" у мёртвого лосося. Тайлер Виген с прошлого мая собирает на своём сайте ложные корреляции. Процедура Бенджамини и Хохберга, дальше BH, опубликована в 1995 году, а Эфрон в 2007-м описал, как зависимость тестов меняет число ложных попаданий. Мне хотелось увидеть, какого размера это бывает на таблице, в которой действительно копаются.

## Цель без смысла оказалась со смыслом

Начал я с 2 целей без всякого смысла и до прогона записал, что каждая даст около 5%, то есть 48 колонок. Место страны в алфавите дало 15. Длина английского названия дала 84, у самой сильной из этих колонок p = 0,00007.

Это была площадь суши, за ней шли общая площадь и пашня. В четверти стран с самым большим населением в названии в среднем 8,0 знака, в четверти с самым маленьким 11,4. Небольшие территории называются "Sint Maarten (Dutch part)" или "St. Vincent and the Grenadines". Смысл у цели был, просто я его не заметил. Из 84 колонок BH при q = 0,05 оставил только площадь суши и общую площадь, почти одну и ту же колонку дважды. Думаю, он прав. Но примером пустоты она быть перестала, поэтому я перешёл к перемешиваниям.

## 5% только в среднем

Я 2000 раз раздал странам эти числа от 1 до 214. Для сравнения сделал 968 независимых колонок шума с теми же пропусками, что у настоящих.

<figure class="fig">
<svg viewBox="0 0 680 288" role="img" aria-label="Гистограмма по 2000 перемешиваний цели, в которой нет смысла. По горизонтали число колонок из 968 с p меньше 0,05. У независимых шумовых колонок почти все перемешивания лежат между 30 и 70, диапазон от 5 до 95 процентов идёт от 37 до 60. У настоящих колонок Всемирного банка диапазон от 13 до 134, а хвост доходит до 298. Среднее у обеих 48,4.">
  <line x1="60" y1="240.0" x2="660" y2="240.0" class="f-plain"/>
  <text x="52.0" y="244.0" text-anchor="end" class="f-label f-muted">0</text>
  <line x1="60" y1="173.3" x2="660" y2="173.3" class="f-plain"/>
  <text x="52.0" y="177.3" text-anchor="end" class="f-label f-muted">400</text>
  <line x1="60" y1="106.7" x2="660" y2="106.7" class="f-plain"/>
  <text x="52.0" y="110.7" text-anchor="end" class="f-label f-muted">800</text>
  <line x1="60" y1="40.0" x2="660" y2="40.0" class="f-plain"/>
  <text x="52.0" y="44.0" text-anchor="end" class="f-label f-muted">1200</text>
  <rect x="101.0" y="239.0" width="18.0" height="1.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="121.0" y="208.8" width="18.0" height="31.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="141.0" y="80.7" width="18.0" height="159.3" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="161.0" y="119.0" width="18.0" height="121.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="181.0" y="219.8" width="18.0" height="20.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="201.0" y="239.5" width="18.0" height="0.5" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="221.0" y="239.8" width="18.0" height="0.2" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <rect x="65.0" y="235.3" width="10.0" height="4.7" style="fill:var(--accent);stroke:none"/>
  <rect x="85.0" y="187.5" width="10.0" height="52.5" style="fill:var(--accent);stroke:none"/>
  <rect x="105.0" y="166.0" width="10.0" height="74.0" style="fill:var(--accent);stroke:none"/>
  <rect x="125.0" y="182.8" width="10.0" height="57.2" style="fill:var(--accent);stroke:none"/>
  <rect x="145.0" y="201.2" width="10.0" height="38.8" style="fill:var(--accent);stroke:none"/>
  <rect x="165.0" y="214.8" width="10.0" height="25.2" style="fill:var(--accent);stroke:none"/>
  <rect x="185.0" y="223.5" width="10.0" height="16.5" style="fill:var(--accent);stroke:none"/>
  <rect x="205.0" y="228.2" width="10.0" height="11.8" style="fill:var(--accent);stroke:none"/>
  <rect x="225.0" y="230.3" width="10.0" height="9.7" style="fill:var(--accent);stroke:none"/>
  <rect x="245.0" y="231.2" width="10.0" height="8.8" style="fill:var(--accent);stroke:none"/>
  <rect x="265.0" y="234.0" width="10.0" height="6.0" style="fill:var(--accent);stroke:none"/>
  <rect x="285.0" y="235.0" width="10.0" height="5.0" style="fill:var(--accent);stroke:none"/>
  <rect x="305.0" y="236.0" width="10.0" height="4.0" style="fill:var(--accent);stroke:none"/>
  <rect x="325.0" y="235.5" width="10.0" height="4.5" style="fill:var(--accent);stroke:none"/>
  <rect x="345.0" y="236.3" width="10.0" height="3.7" style="fill:var(--accent);stroke:none"/>
  <rect x="365.0" y="236.7" width="10.0" height="3.3" style="fill:var(--accent);stroke:none"/>
  <rect x="385.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="405.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="425.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="445.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="465.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="485.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="505.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="545.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="565.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="605.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="625.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <rect x="645.0" y="238.5" width="10.0" height="1.5" style="fill:var(--accent);stroke:none"/>
  <text x="60.0" y="258.0" text-anchor="middle" class="f-label f-muted">0</text>
  <text x="160.0" y="258.0" text-anchor="middle" class="f-label f-muted">50</text>
  <text x="260.0" y="258.0" text-anchor="middle" class="f-label f-muted">100</text>
  <text x="360.0" y="258.0" text-anchor="middle" class="f-label f-muted">150</text>
  <text x="460.0" y="258.0" text-anchor="middle" class="f-label f-muted">200</text>
  <text x="560.0" y="258.0" text-anchor="middle" class="f-label f-muted">250</text>
  <text x="660.0" y="258.0" text-anchor="middle" class="f-label f-muted">300</text>
  <text x="654.0" y="230.0" text-anchor="end" class="f-label f-ink">максимум 298</text>
  <text x="10.0" y="22.0" text-anchor="start" class="f-label f-muted">перемешиваний</text>
  <text x="660.0" y="278.0" text-anchor="end" class="f-label f-muted">колонок с p меньше 0,05</text>
  <rect x="320.0" y="62.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="340.0" y="72.0" text-anchor="start" class="f-label f-ink">колонки WDI</text>
  <rect x="320.0" y="84.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="340.0" y="94.0" text-anchor="start" class="f-label f-ink">шум с теми же пропусками</text>
</svg>
<figcaption>Сколько колонок из 968 получили p меньше 0,05 в каждом из 2000 перемешиваний. Среднее у обеих гистограмм 48,4. Тонкие столбики в правом хвосте это от 1 до 8 перемешиваний, они нарисованы выше масштаба, чтобы их было видно.</figcaption>
</figure>

| попаданий с p < 0,05 из 968 | колонки WDI | шум |
|---|---|---|
| среднее | 48,4 | 48,4 |
| медиана | 35 | 48 |
| 5-й процентиль | 13 | 37 |
| 95-й процентиль | 134 | 60 |
| максимум | 298 | 82 |
| перемешиваний, где Бонферрони что-то нашёл | 48 | 98 |
| перемешиваний, где BH что-то нашёл | 57 | 104 |

Среднее в обоих случаях ровно обещанные 5%. Но стандартное отклонение у шума 7 колонок, а у настоящих 40. WDI повторяет сам себя, смертность мальчиков до года стоит рядом со смертностью девочек. У 574 колонок из 968 есть двойник с ранговой корреляцией больше 0,9 по модулю. Считал я только пары, у которых есть хотя бы 50 общих стран.

Я предположил, что удачные числа легли на богатство. Тогда убрал влияние ВВП на душу населения, то есть посчитал частную ранговую корреляцию. Из 298 попаданий осталось 15. В 10,9% всех перемешиваний попаданий вдвое больше ожидаемого или ещё больше. Когда я перемешивал сами длины названий, 84 попадания и больше набирали 13,8% прогонов. Само по себе число попаданий мне почти ничего не говорит.

Бонферрони и BH сдержали обещанные 5%, хоть что-нибудь они нашли в 2,4% и 2,9% перемешиваний. Но ошибка у BH бывала крупной. В том самом удачном перемешивании он принял 117 колонок.

## Другой год, но те же страны

Теперь моя привычка. Я взял все ложные попадания 2010 года во всех перемешиваниях, только по тем колонкам, которые достаточно заполнены и в 2005-м, их 931. И проверил те же числа на данных за 2005 год.

<figure class="fig">
<svg viewBox="0 0 680 250" role="img" aria-label="Столбцы: доля ложных находок, которые повторились с p меньше 0,05 и тем же знаком. Те же страны в 2005 году: все находки 49,9 процента, лучшая колонка 60,1 процента. Другая половина стран: все находки 2,2 процента, лучшая колонка 2,5 процента, хотя бы одна из 20 лучших 27,9 процента, хотя бы одна из 50 лучших 48,5 процента.">
  <text x="10.0" y="30.0" text-anchor="start" class="f-label f-ink">те же страны, 2005 год</text>
  <text x="180.0" y="57.0" text-anchor="end" class="f-label f-muted">все находки</text>
  <rect x="190.0" y="42.0" width="292.1" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="490.1" y="57.0" text-anchor="start" class="f-mono f-ink">49,9%</text>
  <text x="180.0" y="85.0" text-anchor="end" class="f-label f-muted">лучшая</text>
  <rect x="190.0" y="70.0" width="352.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <text x="550.0" y="85.0" text-anchor="start" class="f-mono f-ink">60,1%</text>
  <text x="10.0" y="114.0" text-anchor="start" class="f-label f-ink">другая половина стран</text>
  <text x="180.0" y="141.0" text-anchor="end" class="f-label f-muted">все находки</text>
  <rect x="190.0" y="126.0" width="12.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="210.7" y="141.0" text-anchor="start" class="f-mono f-ink">2,2%</text>
  <text x="180.0" y="169.0" text-anchor="end" class="f-label f-muted">лучшая</text>
  <rect x="190.0" y="154.0" width="14.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="212.6" y="169.0" text-anchor="start" class="f-mono f-ink">2,5%</text>
  <text x="180.0" y="197.0" text-anchor="end" class="f-label f-muted">одна из 20 лучших</text>
  <rect x="190.0" y="182.0" width="163.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="361.4" y="197.0" text-anchor="start" class="f-mono f-ink">27,9%</text>
  <text x="180.0" y="225.0" text-anchor="end" class="f-label f-muted">одна из 50 лучших</text>
  <rect x="190.0" y="210.0" width="284.1" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="482.1" y="225.0" text-anchor="start" class="f-mono f-ink">48,5%</text>
  <line x1="190" y1="34" x2="190" y2="238" class="f-plain"/>
</svg>
<figcaption>Как часто вторая проверка подтверждает ложную находку: p меньше 0,05 и тот же знак. Все находки на другой половине взяты из 500 делений, 3 столбца под ними из 1000.</figcaption>
</figure>

Из 93 302 ложных попаданий 46 527 повторились с p ниже 0,05 и тем же знаком. Это 49,9%, а на независимых данных вышло бы 2,5%. Лучшая колонка перемешивания повторилась в 60,1% случаев. У удачного перемешивания повторились 188 попаданий из 281. Задним числом всё понятно, медианная ранговая корреляция колонки с самой собой через 5 лет равна 0,91. Успокаивался я рано.

Другая половина стран работает гораздо лучше. Я резал список случайно, искал в одной половине и проверял на другой. Повторилось 2,2% из 24 120 попаданий в 500 делениях, лучшая колонка повторилась в 2,5% из других 1000. Но это для одного кандидата. Если нести во вторую половину 20 лучших колонок, хотя бы одна из них повторится в 27,9% прогонов, с 50 колонками уже в 48,5%. Когда я поделил второй порог на число принесённых колонок, для 20 стало 1,8%.

## С известным ответом

Данные, в которых ничего нет, это простой случай. Поэтому я сделал смеси. Цель здесь ожидаемая продолжительность жизни в 60 случайных странах, к ней 100 настоящих колонок WDI без демографии и 900 колонок, перемешанных между странами. Во второй смеси 10 настоящих и 990 перемешанных. Каждую я повторил 200 раз. Строка "половины" значит, что p ниже 0,05 в обеих половинах стран и знак совпал.

| способ | настоящих из 100 | перемешанных среди найденного | настоящих из 10 | перемешанных среди найденного |
|---|---|---|---|---|
| p < 0,05 | 55,6 | 44,5% | 5,5 | 89,8% |
| Бонферрони | 21,9 | 0,3% | 2,1 | 1,8% |
| BH, q = 0,05 | 35,5 | 5,2% | 2,4 | 5,7% |
| половины | 27,7 | 4,4% | 2,7 | 29,0% |

<figure class="fig">
<svg viewBox="0 0 680 334" role="img" aria-label="Что нашёл каждый способ в смесях настоящих и перемешанных колонок, среднее по 200 повторам. 100 настоящих + 900 перемешанных: p &lt; 0,05: настоящих 55,6, перемешанных 44,6, Бонферрони: настоящих 21,9, перемешанных 0,07, BH, q = 0,05: настоящих 35,5, перемешанных 2,0, две половины: настоящих 27,7, перемешанных 1,2. 10 настоящих + 990 перемешанных: p &lt; 0,05: настоящих 5,5, перемешанных 49,5, Бонферрони: настоящих 2,1, перемешанных 0,07, BH, q = 0,05: настоящих 2,4, перемешанных 0,23, две половины: настоящих 2,7, перемешанных 1,2. Цель: ожидаемая продолжительность жизни в 60 странах.">
  <rect x="170.0" y="14.0" width="12.0" height="12.0" style="fill:var(--accent);stroke:none"/>
  <text x="188.0" y="24.0" text-anchor="start" class="f-label f-ink">настоящие</text>
  <rect x="300.0" y="14.0" width="12.0" height="12.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="318.0" y="24.0" text-anchor="start" class="f-label f-ink">перемешанные</text>
  <text x="10.0" y="58.0" text-anchor="start" class="f-label f-ink">100 настоящих + 900 перемешанных</text>
  <text x="160.0" y="85.0" text-anchor="end" class="f-label f-muted">p &lt; 0,05</text>
  <rect x="170.0" y="70.0" width="206.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="376.4" y="70.0" width="165.5" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="549.9" y="85.0" text-anchor="start" class="f-mono f-ink">44,5%</text>
  <text x="160.0" y="112.0" text-anchor="end" class="f-label f-muted">Бонферрони</text>
  <rect x="170.0" y="97.0" width="81.4" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="251.4" y="97.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="259.7" y="112.0" text-anchor="start" class="f-mono f-ink">0,3%</text>
  <text x="160.0" y="139.0" text-anchor="end" class="f-label f-muted">BH, q = 0,05</text>
  <rect x="170.0" y="124.0" width="131.9" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="301.9" y="124.0" width="7.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="317.3" y="139.0" text-anchor="start" class="f-mono f-ink">5,2%</text>
  <text x="160.0" y="166.0" text-anchor="end" class="f-label f-muted">две половины</text>
  <rect x="170.0" y="151.0" width="102.8" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="272.8" y="151.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="285.2" y="166.0" text-anchor="start" class="f-mono f-ink">4,4%</text>
  <text x="10.0" y="202.0" text-anchor="start" class="f-label f-ink">10 настоящих + 990 перемешанных</text>
  <text x="160.0" y="229.0" text-anchor="end" class="f-label f-muted">p &lt; 0,05</text>
  <rect x="170.0" y="214.0" width="20.5" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="190.5" y="214.0" width="183.7" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="382.2" y="229.0" text-anchor="start" class="f-mono f-ink">89,8%</text>
  <text x="160.0" y="256.0" text-anchor="end" class="f-label f-muted">Бонферрони</text>
  <rect x="170.0" y="241.0" width="7.7" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="177.7" y="241.0" width="0.6" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="185.9" y="256.0" text-anchor="start" class="f-mono f-ink">1,8%</text>
  <text x="160.0" y="283.0" text-anchor="end" class="f-label f-muted">BH, q = 0,05</text>
  <rect x="170.0" y="268.0" width="9.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="179.0" y="268.0" width="0.9" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="187.8" y="283.0" text-anchor="start" class="f-mono f-ink">5,7%</text>
  <text x="160.0" y="310.0" text-anchor="end" class="f-label f-muted">две половины</text>
  <rect x="170.0" y="295.0" width="10.0" height="20.0" style="fill:var(--accent);stroke:none"/>
  <rect x="180.0" y="295.0" width="4.4" height="20.0" style="fill:var(--muted);opacity:0.45;stroke:none"/>
  <text x="192.4" y="310.0" text-anchor="start" class="f-mono f-ink">29,0%</text>
</svg>
<figcaption>Среднее число найденных колонок из 1000, 200 повторов. Процент показывает долю перемешанных среди найденного.</figcaption>
</figure>

В первой смеси половины и BH похожи, только BH находит больше. Во второй половины дали 29,0% ложных колонок. Через обе половины в любой из смесей проходит около 1,2 перемешанной колонки, просто настоящих рядом с ними стало меньше. Сколько колонок я перебрал, половины не знают.

5,2% меня смутили. При 90% пустых колонок BH должен давать около 4,5%. Я проверил t-приближение на 2 миллионах случайных перестановок. При p ниже 0,002 и числе стран от 36 до 60 настоящая частота выше заявленной, где на 7%, где на 14%. Я уже собирался написать, что этим всё и объясняется, но стандартная ошибка среднего по 200 повторам около 0,27 пункта. Повторил смесь 1000 раз с другим зерном и получил 4,7%. С p из перестановок вместо t-приближения те же прогоны дали 4,3%. Значит, приближение стоит около 0,4 пункта, а остаток моих 5,2% скорее случайность. И это среднее, в 8,5% из 1000 прогонов в списке BH ложной была больше чем десятая часть.

## Чего я не проверял

Взял я только парные ранговые корреляции и только один год для поиска. "Настоящие" в смеси это допущение: на 200 странах у 72% таких колонок p с продолжительностью жизни ниже 0,05, остальные могут быть пустыми. Соседние страны похожи друг на друга, а перемешивание это ломает, поэтому с настоящей целью половины менее независимы, чем у меня. Вариант BH для зависимых тестов, который Бенджамини и Йекутиели опубликовали в 2001 году, я не запускал.
