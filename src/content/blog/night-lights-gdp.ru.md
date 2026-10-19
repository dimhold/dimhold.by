---
title: "Из космоса нефтяной округ Северной Дакоты даёт в 17 раз больше света, чем Манхэттен"
description: "Годовой ночной свет VIIRS по 3080 округам США против ВВП округов BEA из выпуска декабря 2022 года: уровни совпадают на 0,92, рост только через нефтяные месторождения, свет по стране упал на 9,5% к 2016 году без всякой рецессии, а в 2020 году обычные округа потускнели меньше, чем упал их ВВП."
date: 2022-12-20
lang: ru
translationKey: night-lights-gdp
tags: ["open-data", "statistics"]
---
Есть снимок Корейского полуострова ночью: юг весь в огнях, север почти чёрный. Я много раз доставал его, когда меня спрашивали, можно ли измерить экономику по свету со спутника. В разговоре он всегда срабатывал. В этом году ночные огни снова заинтересовали экономистов. Луис Мартинес опубликовал работу, где по ним проверяет, насколько автократии завышают рост своего ВВП. Я понял, что ни разу не смотрел на числа, которые стоят за этой картинкой. Я только знал, что свет и деньги идут вместе. Насколько тесно, я не знал.

Поэтому я взял место с хорошей официальной статистикой и сверил с ней свет. 8 декабря BEA опубликовало ВВП по округам за 2021 год. Это делали и до меня. Хендерсон, Сторигард и Вейл в 2012 году отработали метод на данных по странам. В 2021 году Джон Гибсон с соавтором сделал почти такое же сравнение для округов США, статья вышла в Remote Sensing. Я прочитал их аннотацию и захотел увидеть остальное своими глазами.

## Данные

Свет это годовые композиты VIIRS от Горной школы Колорадо, VNL версии 2.1. Это маскированная средняя яркость, из которой убраны фон и кратковременные источники вроде пожаров. Шаг сетки 15 угловых секунд, около 500 метров. По каждому округу я сложил яркость всех его пикселей с весом по площади пикселя, потому что к северу пиксели становятся меньше. ВВП взят из выпуска BEA от 8 декабря: реальный ВВП округов в цепных долларах 2012 года. Виргиния отчитывается по некоторым независимым городам вместе с их округами, поэтому я объединил их контуры так же. Получилось 3080 единиц в 48 штатах и округе Колумбия. Аляску и Гавайи я из растра не вырезал.

До счёта я записал, чего жду. Уровни совпадут хорошо, корреляция 0,8 или выше. Рост совпадёт слабо, меньше 0,3. Изменения год к году будут близки к шуму. А в 2020 году свет упадёт меньше ВВП или не упадёт совсем, потому что люди сидели дома при включённом свете.

<figure class="fig">
<svg viewBox="0 0 680 330" role="img" aria-label="Две диаграммы плотности по 3080 единицам округов США. Слева уровни 2019 года: суммарный ночной свет в логарифмической шкале против ВВП в логарифмической шкале. Ячейки лежат узкой диагональной полосой, корреляция 0,92. Манхэттен стоит наверху, далеко над полосой: большой ВВП при умеренном свете. Округ Маккензи в Северной Дакоте стоит далеко справа: света больше, чем у Манхэттена, ВВП маленький. Справа рост с 2013 по 2019 год: изменение света против изменения ВВП. Ячейки лежат широким облаком с лёгким наклоном, корреляция 0,33 по всем округам и 0,12 без 124 округов, где добыча больше 30% ВВП. Округа добычи выделены другим цветом и разбросаны гораздо шире остальных, сильнее всего вдоль оси света.">
  <text x="86" y="20" class="f-label">уровень, 2019</text>
  <rect x="86" y="30" width="234" height="230" class="f-plain" style="fill:none"/>
  <line x1="125.0" y1="30" x2="125.0" y2="260" class="f-plain"/>
  <text x="125.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10¹</text>
  <line x1="164.0" y1="30" x2="164.0" y2="260" class="f-plain"/>
  <text x="164.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10²</text>
  <line x1="203.0" y1="30" x2="203.0" y2="260" class="f-plain"/>
  <text x="203.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10³</text>
  <line x1="242.0" y1="30" x2="242.0" y2="260" class="f-plain"/>
  <text x="242.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁴</text>
  <line x1="281.0" y1="30" x2="281.0" y2="260" class="f-plain"/>
  <text x="281.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">10⁵</text>
  <line x1="86" y1="214.0" x2="320" y2="214.0" class="f-plain"/>
  <text x="81" y="217.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100 млн $</text>
  <line x1="86" y1="168.0" x2="320" y2="168.0" class="f-plain"/>
  <text x="81" y="171.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">1 млрд $</text>
  <line x1="86" y1="122.0" x2="320" y2="122.0" class="f-plain"/>
  <text x="81" y="125.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">10 млрд $</text>
  <line x1="86" y1="76.0" x2="320" y2="76.0" class="f-plain"/>
  <text x="81" y="79.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">100 млрд $</text>
  <rect x="207.9" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="232.3" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="233.2" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="198.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="198.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="223.5" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="203.0" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="207.9" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="203.0" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="188.4" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="208.8" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="212.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="222.5" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="223.5" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="188.4" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="228.3" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="188.4" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="242.0" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="243.0" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="218.6" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="246.9" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="237.1" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="227.4" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="218.6" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="198.1" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="199.1" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="246.9" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="203.0" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="232.3" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="223.5" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="178.6" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="173.8" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="183.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="173.8" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="207.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="173.8" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="222.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="251.8" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="125.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="193.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="212.8" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="183.5" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="188.4" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="242.0" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="212.8" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="183.5" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="184.5" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="251.8" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="188.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="189.3" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="285.9" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="165.0" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="266.4" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="266.4" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="251.8" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="193.3" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="261.5" y="58.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="222.5" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="139.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="188.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="189.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="232.3" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="242.0" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="203.0" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="198.1" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="164.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="237.1" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="193.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="222.5" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="203.0" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="188.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="168.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="164.0" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="178.6" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="149.4" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="150.3" y="209.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="178.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="179.6" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="246.9" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="199.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="203.0" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="188.4" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="189.3" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="178.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="179.6" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="115.3" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="169.8" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="164.0" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="149.4" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="203.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="204.0" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="173.8" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="129.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="198.1" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="237.1" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="246.9" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="242.0" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="212.8" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="207.9" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="246.9" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="256.6" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="173.8" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="174.7" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="261.5" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="251.8" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="271.3" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="242.0" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="207.9" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="217.6" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="227.4" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="159.1" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="213.7" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="217.6" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="164.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="99.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="173.8" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="160.1" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="183.5" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="164.0" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="165.0" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="154.3" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="155.2" y="203.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="193.3" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="194.2" y="163.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="173.8" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="174.7" y="180.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="164.0" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="179.6" y="174.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="281.0" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="159.1" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="207.9" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="256.6" y="76.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="222.5" y="122.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="227.4" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="154.3" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="144.5" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="149.4" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="159.1" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="164.0" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="154.3" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="155.2" y="192.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="159.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="188.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="168.9" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="139.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="208.8" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="217.6" y="162.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="227.4" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="198.1" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="227.4" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="227.4" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="228.3" y="157.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="217.6" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="164.0" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="237.1" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="251.8" y="64.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="237.1" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="237.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="242.0" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="173.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="256.6" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="193.3" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="183.5" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="133.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="233.2" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:1.00"/>
  <rect x="149.4" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="178.6" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="87.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="251.8" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="154.3" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="134.8" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="135.7" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="134.8" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="154.3" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="115.3" y="248.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="212.8" y="168.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="125.0" y="242.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="139.6" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="115.3" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="134.8" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="139.6" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="144.5" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="276.1" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="145.5" y="232.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="242.0" y="81.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="232.3" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="227.4" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="257.6" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="126.0" y="220.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="222.5" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="232.3" y="35.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="203.0" y="127.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="198.1" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="207.9" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="204.0" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="262.5" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="282.0" y="134.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="168.9" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="149.4" y="202.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="262.5" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="204.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="179.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="125.0" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="150.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="154.3" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="225.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="168.9" y="231.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="183.5" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="246.9" y="110.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="232.3" y="145.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="233.2" y="146.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="198.1" y="208.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="151.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="276.1" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="285.9" y="47.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="174.7" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="251.8" y="104.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="129.9" y="214.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="247.8" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="159.1" y="185.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="160.1" y="186.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="140.6" y="197.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="123.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="252.7" y="117.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="233.2" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="257.6" y="100.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="144.5" y="237.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="238.1" y="140.4" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="243.0" y="128.9" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="267.4" y="111.7" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="145.5" y="169.2" width="2.9" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="271.3" y="70.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="178.6" y="156.5" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="207.9" y="116.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="217.6" y="93.3" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="149.4" y="196.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="120.1" y="219.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="144.5" y="191.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="256.6" y="53.0" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="159.1" y="173.8" width="4.9" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <text x="203" y="290" text-anchor="middle" class="f-label f-muted">свет (лог)</text>
  <text x="90" y="42" class="f-label f-muted">ВВП (лог)</text>
  <text x="400" y="20" class="f-label">рост, 2013 → 2019</text>
  <rect x="400" y="30" width="260" height="230" class="f-plain" style="fill:none"/>
  <line x1="450.6" y1="30" x2="450.6" y2="260" class="f-plain"/>
  <text x="450.6" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">−60%</text>
  <line x1="530.0" y1="30" x2="530.0" y2="260" class="f-plain"/>
  <text x="530.0" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="609.4" y1="30" x2="609.4" y2="260" class="f-plain"/>
  <text x="609.4" y="274" text-anchor="middle" class="f-mono f-muted" style="font-size:10px">+150%</text>
  <line x1="400" y1="223.3" x2="660" y2="223.3" class="f-plain"/>
  <text x="395" y="226.3" text-anchor="end" class="f-mono f-muted" style="font-size:10px">−40%</text>
  <line x1="400" y1="145.0" x2="660" y2="145.0" class="f-plain"/>
  <text x="395" y="148.0" text-anchor="end" class="f-mono f-muted" style="font-size:10px">0%</text>
  <line x1="400" y1="72.9" x2="660" y2="72.9" class="f-plain"/>
  <text x="395" y="75.9" text-anchor="end" class="f-mono f-muted" style="font-size:10px">+60%</text>
  <rect x="524.6" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="551.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="540.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="546.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="519.2" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="547.3" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="557.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="540.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="540.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="541.9" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="535.4" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="536.5" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="536.5" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="536.5" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="524.6" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="524.6" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="536.5" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="525.7" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="546.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="519.2" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="530.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="557.1" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="519.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="492.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="535.4" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="536.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="531.1" y="100.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="519.2" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="513.8" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="514.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="513.8" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="513.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="514.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="540.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="486.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="541.9" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="504.0" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="493.2" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="520.3" y="157.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="497.5" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="508.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="530.0" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="502.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="519.2" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="502.9" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="535.4" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="557.1" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="54.1" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="513.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="514.8" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.85"/>
  <rect x="508.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="509.4" y="134.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="551.7" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="546.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="551.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="525.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="541.9" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="524.6" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="525.7" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="551.7" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.89"/>
  <rect x="513.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="530.0" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="535.4" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="595.0" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="546.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="497.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.68"/>
  <rect x="540.8" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="567.9" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="569.0" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="237.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="535.4" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="551.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="562.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="535.4" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="504.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.75"/>
  <rect x="514.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="502.9" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="508.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="519.2" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="524.6" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="502.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="519.2" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="520.3" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="151.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="498.6" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="509.4" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="508.3" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="509.4" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="254.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="567.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="513.8" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="530.0" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="531.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="513.8" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="497.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="513.8" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="502.9" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="486.7" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="497.5" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="498.6" y="146.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="508.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.82"/>
  <rect x="502.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="540.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="30.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.47"/>
  <rect x="486.7" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="519.2" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="530.0" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="531.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.90"/>
  <rect x="546.3" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="502.9" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="551.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="552.8" y="163.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="574.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="584.2" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="519.2" y="202.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="639.4" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="632.9" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="611.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="470.4" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="471.5" y="140.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="492.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="497.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.61"/>
  <rect x="498.6" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.54"/>
  <rect x="481.3" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="498.6" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="486.7" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="498.6" y="105.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="481.3" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.40"/>
  <rect x="481.3" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="486.7" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="502.9" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="513.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="595.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="502.9" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="492.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="519.2" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="145.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="508.3" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="567.9" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="35.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="99.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="248.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="122.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="563.6" y="123.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="567.9" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="525.7" y="215.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="552.8" y="169.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="540.8" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="541.9" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="546.3" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="530.0" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="238.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="590.7" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="508.3" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="509.4" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="601.5" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="481.3" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="497.5" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="401.1" y="192.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="634.0" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="519.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="601.5" y="111.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="444.4" y="249.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="579.8" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="611.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="524.6" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="525.7" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="502.9" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="486.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="437.9" y="185.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="632.9" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="584.2" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="128.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="551.7" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="540.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="65.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="643.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="492.1" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="427.1" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="520.3" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="487.8" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="104.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="605.8" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="76.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="173.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="470.4" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="508.3" y="87.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="481.3" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="476.9" y="71.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="492.1" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="551.7" y="70.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="540.8" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="541.9" y="82.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="530.0" y="208.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="225.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="578.8" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="567.9" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="551.7" y="93.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="578.8" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="546.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="562.5" y="127.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.33"/>
  <rect x="590.7" y="174.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="191.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="186.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="77.2" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="573.3" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="58.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="411.9" y="180.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="574.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="196.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="639.4" y="36.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="627.5" y="219.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="482.3" y="197.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="535.4" y="53.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="439.0" y="203.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="562.5" y="156.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="459.6" y="179.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="448.8" y="168.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="41.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="650.3" y="48.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="612.3" y="117.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="558.2" y="94.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="649.2" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="573.3" y="150.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="524.6" y="81.8" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="557.1" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.26"/>
  <rect x="562.5" y="116.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="546.3" y="64.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="487.8" y="232.4" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="459.6" y="162.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="530.0" y="214.0" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="514.8" y="220.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="509.4" y="59.9" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="471.5" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <rect x="497.5" y="110.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="465.0" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="486.7" y="133.5" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="475.8" y="139.3" width="5.4" height="5.8" class="f-ink" style="fill-opacity:0.19"/>
  <rect x="596.1" y="88.7" width="3.3" height="3.4" class="f-accent" style="fill-opacity:0.70"/>
  <text x="530" y="290" text-anchor="middle" class="f-label f-muted">изменение света</text>
  <text x="404" y="42" class="f-label f-muted">изменение ВВП</text>
  <circle cx="233.7" cy="38.9" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <text x="241.7" y="31.9" text-anchor="start" class="f-label">Манхэттен</text>
  <circle cx="282.1" cy="136.2" r="4" class="f-line" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  <line x1="282.1" y1="141.2" x2="282.1" y2="186.2" class="f-line" style="stroke:var(--accent);stroke-width:1"/>
  <text x="326.0" y="198.2" text-anchor="end" class="f-label">Маккензи</text>
  <rect x="60" y="306" width="12" height="12" class="f-ink" style="fill-opacity:0.45"/>
  <text x="80" y="316" class="f-label f-muted">остальные округа</text>
  <rect x="262" y="308" width="8" height="8" class="f-accent"/>
  <text x="278" y="316" class="f-label f-muted">добыча &gt; 30% ВВП</text>
</svg>
<figcaption>Годовые композиты VIIRS (VNL v2.1), просуммированные по каждому округу, реальный ВВП BEA из выпуска 8 декабря 2022 года. Чем темнее ячейка, тем больше в ней округов. Правая панель показывает свет от −78% до +348% и ВВП от −53% до +112%, за её край выходят 30 округов.</figcaption>
</figure>

## Уровни

За 2019 год корреляция логарифма света с логарифмом ВВП по 3080 округам равна 0,92. Наклон 1,03, то есть где света на 10% больше, там и ВВП примерно на 10% больше. В 2013 и 2021 годах то же самое. У 80% округов в середине распределения ВВП на единицу света различается примерно в 4 раза.

Крайнюю пару я бы показывал в докладе вместо Кореи. Манхэттен в 2019 году произвёл 641 млрд долларов. Округ Маккензи в Северной Дакоте произвёл 4,9 млрд. Маккензи в сумме даёт в 17 раз больше света, но он и в 120 раз больше по площади, так что на квадратный километр он темнее. На доллар ВВП разница примерно в 2300 раз. Маккензи лежит посреди нефтяного месторождения Баккен. Я предполагаю, что большая часть этого света это газовые факелы и освещённые буровые площадки, но на снимке я их не разделял.

124 округа, где добыча больше 30% ВВП, дают 1,1% ВВП моей выборки в текущих долларах и 7,8% света. Светится при этом не каждый такой округ: у медианного из них ВВП на единицу света примерно такой же, как у обычного округа. Свет дают несколько гигантов в Баккене и Пермском бассейне.

## Рост

С 2013 по 2019 год корреляция изменения света с изменением ВВП равна 0,33, чуть выше, чем я ждал. Потом я убрал эти 124 округа добычи и она упала до 0,12. Большая часть сигнала роста пришла с нефтяных месторождений, где бум означает разом больше факелов и больше денег. В обычном округе свет рос или падал в основном сам по себе, по крайней мере в этом масштабе.

Более простая проверка говорит то же. Я сравнил, рос ли округ быстрее медианного, по свету и по ВВП. Ответы совпали в 54% округов, это монетка с небольшим перекосом. Год к году ещё хуже. По каждой паре соседних лет корреляция держится в пределах от −0,02 до 0,15.

Объединение округов в штаты мне не помогло. По 49 штатам корреляция роста 0,10, а уровни по-прежнему дают 0,81. Я ждал, что на уровне штата шум усреднится, но этого не случилось.

## Где я ошибся насчёт ряда

Потом я сложил свет по всей стране. Он падал 3 года, пока ВВП рос.

<figure class="fig">
<svg viewBox="0 0 680 320" role="img" aria-label="Линейный график, индекс, 2013 год равен 100, годы с 2013 по 2021. Реальный ВВП 3080 единиц округов равномерно растёт до 115,2 в 2019 году, проседает до 112,0 в 2020 и доходит до 118,5 в 2021. Суммарный ночной свет падает со 100 до 90,5 в 2016 году, прыгает до 98,1 в 2017, доходит до 101,5 в 2019, падает до 97,2 в 2020 и возвращается к 101,2 в 2021. Свет без округов добычи падает так же глубоко, до 90,6 в 2016 году, а потом идёт ниже: 97,5 в 2019 и 95,9 в 2020.">
  <line x1="60" y1="208.5" x2="640" y2="208.5" class="f-plain"/>
  <text x="54" y="212.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">90</text>
  <line x1="60" y1="153.5" x2="640" y2="153.5" class="f-plain"/>
  <text x="54" y="157.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">100</text>
  <line x1="60" y1="98.5" x2="640" y2="98.5" class="f-plain"/>
  <text x="54" y="102.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">110</text>
  <line x1="60" y1="43.5" x2="640" y2="43.5" class="f-plain"/>
  <text x="54" y="47.5" text-anchor="end" class="f-mono f-muted" style="font-size:11px">120</text>
  <text x="60.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2013</text>
  <text x="132.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2014</text>
  <text x="205.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2015</text>
  <text x="277.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2016</text>
  <text x="350.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2017</text>
  <text x="422.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2018</text>
  <text x="495.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2019</text>
  <text x="567.5" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2020</text>
  <text x="640.0" y="252" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">2021</text>
  <path d="M60.0,153.5L132.5,140.3L205.0,124.9L277.5,115.0L350.0,101.8L422.5,84.8L495.0,69.9L567.5,87.5L640.0,51.8" class="f-line" style="stroke:var(--ink);stroke-width:2"/>
  <path d="M60.0,153.5L132.5,166.1L205.0,186.5L277.5,205.2L350.0,167.3L422.5,170.5L495.0,167.3L567.5,176.0L640.0,149.6" class="f-line" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <path d="M60.0,153.5L132.5,162.3L205.0,182.1L277.5,205.8L350.0,164.0L422.5,156.8L495.0,145.3L567.5,168.9L640.0,146.9" class="f-line" style="stroke:var(--accent);stroke-width:2.5"/>
  <circle cx="60.0" cy="153.5" r="3" class="f-accent"/>
  <circle cx="132.5" cy="162.3" r="3" class="f-accent"/>
  <circle cx="205.0" cy="182.1" r="3" class="f-accent"/>
  <circle cx="277.5" cy="205.8" r="3" class="f-accent"/>
  <circle cx="350.0" cy="164.0" r="3" class="f-accent"/>
  <circle cx="422.5" cy="156.8" r="3" class="f-accent"/>
  <circle cx="495.0" cy="145.3" r="3" class="f-accent"/>
  <circle cx="567.5" cy="168.9" r="3" class="f-accent"/>
  <circle cx="640.0" cy="146.9" r="3" class="f-accent"/>
  <text x="283.5" y="221.8" class="f-mono f-ink" style="font-size:11px">90,5</text>
  <text x="636.0" y="43.8" text-anchor="end" class="f-mono f-ink" style="font-size:11px">118,5</text>
  <line x1="60" y1="274" x2="82" y2="274" style="stroke:var(--ink);stroke-width:2"/>
  <text x="90" y="278" class="f-label f-muted">ВВП</text>
  <line x1="60" y1="292" x2="82" y2="292" style="stroke:var(--accent);stroke-width:2.5"/>
  <text x="90" y="296" class="f-label f-muted">свет, все округа</text>
  <line x1="60" y1="310" x2="82" y2="310" style="stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 4"/>
  <text x="90" y="314" class="f-label f-muted">свет без округов добычи</text>
</svg>
<figcaption>Суммы по тем же 3080 единицам, индекс 2013 = 100. Округа добычи это те, где добыча в 2019 году давала больше 30% ВВП.</figcaption>
</figure>

С 2013 по 2016 год сумма упала на 9,5%, а ВВП вырос на 7%. В 2017 году она скачком почти вернулась назад. За один год посветлели 95,6% округов, медианный округ на 19%.

Первым объяснением была нефть. Цены обвалились с середины 2014 до начала 2016 года и 4 крупнейших округа Баккена потеряли с 2014 по 2016 год около 38% света. Всё ложилось красиво, поэтому я это проверил. Объяснение оказалось неверным. Округа добычи объясняют меньше 5% падения по стране до 2016 года. Пунктир без них падает так же глубоко. С 2013 по 2016 год свет упал в 45 штатах из 49. Среди них Вермонт и Мэриленд, где нефти нет вообще. Я не знаю, чем это вызвано. Это может быть обработка композитов или сам датчик. Сомневаюсь, что какая-то экономика за один год делает светлее 95,6% округов.

Это изменило и то, как я читаю 2020 год. Свет упал на 4,2%, ВВП на 2,8%, то есть свет упал сильнее ВВП, вопреки моему ожиданию. Но 63% этого падения дали округа добычи, в основном нефтяные месторождения Техаса и Северной Дакоты. Там свет, вероятно, упал вместе с факелами, когда упала цена нефти. Без них свет упал на 1,7%, а ВВП на 2,8%. Для обычных округов ожидание снова сходится. Медианный округ в 2020 году даже посветлел на 1,9%, а Манхэттен потерял 8% света. Но тот же ряд к 2016 году упал на 9,5% вообще без рецессии. Разница в один процентный пункт в нём мало что доказывает.

## Что мне это даёт

Какой округ большой, свет говорит довольно хорошо. Для роста он в основном сработал в нефтяных округах, где сам бум виден как факелы. Для страны без честной статистики уровень всё равно лучше, чем ничего. Корейский снимок показывает уровни, а я доставал его в спорах о росте.

## Чего я не проверял

Свои числа с таблицами статьи Гибсона я не сверял. BEA каждый год пересматривает ВВП округов, так что следующий выпуск сдвинет отдельные числа. Растр, который я складывал, хранит яркость, округлённую до целых единиц, поэтому пиксели слабее половины единицы в нём нулевые. Сколько света так теряют сельские округа, я не проверял.

Газовые факелы остались в данных, хотя Горная школа Колорадо публикует отдельный каталог факелов. Поправки на население и площадь нет. Корреляции роста посчитаны по округам, поэтому скачок, общий для всех округов, их не двигает. Другие единицы я тоже не пробовал. Города или ячейки по 10 км могут вести себя иначе, чем округа, границы которых провели задолго до того, как кто-то стал мерить свет.

2022 года в сравнении нет: его годовой композит и ВВП округов ещё не опубликованы.
