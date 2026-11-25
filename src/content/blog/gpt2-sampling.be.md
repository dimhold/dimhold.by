---
title: "У 17% токенаў людзі выходзяць за першыя 40 варыянтаў GPT-2"
description: "У скрыпце GPT-2 напісана, што 40 для top_k звычайна добрае значэнне. Я параўнаў 8 налад сэмплавання з 24 навінамі, якія напісалі людзі. k=40 па прадказальнасці гэта прыкладна тэмпература 0,8, а людзі выходзяць за першыя 40 варыянтаў у 17,2% токенаў."
date: 2019-04-07
lang: be
translationKey: gpt2-sampling
tags: ["llm", "machine-learning", "statistics"]
---

```
The team found that the statues were built in the early 1800s, and that they were built in the early 1900s.
```

Так GPT-2 працягвае навіну пра востраў Пасхі, калі на кожным кроку браць самы імаверны токен, толькі першае "The" яшчэ з артыкула. Разам з пераносамі радка ў гэтай фразе 27 токенаў. Мадэль напісала яе 4 разы запар і на пятым уперлася ў маю мяжу ў 128 токенаў. У першы раз імавернасць усёй фразы была прыкладна 4 да 10^18, у чацвёрты 8,6%.

Што прагны выбар выглядае менавіта так, я ведаў, таму рабіў як напісана ў рэпазіторыі. У `DEVELOPERS.md` (каміт d14501a) ёсць прыклад з `--top_k 40 --temperature 0.7`, а ў апісанні скрыпта сказана "40 generally is a good value". Я скапіраваў 40 і ні разу не спытаў, у параўнанні з чым гэта добра. Параўнаць, здаецца, можна толькі з тэкстам, які напісалі людзі.

Top-k для апавяданняў ёсць у леташнім артыкуле Фан, Льюіса і Дафіна, у іх k было 10. Кача з калегамі ў лістападзе перабралі тэмпературы і пабудавалі крывую, дзе па восях якасць і разнастайнасць. Мне трэба былі толькі лікі для гэтай мадэлі і гэтых 40.

## Што я запускаў

Мадэль GPT-2 117M, іншых памераў OpenAI пакуль не выклала. Чэкпойнт аказаўся звычайным файлам на 497 759 232 байты, унутры float32 у алфавітным парадку імёнаў зменных. Таму я прачытаў яго без TensorFlow і напісаў мадэль на numpy, выйшла радкоў 45. Параметраў у файле 124 439 808, чаму ў назве 117M, я не ведаю. Сэмплаванне паўтарае `sample.py`: спачатку тэмпература, потым top-k.

Тэксты я ўзяў з англійскіх Вікінавін, 24 артыкулы за студзень і першыя дні лютага. Мадэль абвясцілі 14 лютага, у навучальную выбарку гэтыя артыкулы наўрад ці трапілі, хоць праверыць я не магу. Першыя 40 токенаў ідуць як пачатак. Варыянт людзей гэта наступныя 128 токенаў артыкула, мадэль піша свае 128. Выпадковыя лікі ва ўсіх налад адны і тыя ж.

Далей кожны токен, чалавечы ці згенераваны, ацэньвае сама мадэль, без тэмпературы і без абрэзкі. Перплексія гэта экспанента ад сярэдняга адмоўнага лагарыфма імавернасці: 25 значыць, што мадэль здзіўляецца прыкладна як выбару з 25 роўных варыянтаў. Паўтор 4-грамы гэта 4 токены запар, якія ў тым самым працягу ўжо былі. Да запуску я запісаў 5 здагадак.

| налада | перплексія | першы выбар | далей за 40 | паўторы 4-грам |
|---|---|---|---|---|
| людзі | 25,4 | 38,2% | 17,2% | 0,3% |
| T=1 | 36,2 | 35,4% | 22,3% | 0,3% |
| T=0,9 | 18,4 | 41,1% | 13,8% | 0,5% |
| T=0,8 | 9,7 | 50,8% | 6,9% | 1,6% |
| T=0,7 | 6,4 | 59,0% | 4,8% | 6,1% |
| k=40 | 9,6 | 44,2% | 0 | 1,2% |
| k=10 | 6,1 | 52,7% | 0 | 4,6% |
| k=40, T=0,7 | 5,1 | 62,0% | 0 | 8,9% |
| прагны | 1,8 | 100% | 0 | 63,8% |

## 40 гэта прыкладна тэмпература 0,8

Я думаў, што k=40 будзе паводзіць сябе як T=0,9. Па перплексіі выйшла T=0,8, на 24 артыкулах я іх не адрозніваю. У абедзвюх налад яна ў 2,6 раза ніжэйшая, чым у людзей. А ўнутры яны розныя. Пры T=0,8 у палове крокаў бярэцца першы токен спіса і ўсё роўна 213 токенаў з 3072 узятыя далей за саракавое месца. Пры k=40 верх спіса бліжэй да чалавечага, а хваста проста няма.

<figure class="fig">
<svg viewBox="0 0 680 282" role="img" aria-label="Састаўныя палосы з месцамі токенаў у спісе GPT-2 117M: тэкст людзей і 7 налад сэмплавання. людзі: першы выбар 38,2%, месцы з 2 па 10 32,6%, з 11 па 40 12,1%, далей за 40 17,2%, перплексія 25,4; T=1: першы выбар 35,4%, месцы з 2 па 10 30,0%, з 11 па 40 12,2%, далей за 40 22,3%, перплексія 36,2; T=0,9: першы выбар 41,1%, месцы з 2 па 10 33,4%, з 11 па 40 11,7%, далей за 40 13,8%, перплексія 18,4; T=0,8: першы выбар 50,8%, месцы з 2 па 10 33,2%, з 11 па 40 9,1%, далей за 40 6,9%, перплексія 9,7; T=0,7: першы выбар 59,0%, месцы з 2 па 10 31,2%, з 11 па 40 5,0%, далей за 40 4,8%, перплексія 6,4; k=40: першы выбар 44,2%, месцы з 2 па 10 40,5%, з 11 па 40 15,3%, далей за 40 0,0%, перплексія 9,6; k=10: першы выбар 52,7%, месцы з 2 па 10 47,3%, з 11 па 40 0,0%, далей за 40 0,0%, перплексія 6,1; k=40, T=0,7: першы выбар 62,0%, месцы з 2 па 10 31,0%, з 11 па 40 7,0%, далей за 40 0,0%, перплексія 5,1.">
  <rect x="108" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.25;stroke:none"/>
  <text x="125.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">першы выбар</text>
  <rect x="220" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.5;stroke:none"/>
  <text x="237.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">з 2 па 10</text>
  <rect x="318" y="12" width="11" height="11" style="fill:var(--muted);opacity:0.85;stroke:none"/>
  <text x="335.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">з 11 па 40</text>
  <rect x="416" y="12" width="11" height="11" style="fill:var(--accent);stroke:none"/>
  <text x="433.0" y="22.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">далей за 40</text>
  <text x="670.0" y="22.0" text-anchor="end" class="f-mono f-muted" style="font-size:11px">перплексія</text>
  <text x="100.0" y="61.0" text-anchor="end" class="f-mono f-accent" style="font-size:11px">людзі</text>
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
<figcaption>На якім месцы ў спісе самой мадэлі стаяў выбраны токен, долі ад 3072 токенаў у радку. Справа перплексія. У радках з k апошняга кавалка няма, яго адрэзалі.</figcaption>
</figure>

У спалучэння з дакументацыі, 40 і 0,7, перплексія ў 5 разоў ніжэйшая за чалавечую. Паўтораў 4-грам у яго 8,9%, у людзей 0,3%. Ад звычайнага k=40 я чакаў паўтораў як у людзей, атрымалася 37, а ў людзей 8. У першых трох слупках людзі стаяць паміж T=0,9 і T=1. Пра перплексію я так і думаў, з пяці здагадак спраўдзілася толькі гэтая. Але я яшчэ запісаў, што бліжэй за ўсіх да людзей будзе T=1, а гэта няправільна, T=0,9 бліжэй.

## Дзе 40 зашмат і дзе замала

Я чакаў, што людзі выйдуць за першыя 40 прыкладна ў 10% токенаў. Яны выйшлі 528 разоў, гэта 17,2%, ад 9 да 31 раза на артыкул. Мадэль гэта зусім не здзіўляе. Калі на тых самых пазіцыях скласці імавернасць, якую яна аддае ўсяму за межамі сарака, атрымаецца 17,9%.

Пасля "adult penguins, rather" мадэль дае 99,3% токену "than", астатнія 39 месцаў дзеляць паўпрацэнта. Пасля "According to ecologist Chip" мусіць ісці прозвішча і ўсе 40 токенаў разам набіраюць 18,6%. У 11,5% пазіцый у першых сарака больш за 99% імавернасці, у 5,1% менш за палову. Там, дзе мадэль найбольш упэўненая (чвэрць пазіцый), людзі выходзяць за 40 у 3,0% токенаў. У самай няўпэўненай чвэрці такіх 39,8%.

<figure class="fig">
<svg viewBox="0 0 680 256" role="img" aria-label="Гістаграма сумарнай імавернасці 40 верхніх токенаў па 3072 пазіцыях тэксту людзей. ад 0 да 10%: 0; ад 10 да 20%: 1; ад 20 да 30%: 13; ад 30 да 40%: 44; ад 40 да 50%: 98; ад 50 да 60%: 192; ад 60 да 70%: 326; ад 70 да 80%: 489; ад 80 да 90%: 639; ад 90 да 100%: 1270.">
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
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">пазіцый з 3072</text>
  <text x="360.0" y="246.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">імавернасць 40 верхніх токенаў разам, %</text>
</svg>
<figcaption>Колькі імавернасці змяшчаецца ў 40 токенаў на кожнай пазіцыі тэксту людзей. Справа 40 звычайна з запасам, злева гэтага зусім мала.</figcaption>
</figure>

## Колькі каштуе хвост

Тут я ўжо гатовы быў напісаць, што 40 гэта дрэнна, а прадвызначаныя налады, T=1 без абрэзкі, добрыя. Потым я падзяліў 128 токенаў напалам. У першых 64 перплексія T=1 роўная 30,9, у людзей 29,7. У другіх 42,3 супраць 21,7. Другая палова цяжэйшая за першую ў 19 тэкстах T=1 з 24, а ў людзей у 6 з 24.

Найгоршы працяг з 24 атрымаў 297, пры тым што ў самага цяжкага чалавечага артыкула 51. Сам артыкул пра Польшчу. Шосты токен працягу пачынае слова "discotex", у спісе мадэлі ён стаяў на 6318-м месцы. Неўзабаве з'яўляецца Нарэндра Модзі, за ім твіт і "Maryobiot bonus bank". Я тлумачу гэта так: адзін дзіўны токен з хваста застаецца ў кантэксце і ўсё далейшае мусіць ад яго адштурхоўвацца. Правяраць гэта я не стаў. Без гэтага тэксту ў T=1 выходзіць 33,0, а па паловах 28,6 і 38,1. Калі параўноўваць па артыкулах, усё не так ясна: T=1 вышэй за людзей у 14 з 24. У k=40 нічога падобнага няма: 10,0 у першай палове, 9,2 у другой, а ў найгоршага тэксту 13,6.

<figure class="fig">
<svg viewBox="0 0 680 278" role="img" aria-label="Перплексія па кавалках у 16 токенаў, 4 лініі, лагарыфмічная шкала. T=1: ад 25,8 у першым кавалку да 37,9 у апошнім; людзі: ад 28,2 у першым кавалку да 21,8 у апошнім; k=40: ад 9,2 у першым кавалку да 9,6 у апошнім; прагны: ад 3,8 у першым кавалку да 1,1 у апошнім.">
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
  <text x="596.0" y="88.8" text-anchor="start" class="f-mono f-accent" style="font-size:11px">людзі</text>
  <polyline points="93.1,125.6 159.4,115.0 225.6,125.2 291.9,119.7 358.1,124.6 424.4,129.4 490.6,124.2 556.9,123.2" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>
  <text x="596.0" y="127.2" text-anchor="start" class="f-mono f-ink" style="font-size:11px">k=40</text>
  <polyline points="93.1,167.3 159.4,176.1 225.6,190.7 291.9,208.3 358.1,215.8 424.4,219.3 490.6,222.2 556.9,223.9" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 3"/>
  <text x="596.0" y="227.9" text-anchor="start" class="f-mono f-ink" style="font-size:11px">прагны</text>
  <text x="10.0" y="18.0" text-anchor="start" class="f-mono f-muted" style="font-size:11px">перплексія, лаг. шкала</text>
  <text x="325.0" y="268.0" text-anchor="middle" class="f-mono f-muted" style="font-size:11px">токенаў пасля пачатку</text>
</svg>
<figcaption>Перплексія па кавалках у 16 токенаў, 24 тэксты. T=1 пачынае побач з людзьмі і паўзе ўгору, прагны выбар падае амаль да 1.</figcaption>
</figure>

Так што, магчыма, 40 не дае тэксту збіцца са шляху, а плаціш тым, што ён значна больш прадказальны за чалавечы. Сама па сабе нізкая перплексія мала пра што кажа, ніжэй за ўсіх у табліцы прагны выбар з 1,8.

## Мой пошук цыклаў

Першая здагадка была, што больш за палову прагных тэкстаў скончацца цыклам. Скрыпт знайшоў 9 з 24. Але вострава Пасхі сярод гэтых 9 не аказалася. Да запуску я абмежаваў перыяд 24 токенамі, а ў той фразе іх 27. З перыядам да 48 знаходзіцца 18 з 24 і па-ранейшаму ніводнага ў налад з выпадковым выбарам. Паводле запісанага крытэрыю здагадка правалілася, таму прыводжу абодва лікі.

## Чаго я не правяраў

Адна мадэль, адзін памер, 24 кароткія навіны, па адным працягу на кожную. Інтэрвал для людзей ад 22,4 да 28,7, для T=1 ад 30,0 да 47,0, так што другая лічба ў гэтых ліках мала што кажа. Кожны пачатак адкрываецца радком з датай, у іншых жанрах доля за межамі сарака можа быць іншай. На `<|endoftext|>` я, як і `sample.py`, не спыняўся, ён выпаў 7 разоў на ўсе налады. Адзнак ад чытачоў няма. Мне k=40 чытаць лягчэй, чым T=1, але я і ведаў, дзе што.
