---
title: "В 17% токенов люди выходят за первые 40 вариантов GPT-2"
description: "В скрипте GPT-2 написано, что 40 для top_k обычно хорошее значение. Я сравнил 8 настроек сэмплирования с 24 новостями, которые написали люди. k=40 по предсказуемости это примерно температура 0,8, а люди выходят за первые 40 вариантов в 17,2% токенов."
date: 2019-04-07
lang: ru
translationKey: gpt2-sampling
tags: ["llm", "machine-learning", "statistics"]
---

```
The team found that the statues were built in the early 1800s, and that they were built in the early 1900s.
```

Так GPT-2 продолжает новость про остров Пасхи, если на каждом шаге брать самый вероятный токен, только первое "The" ещё из статьи. Вместе с переводами строк в этой фразе 27 токенов. Модель написала её 4 раза подряд и на пятом упёрлась в мой предел в 128 токенов. В первый раз вероятность всей фразы была примерно 4 к 10^18, в четвёртый 8,6%.

Что жадный выбор выглядит именно так, я знал, поэтому делал как написано в репозитории. В `DEVELOPERS.md` (коммит d14501a) есть пример с `--top_k 40 --temperature 0.7`, а в докстринге скрипта сказано "40 generally is a good value". Я скопировал 40 и ни разу не спросил, по сравнению с чем это хорошо. Сравнить, кажется, можно только с текстом, который написали люди.

Top-k для генерации рассказов есть в прошлогодней статье Фан, Льюиса и Дофина, у них k было 10. Качча с соавторами в ноябре перебрали температуры и построили кривую, где по осям качество и разнообразие. Мне нужны были только числа для этой модели и этих 40.

## Что я запускал

Модель GPT-2 117M, других размеров OpenAI пока не выложила. Чекпойнт оказался обычным файлом на 497 759 232 байта, внутри float32 в алфавитном порядке имён переменных. Так что я прочитал его без TensorFlow и написал модель на numpy, вышло строк 45. Параметров в файле 124 439 808, почему в названии 117M, я не знаю. Сэмплирование повторяет `sample.py`: сначала температура, потом top-k.

Тексты я взял из английских Викиновостей, 24 статьи за январь и первые дни февраля. Модель объявили 14 февраля, в обучающую выборку эти статьи вряд ли попали, хотя проверить я не могу. Первые 40 токенов служат началом. Человеческий вариант это следующие 128 токенов статьи, модель пишет свои 128. Случайные числа у всех настроек одни и те же.

Дальше каждый токен, человеческий или сгенерированный, оценивает сама модель, без температуры и без обрезки. Перплексия это экспонента от среднего отрицательного логарифма вероятности: 25 значит, что модель удивляется примерно как выбору из 25 равных вариантов. Повтор 4-граммы это 4 токена подряд, которые в том же продолжении уже были. До запуска я записал 5 предположений.

| настройка | перплексия | первый выбор | дальше 40 | повторы 4-грамм |
|---|---|---|---|---|
| люди | 25,4 | 38,2% | 17,2% | 0,3% |
| T=1 | 36,2 | 35,4% | 22,3% | 0,3% |
| T=0,9 | 18,4 | 41,1% | 13,8% | 0,5% |
| T=0,8 | 9,7 | 50,8% | 6,9% | 1,6% |
| T=0,7 | 6,4 | 59,0% | 4,8% | 6,1% |
| k=40 | 9,6 | 44,2% | 0 | 1,2% |
| k=10 | 6,1 | 52,7% | 0 | 4,6% |
| k=40, T=0,7 | 5,1 | 62,0% | 0 | 8,9% |
| жадный | 1,8 | 100% | 0 | 63,8% |

## 40 это примерно температура 0,8

Я думал, что k=40 поведёт себя как T=0,9. По перплексии вышло T=0,8, на 24 статьях я их не различаю. У обеих настроек она в 2,6 раза ниже, чем у людей. А внутри они разные. При T=0,8 в половине шагов берётся первый токен списка и всё равно 213 токенов из 3072 взяты дальше сорокового места. При k=40 верх списка ближе к человеческому, а хвоста просто нет.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Составные полосы с местами токенов в списке GPT-2 117M: человеческий текст и 7 настроек сэмплирования. люди: первый выбор 38,2%, места со 2 по 10 32,6%, с 11 по 40 12,1%, дальше 40 17,2%, перплексия 25,4; T=1: первый выбор 35,4%, места со 2 по 10 30,0%, с 11 по 40 12,2%, дальше 40 22,3%, перплексия 36,2; T=0,9: первый выбор 41,1%, места со 2 по 10 33,4%, с 11 по 40 11,7%, дальше 40 13,8%, перплексия 18,4; T=0,8: первый выбор 50,8%, места со 2 по 10 33,2%, с 11 по 40 9,1%, дальше 40 6,9%, перплексия 9,7; T=0,7: первый выбор 59,0%, места со 2 по 10 31,2%, с 11 по 40 5,0%, дальше 40 4,8%, перплексия 6,4; k=40: первый выбор 44,2%, места со 2 по 10 40,5%, с 11 по 40 15,3%, дальше 40 0,0%, перплексия 9,6; k=10: первый выбор 52,7%, места со 2 по 10 47,3%, с 11 по 40 0,0%, дальше 40 0,0%, перплексия 6,1; k=40, T=0,7: первый выбор 62,0%, места со 2 по 10 31,0%, с 11 по 40 7,0%, дальше 40 0,0%, перплексия 5,1.">
  <rect x="108" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <text x="125.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">первый выбор</text>
  <rect x="220" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="237.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">со 2 по 10</text>
  <rect x="318" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="335.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">с 11 по 40</text>
  <rect x="416" y="12" width="11" height="11" style="fill:var(--accent);stroke:none"/>
  <text x="433.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">дальше 40</text>
  <text x="670.0" y="22.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">перплексия</text>
  <text x="100.0" y="61.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">люди</text>
  <rect x="108.0" y="48" width="183.9" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="291.9" y="48" width="157.1" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="448.9" y="48" width="58.2" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="507.2" y="48" width="82.8" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="61.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">25,4</text>
  <text x="100.0" y="95.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=1</text>
  <rect x="108.0" y="82" width="170.9" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="278.9" y="82" width="144.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="423.7" y="82" width="59.0" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="482.7" y="82" width="107.3" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="95.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">36,2</text>
  <text x="100.0" y="123.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0,9</text>
  <rect x="108.0" y="110" width="198.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="306.2" y="110" width="160.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="467.0" y="110" width="56.3" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="523.3" y="110" width="66.7" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="123.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">18,4</text>
  <text x="100.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0,8</text>
  <rect x="108.0" y="138" width="244.8" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="352.8" y="138" width="159.9" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="512.6" y="138" width="43.9" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="556.6" y="138" width="33.4" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="151.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">9,7</text>
  <text x="100.0" y="179.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">T=0,7</text>
  <rect x="108.0" y="166" width="284.6" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="392.6" y="166" width="150.5" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="543.1" y="166" width="24.0" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <rect x="567.1" y="166" width="22.9" height="18" style="fill:var(--accent);stroke:none"/>
  <text x="670.0" y="179.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">6,4</text>
  <text x="100.0" y="207.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=40</text>
  <rect x="108.0" y="194" width="213.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="321.2" y="194" width="195.0" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="516.3" y="194" width="73.7" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="670.0" y="207.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">9,6</text>
  <text x="100.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=10</text>
  <rect x="108.0" y="222" width="254.2" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="362.2" y="222" width="227.8" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="670.0" y="235.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">6,1</text>
  <text x="100.0" y="263.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">k=40, T=0,7</text>
  <rect x="108.0" y="250" width="298.7" height="18" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <rect x="406.7" y="250" width="149.5" height="18" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <rect x="556.3" y="250" width="33.7" height="18" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="670.0" y="263.0" text-anchor="end" class="f-mono f-ink" style="font-size:11px">5,1</text>
</svg>
<figcaption>На каком месте в списке самой модели стоял выбранный токен, доли от 3072 токенов в строке. Справа перплексия. В строках с k последнего куска нет, его отрезали.</figcaption>
</figure>

У сочетания из документации, 40 и 0,7, перплексия ниже человеческой в 5 раз. Повторов 4-грамм у него 8,9%, у людей 0,3%. От обычного k=40 я ждал повторов как у людей, получилось 37, а у людей 8. В первых трёх столбцах люди стоят между T=0,9 и T=1. Про перплексию я так и думал, из пяти предположений сбылось только это. Но я ещё записал, что ближе всего к людям будет T=1, а это неверно, T=0,9 ближе.

## Где 40 много и где мало

Я ждал, что люди выйдут за первые 40 примерно в 10% токенов. Они вышли 528 раз, это 17,2%, от 9 до 31 раза на статью. Модель это совсем не удивляет. Если на тех же позициях сложить вероятность, которую она отдаёт всему за пределами сорока, получится 17,9%.

После "adult penguins, rather" модель даёт 99,3% токену "than", остальные 39 мест делят полпроцента. После "According to ecologist Chip" должна идти фамилия и все 40 токенов вместе набирают 18,6%. В 11,5% позиций у первых сорока больше 99% вероятности, в 5,1% меньше половины. Там, где модель увереннее всего (четверть позиций), люди выходят за 40 в 3,0% токенов. В самой неуверенной четверти таких 39,8%.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Гистограмма суммарной вероятности 40 верхних токенов по 3072 позициям человеческого текста. от 0 до 10%: 0; от 10 до 20%: 1; от 20 до 30%: 13; от 30 до 40%: 44; от 40 до 50%: 98; от 50 до 60%: 192; от 60 до 70%: 326; от 70 до 80%: 489; от 80 до 90%: 639; от 90 до 100%: 1270.">
  <line x1="70" y1="210.0" x2="650" y2="210.0" class="f-plain"/>
  <text x="62.0" y="214.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">0</text>
  <line x1="70" y1="147.1" x2="650" y2="147.1" class="f-plain"/>
  <text x="62.0" y="151.1" text-anchor="end" class="f-mono f-muted" style="font-size:11px">500</text>
  <line x1="70" y1="84.3" x2="650" y2="84.3" class="f-plain"/>
  <text x="62.0" y="88.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1000</text>
  <rect x="74.0" y="210.0" width="50.0" height="0.0" style="fill:var(--accent);stroke:none"/>
  <text x="99.0" y="204.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">0</text>
  <text x="70.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <rect x="132.0" y="209.9" width="50.0" height="0.1" style="fill:var(--accent);stroke:none"/>
  <text x="157.0" y="203.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1</text>
  <text x="128.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">10</text>
  <rect x="190.0" y="208.4" width="50.0" height="1.6" style="fill:var(--accent);stroke:none"/>
  <text x="215.0" y="202.4" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">13</text>
  <text x="186.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">20</text>
  <rect x="248.0" y="204.5" width="50.0" height="5.5" style="fill:var(--accent);stroke:none"/>
  <text x="273.0" y="198.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">44</text>
  <text x="244.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">30</text>
  <rect x="306.0" y="197.7" width="50.0" height="12.3" style="fill:var(--accent);stroke:none"/>
  <text x="331.0" y="191.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">98</text>
  <text x="302.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">40</text>
  <rect x="364.0" y="185.9" width="50.0" height="24.1" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="389.0" y="179.9" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">192</text>
  <text x="360.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">50</text>
  <rect x="422.0" y="169.0" width="50.0" height="41.0" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="447.0" y="163.0" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">326</text>
  <text x="418.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">60</text>
  <rect x="480.0" y="148.5" width="50.0" height="61.5" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="505.0" y="142.5" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">489</text>
  <text x="476.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">70</text>
  <rect x="538.0" y="129.7" width="50.0" height="80.3" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="563.0" y="123.7" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">639</text>
  <text x="534.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <rect x="596.0" y="50.3" width="50.0" height="159.7" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="621.0" y="44.3" text-anchor="middle" class="f-mono f-ink" style="font-size:11px">1270</text>
  <text x="592.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">90</text>
  <text x="650.0" y="226.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">100</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">позиций из 3072</text>
  <text x="360.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">вероятность 40 верхних токенов вместе, %</text>
</svg>
<figcaption>Сколько вероятности умещается в 40 токенов на каждой позиции человеческого текста. Справа 40 обычно с запасом, слева этого совсем мало.</figcaption>
</figure>

## Сколько стоит хвост

Тут я уже готов был написать, что 40 это плохо, а настройки по умолчанию, T=1 без обрезки, хорошие. Потом я разделил 128 токенов пополам. В первых 64 перплексия T=1 равна 30,9, у людей 29,7. Во вторых 42,3 против 21,7. У T=1 вторая половина труднее первой в 19 текстах из 24, у людей в 6 из 24.

Худшее продолжение из 24 получило 297, при том что у самой трудной человеческой статьи 51. Сама статья про Польшу. Шестой токен продолжения начинает слово "discotex", в списке модели он стоял на 6318-м месте. Вскоре появляется Нарендра Моди, за ним твит и "Maryobiot bonus bank". Я объясняю это так: один странный токен из хвоста остаётся в контексте и всё дальнейшее вынуждено от него отталкиваться. Проверять это я не стал. Без этого текста у T=1 выходит 33,0, а по половинам 28,6 и 38,1. Если сравнивать по статьям, всё не так ясно: T=1 выше людей в 14 из 24. У k=40 ничего похожего нет: 10,0 в первой половине, 9,2 во второй, а у худшего текста 13,6.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Перплексия по кускам в 16 токенов, 4 линии, логарифмическая шкала. T=1: от 25,8 в первом куске до 37,9 в последнем; люди: от 28,2 в первом куске до 21,8 в последнем; k=40: от 9,2 в первом куске до 9,6 в последнем; жадный: от 3,8 в первом куске до 1,1 в последнем.">
  <line x1="60" y1="230.0" x2="590" y2="230.0" class="f-plain"/>
  <text x="52.0" y="234.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">1</text>
  <line x1="60" y1="197.3" x2="590" y2="197.3" class="f-plain"/>
  <text x="52.0" y="201.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">2</text>
  <line x1="60" y1="164.7" x2="590" y2="164.7" class="f-plain"/>
  <text x="52.0" y="168.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">4</text>
  <line x1="60" y1="132.0" x2="590" y2="132.0" class="f-plain"/>
  <text x="52.0" y="136.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">8</text>
  <line x1="60" y1="99.3" x2="590" y2="99.3" class="f-plain"/>
  <text x="52.0" y="103.3" text-anchor="end" class="f-mono f-muted" style="font-size:11px">16</text>
  <line x1="60" y1="66.7" x2="590" y2="66.7" class="f-plain"/>
  <text x="52.0" y="70.7" text-anchor="end" class="f-mono f-muted" style="font-size:11px">32</text>
  <line x1="60" y1="34.0" x2="590" y2="34.0" class="f-plain"/>
  <text x="52.0" y="38.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="60.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">0</text>
  <text x="126.3" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">16</text>
  <text x="192.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">32</text>
  <text x="258.8" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">48</text>
  <text x="325.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">64</text>
  <text x="391.3" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">80</text>
  <text x="457.5" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">96</text>
  <text x="523.8" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">112</text>
  <text x="590.0" y="248.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">128</text>
  <polyline points="93.1,76.8 159.4,64.4 225.6,65.5 291.9,66.5 358.1,52.9 424.4,58.8 490.6,43.5 556.9,58.7" style="fill:none;stroke:var(--muted);stroke-width:1.8"/>
  <text x="596.0" y="62.7" text-anchor="start" class="f-mono f-muted" style="font-size:11px">T=1</text>
  <polyline points="93.1,72.6 159.4,73.4 225.6,63.9 291.9,71.0 358.1,80.4 424.4,85.9 490.6,88.3 556.9,84.8" style="fill:none;stroke:var(--accent);stroke-width:2.2"/>
  <text x="596.0" y="88.8" text-anchor="start" class="f-mono f-accent" style="font-size:11px">люди</text>
  <polyline points="93.1,125.6 159.4,115.0 225.6,125.2 291.9,119.7 358.1,124.6 424.4,129.4 490.6,124.2 556.9,123.2" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="596.0" y="127.2" text-anchor="start" class="f-mono f-ink" style="font-size:11px">k=40</text>
  <polyline points="93.1,167.3 159.4,176.1 225.6,190.7 291.9,208.3 358.1,215.8 424.4,219.3 490.6,222.2 556.9,223.9" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 3"/>
  <text x="596.0" y="227.9" text-anchor="start" class="f-mono f-ink" style="font-size:11px">жадный</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">перплексия, лог. шкала</text>
  <text x="325.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">токенов после начала</text>
</svg>
<figcaption>Перплексия по кускам в 16 токенов, 24 текста. T=1 стартует рядом с людьми и уползает вверх, жадный выбор падает почти до 1.</figcaption>
</figure>

Так что, возможно, 40 не даёт тексту сбиться с пути, а платишь тем, что он намного предсказуемее человеческого. Сама по себе низкая перплексия мало о чём говорит, ниже всех в таблице жадный выбор с 1,8.

## Мой поиск циклов

Первое предположение было, что больше половины жадных текстов закончатся циклом. Скрипт нашёл 9 из 24. Но острова Пасхи среди этих 9 не оказалось. До запуска я ограничил период 24 токенами, а в той фразе их 27. С периодом до 48 находится 18 из 24 и по-прежнему ни одного у настроек со случайным выбором. По записанному критерию предположение провалилось, поэтому привожу оба числа.

## Чего я не проверял

Одна модель, один размер, 24 короткие новости, по одному продолжению на каждую. Интервал для людей от 22,4 до 28,7, для T=1 от 30,0 до 47,0, так что вторая цифра в этих числах мало что значит. Каждое начало открывается строкой с датой, в других жанрах доля за пределами сорока может быть другой. На `<|endoftext|>` я, как и `sample.py`, не останавливался, он выпал 7 раз на все настройки. Оценок от читателей нет. Мне k=40 читать легче, чем T=1, но я и знал, где что.
