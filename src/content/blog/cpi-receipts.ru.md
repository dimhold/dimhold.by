---
title: "Дешёвая еда подорожала на 33% за год, пока я не прочитал те же цены в обратную сторону"
description: "Я пересобрал продуктовую инфляцию Великобритании по сырым ценам ONS и получил почти официальные 16,4%. Дешёвые полки будто подорожали на 33% за год, пока я не посчитал те же цены в обратную сторону. Потом проверил, насколько корзина из 15 товаров уходит в сторону случайно."
date: 2022-12-17
lang: ru
translationKey: cpi-receipts
tags: ["open-data", "statistics"]
---
Британская статистическая служба в среду опубликовала инфляцию за ноябрь. В её таблицах CPI продукты и безалкогольные напитки стоят на 16,4% дороже, чем год назад. Спор вокруг таких чисел в этом году в основном про дешёвую еду. В январе Джек Монро написала, что пачка самых дешёвых макарон весом 500 г подорожала с 29 до 70 пенсов. В конце того же месяца New Statesman взял сырые цены ONS. Он показал, что самая дешёвая десятая часть цен росла намного быстрее медианы.

Официальное число я знал, но ни разу не смотрел, как его считают. Идея была собрать свой индекс по чекам. Только чеки одного человека это 15 или 20 позиций из 1 или 2 магазинов. Я не знал, что вообще может сказать индекс по такой маленькой корзине. Поэтому сначала я хотел проверить это на данных, где ответ можно проверить.

## Чеки, которые публикует ONS

Каждый месяц ONS выкладывает цены, которые её сборщики цен записывают в местных магазинах. Набор называется "item indices and price quotes". Одна строка это одна цена: товар, код магазина, регион, цена и флаг распродажи или замены товара. По продуктам и напиткам это около 42 тысяч пригодных цен в месяц примерно по 175 товарам. Товар это что-то вроде "большой белый батон без нарезки 800 г" или "молоко полужирное 2 пинты". В том же наборе лежит официальный индекс каждого товара и его вес в CPI на 2022 год.

Ближе к чекам в открытом доступе ничего нет. Я взял файлы с ноября 2021 по ноябрь 2022 года, последний вышел вместе с 16,4%. Потом написал короткий скрипт на Python с pandas.

Этот вопрос задавали и до меня. В октябре ONS сама опубликовала экспериментальный индекс самого дешёвого варианта каждого из 30 повседневных товаров, собранный с сайтов супермаркетов. У неё вышло около 17% к сентябрю. Я тут не первый. Мне было интересно, насколько ответ зависит от способа счёта.

## Сначала: удастся ли повторить 16,4%

Я посчитал тремя способами. Официальные индексы товаров с их весами в CPI, сцепленные через январь так, как это делает ONS, дают 16,0%. Мой собственный индекс по сырым ценам даёт 16,8%. В нём я сравниваю одну полку с разницей в год, то есть тот же товар в том же регионе и с тем же кодом магазина. Наивный вариант это то, что делаешь с кучей чеков. Берёшь среднее геометрическое всех цен товара в ноябре 2022 года и делишь на то же за ноябрь 2021 года. Никакого сопоставления. Выходит 16,6%.

Разрыв между 16,0% и 16,4% я закрыть не смог. У одной позиции картофеля с весом 0,8 из 116 нет опубликованного индекса, но она объясняет максимум около 0,1 пункта. Остальное сидит внутри опубликованных индексов подклассов. Где именно, я не отследил.

Наивный вариант вышел ближе моего сопоставленного, что меня удивило, но по отдельным товарам он намного хуже, чем кажется. Из 175 товаров у 170 есть официальный индекс в оба года. Для 90% из них наивный счёт расходится с официальным индексом товара где-то от 6 пунктов вниз до 8 пунктов вверх. На 170 товарах эти ошибки в основном гасят друг друга, но на корзину из 15 я бы на это не рассчитывал.

<figure class="fig">
<svg viewBox="0 0 680 370" role="img" aria-label="Точечная диаграмма 170 продуктов и напитков. По горизонтали официальное изменение цены товара с ноября 2021 по ноябрь 2022 года, примерно от −2% до 46%. По вертикали наивное изменение по тем же сырым ценам: среднее геометрическое всех цен ноября 2022 года, делённое на такое же за ноябрь 2021 года. Большинство точек лежит возле диагонали, но с разбросом в несколько пунктов, у 90% товаров от 6 пунктов ниже до 8 пунктов выше. Со взвешиванием наивный счёт даёт 16,6%, официальные индексы товаров 16,0%, опубликованное число 16,4%.">
  <rect x="70" y="20" width="360" height="310" class="f-plain"/>
  <line x1="130.0" y1="330.0" x2="130.0" y2="334.0" class="f-plain"/>
  <text x="130.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="66.0" y1="278.3" x2="70.0" y2="278.3" class="f-plain"/>
  <text x="63.0" y="282.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0</text>
  <line x1="190.0" y1="330.0" x2="190.0" y2="334.0" class="f-plain"/>
  <text x="190.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="66.0" y1="226.7" x2="70.0" y2="226.7" class="f-plain"/>
  <text x="63.0" y="230.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10</text>
  <line x1="250.0" y1="330.0" x2="250.0" y2="334.0" class="f-plain"/>
  <text x="250.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">20</text>
  <line x1="66.0" y1="175.0" x2="70.0" y2="175.0" class="f-plain"/>
  <text x="63.0" y="179.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">20</text>
  <line x1="310.0" y1="330.0" x2="310.0" y2="334.0" class="f-plain"/>
  <text x="310.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">30</text>
  <line x1="66.0" y1="123.3" x2="70.0" y2="123.3" class="f-plain"/>
  <text x="63.0" y="127.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">30</text>
  <line x1="370.0" y1="330.0" x2="370.0" y2="334.0" class="f-plain"/>
  <text x="370.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">40</text>
  <line x1="66.0" y1="71.7" x2="70.0" y2="71.7" class="f-plain"/>
  <text x="63.0" y="75.7" text-anchor="end" class="f-mono f-muted" style="font-size:10px">40</text>
  <line x1="430.0" y1="330.0" x2="430.0" y2="334.0" class="f-plain"/>
  <text x="430.0" y="346.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="66.0" y1="20.0" x2="70.0" y2="20.0" class="f-plain"/>
  <text x="63.0" y="24.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">50</text>
  <line x1="70.0" y1="330.0" x2="430.0" y2="20.0" class="f-line" style="stroke-dasharray:4 3"/>
  <circle cx="206.5" cy="180.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.8" cy="180.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="285.9" cy="152.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="294.1" cy="135.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="220.7" cy="145.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="299.8" cy="163.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="338.9" cy="84.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.7" cy="284.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.8" cy="179.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="150.5" cy="247.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="181.4" cy="261.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="143.8" cy="252.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="202.5" cy="193.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="147.3" cy="277.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.3" cy="226.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="193.4" cy="225.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="253.2" cy="146.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.6" cy="139.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.9" cy="145.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.5" cy="144.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="254.7" cy="130.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="214.1" cy="187.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="151.2" cy="195.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="195.9" cy="224.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="208.8" cy="221.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="286.5" cy="172.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.6" cy="219.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="218.4" cy="204.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.0" cy="207.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="236.8" cy="211.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.3" cy="237.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.7" cy="209.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.3" cy="170.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.6" cy="171.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="212.8" cy="212.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="171.2" cy="222.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="227.1" cy="188.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.6" cy="151.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="222.0" cy="216.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.6" cy="145.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="221.5" cy="177.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.7" cy="265.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="189.4" cy="196.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="305.7" cy="130.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="323.3" cy="139.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="203.4" cy="207.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="230.6" cy="192.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="206.0" cy="195.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.8" cy="185.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="253.5" cy="182.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.6" cy="220.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="183.5" cy="263.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="307.3" cy="141.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="283.2" cy="124.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="281.2" cy="150.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="315.7" cy="120.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="357.1" cy="78.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="271.5" cy="160.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="148.9" cy="253.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.4" cy="80.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.9" cy="190.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="334.8" cy="89.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.5" cy="218.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="318.9" cy="74.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="330.2" cy="108.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="405.5" cy="32.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="194.8" cy="232.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.3" cy="176.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="174.5" cy="230.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="222.7" cy="218.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="284.6" cy="137.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="241.1" cy="186.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.8" cy="207.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="184.1" cy="252.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="170.2" cy="218.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.7" cy="179.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="206.2" cy="230.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="223.1" cy="180.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="368.8" cy="81.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="274.8" cy="120.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="215.6" cy="223.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="215.0" cy="206.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="204.2" cy="218.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="258.5" cy="190.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="267.2" cy="209.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="207.5" cy="211.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="199.3" cy="228.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="256.4" cy="175.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="207.0" cy="204.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="254.9" cy="197.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="115.4" cy="235.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="289.3" cy="119.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="267.1" cy="141.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="184.6" cy="240.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="153.9" cy="249.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="167.7" cy="246.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="153.0" cy="269.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="219.2" cy="178.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="205.6" cy="233.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="145.8" cy="254.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="195.8" cy="214.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="155.5" cy="237.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="137.6" cy="237.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="178.0" cy="232.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="193.0" cy="233.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="172.0" cy="234.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.6" cy="187.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="258.2" cy="181.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="282.1" cy="163.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.0" cy="205.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="219.3" cy="195.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="350.7" cy="134.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="291.6" cy="168.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="190.2" cy="212.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="187.3" cy="230.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="192.2" cy="224.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="134.5" cy="264.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="150.2" cy="249.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="143.9" cy="264.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="263.7" cy="156.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.1" cy="163.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="183.0" cy="224.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="225.0" cy="217.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="147.7" cy="264.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="197.3" cy="212.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="357.4" cy="92.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="286.3" cy="167.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="269.9" cy="120.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="274.0" cy="80.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="158.8" cy="244.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="152.3" cy="241.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="155.1" cy="246.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="164.0" cy="234.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="173.1" cy="244.2" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="158.9" cy="246.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="125.5" cy="270.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="159.7" cy="254.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="204.3" cy="246.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.0" cy="220.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="133.1" cy="231.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.4" cy="212.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="213.5" cy="205.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="224.6" cy="186.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="351.9" cy="52.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="138.4" cy="268.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="148.2" cy="293.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="175.9" cy="238.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="165.0" cy="277.3" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="230.9" cy="187.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="168.6" cy="247.7" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="211.4" cy="225.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="347.5" cy="100.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="362.1" cy="193.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="235.3" cy="199.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="276.9" cy="152.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="272.2" cy="159.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="325.7" cy="127.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="182.0" cy="220.6" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="365.5" cy="94.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="255.5" cy="173.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.7" cy="185.5" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="217.1" cy="161.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="233.4" cy="152.0" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="275.0" cy="141.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="244.7" cy="172.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="179.5" cy="184.4" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="236.3" cy="221.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="154.6" cy="213.8" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="176.3" cy="248.1" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <circle cx="140.9" cy="301.9" r="2.6" class="f-accent" style="fill-opacity:0.55"/>
  <text x="250.0" y="364.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">официальный индекс товара, %</text>
  <text transform="translate(22 175) rotate(-90)" text-anchor="middle" class="f-label f-muted" style="font-size:10px">наивный счёт, все цены, %</text>
  <line x1="470.0" y1="200.0" x2="655.0" y2="200.0" class="f-line"/>
  <line x1="470.0" y1="200.0" x2="470.0" y2="204.0" class="f-plain"/>
  <text x="470.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15,5</text>
  <line x1="531.7" y1="200.0" x2="531.7" y2="204.0" class="f-plain"/>
  <text x="531.7" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">16,0</text>
  <line x1="593.3" y1="200.0" x2="593.3" y2="204.0" class="f-plain"/>
  <text x="593.3" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">16,5</text>
  <line x1="655.0" y1="200.0" x2="655.0" y2="204.0" class="f-plain"/>
  <text x="655.0" y="216.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">17,0</text>
  <circle cx="611.5" cy="200" r="5" class="f-accent"/>
  <circle cx="476.0" cy="246" r="5" class="f-accent"/>
  <text x="488.0" y="250.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">наивный счёт 16,6%</text>
  <rect x="521.0" y="195" width="10" height="10" class="f-box"/>
  <rect x="471.0" y="261" width="10" height="10" class="f-box"/>
  <text x="488.0" y="270.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">индексы ONS 16,0%</text>
  <circle cx="581.0" cy="200" r="5" class="f-ink"/>
  <circle cx="476.0" cy="286" r="5" class="f-ink"/>
  <text x="488.0" y="290.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">опубликовано 16,4%</text>
</svg>
<figcaption>Цены и индексы товаров ONS, ноябрь 2021 и ноябрь 2022 года. Диагональ: наивный счёт равен официальному.</figcaption>
</figure>

## Дешёвая еда

Метод New Statesman на ноябрьских ценах простой: берёшь 10-й перцентиль и медиану каждого товара в оба года. 10-й перцентиль рос быстрее медианы у 98 товаров из 170, медленнее у 68 и так же у 4. Со взвешиванием дешёвые цены выросли на 20,4% против 16,3% у медианы. На этих числах утверждение тоже держится.

Только 10-й перцентиль в 2021 и в 2022 году это разные полки. Мне хотелось одну и ту же полку. Я взял полки, цены которых в ноябре 2021 года попали в самую дешёвую десятую часть по их товару. Потом посмотрел на ту же полку через год. По моему первому счёту они подорожали на 32,9%. Все остальные на 13,6%. Дешёвые полки росли быстрее у 125 из 150 товаров, где сопоставленных полок достаточно. Я проверил, не в распродажах ли дело. Дешёвая цена может быть просто акцией, после которой цена возвращается к обычной. Нет. На распродаже было 6,2% этих полок против 5,5% остальных.

На этом месте у меня был заголовок поста. Потом я посчитал в обратную сторону. Берём самые дешёвые полки ноября 2022 года и смотрим, насколько они подорожали за год до этого. Если дешёвые полки правда растут быстрее, эти должны были вырасти не меньше остальных. Они выросли на 3,8%, против 16,3% у остальных.

Пары отражают друг друга. Так выглядит регрессия к среднему. Допустим, часть разницы цен между полками это шум. Тогда полки, выбранные самыми дешёвыми в начале, потом как будто поднимаются со дна, а выбранные в конце как будто почти не двигались.

Шум был в файлах, я просто не смотрел на флаги. За месяц примерно 1 цена продуктов из 10 помечена: товар заменили или у него поменялся размер. Ещё полка может пропасть на несколько месяцев и вернуться. Тот же товар и код магазина через год часто уже не тот же продукт. Первая моя догадка была про ежегодную смену выборки в феврале. Она оказалась неверной, потому что 99,9% полок переносят январскую цену в февраль.

Тогда я оставил только полки без разрывов: цена во все 13 месяцев и никаких отметок, кроме распродаж. Остаётся 11 082 полки в 142 товарах. Самая дешёвая десятая часть ноября 2021 года подорожала на 25,0%, остальные на 15,7%. В обратную сторону самая дешёвая десятая часть ноября 2022 года подорожала на 14,4%, остальные на 16,6%. Обратный разрыв почти исчез.

<figure class="fig">
<svg viewBox="0 0 680 300" role="img" aria-label="Две панели столбцов, обе с ноября 2021 по ноябрь 2022 года. Слева все полки, сопоставленные по товару, региону и коду магазина: полки из самой дешёвой десятой части в ноябре 2021 подорожали на 32,9%, остальные на 13,6%; полки из самой дешёвой десятой части в ноябре 2022 на 3,8%, остальные на 16,3%. Две пары зеркальны. Справа только полки с ценой во всех 13 месяцах и без отметок, кроме распродаж: самая дешёвая десятая часть в начале подорожала на 25,0%, остальные на 15,7%; самая дешёвая десятая часть в конце на 14,4%, остальные на 16,6%. От зеркала почти ничего не осталось.">
  <text x="30.0" y="22.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">все сопоставленные полки</text>
  <text x="30.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">дешёвая десятая часть выбрана по месяцу:</text>
  <line x1="30.0" y1="250.0" x2="315.0" y2="250.0" class="f-line"/>
  <rect x="40" y="71.6" width="52" height="178.4" class="f-accent"/>
  <text x="66.0" y="65.6" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">32,9%</text>
  <text x="66.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">дешёвые</text>
  <rect x="102" y="176.1" width="52" height="73.9" class="f-box"/>
  <text x="128.0" y="170.1" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">13,6%</text>
  <text x="128.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">остальные</text>
  <text x="97.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">ноябрь 2021</text>
  <rect x="185" y="229.3" width="52" height="20.7" class="f-accent"/>
  <text x="211.0" y="223.3" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">3,8%</text>
  <text x="211.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">дешёвые</text>
  <rect x="247" y="161.3" width="52" height="88.7" class="f-box"/>
  <text x="273.0" y="155.3" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">16,3%</text>
  <text x="273.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">остальные</text>
  <text x="242.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">ноябрь 2022</text>
  <text x="365.0" y="22.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">полки без разрывов и отметок</text>
  <text x="365.0" y="38.0" text-anchor="start" class="f-mono f-muted" style="font-size:10px">дешёвая десятая часть выбрана по месяцу:</text>
  <line x1="365.0" y1="250.0" x2="650.0" y2="250.0" class="f-line"/>
  <rect x="375" y="114.0" width="52" height="136.0" class="f-accent"/>
  <text x="401.0" y="108.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">25,0%</text>
  <text x="401.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">дешёвые</text>
  <rect x="437" y="164.9" width="52" height="85.1" class="f-box"/>
  <text x="463.0" y="158.9" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">15,7%</text>
  <text x="463.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">остальные</text>
  <text x="432.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">ноябрь 2021</text>
  <rect x="520" y="172.0" width="52" height="78.0" class="f-accent"/>
  <text x="546.0" y="166.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">14,4%</text>
  <text x="546.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">дешёвые</text>
  <rect x="582" y="160.0" width="52" height="90.0" class="f-box"/>
  <text x="608.0" y="154.0" text-anchor="middle" class="f-mono f-ink" style="font-size:12px">16,6%</text>
  <text x="608.0" y="265.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">остальные</text>
  <text x="577.0" y="282.0" text-anchor="middle" class="f-mono f-ink" style="font-size:10px">ноябрь 2022</text>
</svg>
<figcaption>Среднее геометрическое изменения цены по полкам. Полка это тот же товар, регион и код магазина. Справа 11 082 полки в 142 товарах.</figcaption>
</figure>

Но какой-то разрыв всё же есть. Вперёд дешёвая десятая часть обогнала остальных на 9,4 пункта. Назад отстала на 2,2 пункта. Настоящий догоняющий рост даёт дешёвым полкам плюс в обе стороны, а шум помогает в одну сторону и мешает в другую. Если шум одинаков в обе стороны, (9,4 − 2,2) / 2 = 3,6 пункта это настоящий догоняющий рост и (9,4 + 2,2) / 2 = 5,8 это шум. Тот же расчёт на всех сопоставленных полках, где вышли 33%, даёт 3,4 пункта догоняющего роста и 15,9 шума. Дешёвые полки действительно росли быстрее, примерно на 3 или 4 пункта за год. Большая часть разрыва между 33% и остальными пришла от полок, у которых за год был разрыв: товар заменили, поменяли размер или он пропадал на несколько месяцев.

## Корзина из 15

Теперь вопрос, с которого я начал. Я собрал корзины из 15 случайных товаров на полках без разрывов, все с равным весом. Каждый товар покупается на 1 случайной полке, так что магазины тоже случайные. 90% таких корзин попали в диапазон от 9,1% до 26,4%. Официальное число 16,4%.

Если вместо 1 полки брать среднее изменение каждого товара, те же корзины из 15 попадают в диапазон от 11,8% до 20,6%. С 2 другими случайными зёрнами эти границы сдвигаются на 0,1 или 0,2 пункта. Список товаров даёт около 9 пунктов разброса, а полка удваивает его примерно до 17.

<figure class="fig">
<svg viewBox="0 0 680 325" role="img" aria-label="Две гистограммы 20 000 случайных корзин из 15 товаров, с ноября 2021 по ноябрь 2022 года, полки без разрывов. Узкая: среднее изменение каждого товара, 90% корзин лежат между 11,8% и 20,6%. Широкая: каждый товар куплен на 1 случайной полке, 90% лежат между 9,1% и 26,4%. Вертикальная линия отмечает опубликованные 16,4%.">
  <text x="40.0" y="42.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">среднее по товару</text>
  <rect x="140.8" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="148.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="156.3" y="149.7" width="6.8" height="0.3" class="f-box"/>
  <rect x="164.0" y="149.8" width="6.8" height="0.2" class="f-box"/>
  <rect x="171.8" y="148.8" width="6.8" height="1.2" class="f-box"/>
  <rect x="179.5" y="147.5" width="6.8" height="2.5" class="f-box"/>
  <rect x="187.3" y="145.2" width="6.8" height="4.8" class="f-box"/>
  <rect x="195.0" y="141.5" width="6.8" height="8.5" class="f-box"/>
  <rect x="202.8" y="136.8" width="6.8" height="13.2" class="f-box"/>
  <rect x="210.5" y="129.6" width="6.8" height="20.4" class="f-box"/>
  <rect x="218.3" y="120.0" width="6.8" height="30.0" class="f-box"/>
  <rect x="226.0" y="112.7" width="6.8" height="37.3" class="f-box"/>
  <rect x="233.8" y="99.6" width="6.8" height="50.4" class="f-box"/>
  <rect x="241.5" y="89.4" width="6.8" height="60.6" class="f-box"/>
  <rect x="249.3" y="75.0" width="6.8" height="75.0" class="f-box"/>
  <rect x="257.0" y="65.8" width="6.8" height="84.2" class="f-box"/>
  <rect x="264.8" y="56.4" width="6.8" height="93.6" class="f-box"/>
  <rect x="272.5" y="50.0" width="6.8" height="100.0" class="f-box"/>
  <rect x="280.3" y="50.3" width="6.8" height="99.7" class="f-box"/>
  <rect x="288.0" y="50.4" width="6.8" height="99.6" class="f-box"/>
  <rect x="295.8" y="52.2" width="6.8" height="97.8" class="f-box"/>
  <rect x="303.5" y="63.0" width="6.8" height="87.0" class="f-box"/>
  <rect x="311.3" y="68.5" width="6.8" height="81.5" class="f-box"/>
  <rect x="319.0" y="78.7" width="6.8" height="71.3" class="f-box"/>
  <rect x="326.8" y="90.3" width="6.8" height="59.7" class="f-box"/>
  <rect x="334.5" y="98.2" width="6.8" height="51.8" class="f-box"/>
  <rect x="342.3" y="107.9" width="6.8" height="42.1" class="f-box"/>
  <rect x="350.0" y="119.7" width="6.8" height="30.3" class="f-box"/>
  <rect x="357.8" y="126.3" width="6.8" height="23.7" class="f-box"/>
  <rect x="365.5" y="134.6" width="6.8" height="15.4" class="f-box"/>
  <rect x="373.3" y="138.0" width="6.8" height="12.0" class="f-box"/>
  <rect x="381.0" y="141.5" width="6.8" height="8.5" class="f-box"/>
  <rect x="388.8" y="144.2" width="6.8" height="5.8" class="f-box"/>
  <rect x="396.5" y="146.3" width="6.8" height="3.7" class="f-box"/>
  <rect x="404.3" y="148.0" width="6.8" height="2.0" class="f-box"/>
  <rect x="412.0" y="148.7" width="6.8" height="1.3" class="f-box"/>
  <rect x="419.8" y="149.3" width="6.8" height="0.7" class="f-box"/>
  <rect x="427.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <rect x="435.3" y="149.5" width="6.8" height="0.5" class="f-box"/>
  <rect x="443.0" y="149.7" width="6.8" height="0.3" class="f-box"/>
  <rect x="458.5" y="149.9" width="6.8" height="0.1" class="f-box"/>
  <line x1="40.0" y1="150.0" x2="660.0" y2="150.0" class="f-line"/>
  <line x1="223.4" y1="52.0" x2="359.1" y2="52.0" class="f-line"/>
  <line x1="223.4" y1="52.0" x2="223.4" y2="58.0" class="f-line"/>
  <line x1="359.1" y1="52.0" x2="359.1" y2="58.0" class="f-line"/>
  <text x="365.1" y="56.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">90%: 11,8 … 20,6</text>
  <text x="40.0" y="172.0" text-anchor="start" class="f-label f-ink" style="font-size:11px">1 случайная полка на товар</text>
  <rect x="40.0" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="47.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="55.5" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="63.3" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="71.0" y="279.8" width="6.8" height="0.2" class="f-accent"/>
  <rect x="78.8" y="279.3" width="6.8" height="0.7" class="f-accent"/>
  <rect x="86.5" y="279.4" width="6.8" height="0.6" class="f-accent"/>
  <rect x="94.3" y="278.8" width="6.8" height="1.2" class="f-accent"/>
  <rect x="102.0" y="278.1" width="6.8" height="1.9" class="f-accent"/>
  <rect x="109.8" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="117.5" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="125.3" y="276.4" width="6.8" height="3.6" class="f-accent"/>
  <rect x="133.0" y="274.7" width="6.8" height="5.3" class="f-accent"/>
  <rect x="140.8" y="274.6" width="6.8" height="5.4" class="f-accent"/>
  <rect x="148.5" y="273.6" width="6.8" height="6.4" class="f-accent"/>
  <rect x="156.3" y="269.9" width="6.8" height="10.1" class="f-accent"/>
  <rect x="164.0" y="266.6" width="6.8" height="13.4" class="f-accent"/>
  <rect x="171.8" y="266.7" width="6.8" height="13.3" class="f-accent"/>
  <rect x="179.5" y="262.9" width="6.8" height="17.1" class="f-accent"/>
  <rect x="187.3" y="259.1" width="6.8" height="20.9" class="f-accent"/>
  <rect x="195.0" y="258.3" width="6.8" height="21.7" class="f-accent"/>
  <rect x="202.8" y="255.1" width="6.8" height="24.9" class="f-accent"/>
  <rect x="210.5" y="250.7" width="6.8" height="29.3" class="f-accent"/>
  <rect x="218.3" y="247.1" width="6.8" height="32.9" class="f-accent"/>
  <rect x="226.0" y="244.2" width="6.8" height="35.8" class="f-accent"/>
  <rect x="233.8" y="240.4" width="6.8" height="39.6" class="f-accent"/>
  <rect x="241.5" y="238.2" width="6.8" height="41.8" class="f-accent"/>
  <rect x="249.3" y="236.5" width="6.8" height="43.5" class="f-accent"/>
  <rect x="257.0" y="237.0" width="6.8" height="43.0" class="f-accent"/>
  <rect x="264.8" y="231.6" width="6.8" height="48.4" class="f-accent"/>
  <rect x="272.5" y="232.8" width="6.8" height="47.2" class="f-accent"/>
  <rect x="280.3" y="228.3" width="6.8" height="51.7" class="f-accent"/>
  <rect x="288.0" y="226.1" width="6.8" height="53.9" class="f-accent"/>
  <rect x="295.8" y="230.1" width="6.8" height="49.9" class="f-accent"/>
  <rect x="303.5" y="224.5" width="6.8" height="55.5" class="f-accent"/>
  <rect x="311.3" y="227.4" width="6.8" height="52.6" class="f-accent"/>
  <rect x="319.0" y="230.6" width="6.8" height="49.4" class="f-accent"/>
  <rect x="326.8" y="229.0" width="6.8" height="51.0" class="f-accent"/>
  <rect x="334.5" y="233.9" width="6.8" height="46.1" class="f-accent"/>
  <rect x="342.3" y="235.1" width="6.8" height="44.9" class="f-accent"/>
  <rect x="350.0" y="237.9" width="6.8" height="42.1" class="f-accent"/>
  <rect x="357.8" y="241.6" width="6.8" height="38.4" class="f-accent"/>
  <rect x="365.5" y="243.2" width="6.8" height="36.8" class="f-accent"/>
  <rect x="373.3" y="246.3" width="6.8" height="33.7" class="f-accent"/>
  <rect x="381.0" y="249.2" width="6.8" height="30.8" class="f-accent"/>
  <rect x="388.8" y="251.2" width="6.8" height="28.8" class="f-accent"/>
  <rect x="396.5" y="255.6" width="6.8" height="24.4" class="f-accent"/>
  <rect x="404.3" y="256.3" width="6.8" height="23.7" class="f-accent"/>
  <rect x="412.0" y="259.3" width="6.8" height="20.7" class="f-accent"/>
  <rect x="419.8" y="258.7" width="6.8" height="21.3" class="f-accent"/>
  <rect x="427.5" y="264.6" width="6.8" height="15.4" class="f-accent"/>
  <rect x="435.3" y="266.7" width="6.8" height="13.3" class="f-accent"/>
  <rect x="443.0" y="268.4" width="6.8" height="11.6" class="f-accent"/>
  <rect x="450.8" y="268.6" width="6.8" height="11.4" class="f-accent"/>
  <rect x="458.5" y="271.2" width="6.8" height="8.8" class="f-accent"/>
  <rect x="466.3" y="273.1" width="6.8" height="6.9" class="f-accent"/>
  <rect x="474.0" y="272.1" width="6.8" height="7.9" class="f-accent"/>
  <rect x="481.8" y="274.1" width="6.8" height="5.9" class="f-accent"/>
  <rect x="489.5" y="276.1" width="6.8" height="3.9" class="f-accent"/>
  <rect x="497.3" y="276.3" width="6.8" height="3.7" class="f-accent"/>
  <rect x="505.0" y="276.1" width="6.8" height="3.9" class="f-accent"/>
  <rect x="512.8" y="276.6" width="6.8" height="3.4" class="f-accent"/>
  <rect x="520.5" y="277.8" width="6.8" height="2.2" class="f-accent"/>
  <rect x="528.3" y="278.3" width="6.8" height="1.7" class="f-accent"/>
  <rect x="536.0" y="278.8" width="6.8" height="1.2" class="f-accent"/>
  <rect x="543.8" y="278.4" width="6.8" height="1.6" class="f-accent"/>
  <rect x="551.5" y="279.2" width="6.8" height="0.8" class="f-accent"/>
  <rect x="559.3" y="279.0" width="6.8" height="1.0" class="f-accent"/>
  <rect x="567.0" y="279.3" width="6.8" height="0.7" class="f-accent"/>
  <rect x="574.8" y="279.4" width="6.8" height="0.6" class="f-accent"/>
  <rect x="582.5" y="279.6" width="6.8" height="0.4" class="f-accent"/>
  <rect x="590.3" y="279.2" width="6.8" height="0.8" class="f-accent"/>
  <rect x="598.0" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="605.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="613.5" y="279.7" width="6.8" height="0.3" class="f-accent"/>
  <rect x="621.3" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="629.0" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <rect x="636.8" y="279.9" width="6.8" height="0.1" class="f-accent"/>
  <line x1="40.0" y1="280.0" x2="660.0" y2="280.0" class="f-line"/>
  <line x1="180.3" y1="182.0" x2="450.0" y2="182.0" class="f-line"/>
  <line x1="180.3" y1="182.0" x2="180.3" y2="188.0" class="f-line"/>
  <line x1="450.0" y1="182.0" x2="450.0" y2="188.0" class="f-line"/>
  <text x="456.0" y="186.0" text-anchor="start" class="f-mono f-ink" style="font-size:11px">90%: 9,1 … 26,4</text>
  <line x1="294.2" y1="26.0" x2="294.2" y2="280.0" class="f-line" style="stroke-dasharray:4 3"/>
  <text x="290.2" y="40.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">опубликовано 16,4%</text>
  <text x="40.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0</text>
  <text x="117.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">5</text>
  <text x="195.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10</text>
  <text x="272.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">15</text>
  <text x="350.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">20</text>
  <text x="427.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">25</text>
  <text x="505.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">30</text>
  <text x="582.5" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">35</text>
  <text x="660.0" y="296.0" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">40</text>
  <text x="350.0" y="314.0" text-anchor="middle" class="f-label f-muted" style="font-size:11px">подорожание корзины, ноябрь 2021 → ноябрь 2022, %</text>
</svg>
<figcaption>Равные веса, полки без разрывов из рисунка 2. Скобки показывают, куда попадают 90% корзин. 5 из 20 000 широких корзин выходят за пределы оси.</figcaption>
</figure>

Если чьи-то чеки показывают 25%, это не доказательство того, что официальное число неверно. Маленькая корзина на случайных полках даёт такое случайно.

## Чего я не проверял

- Количества. В настоящих чеках 3 пачки молока и 1 банка кофе, в моих корзинах веса равные.
- Изменение размера. Товар задан диапазоном размера, например от 750 до 800 г. ONS делает поправку на изменение размера. Я только выбросил отмеченные замены и не смотрел, как часто пачка уменьшалась внутри диапазона.
- Разделение на догоняющий рост и шум предполагает, что шум одинаков в обе стороны. Это допущение, я его не измерял. Полки без разрывов к тому же могут быть другими полками, а не просто более чистыми.
- Остаток разрыва между 16,0% и 16,4%.
- Покупки онлайн и дискаунтеры сверх тех, куда ходят сборщики цен. Это Великобритания и только продукты и напитки.
- Размер корзины в 15 товаров я выбрал сам.
